import { useEffect, useMemo, useState } from "react";
import { FileCheck, Upload, CreditCard, Clock } from "lucide-react";
import { Link } from "wouter";
import { bankingService } from "@/services/bankingService";
import type { DashboardNotification } from "@/types/banking";

const formatRelativeTime = (value: string): string => {
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return "Just now";
  const diffMs = Date.now() - time;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diffMs < hour) return `${Math.max(1, Math.floor(diffMs / minute))} min ago`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)}h ago`;
  return `${Math.floor(diffMs / day)}d ago`;
};

export default function RecentActivityFeed() {
  const [notifications, setNotifications] = useState<DashboardNotification[]>([]);

  useEffect(() => {
    let isMounted = true;
    const loadNotifications = async () => {
      try {
        const data = await bankingService.getNotifications({ limit: 6 });
        if (isMounted) {
          setNotifications(data);
        }
      } catch {
        if (isMounted) {
          setNotifications([]);
        }
      }
    };
    void loadNotifications();
    return () => {
      isMounted = false;
    };
  }, []);

  const activities = useMemo(() => {
    return notifications.map((item) => {
      const iconConfig = item.type === "alert"
        ? { icon: FileCheck, color: "text-blue-400", bg: "bg-blue-400/10" }
        : item.type === "transaction"
          ? { icon: CreditCard, color: "text-purple-400", bg: "bg-purple-400/10" }
          : { icon: Upload, color: "text-verza-emerald", bg: "bg-verza-emerald/10" };
      return {
        id: item.id,
        title: item.title,
        description: item.message,
        time: formatRelativeTime(item.createdAt),
        ...iconConfig,
      };
    });
  }, [notifications]);

  return (
    <div className="bg-[#1A1A1A]/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-white">Recent Activity</h2>
        <Link href="/app/notifications">
          <button className="text-xs text-verza-emerald hover:underline cursor-pointer">View All</button>
        </Link>
      </div>

      <div className="space-y-6">
        {activities.map((activity, index) => (
          <div key={activity.id} className="flex gap-4 group">
            <div className="relative">
              <div className={`w-10 h-10 rounded-full ${activity.bg} flex items-center justify-center z-10 relative`}>
                <activity.icon className={`w-5 h-5 ${activity.color}`} />
              </div>
              {index !== activities.length - 1 && (
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[1px] h-[calc(100%+24px)] bg-white/5" />
              )}
            </div>
            <div className="flex-1 pb-1 border-b border-white/5 group-last:border-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-sm font-semibold text-white group-hover:text-verza-emerald transition-colors">
                  {activity.title}
                </h3>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {activity.time}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-2">{activity.description}</p>
            </div>
          </div>
        ))}
        {activities.length === 0 && (
          <div className="text-sm text-gray-500 text-center py-6">No recent activity yet.</div>
        )}
      </div>
    </div>
  );
}
