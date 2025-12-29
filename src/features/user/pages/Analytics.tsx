import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar as CalendarIcon, Download, TrendingUp, Clock, CheckCircle, DollarSign, Activity, FileText } from "lucide-react";
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
const spendingData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Spending ($)',
      data: [150, 230, 180, 320, 290, 450],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      tension: 0.4,
    },
  ],
};

const activityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Verifications',
        data: [2, 5, 3, 8, 6, 1, 0],
        backgroundColor: '#10b981',
        borderRadius: 4,
      },
    ],
  };

const credentialTypeData = {
    labels: ['Identity', 'Education', 'Employment', 'Finance', 'Other'],
    datasets: [
      {
        data: [4, 2, 3, 1, 2],
        backgroundColor: [
          '#3b82f6',
          '#8b5cf6',
          '#10b981',
          '#f59e0b',
          '#6b7280',
        ],
        borderWidth: 0,
      },
    ],
  };

export default function UserAnalytics() {
  const [timeRange, setTimeRange] = useState("30d");

  const metrics = [
    { label: "Total Spent", value: "$1,620", change: "+12%", icon: DollarSign, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Active Credentials", value: "12", change: "+2", icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Pending Verifications", value: "3", change: "-1", icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { label: "Total Requests", value: "45", change: "+5", icon: Activity, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">
            Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your spending, credentials, and verification activity.
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px] bg-card/50 backdrop-blur-sm border-border/50">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="bg-card/50 backdrop-blur-sm border-border/50">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                    <h3 className="text-2xl font-bold mt-2">{metric.value}</h3>
                  </div>
                  <div className={`p-3 rounded-lg ${metric.bg}`}>
                    <metric.icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-xs">
                  <span className={`${metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'} font-medium`}>
                    {metric.change}
                  </span>
                  <span className="text-muted-foreground ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending Chart */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
        >
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 h-full">
            <CardHeader>
                <CardTitle>Spending Overview</CardTitle>
                <CardDescription>Your spending on verifications over time.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <Line data={spendingData} options={lineOptions} />
                </div>
            </CardContent>
            </Card>
        </motion.div>

        {/* Credential Types */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 h-full">
            <CardHeader>
                <CardTitle>Credential Types</CardTitle>
                <CardDescription>Distribution of your credentials.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full flex items-center justify-center">
                    <Doughnut data={credentialTypeData} options={pieOptions} />
                </div>
            </CardContent>
            </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
        >
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
                <CardTitle>Verification Activity</CardTitle>
                <CardDescription>Number of verification requests per day.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full">
                <Bar data={activityData} options={barOptions} />
                </div>
            </CardContent>
            </Card>
        </motion.div>

        {/* Recent Transactions / History Snippet */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
        >
             <Card className="bg-card/80 backdrop-blur-sm border-border/50 h-full">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            { title: "ID Verification", date: "Today, 10:23 AM", amount: "-$15.00", status: "Completed" },
                            { title: "Degree Check", date: "Yesterday, 2:15 PM", amount: "-$25.00", status: "Processing" },
                            { title: "Wallet Deposit", date: "Oct 24, 2023", amount: "+$100.00", status: "Completed" },
                            { title: "Skill Badge", date: "Oct 20, 2023", amount: "-$10.00", status: "Completed" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0">
                                <div>
                                    <p className="font-medium text-sm">{item.title}</p>
                                    <p className="text-xs text-muted-foreground">{item.date}</p>
                                </div>
                                <div className="text-right">
                                    <p className={`text-sm font-medium ${item.amount.startsWith('+') ? 'text-green-500' : 'text-foreground'}`}>
                                        {item.amount}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{item.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
             </Card>
        </motion.div>
      </div>
    </div>
  );
}
