import type { ConversationContext } from '../types';

const CONTEXT_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const MAX_DEPTH = 3;
const FALLBACK_ESCALATION_THRESHOLD = 3;

export class ContextTracker {
  private context: ConversationContext = {
    depth: 0,
    lastActivity: Date.now(),
  };

  update(intent: string, params?: Record<string, string>): void {
    if (this.isExpired()) {
      this.reset();
    }

    this.context.lastIntent = intent;
    this.context.lastParams = params;
    this.context.depth = Math.min(this.context.depth + 1, MAX_DEPTH);
    this.context.lastActivity = Date.now();

    // Track consecutive fallbacks for escalation
    if (intent === 'fallback') {
      this.context.consecutiveFallbacks = (this.context.consecutiveFallbacks || 0) + 1;
    } else {
      this.context.consecutiveFallbacks = 0;
    }
  }

  getContext(): ConversationContext {
    if (this.isExpired()) {
      this.reset();
    }
    return { ...this.context };
  }

  shouldEscalate(): boolean {
    return (this.context.consecutiveFallbacks || 0) >= FALLBACK_ESCALATION_THRESHOLD;
  }

  reset(): void {
    this.context = {
      depth: 0,
      lastActivity: Date.now(),
      consecutiveFallbacks: 0,
    };
  }

  isExpired(): boolean {
    return Date.now() - this.context.lastActivity > CONTEXT_EXPIRY_MS;
  }
}
