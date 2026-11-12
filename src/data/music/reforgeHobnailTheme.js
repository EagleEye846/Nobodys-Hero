import { melody, midi, rest as restBars } from './parts/chapter4.js';

// THE REFORGE STING, HOBNAIL'S: about five seconds, played once as the shard
// sinks into the Fallen Star at the heat vent (src/overworld/reforgeShow.js).
// Slow and heavy: low horns and a trombone lean on G, a timpani rolls up
// under them, then G minor opens its third into G major (the vent's warmth,
// as in his shop song, "Hn.") and a gong and the anvil land on it with the
// choir. Two bars of 4/4 at 96 (a bar is two and a half seconds). Not a
// loop: it plays once and rings out. (draft)

const rest = (n) => restBars(n, 1);
const tune = (text) => melody(text, 2);
const held = (note, steps = 16) => [midi(note), ...Array(steps - 1).fill('-')];

export const REFORGE_HOBNAIL_THEME = {
  title: 'Hn. (Done.)',
  bpm: 96,
  stepsPerBeat: 4,
  loop: false,
  volume: 0.95,

  instruments: {
    roll: { sample: 'timpaniRoll', volume: 0.3, attack: 1.8, release: 0.4, reverb: 0.3 },
    lowHorn: { sample: 'horns', volume: 0.3, attack: 1.2, release: 2.4, reverb: 0.45, pan: -0.2 },
    grunt: { sample: 'trombone', volume: 0.3, attack: 0.05, release: 0.4, reverb: 0.3, pan: -0.1 },
    pad: { sample: 'cellos', volume: 0.2, attack: 1.6, release: 2.4, reverb: 0.45, pan: 0.2 },
    choirLow: { sample: 'choir', volume: 0.32, attack: 0.15, release: 2.8, reverb: 0.6, pan: -0.1 },
    choirMid: { sample: 'choir', volume: 0.28, attack: 0.15, release: 2.8, reverb: 0.6, pan: 0.1 },
    choirHigh: { sample: 'choir', volume: 0.24, attack: 0.2, release: 2.8, reverb: 0.65, pan: 0.2 },
    tuba: { sample: 'tuba', volume: 0.3, attack: 0.03, release: 1.4, reverb: 0.3 },
    timp: { sample: 'timpani', volume: 0.6, ring: true, reverb: 0.35 },
    gong: { sample: 'gong', drum: 'sample', volume: 0.35, ring: true, reverb: 0.4 },
    anvil: { sample: 'anvil', drum: 'sample', volume: 0.55, ring: true, reverb: 0.45 },
    bell: { sample: 'glock', volume: 0.12, ring: true, reverb: 0.6, pan: 0.35, echo: { time: 0.47, feedback: 0.3, mix: 0.3 } },
  },

  sections: {
    sting: {
      // Bar one: the grunt (G, Bb, and the cell's A), the roll climbing.
      grunt: [...tune('G2 . Bb2 A2 . . . .').slice(0, 16), ...rest(16)],
      roll: [...held('G2'), ...rest(16)],
      lowHorn: [...held('G2'), ...Array(16).fill('-')],
      pad: [...held('D3'), ...rest(16)],
      // Bar two: G major, the third raised.
      choirLow: [...rest(16), ...held('G3')],
      choirMid: [...rest(16), ...held('D4')],
      choirHigh: [...rest(16), ...held('B4')],
      tuba: [...rest(16), ...held('G1')],
      timp: [...rest(16), midi('G2'), ...rest(15)],
      gong: [...rest(16), 'x', ...rest(15)],
      anvil: [...rest(16), 'x', ...rest(7), 'x', ...rest(7)],
      bell: [...rest(16), ...rest(2), midi('B5'), '.', '.', '.', midi('D6'), '.', '.', '.', midi('G6'), ...rest(5)],
    },
  },
  order: ['sting'],
};
