import { melody, chordLine, sustained, transpose } from '../../audio/notation.js';
import { CONCERT_PIANO, CELLO, SOLO_VIOLIN, STRING_SECTION, HARP } from '../../audio/instruments.js';

// "Little Wings": for after the Roost Mother, when her pup climbs onto Ves's
// umbrella and then brings her a plum from its mother's store, and Ves is
// filled with remorse (the bat_defeated cutscene). Built on her motif from
// "Carried on the Wind" (vesTheme.js: C C, up to A, Bb G A).
//   A      the piano alone, her motif in its timid minor form (as in the bat
//          fight, "Brave in the Dark"), over a slow harp
//   plum   F major for a moment: the violin sings her motif exactly as it is
//          in her own theme, warm, as the pup gives her something. It reaches
//          for her heroic climb, and the climb breaks on a minor chord (B-flat
//          minor, the dark of F) instead of soaring
//   sorry  back to D minor: the cello sings the minor motif low, and the
//          violin sighs above it in falling pairs
//   coda   a music box plays her motif once, high and alone, like the pup's
//          small kindness, and doesn't settle
// D minor, 60 BPM, one step is an 8th note (a bar is 8 steps). The intro plays
// once; then it loops from A (about two minutes).

const BAR = 8;
const rest = (bars) => Array(bars * BAR).fill('.');
// Each token a quarter note.
const tune = (text) => melody(text, 2);

// --- Her motif, three ways. ---
// Timid and minor (her leap shrunk to a minor sixth), from the bat fight.
const MINOR = 'A4/A4 F5 - - G5 E5 F5 -';
// As it is in her own theme.
const MAJOR = 'C5/C5 A5 - - Bb5 G5 A5 -';
// Her heroic climb, which here breaks instead of soaring.
const CLIMB = 'C5/C5 A5 - Bb5 - C6 - -';

// --- Chords, one a bar. ---
const INTRO_CHORDS = 'Dm Bb';
const A_CHORDS = 'Dm Bb Gm A Gm C A A';
const PLUM_CHORDS = 'F C Bb F F Bb Bbm C';
const SORRY_CHORDS = 'Dm A Gm Dm Gm F A A';
const CODA_CHORDS = 'F C Dm A';

// --- The tunes. ---
const A_PIANO = tune(`
  ${MINOR} | D5 - - - | . . . . |
  Bb4/Bb4 G5 - - A5 F5 G5 - | E5 - - - | C#5 - - - |
`);
const PLUM_VIOLIN = tune(`
  ${MAJOR} | F5 - E5 D5 | C5 - - - |
  ${CLIMB} | Db6 - - - | C6 - - - |
`);
const SORRY_CELLO = transpose(tune(`
  ${MINOR} | D5 - - - | . . . . |
  Bb4/Bb4 G5 - - A5 F5 G5 - | E5 - - - | C#5 - - - |
`), -12);
// Sighs: a note leaning on the one below it.
const SORRY_VIOLIN = tune(`
  . . . . | . . . . | D6 - C6 Bb5 | A5 - - - |
  . . . . | . . . . | G5 - F5 E5 | E5 - - - |
`);
const CODA_BOX = [...tune(`C6/C6 A6 - - Bb6 G6 A6 -`), ...rest(2)];

// --- Accompaniment, as semitones above each chord's root. ---
// The harp, slow: up through the chord in 8ths, and let ring.
const HARP_ROLL = [0, 7, 'tenth', 12, 'tenth', 7, '-', '.'];
// Barely there: one low note and the chord's tenth.
const HARP_SPARSE = [0, '-', '-', '.', 'tenth', '-', '.', '.'];

// The music box, far off (as in "Carried on the Wind").
const MUSIC_BOX = {
  voices: [
    { harmonics: [1, 0, 0.32, 0, 0.14, 0, 0.05], level: 1 },
    { wave: 'sine', octave: 2, detune: 8, level: 0.07 },
  ],
  attack: 0.002, decay: 1.4, sustain: 0, release: 1.6, gate: 1,
  click: 0.02,
  humanize: { time: 0.012, volume: 0.15 },
  reverb: 0.6,
  echo: { time: 1, feedback: 0.35, mix: 0.3 },
};

export const REMORSE_THEME = {
  title: 'Little Wings',
  bpm: 60,
  stepsPerBeat: 2,

  instruments: {
    piano: { ...CONCERT_PIANO, volume: 0.06, reverb: 0.5 },
    violin: { ...SOLO_VIOLIN, volume: 0.05, vibrato: { rate: 5.2, depth: 16, delay: 0.4 } },
    cello: { ...CELLO, volume: 0.06, vibrato: { rate: 4.6, depth: 14, delay: 0.5 } },
    harp: { ...HARP, volume: 0.035, pan: -0.25 },
    strings: { ...STRING_SECTION, volume: 0.016, attack: 1.4, pan: -0.3 },
    stringsHigh: { ...STRING_SECTION, volume: 0.012, attack: 1.4, pan: 0.3 },
    bass: { ...CELLO, volume: 0.028, pan: -0.4 },
    musicBox: { ...MUSIC_BOX, volume: 0.075, pan: 0.2 },
  },

  sections: {
    // Out of the silence: strings, and a few notes of harp.
    intro: {
      strings: sustained(INTRO_CHORDS, BAR, 0, 3),
      harp: chordLine(INTRO_CHORDS, HARP_SPARSE, 3),
    },
    // The piano alone with her motif, timid and minor.
    A: {
      piano: A_PIANO,
      harp: chordLine(A_CHORDS, HARP_ROLL, 3),
      strings: sustained(A_CHORDS, BAR, 0, 3),
      bass: sustained(A_CHORDS, BAR, 0, 2),
    },
    // The plum: her motif in major on the violin, warm; the climb breaks.
    plum: {
      violin: PLUM_VIOLIN,
      piano: transpose(PLUM_VIOLIN, -12).map((step, i) => (i < 4 * BAR ? '.' : step)),
      harp: chordLine(PLUM_CHORDS, HARP_ROLL, 3),
      strings: sustained(PLUM_CHORDS, BAR, 1, 3),
      stringsHigh: sustained(PLUM_CHORDS, BAR, 2, 4),
      bass: sustained(PLUM_CHORDS, BAR, 0, 2),
    },
    // Sorry: the cello low with the minor motif, the violin sighing above.
    sorry: {
      cello: SORRY_CELLO,
      violin: SORRY_VIOLIN,
      harp: chordLine(SORRY_CHORDS, HARP_SPARSE, 3),
      strings: sustained(SORRY_CHORDS, BAR, 0, 3),
      stringsHigh: sustained(SORRY_CHORDS, BAR, 1, 4),
    },
    // The music box, once, alone; it doesn't settle.
    coda: {
      musicBox: CODA_BOX,
      stringsHigh: sustained(CODA_CHORDS, BAR, 1, 4),
    },
  },

  order: ['intro', 'A', 'plum', 'sorry', 'coda'],
  loopFrom: 1,
};
