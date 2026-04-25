import { useState } from 'react';
import { useMutation, useQuery } from "@tanstack/react-query";
import { 
  Search, Filter, Shield, 
  User, Database, Globe, Calendar, Loader2
} from 'lucide-react';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { bankingService, getBankingErrorMessage } from '@/services/bankingService';
import type { AuditLogResponse } from '@/types/banking';

export default function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateWindow] = useState(() => {
    const now = Date.now();
    return {
      fromDate: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
      toDate: new Date(now).toISOString(),
    };
  });
  const { fromDate, toDate } = dateWindow;

  const logsQuery = useQuery({
    queryKey: ["admin", "audit-logs", fromDate, toDate, typeFilter],
    queryFn: async () => {
      const eventType = typeFilter === "all" ? undefined : typeFilter;
      const data = await bankingService.searchAuditTrail({
        from: fromDate,
        to: toDate,
        eventType,
      });
      return data.length ? data : bankingService.getAuditLogs();
    },
  });
  const logs: AuditLogResponse[] = logsQuery.data ?? [];

  const exportMutation = useMutation({
    mutationFn: () =>
      bankingService.exportSignedAuditLogs({
        from: fromDate,
        to: toDate,
        eventType: typeFilter === "all" ? undefined : typeFilter,
      }),
    onSuccess: (result) => {
      if (result.downloadUrl) {
        window.open(result.downloadUrl, "_blank");
      }
      toast.success("Signed audit export generated.");
    },
    onError: (error) => toast.error(getBankingErrorMessage(error, "Failed to export signed audit logs")),
  });

  const getActionIcon = (action: string) => {
    if (action.includes('USER')) return <User className="h-4 w-4 text-blue-500" />;
    if (action.includes('DB') || action.includes('CONFIG') || action.includes('KEY')) return <Database className="h-4 w-4 text-purple-500" />;
    if (action.includes('LOGIN') || action.includes('AUTH')) return <Shield className="h-4 w-4 text-orange-500" />;
    return <Globe className="h-4 w-4 text-gray-500" />;
  };

  const filteredLogs = logs.filter(log => {
    const detailsStr = typeof log.details === 'string' ? log.details : JSON.stringify(log.details);
    const matchesSearch = 
      log.actorId.toLowerCase().includes(searchTerm.toLowerCase()) || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      detailsStr.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = typeFilter === 'all' || 
      (typeFilter === 'security' && (log.action.includes('LOGIN') || log.action.includes('AUTH'))) ||
      (typeFilter === 'system' && (log.action.includes('KEY') || log.action.includes('CONFIG'))) ||
      (typeFilter === 'user' && log.action.includes('USER'));
      
    return matchesSearch && matchesType;
  });

  if (logsQuery.isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-500 to-slate-800 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
            System Audit Logs
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive trail of all administrative and system actions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => exportMutation.mutate()} disabled={exportMutation.isPending}>
            <Calendar className="h-4 w-4 mr-2" />
            Export Signed
          </Button>
          <Button variant="outline" onClick={() => void logsQuery.refetch()} disabled={logsQuery.isFetching}>
            {logsQuery.isFetching ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Refresh
          </Button>
        </div>
      </div>
      {logsQuery.error ? <div className="text-sm text-red-400">{getBankingErrorMessage(logsQuery.error, "Failed to load audit logs.")}</div> : null}

      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <CardTitle>Audit Trail</CardTitle>
            <div className="flex flex-col md:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search logs..." 
                  className="pl-8 w-full md:w-[300px]" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="user">User Action</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon" onClick={() => { setSearchTerm(''); setTypeFilter('all'); toast.info("Filters reset"); }}>
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Actor ID</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Resource ID</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No logs found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                <TableRow key={log.id} className="hover:bg-muted/50">
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{log.actorId}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getActionIcon(log.action)}
                      <Badge variant="outline" className="font-mono text-xs">
                        {log.action}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {log.resourceId}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={typeof log.details === 'string' ? log.details : JSON.stringify(log.details)}>
                    {typeof log.details === 'string' ? log.details : JSON.stringify(log.details)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast.info(`Viewing raw log: ${log.id}`)}>
                      View Raw
                    </Button>
                  </TableCell>
                </TableRow>
              ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
