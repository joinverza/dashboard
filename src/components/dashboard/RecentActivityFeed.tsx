import { FileCheck, Upload, CreditCard, Clock } from "lucide-react";

export default function RecentActivityFeed() {
  // Mock data - replace with real data from context/API
  const activities = [
    {
      id: 1,
      type: "verification_request",
      title: "Verification Requested",
      description: "University Degree verification initiated",
      time: "2 hours ago",
      icon: FileCheck,
      color: "text-blue-400",
      bg: "bg-blue-400/10"
    },
    {
      id: 2,
      type: "upload",
      title: "Credential Uploaded",
      description: "Professional Certificate.pdf uploaded",
      time: "5 hours ago",
      icon: Upload,
      color: "text-[#00FF87]",
      bg: "bg-[#00FF87]/10"
    },
    {
      id: 3,
      type: "payment",
      title: "Payment Successful",
      description: "Sent 50 ADA to Verifier Inc.",
      time: "1 day ago",
      icon: CreditCard,
      color: "text-purple-400",
      bg: "bg-purple-400/10"
    }
  ];

  return (
    <div className="bg-[#1A1A1A]/50 backdrop-blur-xl border border-white/5 rounded-2xl p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-white">Recent Activity</h2>
        <button className="text-xs text-[#00FF87] hover:underline">View All</button>
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
                <h3 className="text-sm font-semibold text-white group-hover:text-[#00FF87] transition-colors">
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
      </div>
    </div>
  );
}
