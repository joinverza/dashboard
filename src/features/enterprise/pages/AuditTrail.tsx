import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  History, Search, Download, 
  User, Settings, FileText, Shield, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data for audit logs
const AUDIT_LOGS = [
  { 
    id: "LOG-001", 
    action: "User Login", 
    actor: "Alex Johnson", 
    role: "Admin",
    target: "System",
    timestamp: "2 mins ago",
    status: "success",
    details: "Login from IP 192.168.1.1"
  },
  { 
    id: "LOG-002", 
    action: "Update API Key", 
    actor: "Sarah Connor", 
    role: "Manager",
    target: "API Management",
    timestamp: "1 hour ago",
    status: "success",
    details: "Rotated production key"
  },
  { 
    id: "LOG-003", 
    action: "Bulk Verification", 
    actor: "Mike Chen", 
    role: "Analyst",
    target: "Verification #8821",
    timestamp: "3 hours ago",
    status: "failed",
    details: "Invalid CSV format"
  },
  { 
    id: "LOG-004", 
    action: "Invite Team Member", 
    actor: "Alex Johnson", 
    role: "Admin",
    target: "User: Emily Davis",
    timestamp: "Yesterday, 4:30 PM",
    status: "success",
    details: "Sent invitation to emily.d@company.com"
  },
  { 
    id: "LOG-005", 
    action: "Download Report", 
    actor: "Sarah Connor", 
    role: "Manager",
    target: "Compliance Report Oct 2023",
    timestamp: "Oct 30, 2023",
    status: "success",
    details: "PDF download"
  }
];

export default function AuditTrail() {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  const filteredLogs = AUDIT_LOGS.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = actionFilter === 'all' || log.status === actionFilter;

    return matchesSearch && matchesFilter;
  });

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
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Activity Log ({filteredLogs.length})</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/50 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No logs found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded bg-muted/50">
                            {getActionIcon(log.action)}
                          </div>
                          <span className="font-medium text-sm">{log.action}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{log.actor}</span>
                          <span className="text-xs text-muted-foreground">{log.role}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{log.target}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          log.status === 'success' 
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                            : 'bg-red-500/10 text-red-500 border-red-500/20'
                        }>
                          {log.status === 'failed' && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {log.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{log.timestamp}</TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">
                        {log.details}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
