import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AlertAndAccountOpsPanel from './AlertAndAccountOpsPanel';

const { errorToast, successToast, serviceMock, getBankingErrorMessageMock } = vi.hoisted(() => ({
  successToast: vi.fn(),
  errorToast: vi.fn(),
  serviceMock: {
    getAlertDetails: vi.fn(),
    investigateAlert: vi.fn(),
    resolveAlert: vi.fn(),
    verifyBankAccount: vi.fn(),
    instantVerifyBankAccount: vi.fn(),
    verifyMicroDeposits: vi.fn(),
    getGeographicalAnalytics: vi.fn(),
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

describe('AlertAndAccountOpsPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    serviceMock.getAlertDetails.mockResolvedValue({ id: 'a1', type: 'alert', title: 'High risk', message: 'Flagged', createdAt: '2026-04-08T00:00:00.000Z', read: false });
    serviceMock.investigateAlert.mockResolvedValue({ status: 'investigating' });
    serviceMock.resolveAlert.mockResolvedValue({ status: 'resolved' });
    serviceMock.verifyBankAccount.mockResolvedValue({ verificationId: 'v1', status: 'pending' });
    serviceMock.instantVerifyBankAccount.mockResolvedValue({ verificationId: 'v2', status: 'verified' });
    serviceMock.verifyMicroDeposits.mockResolvedValue({ verificationId: 'v3', status: 'pending' });
    serviceMock.getGeographicalAnalytics.mockResolvedValue([{ region: 'US', percentage: 70 }]);
  });

  it('handles alert investigate/resolve flows', async () => {
    render(<AlertAndAccountOpsPanel />);
    await userEvent.type(screen.getByLabelText(/Alert ID/i), 'alert-123');
    await userEvent.type(screen.getByLabelText(/Analyst/i), 'ops@bank.com');
    await userEvent.type(screen.getByLabelText(/Notes/i), 'review started');

    await userEvent.click(screen.getByRole('button', { name: /investigate/i }));
    await waitFor(() => expect(serviceMock.investigateAlert).toHaveBeenCalledWith('alert-123', { analyst: 'ops@bank.com', notes: 'review started' }));

    await userEvent.click(screen.getByRole('button', { name: /resolve/i }));
    await waitFor(() => expect(serviceMock.resolveAlert).toHaveBeenCalled());
  });

  it('executes account verification methods', async () => {
    render(<AlertAndAccountOpsPanel />);
    await userEvent.type(screen.getByLabelText(/Customer ID/i), 'cust-1');
    await userEvent.type(screen.getByLabelText(/Account Holder/i), 'Jane Doe');
    await userEvent.type(screen.getByLabelText(/Account Number/i), '1234567890');
    await userEvent.type(screen.getByLabelText(/Routing Number/i), '110000000');
    await userEvent.type(screen.getByLabelText(/Verification Method/i), 'micro_deposits');
    await userEvent.type(screen.getByLabelText(/Public Token/i), 'public-xyz');

    await userEvent.click(screen.getByRole('button', { name: /verify account/i }));
    await waitFor(() => expect(serviceMock.verifyBankAccount).toHaveBeenCalled());

    await userEvent.click(screen.getByRole('button', { name: /instant verify/i }));
    await waitFor(() => expect(serviceMock.instantVerifyBankAccount).toHaveBeenCalled());

    await userEvent.click(screen.getByRole('button', { name: /micro deposits/i }));
    await waitFor(() => expect(serviceMock.verifyMicroDeposits).toHaveBeenCalled());
  });

  it('loads geographical analytics', async () => {
    render(<AlertAndAccountOpsPanel />);
    await userEvent.click(screen.getByRole('button', { name: /load geographical analytics/i }));
    await waitFor(() => expect(serviceMock.getGeographicalAnalytics).toHaveBeenCalledTimes(1));
    expect(screen.getByText('US')).toBeInTheDocument();
  });

  it('shows error toast on service failures', async () => {
    serviceMock.getGeographicalAnalytics.mockRejectedValueOnce(new Error('boom'));
    render(<AlertAndAccountOpsPanel />);
    await userEvent.click(screen.getByRole('button', { name: /load geographical analytics/i }));
    await waitFor(() => {
      expect(getBankingErrorMessageMock).toHaveBeenCalled();
      expect(errorToast).toHaveBeenCalled();
    });
  });
});
