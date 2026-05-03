import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/AuthContext";
import { toast } from "sonner";

export default function TeamManagement() {
  const { hasPermission, permissions, user } = useAuth();
  const canAdmin = permissions.length === 0 || hasPermission("settings:read");

  const handleInvite = () => {
    if (!canAdmin) {
      toast.error("You do not have permission to invite members.");
      return;
    }
    toast.info("Invitation system is currently in read-only mode for your role.");
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground mt-1">Manage team members, roles, and access permissions.</p>
        </div>
        <Button 
          className="bg-verza-emerald text-[#06140F] hover:bg-verza-emerald/90"
          onClick={handleInvite}
          disabled={!canAdmin}
        >
          Invite Member
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-verza-emerald" />
            Organization Members
          </CardTitle>
          <CardDescription>View and manage access for all users in your enterprise workspace.</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
          You are the only member in this workspace.
        </CardContent>
      </Card>
    </div>
  );
}