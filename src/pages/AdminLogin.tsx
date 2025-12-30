import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ShieldAlert,
  Lock,
  Server,
  Fingerprint
} from "lucide-react";
import versalogo from "@/assets/versalogoSVG.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/AuthContext";
import { Separator } from "@/components/ui/separator";

export default function AdminLoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, "admin", adminKey);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#050505] text-white selection:bg-red-500/20 selection:text-red-500">
      {/* Right Panel - Brand & Vision */}
      <div className="hidden lg:flex w-1/2 relative bg-[#000000] overflow-hidden flex-col justify-between p-12 border-l border-white/5 order-2">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_100%,_#1a0505_0%,_transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
        
        {/* Logo */}
        <div className="relative z-10 flex items-center justify-end gap-3">
          <span className="text-xl font-bold tracking-tight text-white">Verza Admin</span>
          <img src={versalogo} alt="Verza" className="h-8 w-8 grayscale opacity-80" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-lg ml-auto text-right">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-5xl font-semibold tracking-tight leading-[1.1] mb-6 text-white">
              System <br />
              <span className="text-red-500">Administration</span>
            </h1>
            <p className="text-lg text-zinc-500 leading-relaxed mb-8">
              Restricted access for system administrators only. Unauthorized access attempts will be logged and reported.
            </p>
            
            <div className="flex flex-col gap-4 items-end">
              {[
                { icon: ShieldAlert, text: "Root Access Control" },
                { icon: Server, text: "Infrastructure Management" },
                { icon: Lock, text: "Security Protocol Level 4" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-zinc-400">
                  <span className="text-sm font-medium">{item.text}</span>
                  <div className="h-8 w-8 rounded-full bg-red-500/5 border border-red-500/20 flex items-center justify-center shrink-0">
                    <item.icon className="h-4 w-4 text-red-500" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between text-xs text-red-900/50 uppercase tracking-widest font-medium">
          <span className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            Secure Connection
          </span>
          <span>Verza Systems Inc.</span>
        </div>
      </div>

      {/* Left Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-24 relative bg-[#050505] order-1">
        <div className="w-full max-w-[400px] space-y-8">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <img src={versalogo} alt="Verza" className="h-8 w-8" />
            <span className="text-xl font-bold text-white">Admin Portal</span>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-semibold tracking-tight text-white">Admin Login</h2>
            <p className="text-zinc-500">Authenticate with your master credentials</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">System ID / Email</label>
              <Input 
                type="email" 
                placeholder="admin@verza.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-900/30 border-zinc-800 focus:border-red-500/50 h-11 text-white placeholder:text-zinc-700 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Password</label>
              <Input 
                type="password" 
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-900/30 border-zinc-800 focus:border-red-500/50 h-11 text-white placeholder:text-zinc-700 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Master Key</label>
              <div className="relative">
                <Fingerprint className="absolute left-3 top-3 h-5 w-5 text-zinc-600" />
                <Input 
                  type="password" 
                  placeholder="Enter master security key"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  className="pl-10 bg-zinc-900/30 border-zinc-800 focus:border-red-500/50 h-11 text-white placeholder:text-zinc-700 transition-colors font-mono"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-red-600 hover:bg-red-500 text-white font-medium transition-all shadow-[0_0_20px_-5px_rgba(220,38,38,0.5)]"
              disabled={isLoading}
            >
              {isLoading ? "Authenticating Root..." : "Access Control Panel"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-zinc-900" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#050505] px-2 text-zinc-600">Restricted</span>
            </div>
          </div>

          <p className="text-center text-xs text-zinc-600 font-mono">
            IP Address Logged. Access is monitored.
          </p>
        </div>
      </div>
    </div>
  );
}