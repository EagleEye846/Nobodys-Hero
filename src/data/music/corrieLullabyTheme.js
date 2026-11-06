import {
  lullaby, LULLABY_A, LULLABY_B, LULLABY_A_CHORDS, LULLABY_B_CHORDS,
  arpeggio, sustained, chordLine, transpose, rest as restBars, midi, tight,
} from './parts/chapter5.js';

// "Come In, Little Boat": the lullaby Haddock hums by the fire. It is
// Corrie's, though he never says so. The whole song is one small tune on a
// music box (a glockenspiel, soft, with a long echo) over a harp rocking
// like a cradle, and a hum that comes in when the second time round the
// tune gets lonely. D minor, then a lift into F major that doesn't quite
// feel like comfort, and back. The tune is deliberately plain so a player
// ends up humming it; it stops on a question (the fifth, E over an A chord)
// halfway and finally comes home to D, soft as a door being drawn to.
// Reference for the mood only: a Hollow Knight music box, Undertale's
// "Memory Box" gentleness, a real shanty-nursery tune.
//
// THE TUNE is exported from parts/chapter5.js (LULLABY_A, LULLABY_B,
// LULLABY_OPENING) for the boss theme to twist into the storm and for the
// Lanes to float up from under the water.
//
// 6/8 at 54 dotted quarters a minute (a bar is about 2.2 seconds); one step
// an 8th, six to a bar. The intro plays once (2 bars); then it loops from A,
// 32 bars, about 71 seconds:
//
//   intro   2 bars  the harp rocks alone; the music box drops the tune's
//                   first three notes and stops
//   A       8 bars  THE TUNE on the music box over the rocking harp
//   A2      8 bars  the hum joins, low, under the music box; violas
//   B       8 bars  the lift into F major: the tune climbs and the hum
//                   sings it with the music box
//   A3      8 bars  the tune a last time, the music box only, thinning to
//                   one note; the harp rocks it to sleep and loops

const BAR = 6;
const rest = (bars) => restBars(bars, BAR);
const ROCK = [0, '.', 7, '.', 12, '.'];      // the cradle: root, fifth, octave
const rocking = (chords) => arpeggio(chords, BAR, 3, ROCK);
const TUNE_A = lullaby(LULLABY_A);
const TUNE_B = lullaby(LULLABY_B);
// The last time: the tune thins out, then only its first bar.
const TUNE_A3 = [...TUNE_A.slice(0, 6 * BAR), ...rest(2)];
const fit = (name, section, bars) => tight('Come In, Little Boat', name, section, bars, BAR);

export const CORRIE_LULLABY_THEME = {
  title: 'Come In, Little Boat',
  bpm: 54,
  stepsPerBeat: 3,
  volume: 1.2,

  instruments: {
    box: { sample: 'glock', volume: 0.2, ring: true, reverb: 0.55, pan: 0.15, echo: { time: 0.5, feedback: 0.3, mix: 0.25 }, humanize: { time: 0.008, volume: 0.1 } },
    boxLow: { sample: 'glock', volume: 0.09, ring: true, reverb: 0.6, pan: -0.15, echo: { time: 0.5, feedback: 0.3, mix: 0.2 } },
    harp: { sample: 'harp', volume: 0.2, ring: true, reverb: 0.5, pan: -0.25, humanize: { time: 0.01, volume: 0.18 } },
    hum: { sample: 'choir', volume: 0.13, attack: 0.5, release: 1.0, reverb: 0.7, pan: 0, humanize: { time: 0.01, volume: 0.1 } },
    pad: { sample: 'violas', volume: 0.1, attack: 0.9, release: 1.4, reverb: 0.5, pan: 0.2 },
    pluck: { sample: 'cellosPizz', volume: 0.1, release: 0.2, reverb: 0.3, pan: -0.2 },
  },

  sections: {
    intro: fit('intro', {
      harp: rocking('Dm Dm'),
      box: [...rest(1), '.', '.', midi('F5'), '-', midi('A5'), '-'],
    }, 2),

    A: fit('A', {
      box: transpose(TUNE_A, 12),
      harp: rocking(LULLABY_A_CHORDS),
      pluck: chordLine(LULLABY_A_CHORDS, [0, '.', '.', '.', '.', '.'], 3),
    }, 8),

    A2: fit('A2', {
      box: transpose(TUNE_A, 12),
      hum: transpose(TUNE_A, 0),
      harp: rocking(LULLABY_A_CHORDS),
      pad: sustained(LULLABY_A_CHORDS, BAR, 1, 4),
      pluck: chordLine(LULLABY_A_CHORDS, [0, '.', '.', '.', '.', '.'], 3),
    }, 8),

    B: fit('B', {
      box: transpose(TUNE_B, 12),
      hum: TUNE_B,
      boxLow: transpose(TUNE_B, 0),
      harp: rocking(LULLABY_B_CHORDS),
      pad: sustained(LULLABY_B_CHORDS, BAR, 1, 4),
      pluck: chordLine(LULLABY_B_CHORDS, [0, '.', '.', '.', '.', '.'], 3),
    }, 8),

    A3: fit('A3', {
      box: transpose(TUNE_A3, 12),
      harp: rocking(LULLABY_A_CHORDS),
      pad: [...sustained(LULLABY_A_CHORDS, BAR, 0, 4).slice(0, 6 * BAR), ...rest(2)],
    }, 8),
  },

  order: ['intro', 'A', 'A2', 'B', 'A3'],
  loopFrom: 1,
};
