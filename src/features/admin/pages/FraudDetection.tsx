import { 
  ShieldAlert, Eye, 
  CheckCircle, XCircle, AlertTriangle, FileText,
  Search, Filter
} from 'lucide-react';
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

export default function FraudDetection() {
  const [, setLocation] = useLocation();
  // Mock Data
  const fraudAlerts = [
    { 
      id: 'ALRT-9021', 
      docType: 'Passport', 
      riskScore: 92, 
      user: 'John Doe', 
      verifier: 'QuickVerify Inc', 
      date: '10 mins ago', 
      status: 'pending' 
    },
    { 
      id: 'ALRT-9020', 
      docType: 'Driver License', 
      riskScore: 88, 
      user: 'Jane Smith', 
      verifier: 'SecureID Ltd', 
      date: '1 hour ago', 
      status: 'reviewing' 
    },
    { 
      id: 'ALRT-9019', 
      docType: 'Bank Statement', 
      riskScore: 75, 
      user: 'Bob Johnson', 
      verifier: 'BankAuth', 
      date: '2 hours ago', 
      status: 'resolved' 
    },
  ];

  const fraudTrendData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Fraud Attempts',
        data: [12, 19, 15, 25, 22, 10, 8],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const fraudTypeData = {
    labels: ['Identity Theft', 'Doc Forgery', 'Synthetic ID', 'Account Takeover'],
    datasets: [
      {
        data: [40, 30, 20, 10],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const getRiskColor = (score: number) => {
    if (score >= 90) return 'text-red-500';
    if (score >= 70) return 'text-orange-500';
    return 'text-yellow-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent">
            Fraud Detection
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered risk analysis and threat monitoring
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50" onClick={() => toast.error("Critical alerts summary opened")}>
            <ShieldAlert className="h-4 w-4 mr-2" />
            3 Critical Alerts
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Fraud Detection Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <Line 
                data={fraudTrendData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    x: {
                      grid: { display: false }
                    }
                  },
                  plugins: {
                    legend: { display: false }
                  }
                }} 
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Fraud by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] flex items-center justify-center">
              <Doughnut 
                data={fraudTypeData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom', labels: { boxWidth: 12 } }
                  }
                }} 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Alerts</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search alerts..." className="pl-8 w-[200px]" />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alert ID</TableHead>
                    <TableHead>Document</TableHead>
                    <TableHead>Risk Score</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fraudAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-mono text-xs">{alert.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          {alert.docType}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${getRiskColor(alert.riskScore)}`}>{alert.riskScore}</span>
                          <Progress value={alert.riskScore} className={`h-1.5 w-16 bg-muted [&>div]:${getRiskColor(alert.riskScore).replace('text-', 'bg-')}`} />
                        </div>
                      </TableCell>
                      <TableCell>{alert.user}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          alert.status === 'pending' ? 'text-red-500 border-red-500/20' : 
                          alert.status === 'reviewing' ? 'text-orange-500 border-orange-500/20' : 
                          'text-green-500 border-green-500/20'
                        }>
                          {alert.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" title="View Details" onClick={() => setLocation(`/admin/fraud/${alert.id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Reject" className="text-red-500 hover:text-red-600" onClick={() => toast.success(`Alert ${alert.id} rejected`)}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Approve (False Positive)" className="text-green-500 hover:text-green-600" onClick={() => toast.success(`Alert ${alert.id} marked as false positive`)}>
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Suspicious Patterns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 border rounded-md bg-red-500/5 border-red-500/10">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-red-500">Multiple Uploads</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Same IP address (192.168.1.55) uploaded 15 different documents in 10 minutes.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-3 border rounded-md bg-orange-500/5 border-orange-500/10">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-orange-500">Repeated Rejections</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Verifier "QuickVerify" rejected 40% of requests in the last hour (avg: 5%).
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-3 border rounded-md bg-yellow-500/5 border-yellow-500/10">
                <div className="flex items-start gap-3">
                  <Eye className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-500">Unusual Location</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Spike in traffic from high-risk jurisdiction detected.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
