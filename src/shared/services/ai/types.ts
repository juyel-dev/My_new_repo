import type { Agent, Message, Model, Provider } from '@/src/shared/types';

export interface StreamParams {
  conversationId: string;
  messages: Pick<Message, 'role' | 'content'>[];
  agent: Agent;
  model: Model;
  provider: Provider;
  onChunk: (text: string) => void;
  signal?: AbortSignal;
}

export interface AIError {
  code: string;
  message: string;
  status?: number;
}

export class AIServiceError extends Error {
  public code: string;
  public status?: number;

  constructor(message: string, code: string, status?: number) {
    super(message);
    this.code = code;
    this.status = status;
    this.name = 'AIServiceError';
  }
}
