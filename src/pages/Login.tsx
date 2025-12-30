import { useState } from "react";
import { Link } from "wouter";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { 
  ArrowRight,
  Lock,
  Mail,
  Zap,
  Cpu,
  Globe,
  Shield
} from "lucide-react";
import versalogo from "@/assets/versalogoSVG.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/AuthContext";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Mouse move effect for background
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    x.set(clientX - centerX);
    y.set(clientY - centerY);
  };

  const bgX = useTransform(x, [-500, 500], [-20, 20]);
  const bgY = useTransform(y, [-500, 500], [-20, 20]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login();
  };

  return (
    <div 
      className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden font-sans selection:bg-[#00FF87] selection:text-black"
      onMouseMove={handleMouseMove}
    >
      {/* Dynamic Background */}
      <motion.div 
        style={{ x: bgX, y: bgY }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,135,0.05),transparent_70%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />
        
        {/* Floating Elements */}
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00FF87]/10 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ 
            y: [0, 30, 0],
            rotate: [0, -5, 5, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]"
        />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto p-6 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Side: Brand/Art */}
        <div className="hidden lg:flex flex-col justify-center space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-[#00FF87] blur-lg opacity-50 animate-pulse" />
                <img src={versalogo} alt="Verza" className="h-12 w-12 relative z-10" />
              </div>
              <span className="text-3xl font-bold tracking-tighter">VERZA</span>
            </div>
            
            <h1 className="text-6xl font-bold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
              The Future of <br/>
              <span className="text-[#00FF87]">Decentralized</span> Work
            </h1>
            
            <p className="text-gray-400 text-lg max-w-md leading-relaxed">
              Access the neural network of professional verification. 
              Secure, instant, and borderless.
            </p>
          </motion.div>

          {/* Stats/features cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Shield, label: "Bank-Grade Security", value: "256-bit" },
              { icon: Zap, label: "Transaction Speed", value: "< 0.1s" },
              { icon: Globe, label: "Global Access", value: "190+ Countries" },
              { icon: Cpu, label: "AI Verification", value: "99.9% Accuracy" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (i * 0.1) }}
                className="bg-white/5 backdrop-blur-sm border border-white/5 p-4 rounded-xl hover:bg-white/10 transition-colors"
              >
                <item.icon className="w-6 h-6 text-[#00FF87] mb-2" />
                <div className="text-sm text-gray-400">{item.label}</div>
                <div className="text-lg font-bold">{item.value}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side: Login Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="relative group">
            {/* Glow border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00FF87] to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
            
            <div className="relative bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 shadow-2xl">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
                <p className="text-gray-400">Enter your credentials to access the terminal</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">Email Interface</label>
                  <div className="relative group/input">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-focus-within/input:text-[#00FF87] transition-colors" />
                    <Input 
                      type="email" 
                      placeholder="user@verza.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 bg-white/5 border-white/10 text-white focus:border-[#00FF87] focus:ring-[#00FF87]/20 transition-all rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-sm font-medium text-gray-300">Passcode</label>
                    <Link href="/forgot-password">
                      <span className="text-xs text-[#00FF87] hover:underline cursor-pointer">Forgot passcode?</span>
                    </Link>
                  </div>
                  <div className="relative group/input">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-focus-within/input:text-[#00FF87] transition-colors" />
                    <Input 
                      type="password" 
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-12 bg-white/5 border-white/10 text-white focus:border-[#00FF87] focus:ring-[#00FF87]/20 transition-all rounded-xl"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-[#00B050] to-[#00FF87] hover:from-[#00FF87] hover:to-[#00B050] text-black font-bold text-lg rounded-xl shadow-[0_0_20px_-5px_rgba(0,255,135,0.5)] hover:shadow-[0_0_30px_-5px_rgba(0,255,135,0.7)] transition-all duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-black rounded-full animate-bounce" />
                      <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-2 h-2 bg-black rounded-full animate-bounce [animation-delay:0.4s]" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Initialize Session <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-gray-400">
                  New to the network?{" "}
                  <Link href="/signup">
                    <span className="text-[#00FF87] font-semibold hover:underline cursor-pointer">
                      Establish connection
                    </span>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
