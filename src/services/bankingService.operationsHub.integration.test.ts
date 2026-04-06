import { bankingService } from './bankingService';
import { saveSession } from './authService';

const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

describe('bankingService operations hub integration', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    saveSession(null);
  });

  it('falls back for risk simulation when backend route is missing', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse(404, { error: { message: 'not found' } })));
    const result = await bankingService.simulateRiskScore({
      customerProfile: {
        customerType: 'retail',
        country: 'US',
        transactionAmount: 2200,
        sanctionsHits: 1,
        priorAlerts: 2,
      },
      weights: {
        identity: 20,
        sanctions: 30,
        transaction: 20,
        geography: 15,
        device: 15,
      },
    });
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(['low', 'medium', 'high']).toContain(result.riskLevel);
    expect(result.factors.length).toBeGreaterThan(0);
  });

  it('falls back for license usage when backend route is missing', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => jsonResponse(404, { error: { message: 'not found' } })));
    const metrics = await bankingService.getLicenseUsageMetrics();
    expect(metrics.planName).toBeTruthy();
    expect(metrics.monthlyQuota).toBeGreaterThan(0);
    expect(metrics.slaUptime).toBeGreaterThan(0);
  });

  it('sends plan change request payload to backend', async () => {
    const fetchMock = vi.fn(async (_url: string | URL | Request, init?: RequestInit) =>
      jsonResponse(200, { success: true, data: { status: 'accepted', echo: init?.body ? JSON.parse(String(init.body)) : {} } }),
    );
    vi.stubGlobal('fetch', fetchMock);
    const result = await bankingService.changeLicensePlan('growth');
    expect(result.status).toBe('accepted');
    expect(fetchMock).toHaveBeenCalled();
  });

  it('refreshes the access token after a 401 response and retries the request', async () => {
    saveSession({
      accessToken: 'expired-token',
      refreshToken: 'refresh-token',
      expiresAt: Date.now() + 60_000,
      user: {
        id: 'user-1',
        email: 'ops@example.com',
        role: 'admin',
        name: 'Ops Admin',
      },
      permissions: ['admin:read'],
    });

    const fetchMock = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
      const requestUrl = String(url);
      if (requestUrl.includes('/auth/refresh')) {
        return jsonResponse(200, {
          success: true,
          requestId: 'req-refresh',
          data: {
            accessToken: 'fresh-token',
            refreshToken: 'refresh-token',
            tokenType: 'Bearer',
            expiresIn: 3600,
            user: {
              id: 'user-1',
              email: 'ops@example.com',
              role: 'admin',
            },
            permissions: ['admin:read'],
          },
        });
      }

      const authHeader = init?.headers ? (init.headers as Record<string, string>).Authorization : '';
      if (authHeader === 'Bearer expired-token') {
        return jsonResponse(401, { error: { message: 'expired' } });
      }

      return jsonResponse(200, {
        success: true,
        data: {
          totalVerifications: 10,
          approved: 7,
          rejected: 1,
          pending: 2,
          successful: 7,
          failed: 1,
          averageTime: 4200,
          dailyBreakdown: [],
        },
      });
    });

    vi.stubGlobal('fetch', fetchMock);
    const result = await bankingService.getVerificationStats();

    expect(result.totalVerifications).toBe(10);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it('normalizes paged alert responses from the admin alerts endpoint', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        jsonResponse(200, {
          success: true,
          data: {
            items: [
              {
                id: 'alert-1',
                title: 'Message queue latency',
                message: 'Latency above 900ms',
                type: 'alert',
                createdAt: '2026-03-29T12:00:00.000Z',
                read: false,
              },
            ],
            meta: {
              page: 1,
              limit: 20,
              total: 1,
              totalPages: 1,
            },
          },
        }),
      ),
    );

    const result = await bankingService.getAdminAlerts();

    expect(result.items).toHaveLength(1);
    expect(result.meta.total).toBe(1);
    expect(result.items[0]?.title).toBe('Message queue latency');
  });

  it('uses compapi-aligned audit export endpoint', async () => {
    const fetchMock = vi.fn(async (url: string | URL | Request) => {
      const requestUrl = String(url);
      if (requestUrl.includes('/api/v1/banking/audit/export')) {
        return jsonResponse(200, {
          success: true,
          data: {
            exportId: 'exp-1',
            signature: 'sig-1',
            downloadUrl: 'https://example.com/audit.csv',
          },
        });
      }
      return jsonResponse(404, { error: { message: 'not found' } });
    });
    vi.stubGlobal('fetch', fetchMock);
    const result = await bankingService.exportSignedAuditLogs({ from: '2026-01-01', to: '2026-01-31' });
    expect(result.exportId).toBe('exp-1');
    expect(fetchMock).toHaveBeenCalled();
    expect(fetchMock.mock.calls.some((call) => String(call[0]).includes('/api/v1/banking/audit/export'))).toBe(true);
  });

  it('uses compapi staking endpoints and action payload contract', async () => {
    const fetchMock = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
      const requestUrl = String(url);
      if (requestUrl.includes('/api/v1/banking/verifier/staking') && (!init?.method || init.method === 'GET')) {
        return jsonResponse(200, {
          success: true,
          data: {
            stakedAmount: 1200,
            availableAmount: 800,
            apy: 8.5,
            estimatedMonthlyReward: 12,
            unstakePeriodDays: 14,
            currentTier: 'Tier 2',
            history: [{ id: 'h1', action: 'stake', amount: 100, status: 'completed', createdAt: '2026-01-01T00:00:00.000Z' }],
          },
        });
      }
      if (requestUrl.includes('/api/v1/banking/verifier/staking/actions') && init?.method === 'POST') {
        return jsonResponse(200, { success: true, data: { status: 'queued' } });
      }
      return jsonResponse(404, { error: { message: 'not found' } });
    });
    vi.stubGlobal('fetch', fetchMock);

    const overview = await bankingService.getVerifierStakingOverview();
    const history = await bankingService.listVerifierStakingHistory();
    const stakeResult = await bankingService.stakeVerifierTokens({ amount: 50 });
    const unstakeResult = await bankingService.unstakeVerifierTokens({ amount: 20 });

    expect(overview.currentTier).toBe('Tier 2');
    expect(history.length).toBe(1);
    expect(stakeResult.status).toBe('queued');
    expect(unstakeResult.status).toBe('queued');
    expect(
      fetchMock.mock.calls.some(
        (call) =>
          String(call[0]).includes('/api/v1/banking/verifier/staking/actions') &&
          String((call[1] as RequestInit | undefined)?.body || '').includes('"action":"stake"'),
      ),
    ).toBe(true);
    expect(
      fetchMock.mock.calls.some(
        (call) =>
          String(call[0]).includes('/api/v1/banking/verifier/staking/actions') &&
          String((call[1] as RequestInit | undefined)?.body || '').includes('"action":"unstake"'),
      ),
    ).toBe(true);
  });

  it('uses verifier help and admin moderation endpoints from compapi', async () => {
    const fetchMock = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
      const requestUrl = String(url);
      if (requestUrl.includes('/api/v1/banking/verifier/help/articles')) {
        return jsonResponse(200, { success: true, data: { items: [{ id: 'a1', title: 'How to verify', category: 'general', content: '...' }] } });
      }
      if (requestUrl.includes('/api/v1/banking/verifier/help/tickets') && (!init?.method || init.method === 'GET')) {
        return jsonResponse(200, { success: true, data: { items: [{ id: 't1', subject: 'Issue', status: 'open', createdAt: '2026-01-01T00:00:00.000Z' }] } });
      }
      if (requestUrl.includes('/api/v1/banking/verifier/help/tickets') && init?.method === 'POST') {
        return jsonResponse(200, { success: true, data: { id: 't2', subject: 'New issue', status: 'open', createdAt: '2026-01-01T00:00:00.000Z' } });
      }
      if (requestUrl.includes('/api/v1/banking/admin/content') && (!init?.method || init.method === 'GET')) {
        return jsonResponse(200, { success: true, data: { items: [{ id: 'c1', type: 'message', author: 'user-1', content: 'hello', reason: 'spam', severity: 'high', status: 'pending', createdAt: '2026-01-01T00:00:00.000Z' }] } });
      }
      if (requestUrl.includes('/api/v1/banking/admin/content/c1/moderate') && init?.method === 'POST') {
        return jsonResponse(200, { success: true, data: { status: 'removed' } });
      }
      return jsonResponse(404, { error: { message: 'not found' } });
    });
    vi.stubGlobal('fetch', fetchMock);

    const articles = await bankingService.listSupportArticles();
    const tickets = await bankingService.listSupportTickets({ page: 1, limit: 5 });
    const createdTicket = await bankingService.createSupportTicket({ subject: 'New issue', message: 'Need help' });
    const queue = await bankingService.listModerationQueue({ status: 'pending' });
    const action = await bankingService.moderateContent('c1', { action: 'remove' });

    expect(articles.length).toBeGreaterThanOrEqual(1);
    expect(tickets.items.length).toBeGreaterThanOrEqual(1);
    expect(createdTicket.ticketId).toBe('t2');
    expect(queue.items.length).toBeGreaterThanOrEqual(1);
    expect(action.status).toBe('removed');
    expect(fetchMock.mock.calls.some((call) => String(call[0]).includes('/api/v1/banking/verifier/help/articles'))).toBe(true);
    expect(fetchMock.mock.calls.some((call) => String(call[0]).includes('/api/v1/banking/verifier/help/tickets'))).toBe(true);
    expect(fetchMock.mock.calls.some((call) => String(call[0]).includes('/api/v1/banking/admin/content/c1/moderate'))).toBe(true);
  });
});
