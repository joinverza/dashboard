import type { MetricCard, OverviewData, ProductCard, Message, Notification, UserProfile } from '@/types/dashboard';

export const currentUser: UserProfile = {
  id: '1',
  name: 'Anne Cooper',
  email: 'anne.cooper@velvet.com',
  avatar: '',
  role: 'Administrator',
};

export const metricCards: MetricCard[] = [
  { id: '1', label: 'Total Balance', value: '$214,210', percentChange: 1.29, isPositive: true, icon: 'lock' },
  { id: '2', label: 'Total Income', value: '$214,210', percentChange: 1.29, isPositive: true, icon: 'trending-up' },
  { id: '3', label: 'Total Expenses', value: '$214,210', percentChange: -1.29, isPositive: false, icon: 'trending-down' },
  { id: '4', label: 'Total Sales', value: '$214,210', percentChange: 1.29, isPositive: true, icon: 'shopping-bag' },
];

export const overviewData: OverviewData = {
  day: [
    { label: '6AM', value: 12000 },
    { label: '9AM', value: 28000 },
    { label: '12PM', value: 35000 },
    { label: '3PM', value: 42000 },
    { label: '6PM', value: 52147 },
    { label: '9PM', value: 48000 },
  ],
  week: [
    { label: 'Mon', value: 32000 },
    { label: 'Tue', value: 45000 },
    { label: 'Wed', value: 38000 },
    { label: 'Thu', value: 52147 },
    { label: 'Fri', value: 48000 },
    { label: 'Sat', value: 55000 },
    { label: 'Sun', value: 42000 },
  ],
  month: [
    { label: 'Jan', value: 18000 },
    { label: 'Feb', value: 25000 },
    { label: 'Mar', value: 42000 },
    { label: 'Apr', value: 52147 },
    { label: 'May', value: 38000 },
    { label: 'Jun', value: 45000 },
    { label: 'Jul', value: 55000 },
    { label: 'Aug', value: 48000 },
  ],
  year: [
    { label: '2019', value: 180000 },
    { label: '2020', value: 220000 },
    { label: '2021', value: 350000 },
    { label: '2022', value: 521470 },
    { label: '2023', value: 480000 },
    { label: '2024', value: 620000 },
  ],
};

export const productCards: ProductCard[] = [
  { id: '1', title: 'Sales Products', value: '124.321+', icon: 'package', chartData: [40, 65, 45, 70, 55, 80, 60] },
  { id: '2', title: 'Stock Products', value: '421+', icon: 'archive', chartData: [30, 50, 40, 60, 45, 55, 50] },
  { id: '3', title: 'Save Products', value: '140.214+', icon: 'bookmark', chartData: [45, 60, 50, 75, 65, 85, 70] },
  { id: '4', title: 'Return Products', value: '421+', icon: 'refresh-cw', chartData: [25, 40, 35, 50, 40, 45, 42] },
];

export const messages: Message[] = [
  {
    id: '1',
    senderId: '2',
    senderName: 'John Smith',
    senderAvatar: '',
    subject: 'Project Update',
    preview: 'Hey, just wanted to give you a quick update on the project status...',
    content: 'Hey, just wanted to give you a quick update on the project status. We have completed the first phase and are now moving to the integration stage. Let me know if you need any additional information.',
    timestamp: '2 hours ago',
    isRead: false,
    isStarred: true,
  },
  {
    id: '2',
    senderId: '3',
    senderName: 'Sarah Johnson',
    senderAvatar: '',
    subject: 'Meeting Tomorrow',
    preview: 'Hi Anne, reminder about our meeting tomorrow at 10 AM...',
    content: 'Hi Anne, reminder about our meeting tomorrow at 10 AM in Conference Room B. We will be discussing the Q4 targets and budget allocation. Please come prepared with your department updates.',
    timestamp: '5 hours ago',
    isRead: true,
    isStarred: false,
  },
  {
    id: '3',
    senderId: '4',
    senderName: 'Mike Davis',
    senderAvatar: '',
    subject: 'Invoice Approved',
    preview: 'The invoice for the marketing campaign has been approved...',
    content: 'The invoice for the marketing campaign has been approved. Payment will be processed within 3-5 business days. Thank you for your patience.',
    timestamp: '1 day ago',
    isRead: true,
    isStarred: false,
  },
  {
    id: '4',
    senderId: '5',
    senderName: 'Emily Brown',
    senderAvatar: '',
    subject: 'New Feature Request',
    preview: 'We have received a new feature request from the client...',
    content: 'We have received a new feature request from the client. They would like to add real-time analytics to the dashboard. Can we schedule a call to discuss the feasibility and timeline?',
    timestamp: '2 days ago',
    isRead: false,
    isStarred: true,
  },
];

export const notifications: Notification[] = [
  { id: '1', title: 'New Order', description: 'You have received a new order #1234', timestamp: '5 min ago', isRead: false, type: 'success' },
  { id: '2', title: 'Payment Received', description: 'Payment of $1,250 received', timestamp: '1 hour ago', isRead: false, type: 'info' },
  { id: '3', title: 'Low Stock Alert', description: 'Product SKU-456 is running low', timestamp: '3 hours ago', isRead: true, type: 'warning' },
  { id: '4', title: 'System Update', description: 'System maintenance scheduled', timestamp: '1 day ago', isRead: true, type: 'info' },
];

export const navItems = [
  { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
  { path: '/store', label: 'Store', icon: 'Store' },
  { path: '/analytics', label: 'Analytics', icon: 'BarChart3' },
  { path: '/wallet', label: 'Wallet', icon: 'Wallet' },
  { path: '/invoice', label: 'Invoice', icon: 'FileText' },
  { path: '/category', label: 'Category', icon: 'FolderOpen' },
  { path: '/message', label: 'Message', icon: 'MessageSquare' },
  { path: '/settings', label: 'Setting', icon: 'Settings' },
];
