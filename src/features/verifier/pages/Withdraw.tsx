import { motion } from "framer-motion";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Wallet, History, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { bankingService, getBankingErrorMessage } from "@/services/bankingService";

export default function VerifierWithdraw() {
  const queryClient = useQueryClient();
  const [destinationId, setDestinationId] = useState("");
  const [amount, setAmount] = useState("");
  const [earningsQuery, withdrawalsQuery] = useQueries({
    queries: [
      { queryKey: ["verifier", "earnings"], queryFn: () => bankingService.getVerifierEarningsSummary("30d") },
      { queryKey: ["verifier", "withdrawals"], queryFn: () => bankingService.listVerifierWithdrawals({ page: 1, limit: 20 }) },
    ],
  });

  const createMutation = useMutation({
    mutationFn: () => bankingService.createVerifierWithdrawal({ amount: Number(amount), currency: earningsQuery.data?.currency ?? "USD", destinationId }),
    onSuccess: async () => {
      toast.success("Withdrawal request created.");
      setAmount("");
      await queryClient.invalidateQueries({ queryKey: ["verifier", "withdrawals"] });
    },
    onError: (error) => toast.error(getBankingErrorMessage(error, "Failed to create withdrawal")),
  });

  const available = earningsQuery.data?.availableBalance ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-10"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Withdraw Earnings</h1>
        <p className="text-muted-foreground">Transfer your earnings to your personal wallet.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Withdrawal Request</CardTitle>
            <CardDescription>Enter the details for your withdrawal.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-muted/20 rounded-lg border border-border/50 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <h2 className="text-2xl font-bold text-verza-emerald">${available.toFixed(2)}</h2>
              </div>
              <Wallet className="h-8 w-8 text-muted-foreground/50" />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Wallet Address</Label>
                <Input id="address" placeholder="Destination account / wallet id" value={destinationId} onChange={(e) => setDestinationId(e.target.value)} />
                <p className="text-xs text-muted-foreground">
                  Verify this address carefully. Transactions cannot be reversed.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                  <Input id="amount" type="number" placeholder="0.00" className="pl-7" value={amount} onChange={(e) => setAmount(e.target.value)} />
                  <Button variant="ghost" size="sm" className="absolute right-1 top-1 h-7 text-xs text-verza-emerald" onClick={() => setAmount(String(available))}>
                    MAX
                  </Button>
                </div>
              </div>

              <div className="pt-4 border-t border-border/50 space-y-2">
                 <div className="flex justify-between text-sm">
                   <span className="text-muted-foreground">Network Fee (Est.)</span>
                   <span>$0.45</span>
                 </div>
                 <div className="flex justify-between font-medium pt-2">
                   <span>Total to Receive</span>
                   <span>${Math.max(0, Number(amount || 0) - 0.45).toFixed(2)}</span>
                 </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow" onClick={() => createMutation.mutate()} disabled={createMutation.isPending || !destinationId || Number(amount) <= 0}>
              Confirm Withdrawal <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card className="bg-amber-500/10 border-amber-500/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-500 mb-1">Important</p>
                  <p className="text-amber-500/80 mb-2">
                    • Minimum withdrawal amount is $50.00.
                  </p>
                  <p className="text-amber-500/80 mb-2">
                    • Processing time is usually instant but can take up to 24 hours.
                  </p>
                  <p className="text-amber-500/80">
                    • Ensure your wallet supports Cardano native assets.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-4 w-4" /> Recent Withdrawals
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawalsQuery.isLoading ? (
                    <TableRow><TableCell colSpan={3} className="text-center py-8"><Loader2 className="h-5 w-5 animate-spin inline" /></TableCell></TableRow>
                  ) : (withdrawalsQuery.data?.items ?? []).map((tx) => (
                    <TableRow key={tx.withdrawalId}>
                      <TableCell className="text-xs">{new Date(tx.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">${tx.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="text-[10px]">
                          {tx.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
