import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import ThemeToggle from "@/components/shared/ThemeToggle";
import NotificationPopover from "@/components/shared/NotificationPopover";
import MessagePopover from "@/components/shared/MessagePopover";
import UserProfileDropdown from "@/components/shared/UserProfileDropdown";
import { useAuth } from "@/features/auth/AuthContext";

interface HeaderProps {
  onMobileMenuOpen?: () => void;
}

export default function Header({ onMobileMenuOpen }: HeaderProps) {
  const { user } = useAuth();

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
        
        <div className="hidden md:flex items-center gap-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
            Role
          </span>
          <span className="px-3 py-1.5 rounded-xl text-sm font-medium bg-white/5 border border-white/10 text-foreground">
            {user?.role ?? "guest"}
          </span>
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
