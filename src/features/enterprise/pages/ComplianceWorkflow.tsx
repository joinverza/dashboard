import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileCheck2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { TabHelpCard } from '@/components/shared/TabHelpCard';
import { bankingService, getBankingErrorMessage } from '@/services/bankingService';

export default function ComplianceWorkflow() {
  const [sarDraft, setSarDraft] = useState({
    requestId: '',
    customerId: '',
    narrative: '',
    activity: '{"reason":"high risk transfer"}',
  });
  const [sarReportId, setSarReportId] = useState('');
  const [ctrDraft, setCtrDraft] = useState({
    requestId: '',
    customerId: '',
    transaction: '{"amount":15000,"currency":"USD"}',
  });
  const [loading, setLoading] = useState(false);

  const createSar = async () => {
    if (!sarDraft.requestId.trim() || !sarDraft.narrative.trim()) {
      toast.error('SAR request ID and narrative are required.');
      return;
    }
    try {
      setLoading(true);
      const activity = JSON.parse(sarDraft.activity) as Record<string, unknown>;
      const response = await bankingService.createSarDraft({
        requestId: sarDraft.requestId.trim(),
        customerId: sarDraft.customerId.trim() || undefined,
        narrative: sarDraft.narrative.trim(),
        activity,
      });
      setSarReportId(response.reportId);
      toast.success(`SAR draft created (${response.reportId})`);
    } catch (error) {
      toast.error(getBankingErrorMessage(error, 'Failed to create SAR draft.'));
    } finally {
      setLoading(false);
    }
  };

  const submitSar = async () => {
    if (!sarReportId.trim()) {
      toast.error('Report ID is required for SAR submit.');
      return;
    }
    try {
      setLoading(true);
      const response = await bankingService.submitSarReport({
        reportId: sarReportId.trim(),
        submissionChannel: 'electronic',
      });
      toast.success(`SAR submitted (${response.status})`);
    } catch (error) {
      toast.error(getBankingErrorMessage(error, 'Failed to submit SAR.'));
    } finally {
      setLoading(false);
    }
  };

  const createCtr = async () => {
    if (!ctrDraft.requestId.trim()) {
      toast.error('CTR request ID is required.');
      return;
    }
    try {
      setLoading(true);
      const transaction = JSON.parse(ctrDraft.transaction) as Record<string, unknown>;
      const response = await bankingService.createCtrDraft({
        requestId: ctrDraft.requestId.trim(),
        customerId: ctrDraft.customerId.trim() || undefined,
        transaction,
      });
      toast.success(`CTR draft created (${response.reportId})`);
    } catch (error) {
      toast.error(getBankingErrorMessage(error, 'Failed to create CTR draft.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Compliance Workflows</h1>
        <p className="text-muted-foreground">Create and submit SAR/CTR compliance reports with draft-and-submit flow.</p>
      </div>
      <TabHelpCard
        title="SAR/CTR Flow"
        description="Create draft report payloads, review IDs, then submit SAR electronically or manually."
      />

      <Tabs defaultValue="sar" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sar">SAR</TabsTrigger>
          <TabsTrigger value="ctr">CTR</TabsTrigger>
        </TabsList>

        <TabsContent value="sar">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck2 className="h-5 w-5" />
                Suspicious Activity Report
              </CardTitle>
              <CardDescription>Create draft first, then submit with report ID.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Request ID</Label>
                  <Input value={sarDraft.requestId} onChange={(event) => setSarDraft((prev) => ({ ...prev, requestId: event.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Customer ID (optional)</Label>
                  <Input value={sarDraft.customerId} onChange={(event) => setSarDraft((prev) => ({ ...prev, customerId: event.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Narrative</Label>
                <Textarea value={sarDraft.narrative} onChange={(event) => setSarDraft((prev) => ({ ...prev, narrative: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Activity JSON</Label>
                <Textarea className="font-mono min-h-[100px]" value={sarDraft.activity} onChange={(event) => setSarDraft((prev) => ({ ...prev, activity: event.target.value }))} />
              </div>
              <div className="flex gap-2">
                <Button onClick={createSar} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Create SAR Draft
                </Button>
                <Input value={sarReportId} onChange={(event) => setSarReportId(event.target.value)} placeholder="reportId for submit" />
                <Button variant="outline" onClick={submitSar} disabled={loading}>
                  Submit SAR
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ctr">
          <Card>
            <CardHeader>
              <CardTitle>Currency Transaction Report</CardTitle>
              <CardDescription>Create CTR drafts for reportable transactions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Request ID</Label>
                  <Input value={ctrDraft.requestId} onChange={(event) => setCtrDraft((prev) => ({ ...prev, requestId: event.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Customer ID (optional)</Label>
                  <Input value={ctrDraft.customerId} onChange={(event) => setCtrDraft((prev) => ({ ...prev, customerId: event.target.value }))} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Transaction JSON</Label>
                <Textarea className="font-mono min-h-[120px]" value={ctrDraft.transaction} onChange={(event) => setCtrDraft((prev) => ({ ...prev, transaction: event.target.value }))} />
              </div>
              <Button onClick={createCtr} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Create CTR Draft
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
