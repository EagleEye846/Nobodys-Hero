import { melody, arpeggio, sustained } from '../../audio/notation.js';

// "Once, a Promise": plays under the intro and on the title screen. An
// original, slow storybook piece in A minor: a lone music box over soft
// chords, like an old tale being read aloud. 66 BPM, one step is an 8th note.

const CHORDS = 'Am F C G Am F E Am';

const LEAD = melody(`
  . . E5 - - - A5 - | C6 - - - B5 - A5 - | G5 - - - - - . . | . . E5 - G5 - C6 - |
  B5 - - - A5 - E5 - | F5 - - - A5 - - - | G#5 - - - - - B5 - | A5 - - - - - . . |
`, 1);

const PAD = { wave: 'sine', volume: 0.04, attack: 1, decay: 1.5, sustain: 0.8, release: 1.4, gate: 1 };

export const PROPHECY_THEME = {
  title: 'Once, a Promise',
  bpm: 66,
  stepsPerBeat: 2,

  instruments: {
    lead: {
      wave: 'triangle',
      volume: 0.11,
      attack: 0.05,
      decay: 0.6,
      sustain: 0.5,
      release: 0.9,
      gate: 0.9,
      vibrato: { rate: 4, depth: 10 },
      echo: { time: 0.68, feedback: 0.4, mix: 0.35 },
    },
    musicBox: { wave: 'sine', volume: 0.035, attack: 0.002, decay: 0.25, sustain: 0.15, release: 0.5, gate: 0.5, echo: { time: 0.45, feedback: 0.3, mix: 0.3 } },
    padThird: PAD,
    padFifth: PAD,
    drone: { wave: 'sine', volume: 0.1, attack: 0.8, decay: 1, sustain: 0.9, release: 1, gate: 1 },
  },

  sections: {
    main: {
      lead: LEAD,
      musicBox: arpeggio(CHORDS, 8, 5, [0, 7, 'third', 12, 'third', 7, 0, 7]),
      padThird: sustained(CHORDS, 8, 1, 3),
      padFifth: sustained(CHORDS, 8, 2, 3),
      drone: sustained(CHORDS, 8, 0, 2),
    },
  },

  order: ['main'],
};
