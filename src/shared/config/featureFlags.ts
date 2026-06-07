import { logger } from '@/src/shared/services/logger';

export interface FeatureFlags {
  enableStreaming: boolean;
  enableMCPServers: boolean;
  enableMultipleAgents: boolean;
  enablePersistentMemory: boolean;
  enableHaptics: boolean;
  enableAutoTitleConversations: boolean;
  enableEndpointTesting: boolean;
  showTokenCounts: boolean;
  showModelLabels: boolean;
  enableAnimations: boolean;
  enableDebugLogs: boolean;
}

const DEFAULT_FLAGS: FeatureFlags = {
  enableStreaming: true,
  enableMCPServers: true,
  enableMultipleAgents: true,
  enablePersistentMemory: true,
  enableHaptics: true,
  enableAutoTitleConversations: true,
  enableEndpointTesting: true,
  showTokenCounts: true,
  showModelLabels: true,
  enableAnimations: true,
  enableDebugLogs: false,
};

let currentFlags: FeatureFlags = { ...DEFAULT_FLAGS };

export const featureFlags = {
  get: (): FeatureFlags => ({ ...currentFlags }),
  isEnabled: (flag: keyof FeatureFlags): boolean => currentFlags[flag],
  isDisabled: (flag: keyof FeatureFlags): boolean => !currentFlags[flag],
  override: (overrides: Partial<FeatureFlags>): void => {
    currentFlags = { ...currentFlags, ...overrides };
    logger.info('Feature flags updated', { overrides });
  },
  reset: (): void => {
    currentFlags = { ...DEFAULT_FLAGS };
    logger.info('Feature flags reset to defaults');
  },
  enable: (flag: keyof FeatureFlags): void => {
    currentFlags = { ...currentFlags, [flag]: true };
  },
  disable: (flag: keyof FeatureFlags): void => {
    currentFlags = { ...currentFlags, [flag]: false };
  },
};
