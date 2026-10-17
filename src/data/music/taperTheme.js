import { melody, arpeggio, sustained } from '../../audio/notation.js';

// "Wax and Lullaby": Mother Taper's theme, for when she finds you. An
// original, slow and tender piece in B minor that leans toward D major, the
// way a kind voice warms a cold room. A music box carries the tune over a
// rocking harp and soft held chords. 70 BPM, one step is an 8th note.

// Two halves: the first asks, the second answers and comes home.
const CHORDS = 'Bm G D A Bm G Em F# G A F#m Bm G Em F# Bm';

const TUNE = melody(`
  F#5 - - - D5 - E5 - | F#5 - - - B4 - - - | A4 - - - F#4 - A4 - | E5 - - - - - . . |
  F#5 - - - D5 - E5 - | G5 - - - F#5 - E5 - | D5 - - - E5 - B4 - | C#5 - - - - - . . |
  D5 - - - E5 - F#5 - | E5 - - - C#5 - A4 - | C#5 - - - A4 - F#4 - | B4 - - - - - D5 - |
  B4 - - - D5 - G5 - | F#5 - - - E5 - D5 - | C#5 - - - A#4 - C#5 - | B4 - - - - - . . |
`, 1);

const PAD = { wave: 'sine', volume: 0.035, attack: 1.2, decay: 1.5, sustain: 0.8, release: 1.6, gate: 1 };

export const TAPER_THEME = {
  title: 'Wax and Lullaby',
  bpm: 70,
  stepsPerBeat: 2,

  instruments: {
    // The music box: bright and bell-like, with a soft echo, like it's playing in the next room.
    musicBox: {
      wave: 'sine',
      volume: 0.12,
      attack: 0.004,
      decay: 0.9,
      sustain: 0.25,
      release: 1,
      gate: 0.8,
      vibrato: { rate: 5, depth: 6 },
      echo: { time: 0.64, feedback: 0.35, mix: 0.32 },
    },
    // A harp rocking under it, like a cradle.
    harp: { wave: 'triangle', volume: 0.04, attack: 0.003, decay: 0.4, sustain: 0.2, release: 0.7, gate: 0.6, echo: { time: 0.43, feedback: 0.25, mix: 0.25 } },
    padThird: PAD,
    padFifth: PAD,
    bass: { wave: 'sine', volume: 0.09, attack: 0.4, decay: 1, sustain: 0.8, release: 1.2, gate: 1 },
  },

  sections: {
    main: {
      musicBox: TUNE,
      harp: arpeggio(CHORDS, 8, 3, [0, 7, 12, 'third', 12, 7, 'third', 7]),
      padThird: sustained(CHORDS, 8, 1, 4),
      padFifth: sustained(CHORDS, 8, 2, 4),
      bass: sustained(CHORDS, 8, 0, 2),
    },
  },

  order: ['main'],
};
