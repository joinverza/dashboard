import { Link } from "wouter";
import { Clock, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function VerificationStatusTracker() {
  // Mock data
  const verifications = [
    {
      id: "1",
      title: "University Degree",
      verifier: "Harvard University",
      status: "in_progress",
      progress: 65,
      eta: "2 days left"
    },
    {
      id: "2",
      title: "Employment Record",
      verifier: "Google Inc.",
      status: "pending_review",
      progress: 30,
      eta: "5 days left"
    }
  ];

  return (
    <div className="bg-[#1A1A1A]/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-white">Active Verifications</h2>
        <Link href="/app/credentials">
            <span className="text-xs text-[#00FF87] hover:underline cursor-pointer">Manage</span>
        </Link>
      </div>

      <div className="space-y-4">
        {verifications.map((item) => (
          <div key={item.id} className="bg-black/20 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                <p className="text-xs text-gray-400">Verifier: {item.verifier}</p>
              </div>
              <div className={`
                px-2 py-1 rounded text-[10px] font-medium uppercase
                ${item.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400' : 'bg-yellow-500/10 text-yellow-400'}
              `}>
                {item.status.replace('_', ' ')}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Progress</span>
                <span>{item.progress}%</span>
              </div>
              <Progress value={item.progress} className="h-1.5" />
            </div>

            <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" /> ETA: {item.eta}
              </span>
              <Link href={`/app/verification-status/${item.id}`}>
                <button className="text-xs flex items-center gap-1 text-white hover:text-[#00FF87] transition-colors">
                  View Details <ArrowRight className="w-3 h-3" />
                </button>
              </Link>
            </div>
          </div>
        ))}

        {verifications.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">
                No active verifications
            </div>
        )}
      </div>
    </div>
  );
}
