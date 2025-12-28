import { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  MessageSquare,
  UserCheck,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock Data
const MOCK_DISPUTES = [
  {
    id: "DSP-2024-001",
    type: "Verification Quality",
    filer: "John Doe",
    against: "SecureVerify Inc.",
    date: "2024-03-15",
    status: "open",
    assignedTo: null,
    priority: "high"
  },
  {
    id: "DSP-2024-002",
    type: "Payment Issue",
    filer: "Alice Smith",
    against: "FastCheck Ltd.",
    date: "2024-03-14",
    status: "in_review",
    assignedTo: "Admin User",
    priority: "medium"
  },
  {
    id: "DSP-2024-003",
    type: "Data Privacy",
    filer: "Robert Johnson",
    against: "Global ID Verifiers",
    date: "2024-03-10",
    status: "resolved",
    assignedTo: "Admin User",
    priority: "high"
  },
  {
    id: "DSP-2024-004",
    type: "Service Not Delivered",
    filer: "Sarah Williams",
    against: "Quick Verify",
    date: "2024-03-12",
    status: "open",
    assignedTo: null,
    priority: "low"
  }
];

export default function Disputes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('open');

  const filteredDisputes = MOCK_DISPUTES.filter(dispute => {
    const matchesSearch = 
      dispute.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.filer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.against.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && dispute.status === activeTab;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="destructive" className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">Open</Badge>;
      case 'in_review':
        return <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20">In Review</Badge>;
      case 'resolved':
        return <Badge variant="default" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-blue-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Dispute Resolution
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and resolve conflicts between users and verifiers
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
            <CheckCircle className="h-4 w-4 mr-2" />
            Auto-Assign
          </Button>
        </div>
      </div>

      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Disputes Overview</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search disputes..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="open" onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="all">All Disputes</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="in_review">In Review</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dispute ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Parties Involved</TableHead>
                      <TableHead>Filed Date</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDisputes.map((dispute) => (
                      <TableRow key={dispute.id}>
                        <TableCell className="font-medium">{dispute.id}</TableCell>
                        <TableCell>{dispute.type}</TableCell>
                        <TableCell>
                          <div className="flex flex-col text-sm">
                            <span className="font-medium text-blue-400">{dispute.filer}</span>
                            <span className="text-muted-foreground text-xs">vs {dispute.against}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            {dispute.date}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`flex items-center gap-1 font-medium ${getPriorityColor(dispute.priority)}`}>
                            <AlertTriangle className="h-3 w-3" />
                            {dispute.priority.charAt(0).toUpperCase() + dispute.priority.slice(1)}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(dispute.status)}</TableCell>
                        <TableCell>
                          {dispute.assignedTo ? (
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs text-blue-500">
                                {dispute.assignedTo.charAt(0)}
                              </div>
                              <span className="text-sm">{dispute.assignedTo}</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <UserCheck className="mr-2 h-4 w-4" />
                                Assign to Me
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Contact Parties
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-green-500">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Resolve Dispute
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-500">
                                <XCircle className="mr-2 h-4 w-4" />
                                Close Without Action
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
