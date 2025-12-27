import { useRef } from "react";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  type ChartOptions,
  type TooltipItem,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import type { ChartDataPoint, ChartType } from "@/types/dashboard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

interface OverviewChartProps {
  data: ChartDataPoint[];
  chartType: ChartType;
}

export default function OverviewChart({ data, chartType }: OverviewChartProps) {
  const chartRef = useRef<any>(null);

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: "Income",
        data: data.map((d) => d.value),
        fill: chartType === "area",
        backgroundColor:
          chartType === "area"
            ? "rgba(141, 198, 63, 0.2)"
            : "rgba(141, 198, 63, 0.8)",
        borderColor: "#8DC63F",
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: "#8DC63F",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: chartType === "area" ? 4 : 0,
        pointHoverRadius: 6,
        barThickness: chartType === "bar" ? 20 : undefined,
        borderRadius: chartType === "bar" ? 4 : undefined,
      },
    ],
  };

  const options: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(10, 10, 10, 0.9)",
        titleColor: "#fff",
        bodyColor: "#8DC63F",
        borderColor: "#8DC63F",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context: TooltipItem<'line' | 'bar'>) => {
            const value = context.raw as number;
            return `$${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#9CA3AF",
          font: {
            size: 12,
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#9CA3AF",
          font: {
            size: 12,
          },
          callback: (value) => {
            if (typeof value === 'number') {
               return `$${value >= 1000 ? `${value / 1000}k` : value}`;
            }
            return value;
          },
        },
        border: {
          display: false,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
    animation: {
      duration: 500,
      easing: "easeOutQuart" as const,
    },
  };

  return (
    <motion.div
      key={chartType}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="h-[300px] md:h-[350px] w-full"
      data-testid="overview-chart"
    >
      {chartType === "area" ? (
        <Line ref={chartRef} data={chartData} options={options as any} />
      ) : (
        <Bar ref={chartRef} data={chartData} options={options as any} />
      )}
    </motion.div>
  );
}
