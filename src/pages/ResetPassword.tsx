import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Key, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ArrowRight,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth/AuthContext";

export default function ResetPasswordPage() {
  const [, setLocation] = useLocation();
  const { resetPassword, isLoading } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const requirements = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "Contains a number", valid: /\d/.test(password) },
    { label: "Contains a special character", valid: /[!@#$%^&*]/.test(password) },
    { label: "Contains an uppercase letter", valid: /[A-Z]/.test(password) }
  ];

  const allValid = requirements.every(r => r.valid) && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allValid) return;
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token") || "";
    if (!token) return;
    try {
      await resetPassword(token, password);
      setIsSuccess(true);
      setTimeout(() => setLocation("/login"), 3000);
    } catch {
      return;
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-[-20%] right-[20%] w-[500px] h-[500px] rounded-full blur-[100px] bg-blue-500/5" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#1A1A1A]/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden p-8">
          
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
                  <Key className="h-8 w-8 text-verza-emerald" />
                </div>

                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
                  <p className="text-gray-400 text-sm">
                    Create a new strong password for your account.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">New Password</label>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Enter new password" 
                        className="bg-black/20 border-white/10 focus:border-verza-emerald/50 text-white pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Confirm Password</label>
                    <Input 
                      type="password" 
                      placeholder="Confirm new password" 
                      className={cn(
                        "bg-black/20 border-white/10 focus:border-verza-emerald/50 text-white",
                        confirmPassword && password !== confirmPassword && "border-red-500/50"
                      )}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  {/* Requirements List */}
                  <div className="space-y-2 bg-white/5 p-4 rounded-lg">
                    <p className="text-xs font-medium text-gray-400 mb-2">Password Requirements:</p>
                    {requirements.map((req, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        {req.valid ? (
                          <Check className="w-3 h-3 text-verza-emerald" />
                        ) : (
                          <div className="w-3 h-3 rounded-full border border-gray-600" />
                        )}
                        <span className={req.valid ? "text-gray-300" : "text-gray-500"}>{req.label}</span>
                      </div>
                    ))}
                     <div className="flex items-center gap-2 text-xs pt-1 border-t border-white/5 mt-1">
                        {password === confirmPassword && password.length > 0 ? (
                           <Check className="w-3 h-3 text-verza-emerald" />
                        ) : (
                           <div className="w-3 h-3 rounded-full border border-gray-600" />
                        )}
                        <span className={password === confirmPassword && password.length > 0 ? "text-gray-300" : "text-gray-500"}>Passwords match</span>
                     </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-verza-emerald hover:bg-verza-kelly text-black font-semibold shadow-[0_0_20px_-5px_rgba(30,215,96,0.4)] transition-all"
                    disabled={isLoading || !allValid}
                  >
                    {isLoading ? "Resetting..." : "Reset Password"}
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
                <div className="w-20 h-20 bg-verza-emerald/10 rounded-full flex items-center justify-center mb-6 mx-auto border border-verza-emerald/20">
                  <CheckCircle2 className="h-10 w-10 text-verza-emerald" />
                </div>

                <h2 className="text-2xl font-bold mb-2">Password Reset!</h2>
                <p className="text-gray-400 text-sm mb-6">
                  Your password has been successfully updated. You can now login with your new credentials.
                </p>

                <p className="text-xs text-gray-500">
                  Redirecting to login...
                </p>
                
                <Button 
                  className="w-full mt-6 bg-verza-emerald text-black hover:bg-verza-kelly"
                  onClick={() => setLocation("/login")}
                >
                  Continue to Login
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
