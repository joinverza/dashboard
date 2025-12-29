import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Eye, CheckCircle, XCircle, 
  Clock, FileText, User, ArrowUpRight
} from 'lucide-react';
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from '@/components/ui/card';

// Mock Data
const MOCK_REQUESTS = [
  {
    id: 'REQ-001',
    user: 'Alice Johnson',
    type: 'Identity Verification',
    verifier: 'VeriTech Solutions',
    date: '2023-10-25',
    status: 'pending',
    priority: 'high',
  },
  {
    id: 'REQ-002',
    user: 'Bob Smith',
    type: 'Employment Check',
    verifier: 'Global ID Services',
    date: '2023-10-24',
    status: 'in_progress',
    priority: 'medium',
  },
  {
    id: 'REQ-003',
    user: 'Charlie Brown',
    type: 'Education Degree',
    verifier: 'University of Web3',
    date: '2023-10-23',
    status: 'completed',
    priority: 'low',
  },
  {
    id: 'REQ-004',
    user: 'Diana Prince',
    type: 'Skill Assessment',
    verifier: 'CodeMasters',
    date: '2023-10-22',
    status: 'rejected',
    priority: 'medium',
  },
  {
    id: 'REQ-005',
    user: 'Evan Wright',
    type: 'Identity Verification',
    verifier: 'QuickVerify Inc.',
    date: '2023-10-21',
    status: 'pending',
    priority: 'high',
  },
];

export default function VerificationRequests() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredRequests = MOCK_REQUESTS.filter(req => {
    const matchesSearch = 
      req.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const matchesType = typeFilter === 'all' || req.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Approved</Badge>;
      case 'pending': return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>;
      case 'in_progress': return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">In Progress</Badge>;
      case 'rejected': return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Rejected</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Verification Requests</h1>
          <p className="text-muted-foreground mt-1">Oversee and manage verification requests across the platform.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.success("Exported to CSV")}>
            <FileText className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button onClick={() => setLocation('/admin/verifications/new')}>
            <ArrowUpRight className="mr-2 h-4 w-4" /> Manual Request
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                <h3 className="text-2xl font-bold mt-1">1,248</h3>
              </div>
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <FileText className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <h3 className="text-2xl font-bold mt-1 text-yellow-500">42</h3>
              </div>
              <div className="p-3 bg-yellow-500/10 rounded-full text-yellow-500">
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <h3 className="text-2xl font-bold mt-1 text-green-500">1,156</h3>
              </div>
              <div className="p-3 bg-green-500/10 rounded-full text-green-500">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                <h3 className="text-2xl font-bold mt-1 text-red-500">50</h3>
              </div>
              <div className="p-3 bg-red-500/10 rounded-full text-red-500">
                <XCircle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-card/50 p-4 rounded-lg border border-border/50 backdrop-blur-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by user, ID, or verifier..."
            className="pl-9 bg-background/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px] bg-background/50">
              <SelectValue placeholder="Request Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Identity Verification">Identity</SelectItem>
              <SelectItem value="Employment Check">Employment</SelectItem>
              <SelectItem value="Education Degree">Education</SelectItem>
              <SelectItem value="Skill Assessment">Skill</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-background/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="bg-card/80 backdrop-blur-sm border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Request ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Verifier</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map((req) => (
              <TableRow key={req.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setLocation(`/admin/verifications/${req.id}`)}>
                <TableCell className="font-mono text-xs">{req.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-medium">{req.user}</span>
                  </div>
                </TableCell>
                <TableCell>{req.type}</TableCell>
                <TableCell className="text-muted-foreground">{req.verifier}</TableCell>
                <TableCell className="text-muted-foreground">{req.date}</TableCell>
                <TableCell>{getStatusBadge(req.status)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={(e) => {
                    e.stopPropagation();
                    setLocation(`/admin/verifications/${req.id}`);
                  }}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </motion.div>
  );
}
