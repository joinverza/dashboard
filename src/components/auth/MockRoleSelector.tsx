import type { UserRole } from "@/features/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { env } from "@/config/env";

// TEMPORARY DEVELOPMENT ONLY:
// This component exists solely to create mock sessions for different roles while editing dashboard screens locally.
// It should not be treated as live production auth UI and should not receive production-only login logic.

const mockRoleOptions: Array<{ role: UserRole; label: string }> = [
  { role: "user", label: "User" },
  { role: "verifier", label: "Verifier" },
  { role: "enterprise", label: "Enterprise" },
  { role: "manager", label: "Manager" },
  { role: "admin", label: "Admin" },
];

interface MockRoleSelectorProps {
  selectedRole: UserRole;
  onSelect: (role: UserRole) => void;
  className?: string;
}

export function MockRoleSelector({ selectedRole, onSelect, className }: MockRoleSelectorProps) {
  if (!env.mockAuthEnabled) return null;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-verza-emerald">Mock Role Selector</p>
        <p className="text-sm text-zinc-400">
          Pick the role you want to preview. The mock session will use this role so the correct sidebar, header, and routes load after sign-in.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {mockRoleOptions.map((option) => (
          <Button
            key={option.role}
            type="button"
            variant={selectedRole === option.role ? "default" : "outline"}
            onClick={() => onSelect(option.role)}
            className={cn(
              "h-10",
              selectedRole === option.role
                ? "bg-verza-emerald text-black hover:bg-verza-emerald/90"
                : "border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:bg-zinc-800 hover:text-white",
            )}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
