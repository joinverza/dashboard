import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useAuth } from "@/features/auth/AuthContext";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivityFeed from "@/components/dashboard/RecentActivityFeed";
import VerificationStatusTracker from "@/components/dashboard/VerificationStatusTracker";
import RecommendedVerifiersCarousel from "@/components/dashboard/RecommendedVerifiersCarousel";
import MetricCard from "@/components/dashboard/MetricCard";
import { FileCheck, Clock, CreditCard } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const metricsRef = useRef<HTMLDivElement>(null);

  // Custom metrics for Page 6 requirements
  const metrics = [
    {
      id: "1",
      label: "Verified Credentials",
      value: "12",
      percentChange: 8.5,
      isPositive: true,
      icon: "check-circle", // Mapped in MetricCard
      customIcon: FileCheck
    },
    {
      id: "2",
      label: "Pending Verifications",
      value: "3",
      percentChange: -2.1,
      isPositive: true, // Lower might be better, or just neutral
      icon: "clock",
      customIcon: Clock
    },
    {
      id: "3",
      label: "Total Spent",
      value: "450 ADA",
      percentChange: 12.3,
      isPositive: false, // Spending went up
      icon: "credit-card",
      customIcon: CreditCard
    }
  ];

  useEffect(() => {
    if (metricsRef.current) {
      const cards = metricsRef.current.querySelectorAll(
        '[data-testid^="metric-card"]'
      );
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 max-w-7xl mx-auto"
      data-testid="page-dashboard"
    >
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, <span className="text-[#00FF87]">{user?.name || "User"}</span>
          </h1>
          <p className="text-gray-400 mt-1">Here's what's happening with your credentials today.</p>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              System Status: <span className="text-[#00FF87] font-medium">Operational</span>
           </span>
        </div>
      </div>

      <QuickActions />

      {/* Stats Overview */}
      <div
        ref={metricsRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {metrics.map((metric, index) => (
          <MetricCard key={metric.id} metric={metric} index={index} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <VerificationStatusTracker />
          <RecommendedVerifiersCarousel />
        </div>

        {/* Sidebar Area */}
        <div className="lg:col-span-1">
          <RecentActivityFeed />
        </div>
      </div>
    </motion.div>
  );
}
