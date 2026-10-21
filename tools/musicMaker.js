import { music } from '../src/audio/music.js';
import { HOLD, REST, HIT } from '../src/audio/notation.js';
import { loadSongs } from './library.js';
import { loadOrder } from './order.js';
import { listDir } from './api.js';
import { quote, inline, objectKey } from './source.js';
import { sampleSets, sampleOptions, sampleInstrument, setLabel, isUnpitched, previewSample, uploadSamples } from './sampleLibrary.js';
import {
  el, setChildren, icon, btn, hint, field, select, optionNodes, slider, section, segmented, modal, confirmBox, popupMenu, checkbox,
  pixelCanvas, isTyping, deepClone, camelCase, constCase, friendly, codeView, toast,
} from './ui.js';

// Music Maker: a piano roll and a drum grid for the game's songs. A melodic
// track plays one note at a time (each step is a MIDI note, HOLD or REST);
// chords come from several tracks. Drum tracks are rows of hits.

const MAX_UNDO = 150;
const KEY_W = 58;
const HEAD_H = 20;
const ROW_H = 14;
const DRUM_ROW_H = 26;
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const noteName = (midi) => `${NOTE_NAMES[midi % 12]}${Math.floor(midi / 12) - 1}`;
const isBlack = (midi) => NOTE_NAMES[midi % 12].includes('#');
const LOW = 36; // C2
const HIGH = 96; // C7
const TRACK_COLORS = ['#ff8c1a', '#4fe3d0', '#b07cff', '#ffe14d', '#ff5470', '#5fc27a', '#6aa8ff', '#f2a6d8'];

// Pixel instruments: synth presets by friendly name (taken from the game's
// own songs). The Orchestra tab is the real recordings in sampleSets.js.
const INSTRUMENTS = {
  'Chiptune lead': { wave: 'square', volume: 0.03, attack: 0.01, decay: 0.15, sustain: 0.7, release: 0.06, gate: 0.9, filter: { type: 'lowpass', frequency: 2500 } },
  'Soft flute': { wave: 'triangle', volume: 0.16, attack: 0.03, decay: 0.4, sustain: 0.6, release: 0.4, gate: 0.95, vibrato: { rate: 4.5, depth: 12 }, echo: { time: 0.45, feedback: 0.35, mix: 0.3 } },
  'Music box': { wave: 'triangle', volume: 0.04, attack: 0.002, decay: 0.3, sustain: 0.2, release: 0.6, gate: 0.6, echo: { time: 0.5, feedback: 0.3, mix: 0.25 } },
  Brass: { wave: 'sawtooth', volume: 0.05, attack: 0.01, decay: 0.15, sustain: 0.7, release: 0.06, gate: 0.9, vibrato: { rate: 5.5, depth: 12 }, filter: { type: 'lowpass', frequency: 4000 } },
  'Plucky keys': { wave: 'square', volume: 0.025, decay: 0.08, sustain: 0.4, release: 0.05, gate: 0.6, filter: { type: 'lowpass', frequency: 2200 } },
  'Warm pad': { wave: 'sine', volume: 0.045, attack: 0.6, decay: 1, sustain: 0.8, release: 0.9, gate: 1 },
  Chime: { wave: 'sine', volume: 0.05, attack: 0.002, decay: 0.15, sustain: 0.2, release: 0.3, gate: 0.5 },
  'Round bass': { wave: 'triangle', volume: 0.14, attack: 0.05, decay: 0.5, sustain: 0.6, release: 0.5, gate: 0.95 },
  'Buzzy bass': { wave: 'sawtooth', volume: 0.13, attack: 0.003, decay: 0.08, sustain: 0.7, release: 0.03, gate: 0.8, filter: { type: 'lowpass', frequency: 700 } },
};
const ROLES = [
  ['melody', 'Melody', 'Chiptune lead', 'The tune people hum'],
  ['harmony', 'Harmony', 'Plucky keys', 'Chords and backing notes'],
  ['bass', 'Bass', 'Round bass', 'Low notes that hold it together'],
  ['pad', 'Pad', 'Warm pad', 'Soft long notes underneath'],
  ['sparkle', 'Sparkle', 'Music box', 'Little high notes'],
];
// The same parts played by real instruments (the first set here that exists).
const ORCHESTRA_ROLES = {
  melody: ['soloViolin', 'violins'],
  harmony: ['piano', 'harp'],
  bass: ['cellos', 'bassSpic'],
  pad: ['violins', 'violas', 'cellos'],
  sparkle: ['glock', 'harp', 'piano'],
};
const orchestraFor = (role) => ORCHESTRA_ROLES[role].find((n) => sampleSets()[n]) ?? Object.keys(sampleSets()).find((n) => !isUnpitched(n));
const DRUMS = [['kick', 'Kick', 0.6], ['snare', 'Snare', 0.3], ['hat', 'Hat', 0.05], ['openHat', 'Open hat', 0.07]];
const SCALES = {
  Major: [0, 2, 4, 5, 7, 9, 11],
  Minor: [0, 2, 3, 5, 7, 8, 10],
  'Happy pentatonic': [0, 2, 4, 7, 9],
  'Sad pentatonic': [0, 3, 5, 7, 10],
  Blues: [0, 3, 5, 6, 7, 10],
  Dorian: [0, 2, 3, 5, 7, 9, 10],
  'Every note': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
};
const LENGTHS = [['1/16', 1 / 16], ['1/8', 1 / 8], ['1/4', 1 / 4], ['1/2', 1 / 2], ['1', 1]];
const WAVES = ['square', 'sawtooth', 'triangle', 'sine'];
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// Notes in a melodic track as { start, end (exclusive), midi }.
function notesIn(steps) {
  const notes = [];
  let current = null;
  steps.forEach((step, i) => {
    if (typeof step === 'number') {
      current = { start: i, end: i + 1, midi: step };
      notes.push(current);
    } else if (step === HOLD && current) current.end = i + 1;
    else current = null;
  });
  return notes;
}
function clearOrphanHolds(steps, from) {
  for (let i = from; i < steps.length && steps[i] === HOLD; i++) steps[i] = REST;
}

function blankSong(title, style = 'pixel') {
  const steps = () => Array(32).fill(REST);
  const instruments = {};
  for (const [name, , preset] of ROLES.slice(0, 3)) instruments[name] = style === 'orchestra' ? sampleInstrument(orchestraFor(name)) : deepClone(INSTRUMENTS[preset]);
  if (style === 'orchestra') {
    for (const drum of ['timpani', 'bassDrum', 'snareSoft']) {
      if (sampleSets()[drum]) instruments[drum] = { ...sampleInstrument(drum), drum: 'sample' };
    }
  } else for (const [kind, , volume] of DRUMS.slice(0, 3)) instruments[kind] = { drum: kind, volume };
  return {
    title,
    bpm: 120,
    stepsPerBeat: 2,
    instruments,
    sections: { A: Object.fromEntries(Object.keys(instruments).map((n) => [n, steps()])) },
    order: ['A'],
  };
}

// Every track gets an entry in every section, so it can be shown and edited.
function normalise(song) {
  for (const sec of Object.values(song.sections)) {
    const length = Object.values(sec)[0]?.length ?? 16;
    for (const track of Object.keys(song.instruments)) sec[track] ??= Array(length).fill(REST);
  }
  return song;
}

// The song's most likely key: the root whose major scale fits the most notes.
function guessKey(song) {
  const counts = Array(12).fill(0);
  for (const sec of Object.values(song.sections)) {
    for (const [track, steps] of Object.entries(sec)) {
      if (song.instruments[track]?.drum) continue;
      for (const s of steps) if (typeof s === 'number') counts[s % 12]++;
    }
  }
  let best = 0;
  let bestScore = -1;
  for (let root = 0; root < 12; root++) {
    const score = SCALES.Major.reduce((sum, i) => sum + counts[(root + i) % 12], 0);
    if (score > bestScore) { best = root; bestScore = score; }
  }
  return best;
}

// The song as a module in the game's format, one bar per line.
function songModule(song, constName, beatsPerBar) {
  const perBar = beatsPerBar * song.stepsPerBeat;
  const stepsBlock = (steps, indent) => {
    const lines = [];
    for (let i = 0; i < steps.length; i += perBar) lines.push(`${indent}${steps.slice(i, i + perBar).map(inline).join(', ')},`);
    return lines.join('\n');
  };
  const lines = [
    `// "${song.title}": made in the Nobody's Hero Studio Music Maker (tools/).`,
    `// ${song.bpm} BPM, ${song.stepsPerBeat} steps per beat, ${beatsPerBar} beats per bar.`,
    '// Each step is a MIDI note number (60 is middle C), \'-\' to hold the note',
    '// before, \'.\' for silence, or \'x\' for a drum hit.',
    `export const ${constName} = {`,
    `  title: ${quote(song.title)},`,
    `  bpm: ${song.bpm},`,
    `  stepsPerBeat: ${song.stepsPerBeat},`,
    ...(beatsPerBar !== 4 ? [`  beatsPerBar: ${beatsPerBar},`] : []),
    '',
    '  instruments: {',
    ...Object.entries(song.instruments).map(([name, inst]) => `    ${objectKey(name)}: ${inline(inst)},`),
    '  },',
    '',
    '  sections: {',
    ...Object.entries(song.sections).map(([name, tracks]) => `    ${objectKey(name)}: {\n${Object.entries(tracks)
      .map(([track, steps]) => `      ${objectKey(track)}: [\n${stepsBlock(steps, '        ')}\n      ],`).join('\n')}\n    },`),
    '  },',
    '',
    `  order: ${inline(song.order)},`,
  ];
  if (song.loopFrom) lines.push(`  loopFrom: ${song.loopFrom},`);
  lines.push('};');
  return `${lines.join('\n')}\n`;
}

export async function mount(root, studio) {
  let songs = await loadSongs();
  // Songs under area headings, in the order the player first hears them.
  let order = await loadOrder();
  let song = null;
  let meta = null; // { name, file, constName, isNew }
  let beatsPerBar = 4;
  let sectionName = null;
  let trackName = null;
  let keyRoot = 0;
  let scale = 'Major';
  let snap = true;
  let noteLength = '1/8';
  let loopSection = true;
  let cellW = 20;
  const muted = new Set();
  let playback = null;
  let drag = null;
  let undoStack = [];
  let redoStack = [];
  let lastSnapshot = null;
  let audio = null;

  const section_ = () => song.sections[sectionName];
  const length = () => Object.values(section_())[0]?.length ?? 0;
  const stepsPerBar = () => beatsPerBar * song.stepsPerBeat;
  const melodic = () => Object.keys(song.instruments).filter((n) => !song.instruments[n].drum);
  const drumTracks = () => Object.keys(song.instruments).filter((n) => song.instruments[n].drum);
  const colorOf = (name) => TRACK_COLORS[melodic().indexOf(name) % TRACK_COLORS.length] ?? '#4fe3d0';
  const inScale = (midi) => SCALES[scale].includes(((midi - keyRoot) % 12 + 12) % 12);
  const lengthSteps = (label) => LENGTHS.find(([l]) => l === label)[1] * 4 * song.stepsPerBeat;

  function pitchRange() {
    let low = LOW;
    let high = HIGH;
    for (const sec of Object.values(song.sections)) for (const steps of Object.values(sec)) for (const s of steps) {
      if (typeof s === 'number') { low = Math.min(low, s); high = Math.max(high, s); }
    }
    return { low, high };
  }

  // --- Undo ---
  const snapshot = () => JSON.stringify({ song, sectionName, trackName, beatsPerBar });
  const beginEdit = () => { lastSnapshot = snapshot(); };
  function changed() {
    if (lastSnapshot) undoStack.push(lastSnapshot);
    if (undoStack.length > MAX_UNDO) undoStack.shift();
    redoStack = [];
    lastSnapshot = null;
    studio.setDirty(true);
  }
  function edit(apply, all = true) {
    beginEdit();
    apply();
    changed();
    if (all) refreshAll(); else refreshGrids();
  }
  function restore(from, to) {
    if (!from.length) return;
    to.push(snapshot());
    ({ song, sectionName, trackName, beatsPerBar } = JSON.parse(from.pop()));
    studio.setDirty(true);
    refreshAll();
  }
  const undo = () => song && restore(undoStack, redoStack);
  const redo = () => song && restore(redoStack, undoStack);

  // --- Layout ---
  const songPanel = el('div');
  const trackPanel = el('div');
  const advanced = el('div', { class: 'adv' });
  const left = el('aside', { class: 'sidebar left' }, songPanel, trackPanel, advanced);

  const songSelect = el('select', { onchange: (e) => openSong(e.target.value), tip: 'Open a song' });
  const playButton = btn('play', 'Play', () => togglePlay(), { kind: 'primary', key: 'Space' });
  const loopButton = btn('loop', 'Loop section', () => { loopSection = !loopSection; loopButton.classList.toggle('active', loopSection); if (playback) play(); }, { kind: 'ghost', active: true, title: 'On: repeat just this section. Off: play the whole song.' });
  const tempo = slider({ label: 'Tempo', min: 50, max: 220, value: 120, format: (v) => `${v} BPM`, onInput: (v) => { song.bpm = v; studio.setDirty(true); }, onChange: () => { if (playback) play(); renderAdvanced(); } });
  const keySelect = select(NOTE_NAMES.map((n, i) => [String(i), n]), '0', (v) => { keyRoot = Number(v); drawRoll(); }, { tip: 'Key: the note the tune feels at home on' });
  const scaleSelect = select(Object.keys(SCALES), scale, (v) => { scale = v; drawRoll(); }, { tip: 'Scale: which notes sound right together' });
  const snapBox = checkbox(snap, (v) => { snap = v; }, 'Snap to scale', { tip: 'Clicks on a note outside the scale land on the nearest one inside it' });
  const lengthPick = segmented(LENGTHS.map(([l]) => [l, l, null, `Notes ${l === '1' ? 'a whole bar' : `${l} of a bar`} long`]), noteLength, (v) => setLength(v), { small: true });
  const toolbar = el('div', { class: 'toolbar' },
    songSelect,
    btn('plus', 'New song', () => newSong(), { kind: 'ghost' }),
    el('span', { class: 'sep' }),
    playButton, loopButton,
    el('div', { class: 'bpm' }, tempo),
    el('span', { class: 'sep' }),
    btn('undo', 'Undo', undo, { iconOnly: true, key: 'Ctrl+Z' }),
    btn('redo', 'Redo', redo, { iconOnly: true, key: 'Ctrl+Y' }));
  const toolbar2 = el('div', { class: 'toolbar', style: 'min-height:48px;padding-top:6px;padding-bottom:6px' },
    el('label', { class: 'inline' }, 'Key', keySelect, scaleSelect), snapBox,
    el('span', { class: 'sep' }),
    el('label', { class: 'inline' }, 'Note length', lengthPick),
    el('span', { class: 'spacer' }),
    btn('minus', 'Narrower', () => { cellW = clamp(cellW - 4, 8, 44); refreshGrids(); }, { iconOnly: true }),
    btn('plus', 'Wider', () => { cellW = clamp(cellW + 4, 8, 44); refreshGrids(); }, { iconOnly: true }));
  const sectionBar = el('div', { class: 'section-bar' });
  const rollCanvas = pixelCanvas(10, 10);
  const rollStage = el('div', { class: 'roll-stage' }, rollCanvas);
  const drumCanvas = pixelCanvas(10, 10);
  const drumStage = el('div', { class: 'drum-stage' }, drumCanvas);
  const status = el('div', { class: 'statusbar' });
  const work = el('div', { class: 'work' }, toolbar, toolbar2, sectionBar, el('div', { class: 'roll-wrap' }, rollStage, drumStage), status);
  root.append(el('div', { class: 'workspace two' }, left, work));

  rollStage.addEventListener('scroll', () => { drumStage.scrollLeft = rollStage.scrollLeft; drawRoll(); });
  drumStage.addEventListener('scroll', () => { if (rollStage.scrollLeft !== drumStage.scrollLeft) rollStage.scrollLeft = drumStage.scrollLeft; drawDrums(); });

  // --- Opening songs ---
  function renderSongSelect() {
    const options = optionNodes(order.options('songs', Object.keys(songs), (name) => songs[name].song.title || friendly(name)));
    if (meta?.isNew) options.push(el('option', { value: '' }, `${song.title} (new)`));
    setChildren(songSelect, options);
    songSelect.value = meta?.isNew ? '' : meta?.name ?? '';
  }

  async function okToLeave() {
    if (!song || !studio.isDirty()) return true;
    return confirmBox('Unsaved changes', `You have changes to "${song.title}" that aren't saved. Throw them away?`, 'Throw away', 'danger');
  }

  async function openSong(name) {
    if (!name || name === meta?.name) return;
    if (!(await okToLeave())) { renderSongSelect(); return; }
    stop();
    const entry = songs[name];
    const data = normalise(deepClone(entry.song));
    beatsPerBar = data.beatsPerBar ?? (/waltz/i.test(`${data.title} ${name}`) ? 3 : 4);
    delete data.beatsPerBar;
    load(data, { name, file: entry.file, constName: entry.constName, isNew: false });
  }

  function load(data, info) {
    song = data;
    meta = info;
    sectionName = song.order[0] ?? Object.keys(song.sections)[0];
    trackName = melodic()[0] ?? Object.keys(song.instruments)[0];
    keyRoot = guessKey(song);
    keySelect.value = String(keyRoot);
    muted.clear();
    undoStack = [];
    redoStack = [];
    if (!lengthSteps(noteLength) || lengthSteps(noteLength) < 1) noteLength = '1/8';
    studio.setDirty(Boolean(info.isNew));
    refreshAll();
    // Show the middle of the keyboard (around C5).
    requestAnimationFrame(() => { rollStage.scrollTop = Math.max(0, (pitchRange().high - 79) * ROW_H); rollStage.scrollLeft = 0; });
  }

  async function newSong() {
    if (!(await okToLeave())) return;
    const input = el('input', { type: 'text', placeholder: 'e.g. Crystal Caves' });
    let style = 'pixel';
    const stylePick = segmented([['pixel', 'Pixel', null, 'Chiptune synths'], ['orchestra', 'Orchestra', null, 'Real recorded instruments: strings, piano, harp, drums']], style, (v) => { style = v; });
    const existing = (await listDir('src/data/music')) ?? Object.values(songs).map((s) => s.file);
    const title = await modal({
      title: 'New song',
      body: el('div', {}, field('Song name', input, 'Rooms play it by a short name made from this.'), field('Sound', stylePick, 'What the starting tracks play. You can change any track later.')),
      actions: [{ label: 'Cancel', value: null }, {
        label: 'Start',
        kind: 'primary',
        validate: () => {
          const name = camelCase(input.value);
          if (!name || !/^[a-z]/.test(name)) return 'Give it a name that starts with a letter.';
          if (songs[name] || existing.includes(`${name}Theme.js`)) return 'There is already a song with that name.';
          return null;
        },
        value: () => input.value.trim(),
      }],
    });
    if (!title) return;
    stop();
    beatsPerBar = 4;
    const name = camelCase(title);
    load(blankSong(title, style), { name, file: `${name}Theme.js`, constName: `${constCase(name)}_THEME`, isNew: true });
  }

  // --- Song + tracks panel ---
  function renderSongPanel() {
    setChildren(songPanel, section('Song',
      field('Name', el('input', { type: 'text', value: song.title, onchange: (e) => edit(() => { song.title = e.target.value.trim() || song.title; }) })),
      hint(meta.isNew ? `Rooms will play it as "${meta.name}".` : `Rooms play it as "${meta.name}".`)));
  }

  function instrumentName(inst) {
    if (inst.sample) return inst.sample;
    // Volume is its own slider, so it doesn't change which instrument it is.
    return Object.keys(INSTRUMENTS).find((n) => same({ ...INSTRUMENTS[n], volume: 0 }, { ...inst, volume: 0 })) ?? '';
  }

  function renderTracks() {
    const cards = melodic().map((name) => {
      const inst = song.instruments[name];
      const preset = instrumentName(inst);
      const kind = inst.sample ? 'orchestra' : 'pixel';
      const options = kind === 'orchestra'
        ? [...(sampleSets()[preset] ? [] : [['', `Missing: ${preset}`]]), ...sampleOptions()]
        : [...(preset ? [] : [['', 'Its own sound']]), ...Object.keys(INSTRUMENTS).map((n) => [n, n])];
      const choose = (v) => {
        if (!v) return;
        edit(() => { song.instruments[name] = kind === 'orchestra' ? sampleInstrument(v) : deepClone(INSTRUMENTS[v]); });
        previewNote(60, name);
      };
      // Switching tabs swaps in a matching instrument from the other side.
      const switchKind = (v) => {
        if (v === kind) return;
        const role = ROLES.find(([id]) => name.startsWith(id))?.[0] ?? 'melody';
        const pick = v === 'orchestra' ? orchestraFor(role) : ROLES.find(([id]) => id === role)[2];
        if (!pick) { toast('No real instruments yet: upload some first.', { kind: 'error' }); renderTracks(); return; }
        edit(() => { song.instruments[name] = v === 'orchestra' ? sampleInstrument(pick) : deepClone(INSTRUMENTS[pick]); });
        previewNote(60, name);
      };
      const volumeMax = inst.sample ? 0.6 : 0.25;
      const card = el('div', {
        class: `track-card${name === trackName ? ' active' : ''}`,
        style: `--track:${colorOf(name)}`,
        onclick: (e) => { if (e.target.closest('select, input, button')) return; trackName = name; renderTracks(); renderAdvanced(); drawRoll(); },
      },
      el('div', { class: 'row' },
        el('span', { class: 'track-swatch' }),
        el('span', { class: 'track-name' }, friendly(name)),
        btn(muted.has(name) ? 'stop' : 'note', muted.has(name) ? 'Unmute' : 'Mute', () => { if (muted.has(name)) muted.delete(name); else muted.add(name); renderTracks(); if (playback) play(); }, { iconOnly: true, kind: muted.has(name) ? 'active' : 'ghost', title: muted.has(name) ? 'Muted: click to hear it again' : 'Mute this track while playing' }),
        btn('trash', 'Remove track', () => removeTrack(name), { iconOnly: true, kind: 'ghost danger' })),
      segmented([['pixel', 'Pixel', null, 'Chiptune synth sounds'], ['orchestra', 'Orchestra', null, 'Real recorded instruments']], kind, switchKind, { small: true }),
      el('div', { class: 'row' },
        select(options, preset, choose, { tip: kind === 'orchestra' ? 'Real instrument, by family' : 'Synth sound' }),
        btn('play', 'Hear it', () => previewNote(60, name), { iconOnly: true, kind: 'ghost', title: 'Hear this instrument (middle C)' })),
      slider({
        label: 'Volume', min: 0, max: 100, value: Math.round(clamp((inst.volume ?? 0.1) / volumeMax, 0, 1) * 100), format: (v) => `${v}%`,
        onInput: (v) => { inst.volume = Math.round((v / 100) * volumeMax * 1000) / 1000; studio.setDirty(true); },
        onChange: () => { if (playback) play(); renderAdvanced(); },
      }));
      return card;
    });
    setChildren(trackPanel, section('Tracks',
      cards,
      el('div', { class: 'row' },
        btn('plus', 'Add a track', (e) => popupMenu(e.currentTarget, [
          ...ROLES.map(([id, label, preset, text]) => ({ icon: 'note', label: `${label} (pixel)`, hint: `${text}: ${preset}`, onClick: () => addTrack(id, deepClone(INSTRUMENTS[preset])) })),
          '-',
          ...ROLES.filter(([id]) => orchestraFor(id)).map(([id, label, , text]) => ({ icon: 'note', label: `${label} (orchestra)`, hint: `${text}: ${setLabel(orchestraFor(id))}`, onClick: () => addTrack(id, sampleInstrument(orchestraFor(id))) })),
        ]), { kind: 'ghost' }),
        btn('plus', 'Add a real drum', (e) => addRealDrum(e.currentTarget), { kind: 'ghost', title: 'Timpani, bass drum, snare, cymbals... real recordings, on the drum grid' })),
      btn('box', 'Upload samples', () => uploadAndUse(), { kind: 'ghost', title: 'Add your own recordings (wav, ogg, mp3) as a new Orchestra instrument' }),
      hint('Click a track to write its notes. Pixel tracks are synths; Orchestra tracks are real recordings. Drums are the grid under the piano roll.')));
  }

  function addRealDrum(anchor) {
    const items = sampleOptions(true).flatMap(({ options }) => options).map(([set, label]) => ({ icon: 'note', label, onClick: () => addTrack(set, sampleInstrument(set)) }));
    if (!items.length) { toast('No real drums yet: upload a recording first.', { kind: 'error' }); return; }
    popupMenu(anchor, items);
  }

  // Uploads recordings, then puts them to use: a drum hit gets its own row on
  // the drum grid; a tuned instrument can take over the selected track.
  async function uploadAndUse() {
    const name = await uploadSamples();
    if (!name) return;
    if (isUnpitched(name)) { addTrack(name, sampleInstrument(name)); return; }
    const track = song.instruments[trackName] && !song.instruments[trackName].drum ? trackName : null;
    if (track && await confirmBox('Use it now?', `Play the ${friendly(track)} track on ${setLabel(name)}? (Otherwise it waits in the Orchestra tab.)`, 'Use it')) {
      edit(() => { song.instruments[track] = sampleInstrument(name); });
      previewNote(60, track);
    } else renderTracks();
  }

  function addTrack(base, instrument) {
    let name = base;
    for (let n = 2; song.instruments[name]; n++) name = `${base}${n}`;
    edit(() => {
      song.instruments[name] = instrument;
      for (const sec of Object.values(song.sections)) sec[name] = Array(Object.values(sec)[0]?.length ?? 32).fill(REST);
      if (!instrument.drum) trackName = name;
    });
  }

  async function removeTrack(name) {
    if (Object.keys(song.instruments).length < 2) return;
    if (!(await confirmBox('Remove track', `Remove "${friendly(name)}" and all its notes from every section?`, 'Remove', 'danger'))) return;
    edit(() => {
      delete song.instruments[name];
      for (const sec of Object.values(song.sections)) delete sec[name];
      if (trackName === name) trackName = melodic()[0] ?? Object.keys(song.instruments)[0];
    });
  }

  // --- Sections ---
  function renderSections() {
    const bars = length() / stepsPerBar();
    setChildren(sectionBar,
      el('span', { class: 'field-label', style: 'margin-right:4px' }, 'Section'),
      Object.keys(song.sections).map((name) => el('button', {
        type: 'button', class: `chip${name === sectionName ? ' active' : ''}`,
        onclick: () => { sectionName = name; if (playback && loopSection) play(); refreshAll(); },
        tip: song.order.includes(name) ? `Plays ${song.order.filter((n) => n === name).length}x in the song` : 'Not in the song order (Advanced)',
      }, friendly(name))),
      btn('plus', 'Add section', (e) => popupMenu(e.currentTarget, [
        { icon: 'copy', label: 'Copy of this section', hint: 'Then change a few notes', onClick: () => addSection(true) },
        { icon: 'plus', label: 'Empty section', onClick: () => addSection(false) },
      ]), { iconOnly: true, kind: 'ghost' }),
      btn('menu', 'Section options', (e) => popupMenu(e.currentTarget, [
        { icon: 'pencil', label: 'Rename this section', onClick: renameSection },
        { icon: 'trash', label: 'Delete this section', disabled: Object.keys(song.sections).length < 2, onClick: deleteSection },
      ]), { iconOnly: true, kind: 'ghost' }),
      el('span', { class: 'spacer' }),
      el('span', { class: 'field-label' }, 'Bars'),
      btn('minus', 'One bar shorter', () => setBars(Math.round(bars) - 1), { iconOnly: true, kind: 'ghost', disabled: bars <= 1 }),
      el('span', { class: 'slider-value', style: 'min-width:34px;text-align:center' }, Number.isInteger(bars) ? String(bars) : bars.toFixed(1)),
      btn('plus', 'One bar longer', () => setBars(Math.round(bars) + 1), { iconOnly: true, kind: 'ghost' }));
  }

  function nextSectionName() {
    for (const letter of 'ABCDEFGHIJKLMNOPQRSTUVWXYZ') if (!song.sections[letter]) return letter;
    return `part${Object.keys(song.sections).length + 1}`;
  }
  function addSection(copy) {
    const name = nextSectionName();
    edit(() => {
      song.sections[name] = copy ? deepClone(section_()) : Object.fromEntries(Object.keys(song.instruments).map((t) => [t, Array(length()).fill(REST)]));
      song.order.push(name);
      sectionName = name;
    });
  }
  async function renameSection() {
    const input = el('input', { type: 'text', value: sectionName });
    const name = await modal({
      title: 'Rename section',
      body: field('Section name', input, 'Letters and numbers, like chorus or B.'),
      actions: [{ label: 'Cancel', value: null }, {
        label: 'Rename', kind: 'primary',
        validate: () => (!/^[A-Za-z][\w]*$/.test(input.value.trim()) ? 'Use letters and numbers, starting with a letter.' : song.sections[input.value.trim()] && input.value.trim() !== sectionName ? 'Another section has that name.' : null),
        value: () => input.value.trim(),
      }],
    });
    if (!name || name === sectionName) return;
    edit(() => {
      song.sections = Object.fromEntries(Object.entries(song.sections).map(([k, v]) => [k === sectionName ? name : k, v]));
      song.order = song.order.map((n) => (n === sectionName ? name : n));
      sectionName = name;
    });
  }
  async function deleteSection() {
    if (!(await confirmBox('Delete section', `Delete section "${sectionName}" and its notes?`, 'Delete', 'danger'))) return;
    edit(() => {
      delete song.sections[sectionName];
      song.order = song.order.filter((n) => n !== sectionName);
      if (!song.order.length) song.order = [Object.keys(song.sections)[0]];
      if ((song.loopFrom ?? 0) >= song.order.length) delete song.loopFrom;
      sectionName = song.order[0];
    });
  }
  function setBars(bars) {
    if (bars < 1 || bars > 64) return;
    const steps = bars * stepsPerBar();
    edit(() => {
      for (const [track, events] of Object.entries(section_())) {
        const next = Array.from({ length: steps }, (_, i) => events[i] ?? REST);
        if (steps < events.length && next[steps - 1] === undefined) next[steps - 1] = REST;
        section_()[track] = next;
      }
    });
  }

  function setLength(label) {
    if (lengthSteps(label) < 1) {
      toast(`This song's grid is in ${['', 'quarter', '8th', '', '16th'][song.stepsPerBeat] || 'big'} notes, so ${label} notes are too short for it.`, { kind: 'info' });
      lengthPick.set(noteLength);
      return;
    }
    noteLength = label;
  }

  // --- Sound ---
  function ensureAudio() {
    try {
      audio ??= new AudioContext();
      if (audio.state === 'suspended') audio.resume();
      return audio;
    } catch {
      return null;
    }
  }
  // A short note on a track's instrument, so clicks can be heard.
  function previewNote(midi, name = trackName) {
    const inst = song.instruments[name];
    const ctx = ensureAudio();
    if (inst?.sample && ctx) { previewSample(ctx, inst, midi); return; }
    if (!inst || inst.drum || !ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = inst.wave ?? 'square';
    osc.frequency.value = 440 * 2 ** ((midi - 69) / 12);
    const peak = Math.min(0.3, (inst.volume ?? 0.1) * 2.2);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(peak, t + Math.max(0.005, Math.min(0.08, inst.attack ?? 0.005)));
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    let out = gain;
    if (inst.filter) {
      const filter = ctx.createBiquadFilter();
      filter.type = inst.filter.type;
      filter.frequency.value = inst.filter.frequency;
      gain.connect(filter);
      out = filter;
    }
    osc.connect(gain);
    out.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.4);
  }

  function play() {
    const copy = deepClone(song);
    for (const name of muted) if (copy.instruments[name]) copy.instruments[name].volume = 0;
    if (loopSection) {
      copy.order = [sectionName];
      delete copy.loopFrom;
    }
    // The game's player mutes on M (pressed in other tools too): unmute for previews.
    if (music.muted) music.toggleMute();
    try {
      music.playSong(copy);
    } catch (error) {
      toast(`Can't play it: ${error.message}`, { kind: 'error' });
      return;
    }
    const layout = [];
    let total = 0;
    let loopStart = 0;
    copy.order.forEach((name, i) => {
      if (i === (copy.loopFrom ?? 0)) loopStart = total;
      const len = Object.values(copy.sections[name])[0].length;
      layout.push({ name, start: total, length: len });
      total += len;
    });
    // The game schedules the first step 50ms after playSong.
    playback = { start: performance.now() + 50, stepSeconds: 60 / copy.bpm / copy.stepsPerBeat, layout, total, loopStart };
    renderPlayButton();
  }
  function stop() {
    if (playback) music.playSong(null);
    playback = null;
    renderPlayButton();
    if (song) refreshGrids();
  }
  const togglePlay = () => (playback ? stop() : play());
  function renderPlayButton() {
    setChildren(playButton, icon(playback ? 'stop' : 'play', 18), el('span', {}, playback ? 'Stop' : 'Play'));
  }

  function playhead() {
    if (!playback) return null;
    // The game's own clock when it has one: a song with real instruments
    // starts once their recordings have loaded, not straight away.
    const elapsed = music.songTime ?? (performance.now() - playback.start) / 1000;
    let step = Math.floor(elapsed / playback.stepSeconds);
    if (step < 0) return null;
    if (step >= playback.total) step = playback.loopStart + ((step - playback.total) % Math.max(1, playback.total - playback.loopStart));
    const part = playback.layout.find((p) => step >= p.start && step < p.start + p.length);
    return part ? { name: part.name, step: step - part.start } : null;
  }
  let lastHead = '';
  (function tick() {
    requestAnimationFrame(tick);
    if (!studio.isActive() || !playback) return;
    const head = playhead();
    const keyNow = head ? `${head.name}:${head.step}` : '';
    if (keyNow === lastHead) return;
    lastHead = keyNow;
    // Follow the playhead when it runs off the visible part.
    if (head && head.name === sectionName) {
      const x = KEY_W + head.step * cellW;
      if (x > rollStage.scrollLeft + rollStage.clientWidth - 40 || x < rollStage.scrollLeft + KEY_W) rollStage.scrollLeft = Math.max(0, x - KEY_W - 20);
    }
    drawRoll();
    drawDrums();
  })();

  // --- Piano roll ---
  function drawStepLines(ctx, top, bottom) {
    const perBar = stepsPerBar();
    for (let i = 0; i <= length(); i++) {
      ctx.fillStyle = i % perBar === 0 ? '#5a3d8f' : i % song.stepsPerBeat === 0 ? '#2b1f45' : '#1a1229';
      ctx.fillRect(KEY_W + i * cellW, top, 1, bottom - top);
    }
  }

  function drawRoll() {
    if (!song) return;
    const { low, high } = pitchRange();
    const W = KEY_W + length() * cellW + 1;
    const H = HEAD_H + (high - low + 1) * ROW_H;
    if (rollCanvas.width !== W || rollCanvas.height !== H) { rollCanvas.width = W; rollCanvas.height = H; }
    const ctx = rollCanvas.getContext('2d');
    const left = rollStage.scrollLeft;
    const top = rollStage.scrollTop;
    const rowY = (midi) => HEAD_H + (high - midi) * ROW_H;
    ctx.fillStyle = '#07040e';
    ctx.fillRect(0, 0, W, H);
    for (let midi = low; midi <= high; midi++) {
      const pc = ((midi - keyRoot) % 12 + 12) % 12;
      ctx.fillStyle = pc === 0 ? '#2a1f45' : inScale(midi) ? '#1c1430' : '#0d0918';
      ctx.fillRect(KEY_W, rowY(midi), W - KEY_W, ROW_H - 1);
    }
    drawStepLines(ctx, HEAD_H, H);

    const instrument = song.instruments[trackName];
    // Other tracks, faintly, to write against.
    for (const name of melodic()) {
      if (name === trackName) continue;
      ctx.fillStyle = `${colorOf(name)}38`;
      for (const n of notesIn(section_()[name])) ctx.fillRect(KEY_W + n.start * cellW + 1, rowY(n.midi) + 2, (n.end - n.start) * cellW - 2, ROW_H - 5);
    }
    if (instrument && !instrument.drum) {
      const color = colorOf(trackName);
      for (const n of notesIn(section_()[trackName])) {
        const x = KEY_W + n.start * cellW;
        const y = rowY(n.midi);
        ctx.fillStyle = color;
        ctx.fillRect(x + 1, y, (n.end - n.start) * cellW - 1, ROW_H - 1);
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.fillRect(x + 1, y, 3, ROW_H - 1);
        if (muted.has(trackName)) { ctx.fillStyle = 'rgba(7,4,14,0.6)'; ctx.fillRect(x + 1, y, (n.end - n.start) * cellW - 1, ROW_H - 1); }
      }
    }
    const head = playhead();
    if (head && head.name === sectionName) {
      ctx.fillStyle = 'rgba(79, 227, 208, 0.18)';
      ctx.fillRect(KEY_W + head.step * cellW, HEAD_H, cellW, H - HEAD_H);
      ctx.fillStyle = '#4fe3d0';
      ctx.fillRect(KEY_W + head.step * cellW, HEAD_H, 2, H - HEAD_H);
    }
    // Bar numbers, pinned to the top.
    ctx.fillStyle = '#07040e';
    ctx.fillRect(left, top, W, HEAD_H);
    ctx.font = '17px VT323, monospace';
    for (let bar = 0; bar * stepsPerBar() < length(); bar++) {
      ctx.fillStyle = '#ffe14d';
      ctx.fillText(String(bar + 1), KEY_W + bar * stepsPerBar() * cellW + 4, top + 15);
    }
    // The keyboard, pinned to the left.
    for (let midi = low; midi <= high; midi++) {
      const y = rowY(midi);
      const pressed = keyDown === midi;
      ctx.fillStyle = pressed ? '#ff8c1a' : isBlack(midi) ? '#1b1428' : '#d8d0e8';
      ctx.fillRect(left, y, KEY_W - 3, ROW_H - 1);
      if (inScale(midi) && !pressed) { ctx.fillStyle = '#4fe3d0'; ctx.fillRect(left + KEY_W - 7, y + 3, 3, ROW_H - 7); }
      ctx.fillStyle = isBlack(midi) ? '#8a80a3' : '#120c1c';
      ctx.font = '14px VT323, monospace';
      ctx.fillText(noteName(midi), left + 5, y + ROW_H - 3);
    }
    ctx.fillStyle = '#07040e';
    ctx.fillRect(left, top, KEY_W, HEAD_H);
  }

  let keyDown = null;
  function rollCell(e) {
    const r = rollCanvas.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const { low, high } = pitchRange();
    const midi = high - Math.floor((y - HEAD_H) / ROW_H);
    const step = Math.floor((x - KEY_W) / cellW);
    const onKeys = x - rollStage.scrollLeft < KEY_W;
    const onHead = y - rollStage.scrollTop < HEAD_H;
    const valid = !onKeys && !onHead && step >= 0 && step < length() && midi >= low && midi <= high;
    return { step, midi, valid, onKeys: onKeys && !onHead && midi >= low && midi <= high };
  }
  function snapped(midi) {
    if (!snap || inScale(midi)) return midi;
    for (let d = 1; d < 12; d++) {
      if (inScale(midi + d)) return midi + d;
      if (inScale(midi - d)) return midi - d;
    }
    return midi;
  }
  function writeNote(steps, start, len, midi) {
    const end = Math.min(steps.length, start + len);
    steps[start] = midi;
    for (let i = start + 1; i < end; i++) steps[i] = HOLD;
    clearOrphanHolds(steps, end);
  }

  rollCanvas.addEventListener('contextmenu', (e) => e.preventDefault());
  rollCanvas.addEventListener('pointerdown', (e) => {
    if (!song) return;
    const cell = rollCell(e);
    if (cell.onKeys) {
      keyDown = cell.midi;
      previewNote(cell.midi);
      drawRoll();
      return;
    }
    if (!cell.valid) return;
    if (song.instruments[trackName]?.drum) { toast('Pick a track on the left to write notes. Drums go in the grid below.', { kind: 'info' }); return; }
    const steps = section_()[trackName];
    const notes = notesIn(steps);
    const covering = notes.filter((n) => cell.step >= n.start && cell.step < n.end);
    if (e.button === 2 || covering.some((n) => n.midi === cell.midi)) {
      const target = covering.find((n) => n.midi === cell.midi) ?? covering[0];
      if (!target) return;
      edit(() => { for (let i = target.start; i < target.end; i++) steps[i] = REST; }, false);
      return;
    }
    beginEdit();
    const midi = snapped(cell.midi);
    writeNote(steps, cell.step, Math.max(1, lengthSteps(noteLength)), midi);
    previewNote(midi);
    drag = { start: cell.step, midi, before: [...steps], moved: false };
    try { rollCanvas.setPointerCapture(e.pointerId); } catch { /* synthetic */ }
    drawRoll();
  });
  rollCanvas.addEventListener('pointermove', (e) => {
    if (!song) return;
    const cell = rollCell(e);
    renderStatus(cell.valid || cell.onKeys ? `${noteName(snapped(cell.midi))}${cell.valid ? `  ·  bar ${Math.floor(cell.step / stepsPerBar()) + 1}, step ${(cell.step % stepsPerBar()) + 1}` : ''}` : '');
    if (!drag) return;
    if (cell.step !== drag.start) drag.moved = true;
    if (!drag.moved) return;
    const steps = section_()[trackName];
    drag.before.forEach((s, i) => { steps[i] = s; });
    // Dragging sets the length: the note runs to wherever the mouse is.
    const end = clamp(cell.step, drag.start, length() - 1);
    steps[drag.start] = drag.midi;
    for (let i = drag.start + 1; i <= end; i++) steps[i] = HOLD;
    clearOrphanHolds(steps, end + 1);
    drawRoll();
  });
  const endRoll = () => {
    if (keyDown !== null) { keyDown = null; drawRoll(); }
    if (!drag) return;
    drag = null;
    changed();
    refreshGrids();
  };
  rollCanvas.addEventListener('pointerup', endRoll);
  rollCanvas.addEventListener('pointercancel', endRoll);
  rollCanvas.addEventListener('pointerleave', () => { if (keyDown !== null) { keyDown = null; drawRoll(); } });

  // --- Drum grid: Kick, Snare, Hat, Open hat ---
  function drumRows() {
    const rows = [];
    for (const [kind, label, volume] of DRUMS) {
      const tracks = drumTracks().filter((n) => song.instruments[n].drum === kind);
      if (!tracks.length) rows.push({ kind, label, volume, track: null });
      tracks.forEach((track, i) => rows.push({ kind, label: i ? `${label} ${i + 1}` : label, volume, track }));
    }
    // Real drums: a row per track, named after its recording.
    for (const track of drumTracks().filter((n) => song.instruments[n].drum === 'sample')) {
      rows.push({ kind: 'sample', label: setLabel(song.instruments[track].sample ?? track).slice(0, 7), volume: song.instruments[track].volume, track });
    }
    return rows;
  }

  function drawDrums() {
    if (!song) return;
    const rows = drumRows();
    const W = KEY_W + length() * cellW + 1;
    const H = rows.length * DRUM_ROW_H;
    if (drumCanvas.width !== W || drumCanvas.height !== H) { drumCanvas.width = W; drumCanvas.height = H; }
    const ctx = drumCanvas.getContext('2d');
    const left = drumStage.scrollLeft;
    ctx.fillStyle = '#07040e';
    ctx.fillRect(0, 0, W, H);
    rows.forEach((row, r) => {
      ctx.fillStyle = r % 2 ? '#120c1f' : '#170f28';
      ctx.fillRect(KEY_W, r * DRUM_ROW_H, W - KEY_W, DRUM_ROW_H - 1);
    });
    drawStepLines(ctx, 0, H);
    rows.forEach((row, r) => {
      if (!row.track) return;
      section_()[row.track].forEach((step, i) => {
        if (step !== HIT) return;
        ctx.fillStyle = muted.has(row.track) ? '#5a4a3a' : '#ff8c1a';
        ctx.fillRect(KEY_W + i * cellW + 3, r * DRUM_ROW_H + 5, cellW - 5, DRUM_ROW_H - 11);
      });
    });
    const head = playhead();
    if (head && head.name === sectionName) {
      ctx.fillStyle = '#4fe3d0';
      ctx.fillRect(KEY_W + head.step * cellW, 0, 2, H);
    }
    ctx.fillStyle = '#07040e';
    ctx.fillRect(left, 0, KEY_W, H);
    ctx.font = '18px VT323, monospace';
    rows.forEach((row, r) => {
      ctx.fillStyle = row.track ? '#ece6f7' : '#6c6288';
      ctx.fillText(row.label, left + 6, r * DRUM_ROW_H + 18);
    });
  }

  let drumPaint = null;
  function drumCell(e) {
    const r = drumCanvas.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    return { label: x - drumStage.scrollLeft < KEY_W, step: Math.floor((x - KEY_W) / cellW), row: Math.floor(y / DRUM_ROW_H) };
  }
  drumCanvas.addEventListener('pointerdown', (e) => {
    if (!song) return;
    const cell = drumCell(e);
    const row = drumRows()[cell.row];
    if (!row || cell.label || cell.step < 0 || cell.step >= length()) return;
    beginEdit();
    if (!row.track) {
      // First hit on a drum the song doesn't have yet: add it.
      let name = row.kind;
      for (let n = 2; song.instruments[name]; n++) name = `${row.kind}${n}`;
      song.instruments[name] = { drum: row.kind, volume: row.volume };
      for (const sec of Object.values(song.sections)) sec[name] = Array(Object.values(sec)[0]?.length ?? length()).fill(REST);
      row.track = name;
    }
    const steps = section_()[row.track];
    if (steps[cell.step] !== HIT) previewNote(60, row.track);
    drumPaint = { track: row.track, value: steps[cell.step] === HIT ? REST : HIT };
    steps[cell.step] = drumPaint.value;
    try { drumCanvas.setPointerCapture(e.pointerId); } catch { /* synthetic */ }
    drawDrums();
  });
  drumCanvas.addEventListener('pointermove', (e) => {
    if (!song) return;
    const cell = drumCell(e);
    const row = drumRows()[cell.row];
    if (row && !cell.label && cell.step >= 0) renderStatus(`${row.label}  ·  bar ${Math.floor(cell.step / stepsPerBar()) + 1}, step ${(cell.step % stepsPerBar()) + 1}`);
    if (!drumPaint || cell.label || cell.step < 0 || cell.step >= length()) return;
    section_()[drumPaint.track][cell.step] = drumPaint.value;
    drawDrums();
  });
  const endDrum = () => {
    if (!drumPaint) return;
    drumPaint = null;
    changed();
    refreshGrids();
  };
  drumCanvas.addEventListener('pointerup', endDrum);
  drumCanvas.addEventListener('pointercancel', endDrum);

  window.addEventListener('keydown', (e) => {
    if (!studio.isActive() || !song || isTyping(e) || document.querySelector('.overlay')) return;
    const key = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); return; }
    if ((e.ctrlKey || e.metaKey) && (key === 'y' || (key === 'z' && e.shiftKey))) { e.preventDefault(); redo(); return; }
    if (e.code === 'Space' && !e.ctrlKey) { e.preventDefault(); togglePlay(); }
  });

  function renderStatus(text = '') {
    setChildren(status, el('span', {}, text), el('span', { class: 'spacer' }),
      el('span', { class: 'hint', style: 'margin:0' }, 'Click to add a note, drag to make it longer, click it again to remove · Space plays'));
  }

  // --- Advanced: grid, order and the instrument's raw settings ---
  function renderAdvanced() {
    if (!studio.advanced || !song) { setChildren(advanced); return; }
    const inst = song.instruments[trackName];
    const num = (obj, key, label, step = 0.01) => field(label, el('input', { type: 'number', step, value: obj[key] ?? '', placeholder: 'default', onchange: (e) => edit(() => { if (e.target.value === '') delete obj[key]; else obj[key] = Number(e.target.value); }) }));
    const optional = (key, label, defaults, fields) => [
      checkbox(Boolean(inst[key]), (on) => edit(() => { if (on) inst[key] = { ...defaults }; else delete inst[key]; }), label),
      inst[key] ? el('div', { style: 'padding-left:16px;margin-top:8px' }, fields(inst[key])) : null,
    ];
    setChildren(advanced,
      section('Advanced',
        el('div', { class: 'row' },
          field('Steps per beat', el('input', { type: 'number', min: 1, max: 8, value: song.stepsPerBeat, onchange: (e) => edit(() => { song.stepsPerBeat = clamp(Math.round(Number(e.target.value)) || 2, 1, 8); }) })),
          field('Beats per bar', el('input', { type: 'number', min: 1, max: 12, value: beatsPerBar, onchange: (e) => edit(() => { beatsPerBar = clamp(Math.round(Number(e.target.value)) || 4, 1, 12); }) }))),
        field('Order', el('input', {
          type: 'text', value: song.order.join(' '),
          onchange: (e) => {
            const names = e.target.value.split(/\s+/).filter(Boolean);
            const bad = names.filter((n) => !song.sections[n]);
            if (!names.length || bad.length) { toast(bad.length ? `No section called ${bad.join(', ')}` : 'The order needs a section.', { kind: 'error' }); e.target.value = song.order.join(' '); return; }
            edit(() => { song.order = names; if ((song.loopFrom ?? 0) >= names.length) delete song.loopFrom; });
          },
        }), 'Sections in the order they play, separated by spaces.'),
        field('Loop back to', select(song.order.map((n, i) => [String(i), `${i + 1}. ${n}`]), String(song.loopFrom ?? 0), (v) => edit(() => { if (Number(v)) song.loopFrom = Number(v); else delete song.loopFrom; })), 'Where the song jumps back to after the last section.')),
      inst ? section(`Sound: ${friendly(trackName)}`,
        inst.sample
          ? [
            hint(`Real recordings: ${setLabel(inst.sample)}${isUnpitched(inst.sample) ? ' (a drum hit)' : ''}.`),
            el('div', { class: 'row' }, num(inst, 'volume', 'Volume'), num(inst, 'reverb', 'Reverb')),
            el('div', { class: 'row' }, num(inst, 'attack', 'Fade in (s)'), num(inst, 'release', 'Fade out (s)')),
            el('div', { class: 'row' }, num(inst, 'octave', 'Octave shift', 1), num(inst, 'pan', 'Pan (-1 to 1)')),
            checkbox(Boolean(inst.ring), (on) => edit(() => { if (on) inst.ring = true; else delete inst.ring; }), 'Let notes ring out (piano pedal, harp, drums)'),
            field('Track name', el('input', { type: 'text', value: trackName, onchange: (e) => renameTrack(e.target.value.trim()) })),
          ]
          : inst.drum
          ? [field('Drum', select(DRUMS.map(([k, l]) => [k, l]), inst.drum, (v) => edit(() => { inst.drum = v; }))), num(inst, 'volume', 'Volume')]
          : [
            field('Wave', select(WAVES, inst.wave ?? 'square', (v) => edit(() => { inst.wave = v; }))),
            el('div', { class: 'row' }, num(inst, 'volume', 'Volume'), num(inst, 'gate', 'Gate')),
            el('div', { class: 'row' }, num(inst, 'attack', 'Attack'), num(inst, 'decay', 'Decay')),
            el('div', { class: 'row' }, num(inst, 'sustain', 'Sustain'), num(inst, 'release', 'Release')),
            ...optional('vibrato', 'Vibrato', { rate: 5, depth: 10 }, (v) => el('div', { class: 'row' }, num(v, 'rate', 'Rate'), num(v, 'depth', 'Depth'))),
            ...optional('echo', 'Echo', { time: 0.3, feedback: 0.3, mix: 0.25 }, (v) => el('div', { class: 'row' }, num(v, 'time', 'Time'), num(v, 'feedback', 'Feedback'), num(v, 'mix', 'Mix'))),
            ...optional('filter', 'Filter', { type: 'lowpass', frequency: 2500 }, (v) => el('div', { class: 'row' }, field('Type', select(['lowpass', 'highpass', 'bandpass'], v.type, (t) => edit(() => { v.type = t; }))), num(v, 'frequency', 'Hz', 50))),
            field('Track name', el('input', { type: 'text', value: trackName, onchange: (e) => renameTrack(e.target.value.trim()) })),
          ]) : null,
      section('Code', hint(`Saves to src/data/music/${meta.file} as ${meta.constName}.`), codeView(songModule(song, meta.constName, beatsPerBar))));
  }

  function renameTrack(name) {
    if (!/^[A-Za-z_$][\w$]*$/.test(name) || song.instruments[name]) { toast('Track names are letters and numbers, and must be new.', { kind: 'error' }); renderAdvanced(); return; }
    edit(() => {
      const rename = (obj) => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k === trackName ? name : k, v]));
      song.instruments = rename(song.instruments);
      for (const key of Object.keys(song.sections)) song.sections[key] = rename(song.sections[key]);
      if (muted.delete(trackName)) muted.add(name);
      trackName = name;
    });
  }
  window.addEventListener('studio:advanced', () => renderAdvanced());

  // --- Refreshing ---
  function refreshGrids() {
    drawRoll();
    drawDrums();
  }
  function refreshAll() {
    if (!song) return;
    if (!song.sections[sectionName]) sectionName = Object.keys(song.sections)[0];
    if (!song.instruments[trackName]) trackName = melodic()[0] ?? Object.keys(song.instruments)[0];
    studio.setFile(`src/data/music/${meta.file}${meta.isNew ? ' (new)' : ''}`);
    tempo.set(song.bpm);
    if (lengthSteps(noteLength) < 1) noteLength = '1/8';
    lengthPick.set(noteLength);
    renderSongSelect();
    renderSongPanel();
    renderTracks();
    renderSections();
    renderAdvanced();
    renderStatus();
    renderPlayButton();
    refreshGrids();
  }

  // --- Saving ---
  async function getFiles() {
    if (!song) throw new Error('Open or make a song first.');
    for (const [name, sec] of Object.entries(song.sections)) {
      const lengths = new Set(Object.values(sec).map((s) => s.length));
      if (lengths.size > 1) throw new Error(`Section ${name} has tracks of different lengths. Use the bar buttons to even them out.`);
    }
    if (meta.isNew) {
      const existing = (await listDir('src/data/music')) ?? [];
      if (existing.includes(meta.file)) throw new Error(`There's already a song file called ${meta.file}.`);
    }
    return [{ path: `src/data/music/${meta.file}`, content: songModule(song, meta.constName, beatsPerBar) }];
  }

  async function afterSave() {
    meta.isNew = false;
    studio.setDirty(false);
    songs = await loadSongs(true);
    order = await loadOrder(true);
    refreshAll();
  }

  const first = songs.battle ? 'battle' : Object.keys(songs)[0];
  if (first) await openSong(first);
  return { getFiles, afterSave, onHide: () => stop() };
}
