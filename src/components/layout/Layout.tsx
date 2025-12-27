import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import Header from "./Header";
import PageTransition from "./PageTransition";
import { useSidebarState } from "@/hooks/useSidebarState";
import { useAuth } from "@/features/auth/AuthContext";
import { userNavItems, verifierNavItems, enterpriseNavItems, adminNavItems } from "@/config/navigation";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { collapsed, toggle } = useSidebarState();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { user } = useAuth();

  const navItems = user?.role === "verifier" ? verifierNavItems :
                   user?.role === "enterprise" ? enterpriseNavItems :
                   user?.role === "admin" ? adminNavItems :
                   userNavItems;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-br from-verza-emerald/5 to-verza-kelly/5 rounded-full blur-3xl opacity-50"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-br from-verza-kelly/5 to-verza-emerald/5 rounded-full blur-3xl opacity-50"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-verza-forest/3 to-transparent rounded-full blur-3xl"
        />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar collapsed={collapsed} onToggle={toggle} navItems={navItems} />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} navItems={navItems} />

      {/* Main Content */}
      <motion.div
        className="flex flex-col min-h-screen relative z-10"
        animate={{ marginLeft: isMobile ? 0 : collapsed ? 80 : 256 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <Header onMobileMenuOpen={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <PageTransition>{children}</PageTransition>
        </main>
      </motion.div>
    </div>
  );
}
