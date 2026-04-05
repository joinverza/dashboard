import { useState } from "react";
import { Link } from "wouter";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ShieldCheck, KeyRound, Lock } from "lucide-react";
import versalogo from "@/assets/ONTIVER white.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/AuthContext";
import { Separator } from "@/components/ui/separator";

export default function UserSignupPage() {
  const { signup, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup({
        role: "user",
        fullName,
        email,
        password,
        consentAccepted: true,
      });
      setLocation("/login");
    } catch {
      return;
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#09090b] text-white selection:bg-verza-emerald/20 selection:text-verza-emerald">
      <div className="hidden lg:flex w-1/2 relative bg-[#000000] overflow-hidden flex-col justify-between p-12 border-l border-white/5 order-2">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,_#002411_0%,_transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-verza-emerald/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 flex items-center justify-end gap-3">
          <span className="text-xl font-bold tracking-tight text-white">Ontiver User</span>
          <img src={versalogo} alt="Ontiver" className="h-8 w-8" />
        </div>

        <div className="relative z-10 max-w-lg ml-auto text-right">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-5xl font-semibold tracking-tight leading-[1.1] mb-6 text-white">
              Create your <br />
              <span className="text-verza-emerald">user account</span>
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed mb-8">
              Register your account, generate your auth key, and access your secure user dashboard.
            </p>

            <div className="flex flex-col gap-4 items-end">
              {[
                { icon: ShieldCheck, text: "Role-Segmented Auth" },
                { icon: KeyRound, text: "Generated Auth Key" },
                { icon: Lock, text: "MFA-Ready Login Security" },
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
          <span>User Onboarding</span>
          <span>© 2025 Ontiver Inc.</span>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-24 relative bg-[#09090b] order-1">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <img src={versalogo} alt="Ontiver" className="h-8 w-8" />
            <span className="text-xl font-bold text-white">Ontiver User</span>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-semibold tracking-tight text-white">User Signup</h2>
            <p className="text-zinc-400">Create your account to access the user dashboard</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Full Name</label>
              <Input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-zinc-900/50 border-zinc-800 focus:border-verza-emerald/50 h-11 text-white placeholder:text-zinc-600 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-900/50 border-zinc-800 focus:border-verza-emerald/50 h-11 text-white placeholder:text-zinc-600 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Password</label>
              <Input
                type="password"
                placeholder="Create a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-900/50 border-zinc-800 focus:border-verza-emerald/50 h-11 text-white placeholder:text-zinc-600 transition-colors"
              />
              <p className="text-xs text-zinc-500">Must be at least 12 characters.</p>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-white text-black hover:bg-zinc-200 font-medium transition-all mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Generate auth key"}
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
            Already have an account?{" "}
            <Link href="/login">
              <span className="text-verza-emerald hover:text-verza-kelly font-medium cursor-pointer transition-colors">
                Sign in
              </span>
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}
