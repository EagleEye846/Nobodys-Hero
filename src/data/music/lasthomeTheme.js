import { sustained, hits } from '../../audio/notation.js';
import { FLUTE, BELLS, CHOIR } from '../../audio/instruments.js';
import {
  BAR_128 as BAR, slow, rest as restBars, held, repeat, transpose, midi,
  onNotes, heldNotes, patter, cells, drops,
} from './parts/chapter3.js';

// "The Ones Who Stopped Waiting": the theme of the living town inside the
// Hollow Valley's ruins (Lasthome, or whatever it ends up called), Chapter
// 3's hub. The people who fell out of the heralds' story generations ago and
// went down the far side of the mountain to live: a market, an inn, a
// healer, a chapel with no bell. Lamplit like Heralds' Rest but lower,
// warmer, more tired. Written the way Christopher Larkin wrote Hollow
// Knight's City of Tears, but from indoors, the way the city sounds from
// inside a tower: a felted piano patters C G D, a stack of fifths, all the
// way through and never changes, and the bass turns it into City of Tears'
// own chords, carried into C: F with the ninth, C over E, A minor 11, B flat
// (the borrowed flat seventh, the Mixolydian warmth), G. The tune is plain
// enough to hum, opens with a step the way town tunes do, and is passed
// round: the piano, then a fiddle with a low whistle a third beneath it. In
// the sad part, A minor, the rain becomes A flat with a sharp eleventh and
// B flat, the bVI-bVII-I that ends every triumphant game tune, used tenderly
// here as the way home. It's the only tune in the chapter that does come
// home. Then the rain stops, and a music box starts the prophecy's tune
// ("Once, a Promise", prophecyTheme.js) and stops halfway through it. They
// stopped waiting. Rolling 12/8 at 58 dotted quarters a minute, one step an
// 8th. The lamps play once (17s); then it loops from the tune, 36 bars,
// about 2m29s:
//
//   lamps   4 bars  the piano's rain alone, a lamp flickering
//   A       8 bars  the tune on the piano over the rain
//   A2      8 bars  the fiddle takes it, the whistle a third below for its
//                   second half, the cellos warm, a soft knock
//   B       8 bars  the sad part, A minor: piano and cellos, the choir
//                   humming, home through Ab and Bb
//   hush    4 bars  the rain stops: the prophecy on a music box, cut off
//   A3      8 bars  the tune, fiddle and whistle together, the horn under

// In 12/8 a bar is 12 steps.
const rest = (bars) => restBars(bars, BAR);

// The rain: C G D on a felted piano, in threes.
const RAIN_CELL = 'C5 G5 D6';
const RAIN = [0, 2, 1, 0, 2, 1, 0, 2, 1, 0, 2, 1];
const rain = (bars) => patter(cells(RAIN_CELL, bars), RAIN);

// --- The harmony: what the bass makes of the rain, a bar each. ---
const A_BASS = 'F2 E2 A1 Bb1 F2 C2 G1 C2';
const A_CHORDS = 'F C Am Bb F C G C';
const B_BASS = 'A1 D2 A1 C2 F2 C2 Ab1 Bb1';
const B_CHORDS = 'Am Dm Am C F C Ab Bb';
// The left hand: the root, leaning onto its fifth halfway through.
const LEFT = [0, '-', '-', '-', '-', '-', 7, '-', '-', '-', '-', '-'];
const KNOCK = hits('...x.....x..');

// --- The tune (each token a dotted quarter). Up a step and a third, back,
// down to the second; then higher, and home. ---
const TUNE = slow(`
  E4 G4 A4 G4 | E4 - D4 - | C4 D4 E4 G4 | D4 - - - |
  E4 G4 A4 C5 | B4 - A4 G4 | F4 E4 D4 E4 | C4 - - - |
`);
// The whistle a third under the tune's second half (in the key, not strict).
const THIRD_BELOW = slow('C4 E4 F4 A4 | G4 - F4 E4 | D4 C4 B3 C4 | E4 - - - ');
// The sad part: A minor, and home through Ab and Bb.
const SAD = slow(`
  A4 - G4 E4 | F4 - E4 D4 | E4 - - - | . C4 D4 E4 |
  F4 - G4 A4 | G4 - F4 E4 | Ab4 - G4 F4 | G4 - F4 - |
`);
// The prophecy's tune, A minor, that stops halfway: two bars, then nothing.
const PROPHECY_CUT = [...slow('. E5 - A5 | C6 - B5 A5'), ...rest(2)];

export const LASTHOME_THEME = {
  title: 'The Ones Who Stopped Waiting',
  bpm: 58,
  stepsPerBeat: 3,
  volume: 0.7,

  instruments: {
    // The rain: a felted piano, close, soft.
    rain: { sample: 'piano', volume: 0.2, release: 1, reverb: 0.45, pan: 0.2, humanize: { time: 0.012, volume: 0.25 } },
    left: { sample: 'piano', volume: 0.28, ring: true, reverb: 0.45, pan: -0.1, humanize: { time: 0.012, volume: 0.12 } },
    // The tune, close by.
    piano: { sample: 'piano', volume: 0.32, ring: true, reverb: 0.45, humanize: { time: 0.014, volume: 0.15 } },
    fiddle: { sample: 'soloViolin', volume: 0.34, attack: 0.06, release: 0.6, reverb: 0.5, pan: 0.15, humanize: { time: 0.012, volume: 0.12 } },
    // A low whistle, answering.
    whistle: { ...FLUTE, volume: 0.05, pan: 0.3 },
    cellos: { sample: 'cellos', volume: 0.26, attack: 0.35, release: 1, reverb: 0.5, pan: -0.25 },
    horn: { sample: 'hornsSoft', volume: 0.26, attack: 0.3, release: 0.8, reverb: 0.55, pan: -0.1 },
    choir: { ...CHOIR, volume: 0.035, attack: 1.2, release: 1.5, reverb: 0.65 },
    bells: { ...BELLS, volume: 0.04, pan: 0.35, reverb: 0.55 },
    musicBox: { ...BELLS, volume: 0.07, echo: { time: 0.5, feedback: 0.3, mix: 0.3 } },
    knock: { sample: 'snareSoft', drum: 'sample', volume: 0.1, ring: true, reverb: 0.35, humanize: { time: 0.006, volume: 0.3 } },
  },

  sections: {
    // The rain alone, a lamp flickering.
    lamps: {
      rain: rain(4),
      left: [...rest(2), ...onNotes('F2 C2', LEFT)],
      bells: drops('C C F C', BAR, 0.07, 5, 1),
    },

    // The tune on the piano over the rain; the bass makes the chords.
    A: {
      piano: TUNE,
      rain: rain(8),
      left: onNotes(A_BASS, LEFT),
      bells: drops(A_CHORDS, BAR, 0.04, 2, 1),
    },

    // The fiddle takes the tune; for its second half the whistle sings a
    // third below; the cellos come in warm, a soft knock on the beats.
    A2: {
      fiddle: TUNE,
      whistle: [...rest(4), ...THIRD_BELOW],
      rain: rain(8),
      left: onNotes(A_BASS, LEFT),
      cellos: heldNotes(A_BASS, BAR, 1),
      knock: repeat(KNOCK, 8),
    },

    // The sad part. Piano and cellos, the choir humming over the rain; and
    // home through Ab and Bb.
    B: {
      piano: SAD,
      rain: rain(8),
      left: onNotes(B_BASS, LEFT),
      cellos: heldNotes(B_BASS, BAR, 1),
      choir: sustained(B_CHORDS, BAR, 1, 4),
      knock: repeat(KNOCK, 8),
    },

    // The rain stops. The prophecy's tune on a music box, two bars of it,
    // and then nothing but a low C.
    hush: {
      musicBox: PROPHECY_CUT,
      cellos: held(midi('C3'), 4 * BAR),
    },

    // The tune, fiddle and whistle together, the horn holding the roots;
    // and it ends on C, so the loop lands on C.
    A3: {
      fiddle: TUNE,
      whistle: [...transpose(TUNE.slice(0, 4 * BAR), 12), ...THIRD_BELOW],
      rain: rain(8),
      left: onNotes(A_BASS, LEFT),
      cellos: heldNotes(A_BASS, BAR, 1),
      horn: heldNotes(A_BASS, BAR, 1),
      choir: sustained(A_CHORDS, BAR, 1, 4),
      knock: repeat(KNOCK, 8),
      bells: drops(A_CHORDS, BAR, 0.06, 13, 1),
    },
  },

  // The lamps play once; then the town goes round from the tune.
  order: ['lamps', 'A', 'A2', 'B', 'hush', 'A3'],
  loopFrom: 1,
};
