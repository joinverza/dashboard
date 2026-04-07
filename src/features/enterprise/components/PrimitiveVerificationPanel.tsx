import { useState } from 'react';
import { Camera, KeyRound, Loader2, RefreshCcw, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { bankingService, getBankingErrorMessage } from '@/services/bankingService';
import type { PrimitiveHealth, PrimitiveModelStatus, PrimitiveProxyTokenResponse } from '@/types/banking';

export default function PrimitiveVerificationPanel() {
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState<PrimitiveHealth | null>(null);
  const [modelStatus, setModelStatus] = useState<PrimitiveModelStatus | null>(null);
  const [cameras, setCameras] = useState<Array<Record<string, unknown>>>([]);
  const [config, setConfig] = useState<Record<string, unknown> | null>(null);
  const [documentType, setDocumentType] = useState('NIN');
  const [modelPath, setModelPath] = useState('');
  const [proxyToken, setProxyToken] = useState<PrimitiveProxyTokenResponse | null>(null);

  const loadPrimitiveSnapshot = async () => {
    setLoading(true);
    try {
      const [healthData, modelData, cameraData, configData] = await Promise.all([
        bankingService.getPrimitiveHealth(),
        bankingService.getPrimitiveModelStatus(),
        bankingService.getPrimitiveCameras(),
        bankingService.getPrimitiveConfig(),
      ]);
      setHealth(healthData);
      setModelStatus(modelData);
      setCameras(cameraData);
      setConfig(configData);
      toast.success('Primitive verification snapshot loaded');
    } catch (error) {
      toast.error(getBankingErrorMessage(error, 'Failed to load primitive verification status.'));
    } finally {
      setLoading(false);
    }
  };

  const issueProxyToken = async () => {
    setLoading(true);
    try {
      const tokenData = await bankingService.getPrimitiveProxyToken({
        documentType: documentType.trim() || undefined,
      });
      setProxyToken(tokenData);
      toast.success('Proxy token generated successfully');
    } catch (error) {
      toast.error(getBankingErrorMessage(error, 'Failed to issue proxy token.'));
    } finally {
      setLoading(false);
    }
  };

  const reloadModel = async () => {
    setLoading(true);
    try {
      const reloaded = await bankingService.reloadPrimitiveModel({
        model_path: modelPath.trim() ? modelPath.trim() : undefined,
      });
      setModelStatus(reloaded);
      toast.success('Primitive model reload triggered');
    } catch (error) {
      toast.error(getBankingErrorMessage(error, 'Failed to reload primitive model.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" />
          Primitive Verification Control Plane
        </CardTitle>
        <CardDescription>
          Operate primitive verification infrastructure with health, camera, model, and proxy-token tooling.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => void loadPrimitiveSnapshot()} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
            Load Snapshot
          </Button>
          <Button variant="outline" onClick={() => void reloadModel()} disabled={loading}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Reload Model
          </Button>
          <Button variant="secondary" onClick={() => void issueProxyToken()} disabled={loading}>
            <KeyRound className="mr-2 h-4 w-4" />
            Issue Proxy Token
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="primitive-document-type">Document Type</Label>
            <Input
              id="primitive-document-type"
              value={documentType}
              onChange={(event) => setDocumentType(event.target.value)}
              placeholder="NIN"
              aria-label="Document type for proxy token"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="primitive-model-path">Model Path (optional)</Label>
            <Input
              id="primitive-model-path"
              value={modelPath}
              onChange={(event) => setModelPath(event.target.value)}
              placeholder="/models/facenet.onnx"
              aria-label="Model path for reload"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-md border p-3 text-sm">
            <div className="font-medium mb-1">Health</div>
            <div>Status: {health?.status ?? 'unknown'}</div>
            <div>Ready: {health?.ready ? 'yes' : 'no'}</div>
          </div>
          <div className="rounded-md border p-3 text-sm">
            <div className="font-medium mb-1">Model</div>
            <div>Status: {modelStatus?.status ?? 'unknown'}</div>
            <div>Loaded: {modelStatus?.loaded ? 'yes' : 'no'}</div>
            <div>Version: {modelStatus?.modelVersion ?? 'n/a'}</div>
          </div>
        </div>

        <div className="rounded-md border p-3 text-sm">
          <div className="font-medium mb-1">Cameras</div>
          <div>{cameras.length} camera device(s) detected.</div>
        </div>

        <div className="rounded-md border p-3 text-sm">
          <div className="font-medium mb-1">Runtime Config</div>
          <pre className="overflow-auto text-xs">{JSON.stringify(config ?? {}, null, 2)}</pre>
        </div>

        <div className="rounded-md border p-3 text-sm">
          <div className="font-medium mb-1">Proxy Token</div>
          <div>Token: {typeof proxyToken?.token === 'string' ? proxyToken.token : 'n/a'}</div>
          <div>Expires: {typeof proxyToken?.expiresAt === 'string' ? proxyToken.expiresAt : 'n/a'}</div>
        </div>
      </CardContent>
    </Card>
  );
}
