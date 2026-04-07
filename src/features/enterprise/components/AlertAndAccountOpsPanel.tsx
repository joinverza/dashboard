import { useState } from 'react';
import { Activity, BellRing, CheckCircle2, Loader2, MapPinned, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { bankingService, getBankingErrorMessage } from '@/services/bankingService';
import type { AccountVerificationResponse, DashboardNotification, GeoDistributionItem } from '@/types/banking';

export default function AlertAndAccountOpsPanel() {
  const [loading, setLoading] = useState(false);
  const [alertId, setAlertId] = useState('');
  const [alertAnalyst, setAlertAnalyst] = useState('');
  const [alertNotes, setAlertNotes] = useState('');
  const [alertResolution, setAlertResolution] = useState('false_positive');
  const [alertDetails, setAlertDetails] = useState<DashboardNotification | null>(null);
  const [geoData, setGeoData] = useState<GeoDistributionItem[]>([]);
  const [accountInput, setAccountInput] = useState({
    customerId: '',
    accountNumber: '',
    routingNumber: '',
    accountHolderName: '',
    verificationMethod: 'micro_deposits',
    publicToken: '',
  });
  const [accountResult, setAccountResult] = useState<AccountVerificationResponse | null>(null);

  const loadAlertDetails = async () => {
    if (!alertId.trim()) {
      toast.error('Alert ID is required');
      return;
    }
    setLoading(true);
    try {
      const details = await bankingService.getAlertDetails(alertId.trim());
      setAlertDetails(details);
      toast.success('Alert details loaded');
    } catch (error) {
      toast.error(getBankingErrorMessage(error, 'Unable to load alert details.'));
    } finally {
      setLoading(false);
    }
  };

  const investigateAlert = async () => {
    if (!alertId.trim()) {
      toast.error('Alert ID is required');
      return;
    }
    setLoading(true);
    try {
      const result = await bankingService.investigateAlert(alertId.trim(), {
        analyst: alertAnalyst.trim() || undefined,
        notes: alertNotes.trim() || undefined,
      });
      toast.success(`Alert status: ${result.status}`);
    } catch (error) {
      toast.error(getBankingErrorMessage(error, 'Unable to investigate alert.'));
    } finally {
      setLoading(false);
    }
  };

  const resolveAlert = async () => {
    if (!alertId.trim()) {
      toast.error('Alert ID is required');
      return;
    }
    setLoading(true);
    try {
      const result = await bankingService.resolveAlert(alertId.trim(), {
        resolution: alertResolution.trim(),
        notes: alertNotes.trim() || undefined,
      });
      toast.success(`Alert resolved: ${result.status}`);
    } catch (error) {
      toast.error(getBankingErrorMessage(error, 'Unable to resolve alert.'));
    } finally {
      setLoading(false);
    }
  };

  const verifyAccount = async () => {
    setLoading(true);
    try {
      const result = await bankingService.verifyBankAccount({
        customerId: accountInput.customerId.trim(),
        accountNumber: accountInput.accountNumber.trim(),
        routingNumber: accountInput.routingNumber.trim(),
        accountHolderName: accountInput.accountHolderName.trim(),
        verificationMethod: accountInput.verificationMethod.trim(),
      });
      setAccountResult(result);
      toast.success(`Account verification status: ${result.status}`);
    } catch (error) {
      toast.error(getBankingErrorMessage(error, 'Unable to verify account.'));
    } finally {
      setLoading(false);
    }
  };

  const instantVerifyAccount = async () => {
    setLoading(true);
    try {
      const result = await bankingService.instantVerifyBankAccount({
        customerId: accountInput.customerId.trim(),
        publicToken: accountInput.publicToken.trim(),
        accountHolderName: accountInput.accountHolderName.trim() || undefined,
      });
      setAccountResult(result);
      toast.success(`Instant verification status: ${result.status}`);
    } catch (error) {
      toast.error(getBankingErrorMessage(error, 'Unable to perform instant verification.'));
    } finally {
      setLoading(false);
    }
  };

  const verifyMicroDeposits = async () => {
    setLoading(true);
    try {
      const result = await bankingService.verifyMicroDeposits({
        customerId: accountInput.customerId.trim(),
        accountNumber: accountInput.accountNumber.trim(),
        routingNumber: accountInput.routingNumber.trim(),
        accountHolderName: accountInput.accountHolderName.trim(),
      });
      setAccountResult(result);
      toast.success(`Micro-deposit verification status: ${result.status}`);
    } catch (error) {
      toast.error(getBankingErrorMessage(error, 'Unable to verify micro-deposits.'));
    } finally {
      setLoading(false);
    }
  };

  const loadGeographicalAnalytics = async () => {
    setLoading(true);
    try {
      const result = await bankingService.getGeographicalAnalytics();
      setGeoData(result);
      toast.success('Geographical analytics loaded');
    } catch (error) {
      toast.error(getBankingErrorMessage(error, 'Unable to load geographical analytics.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" />
            Alert Investigation And Resolution
          </CardTitle>
          <CardDescription>Execute investigate/resolve workflows on `alerts/{'{alertId}'}` endpoints.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="ops-alert-id">Alert ID</Label>
            <Input id="ops-alert-id" value={alertId} onChange={(event) => setAlertId(event.target.value)} placeholder="alert_123" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ops-alert-analyst">Analyst</Label>
            <Input id="ops-alert-analyst" value={alertAnalyst} onChange={(event) => setAlertAnalyst(event.target.value)} placeholder="analyst@bank.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ops-alert-resolution">Resolution</Label>
            <Input id="ops-alert-resolution" value={alertResolution} onChange={(event) => setAlertResolution(event.target.value)} placeholder="false_positive" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ops-alert-notes">Notes</Label>
            <Input id="ops-alert-notes" value={alertNotes} onChange={(event) => setAlertNotes(event.target.value)} placeholder="Investigation notes..." />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => void loadAlertDetails()} disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BellRing className="mr-2 h-4 w-4" />}
              Load Alert
            </Button>
            <Button variant="outline" onClick={() => void investigateAlert()} disabled={loading}>
              Investigate
            </Button>
            <Button variant="secondary" onClick={() => void resolveAlert()} disabled={loading}>
              Resolve
            </Button>
          </div>
          <div className="rounded-md border p-3 text-sm">
            <div className="font-medium mb-1">Alert Snapshot</div>
            <div>ID: {alertDetails?.id ?? 'n/a'}</div>
            <div>Title: {alertDetails?.title ?? 'n/a'}</div>
            <div>Status: {alertDetails?.read ? 'read' : 'unread'}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Account Verification Operations
          </CardTitle>
          <CardDescription>Run `account/verify`, `account/instant-verify`, and `account/micro-deposits` flows.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ops-customer-id">Customer ID</Label>
              <Input id="ops-customer-id" value={accountInput.customerId} onChange={(event) => setAccountInput({ ...accountInput, customerId: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ops-holder-name">Account Holder</Label>
              <Input id="ops-holder-name" value={accountInput.accountHolderName} onChange={(event) => setAccountInput({ ...accountInput, accountHolderName: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ops-account-number">Account Number</Label>
              <Input id="ops-account-number" value={accountInput.accountNumber} onChange={(event) => setAccountInput({ ...accountInput, accountNumber: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ops-routing-number">Routing Number</Label>
              <Input id="ops-routing-number" value={accountInput.routingNumber} onChange={(event) => setAccountInput({ ...accountInput, routingNumber: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ops-method">Verification Method</Label>
              <Input id="ops-method" value={accountInput.verificationMethod} onChange={(event) => setAccountInput({ ...accountInput, verificationMethod: event.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ops-public-token">Public Token (instant verify)</Label>
              <Input id="ops-public-token" value={accountInput.publicToken} onChange={(event) => setAccountInput({ ...accountInput, publicToken: event.target.value })} />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => void verifyAccount()} disabled={loading}>Verify Account</Button>
            <Button variant="outline" onClick={() => void instantVerifyAccount()} disabled={loading}>Instant Verify</Button>
            <Button variant="secondary" onClick={() => void verifyMicroDeposits()} disabled={loading}>Micro Deposits</Button>
          </div>
          <div className="rounded-md border p-3 text-sm">
            <div className="font-medium mb-1">Verification Result</div>
            <div>ID: {accountResult?.verificationId ?? 'n/a'}</div>
            <div>Status: {accountResult?.status ?? 'n/a'}</div>
            <div>Confidence: {typeof accountResult?.confidence === 'number' ? accountResult.confidence : 'n/a'}</div>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPinned className="h-5 w-5" />
            Geographical Analytics
          </CardTitle>
          <CardDescription>Load geographical distribution metrics from `GET /api/v1/banking/analytics/geographical`.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={() => void loadGeographicalAnalytics()} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
            Load Geographical Analytics
          </Button>
          <div className="grid gap-2 md:grid-cols-3">
            {geoData.map((item) => (
              <div className="rounded-md border p-3 text-sm" key={`${item.region}-${item.percentage}`}>
                <div className="font-medium">{item.region}</div>
                <div className="text-muted-foreground">{item.percentage}%</div>
              </div>
            ))}
            {geoData.length === 0 ? <div className="text-sm text-muted-foreground">No geographical data loaded.</div> : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
