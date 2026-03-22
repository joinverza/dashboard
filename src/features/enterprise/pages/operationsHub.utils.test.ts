import { calculateQuotaPercent, parseCsvText, toCsvErrorReport } from './operationsHub.utils';

describe('operationsHub.utils', () => {
  it('parses CSV rows into keyed objects', () => {
    const rows = parseCsvText('firstName,lastName,country\nAda,Lovelace,GB\nGrace,Hopper,US');
    expect(rows).toEqual([
      { firstName: 'Ada', lastName: 'Lovelace', country: 'GB' },
      { firstName: 'Grace', lastName: 'Hopper', country: 'US' },
    ]);
  });

  it('returns empty for CSV without data rows', () => {
    expect(parseCsvText('a,b,c')).toEqual([]);
  });

  it('fills missing CSV cells with empty string', () => {
    const rows = parseCsvText('firstName,lastName,country\nAda,Lovelace');
    expect(rows).toEqual([{ firstName: 'Ada', lastName: 'Lovelace', country: '' }]);
  });

  it('builds escaped CSV error report output', () => {
    const csv = toCsvErrorReport([{ row: 3, field: 'country', message: 'invalid "ISO" value', severity: 'error' }]);
    expect(csv).toContain('row,field,message,severity');
    expect(csv).toContain('3,country,"invalid ""ISO"" value",error');
  });

  it('calculates quota percentage safely', () => {
    expect(calculateQuotaPercent(45, 90)).toBe(50);
    expect(calculateQuotaPercent(120, 100)).toBe(100);
    expect(calculateQuotaPercent(12, 0)).toBe(0);
  });
});
