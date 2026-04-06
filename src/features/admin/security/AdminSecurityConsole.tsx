import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { KeyRound, RefreshCw, ShieldAlert, ServerCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fetchJwksMetadata, revokeSigningKey, rotateSigningKey } from "@/security/jwksClient";
import { setPolicyMode } from "@/security/policyClient";
import { createMachineIdentity, issueMachineToken } from "@/security/machineIdentityClient";
import { env } from "@/config/env";
import type { SecurityPolicyMode } from "@/types/security";

export default function AdminSecurityConsole() {
  const queryClient = useQueryClient();
  const [revokeKid, setRevokeKid] = useState("");
  const [policyKey, setPolicyKey] = useState("stepup.disputes.resolve");
  const [mode, setMode] = useState<SecurityPolicyMode>("monitor");
  const [identityName, setIdentityName] = useState("analytics-worker");
  const [tenantId, setTenantId] = useState("usr_123");
  const [permissions, setPermissions] = useState("admin:read,analytics:read");
  const [issuedToken, setIssuedToken] = useState<string | null>(null);

  const jwksQuery = useQuery({
    queryKey: ["admin", "security", "jwks"],
    queryFn: fetchJwksMetadata,
  });

  const rotateMutation = useMutation({
    mutationFn: rotateSigningKey,
    onSuccess: async () => {
      toast.success("Signing key rotation completed.");
      await queryClient.invalidateQueries({ queryKey: ["admin", "security", "jwks"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to rotate key."),
  });

  const revokeMutation = useMutation({
    mutationFn: (kid: string) => revokeSigningKey(kid),
    onSuccess: async () => {
      toast.success("Key revoked.");
      setRevokeKid("");
      await queryClient.invalidateQueries({ queryKey: ["admin", "security", "jwks"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to revoke key."),
  });

  const policyMutation = useMutation({
    mutationFn: () => setPolicyMode(policyKey, mode),
    onSuccess: () => toast.success("Policy mode updated."),
    onError: (error) => toast.error(error instanceof Error ? error.message : "Failed to update policy mode."),
  });

  const machineIdentityMutation = useMutation({
    mutationFn: async () => {
      const identity = await createMachineIdentity({
        name: identityName.trim(),
        tenantId: tenantId.trim(),
        permissions: permissions.split(",").map((item) => item.trim()).filter(Boolean),
      });
      return issueMachineToken(identity.identityId, { ttlSeconds: 900 });
    },
    onSuccess: (result) => {
      setIssuedToken(result.token);
      toast.success("Machine identity created and token issued.");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Machine identity flow failed."),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security Console</h1>
        <p className="text-muted-foreground mt-1">Manage JWKS keys, policy modes, and machine identities.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><KeyRound className="h-4 w-4" />JWKS Metadata</CardTitle>
          <CardDescription>View key lifecycle details and run key management actions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => rotateMutation.mutate()} disabled={rotateMutation.isPending}>
              <RefreshCw className="h-4 w-4 mr-2" />Rotate Key
            </Button>
          </div>
          <div className="space-y-2">
            {(jwksQuery.data?.keys || []).map((key) => (
              <div key={key.kid} className="rounded border p-3 text-sm">
                <div><strong>{key.kid}</strong> ({key.status})</div>
                <div className="text-muted-foreground">created: {key.createdAt}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input placeholder="kid to revoke" value={revokeKid} onChange={(e) => setRevokeKid(e.target.value)} />
            <Button variant="outline" onClick={() => revokeMutation.mutate(revokeKid)} disabled={!revokeKid || revokeMutation.isPending}>
              Revoke
            </Button>
          </div>
        </CardContent>
      </Card>

      {env.securityPolicyUiEnabled ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ShieldAlert className="h-4 w-4" />Policy Mode</CardTitle>
            <CardDescription>Switch rollout mode for security policies.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Policy Key</Label>
              <Input value={policyKey} onChange={(e) => setPolicyKey(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Mode</Label>
              <Select value={mode} onValueChange={(value) => setMode(value as SecurityPolicyMode)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="monitor">monitor</SelectItem>
                  <SelectItem value="enforce">enforce</SelectItem>
                  <SelectItem value="off">off</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => policyMutation.mutate()} disabled={policyMutation.isPending}>Save Mode</Button>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ServerCog className="h-4 w-4" />Machine Identity</CardTitle>
          <CardDescription>Create service identity and issue short-lived token.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input value={identityName} onChange={(e) => setIdentityName(e.target.value)} placeholder="identity name" />
          <Input value={tenantId} onChange={(e) => setTenantId(e.target.value)} placeholder="tenant id" />
          <Input value={permissions} onChange={(e) => setPermissions(e.target.value)} placeholder="comma-separated permissions" />
          <Button onClick={() => machineIdentityMutation.mutate()} disabled={machineIdentityMutation.isPending}>
            Create + Issue Token
          </Button>
        </CardContent>
      </Card>

      <Dialog open={!!issuedToken} onOpenChange={(open) => !open && setIssuedToken(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>One-Time Token Reveal</DialogTitle>
            <DialogDescription>Copy this token now. It will not be shown again.</DialogDescription>
          </DialogHeader>
          <pre className="rounded border bg-muted p-3 text-xs overflow-auto">{issuedToken}</pre>
        </DialogContent>
      </Dialog>
    </div>
  );
}

