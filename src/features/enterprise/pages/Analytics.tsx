import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Users, CheckCircle, 
  Download, ArrowUpRight, ArrowDownRight, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { bankingService } from '@/services/bankingService';
import type { VerificationStatsResponse } from '@/types/banking';

export default function EnterpriseAnalytics() {
  const [timeRange, setTimeRange] = useState('30d');
  const [stats, setStats] = useState<VerificationStatsResponse | null>(null);
  // const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const [statsData] = await Promise.all([
          bankingService.getVerificationStats(),
          // bankingService.getAnalytics(timeRange)
        ]);
        setStats(statsData);
        // setAnalytics(analyticsData);
      } catch (error) {
        console.error("Failed to fetch verification stats", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [timeRange]);

  const successRate = stats && stats.totalVerifications > 0 
    ? ((stats.approved / stats.totalVerifications) * 100).toFixed(1) 
    : "0.0";

  const avgTurnaroundDays = stats 
    ? (stats.averageTime / 86400).toFixed(1) // Convert seconds to days
    : "0.0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Detailed insights into your verification performance and usage.</p>
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
                <ArrowUpRight className="h-3 w-3 mr-1" /> +12.5% from last month
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
                <ArrowUpRight className="h-3 w-3 mr-1" /> +0.4% from last month
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Turnaround</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgTurnaroundDays} days</div>
              <div className="flex items-center text-xs text-emerald-500 mt-1">
                <ArrowDownRight className="h-3 w-3 mr-1" /> -0.3 days from last month
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.pending.toLocaleString() || 0}</div>
              <div className="flex items-center text-xs text-yellow-500 mt-1">
                Awaiting action
              </div>
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
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Verification Volume</CardTitle>
                <CardDescription>Daily verification requests over the last 30 days.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                <div className="flex flex-col items-center text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mb-2 opacity-50" />
                  <p>Chart Visualization Placeholder</p>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Verification Status Distribution</CardTitle>
                <CardDescription>Breakdown of verification outcomes.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md">
                <div className="flex flex-col items-center text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mb-2 opacity-50" />
                  <p>Chart Visualization Placeholder</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
            <Card>
                <CardHeader>
                    <CardTitle>Verifier Performance</CardTitle>
                    <CardDescription>Average response times and quality scores by verifier.</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md">
                    <div className="flex flex-col items-center text-muted-foreground">
                        <TrendingUp className="h-12 w-12 mb-2 opacity-50" />
                        <p>Performance Metrics Placeholder</p>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="demographics">
            <Card>
                <CardHeader>
                    <CardTitle>User Demographics</CardTitle>
                    <CardDescription>Location and industry breakdown of verified users.</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center bg-muted/20 rounded-md">
                    <div className="flex flex-col items-center text-muted-foreground">
                        <Users className="h-12 w-12 mb-2 opacity-50" />
                        <p>Demographics Map Placeholder</p>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
