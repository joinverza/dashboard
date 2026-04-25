import { useMemo, useState } from "react";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2, Bell, Save, Shield } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { bankingService, getBankingErrorMessage } from "@/services/bankingService";
import type { VerifierProfile } from "@/types/banking";

const emptyProfile: VerifierProfile = {
  id: "",
  name: "",
  email: "",
  role: "verifier",
  status: "active",
  joinedAt: "",
  title: "",
  description: "",
  website: "",
  location: "",
  languages: [],
  specializations: [],
};

type NotificationPrefs = {
  jobAlerts: boolean;
  reviewAlerts: boolean;
  payoutAlerts: boolean;
  systemUpdates: boolean;
};

export default function VerifierSettings() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [profileDraft, setProfileDraft] = useState<Partial<VerifierProfile>>({});
  const [languageInputOverride, setLanguageInputOverride] = useState<string | null>(null);
  const [specializationInputOverride, setSpecializationInputOverride] = useState<string | null>(null);
  const [notificationPrefsDraft, setNotificationPrefsDraft] = useState<NotificationPrefs | null>(null);

  const [profileQuery, notificationsQuery] = useQueries({
    queries: [
      {
        queryKey: ["verifier", "settings", "profile"],
        queryFn: () => bankingService.getVerifierProfile(),
      },
      {
        queryKey: ["verifier", "settings", "notifications-feed"],
        queryFn: () => bankingService.getNotifications({ limit: 50 }),
      },
    ],
  });

  const baseProfile = useMemo<VerifierProfile>(() => ({
    ...emptyProfile,
    ...(profileQuery.data ?? {}),
    email: profileQuery.data?.email || user?.email || "",
  }), [profileQuery.data, user?.email]);

  const profile = useMemo<VerifierProfile>(() => ({
    ...baseProfile,
    ...profileDraft,
    languages: baseProfile.languages,
    specializations: baseProfile.specializations,
  }), [baseProfile, profileDraft]);

  const languageInput = languageInputOverride ?? (baseProfile.languages ?? []).join(", ");
  const specializationInput = specializationInputOverride ?? (baseProfile.specializations ?? []).join(", ");

  const baseNotificationPrefs = useMemo<NotificationPrefs>(() => {
    const defaults: NotificationPrefs = {
      jobAlerts: true,
      reviewAlerts: true,
      payoutAlerts: true,
      systemUpdates: true,
    };
    if (!notificationsQuery.data) return defaults;
    const items = notificationsQuery.data;
    const hasType = (type: string): boolean => items.some((item) => item.type === type);
    return {
      jobAlerts: hasType("transaction") || defaults.jobAlerts,
      reviewAlerts: hasType("alert") || defaults.reviewAlerts,
      payoutAlerts: hasType("transaction") || defaults.payoutAlerts,
      systemUpdates: hasType("update") || defaults.systemUpdates,
    };
  }, [notificationsQuery.data]);

  const notificationPrefs = notificationPrefsDraft ?? baseNotificationPrefs;

  const updateProfileMutation = useMutation({
    mutationFn: (payload: Partial<VerifierProfile>) => bankingService.updateVerifierProfile(payload),
    onSuccess: async () => {
      setProfileDraft({});
      setLanguageInputOverride(null);
      setSpecializationInputOverride(null);
      toast.success("Verifier profile updated.");
      await queryClient.invalidateQueries({ queryKey: ["verifier", "settings", "profile"] });
    },
    onError: (error) => {
      toast.error(getBankingErrorMessage(error, "Failed to update verifier profile"));
    },
  });

  const isLoading = profileQuery.isLoading || notificationsQuery.isLoading;
  const hasError = Boolean(profileQuery.error || notificationsQuery.error);
  const unreadNotifications = useMemo(() => {
    if (!notificationsQuery.data) return 0;
    return notificationsQuery.data.filter((item) => !item.read).length;
  }, [notificationsQuery.data]);

  const saveProfile = () => {
    const languages = languageInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    const specializations = specializationInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    updateProfileMutation.mutate({
      title: profile.title,
      description: profile.description,
      website: profile.website,
      location: profile.location,
      languages,
      specializations,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-10"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage profile details, verifier capabilities, and alert preferences.</p>
        </div>
        <Button
          variant="outline"
          onClick={() => Promise.all([profileQuery.refetch(), notificationsQuery.refetch()]).then(() => toast.success("Settings refreshed."))}
          disabled={profileQuery.isFetching || notificationsQuery.isFetching}
        >
          {profileQuery.isFetching || notificationsQuery.isFetching ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          Refresh
        </Button>
      </div>

      {hasError ? (
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="py-4 text-sm text-red-400">
            Some verifier settings failed to load. You can continue editing available fields.
          </CardContent>
        </Card>
      ) : null}

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="bg-card/50 backdrop-blur-sm border border-border/50 p-1">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Backed by `/verifier/profile` patch updates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={profile.name ?? ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={profile.email ?? user?.email ?? ""} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={profile.title ?? ""} onChange={(e) => setProfileDraft((prev) => ({ ...prev, title: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input value={profile.location ?? ""} onChange={(e) => setProfileDraft((prev) => ({ ...prev, location: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input value={profile.website ?? ""} onChange={(e) => setProfileDraft((prev) => ({ ...prev, website: e.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={profile.description ?? ""} onChange={(e) => setProfileDraft((prev) => ({ ...prev, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Languages (comma-separated)</Label>
                  <Input value={languageInput} onChange={(e) => setLanguageInputOverride(e.target.value)} placeholder="en, fr, es" />
                </div>
                <div className="space-y-2">
                  <Label>Specializations (comma-separated)</Label>
                  <Input value={specializationInput} onChange={(e) => setSpecializationInputOverride(e.target.value)} placeholder="kyc, sanctions, aml" />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={saveProfile} disabled={updateProfileMutation.isPending}>
                  {updateProfileMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Security Overview</CardTitle>
              <CardDescription>Authentication and risk posture surfaced from account context.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-verza-emerald" />
                  <div>
                    <p className="font-medium">Role</p>
                    <p className="text-sm text-muted-foreground capitalize">{user?.role ?? "verifier"}</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-verza-emerald/10 text-verza-emerald">Verified Access</span>
              </div>
              <Separator />
              <div className="text-sm text-muted-foreground space-y-1">
                <p>MFA enrollment and session management are controlled by the Auth API flow.</p>
                <p>Use the sign-in security flow to enroll TOTP and manage active sessions.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Derived from live `/notifications` feed activity and locally adjustable preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 border border-border/50 rounded-lg bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Unread Notifications</p>
                    <p className="text-sm text-muted-foreground">Current unread items in your verifier stream.</p>
                  </div>
                </div>
                <span className="text-lg font-semibold">{unreadNotifications}</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="jobs">Job Alerts</Label>
                  <Switch id="jobs" checked={notificationPrefs.jobAlerts} onCheckedChange={(checked) => setNotificationPrefsDraft((prev) => ({ ...(prev ?? notificationPrefs), jobAlerts: checked }))} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="reviews">Review Alerts</Label>
                  <Switch id="reviews" checked={notificationPrefs.reviewAlerts} onCheckedChange={(checked) => setNotificationPrefsDraft((prev) => ({ ...(prev ?? notificationPrefs), reviewAlerts: checked }))} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="payouts">Payout Alerts</Label>
                  <Switch id="payouts" checked={notificationPrefs.payoutAlerts} onCheckedChange={(checked) => setNotificationPrefsDraft((prev) => ({ ...(prev ?? notificationPrefs), payoutAlerts: checked }))} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="system">System Updates</Label>
                  <Switch id="system" checked={notificationPrefs.systemUpdates} onCheckedChange={(checked) => setNotificationPrefsDraft((prev) => ({ ...(prev ?? notificationPrefs), systemUpdates: checked }))} />
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                Preference persistence endpoint is not currently available; these toggles are session-local until backend settings API is documented.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
