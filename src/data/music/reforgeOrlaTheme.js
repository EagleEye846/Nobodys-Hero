import { melody, midi, rest as restBars } from './parts/chapter4.js';

// THE REFORGE STING, ORLA'S: about five seconds, played once as the shard
// sinks into the Fallen Star at her forge (src/overworld/reforgeShow.js).
// Sea and lamp: a harp runs up A major like a wave drawing back, chimes
// glitter on the way, then a high choir opens on A with the lamp's raised
// fourth (D#, the Lydian lift) and a glass bell rings the beam. Two bars of
// 4/4 at 108 (a bar is just over two seconds). Not a loop: it plays once and
// rings out. (draft)

const rest = (n) => restBars(n, 1);
const tune = (text) => melody(text, 1);
const held = (note, steps = 16) => [midi(note), ...Array(steps - 1).fill('-')];

export const REFORGE_ORLA_THEME = {
  title: 'The Big Light, Struck',
  bpm: 108,
  stepsPerBeat: 4,
  loop: false,
  volume: 0.9,

  instruments: {
    harp: { sample: 'harp', volume: 0.26, ring: true, reverb: 0.5, pan: -0.2 },
    chimes: { sample: 'chimes', volume: 0.12, ring: true, reverb: 0.6, pan: 0.3 },
    pad: { sample: 'violas', volume: 0.2, attack: 1.7, release: 2.4, reverb: 0.5, pan: -0.2 },
    padHigh: { sample: 'violins', volume: 0.16, attack: 1.8, release: 2.4, reverb: 0.55, pan: 0.25 },
    choirLow: { sample: 'choir', volume: 0.3, attack: 0.1, release: 2.6, reverb: 0.6, pan: -0.1 },
    choirMid: { sample: 'choir', volume: 0.28, attack: 0.1, release: 2.6, reverb: 0.6, pan: 0.1 },
    choirHigh: { sample: 'choir', volume: 0.25, attack: 0.12, release: 2.6, reverb: 0.65, pan: 0.2 },
    horn: { sample: 'hornsSoft', volume: 0.26, attack: 0.1, release: 2.0, reverb: 0.4, pan: -0.15 },
    timp: { sample: 'timpani', volume: 0.45, ring: true, reverb: 0.4 },
    glass: { sample: 'glass', volume: 0.16, ring: true, reverb: 0.7, pan: 0.3, echo: { time: 0.55, feedback: 0.3, mix: 0.3 } },
    bell: { sample: 'glock', volume: 0.14, ring: true, reverb: 0.6, pan: -0.3 },
  },

  sections: {
    sting: {
      // Bar one: the wave draws back up the beach, A major in eighths.
      harp: [...tune('A3 . E4 . A4 . C#5 . E5 . A5 . C#6 . E6 .'), ...rest(16)],
      chimes: [...rest(8), midi('E6'), ...rest(3), midi('A6'), ...rest(3), ...rest(16)],
      pad: [...held('A2'), ...rest(16)],
      padHigh: [...held('E4'), ...rest(16)],
      // Bar two: A, with the lamp's raised fourth over it.
      choirLow: [...rest(16), ...held('A3')],
      choirMid: [...rest(16), ...held('E4')],
      choirHigh: [...rest(16), ...held('C#5')],
      horn: [...rest(16), ...held('A2')],
      timp: [...rest(16), midi('A2'), ...rest(15)],
      glass: [...rest(16), midi('E6'), '.', '.', '.', midi('A6'), '.', '.', '.', midi('D#6'), '-', '-', '-', midi('E6'), ...rest(3)],
      bell: [...rest(16), midi('A5'), ...rest(3), midi('C#6'), ...rest(3), midi('E6'), ...rest(7)],
    },
  },
  order: ['sting'],
};
