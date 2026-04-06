import { env } from "@/config/env";
import type { ApiEnvelopeSuccess, JwksMetadataResponse } from "@/types/security";

const parse = async <T>(res: Response): Promise<T> => {
  const text = await res.text();
  return (text ? JSON.parse(text) : {}) as T;
};

const getAdminToken = (): string => {
  if (typeof window === "undefined") return "";
  return (window.localStorage.getItem("verza:banking:adminToken") || import.meta.env.VITE_BANKING_ADMIN_TOKEN || "").trim();
};

export const fetchJwksMetadata = async (): Promise<JwksMetadataResponse> => {
  const res = await fetch(`${env.ontiverAuthBaseUrl}/auth/.well-known/jwks.json`);
  if (!res.ok) {
    throw new Error("Failed to fetch JWKS metadata.");
  }
  return parse<JwksMetadataResponse>(res);
};

export const rotateSigningKey = async (): Promise<{ rotated: boolean; kid: string }> => {
  const adminToken = getAdminToken();
  if (!adminToken) throw new Error("Missing admin token.");
  const res = await fetch(`${env.ontiverAuthBaseUrl}/auth/jwks/rotate`, {
    method: "POST",
    headers: { "x-ontiver-admin-token": adminToken },
  });
  const payload = await parse<ApiEnvelopeSuccess<{ rotated: boolean; kid: string }>>(res);
  if (!res.ok || !payload?.data) {
    throw new Error("Rotate signing key failed.");
  }
  return payload.data;
};

export const revokeSigningKey = async (kid: string): Promise<{ revoked: boolean; kid: string }> => {
  const adminToken = getAdminToken();
  if (!adminToken) throw new Error("Missing admin token.");
  const res = await fetch(`${env.ontiverAuthBaseUrl}/auth/jwks/revoke/${encodeURIComponent(kid)}`, {
    method: "POST",
    headers: { "x-ontiver-admin-token": adminToken },
  });
  const payload = await parse<ApiEnvelopeSuccess<{ revoked: boolean; kid: string }>>(res);
  if (!res.ok || !payload?.data) {
    throw new Error("Revoke signing key failed.");
  }
  return payload.data;
};
