import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Cpu,
  Database,
  RefreshCw,
  Server,
  ShieldCheck,
  Wifi,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useSystemMonitorData } from "@/hooks/useBankingDashboard";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  interaction: { intersect: false },
};

export default function SystemMonitor() {
  const { data, isLoading, error, refetch, isFetching } = useSystemMonitorData();

  useEffect(() => {
    if (error) {
      toast.error(error instanceof Error ? error.message : "Unable to refresh system monitor data");
    }
  }, [error]);

  const services = data?.health ?? [];
  const operationalCount = services.filter((service) => service.status === "operational").length;
  const degradedCount = services.filter((service) => service.status === "degraded").length;
  const criticalCount = services.filter((service) => service.status === "down").length;
  const alerts = data?.alerts ?? [];
  const processingChart = {
    labels: data?.processingTimes.map((item) => item.period) ?? [],
    datasets: [
      {
        label: "Average processing seconds",
        data: data?.processingTimes.map((item) => item.averageSeconds) ?? [],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.12)",
        fill: true,
        tension: 0.35,
      },
    ],
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">System Monitor</h1>
          <p className="text-muted-foreground">Live operational status, primitive health, and processing telemetry.</p>
        </div>
        <div className="flex gap-2">
          <Badge
            variant="outline"
            className={`px-3 py-1 h-9 ${
              criticalCount > 0
                ? "border-red-500/50 text-red-500 bg-red-500/10"
                : degradedCount > 0
                  ? "border-yellow-500/50 text-yellow-500 bg-yellow-500/10"
                  : "border-green-500/50 text-green-500 bg-green-500/10"
            }`}
          >
            <CheckCircle className="w-3 h-3 mr-2" />
            {criticalCount > 0 ? "Incident Active" : degradedCount > 0 ? "Degraded Services" : "Operational"}
          </Badge>
          <Button variant="outline" size="icon" onClick={() => void refetch()} disabled={isFetching}>
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Operational Services</div>
                  <div className="text-3xl font-bold">{operationalCount}</div>
                </div>
                <Cpu className="h-6 w-6 text-blue-500" />
              </CardContent>
            </Card>
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Degraded Services</div>
                  <div className="text-3xl font-bold">{degradedCount}</div>
                </div>
                <Activity className="h-6 w-6 text-yellow-500" />
              </CardContent>
            </Card>
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Open Alerts</div>
                  <div className="text-3xl font-bold">{alerts.length}</div>
                </div>
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </CardContent>
            </Card>
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Primitive Runtime</div>
                  <div className="text-xl font-bold">{data?.modelStatus?.status ?? "Unknown"}</div>
                </div>
                <Wifi className="h-6 w-6 text-green-500" />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Processing Telemetry</CardTitle>
                <CardDescription>Average completion time returned by analytics endpoints.</CardDescription>
              </CardHeader>
              <CardContent className="h-[320px]">
                {processingChart.labels.length > 0 ? (
                  <Line data={processingChart} options={chartOptions} />
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No processing telemetry available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Platform Readiness</CardTitle>
                <CardDescription>Verification and primitive service readiness checks.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-4 w-4 text-verza-emerald" />
                    <span className="text-sm font-medium">Banking API</span>
                  </div>
                  <Badge variant="outline">{data?.stats ? "Ready" : "Unknown"}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Server className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium">Primitive Service</span>
                  </div>
                  <Badge variant="outline">{data?.primitiveHealth?.ready ? "Ready" : "Unavailable"}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Database className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium">Model Status</span>
                  </div>
                  <Badge variant="outline">{data?.modelStatus?.loaded ? "Loaded" : "Pending"}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Service Status</CardTitle>
                <CardDescription>Current backend service state returned by the banking health endpoint.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Uptime</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.map((service) => (
                      <TableRow key={service.name}>
                        <TableCell className="font-medium flex items-center gap-2">
                          {service.name.includes("Database") ? <Database className="h-4 w-4 text-muted-foreground" /> : <Server className="h-4 w-4 text-muted-foreground" />}
                          {service.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{service.status}</Badge>
                        </TableCell>
                        <TableCell>{service.uptime}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription>Latest operational notifications from live alert feeds.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {alerts.length ? (
                  alerts.slice(0, 6).map((alert) => (
                    <div key={alert.id} className="p-3 rounded-lg bg-muted/50 border border-border/50 text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className={alert.type === "alert" ? "h-4 w-4 text-red-500" : "h-4 w-4 text-yellow-500"} />
                        <span className="font-semibold text-foreground">{alert.title}</span>
                        <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(alert.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{alert.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">No live alerts available.</div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </motion.div>
  );
}
