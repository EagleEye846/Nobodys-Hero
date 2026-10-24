import { melody, midi, hits, transpose } from '../../audio/notation.js';

// "Didn't Mind the Camp": the theme of Bramble, the woodcutters' boy, for
// his join scene in the Hushwood and his big moments after. He's about ten,
// loud, brave, wrong about things and kind underneath; his hatchet is too big
// for him, and he was told to mind camp. He didn't. So it's a jig: a folk
// tune in 6/8 for a fiddle and a tin whistle (the recorder), with a
// pizzicato "oom-cha" under it, a frame drum played like a bodhran, a soft
// knock like a hatchet tapping a stump, and claps when he gets going. All
// real recordings (VSCO 2 and VCSL, sampleSets.js); no synth presets.
//
// His motif is his Ma's notch, the mark she cuts in the trees as she hunts:
// "three cuts and a tick". Three quick repeated notes, then a jump up a
// fourth: D D D, up to G (then a cheeky A). Exported as BRAMBLE_MOTIF so
// other songs can quote it. When he's showing off the tick jumps further (a
// sixth, D D D up to B); when he's scared, in the middle, the tick doesn't
// come: three cuts and then he slips back down (B B B, A G). It comes back
// at the end of that part, when he's got his nerve again.
//
// G major (Mixolydian too: the B part leans on F major, the flat seventh,
// the folk "perilous yet proud" sound). The tender part is E minor, with a
// borrowed C minor for the ache. 6/8 at 110 dotted quarters a minute, one
// step a 16th, so a bar is 12 steps (1.09s). The hatchet plays once (4.4s);
// then it loops from A, 88 bars, about 1m36s:
//
//   intro   4 bars  the hatchet alone, chop chop chop TICK, then the
//                   pizzicato oom-cha starts up
//   A      16 bars  the jig on the fiddle: two eights, the second with the
//                   tick leaping a sixth; bodhran on the beats
//   A2     16 bars  the whistle takes it, the fiddle a third below; the
//                   bodhran fills in and the knock comes in
//   B      16 bars  the second strain, higher, with F major in it: fiddle
//                   and whistle in octaves, claps on the second beat
//   holler  8 bars  he shouts the motif into the wood, and the wood shouts
//                   it back, smaller; then a big band hit, and nobody
//                   answers. Just a low E.
//   tender 16 bars  E minor, slower in feel: the scared part he won't say.
//                   A harp rocking like a lullaby (his Ma), the whistle with
//                   three cuts and no tick; then the fiddle reaching up,
//                   C minor for the ache, and the hatchet starting up again
//   A3     16 bars  the jig with everyone: fiddle, whistle a third below,
//                   a glockenspiel high over the first half (his jar of
//                   "treasure"), horns, claps. It ends on G, so the loop
//                   lands home.

// One step is a 16th: a bar of 6/8 is 12 of them.
const BAR = 12;
const rest = (bars) => Array(bars * BAR).fill('.');
const jig = (text) => melody(text, 2); // each token an 8th: six to a bar
const loop = (pattern, bars) => Array.from({ length: bars }, () => hits(pattern)).flat();

// --- Bramble's motif: "three cuts and a tick". One bar of 6/8:
//   D5 D5 D5 | G5 (quarter) A5      chop chop chop, TICK, and a cheeky A
// Showing off: D5 D5 D5 B5 - A5. Scared: B4 B4 B4 (no tick) A4 G4.
export const BRAMBLE_MOTIF = jig('D5 D5 D5 G5 - A5');

// --- Chords, a bar each; 'C,D' is two in a bar, half each. ---
const PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
function chordOf(symbol) {
  const m = symbol.match(/^([A-G])([#b]?)(m?)(7?)$/);
  if (!m) throw new Error(`Didn't Mind the Camp: can't read the chord '${symbol}'`);
  const root = (PC[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + 12) % 12;
  return { root, third: m[3] ? 3 : 4, top: m[4] ? 10 : 7 };
}
// The pitch class `pc` in the octave starting at `low` (a MIDI number).
const from = (pc, low) => low + ((((pc - low) % 12) + 12) % 12);
// One `make(chord, steps)` per chord: a bar each, or half a bar each when
// a bar holds two.
const comp = (chords, make) => chords.split(/\s+/).filter(Boolean).flatMap((bar) => {
  const parts = bar.split(',');
  return parts.flatMap((symbol) => make(chordOf(symbol), BAR / parts.length));
});
const one = (note, steps, at = 0) => Array.from({ length: steps }, (_, i) => (i === at ? note : '.'));
const hold = (note, steps) => [note, ...Array(steps - 1).fill('-')];

// The oom: the root on the beat, then its fifth below (or above, if that
// would be too low) on the second beat; one root a half bar when a bar has
// two chords.
const oom = (chords) => comp(chords, (c, steps) => {
  const root = from(c.root, 40);
  if (steps < BAR) return one(root, steps);
  const fifth = root - 5 >= 36 ? root - 5 : root + 7;
  return [...one(root, 6), ...one(fifth, 6)];
});
// The cha: the chord's third (cha) and fifth or seventh (chaHi), plucked on
// the third 8th of each beat.
const cha = (chords, voice) => comp(chords, (c, steps) => {
  const note = voice === 0 ? from(c.root + c.third, 57) : from(c.root + c.top, 60);
  return Array.from({ length: steps / 6 }, () => one(note, 6, 4)).flat();
});
// Long notes: the root low, or the third in the middle.
const roots = (chords, low) => comp(chords, (c, steps) => hold(from(c.root, low), steps));
const thirds = (chords, low) => comp(chords, (c, steps) => hold(from(c.root + c.third, low), steps));
// The harp's lullaby: root, fifth, octave, tenth, octave, fifth, in 8ths.
const lullaby = (chords) => comp(chords, (c, steps) => {
  const r = from(c.root, 40);
  const shape = [0, 7, 12, 12 + c.third, 12, 7];
  return Array.from({ length: steps }, (_, i) => (i % 2 === 0 ? r + shape[(i / 2) % 6] : '.'));
});

// A tune moved down a third inside G major (B under D, G under B...);
// notes outside the key go down a minor third.
const G_MAJOR = [7, 9, 11, 0, 2, 4, 6];
const thirdBelow = (tune) => tune.map((n) => {
  if (typeof n !== 'number') return n;
  const i = G_MAJOR.indexOf(n % 12);
  if (i < 0) return n - 3;
  const target = G_MAJOR[(i + 5) % 7];
  let m = n - 1;
  while (m % 12 !== target) m--;
  return m;
});

// --- A: the jig. Two eights; the second shows off. ---
const A_CHORDS = 'G G C D7 G Em C,D G G C G D C Em C,D G';
const A_TUNE = jig(`
  D5 D5 D5 G5 - A5 | B5 - G5 D5 - B4 | E5 E5 E5 A5 - B5 | C6 - A5 F#5 - D5 |
  D5 D5 D5 G5 - A5 | B5 - G5 E5 - G5 | C6 - B5 A5 - F#5 | G5 - - B4 C5 C#5 |
  D5 D5 D5 B5 - A5 | G5 - E5 C5 - E5 | D5 - B4 G4 - B4 | A4 - D5 F#5 - A5 |
  E5 E5 E5 C6 - B5 | G5 - E5 B4 - E5 | G5 - E5 D5 E5 F#5 | G5 - - G4 - - |
`);

// --- B: the second strain, higher, with the flat seventh (F) in it. ---
const B_CHORDS = 'G F C D7 Em C D7 G G F C D7 Em C D G';
const B_TUNE = jig(`
  G5 G5 G5 D6 - B5 | C6 - A5 F5 - A5 | G5 - E5 C5 - E5 | F#5 - A5 D6 - C6 |
  B5 - G5 E5 - G5 | A5 - G5 E5 - C5 | D5 - F#5 A5 - C6 | B5 - G5 D5 - - |
  G5 G5 G5 D6 - B5 | C6 - A5 F5 - A5 | G5 - C6 E6 - C6 | D6 - C6 A5 - F#5 |
  E5 E5 E5 B5 - A5 | G5 - E5 C6 - B5 | A5 - F#5 D5 E5 F#5 | G5 - - G4 - - |
`);

// --- The holler: he shouts the motif, and the wood shouts it back. ---
const SHOUT = jig(`
  D5 D5 D5 G5 - A5 | . . . . . . | G5 G5 G5 C6 - D6 | . . . . . . |
  D6 D6 D6 G6 - - | - - - - - - | . . . . . . | . . . . . . |
`);
const ECHO = jig(`
  . . . . . . | D5 D5 D5 G5 - A5 | . . . . . . | G5 G5 G5 C6 - - |
  . . . . . . | . . . . . . | D5 D5 D5 G5 - - | . . . . . . |
`);

// --- The tender part, E minor: three cuts and no tick; then the fiddle
// reaching up, the borrowed C minor, and his nerve coming back. ---
const T_CHORDS = 'Em Em C C Am Am B7 B7 Em Em C Cm G Em D D7';
const T_WHISTLE = jig(`
  B4 - - B4 - - | B4 - - A4 - G4 | G4 - - E4 - G4 | A4 - - - - - |
  C5 - - C5 - - | C5 - - B4 - A4 | F#4 - - D#4 - F#4 | B4 - - - - - |
`);
const T_FIDDLE = jig(`
  B4 - - B4 - - | B4 - - D5 - E5 | G5 - - F#5 - E5 | Eb5 - - D5 - C5 |
  D5 - - B4 - G4 | E5 - - - - - | F#5 - - A5 - - | C6 - - A5 F#5 E5 |
`);

export const BRAMBLE_THEME = {
  title: "Didn't Mind the Camp",
  bpm: 110,
  stepsPerBeat: 6,
  // A character theme for scenes: a touch under the fights.
  volume: 1,

  instruments: {
    // The fiddle: the solo violin, bowed short and bright, close by.
    fiddle: { sample: 'soloViolin', volume: 0.75, attack: 0.01, release: 0.14, reverb: 0.3, pan: 0.15, humanize: { time: 0.006, volume: 0.12 } },
    // The fiddle again, softer, for harmony under the whistle.
    fiddleLow: { sample: 'soloViolin', volume: 0.36, attack: 0.01, release: 0.14, reverb: 0.3, pan: 0.25, humanize: { time: 0.006, volume: 0.12 } },
    // The tin whistle: a recorder, breathy and close.
    whistle: { sample: 'recorder', volume: 0.26, attack: 0.02, release: 0.12, reverb: 0.3, pan: -0.2, humanize: { time: 0.006, volume: 0.1 } },
    // The whistle again, a little back, for harmony and octaves.
    whistleLow: { sample: 'recorder', volume: 0.17, attack: 0.02, release: 0.12, reverb: 0.3, pan: -0.3, humanize: { time: 0.006, volume: 0.1 } },
    // The scared part: the same two, played gently, bowed and breathed long.
    fiddleSoft: { sample: 'soloViolin', volume: 0.3, attack: 0.08, release: 0.5, reverb: 0.45, pan: 0.15, humanize: { time: 0.012, volume: 0.1 } },
    whistleSoft: { sample: 'recorder', volume: 0.14, attack: 0.06, release: 0.4, reverb: 0.5, pan: -0.2, humanize: { time: 0.012, volume: 0.1 } },
    // The wood shouting back: the whistle far off, in a lot of room.
    echo: { sample: 'recorder', volume: 0.07, attack: 0.02, release: 0.3, reverb: 0.85, pan: -0.5, echo: { time: 0.41, feedback: 0.3, mix: 0.35 } },
    // The oom-cha: cellos plucked low, violins plucked on the off 8ths.
    oom: { sample: 'cellosPizz', volume: 0.24, ring: true, reverb: 0.25, pan: -0.1, humanize: { time: 0.005, volume: 0.12 } },
    cha: { sample: 'violinsPizz', volume: 0.2, ring: true, reverb: 0.25, pan: 0.3, humanize: { time: 0.005, volume: 0.2 } },
    chaHi: { sample: 'violinsPizz', volume: 0.17, ring: true, reverb: 0.25, pan: 0.35, humanize: { time: 0.005, volume: 0.2 } },
    // The bodhran (a frame drum): the beats, and the quiet notes between.
    bodhran: { sample: 'frameDrum', drum: 'sample', volume: 0.2, ring: true, reverb: 0.2, pan: -0.05, humanize: { time: 0.004, volume: 0.12 } },
    ghost: { sample: 'frameDrum', drum: 'sample', volume: 0.08, ring: true, reverb: 0.2, pan: -0.05, humanize: { time: 0.006, volume: 0.3 } },
    // A hatchet tapping a stump: a soft snare, barely touched.
    knock: { sample: 'snareSoft', drum: 'sample', volume: 0.1, ring: true, reverb: 0.25, pan: 0.2, humanize: { time: 0.005, volume: 0.3 } },
    claps: { sample: 'claps', drum: 'sample', volume: 0.3, ring: true, reverb: 0.3, pan: 0.1, humanize: { time: 0.008, volume: 0.25 } },
    // Chop chop chop: a tom; and the tick, a high drum.
    chop: { sample: 'tom', drum: 'sample', volume: 0.34, ring: true, reverb: 0.25, humanize: { time: 0.004, volume: 0.15 } },
    tick: { sample: 'tenorDrumHigh', drum: 'sample', volume: 0.35, ring: true, reverb: 0.25, pan: 0.15 },
    // The tender part.
    harp: { sample: 'harp', volume: 0.17, ring: true, reverb: 0.5, pan: -0.25, humanize: { time: 0.012, volume: 0.2 } },
    cellos: { sample: 'cellos', volume: 0.11, attack: 0.3, release: 0.8, reverb: 0.45, pan: -0.15 },
    violas: { sample: 'violas', volume: 0.13, attack: 0.5, release: 1, reverb: 0.55, pan: 0.2 },
    horns: { sample: 'hornsSoft', volume: 0.45, attack: 0.15, release: 0.5, reverb: 0.45, pan: -0.2 },
    // His jar of treasure: a glockenspiel, high and light.
    glock: { sample: 'glock', volume: 0.07, ring: true, reverb: 0.45, pan: 0.4 },
  },

  sections: {
    // The hatchet alone (chop chop chop, TICK), then the oom-cha starts.
    intro: {
      chop: loop('x.x.x....... x.x.x....... ............ ............', 1),
      tick: loop('......x..... ......x..... ............ ............', 1),
      oom: [...rest(2), ...oom('G D7')],
      cha: [...rest(2), ...cha('G D7', 0)],
      chaHi: [...rest(2), ...cha('G D7', 1)],
      bodhran: [...rest(2), ...loop('x.....x.....', 2)],
    },

    // The jig on the fiddle, the bodhran on the beats.
    A: {
      fiddle: A_TUNE,
      oom: oom(A_CHORDS),
      cha: cha(A_CHORDS, 0),
      chaHi: cha(A_CHORDS, 1),
      bodhran: loop('x.....x.....', 16),
    },

    // The whistle takes it, the fiddle a third below; the bodhran fills in.
    A2: {
      whistle: A_TUNE,
      fiddleLow: thirdBelow(A_TUNE),
      oom: oom(A_CHORDS),
      cha: cha(A_CHORDS, 0),
      chaHi: cha(A_CHORDS, 1),
      bodhran: loop('x.....x.....', 16),
      ghost: loop('..x.x...x.x.', 16),
      knock: loop('....x.....x.', 16),
    },

    // The second strain: fiddle and whistle in octaves, claps on beat two.
    B: {
      fiddle: B_TUNE,
      // (its last G stays up: a G3 is below any whistle)
      whistleLow: [...transpose(B_TUNE.slice(0, 15 * BAR), -12), ...jig('G4 - - - - -')],
      oom: oom(B_CHORDS),
      cha: cha(B_CHORDS, 0),
      chaHi: cha(B_CHORDS, 1),
      bodhran: loop('x.....x.....', 16),
      ghost: loop('..x.x...x.x.', 16),
      claps: loop('......x.....', 16),
      // The tick of the motif on every downbeat it plays.
      tick: loop('......x..... ............ ............ ............', 4),
    },

    // He shouts into the wood; it shouts back, smaller; a big hit, and
    // nothing. Just a low E, to lead into the scared part.
    holler: {
      fiddle: SHOUT,
      echo: ECHO,
      oom: [...one(midi('G2'), BAR), ...rest(1), ...one(midi('C3'), BAR), ...rest(1), ...one(midi('G2'), BAR), ...rest(3)],
      chop: loop('x.x.x....... ............ x.x.x....... ............ x........... ............ ............ ............', 1),
      tick: loop('......x..... ............ ......x..... ............ ............ ............ ............ ............', 1),
      bodhran: loop('x........... ............ x........... ............ x........... ............ ............ ............', 1),
      claps: [...rest(4), ...loop('x...........', 1), ...rest(3)],
      horns: [...rest(4), ...hold(midi('G3'), BAR), ...rest(3)],
      cellos: [...rest(4), ...hold(midi('G2'), BAR), ...rest(1), ...hold(midi('E2'), 2 * BAR)],
    },

    // The scared part. A harp rocking like a lullaby, three cuts and no
    // tick on the whistle; the fiddle reaching up, C minor for the ache,
    // and the hatchet starting up again for home.
    tender: {
      whistleSoft: [...T_WHISTLE, ...rest(8)],
      fiddleSoft: [...rest(8), ...T_FIDDLE],
      harp: lullaby(T_CHORDS),
      cellos: roots(T_CHORDS, 40),
      violas: [...rest(8), ...thirds(T_CHORDS.split(' ').slice(8).join(' '), 55)],
      oom: [...rest(15), ...oom('D7')],
      chop: [...rest(14), ...loop('x.....x..... x.x.x.x.x.x.', 1)],
    },

    // Everyone: the fiddle, the whistle a third below, the glockenspiel
    // high over the first half, horns, claps.
    A3: {
      fiddle: A_TUNE,
      whistleLow: thirdBelow(A_TUNE),
      glock: [...transpose(A_TUNE.slice(0, 8 * BAR), 12), ...rest(8)],
      oom: oom(A_CHORDS),
      cha: cha(A_CHORDS, 0),
      chaHi: cha(A_CHORDS, 1),
      horns: roots(A_CHORDS, 43),
      bodhran: loop('x.....x.....', 16),
      ghost: loop('..x.x...x.x.', 16),
      knock: loop('....x.....x.', 16),
      claps: loop('......x.....', 16),
    },
  },

  // The hatchet plays once; then the jig goes round from A.
  order: ['intro', 'A', 'A2', 'B', 'holler', 'tender', 'A3'],
  loopFrom: 1,
};
