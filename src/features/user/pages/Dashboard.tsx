import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import {
  Activity,
  ArrowRight,
  Bell,
  Camera,
  Clock,
  FileCheck,
  ShieldCheck,
  Upload,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useUserDashboardData } from "@/hooks/useBankingDashboard";
import UserOnboarding from "../components/UserOnboarding";
import QuickVerificationModal from "../components/QuickVerificationModal";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem("verza_user_onboarded"));
  const { verifications, notifications, wallet, isLoading, error, refresh } = useUserDashboardData();

  useEffect(() => {
    if (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load live dashboard metrics.");
    }
  }, [error]);

  const verifiedCount = useMemo(
    () => verifications.filter((item) => item.status === "verified").length,
    [verifications],
  );
  const pendingCount = useMemo(
    () =>
      verifications.filter((item) =>
        item.status === "pending" || item.status === "in_progress" || item.status === "review_needed",
      ).length,
    [verifications],
  );
  const unreadNotifications = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications],
  );
  const trustScore = useMemo(() => {
    if (verifications.length === 0) return 0;
    return Math.min(100, Math.round((verifiedCount / verifications.length) * 100));
  }, [verifiedCount, verifications.length]);
  const metrics = useMemo(
    () => [
      {
        label: "Verified Identities",
        value: verifiedCount,
        icon: FileCheck,
        color: "text-verza-emerald",
        bg: "bg-verza-emerald/10",
      },
      {
        label: "Pending Verifications",
        value: pendingCount,
        icon: Clock,
        color: "text-amber-400",
        bg: "bg-amber-400/10",
      },
      {
        label: "Unread Notifications",
        value: unreadNotifications,
        icon: Bell,
        color: "text-blue-400",
        bg: "bg-blue-400/10",
      },
    ],
    [pendingCount, unreadNotifications, verifiedCount],
  );
  const recentVerifications = useMemo(() => verifications.slice(0, 5), [verifications]);
  const recentNotifications = useMemo(() => notifications.slice(0, 3), [notifications]);

  return (
    <>
      {showOnboarding && <UserOnboarding onComplete={() => setShowOnboarding(false)} />}
      <QuickVerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onSuccess={() => void refresh()}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="space-y-8 max-w-6xl mx-auto pb-12"
      >
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-zinc-900 to-zinc-950 border border-white/5 p-8 md:p-12 shadow-2xl">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/4 w-96 h-96 bg-verza-emerald/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Welcome back, <span className="text-verza-emerald">{user?.name || "User"}</span>
              </h1>
              <p className="text-zinc-400 text-lg">
                Your dashboard now syncs directly with live verification, wallet, and notification services.
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

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md min-w-[140px]">
                <div className="text-sm text-zinc-400 mb-1">Trust Score</div>
                <div className="text-3xl font-bold text-white">
                  {trustScore}
                  <span className="text-lg text-verza-emerald">/100</span>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md min-w-[140px]">
                <div className="text-sm text-zinc-400 mb-1">Wallet Balance</div>
                <div className="text-3xl font-bold text-white">
                  {wallet?.currency ?? "USD"} {wallet?.balance?.toLocaleString(undefined, { maximumFractionDigits: 2 }) ?? "0"}
                </div>
              </div>
            </div>
          </div>
        </div>

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
              <p className="text-sm text-zinc-400">Launch the live individual verification workflow.</p>
            </div>

            <div
              onClick={() => setLocation("/app/request-verification")}
              className="group p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-blue-500/50 hover:bg-zinc-900 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-medium text-white mb-1">Document Capture</h3>
              <p className="text-sm text-zinc-400">Continue into OCR and document verification flows.</p>
            </div>

            <div
              onClick={() => setLocation("/app/notifications")}
              className="group p-6 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-purple-500/50 hover:bg-zinc-900 transition-all cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Camera className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-medium text-white mb-1">Live Activity</h3>
              <p className="text-sm text-zinc-400">Track notifications and follow-up actions in real time.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-semibold text-white">Overview</h2>
            <div className="space-y-4">
              {metrics.map((metric) => (
                <div key={metric.label} className="flex items-center justify-between p-5 rounded-2xl bg-zinc-900/80 border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${metric.bg}`}>
                      <metric.icon className={`w-5 h-5 ${metric.color}`} />
                    </div>
                    <span className="text-zinc-300 font-medium">{metric.label}</span>
                  </div>
                  <span className="text-2xl font-bold text-white">{metric.value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between p-5 rounded-2xl bg-zinc-900/80 border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-cyan-400/10">
                    <Wallet className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-zinc-300 font-medium">Total Spent</span>
                </div>
                <span className="text-2xl font-bold text-white">
                  {wallet?.currency ?? "USD"} {wallet?.totalSpent?.toLocaleString(undefined, { maximumFractionDigits: 2 }) ?? "0"}
                </span>
              </div>
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
              {isLoading ? (
                <div className="p-8 text-center text-zinc-500">Loading live verifications…</div>
              ) : recentVerifications.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {recentVerifications.map((verification) => (
                    <div key={verification.verificationId} className="flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            verification.status === "verified"
                              ? "bg-verza-emerald"
                              : verification.status === "rejected"
                                ? "bg-red-400"
                                : "bg-amber-400"
                          }`}
                        />
                        <div>
                          <p className="font-medium text-white">{verification.type.replace(/_/g, " ").toUpperCase()}</p>
                          <p className="text-xs text-zinc-500">{new Date(verification.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          verification.status === "verified"
                            ? "bg-verza-emerald/10 border-verza-emerald/20 text-verza-emerald"
                            : verification.status === "rejected"
                              ? "bg-red-400/10 border-red-400/20 text-red-400"
                              : "bg-amber-400/10 border-amber-400/20 text-amber-400"
                        }`}
                      >
                        {verification.status.replace(/_/g, " ")}
                      </span>
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
                    Start your first identity verification to activate the live dashboard.
                  </p>
                  <Button onClick={() => setShowVerificationModal(true)} className="bg-verza-emerald text-black hover:bg-verza-kelly">
                    Start Verification
                  </Button>
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {recentNotifications.map((notification) => (
                <div key={notification.id} className="p-4 rounded-2xl bg-zinc-900/80 border border-white/5">
                  <div className="flex items-center gap-2 text-zinc-300 mb-2">
                    <Activity className="w-4 h-4 text-verza-emerald" />
                    <span className="font-medium">{notification.title}</span>
                  </div>
                  <p className="text-sm text-zinc-400">{notification.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
