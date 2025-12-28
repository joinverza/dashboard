import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Download, TrendingUp, Clock, CheckCircle, DollarSign, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Chart Options
const lineOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' as const, labels: { color: '#9ca3af' } },
  },
  scales: {
    y: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#9ca3af' } },
    x: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#9ca3af' } }
  }
};

const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#9ca3af' } },
      x: { grid: { display: false }, ticks: { color: '#9ca3af' } }
    }
};

const pieOptions = {
    responsive: true,
    plugins: {
        legend: { position: 'right' as const, labels: { color: '#9ca3af' } }
    },
    cutout: '60%'
};

// Mock Data
const completionData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Jobs Completed',
      data: [12, 19, 15, 25, 22, 10, 8],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.5)',
      tension: 0.4,
    },
  ],
};

const earningsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Earnings ($)',
        data: [1200, 1900, 1500, 2500, 3200, 2800],
        backgroundColor: '#3b82f6',
        borderRadius: 4,
      },
    ],
  };

const typeData = {
    labels: ['Identity', 'Education', 'Employment', 'Criminal', 'Financial'],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          '#10b981',
          '#3b82f6',
          '#8b5cf6',
          '#f59e0b',
          '#ef4444',
        ],
        borderWidth: 0,
      },
    ],
  };

export default function Analytics() {
  const [dateRange, setDateRange] = useState("30d");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Detailed insights into your verification performance.</p>
        </div>
        <div className="flex gap-3">
             <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[150px]">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Select Range" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                    <SelectItem value="90d">Last 3 Months</SelectItem>
                    <SelectItem value="1y">Last Year</SelectItem>
                </SelectContent>
             </Select>
             <Button variant="outline">
                 <Download className="mr-2 h-4 w-4" /> Export Report
             </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                <CheckCircle className="h-4 w-4 text-verza-emerald" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">1,284</div>
                <p className="text-xs text-muted-foreground text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" /> +12% from last month
                </p>
            </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Completion Time</CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">42m</div>
                <p className="text-xs text-muted-foreground text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" /> -5m faster than avg
                </p>
            </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">$12,450</div>
                <p className="text-xs text-muted-foreground text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" /> +8% from last month
                </p>
            </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <Activity className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">98.5%</div>
                <p className="text-xs text-muted-foreground mt-1">Top 5% of verifiers</p>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2 bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
                <CardTitle>Verification Activity</CardTitle>
                <CardDescription>Number of jobs completed over time.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <Line options={lineOptions} data={completionData} />
                </div>
            </CardContent>
        </Card>

        {/* Breakdown Chart */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
                <CardTitle>Jobs by Type</CardTitle>
                <CardDescription>Distribution of credential types.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full flex items-center justify-center">
                    <Doughnut options={pieOptions} data={typeData} />
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Earnings Chart */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
                <CardTitle>Monthly Earnings</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full">
                    <Bar options={barOptions} data={earningsData} />
                </div>
            </CardContent>
          </Card>

          {/* Benchmarking */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
             <CardHeader>
                <CardTitle>Performance Benchmarks</CardTitle>
                <CardDescription>Compare your stats vs platform average.</CardDescription>
             </CardHeader>
             <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium">Speed</span>
                        <span className="text-verza-emerald">Top 10%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-verza-emerald w-[90%]" />
                    </div>
                    <p className="text-xs text-muted-foreground">You are faster than 90% of verifiers.</p>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium">Accuracy</span>
                        <span className="text-blue-500">Top 5%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[95%]" />
                    </div>
                     <p className="text-xs text-muted-foreground">Your dispute rate is extremely low.</p>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium">Volume</span>
                        <span className="text-yellow-500">Top 20%</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 w-[80%]" />
                    </div>
                     <p className="text-xs text-muted-foreground">You verify more credentials than most peers.</p>
                </div>
             </CardContent>
          </Card>
      </div>
    </motion.div>
  );
}
