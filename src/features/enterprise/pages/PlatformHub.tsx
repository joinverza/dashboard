import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  Code, CreditCard, PlugZap, Settings, Users,
  ArrowRight, Key, Webhook, Activity, Clock,
  Shield, Zap, Server
} from "lucide-react";

const platformCards = [
  {
    icon: Code,
    label: "API Management",
    description: "Manage API keys, configure scopes, monitor usage, and control webhook delivery.",
    href: "/enterprise/api",
    accent: "emerald" as const,
    stat: "3",
    statLabel: "Active keys",
    badge: "Developer",
    features: ["API Keys", "Webhooks", "Rate limits", "Request logs"],
    subIcons: [Key, Webhook, Activity],
  },
  {
    icon: PlugZap,
    label: "Integrations",
    description: "Configure and monitor external service integrations including CRMs, SIEM, and more.",
    href: "/enterprise/integrations",
    accent: "blue" as const,
    stat: "7",
    statLabel: "Connected",
    badge: "Synced",
    features: ["Salesforce", "Slack", "Zapier", "SIEM"],
    subIcons: [Server, Zap, Activity],
  },
  {
    icon: CreditCard,
    label: "Billing",
    description: "View plans, track usage quotas, manage payment methods, and download invoices.",
    href: "/enterprise/billing",
    accent: "purple" as const,
    stat: "$2,450",
    statLabel: "This cycle",
    badge: "Business",
    features: ["Plan & quotas", "Payment methods", "Invoice history", "Cost analysis"],
    subIcons: [Shield, Clock, Activity],
  },
  {
    icon: Users,
    label: "Team",
    description: "Invite collaborators, assign roles, and manage access permissions for your workspace.",
    href: "/enterprise/team",
    accent: "orange" as const,
    stat: "12",
    statLabel: "Members",
    badge: "Active",
    features: ["Member roles", "Invitations", "Permissions", "Activity log"],
    subIcons: [Users, Shield, Activity],
  },
  {
    icon: Settings,
    label: "Settings",
    description: "Configure organization profile, security policies, MFA, and notification preferences.",
    href: "/enterprise/settings",
    accent: "gray" as const,
    stat: "99.9%",
    statLabel: "SLA Uptime",
    badge: "Configured",
    features: ["Company profile", "Security & MFA", "Notifications", "Data retention"],
    subIcons: [Shield, Settings, Activity],
  },
];

const accentStyles = {
  emerald: {
    glow: "bg-verza-emerald/5",
    icon: "bg-verza-emerald/10 border-verza-emerald/20 text-verza-emerald",
    badge: "bg-verza-emerald/10 text-verza-emerald border-verza-emerald/20",
    stat: "text-verza-emerald",
    hover: "hover:border-verza-emerald/30",
    dot: "bg-verza-emerald",
  },
  blue: {
    glow: "bg-blue-500/5",
    icon: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    badge: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    stat: "text-blue-400",
    hover: "hover:border-blue-500/30",
    dot: "bg-blue-400",
  },
  purple: {
    glow: "bg-purple-500/5",
    icon: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    badge: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    stat: "text-purple-400",
    hover: "hover:border-purple-500/30",
    dot: "bg-purple-400",
  },
  orange: {
    glow: "bg-orange-500/5",
    icon: "bg-orange-500/10 border-orange-500/20 text-orange-400",
    badge: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    stat: "text-orange-400",
    hover: "hover:border-orange-500/30",
    dot: "bg-orange-400",
  },
  gray: {
    glow: "bg-white/5",
    icon: "bg-ent-muted border-ent-border text-verza-gray",
    badge: "bg-ent-muted text-verza-gray border-ent-border",
    stat: "text-ent-text",
    hover: "hover:border-ent-border/60",
    dot: "bg-verza-gray",
  },
};

const systemStats = [
  { label: "API Uptime", value: "99.98%", positive: true },
  { label: "Requests Today", value: "14,820" },
  { label: "Active Webhooks", value: "6" },
  { label: "Team Members", value: "12" },
];

export default function PlatformHub() {
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
            Platform Controls
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-ent-text sm:text-4xl">Platform</h1>
          <p className="text-verza-gray/80 mt-2 max-w-lg leading-relaxed">
            Enterprise controls for integrations, API management, billing, team, and configuration.
          </p>
        </div>
      </motion.div>

      {/* System Health Bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="enterprise-card rounded-2xl p-4"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <span className="h-2 w-2 rounded-full bg-verza-emerald animate-ping absolute opacity-60" />
              <span className="h-2 w-2 rounded-full bg-verza-emerald relative" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ent-text">All systems operational</p>
              <p className="text-[11px] text-verza-gray/70">Last checked: Just now</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            {systemStats.map((s) => (
              <div key={s.label} className="text-center">
                <p className={`text-base font-bold tracking-tight ${s.positive ? "text-verza-emerald" : "text-ent-text"}`}>{s.value}</p>
                <p className="text-[10px] text-verza-gray/60 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Platform Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {platformCards.map((card, i) => {
          const styles = accentStyles[card.accent];
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.08 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className={i === 4 ? "md:col-span-2 xl:col-span-1" : ""}
            >
              <Link href={card.href}>
                <div className={`enterprise-card relative overflow-hidden rounded-2xl p-6 cursor-pointer group h-full flex flex-col border-ent-border transition-all duration-300 ${styles.hover}`}>
                  {/* Glow */}
                  <div className={`absolute inset-0 ${styles.glow} pointer-events-none`} />

                  {/* Header Row */}
                  <div className="relative z-10 flex items-start justify-between mb-5">
                    <div className={`p-3 rounded-xl border ${styles.icon}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${styles.badge}`}>
                      {card.badge}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 flex-1">
                    <h3 className="text-lg font-bold text-ent-text tracking-tight">{card.label}</h3>
                    <p className="text-[13px] text-verza-gray/70 mt-1.5 leading-relaxed">{card.description}</p>

                    <ul className="mt-4 space-y-1.5">
                      {card.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-[12px] text-verza-gray/80">
                          <div className={`h-1 w-1 rounded-full flex-shrink-0 ${styles.dot}`} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer */}
                  <div className="relative z-10 mt-6 pt-4 border-t border-ent-border flex items-center justify-between">
                    <div>
                      <p className={`text-xl font-bold tracking-tight ${styles.stat}`}>{card.stat}</p>
                      <p className="text-[11px] text-verza-gray/60">{card.statLabel}</p>
                    </div>
                    <div className="flex items-center gap-1 text-[12px] font-semibold text-ent-text/50 group-hover:text-ent-text transition-colors">
                      Open <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Quick status footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="enterprise-card rounded-2xl p-5"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-verza-emerald/10 border border-verza-emerald/20 text-verza-emerald">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ent-text">Enterprise Security Active</p>
              <p className="text-[12px] text-verza-gray/70">MFA enforced · End-to-end encryption · Audit logging enabled</p>
            </div>
          </div>
          <Link href="/enterprise/settings">
            <button className="text-[12px] font-semibold text-verza-emerald hover:text-verza-emerald/80 transition-colors flex items-center gap-1">
              Configure Security <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
