// import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Package, Archive, Bookmark, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { ProductCard as ProductCardType } from '@/types/dashboard';
// import { cn } from '@/lib/utils';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

interface ProductCardProps {
  product: ProductCardType;
  index: number;
}

const iconMap: Record<string, React.ElementType> = {
  package: Package,
  archive: Archive,
  bookmark: Bookmark,
  'refresh-cw': RefreshCw,
};

export default function ProductCard({ product, index }: ProductCardProps) {
  const Icon = iconMap[product.icon] || Package;

  const chartData = {
    labels: product.chartData.map((_, i) => i.toString()),
    datasets: [
      {
        data: product.chartData,
        backgroundColor: 'rgba(141, 198, 63, 0.6)',
        borderRadius: 2,
        barThickness: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    animation: {
      duration: 500,
      delay: index * 100,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card
        className="p-4 bg-card/80 backdrop-blur-sm border-card-border hover:border-verza-emerald/30 transition-colors"
        data-testid={`product-card-${product.id}`}
      >
        <div className="flex items-start justify-between gap-2 mb-3">
          <motion.div
            className="p-2 rounded-lg bg-verza-emerald/20"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <Icon className="h-4 w-4 text-verza-emerald" />
          </motion.div>
          <div className="h-10 w-20">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-1">{product.title}</p>
        <motion.p
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
          className="text-xl font-bold text-foreground"
        >
          {product.value}
        </motion.p>
      </Card>
    </motion.div>
  );
}
