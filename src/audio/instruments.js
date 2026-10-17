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
