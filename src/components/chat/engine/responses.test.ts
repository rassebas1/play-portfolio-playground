import { describe, it, expect, vi, beforeEach } from 'vitest';
import { resolveResponse } from './responses';
import type { IntentMatch, Intent } from '../types';

const mockIntent: Intent = {
  key: 'greeting',
  keywords: [],
  priority: 1,
};

function createMatch(key: string): IntentMatch {
  return {
    intent: { ...mockIntent, key },
    score: 10,
    matchedKeywords: ['hello'],
  };
}

describe('resolveResponse', () => {
  let mockT: (key: string) => string;

  beforeEach(() => {
    mockT = vi.fn((key: string) => {
      const responses: Record<string, string> = {
        'intents.greeting.friend': 'Hey there!',
        'intents.greeting.manager': 'Hello, how can I help?',
        'intents.experience.friend': 'I worked at several places.',
        'intents.experience.manager': 'Professional experience includes...',
        'intents.unknown_intent.shared': 'Shared response',
        'fallback.friend': 'Default fallback friend.',
        'fallback.manager': 'Default fallback manager.',
      };
      return responses[key] || key;
    });
  });

  it('returns friend response when personality is friend', () => {
    const match = createMatch('greeting');
    const result = resolveResponse(match, 'friend', mockT);
    expect(result).toBe('Hey there!');
  });

  it('returns manager response when personality is manager', () => {
    const match = createMatch('greeting');
    const result = resolveResponse(match, 'manager', mockT);
    expect(result).toBe('Hello, how can I help?');
  });

  it('falls back to shared response when personality-specific is missing', () => {
    const match = createMatch('unknown_intent');
    const result = resolveResponse(match, 'friend', mockT);
    expect(result).toBe('Shared response');
  });

  it('falls back to default fallback when no response found', () => {
    const match = createMatch('nonexistent');
    const result = resolveResponse(match, 'friend', mockT);
    expect(result).toBe('Default fallback friend.');
  });

  it('uses manager fallback when personality is manager', () => {
    const match = createMatch('nonexistent');
    const result = resolveResponse(match, 'manager', mockT);
    expect(result).toBe('Default fallback manager.');
  });
});
