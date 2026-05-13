import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { reducer, useToast, toast } from './use-toast';

const createToast = (overrides: Record<string, unknown> = {}) => ({
  id: '1',
  title: 'Test Toast',
  description: 'Test description',
  open: true,
  ...overrides,
});

describe('reducer', () => {
  it('ADD_TOAST adds toast and respects TOAST_LIMIT', () => {
    const state = { toasts: [] };
    const r1 = reducer(state, { type: 'ADD_TOAST', toast: createToast({ id: '1' }) });
    expect(r1.toasts).toHaveLength(1);
    const r2 = reducer(r1, { type: 'ADD_TOAST', toast: createToast({ id: '2' }) });
    expect(r2.toasts).toHaveLength(1);
    expect(r2.toasts[0].id).toBe('2');
  });

  it('UPDATE_TOAST updates existing toast by id', () => {
    const state = { toasts: [createToast({ id: '1', title: 'Original' })] };
    const next = reducer(state, { type: 'UPDATE_TOAST', toast: { id: '1', title: 'Updated' } });
    expect(next.toasts[0].title).toBe('Updated');
  });

  it('DISMISS_TOAST sets open to false for specific toast', () => {
    vi.useFakeTimers();
    const state = { toasts: [createToast({ id: '1' }), createToast({ id: '2' })] };
    const next = reducer(state, { type: 'DISMISS_TOAST', toastId: '1' });
    expect(next.toasts[0].open).toBe(false);
    expect(next.toasts[1].open).toBe(true);
    vi.useRealTimers();
  });

  it('DISMISS_TOAST marks all toasts when no id', () => {
    vi.useFakeTimers();
    const state = { toasts: [createToast({ id: '1' }), createToast({ id: '2' })] };
    const next = reducer(state, { type: 'DISMISS_TOAST' });
    expect(next.toasts.every(t => t.open === false)).toBe(true);
    vi.useRealTimers();
  });

  it('REMOVE_TOAST removes specific toast by id', () => {
    const state = { toasts: [createToast({ id: '1' }), createToast({ id: '2' })] };
    const next = reducer(state, { type: 'REMOVE_TOAST', toastId: '1' });
    expect(next.toasts).toHaveLength(1);
    expect(next.toasts[0].id).toBe('2');
  });

  it('REMOVE_TOAST clears all when no id', () => {
    const state = { toasts: [createToast({ id: '1' }), createToast({ id: '2' })] };
    const next = reducer(state, { type: 'REMOVE_TOAST' });
    expect(next.toasts).toHaveLength(0);
  });
});

describe('toast()', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns dismiss and update functions', () => {
    const result = toast({ title: 'Hello' });
    expect(result.id).toBeDefined();
    expect(typeof result.dismiss).toBe('function');
    expect(typeof result.update).toBe('function');
  });

  it('dismiss can be called to close the toast', () => {
    const result = toast({ title: 'Hello' });
    expect(() => result.dismiss()).not.toThrow();
  });
});

describe('useToast()', () => {
  it('returns toasts array', () => {
    const { result } = renderHook(() => useToast());
    expect(Array.isArray(result.current.toasts)).toBe(true);
  });

  it('returns toast function', () => {
    const { result } = renderHook(() => useToast());
    expect(typeof result.current.toast).toBe('function');
  });

  it('returns dismiss function', () => {
    const { result } = renderHook(() => useToast());
    expect(typeof result.current.dismiss).toBe('function');
  });

  it('adds toast and updates state', () => {
    const { result } = renderHook(() => useToast());
    act(() => {
      toast({ title: 'New Toast' });
    });
    expect(result.current.toasts.length).toBeGreaterThanOrEqual(1);
  });
});
