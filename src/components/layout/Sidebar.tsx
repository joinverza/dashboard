import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import versalogo from "@/assets/ONTIVER Green.svg";
import sidebarBg from "@/assets/sidebar-bg.png";
import type { NavItem } from "@/config/navigation";
import { useMemo } from "react";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  navItems: NavItem[];
  variant?: "default" | "enterprise";
}

/** Group navigation items by their `group` property, preserving insertion order. */
function groupNavItems(items: NavItem[]): { group: string; items: NavItem[] }[] {
  const map = new Map<string, NavItem[]>();
  for (const item of items) {
    const key = item.group ?? "";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }
  return Array.from(map.entries()).map(([group, groupItems]) => ({ group, items: groupItems }));
}

export default function Sidebar({ collapsed, onToggle, navItems, variant = "default" }: SidebarProps) {
  const [location] = useLocation();
  const isEnterprise = variant === "enterprise";
  const grouped = useMemo(() => groupNavItems(navItems), [navItems]);

  return (
    <motion.aside
      className={cn(
        isEnterprise
          ? "enterprise-sidebar sticky top-0 z-30 self-stretch"
          : "glass-sidebar self-stretch sticky top-0 z-30",
        "transition-all duration-300 ease-in-out flex flex-col overflow-hidden",
        collapsed ? "w-20" : "w-64"
      )}
      style={isEnterprise ? { "--sidebar-bg-image": `url(${sidebarBg})`, minHeight: "100vh" } as React.CSSProperties : undefined}
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="p-5 flex-1 overflow-y-auto scrollbar-thin">
        {/* Logo */}
        <motion.div
          className={cn(
            "flex items-center mb-8 mt-8",
            collapsed ? "justify-center" : "gap-3"
          )}
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            className={cn(
              "relative overflow-hidden",
              isEnterprise
                ? "p-1.5 bg-white/[0.08] border border-white/10"
                : "p-1 bg-white/5 border border-white/5"
            )}
          >
            <img
              src={versalogo}
              alt="Ontiver logo"
              className="w-8 h-8 object-contain"
            />
          </motion.div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="flex flex-col min-w-0 overflow-hidden whitespace-nowrap"
              >
                <span className={cn(
                  "text-lg font-bold tracking-tight",
                  isEnterprise ? "text-white!" : "text-foreground"
                )}>
                  Ontiver
                </span>
                <span className={cn(
                  "text-[10px] uppercase tracking-[0.2em] font-semibold",
                  isEnterprise ? "text-verza-emerald" : "text-verza-emerald"
                )}>
                  {isEnterprise ? "Enterprise" : "Dashboard"}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Navigation — Grouped */}
        <nav className="flex flex-col">
          {isEnterprise ? (
            grouped.map(({ group, items }) => (
              <div key={group || "ungrouped"}>
                {/* Group Label */}
                {group && !collapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="sidebar-group-label"
                  >
                    {group}
                  </motion.div>
                )}
                {collapsed && group && (
                  <div className="w-6 h-px bg-white/20 mx-auto my-3" />
                )}
                <div className="flex flex-col gap-0.5">
                  {items.map((item, index) => (
                    <SidebarNavItem
                      key={item.path}
                      item={item}
                      index={index}
                      collapsed={collapsed}
                      isEnterprise
                      location={location}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col gap-1">
              {navItems.map((item, index) => (
                <SidebarNavItem
                  key={item.path}
                  item={item}
                  index={index}
                  collapsed={collapsed}
                  isEnterprise={false}
                  location={location}
                />
              ))}
            </div>
          )}
        </nav>
      </div>

      {/* Footer / Toggle */}
      <div className={cn(
        "p-4",
        isEnterprise ? "border-t border-white/[0.07]" : "border-t border-white/10"
      )}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onToggle}
          className={cn(
            "w-full py-2.5 px-3 flex items-center justify-center gap-2 transition-all duration-200 text-sm font-medium text-white!",
            isEnterprise
              ? "bg-ent-text/5 hover:bg-ent-text/10 border border-ent-text/10 text-ent-text/60 hover:text-ent-text"
              : "bg-white/5 hover:bg-white/10 border border-white/5 text-muted-foreground hover:text-foreground"
          )}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
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

/* ─── Individual Navigation Item ───────────────────────── */
function SidebarNavItem({
  item,
  index,
  collapsed,
  isEnterprise,
  location,
}: {
  item: NavItem;
  index: number;
  collapsed: boolean;
  isEnterprise: boolean;
  location: string;
}) {
  const isDashboard = item.path === '/enterprise' || item.path === '/app';
  const isActive = isDashboard 
    ? location === item.path 
    : (location === item.path || (item.path !== "/" && location.startsWith(item.path)));
  const Icon = item.icon;

  return (
    <Link href={item.path}>
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.03 }}
        whileHover={{ x: collapsed ? 0 : 4 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "group relative flex items-center gap-3 px-3 py-2 rounded-l-lg transition-all duration-200 cursor-pointer",
          collapsed ? "justify-center" : "",
          isActive
            ? isEnterprise
              ? "bg-ent-text/5"
              : "bg-verza-emerald/10 border border-verza-emerald/20"
            : isEnterprise
              ? "hover:bg-ent-text/5"
              : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
        )}
      >
        {/* Active left bar indicator */}
        {isActive && isEnterprise && !collapsed && (
          <motion.div
            layoutId="sidebar-active-bar"
            className="absolute left-[9px] top-1/2 -translate-y-1/2 h-10 w-[4px] rounded-l-full bg-verza-emerald shadow-[0_0_8px_rgba(30,215,96,0.6)]"
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />
        )}

        {/* Icon container */}
        <div className={cn(
          "p-2.5 transition-all duration-200",
          isActive
            ? isEnterprise
              ? "bg-white/[0.08] border border-verza-emerald/10 text-verza-emerald"
              : "bg-white/[0.08] border border-verza-emerald/10 text-verza-emerald"
            : isEnterprise
              ? "bg-transparent text-white! opacity-70 group-hover:bg-white/8 group-hover:text-verza-emerald! group-hover:opacity-100"
              : "bg-white/5 text-muted-foreground group-hover:bg-white/10 group-hover:text-foreground"
        )}>
          <Icon className="w-[18px] h-[18px]" />
        </div>
        
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className={cn(
                "font-semibold text-[15px] tracking-wide whitespace-nowrap overflow-hidden text-white!",
                isActive
                  ? isEnterprise ? "text-ent-text" : "text-foreground"
                  : isEnterprise
                    ? "text-ent-text opacity-70 group-hover:opacity-100"
                    : "text-muted-foreground group-hover:text-foreground"
              )}
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>
        
        {!collapsed && isActive && (
          <motion.div
            layoutId="active-dot"
            className={cn(
              "ml-auto w-1.5 h-1.5 rounded-full",
              isEnterprise
                ? "bg-verza-emerald shadow-[0_0_8px_rgba(30,215,96,0.6)]"
                : "bg-verza-emerald"
            )}
          />
        )}
      </motion.div>
    </Link>
  );
}
