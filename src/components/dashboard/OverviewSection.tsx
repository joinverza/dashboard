import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
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
      <Card className="p-4 md:p-6 bg-card/80 backdrop-blur-sm border-card-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-semibold text-foreground">Overview</h2>

          <div className="flex flex-wrap items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 min-w-[120px]"
                  data-testid="dropdown-income-type"
                >
                  {incomeTypes.find((t) => t.value === incomeType)?.label}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {incomeTypes.map((type) => (
                  <DropdownMenuItem
                    key={type.value}
                    onClick={() => setIncomeType(type.value)}
                    data-testid={`dropdown-item-${type.value}`}
                  >
                    {type.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <ChartTypeToggle chartType={chartType} onChange={setChartType} />
          </div>
        </div>

        <div className="mb-6">
          <Tabs
            value={timePeriod}
            onValueChange={(v) => setTimePeriod(v as TimePeriod)}
            className="w-full"
          >
            <TabsList className="bg-muted/50 p-1">
              {timePeriods.map((period) => (
                <TabsTrigger
                  key={period.value}
                  value={period.value}
                  className="data-[state=active]:bg-verza-emerald/20 data-[state=active]:text-verza-emerald transition-colors"
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
      </Card>
    </motion.div>
  );
}
