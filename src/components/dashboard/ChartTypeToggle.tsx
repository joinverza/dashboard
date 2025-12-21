import { motion } from 'framer-motion';
import { AreaChart, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ChartType } from '@/types/dashboard';
import { cn } from '@/lib/utils';

interface ChartTypeToggleProps {
  chartType: ChartType;
  onChange: (type: ChartType) => void;
}

export default function ChartTypeToggle({ chartType, onChange }: ChartTypeToggleProps) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-lg bg-muted/50">
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onChange('area')}
          className={cn(
            'h-8 w-8 transition-colors',
            chartType === 'area' && 'bg-verza-emerald/20 text-verza-emerald'
          )}
          data-testid="button-chart-area"
        >
          <AreaChart className="h-4 w-4" />
        </Button>
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onChange('bar')}
          className={cn(
            'h-8 w-8 transition-colors',
            chartType === 'bar' && 'bg-verza-emerald/20 text-verza-emerald'
          )}
          data-testid="button-chart-bar"
        >
          <BarChart3 className="h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
}
