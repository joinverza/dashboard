import { useState } from 'react';
import { 
  Search, Filter, Shield, 
  User, Database, Globe, Calendar
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

export default function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  // Mock Data
  const logs = [
    { 
      id: 'LOG-5521', 
      actor: 'Sarah Connor', 
      role: 'Super Admin',
      action: 'USER_SUSPEND', 
      target: 'User: u_9921 (John Doe)', 
      ip: '192.168.1.42',
      location: 'New York, US',
      timestamp: '2024-04-10 14:32:01',
      status: 'success'
    },
    { 
      id: 'LOG-5520', 
      actor: 'System', 
      role: 'System',
      action: 'DB_BACKUP', 
      target: 'Database: Primary', 
      ip: '10.0.0.1',
      location: 'Data Center 1',
      timestamp: '2024-04-10 14:00:00',
      status: 'success'
    },
    { 
      id: 'LOG-5519', 
      actor: 'Mike Brown', 
      role: 'Support',
      action: 'TICKET_RESOLVE', 
      target: 'Ticket: #8821', 
      ip: '192.168.1.105',
      location: 'London, UK',
      timestamp: '2024-04-10 13:45:12',
      status: 'success'
    },
    { 
      id: 'LOG-5518', 
      actor: 'Unknown', 
      role: 'Unknown',
      action: 'LOGIN_ATTEMPT', 
      target: 'Admin Portal', 
      ip: '45.22.11.99',
      location: 'Moscow, RU',
      timestamp: '2024-04-10 13:30:05',
      status: 'failed'
    },
    { 
      id: 'LOG-5517', 
      actor: 'Sarah Connor', 
      role: 'Super Admin',
      action: 'CONFIG_CHANGE', 
      target: 'Feature Flag: Beta_UI', 
      ip: '192.168.1.42',
      location: 'New York, US',
      timestamp: '2024-04-10 11:20:18',
      status: 'success'
    },
  ];

  const getActionIcon = (action: string) => {
    if (action.includes('USER')) return <User className="h-4 w-4 text-blue-500" />;
    if (action.includes('DB') || action.includes('CONFIG')) return <Database className="h-4 w-4 text-purple-500" />;
    if (action.includes('LOGIN')) return <Shield className="h-4 w-4 text-orange-500" />;
    return <Globe className="h-4 w-4 text-gray-500" />;
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.target.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = typeFilter === 'all' || 
      (typeFilter === 'security' && log.action.includes('LOGIN')) ||
      (typeFilter === 'system' && (log.action.includes('DB') || log.action.includes('CONFIG'))) ||
      (typeFilter === 'user' && log.action.includes('USER'));
      
    return matchesSearch && matchesType;
  });

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
          <Button variant="outline" onClick={() => toast.success("Logs exported to CSV")}>
            <Calendar className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

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
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Details</TableHead>
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
                    {log.timestamp}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{log.actor}</span>
                      <span className="text-xs text-muted-foreground">{log.role}</span>
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
                  <TableCell className="max-w-[200px] truncate" title={log.target}>
                    {log.target}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm">{log.location}</span>
                      <span className="text-xs text-muted-foreground">{log.ip}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={log.status === 'success' ? 'default' : 'destructive'}
                      className={log.status === 'success' ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : ''}
                    >
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
