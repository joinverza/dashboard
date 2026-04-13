import { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cancelStepUpCode, submitStepUpCode, subscribeStepUpPrompt } from "@/auth/stepUpPromptBus";

export function StepUpPromptDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("Enter your authenticator code.");
  const [code, setCode] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeStepUpPrompt((state) => {
      setIsOpen(state.open);
      setMessage(state.message || "Enter your authenticator code.");
      if (!state.open) setCode("");
    });
    return unsubscribe;
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && cancelStepUpCode()}>
      <DialogContent className="sm:max-w-md" onPointerDownOutside={(event) => event.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-verza-emerald" />
            Step-Up Verification
          </DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Input
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="Enter 6-digit code"
            inputMode="numeric"
            maxLength={6}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => cancelStepUpCode()}>
            Cancel
          </Button>
          <Button type="button" onClick={() => submitStepUpCode(code)} disabled={code.trim().length !== 6}>
            Verify
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

