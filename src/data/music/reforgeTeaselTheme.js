import { melody, midi, rest as restBars } from './parts/chapter4.js';

// THE REFORGE STING, TEASEL'S: about four seconds, played once as the shard
// sinks into the Fallen Star at her forge (src/overworld/reforgeShow.js).
// Brisk and bright, like her: a quick run of violins up a D major chord, a
// choir swelling underneath, then the whole thing lands on one bloom (choir,
// violins, a warm horn, a timpani under it) with the anvil's ring and a
// glockenspiel shimmer on top. Two bars of 4/4 at 120 (a bar is two seconds).
// Not a loop: it plays once and rings out. (draft)

const rest = (n) => restBars(n, 1);
const tune = (text) => melody(text, 1);
const held = (note, steps = 16) => [midi(note), ...Array(steps - 1).fill('-')];

export const REFORGE_TEASEL_THEME = {
  title: 'Struck True',
  bpm: 120,
  stepsPerBeat: 4,
  loop: false,
  volume: 0.9,

  instruments: {
    run: { sample: 'violins', volume: 0.28, attack: 0.01, release: 0.25, reverb: 0.4, pan: -0.15 },
    pad: { sample: 'choir', volume: 0.3, attack: 1.7, release: 2.2, reverb: 0.55 },
    bloomLow: { sample: 'choir', volume: 0.34, attack: 0.06, release: 2.4, reverb: 0.55, pan: -0.1 },
    bloomMid: { sample: 'choir', volume: 0.3, attack: 0.06, release: 2.4, reverb: 0.55, pan: 0.1 },
    bloomHigh: { sample: 'choir', volume: 0.26, attack: 0.08, release: 2.4, reverb: 0.6, pan: 0.2 },
    strings: { sample: 'violins', volume: 0.26, attack: 0.05, release: 2.0, reverb: 0.5, pan: 0.25 },
    horn: { sample: 'horns', volume: 0.3, attack: 0.04, release: 1.8, reverb: 0.4, pan: -0.2 },
    timp: { sample: 'timpani', volume: 0.5, ring: true, reverb: 0.3 },
    anvil: { sample: 'anvil', drum: 'sample', volume: 0.5, ring: true, reverb: 0.4 },
    bell: { sample: 'glock', volume: 0.16, ring: true, reverb: 0.55, pan: 0.35, echo: { time: 0.3, feedback: 0.3, mix: 0.3 } },
    glint: { sample: 'chimes', volume: 0.1, ring: true, reverb: 0.6, pan: -0.3 },
  },

  sections: {
    sting: {
      // Bar one: sixteenths up D major; the choir comes up under them.
      run: [...tune('D4 F#4 A4 D5 F#5 A5 D6 F#6 A5 D6 F#6 . . . . .'), ...rest(16)],
      pad: [...held('D3'), ...rest(16)],
      // Bar two: the bloom.
      bloomLow: [...rest(16), ...held('D4')],
      bloomMid: [...rest(16), ...held('A4')],
      bloomHigh: [...rest(16), ...held('F#5')],
      strings: [...rest(16), ...held('A5')],
      horn: [...rest(16), ...held('D3')],
      timp: [...rest(16), midi('D3'), ...rest(15)],
      anvil: [...rest(16), 'x', ...rest(15)],
      bell: [...rest(16), midi('D6'), '.', midi('A6'), '.', midi('D7'), ...rest(11)],
      glint: [...rest(16), ...rest(4), midi('F#6'), '.', midi('A6'), '.', midi('D7'), ...rest(7)],
    },
  },
  order: ['sting'],
};
