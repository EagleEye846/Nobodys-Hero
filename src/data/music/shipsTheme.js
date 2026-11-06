import { melody, hits, repeat, arpeggio, chordLine, sustained, transpose } from '../../audio/notation.js';
import { ORCHESTRA, timp, held } from './parts/usurper.js';
import { haddockPhrase } from './parts/chapter5.js';

// "Wind in the Hawsers": the ship piece for the chapter 5 hulls and crossings:
// the Wreck Yard's graveyard of ships, and sailing out on Haddock's rowboat
// the Bother into the Storm Reach. Big, rolling, adventurous but ominous: the
// bones of a sea shanty (a heavy tune that leans on the beat, a stamp, an
// anvil on the off-beat like a block and tackle) under a full orchestra, with
// the waves in the strings (violas rippling up the chord and back, long
// violins rising and falling like a swell). It is slower and wider than
// "Cutlass Weather" (pirateBattleTheme.js) and then, like the other epic
// pieces, builds, stops dead for a beat, and drops: gong, deep drum, a low
// brass BRAAAM, and the shanty on all the brass. Haddock's motif comes once,
// in the open-sea section, as a brave horn call in D major (F# E D, A) and
// is answered by the fiddle slowly turning the coast cell (A D D E) into G
// minor. D minor, with Bb, Gm and A major to pull home. Not cheery.
//
// THE COAST CELL: the first bar of the shanty tune (A D D E), then the build
// plays it again, climbing a step with each chord.
//
// 4/4 at 116 BPM, 16 steps to a bar, one step a 16th (a bar is about 2.07
// seconds). The intro plays once (2 bars, `loopFrom: 1` skips it); then it
// loops from A, 64 bars, 2m12s:
//
//   intro    2 bars  a foghorn (tuba), the violas' first wave, a gong
//   A       16 bars  the shanty tune on horns over the stamp and the waves;
//                    trombones and timpani join for the second time round
//   B       16 bars  the second tune (the rolling one): the fiddle first,
//                    then violins and trumpets with the crew singing low;
//                    anvil on the off-beat
//   C        8 bars  the open sea: Haddock's horn call once, in D major;
//                    then the fiddle slow on the cell in G minor over
//                    tremolo, choir and low drones; the stamp falls away
//   D        8 bars  the build: the cell climbs Dm, Bb, Gm, A on brass over
//                    a snare roll and tremolo; it stops dead for the last
//                    half bar
//   E       16 bars  the drop: gong, deep drum, BRAAAM; the shanty on horns,
//                    trumpets, trombones and tuba, violins soaring, everything
//                    stamping, and home to A

const BAR = 16;
const tune = (text) => melody(text, 2);   // each token an eighth: 8 to a bar
const rest = (bars) => Array(bars * BAR).fill('.');
const tight = (name, section, bars) => {
  for (const [track, steps] of Object.entries(section)) {
    if (steps.length !== bars * BAR) throw new Error(`Wind in the Hawsers ${name}: '${track}' is ${steps.length} steps, not ${bars} bars`);
  }
  return section;
};
const once = (pattern, bars) => [...pattern, ...Array(bars * BAR - pattern.length).fill('.')];
const at = (bars, ...steps) => Array.from({ length: bars * BAR }, (_, i) => (steps.includes(i) ? 'x' : '.'));
// Stop dead after the first `keep` steps of the last bar: the silent beat.
const stopAt = (steps, keep = 8) => [...steps.slice(0, steps.length - BAR + keep), ...Array(BAR - keep).fill('.')];
// The cymbal swell is loudest 3.18 seconds in: 25 steps at 116 BPM.
const SWELL_STEPS = 25;
const swellInto = (bars, keep = 0) => {
  const len = Math.min(SWELL_STEPS, bars * BAR - keep);
  return [...Array(bars * BAR - keep - len).fill('.'), ...held(60, len), ...Array(keep).fill('.')];
};
const part = (chords, from, count) => chords.split(/\s+/).slice(from, from + count).join(' ');

// --- Harmony, a bar each ---
const A_HALF = 'Dm Dm Dm Gm Bb Dm Bb A';
const A_CHORDS = `${A_HALF} ${A_HALF}`;
const B_HALF = 'Dm Gm F Gm Dm Bb Gm A';
const B_CHORDS = `${B_HALF} ${B_HALF}`;
const C_CHORDS = 'D D Gm Gm Bb Bb A A';
const D_CHORDS = 'Dm Dm Bb Bb Gm Gm A A';
const INTRO_CHORDS = 'Dm Dm';

// --- The shanty tune: heavy on the beat, the cell first. 8 bars. ---
const SHANTY = tune(`
  A4 - D5 - D5 - E5 -
  F5 - - E5 D5 - - -
  A4 - D5 - D5 - E5 -
  G5 - F5 - E5 - - -
  F5 - - A5 G5 - F5 -
  E5 - D5 - C5 - A4 -
  Bb4 - C5 - D5 - E5 -
  A4 - - - - - . .
`);
// The rolling second tune. 8 bars.
const ROLLING = tune(`
  D5 - F5 - A5 - F5 -
  G5 - Bb5 - A5 - - -
  F5 - A5 - C6 - A5 -
  Bb5 - A5 - G5 - - -
  A5 - G5 - F5 - E5 -
  D5 - E5 - F5 - G5 -
  Bb5 - A5 - G5 - E5 -
  A5 - - - - - . .
`);
// The fiddle on the cell in G minor, slow. 6 bars.
const SLOW_G = tune(`
  D5 - - - G5 - - -
  G5 - - - A5 - - -
  Bb5 - - - A5 - - -
  G5 - - - F5 - - -
  Eb5 - - - F5 - - -
  G5 - - - - - . .
`);
const cell = (a, b, c) => `${a} - ${b} - ${b} - ${c} -`;
const BUILD = tune([
  cell('A4', 'D5', 'E5'), cell('A4', 'D5', 'E5'),
  cell('F4', 'Bb4', 'C5'), cell('F4', 'Bb4', 'C5'),
  cell('D5', 'G5', 'A5'), cell('D5', 'G5', 'A5'),
  'E5 - A5 - A5 - Bb5 -', 'E5 - A5 - A5 - C#6 -',
].join(' '));

// --- Patterns, a bar each ---
// The waves: up the chord and back in 8ths, rolling.
const WAVE = [0, '-', 7, '-', 12, '-', 'tenth', '-', 19, '-', 'tenth', '-', 12, '-', 7, '-'];
// Racing 16ths for the build.
const SWELL = [0, 7, 12, 'tenth', 12, 7, 'third', 7];
const ROLL = [0, '.', '.', 0, '.', '.', 0, '.', 0, '.', '.', 0, '.', '.', 7, '.'];
const ROOTS = [0, '-', '-', '-', '-', '-', '-', '-', 0, '-', '-', '-', '-', '-', 7, '.'];
const T_SHIP = [0, '.', '.', '.', '.', '.', '.', '.', 0, '.', '.', '.', 0, '.', -5, '.'];
const T_ONE = [0, ...Array(15).fill('.')];
const T_HEART = [0, '.', '.', 0, ...Array(12).fill('.')];
const T_DROP = [0, '.', '.', '.', '.', '.', '.', '.', 0, '.', '.', 0, '.', '.', '.', '.'];
const STAMP = hits('x.....x.x.......');
const BASSDRUM = hits('x.......x..x....');
const TAIKO = hits('x..x..x.x..x..x.');
const TAIKO_HI = hits('....x..x..x.x.xx');
const SNARE = hits('............x...');
const SNARE_BUILD = hits('x.x.x.x.xxxxxxxx');
const SNARE_FILL = hits('x.x.xxxxxxxxxxxx');
const OFFBEAT = hits('....x.......x...');
const CRASH1 = hits('x');

export const SHIPS_THEME = {
  title: 'Wind in the Hawsers',
  bpm: 116,
  stepsPerBeat: 4,
  volume: 0.7,

  instruments: {
    ...ORCHESTRA,
    race: { ...ORCHESTRA.race, volume: 0.22 },
    raceHigh: { ...ORCHESTRA.race, volume: 0.15, pan: -0.3 },
    violinsTrem: { sample: 'violinsTrem', volume: 0.2, attack: 0.4, release: 0.6, reverb: 0.45, pan: 0.2 },
    lowTrem: { sample: 'cellosTrem', volume: 0.26, attack: 0.5, release: 0.6, reverb: 0.4, pan: -0.2 },
    waves: { sample: 'violas', volume: 0.3, attack: 0.04, release: 0.4, reverb: 0.5, pan: -0.15 },
    wavesHigh: { sample: 'violins', volume: 0.3, attack: 0.9, release: 0.9, reverb: 0.5, pan: 0.25 },
    crew: { sample: 'choir', volume: 0.3, attack: 0.25, release: 0.6, reverb: 0.5 },
    crewSwell: { sample: 'choir', volume: 0.28, attack: 0.5, release: 0.8, reverb: 0.6 },
    fiddle: { sample: 'soloViolin', volume: 0.5, release: 0.2, reverb: 0.4, pan: 0.2, humanize: { time: 0.006, volume: 0.1 } },
    fiddleSoft: { sample: 'soloViolin', volume: 0.5, attack: 0.1, release: 0.6, reverb: 0.55, pan: 0.1 },
    horns: { ...ORCHESTRA.horns, volume: 0.42 },
    hornsBig: { ...ORCHESTRA.horns, volume: 0.4, pan: 0.15 },
    trumpetsBig: { ...ORCHESTRA.trumpets, volume: 0.3, pan: -0.15 },
    hornsLow: { ...ORCHESTRA.horns, volume: 0.36, pan: 0.1 },
    trumpets: { ...ORCHESTRA.trumpets, volume: 0.36 },
    foghorn: { sample: 'tuba', volume: 0.5, attack: 0.3, release: 1.2, reverb: 0.55 },
    anvil: { sample: 'anvil', drum: 'sample', volume: 0.4, ring: true, reverb: 0.3, pan: -0.2 },
    stomp: { sample: 'tom', drum: 'sample', volume: 0.4, ring: true, reverb: 0.2, pan: -0.1, humanize: { time: 0.004, volume: 0.2 } },
  },

  sections: {
    // A foghorn, the violas' first wave, a gong.
    intro: tight('intro', {
      foghorn: held('D2', 2 * BAR),
      waves: arpeggio(INTRO_CHORDS, BAR, 3, WAVE),
      wavesHigh: sustained(INTRO_CHORDS, BAR, 2, 4),
      gong: once(hits('x'), 2),
      timpani: timp(INTRO_CHORDS, T_HEART),
    }, 2),

    // The shanty on horns over the stamp and the waves.
    A: tight('A', {
      horns: [...SHANTY, ...SHANTY],
      trombones: [...rest(8), ...transpose(SHANTY, -12)],
      hornsLow: [...rest(8), ...sustained(part(A_CHORDS, 8, 8), BAR, 2, 3)],
      waves: arpeggio(A_CHORDS, BAR, 3, WAVE),
      wavesHigh: sustained(A_CHORDS, BAR, 1, 4),
      pound: chordLine(A_CHORDS, ROLL, 2),
      basses: chordLine(A_CHORDS, ROOTS, 1),
      cellos: sustained(A_CHORDS, BAR, 0, 2),
      timpani: timp(A_CHORDS, T_SHIP),
      stomp: repeat(STAMP, 16),
      taiko: [...rest(4), ...repeat(TAIKO, 12)],
      snare: [...rest(8), ...repeat(SNARE, 7), ...SNARE_FILL],
      crash: [...once(CRASH1, 8), ...once(CRASH1, 8)],
    }, 16),

    // The rolling tune: fiddle first, then violins, trumpets and the crew.
    B: tight('B', {
      fiddle: [...ROLLING, ...rest(8)],
      violins: [...rest(8), ...ROLLING],
      trumpets: [...rest(8), ...transpose(ROLLING, 0)],
      crew: [...rest(8), ...transpose(ROLLING, -12)],
      horns: sustained(B_CHORDS, BAR, 1, 3),
      hornsLow: sustained(B_CHORDS, BAR, 2, 3),
      waves: arpeggio(B_CHORDS, BAR, 3, WAVE),
      race: [...rest(8), ...arpeggio(part(B_CHORDS, 8, 8), BAR, 4, SWELL)],
      pound: chordLine(B_CHORDS, ROLL, 2),
      basses: chordLine(B_CHORDS, ROOTS, 1),
      timpani: timp(B_CHORDS, T_SHIP),
      stomp: repeat(STAMP, 16),
      taiko: repeat(TAIKO, 16),
      snare: [...repeat(SNARE, 15), ...SNARE_FILL],
      anvil: repeat(OFFBEAT, 16),
      crash: [...once(CRASH1, 8), ...once(CRASH1, 8)],
    }, 16),

    // The open sea: Haddock's brave horn call once, then the fiddle slow in
    // G minor over tremolo and choir.
    C: tight('C', {
      horns: [...haddockPhrase('D5'), ...rest(7)],
      hornsSoft: [...rest(1), ...held('D4', 4 * BAR), ...rest(3)],
      fiddleSoft: [...rest(2), ...SLOW_G],
      lowTrem: sustained(C_CHORDS, BAR, 0, 2),
      violinsTrem: [...rest(2), ...sustained(part(C_CHORDS, 2, 6), BAR, 2, 4)],
      crew: [...rest(4), ...sustained(part(C_CHORDS, 4, 4), BAR, 2, 4)],
      foghorn: [...held('D2', 2 * BAR), ...rest(6)],
      waves: [...rest(2), ...arpeggio(part(C_CHORDS, 2, 6), BAR, 3, WAVE)],
      timpani: [...rest(2), ...timp(part(C_CHORDS, 2, 6), T_HEART)],
      anvil: at(8, 6 * BAR + 4),
      swell: swellInto(8),
    }, 8),

    // The build: the cell climbs; it stops dead for the last half bar.
    D: tight('D', {
      horns: stopAt(transpose(BUILD, -12)),
      trombones: stopAt(transpose(BUILD, -24)),
      trumpets: [...rest(4), ...stopAt(BUILD).slice(4 * BAR)],
      violinsTrem: stopAt(sustained(D_CHORDS, BAR, 0, 5)),
      lowTrem: stopAt(sustained(D_CHORDS, BAR, 0, 2)),
      crewSwell: [...rest(2), ...stopAt(sustained(D_CHORDS, BAR, 2, 4)).slice(2 * BAR)],
      raceHigh: stopAt(arpeggio(D_CHORDS, BAR, 4, SWELL)),
      pound: stopAt(chordLine(D_CHORDS, ROLL, 2)),
      basses: stopAt(chordLine(D_CHORDS, ROOTS, 1)),
      timpani: stopAt(timp(D_CHORDS, T_SHIP)),
      stomp: stopAt(repeat(STAMP, 8)),
      taiko: stopAt(repeat(TAIKO, 8)),
      roll: stopAt([...rest(3), ...repeat(SNARE_BUILD, 5)]),
      swell: swellInto(8, 8),
    }, 8),

    // The drop: gong, deep drum, BRAAAM; the shanty on every brass at once.
    E: tight('E', {
      gong: once(hits('x'), 16),
      impact: at(16, 0, 3 * BAR),
      braam: [...held('D3', 2 * BAR), ...rest(14)],
      braamLow: [...held('D2', 2 * BAR), ...rest(14)],
      horns: [...SHANTY, ...SHANTY],
      trumpets: [...SHANTY, ...transpose(ROLLING, 0)],
      trombones: transpose([...SHANTY, ...SHANTY], -12),
      tuba: transpose([...SHANTY, ...SHANTY], -24),
      violins: [...SHANTY, ...ROLLING],
      hornsBig: [...SHANTY, ...SHANTY],
      trumpetsBig: [...SHANTY, ...ROLLING],
      waves: arpeggio(A_CHORDS, BAR, 3, WAVE),
      raceHigh: arpeggio(A_CHORDS, BAR, 4, SWELL),
      pound: chordLine(A_CHORDS, ROLL, 2),
      basses: chordLine(A_CHORDS, ROOTS, 1),
      crewSwell: sustained(A_CHORDS, BAR, 2, 4),
      timpani: [...timp(part(A_CHORDS, 0, 2), T_DROP), ...timp(part(A_CHORDS, 2, 14), T_SHIP)],
      bassDrum: repeat(BASSDRUM, 16),
      stomp: repeat(STAMP, 16),
      taiko: repeat(TAIKO, 16),
      taikoHigh: repeat(TAIKO_HI, 16),
      snare: [...repeat(SNARE, 15), ...SNARE_FILL],
      anvil: repeat(OFFBEAT, 16),
      crash: [...once(CRASH1, 4), ...once(CRASH1, 4), ...once(CRASH1, 4), ...once(CRASH1, 4)],
    }, 16),
  },

  order: ['intro', 'A', 'B', 'C', 'D', 'E'],
  loopFrom: 1,
};
