import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, AlertTriangle, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";

const STAKE_HISTORY = [
    { id: 1, date: "2025-05-15", action: "Stake", amount: "+5,000 VERZA", status: "Completed" },
    { id: 2, date: "2025-04-01", action: "Stake", amount: "+10,000 VERZA", status: "Completed" },
    { id: 3, date: "2025-03-10", action: "Reward", amount: "+250 VERZA", status: "Completed" },
];

export default function Staking() {
  const [stakeAmount, setStakeAmount] = useState("");
  const [unstakeAmount, setUnstakeAmount] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Staking</h1>
          <p className="text-muted-foreground">Manage your VERZA stake to increase your verifier tier and rewards.</p>
        </div>
        <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1 bg-verza-purple/10 text-verza-purple border-verza-purple/20">
                <Shield className="mr-1 h-3 w-3" /> Tier 2 Verifier
            </Badge>
        </div>
      </div>

      {/* Main Stake Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-gradient-to-br from-verza-purple/20 to-card border-verza-purple/20">
            <CardHeader>
                <CardTitle className="text-verza-purple">Total Staked</CardTitle>
                <CardDescription>Your current active stake in the network.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold tracking-tight">15,250</span>
                    <span className="text-xl text-muted-foreground">VERZA</span>
                </div>
                <div className="mt-6 flex gap-8">
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">APY</p>
                        <p className="text-xl font-semibold text-green-500">8.5%</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">Est. Monthly Reward</p>
                        <p className="text-xl font-semibold">108 VERZA</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">Unstake Period</p>
                        <p className="text-xl font-semibold">14 Days</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
                <CardTitle>Tier Progress</CardTitle>
                <CardDescription>Next Tier: Tier 3 (Authority)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                    <span>15,250 / 25,000 VERZA</span>
                    <span className="text-muted-foreground">61%</span>
                </div>
                <Progress value={61} className="h-2" />
                <div className="bg-muted p-3 rounded-md text-sm space-y-2">
                    <p className="font-semibold">Tier 3 Benefits:</p>
                    <ul className="list-disc list-inside text-muted-foreground">
                        <li>2x Voting Power</li>
                        <li>Priority Job Matching</li>
                        <li>Lower Platform Fees (8%)</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actions Tabs */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
                <Tabs defaultValue="stake" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="stake">Stake More</TabsTrigger>
                        <TabsTrigger value="unstake">Unstake</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="stake" className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Amount to Stake</label>
                            <div className="relative">
                                <Input 
                                    placeholder="0.00" 
                                    value={stakeAmount}
                                    onChange={(e) => setStakeAmount(e.target.value)}
                                    className="pr-16"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                    VERZA
                                </div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Available: 2,450 VERZA</span>
                                <button className="text-verza-emerald hover:underline" onClick={() => setStakeAmount("2450")}>Max</button>
                            </div>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-md flex gap-3">
                            <Lock className="h-5 w-5 text-blue-500 shrink-0" />
                            <p className="text-xs text-muted-foreground">
                                Staked tokens are locked for a minimum of 30 days. Unstaking initiates a 14-day cooldown period.
                            </p>
                        </div>

                        <Button className="w-full bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow">
                            Confirm Stake
                        </Button>
                    </TabsContent>

                    <TabsContent value="unstake" className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Amount to Unstake</label>
                            <div className="relative">
                                <Input 
                                    placeholder="0.00" 
                                    value={unstakeAmount}
                                    onChange={(e) => setUnstakeAmount(e.target.value)}
                                    className="pr-16"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                                    VERZA
                                </div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Staked: 15,250 VERZA</span>
                                <button className="text-verza-emerald hover:underline" onClick={() => setUnstakeAmount("15250")}>Max</button>
                            </div>
                        </div>

                         <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-md flex gap-3">
                            <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />
                            <p className="text-xs text-muted-foreground">
                                Warning: Unstaking will reduce your tier level and you may lose benefits immediately.
                            </p>
                        </div>

                        <Button variant="outline" className="w-full border-red-500/50 text-red-500 hover:bg-red-500/10">
                            Initiate Unstake
                        </Button>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>

        {/* Requirements Table */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
                <CardTitle>Tier Requirements</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tier</TableHead>
                            <TableHead>Required Stake</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium">Tier 1 (Novice)</TableCell>
                            <TableCell>1,000 VERZA</TableCell>
                            <TableCell><Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Achieved</Badge></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Tier 2 (Pro)</TableCell>
                            <TableCell>10,000 VERZA</TableCell>
                            <TableCell><Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Current</Badge></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Tier 3 (Authority)</TableCell>
                            <TableCell>25,000 VERZA</TableCell>
                            <TableCell><span className="text-muted-foreground text-sm">Locked</span></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">Tier 4 (Partner)</TableCell>
                            <TableCell>100,000 VERZA</TableCell>
                            <TableCell><span className="text-muted-foreground text-sm">Locked</span></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>

      {/* History */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Staking History
            </CardTitle>
        </CardHeader>
        <CardContent>
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {STAKE_HISTORY.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.date}</TableCell>
                            <TableCell>{item.action}</TableCell>
                            <TableCell className="font-medium">{item.amount}</TableCell>
                            <TableCell>
                                <Badge variant="secondary">{item.status}</Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
