import { midi } from '../../audio/notation.js';
import { starFall } from './parts/starGuardians.js';

// THE REFORGE STING, ORLA'S: "The Big Light, Struck". Ten seconds, written
// to the reforge show's clock (src/overworld/reforgeShow.js): it starts as
// the screen dims and the show keeps time with it, so her three blows and
// the shard land on the music.
//
// Sea and lamp: A with the lamp's raised fourth (D sharp, the Lydian lift),
// rocking in 6/8 like a swell (a dotted crotchet a second, two to a bar,
// a step a 16th). A harp, soft horns, violas, the real sea (seaWaves), and
// the glass and glockenspiel for the lamp. Built on the Falling Star
// (parts/starGuardians.js: the high tonic, the fifth, the slip to the flat
// fifth, down to the tonic; quick, quick, a breath, long), here in A, where
// the slip is the lamp's own D sharp.
//
//   0.0-2.0   a small wave comes in; a harp and the glockenspiel ring the
//             Falling Star softly; its last note lands on her first blow
//   2, 3, 4   three blows, a beat apart, a timpani under each; the harp
//             rocks in 8ths over A, then B over A (the lamp), then F sharp
//             minor; soft horns and violas swell in
//   4.7-6.0   as the shard comes down, the horns and violins play the
//             Falling Star; its slip, D sharp, sits over B major, a timpani
//             roll and a cymbal swell climb, and
//   6.0       THE FLARE: its last note is the hit, on A major with the
//             raised fourth ringing on glass over it. A big wave breaks
//             under it; choir, full horns, tuba, timpani, a deep drum, a
//             crash
//   7.0-10    under the name the harp runs up the lamp's scale and the
//             glockenspiel rings the star once more, very small; the
//             chord rocks and dies away with the sea
//
// Two sections so a held skip can start at the hit: 'sting' (to the flare)
// and 'ring' (from it). Not a loop. Real recordings throughout. (draft)

const STING = 36;  // 6 s
const RING = 24;   // 4 s

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
// The harp rocking in 8ths: three notes up a beat, over and over.
const rock = (notes, beats) => Array.from({ length: beats * 3 }, (_, i) => [n(notes[i % notes.length]), '-']).flat();
const fill = (tracks, len) => { for (const k of Object.keys(INSTRUMENTS)) tracks[k] ??= line(len); return tracks; };

const INSTRUMENTS = {
  waves: { sample: 'seaWaves', volume: 0.1, ring: true, reverb: 0.25 },
  harp: { sample: 'harp', volume: 0.3, ring: true, reverb: 0.5, pan: -0.2 },
  starGlock: { sample: 'glock', volume: 0.15, ring: true, reverb: 0.6, pan: 0.2, echo: { time: 0.333, feedback: 0.25, mix: 0.2 } },
  glass: { sample: 'glass', volume: 0.16, ring: true, reverb: 0.7, pan: 0.3, echo: { time: 0.5, feedback: 0.3, mix: 0.25 } },
  violas: { sample: 'violas', volume: 0.2, attack: 0.5, release: 1.2, reverb: 0.5, pan: -0.15 },
  cellos: { sample: 'cellos', volume: 0.22, attack: 0.4, release: 1.2, reverb: 0.45, pan: -0.25 },
  horn1: { sample: 'hornsSoft', volume: 0.22, attack: 0.15, release: 1.2, reverb: 0.45, pan: -0.15 },
  horn2: { sample: 'hornsSoft', volume: 0.2, attack: 0.15, release: 1.2, reverb: 0.45, pan: 0.05 },
  timp: { sample: 'timpani', volume: 0.5, ring: true, reverb: 0.35 },
  roll: { sample: 'timpaniRoll', volume: 0.36, attack: 0.6, release: 0.1, reverb: 0.3 },
  swell: { sample: 'cymbalSwell', volume: 0.26, release: 0.04, reverb: 0.3 },
  // The star, and the flare.
  starHorn: { sample: 'horns', volume: 0.36, release: 0.6, reverb: 0.45, pan: 0 },
  violins: { sample: 'violins', volume: 0.28, attack: 0.02, release: 1.4, reverb: 0.5, pan: 0.25 },
  choirLo: { sample: 'choir', volume: 0.26, attack: 0.06, release: 2.0, reverb: 0.6, pan: -0.1 },
  choirMid: { sample: 'choir', volume: 0.24, attack: 0.06, release: 2.0, reverb: 0.6, pan: 0.1 },
  choirHi: { sample: 'choir', volume: 0.21, attack: 0.08, release: 2.0, reverb: 0.65, pan: 0.2 },
  tuba: { sample: 'tuba', volume: 0.42, release: 0.9, reverb: 0.3 },
  // The full horns, only on the flare.
  brass1: { sample: 'horns', volume: 0.4, release: 1.2, reverb: 0.45, pan: -0.2 },
  brass2: { sample: 'horns', volume: 0.36, release: 1.2, reverb: 0.45, pan: 0.2 },
  impact: { sample: 'bassDrumDeep', drum: 'sample', volume: 0.9, ring: true, reverb: 0.4 },
  crash: { sample: 'crash', drum: 'sample', volume: 0.38, ring: true, reverb: 0.4 },
};

// --- 'sting': 0 to 6 s, up to the flare ---
function sting() {
  const L = STING;
  const t = {};
  // A small wave; the star far off, landing on the first blow (step 12).
  lay(t, L, 'waves', 0, [61]);
  lay(t, L, 'harp', 4, starFall('A4'));
  lay(t, L, 'starGlock', 4, starFall('A5'));
  lay(t, L, 'cellos', 0, hold('A2', 12));
  // Blows at steps 12, 18, 24, a timpani under each; the harp rocks between.
  [['A2', 12], ['A2', 18], ['F#2', 24]].forEach(([note, at]) => lay(t, L, 'timp', at, [n(note)]));
  lay(t, L, 'harp', 12, rock(['A3', 'E4', 'C#5'], 1));
  lay(t, L, 'harp', 18, rock(['A3', 'D#4', 'F#4', 'B4', 'F#4', 'D#4'], 1));
  lay(t, L, 'harp', 24, rock(['F#3', 'C#4', 'A4'], 1));
  lay(t, L, 'violas', 12, hold('E4', 6));
  lay(t, L, 'violas', 18, hold('D#4', 6));
  lay(t, L, 'violas', 24, hold('C#4', 4));
  lay(t, L, 'cellos', 12, hold('A2', 12));
  lay(t, L, 'cellos', 24, hold('F#2', 4));
  chord(t, L, ['horn1', 'horn2'], 18, ['F#3', 'B3'], 6);
  chord(t, L, ['horn1', 'horn2'], 24, ['F#3', 'A3'], 4);
  lay(t, L, 'waves', 18, [62]);
  // THE STAR as the shard comes down (steps 28-36): A5 E5 over F sharp
  // minor, the slip D#5 over B major; it lands on the flare.
  lay(t, L, 'starHorn', 28, starFall('A3').slice(0, 8));
  lay(t, L, 'violins', 28, starFall('A4').slice(0, 8));
  lay(t, L, 'starGlock', 28, starFall('A5').slice(0, 8));
  chord(t, L, ['horn1', 'horn2'], 28, ['F#3', 'C#4'], 4);
  chord(t, L, ['horn1', 'horn2'], 32, ['F#3', 'B3'], 4);
  lay(t, L, 'tuba', 28, hold('F#2', 4));
  lay(t, L, 'tuba', 32, hold('B1', 4));
  lay(t, L, 'cellos', 28, hold('F#2', 4));
  lay(t, L, 'cellos', 32, hold('B2', 4));
  lay(t, L, 'violas', 28, hold('C#4', 4));
  lay(t, L, 'violas', 32, hold('D#4', 4));
  lay(t, L, 'choirLo', 32, hold('F#4', 4));
  lay(t, L, 'roll', 28, hold('B2', 8));
  // The swell peaks 3.18 s in: laid 19 steps (3.17 s) before the flare.
  lay(t, L, 'swell', 17, hold(60, 19));
  return fill(t, L);
}

// --- 'ring': 6 to 10 s, the flare and the name ---
function ring() {
  const L = RING;
  const t = {};
  // THE FLARE: the star's last note on A, the lamp's D sharp on glass above.
  lay(t, L, 'starHorn', 0, hold('A3', 10));
  lay(t, L, 'violins', 0, hold('A4', 18));
  lay(t, L, 'starGlock', 0, [n('A5')]);
  lay(t, L, 'glass', 0, [n('E6'), '.', '.', n('D#6'), '-', '-', '-', '-', '-', n('E6')]);
  chord(t, L, ['horn1', 'horn2'], 0, ['A2', 'E3'], 18);
  chord(t, L, ['brass1', 'brass2'], 0, ['E3', 'C#4'], 8);
  chord(t, L, ['choirLo', 'choirMid', 'choirHi'], 0, ['A3', 'E4', 'C#5'], 24);
  lay(t, L, 'violas', 0, hold('D#4', 6));
  lay(t, L, 'violas', 6, hold('E4', 18));
  lay(t, L, 'tuba', 0, hold('A1', 10));
  lay(t, L, 'cellos', 0, hold('A2', 24));
  lay(t, L, 'timp', 0, [n('A2')]);
  lay(t, L, 'impact', 0, ['x']);
  lay(t, L, 'crash', 0, ['x']);
  lay(t, L, 'waves', 0, [67]);
  // Under the name: the harp up the lamp's scale, the star once more, small.
  lay(t, L, 'harp', 7, ['A3', 'C#4', 'D#4', 'E4', 'G#4', 'A4', 'C#5', 'D#5', 'E5', 'A5'].map(n));
  lay(t, L, 'starGlock', 12, starFall('A5', { unit: 1 }));
  lay(t, L, 'harp', 18, rock(['A3', 'E4', 'C#5'], 1));
  return fill(t, L);
}

export const REFORGE_ORLA_THEME = {
  title: 'The Big Light, Struck',
  bpm: 60,
  stepsPerBeat: 6,
  loop: false,
  volume: 0.9,
  instruments: INSTRUMENTS,
  sections: { sting: sting(), ring: ring() },
  order: ['sting', 'ring'],
};
