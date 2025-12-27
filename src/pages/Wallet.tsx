import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  CreditCard, 
  Copy, 
  ExternalLink,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Mock Data
const WALLET_ASSETS = [
  {
    id: "total",
    name: "Total Portfolio",
    symbol: "USD",
    balance: "24,562.00",
    change24h: 5.2,
    isPositive: true,
    color: "from-blue-500 to-purple-600"
  },
  {
    id: "ada",
    name: "Cardano",
    symbol: "ADA",
    balance: "12,450.00",
    value: "5,602.50",
    change24h: 2.1,
    isPositive: true,
    color: "from-blue-400 to-blue-600"
  },
  {
    id: "usdm",
    name: "USDM",
    symbol: "USDM",
    balance: "15,000.00",
    value: "15,000.00",
    change24h: 0.01,
    isPositive: true,
    color: "from-green-400 to-emerald-600"
  },
  {
    id: "verza",
    name: "Verza Token",
    symbol: "VRZ",
    balance: "5,000.00",
    value: "3,959.50",
    change24h: -1.2,
    isPositive: false,
    color: "from-verza-emerald to-teal-600"
  }
];

const TRANSACTIONS = [
  {
    id: 1,
    type: "Deposit",
    asset: "USDM",
    amount: "+1,000.00",
    status: "Completed",
    date: "Today, 10:23 AM",
    hash: "8x92...3k12",
    icon: ArrowDownLeft
  },
  {
    id: 2,
    type: "Payment",
    asset: "ADA",
    amount: "-150.00",
    status: "Processing",
    date: "Today, 09:15 AM",
    hash: "3m54...9p01",
    icon: ArrowUpRight
  },
  {
    id: 3,
    type: "Verification Fee",
    asset: "VRZ",
    amount: "-25.00",
    status: "Completed",
    date: "Yesterday",
    hash: "2k19...8m22",
    icon: ShieldCheck
  },
  {
    id: 4,
    type: "Swap",
    asset: "ADA -> USDM",
    amount: "500.00",
    status: "Completed",
    date: "Oct 24, 2023",
    hash: "7x11...4j99",
    icon: RefreshCw
  }
];

import { ShieldCheck } from "lucide-react";

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <div className="space-y-8 p-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Wallet</h1>
          <p className="text-muted-foreground mt-1">
            Manage your digital assets and transaction history.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="glass-button gap-2">
            <Wallet className="w-4 h-4" />
            Connect Wallet
          </Button>
          <Button className="bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow gap-2">
            <Plus className="w-4 h-4" /> Add Funds
          </Button>
        </div>
      </div>

      {/* Balance Cards Carousel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {WALLET_ASSETS.map((asset, index) => (
          <motion.div
            key={asset.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6 rounded-2xl relative overflow-hidden group border border-white/5"
          >
            <div className={cn(
              "absolute inset-0 opacity-10 bg-gradient-to-br transition-all duration-500 group-hover:opacity-20",
              asset.color
            )} />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                  {asset.id === "total" ? <DollarSign className="w-5 h-5 text-white" /> : <span className="font-bold text-sm">{asset.symbol}</span>}
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border",
                  asset.isPositive 
                    ? "text-green-400 bg-green-500/10 border-green-500/20" 
                    : "text-red-400 bg-red-500/10 border-red-500/20"
                )}>
                  {asset.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(asset.change24h)}%
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{asset.name}</p>
                <h3 className="text-2xl font-bold text-foreground">
                  {asset.id === "total" ? `$${asset.balance}` : asset.balance}
                </h3>
                {asset.value && (
                  <p className="text-xs text-muted-foreground">
                    ≈ ${asset.value}
                  </p>
                )}
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/5 blur-2xl group-hover:bg-white/10 transition-all" />
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: ArrowDownLeft, label: "Deposit", desc: "Add funds to wallet" },
          { icon: ArrowUpRight, label: "Withdraw", desc: "Transfer to bank/wallet" },
          { icon: RefreshCw, label: "Swap", desc: "Exchange assets" },
          { icon: CreditCard, label: "Buy Crypto", desc: "Use credit/debit card" }
        ].map((action) => (
          <motion.button
            key={action.label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-card p-4 rounded-xl text-left border border-white/5 hover:border-verza-emerald/30 hover:bg-white/5 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-verza-emerald/10 text-verza-emerald flex items-center justify-center mb-3 group-hover:bg-verza-emerald group-hover:text-white transition-colors">
              <action.icon className="w-5 h-5" />
            </div>
            <h3 className="font-medium text-foreground">{action.label}</h3>
            <p className="text-xs text-muted-foreground">{action.desc}</p>
          </motion.button>
        ))}
      </div>

      {/* Transaction History */}
      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-foreground">Transaction History</h2>
          <div className="flex items-center gap-2 bg-black/20 p-1 rounded-lg border border-white/5">
            {["All", "Deposits", "Withdrawals", "Swaps"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                  activeTab === tab.toLowerCase()
                    ? "bg-verza-emerald text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 text-xs uppercase text-muted-foreground font-medium">
              <tr>
                <th className="px-6 py-4 text-left">Type</th>
                <th className="px-6 py-4 text-left">Asset</th>
                <th className="px-6 py-4 text-left">Amount</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {TRANSACTIONS.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground">
                        <tx.icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-sm text-foreground">{tx.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {tx.asset}
                  </td>
                  <td className={cn(
                    "px-6 py-4 whitespace-nowrap text-sm font-medium",
                    tx.amount.startsWith("+") ? "text-green-400" : "text-foreground"
                  )}>
                    {tx.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium border",
                      tx.status === "Completed" 
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                    )}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {tx.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-white/5 flex justify-center">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            View All Transactions
          </Button>
        </div>
      </div>
    </div>
  );
}
