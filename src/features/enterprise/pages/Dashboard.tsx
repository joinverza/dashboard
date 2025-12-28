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
  ArrowUpRight
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

const chartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Verifications',
      data: [120, 190, 300, 500, 200, 300, 450],
      fill: true,
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: '#3b82f6',
      tension: 0.4,
    },
  ],
};

export default function EnterpriseDashboard() {
  const recentVerifications = [
    { id: "REQ-1001", type: "Identity Verification", user: "John Doe", status: "Completed", date: "2 mins ago" },
    { id: "REQ-1002", type: "Employment Check", user: "Alice Smith", status: "Processing", date: "15 mins ago" },
    { id: "REQ-1003", type: "Criminal Record", user: "Bob Jones", status: "Failed", date: "1 hour ago" },
    { id: "REQ-1004", type: "Education Verification", user: "Sarah Connor", status: "Completed", date: "2 hours ago" },
  ];

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
            <div className="text-2xl font-bold">12,543</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-verza-emerald flex items-center mr-1"><ArrowUpRight className="h-3 w-3" /> +24%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-verza-emerald" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,200</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              vs traditional methods
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Calls</CardTitle>
            <Code className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">843,221</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              99.99% uptime
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Team</CardTitle>
            <Users className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              3 new this week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Usage Chart */}
        <Card className="lg:col-span-2 bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Verification Volume</CardTitle>
            <CardDescription>Daily verification requests over the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <Line options={chartOptions} data={chartData} />
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Actions */}
        <div className="space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Link href="/enterprise/bulk-upload">
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
              <Link href="/enterprise/reports">
                <Button variant="outline" className="w-full h-24 flex flex-col gap-2 hover:border-verza-emerald/50 hover:bg-verza-emerald/5">
                  <FileText className="h-6 w-6 text-verza-emerald" />
                  <span>View Reports</span>
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
                 <h3 className="font-bold text-lg">System Status</h3>
                 <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-verza-emerald animate-pulse"></div>
                    <span className="text-sm text-muted-foreground">All systems operational</span>
                 </div>
                 <p className="text-xs text-muted-foreground mt-2">Last checked: 1 min ago</p>
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
            {recentVerifications.map((req) => (
              <div key={req.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-border/50 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-blue-500/10 text-blue-500 mt-1">
                    <Activity className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{req.type}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span className="font-mono text-xs">{req.id}</span>
                      <span>•</span>
                      <span>{req.user}</span>
                      <span>•</span>
                      <span className="flex items-center"><Activity className="mr-1 h-3 w-3" /> {req.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 justify-between md:justify-end w-full md:w-auto">
                  <Badge variant={req.status === 'Completed' ? 'default' : req.status === 'Failed' ? 'destructive' : 'secondary'}>
                    {req.status}
                  </Badge>
                  <Button variant="outline" size="sm">Details</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
