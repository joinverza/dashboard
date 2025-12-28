import { useState } from 'react';
import { ArrowLeft, Save, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

export default function CreateProposal() {
  const [proposalType, setProposalType] = useState('');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Proposal</h1>
          <p className="text-muted-foreground">
            Submit a new governance proposal for voting
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Proposal Details</CardTitle>
              <CardDescription>Define the core information for your proposal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Proposal Type</Label>
                <Select value={proposalType} onValueChange={setProposalType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fee_adjustment">Fee Adjustment</SelectItem>
                    <SelectItem value="schema_addition">Schema Addition</SelectItem>
                    <SelectItem value="parameter_change">Parameter Change</SelectItem>
                    <SelectItem value="treasury_allocation">Treasury Allocation</SelectItem>
                    <SelectItem value="emergency_action">Emergency Action</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="e.g., Reduce Platform Fee to 1%" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Detailed explanation of the proposal..." 
                  className="min-h-[200px]"
                />
              </div>

              {proposalType === 'fee_adjustment' && (
                <div className="p-4 border rounded-md bg-muted/50 space-y-4">
                  <h3 className="font-medium text-sm">Fee Parameters</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Current Fee (%)</Label>
                      <Input disabled value="2.5" />
                    </div>
                    <div className="space-y-2">
                      <Label>Proposed Fee (%)</Label>
                      <Input type="number" step="0.1" placeholder="1.0" />
                    </div>
                  </div>
                </div>
              )}

              {proposalType === 'treasury_allocation' && (
                <div className="p-4 border rounded-md bg-muted/50 space-y-4">
                  <h3 className="font-medium text-sm">Allocation Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Recipient Address</Label>
                      <Input placeholder="0x..." />
                    </div>
                    <div className="space-y-2">
                      <Label>Amount (VERZA)</Label>
                      <Input type="number" placeholder="10000" />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="duration">Voting Duration (Days)</Label>
                <Input id="duration" type="number" defaultValue="7" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-md bg-background">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">
                    {proposalType ? proposalType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Type'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Draft</span>
                </div>
                <h3 className="font-bold mb-2">New Proposal Title</h3>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  Proposal description will appear here...
                </p>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Proposer</span>
                <span className="font-medium text-foreground">Admin Team</span>
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Start Date</span>
                <span className="font-medium text-foreground">Immediately</span>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>End Date</span>
                <span className="font-medium text-foreground">In 7 days</span>
              </div>

              <div className="pt-4 flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                  <Send className="h-4 w-4 mr-2" />
                  Submit
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Comments</Label>
                  <p className="text-xs text-muted-foreground">Enable discussion on this proposal</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Urgent Proposal</Label>
                  <p className="text-xs text-muted-foreground">Mark as high priority</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
