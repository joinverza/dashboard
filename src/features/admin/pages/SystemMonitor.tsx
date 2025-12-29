import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Activity, Server, Database, Cpu, HardDrive, 
  Wifi, AlertTriangle, CheckCircle, RefreshCw, Clock
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
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

// Mock Data
const SERVICES = [
  { name: "API Gateway", status: "operational", uptime: "99.99%", latency: "45ms", version: "v2.4.0" },
  { name: "Auth Service", status: "operational", uptime: "99.95%", latency: "120ms", version: "v1.2.1" },
  { name: "Verification Engine", status: "operational", uptime: "99.98%", latency: "230ms", version: "v3.0.5" },
  { name: "Blockchain Node (Midnight)", status: "operational", uptime: "99.90%", latency: "850ms", version: "v1.0.0" },
  { name: "Blockchain Node (Cardano)", status: "operational", uptime: "99.99%", latency: "150ms", version: "v8.1.2" },
  { name: "Database Cluster", status: "operational", uptime: "99.99%", latency: "12ms", version: "PG-15" },
  { name: "Redis Cache", status: "operational", uptime: "99.99%", latency: "2ms", version: "v7.0" },
  { name: "Message Queue", status: "degraded", uptime: "98.50%", latency: "1200ms", version: "RabbitMQ" },
  { name: "AI Analysis Service", status: "operational", uptime: "99.90%", latency: "450ms", version: "v2.1.0" },
];

const LOGS = [
  { id: 1, level: "error", message: "Connection timeout to Message Queue", service: "Message Queue", time: "2 mins ago" },
  { id: 2, level: "warning", message: "High memory usage detected (85%)", service: "AI Analysis Service", time: "15 mins ago" },
  { id: 3, level: "info", message: "Automated backup completed successfully", service: "Database Cluster", time: "1 hour ago" },
  { id: 4, level: "info", message: "New node joined the cluster", service: "Blockchain Node (Midnight)", time: "2 hours ago" },
  { id: 5, level: "warning", message: "Rate limit threshold approached", service: "API Gateway", time: "3 hours ago" },
];

export default function SystemMonitor() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("System metrics updated");
    }, 1000);
  };

  const generateChartData = (label: string, color: string, fill: boolean = true) => ({
    labels: Array.from({ length: 20 }, (_, i) => i),
    datasets: [
      {
        label,
        data: Array.from({ length: 20 }, () => Math.floor(Math.random() * 40) + 30),
        borderColor: color,
        backgroundColor: color.replace(')', ', 0.1)').replace('rgb', 'rgba'),
        fill,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { display: false },
      y: { display: false, min: 0, max: 100 },
    },
    interaction: { intersect: false },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">System Monitor</h1>
          <p className="text-muted-foreground">Real-time performance metrics and service status.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="px-3 py-1 h-9 border-green-500/50 text-green-500 bg-green-500/10">
            <CheckCircle className="w-3 h-3 mr-2" /> All Systems Nominal
          </Badge>
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Resource Usage Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-blue-500/10 text-blue-500">
                  <Cpu className="h-4 w-4" />
                </div>
                <span className="font-medium">CPU Usage</span>
              </div>
              <span className="text-xl font-bold">42%</span>
            </div>
            <div className="h-[60px]">
              <Line data={generateChartData("CPU", "rgb(59, 130, 246)")} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-purple-500/10 text-purple-500">
                  <Activity className="h-4 w-4" />
                </div>
                <span className="font-medium">Memory</span>
              </div>
              <span className="text-xl font-bold">6.2 GB</span>
            </div>
            <div className="h-[60px]">
              <Line data={generateChartData("Memory", "rgb(168, 85, 247)")} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-yellow-500/10 text-yellow-500">
                  <HardDrive className="h-4 w-4" />
                </div>
                <span className="font-medium">Storage</span>
              </div>
              <span className="text-xl font-bold">45%</span>
            </div>
            <div className="h-[60px]">
              <Line data={generateChartData("Storage", "rgb(234, 179, 8)")} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full bg-green-500/10 text-green-500">
                  <Wifi className="h-4 w-4" />
                </div>
                <span className="font-medium">Network</span>
              </div>
              <span className="text-xl font-bold">1.2 Gbps</span>
            </div>
            <div className="h-[60px]">
              <Line data={generateChartData("Network", "rgb(34, 197, 94)")} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service Status Table */}
        <Card className="lg:col-span-2 bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Service Status</CardTitle>
            <CardDescription>Operational status of platform components.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Uptime</TableHead>
                  <TableHead>Latency</TableHead>
                  <TableHead className="text-right">Version</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {SERVICES.map((service, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium flex items-center gap-2">
                      {service.name.includes("Database") ? <Database className="h-4 w-4 text-muted-foreground" /> :
                       service.name.includes("Node") ? <Server className="h-4 w-4 text-muted-foreground" /> :
                       <Activity className="h-4 w-4 text-muted-foreground" />}
                      {service.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`
                        ${service.status === "operational" ? "border-green-500 text-green-500" : 
                          service.status === "degraded" ? "border-yellow-500 text-yellow-500" : "border-red-500 text-red-500"}
                      `}>
                        {service.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{service.uptime}</TableCell>
                    <TableCell>{service.latency}</TableCell>
                    <TableCell className="text-right text-muted-foreground">{service.version}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Logs */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>System Logs</CardTitle>
            <CardDescription>Recent events and errors.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {LOGS.map((log) => (
                <div key={log.id} className="p-3 rounded-lg bg-muted/50 border border-border/50 text-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className={`h-4 w-4 ${
                      log.level === "error" ? "text-red-500" : 
                      log.level === "warning" ? "text-yellow-500" : "text-blue-500"
                    }`} />
                    <span className="font-semibold capitalize text-foreground">{log.level}</span>
                    <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {log.time}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-1">{log.message}</p>
                  <p className="text-xs text-muted-foreground/70">Service: {log.service}</p>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-xs" size="sm" onClick={() => toast.info("Navigating to full logs...")}>View All Logs</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
