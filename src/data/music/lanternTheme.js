import { melody, hits, repeat } from '../../audio/notation.js';
import { CHOIR, STRING_SECTION } from '../../audio/instruments.js';

// "The Lantern Swings": the dream in the lamplighter's hut (hutDream.js). A
// black void and a great lantern swinging on its chain, and the music is that
// swing: in the spirit of Toby Fox's "Flashback Excerpt", slow and wrong. A
// low drone a tritone apart; a creak at each end of the swing, left, then
// right, in time with the picture (visions.js); a heartbeat; and a music box
// that's been left somewhere damp, warped and out of tune, picking out a tune
// in D that keeps slipping a half step.
// 54 BPM in 4/4, one step is a 16th note. The first four bars play once, then
// it loops.
//
//   dark    4 bars   just the drone and the creaking
//   swing   8 bars   the music box comes in, the heart starts beating
//   deep    8 bars   lower, a choir breathing under it, the tune sinking a
//                    half step at a time

const BAR = 16;
const rest = (bars) => Array(bars * BAR).fill('.');
const held = (note, bars) => [note, ...Array(bars * BAR - 1).fill('-')];

// The creak, every two beats: one end of the swing, then the other, and the
// chain rattling faintly after it.
const creaks = (bars) => ({
  creakLeft: repeat([...melody('A5 . . . . . . .', 1), ...Array(8).fill('.')], bars),
  creakRight: repeat([...Array(8).fill('.'), ...melody('G#5 . . . . . . .', 1)], bars),
  rattle: repeat(hits('x.x..... x..x....'), bars),
});

const HEART = hits('x..x.... ........');

// The music box. Each token is an 8th note.
const SWING_BOX = melody(`
  D5 - - - F5 - Eb5 - | D5 - - - - - . . | A4 - - - C5 - Bb4 - | A4 - - - - - . . |
  D5 - - - F5 - Ab5 - | G5 - - - Eb5 - - - | D5 - C#5 - D5 - - - | . . . . . . . . |
`);
const DEEP_BOX = melody(`
  A5 - - - G#5 - - - | G5 - - - F#5 - - - | F5 - - - E5 - Eb5 - | D5 - - - - - . . |
  . . . . . . . . | Bb4 - - - A4 - - - | G4 - - - F4 - Eb4 - | D4 - - - - - . . |
`);

// The music box, left somewhere damp: a little tine, warbling and flat,
// with a long echo.
const WARPED_BOX = {
  voices: [
    { harmonics: [1, 0, 0.32, 0, 0.14, 0, 0.05], level: 1 },
    { harmonics: [1, 0, 0.3], detune: -22, level: 0.5 },
  ],
  attack: 0.002, decay: 1.3, sustain: 0, release: 1.4, gate: 1,
  vibrato: { rate: 2.2, depth: 28 },
  bend: { cents: -35, time: 0.5 },
  click: 0.03,
  pan: 0.15,
  reverb: 0.8,
  echo: { time: 0.833, feedback: 0.45, mix: 0.38 },
};

// A wooden creak: a squeak that sags as it goes.
const CREAK = {
  harmonics: [1, 0.6, 0.45, 0.3, 0.2, 0.1],
  attack: 0.04, decay: 0.45, sustain: 0, release: 0.3, gate: 1,
  bend: { cents: 140, time: 0.35 },
  filter: { type: 'bandpass', frequency: 1400 },
  reverb: 0.7,
};

// The drone: low, dark, and never quite still.
const DRONE = {
  voices: [{ wave: 'sawtooth', detune: -7 }, { wave: 'sawtooth', detune: 7 }, { wave: 'sine', octave: -1, level: 0.8 }],
  filter: { type: 'lowpass', frequency: 420 },
  attack: 3, decay: 2, sustain: 0.9, release: 3, gate: 1,
  vibrato: { rate: 0.3, depth: 12 },
  reverb: 0.6,
};

export const LANTERN_THEME = {
  title: 'The Lantern Swings',
  bpm: 54,
  stepsPerBeat: 4,
  loopFrom: 1,

  instruments: {
    box: { ...WARPED_BOX, volume: 0.07 },
    creakLeft: { ...CREAK, volume: 0.04, pan: -0.7 },
    creakRight: { ...CREAK, volume: 0.04, pan: 0.7 },
    rattle: { drum: 'hat', volume: 0.012 },
    heart: { drum: 'boom', volume: 0.28 },
    drone: { ...DRONE, volume: 0.05 },
    droneTritone: { ...DRONE, volume: 0.03 },
    choir: { ...CHOIR, volume: 0.022, filter: { type: 'lowpass', frequency: 900 } },
    choirLow: { ...CHOIR, volume: 0.02, filter: { type: 'lowpass', frequency: 700 } },
    strings: { ...STRING_SECTION, volume: 0.02, filter: { type: 'lowpass', frequency: 900 } },
  },

  sections: {
    // Just the dark: the drone, and the lantern creaking on its chain.
    dark: {
      drone: held(38, 4),
      ...creaks(4),
    },
    // The music box, and a heartbeat.
    swing: {
      box: SWING_BOX,
      drone: held(38, 8),
      droneTritone: [...rest(4), ...held(44, 4)],
      heart: repeat(HEART, 8),
      strings: [...held(62, 4), ...held(63, 4)],
      ...creaks(8),
    },
    // Deeper: a choir breathing a half step apart, the tune sinking.
    deep: {
      box: DEEP_BOX,
      drone: held(38, 8),
      droneTritone: held(44, 8),
      choir: [...held(62, 4), ...held(61, 4)],
      choirLow: held(63, 8),
      heart: repeat(HEART, 8),
      ...creaks(8),
    },
  },

  order: ['dark', 'swing', 'deep'],
};
