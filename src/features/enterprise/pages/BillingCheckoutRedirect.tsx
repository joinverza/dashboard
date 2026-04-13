import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { bankingService, getBankingErrorMessage } from '@/services/bankingService';

export default function BillingCheckoutRedirect() {
  const [, setLocation] = useLocation();
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const targetPlan = params.get('plan') || '';
  const interval = params.get('interval') === 'yearly' ? 'yearly' : 'monthly';
  const [loading, setLoading] = useState(true);
  const [checkoutUrl, setCheckoutUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const run = async () => {
      if (!targetPlan) {
        setError('Missing plan in query string.');
        setLoading(false);
        return;
      }
      try {
        const response = await bankingService.createCheckoutSession({
          targetPlan,
          billingInterval: interval,
        });
        setCheckoutUrl(response.checkoutUrl);
        if (response.checkoutUrl) {
          window.location.assign(response.checkoutUrl);
          return;
        }
        setError('Checkout URL was not returned by backend.');
      } catch (requestError) {
        setError(getBankingErrorMessage(requestError, 'Could not create checkout session.'));
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [interval, targetPlan]);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mt-16 max-w-xl px-4">
      <Card>
        <CardHeader>
          <CardTitle>Billing Checkout Redirect</CardTitle>
          <CardDescription>Preparing secure checkout session for selected plan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-muted-foreground">
            Plan: <span className="font-medium text-foreground">{targetPlan || 'N/A'}</span> · Interval:{' '}
            <span className="font-medium text-foreground">{interval}</span>
          </div>
          {loading ? (
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating checkout session...
            </div>
          ) : null}
          {error ? <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">{error}</div> : null}
          {checkoutUrl && !loading ? (
            <div className="rounded-md border bg-muted/30 p-3 text-xs break-all">
              Redirect URL: {checkoutUrl}
            </div>
          ) : null}
        </CardContent>
        <CardFooter className="flex gap-2">
          {checkoutUrl ? (
            <Button onClick={() => window.location.assign(checkoutUrl)}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Checkout
            </Button>
          ) : null}
          <Button variant="outline" onClick={() => setLocation('/enterprise/billing')}>
            Back to Billing
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
