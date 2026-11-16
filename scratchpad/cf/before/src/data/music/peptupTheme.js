import { melody, hits, repeat, HOLD, REST } from '../../audio/notation.js';
import { midi, timp, ORCHESTRA as O } from './parts/usurper.js';

// "Long May He Shine": King Peptup the Resplendent, holding the floor. It
// plays when the curtains open on him in "The King's Welcome", when he comes
// back with his quest after the Sunstone flickers, and when he calls the
// duel (`rumbolds_duel`), up to where the hall goes quiet. Belowtown's
// beloved king, the Hero's lost friend who came down the stair with them and
// was crowned by the folk: so it's a royal processional, grand and pleased
// with itself, trumpets and timpani and a harp sweeping up for his cape,
// the kind of music a king would choose to walk on to. Reference for the
// spirit only: an old coronation march, and Toby Fox's showman themes.
//
// It must never say what he is. What's off about it only lands on a second
// listen: a glockenspiel plays every note of his tune a 16th AFTER the
// trumpets, quietly, like a voice that's coming from somewhere slightly
// behind him; and in his big phrase the grin slips for one bar into E flat
// MINOR, then carries on as if nothing happened. In the sly part the tune
// goes minor, and its first bar is the chapter's own four notes.
//
// THE KING'S HOOK (the same as "The Resplendent Hour", rumboldTheme.js, so
// the duel picks it up where this leaves off): F . . Bb . . D - - - C, the
// chapter's cell strutting in threes, then the same again a third higher in
// D major, a showman's "and ANOTHER thing!", then the boast and home.
//
// Bb major, 96 BPM, one step a 16th: a bar is 2.5 seconds. The fanfare plays
// once (2 bars, 5s); then it loops from A, 32 bars, 1m20s:
//
//   intro   2 bars  the curtain: a timpani roll, a cymbal swelling, the
//                   trumpets' fanfare up to a high B flat
//   A       8 bars  THE HOOK on trumpets over a processional: timpani on
//                   the beats, a soft snare, the tuba, strings holding, a
//                   harp sweep for the cape; the glockenspiel behind
//   B       8 bars  THE PROCLAMATION: violins and horns broad and singing,
//                   and the one bar of E flat minor
//   A2      8 bars  the hook again on trumpets and violins together, the
//                   whole court, the glockenspiel behind
//   sly     8 bars  quieter: G minor, the tune on a clarinet over plucked
//                   strings and a trembling hush (the chapter's cell, D G
//                   Bb A); then up through C minor and F to the hook again

const BAR = 16;
const r16 = (text) => melody(text, 1);   // each token a 16th
const rest = (bars) => Array(bars * BAR).fill(REST);
const held = (note, steps) => [typeof note === 'number' ? note : midi(note), ...Array(steps - 1).fill(HOLD)];
// The same notes a 16th later (the glockenspiel behind the king).
const late = (track, semitones = 0) => [REST, ...track.slice(0, -1)].map((n) => (typeof n === 'number' ? n + semitones : n));

// --- Chords: 'Bb', 'Gm', 'D7', 'Edim', a bar each. ---
const QUALITY = { '': [0, 4, 7, 12], m: [0, 3, 7, 12], 7: [0, 4, 7, 10], dim: [0, 3, 6, 9] };
const NAMES = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
function chordOf(symbol) {
  const m = symbol.match(/^([A-G])([#b]?)(m|7|dim)?$/);
  if (!m) throw new Error(`Long May He Shine: can't read the chord '${symbol}'`);
  const root = (NAMES[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + 12) % 12;
  return { root, tones: QUALITY[m[3] ?? ''] };
}
const bars = (chords) => chords.split(/\s+/).filter(Boolean).map(chordOf);
// One chord tone a bar (0 root, 1 third, 2 fifth, 3 seventh or octave),
// placed at or just above `low`, held for the bar.
const voice = (chords, tone, low) => bars(chords).flatMap(({ root, tones }) => {
  const pc = (root + tones[tone]) % 12;
  return held(midi(low) + ((pc - (midi(low) % 12) + 12) % 12), BAR);
});
// The root at or above `low` on the given steps of each bar (a pattern of 0s
// for the root, 7 for the fifth, and '.' / '-').
const rooted = (chords, pattern, low) => bars(chords).flatMap(({ root }) => {
  const base = midi(low) + ((root - (midi(low) % 12) + 12) % 12);
  return pattern.map((p) => (typeof p === 'number' ? base + p : p));
});
// A harp sweeping up through the chord over two beats, for the cape.
const sweep = (chords, low) => bars(chords).flatMap(({ root, tones }) => {
  const base = midi(low) + ((root - (midi(low) % 12) + 12) % 12);
  const up = Array.from({ length: 8 }, (_, i) => base + tones[i % 3] + 12 * Math.floor(i / 3));
  return [...up, ...Array(8).fill(REST)];
});
// A sweep on the first bar of every four, nothing on the others.
const sweeps = (chords, low) => {
  const all = sweep(chords, low);
  return all.map((n, i) => (Math.floor(i / BAR) % 4 === 0 ? n : REST));
};

// --- The tunes. ---
const FANFARE = r16(`
  F4 . F4 . Bb4 - - - D5 - - - F5 - - - | Bb5 - - - - - - - - - - - . . . .
`);
const A_CHORDS = 'Bb D7 Gm C7 Eb Edim F7 Bb';
const HOOK = r16(`
  F4 . . Bb4 . . D5 - - - C5 - - - . . | A4 . . D5 . . F#5 - - - E5 - - - . . |
  G5 - - - - - D5 - Bb4 - - - G4 - - - | E5 - - - - - D5 - C5 - - - Bb4 - - - |
  Bb4 . . Eb5 . . G5 - - - F5 - - - . . | G5 . . Bb5 . . Db6 - - - Bb5 - G5 - E5 - |
  F5 - - - Eb5 - - - C5 - - - A4 - C5 - | Bb4 - - - - - - - - - - - . . . . |
`);
const B_CHORDS = 'Eb Bb Cm F Eb Ebm Bb F';
const PROCLAIM = r16(`
  G5 - - - Bb5 - - - G5 - Eb5 - - - . . | F5 - - - D5 - - - Bb4 - - - - - . . |
  Eb5 - - - G5 - - - C6 - - - Bb5 - A5 - | A5 - - - - - - - F5 - - - - - . . |
  G5 - - - Bb5 - - - Eb6 - - - D6 - C6 - | Bb5 - - - - - Gb5 - - - Eb5 - - - - - |
  F5 - - - D5 - - - F5 - - - Bb5 - - - | C6 - - - - - - - A5 - - - F5 - - - |
`);
const SLY_CHORDS = 'Gm D7 Gm D7 Eb Bb Cm F7';
const SLY = r16(`
  D5 . . G5 . . Bb5 - - - A5 - - - . . | A4 . . D5 . . F#5 - - - E5 - - - . . |
  D5 . . G5 . . Bb5 - - - A5 - G5 - F#5 - | A5 - - - - - - - . . . . . . . . |
  G5 - - - Bb5 - - - G5 - - - Eb5 - - - | F5 - - - D5 - - - Bb4 - - - - - - - |
  C5 - Eb5 - G5 - C6 - Bb5 - A5 - G5 - Eb5 - | F5 - - - - - - - - - - - . . . . |
`);

// --- The processional. ---
const MARCH_BASS = [0, '-', '-', '-', '-', '-', '-', '-', 7, '-', '-', '-', '-', '-', '-', '-'];
const T_BEATS = [0, '.', '.', '.', '.', '.', '.', '.', 0, '.', '.', '.', '.', '.', 0, '.'];
const SNARE = hits('x.......x...x.x.');
// Plucked off-beats in the sly part: the octave, then the fifth above it.
const PLUCK = ['.', '.', '.', '.', 12, '.', '.', '.', '.', '.', '.', '.', 19, '.', '.', '.'];
const ONE = hits('x...............');

export const PEPTUP_THEME = {
  title: 'Long May He Shine',
  bpm: 96,
  stepsPerBeat: 4,
  volume: 0.72,

  instruments: {
    trumpets: { ...O.trumpets, volume: 0.36 },
    horns: { ...O.horns, volume: 0.3 },
    hornsSoft: { ...O.hornsSoft, volume: 0.3 },
    tuba: { sample: 'tuba', volume: 0.34, attack: 0.02, release: 0.3, reverb: 0.3 },
    violins: { ...O.violins, volume: 0.3 },
    strings: { sample: 'violins', volume: 0.16, attack: 0.3, release: 0.8, reverb: 0.45, pan: 0.2 },
    violas: { sample: 'violas', volume: 0.18, attack: 0.3, release: 0.8, reverb: 0.45, pan: -0.15 },
    cellos: { ...O.cellos, volume: 0.28 },
    hush: { sample: 'violinsTrem', volume: 0.09, attack: 0.6, release: 0.8, reverb: 0.5, pan: 0.2 },
    clarinet: { sample: 'clarinet', volume: 0.32, attack: 0.03, release: 0.3, reverb: 0.4, pan: -0.1, humanize: { time: 0.01, volume: 0.1 } },
    pizz: { sample: 'violinsPizz', volume: 0.22, ring: true, reverb: 0.35, pan: 0.3, humanize: { time: 0.006, volume: 0.15 } },
    lowPizz: { sample: 'cellosPizz', volume: 0.26, ring: true, reverb: 0.35, pan: -0.25, humanize: { time: 0.006, volume: 0.12 } },
    harp: { sample: 'harp', volume: 0.24, ring: true, reverb: 0.5, pan: -0.3, humanize: { time: 0.006, volume: 0.12 } },
    // The voice from just behind him.
    behind: { sample: 'glock', volume: 0.06, ring: true, reverb: 0.55, pan: 0.4 },
    timpani: { ...O.timpani, volume: 0.42 },
    roll: { ...O.timpRoll, volume: 0.36 },
    snare: { sample: 'snareSoft', drum: 'sample', volume: 0.14, ring: true, reverb: 0.35, humanize: { time: 0.005, volume: 0.2 } },
    swell: { ...O.swell, volume: 0.3 },
    crash: { ...O.crash, volume: 0.22 },
  },

  sections: {
    // The curtain: a roll, a swell, the fanfare to a high B flat.
    intro: {
      trumpets: FANFARE,
      roll: [...held('Bb2', BAR), ...rest(1)],
      swell: [...held(60, BAR), ...rest(1)],
      crash: [...rest(1), ...ONE],
      timpani: [...rest(1), ...timp('Bb', ONE.map((h) => (h === 'x' ? 0 : REST)))],
      tuba: [...rest(1), ...held('Bb1', 12), ...Array(4).fill(REST)],
      harp: [...rest(1), ...sweep('Bb', 'Bb3')],
      strings: [...rest(1), ...held('D5', 12), ...Array(4).fill(REST)],
    },

    // The hook on the trumpets over the processional.
    A: {
      trumpets: HOOK,
      behind: late(HOOK, 12),
      tuba: rooted(A_CHORDS, MARCH_BASS, 'Bb1'),
      timpani: timp(A_CHORDS, T_BEATS),
      snare: repeat(SNARE, 8),
      hornsSoft: voice(A_CHORDS, 1, 'F3'),
      strings: voice(A_CHORDS, 2, 'A4'),
      violas: voice(A_CHORDS, 0, 'Bb3'),
      cellos: voice(A_CHORDS, 0, 'Bb2'),
      harp: sweeps(A_CHORDS, 'Bb3'),
    },

    // The proclamation: violins and horns broad, and one bar of E flat minor.
    B: {
      violins: PROCLAIM,
      horns: PROCLAIM.map((n) => (typeof n === 'number' ? n - 12 : n)),
      tuba: rooted(B_CHORDS, MARCH_BASS, 'Bb1'),
      timpani: timp(B_CHORDS, T_BEATS),
      snare: repeat(SNARE, 8),
      violas: voice(B_CHORDS, 1, 'Bb3'),
      cellos: voice(B_CHORDS, 0, 'Bb2'),
      harp: sweeps(B_CHORDS, 'Bb3'),
      crash: [...ONE, ...rest(7)],
    },

    // The hook with the whole court.
    A2: {
      trumpets: HOOK,
      violins: HOOK,
      behind: late(HOOK, 12),
      tuba: rooted(A_CHORDS, MARCH_BASS, 'Bb1'),
      timpani: timp(A_CHORDS, T_BEATS),
      snare: repeat(SNARE, 8),
      horns: voice(A_CHORDS, 1, 'F3'),
      violas: voice(A_CHORDS, 2, 'C4'),
      cellos: voice(A_CHORDS, 0, 'Bb2'),
      harp: sweeps(A_CHORDS, 'Bb3'),
      crash: [...ONE, ...rest(7)],
    },

    // Quieter, sly: the tune minor on a clarinet over plucked strings and a
    // trembling hush; then up to the hook again, a roll into it.
    sly: {
      clarinet: SLY,
      pizz: rooted(SLY_CHORDS, PLUCK, 'G3'),
      lowPizz: rooted(SLY_CHORDS, [0, '.', '.', '.', '.', '.', '.', '.', 7, '.', '.', '.', '.', '.', '.', '.'], 'G2'),
      hush: voice(SLY_CHORDS, 1, 'A4'),
      violas: voice(SLY_CHORDS, 2, 'C4'),
      roll: [...rest(7), ...held('F2', BAR)],
    },
  },

  // The fanfare once; then he goes round from the hook.
  order: ['intro', 'A', 'B', 'A2', 'sly'],
  loopFrom: 1,
};
