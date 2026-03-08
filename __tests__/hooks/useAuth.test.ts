import { renderHook } from '@testing-library/react';

jest.mock('@auth0/nextjs-auth0/client', () => ({
  useUser: jest.fn(),
}));

import { useUser } from '@auth0/nextjs-auth0/client';
import { useAuth } from '@/hooks/useAuth';

const mockUseUser = useUser as jest.Mock;

describe('useAuth', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns isLoading true when user is loading', () => {
    mockUseUser.mockReturnValue({ user: undefined, isLoading: true });
    const { result } = renderHook(() => useAuth());
    expect(result.current.isLoading).toBe(true);
  });

  it('returns isAuthenticated false when user is null', () => {
    mockUseUser.mockReturnValue({ user: null, isLoading: false });
    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('returns isAuthenticated true when user is present', () => {
    mockUseUser.mockReturnValue({
      user: { sub: 'auth0|123', name: 'Test User' },
      isLoading: false,
    });
    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('returns user object when present', () => {
    const mockUser = { sub: 'auth0|123', name: 'Test User' };
    mockUseUser.mockReturnValue({ user: mockUser, isLoading: false });
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toEqual(mockUser);
  });

  it('returns null user when not authenticated', () => {
    mockUseUser.mockReturnValue({ user: null, isLoading: false });
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
  });

  it('returns accessToken from user object', () => {
    mockUseUser.mockReturnValue({
      user: { sub: 'auth0|123', accessToken: 'test-token-123' },
      isLoading: false,
    });
    const { result } = renderHook(() => useAuth());
    expect(result.current.accessToken).toBe('test-token-123');
  });

  it('returns null accessToken when no user', () => {
    mockUseUser.mockReturnValue({ user: null, isLoading: false });
    const { result } = renderHook(() => useAuth());
    expect(result.current.accessToken).toBeNull();
  });
});
