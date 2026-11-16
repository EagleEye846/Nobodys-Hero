import { midi } from '../../audio/notation.js';
import { starFall } from './parts/starGuardians.js';

// THE REFORGE STING, HOBNAIL'S: "Hn. (Done.)". Ten seconds, written to the
// reforge show's clock (src/overworld/reforgeShow.js): it starts as the
// screen dims and the show keeps time with it, so his three blows and the
// shard land on the music.
//
// Slow and heavy, like him: G minor opening into G major (the vent's
// warmth), 4/4 at 80 (a beat is 0.75 s, a bar three seconds, a step a
// 16th). Low brass, a tuba, cellos and a timpani roll, deep under the
// ground. Built on the Falling Star (parts/starGuardians.js: the high
// tonic, the fifth, the slip to the flat fifth, down to the tonic; quick,
// quick, a breath, long), here in G.
//
//   0.0-1.5   out of the dark, a bowed vibraphone and a glockenspiel ring
//             the Falling Star, far above, while the cellos hold a low G;
//             its last note lands on his first blow
//   1.5, 3.0  two blows, two beats apart: tuba and timpani on the floor,
//             low trombones stamping a chord (G minor, then E flat)
//   4.5-6.0   the third blow starts the Falling Star in the horns,
//             G3 D3, then the slip, C sharp, laid over D flat major
//             (the tritone from G: the crack); a timpani roll and a cymbal
//             swell climb, and
//   6.0       THE FLARE: the star lands on G, and G minor turns G major.
//             Tuba, low trombones, horns, the choir, a gong, a deep drum,
//             his anvil
//   7.0-10    under the name, the vibraphone rings the star once more,
//             slowly; the chord sits, warm, and dies away
//
// Two sections so a held skip can start at the hit: 'sting' (to the flare)
// and 'ring' (from it). Not a loop. Real recordings throughout. (draft)

const BPM = 80;
const STING = 32;  // 6 s
const RING = 22;   // 4.1 s

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
  // The star, far above: bowed vibraphone and the star's glockenspiel.
  vibes: { sample: 'vibesBowed', volume: 0.3, attack: 0.05, release: 1.2, reverb: 0.6, pan: 0.2 },
  starGlock: { sample: 'glock', volume: 0.13, ring: true, reverb: 0.6, pan: 0.25, echo: { time: 0.375, feedback: 0.25, mix: 0.2 } },
  // The floor.
  cellos: { sample: 'cellos', volume: 0.26, attack: 0.5, release: 1.0, reverb: 0.4, pan: -0.2 },
  tuba: { sample: 'tuba', volume: 0.42, release: 0.6, reverb: 0.3 },
  tbn1: { sample: 'trombone', volume: 0.3, release: 0.4, reverb: 0.35, pan: -0.2 },
  tbn2: { sample: 'trombone', volume: 0.28, release: 0.4, reverb: 0.35, pan: -0.05 },
  tbn3: { sample: 'trombone', volume: 0.26, release: 0.4, reverb: 0.35, pan: 0.1 },
  starBrass: { sample: 'horns', volume: 0.4, release: 0.5, reverb: 0.4, pan: 0.05 },
  timp: { sample: 'timpani', volume: 0.6, ring: true, reverb: 0.3 },
  roll: { sample: 'timpaniRoll', volume: 0.42, attack: 0.9, release: 0.1, reverb: 0.3 },
  swell: { sample: 'cymbalSwell', volume: 0.32, release: 0.04, reverb: 0.3 },
  // The flare.
  braam: { sample: 'trombone', volume: 0.55, release: 1.0, reverb: 0.45, pan: -0.1 },
  horn1: { sample: 'horns', volume: 0.28, attack: 0.04, release: 1.4, reverb: 0.45, pan: -0.2 },
  horn2: { sample: 'horns', volume: 0.26, attack: 0.04, release: 1.4, reverb: 0.45, pan: 0 },
  horn3: { sample: 'horns', volume: 0.24, attack: 0.04, release: 1.4, reverb: 0.45, pan: 0.2 },
  choirLo: { sample: 'choir', volume: 0.28, attack: 0.08, release: 2.0, reverb: 0.6, pan: -0.1 },
  choirMid: { sample: 'choir', volume: 0.25, attack: 0.08, release: 2.0, reverb: 0.6, pan: 0.1 },
  choirHi: { sample: 'choir', volume: 0.22, attack: 0.1, release: 2.0, reverb: 0.65, pan: 0.2 },
  gong: { sample: 'gong', drum: 'sample', volume: 0.38, ring: true, reverb: 0.4 },
  impact: { sample: 'bassDrumDeep', drum: 'sample', volume: 0.8, ring: true, reverb: 0.4 },
  anvil: { sample: 'anvil', drum: 'sample', volume: 0.45, ring: true, reverb: 0.45 },
};

// --- 'sting': 0 to 6 s, up to the flare ---
function sting() {
  const L = STING;
  const t = {};
  // The star far above, landing on the first blow (step 8).
  lay(t, L, 'vibes', 0, starFall('G4'));
  lay(t, L, 'starGlock', 0, starFall('G5'));
  lay(t, L, 'cellos', 0, hold('G2', 24));
  // Blows at steps 8 and 16: the floor and a low chord stamped.
  lay(t, L, 'tuba', 8, hold('G1', 4));
  lay(t, L, 'timp', 8, [n('G2')]);
  chord(t, L, ['tbn1', 'tbn2', 'tbn3'], 8, ['G2', 'Bb2', 'D3'], 6);
  lay(t, L, 'tuba', 16, hold('Eb2', 4));
  lay(t, L, 'timp', 16, [n('D3')]);
  chord(t, L, ['tbn1', 'tbn2', 'tbn3'], 16, ['Eb2', 'G2', 'Bb2'], 6);
  // The third blow (step 24) starts the star: G3 D3 over G minor, then the
  // slip, C sharp, over D flat major; it lands at the flare.
  lay(t, L, 'starBrass', 24, starFall('G2').slice(0, 8));
  lay(t, L, 'timp', 24, [n('G2')]);
  lay(t, L, 'tuba', 24, hold('G1', 4));
  lay(t, L, 'tuba', 28, hold('Db2', 4));
  chord(t, L, ['tbn1', 'tbn2'], 24, ['G2', 'Bb2'], 4);
  chord(t, L, ['tbn1', 'tbn2', 'tbn3'], 28, ['Db2', 'F2', 'Ab2'], 4);
  lay(t, L, 'cellos', 24, hold('D3', 4));
  lay(t, L, 'cellos', 28, hold('F3', 4));
  lay(t, L, 'roll', 24, hold('G2', 8));
  // The swell peaks 3.18 s in: laid 17 steps (3.19 s) before the flare.
  lay(t, L, 'swell', 15, hold(60, 17));
  return fill(t, L);
}

// --- 'ring': 6 to 10 s, the flare and the name ---
function ring() {
  const L = RING;
  const t = {};
  // THE FLARE: the star lands on G, and the third comes up to B.
  lay(t, L, 'starBrass', 0, hold('G2', 8));
  lay(t, L, 'braam', 0, hold('G2', 8));
  lay(t, L, 'tuba', 0, hold('G1', 10));
  chord(t, L, ['tbn1', 'tbn2', 'tbn3'], 0, ['D3', 'G3', 'B3'], 8);
  chord(t, L, ['horn1', 'horn2', 'horn3'], 0, ['B3', 'D4', 'G4'], 16);
  chord(t, L, ['choirLo', 'choirMid', 'choirHi'], 0, ['G3', 'D4', 'B4'], 22);
  lay(t, L, 'cellos', 0, hold('G2', 22));
  lay(t, L, 'timp', 0, [n('G2')]);
  lay(t, L, 'gong', 0, ['x']);
  lay(t, L, 'impact', 0, ['x']);
  lay(t, L, 'anvil', 0, ['x']);
  lay(t, L, 'starGlock', 0, [n('G5')]);
  // Under the name, the star once more on the vibraphone, slowly.
  lay(t, L, 'vibes', 6, starFall('G4'));
  return fill(t, L);
}

export const REFORGE_HOBNAIL_THEME = {
  title: 'Hn. (Done.)',
  bpm: BPM,
  stepsPerBeat: 4,
  loop: false,
  volume: 0.95,
  instruments: INSTRUMENTS,
  sections: { sting: sting(), ring: ring() },
  order: ['sting', 'ring'],
};
