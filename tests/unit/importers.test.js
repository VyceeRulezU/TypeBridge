/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
import { htmlToStructuredText, googleDocExportUrl, isGoogleDocLink } from '../../src/parser/importers.js';
import { parseDocument } from '../../src/parser/docParser.js';

describe('htmlToStructuredText', () => {
  it('turns headings into Markdown markers and keeps paragraphs', () => {
    const html = `<html><head><style>.c1{color:red}</style></head><body>
      <p class="c2 title"><span>Landing Page Copy</span></p>
      <h1><span>Hero</span></h1>
      <p><span>Build&nbsp;sites faster.</span></p>
      <h2>Features</h2>
      <p>Line one<br>Line two</p>
      <p></p>
      <h4>Deep heading</h4>
      <ul><li>First</li><li>Second</li></ul>
    </body></html>`;
    expect(htmlToStructuredText(html)).toBe([
      '# Landing Page Copy',
      '# Hero',
      'Build sites faster.',
      '## Features',
      'Line one\nLine two',
      '### Deep heading',
      '- First',
      '- Second'
    ].join('\n\n'));
  });

  it('reads text inside tables', () => {
    const html = '<body><h2>Pricing</h2><table><tbody><tr><td><p>Milestone</p></td><td><p>Amount</p></td></tr></tbody></table></body>';
    expect(htmlToStructuredText(html)).toBe('## Pricing\n\nMilestone\n\nAmount');
  });

  it('imported docs parse into sections without short lines becoming headings', () => {
    const html = '<body><h2>Commercial Terms</h2><p>Milestone</p><p>Amount</p><h2>Timeline</h2><p>Week 10</p></body>';
    const sections = parseDocument(htmlToStructuredText(html));
    expect(sections.map(s => s.heading)).toEqual(['Commercial Terms', 'Timeline']);
    expect(sections[0].body).toBe('Milestone\n\nAmount');
  });
});

describe('Google Docs links', () => {
  it('builds export URLs for regular and published links', () => {
    expect(googleDocExportUrl('https://docs.google.com/document/d/1AbCdEfGhIjKlMnOp/edit?usp=sharing'))
      .toBe('https://docs.google.com/document/d/1AbCdEfGhIjKlMnOp/export?format=html');
    expect(googleDocExportUrl('https://docs.google.com/document/u/1/d/1AbCdEfGhIjKlMnOp/edit'))
      .toBe('https://docs.google.com/document/d/1AbCdEfGhIjKlMnOp/export?format=html');
    expect(googleDocExportUrl('https://docs.google.com/document/d/e/2PACX-1vAbC_dEf/pub'))
      .toBe('https://docs.google.com/document/d/e/2PACX-1vAbC_dEf/pub');
    expect(googleDocExportUrl('https://example.com/doc')).toBeNull();
  });

  it('only treats a bare link as a link', () => {
    expect(isGoogleDocLink('  https://docs.google.com/document/d/1AbCdEfGhIjKlMnOp/edit  ')).toBe(true);
    expect(isGoogleDocLink('See https://docs.google.com/document/d/1AbCdEfGhIjKlMnOp/edit for copy')).toBe(false);
  });
});
