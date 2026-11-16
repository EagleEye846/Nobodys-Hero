import { melody, chordLine, sustained, arpeggio, hits, repeat } from '../../audio/notation.js';
import {
  BELLS, CONCERT_PIANO, HORN, CELLO, STRING_SECTION, CHOIR,
} from '../../audio/instruments.js';

// "A Light Left On": the theme of Heralds' Rest, the snowy village that's
// kept a lamp in the window for a hundred years for a Hero who never came.
// Sitting by the hearth while the snow comes down outside: a fingerpicked
// guitar rocking under a plain folk tune on a soft, felted piano, an ocarina
// answering it, a warm bed of strings, and the fire crackling now and then.
// A celesta catches the snowlight at the ends of phrases, and a sleigh bell
// shivers once, far off, when the music turns a corner. In the quiet middle a
// muted horn remembers the prophecy's tune (prophecyTheme.js), slowly, the
// way you'd hum something your grandmother sang, not as a fanfare.
// G major (the middle in E minor), 3/4 at 68 BPM, one step is a 16th note.
// About three minutes; the embers intro plays once, then it loops from the
// hearth.
//
//   embers        4 bars   the guitar alone, the fire, flakes on the celesta
//   hearth       16 bars   the tune on the piano
//   hearthAnswer 16 bars   the ocarina takes it, the piano answers
//   longWinter   16 bars   E minor, sadder: piano and cello, then the ocarina
//   snowfall      8 bars   hushed: the prophecy's tune on a muted horn
//   hearthReturn  8 bars   the tune's second half, piano and ocarina together

const BAR = 12;
const _ = '.';
const H = '-';
const silence = (bars) => Array(bars * BAR).fill(_);

// --- Chords: one a bar. ---
const EMBER_CHORDS = 'G Em C D';
const HEARTH_CHORDS = 'G Em C D G Bm C D Em C G D C D G D';
const WINTER_CHORDS = 'Em C Am B Em C D G C D Bm Em Am C B B';
const SNOWFALL_CHORDS = 'Em C G D Em C B Em';
const RETURN_CHORDS = 'Em C G D C D G D';

// --- Patterns, as semitones above each chord's root, one entry a 16th. ---
// Fingerpicking in 8ths: the root, up through the chord, and back.
const PICK = [0, H, 7, H, 'tenth', H, 12, H, 'tenth', H, 7, H];
// Slower, in quarters, for the hush.
const PICK_SLOW = [0, H, H, H, 7, H, H, H, 'tenth', H, H, H];
// The piano's broken chord in the sad middle, in place of the guitar.
const PIANO_BED = [0, H, H, H, 7, H, 'tenth', H, 12, H, H, H];
// The bass: one soft note a bar, sometimes leaning onto the fifth.
const BASS_ONE = [0, H, H, H, H, H, H, H, H, H, H, H];
const BASS_LEAN = [0, H, H, H, H, H, H, H, 7, H, H, H];
// Snowlight on the celesta, high up (written from octave 5).
const NO_TWINKLE = Array(BAR).fill(_);
const TWINKLE = [_, _, _, _, _, _, _, _, _, _, 12, H];
const TWINKLE_HIGH = [_, _, _, _, _, _, 'tenth', H, _, _, 19, H];
const TWINKLE_LATE = [_, _, _, _, _, _, _, _, 19, H, 12, H];
// Flakes drifting down the chord (written from octave 4), for the intro.
const FALLING = [24, H, H, H, 19, H, H, H, 'tenth', H, 12, H];

// Applies a different pattern to each bar in turn (cycling), so the twinkles
// come only where the tune breathes.
const sprinkle = (chords, octave, patterns) => chords.split(/\s+/).filter(Boolean)
  .flatMap((symbol, i) => chordLine(symbol, patterns[i % patterns.length], octave));

// --- The fire: a tiny tick of noise now and then, never on a beat you could
// count (each lands a random fraction of a second late, at a random level).
const CRACKLE = hits(`
  ...x........ | ......x..... | x........... | .....x....x.
`);
const CRACKLE_FAR = hits(`
  .......x.... | ..x......x.. | ............ | ....x.......
`);
const fire = (bars) => ({
  crackle: repeat(CRACKLE, bars / 4),
  crackleFar: repeat(CRACKLE_FAR, bars / 4),
});

// --- One shiver of sleigh bells, far off, at the start of a section. ---
const SHIVER = [98, 103, 100, 105, 101, _, _, _, _, _, _, _];
const shiver = (bars) => [...SHIVER, ...silence(bars - 1)];

// --- Tunes. Each token is an 8th note (two steps); six to a bar. ---
// The hearth: the village's tune. A rise of a sixth and a sigh down.
const HEARTH = melody(`
  D5 - B5 - - -  | A5 - G5 - E5 -  | G5 - - - E5 -  | D5 - - - - .  |
  D5 - B5 - - -  | A5 - F#5 - D5 - | E5 - G5 - C6 - | A5 - - - - .  |
  B5 - - - A5 G5 | E5 - - - G5 -   | D5 - - - B4 -  | A4 - - - - .  |
  E5 - G5 - C6 - | A5 - - G5 F#5 - | G5 - - - - -   | . . . . . .   |
`, 2);

// The answer: the ocarina's turn, reaching a little higher.
const ANSWER = melody(`
  D5 - B5 - - -  | A5 - G5 - E5 -  | G5 - - - E5 -  | D5 - - - - .  |
  D5 - B5 - - -  | A5 - F#5 - D5 - | E5 - G5 - C6 - | D6 - - - - .  |
  B5 - - - A5 G5 | E5 - - - G5 -   | B5 - - - D6 -  | A5 - - - - .  |
  E6 - D6 - C6 - | A5 - - G5 F#5 - | G5 - - - - -   | . . . . . .   |
`, 2);
// The piano, answering in the ocarina's long notes.
const PIANO_REPLY = melody(`
  . . . . . .    | . . . . . .     | . . . . . .    | . . A4 - F#4 - |
  . . . . . .    | . . . . . .     | . . . . . .    | . . F#5 - A5 - |
  . . . . . .    | . . . . . .     | . . . . . .    | . . D5 - F#5 - |
  . . . . . .    | . . . . . .     | . . B4 - D5 -  | A5 - - - F#5 - |
`, 2);

// The long winter: E minor, slower-feeling, a hundred years of waiting. It
// turns warm for a moment (into G) and then back to the cold.
const WINTER = melody(`
  E5 - - - B5 -  | C6 - - B5 A5 -  | A5 - - - E5 -  | D#5 - - - - . |
  E5 - - - B5 -  | C6 - - B5 A5 -  | A5 - - G5 F#5 - | G5 - - - - .  |
  E5 - - - G5 -  | F#5 - - - A5 -  | B5 - - - D6 -  | B5 - - - - .  |
  C6 - - - B5 A5 | G5 - - - E5 -   | F#5 - - - D#5 - | B4 - - - - .  |
`, 2);
const WINTER_FIRST = [...WINTER.slice(0, 8 * BAR), ...silence(8)];
const WINTER_SECOND = [...silence(8), ...WINTER.slice(8 * BAR)];
// The cello, low and long under it.
const CELLO_LINE = melody(`
  G3 - - - - -   | G3 - - - E3 -   | C4 - - - - -   | B3 - - - A3 -  |
  G3 - - - - -   | E3 - - - G3 -   | A3 - - - - -   | B3 - - - D4 -  |
  C4 - - - - -   | A3 - - - - -    | D4 - - - - -   | E4 - - - B3 -  |
  A3 - - - C4 -  | E4 - - - - -    | D#4 - - - - -  | F#3 - - - - -  |
`, 2);

// The snowfall: the prophecy's tune, slow, in E minor and in three, on a
// muted horn, the way the village half-remembers it.
const PROPHECY = melody(`
  . . B4 - E5 -  | G5 - - F#5 E5 - | D5 - - - - -   | B4 - D5 - G5 - |
  F#5 - - E5 B4 - | C5 - - - E5 -  | D#5 - - - F#5 - | E5 - - - - -  |
`, 2);

// The return: the second half of the tune, the piano and the ocarina in two
// voices, then the celesta lets a last flake fall back into the hearth.
const RETURN_PIANO = HEARTH.slice(8 * BAR);
const RETURN_OCARINA = ANSWER.slice(8 * BAR);
const LAST_FLAKE = melody(`
  . . . . . .    | . . . . . .     | . . . . . .    | . . . . . .   |
  . . . . . .    | . . . . . .     | . . . . . .    | D6 - A5 - F#5 - |
`, 2);

const warmth = (chords) => ({
  strings: sustained(chords, BAR, 0, 3),
  stringsHigh: sustained(chords, BAR, 1, 4),
});
const snowyWarmth = (chords) => ({
  ...warmth(chords),
  snow: sustained(chords, BAR, 2, 4),
});

// A nylon-string guitar, fingerpicked: two strings' worth of tone, a soft
// pluck, ringing and mellowing.
const GUITAR_TONE = [1, 0.5, 0.33, 0.2, 0.1, 0.06, 0.03];
const GUITAR = {
  voices: [{ harmonics: GUITAR_TONE, detune: -3 }, { harmonics: GUITAR_TONE, detune: 3 }],
  sweep: { from: 3200, to: 900, time: 0.5, q: 0.5 },
  attack: 0.003, decay: 0.9, sustain: 0, release: 1, gate: 1,
  click: 0.04,
  humanize: { time: 0.018, volume: 0.28 },
  pan: -0.2,
  reverb: 0.4,
};

// An ocarina: round and hollow, more breath than a flute, vibrato blooming late.
const OCARINA = {
  harmonics: [1, 0.1, 0.04, 0.015],
  attack: 0.08, decay: 0.8, sustain: 0.85, release: 0.35, gate: 0.96,
  vibrato: { rate: 4.8, depth: 11, delay: 0.35 },
  breath: { level: 0.14, frequency: 1600, q: 0.6 },
  humanize: { time: 0.012, volume: 0.1 },
  pan: 0.15,
  reverb: 0.55,
};

// A celesta: a bell with a little hammer and a bright octave shimmering above.
const CELESTA = {
  voices: [
    { harmonics: [1, 0, 0.3, 0, 0.12], level: 1 },
    { wave: 'sine', octave: 1, detune: 3, level: 0.3 },
    { wave: 'sine', octave: 2, level: 0.06 },
  ],
  attack: 0.002, decay: 0.9, sustain: 0, release: 0.9, gate: 1,
  click: 0.02,
  humanize: { time: 0.01, volume: 0.15 },
  reverb: 0.5,
};

// Sleigh bells: tiny, slightly out-of-tune bells, jingling and gone.
const SLEIGH_BELLS = {
  voices: [
    { wave: 'sine', level: 1 },
    { wave: 'sine', octave: 1, detune: 31, level: 0.55 },
    { wave: 'sine', octave: 1, detune: -47, level: 0.35 },
  ],
  attack: 0.001, decay: 0.08, sustain: 0, release: 0.12, gate: 1,
  click: 0.5,
  humanize: { time: 0.04, volume: 0.45 },
  pan: 0.35,
  reverb: 0.6,
};

// Falling snow outside: a soft, slow pad with a hiss of air through it.
const SNOW_PAD = {
  voices: [{ wave: 'sine', level: 1 }, { wave: 'triangle', octave: 1, detune: 6, level: 0.18 }],
  attack: 1.6, decay: 2, sustain: 0.85, release: 2, gate: 1,
  breath: { level: 0.3, frequency: 7000, q: 0.4 },
  pan: 0.25,
  reverb: 0.6,
};

// A felted piano: the concert grand, softened, close by.
const FELT_PIANO = { ...CONCERT_PIANO, filter: { type: 'lowpass', frequency: 2400 } };

// A warm upright bass, plucked gently and left to ring.
const SOFT_BASS = {
  harmonics: [1, 0.4, 0.12, 0.04],
  attack: 0.01, decay: 0.9, sustain: 0.3, release: 0.9, gate: 1,
  humanize: { time: 0.01, volume: 0.12 },
  pan: -0.1,
  reverb: 0.3,
};

// The fire: a little tick of bright noise, landing whenever it likes.
const CRACKLE_TICK = { drum: 'hat', humanize: { time: 0.35, volume: 0.9 } };

export const REST_THEME = {
  title: 'A Light Left On',
  bpm: 68,
  stepsPerBeat: 4,
  loopFrom: 1,

  instruments: {
    piano: { ...FELT_PIANO, volume: 0.1, pan: 0.05, echo: { time: 0.882, feedback: 0.2, mix: 0.15 } },
    pianoBed: { ...FELT_PIANO, volume: 0.05, pan: -0.15 },
    ocarina: { ...OCARINA, volume: 0.07, echo: { time: 0.882, feedback: 0.25, mix: 0.22 } },
    guitar: { ...GUITAR, volume: 0.07 },
    bass: { ...SOFT_BASS, volume: 0.075 },
    cello: { ...CELLO, volume: 0.04 },
    // The muted horn, far off and soft, for the prophecy's tune.
    horn: { ...HORN, volume: 0.06, filter: { type: 'lowpass', frequency: 1500 }, echo: { time: 0.882, feedback: 0.3, mix: 0.25 } },
    celesta: { ...CELESTA, volume: 0.032, pan: 0.3, echo: { time: 0.882, feedback: 0.35, mix: 0.35 } },
    flakes: { ...BELLS, volume: 0.03, pan: -0.3, echo: { time: 1.323, feedback: 0.35, mix: 0.3 } },
    strings: { ...STRING_SECTION, volume: 0.02, pan: -0.3 },
    stringsHigh: { ...STRING_SECTION, volume: 0.013, pan: 0.3 },
    snow: { ...SNOW_PAD, volume: 0.024 },
    choir: { ...CHOIR, volume: 0.016 },
    sleigh: { ...SLEIGH_BELLS, volume: 0.016 },
    crackle: { ...CRACKLE_TICK, volume: 0.014, pan: -0.4 },
    crackleFar: { ...CRACKLE_TICK, volume: 0.009, pan: 0.3 },
  },

  sections: {
    // Embers: the guitar alone by the fire, snow drifting past the window.
    embers: {
      guitar: arpeggio(EMBER_CHORDS, BAR, 3, PICK),
      flakes: sprinkle(EMBER_CHORDS, 4, [FALLING, NO_TWINKLE]),
      bass: chordLine(EMBER_CHORDS, BASS_ONE, 2),
      snow: sustained(EMBER_CHORDS, BAR, 2, 4),
      stringsHigh: sustained(EMBER_CHORDS, BAR, 1, 4),
      sleigh: shiver(4),
      ...fire(4),
    },
    // The hearth: the tune on the piano.
    hearth: {
      piano: HEARTH,
      guitar: arpeggio(HEARTH_CHORDS, BAR, 3, PICK),
      bass: chordLine(HEARTH_CHORDS, BASS_ONE, 2),
      celesta: sprinkle(HEARTH_CHORDS, 5, [NO_TWINKLE, NO_TWINKLE, NO_TWINKLE, TWINKLE]),
      ...warmth(HEARTH_CHORDS),
      ...fire(16),
    },
    // The answer: the ocarina takes the tune, the piano answers it.
    hearthAnswer: {
      ocarina: ANSWER,
      piano: PIANO_REPLY,
      guitar: arpeggio(HEARTH_CHORDS, BAR, 3, PICK),
      bass: chordLine(HEARTH_CHORDS, BASS_LEAN, 2),
      celesta: sprinkle(HEARTH_CHORDS, 5, [NO_TWINKLE, NO_TWINKLE, NO_TWINKLE, TWINKLE_HIGH]),
      ...snowyWarmth(HEARTH_CHORDS),
      ...fire(16),
    },
    // The long winter: the piano and the cello alone at first, then the
    // ocarina and the guitar come back in.
    longWinter: {
      piano: WINTER_FIRST,
      ocarina: WINTER_SECOND,
      pianoBed: arpeggio(WINTER_CHORDS, BAR, 3, PIANO_BED),
      guitar: [...silence(8), ...arpeggio(WINTER_CHORDS, BAR, 3, PICK).slice(8 * BAR)],
      cello: CELLO_LINE,
      bass: chordLine(WINTER_CHORDS, BASS_ONE, 2),
      celesta: sprinkle(WINTER_CHORDS, 5, [NO_TWINKLE, NO_TWINKLE, NO_TWINKLE, TWINKLE_LATE]),
      strings: sustained(WINTER_CHORDS, BAR, 0, 3),
      snow: sustained(WINTER_CHORDS, BAR, 2, 4),
      ...fire(16),
    },
    // The snowfall: everything hushes; the prophecy's tune on a muted horn.
    snowfall: {
      horn: PROPHECY,
      guitar: arpeggio(SNOWFALL_CHORDS, BAR, 3, PICK_SLOW),
      bass: chordLine(SNOWFALL_CHORDS, BASS_ONE, 2),
      flakes: sprinkle(SNOWFALL_CHORDS, 5, [NO_TWINKLE, NO_TWINKLE, TWINKLE_LATE, NO_TWINKLE, NO_TWINKLE, NO_TWINKLE, NO_TWINKLE, TWINKLE]),
      choir: sustained(SNOWFALL_CHORDS, BAR, 1, 4),
      snow: sustained(SNOWFALL_CHORDS, BAR, 2, 4),
      strings: sustained(SNOWFALL_CHORDS, BAR, 0, 3),
      sleigh: shiver(8),
      ...fire(8),
    },
    // The return: the tune's second half in two voices, and back to the hearth.
    hearthReturn: {
      piano: RETURN_PIANO,
      ocarina: RETURN_OCARINA,
      guitar: arpeggio(RETURN_CHORDS, BAR, 3, PICK),
      bass: chordLine(RETURN_CHORDS, BASS_LEAN, 2),
      cello: sustained(RETURN_CHORDS, BAR, 1, 3),
      celesta: LAST_FLAKE,
      sleigh: shiver(8),
      ...snowyWarmth(RETURN_CHORDS),
      ...fire(8),
    },
  },

  order: ['embers', 'hearth', 'hearthAnswer', 'longWinter', 'snowfall', 'hearthReturn'],
};
