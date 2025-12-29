import { useState } from 'react';
import {
  Download, Filter, Calendar, ArrowUpRight, ArrowDownRight, Search
} from 'lucide-react';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';

export default function RevenueDrillDown() {
  const [dateRange, setDateRange] = useState('30d');
  
  // Mock Data
  const topCustomers = [
    { id: 'CUST-001', name: 'Acme Corp', type: 'Enterprise', revenue: '$12,450', growth: '+15%', transactions: 450 },
    { id: 'CUST-002', name: 'Global Verify', type: 'Verifier', revenue: '$8,200', growth: '+5%', transactions: 320 },
    { id: 'CUST-003', name: 'TechStart Inc', type: 'Enterprise', revenue: '$6,800', growth: '+22%', transactions: 180 },
    { id: 'CUST-004', name: 'SecureID Ltd', type: 'Verifier', revenue: '$5,400', growth: '-2%', transactions: 210 },
    { id: 'CUST-005', name: 'DataFlow Systems', type: 'Enterprise', revenue: '$4,900', growth: '+8%', transactions: 150 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-600 bg-clip-text text-transparent">
            Revenue Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Detailed breakdown of revenue sources and customer value
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last Quarter</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => toast.success("Revenue data exported")}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$124,500</div>
            <div className="flex items-center text-xs mt-1">
              <span className="text-emerald-500 flex items-center font-medium">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                12.5%
              </span>
              <span className="text-muted-foreground ml-1">vs previous period</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Revenue Per User</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$42.50</div>
            <div className="flex items-center text-xs mt-1">
              <span className="text-emerald-500 flex items-center font-medium">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                5.2%
              </span>
              <span className="text-muted-foreground ml-1">vs previous period</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Churn Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.1%</div>
            <div className="flex items-center text-xs mt-1">
              <span className="text-red-500 flex items-center font-medium">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                0.5%
              </span>
              <span className="text-muted-foreground ml-1">vs previous period (lower is better)</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <CardTitle>Top Revenue Generators</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search customers..." className="pl-8 w-[200px]" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Transactions</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right">Growth</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.type}</TableCell>
                  <TableCell>{customer.transactions}</TableCell>
                  <TableCell>{customer.revenue}</TableCell>
                  <TableCell className={`text-right ${customer.growth.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                    {customer.growth}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
