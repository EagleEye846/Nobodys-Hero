import {
  melody, arpeggio, chordLine, sustained, midi, rest as restBars,
} from './parts/chapter4.js';
import { drops } from './parts/chapter3.js';

// "Built to Be Performed In": the theme of King Peptup's Hall, the throne
// room of Belowtown. Until now the hall borrowed the town's own song, but
// this room is a different animal: a dais under a roof-window, a red carpet,
// banners, glow-worm strings, the folk standing in two blocks along the
// aisle, and the great painted wooden king in front of his throne. It is a
// room made for a show, and the song is the show's stately little minuet,
// played softly, the way you would play it with a crowd waiting: a harp and
// a flute, pizzicato strings keeping the "one, two, three" very lightly,
// a glass bell for the spotlights. Not loud, no brass, no drums. It is
// grand the way a puppet theatre is grand, and a touch too tidy.
//
// The anticipation is in the tune. The hall's tune is the chapter's first
// cell in B flat (F Bb D C) and it asks its question at the top of every
// phrase. Then, in the hush, it is played one note to a bar on glass, as if
// the curtain were being drawn very slowly; the first time round the last
// note is wrong (B natural, a half step off the C it ought to be) and the
// second time it is right again. Nothing here says why. Reference for the
// mood only: the Zelda castle themes, and the gentler pieces of Toby Fox's
// kingdoms.
//
// B flat major with one borrowed chord (G flat, the flat sixth) and a
// plucked walking bass, 76 BPM in 3/4, one step an 8th: a bar is about 2.4
// seconds. The curtain plays once (4 bars); then it loops from A, 64 bars,
// about 2m31s:
//
//   curtain  4 bars  the harp picks alone, the glass bell catching the
//                    spotlights one at a time
//   A       16 bars  THE TUNE on the flute, harp picking, pizzicato bass
//                    and a light "pah-pah" on the violins
//   A2      16 bars  the oboe takes it, violas and a soft cello pad warm
//                    under it, the bell decorating
//   dais     8 bars  G minor: the clarinet climbs the steps, a solo violin
//                    holding the harmony, the harp rolling
//   hush     8 bars  the cell, a bar a note, on glass: the first time the
//                    last note is wrong; the second time it comes right
//   A3      16 bars  the tune with everybody, flute and violins together,
//                    and it comes home to B flat

const BAR = 6;
const rest = (bars) => restBars(bars, BAR);
const tune = (text) => melody(text, 1);   // each token an 8th
const down = (steps, semitones) => steps.map((n) => (typeof n === 'number' ? n + semitones : n));
// Fails loudly if a section's tracks are not all the same whole number of bars.
const tight = (name, section, bars) => {
  for (const [track, steps] of Object.entries(section)) {
    if (steps.length !== bars * BAR) throw new Error(`Built to Be Performed In ${name}: '${track}' is ${steps.length} steps, not ${bars} bars`);
  }
  return section;
};

// --- The harmony, a bar each. ---
const A_CHORDS = 'Bb Eb Bb F Gm Cm Eb F Bb Eb Bb Gb Eb Cm F F';
const A3_CHORDS = 'Bb Eb Bb F Gm Cm Eb F Bb Eb Bb Gb Eb Cm F Bb';
const DAIS_CHORDS = 'Gm Dm Eb Bb Cm Gm F F';
const HUSH_CHORDS = 'Bb Eb Bb Eb Bb Eb F F';

// The harp: root, fifth, tenth, octave, tenth, fifth; a gentle roll.
const PICK = [0, 7, 'tenth', 12, 'tenth', 7];
// The walking bass, plucked: root, fifth, third, one to a beat.
const WALK = [0, '-', 7, '-', 'third', '-'];
// The "pah-pah" of a minuet, very lightly: beats two and three.
const PAH = ['.', '.', 'third', '.', 7, '.'];

// --- THE TUNE. Bars 1 and 2 are the cell: F Bb D C. ---
const TUNE = tune(`
  F4 - - - Bb4 - | D5 - - - C5 - | Bb4 - - - F4 - | A4 - - - - - |
  Bb4 - - - D5 - | C5 - - - Eb5 - | D5 - C5 - Bb4 - | C5 - - - - - |
  F4 - - - Bb4 - | D5 - - - C5 - | D5 - F5 - Bb5 - | Ab5 - - - G5 - |
  F5 - G5 - Eb5 - | D5 - - - C5 - | Bb4 - A4 - G4 - | C5 - - - - -
`);
// The last time round it ends at home.
const TUNE_HOME = [...TUNE.slice(0, 15 * BAR), ...tune('Bb4 - - - - -')];
// The dais, on the clarinet: the same steps, a minor third lower.
const DAIS = tune(`
  D5 - - - G5 - | F5 - - - E5 - | G5 - - - Bb5 - | A5 - G5 - F5 - |
  Eb5 - - - G5 - | D5 - Bb4 - D5 - | C5 - A4 - C5 - | F5 - - - - -
`);
// The hush: the cell, a bar a note, on glass. First the wrong note, then the right.
const [f5, bb5, d6, c6] = [midi('F5'), midi('Bb5'), midi('D6'), midi('C6')];
const wrong = midi('B5');
const holdBar = (note) => [note, ...Array(BAR - 1).fill('-')];
const HUSH_TUNE = [
  ...holdBar(f5), ...holdBar(bb5), ...holdBar(d6), ...holdBar(wrong),
  ...holdBar(f5), ...holdBar(bb5), ...holdBar(d6), ...holdBar(c6),
];

export const THRONE_HALL_THEME = {
  title: 'Built to Be Performed In',
  bpm: 76,
  stepsPerBeat: 2,
  volume: 0.75,

  instruments: {
    // The picking: a harp, close.
    harp: { sample: 'harp', volume: 0.2, ring: true, reverb: 0.5, pan: -0.15, humanize: { time: 0.012, volume: 0.2 } },
    // The bass, plucked, and the pah-pah, plucked lighter.
    walk: { sample: 'cellosPizz', volume: 0.2, release: 0.5, reverb: 0.4, pan: -0.2, humanize: { time: 0.01, volume: 0.15 } },
    pah: { sample: 'violinsPizz', volume: 0.09, release: 0.4, reverb: 0.45, pan: 0.25, humanize: { time: 0.012, volume: 0.2 } },
    // The tune's voices.
    flute: { sample: 'flute', volume: 0.27, attack: 0.06, release: 0.5, reverb: 0.55, pan: 0.1, humanize: { time: 0.012, volume: 0.1 } },
    oboe: { sample: 'oboe', volume: 0.24, attack: 0.07, release: 0.5, reverb: 0.55, pan: 0.15, humanize: { time: 0.012, volume: 0.1 } },
    clarinet: { sample: 'clarinet', volume: 0.27, attack: 0.06, release: 0.5, reverb: 0.5, pan: -0.1, humanize: { time: 0.012, volume: 0.1 } },
    fiddle: { sample: 'soloViolin', volume: 0.2, attack: 0.4, release: 1, reverb: 0.55, pan: -0.2, humanize: { time: 0.012, volume: 0.1 } },
    // The strings, warm and quiet.
    violins: { sample: 'violins', volume: 0.12, attack: 0.5, release: 1.2, reverb: 0.55, pan: 0.25 },
    line: { sample: 'violins', volume: 0.15, attack: 0.25, release: 0.9, reverb: 0.5, pan: 0.2, humanize: { time: 0.012, volume: 0.1 } },
    violas: { sample: 'violas', volume: 0.13, attack: 0.7, release: 1.3, reverb: 0.55, pan: -0.25 },
    cellos: { sample: 'cellos', volume: 0.08, attack: 0.8, release: 1.4, reverb: 0.5, pan: -0.2 },
    // The spotlights: a glass bell, and glass for the slow cell.
    bell: { sample: 'glock', volume: 0.07, ring: true, reverb: 0.6, pan: 0.35, echo: { time: 0.79, feedback: 0.25, mix: 0.25 } },
    glass: { sample: 'glass', volume: 0.2, ring: true, reverb: 0.75, pan: 0.2, echo: { time: 0.79, feedback: 0.3, mix: 0.3 } },
  },

  sections: {
    // The harp alone, and the spotlights coming on one at a time.
    curtain: tight('curtain', {
      harp: arpeggio('Bb Bb Eb F', BAR, 3, PICK),
      bell: drops('Bb Bb Eb F', BAR, 0.2, 5, 1),
    }, 4),

    // The tune on the flute; the minuet keeping time underneath.
    A: tight('A', {
      flute: TUNE,
      harp: arpeggio(A_CHORDS, BAR, 3, PICK),
      walk: chordLine(A_CHORDS, WALK, 2),
      pah: arpeggio(A_CHORDS, BAR, 4, PAH),
      bell: drops(A_CHORDS, BAR, 0.04, 11, 1),
    }, 16),

    // The oboe takes it; violas and the softest cello warm it.
    A2: tight('A2', {
      oboe: TUNE,
      harp: arpeggio(A_CHORDS, BAR, 3, PICK),
      walk: chordLine(A_CHORDS, WALK, 2),
      pah: arpeggio(A_CHORDS, BAR, 4, PAH),
      violins: sustained(A_CHORDS, BAR, 1, 4),
      violas: sustained(A_CHORDS, BAR, 2, 3),
      cellos: sustained(A_CHORDS, BAR, 0, 2),
      bell: drops(A_CHORDS, BAR, 0.08, 23, 1),
    }, 16),

    // Up the dais steps in G minor: the clarinet, a solo violin holding
    // the harmony, the harp rolling, the pah-pah still going.
    dais: tight('dais', {
      clarinet: DAIS,
      fiddle: sustained(DAIS_CHORDS, BAR, 1, 4),
      harp: arpeggio(DAIS_CHORDS, BAR, 3, PICK),
      walk: chordLine(DAIS_CHORDS, WALK, 2),
      violas: sustained(DAIS_CHORDS, BAR, 2, 3),
      bell: drops(DAIS_CHORDS, BAR, 0.1, 41, 1),
    }, 8),

    // The curtain drawn very slowly. The fourth bar's note is wrong; the
    // eighth's is right.
    hush: tight('hush', {
      glass: HUSH_TUNE,
      harp: arpeggio(HUSH_CHORDS, BAR, 3, [0, '.', '.', 7, '.', '.']),
      violas: sustained(HUSH_CHORDS, BAR, 2, 3),
      cellos: sustained(HUSH_CHORDS, BAR, 0, 2),
    }, 8),

    // Everybody, still quietly; home to B flat.
    A3: tight('A3', {
      flute: TUNE_HOME,
      line: down(TUNE_HOME, -12),
      harp: arpeggio(A3_CHORDS, BAR, 3, PICK),
      walk: chordLine(A3_CHORDS, WALK, 2),
      pah: arpeggio(A3_CHORDS, BAR, 4, PAH),
      violas: sustained(A3_CHORDS, BAR, 2, 3),
      cellos: sustained(A3_CHORDS, BAR, 0, 2),
      bell: drops(A3_CHORDS, BAR, 0.06, 7, 1),
    }, 16),
  },

  // The curtain goes up once; then the room goes round from the tune.
  order: ['curtain', 'A', 'A2', 'dais', 'hush', 'A3'],
  loopFrom: 1,
};
