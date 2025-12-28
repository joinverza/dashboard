import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, FileText, MessageSquare, MoreHorizontal, Search, Filter, Calendar as CalendarIcon } from "lucide-react";
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

// Mock Data
const ACTIVE_JOBS = [
  {
    id: "101",
    type: "Identity Verification",
    requester: "Sarah C.",
    deadline: "1 hour",
    status: "in_progress",
    progress: 60,
    started: "30 mins ago"
  },
  {
    id: "102",
    type: "Employment Check",
    requester: "MegaCorp",
    deadline: "5 hours",
    status: "in_progress",
    progress: 30,
    started: "2 hours ago"
  },
  {
    id: "103",
    type: "Degree Verification",
    requester: "University X",
    deadline: "Overdue",
    status: "overdue",
    progress: 90,
    started: "2 days ago"
  },
  {
    id: "104",
    type: "Criminal Record",
    requester: "Law Office",
    deadline: "2 hours",
    status: "pending_review",
    progress: 100,
    started: "4 hours ago"
  }
];

export default function ActiveJobs() {
  const [activeTab, setActiveTab] = useState("in_progress");
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);

  const filteredJobs = ACTIVE_JOBS.filter(job => {
    if (activeTab === "in_progress") return job.status === "in_progress";
    if (activeTab === "pending_review") return job.status === "pending_review";
    if (activeTab === "overdue") return job.status === "overdue";
    return true;
  });

  const toggleSelectAll = () => {
    if (selectedJobs.length === filteredJobs.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(filteredJobs.map(j => j.id));
    }
  };

  const handleSelectJob = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedJobs(prev => [...prev, id]);
    } else {
      setSelectedJobs(prev => prev.filter(jobId => jobId !== id));
    }
  };

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
            <Button size="sm" variant="ghost" className="text-verza-emerald hover:text-verza-emerald hover:bg-verza-emerald/10">Mark Complete</Button>
            <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-500/10">Cancel Jobs</Button>
          </div>
        )}
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search active jobs..." className="pl-9 bg-card/50" />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
             <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[180px] bg-card/50">
                    <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="identity">Identity</SelectItem>
                    <SelectItem value="employment">Employment</SelectItem>
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
  jobs: typeof ACTIVE_JOBS, 
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

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <motion.div
          key={job.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className={`bg-card/80 backdrop-blur-sm border-border/50 transition-colors ${selectedJobs.includes(job.id) ? 'border-verza-emerald/50 bg-verza-emerald/5' : ''}`}>
            <CardContent className="p-6">
              <div className="flex gap-4 items-start">
                <div className="pt-1">
                  <Checkbox 
                    checked={selectedJobs.includes(job.id)}
                    onCheckedChange={(checked) => onSelectJob(job.id, checked as boolean)}
                  />
                </div>
                
                <div className="flex-1 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${
                      job.status === 'overdue' ? 'bg-red-500/10 text-red-500' : 
                      job.status === 'pending_review' ? 'bg-yellow-500/10 text-yellow-500' : 
                      'bg-verza-emerald/10 text-verza-emerald'
                    }`}>
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{job.type}</h3>
                      <p className="text-sm text-muted-foreground">Requester: {job.requester}</p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Started: {job.started}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 md:max-w-xs w-full space-y-2">
                     <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{job.progress}%</span>
                     </div>
                     <Progress value={job.progress} className="h-2" />
                     <p className={`text-xs ${job.status === 'overdue' ? 'text-red-500 font-bold' : 'text-muted-foreground'}`}>
                        Deadline: {job.deadline}
                     </p>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0">
                    <Button className="flex-1 md:flex-none bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow">
                      Continue
                    </Button>
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
