import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileBadge, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Plus, 
  MoreVertical, 
  Download, 
  Share2, 
  Shield,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

// Mock Data
const CREDENTIALS = [
  {
    id: 1,
    title: "University Diploma",
    type: "Education",
    issuer: "Harvard University",
    issueDate: "May 20, 2023",
    expiryDate: "Never",
    status: "Verified",
    documentId: "EDU-2023-8921",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 2,
    title: "National ID Card",
    type: "Identity",
    issuer: "Government of USA",
    issueDate: "Jan 15, 2022",
    expiryDate: "Jan 15, 2032",
    status: "Verified",
    documentId: "GOV-US-9921",
    image: "https://images.unsplash.com/photo-1562564025-51dc11516a0b?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 3,
    title: "Employment Contract",
    type: "Employment",
    issuer: "Tech Solutions Inc.",
    issueDate: "Aug 01, 2023",
    expiryDate: "Aug 01, 2024",
    status: "Pending",
    documentId: "EMP-TS-4421",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 4,
    title: "Professional Certificate",
    type: "Certification",
    issuer: "AWS",
    issueDate: "Nov 10, 2023",
    expiryDate: "Nov 10, 2026",
    status: "Expired",
    documentId: "AWS-CERT-112",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 5,
    title: "Vaccination Record",
    type: "Health",
    issuer: "Ministry of Health",
    issueDate: "Mar 05, 2021",
    expiryDate: "Never",
    status: "Verified",
    documentId: "MED-VAC-992",
    image: "https://images.unsplash.com/photo-1584036561566-b93a901dbd15?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 6,
    title: "Driver's License",
    type: "Identity",
    issuer: "DMV California",
    issueDate: "Jul 22, 2020",
    expiryDate: "Jul 22, 2025",
    status: "Verified",
    documentId: "DL-CA-4829",
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=300&q=80"
  }
];

const TABS = ["All", "Verified", "Pending", "Expired"];

export default function CredentialsPage() {
  const [, setLocation] = useLocation();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCredentials = CREDENTIALS.filter(cred => {
    const matchesTab = activeTab === "All" || cred.status === activeTab;
    const matchesSearch = cred.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          cred.issuer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleDelete = (id: number) => {
    toast.success(`Credential #${id} deleted successfully`);
    // In a real app, this would delete from the backend and update local state
  };

  return (
    <div className="space-y-8 p-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Credentials</h1>
          <p className="text-muted-foreground mt-1">
            Manage your verified digital identities and documents.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-black/20 rounded-lg p-1 border border-white/5">
            <button 
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded-md transition-all",
                viewMode === "grid" ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white"
              )}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded-md transition-all",
                viewMode === "list" ? "bg-white/10 text-white" : "text-muted-foreground hover:text-white"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="glass-button gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-card/90 backdrop-blur-md border-white/10">
              <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuCheckboxItem checked>All Types</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Education</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Identity</DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Employment</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button 
            className="bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow gap-2"
            onClick={() => setLocation("/app/upload-credential")}
          >
            <Plus className="w-4 h-4" /> Upload Credential
          </Button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 bg-black/20 p-1 rounded-xl border border-white/5 overflow-x-auto w-full md:w-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                activeTab === tab 
                  ? "bg-verza-emerald text-white shadow-sm" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search credentials..." 
            className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-verza-emerald/50 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {filteredCredentials.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
              <FileBadge className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">No credentials found</h3>
            <p className="text-muted-foreground mt-2 max-w-sm">
              Try adjusting your filters or search query, or upload a new credential.
            </p>
          </motion.div>
        ) : viewMode === "grid" ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCredentials.map((cred, index) => (
              <motion.div
                key={cred.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-0 rounded-2xl overflow-hidden group hover:border-verza-emerald/50 transition-all duration-300"
              >
                <div className="h-40 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                  <img 
                    src={cred.image} 
                    alt={cred.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 z-20">
                    <div className="w-10 h-10 rounded-xl bg-black/60 backdrop-blur-md flex items-center justify-center border border-white/10">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 z-20">
                    <span className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-medium backdrop-blur-md border",
                      cred.status === "Verified" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                      cred.status === "Pending" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                      "bg-red-500/20 text-red-400 border-red-500/30"
                    )}>
                      {cred.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="mb-4">
                    <h3 className="font-bold text-lg text-foreground mb-1">{cred.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" />
                      {cred.issuer}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground mb-4">
                    <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                      <span className="block opacity-60 mb-1">Issue Date</span>
                      <span className="font-medium text-foreground">{cred.issueDate}</span>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 border border-white/5">
                      <span className="block opacity-60 mb-1">Expiry Date</span>
                      <span className="font-medium text-foreground">{cred.expiryDate}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1 h-9 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                      onClick={() => {
                        navigator.clipboard.writeText(`https://verza.io/credentials/${cred.documentId}`);
                        toast.success("Credential link copied to clipboard");
                      }}
                    >
                      <Share2 className="w-3.5 h-3.5" /> Share
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1 h-9 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
                      onClick={() => toast.success("PDF downloaded successfully")}
                    >
                      <Download className="w-3.5 h-3.5" /> PDF
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card/90 backdrop-blur-md border-white/10">
                        <DropdownMenuItem onClick={() => setLocation(`/app/credentials/${cred.id}`)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          navigator.clipboard.writeText(`https://verza.io/credentials/${cred.documentId}`);
                          toast.success("Link copied");
                        }}>
                          Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem className="text-red-500" onClick={() => handleDelete(cred.id)}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card rounded-2xl overflow-hidden border border-white/5"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 text-xs uppercase text-muted-foreground font-medium">
                  <tr>
                    <th className="px-6 py-4 text-left">Document</th>
                    <th className="px-6 py-4 text-left">Type</th>
                    <th className="px-6 py-4 text-left">Issuer</th>
                    <th className="px-6 py-4 text-left">Date</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredCredentials.map((cred) => (
                    <tr 
                      key={cred.id} 
                      onClick={() => setLocation(`/app/credentials/${cred.id}`)}
                      className="hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium text-sm text-foreground">{cred.title}</div>
                            <div className="text-xs text-muted-foreground">{cred.documentId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {cred.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {cred.issuer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {cred.issueDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium border",
                          cred.status === "Verified" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                          cred.status === "Pending" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                          "bg-red-500/10 text-red-400 border-red-500/20"
                        )}>
                          {cred.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card/90 backdrop-blur-md border-white/10">
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setLocation(`/app/credentials/${cred.id}`); }}>
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(`https://verza.io/credentials/${cred.documentId}`);
                              toast.success("Link copied");
                            }}>
                              Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem className="text-red-500" onClick={(e) => { e.stopPropagation(); handleDelete(cred.id); }}>
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
