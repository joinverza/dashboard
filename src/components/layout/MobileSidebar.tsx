import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import versalogo from "@/assets/ONTIVER Green.svg";
import sidebarBg from "@/assets/sidebar-bg.png";
import type { NavItem } from "@/config/navigation";
import { useMemo } from "react";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  variant?: "default" | "enterprise";
}

function groupNavItems(items: NavItem[]): { group: string; items: NavItem[] }[] {
  const map = new Map<string, NavItem[]>();
  for (const item of items) {
    const key = item.group ?? "";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }
  return Array.from(map.entries()).map(([group, groupItems]) => ({ group, items: groupItems }));
}

export default function MobileSidebar({ isOpen, onClose, navItems, variant = "default" }: MobileSidebarProps) {
  const [location] = useLocation();
  const isEnterprise = variant === "enterprise";
  const grouped = useMemo(() => groupNavItems(navItems), [navItems]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
              "fixed left-0 top-0 h-screen w-72 z-50 md:hidden flex flex-col",
              isEnterprise
                ? "enterprise-sidebar"
                : "glass-sidebar"
            )}
            style={isEnterprise ? { "--sidebar-bg-image": `url(${sidebarBg})` } as React.CSSProperties : undefined}
          >
            <div className="p-5 flex-1 overflow-y-auto scrollbar-thin">
              {/* Logo */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 mb-8"
              >
                <div className={cn(
                  "relative p-1.5 rounded-xl border overflow-hidden",
                  isEnterprise
                    ? "bg-white/[0.08] border-white/10"
                    : "bg-white/5 border-white/5"
                )}>
                  <img
                    src={versalogo}
                    alt="Ontiver logo"
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className={cn(
                    "text-lg font-bold tracking-tight",
                    isEnterprise ? "text-white" : "text-foreground"
                  )}>
                    Ontiver
                  </span>
                  <span className={cn(
                    "text-[10px] uppercase tracking-[0.2em] font-semibold",
                    isEnterprise ? "text-verza-emerald/80" : "text-muted-foreground"
                  )}>
                    {isEnterprise ? "Enterprise" : "Dashboard"}
                  </span>
                </div>
              </motion.div>

              {/* Navigation */}
              <nav className="flex flex-col">
                {isEnterprise ? (
                  grouped.map(({ group, items }) => (
                    <div key={group || "ungrouped"}>
                      {group && (
                        <div className="sidebar-group-label">{group}</div>
                      )}
                      <div className="flex flex-col gap-0.5">
                        {items.map((item, index) => {
                          const isActive = location === item.path || (location !== "/" && item.path !== "/" && location.startsWith(item.path));
                          const Icon = item.icon;

                          return (
                            <Link key={item.path} href={item.path} onClick={onClose}>
                              <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + index * 0.04 }}
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                                className={cn(
                                  "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer",
                                  isActive
                                    ? "bg-white/[0.08]"
                                    : "hover:bg-white/[0.04]"
                                )}
                              >
                                {isActive && (
                                  <motion.div
                                    layoutId="active-indicator-mobile"
                                    className="sidebar-nav-active-bar"
                                  />
                                )}

                                <div className={cn(
                                  "p-1.5 rounded-lg transition-all duration-200",
                                  isActive
                                    ? "bg-verza-emerald text-[#06140F]"
                                    : "bg-white/[0.05] text-white/40 group-hover:bg-white/[0.08] group-hover:text-verza-emerald"
                                )}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                <span className={cn(
                                  "font-medium text-sm tracking-wide",
                                  isActive
                                    ? "text-white"
                                    : "text-white/50 group-hover:text-white/80"
                                )}>{item.label}</span>
                                
                                {isActive && (
                                  <motion.div
                                    layoutId="active-dot-mobile"
                                    className="ml-auto w-1.5 h-1.5 rounded-full bg-verza-emerald shadow-[0_0_8px_rgba(30,215,96,0.6)]"
                                  />
                                )}
                              </motion.div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col gap-1">
                    {navItems.map((item, index) => {
                      const isActive = location === item.path || (location !== "/" && item.path !== "/" && location.startsWith(item.path));
                      const Icon = item.icon;

                      return (
                        <Link key={item.path} href={item.path} onClick={onClose}>
                          <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + index * 0.05 }}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            className={cn(
                              "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer border border-transparent",
                              isActive
                                ? "bg-verza-emerald/10 border-verza-emerald/20"
                                : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
                            )}
                          >
                            <div className={cn(
                              "p-2 rounded-lg transition-all duration-200",
                              isActive
                                ? "bg-verza-emerald text-white shadow-glow"
                                : "bg-white/5 text-muted-foreground group-hover:bg-white/10 group-hover:text-foreground"
                            )}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className={cn(
                              "font-medium text-sm tracking-wide",
                              isActive
                                ? "text-foreground"
                                : "text-muted-foreground group-hover:text-foreground"
                            )}>{item.label}</span>
                            
                            {isActive && (
                              <motion.div
                                layoutId="default-active-dot-mobile"
                                className="ml-auto w-1.5 h-1.5 rounded-full bg-verza-emerald"
                              />
                            )}
                          </motion.div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </nav>
            </div>

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className={cn(
                "absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full transition-colors",
                isEnterprise
                  ? "bg-white/[0.06] border border-white/10 text-white/60 hover:bg-white/[0.12] hover:text-white"
                  : "bg-verza-emerald/20 border border-verza-emerald/30 text-verza-emerald hover:bg-verza-emerald/30"
              )}
            >
              <X className="w-4 h-4" />
            </motion.button>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
