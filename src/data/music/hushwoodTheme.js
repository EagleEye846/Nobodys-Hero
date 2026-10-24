import {
  BAR_128 as BAR, slow, eighths, rest as restBars, held, transpose, midi,
  onNotes, heldNotes, patter, cells, cellsFor, drops,
} from './parts/chapter3.js';

// "No Birdsong": the theme of the Hushwood, the old, dark, quiet wood below
// the Pinefall where the beast lives (notes/docs/chapter-3-hushwood.md). The
// woodcutters call the beast the Hush because the birds stop singing when
// it's near, and down here they've stopped for good. So this is the
// quietest of the chapter's area themes: the Scarlet Waltz's wood, older and
// holding its breath. An area theme, never a fight: anticipation, not
// danger (that's "Something in the Trees", hushStalkTheme.js).
//
// Written the way Christopher Larkin wrote Hollow Knight's City of Tears and
// Greenpath: a harp plays three notes, E B F#, a stack of fifths, and never
// changes. But where the Pinefall's leaves fall all bar long, here the wood
// takes three steps and stops to listen (three 8ths, then a dotted quarter
// of nothing), twice a bar. The bass moves under it, so the same three
// steps keep turning into new places: E minor with the ninth, C with the
// major seventh and the sharp eleventh (the Lydian colour), G with its
// seventh, D six-nine, A major (the Dorian lift, E minor's raised sixth),
// B with its fourth hanging. Only once a loop does a step change: on an F
// chord (the flat second, the Phrygian head-turn, something moved) the F#
// slips to F.
//
// The tune is long notes on those colours, low on the violas, inside; in the
// last part a solo violin takes it high and far, the "voice" stepping
// outside. Its first phrase leaps to the major seventh over C; its second
// climbs by step to the Dorian C# (the hope) and hangs on B's seventh.
//
// The one quote: Ves's motif ("Carried on the Wind", vesTheme.js: C C, up to
// A, Bb G A), slowed to three times its length and moved into E minor (B B,
// up to G, A F#), on a far music box: her chalk arrows on the trees. It
// stops on F#, the ninth, one note short of home, because she isn't there.
// The wood's own tune answers it, rising to C#.
//
// The intro plays once: a cuckoo calls twice, and the second call is cut off
// after one note. That's the last bird you hear.
//
// E minor (Aeolian with the Dorian C#, and one Phrygian F). 12/8 at 60
// dotted quarters a minute, one step an 8th: a bar is 12 steps and 4
// seconds. The intro plays once (16s); then it loops from A, 32 bars, 2m08s:
//
//   intro   4 bars  a low E, a cuckoo that stops mid-call; the three steps
//                   begin; a glass note
//   A       8 bars  inside: the tune low on the violas over the three steps
//                   and a walking bass
//   B       8 bars  chalk: her motif on a far music box, the wood's tune
//                   answering on the viola; then the solo violin, low
//   C       2 bars  the steps stop: a held breath, glass and a low E; a
//                   timpani roll swells out of nothing
//   D       6 bars  deeper: the tune's first cell climbs in sequence over a
//                   rising bass (C D E F), tremolo violins swelling, a horn;
//                   the voice comes out on top
//   A2      8 bars  outside: the tune high on the solo violin with the viola
//                   under it, a clarinet's inner line, strings and a breath
//                   of choir, the piano catching the steps; its last bar is
//                   the F, and the F goes home to E minor

const rest = (bars) => restBars(bars, BAR);

// --- The three steps: E B F#, rising; then the turn, E F# B. A dotted
// quarter of listening after each. ---
const STEP_CELL = 'E4 B4 F#5';
const STEPS = [0, 1, 2, '.', '.', '.', 0, 2, 1, '.', '.', '.'];
// Only on the flat-second F does the F# give way.
const CELL_TABLE = { F: 'E4 B4 F5' };
const steps = (chords) => patter(cellsFor(chords, CELL_TABLE, STEP_CELL), STEPS);

// --- The harmony: what the bass makes of the three steps, a bar each. ---
const A_CHORDS = 'Em C G D Em C A B';
const A_BASS = 'E2 C2 G1 D2 E2 C2 A1 B1';
const B_CHORDS = 'G Em C A G Em C B';
const B_BASS = 'G1 E2 C2 A1 G1 E2 C2 B1';
const D_CHORDS = 'C D Em F C B';
const D_BASS = 'C2 D2 E2 F2 C2 B1';
const A2_CHORDS = 'Em C G D Em C A F';
const A2_BASS = 'E2 C2 G1 D2 E2 C2 A1 F1';

// The bass: a plucked double bass on the one, and the cellos holding the
// note an octave up all bar.
const ONE = [0, ...Array(BAR - 1).fill('.')];
const LOW = [0, ...Array(BAR - 1).fill('-')];
const basses = (names) => onNotes(names, ONE);
const low = (names) => transpose(onNotes(names, LOW), 12);

// --- The tune (each token a dotted quarter: four to a bar). ---
// First phrase: up through the ninth, a leap to the major seventh of C, the
// ninth of G falling to its seventh, the ninth of D left open. Second: the
// same start, climbing by step to the Dorian C#, and B's seventh hanging.
const TUNE = slow(`
  B3 - E4 F#4 | B4 - - - | A4 - - F#4 | E4 - - . |
  B3 - E4 F#4 | G4 - A4 B4 | C#5 - - B4 | A4 - - . |
`);

// --- B: chalk. Her motif slowed and moved into E minor (each token an
// 8th): B, B, up the sixth to G and held; A, and F# held, one short of home.
const CHALK = eighths(`
  B5 - - B5 - - G6 - - - - - | A6 - - F#6 - - - - - - - - |
`);
// The wood's tune answering it, rising to the Dorian C#; the second time
// to B's seventh.
const ANSWER = slow('G4 - A4 B4 | C#5 - - B4');
const ANSWER_LAST = slow('G4 - A4 B4 | A4 - - .');
// The solo violin, the motif again, low, quiet, plain.
const CHALK_LOW = transpose(CHALK, -12);

// --- D: deeper. The tune's first cell (a long note, up a fourth, up a
// step) climbs in sequence, a step a bar, over a bass rising C D E F; then
// the voice comes out over C and B. ---
const DEEPER = slow(`
  E4 - A4 B4 | F#4 - B4 C#5 | G4 - C5 D5 | A4 - D5 E5 |
`);
const VOICE_OUT = slow('G5 - - F#5 | E5 - - -');

// --- A2's inner line: a clarinet, long notes under the voice, filling the
// tune's rests. ---
const INNER = slow(`
  G4 - - - | E4 - - - | D4 - - - | F#4 - - A4 |
  G4 - - - | E4 - - - | E4 - - - | C4 - - - |
`);

// --- The intro: a cuckoo, twice; the second call never finishes. ---
const CUCKOO = eighths(`
  . . . B5 G5 - - - . B5 G5 - | . . . B5 . . . . . . . . | . . . . . . . . . . . . | . . . . . . . . . . . . |
`);

export const HUSHWOOD_THEME = {
  title: 'No Birdsong',
  bpm: 60,
  stepsPerBeat: 3,
  // An area theme, and the hushed one: quieter than the Scarlet Waltz.
  volume: 0.62,

  instruments: {
    // The three steps: a harp, close and soft, left to ring.
    steps: { sample: 'harp', volume: 0.22, ring: true, reverb: 0.6, pan: -0.25, humanize: { time: 0.014, volume: 0.22 } },
    // The piano catching the steps an octave up, for outside.
    stepsHigh: { sample: 'grandPiano', volume: 0.055, ring: true, reverb: 0.7, pan: 0.3, humanize: { time: 0.014, volume: 0.25 } },
    // The tune, low on the violas: slow bow, long tail.
    viola: { sample: 'violas', volume: 0.32, attack: 0.15, release: 0.9, reverb: 0.55, pan: 0.1, humanize: { time: 0.015, volume: 0.1 } },
    // The voice: a solo violin high up, slow bow, mostly hall.
    voice: { sample: 'soloViolin', volume: 0.3, attack: 0.45, release: 1.3, reverb: 0.85, pan: 0.3, humanize: { time: 0.015, volume: 0.08 } },
    violins: { sample: 'violins', volume: 0.13, attack: 1, release: 1.4, reverb: 0.6, pan: 0.3 },
    // Tremolo violins swelling up out of the dark, for the deeper part.
    swell: { sample: 'violinsTrem', volume: 0.12, attack: 2.2, release: 1.6, reverb: 0.65, pan: -0.3 },
    // Where a choir would breathe: the viola section, bowed so softly it's mostly air.
    choir: { sample: 'violas', volume: 0.1, attack: 1.4, release: 1.8, reverb: 0.75, pan: -0.15 },
    cellos: { sample: 'cellos', volume: 0.17, attack: 0.8, release: 1.4, reverb: 0.5, pan: -0.1 },
    basses: { sample: 'bassSpic', volume: 0.24, release: 0.6, reverb: 0.45, humanize: { time: 0.01, volume: 0.15 } },
    clarinet: { sample: 'clarinet', volume: 0.065, attack: 0.3, release: 1, reverb: 0.6, pan: -0.3, humanize: { time: 0.015, volume: 0.1 } },
    horn: { sample: 'hornsSoft', volume: 0.32, attack: 0.6, release: 1.2, reverb: 0.6, pan: -0.15 },
    // Her chalk marks: a music box far off, with a long echo.
    musicBox: { sample: 'glock', volume: 0.3, ring: true, reverb: 0.7, pan: 0.35, echo: { time: 1, feedback: 0.4, mix: 0.4 } },
    // The last bird.
    cuckoo: { sample: 'ocarina', volume: 0.13, attack: 0.03, release: 0.5, reverb: 0.85, pan: 0.55 },
    // A held breath: a wine glass, singing.
    glass: { sample: 'glass', volume: 0.06, attack: 1.5, release: 2, reverb: 0.8, pan: 0.25 },
    drone: { sample: 'cellos', volume: 0.22, attack: 1.2, release: 1.8, reverb: 0.5, pan: -0.1 },
    // A twig, a leaf: now and then one high piano note, left to ring.
    drops: { sample: 'grandPiano', volume: 0.07, ring: true, reverb: 0.75, pan: 0.4, humanize: { time: 0.03, volume: 0.3 } },
    roll: { sample: 'timpaniRoll', volume: 0.14, attack: 2.6, release: 0.6, reverb: 0.5 },
  },

  sections: {
    // A low E. A cuckoo calls, and calls again, and stops halfway. The steps
    // begin; a glass note hangs over them.
    intro: {
      drone: heldNotes('E2 E2 E2 E2', BAR),
      cuckoo: CUCKOO,
      steps: [...rest(1), ...steps('Em Em Em')],
      glass: [...rest(2), ...held(midi('B5'), 2 * BAR)],
      drops: [...rest(2), ...drops('Em Em', BAR, 0.2, 3, 3)],
    },

    // Inside: the tune low on the violas; the bass makes the chords.
    A: {
      steps: steps(A_CHORDS),
      viola: TUNE,
      cellos: low(A_BASS),
      basses: basses(A_BASS),
      drops: drops(A_CHORDS, BAR, 0.07, 5, 3),
    },

    // Chalk: her motif on a far music box, the wood's tune answering on the
    // viola; then the solo violin plays the motif low, and the viola answers
    // again, hanging on B.
    B: {
      steps: steps(B_CHORDS),
      musicBox: [...CHALK, ...rest(6)],
      viola: [...rest(2), ...ANSWER, ...rest(2), ...ANSWER_LAST],
      voice: [...rest(4), ...CHALK_LOW, ...rest(2)],
      cellos: low(B_BASS),
      basses: basses(B_BASS),
      choir: [...rest(4), ...heldNotes('B3 G3 E3 F#3', BAR)],
    },

    // The steps stop. A held breath: a glass note and a low E, and a
    // timpani roll swelling up out of nothing into the deeper part.
    C: {
      drone: heldNotes('E2 E2', BAR),
      glass: held(midi('F#5'), 2 * BAR),
      roll: [...rest(1), ...held(midi('E2'), BAR)],
    },

    // Deeper: the tune's first cell climbs over a bass rising C D E F,
    // tremolo violins swelling under it, a horn on the roots; then the voice
    // comes out on top with the viola an octave under it.
    D: {
      steps: steps(D_CHORDS),
      viola: [...DEEPER, ...transpose(VOICE_OUT, -12)],
      voice: [...rest(4), ...VOICE_OUT],
      swell: heldNotes('E4 F#4 G4 A4 G4 F#4', BAR),
      choir: [...rest(2), ...heldNotes('B3 C4 E4 F#4', BAR)],
      horn: [...rest(3), ...heldNotes('F2 C3 B2', BAR)],
      cellos: low(D_BASS),
      basses: basses(D_BASS),
    },

    // Outside: the tune high on the solo violin, the viola under it, a
    // clarinet's inner line, the strings and a breath of choir, the piano
    // catching the steps; and the last bar is the F, the head-turn, which
    // goes home to E minor when it loops.
    A2: {
      steps: steps(A2_CHORDS),
      stepsHigh: transpose(steps(A2_CHORDS), 12),
      voice: transpose(TUNE, 12),
      viola: TUNE,
      clarinet: INNER,
      violins: heldNotes('B4 G4 D5 A4 B4 G4 E5 C5', BAR),
      choir: heldNotes('G3 E3 B3 F#3 G3 E3 C#4 A3', BAR),
      cellos: low(A2_BASS),
      basses: basses(A2_BASS),
      glass: [...rest(7), ...held(midi('E6'), BAR)],
    },
  },

  // The intro plays once; then the wood goes round from A.
  order: ['intro', 'A', 'B', 'C', 'D', 'A2'],
  loopFrom: 1,
};
