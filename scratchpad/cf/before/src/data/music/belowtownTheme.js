import {
  melody, arpeggio, chordLine, sustained, hits, repeat, midi, rest as restBars,
} from './parts/chapter4.js';
import { drops } from './parts/chapter3.js';

// "Lamps Lit Early": the theme of Belowtown, the creature folk's town built
// into the stones of a buried old city, Chapter 4's hub. Moles, glow-worms,
// frogs and a beetle postman going about their business under a great
// crystal "sun" that hangs over the roofs. The town lights its lamps early
// and likes it that way: warm doorways, a forge ticking over at the end of
// the street, somebody's kettle on. Content, cosy and gently happy: a place
// glad to have visitors. Not a fair: no oom-pah, no claps, no brass, nothing
// loud.
//
// A slow waltz in D major with one borrowed chord (C, the flat seventh) for
// a touch of the wistful: a harp picks the chords in rolling 8ths the way a
// guitar would by a fire, a felt piano keeps the bass, and the tune goes
// round the room: an ocarina first, then a clarinet with the strings warm
// under it. Then an evening part in G where the violas sing, a little warm
// part by the forge, a recorder and a solo violin, an anvil far off; and
// the tune once more with everybody, still quietly. Reference for the mood
// only: Toby Fox's "Fireplace" and the village themes of the Zelda games.
//
// THE CHAPTER'S TUNE (the "first cell", parts/chapter4.js): A D F E, made
// major here (A D F# E): the town remembers the Hero who came once fondly.
//
// D major, 88 BPM in 3/4, one step an 8th: a bar is about 2 seconds. The
// lamps play once (4 bars); then it loops from A, 64 bars, about 2m11s:
//
//   lamps   4 bars  the harp picking alone, the lamps coming on (glock)
//   A      16 bars  the tune on the ocarina over harp and piano
//   A2     16 bars  the clarinet takes it, the violins and violas warm
//                   under it, a very soft cello on the roots
//   evening 8 bars  G major, the violas sing, the lamps glint
//   forge   8 bars  by the forge: a recorder, a solo violin holding the
//                   harmony, an anvil far off, a soft drum
//   A3     16 bars  the tune with everybody, ocarina over violins an
//                   octave down, and it comes home to D

const BAR = 6;
const rest = (bars) => restBars(bars, BAR);
const tune = (text) => melody(text, 1);   // each token an 8th
const down = (steps, semitones) => steps.map((n) => (typeof n === 'number' ? n + semitones : n));
// A note, or a few, placed on given steps of a stretch of bars; rest silent.
const placed = (bars, notes) => {
  const out = rest(bars);
  for (const [step, note] of Object.entries(notes)) out[Number(step)] = midi(note);
  return out;
};

// --- The harmony, a bar each. ---
const A_CHORDS = 'D G D A Bm Em G A D G D G Em C A D';
const EVENING_CHORDS = 'G D Em Bm C G A A';
const FORGE_CHORDS = 'G D Em C G D C A';

// The harp, picking like a guitar by the fire: root, fifth, tenth, octave.
const PICK = [0, 7, 'tenth', 12, 'tenth', 7];
// The piano's bass: the root on the downbeat, left to ring.
const ROOT = [0, '-', '-', '-', '-', '-'];

// --- THE TUNE. Bars 1 and 2 are the cell, made major: A D F# E. ---
const TUNE = tune(`
  A4 - - - D5 - | F#5 - - - E5 - | D5 - - - A4 - | C#5 - - - - - |
  D5 - - - F#5 - | E5 - - - G5 - | F#5 - E5 - D5 - | E5 - - - - - |
  A4 - - - D5 - | F#5 - - - E5 - | D5 - F#5 - A5 - | G5 - - - F#5 - |
  G5 - F#5 - D5 - | E5 - - - C5 - | C#5 - - - E5 - | D5 - - - - - |
`);
// The evening part, on the violas (it was the cellos, which came out too
// heavy for a cosy town: a viola sings the same notes softer).
const EVENING = tune(`
  D4 - - - G4 - | F#4 - - - A4 - | G4 - - - E4 - | F#4 - - - - - |
  E4 - G4 - C5 - | B4 - - - G4 - | A4 - - - C#5 - | E4 - - - - - |
`);
// By the forge, on the recorder.
const FORGE = tune(`
  D5 - - - G5 - | F#5 - E5 - D5 - | E5 - - - B4 - | C5 - - - E5 - |
  D5 - B4 - G4 - | A4 - - - D5 - | E5 - - - G5 - | E5 - - - - - |
`);

export const BELOWTOWN_THEME = {
  title: 'Lamps Lit Early',
  bpm: 88,
  stepsPerBeat: 2,
  volume: 0.75,

  instruments: {
    // The picking: a harp, close, played like a guitar.
    harp: { sample: 'harp', volume: 0.2, ring: true, reverb: 0.45, pan: -0.15, humanize: { time: 0.012, volume: 0.2 } },
    // The bass: a felt piano, low and soft.
    piano: { sample: 'grandPiano', volume: 0.2, ring: true, reverb: 0.45, pan: -0.05, humanize: { time: 0.01, volume: 0.12 } },
    // The tune's voices.
    ocarina: { sample: 'ocarina', volume: 0.24, attack: 0.05, release: 0.45, reverb: 0.5, pan: 0.15, humanize: { time: 0.012, volume: 0.1 } },
    clarinet: { sample: 'clarinet', volume: 0.28, attack: 0.06, release: 0.5, reverb: 0.5, pan: 0.1, humanize: { time: 0.012, volume: 0.1 } },
    recorder: { sample: 'recorder', volume: 0.22, attack: 0.06, release: 0.5, reverb: 0.5, pan: 0.2, humanize: { time: 0.012, volume: 0.1 } },
    fiddle: { sample: 'soloViolin', volume: 0.2, attack: 0.4, release: 1, reverb: 0.55, pan: -0.2, humanize: { time: 0.012, volume: 0.1 } },
    // The strings, warm and quiet.
    violins: { sample: 'violins', volume: 0.12, attack: 0.6, release: 1.2, reverb: 0.55, pan: 0.25 },
    line: { sample: 'violins', volume: 0.16, attack: 0.25, release: 0.9, reverb: 0.5, pan: 0.2, humanize: { time: 0.012, volume: 0.1 } },
    violas: { sample: 'violas', volume: 0.13, attack: 0.7, release: 1.3, reverb: 0.55, pan: -0.25 },
    cellos: { sample: 'cellos', volume: 0.12, attack: 0.5, release: 1.2, reverb: 0.5, pan: -0.2 },
    // The evening tune's voice.
    singer: { sample: 'violas', volume: 0.3, attack: 0.25, release: 1, reverb: 0.55, pan: -0.15, humanize: { time: 0.012, volume: 0.1 } },
    // The lamps: a glockenspiel, high and uneven, like a flame.
    lamps: { sample: 'glock', volume: 0.07, ring: true, reverb: 0.6, pan: 0.35, echo: { time: 0.56, feedback: 0.25, mix: 0.25 } },
    // The forge at the end of the street: an anvil, far off; a soft drum.
    anvil: { sample: 'chimes', volume: 0.06, ring: true, reverb: 0.7, pan: -0.45 },
    drum: { sample: 'frameDrum', drum: 'sample', volume: 0.12, ring: true, reverb: 0.4, humanize: { time: 0.008, volume: 0.25 } },
  },

  sections: {
    // The harp alone, and the lamps coming on one by one.
    lamps: {
      harp: arpeggio('D D G A', BAR, 3, PICK),
      piano: [...rest(2), ...chordLine('G A', ROOT, 2)],
      lamps: drops('D D G A', BAR, 0.18, 3, 1),
    },

    // The tune on the ocarina, over the harp and the piano.
    A: {
      ocarina: TUNE,
      harp: arpeggio(A_CHORDS, BAR, 3, PICK),
      piano: chordLine(A_CHORDS, ROOT, 2),
      lamps: drops(A_CHORDS, BAR, 0.05, 11, 1),
    },

    // The clarinet takes it, the strings warm under it.
    A2: {
      clarinet: TUNE,
      harp: arpeggio(A_CHORDS, BAR, 3, PICK),
      piano: chordLine(A_CHORDS, ROOT, 2),
      violins: sustained(A_CHORDS, BAR, 1, 4),
      violas: sustained(A_CHORDS, BAR, 2, 3),
      cellos: sustained(A_CHORDS, BAR, 0, 2),
    },

    // Evening in G: the violas sing, the harp keeps picking, the lamps glint.
    evening: {
      singer: EVENING,
      harp: arpeggio(EVENING_CHORDS, BAR, 3, PICK),
      piano: chordLine(EVENING_CHORDS, ROOT, 2),
      violas: sustained(EVENING_CHORDS, BAR, 1, 4),
      lamps: drops(EVENING_CHORDS, BAR, 0.1, 41, 1),
    },

    // By the forge: the recorder, the solo violin holding the
    // harmony, an anvil far off and a soft drum on the downbeat.
    forge: {
      recorder: FORGE,
      fiddle: sustained(FORGE_CHORDS, BAR, 1, 4),
      harp: arpeggio(FORGE_CHORDS, BAR, 3, PICK),
      piano: chordLine(FORGE_CHORDS, ROOT, 2),
      violas: sustained(FORGE_CHORDS, BAR, 2, 3),
      anvil: [...placed(2, { 0: 'A4', 2: 'A4' }), ...rest(2), ...placed(2, { 0: 'A4', 2: 'A4' }), ...rest(2)],
      drum: repeat(hits('x.....'), 8),
    },

    // The tune with everybody, still quietly; home to D.
    A3: {
      ocarina: TUNE,
      line: down(TUNE, -12),
      harp: arpeggio(A_CHORDS, BAR, 3, PICK),
      piano: chordLine(A_CHORDS, ROOT, 2),
      violas: sustained(A_CHORDS, BAR, 2, 3),
      cellos: sustained(A_CHORDS, BAR, 0, 2),
      lamps: drops(A_CHORDS, BAR, 0.06, 23, 1),
      drum: [...rest(8), ...repeat(hits('x.....'), 7), ...rest(1)],
    },
  },

  // The lamps come on once; then the town goes round from the tune.
  order: ['lamps', 'A', 'A2', 'evening', 'forge', 'A3'],
  loopFrom: 1,
};
