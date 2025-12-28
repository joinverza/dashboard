import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Plus, MoreHorizontal, Shield, 
  Trash2, Settings 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Link } from 'wouter';

// Mock data for team members
const TEAM_MEMBERS = [
  { 
    id: "TM-001", 
    name: "Alex Johnson", 
    email: "alex.j@company.com", 
    role: "Admin", 
    status: "active",
    lastActive: "2 mins ago",
    avatar: "/avatars/alex.jpg"
  },
  { 
    id: "TM-002", 
    name: "Sarah Connor", 
    email: "sarah.c@company.com", 
    role: "Manager", 
    status: "active",
    lastActive: "1 hour ago",
    avatar: "/avatars/sarah.jpg"
  },
  { 
    id: "TM-003", 
    name: "Mike Chen", 
    email: "mike.c@company.com", 
    role: "Analyst", 
    status: "away",
    lastActive: "3 days ago",
    avatar: "/avatars/mike.jpg"
  },
  { 
    id: "TM-004", 
    name: "Emily Davis", 
    email: "emily.d@company.com", 
    role: "Viewer", 
    status: "invited",
    lastActive: "Never",
    avatar: null
  },
  { 
    id: "TM-005", 
    name: "James Wilson", 
    email: "james.w@company.com", 
    role: "Analyst", 
    status: "suspended",
    lastActive: "2 weeks ago",
    avatar: "/avatars/james.jpg"
  }
];

export default function TeamManagement() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = TEAM_MEMBERS.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'away': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'invited': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'suspended': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Admin': return <Shield className="h-3 w-3 mr-1" />;
      case 'Manager': return <Settings className="h-3 w-3 mr-1" />;
      default: return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Team Management</h1>
          <p className="text-muted-foreground">Manage your team members, roles, and access permissions.</p>
        </div>
        <div className="flex gap-2">
            <Link href="/enterprise/team/invite">
                <Button className="bg-verza-primary hover:bg-verza-primary/90 text-white shadow-glow">
                    <Plus className="mr-2 h-4 w-4" /> Invite Member
                </Button>
            </Link>
        </div>
      </div>

      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Team Members ({filteredMembers.length})</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/50 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      No team members found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => (
                    <TableRow key={member.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-border/50">
                            <AvatarImage src={member.avatar || undefined} />
                            <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{member.name}</span>
                            <span className="text-xs text-muted-foreground">{member.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                            {getRoleIcon(member.role)}
                            <span className="text-sm">{member.role}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(member.status)}>
                          {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{member.lastActive}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Link href={`/enterprise/team/${member.id}`}>
                                <DropdownMenuItem>View Profile</DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem>Edit Role</DropdownMenuItem>
                            <DropdownMenuItem>Resend Invitation</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500">
                                <Trash2 className="mr-2 h-4 w-4" /> Remove Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
