import { chordLine, sustained, transpose } from '../../audio/notation.js';
import { CONCERT_PIANO, CELLO, SOLO_VIOLIN, STRING_SECTION } from '../../audio/instruments.js';
import { TAPER_LULLABY, TAPER_LULLABY_CHORDS } from './taperTheme.js';

// "Wax and Lullaby (Last Light)": a somber remix of Mother Taper's theme, for
// when you fight her until her flame goes out (the taper_defeated cutscene).
// Her lullaby, slowed right down: a lone cello sings its first half, a violin
// the second, over a piano and strings barely there; then her own music box
// plays the opening once more, alone, as if from the empty house.
// B minor, 54 BPM, one step is an 8th note. Loops (about a minute and a half).

const BAR = 8;
const rest = (bars) => Array(bars * BAR).fill('.');

const FIRST_HALF = TAPER_LULLABY.slice(0, 8 * BAR);
const SECOND_HALF = TAPER_LULLABY.slice(8 * BAR);
const FIRST_CHORDS = TAPER_LULLABY_CHORDS.split(' ').slice(0, 8).join(' ');
const SECOND_CHORDS = TAPER_LULLABY_CHORDS.split(' ').slice(8).join(' ');
const CODA_CHORDS = 'Bm G Em F#';

// The piano, sparse: a low note, then the chord's fifth and tenth, and space.
const SPARSE = [0, '-', '.', 7, '.', 'tenth', '-', '.'];

// The music box's song: the same one from her house (see taperTheme.js).
const MUSIC_BOX = {
  wave: 'sine', volume: 0.07, attack: 0.004, decay: 1.1, sustain: 0.2, release: 1.4, gate: 0.8,
  vibrato: { rate: 5, depth: 6 },
  echo: { time: 0.83, feedback: 0.4, mix: 0.35 },
};

export const TAPER_FAREWELL_THEME = {
  title: 'Wax and Lullaby (Last Light)',
  bpm: 54,
  stepsPerBeat: 2,

  instruments: {
    cello: { ...CELLO, volume: 0.06, vibrato: { rate: 4.6, depth: 14, delay: 0.5 } },
    violin: { ...SOLO_VIOLIN, volume: 0.05, vibrato: { rate: 5, depth: 14, delay: 0.5 } },
    piano: { ...CONCERT_PIANO, volume: 0.04, pan: -0.15 },
    strings: { ...STRING_SECTION, volume: 0.016, attack: 1.2, pan: -0.3 },
    stringsHigh: { ...STRING_SECTION, volume: 0.012, attack: 1.2, pan: 0.3 },
    bass: { ...CELLO, volume: 0.03, pan: -0.4 },
    musicBox: MUSIC_BOX,
  },

  sections: {
    // Strings out of the silence, and a few piano notes.
    intro: {
      strings: sustained('Bm G', BAR, 0, 3),
      piano: [...chordLine('Bm', SPARSE, 2), ...rest(1)],
    },
    // The cello sings the first half of her lullaby, an octave down.
    first: {
      cello: transpose(FIRST_HALF, -12),
      piano: chordLine(FIRST_CHORDS, SPARSE, 2),
      strings: sustained(FIRST_CHORDS, BAR, 2, 3),
    },
    // The violin takes the second half; the cello holds the low notes under it.
    second: {
      violin: SECOND_HALF,
      bass: sustained(SECOND_CHORDS, BAR, 0, 2),
      piano: chordLine(SECOND_CHORDS, SPARSE, 2),
      strings: sustained(SECOND_CHORDS, BAR, 0, 3),
      stringsHigh: sustained(SECOND_CHORDS, BAR, 1, 4),
    },
    // Her music box, alone, playing the opening one more time.
    coda: {
      musicBox: [...FIRST_HALF.slice(0, 2 * BAR), ...rest(2)],
      stringsHigh: sustained(CODA_CHORDS, BAR, 1, 4),
    },
  },

  order: ['intro', 'first', 'second', 'coda'],
  loopFrom: 1,
};
