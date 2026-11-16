import {
  melody, sustained, rest as restBars, held, transpose,
  tight, after as afterBars, until as untilBars, scatter, hits, repeat,
} from './parts/chapter5.js';
import { patter, cells, cellsFor } from './parts/chapter3.js';

// "Low Tide, Green Sky": the theme of the Wrack Shore, where the storm
// begins. The sea has gone out too far; the tidepools shine; the sky over
// the water is the wrong colour. Nothing has happened yet, and everyone
// knows something will. So it is all anticipation: beautiful, a soft pulse
// underneath like a heart going a little fast, and the unease in the
// harmony, never in the volume.
//
// Built the way Hollow Knight's City of Tears is built (its shape, not its
// tune). A harp turns the same notes, D A E and the D above (a stack of
// fifths, the first-sight-of-the-sea waves moved down a fifth), in the same
// lilting figure every bar: D, A-E, A, D, E-A. It never changes, and it is
// the first hook: you could tap it on a table. The bass walks underneath,
// a step every half bar, and changes what the ripples mean: over D they
// are open, over B-flat they shimmer (the major 7th and the sharp 4th),
// over G minor they ache, over A they hang, asking. Only once does
// anything bend: when the bass reaches E-flat (the storm's chord, a half
// step above home) the ripple's E sinks with it, and the green comes in.
//
// THE TUNE (the second hook, and the anchor) starts with THE COAST CELL:
// A D D E (parts/chapter5.js, COAST_CELL), the first bar of the coast
// fights, then climbs a step at a time, F, G, and falls back to hang on E.
// Said twice, the second time reaching up to B-flat, then an answer from
// the high D that walks home. Sing it once and it's yours. The oboe's tune
// in B is the cell in G minor (D G G A, the shape the Storm Reach uses),
// climbing in sequences. In the green the solo violin sings the cell
// upside down, a bar a note (A D D C): the storm's form of the sea's tune,
// heard here for the first time. In the hush the harp picks it out alone
// with the ripples gone, like the tide gone all the way out. Then the
// payoff: the whole tune back on flute and violins together, the clarinet
// an octave under, the oboe singing a counter-line in thirds below.
//
// Inside, then outside: A is close (harp, flute, the walking low harp, a
// frame drum barely there); B opens up (oboe, violas, violins, the drum
// steadier); C is the outside, the sky itself (tremolo strings swelling
// like rain coming in, low toms far off, the choir, the solo violin high);
// the hush empties out to nothing; A3 is the tune at its fullest, the
// biggest it gets (still soft: no brass, no cellos); the tail thins to the
// ripples and the open A, still asking, and goes round.
// Reference for the mood only: City of Tears and Greenpath, Dead Cells'
// Undying Shores, Wind Waker's calmer sea.
//
// D minor, 6/8 at 64 dotted quarters a minute (a bar is under 2 seconds);
// one step a 16th, twelve to a bar. The intro plays once (2 bars); then it
// loops from A, 72 bars, about 2m15s:
//
//   intro   2 bars  the ripples alone; one glass drop
//   A      16 bars  THE TUNE on the flute, starting with the coast cell; the
//                   bass walks D, C, B-flat, A, then on through F and C
//                   home; the far harp and the violas from bar 9, the
//                   frame drum's heartbeat under them
//   B      16 bars  the oboe's tune (the cell in G minor), climbing; the
//                   bass climbs to the E-flat and the ripple bends; violas,
//                   violins, then the choir come in; the tremolo strings
//                   swell under the last four bars
//   C      12 bars  the green sky, the outside: the cell upside down on the
//                   solo violin, a bar a note; rain on tremolo strings, low
//                   toms, the choir; the clarinet answers low
//   hush    8 bars  the ripples stop: the tide all the way out. A low A,
//                   glass drops, the harp picks the cell out alone; the
//                   last bar rises on the harp and stops for a beat
//   A3     16 bars  THE PAYOFF: the tune on flute and violins together, the
//                   clarinet under, the oboe's counter-line, the choir, the
//                   tremolo strings, the drum and a soft piano on the bass
//   tail    4 bars  it thins to the ripples and the open A, and goes round

const BAR = 12;
const tune = (text) => melody(text, 2);   // each token an 8th: 6 to a bar
const rest = (bars) => restBars(bars, BAR);
const after = (bars, track) => afterBars(bars, track, BAR);
const until = (bars, track) => untilBars(bars, track, BAR);
const fit = (name, section, bars) => tight('Low Tide, Green Sky', name, section, bars, BAR);
// Drums: one pattern repeated a number of bars.
const beat = (pattern, bars) => repeat(hits(pattern), bars);

// --- The ripple: D A E D', the same lilting figure every bar. The far harp
// answers it, sparser, the other side. When the bass is E-flat, the E sinks.
const RIPPLE_CELL = 'D5 A5 E6 D6';
const BENT_CELL = 'D5 A5 Eb6 D6';
const RIPPLE = [0, '.', 1, 2, '.', 1, 3, '.', 2, 1, '.', '.'];
const ANSWER = ['.', '.', '.', '.', 2, '.', '.', '.', '.', '.', 0, '.'];
const ripple = (bars) => patter(cells(RIPPLE_CELL, bars), RIPPLE);
const answer = (bars) => patter(cells(RIPPLE_CELL, bars), ANSWER);
// Bars where the bass is E-flat bend the ripple.
const rippleOver = (roots, shape = RIPPLE) => patter(cellsFor(roots, { Eb: BENT_CELL }, RIPPLE_CELL), shape);

// --- The harmony, a bar each, and the walking bass (the low harp: the
// root, the fifth, and a step that leads into the next bar). ---
const A_CHORDS = 'Dm C Bb A Dm C Gm A Bb F Gm A Bb C A Dm';
const A_BASS = tune(`
  D3 - - A2 - B2    C3 - - G2 - A2    Bb2 - - F3 - Bb2  A2 - - E3 - C#3
  D3 - - A2 - B2    C3 - - G2 - F#2   G2 - - D3 - G#2   A2 - - E3 - A2
  Bb2 - - F3 - E3   F2 - - C3 - F#2   G2 - - D3 - G#2   A2 - - E3 - A2
  Bb2 - - F3 - B2   C3 - - G2 - G#2   A2 - - E3 - C#3   D3 - - A2 - A2
`);
const B_ROOTS = 'Gm Gm Bb Bb F F C C Gm Gm Bb Bb Eb Eb A A';
const B_BASS = tune(`
  G2 - - D3 - G2    G2 - - D3 - A2    Bb2 - - F3 - Bb2  Bb2 - - D3 - E2
  F2 - - C3 - F2    F2 - - C3 - B2    C3 - - G3 - C3    C3 - - G2 - F#2
  G2 - - D3 - G2    G2 - - D3 - A2    Bb2 - - F3 - Bb2  Bb2 - - F3 - D3
  Eb3 - - Bb2 - Eb3 Eb3 - - Bb3 - Bb2 A2 - - E3 - A2    A2 - - E3 - A2
`);
const C_ROOTS = 'Gm Gm Eb Eb Bb Bb F F Gm Gm A A';
const C_BASS = tune(`
  G2 - - D3 - G2    G2 - - D3 - F2    Eb3 - - Bb2 - Eb3 Eb3 - - Bb2 - A2
  Bb2 - - F3 - Bb2  Bb2 - - F3 - E3   F2 - - C3 - F2    F2 - - C3 - F#2
  G2 - - D3 - G2    G2 - - D3 - G#2   A2 - - E3 - A2    A2 - - E3 - A2
`);

// --- THE TUNE: bar 1 is the coast cell (A D D E), then up a step at a time
// and back down to hang on E. Said again reaching to B-flat; then the
// answer from the high D, walking home. ---
const TUNE_A = tune(`
  A4 - D5 D5 - E5   F5 - - E5 - G5    F5 - - D5 - -     E5 - - - - -
  A4 - D5 D5 - E5   F5 - - G5 - A5    Bb5 - - A5 - G5   A5 - - - - -
  D6 - - C6 - Bb5   A5 - - F5 - -     G5 - - Bb5 - A5   E5 - - - - -
  D6 - - C6 - Bb5   A5 - - G5 - F5    E5 - F5 G5 - E5   D5 - - - - .
`);
// The oboe's counter-line under the tune in A3: long notes where the tune
// moves, moving where the tune holds, mostly a third or a sixth below.
const COUNTER_A = tune(`
  F4 - - - - -      G4 - - - - -      D4 - - F4 - -     C#4 - - E4 - A4
  F4 - - - - -      G4 - - - C5 -     D5 - - - Bb4 -    C#5 - - E5 - C#5
  F5 - - - - -      C5 - - - A4 -     Bb4 - - D5 - C5   A4 - - C#5 - A4
  F5 - - - D5 -     E5 - - - C5 -     C#5 - D5 E5 - C#5 A4 - - - - .
`);
// The oboe's tune: the cell in G minor (D G G A), climbing in sequences,
// leaning into the E-flat, then hanging on the open A.
const TUNE_B = tune(`
  D5 - G5 G5 - A5   Bb5 - - A5 - G5   F5 - - D5 - F5    F5 - - - - -
  C5 - F5 F5 - G5   A5 - - G5 - F5    E5 - - G5 - -     G5 - - - - -
  D5 - G5 G5 - A5   Bb5 - - C6 - D6   D6 - - C6 - Bb5   F5 - - - - -
  G5 - - Bb5 - -    Bb5 - - G5 - Eb5  E5 - - - C#5 -    E5 - - - - .
`);
// The green: the cell upside down (A D D C) on the solo violin, a bar a note,
// over G minor and the E-flat; then up and back down to the open A.
const SKY = tune(`
  A5 - - - - -      D6 - - - - -      D6 - - - - -      C6 - - - - -
  F6 - - - - -      E6 - - D6 - -     F6 - - - - -      A5 - - - - -
  Bb5 - - - - -     D6 - - - - -      A5 - - - - -      - - - - . .
`);
// The clarinet's answer under the sky: the cell plain, low, twice.
const LOW_CELL = tune(`
  . . . . . .       . . . . . .       . . . . . .       . . . . . .
  A3 - D4 D4 - E4   F4 - - - - -      . . . . . .       . . . . . .
  A3 - D4 D4 - E4   E4 - - - - -      . . . . . .       . . . . . .
`);
// The hush: the harp alone picks out the cell, slow, with gaps; then a
// rise up the D minor chord into the payoff, and a beat of nothing.
const HUSH_CELL = tune(`
  . . . . . .       A4 - - - - -      D5 - - - - -      . . . . . .
  D5 - - - - -      E5 - - - - -      . . . . . .       A4/D5 F5/A5 D6 . . .
`);

// Drops: single glass notes now and then (kept near the glass's own notes).
const DROPS_A = scatter(16, BAR, [[1, 8, 'A5'], [3, 4, 'F5'], [5, 10, 'D6'], [8, 2, 'A5'], [10, 6, 'E6'], [13, 8, 'D6'], [15, 4, 'A5']]);
const DROPS_B = scatter(16, BAR, [[0, 6, 'D6'], [2, 10, 'A5'], [4, 4, 'F5'], [6, 8, 'D6'], [8, 2, 'A5'], [11, 6, 'E6'], [13, 10, 'F5'], [15, 4, 'A5']]);

// The pulse: a frame drum's heartbeat on the two big beats, with a little
// push before the second; in C and A3 a ghost note fills the gap.
const HEART = 'x..... x...x.';
const HEART_FULL = 'x..x.. x..x.x';
// Low toms far off in the green, on the bar, and a roll into the payoff.
const TOMS = 'x..... ......';
const ROLL = 'x..x.. x.x.xx';

export const WRACK_THEME = {
  title: 'Low Tide, Green Sky',
  bpm: 64,
  stepsPerBeat: 6,
  volume: 1.1,

  instruments: {
    // The ripples: the near harp and a far one, the other side, muffled.
    ripple: { sample: 'harp', volume: 0.16, ring: true, reverb: 0.5, pan: -0.25, humanize: { time: 0.008, volume: 0.16 } },
    rippleFar: { sample: 'harp', volume: 0.09, ring: true, muffle: 3600, reverb: 0.65, pan: 0.3, humanize: { time: 0.014, volume: 0.22 } },
    // The low harp that walks underneath and changes what they mean.
    low: { sample: 'harp', volume: 0.21, ring: true, reverb: 0.4, pan: -0.1, humanize: { time: 0.01, volume: 0.1 } },
    // A soft piano under the low harp in the payoff, an octave down.
    piano: { sample: 'grandPiano', volume: 0.1, ring: true, muffle: 1600, reverb: 0.4, pan: -0.2, humanize: { time: 0.01, volume: 0.12 } },
    flute: { sample: 'flute', volume: 0.24, attack: 0.06, release: 0.5, reverb: 0.5, pan: 0.15, humanize: { time: 0.01, volume: 0.1 } },
    oboe: { sample: 'oboe', volume: 0.18, attack: 0.08, release: 0.5, reverb: 0.5, pan: 0.2, humanize: { time: 0.012, volume: 0.12 } },
    clarinet: { sample: 'clarinet', volume: 0.15, attack: 0.1, release: 0.6, reverb: 0.55, pan: -0.25, humanize: { time: 0.012, volume: 0.12 } },
    // The violins on the tune in the payoff, with the flute.
    violinsTune: { sample: 'violins', volume: 0.12, attack: 0.15, release: 0.8, muffle: 4200, reverb: 0.55, pan: 0.25, humanize: { time: 0.012, volume: 0.08 } },
    // Where City of Tears has its soprano: a solo violin, high and far.
    voice: { sample: 'soloViolin', volume: 0.21, attack: 0.7, release: 1.6, muffle: 4800, reverb: 0.6, pan: 0.05, humanize: { time: 0.015, volume: 0.1 } },
    pad: { sample: 'violas', volume: 0.11, attack: 1.2, release: 1.6, muffle: 3000, reverb: 0.55, pan: -0.15 },
    violins: { sample: 'violins', volume: 0.08, attack: 1.2, release: 1.6, muffle: 3400, reverb: 0.6, pan: 0.3 },
    // Rain coming in: tremolo strings, low-passed until they're mostly air.
    rain: { sample: 'violinsTrem', volume: 0.1, attack: 1.8, release: 2, muffle: 2400, reverb: 0.7, pan: 0.2 },
    rainLow: { sample: 'violasTrem', volume: 0.09, attack: 1.8, release: 2, muffle: 2000, reverb: 0.7, pan: -0.2 },
    choirLow: { sample: 'choir', volume: 0.09, attack: 1.6, release: 2, muffle: 2600, reverb: 0.7, pan: -0.2 },
    choirHigh: { sample: 'choir', volume: 0.1, attack: 1.8, release: 2.2, muffle: 3000, reverb: 0.7, pan: 0.2 },
    // The pulse: a frame drum close and soft, toms a long way off.
    drum: { sample: 'frameDrum', drum: 'sample', volume: 0.13, ring: true, reverb: 0.4, pan: 0.05, humanize: { time: 0.006, volume: 0.25 } },
    tom: { sample: 'tom', drum: 'sample', volume: 0.15, ring: true, reverb: 0.6, pan: -0.15, humanize: { time: 0.006, volume: 0.2 } },
    drop: { sample: 'glass', volume: 0.08, ring: true, reverb: 0.7, pan: 0.35, echo: { time: 0.47, feedback: 0.3, mix: 0.25 } },
    far: { sample: 'chimes', volume: 0.08, ring: true, reverb: 0.8, muffle: 3000, pan: -0.4 },
  },

  sections: {
    intro: fit('intro', {
      ripple: ripple(2),
      drop: scatter(2, BAR, [[1, 6, 'A5']]),
    }, 2),

    // THE TUNE: inside, close. The bass walks under the ripples; the far
    // harp, the violas and the heartbeat come in halfway.
    A: fit('A', {
      flute: TUNE_A,
      ripple: ripple(16),
      rippleFar: after(8, answer(16)),
      low: A_BASS,
      pad: after(8, sustained(A_CHORDS, BAR, 0, 3)),
      drum: after(8, beat(HEART, 16)),
      drop: DROPS_A,
    }, 16),

    // The oboe's tune: it opens up, a part at a time; the ripple bends at
    // the E-flat, and the rain swells under the last four bars.
    B: fit('B', {
      oboe: TUNE_B,
      ripple: rippleOver(B_ROOTS),
      rippleFar: rippleOver(B_ROOTS, ANSWER),
      low: B_BASS,
      pad: sustained(B_ROOTS, BAR, 0, 3),
      violins: after(4, sustained(B_ROOTS, BAR, 1, 4)),
      choirLow: after(8, sustained(B_ROOTS, BAR, 0, 3)),
      rain: after(12, sustained(B_ROOTS, BAR, 2, 4)),
      drum: beat(HEART, 16),
      drop: DROPS_B,
    }, 16),

    // The green sky: the outside, the biggest it gets before the payoff.
    C: fit('C', {
      voice: SKY,
      clarinet: LOW_CELL,
      ripple: rippleOver(C_ROOTS),
      rippleFar: rippleOver(C_ROOTS, ANSWER),
      low: C_BASS,
      pad: sustained(C_ROOTS, BAR, 0, 3),
      violins: sustained(C_ROOTS, BAR, 1, 4),
      rain: [...held('D5', 4 * BAR), ...held('F5', 4 * BAR), ...held('D5', 2 * BAR), ...held('E5', 2 * BAR)],
      rainLow: sustained(C_ROOTS, BAR, 0, 3),
      choirLow: sustained(C_ROOTS, BAR, 0, 3),
      choirHigh: sustained(C_ROOTS, BAR, 2, 4),
      drum: beat(HEART_FULL, 12),
      tom: beat(TOMS, 12),
      far: scatter(12, BAR, [[4, 0, 'D5'], [10, 0, 'A4']]),
    }, 12),

    // The tide all the way out: no ripples. A low A, a drop, the cell alone,
    // then the harp rises and stops a beat short of the payoff.
    hush: fit('hush', {
      low: [...tune('A2 - - E3 - -'), ...rest(3), ...tune('A2 - - E3 - -'), ...rest(3)],
      ripple: HUSH_CELL,
      pad: [...held('A3', 6 * BAR), ...rest(2)],
      tom: [...rest(7), ...hits('x..... ......')],
      far: scatter(8, BAR, [[0, 0, 'E5'], [5, 0, 'A4']]),
      drop: scatter(8, BAR, [[2, 8, 'A5'], [4, 2, 'D6'], [6, 6, 'E6']]),
    }, 8),

    // THE PAYOFF: the tune at its fullest, flute and violins together, the
    // clarinet an octave under, the oboe's counter-line, the choir and the
    // rain, the piano under the walking bass.
    A3: fit('A3', {
      flute: TUNE_A,
      violinsTune: TUNE_A,
      clarinet: after(8, transpose(TUNE_A, -12)),
      oboe: COUNTER_A,
      ripple: ripple(16),
      rippleFar: answer(16),
      low: A_BASS,
      piano: transpose(A_BASS, -12),
      pad: sustained(A_CHORDS, BAR, 0, 3),
      // The chords' thirds, but G (not E) on the C bars, where the tune
      // leans on F before it falls to E.
      rainLow: until(15, sustained(A_CHORDS, BAR, 1, 3).map((n) => (n === 52 ? 55 : n))),
      choirLow: sustained(A_CHORDS, BAR, 0, 3),
      choirHigh: after(8, sustained(A_CHORDS, BAR, 2, 4)),
      drum: [...beat(HEART_FULL, 15), ...hits('x..... ......')],
      tom: [...beat(TOMS, 7), ...hits(ROLL), ...beat(TOMS, 8)],
      drop: DROPS_A,
    }, 16),

    // It thins to the ripples and the open A, still asking; then round.
    tail: fit('tail', {
      ripple: ripple(4),
      rippleFar: until(2, answer(4)),
      low: [...tune('A2 - - E3 - -'), ...rest(1), ...tune('A2 - - E3 - -'), ...rest(1)],
      pad: [...held('E3', 3 * BAR), ...rest(1)],
      drop: scatter(4, BAR, [[1, 6, 'A5']]),
    }, 4),
  },

  order: ['intro', 'A', 'B', 'C', 'hush', 'A3', 'tail'],
  loopFrom: 1,
};
