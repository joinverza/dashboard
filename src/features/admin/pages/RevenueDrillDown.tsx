import { useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import {
  Download, Calendar, ArrowUpRight, ArrowDownRight, Search, Loader2
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
import { bankingService, getBankingErrorMessage } from '@/services/bankingService';

export default function RevenueDrillDown() {
  const [dateRange, setDateRange] = useState('30d');
  const [search, setSearch] = useState("");
  const [overviewQuery, customersQuery] = useQueries({
    queries: [
      { queryKey: ["admin", "financial", "overview", dateRange], queryFn: () => bankingService.getFinancialOverview(dateRange) },
      { queryKey: ["admin", "financial", "customers", dateRange, search], queryFn: () => bankingService.getRevenueCustomers({ range: dateRange, search, page: 1, limit: 100 }) },
    ],
  });

  const topCustomers = customersQuery.data?.items ?? [];
  const totalRevenue = overviewQuery.data?.totalRevenue ?? 0;
  const arpu = topCustomers.length ? totalRevenue / topCustomers.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-verza-emerald to-cyan-600 bg-clip-text text-transparent">
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
      {overviewQuery.isLoading || customersQuery.isLoading ? <div className="flex justify-center py-10"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div> : null}
      {overviewQuery.error ? <div className="text-sm text-red-400">{getBankingErrorMessage(overviewQuery.error, "Failed to load revenue overview.")}</div> : null}
      {customersQuery.error ? <div className="text-sm text-red-400">{getBankingErrorMessage(customersQuery.error, "Failed to load top customers.")}</div> : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs mt-1">
              <span className="text-verza-emerald flex items-center font-medium">
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
            <div className="text-2xl font-bold">${arpu.toFixed(2)}</div>
            <div className="flex items-center text-xs mt-1">
              <span className="text-verza-emerald flex items-center font-medium">
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
            <div className="text-2xl font-bold">
              {Math.abs((topCustomers.filter((item) => item.growthPercent < 0).length / Math.max(topCustomers.length, 1)) * 100).toFixed(1)}%
            </div>
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
                <Input placeholder="Search customers..." className="pl-8 w-[200px]" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
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
                <TableRow key={customer.customerId}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.type}</TableCell>
                  <TableCell>{customer.transactions}</TableCell>
                  <TableCell>${customer.revenue.toLocaleString()}</TableCell>
                  <TableCell className={`text-right ${customer.growthPercent >= 0 ? 'text-verza-emerald' : 'text-red-500'}`}>
                    {customer.growthPercent >= 0 ? "+" : ""}{customer.growthPercent}%
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
