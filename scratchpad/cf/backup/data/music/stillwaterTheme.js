import { arpeggio, sustained } from '../../audio/notation.js';
import { slow, rest as restBars, held, until as untilBars, midi } from './parts/chapter3.js';
import { cellIn, FIRST_STEPS_MINOR, BAR_128 as BAR } from './parts/chapter4.js';

// "Slow Water": the theme of the Stillwater, the lake at the bottom of the
// buried kingdom. A cavern so wide the roof is out of sight, black water
// without a ripple, pale fish turning far down, islands of old stone, a
// frog ferryman humming as he poles his punt, and on the water, upside
// down, a faint copy of everything. Vast, still, beautiful and lonely: the
// place in the chapter where nothing is trying to stop you, and that is
// somehow worse. Written in the manner of Hollow Knight's Blue Lake and
// Resting Grounds (reference for the mood only): very few notes, each one
// left to ring in a hall, a pad of strings under them that hardly seems to
// move, and a single voice (an oboe, then a viola) singing a tune that
// seems to be addressed to nobody. The lowest notes are a very soft cello
// pad and nothing more: no big cello lines in an area theme.
//
// THE CHAPTER'S TUNE (the "first cell", parts/chapter4.js): E A C B here, in
// A minor, up a fourth, up a minor third, one step down, played on the
// oboe in long notes, a bar to each pair. The B at the top of the cell sits
// over F major, which is the Lydian sharp fourth: the note that looks up.
// In the middle part the water takes it: a harp plays the cell once, and a
// bowed vibraphone plays it back in the water, upside down in time (B C A
// E) and an octave lower, and the second time the mirror stops one note
// short. The E never comes back from the water.
//
// A minor, 12/8 at 52 dotted quarters a minute, one step an 8th: a bar is 4.6
// seconds. The calm plays once (2 bars, 9s); then it loops from A, 30 bars,
// about 2m19s:
//
//   calm    2 bars  a low A, a few drops of piano on the pad
//   A       8 bars  THE TUNE: the oboe, long notes, over the pad and drops
//   B       8 bars  the viola's song, lower and warmer, with a solo violin
//                   a bar behind it for the second half; a harp turning
//   C       6 bars  the reflection: the harp's cell and the vibraphone's
//                   mirror of it, a glass tone held, nothing else but drops
//   D       8 bars  the tune again, with everything, the harp turning
//                   over, the violin high above; the last bar hangs on G#

const rest = (bars) => restBars(bars, BAR);
const until = (bars, track) => untilBars(bars, track, BAR);
// Fails loudly if a section's tracks are not all the same whole number of bars.
const tight = (name, section, bars) => {
  for (const [track, steps] of Object.entries(section)) {
    if (steps.length !== bars * BAR) throw new Error(`Slow Water ${name}: '${track}' is ${steps.length} steps, not ${bars} bars`);
  }
  return section;
};

// --- The harmony, a bar each. ---
const A_CHORDS = 'Am F C G Am F Dm E';
const B_CHORDS = 'Am F C G Dm F E Am';
const C_CHORDS = 'Am F Dm Am F E';
const CALM_CHORDS = 'Am Am';

// --- THE TUNE (each token a dotted quarter, four to a bar). ---
// The cell first (E A C B), its answer falling to G and D, then the cell
// again and a lift to D, and the leading note of E major left hanging.
const TUNE_A = slow(`
  E5 - - A5 | C6 - - B5 | G5 - E5 - | D5 - - - |
  E5 - - A5 | C6 - - D6 | C6 - A5 - | G#5 - - - |
`);
// The viola's song: shorter steps, moving more, still in long notes.
const TUNE_B = slow(`
  E4 - - A4 | A4 - G4 F4 | E4 - - G4 | D4 - - B3 |
  F4 - - A4 | C5 - - A4 | G#4 - B4 - | A4 - - - |
`);
// The solo violin, a bar behind the viola's second half, an octave up.
const VIOLIN_B = [...rest(4), ...TUNE_B.slice(4 * BAR, 8 * BAR).map((n) => (typeof n === 'number' ? n + 12 : n))];

// The water's mirror of the cell: it plays back to front, an octave down.
const [c0, c1, c2, c3] = cellIn('A5', FIRST_STEPS_MINOR);       // E A C B
const CELL = slow(`${nameOf(c0)} ${nameOf(c1)} ${nameOf(c2)} ${nameOf(c3)}`);
const MIRROR = slow(`${nameOf(c3 - 12)} ${nameOf(c2 - 12)} ${nameOf(c1 - 12)} ${nameOf(c0 - 12)}`);
const MIRROR_SHORT = slow(`${nameOf(c3 - 12)} ${nameOf(c2 - 12)} ${nameOf(c1 - 12)} -`);

function nameOf(note) {
  const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  return `${names[note % 12]}${Math.floor(note / 12) - 1}`;
}

// Water: now and then, one high chord tone, left to ring (the same idea as
// the marsh's drops, but lower, so a harp can play them as well).
function drip(chords, chance, seed, every = 3) {
  let s = seed >>> 0;
  const rand = () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296;
  return arpeggio(chords, BAR, 5, [0, 7, 'third', 12, 7, 0, 'third', 7, 12, 7, 'third', 0])
    .map((note, i) => (i % every === 0 && rand() < chance ? note : '.'));
}

// The harp turning: three notes of the chord, rising in 8ths, once a bar
// at the bar's start, then the top note left alone in the bar's second half.
const TURN = [0, 1, 2, 3, '.', '.', 2, '.', '.', '.', '.', '.'];
const turning = (chords) => arpeggio(chords, BAR, 4, [0, 7, 'third', 12, 7, 'third', 12, 0, 7, 12, 7, 0])
  .map((note, i) => (TURN[i % BAR] === '.' ? '.' : note));
// A low root, once a bar, long.
const rootsOf = (chords, octave) => sustained(chords, BAR, 0, octave);

export const STILLWATER_THEME = {
  title: 'Slow Water',
  bpm: 52,
  stepsPerBeat: 3,
  // An area theme, and a quiet one.
  volume: 0.55,

  instruments: {
    // The oboe sings the tune: a slow breath, a long tail, a lot of hall.
    oboe: { sample: 'oboe', volume: 0.5, attack: 0.18, release: 0.8, reverb: 0.7, pan: 0.1, humanize: { time: 0.012, volume: 0.1 } },
    viola: { sample: 'violas', volume: 0.42, attack: 0.25, release: 1, reverb: 0.65, pan: -0.15, humanize: { time: 0.014, volume: 0.1 } },
    violin: { sample: 'soloViolin', volume: 0.26, attack: 0.5, release: 1.4, reverb: 0.85, pan: 0.35, humanize: { time: 0.012, volume: 0.1 } },
    // The pad: three layers that hardly seem to move.
    low: { sample: 'cellos', volume: 0.15, attack: 1.4, release: 2, reverb: 0.55, pan: -0.1 },
    mid: { sample: 'violas', volume: 0.24, attack: 1.4, release: 2, reverb: 0.6, pan: 0.15 },
    high: { sample: 'violins', volume: 0.1, attack: 1.8, release: 2.2, reverb: 0.7, pan: -0.3 },
    // Drops of piano and harp falling on it.
    drops: { sample: 'grandPiano', volume: 0.26, ring: true, reverb: 0.75, pan: 0.35, humanize: { time: 0.03, volume: 0.3 } },
    harp: { sample: 'harp', volume: 0.3, ring: true, reverb: 0.7, pan: -0.3, humanize: { time: 0.012, volume: 0.2 } },
    harpLow: { sample: 'harp', volume: 0.2, ring: true, reverb: 0.6, pan: 0.2, humanize: { time: 0.012, volume: 0.2 } },
    // The water's copy: bowed vibraphone, soft, with a long dark echo.
    mirror: { sample: 'vibesBowed', volume: 0.3, attack: 0.15, release: 1.2, reverb: 0.8, pan: 0.4, echo: { time: 0.9, feedback: 0.45, mix: 0.45 } },
    glass: { sample: 'glass', volume: 0.1, attack: 1.8, release: 2.5, reverb: 0.85, pan: -0.4 },
  },

  sections: {
    // A low A, and a drop or two of piano on the dark.
    calm: tight('calm', {
      low: held(midi('A2'), 2 * BAR),
      mid: held(midi('E4'), 2 * BAR),
      drops: drip(CALM_CHORDS, 0.2, 3, 3),
    }, 2),

    // THE TUNE on the oboe, over the pad and the drops.
    A: tight('A', {
      oboe: TUNE_A,
      low: rootsOf(A_CHORDS, 2),
      mid: sustained(A_CHORDS, BAR, 1, 3),
      high: sustained(A_CHORDS, BAR, 2, 5),
      drops: drip(A_CHORDS, 0.16, 5, 3),
      harpLow: turning(A_CHORDS).map((n, i) => (i < 4 * BAR ? '.' : n)),
    }, 8),

    // The viola's song, with the violin a bar behind for the second half.
    B: tight('B', {
      viola: TUNE_B,
      violin: VIOLIN_B,
      low: rootsOf(B_CHORDS, 2),
      mid: sustained(B_CHORDS, BAR, 1, 3),
      high: sustained(B_CHORDS, BAR, 2, 5),
      drops: drip(B_CHORDS, 0.1, 8, 3),
      harpLow: turning(B_CHORDS),
    }, 8),

    // The reflection: the harp plays the cell; the water plays it back to
    // front, an octave down, and the second time it stops short.
    C: tight('C', {
      harp: [...CELL, ...rest(3), ...CELL, ...rest(1)],
      mirror: [...rest(2), ...MIRROR, ...rest(2), ...MIRROR_SHORT],
      low: until(5, rootsOf(C_CHORDS, 2)),
      mid: until(4, sustained(C_CHORDS, BAR, 1, 3)),
      glass: [...rest(2), ...held(midi('E5'), 4 * BAR)],
      drops: drip(C_CHORDS, 0.1, 12, 3),
    }, 6),

    // The tune again with everything; the violin high above for the second
    // half; the last bar left hanging on G#.
    D: tight('D', {
      oboe: TUNE_A,
      violin: [...rest(4), ...TUNE_A.slice(4 * BAR).map((n) => (typeof n === 'number' ? n + 12 : n))],
      low: rootsOf(A_CHORDS, 2),
      mid: sustained(A_CHORDS, BAR, 1, 3),
      high: sustained(A_CHORDS, BAR, 2, 5),
      drops: drip(A_CHORDS, 0.12, 21, 3),
      harpLow: turning(A_CHORDS),
    }, 8),
  },

  // The calm plays once; then the lake goes round from the tune.
  order: ['calm', 'A', 'B', 'C', 'D'],
  loopFrom: 1,
};
