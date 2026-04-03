import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  User, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  Upload,
  Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UserOnboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(() => !localStorage.getItem("verza_user_onboarded"));

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      localStorage.setItem("verza_user_onboarded", "true");
      setIsOpen(false);
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
      >
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-zinc-800">
          <motion.div 
            className="h-full bg-verza-emerald"
            initial={{ width: "25%" }}
            animate={{ width: `${(step / 4) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 text-center"
              >
                <div className="w-20 h-20 bg-verza-emerald/10 text-verza-emerald rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-white">Welcome to Ontiver</h2>
                <p className="text-zinc-400 leading-relaxed">
                  We're excited to have you on board. Let's get your digital identity set up so you can start securely verifying your credentials.
                </p>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 text-center"
              >
                <div className="w-20 h-20 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <User className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-white">Complete Your Profile</h2>
                <p className="text-zinc-400 leading-relaxed">
                  Add your basic details to personalize your experience. A complete profile helps verifiers process your requests faster.
                </p>
                <div className="flex justify-center gap-4 mt-6">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-zinc-700 flex items-center justify-center text-zinc-500 hover:border-verza-emerald hover:text-verza-emerald transition-colors cursor-pointer">
                    <Camera className="w-6 h-6" />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 text-center"
              >
                <div className="w-20 h-20 bg-purple-500/10 text-purple-400 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-white">Verify Your Identity</h2>
                <p className="text-zinc-400 leading-relaxed">
                  To access all features, you'll need to complete a quick identity verification. Have your government-issued ID ready.
                </p>
                <div className="p-4 bg-zinc-800/50 rounded-xl border border-white/5 flex items-center gap-3 text-left mt-4">
                  <Upload className="w-5 h-5 text-zinc-400" />
                  <div className="text-sm">
                    <p className="font-medium text-white">Supported Documents</p>
                    <p className="text-zinc-500">Passport, Driver's License, National ID</p>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 text-center"
              >
                <div className="w-20 h-20 bg-verza-emerald/20 text-verza-emerald rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-white">You're All Set!</h2>
                <p className="text-zinc-400 leading-relaxed">
                  Your account is ready. Let's head over to your dashboard where you can start your first verification request.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 flex gap-3">
            {step > 1 && (
              <Button 
                variant="outline" 
                onClick={() => setStep(step - 1)}
                className="w-full border-white/10 hover:bg-white/5"
              >
                Back
              </Button>
            )}
            <Button 
              onClick={handleNext}
              className="w-full bg-verza-emerald text-black hover:bg-verza-kelly font-medium"
            >
              {step === 4 ? "Go to Dashboard" : "Continue"}
              {step < 4 && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
