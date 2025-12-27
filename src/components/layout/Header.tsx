import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import ThemeToggle from "@/components/shared/ThemeToggle";
import NotificationPopover from "@/components/shared/NotificationPopover";
import MessagePopover from "@/components/shared/MessagePopover";
import UserProfileDropdown from "@/components/shared/UserProfileDropdown";
import { Separator } from "@/components/ui/separator";
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
      className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/80 backdrop-blur-xl px-4 md:px-6"
      data-testid="header"
    >
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onMobileMenuOpen}
          className="md:hidden p-2 hover:bg-verza-emerald/10 rounded-lg transition-colors"
          data-testid="button-mobile-menu"
        >
          <Menu className="w-5 h-5 text-verza-emerald" />
        </motion.button>
        
        {/* Role Switcher for Development/Demo */}
        <select
          value={user?.role || "user"}
          onChange={(e) => handleRoleChange(e.target.value as UserRole)}
          className="hidden md:block p-1 border rounded text-sm bg-background border-border text-foreground focus:outline-none focus:ring-1 focus:ring-verza-emerald"
          title="Switch Role (Dev Tool)"
        >
          <option value="user">User</option>
          <option value="verifier">Verifier</option>
          <option value="enterprise">Enterprise</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="flex items-center gap-1 md:gap-2">
        <MessagePopover />
        <NotificationPopover />
        <Separator
          orientation="vertical"
          className="h-6 mx-2 hidden md:block"
        />
        <ThemeToggle />
        <Separator
          orientation="vertical"
          className="h-6 mx-2 hidden md:block"
        />
        <UserProfileDropdown />
      </div>
    </motion.header>
  );
}
