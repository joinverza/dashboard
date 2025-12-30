import { useState } from 'react';
import { 
  Search, Filter, MoreHorizontal, FileText, 
  Shield, Eye, Download, Calendar, XCircle
} from 'lucide-react';
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface CredentialData {
  id: string;
  type: string;
  holder: string;
  issuer: string;
  status: 'valid' | 'revoked' | 'expired' | 'pending';
  issuedDate: string;
  expiryDate: string;
}

const MOCK_CREDENTIALS: CredentialData[] = [
  {
    id: 'VC-2025-001',
    type: 'University Degree',
    holder: 'Alice Johnson',
    issuer: 'University of Tech',
    status: 'valid',
    issuedDate: '2023-06-15',
    expiryDate: 'Never',
  },
  {
    id: 'VC-2025-002',
    type: 'Employment Record',
    holder: 'Bob Smith',
    issuer: 'Acme Corp',
    status: 'valid',
    issuedDate: '2023-08-01',
    expiryDate: '2025-08-01',
  },
  {
    id: 'VC-2025-003',
    type: 'Professional License',
    holder: 'Charlie Brown',
    issuer: 'Medical Board',
    status: 'revoked',
    issuedDate: '2023-01-10',
    expiryDate: '2025-01-10',
  },
  {
    id: 'VC-2025-004',
    type: 'Identity Verification',
    holder: 'David Lee',
    issuer: 'Global Verify Ltd',
    status: 'expired',
    issuedDate: '2022-05-20',
    expiryDate: '2023-05-20',
  },
  {
    id: 'VC-2025-005',
    type: 'Skill Certificate',
    holder: 'Eve Wilson',
    issuer: 'Code Academy',
    status: 'pending',
    issuedDate: '2025-03-20',
    expiryDate: 'Never',
  },
];

export default function CredentialManagement() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCredentials = MOCK_CREDENTIALS.filter(cred => {
    const matchesSearch = 
      cred.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cred.holder.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cred.issuer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cred.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || cred.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'valid':
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">Valid</Badge>;
      case 'revoked':
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">Revoked</Badge>;
      case 'expired':
        return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20">Expired</Badge>;
      case 'pending':
        return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">
            Credential Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage issued credentials across the platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.success("Credentials list exported")}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search credentials, holders, or issuers..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="valid">Valid</SelectItem>
                  <SelectItem value="revoked">Revoked</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
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
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Holder</TableHead>
                  <TableHead>Issuer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Issued Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCredentials.map((cred) => (
                  <TableRow key={cred.id}>
                    <TableCell className="font-medium font-mono text-xs">{cred.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {cred.type}
                      </div>
                    </TableCell>
                    <TableCell>{cred.holder}</TableCell>
                    <TableCell>{cred.issuer}</TableCell>
                    <TableCell>{getStatusBadge(cred.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {cred.issuedDate}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setLocation(`/admin/credentials/${cred.id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.success("Verification check started")}>
                            <Shield className="mr-2 h-4 w-4" />
                            Verify On-Chain
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-500" onClick={() => toast.error("Credential revoked")}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Revoke Credential
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
