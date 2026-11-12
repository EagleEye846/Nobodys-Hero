import { midi, haddockNotes } from './parts/chapter5.js';

// "Higher Than the Tide": the credits song at the end of Chapter Five, after
// the night the light held. It takes over from "Found at First Light" (kept
// in notes/music-backup-2026-11-11/). Haddock turned the flood crank so the
// rest could get away and did not come back; the hero's light held the sea;
// at dawn the water had pulled back further than anyone had ever seen it.
//
// One grand piano and nothing else, played like a person would play it: the
// pedal down, bright and close (a treble shelf on a mellow recording), the time pushing on in the fast part and
// broadening when the tune arrives, leaning on the ends of phrases, slowing
// at the very end. B-flat major rising to C, about 1m37s, and the last chord
// rings. It is built to climb, and the fast chords run through most of it:
//
//   - the lullaby in its own lilting 6/8, the left hand rocking under it;
//     Haddock's motif; then the big tune's first bars, high and soft, over
//     the first fast chords (a chord on every sixteenth, in groups of
//     3 + 3 + 2: the lullaby's long-short, sped up and straightened into
//     four), which go on alone, then drop low as the deep bass comes in;
//   - THE FAST CHORDS proper, deep bass on every group, in three stages:
//     first LOUD AND ONLY CHORDS, forte, no tune at all; then the tune fades
//     in INSIDE them, quietly, the chords still loud (its longer notes
//     first, then all of its answer); then, at the turn, the chords stop dead
//     for a breath and THE TUNE BREAKS THROUGH, its leap ringing out in
//     octaves over nothing but the bass, and grows through the G-flat; a
//     sweep up through G-flat and A-flat (a lift from outside the key) and a
//     breath;
//   - THE TUNE, at last, in full octaves, ringing bells an octave higher
//     still on its long notes, an alto inside it holding over the chord
//     changes, a second tune in the tenor answering it, and the fast chords
//     still under it all in the left hand;
//   - its middle, quieter, over the fast chords again: up to the high C,
//     then the one flat note (G-flat) and a long fall;
//   - A-flat, B-flat, then the pedal comes up: a held silence, and in it,
//     barely there, the G the climb starts on; and up into C: THE LAST
//     CLIMB, the tune a step higher than it has ever been, to its one high F
//     at the very top of the song, falling to E (an appoggiatura); then the
//     floor drops away as it comes down, and home in C, light, ringing;
//   - the tune's opening once more, softly and high; Haddock's motif, low;
//     one last chord, spread as wide and open as it goes.
//
// Why 6/8 at the start and four after: the lullaby is a 6/8 song (the way
// Haddock hums it), and the fast chords' 3 + 3 + 2 is that same lilt pressed
// into four beats, so the song's two halves are one rhythm, slow and fast.
// The fast part stays in four (with its 3 + 3 + 2 groups) so it keeps its
// drive.
//
// THE BIG TUNE (sixteen bars, B-flat; the second tune and the rest are below)
// is made of the chapter's three little tunes (parts/chapter5.js):
//   bars 1-4   the question. THE COAST CELL (F B-flat B-flat C: 5 1 1 2) in
//              the fast chords' own 3 + 3 + 2, stepping on to D; a held F over
//              E-flat (a ninth that sinks to the root); HADDOCK'S MOTIF
//              (D C B-flat, down to F) sinking to a long low F like a
//              foghorn; then the lullaby's ending, a quick climb that stops on
//              C, asking (it gets there half a beat early).
//   bars 5-8   the answer: the same start, but the held note a step higher
//              (G), and down home to B-flat.
//   bars 9-12  the turn. A breath, then a leap up to B-flat, held over the bar
//              line, and the high C; then the held note comes back as G-FLAT,
//              not G (the one flat note that turns Haddock's motif sad), and
//              the line falls a whole octave and a half to the low F.
//   bars 13-16 the coast cell once more, and the lullaby's rise (F B-flat) to
//              the tune's one high E-flat, held over G minor and leaning down
//              onto D; then down through C to home.
// In the reveal the turn's last bar goes A-flat, B-flat, and the last four
// bars are a step up, in C: the high E-flat becomes a high F, over A minor.
//
// The time: the song is written in sixteenths, and a tempo map (TEMPO, below)
// turns them into seconds, so it can push and broaden like a player; LEAN
// stretches single beats (the end of a phrase, the breath before the tune).
// That's why it runs on a fine grid (24 steps a beat at 130): a note lands on
// the nearest step, never more than a hundredth of a second out. (The 6/8
// bars are twelve sixteenths each, eight of them in the first six bars.)
//
//   boat   15 bars  0:00  the lullaby in 6/8, the left hand rocking (128);
//                         0:11 Haddock's motif, struck, then echoed high;
//                         0:15 the big tune's first bars over the first fast
//                         chords, high; 0:22 the chords alone; 0:26 the
//                         deep bass
//   rush   16 bars  0:28  THE FAST CHORDS (131), loud and only chords; 0:35
//                         the tune's longer notes fade in inside them; 0:43
//                         all of its answer; 0:50 the tune breaks through
//                         (the turn); 0:55 the lift and the breath
//   found  12 bars  0:57  THE TUNE in full octaves (126), the alto and the
//                         tenor inside it, the fast chords under; 1:05 the
//                         turn; 1:11 A-flat, B-flat and the held silence;
//                         1:13 THE LAST CLIMB in C (125), the high F (1:15),
//                         thinning from 1:17, home at 1:19, ringing
//   after   2 bars  1:21  the tune's opening, softly and high, in C
//   home    4 bars  1:26  a breath; 1:28 Haddock's motif low; 1:31 the last
//                         rise; 1:34 the last chord, left to ring (84)

// ------------------------------------------------------------------ time
const BEAT_STEPS = 24;
const GRID_BPM = 130;
const STEP_SECONDS = 60 / GRID_BPM / BEAT_STEPS;
const BAR = 16; // sixteenths

// [bar, bpm]: the tempo at the start of that bar; `true` slides it to the next
// entry's tempo over the bars between.
const TEMPO = [
  [0, 128.5], [14, 128.5, true], [15, 131.5], [30, 131.5, true], [31, 126], [35, 127.5], [38, 128],
  [39, 125], [41, 124, true], [42, 116], [43, 106, true], [44, 98, true], [45, 94],
  [46, 98, true], [47, 88, true], [48, 84], [49, 84],
];
// [bar, from, to, stretch]: sixteenths `from` to `to` of that bar held a
// little longer, the way a player leans on a phrase end or takes a breath.
const LEAN = [
  [2, 12, 16, 1.08], [5, 12, 16, 1.1], [7, 12, 16, 1.06], [11, 12, 16, 1.08],
  [22, 12, 16, 1.04], [26, 12, 16, 1.04],
  [30, 8, 15, 1.06], [30, 15, 16, 2], // the breath before the tune
  [34, 12, 16, 1.05], // the question's C
  [38, 8, 14, 1.06], [38, 14, 16, 2.6], // the breath before the last climb
  [40, 4, 16, 1.05], [41, 12, 16, 1.1], // the high F; home
];
const SECTIONS = [['boat', 0], ['rush', 15], ['found', 31], ['after', 43], ['home', 45]];
const BARS = 49;

// Seconds at the start of every sixteenth.
const SIXTEENTH_TIMES = (() => {
  const bpmAt = (bar) => {
    let i = 0;
    while (i + 1 < TEMPO.length && TEMPO[i + 1][0] <= bar) i++;
    const [b0, v0, slide] = TEMPO[i];
    const next = TEMPO[i + 1];
    if (!slide || !next) return v0;
    return v0 + (next[1] - v0) * ((bar - b0) / (next[0] - b0));
  };
  const lean = (s) => {
    const bar = Math.floor(s / BAR);
    const at = s % BAR;
    return LEAN.find(([b, from, to]) => b === bar && at >= from && at < to)?.[3] ?? 1;
  };
  const out = [0];
  for (let s = 0; s < BARS * BAR; s++) out.push(out[s] + (60 / bpmAt(s / BAR) / 4) * lean(s));
  return out;
})();
const secondsAt = (at) => {
  const i = Math.min(Math.floor(at), SIXTEENTH_TIMES.length - 2);
  return SIXTEENTH_TIMES[i] + (at - i) * (SIXTEENTH_TIMES[i + 1] - SIXTEENTH_TIMES[i]);
};
const stepAt = (at) => Math.round(secondsAt(at) / STEP_SECONDS);

// ------------------------------------------------------------------ touch
// How hard a key is struck, 1 (barely) to 12 (as hard as it goes). The
// piano rings open and bright at every strength; only the very softest
// touches (the last chord's whisper) are rounded off a little.
const TOUCH = [null,
  [0.05, 6000], [0.064, 8000], [0.08], [0.098], [0.118], [0.14],
  [0.165], [0.195], [0.23], [0.27], [0.32], [0.38]];
const piano = (touch, hand, ring = false) => {
  const [volume, muffle] = TOUCH[touch];
  return {
    sample: 'grandPiano', volume, release: ring ? 1.2 : 0.9, reverb: 0.38,
    // The left hand a little left, the right a little right, as from the bench.
    pan: hand === 'l' ? -0.14 : 0.14,
    ...(muffle ? { muffle } : {}), ...(ring ? { ring } : {}),
    // A treble shelf: the recording is a mellow one, and this asks for a
    // grand heard close, bright and present.
    filter: { type: 'highshelf', frequency: 1800, gain: 12 },
    humanize: { time: 0.006, volume: 0.1 },
  };
};

// ------------------------------------------------------------------ chords
const ROOTS = { C: 0, 'C#': 1, Db: 1, D: 2, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, Ab: 8, A: 9, Bb: 10, B: 11 };
// 'Bb', 'Gm', 'F7', 'Fsus', 'Ebmaj7', 'Bbadd9', 'Bb/F': its notes (0-11) and bass.
function chord(symbol) {
  const m = symbol.match(/^([A-G][b#]?)(m)?(maj7|7|sus|add9)?(?:\/([A-G][b#]?))?$/);
  if (!m) throw new Error(`Higher Than the Tide: can't read the chord '${symbol}'`);
  const root = ROOTS[m[1]];
  const third = m[3] === 'sus' ? 5 : m[2] ? 3 : 4;
  const extra = { 7: [10], maj7: [11], add9: [2] }[m[3]] ?? [];
  const pcs = [0, third, 7, ...extra].map((i) => (root + i) % 12);
  return { root, third: (root + third) % 12, pcs, bass: m[4] ? ROOTS[m[4]] : root };
}
const pc = (n) => ((n % 12) + 12) % 12;
// The first `count` notes of the chord at or above `low`.
function tones(c, low, count) {
  const out = [];
  for (let n = low; out.length < count; n++) if (c.pcs.includes(pc(n))) out.push(n);
  return out;
}
// The same chord without its seventh or ninth: low and close, a seventh
// against the root only muddies, so the colour is left to the top.
const plain = (c) => ({ ...c, pcs: c.pcs.slice(0, 3) });
// The chord's bass note in the octave from `low`.
const bassFrom = (c, low) => low + pc(c.bass - low);
// 'Eb Cm | F': a bar's chords (two in a bar is half a bar each).
const barChords = (text) => text.split('|').map((bar) => bar.trim().split(/\s+/).map(chord));
const chordIn = (bar, step) => bar[Math.floor((step / BAR) * bar.length)];

// ------------------------------------------------------------------ tunes
// 'F4:6 Bb4:2 ...', each note's length in sixteenths ('.' rests); bar lines
// are only for reading, and a note may be held over one.
function line(text, semitones = 0) {
  const out = [];
  let at = 0;
  for (const token of text.trim().split(/\s+/)) {
    if (token === '|') continue;
    const [name, len] = token.split(':');
    if (name !== '.') out.push({ at, midi: midi(name) + semitones, len: Number(len) });
    at += Number(len);
  }
  return out;
}
// One bar of a tune, counted from its start. A note held over from the bar
// before comes too, marked `tied` (it is already sounding: nothing strikes it).
const barOf = (notes, bar) => notes.flatMap((n) => {
  const start = bar * BAR;
  if (n.at >= start && n.at < start + BAR) return [{ ...n, at: n.at - start }];
  if (n.at < start && n.at + n.len > start) return [{ ...n, at: 0, len: n.at + n.len - start, tied: true }];
  return [];
});
const struck = (list) => list.filter((n) => !n.tied);
const up = (list, semitones) => list.map((n) => ({ ...n, midi: n.midi + semitones }));
const NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const nameOf = (n) => `${NAMES[pc(n)]}${Math.floor(n / 12) - 1}`;
// Haddock's motif (3 2 1, 5 below) on a tonic, long-short-long-long.
const haddock = (tonic, minor = false) => haddockNotes(tonic, { minor }).map((n, i) => `${nameOf(n)}:${[6, 2, 4, 4][i]}`).join(' ');

const TUNE = line(`
  F4:3 Bb4:3 Bb4:2 C5:4 D5:4   | F5:8 Eb5:4 C5:4        | D5:3 C5:3 Bb4:2 F4:8 | G4:2 A4:2 Bb4:2 C5:10
  F4:3 Bb4:3 Bb4:2 C5:4 D5:4   | G5:8 F5:4 D5:4         | Eb5:3 D5:3 C5:2 A4:8 | Bb4:14 .:2
  .:4 D5:2 G5:2 Bb5:12         | C6:2 Bb5:2 G5:8        | Gb5:8 F5:4 Db5:4       | C5:6 Bb4:2 F4:8
  F4:3 Bb4:3 Bb4:2 C5:4 D5:4   | F5:2 Bb5:2 Eb6:6 D6:6  | C6:6 Bb5:2 A5:4 C6:4 | Bb5:16
`);
// The turn's held G comes back as G-flat over E-flat minor (the major IV
// turned minor); everything else stays in the key.
const TUNE_CHORDS = barChords(`
  Bb | Ebmaj7 | Gm F | Eb F | Bb | Gm | Cm F | Bb |
  Gm | Eb | Ebm | Cm F | Bb | Gm | Cm7 F | Bb
`);

// THE SECOND TUNE, in the tenor, under the big one when it is revealed: it
// moves where the big tune holds and holds where it moves. Under the coast
// cell's climb it falls through Haddock's motif (D C B-flat, F), the other
// way; under the held F it plays the coast cell itself, on E-flat; then the
// lullaby's rise in G minor, and a seventh (E-flat) that falls into the turn.
const SECOND = line(`
  D4:6 C4:2 Bb3:4 F3:4 | Bb3:3 Eb4:3 Eb4:2 G4:8 | G3:3 Bb3:3 D4:2 C4:8 | C4:6 Bb3:2 A3:4 Eb4:4
`);
// And in C, under the last climb: Haddock's motif again; then, as the tune
// leaps away, it climbs too, an octave up into the middle of the piano: the
// rise of A minor under the high F, up to the seventh of G, and home on the E.
const SECOND_C = line(`
  E4:6 D4:2 C4:4 G3:4 | E4:4 A4:4 C5:8 | A4:6 C5:2 D5:4 F5:4 | E5:16
`);

// The lullaby in B-flat major, re-barred: 3 + 3 + 2 sixteenths a bar. Its
// last bar is Haddock's motif (D C B-flat), home.
const LULLABY = line(`
  D4:6 F4:6 Bb4:4  | Bb4:6 A4:6 G4:4 | F4:6 Eb4:6 D4:4 | C4:12 F4:4
  D4:6 F4:6 Bb4:4  | D5:6 C5:6 Bb4:4 | G4:6 F4:6 Eb4:4 | D4:4 C4:2 Bb3:10
`);
const LULLABY_CHORDS = barChords('Bb | Gm | Ebmaj7 | F | Bb | Gm | Eb F | Bb');

// ------------------------------------------------------------------ a score
// Notes go down in sixteenths ({ at, midi, len, touch, hand }); at the end
// they're turned into steps by the tempo map and dealt out over as many
// piano tracks as they need (one note at a time on a track), so a chord is
// simply several notes at once.
const notes = [];
function put(at, pitch, len, touch, hand = 'r', ring = false) {
  const note = typeof pitch === 'string' ? midi(pitch) : pitch;
  if (touch < 1 || !Number.isFinite(note)) return;
  notes.push({ at, midi: note, len: Math.max(0.5, len), touch: Math.min(12, Math.round(touch)), hand, ring });
  return notes.at(-1);
}
// How a singer would lean on each note of a phrase: the top note a little
// more, the downbeat a touch, the short pickups and the last note of a
// phrase less.
function phrasing(list) {
  return list.map((n, i) => {
    const prev = list[i - 1];
    const next = list[i + 1];
    let lean = 0;
    if (n.len <= 2) lean -= 1;
    if (n.at % BAR === 0) lean += 0.4;
    if (n.len >= 4 && (!prev || n.midi > prev.midi) && (!next || n.midi > next.midi)) lean += 0.7;
    if (!next || next.at > n.at + n.len || n.len >= 12) lean -= 0.5;
    return lean;
  });
}
// A tune from bar `bar`, in `octaves` (e.g. [12, 0]: an octave up, doubled
// under), the top `touch`, the rest `under`, phrased. Tied notes are already
// sounding.
function tune(bar, list, touch, { octaves = [0], under = touch - 1, legato = 1, hand = 'r' } = {}) {
  const sung = struck(list);
  const lean = phrasing(sung);
  sung.forEach((n, k) => octaves.forEach((o, i) => put(bar * BAR + n.at, n.midi + o, n.len + legato, (i ? under : touch) + lean[k], hand)));
}
// The two chord notes under each long note of a tune (shorter ones go bare),
// never a semitone off the tune's own note in any octave (a seventh under
// its root, a fourth over its third), and let go as the tune moves on.
function fill(bar, list, chords, touch, { top = 0, min = 4, count = 2 } = {}) {
  for (const n of struck(list)) {
    if (n.len < min) continue;
    const at = bar * BAR + n.at;
    const c = chordIn(chords[Math.floor(at / BAR) - bar] ?? chords.at(-1), at % BAR);
    const pitch = n.midi + top;
    const below = tones(c, pitch - 10, 8)
      .filter((x) => x < pitch - 2 && x > pitch - 11 && ![1, 11].includes(pc(x - pitch)))
      .slice(-count);
    for (const note of below) put(at, note, n.len, touch);
  }
}
// THE ALTO: an inner voice in the right hand, between the tune and its
// octave, moving a step at a time from chord to chord. Where its note is not
// in the next chord it is held over the change and only then falls a step to
// the chord (a suspension, the tender ache of a held note), and it never sits
// a semitone from the tune. It comes back each half bar. Returns its last
// note, so the next bar can carry on from it.
function alto(bar, melody, chords, touch, { from = null, top = 12 } = {}) {
  let prev = from;
  for (const h of [0, 8]) {
    const c = chordIn(chords, h);
    const sung = melody.filter((n) => n.at < h + 8 && n.at + n.len > h);
    if (!sung.length) continue;
    const lo = Math.max(...sung.map((n) => n.midi)) + 3;
    const hi = Math.min(...sung.map((n) => n.midi)) + top - 3;
    const ok = (x) => x >= lo && x <= hi && sung.every((n) => ![1, 11].includes(pc(x - n.midi)));
    const cands = tones(c, lo, 8).filter(ok);
    if (!cands.length) continue;
    const near = (x) => cands.reduce((a, b) => (Math.abs(b - x) < Math.abs(a - x) ? b : a));
    const at = bar * BAR + h;
    if (prev && !c.pcs.includes(pc(prev.midi)) && ok(prev.midi)) {
      // Held over, then down a step into the chord.
      const down = cands.filter((x) => x < prev.midi && prev.midi - x <= 2).at(-1);
      if (down) {
        prev.len += 4;
        prev = put(at + 4, down, 4, touch - 0.5);
        continue;
      }
    }
    prev = put(at, prev ? near(prev.midi) : cands.at(-1), 8, touch);
  }
  return prev;
}
// Steps from `at` to the next change of the pedal (every half bar).
const toPedal = (at, every = 8) => every - (at % every);
// A chord rolled from the bottom, `gap` sixteenths apart.
function roll(at, list, len, touch, { gap = 0.25, hand = 'l', ring = false } = {}) {
  list.forEach((n, i) => put(at + i * gap, n, len - i * gap, typeof touch === 'function' ? touch(i) : touch, hand, ring));
}

// ------------------------------------------------------------------ figures
// The left hand rolling in 8ths from the bass: bass, fifth, octave, tenth,
// and back down; every note held to the pedal.
const ROLL_UP = [0, 7, 12, 'tenth', 19, 'tenth', 12, 7];
// `under`: a tune it must stay below (its notes, from this bar), so the left
// hand never climbs into it.
function rolling(bar, chords, low, touch, { from = 0, under = null } = {}) {
  for (let i = from; i < 8; i++) {
    const at = bar * BAR + i * 2;
    const c = chordIn(chords, i * 2);
    const base = bassFrom(c, low);
    const tenth = 12 + pc(c.third - c.bass);
    const step = ROLL_UP[i] === 'tenth' ? tenth : ROLL_UP[i];
    let note = base + step;
    const sung = under && (under.filter((n) => n.at <= i * 2).at(-1) ?? under[0]);
    while (sung && note > sung.midi - 3) note -= 12;
    // The hand swells up to the top of the roll and falls back.
    const swell = [1, 0, 0.3, 0.5, 0.7, 0.4, 0.2, 0][i];
    put(at, note, toPedal(i * 2), touch + swell, 'l');
  }
}
// A deep bass octave on the sixteenths given.
function deep(bar, chords, low, touch, steps = [0, 8]) {
  for (const s of steps) {
    const base = bassFrom(chordIn(chords, s), low);
    put(bar * BAR + s, base, toPedal(s), touch, 'l');
    put(bar * BAR + s, base + 12, toPedal(s), touch - 1, 'l');
  }
}
// THE FAST CHORDS, in the right hand: a chord on every sixteenth, grouped
// 3 + 3 + 2, with `sing` (a tune's notes in this bar, { at, midi, len }) as
// its top note, so the tune runs through the rush. The whole chord under the
// tune's note on the first of each group, the accent; then the top with one
// note under it, turn about. A new note of the tune is struck a little
// harder. The left hand answers on the second and third of each group, the
// fifth (or the next chord note up) then the root, low. The pedal is down
// through each half bar (one chord), so the rush rings as a wash, the tune's
// notes riding on it (each stops when the next one comes); a key struck
// again stops its last sound, as on a real piano.
const GROUPS = [[0, 3], [3, 3], [6, 2], [8, 3], [11, 3], [14, 2]];
function rush(bar, chords, { sing, touch, accent = touch + 1.7, fresh: hit = accent + 0.8, lh = 34, floor = 48, swell = 0, from = 0, bare = false, thin = false }) {
  const singing = (s) => sing.filter((n) => n.at <= s).at(-1) ?? sing[0];
  for (const [start, size] of GROUPS) {
    const c = chordIn(chords, start);
    const root = bassFrom(c, lh);
    // Over the bass, the next chord note at least a fourth up (the fifth,
    // or over a slash chord the root).
    const answer = tones(plain(c), root + 5, 1)[0];
    for (let k = 0; k < size; k++) {
      const s = start + k;
      if (s < from) continue;
      const at = bar * BAR + s;
      const lift = swell * (s / BAR);
      const hold = toPedal(s);
      const top = singing(s).midi;
      // The chord's notes in the octave under the tune's note, and one more
      // below that, so the weight of the chord sits low
      // (never within a tone of the tune's note, so a passing note rubs on nothing).
      const under = tones(plain(c), top - 17, 6).filter((n) => n < top - 2 && n >= floor).slice(-4);
      const fresh = sing.some((n) => n.at === s && !n.tied);
      const moves = sing.find((n) => n.at > s);
      // (`bare`: the tune is played over the chords by itself, so they leave its key alone.)
      if (!bare) put(at, top, moves ? Math.min(hold, moves.at - s) : hold, (fresh ? hit : k === 0 ? accent - 0.4 : touch - 0.6) + lift);
      // Every sixteenth a chord: the whole one on the accent, two of its notes
      // between, turn about.
      const strike = thin ? under.slice(k % 2 ? -1 : -2, k % 2 ? undefined : -1) : k === 0 ? under : k % 2 ? under.slice(0, 2) : under.slice(-2);
      // The hand half-lifts the pedal on each group, so the accents speak.
      for (const n of strike) put(at, n, Math.min(hold, size - k + 1), (k === 0 ? accent - 0.6 : touch - 0.4) + lift);
      if (k === 1) put(at, answer, hold, touch - 0.3 + lift, 'l');
      if (k === 2) put(at, root, hold, touch - 0.6 + lift, 'l');
    }
  }
}
// The same drive in the left hand alone, under a tune in the right: the bass
// on the first of each group (in octaves on the beats where the pedal
// changes), then a chord in the tenor (from `tenor`, kept under `cap`) on
// the others.
function drive(bar, chords, { tenor, cap, touch, bass, swell = 0, count = 3 }) {
  for (const [start, size] of GROUPS) {
    const c = chordIn(chords, start);
    const base = bassFrom(c, 34);
    const t = tones(plain(c), tenor, count).filter((n) => n < cap);
    for (let k = 0; k < size; k++) {
      const s = start + k;
      const at = bar * BAR + s;
      const lift = swell * (s / BAR);
      if (k === 0 && s % 8 === 0) {
        put(at, base, toPedal(s), bass + lift, 'l');
        put(at, base + 12, toPedal(s), bass - 1 + lift, 'l');
      } else if (k === 0) {
        put(at, base + 12, toPedal(s), bass - 1.5 + lift, 'l');
      } else {
        const pair = k === 1 ? t.slice(0, 2) : t.slice(1, 3);
        for (const n of pair) put(at, n, toPedal(s), touch - (k === 2 ? 0.5 : 0) + lift, 'l');
      }
    }
  }
}
// A sweep up through a chord, a note a sixteenth (or `gap`), held.
function sweep(at, c, low, count, touch, { gap = 1, hold = 16, hand = 'l' } = {}) {
  tones(c, low, count).forEach((n, i) => put(at + i * gap, n, hold - i * gap, typeof touch === 'function' ? touch(i) : touch, hand));
}
// A lift through two chords, half a bar each: the bass octave and a sweep up
// from it on each, louder the second time.
function lift(bar, text, touch) {
  const [first, second] = barChords(text)[0];
  for (const [h, c] of [[0, first], [8, second]]) {
    const base = bassFrom(c, 30);
    put(bar * BAR + h, base, 8, touch + 2.5, 'l');
    put(bar * BAR + h, base + 12, 8, touch + 2, 'l');
    sweep(bar * BAR + h + 1, c, base + 19, h ? 6 : 7, (k) => touch + h / 8 + k * 0.3, { hold: 7 - 0.01 });
  }
}

// ------------------------------------------------------------------ boat
// THE LULLABY in its own time, 6/8 (two lilting beats of three), as Haddock
// hummed it: eight short bars in the space of six. Then Haddock's motif
// struck, and echoed high; then the big tune's first bars over the fast
// chords, softly, high up (they arrive earlier than anyone expects), the
// chords going on alone for two bars more; the deep bass comes in on F.
{
  const SIX = 12; // sixteenths in a 6/8 bar
  const lull = line(`
    D4:6 F4:4 Bb4:2 | Bb4:6 A4:4 G4:2 | F4:6 Eb4:4 D4:2 | C4:12
    D4:6 F4:4 Bb4:2 | D5:6 C5:4 Bb4:2 | G4:6 F4:4 Eb4:2 | D4:4 C4:2 Bb3:6
  `);
  const lc = 'Bb Gm Ebmaj7 F Bb Gm Eb Bb'.split(' ').map(chord);
  const chordAt = (at) => lc[Math.min(7, Math.floor(at / SIX))];
  const first = lull.filter((n) => n.at < 4 * SIX);
  const second = lull.filter((n) => n.at >= 4 * SIX);
  // The octave above sings out, the middle one doubles it softly: a music
  // box more than a lullaby hummed low.
  tune(0, first, 10.5, { octaves: [12, 0], under: 8.5 });
  tune(0, second, 11, { octaves: [12, 0], under: 9 });
  // A note of the chord under each longer note.
  for (const n of lull) {
    if (n.len < 4) continue;
    const top = n.midi + (n.at >= 4 * SIX ? 12 : 0);
    const under = tones(chordAt(n.at), top - 10, 6).filter((x) => x < top - 2 && ![1, 11].includes(pc(x - top))).at(-1);
    if (under) put(n.at, under, n.len, 8);
  }
  // The left hand rocking in 8ths, a barcarolle: bass, fifth, tenth, twelfth,
  // tenth, fifth; each note held to the end of the bar, kept under the tune.
  const ROCK = [0, 7, 'tenth', 19, 'tenth', 7];
  for (let b = 0; b < 8; b++) {
    const c = lc[b];
    const base = bassFrom(c, 46);
    const tenth = 12 + pc(c.third - c.bass);
    ROCK.forEach((step, i) => {
      const at = b * SIX + i * 2;
      let note = base + (step === 'tenth' ? tenth : step);
      const sung = lull.filter((n) => n.at <= at).at(-1);
      while (note > sung.midi - 3) note -= 12;
      put(at, note, SIX - i * 2, 7 + [1, 0, 0.4, 0.7, 0.3, 0][i], 'l');
    });
  }

  // Haddock's motif, struck in octaves over E-flat; then high
  // and light, the left hand rolling softly under it.
  const he = barChords('Ebmaj7 | Eb F');
  tune(6, line(haddock('Bb4')), 12, { octaves: [0, -12], under: 10 });
  fill(6, line(haddock('Bb4')), he, 9, { count: 2 });
  put(6 * BAR, 'Eb3', 16, 9.5, 'l');
  rolling(6, he[0], 51, 7.5, { from: 1, under: line(haddock('Bb3')) });
  tune(7, line(haddock('Bb5')), 11);
  fill(7, line(haddock('Bb5')), [he[1]], 8, { count: 2, min: 2 });
  rolling(7, he[1], 51, 6.5);
  const echo = line(haddock('Bb5'));
  for (let i = 0; i < 8; i++) {
    if (echo.some((n) => n.at === i * 2)) continue;
    const c = chordIn(he[1], i * 2);
    const top = echo.filter((n) => n.at <= i * 2).at(-1).midi;
    const below = tones(c, top - 12, 4).filter((x) => x < top - 2);
    put(7 * BAR + i * 2, below[i % below.length], 2, 6);
  }

  // The big tune's first two bars, then its start again with the answer's
  // higher held G (and no more: the rest is for later), over the fast chords,
  // soft and high, the tune their top note; a little louder each bar.
  const alone = barChords('Bb | Ebmaj7 | Bb | Gm');
  const head = [0, 1, 0, 5].flatMap((b, i) => barOf(TUNE, b).map((n) => ({ ...n, at: n.at + i * BAR })));
  tune(8, head, 10.5);
  for (let b = 0; b < 4; b++) {
    rush(8 + b, alone[b], { sing: barOf(head, b), touch: 4 + b * 0.35, accent: 5.6 + b * 0.35, lh: 46, floor: 57, swell: 0.3, bare: true });
  }
  // The fast chords go on alone, high and soft, for two bars, their top
  // note falling G, F, E-flat, C (the answer's held G letting go); then the
  // deep bass comes in on F, and they start again, low.
  rush(12, barChords('Eb')[0], { sing: line('G5:8 F5:8'), touch: 5.8, accent: 7, fresh: 7.8, lh: 58, floor: 62, swell: 0.3, thin: true });
  rush(13, barChords('Cm F')[0], { sing: line('Eb5:8 C5:8'), touch: 6, accent: 7.2, fresh: 8, lh: 58, floor: 62, swell: 0.3, thin: true });
  const f = chord('F');
  put(14 * BAR + 8, 'F1', 8, 9, 'l');
  put(14 * BAR + 8, 'F2', 8, 9, 'l');
  put(14 * BAR, 'C5', 12, 12);
  put(14 * BAR, 'A4', 12, 10);
  put(14 * BAR, 'F4', 12, 9);
  put(14 * BAR, 'F3', 8, 9, 'l');
  put(14 * BAR, 'C4', 8, 8, 'l');
  put(14 * BAR + 12, 'F4', 4, 11);
  for (const [start, size] of GROUPS.slice(2)) {
    const at = 14 * BAR + start;
    const t = tones(f, 53, 3);
    const grow = (start - 6) / 10;
    put(at, t[0], toPedal(start), 7.5 + grow, 'l');
    put(at + 1, t[2], toPedal(start + 1), 6.5 + grow);
    if (size === 3) put(at + 2, t[1], toPedal(start + 2), 6.5 + grow, 'l');
  }
}

// ------------------------------------------------------------------ rush
// THE FAST CHORDS, in three stages.
//   (a) bars 15-18: LOUD, AND ONLY CHORDS. A full chord on every sixteenth,
//       forte, bright, no tune at all, over the deep bass on every group:
//       the big tune's first four chords going round, their top note simply
//       stepping to the nearest note of each.
//   (b) bars 19-26: the tune fades in INSIDE them. The chords keep going,
//       loud, their top note now the tune's shape an octave down; over them,
//       quietly, first only the tune's longer notes (19-22), then all of its
//       answer (23-26), a little louder each phrase.
//   (c) bars 27-29: the turn, and the tune breaks through: the chords stop
//       dead for its opening rest, and its leap rings out in octaves over
//       nothing but the bass; the chords come back under it, and it grows
//       through the G-flat and the fall. Bar 30: the lift through G-flat and
//       A-flat, a breath, and THE REVEAL.
{
  const B0 = 15;
  // (a) A top line that just steps to the nearest note of each chord,
  // around the top of the treble staff's lower half.
  let prev = 67;
  for (let i = 0; i < 4; i++) {
    const bar = B0 + i;
    const chords = TUNE_CHORDS[i];
    const sing = [0, 8].map((h) => {
      const c = plain(chordIn(chords, h));
      const cands = tones(c, 63, 4).filter((x) => x <= 70);
      prev = cands.reduce((a, b) => (Math.abs(b - prev) < Math.abs(a - prev) ? b : a));
      return { at: h, midi: prev, len: 8 };
    });
    const touch = 6 + i * 0.25;
    rush(bar, chords, { sing, touch, accent: touch + 1.8, fresh: touch + 1.8, floor: 50, swell: 0.4 });
    deep(bar, chords, 34, 7.2 + i * 0.2, [0, 3, 6, 8, 11, 14]);
  }
  // (b) and (c): the tune's first eleven bars (bars 1-4 again, then the
  // answer, then the turn) over the chords of each.
  const plan = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  plan.forEach((t, k) => {
    const bar = B0 + 4 + k;
    const chords = TUNE_CHORDS[t];
    const melody = barOf(TUNE, t);
    const touch = 6 + k * 0.12;
    if (k === 8) {
      // THE TUNE BREAKS THROUGH: the turn opens with a rest, and the chords
      // stop for it. Over the bass alone, the leap (D, G, up to the high
      // B-flat) rings out in octaves, and the chords come back under the
      // held B-flat.
      deep(bar, chords, 34, 9, [0]);
      tune(bar, melody, 11, { octaves: [12, 0], under: 9.5 });
      fill(bar, melody, [chords], 8.5, { top: 12, count: 2 });
      rush(bar, chords, { sing: up(melody, -12), touch: touch + 0.4, swell: 0.6, from: 8 });
      deep(bar, chords, 34, 8.5, [8, 11, 14]);
      return;
    }
    rush(bar, chords, { sing: up(melody, -12), touch, swell: 0.4 });
    deep(bar, chords, 34, 7.2 + k * 0.1, [0, 3, 6, 8, 11, 14]);
    if (k < 4) {
      // Quietly, only its longer notes, held, so its outline floats in.
      for (const n of struck(melody)) if (n.len >= 4) put(bar * BAR + n.at, n.midi, Math.max(n.len, 6), 6.5 + k * 0.35);
    } else if (k < 8) {
      tune(bar, melody, 8 + (k - 4) * 0.25, { legato: 0 });
    } else {
      tune(bar, melody, 10.5, { octaves: [12, 0], under: 9, legato: 0 });
    }
  });
  // The lift: G-flat, then A-flat, the left hand sweeping up through each,
  // the tune's B-flat and C over them; then a breath.
  lift(30, 'Gb Ab', 7.5);
  tune(30, line('Bb5:8 C6:7'), 10.5, { octaves: [0, -12], under: 9, legato: 0 });
  // On the breath, A-flat's fifth: the step under the F the tune starts on.
  put(30 * BAR + 15, 'Eb5', 1.5, 9);
  put(30 * BAR + 15, 'Eb4', 1.5, 7.5);
}

// ------------------------------------------------------------------ found
// THE TUNE, in full octaves, bells over its long notes, the alto inside, the
// second tune in the tenor; the fast chords under them all in the left hand.
// Then the turn, in the middle, over the fast chords again, the tune plainly
// on top of them; A-flat and B-flat lifting under its fall, and the held
// silence; and the last climb, in C, a step higher than anything before: the
// high F at the top falling to E, the second tune risen into the middle;
// then the floor drops away, and it lands home, light, ringing.
{
  const B0 = 31;
  // The question (the tune's first four bars), the turn (bars 9 to 12) and
  // the last four bars, a step up.
  const bars = [0, 1, 2, 3, 8, 9, 10, 11, 12, 13, 14, 15].map((b, i) => (i >= 8 ? up(barOf(TUNE, b), 2) : barOf(TUNE, b)));
  const chordsOf = barChords(`
    Bb | Ebmaj7 | Gm F | Eb F |
    Gm | Eb | Ebm | Ab Bb |
    C | Am | Dm7 G | C
  `);
  const second = [...[0, 1, 2, 3].map((b) => barOf(SECOND, b)), [], [], [], [], ...[0, 1, 2, 3].map((b) => barOf(SECOND_C, b))];
  // How hard each bar is played: the tune's top, its octave under, the
  // chord under that, the bass, the left hand's figure, the second tune.
  const LEVEL = [
    [12, 11.5, 9.5, 10, 8.5, 10.5], [12, 11.5, 9.5, 10, 8.5, 11], [12, 11.5, 9.5, 10, 9, 11], [12, 12, 10.5, 10.5, 9.5, 11],
    [8.5, 0, 0, 5, 5], [8.5, 0, 0, 5.3, 5.3], [8.5, 0, 0, 5.6, 5.6], [10.5, 9, 0, 0, 7.5],
    [12, 12, 10.5, 10, 9, 11], [12, 12, 11, 10.5, 9.5, 11], [12, 11, 10, 10, 8.5, 10.5], [12, 11, 10, 10, 8, 10],
  ];
  let voiceIn = null;
  for (let i = 0; i < 12; i++) {
    const [top, under, inner, bass, figure, voice] = LEVEL[i];
    const bar = B0 + i;
    const melody = bars[i];
    const chords = chordsOf[i];
    if (i >= 4 && i < 7) {
      // The turn: the rush again, the tune its top note, struck out, the
      // bass on every group, quieter than the tune was and gathering.
      rush(bar, chords, { sing: melody, touch: figure, fresh: top - 1, floor: 50, swell: 0.6 });
      deep(bar, chords, 34, bass, [0, 3, 6, 8, 11, 14]);
      continue;
    }
    if (i === 7) {
      // A-flat, B-flat: the left hand sweeping up through each while the tune
      // falls to the low F, and a breath.
      lift(bar, 'Ab Bb', figure);
      tune(bar, melody, top, { octaves: [12, 0], under, legato: 0 });
      continue;
    }
    tune(bar, melody, top, { octaves: [12, 0], under });
    // Inside the octaves, the alto, held over the changes; at the very top,
    // home, plain chord notes instead.
    if (i >= 10) fill(bar, melody, [chords], inner, { top: 12, count: 2 });
    else voiceIn = alto(bar, melody, chords, inner + 0.5, { from: i === 0 || i === 8 ? null : voiceIn });
    tune(bar, second[i], voice);
    if (i < 4 || i === 8) {
      // The longer notes of the question (and of the last climb's first bar)
      // ring a second octave higher still, like bells over the tune: all but
      // those that would reach the high F still to come.
      for (const n of struck(melody)) if (n.len >= 4 && n.midi + 24 <= midi('D7')) put(bar * BAR + n.at, n.midi + 24, n.len, under - 0.5);
    }
    if (i === 10) {
      // After the high F the floor drops away: the falling bar over rolled
      // chords in the middle, no deep bass, the sound thinning as it comes
      // down.
      for (const h of [0, 8]) {
        const c = chordIn(chords, h);
        const base = bassFrom(c, 43);
        roll(bar * BAR + h, [base, ...tones(plain(c), base + 7, 2)], 8, figure - 1.5 - h / 8, { gap: 0.4 });
      }
      continue;
    }
    if (i === 11) {
      // Home, but light: C rolled from the tenor up into the second tune,
      // ringing, nothing low.
      roll(bar * BAR, ['C3', 'G3', 'C4'].map(midi), 16, (k) => figure - 1.5 - k * 0.3, { gap: 0.4, ring: true });
      continue;
    }
    // THE FAST CHORDS come back under the tune, in the left hand: the bass on
    // each group, chords in the tenor under the second tune.
    const cap = Math.min(...[...second[i], ...melody].map((n) => n.midi)) - 2;
    drive(bar, chords, { tenor: cap - 9, cap, touch: figure, bass, swell: 0.5 });
  }
  // The last C left ringing, high, as the chord fades.
  put((B0 + 11) * BAR + 12, 'C7', 14, 8.5);
  put((B0 + 11) * BAR + 12, 'E7', 14, 7.5);
  put((B0 + 11) * BAR + 12, 'G6', 14, 6.5);
  // THE BREATH before the last climb: everything let go two sixteenths
  // early (the pedal up), a held silence, and in it, very softly, high, the
  // G the climb is about to start on: the new key's first note, heard
  // before the new key comes.
  const cut = (B0 + 7) * BAR + 14;
  for (const n of notes) if (n.at >= (B0 + 7) * BAR && n.at < cut && n.at + n.len > cut) n.len = cut - n.at;
  put(cut + 1, 'G6', 1.5, 6.5);
}

// ------------------------------------------------------------------ after
// The tune's opening once more, in C, softly and high, like something heard
// from a long way off; its answer's close (F E D, down to B) slowing to a
// breath on C. The left hand stays up in the middle, light.
{
  const B0 = 43;
  const chords = barChords('C | Dm G');
  const opening = line('G5:3 C6:3 C6:2 D6:4 E6:4 | F6:3 E6:3 D6:2 B5:8');
  tune(B0, opening, 8.5);
  fill(B0, opening, chords, 6, { count: 1 });
  rolling(B0, chords[0], 48, 5.5, { under: barOf(opening, 0) });
  for (const h of [0, 8]) {
    const c = chordIn(chords[1], h);
    const base = bassFrom(c, 50);
    const cap = (barOf(opening, 1).filter((n) => n.at <= h).at(-1)).midi - 3;
    roll((B0 + 1) * BAR + h, [base, ...tones(plain(c), base + 7, 3).filter((n) => n < cap)], 8, 5.2 - (h ? 0.4 : 0), { gap: 0.4 });
  }
}

// ------------------------------------------------------------------ home
// C, rolled, held through a breath, the tune's C on top. Then Haddock's motif
// low, in octaves, over F; its last note, G, is the bass of the next chord,
// so the F lets go for it. The tune's last rise (B C D) over G; and the last
// chord, rolled from the bottom and left to ring, C with a D on top (the
// lullaby's question, still there, softly).
{
  put(45 * BAR, 'C5', 20, 5, 'r', true);
  roll(45 * BAR, ['C3', 'G3', 'E4'].map(midi), 22, 4, { gap: 0.5, ring: true });
  const B0 = 46;
  tune(B0, line(haddock('C4')), 5, { octaves: [0, -12], under: 3, hand: 'l' });
  put(B0 * BAR, 'F2', 12, 4.5, 'l');
  put(B0 * BAR + 0.5, 'A3', 12, 3);
  tune(B0 + 1, line('B3:6 C4:2 D4:8'), 4.5);
  for (const n of ['G2', 'D3']) put((B0 + 1) * BAR, n, 16, 4, 'l');
  put((B0 + 1) * BAR + 0.5, 'F3', 16, 3);
  // The last chord spread as wide and open as it goes: C and G low, then E,
  // B and D (C major with its seventh and ninth, nothing closer than a
  // third), the D on top; and a beat later, high and barely there, the D
  // again, an octave up, like the light still on far out at sea.
  roll((B0 + 2) * BAR, ['C2', 'G2', 'E3', 'B3', 'D4', 'G4', 'D5'].map(midi), 24, (i) => (i === 6 ? 2 : 1.4), { gap: 0.5, ring: true });
  put((B0 + 2) * BAR + 5, 'D6', 12, 1, 'r', true);
}

// ------------------------------------------------------------------ steps
// Each note onto the tempo map's steps, then onto tracks: one per touch and
// hand, as many as a moment needs.
const sections = {};
const instruments = {};
{
  const bounds = SECTIONS.map(([, bar]) => stepAt(bar * BAR));
  const total = stepAt(BARS * BAR);
  bounds.push(total);
  const busy = {};
  const placed = [];
  const sounding = {}; // the last note on each key, so a key struck again stops its last sound
  for (const n of [...notes].sort((a, b) => a.at - b.at || a.midi - b.midi)) {
    const start = stepAt(n.at);
    const end = Math.max(start + 1, stepAt(n.at + n.len));
    const group = `${n.ring ? 'ring' : 'p'}${n.touch}${n.hand}`;
    busy[group] ??= [];
    let k = busy[group].findIndex((until) => until <= start);
    if (k < 0) k = busy[group].push(0) - 1;
    busy[group][k] = end;
    const track = `${group}_${k}`;
    instruments[track] ??= piano(n.touch, n.hand, n.ring);
    const last = sounding[n.midi];
    if (last && last.end > start) last.end = Math.max(last.start + 1, start);
    sounding[n.midi] = { track, start, end, midi: n.midi };
    placed.push(sounding[n.midi]);
  }
  SECTIONS.forEach(([name], i) => {
    const from = bounds[i];
    const to = bounds[i + 1];
    const tracks = {};
    for (const p of placed) {
      if (p.start < from || p.start >= to) continue;
      const steps = (tracks[p.track] ??= Array(to - from).fill('.'));
      steps[p.start - from] = p.midi;
      for (let s = p.start + 1; s < Math.min(p.end, to); s++) steps[s - from] = '-';
    }
    sections[name] = tracks;
  });
}

export const CREDITS_TIDE_THEME = {
  title: 'Higher Than the Tide',
  bpm: GRID_BPM,
  stepsPerBeat: BEAT_STEPS,
  // Plays once, then the credits end.
  loop: false,
  volume: 0.68,
  instruments,
  sections,
  order: SECTIONS.map(([name]) => name),
};
