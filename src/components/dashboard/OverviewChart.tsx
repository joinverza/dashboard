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
        backgroundColor: "rgba(141, 198, 63, 0.2)",
        borderColor: "#8DC63F",
        borderWidth: 2,
        tension: 0.4,
        pointBackgroundColor: "#8DC63F",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const barData: ChartData<"bar", number[], string> = {
    labels,
    datasets: [
      {
        label: "Income",
        data: values,
        backgroundColor: "rgba(141, 198, 63, 0.8)",
        borderColor: "#8DC63F",
        borderWidth: 1,
        barThickness: 20,
        borderRadius: 4,
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
        backgroundColor: "rgba(10, 10, 10, 0.9)",
        titleColor: "#fff",
        bodyColor: "#8DC63F",
        borderColor: "#8DC63F",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
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
          callback: (value: string | number) => {
            if (typeof value === "number") {
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
  } as const;

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
