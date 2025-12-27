import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  CreditCard, 
  Wallet, 
  AlertTriangle,
  FileText,
  Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Mock Data
const PAYMENT_DETAILS = {
  id: "TX-9928-1102",
  amount: 50.00,
  currency: "ADA",
  service: "University Degree Verification",
  recipient: "Verza Global Verification",
  fee: 0.17,
  credentialId: "EDU-2023-8921"
};

export default function PaymentConfirmationPage() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "failed">("idle");
  const [paymentMethod, setPaymentMethod] = useState("wallet");

  const handleConfirm = () => {
    setStatus("processing");
    // Simulate payment processing
    setTimeout(() => {
      setStatus("success");
    }, 3000);
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="border-verza-emerald/20 bg-card/50 backdrop-blur-xl">
            <CardContent className="pt-10 pb-8 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-verza-emerald/10 text-verza-emerald mx-auto flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Payment Successful!</h2>
                <p className="text-muted-foreground">
                  Your payment of <span className="text-foreground font-medium">{PAYMENT_DETAILS.amount} {PAYMENT_DETAILS.currency}</span> has been processed.
                </p>
              </div>

              <div className="bg-secondary/30 rounded-xl p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono flex items-center gap-1">
                    {PAYMENT_DETAILS.id}
                    <Copy className="w-3 h-3 cursor-pointer hover:text-primary" />
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-verza-emerald font-medium">Completed</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full" onClick={() => setLocation("/app/wallet/transactions/1")}>
                  Receipt
                </Button>
                <Button className="w-full bg-verza-emerald text-white hover:bg-verza-emerald/90" onClick={() => setLocation("/app/verification-status/1")}>
                  Track Status
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-verza-emerald/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Order Summary */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Confirm Payment</h1>
            <p className="text-muted-foreground mt-2">
              Review your order details and select a payment method to proceed.
            </p>
          </div>

          <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4 p-3 rounded-lg bg-secondary/30 border border-border/50">
                <div className="p-2 rounded bg-background text-primary">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-medium">{PAYMENT_DETAILS.service}</h4>
                  <p className="text-sm text-muted-foreground">ID: {PAYMENT_DETAILS.credentialId}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{PAYMENT_DETAILS.amount.toFixed(2)} {PAYMENT_DETAILS.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Network Fee</span>
                  <span>{PAYMENT_DETAILS.fee.toFixed(2)} {PAYMENT_DETAILS.currency}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border/50 text-base font-bold">
                  <span>Total</span>
                  <span>{(PAYMENT_DETAILS.amount + PAYMENT_DETAILS.fee).toFixed(2)} {PAYMENT_DETAILS.currency}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <p>Payments are secured by smart contracts and are non-refundable once processed.</p>
          </div>
        </div>

        {/* Payment Method */}
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm h-full">
          <CardHeader>
            <CardTitle className="text-lg">Payment Method</CardTitle>
            <CardDescription>Select how you want to pay</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid gap-4">
              <div>
                <RadioGroupItem value="wallet" id="wallet" className="peer sr-only" />
                <Label
                  htmlFor="wallet"
                  className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                >
                  <div className="flex w-full items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-5 h-5" />
                      <span className="font-semibold">Connected Wallet</span>
                    </div>
                    {paymentMethod === "wallet" && <CheckCircle2 className="w-4 h-4 text-primary" />}
                  </div>
                  <div className="w-full text-sm text-muted-foreground flex justify-between">
                    <span>Nami Wallet</span>
                    <span>1,240.50 ADA</span>
                  </div>
                </Label>
              </div>

              <div>
                <RadioGroupItem value="card" id="card" className="peer sr-only" />
                <Label
                  htmlFor="card"
                  className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                >
                  <div className="flex w-full items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      <span className="font-semibold">Credit Card</span>
                    </div>
                    {paymentMethod === "card" && <CheckCircle2 className="w-4 h-4 text-primary" />}
                  </div>
                  <div className="w-full text-sm text-muted-foreground">
                    Visa, Mastercard, Amex
                  </div>
                </Label>
              </div>
            </RadioGroup>

            {status === "processing" ? (
              <div className="py-8 text-center space-y-4">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-secondary border-t-primary animate-spin" />
                  <div className="absolute inset-2 rounded-full border-4 border-secondary border-b-primary animate-spin-slow opacity-50" />
                </div>
                <div>
                  <h3 className="font-semibold">Processing Payment</h3>
                  <p className="text-sm text-muted-foreground">Please confirm the transaction in your wallet...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Wallet Address</span>
                  <span className="font-mono text-xs bg-secondary/50 px-2 py-1 rounded">addr1...8291</span>
                </div>
                <Button 
                  className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all"
                  onClick={handleConfirm}
                >
                  Pay {PAYMENT_DETAILS.amount.toFixed(2)} {PAYMENT_DETAILS.currency}
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => setLocation("/app/credentials")}>
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
