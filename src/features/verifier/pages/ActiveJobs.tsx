import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Clock, FileText, MessageSquare, MoreHorizontal, Search, Filter, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { bankingService } from "@/services/bankingService";
import type { VerificationRequestResponse } from "@/types/banking";
import { toast } from "sonner";
import { Link } from "wouter";
import { getBankingErrorMessage } from "@/services/bankingService";

export default function ActiveJobs() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("in_progress");
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const jobsQuery = useQuery({
    queryKey: ["verifier", "jobs", "active"],
    queryFn: () => bankingService.getVerificationRequests({ limit: 300 }),
  });

  const updateBulkMutation = useMutation({
    mutationFn: async (payload: { ids: string[]; status: VerificationRequestResponse["status"] }) =>
      Promise.all(payload.ids.map((id) => bankingService.updateVerificationStatus(id, payload.status))),
    onSuccess: async () => {
      toast.success("Job statuses updated.");
      setSelectedJobs([]);
      await queryClient.invalidateQueries({ queryKey: ["verifier", "jobs"] });
    },
    onError: (error) => toast.error(getBankingErrorMessage(error, "Failed to update selected jobs")),
  });

  const filteredJobs = useMemo(() => {
    const jobs = (jobsQuery.data ?? []).filter((req) => ["pending", "in_progress", "review_needed"].includes(req.status));
    return jobs.filter((job) => {
      const requesterName = job.details?.firstName ? `${job.details.firstName} ${job.details.lastName}` : "";
      const matchesSearch =
        !search ||
        job.verificationId.toLowerCase().includes(search.toLowerCase()) ||
        requesterName.toLowerCase().includes(search.toLowerCase());
      if (!matchesSearch) return false;
      if (activeTab === "in_progress") return job.status === "in_progress" || job.status === "pending";
      if (activeTab === "pending_review") return job.status === "review_needed";
      if (activeTab === "overdue") {
        const createdAt = new Date(job.createdAt);
        const now = new Date();
        const diffInHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
        return diffInHours > 24 && (job.status === "pending" || job.status === "in_progress" || job.status === "review_needed");
      }
      return true;
    });
  }, [jobsQuery.data, activeTab, search]);

  const toggleSelectAll = () => {
    if (selectedJobs.length === filteredJobs.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(filteredJobs.map(j => j.verificationId));
    }
  };

  const handleSelectJob = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedJobs(prev => [...prev, id]);
    } else {
      setSelectedJobs(prev => prev.filter(jobId => jobId !== id));
    }
  };

  if (jobsQuery.isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Active Jobs</h1>
          <p className="text-muted-foreground">Manage your current verification tasks.</p>
        </div>
        {selectedJobs.length > 0 && (
          <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg animate-in fade-in">
            <span className="text-sm font-medium">{selectedJobs.length} selected</span>
            <Button
              size="sm"
              variant="ghost"
              className="text-verza-emerald hover:text-verza-emerald hover:bg-verza-emerald/10"
              disabled={updateBulkMutation.isPending}
              onClick={() => updateBulkMutation.mutate({ ids: selectedJobs, status: "verified" })}
            >
              Mark Complete
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
              disabled={updateBulkMutation.isPending}
              onClick={() => updateBulkMutation.mutate({ ids: selectedJobs, status: "rejected" })}
            >
              Cancel Jobs
            </Button>
          </div>
        )}
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search active jobs..." className="pl-9 bg-card/50" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
             <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[180px] bg-card/50">
                    <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="kyc_individual">Identity</SelectItem>
                    <SelectItem value="document_verification">Document</SelectItem>
                </SelectContent>
             </Select>
             <Button variant="outline" size="icon" className="bg-card/50">
                <CalendarIcon className="h-4 w-4" />
             </Button>
             <Button variant="outline" size="icon" className="bg-card/50">
                <Filter className="h-4 w-4" />
             </Button>
        </div>
      </div>

      <Tabs defaultValue="in_progress" onValueChange={setActiveTab} className="w-full">
        {jobsQuery.error ? <div className="text-sm text-red-400 mb-3">{getBankingErrorMessage(jobsQuery.error, "Failed to load active jobs.")}</div> : null}
        <div className="flex items-center justify-between mb-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="pending_review">Pending Review</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
          </TabsList>
          
          <div className="hidden md:flex items-center gap-2">
            <Checkbox 
              id="select-all" 
              checked={selectedJobs.length === filteredJobs.length && filteredJobs.length > 0}
              onCheckedChange={toggleSelectAll}
            />
            <label htmlFor="select-all" className="text-sm text-muted-foreground cursor-pointer select-none">Select All</label>
          </div>
        </div>
        
        <TabsContent value="in_progress">
           <JobsList jobs={filteredJobs} selectedJobs={selectedJobs} onSelectJob={handleSelectJob} />
        </TabsContent>
        <TabsContent value="pending_review">
           <JobsList jobs={filteredJobs} selectedJobs={selectedJobs} onSelectJob={handleSelectJob} />
        </TabsContent>
        <TabsContent value="overdue">
           <JobsList jobs={filteredJobs} selectedJobs={selectedJobs} onSelectJob={handleSelectJob} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

function JobsList({ 
  jobs, 
  selectedJobs, 
  onSelectJob 
}: { 
  jobs: VerificationRequestResponse[], 
  selectedJobs: string[], 
  onSelectJob: (id: string, checked: boolean) => void 
}) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No jobs found in this category.
      </div>
    );
  }

  const getTypeLabel = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <motion.div
          key={job.verificationId}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className={`bg-card/80 backdrop-blur-sm border-border/50 transition-colors ${selectedJobs.includes(job.verificationId) ? 'border-verza-emerald/50 bg-verza-emerald/5' : ''}`}>
            <CardContent className="p-6">
              <div className="flex gap-4 items-start">
                <div className="pt-1">
                  <Checkbox 
                    checked={selectedJobs.includes(job.verificationId)}
                    onCheckedChange={(checked) => onSelectJob(job.verificationId, checked as boolean)}
                  />
                </div>
                
                <div className="flex-1 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${
                      job.status === 'review_needed' ? 'bg-yellow-500/10 text-yellow-500' : 
                      'bg-verza-emerald/10 text-verza-emerald'
                    }`}>
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{getTypeLabel(job.type)}</h3>
                      <p className="text-sm text-muted-foreground">
                        Requester: {job.details?.firstName ? `${job.details.firstName} ${job.details.lastName}` : 'Unknown Subject'}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Started: {new Date(job.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 md:max-w-xs w-full space-y-2">
                     <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{job.status === 'review_needed' ? '90' : '50'}%</span>
                     </div>
                     <Progress value={job.status === 'review_needed' ? 90 : 50} className="h-2" />
                     <p className="text-xs text-muted-foreground">
                        Deadline: 2 hours
                     </p>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0">
                    <Link href={`/verifier/jobs/${job.verificationId}`}>
                        <Button className="flex-1 md:flex-none bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow">
                        Continue
                        </Button>
                    </Link>
                    <Button variant="outline" size="icon">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Request Extension</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500">Report Issue</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
