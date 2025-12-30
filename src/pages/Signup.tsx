import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Wallet, 
  ArrowRight,
  Shield,
  Zap,
  CreditCard
} from "lucide-react";
import versalogo from "@/assets/versalogoSVG.svg";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/features/auth/AuthContext";

export default function SignupPage() {
  const { signup, isLoading } = useAuth();

  const handleSignup = () => {
    signup();
  };

  const handleWalletConnect = () => {
    // Wallet signup logic
    signup();
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] bg-[#00FF87]/10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] bg-purple-500/10" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl grid md:grid-cols-2 bg-[#1A1A1A]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Left Side: Content/Benefits */}
        <div className="hidden md:flex flex-col justify-between p-8 bg-black/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00FF87]/5 to-transparent pointer-events-none" />
          
          <div>
            <Link href="/">
              <img src={versalogo} alt="Verza" className="h-8 w-8 mb-8" />
            </Link>
            <h2 className="text-3xl font-bold mb-6 leading-tight">
              Start your journey to <br />
              <span className="text-[#00FF87]">Decentralized Identity</span>
            </h2>
            <div className="space-y-6">
              {[
                { icon: Zap, title: "Instant Verification", desc: "Get verified in minutes, not days." },
                { icon: Shield, title: "Bank-Grade Security", desc: "Your data never leaves your device unencrypted." },
                { icon: CreditCard, title: "No Credit Card Required", desc: "Start with 3 free verifications per month." }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-[#00FF87]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs text-gray-500">Trusted by leading companies</p>
            <div className="flex gap-4 mt-2 opacity-50 grayscale">
              <div className="h-6 w-20 bg-white/10 rounded" />
              <div className="h-6 w-20 bg-white/10 rounded" />
              <div className="h-6 w-20 bg-white/10 rounded" />
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8">
          <div className="text-center md:text-left mb-6">
            <h1 className="text-2xl font-bold">Create an account</h1>
            <p className="text-gray-400 text-sm">Join thousands of users today</p>
          </div>

          {/* Wallet Connect */}
          <Button 
            variant="outline" 
            className="w-full h-11 bg-white/5 border-white/10 hover:bg-white/10 hover:border-[#00FF87]/50 transition-all group mb-4"
            onClick={handleWalletConnect}
            disabled={isLoading}
          >
            <Wallet className="mr-2 h-5 w-5 text-[#00FF87] group-hover:scale-110 transition-transform" />
            Sign up with Wallet
          </Button>

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <Separator className="bg-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#1A1A1A] px-2 text-gray-500">Or using email</span>
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              type="button" 
              className="w-full h-11 bg-[#00B050] hover:bg-[#00FF87] text-black font-semibold shadow-[0_0_20px_-5px_rgba(0,255,135,0.4)] transition-all mt-4"
              disabled={isLoading}
              onClick={handleSignup}
            >
              {isLoading ? "Redirecting..." : "Sign Up with Auth0"}
              {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-400">Already have an account? </span>
            <Link href="/login">
              <span className="text-[#00FF87] hover:underline cursor-pointer font-medium">Sign in</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
