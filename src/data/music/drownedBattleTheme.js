import { melody, hits, repeat, arpeggio, chordLine, sustained, transpose } from '../../audio/notation.js';
import { ORCHESTRA, timp, held } from './parts/usurper.js';
import { SAMPLE_SETS } from '../../audio/sampleSets.js';

// "Dead Men's Weather": the coast fights from the Wreck Yard on, once the
// storm is in full. The same sea as "Cutlass Weather" (pirateBattleTheme.js),
// but it has stopped being fun: a drowned crew's chant, slower and heavier,
// stamping on a deck that isn't there any more, with a fiddle creaking like a
// rope under load. Still a shanty, still a hook to hum. All real recorded
// instruments; the waves are the real recorded sea (seaWaves).
//
// THE HOOK is Cutlass Weather's, sunk. Cutlass Weather opens on the coast
// cell, A D D E, and leaps up to A. Here the crew stamps the cell out on the
// boots (A, D, D: long, longer, short) and the step up is only a SEMITONE,
// E flat, which falls straight back: A D D Eb, D C A. That half step is the
// whole song's ache. Then, for two bars, the old hook comes back as it was
// (A D D, A G F E: Cutlass Weather's own second bar), like a crew remembering
// a better voyage, and the answer sinks home through E flat and A. Eight
// bars, D minor, sung twice.
//
// Everything else is made of the same few notes:
//   - every build climbs on the sunk cell, the step up always a semitone
//     (D G G Ab, F Bb Bb B, G C C Db, E A A Bb);
//   - the fiddle's creak is that semitone too, rocking on the stamp (A Bb A)
//     the whole way through, like a rope working against a cleat;
//   - the shantyman's call in B is Haddock's motif in minor (F E D, A: long,
//     short, long, longer), answered by the crew with the hook;
//   - the pivot plays the hook at half speed, first sunk a step into C minor,
//     then climbing back up to D.
//
// Harmony: D minor, the flat second (E flat) as the borrowed colour, a
// walking bass that drops at every peak of the tune (D, G, D, A, G, Eb, A,
// D). The one bright chord is the G major at the end of the C minor stretch,
// the way up and out. No claps, no oom-pa-pa, no bouncy afterbeats.
//
// 6/8 at 100 dotted quarters a minute (Cutlass Weather is 120); 12 steps to
// a bar, one step a 16th, so a bar is 1.2 seconds. The intro plays once
// (4 bars, `loopFrom: 1` skips it); then it loops from A, 104 bars, 2m05s:
//
//   intro    4 bars    0:00  a wave breaks; the fiddle's creak alone over a
//                            low tremolo D; the boots come in; the crew hums
//                            the sunk cell under its breath
//   A       16 bars    0:00  THE HOOK, the crew chanting it low with violas
//                            and trombones over the boots, the bass walking
//                            down; the second time horns, tuba and the
//                            counter-line join
//   B       16 bars    0:19  call and answer: the fiddle calls Haddock's
//                            motif (D minor, then G minor), the crew answers
//                            with the hook; the creak under every answer
//   C        8 bars    0:38  the build: the sunk cell climbs G, Bb, C, A on
//                            the brass over a snare roll; stops dead for the
//                            last beat
//   D       16 bars    0:48  the drop: gong, deep drum, BRAAAM; the hook on
//                            every brass seat, the crew, the violins; the
//                            fiddle's creak screams an octave up
//   E       16 bars    1:07  the pivot (about 54% in), under the water: no
//                            drums, the real sea breaking every two bars; the
//                            hook at half speed on a lone fiddle in C minor,
//                            then on soft horns back in D, the crew and the
//                            boots creeping back in
//   F        8 bars    1:26  the second build, no silence: the sunk cell on
//                            D, Bb, G, A, the boots doubling, a swell pulling
//   G       16 bars    1:36  all hands: the hook on every brass and the crew
//                            in two octaves, the fiddle an octave above, then
//                            a high descant over the answer
//   H        8 bars    1:55  home: the hook rests; the crew hums Haddock's
//                            call low, the horns lean down onto the A chord,
//                            the creak and the boots carry it round to A

const BAR = 12;
const tune = (text) => melody(text, 2);   // each token an eighth: 6 to a bar
const rest = (bars) => Array(bars * BAR).fill('.');
const tight = (name, section, bars) => {
  for (const [track, steps] of Object.entries(section)) {
    if (steps.length !== bars * BAR) throw new Error(`Dead Men's Weather ${name}: '${track}' is ${steps.length} steps, not ${bars} bars`);
  }
  return section;
};
const once = (pattern, bars) => [...pattern, ...Array(bars * BAR - pattern.length).fill('.')];
// Stop dead after the first `keep` steps of the last bar: the silent beat.
const stopAt = (steps, keep = 6) => [...steps.slice(0, steps.length - BAR + keep), ...Array(BAR - keep).fill('.')];
// The cymbal swell is loudest 3.18 seconds in: 32 steps at 100 BPM.
const SWELL_STEPS = 32;
const swellInto = (bars, keep = 0) => {
  const len = Math.min(SWELL_STEPS, bars * BAR - keep);
  return [...Array(bars * BAR - keep - len).fill('.'), ...held(60, len), ...Array(keep).fill('.')];
};
const at = (bars, ...steps) => Array.from({ length: bars * BAR }, (_, i) => (steps.includes(i) ? 'x' : '.'));
const part = (chords, from, count) => chords.split(/\s+/).slice(from, from + count).join(' ');
// Twice as slow: every step lasts two.
const slow = (steps) => steps.flatMap((s) => [s, typeof s === 'number' ? '-' : s]);
// A doubling that leaves out any note more than five semitones from one of
// its instrument's recordings, so nothing sounds stretched.
const playable = (track, set) => track.map((n) => (
  typeof n === 'number' && SAMPLE_SETS[set].notes.every((r) => Math.abs(r - n) > 5) ? '.' : n));
// Single hits of the real sea: [bar, note] (60 is the smallest wave, 67 the biggest).
const waves = (bars, events) => {
  const out = rest(bars);
  for (const [bar, note] of events) out[bar * BAR] = note;
  return out;
};

// --- Harmony, a bar each ---
const TUNE_CHORDS = 'Dm Gm Dm A Gm Eb A Dm';
const TUNE_CHORDS_16 = `${TUNE_CHORDS} ${TUNE_CHORDS}`;
const B_CHORDS = 'Dm Dm Dm Gm Gm Gm Gm Eb Dm Dm Dm Gm Gm Gm A A';
const C_CHORDS = 'Gm Gm Bb Bb Cm Cm A A';
const E_CHORDS = 'Cm Cm Fm Fm Cm Cm G G Dm Dm Gm Gm Dm Dm A A';
const F_CHORDS = 'Dm Dm Bb Bb Gm Gm A A';
const H_CHORDS = 'Dm Dm Gm Gm Eb Eb A A';
const INTRO_CHORDS = 'Dm Dm Dm Dm';

// --- THE HOOK, 8 bars, one token an eighth. ---
const TUNE = tune(`
  A4 - - D5 - D5    Eb5 - - D5 C5 A4
  A4 - - D5 - D5    A5 - - G5 F5 E5
  D5 - - G5 - G5    Bb5 - - G5 F5 Eb5
  D5 - - C#5 - A4   D5 - - - - .
`);
const TUNE16 = [...TUNE, ...TUNE];
// The counter-line (low horns, cellos): long notes, climbing while the tune
// falls.
const COUNTER = tune(`
  F3 - - - - -      G3 - - - Bb3 -    A3 - - - - -      C#4 - - E4 - -
  D4 - - - Bb3 -    G3 - - - Bb3 -    A3 - - C#4 - E4   D4 - - - - .
`);
const COUNTER16 = [...rest(8), ...COUNTER];
// The walking bass: down at every peak of the tune, a step into the next bar.
const BASS = tune(`
  D2 - - D2 - A1    G1 - - G1 - Bb1   D2 - - D2 - F2    A1 - - C#2 - A1
  G1 - - D2 - F2    Eb2 - - D2 - C#2  A1 - - A1 - C#2   D2 - - A1 - C2
`);
// The payoff's descant: the fiddle high over the answer, a long note a bar.
const DESCANT = tune(`
  F6 - - - - -      Eb6 - - D6 - -    F6 - - - - -      E6 - - - C#6 -
  D6 - - - - -      Eb6 - - - G6 -    F6 - - E6 - -     D6 - - - - .
`);

// --- The shantyman's call: Haddock's motif in minor (long, short, long,
// longer), two bars; the crew answers with the hook. ---
const CALL_D = tune('F5 - - E5 - D5   - - - A4 - -');
const CALL_G = tune('Bb5 - - A5 - G5  - - - D5 - -');
const ANSWERS = [
  TUNE.slice(0, 2 * BAR), TUNE.slice(4 * BAR, 6 * BAR),
  TUNE.slice(0, 2 * BAR), tune('D5 - - C#5 - A4   A4 - - - - .'),
];
const CALLS = [CALL_D, CALL_G, CALL_D, CALL_G];
// 16 bars: call, answer, call, answer...
const callsOnly = CALLS.flatMap((c) => [...c, ...rest(2)]);
const answersOnly = ANSWERS.flatMap((a) => [...rest(2), ...a]);

// --- The builds: the sunk cell, the step up always a semitone. ---
const BUILD_C = tune(`
  D4 - - G4 - G4    Ab4 - - G4 - -
  F4 - - Bb4 - Bb4  B4 - - Bb4 - -
  G4 - - C5 - C5    Db5 - - C5 - -
  E4 - - A4 - A4    Bb4 - - A4 - -
`);
const BUILD_F = tune(`
  A4 - - D5 - D5    Eb5 - - D5 - -
  F4 - - Bb4 - Bb4  B4 - - Bb4 - -
  D5 - - G5 - G5    Ab5 - - G5 - -
  E5 - - A5 - A5    Bb5 - - A5 - -
`);

// --- The pivot: the hook's first four bars at half speed, sunk a step into
// C minor, then back in D. ---
const SLOW_D = slow(TUNE.slice(0, 4 * BAR));
const SLOW_C = transpose(SLOW_D, -2);

// --- Home: the hook rests; Haddock's call low, then down onto A. ---
const HOME = tune(`
  F4 - - E4 - D4    - - - A3 - -      Bb4 - - A4 - G4   - - - D4 - -
  G4 - - Bb4 - Eb5  D5 - - C5 - Bb4   E5 - - D5 - C#5   A4 - - - - .
`);

// --- The fiddle's creak: the semitone rocking on the stamp, a bar a chord.
const CREAK_PAIR = { Dm: ['A4', 'Bb4'], Gm: ['A4', 'Bb4'], A: ['A4', 'Bb4'], Eb: ['G4', 'Ab4'], Bb: ['F4', 'Gb4'], Cm: ['G4', 'Ab4'], Fm: ['C5', 'Db5'], G: ['G4', 'Ab4'] };
const creak = (chords, shift = 0) => chords.split(/\s+/).filter(Boolean).flatMap((c) => {
  const [lo, hi] = CREAK_PAIR[c];
  return transpose(melody(`${lo} - - ${hi} ${lo} -   ${lo} - - ${hi} ${lo} -`, 1), shift);
});

// --- Patterns, a bar each ---
// The low strings heave: long, short, long, short (a quarter and an eighth).
const HEAVE = [0, '-', '-', '-', 0, '.', 0, '-', '-', '-', 0, '.'];
const ROOTS = [0, '-', '-', '-', '-', '-', 0, '-', '-', '-', 7, '.'];
const RACE = [7, 12, 'tenth', 12, 7, 12, 'tenth', 12, 7, 12, 'tenth', 19];
const T_SIX = [0, '.', '.', '.', '.', '.', 0, '.', '.', 0, -5, '.'];
const T_DROP6 = [0, '.', '.', '.', '.', '.', 0, '.', '.', 0, '.', '.'];
const T_HEART6 = [0, '.', '.', 0, ...Array(8).fill('.')];
const STOMP = hits('x.....x.....');         // the boots, on the one and the four
const STOMP_PICK = hits('x.....x...x.');    // and a scuff into the next bar
const STOMP_DOUBLE = hits('x..x..x..x..');
const BASSDRUM = hits('x.....x.....');
const TAIKO = hits('x.....x..x..');
const TAIKO_HI = hits('...x.....x.x');
const SNARE6 = hits('......x.....');
const SNARE_BUILD = hits('x.x.x.x.xxxx');
const SNARE_FILL = hits('x.x.xxxxxxxx');
const CHAIN = hits('......x.....');      // the anvil: a chain dropped on the deck
const CRASH1 = hits('x...........');

export const DROWNED_BATTLE_THEME = {
  title: "Dead Men's Weather",
  bpm: 100,
  stepsPerBeat: 6,
  volume: 0.77,

  instruments: {
    ...ORCHESTRA,
    race: { ...ORCHESTRA.race, volume: 0.2 },
    // The drop's hits a little under the usual, to keep the peaks with Cutlass Weather's.
    impact: { ...ORCHESTRA.impact, volume: 0.5 },
    crash: { ...ORCHESTRA.crash, volume: 0.3 },
    gong: { ...ORCHESTRA.gong, volume: 0.45 },
    bassDrum: { ...ORCHESTRA.bassDrum, volume: 0.5 },
    timpani: { ...ORCHESTRA.timpani, volume: 0.52 },
    taiko: { ...ORCHESTRA.taiko, volume: 0.45 },
    braam: { ...ORCHESTRA.braam, volume: 0.6 },
    braamLow: { ...ORCHESTRA.braamLow, volume: 0.55 },
    // The drowned crew: the choir, low and close.
    crew: { sample: 'choir', volume: 0.34, attack: 0.06, release: 0.4, reverb: 0.5, humanize: { time: 0.008, volume: 0.1 } },
    crewHigh: { sample: 'choir', volume: 0.22, attack: 0.08, release: 0.5, reverb: 0.55, pan: 0.15 },
    crewSwell: { sample: 'choir', volume: 0.26, attack: 0.5, release: 0.8, reverb: 0.6 },
    // The fiddle's creak: thin (the bottom cut away), close, a little rough.
    creak: { sample: 'soloViolin', volume: 0.3, release: 0.08, reverb: 0.25, pan: 0.3, filter: { type: 'highpass', frequency: 520, q: 0.8 }, humanize: { time: 0.008, volume: 0.15 } },
    fiddle: { sample: 'soloViolin', volume: 0.5, release: 0.15, reverb: 0.35, pan: 0.2, humanize: { time: 0.006, volume: 0.1 } },
    fiddleSoft: { sample: 'soloViolin', volume: 0.46, attack: 0.1, release: 0.6, reverb: 0.55, pan: 0.1 },
    lowTrem: { sample: 'cellosTrem', volume: 0.28, attack: 0.5, release: 0.6, reverb: 0.4, pan: -0.2 },
    violinsTrem: { sample: 'violinsTrem', volume: 0.18, attack: 0.4, release: 0.6, reverb: 0.45, pan: 0.2 },
    horns: { ...ORCHESTRA.horns, volume: 0.42 },
    hornsLow: { ...ORCHESTRA.horns, volume: 0.36, pan: 0.1 },
    trumpets: { ...ORCHESTRA.trumpets, volume: 0.34 },
    trumpetsBig: { ...ORCHESTRA.trumpets, volume: 0.28, pan: -0.15 },
    violas: { sample: 'violas', volume: 0.22, attack: 0.03, release: 0.3, reverb: 0.4, pan: 0.2, humanize: { time: 0.006, volume: 0.08 } },
    anvil: { sample: 'anvil', drum: 'sample', volume: 0.3, ring: true, reverb: 0.35, pan: -0.25 },
    stomp: { sample: 'tom', drum: 'sample', volume: 0.42, ring: true, reverb: 0.25, pan: -0.1, humanize: { time: 0.006, volume: 0.2 } },
    frame: { sample: 'frameDrum', drum: 'sample', volume: 0.32, ring: true, reverb: 0.3, humanize: { time: 0.004, volume: 0.2 } },
    // The real sea (seaWaves: a CC0 beach recording), left to ring.
    waves: { sample: 'seaWaves', volume: 0.16, ring: true, reverb: 0.25 },
  },

  sections: {
    // A wave breaks; the creak alone over a low D; the boots; the crew hums
    // the sunk cell.
    intro: tight('intro', {
      waves: waves(4, [[0, 66], [2, 63]]),
      lowTrem: sustained(INTRO_CHORDS, BAR, 0, 2),
      creak: creak(INTRO_CHORDS),
      stomp: [...rest(2), ...repeat(STOMP, 2)],
      crewSwell: [...rest(2), ...tune('A3 - - D4 - D4   Eb4 - - D4 - .')],
      timpani: [...rest(2), ...timp('Dm Dm', T_HEART6)],
      swell: swellInto(4),
    }, 4),

    // THE HOOK, the crew chanting it low; the second time horns, tuba and
    // the counter-line join.
    A: tight('A', {
      crew: transpose(TUNE16, -12),
      violas: TUNE16,
      trombones: playable(transpose(TUNE16, -12), 'trombone'),
      horns: [...rest(8), ...playable(TUNE, 'horns')],
      tuba: [...rest(8), ...transpose(TUNE, -24)],
      cellos: [...sustained(TUNE_CHORDS, BAR, 0, 2), ...COUNTER],
      hornsLow: COUNTER16,
      creak: creak(TUNE_CHORDS_16),
      pound: chordLine(TUNE_CHORDS_16, HEAVE, 2),
      basses: [...BASS, ...BASS],
      timpani: timp(TUNE_CHORDS_16, T_SIX),
      stomp: [...repeat(STOMP, 7), ...STOMP_PICK, ...repeat(STOMP, 7), ...STOMP_PICK],
      bassDrum: [...rest(8), ...repeat(BASSDRUM, 8)],
      anvil: [...rest(4), ...repeat(CHAIN, 12)],
      snare: [...rest(8), ...repeat(SNARE6, 7), ...SNARE_FILL],
      crash: [...once(CRASH1, 8), ...once(CRASH1, 8)],
    }, 16),

    // Call and answer: the fiddle calls Haddock's motif, the crew answers
    // with the hook, the creak under every answer.
    B: tight('B', {
      fiddle: callsOnly,
      hornsSoft: [...rest(8), ...playable(transpose(callsOnly.slice(8 * BAR), -12), 'hornsSoft')],
      crew: [...answersOnly.map((n) => (typeof n === 'number' ? n - 12 : n))],
      crewSwell: CALLS.flatMap((c, i) => [...sustained(part(B_CHORDS, i * 4, 2), BAR, 0, 3), ...rest(2)]),
      trombones: playable(transpose(answersOnly, -12), 'trombone'),
      violas: answersOnly,
      trumpets: [...rest(8), ...answersOnly.slice(8 * BAR)],
      creak: B_CHORDS.split(' ').flatMap((c, i) => (Math.floor(i / 2) % 2 ? creak(c) : rest(1))),
      cellos: sustained(B_CHORDS, BAR, 0, 2),
      pound: chordLine(B_CHORDS, HEAVE, 2),
      basses: chordLine(B_CHORDS, ROOTS, 1),
      timpani: timp(B_CHORDS, T_SIX),
      stomp: repeat(STOMP_PICK, 16),
      bassDrum: repeat(BASSDRUM, 16),
      taiko: [...rest(8), ...repeat(TAIKO, 8)],
      snare: [...repeat(SNARE6, 15), ...SNARE_FILL],
      anvil: repeat(CHAIN, 16),
      crash: [...once(CRASH1, 8), ...once(CRASH1, 8)],
    }, 16),

    // The build: the sunk cell climbs; it stops dead for the last beat.
    C: tight('C', {
      horns: playable(stopAt(BUILD_C), 'horns'),
      violas: stopAt(BUILD_C),
      trombones: playable(stopAt(transpose(BUILD_C, -12)), 'trombone'),
      tuba: stopAt(transpose(BUILD_C, -24)),
      trumpets: [...rest(4), ...stopAt(transpose(BUILD_C, 12)).slice(4 * BAR)],
      violinsTrem: stopAt(sustained(C_CHORDS, BAR, 0, 5)),
      lowTrem: stopAt(sustained(C_CHORDS, BAR, 0, 2)),
      crewSwell: [...rest(2), ...stopAt(sustained(C_CHORDS, BAR, 2, 3)).slice(2 * BAR)],
      race: stopAt(arpeggio(C_CHORDS, BAR, 3, RACE)),
      pound: stopAt(chordLine(C_CHORDS, HEAVE, 2)),
      basses: stopAt(chordLine(C_CHORDS, ROOTS, 1)),
      timpani: stopAt(timp(C_CHORDS, T_SIX)),
      stomp: stopAt(repeat(STOMP_PICK, 8)),
      taiko: stopAt(repeat(TAIKO, 8)),
      roll: stopAt([...rest(4), ...repeat(SNARE_BUILD, 4)]),
      swell: swellInto(8, BAR - 6),
    }, 8),

    // The drop: gong, deep drum, BRAAAM; the hook on every brass seat.
    D: tight('D', {
      gong: once(hits('x'), 16),
      impact: at(16, 0, 4 * BAR),
      braam: [...held('D3', 2 * BAR), ...rest(14)],
      braamLow: [...held('D2', 2 * BAR), ...rest(14)],
      horns: playable(TUNE16, 'horns'),
      trumpets: TUNE16,
      trombones: playable(transpose(TUNE16, -12), 'trombone'),
      tuba: transpose(TUNE16, -24),
      violins: TUNE16,
      violas: TUNE16,
      crew: transpose(TUNE16, -12),
      cellos: [...COUNTER, ...COUNTER],
      hornsLow: COUNTER16,
      creak: creak(TUNE_CHORDS_16, 12),
      race: arpeggio(TUNE_CHORDS_16, BAR, 3, RACE),
      pound: chordLine(TUNE_CHORDS_16, HEAVE, 2),
      basses: [...BASS, ...BASS],
      crewSwell: sustained(TUNE_CHORDS_16, BAR, 2, 3),
      timpani: [...timp(part(TUNE_CHORDS_16, 0, 2), T_DROP6), ...timp(part(TUNE_CHORDS_16, 2, 14), T_SIX)],
      bassDrum: repeat(BASSDRUM, 16),
      stomp: repeat(STOMP_PICK, 16),
      taiko: repeat(TAIKO, 16),
      taikoHigh: repeat(TAIKO_HI, 16),
      snare: [...repeat(SNARE6, 7), ...SNARE_FILL, ...repeat(SNARE6, 7), ...SNARE_FILL],
      anvil: repeat(CHAIN, 16),
      crash: [...once(CRASH1, 4), ...once(CRASH1, 4), ...once(CRASH1, 4), ...once(CRASH1, 4)],
    }, 16),

    // Under the water: no drums, the real sea; the hook at half speed, sunk
    // into C minor on a lone fiddle, then back in D on soft horns.
    E: tight('E', {
      waves: waves(16, [[0, 67], [2, 62], [4, 65], [6, 61], [8, 66], [10, 63], [12, 64]]),
      fiddleSoft: [...SLOW_C, ...rest(8)],
      hornsSoft: [...rest(8), ...playable(transpose(SLOW_D, -12), 'hornsSoft')],
      violas: [...rest(8), ...SLOW_D],
      lowTrem: sustained(E_CHORDS, BAR, 0, 2),
      crewSwell: [...rest(4), ...sustained(part(E_CHORDS, 4, 12), BAR, 1, 3)],
      violinsTrem: [...rest(8), ...sustained(part(E_CHORDS, 8, 8), BAR, 2, 4)],
      creak: [...rest(10), ...creak(part(E_CHORDS, 10, 6))],
      timpani: [...timp(part(E_CHORDS, 0, 8), T_HEART6), ...timp(part(E_CHORDS, 8, 8), T_SIX)],
      basses: [...rest(8), ...chordLine(part(E_CHORDS, 8, 8), ROOTS, 1)],
      stomp: [...rest(12), ...repeat(STOMP, 4)],
      frame: [...rest(8), ...repeat(STOMP_PICK, 8)],
      roll: [...rest(14), ...hits('x.x.x.x.xxxxxxxxxxxxxxxx')],
      swell: swellInto(16),
    }, 16),

    // The second build, no silence: the sunk cell again, climbing.
    F: tight('F', {
      horns: playable(transpose(BUILD_F, -12), 'horns'),
      violas: BUILD_F,
      trombones: playable(transpose(BUILD_F, -12), 'trombone'),
      tuba: transpose(BUILD_F, -24),
      crew: transpose(BUILD_F, -12),
      race: arpeggio(F_CHORDS, BAR, 3, RACE),
      pound: chordLine(F_CHORDS, HEAVE, 2),
      basses: chordLine(F_CHORDS, ROOTS, 1),
      crewSwell: sustained(F_CHORDS, BAR, 2, 3),
      timpani: timp(F_CHORDS, T_SIX),
      stomp: [...repeat(STOMP_PICK, 4), ...repeat(STOMP_DOUBLE, 4)],
      taiko: repeat(TAIKO, 8),
      snare: [...repeat(SNARE6, 3), ...repeat(SNARE_BUILD, 5)],
      swell: swellInto(8),
    }, 8),

    // All hands: the hook on every brass, the crew in two octaves, the
    // fiddle an octave above and then the descant.
    G: tight('G', {
      gong: once(hits('x'), 16),
      impact: at(16, 0, 8 * BAR),
      crash: [...once(CRASH1, 4), ...once(CRASH1, 4), ...once(CRASH1, 4), ...once(CRASH1, 4)],
      horns: playable(TUNE16, 'horns'),
      violas: TUNE16,
      trumpets: TUNE16,
      trumpetsBig: TUNE16,
      trombones: playable(transpose(TUNE16, -12), 'trombone'),
      tuba: transpose(TUNE16, -24),
      crew: transpose(TUNE16, -12),
      crewHigh: TUNE16,
      fiddle: [...transpose(TUNE, 12), ...DESCANT],
      cellos: [...COUNTER, ...COUNTER],
      hornsLow: [...COUNTER, ...COUNTER],
      race: arpeggio(TUNE_CHORDS_16, BAR, 3, RACE),
      pound: chordLine(TUNE_CHORDS_16, HEAVE, 2),
      basses: [...BASS, ...BASS],
      timpani: timp(TUNE_CHORDS_16, T_SIX),
      bassDrum: repeat(BASSDRUM, 16),
      stomp: repeat(STOMP_PICK, 16),
      taiko: repeat(TAIKO, 16),
      taikoHigh: repeat(TAIKO_HI, 16),
      snare: [...repeat(SNARE6, 7), ...SNARE_FILL, ...repeat(SNARE6, 7), ...SNARE_FILL],
      anvil: repeat(CHAIN, 16),
    }, 16),

    // Home: the hook rests. The crew hums Haddock's call low, the horns lean
    // down onto A, the creak and the boots carry it round.
    H: tight('H', {
      crew: [...HOME.slice(0, 4 * BAR), ...rest(4)],
      horns: [...rest(4), ...playable(HOME.slice(4 * BAR), 'horns')],
      violas: [...rest(4), ...HOME.slice(4 * BAR)],
      trombones: [...rest(4), ...playable(transpose(HOME.slice(4 * BAR), -12), 'trombone')],
      creak: creak(H_CHORDS),
      cellos: sustained(H_CHORDS, BAR, 0, 2),
      pound: chordLine(H_CHORDS, HEAVE, 2),
      basses: chordLine(H_CHORDS, ROOTS, 1),
      crewSwell: [...rest(4), ...sustained(part(H_CHORDS, 4, 4), BAR, 2, 3)],
      timpani: timp(H_CHORDS, T_SIX),
      stomp: [...repeat(STOMP, 7), ...STOMP_PICK],
      anvil: repeat(CHAIN, 8),
      snare: [...repeat(SNARE6, 6), ...rest(1), ...SNARE_FILL],
      waves: waves(8, [[6, 64]]),
      crash: once(CRASH1, 8),
      swell: swellInto(8),
    }, 8),
  },

  order: ['intro', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  loopFrom: 1,
};
