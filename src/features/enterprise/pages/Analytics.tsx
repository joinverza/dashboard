import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle,
  Download,
  Loader2,
  TrendingUp,
  Users,
} from 'lucide-react';
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
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEnterpriseAnalyticsData } from '@/hooks/useBankingDashboard';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function EnterpriseAnalytics() {
  const [timeRange, setTimeRange] = useState('30d');
  const { data, isLoading, error } = useEnterpriseAnalyticsData(timeRange);

  useEffect(() => {
    if (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch verification analytics');
    }
  }, [error]);

  const stats = data?.stats;
  const successRate = stats && stats.totalVerifications > 0 ? ((stats.approved / stats.totalVerifications) * 100).toFixed(1) : '0.0';
  const avgTurnaroundDays = stats ? (stats.averageTime / 86400).toFixed(1) : '0.0';
  const volumeChartData = useMemo(
    () => ({
      labels: stats?.dailyBreakdown.map((item) => new Date(item.date).toLocaleDateString()) ?? [],
      datasets: [
        {
          label: 'Verification volume',
          data: stats?.dailyBreakdown.map((item) => item.count) ?? [],
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.12)',
          fill: true,
          tension: 0.35,
        },
      ],
    }),
    [stats],
  );
  const statusChartData = useMemo(
    () => ({
      labels: ['Approved', 'Rejected', 'Pending'],
      datasets: [
        {
          data: [stats?.approved ?? 0, stats?.rejected ?? 0, stats?.pending ?? 0],
          backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
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
          label: 'Risk distribution',
          data: data?.riskDistribution.map((item) => item.count) ?? [],
          backgroundColor: ['#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'],
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
          label: 'Average seconds',
          data: data?.processingTimes.map((item) => item.averageSeconds) ?? [],
          backgroundColor: 'rgba(16, 185, 129, 0.7)',
          borderColor: '#10b981',
        },
      ],
    }),
    [data?.processingTimes],
  );

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Live verification, risk, compliance, and geography metrics.</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Verifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalVerifications.toLocaleString() || 0}</div>
              <div className="flex items-center text-xs text-emerald-500 mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" /> Live request volume
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{successRate}%</div>
              <div className="flex items-center text-xs text-emerald-500 mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" /> Approved / total
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Turnaround</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgTurnaroundDays} days</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <ArrowDownRight className="h-3 w-3 mr-1" /> From processing-time metrics
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.pending.toLocaleString() || 0}</div>
              <div className="flex items-center text-xs text-yellow-500 mt-1">Awaiting action</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Verification Volume</CardTitle>
                <CardDescription>Daily verification requests for the selected period.</CardDescription>
              </CardHeader>
              <CardContent className="h-[320px]">
                <Line data={volumeChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Verification Status Distribution</CardTitle>
                <CardDescription>Approved, rejected, and pending outcomes.</CardDescription>
              </CardHeader>
              <CardContent className="h-[320px]">
                <Doughnut data={statusChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
                <CardDescription>Current workload mix by risk bucket.</CardDescription>
              </CardHeader>
              <CardContent className="h-[360px]">
                {riskChartData.labels.length > 0 ? (
                  <Bar data={riskChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <TrendingUp className="h-10 w-10 mr-3" />
                    No risk analytics available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Processing Times</CardTitle>
                <CardDescription>Average service completion time for the selected range.</CardDescription>
              </CardHeader>
              <CardContent className="h-[360px]">
                {processingChartData.labels.length > 0 ? (
                  <Bar data={processingChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    <BarChart3 className="h-10 w-10 mr-3" />
                    No processing data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {data?.complianceMetrics.slice(0, 4).map((metric) => (
              <Card key={metric.label} className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{metric.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value.toLocaleString()}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="demographics">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Regional spread of verification volume.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data?.geoDistribution.length ? (
                data.geoDistribution.map((item) => (
                  <div key={item.region} className="flex items-center gap-3">
                    <div className="w-32 font-medium text-sm">{item.region}</div>
                    <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${item.percentage}%` }} />
                    </div>
                    <div className="w-12 text-right text-sm text-muted-foreground">{item.percentage}%</div>
                  </div>
                ))
              ) : (
                <div className="h-[240px] flex items-center justify-center text-muted-foreground">
                  <Users className="h-10 w-10 mr-3" />
                  No geography data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Fraud Signals</CardTitle>
          <CardDescription>Latest fraud and anomaly indicators returned by the analytics API.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {data?.fraudTrends.length ? (
            data.fraudTrends.map((item) => (
              <div key={`${item.period}-${item.count}`} className="flex items-center justify-between rounded-xl border p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-verza-emerald" />
                  <span>{item.period}</span>
                </div>
                <span className="font-semibold">{item.count.toLocaleString()}</span>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">No fraud trends available for this range.</div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
