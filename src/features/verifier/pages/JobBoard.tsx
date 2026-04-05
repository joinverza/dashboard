import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Search, Clock, ShieldCheck, MapPin, ChevronRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { bankingService, getBankingErrorMessage } from "@/services/bankingService";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function JobBoard() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const jobsQuery = useQuery({
    queryKey: ["verifier", "jobs", "board"],
    queryFn: () => bankingService.getVerificationRequests({ limit: 200 }),
  });

  const acceptJobMutation = useMutation({
    mutationFn: (verificationId: string) => bankingService.updateVerificationStatus(verificationId, "in_progress"),
    onSuccess: async () => {
      toast.success("Job accepted.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["verifier", "jobs"] }),
        queryClient.invalidateQueries({ queryKey: ["verifier", "history"] }),
      ]);
    },
    onError: (error) => toast.error(getBankingErrorMessage(error, "Failed to accept job")),
  });

  const filteredJobs = useMemo(() => {
    const jobs = (jobsQuery.data ?? []).filter((req) => req.status === "review_needed" || req.status === "pending");
    return jobs.filter((job) => {
      const matchesSearch =
        job.verificationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Boolean(job.details?.firstName && job.details.firstName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = filterType === "all" || job.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [jobsQuery.data, searchTerm, filterType]);

  const getUrgency = (type: string) => {
    if (type.includes('sanctions') || type.includes('pep')) return 'High';
    return 'Medium';
  };

  const handleJobClick = (id: string) => {
    setLocation(`/verifier/jobs/${id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Job Board</h1>
          <p className="text-muted-foreground">Find and accept new verification tasks.</p>
        </div>
        <Button variant="outline" onClick={() => void jobsQuery.refetch()} disabled={jobsQuery.isFetching}>
          {jobsQuery.isFetching ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Refresh
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search jobs..." 
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Job Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="kyc_individual">Identity</SelectItem>
            <SelectItem value="document_verification">Document</SelectItem>
            <SelectItem value="biometric_liveness">Biometric</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobsQuery.isLoading ? (
           <div className="col-span-full flex justify-center py-10">
             <Loader2 className="h-8 w-8 animate-spin text-primary" />
           </div>
        ) : jobsQuery.error ? (
          <div className="col-span-full text-center py-10 text-red-400">
            {getBankingErrorMessage(jobsQuery.error, "Failed to load available jobs.")}
          </div>
        ) : filteredJobs.length === 0 ? (
           <div className="col-span-full text-center py-10 text-muted-foreground">
             No available jobs found.
           </div>
        ) : (
          filteredJobs.map((job) => (
            <Card 
              key={job.verificationId} 
              className="hover:border-verza-primary/50 transition-colors cursor-pointer group"
              onClick={() => handleJobClick(job.verificationId)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="mb-2 bg-blue-500/10 text-blue-500 border-blue-500/20">
                    {job.type.replace(/_/g, ' ')}
                  </Badge>
                  <Badge variant="secondary" className={
                    getUrgency(job.type) === 'High' ? "bg-red-500/10 text-red-500 border-red-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                  }>
                    {getUrgency(job.type)} Urgency
                  </Badge>
                </div>
                <CardTitle className="text-lg">
                  {job.details?.firstName ? `${job.details.firstName} ${job.details.lastName}` : 'Unknown Subject'}
                </CardTitle>
                <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" /> Posted {new Date(job.createdAt).toLocaleTimeString()}
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Risk: Low</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>Global</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border/50 flex justify-between items-center">
                  <span className="text-lg font-bold text-verza-emerald">$15.00</span>
                  <span className="text-xs text-muted-foreground">Est. time: 10m</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full group-hover:bg-verza-primary transition-colors"
                  disabled={acceptJobMutation.isPending}
                  onClick={(e) => {
                    e.stopPropagation();
                    acceptJobMutation.mutate(job.verificationId);
                  }}
                >
                  Accept Job <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </motion.div>
  );
}
