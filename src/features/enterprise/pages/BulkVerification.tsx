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

  const downloadFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  const downloadTemplate = () => {
    const template = [
      'first_name,last_name,email,id_number,dob',
      'Jane,Doe,jane.doe@example.com,US123456,1994-06-11',
    ].join('\n');
    downloadFile('bulk-verification-template.csv', template, 'text/csv;charset=utf-8;');
  };

  const downloadReport = () => {
    if (!bulkResponse) return;
    const rows = bulkResponse.items.map((item) =>
      [bulkResponse.batchId, item.requestId, item.verificationId].join(','),
    );
    const content = ['batch_id,request_id,verification_id', ...rows].join('\n');
    downloadFile(`bulk-verification-report-${bulkResponse.batchId}.csv`, content, 'text/csv;charset=utf-8;');
  };

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
          <h1 className="text-3xl font-bold tracking-tight text-ent-text">
            Bulk Verification
          </h1>
          <p className="text-verza-gray mt-1">
            Upload and process multiple verification requests at once
          </p>
        </div>
        <Button 
          variant="outline" 
          className="gap-2 border-ent-border bg-ent-text/10 text-ent-text hover:bg-ent-text/10" 
          onClick={downloadTemplate}
        >
          <Download className="h-4 w-4" />
          Download Template
        </Button>
      </div>

      {/* Progress Steps */}
      <div className="relative mb-10">
        <div className="absolute top-5 left-0 right-0 h-[2px] bg-ent-text/10 -z-10"></div>
        <div className="flex justify-between max-w-3xl mx-auto">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex flex-col items-center gap-3 bg-[#06140F] px-4">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold transition-all duration-500 ${
                  step >= s 
                    ? 'bg-verza-emerald text-[#06140F] border-verza-emerald shadow-[0_0_20px_rgba(30,215,96,0.3)]' 
                    : 'bg-ent-muted text-verza-gray/40 border-ent-border'
                }`}
              >
                {step > s ? <CheckCircle className="h-6 w-6" /> : s}
              </div>
              <span className={`text-[10px] uppercase tracking-widest font-bold ${step >= s ? 'text-verza-emerald' : 'text-verza-gray/30'}`}>
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
            <div className="enterprise-card rounded-2xl p-8">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-ent-text">Upload File</h2>
                <p className="text-sm text-verza-gray mt-1">
                  Upload a CSV or Excel file containing the verification requests.
                </p>
              </div>
              <div className="space-y-6">
                <div 
                  className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors ${
                    file ? 'border-verza-emerald/50 bg-verza-emerald/5' : 'border-ent-border hover:border-verza-emerald/50 hover:bg-ent-text/10'
                  }`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  {file ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 rounded-full bg-verza-emerald/10 flex items-center justify-center mx-auto text-verza-emerald border border-verza-emerald/20">
                        <FileSpreadsheet className="h-8 w-8" />
                      </div>
                      <div>
                        <p className="font-medium text-lg text-ent-text">{file.name}</p>
                        <p className="text-sm text-verza-gray">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => setFile(null)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                        <X className="h-4 w-4 mr-2" /> Remove
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-ent-text/10 flex items-center justify-center mb-4 border border-ent-border">
                        <Upload className="h-8 w-8 text-verza-gray" />
                      </div>
                      <h3 className="font-medium text-lg mb-1 text-ent-text">Drag and drop your file here</h3>
                      <p className="text-sm text-verza-gray mb-6">
                        Supported formats: .csv, .xls, .xlsx (Max 10MB)
                      </p>
                      <div className="relative">
                        <Button variant="outline" className="border-ent-border bg-ent-text/10 text-ent-text hover:bg-ent-text/10">Browse Files</Button>
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
                  <Button onClick={startUpload} disabled={!file || isUploading} className="bg-verza-emerald text-[#06140F] hover:bg-verza-emerald/90 transition-all rounded-full px-6">
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
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Map Fields */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="enterprise-card rounded-2xl p-8">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-ent-text">Map Fields</h2>
                <p className="text-sm text-verza-gray mt-1">
                  Map the columns from your file to the corresponding Ontiver fields.
                </p>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-verza-gray">First Name Column</Label>
                      <Select value={fieldMapping.firstName} onValueChange={(v) => setFieldMapping({...fieldMapping, firstName: v})}>
                        <SelectTrigger className="bg-ent-muted border-ent-border text-ent-text">
                          <SelectValue placeholder="Select column" />
                        </SelectTrigger>
                        <SelectContent className="bg-ent-card border-ent-border text-ent-text">
                          {headers.map(h => (
                            <SelectItem key={h} value={h}>{h}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-verza-gray">Email Column</Label>
                      <Select value={fieldMapping.email} onValueChange={(v) => setFieldMapping({...fieldMapping, email: v})}>
                        <SelectTrigger className="bg-ent-muted border-ent-border text-ent-text">
                          <SelectValue placeholder="Select column" />
                        </SelectTrigger>
                        <SelectContent className="bg-ent-card border-ent-border text-ent-text">
                          {headers.map(h => (
                            <SelectItem key={h} value={h}>{h}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-verza-gray">Document ID Column</Label>
                      <Select value={fieldMapping.idNumber} onValueChange={(v) => setFieldMapping({...fieldMapping, idNumber: v})}>
                        <SelectTrigger className="bg-ent-muted border-ent-border text-ent-text">
                          <SelectValue placeholder="Select column" />
                        </SelectTrigger>
                        <SelectContent className="bg-ent-card border-ent-border text-ent-text">
                          {headers.map(h => (
                            <SelectItem key={h} value={h}>{h}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-verza-gray">Last Name Column</Label>
                      <Select value={fieldMapping.lastName} onValueChange={(v) => setFieldMapping({...fieldMapping, lastName: v})}>
                        <SelectTrigger className="bg-ent-muted border-ent-border text-ent-text">
                          <SelectValue placeholder="Select column" />
                        </SelectTrigger>
                        <SelectContent className="bg-ent-card border-ent-border text-ent-text">
                          {headers.map(h => (
                            <SelectItem key={h} value={h}>{h}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-ent-border overflow-hidden bg-ent-text/5">
                  <Table>
                    <TableHeader className="bg-ent-muted">
                      <TableRow className="border-ent-border hover:bg-transparent">
                        <TableHead className="text-verza-gray font-medium">Mapped Name</TableHead>
                        <TableHead className="text-verza-gray font-medium">Mapped Email</TableHead>
                        <TableHead className="text-verza-gray font-medium">Mapped ID</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedData.slice(0, 5).map((row, i) => (
                        <TableRow key={i} className="border-ent-border hover:bg-ent-muted">
                          <TableCell className="text-ent-text">{row[fieldMapping.firstName]} {row[fieldMapping.lastName]}</TableCell>
                          <TableCell className="text-ent-text">{row[fieldMapping.email]}</TableCell>
                          <TableCell className="text-ent-text">{row[fieldMapping.idNumber]}</TableCell>
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
                  <Button variant="outline" onClick={() => setStep(1)} className="border-ent-border text-verza-gray hover:text-ent-text">Back</Button>
                  <Button onClick={startProcessing} className="bg-verza-emerald text-[#06140F] hover:bg-verza-emerald/90 rounded-full px-6">
                    Process Requests <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
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
            <div className="enterprise-card rounded-2xl">
              <div className="py-20 flex flex-col items-center justify-center space-y-8">
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
                  <h3 className="text-xl font-bold mb-2 text-ent-text">Processing Requests...</h3>
                  <p className="text-verza-gray">
                    Validating data and initiating verification requests.
                    <br />Please do not close this window.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: Results */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="enterprise-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-ent-text">Processing Complete</h2>
                  <p className="text-sm text-verza-gray mt-1">
                    Here's the summary of your bulk verification request.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={downloadReport} disabled={!bulkResponse} className="bg-ent-text/10 border-ent-border hover:bg-ent-text/10 text-ent-text">
                    <Download className="h-4 w-4 mr-2" /> Download Report
                  </Button>
                  <Button onClick={() => setStep(1)} className="bg-verza-emerald text-[#06140F] hover:bg-verza-emerald/90">
                    New Upload
                  </Button>
                </div>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-verza-emerald/10 border border-verza-emerald/20 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                    <CheckCircle className="h-8 w-8 text-verza-emerald mb-2" />
                    <span className="text-2xl font-bold text-verza-emerald">{bulkResponse?.items.length || 0}</span>
                    <span className="text-sm text-verza-emerald/80">Requests Submitted</span>
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

                 <div className="bg-ent-muted border border-ent-border rounded-2xl p-8 text-center space-y-6">
                    <h3 className="text-lg font-medium text-ent-text">Bulk Verification Initiated Successfully</h3>
                    <p className="text-verza-gray max-w-lg mx-auto">
                        Your batch of {bulkResponse?.items.length} requests has been submitted for processing. 
                        You can track the status of individual requests in the Verification Requests page.
                    </p>
                    <Button asChild className="bg-verza-emerald text-[#06140F] hover:bg-verza-emerald/90 rounded-full px-10">
                        <Link href="/enterprise/requests">View Requests</Link>
                    </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
