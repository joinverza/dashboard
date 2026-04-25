import { Link } from "wouter";
import { motion } from "framer-motion";
import { BarChart3, FileClock, Shield, ArrowRight, TrendingUp, FileText, AlertCircle, CheckCircle2 } from "lucide-react";

const cards = [
  {
    icon: BarChart3,
    label: "Analytics",
    description: "Verification trends, performance KPIs, and deep operational metrics across all pipelines.",
    href: "/enterprise/analytics",
    accent: "emerald" as const,
    stat: "98.4%",
    statLabel: "Success rate",
    tag: "Live",
    features: ["Volume trends", "Success rates", "Geo breakdown", "Time analysis"],
  },
  {
    icon: Shield,
    label: "Compliance",
    description: "Generate, schedule, and track compliance-oriented reports for regulatory obligations.",
    href: "/enterprise/compliance",
    accent: "blue" as const,
    stat: "24",
    statLabel: "Reports ready",
    tag: "Scheduled",
    features: ["SOC 2 reports", "Audit exports", "Risk assessments", "GDPR logs"],
  },
  {
    icon: FileClock,
    label: "Audit Trail",
    description: "Full tamper-proof timeline of every verification event with cryptographic evidence.",
    href: "/enterprise/audit",
    accent: "purple" as const,
    stat: "1,402",
    statLabel: "Events logged",
    tag: "Immutable",
    features: ["Event timeline", "Actor tracking", "Resource history", "Integrity proof"],
  },
];

const accentStyles = {
  emerald: {
    glow: "bg-verza-emerald/5",
    icon: "bg-verza-emerald/10 border-verza-emerald/20 text-verza-emerald",
    badge: "bg-verza-emerald/10 text-verza-emerald border-verza-emerald/20",
    stat: "text-verza-emerald",
    hover: "hover:border-verza-emerald/30",
    bar: "bg-verza-emerald",
  },
  blue: {
    glow: "bg-blue-500/5",
    icon: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    stat: "text-blue-400",
    hover: "hover:border-blue-500/30",
    bar: "bg-blue-400",
  },
  purple: {
    glow: "bg-purple-500/5",
    icon: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    badge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    stat: "text-purple-400",
    hover: "hover:border-purple-500/30",
    bar: "bg-purple-400",
  },
};

const summaryStats = [
  { label: "Total Reports", value: "127", icon: FileText, trend: "+12 this month" },
  { label: "Compliance Score", value: "99.2%", icon: CheckCircle2, trend: "Fully certified" },
  { label: "Open Findings", value: "3", icon: AlertCircle, trend: "Down from 8" },
  { label: "Avg. Report Time", value: "4.2s", icon: TrendingUp, trend: "↓ 18% faster" },
];

export default function ReportsHub() {
  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-verza-emerald/10 border border-verza-emerald/20 text-[10px] uppercase tracking-[0.2em] text-verza-emerald font-semibold mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-verza-emerald animate-pulse" />
            Reporting Center
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-ent-text sm:text-4xl">Reports</h1>
          <p className="text-verza-gray/80 mt-2 max-w-lg leading-relaxed">
            Analytics, compliance, and audit reporting — all in one unified workspace.
          </p>
        </div>
      </motion.div>

      {/* Summary Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {summaryStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.06 }}
            className="enterprise-card rounded-2xl p-4 flex items-center gap-3"
          >
            <div className="p-2 rounded-xl bg-verza-emerald/10 border border-verza-emerald/15 text-verza-emerald flex-shrink-0">
              <stat.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-verza-gray/70 truncate">{stat.label}</p>
              <p className="text-lg font-bold text-ent-text tracking-tight">{stat.value}</p>
              <p className="text-[10px] text-verza-emerald/80 truncate">{stat.trend}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Report Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {cards.map((card, i) => {
          const styles = accentStyles[card.accent];
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
              whileHover={{ y: -4, scale: 1.01 }}
            >
              <Link href={card.href}>
                <div className={`enterprise-card relative overflow-hidden rounded-2xl p-6 cursor-pointer group h-full flex flex-col border-ent-border transition-all duration-300 ${styles.hover}`}>
                  {/* Glow */}
                  <div className={`absolute inset-0 ${styles.glow} pointer-events-none`} />

                  {/* Header */}
                  <div className="relative z-10 flex items-start justify-between mb-5">
                    <div className={`p-3 rounded-xl border ${styles.icon}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${styles.badge}`}>
                      {card.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="relative z-10 flex-1">
                    <h3 className="text-lg font-bold text-ent-text tracking-tight">{card.label}</h3>
                    <p className="text-[13px] text-verza-gray/70 mt-1.5 leading-relaxed">{card.description}</p>

                    {/* Features */}
                    <ul className="mt-4 space-y-1.5">
                      {card.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-[12px] text-verza-gray/80">
                          <div className={`h-1 w-1 rounded-full ${styles.bar}`} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Stat & CTA */}
                  <div className="relative z-10 mt-6 pt-4 border-t border-ent-border flex items-center justify-between">
                    <div>
                      <p className={`text-2xl font-bold tracking-tight ${styles.stat}`}>{card.stat}</p>
                      <p className="text-[11px] text-verza-gray/60">{card.statLabel}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[12px] font-semibold text-ent-text/60 group-hover:text-ent-text transition-colors">
                      Open <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom CTA Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="enterprise-card relative overflow-hidden rounded-2xl p-6"
      >
        <div className="absolute inset-0 bg-verza-emerald/5 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-verza-emerald/10 border border-verza-emerald/20 text-verza-emerald">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-ent-text">Ontiver Compliance Guarantee</p>
              <p className="text-[13px] text-verza-gray/70 mt-0.5">All reports are cryptographically signed and blockchain-anchored.</p>
            </div>
          </div>
          <Link href="/enterprise/compliance">
            <button className="whitespace-nowrap px-5 py-2.5 rounded-xl bg-verza-emerald text-[#06140F] text-sm font-bold hover:bg-verza-emerald/90 transition-all shadow-[0_4px_14px_rgba(30,215,96,0.25)]">
              View Compliance →
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
