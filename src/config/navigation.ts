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
  FileText,
  Key,
  Gavel,
  Vote,
  Server,
  Shield,
  Wrench,
  MailCheck,
} from "lucide-react";

export interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  group?: string;
}

export const userNavItems: NavItem[] = [
  { path: "/app", label: "Dashboard", icon: LayoutDashboard },
  { path: "/app/getting-started", label: "Getting Started", icon: FileText },
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
  { path: "/enterprise", label: "Dashboard", icon: LayoutDashboard, group: "MAIN" },
  { path: "/enterprise/verifications", label: "Verifications", icon: Shield, group: "MAIN" },
  { path: "/enterprise/email-verifications", label: "Email Verification", icon: MailCheck, group: "MAIN" },
  { path: "/enterprise/tools", label: "Operations Hub", icon: Wrench, group: "OPERATIONS" },
  { path: "/enterprise/users", label: "Users", icon: Users, group: "OPERATIONS" },
  { path: "/enterprise/reports", label: "Reports", icon: BarChart3, group: "REPORTS" },
  { path: "/enterprise/platform", label: "Platform", icon: Wrench, group: "REPORTS" },
];

export const managerNavItems: NavItem[] = [
  { path: "/manager", label: "Dashboard", icon: LayoutDashboard },
  { path: "/manager/requests", label: "Requests", icon: FileText },
  { path: "/manager/verifications", label: "Verifications", icon: Shield },
  { path: "/manager/email-verifications", label: "Email Verification", icon: MailCheck },
  { path: "/manager/kyb", label: "KYB Wizard", icon: Shield },
  { path: "/manager/tools", label: "Operations Hub", icon: Wrench },
  { path: "/manager/team", label: "Team", icon: Users },
  { path: "/manager/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/manager/compliance", label: "Compliance", icon: Shield },
  { path: "/manager/compliance/workflows", label: "Case Workflows", icon: FileText },
  { path: "/manager/settings", label: "Settings", icon: Settings },
];

export const adminNavItems: NavItem[] = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard, group: "MAIN" },
  { path: "/admin/users", label: "Users", icon: Users, group: "MAIN" },
  { path: "/admin/verifications", label: "Requests", icon: FileText, group: "MAIN" },
  { path: "/admin/tools/verifications", label: "Verifications", icon: Shield, group: "MAIN" },
  { path: "/admin/tools/operations", label: "Operations Hub", icon: Wrench, group: "OPERATIONS" },
  { path: "/admin/tools/auditor", label: "Auditor Tools", icon: FileText, group: "OPERATIONS" },
  { path: "/admin/tools/support", label: "Support Tools", icon: Users, group: "OPERATIONS" },
  { path: "/admin/tools/developer", label: "Developer Tools", icon: Key, group: "OPERATIONS" },
  { path: "/admin/verifiers", label: "Verifiers", icon: Award, group: "OVERSIGHT" },
  { path: "/admin/credentials", label: "Credentials", icon: FileBadge, group: "OVERSIGHT" },
  { path: "/admin/disputes", label: "Disputes", icon: Gavel, group: "OVERSIGHT" },
  { path: "/admin/governance", label: "Governance", icon: Vote, group: "OVERSIGHT" },
  { path: "/admin/system", label: "System", icon: Server, group: "PLATFORM" },
  { path: "/admin/security", label: "Security", icon: Shield, group: "PLATFORM" },
  { path: "/admin/settings", label: "Settings", icon: Settings, group: "PLATFORM" },
];
