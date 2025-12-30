import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  CheckCircle2, 
  CreditCard, 
  FileText, 
  ShieldCheck, 
  User, 
  ChevronRight,
  Building2,
  Clock,
  Star,
  Search,
  Upload,
  Coins
} from "lucide-react";
import { toast } from "sonner";
import { usePaystackPayment } from "react-paystack";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// Mock Data
const CREDENTIALS = [
  { id: "1", title: "University Diploma", type: "Education", date: "May 20, 2023", icon: FileText },
  { id: "2", title: "Driver's License", type: "Identity", date: "Jan 15, 2023", icon: User },
];

const VERIFIERS = [
  { 
    id: 1, 
    name: "Verza Global Verification", 
    type: "Premium", 
    rating: 4.9, 
    price: "50 VZT", 
    priceFiat: 50000, // kobo (500 NGN)
    time: "~24h",
    logo: "https://i.pravatar.cc/150?u=verza"
  },
  { 
    id: 2, 
    name: "FastCheck Inc.", 
    type: "Standard", 
    rating: 4.5, 
    price: "30 VZT", 
    priceFiat: 30000, // kobo (300 NGN)
    time: "~48h",
    logo: "https://i.pravatar.cc/150?u=fast"
  },
];

export default function RequestVerificationPage() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCredential, setSelectedCredential] = useState<string | null>(null);
  const [selectedVerifier, setSelectedVerifier] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("verza_token");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paystackPublicKey, setPaystackPublicKey] = useState("");

  const selectedVerifierData = VERIFIERS.find(v => v.id === selectedVerifier);
  const paystackConfig = {
    reference: (new Date()).getTime().toString(),
    email: "user@example.com",
    amount: selectedVerifierData ? selectedVerifierData.priceFiat : 0,
    publicKey: paystackPublicKey,
    currency: 'NGN',
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  const steps = [
    { id: 1, title: "Select Credential" },
    { id: 2, title: "Choose Verifier" },
    { id: 3, title: "Confirm & Pay" }
  ];

  const handleNext = () => {
    if (currentStep === 1 && !selectedCredential) {
      toast.error("Please select a credential to verify");
      return;
    }
    if (currentStep === 2 && !selectedVerifier) {
      toast.error("Please choose a verifier");
      return;
    }
    
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
    else setLocation("/app/credentials");
  };

  const onPaystackSuccess = (_reference: any) => {
    setIsProcessing(false);
    toast.success("Payment successful! Verification request submitted.");
    setTimeout(() => {
      setLocation("/app/verification-status/new-req-123");
    }, 1500);
  };

  const onPaystackClose = () => {
    setIsProcessing(false);
    toast.info("Payment cancelled");
  };

  const handleSubmit = () => {
    setIsProcessing(true);
    
    if (paymentMethod === 'paystack') {
      if (!paystackPublicKey) {
        setIsProcessing(false);
        toast.error("Payment configuration is unavailable. Please try again.");
        return;
      }
      initializePayment({
        onSuccess: onPaystackSuccess,
        onClose: onPaystackClose,
      });
    } else {
      toast.loading("Processing transaction on Verza Chain...");
      setTimeout(() => {
        setIsProcessing(false);
        toast.dismiss();
        toast.success("Verification request submitted successfully!");
        setLocation("/app/verification-status/new-req-123");
      }, 2000);
    }
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/.netlify/functions/payment-config");
        if (!res.ok) return;
        const data = (await res.json()) as { paystackPublicKey?: unknown };
        const key = typeof data?.paystackPublicKey === "string" ? data.paystackPublicKey : "";
        if (!cancelled) setPaystackPublicKey(key);
      } catch {
        if (!cancelled) setPaystackPublicKey("");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground p-6 pb-20 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8 space-y-4">
        <button onClick={handleBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-3xl font-bold">Request Verification</h1>
        
        {/* Stepper */}
        <div className="flex items-center justify-between mt-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-secondary -z-10 -translate-y-1/2" />
          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            
            return (
              <div key={step.id} className="flex flex-col items-center gap-2 bg-background px-4 z-10">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  isCompleted ? "bg-verza-emerald border-verza-emerald text-white" :
                  isCurrent ? "border-verza-emerald text-verza-emerald shadow-glow" :
                  "border-muted text-muted-foreground bg-secondary"
                )}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : step.id}
                </div>
                <span className={cn(
                  "text-sm font-medium",
                  isCurrent ? "text-foreground" : "text-muted-foreground"
                )}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Select Credential */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Upload New Option */}
                <Card 
                  className="cursor-pointer hover:border-verza-emerald/50 transition-all border-dashed border-2 bg-transparent"
                  onClick={() => setLocation("/app/upload-credential")}
                >
                  <CardContent className="flex flex-col items-center justify-center h-full py-12 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                      <Upload className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Upload New Credential</h3>
                      <p className="text-sm text-muted-foreground">Verify a new document</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Existing Credentials */}
                {CREDENTIALS.map((cred) => (
                  <Card 
                    key={cred.id}
                    className={cn(
                      "cursor-pointer transition-all relative overflow-hidden",
                      selectedCredential === cred.id ? "border-verza-emerald bg-verza-emerald/5 shadow-glow" : "hover:border-primary/50"
                    )}
                    onClick={() => setSelectedCredential(cred.id)}
                  >
                    <CardContent className="flex items-start gap-4 p-6">
                      <div className="p-3 rounded-lg bg-secondary">
                        <cred.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold">{cred.title}</h3>
                        <p className="text-sm text-muted-foreground">{cred.type} • {cred.date}</p>
                      </div>
                      {selectedCredential === cred.id && (
                        <div className="absolute top-4 right-4">
                          <CheckCircle2 className="w-5 h-5 text-verza-emerald" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end pt-6">
                <Button 
                  onClick={handleNext} 
                  disabled={!selectedCredential}
                  className="bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow px-8"
                >
                  Next Step <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Choose Verifier */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search verifiers..." className="pl-9" />
                </div>
                <Button variant="outline">Filter</Button>
              </div>

              <div className="space-y-4">
                {VERIFIERS.map((verifier) => (
                  <Card 
                    key={verifier.id}
                    className={cn(
                      "cursor-pointer transition-all",
                      selectedVerifier === verifier.id ? "border-verza-emerald bg-verza-emerald/5 shadow-glow" : "hover:border-primary/50"
                    )}
                    onClick={() => setSelectedVerifier(verifier.id)}
                  >
                    <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                      <Avatar className="w-16 h-16 border-2 border-background">
                        <AvatarImage src={verifier.logo} />
                        <AvatarFallback>{verifier.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 text-center md:text-left space-y-2">
                        <div className="flex items-center justify-center md:justify-start gap-2">
                          <h3 className="font-bold text-lg">{verifier.name}</h3>
                          {verifier.type === "Premium" && (
                            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                              Premium
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1 text-amber-400">
                            <Star className="w-4 h-4 fill-current" /> {verifier.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" /> {verifier.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Building2 className="w-4 h-4" /> 1k+ Verified
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-2xl font-bold block">{verifier.price}</span>
                        <span className="text-xs text-muted-foreground">Fixed Rate</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-between pt-6">
                <Button variant="ghost" onClick={handleBack}>Back</Button>
                <Button 
                  onClick={handleNext} 
                  disabled={!selectedVerifier}
                  className="bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow px-8"
                >
                  Next Step <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Confirm & Pay */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-start gap-4 pb-6 border-b border-border/50">
                      <div className="p-3 rounded-lg bg-secondary">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Credential</p>
                        <h4 className="font-semibold">University Diploma</h4>
                        <p className="text-xs text-muted-foreground">ID: 829102</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 pb-6 border-b border-border/50">
                      <Avatar>
                        <AvatarImage src="https://i.pravatar.cc/150?u=verza" />
                        <AvatarFallback>VG</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm text-muted-foreground">Verifier</p>
                        <h4 className="font-semibold">Verza Global Verification</h4>
                        <p className="text-xs text-muted-foreground">Premium Service • ~24h Turnaround</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Verification Fee</span>
                        <span>
                          {paymentMethod === 'paystack' 
                            ? `₦${(VERIFIERS.find(v => v.id === selectedVerifier)?.priceFiat! / 100).toLocaleString()}.00` 
                            : VERIFIERS.find(v => v.id === selectedVerifier)?.price
                          }
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Platform Fee (2%)</span>
                        <span>
                          {paymentMethod === 'paystack' 
                            ? `₦${((VERIFIERS.find(v => v.id === selectedVerifier)?.priceFiat! * 0.02) / 100).toLocaleString()}.00` 
                            : '1.00 VZT'
                          }
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Network Fee (Est.)</span>
                        <span>
                           {paymentMethod === 'paystack' ? '₦0.00' : '0.17 VZT'}
                        </span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>
                          {paymentMethod === 'paystack' 
                            ? `₦${((VERIFIERS.find(v => v.id === selectedVerifier)?.priceFiat! * 1.02) / 100).toLocaleString()}` 
                            : `${(parseFloat(VERIFIERS.find(v => v.id === selectedVerifier)?.price.split(' ')[0]!) + 1.17).toFixed(2)} VZT`
                          }
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className={`flex items-center space-x-2 border p-3 rounded-lg transition-all cursor-pointer ${paymentMethod === 'verza_token' ? 'border-verza-emerald bg-verza-emerald/5' : 'hover:bg-secondary/20'}`}>
                        <RadioGroupItem value="verza_token" id="verza_token" />
                        <Label htmlFor="verza_token" className="flex-1 cursor-pointer flex items-center gap-3">
                          <div className="p-2 bg-verza-emerald/10 rounded">
                            <Coins className="w-4 h-4 text-verza-emerald" />
                          </div>
                          <div>
                            <span className="block font-medium">Verza Token (Crypto)</span>
                            <span className="text-xs text-muted-foreground">Pay with VZT wallet balance</span>
                          </div>
                        </Label>
                      </div>
                      <div className={`flex items-center space-x-2 border p-3 rounded-lg transition-all cursor-pointer ${paymentMethod === 'paystack' ? 'border-blue-500 bg-blue-500/5' : 'hover:bg-secondary/20'}`}>
                        <RadioGroupItem value="paystack" id="paystack" />
                        <Label htmlFor="paystack" className="flex-1 cursor-pointer flex items-center gap-3">
                          <div className="p-2 bg-blue-500/10 rounded">
                            <CreditCard className="w-4 h-4 text-blue-500" />
                          </div>
                          <div>
                            <span className="block font-medium">Paystack (Fiat)</span>
                            <span className="text-xs text-muted-foreground">Card, Bank Transfer, USSD</span>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>

                    <div className="text-xs text-muted-foreground bg-secondary/30 p-3 rounded-lg">
                      <ShieldCheck className="w-3 h-3 inline mr-1 mb-0.5" />
                      Payments are secured. {paymentMethod === 'verza_token' ? 'Funds held in smart contract escrow.' : 'Processed securely via Paystack.'}
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col gap-3">
                    <Button 
                      className="w-full bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow py-6 text-lg"
                      onClick={handleSubmit}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>Processing...</>
                      ) : (
                        <>
                          Confirm & Pay {
                            paymentMethod === 'paystack'
                            ? `₦${((VERIFIERS.find(v => v.id === selectedVerifier)?.priceFiat! * 1.02) / 100).toLocaleString()}`
                            : `${(parseFloat(VERIFIERS.find(v => v.id === selectedVerifier)?.price.split(' ')[0]!) + 1.17).toFixed(2)} VZT`
                          }
                        </>
                      )}
                    </Button>
                    <Button variant="ghost" onClick={handleBack} className="w-full">
                      Back
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
