import { motion } from "framer-motion";
import {
  CheckCircle, AlertTriangle, Activity,
  Database, Server, Shield,
  Globe, Clock,
  Eye, Gavel, FileText,
  TrendingUp, ArrowRight, Zap, BarChart3
} from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
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
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useEffect } from 'react';
import { useAdminDashboardData } from '@/hooks/useBankingDashboard';
import { cn } from "@/lib/utils";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const formatRelativeTime = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";
  const diffMs = Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diffMs < hour) return `${Math.max(1, Math.floor(diffMs / minute))} min ago`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)}h ago`;
  return `${Math.floor(diffMs / day)}d ago`;
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.45 },
  }),
};

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { stats, activeVerifiers, systemHealth, recentAlerts, geoDistribution, isLoading, error } = useAdminDashboardData();

  useEffect(() => {
    if (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load dashboard statistics");
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="enterprise-card rounded-3xl px-12 py-10 text-center flex flex-col items-center">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-2 border-verza-emerald/20 rounded-full" />
            <div className="absolute inset-0 border-2 border-verza-emerald border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="mt-6 text-xs uppercase tracking-[0.25em] text-verza-gray font-medium">Loading Admin Panel</p>
        </div>
      </div>
    );
  }

  const labels = stats?.dailyBreakdown?.map(d => new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })) || [];
  const dataPoints = stats?.dailyBreakdown?.map(d => d.count) || [];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(6, 20, 15, 0.9)',
        borderColor: 'rgba(30, 215, 96, 0.2)',
        borderWidth: 1,
        titleColor: '#f0f5f2',
        bodyColor: '#9ca3af',
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#9ca3af', font: { size: 11 } },
        border: { display: false },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#9ca3af', font: { size: 11 } },
        border: { display: false },
      },
    },
  };

  const lineChartData = {
    labels,
    datasets: [{
      label: 'Verifications',
      data: dataPoints,
      borderColor: '#1ED760',
      backgroundColor: 'rgba(30, 215, 96, 0.08)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: '#1ED760',
      pointBorderColor: 'transparent',
      pointRadius: 4,
      pointHoverRadius: 6,
    }],
  };

  const barChartData = {
    labels,
    datasets: [{
      label: 'Daily Verifications',
      data: dataPoints,
      backgroundColor: 'rgba(30, 215, 96, 0.35)',
      borderColor: 'rgba(30, 215, 96, 0.6)',
      borderWidth: 1,
      borderRadius: 6,
    }],
  };

  const metrics = [
    {
      label: "Total Verifications",
      value: stats?.totalVerifications?.toLocaleString() || "0",
      icon: CheckCircle,
      color: "text-verza-emerald",
      bg: "bg-verza-emerald/10 border-verza-emerald/20",
      trend: "+3.4%",
      trendPos: true,
    },
    {
      label: "Pending Reviews",
      value: String(stats?.pending || 0),
      icon: Clock,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10 border-yellow-500/20",
      trend: "Needs attention",
      trendPos: false,
    },
    {
      label: "Rejected",
      value: String(stats?.rejected || 0),
      icon: AlertTriangle,
      color: "text-red-400",
      bg: "bg-red-500/10 border-red-500/20",
      trend: "-1.2%",
      trendPos: true,
    },
    {
      label: "Active Verifiers",
      value: String(activeVerifiers),
      icon: Shield,
      color: "text-verza-gray",
      bg: "bg-ent-muted border-ent-border",
      trend: "Online now",
      trendPos: true,
    },
  ];

  const quickLinks = [
    { label: "Verifications", icon: Eye, path: "/admin/verifications" },
    { label: "Disputes", icon: Gavel, path: "/admin/disputes" },
    { label: "Reports", icon: FileText, path: "/admin/reports" },
    { label: "System Monitor", icon: Activity, path: "/admin/system" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-10 max-w-7xl mx-auto"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-5"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-verza-emerald/10 border border-verza-emerald/20 text-[10px] uppercase tracking-[0.2em] text-verza-emerald font-semibold mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-verza-emerald animate-pulse" />
            Admin Control Center
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-ent-text sm:text-4xl">Admin Overview</h1>
          <p className="text-verza-gray/80 mt-2 leading-relaxed">
            System health, verification metrics, and platform alerts in real time.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-2">
          {quickLinks.map((link) => (
            <motion.button
              key={link.label}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setLocation(link.path)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-ent-border bg-ent-muted text-ent-text/80 hover:text-ent-text hover:border-verza-emerald/25 hover:bg-verza-emerald/5 text-[13px] font-medium transition-all"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            whileHover={{ y: -3, scale: 1.02 }}
            className="enterprise-card relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between cursor-default"
          >
            <div className={`absolute top-0 right-0 w-28 h-28 rounded-full blur-3xl opacity-20 ${metric.bg.split(' ')[0]}`} />
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-verza-gray/70 font-medium">{metric.label}</p>
                <p className="mt-3 text-3xl font-bold tracking-tight text-ent-text">{metric.value}</p>
              </div>
              <div className={`p-2.5 rounded-xl border ${metric.bg} ${metric.color}`}>
                <metric.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="relative z-10 mt-5">
              <span className={cn(
                "text-[11px] font-semibold px-2 py-0.5 rounded-md",
                metric.trendPos ? "bg-verza-emerald/10 text-verza-emerald" : "bg-yellow-500/10 text-yellow-400"
              )}>
                {metric.trend}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts + System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="lg:col-span-2 enterprise-card rounded-2xl p-6 flex flex-col"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-semibold text-ent-text">Verification Trends</p>
              <p className="text-[11px] text-verza-gray/70 mt-0.5">Daily verification request volume</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-verza-emerald/10 border border-verza-emerald/20">
              <span className="h-1.5 w-1.5 rounded-full bg-verza-emerald animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest text-verza-emerald font-semibold">Live</span>
            </div>
          </div>
          {labels.length > 0 ? (
            <div className="h-[260px] w-full">
              <Line data={lineChartData} options={chartOptions} />
            </div>
          ) : (
            <div className="h-[260px] flex items-center justify-center text-sm text-verza-gray/50">
              No trend data available
            </div>
          )}
        </motion.div>

        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="enterprise-card rounded-2xl p-6 flex flex-col"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-semibold text-ent-text">System Health</p>
              <p className="text-[11px] text-verza-gray/70 mt-0.5">Real-time service status</p>
            </div>
            <Zap className="h-4 w-4 text-verza-emerald" />
          </div>
          <div className="space-y-3 flex-1">
            {systemHealth.slice(0, 5).map((service, i) => (
              <div key={`${String(service.name)}-${i}`} className="flex items-center justify-between py-2 border-b border-ent-border last:border-0">
                <div className="flex items-center gap-2.5">
                  {String(service.name).includes("Database") ? (
                    <Database className="h-3.5 w-3.5 text-verza-gray/60" />
                  ) : String(service.name).includes("Node") ? (
                    <Globe className="h-3.5 w-3.5 text-verza-gray/60" />
                  ) : (
                    <Server className="h-3.5 w-3.5 text-verza-gray/60" />
                  )}
                  <span className="text-[13px] font-medium text-ent-text/90">{String(service.name)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-verza-gray/60">{String(service.uptime)}</span>
                  <div className={cn(
                    "h-2 w-2 rounded-full",
                    service.status === "operational" ? "bg-verza-emerald shadow-[0_0_6px_rgba(30,215,96,0.6)]" :
                    service.status === "degraded" ? "bg-yellow-400" : "bg-red-400"
                  )} />
                </div>
              </div>
            ))}
            {systemHealth.length === 0 && (
              <p className="text-sm text-verza-gray/50">No system data available.</p>
            )}
          </div>
          <button
            onClick={() => setLocation('/admin/system')}
            className="mt-4 flex items-center justify-center gap-1 text-[12px] font-medium text-verza-gray/60 hover:text-verza-emerald transition-colors"
          >
            View full status <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      </div>

      {/* Alerts + Volume + Geo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Recent Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="enterprise-card rounded-2xl p-6 flex flex-col"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-semibold text-ent-text">Recent Alerts</p>
              <p className="text-[11px] text-verza-gray/70 mt-0.5">Latest system events</p>
            </div>
            <AlertTriangle className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="space-y-2 flex-1">
            {recentAlerts.slice(0, 4).map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-xl bg-ent-muted border border-ent-border">
                <AlertTriangle className={cn(
                  "h-4 w-4 mt-0.5 shrink-0",
                  alert.type === "alert" ? "text-red-400" :
                  alert.type === "transaction" ? "text-yellow-400" : "text-verza-gray"
                )} />
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-ent-text/90 truncate">{alert.message || alert.title}</p>
                  <p className="text-[11px] text-verza-gray/60 flex items-center gap-1 mt-0.5">
                    <Clock className="h-3 w-3" /> {formatRelativeTime(alert.createdAt)}
                  </p>
                </div>
              </div>
            ))}
            {recentAlerts.length === 0 && (
              <div className="flex flex-col items-center justify-center h-24 text-sm text-verza-gray/50">
                <CheckCircle className="h-5 w-5 text-verza-emerald mb-2" />
                No recent alerts
              </div>
            )}
          </div>
          <button
            onClick={() => setLocation('/admin/system')}
            className="mt-4 flex items-center justify-center gap-1 text-[12px] font-medium text-verza-gray/60 hover:text-verza-emerald transition-colors"
          >
            View all alerts <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </motion.div>

        {/* Volume Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5 }}
          className="enterprise-card rounded-2xl p-6 flex flex-col"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-semibold text-ent-text">Verification Volume</p>
              <p className="text-[11px] text-verza-gray/70 mt-0.5">Daily requests — last 7 days</p>
            </div>
            <BarChart3 className="h-4 w-4 text-verza-emerald" />
          </div>
          {labels.length > 0 ? (
            <div className="h-[200px] w-full">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-sm text-verza-gray/50">
              No volume data available
            </div>
          )}
        </motion.div>

        {/* Geo Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="enterprise-card rounded-2xl p-6 flex flex-col"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-semibold text-ent-text">Geographic Distribution</p>
              <p className="text-[11px] text-verza-gray/70 mt-0.5">User activity by region</p>
            </div>
            <Globe className="h-4 w-4 text-verza-emerald" />
          </div>
          <div className="space-y-3 flex-1">
            {geoDistribution.length > 0 ? geoDistribution.map((region, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="font-medium text-ent-text/80 truncate">{region.region}</span>
                  <span className="text-verza-gray/60 font-mono ml-2">{region.percentage}%</span>
                </div>
                <div className="h-1.5 w-full bg-ent-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${region.percentage}%` }}
                    transition={{ delay: 0.5 + i * 0.08, duration: 0.6, ease: "easeOut" }}
                    className="h-full bg-verza-emerald rounded-full"
                  />
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-24 text-sm text-verza-gray/50">
                <Globe className="h-5 w-5 mb-2 opacity-40" />
                No geographic data
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Platform Status Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="enterprise-card rounded-2xl p-5"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-verza-emerald/10 border border-verza-emerald/20 text-verza-emerald">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ent-text">Platform running optimally</p>
              <p className="text-[12px] text-verza-gray/70">All core services operational · Avg response 120ms · 99.98% uptime</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setLocation('/admin/system')}
              className="px-4 py-2 rounded-xl border border-ent-border bg-ent-muted text-[13px] font-medium text-ent-text/80 hover:text-ent-text hover:border-verza-emerald/25 transition-all"
            >
              System Monitor
            </button>
            <button
              onClick={() => setLocation('/admin/verifications')}
              className="px-4 py-2 rounded-xl bg-verza-emerald text-[#06140F] text-[13px] font-bold hover:bg-verza-emerald/90 transition-all shadow-[0_4px_14px_rgba(30,215,96,0.2)]"
            >
              View Verifications
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
