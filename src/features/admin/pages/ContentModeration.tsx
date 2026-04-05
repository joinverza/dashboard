import { 
  Flag, Check, X, MessageSquare, Image, User, AlertTriangle, Loader2
} from 'lucide-react';
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { bankingService, getBankingErrorMessage } from '@/services/bankingService';

export default function ContentModeration() {
  const queryClient = useQueryClient();
  const [queueQuery, historyQuery, rulesQuery] = useQueries({
    queries: [
      { queryKey: ["admin", "moderation", "queue"], queryFn: () => bankingService.listModerationQueue({ status: "pending", page: 1, limit: 50 }) },
      { queryKey: ["admin", "moderation", "history"], queryFn: () => bankingService.listModerationHistory({ page: 1, limit: 50 }) },
      { queryKey: ["admin", "moderation", "rules"], queryFn: () => bankingService.listModerationRules() },
    ],
  });

  const actionMutation = useMutation({
    mutationFn: ({ contentId, action }: { contentId: string; action: "approve" | "remove" }) => bankingService.moderateContent(contentId, { action }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["admin", "moderation", "queue"] }),
        queryClient.invalidateQueries({ queryKey: ["admin", "moderation", "history"] }),
      ]);
      toast.success("Moderation action submitted.");
    },
    onError: (error) => toast.error(getBankingErrorMessage(error, "Moderation action failed")),
  });

  const flaggedContent = queueQuery.data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
            Content Moderation
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and take action on flagged user content
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50" onClick={() => toast.info("Queue refresh triggered")}>
            <Flag className="h-4 w-4 mr-2" />
            {flaggedContent.length} Items in Queue
          </Button>
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="history">Moderation History</TabsTrigger>
          <TabsTrigger value="settings">Auto-Mod Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {queueQuery.isLoading ? <div className="flex justify-center py-10"><Loader2 className="h-7 w-7 animate-spin text-primary" /></div> : null}
          {queueQuery.error ? <div className="text-sm text-red-400">{getBankingErrorMessage(queueQuery.error, "Failed to load moderation queue.")}</div> : null}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flaggedContent.map((item) => (
              <Card key={item.contentId} className="bg-card/80 backdrop-blur-sm border-border/50 flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="capitalize flex items-center gap-1">
                      {item.contentType === 'review' && <MessageSquare className="h-3 w-3" />}
                      {item.contentType === 'profile_pic' && <Image className="h-3 w-3" />}
                      {item.contentType === 'message' && <User className="h-3 w-3" />}
                      {item.contentType}
                    </Badge>
                    <Badge className={
                      item.severity === 'critical' ? 'bg-red-600' : 
                      item.severity === 'high' ? 'bg-red-500' : 'bg-orange-500'
                    }>
                      {item.severity}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    {item.reason}
                  </CardTitle>
                  <CardDescription>
                    Reported {new Date(item.reportedAt).toLocaleString()} by System
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="p-4 bg-muted/50 rounded-md text-sm border border-border/50">
                    <div className="font-semibold mb-2 text-xs text-muted-foreground uppercase tracking-wider">
                      Author: {item.author}
                    </div>
                    {item.contentType === 'profile_pic' ? (
                      <div className="h-32 bg-gray-200 rounded flex items-center justify-center text-muted-foreground italic">
                        [Image Preview Placeholder]
                      </div>
                    ) : (
                      <p className="italic">"{item.content}"</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between gap-2 border-t pt-4">
                  <Button variant="ghost" className="w-full text-verza-emerald hover:text-green-700 hover:bg-green-50" onClick={() => actionMutation.mutate({ contentId: item.contentId, action: "approve" })}>
                    <Check className="h-4 w-4 mr-2" /> Ignore
                  </Button>
                  <Button variant="ghost" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => actionMutation.mutate({ contentId: item.contentId, action: "remove" })}>
                    <X className="h-4 w-4 mr-2" /> Remove
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Moderation History</CardTitle>
              <CardDescription>Past actions taken by moderators</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Moderator</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(historyQuery.data?.items ?? []).map((item) => (
                    <TableRow key={item.contentId}>
                      <TableCell className="font-mono text-xs">{new Date(item.reportedAt).toLocaleDateString()}</TableCell>
                      <TableCell>System</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={item.status === 'removed' ? 'border-red-500 text-red-500' : ''}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.contentType}</TableCell>
                      <TableCell>{item.reason}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Auto-Moderation Rules</CardTitle>
              <CardDescription>Configure automated content filtering</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-background/50">
                <div className="space-y-0.5">
                  <h4 className="font-medium">{rulesQuery.data?.[0]?.name ?? "No rules found"}</h4>
                  <p className="text-sm text-muted-foreground">{rulesQuery.data?.[0]?.description ?? "Configure automated moderation logic."}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{rulesQuery.data?.[0]?.mode ?? "Default"}</Badge>
                  <Button variant="outline" size="sm" onClick={() => toast.success("Filter settings updated")}>Configure</Button>
                </div>
              </div>
              {(rulesQuery.data ?? []).slice(1).map((rule) => (
                <div key={rule.ruleId} className="flex items-center justify-between p-4 border rounded-lg bg-background/50">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">{rule.name}</h4>
                    <p className="text-sm text-muted-foreground">{rule.description ?? "Rule configuration"}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toast.success("Rule settings opened")}>Configure</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
