import {
  melody, repeat, sustained, chordLine, transpose, rest as restBars,
  haddockPhrase, tight, midi, scatter,
} from './parts/chapter5.js';

// "Four Small Lights": the theme of the Beacon Isles, a string of rocks in
// the storm, each with its own small lighthouse, three of them dark for
// years and one still lit. Orla's forge is out here, and past the last rock
// is Haddock's Light. After the Wreck Yard and the Soundings this is the
// first warm place in the storm: still wind, still rain, but the lamps are
// turning and somebody has kept them. So it is hopeful, gently. A harp turns
// four notes round and round like a lamp turning (four notes in a bar of
// six, so the figure comes round a different way each bar and only lines
// up again every two: the beam sweeping past), a glock catches the flash
// every two bars, the bass moves underneath it (a fixed ostinato with a
// moving bass, after Hollow Knight's City of Tears), a solo flute has the
// tune, a solo violin has the second tune, and a soft horn comes in under
// the violin. One short stretch (C) goes back into the storm: B minor,
// soft tremolo strings, an oboe; the lamp keeps turning through it.
//
// THE COAST CELL (A D D E) is the lamp's four notes, shuffled: A D E D. And
// the flute's tune starts on it too (A D E, then up to F#): the sea's tune,
// but in D major for once, the storm with a light in it.
//
// HADDOCK'S MOTIF (parts/chapter5.js, F# E D, A) peeks through at the end,
// because his Light is next: in the coda the soft horn plays it once, low
// and slow, in its own key (D major, his comfortable form), and the flute
// answers it an octave up. Nowhere else.
//
// D major, 3/4 at 84 (a bar is about 2.1 seconds); one step an 8th, 6 to a
// bar. The intro plays once (2 bars); then it loops from A, 64 bars, about
// 2m17s:
//
//   intro   2 bars    4s    the lamp turning alone, one flash
//   A      16 bars   34s    the flute's tune, two phrases: the first asks
//                           (stops on E over A), the second comes home to D
//   B      16 bars   34s    the solo violin, higher and wider: G, A, F#m,
//                           Bm; the soft horn underneath; violas
//   C       8 bars   17s    back in the storm: B minor, tremolo strings
//                           very soft, the oboe, choir; the lamp turns on
//   A2     16 bars   34s    the tune again on violin with the flute a third
//                           above in the second phrase; everyone, gently
//   coda    8 bars   17s    HADDOCK'S MOTIF on the soft horn, then on the
//                           flute; the A major hangs and loops back to A

const BAR = 6;
const tune = (text) => melody(text, 1);   // each token an 8th: 6 to a bar
const rest = (bars) => restBars(bars, BAR);
const fit = (name, section, bars) => tight('Four Small Lights', name, section, bars, BAR);

// --- Harmony, a bar each ---
const INTRO_CHORDS = 'D D';
const A_CHORDS = 'D Bm G A D Bm Em A   D Bm G D G D A D';
const B_CHORDS = 'G A F#m Bm G A D D   Em A F#m Bm G Em A A';
const C_CHORDS = 'Bm G D A Bm G Em A';
const CODA_CHORDS = 'D Bm G A D Bm G A';

// --- The tunes (sing the first two bars: A D E, F#) ---
const TUNE_A = tune(`
  A4 - D5 - E5 -    F#5 - - - D5 -    B4 - D5 - G5 -    F#5 - - - E5 -
  A4 - D5 - E5 -    F#5 - A5 - B5 -   G5 - F#5 - E5 -   E5 - - - - .
  A4 - D5 - E5 -    F#5 - - - D5 -    B5 - A5 - G5 -    F#5 - - - A5 -
  G5 - B5 - D6 -    A5 - - - F#5 D5   E5 - F#5 - G5 E5  D5 - - - - .
`);
// A third above the second phrase, for the flute in A2 (by hand).
const THIRDS_A = tune(`
  . . . . . .       . . . . . .       . . . . . .       . . . . . .
  . . . . . .       . . . . . .       . . . . . .       . . . . . .
  C#5 - F#5 - G5 -  A5 - - - F#5 -    D6 - C#6 - B5 -   A5 - - - D6 -
  B5 - D6 - G6 -    D6 - - - A5 F#5   C#6 - D6 - E6 C#6  F#5 - - - - .
`);
// The violin's tune: up high and wider, two phrases.
const TUNE_B = tune(`
  D6 - - - B5 -     C#6 - - - A5 -    A5 - - - F#5 -    B5 - - - - -
  G5 - B5 - D6 -    E6 - - - C#6 -    D6 - - - A5 -     F#5 - - - - .
  E6 - - - B5 -     C#6 - - - A5 -    A5 - C#6 - F#6 -  D6 - - - B5 -
  B5 - - - D6 -     G6 - - - E6 -     E6 - - - C#6 -    A5 - - - - .
`);
// The soft horn under the violin: a slow line on the chord tones.
const HORN_B = tune(`
  D4 - - - B3 -     C#4 - - - A3 -    C#4 - - - A3 -    D4 - - - - -
  B3 - - - D4 -     E4 - - - C#4 -    D4 - - - A3 -     A3 - - - - .
  G3 - - - B3 -     A3 - - - C#4 -    C#4 - - - A3 -    B3 - - - D4 -
  D4 - - - B3 -     B3 - - - G3 -     A3 - - - C#4 -    E4 - - - - .
`);
// Back in the storm: the oboe, B minor.
const TUNE_C = tune(`
  B4 - D5 - F#5 -   G5 - - - F#5 E5   F#5 - - - D5 -    E5 - - - - -
  B4 - D5 - F#5 -   B5 - - - A5 G5    G5 - F#5 - E5 -   E5 - - - C#5 -
`);

// --- The band ---
// The lamp: four notes (the coast cell shuffled, A D E D) round and round
// in a bar of six, so the beam comes round a different way each bar.
const LAMP = tune('A5 D6 E6 D6');
const lamp = (bars) => repeat(LAMP, (bars * BAR) / 4);
// The flash: a glock note as the beam lines up again, every two bars.
const flash = (bars) => scatter(bars, BAR, Array.from({ length: bars / 2 }, (_, i) => [i * 2, 0, 'A6']));
// The moving bass: a low harp root, the fifth, the octave.
const harpBass = (chords) => chordLine(chords, [0, '.', 7, '.', 12, '.'], 2);

// Haddock's motif in D major, slow (lengths 4 2 4 2 in 8ths: two bars).
const HADDOCK_LOW = haddockPhrase('D4', { lengths: [4, 2, 4, 2], unit: 1 });
const HADDOCK_HIGH = haddockPhrase('D5', { lengths: [4, 2, 4, 2], unit: 1 });

export const ISLES_THEME = {
  title: 'Four Small Lights',
  bpm: 84,
  stepsPerBeat: 2,
  volume: 1.5,

  instruments: {
    lamp: { sample: 'harp', volume: 0.13, ring: true, reverb: 0.55, pan: 0.25, humanize: { time: 0.01, volume: 0.18 } },
    flash: { sample: 'glock', volume: 0.07, ring: true, reverb: 0.7, pan: 0.35, echo: { time: 0.36, feedback: 0.25, mix: 0.2 } },
    harpBass: { sample: 'harp', volume: 0.18, ring: true, reverb: 0.45, pan: -0.25, humanize: { time: 0.01, volume: 0.15 } },
    flute: { sample: 'flute', volume: 0.24, attack: 0.06, release: 0.5, reverb: 0.5, pan: 0.1, humanize: { time: 0.012, volume: 0.12 } },
    fluteTwo: { sample: 'flute', volume: 0.15, attack: 0.08, release: 0.5, reverb: 0.55, pan: 0.3, humanize: { time: 0.012, volume: 0.12 } },
    violin: { sample: 'soloViolin', volume: 0.17, attack: 0.12, release: 0.6, reverb: 0.55, pan: -0.1, humanize: { time: 0.012, volume: 0.1 } },
    horn: { sample: 'hornsSoft', volume: 0.12, attack: 0.4, release: 1.0, reverb: 0.6, pan: -0.2 },
    oboe: { sample: 'oboe', volume: 0.2, attack: 0.08, release: 0.5, reverb: 0.55, pan: 0.15, humanize: { time: 0.012, volume: 0.12 } },
    clarinet: { sample: 'clarinet', volume: 0.13, attack: 0.12, release: 0.5, reverb: 0.55, pan: -0.25 },
    violas: { sample: 'violas', volume: 0.1, attack: 0.9, release: 1.2, reverb: 0.55, pan: -0.15 },
    violins: { sample: 'violins', volume: 0.07, attack: 1.0, release: 1.4, reverb: 0.6, pan: 0.3 },
    trem: { sample: 'violinsTrem', volume: 0.05, attack: 1.2, release: 1.4, reverb: 0.6, pan: 0.3 },
    tremLow: { sample: 'violasTrem', volume: 0.05, attack: 1.2, release: 1.4, reverb: 0.6, pan: -0.3 },
    choir: { sample: 'choir', volume: 0.06, attack: 1.4, release: 1.8, reverb: 0.75 },
  },

  sections: {
    intro: fit('intro', {
      lamp: lamp(2),
      flash: flash(2),
      harpBass: [midi('D2'), ...Array(2 * BAR - 1).fill('.')],
    }, 2),

    A: fit('A', {
      flute: TUNE_A,
      lamp: lamp(16),
      flash: flash(16),
      harpBass: harpBass(A_CHORDS),
      violas: [...rest(8), ...sustained(A_CHORDS, BAR, 1, 3).slice(8 * BAR)],
    }, 16),

    B: fit('B', {
      violin: TUNE_B,
      horn: HORN_B,
      lamp: lamp(16),
      flash: flash(16),
      harpBass: harpBass(B_CHORDS),
      violas: sustained(B_CHORDS, BAR, 2, 3),
      violins: [...rest(8), ...sustained(B_CHORDS, BAR, 1, 4).slice(8 * BAR)],
    }, 16),

    C: fit('C', {
      oboe: TUNE_C,
      clarinet: [...rest(4), ...transpose(TUNE_C, -12).slice(4 * BAR)],
      lamp: lamp(8),
      harpBass: harpBass(C_CHORDS),
      trem: sustained(C_CHORDS, BAR, 1, 4),
      tremLow: sustained(C_CHORDS, BAR, 0, 3),
      choir: sustained(C_CHORDS, BAR, 2, 4),
    }, 8),

    A2: fit('A2', {
      violin: TUNE_A,
      fluteTwo: THIRDS_A,
      lamp: lamp(16),
      flash: flash(16),
      harpBass: harpBass(A_CHORDS),
      violas: sustained(A_CHORDS, BAR, 1, 3),
      violins: sustained(A_CHORDS, BAR, 2, 4),
      horn: [...rest(8), ...sustained(A_CHORDS, BAR, 0, 3).slice(8 * BAR)],
    }, 16),

    // Haddock's Light is next: his four notes on the horn, then the flute.
    coda: fit('coda', {
      horn: [...HADDOCK_LOW, ...rest(6)],
      flute: [...rest(4), ...HADDOCK_HIGH, ...rest(2)],
      lamp: lamp(8),
      flash: flash(8),
      harpBass: harpBass(CODA_CHORDS),
      violas: sustained(CODA_CHORDS, BAR, 1, 3),
      violins: [...rest(6), midi('A4'), ...Array(2 * BAR - 1).fill('-')],
    }, 8),
  },

  order: ['intro', 'A', 'B', 'C', 'A2', 'coda'],
  loopFrom: 1,
};
