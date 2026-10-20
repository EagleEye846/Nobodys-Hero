import { chordLine, sustained, arpeggio, melody } from '../../audio/notation.js';
import { CHOIR, SOPRANO } from '../../audio/instruments.js';
import {
  BAR_128 as BAR, slow, rest as restBars, held, until as untilBars, FANFARE_D, repeat, transpose, midi,
  onNotes, heldNotes, patter, cells, drops,
} from './parts/chapter3.js';

// "What They Built for Him": the theme of the Hollow Valley's dead city,
// Chapter 3's third region: the drowned forum, the fallen aqueduct, the
// Hero's Gate. A lowland city the prophecy was supposed to end in, built to
// greet a Hero who never came, and half sunk now. Written the way
// Christopher Larkin wrote Hollow Knight's City of Tears: a close piano
// patters three notes, D A E, a stack of fifths, all the way through, like
// rain on stone, and never changes. Only the bass moves, so the same rain
// keeps turning into new chords: G (the Lydian colour, the major seventh on
// top), D over F#, B minor 11, C (the borrowed flat seventh), E minor, and
// F# minor with the flat sixth hanging over it, the lament. The tune sits on
// those colours in long notes and never comes home. Inside (a tower, a
// station) it's the piano, the harp and one low string; step outside and the
// strings, a choir and a soprano swell up over the rain. Then the Long
// Stair's fanfare ("The Long Stair", stairTheme.js), the one the mountain
// played for his coming, on a far trumpet at a third of its speed, over the
// city's chords instead of its own; and for eight bars its answer, as the
// city meant it, in D major on the soprano and violins. Rolling 12/8 at 60
// dotted quarters a minute, one step an 8th. The rain plays once (16s); then
// it loops from A, 40 bars, 2m40s:
//
//   rain      4 bars  the piano rain alone, water dripping, a low D
//   A         8 bars  inside: the tune low on a viola's voice (the solo
//                     violin), the harp on the beats, the bass walking
//   A2        8 bars  outside: the soprano sings the tune's second verse,
//                     violins and choir swell, the cellos answer
//   fallen    8 bars  the fanfare on a far trumpet, a heartbeat under it
//   glimpse   8 bars  its answer in D major, soprano and violins, the harp
//                     rippling: what they built for him; and back to F#m
//   A3        8 bars  the tune with everything; then only the rain

// In 12/8 a bar is 12 steps.
const rest = (bars) => restBars(bars, BAR);
const until = (bars, track) => untilBars(bars, track, BAR);

const PATTER_CELL = 'D5 A5 E6';
// The rain in 8ths: low, top, middle, top; in fours against the 12/8's
// threes, so it never quite lines up with the beat.
const PATTER = [0, 2, 1, 2, 0, 2, 1, 2, 0, 2, 1, 2];
// The harp: the same three notes, low, one to a beat.
const HARP_CELL = 'D4 A4 E5';
const PLUCK = [0, '-', '-', 2, '-', '-', 1, '-', '-', 2, '-', '-'];
const rain = (bars) => patter(cells(PATTER_CELL, bars), PATTER);
const plucks = (bars) => patter(cells(HARP_CELL, bars), PLUCK);

// --- The harmony: what the bass makes of the rain, a bar each. ---
const A_BASS = 'G2 F#2 B1 C2 G2 F#2 E2 F#2';
const A_CHORDS = 'G D Bm C G D Em F#m';
const FALLEN_BASS = 'B1 G2 E2 F#2 D2 G2 B1 F#2';
const FALLEN_CHORDS = 'Bm G Em F#m D G Bm F#m';
const GLIMPSE_BASS = 'D2 F#2 G2 C2 E2 A1 C2 F#2';
const GLIMPSE_CHORDS = 'D D G C Em A C F#m';
// The left hand: the root, and its octave halfway through the bar.
const LEFT = [0, '-', '-', '-', '-', '-', 12, '-', '-', '-', '-', '-'];
const ONE = [0, ...Array(BAR - 1).fill('.')];
// The harp's ripple for the outside parts.
const RIPPLE = [0, 7, 12, 'tenth', 12, 7, 0, 7, 12, 'tenth', 19, 12];
// A heartbeat on the timpani's low B: long, short, once a bar.
const HEART = [midi('B2'), '.', '.', '.', '.', midi('B2'), ...Array(BAR - 6).fill('.')];

// --- The tune, in long notes (each token a dotted quarter): F# over G (the
// major 7th), E over D (the 9th), C# over B minor (the 9th)... down to C#
// over F# minor, the fifth, left open. ---
const TUNE = slow(`
  F#5 - - - | E5 - D5 - | C#5 - - D5 | E5 - - - |
  F#5 - G5 - | F#5 - E5 - | D5 - C#5 B4 | C#5 - - - |
`);
// Its second verse, from the octave: B over G, and F# over C, the sharp
// eleventh, the Lydian light City of Tears is known for.
const TUNE_HIGH = slow(`
  B5 - - - | A5 - G5 - | F#5 - - E5 | F#5 - - - |
  G5 - - A5 | B5 - A5 - | G5 - F#5 E5 | F#5 - - - |
`);
// The cellos' answer under the second verse: the tune's opening, low.
const CELLO_ANSWER = [...rest(4), ...transpose(TUNE.slice(0, 4 * BAR), -24)];
// The fanfare, each of its 8ths stretched to a dotted quarter.
const FANFARE_SLOW = melody(FANFARE_D, 3);
const FANFARE_ANSWER = melody('A4 - D5 - F#5 - A5 - | B5 - A5 - G5 - E5 - | G5 - F#5 - E5 - D5 - | E5 - - - - - . .', 3);

export const VALLEY_THEME = {
  title: 'What They Built for Him',
  bpm: 60,
  stepsPerBeat: 3,
  volume: 0.7,

  instruments: {
    // The rain: a close piano, soft, pedal half down.
    rain: { sample: 'piano', volume: 0.24, release: 1.1, reverb: 0.55, pan: 0.15, humanize: { time: 0.01, volume: 0.22 } },
    left: { sample: 'piano', volume: 0.3, ring: true, reverb: 0.5, pan: -0.1, humanize: { time: 0.01, volume: 0.12 } },
    drops: { sample: 'piano', volume: 0.16, ring: true, reverb: 0.7, pan: -0.45, humanize: { time: 0.03, volume: 0.3 } },
    harp: { sample: 'harp', volume: 0.26, ring: true, reverb: 0.55, pan: -0.3, humanize: { time: 0.015, volume: 0.2 } },
    // A viola's voice: the solo violin, low, slow bow.
    viola: { sample: 'soloViolin', volume: 0.36, attack: 0.12, release: 0.8, reverb: 0.55, pan: 0.1, humanize: { time: 0.015, volume: 0.1 } },
    soprano: { ...SOPRANO, volume: 0.13 },
    violins: { sample: 'violins', volume: 0.24, attack: 0.35, release: 1, reverb: 0.55, pan: 0.25 },
    cellos: { sample: 'cellos', volume: 0.3, attack: 0.25, release: 1, reverb: 0.5, pan: -0.25, humanize: { time: 0.015, volume: 0.1 } },
    drone: { sample: 'cellos', volume: 0.24, attack: 1.5, release: 2, reverb: 0.5, pan: -0.1 },
    basses: { sample: 'bassSpic', volume: 0.26, release: 0.6, reverb: 0.4, humanize: { time: 0.01, volume: 0.15 } },
    // The fanfare, from far off: a trumpet, soft, mostly hall.
    trumpet: { sample: 'trumpet', volume: 0.2, attack: 0.08, release: 0.8, reverb: 0.7, pan: 0.35, humanize: { time: 0.01, volume: 0.1 } },
    choir: { ...CHOIR, volume: 0.04, attack: 1.4, release: 1.8, reverb: 0.7 },
    timpani: { sample: 'timpani', volume: 0.26, ring: true, reverb: 0.45 },
  },

  sections: {
    // The rain alone, a drip or two, and a low D under it.
    rain: {
      rain: [...rest(1), ...rain(3)],
      drops: drops('D D D D', BAR, 0.12, 9, 1),
      drone: held(midi('D2'), 4 * BAR),
    },

    // Inside: the tune low on the viola, the harp on the beats, the left
    // hand walking the bass that turns the rain into chords.
    A: {
      rain: rain(8),
      left: onNotes(A_BASS, LEFT),
      harp: plucks(8),
      viola: transpose(TUNE, -12),
      drops: drops(A_CHORDS, BAR, 0.04, 4, 1),
    },

    // Outside: the soprano sings the second verse; violins on the first
    // verse under her, the harp rippling, the choir far back, the cellos
    // answering with the tune's opening.
    A2: {
      rain: rain(8),
      left: onNotes(A_BASS, LEFT),
      soprano: TUNE_HIGH,
      violins: TUNE,
      cellos: CELLO_ANSWER,
      harp: arpeggio(A_CHORDS, BAR, 3, RIPPLE),
      choir: sustained(A_CHORDS, BAR, 1, 4),
      basses: onNotes(A_BASS, ONE),
    },

    // The fanfare, fallen: the Long Stair's tune on a far trumpet, a third
    // of its speed, over the city's minor; the rain goes on, a heartbeat.
    fallen: {
      rain: rain(8),
      left: onNotes(FALLEN_BASS, LEFT),
      trumpet: FANFARE_SLOW,
      violins: sustained(FALLEN_CHORDS, BAR, 1, 4),
      cellos: heldNotes(FALLEN_BASS, BAR, 1),
      choir: sustained(FALLEN_CHORDS, BAR, 2, 3),
      harp: plucks(8),
      timpani: repeat(HEART, 8),
    },

    // What they built: the fanfare's answer in D major on the soprano and
    // violins, cellos an octave under, the harp rippling, the choir; then
    // C, and F# minor, and the rain is all there is again.
    glimpse: {
      rain: rain(8),
      left: onNotes(GLIMPSE_BASS, LEFT),
      soprano: FANFARE_ANSWER,
      violins: FANFARE_ANSWER,
      cellos: transpose(FANFARE_ANSWER, -24),
      harp: arpeggio(GLIMPSE_CHORDS, BAR, 3, RIPPLE),
      choir: sustained(GLIMPSE_CHORDS, BAR, 1, 4),
      basses: onNotes(GLIMPSE_BASS, ONE),
    },

    // The tune once more with everything: the soprano on the high verse,
    // violins and viola on the low one; the last two bars only the rain.
    A3: {
      rain: rain(8),
      left: onNotes(A_BASS, LEFT),
      soprano: until(6, TUNE_HIGH),
      violins: until(6, TUNE),
      viola: until(6, transpose(TUNE, -12)),
      cellos: until(6, heldNotes(A_BASS, BAR, 1)),
      harp: until(6, arpeggio(A_CHORDS, BAR, 3, RIPPLE)),
      choir: until(6, sustained(A_CHORDS, BAR, 1, 4)),
      basses: until(6, onNotes(A_BASS, ONE)),
      drops: [...rest(6), ...drops('Em F#m', BAR, 0.16, 6, 1)],
    },
  },

  // The rain plays once; then the city goes round from A.
  order: ['rain', 'A', 'A2', 'fallen', 'glimpse', 'A3'],
  loopFrom: 1,
};
