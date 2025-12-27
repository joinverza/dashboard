import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Check, 
  User, 
  Camera, 
  Bell, 
  Shield, 
  Moon, 
  Sun,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import versalogo from "@/assets/versalogoSVG.svg";
import { useTheme } from "@/contexts/ThemeContext";

// Animation variants
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 50 : -50,
    opacity: 0
  })
};

export default function OnboardingPage() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    displayName: "",
    username: "",
    notifications: {
      email: true,
      push: true,
      marketing: false
    },
    privacy: "public"
  });

  const nextStep = () => {
    setDirection(1);
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFinish = () => {
    setIsLoading(true);
    setTimeout(() => {
      setLocation("/app");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] bg-[#00FF87]/10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] bg-purple-500/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
      </div>

      {/* Header */}
      <div className="absolute top-8 left-8 flex items-center gap-2">
        <img src={versalogo} alt="Verza" className="h-8 w-8" />
        <span className="text-xl font-bold tracking-tight">Verza</span>
      </div>

      <div className="w-full max-w-lg z-10">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Step {step} of 4</span>
            <span>{Math.round((step / 4) * 100)}%</span>
          </div>
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#00FF87]"
              initial={{ width: "0%" }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Card Content */}
        <div className="relative min-h-[500px] bg-[#1A1A1A]/60 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-8">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col"
              >
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00FF87] to-emerald-600 flex items-center justify-center shadow-lg shadow-[#00FF87]/20">
                    <Shield className="w-10 h-10 text-black" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold mb-2">Welcome to Verza</h1>
                    <p className="text-gray-400 max-w-xs mx-auto">
                      Your decentralized identity journey starts here. Let's set up your profile to get you verified.
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={nextStep}
                  className="w-full h-12 bg-white text-black hover:bg-gray-200 font-semibold rounded-xl text-base group"
                >
                  Let's Start
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Create your Profile</h2>
                  <p className="text-gray-400 text-sm">This is how you'll appear to verifiers and others.</p>
                </div>

                <div className="flex-1 space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex items-center gap-4">
                    <div className="relative group cursor-pointer">
                      <div className="w-20 h-20 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center group-hover:border-[#00FF87]/50 transition-colors">
                        <Camera className="w-6 h-6 text-gray-400 group-hover:text-[#00FF87]" />
                      </div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#00FF87] rounded-full flex items-center justify-center border-2 border-[#1A1A1A]">
                        <Upload className="w-3 h-3 text-black" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">Profile Photo</h3>
                      <p className="text-xs text-gray-500">Recommended 400x400px</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input 
                        id="displayName" 
                        placeholder="e.g. Alex Morgan" 
                        className="bg-white/5 border-white/10 h-11 focus:border-[#00FF87]/50"
                        value={formData.displayName}
                        onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-3 text-gray-500">@</span>
                        <Input 
                          id="username" 
                          placeholder="alexmorgan" 
                          className="bg-white/5 border-white/10 h-11 pl-8 focus:border-[#00FF87]/50"
                          value={formData.username}
                          onChange={(e) => setFormData({...formData, username: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <Button variant="outline" onClick={prevStep} className="flex-1 h-12 border-white/10 hover:bg-white/5 hover:text-white">
                    Back
                  </Button>
                  <Button onClick={nextStep} className="flex-[2] h-12 bg-[#00FF87] text-black hover:bg-[#00FF87]/90 font-semibold">
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">Preferences</h2>
                  <p className="text-gray-400 text-sm">Customize your Verza experience.</p>
                </div>

                <div className="flex-1 space-y-6">
                  {/* Appearance */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {theme === 'dark' ? <Moon className="w-5 h-5 text-purple-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
                        <div>
                          <h3 className="font-medium">Appearance</h3>
                          <p className="text-xs text-gray-400">Choose your interface theme</p>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={toggleTheme}
                        className="h-8 px-3 text-xs bg-white/10 hover:bg-white/20"
                      >
                        {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                      </Button>
                    </div>
                  </div>

                  {/* Notifications */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Notifications</h3>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <Bell className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Push Notifications</p>
                          <p className="text-xs text-gray-500">Receive alerts on your device</p>
                        </div>
                      </div>
                      <Switch 
                        checked={formData.notifications.push}
                        onCheckedChange={(c) => setFormData({...formData, notifications: {...formData.notifications, push: c}})}
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                          <Shield className="w-4 h-4 text-orange-400" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Security Alerts</p>
                          <p className="text-xs text-gray-500">Important account security updates</p>
                        </div>
                      </div>
                      <Switch checked={true} disabled />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <Button variant="outline" onClick={prevStep} className="flex-1 h-12 border-white/10 hover:bg-white/5 hover:text-white">
                    Back
                  </Button>
                  <Button onClick={nextStep} className="flex-[2] h-12 bg-[#00FF87] text-black hover:bg-[#00FF87]/90 font-semibold">
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col items-center justify-center text-center"
              >
                <div className="relative mb-8">
                  <div className="w-24 h-24 rounded-full bg-[#00FF87]/20 flex items-center justify-center animate-pulse">
                    <div className="w-16 h-16 rounded-full bg-[#00FF87] flex items-center justify-center shadow-[0_0_30px_rgba(0,255,135,0.5)]">
                      <Check className="w-8 h-8 text-black stroke-[3]" />
                    </div>
                  </div>
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center border-4 border-[#1A1A1A]"
                  >
                    <User className="w-4 h-4 text-white" />
                  </motion.div>
                </div>

                <h2 className="text-3xl font-bold mb-4">You're All Set!</h2>
                <p className="text-gray-400 max-w-sm mb-8">
                  Your profile has been created successfully. You can now start verifying your credentials and connecting with others.
                </p>

                <div className="w-full space-y-3">
                  <Button 
                    onClick={handleFinish}
                    disabled={isLoading}
                    className="w-full h-14 bg-white text-black hover:bg-gray-200 font-bold text-lg rounded-xl shadow-lg shadow-white/10"
                  >
                    {isLoading ? "Setting up..." : "Go to Dashboard"}
                  </Button>
                  <p className="text-xs text-gray-500">
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
