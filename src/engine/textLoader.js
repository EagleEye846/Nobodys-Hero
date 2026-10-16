// Loads the game's text from the /text folder (see text/README.txt for the format).
//
// A file becomes { sectionName: [entry, entry, ...] }. Entries are separated by
// blank lines; the lines inside one entry are joined with '\n', which the
// dialogue boxes show as separate "* " paragraphs.

export function parseTextFile(source) {
  const sections = {};
  let section = null;
  let entry = [];

  const finishEntry = () => {
    if (section && entry.length) sections[section].push(entry.join('\n'));
    entry = [];
  };

  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (line.startsWith('#')) continue;
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

// One section's entries. Throws a clear error if the section is missing.
export function textSection(path, name) {
  const entries = textFile(path)[name];
  if (!entries?.length) throw new Error(`text/${path} has no [${name}] section.`);
  return entries;
}
