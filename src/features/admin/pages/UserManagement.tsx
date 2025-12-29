import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, MoreHorizontal, User, 
  Shield, Building2, Ban, Trash2, Mail,
  Download
} from 'lucide-react';
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserData {
  id: string;
  name: string;
  email: string;
  did: string;
  type: 'regular' | 'verifier' | 'enterprise' | 'admin';
  status: 'active' | 'suspended' | 'banned';
  joinedDate: string;
  lastActive: string;
}

const MOCK_USERS: UserData[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    did: 'did:verza:123...456',
    type: 'regular',
    status: 'active',
    joinedDate: '2023-01-15',
    lastActive: '2 mins ago',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob@verifier.com',
    did: 'did:verza:789...012',
    type: 'verifier',
    status: 'active',
    joinedDate: '2023-02-20',
    lastActive: '1 hour ago',
  },
  {
    id: '3',
    name: 'Acme Corp',
    email: 'admin@acme.com',
    did: 'did:verza:enterprise:345...678',
    type: 'enterprise',
    status: 'active',
    joinedDate: '2023-03-10',
    lastActive: '1 day ago',
  },
  {
    id: '4',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    did: 'did:verza:901...234',
    type: 'regular',
    status: 'suspended',
    joinedDate: '2023-04-05',
    lastActive: '5 days ago',
  },
  {
    id: '5',
    name: 'Global Verify Ltd',
    email: 'contact@globalverify.com',
    did: 'did:verza:verifier:567...890',
    type: 'verifier',
    status: 'banned',
    joinedDate: '2023-01-20',
    lastActive: '1 month ago',
  },
];

export default function UserManagement() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const filteredUsers = MOCK_USERS.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.did.includes(searchTerm);
    
    const matchesType = typeFilter === 'all' || user.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const toggleUserSelection = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const toggleAllSelection = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'verifier': return <Shield className="h-4 w-4 text-purple-500" />;
      case 'enterprise': return <Building2 className="h-4 w-4 text-blue-500" />;
      case 'admin': return <Shield className="h-4 w-4 text-red-500" />;
      default: return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>;
      case 'suspended': return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Suspended</Badge>;
      case 'banned': return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Banned</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage all users, verifiers, and enterprise accounts.</p>
        </div>
        <div className="flex gap-2">
           {selectedUsers.length > 0 && (
             <Button variant="destructive" size="sm" onClick={() => {
               toast.success(`${selectedUsers.length} users deleted successfully`);
               setSelectedUsers([]);
             }}>
               <Trash2 className="mr-2 h-4 w-4" /> Delete ({selectedUsers.length})
             </Button>
           )}
           <Button variant="outline" size="sm" onClick={() => toast.success("User list exported to CSV")}>
             <Download className="mr-2 h-4 w-4" /> Export
           </Button>
           <Button size="sm" onClick={() => toast.success("Notification sent to all filtered users")}>
             <Mail className="mr-2 h-4 w-4" /> Send Notification
           </Button>
        </div>
      </div>

      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-medium">Users</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name, email, or DID..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="User Type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="regular">Regular User</SelectItem>
                  <SelectItem value="verifier">Verifier</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="banned">Banned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/50">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={toggleAllSelection}
                    />
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} />
                            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">{user.name}</span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(user.type)}
                          <span className="capitalize">{user.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{user.joinedDate}</TableCell>
                      <TableCell>{user.lastActive}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setLocation(`/admin/users/${user.id}`)}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.info("Edit Profile modal opened")}>
                              Edit Profile
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-yellow-500" onClick={() => toast.warning("User suspended")}>
                              <Ban className="mr-2 h-4 w-4" /> Suspend User
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500" onClick={() => toast.error("User deleted")}>
                              <Trash2 className="mr-2 h-4 w-4" /> Delete User
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
          
          {/* Pagination (Mock) */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing <strong>{filteredUsers.length}</strong> of <strong>{MOCK_USERS.length}</strong> users
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
