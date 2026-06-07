import { fetch } from 'expo/fetch';
import { logger } from '@/src/shared/services/logger';
import { AIServiceError } from './types';
import type { StreamParams } from './types';

export async function streamOpenAICompat(params: StreamParams): Promise<string> {
  const { agent, model, provider, messages, onChunk, signal } = params;

  const baseUrl = provider.baseUrl ?? (
    provider.type === 'gemini'
      ? 'https://generativelanguage.googleapis.com/v1beta/openai'
      : 'https://api.openai.com/v1'
  );

  try {
    const res = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${provider.apiKey}`,
      },
      body: JSON.stringify({
        model: model.modelId,
        messages,
        stream: true,
        temperature: agent.temperature,
        max_tokens: agent.maxTokens,
      }),
      signal,
    });

    if (!res.ok) {
      const errBody = await res.text();
      let message = `API error (${res.status})`;
      try {
        const parsed = JSON.parse(errBody);
        message = parsed?.error?.message ?? message;
      } catch { /* ignore */ }
      throw new AIServiceError(message, 'OPENAI_API_ERROR', res.status);
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
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) {
            responseText += delta;
            onChunk(responseText);
          }
        } catch { /* ignore parse errors on SSE lines */ }
      }
    }

    logger.debug('OpenAI-compat stream complete', { chars: responseText.length });
    return responseText;
  } catch (error) {
    if (error instanceof AIServiceError) throw error;
    if (error instanceof Error && error.name === 'AbortError') {
      throw new AIServiceError('Request was aborted', 'ABORTED');
    }
    throw new AIServiceError(
      error instanceof Error ? error.message : 'Unknown API error',
      'OPENAI_ERROR'
    );
  }
}
