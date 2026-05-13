import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useIds } from './useIds';

describe('useIds', () => {
  it('returns an array with getNextId function', () => {
    const { result } = renderHook(() => useIds());
    expect(Array.isArray(result.current)).toBe(true);
    expect(typeof result.current[0]).toBe('function');
  });

  it('returns sequential ids starting from 0', () => {
    const { result } = renderHook(() => useIds());
    const [getNextId] = result.current;

    expect(getNextId()).toBe('0');
    expect(getNextId()).toBe('1');
    expect(getNextId()).toBe('2');
  });

  it('maintains separate counters across hook instances', () => {
    const { result: hook1 } = renderHook(() => useIds());
    const { result: hook2 } = renderHook(() => useIds());

    expect(hook1.current[0]()).toBe('0');
    expect(hook1.current[0]()).toBe('1');
    expect(hook2.current[0]()).toBe('0');
    expect(hook2.current[0]()).toBe('1');
  });
});
