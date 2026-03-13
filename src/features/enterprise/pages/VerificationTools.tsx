import { useState } from 'react';
import { 
  Shield, User, FileText, ScanFace, Search, Upload, 
  CheckCircle, AlertTriangle, Loader2, Code, 
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { bankingService } from '@/services/bankingService';
import type { IndividualKYCRequest } from '@/types/banking';

export default function VerificationTools() {
  const [activeTab, setActiveTab] = useState("kyc");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // KYC State
  const [kycData, setKycData] = useState<IndividualKYCRequest>({
    firstName: '',
    lastName: '',
    dob: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    idDocumentType: 'passport',
    idDocumentNumber: ''
  });

  // Document State
  const [docType, setDocType] = useState<'passport' | 'drivers_license' | 'national_id'>('passport');
  const [docCountry, setDocCountry] = useState('');
  const [docImage, setDocImage] = useState<string>('');

  // Biometric State
  const [bioSelfie, setBioSelfie] = useState<string>('');
  const [bioDoc, setBioDoc] = useState<string>('');

  // Screening State
  const [screenName, setScreenName] = useState('');
  const [screenCountry, setScreenCountry] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const executeRequest = async (fn: () => Promise<any>) => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fn();
      setResult(res);
    } catch (err: any) {
      setError(err.message || "An error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKycSubmit = () => {
    executeRequest(() => bankingService.verifyIndividual(kycData));
  };

  const handleKycBasicSubmit = () => {
    executeRequest(() => bankingService.verifyIndividualBasic(kycData));
  };

  const handleDocVerify = () => {
    if (!docImage) {
      setError("Please upload a document image");
      return;
    }
    executeRequest(() => bankingService.verifyDocument({
      documentImage: docImage,
      documentType: docType,
      country: docCountry
    }));
  };

  const handleDocExtract = () => {
    if (!docImage) {
      setError("Please upload a document image");
      return;
    }
    executeRequest(() => bankingService.extractDocumentData({
      documentImage: docImage
    }));
  };

  const handleFaceMatch = () => {
    if (!bioSelfie || !bioDoc) {
      setError("Please upload both selfie and document images");
      return;
    }
    executeRequest(() => bankingService.matchFace({
      selfieImage: bioSelfie,
      documentImage: bioDoc
    }));
  };

  const handleLiveness = () => {
    // For demo, we'll simulate liveness check with just a button or maybe a short video upload if supported
    // Since the API takes videoUrl or imageSequence, we'll mock a call or send empty for now if the backend supports it
    // Or we can just send a dummy request
    executeRequest(() => bankingService.checkLiveness({
        videoUrl: "http://example.com/dummy-video.mp4"
    }));
  };

  const handleSanctionsCheck = () => {
    executeRequest(() => bankingService.checkSanctions({
      name: screenName,
      country: screenCountry
    }));
  };

  const handlePepCheck = () => {
    executeRequest(() => bankingService.checkPEP({
      name: screenName,
      country: screenCountry
    }));
  };

  const handleAmlRisk = () => {
    // Uses KYC data structure for risk score
    const amlData = {
        firstName: screenName.split(' ')[0] || '',
        lastName: screenName.split(' ').slice(1).join(' ') || '',
        dob: '1990-01-01', // Dummy
        email: 'test@example.com',
        phone: '555-0123',
        address: { street: '123 St', city: 'City', state: 'ST', zipCode: '00000', country: screenCountry },
        idDocumentType: 'passport' as const,
        idDocumentNumber: 'A1234567'
    };
    executeRequest(() => bankingService.calculateRiskScore({ customerData: amlData }));
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-verza-primary to-verza-secondary bg-clip-text text-transparent">
          Verification Tools
        </h1>
        <p className="text-muted-foreground mt-1">
          Directly access and test verification APIs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="kyc">Individual KYC</TabsTrigger>
              <TabsTrigger value="document">Documents</TabsTrigger>
              <TabsTrigger value="biometrics">Biometrics</TabsTrigger>
              <TabsTrigger value="screening">Screening</TabsTrigger>
            </TabsList>

            {/* Individual KYC Tab */}
            <TabsContent value="kyc">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Individual KYC Verification
                  </CardTitle>
                  <CardDescription>
                    Verify individual identity using personal details.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>First Name</Label>
                      <Input value={kycData.firstName} onChange={e => setKycData({...kycData, firstName: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name</Label>
                      <Input value={kycData.lastName} onChange={e => setKycData({...kycData, lastName: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date of Birth</Label>
                      <Input type="date" value={kycData.dob} onChange={e => setKycData({...kycData, dob: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input type="email" value={kycData.email} onChange={e => setKycData({...kycData, email: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={kycData.phone} onChange={e => setKycData({...kycData, phone: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input placeholder="Street" value={kycData.address.street} onChange={e => setKycData({...kycData, address: {...kycData.address, street: e.target.value}})} className="mb-2" />
                    <div className="grid grid-cols-2 gap-2">
                      <Input placeholder="City" value={kycData.address.city} onChange={e => setKycData({...kycData, address: {...kycData.address, city: e.target.value}})} />
                      <Input placeholder="State" value={kycData.address.state} onChange={e => setKycData({...kycData, address: {...kycData.address, state: e.target.value}})} />
                      <Input placeholder="Zip Code" value={kycData.address.zipCode} onChange={e => setKycData({...kycData, address: {...kycData.address, zipCode: e.target.value}})} />
                      <Input placeholder="Country" value={kycData.address.country} onChange={e => setKycData({...kycData, address: {...kycData.address, country: e.target.value}})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>ID Type</Label>
                      <Select value={kycData.idDocumentType} onValueChange={(v: any) => setKycData({...kycData, idDocumentType: v})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="passport">Passport</SelectItem>
                          <SelectItem value="drivers_license">Driver's License</SelectItem>
                          <SelectItem value="national_id">National ID</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>ID Number</Label>
                      <Input value={kycData.idDocumentNumber} onChange={e => setKycData({...kycData, idDocumentNumber: e.target.value})} />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleKycSubmit} disabled={loading} className="flex-1">
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Shield className="mr-2 h-4 w-4" />}
                      Full Verification
                    </Button>
                    <Button onClick={handleKycBasicSubmit} variant="outline" disabled={loading} className="flex-1">
                      Basic Check
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Document Tab */}
            <TabsContent value="document">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Document Verification
                  </CardTitle>
                  <CardDescription>
                    Verify authenticity and extract data from ID documents.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Document Type</Label>
                      <Select value={docType} onValueChange={(v: any) => setDocType(v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="passport">Passport</SelectItem>
                          <SelectItem value="drivers_license">Driver's License</SelectItem>
                          <SelectItem value="national_id">National ID</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Issuing Country</Label>
                      <Input value={docCountry} onChange={e => setDocCountry(e.target.value)} placeholder="e.g. US" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Upload Document Image</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <Input type="file" className="hidden" id="doc-upload" onChange={e => handleFileChange(e, setDocImage)} accept="image/*" />
                      <Label htmlFor="doc-upload" className="cursor-pointer">
                        <span className="text-primary font-medium">Click to upload</span> or drag and drop
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                    </div>
                    {docImage && (
                      <div className="mt-2 text-xs text-green-500 flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" /> Image loaded
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleDocVerify} disabled={loading} className="flex-1">
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Shield className="mr-2 h-4 w-4" />}
                      Verify Authenticity
                    </Button>
                    <Button onClick={handleDocExtract} variant="outline" disabled={loading} className="flex-1">
                      <Code className="mr-2 h-4 w-4" />
                      Extract Data
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Biometrics Tab */}
            <TabsContent value="biometrics">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ScanFace className="h-5 w-5" />
                    Biometric Verification
                  </CardTitle>
                  <CardDescription>
                    Perform face matching and liveness detection.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Selfie Image</Label>
                      <div className="border rounded-lg p-4 text-center">
                        <Input type="file" id="bio-selfie" className="hidden" onChange={e => handleFileChange(e, setBioSelfie)} accept="image/*" />
                        <Label htmlFor="bio-selfie" className="cursor-pointer block">
                          {bioSelfie ? <img src={bioSelfie} className="h-24 w-auto mx-auto object-contain" /> : <div className="h-24 flex items-center justify-center text-muted-foreground">Upload Selfie</div>}
                        </Label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>ID Document Image</Label>
                      <div className="border rounded-lg p-4 text-center">
                        <Input type="file" id="bio-doc" className="hidden" onChange={e => handleFileChange(e, setBioDoc)} accept="image/*" />
                        <Label htmlFor="bio-doc" className="cursor-pointer block">
                          {bioDoc ? <img src={bioDoc} className="h-24 w-auto mx-auto object-contain" /> : <div className="h-24 flex items-center justify-center text-muted-foreground">Upload ID</div>}
                        </Label>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleFaceMatch} disabled={loading} className="flex-1">
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ScanFace className="mr-2 h-4 w-4" />}
                      Match Face
                    </Button>
                    <Button onClick={handleLiveness} variant="outline" disabled={loading} className="flex-1">
                      <Activity className="mr-2 h-4 w-4" />
                      Check Liveness
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Screening Tab */}
            <TabsContent value="screening">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    AML & Screening
                  </CardTitle>
                  <CardDescription>
                    Screen against sanctions lists, PEPs, and calculate AML risk.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={screenName} onChange={e => setScreenName(e.target.value)} placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input value={screenCountry} onChange={e => setScreenCountry(e.target.value)} placeholder="US" />
                  </div>
                  <div className="flex gap-2 pt-4 flex-wrap">
                    <Button onClick={handleSanctionsCheck} disabled={loading} className="flex-1">
                      Sanctions Check
                    </Button>
                    <Button onClick={handlePepCheck} disabled={loading} className="flex-1" variant="secondary">
                      PEP Check
                    </Button>
                    <Button onClick={handleAmlRisk} disabled={loading} className="flex-1" variant="outline">
                      Risk Score
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Results Panel */}
        <div>
          <Card className="h-full sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Result</span>
                {result && (
                  <Badge variant={
                    result.status === 'verified' || result.isValid || result.match || !result.matchFound ? 'default' : 
                    result.status === 'rejected' || result.matchFound ? 'destructive' : 'secondary'
                  }>
                    {result.status || (result.isValid ? 'Valid' : 'Processed')}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                API response output
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                  <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
                  <p>Processing request...</p>
                </div>
              ) : error ? (
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Error</h4>
                    <p className="text-sm opacity-90">{error}</p>
                  </div>
                </div>
              ) : result ? (
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg overflow-auto max-h-[400px]">
                    <pre className="text-xs font-mono whitespace-pre-wrap">
                      {JSON.stringify(result, null, 2)}
                    </pre>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => {setResult(null); setError(null);}}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Clear Result
                  </Button>
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
                  <Code className="h-10 w-10 mx-auto mb-4 opacity-20" />
                  <p>Execute a request to see results here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Activity(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    )
}
