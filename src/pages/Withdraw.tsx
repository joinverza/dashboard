import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft,
  Scan,
  Users,
  AlertTriangle,
  Wallet,
  CheckCircle2,
  ArrowRight,
  History as HistoryIcon
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

const ASSETS = [
  { id: "ada", name: "Cardano", ticker: "ADA", balance: 1240.50, price: 0.35 },
  { id: "usdm", name: "Mehen USD", ticker: "USDM", balance: 500.00, price: 1.00 },
  { id: "verza", name: "Verza Token", ticker: "VERZA", balance: 5000.00, price: 0.05 }
];

const RECENT_RECIPIENTS = [
  { id: 1, name: "Alice's Wallet", address: "addr1q9...8291" },
  { id: 2, name: "Binance Exchange", address: "addr1x8...9201" },
];

export default function WithdrawPage() {
  const [, setLocation] = useLocation();
  const [selectedAsset, setSelectedAsset] = useState("ada");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [withdrawStatus, setWithdrawStatus] = useState<"idle" | "pending" | "success" | "failed">("idle");
  const [authCode, setAuthCode] = useState("");

  const currentAsset = ASSETS.find(a => a.id === selectedAsset) || ASSETS[0];
  const networkFee = 0.17; // Fixed mock fee

  const handleMaxAmount = () => {
    setAmount((currentAsset.balance - networkFee).toFixed(2));
  };

  const handleReview = () => {
    if (!address || !amount) return;
    setIsReviewOpen(true);
  };

  const handleConfirmWithdraw = () => {
    setIsReviewOpen(false);
    setWithdrawStatus("pending");
    
    // Simulate processing
    setTimeout(() => {
      setWithdrawStatus("success");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 pb-20 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8 space-y-4">
        <button onClick={() => setLocation("/app/wallet")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Wallet
        </button>
        <div>
          <h1 className="text-3xl font-bold">Withdraw Assets</h1>
          <p className="text-muted-foreground mt-1">Send funds to an external wallet or exchange.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {withdrawStatus === "idle" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Asset Selection */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
                    <div className="space-y-1">
                       <Label>Select Asset</Label>
                       <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                         <SelectTrigger className="w-[200px]">
                           <SelectValue placeholder="Select asset" />
                         </SelectTrigger>
                         <SelectContent>
                           {ASSETS.map(asset => (
                             <SelectItem key={asset.id} value={asset.id}>
                               {asset.name} ({asset.ticker})
                             </SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-muted-foreground block">Available Balance</span>
                      <span className="text-xl font-bold font-mono">
                        {currentAsset.balance.toLocaleString()} {currentAsset.ticker}
                      </span>
                      <span className="text-xs text-muted-foreground block">
                        ≈ ${(currentAsset.balance * currentAsset.price).toLocaleString()} USD
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recipient & Amount */}
              <Card>
                <CardHeader>
                  <CardTitle>Transaction Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {/* Recipient Address */}
                  <div className="space-y-2">
                    <Label>Recipient Address</Label>
                    <div className="relative">
                      <Input 
                        placeholder="addr1..." 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="pr-24 font-mono"
                      />
                      <div className="absolute right-1 top-1 flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Scan QR">
                          <Scan className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Address Book">
                          <Users className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {address && !address.startsWith("addr1") && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Invalid Cardano address format
                      </p>
                    )}
                  </div>

                  {/* Recent Recipients */}
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {RECENT_RECIPIENTS.map(recipient => (
                      <button 
                        key={recipient.id}
                        onClick={() => setAddress(recipient.address)}
                        className="flex items-center gap-2 px-3 py-2 rounded-full bg-secondary/50 hover:bg-secondary text-xs transition-colors whitespace-nowrap"
                      >
                        <HistoryIcon className="w-3 h-3 text-muted-foreground" />
                        <span>{recipient.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Amount */}
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <div className="relative">
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pr-16"
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="absolute right-1 top-1 h-8 text-xs font-bold text-verza-emerald hover:text-verza-emerald/80"
                        onClick={handleMaxAmount}
                      >
                        MAX
                      </Button>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="p-4 bg-secondary/20 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Network Fee</span>
                      <span>{networkFee} {currentAsset.ticker}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total Deduction</span>
                      <span>{(parseFloat(amount || "0") + networkFee).toFixed(2)} {currentAsset.ticker}</span>
                    </div>
                  </div>

                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow" 
                    onClick={handleReview}
                    disabled={!address || !amount || parseFloat(amount) <= 0}
                  >
                    Review Withdrawal
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {withdrawStatus === "pending" && (
            <motion.div
              key="pending"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center justify-center py-20 text-center space-y-6"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-secondary animate-spin border-t-verza-emerald" />
                <Wallet className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Broadcasting Transaction</h2>
                <p className="text-muted-foreground mt-2">Sending funds to the blockchain...</p>
              </div>
            </motion.div>
          )}

          {withdrawStatus === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center space-y-6"
            >
              <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-2">
                <CheckCircle2 className="w-10 h-10 text-verza-emerald" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Withdrawal Sent!</h2>
                <p className="text-muted-foreground mt-2">Your funds are on their way.</p>
              </div>
              <Card className="w-full max-w-sm bg-secondary/20 border-border/50">
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount Sent</span>
                    <span className="font-medium">{amount} {currentAsset.ticker}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Recipient</span>
                    <span className="font-mono text-xs truncate max-w-[150px]">{address}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Transaction Hash</span>
                    <span className="font-mono text-xs text-blue-400 cursor-pointer hover:underline">0x82...91a2</span>
                  </div>
                </CardContent>
              </Card>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => {
                  setWithdrawStatus("idle");
                  setAmount("");
                  setAddress("");
                }}>Send Another</Button>
                <Button className="bg-verza-emerald hover:bg-verza-emerald/90 text-white" onClick={() => setLocation("/app/wallet")}>
                  Return to Wallet
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Review Dialog */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Withdrawal</DialogTitle>
            <DialogDescription>
              Please review the transaction details carefully. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center justify-center p-4 bg-secondary/20 rounded-lg">
               <span className="text-sm text-muted-foreground">You are sending</span>
               <span className="text-2xl font-bold mt-1">{amount} {currentAsset.ticker}</span>
               <ArrowRight className="w-4 h-4 text-muted-foreground my-2 rotate-90" />
               <span className="text-xs font-mono bg-background px-2 py-1 rounded border">{address}</span>
            </div>

            <div className="space-y-2">
              <Label>Security Verification (2FA)</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter 6-digit code" 
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  className="text-center tracking-widest"
                  maxLength={6}
                />
              </div>
              <p className="text-xs text-muted-foreground">Enter the code from your authenticator app.</p>
            </div>
          </div>

          <DialogFooter>
             <Button variant="outline" onClick={() => setIsReviewOpen(false)}>Cancel</Button>
             <Button 
               className="bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow"
               onClick={handleConfirmWithdraw}
               disabled={authCode.length < 6}
             >
               Confirm & Send
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
