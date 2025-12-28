import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Clock, ShieldCheck, MapPin, ChevronRight } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock Data
const JOBS = [
  {
    id: "1",
    type: "Identity Verification",
    requester: "John D.",
    price: 15.00,
    urgency: "High",
    deadline: "2 hours",
    riskScore: "Low",
    location: "USA",
    postedTime: "10 mins ago"
  },
  {
    id: "2",
    type: "Employment Check",
    requester: "Tech Corp",
    price: 45.00,
    urgency: "Medium",
    deadline: "24 hours",
    riskScore: "Low",
    location: "Remote",
    postedTime: "1 hour ago"
  },
  {
    id: "3",
    type: "Education Verification",
    requester: "Alice M.",
    price: 25.00,
    urgency: "Low",
    deadline: "48 hours",
    riskScore: "Medium",
    location: "UK",
    postedTime: "3 hours ago"
  },
  {
    id: "4",
    type: "Criminal Record",
    requester: "Legal Firm",
    price: 60.00,
    urgency: "High",
    deadline: "4 hours",
    riskScore: "Low",
    location: "Canada",
    postedTime: "30 mins ago"
  },
  {
    id: "5",
    type: "Credit History",
    requester: "Finance Inc",
    price: 30.00,
    urgency: "Medium",
    deadline: "12 hours",
    riskScore: "High",
    location: "Global",
    postedTime: "5 hours ago"
  }
];

export default function JobBoard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredJobs = JOBS.filter(job => {
    const matchesSearch = job.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.requester.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || job.type === filterType;
    return matchesSearch && matchesType;
  });

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
        <div className="flex gap-2">
            <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
            <Button className="bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow">
                Auto-Accept On
            </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardContent className="p-4 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search jobs..." 
                className="pl-9 bg-background/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select defaultValue="all" onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-[200px] bg-background/50">
                <SelectValue placeholder="Credential Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Identity Verification">Identity</SelectItem>
                <SelectItem value="Employment Check">Employment</SelectItem>
                <SelectItem value="Education Verification">Education</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="any">
              <SelectTrigger className="w-full md:w-[150px] bg-background/50">
                <SelectValue placeholder="Urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Urgency</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative w-full md:w-[200px]">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Location" 
                className="pl-9 bg-background/50"
              />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-4 flex-1">
              <span className="text-sm font-medium whitespace-nowrap">Price Range:</span>
              <div className="flex items-center gap-2 w-full md:w-[300px]">
                <span className="text-xs text-muted-foreground">$0</span>
                <input 
                  type="range" 
                  min="0" 
                  max="200" 
                  className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-verza-emerald"
                />
                <span className="text-xs text-muted-foreground">$200+</span>
              </div>
            </div>
            
            <Select defaultValue="newest">
              <SelectTrigger className="w-full md:w-[200px] bg-background/50">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="urgency">Urgency</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Job Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJobs.map((job) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:border-verza-emerald/50 transition-colors h-full flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="bg-verza-emerald/10 text-verza-emerald border-verza-emerald/20">
                    {job.type}
                  </Badge>
                  <Badge variant={job.urgency === 'High' ? 'destructive' : 'secondary'}>
                    {job.urgency}
                  </Badge>
                </div>
                <CardTitle className="text-lg mt-2 flex justify-between items-center">
                   <span>${job.price.toFixed(2)}</span>
                   <span className="text-xs font-normal text-muted-foreground">{job.postedTime}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                    <ShieldCheck className="mr-2 h-4 w-4 text-verza-emerald" />
                    Risk Score: <span className={job.riskScore === 'Low' ? 'text-green-500 ml-1' : 'text-yellow-500 ml-1'}>{job.riskScore}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    Deadline: {job.deadline}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4" />
                    {job.location}
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" className="flex-1 border-verza-emerald/50 hover:bg-verza-emerald/10 hover:text-verza-emerald">
                    Accept
                </Button>
                <Button className="flex-1 bg-verza-emerald hover:bg-verza-emerald/90 text-white group shadow-glow">
                    Details
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center pt-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm" className="bg-verza-emerald text-white border-verza-emerald">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <span className="text-muted-foreground">...</span>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </motion.div>
  );
}
