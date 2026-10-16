import { melody, chordLine } from '../../audio/notation.js';

// "Old Halls Waltz": an original waltz in 3/4, F major with a little minor
// colour: a gentle echoing lead over an "oom-pah-pah" accompaniment (bass on
// beat 1, chords on beats 2 and 3) and a music-box chime. 116 BPM, one step is
// an 8th note, so a bar is 6 steps. It was the Ruins theme but felt too jolly
// there, so it's saved for a brighter place later (play it as 'waltz').

const CHORDS = 'F Dm Bb C F Am Bb C Dm Bb F C Bb C F F';

// Each token is one 8th note; 6 per bar.
const LEAD = melody(`
  A4 - C5 - F5 - | E5 - - - D5 - | D5 - F5 - Bb5 - | A5 - - - G5 - |
  F5 - A5 - C6 - | E5 - - - C5 - | D5 - C5 - Bb4 - | C5 - - - - - |
  D5 - F5 - A5 - | G5 - F5 - D5 - | C5 - A4 - C5 - | G5 - - - E5 - |
  F5 - G5 - A5 - | Bb5 - A5 - G5 - | A5 - - - - - | F5 - - - . .
`, 1);

export const WALTZ_THEME = {
  title: 'Old Halls Waltz',
  bpm: 116,
  stepsPerBeat: 2,

  instruments: {
    lead: {
      wave: 'triangle',
      volume: 0.17,
      attack: 0.02,
      decay: 0.3,
      sustain: 0.6,
      release: 0.25,
      gate: 0.95,
      vibrato: { rate: 5, depth: 10 },
      echo: { time: 0.39, feedback: 0.25, mix: 0.22 },
    },
    // "Pah-pah": short, soft chord stabs on beats 2 and 3.
    stabThird: { wave: 'square', volume: 0.025, decay: 0.08, sustain: 0.4, release: 0.05, gate: 0.6, filter: { type: 'lowpass', frequency: 2200 } },
    stabFifth: { wave: 'square', volume: 0.025, decay: 0.08, sustain: 0.4, release: 0.05, gate: 0.6, filter: { type: 'lowpass', frequency: 2200 } },
    bass: { wave: 'triangle', volume: 0.2, decay: 0.3, sustain: 0.5, release: 0.15, gate: 0.9 },
    // A little music-box ping on each downbeat.
    chime: { wave: 'sine', volume: 0.05, attack: 0.002, decay: 0.15, sustain: 0.2, release: 0.3, gate: 0.5 },
  },

  sections: {
    main: {
      lead: LEAD,
      stabThird: chordLine(CHORDS, ['.', '.', 'third', '-', 'third', '-'], 4),
      stabFifth: chordLine(CHORDS, ['.', '.', 7, '-', 7, '-'], 4),
      bass: chordLine(CHORDS, [0, '-', '.', '.', '.', '.'], 2),
      chime: chordLine(CHORDS, [12, '.', '.', '.', '.', '.'], 5),
    },
  },

  order: ['main'],
};
