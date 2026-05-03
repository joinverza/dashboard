import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { MessageCircle } from "lucide-react";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import Header from "./Header";
import PageTransition from "./PageTransition";
import { useSidebarState } from "@/hooks/useSidebarState";
import { useAuth } from "@/features/auth/AuthContext";
import { userNavItems, verifierNavItems, enterpriseNavItems, managerNavItems, adminNavItems } from "@/config/navigation";
import { ChatModal } from "@/components/chat/ChatModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StepUpPromptDialog } from "@/components/auth/StepUpPromptDialog";
import { canAccessRoute } from "@/security/rbacPolicy";
import { env } from "@/config/env";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { collapsed, toggle } = useSidebarState();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSupportChatOpen, setIsSupportChatOpen] = useState(false);
  const [mfaEnrollmentCode, setMfaEnrollmentCode] = useState("");
  const [isVerifyingMfaEnrollment, setIsVerifyingMfaEnrollment] = useState(false);
  const { user, permissions, mfaEnrollment, verifyMfaEnrollment, mfaBackupCodes, dismissMfaBackupCodes } = useAuth();

  const getNavItemsForCurrentRoute = () => {
    if (location.startsWith("/admin")) return adminNavItems;
    if (location.startsWith("/manager")) return managerNavItems;
    if (location.startsWith("/enterprise")) return enterpriseNavItems;
    if (location.startsWith("/verifier")) return verifierNavItems;
    if (location.startsWith("/app")) return userNavItems;
    return user?.role === "verifier" ? verifierNavItems :
      user?.role === "enterprise" ? enterpriseNavItems :
        user?.role === "manager" ? managerNavItems :
          user?.role === "admin" ? adminNavItems :
            userNavItems;
  };

  const roleNavItems = env.devUnlockAllRoutes
    ? getNavItemsForCurrentRoute()
    : user?.role === "verifier" ? verifierNavItems :
      user?.role === "enterprise" ? enterpriseNavItems :
        user?.role === "manager" ? managerNavItems :
          user?.role === "admin" ? adminNavItems :
            userNavItems;
  const navItems = user
    ? roleNavItems.filter((item) => env.devUnlockAllRoutes || canAccessRoute(user.role, permissions, item.path))
    : roleNavItems;
  const isEnterpriseRoute = location.startsWith("/enterprise");
  const isAdminRoute = location.startsWith("/admin");
  const usesEnterpriseShell = isEnterpriseRoute || isAdminRoute;
  const shellLabel = isAdminRoute ? "Admin" : "Enterprise";
  const preserveEnterpriseHubCards =
    isEnterpriseRoute && (location === "/enterprise/reports" || location === "/enterprise/platform");
  const shouldRefreshEnterpriseCards =
    usesEnterpriseShell && !preserveEnterpriseHubCards;
  const isAuthPage = ['/', '/login', '/signup', '/user/signup', '/portal/login', '/portal/signup', '/verifier/login', '/verifier/signup', '/admin/login', '/admin/signup', '/forgot-password', '/reset-password', '/privacy', '/terms', '/onboarding'].includes(location);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("enterprise-shell-theme", usesEnterpriseShell && !isAuthPage && !!user);

    return () => {
      root.classList.remove("enterprise-shell-theme");
    };
  }, [isAuthPage, user, usesEnterpriseShell]);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMfaEnrollmentCode("");
  }, [mfaEnrollment?.otpauthUri, mfaEnrollment?.qrCodeImageUrl]);

  const handleVerifyMfaEnrollment = async () => {
    if (mfaEnrollmentCode.trim().length !== 6) {
      return;
    }
    setIsVerifyingMfaEnrollment(true);
    try {
      await verifyMfaEnrollment(mfaEnrollmentCode.trim());
      setMfaEnrollmentCode("");
    } finally {
      setIsVerifyingMfaEnrollment(false);
    }
  };

  if (isAuthPage || !user) {
    return (
      <div className="min-h-screen bg-background text-foreground relative font-sans selection:bg-verza-emerald/30 selection:text-verza-emerald">
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "min-h-screen relative overflow-hidden font-sans selection:bg-verza-emerald/30 selection:text-verza-emerald",
        usesEnterpriseShell
          ? "enterprise-stage text-foreground"
          : "bg-background text-foreground"
      )}
    >
      {/* Background Elements */}
      {/* <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <img
          src="/dark_green_bg.png"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover opacity-[0.45] dark:opacity-[0.25]"
        />
        <div className="absolute inset-0 enterprise-grid opacity-[0.3]" />
        <div className="absolute inset-0 bg-white/40 dark:bg-black/40 mix-blend-overlay" />
      </div> */}

      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navItems={navItems}
        roleLabel={shellLabel}
        variant={usesEnterpriseShell ? "enterprise" : "default"}
      />

      {/* App shell: sidebar + content side-by-side */}
      <div className="flex w-full min-h-screen relative z-10">

        {/* Desktop Sidebar — sticky so it stays while main scrolls */}
        <div className="hidden md:flex flex-shrink-0">
          <Sidebar
            collapsed={collapsed}
            onToggle={toggle}
            navItems={navItems}
            roleLabel={shellLabel}
            variant={usesEnterpriseShell ? "enterprise" : "default"}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 min-w-0 min-h-screen">
          <div className={cn(
            "flex-1 flex flex-col min-h-screen overflow-hidden",
            usesEnterpriseShell ? "" : ""
          )}>
            <Header
              onMobileMenuOpen={() => setMobileOpen(true)}
              roleLabel={shellLabel}
              variant={usesEnterpriseShell ? "enterprise" : "default"}
            />
            <main className={cn(
              "flex-1 overflow-auto",
              usesEnterpriseShell ? "p-4 sm:p-6 lg:p-8" : "p-4 md:p-6",
              shouldRefreshEnterpriseCards && "enterprise-card-refresh",
            )}>
              <PageTransition>{children}</PageTransition>
            </main>
          </div>
        </div>

      </div>

      {/* Support Chat FAB */}
      <AnimatePresence>
        {user?.role === 'user' && (
          <>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="fixed bottom-6 right-6 z-40"
            >
              <Button
                onClick={() => setIsSupportChatOpen(true)}
                className="h-14 w-14 rounded-full bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow flex items-center justify-center p-0"
              >
                <MessageCircle className="h-7 w-7" />
              </Button>
            </motion.div>

            <ChatModal
              isOpen={isSupportChatOpen}
              onClose={() => setIsSupportChatOpen(false)}
              recipient={{
                name: "Ontiver Support",
                role: "Admin",
                status: "online",
                avatar: "https://github.com/shadcn.png"
              }}
              initialMessages={[
                {
                  id: 'welcome',
                  text: "Hi there! How can we help you today?",
                  sender: 'other',
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
              ]}
            />
          </>
        )}
      </AnimatePresence>

      {/* MFA Dialogs... */}
      <Dialog open={!!mfaEnrollment}>
        <DialogContent className="sm:max-w-lg" onPointerDownOutside={(event) => event.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Set up authenticator app</DialogTitle>
            <DialogDescription>Scan the QR code and enter your 6-digit code to complete MFA enrollment.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {mfaEnrollment?.qrCodeImageUrl ? (
              <img src={mfaEnrollment.qrCodeImageUrl} alt="MFA QR code" className="mx-auto h-56 w-56 rounded-md border object-contain p-2" />
            ) : mfaEnrollment?.otpauthUri ? (
              <a href={mfaEnrollment.otpauthUri} className="text-sm text-primary underline break-all" target="_blank" rel="noreferrer">
                Open authenticator setup link
              </a>
            ) : null}
            {mfaEnrollment?.otpauthUri ? (
              <p className="text-xs text-muted-foreground break-all">{mfaEnrollment.otpauthUri}</p>
            ) : null}
            <Input
              value={mfaEnrollmentCode}
              onChange={(event) => setMfaEnrollmentCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Enter 6-digit code"
              inputMode="numeric"
              maxLength={6}
            />
            <Button onClick={handleVerifyMfaEnrollment} disabled={isVerifyingMfaEnrollment || mfaEnrollmentCode.trim().length !== 6} className="w-full">
              {isVerifyingMfaEnrollment ? "Verifying..." : "Verify MFA Enrollment"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={mfaBackupCodes.length > 0}>
        <DialogContent className="sm:max-w-lg" onPointerDownOutside={(event) => event.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Backup codes</DialogTitle>
            <DialogDescription>Save these one-time backup codes now. You will not be shown this list again.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 rounded-md border p-3">
            {mfaBackupCodes.map((code) => (
              <div key={code} className="font-mono text-sm">
                {code}
              </div>
            ))}
          </div>
          <Button onClick={dismissMfaBackupCodes}>I have saved these codes</Button>
        </DialogContent>
      </Dialog>
      <StepUpPromptDialog />
    </div>
  );
}
