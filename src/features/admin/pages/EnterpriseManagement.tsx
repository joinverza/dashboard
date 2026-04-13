import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from 'framer-motion';
import { 
  Search, Filter, MoreVertical, Eye, Ban,
  Building, Users, CreditCard, Loader2
} from 'lucide-react';
import { toast } from "sonner";
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
import { Progress } from '@/components/ui/progress';
import { bankingService, getBankingErrorMessage } from '@/services/bankingService';

export default function EnterpriseManagement() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEnterprises, setSelectedEnterprises] = useState<string[]>([]);

  const enterprisesQuery = useQuery({
    queryKey: ["admin", "enterprises", searchTerm, planFilter, statusFilter],
    queryFn: () => bankingService.listEnterprises({ search: searchTerm || undefined, plan: planFilter === "all" ? undefined : planFilter, status: statusFilter === "all" ? undefined : statusFilter, page: 1, limit: 100 }),
  });
  const suspendMutation = useMutation({
    mutationFn: (enterpriseId: string) => bankingService.updateEnterpriseStatus(enterpriseId, "suspended"),
    onSuccess: async () => {
      toast.success("Enterprise status updated.");
      await queryClient.invalidateQueries({ queryKey: ["admin", "enterprises"] });
    },
    onError: (error) => toast.error(getBankingErrorMessage(error, "Failed to update enterprise status")),
  });
  const filteredEnterprises = enterprisesQuery.data?.items ?? [];

  // Selection Logic
  const toggleSelection = (id: string) => {
    if (selectedEnterprises.includes(id)) {
      setSelectedEnterprises(selectedEnterprises.filter(eId => eId !== id));
    } else {
      setSelectedEnterprises([...selectedEnterprises, id]);
    }
  };

  const toggleAllSelection = () => {
    if (selectedEnterprises.length === filteredEnterprises.length) {
      setSelectedEnterprises([]);
    } else {
      setSelectedEnterprises(filteredEnterprises.map(e => e.enterpriseId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-verza-emerald/10 text-verza-emerald border-verza-emerald/20';
      case 'warning': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'suspended': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'Enterprise': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'Pro': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
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
          <h1 className="text-3xl font-bold tracking-tight">Enterprise Management</h1>
          <p className="text-muted-foreground mt-1">Manage enterprise accounts, billing, and API usage.</p>
        </div>
        <div className="flex gap-2">
          {selectedEnterprises.length > 0 && (
            <Button variant="destructive" onClick={() => {
              selectedEnterprises.forEach((enterpriseId) => suspendMutation.mutate(enterpriseId));
              setSelectedEnterprises([]);
            }}>
              Suspend Selected ({selectedEnterprises.length})
            </Button>
          )}
          <Button className="bg-primary hover:bg-primary/90" onClick={() => toast.success("Enterprise onboarding started")}>
            <Building className="mr-2 h-4 w-4" /> Onboard Enterprise
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center bg-card/50 p-4 rounded-lg border border-border/50 backdrop-blur-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search enterprises..."
            className="pl-9 bg-background/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Select value={planFilter} onValueChange={setPlanFilter}>
            <SelectTrigger className="w-[180px] bg-background/50">
              <SelectValue placeholder="Plan Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="Basic">Basic</SelectItem>
              <SelectItem value="Pro">Pro</SelectItem>
              <SelectItem value="Enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-background/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="rounded-md border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
        {enterprisesQuery.isLoading ? <div className="flex justify-center py-10"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div> : null}
        {enterprisesQuery.error ? <div className="text-sm text-red-400 p-4">{getBankingErrorMessage(enterprisesQuery.error, "Failed to load enterprises.")}</div> : null}
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[40px]">
                <input 
                  type="checkbox" 
                  className="rounded border-gray-300"
                  checked={selectedEnterprises.length === filteredEnterprises.length && filteredEnterprises.length > 0}
                  onChange={toggleAllSelection}
                />
              </TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Users</TableHead>
              <TableHead className="w-[200px]">API Usage</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEnterprises.map((ent) => (
              <TableRow key={ent.enterpriseId} className="hover:bg-muted/50">
                <TableCell>
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300"
                    checked={selectedEnterprises.includes(ent.enterpriseId)}
                    onChange={() => toggleSelection(ent.enterpriseId)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {ent.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium">{ent.name}</div>
                      <div className="text-xs text-muted-foreground">Last active: {ent.lastActive ?? "-"}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getPlanBadge(ent.plan)}>
                    {ent.plan}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{ent.users}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Usage</span>
                      <span className={ent.apiUsagePercent > 90 ? 'text-red-500' : 'text-muted-foreground'}>{ent.apiUsagePercent}%</span>
                    </div>
                    <Progress value={ent.apiUsagePercent} className="h-2" indicatorClassName={ent.apiUsagePercent > 90 ? 'bg-red-500' : ent.apiUsagePercent > 75 ? 'bg-yellow-500' : 'bg-verza-emerald'} />
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(ent.status)}>
                    {ent.status}
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
                      <DropdownMenuItem onClick={() => setLocation(`/admin/enterprises/${ent.enterpriseId}`)}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toast.info("Billing information accessed")}>
                        <CreditCard className="mr-2 h-4 w-4" /> Billing Info
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => suspendMutation.mutate(ent.enterpriseId)}>
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
