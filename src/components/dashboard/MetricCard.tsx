import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ShoppingBag,
  Lock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
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
      <Card
        className="p-4 md:p-5 bg-card/80 backdrop-blur-sm border-card-border hover:border-verza-emerald/30 transition-colors"
        data-testid={`metric-card-${metric.id}`}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <span className="text-sm text-muted-foreground">{metric.label}</span>
          <motion.div
            className={cn(
              "p-2 rounded-lg",
              metric.isPositive ? "bg-verza-emerald/20" : "bg-red-500/20"
            )}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <Icon
              className={cn(
                "h-4 w-4",
                metric.isPositive ? "text-verza-emerald" : "text-red-500"
              )}
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
          className="text-2xl md:text-3xl font-bold text-foreground mb-2"
        >
          {metric.value}
        </motion.div>

        <div className="flex items-center gap-2 text-sm">
          <span
            className={cn(
              "flex items-center gap-1 font-medium",
              metric.isPositive ? "text-verza-emerald" : "text-red-500"
            )}
          >
            {metric.isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {metric.isPositive ? "+" : ""}
            {metric.percentChange}%
          </span>
          <span className="text-muted-foreground">than last day</span>
        </div>
      </Card>
    </motion.div>
  );
}
