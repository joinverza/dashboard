import type { BulkEmailVerifyItem, EmailBulkJobStatus, EmailVerificationResult, SingleEmailVerifyRequest } from "@/types/banking";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface EmailVerificationActivity {
  id: string;
  actor: string;
  action: string;
  target: string;
  status: "success" | "error";
  timestamp: string;
  details?: string;
}

export interface EmailVerificationAnalytics {
  total: number;
  completed: number;
  pending: number;
  failed: number;
  valid: number;
  invalid: number;
  risky: number;
  unknown: number;
  averageRiskScore: number;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VERIFICATION_CODE_REGEX = /^[A-Za-z0-9_-]{3,128}$/;

export const validateSingleEmailRequest = (request: SingleEmailVerifyRequest): ValidationResult => {
  const errors: string[] = [];
  const email = request.email.trim();
  if (!email) {
    errors.push("Email is required.");
  } else if (!EMAIL_REGEX.test(email)) {
    errors.push("Enter a valid email address.");
  } else if (email.length > 320) {
    errors.push("Email must be 320 characters or less.");
  }

  if (request.requestId && (request.requestId.length < 2 || request.requestId.length > 128)) {
    errors.push("Request ID must be between 2 and 128 characters.");
  }
  if (request.customerId && (request.customerId.length < 1 || request.customerId.length > 128)) {
    errors.push("Customer ID must be between 1 and 128 characters.");
  }
  return { valid: errors.length === 0, errors };
};

export const validateVerificationCode = (value: string, label = "Verification ID"): ValidationResult => {
  const trimmed = value.trim();
  if (!trimmed) {
    return { valid: false, errors: [`${label} is required.`] };
  }
  if (!VERIFICATION_CODE_REGEX.test(trimmed)) {
    return { valid: false, errors: [`${label} format is invalid.`] };
  }
  return { valid: true, errors: [] };
};

export const normalizeCsvHeaders = (header: string): string => header.trim().toLowerCase().replace(/\s+/g, "_");

export const parseBulkCsv = (csvText: string): BulkEmailVerifyItem[] => {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length <= 1) return [];

  const headers = lines[0].split(",").map(normalizeCsvHeaders);
  return lines.slice(1).map((line, index) => {
    const values = line.split(",").map((v) => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((header, i) => {
      row[header] = values[i] ?? "";
    });
    return {
      requestId: row.requestid || row.request_id || `bulk_req_${index + 1}`,
      customerId: row.customerid || row.customer_id || undefined,
      email: row.email || "",
      metadata: row.segment ? { segment: row.segment } : undefined,
    };
  });
};

export const validateBulkItems = (items: BulkEmailVerifyItem[]): ValidationResult => {
  if (items.length === 0) {
    return { valid: false, errors: ["At least one record is required."] };
  }
  if (items.length > 10000) {
    return { valid: false, errors: ["Bulk requests are limited to 10,000 records."] };
  }
  const invalidEmails = items.filter((item) => !EMAIL_REGEX.test((item.email || "").trim()));
  if (invalidEmails.length > 0) {
    return {
      valid: false,
      errors: [`${invalidEmails.length} records contain invalid email format.`],
    };
  }
  return { valid: true, errors: [] };
};

export const buildAnalytics = (
  results: EmailVerificationResult[],
  jobStatus?: EmailBulkJobStatus | null
): EmailVerificationAnalytics => {
  const total = Math.max(results.length, jobStatus?.totalRecords ?? 0);
  const completed = results.filter((item) => item.status === "completed").length;
  const failed = results.filter((item) => item.status === "failed").length;
  const pending = Math.max(0, total - completed - failed);
  const valid = results.filter((item) => item.verdict === "valid").length;
  const invalid = results.filter((item) => item.verdict === "invalid").length;
  const risky = results.filter((item) => item.verdict === "risky").length;
  const unknown = results.filter((item) => item.verdict === "unknown").length;
  const scores = results.map((item) => item.riskScore).filter((score): score is number => typeof score === "number");
  const averageRiskScore = scores.length > 0 ? Number((scores.reduce((acc, score) => acc + score, 0) / scores.length).toFixed(2)) : 0;
  return {
    total,
    completed: Math.max(completed, jobStatus?.processedRecords ?? 0),
    pending,
    failed: Math.max(failed, jobStatus?.failedCount ?? 0),
    valid: Math.max(valid, jobStatus?.validCount ?? 0),
    invalid: Math.max(invalid, jobStatus?.invalidCount ?? 0),
    risky: Math.max(risky, jobStatus?.riskyCount ?? 0),
    unknown: Math.max(unknown, jobStatus?.unknownCount ?? 0),
    averageRiskScore,
  };
};

export const resultsToCsv = (items: EmailVerificationResult[]): string => {
  const headers = [
    "verificationId",
    "requestId",
    "customerId",
    "email",
    "normalizedEmail",
    "status",
    "verdict",
    "reasonCode",
    "riskScore",
    "createdAt",
    "updatedAt",
    "completedAt",
  ];
  const escapeCell = (value: unknown): string => {
    const text = String(value ?? "");
    if (/[",\n]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
    return text;
  };
  const rows = items.map((item) =>
    headers
      .map((header) => {
        const value =
          header === "verificationId" ? item.verificationId :
          header === "requestId" ? item.requestId :
          header === "customerId" ? item.customerId :
          header === "email" ? item.email :
          header === "normalizedEmail" ? item.normalizedEmail :
          header === "status" ? item.status :
          header === "verdict" ? item.verdict :
          header === "reasonCode" ? item.reasonCode :
          header === "riskScore" ? item.riskScore :
          header === "createdAt" ? item.createdAt :
          header === "updatedAt" ? item.updatedAt :
          header === "completedAt" ? item.completedAt :
          "";
        return escapeCell(value);
      })
      .join(",")
  );
  return [headers.join(","), ...rows].join("\n");
};

export const toActivity = (input: Omit<EmailVerificationActivity, "id" | "timestamp">): EmailVerificationActivity => ({
  id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
  timestamp: new Date().toISOString(),
  ...input,
});
