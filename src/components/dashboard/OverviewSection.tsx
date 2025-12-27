import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewChart from "./OverviewChart";
import ChartTypeToggle from "./ChartTypeToggle";
import { useMockData } from "@/contexts/MockDataContext";
import type { TimePeriod, ChartType, IncomeType } from "@/types/dashboard";

const incomeTypes: { value: IncomeType; label: string }[] = [
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
  { value: "profit", label: "Profit" },
];

const timePeriods: { value: TimePeriod; label: string }[] = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
];

export default function OverviewSection() {
  const [incomeType, setIncomeType] = useState<IncomeType>("income");
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("month");
  const [chartType, setChartType] = useState<ChartType>("area");
  const { chartData: allChartData } = useMockData();

  const chartData = allChartData[timePeriod];
  const isLoading = false;
  const error = false;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
    >
      <div className="glass-panel rounded-2xl p-4 md:p-6 transition-all duration-300 hover:shadow-lg dark:hover:shadow-glow/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">Overview</h2>
            <p className="text-sm text-muted-foreground mt-1">Financial performance analysis</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 min-w-[140px] bg-white/5 border-white/10 hover:bg-white/10 hover:border-verza-emerald/30 transition-all duration-300"
                  data-testid="dropdown-income-type"
                >
                  {incomeTypes.find((t) => t.value === incomeType)?.label}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass-panel border-white/10">
                {incomeTypes.map((type) => (
                  <DropdownMenuItem
                    key={type.value}
                    onClick={() => setIncomeType(type.value)}
                    data-testid={`dropdown-item-${type.value}`}
                    className="focus:bg-verza-emerald/10 focus:text-verza-emerald cursor-pointer"
                  >
                    {type.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <ChartTypeToggle chartType={chartType} onChange={setChartType} />
          </div>
        </div>

        <div className="mb-8">
          <Tabs
            value={timePeriod}
            onValueChange={(v) => setTimePeriod(v as TimePeriod)}
            className="w-full"
          >
            <TabsList className="bg-muted/30 p-1.5 rounded-xl border border-white/5">
              {timePeriods.map((period) => (
                <TabsTrigger
                  key={period.value}
                  value={period.value}
                  className="rounded-lg data-[state=active]:bg-verza-emerald data-[state=active]:text-white data-[state=active]:shadow-glow transition-all duration-300"
                  data-testid={`tab-${period.value}`}
                >
                  {period.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <Skeleton className="h-64 w-full rounded-lg" />
        ) : error ? (
          <div className="h-64 flex items-center justify-center text-destructive">
            Failed to load chart data
          </div>
        ) : (
          <OverviewChart data={chartData || []} chartType={chartType} />
        )}
      </div>
    </motion.div>
  );
}
