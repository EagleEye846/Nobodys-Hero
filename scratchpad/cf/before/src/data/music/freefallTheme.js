import { melody, chordLine, sustained, arpeggio, transpose, hits, repeat } from '../../audio/notation.js';
import { BRASS, STACCATO_STRINGS, STRINGS, CHOIR, TIMPANI, BELLS, SOLO_VIOLIN, LOW_STRINGS } from '../../audio/instruments.js';

// "Reach": the run to the edge, the dive, and the fall after Ves
// (usurperFalls.js). Urgent from the first note: racing strings and
// timpani, and Ves's motif on the brass, crying out, a step higher each
// time; everything climbing as he reaches for her hand, the choir swelling
// to the top... and then nothing. One violin note left hanging, and a music
// box, very small, playing the start of her motif once, as she falls away.
// D minor to F, 168 BPM, one step is a 16th note. Timed to the scene: the
// run and dive (6 bars), the fall and the reach (6 bars), the miss (4 bars),
// then a low drone held under the trees until the scene stops it.

const BAR = 16;
const tune = (text) => melody(text, 2);
const rest = (bars) => Array(bars * BAR).fill('.');

const RUN_CHORDS = 'Dm Dm Bb Bb C C';
const REACH_CHORDS = 'Dm Bb F C Bb C';
const MISS_CHORDS = 'Dm Dm Dm Dm';
const DARK_CHORDS = 'Dm Dm';

// Her motif, crying out, climbing: as written, a step up, a step up again.
const RUN_BRASS = tune(`
  A4/A4 F5 - - G5 E5 F5 - | D5 - - - - - . . | C5/C5 A5 - - Bb5 G5 A5 - | F5 - - - - - . . |
  D5/D5 B5 - - C6 A5 B5 - | G5 - - - G5 - A5 - |
`);
// The reach: her heroic climb, up and up, and the highest note held as their fingers almost touch.
const REACH_TUNE = tune(`
  A5/A5 F6 - G6 - A6 - - | D6/D6 Bb6 - C7 - D7 - - | C6 - - - F6 - A6 - | C7 - - - - - - - |
  D7 - - - - - - - | E7 - - - - - - - |
`);
const MISS_BOX = tune(`
  . . . . . . . . | C6/C6 A6 - - . . . . | . . . . . . . . | . . . . . . . . |
`);

const RACE = [0, 7, 12, 7, 'third', 7, 12, 7, 0, 7, 12, 7, 'third', 12, 7, 'third'];
const TIMP = [0, '.', 0, '.', 0, '.', 0, 0, 0, '.', 0, '.', 0, 0, 0, 0];

const MUSIC_BOX = {
  voices: [{ harmonics: [1, 0, 0.32, 0, 0.14, 0, 0.05], level: 1 }, { wave: 'sine', octave: 2, detune: 8, level: 0.07 }],
  attack: 0.002, decay: 1.6, sustain: 0, release: 2, gate: 1, click: 0.02, reverb: 0.7,
  echo: { time: 0.535, feedback: 0.4, mix: 0.4 },
};

export const FREEFALL_THEME = {
  title: 'Reach',
  bpm: 168,
  stepsPerBeat: 4,

  instruments: {
    brass: { ...BRASS, volume: 0.06 },
    brassLow: { ...BRASS, volume: 0.04, filter: { type: 'lowpass', frequency: 1500 } },
    violin: { ...SOLO_VIOLIN, volume: 0.055, vibrato: { rate: 6, depth: 18, delay: 0.1 } },
    race: { ...STACCATO_STRINGS, volume: 0.04 },
    strings: { ...STRINGS, volume: 0.055 },
    lowStrings: { ...LOW_STRINGS, volume: 0.07 },
    choir: { ...CHOIR, volume: 0.045 },
    bells: { ...BELLS, volume: 0.05 },
    musicBox: { ...MUSIC_BOX, volume: 0.1 },
    timpani: { ...TIMPANI, volume: 0.16 },
    drone: { wave: 'sine', volume: 0.07, attack: 2, decay: 2, sustain: 0.9, release: 3, gate: 1 },
    boom: { drum: 'boom', volume: 0.24 },
    snare: { drum: 'snare', volume: 0.24 },
    crash: { drum: 'crash', volume: 0.1 },
  },

  sections: {
    // The run and the dive: frantic.
    run: {
      brass: RUN_BRASS,
      brassLow: transpose(RUN_BRASS, -12),
      race: chordLine(RUN_CHORDS, RACE, 4),
      lowStrings: chordLine(RUN_CHORDS, [0, '.', 0, 0, 0, '.', 0, 0, 0, '.', 0, 0, 7, '.', 7, 7], 2),
      strings: sustained(RUN_CHORDS, BAR, 1, 4),
      timpani: chordLine(RUN_CHORDS, TIMP, 2),
      snare: repeat(hits('x.x.x.x. x.xxx.xx'), 6),
      boom: repeat(hits('x...x... x...x...'), 6),
      crash: [...hits('x...............'), ...rest(5)],
    },
    // The fall and the reach: everything climbing, the choir to the top.
    reach: {
      violin: REACH_TUNE,
      bells: REACH_TUNE,
      brass: transpose(REACH_TUNE, -12),
      race: chordLine(REACH_CHORDS, RACE, 4),
      strings: sustained(REACH_CHORDS, BAR, 2, 5),
      choir: sustained(REACH_CHORDS, BAR, 0, 4),
      lowStrings: chordLine(REACH_CHORDS, [0, '-', '-', '-', 7, '-', '-', '-', 0, '-', '-', '-', 7, '-', '-', '-'], 2),
      timpani: [...chordLine('Dm Bb F C', TIMP, 2), ...chordLine('Bb C', [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 2)],
      snare: [...repeat(hits('x.x.x.x. x.x.x.x.'), 4), ...repeat(hits('xxxxxxxx xxxxxxxx'), 2)],
      crash: [...hits('x...............'), ...rest(3), ...hits('x...............'), ...rest(1)],
    },
    // The miss: it all cuts out. One violin note left hanging; her motif, once, tiny.
    miss: {
      violin: [...tune('F6 - - - - - - - | - - - - - - - - | - - - - - - - - | . . . . . . . .')],
      musicBox: MISS_BOX,
      drone: sustained(MISS_CHORDS, BAR, 0, 2),
    },
    // Under the trees: a low drone, until the scene stops it.
    dark: {
      drone: sustained(DARK_CHORDS, BAR, 0, 2),
    },
  },

  order: ['run', 'reach', 'miss', 'dark'],
  loopFrom: 3,
};
