// Moving saves between browsers and addresses. A browser keeps saves per
// address (localhost:8000 and localhost:8001 each have their own), so a save
// made on one can seem lost on another. EXPORT SAVE downloads every save the
// game keeps here (the one you're on, each chapter's kept save, which
// chapters you've reached, and the little things it remembers) as one .json
// file; IMPORT SAVE reads such a file back in. Options (volume, keys) aren't
// moved: they belong to the computer, not the save.
//
// A file is checked all the way through before anything is written, and what
// was here before is kept under BEFORE_IMPORT_KEY, so a bad file or a full
// storage never costs you the save you had.

const PREFIX = 'ruins-rpg-';
const SAVE_KEY = 'ruins-rpg-save-v1';
const BEFORE_IMPORT_KEY = 'ruins-rpg-before-import-v1';
const FORMAT = 'nobodys-hero-saves';
const VERSION = 1;
// Bigger than any real save file could be.
const MAX_FILE_BYTES = 20 * 1024 * 1024;

const isSaveKey = (key) => key === SAVE_KEY || /^ruins-rpg-save-v1-ch\d+$/.test(key);
// The chapter save with the highest chapter, for a file without a current save.
const latestSave = (keys) => Object.keys(keys).filter((key) => key !== SAVE_KEY && isSaveKey(key)).sort((a, b) => Number(a.split('-ch')[1]) - Number(b.split('-ch')[1])).at(-1);
const looksLikeSave = (value) => value && typeof value === 'object' && value.hero && typeof value.hero === 'object' && value.world && typeof value.world === 'object';

// Every key the game keeps (the backup of the last import aside), as stored.
function gameEntries() {
  const entries = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(PREFIX) && key !== BEFORE_IMPORT_KEY) entries[key] = localStorage.getItem(key);
  }
  return entries;
}

// The export, as an object ready to be written out.
export function buildExport() {
  return { format: FORMAT, version: VERSION, game: "Nobody's Hero", exported: new Date().toISOString(), keys: gameEntries() };
}

// What a save holds, in a few words: "Chapter 5, LV 33".
function describeSave(raw) {
  const save = JSON.parse(raw);
  return `Chapter ${save.world.chapter ?? 1}, LV ${save.hero.level ?? 1}`;
}

// Downloads the export. Returns { ok, saves, error }.
export function exportSaves() {
  try {
    const data = buildExport();
    const saves = Object.keys(data.keys).filter(isSaveKey).length;
    if (!saves) return { ok: false, error: 'There is no save here to export yet.' };
    const blob = new Blob([JSON.stringify(data, null, 1)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `nobodys-hero-save-${data.exported.slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 10000);
    return { ok: true, saves };
  } catch {
    return { ok: false, error: 'The save could not be exported from this browser.' };
  }
}

// Checks a file's text. Returns { ok, data, summary } or { ok: false, error },
// and never writes anything.
export function readImport(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, error: "That file isn't a save file." };
  }
  if (!data || typeof data !== 'object' || data.format !== FORMAT || !data.keys || typeof data.keys !== 'object') {
    return { ok: false, error: "That file isn't a Nobody's Hero save file." };
  }
  if (typeof data.version !== 'number' || data.version > VERSION) {
    return { ok: false, error: 'That save is from a newer version of the game.' };
  }
  const keys = {};
  for (const [key, value] of Object.entries(data.keys)) {
    if (typeof key !== 'string' || !key.startsWith(PREFIX) || key === BEFORE_IMPORT_KEY) continue;
    if (typeof value !== 'string') return { ok: false, error: 'That save file is damaged.' };
    if (isSaveKey(key)) {
      let parsed;
      try {
        parsed = JSON.parse(value);
      } catch {
        return { ok: false, error: 'That save file is damaged.' };
      }
      if (!looksLikeSave(parsed)) return { ok: false, error: 'That save file is damaged.' };
    }
    keys[key] = value;
  }
  const saves = Object.keys(keys).filter(isSaveKey);
  if (!saves.length) return { ok: false, error: 'That file has no save in it.' };
  const main = keys[SAVE_KEY] ?? keys[latestSave(keys)];
  const others = saves.length - 1;
  const summary = `${describeSave(main)}${others ? ` (+${others} chapter save${others > 1 ? 's' : ''})` : ''}`;
  return { ok: true, data: { keys }, summary };
}

// Writes a checked import (from readImport) in. What was here first is kept
// under BEFORE_IMPORT_KEY; if any write fails, everything is put back as it
// was. Keys the file doesn't have are left alone. Returns { ok, error }.
export function applyImport({ keys }) {
  const before = gameEntries();
  try {
    localStorage.setItem(BEFORE_IMPORT_KEY, JSON.stringify(before));
  } catch {
    return { ok: false, error: 'No room in this browser to keep the old save safe. Nothing was changed.' };
  }
  try {
    // A file with only chapter saves still needs one to carry on from.
    if (!keys[SAVE_KEY]) {
      keys = { ...keys, [SAVE_KEY]: keys[latestSave(keys)] };
    }
    for (const [key, value] of Object.entries(keys)) localStorage.setItem(key, value);
    return { ok: true };
  } catch {
    // Put it all back.
    try {
      for (const key of Object.keys(keys)) {
        if (key in before) localStorage.setItem(key, before[key]);
        else localStorage.removeItem(key);
      }
    } catch {
      // The old save is still under BEFORE_IMPORT_KEY.
    }
    return { ok: false, error: 'The save did not fit in this browser. Nothing was changed.' };
  }
}

// Opens the browser's file picker (it has to come straight after a key
// press). Resolves to the file's text, or null if none was picked.
export function pickSaveFile() {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.style.display = 'none';
    let done = false;
    const finish = (value) => {
      if (done) return;
      done = true;
      input.remove();
      resolve(value);
    };
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) return finish(null);
      if (file.size > MAX_FILE_BYTES) return finish('');
      file.text().then(finish, () => finish(''));
    });
    input.addEventListener('cancel', () => finish(null));
    document.body.appendChild(input);
    input.click();
  });
}
