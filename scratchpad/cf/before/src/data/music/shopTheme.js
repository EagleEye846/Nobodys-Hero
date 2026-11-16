import { melody, chordLine, sustained } from '../../audio/notation.js';

// "Dust and Lanterns": the RUINS SHOP theme. An original piece in the spirit of
// Toby Fox's "Ruins": slow and wistful, A minor, a soft echoing lead over
// sustained chords and a quiet bass. 76 BPM, one step is an 8th note.

const CHORDS = 'Am F C G Am F E E Am F C G Am Dm E Am';

// Each token is one 8th note; 8 per bar.
const LEAD = melody(`
  A4 - - - C5 - B4 - | A4 - - - - - E4 - | G4 - - - E5 - D5 - | B4 - - - - - - - |
  A4 - - - C5 - E5 - | F5 - E5 - D5 - C5 - | B4 - - - G#4 - B4 - | E5 - - - - - - - |
  E5 - - - D5 - C5 - | C5 - - - A4 - F4 - | G4 - C5 - E5 - G5 - | F5 - - - D5 - B4 - |
  C5 - - - B4 - A4 - | F4 - A4 - D5 - - - | B4 - - - G#4 - - - | A4 - - - - - - -
`, 1);

const PAD = { wave: 'sine', volume: 0.045, attack: 0.6, decay: 1, sustain: 0.8, release: 0.9, gate: 1 };

export const SHOP_THEME = {
  title: 'Dust and Lanterns',
  bpm: 76,
  stepsPerBeat: 2,

  instruments: {
    lead: {
      wave: 'triangle',
      volume: 0.16,
      attack: 0.03,
      decay: 0.4,
      sustain: 0.6,
      release: 0.4,
      gate: 0.95,
      vibrato: { rate: 4.5, depth: 12 },
      echo: { time: 0.45, feedback: 0.35, mix: 0.3 },
    },
    padRoot: PAD,
    padThird: PAD,
    padFifth: PAD,
    bass: { wave: 'triangle', volume: 0.14, attack: 0.05, decay: 0.5, sustain: 0.6, release: 0.5, gate: 0.95 },
  },

  sections: {
    main: {
      lead: LEAD,
      padRoot: sustained(CHORDS, 8, 0),
      padThird: sustained(CHORDS, 8, 1),
      padFifth: sustained(CHORDS, 8, 2),
      bass: chordLine(CHORDS, [0, '-', '-', '-', 7, '-', '-', '-']),
    },
  },

  order: ['main'],
};
