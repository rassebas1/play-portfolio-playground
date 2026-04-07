import { describe, it, expect } from 'vitest';
import { KnowledgeEngine } from './KnowledgeEngine';
import { intents, normalizeInput, scoreIntent } from './intents';

describe('normalizeInput', () => {
  it('lowercases and trims input', () => {
    expect(normalizeInput('  HELLO World  ')).toBe('hello world');
  });

  it('removes punctuation', () => {
    expect(normalizeInput('¿Hola, cómo estás?')).toBe('hola cómo estás');
  });

  it('collapses multiple spaces', () => {
    expect(normalizeInput('hello    world')).toBe('hello world');
  });
});

describe('scoreIntent', () => {
  const greetingIntent = intents.find((i) => i.key === 'greeting')!;

  it('returns 0 when no keywords match', () => {
    expect(scoreIntent('banana pizza', greetingIntent)).toBe(0);
  });

  it('returns weighted score for matching keywords', () => {
    expect(scoreIntent('hello there', greetingIntent)).toBeGreaterThan(0);
  });

  it('scores higher for multiple keyword matches', () => {
    const score1 = scoreIntent('hi', greetingIntent);
    const score2 = scoreIntent('hi hello hey', greetingIntent);
    expect(score2).toBeGreaterThan(score1);
  });

  it('matches multi-word keywords', () => {
    const experienceIntent = intents.find((i) => i.key === 'experience')!;
    expect(scoreIntent('banco popular', experienceIntent)).toBeGreaterThan(0);
  });
});

describe('KnowledgeEngine.matchIntent', () => {
  const engine = new KnowledgeEngine();

  it('matches greeting intent', () => {
    const result = engine.matchIntent('hello there');
    expect(result.intent.key).toBe('greeting');
    expect(result.score).toBeGreaterThan(0);
  });

  it('matches experience intent', () => {
    const result = engine.matchIntent('tell me about your work experience');
    expect(result.intent.key).toBe('experience');
  });

  it('matches skills intent', () => {
    const result = engine.matchIntent('what technologies do you know?');
    expect(result.intent.key).toBe('skills');
  });

  it('matches games intent', () => {
    const result = engine.matchIntent('I want to play some games');
    expect(result.intent.key).toBe('games');
  });

  it('returns fallback for unknown input', () => {
    const result = engine.matchIntent('xyzzy plugh');
    expect(result.intent.key).toBe('fallback');
    expect(result.score).toBe(0);
  });

  it('matches Spanish input', () => {
    const result = engine.matchIntent('¿cuáles son tus habilidades?');
    expect(result.intent.key).toBe('skills');
  });

  it('boosts related intents with context', () => {
    const result1 = engine.matchIntent('tell me about your experience');
    expect(result1.intent.key).toBe('experience');

    const context = {
      lastIntent: 'experience',
      depth: 1,
      lastActivity: Date.now(),
    };
    const result2 = engine.matchIntent('what about skills', context);
    expect(result2.intent.key).toBe('skills');
  });

  it('matches experience_by_year with year keywords', () => {
    const result = engine.matchIntent('what did you do in 2024?');
    expect(result.intent.key).toBe('experience_by_year');
  });

  it('matches experience_by_year with regex pattern', () => {
    const result = engine.matchIntent('what did you work on in 2023?');
    expect(result.intent.key).toBe('experience_by_year');
  });

  it('prioritizes higher scoring intents', () => {
    const result = engine.matchIntent('hi hello');
    expect(result.intent.key).toBe('greeting');
  });
});
