import { motion } from "framer-motion";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageSquare, BookOpen, Video, Users, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { bankingService, getBankingErrorMessage } from "@/services/bankingService";

export default function VerifierHelp() {
  const queryClient = useQueryClient();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [articlesQuery, ticketsQuery] = useQueries({
    queries: [
      { queryKey: ["verifier", "support", "articles", search], queryFn: () => bankingService.listSupportArticles({ search: search || undefined }) },
      { queryKey: ["verifier", "support", "tickets"], queryFn: () => bankingService.listSupportTickets({ page: 1, limit: 5 }) },
    ],
  });

  const createTicketMutation = useMutation({
    mutationFn: () => bankingService.createSupportTicket({ subject, message }),
    onSuccess: async () => {
      toast.success("Support ticket created.");
      setSubject("");
      setMessage("");
      await queryClient.invalidateQueries({ queryKey: ["verifier", "support", "tickets"] });
    },
    onError: (error) => toast.error(getBankingErrorMessage(error, "Failed to create support ticket")),
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-10"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Help & Support</h1>
        <p className="text-muted-foreground">Find answers to common questions or contact our support team.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Common questions about the verification process.</CardDescription>
            </CardHeader>
            <CardContent>
              <Input placeholder="Search help articles..." value={search} onChange={(e) => setSearch(e.target.value)} className="mb-4" />
              {articlesQuery.isLoading ? <div className="flex justify-center py-6"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div> : null}
              {articlesQuery.error ? <div className="text-sm text-red-400 mb-4">{getBankingErrorMessage(articlesQuery.error, "Failed to load support articles.")}</div> : null}
              <Accordion type="single" collapsible className="w-full">
                {(articlesQuery.data ?? []).map((article) => (
                  <AccordionItem key={article.articleId} value={article.articleId}>
                    <AccordionTrigger>{article.title}</AccordionTrigger>
                    <AccordionContent>{article.content}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-muted/50 transition-colors cursor-pointer group">
              <CardContent className="pt-6 flex flex-col items-center text-center gap-2">
                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h3 className="font-medium">Documentation</h3>
                <p className="text-xs text-muted-foreground">Read the full verifier guide</p>
              </CardContent>
            </Card>
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-muted/50 transition-colors cursor-pointer group">
              <CardContent className="pt-6 flex flex-col items-center text-center gap-2">
                <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                  <Video className="h-5 w-5" />
                </div>
                <h3 className="font-medium">Video Tutorials</h3>
                <p className="text-xs text-muted-foreground">Watch step-by-step guides</p>
              </CardContent>
            </Card>
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 hover:bg-muted/50 transition-colors cursor-pointer group">
              <CardContent className="pt-6 flex flex-col items-center text-center gap-2">
                <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="font-medium">Community</h3>
                <p className="text-xs text-muted-foreground">Join the verifier forum</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 sticky top-6">
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Still need help? Send us a message.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Brief description of the issue" value={subject} onChange={(e) => setSubject(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Describe your issue in detail..." className="min-h-[120px]" value={message} onChange={(e) => setMessage(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="attachments">Attachments (Optional)</Label>
                <Input id="attachments" type="file" className="text-xs" />
              </div>
              <Button className="w-full bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow" onClick={() => createTicketMutation.mutate()} disabled={createTicketMutation.isPending || !subject || !message}>
                <MessageSquare className="mr-2 h-4 w-4" /> Send Ticket
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Average response time: &lt; 24 hours
              </p>
              <div className="pt-2 border-t border-border/50 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Recent tickets</p>
                {ticketsQuery.isLoading ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : null}
                {(ticketsQuery.data?.items ?? []).map((ticket) => (
                  <div key={ticket.ticketId} className="text-xs flex justify-between">
                    <span className="truncate">{ticket.subject}</span>
                    <span className="uppercase">{ticket.status}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
