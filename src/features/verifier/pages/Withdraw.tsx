import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Wallet, History, AlertCircle } from "lucide-react";

export default function VerifierWithdraw() {
  const withdrawals = [
    { id: "TX123456", date: "2023-06-15", amount: 450.00, status: "Completed", hash: "0x7f...9a2b" },
    { id: "TX123457", date: "2023-05-20", amount: 1250.00, status: "Completed", hash: "0x3c...1e4f" },
    { id: "TX123458", date: "2023-04-10", amount: 300.00, status: "Completed", hash: "0x8d...5b7c" },
  ];

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
                <h2 className="text-2xl font-bold text-verza-emerald">$1,245.50</h2>
              </div>
              <Wallet className="h-8 w-8 text-muted-foreground/50" />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Wallet Address</Label>
                <Input id="address" placeholder="addr1..." defaultValue="addr1q9...xyz" />
                <p className="text-xs text-muted-foreground">
                  Verify this address carefully. Transactions cannot be reversed.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                  <Input id="amount" type="number" placeholder="0.00" className="pl-7" />
                  <Button variant="ghost" size="sm" className="absolute right-1 top-1 h-7 text-xs text-verza-emerald">
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
                   <span>$0.00</span>
                 </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow">
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
                  {withdrawals.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="text-xs">{tx.date}</TableCell>
                      <TableCell className="font-medium">${tx.amount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-[10px]">
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
