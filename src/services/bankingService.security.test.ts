import { describe, expect, it } from "vitest";
import { __securityTestables } from "@/services/bankingService";

describe("security headers middleware", () => {
  it("adds nonce/timestamp only for high-risk operations", () => {
    const headers = { Accept: "application/json" };
    const protectedHeaders = __securityTestables.applySecurityHeaders("POST", "/disputes/abc/resolve", headers);
    const safeHeaders = __securityTestables.applySecurityHeaders("GET", "/analytics/verification-stats", headers);

    expect(protectedHeaders["X-Ontiver-Nonce"]).toBeTypeOf("string");
    expect(protectedHeaders["X-Ontiver-Timestamp"]).toMatch(/^\d+$/);
    expect(safeHeaders["X-Ontiver-Nonce"]).toBeUndefined();
    expect(safeHeaders["X-Ontiver-Timestamp"]).toBeUndefined();
  });

  it("regenerates nonce for each call", () => {
    const first = __securityTestables.applySecurityHeaders("POST", "/reports/create", { Accept: "application/json" });
    const second = __securityTestables.applySecurityHeaders("POST", "/reports/create", { Accept: "application/json" });
    expect(first["X-Ontiver-Nonce"]).not.toBe(second["X-Ontiver-Nonce"]);
  });
});

