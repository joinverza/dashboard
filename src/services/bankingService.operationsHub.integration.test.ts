import { bankingService } from './bankingService';

const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

describe('bankingService operations hub integration', () => {
  afterEach(() => {
    vi.restoreAllMocks();
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
});
