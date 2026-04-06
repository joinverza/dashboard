import { env } from "@/config/env";
import { markStepUpVerified, readSession } from "@/auth/sessionStore";
import { requestStepUpCode } from "@/auth/stepUpPromptBus";
import type { ApiEnvelopeSuccess, StepUpResponse } from "@/types/security";

const STEP_UP_PROMPT_MESSAGE = "Enter your 6-digit authenticator code to continue this sensitive action.";

const parseJson = async (res: Response): Promise<unknown> => {
  const text = await res.text();
  return text ? (JSON.parse(text) as unknown) : null;
};

export const performStepUp = async (code: string): Promise<StepUpResponse> => {
  const session = readSession();
  if (!session?.accessToken) {
    throw new Error("Missing active session. Please sign in again.");
  }

  const response = await fetch(`${env.ontiverAuthBaseUrl}/auth/step-up`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
    },
    body: JSON.stringify({ code }),
    credentials: "include",
  });

  const payload = (await parseJson(response)) as ApiEnvelopeSuccess<StepUpResponse> | null;
  if (!response.ok || !payload || payload.success !== true || !payload.data?.reauthenticatedAt) {
    throw new Error("Step-up verification failed.");
  }

  markStepUpVerified(payload.data.reauthenticatedAt);
  return payload.data;
};

export const isStepUpFresh = (): boolean => {
  const session = readSession();
  if (!session?.stepUpExpiresAt) return false;
  return Date.now() < new Date(session.stepUpExpiresAt).getTime();
};

export const promptForStepUpCode = async (): Promise<string> => {
  if (!env.securityStepUpEnabled) {
    throw new Error("Step-up is currently disabled.");
  }
  const code = (await requestStepUpCode(STEP_UP_PROMPT_MESSAGE)).trim();
  if (!/^\d{6}$/.test(code)) {
    throw new Error("A valid 6-digit code is required.");
  }
  return code;
};

export async function runWithStepUpRetry<T>(op: () => Promise<T>, isHighRisk: boolean): Promise<T> {
  return runWithStepUpRetryUsing(op, isHighRisk, async () => {
    const code = await promptForStepUpCode();
    await performStepUp(code);
  });
}

export async function runWithStepUpRetryUsing<T>(
  op: () => Promise<T>,
  isHighRisk: boolean,
  performInteractiveStepUp: () => Promise<void>,
): Promise<T> {
  try {
    return await op();
  } catch (error) {
    const status = (error as { status?: number })?.status;
    if (!isHighRisk || status !== 403) {
      throw error;
    }
    await performInteractiveStepUp();
    return op();
  }
}
