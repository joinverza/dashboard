import { motion } from "framer-motion";
import { 
  CheckCircle, AlertTriangle, Activity, 
  Database, Server, Shield, 
  Globe, Clock,
  Eye, Gavel, FileText, Loader2
} from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Line, Bar } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import { bankingService } from '@/services/bankingService';
import type { VerificationStatsResponse } from '@/types/banking';

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

const SYSTEM_HEALTH = [
  { name: "API Gateway", status: "operational", uptime: "99.99%" },
  { name: "Midnight Node", status: "operational", uptime: "99.95%" },
  { name: "Cardano Node", status: "operational", uptime: "99.98%" },
  { name: "Database Primary", status: "operational", uptime: "99.99%" },
  { name: "Queue Service", status: "degraded", uptime: "98.50%" },
  { name: "AI Service", status: "operational", uptime: "99.90%" },
];

const RECENT_ALERTS = [
  { id: 1, message: "High latency detected in Queue Service", severity: "warning", time: "10 min ago" },
  { id: 2, message: "Failed verification spike (Region: EU)", severity: "critical", time: "1 hour ago" },
  { id: 3, message: "New Enterprise signup: Acme Corp", severity: "info", time: "2 hours ago" },
];

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState<VerificationStatsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const data = await bankingService.getVerificationStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
        toast.error("Failed to load dashboard statistics");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Process daily breakdown for charts
  const labels = stats?.dailyBreakdown?.map(d => new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })) || [];
  const dataPoints = stats?.dailyBreakdown?.map(d => d.count) || [];

  const lineChartData = {
    labels: labels.length > 0 ? labels : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Verifications',
        data: dataPoints.length > 0 ? dataPoints : [12, 19, 3, 5, 2, 3],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
    ],
  };

  const barChartData = {
    labels: labels.length > 0 ? labels : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Daily Verifications',
        data: dataPoints.length > 0 ? dataPoints : [4500, 5200, 4800, 5900, 6100, 3200, 2800],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
      },
    ],
  };

  const metrics = [
    { label: "Total Verifications", value: stats?.totalVerifications || 0, change: "+12%", icon: CheckCircle, color: "text-green-500" },
    { label: "Pending Reviews", value: stats?.pending || 0, change: "+5%", icon: Clock, color: "text-yellow-500" },
    { label: "Rejected", value: stats?.failed || 0, change: "-2%", icon: AlertTriangle, color: "text-red-500" },
    { label: "Active Verifiers", value: "1,240", change: "+4%", icon: Shield, color: "text-purple-500" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Overview</h1>
          <p className="text-muted-foreground">System health, metrics, and alerts.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setLocation('/admin/verifications')}>
            <Eye className="mr-2 h-4 w-4" /> Verifications
          </Button>
          <Button variant="outline" onClick={() => setLocation('/admin/disputes')}>
            <Gavel className="mr-2 h-4 w-4" /> Disputes
          </Button>
          <Button variant="outline" onClick={() => setLocation('/admin/reports')}>
            <FileText className="mr-2 h-4 w-4" /> Reports
          </Button>
          <Button variant="outline" onClick={() => setLocation('/admin/system')}>
            <Activity className="mr-2 h-4 w-4" /> System Monitor
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl font-bold">{metric.value}</h3>
                  {/* <span className="text-xs font-medium text-emerald-500">{metric.change}</span> */}
                </div>
              </div>
              <div className={`p-3 rounded-full bg-secondary/50 ${metric.color}`}>
                <metric.icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <Card className="lg:col-span-2 bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Verification Trends</CardTitle>
            <CardDescription>Daily verification requests volume.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="h-[300px] w-full">
                <Line 
                  data={lineChartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    interaction: { mode: 'index', intersect: false },
                    scales: {
                      y: { type: 'linear', display: true, position: 'left' },
                    },
                  }} 
                />
             </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <div className="space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>Real-time status of key services.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {SYSTEM_HEALTH.map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {service.name.includes("Database") ? <Database className="h-4 w-4 text-muted-foreground" /> :
                     service.name.includes("Node") ? <Globe className="h-4 w-4 text-muted-foreground" /> :
                     <Server className="h-4 w-4 text-muted-foreground" />}
                    <span className="text-sm font-medium">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{service.uptime}</span>
                    <div className={`h-2.5 w-2.5 rounded-full ${
                      service.status === "operational" ? "bg-green-500" : 
                      service.status === "degraded" ? "bg-yellow-500" : "bg-red-500"
                    }`} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Alerts */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {RECENT_ALERTS.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <AlertTriangle className={`h-5 w-5 mt-0.5 shrink-0 ${
                    alert.severity === "critical" ? "text-red-500" : 
                    alert.severity === "warning" ? "text-yellow-500" : "text-blue-500"
                  }`} />
                  <div>
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" /> {alert.time}
                    </p>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-xs" size="sm" onClick={() => setLocation('/admin/system')}>View All Alerts</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <Card className="bg-card/80 backdrop-blur-sm border-border/50">
           <CardHeader>
             <CardTitle>Verification Volume</CardTitle>
             <CardDescription>Daily verification requests (Last 7 Days)</CardDescription>
           </CardHeader>
           <CardContent>
             <div className="h-[200px] w-full">
               <Bar 
                 data={barChartData}
                 options={{
                   responsive: true,
                   maintainAspectRatio: false,
                 }}
               />
             </div>
           </CardContent>
         </Card>

         <Card className="bg-card/80 backdrop-blur-sm border-border/50">
           <CardHeader>
             <CardTitle>Geographic Distribution</CardTitle>
             <CardDescription>User activity by region</CardDescription>
           </CardHeader>
           <CardContent>
             <div className="h-[200px] w-full flex items-center justify-center bg-muted/20 rounded-lg relative overflow-hidden group">
                {/* Abstract Map Background Placeholder */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
                <div className="grid grid-cols-12 gap-1 opacity-10 absolute inset-0">
                  {Array.from({ length: 144 }).map((_, i) => (
                    <div key={i} className="bg-foreground rounded-full h-1 w-1 mx-auto" />
                  ))}
                </div>
                
                <div className="z-10 text-center">
                   <Globe className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                   <p className="text-sm text-muted-foreground">Interactive Map View</p>
                </div>
             </div>
             <div className="mt-4 space-y-2">
               {[
                 { country: "United States", percentage: 45, color: "bg-blue-500" },
                 { country: "Germany", percentage: 22, color: "bg-purple-500" },
                 { country: "Japan", percentage: 15, color: "bg-pink-500" },
                 { country: "United Kingdom", percentage: 12, color: "bg-green-500" },
               ].map((region, i) => (
                 <div key={i} className="flex items-center gap-2 text-sm">
                   <div className="w-24 font-medium truncate">{region.country}</div>
                   <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                     <div className={`h-full ${region.color}`} style={{ width: `${region.percentage}%` }} />
                   </div>
                   <div className="w-8 text-right text-xs text-muted-foreground">{region.percentage}%</div>
                 </div>
               ))}
             </div>
           </CardContent>
         </Card>
      </div>
    </motion.div>
  );
}
