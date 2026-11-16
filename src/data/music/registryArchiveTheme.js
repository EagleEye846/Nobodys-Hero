import { melody, midi, transpose } from '../../audio/notation.js';
import { drops } from './parts/chapter3.js';
import { starFall } from './parts/starGuardians.js';

// "Counted Every Night": the way in to the Registry, chapter 3's secret
// detour behind the Old Street (notes/docs/superboss-ch3.md): the Cleft, the
// Counting Room and the Registry itself, where the old city's Welcome
// Register has counted everyone who promised to be present for the Hero,
// every night for a hundred years. Paper and ink and dust, skylights, and
// somewhere ahead a pen scratching. Nothing has found you yet. This is the
// walk up to "Present and Correct" (tallyBattleTheme.js), the Register's
// fight, and it is made of the same things, slowed down and kept quiet, so
// that when the fight starts the player has been humming its pieces for
// ten minutes already.
//
// It is written the city's way ("What They Built for Him", valleyTheme.js,
// and "A Book Left Open", openBookTheme.js: Hollow Knight's City of Tears
// school): one small figure that never changes, a bass that moves under it
// and turns it into new chords, and a tune over the top in long notes.
//
//   THE COUNT (the figure, a close piano): four strokes and a gap, F# C# B
//     C#, then nothing, twice a bar, all the way through. Four strokes of a
//     tally, and the fifth never written. Only the pen writes it: a real
//     pencil, scratching on the gap, somewhere off to the right. Over G the
//     figure is the city's Lydian colour (the major 7th and the sharp 11th);
//     over D, a sixth chord; over F#, a suspension that never lets go; and
//     over C, when the Hush's shadow comes over the skylights, it's wrong.
//
//   THE TUNE (the hook): the valley's own opening, F# E D C#, the Register's
//     count (Quire's four strokes), here in long notes and left hanging on
//     the C# where the fifth stroke should be. Then it climbs back up, hoping
//     (D E F#, A G F#), comes down (G F# E, D C# B), stops on C# again, and
//     the phrase's fifth bar is THE FALLING STAR (parts/starGuardians.js: B,
//     F#, the slip to E#, B), the star guardians' motif, the only thing in
//     the song that lands home. Five bars a phrase, a tally of bars. The
//     second phrase climbs higher and at the end counts the four strokes
//     quickly, F# E D C#, so the star's first note is the fifth stroke, up
//     on B: exactly the Register's tally. That is the fight's hook, at half
//     speed and in a whisper.
//
//   THE ROLL CALL (the middle): an oboe calls a name on one note, the choir
//     answers "pre-sent" on a falling third, and a typewriter key ticks it
//     off; three names, the same notes as in the fight. The fourth name is
//     the Hero's. Nobody answers, nothing is ticked, the pen stops, and the
//     shadow goes over (C, the flat second, the count muffled as if the
//     light had gone). Then the star, in F#, falling back toward home.
//
// No drums, no brass, no cellos. The low end is a piano's left hand, a
// plucked double bass and soft violas; the build is in how many instruments
// join, not how loud they get.
//
// B minor. 10/8 (two bars of the fight's 5/8, at half its speed) at 72
// crotchets a minute, one step a 16th: a bar is 20 steps, 4.2 seconds. The
// dust plays once (3 bars, 12 s); then it loops from the tune, 30 bars, 2m05s:
//
//   dust     3 bars  the pen alone; the count starts; the star, far off
//   count   10 bars  THE TUNE low on the clarinet, then high on the flute;
//                    the harp on the beats, the bass walking
//   names    8 bars  the roll call: three names answered and ticked off, the
//                    Hero's not; the shadow over the skylights (C); the star
//   ledger  10 bars  THE TUNE with everyone: solo violin, clarinet under it,
//                    the flute over the second phrase, violins, violas,
//                    choir, the harp rippling; the quick four strokes with
//                    the typewriter, and the star on glock, harp and glass
//   gap      2 bars  only the count and the pen; round to the tune

const SONG = 'Counted Every Night';
const BAR = 20;
const HALF = 10;
const e8 = (text) => melody(text, 2);   // each token an 8th
const s16 = (text) => melody(text, 1);  // each token a 16th
const rest = (n) => Array(n).fill('.');
const up = transpose;

// --- chords ---
const PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const pcOf = (name) => (PC[name[0]] + (name[1] === '#' ? 1 : name[1] === 'b' ? -1 : 0) + 12) % 12;
function chordOf(symbol) {
  const m = symbol.match(/^([A-G][#b]?)(m?)$/);
  if (!m) throw new Error(`${SONG}: can't read the chord '${symbol}'`);
  const root = pcOf(m[1]);
  return [root, (root + (m[2] ? 3 : 4)) % 12, (root + 7) % 12];
}
// The lowest note of pitch class `pc` at or above `lo`.
const near = (pc, lo) => lo + (((pc - lo) % 12) + 12) % 12;
// Chords a half bar (5/8) each.
const halves = (text) => text.split(/\s+/).filter((t) => t && t !== '|');

// One voice of the chords, held, a note to each run of the same chord.
function pad(chords, voice, lo) {
  return chords.flatMap((c, i) => {
    const n = near(chordOf(c)[voice], lo);
    return i > 0 && chords[i - 1] === c ? Array(HALF).fill('-') : [n, ...Array(HALF - 1).fill('-')];
  });
}
// The piano's left hand: the root, low, left to ring; where the chord
// stays for the second half, its fifth.
function left(chords) {
  return chords.flatMap((c, i) => {
    const [r, , f] = chordOf(c);
    const root = near(r, 35);
    const n = i % 2 === 1 && chords[i - 1] === c ? near(f, root) : root;
    return [n, ...rest(HALF - 1)];
  });
}
// The double bass, plucked: the root on each new chord.
const plucked = (chords) => chords.flatMap((c, i) => (i > 0 && chords[i - 1] === c ? rest(HALF) : [near(chordOf(c)[0], 35), ...rest(HALF - 1)]));
// The harp on the beats of each 5/8 (3 + 2): the root, then the tenth.
const beats = (chords) => chords.flatMap((c) => {
  const [r, t] = chordOf(c);
  const out = rest(HALF);
  out[0] = near(r, 47);
  out[6] = near(t, 59);
  return out;
});
// The harp rippling, in 8ths: root, fifth, octave, tenth, octave.
const ripple = (chords) => chords.flatMap((c) => {
  const [r, t, f] = chordOf(c);
  const root = near(r, 47);
  const notes = [root, near(f, root), root + 12, near(t, root + 12), root + 12];
  return notes.flatMap((n) => [n, '.']);
});

// --- THE COUNT: F# C# B C#, and the gap where the fifth stroke goes. ---
const STROKES = ['F#5', 'C#6', 'B5', 'C#6'].map(midi);
const countHalf = () => [STROKES[0], '-', STROKES[1], '-', STROKES[2], '-', STROKES[3], '-', '.', '.'];
const count = (halfCount) => Array.from({ length: halfCount }, countHalf).flat();
// The pen on the gap: a short stroke of a pencil, a different one each time.
function pen(bars, { every = 'bar', seed = 0 } = {}) {
  const out = rest(bars * BAR);
  for (let b = 0; b < bars; b++) {
    out[b * BAR + 18] = 60 + ((b * 5 + seed) % 6);
    if (every === 'half') out[b * BAR + 8] = 60 + ((b * 5 + seed + 3) % 6);
  }
  return out;
}

// --- THE TUNE, one token an 8th, five 8ths to a half bar. ---
const TUNE_1 = e8(`
  F#5 -  -  E5 D5  | C#5 - - -  .   |
  D5  -  -  E5 F#5 | A5  - - G5 F#5 |
  G5  -  -  F#5 E5 | D5  - - C#5 B4 |
  E5  -  -  F#5 D5 | C#5 - - -  -   |
  B5  F#5 F5 - B4  | -   - - -  .
`);
const TUNE_2 = e8(`
  B5  -  -  A5 G5  | F#5 - - -  .    |
  G5  -  -  A5 B5  | D6  - - C#6 B5  |
  C#6 -  -  B5 A5  | G5  - - F#5 E5  |
  G5  -  -  A5 G5  | F#5 E5 D5 C#5 . |
  B5  F#5 F5 - B4  | -   - - -  .
`);
const TUNE_CHORDS = halves('G G | D D | Em Em | F# F# | Bm Bm | G G | Em Em | A A | Em F# | Bm Bm');

// --- THE ROLL CALL (the fight's, note for note, at half its speed). ---
const CALLS = [
  s16('D5 . D5 . D5 E5 F#5 . G5 -'),
  s16('C#5 . C#5 . C#5 D5 E5 . F#5 -'),
  s16('G5 . G5 . G5 F#5 E5 . D5 -'),
  s16('F#5 . F#5 . F#5 G5 A#5 . B5 -'),
];
const ANSWERS = [s16('E5 - - - C#5 - - - . .'), s16('D5 - - - B4 - - - . .'), s16('E5 - - - A5 - - - . .')];
const NAMES_CHORDS = halves('G A | F#m Bm | G A | F# F# | C C | C C | G G | F# F#');

// The star at its own pace: quick, quick, a breath, long (a half bar).
const star = (tonic) => starFall(tonic, { lengths: [1, 1, 1, 2] });

// --- the score ---
function score(name, bars) {
  const length = bars * BAR;
  const tracks = {};
  const api = {
    put(track, at, steps) {
      if (at < 0 || at + steps.length > length) throw new Error(`${SONG} ${name}: '${track}' at ${at} (${steps.length} steps) runs past ${length}`);
      const t = (tracks[track] ??= rest(length));
      steps.forEach((s, i) => { if (s !== '.') t[at + i] = s; });
      return api;
    },
    done: () => tracks,
  };
  return api;
}

// The pen alone in a quiet room; then the count; then, far off, the star.
const dust = (() => {
  const s = score('dust', 3);
  s.put('pen', 0, pen(3, { every: 'half', seed: 2 }));
  s.put('harpLow', 0, [midi('B1'), ...rest(BAR - 1)]);
  s.put('drone', 0, [midi('F#3'), ...Array(3 * BAR - 1).fill('-')]);
  s.put('count', BAR, count(4));
  s.put('glock', 2 * BAR + HALF, star('B6'));
  s.put('harp', 2 * BAR + HALF, up(star('B4'), 0));
  s.put('left', 2 * BAR, [midi('B1'), ...rest(BAR - 1)]);
  return s.done();
})();

// THE TUNE: low on the clarinet, then high on the flute.
const countSection = (() => {
  const s = score('count', 10);
  s.put('count', 0, count(20));
  s.put('pen', 0, pen(10, { seed: 1 }));
  s.put('penLine', 3 * BAR + HALF, [66]).put('penLine', 8 * BAR + HALF, [66]);
  s.put('clarinet', 0, up(TUNE_1, -12));
  s.put('flute', 5 * BAR, TUNE_2);
  s.put('left', 0, left(TUNE_CHORDS));
  s.put('bass', 0, plucked(TUNE_CHORDS));
  s.put('harp', 0, beats(TUNE_CHORDS));
  s.put('violas', 2 * BAR, pad(TUNE_CHORDS.slice(4), 1, 57));
  s.put('glock', 4 * BAR, star('B6')).put('glock', 9 * BAR, star('B6'));
  s.put('dust', 0, drops(TUNE_CHORDS.join(' '), HALF, 0.07, 13, 2));
  return s.done();
})();

// THE ROLL CALL, and the shadow going over.
const names = (() => {
  const s = score('names', 8);
  // the count, until the shadow comes; under it, muffled; then back
  s.put('count', 0, count(8)).put('countFar', 4 * BAR, count(6)).put('count', 7 * BAR, count(2));
  // the pen, till the Hero's name; then it stops, and starts again
  s.put('pen', 0, pen(3, { seed: 4 })).put('pen', 6 * BAR, pen(2, { seed: 3 }));
  // three names called, answered, ticked off; the fourth, the Hero's, isn't
  CALLS.forEach((call, i) => s.put('oboe', i * BAR, call));
  ANSWERS.forEach((answer, i) => s.put('choirCall', i * BAR + HALF, answer).put('type', i * BAR + 18, [61 + i]));
  s.put('left', 0, left(NAMES_CHORDS));
  s.put('bass', 0, plucked(NAMES_CHORDS));
  s.put('violas', 0, pad(NAMES_CHORDS, 1, 57));
  s.put('hum', 0, pad(NAMES_CHORDS, 0, 50));
  // the shadow: high tremolo, the flat second, held breath
  s.put('trem', 4 * BAR, [midi('B5'), ...Array(2 * BAR - 1).fill('-')]);
  s.put('tremLow', 4 * BAR, [midi('G4'), ...Array(3 * BAR - 1).fill('-')]);
  s.put('harpLow', 4 * BAR, [midi('C2'), ...rest(BAR - 1), midi('C2'), ...rest(BAR - 1)]);
  // and the light back: the tune's first cell, slowly, on the clarinet
  s.put('clarinetSoft', 6 * BAR, e8('F#4 - - - - | E4 - - D4 - | C#4 - - - - | - - - - .'));
  // the star, in F#, falling back toward home
  s.put('glock', 7 * BAR + HALF, star('F#6')).put('harp', 7 * BAR + HALF, star('F#4'));
  return s.done();
})();

// THE TUNE with everyone.
const ledger = (() => {
  const s = score('ledger', 10);
  const tune = [...TUNE_1, ...TUNE_2];
  s.put('count', 0, count(20));
  s.put('pen', 0, pen(10, { every: 'half', seed: 5 }));
  s.put('soprano', 0, tune);
  s.put('clarinet', 0, up(TUNE_1, -12));
  s.put('flute', 5 * BAR, up(TUNE_2.slice(0, 3 * BAR), 12));
  s.put('left', 0, left(TUNE_CHORDS));
  s.put('bass', 0, plucked(TUNE_CHORDS));
  s.put('harp', 0, ripple(TUNE_CHORDS));
  s.put('violins', 0, pad(TUNE_CHORDS, 2, 66));
  s.put('violas', 0, pad(TUNE_CHORDS, 1, 57));
  s.put('hum', 2 * BAR, pad(TUNE_CHORDS.slice(4), 0, 50));
  s.put('timpani', 0, [midi('G2'), ...rest(BAR * 5 - 1), midi('G2')]);
  // the quick four strokes, counted on the typewriter and the pizzicato
  const quick = 8 * BAR + HALF;
  s.put('pizz', quick, s16('F#5 . E5 . D5 . C#5 . . .')).put('type', quick, [60, '.', 62, '.', 64, '.', 63]);
  // and the star on glock, harp and glass
  s.put('glock', 4 * BAR, star('B6')).put('glock', 9 * BAR, star('B6'));
  s.put('harpStar', 9 * BAR, star('B4'));
  s.put('glass', 9 * BAR + 8, [midi('B5'), ...Array(BAR - 9).fill('-')]);
  s.put('dust', 0, drops(TUNE_CHORDS.join(' '), HALF, 0.1, 29, 2));
  return s.done();
})();
// (the harp's ripple steps aside for the star)
ledger.harp.splice(9 * BAR, BAR, ...rest(BAR));

// Only the count and the pen; the count's last half-bar alone, and the pen
// writes the fifth stroke.
const gap = (() => {
  const s = score('gap', 2);
  s.put('count', 0, count(3));
  s.put('pen', 0, pen(2, { seed: 0 }));
  s.put('penLine', HALF, [66]);
  s.put('left', 0, [midi('B1'), ...rest(BAR - 1)]);
  s.put('drone', 0, [midi('F#3'), ...Array(2 * BAR - 1).fill('-')]);
  return s.done();
})();

const instruments = {
  // the count: a close piano, soft, half pedal; and the same under the
  // shadow, as if the light had gone
  count: { sample: 'grandPiano', volume: 0.13, release: 0.9, reverb: 0.55, pan: 0.15, humanize: { time: 0.01, volume: 0.22 } },
  countFar: { sample: 'grandPiano', volume: 0.13, release: 1.1, reverb: 0.7, pan: 0.15, muffle: 900, humanize: { time: 0.01, volume: 0.22 } },
  left: { sample: 'grandPiano', volume: 0.17, ring: true, reverb: 0.5, pan: -0.1, humanize: { time: 0.012, volume: 0.12 } },
  dust: { sample: 'grandPiano', volume: 0.07, ring: true, reverb: 0.75, pan: -0.45, humanize: { time: 0.03, volume: 0.3 } },
  bass: { sample: 'bassPizz', volume: 0.22, ring: true, reverb: 0.35, pan: -0.05, humanize: { time: 0.008, volume: 0.1 } },
  harp: { sample: 'harp', volume: 0.2, ring: true, reverb: 0.55, pan: -0.3, humanize: { time: 0.015, volume: 0.2 } },
  harpLow: { sample: 'harp', volume: 0.26, ring: true, reverb: 0.6, pan: -0.2 },
  harpStar: { sample: 'harp', volume: 0.24, ring: true, reverb: 0.6, pan: -0.25 },
  // the pen, somewhere ahead; a whole line now and then; the typewriter
  // ticking a name off
  pen: { sample: 'penScratch', volume: 0.11, ring: true, reverb: 0.45, pan: 0.4, humanize: { time: 0.02, volume: 0.35 } },
  penLine: { sample: 'penScratch', volume: 0.08, ring: true, reverb: 0.55, pan: 0.45 },
  type: { sample: 'typewriter', volume: 0.09, ring: true, reverb: 0.5, pan: 0.35, humanize: { time: 0.01, volume: 0.2 } },
  // the voices over it
  clarinet: { sample: 'clarinet', volume: 0.24, attack: 0.12, release: 0.8, reverb: 0.55, pan: -0.15, humanize: { time: 0.012, volume: 0.1 } },
  clarinetSoft: { sample: 'clarinet', volume: 0.14, attack: 0.4, release: 1, reverb: 0.65, pan: -0.15 },
  flute: { sample: 'flute', volume: 0.22, attack: 0.15, release: 0.9, reverb: 0.65, pan: 0.1, humanize: { time: 0.012, volume: 0.1 } },
  oboe: { sample: 'oboe', volume: 0.2, attack: 0.03, release: 0.4, reverb: 0.65, pan: 0.2, humanize: { time: 0.01, volume: 0.1 } },
  soprano: { sample: 'soloViolin', volume: 0.2, attack: 0.35, release: 1.2, reverb: 0.8, pan: 0.05 },
  choirCall: { sample: 'choir', volume: 0.16, attack: 0.08, release: 0.6, reverb: 0.7, pan: -0.1 },
  hum: { sample: 'choir', volume: 0.07, attack: 1.2, release: 1.6, reverb: 0.75, pan: -0.15 },
  // soft strings
  violins: { sample: 'violins', volume: 0.1, attack: 0.9, release: 1.4, reverb: 0.6, pan: 0.25 },
  violas: { sample: 'violas', volume: 0.12, attack: 1, release: 1.5, reverb: 0.6, pan: -0.25 },
  drone: { sample: 'violas', volume: 0.07, attack: 2, release: 3, reverb: 0.6, pan: -0.1 },
  pizz: { sample: 'violinsPizz', volume: 0.16, ring: true, reverb: 0.45, pan: 0.2 },
  trem: { sample: 'violinsTrem', volume: 0.05, attack: 2, release: 2.5, reverb: 0.7, pan: 0.3 },
  tremLow: { sample: 'violasTrem', volume: 0.07, attack: 2, release: 2.5, reverb: 0.65, pan: -0.3 },
  // the star
  glock: { sample: 'glock', volume: 0.09, ring: true, reverb: 0.7, pan: 0.3, echo: { time: 0.83, feedback: 0.3, mix: 0.3 } },
  glass: { sample: 'glass', volume: 0.12, ring: true, reverb: 0.8, pan: 0.2 },
  timpani: { sample: 'timpani', volume: 0.16, ring: true, reverb: 0.5 },
};

export const REGISTRY_ARCHIVE_THEME = {
  title: SONG,
  bpm: 72,
  stepsPerBeat: 4,
  volume: 1.05,
  instruments,
  sections: { dust, count: countSection, names, ledger, gap },
  // The dust settles once; then the count goes round from the tune.
  order: ['dust', 'count', 'names', 'ledger', 'gap'],
  loopFrom: 1,
};
