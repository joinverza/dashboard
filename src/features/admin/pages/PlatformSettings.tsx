import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { Loader2, RefreshCw, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { bankingService, getBankingErrorMessage } from "@/services/bankingService";
import type { ApiSecuritySettings, CompanySettings } from "@/types/banking";

const emptyCompanySettings: CompanySettings = {
  companyName: "",
  industry: "",
  website: "",
  taxId: "",
  email: "",
  phone: "",
  address: "",
  notifications: {
    email: true,
    sms: false,
    webhook: true,
  },
  security: {
    mfaEnabled: false,
    ipWhitelist: [],
  },
};

const emptyApiSecuritySettings: ApiSecuritySettings = {
  autoRotateSecrets: false,
  ipWhitelistEnabled: false,
  allowedIps: [],
};

export default function PlatformSettings() {
  const queryClient = useQueryClient();
  const [companySettings, setCompanySettings] = useState<CompanySettings>(emptyCompanySettings);
  const [apiSettings, setApiSettings] = useState<ApiSecuritySettings>(emptyApiSecuritySettings);
  const [targetPlan, setTargetPlan] = useState<"starter" | "growth" | "enterprise">("enterprise");
  const [allowedIpInput, setAllowedIpInput] = useState("");

  const [companyQuery, apiQuery, licenseQuery] = useQueries({
    queries: [
      {
        queryKey: ["admin", "settings", "company"],
        queryFn: () => bankingService.getCompanySettings(),
      },
      {
        queryKey: ["admin", "settings", "api-security"],
        queryFn: () => bankingService.getApiSecuritySettings(),
      },
      {
        queryKey: ["admin", "settings", "license-usage"],
        queryFn: () => bankingService.getLicenseUsageMetrics(),
      },
    ],
  });

  useEffect(() => {
    if (!companyQuery.data) return;
    setCompanySettings({
      ...emptyCompanySettings,
      ...companyQuery.data,
      notifications: {
        ...emptyCompanySettings.notifications,
        ...(companyQuery.data.notifications ?? {}),
      },
      security: {
        ...emptyCompanySettings.security,
        ...(companyQuery.data.security ?? {}),
      },
    });
  }, [companyQuery.data]);

  useEffect(() => {
    if (!apiQuery.data) return;
    setApiSettings(apiQuery.data);
    setAllowedIpInput((apiQuery.data.allowedIps ?? []).join("\n"));
  }, [apiQuery.data]);

  const updateCompanyMutation = useMutation({
    mutationFn: (payload: Partial<CompanySettings>) => bankingService.updateCompanySettings(payload),
    onSuccess: async (next) => {
      setCompanySettings((prev) => ({
        ...prev,
        ...next,
        notifications: {
          ...prev.notifications,
          ...(next.notifications ?? {}),
        },
        security: {
          ...prev.security,
          ...(next.security ?? {}),
        },
      }));
      toast.success("Company settings updated.");
      await queryClient.invalidateQueries({ queryKey: ["admin", "settings", "company"] });
    },
    onError: (error) => {
      toast.error(getBankingErrorMessage(error, "Failed to update company settings"));
    },
  });

  const updateApiSettingsMutation = useMutation({
    mutationFn: (payload: ApiSecuritySettings) => bankingService.updateApiSecuritySettings(payload),
    onSuccess: async (next) => {
      setApiSettings(next);
      setAllowedIpInput((next.allowedIps ?? []).join("\n"));
      toast.success("API security settings saved.");
      await queryClient.invalidateQueries({ queryKey: ["admin", "settings", "api-security"] });
    },
    onError: (error) => {
      toast.error(getBankingErrorMessage(error, "Failed to update API security settings"));
    },
  });

  const changePlanMutation = useMutation({
    mutationFn: (plan: "starter" | "growth" | "enterprise") => bankingService.changeLicensePlan(plan),
    onSuccess: async (result) => {
      toast.success(`Plan change submitted (${result.status}).`);
      await queryClient.invalidateQueries({ queryKey: ["admin", "settings", "license-usage"] });
    },
    onError: (error) => {
      toast.error(getBankingErrorMessage(error, "Failed to change plan"));
    },
  });

  const isInitialLoading = companyQuery.isLoading || apiQuery.isLoading || licenseQuery.isLoading;
  const hasLoadError = Boolean(companyQuery.error || apiQuery.error || licenseQuery.error);

  const usagePercent = useMemo(() => {
    const quota = Number(licenseQuery.data?.monthlyQuota ?? 0);
    const used = Number(licenseQuery.data?.usedQuota ?? 0);
    if (quota <= 0) return 0;
    return Math.min(100, Math.round((used / quota) * 100));
  }, [licenseQuery.data]);

  const persistCompanySettings = () => {
    updateCompanyMutation.mutate({
      companyName: companySettings.companyName,
      industry: companySettings.industry,
      website: companySettings.website,
      taxId: companySettings.taxId,
      email: companySettings.email,
      phone: companySettings.phone,
      address: companySettings.address,
      notifications: companySettings.notifications,
      security: companySettings.security,
    });
  };

  const persistApiSettings = () => {
    const allowedIps = allowedIpInput
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
    updateApiSettingsMutation.mutate({
      autoRotateSecrets: apiSettings.autoRotateSecrets,
      ipWhitelistEnabled: apiSettings.ipWhitelistEnabled,
      allowedIps,
    });
  };

  const refreshAll = async () => {
    await Promise.all([companyQuery.refetch(), apiQuery.refetch(), licenseQuery.refetch()]);
    toast.success("Settings data refreshed.");
  };

  if (isInitialLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Platform Settings</h1>
          <p className="text-muted-foreground">Manage organization profile, API security posture, and plan lifecycle.</p>
        </div>
        <Button variant="outline" onClick={() => void refreshAll()} disabled={companyQuery.isFetching || apiQuery.isFetching || licenseQuery.isFetching}>
          <RefreshCw className={`h-4 w-4 mr-2 ${companyQuery.isFetching || apiQuery.isFetching || licenseQuery.isFetching ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {hasLoadError && (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="py-4 text-sm text-red-400">
            Some settings failed to load. You can still edit available sections and retry refresh.
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4 mb-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">API Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="license">License</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Company Settings</CardTitle>
              <CardDescription>Live values from `/settings/company` with partial update support.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input value={companySettings.companyName} onChange={(e) => setCompanySettings((prev) => ({ ...prev, companyName: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Support Email</Label>
                  <Input value={companySettings.email} onChange={(e) => setCompanySettings((prev) => ({ ...prev, email: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input value={companySettings.website} onChange={(e) => setCompanySettings((prev) => ({ ...prev, website: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Industry</Label>
                  <Input value={companySettings.industry} onChange={(e) => setCompanySettings((prev) => ({ ...prev, industry: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Tax ID</Label>
                  <Input value={companySettings.taxId} onChange={(e) => setCompanySettings((prev) => ({ ...prev, taxId: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={companySettings.phone} onChange={(e) => setCompanySettings((prev) => ({ ...prev, phone: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea value={companySettings.address} onChange={(e) => setCompanySettings((prev) => ({ ...prev, address: e.target.value }))} />
              </div>
              <div className="flex justify-end">
                <Button onClick={persistCompanySettings} disabled={updateCompanyMutation.isPending}>
                  {updateCompanyMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Company
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>API Security</CardTitle>
              <CardDescription>Backed by `/api/settings` patch semantics.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Automatic Secret Rotation</Label>
                  <p className="text-sm text-muted-foreground">Rotate API secrets on configured backend intervals.</p>
                </div>
                <Switch
                  checked={apiSettings.autoRotateSecrets}
                  onCheckedChange={(checked) => setApiSettings((prev) => ({ ...prev, autoRotateSecrets: checked }))}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">IP Whitelist Enforcement</Label>
                  <p className="text-sm text-muted-foreground">Restrict API usage to trusted network ranges.</p>
                </div>
                <Switch
                  checked={apiSettings.ipWhitelistEnabled}
                  onCheckedChange={(checked) => setApiSettings((prev) => ({ ...prev, ipWhitelistEnabled: checked }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Allowed IPs / CIDRs (one per line)</Label>
                <Textarea
                  value={allowedIpInput}
                  onChange={(e) => setAllowedIpInput(e.target.value)}
                  placeholder={"203.0.113.10\n198.51.100.0/24"}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={persistApiSettings} disabled={updateApiSettingsMutation.isPending}>
                  {updateApiSettingsMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Security
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Organization Notifications</CardTitle>
              <CardDescription>Persisted as `notifications` within company settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between">
                <Label htmlFor="notif-email">Email Notifications</Label>
                <Switch
                  id="notif-email"
                  checked={companySettings.notifications.email}
                  onCheckedChange={(checked) =>
                    setCompanySettings((prev) => ({
                      ...prev,
                      notifications: { ...prev.notifications, email: checked },
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notif-sms">SMS Notifications</Label>
                <Switch
                  id="notif-sms"
                  checked={companySettings.notifications.sms}
                  onCheckedChange={(checked) =>
                    setCompanySettings((prev) => ({
                      ...prev,
                      notifications: { ...prev.notifications, sms: checked },
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="notif-webhook">Webhook Notifications</Label>
                <Switch
                  id="notif-webhook"
                  checked={companySettings.notifications.webhook}
                  onCheckedChange={(checked) =>
                    setCompanySettings((prev) => ({
                      ...prev,
                      notifications: { ...prev.notifications, webhook: checked },
                    }))
                  }
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={persistCompanySettings} disabled={updateCompanyMutation.isPending}>
                  {updateCompanyMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Notifications
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="license">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>License & Usage</CardTitle>
              <CardDescription>Usage metrics from `/license/usage` and plan transitions via `/license/plan/change`.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-border/50 bg-muted/30">
                  <p className="text-xs text-muted-foreground">Current Plan</p>
                  <p className="text-lg font-semibold">{licenseQuery.data?.planName ?? "Unknown"}</p>
                </div>
                <div className="p-4 rounded-lg border border-border/50 bg-muted/30">
                  <p className="text-xs text-muted-foreground">Quota Usage</p>
                  <p className="text-lg font-semibold">{licenseQuery.data?.usedQuota ?? 0} / {licenseQuery.data?.monthlyQuota ?? 0}</p>
                </div>
                <div className="p-4 rounded-lg border border-border/50 bg-muted/30">
                  <p className="text-xs text-muted-foreground">SLA Uptime</p>
                  <p className="text-lg font-semibold">{licenseQuery.data?.slaUptime ?? 0}%</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Monthly Usage</Label>
                <div className="h-2 w-full rounded bg-muted overflow-hidden">
                  <div className={`h-2 ${usagePercent > 85 ? "bg-red-500" : usagePercent > 60 ? "bg-yellow-500" : "bg-emerald-500"}`} style={{ width: `${usagePercent}%` }} />
                </div>
                <p className="text-xs text-muted-foreground">{usagePercent}% of monthly quota consumed</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end">
                <div className="space-y-2">
                  <Label>Target Plan</Label>
                  <Select value={targetPlan} onValueChange={(value: "starter" | "growth" | "enterprise") => setTargetPlan(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="starter">Starter</SelectItem>
                      <SelectItem value="growth">Growth</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => changePlanMutation.mutate(targetPlan)} disabled={changePlanMutation.isPending}>
                  {changePlanMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Change Plan
                </Button>
              </div>
              {licenseQuery.data?.anomalyAlerts?.length ? (
                <div className="space-y-2">
                  <Label>Anomaly Alerts</Label>
                  <div className="space-y-2">
                    {licenseQuery.data.anomalyAlerts.slice(0, 4).map((alert) => (
                      <div key={alert.id} className="text-sm p-3 border border-border/50 rounded-lg bg-muted/20">
                        {alert.message}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
