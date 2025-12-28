import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CreditCard, Check, Download, AlertTriangle, 
  Plus, Trash2, Shield, Calendar 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Link } from 'wouter';

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

export default function EnterpriseBilling() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Billing & Plans</h1>
          <p className="text-muted-foreground">Manage your subscription, payment methods, and invoices.</p>
        </div>
        <Button asChild>
           <Link href="/enterprise/pricing">Upgrade Plan</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Plan Card */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Current Plan</CardTitle>
              <Badge className="bg-emerald-500/10 text-emerald-500">Active</Badge>
            </div>
            <CardDescription>You are currently on the <span className="font-semibold text-foreground">Business Plan</span>.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">$2,450</span>
              <span className="text-muted-foreground">/month</span>
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
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" /> Add New
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {PAYMENT_METHODS.map((method) => (
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
                      <Button variant="ghost" size="sm">Make Default</Button>
                   )}
                   <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
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
              <Button variant="ghost" size="sm">Edit</Button>
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
              {BILLING_HISTORY.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.id}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.amount}</TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">{invoice.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
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
