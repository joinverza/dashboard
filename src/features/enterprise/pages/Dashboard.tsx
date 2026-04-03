import { useEffect } from 'react';
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  FileCheck, 
  DollarSign, 
  Activity, 
  ArrowRight, 
  Upload, 
  Code, 
  FileText,
  UserPlus,
  ArrowUpRight,
  Loader2
} from "lucide-react";
import { Link } from "wouter";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { toast } from "sonner";
import { useEnterpriseDashboardData } from '@/hooks/useBankingDashboard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(255, 255, 255, 0.05)' },
      ticks: { color: '#9ca3af' }
    },
    x: {
      grid: { display: false },
      ticks: { color: '#9ca3af' }
    }
  },
  interaction: {
    mode: 'nearest' as const,
    axis: 'x' as const,
    intersect: false
  }
};

export default function EnterpriseDashboard() {
  const { stats, recentVerifications, licenseUsage, isLoading, error } = useEnterpriseDashboardData();

  useEffect(() => {
    if (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load enterprise dashboard data");
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Transform stats for chart
  const chartData = {
    labels: stats?.dailyBreakdown?.map((d: { date: string }) => d.date) || [],
    datasets: [
      {
        label: 'Verifications',
        data: stats?.dailyBreakdown?.map((d: { count: number }) => d.count) || [],
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: '#3b82f6',
        tension: 0.4,
      },
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-10"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Enterprise Dashboard</h1>
          <p className="text-muted-foreground">Overview of your verification operations and team performance.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/enterprise/verification/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-glow">
              <FileCheck className="mr-2 h-4 w-4" /> New Verification
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Verifications</CardTitle>
            <FileCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalVerifications.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-verza-emerald flex items-center mr-1"><ArrowUpRight className="h-3 w-3" /> Live</span> from backend totals
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quota Used</CardTitle>
            <DollarSign className="h-4 w-4 text-verza-emerald" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {licenseUsage && licenseUsage.monthlyQuota > 0
                ? `${((licenseUsage.usedQuota / licenseUsage.monthlyQuota) * 100).toFixed(1)}%`
                : "0%"}
            </div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              {licenseUsage?.usedQuota?.toLocaleString() ?? 0} / {licenseUsage?.monthlyQuota?.toLocaleString() ?? 0} monthly requests
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Code className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pending || 0}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              Requires attention
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed/Rejected</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.rejected || 0}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              {(stats && stats.totalVerifications > 0) ? ((stats.rejected / stats.totalVerifications) * 100).toFixed(1) : 0}% rejection rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Usage Chart */}
        <Card className="lg:col-span-2 bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Verification Volume</CardTitle>
            <CardDescription>Daily verification requests over the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {chartData.labels.length > 0 ? (
              <div className="h-[300px] w-full">
                <Line options={chartOptions} data={chartData} />
              </div>
            ) : (
              <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground text-sm">
                No volume data available
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Link href="/enterprise/bulk">
                <Button variant="outline" className="w-full h-24 flex flex-col gap-2 hover:border-blue-500/50 hover:bg-blue-500/5">
                  <Upload className="h-6 w-6 text-blue-500" />
                  <span>Bulk Upload</span>
                </Button>
              </Link>
              <Link href="/enterprise/api">
                <Button variant="outline" className="w-full h-24 flex flex-col gap-2 hover:border-purple-500/50 hover:bg-purple-500/5">
                  <Code className="h-6 w-6 text-purple-500" />
                  <span>API Access</span>
                </Button>
              </Link>
              <Link href="/enterprise/compliance/workflows">
                <Button variant="outline" className="w-full h-24 flex flex-col gap-2 hover:border-verza-emerald/50 hover:bg-verza-emerald/5">
                  <FileText className="h-6 w-6 text-verza-emerald" />
                  <span>Case Workflows</span>
                </Button>
              </Link>
              <Link href="/enterprise/team/invite">
                <Button variant="outline" className="w-full h-24 flex flex-col gap-2 hover:border-orange-500/50 hover:bg-orange-500/5">
                  <UserPlus className="h-6 w-6 text-orange-500" />
                  <span>Invite Team</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-600/20 to-transparent border-blue-600/30">
            <CardContent className="pt-6">
               <div className="flex flex-col gap-2">
                 <h3 className="font-bold text-lg">{licenseUsage?.planName ?? "Enterprise"} Plan</h3>
                 <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-verza-emerald animate-pulse"></div>
                    <span className="text-sm text-muted-foreground">SLA uptime {licenseUsage?.slaUptime?.toFixed(2) ?? "99.90"}%</span>
                 </div>
                 <p className="text-xs text-muted-foreground mt-2">
                   Last data refresh: {recentVerifications[0]?.updatedAt ? new Date(recentVerifications[0].updatedAt).toLocaleString() : "N/A"}
                 </p>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Verifications */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Verifications</CardTitle>
          <Link href="/enterprise/requests">
            <Button variant="ghost" size="sm" className="text-blue-500">View All <ArrowRight className="ml-1 h-4 w-4" /></Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentVerifications.length > 0 ? recentVerifications.map((req) => (
              <div key={req.verificationId} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-border/50 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-blue-500/10 text-blue-500 mt-1">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium capitalize">{req.type.replace('_', ' ')}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span className="font-mono text-xs">{req.verificationId}</span>
                      <span>•</span>
                      <span>{new Date(req.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 justify-between md:justify-end w-full md:w-auto">
                  <Badge variant={req.status === 'verified' ? 'default' : req.status === 'rejected' ? 'destructive' : 'secondary'}>
                    {req.status}
                  </Badge>
                  <Link href={`/enterprise/requests/${req.verificationId}`}>
                    <Button variant="outline" size="sm">Details</Button>
                  </Link>
                </div>
              </div>
            )) : (
              <p className="text-center text-muted-foreground py-4">No recent verifications found.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
