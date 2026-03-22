import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Search, Filter, Eye, Star, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { bankingService } from "@/services/bankingService";
import type { VerificationRequestResponse } from "@/types/banking";
import { toast } from "sonner";

export default function History() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [history, setHistory] = useState<VerificationRequestResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const data = await bankingService.getVerificationRequests();
        // Filter for completed jobs (verified or rejected)
        const completedJobs = data.filter(job => 
          job.status === 'verified' || job.status === 'rejected'
        );
        setHistory(completedJobs);
      } catch (error) {
        console.error("Failed to fetch history", error);
        toast.error("Failed to load history");
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredHistory = history.filter(item => {
    const requesterName = item.details?.firstName ? `${item.details.firstName} ${item.details.lastName}` : 'Unknown';
    const type = item.type || 'Verification';
    
    const matchesSearch = requesterName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || type === filterType;
    return matchesSearch && matchesType;
  });

  // Calculate stats
  const totalJobs = history.length;
  // Filter for jobs this month (mocking date check as createdAt might be string)
  const thisMonthJobs = history.filter(job => {
    const date = new Date(job.updatedAt || new Date());
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;
  
  const totalEarnings = history.filter(j => j.status === 'verified').length * 15.00; // Mock $15 per verified job

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">History</h1>
          <p className="text-muted-foreground">View and manage your completed verification jobs.</p>
        </div>
        <Button variant="outline" onClick={() => toast.success("Exported to CSV")}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
                <p className="text-sm text-muted-foreground font-medium">Total Jobs</p>
                <h3 className="text-2xl font-bold mt-1">{totalJobs}</h3>
            </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
                <p className="text-sm text-muted-foreground font-medium">This Month</p>
                <h3 className="text-2xl font-bold mt-1">{thisMonthJobs}</h3>
            </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
                <p className="text-sm text-muted-foreground font-medium">Total Earnings</p>
                <h3 className="text-2xl font-bold mt-1 text-primary">${totalEarnings.toFixed(2)}</h3>
            </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
                <p className="text-sm text-muted-foreground font-medium">Avg Rating</p>
                <div className="flex items-center gap-1 mt-1">
                    <span className="text-2xl font-bold">4.9</span>
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search by requester or type..." 
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[180px]">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Filter by Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="kyc_individual">Identity</SelectItem>
                        <SelectItem value="document">Document</SelectItem>
                        <SelectItem value="kyc_business">Business</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </CardHeader>
        <CardContent>
            <div className="rounded-md border border-border/50">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Requester</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Earnings</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredHistory.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                                    No completed jobs found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredHistory.map((job) => (
                                <TableRow key={job.verificationId}>
                                    <TableCell className="font-medium">
                                        {new Date(job.updatedAt || new Date()).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{job.type?.replace('_', ' ').toUpperCase() || 'VERIFICATION'}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {job.details?.firstName ? `${job.details.firstName} ${job.details.lastName}` : 'Unknown'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={job.status === 'verified' ? 'default' : 'destructive'}>
                                            {job.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-primary font-medium">
                                        {job.status === 'verified' ? '$15.00' : '$0.00'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => window.location.href = `/verifier/jobs/${job.verificationId}`}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
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
