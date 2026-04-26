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
}

export default function Header({ onMobileMenuOpen, variant = "default" }: HeaderProps) {
  const { user } = useAuth();
  const [location] = useLocation();
  const isEnterprise = variant === "enterprise";
  const enterprisePageTitle = location.startsWith("/enterprise")
    ? location
        .replace("/enterprise", "")
        .split("/")
        .filter(Boolean)
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(" / ") || "Dashboard"
    : "Dashboard";

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "sticky top-0 z-20 flex items-center justify-between gap-6 px-6 md:px-8",
        isEnterprise
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
            isEnterprise
              ? "bg-white/[0.05] border-white/10 text-white/80 hover:bg-white/[0.1] hover:text-white"
              : "bg-transparent border-transparent hover:bg-white/10 hover:border-white/10 text-foreground"
          )}
          data-testid="button-mobile-menu"
        >
          <Menu className="w-5 h-5" />
        </motion.button>
        
        <div className="hidden md:flex items-center gap-4">
          {isEnterprise ? (
            <>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-enterprise-bg">Enterprise Dashboard</span>
                <span className="text-[11px] uppercase tracking-[0.18em] text-verza-gray/80">{enterprisePageTitle}</span>
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
        {isEnterprise && (
          <div className="hidden lg:flex items-center gap-2 rounded-full border border-verza-emerald/20 bg-verza-emerald/5 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-verza-emerald">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="font-semibold">Secure session</span>
          </div>
        )}
        <MessagePopover variant={variant} />
        <NotificationPopover variant={variant} />
        {!isEnterprise && <div className={cn("h-8 w-[1px] mx-1 md:mx-2 hidden md:block bg-white/10")} />}
        <ThemeToggle />
        {!isEnterprise && <div className={cn("h-8 w-[1px] mx-1 md:mx-2 hidden md:block bg-white/10")} />}
        <UserProfileDropdown variant={variant} />
      </div>
    </motion.header>
  );
}
