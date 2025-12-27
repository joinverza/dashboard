import { Link } from "wouter";
import { Upload, FileCheck, Share2, Plus } from "lucide-react";


export default function QuickActions() {
  const actions = [
    {
      label: "Request Verification",
      icon: FileCheck,
      href: "/app/marketplace",
      color: "text-[#00FF87]",
      bg: "bg-[#00FF87]/10",
      border: "border-[#00FF87]/20"
    },
    {
      label: "Upload Credential",
      icon: Upload,
      href: "/app/upload-credential",
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20"
    },
    {
      label: "Share Profile",
      icon: Share2,
      href: "#", // Placeholder
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "border-purple-400/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {actions.map((action, index) => (
        <Link key={index} href={action.href}>
          <div className={`
            cursor-pointer group relative overflow-hidden
            p-4 rounded-xl border ${action.border} ${action.bg}
            hover:bg-opacity-20 transition-all duration-300
            flex items-center gap-4
          `}>
            <div className={`
              w-10 h-10 rounded-lg ${action.bg} flex items-center justify-center
              border ${action.border}
            `}>
              <action.icon className={`w-5 h-5 ${action.color}`} />
            </div>
            <div>
              <h3 className="font-semibold text-white group-hover:text-[#00FF87] transition-colors">
                {action.label}
              </h3>
              <p className="text-xs text-gray-400">Click to start</p>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
               <Plus className="w-4 h-4 text-white/50" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
