import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Download, MoreHorizontal, Eye, RefreshCw, FileText, 
  CheckCircle, XCircle, Clock, AlertTriangle, ArrowUpRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';

// Mock data for verification requests
const requestsData = [
  { id: "REQ-2025-1058", type: "University Degree", date: "2025-03-15", status: "completed", assignee: "Sarah Connor", verifier: "Verza Verify", cost: "$12.50" },
  { id: "REQ-2025-1057", type: "Employment History", date: "2025-03-15", status: "pending", assignee: "John Smith", verifier: "WorkCheck Inc", cost: "$15.00" },
  { id: "REQ-2025-1056", type: "Criminal Record", date: "2025-03-14", status: "failed", assignee: "Mike Johnson", verifier: "Background Pro", cost: "$25.00" },
  { id: "REQ-2025-1055", type: "Identity Check", date: "2025-03-14", status: "completed", assignee: "Sarah Connor", verifier: "Verza Verify", cost: "$5.00" },
  { id: "REQ-2025-1054", type: "Professional Cert", date: "2025-03-13", status: "completed", assignee: "Jane Doe", verifier: "TechCert Verify", cost: "$18.00" },
  { id: "REQ-2025-1053", type: "Credit History", date: "2025-03-12", status: "pending", assignee: "John Smith", verifier: "CreditScore", cost: "$10.00" },
  { id: "REQ-2025-1052", type: "University Degree", date: "2025-03-12", status: "completed", assignee: "Mike Johnson", verifier: "Verza Verify", cost: "$12.50" },
  { id: "REQ-2025-1051", type: "Employment History", date: "2025-03-11", status: "warning", assignee: "Sarah Connor", verifier: "WorkCheck Inc", cost: "$15.00" },
];

export default function VerificationRequests() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);

  const toggleSelectAll = () => {
    if (selectedRequests.length === requestsData.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(requestsData.map(r => r.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedRequests.includes(id)) {
      setSelectedRequests(selectedRequests.filter(r => r !== id));
    } else {
      setSelectedRequests([...selectedRequests, id]);
    }
  };

  const filteredRequests = requestsData.filter(req => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return req.status === "pending";
    if (activeTab === "completed") return req.status === "completed";
    if (activeTab === "failed") return req.status === "failed" || req.status === "warning";
    return true;
  });

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-verza-primary to-verza-secondary bg-clip-text text-transparent">
            Verification Requests
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your verification requests in one place
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
          <Button className="gap-2 bg-verza-primary hover:bg-verza-primary/90">
            <ArrowUpRight className="h-4 w-4" />
            New Request
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-1" /> +12%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-1" /> +2.1%
              </span>
              improvement
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Cost</CardTitle>
            <div className="font-bold text-muted-foreground">$</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$14.50</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-1" /> -18%
              </span>
              vs industry avg
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Turnaround</CardTitle>
            <Clock className="h-4 w-4 text-verza-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2 hrs</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-1" /> -30 min
              </span>
              faster than target
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="grid w-full grid-cols-4 md:w-auto">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="failed">Failed</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search requests..."
                  className="pl-8 bg-background/50"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox 
                      checked={selectedRequests.length === requestsData.length && requestsData.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Verifier</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((req) => (
                  <motion.tr 
                    key={req.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group hover:bg-muted/50 transition-colors"
                  >
                    <TableCell>
                      <Checkbox 
                        checked={selectedRequests.includes(req.id)}
                        onCheckedChange={() => toggleSelect(req.id)}
                      />
                    </TableCell>
                    <TableCell className="font-mono text-xs font-medium">{req.id}</TableCell>
                    <TableCell>{req.type}</TableCell>
                    <TableCell>{req.date}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        req.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                        req.status === 'pending' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                        req.status === 'failed' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                      }>
                        {req.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {req.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                        {req.status === 'failed' && <XCircle className="h-3 w-3 mr-1" />}
                        {req.status === 'warning' && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {req.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>{req.assignee}</TableCell>
                    <TableCell className="text-muted-foreground">{req.verifier}</TableCell>
                    <TableCell>{req.cost}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" /> Download Proof
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <RefreshCw className="mr-2 h-4 w-4" /> Re-verify
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
