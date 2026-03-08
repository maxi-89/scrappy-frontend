'use client';

import { useEffect, useRef } from 'react';

export function usePolling(
  callback: () => void,
  enabled: boolean,
  intervalMs = 5000
): void {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    const id = setInterval(() => {
      callbackRef.current();
    }, intervalMs);

    return () => clearInterval(id);
  }, [enabled, intervalMs]);
}
