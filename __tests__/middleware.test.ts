jest.mock('next/server', () => ({
  NextResponse: {
    redirect: jest.fn((url: URL) => ({ status: 307, headers: { get: (k: string) => k === 'location' ? url.toString() : null } })),
    next: jest.fn(() => ({ status: 200 })),
  },
  NextRequest: jest.fn(),
}));

import { config } from '../middleware';

describe('middleware config', () => {
  it('protects /orders routes', () => {
    expect(config.matcher).toContain('/orders/:path*');
  });

  it('protects /checkout routes', () => {
    expect(config.matcher).toContain('/checkout/:path*');
  });

  it('protects /admin routes', () => {
    expect(config.matcher).toContain('/admin/:path*');
  });

  it('has exactly 3 protected matchers', () => {
    expect(config.matcher).toHaveLength(3);
  });
});
