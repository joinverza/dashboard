import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { ArrowLeft, Clock, FileText, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { bankingService, getBankingErrorMessage } from "@/services/bankingService";

export default function DisputeDetail() {
  const queryClient = useQueryClient();
  const [match, params] = useRoute("/admin/disputes/:id");
  const [, setLocation] = useLocation();
  const [notes, setNotes] = useState("");
  const disputeId = params?.id ?? "";
  const detailEnabled = match && Boolean(disputeId);

  const disputeQuery = useQuery({
    queryKey: ["admin", "dispute", disputeId],
    queryFn: () => bankingService.getDisputeDetail(disputeId),
    enabled: detailEnabled,
  });

  const resolveMutation = useMutation({
    mutationFn: (resolution: "approve_refund" | "reject") =>
      bankingService.resolveDispute(disputeId, { resolution, notes: notes || "Resolved by admin." }),
    onSuccess: async () => {
      toast.success("Dispute resolution submitted.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin", "dispute", disputeId] }),
        queryClient.invalidateQueries({ queryKey: ["admin", "disputes"] }),
      ]);
    },
    onError: (error) => toast.error(getBankingErrorMessage(error, "Failed to resolve dispute")),
  });

  if (!detailEnabled) return null;

  if (disputeQuery.isLoading) {
    return <div className="h-[50vh] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (disputeQuery.error || !disputeQuery.data) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => setLocation("/admin/disputes")}><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
        <div className="text-red-400 text-sm">{getBankingErrorMessage(disputeQuery.error, "Unable to load dispute.")}</div>
      </div>
    );
  }

  const dispute = disputeQuery.data;

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => setLocation("/admin/disputes")}><ArrowLeft className="h-4 w-4 mr-2" />Back to Disputes</Button>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{dispute.disputeId}</h1>
          <p className="text-muted-foreground">{dispute.type}</p>
        </div>
        <Badge variant="outline">{dispute.status}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle>Description</CardTitle></CardHeader>
            <CardContent><p className="text-sm leading-relaxed">{dispute.description || dispute.summary || "No description provided."}</p></CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Evidence</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {dispute.evidence.length === 0 ? (
                <p className="text-sm text-muted-foreground">No evidence attached.</p>
              ) : dispute.evidence.map((item) => (
                <div key={item.id} className="flex items-center gap-2 p-2 rounded border border-border/50">
                  <FileText className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{item.name}</span>
                  {item.url ? <a href={item.url} target="_blank" rel="noreferrer" className="ml-auto text-xs underline">Open</a> : null}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Resolution</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Provide adjudication notes..." rows={4} />
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => resolveMutation.mutate("approve_refund")} disabled={resolveMutation.isPending}>Approve Refund</Button>
                <Button variant="destructive" onClick={() => resolveMutation.mutate("reject")} disabled={resolveMutation.isPending}>Reject Claim</Button>
                <Button variant="outline" onClick={() => toast.info("Use integrated messaging endpoint for outreach workflow.")}>
                  <Send className="h-4 w-4 mr-2" />Notify Parties
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Parties</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div><p className="text-muted-foreground">Filer</p><p className="font-medium">{dispute.filedByProfile?.name ?? dispute.filedBy}</p></div>
              <Separator />
              <div><p className="text-muted-foreground">Against</p><p className="font-medium">{dispute.againstProfile?.name ?? dispute.against}</p></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Timeline</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {dispute.timeline.length === 0 ? (
                <p className="text-sm text-muted-foreground">No timeline events.</p>
              ) : dispute.timeline.map((event) => (
                <div key={event.eventId} className="text-sm border-l pl-3 border-border/70">
                  <p className="font-medium">{event.message}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    {new Date(event.createdAt).toLocaleString()} by {event.actor}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
