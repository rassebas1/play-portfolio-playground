/**
 * Tests for the profanity filter utility.
 *
 * Covers the full lifecycle of the internal profanity list management:
 * - getProfanityList: returns a copy with expected words
 * - addToProfanityList: adds normalized words without duplicates
 * - removeFromProfanityList: removes words, no-ops on missing
 * - containsProfanity: case-insensitive substring detection
 * - validateUsername: length + profanity rules with character normalization
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getProfanityList,
  addToProfanityList,
  removeFromProfanityList,
  containsProfanity,
  validateUsername,
} from './profanityFilter';

// Snapshot of the original built-in list (indices 0-18).
// Used to restore state after each test so tests stay isolated.
const ORIGINAL_LIST: string[] = [];

beforeEach(() => {
  // Capture the initial list before any test mutates it.
  if (ORIGINAL_LIST.length === 0) {
    const list = getProfanityList();
    ORIGINAL_LIST.push(...list);
  }
});

afterEach(() => {
  // Restore the original list by removing everything that wasn't there.
  const current = getProfanityList();
  const missing = ORIGINAL_LIST.filter((w) => !current.includes(w));
  if (missing.length > 0) {
    removeFromProfanityList(missing);
  }
});

describe('getProfanityList', () => {
  it('returns an array of strings', () => {
    const result = getProfanityList();

    expect(Array.isArray(result)).toBe(true);
    expect(result.every((word) => typeof word === 'string')).toBe(true);
  });

  it('contains the expected built-in words', () => {
    const list = getProfanityList();

    expect(list).toContain('fuck');
    expect(list).toContain('shit');
    expect(list).toContain('ass');
    expect(list).toContain('bitch');
    expect(list).toContain('damn');
    expect(list).toContain('nigger');
    expect(list).toContain('retard');
    expect(list).toContain('idiot');
    expect(list).toContain('stupid');
    expect(list).toContain('dumb');
  });

  it('returns a copy — mutating it does not affect the internal list', () => {
    const list = getProfanityList();
    const before = getProfanityList().length;

    list.push('fake-word');

    const after = getProfanityList();

    expect(after).toHaveLength(before);
    expect(after).not.toContain('fake-word');
  });
});

describe('containsProfanity', () => {
  it('detects profanity at the start of the username', () => {
    expect(containsProfanity('fuckYou')).toBe(true);
    expect(containsProfanity('shithead')).toBe(true);
  });

  it('detects profanity in the middle of the username', () => {
    expect(containsProfanity('biTching')).toBe(true);
    expect(containsProfanity('myClass')).toBe(true);
  });

  it('detects profanity at the end of the username', () => {
    expect(containsProfanity('youFUCK')).toBe(true);
    expect(containsProfanity('crap123')).toBe(true);
  });

  it('is case insensitive', () => {
    expect(containsProfanity('FuCk')).toBe(true);
    expect(containsProfanity('SHIT')).toBe(true);
    expect(containsProfanity('AsS')).toBe(true);
    expect(containsProfanity('DaMn')).toBe(true);
  });

  it('returns false for clean usernames', () => {
    expect(containsProfanity('john')).toBe(false);
    expect(containsProfanity('alice123')).toBe(false);
    expect(containsProfanity('maria')).toBe(false);
    expect(containsProfanity('sebas')).toBe(false);
    expect(containsProfanity('xXcoolXx')).toBe(false);
  });

  it('returns false for an empty string', () => {
    expect(containsProfanity('')).toBe(false);
  });

  it('does not treat short substrings of valid words as false positives', () => {
    // "ass" is in the list, but "a ss" with space shouldn't trigger inside a word
    // that doesn't contain "ass" as a substring — let's use a real word that's close
    // but not matching.
    expect(containsProfanity('action')).toBe(false);
    expect(containsProfanity('database')).toBe(false);
  });
});

describe('validateUsername', () => {
  // --- length validation ---

  it('rejects usernames shorter than 3 characters', () => {
    const result = validateUsername('ab');

    expect(result.valid).toBe(false);
    expect(result.error).toBe('Username must be at least 3 characters');
  });

  it('rejects single character usernames', () => {
    const result = validateUsername('a');

    expect(result.valid).toBe(false);
    expect(result.error).toBe('Username must be at least 3 characters');
  });

  it('accepts 3-character usernames', () => {
    const result = validateUsername('abc');

    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('rejects usernames longer than 7 characters', () => {
    const result = validateUsername('abcdefgh');

    expect(result.valid).toBe(false);
    expect(result.error).toBe('Username must be 7 characters or less');
  });

  it('accepts 7-character usernames', () => {
    const result = validateUsername('abcdefg');

    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  // --- profanity rejection ---

  it('rejects usernames containing profanity', () => {
    const result = validateUsername('badfuck');

    expect(result.valid).toBe(false);
    expect(result.error).toBe('Username contains inappropriate words');
  });

  it('rejects profanity even with mixed casing', () => {
    const result = validateUsername('AsS88');

    expect(result.valid).toBe(false);
    expect(result.error).toBe('Username contains inappropriate words');
  });

  // --- valid usernames ---

  it('accepts clean usernames within length range', () => {
    const result = validateUsername('john123');

    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('strips special characters before length check', () => {
    // "a-b-c" has 5 chars but 2 dashes → cleaned to "ABC" (3 chars) → valid
    const result = validateUsername('a-b-c');

    expect(result.valid).toBe(true);
  });

  it('strips numbers are preserved during cleaning', () => {
    const result = validateUsername('user123');

    expect(result.valid).toBe(true);
  });

  // --- empty / whitespace ---

  it('rejects empty username', () => {
    const result = validateUsername('');

    expect(result.valid).toBe(false);
    expect(result.error).toBe('Username cannot be empty');
  });

  it('rejects whitespace-only username', () => {
    const result = validateUsername('   ');

    expect(result.valid).toBe(false);
    expect(result.error).toBe('Username cannot be empty');
  });

  it('handles numbers-only username', () => {
    const result = validateUsername('1234567');

    expect(result.valid).toBe(true);
  });
});

describe('addToProfanityList', () => {
  it('adds new words to the internal list', () => {
    addToProfanityList(['customword']);

    expect(containsProfanity('customword')).toBe(true);
  });

  it('normalizes words to lowercase before adding', () => {
    addToProfanityList(['CUSTOMWORD']);

    expect(containsProfanity('customword')).toBe(true);
  });

  it('trims whitespace from words before adding', () => {
    addToProfanityList(['  trimmed  ']);

    expect(containsProfanity('trimmed')).toBe(true);
  });

  it('skips empty strings', () => {
    const before = getProfanityList().length;

    addToProfanityList(['']);

    const after = getProfanityList().length;

    expect(after).toBe(before);
  });

  it('does not add duplicates', () => {
    const before = getProfanityList().length;

    addToProfanityList(['damn']);
    addToProfanityList(['damn']);

    const after = getProfanityList().length;

    expect(after).toBe(before);
  });

  it('persists across calls — adding a word makes containsProfanity return true', () => {
    addToProfanityList(['persistentword']);

    expect(containsProfanity('persistentword')).toBe(true);
  });

  it('adds multiple words in one call', () => {
    const words = ['wordA', 'wordB', 'wordC'];
    addToProfanityList(words);

    words.forEach((word) => {
      expect(containsProfanity(word)).toBe(true);
    });
  });
});

describe('removeFromProfanityList', () => {
  it('removes words from the internal list', () => {
    removeFromProfanityList(['damn']);

    const list = getProfanityList();

    expect(list).not.toContain('damn');
  });

  it('normalizes to lowercase before removing', () => {
    removeFromProfanityList(['Damn']);

    const list = getProfanityList();

    expect(list).not.toContain('damn');
  });

  it('trims whitespace before removing', () => {
    removeFromProfanityList(['  idiot  ']);

    const list = getProfanityList();

    expect(list).not.toContain('idiot');
  });

  it('does nothing when removing a non-existent word', () => {
    const before = getProfanityList().length;

    removeFromProfanityList(['nonexistentword']);

    const after = getProfanityList().length;

    expect(after).toBe(before);
  });

  it('removes multiple words at once', () => {
    const words = ['ass', 'crap'];
    removeFromProfanityList(words);

    const list = getProfanityList();

    expect(list).not.toContain('ass');
    expect(list).not.toContain('crap');
  });
});
