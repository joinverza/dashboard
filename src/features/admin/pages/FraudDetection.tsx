import { 
  ShieldAlert, Eye, 
  CheckCircle, XCircle, AlertTriangle, FileText,
  Search, Loader2
} from 'lucide-react';
import { useMemo, useState } from "react";
import { useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { bankingService, getBankingErrorMessage } from '@/services/bankingService';

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
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [trendsQuery, riskQuery, requestsQuery] = useQueries({
    queries: [
      { queryKey: ["admin", "fraud", "trends"], queryFn: () => bankingService.getFraudTrends({ range: "30d" }) },
      { queryKey: ["admin", "fraud", "risk-distribution"], queryFn: () => bankingService.getRiskDistribution() },
      { queryKey: ["admin", "fraud", "requests"], queryFn: () => bankingService.getVerificationRequests({ limit: 300 }) },
    ],
  });

  const resolveMutation = useMutation({
    mutationFn: ({ verificationId, status }: { verificationId: string; status: "verified" | "rejected" }) =>
      bankingService.updateVerificationStatus(verificationId, status, "Fraud analyst decision"),
    onSuccess: async () => {
      toast.success("Fraud review decision submitted.");
      await queryClient.invalidateQueries({ queryKey: ["admin", "fraud", "requests"] });
    },
    onError: (error) => toast.error(getBankingErrorMessage(error, "Failed to submit fraud decision")),
  });

  const fraudAlerts = useMemo(() => {
    const rows = requestsQuery.data ?? [];
    return rows
      .filter((row) => Number(row.details?.aiScore ?? 0) >= 70)
      .map((row) => ({
        id: row.verificationId,
        docType: row.details?.documentType ?? row.type,
        riskScore: Number(row.details?.aiScore ?? 0),
        user: row.details?.firstName ? `${row.details.firstName} ${row.details.lastName}` : "Unknown user",
        verifier: row.details?.verifier ?? "Assigned verifier",
        date: new Date(row.createdAt).toLocaleString(),
        status: row.status,
      }))
      .filter((row) => row.id.toLowerCase().includes(search.toLowerCase()) || row.user.toLowerCase().includes(search.toLowerCase()));
  }, [requestsQuery.data, search]);

  const fraudTrendData = {
    labels: (trendsQuery.data ?? []).map((i) => i.period),
    datasets: [
      {
        label: 'Fraud Attempts',
        data: (trendsQuery.data ?? []).map((i) => i.count),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const fraudTypeData = {
    labels: (riskQuery.data ?? []).map((i) => i.bucket),
    datasets: [
      {
        data: (riskQuery.data ?? []).map((i) => i.percentage),
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
            {(fraudAlerts.filter((a) => a.riskScore >= 90).length || 0)} Critical Alerts
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
              {trendsQuery.isLoading ? <div className="h-full flex items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div> : null}
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
              {riskQuery.isLoading ? <Loader2 className="h-7 w-7 animate-spin text-primary" /> : null}
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
                    <Input placeholder="Search alerts..." className="pl-8 w-[200px]" value={search} onChange={(e) => setSearch(e.target.value)} />
                  </div>
                  <Button variant="outline" onClick={() => void requestsQuery.refetch()} disabled={requestsQuery.isFetching}>
                    {requestsQuery.isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {requestsQuery.error ? <div className="text-sm text-red-400 mb-3">{getBankingErrorMessage(requestsQuery.error, "Failed to load fraud alerts.")}</div> : null}
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
                          alert.status === 'review_needed' ? 'text-orange-500 border-orange-500/20' : 
                          'text-verza-emerald border-verza-emerald/20'
                        }>
                          {alert.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" title="View Details" onClick={() => setLocation(`/admin/fraud/${alert.id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Reject" className="text-red-500 hover:text-red-600" onClick={() => resolveMutation.mutate({ verificationId: alert.id, status: "rejected" })}>
                            <XCircle className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Approve (False Positive)" className="text-verza-emerald hover:text-verza-emerald" onClick={() => resolveMutation.mutate({ verificationId: alert.id, status: "verified" })}>
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
                    <h4 className="text-sm font-medium text-red-500">High AI Risk Cluster</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {fraudAlerts.filter((a) => a.riskScore >= 90).length} requests currently exceed the 90+ AI risk threshold.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-3 border rounded-md bg-orange-500/5 border-orange-500/10">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-orange-500">Escalated Reviews</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(fraudAlerts.filter((a) => a.status === "review_needed").length || 0)} high-risk requests are waiting for manual review.
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-3 border rounded-md bg-yellow-500/5 border-yellow-500/10">
                <div className="flex items-start gap-3">
                  <Eye className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-500">Risk Distribution Drift</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Monitor bucket percentages from `/analytics/risk-distribution` for unexpected shifts.
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
