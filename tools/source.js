// Reading and rewriting the game's JavaScript data files as text, so a save
// changes only what was edited and keeps everything else (comments included).

// Walks code from `start`, skipping strings and comments, and calls
// visit(char, index) for every other character. visit returns true to stop.
function walk(code, start, visit) {
  let i = start;
  const n = code.length;
  while (i < n) {
    const c = code[i];
    if (c === "'" || c === '"' || c === '`') {
      i++;
      while (i < n && code[i] !== c) i += code[i] === '\\' ? 2 : 1;
      i++;
      continue;
    }
    if (c === '/' && code[i + 1] === '/') {
      while (i < n && code[i] !== '\n') i++;
      continue;
    }
    if (c === '/' && code[i + 1] === '*') {
      const end = code.indexOf('*/', i + 2);
      i = end < 0 ? n : end + 2;
      continue;
    }
    if (visit(c, i)) return i;
    i++;
  }
  return -1;
}

const OPEN = { '{': '}', '[': ']', '(': ')' };
const CLOSE = { '}': '{', ']': '[', ')': '(' };

// Checks that brackets balance outside strings and comments.
// Returns { ok: true } or { ok: false, message }.
export function checkBalanced(code) {
  const stack = [];
  let problem = null;
  walk(code, 0, (c, i) => {
    if (OPEN[c]) stack.push({ c, i });
    else if (CLOSE[c]) {
      if (!stack.length || stack.at(-1).c !== CLOSE[c]) {
        problem = `unexpected '${c}' on line ${code.slice(0, i).split('\n').length}`;
        return true;
      }
      stack.pop();
    }
    return false;
  });
  if (problem) return { ok: false, message: problem };
  if (stack.length) return { ok: false, message: `'${stack.at(-1).c}' on line ${code.slice(0, stack.at(-1).i).split('\n').length} is never closed` };
  return { ok: true };
}

// Index just after the bracket that closes the one at `open`.
function matchBracket(code, open) {
  let depth = 0;
  const end = walk(code, open, (c) => {
    if (OPEN[c]) depth++;
    else if (CLOSE[c]) {
      depth--;
      if (depth === 0) return true;
    }
    return false;
  });
  return end < 0 ? -1 : end + 1;
}

// Finds `export const NAME = value;` (or a plain `const NAME = value;`).
// Returns { start, valueStart, valueEnd, end, exported } or null. `end` is
// after the semicolon.
export function findDeclaration(code, name) {
  const pattern = new RegExp(`(^|\\n)([ \\t]*)(export\\s+)?const\\s+${name}\\s*=\\s*`, 'g');
  let match;
  while ((match = pattern.exec(code))) {
    const start = match.index + match[1].length;
    const valueStart = match.index + match[0].length;
    let valueEnd;
    if (OPEN[code[valueStart]]) {
      valueEnd = matchBracket(code, valueStart);
    } else {
      // Something like OTHER.map(...): runs to the first ';' outside brackets.
      let depth = 0;
      const stop = walk(code, valueStart, (c) => {
        if (OPEN[c]) depth++;
        else if (CLOSE[c]) depth--;
        return depth === 0 && (c === ';' || c === '\n');
      });
      valueEnd = stop < 0 ? code.length : stop;
    }
    if (valueEnd < 0) return null;
    let end = valueEnd;
    while (code[end] === ' ' || code[end] === '\t') end++;
    if (code[end] === ';') end++;
    return { start, valueStart, valueEnd, end, exported: Boolean(match[3]) };
  }
  return null;
}

// Replaces a declaration's value with new source text. Throws if it isn't there.
export function replaceValue(code, name, valueSource) {
  const found = findDeclaration(code, name);
  if (!found) throw new Error(`Couldn't find "${name}" in the file.`);
  return code.slice(0, found.valueStart) + valueSource + code.slice(found.valueEnd);
}

// The text of a declaration's value, or ''.
export function valueText(code, name) {
  const found = findDeclaration(code, name);
  return found ? code.slice(found.valueStart, found.valueEnd) : '';
}

// The // comment lines at the very top of a file.
export function headerComment(code) {
  const lines = [];
  for (const line of code.split(/\r?\n/)) {
    if (!line.startsWith('//')) break;
    lines.push(line);
  }
  return lines.join('\n');
}

// The trailing "// note" of each palette entry in a palette literal: { char: note }.
const PALETTE_LINE = /^\s*['"]?([^'"\s:])['"]?\s*:\s*['"](#[0-9a-fA-F]{3,8})['"],?\s*(?:\/\/\s*(.*))?$/;
export function paletteNotes(literal) {
  const notes = {};
  for (const line of literal.split(/\r?\n/)) {
    const m = line.match(PALETTE_LINE);
    if (m && m[3]) notes[m[1]] = m[3].trim();
  }
  return notes;
}

// Comment lines just above each `key: [` or `key: {` in an object literal: { key: ['// ...'] }.
export function entryComments(literal) {
  const out = {};
  let pending = [];
  for (const raw of literal.split(/\r?\n/)) {
    const line = raw.trim();
    if (line.startsWith('//')) { pending.push(line); continue; }
    if (!line) continue;
    const m = line.match(/^(?:['"]([^'"]+)['"]|([A-Za-z_$][\w$]*))\s*:/);
    if (m && pending.length) out[m[1] ?? m[2]] = pending;
    pending = [];
  }
  return out;
}

// --- Writing literals in the game's style ---

export function quote(text) {
  return `'${String(text).split('\\').join('\\\\').split("'").join("\\'").split('\n').join('\\n')}'`;
}

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/;
export const objectKey = (key) => (IDENTIFIER.test(key) ? key : quote(key));
export const isIdentifier = (text) => IDENTIFIER.test(text);

// One-line literal for small values: { wave: 'sine', volume: 0.1 }.
export function inline(value) {
  if (typeof value === 'string') return quote(value);
  if (Array.isArray(value)) return `[${value.map(inline).join(', ')}]`;
  if (value && typeof value === 'object') {
    const entries = Object.entries(value).filter(([, v]) => v !== undefined);
    if (!entries.length) return '{}';
    return `{ ${entries.map(([k, v]) => `${objectKey(k)}: ${inline(v)}`).join(', ')} }`;
  }
  return String(value);
}

// palette: [{ char, color, note }]
export function paletteLiteral(palette, indent = '') {
  const lines = palette.map(({ char, color, note }) => `${indent}  ${objectKey(char)}: ${quote(color)},${note ? ` // ${note}` : ''}`);
  return `{\n${lines.join('\n')}\n${indent}}`;
}

export function rowsLiteral(rows, indent = '') {
  return `[\n${rows.map((row) => `${indent}  ${quote(row)},`).join('\n')}\n${indent}]`;
}

// frames: [{ name, rows }]. comments: { name: ['// ...'] } kept above their entry.
export function framesLiteral(frames, comments = {}, indent = '') {
  const parts = frames.map(({ name, rows }, i) => {
    const notes = comments[name] ?? [];
    const lead = notes.length && i ? '\n' : '';
    return `${lead}${notes.map((c) => `${indent}  ${c}\n`).join('')}${indent}  ${objectKey(name)}: ${rowsLiteral(rows, `${indent}  `)},`;
  });
  return `{\n${parts.join('\n')}\n${indent}}`;
}

// Turns text (possibly several lines) into // comment lines.
export function comment(text, indent = '') {
  return String(text).trim().split(/\r?\n/).map((line) => `${indent}// ${line}`.trimEnd()).join('\n');
}
