import { useMemo, useState, type ChangeEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Activity,
  Clock3,
  CheckCircle,
  Download,
  Eye,
  FileText,
  Loader2,
  X,
  RefreshCw,
  Search,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { bankingService, getBankingErrorMessage } from "@/services/bankingService";
import type { AuditLogResponse, BulkVerificationResponse, IndividualKYCRequest } from "@/types/banking";
import { toast } from "sonner";

type ToolResult = Record<string, unknown>;
type CsvRow = Record<string, string>;
type LifecycleNote = { action: "reverify" | "revoke"; note: string; at: string };

export default function VerificationsHub() {
  const [surfaceTab, setSurfaceTab] = useState("requests");
  const [requestsFilter, setRequestsFilter] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [pollingId, setPollingId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [reverifyDialogOpen, setReverifyDialogOpen] = useState(false);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [revokeReason, setRevokeReason] = useState("");
  const [lifecycleLoadingId, setLifecycleLoadingId] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyRequestId, setHistoryRequestId] = useState<string | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyLogs, setHistoryLogs] = useState<AuditLogResponse[]>([]);
  const [lifecycleNotes, setLifecycleNotes] = useState<Record<string, LifecycleNote[]>>({});

  const [workbenchTab, setWorkbenchTab] = useState("kyc");
  const [loadingAction, setLoadingAction] = useState(false);
  const [actionResult, setActionResult] = useState<ToolResult | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [kycData, setKycData] = useState<IndividualKYCRequest>({
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    phone: "",
    address: { street: "", city: "", state: "", zipCode: "", country: "" },
    idDocumentType: "passport",
    idDocumentNumber: "",
  });
  const [docType, setDocType] = useState<"passport" | "drivers_license" | "national_id">("passport");
  const [docCountry, setDocCountry] = useState("");
  const [docImage, setDocImage] = useState("");
  const [screenName, setScreenName] = useState("");
  const [screenCountry, setScreenCountry] = useState("");

  const [batchFile, setBatchFile] = useState<File | null>(null);
  const [batchRows, setBatchRows] = useState<CsvRow[]>([]);
  const [batchHeaders, setBatchHeaders] = useState<string[]>([]);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchResponse, setBatchResponse] = useState<BulkVerificationResponse | null>(null);

  const statsQuery = useQuery({
    queryKey: ["enterprise", "verifications-hub", "stats"],
    queryFn: () => bankingService.getVerificationStats(),
  });
  const requestsQuery = useQuery({
    queryKey: ["enterprise", "verifications-hub", "requests"],
    queryFn: () => bankingService.getVerificationRequests({ limit: 300 }),
  });

  const requests = requestsQuery.data ?? [];
  const selectedRequest = selectedRequestId
    ? requests.find((item) => item.verificationId === selectedRequestId) ?? null
    : null;
  const filteredRequests = useMemo(() => {
    return requests.filter((item) => {
      if (requestsFilter === "pending" && item.status !== "pending" && item.status !== "in_progress") return false;
      if (requestsFilter === "verified" && item.status !== "verified") return false;
      if (requestsFilter === "failed" && item.status !== "rejected" && item.status !== "requires_action") return false;
      if (!searchValue.trim()) return true;
      const q = searchValue.toLowerCase();
      return (
        item.verificationId.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        `${item.details?.firstName ?? ""} ${item.details?.lastName ?? ""}`.toLowerCase().includes(q)
      );
    });
  }, [requests, requestsFilter, searchValue]);

  const executeAction = async (fn: () => Promise<unknown>) => {
    setLoadingAction(true);
    setActionError(null);
    setActionResult(null);
    try {
      const result = await fn();
      setActionResult(typeof result === "object" && result !== null ? (result as ToolResult) : { value: result });
      await Promise.all([requestsQuery.refetch(), statsQuery.refetch()]);
    } catch (error: unknown) {
      setActionError(getBankingErrorMessage(error, "Request failed"));
    } finally {
      setLoadingAction(false);
    }
  };

  const checkStatus = async (verificationId: string) => {
    setPollingId(verificationId);
    try {
      await bankingService.pollVerificationStatus(verificationId, { intervalMs: 2000, maxAttempts: 8 });
      await requestsQuery.refetch();
      toast.success("Status refreshed");
    } catch (error: unknown) {
      toast.error(getBankingErrorMessage(error, "Unable to refresh status"));
    } finally {
      setPollingId(null);
    }
  };

  const openHistoryDrawer = async (verificationId: string) => {
    setHistoryRequestId(verificationId);
    setHistoryOpen(true);
    setHistoryLoading(true);
    try {
      const logs = await bankingService.getVerificationAudit(verificationId);
      setHistoryLogs(logs);
    } catch (error: unknown) {
      setHistoryLogs([]);
      toast.error(getBankingErrorMessage(error, "Unable to load lifecycle history"));
    } finally {
      setHistoryLoading(false);
    }
  };

  const openReverifyDialog = (verificationId: string) => {
    setSelectedRequestId(verificationId);
    setReverifyDialogOpen(true);
  };

  const openRevokeDialog = (verificationId: string) => {
    setSelectedRequestId(verificationId);
    setRevokeReason("");
    setRevokeDialogOpen(true);
  };

  const confirmReverify = async () => {
    if (!selectedRequestId) return;
    setLifecycleLoadingId(selectedRequestId);
    try {
      if (selectedRequest?.type === "kyc_individual") {
        await bankingService.refreshKycIndividualVerification(selectedRequestId);
      } else {
        await bankingService.pollVerificationStatus(selectedRequestId, { intervalMs: 1500, maxAttempts: 3 });
      }
      await Promise.all([requestsQuery.refetch(), statsQuery.refetch()]);
      toast.success("Re-verification triggered successfully");
      setLifecycleNotes((prev) => ({
        ...prev,
        [selectedRequestId]: [
          {
            action: "reverify",
            note: "Re-verification requested from Requests tab",
            at: new Date().toISOString(),
          },
          ...(prev[selectedRequestId] ?? []),
        ],
      }));
      setReverifyDialogOpen(false);
      setSelectedRequestId(null);
    } catch (error: unknown) {
      toast.error(getBankingErrorMessage(error, "Unable to trigger re-verification"));
    } finally {
      setLifecycleLoadingId(null);
    }
  };

  const confirmRevoke = async () => {
    if (!selectedRequestId) return;
    setLifecycleLoadingId(selectedRequestId);
    try {
      await bankingService.updateVerificationStatus(
        selectedRequestId,
        "rejected",
        revokeReason.trim() || "Revoked by enterprise operator",
      );
      await Promise.all([requestsQuery.refetch(), statsQuery.refetch()]);
      toast.success("Verification revoked");
      setLifecycleNotes((prev) => ({
        ...prev,
        [selectedRequestId]: [
          {
            action: "revoke",
            note: revokeReason.trim() || "Revoked by enterprise operator",
            at: new Date().toISOString(),
          },
          ...(prev[selectedRequestId] ?? []),
        ],
      }));
      setRevokeDialogOpen(false);
      setSelectedRequestId(null);
      setRevokeReason("");
    } catch (error: unknown) {
      toast.error(getBankingErrorMessage(error, "Unable to revoke verification"));
    } finally {
      setLifecycleLoadingId(null);
    }
  };

  const parseCsv = (text: string): { headers: string[]; rows: CsvRow[] } => {
    const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
    if (lines.length === 0) return { headers: [], rows: [] };
    const headers = lines[0].split(",").map((item) => item.trim());
    const rows = lines.slice(1).map((line) => {
      const values = line.split(",").map((item) => item.trim());
      const row: CsvRow = {};
      headers.forEach((header, index) => {
        row[header] = values[index] ?? "";
      });
      return row;
    });
    return { headers, rows };
  };

  const onBatchFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBatchFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      const parsed = parseCsv(text);
      setBatchHeaders(parsed.headers);
      setBatchRows(parsed.rows);
    };
    reader.readAsText(file);
  };

  const submitBatch = async () => {
    if (batchRows.length === 0) return;
    setBatchLoading(true);
    try {
      const mapped = batchRows.map((row, index) => ({
        requestId: row.request_id || `req_${index + 1}`,
        customerId: row.customer_id || row.email || `customer_${index + 1}`,
        personalInfo: {
          firstName: row.first_name || row.firstName || "",
          lastName: row.last_name || row.lastName || "",
          country: row.country || "US",
        },
        contactInfo: {
          email: row.email || "",
          address: { country: row.country || "US" },
        },
        identityDocuments: [
          {
            type: "national_id" as const,
            number: row.id_number || row.idNumber || "",
          },
        ],
      }));
      const response = await bankingService.initiateBulkVerification({ items: mapped });
      setBatchResponse(response);
      toast.success(`Batch queued: ${response.items.length} requests`);
      await Promise.all([requestsQuery.refetch(), statsQuery.refetch()]);
    } catch (error: unknown) {
      toast.error(getBankingErrorMessage(error, "Bulk verification failed"));
    } finally {
      setBatchLoading(false);
    }
  };

  const refreshRequests = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([requestsQuery.refetch(), statsQuery.refetch()]);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-ent-text">Verifications</h1>
        <p className="text-verza-gray mt-1">
          Unified verification workspace for requests, direct checks, and batch processing.
        </p>
      </div>

      <Tabs value={surfaceTab} onValueChange={setSurfaceTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white/[0.05] p-1 rounded-xl h-12">
          <TabsTrigger value="requests" className="data-[state=active]:bg-ent-card data-[state=active]:text-ent-text text-verza-gray rounded-lg transition-all h-full">Requests</TabsTrigger>
          <TabsTrigger value="workbench" className="data-[state=active]:bg-ent-card data-[state=active]:text-ent-text text-verza-gray rounded-lg transition-all h-full">Single Workbench</TabsTrigger>
          <TabsTrigger value="batch" className="data-[state=active]:bg-ent-card data-[state=active]:text-ent-text text-verza-gray rounded-lg transition-all h-full">Batch Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-ent-card border border-white/[0.05] rounded-2xl p-6">
              <div className="text-sm font-semibold text-verza-gray mb-2">Total</div>
              <div className="text-3xl font-bold text-ent-text">{statsQuery.data?.totalVerifications ?? 0}</div>
            </div>
            <div className="bg-ent-card border border-white/[0.05] rounded-2xl p-6">
              <div className="text-sm font-semibold text-verza-gray mb-2">Pending</div>
              <div className="text-3xl font-bold text-ent-text">{statsQuery.data?.pending ?? 0}</div>
            </div>
            <div className="bg-ent-card border border-white/[0.05] rounded-2xl p-6">
              <div className="text-sm font-semibold text-verza-gray mb-2">Approved</div>
              <div className="text-3xl font-bold text-ent-text">{statsQuery.data?.approved ?? 0}</div>
            </div>
          </div>

          <div className="enterprise-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-ent-text">Verification Requests</h3>
                <p className="text-sm text-verza-gray">Queue, status checks, and detail access in one table.</p>
              </div>
              <Button 
                variant="outline" 
                onClick={refreshRequests} 
                disabled={isRefreshing}
                className="bg-ent-muted border-ent-border text-ent-text hover:bg-ent-text/10"
              >
                {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-2">
                <Select value={requestsFilter} onValueChange={setRequestsFilter}>
                  <SelectTrigger className="w-full md:w-48 bg-ent-muted border-ent-border text-ent-text focus:ring-verza-emerald/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-ent-card border-ent-border text-ent-text">
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending/In Progress</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="failed">Failed/Action Needed</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative w-full">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-verza-gray" />
                  <Input 
                    className="pl-9 bg-ent-muted border-ent-border text-ent-text placeholder:text-verza-gray/50 focus:border-verza-emerald/30 focus:ring-0" 
                    placeholder="Search id, type, or subject..." 
                    value={searchValue} 
                    onChange={(e) => setSearchValue(e.target.value)} 
                  />
                </div>
              </div>

              <div className="rounded-xl border border-ent-border overflow-hidden bg-ent-text/5">
                <Table>
                  <TableHeader className="bg-ent-muted">
                    <TableRow className="hover:bg-transparent border-ent-border">
                      <TableHead className="text-verza-gray font-medium">Request ID</TableHead>
                      <TableHead className="text-verza-gray font-medium">Type</TableHead>
                      <TableHead className="text-verza-gray font-medium">Status</TableHead>
                      <TableHead className="text-verza-gray font-medium">Date</TableHead>
                      <TableHead className="text-verza-gray font-medium">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requestsQuery.isLoading ? (
                      <TableRow className="border-ent-border"><TableCell colSpan={5} className="text-center py-8 text-verza-gray">Loading requests...</TableCell></TableRow>
                    ) : filteredRequests.length === 0 ? (
                      <TableRow className="border-ent-border"><TableCell colSpan={5} className="text-center py-8 text-verza-gray">No requests found.</TableCell></TableRow>
                    ) : (
                      filteredRequests.slice(0, 100).map((req) => (
                        <TableRow key={req.verificationId} className="border-ent-border hover:bg-ent-muted transition-colors">
                          <TableCell className="font-mono text-xs text-ent-text">{req.verificationId}</TableCell>
                          <TableCell className="capitalize text-ent-text/90">{req.type.replace("_", " ")}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-ent-border text-verza-gray bg-ent-muted">
                              {req.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-verza-gray text-sm">{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="space-x-2">
                             <Link href={`/enterprise/requests/${req.verificationId}`}>
                              <Button size="sm" variant="outline" className="bg-ent-text/10 border-ent-border text-verza-gray hover:text-ent-text hover:bg-ent-text/10">
                                <Eye className="h-4 w-4 mr-1" />View
                              </Button>
                            </Link>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => checkStatus(req.verificationId)} 
                              disabled={pollingId === req.verificationId}
                              className="bg-ent-text/10 border-ent-border text-verza-gray hover:text-ent-text hover:bg-ent-text/10"
                            >
                              {pollingId === req.verificationId ? <Loader2 className="h-4 w-4 animate-spin" /> : <Activity className="h-4 w-4 mr-1" />}
                              Status
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openReverifyDialog(req.verificationId)}
                              disabled={lifecycleLoadingId === req.verificationId}
                              className="bg-ent-text/10 border-ent-border text-verza-gray hover:text-ent-text hover:bg-ent-text/10"
                            >
                              {lifecycleLoadingId === req.verificationId ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-1" />}
                              Re-verify
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openRevokeDialog(req.verificationId)}
                              disabled={lifecycleLoadingId === req.verificationId}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              Revoke
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openHistoryDrawer(req.verificationId)}
                              className="bg-ent-text/10 border-ent-border text-verza-gray hover:text-ent-text hover:bg-ent-text/10"
                            >
                              <Clock3 className="h-4 w-4 mr-1" />
                              History
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="workbench" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <Tabs value={workbenchTab} onValueChange={setWorkbenchTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="kyc">KYC</TabsTrigger>
                  <TabsTrigger value="document">Document</TabsTrigger>
                  <TabsTrigger value="screening">Screening</TabsTrigger>
                </TabsList>

                <TabsContent value="kyc">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" />Individual KYC</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <Input placeholder="First name" value={kycData.firstName} onChange={(e) => setKycData({ ...kycData, firstName: e.target.value })} />
                        <Input placeholder="Last name" value={kycData.lastName} onChange={(e) => setKycData({ ...kycData, lastName: e.target.value })} />
                        <Input type="date" value={kycData.dob} onChange={(e) => setKycData({ ...kycData, dob: e.target.value })} />
                        <Input placeholder="Email" value={kycData.email} onChange={(e) => setKycData({ ...kycData, email: e.target.value })} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Select value={kycData.idDocumentType} onValueChange={(v: "passport" | "drivers_license" | "national_id") => setKycData({ ...kycData, idDocumentType: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="passport">Passport</SelectItem>
                            <SelectItem value="drivers_license">Driver's License</SelectItem>
                            <SelectItem value="national_id">National ID</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input placeholder="ID number" value={kycData.idDocumentNumber} onChange={(e) => setKycData({ ...kycData, idDocumentNumber: e.target.value })} />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => executeAction(() => bankingService.verifyIndividual(kycData))} disabled={loadingAction}>Run Full KYC</Button>
                        <Button variant="outline" onClick={() => executeAction(() => bankingService.verifyIndividualBasic(kycData))} disabled={loadingAction}>Run Basic KYC</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="document">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Document Verification</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <Select value={docType} onValueChange={(v: "passport" | "drivers_license" | "national_id") => setDocType(v)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="passport">Passport</SelectItem>
                            <SelectItem value="drivers_license">Driver's License</SelectItem>
                            <SelectItem value="national_id">National ID</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input placeholder="Issuing country (e.g. US)" value={docCountry} onChange={(e) => setDocCountry(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Document Image</Label>
                        <Input type="file" accept="image/*" onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => setDocImage(typeof reader.result === "string" ? reader.result : "");
                          reader.readAsDataURL(file);
                        }} />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => executeAction(() => bankingService.verifyDocument({
                          documentImage: docImage,
                          documentType: docType,
                          issuingCountry: docCountry.trim().toUpperCase(),
                          useOcr: true,
                        }))} disabled={loadingAction}>Verify Document</Button>
                        <Button variant="outline" onClick={() => executeAction(() => bankingService.extractDocumentData({ documentImage: docImage }))} disabled={loadingAction}>Extract Fields</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="screening">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Search className="h-5 w-5" />Screening</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Input placeholder="Full name" value={screenName} onChange={(e) => setScreenName(e.target.value)} />
                      <Input placeholder="Country" value={screenCountry} onChange={(e) => setScreenCountry(e.target.value)} />
                      <div className="flex gap-2">
                        <Button onClick={() => executeAction(() => bankingService.checkSanctions({ name: screenName, country: screenCountry }))} disabled={loadingAction}>Sanctions</Button>
                        <Button variant="outline" onClick={() => executeAction(() => bankingService.checkPEP({ name: screenName, country: screenCountry }))} disabled={loadingAction}>PEP</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Action Result</CardTitle>
                <CardDescription>Live output of workbench actions.</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingAction ? (
                  <div className="text-muted-foreground flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" />Processing...</div>
                ) : actionError ? (
                  <div className="text-destructive text-sm">{actionError}</div>
                ) : actionResult ? (
                  <pre className="text-xs overflow-auto max-h-[500px] bg-muted/40 rounded-md p-3">{JSON.stringify(actionResult, null, 2)}</pre>
                ) : (
                  <p className="text-sm text-muted-foreground">Run an action to see output.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="batch" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Upload className="h-5 w-5" />Batch Verification Actions</CardTitle>
              <CardDescription>Upload CSV rows and queue batch verifications without leaving this screen.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-2 md:items-center">
                <Input type="file" accept=".csv" onChange={onBatchFileSelect} />
                <Button variant="outline" onClick={() => {
                  const template = "first_name,last_name,email,id_number,country\nJane,Doe,jane@example.com,ABC123,US";
                  const blob = new Blob([template], { type: "text/csv;charset=utf-8;" });
                  const url = URL.createObjectURL(blob);
                  const anchor = document.createElement("a");
                  anchor.href = url;
                  anchor.download = "bulk-template.csv";
                  document.body.appendChild(anchor);
                  anchor.click();
                  anchor.remove();
                  URL.revokeObjectURL(url);
                }}>
                  <Download className="h-4 w-4 mr-2" />Template
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">
                File: {batchFile?.name ?? "No file selected"} · Headers: {batchHeaders.length} · Rows: {batchRows.length}
              </div>

              <div className="flex gap-2">
                <Button onClick={submitBatch} disabled={batchLoading || batchRows.length === 0}>
                  {batchLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                  Submit Batch
                </Button>
                <Link href="/enterprise/tools"><Button variant="outline">Open Advanced Operations Hub</Button></Link>
              </div>

              {batchResponse && (
                <div className="rounded-md border p-3 text-sm space-y-2">
                  <div className="font-medium flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />Batch queued successfully</div>
                  <div>Batch ID: <span className="font-mono text-xs">{batchResponse.batchId}</span></div>
                  <div>Submitted Requests: {batchResponse.items.length}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={reverifyDialogOpen} onOpenChange={setReverifyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Re-verify</DialogTitle>
            <DialogDescription>
              This will re-run verification checks for request <span className="font-mono">{selectedRequestId}</span>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReverifyDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmReverify} disabled={!selectedRequestId || lifecycleLoadingId === selectedRequestId}>
              {lifecycleLoadingId === selectedRequestId ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Confirm Re-verify
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Revoke</DialogTitle>
            <DialogDescription>
              This marks request <span className="font-mono">{selectedRequestId}</span> as revoked/rejected.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="revoke-reason">Reason</Label>
            <Textarea
              id="revoke-reason"
              placeholder="Provide a reason for revocation..."
              value={revokeReason}
              onChange={(event) => setRevokeReason(event.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmRevoke} disabled={!selectedRequestId || lifecycleLoadingId === selectedRequestId}>
              {lifecycleLoadingId === selectedRequestId ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Confirm Revoke
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {historyOpen && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={() => setHistoryOpen(false)}
            aria-label="Close lifecycle history"
          />
          <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-background border-l shadow-xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Lifecycle History</h2>
                <p className="text-xs text-muted-foreground font-mono">{historyRequestId}</p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => setHistoryOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Recent Action Notes</CardTitle>
                  <CardDescription>Inline notes captured from re-verify/revoke actions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {(historyRequestId && lifecycleNotes[historyRequestId]?.length) ? (
                    lifecycleNotes[historyRequestId].slice(0, 10).map((note, index) => (
                      <div key={`${note.at}-${index}`} className="rounded-md border p-2 text-xs">
                        <div className="font-medium uppercase">{note.action}</div>
                        <div className="text-muted-foreground">{new Date(note.at).toLocaleString()}</div>
                        <div className="mt-1">{note.note}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">No inline action notes yet.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Audit Events</CardTitle>
                  <CardDescription>Latest backend lifecycle events for this request.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {historyLoading ? (
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading audit trail...
                    </div>
                  ) : historyLogs.length > 0 ? (
                    historyLogs.slice(0, 20).map((log) => (
                      <div key={log.id} className="rounded-md border p-2 text-xs">
                        <div className="font-medium">{log.action}</div>
                        <div className="text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</div>
                        <div className="mt-1 break-words">{typeof log.details === "string" ? log.details : JSON.stringify(log.details)}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">No audit events found.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
