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
      await runStep(step);
    }
  };

  const isDone = (step: StepId): boolean => Boolean(results[step]);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-ent-text">KYB Wizard</h1>
        <p className="text-verza-gray">Run business verification, registry, ownership, directors, and financial health in sequence.</p>
      </div>
      <TabHelpCard
        title="KYB Flow"
        description="Use one business reference across all steps. Each step maps to backend `/kyb/business/*` endpoints."
      />

      <div className="enterprise-card rounded-2xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-ent-text flex items-center gap-2">
              <Building2 className="h-5 w-5 text-verza-emerald" />
              Business Setup
            </h3>
            <p className="text-sm text-verza-gray mt-1">Enter shared fields used by the full KYB sequence.</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-verza-gray">Business Ref</Label>
            <Input 
              value={businessRef} 
              onChange={(event) => setBusinessRef(event.target.value)} 
              placeholder="biz_12345" 
              className="bg-ent-muted border-ent-border text-ent-text focus:border-verza-emerald/30 focus:bg-white/[0.04]"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-verza-gray">Business Name</Label>
            <Input 
              value={name} 
              onChange={(event) => setName(event.target.value)} 
              placeholder="Acme Payments Ltd" 
              className="bg-ent-muted border-ent-border text-ent-text focus:border-verza-emerald/30 focus:bg-white/[0.04]"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-verza-gray">Country</Label>
            <Input 
              value={country} 
              onChange={(event) => setCountry(event.target.value)} 
              placeholder="US" 
              className="bg-ent-muted border-ent-border text-ent-text focus:border-verza-emerald/30 focus:bg-white/[0.04]"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-verza-gray">Registration Number (optional)</Label>
            <Input 
              value={registrationNumber} 
              onChange={(event) => setRegistrationNumber(event.target.value)} 
              placeholder="RC-123456" 
              className="bg-ent-muted border-ent-border text-ent-text focus:border-verza-emerald/30 focus:bg-white/[0.04]"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className="text-verza-gray">Directors JSON</Label>
            <Textarea 
              value={directorsJson} 
              onChange={(event) => setDirectorsJson(event.target.value)} 
              className="font-mono min-h-[88px] bg-ent-muted border-ent-border text-ent-text focus:border-verza-emerald/30 focus:bg-white/[0.04]" 
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className="text-verza-gray">Financial Health Payload JSON</Label>
            <Textarea 
              value={financialJson} 
              onChange={(event) => setFinancialJson(event.target.value)} 
              className="font-mono min-h-[88px] bg-ent-muted border-ent-border text-ent-text focus:border-verza-emerald/30 focus:bg-white/[0.04]" 
            />
          </div>
        </div>
      </div>

      <div className="enterprise-card rounded-2xl p-6">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-ent-text">Workflow Steps</h3>
          <p className="text-sm text-verza-gray mt-1">Run steps individually or execute the full workflow.</p>
        </div>
        <div className="space-y-3">
          {STEP_ORDER.map((step) => (
            <div key={step} className="flex items-center justify-between rounded-xl border border-ent-border bg-ent-muted p-4 hover:bg-ent-card transition-colors">
              <div className="flex items-center gap-3">
                {isDone(step) ? <CheckCircle2 className="h-5 w-5 text-verza-emerald" /> : <ArrowRight className="h-5 w-5 text-verza-gray/40" />}
                <div>
                  <p className="font-medium capitalize text-ent-text">{step}</p>
                  {results[step] && <p className="text-[10px] uppercase tracking-wider text-verza-emerald/70 font-semibold mt-0.5">Status: {results[step]}</p>}
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                disabled={runningStep !== null} 
                onClick={() => runStep(step)}
                className="border-ent-border text-verza-gray hover:text-ent-text"
              >
                {runningStep === step ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Run Step
              </Button>
            </div>
          ))}
          <div className="pt-4">
            <Button 
              className="w-full bg-verza-emerald text-[#06140F] hover:bg-verza-emerald/90 rounded-full h-12 text-sm font-bold shadow-[0_4px_14px_rgba(30,215,96,0.25)]" 
              disabled={runningStep !== null || !canStart} 
              onClick={runFullWorkflow}
            >
              {runningStep ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Execute Full KYB Workflow
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
