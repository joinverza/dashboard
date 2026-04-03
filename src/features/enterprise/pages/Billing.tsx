import { motion } from 'framer-motion';
import { 
  CreditCard, Check, Download, AlertTriangle, 
  Plus, Trash2, Shield, Calendar 
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from 'wouter';
import { toast } from 'sonner';
import { TabHelpCard } from '@/components/shared/TabHelpCard';

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
  const [paymentMethods, setPaymentMethods] = useState(PAYMENT_METHODS);
  const [billingHistory] = useState(BILLING_HISTORY);
  const [currentPlan, setCurrentPlan] = useState<'starter' | 'business' | 'enterprise'>('business');
  const [interval, setIntervalValue] = useState<'monthly' | 'yearly'>('monthly');
  const [pendingPlan, setPendingPlan] = useState<{ plan: 'starter' | 'business' | 'enterprise'; interval: 'monthly' | 'yearly' } | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const planParam = params.get('plan');
    const intervalParam = params.get('interval');
    if (planParam === 'starter' || planParam === 'business' || planParam === 'enterprise') {
      const selectedInterval = intervalParam === 'yearly' ? 'yearly' : 'monthly';
      setPendingPlan({ plan: planParam, interval: selectedInterval });
    }
  }, []);

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

  const completeUpgrade = async () => {
    if (!pendingPlan) return;
    setIsProcessingPayment(true);
    await new Promise((resolve) => setTimeout(resolve, 1400));
    setCurrentPlan(pendingPlan.plan);
    setIntervalValue(pendingPlan.interval);
    setPendingPlan(null);
    setIsProcessingPayment(false);
    toast.success('Payment confirmed and plan updated.');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <TabHelpCard
        title="Billing & Plans"
        description="Manage payment methods, invoices, and complete plan changes after successful payment."
      />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Billing & Plans</h1>
          <p className="text-muted-foreground">Manage your subscription, payment methods, and invoices.</p>
        </div>
        <Button asChild>
           <Link href="/enterprise/pricing">Upgrade Plan</Link>
        </Button>
      </div>

      {pendingPlan && (
        <Card className="border-verza-primary/40 bg-verza-primary/5">
          <CardHeader>
            <CardTitle>Pending Plan Change</CardTitle>
            <CardDescription>
              {pendingPlan.plan.toUpperCase()} on {pendingPlan.interval} billing is ready. Upgrade applies after payment succeeds.
            </CardDescription>
          </CardHeader>
          <CardFooter className="gap-2">
            <Button onClick={completeUpgrade} disabled={isProcessingPayment}>
              {isProcessingPayment ? 'Processing payment...' : 'Make Payment & Upgrade'}
            </Button>
            <Button variant="outline" onClick={() => setPendingPlan(null)}>Cancel</Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Plan Card */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Current Plan</CardTitle>
              <Badge className="bg-emerald-500/10 text-emerald-500">Active</Badge>
            </div>
            <CardDescription>
              You are currently on the <span className="font-semibold text-foreground capitalize">{currentPlan} Plan</span>.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">{displayPrice}</span>
              <span className="text-muted-foreground">/{interval}</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Included Verifications</span>
                <span className="font-medium">5,000 / month</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-emerald-500" /> API Access
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-emerald-500" /> 5 Team Members
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-emerald-500" /> Standard Support
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-md text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Next billing date: <span className="font-medium">Nov 01, 2023</span></span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
                <Link href="/enterprise/pricing">Change Plan</Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Usage This Month */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Usage This Month</CardTitle>
            <CardDescription>Verifications used for the current billing period.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Verifications</span>
                <span className="font-medium">3,250 / 5,000</span>
              </div>
              <Progress value={65} className="h-2" />
              <p className="text-xs text-muted-foreground">65% used - 1,750 remaining</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>API Calls</span>
                <span className="font-medium">125k / 500k</span>
              </div>
              <Progress value={25} className="h-2" />
              <p className="text-xs text-muted-foreground">25% used</p>
            </div>

            <div className="flex items-start gap-2 p-3 bg-yellow-500/10 text-yellow-500 rounded-md text-sm border border-yellow-500/20">
              <AlertTriangle className="h-4 w-4 mt-0.5" />
              <div>
                <span className="font-medium">Approaching Limit</span>
                <p className="text-xs opacity-90 mt-1">
                  You have used 65% of your included verifications. Overage charges of $0.50 per verification apply after 5,000.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Payment Methods */}
        <Card className="md:col-span-2 bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Payment Methods</CardTitle>
              <Button variant="outline" size="sm" onClick={addPaymentMethod}>
                <Plus className="mr-2 h-4 w-4" /> Add New
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-14 bg-muted rounded flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {method.type} ending in {method.last4}
                      {method.isDefault && (
                        <Badge variant="secondary" className="text-xs">Default</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">Expires {method.expiry}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                   {!method.isDefault && (
                      <Button variant="ghost" size="sm" onClick={() => promoteDefaultMethod(method.id)}>Make Default</Button>
                   )}
                   <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => removeMethod(method.id)}>
                      <Trash2 className="h-4 w-4" />
                   </Button>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
               <Shield className="h-4 w-4" /> Payments are secured by Stripe.
            </div>
          </CardContent>
        </Card>

        {/* Billing Address (Placeholder) */}
         <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Billing Contact</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => toast.success('Billing contact editor opened.')}>Edit</Button>
            </div>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div className="font-medium">Acme Corp</div>
            <div>Attn: Finance Department</div>
            <div>123 Innovation Drive</div>
            <div>San Francisco, CA 94105</div>
            <div>United States</div>
            <div className="pt-2 text-muted-foreground">billing@acme.com</div>
          </CardContent>
        </Card>
      </div>

      {/* Billing History */}
      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View and download past invoices.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingHistory.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">{invoice.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast.success(`Invoice ${invoice.id} download started.`)}>
                      <Download className="mr-2 h-4 w-4" /> PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
