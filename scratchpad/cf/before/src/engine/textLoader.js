// Loads the game's text from the /text folder (see text/README.txt for the format).
//
// A file becomes { sectionName: [entry, entry, ...] }. Entries are separated by
// blank lines; the lines inside one entry are joined with '\n', which the
// dialogue boxes show as separate "* " paragraphs.

export function parseTextFile(source) {
  const sections = {};
  let section = null;
  let entry = [];
  // A `# voice: <id>` comment above an entry: its words are a recorded line
  // (see voiceOf).
  let voice = null;

  const finishEntry = () => {
    if (section && entry.length) {
      const text = entry.join('\n');
      sections[section].push(text);
      if (voice) VOICED.set(text, voice);
      voice = null;
    }
    entry = [];
  };

  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line.startsWith('#')) {
      const marked = line.match(/^#\s*voice:\s*(\S+)/);
      if (marked) voice = marked[1];
      continue;
    }
    const header = line.match(/^\[(.+)\]$/);
    if (header) {
      finishEntry();
      section = header[1].trim();
      sections[section] = [];
    } else if (!line) {
      finishEntry();
    } else if (section) {
      entry.push(line);
    }
  }
  finishEntry();
  return sections;
}

// The id of the recorded line an entry's words are (its `# voice:` comment),
// or null. src/audio/voiceClips.js says which recording each id plays.
const VOICED = new Map();
export function voiceOf(text) {
  return VOICED.get(text) ?? null;
}

const files = new Map();

// Fetches and parses every listed file. Call once before the game starts.
export async function loadTextFiles(paths) {
  await Promise.all(paths.map(async (path) => {
    const response = await fetch(`text/${path}`);
    if (!response.ok) throw new Error(`Couldn't load text/${path} (${response.status})`);
    files.set(path, parseTextFile(await response.text()));
  }));
}

export function textFile(path) {
  const file = files.get(path);
  if (!file) throw new Error(`text/${path} isn't loaded. Add it to src/data/textManifest.js.`);
  return file;
}

// A place that has changed can have its own words for things. With
// setTextVariant('calm') (the chapter 5 coast after the storm, set by the
// room), asking for [quay_lamp] gives [quay_lamp_calm] when the file has one,
// and [quay_lamp] when it doesn't.
let variant = null;
export function setTextVariant(name) {
  variant = name || null;
}
export function variantSection(path, name) {
  const key = variant && `${name}_${variant}`;
  return key && textFile(path)[key]?.length ? key : name;
}

// Things you look at can move on with the story too, the way townsfolk's
// lines do in npcs/ and shops/: [quay_fisher_a after wreck_star_shard] is
// used instead of [quay_fisher_a] once that scene has played (the latest
// scene seen wins). `seen` is the list of scenes played, oldest first. A
// `_calm` version (above) still comes first, after the storm.
export function storySection(path, name, seen = []) {
  const own = variantSection(path, name);
  if (own !== name) return own;
  const words = textFile(path);
  const scene = [...seen].reverse().find((id) => words[`${name} after ${id}`]?.length);
  return scene ? `${name} after ${scene}` : name;
}

// Words that take turns. The `n`th time you look at a thing (or talk to
// someone), [thing] is said first, then [thing 2], [thing 3] and so on, staying
// on the last one there is. A number on its own further on ([quay_bell 10]) is
// said that one time only, then it's back to the usual. `own` is the section
// as the story has it now ([thing_calm], [thing after <scene>]); a later one
// goes [thing 2 after <scene>].
export function turnSection(path, own, n) {
  const words = textFile(path);
  const [base, scene] = own.split(' after ');
  const named = (k) => (scene ? `${base} ${k} after ${scene}` : `${own} ${k}`);
  if (n > 1 && words[named(n)]?.length) return named(n);
  let last = 1;
  while (words[named(last + 1)]?.length) last++;
  return n > 1 && last > 1 ? named(Math.min(n, last)) : own;
}

// What a friend says after a section, if the file has it: `_ves` (or
// `_bramble`) goes on the first word, so [repeat 2 after x] is answered by
// [repeat_ves 2 after x], and [quay_bell 10] by [quay_bell_ves 10].
export function answerSection(section, end) {
  return section.replace(/^(\S+)/, `$1${end}`);
}

// One section's entries. Throws a clear error if the section is missing.
export function textSection(path, name) {
  const entries = textFile(path)[variantSection(path, name)];
  if (!entries?.length) throw new Error(`text/${path} has no [${name}] section.`);
  return entries;
}
