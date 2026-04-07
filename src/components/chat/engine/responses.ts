import type { IntentMatch, Personality } from '../types';

export function resolveResponse(
  match: IntentMatch,
  personality: Personality,
  t: (key: string) => string,
): string {
  const intentKey = match.intent.key;

  // Try personality-specific response first
  const specificKey = `intents.${intentKey}.${personality}`;
  const specificResponse = t(specificKey);

  // If the translation key returned the key itself, it doesn't exist — try shared
  if (specificResponse !== specificKey) {
    return specificResponse;
  }

  // Fallback to shared response
  const sharedKey = `intents.${intentKey}.shared`;
  const sharedResponse = t(sharedKey);
  if (sharedResponse !== sharedKey) {
    return sharedResponse;
  }

  // Ultimate fallback
  return t(`fallback.${personality}`);
}
