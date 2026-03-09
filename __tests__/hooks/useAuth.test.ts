import { renderHook } from '@testing-library/react';
import React from 'react';

jest.mock('@/lib/auth/AuthContext', () => ({
  useAuthContext: jest.fn(),
}));

import { useAuthContext } from '@/lib/auth/AuthContext';
import { useAuth } from '@/hooks/useAuth';

const mockUseAuthContext = useAuthContext as jest.Mock;

describe('useAuth', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns isLoading true when loading', () => {
    mockUseAuthContext.mockReturnValue({
      user: null,
      isLoading: true,
      isAuthenticated: false,
      accessToken: null,
      logout: jest.fn(),
    });
    const { result } = renderHook(() => useAuth());
    expect(result.current.isLoading).toBe(true);
  });

  it('returns isAuthenticated false when user is null', () => {
    mockUseAuthContext.mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      accessToken: null,
      logout: jest.fn(),
    });
    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('returns isAuthenticated true when user is present', () => {
    mockUseAuthContext.mockReturnValue({
      user: { id: 'user-123', email: 'test@example.com' },
      isLoading: false,
      isAuthenticated: true,
      accessToken: 'token-abc',
      logout: jest.fn(),
    });
    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('returns user object when present', () => {
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    mockUseAuthContext.mockReturnValue({
      user: mockUser,
      isLoading: false,
      isAuthenticated: true,
      accessToken: 'token-abc',
      logout: jest.fn(),
    });
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toEqual(mockUser);
  });

  it('returns null user when not authenticated', () => {
    mockUseAuthContext.mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      accessToken: null,
      logout: jest.fn(),
    });
    const { result } = renderHook(() => useAuth());
    expect(result.current.user).toBeNull();
  });

  it('returns accessToken from context', () => {
    mockUseAuthContext.mockReturnValue({
      user: { id: 'user-123', email: 'test@example.com' },
      isLoading: false,
      isAuthenticated: true,
      accessToken: 'test-token-123',
      logout: jest.fn(),
    });
    const { result } = renderHook(() => useAuth());
    expect(result.current.accessToken).toBe('test-token-123');
  });

  it('returns null accessToken when no user', () => {
    mockUseAuthContext.mockReturnValue({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      accessToken: null,
      logout: jest.fn(),
    });
    const { result } = renderHook(() => useAuth());
    expect(result.current.accessToken).toBeNull();
  });
});
