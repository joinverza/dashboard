import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { ChevronDown, X } from "lucide-react";
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

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
  variant?: "default" | "enterprise";
  roleLabel?: string;
}

export default function MobileSidebar({
  isOpen,
  onClose,
  navItems,
  variant = "default",
  roleLabel = "Enterprise",
}: MobileSidebarProps) {
  const [location] = useLocation();
  const usesEnterpriseShell = variant === "enterprise";
  const enableGroupDropdowns = usesEnterpriseShell && location.startsWith("/admin");
  const grouped = useMemo(() => groupNavItems(navItems), [navItems]);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

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
            className="fixed inset-0 bg-black/18 z-[90] md:hidden"
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
              "fixed inset-y-0 left-0 z-[100] flex h-screen w-[min(18rem,calc(100vw-4rem))] max-w-[18rem] flex-col shadow-2xl md:hidden",
              usesEnterpriseShell ? "enterprise-sidebar" : "glass-sidebar",
            )}
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
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 mb-8 mt-2"
              >
                <div
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
                </div>
                <div className="flex flex-col">
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
                </div>
              </motion.div>

              {/* Navigation */}
              <nav className="flex flex-col">
                {usesEnterpriseShell ? (
                  grouped.map(({ group, items }, groupIndex) => {
                    const isDropdownGroup = isSidebarDropdownGroup(group, enableGroupDropdowns);
                    const hasActiveItem = groupHasActiveItem(items, location);
                    const isGroupOpen = !isDropdownGroup || hasActiveItem || expandedGroups[group];
                    const groupLabelClassName = cn(
                      "mb-2 flex w-full items-center justify-between px-3 text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/35",
                      groupIndex === 0 ? "mt-0" : "mt-6",
                      isDropdownGroup && "transition-colors hover:text-white/70",
                    );

                    return (
                      <div key={group || "ungrouped"}>
                        {group && (
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
                            <div className={groupLabelClassName}>{group}</div>
                          )
                        )}
                        {isDropdownGroup ? (
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
                                    <MobileSidebarNavItem
                                      key={item.path}
                                      index={index}
                                      usesEnterpriseShell={usesEnterpriseShell}
                                      item={item}
                                      location={location}
                                      onClose={onClose}
                                    />
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        ) : (
                          <div className="flex flex-col gap-0.5">
                            {items.map((item, index) => (
                              <MobileSidebarNavItem
                                key={item.path}
                                index={index}
                                usesEnterpriseShell={usesEnterpriseShell}
                                item={item}
                                location={location}
                                onClose={onClose}
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
                      <MobileSidebarNavItem
                        key={item.path}
                        index={index}
                        usesEnterpriseShell={false}
                        item={item}
                        location={location}
                        onClose={onClose}
                      />
                    ))}
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
                "absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full transition-colors cursor-pointer",
                usesEnterpriseShell
                  ? "bg-white/[0.06] border border-white/10 text-white/60 hover:bg-white/[0.12] hover:text-white"
                  : "bg-verza-emerald/20 border border-verza-emerald/30 text-verza-emerald hover:bg-verza-emerald/30",
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

function MobileSidebarNavItem({
  item,
  index,
  usesEnterpriseShell,
  location,
  onClose,
}: {
  item: NavItem;
  index: number;
  usesEnterpriseShell: boolean;
  location: string;
  onClose: () => void;
}) {
  const isActive = isSidebarItemActive(item.path, location);
  const Icon = item.icon;

  return (
    <Link href={item.path} onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 + index * 0.04 }}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "group relative flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-200 cursor-pointer",
          isActive
            ? usesEnterpriseShell
              ? "bg-ent-text/5"
              : "bg-verza-emerald/10 border border-verza-emerald/20"
            : usesEnterpriseShell
              ? "hover:bg-ent-text/5"
              : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]",
        )}
      >
        {isActive && usesEnterpriseShell && (
          <motion.div
            layoutId="mobile-sidebar-active-bar"
            className="absolute left-[9px] top-1/2 -translate-y-1/2 h-10 w-[4px] rounded-l-full bg-verza-emerald shadow-[0_0_8px_rgba(30,215,96,0.6)]"
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />
        )}

        <div
          className={cn(
            "p-2.5 transition-all duration-200",
            isActive
              ? usesEnterpriseShell
                ? "bg-white/[0.08] border border-verza-emerald/10 text-verza-emerald"
                : "bg-white/[0.08] border border-verza-emerald/10 text-verza-emerald"
              : usesEnterpriseShell
                ? "bg-transparent text-white! opacity-70 group-hover:bg-white/8 group-hover:text-verza-emerald! group-hover:opacity-100"
                : "bg-white/5 text-muted-foreground group-hover:bg-white/10 group-hover:text-foreground",
          )}
        >
          <Icon className="w-[18px] h-[18px]" />
        </div>

        <span
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
        </span>

        {isActive && (
          <motion.div
            layoutId={
              usesEnterpriseShell
                ? "mobile-enterprise-active-dot"
                : "mobile-default-active-dot"
            }
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
