import { melody, hits, repeat, arpeggio, chordLine, sustained, transpose } from '../../audio/notation.js';
import { ORCHESTRA, timp, held } from './parts/usurper.js';
import { SAMPLE_SETS } from '../../audio/sampleSets.js';

// "Ash in the Teeth": the ordinary fights in the ash wastes (chapter 6).
// Something comes up out of the grey, and the fire under the ground is
// still going. Dark, never cheery: C minor, a dry crackle all the way
// through, hand drums and low strings driving, and a hook you can hum. All
// real recorded instruments.
//
// THE HOOK is the area's EMBER CELL (parts/chapter6.js) crammed into 4/4
// and pushed: C, D Eb, up to G, then Ab falling to G, the half step that
// goes out like an ember. The answer runs down to D and the leap down to
// G; the second half climbs to B flat and sinks home through B natural.
// Eight bars, sung twice: first on a rough solo violin with the violins,
// then on the trumpets with trombones and horns under them and the solo
// violin an octave over.
//
// THE CRACKLE: a real shaker played in an uneven 16th pattern with loose
// accents, like wood popping in a fire, and the glass recordings throwing
// up a spark now and then. Under them, racing spiccato violins on a C, G,
// E flat figure (the ostinato, in a register the tune never sits in),
// spiccato cellos and basses heaving on the root, tenor drums and a tom
// for the hand drums, a snare on the back beat. No claps, no oom-pa-pa.
//
// THE CALL (B): a second tune in A flat, low on horns, trombones and cellos,
// pulling round to D flat (the flat second, the one dark borrowed chord)
// and back to G. Then the violins answer it with the ember cell.
//
// THE PIVOT (C, about 55% in): an ash storm. The drums drop out but for a
// low heartbeat; a choir hums the hook at half speed under a muffled cymbal
// swell, the piano keeps the ostinato low and soft, the sparks fly. Then
// the build (D): the ember cell climbs a step at a time on the brass over a
// snare roll, and everything stops dead for the last beat.
//
// C minor, D flat (bII) the borrowed colour, G major to pull home. 4/4 at
// 152 BPM, one step a 16th (a bar is about 1.6 seconds). The intro plays
// once (2 bars); then it loops from A, 64 bars, about 1m41s:
//
//   intro   2 bars  the crackle and the ostinato alone; the drums come in
//   A       8 bars  THE HOOK on a rough solo violin and the violins
//   A1      8 bars  THE HOOK on the trumpets, trombones and horns under,
//                   the solo violin an octave up; the full kit
//   B       8 bars  THE CALL on low brass and cellos, A flat to D flat
//   B1      8 bars  the call again; the violins answer with the ember cell
//   C       8 bars  THE ASH STORM: no kit, a heartbeat, the hook at half
//                   speed on the choir, the piano low, sparks
//   D       8 bars  the build: the ember cell climbing on the brass, a snare
//                   roll; stops dead on the last beat
//   E      16 bars  THE DROP: gong, deep drum, low brass; the hook on every
//                   seat, then a descant over it; home through G

const BAR = 16;
const tune = (text) => melody(text, 2);   // each token an 8th: 8 to a bar
const rest = (bars) => Array(bars * BAR).fill('.');
const tight = (name, section, bars) => {
  for (const [track, steps] of Object.entries(section)) {
    if (steps.length !== bars * BAR) throw new Error(`Ash in the Teeth ${name}: '${track}' is ${steps.length} steps, not ${bars} bars`);
  }
  return section;
};
const once = (pattern, bars) => [...pattern, ...Array(bars * BAR - pattern.length).fill('.')];
// Stop dead for the last beat.
const stopAt = (steps, keep = 12) => [...steps.slice(0, steps.length - BAR + keep), ...Array(BAR - keep).fill('.')];
// The cymbal swell is loudest 3.18 seconds in: about 32 steps at 152 BPM.
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
const part = (chords, from, count) => chords.split(/\s+/).slice(from, from + count).join(' ');

// --- Harmony, a bar each ---
const HOOK_CHORDS = 'Cm Ab Fm G Cm Eb G Cm';
const HOOK_CHORDS_16 = `${HOOK_CHORDS} ${HOOK_CHORDS}`;
const B_CHORDS = 'Ab Ab Eb Fm Db Eb Fm G';
const C_CHORDS = 'Cm Cm Ab Ab Fm Fm G G';
const D_CHORDS = 'Cm Db Eb Fm Fm G G G';

// --- THE HOOK, 8 bars, one token an 8th ---
const HOOK = tune(`
  C5 - D5 Eb5 - G5 - - | Ab5 - G5 - - - Eb5 F5 | G5 - F5 Eb5 - D5 - C5 | D5 - - - G4 - - - |
  C5 - D5 Eb5 - G5 - - | Bb5 - Ab5 - G5 - Eb5 - | F5 - Eb5 D5 - B4 - D5 | C5 - - - - - . . |
`);
const HOOK16 = [...HOOK, ...HOOK];
// Over the drop's second half: the solo violin, high and long.
const DESCANT = tune(`
  G6 - - - - - Eb6 - | C6 - - - - - Eb6 F6 | Ab6 - - - G6 - - - | B5 - - - D6 - - - |
  Eb6 - - - - - G6 - | G6 - - - - - Bb6 - | Ab6 - - - G6 - F6 - | G6 - - - - - . . |
`);
// The walking bass, a step into each bar.
const BASS = tune(`
  C2 - C2 - C3 - Bb2 - | Ab2 - Ab2 - Ab2 - G2 - | F2 - F2 - F3 - Eb2 - | G2 - G2 - B2 - G2 - |
  C2 - C2 - C3 - D3 - | Eb2 - Eb2 - Eb3 - F2 - | G2 - G2 - G3 - B2 - | C2 - C2 - G2 - C3 - |
`);

// --- THE CALL (B), A flat to D flat ---
const CALL = tune(`
  Eb5 - - Eb5 Db5 - C5 - | Ab4 - - - - - . . | Eb5 - - Eb5 F5 - G5 - | Ab5 - - G5 F5 - Eb5 - |
  Db5 - - Db5 C5 - Bb4 - | G4 - - - - - Ab4 Bb4 | C5 - - Bb4 Ab4 - G4 - | G4 - - - - - . . |
`);
// The violins' answer: the ember cell, high, after each half of the call.
const ANSWER = tune(`
  . . . . . . . . | . . Ab5 Bb5 C6 - Eb6 - | . . . . . . . . | . . . . . . . . |
  . . . . . . . . | . . F5 G5 Ab5 - C6 - | Db6 - C6 - - - . . | . . D6 - Eb6 D6 B5 - |
`);

// --- THE ASH STORM: the hook's first four bars at half speed ---
const SLOW = half(HOOK.slice(0, 4 * BAR));

// --- THE BUILD: the ember cell climbing a step a bar ---
const riff = (text) => melody(text, 1);   // each token a 16th
const cellOn = (a, b, c, d, e, f) => `${a} - ${b} ${c} - ${d} - - ${e} - - - ${f} - - -`;
const BUILD = riff(`
  ${cellOn('C4', 'D4', 'Eb4', 'G4', 'Ab4', 'G4')} | ${cellOn('Db4', 'Eb4', 'F4', 'Ab4', 'Bb4', 'Ab4')} |
  ${cellOn('Eb4', 'F4', 'G4', 'Bb4', 'C5', 'Bb4')} | ${cellOn('F4', 'G4', 'Ab4', 'C5', 'Db5', 'C5')} |
  ${cellOn('F4', 'G4', 'Ab4', 'C5', 'Db5', 'C5')} | G4 - - - B4 - - - D5 - - - F5 - - - |
  G4 - B4 - D5 - F5 - Ab5 - - - G5 - - - | G5 - - - - - - - - - - - . . . . |
`);

// --- The ostinato: C, G, E flat racing, on whatever chord is under it ---
const RACE = [12, 7, 'tenth', 7, 14, 7, 'tenth', 7, 12, 7, 'tenth', 7, 19, 7, 'tenth', 7];
const race = (chords) => arpeggio(chords, BAR, 4, RACE);
// The low strings heave: long, short, short.
const HEAVE = [0, '-', '-', 0, '.', '.', 0, '.', 0, '-', '-', 0, '.', '.', 0, '.'];
const ROOTS = [0, '-', '-', '-', '-', '-', '-', '-', 0, '-', '-', '-', 7, '-', '-', '-'];
const T_DRIVE = [0, '.', '.', 0, '.', '.', '.', '.', 0, '.', '.', 0, '.', '.', 7, '.'];
const T_HEART = [0, '.', '.', 0, ...Array(12).fill('.')];

// --- Drums, a bar each ---
// The crackle: uneven, loose, like wood popping.
const CRACKLE = ['x.xxx.x..xx.x.xx', 'xx.x.xx.x..xx.x.', 'x.x.xxx..x.xx.xx', '.xx.x.x.xx.x..xx'];
const crackle = (bars) => Array.from({ length: bars }, (_, i) => hits(CRACKLE[i % 4])).flat();
const TAIKO = 'x..x..x...x..x..';
const TAIKO_HI = '......x.......x.';
const TOMS = '..x....x..x...x.';
const SNARE = '....x.......x...';
const SNARE_FILL = '....x.......xxxx';
const SNARE_BUILD = 'x.x.x.x.x.x.x.x.';
const SNARE_ROLL = 'xxxxxxxxxxxxxxxx';
const KICK = 'x.....x...x.....';
const HEART = 'x..x............';
const CRASH = 'x...............';
// Sparks: single high notes on the glass, here and there.
const sparks = (bars, at) => {
  const out = rest(bars);
  for (const [bar, step, note] of at) out[bar * BAR + step] = note;
  return out;
};

export const ASH_BATTLE_THEME = {
  title: 'Ash in the Teeth',
  bpm: 152,
  stepsPerBeat: 4,
  volume: 0.88,

  instruments: {
    ...ORCHESTRA,
    race: { ...ORCHESTRA.race, volume: 0.2 },
    pound: { ...ORCHESTRA.pound, volume: 0.36 },
    basses: { ...ORCHESTRA.basses, volume: 0.42 },
    impact: { ...ORCHESTRA.impact, volume: 0.55 },
    gong: { ...ORCHESTRA.gong, volume: 0.45 },
    braam: { ...ORCHESTRA.braam, volume: 0.55 },
    braamLow: { ...ORCHESTRA.braamLow, volume: 0.5 },
    taiko: { ...ORCHESTRA.taiko, volume: 0.45 },
    crash: { ...ORCHESTRA.crash, volume: 0.3 },
    timpani: { ...ORCHESTRA.timpani, volume: 0.5 },
    // The rough fiddle: the bottom thinned, close.
    fiddle: { sample: 'soloViolin', volume: 0.42, release: 0.12, reverb: 0.3, pan: 0.15, filter: { type: 'highpass', frequency: 300, q: 0.7 }, humanize: { time: 0.006, volume: 0.1 } },
    violins: { ...ORCHESTRA.violins, volume: 0.3 },
    violinsHigh: { ...ORCHESTRA.violinsHigh, volume: 0.24 },
    violas: { sample: 'violas', volume: 0.2, attack: 0.03, release: 0.3, reverb: 0.4, pan: 0.2, humanize: { time: 0.006, volume: 0.08 } },
    trumpets: { ...ORCHESTRA.trumpets, volume: 0.34 },
    horns: { ...ORCHESTRA.horns, volume: 0.4 },
    trombones: { ...ORCHESTRA.trombones, volume: 0.4 },
    tuba: { ...ORCHESTRA.tuba, volume: 0.4 },
    // The storm: a low choir, a soft piano, the wind.
    choir: { sample: 'choir', volume: 0.26, attack: 0.3, release: 0.8, reverb: 0.6 },
    pianoLow: { sample: 'grandPiano', volume: 0.22, ring: true, reverb: 0.45, muffle: 2200, humanize: { time: 0.008, volume: 0.15 } },
    wind: { sample: 'cymbalSwell', volume: 0.22, release: 0.3, reverb: 0.5, muffle: 1800 },
    lowTrem: { sample: 'cellosTrem', volume: 0.22, attack: 0.5, release: 0.6, reverb: 0.4, pan: -0.2 },
    // The crackle and the hand drums.
    crackle: { sample: 'shaker', drum: 'sample', volume: 0.2, ring: true, reverb: 0.2, pan: 0.3, humanize: { time: 0.006, volume: 0.45 } },
    sparks: { sample: 'glass', volume: 0.09, ring: true, reverb: 0.45, pan: -0.35, humanize: { time: 0.006, volume: 0.3 } },
    toms: { sample: 'tom', drum: 'sample', volume: 0.36, ring: true, reverb: 0.25, pan: -0.15, humanize: { time: 0.005, volume: 0.2 } },
    kick: { sample: 'concertBassDrum', drum: 'sample', volume: 0.5, ring: true, reverb: 0.25 },
  },

  sections: {
    // The crackle and the ostinato alone; the drums come in.
    intro: tight('intro', {
      crackle: crackle(2),
      race: race('Cm Cm'),
      pound: [...rest(1), ...chordLine('Cm', HEAVE, 2)],
      taiko: [...rest(1), ...beat(TAIKO, 1)],
      lowTrem: sustained('Cm Cm', BAR, 0, 2),
      sparks: sparks(2, [[0, 6, 84], [1, 3, 87]]),
      swell: swellInto(2),
    }, 2),

    // THE HOOK on the rough fiddle and the violins.
    A: tight('A', {
      fiddle: HOOK,
      violins: HOOK,
      race: race(HOOK_CHORDS),
      pound: chordLine(HOOK_CHORDS, HEAVE, 2),
      basses: BASS,
      timpani: timp(HOOK_CHORDS, T_DRIVE),
      crackle: crackle(8),
      taiko: beat(TAIKO, 8),
      snare: [...beat(SNARE, 7), ...hits(SNARE_FILL)],
      kick: beat(KICK, 8),
      sparks: sparks(8, [[1, 10, 86], [4, 2, 84], [6, 14, 87]]),
      crash: once(hits(CRASH), 8),
    }, 8),

    // THE HOOK on the trumpets; trombones and horns under; the solo violin
    // an octave up; the full kit.
    A1: tight('A1', {
      trumpets: HOOK,
      trombones: playable(transpose(HOOK, -12), 'trombone'),
      horns: playable(transpose(HOOK, -24), 'horns'),
      tuba: playable(transpose(HOOK, -24), 'tuba'),
      fiddle: transpose(HOOK, 12),
      violinsHigh: HOOK,
      violas: transpose(HOOK, -12),
      race: race(HOOK_CHORDS),
      pound: chordLine(HOOK_CHORDS, HEAVE, 2),
      basses: BASS,
      timpani: timp(HOOK_CHORDS, T_DRIVE),
      crackle: crackle(8),
      taiko: beat(TAIKO, 8),
      taikoHigh: beat(TAIKO_HI, 8),
      toms: beat(TOMS, 8),
      snare: [...beat(SNARE, 7), ...hits(SNARE_FILL)],
      kick: beat(KICK, 8),
      sparks: sparks(8, [[2, 6, 85], [5, 12, 84]]),
      crash: [...once(hits(CRASH), 4), ...once(hits(CRASH), 4)],
    }, 8),

    // THE CALL on low brass and cellos, A flat to D flat.
    B: tight('B', {
      horns: playable(transpose(CALL, -12), 'horns'),
      trombones: playable(transpose(CALL, -12), 'trombone'),
      cellos: transpose(CALL, -12),
      violas: CALL,
      race: race(B_CHORDS),
      basses: chordLine(B_CHORDS, ROOTS, 2),
      pound: chordLine(B_CHORDS, HEAVE, 2),
      timpani: timp(B_CHORDS, T_DRIVE),
      crackle: crackle(8),
      taiko: beat(TAIKO, 8),
      toms: beat(TOMS, 8),
      snare: [...beat(SNARE, 7), ...hits(SNARE_FILL)],
      kick: beat(KICK, 8),
      crash: once(hits(CRASH), 8),
    }, 8),

    // The call again; the violins answer with the ember cell.
    B1: tight('B1', {
      horns: playable(transpose(CALL, -12), 'horns'),
      trombones: playable(transpose(CALL, -12), 'trombone'),
      tuba: playable(transpose(CALL, -24), 'tuba'),
      cellos: transpose(CALL, -12),
      violas: CALL,
      violins: ANSWER,
      trumpets: playable(ANSWER.map((n) => (typeof n === 'number' ? n - 12 : n)), 'trumpet'),
      race: race(B_CHORDS),
      basses: chordLine(B_CHORDS, ROOTS, 2),
      pound: chordLine(B_CHORDS, HEAVE, 2),
      timpani: timp(B_CHORDS, T_DRIVE),
      crackle: crackle(8),
      taiko: beat(TAIKO, 8),
      taikoHigh: beat(TAIKO_HI, 8),
      toms: beat(TOMS, 8),
      snare: [...beat(SNARE, 6), ...hits(SNARE_BUILD), ...hits(SNARE_ROLL)],
      kick: beat(KICK, 8),
      crash: once(hits(CRASH), 8),
    }, 8),

    // THE ASH STORM: no kit, a heartbeat; the hook at half speed on the
    // choir; the piano keeps the ostinato low; sparks.
    C: tight('C', {
      choir: transpose(SLOW, -12),
      hornsSoft: [...rest(4), ...playable(transpose(SLOW.slice(4 * BAR), -24), 'hornsSoft')],
      pianoLow: arpeggio(C_CHORDS, BAR, 3, RACE),
      lowTrem: sustained(C_CHORDS, BAR, 0, 2),
      wind: [...swellInto(4), ...swellInto(4)],
      timpani: timp(C_CHORDS, T_HEART),
      kick: [...beat(HEART, 6), ...beat(KICK, 2)],
      crackle: [...rest(2), ...crackle(6)],
      sparks: sparks(8, [[0, 4, 84], [1, 9, 87], [2, 2, 85], [3, 12, 86], [5, 6, 84], [6, 1, 87], [7, 10, 86]]),
    }, 8),

    // The build: the ember cell climbing on the brass over a snare roll;
    // stops dead for the last beat.
    D: tight('D', {
      horns: stopAt(playable(transpose(BUILD, -12), 'horns')),
      trombones: stopAt(playable(transpose(BUILD, -12), 'trombone')),
      tuba: stopAt(playable(transpose(BUILD, -24), 'tuba')),
      trumpets: stopAt([...rest(4), ...BUILD.slice(4 * BAR)]),
      violas: stopAt(BUILD),
      violins: stopAt(transpose(BUILD, 12).map((n) => (typeof n === 'number' && n > 88 ? n - 12 : n))),
      race: stopAt(race(D_CHORDS)),
      pound: stopAt(chordLine(D_CHORDS, HEAVE, 2)),
      basses: stopAt(chordLine(D_CHORDS, ROOTS, 2)),
      timpani: stopAt(timp(D_CHORDS, T_DRIVE)),
      crackle: stopAt(crackle(8)),
      taiko: stopAt(beat(TAIKO, 8)),
      roll: stopAt([...rest(4), ...beat(SNARE_BUILD, 2), ...beat(SNARE_ROLL, 2)]),
      swell: swellInto(8, BAR - 12),
    }, 8),

    // THE DROP: gong, deep drum, low brass; the hook on every seat, then a
    // descant over it; home through G.
    E: tight('E', {
      gong: once(hits('x'), 16),
      impact: [...once(hits('x'), 8), ...once(hits('x'), 8)],
      braam: [...held('C3', 2 * BAR), ...rest(14)],
      braamLow: [...held('C2', 2 * BAR), ...rest(14)],
      trumpets: HOOK16,
      trombones: playable(transpose(HOOK16, -12), 'trombone'),
      horns: playable(transpose(HOOK16, -24), 'horns'),
      tuba: playable(transpose(HOOK16, -24), 'tuba'),
      fiddle: [...transpose(HOOK, 12), ...DESCANT],
      violins: HOOK16,
      violas: HOOK16,
      choir: transpose(HOOK16, -12),
      race: race(HOOK_CHORDS_16),
      pound: chordLine(HOOK_CHORDS_16, HEAVE, 2),
      basses: [...BASS, ...BASS],
      timpani: timp(HOOK_CHORDS_16, T_DRIVE),
      crackle: crackle(16),
      taiko: beat(TAIKO, 16),
      taikoHigh: beat(TAIKO_HI, 16),
      toms: beat(TOMS, 16),
      snare: [...beat(SNARE, 7), ...hits(SNARE_FILL), ...beat(SNARE, 7), ...hits(SNARE_FILL)],
      kick: beat(KICK, 16),
      sparks: sparks(16, [[1, 6, 86], [5, 10, 84], [9, 3, 87], [13, 12, 85]]),
      crash: [...once(hits(CRASH), 4), ...once(hits(CRASH), 4), ...once(hits(CRASH), 4), ...once(hits(CRASH), 4)],
      wind: [...rest(14), ...swellInto(2)],
    }, 16),
  },

  order: ['intro', 'A', 'A1', 'B', 'B1', 'C', 'D', 'E'],
  loopFrom: 1,
};
