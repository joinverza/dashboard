import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, ChevronRight, Lock, RefreshCw, 
  Settings, Database, PlayCircle, AlertCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Link, useLocation } from 'wouter';

const STEPS = [
  { id: 1, name: 'Authorize', icon: Lock },
  { id: 2, name: 'Map Fields', icon: Database },
  { id: 3, name: 'Sync Settings', icon: Settings },
  { id: 4, name: 'Test', icon: PlayCircle },
];

export default function EnterpriseIntegrationSetup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [, setLocation] = useLocation();

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finish
      setLocation('/enterprise/integrations');
    }
  };

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      handleNext();
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-8"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Setup Integration</h1>
        <p className="text-muted-foreground">Configure your connection with Salesforce.</p>
      </div>

      {/* Stepper */}
      <div className="relative flex items-center justify-between w-full">
        <div className="absolute left-0 top-1/2 h-0.5 w-full -z-10 bg-border" />
        {STEPS.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex flex-col items-center gap-2 bg-background px-2">
              <div 
                className={`
                  h-10 w-10 rounded-full flex items-center justify-center border-2 transition-colors
                  ${isActive ? 'border-primary bg-primary text-primary-foreground' : 
                    isCompleted ? 'border-primary bg-primary text-primary-foreground' : 
                    'border-muted-foreground bg-background text-muted-foreground'}
                `}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
              </div>
              <span className={`text-sm font-medium ${isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                {step.name}
              </span>
            </div>
          );
        })}
      </div>

      <Card className="bg-card/80 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>{STEPS[currentStep - 1].name}</CardTitle>
          <CardDescription>
            {currentStep === 1 && "Authorize Verza to access your Salesforce account."}
            {currentStep === 2 && "Map Verza data fields to your Salesforce objects."}
            {currentStep === 3 && "Configure how often and what data to sync."}
            {currentStep === 4 && "Test the connection with sample data before activating."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Authorize */}
          {currentStep === 1 && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="flex items-center gap-8">
                <div className="h-16 w-16 rounded-lg border bg-card flex items-center justify-center">
                  <div className="font-bold text-2xl">V</div>
                </div>
                <div className="h-px w-16 bg-border relative">
                  <div className="absolute -top-1.5 left-1/2 -ml-1.5 h-3 w-3 rounded-full bg-muted-foreground" />
                </div>
                <div className="h-16 w-16 rounded-lg border bg-white flex items-center justify-center">
                  <div className="font-bold text-2xl text-blue-500">SF</div>
                </div>
              </div>
              <div className="text-center space-y-2 max-w-sm">
                <p>Verza will request permission to:</p>
                <ul className="text-sm text-muted-foreground text-left list-disc pl-4 space-y-1">
                  <li>Read lead and contact data</li>
                  <li>Update verification status fields</li>
                  <li>Create tasks for failed verifications</li>
                </ul>
              </div>
            </div>
          )}

          {/* Step 2: Map Fields */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 font-medium text-sm text-muted-foreground mb-2">
                <div>Verza Field</div>
                <div>Salesforce Field</div>
              </div>
              {[
                { label: 'First Name', default: 'FirstName' },
                { label: 'Last Name', default: 'LastName' },
                { label: 'Email', default: 'Email' },
                { label: 'Verification Status', default: 'Verza_Status__c' },
                { label: 'Verification Date', default: 'Verza_Date__c' },
              ].map((field, i) => (
                <div key={i} className="grid grid-cols-2 gap-4 items-center">
                  <div className="p-2 bg-muted/50 rounded-md text-sm">{field.label}</div>
                  <Select defaultValue={field.default}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={field.default}>{field.default}</SelectItem>
                      <SelectItem value="custom">Custom Field...</SelectItem>
                      <SelectItem value="ignore">Do Not Sync</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          )}

          {/* Step 3: Sync Settings */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sync Frequency</Label>
                  <p className="text-sm text-muted-foreground">How often to push updates to Salesforce</p>
                </div>
                <Select defaultValue="realtime">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Sync Direction</Label>
                  <p className="text-sm text-muted-foreground">Control data flow direction</p>
                </div>
                <Select defaultValue="both">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="push">Push to Salesforce</SelectItem>
                    <SelectItem value="pull">Pull from Salesforce</SelectItem>
                    <SelectItem value="both">Bidirectional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Conflict Resolution</Label>
                  <p className="text-sm text-muted-foreground">Which source wins when data differs</p>
                </div>
                <Select defaultValue="verza">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="verza">Verza Wins</SelectItem>
                    <SelectItem value="salesforce">Salesforce Wins</SelectItem>
                    <SelectItem value="manual">Manual Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 4: Test */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg border border-border/50">
                <h4 className="font-medium mb-2 flex items-center">
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Testing Connection...
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-emerald-500">
                    <Check className="mr-2 h-4 w-4" /> Authentication successful
                  </div>
                  <div className="flex items-center text-emerald-500">
                    <Check className="mr-2 h-4 w-4" /> Field mapping verified
                  </div>
                  <div className="flex items-center text-emerald-500">
                    <Check className="mr-2 h-4 w-4" /> Write permission confirmed
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-4 bg-yellow-500/10 text-yellow-500 rounded-lg border border-yellow-500/20">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm">This will trigger an initial sync of 1,240 records. This may take a few minutes.</p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          
          {currentStep === 1 ? (
            <Button onClick={handleConnect} disabled={isConnecting}>
              {isConnecting ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Connecting...
                </>
              ) : (
                'Authorize Connection'
              )}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              {currentStep === STEPS.length ? 'Activate Integration' : 'Continue'}
              {currentStep !== STEPS.length && <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
