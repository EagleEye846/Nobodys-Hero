import { chordLine, transpose, rest as restBars, tight, emberNotes } from './parts/chapter6.js';
import {
  HEARTH_HOOK, HEARTH_COUNTER, HEARTH_COUNTER_A3, HEARTH_STREET, HEARTH_STREET_HOLD, HEARTH_ANSWER,
  HEARTH_A_CHORDS, HEARTH_A3_CHORDS, HEARTH_B_CHORDS, HEARTH_C_CHORDS,
} from './hearthTheme.js';

// "Sweep the Step (By the Fire)": Hearth's song from inside the inn, late,
// with the brooms put away. The same tune as the street (hearthTheme.js),
// slower and close by: somebody at the old piano in the corner playing it
// to themselves, and the fiddler from the street sat by the fire, joining
// in quietly when they feel like it. No band, no drum, no broom. The fire
// is the room's own (the inn should use the 'hearth' ambience, the real
// recording of a fire crackling, under it).
//
// The piano plays THE HOOK (the ember cell in A major, A B C# E, F to E,
// always landing on the fifth) with its left hand rolling the chords in
// 8ths. Second time the fiddle takes it, soft, and the piano plays the
// countermelody under it. Then the street tune, slowly, on the piano, the
// fiddle holding long low notes under. Then the ash at the door: the piano
// plays the cell low and minor, the way the ash plays it (F# G# A C#, D
// C#), and the fiddle answers it in major, the way the town does, but
// gently, the way you'd say it to someone half asleep. Then both play the
// hook together, the piano an octave over the fiddle, and it's home.
//
// A major, 6/8 at 50 (the street's is 64); one step a 16th, 12 to a bar (a
// bar is 2.4 seconds). Two bars of the left hand play once; then it loops
// from A, 40 bars, about 1m36s:
//
//   intro   2 bars  the piano's left hand alone
//   A       8 bars  THE HOOK on the piano
//   A2      8 bars  the fiddle takes it, the piano's countermelody under
//   B       8 bars  the street tune on the piano, slow; the fiddle holds
//   C       8 bars  the ash at the door: the cell low and minor on the
//                   piano, the fiddle answering in major
//   A3      8 bars  the hook on fiddle and piano together, an octave
//                   apart; it lands on A

const BAR = 12;
const rest = (bars) => restBars(bars, BAR);
const fit = (name, section, bars) => tight('Sweep the Step (By the Fire)', name, section, bars, BAR);
const up = (steps, semitones) => transpose(steps, semitones);

// The left hand, rolling: root, fifth, tenth, octave, tenth, fifth.
const ROLL = [0, '.', 7, '.', 'tenth', '.', 12, '.', 'tenth', '.', 7, '.'];
const roll = (chords) => chordLine(chords, ROLL, 2);
// Under the ash: the root, and the tenth late in the bar.
const SPARE = [0, '-', '-', '-', '-', '-', '.', '.', '.', 'tenth', '-', '-'];
const spare = (chords) => chordLine(chords, SPARE, 2);

// The cell low on the piano, the way the ash plays it, twice, with the
// fiddle's major answer between.
const ASH_CELL = (() => {
  const [a, b, c, d, e, f] = emberNotes('F#3');   // F#3 G#3 A3 C#4, D4 C#4
  return [a, '-', '-', '-', b, '-', c, '-', '-', '-', d, '-', e, '-', '-', '-', '-', '-', f, '-', '-', '-', '-', '.'];
})();
const ASH = [...ASH_CELL, ...rest(2), ...ASH_CELL, ...rest(2)];

export const HEARTH_INN_THEME = {
  title: 'Sweep the Step (By the Fire)',
  bpm: 50,
  stepsPerBeat: 6,
  // A little under the street, like the other indoor songs (about -29 on
  // tools/loudnessCheck.html).
  volume: 1.25,

  instruments: {
    piano: { sample: 'grandPiano', volume: 0.24, ring: true, reverb: 0.3, pan: -0.05, humanize: { time: 0.016, volume: 0.15 } },
    high: { sample: 'grandPiano', volume: 0.12, ring: true, reverb: 0.35, pan: -0.05, humanize: { time: 0.016, volume: 0.15 } },
    left: { sample: 'grandPiano', volume: 0.15, ring: true, reverb: 0.3, pan: -0.15, muffle: 2400, humanize: { time: 0.016, volume: 0.15 } },
    fiddle: { sample: 'soloViolin', volume: 0.2, attack: 0.12, release: 0.7, reverb: 0.35, pan: 0.2, humanize: { time: 0.014, volume: 0.12 } },
  },

  sections: {
    // The left hand alone.
    intro: fit('intro', {
      left: roll('A E'),
    }, 2),

    // THE HOOK on the piano.
    A: fit('A', {
      piano: HEARTH_HOOK,
      left: roll(HEARTH_A_CHORDS),
    }, 8),

    // The fiddle takes it; the piano's countermelody under.
    A2: fit('A2', {
      fiddle: HEARTH_HOOK,
      piano: up(HEARTH_COUNTER, -12),
      left: roll(HEARTH_A_CHORDS),
    }, 8),

    // The street tune on the piano, slow; the fiddle holds under it.
    B: fit('B', {
      piano: HEARTH_STREET,
      fiddle: up(HEARTH_STREET_HOLD, -12),
      left: roll(HEARTH_B_CHORDS),
    }, 8),

    // The ash at the door: the cell low and minor, the fiddle answering in
    // major.
    C: fit('C', {
      piano: ASH,
      fiddle: HEARTH_ANSWER,
      left: spare(HEARTH_C_CHORDS),
    }, 8),

    // The hook together, the piano an octave over the fiddle, the counter
    // under; it lands on A.
    A3: fit('A3', {
      fiddle: HEARTH_HOOK,
      high: up(HEARTH_HOOK, 12),
      piano: up(HEARTH_COUNTER_A3, -12),
      left: roll(HEARTH_A3_CHORDS),
    }, 8),
  },

  order: ['intro', 'A', 'A2', 'B', 'C', 'A3'],
  loopFrom: 1,
};

