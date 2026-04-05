import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  FileText, Download, Calendar, 
  CheckCircle, AlertTriangle, Clock, Search, Loader2
} from 'lucide-react';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { bankingService, getBankingErrorMessage } from '@/services/bankingService';

export default function ComplianceReports() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const reportsQuery = useQuery({
    queryKey: ["admin", "compliance", "reports"],
    queryFn: () => bankingService.listReports(),
  });

  const generateMutation = useMutation({
    mutationFn: () =>
      bankingService.createReport({
        type: "compliance",
        dateRange: {
          start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split("T")[0],
          end: new Date().toISOString().split("T")[0],
        },
      }),
    onSuccess: async () => {
      toast.success("New report generation started");
      await queryClient.invalidateQueries({ queryKey: ["admin", "compliance", "reports"] });
    },
    onError: (error) => toast.error(getBankingErrorMessage(error, "Failed to generate report")),
  });

  const downloadMutation = useMutation({
    mutationFn: (reportId: string) => bankingService.getReportDetails(reportId),
    onSuccess: (detail: Awaited<ReturnType<typeof bankingService.getReportDetails>>) => {
      if (detail.downloadUrl) {
        window.open(detail.downloadUrl, "_blank");
      } else {
        toast.info("Report is not ready for download yet.");
      }
    },
    onError: (error) => toast.error(getBankingErrorMessage(error, "Failed to fetch report download link")),
  });

  const reports = reportsQuery.data ?? [];
  const filteredReports = useMemo(() => reports.filter(report => {
    const matchesSearch = 
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }), [reports, searchTerm, statusFilter]);


  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Compliant':
      case 'Certified':
        return <Badge className="bg-verza-emerald/10 text-verza-emerald hover:bg-verza-emerald/20 border-verza-emerald/20"><CheckCircle className="w-3 h-3 mr-1" /> {status}</Badge>;
      case 'Pending':
        return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20"><Clock className="w-3 h-3 mr-1" /> Processing</Badge>;
      case 'Review Needed':
        return <Badge className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20"><AlertTriangle className="w-3 h-3 mr-1" /> Review Needed</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20"><AlertTriangle className="w-3 h-3 mr-1" /> Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Compliance Reports
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate and manage regulatory compliance documentation
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative w-[200px]">
             <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
             <Input 
               placeholder="Search reports..." 
               className="pl-8 h-9" 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] h-9">
               <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Compliant">Compliant</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Review Needed">Review Needed</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            className="bg-blue-600 hover:bg-blue-700" 
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
          >
            {generateMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />}
            Generate Report
          </Button>
        </div>
      </div>
      {reportsQuery.error ? <div className="text-sm text-red-400">{getBankingErrorMessage(reportsQuery.error, "Failed to load compliance reports.")}</div> : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {reports.filter(r => r.status === 'Review Needed' || r.status === 'Pending').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Compliance Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-verza-emerald">98.5%</div>
            <p className="text-xs text-muted-foreground mt-1">Excellent status</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>
            List of recently generated compliance documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Verifications</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportsQuery.isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredReports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No reports found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{report.name}</span>
                      <span className="text-xs text-muted-foreground">{report.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{report.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {report.date}
                    </div>
                  </TableCell>
                  <TableCell>{report.verifications}</TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      disabled={report.status !== 'Compliant' && report.status !== 'Certified'}
                      onClick={() => downloadMutation.mutate(report.id)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
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
