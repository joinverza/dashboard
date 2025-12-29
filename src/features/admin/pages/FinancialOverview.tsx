import { 
  DollarSign, TrendingUp, CreditCard, Wallet, 
  ArrowUpRight, ArrowDownRight, Download, Calendar
} from 'lucide-react';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  BarElement,
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
  BarElement
);

export default function FinancialOverview() {
  // const [dateRange, setDateRange] = useState('30d');

  // Mock Data
  const revenueData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 15000, 22000, 28000, 35000],
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const sourceData = {
    labels: ['Transaction Fees', 'Subscriptions', 'Premium Features', 'Consulting'],
    datasets: [
      {
        data: [45, 25, 20, 10],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const regionData = {
    labels: ['North America', 'Europe', 'Asia Pacific', 'LatAm', 'Other'],
    datasets: [
      {
        label: 'Revenue by Region',
        data: [45000, 32000, 28000, 12000, 5000],
        backgroundColor: 'rgba(99, 102, 241, 0.6)',
        borderRadius: 4,
      },
    ],
  };

  const treasuryTx = [
    { id: 'TX-9821', type: 'Deposit', amount: '+ 50,000 VERZA', from: 'Staking Pool', date: '2 hours ago' },
    { id: 'TX-9820', type: 'Withdrawal', amount: '- 12,500 VERZA', to: 'Grant Payout', date: '1 day ago' },
    { id: 'TX-9819', type: 'Fee Collection', amount: '+ 2,450 VERZA', from: 'Platform Fees', date: '1 day ago' },
    { id: 'TX-9818', type: 'Withdrawal', amount: '- 5,000 VERZA', to: 'Operational Costs', date: '2 days ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-600 bg-clip-text text-transparent">
            Financial Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            Platform revenue, treasury status, and payout management
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 Days
          </Button>
          <Button variant="outline" onClick={() => toast.success("Financial report exported")}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$124,500</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
              +12.5% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Recurring</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,200</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowUpRight className="h-3 w-3 text-emerald-500 mr-1" />
              +8.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escrow Balance</CardTitle>
            <CreditCard className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$892,100</div>
            <p className="text-xs text-muted-foreground mt-1">
              142 Active Escrows
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Treasury</CardTitle>
            <Wallet className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5M VERZA</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
              -2.1% (Grant Payouts)
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Line 
                data={revenueData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                      grid: { display: false }
                    }
                  },
                  plugins: {
                    legend: { display: false }
                  }
                }} 
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Revenue Source</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <Pie 
                data={sourceData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom' }
                  }
                }} 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Regional Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <Bar 
                data={regionData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                      grid: { display: false }
                    }
                  },
                  plugins: {
                    legend: { display: false }
                  }
                }} 
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Recent Treasury Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {treasuryTx.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{tx.type}</span>
                        <span className="text-xs text-muted-foreground">{tx.from || tx.to}</span>
                      </div>
                    </TableCell>
                    <TableCell className={tx.amount.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                      {tx.amount}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">{tx.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
