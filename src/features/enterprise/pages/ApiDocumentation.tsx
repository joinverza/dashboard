import { useMemo, useState } from 'react';
import { Check, Copy, Lock, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { apiReferenceSections } from '@/data/apiReference';

const methodClassMap: Record<string, string> = {
  GET: 'bg-verza-emerald/10 text-verza-emerald border-verza-emerald/20',
  POST: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  PATCH: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  DELETE: 'bg-red-500/10 text-red-500 border-red-500/20',
};

export default function ApiDocumentation() {
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeEndpointPath, setActiveEndpointPath] = useState(apiReferenceSections[0]?.endpoints[0]?.path ?? '');

  const filteredSections = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase();
    if (!normalizedQuery) return apiReferenceSections;
    return apiReferenceSections
      .map((section) => ({
        ...section,
        endpoints: section.endpoints.filter((endpoint) =>
          [endpoint.category, endpoint.component, endpoint.description, endpoint.path]
            .join(' ')
            .toLowerCase()
            .includes(normalizedQuery),
        ),
      }))
      .filter((section) => section.endpoints.length > 0);
  }, [search]);

  const activeEndpoint =
    filteredSections.flatMap((section) => section.endpoints).find((endpoint) => endpoint.path === activeEndpointPath) ??
    filteredSections[0]?.endpoints[0];

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const curlSnippet = activeEndpoint
    ? `curl -X ${activeEndpoint.method} https://api.ontiver.io${activeEndpoint.path} \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json"`
    : '';

  return (
    <div className="flex h-[calc(100vh-100px)] -mt-6 -mx-6">
      <div className="w-72 border-r border-border/50 bg-card/30 backdrop-blur-sm p-4 hidden md:block">
        <div className="mb-4 relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search endpoints..."
            className="pl-8 bg-background/50 h-9"
          />
        </div>

        <ScrollArea className="h-[calc(100%-60px)]">
          <div className="space-y-6">
            {filteredSections.map((section) => (
              <div key={section.id}>
                <h4 className="font-semibold text-sm mb-2 px-2">{section.title}</h4>
                <nav className="space-y-1">
                  {section.endpoints.map((endpoint) => (
                    <Button
                      key={`${section.id}-${endpoint.path}`}
                      variant={activeEndpoint?.path === endpoint.path ? 'secondary' : 'ghost'}
                      size="sm"
                      className="w-full justify-start font-normal h-auto py-2"
                      onClick={() => setActiveEndpointPath(endpoint.path)}
                    >
                      <span className={`text-[10px] px-1.5 py-0.5 rounded mr-2 font-mono border ${methodClassMap[endpoint.method]}`}>
                        {endpoint.method}
                      </span>
                      <span className="truncate">{endpoint.component}</span>
                    </Button>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {activeEndpoint ? (
            <>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline" className={`${methodClassMap[activeEndpoint.method]} font-mono`}>
                    {activeEndpoint.method}
                  </Badge>
                  <code className="text-sm bg-muted px-2 py-0.5 rounded text-muted-foreground">{activeEndpoint.path}</code>
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">{activeEndpoint.component}</h1>
                <p className="text-muted-foreground text-lg leading-relaxed">{activeEndpoint.description}</p>
              </div>

              <Card className="bg-card/50 border-border/50">
                <CardHeader className="py-4">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-base">Authentication Contract</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="py-4 pt-0 text-sm text-muted-foreground">
                  This endpoint uses <span className="text-foreground">{activeEndpoint.auth ?? 'bearer'}</span> authentication and returns the
                  standard backend envelope documented in the integration specification.
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-card/50 border-border/50">
                  <CardHeader>
                    <CardTitle className="text-base">Frontend Mapping</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <div className="font-medium text-foreground mb-2">Primary consumer</div>
                    <div>{activeEndpoint.component}</div>
                    <div className="font-medium text-foreground mt-4 mb-2">Domain</div>
                    <div>{activeEndpoint.category}</div>
                  </CardContent>
                </Card>
                <Card className="bg-card/50 border-border/50">
                  <CardHeader>
                    <CardTitle className="text-base">Response Guarantees</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    <div>200-range responses are normalized by the dashboard service layer.</div>
                    <div>4xx and 5xx responses surface typed error messages in the UI and request history.</div>
                    <div>Request IDs and correlation IDs are captured for diagnostics and auditability.</div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-card/50 border-border/50">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base">Example Request</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => void handleCopy(curlSnippet)}>
                    {copied ? <Check className="h-4 w-4 text-verza-emerald" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </CardHeader>
                <CardContent>
                  <pre className="rounded-lg border bg-muted/40 p-4 text-sm overflow-x-auto">
{curlSnippet}
                  </pre>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="text-base">Coverage Snapshot</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {apiReferenceSections.map((section) => (
                    <div key={section.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <div className="font-medium">{section.title}</div>
                        <div className="text-sm text-muted-foreground">{section.endpoints.length} documented endpoints</div>
                      </div>
                      <Badge variant="outline">{section.id}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="text-muted-foreground">No endpoints match the current search.</div>
          )}
        </div>
      </div>
    </div>
  );
}
