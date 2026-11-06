import {
  melody, arpeggio, sustained, chordLine, transpose, rest as restBars,
  haddockPhrase, tight, midi, scatter,
} from './parts/chapter5.js';

// "Out Past the Light": the theme of the Storm Reach, the open sea between
// Haddock's Light and the Last Light. You are in a rowboat (the *Bother*),
// putting in at a rock, a reef, a wreck, between rough crossings, and the
// black tower is a little bigger on the skyline every time. It is going out
// past where it's safe. So it rocks: a harp turns one fixed figure over and
// over like a swell lifting the boat (a fixed ostinato with a moving bass,
// after Hollow Knight's City of Tears), the low strings rock root to fifth
// under it, tremolo violins hiss high like rain, and a solo violin carries a
// brave tune that keeps getting pushed back and keeps going. Gusts are
// little flute runs at the ends of the phrases. It stays soft: the storm is
// in the harmony and the rocking, never in the volume, and there are no big
// cellos. One still stretch in the middle (C) is the eye of the storm,
// almost nothing moving, where Haddock's tune surfaces in pieces.
//
// THE COAST CELL (A D D E in D minor) is here in G minor: D G G A. It is
// the violin's first bar, and the harp's swell is made of the same three
// notes (D G A D A G), so the sea and the tune are one thing. In the eye a
// bowed vibraphone plays it slowed to a bar a note; in the last section the
// oboe turns it upside down (D G G F).
//
// HADDOCK'S MOTIF (parts/chapter5.js), minor, in G: Bb A G, D. In the eye
// the clarinet plays it once, slow; then the harp starts it again and stops
// after three notes. That's all: he is in the boat with you, saying little.
//
// G minor, 6/8 at 66 dotted quarters a minute (a bar is about 1.82
// seconds); one step an 8th, six to a bar. The intro plays once (2 bars);
// then it loops from A, 64 bars, about 1m56s:
//
//   intro   2 bars    4s   the swell alone; a far bell
//   A      16 bars   29s   the brave tune on solo violin (D G G A, Bb...):
//                          the first half asks (stops on A over D), the
//                          second comes home to G; rain comes in at bar 9;
//                          a soft horn holds the roots underneath
//   B      16 bars   29s   the fight: a higher second tune in E-flat and B
//                          flat, the violin up to F6; flute gusts at each
//                          phrase end; more rain (violas tremolo too)
//   C      12 bars   22s   the eye: the swell and the rocking stop; held
//                          strings; Haddock's motif on the clarinet, a
//                          broken piece of it on the harp; the slowed cell
//                          on bowed vibes, asking on A over D
//   D      16 bars   29s   the tower closer: the first tune again with
//                          everyone (horn, choir, the oboe's upside-down
//                          cell); the last four bars climb through C minor
//                          and A-flat (the one borrowed chord) to D
//   tail    4 bars    7s   the swell and the bell; D major hangs and loops
//                          round to G minor

const BAR = 6;
const tune = (text) => melody(text, 1);   // each token an 8th: 6 to a bar
const rest = (bars) => restBars(bars, BAR);
const fit = (name, section, bars) => tight('Out Past the Light', name, section, bars, BAR);
// Lay [startBar, steps] parts down on a track of rests `bars` long.
const place = (bars, ...parts) => {
  const out = rest(bars);
  for (const [at, steps] of parts) {
    if (at * BAR + steps.length > out.length) throw new Error(`Out Past the Light: a part from bar ${at} runs past ${bars} bars`);
    steps.forEach((s, i) => { out[at * BAR + i] = s; });
  }
  return out;
};

// --- Harmony, a bar each ---
const INTRO_CHORDS = 'Gm Gm';
const A_CHORDS = 'Gm Eb F D Gm Eb F D   Gm Eb Bb Gm Cm Gm D Gm';
const B_CHORDS = 'Eb F Bb Gm Eb F D D   Cm Gm Eb Bb Cm Eb D D';
const C_CHORDS = 'Gm Gm Eb Eb Gm Gm Eb Eb Cm Cm D D';
const D_CHORDS = 'Gm Eb F D Gm Eb F D   Gm Eb Bb Gm Cm Ab D D';
const TAIL_CHORDS = 'Gm Eb Cm D';

// --- The brave tune (sing it: D G G A, Bb - A G) ---
const TUNE_A = tune(`
  D5 - G5 G5 - A5    Bb5 - - A5 - G5    F5 - D5 - - C5     D5 - - - - .
  D5 - G5 G5 - A5    Bb5 - C6 D6 - -    C6 - Bb5 A5 - F5   A5 - - - - .
  D5 - G5 G5 - A5    Bb5 - - D6 - C6    Bb5 - A5 G5 - F5   G5 - - D5 - -
  Eb5 - - D5 - C5    Bb4 - C5 D5 - G5   F#5 - - A5 - F#5   G5 - - - - .
`);
// The last four bars of D: the climb toward the tower.
const CLIMB_D = tune(`
  Eb5 - G5 C6 - Eb6  Eb6 - - C6 - Ab5   A5 - - D6 - -      D6 - - - - .
`);
// The fight: higher, wider, in E-flat and B-flat.
const TUNE_B = tune(`
  G5 - Bb5 Eb6 - D6  C6 - - A5 - F5     D6 - - Bb5 - F5    G5 - - - - .
  G5 - Bb5 Eb6 - F6  F6 - Eb6 D6 - C6   D6 - - A5 - F#5    A5 - - - - .
  G5 - C6 Eb6 - D6   D6 - Bb5 G5 - D5   Eb5 - G5 Bb5 - C6  D6 - - - - F5
  G5 - - Eb6 - D6    C6 - - Bb5 - G5    F#5 - A5 D6 - C6   A5 - - F#5 - .
`);
// Gusts: quick flute runs where the violin holds.
const GUST_DOWN_G = tune('. . D6 C6 Bb5 G5');
const GUST_UP_D = tune('. . F#5 A5 D6 -');
const GUST_UP_BB = tune('. . F5 Bb5 D6 -');
const GUST_DOWN_D = tune('. . D6 C6 A5 F#5');
// The coast cell slowed to a bar a note (the eye), and upside down (D).
const SLOW_CELL = tune('D5 - - - - -  G5 - - - - -  G5 - - - - -  A5 - - - - .');
const CELL_DOWN = tune('D5 - - G5 - -  G5 - - F5 - -');
// Haddock in the eye: his motif whole, slow; then only three notes.
const HADDOCK = haddockPhrase('G4', { minor: true, lengths: [4, 2, 4, 2], unit: 1 });
const HADDOCK_BROKEN = tune('Bb4 - - - A4 -  G4 - - - - .');

// --- The band ---
// The swell: one fixed figure on the cell's notes, rocking up and back.
const SWELL = tune('D4 G4 A4 D5 A4 G4');
const swell = (bars) => Array.from({ length: bars }, () => SWELL).flat();
const swellWide = (chords) => arpeggio(chords, BAR, 3, [0, 7, 12, 'tenth', 12, 7]);
// The low strings rock root to fifth, a dotted quarter each.
const rock = (chords) => chordLine(chords, [0, '-', '-', 7, '-', '-'], 2);
// A low harp root on each downbeat, under the rocking.
const harpRoot = (chords) => chordLine(chords, [0, '.', '.', '.', '.', '.'], 2);
// Rain: tremolo, held a bar a chord.
const rain = (chords) => sustained(chords, BAR, 1, 5);
const rainLow = (chords) => sustained(chords, BAR, 2, 4);
// The far bell: the tower out there.
const bell = (bars, at) => scatter(bars, BAR, at.map((b) => [b, 0, 'D4']));

export const REACH_THEME = {
  title: 'Out Past the Light',
  bpm: 66,
  stepsPerBeat: 3,
  volume: 1.22,

  instruments: {
    swell: { sample: 'harp', volume: 0.17, ring: true, reverb: 0.55, pan: 0.2, humanize: { time: 0.012, volume: 0.2 } },
    swellWide: { sample: 'harp', volume: 0.14, ring: true, reverb: 0.6, pan: -0.2, humanize: { time: 0.012, volume: 0.2 } },
    harpRoot: { sample: 'harp', volume: 0.17, ring: true, reverb: 0.45, pan: -0.25, humanize: { time: 0.01, volume: 0.15 } },
    harpSolo: { sample: 'harp', volume: 0.18, ring: true, reverb: 0.7, pan: 0.15 },
    rock: { sample: 'cellos', volume: 0.08, attack: 0.5, release: 0.9, reverb: 0.5, pan: -0.15, muffle: 700 },
    violin: { sample: 'soloViolin', volume: 0.17, attack: 0.1, release: 0.6, reverb: 0.55, pan: 0.05, humanize: { time: 0.012, volume: 0.1 } },
    flute: { sample: 'flute', volume: 0.14, attack: 0.03, release: 0.4, reverb: 0.6, pan: 0.35, humanize: { time: 0.01, volume: 0.15 } },
    fluteLong: { sample: 'flute', volume: 0.12, attack: 0.3, release: 0.9, reverb: 0.7, pan: 0.3 },
    oboe: { sample: 'oboe', volume: 0.15, attack: 0.1, release: 0.6, reverb: 0.55, pan: -0.2, humanize: { time: 0.012, volume: 0.12 } },
    clarinet: { sample: 'clarinet', volume: 0.17, attack: 0.15, release: 0.8, reverb: 0.65, pan: -0.15 },
    horn: { sample: 'hornsSoft', volume: 0.08, attack: 0.6, release: 1.2, reverb: 0.6, pan: -0.3 },
    rain: { sample: 'violinsTrem', volume: 0.04, attack: 1.2, release: 1.4, reverb: 0.65, pan: 0.35 },
    rainLow: { sample: 'violasTrem', volume: 0.04, attack: 1.2, release: 1.4, reverb: 0.65, pan: -0.35 },
    violas: { sample: 'violas', volume: 0.08, attack: 1.4, release: 1.8, reverb: 0.65, pan: -0.1 },
    violins: { sample: 'violins', volume: 0.05, attack: 1.6, release: 2.0, reverb: 0.7, pan: 0.3 },
    vibes: { sample: 'vibesBowed', volume: 0.1, attack: 0.4, release: 1.4, reverb: 0.8, pan: 0.2, echo: { time: 0.6, feedback: 0.3, mix: 0.25 } },
    choir: { sample: 'choir', volume: 0.06, attack: 1.4, release: 1.8, reverb: 0.8 },
    bell: { sample: 'chimes', volume: 0.09, ring: true, reverb: 0.85, pan: -0.4, muffle: 2200, echo: { time: 0.9, feedback: 0.3, mix: 0.3 } },
    drop: { sample: 'glass', volume: 0.06, ring: true, reverb: 0.8, pan: 0.35, echo: { time: 0.55, feedback: 0.3, mix: 0.25 } },
  },

  sections: {
    intro: fit('intro', {
      swell: swell(2),
      harpRoot: harpRoot(INTRO_CHORDS),
      bell: bell(2, [1]),
    }, 2),

    A: fit('A', {
      violin: TUNE_A,
      swell: swell(16),
      harpRoot: harpRoot(A_CHORDS),
      rock: rock(A_CHORDS),
      horn: sustained(A_CHORDS, BAR, 0, 3),
      rain: [...rest(8), ...rain(A_CHORDS).slice(8 * BAR)],
      bell: bell(16, [7, 15]),
    }, 16),

    B: fit('B', {
      violin: TUNE_B,
      flute: place(16, [3, GUST_DOWN_G], [7, GUST_UP_D], [11, GUST_UP_BB], [15, GUST_DOWN_D]),
      swell: swell(16),
      swellWide: [...rest(8), ...swellWide(B_CHORDS).slice(8 * BAR)],
      harpRoot: harpRoot(B_CHORDS),
      rock: rock(B_CHORDS),
      violas: sustained(B_CHORDS, BAR, 1, 3),
      rain: rain(B_CHORDS),
      rainLow: rainLow(B_CHORDS),
    }, 16),

    // The eye: nearly still. Haddock's tune, once whole and once in pieces.
    C: fit('C', {
      clarinet: place(12, [0, HADDOCK]),
      harpSolo: place(12, [4, HADDOCK_BROKEN]),
      fluteLong: place(12, [6, tune('Bb5 - - - - -  G5 - - - - .')]),
      vibes: place(12, [8, SLOW_CELL]),
      rock: sustained(C_CHORDS, BAR, 0, 2),
      violas: sustained(C_CHORDS, BAR, 1, 3),
      violins: sustained(C_CHORDS, BAR, 2, 4),
      choir: [...rest(4), ...sustained(C_CHORDS, BAR, 2, 4).slice(4 * BAR)],
      drop: scatter(12, BAR, [[1, 4, 'D6'], [3, 2, 'A5'], [5, 5, 'G5'], [7, 1, 'D6'], [9, 3, 'Bb5'], [11, 4, 'A5']]),
    }, 12),

    // The tower closer: the first tune with everyone, then the climb.
    D: fit('D', {
      violin: [...TUNE_A.slice(0, 12 * BAR), ...CLIMB_D],
      oboe: place(16, [10, CELL_DOWN], [12, transpose(CLIMB_D, -12)]),
      flute: place(16, [3, GUST_UP_D], [7, GUST_DOWN_D]),
      swell: [...swell(12), ...rest(4)],
      swellWide: [...rest(12), ...swellWide(D_CHORDS).slice(12 * BAR)],
      harpRoot: harpRoot(D_CHORDS),
      rock: rock(D_CHORDS),
      horn: sustained(D_CHORDS, BAR, 0, 3),
      violas: sustained(D_CHORDS, BAR, 1, 3),
      choir: [...rest(8), ...sustained(D_CHORDS, BAR, 1, 4).slice(8 * BAR)],
      rain: rain(D_CHORDS),
      rainLow: rainLow(D_CHORDS),
      bell: bell(16, [7]),
    }, 16),

    tail: fit('tail', {
      swell: swell(4),
      harpRoot: harpRoot(TAIL_CHORDS),
      rock: rock(TAIL_CHORDS),
      violins: [...rest(2), midi('A4'), ...Array(2 * BAR - 1).fill('-')],
      bell: bell(4, [1, 3]),
    }, 4),
  },

  order: ['intro', 'A', 'B', 'C', 'D', 'tail'],
  loopFrom: 1,
};
