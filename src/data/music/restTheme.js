import { melody, chordLine, sustained, arpeggio, transpose, hits, repeat } from '../../audio/notation.js';
import {
  BELLS, FLUTE, HARP, HORN, BRASS, SOLO_VIOLIN, CELLO, STRING_SECTION, CHOIR, TIMPANI, PIZZICATO_BASS,
} from '../../audio/instruments.js';

// "Lamplight and Snowfall": the theme of Heralds' Rest, the snowy village
// that's been ready for a hundred years. Warm windows in deep snow: a celesta
// tune over plucked basses and a rippling harp, sleigh bells shaking softly
// on the off-beats, a music box and a glockenspiel catching the light like
// flakes, strings and a far choir lying over it all like a blanket of snow.
// In the middle the heralds rehearse their fanfare, which is the tune from
// the prophecy (prophecyTheme.js), played gently on a pair of horns, because
// they've been practising it all this time. Then the snow comes down harder
// and everything hushes to a music box, before the village warms up again.
// F major, 84 BPM, one step is a 16th note. About two and a half minutes,
// then it loops from the hearth (the snowfall intro plays once).
//
//   snowfall      4 bars   celesta flakes falling, a horn call far off
//   hearth        8 bars   the tune on the celesta, bells and pizzicato
//   hearthAnswer  8 bars   the flute takes it, the glockenspiel replies
//   lanterns      8 bars   a warmer tune on the violin, the cello under it
//   heralds       8 bars   the prophecy's tune on soft horns, as a fanfare
//   hush          8 bars   heavy snow: the music box alone, slowed, choir
//   hearthReturn  8 bars   the tune again, everyone in, violin over it
//   tag           4 bars   a little herald call, and round again

const BAR = 16;

// --- Chords: one a bar. ---
const SNOWFALL_CHORDS = 'F Bb F C';
const HEARTH_CHORDS = 'F Am Bb F Dm Gm C C';
const ANSWER_CHORDS = 'F Am Bb F Dm Bb C F';
const LANTERN_CHORDS = 'Bb C Am Dm Gm Am Bb C';
const HERALD_CHORDS = 'F Bb F C F Bb C F';
const HUSH_CHORDS = 'Dm Dm Am Am Bb Bb F C';
const TAG_CHORDS = 'Bb C F C';

// --- Patterns, as semitones above each chord's root, one entry a 16th. ---
const _ = '.';
// Snowflakes: the celesta falling down the chord.
const FALLING = [24, _, _, _, 19, _, _, _, 'tenth', _, _, _, 12, _, 7, _];
const FLAKES = [_, _, _, _, _, _, 24, _, _, _, _, _, _, _, 19, _];
const FLAKES_LATE = [_, _, _, _, _, _, _, _, _, _, 'tenth', _, _, _, 24, _];
// The harp rippling up and down in 8ths.
const RIPPLE = [0, _, 7, _, 12, _, 'tenth', _, 19, _, 'tenth', _, 12, _, 7, _];
const RIPPLE_SLOW = [0, _, _, _, 7, _, _, _, 12, _, _, _, 'tenth', _, _, _];
const ONE_DROP = [_, _, _, _, _, _, _, _, 19, _, _, _, _, _, _, _];
// Plucked basses: boots in the snow.
const PLUCK = [0, _, _, _, _, _, _, _, 7, _, _, _, _, _, _, _];
const PLUCK_WALK = [0, _, _, _, 7, _, _, _, 12, _, _, _, 7, _, _, _];
const PLUCK_ONE = [0, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _];
// Soft timpani on the one, for the heralds.
const DRUM_ONE = [0, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _];

// --- Sleigh bells and shaker. ---
const SLEIGH_SOFT = hits('....xx......xx..');
const SLEIGH = hits('..x.xx....x.xx..');
const SLEIGH_FULL = hits('..x.xx.x..x.xx.x');
const SLEIGH_CUE = hits('........x.x.xxxx');
const QUIET = hits('................');
const SHAKER = hits('x.x.x.x.x.x.x.x.');
const SHAKER_SOFT = hits('..x...x...x...x.');

// The jingles are pitched, so each 'x' becomes a little bell, never the same
// one twice running, so they shimmer.
const JINGLE_NOTES = [98, 103, 100, 105, 99, 102];
const jingle = (pattern) => {
  let i = 0;
  return pattern.map((step) => (step === 'x' ? JINGLE_NOTES[i++ % JINGLE_NOTES.length] : step));
};

// --- Tunes. Each token is an 8th note (two steps) unless it says otherwise. ---
// A herald's call, far off across the snow.
const CALL = melody(`
  . . . . . . . . | . . . . . . . . | . . . . C5 - F5 - | A5 - - - G5 - - - |
`, 2);

// The hearth: the village's tune, cosy, boots squeaking round the square.
const HEARTH = melody(`
  A5 - C6 - A5 G5 F5 - | E5 - G5 - E5 - C5 - | D5 F5 Bb5 - A5 - G5 - | A5 - - - F5 - . . |
  D5 F5 A5 - D6 - C6 - | Bb5 - A5 - G5 - D5 - | E5 G5 C6 - Bb5 - G5 - | C6 - - - - - . . |
`, 2);

// The answer: the same tune, coming home to F.
const ANSWER = melody(`
  A5 - C6 - A5 G5 F5 - | E5 - G5 - E5 - C5 - | D5 F5 Bb5 - A5 - G5 - | A5 - - - F5 - . . |
  D6 - C6 - A5 - F5 - | G5 - Bb5 - D6 - C6 - | Bb5 - A5 - G5 - E5 - | F5 - - - - - . . |
`, 2);
// The glockenspiel, replying in the answer's gaps.
const GLOCK_REPLY = melody(`
  . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . A6/G6 F6 |
  . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . F6 - D6 Bb5 |
`, 2);
// Over the return, the violin lies long notes under the tune.
const VIOLIN_UNDER = melody(`
  C5 - - - - - - - | C5 - - - E5 - - - | D5 - - - - - - - | C5 - - - A4 - - - |
  F5 - - - - - - - | D5 - - - F5 - - - | E5 - - - C5 - - - | A4 - - - C5 - F5 - |
`, 2);

// The lanterns: a warmer tune, lamps lit in every window.
const LANTERNS = melody(`
  D5 - - - F5 - Bb5 - | C6 - - - Bb5 - G5 - | A5 - - - E5 - C5 - | D5 - - - - - . . |
  Bb4 - D5 - G5 - Bb5 - | A5 - - - G5 - E5 - | F5 - - - D5 - Bb4 - | C5 - - - E5 - G5 - |
`, 2);
// The celesta answers the lantern tune where it breathes.
const LANTERN_REPLY = melody(`
  . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . A6 F6 D6 A5 |
  . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . |
`, 2);

// The heralds' fanfare: the prophecy's tune (prophecyTheme.js), written here
// in C as the village always had it, and played down in F on soft horns.
const FANFARE_C = melody(`
  . . G5 - - - C6 - | E6 - - - D6 - C6 - | B5 - - - - - . . | . . G5 - B5 - E6 - |
  D6 - - - C6 - G5 - | A5 - - - C6 - - - | B5 - - - - - D6 - | C6 - - - - - . . |
`, 2);
const FANFARE_LOW_C = melody(`
  . . E5 - - - G5 - | C6 - - - B5 - A5 - | G5 - - - - - . . | . . E5 - G5 - C6 - |
  B5 - - - A5 - E5 - | F5 - - - A5 - - - | G5 - - - - - B5 - | E5 - - - - - . . |
`, 2);
const FANFARE = transpose(FANFARE_C, -7);
const FANFARE_LOW = transpose(FANFARE_LOW_C, -7);

// The hush: the snow coming down hard. The hearth tune on the music box, at
// half speed (each token here is a quarter note).
const HUSH = melody(`
  A5 - C6 - | A5 G5 F5 - | E5 - G5 - | E5 - C5 - |
  D5 F5 Bb5 - | A5 - G5 - | A5 - - - | G5 - E5 - |
`, 4);

// The tag: a little bow, and the herald's call answered close by.
const TAG = melody(`
  D5 - F5 - Bb5 - A5 - | G5 - - - E5 - C5 - | F5 - - - - - - - | . . . . . . . . |
`, 2);
const TAG_CALL = melody(`
  . . . . . . . . | . . . . . . . . | . . . . C5 - F5 - | A5 - - - G5 - - - |
`, 2);

const pad = (chords) => ({
  strings: sustained(chords, BAR, 0, 3),
  stringsHigh: sustained(chords, BAR, 2, 4),
});
const blanket = (chords) => ({
  ...pad(chords),
  choir: sustained(chords, BAR, 1, 4),
  snow: sustained(chords, BAR, 0, 4),
});

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
  humanize: { time: 0.012, volume: 0.45 },
  pan: 0.3,
  reverb: 0.3,
};

// Falling snow: a soft, slow pad with a hiss of air through it.
const SNOW_PAD = {
  voices: [{ wave: 'sine', level: 1 }, { wave: 'triangle', octave: 1, detune: 6, level: 0.18 }],
  attack: 1.6, decay: 2, sustain: 0.85, release: 2, gate: 1,
  breath: { level: 0.3, frequency: 7000, q: 0.4 },
  pan: -0.1,
  reverb: 0.6,
};

export const REST_THEME = {
  title: 'Lamplight and Snowfall',
  bpm: 84,
  stepsPerBeat: 4,
  loopFrom: 1,

  instruments: {
    celesta: { ...CELESTA, volume: 0.075, pan: 0.1, echo: { time: 0.536, feedback: 0.25, mix: 0.25 } },
    flakes: { ...CELESTA, volume: 0.035, pan: -0.3, echo: { time: 0.714, feedback: 0.35, mix: 0.35 } },
    musicBox: { ...BELLS, volume: 0.075, echo: { time: 0.714, feedback: 0.45, mix: 0.4 } },
    musicBoxLow: { ...BELLS, volume: 0.022, pan: -0.3, echo: { time: 1.07, feedback: 0.4, mix: 0.35 } },
    glock: { ...BELLS, volume: 0.045, pan: 0.35, echo: { time: 0.536, feedback: 0.3, mix: 0.3 } },
    flute: { ...FLUTE, volume: 0.07, echo: { time: 0.714, feedback: 0.25, mix: 0.25 } },
    violin: { ...SOLO_VIOLIN, volume: 0.072 },
    horn: { ...HORN, volume: 0.07 },
    hornLow: { ...HORN, volume: 0.045, pan: -0.3 },
    // The herald's own trumpet, muted, for the call at the end.
    trumpet: { ...BRASS, volume: 0.022, pan: 0.2, filter: { type: 'lowpass', frequency: 2200 }, echo: { time: 0.714, feedback: 0.3, mix: 0.3 } },
    harp: { ...HARP, volume: 0.035 },
    cello: { ...CELLO, volume: 0.035 },
    strings: { ...STRING_SECTION, volume: 0.024, pan: -0.3 },
    stringsHigh: { ...STRING_SECTION, volume: 0.018, pan: 0.3 },
    choir: { ...CHOIR, volume: 0.022 },
    snow: { ...SNOW_PAD, volume: 0.03 },
    bass: { ...PIZZICATO_BASS, volume: 0.11 },
    timpani: { ...TIMPANI, volume: 0.05 },
    sleigh: { ...SLEIGH_BELLS, volume: 0.025 },
    shaker: { drum: 'hat', volume: 0.04 },
  },

  sections: {
    // Snowfall: flakes coming down past the lamps, a horn call far off.
    snowfall: {
      celesta: arpeggio(SNOWFALL_CHORDS, BAR, 4, FALLING),
      musicBox: chordLine(SNOWFALL_CHORDS, FLAKES_LATE, 5),
      horn: CALL,
      snow: sustained(SNOWFALL_CHORDS, BAR, 0, 4),
      strings: sustained(SNOWFALL_CHORDS, BAR, 0, 3),
      stringsHigh: sustained(SNOWFALL_CHORDS, BAR, 2, 4),
      harp: chordLine(SNOWFALL_CHORDS, ONE_DROP, 4),
      sleigh: jingle([...repeat(QUIET, 3), ...SLEIGH_CUE]),
    },
    // The hearth: the tune on the celesta, the village round it.
    hearth: {
      celesta: HEARTH,
      musicBox: chordLine(HEARTH_CHORDS, FLAKES, 5),
      harp: arpeggio(HEARTH_CHORDS, BAR, 3, RIPPLE),
      bass: chordLine(HEARTH_CHORDS, PLUCK, 2),
      ...pad(HEARTH_CHORDS),
      snow: sustained(HEARTH_CHORDS, BAR, 0, 4),
      sleigh: jingle(repeat(SLEIGH_SOFT, 8)),
      shaker: repeat(SHAKER_SOFT, 8),
    },
    // The answer: the flute takes the tune, the glockenspiel replies.
    hearthAnswer: {
      flute: ANSWER,
      flakes: transpose(ANSWER, 12),
      glock: GLOCK_REPLY,
      celesta: chordLine(ANSWER_CHORDS, FLAKES_LATE, 5),
      harp: arpeggio(ANSWER_CHORDS, BAR, 3, RIPPLE),
      bass: chordLine(ANSWER_CHORDS, PLUCK_WALK, 2),
      ...blanket(ANSWER_CHORDS),
      sleigh: jingle(repeat(SLEIGH, 8)),
      shaker: repeat(SHAKER, 8),
    },
    // The lanterns: the violin, warm, with the cello under it.
    lanterns: {
      violin: LANTERNS,
      celesta: LANTERN_REPLY,
      flakes: chordLine(LANTERN_CHORDS, FLAKES, 5),
      harp: arpeggio(LANTERN_CHORDS, BAR, 3, RIPPLE),
      cello: sustained(LANTERN_CHORDS, BAR, 0, 3),
      bass: chordLine(LANTERN_CHORDS, PLUCK_WALK, 2),
      ...blanket(LANTERN_CHORDS),
      sleigh: jingle(repeat(SLEIGH_SOFT, 8)),
      shaker: repeat(SHAKER_SOFT, 8),
    },
    // The heralds: the prophecy's tune on two soft horns, the bells doubling.
    heralds: {
      horn: FANFARE,
      hornLow: FANFARE_LOW,
      glock: transpose(FANFARE_C, 5),
      flakes: chordLine(HERALD_CHORDS, FLAKES_LATE, 5),
      harp: arpeggio(HERALD_CHORDS, BAR, 3, RIPPLE),
      bass: chordLine(HERALD_CHORDS, PLUCK_WALK, 2),
      timpani: chordLine(HERALD_CHORDS, DRUM_ONE, 2),
      ...blanket(HERALD_CHORDS),
      sleigh: jingle(repeat(SLEIGH_FULL, 8)),
      shaker: repeat(SHAKER, 8),
    },
    // The hush: the snow coming down hard, the music box alone and slow.
    hush: {
      musicBox: HUSH,
      musicBoxLow: transpose(HUSH, -12),
      harp: chordLine(HUSH_CHORDS, ONE_DROP, 4),
      cello: sustained(HUSH_CHORDS, BAR, 0, 3),
      bass: chordLine(HUSH_CHORDS, PLUCK_ONE, 2),
      choir: sustained(HUSH_CHORDS, BAR, 1, 4),
      snow: sustained(HUSH_CHORDS, BAR, 0, 4),
      stringsHigh: sustained(HUSH_CHORDS, BAR, 2, 4),
      sleigh: jingle([...repeat(QUIET, 7), ...SLEIGH_CUE]),
    },
    // The return: the tune with everyone in, the violin under it.
    hearthReturn: {
      flute: ANSWER,
      flakes: transpose(ANSWER, 12),
      violin: VIOLIN_UNDER,
      glock: GLOCK_REPLY,
      musicBox: chordLine(ANSWER_CHORDS, FLAKES, 5),
      harp: arpeggio(ANSWER_CHORDS, BAR, 3, RIPPLE),
      cello: sustained(ANSWER_CHORDS, BAR, 0, 3),
      bass: chordLine(ANSWER_CHORDS, PLUCK_WALK, 2),
      ...blanket(ANSWER_CHORDS),
      sleigh: jingle(repeat(SLEIGH_FULL, 8)),
      shaker: repeat(SHAKER, 8),
    },
    // The tag: a bow, and the herald's call, close by now.
    tag: {
      celesta: TAG,
      trumpet: TAG_CALL,
      flakes: arpeggio(TAG_CHORDS, BAR, 4, FALLING),
      harp: arpeggio(TAG_CHORDS, BAR, 3, RIPPLE_SLOW),
      bass: chordLine(TAG_CHORDS, PLUCK, 2),
      ...blanket(TAG_CHORDS),
      sleigh: jingle([...repeat(SLEIGH_SOFT, 3), ...SLEIGH_CUE]),
    },
  },

  order: ['snowfall', 'hearth', 'hearthAnswer', 'lanterns', 'heralds', 'hush', 'hearthReturn', 'tag'],
};
