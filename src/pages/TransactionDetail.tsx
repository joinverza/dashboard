import { useLocation, useRoute } from "wouter";
import { 
  ArrowLeft, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Copy, 
  Share2, 
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Mock Data (would be fetched by ID)
const TRANSACTION = {
  id: "0x89210293849201923849021384091238409123",
  type: "sent", // sent, received, verification
  amount: 50.00,
  asset: "ADA",
  fiatValue: 17.50,
  status: "confirmed", // confirmed, pending, failed
  timestamp: "Oct 24, 2023, 10:30 AM",
  from: "addr1q9...8291", // My wallet
  to: "addr1x8...9201", // Recipient
  fee: 0.17,
  block: 9281029,
  confirmations: 124,
  description: "Verification Fee Payment"
};

export default function TransactionDetailPage() {
  const [, setLocation] = useLocation();
  useRoute("/app/wallet/transactions/:id");
  
  // In a real app, use the ID to fetch transaction details
  // const id = params?.id;

  // Mock logic to determine display based on type
  const isSent = TRANSACTION.type === "sent";
  // const isReceived = TRANSACTION.type === "received";
  const colorClass = isSent ? "text-foreground" : "text-verza-emerald";
  const icon = isSent ? <ArrowUpRight className="w-6 h-6" /> : <ArrowDownLeft className="w-6 h-6" />;
  const sign = isSent ? "-" : "+";

  return (
    <div className="min-h-screen bg-background text-foreground p-6 pb-20 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-6">
        <button onClick={() => setLocation("/app/wallet")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Wallet
        </button>
      </div>

      <Card className="max-w-2xl mx-auto border-border/50 bg-card/30 backdrop-blur-md">
        <CardContent className="p-8 space-y-8">
          
          {/* Main Status & Amount */}
          <div className="text-center space-y-4">
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4",
              isSent ? "bg-secondary text-foreground" : "bg-verza-emerald/10 text-verza-emerald"
            )}>
              {icon}
            </div>
            
            <div className="space-y-1">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {isSent ? "Sent ADA" : "Received ADA"}
              </h2>
              <div className={cn("text-4xl font-bold flex items-center justify-center gap-1", colorClass)}>
                <span>{sign}{TRANSACTION.amount.toFixed(2)}</span>
                <span className="text-2xl text-muted-foreground">{TRANSACTION.asset}</span>
              </div>
              <p className="text-sm text-muted-foreground">≈ ${TRANSACTION.fiatValue.toFixed(2)} USD</p>
            </div>

            <Badge variant="outline" className={cn(
              "px-3 py-1",
              TRANSACTION.status === "confirmed" ? "bg-green-500/10 text-green-500 border-green-500/20" :
              TRANSACTION.status === "pending" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
              "bg-red-500/10 text-red-500 border-red-500/20"
            )}>
              {TRANSACTION.status === "confirmed" && <CheckCircle2 className="w-3 h-3 mr-1" />}
              {TRANSACTION.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
              {TRANSACTION.status === "failed" && <AlertCircle className="w-3 h-3 mr-1" />}
              {TRANSACTION.status.charAt(0).toUpperCase() + TRANSACTION.status.slice(1)}
            </Badge>
          </div>

          <Separator />

          {/* Details Grid */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Transaction Details</h3>
            
            <div className="grid gap-4 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-muted-foreground">Date & Time</span>
                <span>{TRANSACTION.timestamp}</span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-muted-foreground">From</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs">{TRANSACTION.from}</span>
                  <Copy className="w-3 h-3 text-muted-foreground cursor-pointer hover:text-foreground" />
                </div>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-muted-foreground">To</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs">{TRANSACTION.to}</span>
                  <Copy className="w-3 h-3 text-muted-foreground cursor-pointer hover:text-foreground" />
                </div>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-muted-foreground">Network Fee</span>
                <span>{TRANSACTION.fee} {TRANSACTION.asset}</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-muted-foreground">Transaction Hash</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs truncate max-w-[150px]">{TRANSACTION.id}</span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground cursor-pointer hover:text-foreground" />
                </div>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Block</span>
                <span className="font-mono">{TRANSACTION.block}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-4">
            <Button className="w-full bg-secondary hover:bg-secondary/80 text-foreground gap-2">
              <ExternalLink className="w-4 h-4" /> View on Explorer
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="gap-2">
                <Share2 className="w-4 h-4" /> Share
              </Button>
              <Button variant="outline" className="gap-2">
                <Copy className="w-4 h-4" /> Copy ID
              </Button>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
