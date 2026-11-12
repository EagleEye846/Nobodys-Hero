// UI text, drawn in UI space (640x480). The fonts live in assets/fonts and are
// declared in index.html; if they can't load, a plain font of the same kind stands in.
const FONTS = {
  // Everything except enemy speech: retro and crisp.
  ui: { family: "'VT323', monospace", weight: 400 },
  // Enemy speech bubbles: smaller and smoother.
  speech: { family: "'Nunito', sans-serif", weight: 700 },
};
const FONT_LOAD_TIMEOUT_MS = 8000;

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
  return ctx.measureText(stripStyle(text)).width;
}

// Coloured and shaking words. In the text box (and the goal line), a few
// words can be picked out: {c:gold}Haddock's Light{/c} in a colour from
// TEXT_COLORS, and {fx:shake}so cold{/fx} trembling, for cold, fear or a
// shout. They can go together, and either can run on over a page break.
// Anywhere else that shows text, the tags are simply left out (stripStyle),
// so the words still read; and every check measures them without the tags.
export const TEXT_COLORS = {
  gold: '#ffe14d',
  red: '#ff6b6b',
  blue: '#7fd4ff',
  green: '#8ff0a4',
  grey: '#9a94b8',
};
export const TEXT_EFFECTS = ['shake'];
export const STYLE_TAG = /\{(c:[a-z]+|fx:[a-z]+|\/c|\/fx)\}/g;
export function stripStyle(text) {
  return String(text).replace(STYLE_TAG, '');
}
// While the box splits a page to fit, each tag stands as this invisible
// mark (no width), with what it does in `styles`, in order.
export const STYLE_MARK = '⁡';
export function markStyles(text) {
  const styles = [];
  const marked = String(text).replace(STYLE_TAG, (all, tag) => {
    const [kind, value] = tag.startsWith('/') ? [tag.slice(1), null] : tag.split(':');
    styles.push({ kind, value });
    return STYLE_MARK;
  });
  return { text: marked, styles };
}
// How the words look from a style mark on: `look` ({ color, shake })
// changed by one entry of `styles`.
export function applyStyle(look, { kind, value }) {
  if (kind === 'c') look.color = value ? TEXT_COLORS[value] ?? null : null;
  if (kind === 'fx') look.shake = value === 'shake';
}

// One line with coloured words in it ({c:gold}...{/c}), drawn at x, y.
export function drawStyledLine(ctx, text, x, y, { size = 28, color = '#fff', outline = null, align = 'left' } = {}) {
  setFont(ctx, size);
  const { text: marked, styles } = markStyles(text);
  const plain = marked.replaceAll(STYLE_MARK, '');
  const width = ctx.measureText(plain).width;
  const left = align === 'center' ? x - width / 2 : align === 'right' ? x - width : x;
  const look = { color: null, shake: false };
  let at = 0;
  let run = '';
  const flush = () => {
    if (!run) return;
    setFont(ctx, size);
    const runX = left + ctx.measureText(plain.slice(0, at - run.length)).width;
    drawText(ctx, run, runX, y, { size, color: look.color ?? color, outline });
    run = '';
  };
  for (const ch of marked) {
    if (ch === STYLE_MARK) {
      flush();
      applyStyle(look, styles.shift());
      continue;
    }
    run += ch;
    at++;
  }
  flush();
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
  return stripStyle(text).split('\n').flatMap((paragraph) => wrapParagraph(ctx, paragraph, maxWidth));
}

// Lays out dialogue the Deltarune way: each paragraph ('\n'-separated) starts
// with "* ", and wrapped lines hang indented under the first word.
export function layoutDialogue(ctx, text, maxWidth, size) {
  setFont(ctx, size);
  const indent = ctx.measureText('* ').width;
  const lines = [];
  for (const paragraph of stripStyle(text).split('\n')) {
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
  // No page of just a word or two left over ("anything."): bring a few words
  // over from the end of the page before, so the carried-on page reads as a line.
  for (let i = 1; i < pages.length; i++) {
    const rest = pages[i];
    if (!rest.startsWith(CONTINUED) || rest.includes('\n')) continue;
    const carried = rest.slice(CONTINUED.length).split(' ');
    if (carried.length >= 4) continue;
    const before = pages[i - 1];
    const cut = before.lastIndexOf('\n') + 1;
    const tail = before.slice(cut).split(' ');
    while (carried.length < 4 && tail.length > 4) {
      const moved = [tail[tail.length - 1], ...carried];
      if (!fits(CONTINUED + moved.join(' '))) break;
      carried.unshift(tail.pop());
    }
    pages[i - 1] = before.slice(0, cut) + tail.join(' ');
    pages[i] = CONTINUED + carried.join(' ');
  }
  return pages;
}

// Draws laid-out dialogue, revealing only the first `visible` characters (for typewriter text).
// With `runs` (from the text box: [{ at, color, shake }], each the look of
// the words from `at` characters into `page` on), coloured and shaking
// words are drawn as such.
export function drawDialogue(ctx, lines, x, y, { size = 28, color = '#fff', lineHeight = size, visible = Infinity, runs = null, page = null } = {}) {
  setFont(ctx, size);
  ctx.textAlign = 'left';
  ctx.fillStyle = color;
  let remaining = visible;
  let from = 0;
  lines.forEach((line, i) => {
    if (remaining <= 0) return;
    const lineY = y + i * lineHeight;
    if (line.bullet) ctx.fillText('*', x, lineY);
    const shown = line.text.slice(0, remaining);
    if (runs?.length && page !== null) {
      // Where this line starts in the page (the lines are its words, in order).
      const start = line.text ? Math.max(from, page.indexOf(line.text, from)) : from;
      from = start + line.text.length;
      drawRuns(ctx, line.text, shown, start, x + line.indent, lineY, color, runs);
      ctx.fillStyle = color;
    } else {
      ctx.fillText(shown, x + line.indent, lineY);
    }
    remaining -= line.text.length;
  });
}

// One line's words in their looks: each stretch of one colour at once, and
// shaking letters one at a time, each jumping a pixel or so.
function drawRuns(ctx, text, shown, start, x, y, color, runs) {
  const lookAt = (index) => {
    let look = null;
    for (const run of runs) if (run.at <= index) look = run;
    return look;
  };
  const jolt = Math.floor(performance.now() / 60);
  let j = 0;
  while (j < shown.length) {
    const look = lookAt(start + j);
    let end = j + 1;
    while (end < shown.length && lookAt(start + end) === look) end++;
    ctx.fillStyle = look?.color ?? color;
    if (look?.shake) {
      for (let k = j; k < end; k++) {
        const dx = ((jolt * 7 + k * 5) % 3) - 1;
        const dy = ((jolt * 3 + k * 11) % 3) - 1;
        ctx.fillText(shown[k], x + ctx.measureText(text.slice(0, k)).width + dx, y + dy);
      }
    } else {
      ctx.fillText(shown.slice(j, end), x + ctx.measureText(text.slice(0, j)).width, y);
    }
    j = end;
  }
}
