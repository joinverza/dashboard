import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ArrowRight, Loader2, Plus, Search } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { bankingService, getBankingErrorMessage } from '@/services/bankingService';

export default function Governance() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');

  const proposalsQuery = useQuery({
    queryKey: ["admin", "governance", activeTab],
    queryFn: () => bankingService.listGovernanceProposals({ status: activeTab === "all" ? undefined : activeTab, page: 1, limit: 100 }),
  });

  const filteredProposals = useMemo(() => {
    const rows = proposalsQuery.data?.items ?? [];
    const query = searchTerm.toLowerCase();
    return rows.filter((p) => p.title.toLowerCase().includes(query) || p.proposalId.toLowerCase().includes(query));
  }, [proposalsQuery.data, searchTerm]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">Active Voting</Badge>;
      case 'passed':
        return <Badge className="bg-verza-emerald/10 text-verza-emerald hover:bg-verza-emerald/20 border-verza-emerald/20">Passed</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20">Rejected</Badge>;
      case 'executed':
        return <Badge className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-purple-500/20">Executed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-600 bg-clip-text text-transparent">
            Governance
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage platform proposals and voting parameters
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search proposals..."
              className="pl-8 w-[200px] lg:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => setLocation('/admin/governance/create')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Proposal
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Proposals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(proposalsQuery.data?.items ?? []).filter((i) => i.status === "active").length}</div>
            <p className="text-xs text-muted-foreground mt-1">Ending within 7 days</p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Votes Cast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(proposalsQuery.data?.items ?? []).reduce((sum, p) => sum + p.votesFor + p.votesAgainst + (p.votesAbstain ?? 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Votes across loaded proposals</p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Participation Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                ((proposalsQuery.data?.items ?? []).reduce((sum, p) => sum + p.votesFor, 0) /
                  Math.max(
                    1,
                    (proposalsQuery.data?.items ?? []).reduce((sum, p) => sum + p.votesFor + p.votesAgainst + (p.votesAbstain ?? 0), 0),
                  )) *
                  100,
              )}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">For-vote share in loaded dataset</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Proposals</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active" onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-4">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="passed">Passed</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="executed">Executed</TabsTrigger>
              <TabsTrigger value="all">All History</TabsTrigger>
            </TabsList>

          <div className="rounded-md border">
            {proposalsQuery.isLoading ? (
              <div className="flex justify-center py-12"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div>
            ) : proposalsQuery.error ? (
              <div className="py-8 px-4 text-sm text-red-400">{getBankingErrorMessage(proposalsQuery.error, "Failed to load proposals.")}</div>
            ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Proposal</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Voting Status</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProposals.map((proposal) => {
                      const totalVotes = proposal.votesFor + proposal.votesAgainst + (proposal.votesAbstain ?? 0);
                      const forPct = totalVotes > 0 ? Math.round((proposal.votesFor / totalVotes) * 100) : 0;
                      const againstPct = totalVotes > 0 ? Math.round((proposal.votesAgainst / totalVotes) * 100) : 0;
                      return (
                      <TableRow key={proposal.proposalId} className="cursor-pointer hover:bg-muted/50" onClick={() => setLocation(`/admin/governance/${proposal.proposalId}`)}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{proposal.title}</span>
                            <span className="text-xs text-muted-foreground">{proposal.proposalId} • by {proposal.proposer}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{proposal.type}</Badge>
                        </TableCell>
                        <TableCell className="w-[200px]">
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-verza-emerald">{forPct}% For</span>
                              <span className="text-red-500">{againstPct}% Against</span>
                            </div>
                            <Progress value={forPct} className="h-1.5" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            {new Date(proposal.votingEndsAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(proposal.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View Details <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )})}
                  </TableBody>
                </Table>
            )}
          </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
