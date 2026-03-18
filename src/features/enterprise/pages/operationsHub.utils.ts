export const parseCsvText = (csv: string): Array<Record<string, string>> => {
  const rows = csv.trim().split(/\r?\n/);
  if (rows.length <= 1) return [];
  const headers = rows[0].split(',').map((item) => item.trim());
  return rows.slice(1).filter(Boolean).map((row) => {
    const values = row.split(',').map((item) => item.trim());
    return headers.reduce<Record<string, string>>((acc, key, index) => {
      acc[key] = values[index] ?? '';
      return acc;
    }, {});
  });
};

export const toCsvErrorReport = (issues: Array<{ row: number; field: string; message: string; severity: string }>): string => {
  const header = 'row,field,message,severity';
  const body = issues.map((issue) => `${issue.row},${issue.field},"${issue.message.replace(/"/g, '""')}",${issue.severity}`).join('\n');
  return `${header}\n${body}`;
};

export const calculateQuotaPercent = (usedQuota: number, monthlyQuota: number): number => {
  if (monthlyQuota <= 0) return 0;
  return Math.min(100, Math.round((usedQuota / monthlyQuota) * 100));
};
