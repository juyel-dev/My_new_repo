import { useCallback, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useAppStore } from '@/src/stores/useAppStore';
import { useSettingsStore } from '@/src/stores/useSettingsStore';
import { streamMessage, buildMessages } from '@/src/shared/services/ai';
import { AIServiceError } from '@/src/shared/services/ai/types';
import { logger } from '@/src/shared/services/logger';
import { useHaptics } from '@/src/shared/hooks/useHaptics';
import { useErrorHandler } from '@/src/shared/hooks/useErrorHandler';
import { featureFlags } from '@/src/shared/config/featureFlags';

export function useChatScreen(conversationId: string) {
  const haptics = useHaptics();
  const { handleError } = useErrorHandler();
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const conversations = useAppStore((s) => s.conversations);
  const agents = useAppStore((s) => s.agents);
  const addMessage = useAppStore((s) => s.addMessage);
  const deleteMessage = useAppStore((s) => s.deleteMessage);
  const deleteLastAssistantMessage = useAppStore((s) => s.deleteLastAssistantMessage);
  const getActiveModel = useAppStore((s) => s.getActiveModel);
  const getActiveProvider = useAppStore((s) => s.getActiveProvider);
  const streamingEnabled = useSettingsStore((s) => s.settings.streamingEnabled);

  const conversation = conversations.find((c) => c.id === conversationId);
  const agent = conversation ? agents.find((a) => a.id === conversation.agentId) : null;
  const model = agent ? getActiveModel(agent.id) : null;
  const provider = model ? getActiveProvider(model) : null;

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isStreaming) return;

    if (!model || !provider) {
      Alert.alert(
        'No Model Selected',
        'Add an AI provider and enable a model in Settings.',
        [{ text: 'OK' }]
      );
      return;
    }

    haptics.medium();
    setInput('');
    setError(null);
    setIsStreaming(true);
    setStreamingText('');

    await addMessage(conversationId, { role: 'user', content: text, timestamp: Date.now() });

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const messages = buildMessages(conversation?.messages ?? [], text, agent);

      const responseText = await streamMessage({
        conversationId,
        messages,
        agent,
        model,
        provider,
        onChunk: featureFlags.isEnabled('enableStreaming')
          ? (partial) => setStreamingText(partial)
          : () => {},
        signal: controller.signal,
      });

      if (responseText) {
        await addMessage(conversationId, {
          role: 'assistant',
          content: responseText,
          timestamp: Date.now(),
          model: model.name,
        });
      }
      haptics.light();
    } catch (err) {
      if (err instanceof AIServiceError && err.code === 'ABORTED') {
        if (streamingText) {
          await addMessage(conversationId, {
            role: 'assistant',
            content: streamingText + ' *(stopped)*',
            timestamp: Date.now(),
          });
        }
      } else {
        const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
        setError(msg);
        haptics.error();
        await addMessage(conversationId, {
          role: 'assistant',
          content: msg,
          timestamp: Date.now(),
          error: true,
        });
        logger.error('Chat message failed', { error: msg });
      }
    } finally {
      setIsStreaming(false);
      setStreamingText('');
      abortRef.current = null;
    }
  }, [input, isStreaming, model, provider, conversation, agent, haptics, addMessage, conversationId, streamingText]);

  const handleStop = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const handleRetry = useCallback(async () => {
    if (!conversation || isStreaming) return;
    const msgs = conversation.messages;
    const lastUser = [...msgs].reverse().find((m) => m.role === 'user');
    if (!lastUser) return;
    await deleteLastAssistantMessage(conversationId);
    setInput(lastUser.content);
  }, [conversation, isStreaming, deleteLastAssistantMessage, conversationId]);

  const handleDeleteMessage = useCallback(async (msgId: string) => {
    await deleteMessage(conversationId, msgId);
  }, [deleteMessage, conversationId]);

  const handleClearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    conversation,
    agent,
    model,
    input,
    setInput,
    isStreaming,
    streamingText,
    error,
    handleSend,
    handleStop,
    handleRetry,
    handleDeleteMessage,
    handleClearError,
  };
}
