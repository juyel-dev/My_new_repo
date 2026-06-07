import { useState, useEffect, useCallback } from 'react';

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number = 300
): T {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  return useCallback((...args: Parameters<T>) => {
    const handler = setTimeout(() => callback(...args), delay);
    clearTimeout(handler);
    return handler;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callback, delay]) as T;
}
