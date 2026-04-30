import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";

export default function AuditTrail() {
  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Trail</h1>
          <p className="text-muted-foreground mt-1">Immutable log of all system activities and verification events.</p>
        </div>
        <div className="text-xs text-muted-foreground" role="status" aria-live="polite">Ready</div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-verza-emerald" />
            System Audit Log
          </CardTitle>
          <CardDescription>Comprehensive tracking of all administrative and automated actions.</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
          No audit logs recorded for the current period.
        </CardContent>
      </Card>
    </div>
  );
}