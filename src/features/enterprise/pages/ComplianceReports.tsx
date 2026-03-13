import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Download, Filter, Calendar, 
  CheckCircle, AlertTriangle, ShieldCheck, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { bankingService } from '@/services/bankingService';
import type { ComplianceReport } from '@/types/banking';

export default function ComplianceReports() {
  const [filterType, setFilterType] = useState('all');
  const [reports, setReports] = useState<ComplianceReport[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newReportType, setNewReportType] = useState<'compliance' | 'audit' | 'activity'>('compliance');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
        try {
            const data = await bankingService.listReports();
            setReports(data);
        } catch (error) {
            console.error("Failed to fetch reports", error);
        }
    };
    fetchReports();
  }, []);

  const filteredReports = filterType === 'all' 
    ? reports 
    : reports.filter(r => r.type.toLowerCase() === filterType);

  const handleCreateReport = async () => {
    setIsCreating(true);
    try {
      const res = await bankingService.createReport({
        type: newReportType,
        dateRange: { start: dateStart, end: dateEnd }
      });
      
      const newReport: ComplianceReport = {
        id: res.reportId,
        name: `${newReportType.charAt(0).toUpperCase() + newReportType.slice(1)} Report (${dateStart} - ${dateEnd})`,
        date: new Date().toLocaleDateString(),
        type: newReportType === 'compliance' ? 'Monthly' : newReportType === 'audit' ? 'Annual' : 'Quarterly', // Map to allowed types
        status: res.status === 'generating' ? 'Pending' : 'Compliant',
        verifications: 0,
        issues: 0
      };
      
      setReports([newReport, ...reports]);
      setIsCreateOpen(false);
      // Reset form
      setDateStart('');
      setDateEnd('');
    } catch (error) {
      console.error("Failed to create report", error);
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Compliant':
      case 'Certified':
      case 'Ready':
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20">{status}</Badge>;
      case 'Review Needed':
      case 'Pending':
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Compliance Reports</h1>
          <p className="text-muted-foreground">Access and download your verification compliance reports.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-verza-primary hover:bg-verza-primary/90 text-white shadow-glow">
                <FileText className="mr-2 h-4 w-4" /> Generate New Report
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate New Report</DialogTitle>
                <DialogDescription>
                  Create a new compliance report based on your verification data.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Report Type</Label>
                  <Select 
                    value={newReportType} 
                    onValueChange={(val: any) => setNewReportType(val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compliance">Compliance</SelectItem>
                      <SelectItem value="audit">Audit</SelectItem>
                      <SelectItem value="activity">Activity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="start">Start Date</Label>
                    <Input 
                      id="start" 
                      type="date" 
                      value={dateStart} 
                      onChange={(e) => setDateStart(e.target.value)} 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="end">End Date</Label>
                    <Input 
                      id="end" 
                      type="date" 
                      value={dateEnd} 
                      onChange={(e) => setDateEnd(e.target.value)} 
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateReport} disabled={isCreating || !dateStart || !dateEnd}>
                  {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Report
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <div className="text-2xl font-bold">Fully Compliant</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Last audit passed on Oct 15, 2023</p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-verza-primary" />
              <div className="text-2xl font-bold">24</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Archive available from Jan 2022</p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Next Audit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-verza-purple" />
              <div className="text-2xl font-bold">Jan 15, 2025</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Quarterly compliance review</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Report History</CardTitle>
              <CardDescription>View and download historical compliance reports.</CardDescription>
            </div>
            <div className="w-[180px]">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/50 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Date Generated</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verifications</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-muted/50">
                          <FileText className="h-4 w-4 text-verza-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{report.name}</div>
                          <div className="text-xs text-muted-foreground">{report.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{report.date}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{report.type}</Badge>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(report.status)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {report.verifications.toLocaleString()}
                      {report.issues > 0 && (
                        <span className="ml-2 text-xs text-red-500 flex items-center inline-flex">
                          <AlertTriangle className="h-3 w-3 mr-1" /> {report.issues} Issues
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-2" /> Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-verza-primary/5 border-verza-primary/20">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="p-3 rounded-full bg-verza-primary/10 text-verza-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-semibold text-foreground">Verza Compliance Guarantee</h3>
              <p className="text-sm text-muted-foreground">
                All verifications performed on the Verza platform are cryptographically signed and stored on the blockchain, ensuring 100% auditability and compliance with global data standards.
              </p>
            </div>
            <Button variant="outline" className="whitespace-nowrap">
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
