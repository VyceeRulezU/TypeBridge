/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getSelector, verifySelector, findElement } from '../../src/utils/selectorEngine.js';

describe('selectorEngine', () => {
  beforeEach(() => {
    // Clear document body before each test
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getSelector', () => {
    it('returns empty string and logs warning for null input', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      expect(getSelector(null)).toBe('');
      expect(getSelector(undefined)).toBe('');
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('returns #id for element with id', () => {
      document.body.innerHTML = '<div id="hero-headline" contenteditable="true">Build faster.</div>';
      const el = document.getElementById('hero-headline');
      expect(getSelector(el)).toBe('#hero-headline');
    });

    it('escapes special characters in id', () => {
      document.body.innerHTML = '<div id="hero:headline" contenteditable="true">Build faster.</div>';
      const el = document.getElementById('hero:headline');
      expect(getSelector(el)).toBe('#hero\\:headline');
    });

    it('returns attribute selector for element with data-block-id', () => {
      document.body.innerHTML = '<div data-block-id="abc123" contenteditable="true">Features</div>';
      const el = document.querySelector('[data-block-id="abc123"]');
      expect(getSelector(el)).toBe('[data-block-id="abc123"]');
    });

    it('returns unique class selector if combination is unique', () => {
      document.body.innerHTML = `
        <div class="elementor-widget-container">
          <p class="unique-text-class">Copy</p>
        </div>
      `;
      const el = document.querySelector('.unique-text-class');
      expect(getSelector(el)).toBe('.unique-text-class');
    });

    it('falls back to nth-child path if no unique id or class', () => {
      document.body.innerHTML = `
        <div class="elementor-widget-container">
          <div class="elementor-text-editor">
            <p>Some copy here</p>
            <p>Second copy</p>
          </div>
        </div>
      `;
      const p = document.querySelectorAll('p')[1]; // Second <p>
      const selector = getSelector(p);
      expect(selector).toContain(':nth-child(2)');
      expect(verifySelector(selector)).toBe(true);
      expect(findElement(selector)).toBe(p);
    });

    it('caps the nth-child path at 5 levels', () => {
      document.body.innerHTML = `
        <div><div><div><div><div><div>
          <p id="targetP">Deep copy</p>
        </div></div></div></div></div></div>
      `;
      const p = document.getElementById('targetP');
      // Temporarily remove ID to force nth-child fallback
      p.removeAttribute('id');
      const selector = getSelector(p);
      // Path length logic: split by ' > ' should be at most 5 + potential body depending on how long
      // Actually the capping algorithm stops at 5 levels of traversal.
      const parts = selector.split(' > ');
      expect(parts.length).toBeLessThanOrEqual(6); // 5 elements + body
    });
  });

  describe('verifySelector', () => {
    it('returns true for valid, unique selector', () => {
      document.body.innerHTML = '<div id="unique"></div>';
      expect(verifySelector('#unique')).toBe(true);
    });

    it('returns false for selector matching 0 elements', () => {
      expect(verifySelector('#nonexistent')).toBe(false);
    });

    it('returns false for selector matching >1 elements', () => {
      document.body.innerHTML = '<div class="duplicate"></div><div class="duplicate"></div>';
      expect(verifySelector('.duplicate')).toBe(false);
    });

    it('returns false for null or empty selector', () => {
      expect(verifySelector(null)).toBe(false);
      expect(verifySelector('')).toBe(false);
    });
  });

  describe('findElement', () => {
    it('returns the correct element', () => {
      document.body.innerHTML = '<div id="find-me"></div>';
      const el = document.getElementById('find-me');
      expect(findElement('#find-me')).toBe(el);
    });

    it('returns null for non-existent selector', () => {
      expect(findElement('#nope')).toBeNull();
    });

    it('returns null for empty selector', () => {
      expect(findElement('')).toBeNull();
      expect(findElement(null)).toBeNull();
    });
  });
});
