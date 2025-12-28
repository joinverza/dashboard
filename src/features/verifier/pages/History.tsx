import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Search, Filter, Eye, FileText, Calendar, Star } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock Data
const HISTORY_DATA = [
    { id: "101", date: "2024-05-20", type: "Identity Verification", requester: "John D.", earnings: 15.00, rating: 5, status: "Completed" },
    { id: "102", date: "2024-05-19", type: "Education Check", requester: "Alice M.", earnings: 25.00, rating: 5, status: "Completed" },
    { id: "103", date: "2024-05-18", type: "Employment Check", requester: "Tech Corp", earnings: 45.00, rating: 4, status: "Completed" },
    { id: "104", date: "2024-05-18", type: "Criminal Record", requester: "Legal Firm", earnings: 60.00, rating: 5, status: "Completed" },
    { id: "105", date: "2024-05-17", type: "Credit History", requester: "Finance Inc", earnings: 30.00, rating: null, status: "Completed" },
    { id: "106", date: "2024-05-16", type: "Identity Verification", requester: "Sarah L.", earnings: 15.00, rating: 5, status: "Completed" },
    { id: "107", date: "2024-05-15", type: "Identity Verification", requester: "Mike R.", earnings: 15.00, rating: 3, status: "Completed" },
];

export default function History() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const filteredHistory = HISTORY_DATA.filter(item => {
    const matchesSearch = item.requester.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || item.type === filterType;
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">History</h1>
          <p className="text-muted-foreground">View and manage your completed verification jobs.</p>
        </div>
        <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
                <p className="text-sm text-muted-foreground font-medium">Total Jobs</p>
                <h3 className="text-2xl font-bold mt-1">1,284</h3>
            </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
                <p className="text-sm text-muted-foreground font-medium">This Month</p>
                <h3 className="text-2xl font-bold mt-1">42</h3>
            </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
                <p className="text-sm text-muted-foreground font-medium">Total Earnings</p>
                <h3 className="text-2xl font-bold mt-1 text-verza-emerald">$12,450</h3>
            </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
                <p className="text-sm text-muted-foreground font-medium">Avg Rating</p>
                <div className="flex items-center gap-1 mt-1">
                    <span className="text-2xl font-bold">4.9</span>
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search by requester or type..." 
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[180px]">
                        <Filter className="mr-2 h-4 w-4" />
                        <SelectValue placeholder="Filter by Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Identity Verification">Identity</SelectItem>
                        <SelectItem value="Education Check">Education</SelectItem>
                        <SelectItem value="Employment Check">Employment</SelectItem>
                    </SelectContent>
                </Select>
                 <Button variant="outline" size="icon">
                    <Calendar className="h-4 w-4" />
                </Button>
            </div>
        </CardHeader>
        <CardContent>
            <div className="rounded-md border border-border/50">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Requester</TableHead>
                            <TableHead>Earnings</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredHistory.map((job) => (
                            <TableRow key={job.id}>
                                <TableCell className="font-medium">{job.date}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{job.type}</Badge>
                                </TableCell>
                                <TableCell>{job.requester}</TableCell>
                                <TableCell className="text-verza-emerald font-medium">${job.earnings.toFixed(2)}</TableCell>
                                <TableCell>
                                    {job.rating ? (
                                        <div className="flex items-center gap-1">
                                            {job.rating} <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground text-xs italic">No rating</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <FileText className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
