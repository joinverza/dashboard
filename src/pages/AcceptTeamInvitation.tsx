import { useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { bankingService, getBankingErrorMessage } from '@/services/bankingService';

export default function AcceptTeamInvitation() {
  const [, setLocation] = useLocation();
  const queryToken = useMemo(() => new URLSearchParams(window.location.search).get('token') || '', []);
  const [token, setToken] = useState(queryToken);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleAccept = async () => {
    if (!token.trim()) {
      setStatus('error');
      setMessage('Invitation token is required.');
      return;
    }
    try {
      setStatus('loading');
      const response = await bankingService.acceptTeamInvitation({ token: token.trim() });
      setStatus('success');
      setMessage(`Invitation ${response.invitationId} accepted.`);
    } catch (error) {
      setStatus('error');
      setMessage(getBankingErrorMessage(error, 'Unable to accept invitation.'));
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mt-16 max-w-lg px-4">
      <Card>
        <CardHeader>
          <CardTitle>Accept Team Invitation</CardTitle>
          <CardDescription>Use your invitation token to join the organization workspace.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-token">Invitation Token</Label>
            <Input
              id="invite-token"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="Paste invitation token"
            />
          </div>
          {status === 'success' && (
            <div className="rounded-md border border-verza-emerald/40 bg-verza-emerald/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                <span>{message}</span>
              </div>
            </div>
          )}
          {status === 'error' && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span>{message}</span>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button onClick={handleAccept} disabled={status === 'loading'}>
            {status === 'loading' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Accept Invitation
          </Button>
          <Button variant="outline" onClick={() => setLocation('/login')}>
            Go to Login
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
