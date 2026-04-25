import { motion } from 'framer-motion';
import { 
  CreditCard, Check, Download, AlertTriangle, 
  Plus, Trash2, Shield, Calendar 
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link, useLocation } from 'wouter';
import { toast } from 'sonner';
import { TabHelpCard } from '@/components/shared/TabHelpCard';
import BackButton from '@/components/shared/BackButton';

// Mock data
const BILLING_HISTORY = [
  { id: 'INV-2023-001', date: 'Oct 01, 2023', amount: '$2,450.00', status: 'Paid', pdf: '#' },
  { id: 'INV-2023-002', date: 'Sep 01, 2023', amount: '$2,450.00', status: 'Paid', pdf: '#' },
  { id: 'INV-2023-003', date: 'Aug 01, 2023', amount: '$2,450.00', status: 'Paid', pdf: '#' },
];

const PAYMENT_METHODS = [
  { id: 1, type: 'Visa', last4: '4242', expiry: '12/24', isDefault: true },
  { id: 2, type: 'Mastercard', last4: '8888', expiry: '06/25', isDefault: false },
];

const PLAN_PRICE_MAP = {
  starter: { monthly: 499, yearly: 399 },
  business: { monthly: 2450, yearly: 1960 },
  enterprise: { monthly: null, yearly: null },
} as const;

export default function EnterpriseBilling() {
  const [, setLocation] = useLocation();
  const [paymentMethods, setPaymentMethods] = useState(PAYMENT_METHODS);
  const [billingHistory] = useState(BILLING_HISTORY);
  const [currentPlan] = useState<'starter' | 'business' | 'enterprise'>('business');
  const [interval] = useState<'monthly' | 'yearly'>('monthly');
  const [pendingPlan, setPendingPlan] = useState<{ plan: 'starter' | 'business' | 'enterprise'; interval: 'monthly' | 'yearly' } | null>(() => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    const planParam = params.get('plan');
    const intervalParam = params.get('interval');
    if (planParam === 'starter' || planParam === 'business' || planParam === 'enterprise') {
      const selectedInterval = intervalParam === 'yearly' ? 'yearly' : 'monthly';
      return { plan: planParam, interval: selectedInterval };
    }
    return null;
  });

  const displayPrice = useMemo(() => {
    const price = PLAN_PRICE_MAP[currentPlan][interval];
    return price === null ? 'Custom' : `$${price.toLocaleString()}`;
  }, [currentPlan, interval]);

  const promoteDefaultMethod = (id: number) => {
    setPaymentMethods((current) =>
      current.map((item) => ({ ...item, isDefault: item.id === id })),
    );
  };

  const removeMethod = (id: number) => {
    setPaymentMethods((current) => {
      const filtered = current.filter((item) => item.id !== id);
      if (filtered.length > 0 && !filtered.some((item) => item.isDefault)) {
        filtered[0] = { ...filtered[0], isDefault: true };
      }
      return filtered;
    });
  };

  const addPaymentMethod = () => {
    const last = paymentMethods.length + 1;
    setPaymentMethods((current) => [
      ...current,
      { id: Date.now(), type: 'Visa', last4: `${(1000 + last).toString().slice(-4)}`, expiry: '10/28', isDefault: current.length === 0 },
    ]);
    toast.success('Payment method added');
  };

  const continueToCheckout = () => {
    if (!pendingPlan) return;
    setLocation(`/enterprise/billing/checkout?plan=${pendingPlan.plan}&interval=${pendingPlan.interval}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}

  const displayPrice = useMemo(() => {
    const price = PLAN_PRICE_MAP[currentPlan][interval];
    return price === null ? 'Custom' : `$${price.toLocaleString()}`;
  }, [currentPlan, interval]);

  const promoteDefaultMethod = (id: number) => {
    setPaymentMethods((current) =>
      current.map((item) => ({ ...item, isDefault: item.id === id })),
    );
  };

  const removeMethod = (id: number) => {
    setPaymentMethods((current) => {
      const filtered = current.filter((item) => item.id !== id);
      if (filtered.length > 0 && !filtered.some((item) => item.isDefault)) {
        filtered[0] = { ...filtered[0], isDefault: true };
      }
      return filtered;
    });
  };

  const addPaymentMethod = () => {
    const last = paymentMethods.length + 1;
    setPaymentMethods((current) => [
      ...current,
      { id: Date.now(), type: 'Visa', last4: `${(1000 + last).toString().slice(-4)}`, expiry: '10/28', isDefault: current.length === 0 },
    ]);
    toast.success('Payment method added');
  };

  const continueToCheckout = () => {
    if (!pendingPlan) return;
    setLocation(`/enterprise/billing/checkout?plan=${pendingPlan.plan}&interval=${pendingPlan.interval}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <BackButton to="/enterprise/platform" label="Back to Platform" />
      <TabHelpCard
        title="Billing & Plans"
        description="Manage payment methods, invoices, and complete plan changes after successful payment."
      />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ent-text">Billing & Plans</h1>
          <p className="text-verza-gray">Manage your subscription, payment methods, and invoices.</p>
        </div>
        <Button asChild className="bg-verza-emerald text-[#06140F] hover:bg-verza-emerald/90 rounded-full px-6">
           <Link href="/enterprise/pricing">Upgrade Plan</Link>
        </Button>
      </div>

      {pendingPlan && (
        <div className="border border-verza-emerald/20 bg-verza-emerald/5 rounded-2xl p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-ent-text">Pending Plan Change</h3>
            <p className="text-sm text-verza-gray mt-1">
              {pendingPlan.plan.toUpperCase()} on {pendingPlan.interval} billing is ready. Upgrade applies after payment succeeds.
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={continueToCheckout} className="bg-verza-emerald text-[#06140F] hover:bg-verza-emerald/90">
              Continue To Secure Checkout
            </Button>
            <Button variant="outline" onClick={() => setPendingPlan(null)} className="border-ent-border text-verza-gray hover:text-ent-text">Cancel</Button>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Plan Card */}
        <div className="enterprise-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-ent-text">Current Plan</h3>
              <p className="text-sm text-verza-gray mt-1">
                You are currently on the <span className="font-semibold text-ent-text capitalize">{currentPlan} Plan</span>.
              </p>
            </div>
            <Badge className="bg-verza-emerald/10 text-verza-emerald border-verza-emerald/20">Active</Badge>
          </div>
          <div className="space-y-6">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-ent-text">{displayPrice}</span>
              <span className="text-verza-gray">/{interval}</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-verza-gray">Included Verifications</span>
                <span className="font-medium text-ent-text">5,000 / month</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-verza-gray">
                <Check className="h-4 w-4 text-verza-emerald" /> API Access
              </div>
              <div className="flex items-center gap-2 text-sm text-verza-gray">
                <Check className="h-4 w-4 text-verza-emerald" /> 5 Team Members
              </div>
              <div className="flex items-center gap-2 text-sm text-verza-gray">
                <Check className="h-4 w-4 text-verza-emerald" /> Standard Support
              </div>
            </div>
 
            <div className="flex items-center gap-2 p-3 bg-ent-muted border border-ent-border rounded-xl text-sm text-verza-gray">
              <Calendar className="h-4 w-4 text-verza-gray/60" />
              <span>Next billing date: <span className="font-medium text-ent-text">Nov 01, 2023</span></span>
            </div>
          </div>
          <div className="mt-8">
            <Button variant="outline" className="w-full border-ent-border text-ent-text hover:bg-ent-text/10" asChild>
                <Link href="/enterprise/pricing">Change Plan</Link>
            </Button>
          </div>
        </div>

        {/* Usage This Month */}
        <div className="enterprise-card rounded-2xl p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-ent-text">Usage This Month</h3>
            <p className="text-sm text-verza-gray mt-1">Verifications used for the current billing period.</p>
          </div>
          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-verza-gray">Verifications</span>
                <span className="font-medium text-ent-text">3,250 / 5,000</span>
              </div>
              <Progress value={65} className="h-1.5 bg-ent-text/10" />
              <p className="text-[11px] text-verza-gray/60 uppercase tracking-wider">65% used - 1,750 remaining</p>
            </div>
 
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-verza-gray">API Calls</span>
                <span className="font-medium text-ent-text">125k / 500k</span>
              </div>
              <Progress value={25} className="h-1.5 bg-ent-text/10" />
              <p className="text-[11px] text-verza-gray/60 uppercase tracking-wider">25% used</p>
            </div>
 
            <div className="flex items-start gap-3 p-4 bg-yellow-500/10 text-yellow-500 rounded-xl text-sm border border-yellow-500/20">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold">Approaching Limit</span>
                <p className="text-xs opacity-80 mt-1 leading-relaxed">
                  You have used 65% of your included verifications. Overage charges apply after 5,000.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Payment Methods */}
        <div className="md:col-span-2 enterprise-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-ent-text">Payment Methods</h3>
            <Button variant="outline" size="sm" onClick={addPaymentMethod} className="border-ent-border bg-ent-text/10 text-ent-text hover:bg-ent-text/10">
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Button>
          </div>
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-4 border border-ent-border bg-ent-muted rounded-xl hover:bg-ent-card transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-16 bg-ent-text/10 rounded-lg flex items-center justify-center border border-ent-border">
                    <CreditCard className="h-6 w-6 text-verza-gray/60" />
                  </div>
                  <div>
                    <div className="font-medium text-ent-text flex items-center gap-2">
                      {method.type} ending in {method.last4}
                      {method.isDefault && (
                        <Badge className="text-[10px] bg-verza-emerald/10 text-verza-emerald border-verza-emerald/20">Default</Badge>
                      )}
                    </div>
                    <div className="text-xs text-verza-gray/60 mt-0.5">Expires {method.expiry}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                   {!method.isDefault && (
                      <Button variant="ghost" size="sm" onClick={() => promoteDefaultMethod(method.id)} className="text-xs text-verza-gray hover:text-ent-text">Make Default</Button>
                   )}
                   <Button variant="ghost" size="icon" className="text-red-400/60 hover:text-red-400 hover:bg-red-400/10" onClick={() => removeMethod(method.id)}>
                      <Trash2 className="h-4 w-4" />
                   </Button>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 text-xs text-verza-gray/40 mt-4 px-1">
               <Shield className="h-3.5 w-3.5" /> Payments are secured by Stripe with 256-bit encryption.
            </div>
          </div>
        </div>

        {/* Billing Address (Placeholder) */}
         <div className="enterprise-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-ent-text">Billing Contact</h3>
            <Button variant="ghost" size="sm" className="text-verza-emerald hover:bg-verza-emerald/10" onClick={() => toast.success('Billing contact editor opened.')}>Edit</Button>
          </div>
          <div className="text-sm space-y-3">
            <div className="font-medium text-ent-text">Acme Corp</div>
            <div className="text-verza-gray/80 space-y-1">
              <div>Attn: Finance Department</div>
              <div>123 Innovation Drive</div>
              <div>San Francisco, CA 94105</div>
              <div>United States</div>
            </div>
            <div className="pt-4 text-verza-gray/60 border-t border-ent-border">billing@acme.com</div>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="enterprise-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-ent-border">
          <h3 className="text-lg font-semibold text-ent-text">Billing History</h3>
          <p className="text-sm text-verza-gray mt-1">View and download past invoices.</p>
        </div>
        <div className="p-2">
          <Table>
            <TableHeader className="bg-ent-text/5 hover:bg-transparent">
              <TableRow className="border-ent-border hover:bg-transparent">
                <TableHead className="text-verza-gray font-medium">Invoice ID</TableHead>
                <TableHead className="text-verza-gray font-medium">Date</TableHead>
                <TableHead className="text-verza-gray font-medium">Amount</TableHead>
                <TableHead className="text-verza-gray font-medium">Status</TableHead>
                <TableHead className="text-right text-verza-gray font-medium">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingHistory.map((invoice) => (
                <TableRow key={invoice.id} className="border-ent-border hover:bg-ent-muted transition-colors">
                  <TableCell className="font-medium text-ent-text">{invoice.id}</TableCell>
                  <TableCell className="text-verza-gray">{invoice.date}</TableCell>
                  <TableCell className="text-ent-text">{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge className="bg-verza-emerald/10 text-verza-emerald border-verza-emerald/20">{invoice.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-verza-gray hover:text-ent-text" onClick={() => toast.success(`Invoice ${invoice.id} download started.`)}>
                      <Download className="mr-2 h-4 w-4" /> PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </motion.div>
  );
}
