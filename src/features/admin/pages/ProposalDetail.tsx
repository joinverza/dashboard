import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, CheckCircle, Loader2, MinusCircle, Play, User, XCircle } from 'lucide-react';
import { useLocation, useRoute } from "wouter";
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { bankingService, getBankingErrorMessage } from "@/services/bankingService";

export default function ProposalDetail() {
  const [match, params] = useRoute("/admin/governance/:id");
  const [, setLocation] = useLocation();
  if (!match) return null;

  const proposalQuery = useQuery({
    queryKey: ["admin", "governance", params.id],
    queryFn: () => bankingService.getGovernanceProposal(params.id),
  });

  const executeMutation = useMutation({
    mutationFn: () => bankingService.executeGovernanceProposal(params.id),
    onSuccess: () => toast.success("Proposal execution queued."),
    onError: (error) => toast.error(getBankingErrorMessage(error, "Failed to execute proposal")),
  });

  if (proposalQuery.isLoading) {
    return <div className="h-[50vh] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  if (proposalQuery.error || !proposalQuery.data) {
    return <div className="text-sm text-red-400">{getBankingErrorMessage(proposalQuery.error, "Failed to load proposal.")}</div>;
  }

  const proposal = proposalQuery.data;
  const recentVotes = proposal.recentVotes ?? [];
  const abstainVotes = proposal.votesAbstain ?? 0;

  const totalVotes = proposal.votesFor + proposal.votesAgainst + abstainVotes;
  const forPercentage = Math.round((proposal.votesFor / totalVotes) * 100);
  const againstPercentage = Math.round((proposal.votesAgainst / totalVotes) * 100);
  const abstainPercentage = Math.round((abstainVotes / totalVotes) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setLocation('/admin/governance')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            {proposal.title}
            <Badge className="bg-verza-emerald/10 text-verza-emerald border-verza-emerald/20">Passed</Badge>
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              Proposed by {proposal.proposer}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Ends {new Date(proposal.votingEndsAt).toLocaleDateString()}
            </span>
            <span className="font-mono text-xs border px-1 rounded">{proposal.proposalId}</span>
          </div>
        </div>
        <div className="ml-auto">
          {proposal.status === 'passed' && (
            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => executeMutation.mutate()} disabled={executeMutation.isPending}>
              <Play className="h-4 w-4 mr-2" />
              Execute Proposal
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed">
                {proposal.summary}
              </p>
              
              <div className="mt-8">
                <h3 className="text-sm font-medium mb-4">Voting Results</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-verza-emerald" />
                        For
                      </span>
                      <span className="font-medium">{forPercentage}% ({proposal.votesFor.toLocaleString()})</span>
                    </div>
                    <Progress value={forPercentage} className="h-2 bg-muted [&>div]:bg-verza-emerald" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        Against
                      </span>
                      <span className="font-medium">{againstPercentage}% ({proposal.votesAgainst.toLocaleString()})</span>
                    </div>
                    <Progress value={againstPercentage} className="h-2 bg-muted [&>div]:bg-red-500" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <MinusCircle className="h-4 w-4 text-gray-500" />
                        Abstain
                      </span>
                      <span className="font-medium">{abstainPercentage}% ({abstainVotes.toLocaleString()})</span>
                    </div>
                    <Progress value={abstainPercentage} className="h-2 bg-muted [&>div]:bg-gray-500" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Recent Votes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Voter</TableHead>
                    <TableHead>Vote</TableHead>
                    <TableHead>Voting Power</TableHead>
                    <TableHead className="text-right">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentVotes.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No votes recorded.</TableCell></TableRow>
                  ) : recentVotes.map((vote, index) => (
                    <TableRow key={`${vote.voter}-${index}`}>
                      <TableCell className="font-medium">{vote.voter}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          vote.vote === 'for' ? 'text-verza-emerald border-verza-emerald/20' :
                          vote.vote === 'against' ? 'text-red-500 border-red-500/20' :
                          'text-gray-500 border-gray-500/20'
                        }>
                          {vote.vote}
                        </Badge>
                      </TableCell>
                      <TableCell>{vote.power.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{new Date(vote.createdAt).toLocaleString()}</TableCell>
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
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Proposal ID</p>
                <p className="font-mono text-sm">{proposal.proposalId}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Type</p>
                <Badge variant="secondary">{proposal.type}</Badge>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Voting System</p>
                <p className="text-sm font-medium">Single Choice Voting</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Start Date</p>
                <p className="text-sm font-medium">{new Date(proposal.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">End Date</p>
                <p className="text-sm font-medium">{new Date(proposal.votingEndsAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative border-l border-muted ml-2 space-y-6 pb-2">
                {(proposal.timeline ?? []).map((item, index) => (
                  <div key={index} className="ml-6 relative">
                    <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                    <p className="text-sm font-medium">{item.event}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
