// Shared pieces of songs (not songs themselves): tools/serve.py only lists
// the files directly in src/data/music/, so these stay out of the song list.

import { melody, midi, hits, repeat, transpose } from '../../../audio/notation.js';
import { CHOIR, ORGAN, BELLS } from '../../../audio/instruments.js';

// What the Usurper's songs share: the motifs, the orchestra, the drums, and
// the little helpers they're written with. His battle theme, "Who Would Be
// Hero" (../usurperHeroTheme.js), is built on them, and so are the three
// movements it replaced (usurperSmokeTheme.js, usurperLanternTheme.js,
// nobodysDawnTheme.js, now kept for chapter 3), which were meant to play one per phase of the fight
// (src/data/enemies/usurper.js), all at the same tempo.
//
//   HIS MOTIF: Ves's motif turned inside out. Hers is two quick notes, a leap
//     up a sixth, an ache, and home (C C, up to A, Bb G A). His has exactly
//     her rhythm, but the leap is a minor sixth and the ache creeps down
//     through a tritone (D D, up to Bb, A G# A): the hope she carries, curdled.
//   HER MOTIF: grieving in G minor while she relights the lantern; heroic in
//     G major once the light catches, climbing on past the ache (B B, up to
//     G, A B).
//   THE FANFARE: the Long Stair's tune (stairTheme.js), the village's own
//     fanfare for its Hero. He steals it into D minor; at dawn it's taken back.

export const BPM = 150;
export const BAR = 16;              // one step is a 16th note
export const tune = (text) => melody(text, 2);   // each token an 8th note
export const rest = (bars) => Array(bars * BAR).fill('.');
export const held = (note, steps) => [typeof note === 'number' ? note : midi(note), ...Array(steps - 1).fill('-')];
export { midi, hits, repeat, transpose };

// One bar of `pattern` (semitones above it, '.' and '-' as usual) on each
// named note: for basslines that aren't chord roots.
export const onNotes = (names, pattern) => names.split(/\s+/).filter(Boolean).flatMap((name) => pattern.map((p) => (typeof p === 'number' ? midi(name) + p : p)));
// A run of bars from a pattern of notes, each held for one bar.
export const heldBars = (names, octaveShift = 0) => names.split(/\s+/).filter(Boolean).flatMap((name) => held(midi(name) + 12 * octaveShift, BAR));

// --- The motifs, in their home keys (one token an 8th). ---
export const HIS = 'D5/D5 Bb5 - - A5 G#5 A5 -';
export const HERS_GRIEF = 'D5/D5 Bb5 - - C6 A5 Bb5 -';     // G minor
export const HERS_HERO = 'B4/B4 G5 - - A5 B5 - -';          // G major, past the ache

// --- Patterns. ---
// Pounding 16th low strings: the note, an octave pop on the off-beats.
export const POUND = [0, 0, 12, 0, 0, 12, 0, 0, 12, 0, 0, 12, 0, 12, 0, 12];
// The basses digging in on the 3-3-2.
export const DIG = [0, '.', '.', 0, '.', '.', 0, '.', 0, '.', '.', 0, '.', '.', 0, 0];
// Racing 16th violins.
export const RACE = [0, 7, 12, 'third', 12, 7, 'tenth', 7];
// A slow piano ripple in 8ths.
export const RIPPLE = [0, '-', 7, '-', 12, '-', 'tenth', '-', 19, '-', 'tenth', '-', 12, '-', 7, '-'];
// Piano octaves hammered on the 3-3-2.
export const HAMMER = [12, '.', '.', 12, '.', '.', 12, '.', 12, '.', '.', 12, '.', '.', 19, '.'];
export const QUARTER_PULSE = [0, '.', '.', '.', 0, '.', '.', '.', 0, '.', '.', '.', 7, '.', '.', '.'];
export const TREMBLE = Array(16).fill(0);

// --- Timpani: five real drums, so every root lands between F2 and E3. ---
const ROOT = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const pitchClass = (name) => (ROOT[name[0]] + (name[1] === '#' ? 1 : name[1] === 'b' ? -1 : 0) + 12) % 12;
export const timpRoot = (name) => 41 + ((pitchClass(name) - 5 + 12) % 12);
export const timp = (names, pattern) => names.split(/\s+/).filter(Boolean).flatMap((name) => pattern.map((p) => (typeof p === 'number' ? timpRoot(name) + p : p)));
export const T_POUND = [0, '.', '.', 0, '.', '.', -5, '.', 0, '.', '.', 0, '.', '.', -5, 0];
export const T_HEART = [0, '.', '.', 0, ...Array(12).fill('.')];
export const T_ONE = [0, ...Array(15).fill('.')];
export const T_ROLL = [0, '.', 0, '.', 0, '.', 0, '.', 0, 0, 0, 0, 0, 0, 0, 0];

// --- Drums. ---
export const HIT = hits('x....... ........');
export const KICK = hits('x.....x. ..x.....');
export const KICK_FOUR = hits('x...x... x...x...');
export const SNARE = hits('....x... ....x...');
export const FILL = hits('x.x.xxxx xxxxxxxx');
export const TAIKO = hits('x..x..x. x..x..x.');
export const TAIKO_HI = hits('....x..x ..x.x.xx');
export const HALF_TAIKO = hits('x....... x...x...');
export const RIM = hits('....x... ....x..x');
export const BUILD_8THS = hits('x.x.x.x. x.x.x.x.');
export const BUILD_16THS = hits('xxxxxxxx xxxxxxxx');
// Every `n`th bar starts with a hit.
export const every = (bars, n, first = 0) => Array.from({ length: bars }, (_, i) => (i % n === first % n ? HIT : rest(1))).flat();
// The cymbal swell is loudest 3.18s in (sampleSets.js): 32 steps at 150 BPM.
const SWELL_STEPS = 32;
export const swellInto = (bars) => [...Array(bars * BAR - SWELL_STEPS).fill('.'), ...held(60, SWELL_STEPS)];

// --- The orchestra: the same seats in every movement. Recordings, but for
// the choir, the organ and the bell, which the library doesn't have. ---
export const ORCHESTRA = {
  // strings
  soloViolin: { sample: 'soloViolin', volume: 0.55, release: 0.35, reverb: 0.45, pan: 0.15 },
  violins: { sample: 'violins', volume: 0.38, attack: 0.03, release: 0.35, reverb: 0.38, pan: 0.25 },
  violinsHigh: { sample: 'violins', volume: 0.3, attack: 0.03, release: 0.35, reverb: 0.4, pan: -0.25 },
  cellos: { sample: 'cellos', volume: 0.42, release: 0.4, reverb: 0.32, pan: -0.25 },
  race: { sample: 'violinsSpic', volume: 0.26, release: 0.05, reverb: 0.25, pan: 0.3, humanize: { time: 0.005, volume: 0.15 } },
  pound: { sample: 'cellosSpic', volume: 0.4, release: 0.05, reverb: 0.2, pan: -0.2, humanize: { time: 0.005, volume: 0.15 } },
  basses: { sample: 'bassSpic', volume: 0.46, release: 0.06, reverb: 0.15, humanize: { time: 0.005, volume: 0.12 } },
  // brass
  trumpets: { sample: 'trumpet', volume: 0.42, release: 0.15, reverb: 0.38, pan: 0.1, humanize: { time: 0.006, volume: 0.08 } },
  horns: { sample: 'horns', volume: 0.46, release: 0.2, reverb: 0.4, pan: -0.1, humanize: { time: 0.006, volume: 0.08 } },
  hornsSoft: { sample: 'hornsSoft', volume: 0.45, attack: 0.2, release: 0.5, reverb: 0.45 },
  trombones: { sample: 'trombone', volume: 0.46, release: 0.2, reverb: 0.32, pan: -0.15 },
  tuba: { sample: 'tuba', volume: 0.46, release: 0.3, reverb: 0.25 },
  braam: { sample: 'trombone', volume: 0.75, release: 0.7, reverb: 0.45 },
  braamLow: { sample: 'tuba', volume: 0.7, release: 0.7, reverb: 0.4 },
  // keys, and what the recordings don't have
  piano: { sample: 'piano', volume: 0.45, ring: true, reverb: 0.4, humanize: { time: 0.01, volume: 0.15 } },
  choir: { ...CHOIR, volume: 0.05 },
  chant: { ...CHOIR, volume: 0.06, attack: 0.04, decay: 0.3, sustain: 0.6, release: 0.2, gate: 0.85 },
  organ: { ...ORGAN, volume: 0.04 },
  toll: { ...BELLS, volume: 0.09, decay: 1.6, release: 1.8, reverb: 0.6 },
  musicBox: { ...BELLS, volume: 0.07, echo: { time: 0.4, feedback: 0.35, mix: 0.3 } },
  // percussion
  timpani: { sample: 'timpani', volume: 0.65, ring: true, reverb: 0.3 },
  timpRoll: { sample: 'timpaniRoll', volume: 0.55, release: 0.3, reverb: 0.3 },
  swell: { sample: 'cymbalSwell', volume: 0.45, release: 0.04, reverb: 0.3 },
  taiko: { sample: 'tenorDrum', drum: 'sample', volume: 0.55, ring: true, reverb: 0.25, humanize: { time: 0.004, volume: 0.15 } },
  taikoHigh: { sample: 'tenorDrumHigh', drum: 'sample', volume: 0.36, ring: true, reverb: 0.25, pan: 0.2, humanize: { time: 0.004, volume: 0.2 } },
  bassDrum: { sample: 'bassDrum', drum: 'sample', volume: 0.7, ring: true, reverb: 0.3 },
  snare: { sample: 'snare', drum: 'sample', volume: 0.4, ring: true, reverb: 0.25, humanize: { time: 0.003, volume: 0.2 } },
  rim: { sample: 'snareSoft', drum: 'sample', volume: 0.35, ring: true, reverb: 0.3, humanize: { time: 0.003, volume: 0.2 } },
  roll: { sample: 'snare', drum: 'sample', volume: 0.18, release: 0.08, reverb: 0.3, humanize: { time: 0.003, volume: 0.25 } },
  crash: { sample: 'crash', drum: 'sample', volume: 0.42, ring: true, reverb: 0.3 },
  gong: { sample: 'gong', drum: 'sample', volume: 0.55, ring: true, reverb: 0.35 },
  impact: { sample: 'bassDrumDeep', drum: 'sample', volume: 0.9, ring: true, reverb: 0.4 },
  kick: { drum: 'kick', volume: 0.45 },
  boom: { drum: 'boom', volume: 0.7 },
};
