/**
 * @typedef {Object} Section
 * @property {string} id - Unique ID (uuid or timestamp-based)
 * @property {'h1'|'h2'|'h3'|'body'} level - Heading level or body
 * @property {string} heading - Section heading text (empty string for body blocks)
 * @property {string} body - Section body text
 * @property {'pending'|'applied'|'skipped'} status - Current status
 * @property {number|null} appliedAt - Timestamp when applied, null if not
 * @property {string|null} originalText - Text that was replaced, null until applied
 * @property {string|null} targetSelector - CSS selector of target element, null until applied
 */

/**
 * Parses raw pasted text into a structured array of section objects
 * @param {string} rawText - Raw pasted text from user
 * @returns {Section[]} Array of section objects
 */
export function parseDocument(rawText) {
  console.log('TypeBridge Parser: Starting parse with text length:', rawText?.length);
  if (!rawText || !rawText.trim()) {
    console.warn('TypeBridge Parser: Empty text received.');
    return [];
  }

  const lines = rawText.split(/\r?\n/).map(line => line.trim());
  const sections = [];
  let currentSection = null;

  const createSection = (level, heading) => ({
    id: typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : `sec-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    level,
    heading,
    body: [],
    status: 'pending',
    appliedAt: null,
    originalText: null,
    targetSelector: null,
  });

  let hasSeenAnyHeading = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    let isHeading = false;
    let level = 'body';
    let headingText = '';

    const wordCount = line.split(/\s+/).filter(w => w.length > 0).length;
    const hasLetters = /[A-Za-z]/.test(line);

    // Markdown style
    if (/^###\s*/.test(line)) {
      isHeading = true;
      level = 'h3';
      headingText = line.replace(/^###\s*/, '');
    } else if (/^##\s*/.test(line)) {
      isHeading = true;
      level = 'h2';
      headingText = line.replace(/^##\s*/, '');
    } else if (/^#\s*/.test(line)) {
      isHeading = true;
      level = 'h1';
      headingText = line.replace(/^#\s*/, '');
    } 
    // ALL CAPS line
    else if (line.length > 0 && line.length < 100 && line === line.toUpperCase() && hasLetters && wordCount >= 2) {
      isHeading = true;
      level = 'h2';
      headingText = line;
    } 
    // Short line followed by empty line
    else if (line.length > 0 && line.length < 70 && !line.endsWith('.') && i + 1 < lines.length && lines[i+1] === '') {
      isHeading = true;
      level = 'h2';
      headingText = line;
    } 
    // Numbered list item as heading
    else if (/^\d+\.\s+[A-Z]/.test(line) && line.length < 80) {
      isHeading = true;
      level = 'h3';
      headingText = line.replace(/^\d+\.\s+/, '');
    }

    if (isHeading) {
      hasSeenAnyHeading = true;
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = createSection(level, headingText);
    } else {
      if (!currentSection) {
        currentSection = createSection('body', 'Document Start');
      }
      currentSection.body.push(line);
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  const result = [];
  for (const sec of sections) {
    let bodyLines = sec.body;
    
    // Trim leading and trailing empty lines from the body array
    while (bodyLines.length > 0 && bodyLines[0] === '') bodyLines.shift();
    while (bodyLines.length > 0 && bodyLines[bodyLines.length - 1] === '') bodyLines.pop();
    
    sec.body = bodyLines.join('\n');

    if (!hasSeenAnyHeading && sec.heading === 'Document Start') {
      if (sec.body.trim()) result.push(sec);
    } else if (sec.heading === 'Document Start' && bodyLines.length === 0) {
      // Skip empty initial document block if other headings exist
    } else {
      if (sec.heading.trim() || sec.body.trim()) {
        result.push(sec);
      }
    }
  }

  console.log(`TypeBridge Parser: Finished. Found ${result.length} sections.`);
  return result;
}
