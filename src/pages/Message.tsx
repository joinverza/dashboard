import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Star,
  Plus,
  Send,
  ArrowLeft,
  MoreVertical,
  Paperclip,
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMockData } from "@/contexts/MockDataContext";
import type { Message } from "@/types/dashboard";
import { cn } from "@/lib/utils";

export default function MessagePage() {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);

  const { messages } = useMockData();
  const isLoading = false;
  const error = false;

  const [composeTo, setComposeTo] = useState("");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");

  const handleSendMessage = () => {
    if (!composeTo || !composeSubject || !composeBody) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Message sent successfully");
    setComposeOpen(false);
    setComposeTo("");
    setComposeSubject("");
    setComposeBody("");
  };

  const handleReply = () => {
    toast.success("Reply sent successfully");
  };

  const filteredMessages = (messages || []).filter(
    (m) =>
      m.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="h-[calc(100vh-8rem)]"
      data-testid="page-message"
    >
      <div className="flex h-full gap-4">
        <Card
          className={cn(
            "flex flex-col bg-card/80 backdrop-blur-sm border-card-border",
            selectedMessage
              ? "hidden md:flex md:w-80 lg:w-96"
              : "w-full md:w-80 lg:w-96"
          )}
        >
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between gap-2 mb-4">
              <h2 className="text-lg font-semibold">Messages</h2>
              <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    data-testid="button-compose"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>New Message</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <Input
                      placeholder="To: recipient@email.com"
                      data-testid="input-compose-to"
                      value={composeTo}
                      onChange={(e) => setComposeTo(e.target.value)}
                    />
                    <Input
                      placeholder="Subject"
                      data-testid="input-compose-subject"
                      value={composeSubject}
                      onChange={(e) => setComposeSubject(e.target.value)}
                    />
                    <Textarea
                      placeholder="Write your message..."
                      className="min-h-[200px]"
                      data-testid="input-compose-body"
                      value={composeBody}
                      onChange={(e) => setComposeBody(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setComposeOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-verza-emerald hover:bg-verza-kelly"
                        data-testid="button-send-compose"
                        onClick={handleSendMessage}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-messages"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            {isLoading ? (
              <div className="p-4 space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-2/3" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="p-4 text-center text-destructive">
                Failed to load messages
              </div>
            ) : (
              <AnimatePresence>
                {filteredMessages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedMessage(message)}
                    className={cn(
                      "p-4 border-b border-border cursor-pointer hover-elevate transition-colors",
                      !message.isRead && "bg-verza-emerald/5",
                      selectedMessage?.id === message.id &&
                        "bg-verza-emerald/10"
                    )}
                    data-testid={`message-item-${message.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarFallback className="bg-verza-forest text-white text-sm">
                          {message.senderName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className={cn(
                              "text-sm truncate",
                              !message.isRead && "font-semibold"
                            )}
                          >
                            {message.senderName}
                          </p>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {message.isStarred && (
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            )}
                            <span className="text-xs text-muted-foreground">
                              {message.timestamp}
                            </span>
                          </div>
                        </div>
                        <p
                          className={cn(
                            "text-sm truncate",
                            !message.isRead && "font-medium"
                          )}
                        >
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
            )}
          </ScrollArea>
        </Card>

        <AnimatePresence mode="wait">
          {selectedMessage && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="flex-1"
            >
              <Card className="h-full flex flex-col bg-card/80 backdrop-blur-sm border-card-border">
                <div className="p-4 border-b border-border flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden"
                      onClick={() => setSelectedMessage(null)}
                      data-testid="button-back-messages"
                    >
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-verza-forest text-white text-sm">
                        {selectedMessage.senderName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {selectedMessage.senderName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedMessage.timestamp}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      data-testid="button-star-message"
                      onClick={() => toast.success("Message starred")}
                    >
                      <Star
                        className={cn(
                          "h-5 w-5",
                          selectedMessage.isStarred &&
                            "text-yellow-500 fill-yellow-500"
                        )}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      data-testid="button-more-message"
                      onClick={() => toast.info("More options coming soon")}
                    >
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="p-6 flex-1 overflow-auto">
                  <h3 className="text-xl font-semibold mb-4">
                    {selectedMessage.subject}
                  </h3>
                  <p className="text-foreground leading-relaxed">
                    {selectedMessage.content}
                  </p>
                </div>

                <div className="p-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      data-testid="button-attach"
                      onClick={() => toast.info("Attachment feature coming soon")}
                    >
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Input
                      placeholder="Type your reply..."
                      className="flex-1"
                      data-testid="input-reply"
                    />
                    <Button
                      className="bg-verza-emerald hover:bg-verza-kelly"
                      data-testid="button-send-reply"
                      onClick={handleReply}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {!selectedMessage && (
          <Card className="hidden md:flex flex-1 items-center justify-center bg-card/80 backdrop-blur-sm border-card-border">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 rounded-full bg-verza-emerald/20 flex items-center justify-center mx-auto mb-4"
              >
                <Send className="h-8 w-8 text-verza-emerald" />
              </motion.div>
              <p className="text-muted-foreground">Select a message to view</p>
            </div>
          </Card>
        )}
      </div>
    </motion.div>
  );
}
