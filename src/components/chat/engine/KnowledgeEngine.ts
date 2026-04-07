import { intents, scoreIntent } from './intents';
import type { IntentMatch, ConversationContext } from '../types';

const SCORE_THRESHOLD = 3;
const CONTEXT_BOOST = 5;

export class KnowledgeEngine {
  matchIntent(input: string, context?: ConversationContext): IntentMatch {
    const results = intents.map((intent) => {
      const score = scoreIntent(input, intent);
      const matchedKeywords = intents
        .find((i) => i.key === intent.key)!
        .keywords.filter((kw) =>
          input.toLowerCase().includes(kw.word.toLowerCase())
        )
        .map((kw) => kw.word);

      return { intent, score, matchedKeywords };
    });

    // Boost score for follow-up intents when context exists
    if (context?.lastIntent) {
      results.forEach((result) => {
        const lastIntent = intents.find((i) => i.key === context.lastIntent);
        if (lastIntent?.relatedIntents?.includes(result.intent.key)) {
          result.score += CONTEXT_BOOST;
        }
      });
    }

    // Sort by score descending, then by priority ascending (lower = higher priority)
    results.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.intent.priority - b.intent.priority;
    });

    const best = results[0];

    // Return fallback if below threshold
    if (!best || best.score < SCORE_THRESHOLD) {
      return {
        intent: intents.find((i) => i.key === 'fallback') || intents[intents.length - 1],
        score: 0,
        matchedKeywords: [],
      };
    }

    return best;
  }
}
