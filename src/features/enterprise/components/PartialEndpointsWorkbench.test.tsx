import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import PartialEndpointsWorkbench from './PartialEndpointsWorkbench';

const { errorToast, successToast, serviceMock, fetchJwksMetadataMock, rotateSigningKeyMock, getBankingErrorMessageMock } = vi.hoisted(() => ({
  successToast: vi.fn(),
  errorToast: vi.fn(),
  serviceMock: {
    getAnalytics: vi.fn(),
  },
  fetchJwksMetadataMock: vi.fn(),
  rotateSigningKeyMock: vi.fn(),
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

vi.mock('@/security/jwksClient', () => ({
  fetchJwksMetadata: fetchJwksMetadataMock,
  rotateSigningKey: rotateSigningKeyMock,
}));

describe('PartialEndpointsWorkbench', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    serviceMock.getAnalytics.mockResolvedValue({ revenue: 1200 });
    fetchJwksMetadataMock.mockResolvedValue({ keyCount: 2 });
    rotateSigningKeyMock.mockResolvedValue({ rotated: true, kid: 'kid-1' });
  });

  it('runs banking service operations with JSON args', async () => {
    render(<PartialEndpointsWorkbench />);
    const analyticsSearch = screen.getByLabelText(/Find operation/i);
    await userEvent.type(analyticsSearch, 'getAnalytics');
    const runButton = await screen.findByRole('button', { name: /Run/i });
    await userEvent.click(runButton);
    await waitFor(() => expect(serviceMock.getAnalytics).toHaveBeenCalled());
    expect(successToast).toHaveBeenCalled();
  });

  it('runs security operations for JWKS metadata', async () => {
    render(<PartialEndpointsWorkbench />);
    await userEvent.type(screen.getByLabelText(/Find operation/i), 'fetchJwksMetadata');
    await userEvent.click(await screen.findByRole('button', { name: /Run/i }));
    await waitFor(() => expect(fetchJwksMetadataMock).toHaveBeenCalledTimes(1));
  });

  it('handles invalid payload JSON gracefully', async () => {
    render(<PartialEndpointsWorkbench />);
    await userEvent.type(screen.getByLabelText(/Find operation/i), 'getAnalytics');
    const textarea = await screen.findByLabelText(/Args JSON/i);
    fireEvent.change(textarea, { target: { value: '{bad json' } });
    await userEvent.click(await screen.findByRole('button', { name: /Run/i }));
    expect(errorToast).toHaveBeenCalled();
  });
});
