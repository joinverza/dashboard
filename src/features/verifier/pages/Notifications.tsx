import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, CreditCard, Star, Settings, Check, Trash2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function VerifierNotifications() {
  const notifications = [
    {
      id: 1,
      type: "job",
      title: "New Job Available",
      message: "A new Corporate KYC verification request matches your profile.",
      time: "2 mins ago",
      read: false,
    },
    {
      id: 2,
      type: "payment",
      title: "Payment Received",
      message: "You received $45.00 for verifying Request #8832.",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 3,
      type: "review",
      title: "New 5-Star Review",
      message: "Client 'TechCorp' left you a 5-star rating: 'Excellent service!'",
      time: "1 day ago",
      read: true,
    },
    {
      id: 4,
      type: "system",
      title: "System Maintenance",
      message: "Scheduled maintenance on Sunday at 02:00 UTC.",
      time: "2 days ago",
      read: true,
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "job": return <Briefcase className="h-4 w-4 text-blue-400" />;
      case "payment": return <CreditCard className="h-4 w-4 text-verza-emerald" />;
      case "review": return <Star className="h-4 w-4 text-yellow-400" />;
      default: return <Settings className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Notifications</h1>
          <p className="text-muted-foreground">Stay updated on your jobs, payments, and system alerts.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Check className="mr-2 h-4 w-4" /> Mark all as read
          </Button>
          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20">
            <Trash2 className="mr-2 h-4 w-4" /> Clear all
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-card/50 backdrop-blur-sm border border-border/50 p-1">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="jobs">Job Alerts</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {notifications.map((notification) => (
                  <div key={notification.id} className={`flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors ${!notification.read ? 'bg-verza-emerald/5' : ''}`}>
                    <div className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center border border-border/50 bg-card ${!notification.read ? 'shadow-[0_0_10px_-3px_rgba(16,185,129,0.3)]' : ''}`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm text-foreground">
                          {notification.title}
                          {!notification.read && <Badge variant="secondary" className="ml-2 h-5 bg-verza-emerald/20 text-verza-emerald border-verza-emerald/30 text-[10px] px-1.5">NEW</Badge>}
                        </p>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="mr-1 h-3 w-3" /> {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       {/* Actions could go here */}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Other tabs would filter the list similarly */}
      </Tabs>
    </motion.div>
  );
}
