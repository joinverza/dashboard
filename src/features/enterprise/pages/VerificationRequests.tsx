import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Download, MoreHorizontal, Eye, RefreshCw, FileText, 
  CheckCircle, XCircle, Clock, AlertTriangle, ArrowUpRight, Loader2, Activity
} from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { bankingService, getBankingErrorMessage } from '@/services/bankingService';
import type { VerificationStatsResponse, IndividualKYCRequest, VerificationRequestResponse } from '@/types/banking';

export default function VerificationRequests() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [stats, setStats] = useState<VerificationStatsResponse | null>(null);
  const [requests, setRequests] = useState<VerificationRequestResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pollingProgress, setPollingProgress] = useState<{
    verificationId: string;
    attempt: number;
    maxAttempts: number;
    status: VerificationRequestResponse['status'];
    timedOut: boolean;
    active: boolean;
  } | null>(null);
  
  // Form states for new request
  const [requestType, setRequestType] = useState('kyc_individual');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [idNumber, setIdNumber] = useState('');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsData, requestsData] = await Promise.all([
        bankingService.getVerificationStats(),
        bankingService.getVerificationRequests()
      ]);
      setStats(statsData);
      setRequests(requestsData);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateRequest = async () => {
    setIsSubmitting(true);
    try {
        if (requestType === 'kyc_individual') {
            const kycData: IndividualKYCRequest = {
                firstName,
                lastName,
                email,
                dob: '1990-01-01', // Default for demo
                phone: '555-0123', // Default for demo
                address: {
                    street: '123 Main St',
                    city: 'New York',
                    state: 'NY',
                    zipCode: '10001',
                    country: 'US'
                },
                idDocumentType: 'national_id',
                idDocumentNumber: idNumber
            };
            await bankingService.verifyIndividual(kycData);
        } else if (requestType === 'sanctions') {
            await bankingService.checkSanctions({
                name: `${firstName} ${lastName}`,
                country: 'US'
            });
        } else if (requestType === 'pep') {
            await bankingService.checkPEP({
                name: `${firstName} ${lastName}`,
                country: 'US'
            });
        } else if (requestType === 'document') {
             await bankingService.verifyDocument({
                 documentImage: "https://signed-cdn-url/front.jpg",
                 documentType: 'national_id',
                 issuingCountry: 'US',
                 useOcr: true,
             });
        } else if (requestType === 'aml') {
            const kycData: IndividualKYCRequest = {
                firstName,
                lastName,
                email,
                dob: '1990-01-01',
                phone: '555-0123',
                address: {
                    street: '123 Main St',
                    city: 'New York',
                    state: 'NY',
                    zipCode: '10001',
                    country: 'US'
                },
                idDocumentType: 'national_id',
                idDocumentNumber: idNumber
            };
            await bankingService.calculateRiskScore({ customerData: kycData });
        }
        setIsNewRequestOpen(false);
        // Reset form
        setFirstName('');
        setLastName('');
        setEmail('');
        setIdNumber('');
        // Refresh list
        fetchData();
    } catch (error) {
        console.error("Failed to create request", error);
    } finally {
        setIsSubmitting(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedRequests.length === requests.length) {
      setSelectedRequests([]);
    } else {
      setSelectedRequests(requests.map(r => r.verificationId));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedRequests.includes(id)) {
      setSelectedRequests(selectedRequests.filter(r => r !== id));
    } else {
      setSelectedRequests([...selectedRequests, id]);
    }
  };

  const checkStatus = async (id: string) => {
    setPollingProgress({
      verificationId: id,
      attempt: 0,
      maxAttempts: 20,
      status: 'pending',
      timedOut: false,
      active: true,
    });
    try {
      const status = await bankingService.pollVerificationStatus(id, {
        intervalMs: 3000,
        maxAttempts: 20,
        onProgress: (progress) => {
          setPollingProgress({
            verificationId: id,
            attempt: progress.attempt,
            maxAttempts: progress.maxAttempts,
            status: progress.status,
            timedOut: progress.timedOut,
            active: !progress.timedOut,
          });
        },
      });
      setRequests(prev => prev.map(req => 
        req.verificationId === id 
          ? { ...req, status: status.status, updatedAt: status.updatedAt } 
          : req
      ));
      if (status.status === 'not_found') {
        toast.info('Verification not found yet. It may still be propagating.');
      }
      setPollingProgress((current) =>
        current && current.verificationId === id
          ? { ...current, status: status.status, active: false }
          : current,
      );
    } catch (error) {
      console.error("Failed to check status", error);
      setPollingProgress((current) =>
        current && current.verificationId === id
          ? { ...current, timedOut: true, active: false }
          : current,
      );
      toast.error(getBankingErrorMessage(error, 'Verification status polling timed out'));
    }
  };

  const filteredRequests = requests.filter(req => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return req.status === "pending";
    if (activeTab === "completed") return req.status === "verified";
    if (activeTab === "failed") return req.status === "rejected" || req.status === "requires_action";
    return true;
  });

  const successRate = stats && stats.totalVerifications > 0 
    ? ((stats.approved / stats.totalVerifications) * 100).toFixed(1) 
    : "0.0";

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ent-text">
            Verification Requests
          </h1>
          <p className="text-verza-gray mt-1">
            Manage and track all your verification requests in one place
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 bg-ent-text/10 border-ent-border hover:bg-ent-text/10 text-ent-text">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
          
          <Dialog open={isNewRequestOpen} onOpenChange={setIsNewRequestOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-verza-emerald text-[#06140F] hover:bg-verza-emerald/90 transition-all rounded-full px-6">
                <ArrowUpRight className="h-4 w-4" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>New Verification Request</DialogTitle>
                <DialogDescription>
                  Initiate a new verification process.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Request Type</Label>
                  <Select value={requestType} onValueChange={setRequestType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kyc_individual">Individual KYC</SelectItem>
                      <SelectItem value="sanctions">Sanctions Check</SelectItem>
                      <SelectItem value="pep">PEP Check</SelectItem>
                      <SelectItem value="document">Document Verification</SelectItem>
                      <SelectItem value="aml">AML Risk Score</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                  </div>
                </div>
                {requestType === 'kyc_individual' && (
                  <>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="idNumber">ID Number</Label>
                      <Input id="idNumber" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />
                    </div>
                  </>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsNewRequestOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateRequest} disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="enterprise-card p-5">
          <div className="flex items-center justify-between pb-2">
            <span className="text-sm font-medium text-verza-gray">Total Requests</span>
            <FileText className="h-4 w-4 text-verza-gray/60" />
          </div>
          <div>
            <div className="text-2xl font-bold text-ent-text">{stats?.totalVerifications.toLocaleString() || "..."}</div>
            <p className="text-xs text-verza-gray flex items-center mt-1">
              <span className="text-verza-emerald flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-1" /> +12%
              </span>
              from last month
            </p>
          </div>
        </div>
        <div className="enterprise-card p-5">
          <div className="flex items-center justify-between pb-2">
            <span className="text-sm font-medium text-verza-gray">Success Rate</span>
            <CheckCircle className="h-4 w-4 text-verza-emerald" />
          </div>
          <div>
            <div className="text-2xl font-bold text-ent-text">{successRate}%</div>
            <p className="text-xs text-verza-gray flex items-center mt-1">
              <span className="text-verza-emerald flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-1" /> +2.1%
              </span>
              improvement
            </p>
          </div>
        </div>
        <div className="enterprise-card p-5">
          <div className="flex items-center justify-between pb-2">
            <span className="text-sm font-medium text-verza-gray">Pending</span>
            <Clock className="h-4 w-4 text-verza-emerald" />
          </div>
          <div>
            <div className="text-2xl font-bold text-ent-text">{stats?.pending.toLocaleString() || "..."}</div>
            <p className="text-xs text-verza-gray flex items-center mt-1">
              Awaiting verification
            </p>
          </div>
        </div>
        <div className="enterprise-card p-5">
          <div className="flex items-center justify-between pb-2">
            <span className="text-sm font-medium text-verza-gray">Avg Turnaround</span>
            <Clock className="h-4 w-4 text-verza-gray/60" />
          </div>
          <div>
            <div className="text-2xl font-bold text-ent-text">{stats ? (stats.averageTime / 60).toFixed(0) : "..."} min</div>
            <p className="text-xs text-verza-gray flex items-center mt-1">
              <span className="text-verza-emerald flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-1" /> -30 min
              </span>
              faster than target
            </p>
          </div>
        </div>
      </div>

      <div className="enterprise-card rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <Tabs defaultValue="all" onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList className="grid w-full grid-cols-4 md:w-auto bg-ent-muted border border-ent-border rounded-xl p-1">
                <TabsTrigger value="all" className="data-[state=active]:bg-verza-emerald data-[state=active]:text-[#06140F]">All</TabsTrigger>
                <TabsTrigger value="pending" className="data-[state=active]:bg-verza-emerald data-[state=active]:text-[#06140F]">Pending</TabsTrigger>
                <TabsTrigger value="completed" className="data-[state=active]:bg-verza-emerald data-[state=active]:text-[#06140F]">Completed</TabsTrigger>
                <TabsTrigger value="failed" className="data-[state=active]:bg-verza-emerald data-[state=active]:text-[#06140F]">Failed</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-verza-gray/60" />
                <Input
                  type="search"
                  placeholder="Search requests..."
                  className="pl-9 bg-ent-muted border-ent-border text-ent-text focus:border-verza-emerald/30 focus:bg-white/[0.04]"
                />
              </div>
              <Button variant="outline" size="icon" className="bg-ent-text/10 border-ent-border text-verza-gray hover:text-ent-text hover:bg-ent-text/10">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        <div>
          {pollingProgress && (
            <div className="mb-4 rounded-md border bg-muted/30 p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-medium">Polling {pollingProgress.verificationId}</div>
                <Badge variant={pollingProgress.timedOut ? 'destructive' : pollingProgress.active ? 'secondary' : 'outline'}>
                  {pollingProgress.timedOut ? 'TIMEOUT' : pollingProgress.active ? 'IN PROGRESS' : 'COMPLETED'}
                </Badge>
              </div>
              <div className="mt-2">
                <Progress value={(pollingProgress.attempt / pollingProgress.maxAttempts) * 100} />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Attempt {pollingProgress.attempt}/{pollingProgress.maxAttempts} · Status {pollingProgress.status}
              </div>
            </div>
          )}
          <div className="rounded-xl border border-ent-border bg-ent-text/5 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox 
                      checked={selectedRequests.length === requests.length && requests.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        Loading requests...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((req) => (
                    <motion.tr 
                      key={req.verificationId}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group hover:bg-ent-muted border-b border-ent-border transition-colors"
                    >
                      <TableCell>
                        <Checkbox 
                          checked={selectedRequests.includes(req.verificationId)}
                          onCheckedChange={() => toggleSelect(req.verificationId)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs font-medium text-ent-text">{req.verificationId}</TableCell>
                      <TableCell className="capitalize text-verza-gray">{req.type.replace('_', ' ')}</TableCell>
                      <TableCell className="text-verza-gray">{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          req.status === 'verified' ? 'bg-verza-emerald/10 text-verza-emerald border-verza-emerald/20' :
                          req.status === 'pending' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                          req.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                          'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                        }>
                          {req.status === 'verified' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {req.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                          {req.status === 'rejected' && <XCircle className="h-3 w-3 mr-1" />}
                          {req.status === 'requires_action' && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {req.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-verza-gray hover:text-ent-text hover:bg-ent-text/10">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Link href={`/enterprise/requests/${req.verificationId}`}>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem onClick={() => checkStatus(req.verificationId)}>
                              <Activity className="mr-2 h-4 w-4" /> Check Status
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
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button variant="outline" size="sm" disabled={isLoading}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={isLoading}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
