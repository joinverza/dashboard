import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, FileClock, Shield } from "lucide-react";

export default function ReportsHub() {
  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground mt-1">
          Analytics, compliance, and audit reporting in one workspace.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analytics
            </CardTitle>
            <CardDescription>Verification trends, performance, and operational metrics.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/enterprise/analytics">
              <Button>Open Analytics</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Compliance
            </CardTitle>
            <CardDescription>Generate and track compliance-oriented verification reports.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/enterprise/compliance">
              <Button>Open Compliance</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileClock className="h-5 w-5" />
              Audit Trail
            </CardTitle>
            <CardDescription>Inspect timeline and evidence logs for verification events.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/enterprise/audit">
              <Button>Open Audit Trail</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
