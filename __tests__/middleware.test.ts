jest.mock('@auth0/nextjs-auth0/edge', () => ({
  withMiddlewareAuthRequired: jest.fn(() => jest.fn()),
}));

import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';
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
});

describe('middleware default export', () => {
  it('calls withMiddlewareAuthRequired', () => {
    expect(withMiddlewareAuthRequired).toHaveBeenCalled();
  });
});
