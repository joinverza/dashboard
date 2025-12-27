import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Star, 
  ShieldCheck, 
  MessageSquare, 
  Share2, 
  Heart, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Globe, 
  Award, 
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock Data
const VERIFIER = {
  id: "1",
  name: "Global Identity Solutions",
  role: "Premium Verifier",
  avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=300&q=80",
  cover: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  rating: 4.9,
  reviews: 1250,
  verifications: "15k+",
  successRate: "99.8%",
  responseTime: "2h",
  memberSince: "2021",
  location: "New York, USA",
  languages: ["English", "Spanish", "French"],
  about: "Global Identity Solutions is a leading provider of identity verification services. We specialize in KYC, AML, and biometric verification for individuals and businesses worldwide. Our team of certified experts ensures the highest level of accuracy and security.",
  specializations: [
    { name: "KYC/AML", count: "5k+" },
    { name: "Education", count: "3k+" },
    { name: "Employment", count: "4k+" },
    { name: "Legal", count: "2k+" }
  ],
  pricing: [
    { type: "Basic Identity Check", price: "$15.00", time: "2-4 hrs" },
    { type: "Enhanced Due Diligence", price: "$45.00", time: "24 hrs" },
    { type: "Document Verification", price: "$10.00", time: "1 hr" }
  ]
};

const TABS = ["Overview", "Reviews", "Certifications", "Portfolio"];

export default function VerifierProfilePage() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="space-y-8 p-8 pb-20 max-w-7xl mx-auto">
      {/* Header / Cover */}
      <div className="relative rounded-3xl overflow-hidden glass-card border border-white/5">
        <div className="h-48 md:h-64 bg-black relative">
          <img 
            src={VERIFIER.cover} 
            alt="Cover" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>
        
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row gap-6 items-start -mt-16">
            <div className="w-32 h-32 rounded-2xl bg-black p-1 border-2 border-verza-emerald relative shadow-xl">
              <img 
                src={VERIFIER.avatar} 
                alt={VERIFIER.name} 
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-black" />
            </div>
            
            <div className="flex-1 pt-16 md:pt-0 mt-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                    {VERIFIER.name}
                    <ShieldCheck className="w-6 h-6 text-verza-emerald" />
                  </h1>
                  <p className="text-muted-foreground">{VERIFIER.role} • Member since {VERIFIER.memberSince}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="icon" className="glass-button rounded-full">
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="glass-button rounded-full">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="glass-button gap-2">
                    <MessageSquare className="w-4 h-4" /> Message
                  </Button>
                  <Button className="bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow">
                    Request Verification
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <div className="text-xs text-muted-foreground mb-1">Rating</div>
                  <div className="flex items-center gap-1 font-bold text-lg">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    {VERIFIER.rating} <span className="text-xs font-normal text-muted-foreground">({VERIFIER.reviews})</span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <div className="text-xs text-muted-foreground mb-1">Verifications</div>
                  <div className="flex items-center gap-1 font-bold text-lg">
                    <CheckCircle2 className="w-4 h-4 text-verza-emerald" />
                    {VERIFIER.verifications}
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <div className="text-xs text-muted-foreground mb-1">Success Rate</div>
                  <div className="flex items-center gap-1 font-bold text-lg">
                    <Award className="w-4 h-4 text-blue-400" />
                    {VERIFIER.successRate}
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                  <div className="text-xs text-muted-foreground mb-1">Response Time</div>
                  <div className="flex items-center gap-1 font-bold text-lg">
                    <Clock className="w-4 h-4 text-purple-400" />
                    {VERIFIER.responseTime}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tabs */}
          <div className="flex gap-2 border-b border-white/10 pb-1 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-3 text-sm font-medium transition-all relative whitespace-nowrap",
                  activeTab === tab 
                    ? "text-verza-emerald" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-verza-emerald shadow-[0_0_10px_rgba(141,198,63,0.5)]" 
                  />
                )}
              </button>
            ))}
          </div>

          <div className="space-y-8">
            {/* About */}
            <section>
              <h3 className="text-xl font-bold text-foreground mb-4">About</h3>
              <p className="text-muted-foreground leading-relaxed">
                {VERIFIER.about}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-verza-emerald" /> Location
                  </h4>
                  <p className="text-sm text-muted-foreground">{VERIFIER.location}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-verza-emerald" /> Languages
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {VERIFIER.languages.map(lang => (
                      <Badge key={lang} variant="secondary" className="bg-white/5 hover:bg-white/10 text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Specializations */}
            <section>
              <h3 className="text-xl font-bold text-foreground mb-4">Specializations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {VERIFIER.specializations.map((spec) => (
                  <div key={spec.name} className="glass-card p-4 rounded-xl flex items-center justify-between border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-verza-emerald/10 flex items-center justify-center text-verza-emerald">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <span className="font-medium">{spec.name}</span>
                    </div>
                    <Badge variant="outline" className="border-white/10 bg-white/5">
                      {spec.count} Verified
                    </Badge>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <div className="glass-card p-6 rounded-2xl border border-white/5 sticky top-24">
            <h3 className="text-lg font-bold text-foreground mb-4">Services & Pricing</h3>
            <div className="space-y-4">
              {VERIFIER.pricing.map((item) => (
                <div key={item.type} className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-verza-emerald/30 transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-sm text-foreground">{item.type}</span>
                    <span className="font-bold text-verza-emerald">{item.price}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    Est. time: {item.time}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
              <Button className="w-full bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow">
                Request Verification
              </Button>
              <Button variant="outline" className="w-full glass-button">
                Contact Verifier
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
