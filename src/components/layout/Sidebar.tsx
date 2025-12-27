import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import versalogo from "@/assets/versalogoSVG.svg";
import type { NavItem } from "@/config/navigation";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  navItems: NavItem[];
}

export default function Sidebar({ collapsed, onToggle, navItems }: SidebarProps) {
  const [location] = useLocation();

  return (
    <motion.aside
      className={cn(
        "glass-sidebar h-screen fixed left-0 top-0 z-30",
        "transition-all duration-300 ease-in-out flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="p-6 flex-1 overflow-y-auto scrollbar-none">
        {/* Logo */}
        <motion.div
          className={cn(
            "flex items-center mb-10",
            collapsed ? "justify-center" : "gap-3"
          )}
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            className="relative p-1 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/5"
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <img
              src={versalogo}
              alt="Verza logo"
              className="w-8 h-8 object-contain drop-shadow-[0_0_10px_rgba(141,198,63,0.3)]"
            />
          </motion.div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col"
            >
              <span className="text-lg font-bold text-foreground tracking-tight">
                Verza
              </span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                Dashboard
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Navigation */}
        <nav className="flex flex-col gap-4">
          {navItems.map((item, index) => {
            const isActive = location === item.path || (location !== '/' && item.path !== '/' && location.startsWith(item.path));
            const Icon = item.icon;

            return (
              <Link key={item.path} href={item.path}>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: collapsed ? 0 : 4, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 cursor-pointer border border-transparent",
                    isActive
                      ? "bg-verza-emerald/10 border-verza-emerald/20 shadow-[0_0_20px_-5px_rgba(141,198,63,0.3)]"
                      : "text-muted-foreground hover:text-foreground hover:border-white/5"
                  )}
                >
                  <div className={cn(
                    "p-1.5 rounded-lg transition-colors duration-300",
                    isActive ? "bg-verza-emerald text-white" : "bg-white/5 text-muted-foreground group-hover:bg-white/10 group-hover:text-foreground"
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={cn(
                        "font-medium text-sm tracking-wide",
                        isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </motion.span>
                  )}
                  
                  {!collapsed && isActive && (
                    <motion.div
                      layoutId="active-indicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-verza-emerald shadow-[0_0_8px_rgba(141,198,63,0.8)]"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Toggle */}
      <div className="p-4 border-t border-white/10">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onToggle}
          className={cn(
            "w-full py-2 px-3 flex items-center justify-center gap-2",
            "rounded-xl bg-white/5 hover:bg-white/10 border border-white/5",
            "transition-all duration-200 text-muted-foreground hover:text-foreground text-sm font-medium"
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse View</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.aside>
  );
}
