import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import versalogo from "@/assets/ONTIVER Green.svg";
import type { NavItem } from "@/config/navigation";
import { useMemo, useState } from "react";
import {
  ENTERPRISE_SIDEBAR_IMAGE_URL,
  groupHasActiveItem,
  groupNavItems,
  isSidebarDropdownGroup,
  isSidebarItemActive,
} from "./sidebarShared";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  navItems: NavItem[];
  variant?: "default" | "enterprise";
  roleLabel?: string;
}

export default function Sidebar({
  collapsed,
  onToggle,
  navItems,
  variant = "default",
  roleLabel = "Enterprise",
}: SidebarProps) {
  const [location] = useLocation();
  const usesEnterpriseShell = variant === "enterprise";
  const enableGroupDropdowns = usesEnterpriseShell && location.startsWith("/admin");
  const grouped = useMemo(() => groupNavItems(navItems), [navItems]);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  return (
    <motion.aside
      className={cn(
        usesEnterpriseShell
          ? "enterprise-sidebar sticky top-0 z-30 self-stretch min-h-screen"
          : "glass-sidebar self-stretch sticky top-0 z-30",
        "transition-all duration-300 ease-in-out flex flex-col overflow-hidden",
        usesEnterpriseShell && collapsed && "enterprise-sidebar-collapsed",
        collapsed ? "w-20" : "w-64",
      )}
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {usesEnterpriseShell && (
        <div aria-hidden className="enterprise-sidebar-media">
          <img
            src={ENTERPRISE_SIDEBAR_IMAGE_URL}
            alt=""
            className="enterprise-sidebar-image"
          />
          <div className="enterprise-sidebar-video-tint" />
        </div>
      )}

      <div className="p-5 flex-1 overflow-y-auto scrollbar-thin">
        {/* Logo */}
        <motion.div
          className={cn(
            "flex items-center mb-8 mt-8",
            collapsed ? "justify-center" : "gap-3",
          )}
          whileHover={collapsed ? undefined : { scale: 1.02 }}
        >
          <motion.div
            className={cn(
              "relative overflow-hidden",
              usesEnterpriseShell
                ? "p-1.5 bg-white/[0.08] border border-white/10"
                : "p-1 bg-white/5 border border-white/5",
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
                <span
                  className={cn(
                    "text-lg font-bold tracking-tight",
                    usesEnterpriseShell ? "text-white!" : "text-foreground",
                  )}
                >
                  Ontiver
                </span>
                <span
                  className={cn(
                    "text-[10px] uppercase tracking-[0.2em] font-semibold",
                    usesEnterpriseShell ? "text-verza-emerald" : "text-verza-emerald",
                  )}
                >
                  {usesEnterpriseShell ? roleLabel : "Dashboard"}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Navigation — Grouped */}
        <nav className="flex flex-col">
          {usesEnterpriseShell ? (
            grouped.map(({ group, items }, groupIndex) => {
              const isDropdownGroup = isSidebarDropdownGroup(group, enableGroupDropdowns);
              const hasActiveItem = groupHasActiveItem(items, location);
              const isGroupOpen = collapsed || !isDropdownGroup || hasActiveItem || expandedGroups[group];
              const groupLabelClassName = cn(
                "mb-2 flex w-full items-center justify-between px-3 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/35",
                groupIndex === 0 ? "mt-0" : "mt-6",
                isDropdownGroup && "transition-colors hover:text-white/70",
              );

              return (
                <div key={group || "ungrouped"}>
                  {/* Group Label */}
                  {group && !collapsed && (
                    isDropdownGroup ? (
                      <motion.button
                        type="button"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => {
                          if (hasActiveItem) return;
                          setExpandedGroups((current) => ({
                            ...current,
                            [group]: !current[group],
                          }));
                        }}
                        className={groupLabelClassName}
                      >
                        <span>{group}</span>
                        <ChevronDown
                          className={cn(
                            "h-3.5 w-3.5 transition-transform duration-200",
                            isGroupOpen ? "rotate-180" : "",
                          )}
                        />
                      </motion.button>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={groupLabelClassName}
                      >
                        {group}
                      </motion.div>
                    )
                  )}
                  {collapsed && group && (
                    <div className="w-6 h-px bg-white/20 mx-auto my-3" />
                  )}
                  {isDropdownGroup && !collapsed ? (
                    <AnimatePresence initial={false}>
                      {isGroupOpen && (
                        <motion.div
                          key={`${group}-items`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col gap-0.5">
                            {items.map((item, index) => (
                              <SidebarNavItem
                                key={item.path}
                                item={item}
                                index={index}
                                collapsed={collapsed}
                                usesEnterpriseShell={usesEnterpriseShell}
                                location={location}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  ) : (
                    <div className="flex flex-col gap-0.5">
                      {items.map((item, index) => (
                        <SidebarNavItem
                          key={item.path}
                          item={item}
                          index={index}
                          collapsed={collapsed}
                          usesEnterpriseShell={usesEnterpriseShell}
                          location={location}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="flex flex-col gap-1">
              {navItems.map((item, index) => (
                <SidebarNavItem
                  key={item.path}
                  item={item}
                  index={index}
                  collapsed={collapsed}
                  usesEnterpriseShell={false}
                  location={location}
                />
              ))}
            </div>
          )}
        </nav>
      </div>

      {/* Footer / Toggle */}
      <div
        className={cn(
          "p-4",
          usesEnterpriseShell
            ? "border-t border-white/[0.07]"
            : "border-t border-white/10",
        )}
      >
        <motion.button
          whileHover={collapsed ? undefined : { scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onToggle}
          className={cn(
            "w-full py-2.5 px-3 flex items-center justify-center gap-2 transition-all duration-200 text-sm font-medium text-white! cursor-pointer",
            usesEnterpriseShell
              ? collapsed
                ? "text-ent-text/60"
                : "text-ent-text/60 hover:text-ent-text"
              : "bg-white/5 hover:bg-white/10 border border-white/5 text-muted-foreground hover:text-foreground",
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
  usesEnterpriseShell,
  location,
}: {
  item: NavItem;
  index: number;
  collapsed: boolean;
  usesEnterpriseShell: boolean;
  location: string;
}) {
  const isActive = isSidebarItemActive(item.path, location);
  const Icon = item.icon;

  return (
    <Link href={item.path}>
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.03 }}
        whileHover={collapsed ? undefined : { x: 4 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "group relative flex items-center gap-3 px-3 py-2 transition-all duration-200 cursor-pointer",
          collapsed ? "justify-center" : "rounded-l-lg",
          isActive
            ? usesEnterpriseShell
              ? collapsed
                ? ""
                : "bg-white/5"
              : "bg-verza-emerald/10 border border-verza-emerald/20"
            : usesEnterpriseShell
              ? collapsed
                ? ""
                : "hover:bg-white/8 "
              : collapsed
                ? "text-muted-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]",
        )}
      >
        {/* Active left bar indicator */}
        {isActive && usesEnterpriseShell && !collapsed && (
          <motion.div
            layoutId="sidebar-active-bar"
            className="absolute left-[9px] top-1/2 -translate-y-1/2 h-10 w-[4px] rounded-l-full bg-verza-emerald shadow-[0_0_8px_rgba(30,215,96,0.6)]"
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />
        )}

        {/* Icon container */}
        <div
          className={cn(
            "p-2.5 transition-all duration-200",
            isActive
              ? usesEnterpriseShell
                ? "bg-white/[0.08] border border-verza-emerald/10 text-verza-emerald"
                : "bg-white/[0.08] border border-verza-emerald/10 text-verza-emerald"
              : usesEnterpriseShell
                ? "bg-transparent text-white! opacity-70 group-hover:bg-white/8 group-hover:text-verza-emerald! group-hover:opacity-100"
                :"bg-white/5 text-muted-foreground group-hover:bg-white/10 group-hover:text-foreground",
          )}
        >
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
                  ? usesEnterpriseShell
                    ? "text-ent-text"
                    : "text-foreground"
                  : usesEnterpriseShell
                    ? "text-ent-text opacity-70 group-hover:opacity-100"
                    : "text-muted-foreground group-hover:text-foreground",
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
              usesEnterpriseShell
                ? "bg-verza-emerald shadow-[0_0_8px_rgba(30,215,96,0.6)]"
                : "bg-verza-emerald",
            )}
          />
        )}
      </motion.div>
    </Link>
  );
}
