import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  ChevronRight, 
  X,
  Scan,
  ShieldCheck,
  CreditCard,
  Loader2,
  Camera,
  Image as ImageIcon,
  FileCheck,
  Award, 
  Briefcase,
  Clock
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// --- Mock Data ---

const CREDENTIAL_TYPES = [
  {
    id: "passport",
    name: "National Passport",
    description: "Official government-issued travel document",
    icon: FileText,
    cost: "$15.00",
    time: "~2 hrs",
    verifiers: 120
  },
  {
    id: "degree",
    name: "University Degree",
    description: "Academic qualification from accredited institution",
    icon: Award,
    cost: "$25.00",
    time: "~24 hrs",
    verifiers: 85
  },
  {
    id: "drivers_license",
    name: "Driver's License",
    description: "Official permit to operate a motor vehicle",
    icon: CreditCard,
    cost: "$10.00",
    time: "~1 hr",
    verifiers: 200
  },
  {
    id: "employment",
    name: "Employment Record",
    description: "Proof of employment history and position",
    icon: Briefcase,
    cost: "$20.00",
    time: "~4 hrs",
    verifiers: 60
  }
];

const STEPS = [
  { id: 1, title: "Select Type" },
  { id: 2, title: "Upload Document" },
  { id: 3, title: "AI Pre-Screening" },
  { id: 4, title: "Review Details" }
];

export default function UploadCredentialPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [, setLocation] = useLocation();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      toast.success(`File "${file.name}" uploaded successfully`);
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && !selectedType) {
      toast.error("Please select a credential type");
      return;
    }
    if (currentStep === 2 && !uploadedFile) {
      toast.error("Please upload a document");
      return;
    }
    
    setCurrentStep((prev) => {
      const next = prev + 1;
      if (next === 3) setScanProgress(0);
      return next;
    });
  };

  const handleSubmit = () => {
    toast.success("Credential submitted for verification!");
    setTimeout(() => {
      setLocation("/app/verification-status/1");
    }, 1500);
  };

  // Step 3 Simulation: AI Scanning
  useEffect(() => {
    if (currentStep === 3) {
      const interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setCurrentStep(4), 500); // Auto advance after scan
            return 100;
          }
          return prev + 2; // Increment progress
        });
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  const handleBack = () => {
    if (currentStep === 4) setScanProgress(0);
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
      toast.success(`File "${file.name}" uploaded successfully`);
    }
  };


  return (
    <div className="min-h-screen bg-background text-foreground p-6 space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            Upload Credential
          </h1>
          <p className="text-muted-foreground mt-1">
            Digitize and verify your documents in minutes.
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setLocation("/app/credentials")}>
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* Progress Stepper */}
      <div className="max-w-3xl mx-auto mb-12">
        <div className="relative flex justify-between">
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -z-10 -translate-y-1/2 rounded-full overflow-hidden">
             <motion.div 
               className="h-full bg-primary"
               initial={{ width: "0%" }}
               animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
               transition={{ duration: 0.5, ease: "easeInOut" }}
             />
          </div>

          {STEPS.map((step) => (
            <div key={step.id} className="flex flex-col items-center gap-2 bg-background px-2">
              <motion.div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 text-sm font-bold transition-colors duration-300",
                  currentStep >= step.id 
                    ? "border-primary bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.5)]" 
                    : "border-muted-foreground/30 text-muted-foreground bg-card"
                )}
                animate={{ scale: currentStep === step.id ? 1.1 : 1 }}
              >
                {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : step.id}
              </motion.div>
              <span className={cn(
                "text-xs font-medium transition-colors duration-300",
                currentStep >= step.id ? "text-primary" : "text-muted-foreground"
              )}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: SELECT TYPE */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CREDENTIAL_TYPES.map((type) => (
                  <div 
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={cn(
                      "group relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 overflow-hidden",
                      selectedType === type.id 
                        ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(var(--primary),0.1)]" 
                        : "border-border/50 hover:border-primary/50 hover:bg-card/50 bg-card/30"
                    )}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={cn(
                        "p-3 rounded-lg transition-colors",
                        selectedType === type.id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground group-hover:bg-primary/20 group-hover:text-primary"
                      )}>
                        <type.icon className="w-6 h-6" />
                      </div>
                      {selectedType === type.id && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <CheckCircle2 className="w-6 h-6 text-primary" />
                        </motion.div>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-lg">{type.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{type.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border/50 pt-4">
                      <span className="flex items-center gap-1">
                        <CreditCard className="w-3 h-3" /> {type.cost}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {type.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> {type.verifiers} Verifiers
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end pt-4">
                <Button 
                  size="lg" 
                  onClick={handleNext} 
                  disabled={!selectedType}
                  className="w-full md:w-auto"
                >
                  Continue <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: UPLOAD DOCUMENT */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <Card className="border-2 border-dashed border-border/60 bg-card/30 backdrop-blur-sm">
                <CardContent 
                  className="flex flex-col items-center justify-center py-16 px-4 text-center cursor-pointer hover:bg-card/50 transition-colors"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                >
                  <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center mb-6 text-primary">
                    {uploadedFile ? <FileCheck className="w-10 h-10" /> : <Upload className="w-10 h-10" />}
                  </div>
                  
                  {uploadedFile ? (
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-primary">{uploadedFile.name}</h3>
                      <p className="text-muted-foreground">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <Button variant="outline" size="sm" onClick={() => setUploadedFile(null)} className="mt-4">
                        Remove File
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold">Drag & Drop your document here</h3>
                      <p className="text-muted-foreground max-w-sm mx-auto">
                        Supports JPG, PNG, PDF (Max 10MB). Ensure the document is clearly visible and not cropped.
                      </p>
                      <div className="flex items-center justify-center gap-4 mt-4">
                        <Button variant="secondary" onClick={() => document.getElementById('file-upload')?.click()}>
                          <ImageIcon className="w-4 h-4 mr-2" /> Browse Files
                        </Button>
                        <Button variant="secondary">
                          <Camera className="w-4 h-4 mr-2" /> Use Camera
                        </Button>
                      </div>
                      <input 
                        id="file-upload" 
                        type="file" 
                        className="hidden" 
                        accept=".jpg,.jpeg,.png,.pdf" 
                        onChange={handleFileUpload}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quality Checklist */}
              <div className="bg-card/30 border border-border/50 rounded-lg p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Scan className="w-4 h-4 text-primary" /> Smart Scan Checklist
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> No glare or shadows
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> All corners visible
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Text is legible
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" size="lg" onClick={handleBack}>
                  Back
                </Button>
                <Button 
                  size="lg" 
                  onClick={handleNext} 
                  disabled={!uploadedFile}
                >
                  Continue <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: AI PRE-SCREENING */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 space-y-8"
            >
              <div className="relative w-48 h-48 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-muted rounded-full opacity-20" />
                <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ scale: [0.8, 1, 0.8], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-4xl font-bold text-primary"
                >
                  {Math.round(scanProgress)}%
                </motion.div>
              </div>
              
              <div className="text-center space-y-2 max-w-md">
                <h3 className="text-2xl font-bold">Analyzing Document</h3>
                <p className="text-muted-foreground">
                  Our AI is verifying document authenticity, extracting data, and checking for security features...
                </p>
              </div>

              <div className="w-full max-w-md space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>OCR Extraction</span>
                  {scanProgress > 30 ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Loader2 className="w-4 h-4 animate-spin" />}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Security Feature Check</span>
                  {scanProgress > 60 ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Loader2 className="w-4 h-4 animate-spin" />}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Fraud Detection</span>
                  {scanProgress > 90 ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Loader2 className="w-4 h-4 animate-spin" />}
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: REVIEW DETAILS */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex gap-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 items-start">
                <ShieldCheck className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Document Passed Pre-Screening</h4>
                  <p className="text-sm opacity-90">Confidence Score: 98% • No fraud markers detected</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Form Fields (Mock OCR Results) */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold border-b border-border/50 pb-2">Extracted Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <Input defaultValue="Alex" />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input defaultValue="Thompson" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Document Number</Label>
                    <Input defaultValue="A123456789" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <Input defaultValue="1990-05-15" />
                    </div>
                    <div className="space-y-2">
                      <Label>Expiry Date</Label>
                      <Input defaultValue="2030-05-14" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Issuing Country</Label>
                    <Input defaultValue="United States" />
                  </div>
                </div>

                {/* Preview & Cost */}
                <div className="space-y-6">
                  <div className="bg-card border border-border rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-muted-foreground mb-4">Document Preview</h3>
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden relative group">
                       {/* Mock Image */}
                       <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10" />
                       <FileText className="w-16 h-16 text-muted-foreground/50" />
                       <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                         Page 1 of 1
                       </div>
                    </div>
                  </div>

                  <Card>
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Verification Fee</span>
                        <span className="font-semibold">$15.00</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Estimated Time</span>
                        <span className="font-semibold">~2 hrs</span>
                      </div>
                      <div className="border-t border-border pt-4">
                        <div className="flex justify-between items-center font-bold text-lg">
                          <span>Total</span>
                          <span className="text-primary">$15.00</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex items-center gap-2 py-4">
                <input 
                  type="checkbox" 
                  id="terms" 
                  className="w-4 h-4 rounded border-gray-300 bg-background text-primary focus:ring-primary cursor-pointer" 
                />
                <Label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                  I certify that this document is authentic and I agree to the <span className="text-primary underline cursor-pointer">Terms of Service</span>.
                </Label>
              </div>

              <div className="flex justify-between pt-4 border-t border-border/50">
                <Button variant="ghost" onClick={() => setCurrentStep(2)}>
                  Edit Upload
                </Button>
                <Button 
                  size="lg" 
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20"
                >
                  Confirm & Submit <CheckCircle2 className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
