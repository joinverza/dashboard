import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Github,
  Command,
  ShieldCheck,
  Zap,
  Globe
} from "lucide-react";
import versalogo from "@/assets/versalogoSVG.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/AuthContext";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#09090b] text-white selection:bg-verza-emerald/20 selection:text-verza-emerald">
      {/* Right Panel - Brand & Vision (Moved to Right to match Signup) */}
      <div className="hidden lg:flex w-1/2 relative bg-[#000000] overflow-hidden flex-col justify-between p-12 border-l border-white/5 order-2">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,_#002411_0%,_transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-verza-emerald/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
        
        {/* Logo */}
        <div className="relative z-10 flex items-center justify-end gap-3">
          <span className="text-xl font-bold tracking-tight text-white">Verza</span>
          <img src={versalogo} alt="Verza" className="h-8 w-8" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-lg ml-auto text-right">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-5xl font-semibold tracking-tight leading-[1.1] mb-6 text-white">
              The standard for <br />
              <span className="text-verza-emerald">digital trust</span>
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed mb-8">
              Verza provides the infrastructure for verifiable credentials and decentralized identity. Secure, scalable, and built for the future of enterprise.
            </p>
            
            <div className="flex flex-col gap-4 items-end">
              {[
                { icon: ShieldCheck, text: "Enterprise-grade security" },
                { icon: Zap, text: "Instant global verification" },
                { icon: Globe, text: "Blockchain-backed immutable records" }
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

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-zinc-500 uppercase tracking-widest font-medium">
          <span>Secure Enclave</span>
          <span>© 2024 Verza Inc.</span>
        </div>
      </div>

      {/* Left Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-24 relative bg-[#09090b] order-1">
        <div className="w-full max-w-[400px] space-y-8">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <img src={versalogo} alt="Verza" className="h-8 w-8" />
            <span className="text-xl font-bold text-white">Verza</span>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-semibold tracking-tight text-white">Welcome back</h2>
            <p className="text-zinc-400">Enter your email to sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Email</label>
              <Input 
                type="email" 
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-900/50 border-zinc-800 focus:border-verza-emerald/50 h-11 text-white placeholder:text-zinc-600 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-300">Password</label>
                <Link href="/forgot-password">
                  <span className="text-xs text-verza-emerald hover:text-verza-kelly cursor-pointer font-medium transition-colors">
                    Forgot password?
                  </span>
                </Link>
              </div>
              <Input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-900/50 border-zinc-800 focus:border-verza-emerald/50 h-11 text-white placeholder:text-zinc-600 transition-colors"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-white text-black hover:bg-zinc-200 font-medium transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#09090b] px-2 text-zinc-500">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-11 border-zinc-800 bg-zinc-900/30 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors">
              <Github className="mr-2 h-4 w-4" />
              Github
            </Button>
            <Button variant="outline" className="h-11 border-zinc-800 bg-zinc-900/30 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors">
              <Command className="mr-2 h-4 w-4" />
              SSO
            </Button>
          </div>

          <p className="text-center text-sm text-zinc-400">
            Don't have an account?{" "}
            <Link href="/signup">
              <span className="text-verza-emerald hover:text-verza-kelly font-medium cursor-pointer transition-colors">
                Sign up
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
