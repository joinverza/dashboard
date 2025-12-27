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
          "glass-card p-6 rounded-2xl transition-all duration-500 group relative overflow-hidden",
          "hover:bg-white/50 dark:hover:bg-zinc-900/90 hover:shadow-[0_0_30px_-5px_rgba(141,198,63,0.3)] hover:border-verza-emerald/30",
          "before:absolute before:inset-0 before:bg-gradient-to-br before:from-transparent before:via-white/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500"
        )}
        data-testid={`metric-card-${metric.id}`}
      >
        <div className="flex items-start justify-between gap-4 mb-6 relative z-10">
          <span className="text-sm font-medium text-muted-foreground tracking-wide">{metric.label}</span>
          <motion.div
            className={cn(
              "p-3 rounded-xl transition-all duration-300 shadow-sm",
              metric.isPositive 
                ? "bg-verza-emerald/10 text-verza-emerald group-hover:bg-verza-emerald group-hover:text-white group-hover:shadow-glow" 
                : "bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white group-hover:shadow-red-500/50"
            )}
            whileHover={{ scale: 1.1, rotate: 5 }}
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
          className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tighter relative z-10"
        >
          {metric.value}
        </motion.div>

        <div className="flex items-center gap-3 text-sm relative z-10">
          <span
            className={cn(
              "flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-lg transition-all duration-300",
              metric.isPositive 
                ? "text-verza-emerald bg-verza-emerald/10 group-hover:bg-verza-emerald group-hover:text-white" 
                : "text-red-500 bg-red-500/10 group-hover:bg-red-500 group-hover:text-white"
            )}
          >
            {metric.isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            {metric.isPositive ? "+" : ""}
            {metric.percentChange}%
          </span>
          <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">vs last period</span>
        </div>
      </div>
    </motion.div>
  );
}
