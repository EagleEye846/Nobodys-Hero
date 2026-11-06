import { melody, hits, repeat, sustained, transpose, haddockPhrase, tight, scatter } from './parts/chapter5.js';
import { SAMPLE_SETS } from '../../audio/sampleSets.js';

// "Shore Leave": the battle theme for Gullrest's fights, the happy beach of
// chapter 5 (bunting, deckchairs, gulls, sandcastles, an old walrus lightman
// ringing a bell at nothing). A pirate hornpipe for a sunny-day skirmish on
// the sand: the crew is ashore, the sun is out, and somebody has picked a
// fight with a gull. A fiddle takes a swaggering tune with a dotted kick in
// it ("da-di DUM DUM"), plucked strings chop on every off-beat like a
// squeezebox, a tuba stomps, a bodhran rattles, and every half of the tune
// ends on the hornpipe's three hammer blows (DUM, DUM, DUM) with the whole
// band. Bright and grinning, but it's still a fight: the home key is A
// mixolydian (A major with a G natural, the pirate's flat seventh), it
// takes a minor turn into F sharp minor for a low brass swagger with a
// nasty flat ninth in it, and it climbs to a chromatic run and stops dead
// before the breakdown. Not a lullaby and not a cartoon.
//
// It is deliberately unlike the coast's other fights: "Salt in the Wound"
// (Corrie's song) and "Cutlass Weather" (the ships' fights) are D minor,
// 6/8, dark and orchestral, with no claps and no afterbeats. This one is
// 4/4, A major-ish, small band, all afterbeats and claps. It is the seaside
// cousin of "Dandelion Lion Rag" (Sunnyside's fights): the same size of
// band and the same cheek, but salt in place of straw.
//
// THE COAST CELL (A D D E in D minor, 5 1 1 2; parts/chapter5.js) runs all
// through it, never in its home key:
//   - the tune's first bar is the cell in A, re-rhythmed as a dotted
//     hornpipe kick: E, A-A, B ("da-di DUM DUM"), then it leaps on up;
//   - the bass plays it UPSIDE DOWN on every chord (5 1 1 flat 7: in A,
//     E A A G), so the groove under the whole song is the cell inverted,
//     and the G natural it lands on is the mixolydian swagger;
//   - the B section's brass swagger opens with it in F sharp minor (C# F#
//     F# G#), low and slow;
//   - in the breakdown the ship's bell rings it in half notes.
// HADDOCK'S MOTIF (3 2 1, the low 5) rings once on the bell in the
// breakdown, in A major (C# B A, E): the old walrus at his bell, and then
// one more clang a moment later at nothing at all.
//
// A mixolydian, 4/4 at 138 BPM, one step a 16th: a bar is about 1.74
// seconds. The intro plays once (2 bars, 3.5s); then it loops from A, 56
// bars, about 1m37s:
//
//   intro   2 bars   3.5s  the bell twice, a stamp, the tuba on the upside-
//                          down cell; the fiddle runs up the scale into A
//   A      16 bars  27.8s  THE TUNE on the fiddle over pizzicato off-beats,
//                          the stomping cell bass and a bodhran; the second
//                          half answers it (F#m, D, E7) with a clarinet
//                          underneath; each half ends on three hammer blows
//   B      16 bars  27.8s  the minor turn, F sharp minor: the brass swagger
//                          on the cell (trombone, horns, clarinet) traded
//                          bar by bar with fiddle runs, a C#7 with a flat
//                          ninth; the band stabs and stops; then the fiddle
//                          soars over held horns, through G and G7, climbs
//                          chromatically on tremolo strings and a snare roll,
//                          and the band hits one E and stops dead (the bell
//                          answers, alone)
//   C       8 bars  13.9s  the breakdown: stamps and claps, the bass alone on
//                          the upside-down cell, the crew humming, the ship's
//                          bell on the cell, then Haddock's motif, then a
//                          clang at nothing; the oboe and clarinet sneak the
//                          tune back in like a squeezebox; a roll
//   A2     16 bars  27.8s  the tune with everything: fiddle, oboe and
//                          clarinet, horns and trombone on the guide notes,
//                          trumpets on the hammer blows, a piccolo gull on
//                          top, claps on 2 and 4; a pickup runs it home
//
// New ideas land at 0s (tune), 14s (answer), 28s (swagger), 42s (soar and
// climb), 56s (breakdown), 70s (all hands).

const BAR = 16;
const riff = (text) => melody(text, 1);   // each token a 16th
const steps = (text) => melody(text, 4);  // each token a quarter
const rest = (bars) => Array(bars * BAR).fill('.');
const up = (track, semitones) => transpose(track, semitones);
const fit = (name, section, bars) => tight('Shore Leave', name, section, bars, BAR);
// A track for bars `from` to `to` (counting from 0) of a longer one, silent elsewhere.
const only = (from, to, track) => track.map((n, i) => (i >= from * BAR && i < to * BAR ? n : '.'));
// A doubling that leaves out any note too far from one of its instrument's
// recordings (the piccolo only has a few).
const playable = (track, set) => track.map((n) => (
  typeof n === 'number' && SAMPLE_SETS[set].notes.every((r) => Math.abs(r - n) > 2) ? '.' : n));
const crashOn = (bars, ...at) => Array.from({ length: bars }, (_, i) => (at.includes(i) ? ['x', ...Array(BAR - 1).fill('.')] : Array(BAR).fill('.'))).flat();
// One pattern for chosen bars, another (or silence) elsewhere.
const barsOf = (bars, fn) => Array.from({ length: bars }, (_, i) => fn(i)).flat();

// --- Chords, written two to a bar (a half bar each). ---
const PITCH = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const KINDS = { '': [0, 4, 7], m: [0, 3, 7], 7: [0, 4, 7, 10] };
const chordOf = (symbol) => {
  const m = symbol.match(/^([A-G])([#b]?)(7|m)?$/);
  if (!m) throw new Error(`Shore Leave: can't read the chord '${symbol}'`);
  const pc = (PITCH[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + 12) % 12;
  return { pc, seventh: m[3] === '7', tones: KINDS[m[3] ?? ''].map((i) => (pc + i) % 12) };
};
const halves = (text) => text.split(/\s+/).filter((t) => t && t !== '|').map(chordOf);
// The lowest note of pitch class `pc` at or above `low`.
const from = (low, pc) => low + (((pc - low) % 12) + 12) % 12;
// The notes of A mixolydian (and F sharp minor's G sharp, and the E sharp
// of C#7 when a chord names its seventh).
const SCALE = [9, 11, 1, 2, 4, 6, 7, 8];
// The upside-down cell's last note: a whole step under the root (the flat
// seventh), unless that note is out of the key; then the sixth under it.
const lead = (ch) => (ch.seventh || SCALE.includes((ch.pc + 10) % 12) ? -2 : -3);

// The band for a run of chords: the stomping bass (the cell upside down,
// 5 1 1 b7, on the first half of each chord; root, fifth, octave, fifth on
// a held chord's second half), the pizzicato "squeezebox" chops on every
// off-beat 8th, and a guide note (the chord's third) for the horns. `blow`
// bars are the hornpipe's three hammer blows: everyone on beats 1, 2 and 3,
// nothing on 4 (it's left to the tune's pickup).
function band(text, blow = []) {
  const out = { bass: [], comp1: [], comp2: [], comp3: [], guide: [] };
  halves(text).forEach((ch, i, all) => {
    const bar = i >> 1;
    const second = i % 2 === 1;
    const held = second && all[i - 1].pc === ch.pc && all[i - 1].seventh === ch.seventh;
    const root = from(40, ch.pc);
    const voicing = (ch.tones.length === 4 ? ch.tones.slice(1) : ch.tones).map((pc) => from(57, pc)).sort((a, b) => a - b);
    const third = from(56, ch.tones[1]);
    if (blow.includes(bar)) {
      out.bass.push(...(second ? [root - 12, '-', '-', '.', '.', '.', '.', '.'] : [root, '-', '.', '.', root - 5, '-', '.', '.']));
      voicing.forEach((n, v) => out[`comp${v + 1}`].push(...(second ? [n, '-', '.', '.', '.', '.', '.', '.'] : [n, '-', '.', '.', n, '-', '.', '.'])));
      out.guide.push(...(second ? [third, '-', '.', '.', '.', '.', '.', '.'] : [third, '-', '.', '.', third, '-', '.', '.']));
      return;
    }
    out.bass.push(...(held
      ? [root, '-', root + 7, '-', root + 12, '-', root + 7, '-']
      : [root - 5, '-', '.', root, root, '-', root + lead(ch), '-']));
    voicing.forEach((n, v) => out[`comp${v + 1}`].push('.', '.', n, '-', '.', '.', n, '-'));
    out.guide.push(...(held ? Array(8).fill('-') : [third, ...Array(7).fill('-')]));
  });
  return out;
}

const A_HALVES = `
  A A | A A | D D | E E | A A | G G | D E | A A
  F#m F#m | D D | A A | E E | A A | G D | E7 E7 | A A
`;
const B_HALVES = `
  F#m F#m | F#m F#m | D D | C#7 C#7 | F#m F#m | F#m F#m | Bm Bm | C#7 C#7
  D D | E E | F#m F#m | F#m F#m | G G | G7 G7 | E E | E E
`;
const C_CHORDS = 'A A A E A A D E';
const BLOWS = [7, 15];

// --- THE TUNE. Bar 1 is the coast cell in A (E, A-A, B) with a dotted
// hornpipe kick, then a leap up to C sharp; bar 2 falls onto the G natural.
// Each half ends on the three hammer blows; the second half answers in F
// sharp minor and comes home over E7. ---
const TUNE_BARS = `
  E5 - - A5 | A5 - B5 - | C#6 - A5 - | E5 - C#5 -
  D5 - - C#5 | B4 - A4 - | G4 - - B4 | E5 - . .
  F#5 - - A5 | A5 - B5 - | A5 - F#5 - | D5 - A4 -
  B4 - C#5 - | D5 - E5 - | F#5 - G#5 - | B5 - - -
  E5 - - A5 | A5 - B5 - | C#6 - A5 - | E5 - C#5 -
  D5 - - B4 | G4 - B4 - | D5 - G5 - | B5 - A5 G5
  F#5 - A5 - | F#5 - D5 - | E5 - G#5 - | B5 - G#5 E5
  A5 - . . | E5 - . . | A4 - . . | . . A5 B5
  C#6 - - B5 | A5 - F#5 - | A5 - - G#5 | F#5 - C#5 -
  D5 - - F#5 | A5 - D6 - | C#6 - B5 - | A5 - F#5 -
  E5 - - A5 | A5 - B5 - | C#6 - E6 - | C#6 - A5 -
  B5 - - G#5 | E5 - B4 - | D5 - - C#5 | B4 - . .
  E5 - - A5 | A5 - B5 - | C#6 - A5 - | E5 - C#5 -
  D5 - G5 - | B5 - G5 - | A5 - F#5 - | D5 - A5 -
  G#5 - - A5 | B5 - E6 - | D6 - B5 - | G#5 - E5 -
  A5 - . . | E5 - . . | A4 - . . | . C#5 D5 D#5
`;
const TUNE = riff(TUNE_BARS);

// --- B: the swagger. Low brass on the cell in F sharp minor (C# F# F#
// G#), traded bar by bar with the fiddle; the C#7 bars carry a D on top
// (the flat ninth). Bar 8 is a stab and a stop. ---
const SWAGGER = riff(`
  C#4 - - F#4 | F#4 - G#4 - | A4 - - G#4 | F#4 - C#4 -
  . . . . | . . . . | . . . . | . . . .
  D4 - - F#4 | A4 - - G#4 | F#4 - E4 - | D4 - C#4 -
  . . . . | . . . . | . . . . | . . . .
  C#4 - - F#4 | F#4 - G#4 - | A4 - B4 - | C#5 - - -
  . . . . | . . . . | . . . . | . . . .
  D4 - - B3 | D4 - F#4 - | B4 - A4 - | F#4 - D4 -
  G#4 - . G#4 | . . B4 - | C#5 - . . | . . . .
`);
const B_FIDDLE = riff(`
  . . . . | . . . . | . . . . | . . . .
  . . . . | C#6 B5 A5 G#5 | F#5 - A5 - | C#6 - . .
  . . . . | . . . . | . . . . | . . . .
  . . . . | C#5 F5 G#5 B5 | D6 - C#6 - | B5 - G#5 -
  . . . . | . . . . | . . . . | . . . .
  A5 G#5 F#5 E5 | F#5 - C#5 - | A4 - C#5 - | F#5 - . .
  . . . . | . . . . | . . . . | . . . .
  G#5 - . G#5 | . . B5 - | C#6 - . . | . . . .
  F#5 - - - | A5 - - F#5 | D6 - - - | C#6 - B5 -
  B5 - - - | G#5 - - E5 | B5 - - - | A5 - G#5 -
  A5 - - - | F#5 - - C#5 | F#5 - G#5 - | A5 - B5 -
  C#6 - - - | B5 - A5 - | G#5 - F#5 - | E5 - C#5 -
  D5 - G5 - | B5 - D6 - | B5 - G5 - | D5 - B4 -
  G5 - B5 - | D6 - F6 - | E6 - D6 - | B5 - G5 -
  E5 F5 F#5 G5 | G#5 A5 A#5 B5 | C6 C#6 D6 D#6 | E6 - - -
  E6 - . . | . . . . | . . . . | . . . .
`);
// The stab at the end of bar 8 and the hit at the start of bar 16: the band
// follows the brass/fiddle rhythm there and is silent otherwise.
const STAB8 = (bar) => (bar === 7 ? hits('x.......x.......') : Array(BAR).fill('.'));
// Clear every track of a section in the listed bars from step `at` on,
// except the ones named in `keep`.
const stopIn = (section, bars, at, keep = []) => Object.fromEntries(Object.entries(section).map(([name, track]) => [
  name, keep.includes(name) ? track : track.map((n, i) => (bars.includes(Math.floor(i / BAR)) && i % BAR >= at ? '.' : n)),
]));

// --- C: the breakdown's bass, the cell upside down in quarters (E A A G
// on A), one bar a chord. ---
const C_BASS = halves(C_CHORDS).flatMap((ch) => {
  const r = from(40, ch.pc);
  return [r - 5, '-', '-', '.', r, '-', '-', '.', r, '-', '-', '.', r + lead(ch), '-', '-', '.'];
});
// The ship's bell: the cell in half notes (E A, A B), Haddock's motif in A
// (C# B A, E), and then one clang at nothing.
const BELL = (() => {
  const t = scatter(8, BAR, [[0, 0, 'E4'], [0, 8, 'A4'], [1, 0, 'A4'], [1, 8, 'B4'], [3, 11, 'A4'], [4, 0, 'A4'], [6, 0, 'A4']]);
  haddockPhrase('A4', { lengths: [4, 2, 6, 4], unit: 1 }).forEach((n, i) => { t[2 * BAR + i] = n; });
  return t;
})();

// --- The intro: the fiddle runs up the A mixolydian scale into the tune. ---
const RUN_UP = riff(`
  . . . . | . . . . | . . . . | . . . .
  A4 B4 C#5 D5 | E5 F#5 G5 A5 | G5 F#5 E5 D5 | C#5 - D5 D#5
`);

// --- The kit: a soft kick on 1 and 3, a rim on 2 and 4, a bodhran
// rattling the hornpipe, claps on 2 and 4 when the crew joins in. ---
const KICK = hits('x.......x.......');
const RIM = hits('....x.......x...');
const BODHRAN = hits('x..xx.x.x..xx.xx');
const BODHRAN_FILL = hits('x.xxx.x.x.x.xxxx');
const CLAPS = hits('....x.......x...');
const BLOW_HITS = hits('x...x...x.......');
const ROLL = hits('x.x.x.x.xxxxxxxx');
// A kit for `bars` bars, with the hammer blows in `blow` bars and a
// bodhran fill every fourth bar otherwise.
const kit = (bars, blow = []) => ({
  kick: barsOf(bars, (i) => (blow.includes(i) ? BLOW_HITS : KICK)),
  rim: barsOf(bars, (i) => (blow.includes(i) ? Array(BAR).fill('.') : RIM)),
  bodhran: barsOf(bars, (i) => (blow.includes(i) ? BLOW_HITS : (i % 4 === 3 ? BODHRAN_FILL : BODHRAN))),
});

const A_BAND = band(A_HALVES, BLOWS);
const B_BAND = band(B_HALVES);

export const GULLREST_BATTLE_THEME = {
  title: 'Shore Leave',
  bpm: 138,
  stepsPerBeat: 4,
  volume: 1.3,

  instruments: {
    // The lead: a solo fiddle, short and bowed hard.
    fiddle: { sample: 'soloViolin', volume: 0.42, release: 0.12, reverb: 0.25, pan: 0.1, humanize: { time: 0.005, volume: 0.1 } },
    oboe: { sample: 'oboe', volume: 0.24, attack: 0.01, release: 0.1, reverb: 0.25, pan: 0.2, humanize: { time: 0.005, volume: 0.1 } },
    clarinet: { sample: 'clarinet', volume: 0.26, attack: 0.01, release: 0.1, reverb: 0.25, pan: -0.25, humanize: { time: 0.005, volume: 0.1 } },
    piccolo: { sample: 'piccolo', volume: 0.1, attack: 0.01, release: 0.1, reverb: 0.3, pan: 0.35, humanize: { time: 0.005, volume: 0.1 } },
    // The squeezebox chops (pizzicato chords on the off-beats).
    comp1: { sample: 'violinsPizz', volume: 0.13, release: 0.08, reverb: 0.2, pan: -0.1, humanize: { time: 0.004, volume: 0.15 } },
    comp2: { sample: 'violinsPizz', volume: 0.13, release: 0.08, reverb: 0.2, pan: 0.05, humanize: { time: 0.004, volume: 0.15 } },
    comp3: { sample: 'violinsPizz', volume: 0.13, release: 0.08, reverb: 0.2, pan: 0.2, humanize: { time: 0.004, volume: 0.15 } },
    // The stomp.
    tuba: { sample: 'tuba', volume: 0.28, attack: 0.01, release: 0.08, reverb: 0.15, pan: -0.05, humanize: { time: 0.004, volume: 0.1 } },
    bassPizz: { sample: 'cellosPizz', volume: 0.3, release: 0.12, reverb: 0.18, pan: -0.15, humanize: { time: 0.004, volume: 0.12 } },
    basses: { sample: 'bassSpic', volume: 0.13, release: 0.06, reverb: 0.15, humanize: { time: 0.004, volume: 0.12 } },
    // Brass.
    trombone: { sample: 'trombone', volume: 0.26, attack: 0.02, release: 0.12, reverb: 0.25, pan: 0.3, humanize: { time: 0.006, volume: 0.1 } },
    horns: { sample: 'horns', volume: 0.19, attack: 0.03, release: 0.2, reverb: 0.3, pan: -0.2, humanize: { time: 0.006, volume: 0.08 } },
    trumpet: { sample: 'trumpet', volume: 0.24, release: 0.1, reverb: 0.28, pan: 0.15, humanize: { time: 0.005, volume: 0.08 } },
    // Strings for the climb, the crew's hum, the ship's bell.
    violinsTrem: { sample: 'violinsTrem', volume: 0.14, attack: 0.3, release: 0.3, reverb: 0.35, pan: 0.2 },
    cellosTrem: { sample: 'cellosTrem', volume: 0.18, attack: 0.3, release: 0.3, reverb: 0.3, pan: -0.2 },
    crewHi: { sample: 'choir', volume: 0.1, attack: 0.3, release: 0.6, reverb: 0.5, pan: 0.15 },
    crewLo: { sample: 'choir', volume: 0.1, attack: 0.3, release: 0.6, reverb: 0.5, pan: -0.15 },
    bell: { sample: 'chimes', volume: 0.24, ring: true, reverb: 0.5, pan: 0.3 },
    // The kit.
    kick: { drum: 'kick', volume: 0.34 },
    rim: { sample: 'snareSoft', drum: 'sample', volume: 0.17, release: 0.08, reverb: 0.2, humanize: { time: 0.004, volume: 0.25 } },
    bodhran: { sample: 'frameDrum', drum: 'sample', volume: 0.18, ring: true, reverb: 0.15, pan: 0.15, humanize: { time: 0.003, volume: 0.3 } },
    claps: { sample: 'claps', drum: 'sample', volume: 0.22, ring: true, reverb: 0.25, pan: -0.05, humanize: { time: 0.006, volume: 0.25 } },
    stamp: { sample: 'bassDrum', drum: 'sample', volume: 0.32, ring: true, reverb: 0.25, humanize: { time: 0.004, volume: 0.15 } },
    snare: { sample: 'snare', drum: 'sample', volume: 0.16, ring: true, reverb: 0.25, humanize: { time: 0.003, volume: 0.25 } },
    crash: { sample: 'crash', drum: 'sample', volume: 0.2, ring: true, reverb: 0.3 },
  },

  sections: {
    // The bell twice, a stamp, the tuba on the upside-down cell; then the
    // fiddle runs up into the tune.
    intro: fit('intro', {
      bell: scatter(2, BAR, [[0, 0, 'A4'], [0, 8, 'E4']]),
      stamp: [...KICK, ...rest(1)],
      tuba: [...steps('E2 A2 A2 G2'), ...steps('E2 - - -')],
      fiddle: RUN_UP,
      bodhran: [...rest(1), ...ROLL],
    }, 2),

    // THE TUNE on the fiddle over the chops, the stomp and the bodhran; a
    // clarinet joins under the answer.
    A: fit('A', {
      fiddle: TUNE,
      clarinet: only(8, 16, up(TUNE, -12)),
      tuba: A_BAND.bass,
      bassPizz: A_BAND.bass,
      comp1: A_BAND.comp1,
      comp2: A_BAND.comp2,
      comp3: A_BAND.comp3,
      trumpet: only(15, 16, up(TUNE, -12)),
      ...kit(16, BLOWS),
      crash: crashOn(16, 0, 8),
    }, 16),

    // The minor turn: brass swagger, fiddle answers, a stab; the fiddle
    // soars over held horns; the chromatic climb; one E and stop.
    B: fit('B', stopIn(stopIn({
      trombone: [...up(SWAGGER, -12), ...rest(8)],
      horns: [...SWAGGER, ...only(8, 16, B_BAND.guide).slice(8 * BAR)],
      clarinet: [...SWAGGER, ...up(B_FIDDLE, -12).slice(8 * BAR, 14 * BAR), ...rest(2)],
      fiddle: B_FIDDLE,
      tuba: B_BAND.bass,
      bassPizz: B_BAND.bass,
      comp1: B_BAND.comp1,
      comp2: B_BAND.comp2,
      comp3: B_BAND.comp3,
      violinsTrem: [...rest(14), ...steps('E4 - - -'), ...rest(1)],
      cellosTrem: [...rest(14), ...steps('E3 - - -'), ...rest(1)],
      kick: [...repeat(KICK, 7), ...STAB8(7), ...repeat(KICK, 6), ...hits('x...x...x...x...'), ...hits('x...............')],
      rim: [...repeat(RIM, 7), ...rest(1), ...repeat(RIM, 6), ...rest(2)],
      bodhran: [...rest(8), ...repeat(BODHRAN, 3), ...BODHRAN_FILL, ...repeat(BODHRAN, 2), ...rest(2)],
      snare: [...rest(7), ...STAB8(7), ...rest(6), ...ROLL, ...hits('x...............')],
      trumpet: [...rest(7), ...riff('G#4 - . G#4 | . . B4 - | C#5 - . . | . . . .'), ...rest(7), ...riff('E5 - . . | . . . . | . . . . | . . . .')],
      bell: scatter(16, BAR, [[15, 8, 'E4']]),
      crash: crashOn(16, 0, 8, 15),
    }, [7], 10, ['fiddle', 'trumpet', 'trombone', 'horns', 'clarinet', 'kick', 'snare', 'crash']), [15], 2, ['bell']), 16),

    // The breakdown: stamps, claps, the bass alone on the upside-down
    // cell, the crew humming, the bell; the oboe and clarinet sneak the
    // tune back in; a roll.
    C: fit('C', {
      stamp: [...repeat(KICK, 7), ...hits('x..x..x.x.x.xxxx')],
      claps: [...repeat(CLAPS, 3), ...hits('....x..x....x.x.'), ...repeat(CLAPS, 3), ...hits('....x...x.x.x.x.')],
      bassPizz: C_BASS,
      tuba: only(4, 8, C_BASS),
      crewLo: sustained(C_CHORDS, BAR, 2, 3),
      crewHi: sustained(C_CHORDS, BAR, 1, 3),
      bell: BELL,
      oboe: [...rest(4), ...TUNE.slice(0, 4 * BAR)],
      clarinet: [...rest(4), ...up(TUNE.slice(0, 4 * BAR), -12)],
      comp1: [...rest(4), ...band('A A | A A | D D | E E').comp1],
      comp2: [...rest(4), ...band('A A | A A | D D | E E').comp2],
      comp3: [...rest(4), ...band('A A | A A | D D | E E').comp3],
      bodhran: [...rest(4), ...repeat(BODHRAN, 3), ...BODHRAN_FILL],
      snare: [...rest(7), ...ROLL],
    }, 8),

    // All hands: the tune on fiddle, oboe and clarinet; horns and trombone
    // on the guide notes; trumpets on the blows; the piccolo gull on top in
    // the second half; claps on 2 and 4.
    A2: fit('A2', {
      fiddle: TUNE,
      oboe: TUNE,
      clarinet: up(TUNE, -12),
      piccolo: only(8, 16, playable(up(TUNE, 12), 'piccolo')),
      horns: A_BAND.guide,
      trombone: up(A_BAND.guide, -12),
      trumpet: up(TUNE, -12).map((n, i) => (BLOWS.includes(Math.floor(i / BAR)) ? n : '.')),
      tuba: A_BAND.bass,
      basses: A_BAND.bass,
      bassPizz: A_BAND.bass,
      comp1: A_BAND.comp1,
      comp2: A_BAND.comp2,
      comp3: A_BAND.comp3,
      ...kit(16, BLOWS),
      claps: barsOf(16, (i) => (BLOWS.includes(i) ? BLOW_HITS : CLAPS)),
      crash: crashOn(16, 0, 4, 8, 12),
    }, 16),
  },

  // The intro plays once; then the fight goes round from the tune.
  order: ['intro', 'A', 'B', 'C', 'A2'],
  loopFrom: 1,
};
