import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageSquare, BookOpen, Video, Users } from "lucide-react";

export default function VerifierHelp() {
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
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I increase my reputation score?</AccordionTrigger>
                  <AccordionContent>
                    Your reputation score is calculated based on accuracy, speed, and client reviews. Consistently completing jobs on time with high accuracy and receiving positive feedback will improve your score over time.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>When do I get paid for completed jobs?</AccordionTrigger>
                  <AccordionContent>
                    Payments are held in escrow and released immediately upon successful completion of a verification job. You can withdraw your earnings to your connected wallet at any time from the Earnings page.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>What happens if I reject a document?</AccordionTrigger>
                  <AccordionContent>
                    If you reject a document, you must provide a valid reason. The requester will be notified and can resubmit. Justified rejections do not negatively impact your reputation score.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>How does the staking system work?</AccordionTrigger>
                  <AccordionContent>
                    Verifiers must stake VERZA tokens to prove commitment and integrity. Higher stakes can unlock higher tier jobs and lower platform fees. If you act maliciously, your stake may be slashed.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger>Can I take a break from verifying?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you can enable "Vacation Mode" in your Profile Settings. This will pause new job assignments without affecting your reputation or standing.
                  </AccordionContent>
                </AccordionItem>
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
                <Input id="subject" placeholder="Brief description of the issue" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Describe your issue in detail..." className="min-h-[120px]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="attachments">Attachments (Optional)</Label>
                <Input id="attachments" type="file" className="text-xs" />
              </div>
              <Button className="w-full bg-verza-emerald hover:bg-verza-emerald/90 text-white shadow-glow">
                <MessageSquare className="mr-2 h-4 w-4" /> Send Ticket
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Average response time: &lt; 24 hours
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
