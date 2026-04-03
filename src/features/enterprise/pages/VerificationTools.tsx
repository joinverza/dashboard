import { useMemo, useState, type ChangeEvent } from 'react';
import { AlertTriangle, BarChart3, Clock3, Download, FileSpreadsheet, Loader2, ShieldCheck, SlidersHorizontal, Upload, Webhook } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ApiErrorBoundary } from '@/components/shared/ApiErrorBoundary';
import { TabHelpCard } from '@/components/shared/TabHelpCard';
import { bankingService, getBankingErrorMessage } from '@/services/bankingService';
import { webhooksService } from '@/services/apiManagementService';
import type { AuditLogResponse, LicenseUsageMetrics, RiskSimulationResponse, WebhookResponse, WebhookRetryItem } from '@/types/banking';
import { calculateQuotaPercent, parseCsvText, toCsvErrorReport } from './operationsHub.utils';

const triggerFileDownload = (name: string, content: string, mime = 'text/plain'): void => {
  const blob = new Blob([content], { type: mime });
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(href);
};

export default function VerificationTools() {
  const [activeTab, setActiveTab] = useState('bulk');
  const [csvName, setCsvName] = useState('');
  const [csvRows, setCsvRows] = useState<Array<Record<string, string>>>([]);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [bulkIssues, setBulkIssues] = useState<Array<{ row: number; field: string; message: string; severity: string }>>([]);
  const [riskWeights, setRiskWeights] = useState({ identity: 20, sanctions: 30, transaction: 20, geography: 15, device: 15 });
  const [riskInput, setRiskInput] = useState({ customerType: 'retail' as 'retail' | 'business', country: 'US', transactionAmount: 1500, sanctionsHits: 0, priorAlerts: 1 });
  const [riskResult, setRiskResult] = useState<RiskSimulationResponse | null>(null);
  const [auditFilters, setAuditFilters] = useState({ from: '', to: '', entity: '', eventType: '' });
  const [auditLogs, setAuditLogs] = useState<AuditLogResponse[]>([]);
  const [webhookForm, setWebhookForm] = useState({ url: '', events: 'verification.completed,verification.failed' });
  const [webhooks, setWebhooks] = useState<WebhookResponse[]>([]);
  const [retryQueue, setRetryQueue] = useState<WebhookRetryItem[]>([]);
  const [usage, setUsage] = useState<LicenseUsageMetrics | null>(null);
  const [loading, setLoading] = useState(false);

  const quotaPercent = useMemo(() => {
    if (!usage) return 0;
    return calculateQuotaPercent(usage.usedQuota, usage.monthlyQuota);
  }, [usage]);

  const handleCsvUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setCsvName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === 'string' ? reader.result : '';
      const rows = parseCsvText(text);
      setCsvRows(rows);
    };
    reader.readAsText(file);
  };

  const validateBulk = async () => {
    if (!csvRows.length) {
      toast.error('Upload CSV rows before validation');
      return;
    }
    setLoading(true);
    setBulkProgress(10);
    try {
      const result = await bankingService.validateBulkOnboardingUpload(csvRows);
      setBulkProgress(result.progress);
      setBulkIssues(result.issues);
      toast.success(`Validation finished: ${result.validRows}/${result.totalRows} valid`);
    } catch (error) {
      toast.error(getBankingErrorMessage(error, 'Validation failed'));
      setBulkProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const importBulk = async () => {
    if (!csvRows.length) return;
    setLoading(true);
    try {
      const result = await bankingService.importBulkOnboardingRows(csvRows);
      toast.success(`Import ${result.status}: ${result.acceptedRows} accepted`);
    } catch (error) {
      toast.error(getBankingErrorMessage(error, 'Import failed'));
    } finally {
      setLoading(false);
    }
  };

  const runRiskSimulation = async () => {
    setLoading(true);
    try {
      const result = await bankingService.simulateRiskScore({
        customerProfile: riskInput,
        weights: riskWeights,
      });
      setRiskResult(result);
    } catch (error) {
      toast.error(getBankingErrorMessage(error, 'Simulation failed'));
    } finally {
      setLoading(false);
    }
  };

  const exportRiskPdf = async () => {
    if (!riskResult) return;
    const report = await bankingService.generateRiskSandboxReport({
      simulation: riskResult,
      customerProfile: riskInput,
      weights: riskWeights,
    });
    const content = [
      `Risk Report ID: ${report.reportId}`,
      `Generated At: ${report.generatedAt}`,
      `Score: ${riskResult.score}`,
      `Risk Level: ${riskResult.riskLevel}`,
      `Recommendation: ${riskResult.recommendation}`,
      `Weights: ${JSON.stringify(riskWeights)}`,
      `Inputs: ${JSON.stringify(riskInput)}`
    ].join('\n');
    triggerFileDownload(`risk-sandbox-${report.reportId}.pdf`, content, 'application/pdf');
  };

  const searchAuditLogs = async () => {
    setLoading(true);
    try {
      const result = await bankingService.searchAuditTrail({
        from: auditFilters.from || undefined,
        to: auditFilters.to || undefined,
        entity: auditFilters.entity || undefined,
        eventType: auditFilters.eventType || undefined,
      });
      setAuditLogs(result);
    } catch (error) {
      toast.error(getBankingErrorMessage(error, 'Audit search failed'));
    } finally {
      setLoading(false);
    }
  };

  const exportSignedLogs = async () => {
    const result = await bankingService.exportSignedAuditLogs({
      from: auditFilters.from || undefined,
      to: auditFilters.to || undefined,
      entity: auditFilters.entity || undefined,
      eventType: auditFilters.eventType || undefined,
    });
    const content = JSON.stringify({ signature: result.signature, logs: auditLogs }, null, 2);
    triggerFileDownload(`signed-audit-${result.exportId}.json`, content, 'application/json');
  };

  const loadWebhooks = async () => {
    setLoading(true);
    try {
      const [items, retries] = await Promise.all([webhooksService.list(), bankingService.getWebhookRetryQueue()]);
      setWebhooks(items);
      setRetryQueue(retries);
    } catch (error) {
      toast.error(getBankingErrorMessage(error, 'Failed to load webhooks'));
    } finally {
      setLoading(false);
    }
  };

  const registerWebhook = async () => {
    if (!webhookForm.url.trim()) return;
    await webhooksService.register({
      url: webhookForm.url.trim(),
      events: webhookForm.events.split(',').map((item) => item.trim()).filter(Boolean),
      active: true,
    });
    await loadWebhooks();
    toast.success('Webhook registered');
  };

  const rotateSecret = async (webhookId: string) => {
    const result = await bankingService.rotateWebhookSecret(webhookId);
    toast.success(`Secret rotated (${result.newSecret.slice(-4)})`);
  };

  const testWebhook = async (webhookId: string) => {
    const result = await bankingService.testWebhookEndpoint(webhookId);
    toast.success(`Test status=${result.status} event=${result.eventType}`);
  };

  const loadUsage = async () => {
    setLoading(true);
    try {
      const result = await bankingService.getLicenseUsageMetrics();
      setUsage(result);
    } catch (error) {
      toast.error(getBankingErrorMessage(error, 'Failed to load SLA metrics'));
    } finally {
      setLoading(false);
    }
  };

  const changePlan = async (targetPlan: 'starter' | 'growth' | 'enterprise') => {
    try {
      await bankingService.changeLicensePlan(targetPlan);
      toast.success(`Plan change request submitted: ${targetPlan}`);
      await loadUsage();
    } catch (error) {
      toast.error(getBankingErrorMessage(error, 'Plan change endpoint is not available yet.'));
    }
  };

  return (
    <ApiErrorBoundary>
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-verza-primary to-verza-secondary bg-clip-text text-transparent">Operations Hub</h1>
        <p className="text-muted-foreground mt-1">Enterprise onboarding, risk, governance, webhook, and SLA tooling.</p>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="bulk">Bulk KYC</TabsTrigger>
          <TabsTrigger value="risk">Risk Sandbox</TabsTrigger>
          <TabsTrigger value="audit">Audit Explorer</TabsTrigger>
          <TabsTrigger value="webhooks">Webhook Manager</TabsTrigger>
          <TabsTrigger value="sla">Usage & SLA</TabsTrigger>
        </TabsList>
        <TabsContent value="bulk">
          <TabHelpCard title="Bulk KYC" description="Upload and validate onboarding files before importing records." />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileSpreadsheet className="h-5 w-5" />Bulk-Customer KYC Upload Wizard</CardTitle>
              <CardDescription>Upload CSV or Excel, validate rows, and download detailed error reports.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Input type="file" accept=".csv,.xlsx,.xls" onChange={handleCsvUpload} />
                <p className="text-sm text-muted-foreground mt-2">{csvName || 'No file selected'}</p>
              </div>
              <div className="text-sm text-muted-foreground">Parsed rows: {csvRows.length}</div>
              <Progress value={bulkProgress} />
              <div className="flex gap-2">
                <Button onClick={validateBulk} disabled={loading}><Upload className="mr-2 h-4 w-4" />Validate</Button>
                <Button onClick={importBulk} variant="outline" disabled={loading || csvRows.length === 0}><ShieldCheck className="mr-2 h-4 w-4" />Import</Button>
                <Button onClick={() => triggerFileDownload('bulk-errors.csv', toCsvErrorReport(bulkIssues), 'text/csv')} variant="secondary" disabled={bulkIssues.length === 0}><Download className="mr-2 h-4 w-4" />Error Report</Button>
              </div>
              {!!bulkIssues.length && (
                <div className="space-y-2">
                  {bulkIssues.slice(0, 6).map((issue, index) => (
                    <div className="text-sm border rounded-md p-2 flex justify-between" key={`${issue.row}-${issue.field}-${index}`}>
                      <span>Row {issue.row} · {issue.field}: {issue.message}</span>
                      <span className={issue.severity === 'error' ? 'text-red-500' : 'text-yellow-500'}>{issue.severity}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="risk">
          <TabHelpCard title="Risk Sandbox" description="Test and tune risk weights with instant what-if scoring simulations." />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><SlidersHorizontal className="h-5 w-5" />Risk-Scoring Sandbox</CardTitle>
              <CardDescription>Tune rule weights and run instant what-if simulations with exportable reports.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Customer Type</Label><Select value={riskInput.customerType} onValueChange={(value: 'retail' | 'business') => setRiskInput({ ...riskInput, customerType: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="retail">Retail</SelectItem><SelectItem value="business">Business</SelectItem></SelectContent></Select></div>
                <div className="space-y-2"><Label>Country</Label><Input value={riskInput.country} onChange={(event) => setRiskInput({ ...riskInput, country: event.target.value.toUpperCase() })} /></div>
                <div className="space-y-2"><Label>Transaction Amount</Label><Input type="number" value={riskInput.transactionAmount} onChange={(event) => setRiskInput({ ...riskInput, transactionAmount: Number(event.target.value || 0) })} /></div>
                <div className="space-y-2"><Label>Sanctions Hits</Label><Input type="number" value={riskInput.sanctionsHits} onChange={(event) => setRiskInput({ ...riskInput, sanctionsHits: Number(event.target.value || 0) })} /></div>
                <div className="space-y-2"><Label>Prior Alerts</Label><Input type="number" value={riskInput.priorAlerts} onChange={(event) => setRiskInput({ ...riskInput, priorAlerts: Number(event.target.value || 0) })} /></div>
              </div>
              {Object.entries(riskWeights).map(([key, value]) => (
                <div className="space-y-1" key={key}>
                  <Label>{key} weight: {value}</Label>
                  <Input type="range" min={0} max={60} value={value} onChange={(event) => setRiskWeights({ ...riskWeights, [key]: Number(event.target.value) })} />
                </div>
              ))}
              <div className="flex gap-2">
                <Button onClick={runRiskSimulation} disabled={loading}><BarChart3 className="mr-2 h-4 w-4" />Run Simulation</Button>
                <Button onClick={exportRiskPdf} variant="outline" disabled={!riskResult}><Download className="mr-2 h-4 w-4" />Export PDF</Button>
              </div>
              {riskResult && <div className="rounded-lg border p-4"><div className="text-2xl font-semibold">Score {riskResult.score}</div><div className="text-sm text-muted-foreground">Level: {riskResult.riskLevel} · {riskResult.recommendation}</div></div>}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="audit">
          <TabHelpCard title="Audit Explorer" description="Search audit events by date/entity and export signed evidence logs." />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Clock3 className="h-5 w-5" />Audit-Trail Explorer</CardTitle>
              <CardDescription>Filter by date, entity, and event type, then export signed logs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>From</Label><Input type="date" value={auditFilters.from} onChange={(event) => setAuditFilters({ ...auditFilters, from: event.target.value })} /></div>
                <div className="space-y-2"><Label>To</Label><Input type="date" value={auditFilters.to} onChange={(event) => setAuditFilters({ ...auditFilters, to: event.target.value })} /></div>
                <div className="space-y-2"><Label>Entity</Label><Input value={auditFilters.entity} onChange={(event) => setAuditFilters({ ...auditFilters, entity: event.target.value })} /></div>
                <div className="space-y-2"><Label>Event Type</Label><Input value={auditFilters.eventType} onChange={(event) => setAuditFilters({ ...auditFilters, eventType: event.target.value })} /></div>
              </div>
              <div className="flex gap-2">
                <Button onClick={searchAuditLogs} disabled={loading}>Search</Button>
                <Button onClick={exportSignedLogs} variant="outline" disabled={auditLogs.length === 0}><Download className="mr-2 h-4 w-4" />Export Signed</Button>
              </div>
              <div className="space-y-2 max-h-72 overflow-auto">
                {auditLogs.map((log) => (
                  <div className="border rounded-md p-2 text-sm" key={log.id}>
                    <div className="font-medium">{log.action}</div>
                    <div className="text-muted-foreground">{log.timestamp} · {log.actorId} · {log.status}</div>
                  </div>
                ))}
                {!auditLogs.length && <div className="text-sm text-muted-foreground">No logs loaded</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="webhooks">
          <TabHelpCard title="Webhook Manager" description="Register endpoints, run delivery tests, rotate secrets, and monitor retries." />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Webhook className="h-5 w-5" />Webhook Endpoint Manager</CardTitle>
              <CardDescription>Register endpoints, test delivery, rotate secrets, and inspect retries.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Endpoint URL</Label><Input value={webhookForm.url} onChange={(event) => setWebhookForm({ ...webhookForm, url: event.target.value })} placeholder="https://acme-bank.com/webhooks/kyc" /></div>
                <div className="space-y-2"><Label>Events (comma-separated)</Label><Input value={webhookForm.events} onChange={(event) => setWebhookForm({ ...webhookForm, events: event.target.value })} /></div>
              </div>
              <div className="flex gap-2">
                <Button onClick={registerWebhook}>Register</Button>
                <Button onClick={loadWebhooks} variant="outline">Refresh Queue</Button>
              </div>
              <div className="space-y-2">
                {webhooks.map((webhook) => (
                  <div className="border rounded-md p-3 flex justify-between items-center" key={webhook.id}>
                    <div><div className="font-medium">{webhook.url}</div><div className="text-xs text-muted-foreground">{webhook.events.join(', ')}</div></div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => testWebhook(webhook.id)}>Test</Button>
                      <Button size="sm" variant="outline" onClick={() => rotateSecret(webhook.id)}>Rotate Secret</Button>
                    </div>
                  </div>
                ))}
                {!webhooks.length && <div className="text-sm text-muted-foreground">No endpoints registered</div>}
              </div>
              <div className="rounded-md border p-3">
                <div className="font-medium mb-2">Retry Queue</div>
                {retryQueue.map((item) => <div className="text-sm text-muted-foreground" key={item.id}>{item.eventType} · webhook {item.webhookId} · attempt {item.attempt}</div>)}
                {!retryQueue.length && <div className="text-sm text-muted-foreground">No retries pending</div>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sla">
          <TabHelpCard title="Usage & SLA" description="Review quota consumption and request plan changes from one place." />
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" />License-Usage & SLA Dashboard</CardTitle>
              <CardDescription>Live quota consumption, anomaly alerts, and plan controls.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button onClick={loadUsage}>Load Usage</Button>
                <Button onClick={() => changePlan('starter')} variant="outline">Downgrade</Button>
                <Button onClick={() => changePlan('growth')} variant="outline">Upgrade</Button>
              </div>
              {usage ? (
                <div className="space-y-3">
                  <div className="rounded-md border p-3">
                    <div className="font-medium">{usage.planName}</div>
                    <div className="text-sm text-muted-foreground">Period {usage.currentPeriodStart.slice(0, 10)} to {usage.currentPeriodEnd.slice(0, 10)}</div>
                    <div className="mt-2 text-sm">Quota: {usage.usedQuota}/{usage.monthlyQuota}</div>
                    <Progress value={quotaPercent} />
                    <div className="text-sm mt-2">SLA Uptime: {usage.slaUptime}%</div>
                  </div>
                  <div className="space-y-2">
                    {usage.anomalyAlerts.map((alert) => (
                      <div className="rounded-md border p-2 text-sm flex items-center gap-2" key={alert.id}>
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span>{alert.message}</span>
                        <span className="ml-auto text-xs uppercase">{alert.severity}</span>
                      </div>
                    ))}
                    {!usage.anomalyAlerts.length && <div className="text-sm text-muted-foreground">No anomaly alerts detected</div>}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">Load usage metrics to view live SLA data.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      {loading && <div className="fixed bottom-6 right-6 bg-card border rounded-lg p-3 flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /><span className="text-sm">Processing...</span></div>}
    </div>
    </ApiErrorBoundary>
  );
}
