import { melody, chordLine, sustained, transpose, midi } from '../../audio/notation.js';
import { patter, cellsFor } from './parts/chapter3.js';

// "The Scarlet Waltz": the Pinefall, Chapter 3's forest of red leaves, in the
// spirit of Deltarune's Scarlet Forest (mysterious, a little playful, never
// quite settled) and written the way Christopher Larkin wrote Hollow
// Knight's City of Tears and Greenpath: a harp turns three notes over and
// over, D A E, a stack of fifths, like leaves coming down, and hardly ever
// changes; the bass moves under it, so the same three notes are D minor 9,
// then G minor with the Dorian sixth, then B flat with a sharp eleventh.
// Only on the A chords does one note step aside (D to C#), and on the
// Neapolitan E flat. The harp's 8ths fall in threes, the waltz's bass in
// twos, so the leaves never land quite on the beat. The tune is the waltz in
// D minor on the violas; in the middle, Ves's
// motif ("Carried on the Wind", vesTheme.js) re-barred into the waltz on the
// piano, because the whole chapter is looking for her; then lost in the wood,
// a music box falling a semitone a bar over the leaves; and the waltz again
// outside, with strings, a horn and a choir swelling up over it. It plays
// once you've met the Keeper at the woodcutters' fire (keeperAtTheFire.js).
// 3/4 at 84 BPM, one step a 16th note, so a bar is 12 steps. The intro plays
// once (17s); then it loops from A, 56 bars, 2m00s:
//
//   intro  8 bars  the tune on a music box over the harp's leaves and a low D
//   A     16 bars  the waltz on the viola; the bass creeping chromatically
//                  under its second half
//   B     16 bars  F major: her motif on the piano, then the violins; the
//                  leaves on C G D now
//   C      8 bars  lost in the wood: the music box falls a semitone a bar
//                  over the leaves and a D that won't move
//   A2    16 bars  the waltz outside: violins, the viola an octave up, a horn
//                  answering, the choir far back

// One step is a 16th: a bar of 3/4 is 12 of them.
const BAR = 12;
const rest = (bars) => Array(bars * BAR).fill('.');
const tune = (text) => melody(text, 2); // each token an 8th: six to a bar

// --- The waltz's tune, D minor. Its second half reaches up chromatically
// and borrows the Neapolitan (Eb), the one strange chord. Exported so the
// chapter's fights can quote it (pinefallBattleTheme.js crams it into 4/4;
// the Beast's hunt plays it in 6/8). ---
const A_CHORDS = 'Dm Dm Gm Gm Bb A Dm A Dm Dm Gm Gm Eb A Dm Dm';
export const WALTZ = tune(`
  A4 - D5 - F5 - | E5 - - - D5 - | Bb4 - D5 - G5 - | F5 - - - E5 - |
  D5 - F5 - Bb5 - | A5 - G5 - F5 E5 | F5 - E5 - D5 - | C#5 - - - - - |
  A4 - D5 - F5 - | A5 - - - G#5 - | G5 - Bb5 - D6 - | C#6 - - - D6 - |
  Bb5 - G5 - Eb5 - | C#5 - E5 - G5 - | F5 - - - E5 - | D5 - - - - - |
`);
// A horn answering the tune, long notes, for the fuller A'.
const HORN_LINE = tune(`
  D4 - - - - - | C#4 - - - - - | D4 - - - - - | Bb3 - - - - - |
  F4 - - - - - | E4 - - - - - | A3 - - - - - | E4 - - - - - |
  F4 - - - - - | E4 - - - - - | D4 - - - - - | E4 - - - - - |
  G4 - - - - - | E4 - - - - - | A3 - - - - - | D4 - - - - - |
`);

// --- B: her motif in the waltz, F major. ---
const B_CHORDS = 'F Bb Gm C F Dm Bb A';
const HERS = tune(`
  C5/C5 A5 - - - - | Bb5 - G5 - A5 - | G5 - - - F5 - | E5 - - - - - |
  C5/C5 A5 - - - - | C6 - A5 - F5 - | D5 - E5 - F5 - | E5 - - - C#5 - |
`);

// --- C: lost in the wood. The music box falls a semitone a bar, D to A,
// over chords it doesn't belong to; then the A chord turns for home. ---
const C_CHORDS = 'Dm Dm Bb Bb Gm Gm A A';
const FALLING = tune(`
  D6 - - - - - | C#6 - - - - - | C6 - - - - - | B5 - - - - - |
  Bb5 - - - - - | A5 - - - - - | G#5 - - - - - | A5 - - - E5 - |
`);

// --- The leaves: the harp's three notes in 8ths, two threes to a bar. A
// stack of fifths on D; on an A chord the D steps down to C#, and on the
// Neapolitan E flat the cell turns to it. In F major (B) the stack moves to
// C G D. ---
const LEAVES = [0, '.', 1, '.', 2, '.', 0, '.', 1, '.', 2, '.'];
const D_CELLS = { A: 'C#4 A4 E5', Eb: 'D4 Bb4 Eb5' };
const F_CELLS = { A: 'C#4 A4 E5' };
const leaves = (chords) => patter(cellsFor(chords, D_CELLS, 'D4 A4 E5'), LEAVES);
const leavesInF = (chords) => patter(cellsFor(chords, F_CELLS, 'C4 G4 D5'), LEAVES);

// --- The bass. ---
// The root on the one, held: a waltz's "oom", without the "pah-pah".
const OOM = [0, ...Array(11).fill('-')];
const ONE = [0, ...Array(11).fill('.')];
// Under the waltz's second half the bass creeps chromatically, not by root.
const CREEP = 'D2 C#2 C2 B1 Bb1 A1 D2 A1';
const creep = () => CREEP.split(' ').flatMap((n) => [midi(n), ...Array(11).fill('.')]);

export const PINEFALL_THEME = {
  title: 'The Scarlet Waltz',
  bpm: 84,
  stepsPerBeat: 4,
  // An area theme: it sits under exploring, so quieter than a fight.
  volume: 0.7,

  instruments: {
    leaves: { sample: 'harp', volume: 0.26, ring: true, reverb: 0.55, pan: -0.25, humanize: { time: 0.012, volume: 0.22 } },
    // The piano catching the leaves an octave up, for the outside part.
    highLeaves: { sample: 'grandPiano', volume: 0.07, release: 0.9, reverb: 0.6, pan: 0.3, humanize: { time: 0.012, volume: 0.25 } },
    // The tune on the violas, slow bow, long tail.
    viola: { sample: 'violas', volume: 0.36, attack: 0.05, release: 0.6, reverb: 0.5, pan: 0.15, humanize: { time: 0.01, volume: 0.1 } },
    violins: { sample: 'violins', volume: 0.26, attack: 0.15, release: 0.7, reverb: 0.5, pan: 0.25 },
    cellos: { sample: 'cellos', volume: 0.3, attack: 0.2, release: 0.8, reverb: 0.45, pan: -0.2 },
    basses: { sample: 'bassSpic', volume: 0.3, release: 0.5, reverb: 0.4, humanize: { time: 0.008, volume: 0.12 } },
    low: { sample: 'cellos', volume: 0.2, attack: 0.5, release: 1, reverb: 0.45, pan: -0.1 },
    piano: { sample: 'grandPiano', volume: 0.2, ring: true, reverb: 0.5, pan: 0.1, humanize: { time: 0.01, volume: 0.15 } },
    hornsSoft: { sample: 'hornsSoft', volume: 0.26, attack: 0.25, release: 0.7, reverb: 0.55, pan: -0.1 },
// Where a choir would breathe: the viola section, bowed so softly it's mostly air.
    choir: { sample: 'violas', volume: 0.12, attack: 1.4, release: 1.8, reverb: 0.75, pan: -0.15 },
    // The strange part: a music box, with an echo.
    musicBox: { sample: 'glock', volume: 0.15, ring: true, reverb: 0.55, echo: { time: 0.45, feedback: 0.35, mix: 0.3 } },
    drone: { sample: 'cellos', volume: 0.26, attack: 0.8, release: 1.2, reverb: 0.45 },
    timpani: { sample: 'timpani', volume: 0.3, ring: true, reverb: 0.4 },
  },

  sections: {
    // The tune, alone on a music box, over the leaves and a low D that won't
    // move.
    intro: {
      musicBox: WALTZ.slice(0, 8 * BAR),
      leaves: [...rest(1), ...leaves('Dm Gm Gm Bb A Dm A')],
      drone: [midi('D2'), ...Array(8 * BAR - 1).fill('-')],
    },

    // The waltz on the viola over the leaves; under its second half the
    // bass creeps down by semitones instead of following the chords.
    A: {
      viola: WALTZ,
      leaves: leaves(A_CHORDS),
      basses: [...chordLine('Dm Dm Gm Gm Bb A Dm A', ONE, 1), ...creep()],
      low: chordLine(A_CHORDS, OOM, 3),
      cellos: [...rest(8), ...sustained('Dm Dm Gm Gm Eb A Dm Dm', BAR, 0, 3)],
    },

    // F major: her motif on the piano, then the violins take it; the leaves
    // move to C G D, the stack of fifths that sits on F.
    B: {
      piano: [...HERS, ...rest(8)],
      violins: [...rest(8), ...HERS],
      leaves: leavesInF(`${B_CHORDS} ${B_CHORDS}`),
      basses: chordLine(`${B_CHORDS} ${B_CHORDS}`, ONE, 1),
      low: chordLine(`${B_CHORDS} ${B_CHORDS}`, OOM, 3),
      hornsSoft: [...rest(8), ...sustained(B_CHORDS, BAR, 1, 3)],
    },

    // Lost in the wood: the music box falls a semitone a bar over the leaves
    // and a D that won't move; on the A chords the leaves step aside and a
    // soft timpani turns it for home.
    C: {
      musicBox: FALLING,
      leaves: leaves(C_CHORDS),
      violins: sustained(C_CHORDS, BAR, 2, 4),
      drone: [midi('D2'), ...Array(6 * BAR - 1).fill('-'), midi('A1'), ...Array(2 * BAR - 1).fill('-')],
      timpani: [...rest(6), midi('A2'), ...Array(BAR - 1).fill('.'), midi('A2'), '.', '.', '.', midi('A2'), '.', '.', '.', midi('A2'), '.', '.', '.'],
    },

    // Outside: the waltz on the violins with the viola an octave up, a horn
    // answering, the choir far back, the piano catching the leaves high.
    A2: {
      violins: WALTZ,
      viola: transpose(WALTZ, 12),
      hornsSoft: HORN_LINE,
      leaves: leaves(A_CHORDS),
      highLeaves: transpose(leaves(A_CHORDS), 12),
      basses: [...chordLine('Dm Dm Gm Gm Bb A Dm A', ONE, 1), ...creep()],
      low: chordLine(A_CHORDS, OOM, 3),
      cellos: sustained(A_CHORDS, BAR, 0, 3),
      choir: sustained(A_CHORDS, BAR, 1, 4),
    },
  },

  // The intro plays once; then the waltz goes round from A.
  order: ['intro', 'A', 'B', 'C', 'A2'],
  loopFrom: 1,
};
