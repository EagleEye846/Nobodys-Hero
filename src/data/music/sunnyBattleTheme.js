import { melody, hits, repeat } from './parts/chapter4.js';
import { SAMPLE_SETS } from '../../audio/sampleSets.js';

// "Dandelion Lion Rag": the battle theme for Sunnyside's fights, a dandelion
// that thinks it's a lion and a hay bale that ran off in a straw hat. A real
// piano rag, the kind a cinema pianist would play under a chase in a silent
// film: the left hand striding (a low note on the beat, a chord on the
// off-beat, back and forth), the right hand all syncopation, tying notes over
// the beat so the tune always seems to trip forward. Then a little street
// band piles in, a clarinet, a trombone with a slide and no shame, a tuba and
// a piccolo, a brush on the snare and a wood-ish clop on a hand drum. It's a
// MINOR rag, the kind the pianist plays when the villain twirls his
// moustache: still bouncy and still silly, but sly and a bit sinister, never
// cheerful (a fight is a fight, even with a dandelion; ordinary battle
// themes stay in the minor). The first version was in F major and grinned
// the whole way round; it's kept in notes/music-backup-2026-11-01. Reference
// for the mood only: Toby Fox's silly fights (Undertale and Deltarune), the
// minor strains of the old ragtime composers, and Koji Kondo's knack for a
// tune you can sing after one go.
//
// THE CHAPTER'S TUNE (the "first cell", parts/chapter4.js): up a fourth, up
// a third, a step down; here in its minor form. In D minor it is A D F E,
// and the hook opens with it as four quick notes, the last one tied over the
// beat, "da-da-da-DAAH". The lion's growl in the second strain is the same
// cell, low on the trombone, getting giggled at by the clarinet. In the trio
// (G minor, where the cell is D G Bb A) it is the pickup to every phrase, and
// in the last strain it walks round the old ragtime circle (F#7, B7, E7, A7,
// home to D minor), the cell played on each chord in turn, so the same four
// intervals climb the stairs back to the hook. The one sharp colour is the
// A7 with a flat ninth (a B flat on top of it) at the end of the hook: the
// villain's chord.
//
// D minor, 120 BPM, one step a 16th note: a bar is 2 seconds. The intro
// plays once (2 bars, 4s); then it loops from A, 48 bars, 96 seconds:
//
//   intro   2 bars  a chromatic shuffle-in in octaves, then a run down
//   A       8 bars  THE HOOK on the piano alone over its own stride
//   B       8 bars  the lion growls (trombone) and the clarinet giggles
//                   back; then the whole band on the cell
//   A2      8 bars  the hook with the band: clarinet and piano in octaves,
//                   the tuba, the trombone smearing under it, the piccolo
//   C       8 bars  the trio, in G minor, stop-time: the band hits a beat
//                   and freezes, the tune hops through the gaps, the haybob
//                   rolls on the tom; the stride comes back for a run-in
//   D       8 bars  round the circle: the cell on F#7, B7, E7 and A7, a
//                   walking tuba, everybody; the band stops dead and the
//                   piano runs up alone into the hook
//   A3      8 bars  the payoff: the hook at its biggest, everybody on it
//                   (piano in octaves, clarinet, plucked strings, piccolo),
//                   the tuba walking, the trombone smearing; it lands home
//                   and the loop starts again with the piano alone
//
// The hook is heard at 0:04 (piano), 0:36 (band) and 1:24 (everybody),
// and its first four notes come back in every other section.

const BAR = 16;
const riff = (text) => melody(text, 1);   // each token a 16th
const steps = (text) => melody(text, 4);  // each token a quarter
const eighths = (text) => melody(text, 2);
const rest = (bars) => Array(bars * BAR).fill('.');
const up = (track, semitones) => track.map((n) => (typeof n === 'number' ? n + semitones : n));
// A track for bars `from` to `to` (counting from 0) of a longer one, silent elsewhere.
const only = (from, to, track) => track.map((n, i) => (i >= from * BAR && i < to * BAR ? n : '.'));
// Silences every track of a section from step `at` of its last bar (the
// band stopping dead), except the ones named in `keep`.
const stopAt = (section, at, keep = []) => Object.fromEntries(Object.entries(section).map(([name, track]) => [
  name, keep.includes(name) ? track : track.map((n, i) => (i >= track.length - BAR + at ? '.' : n)),
]));
// A doubling that leaves out any note too far from one of its instrument's
// recordings (the piccolo and the bells only have a few).
const playable = (track, set) => track.map((n) => (
  typeof n === 'number' && SAMPLE_SETS[set].notes.every((r) => Math.abs(r - n) > 2) ? '.' : n));
// Sections are joined track by track.
const join = (...parts) => Object.fromEntries(Object.keys(parts[0]).map((name) => [name, parts.flatMap((p) => p[name])]));

// --- Chords, written two to a bar (a half bar each), with sevenths: a rag
// lives on its dominant sevenths. ---
const PITCH = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const KINDS = { '': [0, 4, 7], m: [0, 3, 7], 7: [0, 4, 7, 10], 6: [0, 4, 7, 9] };
const chordOf = (symbol) => {
  const m = symbol.match(/^([A-G])([#b]?)(7|m|6)?$/);
  if (!m) throw new Error(`Dandelion Lion Rag: can't read the chord '${symbol}'`);
  const pc = (PITCH[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + 12) % 12;
  return { pc, tones: KINDS[m[3] ?? ''].map((i) => (pc + i) % 12) };
};
const halves = (text) => text.split(/\s+/).filter((t) => t && t !== '|').map(chordOf);
// The lowest note of pitch class `pc` at or above `low`.
const from = (low, pc) => low + (((pc - low) % 12) + 12) % 12;

// The stride: a low note on beats 1 and 3 (the root, or the fifth under it
// when a bar keeps the same chord), doubled an octave down; a close chord on
// beats 2 and 4. `stops` turns it into stop-time: one hit on the beat and one
// on the "and" of 2, then nothing for the rest of the bar.
function stride(text, stops = false) {
  const out = { pianoL: [], pianoLo: [], comp1: [], comp2: [], comp3: [] };
  halves(text).forEach((ch, i, all) => {
    const fifth = i % 2 === 1 && all[i - 1].pc === ch.pc;
    const low = fifth ? from(36, (ch.pc + 7) % 12) : from(38, ch.pc);
    const voicing = (ch.tones.length === 4 ? ch.tones.slice(1) : ch.tones).map((pc) => from(53, pc)).sort((a, b) => a - b);
    if (stops) {
      const first = i % 2 === 0;
      out.pianoL.push(...(first ? [low, '-', '.', '.', '.', '.', '.', '.'] : Array(8).fill('.')));
      out.pianoLo.push(...(first ? [low - 12, '-', '.', '.', '.', '.', '.', '.'] : Array(8).fill('.')));
      voicing.forEach((note, v) => out[`comp${v + 1}`].push(...(first ? [note, '-', '.', '.', '.', '.', note, '-'] : Array(8).fill('.'))));
      return;
    }
    out.pianoL.push(low, '-', '-', '.', '.', '.', '.', '.');
    out.pianoLo.push(low - 12, '-', '-', '.', '.', '.', '.', '.');
    voicing.forEach((note, v) => out[`comp${v + 1}`].push('.', '.', '.', '.', note, '-', '.', '.'));
  });
  return out;
}
// The tuba doubles the stride's low notes ("oom"), a little longer.
const oom = (bass) => bass.map((n, i) => (typeof n === 'number' ? n : bass[i - 1] !== '.' && i % 8 < 4 ? '-' : '.'));

const A_HALVES = 'Dm Dm | Dm D7 | Gm Gm | A7 A7 | Dm Dm | D7 Gm | Dm A7 | Dm Dm';
const B_HALVES = 'Dm Dm | A7 A7 | Dm Dm | D7 D7 | Gm Gm | Dm Dm | E7 A7 | Gm A7';
const C_HALVES = 'Gm Gm | Gm Gm | D7 D7 | D7 D7 | Gm Gm | Cm Cm | Gm D7 | Gm C#7';
const D_HALVES = 'F#7 F#7 | F#7 F#7 | B7 B7 | B7 B7 | E7 E7 | E7 E7 | A7 A7 | A7 A7';

// --- THE HOOK. Bar 1 is the cell (A D F E) with its last note tied over
// the beat; every bar after it ties a note across a beat somewhere. The B
// flat sneaking under the A in bar 1 is the sly bit; bar 7 lands on A7 with
// its flat ninth. ---
const HOOK_BARS = `
  A4 D5 F5 E5 | - - D5 - | F5 - E5 D5 | Bb4 - A4 -
  D5 - F5 - | A5 - - D6 | - - C6 - | A5 - F#5 -
  Bb5 - - A5 | - - G5 - | D5 - G5 - | Bb5 - A5 G5
  A5 - - G5 | - - E5 - | G5 - - E5 | - - C#5 -
  A4 D5 F5 E5 | - - D5 - | F5 - E5 D5 | Bb4 - A4 -
  F#5 - A5 - | C6 - - Eb6 | - - D6 - | Bb5 - D6 -
  D6 - A5 F5 | Bb5 - G5 E5 | G5 - E5 C#5 | Bb4 - G4 E4
`;
const HOOK = riff(`${HOOK_BARS} D4 - F4 A4 | D5 - - - | . . . . | . . . .`);
// The second time it lands and steps aside for the trio.
const HOOK2 = riff(`${HOOK_BARS} D5 - A4 - | F4 - D4 - | . . . . | . . . .`);

// --- B: the lion growls the cell; the clarinet giggles. Then
// everyone together, the cell in G minor and D minor, and a run home. ---
const GROWL = riff(`
  A2 - - D3 | - - F3 - | E3 - - D3 | - - . .
  . . . . | . . . . | . . . . | . . . .
  A2 - - D3 | - - F3 - | G3 - - F3 | - - D3 -
  . . . . | . . . . | . . . . | . . . .
  G2 - . . | Bb2 - . . | D3 - . . | Bb2 - . .
  D3 - . . | F3 - . . | A2 - . . | F3 - . .
  E3 - . . | G#2 - . . | A2 - . . | C#3 - . .
  G2 - . . | Bb2 - . . | A2 - . . | C#3 - . .
`);
const GIGGLE = riff(`
  . . . . | . . . . | . . . . | . . . .
  C#6 D6 C#6 D6 | E6 - . . | A5 B5 C#6 D6 | E6 - . .
  . . . . | . . . . | . . . . | . . . .
  F#5 G5 F#5 G5 | A5 - . . | D6 C6 A5 F#5 | D5 - . .
  D5 - G5 - | Bb5 - - A5 | - - G5 - | D5 - - -
  A4 - D5 - | F5 - - E5 | - - D5 - | A4 - - -
  G#4 B4 D5 E5 | G#5 - E5 - | G5 - E5 C#5 | A4 - G4 -
  Bb4 D5 G5 Bb5 | A5 - G5 - | E5 - C#5 - | A4 - G#4 -
`);

// --- The tuba walking under the last hook, a quarter a step, leaning into
// each new chord. ---
const WALK_A = steps(`
  D2 E2 F2 A2 | D3 C3 A2 F#2 | G2 A2 Bb2 D3 | A2 G2 E2 C#2
  D2 F2 A2 D3 | F#2 A2 G2 Bb2 | D2 F2 E2 C#2 | D2 A2 D3 .
`);

// --- The trombone's counter-line under the second hook: long notes that
// smear up into the next one from a half step below. ---
const SMEAR = eighths(`
  F3 - - - - - E3 F3 | F3 - - - F#3 - - - | G3 - - - - - F#3 G3 | A3 - - - G3 - E3 -
  F3 - - - - - E3 F3 | Eb4 - - - D4 - - - | D4 - - - C#4 - - - | D3 - A3 - D3 - . .
`);
// Dandelion seeds: a couple of high bell notes at the end of each bar.
const SEEDS = riff(`
  . . . . | . . . . | . . . . | A6 . F6 . | . . . . | . . . . | . . . . | A6 . F#6 .
  . . . . | . . . . | . . . . | G6 . Bb6 . | . . . . | . . . . | . . . . | G6 . C#7 .
  . . . . | . . . . | . . . . | A6 . F6 . | . . . . | . . . . | . . . . | Bb6 . D7 .
  . . . . | . . . . | . . . . | D7 . Bb6 . | . . . . | . . . . | F6 . A6 . | D7 - - -
`);

// --- C: the trio, stop-time. The band hits beat 1 and the "and" of 2; the
// tune hops in the gaps, every phrase picked up by the cell's first notes. ---
const TRIO = riff(`
  . . D4 G4 | Bb4 - A4 - | . . Bb4 D5 | G5 - . .
  . . Bb5 A5 | G5 - D5 - | . . A4 Bb4 | D5 - . .
  . . D4 F#4 | A4 - C5 - | . . Bb4 A4 | F#4 - . .
  . . D5 C5 | A4 - F#4 - | . . G4 A4 | C5 - Bb4 A4
  . . D4 G4 | Bb4 - A4 - | . . Bb4 D5 | G5 - . .
  . . Eb5 G5 | C6 - Bb5 - | . . Ab5 G5 | Eb5 - . .
  Bb5 A5 G5 F#5 | G5 - D5 - | C6 Bb5 A5 F#5 | D5 - C5 -
  Bb4 - G4 - | D4 - . . | . . . . | . Bb4 B4 C5
`);

// --- D: round the circle. The cell on each chord (5, 1, 3, 2 of it), then
// an answer; the last bar stops for the piano's run up into the hook. It is
// written a minor third up (on A7, D7, G7, C7) and played down there, on
// F#7, B7, E7 and A7, so that it lands on D minor. ---
const CIRCLE_BARS = `
  E5 A5 C#6 B5 | - A5 G5 - | E5 - C#5 - | E5 - G5 -
  A5 - - G5 | - - E5 - | C#5 - E5 - | A5 - - -
  A5 D6 F#6 E6 | - D6 C6 - | A5 - F#5 - | A5 - C6 -
  D6 - - C6 | - - A5 - | F#5 - A5 - | D6 - - -
  D5 G5 B5 A5 | - G5 F5 - | D5 - B4 - | D5 - F5 -
  G5 - - F5 | - - D5 - | B4 - D5 - | G5 - - -
  G5 C6 E6 D6 | - C6 Bb5 - | G5 - E5 - | G5 - Bb5 -
`;
const CIRCLE = up(riff(`${CIRCLE_BARS} C6 - . . | . . . . | . . . . | . . . .`), -3);
const CIRCLE_RUN = up(riff(`${CIRCLE_BARS} C6 - . . | . . . . | . . G4 A4 | Bb4 - B4 -`), -3);
// The tuba walks it, a quarter a step, leaning into each new root.
const WALK = up(steps(`
  A2 C#3 E3 G3 | A3 G3 E3 Eb3 | D3 F#3 A3 C4 | D3 C3 A2 Ab2
  G2 B2 D3 F3 | G3 F3 D3 Db3 | C3 E3 G3 Bb3 | C3 . . .
`), -3);
// The trombone holds the notes that lead each chord into the next.
const GUIDE = up(eighths(`
  C#4 - - - C#4 - - - | G3 - - - G3 - - - | F#3 - - - F#3 - - - | C4 - - - C4 - - -
  B3 - - - B3 - - - | F3 - - - F3 - - - | E3 - - - E3 - - - | Bb3 - . . . . . .
`), -3);

// --- The intro: a shuffle up in octaves, F# G G# A, then a run down the A7
// (with its flat ninth) and up the gap from F to G sharp into the hook. ---
const SHUFFLE = riff(`
  F#4 - . F#4 | . . G4 - | G#4 - . G#4 | . . A4 -
  A5 G5 F5 E5 | C#5 . A4 . | Bb4 . G4 . | E4 . F4 G#4
`);

// --- The kit: a brush on 2 and 4, a soft kick on 1 and 3, the clop of a
// hand drum on the rag's off-beats, and a fill every fourth bar. ---
const KICK = hits('x.......x.......');
const BRUSH = hits('....x.......x...');
const FILL = hits('....x...x.x.xxxx');
const CLOP = hits('..x...x...x.x.x.');
const STOPS = hits('x.....x.........');
const ROLL = hits('x...x...x.x.xxxx');
const brushes = (bars) => Array.from({ length: bars }, (_, i) => ((i + 1) % 4 === 0 ? FILL : BRUSH)).flat();
const crashOn = (bars, ...at) => Array.from({ length: bars }, (_, i) => (at.includes(i) ? ['x', ...Array(BAR - 1).fill('.')] : Array(BAR).fill('.'))).flat();
const kit = (bars = 8) => ({
  kick: repeat(KICK, bars),
  snare: brushes(bars),
  clop: repeat(CLOP, bars),
});

export const SUNNY_BATTLE_THEME = {
  title: 'Dandelion Lion Rag',
  bpm: 120,
  stepsPerBeat: 4,
  volume: 1.89,

  instruments: {
    // The rag piano: the right hand, the same an octave down for the loud
    // bits, the stride's low notes (doubled) and its three-note chords.
    pianoR: { sample: 'grandPiano', volume: 0.34, release: 0.15, reverb: 0.2, pan: 0.05, humanize: { time: 0.005, volume: 0.1 } },
    pianoR2: { sample: 'grandPiano', volume: 0.18, release: 0.15, reverb: 0.2, pan: 0.05, humanize: { time: 0.005, volume: 0.1 } },
    pianoL: { sample: 'grandPiano', volume: 0.3, release: 0.12, reverb: 0.15, pan: -0.1, humanize: { time: 0.005, volume: 0.1 } },
    pianoLo: { sample: 'grandPiano', volume: 0.16, release: 0.12, reverb: 0.15, pan: -0.1 },
    comp1: { sample: 'grandPiano', volume: 0.1, release: 0.08, reverb: 0.15, pan: -0.05, humanize: { time: 0.005, volume: 0.15 } },
    comp2: { sample: 'grandPiano', volume: 0.1, release: 0.08, reverb: 0.15, pan: 0, humanize: { time: 0.005, volume: 0.15 } },
    comp3: { sample: 'grandPiano', volume: 0.1, release: 0.08, reverb: 0.15, pan: 0.05, humanize: { time: 0.005, volume: 0.15 } },
    // The street band.
    clarinet: { sample: 'clarinet', volume: 0.3, attack: 0.01, release: 0.12, reverb: 0.22, pan: -0.25, humanize: { time: 0.006, volume: 0.1 } },
    trombone: { sample: 'trombone', volume: 0.26, attack: 0.03, release: 0.15, reverb: 0.25, pan: 0.3, humanize: { time: 0.006, volume: 0.1 } },
    tuba: { sample: 'tuba', volume: 0.26, attack: 0.01, release: 0.1, reverb: 0.15, pan: -0.05, humanize: { time: 0.005, volume: 0.1 } },
    piccolo: { sample: 'piccolo', volume: 0.12, attack: 0.01, release: 0.1, reverb: 0.3, pan: 0.3, humanize: { time: 0.005, volume: 0.1 } },
    pizz: { sample: 'violinsPizz', volume: 0.2, release: 0.1, reverb: 0.25, pan: 0.25, humanize: { time: 0.005, volume: 0.15 } },
    seeds: { sample: 'glock', volume: 0.1, ring: true, reverb: 0.45, pan: 0.4, echo: { time: 0.25, feedback: 0.25, mix: 0.25 } },
    // The kit, small: a brush, a soft kick, a clop, and a dry drum for the
    // stops (the track is still called claps; real claps sounded too jolly).
    kick: { drum: 'kick', volume: 0.36 },
    snare: { sample: 'snareSoft', drum: 'sample', volume: 0.2, release: 0.08, reverb: 0.2, humanize: { time: 0.004, volume: 0.25 } },
    clop: { sample: 'frameDrum', drum: 'sample', volume: 0.17, ring: true, reverb: 0.15, pan: 0.2, humanize: { time: 0.003, volume: 0.2 } },
    claps: { sample: 'tenorDrum', drum: 'sample', volume: 0.2, ring: true, reverb: 0.2, humanize: { time: 0.004, volume: 0.15 } },
    tom: { sample: 'tom', drum: 'sample', volume: 0.26, ring: true, reverb: 0.2, pan: -0.2, humanize: { time: 0.004, volume: 0.2 } },
    crash: { drum: 'crash', volume: 0.07 },
  },

  sections: {
    // In octaves, F# G G# A, syncopated; then the A7 stride and a run down.
    intro: {
      pianoR: SHUFFLE,
      pianoR2: up(SHUFFLE, -12),
      clarinet: only(0, 1, up(SHUFFLE, 12)),
      tuba: only(0, 1, up(SHUFFLE, -24)),
      ...join({ pianoL: rest(1), pianoLo: rest(1), comp1: rest(1), comp2: rest(1), comp3: rest(1) }, stride('A7 A7')),
      kick: [...rest(1), ...KICK],
      snare: [...hits('..x.......x...x.'), ...BRUSH],
      crash: crashOn(2, 1),
    },

    // THE HOOK, the piano alone over its own stride, a brush and a clop.
    A: {
      pianoR: HOOK,
      ...stride(A_HALVES),
      ...kit(),
      crash: crashOn(8, 0),
    },

    // The lion growls, the clarinet giggles; the tuba joins the stride.
    B: {
      trombone: GROWL,
      clarinet: GIGGLE,
      pianoR: only(4, 8, GIGGLE),
      ...stride(B_HALVES),
      tuba: oom(stride(B_HALVES).pianoL),
      ...kit(),
      tom: [...hits('x.....x...x.....'), ...rest(1), ...hits('x.....x...x...x.'), ...rest(5)],
      crash: crashOn(8, 0, 4),
    },

    // The hook with the whole band: clarinet and piano in octaves, the
    // trombone smearing under it, seeds on the bells, the piccolo on top
    // for the second half.
    A2: {
      pianoR: HOOK2,
      pianoR2: up(HOOK2, -12),
      clarinet: HOOK2,
      piccolo: only(4, 8, playable(up(HOOK2, 12), 'piccolo')),
      trombone: SMEAR,
      seeds: SEEDS,
      ...stride(A_HALVES),
      tuba: oom(stride(A_HALVES).pianoL),
      ...kit(),
      crash: crashOn(8, 0, 4),
    },

    // The trio, stop-time: the band hits and freezes, the tune hops through
    // the gaps on clarinet and plucked strings, the dry drum hits with the band,
    // the haybob rolls on the tom. The stride comes back for the last two bars.
    C: {
      clarinet: TRIO,
      pizz: TRIO,
      ...join(stride(C_HALVES.split('|').slice(0, 6).join(' '), true), stride(C_HALVES.split('|').slice(6).join(' '))),
      tuba: [...stride(C_HALVES, true).pianoL.slice(0, 6 * BAR), ...oom(stride(C_HALVES).pianoL).slice(6 * BAR)],
      claps: [...repeat(STOPS, 6), ...rest(2)],
      tom: [...rest(3), ...hits('........x.x.xxx.'), ...rest(3), ...ROLL],
      kick: [...repeat(hits('x.....x.........'), 6), ...repeat(KICK, 2)],
      snare: [...rest(6), ...BRUSH, ...hits('x.x.x.x.xxxxxxxx')],
      seeds: riff('. . . . | . . . . | . . . . | . . . . '.repeat(3) + 'D6 . G6 . | Bb6 - - - | . . . . | . . . . ' + '. . . . | . . . . | . . . . | . . . . '.repeat(4)),
      crash: crashOn(8, 0, 6),
    },

    // Round the circle with everybody, the tuba walking, the trombone on the
    // leading notes; then the band stops dead after the first beat of the
    // last bar and the piano runs up into the hook by itself.
    D: stopAt({
      pianoR: CIRCLE_RUN,
      pianoR2: up(CIRCLE, -12),
      clarinet: CIRCLE,
      piccolo: playable(up(CIRCLE, 12), 'piccolo'),
      trombone: GUIDE,
      tuba: WALK,
      ...stride(D_HALVES),
      ...kit(),
      crash: crashOn(8, 0, 4),
    }, 4, ['pianoR']),

    // The payoff: the piano's run lands on the hook with everybody at
    // once, the tuba walking under it, the trombone smearing, the
    // plucked strings an octave down, the piccolo and the bells on top.
    // It lands home on D, and the loop starts again with the piano alone.
    A3: {
      pianoR: HOOK,
      pianoR2: up(HOOK, -12),
      clarinet: HOOK,
      pizz: up(HOOK, -12),
      piccolo: playable(up(HOOK, 12), 'piccolo'),
      trombone: SMEAR,
      tuba: WALK_A,
      seeds: SEEDS,
      ...stride(A_HALVES),
      ...kit(),
      // The dry drum stamps the one and the three with the kick.
      claps: repeat(KICK, 8),
      tom: [...rest(7), ...ROLL],
      crash: crashOn(8, 0, 2, 4, 6),
    },
  },

  // The intro plays once; then the fight goes round from the hook.
  order: ['intro', 'A', 'B', 'A2', 'C', 'D', 'A3'],
  loopFrom: 1,
};
