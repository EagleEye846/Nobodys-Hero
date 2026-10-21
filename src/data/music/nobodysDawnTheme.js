import { sustained, arpeggio, chordLine } from '../../audio/notation.js';
import {
  BPM, BAR, tune, rest, held, heldBars, transpose, repeat, hits, HERS_HERO,
  POUND, DIG, RACE, HAMMER, timp, timpRoot, T_POUND, T_ROLL,
  HIT, KICK, SNARE, FILL, TAIKO, TAIKO_HI, BUILD_8THS, BUILD_16THS, every, swellInto, ORCHESTRA,
} from './parts/usurper.js';

// KEPT FOR CHAPTER 3: this plays in chapter 3's boss fight, as its last
// phase's music, the moment Ves gets her umbrella back (see
// notes/docs/chapter-3-the-search.md). Written first as below:
//
// "Nobody's Dawn": the Usurper's fight, phase three. Her mother's lantern
// has caught, its light has made him solid, and Ves has taken up the stolen
// blade (src/data/enemies/usurper.js). The last of three movements (after
// usurperSmokeTheme.js and usurperLanternTheme.js): the light comes in with a
// gong and a BRAAAM, and her motif, heroic now, blazes over everything while
// his drowns underneath. Then the village's fanfare, the one he stole, is
// taken back. G major, 150 BPM. The light catching plays once; then it loops
// from A (48 bars, 77s):
//
//   intro   2 bars  the light catches: gong, BRAAAM, choir, a roll
//   A      16 bars  her heroic motif on trumpets and violins, the orchestra
//                   driving; his motif drowning in the tuba
//   B      16 bars  the Long Stair's fanfare taken back, in G major, on the
//                   horns, trumpets and violins above, the piano hammering
//   C       8 bars  up a step: her motif in A, everything at once
//   D       8 bars  E minor: his motif crawling back on the trombones, and
//                   everything climbing back round to A

// --- A: her motif, heroic. ---
const HERO = tune(`
  ${HERS_HERO} | D5 - - - G5 - A5 - |
  B4/B4 G5 - - A5 B5 - C6 | D6 - - - C6 - B5 - |
  C6 - - - B5 - A5 - | B5 - - - G5 - E5 - |
  C5 - - - D5 - E5 - | D5 - - - - - . . |
`);
const HERO_END = tune('C6 - B5 - A5 - F#5 - | G5 - - - - - . . |');
const HERO_TWICE = [...HERO, ...HERO.slice(0, 6 * BAR), ...HERO_END];
const A_CHORDS = 'G D Em G Am Em C D G D Em G Am Em D G';
const A_ROOTS = 'G D E G A E C D G D E G A E D G';
// His motif, drowning in the tuba under the second half.
const DROWNING = [...repeat([...tune('E2/E2 C3 - - B2 A#2 B2 -'), ...rest(1)], 4)];

// --- B: the fanfare, taken back. ---
const FANFARE = tune(`
  D4 - G4 - B4 - D5 - | C5 - - A4 F#4 - A4 - | B4 - - - G4 - E4 - | G4 - - - - - . . |
  D4 - G4 - B4 - D5 - | E5 - D5 - C5 - A4 - | C5 - B4 - A4 - G4 - | A4 - - - - - . . |
`);
const FANFARE_END = tune('C5 - B4 - A4 - F#4 - | G4 - - - - - . . |');
const FANFARE_TWICE = [...FANFARE, ...FANFARE.slice(0, 6 * BAR), ...FANFARE_END];
const B_CHORDS = 'G D Em G G C D D G D Em G G C D G';
const B_ROOTS = 'G D E G G C D D G D E G G C D G';

// --- C: up a step. ---
const C_CHORDS = 'A E F#m A Bm F#m D E';
const C_ROOTS = 'A E F# A B F# D E';

// --- D: E minor, his motif crawling back. ---
// His motif, from E.
const HIS_E = tune('E3/E3 C4 - - B3 A#3 B3 -');
const D_CHORDS = 'Em Em Em Em C C D D';
const CLIMB = Array.from({ length: 2 * BAR }, (_, i) => Math.round(74 + (i * 12) / (2 * BAR - 1)));

const kit = (bars, crashEvery) => ({
  bassDrum: repeat(hits('x....... x.......'), bars),
  taiko: repeat(TAIKO, bars),
  taikoHigh: [...repeat(TAIKO_HI, bars - 1), ...FILL],
  snare: [...repeat(SNARE, bars - 1), ...FILL],
  kick: repeat(KICK, bars),
  crash: every(bars, crashEvery),
});

export const NOBODYS_DAWN_THEME = {
  title: "Nobody's Dawn",
  bpm: BPM,
  stepsPerBeat: 4,
  // Level with his other music (and the rest of the game's battles).
  volume: 0.62,
  instruments: ORCHESTRA,

  sections: {
    intro: {
      gong: [...HIT, ...rest(1)],
      impact: [...HIT, ...rest(1)],
      crash: [...HIT, ...rest(1)],
      boom: [...HIT, ...rest(1)],
      braam: held('G2', 2 * BAR),
      braamLow: held('G1', 2 * BAR),
      horns: held('B3', 2 * BAR),
      choir: sustained('G', 2 * BAR, 1, 4),
      chant: sustained('G', 2 * BAR, 2, 4),
      cellos: held('G2', 2 * BAR),
      timpRoll: [...rest(1), ...held(timpRoot('D'), BAR)],
      roll: [...rest(1), ...BUILD_16THS],
    },

    A: {
      trumpets: HERO_TWICE,
      violins: HERO_TWICE,
      horns: transpose(HERO_TWICE, -12),
      trombones: transpose(HERO_TWICE, -24),
      tuba: [...sustained(A_CHORDS.split(' ').slice(0, 8).join(' '), BAR, 0, 1), ...DROWNING],
      race: arpeggio(A_CHORDS, BAR, 4, RACE),
      pound: chordLine(A_CHORDS, POUND, 2),
      basses: chordLine(A_CHORDS, DIG, 1),
      piano: [...rest(8), ...chordLine(A_CHORDS.split(' ').slice(8).join(' '), HAMMER, 3)],
      choir: sustained(A_CHORDS, BAR, 1, 4),
      chant: [...rest(8), ...sustained(A_CHORDS.split(' ').slice(8).join(' '), BAR, 2, 4)],
      timpani: timp(A_ROOTS, T_POUND),
      ...kit(16, 4),
      boom: every(16, 8),
      impact: every(16, 8),
    },

    B: {
      horns: FANFARE_TWICE,
      trumpets: transpose(FANFARE_TWICE, 12),
      violins: transpose(FANFARE_TWICE, 12),
      trombones: transpose(FANFARE_TWICE, -12),
      soloViolin: [...rest(8), ...transpose(FANFARE_TWICE.slice(8 * BAR), 12)],
      race: arpeggio(B_CHORDS, BAR, 4, RACE),
      pound: chordLine(B_CHORDS, POUND, 2),
      basses: chordLine(B_CHORDS, DIG, 1),
      tuba: sustained(B_CHORDS, BAR, 0, 1),
      piano: chordLine(B_CHORDS, HAMMER, 3),
      choir: sustained(B_CHORDS, BAR, 1, 4),
      chant: sustained(B_CHORDS, BAR, 2, 4),
      timpani: timp(B_ROOTS, T_POUND),
      ...kit(16, 4),
      gong: every(16, 8),
      boom: every(16, 4),
    },

    C: {
      trumpets: transpose(HERO, 2),
      violins: transpose(HERO, 2),
      soloViolin: transpose(HERO, 2),
      horns: transpose(HERO, -10),
      trombones: transpose(HERO, -22),
      braam: [...held('A2', 2 * BAR), ...rest(6)],
      tuba: sustained(C_CHORDS, BAR, 0, 1),
      race: arpeggio(C_CHORDS, BAR, 4, RACE),
      pound: chordLine(C_CHORDS, POUND, 2),
      basses: chordLine(C_CHORDS, DIG, 1),
      piano: chordLine(C_CHORDS, HAMMER, 3),
      choir: sustained(C_CHORDS, BAR, 1, 4),
      chant: sustained(C_CHORDS, BAR, 2, 4),
      timpani: timp(C_ROOTS, T_POUND),
      ...kit(8, 2),
      gong: every(8, 4),
      impact: every(8, 4),
      boom: every(8, 2),
    },

    D: {
      trombones: [...HIS_E, ...rest(1), ...HIS_E, ...rest(1), ...heldBars('B2 C3 C#3 D3')],
      horns: heldBars('B3 B3 B3 B3 C4 C#4 D4 D4'),
      choir: heldBars('E4 E4 E4 E4 E4 F#4 F#4 F#4'),
      race: [...arpeggio('Em Em Em Em C D', BAR, 4, RACE), ...CLIMB],
      pound: chordLine(D_CHORDS, POUND, 2),
      basses: chordLine(D_CHORDS, DIG, 1),
      timpani: [...timp('E E E E C C D', T_POUND), ...rest(1)],
      timpRoll: [...rest(7), ...held(timpRoot('D'), BAR)],
      roll: [...rest(2), ...repeat(BUILD_8THS, 2), ...repeat(BUILD_16THS, 4)],
      taiko: repeat(TAIKO, 8),
      kick: repeat(KICK, 8),
      swell: swellInto(8),
    },
  },

  order: ['intro', 'A', 'B', 'C', 'D'],
  loopFrom: 1,
};
