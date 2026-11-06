import {
  melody, repeat, sustained, chordLine, transpose, rest as restBars,
  tight, midi, scatter,
} from './parts/chapter5.js';

// "Fog Bell": the theme of the Wreck Yard, the graveyard of ships out past
// Saltcombe, where the green storm sits right down on the water and the fog
// never lifts. Hulls lean on each other; masts stick up like dead trees;
// somewhere out in the murk a bell buoy keeps tolling for ships that sank
// years ago. It is eerie and sad, never loud. A bell (chimes) tolls by
// itself, out of step with the music (every six and a half seconds, so it
// never lands in the same place twice). Low strings play sul tasto, bowed
// over the fingerboard (cellos and violas through a soft lowpass, so they
// sound far off and woolly); now and then the violas rock a half step, like
// timbers creaking. A harp drops the same few notes over and over like water
// off a broken rail (a fixed ostinato with a moving bass, after Hollow
// Knight's City of Tears), and a lone oboe sings over it all, with a
// clarinet for the second tune.
//
// THE COAST CELL (parts/chapter5.js, A D D E in D minor) is here in E minor
// (B E E F#), but turned DOWN at the end: B E E D. The sea's tune, sinking.
// The oboe opens with the sunk form and only gets the upright one (B E E
// F#) halfway through its phrase, like something trying to come up for air.
// In the fog section it is slowed to a whole bar a note on bowed vibes, and
// the tail says it once more, sunk, and stops.
//
// The unease is in two places: the F major chord in B (the flat second of E
// minor, the harp's B and E rubbing against it), and the bell that never
// agrees with the beat. Reference for the mood only: Hollow Knight's Fog
// Canyon and Resting Grounds, Wind Waker's Ghost Ship, a foghorn heard from
// bed.
//
// E minor, 4/4 at 60 (a bar is 4 seconds); one step an 8th, 8 to a bar. The
// intro plays once (2 bars); then it loops from A, 36 bars, 2m24s:
//
//   intro   2 bars   8s    the bell, the low strings on E, one drop
//   A       8 bars  32s    the oboe: the cell sunk, then upright, then a
//                          long fall to F# that doesn't land; harp drops
//                          over Em, C, B, G, Am
//   B       8 bars  32s    the clarinet's tune, lower and sadder: C, G, Am,
//                          D, then the F major (the wrong chord) and B; the
//                          oboe answers twice; violins very far off
//   C       8 bars  32s    the fog: no tune, only the cell slowed right down
//                          on bowed vibes and a low flute answering, the
//                          timbers creaking, a soft choir "oo"
//   A2      8 bars  32s    the oboe tune again with the clarinet a sixth
//                          below it, everything a little fuller; it lands on
//                          E at last
//   tail    4 bars  16s    the cell once, sunk; drops; the bell; the B chord
//                          hangs open and loops back round to A

const BAR = 8;
const tune = (text) => melody(text, 1);   // each token an 8th: 8 to a bar
const rest = (bars) => restBars(bars, BAR);
const fit = (name, section, bars) => tight('Fog Bell', name, section, bars, BAR);

// --- Harmony, a bar each ---
const INTRO_CHORDS = 'Em Em';
const A_CHORDS = 'Em Em C B Em G Am B';
const B_CHORDS = 'C G Am D F Em B B';
const C_CHORDS = 'Em Em C C Am Am B B';
const A2_CHORDS = 'Em Em C B Em G Am Em';
const TAIL_CHORDS = 'Em C Am B';

// --- The tunes (sing them: the first two bars are the hook) ---
// The oboe: the cell sunk (B E E D), a sigh, a little climb, then the cell
// upright (B E E F#) and a long fall that stops on F#.
const TUNE_A = tune(`
  B4 - - E5 E5 - D5 -     B4 - - - - - . .
  G4 - A4 B4 - C5 B4 A4   F#4 - - - - - . .
  B4 - - E5 E5 - F#5 -    G5 - - F#5 E5 - D5 -
  C5 - - B4 A4 - G4 A4    F#4 - - - - - . .
`);
// The same, landing on E (for A2).
const TUNE_A_HOME = [...TUNE_A.slice(0, 6 * BAR), ...tune(`
  C5 - - B4 A4 - G4 F#4   E4 - - - - - . .
`)];
// The clarinet's tune: falls, climbs, and the F major bar.
const TUNE_B = tune(`
  E5 - - - D5 - C5 -      G4 - - - - - . .
  A4 - B4 - C5 - E5 -     D5 - - - - - . .
  C5 - - - B4 - A4 -      E4 - - - F#4 - G4 -
  A4 - - G4 F#4 - - -     B4 - - - - - - .
`);
// The oboe answering the clarinet's long notes (bars 2 and 4).
const ANSWER_B = tune(`
  . . . . . . . .         . . . . D5 - B4 -
  . . . . . . . .         . . . . F#5 - D5 -
  . . . . . . . .         . . . . . . . .
  . . . . . . . .         . . . . . . . .
`);
// The clarinet a sixth under the oboe, for A2 (diatonic, by hand).
const SIXTHS_A2 = tune(`
  D4 - - G4 G4 - F#4 -    D4 - - - - - . .
  B3 - C4 D4 - E4 D4 C4   A3 - - - - - . .
  D4 - - G4 G4 - A4 -     B4 - - A4 G4 - F#4 -
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
// The cell one last time, sunk, then nothing.
const TAIL_CELL = tune(`
  B4 - - E5 E5 - D5 -     B4 - - - - - . .
  . . . . . . . .         . . . . . . . .
`);

// --- The band ---
// The harp's drops: the same three notes, a two-bar figure, never changing
// (B, G, E: they sit on every chord but the F, where they rub).
const DROPS = tune('B5 . . G5 . E6 . .   . . B5 . . . . .');
const drops = (bars) => repeat(DROPS, bars / 2);
// The moving bass: a low harp note on the root, and the fifth on beat three.
const harpBass = (chords) => chordLine(chords, [0, '.', '.', '.', 7, '.', '.', '.'], 2);
// The low strings, sul tasto: roots on the cellos, thirds on the violas.
const tasto = (chords) => sustained(chords, BAR, 0, 2);
const tastoHigh = (chords) => sustained(chords, BAR, 1, 3);
// Timbers creaking: the violas rock a half step, once every two bars.
const CREAK = tune('. . . . E3 - F3 -   - - . . . . . .');
const creak = (bars) => repeat(CREAK, bars / 2);

// The fog bell: one long track for the whole song, a toll every 13 8ths
// (six and a half seconds), so it is never on the beat in the same place
// twice. Each section takes its own slice.
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
  bpm: 60,
  stepsPerBeat: 2,
  volume: 1.2,

  instruments: {
    oboe: { sample: 'oboe', volume: 0.22, attack: 0.1, release: 0.6, reverb: 0.6, pan: 0.15, humanize: { time: 0.014, volume: 0.12 } },
    clarinet: { sample: 'clarinet', volume: 0.2, attack: 0.1, release: 0.6, reverb: 0.6, pan: -0.2, humanize: { time: 0.014, volume: 0.12 } },
    flute: { sample: 'flute', volume: 0.16, attack: 0.25, release: 0.8, reverb: 0.7, pan: -0.25 },
    fog: { sample: 'vibesBowed', volume: 0.14, attack: 0.5, release: 1.6, reverb: 0.8, pan: 0.2, echo: { time: 0.75, feedback: 0.35, mix: 0.3 } },
    drops: { sample: 'harp', volume: 0.15, ring: true, reverb: 0.7, pan: 0.3, humanize: { time: 0.015, volume: 0.2 }, echo: { time: 0.5, feedback: 0.25, mix: 0.2 } },
    harpBass: { sample: 'harp', volume: 0.16, ring: true, reverb: 0.55, pan: -0.25, humanize: { time: 0.01, volume: 0.15 } },
    // Sul tasto: slow bows, the top taken off so they sit far back.
    tasto: { sample: 'cellos', volume: 0.1, attack: 1.6, release: 2.0, reverb: 0.6, pan: -0.1, muffle: 700 },
    tastoHigh: { sample: 'violas', volume: 0.09, attack: 1.6, release: 2.0, reverb: 0.65, pan: 0.15, muffle: 1100 },
    creak: { sample: 'violas', volume: 0.07, attack: 0.4, release: 0.6, reverb: 0.5, pan: -0.35, muffle: 650 },
    violins: { sample: 'violins', volume: 0.06, attack: 1.8, release: 2.0, reverb: 0.75, pan: 0.35, muffle: 2400 },
    choir: { sample: 'choir', volume: 0.07, attack: 1.8, release: 2.2, reverb: 0.8 },
    bell: { sample: 'chimes', volume: 0.12, ring: true, reverb: 0.85, pan: -0.4, muffle: 2600, echo: { time: 0.9, feedback: 0.3, mix: 0.3 } },
  },

  sections: {
    intro: fit('intro', {
      bell: bell('intro', 2),
      tasto: tasto(INTRO_CHORDS),
      drops: scatter(2, BAR, [[1, 5, 'E6']]),
    }, 2),

    A: fit('A', {
      oboe: TUNE_A,
      drops: drops(8),
      harpBass: harpBass(A_CHORDS),
      tasto: tasto(A_CHORDS),
      tastoHigh: tastoHigh(A_CHORDS),
      bell: bell('A', 8),
    }, 8),

    B: fit('B', {
      clarinet: TUNE_B,
      oboe: ANSWER_B,
      drops: drops(8),
      harpBass: harpBass(B_CHORDS),
      tasto: tasto(B_CHORDS),
      tastoHigh: tastoHigh(B_CHORDS),
      violins: sustained(B_CHORDS, BAR, 2, 4),
      bell: bell('B', 8),
    }, 8),

    C: fit('C', {
      fog: FOG_CELL,
      flute: FOG_ANSWER,
      drops: drops(8),
      tasto: tasto(C_CHORDS),
      creak: creak(8),
      choir: sustained(C_CHORDS, BAR, 1, 4),
      bell: bell('C', 8),
    }, 8),

    A2: fit('A2', {
      oboe: TUNE_A_HOME,
      clarinet: SIXTHS_A2,
      drops: drops(8),
      harpBass: harpBass(A2_CHORDS),
      tasto: tasto(A2_CHORDS),
      tastoHigh: tastoHigh(A2_CHORDS),
      violins: sustained(A2_CHORDS, BAR, 2, 4),
      choir: sustained(A2_CHORDS, BAR, 0, 4),
      bell: bell('A2', 8),
    }, 8),

    tail: fit('tail', {
      oboe: TAIL_CELL,
      drops: drops(4),
      tasto: tasto(TAIL_CHORDS),
      creak: [...rest(2), ...creak(2)],
      bell: bell('tail', 4),
    }, 4),
  },

  order: ['intro', 'A', 'B', 'C', 'A2', 'tail'],
  loopFrom: 1,
};
