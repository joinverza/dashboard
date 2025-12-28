import { motion } from 'framer-motion';
import { 
  Building, Mail, Calendar, Shield, Activity, 
  CheckCircle, Star, AlertTriangle, FileText, Ban, 
  MoreVertical, ExternalLink, ThumbsUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MOCK_VERIFIER = {
  id: '1',
  name: 'VeriTech Solutions',
  email: 'contact@veritech.com',
  did: 'did:verza:verifier:1234567890',
  type: 'organization',
  status: 'active',
  joinedDate: 'Jan 10, 2023',
  lastActive: 'Today, 09:15 AM',
  description: 'Global leader in digital identity verification services specializing in employment and education checks.',
  website: 'https://veritech.com',
  location: 'San Francisco, CA',
  stats: {
    issued: 15420,
    active: 14200,
    revoked: 1220,
    reputation: 98,
    earnings: '$145,200'
  }
};

const ISSUED_CREDENTIALS = [
  { id: 1, type: 'Employment Verification', user: 'Alice Johnson', date: 'Oct 24, 2023', status: 'Active' },
  { id: 2, type: 'Degree Certificate', user: 'Bob Smith', date: 'Oct 23, 2023', status: 'Active' },
  { id: 3, type: 'Skill Badge: React', user: 'Charlie Brown', date: 'Oct 22, 2023', status: 'Revoked' },
  { id: 4, type: 'Identity Proof', user: 'Diana Prince', date: 'Oct 20, 2023', status: 'Active' },
];

const REVIEWS = [
  { id: 1, user: 'Alice Johnson', rating: 5, comment: 'Fast and professional verification process.', date: '2 days ago' },
  { id: 2, user: 'Bob Smith', rating: 4, comment: 'Good service but took a bit longer than expected.', date: '1 week ago' },
  { id: 3, user: 'Charlie Brown', rating: 5, comment: 'Excellent experience!', date: '2 weeks ago' },
];

export default function VerifierDetail() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-card/80 backdrop-blur-sm border border-border/50 p-6 rounded-lg">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border-4 border-background">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${MOCK_VERIFIER.name}`} />
            <AvatarFallback>VT</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{MOCK_VERIFIER.name}</h1>
              <Badge className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20">Active</Badge>
              <Badge variant="outline" className="border-blue-500/20 text-blue-500">Verified Partner</Badge>
            </div>
            <div className="flex flex-col gap-1 mt-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Building className="h-3 w-3" /> {MOCK_VERIFIER.type === 'organization' ? 'Organization' : 'Individual'}
                <span className="mx-1">•</span>
                <Mail className="h-3 w-3" /> {MOCK_VERIFIER.email}
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <Shield className="h-3 w-3" /> {MOCK_VERIFIER.did}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <ExternalLink className="mr-2 h-4 w-4" /> Visit Website
          </Button>
          <Button variant="destructive" size="sm">
            <Ban className="mr-2 h-4 w-4" /> Suspend
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-card/50 backdrop-blur-sm border border-border/50 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="credentials">Issued Credentials</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="notes">Admin Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="bg-card/80 backdrop-blur-sm border-border/50 md:col-span-2">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-secondary/20 border border-border/50">
                  <div className="text-sm text-muted-foreground mb-1">Total Issued</div>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-500" />
                    {MOCK_VERIFIER.stats.issued.toLocaleString()}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-secondary/20 border border-border/50">
                  <div className="text-sm text-muted-foreground mb-1">Reputation</div>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    {MOCK_VERIFIER.stats.reputation}%
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-secondary/20 border border-border/50">
                  <div className="text-sm text-muted-foreground mb-1">Active Credentials</div>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    {MOCK_VERIFIER.stats.active.toLocaleString()}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-secondary/20 border border-border/50">
                  <div className="text-sm text-muted-foreground mb-1">Total Earnings</div>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    <span className="text-purple-500">$</span>
                    {MOCK_VERIFIER.stats.earnings}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">About</div>
                  <p className="text-sm mt-1">{MOCK_VERIFIER.description}</p>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Joined Date</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" /> {MOCK_VERIFIER.joinedDate}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Last Active</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Activity className="h-4 w-4" /> {MOCK_VERIFIER.lastActive}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Location</div>
                  <div className="mt-1">{MOCK_VERIFIER.location}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="credentials">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Recent Issued Credentials</CardTitle>
              <CardDescription>Latest credentials issued by this verifier.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Credential Type</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Date Issued</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ISSUED_CREDENTIALS.map((cred) => (
                    <TableRow key={cred.id}>
                      <TableCell className="font-medium">{cred.type}</TableCell>
                      <TableCell>{cred.user}</TableCell>
                      <TableCell>{cred.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cred.status === 'Active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}>
                          {cred.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <div className="grid gap-4">
            {REVIEWS.map((review) => (
              <Card key={review.id} className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{review.user}</span>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="font-bold">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-2">{review.comment}</p>
                  <div className="text-xs text-muted-foreground flex items-center gap-4">
                    <span>{review.date}</span>
                    <button className="flex items-center gap-1 hover:text-foreground">
                      <ThumbsUp className="h-3 w-3" /> Helpful
                    </button>
                    <button className="flex items-center gap-1 text-red-500 hover:text-red-600 ml-auto">
                      <AlertTriangle className="h-3 w-3" /> Report
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notes">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Admin Notes</CardTitle>
              <CardDescription>Internal notes about this verifier (not visible to verifier).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="Add a note..." 
                className="min-h-[150px]"
                defaultValue="Performed background check on Jan 12, 2023. Passed all criteria. High reliability score."
              />
              <div className="flex justify-end">
                <Button>Save Notes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
