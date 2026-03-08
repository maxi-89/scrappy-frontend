import { formatDate } from '@/lib/utils/formatDate';

describe('formatDate', () => {
  it('formats an ISO date string to a human readable date', () => {
    const result = formatDate('2024-01-15T10:30:00Z');
    expect(result).toMatch(/Jan(uary)?\s+15,?\s+2024/i);
  });

  it('returns a non-empty string for a valid ISO date', () => {
    const result = formatDate('2023-06-01T00:00:00Z');
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('handles end of year dates', () => {
    const result = formatDate('2023-12-31T23:59:59Z');
    expect(result).toMatch(/Dec(ember)?\s+31,?\s+2023/i);
  });
});
