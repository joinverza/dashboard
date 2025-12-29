import { useLocation, useSearch } from "wouter";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  XCircle,
  Download,
  Share2,
  RotateCw
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function TransactionStatusPage() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  
  const status = params.get("status") || "success"; // success | failed
  const type = params.get("type") || "payment"; // payment | verification | withdrawal | deposit
  const amount = params.get("amount") || "50.00";
  const asset = params.get("asset") || "ADA";
  const txHash = params.get("txHash") || "0x892...1290";

  const isSuccess = status === "success";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 animate-in fade-in duration-500 relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[100px] opacity-20",
          isSuccess ? "bg-verza-emerald" : "bg-red-500"
        )} />
      </div>

      <Card className="w-full max-w-md border-border/50 bg-card/30 backdrop-blur-xl shadow-2xl relative z-10">
        <CardContent className="pt-12 pb-8 px-8 text-center space-y-6">
          
          {/* Icon Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15 }}
            className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6",
              isSuccess ? "bg-green-500/10 text-verza-emerald" : "bg-red-500/10 text-red-500"
            )}
          >
            {isSuccess ? (
              <CheckCircle2 className="w-12 h-12" />
            ) : (
              <XCircle className="w-12 h-12" />
            )}
          </motion.div>

          {/* Text Content */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">
              {isSuccess 
                ? (type === "payment" ? "Payment Successful!" : "Transaction Complete") 
                : "Transaction Failed"}
            </h1>
            <p className="text-muted-foreground">
              {isSuccess 
                ? "Your transaction has been processed successfully." 
                : "We couldn't process your transaction. Please try again."}
            </p>
          </div>

          {/* Details Card */}
          <div className="bg-secondary/30 rounded-xl p-4 space-y-3 text-sm border border-border/50">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-bold text-lg">{amount} {asset}</span>
            </div>
            <Separator className="bg-border/50" />
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Type</span>
              <span className="capitalize">{type}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Date</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            {isSuccess && (
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-mono text-xs">{txHash}</span>
              </div>
            )}
            {!isSuccess && (
              <div className="flex justify-between items-center text-red-400">
                <span className="text-muted-foreground">Error Code</span>
                <span>ERR_NETWORK_TIMEOUT</span>
              </div>
            )}
          </div>

        </CardContent>
        <CardFooter className="flex-col gap-3 pb-8 px-8">
          {isSuccess ? (
            <>
              <Button className="w-full bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow" onClick={() => setLocation("/app")}>
                Return to Dashboard
              </Button>
              <div className="grid grid-cols-2 gap-3 w-full">
                <Button variant="outline" className="w-full gap-2" onClick={() => toast.success("Receipt downloaded")}>
                  <Download className="w-4 h-4" /> Receipt
                </Button>
                <Button variant="outline" className="w-full gap-2" onClick={() => toast.success("Receipt shared")}>
                  <Share2 className="w-4 h-4" /> Share
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button className="w-full" variant="destructive" onClick={() => window.history.back()}>
                <RotateCw className="w-4 h-4 mr-2" /> Try Again
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setLocation("/app/help")}>
                Contact Support
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
