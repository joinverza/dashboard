// import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Package, Archive, Bookmark, RefreshCw } from 'lucide-react';
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
      <div
        className="glass-card p-4 rounded-xl transition-all duration-300 group hover:shadow-lg dark:hover:shadow-glow/20 relative overflow-hidden"
        data-testid={`product-card-${product.id}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div className="flex items-start justify-between gap-4 mb-4 relative z-10">
          <motion.div
            className="p-2.5 rounded-lg bg-verza-emerald/10 text-verza-emerald group-hover:bg-verza-emerald group-hover:text-white group-hover:shadow-glow transition-all duration-300"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Icon className="h-5 w-5" />
          </motion.div>
          <div className="h-10 w-24">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs font-medium text-muted-foreground mb-1 uppercase tracking-wider">{product.title}</p>
          <motion.p
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
            className="text-2xl font-bold text-foreground tracking-tight"
          >
            {product.value}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
