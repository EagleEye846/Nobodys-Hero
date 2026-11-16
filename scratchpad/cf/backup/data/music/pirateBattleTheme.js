import { melody, hits, repeat, arpeggio, chordLine, sustained, transpose } from '../../audio/notation.js';
import { ORCHESTRA, timp, held } from './parts/usurper.js';
import { SAMPLE_SETS } from '../../audio/sampleSets.js';

// "Cutlass Weather": the pirate battle theme for ordinary fights around the
// ships on the chapter 5 coast: the Wreck Yard's hulls, the Storm Reach, the
// drowned sailors' ghosts, the diving suit. A film-score swashbuckle in
// six-eight, all real recorded instruments. Heroic and dark, nothing cheery:
// D minor, no oom-pa-pa, no claps, no bouncy afterbeats.
//
// THE HOOK is two bars and you hear it two seconds in. Bar 1 is the coast
// cell (A D D E) with a kick in it: "a-DUM, a-DUM", short-long, short-long,
// riding against the gallop's long-short. Bar 2 leaps up to A and falls
// back down the scale (A, G F E). It is sung three times, the leap landing
// a step higher each time (A, then B flat, then C, the third time on the
// cell in G), and then a long answer comes down onto the A chord. Under it
// the bass walks down a step at every peak (D C, D B flat, G C), so the tune
// climbs while the floor drops away: that pull is the swagger.
//
// Everything else is made of the hook:
//   - the fiddle's second tune is the hook's falling tail turned upside
//     down (a long note and three steps UP), climbing to a top D;
//   - the builds play bar 1 over and over, a step higher each chord;
//   - the still sea plays the whole hook slowly in G minor on a lone fiddle;
//   - a counter-line (low horns and cellos) climbs while the tune falls,
//     moving when the tune holds and holding when it runs.
//
// Wherever the horns carry the hook, violas play it with them at the same
// pitch (viola and horn are a natural pair, and the violas cover the notes
// where the horn recordings are thin). Every doubling leaves out notes
// more than five semitones from its instrument's recordings.
//
// The layers each keep their own floor: basses and the gallop at the
// bottom, the counter-line in the tenor, the racing violins under the
// tune, the hook on top, the fiddle above it all in the payoff.
//
// 6/8 at 120 dotted quarters a minute; 12 steps to a bar, one step a 16th (a
// bar is exactly 1.0 second). The intro plays once (2 bars, `loopFrom: 1`
// skips it); then it loops from A, 108 bars, 1m48s:
//
//   intro    2 bars    0:00  the hook's first bar on soft horns over a drone,
//                            a heartbeat, an anvil, a swell in
//   A       16 bars    0:02  THE HOOK on horns and violas over the gallop,
//                            boots and timpani; second time round the
//                            trombones double it, the counter-line comes in
//                            and the basses dig into their groove
//   B       16 bars    0:18  the fiddle's second tune (the hook upside down);
//                            the crew sings it low and trumpets join the
//                            second time; fiddle runs; anvil on the fourth
//                            beat
//   C        8 bars    0:34  the build: the hook's first bar climbs Gm, Bb,
//                            C, A on brass over a snare roll and tremolo; it
//                            stops dead for the last beat
//   D       16 bars    0:42  the drop: gong, deep drum, BRAAAM; the hook on
//                            every brass seat at once, the counter-line under
//                            it
//   E       16 bars    0:58  the still sea, G minor: the hook slowly on a lone
//                            fiddle over soft horns, choir and a heartbeat;
//                            in the last 8 bars the drums creep back in
//   F        8 bars    1:14  the second build, no silence: the first bar
//                            again in D, Bb, Gm, A, a swell pulling in
//   G       16 bars    1:22  all hands, the payoff: the hook on every brass,
//                            the crew singing it, the fiddle an octave above
//                            and then climbing high over it
//   H       12 bars    1:38  home: the second tune soft and strong (horns
//                            and violas) so the hook rests, then the cell one
//                            last time, leaning on the A chord, a swell into A

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
// A doubling that leaves out any note more than five semitones from one of
// its instrument's recordings (the horns have a gap in the middle and the
// trombones run out at the top), so nothing sounds stretched.
const playable = (track, set) => track.map((n) => (
  typeof n === 'number' && SAMPLE_SETS[set].notes.every((r) => Math.abs(r - n) > 5) ? '.' : n));

// --- Harmony, a bar each ---
// The tune walks down a step under each of its peaks (Dm C, Dm Bb, Gm C),
// so the bass under the hook is D C D Bb G C G A: a falling line, the dark
// half of the swagger.
const TUNE_CHORDS = 'Dm C Dm Bb Gm C Gm A Dm C Dm Bb Gm C A Dm';
const B_HALF = 'Bb C Dm A Bb Gm Bb A';
const B_CHORDS = `${B_HALF} ${B_HALF}`;
const C_CHORDS = 'Gm Gm Bb Bb C C A A';
const E_CHORDS = 'Gm Gm Gm Eb Gm Eb A A';
const E_CHORDS_ALL = `${E_CHORDS} Gm Gm Bb Eb Gm Eb A A`;
const F_CHORDS = 'Dm Dm Bb Bb Gm Gm A A';
const H_CHORDS = `${B_HALF} Dm Bb A A`;
const INTRO_CHORDS = 'Dm Dm';
const G_CHORDS = TUNE_CHORDS;

// --- THE HOOK, two bars, sung three times climbing. Bar 1 is the coast
// cell with a kick in it, "a-DUM, a-DUM" (A D, D E: short-long, short-long,
// against the gallop's long-short); bar 2 leaps up and falls back down the
// scale (A, G F E). The second time the leap lands a step higher (B flat),
// the third time higher again (C, on the cell in G). Then the long answer
// comes down onto the A chord. 16 bars, one token an eighth. ---
const HOOK = 'A4 D5 - D5 E5 -   A5 - - G5 F5 E5';
const HOOK2 = 'A4 D5 - D5 E5 -   Bb5 - - A5 G5 F5';
const HOOK3 = 'D5 G5 - G5 A5 -   C6 - - Bb5 A5 G5';
const TUNE = tune(`
  ${HOOK}  ${HOOK2}  ${HOOK3}
  Bb5 - A5 G5 - F5   E5 - C#5 A4 - -
  ${HOOK}  ${HOOK2}  ${HOOK3}
  A5 - G5 E5 - C#5   D5 - - - - .
`);
// Under the second half of the tune: low horns and cellos in long notes,
// moving when the tune holds and holding when it runs, climbing while the
// tune falls. 16 bars.
const COUNTER_8 = `
  D3 - - - - -   C3 - - D3 E3 G3   F3 - - - - -   Bb2 - - C3 D3 F3
  G3 - - - - -   E3 - - F3 G3 Bb3  D3 - - - Bb2 -  A2 - - C#3 - E3
`;
const COUNTER = tune(`${COUNTER_8}
  D3 - - - - -   C3 - - D3 E3 G3   F3 - - - - -   Bb2 - - C3 D3 F3
  G3 - - - - -   E3 - - F3 G3 Bb3  C#3 - - E3 - G3  F3 - - - - .
`);
// The payoff's descant: the fiddle high over the hook's second half, one
// long note a bar, climbing D E F, F G G, then down onto the tonic.
const DESCANT = tune(`
  D6 - - - - -   E6 - - - - -   F6 - - - - -   F6 - - E6 D6 -
  G6 - - - - -   G6 - - F6 E6 -  E6 - - - C#6 -  D6 - - - - .
`);
// The second tune (the fiddle's): the hook's falling tail turned upside
// down, a long note and three steps UP, climbing to the top D and falling
// back the hook's way. 8 bars, played twice.
const SECOND = tune(`
  D5 - - E5 F5 G5    A5 - - G5 - E5
  F5 - - G5 A5 Bb5   C#6 - - - A5 -
  D6 - - C6 Bb5 A5   Bb5 - - A5 G5 F5
  F5 - G5 A5 - Bb5   A5 - - - - .
`);
// The still sea: the hook turned into G minor and slowed by the fiddle's
// bow (D G, G A; up to D and back; up to E flat and back).
const STILL = tune(`
  D5 G5 - G5 A5 -    D6 - - C6 Bb5 A5
  D5 G5 - G5 A5 -    Eb6 - - D6 C6 Bb5
  Bb5 - A5 G5 - F5   G5 - - - Eb5 -
  A5 - - C#6 - E6    E6 - - - - .
`);
// The cell in a new key, a bar each (2 bars per chord in the builds), in
// the hook's own kick.
const cellIn = (a, b, c) => `${a} ${b} - ${b} ${c} -`;
const BUILD_C = tune([
  cellIn('D5', 'G5', 'A5'), cellIn('D5', 'G5', 'A5'),
  cellIn('F5', 'Bb5', 'C6'), cellIn('F5', 'Bb5', 'C6'),
  cellIn('G5', 'C6', 'D6'), cellIn('G5', 'C6', 'D6'),
  'E5 A5 - A5 Bb5 -', 'E5 A5 - A5 C#6 -',
].join(' '));
const BUILD_F = tune([
  cellIn('A4', 'D5', 'E5'), cellIn('A4', 'D5', 'E5'),
  cellIn('F4', 'Bb4', 'C5'), cellIn('F4', 'Bb4', 'C5'),
  cellIn('D5', 'G5', 'A5'), cellIn('D5', 'G5', 'A5'),
  'E5 A5 - A5 Bb5 -', 'E5 A5 - A5 C#6 -',
].join(' '));
// The home bars: the cell one last time, then down onto A.
const HOME_TAIL = tune(`
  A4 D5 - D5 E5 -
  F5 - E5 D5 - Bb4
  C#5 - - E5 - -
  A4 - - - - .
`);
// Fiddle runs (16ths): dashes over a bar of the chord named.
const RUN_UP = run('A5 G5 F5 E5 D5 E5 F5 G5 A5 Bb5 C6 D6');
const RUN_A = run('E5 F5 G5 A5 Bb5 A5 G5 F5 E5 C#5 E5 A5');

// --- Patterns, a bar each ---
// The violins' wave: up the chord and back, 16ths. SWELL runs up into the
// tune's own octave, so it only plays in the loud sections; RACE starts
// from the chord's fifth an octave lower and stays under the tune.
const SWELL = [0, 7, 12, 'tenth', 12, 7, 0, 7, 12, 'tenth', 19, 'tenth'];
const RACE = [7, 12, 'tenth', 12, 7, 12, 'tenth', 12, 7, 12, 'tenth', 19];
// The gallop: a long, two short, twice, a lift on the end.
const GALLOP = [0, '.', 0, 0, '.', 0, 0, '.', 0, 0, 7, 7];
const ROOTS = [0, '-', '-', '-', '-', '-', 0, '-', '-', '-', 7, '.'];
const HEAVY = [0, '-', '-', '-', '-', '-', 0, '-', '-', 0, 7, '.'];
// The basses' groove, locked to the bass drum (one, four, and the "and"
// before the next one) with a kick back up the fifth into the next bar.
const DRIVE = [0, '-', '-', '.', 0, '.', 0, '-', '.', 0, 7, '.'];
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
  volume: 0.71,

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
    trumpetsBig: { ...ORCHESTRA.trumpets, volume: 0.3, pan: -0.15 },
    hornsLow: { ...ORCHESTRA.horns, volume: 0.36, pan: 0.1 },
    // The violas that sing the tune with the horns.
    violas: { sample: 'violas', volume: 0.2, attack: 0.03, release: 0.3, reverb: 0.4, pan: 0.2, humanize: { time: 0.006, volume: 0.08 } },
    trumpets: { ...ORCHESTRA.trumpets, volume: 0.36 },
    anvil: { sample: 'anvil', drum: 'sample', volume: 0.42, ring: true, reverb: 0.3, pan: -0.2 },
    stomp: { sample: 'tom', drum: 'sample', volume: 0.4, ring: true, reverb: 0.2, pan: -0.1, humanize: { time: 0.004, volume: 0.2 } },
    frame: { sample: 'frameDrum', drum: 'sample', volume: 0.3, ring: true, reverb: 0.3, humanize: { time: 0.004, volume: 0.2 } },
  },

  sections: {
    // The hook's first bar on soft horns over a drone, a heartbeat, an
    // anvil, a swell in.
    intro: tight('intro', {
      hornsSoft: tune('A4 D5 - D5 E5 -   A5 - - - - .'),
      lowTrem: sustained(INTRO_CHORDS, BAR, 0, 2),
      timpani: timp(INTRO_CHORDS, T_HEART6),
      anvil: [...rest(1), ...ANVIL4],
      swell: swellInto(2),
    }, 2),

    // THE HOOK on horns and violas over the gallop, boots and big timpani;
    // the second time round the trombones double it, the low horns and
    // cellos take the counter-line, and the basses dig into their groove.
    A: tight('A', {
      horns: playable(TUNE, 'horns'),
      violas: TUNE,
      trombones: [...rest(8), ...playable(transpose(TUNE, -12), 'trombone').slice(8 * BAR)],
      cellos: [...sustained(part(TUNE_CHORDS, 0, 8), BAR, 0, 2), ...COUNTER.slice(8 * BAR)],
      hornsLow: [...rest(8), ...COUNTER.slice(8 * BAR)],
      race: arpeggio(TUNE_CHORDS, BAR, 3, RACE),
      pound: chordLine(TUNE_CHORDS, GALLOP, 2),
      basses: [...chordLine(part(TUNE_CHORDS, 0, 8), ROOTS, 1), ...chordLine(part(TUNE_CHORDS, 8, 8), DRIVE, 1)],
      timpani: timp(TUNE_CHORDS, T_SIX),
      stomp: repeat(STOMP, 16),
      taiko: [...rest(4), ...repeat(TAIKO6, 12)],
      snare: [...rest(8), ...repeat(SNARE6, 7), ...SNARE_FILL],
      crash: [...once(CRASH1, 8), ...once(CRASH1, 8)],
    }, 16),

    // The fiddle's second tune; the crew sings it low; the fiddle runs wild.
    B: tight('B', {
      fiddle: [...SECOND.slice(0, 7 * BAR), ...RUN_A, ...SECOND.slice(0, 7 * BAR), ...RUN_UP],
      crew: [...rest(8), ...transpose(SECOND, -12)],
      trumpets: [...rest(8), ...SECOND],
      horns: sustained(B_CHORDS, BAR, 1, 3),
      hornsLow: sustained(B_CHORDS, BAR, 2, 3),
      race: arpeggio(B_CHORDS, BAR, 3, RACE),
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
      horns: playable(stopAt(transpose(BUILD_C, -12)), 'horns'),
      violas: stopAt(transpose(BUILD_C, -12)),
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

    // The drop: gong, deep drum, BRAAAM; the hook on every brass at once,
    // the counter-line under it, the basses digging in.
    D: tight('D', {
      gong: once(hits('x'), 16),
      impact: at(16, 0, 3 * BAR),
      braam: [...held('D3', 2 * BAR), ...rest(14)],
      braamLow: [...held('D2', 2 * BAR), ...rest(14)],
      horns: playable(TUNE, 'horns'),
      trumpets: TUNE,
      trombones: playable(transpose(TUNE, -12), 'trombone'),
      tuba: transpose(TUNE, -24),
      violins: TUNE,
      violas: TUNE,
      trumpetsBig: TUNE,
      cellos: COUNTER,
      hornsLow: [...rest(8), ...COUNTER.slice(8 * BAR)],
      race: arpeggio(TUNE_CHORDS, BAR, 3, RACE),
      pound: chordLine(TUNE_CHORDS, GALLOP, 2),
      basses: chordLine(TUNE_CHORDS, DRIVE, 1),
      crewSwell: sustained(TUNE_CHORDS, BAR, 2, 4),
      timpani: [...timp(part(TUNE_CHORDS, 0, 2), T_DROP6), ...timp(part(TUNE_CHORDS, 2, 14), T_SIX)],
      bassDrum: repeat(BASSDRUM, 16),
      stomp: repeat(STOMP_THREE, 16),
      taiko: repeat(TAIKO6, 16),
      taikoHigh: repeat(TAIKO_HI6, 16),
      snare: [...repeat(SNARE6, 7), ...SNARE_FILL, ...repeat(SNARE6, 7), ...SNARE_FILL],
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
      horns: playable(transpose(BUILD_F, -12), 'horns'),
      violas: transpose(BUILD_F, -12),
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

    // All hands, the payoff: the hook on every brass, the crew singing it,
    // the fiddle on it an octave up and then climbing high over it, the
    // counter-line, every drum.
    G: tight('G', {
      gong: once(hits('x'), 16),
      crash: [...once(CRASH1, 4), ...once(CRASH1, 4), ...once(CRASH1, 4), ...once(CRASH1, 4)],
      horns: playable(TUNE, 'horns'),
      violas: TUNE,
      trumpets: TUNE,
      trumpetsBig: TUNE,
      trombones: playable(transpose(TUNE, -12), 'trombone'),
      tuba: transpose(TUNE, -24),
      crew: transpose(TUNE, -12),
      impact: at(16, 0, 8 * BAR),
      fiddle: [...transpose(TUNE.slice(0, 8 * BAR), 12), ...DESCANT],
      cellos: COUNTER,
      hornsLow: COUNTER,
      race: arpeggio(G_CHORDS, BAR, 3, RACE),
      raceHigh: [...rest(8), ...arpeggio(part(G_CHORDS, 8, 8), BAR, 4, SWELL)],
      pound: chordLine(G_CHORDS, GALLOP, 2),
      basses: chordLine(G_CHORDS, DRIVE, 1),
      timpani: timp(G_CHORDS, T_SIX),
      bassDrum: repeat(BASSDRUM, 16),
      stomp: repeat(STOMP_THREE, 16),
      taiko: repeat(TAIKO6, 16),
      taikoHigh: repeat(TAIKO_HI6, 16),
      snare: [...repeat(SNARE6, 7), ...SNARE_FILL, ...repeat(SNARE6, 7), ...SNARE_FILL],
      anvil: repeat(ANVIL4, 16),
    }, 16),

    // Home: the fiddle's second tune soft and strong on horns and violas
    // (the hook rests, so it lands fresh when the loop comes round), then
    // the cell one last time, leaning on the A chord, a swell into A.
    H: tight('H', {
      horns: [...playable(SECOND.slice(0, 7 * BAR), 'horns'), ...rest(1), ...playable(HOME_TAIL, 'horns')],
      violas: [...SECOND.slice(0, 7 * BAR), ...rest(1), ...HOME_TAIL],
      fiddle: [...rest(8), ...transpose(HOME_TAIL, 12)],
      trombones: [...rest(8), ...transpose(HOME_TAIL, -12)],
      race: arpeggio(H_CHORDS, BAR, 3, RACE),
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
