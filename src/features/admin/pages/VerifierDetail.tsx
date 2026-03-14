import { motion } from 'framer-motion';
import { 
  Building, Mail, Calendar, Shield, Activity, 
  CheckCircle, Star, AlertTriangle, FileText, Ban, 
  MoreVertical, ExternalLink, ThumbsUp, ArrowLeft, Loader2
} from 'lucide-react';
import { useLocation, useRoute } from "wouter";
import { toast } from "sonner";
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
import { useEffect, useState } from 'react';
import { bankingService } from '@/services/bankingService';
import type { Verifier } from '@/types/banking';

// Mock data for fallback and unsupported features
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
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/admin/verifiers/:id");
  const [verifier, setVerifier] = useState<Verifier | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVerifierDetails = async () => {
      if (!params?.id) return;
      
      try {
        setIsLoading(true);
        const data = await bankingService.getVerifierDetails(params.id);
        setVerifier(data);
      } catch (error) {
        console.error("Failed to fetch verifier details", error);
        toast.error("Failed to load verifier details. Using fallback data.");
        // Fallback to mock data structure adapted to Verifier type
        setVerifier({
          id: params.id,
          name: 'VeriTech Solutions',
          email: 'contact@veritech.com',
          role: 'verifier',
          status: 'active',
          joinedAt: '2023-01-10',
          lastActive: 'Today, 09:15 AM',
          organizationName: 'VeriTech Solutions Inc.',
          description: 'Global leader in digital identity verification services specializing in employment and education checks.',
          website: 'https://veritech.com',
          location: 'San Francisco, CA',
          did: 'did:verza:verifier:1234567890',
          verificationLevel: 'Gold',
          credentialsIssued: 15420,
          reputation: 98,
          stats: {
            issued: 15420,
            active: 14200,
            revoked: 1220,
            reputation: 98,
            earnings: '$145,200'
          }
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVerifierDetails();
  }, [params?.id]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!verifier) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <p className="text-muted-foreground">Verifier not found</p>
        <Button onClick={() => setLocation('/admin/verifiers')}>Back to Verifiers</Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Button variant="ghost" className="pl-0 gap-2 hover:bg-transparent hover:text-primary" onClick={() => setLocation('/admin/verifiers')}>
        <ArrowLeft className="w-4 h-4" /> Back to Verifiers
      </Button>

      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-card/80 backdrop-blur-sm border border-border/50 p-6 rounded-lg">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20 border-4 border-background">
            <AvatarImage src={verifier.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${verifier.name}`} />
            <AvatarFallback>{verifier.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{verifier.name}</h1>
              <Badge className={verifier.status === 'active' ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-yellow-500/10 text-yellow-500"}>
                {verifier.status.charAt(0).toUpperCase() + verifier.status.slice(1)}
              </Badge>
              {verifier.verificationLevel && (
                <Badge variant="outline" className="border-blue-500/20 text-blue-500">{verifier.verificationLevel} Partner</Badge>
              )}
            </div>
            <div className="flex flex-col gap-1 mt-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Building className="h-3 w-3" /> {verifier.organizationName || 'Individual'}
                <span className="mx-1">•</span>
                <Mail className="h-3 w-3" /> {verifier.email}
              </div>
              {verifier.did && (
                <div className="flex items-center gap-2 font-mono text-xs">
                  <Shield className="h-3 w-3" /> {verifier.did}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          {verifier.website && (
            <Button variant="outline" size="sm" onClick={() => {
              window.open(verifier.website, '_blank');
              toast.success("Website opened in new tab");
            }}>
              <ExternalLink className="mr-2 h-4 w-4" /> Visit Website
            </Button>
          )}
          <Button variant="destructive" size="sm" onClick={() => toast.warning("Verifier suspended")}>
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
                    {verifier.stats?.issued?.toLocaleString() || verifier.credentialsIssued?.toLocaleString() || 0}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-secondary/20 border border-border/50">
                  <div className="text-sm text-muted-foreground mb-1">Reputation</div>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    {verifier.stats?.reputation || verifier.reputation || 0}%
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-secondary/20 border border-border/50">
                  <div className="text-sm text-muted-foreground mb-1">Active Credentials</div>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    {verifier.stats?.active?.toLocaleString() || '-'}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-secondary/20 border border-border/50">
                  <div className="text-sm text-muted-foreground mb-1">Total Earnings</div>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    <span className="text-purple-500">$</span>
                    {verifier.stats?.earnings || '-'}
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
                  <p className="text-sm mt-1">{verifier.description || 'No description available.'}</p>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Joined Date</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4" /> {new Date(verifier.joinedAt).toLocaleDateString()}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Last Active</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Activity className="h-4 w-4" /> {verifier.lastActive || 'Never'}
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Location</div>
                  <div className="mt-1">{verifier.location || 'Unknown'}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="credentials">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Recent Issued Credentials</CardTitle>
              <CardDescription>Latest credentials issued by this verifier (Mock Data).</CardDescription>
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