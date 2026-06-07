import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};

export const ENV = {
  APP_NAME: 'Byok Os',
  APP_VERSION: Constants.expoConfig?.version ?? '1.0.0',
  BUNDLE_ID: 'com.byokos.app',
  ENVIRONMENT: process.env.NODE_ENV ?? 'development',
  IS_DEV: __DEV__,
  IS_PRODUCTION: !__DEV__,
} as const;

export const API_ENDPOINTS = {
  openai: 'https://api.openai.com/v1',
  anthropic: 'https://api.anthropic.com/v1',
  gemini: 'https://generativelanguage.googleapis.com/v1beta/openai',
} as const;

export const APP_CONFIG = {
  maxMessageLength: 4000,
  maxConversations: 500,
  maxMessagesPerConversation: 1000,
  defaultTemperature: 0.7,
  defaultMaxTokens: 4096,
  persistDebounceMs: 600,
  searchDebounceMs: 150,
  messageListPageSize: 50,
} as const;
