import { sustained, hits } from '../../audio/notation.js';
import {
  BAR_128 as BAR, slow, eighths, rest as restBars, held, repeat, transpose, midi,
  onNotes, heldNotes, patter, cells, drops,
} from './parts/chapter3.js';
import { COAST_CELL, tight } from './parts/chapter5.js';

// "What the Tide Left": Saltcombe after the chapter. The storm has lifted,
// the sky over the stilt town is washed grey-blue, and Haddock is gone: the
// old lightman held the flood back on the crank until it was over, and did
// not come down. The town goes on. The cockle stall opens, the clerk
// stamps his ledgers, somebody mends a net; nobody is loud about it. So
// this is the town's song turned quiet: "Salt and Rope" without the
// bustle, sung by people who are tired and still here. It replaces "Salt
// and Rope" in every Saltcombe room, indoors and out, once the_light_answers
// has played (the rooms' `musicAfter`).
//
// Written the way "The Ones Who Stopped Waiting" (lasthomeTheme.js) is
// written, which is the way Christopher Larkin wrote Hollow Knight's City
// of Tears: a felted piano rocks F C G, a stack of fifths, up and back like
// boats at their ropes, all the way through and never changes, and the bass
// turns it into other chords underneath. In F major: F with the ninth, D
// minor 11, B flat 6/9, F over A, G minor 11, E flat (the borrowed flat
// seventh, the warm one), C with the fourth, F. Under the rocking, very
// softly, the real sea (seaWaves: waves recorded on a beach, one breaking
// every bar, never the same one twice running), the way you hear it
// outside from behind the houses.
//
// THE TUNE IS HADDOCK'S MOTIF (parts/chapter5.js): 3 2 1, then down to the
// low 5, long, short, long, longer. In F major: A G F, C, stretched over a
// 12/8 bar (a quarter, an 8th, a dotted quarter, a dotted half). It opens
// with a step, so it can be hummed. Then a little climb back up (D E F, A
// G), the motif's shape a fourth higher on B flat (C B-flat A, F), a
// question; the motif again on G minor, the climb through the borrowed E
// flat, and home. It is passed round: the piano, then a fiddle with a
// whistle a third beneath it for the second half.
//
// THE SAD PART (D minor) opens with the sea's tune, the COAST CELL, A D D E,
// once, on the piano, the only time it comes in. The violas join it, and
// it comes home through D flat and E flat (bVI and bVII, the way every
// triumphant game tune ends, used tenderly here). Over the D flat the
// tune plays Haddock's motif in its sad form: A flat G F, C. That one flat
// note is the whole difference between Haddock comfortable and Haddock
// gone.
//
// THE HUSH: the rocking stops. Only the sea is left, and an open fifth on
// the violas; and a music box plays the tune of his own song ("Minding the
// Light", haddockTheme.js), in F: A G F, C, and then F A D... and stops,
// halfway through the line, before it can come home. Then everyone plays
// the tune together, and it ends on F, so the loop lands home.
//
// Warm, tired, quiet, lamplit. Soft: no loud cellos or brass (the cellos
// are a breath under the bass; the horn holds roots, very low in the mix,
// only in the last part); the choir hums low. No synth sounds; the waves
// are real recordings.
//
// F major, rolling 12/8 at 56 dotted quarters a minute (a bar is about 4.3
// seconds), one step an 8th. The harbour plays once (17s); then it loops
// from the tune, 36 bars, about 2m34s:
//
//   harbour 4 bars  the piano rocking alone over the sea; one hand bell
//                   rings once, far off (17s)
//   A       8 bars  the tune on the piano over the rocking (34s)
//   A2      8 bars  the fiddle takes it, the whistle a third below for its
//                   second half, a breath of cellos, a soft frame drum
//   B       8 bars  the sad part, D minor: the coast cell on the piano, the
//                   violas join, the choir humming low; Haddock's motif in
//                   its sad form over D flat; home through D flat and E flat
//   hush    4 bars  the rocking stops; the sea, an open fifth, and his tune
//                   on a music box, cut off halfway (17s)
//   A3      8 bars  the tune, fiddle and whistle together, the horn under,
//                   the choir, glints of glock; it ends on F

const rest = (bars) => restBars(bars, BAR);
const fit = (name, section, bars) => tight('What the Tide Left', name, section, bars, BAR);

// The rocking: F C G on a felted piano, up and back in threes.
const ROCK_CELL = 'F5 C6 G6';
const ROCK = [0, 1, 2, 1, 0, 1, 0, 1, 2, 1, 0, 1];
const rock = (bars) => patter(cells(ROCK_CELL, bars), ROCK);

// --- The harmony: what the bass makes of the rocking, a bar each. ---
const A_BASS = 'F2 D2 Bb1 A1 G1 Eb2 C2 F2';
const A_CHORDS = 'F Dm Bb F Gm Eb C F';
const B_BASS = 'D2 Bb1 G1 A1 Bb1 F2 Db2 Eb2';
const B_CHORDS = 'Dm Bb Gm Am Bb F Db Eb';
// The left hand: the root, leaning onto its fifth halfway through.
const LEFT = [0, '-', '-', '-', '-', '-', 7, '-', '-', '-', '-', '-'];
const KNOCK = hits('...x.....x..');

// --- The tune (each token an 8th, twelve to a bar). Bar 1 is Haddock's
// motif, A G F, C; bar 5 says it again. ---
const TUNE = eighths(`
  A4 - G4 F4 - - C4 - - - - -     D4 - E4 F4 - - A4 - - G4 - -
  C5 - Bb4 A4 - - F4 - - - - -    G4 - - A4 - - G4 - - - - -
  A4 - G4 F4 - - C4 - - - - -     D4 - Eb4 F4 - - G4 - - Bb4 - -
  A4 - - G4 - - F4 - - E4 - -     F4 - - - - - - - - . . .
`);
// The whistle a third under the tune's second half (in the key, not strict;
// it meets the tune on the low C).
const THIRD_BELOW = eighths(`
  F4 - E4 D4 - - C4 - - - - -     C4 - - D4 - - Eb4 - - G4 - -
  F4 - - E4 - - D4 - - C4 - -     C4 - - - - - - - - . . .
`);
// The sad part, D minor: the coast cell (A D D E) once, the climb, and
// Haddock's motif in its sad form over the D flat (A flat G F, C); home
// through D flat and E flat.
const SAD = [
  ...slow(`${COAST_CELL} | F5 - D5 C5 | D5 - Bb4 G4 | A4 - - - |
    F4 G4 A4 Bb4 | C5 - - A4`),
  ...eighths('Ab4 - G4 F4 - - C4 - - - - -'),
  ...slow('Bb4 - G4 F4'),
];
// His own tune ("Minding the Light", its first line, in F) on a music box:
// A G F, C; then F A D... and it stops.
const HIS_TUNE_CUT = [
  ...eighths('A6 - G6 F6 - - C6 - - - - -   F6 - A6 D7 - - . . . . . .'),
  ...rest(2),
];

export const SALTCOMBE_AFTER_THEME = {
  title: 'What the Tide Left',
  bpm: 56,
  stepsPerBeat: 3,
  // Raised from 0.7 on 8 November 2026: it sat about 9 dB under the other chapter 5
  // area songs. Still the softest of them, just not lost under the ambience.
  volume: 1.5,

  instruments: {
    // The real sea, outside, behind the houses: a wave breaking every bar
    // (seaWaves, recorded on a beach), soft and a little dulled by distance.
    waves: { sample: 'seaWaves', volume: 0.07, ring: true, muffle: 2600, reverb: 0.25, pan: -0.1 },
    // The rocking: a felted piano, close, soft.
    rock: { sample: 'grandPiano', volume: 0.12, release: 1, muffle: 3600, reverb: 0.45, pan: 0.2, humanize: { time: 0.012, volume: 0.25 } },
    left: { sample: 'grandPiano', volume: 0.17, ring: true, reverb: 0.45, pan: -0.1, humanize: { time: 0.012, volume: 0.12 } },
    // The tune, close by.
    piano: { sample: 'grandPiano', volume: 0.22, ring: true, reverb: 0.45, humanize: { time: 0.014, volume: 0.15 } },
    fiddle: { sample: 'soloViolin', volume: 0.4, attack: 0.06, release: 0.6, reverb: 0.5, pan: 0.15, humanize: { time: 0.012, volume: 0.12 } },
    // A whistle, answering.
    whistle: { sample: 'recorder', volume: 0.25, attack: 0.08, release: 0.6, reverb: 0.55, pan: 0.3, humanize: { time: 0.012, volume: 0.1 } },
    // A breath of cellos under the bass, never loud.
    low: { sample: 'cellos', volume: 0.19, attack: 0.5, release: 1.2, muffle: 1800, reverb: 0.5, pan: -0.25 },
    // The violas, joining the sad tune an octave down; and the open fifth in the hush.
    violas: { sample: 'violas', volume: 0.2, attack: 0.25, release: 1, muffle: 2800, reverb: 0.55, pan: -0.15, humanize: { time: 0.012, volume: 0.1 } },
    still: { sample: 'violas', volume: 0.11, attack: 1.4, release: 2, muffle: 2400, reverb: 0.65, pan: 0.1 },
    horn: { sample: 'hornsSoft', volume: 0.22, attack: 0.4, release: 1, muffle: 2200, reverb: 0.55, pan: -0.1 },
    // The choir, humming low.
    hum: { sample: 'choir', volume: 0.17, attack: 1.4, release: 1.8, muffle: 2400, reverb: 0.7, pan: -0.15 },
    choir: { sample: 'choir', volume: 0.14, attack: 1.4, release: 1.8, muffle: 2600, reverb: 0.7, pan: 0.15 },
    // Glints off the water.
    bells: { sample: 'glock', volume: 0.08, ring: true, muffle: 6000, pan: 0.35, reverb: 0.6 },
    // His tune, on a music box.
    musicBox: { sample: 'glock', volume: 0.15, ring: true, reverb: 0.55, echo: { time: 0.5, feedback: 0.3, mix: 0.3 } },
    // One hand bell, far off, at the start.
    bell: { sample: 'chimes', volume: 0.1, ring: true, muffle: 4000, reverb: 0.7, pan: 0.3 },
    knock: { sample: 'frameDrum', drum: 'sample', volume: 0.1, ring: true, reverb: 0.35, humanize: { time: 0.006, volume: 0.3 } },
  },

  sections: {
    // The piano rocking alone over the sea; a bell, once, far off.
    harbour: fit('harbour', {
      rock: rock(4),
      left: [...rest(2), ...onNotes('F2 C2', LEFT)],
      bell: [...rest(1), ...held('C5', BAR), ...rest(2)],
    }, 4),

    // The tune on the piano over the rocking; the bass makes the chords.
    A: fit('A', {
      piano: TUNE,
      rock: rock(8),
      left: onNotes(A_BASS, LEFT),
      bells: drops(A_CHORDS, BAR, 0.04, 7, 1),
    }, 8),

    // The fiddle takes the tune; for its second half the whistle sings a
    // third below; a breath of cellos, a soft frame drum on the beats.
    A2: fit('A2', {
      fiddle: TUNE,
      whistle: [...rest(4), ...THIRD_BELOW],
      rock: rock(8),
      left: onNotes(A_BASS, LEFT),
      low: heldNotes(A_BASS, BAR, 1),
      knock: repeat(KNOCK, 8),
    }, 8),

    // The sad part: the coast cell on the piano, the violas joining it, the
    // choir humming low; home through D flat and E flat.
    B: fit('B', {
      piano: SAD,
      violas: [...rest(4), ...transpose(SAD.slice(4 * BAR), -12)],
      rock: rock(8),
      left: onNotes(B_BASS, LEFT),
      low: heldNotes(B_BASS, BAR, 1),
      hum: sustained(B_CHORDS, BAR, 0, 3),
      knock: repeat(KNOCK, 8),
    }, 8),

    // The rocking stops. The sea, an open fifth, and his tune on a music
    // box, cut off halfway.
    hush: fit('hush', {
      musicBox: HIS_TUNE_CUT,
      still: held('F3', 4 * BAR),
      choir: [...held('C4', 3 * BAR), ...rest(1)],
    }, 4),

    // The tune, fiddle and whistle together, the horn holding the roots;
    // and it ends on F, so the loop lands on F.
    A3: fit('A3', {
      fiddle: TUNE,
      whistle: [...transpose(TUNE.slice(0, 4 * BAR), 12), ...THIRD_BELOW],
      rock: rock(8),
      left: onNotes(A_BASS, LEFT),
      low: heldNotes(A_BASS, BAR, 1),
      horn: heldNotes(A_BASS, BAR, 1),
      choir: sustained(A_CHORDS, BAR, 1, 4),
      hum: sustained(A_CHORDS, BAR, 0, 3),
      knock: repeat(KNOCK, 8),
      bells: drops(A_CHORDS, BAR, 0.06, 19, 1),
    }, 8),
  },

  // The harbour plays once; then the town goes round from the tune.
  order: ['harbour', 'A', 'A2', 'B', 'hush', 'A3'],
  loopFrom: 1,
};

// The real sea: a wave breaks at the top of every bar, in every section
// (the hush too: the sea doesn't stop), a different one each time.
const BREAKS = ['E4', 'C4', 'G4', 'D4', 'F#4', 'C#4', 'F4', 'Eb4'];
let breakNo = 0;
for (const name of SALTCOMBE_AFTER_THEME.order) {
  const section = SALTCOMBE_AFTER_THEME.sections[name];
  const length = Object.values(section)[0].length;
  section.waves = Array.from({ length }, (_, step) => (step % BAR ? '.' : midi(BREAKS[breakNo++ % BREAKS.length])));
}
