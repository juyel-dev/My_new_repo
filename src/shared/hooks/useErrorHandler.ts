import { useCallback } from 'react';
import { logger } from '@/src/shared/services/logger';
import { useHaptics } from './useHaptics';

interface ErrorHandlerOptions {
  silent?: boolean;
  fallback?: string;
  context?: string;
}

export function useErrorHandler() {
  const haptics = useHaptics();

  const handleError = useCallback((error: unknown, options: ErrorHandlerOptions = {}) => {
    const message = error instanceof Error ? error.message : String(error);
    const { silent = false, fallback = 'Something went wrong', context } = options;

    logger.error(context ?? 'Unhandled error', { message, error: String(error) });

    if (!silent) {
      haptics.error();
    }

    return fallback;
  }, [haptics]);

  const tryCatch = useCallback(<T>(
    fn: () => T,
    options: ErrorHandlerOptions = {}
  ): T | undefined => {
    try {
      return fn();
    } catch (error) {
      handleError(error, options);
      return undefined;
    }
  }, [handleError]);

  return { handleError, tryCatch };
}
