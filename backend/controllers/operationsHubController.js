import { operationsHubService } from '../services/operationsHubService.js';

export const operationsHubController = {
  validateBulk(req) {
    return operationsHubService.validateBulkRows(Array.isArray(req.rows) ? req.rows : []);
  },
  importBulk(req) {
    return operationsHubService.importRows(Array.isArray(req.rows) ? req.rows : []);
  },
  simulateRisk(req) {
    return operationsHubService.simulateRisk(req);
  },
  getLicenseUsage() {
    return {
      planName: 'Enterprise',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      monthlyQuota: 10000,
      usedQuota: 4200,
      slaUptime: 99.95,
      anomalyAlerts: [],
    };
  },
};
