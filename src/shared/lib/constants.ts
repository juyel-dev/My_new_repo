import { Feather } from '@expo/vector-icons';
import type { AgentIcon, Capability, ProviderType } from '@/src/shared/types';

export const AGENT_ICONS: Record<AgentIcon | string, keyof typeof Feather.glyphMap> = {
  bot: 'cpu',
  code: 'code',
  globe: 'globe',
  cpu: 'cpu',
  flask: 'zap',
  brain: 'activity',
};

export const CAP_ICONS: Record<Capability, keyof typeof Feather.glyphMap> = {
  tools: 'tool',
  memory: 'database',
  vision: 'eye',
  mcp: 'server',
  reasoning: 'activity',
};

export const CAP_COLORS: Record<Capability, string> = {
  tools: '#8b5cf6',
  memory: '#3b82f6',
  vision: '#fbbf24',
  mcp: '#4ade80',
  reasoning: '#f97316',
};

export const CAP_LABELS: Record<Capability, string> = {
  tools: 'Tools',
  memory: 'Memory',
  vision: 'Vision',
  mcp: 'MCP',
  reasoning: 'Reasoning',
};

export const PROVIDER_ICONS: Record<ProviderType, keyof typeof Feather.glyphMap> = {
  openai: 'zap',
  anthropic: 'sun',
  gemini: 'star',
  custom: 'settings',
};

export const PROVIDER_LABELS: Record<ProviderType, string> = {
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  gemini: 'Google Gemini',
  custom: 'Custom',
};

export const API_ERROR_MESSAGES: Record<number, string> = {
  401: 'Invalid API key. Check your provider settings.',
  403: 'Access denied. Your key may lack permissions.',
  429: 'Rate limit hit. Please wait a moment and try again.',
  500: 'Provider server error. Try again shortly.',
  502: 'Bad gateway. Provider may be temporarily down.',
  503: 'Service unavailable. Provider is experiencing issues.',
  504: 'Gateway timeout. The provider took too long to respond.',
};
