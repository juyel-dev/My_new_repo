import { fetch } from 'expo/fetch';
import { logger } from '@/src/shared/services/logger';
import { AIServiceError } from './types';
import type { StreamParams } from './types';

export async function streamAnthropic(params: StreamParams): Promise<string> {
  const { agent, model, provider, onChunk, signal } = params;
  const systemMessages = params.messages.filter(m => m.role === 'system');
  const chatMessages = params.messages.filter(m => m.role !== 'system');

  const baseUrl = provider.baseUrl ?? 'https://api.anthropic.com';

  try {
    const res = await fetch(`${baseUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': provider.apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: model.modelId,
        max_tokens: agent.maxTokens,
        stream: true,
        messages: chatMessages,
        system: systemMessages[0]?.content || agent.systemPrompt || undefined,
      }),
      signal,
    });

    if (!res.ok) {
      const errBody = await res.text();
      let message = `Anthropic API error (${res.status})`;
      try {
        const parsed = JSON.parse(errBody);
        message = parsed?.error?.message ?? message;
      } catch { /* ignore */ }
      throw new AIServiceError(message, 'ANTHROPIC_API_ERROR', res.status);
    }

    const reader = res.body?.getReader();
    if (!reader) throw new AIServiceError('No response stream', 'STREAM_ERROR');

    const decoder = new TextDecoder();
    let responseText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      for (const line of chunk.split('\n')) {
        if (!line.startsWith('data:')) continue;
        const data = line.slice(5).trim();
        if (data === '[DONE]' || !data) continue;
        try {
          const parsed = JSON.parse(data);
          if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
            responseText += parsed.delta.text;
            onChunk(responseText);
          }
        } catch { /* ignore parse errors on SSE lines */ }
      }
    }

    logger.debug('Anthropic stream complete', { chars: responseText.length });
    return responseText;
  } catch (error) {
    if (error instanceof AIServiceError) throw error;
    if (error instanceof Error && error.name === 'AbortError') {
      throw new AIServiceError('Request was aborted', 'ABORTED');
    }
    throw new AIServiceError(
      error instanceof Error ? error.message : 'Unknown Anthropic error',
      'ANTHROPIC_ERROR'
    );
  }
}
