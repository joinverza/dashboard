import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ShoppingBag,
  Lock,
} from "lucide-react";
import type { MetricCard as MetricCardType } from "@/types/dashboard";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  metric: MetricCardType;
  index: number;
}

const iconMap: Record<string, React.ElementType> = {
  wallet: Wallet,
  "trending-up": TrendingUp,
  "trending-down": TrendingDown,
  "shopping-bag": ShoppingBag,
  lock: Lock,
};

export default function MetricCard({ metric, index }: MetricCardProps) {
  const Icon = iconMap[metric.icon] || Wallet;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <div
        className={cn(
          "glass-card p-6 rounded-2xl transition-all duration-300 group",
          "hover:bg-white/50 dark:hover:bg-black/80 hover:shadow-[0_0_30px_-5px_rgba(141,198,63,0.15)]"
        )}
        data-testid={`metric-card-${metric.id}`}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <span className="text-sm font-medium text-muted-foreground tracking-wide">{metric.label}</span>
          <motion.div
            className={cn(
              "p-2.5 rounded-xl transition-colors duration-300",
              metric.isPositive 
                ? "bg-verza-emerald/10 text-verza-emerald group-hover:bg-verza-emerald group-hover:text-white" 
                : "bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white"
            )}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <Icon
              className="h-5 w-5"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
          className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight"
        >
          {metric.value}
        </motion.div>

        <div className="flex items-center gap-2 text-sm">
          <span
            className={cn(
              "flex items-center gap-1 font-semibold px-2 py-0.5 rounded-lg",
              metric.isPositive 
                ? "text-verza-emerald bg-verza-emerald/5" 
                : "text-red-500 bg-red-500/5"
            )}
          >
            {metric.isPositive ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            {metric.isPositive ? "+" : ""}
            {metric.percentChange}%
          </span>
          <span className="text-muted-foreground text-xs">vs last period</span>
        </div>
      </div>
    </motion.div>
  );
}
