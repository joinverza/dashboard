export interface MetricCard {
  id: string;
  label: string;
  value: string;
  percentChange: number;
  isPositive: boolean;
  icon: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface OverviewData {
  day: ChartDataPoint[];
  week: ChartDataPoint[];
  month: ChartDataPoint[];
  year: ChartDataPoint[];
}

export interface ProductCard {
  id: string;
  title: string;
  value: string;
  icon: string;
  chartData: number[];
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  subject: string;
  preview: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isStarred: boolean;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export type TimePeriod = 'day' | 'week' | 'month' | 'year';
export type ChartType = 'area' | 'bar';
export type IncomeType = 'income' | 'expense' | 'profit';

export interface NavItem {
  path: string;
  label: string;
  icon: string;
}
