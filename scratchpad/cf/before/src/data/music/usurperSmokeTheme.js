import { sustained, arpeggio } from '../../audio/notation.js';
import {
  BPM, BAR, tune, rest, held, onNotes, heldBars, transpose, repeat, hits, HIS,
  POUND, DIG, RACE, TREMBLE, timp, timpRoot, T_POUND, T_ONE,
  HIT, KICK, KICK_FOUR, SNARE, FILL, TAIKO, TAIKO_HI, HALF_TAIKO, BUILD_8THS, BUILD_16THS, every, swellInto, ORCHESTRA,
} from './parts/usurper.js';

// "A Crown of Smoke": the Usurper's fight, phase one, while he's smoke and
// nothing you do can touch him (src/data/enemies/usurper.js). The first of
// three movements (then usurperLanternTheme.js, nobodysDawnTheme.js; their
// motifs are in parts/usurper.js). D minor, 150 BPM. The intro plays once;
// then it loops from A (48 bars, about 77 seconds):
//
//   intro   8 bars  a bell tolls his motif over the organ; a low brass
//                   BRAAAM, the choir, a roll and a swell into the fight
//   A      16 bars  the fight: his motif on horns and trombones over a bass
//                   that sinks a half step every bar, strings pounding, war
//                   drums; trumpets join it an octave up
//   B      16 bars  the village's fanfare, stolen into minor and blared on
//                   trumpets, his motif mocking it underneath
//   C       8 bars  dread: half time, his motif chanted round a cycle of
//                   minor thirds (G, Bb, C#, E), a gong, strings shuddering
//   D       8 bars  everything climbing on an A, back round into the fight

// --- The bass, sinking: D C# C B Bb A G# A. ---
const SINK = 'D2 C#2 C2 B1 Bb1 A1 G#1 A1 D2 C#2 C2 B1 Bb1 A1 G#1 A1';
const SINK_UP = 'D3 C#3 C3 B2 Bb2 A2 G#2 A2 D3 C#3 C3 B2 Bb2 A2 G#2 A2';
const SINK_ROOTS = 'D C# C B Bb A G# A D C# C B Bb A G# A';
const A_CHORDS = 'Dm A F G Bb Dm E A Dm A F G Bb Dm E A';

// --- The bell, tolling his motif slowly. ---
const TOLL = tune('D5 - - - D5 - - - | Bb5 - - - - - - - | A5 - - - G#5 - - - | A5 - - - - - - - |');

// --- A: his motif, and what it does next. ---
const A_LEAD = tune(`
  D4/D4 Bb4 - - A4 G#4 A4 - | F4 - - - D4 - - - |
  C#4/C#4 A4 - - G#4 G4 G#4 - | E4 - - - C#4 - - - |
  D4/D4 Bb4 - - A4 G#4 A4 - | D5 - C5 - Bb4 - A4 G#4 |
  A4 - - - E4 - - - | A4 - - - . . . . |
`);

// --- B: the Long Stair's fanfare, stolen into D minor. ---
const STOLEN = tune(`
  A4 - D5 - F5 - A5 - | G5 - - E5 C#5 - E5 - | F5 - - - D5 - Bb4 - | D5 - - - - - . . |
  A4 - D5 - F5 - A5 - | Bb5 - A5 - G5 - E5 - | G5 - F5 - E5 - D5 - | E5 - - - - - . . |
`);
const B_CHORDS = 'Dm A Dm Dm Dm Gm A A Dm A Dm Dm Dm Gm A A';
const B_ROOTS = 'D A D D D G A A D A D D D G A A';
const B_POUND = 'D3 A2 D3 D3 D3 G2 A2 A2 D3 A2 D3 D3 D3 G2 A2 A2';
const B_BASS = 'D2 A1 D2 D2 D2 G1 A1 A1 D2 A1 D2 D2 D2 G1 A1 A1';
// His motif, mocking it from underneath while it holds a note.
const MOCK = tune(HIS.replace(/5/g, '3'));
const MOCKING = [...rest(3), ...MOCK, ...rest(3), ...MOCK, ...rest(3), ...MOCK, ...rest(3), ...MOCK];

// --- C: his motif, twice as slow, round the minor thirds. ---
const DREAD = tune(`
  G4/G4 Eb5 - - D5 C#5 D5 - | . . . . . . . . | Bb4/Bb4 Gb5 - - F5 E5 F5 - | . . . . . . . . |
  C#5/C#5 A5 - - G#5 G5 G#5 - | . . . . . . . . | E5/E5 C6 - - B5 A#5 B5 - | . . . . . . . . |
`);
const DREAD_BASS = 'G2 G2 Bb2 Bb2 C#3 C#3 E3 E3';

// --- D: climbing, on an A. ---
const CLIMB = Array.from({ length: 2 * BAR }, (_, i) => Math.round(69 + (i * 16) / (2 * BAR - 1)));

export const USURPER_SMOKE_THEME = {
  title: 'A Crown of Smoke',
  bpm: BPM,
  stepsPerBeat: 4,
  // Level with his other music (and the rest of the game's battles).
  volume: 0.6,
  instruments: ORCHESTRA,

  sections: {
    intro: {
      organ: held('D3', 8 * BAR),
      toll: [...TOLL, ...transpose(TOLL, -12)],
      braam: [...held('D2', 2 * BAR), ...rest(2), ...held('D2', 2 * BAR), ...rest(2)],
      braamLow: [...held('D1', 2 * BAR), ...rest(2), ...held('D1', 2 * BAR), ...rest(2)],
      impact: [...HIT, ...rest(3), ...HIT, ...rest(3)],
      choir: [...rest(4), ...held('D4', 4 * BAR)],
      cellos: [...rest(2), ...held('D2', 6 * BAR)],
      timpRoll: [...rest(7), ...held(timpRoot('D'), BAR)],
      roll: [...rest(6), ...BUILD_8THS, ...BUILD_16THS],
      swell: swellInto(8),
    },

    A: {
      horns: [...A_LEAD, ...A_LEAD],
      trombones: [...transpose(A_LEAD, -12), ...transpose(A_LEAD, -12)],
      trumpets: [...rest(8), ...transpose(A_LEAD, 12)],
      race: arpeggio(A_CHORDS, BAR, 4, RACE),
      pound: onNotes(SINK_UP, POUND),
      basses: onNotes(SINK, DIG),
      choir: sustained(A_CHORDS, BAR, 1, 4),
      timpani: timp(SINK_ROOTS, T_POUND),
      bassDrum: repeat(hits('x....... x.......'), 16),
      taiko: repeat(TAIKO, 16),
      taikoHigh: [...repeat(TAIKO_HI, 7), ...FILL, ...repeat(TAIKO_HI, 7), ...FILL],
      snare: [...repeat(SNARE, 7), ...FILL, ...repeat(SNARE, 7), ...FILL],
      kick: repeat(KICK, 16),
      crash: every(16, 8),
      impact: every(16, 8),
      boom: every(16, 8),
    },

    B: {
      trumpets: [...STOLEN, ...STOLEN],
      horns: [...transpose(STOLEN, -12), ...transpose(STOLEN, -12)],
      violins: [...rest(8), ...STOLEN],
      trombones: MOCKING,
      race: arpeggio(B_CHORDS, BAR, 4, RACE),
      pound: onNotes(B_POUND, POUND),
      basses: onNotes(B_BASS, DIG),
      choir: sustained(B_CHORDS, BAR, 0, 4),
      chant: sustained(B_CHORDS, BAR, 2, 4),
      timpani: timp(B_ROOTS, T_POUND),
      bassDrum: repeat(hits('x....... x.......'), 16),
      taiko: repeat(TAIKO, 16),
      taikoHigh: [...repeat(TAIKO_HI, 7), ...FILL, ...repeat(TAIKO_HI, 7), ...FILL],
      snare: [...repeat(SNARE, 7), ...FILL, ...repeat(SNARE, 7), ...FILL],
      kick: repeat(KICK, 16),
      crash: every(16, 4),
      boom: every(16, 4),
    },

    C: {
      chant: DREAD,
      horns: transpose(DREAD, -12),
      organ: heldBars('G3 G3 Bb3 Bb3 C#4 C#4 E4 E4'),
      cellos: heldBars(DREAD_BASS),
      pound: onNotes(DREAD_BASS, TREMBLE),
      tuba: heldBars('G1 G1 Bb1 Bb1 C#2 C#2 E2 E2'),
      timpani: timp('G G Bb Bb C# C# E E', T_ONE),
      timpRoll: [...rest(7), ...held(timpRoot('E'), BAR)],
      taiko: repeat(HALF_TAIKO, 8),
      gong: every(8, 4),
      impact: every(8, 4),
    },

    D: {
      horns: heldBars('A3 A3 A3 A3 Bb3 B3 C4 C#4'),
      trombones: heldBars('A2 A2 A2 A2 Bb2 B2 C3 C#3'),
      choir: heldBars('A4 A4 A4 A4 Bb4 B4 C5 C#5'),
      race: [...arpeggio('A A A A A A', BAR, 4, RACE), ...CLIMB],
      pound: onNotes('A2 A2 A2 A2 A2 A2 A2 A2', POUND),
      basses: onNotes('A1 A1 A1 A1 A1 A1 A1 A1', DIG),
      timpani: [...timp('A A A A A A A', [0, '.', '.', '.', 0, '.', '.', '.', 0, '.', '.', '.', 0, '.', '.', '.']), ...rest(1)],
      timpRoll: [...rest(7), ...held(timpRoot('A'), BAR)],
      roll: [...rest(2), ...repeat(BUILD_8THS, 2), ...repeat(BUILD_16THS, 4)],
      taiko: [...repeat(HALF_TAIKO, 4), ...repeat(TAIKO, 4)],
      kick: [...rest(4), ...repeat(KICK_FOUR, 4)],
      swell: swellInto(8),
    },
  },

  order: ['intro', 'A', 'B', 'C', 'D'],
  loopFrom: 1,
};
