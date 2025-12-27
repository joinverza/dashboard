import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import MetricCard from "@/components/dashboard/MetricCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useMockData } from "@/contexts/MockDataContext";
import { Card } from "@/components/ui/card";

export default function AdminDashboard() {
  const metricsRef = useRef<HTMLDivElement>(null);
  const { adminMetricCards } = useMockData();
  const isLoading = false;

  useEffect(() => {
    if (metricsRef.current && adminMetricCards) {
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
  }, [adminMetricCards]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">System overview and user management.</p>
      </div>

      <div
        ref={metricsRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {isLoading ? (
          [1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))
        ) : (
          adminMetricCards?.map((metric, index) => (
            <MetricCard key={metric.id} metric={metric} index={index} />
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 bg-card/80 backdrop-blur-sm border-card-border">
          <h2 className="text-lg font-semibold mb-4">System Logs</h2>
          <div className="space-y-4">
             <p className="text-muted-foreground">Recent system activities.</p>
          </div>
        </Card>
        
        <Card className="p-6 bg-card/80 backdrop-blur-sm border-card-border">
            <h2 className="text-lg font-semibold mb-4">Server Status</h2>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>All systems operational</span>
             </div>
        </Card>
      </div>
    </motion.div>
  );
}
