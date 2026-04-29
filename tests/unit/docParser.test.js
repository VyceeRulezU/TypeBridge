import { describe, it, expect, beforeAll } from 'vitest';
import { parseDocument } from '../../src/parser/docParser.js';

describe('docParser', () => {
  beforeAll(() => {
    // Provide a mock for crypto.randomUUID if running in an older Node environment
    if (typeof globalThis.crypto === 'undefined') {
      globalThis.crypto = {
        randomUUID: () => 'mock-uuid-' + Math.random().toString(36).substring(2, 9)
      };
    } else if (!globalThis.crypto.randomUUID) {
      globalThis.crypto.randomUUID = () => 'mock-uuid-' + Math.random().toString(36).substring(2, 9);
    }
  });

  it('Empty string returns empty array', () => {
    expect(parseDocument('')).toEqual([]);
    expect(parseDocument('   \n  ')).toEqual([]);
  });

  it('Single H1 with body parses correctly', () => {
    const raw = '# Hero Section\nThis is the body.';
    const result = parseDocument(raw);
    expect(result.length).toBe(1);
    expect(result[0].level).toBe('h1');
    expect(result[0].heading).toBe('Hero Section');
    expect(result[0].body).toBe('This is the body.');
    expect(result[0].id).toBeDefined();
    expect(result[0].status).toBe('pending');
  });

  it('Mixed H1, H2, H3, body parses into correct hierarchy', () => {
    const raw = `
# Main Title
Intro text.

## Subtitle
Sub text.

### Feature 1
Feature body.

1. Feature 2
Another body.
    `;
    const result = parseDocument(raw);
    expect(result.length).toBe(4);
    
    expect(result[0].level).toBe('h1');
    expect(result[0].heading).toBe('Main Title');
    expect(result[0].body).toBe('Intro text.');

    expect(result[1].level).toBe('h2');
    expect(result[1].heading).toBe('Subtitle');
    expect(result[1].body).toBe('Sub text.');

    expect(result[2].level).toBe('h3');
    expect(result[2].heading).toBe('Feature 1');
    expect(result[2].body).toBe('Feature body.');

    expect(result[3].level).toBe('h3');
    expect(result[3].heading).toBe('Feature 2');
    expect(result[3].body).toBe('Another body.');
  });

  it('ALL CAPS detection works', () => {
    const raw = 'THIS IS ALL CAPS\nSome body text';
    const result = parseDocument(raw);
    expect(result.length).toBe(1);
    expect(result[0].level).toBe('h2');
    expect(result[0].heading).toBe('THIS IS ALL CAPS');
    expect(result[0].body).toBe('Some body text');
  });

  it('Short line with trailing blank line works as h2', () => {
    const raw = 'Short Title\n\nBody text follows';
    const result = parseDocument(raw);
    expect(result.length).toBe(1);
    expect(result[0].level).toBe('h2');
    expect(result[0].heading).toBe('Short Title');
    expect(result[0].body).toBe('Body text follows');
  });

  it('No-heading document returns single section', () => {
    const raw = 'Just a document with no headings.\nIt has multiple lines.\n\nAnd paragraphs.';
    const result = parseDocument(raw);
    expect(result.length).toBe(1);
    expect(result[0].level).toBe('body');
    expect(result[0].heading).toBe('Document');
    expect(result[0].body).toBe('Just a document with no headings.\nIt has multiple lines.\n\nAnd paragraphs.');
  });

  it('Windows line endings parse correctly', () => {
    const raw = '# Windows\r\nLine 1.\r\n\r\nLine 2.';
    const result = parseDocument(raw);
    expect(result[0].body).toBe('Line 1.\n\nLine 2.');
  });

  it('Whitespace-only lines are skipped', () => {
    const raw = '# Whitespace\n  \nBody text.\n\t\nMore Body text.';
    const result = parseDocument(raw);
    expect(result[0].body).toBe('Body text.\n\nMore Body text.');
  });

  it('Every section object has all required fields with correct defaults', () => {
    const raw = '# Heading\nBody';
    const result = parseDocument(raw);
    const sec = result[0];
    
    expect(sec).toHaveProperty('id');
    expect(sec).toHaveProperty('level', 'h1');
    expect(sec).toHaveProperty('heading', 'Heading');
    expect(sec).toHaveProperty('body', 'Body');
    expect(sec).toHaveProperty('status', 'pending');
    expect(sec).toHaveProperty('appliedAt', null);
    expect(sec).toHaveProperty('originalText', null);
    expect(sec).toHaveProperty('targetSelector', null);
  });
});
