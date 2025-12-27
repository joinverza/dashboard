import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import versalogo from "@/assets/versalogoSVG.svg";
import type { NavItem } from "@/config/navigation";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

export default function MobileSidebar({ isOpen, onClose, navItems }: MobileSidebarProps) {
  const [location] = useLocation();

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
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
              "glass-sidebar fixed left-0 top-0 h-screen w-72 z-50 md:hidden"
            )}
            style={{
              boxShadow: "0 0 40px rgba(141, 198, 63, 0.1)",
            }}
          >
            <div className="p-6">
              {/* Logo */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 mb-10"
              >
                <div className="relative p-1 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/5">
                  <img
                    src={versalogo}
                    alt="Verza logo"
                    className="w-8 h-8 object-contain drop-shadow-[0_0_10px_rgba(141,198,63,0.3)]"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-foreground tracking-tight">
                    Verza
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                    Dashboard
                  </span>
                </div>
              </motion.div>

              {/* Navigation */}
              <nav className="flex flex-col gap-3">
                {navItems.map((item, index) => {
                  const isActive = location === item.path || (location !== '/' && item.path !== '/' && location.startsWith(item.path));
                  const Icon = item.icon;

                  return (
                    <Link key={item.path} href={item.path} onClick={onClose}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        whileHover={{ x: 4, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                        whileTap={{ scale: 0.98 }}
                        className={cn(
                          "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer border border-transparent",
                          isActive
                            ? "bg-verza-emerald/10 border-verza-emerald/20 shadow-[0_0_20px_-5px_rgba(141,198,63,0.3)]"
                            : "text-muted-foreground hover:text-foreground hover:border-white/5"
                        )}
                      >
                        <div className={cn(
                          "p-1.5 rounded-lg transition-colors duration-300",
                          isActive ? "bg-verza-emerald text-white" : "bg-white/5 text-muted-foreground group-hover:bg-white/10 group-hover:text-foreground"
                        )}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={cn(
                          "font-medium text-sm tracking-wide",
                          isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                        )}>{item.label}</span>
                        
                        {isActive && (
                          <motion.div
                            layoutId="active-indicator-mobile"
                            className="ml-auto w-1.5 h-1.5 rounded-full bg-verza-emerald shadow-[0_0_8px_rgba(141,198,63,0.8)]"
                          />
                        )}
                      </motion.div>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className={cn(
                "absolute top-6 right-6 w-8 h-8 flex items-center justify-center",
                "rounded-full bg-verza-emerald/20 border border-verza-emerald/30",
                "text-verza-emerald hover:bg-verza-emerald/30 transition-colors"
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
