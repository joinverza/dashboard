import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TabHelpCard } from '@/components/shared/TabHelpCard';
import { bankingService, getBankingErrorMessage } from '@/services/bankingService';

type StepId = 'verify' | 'registry' | 'ownership' | 'directors' | 'financial';

const STEP_ORDER: StepId[] = ['verify', 'registry', 'ownership', 'directors', 'financial'];

export default function KybWizard() {
  const [businessRef, setBusinessRef] = useState('');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('US');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [directorsJson, setDirectorsJson] = useState('[{"firstName":"Jane","lastName":"Doe"}]');
  const [financialJson, setFinancialJson] = useState('{"period":"2025","revenue":1000000}');
  const [runningStep, setRunningStep] = useState<StepId | null>(null);
  const [results, setResults] = useState<Partial<Record<StepId, string>>>({});

  const canStart = useMemo(
    () => businessRef.trim().length > 0 && name.trim().length > 0 && country.trim().length > 0,
    [businessRef, name, country]
  );

  const runStep = async (step: StepId) => {
    if (!canStart) {
      toast.error('Business ref, name, and country are required.');
      return;
    }
    try {
      setRunningStep(step);
      if (step === 'verify') {
        const response = await bankingService.verifyBusinessKyb({
          businessRef: businessRef.trim(),
          name: name.trim(),
          country: country.trim().toUpperCase(),
          registrationNumber: registrationNumber.trim() || undefined,
        });
        setResults((prev) => ({ ...prev, verify: response.status }));
      }
      if (step === 'registry') {
        const response = await bankingService.runKybRegistryCheck({ businessRef: businessRef.trim() });
        setResults((prev) => ({ ...prev, registry: response.status }));
      }
      if (step === 'ownership') {
        const response = await bankingService.runKybOwnershipCheck({ businessRef: businessRef.trim() });
        setResults((prev) => ({ ...prev, ownership: response.status }));
      }
      if (step === 'directors') {
        const directors = JSON.parse(directorsJson) as Array<Record<string, unknown>>;
        const response = await bankingService.runKybDirectorsCheck({
          businessRef: businessRef.trim(),
          directors,
          matchThreshold: 85,
          fuzzyMatching: true,
        });
        setResults((prev) => ({ ...prev, directors: response.status }));
      }
      if (step === 'financial') {
        const payload = JSON.parse(financialJson) as Record<string, unknown>;
        const response = await bankingService.runKybFinancialHealth({
          businessRef: businessRef.trim(),
          ...payload,
        });
        setResults((prev) => ({ ...prev, financial: response.status }));
      }
      toast.success(`Step "${step}" completed`);
    } catch (error) {
      toast.error(getBankingErrorMessage(error, `Failed at step "${step}"`));
    } finally {
      setRunningStep(null);
    }
  };

  const runFullWorkflow = async () => {
    for (const step of STEP_ORDER) {
      // eslint-disable-next-line no-await-in-loop
      await runStep(step);
    }
  };

  const isDone = (step: StepId): boolean => Boolean(results[step]);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">KYB Wizard</h1>
        <p className="text-muted-foreground">Run business verification, registry, ownership, directors, and financial health in sequence.</p>
      </div>
      <TabHelpCard
        title="KYB Flow"
        description="Use one business reference across all steps. Each step maps to backend `/kyb/business/*` endpoints."
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Business Setup
          </CardTitle>
          <CardDescription>Enter shared fields used by the full KYB sequence.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Business Ref</Label>
            <Input value={businessRef} onChange={(event) => setBusinessRef(event.target.value)} placeholder="biz_12345" />
          </div>
          <div className="space-y-2">
            <Label>Business Name</Label>
            <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Acme Payments Ltd" />
          </div>
          <div className="space-y-2">
            <Label>Country</Label>
            <Input value={country} onChange={(event) => setCountry(event.target.value)} placeholder="US" />
          </div>
          <div className="space-y-2">
            <Label>Registration Number (optional)</Label>
            <Input value={registrationNumber} onChange={(event) => setRegistrationNumber(event.target.value)} placeholder="RC-123456" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Directors JSON</Label>
            <Textarea value={directorsJson} onChange={(event) => setDirectorsJson(event.target.value)} className="font-mono min-h-[88px]" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Financial Health Payload JSON</Label>
            <Textarea value={financialJson} onChange={(event) => setFinancialJson(event.target.value)} className="font-mono min-h-[88px]" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workflow Steps</CardTitle>
          <CardDescription>Run steps individually or execute the full workflow.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {STEP_ORDER.map((step) => (
            <div key={step} className="flex items-center justify-between rounded-md border p-3">
              <div className="flex items-center gap-2">
                {isDone(step) ? <CheckCircle2 className="h-4 w-4 text-verza-emerald" /> : <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                <span className="font-medium capitalize">{step}</span>
                {results[step] ? <span className="text-xs text-muted-foreground">status: {results[step]}</span> : null}
              </div>
              <Button size="sm" variant="outline" disabled={runningStep !== null} onClick={() => runStep(step)}>
                {runningStep === step ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Run
              </Button>
            </div>
          ))}
          <Button className="w-full" disabled={runningStep !== null || !canStart} onClick={runFullWorkflow}>
            {runningStep ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Run Full KYB Workflow
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
