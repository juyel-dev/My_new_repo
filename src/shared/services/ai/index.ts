import { logger } from '@/src/shared/services/logger';
import { AIServiceError } from './types';
import { streamAnthropic } from './anthropic';
import { streamOpenAICompat } from './openai';
import type { StreamParams } from './types';
import type { Agent, Message } from '@/src/shared/types';

export * from './types';

export async function streamMessage(params: StreamParams): Promise<string> {
  logger.info('Streaming message', {
    provider: params.provider.type,
    model: params.model.modelId,
  });

  try {
    if (params.provider.type === 'anthropic') {
      return await streamAnthropic(params);
    }
    return await streamOpenAICompat(params);
  } catch (err) {
    if (err instanceof AIServiceError) throw err;
    const message = err instanceof Error ? err.message : String(err);
    logger.error('AI stream failed', { message });
    throw new AIServiceError(message, 'STREAM_FAILED');
  }
}

export function buildMessages(
  conversationMessages: Message[],
  newContent: string,
  agent: Agent,
): Pick<Message, 'role' | 'content'>[] {
  const history = conversationMessages
    .filter(m => m.role !== 'system')
    .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

  const result: Pick<Message, 'role' | 'content'>[] = [];
  if (agent.systemPrompt) {
    result.push({ role: 'system', content: agent.systemPrompt });
  }
  result.push(...history);
  result.push({ role: 'user', content: newContent });
  return result;
}
