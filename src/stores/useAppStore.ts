import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  Agent, AppState, Conversation, MCPServer, Message, Model, Provider,
} from '@/src/shared/types';
import { DEFAULT_OPENAI_MODELS, DEFAULT_ANTHROPIC_MODELS } from '@/src/shared/types';
import { generateId } from '@/src/shared/lib/utils';
import { logger } from '@/src/shared/services/logger';
import { DEFAULT_SETTINGS } from './useSettingsStore';

const INITIAL_STATE: AppState = {
  providers: [],
  models: [],
  agents: [{
    id: 'default-assistant',
    name: 'Assistant',
    description: 'General purpose AI assistant',
    icon: 'bot',
    modelId: '',
    systemPrompt: 'You are a helpful, concise AI assistant. Use markdown formatting when appropriate.',
    capabilities: ['tools', 'memory', 'vision'],
    mcpServerIds: [],
    temperature: 0.7,
    maxTokens: 4096,
    enabled: true,
  }],
  mcpServers: [],
  conversations: [],
  settings: DEFAULT_SETTINGS,
};

interface AppStore extends AppState {
  isLoaded: boolean;
  // Provider actions
  addProvider: (p: Omit<Provider, 'id' | 'createdAt'>) => Provider;
  updateProvider: (id: string, updates: Partial<Provider>) => void;
  deleteProvider: (id: string) => void;
  toggleProvider: (id: string) => void;
  // Model actions
  addModel: (m: Omit<Model, 'id'>) => Model;
  updateModel: (id: string, updates: Partial<Model>) => void;
  deleteModel: (id: string) => void;
  toggleModel: (id: string) => void;
  clearAllModels: () => void;
  // Agent actions
  addAgent: (a: Omit<Agent, 'id'>) => Agent;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  deleteAgent: (id: string) => void;
  toggleAgent: (id: string) => void;
  clearCustomAgents: () => void;
  // MCP actions
  addMCPServer: (s: Omit<MCPServer, 'id' | 'status'>) => MCPServer;
  updateMCPServer: (id: string, updates: Partial<MCPServer>) => void;
  deleteMCPServer: (id: string) => void;
  toggleMCPServer: (id: string) => void;
  // Conversation actions
  createConversation: (agentId: string, title?: string) => Conversation;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  deleteConversation: (id: string) => void;
  addMessage: (conversationId: string, msg: Omit<Message, 'id'>) => Message;
  deleteMessage: (conversationId: string, messageId: string) => void;
  deleteLastAssistantMessage: (conversationId: string) => void;
  deleteAllConversations: () => void;
  // Utility
  getActiveModel: (agentId: string) => Model | null;
  getActiveProvider: (model: Model) => Provider | null;
  clearAllData: () => void;
  setLoaded: (loaded: boolean) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,
      isLoaded: false,

      addProvider: (p) => {
        const provider: Provider = { ...p, id: generateId(), createdAt: Date.now() };
        const defaultModels = p.type === 'openai'
          ? DEFAULT_OPENAI_MODELS
          : p.type === 'anthropic'
            ? DEFAULT_ANTHROPIC_MODELS
            : [];
        const newModels: Model[] = defaultModels.map(m => ({
          ...m, id: generateId(), providerId: provider.id,
        }));
        set((state) => ({
          providers: [...state.providers, provider],
          models: [...state.models, ...newModels],
        }));
        logger.info('Provider added', { name: p.name, type: p.type });
        return provider;
      },

      updateProvider: (id, updates) =>
        set((state) => ({
          providers: state.providers.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      deleteProvider: (id) =>
        set((state) => ({
          providers: state.providers.filter((p) => p.id !== id),
          models: state.models.filter((m) => m.providerId !== id),
        })),

      toggleProvider: (id) =>
        set((state) => ({
          providers: state.providers.map((p) =>
            p.id === id ? { ...p, enabled: !p.enabled } : p
          ),
        })),

      addModel: (m) => {
        const model: Model = { ...m, id: generateId() };
        set((state) => ({ models: [...state.models, model] }));
        return model;
      },

      updateModel: (id, updates) =>
        set((state) => ({
          models: state.models.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        })),

      deleteModel: (id) =>
        set((state) => ({
          models: state.models.filter((m) => m.id !== id),
        })),

      toggleModel: (id) =>
        set((state) => ({
          models: state.models.map((m) =>
            m.id === id ? { ...m, enabled: !m.enabled } : m
          ),
        })),

      clearAllModels: () =>
        set({ models: [], providers: [] }),

      addAgent: (a) => {
        const agent: Agent = { ...a, id: generateId() };
        set((state) => ({ agents: [...state.agents, agent] }));
        return agent;
      },

      updateAgent: (id, updates) =>
        set((state) => ({
          agents: state.agents.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        })),

      deleteAgent: (id) => {
        if (id === 'default-assistant') return;
        set((state) => ({
          agents: state.agents.filter((a) => a.id !== id),
        }));
      },

      toggleAgent: (id) =>
        set((state) => ({
          agents: state.agents.map((a) =>
            a.id === id ? { ...a, enabled: !a.enabled } : a
          ),
        })),

      clearCustomAgents: () =>
        set((state) => ({
          agents: state.agents.filter((a) => a.id === 'default-assistant'),
        })),

      addMCPServer: (s) => {
        const server: MCPServer = { ...s, id: generateId(), status: 'disconnected' };
        set((state) => ({ mcpServers: [...state.mcpServers, server] }));
        return server;
      },

      updateMCPServer: (id, updates) =>
        set((state) => ({
          mcpServers: state.mcpServers.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),

      deleteMCPServer: (id) =>
        set((state) => ({
          mcpServers: state.mcpServers.filter((s) => s.id !== id),
        })),

      toggleMCPServer: (id) =>
        set((state) => ({
          mcpServers: state.mcpServers.map((s) =>
            s.id === id ? { ...s, enabled: !s.enabled } : s
          ),
        })),

      createConversation: (agentId, title) => {
        const conv: Conversation = {
          id: generateId(),
          title: title ?? 'New Chat',
          agentId,
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          totalTokens: 0,
        };
        set((state) => ({
          conversations: [conv, ...state.conversations],
        }));
        return conv;
      },

      updateConversation: (id, updates) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, ...updates, updatedAt: Date.now() } : c
          ),
        })),

      deleteConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
        })),

      addMessage: (conversationId, msg) => {
        const message: Message = { ...msg, id: generateId() };
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id !== conversationId) return c;
            const msgs = [...c.messages, message];
            const newTitle = c.messages.length === 0 && msg.role === 'user'
              ? msg.content.slice(0, 52).trimEnd() + (msg.content.length > 52 ? '…' : '')
              : c.title;
            return { ...c, messages: msgs, updatedAt: Date.now(), title: newTitle };
          }),
        }));
        return message;
      },

      deleteMessage: (conversationId, messageId) =>
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id !== conversationId) return c;
            return { ...c, messages: c.messages.filter((m) => m.id !== messageId), updatedAt: Date.now() };
          }),
        })),

      deleteLastAssistantMessage: (conversationId) =>
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id !== conversationId) return c;
            const msgs = [...c.messages];
            for (let i = msgs.length - 1; i >= 0; i--) {
              if (msgs[i].role === 'assistant') { msgs.splice(i, 1); break; }
            }
            return { ...c, messages: msgs, updatedAt: Date.now() };
          }),
        })),

      deleteAllConversations: () =>
        set({ conversations: [] }),

      getActiveModel: (agentId) => {
        const state = get();
        const agent = state.agents.find((a) => a.id === agentId);
        if (!agent?.modelId) return null;
        return state.models.find((m) => m.id === agent.modelId && m.enabled) ?? null;
      },

      getActiveProvider: (model) => {
        const state = get();
        return state.providers.find((p) => p.id === model.providerId && p.enabled) ?? null;
      },

      clearAllData: () => {
        set({
          ...INITIAL_STATE,
          settings: { ...DEFAULT_SETTINGS, onboardingComplete: true },
          isLoaded: true,
        });
        logger.info('All data cleared');
      },

      setLoaded: (loaded) => set({ isLoaded: loaded }),
    }),
    {
      name: '@byokos:appstate',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        providers: state.providers,
        models: state.models,
        agents: state.agents,
        mcpServers: state.mcpServers,
        conversations: state.conversations,
        settings: state.settings,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setLoaded(true);
        logger.info('App state rehydrated from storage');
      },
    },
  ),
);
