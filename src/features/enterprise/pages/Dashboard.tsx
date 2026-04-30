import { useDeferredValue, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "@/lib/use-gsap";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Check,
  FileText,
  Search,
  Upload,
  UserPlus,
  Users,
  Wrench,
  Activity,
  Globe,
  Zap,
  TrendingUp,
  AlertCircle,
  Clock
} from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { useEnterpriseDashboardData } from "@/hooks/useBankingDashboard";
import type { VerificationRequestResponse } from "@/types/banking";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

const mapNodes = [
  { left: "18%", top: "42%" },
  { left: "28%", top: "34%" },
  { left: "46%", top: "31%" },
  { left: "52%", top: "49%" },
  { left: "66%", top: "37%" },
  { left: "74%", top: "54%" },
  { left: "81%", top: "43%" },
];

const quickActions = [
  { label: "Bulk Upload", href: "/enterprise/bulk", icon: Upload },
  { label: "API Keys", href: "/enterprise/api", icon: Wrench },
  { label: "Workflows", href: "/enterprise/compliance/workflows", icon: FileText },
  { label: "Invite Team", href: "/enterprise/team/invite", icon: UserPlus },
];

const formatStatusLabel = (status: string): string =>
  status
    .replace(/_/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());

const buildSearchText = (item: VerificationRequestResponse): string =>
  [
    item.verificationId,
    item.type,
    item.status,
    item.subject,
    typeof item.details === "object" && item.details !== null && "email" in item.details
      ? String((item.details as Record<string, unknown>).email ?? "")
      : "",
  ]
    .join(" ")
    .toLowerCase();

function EnterpriseMetricCard({
  label,
  value,
  subtitle,
  accent,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string;
  subtitle: string;
  accent?: "neutral" | "positive" | "warning";
  icon?: any;
  trend?: { value: string; isPositive: boolean };
}) {
  return (
    <motion.div
      data-enterprise-kpi
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="enterprise-card relative overflow-hidden rounded-2xl p-6 flex flex-col justify-between"
    >
      {accent === "positive" && (
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-verza-emerald/10 blur-3xl rounded-full pointer-events-none" />
      )}
      {accent === "warning" && (
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-500/10 blur-3xl rounded-full pointer-events-none" />
      )}

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-verza-gray/70 font-medium">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-ent-text">{value}</p>
        </div>
        {Icon && (
          <div className={cn(
            "p-2.5 rounded-xl border",
            accent === "positive" ? "bg-verza-emerald/10 border-verza-emerald/20 text-verza-emerald" :
            accent === "warning" ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-500" :
            "bg-ent-muted border-ent-border text-verza-gray"
          )}>
            <Icon size={20} className="opacity-90" />
          </div>
        )}
      </div>
      <div className="mt-5 flex items-center gap-2.5 relative z-10">
        {trend && (
          <span className={cn(
            "text-[11px] font-semibold px-2 py-0.5 rounded-md",
            trend.isPositive ? "bg-verza-emerald/10 text-verza-emerald border border-verza-emerald/20" : 
            "bg-red-500/10 text-red-400 border border-red-500/20"
          )}>
            {trend.value}
          </span>
        )}
        <p className="text-[12px] text-verza-gray/60">{subtitle}</p>
      </div>
    </motion.div>
  );
}

function EnterpriseActivityMap() {
  return (
    <div className="enterprise-card relative min-h-[300px] overflow-hidden rounded-2xl p-6">
      <div data-enterprise-sweep className="enterprise-light-streak absolute left-[-30%] top-[42%] h-12 w-[60%]" />
      
      <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <svg viewBox="0 0 520 250" className="w-full h-full">
          <path
            d="M58 125 C110 80, 160 70, 190 88 C225 108, 250 120, 282 108 C322 92, 360 78, 410 94 C448 106, 466 132, 486 118"
            fill="none"
            stroke="rgba(30,215,96,0.5)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M170 92 C184 140, 254 188, 318 155 C366 132, 430 142, 470 116"
            fill="none"
            stroke="rgba(30,215,96,0.2)"
            strokeWidth="1"
            strokeLinecap="round"
            strokeDasharray="4 4"
          />
        </svg>
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-ent-text flex items-center gap-2">
              <Globe className="w-4 h-4 text-verza-emerald" /> Global Activity Map
            </p>
            <p className="mt-1 text-[11px] text-verza-gray/70">Live verification hotspots.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-verza-emerald/10 border border-verza-emerald/20">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-verza-emerald opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-verza-emerald"></span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-verza-emerald font-semibold">Live</span>
          </div>
        </div>

        <div className="relative mt-6 flex-1 min-h-[180px]">
          {mapNodes.map((node, index) => (
            <div
              key={`${node.left}-${node.top}-${index}`}
              className="absolute"
              style={{ left: node.left, top: node.top }}
            >
              <div className="enterprise-world-glow absolute -left-2 -top-2 h-6 w-6 rounded-full opacity-30" />
              <div
                data-enterprise-map-node
                className="enterprise-world-glow relative h-2.5 w-2.5 rounded-full shadow-[0_0_8px_rgba(30,215,96,0.8)]"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EnterpriseVolumeChart({
  bars,
}: {
  bars: Array<{ label: string; heightPercent: number; value: number }>;
}) {
  if (bars.length === 0) {
    return (
      <div className="enterprise-card flex min-h-[300px] items-center justify-center rounded-2xl p-6 text-sm text-verza-gray/50">
        No volume data available
      </div>
    );
  }

  return (
    <div className="enterprise-card relative min-h-[300px] overflow-hidden rounded-2xl p-6 flex flex-col justify-between">
      <div className="absolute inset-x-6 bottom-12 top-16">
        {[0, 1, 2, 3].map((line) => (
          <div
            key={line}
            className="absolute inset-x-0 border-t border-ent-border/60"
            style={{ top: `${line * 25}%` }}
          />
        ))}
      </div>

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-ent-text flex items-center gap-2">
            <Activity className="h-4 w-4 text-verza-emerald" /> Verification Volume
          </p>
          <p className="mt-1 text-[11px] text-verza-gray/70">Daily requests over the last 30 days.</p>
        </div>
      </div>

      <div className="relative z-10 mt-6 flex flex-1 items-end gap-3 lg:gap-4">
        {bars.map((bar, index) => (
          <div key={`${bar.label}-${index}`} className="group flex min-w-0 flex-1 flex-col items-center justify-end gap-3 cursor-crosshair">
            <div className="flex h-[180px] w-full items-end justify-center relative">
               <div className="absolute opacity-0 group-hover:opacity-100 -top-8 bg-ent-card border border-verza-emerald/30 px-2 py-1 rounded text-[10px] text-ent-text font-medium transition-opacity z-20 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                 {bar.value.toLocaleString()}
               </div>
              <div
                data-enterprise-bar-inner
                className="w-full max-w-[14px] rounded-t bg-ent-text/10 transition-colors group-hover:bg-verza-emerald/80 relative overflow-hidden"
                style={{ height: `${Math.max(bar.heightPercent, 5)}%` }}
              >
                <div className="absolute bottom-0 w-full bg-verza-emerald h-1/2 opacity-60" />
                <div className="absolute top-0 w-full bg-white/5 h-4" />
              </div>
            </div>
            <span className="text-[10px] uppercase tracking-[0.1em] text-verza-gray/50 group-hover:text-verza-emerald transition-colors">{bar.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function EnterpriseDashboard() {
  const { stats, recentVerifications, licenseUsage, isLoading, error } = useEnterpriseDashboardData();
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearch = useDeferredValue(searchTerm);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load enterprise dashboard data");
    }
  }, [error]);

  const totalVerifications = stats?.totalVerifications ?? 0;
  const pendingRequests = stats?.pending ?? 0;
  const rejectedRequests = stats?.rejected ?? 0;
  const quotaUsed = licenseUsage && licenseUsage.monthlyQuota > 0
    ? `${((licenseUsage.usedQuota / licenseUsage.monthlyQuota) * 100).toFixed(1)}%`
    : "0.0%";

  const volumeBars = (stats?.dailyBreakdown ?? []).slice(-12).map((item) => ({
    label: new Date(item.date).toLocaleDateString("en-US", { month: "short" }).slice(0, 3),
    value: item.count,
    heightPercent: 0,
  }));
  const maxVolume = volumeBars.length > 0 ? Math.max(...volumeBars.map((bar) => bar.value), 1) : 1;
  for (const bar of volumeBars) {
    bar.heightPercent = (bar.value / maxVolume) * 100;
  }

  const filteredVerifications = recentVerifications.filter((item) => {
    if (!deferredSearch.trim()) return true;
    return buildSearchText(item).includes(deferredSearch.trim().toLowerCase());
  });

  useGSAP(
    () => {
      const intro = gsap.timeline({ defaults: { ease: "power4.out" } });

      intro
        .from("[data-enterprise-shell]", {
          opacity: 0,
          y: 20,
          duration: 0.8,
        })
        .from(
          "[data-enterprise-reveal]",
          {
            opacity: 0,
            y: 15,
            duration: 0.6,
            stagger: 0.05,
          },
          "-=0.5"
        )
        .from(
          "[data-enterprise-kpi]",
          {
            opacity: 0,
            scale: 0.95,
            y: 10,
            duration: 0.5,
            stagger: 0.08,
          },
          "-=0.4"
        )
        .from(
          "[data-enterprise-panel]",
          {
            opacity: 0,
            y: 15,
            duration: 0.6,
            stagger: 0.08,
          },
          "-=0.3"
        )
        .from(
          "[data-enterprise-row]",
          {
            opacity: 0,
            x: -10,
            duration: 0.4,
            stagger: 0.03,
          },
          "-=0.2"
        );

      gsap.fromTo(
        "[data-enterprise-sweep]",
        { xPercent: -140, opacity: 0 },
        { xPercent: 200, opacity: 0.4, duration: 4, ease: "linear", repeat: -1 },
      );

      gsap.to("[data-enterprise-map-node]", {
        scale: 1.4,
        opacity: 0.9,
        duration: 2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.2, from: "random" },
      });

      gsap.fromTo(
        "[data-enterprise-bar-inner]",
        { scaleY: 0, transformOrigin: "bottom center" },
        {
          scaleY: 1,
          duration: 1,
          stagger: 0.05,
          ease: "back.out(1.2)",
        },
      );
    },
    { scope: rootRef, dependencies: [volumeBars.length, filteredVerifications.length] },
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="enterprise-card rounded-3xl px-12 py-10 text-center flex flex-col items-center">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-2 border-verza-emerald/20 rounded-full" />
            <div className="absolute inset-0 border-2 border-verza-emerald border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="mt-6 text-xs uppercase tracking-[0.25em] text-verza-gray font-medium">Loading Overview</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={rootRef} className="mx-auto max-w-7xl pb-10">
      <div data-enterprise-shell className="space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between px-2">
          <div className="min-w-0">
            <h1
              data-enterprise-reveal
              className="text-3xl font-bold tracking-tight text-ent-text sm:text-4xl"
            >
              Enterprise Overview
            </h1>
            <p data-enterprise-reveal className="mt-1 text-sm text-muted-foreground max-w-xl leading-relaxed">
              Real-time monitoring of your verification operations, team performance, and compliance metrics.
            </p>
          </div>

          <div data-enterprise-reveal className="flex flex-col sm:flex-row gap-3">
             <Button variant="outline" className="h-10 rounded-xl border-ent-border bg-ent-muted px-4 text-ent-text hover:bg-ent-text/5 hover:border-verza-emerald/30 transition-all">
               Configure
               <Wrench className="h-4 w-4 ml-2 opacity-50" />
             </Button>
            <Link href="/enterprise/requests">
              <Button className="h-10 rounded-xl bg-verza-emerald px-6 text-sm font-bold text-[#06140F] hover:bg-verza-emerald/90 transition-all w-full sm:w-auto shadow-[0_4px_14px_rgba(30,215,96,0.25)]">
                Create Verification
              </Button>
            </Link>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-2">
          <EnterpriseMetricCard
            label="Total Verifications"
            value={totalVerifications.toLocaleString()}
            subtitle="from last month"
            accent="positive"
            icon={TrendingUp}
            trend={{ value: "+8.4%", isPositive: true }}
          />
          <EnterpriseMetricCard
            label="Quota Usage"
            value={quotaUsed}
            subtitle={`${licenseUsage?.usedQuota?.toLocaleString() ?? 0} / ${licenseUsage?.monthlyQuota?.toLocaleString() ?? 0} reqs`}
            icon={Zap}
          />
          <EnterpriseMetricCard
            label="Pending Reviews"
            value={pendingRequests.toString()}
            subtitle="Requires attention"
            accent="warning"
            icon={Users}
            trend={{ value: "Action needed", isPositive: false }}
          />
          <EnterpriseMetricCard
            label="Failed / Rejected"
            value={rejectedRequests.toString()}
            subtitle="1% rejection rate"
            icon={AlertCircle}
            trend={{ value: "-2.1%", isPositive: true }}
          />
        </div>

        {/* Charts & Map */}
        <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          <motion.div data-enterprise-panel className="h-full">
             <EnterpriseVolumeChart bars={volumeBars} />
          </motion.div>
          <motion.div data-enterprise-panel className="h-full">
            <EnterpriseActivityMap />
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="grid gap-5 lg:grid-cols-[1fr_2.5fr]">
          {/* Quick Actions & Plan */}
          <div className="space-y-5">
            <motion.div data-enterprise-panel className="enterprise-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm font-semibold text-ent-text">Quick Actions</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <Link key={action.href} href={action.href}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex flex-col items-start gap-3 rounded-xl border border-ent-border bg-ent-muted p-4 hover:bg-verza-emerald/5 hover:border-verza-emerald/30 transition-all group cursor-pointer h-full"
                    >
                      <div className="p-2 rounded-lg bg-ent-text/5 group-hover:bg-verza-emerald/10 border border-transparent group-hover:border-verza-emerald/20 transition-colors">
                        <action.icon className="h-4 w-4 text-verza-gray group-hover:text-verza-emerald transition-colors" />
                      </div>
                      <span className="text-[12px] font-medium text-ent-text/90 leading-tight group-hover:text-verza-emerald transition-colors">{action.label}</span>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div data-enterprise-panel className="enterprise-card rounded-2xl p-6 relative overflow-hidden group hover:border-verza-emerald/20 transition-all">
               <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-verza-emerald/10 blur-3xl rounded-full pointer-events-none transition-all group-hover:bg-verza-emerald/20" />
              <div className="flex items-center justify-between relative z-10">
                <p className="text-[11px] uppercase tracking-widest text-verza-gray font-medium">Business Plan</p>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-verza-emerald/10 border border-verza-emerald/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-verza-emerald animate-pulse" />
                  <span className="text-[9px] uppercase tracking-wider text-verza-emerald font-bold">Active</span>
                </div>
              </div>
              <div className="mt-5 relative z-10">
                <p className="text-2xl font-bold tracking-tight text-ent-text">{licenseUsage?.planName ?? "Enterprise"}</p>
                <div className="mt-4 flex items-center gap-4 bg-ent-muted border border-ent-border p-3 rounded-xl">
                  <div className="flex-1">
                     <p className="text-[10px] text-verza-gray uppercase tracking-wider mb-1">SLA Uptime</p>
                     <p className="text-sm font-bold text-ent-text flex items-center gap-1"><Check className="h-3 w-3 text-verza-emerald"/> {licenseUsage?.slaUptime?.toFixed(2) ?? "99.99"}%</p>
                  </div>
                  <div className="w-px h-8 bg-ent-text/10" />
                  <div className="flex-1 pl-2">
                     <p className="text-[10px] text-verza-gray uppercase tracking-wider mb-1">Network Days</p>
                     <p className="text-sm font-bold text-ent-text">1,220</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recent Verifications */}
          <motion.div data-enterprise-panel className="enterprise-card rounded-2xl flex flex-col overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-ent-border bg-ent-muted/30">
              <div>
                <p className="text-sm font-semibold text-ent-text flex items-center gap-2"><Clock className="w-4 h-4 text-verza-gray/80"/> Recent Verifications</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-verza-gray/60" />
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search records..."
                    className="h-9 w-full sm:w-48 rounded-lg border border-ent-border bg-ent-muted pl-9 pr-3 text-xs text-ent-text outline-none placeholder:text-verza-gray/60 focus:border-verza-emerald/30 focus:bg-ent-card transition-all"
                  />
                </div>
                <Link href="/enterprise/requests">
                  <Button variant="ghost" className="h-9 px-3 text-xs font-medium text-verza-gray hover:text-ent-text hover:bg-ent-text/5 rounded-lg border border-transparent hover:border-ent-border transition-all">
                    View All
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto bg-ent-card">
              {filteredVerifications.length > 0 ? (
                <div className="min-w-[600px] p-2">
                  <div className="grid grid-cols-[1.5fr_1fr_1fr_auto] gap-4 px-4 py-3 text-[10px] uppercase tracking-wider text-verza-gray/60 font-medium border-b border-ent-border/50 mb-1">
                    <span>Subject</span>
                    <span>Type</span>
                    <span>Status</span>
                    <span className="text-right w-10">Act</span>
                  </div>

                  <div className="space-y-1">
                    {filteredVerifications.map((item) => (
                      <div
                        key={item.verificationId}
                        data-enterprise-row
                        className="group grid grid-cols-[1.5fr_1fr_1fr_auto] items-center gap-4 px-4 py-3 rounded-xl hover:bg-ent-muted/80 border border-transparent hover:border-ent-border/50 transition-colors cursor-pointer"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-medium text-ent-text/90 group-hover:text-ent-text transition-colors">{item.subject || item.verificationId}</p>
                          <p className="mt-0.5 truncate text-[11px] text-verza-gray/60 font-mono">
                            {new Date(item.createdAt).toLocaleString()}
                          </p>
                        </div>

                        <div className="min-w-0">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-ent-text/5 text-verza-gray">
                            {formatStatusLabel(item.type)}
                          </span>
                        </div>

                        <div>
                          {item.status === "verified" ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-verza-emerald/10 border border-verza-emerald/20 text-[10px] font-semibold text-verza-emerald shadow-[0_0_10px_rgba(30,215,96,0.1)]">
                              <Check className="w-3 h-3 mr-1" /> Verified
                            </span>
                          ) : item.status === "pending" ? (
                             <span className="inline-flex items-center px-2 py-1 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-[10px] font-semibold text-yellow-500">
                               Pending
                             </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-ent-muted border border-ent-border text-[10px] font-medium text-verza-gray">
                              {formatStatusLabel(item.status)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-end w-10">
                           <div className="p-1.5 rounded-lg bg-ent-text/5 opacity-0 group-hover:opacity-100 transition-all">
                             <ArrowRight className="h-3.5 w-3.5 text-verza-emerald" />
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex h-40 flex-col items-center justify-center text-center">
                  <div className="rounded-full bg-ent-muted border border-ent-border p-4 mb-3">
                    <Search className="h-5 w-5 text-verza-gray/50" />
                  </div>
                  <p className="text-sm font-medium text-ent-text/80">No records found</p>
                  <p className="text-xs text-verza-gray/60 mt-1">Try adjusting your search criteria</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
