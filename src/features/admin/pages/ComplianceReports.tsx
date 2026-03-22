import { useState, useEffect } from 'react';
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
import { bankingService } from '@/services/bankingService';
import type { ComplianceReport } from '@/types/banking';

export default function ComplianceReports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await bankingService.listReports();
        setReports(data);
      } catch (error) {
        console.error("Failed to fetch reports", error);
        // Fallback to mock data if API fails (for demo purposes)
        setReports([
            { 
              id: 'RPT-2025-001', 
              name: 'Q1 2025 AML Audit', 
              type: 'Annual', 
              date: 'Apr 01, 2025', 
              status: 'Compliant',
              verifications: 1240,
              issues: 0
            },
            { 
              id: 'RPT-2025-002', 
              name: 'Monthly KYC Summary - March', 
              type: 'Monthly', 
              date: 'Apr 02, 2025', 
              status: 'Certified',
              verifications: 450,
              issues: 0
            }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const res = await bankingService.createReport({
        type: 'compliance',
        dateRange: {
          start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
          end: new Date().toISOString().split('T')[0]
        }
      });
      
      toast.success("New report generation started");
      
      // Optimistically add new report
      const newReport: ComplianceReport = {
        id: res.reportId,
        name: `Compliance Report (${new Date().toLocaleDateString()})`,
        date: new Date().toLocaleDateString(),
        type: 'Monthly',
        status: 'Pending',
        verifications: 0,
        issues: 0
      };
      
      setReports([newReport, ...reports]);
    } catch (error) {
      console.error("Failed to generate report", error);
      toast.error("Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });


  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Compliant':
      case 'Certified':
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20"><CheckCircle className="w-3 h-3 mr-1" /> {status}</Badge>;
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
            onClick={handleGenerateReport}
            disabled={isGenerating}
          >
            {isGenerating ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <FileText className="h-4 w-4 mr-2" />}
            Generate Report
          </Button>
        </div>
      </div>

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
            <div className="text-2xl font-bold text-green-500">98.5%</div>
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
              {isLoading ? (
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
                      onClick={() => toast.success(`Downloading ${report.name}`)}
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
