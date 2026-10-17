// UI text, drawn in UI space (640x480). Fonts are loaded from Google Fonts in
// index.html; if they can't load, a plain font of the same kind stands in.
const FONTS = {
  // Everything except enemy speech: retro and crisp.
  ui: { family: "'VT323', monospace", weight: 400 },
  // Enemy speech bubbles: smaller and smoother.
  speech: { family: "'Nunito', sans-serif", weight: 700 },
};
const FONT_LOAD_TIMEOUT_MS = 2000;

export function loadUiFont() {
  const timeout = new Promise((resolve) => setTimeout(resolve, FONT_LOAD_TIMEOUT_MS));
  const loads = Promise.all(Object.values(FONTS).map(({ family, weight }) => document.fonts.load(`${weight} 20px ${family}`)));
  return Promise.race([loads, timeout]).catch(() => {});
}

function setFont(ctx, size, font = 'ui') {
  const { family, weight } = FONTS[font];
  ctx.font = `${weight} ${size}px ${family}`;
  ctx.textBaseline = 'top';
}

// Draws text with its top at y. '\n' starts a new line. `outline` draws a
// dark edge around the letters so they read over busy backgrounds.
export function drawText(ctx, text, x, y, {
  size = 28, font = 'ui', color = '#fff', align = 'left', lineHeight = size, outline = null, shadow = null,
} = {}) {
  setFont(ctx, size, font);
  ctx.textAlign = align;
  text.split('\n').forEach((line, i) => {
    const lineY = y + i * lineHeight;
    if (shadow) {
      ctx.fillStyle = shadow;
      ctx.fillText(line, x + 2, lineY + 2);
    }
    if (outline) {
      ctx.lineJoin = 'round';
      ctx.lineWidth = 4;
      ctx.strokeStyle = outline;
      ctx.strokeText(line, x, lineY);
    }
    ctx.fillStyle = color;
    ctx.fillText(line, x, lineY);
  });
  ctx.textAlign = 'left';
}

export function textWidth(ctx, text, size, font = 'ui') {
  setFont(ctx, size, font);
  return ctx.measureText(text).width;
}

function wrapParagraph(ctx, paragraph, maxWidth) {
  const lines = [];
  let line = '';
  for (const word of paragraph.split(' ')) {
    const attempt = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(attempt).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = attempt;
    }
  }
  lines.push(line);
  return lines;
}

// Word-wraps text to maxWidth. '\n' still forces a break.
export function wrapLines(ctx, text, maxWidth, size, font = 'ui') {
  setFont(ctx, size, font);
  return text.split('\n').flatMap((paragraph) => wrapParagraph(ctx, paragraph, maxWidth));
}

// Lays out dialogue the Deltarune way: each paragraph ('\n'-separated) starts
// with "* ", and wrapped lines hang indented under the first word.
export function layoutDialogue(ctx, text, maxWidth, size) {
  setFont(ctx, size);
  const indent = ctx.measureText('* ').width;
  const lines = [];
  for (const paragraph of text.split('\n')) {
    // A paragraph carried over from the page before carries on without a new "* ".
    const continued = paragraph.startsWith(CONTINUED);
    wrapParagraph(ctx, continued ? paragraph.slice(1) : paragraph, maxWidth - indent).forEach((line, i) => {
      lines.push({ text: line, bullet: i === 0 && !continued, indent });
    });
  }
  return lines;
}

// Starts a paragraph that carries on from the page before (see paginate).
export const CONTINUED = '\u2060';

// Splits dialogue into pages of at most `maxLines` lines each, so nothing ever
// runs off the bottom of its box: between paragraphs where it can, between
// words when one paragraph is too long for a page on its own.
export function paginate(ctx, text, maxWidth, size, maxLines) {
  const fits = (page) => layoutDialogue(ctx, page, maxWidth, size).length <= maxLines;
  if (fits(text)) return [text];
  const pages = [];
  let page = '';
  for (const paragraph of text.split('\n')) {
    const together = page ? `${page}\n${paragraph}` : paragraph;
    if (fits(together)) {
      page = together;
      continue;
    }
    if (page) pages.push(page);
    page = '';
    let words = paragraph.split(' ');
    let prefix = '';
    while (words.length) {
      let count = 1;
      while (count < words.length && fits(prefix + words.slice(0, count + 1).join(' '))) count++;
      const chunk = prefix + words.slice(0, count).join(' ');
      words = words.slice(count);
      prefix = CONTINUED;
      // The last piece can share its page with the next paragraph.
      if (words.length) pages.push(chunk);
      else page = chunk;
    }
  }
  if (page) pages.push(page);
  return pages;
}

// Draws laid-out dialogue, revealing only the first `visible` characters (for typewriter text).
export function drawDialogue(ctx, lines, x, y, { size = 28, color = '#fff', lineHeight = size, visible = Infinity } = {}) {
  setFont(ctx, size);
  ctx.textAlign = 'left';
  ctx.fillStyle = color;
  let remaining = visible;
  lines.forEach((line, i) => {
    if (remaining <= 0) return;
    const lineY = y + i * lineHeight;
    if (line.bullet) ctx.fillText('*', x, lineY);
    ctx.fillText(line.text.slice(0, remaining), x + line.indent, lineY);
    remaining -= line.text.length;
  });
}
