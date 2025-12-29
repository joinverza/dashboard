import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { 
  Search, 
  Star, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  ArrowRight,
  Sparkles,
  SlidersHorizontal,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Mock Data
const RECOMMENDED_VERIFIERS = [
  {
    id: 1,
    name: "Global Identity Solutions",
    role: "Premium Verifier",
    rating: 4.9,
    reviews: 1250,
    specialization: ["KYC", "AML", "Biometric"],
    price: "$15.00",
    time: "2-4 hrs",
    location: "Global",
    verified: true,
    image: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=300&q=80",
    tags: ["Fast", "Secure"]
  },
  {
    id: 2,
    name: "SecureCertify Ltd",
    role: "Enterprise Partner",
    rating: 4.8,
    reviews: 890,
    specialization: ["Education", "Professional"],
    price: "$25.00",
    time: "24 hrs",
    location: "USA, EU",
    verified: true,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80",
    tags: ["Official"]
  },
  {
    id: 3,
    name: "FastCheck Inc.",
    role: "Verified Agent",
    rating: 4.7,
    reviews: 2100,
    specialization: ["Employment", "Criminal"],
    price: "$10.00",
    time: "1 hr",
    location: "Global",
    verified: true,
    image: "https://images.unsplash.com/photo-1554446422-d05db23719d2?auto=format&fit=crop&w=300&q=80",
    tags: ["Automated"]
  }
];

const ALL_VERIFIERS = [
  ...RECOMMENDED_VERIFIERS,
  {
    id: 4,
    name: "EduVerify Pro",
    role: "Education Specialist",
    rating: 4.6,
    reviews: 450,
    specialization: ["Degrees", "Transcripts"],
    price: "$12.00",
    time: "48 hrs",
    location: "Europe",
    verified: true,
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=300&q=80",
    tags: ["Academic"]
  },
  {
    id: 5,
    name: "LegalTrust Partners",
    role: "Legal Entity",
    rating: 4.9,
    reviews: 320,
    specialization: ["Legal", "Notary"],
    price: "$45.00",
    time: "24 hrs",
    location: "USA",
    verified: true,
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=300&q=80",
    tags: ["Legal"]
  },
  {
    id: 6,
    name: "SwiftVerify",
    role: "Automated System",
    rating: 4.5,
    reviews: 5000,
    specialization: ["Social", "Phone"],
    price: "$2.00",
    time: "Instant",
    location: "Global",
    verified: true,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80",
    tags: ["Instant"]
  }
];

const CATEGORIES = ["All", "KYC/AML", "Education", "Employment", "Legal", "Biometric", "Financial"];

export default function Marketplace() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("recommended");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleApplyFilters = () => {
    setIsFilterOpen(false);
    toast.success("Filters applied successfully");
  };

  return (
    <div className="space-y-8 p-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Marketplace</h1>
          <p className="text-muted-foreground mt-1">
            Connect with verified issuers and identity providers.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="glass-button gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Advanced Filters
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-card/90 backdrop-blur-md border-white/10">
              <DialogHeader>
                <DialogTitle>Filter Verifiers</DialogTitle>
                <DialogDescription>
                  Refine your search with specific criteria.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="verified" className="border-white/20 data-[state=checked]:bg-verza-emerald data-[state=checked]:border-verza-emerald" />
                  <Label htmlFor="verified">Verified Only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="instant" className="border-white/20 data-[state=checked]:bg-verza-emerald data-[state=checked]:border-verza-emerald" />
                  <Label htmlFor="instant">Instant Verification (&lt; 1hr)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="automated" className="border-white/20 data-[state=checked]:bg-verza-emerald data-[state=checked]:border-verza-emerald" />
                  <Label htmlFor="automated">Automated Systems</Label>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" className="bg-verza-emerald hover:bg-verza-emerald/90 text-white" onClick={handleApplyFilters}>Apply Filters</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button 
            className="bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow"
            onClick={() => setLocation('/verifier')}
          >
            Become a Verifier
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="glass-card p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search verifiers, services, or specializations..." 
            className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-verza-emerald/50 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
                selectedCategory === cat 
                  ? "bg-verza-emerald/20 text-verza-emerald border border-verza-emerald/30" 
                  : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* AI Recommended Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-verza-emerald">
          <Sparkles className="w-5 h-5" />
          <h2 className="text-lg font-semibold tracking-wide uppercase">AI Recommended For You</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {RECOMMENDED_VERIFIERS.map((verifier, index) => (
            <motion.div
              key={verifier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-0 rounded-2xl overflow-hidden group hover:shadow-[0_0_30px_-5px_rgba(141,198,63,0.2)] transition-all duration-300 border border-white/5"
            >
              <div className="h-32 bg-gradient-to-br from-verza-emerald/20 to-black relative">
                <img 
                  src={verifier.image} 
                  alt={verifier.name}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                />
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-medium text-white flex items-center gap-1 border border-white/10">
                  <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  {verifier.rating}
                </div>
              </div>
              
              <div className="p-5 relative">
                <div className="absolute -top-10 left-5">
                  <div className="w-16 h-16 rounded-xl bg-black border-2 border-verza-emerald/50 overflow-hidden shadow-lg p-1">
                     <img 
                      src={verifier.image} 
                      alt={verifier.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                </div>
                
                <div className="mt-8 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                        {verifier.name}
                        {verifier.verified && <ShieldCheck className="w-4 h-4 text-verza-emerald" />}
                      </h3>
                      <p className="text-sm text-muted-foreground">{verifier.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-verza-emerald">{verifier.price}</p>
                      <p className="text-xs text-muted-foreground">per check</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {verifier.specialization.map(spec => (
                      <span key={spec} className="px-2 py-1 rounded-md bg-white/5 text-xs text-muted-foreground border border-white/5">
                        {spec}
                      </span>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-2 border-t border-white/5">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {verifier.time}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      {verifier.location}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-2 bg-white/5 hover:bg-verza-emerald hover:text-white text-foreground border border-white/10 hover:border-verza-emerald transition-all group-hover:shadow-glow"
                    onClick={() => setLocation(`/app/verifier-profile/${verifier.id}`)}
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* All Verifiers Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">All Verifiers</h2>
          <div className="flex items-center gap-2">
             <span className="text-sm text-muted-foreground">Sort by:</span>
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <button className="flex items-center gap-1 text-sm font-medium text-foreground bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 outline-none">
                   {sortBy === 'recommended' ? 'Recommended' : sortBy === 'price_low' ? 'Price: Low to High' : sortBy === 'rating' ? 'Highest Rated' : 'Fastest'} <ChevronDown className="w-3.5 h-3.5" />
                 </button>
               </DropdownMenuTrigger>
               <DropdownMenuContent align="end" className="bg-card/90 backdrop-blur-md border-white/10">
                 <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                   <DropdownMenuRadioItem value="recommended">Recommended</DropdownMenuRadioItem>
                   <DropdownMenuRadioItem value="price_low">Price: Low to High</DropdownMenuRadioItem>
                   <DropdownMenuRadioItem value="rating">Highest Rated</DropdownMenuRadioItem>
                   <DropdownMenuRadioItem value="fastest">Fastest Time</DropdownMenuRadioItem>
                 </DropdownMenuRadioGroup>
               </DropdownMenuContent>
             </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ALL_VERIFIERS.map((verifier) => (
             <motion.div
              key={verifier.id}
              whileHover={{ y: -5 }}
              onClick={() => setLocation(`/app/verifier-profile/${verifier.id}`)}
              className="glass-card p-4 rounded-xl border border-white/5 hover:border-verza-emerald/30 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-white/5 overflow-hidden">
                   <img src={verifier.image} alt={verifier.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-foreground truncate">{verifier.name}</h4>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    {verifier.rating} ({verifier.reviews})
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Price</span>
                  <span className="font-medium text-foreground">{verifier.price}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Turnaround</span>
                  <span className="font-medium text-foreground">{verifier.time}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="flex-1 h-8 text-xs bg-white/5 hover:bg-white/10"
                  onClick={() => setLocation(`/app/verifier-profile/${verifier.id}`)}
                >
                  Profile
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 h-8 text-xs bg-verza-emerald/10 text-verza-emerald hover:bg-verza-emerald hover:text-white border border-verza-emerald/20"
                  onClick={() => setLocation('/app/request-verification')}
                >
                  Request
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Bottom CTA */}
      <div className="mt-12 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-verza-emerald/20 to-blue-500/20 backdrop-blur-xl border border-white/10" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl font-bold text-white">Join the Global Verification Network</h3>
            <p className="text-gray-300">
              Become a certified verifier on Verza and earn by verifying credentials for individuals and organizations worldwide.
            </p>
          </div>
          <Button 
            size="lg" 
            className="bg-white text-black hover:bg-gray-100 shadow-xl whitespace-nowrap"
            onClick={() => setLocation('/verifier')}
          >
            Apply Now <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
