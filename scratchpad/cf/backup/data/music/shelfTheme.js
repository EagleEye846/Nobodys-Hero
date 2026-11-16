import { melody, chordLine, arpeggio, sustained, transpose, hits, repeat } from '../../audio/notation.js';
import {
  FLUTE, HARP, STRING_SECTION, STACCATO_STRINGS, LOW_STRINGS, CHOIR, BELLS, HORN, PIZZICATO_BASS, CELLO, TIMPANI,
} from '../../audio/instruments.js';

// "Which Way the Wind Blows": the Weathervane Shelf (vigilWeathervanes.js),
// a high shelf of islands over the drop, where iron vanes turn the wind and
// the wind throws you about. A place to think in, not a fight: wide and
// cold like "Thin Air", but busier, the way a puzzle is busy, and always
// turning. Under everything a plucked figure goes round and round, and every
// bar it starts a quarter of the way further round, like a vane swinging.
// Staccato strings tick like the iron creaking; a harp catches the light;
// the flute picks up "Thin Air"'s climbing figure (B, E, G) and keeps
// turning it a new way; a horn calls across the gap; and once, when it
// gathers, everything swings round together onto a bright major chord before
// settling back into the cold. E minor, 100 BPM, one step is an 8th note.
// About a minute and a half, then it goes round again.
//
//   vane     8 bars   the turning figure, ticking strings, harp, a low pulse
//   flute    8 bars   the flute, turning "Thin Air"'s figure over
//   gather   8 bars   strings swelling, the horn calling, the timpani
//   swing    8 bars   round onto G major: everything, warm and bright
//   still    4 bars   it thins out to the figure alone, and round again

const BAR = 8;
const rest = (bars) => Array(bars * BAR).fill('.');

// The turning figure: the same four notes, starting a quarter further round
// each bar, like a weathervane coming about.
const TURNS = [
  [0, 7, 12, 'tenth', 0, 7, 12, 'tenth'],
  [7, 12, 'tenth', 0, 7, 12, 'tenth', 0],
  [12, 'tenth', 0, 7, 12, 'tenth', 0, 7],
  ['tenth', 0, 7, 12, 'tenth', 0, 7, 12],
];
function turning(chords, octave = 3) {
  return chords.split(/\s+/).filter(Boolean).flatMap((chord, i) => chordLine(chord, TURNS[i % 4], octave));
}

const TICK = ['.', 12, '.', '.', '.', 'tenth', '.', '.'];
const PULSE = [0, '.', '.', '.', 7, '.', '.', '.'];
const SWELL = [0, '-', '-', '-', '-', '-', '-', '-'];
const HARP_UP = [0, 7, 12, 'tenth', 19, 'tenth', 12, 7];
const BOOM = hits('x.......');

// --- Chords, a bar each. ---
const VANE_CHORDS = 'Em Em C C Am Am B B';
const FLUTE_CHORDS = 'Em C G D Em C Am B';
const GATHER_CHORDS = 'C D Em Em C D B B';
const SWING_CHORDS = 'G D Em C G D C D';
const STILL_CHORDS = 'Em Em C B';

// --- Tunes. Each token is an 8th note. ---
// The flute: "Thin Air"'s climb (B, E, G, then down), and then turned
// round: the same three notes, starting from each in turn.
const FLUTE_TUNE = melody(`
  B4 - E5 - G5 - - - | F#5 - E5 - - - . . | G5 - B5 - E5 - - - | F#5 - D5 - - - . . |
  E5 - G5 - B5 - - - | A5 - G5 - E5 - - - | C6 - A5 - E5 - G5 - | F#5 - - - D#5 - - - |
`, 1);
// The horn, calling across the gap in the gaps of the strings.
const GATHER_HORN = melody(`
  E4 - - - G4 - - - | F#4 - - - D4 - - - | B3 - - - E4 - G4 - | B4 - - - - - - - |
  C5 - - - B4 - G4 - | A4 - - - F#4 - - - | D#4 - - - F#4 - B4 - | D#5 - - - - - - - |
`, 1);
// The swing round: up into G major, everything together, the flute high.
const SWING_TUNE = melody(`
  B5 - D6 - G6 - - - | F#6 - - - D6 - - - | E6 - G6 - B6 - - - | A6 - G6 - E6 - - - |
  D6 - G6 - B6 - - - | A6 - F#6 - D6 - - - | E6 - - - C6 - E6 - | F#6 - - - - - - - |
`, 1);
// Bells catching the light now and then.
const BELL_GLINTS = melody(`
  . . . . . . B5 . | . . . . . . . . | . . . . . . E6 . | . . . . . . . . |
  . . . . . . B5 . | . . . . . . . . | . . . . . . A5 . | . . . . F#5 . . . |
`, 1);

const MODERATE = { ...STRING_SECTION, filter: { type: 'lowpass', frequency: 1800 } };

export const SHELF_THEME = {
  title: 'Which Way the Wind Blows',
  bpm: 100,
  stepsPerBeat: 2,

  instruments: {
    pluck: { ...PIZZICATO_BASS, volume: 0.098, pan: -0.15 },
    pluckHigh: { ...HARP, volume: 0.049, pan: 0.2 },
    tick: { ...STACCATO_STRINGS, volume: 0.031, pan: 0.35 },
    harp: { ...HARP, volume: 0.056, pan: -0.3 },
    flute: { ...FLUTE, volume: 0.084 },
    flute2: { ...FLUTE, volume: 0.049, pan: -0.2 },
    horn: { ...HORN, volume: 0.084 },
    bells: { ...BELLS, volume: 0.056, pan: 0.3, reverb: 0.6 },
    strings: { ...MODERATE, volume: 0.042, pan: -0.25 },
    strings2: { ...MODERATE, volume: 0.039, pan: 0.25 },
    low: { ...LOW_STRINGS, volume: 0.063 },
    cello: { ...CELLO, volume: 0.056 },
    choir: { ...CHOIR, volume: 0.042 },
    timpani: { ...TIMPANI, volume: 0.14 },
    boom: { drum: 'boom', volume: 0.308 },
  },

  sections: {
    // The vane turning on its own: the figure, the iron ticking, the harp.
    vane: {
      pluck: turning(VANE_CHORDS, 2),
      tick: chordLine(VANE_CHORDS, TICK, 4),
      harp: [...rest(4), ...arpeggio('Am Am B B', BAR, 3, HARP_UP)],
      low: chordLine(VANE_CHORDS, PULSE, 2),
      strings: sustained(VANE_CHORDS, BAR, 1, 4),
      bells: [...rest(4), ...BELL_GLINTS.slice(0, 4 * BAR)],
    },
    // The flute, turning "Thin Air" over.
    flute: {
      flute: FLUTE_TUNE,
      pluck: turning(FLUTE_CHORDS, 2),
      pluckHigh: turning(FLUTE_CHORDS, 4),
      tick: chordLine(FLUTE_CHORDS, TICK, 4),
      harp: arpeggio(FLUTE_CHORDS, BAR, 3, HARP_UP),
      low: chordLine(FLUTE_CHORDS, PULSE, 2),
      strings: sustained(FLUTE_CHORDS, BAR, 1, 4),
      strings2: sustained(FLUTE_CHORDS, BAR, 2, 4),
      bells: BELL_GLINTS,
    },
    // Gathering: the strings swell, the horn calls, the timpani rolls in.
    gather: {
      horn: GATHER_HORN,
      flute2: [...rest(4), ...transpose(GATHER_HORN.slice(4 * BAR), 12)],
      pluck: turning(GATHER_CHORDS, 2),
      tick: chordLine(GATHER_CHORDS, TICK, 4),
      cello: chordLine(GATHER_CHORDS, SWELL, 2),
      low: chordLine(GATHER_CHORDS, PULSE, 1),
      strings: sustained(GATHER_CHORDS, BAR, 1, 4),
      strings2: sustained(GATHER_CHORDS, BAR, 2, 4),
      choir: [...rest(4), ...sustained('C D B B', BAR, 0, 4)],
      timpani: [...rest(6), ...chordLine('B B', [0, '.', '.', '.', 0, '.', 0, 0], 2)],
      boom: [...repeat(BOOM, 6), ...rest(2)],
    },
    // Round onto G major: everything, warm and wide, the flute up high.
    swing: {
      flute: SWING_TUNE,
      horn: transpose(SWING_TUNE, -24),
      pluck: turning(SWING_CHORDS, 2),
      pluckHigh: turning(SWING_CHORDS, 4),
      harp: arpeggio(SWING_CHORDS, BAR, 3, HARP_UP),
      cello: chordLine(SWING_CHORDS, SWELL, 2),
      low: chordLine(SWING_CHORDS, PULSE, 1),
      strings: sustained(SWING_CHORDS, BAR, 1, 4),
      strings2: sustained(SWING_CHORDS, BAR, 2, 4),
      choir: sustained(SWING_CHORDS, BAR, 0, 4),
      bells: BELL_GLINTS,
      timpani: chordLine(SWING_CHORDS, [0, '.', '.', '.', '.', '.', '.', '.'], 2),
    },
    // It thins out to the figure alone, and the wind comes round again.
    still: {
      pluck: turning(STILL_CHORDS, 2),
      tick: [...chordLine('Em Em', TICK, 4), ...rest(2)],
      strings: sustained(STILL_CHORDS, BAR, 1, 4),
      timpani: [...rest(3), ...chordLine('B', [0, '.', 0, '.', 0, 0, 0, 0], 2)],
    },
  },

  order: ['vane', 'flute', 'gather', 'swing', 'still'],
  loopFrom: 0,
};
