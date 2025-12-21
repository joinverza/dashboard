import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { X } from "lucide-react";
import {
  LayoutDashboard,
  Store,
  BarChart3,
  Wallet,
  FileText,
  FolderOpen,
  MessageSquare,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from '@/contexts/ThemeContext';
import versalogo from "@/assets/versalogoSVG.svg";


const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/store", label: "Store", icon: Store },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/wallet", label: "Wallet", icon: Wallet },
  { path: "/invoice", label: "Invoice", icon: FileText },
  { path: "/category", label: "Category", icon: FolderOpen },
  // { path: "/message", label: "Message", icon: MessageSquare },
  { path: "/settings", label: "Setting", icon: Settings },
];

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();  

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
              "fixed left-0 top-0 h-screen w-64 border-r border-verza-emerald/20 z-50 md:hidden",
              theme === 'dark' ? 'bg-black' : 'bg-white'
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
                className="flex items-center gap-3 mb-8"
              >
                <img
                  src={versalogo}
                  alt="Verza logo"
                  className="w-7 h-7 object-contain"
                />
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-bold bg-gradient-to-r from-verza-emerald to-verza-kelly bg-clip-text text-transparent"
                >
                  Verza
                </motion.span>
              </motion.div>

              {/* Navigation */}
              <nav className="space-y-2">
                {navItems.map((item, index) => {
                  const isActive = location === item.path;
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
                          "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer",
                          isActive
                            ? "bg-gradient-to-r from-verza-emerald/20 to-verza-kelly/20 border border-verza-emerald/40 text-verza-emerald"
                            : "text-verza-gray hover:text-verza-emerald hover:bg-verza-emerald/10"
                        )}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
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
