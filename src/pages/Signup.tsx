import { useState } from "react";
import { Link } from "wouter";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { 
  Lock,
  Mail,
  User,
  CheckCircle2,
  Fingerprint,
  Scan
} from "lucide-react";
import versalogo from "@/assets/versalogoSVG.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/features/auth/AuthContext";

export default function SignupPage() {
  const { signup, isLoading } = useAuth();
  const [name, setName] = useState("");
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

  const bgX = useTransform(x, [-500, 500], [-30, 30]);
  const bgY = useTransform(y, [-500, 500], [-30, 30]);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    signup();
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,176,80,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,100,255,0.1),transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-50" />
        
        {/* Animated Shapes */}
        <motion.div 
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] border border-white/5 rounded-full"
        />
        <motion.div 
          animate={{ 
            rotate: -360,
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] border border-white/5 rounded-full"
        />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto p-6 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Signup Form */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto lg:mx-0 order-2 lg:order-1"
        >
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-[#00FF87] rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
            
            <div className="relative bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 shadow-2xl">
              <div className="mb-8">
                <Link href="/">
                   <div className="flex items-center gap-2 mb-6 cursor-pointer group/logo">
                    <img src={versalogo} alt="Verza" className="h-8 w-8 group-hover/logo:rotate-180 transition-transform duration-700" />
                    <span className="text-xl font-bold tracking-tight">VERZA</span>
                  </div>
                </Link>
                <h2 className="text-2xl font-bold mb-2">Create Identity</h2>
                <p className="text-gray-400">Initialize your secure profile on the network</p>
              </div>

              <form onSubmit={handleSignup} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                  <div className="relative group/input">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-focus-within/input:text-[#00FF87] transition-colors" />
                    <Input 
                      type="text" 
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 h-12 bg-white/5 border-white/10 text-white focus:border-[#00FF87] focus:ring-[#00FF87]/20 transition-all rounded-xl"
                    />
                  </div>
                </div>

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
                  <label className="text-sm font-medium text-gray-300 ml-1">Passcode</label>
                  <div className="relative group/input">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500 group-focus-within/input:text-[#00FF87] transition-colors" />
                    <Input 
                      type="password" 
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-12 bg-white/5 border-white/10 text-white focus:border-[#00FF87] focus:ring-[#00FF87]/20 transition-all rounded-xl"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-[#00B050] hover:from-[#00B050] hover:to-blue-600 text-white font-bold text-lg rounded-xl shadow-[0_0_20px_-5px_rgba(0,176,80,0.5)] transition-all duration-300 mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? "Establishing Connection..." : "Generate Identity"}
                </Button>
              </form>

              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                <p className="text-gray-400">
                  Already have an identity?{" "}
                  <Link href="/login">
                    <span className="text-[#00FF87] font-semibold hover:underline cursor-pointer">
                      Access Terminal
                    </span>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Side: Features/Art */}
        <div className="hidden lg:flex flex-col justify-center order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl font-bold leading-tight mb-8">
              Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00FF87] to-blue-500">Evolution</span> of Verification
            </h1>
            
            <div className="space-y-8">
              {[
                { 
                  icon: Fingerprint, 
                  title: "Biometric Integration", 
                  desc: "Advanced identity proofing using neural matching algorithms."
                },
                { 
                  icon: Scan, 
                  title: "Instant KYC/KYB", 
                  desc: "Automated verification pipelines processing data in milliseconds."
                },
                { 
                  icon: CheckCircle2, 
                  title: "Smart Contracts", 
                  desc: "Self-executing agreements backed by blockchain technology."
                }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (i * 0.15) }}
                  className="flex gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#00FF87]/50 group-hover:bg-[#00FF87]/10 transition-all duration-300">
                    <item.icon className="w-6 h-6 text-gray-400 group-hover:text-[#00FF87] transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1 group-hover:text-[#00FF87] transition-colors">{item.title}</h3>
                    <p className="text-gray-400 max-w-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
