import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ShieldAlert, Key, Lock, BadgeCheck } from "lucide-react";
import versalogo from "@/assets/ONTIVER white.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/AuthContext";
import { Separator } from "@/components/ui/separator";
import { AuthApiError } from "@/services/authService";
import { MockRoleSelector } from "@/components/auth/MockRoleSelector";
import type { UserRole } from "@/features/auth/AuthContext";

// TEMPORARY DEVELOPMENT ONLY:
// The mock role selector on this screen exists only for local editing before live auth is finalized.
// Do not couple future production login behavior to this temporary selector.

export default function VerifierLoginPage() {
  const { login, verifyMfa, verifyMfaRecoveryCode, mfaChallenge, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authKey, setAuthKey] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("verifier");
  const [mfaCode, setMfaCode] = useState("");
  const [mfaMethod, setMfaMethod] = useState<"totp" | "recovery_code">("totp");
  const [mfaError, setMfaError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMfaError("");
    try {
      if (mfaChallenge) {
        if (mfaMethod === "recovery_code") {
          await verifyMfaRecoveryCode(mfaCode.trim());
          return;
        }
        await verifyMfa(mfaCode.trim());
        return;
      }
      await login({
        email,
        password,
        role: selectedRole,
        authKey,
      });
    } catch (error) {
      if (error instanceof AuthApiError && error.status === 401 && error.code === "mfa_failed") {
        setMfaError("Invalid or expired challenge, or invalid/reused recovery code.");
      }
      return;
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#09090b] text-white selection:bg-verza-emerald/20 selection:text-verza-emerald">
      <div className="hidden lg:flex w-1/2 relative bg-[#000000] overflow-hidden flex-col justify-between p-12 border-l border-white/5 order-2">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,_#002417_0%,_transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-verza-emerald/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 flex items-center justify-end gap-3">
          <span className="text-xl font-bold tracking-tight text-white">Verifier Portal</span>
          <img src={versalogo} alt="Ontiver" className="h-8 w-8" />
        </div>

        <div className="relative z-10 max-w-lg ml-auto text-right">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-5xl font-semibold tracking-tight leading-[1.1] mb-6 text-white">
              Verifier <br />
              <span className="text-verza-emerald">operations hub</span>
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed mb-8">
              Review verification requests, process credentials, and manage verifier operations with secure access controls.
            </p>

            <div className="flex flex-col gap-4 items-end">
              {[
                { icon: ShieldAlert, text: "Verification Integrity" },
                { icon: BadgeCheck, text: "Trusted Verifier Network" },
                { icon: Lock, text: "Role-Segmented Access" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-zinc-300">
                  <span className="text-sm font-medium">{item.text}</span>
                  <div className="h-8 w-8 rounded-full bg-zinc-900/50 border border-zinc-800 flex items-center justify-center shrink-0">
                    <item.icon className="h-4 w-4 text-verza-emerald" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 flex items-center justify-between text-xs text-zinc-500 uppercase tracking-widest font-medium">
          <span>Restricted Access</span>
          <span>© 2025 Ontiver Inc.</span>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-24 relative bg-[#09090b] order-1">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <img src={versalogo} alt="Ontiver" className="h-8 w-8" />
            <span className="text-xl font-bold text-white">Verifier Portal</span>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-semibold tracking-tight text-white">Verifier Login</h2>
            <p className="text-zinc-400">Sign in with your verifier credentials and auth key</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* TEMPORARY DEVELOPMENT ONLY: lets us choose which mock role session to create for local editing. */}
            <MockRoleSelector selectedRole={selectedRole} onSelect={setSelectedRole} />

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Email</label>
              <Input
                type="email"
                placeholder="verifier@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-900/50 border-zinc-800 focus:border-verza-emerald/50 h-11 text-white placeholder:text-zinc-600 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-900/50 border-zinc-800 focus:border-verza-emerald/50 h-11 text-white placeholder:text-zinc-600 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Auth Key</label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
                <Input
                  type="text"
                  placeholder="Enter verifier auth key"
                  value={authKey}
                  onChange={(e) => setAuthKey(e.target.value)}
                  className="pl-10 bg-zinc-900/50 border-zinc-800 focus:border-verza-emerald/50 h-11 text-white placeholder:text-zinc-600 transition-colors font-mono"
                />
              </div>
            </div>

            {mfaChallenge && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={mfaMethod === "totp" ? "default" : "outline"}
                    onClick={() => setMfaMethod("totp")}
                    className="h-9"
                  >
                    TOTP code
                  </Button>
                  <Button
                    type="button"
                    variant={mfaMethod === "recovery_code" ? "default" : "outline"}
                    onClick={() => setMfaMethod("recovery_code")}
                    className="h-9"
                  >
                    Recovery code
                  </Button>
                </div>
                <label className="text-sm font-medium text-zinc-300">{mfaMethod === "totp" ? "TOTP code" : "Recovery code"}</label>
                <Input
                  type="text"
                  placeholder={mfaMethod === "totp" ? "123456" : "Enter recovery code"}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  className="bg-zinc-900/50 border-zinc-800 focus:border-verza-emerald/50 h-11 text-white placeholder:text-zinc-600 transition-colors font-mono"
                />
                {mfaError ? <p className="text-sm text-red-400">{mfaError}</p> : null}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-verza-emerald hover:bg-verza-emerald text-white font-medium transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Authenticating..." : mfaChallenge ? (mfaMethod === "totp" ? "Verify TOTP" : "Verify Recovery Code") : "Access Verifier Dashboard"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#09090b] px-2 text-zinc-500">Or</span>
            </div>
          </div>

          <p className="text-center text-sm text-zinc-400">
            Need a verifier account?{" "}
            <Link href="/verifier/signup">
              <span className="text-verza-emerald hover:text-verza-emerald font-medium cursor-pointer transition-colors">
                Register verifier
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
