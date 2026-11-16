import { melody, hits, repeat, arpeggio, chordLine, sustained, transpose, midi } from '../../audio/notation.js';
import { ORCHESTRA, timp, held } from './parts/usurper.js';
import { SAMPLE_SETS } from '../../audio/sampleSets.js';
import { EMBER_TICK } from './emberTheme.js';

// "Nothing Left to Burn": the ordinary fights in the ember lands (chapter
// 6). Out here the things that come at you have been cooking in the ground
// for a hundred years: toads with clinker for skin, heaps of slag that get
// up, little ones of the dragon's own kind. Hot, mean and in a hurry. Dark,
// never cheery: A minor, in seven, hand drums and an anvil, and a hook you
// can hum. All real recorded instruments.
//
// IN SEVEN: every bar is 7/8, grouped 2+2+3, so the third beat is always a
// little long and the bar trips over into the next one. That limp is the
// whole difference from the ash fights ("Ash in the Teeth", which runs
// straight 4/4): nothing here sits still.
//
// THE TICK is the area's ("Where the Ground Ticks", emberTheme.js): the same
// seven notes in the same order, re-barred from 16 steps into 14, so the
// half step at the end (F to E here) is crammed right up against the note
// before it and comes round faster than you expect. High up on a dry piano
// and a harp, over everything, never following the chords. A hi-hat
// ticks out of step under it, the crust cracking.
//
// THE HOOK is THE EMBER CELL (parts/chapter6.js) in A minor, in seven: A,
// B C, then E on the long beat, and F falling to E, the half step that goes
// out like an ember. It runs down to the low E, says the cell again,
// reaches up to A and sinks home through G sharp. First on the violins and
// violas in octaves, hammered on a grand piano in octaves with them; then
// low, on cellos, trombones and horns in unison, the violins ticking over
// them.
//
// UNDER IT: hand drums, all real: a frame drum on each group (the doum),
// a tenor drum and a high tenor drum (the teks), a low tom, a bass drum on
// the one and the long beat. An anvil on the one every other bar, like
// something being beaten flat. Spiccato cellos and basses heave on the
// 2+2+3. No shaker, no claps, no oom-pa-pa.
//
// THE CALL (B): a second tune, low and slow, on horns, trombones and cellos,
// D minor to B flat (the flat second, the one dark borrowed chord) and back
// to E. Then the violins answer it with the ember cell on D, landing on A.
//
// THE VENT (C, halfway through): the drums stop but for a low heartbeat. The
// tick keeps going, alone and too loud. A choir hums the hook at half
// speed, the piano holds it low, wind comes up out of the ground in gusts.
// Then the build (D): the ember cell climbing a step a bar on the brass
// (A, B flat, C, D) over a snare roll (the tick drops out for the B flat
// and C minor bars), the E major chord stacking up, and
// everything stops dead for the last beat.
//
// A minor, B flat (bII) the borrowed colour, E major to pull home. 7/8 at
// 150 BPM (a quarter), one step a 16th: 14 steps a bar, a bar 1.4
// seconds. The intro plays once (2 bars); then it loops from A, 64 bars,
// about 1m30s:
//
//   intro   2 bars  0:00  the tick and the cracks alone; the drums come in
//   A       8 bars  0:03  THE HOOK on violins, violas and piano in octaves
//   A1      8 bars  0:14  THE HOOK low on cellos, trombones and horns; the
//                         full kit, the anvil
//   B       8 bars  0:25  THE CALL on low brass and cellos, D minor to B flat
//   B1      8 bars  0:36  the call again; the violins answer with the cell
//   C       8 bars  0:48  THE VENT: no kit, a heartbeat, the tick alone, the
//                         hook at half speed on the choir, gusts
//   D       8 bars  0:59  the build: the cell climbing on the brass, a snare
//                         roll; stops dead on the last beat
//   E      16 bars  1:10  THE DROP: gong, deep drum, low brass; the hook on
//                         every seat, then a descant over it; home through E

const BAR = 14;
const tune = (text) => melody(text, 2);   // each token an 8th: 7 to a bar
const riff = (text) => melody(text, 1);   // each token a 16th
const rest = (bars) => Array(bars * BAR).fill('.');
const tight = (name, section, bars) => {
  for (const [track, steps] of Object.entries(section)) {
    if (steps.length !== bars * BAR) throw new Error(`Nothing Left to Burn ${name}: '${track}' is ${steps.length} steps, not ${bars} bars`);
  }
  return section;
};
const once = (pattern, bars) => [...pattern, ...Array(bars * BAR - pattern.length).fill('.')];
// Stop dead for the last beat (the long one).
const stopAt = (steps, keep = 8) => [...steps.slice(0, steps.length - BAR + keep), ...Array(BAR - keep).fill('.')];
// The cymbal swell is loudest 3.18 seconds in: about 32 steps at 150 BPM.
const SWELL_STEPS = 32;
const swellInto = (bars, keep = 0) => {
  const len = Math.min(SWELL_STEPS, bars * BAR - keep);
  return [...Array(bars * BAR - keep - len).fill('.'), ...held(60, len), ...Array(keep).fill('.')];
};
const beat = (pattern, bars) => repeat(hits(pattern), bars);
// A doubling that leaves out any note more than five semitones from one of
// its instrument's recordings, so nothing sounds stretched.
const playable = (track, set) => track.map((n) => (
  typeof n === 'number' && SAMPLE_SETS[set].notes.every((r) => Math.abs(r - n) > 5) ? '.' : n));
const half = (steps) => steps.flatMap((s) => [s, typeof s === 'number' ? '-' : s]);
const up = transpose;
const after = (bars, track) => [...rest(bars), ...track.slice(bars * BAR)];

// --- THE TICK, re-barred: the area's seven notes, 16 steps squeezed to 14 ---
const TICK_AT = [0, 3, 6, 8, 11, 12, 13];
const TICK7 = Array(BAR).fill('.');
EMBER_TICK.filter((s) => typeof s === 'number').forEach((s, i) => { TICK7[TICK_AT[i]] = s; });
const tick = (bars, tonic = 'A5') => repeat(TICK7.map((s) => (typeof s === 'number' ? midi(tonic) + s : s)), bars);
// The crust cracking: a hi-hat out of step (four bars that go round).
const CRACKS = ['x.x..xx.x.xx.x', '.xx.x..xx.x.xx', 'x..xx.x.x..xx.', '.x.x.xx..xx.x.'];
const cracks = (bars, from = 0) => Array.from({ length: bars }, (_, i) => hits(CRACKS[(i + from) % 4])).flat();

// --- Harmony, a bar each ---
const HOOK_CHORDS = 'Am F Dm E Am F E Am';
const HOOK_CHORDS_16 = `${HOOK_CHORDS} ${HOOK_CHORDS}`;
const B_CHORDS = 'Dm Bb F E Dm Bb Bb E';
const C_CHORDS = 'Am Am F F Dm Dm E E';
const D_CHORDS = 'Am Bb Cm Dm Dm E E E';

// --- THE HOOK, 8 bars of 7/8, one token an 8th, grouped 2+2+3 ---
const HOOK = tune(`
  A4 - B4 C5 E5 - - | F5 - E5 - - - . | F5 E5 D5 - C5 - D5 | B4 - - - E4 - - |
  A4 - B4 C5 E5 - - | A5 - G5 - F5 - E5 | D5 - C5 - B4 - G#4 | A4 - - - - . . |
`);
const HOOK16 = [...HOOK, ...HOOK];
// Over the drop's second half: the violins, high and long.
const DESCANT = tune(`
  C6 - - - - - - | C6 - - - A5 - - | D6 - - - C6 - - | B5 - - - G#5 - - |
  E5 - A5 - C6 - - | C6 - - - A5 - - | B5 - - - G#5 - B5 | A5 - - - - . . |
`);

// --- THE CALL (B), D minor to B flat ---
const CALL = tune(`
  A4 - - D5 C5 - A4 | Bb4 - - - F4 - - | A4 - - C5 Bb4 - A4 | G#4 - - - E4 - - |
  A4 - - D5 E5 - F5 | D5 - - - Bb4 - - | D5 - C5 - Bb4 - A4 | G#4 - - - - . . |
`);
// The violins' answer: the ember cell on D (D E F A, B flat to A), high,
// in 16ths over the B flat bars of the call. [bar, first step, tonic]
const CELL16 = [[0, 0], [1, 2], [2, 3], [3, 7], [6, 8], [8, 7]];   // [step, semitones]
const cellAt = (bars, at) => {
  const out = rest(bars);
  for (const [bar, step, tonic] of at) {
    CELL16.forEach(([s, n], i) => {
      out[bar * BAR + step + s] = midi(tonic) + n;
      const next = i + 1 < CELL16.length ? CELL16[i + 1][0] : 6 + 4;
      for (let h = s + 1; h < next && step + h < BAR; h++) out[bar * BAR + step + h] = '-';
    });
  }
  return out;
};
const ANSWER = cellAt(8, [[1, 4, 'D5'], [5, 4, 'D5']]);

// --- THE VENT: the hook's first four bars at half speed ---
const SLOW = half(HOOK.slice(0, 4 * BAR));

// --- THE BUILD: the ember cell climbing a step a bar, in 16ths ---
const cellOn = (a, b, c, d, e) => `${a} - ${b} ${c} - ${d} - - ${e} - - ${d} - -`;
const BUILD = riff(`
  ${cellOn('A4', 'B4', 'C5', 'E5', 'F5')} | ${cellOn('Bb4', 'C5', 'Db5', 'F5', 'Gb5')} |
  ${cellOn('C5', 'D5', 'Eb5', 'G5', 'Ab5')} | ${cellOn('D5', 'E5', 'F5', 'A5', 'Bb5')} |
  ${cellOn('D5', 'E5', 'F5', 'A5', 'Bb5')} | E4 - - - G#4 - - - B4 - - - D5 - |
  E5 - G#5 - B5 - - - - - - - - - | B5 - - - - - - - - - - - . . |
`);

// --- The strings: the cellos heave on 2+2+3, the basses walk ---
const HEAVE = [0, '-', 0, '.', 0, '-', 0, '.', 0, '-', '-', 0, 0, '.'];
const ROOTS = [0, '-', '-', '-', 0, '-', '-', '-', 7, '-', '-', 0, '-', '-'];
const LONG = [0, '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'];
const T_DRIVE = [0, '.', '.', '.', 0, '.', '.', '.', 0, '.', '.', 0, '.', '.'];
const T_HEART = [0, '.', '.', 0, ...Array(10).fill('.')];

// --- Drums, a bar each (2+2+3: the groups start on steps 0, 4 and 8) ---
const DOUM = 'x...x...x.....';
const TEK = '..x...x...x.xx';
const TENOR = 'x.......x..x..';
const TOMS = '......x.....x.';
const SNARE = '....x.......x.';
const SNARE_FILL = '....x...x.xxxx';
const SNARE_BUILD = 'x.x.x.x.x.x.x.';
const SNARE_ROLL = 'xxxxxxxxxxxxxx';
const KICK = 'x.......x.....';
const HEART = 'x..x..........';
const CRASH = 'x.............';
const ANVIL = `x.............${'.'.repeat(BAR)}`;
// Sparks: single high notes on the glass, here and there.
const sparks = (bars, at) => {
  const out = rest(bars);
  for (const [bar, step, note] of at) out[bar * BAR + step] = note;
  return out;
};

export const EMBER_BATTLE_THEME = {
  title: 'Nothing Left to Burn',
  bpm: 150,
  stepsPerBeat: 4,
  volume: 0.85,

  instruments: {
    ...ORCHESTRA,
    pound: { ...ORCHESTRA.pound, volume: 0.34 },
    basses: { ...ORCHESTRA.basses, volume: 0.42 },
    cellos: { ...ORCHESTRA.cellos, volume: 0.36 },
    impact: { ...ORCHESTRA.impact, volume: 0.55 },
    gong: { ...ORCHESTRA.gong, volume: 0.45 },
    braam: { ...ORCHESTRA.braam, volume: 0.5 },
    braamLow: { ...ORCHESTRA.braamLow, volume: 0.48 },
    crash: { ...ORCHESTRA.crash, volume: 0.28 },
    timpani: { ...ORCHESTRA.timpani, volume: 0.48 },
    snare: { ...ORCHESTRA.snare, volume: 0.3 },
    roll: { ...ORCHESTRA.roll, volume: 0.2 },
    swell: { ...ORCHESTRA.swell, volume: 0.36 },
    violins: { ...ORCHESTRA.violins, volume: 0.32 },
    violinsHigh: { ...ORCHESTRA.violinsHigh, volume: 0.24 },
    violas: { sample: 'violas', volume: 0.26, attack: 0.02, release: 0.25, reverb: 0.35, pan: -0.2, humanize: { time: 0.005, volume: 0.08 } },
    trumpets: { ...ORCHESTRA.trumpets, volume: 0.32 },
    horns: { ...ORCHESTRA.horns, volume: 0.4 },
    trombones: { ...ORCHESTRA.trombones, volume: 0.4 },
    tuba: { ...ORCHESTRA.tuba, volume: 0.4 },
    // The hook hammered on a grand piano, in octaves.
    pianoHi: { sample: 'grandPiano', volume: 0.28, ring: true, reverb: 0.3, pan: 0.1, humanize: { time: 0.004, volume: 0.1 } },
    pianoLo: { sample: 'grandPiano', volume: 0.26, ring: true, reverb: 0.3, pan: -0.1, humanize: { time: 0.004, volume: 0.1 } },
    // The tick: a dry piano and a harp, high; the crust cracking under it.
    tick: { sample: 'grandPiano', volume: 0.12, ring: true, reverb: 0.25, pan: 0.3, humanize: { time: 0.003, volume: 0.15 } },
    tickHarp: { sample: 'harp', volume: 0.12, ring: true, reverb: 0.25, pan: -0.3, humanize: { time: 0.003, volume: 0.15 } },
    cracks: { sample: 'hatClosed', drum: 'sample', volume: 0.08, ring: true, reverb: 0.2, pan: 0.35, humanize: { time: 0.004, volume: 0.45 } },
    // The vent: a low choir, a soft low piano, the wind.
    choir: { sample: 'choir', volume: 0.26, attack: 0.3, release: 0.8, reverb: 0.6 },
    pianoLow: { sample: 'grandPiano', volume: 0.22, ring: true, reverb: 0.45, muffle: 2000, humanize: { time: 0.008, volume: 0.15 } },
    wind: { sample: 'cymbalSwell', volume: 0.22, release: 0.3, reverb: 0.5, muffle: 1800 },
    lowTrem: { sample: 'cellosTrem', volume: 0.2, attack: 0.5, release: 0.6, reverb: 0.4, pan: -0.2 },
    sparks: { sample: 'glass', volume: 0.09, ring: true, reverb: 0.45, pan: -0.35, humanize: { time: 0.006, volume: 0.3 } },
    // The hand drums and the anvil.
    doum: { sample: 'frameDrum', drum: 'sample', volume: 0.4, ring: true, reverb: 0.2, humanize: { time: 0.003, volume: 0.15 } },
    tek: { sample: 'tenorDrumHigh', drum: 'sample', volume: 0.22, ring: true, reverb: 0.2, pan: 0.2, humanize: { time: 0.003, volume: 0.25 } },
    tenor: { sample: 'tenorDrum', drum: 'sample', volume: 0.42, ring: true, reverb: 0.25, humanize: { time: 0.004, volume: 0.15 } },
    toms: { sample: 'tom', drum: 'sample', volume: 0.34, ring: true, reverb: 0.25, pan: -0.15, humanize: { time: 0.004, volume: 0.2 } },
    kick: { sample: 'concertBassDrum', drum: 'sample', volume: 0.5, ring: true, reverb: 0.25 },
    anvil: { sample: 'anvil', drum: 'sample', volume: 0.16, ring: true, reverb: 0.35, pan: 0.15, humanize: { time: 0.003, volume: 0.15 } },
  },

  sections: {
    // The tick and the cracks alone; the drums come in.
    intro: tight('intro', {
      tick: tick(2),
      tickHarp: tick(2),
      cracks: cracks(2),
      lowTrem: sustained('Am Am', BAR, 0, 2),
      doum: after(1, beat(DOUM, 2)),
      tenor: after(1, beat(TENOR, 2)),
      toms: [...rest(1), ...hits('....x...x.xxxx')],
      sparks: sparks(2, [[0, 6, 84], [1, 3, 87]]),
      swell: swellInto(2),
    }, 2),

    // THE HOOK on violins, violas and piano in octaves.
    A: tight('A', {
      violins: HOOK,
      violas: up(HOOK, -12),
      pianoHi: HOOK,
      pianoLo: up(HOOK, -12),
      tick: tick(8),
      tickHarp: tick(8),
      cracks: cracks(8),
      pound: chordLine(HOOK_CHORDS, HEAVE, 2),
      basses: chordLine(HOOK_CHORDS, ROOTS, 2),
      timpani: timp(HOOK_CHORDS, T_DRIVE),
      doum: beat(DOUM, 8),
      tek: beat(TEK, 8),
      tenor: beat(TENOR, 8),
      kick: beat(KICK, 8),
      toms: [...beat(TOMS, 7), ...hits('....x...x.xxxx')],
      sparks: sparks(8, [[1, 10, 86], [4, 2, 84], [6, 12, 87]]),
      crash: once(hits(CRASH), 8),
    }, 8),

    // THE HOOK low on cellos, trombones and horns in unison; the violins
    // tick over it; the full kit, the anvil.
    A1: tight('A1', {
      cellos: up(HOOK, -12),
      trombones: playable(up(HOOK, -12), 'trombone'),
      horns: playable(up(HOOK, -12), 'horns'),
      tuba: playable(up(HOOK, -24), 'tuba'),
      pianoLo: up(HOOK, -12),
      violins: tick(8, 'A4'),
      tick: tick(8),
      tickHarp: tick(8),
      cracks: cracks(8, 2),
      pound: chordLine(HOOK_CHORDS, HEAVE, 2),
      basses: chordLine(HOOK_CHORDS, ROOTS, 2),
      timpani: timp(HOOK_CHORDS, T_DRIVE),
      doum: beat(DOUM, 8),
      tek: beat(TEK, 8),
      tenor: beat(TENOR, 8),
      toms: beat(TOMS, 8),
      snare: [...beat(SNARE, 7), ...hits(SNARE_FILL)],
      kick: beat(KICK, 8),
      anvil: repeat(hits(ANVIL), 4),
      sparks: sparks(8, [[2, 6, 85], [5, 12, 84]]),
      crash: [...once(hits(CRASH), 4), ...once(hits(CRASH), 4)],
    }, 8),

    // THE CALL on low brass and cellos, D minor to B flat.
    B: tight('B', {
      horns: playable(up(CALL, -12), 'horns'),
      trombones: playable(up(CALL, -12), 'trombone'),
      cellos: up(CALL, -12),
      violas: CALL,
      tick: tick(8),
      tickHarp: tick(8),
      cracks: cracks(8, 1),
      pound: chordLine(B_CHORDS, HEAVE, 2),
      basses: chordLine(B_CHORDS, LONG, 2),
      timpani: timp(B_CHORDS, T_DRIVE),
      doum: beat(DOUM, 8),
      tenor: beat(TENOR, 8),
      toms: beat(TOMS, 8),
      kick: beat(KICK, 8),
      crash: once(hits(CRASH), 8),
    }, 8),

    // The call again; the violins answer with the ember cell.
    B1: tight('B1', {
      horns: playable(up(CALL, -12), 'horns'),
      trombones: playable(up(CALL, -12), 'trombone'),
      tuba: playable(up(CALL, -24), 'tuba'),
      cellos: up(CALL, -12),
      violas: CALL,
      violins: ANSWER,
      pianoHi: ANSWER,
      tick: tick(8),
      tickHarp: tick(8),
      cracks: cracks(8, 3),
      pound: chordLine(B_CHORDS, HEAVE, 2),
      basses: chordLine(B_CHORDS, ROOTS, 2),
      timpani: timp(B_CHORDS, T_DRIVE),
      doum: beat(DOUM, 8),
      tek: beat(TEK, 8),
      tenor: beat(TENOR, 8),
      toms: beat(TOMS, 8),
      snare: [...beat(SNARE, 6), ...hits(SNARE_BUILD), ...hits(SNARE_ROLL)],
      kick: beat(KICK, 8),
      anvil: repeat(hits(ANVIL), 4),
      crash: once(hits(CRASH), 8),
    }, 8),

    // THE VENT: no kit, a heartbeat; the tick alone; the hook at half speed
    // on the choir, the piano low; gusts and sparks.
    C: tight('C', {
      choir: up(SLOW, -12),
      hornsSoft: [...rest(4), ...playable(up(SLOW.slice(4 * BAR), -24), 'hornsSoft')],
      pianoLow: up(SLOW, -24),
      tick: tick(8),
      tickHarp: tick(8),
      cracks: [...rest(2), ...cracks(6)],
      lowTrem: sustained(C_CHORDS, BAR, 0, 2),
      wind: [...swellInto(4), ...swellInto(4)],
      timpani: timp(C_CHORDS, T_HEART),
      kick: [...beat(HEART, 6), ...beat(KICK, 2)],
      doum: [...rest(6), ...beat(DOUM, 2)],
      sparks: sparks(8, [[0, 4, 84], [1, 9, 87], [2, 2, 85], [3, 12, 86], [5, 6, 84], [6, 1, 87], [7, 10, 86]]),
    }, 8),

    // The build: the ember cell climbing on the brass over a snare roll;
    // stops dead for the last beat.
    D: tight('D', {
      horns: stopAt(playable(up(BUILD, -12), 'horns')),
      trombones: stopAt(playable(up(BUILD, -12), 'trombone')),
      tuba: stopAt(playable(up(BUILD, -24), 'tuba')),
      trumpets: stopAt([...rest(4), ...BUILD.slice(4 * BAR)]),
      violas: stopAt(BUILD),
      violins: stopAt(up(BUILD, 12).map((n) => (typeof n === 'number' && n > 86 ? n - 12 : n))),
      tick: stopAt([...tick(1), ...rest(2), ...tick(5)]),
      tickHarp: stopAt([...tick(1), ...rest(2), ...tick(5)]),
      pound: stopAt(chordLine(D_CHORDS, HEAVE, 2)),
      basses: stopAt(chordLine(D_CHORDS, ROOTS, 2)),
      timpani: stopAt(timp(D_CHORDS, T_DRIVE)),
      doum: stopAt(beat(DOUM, 8)),
      tenor: stopAt(beat(TENOR, 8)),
      roll: stopAt([...rest(4), ...beat(SNARE_BUILD, 2), ...beat(SNARE_ROLL, 2)]),
      swell: swellInto(8, BAR - 8),
    }, 8),

    // THE DROP: gong, deep drum, low brass; the hook on every seat, then a
    // descant over it; home through E.
    E: tight('E', {
      gong: once(hits('x'), 16),
      impact: [...once(hits('x'), 8), ...once(hits('x'), 8)],
      braam: [...held('A2', 2 * BAR), ...rest(14)],
      braamLow: [...held('A1', 2 * BAR), ...rest(14)],
      trumpets: HOOK16,
      trombones: playable(up(HOOK16, -12), 'trombone'),
      horns: playable(up(HOOK16, -12), 'horns'),
      tuba: playable(up(HOOK16, -24), 'tuba'),
      cellos: up(HOOK16, -12),
      violins: HOOK16,
      violinsHigh: [...rest(8), ...DESCANT],
      violas: up(HOOK16, -12),
      pianoHi: HOOK16,
      pianoLo: up(HOOK16, -12),
      choir: up(HOOK16, -12),
      tick: tick(16),
      tickHarp: tick(16),
      cracks: cracks(16),
      pound: chordLine(HOOK_CHORDS_16, HEAVE, 2),
      basses: chordLine(HOOK_CHORDS_16, ROOTS, 2),
      timpani: timp(HOOK_CHORDS_16, T_DRIVE),
      doum: beat(DOUM, 16),
      tek: beat(TEK, 16),
      tenor: beat(TENOR, 16),
      toms: beat(TOMS, 16),
      snare: [...beat(SNARE, 7), ...hits(SNARE_FILL), ...beat(SNARE, 7), ...hits(SNARE_FILL)],
      kick: beat(KICK, 16),
      anvil: repeat(hits(ANVIL), 8),
      sparks: sparks(16, [[1, 6, 86], [5, 10, 84], [9, 3, 87], [13, 12, 85]]),
      crash: [...once(hits(CRASH), 4), ...once(hits(CRASH), 4), ...once(hits(CRASH), 4), ...once(hits(CRASH), 4)],
      wind: [...rest(14), ...swellInto(2)],
    }, 16),
  },

  order: ['intro', 'A', 'A1', 'B', 'B1', 'C', 'D', 'E'],
  loopFrom: 1,
};
