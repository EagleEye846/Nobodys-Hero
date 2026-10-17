// Instrument presets that sound like the real thing (or as near as a synth
// gets): use them in songs as `{ ...STRINGS, volume: 0.05 }`. They lean on the
// richer features of playTone in music.js: layered detuned voices, custom
// harmonics, filter sweeps and the concert-hall reverb.

// A string section holding long notes: three bowed voices, slightly out of
// tune with each other, softened, with a gentle vibrato.
export const STRINGS = {
  voices: [{ wave: 'sawtooth', detune: -9 }, { wave: 'sawtooth', detune: 0 }, { wave: 'sawtooth', detune: 9 }],
  filter: { type: 'lowpass', frequency: 2400 },
  attack: 0.18, decay: 0.6, sustain: 0.85, release: 0.45, gate: 1,
  vibrato: { rate: 5.5, depth: 7 },
  reverb: 0.35,
};

// The same section playing short, bouncing notes (spiccato), for driving rhythms.
export const STACCATO_STRINGS = {
  voices: [{ wave: 'sawtooth', detune: -7 }, { wave: 'sawtooth', detune: 7 }],
  filter: { type: 'lowpass', frequency: 3000 },
  attack: 0.004, decay: 0.07, sustain: 0.12, release: 0.06, gate: 0.6,
  click: 0.15,
  reverb: 0.25,
};

// Cellos and basses digging in: a low, growling section.
export const LOW_STRINGS = {
  voices: [{ wave: 'sawtooth', detune: -6 }, { wave: 'sawtooth', detune: 6 }, { wave: 'sine', octave: -1, level: 0.6 }],
  filter: { type: 'lowpass', frequency: 1100 },
  attack: 0.01, decay: 0.15, sustain: 0.6, release: 0.1, gate: 0.85,
  click: 0.1,
  reverb: 0.2,
};

// French horns and trombones: the tone opens up as each note blares.
export const BRASS = {
  voices: [{ wave: 'sawtooth', detune: -5 }, { wave: 'sawtooth', detune: 5 }, { wave: 'square', octave: -1, level: 0.25 }],
  sweep: { from: 400, to: 3200, time: 0.14, q: 2 },
  attack: 0.03, decay: 0.35, sustain: 0.75, release: 0.18, gate: 0.95,
  vibrato: { rate: 5, depth: 5 },
  reverb: 0.3,
};

// A grand piano: bright when struck, then fading away.
export const PIANO = {
  harmonics: [1, 0.55, 0.35, 0.2, 0.12, 0.08, 0.05, 0.03],
  attack: 0.002, decay: 0.7, sustain: 0, release: 0.35, gate: 1,
  click: 0.06,
  reverb: 0.35,
};

// A choir singing "ah": soft and wide, with a slow swell.
export const CHOIR = {
  voices: [
    { harmonics: [1, 0.7, 0.5, 0.2, 0.12, 0.08], detune: -6 },
    { harmonics: [1, 0.7, 0.5, 0.2, 0.12, 0.08], detune: 6 },
    { wave: 'sine', octave: 1, level: 0.15 },
  ],
  filter: { type: 'lowpass', frequency: 1800 },
  attack: 0.4, decay: 0.8, sustain: 0.9, release: 0.6, gate: 1,
  vibrato: { rate: 5, depth: 10 },
  reverb: 0.55,
};

// Timpani: big tuned drums that land slightly sharp and settle onto the note.
export const TIMPANI = {
  harmonics: [1, 0.45, 0.25, 0.1],
  bend: { cents: 60, time: 0.05 },
  attack: 0.002, decay: 0.35, sustain: 0, release: 0.5, gate: 1,
  click: 0.35,
  reverb: 0.35,
};

// A music box / glockenspiel: a little bell, ringing out.
export const BELLS = {
  harmonics: [1, 0, 0.45, 0, 0.25, 0, 0.12],
  attack: 0.002, decay: 0.5, sustain: 0.05, release: 0.6, gate: 1,
  reverb: 0.4,
};

// A church pipe organ: stacked pipes (a deep one an octave down, a bright one
// an octave up), held steady with a slight tremble, in a big stone hall.
export const ORGAN = {
  voices: [
    { harmonics: [1, 0.85, 0.5, 0.55, 0.2, 0.3, 0, 0.25], level: 0.55 },
    { wave: 'sine', octave: -1, level: 0.35 },
    { harmonics: [1, 0.5, 0.3], octave: 1, detune: 4, level: 0.18 },
  ],
  filter: { type: 'lowpass', frequency: 3600 },
  attack: 0.03, decay: 0.3, sustain: 0.95, release: 0.3, gate: 0.95,
  vibrato: { rate: 6, depth: 3 },
  reverb: 0.5,
};

// --- Soloists and a concert hall. These lean on the touches that make a synth
// sound played rather than programmed: vibrato that blooms in after the note
// starts, bow or breath noise under the tone, a tone that darkens as it rings,
// seats across the stage (`pan`), and a little human unevenness (`humanize`).

// A concert grand: two strings per note slightly out of tune, bright when
// struck and mellowing as it rings, with the pedal down.
const GRAND = [1, 0.6, 0.4, 0.28, 0.16, 0.11, 0.07, 0.05, 0.03, 0.02];
export const CONCERT_PIANO = {
  voices: [{ harmonics: GRAND, detune: -2 }, { harmonics: GRAND, detune: 2 }],
  sweep: { from: 5200, to: 1300, time: 1.6, q: 0.4 },
  attack: 0.002, decay: 1.6, sustain: 0, release: 1.1, gate: 1,
  click: 0.04,
  humanize: { time: 0.012, volume: 0.2 },
  reverb: 0.45,
};

// One violin, singing: a bowed edge that settles, and vibrato that blooms.
export const SOLO_VIOLIN = {
  voices: [{ wave: 'sawtooth', detune: -3 }, { wave: 'sawtooth', detune: 3 }, { wave: 'sine', level: 0.3 }],
  sweep: { from: 1400, to: 3600, time: 0.18, q: 0.6 },
  filter: { type: 'lowpass', frequency: 4200 },
  attack: 0.09, decay: 0.8, sustain: 0.85, release: 0.35, gate: 1,
  vibrato: { rate: 5.6, depth: 16, delay: 0.4 },
  breath: { level: 0.04, frequency: 3200, q: 0.8 },
  humanize: { time: 0.01, volume: 0.12 },
  pan: 0.2,
  reverb: 0.5,
};

// A cello: the same bowing, lower and darker.
export const CELLO = {
  voices: [{ wave: 'sawtooth', detune: -3 }, { wave: 'sawtooth', detune: 3 }, { wave: 'sine', octave: -1, level: 0.25 }],
  sweep: { from: 600, to: 1800, time: 0.22, q: 0.6 },
  filter: { type: 'lowpass', frequency: 2000 },
  attack: 0.1, decay: 0.8, sustain: 0.85, release: 0.4, gate: 1,
  vibrato: { rate: 5, depth: 12, delay: 0.45 },
  breath: { level: 0.03, frequency: 1600, q: 0.8 },
  humanize: { time: 0.012, volume: 0.12 },
  pan: -0.35,
  reverb: 0.45,
};

// A flute: nearly pure, with air around it.
export const FLUTE = {
  harmonics: [1, 0.22, 0.07, 0.03],
  attack: 0.07, decay: 0.6, sustain: 0.85, release: 0.25, gate: 0.97,
  vibrato: { rate: 5, depth: 9, delay: 0.3 },
  breath: { level: 0.1, frequency: 2400, q: 0.7 },
  humanize: { time: 0.01, volume: 0.12 },
  pan: 0.15,
  reverb: 0.5,
};

// A concert harp: plucked, ringing, softening as it fades.
export const HARP = {
  harmonics: [1, 0.45, 0.22, 0.12, 0.06, 0.03],
  sweep: { from: 4200, to: 1100, time: 0.8, q: 0.4 },
  attack: 0.003, decay: 1.3, sustain: 0, release: 1.2, gate: 1,
  click: 0.03,
  humanize: { time: 0.015, volume: 0.25 },
  pan: -0.25,
  reverb: 0.55,
};

// A French horn, played softly: round and far away.
export const HORN = {
  voices: [{ wave: 'sawtooth', detune: -4 }, { wave: 'sawtooth', detune: 4 }, { wave: 'sine', octave: -1, level: 0.3 }],
  sweep: { from: 300, to: 1300, time: 0.35, q: 0.7 },
  attack: 0.12, decay: 0.8, sustain: 0.8, release: 0.5, gate: 1,
  vibrato: { rate: 4.5, depth: 5, delay: 0.5 },
  humanize: { time: 0.015, volume: 0.1 },
  pan: -0.15,
  reverb: 0.6,
};

// A full string section, warmer and wider than STRINGS, swelling into each chord.
export const STRING_SECTION = {
  voices: [
    { wave: 'sawtooth', detune: -11 }, { wave: 'sawtooth', detune: -4 },
    { wave: 'sawtooth', detune: 4 }, { wave: 'sawtooth', detune: 11 },
  ],
  filter: { type: 'lowpass', frequency: 2200 },
  attack: 0.5, decay: 1, sustain: 0.9, release: 0.8, gate: 1,
  vibrato: { rate: 5.2, depth: 8, delay: 0.5 },
  breath: { level: 0.02, frequency: 2600, q: 0.6 },
  reverb: 0.55,
};

// Double basses plucked (pizzicato): a soft, round thump.
export const PIZZICATO_BASS = {
  harmonics: [1, 0.5, 0.2, 0.08],
  sweep: { from: 1500, to: 400, time: 0.25, q: 0.5 },
  attack: 0.004, decay: 0.35, sustain: 0, release: 0.4, gate: 1,
  click: 0.05,
  humanize: { time: 0.01, volume: 0.2 },
  pan: -0.1,
  reverb: 0.35,
};
