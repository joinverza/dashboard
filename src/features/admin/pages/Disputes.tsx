import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle, Eye, Loader2, Search, UserCheck } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { bankingService, getBankingErrorMessage } from "@/services/bankingService";

export default function Disputes() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("open");

  const disputesQuery = useQuery({
    queryKey: ["admin", "disputes", activeTab],
    queryFn: () => bankingService.listDisputes({ status: activeTab === "all" ? undefined : activeTab, page: 1, limit: 100 }),
  });

  const assignSelfMutation = useMutation({
    mutationFn: (disputeId: string) => bankingService.assignDispute(disputeId, "current_admin"),
    onSuccess: async () => {
      toast.success("Dispute assigned.");
      await queryClient.invalidateQueries({ queryKey: ["admin", "disputes"] });
    },
    onError: (error) => toast.error(getBankingErrorMessage(error, "Failed to assign dispute")),
  });

  const resolveMutation = useMutation({
    mutationFn: (disputeId: string) => bankingService.resolveDispute(disputeId, { resolution: "reject", notes: "Resolved by admin queue action" }),
    onSuccess: async () => {
      toast.success("Dispute resolved.");
      await queryClient.invalidateQueries({ queryKey: ["admin", "disputes"] });
    },
    onError: (error) => toast.error(getBankingErrorMessage(error, "Failed to resolve dispute")),
  });

  const rows = disputesQuery.data?.items ?? [];
  const filteredRows = useMemo(
    () =>
      rows.filter((item) => {
        const q = searchTerm.toLowerCase();
        return (
          item.disputeId.toLowerCase().includes(q) ||
          item.filedBy.toLowerCase().includes(q) ||
          item.against.toLowerCase().includes(q) ||
          item.type.toLowerCase().includes(q)
        );
      }),
    [rows, searchTerm],
  );

  const badgeForStatus = (status: string) => {
    if (status === "open") return <Badge variant="destructive">Open</Badge>;
    if (status === "in_review") return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">In Review</Badge>;
    if (status === "resolved") return <Badge className="bg-verza-emerald/10 text-verza-emerald border-verza-emerald/20">Resolved</Badge>;
    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dispute Resolution</h1>
          <p className="text-muted-foreground mt-1">Live dispute queue backed by `/disputes` APIs.</p>
        </div>
        <Button variant="outline" onClick={() => void disputesQuery.refetch()} disabled={disputesQuery.isFetching}>
          {disputesQuery.isFetching ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          Refresh
        </Button>
      </div>

      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <CardTitle>Disputes Overview</CardTitle>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search disputes..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="open" onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="open">Open</TabsTrigger>
              <TabsTrigger value="in_review">In Review</TabsTrigger>
              <TabsTrigger value="resolved">Resolved</TabsTrigger>
            </TabsList>
          </Tabs>

          {disputesQuery.isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-7 w-7 animate-spin text-primary" />
            </div>
          ) : disputesQuery.error ? (
            <div className="text-sm text-red-400">{getBankingErrorMessage(disputesQuery.error, "Failed to load disputes.")}</div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dispute ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Parties</TableHead>
                    <TableHead>Filed</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-10">No disputes found.</TableCell>
                    </TableRow>
                  ) : (
                    filteredRows.map((dispute) => (
                      <TableRow key={dispute.disputeId}>
                        <TableCell className="font-medium">{dispute.disputeId}</TableCell>
                        <TableCell>{dispute.type}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{dispute.filedBy}</div>
                            <div className="text-muted-foreground">vs {dispute.against}</div>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(dispute.filedAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1 text-sm">
                            <AlertTriangle className="h-3 w-3" />
                            {dispute.priority}
                          </span>
                        </TableCell>
                        <TableCell>{badgeForStatus(dispute.status)}</TableCell>
                        <TableCell>{dispute.assignedTo ?? "Unassigned"}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button size="sm" variant="outline" onClick={() => setLocation(`/admin/disputes/${dispute.disputeId}`)}>
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" disabled={assignSelfMutation.isPending} onClick={() => assignSelfMutation.mutate(dispute.disputeId)}>
                            <UserCheck className="h-3 w-3 mr-1" />
                            Assign
                          </Button>
                          {dispute.status !== "resolved" ? (
                            <Button size="sm" onClick={() => resolveMutation.mutate(dispute.disputeId)} disabled={resolveMutation.isPending}>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Resolve
                            </Button>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
