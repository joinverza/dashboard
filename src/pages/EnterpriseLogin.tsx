import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Building2,
  ShieldAlert,
  Key,
  Lock
} from "lucide-react";
import versalogo from "@/assets/versalogoSVG.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth, type UserRole } from "@/features/auth/AuthContext";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EnterpriseLoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authKey, setAuthKey] = useState("");
  const [role, setRole] = useState<UserRole>("enterprise");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, role, authKey);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#09090b] text-white selection:bg-blue-500/20 selection:text-blue-500">
      {/* Right Panel - Brand & Vision */}
      <div className="hidden lg:flex w-1/2 relative bg-[#000000] overflow-hidden flex-col justify-between p-12 border-l border-white/5 order-2">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,_#001524_0%,_transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
        
        {/* Logo */}
        <div className="relative z-10 flex items-center justify-end gap-3">
          <span className="text-xl font-bold tracking-tight text-white">Verza Portal</span>
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
              Secure access for <br />
              <span className="text-blue-500">partners & admins</span>
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed mb-8">
              Manage verifications, issuance, and enterprise governance from a unified secure enclave.
            </p>
            
            <div className="flex flex-col gap-4 items-end">
              {[
                { icon: Building2, text: "Enterprise Management" },
                { icon: ShieldAlert, text: "Verifier Operations" },
                { icon: Lock, text: "Administrative Control" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-zinc-300">
                  <span className="text-sm font-medium">{item.text}</span>
                  <div className="h-8 w-8 rounded-full bg-zinc-900/50 border border-zinc-800 flex items-center justify-center shrink-0">
                    <item.icon className="h-4 w-4 text-blue-500" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-zinc-500 uppercase tracking-widest font-medium">
          <span>Restricted Access</span>
          <span>© 2024 Verza Inc.</span>
        </div>
      </div>

      {/* Left Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-24 relative bg-[#09090b] order-1">
        <div className="w-full max-w-[400px] space-y-8">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <img src={versalogo} alt="Verza" className="h-8 w-8" />
            <span className="text-xl font-bold text-white">Verza Portal</span>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-semibold tracking-tight text-white">Portal Access</h2>
            <p className="text-zinc-400">Enter your credentials and auth key to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Role</label>
              <Select value={role} onValueChange={(v: UserRole) => setRole(v)}>
                <SelectTrigger className="bg-zinc-900/50 border-zinc-800 focus:ring-blue-500/20 h-11 text-white">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enterprise">Enterprise Partner</SelectItem>
                  <SelectItem value="verifier">Verifier Node</SelectItem>
                  <SelectItem value="admin">System Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Email</label>
              <Input 
                type="email" 
                placeholder="admin@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-900/50 border-zinc-800 focus:border-blue-500/50 h-11 text-white placeholder:text-zinc-600 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Password</label>
              <Input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-900/50 border-zinc-800 focus:border-blue-500/50 h-11 text-white placeholder:text-zinc-600 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Auth Key</label>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-5 w-5 text-zinc-500" />
                <Input 
                  type="text" 
                  placeholder="Enter your generated auth key"
                  value={authKey}
                  onChange={(e) => setAuthKey(e.target.value)}
                  className="pl-10 bg-zinc-900/50 border-zinc-800 focus:border-blue-500/50 h-11 text-white placeholder:text-zinc-600 transition-colors font-mono"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Authenticating..." : "Access Portal"}
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
            Need an enterprise account?{" "}
            <Link href="/portal/signup">
              <span className="text-blue-500 hover:text-blue-400 font-medium cursor-pointer transition-colors">
                Apply for access
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}