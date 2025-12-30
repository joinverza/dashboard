import { useState } from 'react';
import { 
  UserPlus, MoreVertical, Edit, Trash2, 
  Search, Lock, History
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

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock Data
  const adminUsers = [
    { 
      id: 'ADM-001', 
      name: 'Sarah Connor', 
      email: 'sarah@verza.io', 
      role: 'Super Admin', 
      status: 'active', 
      lastLogin: '2 mins ago', 
      avatar: 'SC'
    },
    { 
      id: 'ADM-002', 
      name: 'John Smith', 
      email: 'john@verza.io', 
      role: 'Admin', 
      status: 'active', 
      lastLogin: '1 hour ago', 
      avatar: 'JS'
    },
    { 
      id: 'ADM-003', 
      name: 'Emily Chen', 
      email: 'emily@verza.io', 
      role: 'Moderator', 
      status: 'inactive', 
      lastLogin: '3 days ago', 
      avatar: 'EC'
    },
    { 
      id: 'ADM-004', 
      name: 'Michael Brown', 
      email: 'mike@verza.io', 
      role: 'Support', 
      status: 'active', 
      lastLogin: '5 hours ago', 
      avatar: 'MB'
    },
  ];

  // Filter admins based on search term
  const filteredAdmins = adminUsers.filter(admin => 
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activityLog = [
    { id: 1, admin: 'Sarah Connor', action: 'Suspended User', target: 'Alice Johnson', date: '2 mins ago', details: 'Violation of terms' },
    { id: 2, admin: 'John Smith', action: 'Approved Verifier', target: 'VeriTech Solutions', date: '1 hour ago', details: 'Documents verified' },
    { id: 3, admin: 'Sarah Connor', action: 'Updated Settings', target: 'Platform Fee', date: '5 hours ago', details: 'Changed from 2% to 1.5%' },
    { id: 4, admin: 'Emily Chen', action: 'Deleted Post', target: 'Spam Content', date: '1 day ago', details: 'Reported by users' },
    { id: 5, admin: 'Michael Brown', action: 'Resolved Dispute', target: 'DSP-2025-001', date: '2 days ago', details: 'Refund issued' },
  ];

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
                            <AvatarFallback>{admin.avatar}</AvatarFallback>
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
                          className={admin.status === 'active' ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' : ''}
                        >
                          {admin.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{admin.lastLogin}</TableCell>
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
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500" onClick={() => toast.warning(`${admin.name} removed from admin team`)}>
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
                      <TableCell className="font-medium">{log.admin}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <History className="h-4 w-4 text-muted-foreground" />
                          {log.action}
                        </div>
                      </TableCell>
                      <TableCell>{log.target}</TableCell>
                      <TableCell className="text-muted-foreground">{log.details}</TableCell>
                      <TableCell className="text-right">{log.date}</TableCell>
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
