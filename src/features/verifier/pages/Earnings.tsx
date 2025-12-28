import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Clock, Wallet, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        color: '#9ca3af'
      }
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      ticks: { color: '#9ca3af' },
      grid: { color: 'rgba(255, 255, 255, 0.1)' }
    },
    x: {
      ticks: { color: '#9ca3af' },
      grid: { display: false }
    }
  }
};

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const data = {
  labels,
  datasets: [
    {
      label: 'Earnings ($)',
      data: [1200, 1900, 1500, 2200, 2800, 3100],
      backgroundColor: 'rgba(141, 198, 63, 0.7)',
      borderColor: 'rgba(141, 198, 63, 1)',
      borderWidth: 1,
    },
  ],
};

const TRANSACTIONS = [
  { id: 1, type: "Payout", amount: 1250.00, date: "2023-06-15", status: "Completed" },
  { id: 2, type: "Payout", amount: 850.00, date: "2023-05-30", status: "Completed" },
  { id: 3, type: "Escrow Release", amount: 45.00, date: "2023-06-20", status: "Pending" },
  { id: 4, type: "Payout", amount: 2100.00, date: "2023-05-15", status: "Completed" },
];

export default function Earnings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Earnings</h1>
          <p className="text-muted-foreground">Track your verification income and payouts.</p>
        </div>
        <Button className="bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow">
          <Wallet className="mr-2 h-4 w-4" /> Withdraw Funds
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-verza-emerald" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,450.00</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-verza-emerald" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,100.00</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending (Escrow)</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$450.00</div>
            <p className="text-xs text-muted-foreground">Will release in ~2 days</p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Wallet className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,250.00</div>
            <p className="text-xs text-muted-foreground">Ready to withdraw</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        {/* Chart */}
        <Card className="col-span-4 bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Earnings Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
             <div className="h-[300px] w-full">
                <Bar options={options} data={data} />
             </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="col-span-3 bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Recent Payouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {TRANSACTIONS.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${tx.type === 'Payout' ? 'bg-verza-emerald/10 text-verza-emerald' : 'bg-yellow-500/10 text-yellow-500'}`}>
                      {tx.type === 'Payout' ? <ArrowUpRight className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{tx.type}</p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">${tx.amount.toFixed(2)}</p>
                    <p className={`text-xs ${tx.status === 'Completed' ? 'text-verza-emerald' : 'text-yellow-500'}`}>{tx.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
