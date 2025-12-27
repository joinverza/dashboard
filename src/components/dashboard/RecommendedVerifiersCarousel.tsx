import { useRef } from "react";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, Star, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RecommendedVerifiersCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const current = scrollRef.current;
      const scrollAmount = 300;
      if (direction === 'left') {
        current.scrollLeft -= scrollAmount;
      } else {
        current.scrollLeft += scrollAmount;
      }
    }
  };

  const verifiers = [
    { id: 1, name: "Harvard University", category: "Education", rating: 4.9, verified: true, image: "https://logo.clearbit.com/harvard.edu" },
    { id: 2, name: "Google Inc.", category: "Employment", rating: 4.8, verified: true, image: "https://logo.clearbit.com/google.com" },
    { id: 3, name: "Department of State", category: "Government", rating: 5.0, verified: true, image: "https://logo.clearbit.com/state.gov" },
    { id: 4, name: "Coursera", category: "Education", rating: 4.7, verified: true, image: "https://logo.clearbit.com/coursera.org" },
    { id: 5, name: "Microsoft", category: "Employment", rating: 4.8, verified: true, image: "https://logo.clearbit.com/microsoft.com" },
  ];

  return (
    <div className="bg-[#1A1A1A]/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-white">Recommended Verifiers</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/10" onClick={() => scroll('left')}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/10" onClick={() => scroll('right')}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x"
        style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none' }}
      >
        {verifiers.map((verifier) => (
          <Link key={verifier.id} href={`/app/verifier-profile/${verifier.id}`}>
            <div className="min-w-[200px] bg-black/20 rounded-xl p-4 border border-white/5 hover:border-[#00FF87]/30 transition-all cursor-pointer snap-start group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 p-1 flex items-center justify-center overflow-hidden">
                   {/* Fallback for image if load fails or generic icon */}
                   <img src={verifier.image} alt={verifier.name} className="w-full h-full object-contain" onError={(e) => {
                       (e.target as HTMLImageElement).style.display = 'none';
                       ((e.target as HTMLImageElement).nextSibling as HTMLElement).style.display = 'block';
                   }} />
                   <div className="hidden w-full h-full bg-gray-700 flex items-center justify-center text-xs">?</div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white truncate max-w-[120px]">{verifier.name}</h3>
                  <p className="text-xs text-gray-400">{verifier.category}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-3 h-3 fill-yellow-500" />
                  <span>{verifier.rating}</span>
                </div>
                {verifier.verified && (
                  <div className="flex items-center gap-1 text-[#00FF87]">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
