import {
  melody, arpeggio, sustained, chordLine, transpose, rest as restBars,
  tight, midi, after as afterBars, scatter,
} from './parts/chapter5.js';

// "Low Tide, Green Sky": the theme of the Wrack Shore, where the storm
// begins. The sea has gone out too far; the tidepools shine; the sky over
// the water is the wrong colour. Nothing has happened yet, and everyone
// knows something will. So it is all anticipation: a harp turns the same
// six notes over and over like ripples spreading in a pool (a fixed
// ostinato with a moving bass, after Hollow Knight's City of Tears), soft
// violas sit under it, a flute lays out a tune that never quite lands, and
// now and then a glass bell drops a note like a drip off a rock. It is soft
// and beautiful on purpose; the unease is in the harmony (the flat sixth
// and an A major that keeps asking), not in the volume.
//
// THE COAST CELL: A D D E (parts/chapter5.js, COAST_CELL), the first bar of
// the coast fights, is the flute's first phrase and comes back in the oboe
// later, a little slower each time: the sea's tune creeping up on a quiet
// shore. Reference for the mood only: Hollow Knight's Greenpath and City of
// Tears, Wind Waker's calmer sea.
//
// D minor, 6/8 at 60 dotted quarters a minute (a bar is 2 seconds);
// one step an 8th, six to a bar. The intro plays once (2 bars); then it
// loops from A, 48 bars, about 1m36s (B is heard twice):
//
//   intro   2 bars  the ripples alone; one glass drop
//   A       8 bars  the flute lays out the cell and a tune that rises and
//                   doesn't land; the ripples move over D minor, B-flat,
//                   G minor, A
//   B       8 bars  the oboe takes it an octave down; violins breathe
//                   under; the drops get closer together
//   C       8 bars  the sky greens: G minor, E-flat, B-flat, F; a new,
//                   climbing tune on flute and clarinet; the ripples
//                   widen; choir, very soft
//   A2      8 bars  the first tune again, everyone, the cell now on the
//                   oboe too, slower
//   B again 8 bars  (the second B, before the tail)
//   tail    8 bars  the ripples and one far note; the A major hangs open
//                   and loops back round to D minor

const BAR = 6;
const tune = (text) => melody(text, 1);   // each token an 8th: 6 to a bar
const rest = (bars) => restBars(bars, BAR);
const after = (bars, track) => afterBars(bars, track, BAR);
const fit = (name, section, bars) => tight('Low Tide, Green Sky', name, section, bars, BAR);

// --- Harmony, a bar each ---
const A_CHORDS = 'Dm Bb Gm A Dm Bb C A';
const C_CHORDS = 'Gm Eb Bb F Gm Eb A A';
const INTRO_CHORDS = 'Dm Dm';

// --- The tune: bar 1 is the coast cell (A D D E). ---
const TUNE_A = tune(`
  A4 - D5 D5 - E5     F5 - - E5 - C5
  D5 - Bb4 - - A4     C#5 - - A4 - -
  A4 - D5 D5 - E5     F5 - G5 A5 - -
  G5 - E5 - C5 -      C#5 - - E5 - -
`);
// The climbing tune of the greening sky.
const TUNE_C = tune(`
  G4 - Bb4 D5 - Bb4   Eb5 - D5 Bb4 - G4
  F4 - Bb4 D5 - F5    A5 - G5 F5 - C5
  G4 - Bb4 D5 - G5    G5 - F5 Eb5 - Bb4
  C#5 - E5 G5 - A5    A5 - - - - -
`);
// The cell slowed, for the oboe in the repeat: each note twice as long.
const SLOW_CELL = tune(`
  A4 - - D5 - -       D5 - - E5 - -
  F5 - - - - -        E5 - - - - .
`);

// --- The band ---
// The ripples: root, fifth, octave, the tenth, back down.
const RIPPLE = [0, 7, 12, 'tenth', 12, 7];
const WIDE = [0, 7, 'tenth', 19, 'tenth', 7];
const ripples = (chords) => arpeggio(chords, BAR, 3, RIPPLE);
const wide = (chords) => arpeggio(chords, BAR, 3, WIDE);
// A moving bass: plucked cellos, low, once a bar, and the fifth halfway.
const bass = (chords) => chordLine(chords, [0, '.', '.', 7, '.', '.'], 3);

// Drops: single glass notes now and then.
const DROPS_A = scatter(8, BAR, [[1, 4, 'A6'], [3, 2, 'F6'], [4, 5, 'D7'], [6, 1, 'A6'], [7, 3, 'E6']]);
const DROPS_B = scatter(8, BAR, [[0, 3, 'D7'], [1, 5, 'A6'], [2, 2, 'F6'], [3, 4, 'A6'], [4, 1, 'D7'], [5, 3, 'E6'], [6, 5, 'F6'], [7, 2, 'A6']]);

export const WRACK_THEME = {
  title: 'Low Tide, Green Sky',
  bpm: 60,
  stepsPerBeat: 3,
  volume: 0.85,

  instruments: {
    ripple: { sample: 'harp', volume: 0.2, ring: true, reverb: 0.55, pan: -0.25, humanize: { time: 0.01, volume: 0.18 } },
    rippleWide: { sample: 'harp', volume: 0.15, ring: true, reverb: 0.65, pan: 0.25, humanize: { time: 0.012, volume: 0.2 } },
    flute: { sample: 'flute', volume: 0.24, attack: 0.08, release: 0.5, reverb: 0.5, pan: 0.15, humanize: { time: 0.012, volume: 0.12 } },
    clarinet: { sample: 'clarinet', volume: 0.18, attack: 0.1, release: 0.5, reverb: 0.5, pan: -0.2, humanize: { time: 0.012, volume: 0.12 } },
    oboe: { sample: 'oboe', volume: 0.2, attack: 0.08, release: 0.5, reverb: 0.5, pan: 0.2, humanize: { time: 0.012, volume: 0.12 } },
    pad: { sample: 'violas', volume: 0.12, attack: 1.0, release: 1.4, reverb: 0.55, pan: -0.15 },
    violins: { sample: 'violins', volume: 0.09, attack: 1.0, release: 1.4, reverb: 0.6, pan: 0.3 },
    choir: { sample: 'choir', volume: 0.07, attack: 1.2, release: 1.6, reverb: 0.7 },
    pluck: { sample: 'cellosPizz', volume: 0.22, release: 0.2, reverb: 0.3, pan: -0.2 },
    drop: { sample: 'glass', volume: 0.1, ring: true, reverb: 0.7, pan: 0.35, echo: { time: 0.5, feedback: 0.3, mix: 0.25 } },
    far: { sample: 'chimes', volume: 0.1, ring: true, reverb: 0.8, pan: -0.4 },
  },

  sections: {
    intro: fit('intro', {
      ripple: ripples(INTRO_CHORDS),
      drop: scatter(2, BAR, [[1, 3, 'A6']]),
    }, 2),

    A: fit('A', {
      flute: TUNE_A,
      ripple: ripples(A_CHORDS),
      pad: sustained(A_CHORDS, BAR, 0, 3),
      pluck: bass(A_CHORDS),
      drop: DROPS_A,
    }, 8),

    B: fit('B', {
      oboe: transpose(TUNE_A, -12),
      flute: after(4, TUNE_A),
      ripple: ripples(A_CHORDS),
      pad: sustained(A_CHORDS, BAR, 1, 3),
      violins: sustained(A_CHORDS, BAR, 2, 4),
      pluck: bass(A_CHORDS),
      drop: DROPS_B,
    }, 8),

    C: fit('C', {
      flute: TUNE_C,
      clarinet: transpose(TUNE_C, -12),
      ripple: ripples(C_CHORDS),
      rippleWide: wide(C_CHORDS),
      pad: sustained(C_CHORDS, BAR, 0, 3),
      violins: sustained(C_CHORDS, BAR, 2, 4),
      choir: sustained(C_CHORDS, BAR, 2, 4),
      pluck: bass(C_CHORDS),
      drop: DROPS_A,
    }, 8),

    A2: fit('A2', {
      flute: TUNE_A,
      oboe: [...SLOW_CELL, ...rest(4)],
      ripple: ripples(A_CHORDS),
      rippleWide: wide(A_CHORDS),
      pad: sustained(A_CHORDS, BAR, 0, 3),
      violins: sustained(A_CHORDS, BAR, 2, 4),
      choir: sustained(A_CHORDS, BAR, 1, 4),
      pluck: bass(A_CHORDS),
      drop: DROPS_B,
    }, 8),

    // The ripples thin out; one far note; the A major hangs open.
    tail: fit('tail', {
      ripple: ripples('Dm Bb Gm Gm Dm Bb A A'),
      pad: sustained('Dm Bb Gm Gm Dm Bb A A', BAR, 0, 3),
      far: scatter(8, BAR, [[4, 0, 'A5'], [7, 0, 'E6']]),
      drop: scatter(8, BAR, [[1, 4, 'A6'], [5, 2, 'D7']]),
    }, 8),
  },

  order: ['intro', 'A', 'B', 'C', 'A2', 'B', 'tail'],
  loopFrom: 1,
};
