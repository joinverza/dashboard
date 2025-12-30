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
  type ChartData,
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
  const labels = data.map((d) => d.label);
  const values = data.map((d) => d.value);

  const lineData: ChartData<"line", number[], string> = {
    labels,
    datasets: [
      {
        label: "Income",
        data: values,
        fill: true,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          
          // Helper to resolve CSS variable
          const getColor = (variable: string, alpha: number) => {
            const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
            return `hsl(${value} / ${alpha})`;
          };

          try {
             gradient.addColorStop(0, getColor("--chart-1", 0.5));
             gradient.addColorStop(1, getColor("--chart-1", 0));
          } catch {
             // Fallback for initial render or SSR
             gradient.addColorStop(0, "rgba(141, 198, 63, 0.5)");
             gradient.addColorStop(1, "rgba(141, 198, 63, 0)");
          }
          
          return gradient;
        },
        borderColor: "hsl(var(--chart-1))",
        borderWidth: 3,
        tension: 0.4,
        pointBackgroundColor: "hsl(var(--background))", // Match theme background
        pointBorderColor: "hsl(var(--chart-1))",
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: "hsl(var(--chart-1))",
        pointHoverBorderColor: "#fff",
      },
    ],
  };

  const barData: ChartData<"bar", number[], string> = {
    labels,
    datasets: [
      {
        label: "Income",
        data: values,
        backgroundColor: "hsl(var(--chart-1) / 0.8)",
        hoverBackgroundColor: "hsl(var(--chart-1))",
        borderColor: "hsl(var(--chart-1) / 0.5)",
        borderWidth: 0,
        barThickness: 24,
        borderRadius: 8,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(9, 9, 11, 0.8)", // Zinc-950 with opacity
        titleColor: "#fff",
        bodyColor: "#8DC63F",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        padding: 16,
        cornerRadius: 12,
        displayColors: false,
        titleFont: {
          family: "Poppins",
          size: 14,
          weight: 600 as const, // Explicit cast for TS
        },
        bodyFont: {
          family: "Poppins",
          size: 13,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#9ca3af", // verza-gray
          font: {
            family: "Poppins",
            size: 11,
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
          drawBorder: false,
        },
        ticks: {
          color: "#9ca3af",
          font: {
            family: "Poppins",
            size: 11,
          },
          padding: 10,
          callback: (value: string | number) => `$${Number(value) / 1000}k`,
        },
        border: {
          display: false,
        },
      },
    },
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
  };

  const lineOptions: ChartOptions<"line"> = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      tooltip: {
        ...commonOptions.plugins.tooltip,
        callbacks: {
          label: (context: TooltipItem<"line">) => {
            const value = Number(context.raw);
            return `$${value.toLocaleString()}`;
          },
        },
      },
    },
  };

  const barOptions: ChartOptions<"bar"> = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      tooltip: {
        ...commonOptions.plugins.tooltip,
        callbacks: {
          label: (context: TooltipItem<"bar">) => {
            const value = Number(context.raw);
            return `$${value.toLocaleString()}`;
          },
        },
      },
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
        <Line data={lineData} options={lineOptions} />
      ) : (
        <Bar data={barData} options={barOptions} />
      )}
    </motion.div>
  );
}
