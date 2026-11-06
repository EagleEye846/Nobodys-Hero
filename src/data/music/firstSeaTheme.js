import {
  BAR_128 as BAR, slow, rest as restBars, held, onNotes, patter, cells,
} from './parts/chapter3.js';
import {
  COAST_CELL, LULLABY_OPENING, lullaby, sustained, scatter, tight,
} from './parts/chapter5.js';

// "All of It, All at Once": the first sight of the sea, from the clifftop
// above Gullrest at the end of Sunnyside (scene first_sight_of_the_sea). The
// camera slides off the cliff and there it is: the whole summer sea, blue
// and glittering, the beach and its bunting far below, and out on the edge
// of things a green smudge of storm with a black tower standing in it.
// Wonder first, and under the wonder, very quietly, the storm.
//
// Built the way Christopher Larkin built Hollow Knight's City of Tears (its
// shape and its sound, not its tune), but sunlit: where the City has rain,
// this has waves. Two harps roll the same three notes, A E B (a stack of
// fifths), up and back like water coming in and going out, every bar of
// the song, while a low harp underneath changes what they mean: over D
// they're bright and open, over G they shimmer, over B minor they ache a
// little. A solo violin sings the tune high where the City's soprano would,
// then the choir takes it, in two long waves. Soft strings, a glass
// glitter now and then like sun on the water. No cellos, no brass, no
// drums: beautiful, never loud.
//
// THE TUNE starts on the chapter's COAST CELL (A D D E, parts/chapter5.js),
// here in D major for the only time: the sea before anything has gone
// wrong with it. In the middle the waves stop, the sea goes still, and a
// music box far off plays the first two bars of Corrie's lullaby ("Come
// In, Little Boat") in D minor, over a B flat that doesn't belong in the
// key. Nobody in the scene knows the tune yet. Then the waves come back.
// Like the City it ends on a chord that doesn't go home: G major, with the
// waves still rolling over it.
//
// D major, rolling 12/8 at 60 dotted quarters a minute (City of Tears'
// pulse), one step an 8th: a bar is 4 seconds. The whole song goes round,
// 44 bars, about 2m56s:
//
//   shore   4 bars  the violas and the choir humming low, then the waves
//                   coming in quietly over the low harp
//   A       8 bars  the tune, high on the solo violin; the choir under it
//   A2      8 bars  the choir takes the tune, the solo violin above it on
//                   long notes, the violins warm: the first wave
//   still   4 bars  the waves stop: the low harp in D minor, the choir
//                   holding on, and far off the lullaby on a music box
//   B       8 bars  the waves come back and it builds: a new tune that
//                   leans on the storm's B flat once, then climbs
//   A3      8 bars  the second wave, the biggest: the whole choir sings the
//                   tune in octaves, the solo violin over them, a soft
//                   piano walking the bass
//   out     4 bars  the waves go on alone over G major, the choir hanging
//                   on it, then nothing

const rest = (bars) => restBars(bars, BAR);
const fit = (name, section, bars) => tight('All of It, All at Once', name, section, bars, BAR);
const up = (steps, semitones) => steps.map((n) => (typeof n === 'number' ? n + semitones : n));

// --- The waves: A E B on the harp, rolling up and back, the same every
// bar of the song. The far harp rolls the other way, a beat behind. ---
const WAVE_CELL = 'A4 E5 B5';
const IN_OUT = [0, '.', 1, '.', 2, '.', '.', '.', 1, '.', '.', '.'];
const OUT_IN = ['.', '.', '.', 2, '.', 1, '.', '.', 0, '.', '.', '.'];
const waves = (bars) => patter(cells(WAVE_CELL, bars), IN_OUT);
const backwash = (bars) => patter(cells(WAVE_CELL, bars), OUT_IN);

// --- The harmony: what the low harp makes of the waves, a bar each. ---
const A_CHORDS = 'D Bm G Em D Bm G A';
const A_BASS = 'D2 B1 G1 E2 D2 B1 G1 A1';
const B_CHORDS = 'G A F#m Bm G A Bb A';
const B_BASS = 'G1 A1 F#1 B1 G1 A1 Bb1 A1';
// The root, and its fifth halfway through the bar, each left to ring.
const LOW = [0, '.', '.', '.', '.', '.', 7, '.', '.', '.', '.', '.'];

// --- The tune (each token a dotted quarter, four to a bar). Bar 1 is the
// coast cell, A D D E; then long notes on the colours the waves make. ---
const TUNE = slow(`
  ${COAST_CELL} | F#5 - - - | E5 - D5 B4 | A4 - - - |
  ${COAST_CELL} | F#5 - A5 B5 | A5 - - F#5 | E5 - - - |
`);
// Over the choir in A2: the solo violin on long notes above it.
const ABOVE = slow(`
  F#5 - - - | D5 - - - | B5 - - - | G5 - - - |
  A5 - - - | D6 - - - | D6 - - B5 | C#6 - - - |
`);
// The middle tune: it climbs, leans once on the storm's B flat (the F
// natural over it), and lands on A, waiting.
const MIDDLE = slow(`
  B4 - D5 - | E5 - C#5 - | F#5 - - E5 | D5 - - - |
  B4 - D5 G5 | F#5 - - E5 | F5 - - D5 | E5 - - - |
`);
// Corrie's lullaby, its first two bars (6/8 bars, two to one of ours), an
// octave up on a music box, a long way off.
const LULLABY = up(lullaby(LULLABY_OPENING), 12);

export const FIRST_SEA_THEME = {
  title: 'All of It, All at Once',
  // City of Tears' own pulse, about 60.
  bpm: 60,
  stepsPerBeat: 3,
  // An area theme: beautiful, never loud.
  volume: 0.8,

  instruments: {
    // The waves: two harps, soft, each note left to ring, one near and one
    // further off the other side. (Not muffled: a muffled harp goes "boing".)
    wavesNear: { sample: 'harp', volume: 0.12, ring: true, reverb: 0.5, pan: 0.25, humanize: { time: 0.012, volume: 0.25 } },
    waves: { sample: 'harp', volume: 0.18, ring: true, reverb: 0.5, pan: 0.25, humanize: { time: 0.012, volume: 0.25 } },
    backwash: { sample: 'harp', volume: 0.09, ring: true, muffle: 3800, reverb: 0.6, pan: -0.3, humanize: { time: 0.015, volume: 0.3 } },
    // A soft piano on the waves with the harp, as in the City.
    shine: { sample: 'grandPiano', volume: 0.06, ring: true, muffle: 3000, reverb: 0.5, pan: -0.1, humanize: { time: 0.014, volume: 0.25 } },
    // Sun on the water: a glass note now and then.
    glitter: { sample: 'glass', volume: 0.07, ring: true, reverb: 0.65, pan: 0.35, humanize: { time: 0.02, volume: 0.3 } },
    // The low harp that changes what the waves mean.
    // (An octave up: the harp's lowest strings went "boing".)
    low: { sample: 'harp', volume: 0.2, ring: true, octave: 1, reverb: 0.45, pan: -0.15, humanize: { time: 0.012, volume: 0.1 } },
    // Soft strings, bowed so quietly they're mostly air: the surf breathing.
    violas: { sample: 'violas', volume: 0.12, attack: 1.8, release: 2.2, muffle: 2600, reverb: 0.55, pan: -0.2 },
    violins: { sample: 'violins', volume: 0.11, attack: 1.6, release: 2, muffle: 3200, reverb: 0.55, pan: 0.25 },
    // Where the soprano sings in the City: a solo violin, high.
    voice: { sample: 'soloViolin', volume: 0.16, attack: 0.6, release: 1.6, muffle: 4800, reverb: 0.6, pan: 0.05, humanize: { time: 0.015, volume: 0.1 } },
    // The choir humming at the very start, barely there.
    hum: { sample: 'choir', volume: 0.1, attack: 3, release: 2.5, muffle: 2200, reverb: 0.55, pan: -0.1 },
    // The choir, singing "ah": three parts holding the chords, slow to swell.
    choirLow: { sample: 'choir', volume: 0.22, attack: 1.8, release: 2.2, muffle: 2600, reverb: 0.55, pan: -0.25 },
    choirMid: { sample: 'choir', volume: 0.2, attack: 1.8, release: 2.2, muffle: 2600, reverb: 0.55, pan: 0.05 },
    choirHigh: { sample: 'choir', volume: 0.17, attack: 2, release: 2.4, muffle: 3000, reverb: 0.55, pan: 0.3 },
    // The choir singing the tune; in the second wave the low voices take it
    // an octave down and the sopranos sing it where it was.
    sing: { sample: 'choir', volume: 0.32, attack: 0.5, release: 1.6, muffle: 3000, reverb: 0.55, pan: -0.05, humanize: { time: 0.015, volume: 0.08 } },
    sopranos: { sample: 'choir', volume: 0.22, attack: 0.6, release: 1.8, muffle: 3400, reverb: 0.55, pan: 0.15, humanize: { time: 0.015, volume: 0.08 } },
    // A soft piano under the low harp in the second wave, walking the bass.
    piano: { sample: 'grandPiano', volume: 0.11, ring: true, muffle: 2000, reverb: 0.45, pan: -0.2, humanize: { time: 0.012, volume: 0.12 } },
    // Corrie's lullaby, far off: a music box with a long echo.
    box: { sample: 'glock', volume: 0.1, ring: true, muffle: 3500, reverb: 0.7, pan: 0.3, echo: { time: 0.5, feedback: 0.3, mix: 0.3 } },
  },

  sections: {
    // It starts with only the violas and the choir humming low; then the
    // waves come in quietly, and the low harp under them.
    shore: fit('shore', {
      violas: [...rest(1), ...held('A3', 3 * BAR)],
      hum: [...held('D3', 2 * BAR), ...rest(2)],
      wavesNear: [...rest(2), ...waves(2)],
      low: [...rest(2), ...onNotes('D2 G1', LOW)],
    }, 4),

    // The tune on the solo violin over the waves, which come the rest of the
    // way in halfway through; the choir comes in low under it.
    A: fit('A', {
      voice: up(TUNE, 12),
      sing: [...rest(4), ...TUNE.slice(4 * BAR)],
      wavesNear: [...waves(4), ...rest(4)],
      waves: [...rest(4), ...waves(4)],
      shine: [...rest(4), ...waves(4)],
      low: onNotes(A_BASS, LOW),
      violas: sustained(A_CHORDS, BAR, 0, 3),
      choirLow: [...rest(4), ...sustained('D Bm G A', BAR, 0, 3)],
      glitter: scatter(8, BAR, [[1, 4, 'B6'], [5, 4, 'F#6']]),
    }, 8),

    // The first wave: the choir takes the tune, the solo violin holds long
    // notes above, the backwash and the violins join a few bars in.
    A2: fit('A2', {
      shine: waves(8),
      sing: TUNE,
      voice: ABOVE,
      waves: waves(8),
      backwash: [...rest(2), ...backwash(6)],
      low: onNotes(A_BASS, LOW),
      violas: sustained(A_CHORDS, BAR, 0, 3),
      violins: [...rest(2), ...sustained('G Em D Bm G A', BAR, 1, 4)],
      choirLow: sustained(A_CHORDS, BAR, 0, 3),
      choirHigh: [...rest(4), ...sustained('D Bm G A', BAR, 2, 4)],
      glitter: scatter(8, BAR, [[2, 4, 'B6'], [4, 0, 'A6'], [6, 4, 'F#6']]),
    }, 8),

    // The sea goes still. The low harp turns to D minor and the storm's B
    // flat, the choir holds on, and a long way off a music box plays the
    // first of Corrie's lullaby.
    still: fit('still', {
      low: onNotes('D2 Bb1 G1 A1', LOW),
      box: [...LULLABY, ...rest(2)],
      choirLow: [...held('D3', 2 * BAR), ...held('D3', BAR), ...held('C#3', BAR)],
      choirHigh: [...held('A4', 2 * BAR), ...held('Bb4', BAR), ...held('A4', BAR)],
      violas: [...rest(2), ...held('F3', BAR), ...held('E3', BAR)],
    }, 4),

    // The waves come back, far off first, and it builds: the middle tune on
    // the solo violin, the choir filling out a part at a time, the violins
    // last, into the second wave.
    B: fit('B', {
      backwash: [...backwash(3), ...rest(5)],
      wavesNear: [...rest(1), ...waves(2), ...rest(5)],
      waves: [...rest(3), ...waves(5)],
      shine: [...rest(3), ...waves(5)],
      voice: MIDDLE,
      low: onNotes(B_BASS, LOW),
      violas: sustained(B_CHORDS, BAR, 2, 3),
      choirLow: sustained(B_CHORDS, BAR, 0, 3),
      choirMid: [...rest(2), ...sustained('F#m Bm G A Bb A', BAR, 1, 3)],
      choirHigh: [...rest(5), ...sustained('A Bb A', BAR, 2, 4)],
      violins: [...rest(4), ...sustained('G A Bb A', BAR, 1, 4)],
    }, 8),

    // The second wave, the biggest: the whole choir sings the tune in
    // octaves, the solo violin over them, the bass walking.
    A3: fit('A3', {
      shine: waves(8),
      sing: up(TUNE, -12),
      sopranos: TUNE,
      voice: ABOVE,
      waves: waves(8),
      backwash: backwash(8),
      low: onNotes(A_BASS, LOW),
      piano: onNotes('D3 B2 G2 E3 D3 B2 G2 A2', LOW),
      violas: sustained(A_CHORDS, BAR, 0, 3),
      violins: sustained(A_CHORDS, BAR, 1, 4),
      choirLow: sustained(A_CHORDS, BAR, 0, 3),
      choirMid: sustained(A_CHORDS, BAR, 1, 3),
      choirHigh: sustained(A_CHORDS, BAR, 2, 4),
      glitter: scatter(8, BAR, [[0, 4, 'A6'], [3, 4, 'B6'], [5, 0, 'F#6'], [7, 4, 'E6']]),
    }, 8),

    // The waves go on alone over G major (brighter, and not home), the choir
    // hanging on it, thinning to one harp, then nothing.
    out: fit('out', {
      waves: [...waves(2), ...rest(2)],
      wavesNear: [...rest(2), ...waves(1), ...rest(1)],
      low: [...onNotes('G1 G1', LOW), ...rest(2)],
      choirLow: [...held('G3', 3 * BAR), ...rest(1)],
      choirMid: [...held('B3', 3 * BAR), ...rest(1)],
      choirHigh: [...held('D4', 3 * BAR), ...rest(1)],
      violas: [...held('D3', 2 * BAR), ...rest(2)],
      glitter: scatter(4, BAR, [[1, 4, 'B6']]),
    }, 4),
  },

  // The whole song goes round.
  order: ['shore', 'A', 'A2', 'still', 'B', 'A3', 'out'],
  loopFrom: 0,
};
