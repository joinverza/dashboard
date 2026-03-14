import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  Award, 
  Briefcase, 
  CheckCircle, 
  ArrowRight, 
  Clock, 
  FileText, 
  Activity,
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
import { useState, useEffect } from "react";
import { bankingService } from "@/services/bankingService";
import type { VerificationStatsResponse, VerificationRequestResponse } from "@/types/banking";
import { toast } from "sonner";

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

export default function VerifierDashboard() {
  const [stats, setStats] = useState<VerificationStatsResponse | null>(null);
  const [activeJobs, setActiveJobs] = useState<VerificationRequestResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [statsData, requestsData] = await Promise.all([
          bankingService.getVerificationStats(),
          bankingService.getVerificationRequests()
        ]);
        setStats(statsData);
        // Filter for active jobs (mock logic: pending/review_needed)
        const active = requestsData.filter(r => ['pending', 'review_needed'].includes(r.status)).slice(0, 3);
        setActiveJobs(active);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getTypeLabel = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const chartData = {
    labels: stats?.dailyBreakdown?.map(d => new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })) || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Earnings',
        data: stats?.dailyBreakdown?.map(d => d.count * 15) || [150, 230, 180, 320, 290, 140, 380], // Estimated $15 per verification
        fill: true,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderColor: '#10b981',
        tension: 0.4,
      },
    ],
  };

  const estimatedEarnings = (stats?.successful || 0) * 15;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-10"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your verification activity and earnings.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/verifier/jobs">
            <Button className="bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow">
              <Briefcase className="mr-2 h-4 w-4" /> Find New Jobs
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-verza-emerald" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${estimatedEarnings.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-verza-emerald flex items-center mr-1"><ArrowUpRight className="h-3 w-3" /> +12%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reputation Score</CardTitle>
            <Award className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98/100</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              Top 5% of verifiers
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pending || 0}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              Pending review
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.successful || 0}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              Successful verifications
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earnings Chart */}
        <Card className="lg:col-span-2 bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Earnings Trend</CardTitle>
            <CardDescription>Your earnings over the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <Line options={chartOptions} data={chartData} />
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Actions / Recent */}
        <div className="space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Link href="/verifier/jobs">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2 hover:border-verza-emerald/50 hover:bg-verza-emerald/5">
                  <Briefcase className="h-5 w-5 text-verza-emerald" />
                  <span>Browse Jobs</span>
                </Button>
              </Link>
              <Link href="/verifier/withdraw">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2 hover:border-verza-emerald/50 hover:bg-verza-emerald/5">
                  <DollarSign className="h-5 w-5 text-verza-emerald" />
                  <span>Withdraw</span>
                </Button>
              </Link>
              <Link href="/verifier/analytics">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2 hover:border-verza-emerald/50 hover:bg-verza-emerald/5">
                  <Activity className="h-5 w-5 text-verza-emerald" />
                  <span>Analytics</span>
                </Button>
              </Link>
              <Link href="/verifier/settings">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2 hover:border-verza-emerald/50 hover:bg-verza-emerald/5">
                  <Clock className="h-5 w-5 text-verza-emerald" />
                  <span>Availability</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-verza-emerald/20 to-transparent border-verza-emerald/30">
            <CardContent className="pt-6">
               <div className="flex flex-col gap-2">
                 <h3 className="font-bold text-lg">Verifier Pro Tier</h3>
                 <p className="text-sm text-muted-foreground">You are close to unlocking the next tier! Stake 500 more VERZA to qualify for premium jobs.</p>
                 <Link href="/verifier/staking">
                   <Button size="sm" className="mt-2 bg-verza-emerald text-white">View Staking</Button>
                 </Link>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Active Jobs List */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Active Jobs</CardTitle>
          <Link href="/verifier/active">
            <Button variant="ghost" size="sm" className="text-verza-emerald">View All <ArrowRight className="ml-1 h-4 w-4" /></Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeJobs.length === 0 ? (
               <div className="text-center py-4 text-muted-foreground">No active jobs</div>
            ) : activeJobs.map((job) => (
              <div key={job.verificationId} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-border/50 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-blue-500/10 text-blue-500 mt-1">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{getTypeLabel(job.type)}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center"><Briefcase className="mr-1 h-3 w-3" /> {job.details?.firstName || 'Unknown'}</span>
                      <span className="flex items-center text-orange-400"><Clock className="mr-1 h-3 w-3" /> 2h left</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 justify-between md:justify-end w-full md:w-auto">
                  <div className="text-right mr-4">
                    <div className="font-bold text-verza-emerald">$15.00</div>
                    <Badge variant="outline" className="text-[10px]">{job.status}</Badge>
                  </div>
                  <Link href={`/verifier/jobs/${job.verificationId}`}>
                    <Button size="sm">Continue</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
