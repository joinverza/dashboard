import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Send, 
  MoreVertical, 
  Paperclip, 
  Minimize2, 
  Maximize2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'other' | 'system';
  time: string;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: {
    name: string;
    role: string;
    avatar?: string;
    status?: 'online' | 'offline' | 'busy';
  };
  initialMessages?: Message[];
}

export function ChatModal({ isOpen, onClose, recipient, initialMessages = [] }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && initialMessages.length === 0) {
      // Add a welcome message if no messages exist
      setMessages([
        {
          id: 'system-1',
          text: `This is the beginning of your conversation with ${recipient.name}.`,
          sender: 'system',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: 'welcome',
          text: `Hello! How can I help you today?`,
          sender: 'other',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } else if (isOpen) {
      setMessages(initialMessages);
    }
  }, [isOpen, recipient.name, initialMessages]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // Simulate response
    setTimeout(() => {
      const responses = [
        "I'll look into that for you.",
        "Could you provide more details?",
        "That sounds good.",
        "Please hold on a moment.",
        "I've updated your file."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'other',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, responseMessage]);
    }, 1500 + Math.random() * 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          />
          
          {/* Chat Window */}
          <motion.div
            initial={{ y: "100%", opacity: 0, scale: 0.95 }}
            animate={{ 
              y: isMinimized ? "calc(100% - 60px)" : 0, 
              opacity: 1, 
              scale: 1,
              height: isMinimized ? "auto" : "600px"
            }}
            exit={{ y: "100%", opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "fixed bottom-0 right-0 md:bottom-4 md:right-4 w-full md:w-[400px] bg-background/95 backdrop-blur-xl border border-border/50 shadow-2xl z-50 flex flex-col overflow-hidden",
              "md:rounded-2xl",
              !isMinimized && "h-[80vh] md:h-[600px]"
            )}
          >
            {/* Header */}
            <div 
              className="p-4 border-b border-border/50 flex items-center justify-between bg-card/50 cursor-pointer"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-10 w-10 border-2 border-background">
                    <AvatarImage src={recipient.avatar} />
                    <AvatarFallback className="bg-verza-forest text-white">
                      {recipient.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {recipient.status === 'online' && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{recipient.name}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                      {recipient.role}
                    </Badge>
                    {recipient.status === 'online' && (
                      <span className="text-xs text-muted-foreground">Online</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMinimized(!isMinimized);
                  }}
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.info("Chat options coming soon");
                  }}
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            {!isMinimized && (
              <>
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/5 scroll-smooth"
                >
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={cn(
                        "flex flex-col max-w-[85%]",
                        msg.sender === "user" ? "ml-auto items-end" : "items-start"
                      )}
                    >
                      <div className={cn(
                        "p-3 rounded-2xl text-sm shadow-sm",
                        msg.sender === "user" 
                          ? "bg-primary text-primary-foreground rounded-tr-sm" 
                          : msg.sender === "system"
                          ? "bg-secondary/50 text-xs text-center w-full my-2 text-muted-foreground italic shadow-none"
                          : "bg-card border border-border/50 rounded-tl-sm"
                      )}>
                        {msg.text}
                      </div>
                      {msg.sender !== "system" && (
                        <span className="text-[10px] text-muted-foreground mt-1 px-1 select-none">
                          {msg.time}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-border/50 bg-card/50 backdrop-blur-md">
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="shrink-0 text-muted-foreground hover:text-foreground"
                      onClick={() => toast.info("Attachment feature coming soon")}
                    >
                      <Paperclip className="w-5 h-5" />
                    </Button>
                    <Input 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message..." 
                      className="bg-secondary/20 border-border/50 focus-visible:ring-verza-emerald"
                      autoFocus
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim()}
                      className="shrink-0 bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
