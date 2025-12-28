import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileSpreadsheet, Download, CheckCircle, AlertCircle, ArrowRight, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default function BulkVerification() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingProgress, setProcessingProgress] = useState(0);

  // Mock data for mapping preview
  const previewData = [
    { col1: "John Doe", col2: "john@example.com", col3: "D123456", col4: "University Degree" },
    { col1: "Jane Smith", col2: "jane@example.com", col3: "D789012", col4: "Employment" },
    { col1: "Robert Johnson", col2: "robert@example.com", col3: "D345678", col4: "Professional Cert" },
  ];

  // Mock results data
  const resultsData = [
    { id: "REQ-2024-001", name: "John Doe", type: "University Degree", status: "success", message: "Verification initiated" },
    { id: "REQ-2024-002", name: "Jane Smith", type: "Employment", status: "failed", message: "Invalid document ID" },
    { id: "REQ-2024-003", name: "Robert Johnson", type: "Professional Cert", status: "success", message: "Verification initiated" },
    { id: "REQ-2024-004", name: "Sarah Williams", type: "Identity", status: "success", message: "Verification initiated" },
    { id: "REQ-2024-005", name: "Michael Brown", type: "Criminal Record", status: "warning", message: "Additional info needed" },
  ];

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
    // Simulate upload
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        setStep(2);
      }
    }, 200);
  };

  const startProcessing = () => {
    setStep(3);
    // Simulate processing
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setProcessingProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setStep(4);
      }
    }, 100);
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
                      <Label>Full Name Column</Label>
                      <Select defaultValue="col1">
                        <SelectTrigger>
                          <SelectValue placeholder="Select column" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="col1">Full Name (Column A)</SelectItem>
                          <SelectItem value="col2">Email (Column B)</SelectItem>
                          <SelectItem value="col3">Document ID (Column C)</SelectItem>
                          <SelectItem value="col4">Type (Column D)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Email Column</Label>
                      <Select defaultValue="col2">
                        <SelectTrigger>
                          <SelectValue placeholder="Select column" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="col1">Full Name (Column A)</SelectItem>
                          <SelectItem value="col2">Email (Column B)</SelectItem>
                          <SelectItem value="col3">Document ID (Column C)</SelectItem>
                          <SelectItem value="col4">Type (Column D)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Document ID Column</Label>
                      <Select defaultValue="col3">
                        <SelectTrigger>
                          <SelectValue placeholder="Select column" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="col1">Full Name (Column A)</SelectItem>
                          <SelectItem value="col2">Email (Column B)</SelectItem>
                          <SelectItem value="col3">Document ID (Column C)</SelectItem>
                          <SelectItem value="col4">Type (Column D)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Verification Type Column</Label>
                      <Select defaultValue="col4">
                        <SelectTrigger>
                          <SelectValue placeholder="Select column" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="col1">Full Name (Column A)</SelectItem>
                          <SelectItem value="col2">Email (Column B)</SelectItem>
                          <SelectItem value="col3">Document ID (Column C)</SelectItem>
                          <SelectItem value="col4">Type (Column D)</SelectItem>
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
                        <TableHead>Mapped Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell>{row.col1}</TableCell>
                          <TableCell>{row.col2}</TableCell>
                          <TableCell>{row.col3}</TableCell>
                          <TableCell>{row.col4}</TableCell>
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
                    <span className="text-2xl font-bold text-green-500">32</span>
                    <span className="text-sm text-green-600/80">Successful</span>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                    <X className="h-8 w-8 text-red-500 mb-2" />
                    <span className="text-2xl font-bold text-red-500">3</span>
                    <span className="text-sm text-red-600/80">Failed</span>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                    <AlertCircle className="h-8 w-8 text-yellow-500 mb-2" />
                    <span className="text-2xl font-bold text-yellow-500">5</span>
                    <span className="text-sm text-yellow-600/80">Warnings</span>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Request ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Message</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {resultsData.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-mono text-xs">{row.id}</TableCell>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.type}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              row.status === 'success' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                              row.status === 'failed' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                              'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                            }>
                              {row.status.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{row.message}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
