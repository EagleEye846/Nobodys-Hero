import {
  melody, sustained, chordLine, transpose, rest as restBars, hits, repeat,
  tight, midi, scatter,
} from './parts/chapter5.js';

// "The Soundings": the theme of the sea-cave dungeon under the cliffs
// between Merrow and the Beacon Isles. Old sailors lowered weighted lines
// down here to sound the depth, and the caves still feel measured: water
// drips into black pools, every sound comes back twice, and the tide moves
// the rooms around you. So the song is a hypnotic groove rather than a sad
// one, the kind of dungeon tune that walks along with you.
//
// THE GROOVE is what you remember. Plucked violins run one cell of three
// notes (F# C# G#, a stack of fifths) in unbroken 16ths, so in a bar of
// sixteen it starts on a different note every bar and only comes round
// again every three bars; a dotted-8th echo on it makes it bubble like
// water in a pipe. It never changes key: the bass moves underneath and
// recolours it (a fixed ostinato with a moving bass, after Hollow Knight's
// City of Tears). The bass is plucked cellos and a harp, kept soft, in a
// 3-3-2 swing (root, root, octave; fifth, root, octave), and a muffled
// frame drum knocks on 1, the "and" of 2 and 4 (6+6+4 sixteenths, the
// grouping Toby Fox uses for urgency), with a soft low tom on 3.
//
// THE HOOK rides on top: a glassy tune (a glock an octave up, like a
// celesta), and it echoes: two written copies follow it a dotted 8th and a
// dotted quarter later, each softer and panned the other way, so every
// phrase comes back off the walls. It is two short phrases on the coast
// cell and one long answer (sing it: C# F# F# G#, A G# F#... C#).
//
// THE COAST CELL (A D D E in D minor) is the hook's first bar, in F# minor:
// C# F# F# G#, and then it keeps going up (A) instead of stopping, as if
// the line were being paid out into deeper water. In C it is turned upside
// down (C# F# F# E) and sequenced down a step at a time, a third each go,
// while the bass sinks a note a bar: the weight going down.
//
// B swings between D major and B-flat major (a chromatic third, the floor
// dropping away), with a Lydian G# over D. In C the groove drops out (the
// sounding: only the line going down and the deep notes), then the bass
// and drum come back and build, a cymbal swells, and A2 is the payoff:
// the hook with everyone.
//
// F# minor, 4/4 at 80 (a bar is 3 seconds); one step a 16th, 16 to a bar.
// The intro plays once (2 bars); then it loops from A, 44 bars, 2m12s:
//
//   intro   2 bars    6s   the groove alone, one ping, the deep notes
//   A       8 bars   24s   THE HOOK on glass with its two echoes; the
//                          plucked bass comes in under the groove
//   A1      8 bars   24s   the hook again, bowed vibes doubling and a low
//                          flute; the drum starts; violas sing a slow
//                          countermelody against it
//   B       8 bars   24s   D and B-flat swapping; a falling tune on vibes
//                          and a low clarinet; the groove's notes change
//                          to A D A (they sit on both chords); choir in
//   C       8 bars   24s   the sounding: no drum, no bass, the cell upside
//                          down and a step lower each time while the deep
//                          notes sink to G# major; at bar 5 the bass comes
//                          back, the drum builds (8ths, then 16ths) and a
//                          cymbal swells into
//   A2      8 bars   24s   THE HOOK, the payoff: glass, vibes, violins,
//                          the countermelody, choir, a tom on every turn
//   tail    4 bars   12s   the groove, the pings and the deep notes; C#
//                          major hangs and loops back round to A

const BAR = 16;
const tune = (text) => melody(text, 2);   // each token an 8th: 8 to a bar
const rest = (bars) => restBars(bars, BAR);
const fit = (name, section, bars) => tight('The Soundings', name, section, bars, BAR);
const after = (bars, track) => [...rest(bars), ...track.slice(bars * BAR)];
const until = (bars, track) => [...track.slice(0, bars * BAR), ...rest(track.length / BAR - bars)];

// --- Harmony, a bar each ---
const INTRO_CHORDS = 'F#m F#m';
const A_CHORDS = 'F#m F#m D E F#m D Bm C#';
const B_CHORDS = 'D Bb D Bb F#m D C# C#';
const C_CHORDS = 'F#m E D C#m Bm A G# C#';
const TAIL_CHORDS = 'F#m E D C#';

// --- The hook: two short phrases on the cell, one long answer. The last
// bar leans on F# over C# and lets it fall to E# (the leading note), so
// the loop pulls back into F# minor. ---
const HOOK = tune(`
  C#5 - F#5 F#5 G#5 - A5 G#5   F#5 - - - C#5 - - -
  C#5 - F#5 F#5 G#5 - B5 A5    G#5 - - - E5 - - -
  C#5 - F#5 F#5 G#5 - A5 B5    C#6 - - B5 A5 - G#5 A5
  F#5 - - - E5 - G#5 -         F#5 - - - E#5 - - -
`);
// The violas' countermelody under the hook: slow, against its line.
const COUNTER = tune(`
  A4 - - - - - - -    B4 - - - A4 - - -
  F#4 - - - - - - -   G#4 - - - B4 - - -
  A4 - - - - - - -    F#4 - - - A4 - - -
  B4 - - - D5 - - -   C#5 - - - B4 - - -
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

// --- The groove and the drips: one long count for the whole song, so each
// section carries on where the last left off. ---
const START = { intro: 0, A: 2, A1: 10, B: 18, C: 26, A2: 34, tail: 42 };
function cycle(name, bars, period, offset, notes) {
  const out = [];
  const from = START[name] * BAR;
  for (let s = from; s < from + bars * BAR; s++) {
    const k = s - offset;
    out.push(k >= 0 && k % period === 0 ? midi(notes[Math.floor(k / period) % notes.length]) : '.');
  }
  return out;
}
// The groove: three notes, every 16th, round and round over the bar line.
const groove = (name, bars, notes = ['F#4', 'C#5', 'G#5']) => cycle(name, bars, 1, 0, notes);
// A harp drip every 14 16ths, drifting against everything else.
const harpDrip = (name, bars, notes = ['G#5', 'C#6', 'E5']) => cycle(name, bars, 14, 5, notes);
// The sounding line: a glass ping every two bars, on the beat.
const pings = (bars, note = 'C#6') => scatter(bars, BAR, Array.from({ length: bars / 2 }, (_, i) => [i * 2, 0, note]));

// --- The bass: 3-3-2 (root, root, octave; fifth, root, octave). Low harp
// notes under E-flat 2 go up an octave: the harp's lowest strings boom and
// wobble ("boing") instead of ringing. ---
const lift = (track) => track.map((n) => (typeof n === 'number' && n < 39 ? n + 12 : n));
const BASS_SHAPE = [0, '.', '.', 0, '.', '.', 12, '.', '.', '.', 7, '.', 0, '.', 12, '.'];
const bass = (chords) => chordLine(chords, BASS_SHAPE, 2);
const harpBass = (chords) => lift(chordLine(chords, [0, '.', '.', '.', '.', '.', 12, '.', '.', '.', '.', '.', '.', '.', '.', '.'], 2));
const deep = (chords) => sustained(chords, BAR, 0, 2);

// --- The drum: 6+6+4 on a muffled frame drum, a soft tom on 3. ---
const KNOCK = hits('x.....x.....x...');
const TOM = hits('........x.......');
const TOM_TURN = hits('........x.....x.');
const BUILD_8 = hits('x.x.x.x.x.x.x.x.');
const BUILD_16 = hits('xxxxxxxxxxxxxxxx');

export const SOUNDINGS_THEME = {
  title: 'The Soundings',
  bpm: 80,
  stepsPerBeat: 4,
  volume: 1.55,

  instruments: {
    // The celesta: a glock played an octave up, and its two echoes.
    glass: { sample: 'glock', volume: 0.17, ring: true, octave: 1, reverb: 0.6, pan: 0.1, humanize: { time: 0.008, volume: 0.1 } },
    echo1: { sample: 'glock', volume: 0.075, ring: true, octave: 1, reverb: 0.8, pan: -0.45, muffle: 4000 },
    echo2: { sample: 'glock', volume: 0.04, ring: true, octave: 1, reverb: 0.9, pan: 0.5, muffle: 2500 },
    vibes: { sample: 'vibesBowed', volume: 0.12, attack: 0.15, release: 1.0, reverb: 0.7, pan: 0.15 },
    violins: { sample: 'violins', volume: 0.06, attack: 0.3, release: 0.9, reverb: 0.65, pan: 0.3 },
    clarinet: { sample: 'clarinet', volume: 0.14, attack: 0.12, release: 0.7, reverb: 0.6, pan: -0.2 },
    flute: { sample: 'flute', volume: 0.11, attack: 0.15, release: 0.7, reverb: 0.65, pan: -0.3 },
    groove: { sample: 'violinsPizz', volume: 0.075, release: 0.15, reverb: 0.5, pan: 0.3, humanize: { time: 0.006, volume: 0.25 }, echo: { time: 0.5625, feedback: 0.3, mix: 0.3 } },
    harpDrip: { sample: 'harp', volume: 0.1, ring: true, reverb: 0.7, pan: -0.35, humanize: { time: 0.01, volume: 0.2 } },
    ping: { sample: 'glass', volume: 0.06, ring: true, reverb: 0.85, pan: 0.2, echo: { time: 0.75, feedback: 0.4, mix: 0.35 } },
    bass: { sample: 'cellosPizz', volume: 0.17, release: 0.3, reverb: 0.35, pan: -0.1, muffle: 1800, humanize: { time: 0.006, volume: 0.15 } },
    harpBass: { sample: 'harp', volume: 0.12, ring: true, reverb: 0.5, pan: -0.2 },
    deep: { sample: 'cellos', volume: 0.08, attack: 1.4, release: 2.0, reverb: 0.6, pan: 0, muffle: 450 },
    violas: { sample: 'violas', volume: 0.1, attack: 0.6, release: 1.4, reverb: 0.65, pan: -0.25 },
    pad: { sample: 'violas', volume: 0.06, attack: 1.4, release: 1.8, reverb: 0.7, pan: 0.2, muffle: 1800 },
    choir: { sample: 'choir', volume: 0.07, attack: 1.6, release: 2.0, reverb: 0.85 },
    choirHigh: { sample: 'choir', volume: 0.05, attack: 1.8, release: 2.2, reverb: 0.9, pan: 0.2 },
    knock: { sample: 'frameDrum', drum: 'sample', volume: 0.16, reverb: 0.35, muffle: 1400, humanize: { time: 0.005, volume: 0.15 } },
    tom: { sample: 'tom', drum: 'sample', volume: 0.1, reverb: 0.45, muffle: 900, humanize: { time: 0.005, volume: 0.12 } },
    swell: { sample: 'cymbalSwell', drum: 'sample', volume: 0.07, reverb: 0.7, muffle: 5000 },
  },

  sections: {
    intro: fit('intro', {
      groove: groove('intro', 2),
      ping: pings(2),
      deep: deep(INTRO_CHORDS),
    }, 2),

    A: fit('A', {
      glass: HOOK,
      echo1: late(HOOK, 3),
      echo2: late(HOOK, 6),
      groove: groove('A', 8),
      harpDrip: harpDrip('A', 8),
      ping: pings(8),
      bass: bass(A_CHORDS),
      harpBass: harpBass(A_CHORDS),
      deep: deep(A_CHORDS),
    }, 8),

    A1: fit('A1', {
      glass: HOOK,
      vibes: HOOK,
      echo1: late(HOOK, 3),
      echo2: late(HOOK, 6),
      flute: after(4, transpose(HOOK, -12)),
      violas: COUNTER,
      groove: groove('A1', 8),
      ping: pings(8),
      bass: bass(A_CHORDS),
      harpBass: harpBass(A_CHORDS),
      deep: deep(A_CHORDS),
      knock: repeat(KNOCK, 8),
      tom: repeat(TOM, 8),
    }, 8),

    B: fit('B', {
      vibes: TUNE_B,
      clarinet: transpose(TUNE_B, -12),
      echo1: late(TUNE_B, 3),
      echo2: late(TUNE_B, 6),
      groove: groove('B', 8, ['A4', 'D5', 'A5']),
      harpDrip: harpDrip('B', 8, ['A5', 'D6', 'F#5']),
      ping: pings(8, 'D6'),
      bass: bass(B_CHORDS),
      harpBass: harpBass(B_CHORDS),
      deep: deep(B_CHORDS),
      choir: sustained(B_CHORDS, BAR, 1, 4),
      knock: repeat(KNOCK, 8),
      tom: repeat(TOM, 8),
    }, 8),

    // The sounding: the groove alone with the line going down, then the
    // build back into the hook.
    C: fit('C', {
      vibes: TUNE_C,
      glass: late(TUNE_C, 8),
      echo1: late(TUNE_C, 11),
      groove: groove('C', 8),
      harpDrip: harpDrip('C', 8),
      ping: pings(8),
      bass: after(4, bass(C_CHORDS)),
      deep: deep(C_CHORDS),
      choir: sustained(C_CHORDS, BAR, 0, 4),
      choirHigh: sustained(C_CHORDS, BAR, 2, 4),
      knock: [...rest(4), ...KNOCK, ...KNOCK, ...BUILD_8, ...BUILD_16],
      tom: [...rest(6), ...TOM, ...TOM_TURN],
      // Peaks on the downbeat of A2 (3.18 s is 17 16ths at 80).
      swell: scatter(8, BAR, [[6, 15, 'C4']]).map((n) => (typeof n === 'number' ? 'x' : n)),
    }, 8),

    // The payoff: the hook with everyone.
    A2: fit('A2', {
      glass: HOOK,
      vibes: HOOK,
      violins: transpose(HOOK, -12),
      echo1: late(HOOK, 3),
      echo2: late(HOOK, 6),
      violas: COUNTER,
      groove: groove('A2', 8),
      harpDrip: harpDrip('A2', 8),
      ping: pings(8),
      bass: bass(A_CHORDS),
      harpBass: harpBass(A_CHORDS),
      deep: deep(A_CHORDS),
      pad: sustained(A_CHORDS, BAR, 1, 3),
      choir: sustained(A_CHORDS, BAR, 2, 4),
      knock: repeat(KNOCK, 8),
      tom: repeat([...TOM, ...TOM_TURN], 4),
    }, 8),

    tail: fit('tail', {
      groove: until(3, groove('tail', 4)),
      harpDrip: harpDrip('tail', 4),
      ping: pings(4),
      harpBass: harpBass(TAIL_CHORDS),
      deep: deep(TAIL_CHORDS),
      vibes: [...rest(3), midi('E#5'), ...Array(BAR - 1).fill('-')],
    }, 4),
  },

  order: ['intro', 'A', 'A1', 'B', 'C', 'A2', 'tail'],
  loopFrom: 1,
};
