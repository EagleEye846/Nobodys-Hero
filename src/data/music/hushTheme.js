import { melody, chordLine, transpose, hits, HOLD, REST } from '../../audio/notation.js';
import { SAMPLE_SETS } from '../../audio/sampleSets.js';
import { midi, timp, timpRoot, swellInto, ORCHESTRA } from './parts/usurper.js';
import { HERS_GRIEF_GM } from './parts/chapter3.js';

// "Nobody Gets Away": the Hush, Chapter 3's last boss (the_hush.js). The huge,
// silent black boar that has hunted the hero and Ves all chapter, upright now
// like some old king of the wood, ember eyes, Ves's umbrella in its jaws.
// Plays for its first two phases; once the umbrella is back in her hands it
// gives way to "Nobody's Dawn" (nobodysDawnTheme.js), which it hands over to
// at the same speed.
//
// A chase. It runs on a tune you can hum, built from the claws (G Bb C#, D:
// a minor third, a tritone, the pounce), the cell the Hush has made all
// chapter in "Tooth and Tatter" and "Something in the Trees"
// (pinefallBeastTheme.js, hushStalkTheme.js). THE HOOK, eight bars, one
// token a 16th:
//
//   G . . Bb . C# D - - - - . G F |  Eb . . D . C# D - - - - . Bb G |
//   C . . Eb . F# G - - - - . C Bb | A . . G . F# D - - - - . . . . |
//   G . . Bb . C# D - - - - . Bb A |  G . . Eb . D Eb - - - - . G Bb |
//   C . . Bb . C Eb - - - - - - C Bb | A . . Bb . C# D - - - - - - - . . |
//
// Every bar is the same shape: a note, a push on the "a" of one, then two
// quick ones and a long note landing on the "and" of two, AHEAD of the beat
// (da . . da . da-DAAA). The claws in bar 1; turned round the D in bar 2; the
// claws again on C in bar 3 (C Eb F# G); bar 5 is bar 1 with one note
// changed (the leap goes higher); bars 6 and 7 climb to the peak, the high
// E flat, a scream on the flat sixth; and bar 8 is the claws remade as the
// harmonic-minor climb, A Bb C# D, ending on the top D over the dominant.
// Under it, i VI iv V | i VI bII V (Gm Eb Cm D | Gm Eb Ab D): the A flat is
// the one borrowed chord, and the bass walks in 8ths (root, octave, fifth)
// with a chromatic step into every new root, and the low cellos gallop the
// prowl (root, fifth, seventh, a flick to the octave) in 16ths over it.
//
// THE SOUND OF THE HUSH, all the way through, in every section:
//   THE HAMMER: a grand piano striking the tune in low octaves, doubled by a
//     second piano tuned 19 cents sharp and a third a few cents flat two
//     octaves down, so every note beats against itself like an old upright
//     left out in the wet. It is the Hush. When the tune is on another
//     instrument the hammer is still under it; in the chase it IS the chaser.
//   THE BOWED METAL: a bowed vibraphone ringing high over every long note of
//     the tune, a thin, cold whine like the silence the birds leave when the
//     Hush is near. In the quiet it is all that's left.
// Everything else is the sampled orchestra. No trumpet anywhere, no kit, no
// snare: timpani, taiko, a concert bass drum, a gong.
//
// The tune never sits still. Every statement of it has a different lead, and
// every section moves it somewhere new (Fox's way: change a note, re-bar it,
// fragment it, harmonise it, augment it, then bring it home):
//
// G minor; the climax up a step in A minor (minor to minor, no major lift).
// 150 BPM, one step a 16th, so a bar is 1.6 seconds, the same grid as
// "Nobody's Dawn". The intro plays once (6s); then it loops from A, 112 bars,
// 2m59s. The pivot lands 50% of the way in, and it comes home before the loop:
//
//   intro     4 bars  the hammer strikes a low G; the 16th motor starts and
//                     the bass walks; the claws on the hammer and cellos; the
//                     hook's last bar as a pickup
//   A        16 bars  0:00 THE HOOK: first on the hammer and cellos with the
//                     spiccato violins racing above; then (0:13) on violins
//                     and violas, the hammer under, horns, trombones and tuba
//                     punching the pushes, the drums in; a sudden cut
//   B        24 bars  0:26 CALL AND RESPONSE, pulled right back: the hook
//                     split between two choirs in C minor, the claws barked
//                     low by trombones, cellos and the hammer, answered high
//                     by oboe, clarinet and flute. (0:38) THE CHASE: the hook
//                     on solo violin and flute, and the hammer, trombones and
//                     cellos hunting it a bar behind in canon. (0:51) Rising
//                     pairs, G, A, B flat, each a step up, to the hook's last
//                     bar on D, pounded, and a dead beat
//   C        16 bars  1:04 THE STOMP: the hook augmented, half time, on horns
//                     and trombones with tremolo violins screaming it at
//                     pitch, the drums on one and three, while the motor runs
//                     double time against it. It falls Ab to G (the Phrygian
//                     close) and STOPS: gong, a held G minor, a bar of
//                     nothing. A FAKE ENDING
//   P        16 bars  1:30 THE HUSH (the pivot): only the bowed metal, a low
//                     drone and a heartbeat; the hook re-barred in threes on a
//                     soft piano, like a broken lullaby; Ves's motif, ONCE, on
//                     a solo violin, its ache bent into the claws (C# A Ab for
//                     C A Bb); the claws answer, unfinished; the prowl creeps
//                     back on plucked cellos
//   R         8 bars  1:55 THE RISE: the claws climbing a half step a bar
//                     (G Ab A Bb B C), tremolo violins rising, the drums
//                     doubling; two bars of E, the dominant of A minor; a roll,
//                     a swell, a dead beat
//   D        16 bars  2:08 THE LIFT, A minor: gong and BRAAAM, the hook on
//                     violins, solo violin and flute over everything; then
//                     (2:21) harmonised in thirds with the flute an octave up
//   X         8 bars  2:34 RUN: the hook at double speed, two bars a bar, on
//                     spiccato violins, flute and the hammer over a taiko
//                     gallop; halfway it drops back down into G minor
//   H         8 bars  2:46 HOME: the claws called low, answered by the oboe,
//                     thinning back to the opening texture; the hook's last two
//                     bars low on the hammer and cellos, and round to A

// --- Helpers. ---
const BAR = 16;
const r16 = (text) => melody(text, 1);                  // each token a 16th
const rest = (bars) => Array(bars * BAR).fill(REST);
const times = (track, n) => Array(n).fill(track).flat();
const at = (bars, track) => [...rest(bars), ...track]; // starts `bars` bars in
const barOf = (track, i) => track.slice(i * BAR, (i + 1) * BAR);
const barsOf = (track, from, to) => track.slice(from * BAR, to * BAR);
// The same line `steps` later, cut to the same length (the canon).
const delay = (track, steps) => [...Array(steps).fill(REST), ...track].slice(0, track.length);
// Each step twice as long (the half-time stomp).
const augment = (track) => track.flatMap((s) => [s, typeof s === 'number' ? HOLD : s]);
// One note held for `steps`.
const held = (name, steps) => [midi(name), ...Array(steps - 1).fill(HOLD)];
const heldEach = (names, steps) => names.split(/\s+/).filter(Boolean).flatMap((n) => held(n, steps));
// Only the notes at least `min` steps long (for the bowed metal's halo).
function longNotes(track, min) {
  const out = Array(track.length).fill(REST);
  for (let i = 0; i < track.length; i++) {
    if (typeof track[i] !== 'number') continue;
    let length = 1;
    while (track[i + length] === HOLD) length++;
    if (length >= min) for (let k = 0; k < length; k++) out[i + k] = k ? HOLD : track[i];
  }
  return out;
}
// Call and response: in each bar `isCall` picks, the claws (its first 12
// steps) go to the low choir and the tail to the high one; the other bars
// are all high.
function antiphon(track, isCall) {
  const low = [];
  const high = [];
  for (let b = 0; b < track.length / BAR; b++) {
    const bar = barOf(track, b);
    if (isCall(b)) {
      low.push(...bar.slice(0, 12), REST, REST, REST, REST);
      high.push(...Array(12).fill(REST), ...bar.slice(12));
    } else {
      low.push(...rest(1));
      high.push(...bar);
    }
  }
  return { low, high };
}
// The hook at double speed: each bar's notes in half a bar, da-a da da DA-a da da.
function diminish(track) {
  const out = [];
  for (let b = 0; b < track.length / BAR; b++) {
    const notes = barOf(track, b).filter((s) => typeof s === 'number');
    const [a, bb, c, d, e, f] = notes;
    out.push(a, HOLD, bb, c, d, HOLD, ...(notes.length > 4 ? [e, f] : [HOLD, HOLD]));
  }
  return out;
}
// A diatonic third below every note, in A minor (with G# and D# over E).
const THIRD_BELOW_AM = { 9: 4, 11: 4, 0: 3, 2: 3, 4: 4, 5: 3, 7: 3, 8: 4, 3: 4, 10: 3 };
const thirdsBelow = (track) => track.map((n) => (typeof n === 'number' ? n - (THIRD_BELOW_AM[n % 12] ?? 3) : n));

// --- Chords. ---
const chordsOf = (text) => text.split(/\s+/).filter(Boolean);
const rootName = (sym) => sym.replace(/m$/, '');
const isMinor = (sym) => /m$/.test(sym);
const pcOf = (sym) => midi(`${rootName(sym)}4`) % 12;
const inBand = (pc, low) => low + ((pc - (low % 12) + 12) % 12);   // that pitch class, from `low` up
const rootsOf = (chords) => chordsOf(chords).map(rootName).join(' ');

// The walking bass: one shape per chord, its roots kept between G1 and F#2,
// with 'to' a chromatic step into the next chord's root (or the fifth if it
// doesn't move). `then` is the chord after the last one.
const WALK = [0, HOLD, 12, 0, REST, 0, 12, REST, 0, HOLD, 7, REST, 12, REST, 'to', REST];
const WALK_HALF = [0, REST, 12, 0, REST, 7, 'to', REST];
function walk(chords, then, shape = WALK, low = 31) {
  const list = [...chordsOf(chords), then];
  const roots = list.map((c) => inBand(pcOf(c), low));
  return roots.slice(0, -1).flatMap((r, i) => {
    const next = roots[i + 1];
    const to = next === r ? r + 7 : next > r ? next - 1 : next + 1;
    return shape.map((p) => (p === 'to' ? to : typeof p === 'number' ? r + p : p));
  });
}
// The prowl at a gallop, on the low spiccato cellos: root, fifth, seventh, a
// flick to the octave (a major chord takes its third instead of the seventh).
const PROWL_MINOR = [0, 0, 7, 0, 10, 0, 12, 10, 0, 0, 7, 0, 10, 12, 10, 7];
const PROWL_MAJOR = [0, 0, 7, 0, 12, 0, 16, 12, 0, 0, 7, 0, 12, 16, 12, 7];
const PROWL_HALF = [0, 0, 12, 0, 0, 12, 0, 12];
function prowl(chords, shapes = [PROWL_MINOR, PROWL_MAJOR], low = 43) {
  return chordsOf(chords).flatMap((c) => {
    const r = inBand(pcOf(c), low);
    const shape = isMinor(c) ? shapes[0] : shapes[1];
    return shape.map((p) => (typeof p === 'number' ? r + (p === 16 ? 12 + (isMinor(c) ? 3 : 4) : p) : p));
  });
}
// The motor: 16th spiccato violins running the chord high, the chase.
const MOTOR = [12, 7, 'tenth', 7, 12, 7, 'tenth', 7, 12, 7, 'tenth', 7, 19, 'tenth', 12, 7];
const motor = (chords) => chordLine(chords, MOTOR, 4);
// Brass punching the pushes, a 16th ahead of beats three and one.
const PUSH = [REST, REST, REST, REST, REST, REST, 0, HOLD, REST, REST, REST, REST, REST, REST, 0, REST];
const pushes = (chords, octave) => chordLine(chords, PUSH, octave);

// --- Drums, one bar. ---
const TK_PUSH = hits('x..x..x. x...x.xx');
const TK_GALLOP = hits('x.xx x.xx x.xx x.xx');
const TK_8THS = hits('x.x.x.x. x.x.x.x.');
const TK_16THS = hits('xxxxxxxx xxxxxxxx');
const TK_STOMP = hits('........ x.......');
const TKH_FILL = hits('........ ..x.xxxx');
const TKH_OFF = hits('..x...x. ..x...x.');
const BD_ONE = hits('x....... ........');
const BD_TWO = hits('x....... x.......');
const BD_FOUR = hits('x...x... x...x...');
const ONE = hits('x....... ........');
// Timpani, on each chord's root.
const T_LIGHT = [0, REST, REST, REST, REST, REST, 0, REST, REST, REST, REST, REST, REST, REST, REST, REST];
const T_DRIVE = [0, REST, REST, 0, REST, REST, 0, REST, 0, REST, REST, REST, 0, REST, 0, REST];
const T_STOMP = [0, REST, REST, REST, REST, REST, 0, REST, 0, REST, REST, REST, REST, REST, REST, REST];
const T_HALF = [0, REST, 0, REST, 0, REST, 0, REST];
const T_HEART = [0, REST, REST, 0, ...Array(12).fill(REST)];
// A fill on every `n`th bar.
const fills = (pattern, fill, bars, n) => Array.from({ length: bars }, (_, i) => ((i + 1) % n === 0 ? fill : pattern)).flat();
// A hit on the first beat of the bars listed.
const hitsOn = (bars, list) => Array.from({ length: bars }, (_, i) => (list.includes(i) ? ONE : rest(1))).flat();

// Pads every track of a section out to `bars` bars (and refuses one too long).
function section(bars, tracks) {
  return Object.fromEntries(Object.entries(tracks).map(([name, steps]) => {
    if (steps.length > bars * BAR) throw new Error(`Nobody Gets Away: '${name}' is ${steps.length} steps, longer than ${bars} bars`);
    return [name, [...steps, ...Array(bars * BAR - steps.length).fill(REST)]];
  }));
}
// The whole band stops dead for the last `steps` steps.
const stopdown = (tracks, steps = 4) => Object.fromEntries(Object.entries(tracks).map(([name, track]) => [name, [...track.slice(0, -steps), ...Array(steps).fill(REST)]]));

// --- THE HOOK (G minor, eight bars, one token a 16th). ---
const HOOK = r16(`
  G4 - . Bb4 - C#5 D5 - - - - . G5 - F5 -    | Eb5 - . D5 - C#5 D5 - - - - . Bb4 - G4 - |
  C5 - . Eb5 - F#5 G5 - - - - . C6 - Bb5 -   | A5 - . G5 - F#5 D5 - - - - . . . . .     |
  G4 - . Bb4 - C#5 D5 - - - - . Bb5 - A5 -   | G5 - . Eb5 - D5 Eb5 - - - - . G5 - Bb5 - |
  C6 - . Bb5 - C6 Eb6 - - - - - - C6 Bb5 -   | A5 - . Bb5 - C#6 D6 - - - - - - - . .    |
`);
const HOOK_CH = 'Gm Eb Cm D Gm Eb Ab D';
const HALO = longNotes(HOOK, 5);                       // the bowed metal's notes
// The hammer: the same line struck in two low octaves, one piano sour.
const hammer = (line) => ({
  hammer: transpose(line, -12),
  hammerSour: transpose(line, -12),
  hammerLow: transpose(line, -24),
});

// --- B: the hook split between two choirs, in C minor. ---
const B1_LINE = transpose(HOOK, -7);
const B1_CH = 'Cm Ab Fm G Cm Ab Db G';
const B1 = antiphon(B1_LINE, (b) => b % 2 === 0);
// The chase: the hammer a bar behind.
const CHASER = delay(HOOK, BAR);
// Rising pairs: the hook's first two bars, claws low and answer high, on G,
// A and B flat; then its last bar on D, and the D pounded.
const PAIR = antiphon(barsOf(HOOK, 0, 2), (b) => b === 0);
const B3_LOW = [
  ...[0, 2, 3].flatMap((s) => transpose(PAIR.low, s)),
  ...transpose(barOf(HOOK, 7), -12),
  ...r16('D4 . . D4 . . D4 . D4 . D4 . . . . .'),
];
const B3_HIGH = [
  ...[0, 2, 3].flatMap((s) => transpose(PAIR.high, s)),
  ...barOf(HOOK, 7),
  ...r16('D6 . . D6 . . D6 . D6 . D6 . . . . .'),
];
const B3_CH = 'Gm Eb Am F Bbm Gb D D';

// --- C: the stomp. The hook's first seven bars at half speed, then the
// Phrygian close onto G and a fake ending. ---
const AUG = augment(barsOf(HOOK, 0, 7));
const C_CH = 'Gm Gm Eb Eb Cm Cm D D Gm Gm Eb Eb Ab Ab Gm';
const ENDING = (name) => held(name, 12);              // the last chord, held, then nothing

// --- P: the hush. The hook re-barred in threes, and her motif bent. ---
const REBAR = r16(`
  G4 - - Bb4 - - C#5 - - D5 - - - - - -   | G5 - - F5 - - Eb5 - - D5 - - - - - - |
  C5 - - Eb5 - - F#5 - - G5 - - - - - -   | C6 - - Bb5 - - A5 - - G5 - - F#5 - - - |
`);
// Ves's grieving motif (D D, up to Bb, C A Bb) with its ache bent into the
// claws: C# for C, A flat for B flat. The only time it appears.
const HERS_BENT_TEXT = HERS_GRIEF_GM.replace('C6 A5 Bb5', 'C#6 A5 Ab5');
if (HERS_BENT_TEXT === HERS_GRIEF_GM) throw new Error("Nobody Gets Away: couldn't bend her motif");
const HERS_BENT = melody(HERS_BENT_TEXT, 4);           // each token a quarter: two bars
// The claws answer, and don't finish.
const UNFINISHED = r16('G4 - - Bb4 - - C#5 - - - - - - - - - | . . . . . . . . . . . . . . . .');
const CREEP = [0, REST, REST, REST, 7, REST, REST, 10, 12, REST, REST, REST, 10, REST, 7, REST];

// --- R: the rise. The claws a half step higher each bar, then E. ---
const CLAWS_BAR = [...barOf(HOOK, 0).slice(0, 12), REST, REST, REST, REST];
const TAIL_BAR = [...Array(12).fill(REST), ...barOf(HOOK, 0).slice(12)];
const R_LOW = [
  ...[0, 1, 2, 3, 4, 5].flatMap((s) => transpose(CLAWS_BAR, s)),
  ...transpose(CLAWS_BAR, -3),                          // E G A# B
  ...r16('E4 . . E4 . . E4 . E4 . E4 E4 E4 E4 E4 E4'),
];
const R_HIGH = [...[0, 1, 2, 3, 4, 5].flatMap((s) => transpose(TAIL_BAR, s)), ...rest(2)];
const R_CH = 'Gm Abm Am Bbm Bm Cm E E';

// --- D: the lift, up a step into A minor. ---
const LIFT = transpose(HOOK, 2);
const D_CH = 'Am F Dm E Am F Bb E';

// --- X: run. The hook at double speed, A minor then G minor. ---
const RUN = [...diminish(LIFT), ...diminish(HOOK)];
const X_CH = 'Am F Dm E Am F Bb E Gm Eb Cm D Gm Eb Ab D';     // two to a bar

// --- H: home. The claws called low and answered high, then the hook's last
// two bars low, into the top of the loop. ---
const HOME_CALLS = antiphon([...barsOf(HOOK, 0, 2), ...barsOf(HOOK, 0, 4)], (b) => b % 2 === 0);
const H_CH = 'Gm Eb Gm Eb Cm D Ab D';
const H_LOW = [...HOME_CALLS.low.slice(0, 5 * BAR), ...rest(1), ...barsOf(HOOK, 6, 8)];
const H_HIGH = [...HOME_CALLS.high.slice(0, 6 * BAR)];

// --- The intro: the claws, then the hook's last bar as a pickup. ---
const INTRO_CLAWS = [...CLAWS_BAR, ...transpose(barOf(HOOK, 7), -12)];

// The second hammer, 19 cents sharp (the sample player retunes by 12 times
// `octave` semitones), and the low one a few cents flat.
const SOUR = 19 / 1200;
const FLAT = -7 / 1200;

const O = ORCHESTRA;

const song = {
  title: 'Nobody Gets Away',
  bpm: 150,
  stepsPerBeat: 4,
  // Level with "Nobody's Dawn" through the body of the loop; the climax a
  // little over it, the hush well under.
  volume: 0.94,

  instruments: {
    // The Hush's own sound: the hammer (three pianos, out of tune with each
    // other) and the bowed metal.
    hammer: { sample: 'grandPiano', volume: 0.4, release: 0.3, reverb: 0.22, pan: -0.15, humanize: { time: 0.005, volume: 0.1 } },
    hammerSour: { sample: 'grandPiano', octave: SOUR, volume: 0.3, release: 0.3, reverb: 0.22, pan: 0.2, humanize: { time: 0.009, volume: 0.1 } },
    hammerLow: { sample: 'grandPiano', octave: FLAT, volume: 0.38, release: 0.35, reverb: 0.2, humanize: { time: 0.004, volume: 0.08 } },
    metal: { sample: 'vibesBowed', volume: 0.3, attack: 0.12, release: 0.9, reverb: 0.5, pan: 0.25 },
    softPiano: { sample: 'grandPiano', volume: 0.3, ring: true, reverb: 0.55, pan: -0.1, humanize: { time: 0.015, volume: 0.15 } },
    // Strings.
    soloViolin: O.soloViolin,
    violins: O.violins,
    violinsHigh: O.violinsHigh,
    violas: { sample: 'violas', volume: 0.34, attack: 0.03, release: 0.35, reverb: 0.38, pan: -0.1 },
    cellos: O.cellos,
    race: O.race,
    pound: O.pound,
    basses: O.basses,
    violinsTrem: { sample: 'violinsTrem', volume: 0.28, attack: 0.08, release: 0.4, reverb: 0.42, pan: 0.25 },
    cellosTrem: { sample: 'cellosTrem', volume: 0.3, attack: 0.3, release: 0.5, reverb: 0.4, pan: -0.2 },
    pizz: { sample: 'cellosPizz', volume: 0.45, ring: true, reverb: 0.35, pan: -0.15, humanize: { time: 0.006, volume: 0.15 } },
    drone: { sample: 'cellos', volume: 0.22, attack: 0.6, release: 1.2, reverb: 0.45 },
    // Winds.
    flute: { sample: 'flute', volume: 0.36, attack: 0.02, release: 0.25, reverb: 0.4, pan: 0.3 },
    oboe: { sample: 'oboe', volume: 0.42, attack: 0.02, release: 0.25, reverb: 0.38, pan: 0.2 },
    clarinet: { sample: 'clarinet', volume: 0.36, attack: 0.02, release: 0.25, reverb: 0.38, pan: -0.2 },
    // Brass (no trumpet).
    horns: O.horns,
    trombones: O.trombones,
    tuba: O.tuba,
    braam: O.braam,
    braamLow: O.braamLow,
    // Percussion.
    timpani: O.timpani,
    timpSoft: { sample: 'timpani', volume: 0.38, ring: true, reverb: 0.45 },
    timpRoll: O.timpRoll,
    swell: O.swell,
    taiko: O.taiko,
    taikoHigh: O.taikoHigh,
    bassDrum: O.bassDrum,
    gong: O.gong,
    impact: O.impact,
  },

  sections: {
    // The hammer strikes a low G under the bowed metal; the motor starts and
    // the bass walks; the claws on the hammer and cellos; the hook's last bar
    // as a pickup, a roll under it.
    intro: section(4, {
      impact: ONE,
      ...hammer([...held('G3', 8), ...Array(8).fill(REST), ...rest(1), ...INTRO_CLAWS]),
      metal: [...held('G4', 2 * BAR), ...held('D5', 2 * BAR)],
      cellos: at(2, transpose(INTRO_CLAWS, -12)),
      race: at(1, motor('Gm Gm D')),
      basses: at(1, walk('Gm Gm D', 'Gm')),
      timpani: at(2, timp('G', T_LIGHT)),
      timpRoll: at(3, [timpRoot('D'), ...Array(BAR - 3).fill(HOLD)]),
      taiko: at(3, TK_8THS),
    }),

    // THE HOOK. First on the hammer and cellos, the motor racing above it;
    // then on violins and violas, the hammer under, the brass punching the
    // pushes, the drums in. A sudden cut.
    A: stopdown(section(16, {
      ...hammer([...HOOK, ...HOOK]),
      cellos: transpose([...HOOK, ...HOOK], -12),
      violins: at(8, HOOK),
      violas: at(8, HOOK),
      metal: [...HALO, ...HALO],
      race: motor(HOOK_CH),
      pound: at(8, prowl(HOOK_CH)),
      basses: walk(`${HOOK_CH} ${HOOK_CH}`, 'Cm'),
      horns: at(8, pushes(HOOK_CH, 3)),
      trombones: at(8, pushes(HOOK_CH, 2)),
      tuba: at(8, pushes(HOOK_CH, 1)),
      timpani: [...timp(rootsOf(HOOK_CH), T_LIGHT), ...timp(rootsOf(HOOK_CH), T_DRIVE)],
      bassDrum: [...rest(4), ...times(BD_ONE, 4), ...times(BD_TWO, 8)],
      taiko: [...rest(4), ...times(TK_PUSH, 12)],
      taikoHigh: at(8, fills(rest(1), TKH_FILL, 8, 4)),
      gong: hitsOn(16, [8]),
      impact: hitsOn(16, [8]),
    })),

    // CALL AND RESPONSE, pulled back: the claws low, the answers high, in C
    // minor. THE CHASE: the hook on solo violin and flute, the hammer and the
    // trombones a bar behind. The rising pairs, and a dead beat.
    B: stopdown(section(24, {
      // calls, then the chaser, then the low half of the pairs
      ...hammer([...B1.low, ...CHASER, ...B3_LOW]),
      cellos: [...transpose(B1.low, -12), ...transpose(CHASER, -12), ...transpose(B3_LOW, -12)],
      trombones: [...transpose(B1.low, -24), ...transpose(CHASER, -24), ...transpose(B3_LOW, -24)],
      // answers, then the hunted, then the high half of the pairs
      oboe: [...B1.high, ...rest(8), ...transpose(B3_HIGH, -12)],
      clarinet: B1.high,
      flute: [...transpose(B1.high, 12), ...HOOK],
      soloViolin: at(8, HOOK),
      violins: [...rest(8), ...transpose(HOOK, -12), ...B3_HIGH],
      violas: at(16, transpose(B3_HIGH, -12)),
      metal: [...rest(8), ...HALO],
      race: at(16, motor(B3_CH)),
      pound: [...prowl(B1_CH), ...prowl(HOOK_CH), ...rest(8)],
      basses: [...walk(B1_CH, 'Gm'), ...walk(HOOK_CH, 'Gm'), ...walk(B3_CH, 'Gm')],
      horns: at(22, pushes('D D', 3)),
      tuba: at(16, pushes(B3_CH, 1)),
      timpani: [...timp(rootsOf(B1_CH), T_LIGHT), ...timp(rootsOf(HOOK_CH), T_DRIVE), ...timp(rootsOf(B3_CH), T_DRIVE)],
      taiko: [...times(ONE, 8), ...times(TK_GALLOP, 8), ...times(TK_8THS, 4), ...times(TK_16THS, 4)],
      taikoHigh: at(8, fills(TKH_OFF, TKH_FILL, 16, 4)),
      bassDrum: at(8, times(BD_FOUR, 16)),
      gong: hitsOn(24, [8]),
      timpRoll: at(23, [timpRoot('D'), ...Array(BAR - 1).fill(HOLD)]),
      swell: at(22, swellInto(2)),
    })),

    // THE STOMP: the hook at half speed on horns and trombones, the violins
    // screaming it in tremolo, the drums on one and three while the motor
    // runs double time. The Phrygian close, a held G minor, a gong, and a
    // bar of nothing: the fake ending.
    C: section(16, {
      horns: [...transpose(AUG, -24), ...ENDING('G2')],
      trombones: [...transpose(AUG, -24), ...ENDING('G2')],
      tuba: [...transpose(AUG, -36), ...ENDING('G1')],
      violinsTrem: [...AUG, ...ENDING('G5')],
      violins: at(14, ENDING('D5')),
      violas: at(14, ENDING('Bb4')),
      cellos: [...transpose(AUG, -12), ...ENDING('G3')],
      hammer: [...transpose(AUG, -12), ...ENDING('G2')],
      hammerSour: [...transpose(AUG, -12), ...ENDING('G2')],
      hammerLow: [...transpose(AUG, -24), ...ENDING('G1')],
      metal: [...longNotes(AUG, 10), ...ENDING('G4')],
      race: motor(C_CH),
      pound: prowl(C_CH),
      basses: [...walk(C_CH.split(' ').slice(0, 14).join(' '), 'Gm'), ...ENDING('G1')],
      timpani: [...timp(rootsOf(C_CH).split(' ').slice(0, 14).join(' '), T_STOMP)],
      bassDrum: times(BD_ONE, 14),
      taiko: times(TK_STOMP, 14),
      taikoHigh: times(TKH_OFF, 14),
      timpRoll: at(13, [timpRoot('Ab'), ...Array(BAR - 1).fill(HOLD)]),
      gong: hitsOn(16, [0, 8, 14]),
      impact: hitsOn(16, [0, 14]),
      braam: at(14, ENDING('G2')),
      braamLow: at(14, ENDING('G1')),
    }),

    // THE HUSH. The bowed metal, a drone, a heartbeat; the hook re-barred on
    // a soft piano; her motif, bent, once; the claws answer and don't finish;
    // the prowl creeps back on plucked cellos.
    P: section(16, {
      metal: [...held('G4', 4 * BAR), ...held('G4', 4 * BAR), ...held('Ab4', 4 * BAR), ...held('G4', 4 * BAR)],
      drone: [...held('G2', 8 * BAR), ...held('G2', 8 * BAR)],
      timpSoft: at(2, timp(rootsOf('G G G G G G G G G G G G G G'), T_HEART)),
      softPiano: [...rest(4), ...REBAR, ...rest(2), ...UNFINISHED],
      soloViolin: at(8, HERS_BENT),
      pizz: at(12, [...Array(2).fill(CREEP).flat(), ...Array(2).fill(CREEP).flat()].map((p) => (typeof p === 'number' ? midi('G2') + p : p))),
      cellosTrem: at(14, [...held('G2', BAR), ...held('Ab2', BAR)]),
      violinsTrem: at(14, [...held('D5', BAR), ...held('Eb5', BAR)]),
      hammerLow: at(14, r16('G1 . . . G1 . . . G1 . . . G1 . . . | G1 . G1 . G1 . G1 . G1 . G1 . G1 G1 G1 G1')),
    }),

    // THE RISE. The claws climbing a half step a bar, the violins holding
    // each fifth over them, the drums doubling; two bars of E; a roll, a
    // swell and a dead beat.
    R: stopdown(section(8, {
      ...hammer(R_LOW),
      cellos: transpose(R_LOW, -12),
      trombones: transpose(R_LOW, -24),
      horns: transpose(R_LOW, -24),
      violins: R_HIGH,
      violinsTrem: heldEach('D5 Eb5 E5 F5 F#5 G5 G#5 B5', BAR),
      race: motor(R_CH),
      basses: walk(R_CH, 'Am'),
      timpani: timp(rootsOf(R_CH).split(' ').slice(0, 6).join(' '), T_DRIVE),
      timpRoll: at(6, [timpRoot('E'), ...Array(2 * BAR - 1).fill(HOLD)]),
      taiko: [...times(TK_8THS, 4), ...times(TK_16THS, 4)],
      taikoHigh: at(4, times(TKH_OFF, 4)),
      bassDrum: times(BD_FOUR, 8),
      swell: swellInto(8),
    })),

    // THE LIFT, A minor. A gong and a BRAAAM; the hook on violins, solo
    // violin and flute over the whole orchestra; then harmonised in thirds
    // with the flute an octave above.
    D: section(16, {
      gong: hitsOn(16, [0, 8]),
      impact: hitsOn(16, [0, 8]),
      braam: held('A2', BAR),
      braamLow: held('A1', BAR),
      violins: [...LIFT, ...thirdsBelow(LIFT)],
      violinsHigh: at(8, LIFT),
      soloViolin: LIFT,
      flute: [...LIFT, ...transpose(LIFT, 12)],
      violas: transpose([...LIFT, ...LIFT], -12),
      clarinet: at(8, LIFT),
      cellos: transpose([...LIFT, ...LIFT], -12),
      trombones: [...transpose(LIFT, -24), ...pushes(D_CH, 2)],
      horns: pushes(`${D_CH} ${D_CH}`, 3),
      tuba: at(1, pushes(`${D_CH} ${D_CH}`, 1).slice(BAR)),
      ...hammer([...LIFT, ...LIFT]),
      metal: [...longNotes(LIFT, 5), ...longNotes(LIFT, 5)],
      pound: prowl(`${D_CH} ${D_CH}`),
      basses: walk(`${D_CH} ${D_CH}`, 'Am'),
      timpani: timp(rootsOf(`${D_CH} ${D_CH}`), T_DRIVE),
      bassDrum: times(BD_FOUR, 16),
      taiko: times(TK_PUSH, 16),
      taikoHigh: fills(TKH_OFF, TKH_FILL, 16, 4),
    }),

    // RUN. The hook at double speed on spiccato violins, flute and the
    // hammer, over a taiko gallop; halfway down into G minor again.
    X: section(8, {
      race: RUN,
      flute: RUN,
      ...hammer(RUN),
      pound: prowl(X_CH, [PROWL_HALF, PROWL_HALF]),
      basses: walk(X_CH, 'Gm', WALK_HALF),
      trombones: chordLine(X_CH, [0, HOLD, HOLD, HOLD, HOLD, HOLD, REST, REST], 2),
      tuba: chordLine(X_CH, [0, HOLD, HOLD, HOLD, HOLD, HOLD, REST, REST], 1),
      timpani: timp(rootsOf(X_CH), T_HALF),
      taiko: times(TK_GALLOP, 8),
      taikoHigh: fills(TKH_OFF, TKH_FILL, 8, 4),
      bassDrum: times(BD_FOUR, 8),
      gong: hitsOn(8, [4]),
    }),

    // HOME. The claws called low on the hammer and cellos, answered by the
    // oboe; back to the opening texture, the motor racing again; the hook's
    // last two bars low, and round to A.
    H: section(8, {
      ...hammer(H_LOW),
      cellos: transpose(H_LOW, -12),
      oboe: H_HIGH,
      metal: longNotes([...rest(6), ...barsOf(HOOK, 6, 8)], 5),
      pound: prowl('Gm Eb Gm Eb'),
      race: at(4, motor(H_CH).slice(4 * BAR)),
      basses: walk(H_CH, 'Gm'),
      timpani: timp(rootsOf(H_CH), T_LIGHT),
      taiko: at(4, times(TK_PUSH, 4)),
      bassDrum: at(4, times(BD_ONE, 4)),
    }),
  },

  // The intro plays once; after that the fight loops from the hook.
  order: ['intro', 'A', 'B', 'C', 'P', 'R', 'D', 'X', 'H'],
  loopFrom: 1,
};

// Every recorded instrument kept within reach of its recordings. The player
// stretches a note from the nearest recording, so any note inside an
// instrument's whole span keeps its written pitch (even across a wide gap,
// like the horns' between C4 and D5). Only a note more than three semitones
// beyond the lowest or highest recording moves by octaves, to inside it.
function inReach(note, notes) {
  const low = Math.min(...notes) - 3;
  const high = Math.max(...notes) + 3;
  const inside = (n) => n >= low && n <= high;
  return [note, note - 12, note + 12, note - 24, note + 24].find(inside) ?? note;
}
for (const tracks of Object.values(song.sections)) {
  for (const [name, steps] of Object.entries(tracks)) {
    const instrument = song.instruments[name];
    if (!instrument?.sample || instrument.drum || SAMPLE_SETS[instrument.sample].notes.length < 2) continue;
    const { notes } = SAMPLE_SETS[instrument.sample];
    tracks[name] = steps.map((s) => (typeof s === 'number' ? inReach(s, notes) : s));
  }
}

export const HUSH_THEME = song;
