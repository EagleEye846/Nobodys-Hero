import { melody, arpeggio, sustained } from '../../audio/notation.js';

// "Lantern Dark": the theme of the Ruins. An original, mysterious piece: D minor
// with a dark flat-two chord (E-flat) for an old, ancient feel. A twinkling
// music-box figure over a low drone and soft chords, with a sparse, echoing
// melody that leaves lots of space. 88 BPM, one step is an 8th note.

const CHORDS = 'Dm Bb Gm A Dm Eb Dm A Bb C Dm Dm Gm Eb A Dm';

// Each token is one 8th note; 8 per bar. Plenty of rests, so it feels like it's listening.
const LEAD = melody(`
  . . A4 - - - D5 - | F5 - - - - - . . | . . G4 - Bb4 - D5 - | C#5 - - - - - . . |
  . . A4 - D5 - F5 - | G5 - - - Eb5 - - - | D5 - - - - - . . | . . E5 - C#5 - A4 - |
  D5 - - - F5 - - - | E5 - - - C5 - - - | A4 - - - - - . . | . . F5 - E5 - D5 - |
  Bb4 - - - D5 - G5 - | G5 - - - F5 - Eb5 - | E5 - - - C#5 - E5 - | D5 - - - - - - -
`, 1);

const PAD = { wave: 'sine', volume: 0.04, attack: 0.8, decay: 1.2, sustain: 0.8, release: 1, gate: 1 };

export const RUINS_THEME = {
  title: 'Lantern Dark',
  bpm: 88,
  stepsPerBeat: 2,

  instruments: {
    lead: {
      wave: 'triangle',
      volume: 0.13,
      attack: 0.06,
      decay: 0.5,
      sustain: 0.6,
      release: 0.5,
      gate: 0.95,
      vibrato: { rate: 4, depth: 14 },
      echo: { time: 0.51, feedback: 0.42, mix: 0.38 },
    },
    // A music box turning slowly in another room.
    musicBox: {
      wave: 'sine',
      volume: 0.035,
      attack: 0.002,
      decay: 0.2,
      sustain: 0.15,
      release: 0.4,
      gate: 0.5,
      echo: { time: 0.34, feedback: 0.3, mix: 0.3 },
    },
    padThird: PAD,
    padFifth: PAD,
    drone: { wave: 'sine', volume: 0.12, attack: 0.5, decay: 1, sustain: 0.9, release: 0.8, gate: 1 },
  },

  sections: {
    main: {
      lead: LEAD,
      musicBox: arpeggio(CHORDS, 8, 5, [0, 7, 'third', 12, 7, 'third', 0, 7]),
      padThird: sustained(CHORDS, 8, 1, 3),
      padFifth: sustained(CHORDS, 8, 2, 3),
      drone: sustained(CHORDS, 8, 0, 2),
    },
  },

  order: ['main'],
};
