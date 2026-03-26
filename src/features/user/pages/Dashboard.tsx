import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { 
  FileCheck, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Upload,
  Camera,
  Activity
} from "lucide-react";
import { bankingService } from "@/services/bankingService";
import { toast } from "sonner";
import type { VerificationRequestResponse } from "@/types/banking";
import { Button } from "@/components/ui/button";
import UserOnboarding from "../components/UserOnboarding";
import QuickVerificationModal from "../components/QuickVerificationModal";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [verifications, setVerifications] = useState<VerificationRequestResponse[]>([]);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(true);
  
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // We handle the onboard check inside UserOnboarding, 
    // but we can also set it here to prevent flashing.
    const hasCompleted = localStorage.getItem("verza_user_onboarded");
    if (!hasCompleted) {
      setShowOnboarding(true);
    }
  }, []);

  const loadDashboardMetrics = async () => {
    setIsLoadingMetrics(true);
    try {
      const verificationData = await bankingService.getVerificationRequests({ limit: 200 });
      setVerifications(verificationData);
    } catch {
      toast.error("Unable to load live dashboard metrics.");
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      loadDashboardMetrics();
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const metrics = useMemo(() => {
    const verifiedCount = verifications.filter((item) => item.status === "verified").length;
    const pendingCount = verifications.filter((item) =>
      item.status === "pending" || item.status === "in_progress" || item.status === "review_needed"
    ).length;
    
    return [
      {
        label: "Verified Identities",
        value: verifiedCount,
        icon: FileCheck,
        color: "text-emerald-400",
        bg: "bg-emerald-400/10"
      },
      {
        label: "Pending Verifications",
        value: pendingCount,
        icon: Clock,
        color: "text-amber-400",
        bg: "bg-amber-400/10"
      },
      {
        label: "Active Sessions",
        value: "1", // Mock for aesthetic
        icon: Activity,
        color: "text-blue-400",
        bg: "bg-blue-400/10"
      }
    ];
  }, [verifications]);

  const recentVerifications = useMemo(() => {
    return verifications.slice(0, 5);
  }, [verifications]);

  return (
    <>
      {showOnboarding && <UserOnboarding onComplete={() => setShowOnboarding(false)} />}
      <QuickVerificationModal 
        isOpen={showVerificationModal} 
        onClose={() => setShowVerificationModal(false)}
        onSuccess={loadDashboardMetrics}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="space-y-8 max-w-6xl mx-auto pb-12"
      >
        {/* Welcome Section */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-zinc-900 to-zinc-950 border border-white/5 p-8 md:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 w-96 h-96 bg-verza-emerald/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Welcome back, <span className="text-verza-emerald">{user?.name || "User"}</span>
              </h1>
              <p className="text-zinc-400 text-lg">
                Manage your digital identity securely. Fast, immutable, and fully under your control.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button 
                  onClick={() => setShowVerificationModal(true)}
                  className="bg-white text-black hover:bg-zinc-200 font-semibold h-12 px-6 rounded-xl shadow-lg shadow-white/10"
                >
                  <ShieldCheck className="w-5 h-5 mr-2" />
                  Verify Identity
                </Button>
                <Button 
                  onClick={() => setLocation("/app/getting-started")}
                  variant="outline" 
                  className="h-12 px-6 rounded-xl border-white/10 hover:bg-white/5 text-white"
                >
                  How to get started
                </Button>
              </div>
            </div>
            
            {/* Quick Stats right in hero */}
            <div className="flex gap-4">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md min-w-[140px]">
                <div className="text-sm text-zinc-400 mb-1">Trust Score</div>
                <div className="text-3xl font-bold text-white">98<span className="text-lg text-verza-emerald">/100</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Grid (Phase 1 features mapped) */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              onClick={() => setShowVerificationModal(true)}
              className="group p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-verza-emerald/50 hover:bg-zinc-900 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-verza-emerald/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6 text-verza-emerald" />
              </div>
              <h3 className="font-medium text-white mb-1">Basic KYC</h3>
              <p className="text-sm text-zinc-400">Fast-track onboarding with basic ID verification.</p>
            </div>

            <div 
              onClick={() => toast.info("Full KYC flow opening...")}
              className="group p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-blue-500/50 hover:bg-zinc-900 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-medium text-white mb-1">Document Capture</h3>
              <p className="text-sm text-zinc-400">Extract data via OCR and verify authenticity.</p>
            </div>

            <div 
              onClick={() => toast.info("Liveness check opening...")}
              className="group p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-purple-500/50 hover:bg-zinc-900 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Camera className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-medium text-white mb-1">Face Match & Liveness</h3>
              <p className="text-sm text-zinc-400">Match selfie to ID and prove active liveness.</p>
            </div>
          </div>
        </div>

        {/* Stats & Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-semibold text-white">Overview</h2>
            <div className="space-y-4">
              {metrics.map((m, i) => (
                <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-zinc-900/80 border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${m.bg}`}>
                      <m.icon className={`w-5 h-5 ${m.color}`} />
                    </div>
                    <span className="text-zinc-300 font-medium">{m.label}</span>
                  </div>
                  <span className="text-2xl font-bold text-white">{m.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Recent Verifications</h2>
              <Button variant="ghost" className="text-zinc-400 hover:text-white" onClick={() => setLocation("/app/credentials")}>
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            
            <div className="bg-zinc-900/80 border border-white/5 rounded-2xl overflow-hidden">
              {isLoadingMetrics ? (
                <div className="p-8 text-center text-zinc-500">Loading...</div>
              ) : recentVerifications.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {recentVerifications.map((v) => (
                    <div key={v.verificationId} className="flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-2 h-2 rounded-full ${
                          v.status === 'verified' ? 'bg-emerald-400' : 
                          v.status === 'rejected' ? 'bg-red-400' : 'bg-amber-400'
                        }`} />
                        <div>
                          <p className="font-medium text-white">{v.type.replace(/_/g, ' ').toUpperCase()}</p>
                          <p className="text-xs text-zinc-500">{new Date(v.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          v.status === 'verified' ? 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400' : 
                          v.status === 'rejected' ? 'bg-red-400/10 border-red-400/20 text-red-400' : 
                          'bg-amber-400/10 border-amber-400/20 text-amber-400'
                        }`}>
                          {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                    <ShieldCheck className="w-8 h-8 text-zinc-500" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">No verifications yet</h3>
                  <p className="text-zinc-400 max-w-sm mx-auto mb-6">
                    Start your first identity verification to unlock all features and secure your digital presence.
                  </p>
                  <Button onClick={() => setShowVerificationModal(true)} className="bg-verza-emerald text-black hover:bg-verza-kelly">
                    Start Verification
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
