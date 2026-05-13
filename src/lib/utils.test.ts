/**
 * Tests for the cn() utility function.
 *
 * Verifies the behavior of clsx + tailwind-merge composition:
 * - Conditional class application (clsx behavior)
 * - Tailwind conflict resolution (twMerge behavior)
 * - Edge cases: empty calls, null/undefined, object syntax
 */
import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  describe('basic merging', () => {
    it('joins multiple class names with spaces', () => {
      const result = cn('px-4', 'py-2', 'text-sm');

      expect(result).toBe('px-4 py-2 text-sm');
    });

    it('handles a single class', () => {
      const result = cn('bg-red-500');

      expect(result).toBe('bg-red-500');
    });
  });

  describe('falsy values and conditionals', () => {
    it('filters out false booleans', () => {
      const result = cn('base', false, 'visible');

      expect(result).toBe('base visible');
    });

    it('filters out null values', () => {
      const result = cn('base', null, 'visible');

      expect(result).toBe('base visible');
    });

    it('filters out undefined values', () => {
      const result = cn('base', undefined, 'visible');

      expect(result).toBe('base visible');
    });

    it('filters out empty strings', () => {
      const result = cn('base', '', 'visible');

      expect(result).toBe('base visible');
    });

    it('filters out 0 (falsy but not a valid class name)', () => {
      const result = cn('base', 0, 'visible');

      expect(result).toBe('base visible');
    });
  });

  describe('Tailwind conflict resolution (twMerge)', () => {
    it('keeps the last conflicting padding class', () => {
      const result = cn('px-4', 'px-6');

      expect(result).toBe('px-6');
    });

    it('keeps the last conflicting padding-y classes', () => {
      const result = cn('py-2', 'py-8');

      expect(result).toBe('py-8');
    });

    it('keeps the last conflicting text color class', () => {
      const result = cn('text-red-500', 'text-blue-600');

      expect(result).toBe('text-blue-600');
    });

    it('keeps the last conflicting width class', () => {
      const result = cn('w-1/2', 'w-full');

      expect(result).toBe('w-full');
    });

    it('resolves conflicts when non-conflicting classes are interleaved', () => {
      const result = cn('flex', 'px-4', 'text-sm', 'px-6', 'items-center');

      expect(result).toBe('flex text-sm px-6 items-center');
    });

    it('handles multiple conflicting groups at once', () => {
      const result = cn('p-4 text-red-500', 'p-8 text-blue-600');

      expect(result).toBe('p-8 text-blue-600');
    });
  });

  describe('empty call', () => {
    it('returns an empty string when called with no arguments', () => {
      const result = cn();

      expect(result).toBe('');
    });

    it('returns an empty string when all inputs are falsy', () => {
      const result = cn(false, null, undefined, '', 0);

      expect(result).toBe('');
    });
  });

  describe('object syntax', () => {
    it('applies classes when object values are truthy', () => {
      const result = cn({ 'text-red-500': true, 'font-bold': true });

      expect(result).toBe('text-red-500 font-bold');
    });

    it('omits classes when object values are falsy', () => {
      const result = cn({ 'text-red-500': false, 'font-bold': true });

      expect(result).toBe('font-bold');
    });

    it('merges object syntax with string classes', () => {
      const result = cn('flex', { 'items-center': true, 'hidden': false }, 'text-sm');

      expect(result).toBe('flex items-center text-sm');
    });

    it('resolves Tailwind conflicts with object syntax', () => {
      const result = cn({ 'p-4': true }, { 'p-8': true });

      expect(result).toBe('p-8');
    });

    it('handles deeply nested conditions in object syntax', () => {
      const isActive = true;
      const isDisabled = false;
      const result = cn(
        'base',
        { 'active': isActive, 'disabled': isDisabled },
        { 'visible': true },
      );

      expect(result).toBe('base active visible');
    });
  });

  describe('array syntax', () => {
    it('flattens nested arrays of class strings', () => {
      const result = cn(['px-4', 'py-2'], ['text-sm', 'font-bold']);

      expect(result).toBe('px-4 py-2 text-sm font-bold');
    });

    it('merges arrays with conflict resolution', () => {
      const result = cn(['px-4', 'py-2'], ['px-6']);

      expect(result).toBe('py-2 px-6');
    });
  });

  describe('mixed usage', () => {
    it('combines strings, objects, arrays, and conditionals', () => {
      const isActive = true;
      const isLarge = false;

      const result = cn(
        'flex items-center',
        isActive && 'bg-blue-500',
        { 'rounded': true, 'hidden': false },
        'text-sm',
        isLarge && 'text-xl',
        ['px-4', 'py-2'],
      );

      expect(result).toBe('flex items-center bg-blue-500 rounded text-sm px-4 py-2');
    });
  });
});
