import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from './Dashboard';
import { bankingService } from '@/services/bankingService';

vi.mock('@/features/auth/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: 'user-1',
      name: 'Alice Example',
    },
  }),
}));

vi.mock('../components/UserOnboarding', () => ({
  default: () => null,
}));

vi.mock('../components/QuickVerificationModal', () => ({
  default: () => null,
}));

describe('User dashboard integration', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  beforeEach(() => {
    queryClient.clear();
    window.localStorage.setItem('verza_user_onboarded', 'true');

    vi.spyOn(bankingService, 'getVerificationRequests').mockResolvedValue([
      {
        verificationId: 'ver-1',
        type: 'kyc_individual',
        status: 'verified',
        createdAt: '2026-03-29T10:00:00.000Z',
        updatedAt: '2026-03-29T10:05:00.000Z',
      },
      {
        verificationId: 'ver-2',
        type: 'document',
        status: 'pending',
        createdAt: '2026-03-29T11:00:00.000Z',
        updatedAt: '2026-03-29T11:05:00.000Z',
      },
    ]);
    vi.spyOn(bankingService, 'getUserWalletOverview').mockResolvedValue({
      balance: 1250,
      currency: 'USD',
      totalSpent: 320,
    });
    vi.spyOn(bankingService, 'getNotifications').mockResolvedValue([
      {
        id: 'note-1',
        title: 'Verification complete',
        message: 'Your identity verification is approved.',
        type: 'info',
        createdAt: '2026-03-29T12:00:00.000Z',
        read: false,
      },
    ]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it('renders live metrics, wallet data, and notifications from the API layer', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Verification complete/i)).toBeTruthy();
    });

    expect(screen.getByText(/Alice Example/i)).toBeTruthy();
    expect(screen.getByText(/USD 1,250/i)).toBeTruthy();
    expect(screen.getByText(/USD 320/i)).toBeTruthy();
    expect(screen.getByText(/KYC INDIVIDUAL/i)).toBeTruthy();
  });
});
