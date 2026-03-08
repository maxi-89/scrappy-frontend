import { formatCurrency } from '@/lib/utils/formatCurrency';

describe('formatCurrency', () => {
  it('formats a number as USD currency by default', () => {
    const result = formatCurrency(10.5);
    expect(result).toMatch(/\$10\.50/);
  });

  it('formats zero correctly', () => {
    const result = formatCurrency(0);
    expect(result).toMatch(/\$0\.00/);
  });

  it('formats large amounts correctly', () => {
    const result = formatCurrency(1234.99);
    expect(result).toMatch(/\$1,234\.99/);
  });

  it('accepts a custom currency', () => {
    const result = formatCurrency(50, 'EUR');
    expect(result).toContain('50');
  });
});
