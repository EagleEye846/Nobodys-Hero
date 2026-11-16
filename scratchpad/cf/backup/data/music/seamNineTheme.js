import {
  melody, arpeggio, chordLine, sustained, midi, cellIn, FIRST_STEPS_MINOR,
  rest as restBars, held, BAR_44 as BAR,
} from './parts/chapter4.js';
import { drops } from './parts/chapter3.js';

// "Left Tidy": the theme of Seam Nine, the secret branch of the Diggings
// the maps leave out. Nobody has been down it for a very long time, and
// whoever was last in left it tidy: a row of hard hats on nails, a table laid
// for a break, a tally board that stops in the middle of the week. Nothing
// is wrong in here. It is only very quiet, and it was left on purpose, by
// someone who meant to come back. So the song is a small lullaby for a
// room that is still waiting: a recorder, whistling more than playing, over
// a harp picking and a piano walking a slow bass; a solo violin for the
// second verse; a glass bell where the dust catches a lamp. Soft strings,
// woodwinds, nothing loud and nothing that could be a threat. Reference for
// the mood only: the quiet rooms in Toby Fox's Waterfall and the music box
// pieces of Hollow Knight.
//
// THE CHAPTER'S TUNE (the "first cell", parts/chapter4.js): G C Eb D here,
// in C minor, up a fourth, up a minor third, one step down, whistled in
// the first bar of each phrase. It is the tally board's tune: every time
// the song comes round, the phrase stops one note short, the way the
// tally stops mid-week, and in the table part the recorder starts the cell,
// three notes of it, and leaves it there. The last time round, the final
// note simply isn't played.
//
// C minor, then its relative E flat major in the middle, with a walking
// bass (the piano goes root, fifth, third, fifth); 66 BPM in 4/4, one step
// a 16th: a bar is about 3.6 seconds. The drip plays once (2 bars); then it
// loops from A, 36 bars, about 2m10s:
//
//   drip     2 bars  a low C, water dripping, one glass note
//   A        8 bars  THE TUNE on the recorder, harp picking, piano bass
//   A2       8 bars  a solo violin takes it, the recorder keeps the cell
//                    above it, violas hold
//   B        8 bars  E flat major: the oboe, the cell with its major third;
//                    the harp rolls, the glass bell glints
//   table    4 bars  the table laid for a break: piano chords, a cup
//                    set down on chimes, the recorder starts the cell and
//                    stops
//   A3       8 bars  the tune with everybody; the last phrase leaves out
//                    its final note

const rest = (bars) => restBars(bars, BAR);
const tune = (text) => melody(text, 2);   // each token an 8th
// Fails loudly if a section's tracks are not all the same whole number of bars.
const tight = (name, section, bars) => {
  for (const [track, steps] of Object.entries(section)) {
    if (steps.length !== bars * BAR) throw new Error(`Left Tidy ${name}: '${track}' is ${steps.length} steps, not ${bars} bars`);
  }
  return section;
};
const up = (steps, semitones) => steps.map((n) => (typeof n === 'number' ? n + semitones : n));

// --- The harmony, a bar each. ---
const A_CHORDS = 'Cm Ab Eb Bb Cm Ab Fm G';
const B_CHORDS = 'Eb Bb Cm Gm Ab Eb Fm G';
const TABLE_CHORDS = 'Ab Eb Cm G';

// The harp: root, fifth, tenth, octave, tenth, fifth, third, fifth, one every
// other step.
const PICK = [0, '-', 7, '-', 'tenth', '-', 12, '-', 'tenth', '-', 7, '-', 'third', '-', 7, '-'];
// The piano's walking bass: root, fifth, third, fifth, a beat each.
const WALK = [0, '-', '-', '-', 7, '-', '-', '-', 'third', '-', '-', '-', 7, '-', '-', '-'];
// The table's chords, rolled once and left to ring.
const ROLL = [0, '.', '.', '.', 7, '.', '.', '.', 'tenth', '.', '.', '.', '.', '.', '.', '.'];

// --- THE TUNE. Bars 1 and 3 are the cell: G C Eb D. ---
const TUNE = tune(`
  G4 - C5 - Eb5 - D5 - | C5 - - - - - - - | G4 - C5 - Eb5 - D5 - | Bb4 - - - - - - - |
  G4 - C5 - Eb5 - G5 - | F5 - - - Eb5 - D5 - | C5 - Ab4 - - - F4 - | D5 - - - - - - -
`);
// The middle, in E flat: the cell with its major third (Bb Eb G F).
const MIDDLE = tune(`
  Bb4 - Eb5 - G5 - F5 - | F5 - - - D5 - - - | Eb5 - - - G5 - - - | F5 - D5 - Bb4 - - - |
  C5 - Eb5 - Ab5 - - - | G5 - - - F5 - Eb5 - | Ab5 - G5 - F5 - Eb5 - | D5 - - - - - - -
`);
// The last time round the final phrase loses its end note (the F), and the
// last bar holds only the harmony.
const LAST = [...TUNE.slice(0, 6 * BAR), ...tune('C5 - Ab4 - - - . . | . . . . . . . .')];
// The recorder in the table part starts the cell and leaves it.
const [g, c, eb] = cellIn('C5', FIRST_STEPS_MINOR);
const START_ONLY = [g, '-', '-', '-', c, '-', '-', '-', eb, '-', '-', '-', '-', '-', '-', '-'];
// The cup set down: one chime, a bar in.
const CUP = [...rest(1), '.', '.', '.', '.', '.', '.', '.', '.', midi('E5'), '.', '.', '.', '.', '.', '.', '.', ...rest(2)];

export const SEAM_NINE_THEME = {
  title: 'Left Tidy',
  bpm: 66,
  stepsPerBeat: 4,
  volume: 0.75,

  instruments: {
    harp: { sample: 'harp', volume: 0.22, ring: true, reverb: 0.55, pan: -0.2, humanize: { time: 0.012, volume: 0.2 } },
    piano: { sample: 'grandPiano', volume: 0.2, ring: true, reverb: 0.55, pan: -0.05, humanize: { time: 0.012, volume: 0.15 } },
    // The whistler: a recorder, breathy and close.
    recorder: { sample: 'recorder', volume: 0.24, attack: 0.07, release: 0.6, reverb: 0.55, pan: 0.2, humanize: { time: 0.015, volume: 0.12 } },
    violin: { sample: 'soloViolin', volume: 0.2, attack: 0.4, release: 1, reverb: 0.7, pan: -0.15, humanize: { time: 0.012, volume: 0.1 } },
    oboe: { sample: 'oboe', volume: 0.22, attack: 0.08, release: 0.6, reverb: 0.55, pan: 0.15, humanize: { time: 0.012, volume: 0.1 } },
    violas: { sample: 'violas', volume: 0.13, attack: 1, release: 1.6, reverb: 0.6, pan: -0.25 },
    violins: { sample: 'violins', volume: 0.1, attack: 1, release: 1.6, reverb: 0.6, pan: 0.25 },
    // Dust catching a lamp: glass bell; a cup on a table: chimes.
    bell: { sample: 'glock', volume: 0.07, ring: true, reverb: 0.7, pan: 0.35, echo: { time: 0.909, feedback: 0.3, mix: 0.3 } },
    cup: { sample: 'chimes', volume: 0.07, ring: true, reverb: 0.7, pan: -0.4 },
    drone: { sample: 'cellos', volume: 0.07, attack: 2.5, release: 3, reverb: 0.55, pan: -0.1 },
  },

  sections: {
    // A low C, a drip of water, one glass note.
    drip: tight('drip', {
      drone: held(midi('C2'), 2 * BAR),
      bell: drops('Cm Cm', BAR, 0.18, 3, 2),
      harp: [...rest(1), ...arpeggio('Cm', BAR, 3, [0, '.', '.', '.', 7, '.', '.', '.', 'tenth', '.', '.', '.', '.', '.', '.', '.'])],
    }, 2),

    // The tune on the whistler, the harp picking, the piano walking.
    A: tight('A', {
      recorder: TUNE,
      harp: arpeggio(A_CHORDS, BAR, 3, PICK),
      piano: chordLine(A_CHORDS, WALK, 2),
      violas: sustained(A_CHORDS, BAR, 1, 3),
      bell: drops(A_CHORDS, BAR, 0.05, 11, 2),
    }, 8),

    // The solo violin takes the verse; the recorder keeps to the cell.
    A2: tight('A2', {
      violin: TUNE,
      recorder: [...up(TUNE.slice(0, BAR), 12), ...rest(1), ...up(TUNE.slice(2 * BAR, 3 * BAR), 12), ...rest(5)],
      harp: arpeggio(A_CHORDS, BAR, 3, PICK),
      piano: chordLine(A_CHORDS, WALK, 2),
      violas: sustained(A_CHORDS, BAR, 2, 3),
      violins: sustained(A_CHORDS, BAR, 1, 4),
      bell: drops(A_CHORDS, BAR, 0.07, 23, 2),
    }, 8),

    // E flat major: the oboe, the cell with its major third.
    B: tight('B', {
      oboe: MIDDLE,
      harp: arpeggio(B_CHORDS, BAR, 3, PICK),
      piano: chordLine(B_CHORDS, WALK, 2),
      violas: sustained(B_CHORDS, BAR, 1, 3),
      violins: sustained(B_CHORDS, BAR, 2, 4),
      bell: drops(B_CHORDS, BAR, 0.1, 41, 2),
    }, 8),

    // The table laid for a break. A cup set down. The recorder starts
    // the cell and leaves it.
    table: tight('table', {
      piano: arpeggio(TABLE_CHORDS, BAR, 3, ROLL),
      cup: CUP,
      recorder: [...rest(1), ...START_ONLY, ...rest(2)],
      violas: sustained(TABLE_CHORDS, BAR, 1, 3),
    }, 4),

    // Everybody. The last phrase leaves out its end.
    A3: tight('A3', {
      recorder: LAST,
      violin: [...up(TUNE.slice(0, 6 * BAR), 12), ...rest(2)],
      harp: arpeggio(A_CHORDS, BAR, 3, PICK),
      piano: chordLine(A_CHORDS, WALK, 2),
      violas: sustained(A_CHORDS, BAR, 2, 3),
      violins: sustained(A_CHORDS, BAR, 1, 4),
      drone: held(midi('C2'), 8 * BAR),
      bell: drops(A_CHORDS, BAR, 0.06, 7, 2),
    }, 8),
  },

  // The drip falls once; then the room goes round from the tune.
  order: ['drip', 'A', 'A2', 'B', 'table', 'A3'],
  loopFrom: 1,
};
