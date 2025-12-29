import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare,
  ShieldAlert,
  Wallet,
  Info,
  CheckCheck,
  Bell,
  Clock,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock Data
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: "alert",
    title: "Verification Required",
    message: "Your identity verification for Marketplace access is pending.",
    time: "10 min ago",
    read: false,
    action: "Verify Now"
  },
  {
    id: 2,
    type: "transaction",
    title: "Funds Received",
    message: "You received 50.00 ADA from addr1...9201",
    time: "2 hours ago",
    read: false,
    action: "View Transaction"
  },
  {
    id: 3,
    type: "update",
    title: "System Maintenance",
    message: "Scheduled maintenance on Oct 28, 02:00 UTC.",
    time: "1 day ago",
    read: true
  },
  {
    id: 4,
    type: "message",
    title: "New Message",
    message: "Verifier John Doe sent you a message regarding your application.",
    time: "2 days ago",
    read: true,
    action: "Reply"
  },
  {
    id: 5,
    type: "transaction",
    title: "Withdrawal Successful",
    message: "Your withdrawal of 120.00 ADA has been processed.",
    time: "3 days ago",
    read: true
  }
];

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const handleMarkRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? ({ ...n, read: true }) : n));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    return n.type === filter;
  });

  const handleNotificationClick = (id: number) => {
    handleMarkRead(id);
    toast.success("Notification marked as read");
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "alert": return <ShieldAlert className="w-5 h-5 text-red-500" />;
      case "transaction": return <Wallet className="w-5 h-5 text-verza-emerald" />;
      case "message": return <MessageSquare className="w-5 h-5 text-blue-500" />;
      default: return <Info className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6 p-6 pb-20 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your account activity.</p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="gap-2">
              <CheckCheck className="w-4 h-4" /> Mark all as read
            </Button>
          )}
          <Badge variant="secondary" className="px-3 py-1">
            {unreadCount} Unread
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
        {["all", "unread", "alert", "transaction", "message", "update"].map((f) => (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
            className="capitalize whitespace-nowrap"
          >
            {f}
          </Button>
        ))}
      </div>

      {/* Notifications List */}
      <Card className="border-border/50 bg-card/30 backdrop-blur-md min-h-[500px]">
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <div className="flex flex-col divide-y divide-border/50">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <Bell className="w-12 h-12 mb-4 opacity-20" />
                  <p>No notifications found</p>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {filteredNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        "flex items-start gap-4 p-4 hover:bg-secondary/20 transition-colors group cursor-pointer",
                        !notification.read && "bg-secondary/10"
                      )}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className={cn(
                        "mt-1 w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                        "bg-background border border-border/50"
                      )}>
                        {getIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex justify-between items-start gap-2">
                          <p className={cn("text-sm font-medium leading-none", !notification.read && "text-foreground")}>
                            {notification.title}
                          </p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {notification.time}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                        
                        {notification.action && (
                          <div className="pt-2">
                            <Button 
                              size="sm" 
                              variant="link" 
                              className="p-0 h-auto text-verza-emerald hover:text-verza-emerald/80 gap-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                toast.success(`Action: ${notification.action}`);
                              }}
                            >
                              {notification.action} <ChevronRight className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>

                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-verza-emerald mt-2 shrink-0" />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
