import {
  LayoutDashboard,
  FileBadge,
  Store,
  Wallet,
  BarChart3,
  Settings,
  Briefcase,
  CheckCircle2,
  Clock,
  DollarSign,
  Award,
  User,
  Users,
  Upload,
  FileText,
  Key,
  Gavel,
  Vote,
  Server,
} from "lucide-react";

export interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const userNavItems: NavItem[] = [
  { path: "/app", label: "Dashboard", icon: LayoutDashboard },
  { path: "/app/credentials", label: "Credentials", icon: FileBadge },
  { path: "/app/marketplace", label: "Marketplace", icon: Store },
  { path: "/app/wallet", label: "Wallet", icon: Wallet },
  { path: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/app/settings", label: "Settings", icon: Settings },
];

export const verifierNavItems: NavItem[] = [
  { path: "/verifier", label: "Dashboard", icon: LayoutDashboard },
  { path: "/verifier/jobs", label: "Job Board", icon: Briefcase },
  { path: "/verifier/active", label: "Active Jobs", icon: Clock },
  { path: "/verifier/completed", label: "Completed", icon: CheckCircle2 },
  { path: "/verifier/earnings", label: "Earnings", icon: DollarSign },
  { path: "/verifier/reputation", label: "Reputation", icon: Award },
  { path: "/verifier/profile", label: "Profile", icon: User },
  { path: "/verifier/settings", label: "Settings", icon: Settings },
];

export const enterpriseNavItems: NavItem[] = [
  { path: "/enterprise", label: "Dashboard", icon: LayoutDashboard },
  { path: "/enterprise/bulk", label: "Bulk Verification", icon: Upload },
  { path: "/enterprise/requests", label: "Requests", icon: FileText },
  { path: "/enterprise/team", label: "Team", icon: Users },
  { path: "/enterprise/api", label: "API", icon: Key },
  { path: "/enterprise/billing", label: "Billing", icon: DollarSign },
  { path: "/enterprise/settings", label: "Settings", icon: Settings },
];

export const adminNavItems: NavItem[] = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/users", label: "Users", icon: Users },
  { path: "/admin/verifications", label: "Requests", icon: FileText },
  { path: "/admin/verifiers", label: "Verifiers", icon: Award },
  { path: "/admin/credentials", label: "Credentials", icon: FileBadge },
  { path: "/admin/disputes", label: "Disputes", icon: Gavel },
  { path: "/admin/governance", label: "Governance", icon: Vote },
  { path: "/admin/system", label: "System", icon: Server },
  { path: "/admin/settings", label: "Settings", icon: Settings },
];
