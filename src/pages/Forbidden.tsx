import { Link } from "wouter";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Forbidden() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <ShieldAlert className="h-8 w-8 text-destructive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Access Denied</h1>
          <p className="text-sm text-muted-foreground">
            Your role or permissions do not allow access to this dashboard area.
          </p>
        </div>
        <div className="flex justify-center">
          <Link href="/login">
            <Button>Return to Login</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
