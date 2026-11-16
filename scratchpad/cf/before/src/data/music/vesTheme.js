import { melody, midi, transpose } from '../../audio/notation.js';
import {
  FLUTE, SOLO_VIOLIN, HARP, CONCERT_PIANO, STRING_SECTION, CELLO, CHOIR,
} from '../../audio/instruments.js';

// "Carried on the Wind": the theme of Ves (Vesper), for her heartfelt scenes. She prays
// in the chapel every evening for her mother, the village lamplighter, who
// climbed past the clouds to light the summit beacon and never came back;
// only her umbrella came down, carried on the wind. An original piece in F
// major built on one short motif (VES_MOTIF below): a catch of breath, a lift
// of a sixth, a little ache a half step higher, and a settling. The music box
// states it alone; the flute sings it over a rocking harp; the violin takes it
// with the flute in thirds beneath and climbs it in sequence; at the climax it
// soars an octave up while the cello sings it at half speed underneath, and
// last of all it turns upward instead of settling: her courage. A hushed bridge
// in D minor slows it right down (her grief) and turns it upside down in the
// cello, before it comes home and ends on a prayer's "amen" (the B-flat chord
// turning minor before the F), whose last C leads straight back into the motif.
// No drums: the only "percussion" is wind chimes and the gusts themselves.
// 70 BPM in 4/4, one step is a 16th note. About two and a half minutes; the
// music box intro plays once, then it loops from A.
//
//   intro   4 bars   the motif alone on a music box, then once more, reaching up
//   a       8 bars   the flute: the motif, a step higher, the motif, then in D minor
//   a2      8 bars   the violin, the flute a third below; it climbs in sequence C, D, E, F
//   b       8 bars   the climax: the motif an octave up, the cello at half speed below;
//                    then the minor-sixth version, and the heroic turn upward
//   bridge  8 bars   hushed, D minor: the motif at half speed on the piano, the violin
//                    prays, and the cello plays it upside down to lead home
//   home    8 bars   the motif again, the music box an octave above, then the amen

const BAR = 16;
const _ = '.';
const H = '-';
const silence = (bars) => Array(bars * BAR).fill(_);

// --- Ves's motif. One bar, six notes:
//   C5 C5 | A5 (held) | Bb5 | G5 | A5 (held)
//   16th 16th, dotted quarter, 8th, 8th, quarter  ("da-da DAAAH, da da DAH")
//   scale degrees 5 5 3' 4' 2' 3' (in F)
// The repeated note is a catch of breath; the leap of a major sixth is the
// gust that lifts her; the B-flat a half step above is the ache she carries;
// and it settles back onto the A. Over F it is hopeful; over D minor the
// same shape turns sad. It can always be known by its first three notes,
// "C-C, up to A".
//   tender (D minor, half speed): A4 A4 F5 - - - - - | G5 - E5 - F5 - - -
//   heroic (fast, marcato):       C5/C5 A5 - Bb5 - C6 - - | F6 - - - - - - -
//     (it climbs on past the ache instead of settling back)
// Exported so her other scenes can quote it.
export const VES_MOTIF = melody('C5/C5 A5 - - Bb5 G5 A5 -', 2);

// --- Chords, written a bar at a time ('|' between bars); a bar with two
// chords splits evenly. 'Bbm' is minor, 'C7' has a flat seventh.
const LETTER = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
function chordOf(symbol) {
  const m = symbol.match(/^([A-G])([#b]?)(m?)(7?)$/);
  if (!m) throw new Error(`Carried on the Wind: can't read the chord '${symbol}'`);
  const root = (LETTER[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + 12) % 12;
  const intervals = [0, m[3] ? 3 : 4, 7, ...(m[4] ? [10] : [])];
  return { root, third: intervals[1], tones: intervals.map((i) => (root + i) % 12) };
}
function spans(text) {
  return text.split('|').map((bar) => bar.trim().split(/\s+/).filter(Boolean)).filter((bar) => bar.length)
    .flatMap((bar) => bar.map((symbol) => ({ chord: chordOf(symbol), steps: BAR / bar.length })));
}
// The chord's root in the octave starting at `low` (a MIDI number).
const rootFrom = (chord, low) => low + (((chord.root - low) % 12) + 12) % 12;

// Broken chords: `shape` is one entry a step, cycling: semitones above the
// root, 't' the chord's own third, 'T' that third an octave up, 'TT' two up,
// '-' to hold and '.' to rest.
function broken(text, low, shape) {
  return spans(text).flatMap(({ chord, steps }) => Array.from({ length: steps }, (__, i) => {
    const p = shape[i % shape.length];
    if (p === H || p === _) return p;
    const third = { t: chord.third, T: chord.third + 12, TT: chord.third + 24 }[p];
    return rootFrom(chord, low) + (third ?? p);
  }));
}

// Held chords, voice-led: each voice moves to the nearest chord tone, and a
// tone the chords share is tied over rather than played again. `start` is the
// first voicing (MIDI numbers, low to high). Returns one line per voice.
function permutations(items, k) {
  if (k === 0) return [[]];
  return items.flatMap((item, i) => permutations([...items.slice(0, i), ...items.slice(i + 1)], k - 1).map((rest) => [item, ...rest]));
}
const nearest = (pc, ref) => ref + ((((pc - ref) % 12) + 18) % 12) - 6;
function voiced(text, start) {
  const lines = start.map(() => []);
  let prev = start;
  spans(text).forEach(({ chord, steps }, n) => {
    let best = null;
    let bestCost = Infinity;
    for (const pcs of permutations(chord.tones, start.length)) {
      const notes = pcs.map((pc, i) => nearest(pc, prev[i]));
      if (notes.some((note, i) => i && note <= notes[i - 1])) continue;
      // Stay near the first voicing, so the chords don't drift up or down.
      const cost = notes.reduce((sum, note, i) => sum + Math.abs(note - prev[i]) + 0.4 * Math.abs(note - start[i]), 0);
      if (cost < bestCost) [best, bestCost] = [notes, cost];
    }
    if (!best) throw new Error(`Carried on the Wind: can't voice the chord ${chord.tones}`);
    best.forEach((note, i) => {
      const tied = n > 0 && note === prev[i];
      lines[i].push(tied ? H : note, ...Array(steps - 1).fill(H));
    });
    prev = best;
  });
  return lines;
}

// Wind chimes: now and then, on an 8th, a chord tone rings high up and is left
// to ring until the next. Seeded, so the song sounds the same every time.
function chimes(text, chance, seed, low = midi('F6')) {
  let s = seed >>> 0;
  const rand = () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296;
  const out = spans(text).flatMap(({ chord, steps }) => Array.from({ length: steps }, (__, i) => {
    if (i % 2 || rand() > chance) return _;
    const pc = chord.tones[Math.floor(rand() * chord.tones.length)];
    return rootFrom({ root: pc }, low) + (rand() < 0.3 ? 12 : 0);
  }));
  let ringing = false;
  return out.map((step) => {
    if (typeof step === 'number') ringing = true;
    return step === _ && ringing ? H : step;
  });
}

// Gusts of wind: [bar it starts on, how many bars it blows], in a section `bars` long.
function gusts(bars, list) {
  const out = silence(bars);
  for (const [at, length] of list) {
    out[at * BAR] = 60;
    for (let i = 1; i < length * BAR; i++) out[at * BAR + i] = H;
  }
  return out;
}
const hush = (bars, note) => [note, ...Array(bars * BAR - 1).fill(H)];

// --- Patterns. ---
// The harp rocking in 8ths, up through the chord and back.
const HARP_ROCK = [0, H, 7, H, 12, H, 'T', H, 19, H, 'T', H, 12, H, 7, H];
// The harp flowing in 16ths, for the fuller parts: rising like an updraft.
const HARP_FLOW = [0, 7, 12, 'T', 19, 'T', 12, 7, 0, 7, 12, 'T', 19, 24, 19, 'T'];
// The harp in quarters, for the hush.
const HARP_SLOW = [0, H, H, H, 7, H, H, H, 12, H, H, H, 'T', H, H, H];
// The piano's left hand: a soft pulse of root, fifth, tenth, fifth.
const PIANO_PULSE = [0, H, H, H, 7, H, H, H, 'T', H, H, H, 7, H, H, H];
const PIANO_SLOW = [0, H, H, H, H, H, H, H, 7, H, H, H, H, H, H, H];
const HELD = [0, ...Array(BAR - 1).fill(H)];

// --- Chords for each part. ---
const INTRO_CHORDS = 'F | Dm | Bb | C';
const A_CHORDS = 'F | Dm | Bb | C | F | Dm | Gm C | F';
const A2_CHORDS = 'F | Dm | Bb | C | C7 | Dm | Gm | C';
const B_CHORDS = 'F | Dm | Bb | C | Dm | Bb | C | F';
const BRIDGE_CHORDS = 'Dm | Gm | Bb | A | Dm | Bb | C | C7';
const HOME_CHORDS = 'F | Dm | Bb | C | F | Dm | Bb Bbm | F';
const HOME_AMEN = 'Dm | Bb | Bb Bbm | F';

// --- Tunes. Each token is an 8th note (two steps); eight to a bar. 'C5/C5'
// is two 16ths: the motif's catch of breath. ---

// The intro: the motif alone on the music box, high, with nothing under it;
// an answer falling away; then the motif again, this time reaching up and
// left hanging. The low tines come in after the first bar.
const INTRO_BOX = melody(`
  C6/C6 A6 - - Bb6 G6 A6 - | F6 - - E6 D6 - - - | C6/C6 A6 - - Bb6 - C7 - | G6 - - - - - . . |
`, 2);
const INTRO_TINES = [
  ...silence(1),
  ...melody(`D4 - - - A4 - - - | Bb3 - - - F4 - - - | C4 - - - G4 - E4 - |`, 2),
];

// A: the flute sings it. The motif; a falling answer; the motif a step
// higher; a pause on G. The motif again; then its saddest form, the leap a
// minor sixth over D minor; and home.
const A_TUNE = melody(`
  C5/C5 A5 - - Bb5 G5 A5 - | F5 - - E5 D5 - - - | D5/D5 Bb5 - - C6 A5 Bb5 - | G5 - - - - - . . |
  C5/C5 A5 - - Bb5 G5 A5 - | A4/A4 F5 - - G5 E5 F5 - | Bb5 - A5 - G5 - E5 - | F5 - - - - - . . |
`, 2);
// The music box echoing the motif's first notes in the gaps.
const A_BOX = melody(`
  . . . . . . . . | . . . . . . C6/C6 A6 | . . . . . . . . | . . . . . . G5/G5 E6 |
  . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . A5 C6 F6 - |
`, 2);

// A': the violin takes it, with the flute a third below. Then it climbs: the
// motif on E, then on F, each a step higher than the last (the flute under
// the first playing the motif itself), and it hangs on a C7, waiting.
const A2_TUNE = melody(`
  C5/C5 A5 - - Bb5 G5 A5 - | F5 - - E5 D5 - E5 F5 | D5/D5 Bb5 - - C6 A5 Bb5 - | G5 - - - - - . . |
  E5/E5 C6 - - D6 Bb5 C6 - | F5/F5 D6 - - E6 C6 D6 - | D6 - - C6 Bb5 - G5 - | E5 - G5 - Bb5 - . . |
`, 2);
const A2_FLUTE = melody(`
  A4/A4 F5 - - G5 E5 F5 - | D5 - - C5 Bb4 - C5 D5 | Bb4/Bb4 G5 - - A5 F5 G5 - | E5 - - - - - . . |
  C5/C5 A5 - - Bb5 G5 A5 - | D5/D5 Bb5 - - C6 A5 Bb5 - | Bb5 - - A5 G5 - E5 - | C5 - E5 - G5 - . . |
`, 2);
const A2_BOX = melody(`
  . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . G5/G5 E6 |
  . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . |
`, 2);

// B: the climax. The motif soars an octave up on the flute, the violin
// doubling it below, and the cello sings it at half speed underneath. Then
// the minor-sixth version, a step higher, and last the heroic turn: instead
// of settling it climbs on, to a high C, and lands on the hopeful A.
const B_FLUTE = melody(`
  C6/C6 A6 - - Bb6 G6 A6 - | F6 - - E6 D6 - E6 F6 | D6/D6 Bb6 - - C7 A6 Bb6 - | G6 - - F6 E6 - - - |
  A5/A5 F6 - - G6 E6 F6 - | Bb5/Bb5 G6 - - A6 F6 G6 - | C6/C6 A6 - Bb6 - C7 - - | A6 - - - - - . . |
`, 2);
const B_VIOLIN = transpose(B_FLUTE, -12);
// The cello: the motif augmented (every note twice as long), then a line of its own.
const B_CELLO = melody(`
  C3 C3 A3 - - - - - | Bb3 - G3 - A3 - - - | Bb2 - - - - - D3 - | C3 - - - E3 - G3 - |
  D3 - - - - - F3 - | Bb2 - - - - - D3 - | C3 - - - E3 - Bb3 - | F3 - - - - - . . |
`, 2);

// The bridge: hushed, in D minor. The piano remembers the motif slowly, at
// half speed (her grief); then the violin prays it, and the cello answers
// with the motif upside down (the leap falling instead of rising) to lead home.
const BRIDGE_PIANO = melody(`
  A4 A4 F5 - - - - - | G5 - E5 - F5 - - - | Bb4 Bb4 G5 - - - F5 - | E5 - - - C#5 - - - |
  . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . |
`, 2);
const BRIDGE_VIOLIN = melody(`
  . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . |
  A4/A4 F5 - - G5 E5 F5 - | D5/D5 Bb5 - - A5 G5 F5 - | E5 - G5 - C6 - Bb5 - | A5 - - - G5 - . . |
`, 2);
const BRIDGE_CELLO = melody(`
  . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . |
  D3 - - - - - - - | Bb2 - - - - - - - | C4/C4 E3 - - D3 F3 E3 - | C3 - - - - - - - |
`, 2);

// Home: the motif once more, the music box ringing an octave above the
// flute, the violin joining for the end. Then the amen: D, D-flat, C, as the
// B-flat chord turns minor and settles on F; and that C is where the motif
// starts again when the song loops.
const HOME_FLUTE = melody(`
  C5/C5 A5 - - Bb5 G5 A5 - | F5 - - E5 D5 - - - | D5/D5 Bb5 - - C6 A5 Bb5 - | G5 - - - - - . . |
  C5/C5 A5 - - Bb5 G5 A5 - | A4/A4 F5 - - G5 E5 F5 - | D5 - - - Db5 - - - | C5 - - - - - - - |
`, 2);
const HOME_BOX = [
  ...transpose(HOME_FLUTE.slice(0, 4 * BAR), 12),
  ...melody(`. . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . F6 C6 A5 F5 |`, 2),
];
const HOME_VIOLIN = [...silence(4), ...HOME_FLUTE.slice(4 * BAR)];

// --- Accompaniment, built from the chords. ---
const strings = (chords) => {
  const [low, mid, high] = voiced(chords, [midi('A3'), midi('C4'), midi('F4')]);
  return { str1: low, str2: mid, str3: high };
};
const highStrings = (chords) => {
  const [low, high] = voiced(chords, [midi('D5'), midi('F5')]);
  return { strHi1: low, strHi2: high };
};
const choir = (chords) => {
  const [low, high] = voiced(chords, [midi('F4'), midi('A4')]);
  return { choir1: low, choir2: high };
};
const bass = (chords) => broken(chords, midi('C2'), HELD);

// --- Instruments. ---

// A music box: a little tine, bright and ringing, with a faint high shimmer,
// playing as if in the next room.
const MUSIC_BOX = {
  voices: [
    { harmonics: [1, 0, 0.32, 0, 0.14, 0, 0.05], level: 1 },
    { wave: 'sine', octave: 2, detune: 8, level: 0.07 },
  ],
  attack: 0.002, decay: 1.1, sustain: 0, release: 1.2, gate: 1,
  click: 0.025,
  humanize: { time: 0.012, volume: 0.18 },
  pan: 0.25,
  reverb: 0.5,
  echo: { time: 0.643, feedback: 0.3, mix: 0.28 },
};

// Wind chimes: thin metal tubes, their overtones out of tune with the note
// (about 2.76 and 5.4 times it), struck by the wind whenever it likes.
const CHIMES = {
  voices: [
    { wave: 'sine', level: 1 },
    { wave: 'sine', octave: 1, detune: 558, level: 0.25 },
    { wave: 'sine', octave: 2, detune: 520, level: 0.08 },
  ],
  attack: 0.002, decay: 1.6, sustain: 0, release: 1.8, gate: 1,
  humanize: { time: 0.12, volume: 0.6 },
  pan: 0.4,
  reverb: 0.7,
};

// A gust of wind: no note, just air, swelling in and opening up as it blows.
const WIND = {
  voices: [{ wave: 'sine', level: 0 }],
  sweep: { from: 250, to: 1400, time: 2.8, q: 1.2 },
  attack: 2, decay: 2.5, sustain: 0.7, release: 2.4, gate: 1,
  breath: { level: 1, frequency: 900, q: 0.5 },
  pan: -0.3,
  reverb: 0.5,
};
// High, airy shimmer: thin air above the clouds.
const AIR = {
  voices: [{ wave: 'sine', level: 0 }],
  attack: 2.5, decay: 3, sustain: 0.85, release: 3, gate: 1,
  breath: { level: 1, frequency: 5200, q: 0.5 },
  pan: 0.3,
  reverb: 0.6,
};

// A felted piano: the concert grand, softened, close by.
const FELT_PIANO = { ...CONCERT_PIANO, filter: { type: 'lowpass', frequency: 2600 } };

// A soft round bass under everything.
const SOFT_BASS = {
  harmonics: [1, 0.3, 0.08],
  attack: 0.06, decay: 1.5, sustain: 0.6, release: 1.2, gate: 1,
  humanize: { time: 0.01, volume: 0.1 },
  reverb: 0.3,
};

// The flute: warm and breathy, a little more air than usual, the wind in it.
const WARM_FLUTE = {
  ...FLUTE,
  breath: { level: 0.14, frequency: 2200, q: 0.7 },
  vibrato: { rate: 4.8, depth: 10, delay: 0.35 },
  reverb: 0.55,
};

export const VES_THEME = {
  title: 'Carried on the Wind',
  bpm: 70,
  stepsPerBeat: 4,
  loopFrom: 1,

  instruments: {
    musicBox: { ...MUSIC_BOX, volume: 0.075 },
    tines: { ...MUSIC_BOX, volume: 0.045, pan: -0.15, echo: undefined },
    flute: { ...WARM_FLUTE, volume: 0.06, echo: { time: 0.643, feedback: 0.25, mix: 0.2 } },
    violin: { ...SOLO_VIOLIN, volume: 0.11, echo: { time: 0.643, feedback: 0.2, mix: 0.15 } },
    harp: { ...HARP, volume: 0.035 },
    piano: { ...FELT_PIANO, volume: 0.1, pan: 0.1, echo: { time: 0.857, feedback: 0.25, mix: 0.2 } },
    pianoLow: { ...FELT_PIANO, volume: 0.045, pan: -0.15 },
    str1: { ...STRING_SECTION, volume: 0.032, pan: -0.35 },
    str2: { ...STRING_SECTION, volume: 0.03, pan: 0 },
    str3: { ...STRING_SECTION, volume: 0.034, pan: 0.35 },
    strHi1: { ...STRING_SECTION, volume: 0.04, pan: -0.25 },
    strHi2: { ...STRING_SECTION, volume: 0.04, pan: 0.25 },
    cello: { ...CELLO, volume: 0.045 },
    bass: { ...SOFT_BASS, volume: 0.03 },
    choir1: { ...CHOIR, volume: 0.02, pan: -0.2 },
    choir2: { ...CHOIR, volume: 0.02, pan: 0.2 },
    chimes: { ...CHIMES, volume: 0.016 },
    wind: { ...WIND, volume: 0.03 },
    air: { ...AIR, volume: 0.012 },
  },

  sections: {
    // The motif alone on a music box, a breath of wind far off.
    intro: {
      musicBox: INTRO_BOX,
      tines: INTRO_TINES,
      wind: gusts(4, [[1, 3]]),
    },
    // The flute sings it over the rocking harp and a soft bed of strings.
    a: {
      flute: A_TUNE,
      musicBox: A_BOX,
      harp: broken(A_CHORDS, midi('E3'), HARP_ROCK),
      ...strings(A_CHORDS),
      bass: bass(A_CHORDS),
      chimes: chimes(A_CHORDS, 0.05, 11),
      wind: gusts(8, [[2, 2], [6, 2]]),
    },
    // The violin takes it, the flute a third below; the piano and cello join,
    // the harp flows, and the motif climbs step by step and waits on a C7.
    a2: {
      violin: A2_TUNE,
      flute: A2_FLUTE,
      musicBox: A2_BOX,
      harp: broken(A2_CHORDS, midi('G3'), HARP_FLOW),
      pianoLow: broken(A2_CHORDS, midi('E2'), PIANO_PULSE),
      cello: broken(A2_CHORDS, midi('A2'), HELD),
      ...strings(A2_CHORDS),
      bass: bass(A2_CHORDS),
      chimes: chimes(A2_CHORDS, 0.06, 23),
      wind: gusts(8, [[3, 2]]),
    },
    // The climax: everything swells, the motif soars an octave up over the
    // cello's slow echo of it, and the wind lifts it.
    b: {
      flute: B_FLUTE,
      violin: B_VIOLIN,
      harp: broken(B_CHORDS, midi('G3'), HARP_FLOW),
      pianoLow: broken(B_CHORDS, midi('E2'), PIANO_PULSE),
      cello: B_CELLO,
      ...strings(B_CHORDS),
      ...highStrings(B_CHORDS),
      ...choir(B_CHORDS),
      bass: bass(B_CHORDS),
      chimes: chimes(B_CHORDS, 0.1, 37),
      wind: gusts(8, [[0, 3], [4, 3]]),
      air: hush(8, 72),
    },
    // Hushed: the piano alone with the motif, slow, in D minor while the wind
    // blows through; then the violin prays it, and the cello's upside-down
    // motif and the harp lead it home.
    bridge: {
      piano: BRIDGE_PIANO,
      violin: BRIDGE_VIOLIN,
      pianoLow: broken(BRIDGE_CHORDS, midi('D2'), PIANO_SLOW),
      harp: [...silence(4), ...broken(BRIDGE_CHORDS, midi('E3'), HARP_SLOW).slice(4 * BAR)],
      cello: BRIDGE_CELLO,
      ...strings(BRIDGE_CHORDS),
      chimes: chimes(BRIDGE_CHORDS, 0.08, 51),
      wind: gusts(8, [[0, 2], [2, 2], [4, 2], [6, 2]]),
      air: hush(8, 72),
    },
    // Home: the motif with the music box above it, and the amen.
    home: {
      flute: HOME_FLUTE,
      musicBox: HOME_BOX,
      violin: HOME_VIOLIN,
      harp: broken(HOME_CHORDS, midi('E3'), HARP_ROCK),
      pianoLow: broken(HOME_CHORDS, midi('E2'), PIANO_PULSE),
      ...strings(HOME_CHORDS),
      choir1: [...silence(4), ...choir(HOME_AMEN).choir1],
      choir2: [...silence(4), ...choir(HOME_AMEN).choir2],
      bass: bass(HOME_CHORDS),
      chimes: chimes(HOME_CHORDS, 0.05, 67),
      wind: gusts(8, [[0, 2], [5, 3]]),
    },
  },

  order: ['intro', 'a', 'a2', 'b', 'bridge', 'home'],
};
