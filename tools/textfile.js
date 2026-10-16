// Reading and rewriting the game's text files (see text/README.txt): sections
// start with [name], blank lines separate entries, # lines are comments.
// setSection() changes one section and keeps every other line as it was.
import { parseTextFile } from '../src/engine/textLoader.js';

export { parseTextFile };

// A section's entries as editable text (entries separated by a blank line).
export function sectionText(source, name) {
  return (parseTextFile(source)[name] ?? []).join('\n\n');
}

// Cleans text typed into a box into the file format: no blank-only lines inside
// an entry, no lines that would read as a header or a comment.
export function normaliseBody(text) {
  return String(text ?? '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .map((line) => line.replace(/^[[#]+\s*/, ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Returns the file with section `name` holding `body`. Comment lines and blank
// lines just above the next section belong to that section and are kept.
// A missing section is added at the end.
export function setSection(source, name, body) {
  const text = normaliseBody(body);
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const headerAt = (i) => /^\s*\[(.+)\]\s*$/.exec(lines[i])?.[1].trim();
  const start = lines.findIndex((_, i) => headerAt(i) === name);
  if (start < 0) {
    const trimmed = source.replace(/\s+$/, '');
    return `${trimmed}${trimmed ? '\n\n' : ''}[${name}]\n${text}\n`;
  }
  let next = start + 1;
  while (next < lines.length && headerAt(next) === undefined) next++;
  // Walk back over the next section's lead-in (its comments and blank lines).
  let end = next;
  while (end > start + 1 && (lines[end - 1].trim() === '' || lines[end - 1].trim().startsWith('#'))) end--;
  // ...but comments directly under this header (before any text) stay put.
  const keptLead = [];
  for (let i = start + 1; i < end && lines[i].trim().startsWith('#'); i++) keptLead.push(lines[i]);
  const tail = lines.slice(end, next);
  const gap = next < lines.length ? (tail.length && tail[0].trim() === '' ? [] : ['']) : [];
  const replacement = [...keptLead, ...(text ? text.split('\n') : [])];
  const out = [...lines.slice(0, start + 1), ...replacement, ...gap, ...tail, ...lines.slice(next)];
  let result = out.join('\n');
  if (!result.endsWith('\n')) result += '\n';
  return result;
}

// A section name not used in the file yet: base, base_2, base_3...
export function freeSectionName(source, base, taken = []) {
  const used = new Set([...Object.keys(parseTextFile(source)), ...taken]);
  if (!used.has(base)) return base;
  for (let n = 2; ; n++) if (!used.has(`${base}_${n}`)) return `${base}_${n}`;
}
