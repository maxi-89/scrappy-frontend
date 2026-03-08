import { renderHook } from '@testing-library/react';
import { usePolling } from '@/hooks/usePolling';

describe('usePolling', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('does not call callback immediately on mount', () => {
    const callback = jest.fn();
    renderHook(() => usePolling(callback, true));
    expect(callback).not.toHaveBeenCalled();
  });

  it('calls callback after the interval when enabled', () => {
    const callback = jest.fn();
    renderHook(() => usePolling(callback, true, 5000));
    jest.advanceTimersByTime(5000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('calls callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    renderHook(() => usePolling(callback, true, 5000));
    jest.advanceTimersByTime(15000);
    expect(callback).toHaveBeenCalledTimes(3);
  });

  it('does not call callback when disabled', () => {
    const callback = jest.fn();
    renderHook(() => usePolling(callback, false, 5000));
    jest.advanceTimersByTime(10000);
    expect(callback).not.toHaveBeenCalled();
  });

  it('stops polling when enabled changes to false', () => {
    const callback = jest.fn();
    let enabled = true;
    const { rerender } = renderHook(() => usePolling(callback, enabled, 5000));
    jest.advanceTimersByTime(5000);
    expect(callback).toHaveBeenCalledTimes(1);
    enabled = false;
    rerender();
    jest.advanceTimersByTime(10000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('uses default interval of 5000ms', () => {
    const callback = jest.fn();
    renderHook(() => usePolling(callback, true));
    jest.advanceTimersByTime(4999);
    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
