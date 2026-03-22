import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Clock, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { bankingService } from "@/services/bankingService";
import type { VerificationRequestResponse } from "@/types/banking";

const progressByStatus: Record<string, number> = {
  pending: 20,
  in_progress: 60,
  review_needed: 75,
  requires_action: 50,
  verified: 100,
  rejected: 100,
};

const formatDate = (value: string): string => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Recently updated";
  }
  return `Updated ${parsed.toLocaleDateString()}`;
};

export default function VerificationStatusTracker() {
  const [verifications, setVerifications] = useState<VerificationRequestResponse[]>([]);

  useEffect(() => {
    let isMounted = true;
    const loadVerifications = async () => {
      try {
        const data = await bankingService.getUserVerifications({ limit: 10 });
        if (isMounted) {
          setVerifications(data);
        }
      } catch {
        if (isMounted) {
          setVerifications([]);
        }
      }
    };
    void loadVerifications();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeVerifications = useMemo(
    () =>
      verifications
        .filter((item) => item.status !== "verified" && item.status !== "rejected")
        .slice(0, 5),
    [verifications],
  );

  return (
    <div className="bg-[#1A1A1A]/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-white">Active Verifications</h2>
        <Link href="/app/credentials">
            <span className="text-xs text-[#00FF87] hover:underline cursor-pointer">Manage</span>
        </Link>
      </div>

      <div className="space-y-4">
        {activeVerifications.map((item) => (
          <div key={item.verificationId} className="bg-black/20 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-sm font-semibold text-white">{item.subject || item.type.replaceAll("_", " ")}</h3>
                <p className="text-xs text-gray-400">Verification ID: {item.verificationId}</p>
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
                <span>{progressByStatus[item.status] ?? 0}%</span>
              </div>
              <Progress value={progressByStatus[item.status] ?? 0} className="h-1.5" />
            </div>

            <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {formatDate(item.updatedAt)}
              </span>
              <Link href={`/app/verification-status/${item.verificationId}`}>
                <button className="text-xs flex items-center gap-1 text-white hover:text-[#00FF87] transition-colors">
                  View Details <ArrowRight className="w-3 h-3" />
                </button>
              </Link>
            </div>
          </div>
        ))}

        {activeVerifications.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">
                No active verifications
            </div>
        )}
      </div>
    </div>
  );
}
