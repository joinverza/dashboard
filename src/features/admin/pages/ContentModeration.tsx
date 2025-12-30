import { 
  Flag, Check, X, MessageSquare, Image, User, AlertTriangle
} from 'lucide-react';
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

export default function ContentModeration() {
  // Mock Data
  const flaggedContent = [
    {
      id: 'CNT-101',
      type: 'review',
      author: 'AngryUser123',
      content: 'This verifier is a complete scam! They stole my money and never replied!',
      reason: 'Harassment / Spam',
      date: '10 mins ago',
      severity: 'high'
    },
    {
      id: 'CNT-102',
      type: 'profile_pic',
      author: 'NewVerifier_LLC',
      content: 'https://placeholder.com/inappropriate-image.jpg', // Mock image
      reason: 'Inappropriate Content',
      date: '1 hour ago',
      severity: 'medium'
    },
    {
      id: 'CNT-103',
      type: 'message',
      author: 'SpamBot9000',
      content: 'Click here for free crypto: http://scam-link.com',
      reason: 'Phishing / ScamLink',
      date: '2 hours ago',
      severity: 'critical'
    }
  ];

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
            15 Items in Queue
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flaggedContent.map((item) => (
              <Card key={item.id} className="bg-card/80 backdrop-blur-sm border-border/50 flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="capitalize flex items-center gap-1">
                      {item.type === 'review' && <MessageSquare className="h-3 w-3" />}
                      {item.type === 'profile_pic' && <Image className="h-3 w-3" />}
                      {item.type === 'message' && <User className="h-3 w-3" />}
                      {item.type}
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
                    Reported {item.date} by System
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="p-4 bg-muted/50 rounded-md text-sm border border-border/50">
                    <div className="font-semibold mb-2 text-xs text-muted-foreground uppercase tracking-wider">
                      Author: {item.author}
                    </div>
                    {item.type === 'profile_pic' ? (
                      <div className="h-32 bg-gray-200 rounded flex items-center justify-center text-muted-foreground italic">
                        [Image Preview Placeholder]
                      </div>
                    ) : (
                      <p className="italic">"{item.content}"</p>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between gap-2 border-t pt-4">
                  <Button variant="ghost" className="w-full text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => toast.success("Content approved (Ignore)")}>
                    <Check className="h-4 w-4 mr-2" /> Ignore
                  </Button>
                  <Button variant="ghost" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => toast.error("Content removed and user warned")}>
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
                  {[
                    { date: '2025-04-10', mod: 'System', action: 'Auto-Flag', target: 'Comment #9921', reason: 'Keywords' },
                    { date: '2025-04-09', mod: 'Sarah C.', action: 'Remove', target: 'User @spammer', reason: 'Spam Bot' },
                    { date: '2025-04-08', mod: 'John D.', action: 'Warning', target: 'User @rude_guy', reason: 'Harassment' },
                  ].map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-xs">{item.date}</TableCell>
                      <TableCell>{item.mod}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={item.action === 'Remove' ? 'border-red-500 text-red-500' : ''}>
                          {item.action}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.target}</TableCell>
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
                  <h4 className="font-medium">Profanity Filter</h4>
                  <p className="text-sm text-muted-foreground">Automatically hide content with offensive language</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Strict</Badge>
                  <Button variant="outline" size="sm" onClick={() => toast.success("Filter settings updated")}>Configure</Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg bg-background/50">
                <div className="space-y-0.5">
                  <h4 className="font-medium">Spam Detection</h4>
                  <p className="text-sm text-muted-foreground">Block repeated messages and suspicious links</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast.success("Spam rules updated")}>Edit Rules</Button>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg bg-background/50">
                <div className="space-y-0.5">
                  <h4 className="font-medium">Keyword Watchlist</h4>
                  <p className="text-sm text-muted-foreground">Flag content containing specific terms for review</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast.success("Watchlist updated")}>Manage Keywords</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
