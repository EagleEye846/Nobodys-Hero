import { melody, midi, hits, repeat, transpose, sustained, chordLine, scatter, tight } from './parts/chapter5.js';

// "No Bottom": the fights in the Soundings, the sea caves under the cliffs
// between Merrow and the Beacon Isles (the wrackeels, net wraiths, moon
// jellies and kelpie foals). When the old sounders let their weighted line
// down and it never touched, they called "no bottom". The cave's own song,
// "The Soundings", walks along with you, counting; this is the same cave
// when something comes up out of the black water. Further in and later than
// the cliff cave ("Echoes Back"), so it is lower, slower to move and heavier:
// it stamps where that one skitters. Grim, never cheery. All real recordings;
// the sea booming in at the cave mouth is the real sea (seaWaves), muffled
// by the rock.
//
// THE HOOK is the Soundings' hook, the coast cell in F# minor (C# F# F# G#,
// then on up to A), struck hard and low on cellos and violas in unison, with
// the area song's glass ringing it two octaves up and its echo coming back
// off the walls a dotted 8th late. Two short phrases on the cell; then the
// long answer goes DOWN instead of up, through the flat second (G major, the
// floor giving way) to the low C#: the line paid out with nothing under it.
//
// THE GROOVE is the area song's too: three notes (F# C# G#, a stack of
// fifths) in unbroken 16ths, so every bar starts on a different one, here on
// bitten violins with a dotted-8th echo. It never changes key; the bass moves
// under it (over D and B-flat it becomes A D A, as in the area song; over the
// G chord, G D B).
//
// Harmony: F# minor, F#m F#m D C#, F#m D G C#: the G is the borrowed flat
// second, the one dark colour. B is the area song's D/B-flat swing, its
// falling thirds on an oboe. C is the sounding: the cell upside down and a
// step lower each time while the deep notes sink, then the drums come back.
// D is the weight: the cell as a riff in low unison (strings, trombone,
// tuba), stopping dead for a beat before the payoff.
// Bass on bitten basses in the area song's 3-3-2 (root, root, octave; fifth,
// root, octave); low toms in its 6+6+4; a deep drum. No snare, no claps.
//
// F# minor, 4/4 at 132; one step a 16th, 16 to a bar (a bar is about 1.8 s).
// The intro plays once; then it loops from A, 46 bars, about 1m24s:
//
//   intro   2 bars  the groove alone, the sea booming far off, the bass creeping in
//   A       8 bars  THE HOOK low on cellos and violas, the glass and its echo
//                   above; groove, bass, toms
//   A1      8 bars  the hook again, violins on it an octave up, horns holding
//                   the chords, a second echo
//   B       8 bars  the area song's middle: D and B-flat swapping, the falling
//                   thirds on oboe and a low clarinet, a low choir
//   C       8 bars  the sounding: drums out but a heartbeat, the groove thinned,
//                   the cell upside down on bowed vibes and sinking, the sea
//                   twice; at bar 5 the bass and toms come back and build, a
//                   timpani roll and a cymbal swell into
//   D       4 bars  the weight: the cell as a riff in low unison, toms in 16ths;
//                   one beat of silence
//   A2      8 bars  the payoff: the hook with everyone, trombone and tuba under,
//                   timpani on the ones, both echoes
//   tail    2 bars  the groove and the bass carry it round to A

const BAR = 16;
const tune = (text) => melody(text, 2);   // each token an 8th
const rest = (bars) => Array(bars * BAR).fill('.');
const fit = (name, section, bars) => tight('No Bottom', name, section, bars, BAR);
const beat = (pattern, bars) => repeat(hits(pattern), bars);
const chordsOf = (text) => text.split(/\s+/).filter(Boolean);
// A copy of a track `steps` later: the cave saying it back.
const late = (track, steps) => [...Array(steps).fill('.'), ...track.slice(0, track.length - steps)];
const after = (bars, track) => [...rest(bars), ...track.slice(bars * BAR)];
// Stop dead for the last `steps` of a track: the silent beat.
const stopDead = (track, steps = 4) => [...track.slice(0, track.length - steps), ...Array(steps).fill('.')];

// --- Harmony, a bar each ---
const INTRO_CHORDS = 'F#m F#m';
const A_CHORDS = 'F#m F#m D C# F#m D G C#';
const B_CHORDS = 'D Bb D Bb Bm G C# C#';
const C_CHORDS = 'F#m E D C#m Bm A G# C#';
const D_CHORDS = 'F#m F#m G C#';
const TAIL_CHORDS = 'F#m C#';

// --- THE HOOK: the cell twice, then the long answer sinking through G. ---
const HOOK = tune(`
  C#5 - F#5 F#5 - G#5 A5 -    G#5 F#5 - C#5 - - . .
  C#5 - F#5 F#5 - B5 A5 -     G#5 - - - E#5 - . .
  C#5 - F#5 F#5 - G#5 A5 -    B5 - A5 - F#5 - D5 -
  D5 - B4 - G4 - - G4         G#4 - - - E#4 - C#4 -
`);

// --- B: the area song's falling thirds, D then B-flat, down to C#. ---
const TUNE_B = tune(`
  A5 - - - F#5 - D5 -         F5 - - - D5 - Bb4 -
  A4 - D5 - F#5 - A5 -        Bb5 - - - A5 - F5 -
  F#5 - - - D5 - B4 -         D5 - - - B4 - G4 -
  E#5 - - - G#5 - - -         C#5 - - - B4 - G#4 -
`);

// --- C: the cell upside down (C# F# F# E), a step lower each time. ---
const TUNE_C = tune(`
  C#5 - F#5 F#5 E5 - - -      B4 - - - - - . .
  A4 - D5 D5 C#5 - - -        G#4 - - - - - . .
  F#4 - B4 B4 A4 - - -        E4 - - - - - . .
  G#4 - B#4 - D#5 - - -       C#5 - - - - - . .
`);

// --- D: the weight. The cell hammered as a riff, up a half step onto G. ---
const RIFF = tune(`
  C#4 F#4 F#4 G#4 A4 - G#4 F#4    C#4 F#4 F#4 G#4 B4 - A4 G#4
  D4 G4 G4 A4 B4 - A4 G4          G#4 - - - E#4 - . .
`);

// --- THE GROOVE: three notes, every 16th, one long count for the whole
// song so each section carries on where the last left off. ---
const START = { intro: 0, A: 2, A1: 10, B: 18, C: 26, D: 34, A2: 38, tail: 46 };
const GROOVE_NOTES = { D: ['A4', 'D5', 'A5'], Bb: ['A4', 'D5', 'A5'], G: ['G4', 'D5', 'B4'] };
function groove(name, chords, { every = 1 } = {}) {
  const out = [];
  chordsOf(chords).forEach((chord, bar) => {
    const notes = GROOVE_NOTES[chord] ?? ['F#4', 'C#5', 'G#5'];
    for (let s = 0; s < BAR; s++) {
      const k = (START[name] + bar) * BAR + s;
      out.push(k % every === 0 ? midi(notes[k % 3]) : '.');
    }
  });
  return out;
}

// --- The bass: 3-3-2 (root, root, octave; fifth, root, octave), on the
// lowest strings of the basses (F#1 up to E2). ---
const SHAPE = [0, '.', '.', 0, '.', '.', 12, '.', '.', '.', 7, '.', 0, '.', 12, '.'];
const LOWEST = { 'F#': 'F#1', G: 'G1', 'G#': 'G#1', A: 'A1', Bb: 'Bb1', B: 'B1', 'C#': 'C#2', D: 'D2', E: 'E2' };
const rootOf = (chord) => midi(LOWEST[chord.replace(/m$/, '')]);
const bass = (chords, pattern = SHAPE) => chordsOf(chords).flatMap((c) => {
  const root = rootOf(c);
  return pattern.map((p) => (typeof p === 'number' ? root + p : p));
});
const deep = (chords) => sustained(chords, BAR, 0, 2);

// --- Timpani on the ones, folded onto the drums' own notes (F#2 to F3). ---
const ONE = 'x...............';
const timpOnes = (chords) => chordsOf(chords).flatMap((c) => {
  let n = rootOf(c) + 12;
  while (n < 42) n += 12;
  while (n > 53) n -= 12;
  return [n, ...Array(BAR - 1).fill('.')];
});

// --- Drums: low toms in the area song's 6+6+4, a deep drum, a frame drum. ---
const KNOCK = 'x.....x.....x...';
const TURN = 'x.....x.....x.xx';
const FRAME = '....x.......x...';
const FRAME_GHOST = '....x..x....x.x.';
const BOOM = 'x.....x.........';
// Drips and the sounding line's pings, where they fall.
const DRIPS_A = scatter(8, BAR, [[1, 9, 'C#7'], [3, 3, 'G#6'], [5, 13, 'E7'], [7, 6, 'C#7']]);
const DRIPS_C = scatter(8, BAR, [[0, 5, 'G#6'], [1, 12, 'C#7'], [3, 2, 'E7'], [4, 9, 'G#6'], [6, 3, 'C#7']]);
const pings = (bars, note = 'C#6') => scatter(bars, BAR, Array.from({ length: bars / 2 }, (_, i) => [i * 2, 0, note]));
// The real sea at the cave mouth: [bar, note], 60 the smallest wave and 67 the biggest.
const sea = (bars, events) => {
  const out = rest(bars);
  for (const [bar, note] of events) out[bar * BAR] = note;
  return out;
};

export const SOUNDINGS_BATTLE_THEME = {
  title: 'No Bottom',
  bpm: 132,
  stepsPerBeat: 4,
  volume: 1.3,

  instruments: {
    // The hook, low and hard: cellos and violas in unison.
    cellos: { sample: 'cellos', volume: 0.24, attack: 0.03, release: 0.3, reverb: 0.5, pan: -0.15, humanize: { time: 0.006, volume: 0.08 } },
    violas: { sample: 'violas', volume: 0.2, attack: 0.03, release: 0.3, reverb: 0.5, pan: 0.15, humanize: { time: 0.006, volume: 0.08 } },
    violins: { sample: 'violins', volume: 0.15, attack: 0.04, release: 0.3, reverb: 0.55, pan: 0.3, humanize: { time: 0.006, volume: 0.08 } },
    // The area song's glass (a glock two octaves up) and its echoes off the walls.
    glass: { sample: 'glock', volume: 0.09, ring: true, octave: 2, reverb: 0.6, pan: 0.1 },
    echo1: { sample: 'glock', volume: 0.045, ring: true, octave: 2, reverb: 0.8, pan: -0.45, muffle: 4000 },
    echo2: { sample: 'glock', volume: 0.025, ring: true, octave: 2, reverb: 0.9, pan: 0.5, muffle: 2500 },
    oboe: { sample: 'oboe', volume: 0.26, attack: 0.03, release: 0.3, reverb: 0.55, pan: 0.15, humanize: { time: 0.006, volume: 0.1 } },
    clarinet: { sample: 'clarinet', volume: 0.18, attack: 0.05, release: 0.4, reverb: 0.55, pan: -0.2 },
    vibes: { sample: 'vibesBowed', volume: 0.22, attack: 0.15, release: 1.2, reverb: 0.75, pan: 0.15 },
    horns: { sample: 'hornsSoft', volume: 0.12, attack: 0.4, release: 0.8, reverb: 0.6, pan: -0.25 },
    trombone: { sample: 'trombone', volume: 0.16, attack: 0.08, release: 0.5, reverb: 0.5, pan: 0.1 },
    tuba: { sample: 'tuba', volume: 0.16, attack: 0.06, release: 0.4, reverb: 0.45, pan: -0.05 },
    choir: { sample: 'choir', volume: 0.06, attack: 1.4, release: 2.0, reverb: 0.85 },
    // The groove: bitten violins, with the area song's dotted-8th echo.
    groove: { sample: 'violinsSpic', volume: 0.08, release: 0.12, reverb: 0.5, pan: 0.3, humanize: { time: 0.006, volume: 0.25 }, echo: { time: 0.341, feedback: 0.3, mix: 0.3 } },
    basses: { sample: 'bassSpic', volume: 0.36, release: 0.15, reverb: 0.3, humanize: { time: 0.005, volume: 0.12 } },
    bite: { sample: 'cellosSpic', volume: 0.12, release: 0.12, reverb: 0.35, pan: -0.2, humanize: { time: 0.005, volume: 0.15 } },
    deep: { sample: 'cellos', volume: 0.1, attack: 1.0, release: 1.6, reverb: 0.6, muffle: 500 },
    lowTrem: { sample: 'cellosTrem', volume: 0.18, attack: 0.8, release: 1.0, reverb: 0.6, pan: -0.1, muffle: 1200 },
    drips: { sample: 'glock', volume: 0.045, ring: true, muffle: 5000, reverb: 0.75, pan: 0.4, echo: { time: 0.45, feedback: 0.35, mix: 0.35 } },
    ping: { sample: 'glass', volume: 0.06, ring: true, reverb: 0.85, pan: -0.2, echo: { time: 0.68, feedback: 0.4, mix: 0.35 } },
    // The real sea, far off at the cave mouth through the rock.
    sea: { sample: 'seaWaves', volume: 0.1, ring: true, muffle: 900, reverb: 0.6 },
    tom: { sample: 'tom', drum: 'sample', volume: 0.4, ring: true, reverb: 0.45, pan: -0.05, humanize: { time: 0.005, volume: 0.2 } },
    frame: { sample: 'frameDrum', drum: 'sample', volume: 0.22, ring: true, reverb: 0.4, pan: 0.1, muffle: 2500, humanize: { time: 0.005, volume: 0.25 } },
    boom: { sample: 'bassDrumDeep', drum: 'sample', volume: 0.4, ring: true, reverb: 0.5 },
    timpani: { sample: 'timpani', volume: 0.32, ring: true, reverb: 0.45 },
    roll: { sample: 'timpaniRoll', volume: 0.28, ring: true, reverb: 0.45 },
    swell: { sample: 'cymbalSwell', drum: 'sample', volume: 0.08, reverb: 0.7, muffle: 5000 },
    crash: { sample: 'crash', drum: 'sample', volume: 0.1, ring: true, reverb: 0.7, muffle: 4000 },
  },

  sections: {
    // The groove alone, the sea far off, the bass creeping in.
    intro: fit('intro', {
      groove: groove('intro', INTRO_CHORDS),
      deep: deep(INTRO_CHORDS),
      sea: sea(2, [[0, 64]]),
      basses: [...rest(1), ...bass('F#m', [0, '.', '.', '.', '.', '.', 0, '.', '.', '.', '.', '.', 0, '.', 0, '.'])],
      drips: scatter(2, BAR, [[0, 11, 'C#7']]),
      boom: hits(`${ONE}................`),
    }, 2),

    // THE HOOK, low; the glass and its echo above.
    A: fit('A', {
      cellos: transpose(HOOK, -12),
      violas: transpose(HOOK, -12),
      glass: HOOK,
      echo1: late(HOOK, 3),
      groove: groove('A', A_CHORDS),
      basses: bass(A_CHORDS),
      deep: deep(A_CHORDS),
      tom: beat(KNOCK, 8),
      frame: [...rest(4), ...beat(FRAME, 4)],
      boom: repeat(hits(ONE), 8),
      drips: DRIPS_A,
    }, 8),

    // Again: violins an octave up, horns on the chords, both echoes.
    A1: fit('A1', {
      cellos: transpose(HOOK, -12),
      violas: transpose(HOOK, -12),
      violins: HOOK,
      glass: HOOK,
      echo1: late(HOOK, 3),
      echo2: late(HOOK, 6),
      horns: sustained(A_CHORDS, BAR, 1, 3),
      groove: groove('A1', A_CHORDS),
      basses: bass(A_CHORDS),
      bite: transpose(bass(A_CHORDS), 12),
      deep: deep(A_CHORDS),
      tom: repeat([...hits(KNOCK), ...hits(KNOCK), ...hits(KNOCK), ...hits(TURN)], 2),
      frame: beat(FRAME_GHOST, 8),
      boom: beat(BOOM, 8),
    }, 8),

    // The area song's middle: D and B-flat swapping, the falling thirds.
    B: fit('B', {
      oboe: TUNE_B,
      clarinet: transpose(TUNE_B, -12),
      echo1: late(TUNE_B, 3),
      choir: sustained(B_CHORDS, BAR, 1, 4),
      groove: groove('B', B_CHORDS),
      basses: bass(B_CHORDS),
      bite: transpose(bass(B_CHORDS), 12),
      deep: deep(B_CHORDS),
      tom: [...beat(KNOCK, 7), ...hits(TURN)],
      frame: beat(FRAME, 8),
      boom: repeat(hits(ONE), 8),
      timpani: [...rest(6), ...timpOnes('C# C#')],
    }, 8),

    // The sounding: the cell upside down and sinking, then the build.
    C: fit('C', {
      vibes: TUNE_C,
      glass: late(TUNE_C, 8),
      echo1: late(TUNE_C, 11),
      choir: sustained(C_CHORDS, BAR, 0, 3),
      deep: deep(C_CHORDS),
      lowTrem: [midi('F#2'), ...Array(4 * BAR - 1).fill('-'), ...rest(4)],
      groove: [...groove('C', C_CHORDS, { every: 2 }).slice(0, 4 * BAR), ...groove('C', C_CHORDS).slice(4 * BAR)],
      ping: pings(8),
      sea: sea(8, [[0, 65], [4, 62]]),
      drips: DRIPS_C,
      basses: after(4, bass(C_CHORDS)),
      // A heartbeat on the deep drum, so the dark never drops right out.
      boom: [...beat('x..x............', 4), ...rest(4)],
      tom: [...rest(4), ...hits('x.......x.......'), ...hits('x...x...x...x...'), ...hits('x.x.x.x.x.x.x.x.'), ...hits('xxxxxxxxxxxxxxxx')],
      roll: [...rest(6), midi('C#3'), ...Array(2 * BAR - 1).fill('-')],
      // Peaks on D's downbeat (3.18 s is 28 16ths at 132).
      swell: [...rest(6), ...hits('....x...........'), ...rest(1)],
    }, 8),

    // The weight: the cell as a riff in low unison; one beat of silence.
    D: fit('D', {
      violins: stopDead(transpose(RIFF, 12)),
      violas: stopDead(RIFF),
      cellos: stopDead(transpose(RIFF, -12)),
      basses: stopDead(transpose(RIFF, -24)),
      trombone: stopDead(transpose(RIFF, -24)),
      tuba: stopDead(transpose(RIFF, -24)),
      tom: stopDead([...beat('x.x.x.x.x.x.x.x.', 2), ...beat('x.xxx.xxx.xxxxxx', 2)]),
      boom: stopDead(beat('x.......x.......', 4)),
      timpani: stopDead([...timpOnes('F#m F#m'), ...timpOnes('G C#')]),
      crash: hits(`${ONE}${'.'.repeat(3 * BAR)}`),
    }, 4),

    // The payoff: the hook with everyone.
    A2: fit('A2', {
      cellos: transpose(HOOK, -12),
      violas: transpose(HOOK, -12),
      violins: HOOK,
      glass: HOOK,
      echo1: late(HOOK, 3),
      echo2: late(HOOK, 6),
      horns: sustained(A_CHORDS, BAR, 1, 3),
      trombone: sustained(A_CHORDS, BAR, 0, 2),
      tuba: bass(A_CHORDS, [12, '-', '-', '-', '-', '-', '-', '-', 12, '-', '-', '-', '-', '-', '-', '-']),
      groove: groove('A2', A_CHORDS),
      basses: bass(A_CHORDS),
      bite: transpose(bass(A_CHORDS), 12),
      deep: deep(A_CHORDS),
      tom: repeat([...hits(KNOCK), ...hits(TURN)], 4),
      frame: beat(FRAME_GHOST, 8),
      boom: beat(BOOM, 8),
      timpani: timpOnes(A_CHORDS),
      crash: hits(`${ONE}${'.'.repeat(7 * BAR)}`),
      drips: DRIPS_A,
    }, 8),

    // The groove and the bass carry it round.
    tail: fit('tail', {
      groove: groove('tail', TAIL_CHORDS),
      basses: bass(TAIL_CHORDS),
      deep: deep(TAIL_CHORDS),
      cellos: transpose(tune('. . . . . . . .   G#4 - - - E#4 - . .'), -12),
      echo1: late(tune('. . . . . . . .   G#4 - - - E#4 - . .'), 3),
      tom: [...hits(KNOCK), ...hits(TURN)],
      frame: beat(FRAME, 2),
    }, 2),
  },

  order: ['intro', 'A', 'A1', 'B', 'C', 'D', 'A2', 'tail'],
  loopFrom: 1,
};
