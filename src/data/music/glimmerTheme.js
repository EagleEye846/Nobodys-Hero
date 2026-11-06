import {
  melody, arpeggio, sustained, rest as restBars, held, midi, cellIn, transpose,
  after as afterBars, until as untilBars, BAR_44 as BAR,
} from './parts/chapter4.js';

// "Every Colour Underneath": the theme of the Glimmering, the bright crystal
// caves the hero and Ves land in after the fall (Chapter 4's second
// region). Not a dark cave at all: the first look at a buried kingdom is
// wonder and awe, light coming off every wall, in colours neither of them
// has a name for. A slow, spacious A major with the Lydian colour (D sharp,
// the raised fourth that makes a chord of A sound like it's floating) and
// the Lydian pair of A then B major: a glockenspiel and a harp shimmer over
// warm, slow strings, a flute and a solo violin sing a long tune in half
// notes, and bowed vibraphone glows under them. The bass is a low harp, one
// plucked root a bar, left to ring; the only cello is a very soft held A at
// the start and in the hush (no big cello lines in an area theme). Hollow
// Knight's Crystal Peak is a mood reference only (the glitter, the space);
// this one is warm, not mechanical, and nothing in it is a threat.
//
// THE CHAPTER'S TUNE (the "first cell", parts/chapter4.js): A D F# E in
// Sunnyside; here in A, E A C# B, up a fourth, up a third, one step down.
// It glitters on the glockenspiel in 16ths at the top of the sound, and
// then in the quiet part it's played as slowly as it can be, one note to a
// bar on glass. The long tune also opens with it, in half notes: E over A.
//
// A major, 64 BPM, one step a 16th note: a bar is 3.75 seconds. The
// first sparkle plays once (4 bars, 15s); then it loops from A, 36 bars,
// 2m15s:
//
//   intro   4 bars  a soft low A on the cellos, the glockenspiel's first
//                   sparkle, the harp rising out of nothing
//   A       8 bars  THE TUNE: the flute, long notes, harp rippling, the
//                   violins and horns breathing under it
//   A2      8 bars  the solo violin takes it, the flute above, the
//                   glockenspiel glittering the cell in every other bar
//   B       8 bars  the high part, F# minor and D: the violin and bowed
//                   vibraphone climb, the low harp under them, the horns open up
//   hush    4 bars  the cell, one note a bar, on glass; nearly nothing else
//   A3      8 bars  the tune with everything and a new viola line moving
//                   under its long notes (so the last time round is not
//                   just the first time louder); the sparkle falling like
//                   light down the scale at the very end

const rest = (bars) => restBars(bars, BAR);
const after = (bars, track) => afterBars(bars, track, BAR);
const until = (bars, track) => untilBars(bars, track, BAR);
const tune = (text) => melody(text, 4);   // each token a quarter note
const up = (steps, semitones) => transpose(steps, semitones);

// --- The harmony, a bar each. ---
const A_CHORDS = 'A B F#m E D A B A';
const B_CHORDS = 'F#m D A E F#m D E E';

// --- THE TUNE. Opens with the cell (E A C# B), then C# over B, D sharp over
// A. ---
const TUNE_A = tune(`
  E5 - A5 - | C#6 - B5 - | A5 - G#5 F#5 | G#5 - - - |
  F#5 - A5 - | D#6 - C#6 - | B5 - C#6 D#6 | C#6 - - -
`);
const TUNE_B = tune(`
  C#6 - A5 - | A5 - F#5 - | E5 - A5 - | G#5 - B5 - |
  C#6 - E6 - | D6 - F#6 - | E6 - C#6 - | B5 - - -
`);

// A counter-line for the last time round, on a viola: it moves while the
// tune holds and holds while the tune moves, and leans on the Lydian D sharp.
const COUNTER_A = tune(`
  A4 - B4 C#5 | D#5 - - - | C#5 - A4 - | B4 - G#4 B4 |
  A4 - F#4 - | E4 - A4 C#5 | D#5 - F#5 - | E5 - - - |
`);

// --- The harp: a slow ripple, one note every other step. ---
const RIPPLE = [0, '.', 7, '.', 12, '.', 'tenth', '.', 19, '.', 'tenth', '.', 12, '.', 7, '.'];
const harpRipple = (chords) => arpeggio(chords, BAR, 3, RIPPLE);
// The low harp: the root once a bar in octave 2, left to ring; anything
// below E flat 2 goes up an octave (lower than that a harp just goes boing).
const harpRoots = (chords) => sustained(chords, BAR, 0, 2).map((n) => (typeof n === 'number' && n < midi('Eb2') ? n + 12 : n));

// --- The glitter: the cell in 16ths on the glockenspiel, an octave and a
// half up, then not again for a while. ---
const [e6, a6, cs7, b6] = cellIn('A6');
const SPARK = [e6, a6, cs7, b6, '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'];
// Backwards and softer, for an echo.
const SPARK_BACK = [b6, cs7, a6, e6, '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'];
// The cell stretched out, one note to a bar, on glass: E5 A5 C#6 B5.
const [g0, g1, g2, g3] = cellIn('A5');
const SLOW_CELL = [...held(g0, BAR), ...held(g1, BAR), ...held(g2, BAR), ...held(g3, BAR)];
// Light falling down the A Lydian scale in 16ths, to end the song.
const FALL = melody('A6/G#6/F#6/E6 D#6/C#6/B5/A5 . .', 4);
const glitterEvery = (bars, spark) => Array.from({ length: bars }, (_, i) => (i % 2 === 0 ? spark : rest(1))).flat();

export const GLIMMER_THEME = {
  title: 'Every Colour Underneath',
  bpm: 64,
  stepsPerBeat: 4,
  volume: 0.7,

  instruments: {
    flute: { sample: 'flute', volume: 0.3, attack: 0.18, release: 0.9, reverb: 0.7, pan: 0.1, humanize: { time: 0.012, volume: 0.1 } },
    fluteHigh: { sample: 'flute', volume: 0.14, attack: 0.2, release: 1, reverb: 0.8, pan: 0.3 },
    // The tune's second voice: a solo violin, slow bow, a long hall.
    violin: { sample: 'soloViolin', volume: 0.26, attack: 0.3, release: 1, reverb: 0.75, pan: -0.05, humanize: { time: 0.012, volume: 0.1 } },
    violins: { sample: 'violins', volume: 0.22, attack: 0.5, release: 1.2, reverb: 0.6, pan: 0.25 },
    violas: { sample: 'violas', volume: 0.2, attack: 0.5, release: 1.2, reverb: 0.6, pan: -0.2 },
    counter: { sample: 'violas', volume: 0.24, attack: 0.25, release: 1, reverb: 0.6, pan: -0.15, humanize: { time: 0.012, volume: 0.1 } },
    // Only a held pedal now, and quiet.
    cellos: { sample: 'cellos', volume: 0.13, attack: 0.5, release: 1.2, reverb: 0.55, pan: -0.25, humanize: { time: 0.01, volume: 0.1 } },
    horns: { sample: 'hornsSoft', volume: 0.22, attack: 0.6, release: 1.2, reverb: 0.65, pan: 0.05 },
    // The glow: bowed vibraphone, a note held and swelling.
    vibes: { sample: 'vibesBowed', volume: 0.2, attack: 0.5, release: 1.5, reverb: 0.7, pan: 0.2 },
    harp: { sample: 'harp', volume: 0.24, ring: true, reverb: 0.65, pan: -0.3, humanize: { time: 0.014, volume: 0.2 } },
    // The bass: the harp's low strings, one root a bar.
    bass: { sample: 'harp', volume: 0.2, ring: true, reverb: 0.6, pan: -0.1, humanize: { time: 0.01, volume: 0.1 } },
    // The glitter.
    glock: { sample: 'glock', volume: 0.14, ring: true, pan: 0.35, reverb: 0.7, echo: { time: 0.47, feedback: 0.35, mix: 0.35 } },
    glass: { sample: 'glass', volume: 0.22, attack: 0.3, release: 1.6, reverb: 0.8, pan: 0.15 },
    chimes: { sample: 'chimes', volume: 0.08, ring: true, pan: -0.35, reverb: 0.7 },
    timpani: { sample: 'timpani', volume: 0.2, ring: true, reverb: 0.5 },
  },

  sections: {
    // A low A, the first sparkle, and the harp rising out of nothing.
    intro: {
      cellos: held('A2', 4 * BAR),
      glock: [...rest(1), ...SPARK, ...rest(2)],
      harp: [...rest(2), ...harpRipple('A B')],
      violins: [...rest(2), ...sustained('A B', BAR, 1, 4)],
    },

    // THE TUNE on the flute, long notes; the harp ripples, the strings and
    // horns breathe chords.
    A: {
      flute: TUNE_A,
      harp: harpRipple(A_CHORDS),
      violins: sustained(A_CHORDS, BAR, 1, 4),
      violas: sustained(A_CHORDS, BAR, 2, 3),
      bass: harpRoots(A_CHORDS),
      horns: after(4, sustained(A_CHORDS, BAR, 0, 3)),
      glock: [...rest(7), ...SPARK_BACK],
    },

    // The solo violin takes the tune, the flute an octave over her; the
    // bells glitter the cell in every other bar.
    A2: {
      violin: up(TUNE_A, -12),
      fluteHigh: TUNE_A,
      harp: harpRipple(A_CHORDS),
      violins: sustained(A_CHORDS, BAR, 1, 4),
      violas: sustained(A_CHORDS, BAR, 2, 3),
      bass: harpRoots(A_CHORDS),
      horns: sustained(A_CHORDS, BAR, 0, 3),
      vibes: sustained(A_CHORDS, BAR, 1, 4),
      glock: glitterEvery(8, SPARK),
    },

    // The high part, F# minor and D: climbing, wider. The violin and the
    // bowed vibraphone sing together, the low harp under them.
    B: {
      violin: TUNE_B,
      vibes: up(TUNE_B, -12),
      flute: TUNE_B,
      harp: harpRipple(B_CHORDS),
      violins: sustained(B_CHORDS, BAR, 2, 4),
      violas: sustained(B_CHORDS, BAR, 1, 3),
      bass: harpRoots(B_CHORDS),
      horns: sustained(B_CHORDS, BAR, 0, 3),
      glock: [...rest(3), ...SPARK_BACK, ...rest(3), ...SPARK],
      timpani: [...rest(7), ...held('B2', BAR)],
    },

    // A breath: the cell as slowly as it can be played, one note a bar.
    hush: {
      glass: SLOW_CELL,
      cellos: held('A2', 4 * BAR),
      harp: harpRipple('A A A B').map((n, i) => (i % 4 === 0 ? n : '.')),
      violins: sustained('A A A B', BAR, 2, 4),
      chimes: [...rest(2), midi('E5'), ...Array(BAR - 1).fill('.'), ...rest(1)],
    },

    // The tune with everything: the flute and violin together, the violins
    // above; and the light runs down the scale to land on A.
    A3: {
      flute: TUNE_A,
      violin: up(TUNE_A, -12),
      violins: TUNE_A,
      counter: COUNTER_A,
      vibes: sustained(A_CHORDS, BAR, 1, 4),
      harp: harpRipple(A_CHORDS),
      violas: sustained(A_CHORDS, BAR, 2, 3),
      bass: harpRoots(A_CHORDS),
      horns: sustained(A_CHORDS, BAR, 0, 3),
      glock: [...glitterEvery(7, SPARK), ...FALL],
    },
  },

  // The first sparkle plays once; then the caves go round from the tune.
  order: ['intro', 'A', 'A2', 'B', 'hush', 'A3'],
  loopFrom: 1,
};
