import {
  melody, midi, chordLine, sustained, transpose, rest as restBars, held, heldNotes,
  tight, scatter, drops, emberNotes,
} from './parts/chapter6.js';

// "Green Under Grey": the song for the buried woods and fields, chapter 6's
// third area. Past the town the ash lies over what used to be a wood: burnt
// orchards in their rows, a farmhouse buried to its roof with a farm on the
// roof, a mill race still running under a crust, and a meadow where flowers
// push up through the grey. The prettiest and saddest part of the chapter.
// The song is what the forest was, still trying to come through: a green
// tune, half buried under grey pads that never move.
//
// THE GREY (the first thing you hear, and it never changes): two notes held
// far back on soft violas and a quiet choir, muffled right down, B and F#.
// They are the first and last notes of THE EMBER CELL in B minor
// (parts/chapter6.js), the ash lying over everything. They don't follow the
// chords: over D they make a sixth, over G a major seventh, over A a ninth,
// so every chord under them sounds a little grey.
//
// THE HOOK (sing it; the first two bars are the whole song): the green. It
// grows out of the oboe's tune in the ash song's "THE GREEN" (A D E F#,
// ashTheme.js), now in 4/4: A D E F#, up to A, and falling back down the
// scale. It says that twice, the second time reaching up to B, and then
// the long answer is THE EMBER CELL itself: B C# D F#, then G falling to F#.
// In B minor those six notes are the ash's sigh; inside D major they sound
// like hope. Same notes, same ground. The answer climbs and comes home on D.
//
// HALF BURIED: the first time, the oboe plays the hook through a muffle, as
// if heard from under the ash, and it doesn't get home: it stops on A,
// asking. The second time a flute has it, clear, and it lands. In the
// payoff the oboe plays it clear with the flute over it, and it lands on D,
// but the grey is still under it, so the last chord is D over B.
//
// UNDER IT: a harp running in 8ths like the mill race (root, fifth, ninth,
// tenth: open and green), a soft low piano on the one and the "and" of two,
// leaning forward, and now and then the memory of a bird: two high notes on
// a flute far away, with an echo. Embers are three quick notes on the glass.
//
// THE MEADOW (B): G major with a sharp fourth (C#, the Lydian colour: the
// flowers coming up). A slow second tune on the solo violin that keeps
// climbing, plucked violins popping up three notes at a time like shoots,
// a clarinet holding under. The flute joins it for the second half.
//
// UNDER THE ASH (C, about 60% in): B minor. The harp thins to its roots,
// the ash comes down (a gust, embers, tremolo violas swelling far back) and
// a low clarinet plays the hook moved into minor, in pieces, then the ember
// cell twice, landing on F#. In the last two bars the buried oboe tries the
// hook's first bars again over it, and the low piano climbs A B C# into the
// payoff. Anticipation, never a boss song: no cellos, no brass on top, no
// drums.
//
// THE PAYOFF (A2): the hook on the oboe, clear, with the flute an octave
// over it, soft violins holding a long line, soft horns far back, the harp
// full.
//
// D major, over a B and F# that never leave. 4/4 at 92 BPM, one step a
// 16th (a bar is about 2.6 seconds). The intro plays once (4 bars); then it
// loops from A, 42 bars, about 1m50s:
//
//   intro   4 bars  0:00  the grey alone, a gust; the harp in bar 2; the low
//                         clarinet says the ember cell in B minor
//   A       8 bars  0:10  THE HOOK on the buried oboe; it stops on A, asking
//   A1      8 bars  0:31  the flute has it, clear; a soft piano answers in
//                         the gaps; it lands on D
//   B       8 bars  0:52  THE MEADOW: the solo violin in G Lydian, plucked
//                         shoots, the clarinet under; the flute joins
//   C       8 bars  1:13  UNDER THE ASH: B minor, the hook in pieces on the
//                         low clarinet, the cell twice, gusts and embers;
//                         the buried oboe tries again; the bass climbs into
//   A2      8 bars  1:34  THE PAYOFF: the oboe clear, the flute over it,
//                         soft violins and horns far back; D over B
//   tail    2 bars  1:55  the grey, the harp, a bird, round to A

const BAR = 16;
const tune = (text) => melody(text, 2);   // each token an 8th: 8 to a bar
const rest = (bars) => restBars(bars, BAR);
const fit = (name, section, bars) => tight('Green Under Grey', name, section, bars, BAR);
const up = (steps, semitones) => transpose(steps, semitones);

// --- Harmony, a bar each ---
const A_CHORDS = 'D G Bm A Bm G A A';       // the first time it asks
const A1_CHORDS = 'D G Bm A Bm G A D';
const A2_CHORDS = 'D G Bm A Bm G A Bm';     // home on D, over the grey
const B_CHORDS = 'G G Em A G G Bm A';
const C_CHORDS = 'Bm Bm G G Bm G Em A';
const INTRO_CHORDS = 'Bm Bm G A';
const TAIL_CHORDS = 'Bm A';

// --- THE HOOK: two short phrases on the green, answered by the ember cell
// (B C# D F#, G to F#) climbing home. ---
const HOOK_OPEN = `
  A4 - D5 E5 F#5 - A5 - | - - G5 F#5 E5 - D5 - |
  A4 - D5 E5 F#5 - B5 - | - - A5 - - - . . |
  B4 - C#5 D5 F#5 - - - | G5 - - F#5 - - . . |
`;
const HOOK = tune(`${HOOK_OPEN} E5 - F#5 G5 A5 - C#5 - | D5 - - - - - . . |`);
// The first time it doesn't get home: it climbs to A and hangs there.
const HOOK_ASKING = tune(`${HOOK_OPEN} E5 - F#5 G5 A5 - - - | - - - - - - . . |`);
// A soft piano answering in the gaps of A1 (where the hook holds).
const GAPS = tune(`
  . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . E6 C#6 A5 . |
  . . . . . . . . | . . . . . . D6 B5 | . . . . . . . . | . . F#5 A5 D6 - - . |
`);

// --- THE MEADOW (B): climbing, with the Lydian C# over G. ---
const MEADOW = tune(`
  D5 - - - E5 - F#5 - | A5 - - - B5 - C#6 - | B5 - - - A5 - G5 - | F#5 - - - - - E5 - |
  D5 - - - E5 - F#5 - | A5 - - - B5 - D6 - | C#6 - - - B5 - F#5 - | A5 - - - - - . . |
`);
// The shoots: three plucked notes popping up (bar, step, the lowest note).
const shoots = (at) => {
  const out = rest(8);
  for (const [bar, step, low, steps = [0, 2, 4]] of at) {
    steps.forEach((s, i) => { out[bar * BAR + step + i] = midi(low) + s; });
  }
  return out;
};

// --- UNDER THE ASH (C): the hook in B minor, in pieces, then the cell. ---
const CELL = (() => {
  const [a, b, c, d, e, f] = emberNotes('B3');   // B3 C#4 D4 F#4, G4 F#4
  return [a, '-', '-', '-', b, '-', c, '-', d, '-', '-', '-', '-', '-', '-', '-',
    e, '-', '-', '-', '-', '-', f, '-', '-', '-', '-', '-', '-', '-', '.', '.'];
})();
const PIECES = [
  ...tune('F#4 - B4 C#5 D5 - F#5 - | - - E5 D5 C#5 - - - | F#4 - B4 C#5 D5 - - - | . . . . . . . .'),
  ...CELL, ...CELL,
];
// The buried oboe trying the hook's first two bars over the last two.
const TRYING = [...rest(6), ...tune('A4 - D5 E5 F#5 - A5 - | - - G5 F#5 E5 - - -')];

// --- Over the payoff: the violins, high and long, a bar a note. ---
const DESCANT = heldNotes('F#5 B5 D6 C#6 D6 B5 C#6 B5', BAR);

// --- The grey: B and F#, held, breathing every four bars. ---
const grey = (bars, note, every = 4) => {
  const out = [];
  for (let b = 0; b < bars; b += every) out.push(...held(note, Math.min(every, bars - b) * BAR - 2), '.', '.');
  return out;
};

// --- The mill race: the harp in 8ths (root, fifth, ninth, tenth...). ---
const RACE = [0, '.', 7, '.', 14, '.', 'tenth', '.', 12, '.', 7, '.', 'tenth', '.', 14, '.'];
const race = (chords) => chordLine(chords, RACE, 3);
// Thinned to the root and fifth on the beats (under the ash).
const SPARE = [0, '.', '.', '.', 7, '.', '.', '.', 0, '.', '.', '.', 7, '.', '.', '.'];
const spare = (chords) => chordLine(chords, SPARE, 3);
// The low piano: the root on the one and on the "and" of two, leaning on.
const LEAN = [0, '-', '-', '-', '-', '-', 0, '-', '-', '-', '-', '-', '-', '-', '.', '.'];
const lean = (chords) => chordLine(chords, LEAN, 2).map((n) => (typeof n === 'number' && n < 40 ? n + 12 : n));

// The memory of a bird: two high notes, far away (bar, step, 'A6 F#6').
const birds = (bars, at) => {
  const out = rest(bars);
  for (const [bar, step, notes] of at) notes.split(' ').forEach((name, i) => { out[bar * BAR + step + i * 2] = midi(name); });
  return out;
};
// Embers: three quick notes rising on the glass.
const embers = (bars, at) => {
  const out = rest(bars);
  for (const [bar, step, notes = 'B5 D6 F#6'] of at) notes.split(' ').forEach((name, i) => { out[bar * BAR + step + i] = midi(name); });
  return out;
};
// Wind: the cymbal swell, muffled, on the bars given.
const gusts = (bars, at) => {
  const out = rest(bars);
  for (const b of at) out[b * BAR] = 60;
  return out;
};
// Ash falling: high harp notes, now and then (seeded, the same each loop).
const flakes = (chords, seed, chance = 0.12) => transpose(drops(chords, BAR, chance, seed, 4), -12);

export const BURIED_WOODS_THEME = {
  title: 'Green Under Grey',
  bpm: 92,
  stepsPerBeat: 4,
  // An area song: level with the others (about -26.5 on tools/loudnessCheck.html).
  volume: 1.04,

  instruments: {
    // The green: the oboe buried (through a muffle, far back), then clear.
    buried: { sample: 'oboe', volume: 0.2, attack: 0.1, release: 0.8, reverb: 0.75, pan: 0.1, muffle: 1100, humanize: { time: 0.012, volume: 0.1 } },
    oboe: { sample: 'oboe', volume: 0.21, attack: 0.07, release: 0.6, reverb: 0.5, pan: 0.1, humanize: { time: 0.012, volume: 0.1 } },
    flute: { sample: 'flute', volume: 0.17, attack: 0.1, release: 0.7, reverb: 0.55, pan: 0.2, humanize: { time: 0.012, volume: 0.1 } },
    clarinet: { sample: 'clarinet', volume: 0.2, attack: 0.08, release: 0.6, reverb: 0.55, pan: -0.2, humanize: { time: 0.012, volume: 0.1 } },
    violin: { sample: 'soloViolin', volume: 0.2, attack: 0.25, release: 0.9, reverb: 0.6, pan: 0.15, humanize: { time: 0.015, volume: 0.1 } },
    // The mill race, the gaps, the low lean.
    harp: { sample: 'harp', volume: 0.17, ring: true, reverb: 0.45, pan: -0.2, humanize: { time: 0.01, volume: 0.15 } },
    piano: { sample: 'grandPiano', volume: 0.16, ring: true, reverb: 0.55, pan: 0.25, humanize: { time: 0.012, volume: 0.15 } },
    low: { sample: 'grandPiano', volume: 0.16, ring: true, muffle: 900, reverb: 0.5, pan: -0.1, humanize: { time: 0.008, volume: 0.1 } },
    // The shoots.
    pizz: { sample: 'violinsPizz', volume: 0.1, reverb: 0.5, pan: 0.3, humanize: { time: 0.008, volume: 0.15 } },
    // THE GREY: two notes that never move, muffled right down.
    greyLow: { sample: 'violas', volume: 0.08, attack: 1.6, release: 2, reverb: 0.65, pan: -0.25, muffle: 1100 },
    greyHigh: { sample: 'violas', volume: 0.07, attack: 1.8, release: 2, reverb: 0.65, pan: 0.25, muffle: 1100 },
    greyChoir: { sample: 'choir', volume: 0.05, attack: 2, release: 2.4, reverb: 0.75, pan: 0, muffle: 1000 },
    // Soft strings and horns, only far back.
    violins: { sample: 'violins', volume: 0.06, attack: 1.2, release: 1.8, reverb: 0.65, pan: 0.3, muffle: 2600 },
    trem: { sample: 'violasTrem', volume: 0.06, attack: 2, release: 2, reverb: 0.7, pan: -0.3, muffle: 1200 },
    horns: { sample: 'hornsSoft', volume: 0.055, attack: 1, release: 1.5, reverb: 0.65, pan: -0.25, muffle: 1400 },
    // What the wood was, and what it is.
    bird: { sample: 'flute', volume: 0.05, attack: 0.02, release: 0.3, reverb: 0.7, pan: 0.4, muffle: 3000, echo: { time: 0.49, feedback: 0.3, mix: 0.3 }, humanize: { time: 0.02, volume: 0.2 } },
    flakes: { sample: 'harp', volume: 0.06, ring: true, reverb: 0.7, pan: 0.35, echo: { time: 0.65, feedback: 0.25, mix: 0.25 }, humanize: { time: 0.02, volume: 0.25 } },
    embers: { sample: 'glass', volume: 0.045, ring: true, reverb: 0.6, pan: -0.35, humanize: { time: 0.01, volume: 0.25 } },
    wind: { sample: 'cymbalSwell', volume: 0.08, release: 0.6, reverb: 0.7, pan: 0.25, muffle: 1200 },
  },

  sections: {
    // The grey alone, a gust; the harp from bar 2; the low clarinet says the
    // ember cell in B minor.
    intro: fit('intro', {
      greyLow: grey(4, 'B3'),
      greyHigh: [...rest(1), ...grey(3, 'F#4', 3)],
      wind: gusts(4, [0]),
      harp: [...rest(1), ...spare('Bm'), ...race('G A')],
      clarinet: [...rest(2), ...CELL],
      flakes: flakes(INTRO_CHORDS, 5, 0.1),
    }, 4),

    // THE HOOK on the buried oboe; it stops on A, asking.
    A: fit('A', {
      buried: HOOK_ASKING,
      harp: race(A_CHORDS),
      low: lean(A_CHORDS),
      greyLow: grey(8, 'B3'),
      greyHigh: grey(8, 'F#4'),
      greyChoir: [...rest(4), ...grey(4, 'F#3')],
      bird: birds(8, [[3, 10, 'A6 F#6'], [7, 6, 'B6 F#6']]),
      embers: embers(8, [[7, 9]]),
      flakes: flakes(A_CHORDS, 17),
    }, 8),

    // The flute has it, clear; the piano answers in the gaps; it lands.
    A1: fit('A1', {
      flute: HOOK,
      piano: GAPS,
      clarinet: sustained(A1_CHORDS, BAR, 1, 3),
      harp: race(A1_CHORDS),
      low: lean(A1_CHORDS),
      greyLow: grey(8, 'B3'),
      greyHigh: grey(8, 'F#4'),
      greyChoir: grey(8, 'F#3'),
      bird: birds(8, [[1, 12, 'E6 C#6']]),
      flakes: flakes(A1_CHORDS, 29),
    }, 8),

    // THE MEADOW: the solo violin climbing, the shoots, the clarinet under;
    // the flute joins for the second half.
    B: fit('B', {
      violin: MEADOW,
      flute: [...rest(4), ...MEADOW.slice(4 * BAR)],
      clarinet: sustained(B_CHORDS, BAR, 2, 3),
      pizz: shoots([[0, 10, 'G4'], [1, 12, 'B4', [0, 2, 3]], [3, 8, 'A4'], [4, 10, 'G4'], [5, 12, 'B4', [0, 2, 3]], [7, 8, 'C#5', [0, 1, 4]]]),
      harp: race(B_CHORDS),
      low: lean(B_CHORDS),
      greyLow: grey(8, 'B3'),
      greyHigh: grey(8, 'F#4'),
      violins: [...rest(4), ...sustained('G G Bm A', BAR, 1, 4)],
      bird: birds(8, [[2, 14, 'A6 E6'], [6, 2, 'D7 B6']]),
      flakes: flakes(B_CHORDS, 41, 0.08),
    }, 8),

    // UNDER THE ASH: the harp thinned, gusts, embers, the hook in minor in
    // pieces on the low clarinet, the cell twice; the buried oboe tries
    // again; the low piano climbs into the payoff.
    C: fit('C', {
      clarinet: PIECES,
      buried: TRYING,
      harp: [...spare(C_CHORDS).slice(0, 7 * BAR), ...race('A')],
      low: [...lean(C_CHORDS).slice(0, 7 * BAR), ...tune('A2 - - - B2 - C#3 -')],
      greyLow: grey(8, 'B3'),
      greyHigh: grey(8, 'F#4'),
      greyChoir: grey(8, 'B3'),
      trem: [...rest(2), ...heldNotes('D4 D4 D4 E4 E4 E4', BAR)],
      wind: gusts(8, [0, 2, 4, 6]),
      embers: embers(8, [[1, 6], [2, 12, 'F#5 B5 D6'], [4, 4], [5, 10, 'D6 F#6 B6'], [6, 2]]),
      flakes: flakes(C_CHORDS, 53, 0.3),
    }, 8),

    // THE PAYOFF: the oboe clear, the flute an octave over it, the violins'
    // long line, soft horns far back; it lands on D over the grey B.
    A2: fit('A2', {
      oboe: HOOK,
      flute: up(HOOK, 12),
      violins: DESCANT,
      horns: sustained(A2_CHORDS, BAR, 0, 3),
      clarinet: sustained(A2_CHORDS, BAR, 1, 3),
      harp: race(A2_CHORDS),
      low: lean(A2_CHORDS),
      greyLow: grey(8, 'B3'),
      greyHigh: grey(8, 'F#4'),
      greyChoir: grey(8, 'F#3'),
      embers: embers(8, [[3, 10, 'A5 D6 F#6']]),
      flakes: flakes(A2_CHORDS, 67),
    }, 8),

    // The grey, the harp, a bird, round to the hook.
    tail: fit('tail', {
      greyLow: grey(2, 'B3', 2),
      greyHigh: grey(2, 'F#4', 2),
      harp: race(TAIL_CHORDS),
      low: lean(TAIL_CHORDS),
      bird: birds(2, [[0, 8, 'A6 F#6']]),
    }, 2),
  },

  order: ['intro', 'A', 'A1', 'B', 'C', 'A2', 'tail'],
  loopFrom: 1,
};
