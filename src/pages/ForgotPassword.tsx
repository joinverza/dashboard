import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Lock, 
  Mail, 
  CheckCircle2, 
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isSuccess && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev: number) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setLocation("/login");
    }
    return () => clearInterval(timer);
  }, [isSuccess, countdown, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] rounded-full blur-[100px] bg-[#00FF87]/5" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#1A1A1A]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-8">
          
          <Link href="/login">
            <button className="flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-6 group">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </button>
          </Link>

          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <Lock className="h-8 w-8 text-[#00FF87]" />
                </div>

                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold mb-2">Forgot Password?</h1>
                  <p className="text-gray-400 text-sm">
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input 
                        type="email" 
                        placeholder="name@example.com" 
                        className="bg-black/20 border-white/10 focus:border-[#00FF87]/50 text-white pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-[#00B050] hover:bg-[#00FF87] text-black font-semibold shadow-[0_0_20px_-5px_rgba(0,255,135,0.4)] transition-all"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending Link..." : "Send Reset Link"}
                    {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6 mx-auto border border-green-500/20">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>

                <h2 className="text-2xl font-bold mb-2">Check your email</h2>
                <p className="text-gray-400 text-sm mb-6">
                  We've sent a password reset link to <br />
                  <span className="text-white font-medium">{email}</span>
                </p>

                <div className="bg-white/5 rounded-lg p-4 mb-6 text-sm text-gray-400">
                  Didn't receive the email? <button className="text-[#00FF87] hover:underline" onClick={() => setIsSuccess(false)}>Click to resend</button>
                </div>

                <p className="text-xs text-gray-500">
                  Redirecting to login in {countdown}s...
                </p>
                
                <Button 
                  variant="outline"
                  className="w-full mt-4 border-white/10 hover:bg-white/5"
                  onClick={() => setLocation("/login")}
                >
                  Return to Login
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
