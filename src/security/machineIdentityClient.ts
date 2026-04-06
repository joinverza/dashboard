import { env } from "@/config/env";
import type {
  ApiEnvelopeSuccess,
  ServiceIdentityCreateRequest,
  ServiceIdentityCreateResponse,
  ServiceTokenIssueRequest,
  ServiceTokenIssueResponse,
} from "@/types/security";

const parse = async <T>(res: Response): Promise<T> => {
  const text = await res.text();
  return (text ? JSON.parse(text) : {}) as T;
};

const getAdminToken = (): string => {
  if (typeof window === "undefined") return "";
  return (window.localStorage.getItem("verza:banking:adminToken") || import.meta.env.VITE_BANKING_ADMIN_TOKEN || "").trim();
};

const adminHeaders = (): HeadersInit => {
  const adminToken = getAdminToken();
  if (!adminToken) throw new Error("Missing admin token.");
  return {
    "Content-Type": "application/json",
    "x-ontiver-admin-token": adminToken,
  };
};

export const createMachineIdentity = async (
  body: ServiceIdentityCreateRequest,
): Promise<ServiceIdentityCreateResponse> => {
  const res = await fetch(`${env.ontiverAuthBaseUrl}/auth/machine-identities`, {
    method: "POST",
    headers: adminHeaders(),
    body: JSON.stringify(body),
  });
  const payload = await parse<ApiEnvelopeSuccess<ServiceIdentityCreateResponse>>(res);
  if (!res.ok || !payload?.data) {
    throw new Error("Failed to create machine identity.");
  }
  return payload.data;
};

export const issueMachineToken = async (
  identityId: string,
  body: ServiceTokenIssueRequest = {},
): Promise<ServiceTokenIssueResponse> => {
  const res = await fetch(
    `${env.ontiverAuthBaseUrl}/auth/machine-identities/${encodeURIComponent(identityId)}/tokens/issue`,
    {
      method: "POST",
      headers: adminHeaders(),
      body: JSON.stringify(body),
    },
  );
  const payload = await parse<ApiEnvelopeSuccess<ServiceTokenIssueResponse>>(res);
  if (!res.ok || !payload?.data) {
    throw new Error("Failed to issue machine token.");
  }
  return payload.data;
};
