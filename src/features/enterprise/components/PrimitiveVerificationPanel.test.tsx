import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import PrimitiveVerificationPanel from './PrimitiveVerificationPanel';

const {
  successToast,
  errorToast,
  serviceMock,
  getBankingErrorMessageMock,
} = vi.hoisted(() => ({
  successToast: vi.fn(),
  errorToast: vi.fn(),
  serviceMock: {
    getPrimitiveHealth: vi.fn(),
    getPrimitiveModelStatus: vi.fn(),
    getPrimitiveCameras: vi.fn(),
    getPrimitiveConfig: vi.fn(),
    getPrimitiveProxyToken: vi.fn(),
    reloadPrimitiveModel: vi.fn(),
  },
  getBankingErrorMessageMock: vi.fn(() => 'Request failed'),
}));

vi.mock('sonner', () => ({
  toast: {
    success: successToast,
    error: errorToast,
  },
}));

vi.mock('@/services/bankingService', () => ({
  bankingService: serviceMock,
  getBankingErrorMessage: getBankingErrorMessageMock,
}));

describe('PrimitiveVerificationPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    serviceMock.getPrimitiveHealth.mockResolvedValue({ status: 'ok', ready: true });
    serviceMock.getPrimitiveModelStatus.mockResolvedValue({ status: 'loaded', loaded: true, modelVersion: 'v1' });
    serviceMock.getPrimitiveCameras.mockResolvedValue([{ id: 'cam-1' }]);
    serviceMock.getPrimitiveConfig.mockResolvedValue({ mode: 'safe' });
    serviceMock.getPrimitiveProxyToken.mockResolvedValue({ token: 'proxy-token-1', expiresAt: '2026-04-08T00:00:00.000Z' });
    serviceMock.reloadPrimitiveModel.mockResolvedValue({ status: 'reloading', loaded: false, modelVersion: 'v2' });
  });

  it('loads primitive snapshot and renders health/model/camera data', async () => {
    render(<PrimitiveVerificationPanel />);
    await userEvent.click(screen.getByRole('button', { name: /load snapshot/i }));

    await waitFor(() => {
      expect(serviceMock.getPrimitiveHealth).toHaveBeenCalledTimes(1);
      expect(serviceMock.getPrimitiveModelStatus).toHaveBeenCalledTimes(1);
      expect(serviceMock.getPrimitiveCameras).toHaveBeenCalledTimes(1);
      expect(serviceMock.getPrimitiveConfig).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByText(/Status: ok/)).toBeInTheDocument();
    expect(screen.getByText(/Loaded: yes/)).toBeInTheDocument();
    expect(screen.getByText(/1 camera device\(s\) detected\./)).toBeInTheDocument();
  });

  it('issues proxy token using selected document type', async () => {
    render(<PrimitiveVerificationPanel />);
    const input = screen.getByLabelText(/Document type for proxy token/i);
    await userEvent.clear(input);
    await userEvent.type(input, 'PASSPORT');
    await userEvent.click(screen.getByRole('button', { name: /issue proxy token/i }));

    await waitFor(() => {
      expect(serviceMock.getPrimitiveProxyToken).toHaveBeenCalledWith({ documentType: 'PASSPORT' });
    });
    expect(screen.getByText(/proxy-token-1/)).toBeInTheDocument();
  });

  it('reloads model with optional model path', async () => {
    render(<PrimitiveVerificationPanel />);
    const modelPathInput = screen.getByLabelText(/Model path for reload/i);
    await userEvent.type(modelPathInput, '/models/new.onnx');
    await userEvent.click(screen.getByRole('button', { name: /reload model/i }));

    await waitFor(() => {
      expect(serviceMock.reloadPrimitiveModel).toHaveBeenCalledWith({ model_path: '/models/new.onnx' });
    });
  });

  it('shows user feedback when service fails', async () => {
    serviceMock.getPrimitiveHealth.mockRejectedValueOnce(new Error('boom'));
    render(<PrimitiveVerificationPanel />);
    await userEvent.click(screen.getByRole('button', { name: /load snapshot/i }));

    await waitFor(() => {
      expect(getBankingErrorMessageMock).toHaveBeenCalled();
      expect(errorToast).toHaveBeenCalled();
    });
  });
});
