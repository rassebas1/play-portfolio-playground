import type { IntentMatch, QuickReply } from '../types';
import { intents } from './intents';

const MAX_QUICK_REPLIES = 4;

export function generateQuickReplies(
  match: IntentMatch,
  t: (key: string) => string,
): QuickReply[] {
  const suggestions: QuickReply[] = [];

  // Add related intents as quick replies
  const relatedKeys = match.intent.relatedIntents || [];
  for (const key of relatedKeys) {
    if (suggestions.length >= MAX_QUICK_REPLIES) break;
    const relatedIntent = intents.find((i) => i.key === key);
    if (relatedIntent) {
      suggestions.push({
        label: t(`quickReplies.${key}`),
        intentKey: key,
      });
    }
  }

  // If not enough related intents, add defaults
  const defaults = ['help', 'skills', 'projects', 'games'];
  for (const key of defaults) {
    if (suggestions.length >= MAX_QUICK_REPLIES) break;
    if (!suggestions.find((s) => s.intentKey === key) && key !== match.intent.key) {
      suggestions.push({
        label: t(`quickReplies.${key}`),
        intentKey: key,
      });
    }
  }

  return suggestions.slice(0, MAX_QUICK_REPLIES);
}
