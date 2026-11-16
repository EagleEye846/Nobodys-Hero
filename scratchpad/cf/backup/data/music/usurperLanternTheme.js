import { sustained, arpeggio, chordLine } from '../../audio/notation.js';
import {
  BPM, BAR, tune, rest, held, onNotes, heldBars, transpose, repeat, hits, HIS, HERS_GRIEF,
  POUND, DIG, RACE, RIPPLE, HAMMER, QUARTER_PULSE, timp, timpRoot, T_POUND, T_HEART,
  KICK, KICK_FOUR, SNARE, FILL, RIM, TAIKO, HALF_TAIKO, BUILD_8THS, BUILD_16THS, every, swellInto, ORCHESTRA,
} from './parts/usurper.js';

// "Her Mother's Lantern": the Usurper's fight, phase two, while Ves kneels
// at her mother's lantern in the snow and coaxes it alight, and you keep its
// flame alive in the box (src/data/enemies/usurper.js). The second of three
// movements (after usurperSmokeTheme.js, before nobodysDawnTheme.js). The
// drums fall back to a heartbeat, and her motif comes in, grieving, on a
// solo violin; his keeps cutting in underneath. Then hers climbs a key every
// four bars as the flame grows. G minor, 150 BPM. Loops (48 bars, 77s):
//
//   A      16 bars  her motif on a violin over a rippling piano and a
//                   heartbeat; his motif cutting in on the trombones; the
//                   violins take hers up, and the drums start to come back
//   B      16 bars  climbing: her phrase in G minor, A minor, B minor, then
//                   lifting into D, everything building under it
//   C       8 bars  hush: a music box plays her motif, his crawls in on the
//                   organ, a heartbeat
//   D       8 bars  climbing on a D, back round to A

const A_CHORDS = 'Gm Gm Cm F Gm Eb D Gm Gm Gm Cm F Gm Eb D Gm';
const A_ROOTS = 'G G C F G Eb D G G G C F G Eb D G';

// Her motif, grieving.
const VIOLIN_A = tune(`
  ${HERS_GRIEF} | G5 - - - D5 - - - |
  Eb5/Eb5 C6 - - D6 Bb5 C6 - | A5 - - - F5 - - - |
  ${HERS_GRIEF} | G5 - Bb5 - Eb6 - D6 - |
  C6 - - - A5 - F#5 - | G5 - - - . . . . |
`);
// The solo violin, above the section, the second time round.
const DESCANT = tune(`
  Bb5 - - - - - - - | D6 - - - - - - - | C6 - - - - - - - | A5 - - - - - - - |
  Bb5 - - - - - - - | G5 - - - Bb5 - - - | A5 - - - F#5 - - - | G5 - - - - - . . |
`);
// His motif, cutting in on the trombones whenever she holds a note.
const HIS_LOW = tune(HIS.replace(/5/g, '3'));
const CUTTING_IN = [...rest(3), ...HIS_LOW, ...rest(3), ...HIS_LOW];

// --- B: her phrase, climbing a key every four bars. ---
const PHRASE = tune(`${HERS_GRIEF} | G5 - - - D5 - Bb5 - | C6 - Bb5 - A5 - F#5 - | G5 - - - - - . . |`);
const LIFT = tune('A5 - - - D6 - - - | C#6 - - - A5 - - - | B5 - - - G5 - E5 - | A5 - - - - - - - |');
const CLIMBING = [...PHRASE, ...transpose(PHRASE, 2), ...transpose(PHRASE, 4), ...LIFT];
const B_CHORDS = ['Gm Gm D Gm', 'Am Am E Am', 'Bm Bm F# Bm', 'D A G A'];
const B_ALL = B_CHORDS.join(' ');
const B_ROOTS = 'G G D G A A E A B B F# B D A G A';
const B_LATE = B_CHORDS.slice(1).join(' ');
const B_BACK = B_CHORDS.slice(2).join(' ');
const B_FRONT = B_CHORDS.slice(0, 2).join(' ');

// --- C: the hush. ---
const BOX = tune(`
  D6/D6 Bb6 - - C7 A6 Bb6 - | G6 - - - - - . . | . . . . . . . . | . . . . . . . . |
  D6/D6 Bb6 - - C7 A6 Bb6 - | D7 - - - C7 - Bb6 - | A6 - - - F#6 - - - | G6 - - - - - . . |
`);

// --- D: climbing on a D. ---
const CLIMB = Array.from({ length: 2 * BAR }, (_, i) => Math.round(74 + (i * 12) / (2 * BAR - 1)));
const QUARTERS = [0, '.', '.', '.', 0, '.', '.', '.', 0, '.', '.', '.', 0, '.', '.', '.'];

export const USURPER_LANTERN_THEME = {
  title: "Her Mother's Lantern",
  bpm: BPM,
  stepsPerBeat: 4,
  volume: 0.75,
  instruments: ORCHESTRA,

  sections: {
    A: {
      soloViolin: [...VIOLIN_A, ...DESCANT],
      violins: [...rest(8), ...transpose(VIOLIN_A, -12)],
      trombones: [...CUTTING_IN, ...CUTTING_IN],
      piano: arpeggio(A_CHORDS, BAR, 3, RIPPLE),
      pound: chordLine(A_CHORDS, QUARTER_PULSE, 2),
      basses: chordLine(A_CHORDS, [0, '.', '.', '.', '.', '.', '.', '.', 0, '.', '.', '.', '.', '.', '.', '.'], 1),
      choir: sustained(A_CHORDS, BAR, 1, 4),
      hornsSoft: [...rest(8), ...sustained(A_CHORDS.split(' ').slice(8).join(' '), BAR, 0, 3)],
      timpani: timp(A_ROOTS, T_HEART),
      rim: [...rest(8), ...repeat(RIM, 8)],
      taiko: [...repeat(hits('x....... ........'), 8), ...repeat(HALF_TAIKO, 8)],
      kick: [...rest(8), ...repeat(hits('x....... x.......'), 8)],
      crash: every(16, 8),
    },

    B: {
      violins: CLIMBING,
      soloViolin: CLIMBING,
      trumpets: [...rest(8), ...transpose(CLIMBING.slice(8 * BAR), -12)],
      trombones: [...rest(3), ...HIS_LOW, ...rest(3), ...transpose(HIS_LOW, 2), ...rest(3), ...transpose(HIS_LOW, 4), ...rest(4)],
      horns: [...rest(8), ...sustained(B_BACK, BAR, 0, 3)],
      race: [...rest(4), ...arpeggio(B_LATE, BAR, 4, RACE)],
      pound: [...chordLine(B_FRONT, QUARTER_PULSE, 2), ...chordLine(B_BACK, POUND, 2)],
      basses: [...rest(4), ...chordLine(B_LATE, DIG, 1)],
      piano: [...arpeggio(B_FRONT, BAR, 3, RIPPLE), ...chordLine(B_BACK, HAMMER, 3)],
      choir: sustained(B_ALL, BAR, 1, 4),
      timpani: [...timp(B_ROOTS.split(' ').slice(0, 8).join(' '), T_HEART), ...timp(B_ROOTS.split(' ').slice(8).join(' '), T_POUND)],
      taiko: [...repeat(HALF_TAIKO, 4), ...repeat(TAIKO, 12)],
      rim: [...rest(4), ...repeat(RIM, 4), ...rest(8)],
      snare: [...rest(8), ...repeat(SNARE, 7), ...FILL],
      kick: [...rest(4), ...repeat(KICK, 12)],
      crash: every(16, 4),
      boom: [...rest(8), ...every(8, 4)],
    },

    C: {
      musicBox: BOX,
      organ: [...rest(2), ...tune(`${HIS.replace(/5/g, '3')} | F3 - - - D3 - - - |`), ...rest(4)],
      choir: [...held('D4', 4 * BAR), ...held('Eb4', 2 * BAR), ...held('D4', 2 * BAR)],
      cellos: heldBars('G2 G2 G2 G2 Eb2 Eb2 D2 D2'),
      timpani: timp('G G G G G G G G', T_HEART),
      timpRoll: [...rest(7), ...held(timpRoot('D'), BAR)],
    },

    D: {
      horns: heldBars('D3 D3 D3 D3 Eb3 E3 F3 F#3'),
      trombones: heldBars('D2 D2 D2 D2 Eb2 E2 F2 F#2'),
      choir: heldBars('D4 D4 D4 D4 Eb4 E4 F4 F#4'),
      race: [...arpeggio('D D D D D D', BAR, 4, RACE), ...CLIMB],
      pound: onNotes('D3 D3 D3 D3 D3 D3 D3 D3', POUND),
      basses: onNotes('D2 D2 D2 D2 D2 D2 D2 D2', DIG),
      timpani: [...timp('D D D D D D D', QUARTERS), ...rest(1)],
      timpRoll: [...rest(7), ...held(timpRoot('D'), BAR)],
      roll: [...rest(2), ...repeat(BUILD_8THS, 2), ...repeat(BUILD_16THS, 4)],
      taiko: [...repeat(HALF_TAIKO, 4), ...repeat(TAIKO, 4)],
      kick: [...rest(4), ...repeat(KICK_FOUR, 4)],
      swell: swellInto(8),
    },
  },

  order: ['A', 'B', 'C', 'D'],
};
