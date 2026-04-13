import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, CreditCard, PlugZap, Settings, Users } from "lucide-react";

export default function PlatformHub() {
  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Platform</h1>
        <p className="text-muted-foreground mt-1">
          Manage enterprise platform controls, integrations, billing, and team configuration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              API Management
            </CardTitle>
            <CardDescription>Keys, scopes, webhook controls, and API settings.</CardDescription>
          </CardHeader>
          <CardContent><Link href="/enterprise/api"><Button>Open API</Button></Link></CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlugZap className="h-5 w-5" />
              Integrations
            </CardTitle>
            <CardDescription>Configure and monitor external service integrations.</CardDescription>
          </CardHeader>
          <CardContent><Link href="/enterprise/integrations"><Button>Open Integrations</Button></Link></CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Billing
            </CardTitle>
            <CardDescription>Plans, quotas, usage, and payment workflows.</CardDescription>
          </CardHeader>
          <CardContent><Link href="/enterprise/billing"><Button>Open Billing</Button></Link></CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team
            </CardTitle>
            <CardDescription>Invite and manage workspace team members.</CardDescription>
          </CardHeader>
          <CardContent><Link href="/enterprise/team"><Button>Open Team</Button></Link></CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </CardTitle>
            <CardDescription>Organization profile and security configuration.</CardDescription>
          </CardHeader>
          <CardContent><Link href="/enterprise/settings"><Button>Open Settings</Button></Link></CardContent>
        </Card>
      </div>
    </div>
  );
}
