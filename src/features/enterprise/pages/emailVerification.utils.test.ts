import {
  buildAnalytics,
  parseBulkCsv,
  resultsToCsv,
  validateBulkItems,
  validateSingleEmailRequest,
  validateVerificationCode,
} from "./emailVerification.utils";

describe("emailVerification.utils", () => {
  it("validates single email request fields", () => {
    expect(validateSingleEmailRequest({ email: "alice@example.com" }).valid).toBe(true);
    const invalid = validateSingleEmailRequest({ email: "bad-email", requestId: "x" });
    expect(invalid.valid).toBe(false);
    expect(invalid.errors.join(" ")).toContain("valid email");
  });

  it("validates verification id format", () => {
    expect(validateVerificationCode("evf_123").valid).toBe(true);
    expect(validateVerificationCode("!", "Bulk Job ID").valid).toBe(false);
  });

  it("parses bulk csv rows", () => {
    const rows = parseBulkCsv("request_id,customer_id,email\nreq_1,cust_1,first@example.com\nreq_2,cust_2,second@example.com");
    expect(rows).toHaveLength(2);
    expect(rows[0]?.requestId).toBe("req_1");
    expect(rows[1]?.email).toBe("second@example.com");
  });

  it("validates bulk records and detects invalid emails", () => {
    const valid = validateBulkItems([{ email: "ok@example.com" }]);
    expect(valid.valid).toBe(true);
    const invalid = validateBulkItems([{ email: "invalid" }]);
    expect(invalid.valid).toBe(false);
  });

  it("builds analytics from results and bulk status", () => {
    const analytics = buildAnalytics(
      [
        { verificationId: "1", status: "completed", verdict: "valid", riskScore: 10 },
        { verificationId: "2", status: "completed", verdict: "risky", riskScore: 80 },
        { verificationId: "3", status: "failed", verdict: "invalid", riskScore: 99 },
      ],
      {
        bulkJobId: "job_1",
        status: "processing",
        totalRecords: 10,
        processedRecords: 4,
        validCount: 2,
        invalidCount: 1,
        riskyCount: 1,
        unknownCount: 0,
        failedCount: 1,
      },
    );
    expect(analytics.total).toBe(10);
    expect(analytics.completed).toBe(4);
    expect(analytics.averageRiskScore).toBeGreaterThan(0);
  });

  it("exports csv with escaped values", () => {
    const csv = resultsToCsv([
      {
        verificationId: "evf_1",
        status: "completed",
        email: 'alice,"quoted"@example.com',
        verdict: "valid",
      },
    ]);
    expect(csv).toContain("verificationId,requestId");
    expect(csv).toContain('"alice,""quoted""@example.com"');
  });
});

