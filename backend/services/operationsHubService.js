export const operationsHubService = {
  validateBulkRows(rows) {
    const issues = [];
    rows.forEach((row, index) => {
      if (!row.firstName) issues.push({ row: index + 1, field: 'firstName', message: 'Missing firstName', severity: 'error' });
      if (!row.lastName) issues.push({ row: index + 1, field: 'lastName', message: 'Missing lastName', severity: 'error' });
      if (!/^[A-Z]{2}$/.test(String(row.country || '').toUpperCase())) {
        issues.push({ row: index + 1, field: 'country', message: 'Invalid ISO country code', severity: 'error' });
      }
    });
    return {
      validationId: `val_${Date.now()}`,
      totalRows: rows.length,
      validRows: Math.max(0, rows.length - issues.length),
      invalidRows: issues.length,
      progress: 100,
      issues,
    };
  },
  importRows(rows) {
    return {
      importJobId: `imp_${Date.now()}`,
      acceptedRows: rows.length,
      rejectedRows: 0,
      status: 'queued',
    };
  },
  simulateRisk(payload) {
    const score = Math.min(
      100,
      Math.round(
        Number(payload.customerProfile.sanctionsHits || 0) * Number(payload.weights.sanctions || 0) +
          Number(payload.customerProfile.priorAlerts || 0) * Number(payload.weights.identity || 0) +
          (Number(payload.customerProfile.transactionAmount || 0) / 1000) * Number(payload.weights.transaction || 0),
      ),
    );
    return {
      score,
      riskLevel: score >= 75 ? 'high' : score >= 40 ? 'medium' : 'low',
      factors: [
        { factor: 'sanctions_hits', contribution: Number(payload.customerProfile.sanctionsHits || 0) * Number(payload.weights.sanctions || 0) },
        { factor: 'prior_alerts', contribution: Number(payload.customerProfile.priorAlerts || 0) * Number(payload.weights.identity || 0) },
        { factor: 'transaction_amount', contribution: (Number(payload.customerProfile.transactionAmount || 0) / 1000) * Number(payload.weights.transaction || 0) },
      ],
      recommendation: score >= 75 ? 'reject_or_edd' : score >= 40 ? 'manual_review' : 'auto_approve',
    };
  },
};
