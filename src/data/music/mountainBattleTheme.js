import { melody, chordLine, sustained, arpeggio, transpose, hits, repeat } from '../../audio/notation.js';
import { BELLS, STRINGS, STACCATO_STRINGS } from '../../audio/instruments.js';
import { VES_MOTIF } from './vesTheme.js';

// "Updraft": the regular battle theme on the mountain, once Ves has joined
// the party. Cotton Clash's sibling (same drive, same brassy sawtooth hero
// lead), but cold and windy: a galloping plucked ostinato in 16ths like
// boots kicking up snow, spiccato strings on the off-beats, gusts of wind
// that sweep up into the big moments, a glockenspiel and ice chimes for the
// snow, and a punchy kit. The hero has a tune of his own, built on a rising
// fifth (D up to A, like looking up the mountain); Ves has hers, her motif
// from "Carried on the Wind" (VES_MOTIF in vesTheme.js: C C A, Bb G A),
// played fast and heroic on a bright, airy lead with the glockenspiel on it.
// They take turns, then fight side by side in thirds.
// D minor, lifting into F major for Ves and up to G major for the last
// chorus. 162 BPM, one step is a 16th note. The intro plays once, then about
// a minute and a half loops from A.
//
//   intro       4 bars  wind rising, the ostinato alone, the glockenspiel
//                       hinting at her motif, a drum build
//   A           8 bars  the hero's tune
//   A2          8 bars  its second half, climbing, turning to F major
//   B           8 bars  VES'S HOOK: her motif, heroic and fast (C-C up to A,
//                       Bb, on to C), in F; the hero pumps a counter under her
//   duet        8 bars  call and response: the hero 2 bars, Ves answers with
//                       her motif 2 bars (as written, then heroic), twice
//   breakdown   8 bars  half time, wind howling: the glockenspiel plays her
//                       motif slowly in D minor; then the hero's tune at half
//                       speed builds back up with a snare roll
//   A3          8 bars  the hero's tune again, Ves singing a third under it
//   B2          8 bars  her hook again, a step higher in G, everything in
//   turn        4 bars  both of them in thirds on her motif, climbing in
//                       sequence, and back round to A

const BAR = 16;
const tune = (text) => melody(text, 2); // each token an 8th note
const rest = (bars) => Array(bars * BAR).fill('.');

// Her motif, the fast heroic way: it climbs on past the ache instead of
// settling. VES_MOTIF itself is C5/C5 A5 - - Bb5 G5 A5 -; the duet quotes it
// note for note.
const VES_HEROIC = 'C5/C5 A5 - Bb5 - C6 - -';

// --- Chords, one a bar. ---
const INTRO_CHORDS = 'Dm Dm Bb A';
const A_CHORDS = 'Dm Bb C A Dm Bb C A';
const A2_CHORDS = 'Gm Dm Bb F Gm Dm Bb C';
const B_CHORDS = 'F Dm Bb C F Dm Gm C';
const DUET_CHORDS = 'Dm Bb F C Dm Bb Gm A';
const BREAK_CHORDS = 'Dm Dm Bb Bb Gm Gm A A';
const A3_CHORDS = 'Dm Bb C A Dm Bb C D';
const B2_CHORDS = 'G Em C D G Em Am D';
const TURN_CHORDS = 'Bb C Dm A';

// --- The hero's tune: a rising fifth, a turn, and a run up. ---
const HERO_A = tune(`
  D5 - A5 - - G5 A5 C6 | Bb5 - A5 - F5 - D5 - |
  E5 - G5 - - F5 G5 Bb5 | A5 - - - C#6/D6 C#6 A5 E5 |
  D5 - A5 - - G5 A5 D6 | F6 - E6 D6 - C6 Bb5 A5 |
  G5 - C6 - - Bb5 A5 G5 | A5 - - - E5 - C#5/D5 E5
`);

// The second half climbs, then opens out into F major for her.
const HERO_A2 = tune(`
  G5 - Bb5 - D6 - C6 Bb5 | A5 - - F5 - A5 D6 - |
  Bb5 - A5 G5 - F5 D5 F5 | A5 - - - C6 - A5 - |
  Bb5 - D6 - G6 - F6 D6 | F6 - E6 - D6 - A5 - |
  D6 - C6 Bb5 - A5 G5 F5 | E5 - - - G5 - C6 - |
`);

// --- B: Ves's hook. Her motif, heroic: C-C, up a sixth to A, the ache on Bb,
// on up to C, and a leap to the top. Then a step higher, and again.
const VES_B = tune(`
  ${VES_HEROIC} | F6 - - - E6 - D6 - |
  D5/D5 Bb5 - C6 - D6 - - | G6 - - - E6 - C6 - |
  ${VES_HEROIC} | F6 - - - A6 - G6 F6 |
  G5/G5 D6 - E6 - F6 - - | E6 - - - C6 - G5 - |
`);
// Under her, the hero's brass pumps the chords in 3+3+2.
const HERO_PUMP = tune(`
  A4 - - A4 - - C5 - | D5 - - D5 - - F5 - |
  D5 - - D5 - - F5 - | E5 - - E5 - - G5 - |
  A4 - - A4 - - C5 - | D5 - - D5 - - F5 - |
  D5 - - D5 - - G5 - | E5 - - - G5 - - - |
`);

// --- The duet: the hero calls, Ves answers. First with her motif exactly as
// it is in her own theme, then heroic, a step up.
const DUET_HERO = tune(`
  D5 A5 - G5 A5 - C6 D6 | - - Bb5 - A5 - F5 - |
  . . . . . . . . | . . . . . . . . |
  D6 A5 - G5 A5 - D6 E6 | F6 - - - D6 - Bb5 - |
  . . . . . . . . | . . . . . . . . |
`);
const DUET_VES = [
  ...rest(2),
  ...VES_MOTIF, ...tune('G5 - - - E5 - G5 -'),
  ...rest(2),
  ...tune('D5/D5 Bb5 - C6 - D6 - - | E6 - - - C#6 - A5 -'),
];

// --- Breakdown: her motif slow and in D minor on the glockenspiel (the
// minor-sixth form from her theme), then the hero's rising fifth at half
// speed, building back.
const BREAK_GLOCK = tune(`
  A5 A5 F6 - - - - - | G6 - E6 - F6 - - - |
  Bb5 Bb5 G6 - - - - - | A6 - F6 - G6 - - - |
  . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . |
`);
const BREAK_HERO = [
  ...rest(4),
  ...tune('D5 - - - A5 - - - | G5 - - - A5 - Bb5 - | A5 - - - E5 - - - | C#6 - - - E6 - - - |'),
];

// --- A3: the hero's tune, Ves a third under it, the last bar turning to D
// to lift the key for her last chorus.
const HERO_A3 = [
  ...HERO_A.slice(0, 7 * BAR),
  ...tune('A5 - - - F#5 - A5/B5 C6'),
];
const VES_A3 = tune(`
  A4 - F5 - - E5 F5 A5 | F5 - F5 - D5 - Bb4 - |
  C5 - E5 - - D5 E5 G5 | E5 - - - A5/Bb5 A5 E5 C#5 |
  A4 - F5 - - E5 F5 A5 | D6 - C6 Bb5 - A5 G5 F5 |
  E5 - G5 - - G5 F5 E5 | F#5 - - - D5 - F#5/G5 A5 |
`);

// --- Turn: both of them on her motif, in thirds, climbing in sequence.
const VES_TURN = tune(`
  D5/D5 Bb5 - C6 - D6 - - | E5/E5 C6 - D6 - E6 - - |
  F5/F5 D6 - E6 - F6 - - | E6 - - - - - . . |
`);
const HERO_TURN = tune(`
  Bb4/Bb4 G5 - A5 - Bb5 - - | C5/C5 A5 - Bb5 - C6 - - |
  D5/D5 Bb5 - C6 - D6 - - | C#6 - - - - - . . |
`);

// --- Intro: the glockenspiel hints at her motif over the ostinato.
const INTRO_GLOCK = tune(`
  . . . . . . . . | A5/A5 F6 - - G6 E6 F6 - |
  . . . . . . . . | C#6 - E6 - A6 - - - |
`);

// --- Accompaniment patterns, as semitones above each chord's root. ---
// The ostinato: plucked 16ths galloping round the chord, fifths and octaves.
const OSTINATO = [12, 7, 0, 7, 12, 7, 'tenth', 7, 12, 7, 0, 7, 'tenth', 12, 7, 12];
const OSTINATO_HALF = [12, '.', 7, '.', 'tenth', '.', 7, '.', 12, '.', 7, '.', 'tenth', '.', 19, '.'];
// Bass: an octave bounce that kicks on the 16th before each beat.
const BASS = [0, '-', '.', 0, 12, '.', 0, '.', 0, '-', '.', 0, 12, '.', 7, 12];
const BASS_HELD = [0, ...Array(15).fill('-')];
const BASS_EIGHTHS = [0, '.', 0, '.', 12, '.', 0, '.', 0, '.', 0, '.', 12, '.', 7, '.'];
// Spiccato strings stabbing the off-beats.
const STAB_THIRD = ['.', '.', 'third', '.', '.', 'third', '.', '.', '.', '.', 'third', '.', '.', 'third', '.', 'third'];
const STAB_FIFTH = STAB_THIRD.map((step) => (step === 'third' ? 7 : step));

// --- Drums. ---
const KICK = hits('x.....x. ..x...x.');
const KICK_DRIVE = hits('x...x... x...x.x.');
const KICK_HALF = hits('x....... ........');
const KICK_FOUR = hits('x...x... x...x...');
const SNARE = hits('....x... ....x...');
const SNARE_HALF = hits('........ x.......');
const SNARE_FILL = hits('x.x.x.x. xxxxxxxx');
const SNARE_EIGHTHS = hits('x.x.x.x. x.x.x.x.');
const SNARE_ROLL = hits('xxxxxxxx xxxxxxxx');
const HAT = hits('x.xx x.xx x.xx x.xx'); // a gallop
const OPEN_HAT = hits('..x...x. ..x...x.');
const ONE = hits('x....... ........');
const NONE = hits('........ ........');

// Snow: now and then, on an 8th, a high chord tone rings like ice catching
// the light, left to ring until the next. Seeded, so it's the same every time.
function snow(chords, chance, seed) {
  let s = seed >>> 0;
  const rand = () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296;
  const notes = arpeggio(chords, BAR, 6, [0, 'third', 7, 12, 7, 'third', 12, 0]);
  let ringing = false;
  return notes.map((note, i) => {
    if (i % 2 === 0 && rand() < chance) {
      ringing = true;
      return note;
    }
    return ringing ? '-' : '.';
  });
}

// Gusts of wind: [bar it starts on, how many bars it blows], in a section `bars` long.
function gusts(bars, list) {
  const out = rest(bars);
  for (const [at, length] of list) {
    out[at * BAR] = 60;
    for (let i = 1; i < length * BAR; i++) out[at * BAR + i] = '-';
  }
  return out;
}

// The band under any section: ostinato, stabs, bass, string pad, snow.
function band(chords, seed, snowChance = 0.08) {
  return {
    pluck: chordLine(chords, OSTINATO, 3),
    stabThird: chordLine(chords, STAB_THIRD, 4),
    stabFifth: chordLine(chords, STAB_FIFTH, 4),
    bass: chordLine(chords, BASS, 2),
    padLow: sustained(chords, BAR, 1, 4),
    padHigh: sustained(chords, BAR, 2, 4),
    ice: snow(chords, snowChance, seed),
  };
}

// An 8-bar kit: groove for seven bars and a fill, a crash on the one.
function kit(kick, { fill = SNARE_FILL, crash = true } = {}) {
  return {
    kick: repeat(kick, 8),
    snare: [...repeat(SNARE, 7), ...fill],
    hat: repeat(HAT, 8),
    openHat: repeat(OPEN_HAT, 8),
    crash: [...(crash ? ONE : NONE), ...repeat(NONE, 7)],
  };
}

// --- Instruments. ---
// The hero: Cotton Clash's brassy sawtooth.
const HERO_LEAD = {
  wave: 'sawtooth', volume: 0.048, attack: 0.01, decay: 0.15, sustain: 0.7, release: 0.06, gate: 0.9,
  vibrato: { rate: 5.5, depth: 12 },
  filter: { type: 'lowpass', frequency: 4000 },
  pan: -0.12,
};
// Ves: bright and airy, a hollow square with a whistle an octave up and a
// little wind in it, with an echo trailing off like it's carried away.
const VES_LEAD = {
  voices: [
    { wave: 'square', level: 0.45 },
    { wave: 'triangle', octave: 1, level: 0.3 },
    { wave: 'sine', level: 0.45 },
  ],
  filter: { type: 'lowpass', frequency: 3800 },
  attack: 0.008, decay: 0.2, sustain: 0.75, release: 0.1, gate: 0.9,
  vibrato: { rate: 5.8, depth: 14, delay: 0.12 },
  breath: { level: 0.05, frequency: 3000, q: 0.8 },
  pan: 0.15,
  echo: { time: 0.278, feedback: 0.22, mix: 0.16 },
};
// The ostinato: a bright pluck that dulls as it rings.
const PLUCK = {
  harmonics: [1, 0.6, 0.4, 0.25, 0.15, 0.1],
  sweep: { from: 4000, to: 900, time: 0.14, q: 0.6 },
  attack: 0.002, decay: 0.12, sustain: 0, release: 0.08, gate: 1,
  pan: -0.25,
};
// Ice chimes: thin and out of tune with themselves.
const ICE = {
  voices: [
    { wave: 'sine', level: 1 },
    { wave: 'sine', octave: 1, detune: 558, level: 0.25 },
    { wave: 'sine', octave: 2, detune: 520, level: 0.08 },
  ],
  attack: 0.002, decay: 0.9, sustain: 0, release: 1, gate: 1,
  pan: 0.45,
  reverb: 0.5,
};
// A gust: no note, just air, sweeping up and opening out as it blows.
const GUST = {
  voices: [{ wave: 'sine', level: 0 }],
  sweep: { from: 300, to: 5000, time: 2.4, q: 1.4 },
  attack: 1.2, decay: 1.5, sustain: 0.8, release: 0.7, gate: 1,
  breath: { level: 1, frequency: 1400, q: 0.5 },
  pan: -0.3,
  reverb: 0.4,
};
const STAB = { ...STACCATO_STRINGS, volume: 0.03 };

export const MOUNTAIN_BATTLE_THEME = {
  title: 'Updraft',
  bpm: 162,
  stepsPerBeat: 4,

  instruments: {
    lead: HERO_LEAD,
    leadLow: { wave: 'square', volume: 0.028, attack: 0.01, decay: 0.15, sustain: 0.7, release: 0.06, gate: 0.9, filter: { type: 'lowpass', frequency: 2500 }, pan: -0.12 },
    ves: { ...VES_LEAD, volume: 0.06 },
    glock: { ...BELLS, volume: 0.05, pan: 0.3, echo: { time: 0.37, feedback: 0.25, mix: 0.2 } },
    pluck: { ...PLUCK, volume: 0.05 },
    stabThird: { ...STAB, pan: 0.25 },
    stabFifth: { ...STAB, pan: 0.35 },
    bass: { wave: 'sawtooth', volume: 0.12, attack: 0.003, decay: 0.08, sustain: 0.7, release: 0.03, gate: 0.8, filter: { type: 'lowpass', frequency: 700 } },
    padLow: { ...STRINGS, volume: 0.016, pan: -0.3 },
    padHigh: { ...STRINGS, volume: 0.016, pan: 0.3 },
    ice: { ...ICE, volume: 0.02 },
    gust: { ...GUST, volume: 0.06 },
    kick: { drum: 'kick', volume: 0.6 },
    snare: { drum: 'snare', volume: 0.3 },
    hat: { drum: 'hat', volume: 0.05 },
    openHat: { drum: 'openHat', volume: 0.06 },
    crash: { drum: 'crash', volume: 0.1 },
    boom: { drum: 'boom', volume: 0.3 },
  },

  sections: {
    // Wind rising, the ostinato alone, her motif hinted, a drum build.
    intro: {
      pluck: chordLine(INTRO_CHORDS, OSTINATO, 3),
      glock: INTRO_GLOCK,
      bass: [...rest(2), ...chordLine('Bb A', BASS, 2)],
      stabThird: [...rest(2), ...chordLine('Bb A', STAB_THIRD, 4)],
      stabFifth: [...rest(2), ...chordLine('Bb A', STAB_FIFTH, 4)],
      padLow: sustained(INTRO_CHORDS, BAR, 1, 4),
      padHigh: sustained(INTRO_CHORDS, BAR, 2, 4),
      gust: gusts(4, [[0, 4]]),
      boom: [...ONE, ...ONE, ...NONE, ...NONE],
      kick: [...NONE, ...NONE, ...KICK_FOUR, ...hits('x...x...x.x.x.x.')],
      snare: [...NONE, ...NONE, ...NONE, ...SNARE_FILL],
      hat: [...NONE, ...NONE, ...HAT, ...HAT],
    },
    // The hero's tune.
    A: {
      lead: HERO_A,
      leadLow: transpose(HERO_A, -12),
      ...band(A_CHORDS, 7),
      ...kit(KICK),
      gust: gusts(8, [[6, 2]]),
    },
    // It climbs, and turns to F major.
    A2: {
      lead: HERO_A2,
      leadLow: transpose(HERO_A2, -12),
      ...band(A2_CHORDS, 19),
      ...kit(KICK_DRIVE),
      glock: [...rest(7), ...tune('. . . . C6/C6 A6 - -')],
      gust: gusts(8, [[6, 2]]),
    },
    // Ves's hook, the hero pumping under her.
    B: {
      ves: VES_B,
      glock: VES_B,
      lead: HERO_PUMP,
      leadLow: transpose(VES_B, -12),
      ...band(B_CHORDS, 31, 0.12),
      ...kit(KICK_DRIVE),
      gust: gusts(8, [[0, 2], [4, 2]]),
    },
    // The hero calls, Ves answers.
    duet: {
      lead: DUET_HERO,
      leadLow: transpose(DUET_HERO, -12),
      ves: DUET_VES,
      glock: transpose(DUET_VES, 12).map((n) => (typeof n === 'number' && n > 96 ? n - 12 : n)),
      ...band(DUET_CHORDS, 43),
      ...kit(KICK),
      gust: gusts(8, [[2, 2], [6, 2]]),
    },
    // Half time, the wind howling, her motif slow on the glockenspiel; then
    // the hero's fifth at half speed and a roll building back up.
    breakdown: {
      glock: BREAK_GLOCK,
      lead: BREAK_HERO,
      leadLow: transpose(BREAK_HERO, -12),
      pluck: [...chordLine('Dm Dm Bb Bb', OSTINATO_HALF, 3), ...chordLine('Gm Gm A A', OSTINATO, 3)],
      stabThird: [...rest(4), ...chordLine('Gm Gm A A', STAB_THIRD, 4)],
      stabFifth: [...rest(4), ...chordLine('Gm Gm A A', STAB_FIFTH, 4)],
      bass: [...chordLine('Dm Dm Bb Bb', BASS_HELD, 2), ...chordLine('Gm Gm A A', BASS_EIGHTHS, 2)],
      padLow: sustained(BREAK_CHORDS, BAR, 1, 4),
      padHigh: sustained(BREAK_CHORDS, BAR, 2, 4),
      ice: snow(BREAK_CHORDS, 0.2, 59),
      gust: gusts(8, [[0, 2], [2, 2], [6, 2]]),
      boom: [...ONE, ...NONE, ...ONE, ...NONE, ...NONE, ...NONE, ...NONE, ...NONE],
      kick: [...repeat(KICK_HALF, 4), ...repeat(KICK_FOUR, 3), ...hits('x.x.x.x.x.x.x.x.')],
      snare: [...repeat(SNARE_HALF, 4), ...SNARE, ...SNARE, ...SNARE_EIGHTHS, ...SNARE_ROLL],
      hat: [...repeat(NONE, 4), ...repeat(HAT, 4)],
    },
    // The hero's tune again, Ves a third under it.
    A3: {
      lead: HERO_A3,
      leadLow: transpose(HERO_A3, -12),
      ves: VES_A3,
      ...band(A3_CHORDS, 71),
      ...kit(KICK_DRIVE),
      gust: gusts(8, [[6, 2]]),
    },
    // Her hook again, a step higher, everything in.
    B2: {
      ves: transpose(VES_B, 2),
      glock: transpose(VES_B, 2),
      lead: transpose(HERO_PUMP, 2),
      leadLow: transpose(VES_B, -10),
      ...band(B2_CHORDS, 83, 0.15),
      ...kit(KICK_DRIVE),
      boom: [...ONE, ...repeat(NONE, 3), ...ONE, ...repeat(NONE, 3)],
      gust: gusts(8, [[0, 2], [4, 2]]),
    },
    // Both of them on her motif, in thirds, climbing; then round again.
    turn: {
      ves: VES_TURN,
      glock: VES_TURN,
      lead: HERO_TURN,
      leadLow: transpose(HERO_TURN, -12),
      ...band(TURN_CHORDS, 97, 0.1),
      kick: repeat(KICK_DRIVE, 4),
      snare: [...SNARE, ...SNARE, ...SNARE, ...SNARE_FILL],
      hat: repeat(HAT, 4),
      openHat: repeat(OPEN_HAT, 4),
      crash: [...ONE, ...NONE, ...NONE, ...NONE],
      gust: gusts(4, [[2, 2]]),
    },
  },

  // The intro plays once; after that it all loops from A.
  order: ['intro', 'A', 'A2', 'B', 'duet', 'breakdown', 'A3', 'B2', 'turn'],
  loopFrom: 1,
};
