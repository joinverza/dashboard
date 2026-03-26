import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, Upload, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { bankingService } from "@/services/bankingService";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface QuickVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function QuickVerificationModal({ isOpen, onClose, onSuccess }: QuickVerificationModalProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    idDocumentType: "national_id" as "passport" | "drivers_license" | "national_id",
  });

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      // Simulate reading a file if there was an actual file input, but we use the backend API
      await bankingService.verifyIndividualBasic({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        dob: formData.dob,
        idDocumentType: formData.idDocumentType,
      });

      toast.success("Verification request submitted successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit verification");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-verza-emerald" />
            <h2 className="text-lg font-semibold text-white">Start Verification</h2>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label className="text-zinc-300">First Name</Label>
                  <Input 
                    placeholder="e.g. John" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="bg-zinc-900 border-zinc-800 focus:border-verza-emerald"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Last Name</Label>
                  <Input 
                    placeholder="e.g. Doe" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="bg-zinc-900 border-zinc-800 focus:border-verza-emerald"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Email Address</Label>
                  <Input 
                    type="email"
                    placeholder="john@example.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="bg-zinc-900 border-zinc-800 focus:border-verza-emerald"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Date of Birth</Label>
                  <Input 
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({...formData, dob: e.target.value})}
                    className="bg-zinc-900 border-zinc-800 focus:border-verza-emerald"
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label className="text-zinc-300">Document Type</Label>
                  <Select 
                    value={formData.idDocumentType} 
                    onValueChange={(v: any) => setFormData({...formData, idDocumentType: v})}
                  >
                    <SelectTrigger className="bg-zinc-900 border-zinc-800 focus:ring-verza-emerald">
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="national_id">National ID</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="drivers_license">Driver's License</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-4 p-8 border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center gap-3 bg-zinc-900/50 hover:bg-zinc-900 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
                    <Upload className="w-5 h-5 text-zinc-400 group-hover:text-verza-emerald" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white">Click to upload document</p>
                    <p className="text-xs text-zinc-500 mt-1">PNG, JPG or PDF (max 10MB)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg mt-4 border border-blue-500/20">
                  <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-200">
                    Make sure the document is clearly visible, well-lit, and all text is legible. 
                    This helps our automated OCR system process it quickly.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6 border-t border-white/5 flex gap-3 bg-zinc-950">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack} className="flex-1 border-zinc-800 hover:bg-zinc-900">
              Back
            </Button>
          )}
          {step === 1 ? (
            <Button 
              onClick={handleNext} 
              className="flex-1 bg-verza-emerald text-black hover:bg-verza-kelly"
              disabled={!formData.firstName || !formData.lastName || !formData.email}
            >
              Continue
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading}
              className="flex-1 bg-verza-emerald text-black hover:bg-verza-kelly"
            >
              {isLoading ? "Submitting..." : "Submit Verification"}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
