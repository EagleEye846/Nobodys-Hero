import { melody, midi, hits, transpose } from '../../audio/notation.js';

// "Three Cuts and a Climb": the credits song at the end of Chapter Four. The
// throne hall has come down, Bramble's log is holding the doorway, and the
// three of them (the hero, Ves and Bramble) climb out of Belowtown on a rope,
// hand over hand, up and up until there's daylight. Warm, a little tired, a
// little sad about the hall and the king, and proud. Bramble saved the day
// (he'll tell you so), so this is his tune: "Didn't Mind the Camp"
// (brambleTheme.js) taken somewhere new, the way Toby Fox's credits pieces
// change the tunes they look back on.
//
// His motif, BRAMBLE_MOTIF, is "three cuts and a tick": three repeated
// notes, then a jump up a fourth (D D D, up to G, and a cheeky A). Here:
//   - bottom: a music box plays it at a crawl, D D D G, and stops; the
//     hatchet taps chop chop chop... and no tick yet.
//   - rope: the cuts slowed to a walk, on the fiddle, and every phrase
//     starts a step higher (D, E, F#, G): climbing the rope, one pull at a
//     time. The third phrase leans on C#, the bright Lydian lift.
//   - three: his jig itself, on the tin whistle, at a fond walking pace;
//     then Ves's motif (vesTheme.js, re-barred as in the chapter three
//     credits: D D, up to B, a long C, A, B) on the fiddle, and his three
//     cuts answer it. Both start on the same repeated note. Then both of
//     them together, in thirds, his tick leaping a sixth to show off.
//   - hall: E minor, three cuts and no tick (B B B, A G): the hall, the king,
//     Tuck with the carved head. The chapter's own four notes (the "first
//     cell", parts/chapter4.js) in their minor form on the cellos, and a
//     borrowed C minor for the ache. At the very end the cuts come back
//     (D D D), and the tick lands on the next downbeat.
//   - lift: the cuts climb a step every bar, faster and higher, through the
//     heroic borrowed chords (Ab, Bb), and up to A major.
//   - top: daylight. The jig's tune broad and singing on the violins and
//     flute, a whole step up in A; under it, the horns play the chapter's
//     first cell (E A C# B: it starts with the same leap up a fourth as his
//     tick), and the music box plays Ves's motif.
//   - home: back down a step to G (the warm flat-seventh step). The whistle
//     alone: three cuts and a tick, and the cheeky A; then showing off, the
//     tick up a sixth. Ves's motif once more on the fiddle. The last chord
//     is G with its ninth, ringing; and right on it, the hatchet's chop chop
//     chop, TICK.
//
// G major, A major for the top. 6/8 at 66 dotted quarters a minute, one
// step an 8th, so a bar is 6 steps (1.82s). Plays once: 78 bars, about 2m22s,
// and the last chord rings. All real recordings (VSCO 2 and VCSL,
// sampleSets.js); no synth presets.
//
//   bottom  6 bars  0:00  a low G and the harp rocking; the music box: D D D
//                         G, slowly; chop chop chop and no tick
//   rope   16 bars  0:11  the cuts as a slow climb on the fiddle, a step
//                         higher each phrase; plucked oom-cha, a soft drum
//                         pulling hand over hand; violas, then the whistle
//   three  16 bars  0:40  the jig on the whistle, half speed; Ves's motif on
//                         the fiddle and his cuts answering; both, in thirds
//   hall    8 bars  1:09  E minor: three cuts and no tick; the chapter's cell
//                         on the cellos; C minor; then the cuts come back
//   lift    8 bars  1:24  the cuts climbing a step a bar, through Ab and Bb;
//                         timpani rolling, a cymbal swelling, into A
//   top    16 bars  1:38  A major, everyone, still warm not loud: the jig
//                         singing on violins and flute, the chapter's cell
//                         on the horns, her motif on the music box
//   home    8 bars  2:07  G again: the whistle alone, his motif; her motif on
//                         the fiddle; a G with its ninth, and chop chop chop
//                         TICK

// A bar of 6/8 is six 8ths; one step is an 8th.
const BAR = 6;
const tune = (text) => melody(text, 1);
const rest = (bars) => Array(bars * BAR).fill('.');
const loop = (pattern, bars) => Array.from({ length: bars }, () => hits(pattern)).flat();
const one = (note, steps, at = 0) => Array.from({ length: steps }, (_, i) => (i === at ? note : '.'));
const hold = (note, steps) => [note, ...Array(steps - 1).fill('-')];

// A section `bars` long: every part cut or padded with rests to fit.
const section = (bars, parts) => Object.fromEntries(Object.entries(parts).map(([name, steps]) => {
  const out = steps.slice(0, bars * BAR);
  while (out.length < bars * BAR) out.push('.');
  return [name, out];
}));

// --- Chords, a bar each; 'C,D' is two in a bar, half each. ---
const PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
function chordOf(symbol) {
  const m = symbol.match(/^([A-G])([#b]?)(m?)(7?)$/);
  if (!m) throw new Error(`Three Cuts and a Climb: can't read the chord '${symbol}'`);
  const root = (PC[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + 12) % 12;
  return { root, third: m[3] ? 3 : 4, top: m[4] ? 10 : 7 };
}
// The pitch class `pc` in the octave starting at `low` (a MIDI number).
const from = (pc, low) => low + ((((pc - low) % 12) + 12) % 12);
const comp = (chords, make) => chords.split(/\s+/).filter(Boolean).flatMap((bar) => {
  const parts = bar.split(',');
  return parts.flatMap((symbol) => make(chordOf(symbol), BAR / parts.length));
});

// The oom: the root on the first beat, the fifth below (or above) on the
// second; a half-bar chord just gets its root.
const oom = (chords) => comp(chords, (c, steps) => {
  const root = from(c.root, 40);
  if (steps < BAR) return one(root, steps);
  const fifth = root - 5 >= 36 ? root - 5 : root + 7;
  return [...one(root, 3), ...one(fifth, 3)];
});
// The cha: the third and the fifth (or seventh), plucked on the last 8th of
// each beat.
const cha = (chords, voice) => comp(chords, (c, steps) => {
  const note = voice === 0 ? from(c.root + c.third, 57) : from(c.root + c.top, 60);
  return Array.from({ length: steps / 3 }, () => one(note, 3, 2)).flat();
});
// Long notes: the root low, the third or fifth in the middle.
const roots = (chords, low) => comp(chords, (c, steps) => hold(from(c.root, low), steps));
const thirds = (chords, low) => comp(chords, (c, steps) => hold(from(c.root + c.third, low), steps));
const fifths = (chords, low) => comp(chords, (c, steps) => hold(from(c.root + 7, low), steps));
// The harp rocking, as in his tender part (his Ma's lullaby): root, fifth,
// octave, tenth, octave, fifth.
const rocking = (chords, low = 40) => comp(chords, (c, steps) => {
  const r = from(c.root, low);
  const shape = [0, 7, 12, 12 + c.third, 12, 7];
  return Array.from({ length: steps }, (_, i) => r + shape[i]);
});
// The harp running up the chord at the top: root, third, fifth, octave,
// tenth, twelfth.
const running = (chords, low = 43) => comp(chords, (c, steps) => {
  const r = from(c.root, low);
  const shape = [0, c.third, 7, 12, 12 + c.third, 19];
  return Array.from({ length: steps }, (_, i) => r + shape[i]);
});

// A tune moved down a third inside G major; notes outside the key go down
// a minor third.
const G_MAJOR = [7, 9, 11, 0, 2, 4, 6];
const thirdBelow = (line) => line.map((n) => {
  if (typeof n !== 'number') return n;
  const i = G_MAJOR.indexOf(n % 12);
  if (i < 0) return n - 3;
  const target = G_MAJOR[(i + 5) % 7];
  let m = n - 1;
  while (m % 12 !== target) m--;
  return m;
});

// --- bottom: the music box, D D D G, and no further. ---
const BOTTOM_CHORDS = 'G G C G Em D';
const CRAWL = tune('. . . . . . | D6 - - D6 - - | D6 - - G6 - - | - - - - - - |');

// --- rope: the cuts slowed to a walk, a step higher every phrase. ---
const ROPE_CHORDS = 'G G C D Em Em Am D Bm G Em A C D G G';
const CLIMB = tune(`
  D5 - - D5 - - | D5 - - G5 - A5 | B5 - - A5 - G5 | A5 - - - - - |
  E5 - - E5 - - | E5 - - A5 - B5 | C6 - - B5 - A5 | B5 - - A5 - - |
  F#5 - - F#5 - - | F#5 - - B5 - C#6 | D6 - - C#6 - B5 | A5 - - - - - |
  G5 - - G5 - - | G5 - - D6 - E6 | D6 - - B5 - G5 | G5 - - - - - |
`);

// --- three: the jig at a walk, then her motif and his cuts answering. ---
const THREE_CHORDS = 'G G C D7 G Em C,D G G C,G G Em G C D G';
const JIG = tune(`
  D5 D5 D5 G5 - A5 | B5 - G5 D5 - B4 | E5 E5 E5 A5 - B5 | C6 - A5 F#5 - D5 |
  D5 D5 D5 G5 - A5 | B5 - G5 E5 - G5 | C6 - B5 A5 - F#5 | G5 - - - - - |
`);
// Ves's motif, as the chapter three credits sang it (in G).
const HERS = tune('D5 D5 B5 - - - | C6 - A5 B5 - - |');
const HIS_ANSWER = tune('D5 D5 D5 G5 - A5 | B5 - - - - - |');
// Together: his tick leaping a sixth to show off, her line a third below.
const TOGETHER = tune('D6 D6 D6 B5 - A5 | G5 - E5 C6 - B5 | A5 - F#5 D5 E5 F#5 | G5 - - - - - |');

// --- hall: E minor, three cuts and no tick. ---
const HALL_CHORDS = 'Em C Am B7 Em C Cm D';
const NO_TICK = tune('B4 - - B4 - - | B4 - - A4 - G4 | A4 - - A4 - - | A4 - - G4 - F#4 |');
// The chapter's first cell, minor (FIRST_STEPS_MINOR: down a fourth, home,
// up a minor third, down a step), on E.
const CELL_MINOR = tune('B3 - - E4 - - | G4 - - F#4 - - |');
const ACHE = tune('G5 - - F#5 - E5 | E5 - - - - - | Eb5 - - D5 - C5 | D5 - - D5 D5 D5 |');

// --- lift: the cuts up a step every bar, the tick on the chord's root. ---
const LIFT_CHORDS = 'C D Em F G Ab Bb E7';
const LIFT = tune(`
  G4 G4 G4 C5 - - | A4 A4 A4 D5 - - | B4 B4 B4 E5 - - | C5 C5 C5 F5 - - |
  D5 D5 D5 G5 - - | Eb5 Eb5 Eb5 Ab5 - - | F5 F5 F5 Bb5 - - | E5 - G#5 B5 - D6 |
`);

// --- top: the jig's tune broad and singing, a step up in A. ---
const TOP_CHORDS = 'A A D E7 A F#m D,E A A D A E D F#m D,E A';
const SINGING = tune(`
  E5 E5 E5 A5 - B5 | C#6 - A5 E5 - C#5 | F#5 F#5 F#5 B5 - C#6 | D6 - B5 G#5 - E5 |
  E5 E5 E5 A5 - B5 | C#6 - A5 F#5 - A5 | D6 - C#6 B5 - G#5 | A5 - - C#5 D5 D#5 |
  E5 E5 E5 C#6 - B5 | A5 - F#5 D5 - F#5 | E5 - C#5 A4 - C#5 | B4 - E5 G#5 - B5 |
  F#5 F#5 F#5 D6 - C#6 | A5 - F#5 C#5 - F#5 | A5 - G#5 E5 F#5 G#5 | A5 - - - - - |
`);
// The chapter's first cell in A (E A C# B), low on the horns, slow.
const CELL = tune('E3 - - - - - | A3 - - - - - | C#4 - - - - - | B3 - - - - - |');
// Her motif, in A, on the music box.
const HERS_TOP = tune('E6 E6 C#7 - - - | D7 - B6 C#7 - - |');

// --- home: G again, his motif alone, hers once more. ---
const HOME_CHORDS = 'G C G D G Em C,D G';
const HOME_WHISTLE = tune(`
  D5 D5 D5 G5 - A5 | B5 - - - - - | . . . . . . | D5 D5 D5 B5 - A5 |
  G5 - - - - - | . . . . . . | . . . . . . | . . . . . . |
`);
const HOME_FIDDLE = tune(`
  . . . . . . | . . . . . . | D5 D5 B5 - - - | . . . . . . |
  . . . . . . | C5 - A4 B4 - - | - - - - - - | . . . . . . |
`);
// The last chord: G with its ninth, rolled up from the bottom.
const LAST_ROLL = [...rest(7), ...['G2', 'D3', 'G3', 'A3', 'B3', 'D4'].map(midi)];

export const CREDITS_FIRST_THEME = {
  title: 'Three Cuts and a Climb',
  bpm: 66,
  stepsPerBeat: 3,
  // Plays once, then the credits end.
  loop: false,
  // Level with the other chapters' credits.
  volume: 0.8,

  instruments: {
    // His instruments: the tin whistle (a recorder) and the fiddle.
    whistle: { sample: 'recorder', volume: 0.24, attack: 0.04, release: 0.4, reverb: 0.5, pan: -0.2, humanize: { time: 0.01, volume: 0.1 } },
    whistleLow: { sample: 'recorder', volume: 0.15, attack: 0.04, release: 0.4, reverb: 0.5, pan: -0.3, humanize: { time: 0.01, volume: 0.1 } },
    fiddle: { sample: 'soloViolin', volume: 0.32, attack: 0.07, release: 0.6, reverb: 0.5, pan: 0.15, humanize: { time: 0.012, volume: 0.1 } },
    fiddleLow: { sample: 'soloViolin', volume: 0.22, attack: 0.07, release: 0.6, reverb: 0.5, pan: 0.25, humanize: { time: 0.012, volume: 0.1 } },
    // The top: the violins and a flute singing the jig, broad.
    violins: { sample: 'violins', volume: 0.3, attack: 0.08, release: 0.7, reverb: 0.55, pan: -0.25, humanize: { time: 0.008, volume: 0.08 } },
    flute: { sample: 'flute', volume: 0.18, attack: 0.08, release: 0.6, reverb: 0.55, pan: 0.25, humanize: { time: 0.01, volume: 0.1 } },
    // A music box (the glockenspiel, with an echo), and his jar of treasure.
    musicBox: { sample: 'glock', volume: 0.14, ring: true, reverb: 0.6, pan: 0.3, echo: { time: 0.6, feedback: 0.35, mix: 0.3 } },
    glock: { sample: 'glock', volume: 0.07, ring: true, reverb: 0.5, pan: 0.4 },
    glass: { sample: 'glass', volume: 0.07, attack: 1.2, release: 2, reverb: 0.8, pan: -0.3 },
    // The harp, rocking and then running.
    harp: { sample: 'harp', volume: 0.18, ring: true, reverb: 0.55, pan: -0.25, humanize: { time: 0.012, volume: 0.2 } },
    // The plucked oom-cha.
    oom: { sample: 'cellosPizz', volume: 0.2, ring: true, reverb: 0.35, pan: -0.1, humanize: { time: 0.006, volume: 0.12 } },
    cha: { sample: 'violinsPizz', volume: 0.13, ring: true, reverb: 0.35, pan: 0.3, humanize: { time: 0.006, volume: 0.2 } },
    chaHi: { sample: 'violinsPizz', volume: 0.11, ring: true, reverb: 0.35, pan: 0.35, humanize: { time: 0.006, volume: 0.2 } },
    // Strings underneath.
    violas: { sample: 'violas', volume: 0.13, attack: 0.6, release: 1.2, reverb: 0.6, pan: 0.2 },
    cellos: { sample: 'cellos', volume: 0.2, attack: 0.2, release: 0.9, reverb: 0.5, pan: 0.25, humanize: { time: 0.012, volume: 0.1 } },
    drone: { sample: 'cellos', volume: 0.13, attack: 1.4, release: 2, reverb: 0.55, pan: 0.1 },
    tremolo: { sample: 'violinsTrem', volume: 0.09, attack: 0.8, release: 1, reverb: 0.6, pan: -0.2 },
    choir: { sample: 'choir', volume: 0.07, attack: 1.2, release: 1.6, reverb: 0.7 },
    // Brass, soft and behind.
    horns: { sample: 'hornsSoft', volume: 0.3, attack: 0.25, release: 0.9, reverb: 0.55, pan: -0.1 },
    hornsLow: { sample: 'hornsSoft', volume: 0.2, attack: 0.3, release: 0.9, reverb: 0.55, pan: -0.15 },
    // Drums: a frame drum pulling hand over hand, timpani, and the hatchet.
    bodhran: { sample: 'frameDrum', drum: 'sample', volume: 0.16, ring: true, reverb: 0.3, pan: -0.05, humanize: { time: 0.005, volume: 0.15 } },
    timpani: { sample: 'timpani', volume: 0.3, ring: true, reverb: 0.45 },
    roll: { sample: 'timpaniRoll', volume: 0.22, release: 0.3, reverb: 0.45 },
    swell: { sample: 'cymbalSwell', volume: 0.22, release: 0.04, reverb: 0.4 },
    chop: { sample: 'tom', drum: 'sample', volume: 0.22, ring: true, reverb: 0.35, humanize: { time: 0.004, volume: 0.15 } },
    tick: { sample: 'tenorDrumHigh', drum: 'sample', volume: 0.24, ring: true, reverb: 0.35, pan: 0.15 },
  },

  sections: {
    // The bottom of the hole: a low G, the harp rocking, the music box
    // trying his motif slowly; chop chop chop, and no tick.
    bottom: section(6, {
      harp: rocking(BOTTOM_CHORDS),
      drone: [...hold(midi('G2'), 5 * BAR), ...hold(midi('D2'), BAR)],
      musicBox: CRAWL,
      glass: [...rest(1), ...hold(midi('D5'), 4 * BAR)],
      chop: [...rest(4), ...loop('x.x.x.', 1)],
    }),

    // The climb: the cuts slowed to a walk, a step higher each phrase.
    rope: section(16, {
      fiddle: CLIMB,
      harp: rocking(ROPE_CHORDS),
      oom: oom(ROPE_CHORDS),
      cha: [...rest(4), ...cha(ROPE_CHORDS.split(' ').slice(4).join(' '), 0)],
      // Hand over hand: a soft drum on each pull, from the second phrase.
      bodhran: [...rest(4), ...loop('x..x..', 12)],
      violas: [...rest(4), ...thirds(ROPE_CHORDS.split(' ').slice(4).join(' '), 55)],
      // The whistle joins an octave down for the last two phrases.
      whistleLow: [...rest(8), ...transpose(CLIMB.slice(8 * BAR), -12)],
      cellos: [...rest(12), ...roots('C D G G', 36)],
      horns: [...rest(12), ...fifths('C D', 50)],
    }),

    // The three of them: his jig at a walk, her motif and his answer, then
    // both together.
    three: section(16, {
      whistle: [...JIG, ...rest(2), ...HIS_ANSWER, ...thirdBelow(TOGETHER)],
      fiddle: [...rest(8), ...HERS, ...rest(2), ...TOGETHER],
      oom: oom(THREE_CHORDS),
      cha: cha(THREE_CHORDS, 0),
      chaHi: cha(THREE_CHORDS, 1),
      bodhran: loop('x..x..', 16),
      harp: [...rest(8), ...rocking(THREE_CHORDS.split(' ').slice(8).join(' '))],
      // His jar of treasure glinting over the jig's second half.
      glock: [...rest(4), ...transpose(JIG.slice(4 * BAR, 7 * BAR), 12)],
      violas: [...rest(12), ...thirds('G C D G', 55)],
    }),

    // The hall: E minor, three cuts and no tick; the chapter's cell, minor,
    // on the cellos; C minor for the ache; then the cuts come back.
    hall: section(8, {
      whistle: [...NO_TICK],
      fiddle: [...rest(4), ...ACHE],
      cellos: [...rest(4), ...CELL_MINOR],
      drone: roots(HALL_CHORDS, 36),
      harp: rocking(HALL_CHORDS),
      violas: [...rest(4), ...thirds('Em C Cm D', 55)],
      tremolo: [...rest(6), ...hold(midi('G4'), BAR), ...hold(midi('F#4'), BAR)],
    }),

    // The lift: the cuts climbing a step a bar, into A.
    lift: section(8, {
      violins: LIFT,
      flute: [...rest(4), ...transpose(LIFT.slice(4 * BAR), 12)],
      oom: oom(LIFT_CHORDS),
      cellos: roots(LIFT_CHORDS, 36),
      horns: thirds(LIFT_CHORDS, 52),
      hornsLow: fifths(LIFT_CHORDS, 45),
      bodhran: [...loop('x..x..', 4), ...loop('x.xx.x', 4)],
      // The timpani rolling on E, the way into A.
      roll: [...rest(4), ...hold(midi('E2'), 4 * BAR)],
      // The cymbal swell peaks 3.18s in: 11 steps, so it lands on the top's
      // first downbeat.
      swell: [...rest(8).slice(11), ...hold(60, 11)],
      timpani: [...rest(7), ...one(midi('E2'), 3, 0), ...one(midi('E2'), 3, 0)],
    }),

    // The top, in the daylight: the jig singing; the chapter's cell on the
    // horns; her motif on the music box.
    top: section(16, {
      violins: SINGING,
      flute: [...rest(8), ...SINGING.slice(8 * BAR)],
      fiddleLow: transpose(thirdBelow(transpose(SINGING, -2)), 2),
      horns: [...CELL, ...roots('A F#m D,E A', 45), ...CELL, ...roots('D F#m D,E A', 45)],
      hornsLow: roots(TOP_CHORDS, 45),
      cellos: roots(TOP_CHORDS, 36),
      violas: thirds(TOP_CHORDS, 56),
      oom: oom(TOP_CHORDS),
      cha: cha(TOP_CHORDS, 0),
      chaHi: cha(TOP_CHORDS, 1),
      harp: running(TOP_CHORDS),
      musicBox: [...rest(8), ...HERS_TOP],
      choir: [...rest(8), ...roots(TOP_CHORDS.split(' ').slice(8).join(' '), 57)],
      bodhran: loop('x..x..', 16),
      timpani: [...one(midi('A2'), 4 * BAR), ...one(midi('A2'), 4 * BAR), ...one(midi('A2'), 4 * BAR), ...one(midi('E2'), 3 * BAR), ...one(midi('A2'), BAR)],
    }),

    // Home: G again. His motif alone on the whistle, hers once more on the
    // fiddle; a G with its ninth; chop chop chop, TICK.
    home: section(8, {
      whistle: HOME_WHISTLE,
      fiddle: HOME_FIDDLE,
      harp: [...rocking(HOME_CHORDS.split(' ').slice(0, 7).join(' ')), ...LAST_ROLL.slice(7 * BAR)],
      oom: [...oom(HOME_CHORDS.split(' ').slice(0, 4).join(' ')), ...rest(4)],
      drone: [...roots(HOME_CHORDS.split(' ').slice(0, 7).join(' '), 36), ...hold(midi('G2'), BAR)],
      violas: [...rest(4), ...thirds('G Em C,D', 55), ...hold(midi('B4'), BAR)],
      glass: [...rest(7), ...hold(midi('A5'), BAR)],
      musicBox: [...rest(7), ...tune('D6 . . G6 . .')],
      chop: [...rest(6), ...loop('x.x.x.', 1)],
      tick: [...rest(7), ...hits('x.....')],
    }),
  },

  order: ['bottom', 'rope', 'three', 'hall', 'lift', 'top', 'home'],
};
