import { useState } from "react";
import { useLocation } from "wouter";
import { Search, Filter, Clock, Plus, ArrowRight } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

// Mock Data
const PROPOSALS = [
  {
    id: "PROP-024",
    title: "Increase Verifier Stake Requirement",
    type: "Parameter Change",
    proposer: "Admin Team",
    status: "active",
    votesFor: 65,
    votesAgainst: 35,
    endDate: "2024-04-01",
    description: "Raise the minimum stake from 5000 VERZA to 10000 VERZA to ensure higher commitment."
  },
  {
    id: "PROP-023",
    title: "Add Polygon Network Support",
    type: "Feature",
    proposer: "Dev Guild",
    status: "passed",
    votesFor: 88,
    votesAgainst: 12,
    endDate: "2024-03-10",
    description: "Integrate Polygon POS chain for lower cost credential anchoring."
  },
  {
    id: "PROP-022",
    title: "Reduce Platform Fee to 1%",
    type: "Fee Adjustment",
    proposer: "Community DAO",
    status: "rejected",
    votesFor: 42,
    votesAgainst: 58,
    endDate: "2024-02-28",
    description: "Lower the platform fee from 2.5% to 1% to attract more enterprise volume."
  },
  {
    id: "PROP-021",
    title: "Emergency Security Patch v2.1",
    type: "Emergency",
    proposer: "Core Devs",
    status: "executed",
    votesFor: 100,
    votesAgainst: 0,
    endDate: "2024-02-15",
    description: "Deploy critical security fix for the verification escrow contract."
  }
];

export default function Governance() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProposals = PROPOSALS.filter(p => {
    const matchesTab = activeTab === 'all' || p.status === activeTab;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">Active Voting</Badge>;
      case 'passed':
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">Passed</Badge>;
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
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
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
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">Ending within 7 days</p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Votes Cast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5M VERZA</div>
            <p className="text-xs text-muted-foreground mt-1">+8% from last month</p>
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Participation Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42%</div>
            <p className="text-xs text-muted-foreground mt-1">Of circulating supply</p>
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

            <TabsContent value={activeTab} className="mt-0">
              <div className="rounded-md border">
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
                    {filteredProposals.map((proposal) => (
                      <TableRow key={proposal.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setLocation(`/admin/governance/${proposal.id}`)}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{proposal.title}</span>
                            <span className="text-xs text-muted-foreground">{proposal.id} • by {proposal.proposer}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{proposal.type}</Badge>
                        </TableCell>
                        <TableCell className="w-[200px]">
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-green-500">{proposal.votesFor}% For</span>
                              <span className="text-red-500">{proposal.votesAgainst}% Against</span>
                            </div>
                            <Progress value={proposal.votesFor} className="h-1.5" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            {proposal.endDate}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(proposal.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View Details <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
