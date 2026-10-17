import { melody, sustained, arpeggio, transpose } from '../../audio/notation.js';
import { BELLS, HARP, CELLO, CHOIR } from '../../audio/instruments.js';

// "The Hollow Mountain": the theme of the ice caves inside the spire. Slow
// and echoing, the way a big cold space is: a music box picks out the
// mountain's tune ("Thin Air", vigilTheme.js) at a quarter of its speed, as
// if the rock were humming it; a harp drips; a cello and a far-off choir hold
// the chords. E minor, 72 BPM, one step is an 8th note. Loops (about ninety seconds).

const BAR = 8;
const CHORDS = 'Em C G D Em C Am B Em C G D Em Am B Em';

// The verse of "Thin Air", slowed right down, with its edges rounded off.
const HUM = melody(`
  E5 - - - B4 - E5 - | G5 - - - F#5 - E5 - | D5 - - - B4 - - - | E5 - - - - - . . |
  C5 - - - E5 - G5 - | C6 - - - B5 - A5 - | B5 - - - A5 - G5 - | F#5 - - - D5 - - - |
  E5 - - - B4 - E5 - | G5 - - - A5 - B5 - | D6 - - - B5 - - - | G5 - - - E5 - - - |
  C6 - - - B5 - A5 - | G5 - - - F#5 - G5 - | D#5 - - - F#5 - - - | B4 - - - - - . . |
`, 1);

// Drips from the harp, never quite on the beat.
const DRIPS = arpeggio(CHORDS, BAR, 5, ['.', '.', '.', 12, '.', '.', 7, '.']);

export const CAVES_THEME = {
  title: 'The Hollow Mountain',
  bpm: 72,
  stepsPerBeat: 2,

  instruments: {
    musicBox: { ...BELLS, volume: 0.07, echo: { time: 0.62, feedback: 0.45, mix: 0.4 } },
    musicBoxLow: { ...BELLS, volume: 0.025, pan: -0.3, echo: { time: 0.83, feedback: 0.4, mix: 0.35 } },
    harp: { ...HARP, volume: 0.035, echo: { time: 0.41, feedback: 0.3, mix: 0.3 } },
    cello: { ...CELLO, volume: 0.04 },
    choir: { ...CHOIR, volume: 0.02 },
    choirHigh: { ...CHOIR, volume: 0.014, pan: 0.3 },
    drone: { wave: 'sine', volume: 0.09, attack: 1.2, decay: 1.5, sustain: 0.9, release: 1.6, gate: 1 },
  },

  sections: {
    main: {
      musicBox: HUM,
      musicBoxLow: transpose(HUM, -12),
      harp: DRIPS,
      cello: sustained(CHORDS, BAR, 0, 3),
      choir: sustained(CHORDS, BAR, 1, 4),
      choirHigh: sustained(CHORDS, BAR, 2, 4),
      drone: sustained(CHORDS, BAR, 0, 2),
    },
  },

  order: ['main'],
};
