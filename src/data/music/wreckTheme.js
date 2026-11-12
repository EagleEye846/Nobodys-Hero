import {
  melody, repeat, sustained, rest as restBars, hits,
  tight, midi, scatter, after as afterBars,
} from './parts/chapter5.js';

// "Fog Bell": the theme of the Wreck Yard, the graveyard of ships out past
// Saltcombe, where the green storm sits right down on the water and the fog
// never lifts. Hulls lean on each other; masts stick up like dead trees;
// somewhere out in the murk a bell buoy keeps tolling for ships that sank
// years ago. It is eerie and sad, never loud, but it moves: the swell
// knocks the hulls together in a slow, lopsided rhythm (3 + 3 + 2), and
// everything in the song leans on it.
//
// THE DRIP (the first hook): a harp rolls the same three notes, B E G, in
// that lopsided rhythm, B-E-G, B-E-G, and a high E, every bar, like water
// running off a broken rail. It never changes (a fixed ostinato with a
// moving bass, after Hollow Knight's City of Tears); the bass walks under
// it and recolours it, and over the F major chord its B and E rub. A soft
// frame drum knocks the same 3 + 3 + 2 underneath once the tune gets
// going, and a far tom marks the bar, like a hull bumping a hull.
//
// THE TUNE (the second hook, on a lone oboe): THE COAST CELL (parts/
// chapter5.js, A D D E in D minor) here in E minor (B E E F#), but turned
// DOWN at the end: B E E D. The sea's tune, sinking, in the same lopsided
// rhythm as the drip. It's said, then said again a third lower (G C C B),
// then upright at last (B E E F#), like something trying to come up for
// air, and a long fall to F# that doesn't land. The clarinet's tune in B
// answers in the same rhythm. In the fog the cell is slowed to a bar a note
// on bowed vibes, and the tail says it once more, sunk, and stops.
//
// A bell (chimes) tolls by itself, out of step with the music (every 13
// 8ths, about six seconds, so it never lands in the same place twice). Low
// strings play sul tasto, bowed over the fingerboard (cellos and violas
// through a soft lowpass, so they sound far off and woolly); in the fog the
// violas rock a half step, like timbers creaking.
//
// CORRIE'S LULLABY ("Come In, Little Boat", parts/chapter5.js) surfaces
// once, in the fog: a music box somewhere inside a hull plays its first two
// bars (in E minor here: G B E / E D C) over the C major chord, very far
// off, and stops. Nobody remarks on it. It is the second time the player
// hears the tune (the Sunken Lanes let it float up first, and Haddock hums
// it in his own song), so by the Last Light it is already known.
//
// THE PAYOFF (A2): the oboe tune with the violins on it too, the clarinet a
// sixth below, the choir, a swell of tremolo strings, the drums at their
// fullest; and this time it lands on E.
//
// The unease is in two places: the F major chord in B (the flat second of E
// minor, the drip's B and E rubbing against it), and the bell that never
// agrees with the beat. Reference for the mood only: Hollow Knight's Fog
// Canyon and City of Tears, Dead Cells' Undying Shores, Wind Waker's Ghost
// Ship, a foghorn heard from bed.
//
// E minor, 4/4 at 66 (a bar is about 3.6 seconds); one step an 8th, 8 to a
// bar. The intro plays once (2 bars); then it loops from A, 36 bars, about
// 2m11s:
//
//   intro   2 bars  the bell, the low strings on E, the drip coming in
//   A       8 bars  THE TUNE on the oboe: the cell sunk, sunk a third lower,
//                   then upright, then a long fall to F# that doesn't land;
//                   the bass walks under Em, C, B, G, Am; the drum creeps in
//                   at bar 5
//   B       8 bars  the clarinet's tune in the same rhythm: C, G, Am, D,
//                   then the F major (the wrong chord) and B; the oboe
//                   answers; violins very far off; the drum steady
//   C       8 bars  the fog: the drums stop, no tune, only the cell slowed
//                   right down on bowed vibes and a low flute answering,
//                   the timbers creaking, a soft choir; in bars 3 and 4 a
//                   far music box plays two bars of the lullaby and stops
//   A2      8 bars  THE PAYOFF: the tune on oboe and violins, the clarinet a
//                   sixth below, the choir and the tremolo swell, the drums
//                   fullest; it lands on E at last
//   tail    4 bars  the cell once, sunk; the drip; the bell; the B chord
//                   hangs open and loops back round to A

const BAR = 8;
const tune = (text) => melody(text, 1);   // each token an 8th: 8 to a bar
const rest = (bars) => restBars(bars, BAR);
const after = (bars, track) => afterBars(bars, track, BAR);
const fit = (name, section, bars) => tight('Fog Bell', name, section, bars, BAR);
const beat = (pattern, bars) => repeat(hits(pattern), bars);

// --- Harmony, a bar each ---
const INTRO_CHORDS = 'Em Em';
const A_CHORDS = 'Em Em C B Em G Am B';
const B_CHORDS = 'C G Am D F Em B B';
const C_CHORDS = 'Em Em C C Am Am B B';
const A2_CHORDS = 'Em Em C B Em G Am Em';
const TAIL_CHORDS = 'Em C Am B';

// --- The tunes (sing them: the first two bars are the hook) ---
// The oboe: the cell sunk (B E E D), the same a third lower (G C C B), then
// the cell upright (B E E F#) and a long fall that stops on F#.
const TUNE_A = tune(`
  B4 - - E5 E5 - D5 -     B4 - - - - - . .
  G4 - - C5 C5 - B4 -     F#4 - - - - - . .
  B4 - - E5 E5 - F#5 -    G5 - - F#5 E5 - D5 -
  C5 - - B4 A4 - G4 A4    F#4 - - - - - . .
`);
// The same, landing on E (for A2).
const TUNE_A_HOME = [...TUNE_A.slice(0, 6 * BAR), ...tune(`
  C5 - - B4 A4 - G4 F#4   E4 - - - - - . .
`)];
// The clarinet's tune, in the same lopsided rhythm: it falls, climbs, and
// meets the F major bar.
const TUNE_B = tune(`
  E5 - - G5 G5 - E5 -     D5 - - - B4 - - -
  C5 - - E5 E5 - D5 -     A4 - - - - - . .
  C5 - - - B4 - A4 -      G4 - - - F#4 - G4 -
  A4 - - G4 F#4 - - -     B4 - - - - - - .
`);
// The oboe answering the clarinet's long notes (bars 4 and 8).
const ANSWER_B = tune(`
  . . . . . . . .         . . . . . . . .
  . . . . . . . .         . . . . F#5 - D5 -
  . . . . . . . .         . . . . . . . .
  . . . . . . . .         . . . . D#5 - F#5 -
`);
// The clarinet a sixth under the oboe, for A2 (diatonic, by hand; a fifth
// on the C bar and a third at the end of the G bar, where a sixth would rub
// on the choir's C and G).
const SIXTHS_A2 = tune(`
  D4 - - G4 G4 - F#4 -    D4 - - - - - . .
  C4 - - E4 E4 - D4 -     A3 - - - - - . .
  D4 - - G4 G4 - A4 -     B4 - - A4 G4 - B4 -
  E4 - - D4 C4 - B3 A3    G3 - - - - - . .
`);
// The fog: the cell sunk and slowed to a bar a note (bowed vibes), and a
// low flute answering it.
const FOG_CELL = tune(`
  B4 - - - - - - -        E5 - - - E5 - - -
  D5 - - - - - - -        - - - - - - . .
  . . . . . . . .         . . . . . . . .
  . . . . . . . .         . . . . . . . .
`);
const FOG_ANSWER = tune(`
  . . . . . . . .         . . . . . . . .
  . . . . . . . .         . . . . . . . .
  G4 - - - - - - -        A4 - - - B4 - - -
  F#4 - - - - - - -       - - - - - - . .
`);
// A music box in a hull: the lullaby's first two bars (its 6/8 squeezed
// into 4/4 as 3+3+2), in E minor, over the C chord in bars 3 and 4 of C.
const BOX_C = tune(`
  . . . . . . . .         . . . . . . . .
  G5 - - B5 - - E6 -      E6 - - D6 - - C6 -
  . . . . . . . .         . . . . . . . .
  . . . . . . . .         . . . . . . . .
`);
// The cell one last time, sunk, then nothing.
const TAIL_CELL = tune(`
  B4 - - E5 E5 - D5 -     B4 - - - - - . .
  . . . . . . . .         . . . . . . . .
`);

// --- The band ---
// THE DRIP: B E G, B E G, and the high E (3 + 3 + 2), every bar.
const DRIP = tune('B5 E5 G5 B5 E5 G5 E6 .');
const drip = (bars) => repeat(DRIP, bars);
// The fog's drip: the same notes, thinned to the first of each group.
const THIN = tune('B5 . . B5 . . E6 .');
const thin = (bars) => repeat(THIN, bars);
// The walking bass on a low harp: the root, the fifth on the 3 + 3, and a
// step that leads into the next bar. (Nothing under E2: the harp's lowest
// strings go "boing".)
const A_BASS = tune(`
  E3 - - B2 - - D3 -      E3 - - B2 - - D3 -
  C3 - - G3 - - C3 -      B2 - - F#2 - - B2 -
  E3 - - B2 - - F#2 -     G2 - - D3 - - G#2 -
  A2 - - E3 - - A#2 -     B2 - - F#2 - - B2 -
`);
const B_BASS = tune(`
  C3 - - G3 - - A2 -      G2 - - D3 - - G#2 -
  A2 - - E3 - - C#3 -     D3 - - A2 - - E2 -
  F2 - - C3 - - F3 -      E3 - - B2 - - C3 -
  B2 - - F#3 - - B2 -     B2 - - F#2 - - D#3 -
`);
const A2_BASS = [...A_BASS.slice(0, 6 * BAR), ...tune(`
  A2 - - E3 - - B2 -      E3 - - B2 - - E3 -
`)];
const TAIL_BASS = tune(`
  E3 - - B2 - - . .       C3 - - G2 - - . .
  A2 - - E3 - - . .       B2 - - F#2 - - . .
`);
// The low strings, sul tasto: roots on the cellos, thirds on the violas.
const tasto = (chords) => sustained(chords, BAR, 0, 2);
const tastoHigh = (chords) => sustained(chords, BAR, 1, 3);
// Timbers creaking: the violas rock a half step, once every two bars.
const CREAK = tune('. . . . E3 - F3 -   - - . . . . . .');
const creak = (bars) => repeat(CREAK, bars / 2);
// The swell knocking the hulls: a frame drum on the 3 + 3 + 2, a ghost
// note before the bar in the payoff, a far tom on the bar.
const KNOCK = 'x..x..x.';
const KNOCK_FULL = 'x..x..xx';
const HULL = 'x.......';

// The fog bell: one long track for the whole song, a toll every 13 8ths
// (about six seconds), so it is never on the beat in the same place twice.
// Each section takes its own slice.
const START = { intro: 0, A: 2, B: 10, C: 18, A2: 26, tail: 34 };
const TOTAL_BARS = 38;
const TOLLS = (() => {
  const out = Array(TOTAL_BARS * BAR).fill('.');
  for (let s = 3; s < out.length; s += 13) out[s] = midi('E4');
  return out;
})();
const bell = (name, bars) => TOLLS.slice(START[name] * BAR, (START[name] + bars) * BAR);

export const WRECK_THEME = {
  title: 'Fog Bell',
  bpm: 66,
  stepsPerBeat: 2,
  volume: 1.15,

  instruments: {
    oboe: { sample: 'oboe', volume: 0.22, attack: 0.08, release: 0.6, reverb: 0.6, pan: 0.15, humanize: { time: 0.012, volume: 0.12 } },
    clarinet: { sample: 'clarinet', volume: 0.19, attack: 0.1, release: 0.6, reverb: 0.6, pan: -0.2, humanize: { time: 0.014, volume: 0.12 } },
    // The violins on the tune in the payoff, far back.
    violinsTune: { sample: 'violins', volume: 0.1, attack: 0.2, release: 0.8, reverb: 0.7, pan: 0.3, muffle: 3600, humanize: { time: 0.012, volume: 0.08 } },
    flute: { sample: 'flute', volume: 0.16, attack: 0.25, release: 0.8, reverb: 0.7, pan: -0.25 },
    fog: { sample: 'vibesBowed', volume: 0.14, attack: 0.5, release: 1.6, reverb: 0.8, pan: 0.2, echo: { time: 0.68, feedback: 0.35, mix: 0.3 } },
    // The drip: a harp, a little muffled, with a short echo off the hulls.
    drip: { sample: 'harp', volume: 0.12, ring: true, muffle: 5000, reverb: 0.65, pan: 0.3, humanize: { time: 0.012, volume: 0.2 }, echo: { time: 0.45, feedback: 0.2, mix: 0.15 } },
    harpBass: { sample: 'harp', volume: 0.18, ring: true, reverb: 0.5, pan: -0.25, humanize: { time: 0.01, volume: 0.12 } },
    // Sul tasto: slow bows, the top taken off so they sit far back.
    tasto: { sample: 'cellos', volume: 0.09, attack: 1.6, release: 2.0, reverb: 0.6, pan: -0.1, muffle: 700 },
    tastoHigh: { sample: 'violas', volume: 0.09, attack: 1.6, release: 2.0, reverb: 0.65, pan: 0.15, muffle: 1100 },
    creak: { sample: 'violas', volume: 0.07, attack: 0.4, release: 0.6, reverb: 0.5, pan: -0.35, muffle: 650 },
    violins: { sample: 'violins', volume: 0.06, attack: 1.8, release: 2.0, reverb: 0.75, pan: 0.35, muffle: 2400 },
    // The swell in the payoff: tremolo violas, far off.
    swell: { sample: 'violasTrem', volume: 0.08, attack: 2.2, release: 2.0, reverb: 0.7, pan: -0.2, muffle: 2000 },
    choir: { sample: 'choir', volume: 0.07, attack: 1.8, release: 2.2, reverb: 0.8 },
    // The hulls knocking: a soft frame drum, and a tom a long way off.
    knock: { sample: 'frameDrum', drum: 'sample', volume: 0.12, ring: true, reverb: 0.45, pan: 0.05, humanize: { time: 0.008, volume: 0.25 } },
    hull: { sample: 'tom', drum: 'sample', volume: 0.13, ring: true, reverb: 0.6, pan: -0.15, humanize: { time: 0.008, volume: 0.2 } },
    // The music box, far off inside a hull: muffled, slowed by the echo.
    box: { sample: 'glock', volume: 0.07, ring: true, reverb: 0.85, pan: 0.4, muffle: 3000, echo: { time: 0.68, feedback: 0.3, mix: 0.3 }, humanize: { time: 0.02, volume: 0.15 } },
    bell: { sample: 'chimes', volume: 0.12, ring: true, reverb: 0.85, pan: -0.4, muffle: 2600, echo: { time: 0.9, feedback: 0.3, mix: 0.3 } },
  },

  sections: {
    intro: fit('intro', {
      bell: bell('intro', 2),
      tasto: tasto(INTRO_CHORDS),
      drip: [...thin(1), ...drip(1)],
    }, 2),

    // THE TUNE: the oboe over the drip and the walking bass; the drum creeps
    // in halfway.
    A: fit('A', {
      oboe: TUNE_A,
      drip: drip(8),
      harpBass: A_BASS,
      tasto: tasto(A_CHORDS),
      tastoHigh: tastoHigh(A_CHORDS),
      knock: after(4, beat(KNOCK, 8)),
      bell: bell('A', 8),
    }, 8),

    // The clarinet's tune; the oboe answers; the drums steady.
    B: fit('B', {
      clarinet: TUNE_B,
      oboe: ANSWER_B,
      drip: drip(8),
      harpBass: B_BASS,
      tasto: tasto(B_CHORDS),
      tastoHigh: tastoHigh(B_CHORDS),
      violins: sustained(B_CHORDS, BAR, 2, 4),
      knock: beat(KNOCK, 8),
      hull: beat(HULL, 8),
      bell: bell('B', 8),
    }, 8),

    // The fog: the drums stop, the drip thins, the cell slowed right down;
    // the music box in a hull.
    C: fit('C', {
      fog: FOG_CELL,
      flute: FOG_ANSWER,
      box: BOX_C,
      drip: thin(8),
      tasto: tasto(C_CHORDS),
      creak: creak(8),
      // The fifths (B, G, E, F#): a third would sit a half step over the
      // flute's B in bar 6.
      choir: sustained(C_CHORDS, BAR, 2, 4),
      hull: [...rest(7), ...hits('x...x.x.')],
      bell: bell('C', 8),
    }, 8),

    // THE PAYOFF: the tune on oboe and violins, the clarinet a sixth below,
    // the choir, the swell, the drums fullest; home on E.
    A2: fit('A2', {
      oboe: TUNE_A_HOME,
      violinsTune: TUNE_A_HOME,
      clarinet: SIXTHS_A2,
      drip: drip(8),
      harpBass: A2_BASS,
      tasto: tasto(A2_CHORDS),
      tastoHigh: tastoHigh(A2_CHORDS),
      violins: sustained(A2_CHORDS, BAR, 2, 4),
      swell: [...sustained(A2_CHORDS, BAR, 0, 3).slice(0, 7 * BAR), ...rest(1)],
      choir: sustained(A2_CHORDS, BAR, 0, 4),
      knock: [...beat(KNOCK_FULL, 7), ...hits('x.......')],
      hull: beat(HULL, 8),
      bell: bell('A2', 8),
    }, 8),

    tail: fit('tail', {
      oboe: TAIL_CELL,
      drip: [...drip(2), ...thin(2)],
      harpBass: TAIL_BASS,
      tasto: tasto(TAIL_CHORDS),
      creak: [...rest(2), ...creak(2)],
      bell: bell('tail', 4),
    }, 4),
  },

  order: ['intro', 'A', 'B', 'C', 'A2', 'tail'],
  loopFrom: 1,
};
