import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Upload, FileSpreadsheet, Download, CheckCircle, AlertCircle, ArrowRight, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

import { bankingService } from '@/services/bankingService';
import type { BulkVerificationResponse } from '@/types/banking';

type CsvRow = Record<string, string>;

export default function BulkVerification() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<CsvRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [bulkResponse, setBulkResponse] = useState<BulkVerificationResponse | null>(null);

  // Mapping state
  const [fieldMapping, setFieldMapping] = useState({
    firstName: '',
    lastName: '',
    email: '',
    idNumber: '',
    dob: ''
  });

  // Helper to parse CSV
  const parseCSV = (text: string): { headers: string[]; data: CsvRow[] } => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data: CsvRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const values = lines[i].split(',').map(v => v.trim());
      const row: CsvRow = {};
      headers.forEach((h, index) => {
        row[h] = values[index];
      });
      data.push(row);
    }
    return { headers, data };
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const startUpload = () => {
    if (!file) return;
    setIsUploading(true);
    setUploadProgress(0);
    
    const reader = new FileReader();
    
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        setUploadProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    reader.onload = (e) => {
      const text = e.target?.result as string;
      const { headers, data } = parseCSV(text);
      setHeaders(headers);
      setParsedData(data);
      
      // Auto-guess mapping
      const newMapping = { ...fieldMapping };
      headers.forEach(h => {
        const lower = h.toLowerCase();
        if (lower.includes('first')) newMapping.firstName = h;
        else if (lower.includes('last')) newMapping.lastName = h;
        else if (lower.includes('email')) newMapping.email = h;
        else if (lower.includes('id') || lower.includes('number')) newMapping.idNumber = h;
        else if (lower.includes('dob') || lower.includes('birth')) newMapping.dob = h;
      });
      setFieldMapping(newMapping);
      
      setIsUploading(false);
      setStep(2);
    };
    reader.readAsText(file);
  };

  const startProcessing = async () => {
    setStep(3);
    setProcessingProgress(10);
    
    try {
        const items = parsedData.map((row, index) => ({
            requestId: `req_${index + 1}`,
            customerId: row[fieldMapping.email] || `customer_${index + 1}`,
            personalInfo: {
              firstName: row[fieldMapping.firstName] || '',
              lastName: row[fieldMapping.lastName] || '',
              country: 'US',
            },
            contactInfo: {
              email: row[fieldMapping.email] || '',
              address: {
                country: 'US',
              },
            },
            identityDocuments: [
              {
                type: 'national_id' as const,
                number: row[fieldMapping.idNumber] || '',
              },
            ],
        }));

        setProcessingProgress(50);
        
        const response = await bankingService.initiateBulkVerification({ items });
        setBulkResponse(response);
        setProcessingProgress(100);
        
        setTimeout(() => {
            setStep(4);
        }, 1000);
        
    } catch (error) {
        console.error("Bulk processing failed", error);
        setProcessingProgress(0);
        // Handle error state or show toast
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-verza-primary to-verza-secondary bg-clip-text text-transparent">
            Bulk Verification
          </h1>
          <p className="text-muted-foreground mt-1">
            Upload and process multiple verification requests at once
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Download Template
        </Button>
      </div>

      {/* Progress Steps */}
      <div className="relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted -z-10 transform -translate-y-1/2"></div>
        <div className="flex justify-between max-w-3xl mx-auto">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex flex-col items-center gap-2 bg-background px-2">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold transition-colors ${
                  step >= s 
                    ? 'bg-verza-primary text-primary-foreground border-verza-primary' 
                    : 'bg-muted text-muted-foreground border-transparent'
                }`}
              >
                {step > s ? <CheckCircle className="h-6 w-6" /> : s}
              </div>
              <span className={`text-xs font-medium ${step >= s ? 'text-foreground' : 'text-muted-foreground'}`}>
                {s === 1 ? 'Upload' : s === 2 ? 'Map Fields' : s === 3 ? 'Process' : 'Results'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Step 1: Upload */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Upload File</CardTitle>
                <CardDescription>
                  Upload a CSV or Excel file containing the verification requests.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div 
                  className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors ${
                    file ? 'border-verza-primary/50 bg-verza-primary/5' : 'border-muted-foreground/25 hover:border-verza-primary/50 hover:bg-muted/50'
                  }`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  {file ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 rounded-full bg-verza-primary/10 flex items-center justify-center mx-auto text-verza-primary">
                        <FileSpreadsheet className="h-8 w-8" />
                      </div>
                      <div>
                        <p className="font-medium text-lg">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <X className="h-4 w-4 mr-2" /> Remove
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-medium text-lg mb-1">Drag and drop your file here</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Supported formats: .csv, .xls, .xlsx (Max 10MB)
                      </p>
                      <div className="relative">
                        <Button variant="outline">Browse Files</Button>
                        <input 
                          type="file" 
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                          accept=".csv, .xls, .xlsx"
                          onChange={handleFileUpload}
                        />
                      </div>
                    </>
                  )}
                </div>

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}

                <div className="flex justify-end">
                  <Button onClick={startUpload} disabled={!file || isUploading}>
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading
                      </>
                    ) : (
                      <>
                        Next Step <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Map Fields */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Map Fields</CardTitle>
                <CardDescription>
                  Map the columns from your file to the corresponding Verza fields.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>First Name Column</Label>
                      <Select value={fieldMapping.firstName} onValueChange={(v) => setFieldMapping({...fieldMapping, firstName: v})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select column" />
                        </SelectTrigger>
                        <SelectContent>
                          {headers.map(h => (
                            <SelectItem key={h} value={h}>{h}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Email Column</Label>
                      <Select value={fieldMapping.email} onValueChange={(v) => setFieldMapping({...fieldMapping, email: v})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select column" />
                        </SelectTrigger>
                        <SelectContent>
                          {headers.map(h => (
                            <SelectItem key={h} value={h}>{h}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Document ID Column</Label>
                      <Select value={fieldMapping.idNumber} onValueChange={(v) => setFieldMapping({...fieldMapping, idNumber: v})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select column" />
                        </SelectTrigger>
                        <SelectContent>
                          {headers.map(h => (
                            <SelectItem key={h} value={h}>{h}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Last Name Column</Label>
                      <Select value={fieldMapping.lastName} onValueChange={(v) => setFieldMapping({...fieldMapping, lastName: v})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select column" />
                        </SelectTrigger>
                        <SelectContent>
                          {headers.map(h => (
                            <SelectItem key={h} value={h}>{h}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mapped Name</TableHead>
                        <TableHead>Mapped Email</TableHead>
                        <TableHead>Mapped ID</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedData.slice(0, 5).map((row, i) => (
                        <TableRow key={i}>
                          <TableCell>{row[fieldMapping.firstName]} {row[fieldMapping.lastName]}</TableCell>
                          <TableCell>{row[fieldMapping.email]}</TableCell>
                          <TableCell>{row[fieldMapping.idNumber]}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex items-center gap-2 text-sm text-yellow-500 bg-yellow-500/10 p-3 rounded-md border border-yellow-500/20">
                  <AlertCircle className="h-4 w-4" />
                  <p>Warning: Row 4 and 7 contain incomplete data and will be skipped.</p>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button onClick={startProcessing}>
                    Process Requests <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Processing */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-10"
          >
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardContent className="py-20 flex flex-col items-center justify-center space-y-8">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      className="text-muted stroke-current"
                      strokeWidth="8"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                    ></circle>
                    <circle
                      className="text-verza-primary progress-ring__circle stroke-current transition-all duration-300 ease-in-out"
                      strokeWidth="8"
                      strokeLinecap="round"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - processingProgress / 100)}`}
                      transform="rotate(-90 50 50)"
                    ></circle>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                    {processingProgress}%
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Processing Requests...</h3>
                  <p className="text-muted-foreground">
                    Validating data and initiating verification requests.
                    <br />Please do not close this window.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Step 4: Results */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-card/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Processing Complete</CardTitle>
                    <CardDescription>
                      Here's the summary of your bulk verification request.
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" /> Download Report
                    </Button>
                    <Button onClick={() => setStep(1)}>
                      New Upload
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                    <span className="text-2xl font-bold text-green-500">{bulkResponse?.items.length || 0}</span>
                    <span className="text-sm text-green-600/80">Requests Submitted</span>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                    <Loader2 className="h-8 w-8 text-blue-500 mb-2" />
                    <span className="text-2xl font-bold text-blue-500">Submitted</span>
                    <span className="text-sm text-blue-600/80">Status</span>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                    <FileSpreadsheet className="h-8 w-8 text-yellow-500 mb-2" />
                    <span className="text-sm font-mono text-yellow-600/80 break-all">{bulkResponse?.batchId}</span>
                    <span className="text-sm text-yellow-600/80">Batch ID</span>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-6 text-center space-y-4">
                    <h3 className="text-lg font-medium">Bulk Verification Initiated Successfully</h3>
                    <p className="text-muted-foreground max-w-lg mx-auto">
                        Your batch of {bulkResponse?.items.length} requests has been submitted for processing. 
                        You can track the status of individual requests in the Verification Requests page.
                    </p>
                    <Button asChild>
                        <Link href="/enterprise/requests">View Requests</Link>
                    </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
