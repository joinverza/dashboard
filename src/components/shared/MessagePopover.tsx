import { MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Skeleton } from '@/components/ui/skeleton';
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { useMockData } from "@/contexts/MockDataContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function MessagePopover() {
  const { messages = [] } = useMockData();
  const { theme } = useTheme();
  const unreadCount = messages?.filter((m) => !m.isRead).length || 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("relative", theme === "dark" ? "bg-black" : "bg-white")}
          data-testid="button-messages"
        >
          <MessageSquare className="h-5 w-5" />
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
          <h3 className="font-semibold">Messages</h3>
          <p className="text-sm text-muted-foreground">
            You have {unreadCount} unread messages
          </p>
        </div>
        <div className="max-h-80 overflow-y-auto">
          <AnimatePresence>
            {messages.slice(0, 4).map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "p-4 border-b border-border last:border-0 hover-elevate cursor-pointer",
                  !message.isRead && "bg-verza-emerald/5"
                )}
                data-testid={`message-preview-${message.id}`}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-9 w-9 flex-shrink-0">
                    <AvatarFallback className="bg-verza-forest text-white text-xs">
                      {message.senderName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium truncate">
                        {message.senderName}
                      </p>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {message.timestamp}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-foreground truncate">
                      {message.subject}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {message.preview}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="p-3 border-t border-border">
          <Link href="/message">
            <Button
              variant="ghost"
              className="w-full text-sm text-verza-emerald"
            >
              View all messages
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
