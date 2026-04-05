import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  UserPlus, MoreVertical, Edit, Trash2, 
  Search, Lock, History, Loader2
} from 'lucide-react';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { bankingService, getBankingErrorMessage } from '@/services/bankingService';

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const adminsQuery = useQuery({
    queryKey: ["admin", "team", searchTerm],
    queryFn: () => bankingService.getUsers({ role: "admin", search: searchTerm || undefined }),
  });
  const activityQuery = useQuery({
    queryKey: ["admin", "team", "activity"],
    queryFn: () => bankingService.getAuditLogs(),
  });
  const resetMutation = useMutation({
    mutationFn: (userId: string) => bankingService.resetAdminUserPassword(userId),
    onSuccess: () => toast.success("Password reset email queued."),
    onError: (error) => toast.error(getBankingErrorMessage(error, "Failed to queue password reset")),
  });
  const removeMutation = useMutation({
    mutationFn: (userId: string) => bankingService.deleteAdminUser(userId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "team"] });
      toast.success("Admin removed.");
    },
    onError: (error) => toast.error(getBankingErrorMessage(error, "Failed to remove admin")),
  });

  // Filter admins based on search term
  const filteredAdmins = adminsQuery.data ?? [];
  const activityLog = (activityQuery.data ?? []).slice(0, 50);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">
            Admin Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage team access and permissions
          </p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => toast.success("Invitation sent to new admin")}>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Admin
        </Button>
      </div>

      <Tabs defaultValue="team" className="space-y-6">
        <TabsList>
          <TabsTrigger value="team">Team Members</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="team">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <CardTitle>Team Members</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search admins..." 
                      className="pl-8 w-[250px]" 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {adminsQuery.isLoading ? <div className="flex justify-center py-10"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div> : null}
              {adminsQuery.error ? <div className="text-sm text-red-400 mb-4">{getBankingErrorMessage(adminsQuery.error, "Failed to load admin users.")}</div> : null}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdmins.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>{admin.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">{admin.name}</span>
                            <span className="text-xs text-muted-foreground">{admin.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-purple-500/20 text-purple-500">
                          {admin.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={admin.status === 'active' ? 'default' : 'secondary'}
                          className={admin.status === 'active' ? 'bg-verza-emerald/10 text-verza-emerald hover:bg-verza-emerald/20' : ''}
                        >
                          {admin.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{admin.lastActive ?? "-"}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => toast.info(`Editing role for ${admin.name}`)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit Role
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.success(`Password reset email sent to ${admin.email}`)}>
                              <Lock className="mr-2 h-4 w-4" /> Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => resetMutation.mutate(admin.id)}>
                              <Lock className="mr-2 h-4 w-4" /> Queue Reset (API)
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500" onClick={() => removeMutation.mutate(admin.id)}>
                              <Trash2 className="mr-2 h-4 w-4" /> Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Admin Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              {activityQuery.error ? <div className="text-sm text-red-400 mb-4">{getBankingErrorMessage(activityQuery.error, "Failed to load admin activity.")}</div> : null}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Admin</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activityLog.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.actor ?? log.actorId}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <History className="h-4 w-4 text-muted-foreground" />
                          {log.action}
                        </div>
                      </TableCell>
                      <TableCell>{log.targetId ?? log.resourceId}</TableCell>
                      <TableCell className="text-muted-foreground">{typeof log.details === "string" ? log.details : JSON.stringify(log.details ?? {})}</TableCell>
                      <TableCell className="text-right">{new Date(log.timestamp).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
