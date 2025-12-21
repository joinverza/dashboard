import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import { Skeleton } from '@/components/ui/skeleton';
import { cn } from "@/lib/utils";
import { useMockData } from "@/contexts/MockDataContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function NotificationPopover() {
  const { notifications = [] } = useMockData();
  const { theme } = useTheme();
  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0;

  const getTypeStyles = (type: string) => {
    switch (type) {
      case "success":
        return "bg-verza-emerald/20 text-verza-emerald";
      case "warning":
        return "bg-yellow-500/20 text-yellow-500";
      case "error":
        return "bg-red-500/20 text-red-500";
      default:
        return "bg-blue-500/20 text-blue-500";
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("relative", theme === "dark" ? "bg-black" : "bg-white")}
          data-testid="button-notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-verza-kelly text-[10px] font-bold text-white flex items-center justify-center"
            >
              {unreadCount}
            </motion.span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-80 p-0", theme === "dark" ? "bg-black" : "bg-white")} align="end">
          <div className="p-4 border-b border-border">
          <h3 className="font-semibold">Notifications</h3>
          <p className="text-sm text-muted-foreground">
            You have {unreadCount} unread notifications
          </p>
        </div>
        <div className="max-h-80 overflow-y-auto">
          <AnimatePresence>
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "p-4 border-b border-border last:border-0 hover-elevate cursor-pointer",
                  !notification.isRead && "bg-verza-emerald/5"
                )}
                data-testid={`notification-item-${notification.id}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full mt-2 flex-shrink-0",
                      getTypeStyles(notification.type)
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {notification.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.timestamp}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="p-3 border-t border-border">
          <Button variant="ghost" className="w-full text-sm text-verza-emerald">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
