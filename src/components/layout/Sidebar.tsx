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
        "h-screen fixed left-0 top-0 border-r border-verza-emerald/20 bg-verza-black z-30",
        "transition-all duration-100 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
      style={{
        boxShadow: "0 0 40px rgba(141, 198, 63, 0.1)",
      }}
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4">
        {/* Logo */}
        <motion.div
          className={cn(
            "flex items-center mb-8",
            collapsed ? "justify-center" : "gap-2"
          )}
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            className="relative"
            // animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <img
              src={versalogo}
              alt="Verza logo"
              className="w-7 h-7 object-contain"
            />
          </motion.div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xl font-bold text-verza-emerald"
            >
              Verza
            </motion.span>
          )}
        </motion.div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item, index) => {
            const isActive = location === item.path;
            const Icon = item.icon;

            return (
              <Link key={item.path} href={item.path}>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: collapsed ? 0 : 4 }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer",
                    isActive
                      ? "bg-gradient-to-r from-verza-emerald/20 to-verza-kelly/20 border-l-2 border-verza-emerald text-verza-emerald"
                      : "text-verza-gray hover:bg-verza-emerald/10 hover:text-verza-emerald"
                  )}
                  style={{
                    boxShadow: isActive
                      ? "0 0 20px rgba(141, 198, 63, 0.2)"
                      : undefined,
                  }}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 flex-shrink-0",
                      isActive ? "text-verza-emerald" : ""
                    )}
                  />
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="font-medium text-sm truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="mt-auto p-4 border-t border-verza-emerald/20">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-lg bg-gradient-to-br from-verza-forest/30 to-verza-emerald/10 p-3 border border-verza-emerald/20 mb-4"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <motion.div
                className="w-2 h-2 bg-verza-emerald rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-xs font-medium text-verza-emerald">
                System Active
              </span>
            </div>
            <div className="text-[10px] text-verza-gray text-center">
              Verza Dashboard v1.0
            </div>
          </motion.div>
        )}

        {/* Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggle}
          className={cn(
            "w-full py-2 px-3 flex items-center justify-center gap-2",
            "rounded-lg bg-verza-emerald/10 hover:bg-verza-emerald/20 border border-verza-emerald/30",
            "transition-all duration-200 text-verza-emerald text-sm font-medium"
          )}
        >
          {collapsed ? (
            <>
              <ChevronRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.aside>
  );
}
