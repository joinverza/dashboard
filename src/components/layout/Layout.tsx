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

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const { collapsed, toggle } = useSidebarState();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isSupportChatOpen, setIsSupportChatOpen] = useState(false);
  const [mfaEnrollmentCode, setMfaEnrollmentCode] = useState("");
  const [isVerifyingMfaEnrollment, setIsVerifyingMfaEnrollment] = useState(false);
  const { user, hasPermission, permissions, mfaEnrollment, verifyMfaEnrollment, mfaBackupCodes, dismissMfaBackupCodes } = useAuth();

  const roleNavItems = user?.role === "verifier" ? verifierNavItems :
                   user?.role === "enterprise" ? enterpriseNavItems :
                   user?.role === "manager" ? managerNavItems :
                   user?.role === "admin" ? adminNavItems :
                   userNavItems;
  const permissionByPath: Record<string, string | undefined> = {
    "/enterprise/tools": "documents:write",
    "/enterprise/verifications": "documents:write",
    "/enterprise/bulk": "kyc:write",
    "/enterprise/api": "webhooks:write",
    "/enterprise/analytics": "analytics:read",
    "/enterprise/audit": "audit:read",
    "/manager/requests": "verification:read",
    "/manager/verifications": "verification:read",
    "/manager/tools": "documents:write",
    "/manager/team": "users:manage",
    "/manager/analytics": "analytics:read",
    "/manager/compliance": "audit:read",
    "/verifier/jobs": "verification:read",
    "/verifier/active": "verification:write",
    "/verifier/profile": "verifier:profile:read",
    "/admin/users": "users:manage",
    "/admin/verifiers": "verifiers:manage",
    "/admin/enterprises": "enterprises:manage",
    "/admin/system": "system:manage",
    "/admin/security": "admin:read",
    "/admin/audit": "audit:read",
    "/admin/tools/verifications": "verification:read",
    "/admin/tools/operations": "documents:write",
    "/admin/tools/auditor": "audit:read",
    "/admin/tools/support": "verification:read",
    "/admin/tools/developer": "webhooks:write",
  };
  const navItems =
    permissions.length === 0
      ? roleNavItems
      : roleNavItems.filter((item) => {
          const needed = permissionByPath[item.path];
          return !needed || hasPermission(needed);
        });

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

  const isAuthPage = ['/', '/login', '/signup', '/user/signup', '/portal/login', '/portal/signup', '/verifier/login', '/verifier/signup', '/admin/login', '/admin/signup', '/forgot-password', '/reset-password', '/privacy', '/terms', '/onboarding'].includes(location);

  if (isAuthPage || !user) {
    return (
      <div className="min-h-screen bg-background dark:bg-black text-foreground relative font-sans selection:bg-verza-emerald/30 selection:text-verza-emerald">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-black text-foreground relative overflow-hidden font-sans selection:bg-verza-emerald/30 selection:text-verza-emerald">
      {/* Background Elements - God Mode */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-verza-emerald/5 via-transparent to-transparent opacity-40 dark:opacity-20 mix-blend-screen" />
        
        {/* Dark Mode Green Light Burst */}
        <div className="hidden dark:block absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-verza-emerald/20 via-verza-forest/10 to-transparent blur-[120px] opacity-40 pointer-events-none" />

        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-[20%] -left-[10%] w-[1000px] h-[1000px] bg-verza-emerald/10 rounded-full blur-[120px] opacity-40 dark:opacity-10 mix-blend-screen"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 45,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-[20%] -right-[10%] w-[1000px] h-[1000px] bg-verza-kelly/10 rounded-full blur-[120px] opacity-40 dark:opacity-10 mix-blend-screen"
        />
        <motion.div
          animate={{
            y: [0, 40, 0],
            x: [0, 20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-verza-forest/5 rounded-full blur-[100px] opacity-30 dark:opacity-5 mix-blend-screen"
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
