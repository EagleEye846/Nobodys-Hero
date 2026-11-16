import { melody, midi, hits, repeat, transpose, sustained, chordLine, scatter, tight } from './parts/chapter5.js';

// "By the Mark": the ordinary fights in the Soundings, the sea caves under
// the cliffs (the echo bat-shrimp, the plumb lead, the blind grotto crab,
// the tidewight, and the moon jellies and kelpie foals that drift in).
// "By the mark, five!" is what a leadsman called when the knot on his line
// came up level with the water: the Harbour Board's sounders sang it down
// here fathom by fathom. The plumb lead still does, and gets it a little
// wrong. So this is a song that measures: a ping goes out and comes back,
// a weight swings, the water drips and the tide comes up the stair.
//
// THE PING is the first thing you hear and the thing the whole song is
// built on: a glass ping on the bar, and its echo coming back off the far
// wall one beat later, quieter and on the other side. Everything that
// matters does the same. The hook's every note comes back a beat late on
// a glock, high and muffled, so the cave plays the tune back at you; the
// bat-shrimp's clicks (high plucked violins, two at a time) come back a
// beat late too.
//
// THE HOOK is the Soundings' hook (C# F# F# G#, then on up to A) moved down
// a fifth into C# minor (G# C# C# D# E) and played on a grand piano in
// octaves, hard, in a 3+3+2 rhythm against a bass pumping straight 8ths:
// the rising fourth to open, the same cell again, then a long answer that
// climbs to C# and falls through D major (the flat second, the one dark
// colour) to the leading note. Sing it: G#, C# C# D#, E D# C#.
//
// THE WEIGHT is the plumb lead: tuba and timpani swinging on 1 and 3 every
// bar, the root and the fifth below (C# down to G#, tick and tock), so the
// pulse is a pendulum. Bass on bitten basses in 8ths, cellos in 16ths, a
// deep drum, and a soft snare only on 3 (half time, so it is heavy, not
// quick). The drips are percussion: single muffled glock notes in a fixed
// pattern that comes round every two bars.
//
// C is the tide coming in: the drums drain away to the swing alone, the
// real sea booms up the stair, and the bass rises a semitone every bar
// (C# D D# E F F# G G#) while the hook's cell climbs with it on violins
// and tremolo strings swell. The drums come back and build, a timpani roll
// and a cymbal swell, one beat of silence, and A2 drops with everyone.
//
// C# minor, 4/4 at 138; one step a 16th, 16 to a bar (a bar is about 1.74 s).
// Chords: A is C#m C#m A B | C#m A D G#; B is the area song's chromatic-third
// swing moved to C# minor (A and F), then F#m D G#.
// The intro plays once; then it loops from A, 42 bars, about 1m13s:
//
//   section  bars  starts  what happens
//   intro      2   0:00    the ping and its echo, the weight swinging, the sea, clicks
//   A          8   0:03    THE HOOK on piano in octaves, its echo on glock a beat late;
//                          bass in 8ths, the deep drum, half-time snare, drips
//   A1         8   0:17    the hook again, violins on it, horns holding the chords,
//                          cellos running 16ths, toms joining on the 3+3+2
//   B          8   0:31    the blind crab feeling in the dark: A and F swapping, a slow
//                          tune on oboe and low clarinet with its echo; the clicks
//                          double, low choir, the weight never stops
//   C          8   0:45    the tide: drums out but the swing, the real sea, the bass
//                          rising a semitone a bar under the climbing cell; from bar 5
//                          toms build (8ths, then 16ths), a roll and a swell; one beat
//                          of silence
//   A2         8   0:59    the payoff: the hook on piano, violins, violas and trombone,
//                          choir, crash, toms on every 3+3+2, both echoes
//   tail       2   1:13    the weight and the bass carry it round to A (1:16)

const BAR = 16;
const tune16 = (text) => melody(text, 1);   // each token a 16th
const tune8 = (text) => melody(text, 2);    // each token an 8th
const rest = (bars) => Array(bars * BAR).fill('.');
const fit = (name, section, bars) => tight('By the Mark', name, section, bars, BAR);
const beat = (pattern, bars) => repeat(hits(pattern), bars);
const chordsOf = (text) => text.split(/\s+/).filter(Boolean);
// A copy of a track `steps` later: the far wall saying it back.
const late = (track, steps) => [...Array(steps).fill('.'), ...track.slice(0, track.length - steps)];
const after = (bars, track) => [...rest(bars), ...track.slice(bars * BAR)];
const until = (bars, track) => [...track.slice(0, bars * BAR), ...rest(track.length / BAR - bars)];
// Stop dead for the last `steps` of a track: the silent beat before the drop.
const stopDead = (track, steps = 4) => [...track.slice(0, track.length - steps), ...Array(steps).fill('.')];
const ECHO = 4;   // a beat

// --- Harmony, a bar each ---
const INTRO_CHORDS = 'C#m C#m';
const A_CHORDS = 'C#m C#m A B C#m A D G#';
const B_CHORDS = 'A F A F F#m D G# G#';
const C_CHORDS = 'C#m Dm D#m Em Fm F#m Gm G#';
const TAIL_CHORDS = 'C#m G#';

// --- THE HOOK: the cell twice (3+3+2), then the long answer through D. ---
const HOOK = tune16(`
  G#4 - - C#5 - - C#5 -   D#5 - - E5 - - D#5 -
  C#5 - - - G#4 - B4 -    C#5 - - - . . . .
  G#4 - - C#5 - - C#5 -   D#5 - - E5 - - F#5 -
  G#5 - - - F#5 - E5 -    D#5 - - - . . . .
  E5 - - G#5 - - G#5 -    A5 - - G#5 - - E5 -
  C#6 - - - B5 - A5 -     G#5 - - - E5 - - -
  A5 - - - F#5 - - -      D5 - - - F#5 - E5 -
  D#5 - - - B#4 - - -     G#4 - - - . . . .
`);

// --- B: the blind crab, feeling along. A and F (a third apart), then home. ---
const TUNE_B = tune8(`
  E5 - - - C#5 - A4 -     F5 - - - C5 - A4 -
  E5 - A5 - G#5 - E5 -    F5 - - - - - . .
  F#5 - - - E5 - C#5 -    D5 - - - F#5 - A5 -
  G#5 - - - B#4 - D#5 -   G#4 - - - - - . .
`);

// --- C: the cell (fifth below, root, root, step, minor third) on each rising
// root; over the last, G#, it ends on B# to lean back into C#. ---
const CELL_RHYTHM = [0, '-', '-', 1, '-', '-', 2, '-', 3, '-', '-', 4, '-', '-', '-', '-'];
const cellOn = (root, top = 3) => {
  const notes = [root - 5, root, root, root + 2, root + top];
  return CELL_RHYTHM.map((p) => (typeof p === 'number' ? notes[p] : p));
};
const TIDE_ROOTS = ['C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5'].map(midi);
const TUNE_C = TIDE_ROOTS.flatMap((r, i) => cellOn(r, i === 7 ? 4 : 3));

// --- The bass: bitten basses pumping 8ths on the root, the octave on the last. ---
const LOWEST = { 'C#': 37, D: 38, 'D#': 39, E: 40, F: 29, 'F#': 30, G: 31, 'G#': 32, A: 33, B: 35 };
const rootOf = (chord) => LOWEST[chord.replace(/m$/, '')];
const PUMP = [0, '.', 0, '.', 0, '.', 0, '.', 0, '.', 0, '.', 0, '.', 12, '.'];
const bass = (chords, pattern = PUMP, roots = rootOf) => chordsOf(chords).flatMap((c) => {
  const root = typeof roots === 'function' ? roots(c) : roots;
  return pattern.map((p) => (typeof p === 'number' ? root + p : p));
});
// The tide's bass: up a semitone a bar from C#2.
const TIDE_BASS = chordsOf(C_CHORDS).flatMap((c, i) => PUMP.map((p) => (typeof p === 'number' ? 37 + i + p : p)));
// The cellos' motor: 16ths round the root and fifth.
const MOTOR = [0, '.', 0, 7, 12, '.', 0, 7, 0, '.', 0, 7, 12, '.', 7, '.'];
const motor = (chords) => chordLine(chords, MOTOR, 2);

// --- THE WEIGHT: the root on 1, the fifth below on 3, on tuba and timpani. ---
const fold = (n, lo, hi) => { while (n < lo) n += 12; while (n > hi) n -= 12; return n; };
const swing = (chords, lo, hi, hold = 6) => chordsOf(chords).flatMap((c) => {
  const root = fold(rootOf(c), lo, hi);
  const low = fold(root - 5, lo, hi);
  const half = (n) => [n, ...Array(hold - 1).fill('-'), ...Array(8 - hold).fill('.')];
  return [...half(root), ...half(low)];
});
const tubaSwing = (chords) => swing(chords, 32, 44);
const timpSwing = (chords) => swing(chords, 42, 53, 1);
const deep = (chords) => sustained(chords, BAR, 0, 2);

// --- The ping and its echo: on the bar, every two bars. ---
const pings = (bars, note = 'C#6') => scatter(bars, BAR, Array.from({ length: bars / 2 }, (_, i) => [i * 2, 0, note]));
// The bat-shrimp's clicks, two at a time; each pair comes back a beat later.
const CLICKS = (bars) => scatter(bars, BAR, Array.from({ length: bars / 2 }, (_, i) => [
  [i * 2, 12, 'C#6'], [i * 2, 13, 'C#6'], [i * 2 + 1, 6, 'B5'], [i * 2 + 1, 7, 'C#6'],
]).flat());
const CLICKS_B = (bars) => scatter(bars, BAR, Array.from({ length: bars }, (_, i) => [
  [i, 2, 'C#6'], [i, 3, 'B5'], [i, 10, 'C#6'], [i, 11, 'D6'],
]).flat());
// Drips: one fixed pattern that comes round every two bars.
const DRIP_SHAPE = [[0, 7, 'G#6'], [1, 3, 'C#7'], [1, 13, 'E6']];
const drips = (bars) => scatter(bars, BAR, Array.from({ length: bars / 2 }, (_, i) => DRIP_SHAPE.map(([b, s, n]) => [i * 2 + b, s, n])).flat());
// The real sea booming in: [bar, wave] (60 the smallest, 67 the biggest).
const sea = (bars, events) => {
  const out = rest(bars);
  for (const [bar, note] of events) out[bar * BAR] = note;
  return out;
};

// --- Drums ---
const KICK = 'x.....x...x.....';
const KICK_HALF = 'x.........x.....';
const SNARE = '........x.......';
const TOMS = 'x..x..x.x..x..x.';
const TOMS_LIGHT = '......x.......x.';
const FILL = '........x.x.xxxx';
const ONE = 'x...............';

export const LEADLINE_BATTLE_THEME = {
  title: 'By the Mark',
  bpm: 138,
  stepsPerBeat: 4,
  volume: 1.8,

  instruments: {
    // The hook: a grand piano in octaves, hard.
    piano: { sample: 'grandPiano', volume: 0.3, release: 0.5, reverb: 0.55, pan: -0.1, humanize: { time: 0.005, volume: 0.08 } },
    pianoLow: { sample: 'grandPiano', volume: 0.24, release: 0.5, reverb: 0.5, pan: -0.15, humanize: { time: 0.005, volume: 0.08 } },
    // The cave playing it back: a glock, high and muffled, a beat late, the other side.
    sonar: { sample: 'glock', volume: 0.07, ring: true, octave: 1, reverb: 0.85, pan: 0.5, muffle: 3500 },
    violins: { sample: 'violins', volume: 0.15, attack: 0.04, release: 0.3, reverb: 0.55, pan: 0.3, humanize: { time: 0.006, volume: 0.08 } },
    violas: { sample: 'violas', volume: 0.16, attack: 0.04, release: 0.3, reverb: 0.5, pan: 0.15, humanize: { time: 0.006, volume: 0.08 } },
    trombone: { sample: 'trombone', volume: 0.16, attack: 0.05, release: 0.4, reverb: 0.5, pan: 0.05 },
    oboe: { sample: 'oboe', volume: 0.24, attack: 0.04, release: 0.35, reverb: 0.6, pan: 0.15, humanize: { time: 0.006, volume: 0.1 } },
    clarinet: { sample: 'clarinet', volume: 0.18, attack: 0.05, release: 0.4, reverb: 0.55, pan: -0.2 },
    horns: { sample: 'hornsSoft', volume: 0.12, attack: 0.35, release: 0.8, reverb: 0.6, pan: -0.25 },
    choir: { sample: 'choir', volume: 0.06, attack: 1.4, release: 2.0, reverb: 0.85 },
    // The tide's swell: tremolo strings.
    trem: { sample: 'cellosTrem', volume: 0.16, attack: 0.6, release: 0.8, reverb: 0.6, pan: -0.15 },
    tremHigh: { sample: 'violasTrem', volume: 0.1, attack: 0.6, release: 0.8, reverb: 0.65, pan: 0.2 },
    // The weight swinging.
    tuba: { sample: 'tuba', volume: 0.2, attack: 0.04, release: 0.4, reverb: 0.45, pan: -0.05 },
    timpani: { sample: 'timpani', volume: 0.3, ring: true, reverb: 0.5 },
    roll: { sample: 'timpaniRoll', volume: 0.26, ring: true, reverb: 0.5 },
    basses: { sample: 'bassSpic', volume: 0.32, release: 0.15, reverb: 0.3, humanize: { time: 0.005, volume: 0.12 } },
    motor: { sample: 'cellosSpic', volume: 0.1, release: 0.1, reverb: 0.35, pan: -0.25, humanize: { time: 0.005, volume: 0.2 } },
    deep: { sample: 'cellos', volume: 0.1, attack: 1.0, release: 1.6, reverb: 0.6, muffle: 500 },
    // The ping and its echo off the far wall.
    ping: { sample: 'glass', volume: 0.08, ring: true, reverb: 0.8, pan: -0.35 },
    pingBack: { sample: 'glass', volume: 0.035, ring: true, reverb: 0.95, pan: 0.45, muffle: 2500, echo: { time: 0.87, feedback: 0.35, mix: 0.35 } },
    // The bat-shrimp clicking, and its clicks coming back.
    click: { sample: 'violinsPizz', volume: 0.07, release: 0.08, reverb: 0.5, pan: -0.4, humanize: { time: 0.004, volume: 0.2 } },
    clickBack: { sample: 'violinsPizz', volume: 0.03, release: 0.08, reverb: 0.8, pan: 0.45, muffle: 2200 },
    drips: { sample: 'glock', volume: 0.05, ring: true, muffle: 4500, reverb: 0.75, pan: 0.3, echo: { time: 0.43, feedback: 0.3, mix: 0.3 } },
    // The real sea, up the tide stair.
    sea: { sample: 'seaWaves', volume: 0.1, ring: true, muffle: 900, reverb: 0.6 },
    boom: { sample: 'bassDrumDeep', drum: 'sample', volume: 0.42, ring: true, reverb: 0.5 },
    snare: { sample: 'snareSoft', drum: 'sample', volume: 0.16, ring: true, reverb: 0.75, muffle: 3500, humanize: { time: 0.004, volume: 0.1 } },
    tom: { sample: 'tom', drum: 'sample', volume: 0.32, ring: true, reverb: 0.45, pan: -0.05, humanize: { time: 0.005, volume: 0.2 } },
    fill: { sample: 'tenorDrum', drum: 'sample', volume: 0.18, ring: true, reverb: 0.5, pan: 0.1, humanize: { time: 0.004, volume: 0.15 } },
    swell: { sample: 'cymbalSwell', drum: 'sample', volume: 0.08, reverb: 0.7, muffle: 5000 },
    crash: { sample: 'crash', drum: 'sample', volume: 0.1, ring: true, reverb: 0.7, muffle: 4000 },
  },

  sections: {
    // The ping and its echo, the weight swinging, the sea; the bass comes in.
    intro: fit('intro', {
      ping: pings(2),
      pingBack: late(pings(2), ECHO),
      tuba: tubaSwing(INTRO_CHORDS),
      timpani: timpSwing(INTRO_CHORDS),
      deep: deep(INTRO_CHORDS),
      sea: sea(2, [[0, 65]]),
      click: CLICKS(2),
      clickBack: late(CLICKS(2), ECHO),
      basses: after(1, bass(INTRO_CHORDS)),
      boom: hits(`${ONE}${'.'.repeat(BAR)}`),
      fill: [...rest(1), ...hits(FILL)],
    }, 2),

    // THE HOOK on piano, and the cave playing it back.
    A: fit('A', {
      piano: HOOK,
      pianoLow: transpose(HOOK, -12),
      sonar: late(HOOK, ECHO),
      ping: pings(8),
      pingBack: late(pings(8), ECHO),
      click: CLICKS(8),
      clickBack: late(CLICKS(8), ECHO),
      drips: drips(8),
      tuba: tubaSwing(A_CHORDS),
      timpani: timpSwing(A_CHORDS),
      basses: bass(A_CHORDS),
      deep: deep(A_CHORDS),
      boom: beat(KICK, 8),
      snare: beat(SNARE, 8),
      fill: [...rest(7), ...hits(FILL)],
    }, 8),

    // Again, with violins on it, horns holding, cellos running, toms in.
    A1: fit('A1', {
      piano: HOOK,
      pianoLow: transpose(HOOK, -12),
      violins: HOOK,
      sonar: late(HOOK, ECHO),
      horns: sustained(A_CHORDS, BAR, 0, 3),
      ping: pings(8),
      pingBack: late(pings(8), ECHO),
      click: CLICKS(8),
      clickBack: late(CLICKS(8), ECHO),
      drips: drips(8),
      tuba: tubaSwing(A_CHORDS),
      timpani: timpSwing(A_CHORDS),
      basses: bass(A_CHORDS),
      motor: motor(A_CHORDS),
      deep: deep(A_CHORDS),
      boom: beat(KICK, 8),
      snare: beat(SNARE, 8),
      tom: beat(TOMS_LIGHT, 8),
      fill: [...rest(7), ...hits(FILL)],
    }, 8),

    // The blind crab feeling in the dark: A and F swapping, the clicks doubled.
    B: fit('B', {
      oboe: TUNE_B,
      clarinet: transpose(TUNE_B, -12),
      sonar: late(TUNE_B, ECHO),
      choir: sustained(B_CHORDS, BAR, 0, 3),
      ping: pings(8, 'C6'),
      pingBack: late(pings(8, 'C6'), ECHO),
      click: CLICKS_B(8),
      clickBack: late(CLICKS_B(8), ECHO),
      drips: drips(8),
      tuba: tubaSwing(B_CHORDS),
      timpani: timpSwing(B_CHORDS),
      basses: bass(B_CHORDS),
      motor: after(4, motor(B_CHORDS)),
      deep: deep(B_CHORDS),
      boom: beat(KICK_HALF, 8),
      snare: beat(SNARE, 8),
      fill: [...rest(7), ...hits(FILL)],
    }, 8),

    // The tide: the swing alone, the real sea, everything rising a semitone a bar.
    C: fit('C', {
      violins: stopDead(TUNE_C),
      sonar: late(TUNE_C, ECHO).map((n, i) => (i >= 8 * BAR - 4 ? '.' : n)),
      trem: stopDead(chordLine(C_CHORDS, [12, ...Array(BAR - 1).fill('-')], 2)),
      tremHigh: stopDead(after(4, chordLine(C_CHORDS, ['third', ...Array(BAR - 1).fill('-')], 4))),
      ping: pings(8),
      pingBack: late(pings(8), ECHO),
      sea: sea(8, [[0, 67], [3, 63], [6, 66]]),
      drips: until(6, drips(8)),
      // The weight keeps swinging, but rises with the tide.
      tuba: stopDead(chordsOf(C_CHORDS).flatMap((c, i) => [37 + i, ...Array(5).fill('-'), '.', '.', 32 + i, ...Array(5).fill('-'), '.', '.'])),
      timpani: until(4, timpSwing('C#m C#m C#m C#m C#m C#m C#m C#m')),
      basses: stopDead(after(4, TIDE_BASS)),
      boom: stopDead([...beat(ONE, 4), ...beat(KICK_HALF, 2), ...beat(KICK, 2)]),
      tom: stopDead([...rest(4), ...hits('x.......x.......'), ...hits('x...x...x...x...'), ...hits('x.x.x.x.x.x.x.x.'), ...hits('xxxxxxxxxxxxxxxx')]),
      roll: [...rest(6), midi('C#3'), ...Array(2 * BAR - 5).fill('-'), '.', '.', '.', '.'],
      // Peaks on A2's downbeat (3.18 s is 29 16ths at 138).
      swell: [...rest(6), ...hits('...x............'), ...rest(1)],
    }, 8),

    // The payoff: the hook with everyone.
    A2: fit('A2', {
      piano: HOOK,
      pianoLow: transpose(HOOK, -12),
      violins: HOOK,
      violas: transpose(HOOK, -12),
      trombone: transpose(HOOK, -24),
      sonar: late(HOOK, ECHO),
      horns: sustained(A_CHORDS, BAR, 0, 3),
      choir: sustained(A_CHORDS, BAR, 0, 3),
      ping: pings(8),
      pingBack: late(pings(8), ECHO),
      click: CLICKS(8),
      clickBack: late(CLICKS(8), ECHO),
      drips: drips(8),
      tuba: tubaSwing(A_CHORDS),
      timpani: timpSwing(A_CHORDS),
      basses: bass(A_CHORDS),
      motor: motor(A_CHORDS),
      deep: deep(A_CHORDS),
      boom: beat(KICK, 8),
      snare: beat(SNARE, 8),
      tom: beat(TOMS, 8),
      fill: [...rest(7), ...hits(FILL)],
      crash: hits(`${ONE}${'.'.repeat(7 * BAR)}`),
    }, 8),

    // The weight and the bass carry it round.
    tail: fit('tail', {
      pianoLow: transpose(tune16('G#4 - - C#5 - - C#5 -   D#5 - - - . . . .   . . . . . . . .   . . . . . . . .'), -12),
      sonar: late(tune16('G#4 - - C#5 - - C#5 -   D#5 - - - . . . .   . . . . . . . .   . . . . . . . .'), ECHO),
      ping: pings(2),
      pingBack: late(pings(2), ECHO),
      click: CLICKS(2),
      clickBack: late(CLICKS(2), ECHO),
      tuba: tubaSwing(TAIL_CHORDS),
      timpani: timpSwing(TAIL_CHORDS),
      basses: bass(TAIL_CHORDS),
      motor: motor(TAIL_CHORDS),
      deep: deep(TAIL_CHORDS),
      boom: beat(KICK, 2),
      snare: beat(SNARE, 2),
      fill: [...rest(1), ...hits(FILL)],
    }, 2),
  },

  order: ['intro', 'A', 'A1', 'B', 'C', 'A2', 'tail'],
  loopFrom: 1,
};
