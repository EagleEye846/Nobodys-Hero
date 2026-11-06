import { melody, hits, repeat, arpeggio, chordLine, sustained, transpose } from '../../audio/notation.js';
import { ORCHESTRA, timp, held } from './parts/usurper.js';

// "Cutlass Weather": the pirate battle theme for ordinary fights around the
// ships on the chapter 5 coast: the Wreck Yard's hulls, the Storm Reach, the
// drowned sailors' ghosts, the diving suit. It is meant to be MORE than the
// two "Salt in the Wound" drafts: a film-score swashbuckle in six-eight, all
// real recorded instruments. The horns carry a rousing minor tune whose first
// bar is the coast cell (A D D E); a fiddle runs wild over a crew singing
// "ah" and a gang of boots, drums and an anvil; then the storm builds, the
// whole thing stops dead for a beat, and the drop lands (gong, deep drum, a
// low brass BRAAAM) with the tune on every brass seat at once. In the middle
// the sea goes still and G minor, a lone fiddle over soft horns and a heartbeat,
// before it rises again and all hands sail home. D minor, with Bb, C, Gm and
// A major to pull home. Heroic and dark, nothing cheery: no oom-pa-pa, no
// claps, no bouncy afterbeats.
//
// THE COAST CELL: A D D E opens the main tune. In the lightning build it is
// played again and again, climbing a step with each chord (in G, in Bb, in
// C); in the still middle it is turned into G minor (D G G A).
//
// 6/8 at 120 dotted quarters a minute; 12 steps to a bar, one step a 16th (a
// bar is exactly 1.0 second). The intro plays once (2 bars, `loopFrom: 1`
// skips it); then it loops from A, 108 bars, 1m48s:
//
//   intro    2 bars  a horn call on the cell over a drone and a heartbeat,
//                    an anvil, a cymbal swell in
//   A       16 bars  the main tune on horns over the gallop, boots, snare
//                    and big timpani; trombones join for the second half
//   B       16 bars  the fiddle takes a second tune (the crew sings it low,
//                    trumpets join the second time) with fiddle runs;
//                    anvil on the fourth beat
//   C        8 bars  the build: the cell climbs Gm, Bb, C, A on brass over
//                    a snare roll and tremolo; it stops dead for the last
//                    beat (half a bar of silence)
//   D       16 bars  the drop: gong, deep drum, BRAAAM; the main tune on
//                    horns, trumpets, trombones and tuba, violins racing
//   E       16 bars  the still sea, G minor: a lone fiddle on the cell in G
//                    over soft horns, choir and a heartbeat; in the last 8
//                    bars it climbs and the drums creep in
//   F        8 bars  the second build, no silence: the cell again, in D,
//                    Bb, Gm, A, a swell pulling in
//   G       16 bars  all hands: the main tune on every brass and the fiddle
//                    high above, the crew singing, then the second tune
//                    on the trumpets over it
//   H       12 bars  home: the main tune's first half soft and strong, its
//                    ending leaning on the A chord, a swell into A

const BAR = 12;
const tune = (text) => melody(text, 2);   // each token an eighth: 6 to a bar
const run = (text) => melody(text, 1);    // each token a 16th: 12 to a bar
const rest = (bars) => Array(bars * BAR).fill('.');
const tight = (name, section, bars) => {
  for (const [track, steps] of Object.entries(section)) {
    if (steps.length !== bars * BAR) throw new Error(`Cutlass Weather ${name}: '${track}' is ${steps.length} steps, not ${bars} bars`);
  }
  return section;
};
const once = (pattern, bars) => [...pattern, ...Array(bars * BAR - pattern.length).fill('.')];
// Stop dead after the first `keep` steps of the last bar: the silent beat.
const stopAt = (steps, keep = 6) => [...steps.slice(0, steps.length - BAR + keep), ...Array(BAR - keep).fill('.')];
// The cymbal swell is loudest 3.18 seconds in: 38 steps at 120 BPM. This one
// peaks right where the music stops.
const SWELL_STEPS = 38;
const swellInto = (bars, keep = 0) => {
  const len = Math.min(SWELL_STEPS, bars * BAR - keep);
  return [...Array(bars * BAR - keep - len).fill('.'), ...held(60, len), ...Array(keep).fill('.')];
};
const at = (bars, ...steps) => Array.from({ length: bars * BAR }, (_, i) => (steps.includes(i) ? 'x' : '.'));
const part = (chords, from, count) => chords.split(/\s+/).slice(from, from + count).join(' ');

// --- Harmony, a bar each ---
const TUNE_CHORDS = 'Dm Dm Dm Gm Bb Dm Bb A Gm Gm C Dm Bb Gm A Dm';
const B_HALF = 'Dm Gm F Gm Dm Bb Gm A';
const B_CHORDS = `${B_HALF} ${B_HALF}`;
const C_CHORDS = 'Gm Gm Bb Bb C C A A';
const E_CHORDS = 'Gm Gm Gm Eb Gm Eb A A';
const E_CHORDS_ALL = `${E_CHORDS} Gm Gm Bb Eb Gm Eb A A`;
const F_CHORDS = 'Dm Dm Bb Bb Gm Gm A A';
const H_CHORDS = 'Dm Dm Dm Gm Bb Dm Bb A Dm Bb A A';
const INTRO_CHORDS = 'Dm Dm';
const G_CHORDS = `${part(TUNE_CHORDS, 0, 8)} ${B_HALF}`;

// --- The main tune: the cell first. 16 bars. ---
const TUNE = tune(`
  A4 - D5 D5 - E5    F5 - E5 D5 - -
  A4 - D5 D5 - E5    G5 - F5 E5 - -
  F5 - A5 G5 - F5    E5 - F5 D5 - -
  Bb4 - C5 D5 - E5   C#5 - - A4 - -
  D5 - G5 G5 - A5    Bb5 - A5 G5 - F5
  E5 - F5 G5 - A5    A5 - - D5 - .
  F5 - A5 A5 - Bb5   A5 - G5 F5 - E5
  D5 - F5 E5 - C#5   D5 - - - - .
`);
// The second tune (the fiddle's): a rising gallop. 8 bars, played twice.
const SECOND = tune(`
  D5 - F5 A5 - F5    G5 - Bb5 A5 - -
  F5 - A5 C6 - A5    Bb5 - A5 G5 - -
  A5 - G5 F5 - E5    D5 - E5 F5 - G5
  Bb5 - A5 G5 - E5   A5 - - - - .
`);
// The still sea: the cell turned into G minor.
const STILL = tune(`
  D5 - G5 G5 - A5    Bb5 - - - A5 -
  D5 - G5 G5 - A5    C6 - - Bb5 - -
  Bb5 - A5 G5 - F5   Eb5 - F5 G5 - -
  A5 - Bb5 C6 - D6   D6 - - - - .
`);
// The cell in a new key, a bar each (2 bars per chord in the builds).
const cellIn = (a, b, c) => `${a} - ${b} ${b} - ${c}`;
const BUILD_C = tune([
  cellIn('D5', 'G5', 'A5'), cellIn('D5', 'G5', 'A5'),
  cellIn('F5', 'Bb5', 'C6'), cellIn('F5', 'Bb5', 'C6'),
  cellIn('G5', 'C6', 'D6'), cellIn('G5', 'C6', 'D6'),
  'E5 - A5 A5 - Bb5', 'E5 - A5 A5 - C#6',
].join(' '));
const BUILD_F = tune([
  cellIn('A4', 'D5', 'E5'), cellIn('A4', 'D5', 'E5'),
  cellIn('F4', 'Bb4', 'C5'), cellIn('F4', 'Bb4', 'C5'),
  cellIn('D5', 'G5', 'A5'), cellIn('D5', 'G5', 'A5'),
  'E5 - A5 A5 - Bb5', 'E5 - A5 A5 - C#6',
].join(' '));
// The home bars: the tune's ending, leaning on A.
const HOME_TAIL = tune(`
  F5 - E5 D5 - A4
  Bb4 - A4 G4 - F4
  E4 - F4 G4 - A4
  A4 - - - - .
`);
// Fiddle runs (16ths): dashes over a bar of the chord named.
const RUN_DM = run('D5 E5 F5 G5 A5 G5 F5 E5 D5 E5 F5 A5');
const RUN_UP = run('A5 G5 F5 E5 D5 E5 F5 G5 A5 Bb5 C6 D6');
const RUN_DOWN = run('D6 C6 Bb5 A5 G5 F5 E5 D5 C#5 D5 E5 F5');
const RUN_A = run('E5 F5 G5 A5 Bb5 A5 G5 F5 E5 C#5 E5 A5');

// --- Patterns, a bar each ---
// The violins' wave: up the chord and back, 16ths.
const SWELL = [0, 7, 12, 'tenth', 12, 7, 0, 7, 12, 'tenth', 19, 'tenth'];
// The gallop: a long, two short, twice, a lift on the end.
const GALLOP = [0, '.', 0, 0, '.', 0, 0, '.', 0, 0, 7, 7];
const ROOTS = [0, '-', '-', '-', '-', '-', 0, '-', '-', '-', 7, '.'];
const HEAVY = [0, '-', '-', '-', '-', '-', 0, '-', '-', 0, 7, '.'];
const T_SIX = [0, '.', '.', '.', '.', '.', 0, '.', '.', 0, -5, '.'];
const T_ONE6 = [0, ...Array(11).fill('.')];
const T_DROP6 = [0, '.', '.', '.', '.', '.', 0, '.', '.', 0, '.', '.'];
const T_HEART6 = [0, '.', '.', 0, ...Array(8).fill('.')];
const STOMP = hits('x.....x.....');         // boots on the one and the four
const STOMP_THREE = hits('x.....x.x...');
const BASSDRUM = hits('x.....x..x..');
const TAIKO6 = hits('x.x...x.x.x.');
const TAIKO_HI6 = hits('..x.x...x.x.');
const SNARE6 = hits('......x.....');
const SNARE_BUILD = hits('x.x.x.x.xxxx');
const SNARE_FILL = hits('x.x.xxxxxxxx');
const ANVIL4 = hits('......x.....');
const CRASH1 = hits('x...........');

export const PIRATE_BATTLE_THEME = {
  title: 'Cutlass Weather',
  bpm: 120,
  stepsPerBeat: 6,
  volume: 0.7,

  instruments: {
    ...ORCHESTRA,
    race: { ...ORCHESTRA.race, volume: 0.24 },
    raceHigh: { ...ORCHESTRA.race, volume: 0.15, pan: -0.3 },
    violinsTrem: { sample: 'violinsTrem', volume: 0.2, attack: 0.4, release: 0.6, reverb: 0.45, pan: 0.2 },
    lowTrem: { sample: 'cellosTrem', volume: 0.26, attack: 0.5, release: 0.6, reverb: 0.4, pan: -0.2 },
    crew: { sample: 'choir', volume: 0.3, attack: 0.2, release: 0.5, reverb: 0.45 },
    crewSwell: { sample: 'choir', volume: 0.28, attack: 0.5, release: 0.8, reverb: 0.6 },
    fiddle: { sample: 'soloViolin', volume: 0.5, release: 0.15, reverb: 0.35, pan: 0.2, humanize: { time: 0.006, volume: 0.1 } },
    fiddleSoft: { sample: 'soloViolin', volume: 0.5, attack: 0.08, release: 0.5, reverb: 0.5, pan: 0.1 },
    horns: { ...ORCHESTRA.horns, volume: 0.42 },
    hornsBig: { ...ORCHESTRA.horns, volume: 0.4, pan: 0.15 },
    trumpetsBig: { ...ORCHESTRA.trumpets, volume: 0.3, pan: -0.15 },
    hornsLow: { ...ORCHESTRA.horns, volume: 0.36, pan: 0.1 },
    trumpets: { ...ORCHESTRA.trumpets, volume: 0.36 },
    anvil: { sample: 'anvil', drum: 'sample', volume: 0.42, ring: true, reverb: 0.3, pan: -0.2 },
    stomp: { sample: 'tom', drum: 'sample', volume: 0.4, ring: true, reverb: 0.2, pan: -0.1, humanize: { time: 0.004, volume: 0.2 } },
    frame: { sample: 'frameDrum', drum: 'sample', volume: 0.3, ring: true, reverb: 0.3, humanize: { time: 0.004, volume: 0.2 } },
  },

  sections: {
    // A horn call on the cell over a drone, a heartbeat, an anvil, a swell in.
    intro: tight('intro', {
      hornsSoft: tune('A4 - - D5 - - D5 - E5 - - .'),
      lowTrem: sustained(INTRO_CHORDS, BAR, 0, 2),
      timpani: timp(INTRO_CHORDS, T_HEART6),
      anvil: [...rest(1), ...ANVIL4],
      swell: swellInto(2),
    }, 2),

    // The main tune on horns over the gallop, boots and big timpani.
    A: tight('A', {
      horns: TUNE,
      trombones: [...rest(8), ...transpose(TUNE.slice(8 * BAR), -12)],
      race: arpeggio(TUNE_CHORDS, BAR, 4, SWELL),
      pound: chordLine(TUNE_CHORDS, GALLOP, 2),
      basses: chordLine(TUNE_CHORDS, ROOTS, 1),
      cellos: sustained(TUNE_CHORDS, BAR, 0, 2),
      timpani: timp(TUNE_CHORDS, T_SIX),
      stomp: repeat(STOMP, 16),
      taiko: [...rest(4), ...repeat(TAIKO6, 12)],
      snare: [...rest(8), ...repeat(SNARE6, 7), ...SNARE_FILL],
      crash: once(CRASH1, 16),
    }, 16),

    // The fiddle's second tune; the crew sings it low; the fiddle runs wild.
    B: tight('B', {
      fiddle: [...SECOND.slice(0, 7 * BAR), ...RUN_A, ...SECOND.slice(0, 7 * BAR), ...RUN_UP],
      crew: [...rest(8), ...transpose(SECOND, -12)],
      trumpets: [...rest(8), ...SECOND],
      horns: sustained(B_CHORDS, BAR, 1, 3),
      hornsLow: sustained(B_CHORDS, BAR, 2, 3),
      race: arpeggio(B_CHORDS, BAR, 4, SWELL),
      raceHigh: [...rest(8), ...arpeggio(part(B_CHORDS, 8, 8), BAR, 4, SWELL)],
      pound: chordLine(B_CHORDS, GALLOP, 2),
      basses: chordLine(B_CHORDS, HEAVY, 1),
      timpani: timp(B_CHORDS, T_SIX),
      stomp: repeat(STOMP_THREE, 16),
      taiko: repeat(TAIKO6, 16),
      snare: [...repeat(SNARE6, 15), ...SNARE_FILL],
      anvil: repeat(ANVIL4, 16),
      crash: [...once(CRASH1, 8), ...once(CRASH1, 8)],
    }, 16),

    // The build: the cell climbs; it stops dead for the last beat.
    C: tight('C', {
      horns: stopAt(transpose(BUILD_C, -12)),
      trombones: stopAt(transpose(BUILD_C, -24)),
      trumpets: [...rest(4), ...stopAt(BUILD_C).slice(4 * BAR)],
      violinsTrem: stopAt(sustained(C_CHORDS, BAR, 0, 5)),
      lowTrem: stopAt(sustained(C_CHORDS, BAR, 0, 2)),
      crewSwell: [...rest(2), ...stopAt(sustained(C_CHORDS, BAR, 2, 4)).slice(2 * BAR)],
      raceHigh: stopAt(arpeggio(C_CHORDS, BAR, 4, SWELL)),
      pound: stopAt(chordLine(C_CHORDS, GALLOP, 2)),
      basses: stopAt(chordLine(C_CHORDS, HEAVY, 1)),
      timpani: stopAt(timp(C_CHORDS, T_SIX)),
      stomp: stopAt(repeat(STOMP, 8)),
      taiko: stopAt(repeat(TAIKO6, 8)),
      roll: stopAt([...rest(4), ...repeat(SNARE_BUILD, 4)]),
      swell: swellInto(8, BAR - 6),
    }, 8),

    // The drop: gong, deep drum, BRAAAM; the tune on every brass at once.
    D: tight('D', {
      gong: once(hits('x'), 16),
      impact: at(16, 0, 3 * BAR),
      braam: [...held('D3', 2 * BAR), ...rest(14)],
      braamLow: [...held('D2', 2 * BAR), ...rest(14)],
      horns: TUNE,
      trumpets: transpose(TUNE, 0),
      trombones: transpose(TUNE, -12),
      tuba: transpose(TUNE, -24),
      violins: TUNE,
      hornsBig: TUNE,
      trumpetsBig: transpose(TUNE, 0),
      race: arpeggio(TUNE_CHORDS, BAR, 4, SWELL),
      raceHigh: arpeggio(TUNE_CHORDS, BAR, 4, SWELL),
      pound: chordLine(TUNE_CHORDS, GALLOP, 2),
      basses: chordLine(TUNE_CHORDS, HEAVY, 1),
      crewSwell: sustained(TUNE_CHORDS, BAR, 2, 4),
      timpani: [...timp(part(TUNE_CHORDS, 0, 2), T_DROP6), ...timp(part(TUNE_CHORDS, 2, 14), T_SIX)],
      bassDrum: repeat(BASSDRUM, 16),
      stomp: repeat(STOMP_THREE, 16),
      taiko: repeat(TAIKO6, 16),
      taikoHigh: repeat(TAIKO_HI6, 16),
      snare: [...repeat(SNARE6, 15), ...SNARE_FILL],
      anvil: repeat(ANVIL4, 16),
      crash: [...once(CRASH1, 4), ...once(CRASH1, 4), ...once(CRASH1, 4), ...once(CRASH1, 4)],
    }, 16),

    // The still sea: a lone fiddle, soft horns, a heartbeat; it climbs.
    E: tight('E', {
      fiddleSoft: [...STILL, ...rest(8)],
      fiddle: [...rest(8), ...STILL],
      hornsSoft: sustained(E_CHORDS_ALL, BAR, 1, 3),
      crew: [...rest(4), ...sustained(part(E_CHORDS_ALL, 4, 12), BAR, 2, 4)],
      lowTrem: sustained(E_CHORDS_ALL, BAR, 0, 2),
      violinsTrem: [...rest(8), ...sustained(part(E_CHORDS_ALL, 8, 8), BAR, 0, 5)],
      timpani: [...timp(part(E_CHORDS_ALL, 0, 8), T_HEART6), ...timp(part(E_CHORDS_ALL, 8, 8), T_SIX)],
      frame: [...rest(8), ...repeat(STOMP_THREE, 8)],
      stomp: [...rest(12), ...repeat(STOMP, 4)],
      basses: [...rest(8), ...chordLine(part(E_CHORDS_ALL, 8, 8), ROOTS, 1)],
      roll: [...rest(14), ...hits('x.x.x.x.xxxxxxxxxxxxxxxx')],
      swell: swellInto(16),
    }, 16),

    // The second build, no silence: the cell again, climbing, a swell in.
    F: tight('F', {
      horns: transpose(BUILD_F, -12),
      trombones: transpose(BUILD_F, -24),
      race: arpeggio(F_CHORDS, BAR, 4, SWELL),
      raceHigh: arpeggio(F_CHORDS, BAR, 4, SWELL),
      pound: chordLine(F_CHORDS, GALLOP, 2),
      basses: chordLine(F_CHORDS, HEAVY, 1),
      crewSwell: sustained(F_CHORDS, BAR, 2, 4),
      timpani: timp(F_CHORDS, T_SIX),
      stomp: repeat(STOMP_THREE, 8),
      taiko: repeat(TAIKO6, 8),
      snare: [...repeat(SNARE6, 3), ...repeat(SNARE_BUILD, 5)],
      swell: swellInto(8),
    }, 8),

    // All hands: the main tune on every brass, the fiddle above, the crew.
    G: tight('G', {
      gong: once(hits('x'), 16),
      crash: [...once(CRASH1, 4), ...once(CRASH1, 4), ...once(CRASH1, 4), ...once(CRASH1, 4)],
      horns: [...TUNE.slice(0, 8 * BAR), ...sustained(part(G_CHORDS, 8, 8), BAR, 1, 3)],
      trumpets: [...transpose(TUNE.slice(0, 8 * BAR), 0), ...SECOND],
      trombones: [...transpose(TUNE.slice(0, 8 * BAR), -12), ...transpose(SECOND, -12)],
      tuba: [...transpose(TUNE.slice(0, 8 * BAR), -24), ...chordLine(part(G_CHORDS, 8, 8), ROOTS, 1)],
      fiddle: [...transpose(TUNE.slice(0, 8 * BAR), 12), ...RUN_DM, ...RUN_UP, ...RUN_DOWN, ...RUN_A, ...rest(4)],
      crew: sustained(G_CHORDS, BAR, 2, 4),
      race: arpeggio(G_CHORDS, BAR, 4, SWELL),
      raceHigh: arpeggio(G_CHORDS, BAR, 4, SWELL),
      pound: chordLine(G_CHORDS, GALLOP, 2),
      basses: chordLine(G_CHORDS, HEAVY, 1),
      timpani: timp(G_CHORDS, T_SIX),
      bassDrum: repeat(BASSDRUM, 16),
      stomp: repeat(STOMP_THREE, 16),
      taiko: repeat(TAIKO6, 16),
      taikoHigh: repeat(TAIKO_HI6, 16),
      snare: [...repeat(SNARE6, 15), ...SNARE_FILL],
      anvil: repeat(ANVIL4, 16),
    }, 16),

    // Home: the tune's first half, then its ending leaning on A, a swell.
    H: tight('H', {
      horns: [...TUNE.slice(0, 8 * BAR), ...HOME_TAIL],
      fiddle: [...transpose(TUNE.slice(0, 8 * BAR), 12), ...rest(4)],
      trombones: [...rest(8), ...transpose(HOME_TAIL, -12)],
      race: arpeggio(H_CHORDS, BAR, 4, SWELL),
      pound: chordLine(H_CHORDS, GALLOP, 2),
      basses: chordLine(H_CHORDS, ROOTS, 1),
      cellos: sustained(H_CHORDS, BAR, 0, 2),
      crew: [...rest(8), ...sustained(part(H_CHORDS, 8, 4), BAR, 2, 4)],
      timpani: timp(H_CHORDS, T_SIX),
      stomp: repeat(STOMP, 12),
      taiko: [...repeat(TAIKO6, 8), ...rest(4)],
      snare: [...repeat(SNARE6, 7), ...rest(5)],
      crash: once(CRASH1, 12),
      swell: swellInto(12),
    }, 12),
  },

  order: ['intro', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  loopFrom: 1,
};
