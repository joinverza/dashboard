import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  History, Search, Download, 
  User, Settings, FileText, Shield, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { bankingService } from '@/services/bankingService';
import type { AuditLogResponse } from '@/types/banking';

export default function AuditTrail() {
  const [searchType, setSearchType] = useState<'customer' | 'verification'>('customer');
  const [searchId, setSearchId] = useState('');
  const [logs, setLogs] = useState<AuditLogResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            const data = await bankingService.getAuditLogs();
            setLogs(data);
        } catch (error) {
            console.error("Failed to fetch audit logs", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchLogs();
  }, []);

  const handleSearch = async () => {
    if (!searchId) return;
    
    setIsLoading(true);
    try {
        let results: AuditLogResponse[] = [];
        if (searchType === 'customer') {
            results = await bankingService.getCustomerAudit(searchId);
        } else {
            results = await bankingService.getVerificationAudit(searchId);
        }
        setLogs(results.length ? results : []);
    } catch (error) {
        console.error("Failed to fetch audit logs", error);
        setLogs([]);
    } finally {
        setIsLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('Login')) return <User className="h-4 w-4 text-blue-500" />;
    if (action.includes('API')) return <Settings className="h-4 w-4 text-purple-500" />;
    if (action.includes('Verification')) return <Shield className="h-4 w-4 text-emerald-500" />;
    if (action.includes('Report')) return <FileText className="h-4 w-4 text-orange-500" />;
    return <History className="h-4 w-4 text-gray-500" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Audit Trail</h1>
          <p className="text-muted-foreground">Comprehensive log of all activities within your organization.</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Filter Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/4">
                <Select value={searchType} onValueChange={(v: any) => setSearchType(v)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Search by..." />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="customer">Customer ID</SelectItem>
                        <SelectItem value="verification">Verification ID</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="w-full md:w-1/2 relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder={`Enter ${searchType === 'customer' ? 'Customer' : 'Verification'} ID...`} 
                className="pl-8" 
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button className="w-full md:w-auto" onClick={handleSearch} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Search Logs
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Actor ID</TableHead>
                <TableHead>Resource ID</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 ? (
                  <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No logs found.
                      </TableCell>
                  </TableRow>
              ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-2 font-medium">
                          {getActionIcon(log.action)}
                          {log.action}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{log.actorId}</TableCell>
                      <TableCell className="font-mono text-xs">{log.resourceId}</TableCell>
                      <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            log.status === 'success' 
                              ? "bg-green-500/10 text-green-500 border-green-500/20" 
                              : "bg-red-500/10 text-red-500 border-red-500/20"
                          }
                        >
                          {log.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                        {JSON.stringify(log.details)}
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
