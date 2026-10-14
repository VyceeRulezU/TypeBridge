/**
 * Converts document HTML (Google Docs export, mammoth DOCX output) into the
 * Markdown-style text docParser understands, so real headings survive import.
 * @param {string} html
 * @returns {string}
 */
export function htmlToStructuredText(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const blocks = [];

  const clean = (s) => s.replace(/ /g, ' ').replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').trim();

  // textContent, but keeping <br> as line breaks
  const textOf = (node) => {
    let text = '';
    for (const child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) text += child.nodeValue;
      else if (child.nodeName === 'BR') text += '\n';
      else if (child.nodeType === Node.ELEMENT_NODE) text += textOf(child);
    }
    return text;
  };

  const BLOCK_TAGS = new Set(['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'UL', 'OL', 'TABLE', 'TBODY', 'THEAD', 'TR', 'TD', 'TH', 'DIV', 'SECTION', 'ARTICLE', 'BLOCKQUOTE']);
  const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'HEAD', 'TITLE', 'META', 'LINK']);

  const push = (prefix, el) => {
    const text = clean(textOf(el));
    if (text) blocks.push(prefix + text);
  };

  const walk = (node) => {
    for (const el of node.children) {
      const tag = el.tagName;
      if (SKIP_TAGS.has(tag)) continue;

      if (/^H[1-6]$/.test(tag)) {
        push('#'.repeat(Math.min(Number(tag[1]), 3)) + ' ', el);
      } else if (tag === 'P') {
        // Google Docs exports the "Title" paragraph style as <p class="title">
        push(el.classList.contains('title') ? '# ' : '', el);
      } else if (tag === 'LI') {
        push('- ', el);
      } else if ([...el.children].some(child => BLOCK_TAGS.has(child.tagName))) {
        walk(el);
      } else if (BLOCK_TAGS.has(tag) || tag === 'BODY') {
        push('', el);
      }
    }
  };

  walk(doc.body);
  return blocks.join('\n\n');
}

/**
 * Builds the export URL for a Google Docs link, or null if it isn't one.
 * @param {string} input
 * @returns {string|null}
 */
export function googleDocExportUrl(input) {
  const text = (input || '').trim();
  // "Publish to the web" links: /document/d/e/<id>/pub
  const published = text.match(/docs\.google\.com\/document\/(?:u\/\d+\/)?d\/e\/([\w-]+)/);
  if (published) return `https://docs.google.com/document/d/e/${published[1]}/pub`;

  const regular = text.match(/docs\.google\.com\/document\/(?:u\/\d+\/)?d\/([\w-]{10,})/);
  if (regular) return `https://docs.google.com/document/d/${regular[1]}/export?format=html`;
  return null;
}

/**
 * True when the input is nothing but a Google Docs link.
 * @param {string} input
 */
export function isGoogleDocLink(input) {
  const text = (input || '').trim();
  return !/\s/.test(text) && googleDocExportUrl(text) !== null;
}

/**
 * Downloads a Google Doc as structured text. Uses the browser's Google sign-in,
 * so private docs work for anyone who can open them in this browser.
 * @param {string} url
 * @returns {Promise<string>}
 */
export async function fetchGoogleDoc(url) {
  const exportUrl = googleDocExportUrl(url);
  if (!exportUrl) throw new Error("That doesn't look like a Google Docs link.");

  let res;
  try {
    res = await fetch(exportUrl, { credentials: 'include' });
  } catch (e) {
    throw new Error('Could not reach Google Docs. Check your connection and try again.');
  }

  const host = new URL(res.url).hostname;
  const isGoogleDocsHost = host === 'docs.google.com' || host.endsWith('.googleusercontent.com');
  if ([401, 403, 404].includes(res.status) || !isGoogleDocsHost) {
    throw new Error('Can\'t open this doc. Sign in to Google in this browser with an account that can view it, or set sharing to "Anyone with the link".');
  }
  if (!res.ok) throw new Error(`Google Docs returned an error (${res.status}).`);

  const text = htmlToStructuredText(await res.text());
  if (!text.trim()) throw new Error('That document looks empty.');
  return text;
}
