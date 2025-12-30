import { Link } from "wouter";
import { motion } from "framer-motion";
import { 
  Wallet, 
  CheckCircle2, 
  ShieldCheck,
  ArrowRight
} from "lucide-react";
import versalogo from "@/assets/versalogoSVG.svg";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/features/auth/AuthContext";

export default function LoginPage() {
  const { login, isLoading } = useAuth();

  const handleLogin = () => {
    login();
  };

  const handleWalletConnect = () => {
    // Wallet connect logic if separate
    login();
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] bg-[#00FF87]/10" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] bg-blue-500/10" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#1A1A1A]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <Link href="/">
                <img src={versalogo} alt="Verza" className="h-10 w-10 mx-auto mb-4 cursor-pointer" />
              </Link>
              <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
              <p className="text-gray-400 text-sm">Sign in to your dashboard</p>
            </div>

            {/* Wallet Connect */}
            <Button 
              variant="outline" 
              className="w-full h-12 bg-white/5 border-white/10 hover:bg-white/10 hover:border-[#00FF87]/50 transition-all group mb-6"
              onClick={handleWalletConnect}
              disabled={isLoading}
            >
              <Wallet className="mr-2 h-5 w-5 text-[#00FF87] group-hover:scale-110 transition-transform" />
              Connect Wallet
            </Button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <Separator className="bg-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#1A1A1A] px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Login Button */}
            <div className="space-y-4">
              <Button 
                type="button" 
                className="w-full h-11 bg-[#00B050] hover:bg-[#00FF87] text-black font-semibold shadow-[0_0_20px_-5px_rgba(0,255,135,0.4)] transition-all"
                disabled={isLoading}
                onClick={handleLogin}
              >
                {isLoading ? "Redirecting..." : "Sign In with Auth0"}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-400">Don't have an account? </span>
              <Link href="/signup">
                <span className="text-[#00FF87] hover:underline cursor-pointer font-medium">Sign up</span>
              </Link>
            </div>
          </div>
          
          <div className="bg-black/20 p-4 border-t border-white/5 flex justify-center gap-6">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <ShieldCheck className="w-3 h-3" /> SOC2 Compliant
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <CheckCircle2 className="w-3 h-3" /> End-to-End Encrypted
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
