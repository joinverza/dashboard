import { motion } from 'framer-motion';
import { 
  Building, Mail, Calendar, 
  CreditCard, FileText,
  Activity, ExternalLink, RefreshCw, Ban, Users, Key, ArrowLeft
} from 'lucide-react';
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MOCK_ENTERPRISE = {
  id: '1',
  name: 'Acme Corp',
  email: 'admin@acme.com',
  did: 'did:verza:ent:1234567890',
  plan: 'Enterprise',
  status: 'active',
  joinedDate: 'Nov 15, 2022',
  lastActive: 'Today, 10:45 AM',
  description: 'Leading provider of widget solutions for the global market.',
  website: 'https://acme.com',
  location: 'New York, NY',
  stats: {
    users: 125,
    apiCalls: '1.2M',
    storage: '450GB',
    spent: '$24,500'
  }
};

const TEAM_MEMBERS = [
  { id: 1, name: 'John Smith', role: 'Admin', email: 'john@acme.com', status: 'Active' },
  { id: 2, name: 'Sarah Jones', role: 'Developer', email: 'sarah@acme.com', status: 'Active' },
  { id: 3, name: 'Mike Brown', role: 'Viewer', email: 'mike@acme.com', status: 'Inactive' },
];

const BILLING_HISTORY = [
  { id: 1, date: 'Oct 01, 2023', amount: '$2,500.00', status: 'Paid', invoice: 'INV-2023-001' },
  { id: 2, date: 'Sep 01, 2023', amount: '$2,500.00', status: 'Paid', invoice: 'INV-2023-002' },
  { id: 3, date: 'Aug 01, 2023', amount: '$2,500.00', status: 'Paid', invoice: 'INV-2023-003' },
];

export default function EnterpriseDetail() {
  const [, setLocation] = useLocation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Button variant="ghost" className="pl-0 gap-2 hover:bg-transparent hover:text-primary" onClick={() => setLocation('/admin/enterprises')}>
        <ArrowLeft className="w-4 h-4" /> Back to Enterprises
      </Button>

      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-card/80 backdrop-blur-sm border border-border/50 p-6 rounded-lg">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border-4 border-background rounded">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${MOCK_ENTERPRISE.name}`} />
            <AvatarFallback>AC</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{MOCK_ENTERPRISE.name}</h1>
              <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">{MOCK_ENTERPRISE.plan}</Badge>
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>
            </div>
            <div className="flex flex-col gap-1 mt-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Building className="h-3 w-3" /> {MOCK_ENTERPRISE.location}
                <span className="mx-1">•</span>
                <Mail className="h-3 w-3" /> {MOCK_ENTERPRISE.email}
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <Activity className="h-3 w-3" /> Last active: {MOCK_ENTERPRISE.lastActive}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => {
            window.open(MOCK_ENTERPRISE.website, '_blank');
            toast.success("Website opened in new tab");
          }}>
            <ExternalLink className="mr-2 h-4 w-4" /> Visit Website
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.info("Change Plan modal opened")}>
            <RefreshCw className="mr-2 h-4 w-4" /> Change Plan
          </Button>
          <Button variant="destructive" size="sm" onClick={() => toast.warning("Enterprise suspended")}>
            <Ban className="mr-2 h-4 w-4" /> Suspend
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-card/50 backdrop-blur-sm border border-border/50 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team Members</TabsTrigger>
          <TabsTrigger value="billing">Billing History</TabsTrigger>
          <TabsTrigger value="notes">Admin Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 md:col-span-2">
              <CardHeader>
                <CardTitle>Usage Metrics</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-secondary/20 border border-border/50">
                  <div className="text-sm text-muted-foreground mb-1">Total Users</div>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    {MOCK_ENTERPRISE.stats.users}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-secondary/20 border border-border/50">
                  <div className="text-sm text-muted-foreground mb-1">API Calls (Monthly)</div>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-500" />
                    {MOCK_ENTERPRISE.stats.apiCalls}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-secondary/20 border border-border/50">
                  <div className="text-sm text-muted-foreground mb-1">Storage Used</div>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    <Key className="h-5 w-5 text-yellow-500" />
                    {MOCK_ENTERPRISE.stats.storage}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-secondary/20 border border-border/50">
                  <div className="text-sm text-muted-foreground mb-1">Lifetime Value</div>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-purple-500" />
                    {MOCK_ENTERPRISE.stats.spent}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">About</div>
                  <p className="text-sm mt-1">{MOCK_ENTERPRISE.description}</p>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Joined Date</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" /> {MOCK_ENTERPRISE.joinedDate}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Plan Renewal</div>
                  <div className="mt-1 text-sm">Nov 15, 2025 (Auto-renew)</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Users associated with this enterprise account.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {TEAM_MEMBERS.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={member.status === 'Active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-gray-500/10 text-gray-500 border-gray-500/20'}>
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Manage</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>Past invoices and payments.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Download</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {BILLING_HISTORY.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell>{bill.date}</TableCell>
                      <TableCell>{bill.invoice}</TableCell>
                      <TableCell>{bill.amount}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                          {bill.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Admin Notes</CardTitle>
              <CardDescription>Internal notes about this enterprise (not visible to client).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="Add a note..." 
                className="min-h-[150px]"
                defaultValue="Key account. Dedicated support assigned: Sarah J. Quarterly review scheduled for Dec 15."
              />
              <div className="flex justify-end">
                <Button>Save Notes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
