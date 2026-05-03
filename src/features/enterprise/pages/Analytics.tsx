import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle,
  Download,
  Loader2,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEnterpriseAnalyticsData } from "@/hooks/useBankingDashboard";
import { useAuth } from "@/features/auth/AuthContext";
import BackButton from "@/components/shared/BackButton";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export default function EnterpriseAnalytics() {
  const { hasPermission, permissions, user } = useAuth();
  const [timeRange, setTimeRange] = useState("30d");
  const { data, isLoading, error } = useEnterpriseAnalyticsData(timeRange);

  useEffect(() => {
    if (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to fetch verification analytics",
      );
    }
  }, [error]);

  const stats = data?.stats;
  const successRate =
    stats && stats.totalVerifications > 0
      ? ((stats.approved / stats.totalVerifications) * 100).toFixed(1)
      : "0.0";
  const avgTurnaroundDays = stats
    ? (stats.averageTime / 86400).toFixed(1)
    : "0.0";
  const volumeChartData = useMemo(
    () => ({
      labels:
        stats?.dailyBreakdown.map((item) =>
          new Date(item.date).toLocaleDateString(),
        ) ?? [],
      datasets: [
        {
          label: "Verification volume",
          data: stats?.dailyBreakdown.map((item) => item.count) ?? [],
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.12)",
          fill: true,
          tension: 0.35,
        },
      ],
    }),
    [stats],
  );
  const statusChartData = useMemo(
    () => ({
      labels: ["Approved", "Rejected", "Pending"],
      datasets: [
        {
          data: [
            stats?.approved ?? 0,
            stats?.rejected ?? 0,
            stats?.pending ?? 0,
          ],
          backgroundColor: ["#1ED760", "#ef4444", "#f59e0b"],
        },
      ],
    }),
    [stats],
  );
  const riskChartData = useMemo(
    () => ({
      labels: data?.riskDistribution.map((item) => item.bucket) ?? [],
      datasets: [
        {
          label: "Risk distribution",
          data: data?.riskDistribution.map((item) => item.count) ?? [],
          backgroundColor: ["#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"],
        },
      ],
    }),
    [data?.riskDistribution],
  );
  const processingChartData = useMemo(
    () => ({
      labels: data?.processingTimes.map((item) => item.period) ?? [],
      datasets: [
        {
          label: "Average seconds",
          data: data?.processingTimes.map((item) => item.averageSeconds) ?? [],
          backgroundColor: "rgba(16, 185, 129, 0.7)",
          borderColor: "#1ED760",
        },
      ],
    }),
    [data?.processingTimes],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <BackButton to="/enterprise/reports" label="Back to Reports" />
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Live verification, risk, compliance, and geography metrics.
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px] bg-ent-muted border-ent-border text-ent-text">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent className="bg-ent-card border-ent-border text-ent-text">
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="border-ent-border bg-ent-text/10 text-ent-text hover:bg-ent-text/10"
          >
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-4">
          <div className="enterprise-card rounded-2xl p-6">
            <p className="text-[11px] uppercase tracking-[0.18em] text-verza-gray/80 font-medium">
              Total Verifications
            </p>
            <div className="mt-3 text-3xl font-semibold tracking-tight text-ent-text">
              {stats?.totalVerifications.toLocaleString() || 0}
            </div>
            <div className="flex items-center text-[11px] text-verza-emerald mt-3 font-medium">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +12.5% vs last period
            </div>
          </div>
          <div className="enterprise-card rounded-2xl p-6">
            <p className="text-[11px] uppercase tracking-[0.18em] text-verza-gray/80 font-medium">
              Success Rate
            </p>
            <div className="mt-3 text-3xl font-semibold tracking-tight text-ent-text">
              {successRate}%
            </div>
            <div className="flex items-center text-[11px] text-verza-emerald mt-3 font-medium">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +0.2% improvement
            </div>
          </div>
          <div className="enterprise-card rounded-2xl p-6">
            <p className="text-[11px] uppercase tracking-[0.18em] text-verza-gray/80 font-medium">
              Avg. Turnaround
            </p>
            <div className="mt-3 text-3xl font-semibold tracking-tight text-ent-text">
              {avgTurnaroundDays}d
            </div>
            <div className="flex items-center text-[11px] text-verza-gray/60 mt-3 font-medium">
              <ArrowDownRight className="h-3 w-3 mr-1" /> -4.1% reduction
            </div>
          </div>
          <div className="enterprise-card rounded-2xl p-6">
            <p className="text-[11px] uppercase tracking-[0.18em] text-verza-gray/80 font-medium">
              Pending Requests
            </p>
            <div className="mt-3 text-3xl font-semibold tracking-tight text-ent-text">
              {stats?.pending.toLocaleString() || 0}
            </div>
            <div className="flex items-center text-[11px] text-yellow-500 mt-3 font-medium">
              Requires immediate action
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-ent-muted border border-ent-border p-1 rounded-xl">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-verza-emerald data-[state=active]:text-[#06140F]"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="performance"
            className="data-[state=active]:bg-verza-emerald data-[state=active]:text-[#06140F]"
          >
            Performance
          </TabsTrigger>
          <TabsTrigger
            value="demographics"
            className="data-[state=active]:bg-verza-emerald data-[state=active]:text-[#06140F]"
          >
            Demographics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="enterprise-card rounded-2xl p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-ent-text">
                  Verification Volume
                </h3>
                <p className="text-sm text-verza-gray mt-1">
                  Daily verification requests for the selected period.
                </p>
              </div>
              <div className="h-[320px]">
                <Line
                  data={volumeChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        grid: { color: "rgba(255,255,255,0.05)" },
                        ticks: { color: "rgba(255,255,255,0.4)" },
                      },
                      x: {
                        grid: { display: false },
                        ticks: { color: "rgba(255,255,255,0.4)" },
                      },
                    },
                  }}
                />
              </div>
            </div>

            <div className="enterprise-card rounded-2xl p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-ent-text">
                  Status Distribution
                </h3>
                <p className="text-sm text-verza-gray mt-1">
                  Approved, rejected, and pending outcomes.
                </p>
              </div>
              <div className="h-[320px]">
                <Doughnut
                  data={statusChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { labels: { color: "rgba(255,255,255,0.6)" } },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="enterprise-card rounded-2xl p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-ent-text">
                  Risk Distribution
                </h3>
                <p className="text-sm text-verza-gray mt-1">
                  Current workload mix by risk bucket.
                </p>
              </div>
              <div className="h-[360px]">
                {riskChartData.labels.length > 0 ? (
                  <Bar
                    data={riskChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          grid: { color: "rgba(255,255,255,0.05)" },
                          ticks: { color: "rgba(255,255,255,0.4)" },
                        },
                        x: {
                          grid: { display: false },
                          ticks: { color: "rgba(255,255,255,0.4)" },
                        },
                      },
                    }}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-verza-gray/40">
                    <TrendingUp className="h-10 w-10 mr-3" />
                    No risk analytics available
                  </div>
                )}
              </div>
            </div>

            <div className="enterprise-card rounded-2xl p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-ent-text">
                  Processing Times
                </h3>
                <p className="text-sm text-verza-gray mt-1">
                  Average service completion time for the selected range.
                </p>
              </div>
              <div className="h-[360px]">
                {processingChartData.labels.length > 0 ? (
                  <Bar
                    data={processingChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          grid: { color: "rgba(255,255,255,0.05)" },
                          ticks: { color: "rgba(255,255,255,0.4)" },
                        },
                        x: {
                          grid: { display: false },
                          ticks: { color: "rgba(255,255,255,0.4)" },
                        },
                      },
                    }}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-verza-gray/40">
                    <BarChart3 className="h-10 w-10 mr-3" />
                    No processing data available
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {data?.complianceMetrics.slice(0, 4).map((metric) => (
              <div
                key={metric.label}
                className="enterprise-card rounded-2xl p-6"
              >
                <p className="text-[11px] uppercase tracking-[0.18em] text-verza-gray/80 font-medium">
                  {metric.label}
                </p>
                <div className="mt-3 text-2xl font-bold text-ent-text">
                  {metric.value.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="demographics">
          <div className="enterprise-card rounded-2xl p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-ent-text">
                Geographic Distribution
              </h3>
              <p className="text-sm text-verza-gray mt-1">
                Regional spread of verification volume.
              </p>
            </div>
            <div className="space-y-4">
              {data?.geoDistribution.length ? (
                data.geoDistribution.map((item) => (
                  <div key={item.region} className="flex items-center gap-4">
                    <div className="w-32 font-medium text-sm text-ent-text">
                      {item.region}
                    </div>
                    <div className="flex-1 h-2 rounded-full bg-ent-text/10 overflow-hidden">
                      <div
                        className="h-full bg-verza-emerald"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <div className="w-12 text-right text-xs text-verza-gray font-mono">
                      {item.percentage}%
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-[240px] flex items-center justify-center text-verza-gray/40">
                  <Users className="h-10 w-10 mr-3" />
                  No geography data available
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="enterprise-card rounded-2xl p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-ent-text">Fraud Signals</h3>
          <p className="text-sm text-verza-gray mt-1">
            Latest fraud and anomaly indicators returned by the analytics API.
          </p>
        </div>
        <div className="space-y-3">
          {data?.fraudTrends.length ? (
            data.fraudTrends.map((item) => (
              <div
                key={`${item.period}-${item.count}`}
                className="flex items-center justify-between rounded-xl border border-ent-border bg-ent-muted p-4 hover:bg-ent-card transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-verza-emerald" />
                  <span className="text-ent-text font-medium">
                    {item.period}
                  </span>
                </div>
                <span className="font-mono text-verza-emerald font-bold">
                  {item.count.toLocaleString()}
                </span>
              </div>
            ))
          ) : (
            <div className="text-sm text-verza-gray/40 py-4 text-center">
              No fraud trends available for this range.
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
