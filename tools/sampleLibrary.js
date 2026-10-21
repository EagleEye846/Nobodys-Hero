import { SAMPLE_SETS } from '../src/audio/sampleSets.js';
import { hasServer } from './api.js';
import { el, field, hint, modal, toast } from './ui.js';

// The Music Maker's real instruments: every recording set in
// src/audio/sampleSets.js, sorted into families, with sensible starting
// settings, a quick way to hear one, and uploading new ones.

const ROOT = new URL('../', import.meta.url);
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLATS = { Db: 'C#', Eb: 'D#', Gb: 'F#', Ab: 'G#', Bb: 'A#' };
export const noteName = (midi) => `${NOTE_NAMES[midi % 12]}${Math.floor(midi / 12) - 1}`;

// Families, checked in this order (so "tenorDrum" is a drum, not a voice).
const FAMILIES = [
  ['Percussion', /drum|snare|timpani|cymbal|crash|gong|clap|tom|hat|shaker|tamb|triangle|kick|perc|block|cajon|bongo|conga/i],
  ['Voices', /choir|voice|vocal|soprano|alto|aah|ooh|singer/i],
  ['Brass', /horn|trumpet|trombone|tuba|brass|cornet/i],
  ['Woodwinds', /flute|recorder|clarinet|oboe|bassoon|sax|piccolo|whistle|ocarina|harmonica/i],
  ['Keys & mallets', /piano|organ|glock|vibe|marimba|xylo|celest|bell|glass|harpsichord|chime|kalimba|box/i],
  ['Strings', /violin|viola|cello|bass|harp|string|pizz|trem|fiddle|guitar/i],
];
export const familyOf = (name) => FAMILIES.find(([, test]) => test.test(name))?.[0] ?? 'Other';

// "violinsTrem" -> "Violins trem".
export const setLabel = (name) => {
  const words = name.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
  return words[0].toUpperCase() + words.slice(1);
};

export const sampleSets = () => SAMPLE_SETS;
export const isUnpitched = (name) => Boolean(SAMPLE_SETS[name]?.unpitched);

// Options for a <select>, in families: pitched sets for a melody track,
// unpitched ones (drums, cymbals) for the drum grid.
export function sampleOptions(unpitched = false) {
  const groups = new Map([...FAMILIES.map(([f]) => f), 'Other'].map((f) => [f, []]));
  for (const name of Object.keys(SAMPLE_SETS).sort()) {
    if (Boolean(SAMPLE_SETS[name].unpitched) !== unpitched) continue;
    groups.get(familyOf(name)).push([name, setLabel(name)]);
  }
  return [...groups].filter(([, options]) => options.length).map(([group, options]) => ({ group, options }));
}

// A new instrument on a set, set up the way the game's own songs use it.
export function sampleInstrument(name) {
  if (isUnpitched(name)) return { sample: name, drum: 'sample', volume: 0.3, ring: true, reverb: 0.35 };
  const family = familyOf(name);
  const plucked = /pizz|spic|harp|piano|glock|vibe|marimba|xylo|celest|bell|kalimba|box|timpani/i.test(name) && !/bowed/i.test(name);
  if (plucked || family === 'Percussion') return { sample: name, volume: 0.3, ring: true, reverb: 0.5 };
  if (family === 'Strings' || family === 'Voices') return { sample: name, volume: 0.3, attack: 0.08, release: 0.6, reverb: 0.5 };
  return { sample: name, volume: 0.3, attack: 0.03, release: 0.4, reverb: 0.45 };
}

// Re-reads sampleSets.js (after an upload) into the same object the game's
// player uses, so new sets play straight away.
export async function reloadSampleSets() {
  const fresh = await import(`../src/audio/sampleSets.js?t=${Date.now()}`);
  Object.assign(SAMPLE_SETS, fresh.SAMPLE_SETS);
}

// --- Hearing one note of a set, without the song player. ---
const buffers = new Map();
async function buffer(ctx, name, note) {
  const key = `${name}/${note}`;
  if (!buffers.has(key)) {
    buffers.set(key, fetch(new URL(`assets/audio/samples/${name}/${note}.${SAMPLE_SETS[name].ext ?? 'ogg'}`, ROOT))
      .then((r) => r.arrayBuffer()).then((data) => ctx.decodeAudioData(data))
      .catch((error) => { buffers.delete(key); throw error; }));
  }
  return buffers.get(key);
}
export async function previewSample(ctx, inst, midi = 60) {
  const set = SAMPLE_SETS[inst.sample];
  if (!ctx || !set) return;
  const wanted = midi + 12 * (inst.octave ?? 0);
  const note = set.unpitched ? set.notes[0] : set.notes.reduce((best, n) => (Math.abs(n - wanted) < Math.abs(best - wanted) ? n : best), set.notes[0]);
  try {
    const source = ctx.createBufferSource();
    source.buffer = await buffer(ctx, inst.sample, note);
    if (!set.unpitched) source.playbackRate.value = 2 ** ((wanted - note) / 12);
    const gain = ctx.createGain();
    const t = ctx.currentTime;
    const level = Math.min(0.9, (inst.volume ?? 0.3) * 1.6);
    gain.gain.setValueAtTime(level, t);
    gain.gain.setTargetAtTime(0, t + (set.unpitched ? 1.5 : 0.7), 0.15);
    source.connect(gain).connect(ctx.destination);
    source.start(t);
    source.stop(t + 2.5);
  } catch {
    toast(`Couldn't load the ${setLabel(inst.sample)} recording.`, { kind: 'error' });
  }
}

// --- Uploading ---
// A note from a file name: "C4", "A#3", "Bb2", "violin_G#4_v1", or a MIDI
// number like "60". Null when there's no clue.
export function guessNote(fileName) {
  const stem = fileName.replace(/\.[^.]+$/, '');
  const named = stem.match(/(?:^|[^A-Za-z])([A-Ga-g])([#b]?)(-?\d)(?![\d])/);
  if (named) {
    let letter = named[1].toUpperCase() + named[2];
    letter = FLATS[letter] ?? letter;
    const index = NOTE_NAMES.indexOf(letter.replace('B#', 'C').replace('E#', 'F'));
    if (index >= 0) return 12 * (Number(named[3]) + 1) + index;
  }
  const number = stem.match(/(?:^|\D)(\d{2,3})(?:\D|$)/);
  if (number && Number(number[1]) >= 12 && Number(number[1]) <= 120) return Number(number[1]);
  return null;
}
const parseNote = (text) => {
  const t = text.trim();
  if (/^\d+$/.test(t)) return Number(t);
  return guessNote(`_${t}_`);
};

const readBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(String(reader.result).split(',')[1]);
  reader.onerror = () => reject(reader.error);
  reader.readAsDataURL(file);
});

// Asks for recordings and a name, sends them to tools/serve.py (which puts
// them in assets/audio/samples/<name>/ and adds the set to sampleSets.js).
// Resolves with the new set's name, or null.
export async function uploadSamples() {
  if (!(await hasServer())) {
    toast('Uploading needs the Studio server: start it with Play.bat or python tools/serve.py.', { kind: 'error' });
    return null;
  }
  let files = []; // { file, note: input }
  const nameInput = el('input', { type: 'text', placeholder: 'e.g. myFlute' });
  const list = el('div', { class: 'upload-list' });
  const picker = el('input', { type: 'file', accept: '.wav,.ogg,.mp3,.flac,audio/*', multiple: true, hidden: true, onchange: (e) => add([...e.target.files]) });
  const drop = el('div', {
    class: 'drop-zone',
    onclick: () => picker.click(),
    ondragover: (e) => { e.preventDefault(); drop.classList.add('over'); },
    ondragleave: () => drop.classList.remove('over'),
    ondrop: (e) => { e.preventDefault(); drop.classList.remove('over'); add([...e.dataTransfer.files].filter((f) => /\.(wav|ogg|mp3|flac)$/i.test(f.name))); },
  }, 'Drop audio files here, or click to pick them (wav, ogg, mp3)');

  function add(newFiles) {
    for (const file of newFiles) {
      const guess = guessNote(file.name);
      files.push({ file, note: el('input', { type: 'text', value: guess == null ? '' : noteName(guess), placeholder: 'C4', style: 'width:70px' }) });
    }
    if (!nameInput.value && files.length) nameInput.value = files[0].file.name.replace(/\.[^.]+$/, '').replace(/[_\s-]*[A-Ga-g][#b]?-?\d.*$/, '').replace(/\W+(\w)/g, (_, c) => c.toUpperCase()).replace(/^\w/, (c) => c.toLowerCase());
    render();
  }
  function render() {
    list.replaceChildren(...files.map((entry, i) => el('div', { class: 'upload-row' },
      el('span', { class: 'upload-file' }, entry.file.name),
      files.length > 1 ? entry.note : el('span', { class: 'hint', style: 'margin:0' }, 'one file: a drum hit (give it a note to make it play tunes)'),
      files.length === 1 ? entry.note : null,
      el('button', { type: 'button', class: 'btn ghost', onclick: () => { files.splice(i, 1); render(); } }, 'Remove'))));
  }

  const result = await modal({
    title: 'Upload real instrument samples',
    wide: true,
    body: el('div', {},
      field('Instrument name', nameInput, 'Letters and numbers, like celloSoft. Songs use it as sample: \'celloSoft\'.'),
      drop, picker, list,
      hint('Give each file the note it plays (C4 is middle C). Notes are guessed from the file names. More notes across the range sound better: in between ones are retuned from the nearest.')),
    actions: [{ label: 'Cancel', value: null }, {
      label: 'Upload',
      kind: 'primary',
      validate: () => {
        if (!/^[a-z][A-Za-z0-9]*$/.test(nameInput.value.trim())) return 'Give it a name: letters and numbers, starting with a small letter.';
        if (!files.length) return 'Add at least one audio file.';
        if (files.length > 1 && files.some((f) => parseNote(f.note.value) == null)) return 'Each file needs a note, like C4 or A#3.';
        return null;
      },
      value: () => true,
    }],
  });
  if (!result) return null;

  const name = nameInput.value.trim();
  const unpitched = files.length === 1 && !files[0].note.value.trim();
  try {
    const payload = {
      name,
      unpitched,
      files: await Promise.all(files.map(async (entry) => ({
        midi: unpitched ? 60 : parseNote(entry.note.value) ?? 60,
        ext: entry.file.name.split('.').pop().toLowerCase(),
        data: await readBase64(entry.file),
      }))),
    };
    const response = await fetch(new URL('api/sample', ROOT), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const reply = await response.json();
    if (!reply.ok) throw new Error(reply.error);
    await reloadSampleSets();
    [...buffers.keys()].filter((k) => k.startsWith(`${name}/`)).forEach((k) => buffers.delete(k));
    toast(`Added ${setLabel(name)} (${reply.notes.length} ${reply.notes.length === 1 ? 'recording' : 'recordings'}).`);
    return name;
  } catch (error) {
    toast(`Upload failed: ${error.message}`, { kind: 'error' });
    return null;
  }
}
