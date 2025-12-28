import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Filter, MoreVertical, Eye, Ban, 
  Shield, UserCheck, Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocation } from 'wouter';

// Mock Data
const MOCK_VERIFIERS = [
  {
    id: '1',
    name: 'VeriTech Solutions',
    type: 'organization',
    credentialsIssued: 15420,
    reputation: 98,
    status: 'active',
    lastActive: '2 mins ago',
    verificationLevel: 'Gold'
  },
  {
    id: '2',
    name: 'John Doe Notary',
    type: 'individual',
    credentialsIssued: 342,
    reputation: 95,
    status: 'active',
    lastActive: '1 hour ago',
    verificationLevel: 'Silver'
  },
  {
    id: '3',
    name: 'Global ID Services',
    type: 'organization',
    credentialsIssued: 45210,
    reputation: 99,
    status: 'active',
    lastActive: '5 mins ago',
    verificationLevel: 'Platinum'
  },
  {
    id: '4',
    name: 'QuickVerify Inc.',
    type: 'organization',
    credentialsIssued: 120,
    reputation: 85,
    status: 'pending',
    lastActive: '1 day ago',
    verificationLevel: 'Bronze'
  },
  {
    id: '5',
    name: 'Suspicious Verifier',
    type: 'individual',
    credentialsIssued: 15,
    reputation: 40,
    status: 'suspended',
    lastActive: '1 week ago',
    verificationLevel: 'None'
  },
];

export default function VerifierManagement() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedVerifiers, setSelectedVerifiers] = useState<string[]>([]);

  // Filter Logic
  const filteredVerifiers = MOCK_VERIFIERS.filter(verifier => {
    const matchesSearch = verifier.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || verifier.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || verifier.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Selection Logic
  const toggleSelection = (id: string) => {
    if (selectedVerifiers.includes(id)) {
      setSelectedVerifiers(selectedVerifiers.filter(vId => vId !== id));
    } else {
      setSelectedVerifiers([...selectedVerifiers, id]);
    }
  };

  const toggleAllSelection = () => {
    if (selectedVerifiers.length === filteredVerifiers.length) {
      setSelectedVerifiers([]);
    } else {
      setSelectedVerifiers(filteredVerifiers.map(v => v.id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'suspended': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
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
          <h1 className="text-3xl font-bold tracking-tight">Verifier Management</h1>
          <p className="text-muted-foreground mt-1">Manage verifiers, reviews, and reputation scores.</p>
        </div>
        <div className="flex gap-2">
          {selectedVerifiers.length > 0 && (
            <Button variant="destructive">
              Suspend Selected ({selectedVerifiers.length})
            </Button>
          )}
          <Button className="bg-primary hover:bg-primary/90">
            <UserCheck className="mr-2 h-4 w-4" /> Approve New Verifier
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-card/50 p-4 rounded-lg border border-border/50 backdrop-blur-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search verifiers..."
            className="pl-9 bg-background/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px] bg-background/50">
              <SelectValue placeholder="Verifier Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="organization">Organization</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-background/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-md border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[40px]">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300"
                  checked={selectedVerifiers.length === filteredVerifiers.length && filteredVerifiers.length > 0}
                  onChange={toggleAllSelection}
                />
              </TableHead>
              <TableHead>Verifier Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Credentials Issued</TableHead>
              <TableHead>Reputation</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVerifiers.map((verifier) => (
              <TableRow key={verifier.id} className="hover:bg-muted/50">
                <TableCell>
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300"
                    checked={selectedVerifiers.includes(verifier.id)}
                    onChange={() => toggleSelection(verifier.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {verifier.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{verifier.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        Level: {verifier.verificationLevel}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {verifier.type === 'organization' ? (
                      <Building className="h-4 w-4 text-blue-500" />
                    ) : (
                      <UserCheck className="h-4 w-4 text-purple-500" />
                    )}
                    <span className="capitalize">{verifier.type}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{verifier.credentialsIssued.toLocaleString()}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${verifier.reputation > 90 ? 'bg-green-500' : verifier.reputation > 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${verifier.reputation}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{verifier.reputation}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(verifier.status)}>
                    {verifier.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => setLocation(`/admin/verifiers/${verifier.id}`)}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Shield className="mr-2 h-4 w-4" /> Audit Logs
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600 focus:text-red-600">
                        <Ban className="mr-2 h-4 w-4" /> Suspend
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
