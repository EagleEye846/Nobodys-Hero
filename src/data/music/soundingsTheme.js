import {
  melody, sustained, chordLine, transpose, rest as restBars,
  tight, midi, scatter,
} from './parts/chapter5.js';

// "The Soundings": the theme of the sea-cave dungeon under the cliffs
// between Merrow and the Beacon Isles. Old sailors lowered weighted lines
// down here to sound the depth, and the caves still feel measured: water
// drips into black pools, every sound comes back twice, and the tide moves
// the rooms around you. So the song is mysterious and puzzling rather than
// sad. A plucked-string drip and a harp drip each go round in their own
// cycle (10 and 14 sixteenths) against the 4/4 bar, so they slide past each
// other and only rarely meet, like two drips in a cave; a glass "ping" every
// two bars is the sounding line; very low, very soft cellos and harp hold
// the floor of the cave. The tune is glassy (a glock an octave up, like a
// celesta, doubled by bowed vibes) and it echoes: two written copies follow
// it a dotted 8th and a dotted quarter later, each softer and panned the
// other way, so every phrase comes back off the walls. A soft choir "oo"
// holds the chords. Reference for the mood only: Hollow Knight's Crystal
// Peak and Royal Waterways, Ocarina of Time's Water Temple, Zelda's Great
// Fairy rooms.
//
// THE COAST CELL (A D D E in D minor) is the tune's first bar, in F# minor:
// C# F# F# G#, and then it keeps going up (A) instead of stopping, as if
// the line were being paid out into deeper water. In C it is turned upside
// down (C# F# F# E) and sequenced down a step at a time, a third each go,
// while the bass sinks a note a bar: the weight going down.
//
// The puzzle is in the harmony too: A wanders by step down the scale under
// the tune, and B swings between D major and B-flat major (a chromatic
// third, the floor dropping away), with a Lydian G# over D.
//
// F# minor, 4/4 at 72 (a bar is 3.3 seconds); one step a 16th, 16 to a
// bar. The intro plays once (2 bars); then it loops from A, 36 bars, 2m00s:
//
//   intro   2 bars   7s    the drips alone, and one ping
//   A       8 bars  27s    the glass tune with its two echoes, over a bass
//                          that walks down F# E D C# B A, then D and C#
//   B       8 bars  27s    D and B-flat swapping; the tune on vibes and a
//                          low clarinet, the glock only echoing; choir in
//   C       8 bars  27s    the sounding: the cell upside down, a step lower
//                          each time, the bass sinking a note a bar to a
//                          G# major, choir; the drips carry on
//   A2      8 bars  27s    the glass tune again, fuller: choir, violas, a
//                          low flute under the second half
//   tail    4 bars  13s    the drips, the pings and the deep notes; C# major
//                          hangs and loops back round to A

const BAR = 16;
const tune = (text) => melody(text, 2);   // each token an 8th: 8 to a bar
const rest = (bars) => restBars(bars, BAR);
const fit = (name, section, bars) => tight('The Soundings', name, section, bars, BAR);

// --- Harmony, a bar each ---
const INTRO_CHORDS = 'F#m F#m';
const A_CHORDS = 'F#m E D C#m Bm A D C#';
const B_CHORDS = 'D Bb D Bb F#m D C# C#';
const C_CHORDS = 'F#m E D C#m Bm A G# C#';
const TAIL_CHORDS = 'F#m E D C#';

// --- The tunes ---
// A: the cell (C# F# F# G#) keeps climbing; a step-by-step fall answers.
const TUNE_A = tune(`
  C#5 - F#5 F#5 G#5 - A5 -   G#5 - - E5 - - . .
  F#5 - - A5 - - F#5 -       E5 - - - - - . .
  D5 - F#5 - B5 - A5 -       C#6 - - B5 A5 - E5 -
  F#5 - - - A5 - B5 -        G#5 - - - - - . .
`);
// B: falling thirds, D major then B-flat; ends on the dominant.
const TUNE_B = tune(`
  A5 - - - F#5 - D5 -        F5 - - - D5 - Bb4 -
  A4 - D5 - F#5 - A5 -       Bb5 - - - A5 - F5 -
  F#5 - - - E5 - C#5 -       D5 - - - A4 - . .
  E#5 - - - G#5 - - -        C#5 - - - - - . .
`);
// C: the cell upside down (C# F# F# E), and down a step each time.
const TUNE_C = tune(`
  C#5 - F#5 F#5 E5 - - -     B4 - - - - - . .
  A4 - D5 D5 C#5 - - -       G#4 - - - - - . .
  F#4 - B4 B4 A4 - - -       E4 - - - - - . .
  G#4 - B#4 - D#5 - - -      C#5 - - - - - . .
`);

// --- The echoes off the walls: a copy of a track `steps` later. ---
const late = (track, steps) => [...Array(steps).fill('.'), ...track.slice(0, track.length - steps)];

// --- The drips: notes in a cycle of `period` 16ths that ignores the bar.
// One long count for the whole song, so each section carries on the drift.
const START = { intro: 0, A: 2, B: 10, C: 18, A2: 26, tail: 34 };
function cycle(name, bars, period, offset, notes) {
  const out = [];
  const from = START[name] * BAR;
  for (let s = from; s < from + bars * BAR; s++) {
    const k = s - offset;
    out.push(k >= 0 && k % period === 0 ? midi(notes[Math.floor(k / period) % notes.length]) : '.');
  }
  return out;
}
// Plucked violins every 10 16ths; the harp every 14. Notes that sit on
// F# minor; in B they change to D and A, which sit on both D and B-flat.
const pizz = (name, bars, notes = ['C#6', 'F#5']) => cycle(name, bars, 10, 0, notes);
const harpDrip = (name, bars, notes = ['G#5', 'C#6', 'E5']) => cycle(name, bars, 14, 5, notes);
// The sounding line: a glass ping every two bars, on the beat.
const pings = (bars, note = 'C#6') => scatter(bars, BAR, Array.from({ length: bars / 2 }, (_, i) => [i * 2, 0, note]));

// The cave floor: a deep harp note on the root, and slow, muffled cellos.
const deepHarp = (chords) => chordLine(chords, [0, ...Array(15).fill('.')], 1);
const deep = (chords) => sustained(chords, BAR, 0, 2);

export const SOUNDINGS_THEME = {
  title: 'The Soundings',
  bpm: 72,
  stepsPerBeat: 4,
  volume: 1.6,

  instruments: {
    // The celesta: a glock played an octave up, and its two echoes.
    glass: { sample: 'glock', volume: 0.12, ring: true, octave: 1, reverb: 0.7, pan: 0.1, humanize: { time: 0.01, volume: 0.12 } },
    echo1: { sample: 'glock', volume: 0.06, ring: true, octave: 1, reverb: 0.8, pan: -0.45, muffle: 4000 },
    echo2: { sample: 'glock', volume: 0.03, ring: true, octave: 1, reverb: 0.9, pan: 0.5, muffle: 2500 },
    vibes: { sample: 'vibesBowed', volume: 0.11, attack: 0.2, release: 1.2, reverb: 0.75, pan: 0.15 },
    clarinet: { sample: 'clarinet', volume: 0.14, attack: 0.15, release: 0.7, reverb: 0.65, pan: -0.2 },
    flute: { sample: 'flute', volume: 0.12, attack: 0.25, release: 0.8, reverb: 0.7, pan: -0.3 },
    pizz: { sample: 'violinsPizz', volume: 0.13, release: 0.2, reverb: 0.7, pan: 0.35, humanize: { time: 0.008, volume: 0.2 }, echo: { time: 0.42, feedback: 0.25, mix: 0.25 } },
    harpDrip: { sample: 'harp', volume: 0.12, ring: true, reverb: 0.7, pan: -0.35, humanize: { time: 0.01, volume: 0.2 } },
    ping: { sample: 'glass', volume: 0.06, ring: true, reverb: 0.85, pan: 0.2, echo: { time: 0.83, feedback: 0.4, mix: 0.35 } },
    deepHarp: { sample: 'harp', volume: 0.18, ring: true, reverb: 0.7, pan: -0.1 },
    deep: { sample: 'cellos', volume: 0.09, attack: 1.4, release: 2.0, reverb: 0.6, pan: 0, muffle: 450 },
    violas: { sample: 'violas', volume: 0.08, attack: 1.4, release: 1.8, reverb: 0.7, pan: -0.2, muffle: 1800 },
    choir: { sample: 'choir', volume: 0.07, attack: 1.6, release: 2.0, reverb: 0.85 },
    choirHigh: { sample: 'choir', volume: 0.05, attack: 1.8, release: 2.2, reverb: 0.9, pan: 0.2 },
  },

  sections: {
    intro: fit('intro', {
      pizz: pizz('intro', 2),
      harpDrip: harpDrip('intro', 2),
      ping: pings(2),
      deep: deep(INTRO_CHORDS),
    }, 2),

    A: fit('A', {
      glass: TUNE_A,
      vibes: transpose(TUNE_A, 0),
      echo1: late(TUNE_A, 3),
      echo2: late(TUNE_A, 6),
      pizz: pizz('A', 8),
      harpDrip: harpDrip('A', 8),
      ping: pings(8),
      deepHarp: deepHarp(A_CHORDS),
      deep: deep(A_CHORDS),
    }, 8),

    B: fit('B', {
      vibes: TUNE_B,
      clarinet: transpose(TUNE_B, -12),
      echo1: late(TUNE_B, 3),
      echo2: late(TUNE_B, 6),
      pizz: pizz('B', 8, ['D6', 'A5']),
      harpDrip: harpDrip('B', 8, ['A5', 'D6', 'F#5']),
      ping: pings(8, 'D6'),
      deepHarp: deepHarp(B_CHORDS),
      deep: deep(B_CHORDS),
      choir: sustained(B_CHORDS, BAR, 1, 4),
    }, 8),

    C: fit('C', {
      vibes: TUNE_C,
      glass: late(TUNE_C, 8),
      echo1: late(TUNE_C, 11),
      pizz: pizz('C', 8),
      harpDrip: harpDrip('C', 8),
      ping: pings(8),
      deepHarp: deepHarp(C_CHORDS),
      deep: deep(C_CHORDS),
      choir: sustained(C_CHORDS, BAR, 0, 4),
      choirHigh: sustained(C_CHORDS, BAR, 2, 4),
    }, 8),

    A2: fit('A2', {
      glass: TUNE_A,
      vibes: transpose(TUNE_A, 0),
      echo1: late(TUNE_A, 3),
      echo2: late(TUNE_A, 6),
      flute: [...rest(4), ...transpose(TUNE_A, -12).slice(4 * BAR)],
      pizz: pizz('A2', 8),
      harpDrip: harpDrip('A2', 8),
      ping: pings(8),
      deepHarp: deepHarp(A_CHORDS),
      deep: deep(A_CHORDS),
      violas: sustained(A_CHORDS, BAR, 1, 3),
      choir: sustained(A_CHORDS, BAR, 2, 4),
    }, 8),

    tail: fit('tail', {
      pizz: pizz('tail', 4),
      harpDrip: harpDrip('tail', 4),
      ping: pings(4),
      deepHarp: deepHarp(TAIL_CHORDS),
      deep: deep(TAIL_CHORDS),
      vibes: [...rest(3), midi('E#5'), ...Array(BAR - 1).fill('-')],
    }, 4),
  },

  order: ['intro', 'A', 'B', 'C', 'A2', 'tail'],
  loopFrom: 1,
};
