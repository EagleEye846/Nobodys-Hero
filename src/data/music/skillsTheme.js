import { melody, arpeggio, sustained } from '../../audio/notation.js';

// "Starlight Study": plays in the SKILLS menu. An original, slow and dreamy
// piece in E major: soft sine chords, a slow music-box arpeggio and a gentle
// melody, like reading by starlight. 60 BPM, one step is an 8th note.

const CHORDS = 'E C#m A B E G#m A B';

const LEAD = melody(`
  G#5 - - - - - B5 - | E5 - - - - - - - | C#6 - - - B5 - A5 - | F#5 - - - - - - - |
  G#5 - - - B5 - E6 - | D#6 - - - B5 - - - | C#6 - - - A5 - F#5 - | D#5 - - - - - - -
`, 1);

const PAD = { wave: 'sine', volume: 0.045, attack: 1, decay: 1.5, sustain: 0.8, release: 1.2, gate: 1 };

export const SKILLS_THEME = {
  title: 'Starlight Study',
  bpm: 60,
  stepsPerBeat: 2,

  instruments: {
    lead: {
      wave: 'sine',
      volume: 0.11,
      attack: 0.08,
      decay: 0.6,
      sustain: 0.6,
      release: 0.8,
      gate: 0.95,
      vibrato: { rate: 4, depth: 8 },
      echo: { time: 0.75, feedback: 0.4, mix: 0.35 },
    },
    musicBox: { wave: 'triangle', volume: 0.04, attack: 0.002, decay: 0.3, sustain: 0.2, release: 0.6, gate: 0.6, echo: { time: 0.5, feedback: 0.3, mix: 0.25 } },
    padRoot: PAD,
    padThird: PAD,
    padFifth: PAD,
  },

  sections: {
    main: {
      lead: LEAD,
      musicBox: arpeggio(CHORDS, 8, 4, [0, 'third', 7, 12, 'third', 7, 12, 7]),
      padRoot: sustained(CHORDS, 8, 0, 3),
      padThird: sustained(CHORDS, 8, 1, 3),
      padFifth: sustained(CHORDS, 8, 2, 3),
    },
  },

  order: ['main'],
};
