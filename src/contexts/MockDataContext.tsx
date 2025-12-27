/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, type ReactNode } from "react";
import type {
  MetricCard,
  ChartDataPoint,
  ProductCard,
  Message,
  Notification,
  UserProfile,
} from "@/types/dashboard";

interface MockDataContextType {
  metricCards: MetricCard[];
  verifierMetricCards: MetricCard[];
  enterpriseMetricCards: MetricCard[];
  adminMetricCards: MetricCard[];
  chartData: Record<string, ChartDataPoint[]>;
  productCards: ProductCard[];
  messages: Message[];
  notifications: Notification[];
  userProfile: UserProfile;
}

const mockMetricCards: MetricCard[] = [
  {
    id: "1",
    label: "Total Balance",
    value: "$214,210",
    percentChange: 12.5,
    isPositive: true,
    icon: "trending-up",
  },
  {
    id: "2",
    label: "Total Income",
    value: "$214,210",
    percentChange: 12.5,
    isPositive: true,
    icon: "trending-up",
  },
  {
    id: "3",
    label: "Total Expense",
    value: "$214,210",
    percentChange: 12.5,
    isPositive: true,
    icon: "trending-down",
  },
  {
    id: "4",
    label: "Total Saved",
    value: "$214,210",
    percentChange: 12.5,
    isPositive: true,
    icon: "trending-up",
  },
];

const mockVerifierMetricCards: MetricCard[] = [
  {
    id: "v1",
    label: "Pending Verifications",
    value: "42",
    percentChange: 5.2,
    isPositive: true,
    icon: "alert-circle",
  },
  {
    id: "v2",
    label: "Verified Items",
    value: "1,205",
    percentChange: 18.3,
    isPositive: true,
    icon: "check-circle",
  },
  {
    id: "v3",
    label: "Rejection Rate",
    value: "2.4%",
    percentChange: -0.5,
    isPositive: true, // Lower is better
    icon: "x-circle",
  },
  {
    id: "v4",
    label: "Avg. Response Time",
    value: "1.2h",
    percentChange: -15,
    isPositive: true, // Lower is better
    icon: "clock",
  },
];

const mockEnterpriseMetricCards: MetricCard[] = [
  {
    id: "e1",
    label: "Total Supply Chain",
    value: "12,500",
    percentChange: 8.4,
    isPositive: true,
    icon: "package",
  },
  {
    id: "e2",
    label: "Active Partners",
    value: "156",
    percentChange: 12,
    isPositive: true,
    icon: "users",
  },
  {
    id: "e3",
    label: "Carbon Footprint",
    value: "450t",
    percentChange: -5.2,
    isPositive: true, // Lower is better
    icon: "leaf",
  },
  {
    id: "e4",
    label: "Revenue",
    value: "$4.2M",
    percentChange: 22.1,
    isPositive: true,
    icon: "dollar-sign",
  },
];

const mockAdminMetricCards: MetricCard[] = [
  {
    id: "a1",
    label: "Total Users",
    value: "45,231",
    percentChange: 15.4,
    isPositive: true,
    icon: "users",
  },
  {
    id: "a2",
    label: "System Health",
    value: "99.9%",
    percentChange: 0,
    isPositive: true,
    icon: "activity",
  },
  {
    id: "a3",
    label: "Active Sessions",
    value: "3,402",
    percentChange: 5.6,
    isPositive: true,
    icon: "monitor",
  },
  {
    id: "a4",
    label: "Storage Used",
    value: "4.2TB",
    percentChange: 8.1,
    isPositive: false, // Higher cost
    icon: "database",
  },
];

const mockChartData: Record<string, ChartDataPoint[]> = {
  day: [
    { label: "Jan", value: 400 },
    { label: "Feb", value: 300 },
    { label: "Mar", value: 500 },
    { label: "Apr", value: 200 },
    { label: "May", value: 400 },
    { label: "Jun", value: 300 },
    { label: "Jul", value: 500 },
  ],
  week: [
    { label: "Jan", value: 2400 },
    { label: "Feb", value: 1398 },
    { label: "Mar", value: 9800 },
    { label: "Apr", value: 3908 },
    { label: "May", value: 4800 },
  ],
  month: [
    { label: "Jan", value: 4000 },
    { label: "Feb", value: 3000 },
    { label: "Mar", value: 2000 },
    { label: "Apr", value: 2780 },
    { label: "May", value: 1890 },
    { label: "Jun", value: 2390 },
    { label: "Jul", value: 3490 },
  ],
  year: [
    { label: "Jan", value: 40000 },
    { label: "Feb", value: 30000 },
    { label: "Mar", value: 20000 },
    { label: "Apr", value: 27800 },
    { label: "May", value: 18900 },
    { label: "Jun", value: 23900 },
    { label: "Jul", value: 34900 },
  ],
};

const mockProductCards: ProductCard[] = [
  {
    id: "1",
    title: "Sales Products",
    value: "124,321+",
    icon: "shopping-bag",
    chartData: [65, 78, 90, 81, 56, 55, 40],
  },
  {
    id: "2",
    title: "Stock Products",
    value: "421+",
    icon: "package",
    chartData: [45, 52, 48, 65, 72, 81, 95],
  },
  {
    id: "3",
    title: "Rare Products",
    value: "140,214+",
    icon: "gift",
    chartData: [35, 41, 62, 45, 58, 71, 88],
  },
  {
    id: "4",
    title: "Return Products",
    value: "421+",
    icon: "undo",
    chartData: [25, 18, 22, 15, 10, 8, 12],
  },
];

const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "1",
    senderName: "Anne Cooper",
    senderAvatar: "AC",
    subject: "Project Update",
    preview: "Hi, the project is progressing well...",
    content:
      "Hi, the project is progressing well. We should have the first draft ready by end of week.",
    timestamp: "2 hours ago",
    isRead: false,
    isStarred: false,
  },
  {
    id: "2",
    senderId: "2",
    senderName: "John Smith",
    senderAvatar: "JS",
    subject: "Meeting Tomorrow",
    preview: "Don't forget about our meeting tomorrow...",
    content:
      "Don't forget about our meeting tomorrow at 2 PM. Please review the agenda beforehand.",
    timestamp: "4 hours ago",
    isRead: true,
    isStarred: false,
  },
  {
    id: "3",
    senderId: "3",
    senderName: "Sarah Williams",
    senderAvatar: "SW",
    subject: "Budget Approval",
    preview: "The Q3 budget has been approved...",
    content:
      "The Q3 budget has been approved. Please check the attached document for details.",
    timestamp: "1 day ago",
    isRead: true,
    isStarred: true,
  },
  {
    id: "4",
    senderId: "4",
    senderName: "Mike Johnson",
    senderAvatar: "MJ",
    subject: "Code Review",
    preview: "Please review the pull request I submitted...",
    content:
      "Please review the pull request I submitted. It includes the new authentication module.",
    timestamp: "2 days ago",
    isRead: true,
    isStarred: false,
  },
];

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "System Update",
    description: "A new system update is available",
    timestamp: "5 minutes ago",
    isRead: false,
    type: "success",
  },
  {
    id: "2",
    title: "Low Storage",
    description: "Your storage is running low",
    timestamp: "30 minutes ago",
    isRead: false,
    type: "warning",
  },
  {
    id: "3",
    title: "Transaction Failed",
    description: "Your recent transaction could not be processed",
    timestamp: "2 hours ago",
    isRead: true,
    type: "error",
  },
  {
    id: "4",
    title: "Payment Received",
    description: "You received a payment of $5,000",
    timestamp: "5 hours ago",
    isRead: true,
    type: "success",
  },
];

const mockUserProfile: UserProfile = {
  id: "1",
  name: "Anne Cooper",
  email: "anne.cooper@example.com",
  avatar: "AC",
  role: "Admin",
};

const MockDataContext = createContext<MockDataContextType | undefined>(
  undefined
);

export function MockDataProvider({ children }: { children: ReactNode }) {
  const value: MockDataContextType = {
    metricCards: mockMetricCards,
    verifierMetricCards: mockVerifierMetricCards,
    enterpriseMetricCards: mockEnterpriseMetricCards,
    adminMetricCards: mockAdminMetricCards,
    chartData: mockChartData,
    productCards: mockProductCards,
    messages: mockMessages,
    notifications: mockNotifications,
    userProfile: mockUserProfile,
  };

  return (
    <MockDataContext.Provider value={value}>
      {children}
    </MockDataContext.Provider>
  );
}

export function useMockData() {
  const context = useContext(MockDataContext);
  if (context === undefined) {
    throw new Error("useMockData must be used within a MockDataProvider");
  }
  return context;
}
