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
});
