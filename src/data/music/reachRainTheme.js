import { melody, hits, tight } from './parts/chapter5.js';

// "Keep Rowing": the theme of the Storm Reach, the open sea between
// Haddock's Light and the Last Light (all five rooms: First Rock, the Reef,
// the Wreck, the Eye, the Tower's Foot). The heaviest rain in the chapter,
// the black tower bigger every time you look up, Haddock rowing, and the
// last push before the end. The storm is enormous; the song is the boat
// going through it anyway. Bright, driving, B-flat major, and it never
// stops moving: hope against the storm.
//
// (It replaces every earlier "Hopes Above Water"; those are kept in
// notes/music-backup-2026-11-11/.)
//
// THE ENGINE: the piano never stops. Straight 16ths, every bar, accented
// 3 + 3 + 2 so it leans forward. Under it a plucked double bass on every
// beat with pushes (the piano's left hand doubling it for punch), a real
// kit (kick, snare, closed and open hats, ride, toms), and over it a
// legato tune on the strings in octaves, doubled by the piano in octaves so
// every note speaks. Soft horns and sustained strings fill the middle.
//
// THE HOOK is the chapter's coast cell (5 1 1 2, parts/chapter5.js) in
// B-flat, F B-flat B-flat C, then on to D, every note pushed onto the "and"
// so it leans into the bar; then the leap to F and a run down. The same
// cell a step higher (G C C D E-flat) answers it, and the second time the
// answer climbs A, B-flat and holds the top B-flat while the chords go
// G-flat, A-flat, home (bVI, bVII, I). It's in every section in some
// form: whole in A, in G minor in P, in pieces in the intro, cut into
// one-bar shouts in E, a step higher in F, slowed right down in C.
//
// THE CHORDS are B-flat's, coloured: the hook runs IV V iii vi (Ebmaj9
// F13 Dm9 Gm9), then ii V I, with a ii-V into IV to go round, and the
// bVI bVII I at the top. Every chord is a 9th or a 13th; the piano plays
// them without the root (the bass has it), each one moving as little as
// it can from the last.
//
// 4/4 at 125, one step a 16th. The intro plays once (18 bars, 35s, and
// climbs about 10 dB); then it loops from A (88 bars, 2m49s):
//
//   i1      3 bars  the piano alone, soft, in G minor
//   i2      7 bars  the hook in pieces, on great swells of the whole band,
//                   with a bar of the piano alone in the middle
//   C       4 bars  the eye: no drums, no bass; the piano high and slow,
//                   the hook at half speed, the strings holding on
//   R       4 bars  the rebuild: the bass comes in (a long note, then
//                   halves, then 8ths), then the kick, the timpani
//                   rolling, E-flat to E diminished to F; the last bar
//                   drops out for a snare roll and a swell
//   A      16 bars  THE HOOK, whole, twice; the second time it climbs
//   B       8 bars  the soar: a long climbing tune on the strings, soft
//                   horns under it, the ride instead of the hats, the
//                   bass in long notes
//   P       8 bars  the drive: the cell in G minor, low, climbing an
//                   octave; spiccato strings, the bass in 8ths; one bar
//                   drops away before
//   D      10 bars  THE HOOK BIGGER: the choir in with the strings, the
//                   piano's octaves an octave up, horns, open hats, crashes
//   brk     2 bars  a breath: the piano and the strings, a swell, and the
//                   turn to D major
//   E      16 bars  the piano's feature, in D: the band shouts the cell
//                   for a bar and the piano answers alone with a run, bar
//                   by bar, rising through D, F-sharp minor, E minor, B-flat
//   F      18 bars  the hook a step higher, in C major, with everyone; the
//                   top C held over A-flat and B-flat, twice, and a high D
//   tag     2 bars  the band's last two bars, on C and then A-flat
//   C, R            the eye again and the rebuild, back round to A
//
// The Eye's room starts the song at C (its `musicFrom`): eight seconds of
// calm, the rebuild, then the hook.

const TITLE = 'Keep Rowing';
const BAR = 16;
const fit = (name, section, bars) => tight(TITLE, name, section, bars, BAR);
const rest = (bars) => Array(bars * BAR).fill('.');
const up = (steps, semitones) => steps.map((n) => (typeof n === 'number' ? n + semitones : n));
const cat = (...parts) => parts.flat();
// A tune as 8th-note tokens ('A/B' splits one into two 16ths).
const tune = (text) => melody(text, 2);
// Drum hits, one character a 16th; `times` repeats the pattern.
const beat = (text, times = 1) => Array.from({ length: times }, () => hits(text)).flat();
// Keeps only the bars `keep(bar)` says yes to; the rest go quiet.
const bars = (steps, keep) => steps.map((n, i) => (keep(Math.floor(i / BAR)) ? n : '.'));
// Splits a part by note: notes where `test` is true, and the rest (for
// recordings that sit louder or softer than their neighbours).
const split = (steps, test) => [
  steps.map((n, i) => (typeof n === 'number' ? (test(n) ? n : '.') : n === '-' && owner(steps, i, test) ? '-' : '.')),
  steps.map((n, i) => (typeof n === 'number' ? (test(n) ? '.' : n) : n === '-' && owner(steps, i, (m) => !test(m)) ? '-' : '.')),
];
function owner(steps, i, test) {
  for (let j = i - 1; j >= 0; j--) {
    if (typeof steps[j] === 'number') return test(steps[j]);
    if (steps[j] !== '-') return false;
  }
  return false;
}
// A hit placed `before` steps ahead of the end of `count` bars: a cymbal
// swell timed so its peak lands on the next downbeat.
const swellInto = (count, before = 26) => { const out = rest(count); out[count * BAR - before] = 'x'; return out; };

// ------------------------------------------------------------- the chords
const PC = { C: 0, 'C#': 1, Db: 1, D: 2, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, Ab: 8, A: 9, Bb: 10, B: 11 };
// The colours, as intervals over the root: rootless voicings (3rds,
// 7ths, 9ths, 13ths), except where the root is part of the colour.
const QUALITY = {
  maj9: [4, 7, 11, 14], m9: [3, 7, 10, 14], 13: [4, 10, 14, 21], '13sus': [5, 10, 14, 21],
  '7b9': [4, 7, 10, 13], '7#9': [4, 7, 10, 15], m7b5: [3, 6, 10, 12], dim7: [0, 3, 6, 9],
  'maj7#11': [4, 11, 14, 18],
};
function chord(symbol) {
  const match = symbol.match(/^([A-G][b#]?)(.+)$/);
  if (!match || !QUALITY[match[2]]) throw new Error(`${TITLE}: can't read the chord '${symbol}'`);
  const root = PC[match[1]];
  return { symbol, root, pcs: QUALITY[match[2]].map((i) => (root + i) % 12) };
}
// 'Ebmaj9 | F13 | Fm9 Bb13' (one or two chords a bar) as one chord a step.
function changes(text) {
  return text.split('|').flatMap((bar) => {
    const names = bar.trim().split(/\s+/);
    return names.flatMap((name) => Array(BAR / names.length).fill(chord(name)));
  });
}
// Close voicings of each chord between lo and hi, each one moving as
// little as it can from the one before.
function voiced(chords, lo, hi) {
  let prev = null;
  let last = null;
  return chords.map((c) => {
    if (c === last) return prev;
    last = c;
    const options = [];
    const pcs = [...c.pcs].sort((a, b) => a - b);
    for (let start = 0; start < 4; start++) {
      const order = [...pcs.slice(start), ...pcs.slice(0, start)];
      let note = lo + ((order[0] - lo) % 12 + 12) % 12;
      const notes = [note];
      for (const pc of order.slice(1)) { note += ((pc - note) % 12 + 12) % 12 || 12; notes.push(note); }
      if (notes[3] <= hi) options.push(notes);
      if (notes[0] + 12 + (notes[3] - notes[0]) <= hi) options.push(notes.map((n) => n + 12));
    }
    const centre = (lo + hi) / 2;
    const cost = (v) => (prev ? v.reduce((s, n, i) => s + Math.abs(n - prev[i]), 0) : Math.abs((v[0] + v[3]) / 2 - centre));
    prev = options.sort((a, b) => cost(a) - cost(b))[0];
    return prev;
  });
}
// The piano's 16ths: `pattern` is one bar of indexes into the voicing (4
// is the bottom note an octave up, and so on), '-' or '.'. Notes on the
// 3 + 3 + 2 accents go to the first part, the rest to the second.
const ACCENTS = new Set([0, 3, 6, 8, 11, 14]);
function sixteenths(chords, pattern, lo, hi) {
  const voices = voiced(chords, lo, hi);
  const acc = [];
  const run = [];
  chords.forEach((_, i) => {
    const k = pattern[i % pattern.length];
    if (typeof k !== 'number') { acc.push(ACCENTS.has(i % BAR) ? '.' : k); run.push(ACCENTS.has(i % BAR) ? k : '.'); return; }
    const v = voices[i];
    const note = v[((k % 4) + 4) % 4] + 12 * Math.floor(k / 4);
    if (ACCENTS.has(i % BAR)) { acc.push(note); run.push('.'); } else { run.push(note); acc.push('.'); }
  });
  return { acc, run };
}
// The figures. DRIVE rolls up through the chord and back; SOAR is a wave
// a register higher; PUMP keeps hitting the top note like a toccata; RUN
// goes up two octaves and back; GLOW is the eye's gentle 8ths.
const DRIVE = [0, 2, 4, 1, 3, 4, 2, 4, 0, 2, 4, 1, 3, 4, 3, 2];
const SOAR = [0, 1, 2, 3, 4, 3, 2, 1, 2, 3, 4, 5, 6, 5, 4, 3];
const PUMP = [0, 3, 1, 3, 2, 3, 1, 3, 0, 3, 1, 3, 2, 3, 4, 3];
const RUN = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 10, 9, 8, 7];
const GLOW = [0, '-', 2, '-', 4, '-', 3, '-', 1, '-', 3, '-', 5, '-', 4, '-'];

// The bass, one bar a pattern: R the root, 5 its fifth, O its octave, A a
// half step under the next chord's root (leading into it). Wherever the
// chord changes, the bass plays the new root.
const GROOVE = ['R', '-', '.', 'R', 'O', '-', 'R', '-', '5', '-', '.', 'R', 'O', '-', 'A', '-'];
const PUSH = ['R', '-', '.', 'R', 'O', '-', 'R', '-', 'R', '-', '.', 'R', '5', '-', 'O', 'A'];
const LONG = ['R', '-', '-', '-', '-', '-', '-', '-', 'R', '-', '-', '-', '5', '-', 'A', '-'];
const EIGHTHS = ['R', '-', 'R', '-', 'O', '-', 'R', '-', 'R', '-', 'R', '-', 'O', '-', '5', 'A'];
const bassRoot = (c) => 31 + ((c.root - 31) % 12 + 12) % 12;   // G1 up to F#2
// The note of `steps` sounding at step i (or null).
const sounding = (steps, i) => { for (let j = i; j >= 0; j--) { if (typeof steps[j] === 'number') return steps[j]; if (steps[j] !== '-') return null; } return null; };
// With `over` (the tune), a leading note that would rub a half step against
// the tune comes from the next chord's fifth instead.
function bassLine(chords, pattern, over = null) {
  return chords.map((c, i) => {
    let token = pattern[i % pattern.length];
    if (i > 0 && chords[i - 1] !== c && token !== '.') token = 'R';
    if (i === 0 && token === '-') token = 'R';
    const root = bassRoot(c);
    if (token === 'R') return root;
    if (token === '5') return root + 7;
    if (token === 'O') return root + 12;
    if (token === 'A') {
      const next = chords.slice(i).find((n) => n !== c) ?? c;
      const lead_ = bassRoot(next) - 1;
      const top = over && sounding(over, i);
      const rubs = top != null && [1, 11].includes(((top - lead_) % 12 + 12) % 12);
      return rubs ? (bassRoot(next) + 7 <= 49 ? bassRoot(next) + 7 : bassRoot(next) - 5) : lead_;
    }
    return token;
  });
}
// One note of each chord, held while the chord lasts: `voice` 0 is the
// bottom of its voicing between lo and hi.
function held(chords, voice, lo, hi) {
  const voices = voiced(chords, lo, hi);
  return chords.map((c, i) => (i > 0 && chords[i - 1] === c && i % (BAR * 2) ? '-' : voices[i][voice]));
}
// Strings and horns holding a chord, cut at the bar line before a section
// ends so the next one comes in clean.
const pad = (chords, voice, lo, hi) => held(chords, voice, lo, hi);

// ------------------------------------------------------------------ tunes
const HOOK_1 = 'F4 Bb4 - Bb4 - C5 - D5 | - - F5 - Eb5 - D5 C5 | D5 - - - - - Bb4 C5 | D5 - - F5 - D5 C5 Bb4';
const HOOK_2 = 'G4 C5 - C5 - D5 - Eb5 | - - G5 - F5 - Eb5 D5 | F5 - - D5 - - C5 D5 | - - C5 - . . . .';
const HOOK_CLIMB = 'G4 C5 - C5 - D5 - Eb5 | - - G5 - A5 - - Bb5 | - - - - - - - - | - - - - - - . .';
const HOOK = tune(`${HOOK_1} | ${HOOK_2} | ${HOOK_1} | ${HOOK_CLIMB}`);
const HOOK_CHORDS = changes('Ebmaj9 | F13 | Dm9 | Gm9 | Cm9 | F13 | Bbmaj9 | Fm9 Bb13 | Ebmaj9 | F13 | Dm9 | Gm9 | Cm9 | F13 | Gbmaj9 Ab13 | Bbmaj9');

const I1_CHORDS = changes('Gm9 | Ebmaj9 | Cm9');
const I2_CHORDS = changes('F13sus | Ebmaj9 | F13 | Dm9 | Cm9 | F13 | Ebmaj9 F13');
const I2_TUNE = tune(`. . . . . . . . | F4 Bb4 - Bb4 - C5 - D5 | - - F5 - Eb5 - D5 C5 | D5 - - - - - . .
  | G4 C5 - C5 - D5 - Eb5 | - - G5 - F5 - Eb5 D5 | Eb5 - - D5 - - C5 -`);

const C_CHORDS = changes('Gm9 | Ebmaj9 | Cm9 | Dm9');
const C_TUNE = tune('F5 - Bb5 - - - Bb5 - | - - C6 - - - D6 - | - - - - - - - - | C6 - - - A5 - - -');

const R_CHORDS = changes('Ebmaj9 | Edim7 | F13sus | F7b9');

const B_CHORDS = changes('Cm9 | Dm9 | Ebmaj9 | F13 | Gm9 | Am7b5 D7b9 | Gm9 C13 | F13sus F13');
const B_TUNE = tune(`Eb5 - - - - - D5 Eb5 | F5 - - - - - Eb5 F5 | G5 - - - - - F5 G5 | A5 - - - - - G5 A5
  | Bb5 - - - - - - - | C6 - - - Bb5 - A5 - | Bb5 - - - A5 - G5 - | G5 - - - A5 - - -`);

const P_CHORDS = changes('Gm9 | Ebmaj9 | Cm9 | F13 | Gm9 | Ebmaj9 | Am7b5 D7#9 | Cm9 F7b9');
const P_TUNE = tune(`D4 G4 - G4 - A4 - Bb4 | - - C5 - Bb4 - G4 - | G4 C5 - C5 - D5 - Eb5 | - - F5 - Eb5 - D5 C5
  | D5 G5 - G5 - A5 - Bb5 | - - Bb5 - A5 - G5 F5 | G5 - - - F#5 - - - | . . . . . . . .`);

const D_CHORDS = changes('Ebmaj9 | F13 | Dm9 | Gm9 | Cm9 | F13 | Gbmaj9 Ab13 | Bbmaj9 | Gm9 C13 | Cm9 F13sus');
const D_TUNE = tune(`${HOOK_1} | ${HOOK_CLIMB} | Bb5 - A5 - G5 - - A5 | G5 - - - - - . .`);

const BRK_CHORDS = changes('Ebmaj7#11 | A13sus A13');

const E_CHORDS = changes('Gmaj9 | A13 | F#m9 | Bm9 | Em9 | A13 | Dmaj9 | Am9 D13 | Gmaj9 | A13 | F#m9 | Bm9 | Em9 | A13sus A13 | Bbmaj9 | C13');
const E_TUNE = tune(`A4 D5 - D5 - E5 - F#5 | - - - - . . . . | C#5 F#5 - F#5 - G#5 - A5 | - - - - . . . .
  | B4 E5 - E5 - F#5 - G5 | - - - - . . . . | A4 D5 - D5 - E5 - F#5 | - - - - . . . .
  | A4 D5 - D5 - E5 - F#5 | - - - - . . . . | C#5 F#5 - F#5 - G#5 - A5 | - - - - . . . .
  | B4 E5 - E5 - F#5 - G5 | - - - - . . . . | D5 F5 - F5 - G5 - A5 | - - - - - - - -`);
const band = (b) => b % 2 === 0 || b === 15;

const F_CHORDS = changes('Fmaj9 | G13 | Em9 | Am9 | Dm9 | G13 | Cmaj9 | Gm9 C13 | Fmaj9 | G13 | Em9 | Am9 | Dm9 | G13 | Abmaj9 Bb13 | Cmaj9 | Abmaj9 Bb13 | Cmaj9');
const F_TUNE = cat(up(HOOK, 2), tune('C6 - - - Bb5 - C6 - | D6 - - - - - - -'));

const TAG_CHORDS = changes('Cmaj9 | Abmaj7#11');

// ------------------------------------------------------------ the parts
// The piano's 16ths for a run of chords (both hands' worth of the right).
const keys = (chords, pattern, lo, hi) => sixteenths(chords, pattern, lo, hi);
// The tune doubled: strings in octaves (violins on top, violas under) and
// the piano in octaves. The violins' C5-D5 recording sits louder than its
// neighbours, so those notes go to a softer copy of the track.
function lead(steps, { strings = true, piano = true } = {}) {
  const [hot, rest_] = split(steps, (n) => n >= 71 && n <= 74);
  return {
    ...(strings ? { violins: rest_, violinsHot: hot, violas: up(steps, -12) } : {}),
    ...(piano ? { melHi: steps, melLo: up(steps, -12) } : {}),
  };
}
// Soft sustained strings and horns on the chords.
const strings = (chords) => ({
  padLo: pad(chords, 0, 53, 70), padMid: pad(chords, 1, 53, 70), padHi: pad(chords, 2, 64, 84), padTop: pad(chords, 3, 64, 84),
});
// (The soft horns' recordings stop at C4, so each note is folded down
// into the octave under it.)
const fold = (steps) => steps.map((n) => { if (typeof n !== 'number') return n; while (n > 61) n -= 12; while (n < 50) n += 12; return n; });
const horns = (chords) => ({ horn1: fold(pad(chords, 0, 53, 72)), horn2: fold(pad(chords, 2, 53, 72)) });
const bassPart = (chords, pattern, over) => { const line = bassLine(chords, pattern, over); return { bass: line, bassKeys: line }; };

// The kit, by the bar.
const KICK = 'x..x..x.x.....x.';
const KICK_2 = 'x..x..x.x..x..x.';
const SNARE = '....x.......x...';
const GHOSTS = '.......x.x.....x';
const HATS = 'x.x.x.x.x.x.x...';
const HATS_IN = '.x.x.x.x.x.x.x.x';
const OPEN = '..............x.';
// The last bar of an 8: the snare and the toms down to the bar line.
const FILL_SNARE = '....x...x.xx....';
const FILL_HI = '............xx..';
const FILL_MID = '..............x.';
const FILL_LO = '...............x';
const bars8 = (pattern, fill, count) => beat(pattern, count).map((h, i) => (Math.floor(i / BAR) % 8 === 7 && fill ? fill[i % BAR] : h));
// A full groove for `count` bars, with a fill every 8th bar.
function groove(count, { ride = false, open = true, kick = KICK } = {}) {
  const fillBar = (b) => b % 8 === 7;
  const per = (pattern, fill) => beat(pattern, count).map((h, i) => (fillBar(Math.floor(i / BAR)) ? hits(fill)[i % BAR] : h));
  const kicks = beat(kick, count).map((h, i) => (Math.floor(i / BAR) % 2 ? hits(KICK_2)[i % BAR] : h));
  return {
    kick: kicks,
    snare: per(SNARE, FILL_SNARE),
    ghost: per(GHOSTS, '................'),
    ...(ride ? { ride: per('x.x.x.x.x.x.x.x.', 'x.x.x.x.........') } : {
      hat: per(HATS, 'x.x.x.x.x.x.....'),
      hatIn: per(HATS_IN, '.x.x.x.x........'),
    }),
    ...(open ? { hatOpen: per(OPEN, '................') } : {}),
    tomHi: per('................', FILL_HI),
    tom: per('................', FILL_MID),
    tomLo: per('................', FILL_LO),
  };
}
const crashOn = (count, at = [0]) => rest(count).map((_, i) => (i % BAR === 0 && at.includes(Math.floor(i / BAR)) ? 'x' : '.'));

// ---------------------------------------------------------------- the song
export const REACH_RAIN_THEME = {
  title: TITLE,
  bpm: 125,
  stepsPerBeat: 4,
  volume: 0.53,

  instruments: {
    // The piano: the 16ths (the accents louder), the tune in octaves, the
    // eye's soft high piano, and the left hand doubling the bass.
    keysAcc: { sample: 'grandPiano', volume: 0.32, release: 0.3, reverb: 0.25, pan: -0.1, humanize: { time: 0.003, volume: 0.12 } },
    keys: { sample: 'grandPiano', volume: 0.21, release: 0.3, reverb: 0.25, pan: -0.1, humanize: { time: 0.003, volume: 0.2 } },
    keysSoft: { sample: 'grandPiano', volume: 0.2, release: 0.6, reverb: 0.4, pan: -0.1, humanize: { time: 0.004, volume: 0.2 } },
    melHi: { sample: 'grandPiano', volume: 0.16, release: 0.25, reverb: 0.3, pan: 0.05, humanize: { time: 0.003, volume: 0.08 } },
    melLo: { sample: 'grandPiano', volume: 0.12, release: 0.25, reverb: 0.3, pan: 0.05, humanize: { time: 0.003, volume: 0.08 } },
    glow: { sample: 'grandPiano', volume: 0.26, ring: true, reverb: 0.5, pan: 0.1, humanize: { time: 0.006, volume: 0.1 } },
    bassKeys: { sample: 'grandPiano', volume: 0.12, release: 0.12, reverb: 0.08, humanize: { time: 0.002, volume: 0.1 } },
    // The double bass, plucked: every beat, and the pushes.
    bass: { sample: 'bassPizz', volume: 0.5, release: 0.12, reverb: 0.1, humanize: { time: 0.003, volume: 0.08 } },
    // The tune on the strings, in octaves. The recordings swell in
    // slowly, so each note starts a little way in.
    violins: { sample: 'violins', volume: 0.36, offset: 0.3, attack: 0.03, release: 0.35, reverb: 0.4, pan: 0.2, humanize: { time: 0.004, volume: 0.05 } },
    violinsHot: { sample: 'violins', volume: 0.16, offset: 0.3, attack: 0.03, release: 0.35, reverb: 0.4, pan: 0.2, humanize: { time: 0.004, volume: 0.05 } },
    violas: { sample: 'violas', volume: 0.2, offset: 0.08, attack: 0.03, release: 0.35, reverb: 0.4, pan: -0.15, humanize: { time: 0.004, volume: 0.05 } },
    // The choir with the tune in the big choruses.
    choir: { sample: 'choir', volume: 0.1, offset: 0.25, attack: 0.05, release: 0.4, reverb: 0.5, pan: 0.1 },
    choirLo: { sample: 'choir', volume: 0.09, offset: 0.25, attack: 0.05, release: 0.4, reverb: 0.5, pan: -0.1 },
    // Sustained strings and soft horns on the chords.
    padLo: { sample: 'violas', volume: 0.12, attack: 0.3, release: 0.6, reverb: 0.5, pan: -0.3 },
    padMid: { sample: 'violas', volume: 0.12, attack: 0.3, release: 0.6, reverb: 0.5, pan: -0.2 },
    padHi: { sample: 'violins', volume: 0.15, attack: 0.3, release: 0.6, reverb: 0.5, pan: 0.3 },
    padTop: { sample: 'violins', volume: 0.13, attack: 0.3, release: 0.6, reverb: 0.5, pan: 0.35 },
    horn1: { sample: 'hornsSoft', volume: 0.45, attack: 0.15, release: 0.6, reverb: 0.5, pan: -0.25 },
    horn2: { sample: 'hornsSoft', volume: 0.45, attack: 0.15, release: 0.6, reverb: 0.5, pan: 0.15 },
    // Spiccato violins in 8ths, driving the P section and the last chorus.
    spic: { sample: 'violinsSpic', volume: 0.14, release: 0.1, reverb: 0.3, pan: 0.3, humanize: { time: 0.003, volume: 0.15 } },
    timpani: { sample: 'timpaniRoll', volume: 0.12, reverb: 0.4, pan: -0.05 },
    // The kit.
    kick: { sample: 'concertBassDrum', drum: 'sample', volume: 0.45, release: 0.15, reverb: 0.05, humanize: { time: 0.002, volume: 0.06 } },
    snare: { sample: 'snare', drum: 'sample', volume: 0.26, ring: true, reverb: 0.22, humanize: { time: 0.002, volume: 0.08 } },
    ghost: { sample: 'snareSoft', drum: 'sample', volume: 0.08, ring: true, reverb: 0.15, humanize: { time: 0.004, volume: 0.3 } },
    roll: { sample: 'snareSoft', drum: 'sample', volume: 0.16, ring: true, reverb: 0.25, humanize: { time: 0.002, volume: 0.15 } },
    hat: { sample: 'hatClosed', drum: 'sample', volume: 0.24, ring: true, reverb: 0.08, pan: 0.2, humanize: { time: 0.002, volume: 0.12 } },
    hatIn: { sample: 'hatSoft', drum: 'sample', volume: 0.14, ring: true, reverb: 0.08, pan: 0.2, humanize: { time: 0.003, volume: 0.3 } },
    hatOpen: { sample: 'hatOpen', drum: 'sample', volume: 0.3, release: 0.2, reverb: 0.15, pan: 0.2 },
    ride: { sample: 'ride', drum: 'sample', volume: 0.2, ring: true, reverb: 0.2, pan: -0.2, humanize: { time: 0.002, volume: 0.15 } },
    tomHi: { sample: 'tom', drum: 'sample', detune: 500, volume: 0.22, ring: true, reverb: 0.25, pan: 0.15 },
    tom: { sample: 'tom', drum: 'sample', volume: 0.24, ring: true, reverb: 0.25 },
    tomLo: { sample: 'tom', drum: 'sample', detune: -400, volume: 0.26, ring: true, reverb: 0.25, pan: -0.15 },
    crash: { sample: 'crash', drum: 'sample', volume: 0.16, ring: true, reverb: 0.35 },
    swell: { sample: 'cymbalSwell', drum: 'sample', volume: 0.12, reverb: 0.5 },
  },

  sections: {
    // The piano alone, soft, in G minor.
    i1: fit('i1', {
      keysSoft: (({ acc, run }) => acc.map((n, i) => (n === '.' ? run[i] : n)))(keys(I1_CHORDS, DRIVE, 55, 72)),
      swell: swellInto(3),
    }, 3),

    // The hook in pieces, on swells of the whole band; bar 4 drops back to
    // the piano alone, bar 6 is held without the bass.
    i2: fit('i2', (() => {
      const big = (b) => b === 1 || b === 2 || b === 4 || b === 6;
      const { acc, run } = keys(I2_CHORDS, DRIVE, 55, 72);
      const bassNotes = bassLine(I2_CHORDS, LONG, I2_TUNE);
      return {
        keysAcc: acc, keys: run,
        ...lead(I2_TUNE, { strings: false }),
        ...Object.fromEntries(Object.entries(lead(I2_TUNE, { piano: false })).map(([k, v]) => [k, bars(v, (b) => b !== 3)])),
        bass: bars(bassNotes, (b) => b !== 3 && b !== 5),
        bassKeys: bars(bassNotes, (b) => b !== 3 && b !== 5),
        ...Object.fromEntries(Object.entries(strings(I2_CHORDS)).map(([k, v]) => [k, bars(v, (b) => b !== 3)])),
        ...Object.fromEntries(Object.entries(horns(I2_CHORDS)).map(([k, v]) => [k, bars(v, big)])),
        timpani: cat(tune('F2 - - - - - - -'), rest(5), tune('. . . . F2 - - -')),
        kick: bars(beat('x.......x.......', 7), big),
        snare: bars(beat('....x.......x...', 7), (b) => b === 2 || b === 6),
        roll: cat(rest(5), beat('........x.x.xxxx'), rest(1)),
        crash: crashOn(7, [1, 4, 6]),
        swell: cat(swellInto(1), rest(6)),
      };
    })(), 7),

    // The eye: no drums, no bass. The hook at half speed, high on the
    // piano, the 8ths glowing under it, the strings holding on.
    C: fit('C', {
      glow: C_TUNE,
      keysSoft: keys(C_CHORDS, GLOW, 60, 77).acc.map((n, i) => (n === '.' ? keys(C_CHORDS, GLOW, 60, 77).run[i] : n)),
      padLo: pad(C_CHORDS, 0, 53, 70), padMid: pad(C_CHORDS, 1, 53, 70), padHi: pad(C_CHORDS, 2, 60, 79),
    }, 4),

    // The rebuild: bass and kick in 8ths, the timpani rolling, the piano's
    // 16ths back; the last bar drops away for a snare roll and a swell.
    R: fit('R', (() => {
      const { acc, run } = keys(R_CHORDS, DRIVE, 55, 72);
      const whole = bassLine(R_CHORDS, ['R', ...Array(15).fill('-')]);
      const long = bassLine(R_CHORDS, LONG);
      const line = bassLine(R_CHORDS, EIGHTHS).map((n, i) => [whole, long, null, null][Math.floor(i / BAR)]?.[i] ?? (i < 3 * BAR ? n : '.'));
      const both = acc.map((n, i) => (n === '.' ? run[i] : n));
      // The piano starts the build softly and comes up to full in bar 3.
      return {
        keysSoft: bars(both, (b) => b < 2), keysAcc: bars(acc, (b) => b >= 2), keys: bars(run, (b) => b >= 2),
        bass: line, bassKeys: bars(line, (b) => b >= 1),
        ...Object.fromEntries(Object.entries(strings(R_CHORDS)).map(([k, v]) => [k, k === 'padLo' || k === 'padMid' ? v : bars(v, (b) => b >= 2)])),
        kick: bars(beat('x.......x.......', 4), (b) => b === 1 || b === 2),
        hatIn: bars(beat('..x...x...x...x.', 4), (b) => b === 2),
        roll: cat(rest(3), beat('x.x.x.x.xxxxxxxx')),
        timpani: cat(tune('Bb2 - - - - - - - | Bb2 - - - - - - - | C3 - - - - - - -'), rest(1)),
        swell: swellInto(4),
      };
    })(), 4),

    // THE HOOK, whole, twice.
    A: fit('A', (() => {
      const { acc, run } = keys(HOOK_CHORDS, DRIVE, 58, 75);
      return {
        keysAcc: acc, keys: run,
        ...lead(HOOK),
        ...bassPart(HOOK_CHORDS, GROOVE, HOOK),
        padLo: pad(HOOK_CHORDS, 0, 53, 70), padMid: pad(HOOK_CHORDS, 1, 53, 70),
        ...Object.fromEntries(Object.entries(horns(HOOK_CHORDS)).map(([k, v]) => [k, bars(v, (b) => b >= 8)])),
        ...groove(16),
        crash: crashOn(16, [0, 8]),
        swell: swellInto(16),
      };
    })(), 16),

    // The soar: the long climbing tune on the strings, the horns under it,
    // the ride, the bass in long notes.
    B: fit('B', (() => {
      const { acc, run } = keys(B_CHORDS, SOAR, 65, 82);
      return {
        keysAcc: acc, keys: run,
        ...lead(B_TUNE),
        choir: B_TUNE, choirLo: up(B_TUNE, -12),
        bass: bassLine(B_CHORDS, LONG, B_TUNE),
        ...strings(B_CHORDS),
        ...horns(B_CHORDS),
        kick: beat('x.......x.......', 8),
        snare: bars8('....x.......x...', '....x.......x.xx', 8),
        ride: beat('x...x...x...x.x.', 8),
        crash: crashOn(8, [0, 4]),
      };
    })(), 8),

    // The drive: the cell in G minor, low, climbing; the bass in 8ths,
    // spiccato strings; the last bar drops away.
    P: fit('P', (() => {
      const { acc, run } = keys(P_CHORDS, PUMP, 55, 72);
      const last = (b) => b < 7;
      const g = groove(8);
      return {
        keysAcc: acc, keys: run,
        ...lead(P_TUNE, { piano: false }),
        melLo: up(P_TUNE, -12),
        ...Object.fromEntries(Object.entries(bassPart(P_CHORDS, EIGHTHS, P_TUNE)).map(([k, v]) => [k, bars(v, last)])),
        spic: bars(pad(P_CHORDS, 3, 67, 84).map((n, i, all) => (i % 2 ? '.' : n === '-' ? all.slice(0, i).reverse().find((m) => typeof m === 'number') : n)), last),
        padLo: pad(P_CHORDS, 0, 53, 70), padMid: pad(P_CHORDS, 1, 53, 70),
        kick: bars(beat('x...x...x...x..x', 8), last),
        snare: bars(g.snare, last),
        ghost: g.ghost,
        hat: bars(beat('x.x.x.x.x.x.x.x.', 8), last), hatIn: bars(beat('.x.x.x.x.x.x.x.x', 8), last),
        roll: cat(rest(7), beat('x.x.x.x.xxxxxxxx')),
        crash: crashOn(8, [0]),
        swell: swellInto(8),
      };
    })(), 8),

    // THE HOOK BIGGER: the choir in with the strings, horns, open hats.
    D: fit('D', (() => {
      const { acc, run } = keys(D_CHORDS, DRIVE, 62, 79);
      const g = groove(10);
      return {
        keysAcc: acc, keys: run,
        ...lead(D_TUNE, { piano: false }),
        melHi: up(D_TUNE, 12), melLo: D_TUNE,
        choir: D_TUNE, choirLo: up(D_TUNE, -12),
        ...bassPart(D_CHORDS, PUSH, D_TUNE),
        ...strings(D_CHORDS),
        ...horns(D_CHORDS),
        ...g,
        hatOpen: beat('......x.......x.', 10),
        crash: crashOn(10, [0, 4, 6, 8]),
      };
    })(), 10),

    // A breath: the piano and the strings, the timpani, and the turn to D.
    brk: fit('brk', (() => {
      const { acc, run } = keys(BRK_CHORDS, SOAR, 60, 77);
      return {
        keysAcc: acc, keys: run,
        ...strings(BRK_CHORDS),
        ...lead(tune('G5 - - - - - A5 Bb5 | A5 - - - - - - -'), { piano: false }),
        bass: tune('Eb2 - - - - - - - | A1 - - - - - - -'),
        bassKeys: tune('Eb2 - - - - - - - | A1 - - - - - - -'),
        timpani: tune('. . . . . . . . | A1 - - - - - - -').map((n) => (typeof n === 'number' ? n + 12 : n)),
        roll: cat(rest(1), beat('........x.x.xxxx')),
        swell: swellInto(2),
      };
    })(), 2),

    // The piano's feature, in D major: the band shouts the cell for a bar,
    // and the piano answers alone, running up two octaves and back.
    E: fit('E', (() => {
      const drive = keys(E_CHORDS, DRIVE, 55, 72);
      const runs = keys(E_CHORDS, RUN, 55, 72);
      const pick = (a, b) => a.map((n, i) => (band(Math.floor(i / BAR)) ? n : b[i]));
      const line = bassLine(E_CHORDS, GROOVE, E_TUNE);
      return {
        keysAcc: pick(drive.acc, runs.acc), keys: pick(drive.run, runs.run),
        ...Object.fromEntries(Object.entries(lead(E_TUNE)).map(([k, v]) => [k, k.startsWith('mel') ? bars(v, band) : v])),
        bass: bars(line, band),
        // Under the piano's runs, the left hand's low root, held.
        bassKeys: line.map((n, i) => (band(Math.floor(i / BAR)) ? n : i % BAR === 0 ? bassRoot(E_CHORDS[i]) : i % BAR < 8 ? '-' : '.')),
        horn1: bars(fold(pad(E_CHORDS, 0, 53, 72)), band), horn2: bars(fold(pad(E_CHORDS, 2, 53, 72)), band),
        padLo: pad(E_CHORDS, 0, 53, 70), padHi: pad(E_CHORDS, 2, 60, 79),
        kick: bars(beat('x..x..x.x.....x.', 16), band),
        snare: bars(beat('....x.......x...', 16), band),
        hat: bars(beat('x.x.x.x.x.x.x.x.', 16), band),
        hatIn: beat('.x.x.x.x.x.x.x.x', 16),
        crash: crashOn(16, [0, 8]),
        roll: cat(rest(15), beat('x.x.x.x.xxxxxxxx')),
        swell: swellInto(16),
      };
    })(), 16),

    // The hook a step higher, in C, with everyone; the top C held over
    // A-flat and B-flat twice, and a high D to finish.
    F: fit('F', (() => {
      const { acc, run } = keys(F_CHORDS, DRIVE, 64, 81);
      const g = groove(18, { ride: true });
      return {
        keysAcc: acc, keys: run,
        ...lead(F_TUNE, { piano: false }),
        melHi: up(F_TUNE, 12), melLo: F_TUNE,
        choir: up(F_TUNE, -12),
        ...bassPart(F_CHORDS, PUSH, F_TUNE),
        ...strings(F_CHORDS),
        ...horns(F_CHORDS),
        spic: pad(F_CHORDS, 3, 67, 84).map((n, i, all) => (i % 2 ? '.' : n === '-' ? all.slice(0, i).reverse().find((m) => typeof m === 'number') : n)),
        ...g,
        hat: beat('x.x.x.x.x.x.x.x.', 18),
        hatOpen: beat('......x.......x.', 18),
        crash: crashOn(18, [0, 4, 8, 12, 14, 16]),
      };
    })(), 18),

    // The last chord ringing, then down to A-flat for the eye.
    tag: fit('tag', (() => {
      const { acc, run } = keys(TAG_CHORDS, SOAR, 60, 77);
      return {
        keysAcc: acc, keys: run,
        violins: tune('D6 - - - - - - - | C6 - - - - - . .'),
        violas: tune('D5 - - - - - - - | C5 - - - - - . .'),
        choir: tune('G5 - - - - - - - | G5 - - - - - . .'),
        ...bassPart(TAG_CHORDS, GROOVE),
        ...strings(TAG_CHORDS),
        ...horns(TAG_CHORDS),
        kick: beat('x..x..x.x.....x.x..x..x.x.......'),
        snare: beat('....x.......x.x.....x.......x...'),
        hat: beat('x.x.x.x.x.x.x.x.x.x.x.x.x.x.x...'),
        crash: crashOn(2, [0, 1]),
        timpani: tune('C2 - - - - - - - | . . . . . . . .').map((n) => (typeof n === 'number' ? n + 12 : n)),
      };
    })(), 2),
  },

  order: ['i1', 'i2', 'C', 'R', 'A', 'B', 'P', 'D', 'brk', 'E', 'F', 'tag', 'C', 'R'],
  loopFrom: 4,
};
