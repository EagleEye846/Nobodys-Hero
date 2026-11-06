import { sustained } from '../../audio/notation.js';
import {
  BAR_128 as BAR, slow, rest as restBars, held, midi, onNotes, patter, cells, drops,
} from './parts/chapter3.js';

// "Counting Days": the theme of the Deep, the dark bottom of the buried
// kingdom, where the Hero was alone for a long time, a long time ago. The
// last stretch of Chapter 4: rooms where you can only see as far as your
// light, a cold campfire ring, marks scratched in the rock in fives, one
// word over and over (STAY). Never horror: nothing here is chasing you. It
// is lonely, and it is sad the way rain on a window is sad.
//
// Built the way Christopher Larkin built Hollow Knight's City of Tears (its
// shape and its sound, not its tune): rain that never stops, a choir, and
// two long waves. Little harp figures fall, two notes and two notes, like
// drops off the roof of a cave, the same three notes all the way through
// (C G D, a stack of fifths), while a low harp under them changes what they
// mean. A choir sings "ah" under everything, then takes the tune. It swells
// once, drops away to almost nothing (only the rain and one voice), then
// swells again, bigger, the whole choir in octaves with a solo violin over
// it, and fades. Like the City it ends on a brighter chord that doesn't
// resolve: G major, hanging. Soft strings, violins and violas bowed so
// quietly they're mostly air. Everything a little dampened (muffled), close
// and dry rather than spacious: no echoes, no glassy tones. No cellos, no
// drums, no brass.
//
// THE CHAPTER'S TUNE (the "first cell", parts/chapter4.js): G C Eb D, up a
// fourth, up a minor third, one step down. It's the first bar of the tune,
// plain and slow, and it comes back slower still in the sad part. At the
// end the drops stop and a harp plays one note three times, a long way
// apart: STAY, STAY, STAY.
//
// C minor, rolling 12/8 at 60 dotted quarters a minute (City of Tears' pulse), one step an 8th: a
// bar is 4 seconds. The whole song goes round, 44 bars, about 2m56s:
//
//   drip    4 bars  the violas and the choir humming low, then the rain
//                   coming in quietly over the low harp
//   A       8 bars  the tune, high on the solo violin; the choir comes in
//                   under it, low, and the violas breathe
//   A2      8 bars  the choir takes the tune, the solo violin above it on
//                   long notes, the violins warm: the first wave
//   hush    4 bars  it all drops away: only the rain, the low harp, and
//                   one high choir voice holding on
//   B       8 bars  the sad part and the build: the cell slower on the
//                   solo violin, the choir filling out a part at a time,
//                   the violins last, a harp rising into the second wave
//   A3      8 bars  the second wave, the biggest: the whole choir sings the
//                   tune in octaves, the solo violin over them, the low
//                   harp and a soft piano walking the bass
//   stay    4 bars  the drops stop: one harp note three times, the choir
//                   left hanging on G major, then nothing

const rest = (bars) => restBars(bars, BAR);
// Fails loudly if a section's tracks are not all the same whole number of bars.
const tight = (name, section, bars) => {
  for (const [track, steps] of Object.entries(section)) {
    if (steps.length !== bars * BAR) throw new Error(`Counting Days ${name}: '${track}' is ${steps.length} steps, not ${bars} bars`);
  }
  return section;
};
// A note, or a few, placed on given steps of a stretch of bars; rest silent.
const up = (steps, semitones) => steps.map((n) => (typeof n === 'number' ? n + semitones : n));
const placed = (bars, notes) => {
  const out = rest(bars);
  for (const [step, note] of Object.entries(notes)) out[Number(step)] = midi(note);
  return out;
};

// --- The drops: C G D on the harp, falling in pairs (D G, C ... D G, C),
// the same every bar of the song. ---
const DROP_CELL = 'C5 G5 D6';
const FALL = [2, '.', 1, 0, '.', '.', 2, '.', 1, 0, '.', '.'];
const fall = (bars) => patter(cells(DROP_CELL, bars), FALL);

// --- The harmony: what the low harp makes of the drops, a bar each. ---
const A_CHORDS = 'Cm Ab Eb Bb Cm Ab Fm G';
const A_BASS = 'C2 Ab1 Eb2 Bb1 C2 Ab1 F1 G1';
const B_CHORDS = 'Ab Eb Fm Cm Ab Bb Eb G';
const B_BASS = 'Ab1 G1 F1 C2 Ab1 Bb1 Eb2 G1';
// The root, and its fifth halfway through the bar, each left to ring.
const LOW = [0, '.', '.', '.', '.', '.', 7, '.', '.', '.', '.', '.'];

// --- The tune (each token a dotted quarter, four to a bar). Bar 1 is the
// cell, G C Eb D; then long notes on the colours the drops make. ---
const TUNE = slow(`
  G4 C5 Eb5 D5 | C5 - - - | G4 - Bb4 D5 | C5 - - - |
  G4 C5 Eb5 G5 | G5 - - F5 | Ab5 - G5 F5 | D5 - - - |
`);
// Over the violins in A2: the solo violin on long notes above them.
const ABOVE = slow(`
  G5 - - - | Eb5 - - - | G5 - - - | F5 - - - |
  G5 - - - | C6 - - - | C6 - - Ab5 | B5 - - - |
`);
// The sad part: the cell again, slower and higher, then home through B flat.
const SAD = slow(`
  Eb5 - Ab5 - | C6 - Bb5 - | Ab5 - G5 F5 | Eb5 - - D5 |
  C5 - Eb5 G5 | F5 - - D5 | Bb5 - - G5 | D5 - C5 B4 |
`);

export const DEEP_THEME = {
  title: 'Counting Days',
  // City of Tears' own pulse, about 60.
  bpm: 60,
  stepsPerBeat: 3,
  // An area theme: beautiful, never loud.
  volume: 0.8,

  instruments: {
    // The drops: a harp, soft, each note left to ring. They start quiet and
    // come closer. (Not muffled: a muffled harp goes "boing".)
    dropsNear: { sample: 'harp', volume: 0.11, ring: true, reverb: 0.45, pan: 0.2, humanize: { time: 0.012, volume: 0.25 } },
    drops: { sample: 'harp', volume: 0.18, ring: true, muffle: 3500, reverb: 0.45, pan: 0.2, humanize: { time: 0.012, volume: 0.25 } },
    // A soft piano on the rain with the harp, as in the City.
    rain: { sample: 'grandPiano', volume: 0.07, ring: true, muffle: 2600, reverb: 0.45, pan: -0.1, humanize: { time: 0.014, volume: 0.25 } },
    // The low harp that changes what the drops mean.
    // (An octave up: the harp's lowest strings went "boing".)
    low: { sample: 'harp', volume: 0.2, ring: true, octave: 1, reverb: 0.4, pan: -0.15, humanize: { time: 0.012, volume: 0.1 } },
    // A harp rising into the second wave.
    rise: { sample: 'harp', volume: 0.16, ring: true, muffle: 3000, reverb: 0.45, pan: -0.1, humanize: { time: 0.01, volume: 0.1 } },
    // Soft strings: violins and violas bowed so quietly they're mostly air.
    violas: { sample: 'violas', volume: 0.13, attack: 1.8, release: 2.2, muffle: 2500, reverb: 0.5, pan: -0.2 },
    violins: { sample: 'violins', volume: 0.12, attack: 1.6, release: 2, muffle: 3000, reverb: 0.5, pan: 0.25 },
    // Where the soprano sings in the City: a solo violin, high.
    voice: { sample: 'soloViolin', volume: 0.16, attack: 0.6, release: 1.6, muffle: 4500, reverb: 0.55, pan: 0.05, humanize: { time: 0.015, volume: 0.1 } },
    // STAY: one harp note.
    stay: { sample: 'harp', volume: 0.24, ring: true, muffle: 2500, reverb: 0.5 },
    // The choir humming at the very start, barely there.
    hum: { sample: 'choir', volume: 0.1, attack: 3, release: 2.5, muffle: 2000, reverb: 0.5, pan: -0.1 },
    // The choir, singing "ah": three parts holding the chords, slow to swell.
    choirLow: { sample: 'choir', volume: 0.24, attack: 1.8, release: 2.2, muffle: 2400, reverb: 0.5, pan: -0.25 },
    choirMid: { sample: 'choir', volume: 0.22, attack: 1.8, release: 2.2, muffle: 2400, reverb: 0.5, pan: 0.05 },
    choirHigh: { sample: 'choir', volume: 0.19, attack: 2, release: 2.4, muffle: 2800, reverb: 0.5, pan: 0.3 },
    // The choir singing the tune; in the second wave the low voices take it
    // an octave down and the sopranos sing it where it was.
    sing: { sample: 'choir', volume: 0.34, attack: 0.5, release: 1.6, muffle: 2800, reverb: 0.5, pan: -0.05, humanize: { time: 0.015, volume: 0.08 } },
    sopranos: { sample: 'choir', volume: 0.24, attack: 0.6, release: 1.8, muffle: 3200, reverb: 0.5, pan: 0.15, humanize: { time: 0.015, volume: 0.08 } },
    // A soft piano under the low harp in the second wave, walking the bass.
    piano: { sample: 'grandPiano', volume: 0.12, ring: true, muffle: 1800, reverb: 0.45, pan: -0.2, humanize: { time: 0.012, volume: 0.12 } },
  },

  sections: {
    // It starts with only the violas and the choir humming low; then the
    // rain comes in quietly, and the low harp under it.
    drip: tight('drip', {
      violas: [...rest(1), ...held('G3', 3 * BAR)],
      hum: [...held('C3', 2 * BAR), ...rest(2)],
      dropsNear: [...rest(2), ...fall(2)],
      low: [...rest(2), ...onNotes('C2 Ab1', LOW)],
    }, 4),

    // The tune on the solo violin over the drops, which come the rest of the
    // way in halfway through; the choir comes in low under it.
    A: tight('A', {
      voice: up(TUNE, 12),
      sing: [...rest(4), ...TUNE.slice(4 * BAR)],
      dropsNear: [...fall(4), ...rest(4)],
      drops: [...rest(4), ...fall(4)],
      rain: [...rest(4), ...fall(4)],
      low: onNotes(A_BASS, LOW),
      violas: sustained(A_CHORDS, BAR, 0, 3),
      choirLow: [...rest(4), ...sustained('Cm Ab Fm G', BAR, 0, 3)],
    }, 8),

    // The first wave: the choir takes the tune, the solo violin holds long
    // notes above, the violins and the high voices join a few bars in.
    A2: tight('A2', {
      rain: fall(8),
      sing: TUNE,
      voice: ABOVE,
      drops: fall(8),
      low: onNotes(A_BASS, LOW),
      violas: sustained(A_CHORDS, BAR, 0, 3),
      violins: [...rest(2), ...sustained('Eb Bb Cm Ab Fm G', BAR, 1, 4)],
      choirLow: sustained(A_CHORDS, BAR, 0, 3),
      choirHigh: [...rest(4), ...sustained('Cm Ab Fm G', BAR, 2, 4)],
    }, 8),

    // It all drops away: the drops far off again, the low harp, one high
    // voice holding on.
    hush: tight('hush', {
      dropsNear: fall(4),
      low: onNotes('C2 Ab1 Eb2 G1', LOW),
      choirHigh: [...held('G4', 2 * BAR), ...held('Ab4', BAR), ...held('G4', BAR)],
    }, 4),

    // The sad part, and the build: the cell slower on the solo violin, the
    // drops coming back in, the choir filling out a part at a time, the
    // violins last, and a harp rising up into the second wave.
    B: tight('B', {
      rain: fall(8),
      voice: SAD,
      dropsNear: [...fall(3), ...rest(5)],
      drops: [...rest(3), ...fall(5)],
      low: onNotes(B_BASS, LOW),
      violas: sustained(B_CHORDS, BAR, 2, 3),
      choirLow: sustained(B_CHORDS, BAR, 0, 3),
      choirMid: [...rest(2), ...sustained('Fm Cm Ab Bb Eb G', BAR, 1, 3)],
      choirHigh: [...rest(5), ...sustained('Bb Eb G', BAR, 2, 4)],
      violins: [...rest(4), ...sustained('Ab Bb Eb G', BAR, 1, 4)],
      rise: placed(8, { [7 * BAR]: 'G3', [7 * BAR + 2]: 'B3', [7 * BAR + 4]: 'D4', [7 * BAR + 6]: 'G4', [7 * BAR + 8]: 'B4', [7 * BAR + 10]: 'D5' }),
    }, 8),

    // The second wave, the biggest: the whole choir sings the tune in
    // octaves, the solo violin over them, the bass walking.
    A3: tight('A3', {
      rain: fall(8),
      sing: up(TUNE, -12),
      sopranos: TUNE,
      voice: ABOVE,
      drops: fall(8),
      low: onNotes(A_BASS, LOW),
      piano: onNotes('C3 Ab2 Eb3 Bb2 C3 Ab2 F2 G2', LOW),
      violas: sustained(A_CHORDS, BAR, 0, 3),
      violins: sustained(A_CHORDS, BAR, 1, 4),
      choirLow: sustained(A_CHORDS, BAR, 0, 3),
      choirMid: sustained(A_CHORDS, BAR, 1, 3),
      choirHigh: sustained(A_CHORDS, BAR, 2, 4),
    }, 8),

    // The drops stop. One note, three times, a long way apart; the choir
    // left hanging on G major (brighter, and not home); then nothing.
    stay: tight('stay', {
      stay: placed(4, { 0: 'G4', [BAR + 6]: 'G4', [2 * BAR + 9]: 'G4' }),
      low: placed(4, { 0: 'G1' }),
      choirLow: [...held('G3', 3 * BAR), ...rest(1)],
      choirMid: [...held('B3', 3 * BAR), ...rest(1)],
      choirHigh: [...held('D4', 3 * BAR), ...rest(1)],
      violas: [...held('D3', 2 * BAR), ...rest(2)],
    }, 4),
  },

  // The whole song goes round.
  order: ['drip', 'A', 'A2', 'hush', 'B', 'A3', 'stay'],
  loopFrom: 0,
};
