import { useState } from 'react';
import { 
  Play, Copy, Check, Search, 
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ApiDocumentation() {
  const [activeEndpoint, setActiveEndpoint] = useState('verify-create');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-[calc(100vh-100px)] -mt-6 -mx-6">
      {/* Sidebar */}
      <div className="w-64 border-r border-border/50 bg-card/30 backdrop-blur-sm p-4 hidden md:block">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search docs..."
              className="pl-8 bg-background/50 h-9"
            />
          </div>
        </div>
        
        <ScrollArea className="h-[calc(100%-60px)]">
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-sm mb-2 px-2">Getting Started</h4>
              <nav className="space-y-1">
                <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground font-normal">
                  Introduction
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground font-normal">
                  Authentication
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground font-normal">
                  Rate Limits
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground font-normal">
                  Errors
                </Button>
              </nav>
            </div>
            
            <div>
              <h4 className="font-semibold text-sm mb-2 px-2">Verifications</h4>
              <nav className="space-y-1">
                <Button 
                  variant={activeEndpoint === 'verify-create' ? "secondary" : "ghost"} 
                  size="sm" 
                  className="w-full justify-start font-normal"
                  onClick={() => setActiveEndpoint('verify-create')}
                >
                  <span className="text-[10px] bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded mr-2 font-mono">POST</span>
                  Create Request
                </Button>
                <Button 
                  variant={activeEndpoint === 'verify-get' ? "secondary" : "ghost"} 
                  size="sm" 
                  className="w-full justify-start font-normal"
                  onClick={() => setActiveEndpoint('verify-get')}
                >
                  <span className="text-[10px] bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded mr-2 font-mono">GET</span>
                  Get Request
                </Button>
                <Button 
                  variant={activeEndpoint === 'verify-list' ? "secondary" : "ghost"} 
                  size="sm" 
                  className="w-full justify-start font-normal"
                  onClick={() => setActiveEndpoint('verify-list')}
                >
                  <span className="text-[10px] bg-green-500/10 text-green-500 px-1.5 py-0.5 rounded mr-2 font-mono">GET</span>
                  List Requests
                </Button>
              </nav>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-2 px-2">Webhooks</h4>
              <nav className="space-y-1">
                <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground font-normal">
                  Verify Signature
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground font-normal">
                  Event Types
                </Button>
              </nav>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-4xl mx-auto space-y-10">
          
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 font-mono">POST</Badge>
              <code className="text-sm bg-muted px-2 py-0.5 rounded text-muted-foreground">/v1/verifications</code>
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-4">Create Verification Request</h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Initiates a new verification request for a candidate. The request will be processed asynchronously, 
              and you will receive a webhook notification upon completion.
            </p>
          </div>

          {/* Authentication */}
          <Card className="bg-card/50 border-border/50">
            <CardHeader className="py-4">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">Authentication Required</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="py-4 pt-0 text-sm text-muted-foreground">
              This endpoint requires a valid API key sent in the <code className="text-foreground bg-muted px-1 rounded">Authorization</code> header 
              as a Bearer token.
            </CardContent>
          </Card>

          {/* Parameters */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Request Body</h2>
            <div className="rounded-md border bg-card">
              <div className="grid grid-cols-4 gap-4 p-4 font-medium text-sm border-b bg-muted/30">
                <div className="col-span-1">Parameter</div>
                <div className="col-span-1">Type</div>
                <div className="col-span-2">Description</div>
              </div>
              <div className="divide-y">
                <div className="grid grid-cols-4 gap-4 p-4 text-sm">
                  <div className="col-span-1 font-mono text-xs">type</div>
                  <div className="col-span-1 text-muted-foreground">string</div>
                  <div className="col-span-2">
                    <p>The type of verification to perform.</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Values: <code className="bg-muted px-1 rounded">degree</code>, <code className="bg-muted px-1 rounded">employment</code>, <code className="bg-muted px-1 rounded">identity</code>
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4 p-4 text-sm">
                  <div className="col-span-1 font-mono text-xs">subject</div>
                  <div className="col-span-1 text-muted-foreground">object</div>
                  <div className="col-span-2">Information about the candidate being verified.</div>
                </div>
                <div className="grid grid-cols-4 gap-4 p-4 text-sm">
                  <div className="col-span-1 font-mono text-xs pl-4">subject.email</div>
                  <div className="col-span-1 text-muted-foreground">string</div>
                  <div className="col-span-2">Email address of the candidate.</div>
                </div>
                <div className="grid grid-cols-4 gap-4 p-4 text-sm">
                  <div className="col-span-1 font-mono text-xs pl-4">subject.name</div>
                  <div className="col-span-1 text-muted-foreground">string</div>
                  <div className="col-span-2">Full name of the candidate.</div>
                </div>
                <div className="grid grid-cols-4 gap-4 p-4 text-sm">
                  <div className="col-span-1 font-mono text-xs">callback_url</div>
                  <div className="col-span-1 text-muted-foreground">string</div>
                  <div className="col-span-2">Optional URL to receive webhook events for this specific request.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Example */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Example</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Play className="h-3 w-3" /> Try it out
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="curl" className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
                <TabsTrigger 
                  value="curl" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2"
                >
                  cURL
                </TabsTrigger>
                <TabsTrigger 
                  value="node" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2"
                >
                  Node.js
                </TabsTrigger>
                <TabsTrigger 
                  value="python" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2"
                >
                  Python
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="curl" className="mt-4">
                <div className="relative rounded-lg border bg-muted/50 p-4 font-mono text-sm overflow-x-auto">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 h-8 w-8 bg-background/50 hover:bg-background"
                    onClick={() => handleCopy(`curl -X POST https://api.verza.io/v1/verifications \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "degree",
    "subject": {
      "email": "candidate@example.com",
      "name": "Jane Doe"
    },
    "document": {
      "institution": "Stanford University",
      "degree": "B.S. Computer Science",
      "year": 2022
    }
  }'`)}
                  >
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                  <pre className="text-foreground">
{`curl -X POST https://api.verza.io/v1/verifications \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "degree",
    "subject": {
      "email": "candidate@example.com",
      "name": "Jane Doe"
    },
    "document": {
      "institution": "Stanford University",
      "degree": "B.S. Computer Science",
      "year": 2022
    }
  }'`}
                  </pre>
                </div>
              </TabsContent>
              
              <TabsContent value="node" className="mt-4">
                <div className="relative rounded-lg border bg-muted/50 p-4 font-mono text-sm overflow-x-auto">
                  <pre className="text-foreground">
{`const Verza = require('verza-node');
const client = new Verza('YOUR_API_KEY');

const verification = await client.verifications.create({
  type: 'degree',
  subject: {
    email: 'candidate@example.com',
    name: 'Jane Doe'
  },
  document: {
    institution: 'Stanford University',
    degree: 'B.S. Computer Science',
    year: 2022
  }
});

console.log(verification.id);`}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>

            <div className="space-y-2 mt-6">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Response</h3>
              <div className="rounded-lg border bg-muted/30 p-4 font-mono text-sm">
                <pre className="text-foreground">
{`{
  "id": "req_123456789",
  "object": "verification_request",
  "created": 1678901234,
  "status": "pending",
  "type": "degree",
  "subject": {
    "email": "candidate@example.com",
    "name": "Jane Doe"
  },
  "livemode": true
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
