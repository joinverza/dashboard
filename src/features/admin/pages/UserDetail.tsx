import { motion } from 'framer-motion';
import { useMutation, useQueries } from "@tanstack/react-query";
import { 
  Mail, Calendar, Shield, Activity, 
  CreditCard, FileText, Lock, Ban, Edit, 
  Trash2, Eye, ArrowLeft, Loader2
} from 'lucide-react';
import { useLocation, useRoute } from "wouter";
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { bankingService, getBankingErrorMessage } from '@/services/bankingService';
import { useState } from 'react';

export default function UserDetail() {
  const [match, params] = useRoute("/admin/users/:id");
  const [, setLocation] = useLocation();
  const [notes, setNotes] = useState("");
  const userId = params?.id ?? "";
  const detailEnabled = match && Boolean(userId);

  const [userQuery, activityQuery, credentialsQuery, transactionsQuery] = useQueries({
    queries: [
      {
        queryKey: ["admin", "user-detail", userId],
        queryFn: () => bankingService.getAdminUserDetails(userId),
        enabled: detailEnabled,
      },
      {
        queryKey: ["admin", "user-detail", userId, "activity"],
        queryFn: () => bankingService.listUserActivity(userId),
        enabled: detailEnabled,
      },
      {
        queryKey: ["admin", "user-detail", userId, "credentials"],
        queryFn: () => bankingService.listUserCredentials(userId),
        enabled: detailEnabled,
      },
      {
        queryKey: ["admin", "user-detail", userId, "transactions"],
        queryFn: () => bankingService.listUserTransactions(userId),
        enabled: detailEnabled,
      },
    ],
  });

  const suspendMutation = useMutation({
    mutationFn: () => bankingService.updateAdminUserStatus(userId, "suspended"),
    onSuccess: () => toast.success("User suspended."),
    onError: (error) => toast.error(getBankingErrorMessage(error, "Failed to suspend user")),
  });
  const deleteMutation = useMutation({
    mutationFn: () => bankingService.deleteAdminUser(userId),
    onSuccess: () => {
      toast.success("User deleted.");
      setLocation("/admin/users");
    },
    onError: (error) => toast.error(getBankingErrorMessage(error, "Failed to delete user")),
  });
  const resetMutation = useMutation({
    mutationFn: () => bankingService.resetAdminUserPassword(userId),
    onSuccess: () => toast.success("Password reset queued."),
    onError: (error) => toast.error(getBankingErrorMessage(error, "Failed to queue password reset")),
  });
  const impersonateMutation = useMutation({
    mutationFn: () => bankingService.impersonateAdminUser(userId),
    onSuccess: () => toast.success("Impersonation session started."),
    onError: (error) => toast.error(getBankingErrorMessage(error, "Failed to impersonate user")),
  });

  if (!detailEnabled) return null;

  if (userQuery.isLoading) {
    return <div className="h-[50vh] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }
  if (userQuery.error || !userQuery.data) {
    return <div className="text-sm text-red-400">{getBankingErrorMessage(userQuery.error, "Failed to load user profile.")}</div>;
  }
  const user = userQuery.data;
  const activity = activityQuery.data ?? [];
  const credentials = credentialsQuery.data ?? [];
  const transactions = transactionsQuery.data ?? [];

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
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} />
            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <Badge className={user.status === "active" ? "bg-verza-emerald/10 text-verza-emerald border-verza-emerald/20 hover:bg-verza-emerald/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"}>{user.status}</Badge>
            </div>
            <div className="flex flex-col gap-1 mt-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3" /> {user.email}
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <Shield className="h-3 w-3" /> {user.did ?? "-"}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.info("Use dedicated edit endpoint/UI to update profile fields.")}>
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button variant="outline" size="sm" onClick={() => resetMutation.mutate()} disabled={resetMutation.isPending}>
            <Lock className="mr-2 h-4 w-4" /> Reset Password
          </Button>
          <Button variant="outline" size="sm" className="text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/10 hover:text-yellow-600" onClick={() => suspendMutation.mutate()} disabled={suspendMutation.isPending}>
            <Ban className="mr-2 h-4 w-4" /> Suspend
          </Button>
          <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}>
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
          <Button size="sm" className="bg-purple-600 hover:bg-purple-700" onClick={() => impersonateMutation.mutate()} disabled={impersonateMutation.isPending}>
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
                    {user.stats?.credentials ?? credentials.length}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-secondary/20 border border-border/50">
                  <div className="text-sm text-muted-foreground mb-1">Verifications</div>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    <Shield className="h-5 w-5 text-verza-emerald" />
                    {user.stats?.verifications ?? 0}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-secondary/20 border border-border/50">
                  <div className="text-sm text-muted-foreground mb-1">Total Spent</div>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-yellow-500" />
                    {user.stats?.spent ?? "$0.00"}
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
                    <Calendar className="h-4 w-4" /> {new Date(user.joinedAt).toLocaleDateString()}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Last Login</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Activity className="h-4 w-4" /> {user.lastActive ?? "-"}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">User Type</div>
                  <div className="capitalize mt-1">{user.role}</div>
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
                {activity.map((log) => (
                  <div key={log.id} className="flex items-start gap-4">
                    <div className={`mt-1 h-2 w-2 rounded-full ${log.type === 'warning' ? 'bg-red-500' : 'bg-blue-500'}`} />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{log.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()} • IP: {log.ip ?? "unknown"}
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
                 {credentials.map((cred) => (
                   <div key={cred.credentialId} className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-secondary/10">
                     <div className="flex items-center gap-4">
                       <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                         <FileText className="h-5 w-5 text-primary" />
                       </div>
                       <div>
                         <p className="font-medium">{cred.type}</p>
                         <p className="text-sm text-muted-foreground">{cred.issuer} • Issued {new Date(cred.issuedAt).toLocaleDateString()}</p>
                       </div>
                     </div>
                     <div className="flex items-center gap-3">
                       <Badge variant={cred.status === 'active' ? 'default' : 'secondary'} className={cred.status === 'active' ? 'bg-verza-emerald/10 text-verza-emerald hover:bg-verza-emerald/20' : ''}>
                         {cred.status}
                       </Badge>
                       <Button variant="ghost" size="sm" onClick={() => setLocation(`/admin/credentials/${cred.credentialId}`)}>
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
                {transactions.map((tx) => (
                  <div key={tx.transactionId} className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-secondary/10">
                    <div className="flex items-center gap-4">
                       <div className={`h-10 w-10 rounded-full flex items-center justify-center ${tx.direction === "in" ? 'bg-verza-emerald/10' : 'bg-red-500/10'}`}>
                         <CreditCard className={`h-5 w-5 ${tx.direction === "in" ? 'text-verza-emerald' : 'text-red-500'}`} />
                       </div>
                       <div>
                         <p className="font-medium">{tx.description}</p>
                         <p className="text-sm text-muted-foreground">{tx.category} • {new Date(tx.createdAt).toLocaleString()}</p>
                       </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${tx.direction === "in" ? 'text-verza-emerald' : 'text-foreground'}`}>
                        {tx.direction === "in" ? "+" : "-"} {tx.amount.toFixed(2)} {tx.currency}
                      </p>
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
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <div className="flex justify-end">
                <Button onClick={() => toast.info("Admin notes persistence endpoint is not yet available.")}>Save Notes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
