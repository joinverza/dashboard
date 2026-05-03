import { useState, type ChangeEvent } from 'react';
import { Shield, User, FileText, ScanFace, Search, Upload, CheckCircle, AlertTriangle, Loader2, Code, RefreshCw, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/features/auth/AuthContext';
import { bankingService, getBankingErrorMessage } from '@/services/bankingService';
import type { IndividualKYCRequest } from '@/types/banking';

type ToolResult = Record<string, unknown>;

const isObjectResult = (value: unknown): value is ToolResult => typeof value === 'object' && value !== null;

const getResultBadgeVariant = (value: ToolResult): 'default' | 'destructive' | 'secondary' => {
  const status = typeof value.status === 'string' ? value.status : '';
  const isValid = value.isValid === true || value.authentic === true;
  const isLive = value.isLive === true;
  const match = value.match === true;
  const matchFound = value.matchFound === true;
  if (status === 'verified' || status === 'completed' || isValid || isLive || match || (!matchFound && 'matchFound' in value)) {
    return 'default';
  }
  if (status === 'rejected' || status === 'failed' || matchFound) {
    return 'destructive';
  }
  return 'secondary';
};

const getResultBadgeLabel = (value: ToolResult): string => {
  if (typeof value.status === 'string') return value.status;
  if (value.isValid === true || value.authentic === true) return 'valid';
  if (value.match === true) return 'matched';
  if (value.isLive === true) return 'live';
  return 'processed';
};

const validateSelectedFile = (file: File, acceptedKind: 'image' | 'video'): string | null => {
  if (acceptedKind === 'image') {
    if (!file.type.startsWith('image/')) return 'Only image files are allowed';
    if (file.size > 10 * 1024 * 1024) return 'Image file must be 10MB or smaller';
  } else {
    if (!file.type.startsWith('video/')) return 'Only video files are allowed';
    if (file.size > 25 * 1024 * 1024) return 'Video file must be 25MB or smaller';
  }
  return null;
};

export default function VerificationsPage() {
  const { hasPermission, permissions, user } = useAuth();
  
  const canRead = permissions.length === 0 || hasPermission("verification:read") || hasPermission("kyc:read");
  const canWrite = permissions.length === 0 || hasPermission("verification:write") || hasPermission("kyc:write") || hasPermission("documents:write") || hasPermission("biometrics:write") || hasPermission("screening:write");

  const [activeTab, setActiveTab] = useState("kyc");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ToolResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [kycData, setKycData] = useState<IndividualKYCRequest>({
    firstName: '',
    lastName: '',
    dob: '',
    email: '',
    phone: '',
    address: { street: '', city: '', state: '', zipCode: '', country: '' },
    idDocumentType: 'passport',
    idDocumentNumber: ''
  });
  const [docType, setDocType] = useState<'passport' | 'drivers_license' | 'national_id'>('passport');
  const [docCountry, setDocCountry] = useState('');
  const [docImage, setDocImage] = useState<string>('');
  const [bioSelfie, setBioSelfie] = useState<string>('');
  const [bioDoc, setBioDoc] = useState<string>('');
  const [bioVideoUrl, setBioVideoUrl] = useState('');
  const [bioVideoInline, setBioVideoInline] = useState('');
  const [bioVideoFileName, setBioVideoFileName] = useState('');
  const [screenName, setScreenName] = useState('');
  const [screenCountry, setScreenCountry] = useState('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, setter: (val: string) => void, acceptedKind: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validationError = validateSelectedFile(file, acceptedKind);
    if (validationError) {
      setError(validationError);
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setter(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleVideoFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validationError = validateSelectedFile(file, 'video');
    if (validationError) {
      setError(validationError);
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setBioVideoInline(reader.result as string);
      setBioVideoFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const executeRequest = async (fn: () => Promise<unknown>) => {
    if (!canWrite) {
      setError("You do not have permission to execute verification requests.");
      return;
    }
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fn();
      setResult(isObjectResult(res) ? res : { value: res });
    } catch (err: unknown) {
      setError(getBankingErrorMessage(err, 'An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Verifications</h1>
          <p className="text-muted-foreground mt-1">Direct API verification workbench migrated from Tools.</p>
        </div>
        <div className="text-xs text-muted-foreground" role="status" aria-live="polite">Ready</div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-ent-muted border border-ent-border p-1 rounded-xl grid grid-cols-4">
              <TabsTrigger value="kyc" className="data-[state=active]:bg-verza-emerald data-[state=active]:text-[#06140F]">Individual KYC</TabsTrigger>
              <TabsTrigger value="document" className="data-[state=active]:bg-verza-emerald data-[state=active]:text-[#06140F]">Documents</TabsTrigger>
              <TabsTrigger value="biometrics" className="data-[state=active]:bg-verza-emerald data-[state=active]:text-[#06140F]">Biometrics</TabsTrigger>
              <TabsTrigger value="screening" className="data-[state=active]:bg-verza-emerald data-[state=active]:text-[#06140F]">Screening</TabsTrigger>
            </TabsList>
            <TabsContent value="kyc">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />Individual KYC Verification</CardTitle>
                  <CardDescription>Verify identity using personal details and ID metadata.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>First Name</Label><Input value={kycData.firstName} onChange={e => setKycData({ ...kycData, firstName: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Last Name</Label><Input value={kycData.lastName} onChange={e => setKycData({ ...kycData, lastName: e.target.value })} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Date of Birth</Label><Input type="date" value={kycData.dob} onChange={e => setKycData({ ...kycData, dob: e.target.value })} /></div>
                    <div className="space-y-2"><Label>Email</Label><Input type="email" value={kycData.email} onChange={e => setKycData({ ...kycData, email: e.target.value })} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>ID Type</Label><Select value={kycData.idDocumentType} onValueChange={(v: 'passport' | 'drivers_license' | 'national_id') => setKycData({ ...kycData, idDocumentType: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="passport">Passport</SelectItem><SelectItem value="drivers_license">Driver's License</SelectItem><SelectItem value="national_id">National ID</SelectItem></SelectContent></Select></div>
                    <div className="space-y-2"><Label>ID Number</Label><Input value={kycData.idDocumentNumber} onChange={e => setKycData({ ...kycData, idDocumentNumber: e.target.value })} /></div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={() => executeRequest(() => bankingService.verifyIndividual(kycData))} disabled={loading || !canWrite} className="flex-1">{loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Shield className="mr-2 h-4 w-4" />}Full Verification</Button>
                    <Button onClick={() => executeRequest(() => bankingService.verifyIndividualBasic(kycData))} variant="outline" disabled={loading || !canWrite} className="flex-1">Basic Check</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="document">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Document Verification</CardTitle>
                  <CardDescription>Verify authenticity and extract structured fields.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Document Type</Label><Select value={docType} onValueChange={(v: 'passport' | 'drivers_license' | 'national_id') => setDocType(v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="passport">Passport</SelectItem><SelectItem value="drivers_license">Driver's License</SelectItem><SelectItem value="national_id">National ID</SelectItem></SelectContent></Select></div>
                    <div className="space-y-2"><Label>Issuing Country</Label><Input value={docCountry} onChange={e => setDocCountry(e.target.value)} placeholder="US" /></div>
                  </div>
                  <div className="space-y-2">
                    <Label>Upload Document Image</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <Input type="file" className="hidden" id="doc-upload" onChange={e => handleFileChange(e, setDocImage, 'image')} accept="image/*" />
                      <Label htmlFor="doc-upload" className="cursor-pointer"><span className="text-primary font-medium">Click to upload</span> or drag and drop</Label>
                    </div>
                    {docImage && <div className="mt-2 text-xs text-verza-emerald flex items-center"><CheckCircle className="h-3 w-3 mr-1" />Image loaded</div>}
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={() => executeRequest(() => bankingService.verifyDocument({ documentImage: docImage, documentType: docType, issuingCountry: docCountry.trim().toUpperCase(), useOcr: true }))} disabled={loading || !canWrite} className="flex-1">Verify Authenticity</Button>
                    <Button onClick={() => executeRequest(() => bankingService.extractDocumentData({ documentImage: docImage }))} variant="outline" disabled={loading || !canWrite} className="flex-1">Extract Data</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="biometrics">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><ScanFace className="h-5 w-5" />Biometric Verification</CardTitle>
                  <CardDescription>Face matching and liveness verification checks.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Selfie Image</Label><Input type="file" onChange={e => handleFileChange(e, setBioSelfie, 'image')} accept="image/*" /></div>
                    <div className="space-y-2"><Label>ID Document Image</Label><Input type="file" onChange={e => handleFileChange(e, setBioDoc, 'image')} accept="image/*" /></div>
                  </div>
                  <div className="space-y-2">
                    <Label>Liveness Video Upload</Label>
                    <Input type="file" accept="video/*" onChange={handleVideoFileChange} />
                    <p className="text-xs text-muted-foreground">Video files must be 25MB or smaller.</p>
                    {bioVideoInline && <div className="text-xs text-verza-emerald flex items-center"><CheckCircle className="h-3 w-3 mr-1" />{bioVideoFileName || 'Video loaded'}</div>}
                  </div>
                  <div className="space-y-2"><Label>Liveness Video URL</Label><Input value={bioVideoUrl} onChange={e => setBioVideoUrl(e.target.value)} placeholder="https://cdn.example.com/liveness.mp4" /></div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={() => executeRequest(() => bankingService.matchFace({ selfieImage: bioSelfie, documentImage: bioDoc }))} disabled={loading || !canWrite} className="flex-1">Match Face</Button>
                    <Button onClick={() => executeRequest(() => bankingService.checkLiveness({ selfieImage: bioSelfie || undefined, videoUrl: bioVideoUrl.trim() || bioVideoInline || undefined }))} variant="outline" disabled={loading || !canWrite} className="flex-1"><Activity className="mr-2 h-4 w-4" />Check Liveness</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="screening">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Search className="h-5 w-5" />AML & Screening</CardTitle>
                  <CardDescription>Run sanctions, PEP, and AML risk calculations.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2"><Label>Full Name</Label><Input value={screenName} onChange={e => setScreenName(e.target.value)} placeholder="John Doe" /></div>
                  <div className="space-y-2"><Label>Country</Label><Input value={screenCountry} onChange={e => setScreenCountry(e.target.value)} placeholder="US" /></div>
                  <div className="flex gap-2 pt-4 flex-wrap">
                    <Button onClick={() => executeRequest(() => bankingService.checkSanctions({ name: screenName, country: screenCountry }))} disabled={loading || !canWrite} className="flex-1">Sanctions Check</Button>
                    <Button onClick={() => executeRequest(() => bankingService.checkPEP({ name: screenName, country: screenCountry }))} disabled={loading || !canWrite} className="flex-1" variant="secondary">PEP Check</Button>
                    <Button onClick={() => executeRequest(() => bankingService.calculateRiskScore({ customerData: { firstName: screenName.split(' ')[0] || '', lastName: screenName.split(' ').slice(1).join(' ') || '', dob: '1990-01-01', email: 'sandbox@example.com', phone: '555-0101', address: { street: '1 Main', city: 'N/A', state: 'N/A', zipCode: '00000', country: screenCountry }, idDocumentType: 'passport', idDocumentNumber: 'X1234567' } }))} disabled={loading || !canWrite} className="flex-1" variant="outline">Risk Score</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <div>
          <Card className="h-full sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Result</span>
                {result && isObjectResult(result) && <Badge variant={getResultBadgeVariant(result)}>{getResultBadgeLabel(result).toUpperCase()}</Badge>}
              </CardTitle>
              <CardDescription>API response output</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground"><Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" /><p>Processing request...</p></div>
              ) : error ? (
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex items-start gap-3"><AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" /><div><h4 className="font-medium">Error</h4><p className="text-sm opacity-90">{error}</p></div></div>
              ) : result ? (
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg overflow-auto max-h-[400px]"><pre className="text-xs font-mono whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre></div>
                  <Button variant="outline" className="w-full" onClick={() => { setResult(null); setError(null); }}><RefreshCw className="mr-2 h-4 w-4" />Clear Result</Button>
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg"><Code className="h-10 w-10 mx-auto mb-4 opacity-20" /><p>Execute a request to see results here</p></div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
