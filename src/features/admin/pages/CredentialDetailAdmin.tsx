import { 
  ArrowLeft, Shield, User, 
  Building2, ExternalLink, XCircle, CheckCircle,
  Download, Copy, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

export default function CredentialDetailAdmin() {
  // const [activeTab, setActiveTab] = useState('overview');

  // Mock Data
  const credential = {
    id: 'VC-2024-001',
    type: 'University Degree',
    schema: 'https://schema.verza.io/credentials/degree/v1',
    holder: {
      name: 'Alice Johnson',
      did: 'did:verza:123...456',
      email: 'alice@example.com'
    },
    issuer: {
      name: 'University of Tech',
      did: 'did:verza:edu:789...012',
      verified: true
    },
    status: 'valid',
    issuedDate: '2023-06-15',
    expiryDate: 'Never',
    txHash: '0x1234...5678',
    network: 'Midnight Network',
    claims: {
      degree: 'Bachelor of Science',
      major: 'Computer Science',
      gpa: '3.8',
      honors: 'Summa Cum Laude'
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Credential {credential.id}
            <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Valid</Badge>
          </h1>
          <p className="text-muted-foreground">
            Issued by {credential.issuer.name} to {credential.holder.name}
          </p>
        </div>
        <div className="ml-auto flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download JSON
          </Button>
          <Button variant="destructive">
            <XCircle className="h-4 w-4 mr-2" />
            Revoke
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Credential Preview */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Credential Data</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="visual" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="visual">Visual Representation</TabsTrigger>
                  <TabsTrigger value="json">Raw JSON</TabsTrigger>
                </TabsList>
                
                <TabsContent value="visual" className="mt-0">
                  <div className="p-6 border rounded-lg bg-gradient-to-br from-background to-muted/50">
                    <div className="flex justify-between items-start mb-8">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{credential.issuer.name}</h3>
                          <p className="text-sm text-muted-foreground">Official Credential</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="font-mono">{credential.type}</Badge>
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Recipient</p>
                          <p className="font-medium text-lg">{credential.holder.name}</p>
                          <p className="text-xs text-muted-foreground font-mono mt-1 truncate">{credential.holder.did}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Issue Date</p>
                          <p className="font-medium text-lg">{credential.issuedDate}</p>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                        {Object.entries(credential.claims).map(([key, value]) => (
                          <div key={key}>
                            <p className="text-sm text-muted-foreground mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                            <p className="font-medium">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 flex justify-between items-end">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-green-500" />
                        <span className="text-sm font-medium text-green-500">Cryptographically Signed</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Credential ID</p>
                        <p className="text-xs font-mono">{credential.id}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="json" className="mt-0">
                  <div className="relative">
                    <pre className="p-4 rounded-lg bg-muted font-mono text-xs overflow-auto max-h-[400px]">
                      {JSON.stringify(credential, null, 2)}
                    </pre>
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Verification & Audit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-sm">Signature Valid</p>
                      <p className="text-xs text-muted-foreground">Verified against issuer public key</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Details</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-sm">Not Revoked</p>
                      <p className="text-xs text-muted-foreground">Checked against revocation registry</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Registry</Button>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-sm">Schema Compliant</p>
                      <p className="text-xs text-muted-foreground">Valid against defined schema</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">View Schema</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Metadata */}
        <div className="space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Issuer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{credential.issuer.name}</p>
                  <div className="flex items-center gap-1 text-xs text-green-500">
                    <CheckCircle className="h-3 w-3" />
                    Verified Issuer
                  </div>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">DID</p>
                <p className="text-xs font-mono break-all">{credential.issuer.did}</p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                View Issuer Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Holder Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">{credential.holder.name}</p>
                  <p className="text-xs text-muted-foreground">{credential.holder.email}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">DID</p>
                <p className="text-xs font-mono break-all">{credential.holder.did}</p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                View User Profile
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Blockchain Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Network</p>
                <p className="text-sm font-medium flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  {credential.network}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Transaction Hash</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-mono truncate flex-1">{credential.txHash}</p>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Timestamp</p>
                <p className="text-sm flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  {credential.issuedDate}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
