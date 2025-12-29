import { motion } from 'framer-motion';
import { 
  Mail, Calendar, Shield, Activity, 
  CreditCard, FileText, Lock, Ban, Edit, 
  Trash2, Eye, ArrowLeft
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

const MOCK_USER = {
  id: '1',
  name: 'Alice Johnson',
  email: 'alice@example.com',
  did: 'did:verza:1234567890abcdef',
  type: 'regular',
  status: 'active',
  joinedDate: 'Jan 15, 2023',
  lastLogin: 'Today, 10:23 AM',
  stats: {
    credentials: 12,
    verifications: 45,
    spent: '$120.50'
  }
};

const ACTIVITY_LOG = [
  { id: 1, action: 'Logged in', time: 'Today, 10:23 AM', ip: '192.168.1.1' },
  { id: 2, action: 'Verified Credential: ID Card', time: 'Yesterday, 2:15 PM', ip: '192.168.1.1' },
  { id: 3, action: 'Updated Profile', time: 'Oct 24, 2023', ip: '192.168.1.1' },
  { id: 4, action: 'Failed Login Attempt', time: 'Oct 20, 2023', ip: '10.0.0.5', type: 'warning' },
];

export default function UserDetail() {
  const [, setLocation] = useLocation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Button variant="ghost" className="pl-0 gap-2 hover:bg-transparent hover:text-primary" onClick={() => setLocation('/admin/users')}>
        <ArrowLeft className="w-4 h-4" /> Back to Users
      </Button>

      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-card/80 backdrop-blur-sm border border-border/50 p-6 rounded-lg">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border-4 border-background">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${MOCK_USER.id}`} />
            <AvatarFallback>AJ</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{MOCK_USER.name}</h1>
              <Badge className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20">Active</Badge>
            </div>
            <div className="flex flex-col gap-1 mt-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3" /> {MOCK_USER.email}
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <Shield className="h-3 w-3" /> {MOCK_USER.did}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.info("Edit Profile modal opened")}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast.success("Password reset email sent")}>
            <Lock className="mr-2 h-4 w-4" /> Reset Password
          </Button>
          <Button variant="outline" size="sm" className="text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/10 hover:text-yellow-600" onClick={() => toast.warning("User suspended")}>
            <Ban className="mr-2 h-4 w-4" /> Suspend
          </Button>
          <Button variant="destructive" size="sm" onClick={() => toast.error("User deleted")}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={() => toast.success("Impersonating user session started")}>
             <Eye className="mr-2 h-4 w-4" /> Impersonate
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-card/50 backdrop-blur-sm border border-border/50 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="notes">Admin Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 md:col-span-2">
              <CardHeader>
                <CardTitle>Account Statistics</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-secondary/20 border border-border/50">
                  <div className="text-sm text-muted-foreground mb-1">Total Credentials</div>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    {MOCK_USER.stats.credentials}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-secondary/20 border border-border/50">
                  <div className="text-sm text-muted-foreground mb-1">Verifications</div>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    {MOCK_USER.stats.verifications}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-secondary/20 border border-border/50">
                  <div className="text-sm text-muted-foreground mb-1">Total Spent</div>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-yellow-500" />
                    {MOCK_USER.stats.spent}
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
                  <div className="text-sm font-medium text-muted-foreground">Joined Date</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" /> {MOCK_USER.joinedDate}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Last Login</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Activity className="h-4 w-4" /> {MOCK_USER.lastLogin}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">User Type</div>
                  <div className="capitalize mt-1">{MOCK_USER.type}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Recent user actions and system events.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {ACTIVITY_LOG.map((log) => (
                  <div key={log.id} className="flex items-start gap-4">
                    <div className={`mt-1 h-2 w-2 rounded-full ${log.type === 'warning' ? 'bg-red-500' : 'bg-blue-500'}`} />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{log.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {log.time} • IP: {log.ip}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credentials">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Issued Credentials</CardTitle>
              <CardDescription>Credentials held by this user.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                 {[
                   { id: 'VC-001', title: 'University Degree', issuer: 'University of Tech', date: '2023-06-15', status: 'active' },
                   { id: 'VC-002', title: 'Driver License', issuer: 'State DMV', date: '2023-01-20', status: 'active' },
                   { id: 'VC-003', title: 'Library Card', issuer: 'Public Library', date: '2022-11-05', status: 'expired' },
                 ].map((cred, i) => (
                   <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-secondary/10">
                     <div className="flex items-center gap-4">
                       <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                         <FileText className="h-5 w-5 text-primary" />
                       </div>
                       <div>
                         <p className="font-medium">{cred.title}</p>
                         <p className="text-sm text-muted-foreground">{cred.issuer} • Issued {cred.date}</p>
                       </div>
                     </div>
                     <div className="flex items-center gap-3">
                       <Badge variant={cred.status === 'active' ? 'default' : 'secondary'} className={cred.status === 'active' ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : ''}>
                         {cred.status}
                       </Badge>
                       <Button variant="ghost" size="sm" onClick={() => setLocation(`/admin/credentials/${cred.id}`)}>
                         View
                       </Button>
                     </div>
                   </div>
                 ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Recent financial activity.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: 'TX-123', type: 'Payment', desc: 'Credential Issuance Fee', amount: '-$15.00', date: 'Today, 10:23 AM', status: 'completed' },
                  { id: 'TX-124', type: 'Deposit', desc: 'Wallet Top-up', amount: '+$50.00', date: 'Yesterday, 2:15 PM', status: 'completed' },
                  { id: 'TX-125', type: 'Payment', desc: 'Verification Service', amount: '-$5.00', date: 'Oct 24, 2023', status: 'completed' },
                ].map((tx, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-secondary/10">
                    <div className="flex items-center gap-4">
                       <div className={`h-10 w-10 rounded-full flex items-center justify-center ${tx.amount.startsWith('+') ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                         <CreditCard className={`h-5 w-5 ${tx.amount.startsWith('+') ? 'text-green-500' : 'text-red-500'}`} />
                       </div>
                       <div>
                         <p className="font-medium">{tx.desc}</p>
                         <p className="text-sm text-muted-foreground">{tx.type} • {tx.date}</p>
                       </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${tx.amount.startsWith('+') ? 'text-green-500' : 'text-foreground'}`}>{tx.amount}</p>
                      <span className="text-xs text-muted-foreground capitalize">{tx.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Admin Notes</CardTitle>
              <CardDescription>Internal notes about this user (not visible to user).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="Add a note..." 
                className="min-h-[150px]"
                defaultValue="User requested limit increase on Oct 15. Approved by Supervisor."
              />
              <div className="flex justify-end">
                <Button onClick={() => toast.success("Notes saved successfully")}>Save Notes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
