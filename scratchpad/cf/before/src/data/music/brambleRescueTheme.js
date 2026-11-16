import { melody, transpose, hits, HOLD, REST } from '../../audio/notation.js';
import { SAMPLE_SETS } from '../../audio/sampleSets.js';
import { midi } from './parts/usurper.js';
import { BRAMBLE_MOTIF, BRAMBLE_THEME } from './brambleTheme.js';

// "REALLY Should've Minded the Camp": the very end of Chapter 4 (scene
// `bramble_and_the_log`). The throne hall is
// coming down, the hero and Ves are holding the doorway with a beam and an
// umbrella, and it isn't holding. The hero blows Bramble's whistle. A
// rumble, a whoop, and Bramble comes charging down a tunnel on a huge log,
// hatchet up, "HOLD ON, SWORD! I'M COMIIIIING!", hits a bump, flies off,
// lands flat on his face with a SQUISH, and the log rolls on without him and
// jams the crack perfectly. He takes all the credit. The song starts after
// his "...Meant to do that."
//
// A MIX: its own heroic gallop (below) taking turns with Bramble's own jig,
// "Didn't Mind the Camp" (the jig sections, at the end of this file). The
// gallop is a heroic, bouncy gallop for a full orchestra, the
// sort of tune a ten-year-old thinks is playing in his head when he charges
// in. It has its own hook (below), a climbing second tune, a tense "ride"
// that builds up to the fall, the SQUISH gag, and then the big drop: the
// whole band comes back a step higher with the hook blared by the brass.
// After that comes a warm slow verse (the proud moment, the hook
// sung long by the horns and strings over a harp) and a last triumphant
// run-through that ends on a huge held chord. Everything is real recordings
// (VSCO 2 and VCSL, sampleSets.js); no synth presets. Style reference: the
// "Nobody Came" trailer's shape (build, one beat of dead silence, drop), the
// bounce of Toby Fox's silly-heroic fanfares, and Koji Kondo's love of a
// tune you can sing after one go.
//
// THE HOOK (in C, six eighth-notes to a bar, the dashes being held notes):
//     G G G  C - E | D - - C - D | E E E  A - G | E - - - - .
//     G G G  C - E | G - - F - E | D D D  G - F | E - D C - -
// Bramble's motif, "three cuts and a tick" (BRAMBLE_MOTIF: three
// repeated notes, then a leap up a fourth), opens every phrase, but it does
// not stop at the tick: the tick goes on up a third and steps back down
// (G C E D), which is the chapter's own four-note tune from the Sunnyside
// songs (up a fourth, up a third, down a step: sunnyBattleTheme.js, the
// "first cell"). So the hook is "three cuts, a tick, and the chapter's
// tune"; the second line walks the cuts up a step each time (E E E to A, then
// D D D to G) like a boy running faster and faster. In the second tune the
// cuts climb a step every bar (G, A, B, C, then bounce up through flat
// sixths and sevenths, the heroic borrowed chords).
//
// THE SQUISH: a run up (he's airborne), a tumble down, and everything
// stops dead on one BONK (a deep drum, a tom, the low strings and the tuba
// all at once). A bar of silence. Then the tin whistle, alone and small:
// three cuts and a tick ("...meant to do that"), the hatchet's chop chop
// chop TICK to count everyone back in, a drum roll, and the band comes back
// a whole step higher (D major) as THE DROP.
//
// C major, then D major for the drop and back down to C (D to C is the
// brave "flat seventh" step, the Mario-style lift) for the warm part and
// the finish. 6/8 at 126 dotted quarters a minute, one step a 16th, so a bar
// is 12 steps (0.95s). The gallop runs about 1m18s, then his jig takes a
// turn, about 2m19s in all, and the whole run goes round again from the
// charge (the order below, loopFrom 0), squish and all. Times below are
// from the very start:
//
//   intro     4 bars  0:00  the rumble (timpani rolling, a big drum getting
//                           nearer), the motif far off on the horns, nearer
//                           on the trumpets, and a whoop up the violins
//   A         8 bars  0:04  THE HOOK, bright and light: fiddle and tin whistle,
//                           glockenspiel on the second half, plucked oom-cha
//   A2        8 bars  0:11  the hook with the band: trumpets and violins, the
//                           strings galloping up and down under it, flute
//   B         8 bars  0:19  the climbing tune: the cuts go up a step each
//                           bar, then the heroic flat chords (A flat, B flat)
//   ride      8 bars  0:27  A MINOR, the tense gallop down the tunnel: the
//                           motif low and growling, timpani and snare rolling
//                           and the strings thickening; no brass shouting
//   squish    6 bars  0:34  a run up, a tumble down, BONK (1.9s in), a bar of
//                           nothing, the whistle alone (three cuts and a
//                           tick), chop chop chop TICK, a roll and an A major
//                           arpeggio on the brass, then ONE BEAT of dead
//                           silence
//   up       16 bars  0:40  THE DROP, D MAJOR: gong, bass drum, cymbals; the
//                           hook shouted by trumpets and violins, cellos an
//                           octave under, trombones two octaves under, horns
//                           punching the chords; then the same again with the
//                           flute, fiddle, glockenspiel and piccolo on top
//   upB       8 bars  0:55  the climbing tune in D, the whole band
//   warm      8 bars  1:03  C MAJOR, soft: the hook told slow, long notes on
//                           cellos and horns, with the strings over and a
//                           harp rocking
//   finale    8 bars  1:10  HOME: the hook once more with everyone and the
//                           piccolo and glockenspiel on top, ending on a big
//                           held C that rings out under the last card
//   jigA..    4 parts 1:18  his own jig, "Didn't Mind the Camp" (jigA, jigA2,
//                           jigB, jigA3, built at the end of this file), with
//                           the rescue's trumpets and timpani on top

// One step is a 16th: a bar of 6/8 is 12 of them.
const BAR = 12;
const jig = (text) => melody(text, 2);     // each token an 8th: six to a bar
const r16 = (text) => melody(text, 1);
const rest = (bars) => Array(bars * BAR).fill(REST);
const at = (bars, track) => [...rest(bars), ...track];
const loop = (pattern, bars) => Array.from({ length: bars }, () => hits(pattern)).flat();
const held = (name, steps) => [typeof name === 'number' ? name : midi(name), ...Array(steps - 1).fill(HOLD)];
const barsOf = (track, from, to) => track.slice(from * BAR, to * BAR);
const onBars = (bars, list, pattern) => Array.from({ length: bars }, (_, i) => (list.includes(i) ? hits(pattern) : rest(1))).flat();
const R = REST;
const H = HOLD;

function section(bars, tracks) {
  return Object.fromEntries(Object.entries(tracks).map(([name, steps]) => {
    if (steps.length > bars * BAR) throw new Error(`REALLY Should've Minded the Camp: '${name}' is ${steps.length} steps, longer than ${bars} bars`);
    return [name, [...steps, ...Array(bars * BAR - steps.length).fill(REST)]];
  }));
}

// --- Chords, a bar each ('C,D' is two in a bar). Patterns name chord
// tones: R root, T third, F fifth, S seventh (the octave on a triad), '+'
// an octave up, '-' one down. ---
const QUALITY = { '': [0, 4, 7, 12], m: [0, 3, 7, 12], 7: [0, 4, 7, 10] };
function chordOf(symbol) {
  const m = symbol.match(/^([A-G][#b]?)(m|7)?$/);
  if (!m) throw new Error(`REALLY Should've Minded the Camp: can't read the chord '${symbol}'`);
  return { root: midi(`${m[1]}4`) % 12, tones: QUALITY[m[2] ?? ''] };
}
const inBand = (pc, low) => low + ((pc - (low % 12) + 12) % 12);
function comp(chords, pattern, low) {
  return chords.split(/\s+/).filter(Boolean).flatMap((bar) => {
    const parts = bar.split(',');
    const each = BAR / parts.length;
    return parts.flatMap((symbol, i) => {
      const chord = chordOf(symbol);
      const slice = pattern.slice(i * each, (i + 1) * each);
      if (i > 0 && slice[0] === H) slice[0] = pattern[0];
      return slice.map((p) => {
        if (p === R || p === H) return p;
        const shift = p.endsWith('+') ? 12 : p.endsWith('-') ? -12 : 0;
        return inBand(chord.root, low) + chord.tones['RTFS'.indexOf(p[0])] + shift;
      });
    });
  });
}
const holdBar = (p) => [p, ...Array(BAR - 1).fill(H)];
const NAMES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const moveChords = (chords, by) => chords.replace(/([A-G][#b]?)(m|7)?/g, (_, root, q = '') => `${NAMES[(midi(`${root}4`) + by) % 12]}${q}`);

// The band, a bar per chord.
const OOM = ['R', R, R, R, R, R, 'F-', R, R, R, R, R];
const CHA = [R, R, R, R, 'T', R, R, R, R, R, 'F', R];
const GALLOP = ['R', R, 'T', R, 'F', R, 'R+', R, 'F', R, 'T', R];
const PUNCH = ['R', H, H, R, R, R, 'R', H, H, R, R, R];


// THE HOOK is his own jig from "Didn't Mind the Camp" (brambleTheme.js, the
// first eight bars of A), moved from G down to C.
const HOOK = jig(`
  G4 G4 G4 C5 - D5 | E5 - C5 G4 - E4 | A4 A4 A4 D5 - E5 | F5 - D5 B4 - G4 |
  G4 G4 G4 C5 - D5 | E5 - C5 A4 - C5 | F5 - E5 D5 - B4 | C5 - - - - - |
`);
const HOOK_CH = 'C C F G7 C Am F,G C';
// The motif is his: three repeats then up a fourth.
if (BRAMBLE_MOTIF[0] !== BRAMBLE_MOTIF[2] || BRAMBLE_MOTIF[6] - BRAMBLE_MOTIF[0] !== 5) throw new Error("REALLY Should've Minded the Camp: his motif has changed");

// The second tune is his jig's second strain (B in brambleTheme.js, with
// its flat seventh), moved from G down to C.
const CLIMB = jig(`
  C5 C5 C5 G5 - E5 | F5 - D5 Bb4 - D5 | C5 - A4 F4 - A4 | B4 - D5 G5 - F5 |
  E5 - C5 A4 - C5 | D5 - C5 A4 - F4 | G4 - B4 D5 - F5 | E5 - C5 G4 - - |
`);
const CLIMB_CH = 'C Bb F G7 Am F G7 C';
const UP_CLIMB_CH = moveChords(CLIMB_CH, 2);

// The ride: A minor, the cuts low and tense.
const RIDE = jig(`
  E4 E4 E4 A4 - - | E4 E4 E4 A4 - C5 | C4 C4 C4 F4 - - | C4 C4 C4 F4 - A4 |
  E5 E5 E5 A5 - C6 | E6 - D6 - C6 - | D6 D6 D6 G6 - - | G#5 - B5 - E6 - |
`);
const RIDE_CH = 'Am Am F F Am Am G E';

// The slow telling: the first half of his jig, each note twice as long.
const SLOW = melody(`
  G4 G4 G4 C5 - D5 | E5 - C5 G4 - E4 | A4 A4 A4 D5 - E5 | F5 - D5 B4 - G4
`, 4);
const SLOW_CH = 'C C C C F F G7 G7';

// --- THE SQUISH. ---
const FLY = r16('G4 A4 B4 C5 D5 E5 F#5 G5 A5 B5 C6 D6');
const TUMBLE = r16('D6 C#6 C6 B5 Bb5 A5 G#5 G5 F#5 F5 E5 Eb5');
const SHEEPISH = jig('G4 G4 G4 C5 - -');

// --- Drums, one bar. ---
const BODHRAN = 'x.....x.....';
const GHOST = '..x.x...x.x.';
const SNARE = '......x...x.';
const SNARE_GALLOP = 'x..x.xx..x.x';
const CLAPS = '......x.....';
const KICK = 'x.....x.....';
const ONE = 'x...........';
const CHUG = ['R', R, 'R', R, 'R', R, 'R', R, 'R', R, 'R', R];
const TIMP = ['R', R, R, 'R', R, R, 'F-', R, R, 'F-', R, R];

const UP_HOOK = transpose(HOOK, 2);
const UP_CLIMB = transpose(CLIMB, 2);
const UP_CH = moveChords(HOOK_CH, 2);
const UP_CH16 = `${UP_CH} ${UP_CH}`;
const twice = (track) => [...track, ...track];
// The last bar of a section's accompaniment held out on one note.
const finish = (track, note) => [...track.slice(0, track.length - BAR), ...held(note, BAR)];

const song = {
  title: "REALLY Should've Minded the Camp",
  bpm: 126,
  stepsPerBeat: 6,
  volume: 1.15,

  instruments: {
    // His own band, from "Didn't Mind the Camp".
    fiddle: { sample: 'soloViolin', volume: 0.6, attack: 0.01, release: 0.14, reverb: 0.3, pan: 0.15, humanize: { time: 0.005, volume: 0.12 } },
    fiddleLow: { sample: 'soloViolin', volume: 0.32, attack: 0.01, release: 0.14, reverb: 0.3, pan: 0.25, humanize: { time: 0.005, volume: 0.12 } },
    whistle: { sample: 'recorder', volume: 0.26, attack: 0.02, release: 0.12, reverb: 0.3, pan: -0.2, humanize: { time: 0.005, volume: 0.1 } },
    lonely: { sample: 'recorder', volume: 0.2, attack: 0.02, release: 0.3, reverb: 0.6, pan: -0.1 },
    oom: { sample: 'cellosPizz', volume: 0.3, ring: true, reverb: 0.25, pan: -0.1, humanize: { time: 0.004, volume: 0.12 } },
    cha: { sample: 'violinsPizz', volume: 0.22, ring: true, reverb: 0.25, pan: 0.3, humanize: { time: 0.004, volume: 0.2 } },
    bodhran: { sample: 'frameDrum', drum: 'sample', volume: 0.26, ring: true, reverb: 0.2, humanize: { time: 0.004, volume: 0.12 } },
    ghost: { sample: 'frameDrum', drum: 'sample', volume: 0.1, ring: true, reverb: 0.2, humanize: { time: 0.006, volume: 0.3 } },
    claps: { sample: 'claps', drum: 'sample', volume: 0.3, ring: true, reverb: 0.3, pan: 0.1, humanize: { time: 0.006, volume: 0.25 } },
    chop: { sample: 'tom', drum: 'sample', volume: 0.4, ring: true, reverb: 0.25, humanize: { time: 0.004, volume: 0.15 } },
    tick: { sample: 'tenorDrumHigh', drum: 'sample', volume: 0.4, ring: true, reverb: 0.25, pan: 0.15 },
    glock: { sample: 'glock', volume: 0.09, ring: true, reverb: 0.45, pan: 0.4 },
    // The orchestra piling in.
    violins: { sample: 'violins', volume: 0.3, attack: 0.02, release: 0.2, reverb: 0.35, pan: 0.25 },
    gallop: { sample: 'violinsSpic', volume: 0.22, release: 0.05, reverb: 0.25, pan: 0.3, humanize: { time: 0.004, volume: 0.15 } },
    violas: { sample: 'violas', volume: 0.22, attack: 0.05, release: 0.3, reverb: 0.35, pan: -0.1 },
    cellos: { sample: 'cellos', volume: 0.26, attack: 0.03, release: 0.3, reverb: 0.3, pan: -0.25 },
    basses: { sample: 'bassSpic', volume: 0.36, release: 0.06, reverb: 0.15, humanize: { time: 0.004, volume: 0.12 } },
    flute: { sample: 'flute', volume: 0.26, attack: 0.02, release: 0.15, reverb: 0.35, pan: 0.3 },
    piccolo: { sample: 'piccolo', volume: 0.1, attack: 0.01, release: 0.12, reverb: 0.35, pan: 0.35 },
    oboe: { sample: 'oboe', volume: 0.28, attack: 0.02, release: 0.15, reverb: 0.3, pan: 0.15 },
    clarinet: { sample: 'clarinet', volume: 0.26, attack: 0.02, release: 0.15, reverb: 0.3, pan: -0.15 },
    trumpets: { sample: 'trumpet', volume: 0.34, release: 0.15, reverb: 0.35, pan: 0.1, humanize: { time: 0.005, volume: 0.08 } },
    horns: { sample: 'horns', volume: 0.36, release: 0.2, reverb: 0.4, pan: -0.1, humanize: { time: 0.005, volume: 0.08 } },
    trombones: { sample: 'trombone', volume: 0.34, release: 0.2, reverb: 0.32, pan: -0.15 },
    tuba: { sample: 'tuba', volume: 0.36, attack: 0.01, release: 0.15, reverb: 0.22, humanize: { time: 0.005, volume: 0.1 } },
    // The same brass, louder, for the drop and the finish.
    trumpetsBig: { sample: 'trumpet', volume: 0.62, release: 0.15, reverb: 0.35, pan: 0.1, humanize: { time: 0.005, volume: 0.08 } },
    hornsBig: { sample: 'horns', volume: 0.62, release: 0.2, reverb: 0.4, pan: -0.1, humanize: { time: 0.005, volume: 0.08 } },
    trombonesBig: { sample: 'trombone', volume: 0.58, release: 0.2, reverb: 0.32, pan: -0.15 },
    tubaBig: { sample: 'tuba', volume: 0.6, attack: 0.01, release: 0.15, reverb: 0.22, humanize: { time: 0.005, volume: 0.1 } },
    violinsBig: { sample: 'violins', volume: 0.5, attack: 0.02, release: 0.2, reverb: 0.35, pan: 0.25 },
    harp: { sample: 'harp', volume: 0.24, ring: true, reverb: 0.4, pan: -0.3 },
    // Drums.
    snare: { sample: 'snare', drum: 'sample', volume: 0.26, ring: true, reverb: 0.25, humanize: { time: 0.003, volume: 0.2 } },
    roll: { sample: 'snare', drum: 'sample', volume: 0.14, release: 0.08, reverb: 0.3, humanize: { time: 0.003, volume: 0.25 } },
    bassDrum: { sample: 'bassDrum', drum: 'sample', volume: 0.45, ring: true, reverb: 0.3 },
    bonk: { sample: 'bassDrumDeep', drum: 'sample', volume: 0.7, ring: true, reverb: 0.3 },
    crash: { sample: 'crash', drum: 'sample', volume: 0.3, ring: true, reverb: 0.3 },
    gong: { sample: 'gong', drum: 'sample', volume: 0.4, ring: true, reverb: 0.3 },
    // The ride's chugging strings and roll, held down so the drop stands well above them.
    rideBasses: { sample: 'bassSpic', volume: 0.28, release: 0.06, reverb: 0.15, humanize: { time: 0.004, volume: 0.12 } },
    rideCellos: { sample: 'cellosSpic', volume: 0.2, release: 0.06, reverb: 0.2, pan: -0.25, humanize: { time: 0.004, volume: 0.12 } },
    rideRoll: { sample: 'timpaniRoll', volume: 0.26, release: 0.3, reverb: 0.3 },
    timpani: { sample: 'timpani', volume: 0.5, ring: true, reverb: 0.3 },
    // Choked, so the beat of silence before the drop is really silent.
    timpBuild: { sample: 'timpani', volume: 0.5, release: 0.06, reverb: 0.2 },
    // The cellos singing the tune an octave under the trumpets.
    cellosBig: { sample: 'cellos', volume: 0.42, attack: 0.02, release: 0.2, reverb: 0.3, pan: -0.25 },
    timpRoll: { sample: 'timpaniRoll', volume: 0.4, release: 0.3, reverb: 0.3 },
  },

  sections: {
    // The rumble getting nearer; the motif far off on horns, then nearer on
    // the trumpets; a whoop up the violins.
    intro: section(4, {
      timpRoll: held('C2', 3 * BAR),
      bassDrum: hits('x........... ......x..... x.....x..... x..x..x..x..'),
      horns: jig('G3 G3 G3 C4 - - | . . . . . .'),
      trumpets: at(2, jig('G4 G4 G4 C5 - E5')),
      violins: at(3, r16('C4 D4 E4 F4 G4 A4 B4 C5 D5 E5 F5 G5')),
      roll: at(3, loop('x.x.x.xxxxxx', 1)),
      tuba: at(2, held('C2', BAR)),
      cellos: at(2, held('C3', BAR)),
    }),

    // THE HOOK, bright and light: fiddle and tin whistle.
    A: section(8, {
      crash: onBars(8, [0], ONE),
      fiddle: HOOK,
      whistle: HOOK,
      glock: at(4, barsOf(transpose(HOOK, 12), 4, 8)),
      oom: comp(HOOK_CH, OOM, 43),
      tuba: comp(HOOK_CH, OOM, 31),
      cha: comp(HOOK_CH, CHA, 55),
      bodhran: loop(BODHRAN, 8),
      ghost: loop(GHOST, 8),
      snare: at(4, loop(SNARE, 4)),
      claps: at(4, loop(CLAPS, 4)),
      bassDrum: loop(KICK, 8),
    }),

    // The hook with the band behind it.
    A2: section(8, {
      crash: onBars(8, [0, 4], ONE),
      trumpets: HOOK,
      violins: HOOK,
      fiddle: transpose(HOOK, 12),
      flute: comp(HOOK_CH, GALLOP, 67),
      gallop: comp(HOOK_CH, GALLOP, 55),
      horns: comp(HOOK_CH, holdBar('R'), 43),
      trombones: comp(HOOK_CH, PUNCH, 43),
      oom: comp(HOOK_CH, OOM, 43),
      tuba: comp(HOOK_CH, OOM, 31),
      basses: comp(HOOK_CH, OOM, 31),
      cha: comp(HOOK_CH, CHA, 55),
      timpani: comp(HOOK_CH, TIMP, 43),
      bodhran: loop(BODHRAN, 8),
      ghost: loop(GHOST, 8),
      snare: loop(SNARE_GALLOP, 8),
      claps: loop(CLAPS, 8),
      bassDrum: loop(KICK, 8),
    }),

    // The climbing tune.
    B: section(8, {
      crash: onBars(8, [0, 4], ONE),
      trumpets: CLIMB,
      fiddle: CLIMB,
      violins: CLIMB,
      flute: transpose(CLIMB, 12),
      clarinet: transpose(CLIMB, -12),
      gallop: comp(CLIMB_CH, GALLOP, 55),
      violas: comp(CLIMB_CH, holdBar('T'), 55),
      cellos: comp(CLIMB_CH, holdBar('R'), 43),
      oom: comp(CLIMB_CH, OOM, 43),
      tuba: comp(CLIMB_CH, OOM, 31),
      basses: comp(CLIMB_CH, OOM, 31),
      trombones: comp(CLIMB_CH, PUNCH, 43),
      timpani: comp(CLIMB_CH, TIMP, 43),
      bodhran: loop(BODHRAN, 8),
      snare: loop(SNARE_GALLOP, 8),
      claps: loop(CLAPS, 8),
      bassDrum: loop(KICK, 8),
    }),

    // The ride: A minor, tense, growing. No brass shouting yet.
    ride: section(8, {
      rideRoll: held('A1', 8 * BAR),
      rideBasses: comp(RIDE_CH, CHUG, 33),
      rideCellos: comp(RIDE_CH, CHUG, 45),
      horns: transpose(RIDE, -12),
      clarinet: RIDE,
      violins: at(4, barsOf(RIDE, 4, 8)),
      violas: at(2, comp(RIDE_CH, GALLOP, 57).slice(2 * BAR)),
      gallop: at(4, comp(RIDE_CH, GALLOP, 57).slice(4 * BAR)),
      trombones: at(6, transpose(barsOf(RIDE, 6, 8), -24)),
      roll: [...rest(2), ...loop('x.x.x.xxxxxx', 4), ...loop('xxxxxxxxxxxx', 2)],
      snare: at(2, loop(SNARE, 4)),
      bodhran: loop(BODHRAN, 8),
      bassDrum: at(4, loop(KICK, 4)),
      crash: onBars(8, [4], ONE),
    }),

    // THE SQUISH: up, down, BONK, nothing; the whistle alone, three cuts and
    // a tick; chop chop chop TICK; a roll on A, into D major.
    squish: section(6, {
      violins: [...FLY, ...TUMBLE],
      flute: [...transpose(FLY, 12), ...transpose(TUMBLE, 12)],
      cha: [...rest(1), ...TUMBLE],
      gallop: comp('C', GALLOP, 55),
      oom: [...comp('C G7', OOM, 43), ...held('C3', 1)],
      basses: [...rest(2), ...held('C1', 2)],
      tuba: [...rest(2), ...held('C1', 2)],
      cellos: [...rest(2), ...held('C2', 2)],
      bonk: [...rest(2), ...hits(ONE)],
      chop: [...rest(2), ...hits(ONE), ...rest(1), ...hits('x.x.x.......')],
      tick: at(4, hits('......x.....')),
      timpRoll: at(1, held('C2', BAR)),
      lonely: at(3, SHEEPISH),
      // The last bar: a roll and an A major arpeggio on the brass, then
      // ONE BEAT of dead silence (the back half of the bar) before the drop.
      roll: at(5, loop('x.x.x.......', 1)),
      timpBuild: at(5, r16('A2 . . A2 . . . . . . . .')),
      trumpets: at(5, r16('C#5 . E5 . A5 - . . . . . .')),
      horns: at(5, r16('A3 . A3 . A3 - . . . . . .')),
      trombones: at(5, r16('A2 . A2 . A2 - . . . . . .')),
    }),

    // THE DROP, D major: the hook shouted by the brass, then again with the
    // violins and flute an octave up on top.
    up: section(16, {
      bonk: onBars(16, [0], ONE),
      gong: onBars(16, [0, 8], ONE),
      crash: onBars(16, [0, 4, 8, 12], ONE),
      trumpetsBig: twice(UP_HOOK),
      hornsBig: comp(UP_CH16, PUNCH, 50),
      trombonesBig: twice(transpose(UP_HOOK, -24)),
      cellosBig: twice(transpose(UP_HOOK, -12)),
      violinsBig: twice(UP_HOOK),
      flute: twice(transpose(UP_HOOK, 12)),
      piccolo: at(8, transpose(UP_HOOK, 24)),
      fiddle: at(8, transpose(UP_HOOK, 12)),
      glock: at(8, transpose(UP_HOOK, 12)),
      gallop: comp(UP_CH16, GALLOP, 57),
      violas: comp(UP_CH16, GALLOP, 52),
      cellos: comp(UP_CH16, holdBar('R'), 45),
      oom: comp(UP_CH16, OOM, 45),
      tubaBig: comp(UP_CH16, OOM, 33),
      basses: comp(UP_CH16, OOM, 33),
      cha: comp(UP_CH16, CHA, 57),
      timpani: comp(UP_CH16, TIMP, 45),
      bodhran: loop(BODHRAN, 16),
      ghost: loop(GHOST, 16),
      snare: loop(SNARE_GALLOP, 16),
      claps: loop(CLAPS, 16),
      bassDrum: loop(KICK, 16),
    }),

    // The climbing tune in D with the whole band.
    upB: section(8, {
      crash: onBars(8, [0, 4], ONE),
      trumpetsBig: UP_CLIMB,
      hornsBig: comp(UP_CLIMB_CH, PUNCH, 50),
      violinsBig: UP_CLIMB,
      flute: transpose(UP_CLIMB, 12),
      fiddle: transpose(UP_CLIMB, 12),
      trombonesBig: transpose(UP_CLIMB, -24),
      cellosBig: transpose(UP_CLIMB, -12),
      gallop: comp(UP_CLIMB_CH, GALLOP, 57),
      violas: comp(UP_CLIMB_CH, GALLOP, 52),
      cellos: comp(UP_CLIMB_CH, holdBar('R'), 45),
      oom: comp(UP_CLIMB_CH, OOM, 45),
      tubaBig: comp(UP_CLIMB_CH, OOM, 33),
      basses: comp(UP_CLIMB_CH, OOM, 33),
      cha: comp(UP_CLIMB_CH, CHA, 57),
      timpani: comp(UP_CLIMB_CH, TIMP, 45),
      bodhran: loop(BODHRAN, 8),
      snare: loop(SNARE_GALLOP, 8),
      claps: loop(CLAPS, 8),
      bassDrum: loop(KICK, 8),
    }),

    // Warm: down a step to C, the hook told slowly.
    warm: section(8, {
      horns: transpose(SLOW, -24),
      violins: SLOW,
      violas: comp(SLOW_CH, holdBar('T'), 55),
      cellosBig: transpose(SLOW, -12),
      flute: at(4, transpose(barsOf(SLOW, 4, 8), 12)),
      harp: comp(SLOW_CH, GALLOP, 55),
      glock: at(2, r16('. . . . . . G6 . . . . .')),
      oboe: at(4, barsOf(SLOW, 4, 8)),
      basses: comp(SLOW_CH, holdBar('R'), 31),
      timpani: at(7, r16('G2 . . . . . . . . . . .')),
      roll: [...rest(6), ...loop('x.x.x.xxxxxx', 1), ...loop('xxxxxxxxxxxx', 1)],
    }),

    // HOME: the hook once more with everyone, ending on a big held C.
    finale: section(8, {
      crash: onBars(8, [0, 4, 7], ONE),
      trumpetsBig: HOOK,
      hornsBig: finish(comp(HOOK_CH, PUNCH, 50), 'C3'),
      violinsBig: HOOK,
      flute: transpose(HOOK, 12),
      piccolo: transpose(HOOK, 24),
      glock: transpose(HOOK, 12),
      fiddle: transpose(HOOK, 12),
      trombonesBig: finish(transpose(HOOK, -24), 'C3'),
      cellosBig: finish(transpose(HOOK, -12), 'C3'),
      gallop: comp(HOOK_CH, GALLOP, 55).slice(0, 7 * BAR),
      violas: comp(HOOK_CH, GALLOP, 50).slice(0, 7 * BAR),
      cellos: finish(comp(HOOK_CH, holdBar('R'), 43), 'C3'),
      oom: comp(HOOK_CH, OOM, 43).slice(0, 7 * BAR),
      tubaBig: finish(comp(HOOK_CH, OOM, 31), 'C2'),
      basses: finish(comp(HOOK_CH, OOM, 31), 'C2'),
      cha: comp(HOOK_CH, CHA, 55).slice(0, 7 * BAR),
      timpani: finish(comp(HOOK_CH, TIMP, 43), 'C2'),
      bodhran: loop(BODHRAN, 7),
      snare: loop(SNARE_GALLOP, 7),
      claps: loop(CLAPS, 7),
      bassDrum: [...loop(KICK, 7), ...hits(ONE)],
    }),
  },

  // The whole run in the order it was written, charge and squish and all,
  // then his own jig (jigA, jigA2, jigB, jigA3, below) to round it off.
  order: ['intro', 'A', 'A2', 'B', 'ride', 'squish', 'up', 'upB', 'warm', 'finale', 'jigA', 'jigA2', 'jigB', 'jigA3'],
  loopFrom: 0,
};

// --- His own jig, "Didn't Mind the Camp" (brambleTheme.js), in the round:
// the fiddle and whistle, the oom-cha, the bodhran, the claps, the same
// three cuts and a tick, with the rescue's trumpets and timpani on top. Its
// instruments are borrowed under 'jig_' names, so they keep their own sound.
const J = BRAMBLE_THEME;
for (const [name, instrument] of Object.entries(J.instruments)) song.instruments[`jig_${name}`] = instrument;
const jigOf = (name, extra) => ({
  ...Object.fromEntries(Object.entries(J.sections[name]).map(([track, steps]) => [`jig_${track}`, steps])),
  ...extra,
});
song.sections.jigA = jigOf('A', { trumpets: J.sections.A.fiddle, timpani: J.sections.A.oom });
song.sections.jigA2 = jigOf('A2', { violins: J.sections.A2.whistle, timpani: J.sections.A2.oom });
song.sections.jigB = jigOf('B', { trumpets: J.sections.B.fiddle, timpani: J.sections.B.oom });
song.sections.jigA3 = jigOf('A3', { trumpets: J.sections.A3.fiddle, timpani: J.sections.A3.oom });

// --- The hatchet's chop chop chop TICK, counting the climbing tune and the
// finale in (on parts of its own, so nothing already there is touched).
song.instruments.motifChop = { sample: 'tom', drum: 'sample', volume: 0.3, ring: true, reverb: 0.25, humanize: { time: 0.004, volume: 0.15 } };
song.instruments.motifTick = { sample: 'tenorDrumHigh', drum: 'sample', volume: 0.3, ring: true, reverb: 0.25, pan: 0.15 };
const barsIn = (name) => Object.values(song.sections[name])[0].length / BAR;
const hatchetOn = (name, bars, pattern) => Array.from({ length: barsIn(name) }, (_, i) => (bars.includes(i) ? hits(pattern) : rest(1))).flat();
// A sprinkle of the song's first tune (its old hook, before his jig took
// over): its opening phrase once in the second half of the drop, on the
// whistle, and once high on the glockenspiel in the finale.
const OLD_PHRASE = jig('G4 G4 G4 C5 - E5 | D5 - - C5 - D5');
const phraseAt = (name, bar, shift) => [...rest(bar), ...transpose(OLD_PHRASE, shift), ...rest(barsIn(name) - bar - 2)];
song.instruments.oldPhrase = { sample: 'recorder', volume: 0.2, attack: 0.02, release: 0.15, reverb: 0.4, pan: -0.25, humanize: { time: 0.005, volume: 0.1 } };
song.instruments.oldPhraseBell = { sample: 'glock', volume: 0.08, ring: true, reverb: 0.45, pan: 0.35 };
Object.assign(song.sections.up, { oldPhrase: phraseAt('up', 12, 2) });
const CHOP = 'x.x.x.......';
const TICK = '......x.....';
Object.assign(song.sections.B, { motifChop: hatchetOn('B', [0, 4], CHOP), motifTick: hatchetOn('B', [0, 4], TICK) });
Object.assign(song.sections.finale, {
  motifChop: hatchetOn('finale', [0, 4], CHOP),
  motifTick: hatchetOn('finale', [0, 4], TICK),
  oldPhraseBell: phraseAt('finale', 4, 24),
});

// Every recorded instrument kept within reach of its recordings. The player
// stretches a note from the nearest recording, so any note inside an
// instrument's whole span keeps its written pitch (even across a wide gap,
// like the horns' between C4 and D5). Only a note more than three semitones
// beyond the lowest or highest recording moves by octaves, to inside it.
// The doublers (glockenspiel, piccolo) just leave out a note they can't reach.
const DOUBLERS = ['glock', 'piccolo'];
const near = (n, notes, reach = 2) => notes.some((r) => Math.abs(r - n) <= reach);
// How many notes of each track had to move an octave (a check for the
// person writing the song: the tune should stay in one piece).
song.moved = {};
for (const [sectionName, tracks] of Object.entries(song.sections)) {
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
        if (near(s, notes, 3)) return s;
        dropped = true;
        return REST;
      }
      const low = Math.min(...notes) - 3;
      const high = Math.max(...notes) + 3;
      const fit = [s, s - 12, s + 12, s - 24, s + 24].find((n) => n >= low && n <= high) ?? s;
      if (fit !== s) song.moved[`${sectionName}.${name}`] = (song.moved[`${sectionName}.${name}`] ?? 0) + 1;
      return fit;
    });
  }
}

export const BRAMBLE_RESCUE_THEME = song;
