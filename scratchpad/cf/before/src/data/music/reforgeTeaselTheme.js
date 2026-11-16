import { midi } from '../../audio/notation.js';
import { starFall } from './parts/starGuardians.js';

// THE REFORGE STING, TEASEL'S: "Struck True". Ten seconds, written to the
// reforge show's clock (src/overworld/reforgeShow.js): it starts as the
// screen dims and the show keeps time with it, so the hammer and the shard
// land on the music.
//
// Brisk and bright, like her: D major, 4/4 at 120 (a bar is two seconds,
// a step a 16th). Built on the Falling Star (parts/starGuardians.js: the
// high tonic, the fifth, the slip to the flat fifth, down to the tonic;
// quick, quick, a breath, long), here D6 A5 G#5 D5.
//
//   0.0-1.5   the star bells and a harp ring the Falling Star softly, far
//             off; its last note lands on her first blow
//   1.5-4.5   four blows, one every two beats, each with a timpani under
//             the anvil; quick spiccato strings run up D, G, E minor, A
//             between them; the horns come in for the last two; a cymbal
//             swells and a snare rolls
//   5.0-6.0   as the shard comes down, trumpets and violins play the
//             Falling Star over A then B flat (its slip is the flat seventh
//             of B flat: the crack), and
//   6.0       THE FLARE: its last note is the hit. D major, everyone: low
//             trombones, horns, trumpets, the choir, timpani, a deep drum,
//             a crash, her anvil, the bells
//   7.0-10    the chord rings under the new name; a harp runs up and the
//             glockenspiel rings the star once more, very small; the
//             strings lean to G and home to D
//
// Two sections so a held skip can start at the hit: 'sting' (to the flare)
// and 'ring' (from it). Not a loop. Real recordings throughout. (draft)

const BPM = 120;
const STING = 48;  // 6 s
const RING = 32;   // 4 s

// A blank line of `len` steps, and a way to lay notes on it.
const line = (len) => Array(len).fill('.');
const n = (note) => (typeof note === 'number' ? note : midi(note));
const hold = (note, len) => [n(note), ...Array(len - 1).fill('-')];
function lay(tracks, len, track, at, steps) {
  const t = (tracks[track] ??= line(len));
  steps.forEach((s, i) => { if (at + i < len && at + i >= 0) t[at + i] = s; });
}
function chord(tracks, len, names, at, notes, steps) {
  notes.forEach((note, i) => lay(tracks, len, names[i], at, hold(note, steps)));
}
const fill = (tracks, len) => { for (const k of Object.keys(INSTRUMENTS)) tracks[k] ??= line(len); return tracks; };

const INSTRUMENTS = {
  // The star's own bells (the sound every star guardian shares).
  starBells: { sample: 'chimes', volume: 0.22, ring: true, reverb: 0.55, pan: -0.05 },
  starGlock: { sample: 'glock', volume: 0.16, ring: true, reverb: 0.55, pan: 0.15, echo: { time: 0.25, feedback: 0.2, mix: 0.15 } },
  harp: { sample: 'harp', volume: 0.3, ring: true, reverb: 0.5, pan: -0.2 },
  // The brisk part.
  runHi: { sample: 'violinsSpic', volume: 0.22, release: 0.06, reverb: 0.3, pan: 0.25 },
  runLo: { sample: 'cellosSpic', volume: 0.26, release: 0.06, reverb: 0.25, pan: -0.2 },
  pedal: { sample: 'cellos', volume: 0.2, attack: 0.6, release: 0.5, reverb: 0.4, pan: -0.2 },
  hornLo: { sample: 'horns', volume: 0.24, attack: 0.08, release: 0.4, reverb: 0.4, pan: -0.15 },
  hornHi: { sample: 'horns', volume: 0.22, attack: 0.08, release: 0.4, reverb: 0.4, pan: -0.05 },
  timp: { sample: 'timpani', volume: 0.5, ring: true, reverb: 0.3 },
  roll: { sample: 'snare', drum: 'sample', volume: 0.12, release: 0.08, reverb: 0.3 },
  swell: { sample: 'cymbalSwell', volume: 0.36, release: 0.04, reverb: 0.3 },
  // The star, and the hit.
  trumpet: { sample: 'trumpet', volume: 0.36, release: 0.5, reverb: 0.4, pan: 0.1 },
  violins: { sample: 'violins', volume: 0.3, attack: 0.02, release: 1.2, reverb: 0.45, pan: 0.25 },
  violas: { sample: 'violas', volume: 0.24, attack: 0.02, release: 1.2, reverb: 0.45, pan: -0.1 },
  braam: { sample: 'trombone', volume: 0.5, release: 0.9, reverb: 0.45, pan: -0.15 },
  tuba: { sample: 'tuba', volume: 0.36, release: 0.9, reverb: 0.3 },
  choirLo: { sample: 'choir', volume: 0.26, attack: 0.05, release: 1.6, reverb: 0.55, pan: -0.1 },
  choirMid: { sample: 'choir', volume: 0.24, attack: 0.05, release: 1.6, reverb: 0.55, pan: 0.1 },
  choirHi: { sample: 'choir', volume: 0.2, attack: 0.06, release: 1.6, reverb: 0.6, pan: 0.2 },
  impact: { sample: 'bassDrumDeep', drum: 'sample', volume: 0.75, ring: true, reverb: 0.4 },
  crash: { sample: 'crash', drum: 'sample', volume: 0.34, ring: true, reverb: 0.35 },
  anvil: { sample: 'anvil', drum: 'sample', volume: 0.4, ring: true, reverb: 0.45 },
};

// --- 'sting': 0 to 6 s, up to the flare ---
function sting() {
  const L = STING;
  const t = {};
  // The star far off: bells and harp, landing on the first blow (step 12).
  lay(t, L, 'starBells', 4, starFall('D4'));
  lay(t, L, 'harp', 4, starFall('D5'));
  lay(t, L, 'pedal', 0, hold('D3', 12));
  // The blows (steps 12, 20, 28, 36), a timpani under each.
  [['D3', 12], ['D3', 20], ['A2', 28], ['A2', 36]].forEach(([note, at]) => lay(t, L, 'timp', at, [n(note)]));
  // Running 8ths between them: D, G, E minor, A.
  const runs = [
    [12, ['D4', 'F#4', 'A4', 'D5', 'A4', 'F#4', 'A4', 'D5'], ['D3', 'A2', 'D3', 'A2']],
    [20, ['B3', 'D4', 'G4', 'B4', 'G4', 'D4', 'G4', 'B4'], ['G2', 'D3', 'G2', 'D3']],
    [28, ['E4', 'G4', 'B4', 'E5', 'B4', 'G4', 'B4', 'E5'], ['E2', 'B2', 'E2', 'B2']],
    [36, ['A4', 'C#5', 'E5', 'A5'], ['A2', 'E3']],
  ];
  for (const [at, hi, lo] of runs) {
    lay(t, L, 'runHi', at, hi.flatMap((x) => [n(x), '.']));
    lay(t, L, 'runLo', at, lo.flatMap((x) => [n(x), '.', '.', '.']));
  }
  // The horns for the last two blows, then holding A under the star.
  chord(t, L, ['hornLo', 'hornHi'], 28, ['E3', 'B3'], 8);
  chord(t, L, ['hornLo', 'hornHi'], 36, ['A2', 'E3'], 8);
  // THE STAR as the shard comes down: over A (steps 40-44), then B flat 7 (44-48).
  const star = starFall('D5');
  lay(t, L, 'trumpet', 40, star.slice(0, 8));
  lay(t, L, 'violins', 40, star.slice(0, 8));
  lay(t, L, 'starGlock', 40, starFall('D6').slice(0, 8));
  chord(t, L, ['hornLo', 'hornHi'], 40, ['A2', 'E3'], 4);
  chord(t, L, ['hornLo', 'hornHi'], 44, ['Bb2', 'F3'], 4);
  lay(t, L, 'violas', 40, hold('C#5', 4));
  lay(t, L, 'violas', 44, hold('D5', 4));
  lay(t, L, 'tuba', 40, hold('A1', 4));
  lay(t, L, 'tuba', 44, hold('Bb1', 4));
  lay(t, L, 'choirLo', 40, hold('E4', 4));
  lay(t, L, 'choirLo', 44, hold('F4', 4));
  lay(t, L, 'choirMid', 44, hold('D5', 4));
  // The swell peaks 3.18 s in: laid 25 steps (3.1 s) before the flare.
  lay(t, L, 'swell', 23, hold(60, 25));
  lay(t, L, 'roll', 40, Array(8).fill('x'));
  return fill(t, L);
}

// --- 'ring': 6 to 10 s, the flare and the name ---
function ring() {
  const L = RING;
  const t = {};
  // THE FLARE: the star's last note, D, and everyone on D major.
  lay(t, L, 'trumpet', 0, hold('D5', 8));
  lay(t, L, 'violins', 0, hold('D5', 16));
  lay(t, L, 'starGlock', 0, [n('D6')]);
  lay(t, L, 'starBells', 0, [n('D4')]);
  lay(t, L, 'braam', 0, hold('D2', 8));
  lay(t, L, 'tuba', 0, hold('D2', 10));
  chord(t, L, ['hornLo', 'hornHi'], 0, ['D3', 'F#3'], 16);
  chord(t, L, ['choirLo', 'choirMid', 'choirHi'], 0, ['D4', 'A4', 'F#5'], 16);
  lay(t, L, 'violas', 0, hold('A4', 16));
  lay(t, L, 'timp', 0, [n('D3')]);
  lay(t, L, 'impact', 0, ['x']);
  lay(t, L, 'crash', 0, ['x']);
  lay(t, L, 'anvil', 0, ['x']);
  lay(t, L, 'pedal', 0, hold('D3', 16));
  // Under the name: a harp up D major, the star once more, very small.
  lay(t, L, 'harp', 9, ['D4', 'F#4', 'A4', 'D5', 'F#5', 'A5', 'D6'].flatMap((x) => [n(x)]));
  lay(t, L, 'starGlock', 16, starFall('D6', { unit: 1 }));
  // Strings and choir lean to G, then home.
  chord(t, L, ['choirLo', 'choirMid', 'choirHi'], 16, ['D4', 'G4', 'B4'], 8);
  chord(t, L, ['choirLo', 'choirMid', 'choirHi'], 24, ['D4', 'F#4', 'A4'], 8);
  lay(t, L, 'violins', 16, hold('B4', 8));
  lay(t, L, 'violins', 24, hold('A4', 8));
  lay(t, L, 'pedal', 16, hold('D3', 16));
  chord(t, L, ['hornLo', 'hornHi'], 16, ['D3', 'G3'], 8);
  chord(t, L, ['hornLo', 'hornHi'], 24, ['D3', 'F#3'], 8);
  return fill(t, L);
}

export const REFORGE_TEASEL_THEME = {
  title: 'Struck True',
  bpm: BPM,
  stepsPerBeat: 4,
  loop: false,
  volume: 0.9,
  instruments: INSTRUMENTS,
  sections: { sting: sting(), ring: ring() },
  order: ['sting', 'ring'],
};
