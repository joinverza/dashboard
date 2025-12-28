import { useState } from 'react';
import { 
  Search, Filter, AlertTriangle, AlertCircle, 
  Info, Download, Eye, CheckCircle, ExternalLink 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';

export default function ErrorLogs() {
  const [severityFilter, setSeverityFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');

  // Mock Data
  const errorLogs = [
    { 
      id: 'ERR-5092', 
      timestamp: '2024-03-15 14:23:45', 
      service: 'API Gateway', 
      severity: 'critical', 
      message: 'Rate limit exceeded for IP 192.168.1.1',
      status: 'open'
    },
    { 
      id: 'ERR-5091', 
      timestamp: '2024-03-15 14:15:22', 
      service: 'Database', 
      severity: 'error', 
      message: 'Connection timeout: Pool size limit reached',
      status: 'investigating'
    },
    { 
      id: 'ERR-5090', 
      timestamp: '2024-03-15 13:45:10', 
      service: 'Auth Service', 
      severity: 'warning', 
      message: 'Invalid signature detected in JWT token',
      status: 'resolved'
    },
    { 
      id: 'ERR-5089', 
      timestamp: '2024-03-15 13:30:05', 
      service: 'Blockchain Node', 
      severity: 'error', 
      message: 'Block sync stalled at height 1234567',
      status: 'open'
    },
    { 
      id: 'ERR-5088', 
      timestamp: '2024-03-15 12:10:55', 
      service: 'Message Queue', 
      severity: 'warning', 
      message: 'High consumer latency detected on verify_queue',
      status: 'resolved'
    },
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"><AlertCircle className="h-3 w-3 mr-1" /> Critical</Badge>;
      case 'error':
        return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20"><AlertTriangle className="h-3 w-3 mr-1" /> Error</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20"><Info className="h-3 w-3 mr-1" /> Warning</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-red-500">
            Error Logs
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and resolve system anomalies and exceptions
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Sentry
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search error message, ID, or service..." className="pl-8" />
            </div>
            <div className="flex gap-2">
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                </SelectContent>
              </Select>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="api">API Gateway</SelectItem>
                  <SelectItem value="db">Database</SelectItem>
                  <SelectItem value="auth">Auth Service</SelectItem>
                  <SelectItem value="blockchain">Blockchain Node</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {errorLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">{log.timestamp}</TableCell>
                    <TableCell>{log.service}</TableCell>
                    <TableCell>{getSeverityBadge(log.severity)}</TableCell>
                    <TableCell className="max-w-[300px] truncate" title={log.message}>
                      {log.message}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        log.status === 'resolved' ? 'text-green-500 border-green-500/20' : 
                        log.status === 'investigating' ? 'text-blue-500 border-blue-500/20' : 
                        'text-red-500 border-red-500/20'
                      }>
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" title="View Details">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {log.status !== 'resolved' && (
                          <Button variant="ghost" size="icon" title="Mark Resolved" className="text-green-500 hover:text-green-600">
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
