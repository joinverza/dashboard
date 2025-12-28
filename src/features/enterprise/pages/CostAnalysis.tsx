import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, CreditCard, PieChart, 
  Download, ArrowUpRight, ArrowDownRight,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const TRANSACTIONS = [
  { id: "INV-2023-001", date: "Oct 01, 2023", amount: "$2,450.00", status: "Paid", description: "Monthly Verification Plan" },
  { id: "INV-2023-002", date: "Oct 15, 2023", amount: "$150.00", status: "Paid", description: "Overage Charges" },
  { id: "INV-2023-003", date: "Nov 01, 2023", amount: "$2,450.00", status: "Paid", description: "Monthly Verification Plan" },
  { id: "INV-2023-004", date: "Nov 12, 2023", amount: "$75.00", status: "Processing", description: "API Usage" },
  { id: "INV-2023-005", date: "Dec 01, 2023", amount: "$2,450.00", status: "Pending", description: "Monthly Verification Plan" },
];

export default function CostAnalysis() {
  const [timeRange, setTimeRange] = useState('30d');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Cost Analysis</h1>
          <p className="text-muted-foreground">Monitor your spending and billing history.</p>
        </div>
        <div className="flex gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Spending (MTD)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,525.00</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500 flex items-center mr-1">
                <ArrowDownRight className="h-3 w-3" /> 2.1%
              </span> 
              vs last month
            </div>
            <Progress value={65} className="h-2 mt-4" />
            <p className="text-xs text-muted-foreground mt-2">65% of budget utilized</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Projected Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,100.00</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <span className="text-red-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3" /> 5.4%
              </span> 
              vs last month
            </div>
             <Progress value={80} className="h-2 mt-4 bg-muted" indicatorClassName="bg-yellow-500" />
             <p className="text-xs text-muted-foreground mt-2">Estimated based on current usage</p>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cost per Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.45</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500 flex items-center mr-1">
                <ArrowDownRight className="h-3 w-3" /> 12%
              </span> 
              vs industry avg
            </div>
             <div className="mt-4 flex items-center gap-2">
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Optimized</Badge>
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Spending History</CardTitle>
            <CardDescription>Monthly expenditure over the last 12 months.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md mx-6 mb-6">
             <div className="flex flex-col items-center text-muted-foreground">
                <DollarSign className="h-12 w-12 mb-2 opacity-50" />
                <p>Spending Chart Placeholder</p>
             </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
            <CardDescription>By service type.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center bg-muted/20 rounded-md mx-6 mb-6">
             <div className="flex flex-col items-center text-muted-foreground">
                <PieChart className="h-12 w-12 mb-2 opacity-50" />
                <p>Breakdown Chart Placeholder</p>
             </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Invoices & Transactions</CardTitle>
            <Button variant="outline" size="sm">
                <CreditCard className="mr-2 h-4 w-4" /> Manage Payment Methods
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TRANSACTIONS.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium">{tx.id}</TableCell>
                  <TableCell>{tx.date}</TableCell>
                  <TableCell>{tx.description}</TableCell>
                  <TableCell>{tx.amount}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                        tx.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' : 
                        tx.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-blue-500/10 text-blue-500'
                    }>
                        {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                    </Button>
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
