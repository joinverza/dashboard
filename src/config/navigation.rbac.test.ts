import { adminNavItems, enterpriseNavItems, managerNavItems } from './navigation';

const hasPath = (paths: string[], target: string): boolean => paths.includes(target);

describe('role navigation deep-links', () => {
  it('keeps enterprise verifications and operations hub visible', () => {
    const paths = enterpriseNavItems.map((item) => item.path);
    expect(hasPath(paths, '/enterprise/verifications')).toBe(true);
    expect(hasPath(paths, '/enterprise/tools')).toBe(true);
  });

  it('keeps manager deep-links for relocated features', () => {
    const paths = managerNavItems.map((item) => item.path);
    expect(hasPath(paths, '/manager/verifications')).toBe(true);
    expect(hasPath(paths, '/manager/tools')).toBe(true);
  });

  it('includes admin deep-links for auditor support and developer tooling', () => {
    const paths = adminNavItems.map((item) => item.path);
    expect(hasPath(paths, '/admin/tools/verifications')).toBe(true);
    expect(hasPath(paths, '/admin/tools/operations')).toBe(true);
    expect(hasPath(paths, '/admin/tools/auditor')).toBe(true);
    expect(hasPath(paths, '/admin/tools/support')).toBe(true);
    expect(hasPath(paths, '/admin/tools/developer')).toBe(true);
  });
});
