import { melody, chordLine, arpeggio, sustained, transpose, hits, repeat, midi } from '../../audio/notation.js';
import {
  BRASS, HARP, BELLS, FLUTE, STACCATO_STRINGS, STRING_SECTION, CHOIR, TIMPANI, LOW_STRINGS,
} from '../../audio/instruments.js';

// "Glass Hollows": the fight song in the ice caves (any room with `cave`;
// see battleSong in battleScene.js). Bosses keep their own. As driving as
// "Cotton Clash" and "Updraft", but cold and echoing, the way a cave of ice
// is: bright crystal plucks and a glockenspiel ringing off the walls with a
// long echo, a deep rumbling bass, drips and chimes falling in time, brass
// punching under the big moments, and the drums far back in the hall. The
// brass quotes "The Hollow Mountain" (cavesTheme.js), the caves' own tune,
// which is "Thin Air" (vigilTheme.js) slowed down: E, B, E, G, F#, E. In a
// half-time break, Ves's motif ("Carried on the Wind", vesTheme.js) slips in
// once on the flute, in its minor form, small and nervous: caves aren't her
// favourite place. E minor, 156 BPM, one step is a 16th note. About a minute
// and a half, then it loops from the hook.
//
//   intro    4 bars   drips, a rumble rising, the hook's first notes, a roll
//   hook    16 bars   the icy hook on glockenspiel and plucks, brass stabs
//   brass   16 bars   the brass sings "The Hollow Mountain", the glock sparkles
//   break    8 bars   half time: drips, Ves's motif on the flute, nervous
//   build    8 bars   strings driving, the brass climbing, a snare roll
//   hook2    8 bars   the hook again, the brass on it too, everything in

const BAR = 16;
const rest = (bars) => Array(bars * BAR).fill('.');

// --- Chords, a bar each. ---
const HOOK_CHORDS = 'Em C D B Em C Am B Em C D B C Am B B';
const BRASS_CHORDS = 'C D Em Em C D B B C D Em C Am B Em B';
const BREAK_CHORDS = 'Em Em C C Am Am B B';
const BUILD_CHORDS = 'C D Em Em C D B B';
const HOOK2_CHORDS = 'Em C D B Em C Am B';

// --- Patterns, as semitones above each chord's root. ---
// A galloping bass with an octave kick in it.
const BASS = [0, '.', 0, 12, '.', 0, 12, '.', 0, '.', 0, 12, '.', 7, 10, 12];
const HALF_BASS = [0, '-', '-', '-', '-', '-', '-', '-', 7, '-', '-', '-', '-', '-', '-', '-'];
// Brass stabs on the off-beats.
const STAB = ['.', '.', 'third', '.', '.', '.', 'third', '.', '.', '.', 'third', '.', '.', 'third', '.', '.'];
const STAB_FIFTH = STAB.map((step) => (step === 'third' ? 7 : step));
// Strings driving in 16ths.
const SPIC = [0, 7, 12, 7, 'tenth', 7, 12, 7, 0, 7, 12, 7, 'tenth', 12, 7, 12];
// The glockenspiel sparkling up through the chord.
const SPARKLE = [0, 7, 12, 'tenth', 19, 'tenth', 12, 7, 0, 7, 12, 'tenth', 19, 24, 19, 'tenth'];

// --- Drums, far back in the hall. ---
const KICK = hits('x.....x. ..x.....');
const SNARE = hits('....x... ....x...');
const FILL = hits('....x... x.x.xxxx');
const ROLL = hits('x.x.x.x. xxxxxxxx');
const HAT = hits('x.x.x.x. x.x.x.x.');
const OPEN_HAT = hits('..x...x. ..x...x.');
const HALF_KICK = hits('x....... ........');
const HALF_SNARE = hits('........ x.......');
function kit(bars) {
  return {
    kick: repeat(KICK, bars),
    snare: Array.from({ length: bars }, (_, i) => ((i + 1) % 8 === 0 ? FILL : SNARE)).flat(),
    hat: repeat(HAT, bars),
    openHat: repeat(OPEN_HAT, bars),
  };
}
const crashes = (bars, every) => Array.from({ length: bars }, (_, i) => (i % every === 0 ? hits('x...............') : rest(1))).flat();

// Drips: now and then a high note from the chord, falling into the echo.
// Seeded, so the song sounds the same every time.
function drips(chords, chance, seed) {
  let s = seed >>> 0;
  const rand = () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296;
  return chordLine(chords, Array(BAR).fill(0), 6).map((note, i) => {
    if (i % 2 || rand() > chance) return '.';
    return note + [0, 7, 12, 3, 4][Math.floor(rand() * 5)] - (rand() < 0.5 ? 12 : 0);
  });
}

// --- Tunes. Each token is an 8th note; 'A/B' is two 16ths. ---
// The icy hook: quick, glittering, jumping up through the chord.
const HOOK = melody(`
  E5/G5 B5 - E6 - D6/B5 G5 B5 | C6 - B5 G5 - E5 G5/A5 B5 | A5/F#5 D5 - F#5 A5 - D6 C#6 | B5 - - - D#5/F#5 A5 F#5 D#5 |
  E5/G5 B5 - E6 - G6/F#6 E6 D6 | E6 - C6 G5 - E5 G5 C6 | A5/C6 E6 - A6 G6 E6 C6 A5 | B5 - - - F#5 - D#5/E5 F#5 |
  E5/G5 B5 - E6 - D6/B5 G5 B5 | C6 - B5 G5 - E5 G5/A5 B5 | A5/F#5 D5 - F#5 A5 - D6 C#6 | B5 - - - D#5/F#5 A5 F#5 D#5 |
  G5/C6 E6 - G6 - E6 C6 G5 | A5 - E5 A5 C6 - E6 - | D#6 - B5 F#5 - B5 D#6 F#6 | B6 - - - . . . . |
`);

// The brass: "The Hollow Mountain" (E, B, E, G, F#, E) in bars 3 and 4, then on up.
const BRASS_TUNE = melody(`
  E5 - - - G5 - C6 - | B5 - A5 - F#5 - D5 - | E5 - - - B4 - E5 - | G5 - - - F#5 - E5 - |
  E6 - - - C6 - G5 - | F#6 - - - D6 - A5 - | B5 - - - D#6 - F#6 - | F#6 - - - - - . . |
  E5 - G5 - C6 - E6 - | D6 - - - A5 - F#5 - | G5 - - - B5 - E6 - | E6 - D6 - C6 - G5 - |
  A5 - C6 - E6 - A6 - | F#6 - - - D#6 - B5 - | B5 - - - G5 - E5 - | D#5 - - - F#5 - B5 - |
`);

// Ves, in the break: her motif in its minor form, in E minor ("B-B, up to G"),
// small and nervous, trailing off each time.
const BREAK_FLUTE = melody(`
  B4/B4 G5 - - A5 F#5 G5 - | . . . . . . . . | B4/B4 G5 - - A5 F#5 E5 - | . . . . . . . . |
  C5/C5 A5 - - B5 G5 A5 - | . . . . E5 - - - | D#5 - - - F#5 - - - | B4 - - - - - . . |
`);
// The glockenspiel answering her from far off, in the gaps.
const BREAK_GLOCK = melody(`
  . . . . . . . . | . . . . B5/B5 G6 - - | . . . . . . . . | . . . . B5/B5 E6 - - |
  . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . |
`);

// The build: the brass climbing in long notes.
const BUILD_BRASS = melody(`
  G4 - - - - - - - | A4 - - - - - - - | B4 - - - - - - - | E5 - - - - - - - |
  C5 - - - E5 - - - | F#5 - - - A5 - - - | B5 - - - - - - - | D#6 - - - F#6 - - - |
`);

// --- Instruments. ---
// A crystal pluck: bright, short, ringing into a long echo off the walls.
const CRYSTAL_PLUCK = {
  ...HARP,
  sweep: { from: 6000, to: 1800, time: 0.4, q: 0.4 },
  decay: 0.5,
  release: 0.6,
  echo: { time: 0.288, feedback: 0.35, mix: 0.3 },
  reverb: 0.6,
};
const ECHO_GLOCK = { ...BELLS, echo: { time: 0.385, feedback: 0.4, mix: 0.35 }, reverb: 0.65 };
const DRIP = {
  voices: [{ wave: 'sine', level: 1 }, { wave: 'sine', octave: 1, detune: 9, level: 0.2 }],
  attack: 0.002, decay: 0.25, sustain: 0, release: 0.3, gate: 1,
  bend: { cents: 120, time: 0.06 },
  echo: { time: 0.481, feedback: 0.5, mix: 0.45 },
  reverb: 0.7,
  pan: 0.3,
};
// The rumble: a deep growl that swells up under the intro.
const RUMBLE = {
  voices: [{ wave: 'sawtooth', detune: -8 }, { wave: 'sawtooth', detune: 8 }, { wave: 'sine', octave: -1, level: 0.8 }],
  filter: { type: 'lowpass', frequency: 260 },
  attack: 2.4, decay: 1, sustain: 0.9, release: 1.5, gate: 1,
  reverb: 0.5,
};

export const CAVE_BATTLE_THEME = {
  title: 'Glass Hollows',
  bpm: 156,
  stepsPerBeat: 4,

  instruments: {
    glock: { ...ECHO_GLOCK, volume: 0.081, pan: 0.15 },
    pluck: { ...CRYSTAL_PLUCK, volume: 0.069, pan: -0.15 },
    brass: { ...BRASS, volume: 0.063 },
    brassLow: {
      wave: 'square', volume: 0.025, attack: 0.008, decay: 0.15, sustain: 0.7, release: 0.06, gate: 0.9,
      filter: { type: 'lowpass', frequency: 2200 },
    },
    stab: { ...BRASS, volume: 0.034, gate: 0.4, pan: -0.25 },
    stabFifth: { ...BRASS, volume: 0.03, gate: 0.4, pan: 0.25 },
    flute: { ...FLUTE, volume: 0.081, vibrato: { rate: 6.5, depth: 18, delay: 0.1 }, echo: { time: 0.385, feedback: 0.3, mix: 0.25 } },
    spic: { ...STACCATO_STRINGS, volume: 0.032 },
    pad: { ...STRING_SECTION, volume: 0.028 },
    choir: { ...CHOIR, volume: 0.032 },
    low: { ...LOW_STRINGS, volume: 0.057 },
    bass: { wave: 'sawtooth', volume: 0.115, attack: 0.003, decay: 0.08, sustain: 0.7, release: 0.03, gate: 0.75, filter: { type: 'lowpass', frequency: 600 } },
    rumble: { ...RUMBLE, volume: 0.069 },
    drip: { ...DRIP, volume: 0.034 },
    timpani: { ...TIMPANI, volume: 0.138 },
    kick: { drum: 'kick', volume: 0.632 },
    snare: { drum: 'snare', volume: 0.287 },
    hat: { drum: 'hat', volume: 0.046 },
    openHat: { drum: 'openHat', volume: 0.057 },
    crash: { drum: 'crash', volume: 0.092 },
    boom: { drum: 'boom', volume: 0.345 },
  },

  sections: {
    // Drips in the dark, a rumble rising, the hook's first glint, and a roll in.
    intro: {
      drip: drips('Em Em C B', 0.55, 7),
      rumble: [midi('E1'), ...Array(4 * BAR - 1).fill('-')],
      glock: [...rest(2), ...HOOK.slice(0, BAR), ...rest(1)],
      pad: sustained('Em Em C B', BAR, 1, 4),
      boom: [...hits('x...............'), ...rest(1), ...hits('x...............'), ...rest(1)],
      timpani: [...rest(3), ...chordLine('B', [0, '.', 0, '.', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 2)],
      snare: [...rest(3), ...ROLL],
    },
    // The icy hook.
    hook: {
      glock: HOOK,
      pluck: transpose(HOOK, -12),
      stab: chordLine(HOOK_CHORDS, STAB, 4),
      stabFifth: chordLine(HOOK_CHORDS, STAB_FIFTH, 4),
      bass: chordLine(HOOK_CHORDS, BASS, 2),
      pad: sustained(HOOK_CHORDS, BAR, 1, 4),
      drip: drips(HOOK_CHORDS, 0.12, 21),
      ...kit(16),
      crash: crashes(16, 8),
    },
    // The brass sings "The Hollow Mountain", and the glock sparkles round it.
    brass: {
      brass: BRASS_TUNE,
      brassLow: transpose(BRASS_TUNE, -12),
      glock: arpeggio(BRASS_CHORDS, BAR, 5, SPARKLE),
      spic: chordLine(BRASS_CHORDS, SPIC, 3),
      bass: chordLine(BRASS_CHORDS, BASS, 2),
      choir: sustained(BRASS_CHORDS, BAR, 0, 4),
      pad: sustained(BRASS_CHORDS, BAR, 2, 4),
      ...kit(16),
      crash: crashes(16, 4),
    },
    // Half time, in the dark: drips, and Ves, nervous, on the flute.
    break: {
      flute: BREAK_FLUTE,
      glock: BREAK_GLOCK,
      low: chordLine(BREAK_CHORDS, HALF_BASS, 2),
      pad: sustained(BREAK_CHORDS, BAR, 1, 4),
      choir: sustained(BREAK_CHORDS, BAR, 2, 4),
      drip: drips(BREAK_CHORDS, 0.3, 33),
      kick: repeat(HALF_KICK, 8),
      snare: repeat(HALF_SNARE, 8),
      hat: repeat(hits('x...x... x...x...'), 8),
    },
    // Building back: strings driving, the brass climbing, a roll into the hook.
    build: {
      brass: BUILD_BRASS,
      brassLow: transpose(BUILD_BRASS, -12),
      spic: chordLine(BUILD_CHORDS, SPIC, 3),
      bass: chordLine(BUILD_CHORDS, BASS, 2),
      pad: sustained(BUILD_CHORDS, BAR, 1, 4),
      choir: sustained(BUILD_CHORDS, BAR, 0, 4),
      timpani: [...rest(6), ...chordLine('B B', [0, '.', '.', '.', 0, '.', '.', '.', 0, '.', 0, '.', 0, 0, 0, 0], 2)],
      kick: repeat(KICK, 8),
      snare: [...repeat(SNARE, 6), ...hits('....x... x.x.x.x.'), ...ROLL],
      hat: repeat(HAT, 8),
      crash: crashes(8, 4),
    },
    // The hook again, the brass on it too: everything in.
    hook2: {
      glock: HOOK.slice(0, 8 * BAR),
      pluck: transpose(HOOK.slice(0, 8 * BAR), -12),
      brass: transpose(HOOK.slice(0, 8 * BAR), -12),
      stab: chordLine(HOOK2_CHORDS, STAB, 4),
      stabFifth: chordLine(HOOK2_CHORDS, STAB_FIFTH, 4),
      bass: chordLine(HOOK2_CHORDS, BASS, 2),
      spic: chordLine(HOOK2_CHORDS, SPIC, 3),
      choir: sustained(HOOK2_CHORDS, BAR, 0, 4),
      drip: drips(HOOK2_CHORDS, 0.12, 45),
      ...kit(8),
      crash: crashes(8, 4),
    },
  },

  // The intro plays once; after that it loops from the hook.
  order: ['intro', 'hook', 'brass', 'break', 'build', 'hook2'],
  loopFrom: 1,
};
