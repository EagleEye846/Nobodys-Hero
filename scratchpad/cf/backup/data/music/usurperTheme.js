import { melody, chordLine, sustained, transpose, hits, repeat } from '../../audio/notation.js';
import { CHOIR, ORGAN, CELLO, HORN, STRING_SECTION, TIMPANI, BELLS, LOW_STRINGS } from '../../audio/instruments.js';

// "A Crown of Cold Iron": the Usurper's own theme, for when he turns round on
// the summit (summitArrival.js). Slow, regal and wrong. A bell tolls; an
// organ breathes; his motif (Ves's motif curdled: D D, up to Bb, A G# A; see
// usurperBattleTheme.js) on a cello under a low choir. Then the village's
// fanfare for its Hero (the Long Stair's tune) on muted horns, in minor, as
// if this were his coronation; and a music box, very close, playing his
// motif like a lullaby.
// D minor, 64 BPM, one step is an 8th note. Loops from `toll`.
//
//   toll      4 bars  a bell, an organ, the dark
//   claim     8 bars  his motif on the cello, the low choir under it
//   crown     8 bars  the stolen fanfare on muted horns, a slow march
//   lullaby   4 bars  a music box, close, playing his motif

const BAR = 8;
const tune = (text) => melody(text, 1);
const rest = (bars) => Array(bars * BAR).fill('.');

// His motif at this tempo: a token an 8th, so it takes two bars.
const MOTIF = 'D4 D4 Bb4 - - - A4 - G#4 - A4 - - - - -';

const TOLL_CHORDS = 'Dm Dm Bb A';
const CLAIM_CHORDS = 'Dm Dm Bb Bb Gm Gm A A';
const CROWN_CHORDS = 'Dm A Bb Dm Dm Gm Gm A';
const LULLABY_CHORDS = 'Dm Bb Gm A';

const CLAIM = tune(`
  ${MOTIF} |
  F4 - - - E4 - D4 - | A3 - - - - - - - |
  ${MOTIF.replace(/D4/g, 'D5').replace('Bb4', 'Bb5').replace(/A4/g, 'A5').replace('G#4', 'G#5')} |
  Bb4 - - - A4 - G4 - | E4 - - - - - - - |
`);
const CROWN = tune(`
  A3 - D4 - F4 - A4 - | G4 - - E4 C#4 - E4 - | F4 - - - D4 - Bb3 - | D4 - - - - - - - |
  A3 - D4 - F4 - A4 - | Bb4 - A4 - G4 - E4 - | G4 - F4 - E4 - D4 - | E4 - - - - - - - |
`);
const LULLABY = tune(`
  D6 D6 Bb6 - - - A6 - | G#6 - A6 - - - - - | D6 D6 Bb6 - - - A6 - | G#6 - A6 - - - - - |
`);
const BELL = [0, '-', '-', '-', '-', '-', '-', '-'];
const MARCH = [0, '.', '.', '.', 7, '.', '.', '.'];

const MUSIC_BOX = {
  voices: [{ harmonics: [1, 0, 0.32, 0, 0.14, 0, 0.05], level: 1 }, { wave: 'sine', octave: 2, detune: 8, level: 0.07 }],
  attack: 0.002, decay: 1.4, sustain: 0, release: 1.6, gate: 1,
  click: 0.025, reverb: 0.55,
};

export const USURPER_THEME = {
  title: 'A Crown of Cold Iron',
  bpm: 64,
  stepsPerBeat: 2,

  instruments: {
    organ: { ...ORGAN, volume: 0.045 },
    cello: { ...CELLO, volume: 0.07, vibrato: { rate: 4.4, depth: 16, delay: 0.4 } },
    horn: { ...HORN, volume: 0.05, filter: { type: 'lowpass', frequency: 1400 } },
    choir: { ...CHOIR, volume: 0.035 },
    strings: { ...STRING_SECTION, volume: 0.02, attack: 1.4 },
    lowStrings: { ...LOW_STRINGS, volume: 0.05 },
    bell: { ...BELLS, volume: 0.06, reverb: 0.7 },
    musicBox: { ...MUSIC_BOX, volume: 0.09 },
    timpani: { ...TIMPANI, volume: 0.12 },
    boom: { drum: 'boom', volume: 0.16 },
  },

  sections: {
    toll: {
      bell: chordLine(TOLL_CHORDS, BELL, 4),
      organ: sustained(TOLL_CHORDS, BAR, 0, 3),
      strings: sustained(TOLL_CHORDS, BAR, 2, 3),
      boom: repeat(hits('x.......'), 4),
    },
    claim: {
      cello: CLAIM,
      organ: sustained(CLAIM_CHORDS, BAR, 0, 3),
      choir: sustained(CLAIM_CHORDS, BAR, 1, 3),
      strings: sustained(CLAIM_CHORDS, BAR, 2, 4),
      bell: chordLine(CLAIM_CHORDS, [12, '-', '-', '-', '.', '.', '.', '.'], 4).map((s, i) => (Math.floor(i / BAR) % 2 ? '.' : s)),
      timpani: chordLine(CLAIM_CHORDS, [0, '.', '.', '.', '.', '.', '.', '.'], 2),
    },
    crown: {
      horn: CROWN,
      cello: transpose(CROWN, -12),
      choir: sustained(CROWN_CHORDS, BAR, 0, 4),
      lowStrings: chordLine(CROWN_CHORDS, MARCH, 2),
      timpani: chordLine(CROWN_CHORDS, MARCH, 2),
      boom: repeat(hits('x...x...'), 8),
    },
    lullaby: {
      musicBox: LULLABY,
      strings: sustained(LULLABY_CHORDS, BAR, 1, 4),
      organ: sustained(LULLABY_CHORDS, BAR, 0, 2),
    },
  },

  order: ['toll', 'claim', 'crown', 'lullaby'],
};
