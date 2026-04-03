import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabHelpCard } from '@/components/shared/TabHelpCard';
import { bankingService, getBankingErrorMessage } from '@/services/bankingService';

export default function MonoAccountViewer() {
  const [customerId, setCustomerId] = useState('');
  const [code, setCode] = useState('');
  const [monoAccountId, setMonoAccountId] = useState('');
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<Record<string, unknown>>({});
  const [identity, setIdentity] = useState<Record<string, unknown>>({});
  const [transactions, setTransactions] = useState<Record<string, unknown>>({});

  const exchangeCode = async () => {
    if (!customerId.trim() || !code.trim()) {
      toast.error('Customer ID and provider code are required.');
      return;
    }
    try {
      setLoading(true);
      const response = await bankingService.exchangeMonoCode({
        customerId: customerId.trim(),
        code: code.trim(),
        metadata: { source: 'dashboard' },
      });
      setMonoAccountId(response.monoAccountId);
      toast.success('Mono account linked successfully');
    } catch (error) {
      toast.error(getBankingErrorMessage(error, 'Failed to exchange Mono code.'));
    } finally {
      setLoading(false);
    }
  };

  const loadAll = async () => {
    if (!monoAccountId.trim()) {
      toast.error('Mono account ID is required.');
      return;
    }
    try {
      setLoading(true);
      const [detailsResult, identityResult, transactionsResult] = await Promise.all([
        bankingService.getMonoAccountDetails(monoAccountId.trim()),
        bankingService.getMonoAccountIdentity(monoAccountId.trim()),
        bankingService.getMonoAccountTransactions(monoAccountId.trim()),
      ]);
      setDetails(detailsResult);
      setIdentity(identityResult);
      setTransactions(transactionsResult);
      toast.success('Mono account data loaded');
    } catch (error) {
      toast.error(getBankingErrorMessage(error, 'Failed to load Mono account data.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mono Account Viewer</h1>
        <p className="text-muted-foreground">Link bank accounts via provider code and inspect details, identity, and transactions.</p>
      </div>
      <TabHelpCard
        title="Mono Flow"
        description="Use `exchange` after callback, then load details/identity/transactions with the returned `monoAccountId`."
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Link Account
          </CardTitle>
          <CardDescription>Exchange provider callback code for a `monoAccountId`.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Customer ID</Label>
            <Input value={customerId} onChange={(event) => setCustomerId(event.target.value)} placeholder="cust_001" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Provider Code</Label>
            <Input value={code} onChange={(event) => setCode(event.target.value)} placeholder="provider_callback_code" />
          </div>
          <Button onClick={exchangeCode} disabled={loading} className="md:col-span-3">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Exchange Code
          </Button>
          <div className="space-y-2 md:col-span-3">
            <Label>Mono Account ID</Label>
            <Input value={monoAccountId} onChange={(event) => setMonoAccountId(event.target.value)} placeholder="mono_acc_..." />
          </div>
          <Button variant="outline" onClick={loadAll} disabled={loading} className="md:col-span-3">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Load Details / Identity / Transactions
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Data</CardTitle>
          <CardDescription>Defensive JSON views for semi-structured provider payloads.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="details" className="space-y-3">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="identity">Identity</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <pre className="max-h-[320px] overflow-auto rounded-md border bg-muted/30 p-3 text-xs">{JSON.stringify(details, null, 2)}</pre>
            </TabsContent>
            <TabsContent value="identity">
              <pre className="max-h-[320px] overflow-auto rounded-md border bg-muted/30 p-3 text-xs">{JSON.stringify(identity, null, 2)}</pre>
            </TabsContent>
            <TabsContent value="transactions">
              <pre className="max-h-[320px] overflow-auto rounded-md border bg-muted/30 p-3 text-xs">{JSON.stringify(transactions, null, 2)}</pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
