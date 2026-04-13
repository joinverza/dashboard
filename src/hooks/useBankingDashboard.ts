import { useQueries, useQuery } from '@tanstack/react-query';
import { bankingService } from '@/services/bankingService';
import type {
  DashboardNotification,
  GeoDistributionItem,
  ProcessingTimePoint,
  SystemHealthService,
  VerificationRequestResponse,
  VerificationStatsResponse,
  VerifierProfile,
} from '@/types/banking';

const isForbiddenError = (error: unknown): boolean => {
  if (typeof error === 'object' && error !== null && 'status' in error) {
    return (error as { status?: unknown }).status === 403;
  }
  return error instanceof Error && error.message.includes('403');
};

const queryKeys = {
  userDashboard: ['banking', 'dashboard', 'user'] as const,
  verifierDashboard: ['banking', 'dashboard', 'verifier'] as const,
  enterpriseDashboard: ['banking', 'dashboard', 'enterprise'] as const,
  adminDashboard: ['banking', 'dashboard', 'admin'] as const,
  enterpriseAnalytics: (range: string) => ['banking', 'analytics', 'enterprise', range] as const,
  systemMonitor: ['banking', 'system-monitor'] as const,
  apiManagementOverview: ['banking', 'api-management', 'overview'] as const,
};

export const useUserDashboardData = () => {
  const results = useQueries({
    queries: [
      {
        queryKey: [...queryKeys.userDashboard, 'verifications'],
        queryFn: () => bankingService.getVerificationRequests({ limit: 200 }),
        staleTime: 30_000,
        refetchInterval: 30_000,
      },
      {
        queryKey: [...queryKeys.userDashboard, 'wallet'],
        queryFn: () => bankingService.getUserWalletOverview(),
        staleTime: 60_000,
        refetchInterval: 60_000,
      },
      {
        queryKey: [...queryKeys.userDashboard, 'notifications'],
        queryFn: () => bankingService.getNotifications({ limit: 8 }),
        staleTime: 20_000,
        refetchInterval: 20_000,
      },
    ],
  });

  const [verificationsQuery, walletQuery, notificationsQuery] = results;
  const verifications = (verificationsQuery.data ?? []) as VerificationRequestResponse[];
  const notifications = (notificationsQuery.data ?? []) as DashboardNotification[];
  const wallet = walletQuery.data;

  return {
    verifications,
    notifications,
    wallet,
    isLoading: results.some((result) => result.isLoading),
    isFetching: results.some((result) => result.isFetching),
    error: results.find((result) => result.error)?.error ?? null,
    refresh: async () => {
      await Promise.all(results.map((result) => result.refetch()));
    },
  };
};

export const useVerifierDashboardData = (enabled = true) => {
  const results = useQueries({
    queries: [
      {
        queryKey: [...queryKeys.verifierDashboard, 'stats'],
        queryFn: () => bankingService.getVerificationStats(),
        staleTime: 30_000,
        refetchInterval: 30_000,
        enabled,
      },
      {
        queryKey: [...queryKeys.verifierDashboard, 'requests'],
        queryFn: () => bankingService.getVerificationRequests({ limit: 25 }),
        staleTime: 30_000,
        refetchInterval: 30_000,
        enabled,
      },
      {
        queryKey: [...queryKeys.verifierDashboard, 'profile'],
        queryFn: () => bankingService.getVerifierProfile(),
        staleTime: 60_000,
        refetchInterval: 60_000,
        enabled,
      },
    ],
  });

  const [statsQuery, requestsQuery, profileQuery] = results;
  const stats = statsQuery.data as VerificationStatsResponse | undefined;
  const requests = (requestsQuery.data ?? []) as VerificationRequestResponse[];
  const profile = profileQuery.data as VerifierProfile | undefined;
  const activeJobs = requests.filter((item) => ['pending', 'review_needed', 'in_progress'].includes(item.status)).slice(0, 5);

  return {
    stats,
    requests,
    activeJobs,
    profile,
    isLoading: results.some((result) => result.isLoading),
    isFetching: results.some((result) => result.isFetching),
    error: results.find((result) => result.error)?.error ?? null,
    refresh: async () => {
      await Promise.all(results.map((result) => result.refetch()));
    },
  };
};

export const useEnterpriseDashboardData = () => {
  const results = useQueries({
    queries: [
      {
        queryKey: [...queryKeys.enterpriseDashboard, 'stats'],
        queryFn: () => bankingService.getVerificationStats(),
        staleTime: 30_000,
        refetchInterval: 30_000,
      },
      {
        queryKey: [...queryKeys.enterpriseDashboard, 'requests'],
        queryFn: () => bankingService.getVerificationRequests({ limit: 8 }),
        staleTime: 30_000,
        refetchInterval: 30_000,
      },
      {
        queryKey: [...queryKeys.enterpriseDashboard, 'license'],
        queryFn: () => bankingService.getLicenseUsageMetrics(),
        staleTime: 60_000,
        refetchInterval: 60_000,
      },
    ],
  });

  return {
    stats: results[0].data as VerificationStatsResponse | undefined,
    recentVerifications: (results[1].data ?? []) as VerificationRequestResponse[],
    licenseUsage: results[2].data,
    isLoading: results.some((result) => result.isLoading),
    isFetching: results.some((result) => result.isFetching),
    error: results.find((result) => result.error)?.error ?? null,
    refresh: async () => {
      await Promise.all(results.map((result) => result.refetch()));
    },
  };
};

export const useAdminDashboardData = () => {
  const results = useQueries({
    queries: [
      {
        queryKey: [...queryKeys.adminDashboard, 'stats'],
        queryFn: async () => {
          try {
            return await bankingService.getVerificationStats();
          } catch (error) {
            if (isForbiddenError(error)) {
              return {
                totalVerifications: 0,
                approved: 0,
                rejected: 0,
                pending: 0,
                averageTime: 0,
                successful: 0,
                failed: 0,
                dailyBreakdown: [],
              } satisfies VerificationStatsResponse;
            }
            throw error;
          }
        },
        staleTime: 30_000,
        refetchInterval: 30_000,
      },
      {
        queryKey: [...queryKeys.adminDashboard, 'users'],
        queryFn: () => bankingService.getUsers({ role: 'verifier', status: 'active' }),
        staleTime: 60_000,
        refetchInterval: 60_000,
      },
      {
        queryKey: [...queryKeys.adminDashboard, 'health'],
        queryFn: () => bankingService.getSystemHealth(),
        staleTime: 20_000,
        refetchInterval: 20_000,
      },
      {
        queryKey: [...queryKeys.adminDashboard, 'alerts'],
        queryFn: () => bankingService.getRecentAlerts(),
        staleTime: 20_000,
        refetchInterval: 20_000,
      },
      {
        queryKey: [...queryKeys.adminDashboard, 'geo'],
        queryFn: async () => {
          try {
            return await bankingService.getGeoDistribution();
          } catch (error) {
            if (isForbiddenError(error)) {
              return [] as GeoDistributionItem[];
            }
            throw error;
          }
        },
        staleTime: 60_000,
        refetchInterval: 60_000,
      },
    ],
  });

  return {
    stats: results[0].data as VerificationStatsResponse | undefined,
    activeVerifiers: Array.isArray(results[1].data) ? results[1].data.length : 0,
    systemHealth: (results[2].data ?? []) as SystemHealthService[],
    recentAlerts: (results[3].data ?? []) as DashboardNotification[],
    geoDistribution: (results[4].data ?? []) as GeoDistributionItem[],
    isLoading: results.some((result) => result.isLoading),
    isFetching: results.some((result) => result.isFetching),
    error: results.find((result) => result.error)?.error ?? null,
    refresh: async () => {
      await Promise.all(results.map((result) => result.refetch()));
    },
  };
};

export const useEnterpriseAnalyticsData = (range: string) => {
  return useQuery({
    queryKey: queryKeys.enterpriseAnalytics(range),
    queryFn: async () => {
      const [stats, fraudTrends, riskDistribution, complianceMetrics, geoDistribution, processingTimes] = await Promise.all([
        bankingService.getVerificationStats(),
        bankingService.getFraudTrends({ range }),
        bankingService.getRiskDistribution({ range }),
        bankingService.getComplianceMetrics({ range }),
        bankingService.getGeoDistribution(),
        bankingService.getProcessingTimes({ range }),
      ]);
      return {
        stats,
        fraudTrends,
        riskDistribution,
        complianceMetrics,
        geoDistribution,
        processingTimes,
      };
    },
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
};

export const useSystemMonitorData = () => {
  return useQuery({
    queryKey: queryKeys.systemMonitor,
    queryFn: async () => {
      const [health, alerts, stats, primitiveHealth, modelStatus, processingTimes] = await Promise.all([
        bankingService.getSystemHealth(),
        bankingService.getRecentAlerts(),
        bankingService.getVerificationStats(),
        bankingService.getPrimitiveHealth().catch(() => null),
        bankingService.getPrimitiveModelStatus().catch(() => null),
        bankingService.getProcessingTimes({ range: '24h' }).catch(() => [] as ProcessingTimePoint[]),
      ]);
      return {
        health,
        alerts,
        stats,
        primitiveHealth,
        modelStatus,
        processingTimes,
      };
    },
    staleTime: 15_000,
    refetchInterval: 15_000,
  });
};

export const useApiManagementOverview = () => {
  return useQuery({
    queryKey: queryKeys.apiManagementOverview,
    queryFn: async () => {
      const [licenseUsage, apiKeys, webhooks] = await Promise.all([
        bankingService.getLicenseUsageMetrics(),
        bankingService.listApiKeys(),
        bankingService.listWebhooks(),
      ]);
      return {
        licenseUsage,
        apiKeys,
        webhooks,
      };
    },
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
};
