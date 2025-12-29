import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Copy, 
  CreditCard, 
  Wallet,
  QrCode,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { usePaystackPayment } from "react-paystack";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ASSETS = [
  { id: "verza", name: "Verza Token", ticker: "VZT", icon: "https://verza.io/favicon.ico" },
  { id: "ada", name: "Cardano", ticker: "ADA", icon: "https://cryptologos.cc/logos/cardano-ada-logo.png" },
  { id: "usdm", name: "Mehen USD", ticker: "USDM", icon: "https://mehen.io/favicon.ico" },
];

export default function DepositPage() {
  const [, setLocation] = useLocation();
  const [selectedAsset, setSelectedAsset] = useState("verza");
  const [depositStatus, setDepositStatus] = useState<"idle" | "pending" | "success">("idle");
  const [amount, setAmount] = useState<string>("");
  
  const currentAsset = ASSETS.find(a => a.id === selectedAsset) || ASSETS[0];

  // Paystack Config
  const paystackConfig = {
    reference: (new Date()).getTime().toString(),
    email: "user@example.com",
    amount: amount ? parseInt(amount) * 100 : 0, // Amount in kobo
    publicKey: 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    currency: 'NGN',
  };

  const initializePayment = usePaystackPayment(paystackConfig);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText("addr1q9...8291");
    toast.success("Wallet address copied to clipboard");
  };

  const onPaystackSuccess = (_reference: any) => {
    setDepositStatus("success");
    toast.success("Deposit successful!");
  };

  const onPaystackClose = () => {
    setDepositStatus("idle");
    toast.info("Transaction cancelled");
  };

  const handleFiatDeposit = () => {
    if (!amount || parseInt(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    setDepositStatus("pending");
    // Simulate short delay before Paystack opens or just open it
    initializePayment({
      onSuccess: onPaystackSuccess,
      onClose: onPaystackClose,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 pb-20 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-8 space-y-4">
        <button onClick={() => setLocation("/app/wallet")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Wallet
        </button>
        <div>
          <h1 className="text-3xl font-bold">Deposit Assets</h1>
          <p className="text-muted-foreground mt-1">Add funds to your Verza wallet.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {depositStatus === "idle" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Asset Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Select Asset</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                    <SelectTrigger className="w-full h-14">
                      <SelectValue placeholder="Select asset" />
                    </SelectTrigger>
                    <SelectContent>
                      {ASSETS.map(asset => (
                        <SelectItem key={asset.id} value={asset.id} className="cursor-pointer">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center overflow-hidden">
                              <img src={asset.icon} alt={asset.ticker} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.src = "")} />
                              {!asset.icon && <span className="text-xs font-bold">{asset.ticker[0]}</span>}
                            </div>
                            <div className="text-left">
                              <span className="block font-medium">{asset.name}</span>
                              <span className="text-xs text-muted-foreground">{asset.ticker}</span>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Deposit Methods */}
              <Tabs defaultValue="fiat" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-12">
                  <TabsTrigger value="fiat" className="gap-2">
                    <CreditCard className="w-4 h-4" /> Buy with Fiat
                  </TabsTrigger>
                  <TabsTrigger value="crypto" className="gap-2">
                    <Wallet className="w-4 h-4" /> Crypto Transfer
                  </TabsTrigger>
                </TabsList>

                {/* Fiat/Paystack Tab */}
                <TabsContent value="fiat">
                  <Card>
                    <CardHeader>
                      <CardTitle>Buy {currentAsset.ticker}</CardTitle>
                      <CardDescription>Purchase {currentAsset.ticker} directly with Bank Card or Transfer via Paystack.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label>Amount (NGN)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
                          <Input 
                            type="number" 
                            placeholder="5000" 
                            className="pl-8" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="p-4 bg-secondary/30 rounded-lg flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">You will receive approx.</span>
                        <span className="font-bold text-lg">
                          {amount ? (parseInt(amount) / 1000).toFixed(2) : '0.00'} {currentAsset.ticker}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-600 dark:text-blue-400">
                        <CreditCard className="w-5 h-5 shrink-0" />
                        <p>Secured by Paystack. Supports Cards, Bank Transfer, and USSD.</p>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Includes 1.5% + ₦100 processing fee.
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow" onClick={handleFiatDeposit}>
                        Proceed to Pay ₦{amount ? parseInt(amount).toLocaleString() : '0.00'}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* Crypto Wallet Tab */}
                <TabsContent value="crypto">
                  <Card>
                    <CardHeader>
                      <CardTitle>Deposit {currentAsset.ticker}</CardTitle>
                      <CardDescription>Send {currentAsset.name} to your wallet address.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl w-fit mx-auto border-4 border-white">
                        <QrCode className="w-48 h-48 text-black" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Wallet Address</Label>
                        <div className="flex gap-2">
                          <Input readOnly value="addr1q9...8291" className="font-mono text-sm bg-secondary/50" />
                          <Button variant="outline" size="icon" onClick={handleCopyAddress}>
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-yellow-500">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p>Only send {currentAsset.ticker} to this address. Sending any other asset may result in permanent loss.</p>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-border/50">
                        <h4 className="font-medium text-sm">Recent Deposits</h4>
                        <div className="text-center py-8 text-muted-foreground text-sm">
                          No recent deposits found.
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}

          {depositStatus === "pending" && (
            <motion.div
              key="pending"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center justify-center py-20 text-center space-y-6"
            >
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-secondary animate-spin border-t-verza-emerald" />
                <CreditCard className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Processing Payment</h2>
                <p className="text-muted-foreground mt-2">Please verify the transaction in your banking app...</p>
              </div>
            </motion.div>
          )}

          {depositStatus === "success" && (
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
                <h2 className="text-2xl font-bold">Deposit Successful!</h2>
                <p className="text-muted-foreground mt-2">Your assets have been added to your wallet.</p>
              </div>
              <Card className="w-full max-w-sm bg-secondary/20 border-border/50">
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-medium">150.00 {currentAsset.ticker}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Transaction ID</span>
                    <span className="font-mono text-xs">0x82...91a2</span>
                  </div>
                </CardContent>
              </Card>
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setDepositStatus("idle")}>Make Another Deposit</Button>
                <Button className="bg-verza-emerald hover:bg-verza-emerald/90 text-white" onClick={() => setLocation("/app/wallet")}>
                  Go to Wallet
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
