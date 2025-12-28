import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function InviteTeamMember() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Viewer');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (email.includes('error')) {
        throw new Error('Failed to send invitation. Please try again.');
      }

      setSuccess(true);
      // Reset form after success if needed
      // setEmail('');
      // setMessage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto mt-10"
      >
        <Card className="border-verza-emerald/50 bg-verza-emerald/5">
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-verza-emerald/20 text-verza-emerald mb-4 mx-auto">
              <CheckCircle className="h-6 w-6" />
            </div>
            <CardTitle className="text-center">Invitation Sent!</CardTitle>
            <CardDescription className="text-center">
              An email has been sent to <span className="font-medium text-foreground">{email}</span> with instructions to join your team.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => {
              setSuccess(false);
              setEmail('');
              setMessage('');
            }}>
              Invite Another
            </Button>
            <Button onClick={() => setLocation('/enterprise/team')}>
              Return to Team
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="mb-6">
        <Button variant="ghost" size="sm" className="mb-2 pl-0 hover:pl-2 transition-all" onClick={() => window.history.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Team
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Invite Team Member</h1>
        <p className="text-muted-foreground">Add a new member to your organization and assign their role.</p>
      </div>

      <Card>
        <form onSubmit={handleInvite}>
          <CardHeader>
            <CardTitle>Invitation Details</CardTitle>
            <CardDescription>
              The user will receive an email with a link to set up their account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="colleague@company.com" 
                  className="pl-9" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">
                    <div className="flex items-center">
                      <Shield className="mr-2 h-4 w-4 text-verza-primary" />
                      <div>
                        <span className="font-medium">Admin</span>
                        <p className="text-xs text-muted-foreground">Full access to all settings and team management</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="Manager">
                    <div className="flex items-center">
                      <Shield className="mr-2 h-4 w-4 text-verza-purple" />
                      <div>
                        <span className="font-medium">Manager</span>
                        <p className="text-xs text-muted-foreground">Can manage verifications and API keys</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="Analyst">
                    <div className="flex items-center">
                      <Shield className="mr-2 h-4 w-4 text-blue-500" />
                      <div>
                        <span className="font-medium">Analyst</span>
                        <p className="text-xs text-muted-foreground">Can view reports and analytics</p>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="Viewer">
                    <div className="flex items-center">
                      <Shield className="mr-2 h-4 w-4 text-gray-500" />
                      <div>
                        <span className="font-medium">Viewer</span>
                        <p className="text-xs text-muted-foreground">Read-only access to basic information</p>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Personal Message (Optional)</Label>
              <Textarea 
                id="message" 
                placeholder="Hey, joining the team..." 
                className="min-h-[100px]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4 border-t bg-muted/20 p-6">
            <Button type="button" variant="ghost" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-verza-primary hover:bg-verza-primary/90 text-white">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" /> Send Invitation
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
