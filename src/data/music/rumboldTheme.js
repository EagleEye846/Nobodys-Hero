import { melody, transpose, hits, HOLD, REST } from '../../audio/notation.js';
import { SAMPLE_SETS } from '../../audio/sampleSets.js';
import { midi, timpRoot, ORCHESTRA } from './parts/usurper.js';
import { cellIn, FIRST_STEPS_MINOR } from './parts/chapter4.js';

// "The Resplendent Hour": the duel with King Peptup the Resplendent,
// Chapter 4's boss (scene `rumbolds_duel`). A huge carved wooden marionette king
// with a painted grin, a paper crown and a jaw on a hinge, who calls a royal
// duel as a SHOW: spotlights, trapdoors, prop swords, confetti that cuts,
// puppet strings. He is a ventriloquist's dummy. Behind the throne, on a
// little stool, Tuck the dormouse works the levers and does the voice, and
// has for forty-two years.
//
// So it's a showstopper, a big brassy vaudeville number, all swagger and
// sparkle, the kind of song a game-show host walks out to. Reference for the
// spirit only: Toby Fox's showman themes and an old circus march. Built on
// the chapter's cell (parts/chapter4.js: up a fourth, up a third, a step
// down) made grand, and on the king's own swagger from "Lamps Lit Early"
// (belowtownTheme.js), whose fanfare opens the show.
//
// THE HOOK, Bb major, sixteen bars, one token a 16th:
//
//   F . . Bb . . D - - - C - - - . . | A . . D . . F# - - - E - - - . . |
//   G - G - G . F# G - - D - Bb - G - | E - E - E . D# E - - C - Bb - G - |
//   Bb . . Eb . . G - - - F - - - . . | G . . Bb . . Db - - - Bb - G - E - |
//   F - - - Eb - - - C - - - A - C - | Bb - - - D - F - Bb - - - . . . .  |
//   (bars 1-2 again) | G G G . A Bb - - A - G - F - | Ab Ab Ab . G Ab - - F D Bb |
//   G - - - Bb - - - D - - - C - Bb - | Bb - - - Gb - - - Eb - - - Gb - F - |
//   D - F - A - C - - - Bb - A - - - | Bb (held, ta-da)
//
// Bar 1 is the cell, strutting in threes (da . . da . . DAAA, C): the Hero
// came, and... Bar 2 is the same cell a major third higher, in D major out
// of nowhere, a showman's "and ANOTHER thing!". Bars 3 and 4 are the boast,
// one note said three times like "RUM-BOLD the RE-SPLEN-dent", then a slide
// home. Under it a vaudeville run of chords that keep leaning on the next
// (Bb D7 Gm C7 Eb Edim F7 Bb), and in the second half one borrowed chord,
// E flat minor, where the grin slips for a bar.
//
// THE KING'S SOUND, all the way through:
//   THE JAW: a dry clack (claps, close and dry) with a high plucked "tock" on
//     top, clack-CLACK, a jaw on a hinge. It answers every phrase of the hook
//     in the gaps the tune leaves, like the dummy snapping its mouth shut.
//     When the show gets desperate it clacks on every beat; in Tuck's part
//     it stops.
//   THE CALLIOPE: three pipes (a recorder, an ocarina and a piccolo) puffing
//     the off-beat chords high over the oom-pah, tuned a little sharp the way
//     a fairground organ always is.
//   THE STRINGS: plucked violins jerking up in little runs at the ends of
//     phrases, the puppet strings, and the brass doing the rest.
// All recordings (VSCO 2 and VCSL, sampleSets.js).
//
// TUCK'S TUNE (exported as TUCK_TUNE for "Behind the Curtain"): the same
// four notes as the king's hook, minor and very small, with a stammer at the
// front of it (D, D-G Bb A). The king's tune and Tuck's tune were always the same
// tune; one of them was just shouting.
//
// Bb major; the comeback a half step up in B major (the cheapest, biggest
// key change in show business, which is the point); home in Bb. 144 BPM,
// one step a 16th, so a bar is 1.67 seconds. The intro plays once (6.7s);
// then it loops from A, 96 bars, 2m40s:
//
//   intro   4 bars  a drum roll on a frog's belly, the spotlight (a harp
//                   sweep), and the king's fanfare from "Lamps Lit Early" on
//                   the trumpets, clack-CLACK
//   A      16 bars  0:00 THE NUMBER: the hook on trumpets and clarinet over
//                   an oom-pah march and the calliope; (0:13) again with the
//                   violins and a piccolo on top, trombones singing under it
//   B      16 bars  0:27 THE SWAGGER: the king's strut from "Lamps Lit
//                   Early", low on trombones and sax in stop-time with the
//                   jaw filling the gaps; then (0:40) the whole band on it
//                   with a stride piano, the crowd shouting back "COME BACK!"
//   C      16 bars  0:53 THE STRINGS ACT: G minor, a puppet tango in 3-3-2,
//                   the cell gone sly on staccato oboe and plucked violins;
//                   then (1:07) on clarinet and flute with the trumpets
//                   stabbing the cell between lines. At the end the act
//                   falters: the band thins, the jaw clacks at the wrong time
//   P      16 bars  1:20 TUCK (the pivot, 50% in): a music box (harp and
//                   glockenspiel) plays Tuck's tune alone over plucked
//                   cellos on tiptoe; then (1:33) a clarinet sings it, his
//                   own little voice, a solo violin under, and it ends on a
//                   G MAJOR chord, held: the nobody behind the puppet.
//                   The music box's last little cell has a twin a hair
//                   flat: the first wrong note of the fight
//   R       8 bars  1:47 THE SHOW FORCES ITS WAY BACK: the cell on the brass
//                   climbing a half step a bar, the snare rolling, the jaw
//                   clacking faster; two bars on F#7; a dead beat
//   D      16 bars  2:00 BIGGER: the hook a half step up in B major on
//                   everything, the jaw on every beat, the calliope, the
//                   bells, the cymbals, and (from 2:07) the crowd singing
//                   along on the choir; it won't let the ta-da end (Ta-DA!
//                   Ta-DA! Ta-DAAA)
//   H       8 bars  2:27 HOME: Bb again, the vamp and the calliope as at the
//                   start, the cell called and clacked back; (2:33) the jaw
//                   catches, the music box stuck on F Bb D, F Bb D in threes
//                   with the clack stuck too, until he forces out the fourth
//                   note; and the fanfare to raise the curtain on A
//
// THE STUCK CELL ties the three songs of the fight together: here the king
// gets stuck on his first three notes once and forces his way past; in
// "Behind the Curtain" the music box sticks on them and runs down; in "No
// Strings" the living puppet sticks on them the way he sticks on words.

// --- Helpers. ---
const BAR = 16;
const r16 = (text) => melody(text, 1);                  // each token a 16th
const r8 = (text) => melody(text, 2);                   // each token an 8th
const rest = (bars) => Array(bars * BAR).fill(REST);
const times = (track, n) => Array(n).fill(track).flat();
const at = (bars, track) => [...rest(bars), ...track];
const barsOf = (track, from, to) => track.slice(from * BAR, to * BAR);
const held = (name, steps) => [typeof name === 'number' ? name : midi(name), ...Array(steps - 1).fill(HOLD)];
// The same bar of drum hits on the bars listed, nothing on the others.
const onBars = (bars, list, pattern) => Array.from({ length: bars }, (_, i) => (list.includes(i) ? pattern : rest(1))).flat();

// Pads every track of a section out to `bars` bars (and refuses one too long).
function section(bars, tracks) {
  return Object.fromEntries(Object.entries(tracks).map(([name, steps]) => {
    if (steps.length > bars * BAR) throw new Error(`The Resplendent Hour: '${name}' is ${steps.length} steps, longer than ${bars} bars`);
    return [name, [...steps, ...Array(bars * BAR - steps.length).fill(REST)]];
  }));
}
// The whole band stops dead for the last `steps` steps.
const stopdown = (tracks, steps = 4) => Object.fromEntries(Object.entries(tracks).map(([name, track]) => [name, [...track.slice(0, -steps), ...Array(steps).fill(REST)]]));

// --- Chords: 'Bb', 'Gm', 'D7', 'Edim', 'Cm7', a bar each ('Bb,F7' is two
// in a bar, half each). Patterns name chord tones: R root, T third, F fifth,
// S seventh (the octave on a plain triad), '+' an octave up, '-' one down. ---
const QUALITY = { '': [0, 4, 7, 12], m: [0, 3, 7, 12], 7: [0, 4, 7, 10], m7: [0, 3, 7, 10], dim: [0, 3, 6, 9] };
const NAMES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
function chordOf(symbol) {
  const m = symbol.match(/^([A-G][#b]?)(m7|m|7|dim)?$/);
  if (!m) throw new Error(`The Resplendent Hour: can't read the chord '${symbol}'`);
  return { root: midi(`${m[1]}4`) % 12, tones: QUALITY[m[2] ?? ''], quality: m[2] ?? '' };
}
const inBand = (pc, low) => low + ((pc - (low % 12) + 12) % 12);
function toneOf(chord, low, p) {
  const base = inBand(chord.root, low);
  const shift = p.endsWith('+') ? 12 : p.endsWith('-') ? -12 : 0;
  return base + chord.tones['RTFS'.indexOf(p[0])] + shift;
}
function comp(chords, pattern, low) {
  return chords.split(/\s+/).filter(Boolean).flatMap((bar) => {
    const parts = bar.split(',');
    const each = BAR / parts.length;
    return parts.flatMap((symbol, i) => {
      const chord = chordOf(symbol);
      const slice = pattern.slice(i * each, (i + 1) * each);
      // A chord that changes mid-bar starts its own note.
      if (i > 0 && slice[0] === HOLD) slice[0] = pattern[0];
      return slice.map((p) => (p === REST || p === HOLD ? p : toneOf(chord, low, p)));
    });
  });
}
// Chords moved up some semitones (sharps for the B major comeback).
const moveChords = (chords, by) => chords.replace(/([A-G][#b]?)(m7|m|7|dim)?/g, (_, root, q = '') => `${NAMES[(midi(`${root}4`) + by) % 12]}${q}`);
const H = HOLD;
const R = REST;
const holdBar = (p) => [p, ...Array(BAR - 1).fill(H)];

// --- THE HOOK. ---
const HOOK = r16(`
  F4 - - Bb4 - - D5 - - - C5 - - - . .       | A4 - - D5 - - F#5 - - - E5 - - - . .       |
  G5 - G5 - G5 . F#5 G5 - - D5 - Bb4 - G4 -   | E5 - E5 - E5 . D#5 E5 - - C5 - Bb4 - G4 -   |
  Bb4 - - Eb5 - - G5 - - - F5 - - - . .      | G5 - - Bb5 - - Db6 - - - Bb5 - G5 - E5 -    |
  F5 - - - Eb5 - - - C5 - - - A4 - C5 -      | Bb4 - - - D5 - F5 - Bb5 - - - . . . .       |
  F4 - - Bb4 - - D5 - - - C5 - - - . .       | A4 - - D5 - - F#5 - - - E5 - - - . .       |
  G5 - G5 - G5 . A5 Bb5 - - A5 - G5 - F5 -    | Ab5 - Ab5 - Ab5 . G5 Ab5 - - F5 - D5 - Bb4 - |
  G5 - - - Bb5 - - - D6 - - - C6 - Bb5 -      | Bb5 - - - Gb5 - - - Eb5 - - - Gb5 - F5 -    |
  D5 - F5 - A5 - C6 - - - Bb5 - A5 - - -      | Bb5 - - - - - - - - - - - . . . .          |
`);
const HOOK_CH = 'Bb D7 Gm C7 Eb Edim F7 Bb Bb D7 Gm Bb7 Eb Ebm F7 Bb';
// For "Behind the Curtain" (rumboldJammedTheme.js), which plays it falling apart.
export const RUMBOLD_HOOK = HOOK;
export const RUMBOLD_HOOK_CHORDS = HOOK_CH;
// The hook's cell checked against the chapter's: bar 1 is cellIn('Bb4').
{
  const notes = HOOK.slice(0, BAR).filter((s) => typeof s === 'number');
  if (notes.join() !== cellIn('Bb4').join()) throw new Error("The Resplendent Hour: the hook's first bar isn't the chapter's cell");
}
// The comeback, a half step up; bar 13 comes down a little (a trumpet has no
// D sharp up there), and the last bar won't let the ta-da end.
const HOOK_UP = [
  ...barsOf(transpose(HOOK, 1), 0, 12),
  ...r16('G#5 - - - B5 - - - C#6 - - - B5 - G#5 -'),
  ...barsOf(transpose(HOOK, 1), 13, 15),
  ...r16('B5 - . . B5 - . . B5 - - - - - - -'),
];
const UP_CH = moveChords(HOOK_CH, 1);

// The fanfare from "Lamps Lit Early", moved into Bb.
const FANFARE = r8('Bb4 - F5 - Bb5 - - - | D6 - - - . . . .');

// --- THE SWAGGER: the king's strut from "Lamps Lit Early", in Bb. ---
const SWAG = r8(`
  Bb4 - - Bb4 G5 - F5 Eb5 | F5 - - F5 C6 - Bb5 A5 | D5 - F5 A5 D6 - C6 A5 | Bb5 - G5 - D5 - . . |
  Bb4 - - Bb4 G5 - Bb5 - | C5 - F5 - A5 - C6 - | D6 - Bb5 - F5 - D5 - | F5 - - - . . . . |
`);
const SWAG_CH = 'Eb F Dm Gm Eb F Bb F';
// The crowd shouting back, "COME... BACK!", in the strut's gaps.
const CROWD_HI = r16('. . . . . . . . . . . . . . . . | '.repeat(3) + '. . . . . . . . . . . . G5 - Bb5 - | ' + '. . . . . . . . . . . . . . . . | '.repeat(3) + '. . . . . . . . C6 - - - A5 - - - |');
const CROWD_LO = r16('. . . . . . . . . . . . . . . . | '.repeat(3) + '. . . . . . . . . . . . G3 - D3 - | ' + '. . . . . . . . . . . . . . . . | '.repeat(3) + '. . . . . . . . F3 - - - F3 - - - |');
// Stop-time: the band only on one and the "and" of two.
const STOP = ['R', R, R, R, R, R, 'R', R, R, R, R, R, R, R, R, R];
const STOP_HI = ['T', R, R, R, R, R, 'F', R, R, R, R, R, R, R, R, R];

// --- THE STRINGS ACT: the cell gone sly, a tango in G minor. ---
const TANGO = r16(`
  D5 - - G5 - - Bb5 - A5 - - . . . . .        | C5 - - F#5 - - A5 - G5 - - . . . . .       |
  Bb4 - - D5 - - G5 - F#5 - G5 - A5 - Bb5 -    | C6 - - Bb5 - - G5 - Eb5 - - - . . . .      |
  Eb5 - - G5 - - C6 - Bb5 - - . . . . .        | D5 - - G5 - - Bb5 - A5 - G5 - F#5 - G5 -    |
  A5 - - F#5 - - D5 - C5 - - - A4 - - -        | G4 - - - - - . . D5 - G5 - . . . .         |
`);
const TANGO_CH = 'Gm D7 Gm Eb Cm Gm D7 Gm';
// The cell, minor, stabbed by the trumpets in the tune's gaps.
const [s0, s1, s2, s3] = cellIn('G5', FIRST_STEPS_MINOR).map((n) => n - 12);
const STAB_BAR = [R, R, R, R, R, R, R, R, R, R, R, s0, s1, s2, s3, R];
const TANGO_STABS = [...STAB_BAR, ...transpose(STAB_BAR, 2), ...rest(2), ...transpose(STAB_BAR, 5), ...rest(3)];
// Habanera bass: 3-3-2.
const HABANERA = ['R', R, R, 'F-', R, R, 'R', R, 'R', R, R, 'F-', R, R, 'R', R];
// The puppet strings: a jerk up the chord in the last four 16ths.
const JERK = [R, R, R, R, R, R, R, R, R, R, R, R, 'R', 'T', 'F', 'R+'];

// --- TUCK'S TUNE, G minor, one token an 8th. The cell with a stammer. ---
export const TUCK_TUNE = `
  D5 . D5 G5 - Bb5 A5 - | - - G5 F5 Eb5 - . . | G4 . G4 C5 - Eb5 D5 - | - - C5 Bb4 A4 - . . |
  D5 . D5 G5 - Bb5 A5 - | - - Bb5 C6 D6 - . . | C6 - Bb5 - A5 - F#5 - | G5 - - - - - . . |
`;
export const TUCK_CHORDS = 'Gm Eb Cm D Gm Eb Cm,D G';
const TUCK = r8(TUCK_TUNE);
// The music box answering him with the cell, small.
const BOX_CELL = r8('. . . . . . . . | . . . . D6 G6 Bb6 A6 | . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . G6 C7 Eb7 D7 | . . . . . . . . | . . . . . . . .');
const TIPTOE = ['R', R, R, R, 'F', R, R, R, 'R', R, R, R, 'F', R, R, R];

// --- THE SHOW FORCES ITS WAY BACK: the cell up a half step a bar. ---
const CELL_BAR = r16('F4 - - Bb4 - - D5 - - - C5 - - - . .');
const CLIMB = [
  ...[0, 1, 2, 3, 4, 5].flatMap((s) => transpose(CELL_BAR, s)),
  ...r16('F#4 . . F#4 . . F#4 . F#4 . F#4 . F#4 F#4 F#4 F#4'),
  ...r16('A#4 - - C#5 - - E5 - - - - - . . . .'),
];
const CLIMB_CH = 'Bb B C Db D Eb F#7 F#7';
// The cymbal swell is loudest 3.18s in (sampleSets.js): 31 steps at 144 BPM.
const SWELL_STEPS = 31;
const swellInto = (bars) => [...Array(bars * BAR - SWELL_STEPS).fill(R), ...held(60, SWELL_STEPS)];

// --- HOME: the cell called and clacked back, the turnaround, the fanfare. ---
const HOME_CH = 'Bb D7 Eb Edim Cm7,F7 Bb Bb F7';
const HOME_CALL = [...barsOf(HOOK, 0, 1), ...rest(1), ...barsOf(HOOK, 4, 5), ...rest(1)];
const HOME_ANSWER = [...rest(1), ...barsOf(HOOK, 1, 2), ...rest(1), ...barsOf(HOOK, 5, 6)];
// The jaw catches: the music box sticks on the cell's first three notes, in
// threes against the march (F Bb D, F Bb D...), the clack stuck with it,
// until the king forces out the fourth note and the fanfare. (Here he still
// can. In "Behind the Curtain" and "No Strings" he never gets there.)
const JAW_STUCK = r8('F5 Bb5 D6 F5 Bb5 D6 F5 Bb5 | D6 F5 Bb5 D6 F5 Bb5 D6 C6');
const CLACK_STUCK = hits('x..x..x. .x..x..x');

// --- Drums, one bar. ---
const BD = hits('x....... x.......');
const BD_FOUR = hits('x...x... x...x...');
const SN_MARCH = hits('....x... ....x..x');
const SN_SHOW = hits('....x..x ....x.xx');
const SN_8THS = hits('x.x.x.x. x.x.x.x.');
const SN_16THS = hits('xxxxxxxx xxxxxxxx');
const SN_TANGO = hits('x..x..x. x..x..x.');
const ONE = hits('x....... ........');
const TADA = hits('........ x.......');
// The jaw: clack-CLACK in the hook's gaps (its last two 16ths).
const CLACK_GAP = hits('........ ......xx');
const CLACK_TADA = hits('........ ....x.x.');
const CLACK_TWO = hits('........ x.......');
const CLACK_BEATS = hits('x...x... x...x...');
const CLACK_8THS = hits('x.x.x.x. x.x.x.x.');
const CLACK_16THS = hits('xxxxxxxx xxxxxxxx');
const CLACK_332 = hits('......x. ......x.');
// The jaw's tock (high, then lower: open, shut), on the same hits.
function tocks(clacks) {
  let k = 0;
  return clacks.map((c) => (c === 'x' ? (k++ % 2 ? midi('F5') : midi('Bb5')) : R));
}
// The hook's jaw: after bars 1, 2, 5, 9, 10 and 13; ta-da on 8 and 16.
const HOOK_CLACKS = Array.from({ length: 16 }, (_, b) => ([0, 1, 4, 8, 9, 12].includes(b) ? CLACK_GAP : b === 7 || b === 15 ? CLACK_TADA : rest(1))).flat();
// Timpani on each chord's root.
const T_MARCH = [0, R, R, R, R, R, R, R, -5, R, R, R, R, R, R, R];
const T_DRIVE = [0, R, R, 0, R, R, 0, R, 0, R, R, R, 0, R, 0, R];
// (a fifth below that would fall off the bottom drum goes a fourth up instead)
const timps = (chords, pattern) => chords.split(/\s+/).filter(Boolean).flatMap((bar) => {
  const root = timpRoot(NAMES[chordOf(bar.split(',')[0]).root]);
  return pattern.map((p) => (typeof p === 'number' ? root + (root + p < 41 ? p + 12 : p) : p));
});

// The band, a bar per chord.
const oom = (chords) => comp(chords, ['R', H, R, R, R, R, R, R, 'F-', H, R, R, R, R, R, R], 41);
const pah = (chords, tone, low) => comp(chords, [R, R, R, R, tone, H, R, R, R, R, R, R, tone, H, R, R], low);
const pah8 = (chords, tone, low) => comp(chords, [R, R, tone, R, tone, R, R, R, R, R, tone, R, tone, R, R, R], low);
const longTones = (chords, tone, low) => comp(chords, holdBar(tone), low);

const O = ORCHESTRA;
const SHARP = 18 / 1200;      // the calliope, a little sharp

const song = {
  title: 'The Resplendent Hour',
  bpm: 144,
  stepsPerBeat: 4,
  volume: 1.15,

  instruments: {
    // The jaw: a dry clack, and a high plucked tock on top of it.
    clack: { sample: 'claps', drum: 'sample', volume: 0.42, ring: true, reverb: 0.08, pan: 0.05, humanize: { time: 0.002, volume: 0.1 } },
    tock: { sample: 'violinsPizz', volume: 0.32, release: 0.03, gate: 0.4, reverb: 0.1, pan: 0.05 },
    // The calliope: three pipes, a touch sharp.
    pipeLow: { sample: 'recorder', octave: SHARP, volume: 0.16, attack: 0.01, release: 0.08, reverb: 0.25, pan: 0.3 },
    pipeMid: { sample: 'ocarina', octave: SHARP, volume: 0.13, attack: 0.01, release: 0.08, reverb: 0.25, pan: 0.35 },
    pipeHigh: { sample: 'piccolo', octave: SHARP, volume: 0.08, attack: 0.01, release: 0.08, reverb: 0.25, pan: 0.4 },
    // The puppet strings, and the music box.
    strings: { sample: 'violinsPizz', volume: 0.3, ring: true, reverb: 0.3, pan: 0.3, humanize: { time: 0.004, volume: 0.15 } },
    harp: { sample: 'harp', volume: 0.3, ring: true, reverb: 0.45, pan: -0.25, humanize: { time: 0.008, volume: 0.12 } },
    boxHarp: { sample: 'harp', volume: 0.26, ring: true, reverb: 0.5, pan: 0.1, echo: { time: 0.42, feedback: 0.25, mix: 0.2 } },
    glock: { sample: 'glock', volume: 0.1, ring: true, reverb: 0.5, pan: 0.2, echo: { time: 0.42, feedback: 0.25, mix: 0.25 } },
    // The first wrong note: a second music box, a little flat (see P).
    glockSour: { sample: 'glock', octave: -40 / 1200, volume: 0.07, ring: true, reverb: 0.55, pan: -0.2, echo: { time: 0.42, feedback: 0.3, mix: 0.3 } },
    // The crowd singing along in the comeback (our own "ah" choir).
    choirLow: { sample: 'choir', volume: 0.16, attack: 0.35, release: 0.9, muffle: 3000, reverb: 0.55, pan: -0.2 },
    choirHigh: { sample: 'choir', volume: 0.14, attack: 0.35, release: 0.9, muffle: 3200, reverb: 0.55, pan: 0.2 },
    // Brass: the king.
    trumpets: { ...O.trumpets, volume: 0.4 },
    horns: { ...O.horns, volume: 0.36 },
    trombones: { ...O.trombones, volume: 0.36 },
    tuba: { sample: 'tuba', volume: 0.42, attack: 0.01, release: 0.15, reverb: 0.22, humanize: { time: 0.005, volume: 0.1 } },
    sax: { sample: 'sax', volume: 0.3, attack: 0.02, release: 0.2, reverb: 0.3, pan: -0.25, humanize: { time: 0.008, volume: 0.1 } },
    // Winds.
    clarinet: { sample: 'clarinet', volume: 0.34, attack: 0.02, release: 0.2, reverb: 0.32, pan: -0.15 },
    oboe: { sample: 'oboe', volume: 0.34, attack: 0.02, release: 0.2, reverb: 0.32, pan: 0.15 },
    oboeShort: { sample: 'oboe', volume: 0.34, attack: 0.01, release: 0.06, gate: 0.55, reverb: 0.3, pan: 0.15 },
    flute: { sample: 'flute', volume: 0.3, attack: 0.02, release: 0.2, reverb: 0.38, pan: 0.25 },
    piccolo: { sample: 'piccolo', volume: 0.12, attack: 0.01, release: 0.15, reverb: 0.4, pan: 0.3 },
    tuck: { sample: 'clarinet', volume: 0.3, attack: 0.06, release: 0.45, reverb: 0.5, pan: -0.05, humanize: { time: 0.012, volume: 0.1 } },
    // Strings.
    violins: { ...O.violins, volume: 0.32 },
    violinsHigh: { ...O.violinsHigh, volume: 0.24 },
    soloViolin: { sample: 'soloViolin', volume: 0.32, attack: 0.08, release: 0.5, reverb: 0.5, pan: 0.15, humanize: { time: 0.012, volume: 0.1 } },
    violas: { sample: 'violas', volume: 0.2, attack: 0.3, release: 0.7, reverb: 0.45, pan: -0.1 },
    violinsTrem: { sample: 'violinsTrem', volume: 0.22, attack: 0.1, release: 0.4, reverb: 0.4, pan: 0.25 },
    cellos: { sample: 'cellos', volume: 0.3, attack: 0.05, release: 0.4, reverb: 0.35, pan: -0.25 },
    tiptoe: { sample: 'cellosPizz', volume: 0.3, ring: true, reverb: 0.4, pan: -0.15, humanize: { time: 0.008, volume: 0.15 } },
    basses: { ...O.basses, volume: 0.4 },
    // The stride piano.
    piano: { sample: 'grandPiano', volume: 0.3, release: 0.15, reverb: 0.3, pan: -0.2, humanize: { time: 0.006, volume: 0.12 } },
    pianoHi: { sample: 'grandPiano', volume: 0.2, release: 0.12, reverb: 0.3, pan: -0.15, humanize: { time: 0.006, volume: 0.12 } },
    pianoTop: { sample: 'grandPiano', volume: 0.18, release: 0.12, reverb: 0.3, pan: -0.1, humanize: { time: 0.006, volume: 0.12 } },
    // Percussion.
    snare: { ...O.snare, volume: 0.3 },
    roll: { ...O.roll, volume: 0.16 },
    rim: { ...O.rim, volume: 0.22 },
    bassDrum: { ...O.bassDrum, volume: 0.5 },
    crash: { ...O.crash, volume: 0.32 },
    timpani: { ...O.timpani, volume: 0.45 },
    timpRoll: { ...O.timpRoll, volume: 0.4 },
    swell: { ...O.swell, volume: 0.35 },
  },

  sections: {
    // A drum roll on a frog's belly, the spotlight sweeping in on the harp,
    // and the king's fanfare: clack-CLACK.
    intro: section(4, {
      roll: [...times(SN_16THS, 2), ...rest(2)],
      timpRoll: [...held('F2', 2 * BAR)],
      swell: [...Array(2 * BAR - SWELL_STEPS).fill(R), ...held(60, SWELL_STEPS)],
      harp: at(1, [...rest(0.5), ...r16('Bb3 D4 F4 Bb4 D5 F5 Bb5 D6')]),
      trumpets: at(2, FANFARE),
      horns: at(2, r8('Bb2 - F3 - Bb3 - - - | F3 - - - . . . .')),
      trombones: at(2, r8('Bb2 - F3 - D3 - - - | Bb2 - - - . . . .')),
      tuba: at(2, [...r8('Bb1 - - - - - - - | Bb1 - - - . . . .')]),
      crash: at(2, ONE),
      bassDrum: at(2, [...ONE, ...ONE]),
      timpani: at(2, r16('Bb2 . . . . . . . F2 . . . . . . . | Bb2 . . . . . . . . . . . . . . .')),
      clack: at(3, CLACK_TADA),
      tock: at(3, tocks(CLACK_TADA)),
      strings: at(3, comp('F7', JERK, 65)),
    }),

    // THE NUMBER. The hook on trumpets and clarinet over the oom-pah and the
    // calliope; then the violins and piccolo on top, trombones under.
    A: section(16, {
      trumpets: HOOK,
      clarinet: barsOf(HOOK, 0, 8),
      oboe: at(8, barsOf(HOOK, 8, 16)),
      violins: at(8, barsOf(HOOK, 8, 16)),
      piccolo: at(8, transpose(barsOf(HOOK, 8, 16), 12)),
      trombones: at(8, longTones(HOOK_CH.split(' ').slice(8).join(' '), 'T', 50)),
      violas: longTones(HOOK_CH.split(' ').slice(0, 8).join(' '), 'T', 55),
      tuba: oom(HOOK_CH),
      basses: oom(HOOK_CH),
      horns: pah(HOOK_CH, 'T', 48),
      pipeLow: pah(HOOK_CH, 'T', 69),
      pipeMid: pah(HOOK_CH, 'F', 65),
      pipeHigh: pah(HOOK_CH, 'R+', 72),
      strings: Array.from({ length: 16 }, (_, b) => ([3, 11].includes(b) ? comp(HOOK_CH.split(' ')[b], JERK, 65) : rest(1))).flat(),
      harp: at(7, comp('Bb', [R, R, R, R, R, R, R, R, 'R', 'T', 'F', 'R+', 'T+', 'F+', 'R+', R], 58)),
      clack: HOOK_CLACKS,
      tock: tocks(HOOK_CLACKS),
      snare: [...times(SN_MARCH, 8), ...times(SN_SHOW, 8)],
      bassDrum: times(BD, 16),
      crash: onBars(16, [0, 7, 8, 15], ONE).map((h, i) => (i === 7 * BAR + 8 || i === 15 * BAR + 8 ? 'x' : (i === 7 * BAR || i === 15 * BAR ? R : h))),
      timpani: timps(HOOK_CH, T_MARCH),
    }),

    // THE SWAGGER. The king's strut low on trombones and sax in stop-time,
    // the jaw in the gaps; then the whole band with a stride piano, and the
    // crowd shouting back.
    B: section(16, {
      trombones: [...transpose(SWAG, -24), ...rest(8)],
      sax: [...transpose(SWAG, -12), ...rest(8)],
      trumpets: at(8, SWAG),
      clarinet: at(8, SWAG),
      violins: [...rest(8), ...CROWD_HI],
      horns: [...comp(SWAG_CH, STOP_HI, 48), ...CROWD_LO],
      tuba: [...comp(SWAG_CH, STOP, 34), ...oom(SWAG_CH)],
      basses: [...comp(SWAG_CH, STOP, 34), ...oom(SWAG_CH)],
      cellos: at(8, transpose(CROWD_LO, 0)),
      piano: at(8, comp(SWAG_CH, ['R', R, R, R, R, R, R, R, 'F-', R, R, R, R, R, R, R], 36)),
      pianoHi: at(8, comp(SWAG_CH, [R, R, R, R, 'T', R, R, R, R, R, R, R, 'T', R, R, R], 55)),
      pianoTop: at(8, comp(SWAG_CH, [R, R, R, R, 'F', R, R, R, R, R, R, R, 'F', R, R, R], 58)),
      strings: at(8, pah8(SWAG_CH, 'T', 67)),
      pipeLow: at(8, pah(SWAG_CH, 'T', 69)),
      pipeMid: at(8, pah(SWAG_CH, 'F', 65)),
      clack: [...times(CLACK_TWO, 8), ...onBars(8, [3, 7], CLACK_GAP)],
      tock: [...tocks(times(CLACK_TWO, 8)), ...tocks(onBars(8, [3, 7], CLACK_GAP))],
      snare: [...times(ONE, 8), ...times(SN_SHOW, 8)],
      rim: times(hits('....x... ....x...'), 8),
      bassDrum: [...times(ONE, 8), ...times(BD, 8)],
      crash: [...rest(8), ...ONE, ...rest(2), ...hits('........ ....x...'), ...rest(3), ...hits('........ x.......')],
      timpani: at(8, timps(SWAG_CH, T_MARCH)),
    }),

    // THE STRINGS ACT. A puppet tango in G minor: staccato oboe and plucked
    // violins on the sly cell, the puppet strings jerking; then clarinet and
    // flute, the trumpets stabbing the cell. Then the act falters.
    C: section(16, {
      oboeShort: barsOf(TANGO, 0, 8),
      strings: [...barsOf(TANGO, 0, 8), ...rest(8)],
      clarinet: at(8, [...barsOf(TANGO, 0, 6), ...rest(2)]),
      flute: at(8, [...transpose(barsOf(TANGO, 0, 6), 12), ...rest(2)]),
      violins: at(8, [...barsOf(TANGO, 0, 6), ...rest(2)]),
      trumpets: at(8, TANGO_STABS),
      harp: [...Array.from({ length: 8 }, (_, b) => ([0, 1, 4].includes(b) ? comp(TANGO_CH.split(' ')[b], JERK, 67) : rest(1))).flat()],
      cellos: [...comp(`${TANGO_CH} ${TANGO_CH}`, HABANERA, 43).slice(0, 14 * BAR), ...held('G2', 2 * BAR - 4), R, R, R, R],
      basses: [...comp(`${TANGO_CH} ${TANGO_CH}`, HABANERA, 31).slice(0, 13 * BAR)],
      violas: [...longTones(`${TANGO_CH} ${TANGO_CH}`, 'T', 55).slice(0, 13 * BAR)],
      trombones: at(8, longTones('Gm D7 Gm Eb Cm', 'R', 43)),
      clack: [...times(CLACK_332, 13), ...hits('....x... ........'), ...hits('........ ..x.....'), ...rest(1)],
      tock: [...tocks(times(CLACK_332, 13)), ...tocks(hits('....x... ........')), ...tocks(hits('........ ..x.....')), ...rest(1)],
      rim: times(SN_TANGO, 12),
      snare: at(8, times(hits('........ ......x.'), 4)),
      timpani: [...timps(TANGO_CH, [0, R, R, R, R, R, 0, R, R, R, R, R, R, R, R, R]), ...timps(TANGO_CH, T_DRIVE).slice(0, 5 * BAR)],
      bassDrum: at(8, times(BD, 5)),
    }),

    // TUCK. A music box plays his tune alone, cellos plucked on tiptoe; then
    // a clarinet sings it, a solo violin under, and it ends on G major.
    P: section(16, {
      boxHarp: [...TUCK, ...BOX_CELL],
      glock: [...transpose(TUCK, 24), ...rest(8)],
      glockSour: at(12, barsOf(BOX_CELL, 4, 6)),
      tuck: at(8, TUCK),
      soloViolin: at(8, longTones(TUCK_CHORDS, 'T', 62)),
      tiptoe: [...comp(TUCK_CHORDS, TIPTOE, 43), ...comp(TUCK_CHORDS, TIPTOE, 43).slice(0, 7 * BAR)],
      violas: at(8, longTones(TUCK_CHORDS, 'F', 50)),
      cellos: at(15, holdBar(midi('G2'))),
    }),

    // THE SHOW FORCES ITS WAY BACK. The cell climbing a half step a bar on
    // the brass, the snare rolling, the jaw faster and faster; F#7; a dead beat.
    R: stopdown(section(8, {
      trumpets: CLIMB,
      horns: transpose(CLIMB, -24),
      trombones: transpose(CLIMB, -12),
      violinsTrem: [...[0, 1, 2, 3, 4, 5].flatMap((s) => holdBar(midi('D5') + s)), ...held('E5', 2 * BAR)],
      cellos: [...[0, 1, 2, 3, 4, 5].flatMap((s) => holdBar(midi('Bb2') + s)), ...held('F#2', 2 * BAR)],
      tuba: comp(CLIMB_CH, ['R', R, R, R, R, R, R, R, 'R', R, R, R, R, R, R, R], 34),
      basses: comp(CLIMB_CH, ['R', R, 'R', R, 'R', R, 'R', R, 'R', R, 'R', R, 'R', R, 'R', R], 34),
      clack: [...times(CLACK_BEATS, 2), ...times(CLACK_8THS, 3), ...times(CLACK_16THS, 3)],
      tock: tocks([...times(CLACK_BEATS, 2), ...times(CLACK_8THS, 3), ...times(CLACK_16THS, 3)]),
      roll: [...times(SN_8THS, 4), ...times(SN_16THS, 4)],
      bassDrum: times(BD_FOUR, 8),
      timpani: timps('Bb B C Db D Eb', T_DRIVE),
      timpRoll: at(6, held('F#2', 2 * BAR)),
      swell: swellInto(8),
    })),

    // BIGGER, a half step up. The hook on everything; the jaw on every beat;
    // the ta-da that won't end.
    D: section(16, {
      crash: onBars(16, [0, 2, 4, 6, 8, 10, 12, 14], ONE),
      trumpets: HOOK_UP,
      violins: HOOK_UP,
      violas: transpose(HOOK_UP, -12),
      clarinet: HOOK_UP,
      oboe: HOOK_UP,
      flute: transpose(HOOK_UP, 12),
      piccolo: at(8, transpose(barsOf(HOOK_UP, 8, 16), 12)),
      glock: transpose(HOOK_UP, 24),
      trombones: longTones(UP_CH, 'T', 50),
      choirLow: at(4, longTones(UP_CH.split(' ').slice(4).join(' '), 'T', 55)),
      choirHigh: at(8, longTones(UP_CH.split(' ').slice(8).join(' '), 'F', 62)),
      cellos: longTones(UP_CH, 'R', 43),
      horns: pah(UP_CH, 'T', 48),
      tuba: oom(UP_CH),
      basses: oom(UP_CH),
      pipeLow: pah8(UP_CH, 'T', 69),
      pipeMid: pah8(UP_CH, 'F', 65),
      pipeHigh: pah8(UP_CH, 'R+', 72),
      strings: Array.from({ length: 16 }, (_, b) => ([3, 7, 11].includes(b) ? comp(UP_CH.split(' ')[b], JERK, 66) : rest(1))).flat(),
      clack: [...times(CLACK_BEATS, 15), ...hits('x...x... x.x.x.x.')],
      tock: tocks([...times(CLACK_BEATS, 15), ...hits('x...x... x.x.x.x.')]),
      snare: [...times(SN_SHOW, 8), ...times(SN_8THS, 7), ...hits('x...x... x.......')],
      bassDrum: times(BD_FOUR, 16),
      timpani: timps(UP_CH, T_DRIVE),
    }),

    // HOME. The vamp and the calliope as at the start; the cell called and
    // clacked back; the fanfare, to raise the curtain on A.
    H: section(8, {
      trumpets: [...HOME_CALL, ...rest(2), ...FANFARE],
      clarinet: HOME_ANSWER,
      boxHarp: at(4, JAW_STUCK),
      glock: at(4, transpose(JAW_STUCK, 12)),
      clack: [...CLACK_GAP, ...CLACK_GAP, ...rest(2), ...CLACK_GAP, ...CLACK_STUCK, ...rest(1), ...CLACK_TADA],
      tock: tocks([...CLACK_GAP, ...CLACK_GAP, ...rest(2), ...CLACK_GAP, ...CLACK_STUCK, ...rest(1), ...CLACK_TADA]),
      horns: [...pah(HOME_CH, 'T', 48).slice(0, 6 * BAR), ...r8('Bb2 - F3 - Bb3 - - - | F3 - - - . . . .')],
      trombones: at(4, r16('Eb3 - - - F3 - - - G3 - - - A3 - - - | Bb3 - - - - - - - - - - - . . . .')),
      tuba: oom(HOME_CH),
      basses: oom(HOME_CH),
      pipeLow: pah(HOME_CH, 'T', 69),
      pipeMid: pah(HOME_CH, 'F', 65),
      pipeHigh: pah(HOME_CH, 'R+', 72),
      strings: at(3, comp('Edim', JERK, 64)),
      snare: [...times(SN_MARCH, 6), ...SN_16THS, ...SN_8THS],
      bassDrum: times(BD, 8),
      crash: at(6, ONE),
      timpani: timps(HOME_CH, T_MARCH),
    }),
  },

  // The intro plays once; after that the show loops from the number.
  order: ['intro', 'A', 'B', 'C', 'P', 'R', 'D', 'H'],
  loopFrom: 1,
};

// Every recorded instrument kept within reach of its recordings. The player
// stretches a note from the nearest recording, so any note inside an
// instrument's whole span keeps its written pitch (even across a wide gap,
// like the horns' between C4 and D5). Only a note more than three semitones
// beyond the lowest or highest recording moves by octaves, to inside it.
// The doublers (bells, pipes, piccolo) just leave out a note they can't reach.
const DOUBLERS = ['glock', 'glockSour', 'piccolo', 'pipeHigh', 'pipeMid', 'pipeLow'];
const near = (n, notes) => notes.some((r) => Math.abs(r - n) <= 2);
for (const tracks of Object.values(song.sections)) {
  for (const [name, steps] of Object.entries(tracks)) {
    const instrument = song.instruments[name];
    if (!instrument?.sample || instrument.drum || SAMPLE_SETS[instrument.sample].notes.length < 2) continue;
    const { notes } = SAMPLE_SETS[instrument.sample];
    let dropped = false;
    tracks[name] = steps.map((s) => {
      if (s === HOLD) return dropped ? REST : s;
      dropped = false;
      if (typeof s !== 'number') return s;
      if (DOUBLERS.includes(name)) {
        if (near(s, notes)) return s;
        dropped = true;
        return REST;
      }
      const low = Math.min(...notes) - 3;
      const high = Math.max(...notes) + 3;
      return [s, s - 12, s + 12, s - 24, s + 24].find((n) => n >= low && n <= high) ?? s;
    });
  }
}

export const RUMBOLD_THEME = song;
