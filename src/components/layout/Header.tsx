import { motion } from "framer-motion";
import { Menu, ShieldCheck } from "lucide-react";
import { useLocation } from "wouter";
import ThemeToggle from "@/components/shared/ThemeToggle";
import NotificationPopover from "@/components/shared/NotificationPopover";
import MessagePopover from "@/components/shared/MessagePopover";
import UserProfileDropdown from "@/components/shared/UserProfileDropdown";
import { useAuth } from "@/features/auth/AuthContext";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onMobileMenuOpen?: () => void;
  variant?: "default" | "enterprise";
  roleLabel?: string;
}

const formatShellTitle = (location: string, basePath: string) =>
  location
    .replace(basePath, "")
    .split("/")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" / ") || "Dashboard";

export default function Header({ onMobileMenuOpen, variant = "default", roleLabel = "Enterprise" }: HeaderProps) {
  const { user } = useAuth();
  const [location] = useLocation();
  const usesEnterpriseShell = variant === "enterprise";
  const basePath = location.startsWith("/admin")
    ? "/admin"
    : location.startsWith("/enterprise")
      ? "/enterprise"
      : "";
  const shellPageTitle = basePath ? formatShellTitle(location, basePath) : "Dashboard";
  const shellHeading = `${roleLabel} Dashboard`;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "sticky top-0 z-20 flex items-center justify-between gap-6 px-6 md:px-8",
        usesEnterpriseShell
          ? "enterprise-header h-[76px]"
          : "glass-header h-20"
      )}
      data-testid="header"
    >
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onMobileMenuOpen}
          className={cn(
            "md:hidden p-2.5 rounded-xl transition-colors border",
            usesEnterpriseShell
              ? "bg-ent-muted border-ent-border text-ent-text/70 hover:bg-ent-card hover:text-ent-text"
              : "bg-transparent border-transparent hover:bg-white/10 hover:border-white/10 text-foreground"
          )}
          data-testid="button-mobile-menu"
        >
          <Menu className="w-5 h-5" />
        </motion.button>

        {usesEnterpriseShell && (
          <div className="flex min-w-0 flex-col leading-tight md:hidden">
            <span className="truncate text-xs font-semibold text-ent-text">{shellHeading}</span>
            <span className="truncate text-[10px] uppercase tracking-[0.18em] text-verza-gray/70">{shellPageTitle}</span>
          </div>
        )}
        
        <div className="hidden md:flex items-center gap-4">
          {usesEnterpriseShell ? (
            <>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-ent-text">{shellHeading}</span>
                <span className="text-[11px] uppercase tracking-[0.18em] text-verza-gray/80">{shellPageTitle}</span>
              </div>
            </>
          ) : (
            <>
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                Role
              </span>
              <span className="px-3 py-1.5 rounded-xl text-sm font-medium bg-white/5 border border-white/10 text-foreground">
                {user?.role ?? "guest"}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {usesEnterpriseShell && (
          <div className="hidden lg:flex items-center gap-2 rounded-full border border-verza-emerald/20 bg-verza-emerald/5 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-verza-emerald">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="font-semibold">Secure session</span>
          </div>
        )}
        <MessagePopover variant={variant} />
        <NotificationPopover variant={variant} />
        {!usesEnterpriseShell && <div className={cn("h-8 w-[1px] mx-1 md:mx-2 hidden md:block bg-white/10")} />}
        <ThemeToggle variant={variant} />
        {!usesEnterpriseShell && <div className={cn("h-8 w-[1px] mx-1 md:mx-2 hidden md:block bg-white/10")} />}
        <UserProfileDropdown variant={variant} />
      </div>
    </motion.header>
  );
}
