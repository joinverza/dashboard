import { useMemo, useState, type ChangeEvent } from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { bankingService, getBankingErrorMessage } from "@/services/bankingService";
import type { BulkEmailVerifyItem, EmailBulkJobStatus, EmailVerificationResult, SingleEmailVerifyRequest } from "@/types/banking";
import {
  buildAnalytics,
  parseBulkCsv,
  resultsToCsv,
  toActivity,
  validateBulkItems,
  validateSingleEmailRequest,
  validateVerificationCode,
  type EmailVerificationActivity,
} from "./emailVerification.utils";

const triggerDownload = (fileName: string, content: string, mime = "text/plain"): void => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

export default function EmailVerificationManagement() {
  const { hasPermission, permissions, user } = useAuth();
  const canRead = permissions.length === 0 || hasPermission("email_verification:read") || hasPermission("kyc:read") || hasPermission("verification:read");
  const canWrite = permissions.length === 0 || hasPermission("email_verification:write") || hasPermission("kyc:write");

  const [singleForm, setSingleForm] = useState<SingleEmailVerifyRequest>({
    requestId: "",
    customerId: "",
    email: "",
    metadata: { channel: "dashboard" },
  });
  const [bulkJsonText, setBulkJsonText] = useState('[{"requestId":"bulk_1","customerId":"cust_1","email":"first@example.com"}]');
  const [bulkUploadFile, setBulkUploadFile] = useState<File | null>(null);
  const [bulkPreviewItems, setBulkPreviewItems] = useState<BulkEmailVerifyItem[]>([]);
  const [verificationLookupId, setVerificationLookupId] = useState("");
  const [bulkJobLookupId, setBulkJobLookupId] = useState("");
  const [singleResult, setSingleResult] = useState<EmailVerificationResult | null>(null);
  const [bulkStatus, setBulkStatus] = useState<EmailBulkJobStatus | null>(null);
  const [bulkResults, setBulkResults] = useState<EmailVerificationResult[]>([]);
  const [activities, setActivities] = useState<EmailVerificationActivity[]>([]);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [liveStatus, setLiveStatus] = useState("");
  const [resultPage, setResultPage] = useState(1);
  const resultLimit = 100;

  const analytics = useMemo(() => buildAnalytics(bulkResults, bulkStatus), [bulkResults, bulkStatus]);
  const pagedResults = useMemo(() => {
    const start = (resultPage - 1) * resultLimit;
    return bulkResults.slice(start, start + resultLimit);
  }, [bulkResults, resultPage]);
  const totalPages = Math.max(1, Math.ceil(bulkResults.length / resultLimit));
  const progress = bulkStatus?.totalRecords ? Math.round((bulkStatus.processedRecords / Math.max(1, bulkStatus.totalRecords)) * 100) : 0;

  const appendActivity = (activity: Omit<EmailVerificationActivity, "id" | "timestamp">) => {
    setActivities((prev) => [toActivity(activity), ...prev].slice(0, 100));
  };

  const withLoading = async (key: string, action: () => Promise<void>) => {
    setLoadingKey(key);
    try {
      await action();
    } finally {
      setLoadingKey(null);
    }
  };

  const submitSingle = async () => {
    if (!canWrite) {
      toast.error("You do not have permission to submit verification requests.");
      return;
    }
    const validation = validateSingleEmailRequest(singleForm);
    if (!validation.valid) {
      toast.error(validation.errors.join(" "));
      return;
    }
    await withLoading("single-submit", async () => {
      const response = await bankingService.verifyEmailSingle({
        ...singleForm,
        email: singleForm.email.trim().toLowerCase(),
      });
      setVerificationLookupId(response.verificationId);
      setLiveStatus(`Single verification accepted with ID ${response.verificationId}`);
      appendActivity({
        actor: user?.email ?? "system",
        action: "single_submit",
        target: response.verificationId,
        status: "success",
        details: `status=${response.status}`,
      });
      toast.success("Email verification submitted.");
    });
  };

  const submitBulkJson = async () => {
    if (!canWrite) {
      toast.error("You do not have permission to submit bulk jobs.");
      return;
    }
    let parsed: BulkEmailVerifyItem[] = [];
    try {
      const raw = JSON.parse(bulkJsonText) as unknown;
      parsed = Array.isArray(raw) ? raw as BulkEmailVerifyItem[] : [];
    } catch {
      toast.error("Bulk JSON is invalid.");
      return;
    }
    const validation = validateBulkItems(parsed);
    if (!validation.valid) {
      toast.error(validation.errors.join(" "));
      return;
    }
    await withLoading("bulk-json", async () => {
      const response = await bankingService.verifyEmailBulkJson({ items: parsed });
      setBulkJobLookupId(response.bulkJobId);
      setLiveStatus(`Bulk JSON job accepted: ${response.bulkJobId}`);
      appendActivity({
        actor: user?.email ?? "system",
        action: "bulk_submit_json",
        target: response.bulkJobId,
        status: "success",
        details: `accepted=${response.acceptedCount}`,
      });
      toast.success(`Bulk job accepted (${response.acceptedCount} records).`);
    });
  };

  const uploadBulkCsv = async () => {
    if (!canWrite) {
      toast.error("You do not have permission to upload bulk files.");
      return;
    }
    if (!bulkUploadFile) {
      toast.error("Select a CSV file first.");
      return;
    }
    await withLoading("bulk-upload", async () => {
      const response = await bankingService.verifyEmailBulkUpload(bulkUploadFile);
      setBulkJobLookupId(response.bulkJobId);
      setLiveStatus(`Bulk CSV job accepted: ${response.bulkJobId}`);
      appendActivity({
        actor: user?.email ?? "system",
        action: "bulk_submit_csv",
        target: response.bulkJobId,
        status: "success",
        details: `accepted=${response.acceptedCount}`,
      });
      toast.success(`CSV upload accepted (${response.acceptedCount} records).`);
    });
  };

  const fetchSingleResult = async () => {
    const validation = validateVerificationCode(verificationLookupId, "Verification ID");
    if (!validation.valid) {
      toast.error(validation.errors.join(" "));
      return;
    }
    await withLoading("single-fetch", async () => {
      const result = await bankingService.getEmailVerificationResult(verificationLookupId.trim());
      setSingleResult(result);
      setLiveStatus(`Single verification status: ${result.status}`);
      appendActivity({
        actor: user?.email ?? "system",
        action: "single_fetch",
        target: verificationLookupId.trim(),
        status: "success",
      });
    });
  };

  const pollSingleResult = async () => {
    await withLoading("single-poll", async () => {
      const result = await bankingService.pollEmailVerificationResult(verificationLookupId.trim(), {
        intervalMs: 2500,
        maxAttempts: 20,
        onProgress: (status, attempt, maxAttempts) => {
          setLiveStatus(`Polling single result (${attempt}/${maxAttempts}): ${status}`);
        },
      });
      setSingleResult(result);
      toast.success(`Single verification reached terminal state: ${result.status}`);
    });
  };

  const fetchBulkJob = async () => {
    const validation = validateVerificationCode(bulkJobLookupId, "Bulk Job ID");
    if (!validation.valid) {
      toast.error(validation.errors.join(" "));
      return;
    }
    await withLoading("bulk-fetch", async () => {
      const status = await bankingService.getEmailBulkJobStatus(bulkJobLookupId.trim());
      const results = await bankingService.getEmailBulkJobResults(bulkJobLookupId.trim(), { page: 1, limit: 1000 });
      setBulkStatus(status);
      setBulkResults(results.items);
      setResultPage(1);
      setLiveStatus(`Bulk job status: ${status.status} (${status.processedRecords}/${status.totalRecords})`);
      appendActivity({
        actor: user?.email ?? "system",
        action: "bulk_fetch",
        target: bulkJobLookupId.trim(),
        status: "success",
      });
    });
  };

  const pollBulkJob = async () => {
    await withLoading("bulk-poll", async () => {
      const status = await bankingService.pollEmailBulkJobStatus(bulkJobLookupId.trim(), {
        intervalMs: 3000,
        maxAttempts: 30,
        onProgress: (current, attempt, maxAttempts) => {
          setLiveStatus(`Polling bulk job (${attempt}/${maxAttempts}): ${current}`);
        },
      });
      const results = await bankingService.getEmailBulkJobResults(bulkJobLookupId.trim(), { page: 1, limit: 1000 });
      setBulkStatus(status);
      setBulkResults(results.items);
      setResultPage(1);
      toast.success(`Bulk job reached terminal state: ${status.status}`);
    });
  };

  const onCsvPicked = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setBulkUploadFile(file);
    if (!file) {
      setBulkPreviewItems([]);
      return;
    }
    try {
      const text = await file.text();
      const parsed = parseBulkCsv(text);
      setBulkPreviewItems(parsed);
      const validation = validateBulkItems(parsed);
      if (!validation.valid) {
        toast.error(validation.errors.join(" "));
      }
    } catch (error) {
      toast.error(getBankingErrorMessage(error, "Failed to parse CSV"));
    }
  };

  const exportResults = () => {
    const csv = resultsToCsv(bulkResults);
    triggerDownload(`email-verification-results-${bulkJobLookupId || "export"}.csv`, csv, "text/csv");
    appendActivity({
      actor: user?.email ?? "system",
      action: "results_export",
      target: bulkJobLookupId || "manual_export",
      status: "success",
      details: `rows=${bulkResults.length}`,
    });
    toast.success("Verification report exported.");
  };

  if (!canRead) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Email Verification</h1>
        <Card>
          <CardHeader>
            <CardTitle>Insufficient Permissions</CardTitle>
            <CardDescription>You need `email_verification:read`, `kyc:read`, or `verification:read` permission.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Email Verification Management</h1>
          <p className="text-muted-foreground">Single and bulk verification workflows with real-time status, analytics, exports, and audit traceability.</p>
        </div>
        <div className="text-xs text-muted-foreground" role="status" aria-live="polite">{liveStatus || "Ready"}</div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{analytics.total}</CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Completed</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{analytics.completed}</CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Pending</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{analytics.pending}</CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Risky</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{analytics.risky}</CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Avg Risk</CardTitle></CardHeader><CardContent className="text-2xl font-semibold">{analytics.averageRiskScore.toFixed(2)}</CardContent></Card>
      </div>

      <Tabs defaultValue="submit" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="submit">Submit Requests</TabsTrigger>
          <TabsTrigger value="monitor">Monitor Results</TabsTrigger>
          <TabsTrigger value="audit">Audit & Export</TabsTrigger>
        </TabsList>

        <TabsContent value="submit" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Single Verification</CardTitle>
                <CardDescription>Validate and submit one email verification request.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="request-id">Request ID</Label>
                    <Input id="request-id" value={singleForm.requestId || ""} onChange={(event) => setSingleForm((prev) => ({ ...prev, requestId: event.target.value }))} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="customer-id">Customer ID</Label>
                    <Input id="customer-id" value={singleForm.customerId || ""} onChange={(event) => setSingleForm((prev) => ({ ...prev, customerId: event.target.value }))} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email-address">Email</Label>
                  <Input id="email-address" type="email" autoComplete="email" value={singleForm.email} onChange={(event) => setSingleForm((prev) => ({ ...prev, email: event.target.value }))} />
                </div>
                <Button onClick={() => void submitSingle()} disabled={!canWrite || loadingKey === "single-submit"} aria-label="Submit single email verification">
                  {loadingKey === "single-submit" ? "Submitting..." : "Submit Single Request"}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bulk Verification</CardTitle>
                <CardDescription>Submit bulk items as JSON or upload CSV.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Label htmlFor="bulk-json">Bulk JSON Payload</Label>
                <Textarea id="bulk-json" className="min-h-32 font-mono text-xs" value={bulkJsonText} onChange={(event) => setBulkJsonText(event.target.value)} />
                <Button variant="outline" onClick={() => void submitBulkJson()} disabled={!canWrite || loadingKey === "bulk-json"}>Submit JSON Batch</Button>
                <div className="border-t pt-3">
                  <Label htmlFor="csv-upload">CSV Upload</Label>
                  <Input id="csv-upload" type="file" accept=".csv" onChange={(event) => void onCsvPicked(event)} />
                  <div className="mt-2 text-xs text-muted-foreground">Preview rows: {bulkPreviewItems.length}</div>
                  <Button className="mt-2" variant="outline" onClick={() => void uploadBulkCsv()} disabled={!canWrite || !bulkUploadFile || loadingKey === "bulk-upload"}>
                    Upload CSV Batch
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitor" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Single Result</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Label htmlFor="single-id">Verification ID</Label>
                <Input id="single-id" value={verificationLookupId} onChange={(event) => setVerificationLookupId(event.target.value)} />
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => void fetchSingleResult()} disabled={loadingKey === "single-fetch"}>Fetch</Button>
                  <Button onClick={() => void pollSingleResult()} disabled={loadingKey === "single-poll" || !verificationLookupId.trim()}>Poll Real-Time</Button>
                </div>
                {singleResult && (
                  <div className="rounded-md border p-3 text-sm space-y-1">
                    <div>Status: <Badge variant="outline">{singleResult.status}</Badge></div>
                    <div>Verdict: {singleResult.verdict || "-"}</div>
                    <div>Risk Score: {singleResult.riskScore ?? "-"}</div>
                    <div>Reason: {singleResult.reasonCode || "-"}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bulk Job Monitor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Label htmlFor="bulk-job-id">Bulk Job ID</Label>
                <Input id="bulk-job-id" value={bulkJobLookupId} onChange={(event) => setBulkJobLookupId(event.target.value)} />
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => void fetchBulkJob()} disabled={loadingKey === "bulk-fetch"}>Fetch</Button>
                  <Button onClick={() => void pollBulkJob()} disabled={loadingKey === "bulk-poll" || !bulkJobLookupId.trim()}>Poll Real-Time</Button>
                </div>
                <Progress value={progress} aria-label="Bulk processing progress" />
                {bulkStatus && (
                  <div className="rounded-md border p-3 text-sm space-y-1">
                    <div>Status: <Badge variant="outline">{bulkStatus.status}</Badge></div>
                    <div>Processed: {bulkStatus.processedRecords}/{bulkStatus.totalRecords}</div>
                    <div>Valid: {bulkStatus.validCount} | Invalid: {bulkStatus.invalidCount} | Risky: {bulkStatus.riskyCount}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Bulk Results</CardTitle>
              <CardDescription>Optimized pagination for large result sets (100 rows per page).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <div className="text-sm text-muted-foreground">Rows: {bulkResults.length}</div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setResultPage((prev) => Math.max(1, prev - 1))} disabled={resultPage <= 1}>Previous</Button>
                  <div className="text-sm p-2">Page {resultPage}/{totalPages}</div>
                  <Button size="sm" variant="outline" onClick={() => setResultPage((prev) => Math.min(totalPages, prev + 1))} disabled={resultPage >= totalPages}>Next</Button>
                </div>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Verification ID</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Verdict</TableHead>
                      <TableHead>Risk</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagedResults.length === 0 ? (
                      <TableRow><TableCell colSpan={5}>No results loaded.</TableCell></TableRow>
                    ) : (
                      pagedResults.map((item) => (
                        <TableRow key={item.verificationId}>
                          <TableCell className="font-mono text-xs">{item.verificationId}</TableCell>
                          <TableCell>{item.email || item.normalizedEmail || "-"}</TableCell>
                          <TableCell><Badge variant="outline">{item.status}</Badge></TableCell>
                          <TableCell>{item.verdict || "-"}</TableCell>
                          <TableCell>{item.riskScore ?? "-"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
              <CardDescription>Client-side activity capture for verification operations and exports.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={exportResults} disabled={bulkResults.length === 0}>Export Verification Report</Button>
              <div className="max-h-96 space-y-2 overflow-auto rounded-md border p-3">
                {activities.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No activities yet.</div>
                ) : (
                  activities.map((item) => (
                    <div key={item.id} className="rounded-md border p-2 text-xs">
                      <div className="font-medium">{item.action}</div>
                      <div className="text-muted-foreground">{new Date(item.timestamp).toLocaleString()} - {item.actor}</div>
                      <div>Target: {item.target}</div>
                      <div>Status: {item.status}</div>
                      {item.details ? <div>Details: {item.details}</div> : null}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
