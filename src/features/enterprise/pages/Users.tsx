import { useMemo } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { bankingService } from "@/services/bankingService";

export default function EnterpriseUsersPage() {
  const { hasPermission, permissions, user } = useAuth();
  const canRead = permissions.length === 0 || hasPermission("settings:read");

  const { data, isLoading } = useQuery({
    queryKey: ["enterprise", "users-from-verifications"],
    queryFn: () => bankingService.getVerificationRequests({ limit: 200 }),
  });

  const users = useMemo(() => {
    const records = data ?? [];
    const map = new Map<string, { name: string; email: string; lastVerificationId: string; latestStatus: string }>();

    for (const item of records) {
      const first = typeof item.details?.firstName === "string" ? item.details.firstName : "";
      const last = typeof item.details?.lastName === "string" ? item.details.lastName : "";
      const email = typeof item.details?.email === "string" ? item.details.email : "";
      const key = email || `${first} ${last}`.trim() || item.verificationId;
      if (!map.has(key)) {
        map.set(key, {
          name: `${first} ${last}`.trim() || "Unknown User",
          email: email || "-",
          lastVerificationId: item.verificationId,
          latestStatus: item.status,
        });
      }
    }

    return Array.from(map.values());
  }, [data]);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground mt-1">
            User directory derived from verification activity. Select a user record to inspect related verification details.
          </p>
        </div>
        <div className="text-xs text-muted-foreground" role="status" aria-live="polite">Ready</div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Verification Directory</CardTitle>
          <CardDescription>Latest known user status from your verification pipeline.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4}>Loading users...</TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>No user activity found.</TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={`${user.email}-${user.lastVerificationId}`}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.latestStatus}</Badge>
                      </TableCell>
                      <TableCell>
                        <Link href={`/enterprise/requests/${user.lastVerificationId}`}>
                          <Button size="sm" variant="outline">View Latest Verification</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
