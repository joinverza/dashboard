import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import MetricCard from "@/components/dashboard/MetricCard";
import OverviewSection from "@/components/dashboard/OverviewSection";
import ProductsSection from "@/components/dashboard/ProductsSection";
import { Skeleton } from "@/components/ui/skeleton";
import { useMockData } from "@/contexts/MockDataContext";

export default function Dashboard() {
  const metricsRef = useRef<HTMLDivElement>(null);
  const { metricCards } = useMockData();

  const isLoading = false;
  const error = false;

  useEffect(() => {
    if (metricsRef.current && metricCards) {
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
  }, [metricCards]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
      data-testid="page-dashboard"
    >
      <div
        ref={metricsRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </>
        ) : error ? (
          <div className="col-span-4 text-center text-destructive">
            Failed to load metrics
          </div>
        ) : (
          metricCards?.map((metric, index) => (
            <MetricCard key={metric.id} metric={metric} index={index} />
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <OverviewSection />
        </div>
        <div className="lg:col-span-1">
          <ProductsSection />
        </div>
      </div>
    </motion.div>
  );
}
