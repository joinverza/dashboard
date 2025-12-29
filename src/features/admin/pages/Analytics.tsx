import { 
  BarChart, 
  LineChart, 
  PieChart, 
  Download, 
  Calendar, 
  Plus,
  FileText,
  Trash2,
  RefreshCw,
  TrendingUp,
  Users,
  Shield,
  DollarSign
} from 'lucide-react';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Mock Data
const SAVED_REPORTS = [
  { id: 1, name: "Monthly User Growth", type: "User", lastRun: "2024-03-15", schedule: "Monthly" },
  { id: 2, name: "Weekly Revenue", type: "Financial", lastRun: "2024-03-14", schedule: "Weekly" },
  { id: 3, name: "Verifier Performance Q1", type: "Performance", lastRun: "2024-03-01", schedule: "Quarterly" },
  { id: 4, name: "Fraud Detection Summary", type: "Security", lastRun: "2024-03-15", schedule: "Daily" },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Analytics & Reports
          </h1>
          <p className="text-muted-foreground mt-1">
            Generate insights and download compliance reports
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.info("Date range picker opened")}>
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 Days
          </Button>
          <Button onClick={() => toast.success("New report builder initialized")}>
            <Plus className="h-4 w-4 mr-2" />
            New Custom Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="prebuilt" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="prebuilt">Pre-Built Reports</TabsTrigger>
          <TabsTrigger value="builder">Report Builder</TabsTrigger>
          <TabsTrigger value="saved">Saved Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="prebuilt" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors cursor-pointer group">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <CardTitle>User Growth Report</CardTitle>
                <CardDescription>New signups, active users, and retention rates</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground" onClick={() => toast.success("User Growth Report generated")}>
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors cursor-pointer group">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <CardTitle>Verification Trends</CardTitle>
                <CardDescription>Volume, success rates, and turnaround times</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground" onClick={() => toast.success("Verification Trends Report generated")}>
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors cursor-pointer group">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <DollarSign className="h-5 w-5 text-yellow-500" />
                </div>
                <CardTitle>Financial Summary</CardTitle>
                <CardDescription>Revenue, payouts, and platform fees</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground" onClick={() => toast.success("Financial Summary Report generated")}>
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors cursor-pointer group">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <Shield className="h-5 w-5 text-purple-500" />
                </div>
                <CardTitle>Verifier Performance</CardTitle>
                <CardDescription>Quality scores, dispute rates, and activity</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground" onClick={() => toast.success("Verifier Performance Report generated")}>
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors cursor-pointer group">
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <FileText className="h-5 w-5 text-red-500" />
                </div>
                <CardTitle>Compliance Audit</CardTitle>
                <CardDescription>KYC/AML checks and regulatory reporting</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground" onClick={() => toast.success("Compliance Audit Report generated")}>
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="builder">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
              <CardDescription>Select metrics and dimensions to create a custom report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>Report Name</Label>
                  <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="e.g. Q1 Marketing Impact" />
                </div>
                <div className="space-y-4">
                  <Label>Date Range</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Last 7 Days</SelectItem>
                      <SelectItem value="30d">Last 30 Days</SelectItem>
                      <SelectItem value="90d">Last 90 Days</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Metrics to Include</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted/50 cursor-pointer">
                    <Checkbox id="m1" />
                    <Label htmlFor="m1" className="cursor-pointer">New Users</Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted/50 cursor-pointer">
                    <Checkbox id="m2" />
                    <Label htmlFor="m2" className="cursor-pointer">Total Revenue</Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted/50 cursor-pointer">
                    <Checkbox id="m3" />
                    <Label htmlFor="m3" className="cursor-pointer">Verifications</Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted/50 cursor-pointer">
                    <Checkbox id="m4" />
                    <Label htmlFor="m4" className="cursor-pointer">Dispute Rate</Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted/50 cursor-pointer">
                    <Checkbox id="m5" />
                    <Label htmlFor="m5" className="cursor-pointer">Avg. Time</Label>
                  </div>
                  <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-muted/50 cursor-pointer">
                    <Checkbox id="m6" />
                    <Label htmlFor="m6" className="cursor-pointer">Churn Rate</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Visualization Type</Label>
                <div className="flex gap-4">
                  <div className="border p-4 rounded-md hover:border-primary cursor-pointer flex flex-col items-center gap-2 w-24">
                    <Table className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs">Table</span>
                  </div>
                  <div className="border p-4 rounded-md hover:border-primary cursor-pointer flex flex-col items-center gap-2 w-24">
                    <LineChart className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs">Line</span>
                  </div>
                  <div className="border p-4 rounded-md hover:border-primary cursor-pointer flex flex-col items-center gap-2 w-24">
                    <BarChart className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs">Bar</span>
                  </div>
                  <div className="border p-4 rounded-md hover:border-primary cursor-pointer flex flex-col items-center gap-2 w-24">
                    <PieChart className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs">Pie</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => toast.success("Report template saved")}>Save as Template</Button>
                <Button onClick={() => toast.success("Custom report generated")}>Generate Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Saved Reports</CardTitle>
              <CardDescription>Access your previously configured reports</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Last Run</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SAVED_REPORTS.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{report.type}</Badge>
                      </TableCell>
                      <TableCell>{report.lastRun}</TableCell>
                      <TableCell>{report.schedule}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => toast.success("Report data refreshed")}>
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => toast.success("Report downloaded")}>
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => toast.success("Report deleted")}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
