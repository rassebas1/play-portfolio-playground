import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ContextTracker } from './context';

describe('ContextTracker', () => {
  let tracker: ContextTracker;

  beforeEach(() => {
    tracker = new ContextTracker();
  });

  it('starts with empty context', () => {
    const ctx = tracker.getContext();
    expect(ctx.lastIntent).toBeUndefined();
    expect(ctx.depth).toBe(0);
  });

  it('updates context on each call', () => {
    tracker.update('experience');
    const ctx = tracker.getContext();
    expect(ctx.lastIntent).toBe('experience');
    expect(ctx.depth).toBe(1);
  });

  it('increments depth up to MAX_DEPTH', () => {
    tracker.update('greeting');
    tracker.update('experience');
    tracker.update('skills');
    tracker.update('projects');
    const ctx = tracker.getContext();
    expect(ctx.depth).toBe(3); // MAX_DEPTH = 3
  });

  it('tracks consecutive fallbacks', () => {
    tracker.update('fallback');
    tracker.update('fallback');
    const ctx = tracker.getContext();
    expect(ctx.consecutiveFallbacks).toBe(2);
  });

  it('resets consecutive fallbacks on non-fallback intent', () => {
    tracker.update('fallback');
    tracker.update('fallback');
    tracker.update('experience');
    const ctx = tracker.getContext();
    expect(ctx.consecutiveFallbacks).toBe(0);
  });

  it('shouldEscalate returns true after 3 consecutive fallbacks', () => {
    tracker.update('fallback');
    tracker.update('fallback');
    tracker.update('fallback');
    expect(tracker.shouldEscalate()).toBe(true);
  });

  it('shouldEscalate returns false with fewer than 3 fallbacks', () => {
    tracker.update('fallback');
    tracker.update('fallback');
    expect(tracker.shouldEscalate()).toBe(false);
  });

  it('shouldEscalate resets after escalation', () => {
    tracker.update('fallback');
    tracker.update('fallback');
    tracker.update('fallback');
    expect(tracker.shouldEscalate()).toBe(true);
    tracker.reset();
    expect(tracker.shouldEscalate()).toBe(false);
  });

  it('resets context on reset', () => {
    tracker.update('experience', { company: 'telefonica' });
    tracker.reset();
    const ctx = tracker.getContext();
    expect(ctx.lastIntent).toBeUndefined();
    expect(ctx.depth).toBe(0);
  });

  it('expires after 5 minutes of inactivity', () => {
    vi.useFakeTimers();
    tracker.update('experience');
    vi.advanceTimersByTime(6 * 60 * 1000); // 6 minutes
    const ctx = tracker.getContext();
    expect(ctx.lastIntent).toBeUndefined();
    expect(ctx.depth).toBe(0);
    vi.useRealTimers();
  });
});
