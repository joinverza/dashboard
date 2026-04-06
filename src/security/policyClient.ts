import { env } from "@/config/env";
import type {
  ApiEnvelopeSuccess,
  PolicyModeUpdateRequest,
  PolicyModeUpdateResponse,
  SecurityPolicyMode,
} from "@/types/security";

const parse = async <T>(res: Response): Promise<T> => {
  const text = await res.text();
  return (text ? JSON.parse(text) : {}) as T;
};

const getAdminToken = (): string => {
  if (typeof window === "undefined") return "";
  return (window.localStorage.getItem("verza:banking:adminToken") || import.meta.env.VITE_BANKING_ADMIN_TOKEN || "").trim();
};

const withAdminHeaders = (): HeadersInit => {
  const adminToken = getAdminToken();
  if (!adminToken) throw new Error("Missing admin token.");
  return {
    "Content-Type": "application/json",
    "x-ontiver-admin-token": adminToken,
  };
};

export const setPolicyMode = async (
  policyKey: string,
  mode: SecurityPolicyMode,
): Promise<PolicyModeUpdateResponse> => {
  const body: PolicyModeUpdateRequest = { mode };
  const res = await fetch(`${env.ontiverAuthBaseUrl}/auth/policies/${encodeURIComponent(policyKey)}/mode`, {
    method: "POST",
    headers: withAdminHeaders(),
    body: JSON.stringify(body),
  });
  const payload = await parse<ApiEnvelopeSuccess<PolicyModeUpdateResponse>>(res);
  if (!res.ok || !payload?.data) {
    throw new Error("Failed to update policy mode.");
  }
  return payload.data;
};
