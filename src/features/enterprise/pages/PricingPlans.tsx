import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import { TabHelpCard } from '@/components/shared/TabHelpCard';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    monthlyPrice: 499,
    description: 'Perfect for small businesses getting started with verification.',
    features: [
      '500 verifications / month',
      'Basic API Access',
      '2 Team Members',
      'Email Support',
      'Standard Audit Logs',
    ],
    missing: [
      'Advanced Analytics',
      'SSO & SAML',
      'Dedicated Account Manager',
      'Custom SLA',
    ],
    current: false,
  },
  {
    id: 'business',
    name: 'Business',
    monthlyPrice: 2450,
    description: 'For growing companies with higher volume needs.',
    features: [
      '5,000 verifications / month',
      'Full API Access',
      '10 Team Members',
      'Priority Email & Chat Support',
      'Advanced Audit Logs',
      'Advanced Analytics',
      'SSO & SAML',
    ],
    missing: [
      'Dedicated Account Manager',
      'Custom SLA',
    ],
    current: true,
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    monthlyPrice: null,
    description: 'Tailored solutions for large organizations.',
    features: [
      'Unlimited verifications',
      'Full API Access with higher rate limits',
      'Unlimited Team Members',
      '24/7 Phone & Email Support',
      'Full Audit Trails',
      'Advanced Analytics',
      'SSO & SAML',
      'Dedicated Account Manager',
      'Custom SLA',
      'On-premise Deployment Options',
    ],
    missing: [],
    current: false,
  },
];

export default function EnterprisePricingPlans() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [, setLocation] = useLocation();

  const toDisplayPrice = (monthlyPrice: number | null): string => {
    if (monthlyPrice === null) return 'Custom';
    const yearlyMonthlyEquivalent = Math.round(monthlyPrice * 0.8);
    const value = isAnnual ? yearlyMonthlyEquivalent : monthlyPrice;
    return `$${value.toLocaleString()}`;
  };

  const handlePlanAction = (planId: string, isCurrent: boolean, isEnterprise: boolean) => {
    if (isCurrent) return;
    if (isEnterprise) {
      window.open('mailto:sales@verza.com?subject=Enterprise%20Plan%20Inquiry', '_self');
      return;
    }
    const interval = isAnnual ? 'yearly' : 'monthly';
    setLocation(`/enterprise/billing?plan=${planId}&interval=${interval}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <TabHelpCard
        title="Pricing Plans"
        description="Choose monthly or yearly billing and continue to payment to complete plan upgrades or downgrades."
      />
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Simple, Transparent Pricing</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose the plan that's right for your business. Upgrade or downgrade at any time.
        </p>
        
        <div className="flex items-center justify-center gap-4 mt-6">
          <span className={`text-sm ${!isAnnual ? 'font-bold' : 'text-muted-foreground'}`}>Monthly</span>
          <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
          <span className={`text-sm ${isAnnual ? 'font-bold' : 'text-muted-foreground'}`}>
            Annually <span className="text-emerald-500 font-normal">(Save 20%)</span>
          </span>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3 pt-8">
        {PLANS.map((plan) => (
          <Card 
            key={plan.name} 
            className={`flex flex-col relative ${plan.popular ? 'border-primary shadow-lg scale-105 z-10' : 'bg-card/80 backdrop-blur-sm border-border/50'}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <Badge className="bg-primary text-primary-foreground px-4 py-1 text-sm rounded-full">Most Popular</Badge>
              </div>
            )}
            
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">{toDisplayPrice(plan.monthlyPrice)}</span>
                {plan.monthlyPrice !== null && <span className="text-muted-foreground">/{isAnnual ? 'month (annual billing)' : 'month'}</span>}
              </div>

              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
                {plan.missing.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 text-sm text-muted-foreground/50">
                    <X className="h-4 w-4 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={plan.current ? "outline" : (plan.popular ? "default" : "secondary")}
                disabled={plan.current}
                onClick={() => handlePlanAction(plan.id, plan.current, plan.monthlyPrice === null)}
              >
                {plan.current ? "Current Plan" : (plan.monthlyPrice === null ? "Contact Sales" : "Continue")}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="rounded-lg bg-muted/50 p-8 text-center mt-12">
        <h3 className="text-lg font-semibold mb-2">Need a custom solution?</h3>
        <p className="text-muted-foreground mb-4">
          We offer tailored packages for large enterprises with specific compliance and volume requirements.
        </p>
        <Button variant="outline" onClick={() => window.open('mailto:sales@verza.com?subject=Enterprise%20Pricing%20Inquiry', '_self')}>
          Contact Enterprise Sales
        </Button>
      </div>
    </motion.div>
  );
}
