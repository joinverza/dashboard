import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import ThemeToggle from "@/components/shared/ThemeToggle";
import NotificationPopover from "@/components/shared/NotificationPopover";
import MessagePopover from "@/components/shared/MessagePopover";
import UserProfileDropdown from "@/components/shared/UserProfileDropdown";
import { useAuth, type UserRole } from "@/features/auth/AuthContext";
import { useLocation } from "wouter";

interface HeaderProps {
  onMobileMenuOpen?: () => void;
}

export default function Header({ onMobileMenuOpen }: HeaderProps) {
  const { user, login } = useAuth();
  const [, setLocation] = useLocation();

  const handleRoleChange = (role: UserRole) => {
    login(role);
    // Optional: Redirect to the dashboard of the selected role
    if (role === "user") setLocation("/app");
    else if (role === "verifier") setLocation("/verifier");
    else if (role === "enterprise") setLocation("/enterprise");
    else if (role === "admin") setLocation("/admin");
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-20 flex h-20 items-center justify-between gap-6 glass-header px-6 md:px-8"
      data-testid="header"
    >
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onMobileMenuOpen}
          className="md:hidden p-2.5 hover:bg-white/10 rounded-xl transition-colors border border-transparent hover:border-white/10"
          data-testid="button-mobile-menu"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </motion.button>
        
        {/* Role Switcher for Development/Demo */}
        <div className="hidden md:flex items-center gap-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            Current View
          </span>
          <div className="relative">
            <select
              value={user?.role || "user"}
              onChange={(e) => handleRoleChange(e.target.value as UserRole)}
              className="appearance-none pl-4 pr-10 py-2 rounded-xl text-sm font-medium bg-white/5 border border-white/10 text-foreground focus:outline-none focus:ring-2 focus:ring-verza-emerald/50 cursor-pointer hover:bg-white/10 transition-colors"
              title="Switch Role (Dev Tool)"
            >
              <option value="user">User Dashboard</option>
              <option value="verifier">Verifier Dashboard</option>
              <option value="enterprise">Enterprise Dashboard</option>
              <option value="admin">Admin Dashboard</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <MessagePopover />
        <NotificationPopover />
        <div className="h-8 w-[1px] bg-white/10 mx-2 hidden md:block" />
        <ThemeToggle />
        <div className="h-8 w-[1px] bg-white/10 mx-2 hidden md:block" />
        <UserProfileDropdown />
      </div>
    </motion.header>
  );
}
