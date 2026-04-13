import { motion } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, CreditCard, Star, Settings, Check, Clock, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { bankingService, getBankingErrorMessage } from "@/services/bankingService";
import { toast } from "sonner";
import { useMemo, useState } from "react";

export default function VerifierNotifications() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("all");
  const notificationsQuery = useQuery({
    queryKey: ["verifier", "notifications", tab],
    queryFn: () => bankingService.getNotifications({ limit: 200 }),
  });
  const markOneMutation = useMutation({
    mutationFn: (id: string) => bankingService.markNotificationRead(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["verifier", "notifications"] });
    },
    onError: (error) => toast.error(getBankingErrorMessage(error, "Failed to mark notification as read")),
  });
  const markAllMutation = useMutation({
    mutationFn: () => bankingService.markAllNotificationsRead(),
    onSuccess: async () => {
      toast.success("All notifications marked as read.");
      await queryClient.invalidateQueries({ queryKey: ["verifier", "notifications"] });
    },
    onError: (error) => toast.error(getBankingErrorMessage(error, "Failed to mark all notifications as read")),
  });

  const notifications = useMemo(() => {
    const rows = notificationsQuery.data ?? [];
    if (tab === "jobs") return rows.filter((n) => n.type === "transaction");
    if (tab === "payments") return rows.filter((n) => n.type === "transaction");
    if (tab === "reviews") return rows.filter((n) => n.type === "alert");
    if (tab === "system") return rows.filter((n) => n.type === "update");
    return rows;
  }, [notificationsQuery.data, tab]);

  const getIcon = (type: string) => {
    switch (type) {
      case "transaction": return <CreditCard className="h-4 w-4 text-verza-emerald" />;
      case "alert": return <Star className="h-4 w-4 text-yellow-400" />;
      case "job": return <Briefcase className="h-4 w-4 text-blue-400" />;
      default: return <Settings className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const renderNotificationList = (
    <Card className="bg-card/80 backdrop-blur-sm border-border/50">
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {notificationsQuery.isLoading ? (
            <div className="py-10 text-center"><Loader2 className="h-6 w-6 animate-spin inline text-primary" /></div>
          ) : notificationsQuery.error ? (
            <div className="py-10 px-4 text-sm text-red-400 text-center">{getBankingErrorMessage(notificationsQuery.error, "Failed to load notifications.")}</div>
          ) : notifications.length === 0 ? (
            <div className="py-10 px-4 text-sm text-muted-foreground text-center">No notifications available.</div>
          ) : (
            notifications.map((notification) => (
              <button
                key={notification.id}
                className={`w-full text-left flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors ${!notification.read ? 'bg-verza-emerald/5' : ''}`}
                onClick={() => {
                  if (!notification.read) markOneMutation.mutate(notification.id);
                }}
              >
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
                      <Clock className="mr-1 h-3 w-3" /> {new Date(notification.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {notification.message}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );

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
          <Button variant="outline" size="sm" onClick={() => markAllMutation.mutate()} disabled={markAllMutation.isPending}>
            <Check className="mr-2 h-4 w-4" /> Mark all as read
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" onValueChange={setTab} className="space-y-6">
        <TabsList className="bg-card/50 backdrop-blur-sm border border-border/50 p-1">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="jobs">Job Alerts</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">{renderNotificationList}</TabsContent>
        <TabsContent value="jobs" className="space-y-4">{renderNotificationList}</TabsContent>
        <TabsContent value="payments" className="space-y-4">{renderNotificationList}</TabsContent>
        <TabsContent value="reviews" className="space-y-4">{renderNotificationList}</TabsContent>
        <TabsContent value="system" className="space-y-4">{renderNotificationList}</TabsContent>
      </Tabs>
    </motion.div>
  );
}
