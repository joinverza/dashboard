import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useAuth } from "@/features/auth/AuthContext";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivityFeed from "@/components/dashboard/RecentActivityFeed";
import VerificationStatusTracker from "@/components/dashboard/VerificationStatusTracker";
import RecommendedVerifiersCarousel from "@/components/dashboard/RecommendedVerifiersCarousel";
import MetricCard from "@/components/dashboard/MetricCard";
import { FileCheck, Clock, CreditCard } from "lucide-react";
import { bankingService } from "@/services/bankingService";
import { toast } from "sonner";
import type { VerificationRequestResponse } from "@/types/banking";

export default function Dashboard() {
  const { user } = useAuth();
  const metricsRef = useRef<HTMLDivElement>(null);
  const [verifications, setVerifications] = useState<VerificationRequestResponse[]>([]);
  const [wallet, setWallet] = useState<{ totalSpent: number; currency: string }>({ totalSpent: 0, currency: "USD" });
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);

  const metrics = useMemo(() => {
    const verifiedCount = verifications.filter((item) => item.status === "verified").length;
    const pendingCount = verifications.filter((item) =>
      item.status === "pending" || item.status === "in_progress" || item.status === "review_needed" || item.status === "requires_action"
    ).length;
    return [
      {
        id: "1",
        label: "Verified Credentials",
        value: String(verifiedCount),
        percentChange: 0,
        isPositive: true,
        icon: "check-circle",
        customIcon: FileCheck,
      },
      {
        id: "2",
        label: "Pending Verifications",
        value: String(pendingCount),
        percentChange: 0,
        isPositive: true,
        icon: "clock",
        customIcon: Clock,
      },
      {
        id: "3",
        label: "Total Spent",
        value: `${wallet.totalSpent.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${wallet.currency}`,
        percentChange: 0,
        isPositive: false,
        icon: "credit-card",
        customIcon: CreditCard,
      },
    ];
  }, [verifications, wallet.currency, wallet.totalSpent]);

  useEffect(() => {
    let isMounted = true;
    const loadDashboardMetrics = async () => {
      setIsLoadingMetrics(true);
      try {
        const [verificationData, walletData] = await Promise.all([
          bankingService.getUserVerifications({ limit: 200 }),
          bankingService.getUserWalletOverview(),
        ]);
        if (!isMounted) return;
        setVerifications(verificationData);
        setWallet({ totalSpent: walletData.totalSpent, currency: walletData.currency });
      } catch {
        if (isMounted) {
          toast.error("Unable to load live dashboard metrics.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingMetrics(false);
        }
      }
    };
    void loadDashboardMetrics();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (metricsRef.current && !isLoadingMetrics) {
      const cards = metricsRef.current.querySelectorAll(
        '[data-testid^="metric-card"]'
      );
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    }
  }, [isLoadingMetrics]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-7xl mx-auto"
      data-testid="page-dashboard"
    >
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, <span className="text-[#00FF87]">{user?.name || "User"}</span>
          </h1>
          <p className="text-gray-400 mt-1">Here's what's happening with your credentials today.</p>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              System Status: <span className="text-[#00FF87] font-medium">Operational</span>
           </span>
        </div>
      </div>

      <QuickActions />

      {/* Stats Overview */}
      <div
        ref={metricsRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {metrics.map((metric, index) => (
          <MetricCard key={metric.id} metric={metric} index={index} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <VerificationStatusTracker />
          <RecommendedVerifiersCarousel />
        </div>

        {/* Sidebar Area */}
        <div className="lg:col-span-1">
          <RecentActivityFeed />
        </div>
      </div>
    </motion.div>
  );
}
