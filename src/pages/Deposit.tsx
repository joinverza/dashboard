import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Copy, 
  CreditCard, 
  Landmark, 
  Wallet,
  QrCode,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ASSETS = [
  { id: "ada", name: "Cardano", ticker: "ADA", icon: "https://cryptologos.cc/logos/cardano-ada-logo.png" },
  { id: "usdm", name: "Mehen USD", ticker: "USDM", icon: "https://mehen.io/favicon.ico" }, // Placeholder icon
  { id: "verza", name: "Verza Token", ticker: "VERZA", icon: "https://verza.io/favicon.ico" } // Placeholder
];

export default function DepositPage() {
  const [, setLocation] = useLocation();
  const [selectedAsset, setSelectedAsset] = useState("ada");
  const [depositStatus, setDepositStatus] = useState<"idle" | "pending" | "success">("idle");

  const currentAsset = ASSETS.find(a => a.id === selectedAsset) || ASSETS[0];

  const handleCopyAddress = () => {
    navigator.clipboard.writeText("addr1q9...8291");
    // Show toast here (mocked)
  };

  const handleCardDeposit = () => {
    setDepositStatus("pending");
    setTimeout(() => setDepositStatus("success"), 2000);
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
              <Tabs defaultValue="crypto" className="w-full">
                <TabsList className="grid w-full grid-cols-3 h-12">
                  <TabsTrigger value="crypto" className="gap-2">
                    <Wallet className="w-4 h-4" /> Crypto Transfer
                  </TabsTrigger>
                  <TabsTrigger value="card" className="gap-2">
                    <CreditCard className="w-4 h-4" /> Credit Card
                  </TabsTrigger>
                  <TabsTrigger value="bank" className="gap-2">
                    <Landmark className="w-4 h-4" /> Bank Transfer
                  </TabsTrigger>
                </TabsList>

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

                {/* Credit Card Tab */}
                <TabsContent value="card">
                  <Card>
                    <CardHeader>
                      <CardTitle>Buy {currentAsset.ticker}</CardTitle>
                      <CardDescription>Purchase crypto directly with your card.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label>Amount (USD)</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                          <Input type="number" placeholder="0.00" className="pl-8" />
                        </div>
                      </div>

                      <div className="p-4 bg-secondary/30 rounded-lg flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">You will receive approx.</span>
                        <span className="font-bold text-lg">0.00 {currentAsset.ticker}</span>
                      </div>

                      <div className="space-y-4">
                         <div className="space-y-2">
                           <Label>Card Details</Label>
                           <Input placeholder="0000 0000 0000 0000" />
                           <div className="grid grid-cols-2 gap-4">
                             <Input placeholder="MM/YY" />
                             <Input placeholder="CVC" />
                           </div>
                         </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Includes 2.5% processing fee.
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow" onClick={handleCardDeposit}>
                        Buy Now
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                {/* Bank Transfer Tab */}
                <TabsContent value="bank">
                   <Card>
                     <CardContent className="py-10 text-center space-y-4">
                       <Landmark className="w-12 h-12 mx-auto text-muted-foreground" />
                       <h3 className="font-semibold text-lg">Coming Soon</h3>
                       <p className="text-muted-foreground max-w-xs mx-auto">
                         Bank transfers are not yet available in your region. Please use Crypto Transfer or Credit Card.
                       </p>
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
