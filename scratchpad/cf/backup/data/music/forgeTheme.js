import {
  melody, hits, repeat, sustained, chordLine, rest as restBars, midi, cellIn,
  BAR_44 as BAR,
} from './parts/chapter4.js';

// "Hn.": the shop theme of HOBNAIL'S FORGE, the mole smith's stone room over
// the heat vent in Belowtown (and the place the hero's Fallen Star gets
// reforged). Hobnail says as little as he can, so the song says it for him:
// the hammer is the rhythm. A low tom is the hammer's weight, a glockenspiel
// "ting" is the anvil ringing after each blow, a timpani sits on the floor,
// and the only tune is a grunt, two or three notes at a time, on a trombone
// and a low sax (the bassoon's job, near enough, as in the town song). Under
// it the bellows breathe: cellos and violas swelling in and sighing out once
// a bar, and a warm low horn held on the root like the glow of the vent.
// Slow enough to work to, and the groove never changes its mind, so it
// doesn't tire when you stand there deciding what to buy. Reference for the
// feel only: Kondo's shop tunes (one patient loop, a plain bass, nothing
// showy) and Undertale's workaday town music.
//
// WHAT IT QUOTES. THE CHAPTER'S CELL (parts/chapter4.js, "the Hero came,
// and..."): D G Bb A in G minor, the grunt itself. Hobnail's whole tune is
// that cell a piece at a time (D G Bb... and then, in the next bar, A). And
// in the glow, the one place he lets himself hum, the clarinet plays the
// tune of "Lamps Lit Early" (belowtownTheme.js) in G major, low, with the
// lamps' glockenspiel cell over it: he belongs to the town, he'd just never
// say so. The town tune is a waltz; Hobnail hums it in his own 4/4, two of
// its bars to each of his, a long note and a short one, so it comes out
// lopsided and gruff but every note is there.
//
// G minor, 96 BPM, one step a 16th note: a bar is 2.5 seconds. 4 sections of
// 8 bars, 32 bars, 80 seconds, all looping:
//
//   work    8 bars  (0:00)  the hammer alone with the bellows: tom, anvil
//                           ting, timpani on G; the grunt on a trombone,
//                           bar by bar; Gm Gm Cm Gm, Gm Eb D Gm
//   talk    8 bars  (0:20)  the low walking bass joins, frame drum on the
//                           off-beats; the trombone grunts and the sax
//                           grunts back (two of them not saying much), Gm
//                           Cm Gm D, Gm Cm D Gm
//   glow    8 bars  (0:40)  the vent: G major (the town song's own chords,
//                           two to a bar, with its one borrowed F), the
//                           hammer slows to two
//                           blows a bar, the clarinet hums "Lamps Lit
//                           Early", the lamps' cell on the glockenspiel,
//                           the cell major on the sax, warm horns
//   work2   8 bars  (1:00)  back to it: the grunt with the whole cell, the
//                           bass again, the sax answering, and a held G at
//                           the end as the hammer stops, so the loop picks
//                           the hammer up like a new heat

const rest = (bars) => restBars(bars, BAR);
const tune = (text) => melody(text, 2);   // each token an 8th, 8 to a bar

// --- Harmony, a bar each. ---
const WORK_CHORDS = 'Gm Gm Cm Gm Gm Eb D Gm';
const TALK_CHORDS = 'Gm Cm Gm D Gm Cm D Gm';
// The town song's chords (belowtownTheme.js's A_CHORDS, a fourth up into G),
// two to a bar, half a bar each.
const GLOW_CHORDS = 'G C G D Em Am C D G C G C Am F D G';
const HALF = BAR / 2;

// --- The hammer: one string per bar, 16 steps. A 3+3+2 knock, then a
// pause while he turns the iron with the tongs. ---
const H = 'x..x..x.x.......';
const H2 = 'x..x..x.x..x....';
const H3 = 'x..x..x.x.x.x...';
const H4 = 'x..x..x.x..x.x.x';
const SLOW = 'x.......x.......';
const WORK_HAMMER = [H, H, H2, H, H, H3, H2, H4];
const TALK_HAMMER = [H, H2, H, H3, H, H2, H3, H4];
const GLOW_HAMMER = [SLOW, SLOW, SLOW, SLOW, SLOW, SLOW, SLOW, SLOW];
const WORK2_HAMMER = [H, H3, H2, H, H, H2, H3, H];
const strikes = (bars) => bars.flatMap((bar) => hits(bar));
// The anvil's ring after each blow: a bell note on every strike, pitches
// taking turns (G and D, the fifth, like the anvil's two faces).
const ting = (bars, notes = [midi('G6'), midi('D6'), midi('G6'), midi('Bb6')]) => {
  let i = 0;
  return strikes(bars).map((s) => (s === 'x' ? notes[i++ % notes.length] : '.'));
};
// The timpani on the floor: G on the first blow of each bar (and D, the
// fifth above, halfway through the bar when the bass is walking).
const floor = (bars, offbeat = false) => bars.flatMap(() => {
  const out = Array(BAR).fill('.');
  out[0] = midi('G2');
  if (offbeat) out[8] = midi('D3');
  return out;
});

// --- The grunts. ---
const GRUNT_WORK = tune(`
  D3 . G3 - Bb3 - . . | A3 - - - . . . . | . . . . D3 . G3 - | G3 - - - . . . . |
  D3 . G3 - Bb3 - A3 - | Bb3 - G3 - Eb3 - . . | F#3 - A3 - . . D3 - | G3 - - - - - - -
`);
const GRUNT_TALK = tune(`
  G3 - - . Bb3 - . . | C4 - Bb3 - G3 - . . | . . D3 . G3 - . . | F#3 - A3 - D4 - . . |
  G3 - - . Bb3 - . . | C4 - Eb4 - D4 - . . | . . . . D3 . G3 - | G3 - - - - - - -
`);
// The other grunt: a low sax answering in the gaps, never in the same bar as
// the trombone has much to say. The cell, one piece at a time.
const ANSWER = tune(`
  . . . . . . . . | . . . . . . D3 - | G3 - Bb3 - . . . . | . . . . . . . . |
  . . . . . . . . | . . . . . . G3 - | Bb3 - A3 - . . . . | . . . . . . . .
`);
// The glow: the cell in G major (D G B A) on the sax, twice.
const GLOW_SAX = tune(`
  D3 . G3 - B3 - A3 - | . . . . . . . . | . . . . . . . . | . . . . . . . . |
  D3 . G3 - B3 - A3 - | . . . . . . . . | . . . . . . . . | G3 - - - - - - -
`);
// "Lamps Lit Early", the town tune from belowtownTheme.js (its TUNE, note for
// note, a fourth up into G), an octave lower, on the clarinet. Each 3/4 bar
// of the waltz becomes half of one of these bars: its long note a dotted
// quarter, its short one an 8th. It starts with the chapter's cell, D G B A.
const TOWN_TUNE = melody(`
  D5 - - G5 | B5 - - A5 | G5 - - D5 | F#5 - - - |
  G5 - - B5 | A5 - - C6 | B5 - A5 G5 | A5 - - - |
  D5 - - G5 | B5 - - A5 | G5 - B5 D6 | C6 - - B5 |
  C6 - B5 G5 | A5 - - F5 | F#5 - - A5 | G5 - - - |
`, 2).map((n) => (typeof n === 'number' ? n - 12 : n));
// The lamps: the cell on the glockenspiel in 8ths, in G major.
const [g0, g1, g2, g3] = cellIn('G6');
const LAMP = [g0, '.', g1, '.', g2, '.', g3, '.', '.', '.', '.', '.', '.', '.', '.', '.'];

// --- Patterns, a bar each. ---
const WALK = [0, '-', '-', '-', '-', '-', 7, '-', 0, '-', '-', '-', 7, '-', '.', '.'];
const BREATH = [0, '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'];
const OFFBEAT = hits('....x.......x...');

export const FORGE_THEME = {
  title: 'Hn.',
  bpm: 96,
  stepsPerBeat: 4,
  volume: 0.9,

  instruments: {
    // The hammer: a low tom for the weight of it, an anvil ring on top.
    hammer: { sample: 'tom', drum: 'sample', volume: 0.34, ring: true, reverb: 0.15, humanize: { time: 0.004, volume: 0.15 } },
    anvil: { sample: 'glock', volume: 0.1, release: 0.5, ring: true, pan: 0.3, reverb: 0.4, humanize: { time: 0.003, volume: 0.15 } },
    timp: { sample: 'timpani', volume: 0.3, ring: true, reverb: 0.25, humanize: { time: 0.004, volume: 0.1 } },
    knock: { sample: 'frameDrum', drum: 'sample', volume: 0.12, ring: true, reverb: 0.2, humanize: { time: 0.004, volume: 0.25 } },
    // The grunts.
    trombone: { sample: 'trombone', volume: 0.26, attack: 0.05, release: 0.25, reverb: 0.3, pan: -0.15, humanize: { time: 0.008, volume: 0.1 } },
    sax: { sample: 'sax', volume: 0.2, attack: 0.05, release: 0.25, reverb: 0.3, pan: 0.2, humanize: { time: 0.01, volume: 0.1 } },
    clarinet: { sample: 'clarinet', volume: 0.2, attack: 0.05, release: 0.3, reverb: 0.4, pan: -0.1, humanize: { time: 0.01, volume: 0.1 } },
    lamps: { sample: 'glock', volume: 0.1, ring: true, pan: 0.35, reverb: 0.55, echo: { time: 0.47, feedback: 0.3, mix: 0.3 } },
    // The bass.
    tuba: { sample: 'tuba', volume: 0.28, attack: 0.02, release: 0.15, reverb: 0.2, humanize: { time: 0.006, volume: 0.1 } },
    // The bellows: swelling in and sighing out, once a bar.
    bellows: { sample: 'cellos', volume: 0.17, attack: 1.0, release: 0.9, reverb: 0.4, pan: -0.25 },
    bellowsHigh: { sample: 'violas', volume: 0.14, attack: 1.1, release: 0.9, reverb: 0.4, pan: 0.2 },
    // The vent's warmth: a horn on the roots, an octave over the bellows.
    glowHorn: { sample: 'hornsSoft', volume: 0.12, attack: 0.9, release: 1.0, reverb: 0.5, pan: 0.1 },
  },

  sections: {
    // The hammer alone with the bellows; the grunt, a piece at a time.
    work: {
      hammer: strikes(WORK_HAMMER),
      anvil: ting(WORK_HAMMER),
      timp: floor(WORK_HAMMER),
      trombone: GRUNT_WORK,
      bellows: sustained(WORK_CHORDS, BAR, 0, 2),
      bellowsHigh: sustained(WORK_CHORDS, BAR, 2, 3),
    },

    // The bass walks in; the sax grunts back.
    talk: {
      hammer: strikes(TALK_HAMMER),
      anvil: ting(TALK_HAMMER),
      timp: floor(TALK_HAMMER, true),
      knock: repeat(OFFBEAT, 8),
      trombone: GRUNT_TALK,
      sax: ANSWER,
      tuba: chordLine(TALK_CHORDS, WALK, 2),
      bellows: sustained(TALK_CHORDS, BAR, 0, 2),
      bellowsHigh: sustained(TALK_CHORDS, BAR, 2, 3),
    },

    // The vent: G major, the town song hummed, the lamps lit.
    glow: {
      hammer: strikes(GLOW_HAMMER),
      anvil: ting(GLOW_HAMMER, [midi('G6'), midi('B6')]),
      timp: floor(GLOW_HAMMER),
      clarinet: TOWN_TUNE,
      sax: GLOW_SAX,
      lamps: [...LAMP, ...rest(3), ...LAMP, ...rest(3)],
      tuba: chordLine(GLOW_CHORDS, BREATH.slice(0, HALF), 2),
      bellows: sustained(GLOW_CHORDS, HALF, 0, 2),
      bellowsHigh: sustained(GLOW_CHORDS, HALF, 1, 3),
      glowHorn: sustained(GLOW_CHORDS, HALF, 0, 3),
    },

    // Back to it; the loop ends on a held G and a hammer waiting to fall.
    work2: {
      hammer: strikes(WORK2_HAMMER),
      anvil: ting(WORK2_HAMMER),
      timp: floor(WORK2_HAMMER, true),
      knock: repeat(OFFBEAT, 8),
      trombone: GRUNT_WORK,
      sax: ANSWER,
      tuba: chordLine(WORK_CHORDS, WALK, 2),
      bellows: sustained(WORK_CHORDS, BAR, 0, 2),
      bellowsHigh: sustained(WORK_CHORDS, BAR, 2, 3),
    },
  },

  order: ['work', 'talk', 'glow', 'work2'],
};
