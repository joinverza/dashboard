import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Clock, Wallet, ArrowUpRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { bankingService } from '@/services/bankingService';
import type { VerificationStatsResponse, VerificationRequestResponse } from '@/types/banking';
import { toast } from "sonner";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: '#9ca3af'
      }
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      ticks: { color: '#9ca3af' },
      grid: { color: 'rgba(255, 255, 255, 0.1)' }
    },
    x: {
      ticks: { color: '#9ca3af' },
      grid: { display: false }
    }
  }
};

export default function Earnings() {
  const [stats, setStats] = useState<VerificationStatsResponse | null>(null);
  const [recentJobs, setRecentJobs] = useState<VerificationRequestResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [statsData, requestsData] = await Promise.all([
          bankingService.getVerificationStats(),
          bankingService.getVerificationRequests({ limit: 10 })
        ]);
        setStats(statsData);
        // Filter for completed jobs that would generate earnings
        const completed = requestsData.filter(r => r.status === 'verified' || r.status === 'rejected');
        setRecentJobs(completed);
      } catch (error) {
        console.error("Failed to fetch earnings data", error);
        toast.error("Failed to load earnings data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate dynamic data
  const totalEarnings = (stats?.successful || 0) * 15; // $15 per verification
  const monthlyEarnings = totalEarnings; // For now, assume all are this month as we don't have historical breakdown
  
  // Prepare chart data from dailyBreakdown
  const chartLabels = stats?.dailyBreakdown?.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })) || [];
  const chartDataPoints = stats?.dailyBreakdown?.map(d => d.count * 15) || [];

  const data = {
    labels: chartLabels.length > 0 ? chartLabels : ['No Data'],
    datasets: [
      {
        label: 'Earnings ($)',
        data: chartDataPoints.length > 0 ? chartDataPoints : [0],
        backgroundColor: 'rgba(141, 198, 63, 0.7)',
        borderColor: 'rgba(141, 198, 63, 1)',
        borderWidth: 1,
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Earnings</h1>
          <p className="text-muted-foreground">Track your verification income and payouts.</p>
        </div>
        <Button className="bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow">
          <Wallet className="mr-2 h-4 w-4" /> Withdraw Funds
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-verza-emerald" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Based on {stats?.successful || 0} verifications</p>
          </CardContent>
        </Card>
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-verza-emerald" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Estimated based on activity</p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending (Escrow)</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${((stats?.pending || 0) * 15).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">For {stats?.pending || 0} pending jobs</p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Wallet className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalEarnings * 0.9).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Ready to withdraw (90%)</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        {/* Chart */}
        <Card className="col-span-4 bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Earnings Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
             <div className="h-[300px] w-full">
                <Bar options={options} data={data} />
             </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="col-span-3 bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentJobs.length > 0 ? (
                recentJobs.map((job) => (
                <div key={job.verificationId} className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${job.status === 'verified' ? 'bg-verza-emerald/10 text-verza-emerald' : 'bg-red-500/10 text-red-500'}`}>
                      {job.status === 'verified' ? <ArrowUpRight className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{job.type.replace('_', ' ').toUpperCase()}</p>
                      <p className="text-xs text-muted-foreground">{new Date(job.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">$15.00</p>
                    <p className={`text-xs ${job.status === 'verified' ? 'text-verza-emerald' : 'text-red-500'}`}>{job.status}</p>
                  </div>
                </div>
              ))) : (
                <div className="text-center text-muted-foreground py-4">No recent completed jobs</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
