import {
  melody, repeat, hits, midi, sustained, rest as restBars, held, heldNotes, onNotes, chordLine,
  tight, scatter, drops, ASH_HOOK, ASH_HOOK_CHORDS,
} from './parts/chapter6.js';

// "Footprints Fill In": the song for the ash wastes, chapter 6's first area.
// The sea has gone out and the three of them walk up off the bare seabed
// into a land that burned about a hundred years ago and never quite
// stopped. Grey ash lies like snow and is still falling; footprints fill
// back in behind you; now and then an ember lifts out of a crack and goes
// out. Nobody lives out here. Somewhere ahead there is an old town buried
// to its eaves. Lonely and soft, but walking toward something.
//
// THE HOOK (the first two bars are the whole song): a small sad waltz on a
// music box, played here by a soft piano up high with a glockenspiel an
// octave over it, a little flat, like a music box left out in the ash. It
// opens on THE EMBER CELL (parts/chapter6.js): F# G# A C#, up like an
// ember lifting, then D falling to C#, like it going out. The answer sinks
// to E, says the cell again, and the first time it hangs on C# (asking).
// Second time round the flute takes it and a clarinet walks under it; in
// the payoff the piano and flute play it together and it lands, but on a D
// major chord, not at home: the green isn't back yet.
//
// UNDER IT: a harp waltzing (the root low, then two soft chord notes), soft
// violas held far back, and the ash itself: a harp high up, a note here and
// there out of time (seeded, so it falls the same each loop), like flakes
// coming down. Embers are three quick notes rising on the glass recordings.
// The ground smoulders: a timpani roll, muffled almost to nothing, under
// the long bars.
//
// THE GREEN (B): a lift into D major, on an oboe, the first warm thing in
// the song: what the land was. Then a flute answers with Ves's motif
// (C C, up to A, Bb G A; here A A, F# G E F#), quietly, because she is
// walking next to you.
//
// THE ASH STORM (C): the waltz stops. Wind (the real cymbal swell, muffled
// right down) comes in gusts, the embers fly thick, tremolo strings and a
// low choir swell far back, and the hook comes through in pieces on a low
// clarinet. Under it the bass creeps down a half step a bar (F#, F, E, D#,
// D, C#), the Keeper's walk from "Minding the Fire": someone came this way
// ahead of you. Then the harp finds the waltz again and the payoff lands.
// Anticipation, never a boss song: no cellos, no brass on top, no drums
// but one soft frame drum in the payoff.
//
// F# minor, with D major's colour (the C# over D, a major seventh) and the
// Lydian G# over D in the storm. 3/4 at 80 BPM; 12 steps to a bar, one step
// a 16th (a bar is 2.25 seconds). The intro plays once (4 bars); then it
// loops from A, 50 bars, about 1m53s:
//
//   intro   4 bars  wind, a far smoulder, the flakes, an ember; the harp
//                   starts the waltz in bar 3
//   A       8 bars  THE HOOK on the music box (piano and glockenspiel)
//   A1      8 bars  the flute takes it, a clarinet walking under it, the
//                   violas join; it lands on F#
//   B       8 bars  THE GREEN: the oboe in D major; the flute answers with
//                   Ves's motif
//   B2      8 bars  the green again, the piano and oboe together, the
//                   strings warmer; it turns back to C#
//   C       8 bars  THE ASH STORM: no waltz, wind, embers, the hook in
//                   pieces over the Keeper's creeping bass; the waltz
//                   comes back in the last bar
//   A2      8 bars  THE PAYOFF: piano and flute in octaves, soft violins
//                   and horns far back, a frame drum on the one; it lands
//                   on F# over a D major chord
//   tail    2 bars  wind, the flakes, the harp alone, round to A

const BAR = 12;
const tune = (text) => melody(text, 2);   // each token an 8th: 6 to a bar
const rest = (bars) => restBars(bars, BAR);
const fit = (name, section, bars) => tight('Footprints Fill In', name, section, bars, BAR);
const up = (steps, semitones) => steps.map((n) => (typeof n === 'number' ? n + semitones : n));

// --- Harmony, a bar each ---
const A_CHORDS = ASH_HOOK_CHORDS;                 // F#m D Bm A F#m D Bm C#
const A1_CHORDS = 'F#m D Bm A F#m D Bm F#m';
const B_CHORDS = 'D G Em A D Em Bm A';
const B2_CHORDS = 'D G Em A D Em Bm C#';
const A2_CHORDS = 'F#m D Bm A F#m D Bm D';

// --- THE HOOK (sing it) ---
const HOOK = tune(ASH_HOOK);
// It lands on F# the second time, and in the payoff (over D there).
const HOOK_HOME = [...HOOK.slice(0, 6 * BAR), ...tune('B4 - D5 C#5 - G#4 | F#4 - - - - .')];
// Under the flute in A1: a clarinet walking a chord tone a beat or two.
const WALK = tune(`
  A3 - - C#4 - - | F#3 - - A3 - - | D4 - - F#3 - - | E3 - - C#4 - - |
  A3 - - C#4 - - | F#3 - - A3 - - | D4 - - B3 - D4 | C#4 - - - - . |
`);

// --- THE GREEN (B), D major, and Ves's motif answering ---
const GREEN = tune(`
  A4 - D5 - E5 F#5 | A5 - - G5 - F#5 | E5 - D5 - B4 - | A4 - - - - . |
`);
const VES = tune(`
  A4 - A4 - F#5 - | - - G5 - E5 - | F#5 - - - - - | E5 - - - - . |
`);
const GREEN_FULL = tune(`
  A4 - D5 - E5 F#5 | A5 - - G5 - F#5 | E5 - D5 - B4 - | A4 - - - - . |
  B4 - D5 - E5 F#5 | A5 - - B5 - A5 | F#5 - E5 - D5 - | E#5 - - - - . |
`);

// --- THE ASH STORM (C): the hook in pieces; the Keeper's creeping bass ---
const PIECES = tune(`
  F#4 - G#4 A4 C#5 - | D5 - - - - . | . . . . . . | . . . . . . |
  F#4 - G#4 A4 C#5 - | D5 - - C#5 - - | . . . . . . | . . . . . . |
`);
const CREEP = heldNotes('F#2 F2 E2 D#2 D2 C#2 C#2 C#2', BAR);
const STORM_MID = heldNotes('A3 A3 G#3 F#3 F#3 F3 G#3 G#3', BAR);
const STORM_HIGH = heldNotes('C#5 C#5 C#5 C#5 C#5 C#5 C#5 C#5', BAR);

// --- Over the payoff: the violins, high and long ---
const DESCANT = tune(`
  C#6 - - - - - | A5 - - - - - | B5 - - - - - | C#6 - - - - - |
  A5 - - - - - | F#5 - - - - - | D6 - - - - - | C#6 - - - - . |
`);

// --- THE WALTZ: the harp's root low on one, two soft chord notes after ---
const WALTZ_LOW = [0, '-', '-', '-', '.', '.', '.', '.', '.', '.', '.', '.'];
const WALTZ_UP = ['.', '.', '.', '.', 7, '.', '.', '.', 'tenth', '.', '.', '.'];
// (Nothing under E flat 2: the harp's lowest strings go "boing".)
const waltz = (chords) => chordLine(chords, WALTZ_LOW, 2).map((n) => (typeof n === 'number' && n < 39 ? n + 12 : n));
const lilt = (chords) => chordLine(chords, WALTZ_UP, 3);

// The ash falling: high harp notes out of time, now and then (seeded).
const flakes = (chords, seed, chance = 0.22) => drops(chords, BAR, chance, seed, 2).map((n) => (typeof n === 'number' ? n - 12 : n));
// Embers: three quick notes rising on the glass.
const embers = (bars, at) => {
  const out = rest(bars);
  for (const [bar, step, notes = 'C#5 F#5 A5'] of at) notes.split(' ').forEach((name, i) => { out[bar * BAR + step + i] = midi(name); });
  return out;
};
// Wind: the cymbal swell, muffled, one gust every `every` bars.
const gusts = (bars, every, first = 0) => {
  const out = rest(bars);
  for (let b = first; b < bars; b += every) out[b * BAR] = 60;
  return out;
};
// The smoulder: a long timpani roll, almost not there.
const smoulder = (bars, note, from = 0, len = 2) => [...rest(from), ...held(note, len * BAR - 2), '.', '.', ...rest(bars - from - len)];

export const ASH_THEME = {
  title: 'Footprints Fill In',
  bpm: 80,
  stepsPerBeat: 4,
  // An area song: level with the others (about -26.5 on tools/loudnessCheck.html).
  volume: 1.3,

  instruments: {
    // The music box: a soft piano up high, a glockenspiel an octave over it, a little flat.
    piano: { sample: 'grandPiano', volume: 0.3, ring: true, reverb: 0.5, pan: -0.05, humanize: { time: 0.012, volume: 0.12 } },
    glock: { sample: 'glock', volume: 0.06, ring: true, detune: -18, drift: 6, reverb: 0.6, pan: 0.2, echo: { time: 0.56, feedback: 0.25, mix: 0.2 } },
    // The winds.
    flute: { sample: 'flute', volume: 0.17, attack: 0.12, release: 0.7, reverb: 0.6, pan: 0.2, humanize: { time: 0.012, volume: 0.1 } },
    oboe: { sample: 'oboe', volume: 0.22, attack: 0.07, release: 0.6, reverb: 0.55, pan: 0.15, humanize: { time: 0.012, volume: 0.1 } },
    clarinet: { sample: 'clarinet', volume: 0.2, attack: 0.06, release: 0.5, reverb: 0.5, pan: -0.15, humanize: { time: 0.012, volume: 0.1 } },
    // The waltz, and the ash falling.
    harp: { sample: 'harp', volume: 0.2, ring: true, reverb: 0.45, pan: -0.2, humanize: { time: 0.01, volume: 0.12 } },
    harpUp: { sample: 'harp', volume: 0.12, ring: true, reverb: 0.5, pan: 0.1, humanize: { time: 0.012, volume: 0.15 } },
    flakes: { sample: 'harp', volume: 0.07, ring: true, reverb: 0.7, pan: 0.35, echo: { time: 0.75, feedback: 0.3, mix: 0.25 }, humanize: { time: 0.02, volume: 0.25 } },
    embers: { sample: 'glass', volume: 0.05, ring: true, reverb: 0.6, pan: -0.35, humanize: { time: 0.01, volume: 0.25 } },
    // The Keeper's creeping bass, on a piano kept low and soft.
    creep: { sample: 'grandPiano', volume: 0.12, ring: true, muffle: 900, reverb: 0.55, pan: -0.1 },
    // Soft strings, far back.
    violas: { sample: 'violas', volume: 0.07, attack: 1.2, release: 1.8, reverb: 0.6, pan: -0.2, muffle: 1400 },
    violins: { sample: 'violins', volume: 0.06, attack: 1.4, release: 2, reverb: 0.65, pan: 0.3, muffle: 2600 },
    trem: { sample: 'violinsTrem', volume: 0.05, attack: 2, release: 2, reverb: 0.7, pan: 0.35, muffle: 1500 },
    tremLow: { sample: 'violasTrem', volume: 0.06, attack: 1.8, release: 2, reverb: 0.65, pan: -0.3, muffle: 1100 },
    choir: { sample: 'choir', volume: 0.07, attack: 1.8, release: 2.2, reverb: 0.75, pan: -0.1, muffle: 1600 },
    horns: { sample: 'hornsSoft', volume: 0.06, attack: 0.9, release: 1.4, reverb: 0.65, pan: -0.25, muffle: 1400 },
    // The ground smouldering and the wind.
    smoulder: { sample: 'timpaniRoll', volume: 0.12, attack: 1, release: 1.5, reverb: 0.6, pan: -0.2, muffle: 420 },
    wind: { sample: 'cymbalSwell', volume: 0.09, release: 0.6, reverb: 0.7, pan: 0.25, muffle: 1300 },
    // One soft frame drum, only in the payoff.
    drum: { sample: 'frameDrum', drum: 'sample', volume: 0.1, ring: true, reverb: 0.45, muffle: 1500, humanize: { time: 0.008, volume: 0.2 } },
  },

  sections: {
    // Before anyone plays: wind, the smoulder, flakes, an ember; the waltz
    // starts in the third bar.
    intro: fit('intro', {
      wind: gusts(4, 4),
      smoulder: smoulder(4, 'F#2', 0, 3),
      flakes: flakes('F#m F#m D C#', 11, 0.18),
      embers: embers(4, [[1, 6]]),
      harp: [...rest(2), ...waltz('F#m C#')],
      harpUp: [...rest(2), ...lilt('F#m C#')],
      violas: [...rest(1), ...held('C#4', 3 * BAR - 2), '.', '.'],
    }, 4),

    // THE HOOK on the music box.
    A: fit('A', {
      piano: up(HOOK, 12),
      glock: up(HOOK, 24),
      harp: waltz(A_CHORDS),
      harpUp: lilt(A_CHORDS),
      flakes: flakes(A_CHORDS, 23),
      embers: embers(8, [[3, 6], [7, 2, 'F#5 A5 C#6']]),
      smoulder: smoulder(8, 'F#2', 0, 2),
      wind: gusts(8, 8, 4),
    }, 8),

    // The flute takes it; a clarinet walks under it; the violas join.
    A1: fit('A1', {
      flute: up(HOOK_HOME, 12),
      clarinet: WALK,
      piano: [...rest(3), ...tune('. . . . E6 C#6 | A5 - - - - .'), ...rest(1), ...tune('. . . . . . | F#6 - - - - .')],
      harp: waltz(A1_CHORDS),
      harpUp: lilt(A1_CHORDS),
      violas: sustained(A1_CHORDS, BAR, 1, 3),
      flakes: flakes(A1_CHORDS, 37),
      embers: embers(8, [[2, 8]]),
      smoulder: smoulder(8, 'F#2', 4, 2),
    }, 8),

    // THE GREEN: the oboe in D major; the flute answers with Ves's motif.
    B: fit('B', {
      oboe: [...GREEN, ...rest(4)],
      flute: [...rest(4), ...VES],
      harp: waltz(B_CHORDS),
      harpUp: lilt(B_CHORDS),
      violas: sustained(B_CHORDS, BAR, 1, 3),
      flakes: flakes(B_CHORDS, 41, 0.15),
      wind: gusts(8, 8, 6),
    }, 8),

    // The green again, the piano with the oboe; the strings warmer; it turns
    // back to C#.
    B2: fit('B2', {
      oboe: GREEN_FULL,
      piano: up(GREEN_FULL, 12),
      harp: waltz(B2_CHORDS),
      harpUp: lilt(B2_CHORDS),
      violas: sustained(B2_CHORDS, BAR, 1, 3),
      violins: sustained(B2_CHORDS, BAR, 2, 4),
      flakes: flakes(B2_CHORDS, 53, 0.15),
      embers: embers(8, [[5, 6, 'A5 C#6 D6']]),
      smoulder: smoulder(8, 'C#3', 6, 2),
    }, 8),

    // THE ASH STORM: no waltz; wind, embers, the hook in pieces over the
    // Keeper's creeping bass. The waltz finds its way back in the last bar.
    C: fit('C', {
      clarinet: PIECES,
      creep: CREEP,
      tremLow: STORM_MID,
      trem: STORM_HIGH,
      choir: [...rest(2), ...heldNotes('F#3 F#3 F3 F3 G#3 G#3', BAR)],
      wind: gusts(8, 2),
      smoulder: [...smoulder(4, 'F#2', 0, 4), ...smoulder(4, 'C#3', 0, 4)],
      embers: embers(8, [[0, 4], [1, 8, 'F#5 A5 D6'], [2, 2], [3, 6, 'D5 F#5 A5'], [4, 0], [4, 8, 'F#5 A5 C#6'], [5, 4], [6, 2, 'C#5 F5 G#5'], [6, 8]]),
      flakes: flakes('F#m D Bm A F#m D C# C#', 67, 0.45),
      harp: [...rest(7), ...waltz('C#')],
      harpUp: [...rest(7), ...lilt('C#')],
    }, 8),

    // THE PAYOFF: piano and flute in octaves, soft violins and horns far
    // back, a frame drum on the one; it lands on F# over D.
    A2: fit('A2', {
      piano: up(HOOK_HOME, 12),
      flute: up(HOOK_HOME, 12),
      glock: [...rest(6), ...up(HOOK_HOME, 24).slice(6 * BAR)],
      clarinet: WALK.slice(0, 7 * BAR).concat(tune('D4 - - - - .')),
      harp: waltz(A2_CHORDS),
      harpUp: lilt(A2_CHORDS),
      violas: sustained(A2_CHORDS, BAR, 1, 3),
      violins: DESCANT,
      horns: sustained(A2_CHORDS, BAR, 0, 2),
      choir: sustained(A2_CHORDS, BAR, 2, 3),
      drum: [...repeat(hits('x...........'), 7), ...rest(1)],
      flakes: flakes(A2_CHORDS, 79),
      embers: embers(8, [[3, 8], [7, 4, 'A5 C#6 D6']]),
      smoulder: smoulder(8, 'D3', 6, 2),
    }, 8),

    // A breath: wind, the flakes, the harp alone, round to the hook.
    tail: fit('tail', {
      wind: gusts(2, 2),
      harp: waltz('F#m C#'),
      flakes: flakes('F#m C#', 97, 0.3),
      violas: [...held('C#4', 2 * BAR - 2), '.', '.'],
    }, 2),
  },

  order: ['intro', 'A', 'A1', 'B', 'B2', 'C', 'A2', 'tail'],
  loopFrom: 1,
};
