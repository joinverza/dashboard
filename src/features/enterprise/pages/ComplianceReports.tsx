import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Download, Filter, Calendar, 
  CheckCircle, AlertTriangle, ShieldCheck 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data for reports
const COMPLIANCE_REPORTS = [
  { 
    id: "REP-2023-10", 
    name: "October 2023 Monthly Compliance Report", 
    date: "Nov 01, 2023", 
    type: "Monthly", 
    status: "Compliant",
    verifications: 1250,
    issues: 0
  },
  { 
    id: "REP-2023-09", 
    name: "September 2023 Monthly Compliance Report", 
    date: "Oct 01, 2023", 
    type: "Monthly", 
    status: "Compliant",
    verifications: 1100,
    issues: 0
  },
  { 
    id: "REP-2023-Q3", 
    name: "Q3 2023 Quarterly Audit", 
    date: "Oct 15, 2023", 
    type: "Quarterly", 
    status: "Review Needed",
    verifications: 3450,
    issues: 2
  },
  { 
    id: "REP-2023-08", 
    name: "August 2023 Monthly Compliance Report", 
    date: "Sep 01, 2023", 
    type: "Monthly", 
    status: "Compliant",
    verifications: 980,
    issues: 0
  },
  { 
    id: "REP-2023-SOC2", 
    name: "Annual SOC2 Compliance Certification", 
    date: "Aug 15, 2023", 
    type: "Annual", 
    status: "Certified",
    verifications: 12500,
    issues: 0
  }
];

export default function ComplianceReports() {
  const [filterType, setFilterType] = useState('all');

  const filteredReports = filterType === 'all' 
    ? COMPLIANCE_REPORTS 
    : COMPLIANCE_REPORTS.filter(r => r.type.toLowerCase() === filterType);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Compliant':
      case 'Certified':
        return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20">{status}</Badge>;
      case 'Review Needed':
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
          <Button className="bg-verza-primary hover:bg-verza-primary/90 text-white shadow-glow">
            <FileText className="mr-2 h-4 w-4" /> Generate New Report
          </Button>
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
              <div className="text-2xl font-bold">Jan 15, 2024</div>
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
