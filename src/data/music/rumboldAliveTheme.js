import { melody, transpose, hits, HOLD, REST, HIT } from '../../audio/notation.js';
import { SAMPLE_SETS } from '../../audio/sampleSets.js';
import { midi, timpRoot, ORCHESTRA } from './parts/usurper.js';
import { cellIn, FIRST_STEPS_MINOR } from './parts/chapter4.js';
import { RUMBOLD_HOOK, TUCK_TUNE, TUCK_CHORDS } from './rumboldTheme.js';

// "No Strings": the third and last part of the duel with King Peptup (after
// "The Resplendent Hour" and "Behind the Curtain"). Tuck lets go of the bar,
// and the pale-wood mannequin keeps moving anyway. The jaw is jammed, nobody
// is working him, something else is driving him now, and he carries on the
// show alone. The battle swaps to this song with the phase's `music`
// (`music: 'rumboldAlive'`), after a silence. Once he's low, his head turns
// upside down and the finale cue takes over: "Upside Down"
// (rumboldTearTheme.js), the same hook played upside down.
//
// THE IDEA: the king's own show-tune, played by a full orchestra with
// nobody conducting. It's the same strut as "The Resplendent Hour", note
// for note at first, but in the minor with the lights off, and it answers
// itself UPSIDE DOWN. Around it, the machinery: a clock that never stops
// ticking, a creaking pizzicato "string" figure that slips a semitone at
// the end of every bar (the strings being pulled), a music box gone sour,
// and the jaw: a dry clack, the clack from phase 1, now STUTTERING,
// clack-clack-clack, in every gap the tune leaves. Under all of it, Tuck's
// small tune tries to get a word in: the boy who could cut the strings.
//
// THE HOOK, Bb minor, eight bars, one token a 16th (bars 1 and 3 are bars 1
// and 3 of the king's hook in "The Resplendent Hour", with the lights off:
// every D and G flattened. The file checks that.):
//
//   F - - Bb - - Db - - - C - - - . . | F - - C - - A - - - Bb - - - . .  |
//   Gb - Gb - Gb . F Gb - - Db - Bb - Gb - | F - F - F . E F - - C - A - F - |
//   F - - Bb - - Db - - - C - - - . . | F# - - B - - D# - - - C# - - - . . |
//   Db - - C - - B - Bb - - A - - - - | A (held, and the jaw clacks in the gap)
//
// Bar 1 is the chapter's cell (parts/chapter4.js: up a fourth, up a third,
// a step back), minor, strutting in 3-3-4. Bar 2 is the same cell upside
// down (down a fourth, down a third, a step up): the question answered by
// something wrong. Bars 3 and 4 are the king's boast, the one note said
// three times. Bar 6 is his old bright major cell, but a half step out of
// true (the flat second, the one borrowed chord: menace). Bar 7 slides down
// by semitones like a string let out, and bar 8 hangs on the leading note.
// Chords: Bbm F Gb F Bbm B Gb F. The bass walks down Bb A Gb F.
//
// THE ORCHESTRA (all real recordings, VSCO 2 and VCSL, sampleSets.js, and
// the game's own choir): the hook scored the Fox/Williams way, trumpets and
// violins at pitch, a dry close grand piano on it too, cellos and horns an
// octave down (the horns kept out of the gap in their recordings), trombones
// two octaves down, tuba on the roots; a second trumpet a hair sharp beats
// against the first, and the horns sit a hair flat, so the brass is never
// quite in tune with itself. The choir sings it from the second time. Each
// drop is a BRAAAM: trombones, tuba and horns on one low Bb with the gong,
// the deepest drum and the concert bass drum. Taiko on the 3-3-2, snare on
// two and four, timpani pounding the roots, spiccato basses digging in.
// THE MACHINERY: the clock (a dry col-legno tick and a muffled tock, every
// eighth, and it never stops, not even in the quiet); the creak (plucked
// violins and cellos in 3-3-2, the last pluck a semitone under the root);
// the music box (glockenspiel, harp and a celesta made of the piano two
// octaves up, each with a twin a third of a semitone flat, a 16th late);
// the jaw (claps and stabbed brass, stuttering: x.x.x...x.x.).
//
// Bb minor; the second drop half a step up in B minor (phase 1's comeback
// went up a half step too); the slip back down and home in Bb minor.
// 150 BPM, one step a 16th, a bar is 1.6 seconds. The intro plays once
// (12.8s); then it loops from A: 1694 steps, 2m49s:
//
//   intro   8 bars       THE CLOCK: the clock alone, a creaking string cluster;
//                        the music box plays the hook's first two bars, slowly,
//                        its flat twin a step behind; the creak starts; (0:06)
//                        the jaw stutters with the brass stabbing a semitone
//                        apart; (0:10) the build, and ONE BEAT of silence
//   A      16 bars  0:00 THE SHOW GOES ON: the drop (BRAAAM, gong), the hook on
//                        the whole orchestra, the jaw clacking in the gap;
//                        (0:13) again with the choir, violins an octave up, the
//                        sour trumpet, glockenspiel, racing spiccato
//   B      16 bars  0:26 THE JAW: a new riff, the stutter, low strings and
//                        brass in 16ths (Bb . Bb Bb . . Db . C . Bb Bb Bb) that
//                        walks down by semitones; over it the chapter's cell on
//                        the choir and violins, one note every two beats, in
//                        every chord it lands on (Bb minor, the flat second B,
//                        Db, F...). Bars 8 and 16 lose their last 16th note:
//                        the jaw jumps, and the beat with it
//   C      16 bars  0:51 TUCK'S THREAD: Tuck's tune (from "The Resplendent
//                        Hour", here in Bb minor) on a solo violin, a clarinet
//                        under it, small and in tune, over the clock and the
//                        creak; the king's cell mutters underneath in the soft
//                        horns; (1:04) the band comes back and the two tunes
//                        fight: Tuck's on the violins, flute and choir, the
//                        king's cell and boast hammered in the trombones; it
//                        ends on Tuck's B FLAT MAJOR, and the beat goes dead
//   P       8 bars  1:16 THE MUSIC BOX (the pivot, 45% in): near silence. The
//                        clock, and the music box playing the hook UPSIDE DOWN,
//                        slowly, its twin out of true, a bowed tritone (the cold
//                        light) under it; Tuck answers twice on the piano with
//                        his stammer in D flat major, the one warm thing; a
//                        heartbeat on the timpani
//   W      16 bars  1:29 THE DANCE ON STRINGS: 7/8. The hook re-barred: the
//                        strut is 3+3+4+4 sixteenths, so every bar just loses
//                        its last two and limps on; oboe, clarinet and plucked
//                        violins dance it over a 7/8 taiko and the creak;
//                        (1:40) the brass and choir take it over, the strings
//                        race, the last bar is 4/4 again and builds, a swell,
//                        ONE BEAT of silence
//   D      16 bars  1:52 THE SECOND DROP, B minor: BRAAAM on B, the hook half a
//                        step up on everything; (2:05) Tuck's tune taken up by
//                        the whole orchestra, trumpets, violins, choir, the
//                        king's cell and boast fighting under it in the low
//                        brass; it ends on a B MAJOR chord, Tuck's
//   E       8 bars  2:17 THE STRINGS SLIP: the jaw riff in B minor, the
//                        trumpets stuck on the first three notes (F# B D, F# B
//                        D, in threes against the bar's fours: the stuck cell of
//                        all three songs); (2:24) everything slides down by
//                        semitones in parallel minor chords, a string let out,
//                        and lands on F, the door home
//   H      12 bars  2:30 HOME: Bb minor, quiet. The dry piano plays the hook
//                        and sticks halfway on F Bb Db, F Bb Db..., the clock,
//                        the creak, the music box twin; Tuck's stammer twice on
//                        the solo violin; (2:43) the jaw stutters faster and
//                        faster over a timpani roll, the strings climb, a
//                        swell, ONE BEAT of silence, and the drop at A
//
// HOW THE MOTIFS APPEAR: the king's hook in A (straight), W (re-barred to
// 7/8), D (half a step up), H (stuck), P (upside down) and in the finale
// (upside down, in E minor); the chapter's cell in bar 1 of the hook, as
// the B section's chorale in six keys, and stuck in E and H; Tuck's tune in
// C (fragile, then fighting), P (his stammer in D flat major), D (the whole
// orchestra's) and H (twice, small). The loop starts and ends the same way
// as the intro (build, silence, drop), so the seam is the drop itself.

// --- Helpers. ---
const BAR = 16;                                           // 4/4, one step a 16th
const r = (text) => melody(text, 1);                      // each token a 16th
const e = (text) => melody(text, 2);                      // each token an 8th
const q = (text) => melody(text, 4);                      // each token a beat
const h = (text) => melody(text, 8);                      // each token two beats
const R = REST;
const H = HOLD;
const steps = (n) => Array(n).fill(R);
const rest = (bars) => steps(bars * BAR);
const times = (track, n) => Array(n).fill(track).flat();
const at = (bars, track) => [...rest(bars), ...track];
const after = (bars, track) => [...rest(bars), ...track.slice(bars * BAR)];
const barsOf = (track, from, to) => track.slice(from * BAR, to * BAR);
const held = (name, n) => [typeof name === 'number' ? name : midi(name), ...Array(n - 1).fill(H)];
const holdBar = (p, len = BAR) => [p, ...Array(len - 1).fill(H)];
const up = transpose;
const onBars = (bars, list, pattern) => Array.from({ length: bars }, (_, i) => (list.includes(i) ? pattern : steps(pattern.length))).flat();
// A drum pattern as notes: each 'x' a `note` (for pitched hits: ticks, stabs).
const pitched = (pattern, note) => pattern.map((x) => (x === HIT ? (typeof note === 'number' ? note : midi(note)) : R));
// A chromatic climb: `n` notes from `from`, `len` steps each.
const climb = (from, n, len = 4) => Array.from({ length: n }, (_, i) => [from + i, ...Array(len - 1).fill(H)]).flat();
// Each step played twice as long (a tune at half speed).
const slow = (track) => track.flatMap((s) => [s, s === R ? R : H]);
const mapTracks = (tracks, fn) => Object.fromEntries(Object.entries(tracks).map(([name, track]) => [name, fn(track, name)]));

function section(length, tracks) {
  return mapTracks(tracks, (track, name) => {
    if (track.length > length) throw new Error(`No Strings: '${name}' is ${track.length} steps, longer than ${length}`);
    return [...track, ...steps(length - track.length)];
  });
}
// The whole band stops dead for the last beat (4 steps).
const stopdown = (tracks, n = 4) => mapTracks(tracks, (track) => [...track.slice(0, -n), ...steps(n)]);
// THE JOLT: the bars listed lose their last `cut` steps (the jaw jumps and
// the beat with it). A note that started in the cut moves to the next step.
function jolt(tracks, list, cut = 2) {
  return mapTracks(tracks, (track) => {
    const out = [];
    let carry = null;
    track.forEach((s, i) => {
      if (list.includes(Math.floor(i / BAR)) && i % BAR >= BAR - cut) {
        if (typeof s === 'number') carry = s;
        return;
      }
      out.push(carry !== null && s === H ? carry : s);
      carry = null;
    });
    return out;
  });
}
// The horns' recordings skip from C4 to D5: a doubling note in that gap
// drops an octave.
const hornFit = (track) => track.map((s) => (typeof s === 'number' && s > 63 && s < 71 ? s - 12 : s));

// --- Chords: 'Bbm', 'F7', 'Bdim', 'Ebm,F' (two in a bar). Patterns name
// chord tones: R root, T third, F fifth, S seventh, N a semitone under the
// root (the creak); '+' an octave up, '-' one down. ---
const QUALITY = { '': [0, 4, 7, 12], m: [0, 3, 7, 12], 7: [0, 4, 7, 10], dim: [0, 3, 6, 9] };
const NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
function chordOf(symbol) {
  const m = symbol.match(/^([A-G][#b]?)(m|7|dim)?$/);
  if (!m) throw new Error(`No Strings: can't read the chord '${symbol}'`);
  return { root: midi(`${m[1]}4`) % 12, tones: QUALITY[m[2] ?? ''], minor: m[2] === 'm' || m[2] === 'dim' };
}
const inBand = (pc, low) => low + ((pc - (low % 12) + 12) % 12);
function toneOf(chord, low, p) {
  const shift = p.endsWith('+') ? 12 : p.endsWith('-') ? -12 : 0;
  const base = inBand(chord.root, low);
  return (p[0] === 'N' ? base - 1 : base + chord.tones['RTFS'.indexOf(p[0])]) + shift;
}
const barList = (chords) => chords.split(/\s+/).filter(Boolean);
function comp(chords, pattern, low) {
  return barList(chords).flatMap((bar) => {
    const parts = bar.split(',');
    const each = pattern.length / parts.length;
    return parts.flatMap((symbol, i) => {
      const chord = chordOf(symbol);
      const slice = pattern.slice(i * each, (i + 1) * each);
      if (i > 0 && slice[0] === H) slice[0] = pattern[0];
      return slice.map((p) => (p === R || p === H ? p : toneOf(chord, low, p)));
    });
  });
}
const moveChords = (chords, by) => chords.replace(/([A-G][#b]?)(m|7|dim)?/g, (_, root, kind = '') => `${NAMES[(midi(`${root}4`) + by) % 12]}${kind}`);
const bars = (chords, from, to) => barList(chords).slice(from, to).join(' ');
// Timpani on each bar's (first) chord root: 0 the root, -5 the fifth below.
const timps = (chords, pattern) => barList(chords).flatMap((bar) => {
  const root = timpRoot(NAMES[chordOf(bar.split(',')[0]).root]);
  return pattern.map((p) => (typeof p === 'number' ? root + (root + p < 41 ? p + 12 : p) : p));
});

// UPSIDE DOWN: a tune turned over inside the minor scale around `axis`
// (each step up becomes a step down). A note outside the scale keeps its
// sharpness the other way up.
const MINOR = [0, 2, 3, 5, 7, 8, 10];
export function upsideDown(track, axis) {
  return track.map((s) => {
    if (typeof s !== 'number') return s;
    const rel = s - axis;
    const octave = Math.floor(rel / 12);
    const pc = rel - 12 * octave;
    let d = 6;
    while (MINOR[d] > pc) d--;
    const extra = pc - MINOR[d];
    const degree = -(octave * 7 + d);
    const o2 = Math.floor(degree / 7);
    return axis + 12 * o2 + MINOR[degree - 7 * o2] - extra;
  });
}

// --- THE HOOK, Bb minor. ---
export const HOOK = r(`
  F4 - - Bb4 - - Db5 - - - C5 - - - . .           | F5 - - C5 - - A4 - - - Bb4 - - - . .          |
  Gb5 - Gb5 - Gb5 . F5 Gb5 - - Db5 - Bb4 - Gb4 -   | F5 - F5 - F5 . E5 F5 - - C5 - A4 - F4 -       |
  F4 - - Bb4 - - Db5 - - - C5 - - - . .           | F#4 - - B4 - - D#5 - - - C#5 - - - . .        |
  Db5 - - C5 - - B4 - Bb4 - - A4 - - - -          | A4 - - - - - - - . . . . . . . .              |
`);
export const HOOK_CH = 'Bbm F Gb F Bbm B Gb F';
// The second time round it climbs instead of slipping, and hangs on F.
const HOOK_END = r(`
  Db5 - - Eb5 - - F5 - Gb5 - - F5 - - E5 -        | F5 - - - - - - - . . . . . . . .
`);
const HOOK16 = [...HOOK, ...barsOf(HOOK, 0, 6), ...HOOK_END];
const HOOK16_CH = `${HOOK_CH} ${HOOK_CH}`;
{
  // Bar 1 is the chapter's cell, minor, in Bb.
  const cell = barsOf(HOOK, 0, 1).filter((s) => typeof s === 'number');
  if (cell.join() !== cellIn('Bb4', FIRST_STEPS_MINOR).join()) throw new Error("No Strings: the hook's first bar isn't the chapter's cell");
  // Bars 1 and 3 are the king's own hook with the lights off (D, G and the
  // F sharp under the G each a semitone flatter).
  const dark = up(RUMBOLD_HOOK, 0).map((s) => (typeof s === 'number' && [2, 6, 7].includes(s % 12) ? s - 1 : s));
  for (const b of [0, 2]) {
    if (barsOf(HOOK, b, b + 1).join() !== barsOf(dark, b, b + 1).join()) throw new Error(`No Strings: bar ${b + 1} isn't the king's bar in the minor`);
  }
  if (HOOK.length !== 8 * BAR || HOOK16.length !== 16 * BAR) throw new Error('No Strings: the hook is the wrong length');
}

// --- TUCK'S TUNE (from "The Resplendent Hour"), moved from G minor up to
// Bb minor. Eight bars; it ends in the major. ---
export const TUCK = up(e(TUCK_TUNE), 3);
export const TUCK_CH = moveChords(TUCK_CHORDS, 3);           // Bbm Gb Ebm F Bbm Gb Ebm,F Bb
const STAMMER = barsOf(TUCK, 0, 1);                           // F . F Bb - Db C -

// THE KING UNDER TUCK: the king's two gestures fitted to each bar's chord,
// low: on a minor chord his cell, strutting; on a major one his boast (the
// note three times, a step under, back, and down the chord).
const strut = (a, b, c, d) => [a, H, H, b, H, H, c, H, H, H, d, H, H, H, R, R];
const boast = (n) => [n, H, n, H, n, R, n - 1, n, H, H, n - 5, H, n - 8, H, n - 12, H];
export const kingUnder = (chords, low) => barList(chords).flatMap((bar) => {
  const chord = chordOf(bar.split(',')[0]);
  const root = inBand(chord.root, low);
  return chord.minor ? strut(root - 5, root, root + 3, root + 2) : boast(root + 12);
});

// THE JAW RIFF: the stutter, in 16ths, two bars, from Bb2; the second bar
// walks down by semitones.
export const RIFF = r(`
  Bb2 . Bb2 Bb2 . . Db3 . C3 . Bb2 Bb2 Bb2 . A2 .   |
  Bb2 . Bb2 Bb2 . . F3 . E3 . Eb3 . D3 . Db3 .      |
`);
const riffBar = (bar, by) => up(barsOf(RIFF, bar, bar + 1), by);
// The chapter's cell as a chorale over the riff, one note every two beats,
// in the key of each chord it lands on.
const CHORALE = h(`
  F4 Bb4 Db5 C5 | F#4 B4 D#5 C#5 | Ab4 Db5 F5 Eb5 | C5 F5 A5 G5 |
  F4 Bb4 Db5 C5 | Bb4 Eb5 Gb5 F5 | A5 G5 F5 E5    | Gb5 F5 E5 F5
`);
const CHORALE_CH = 'Bbm Bbm B B Db Db F F Bbm Bbm Ebm Ebm F F Gb F';
const CHORALE_RIFF = [
  ...riffBar(0, 0), ...riffBar(1, 0), ...riffBar(0, 1), ...riffBar(1, 1),
  ...riffBar(0, 3), ...riffBar(1, 3), ...riffBar(0, -5), ...riffBar(1, -5),
  ...riffBar(0, 0), ...riffBar(1, 0), ...riffBar(0, 5), ...riffBar(1, 5),
  ...riffBar(0, -5), ...riffBar(1, -5), ...riffBar(0, -4), ...riffBar(1, -5),
];

// The stuck cell: the first three notes going round in threes against the
// bar's fours, never getting to the fourth (as in all three songs).
const stuck = (a, b, c, len) => Array.from({ length: len }, (_, i) => (i % 3 === 0 ? [a, b, c][(i / 3) % 3] : H));
// The music box's twin: the same notes a 16th late, from step `from`.
const twin = (track, from = 0) => [R, ...track.slice(0, -1)].map((s, i) => (i <= from ? R : s));

// --- Patterns, one bar. ---
const CREAK = ['R+', R, R, 'F', R, R, 'T+', R, 'R+', R, 'N+', 'R+', R, 'F', R, R];
const CREAK_LOW = ['R', R, R, 'R', R, R, R, R, 'R', R, R, R, R, R, 'N', R];
const DIG = ['R', R, R, 'R', R, R, 'R', R, 'R', R, R, 'R', R, R, 'R', 'R'];
const POUND = ['R', R, 'R+', 'R', 'R', R, 'R+', 'R', 'R', R, 'R+', 'R', 'R', R, 'R+', 'R'];
const RACE = ['R', 'F', 'R+', 'T+', 'R+', 'F', 'T+', 'F', 'R', 'F', 'R+', 'T+', 'R+', 'F', 'T+', 'F'];
const HAMMER = ['R+', R, R, 'R+', R, R, 'R+', R, 'R+', R, R, 'R+', R, R, 'T+', R];
const RIPPLE = ['R', R, 'F', R, 'R+', R, 'T+', R, 'F+', R, 'T+', R, 'R+', R, 'F', R];
// The dance in 7/8 (3+3+4+4, the last two steps cut by the jolt).
const CREAK7 = ['R+', R, R, 'F', R, R, 'T+', R, R, R, 'N+', R, R, 'F', R, R];
const OOM7 = ['R', R, R, 'F-', R, R, 'R', R, R, R, 'F-', R, R, R, R, R];
const T_POUND = [0, R, R, 0, R, R, -5, R, 0, R, R, 0, R, R, -5, 0];
const T_HEART = [0, R, R, 0, ...steps(12)];
const T_ONE = [0, ...steps(15)];
const T_DANCE = [0, R, R, -5, R, R, 0, R, R, R, -5, R, R, R, R, R];
const T_JAW = [0, R, 0, R, 0, ...steps(7), 0, R, 0, R];

const ONE = hits('x...............');
const TICK = hits('x.x.x.x.x.x.x.x.');
const TOCK = hits('..x...x...x...x.');
const ROLL_8 = hits('x.x.x.x.x.x.x.x.');
const ROLL_16 = hits('xxxxxxxxxxxxxxxx');
// The jaw, stuttering: in the gap at the end of the hook, and on its own.
const JAW_GAP = hits('........x.x.x..x');
const JAW_A = hits('x.x.x.......x.x.');
const JAW_B = hits('x.x.x.x.xxx.x...');
// The drums.
const DRUMS = {
  drop: { taiko: 'x..x..x.x..x..x.', taikoHigh: '....x..x..x.x.xx', snare: '....x.......x...', bassDrum: 'x.......x.......' },
  dropB: { taiko: 'x..x..x.x..x..x.', taikoHigh: '..x...x...xxx.xx', snare: '....x.......x..x', bassDrum: 'x.......x.....x.' },
  half: { taiko: 'x.......x..x....', taikoHigh: '..........x.....', snare: '........x.......', bassDrum: 'x...............' },
  soft: { taiko: 'x.......x.......', taikoHigh: '................', snare: '................', bassDrum: '................' },
  dance: { taiko: 'x..x..x...x.....', taikoHigh: '......x...x..x..', snare: '......x.........', bassDrum: 'x.........x.....' },
  fill: { taiko: 'x..x..x.x.x.x.x.', taikoHigh: '....x.x.xxxxxxxx', snare: '....x...x.x.xxxx', bassDrum: 'x.......x.......' },
};
// `n` bars of a kit, alternating with `other` every other bar if given;
// the bars in `fills` are fills.
function kit(style, n, fills = [], other = style) {
  const out = { taiko: [], taikoHigh: [], snare: [], bassDrum: [] };
  for (let i = 0; i < n; i++) {
    const k = DRUMS[fills.includes(i) ? 'fill' : i % 2 ? other : style];
    for (const voice of Object.keys(out)) out[voice].push(...hits(k[voice]));
  }
  return out;
}
// Two runs of drums one after the other.
const then = (a, b) => mapTracks(a, (track, name) => [...track, ...b[name]]);
// The cymbal swell is loudest 3.18s in: 32 steps at 150 BPM.
const SWELL_STEPS = 32;
const swellEnd = (length) => [...steps(length - SWELL_STEPS), ...held(60, SWELL_STEPS)];

const O = ORCHESTRA;
const cents = (c) => c / 1200;
const box = { time: 0.3, feedback: 0.3, mix: 0.25 };

// The seats, shared with the finale (rumboldTearTheme.js).
export const INSTRUMENTS = {
  // THE MACHINERY. The clock: a col-legno tick and a muffled tock.
  tick: { sample: 'violinsSpic', volume: 0.13, release: 0.02, gate: 0.06, reverb: 0.06, pan: 0.35, humanize: { time: 0.002, volume: 0.15 } },
  tock: { sample: 'frameDrum', drum: 'sample', volume: 0.22, ring: true, muffle: 1800, reverb: 0.06, pan: -0.3, humanize: { time: 0.002, volume: 0.1 } },
  // The jaw: the clack from phase 1, and the brass stabbing with it, a
  // semitone apart.
  jaw: { sample: 'claps', drum: 'sample', volume: 0.34, ring: true, reverb: 0.12, pan: 0.1, humanize: { time: 0.002, volume: 0.1 } },
  stabs: { sample: 'trombone', volume: 0.42, release: 0.05, gate: 0.5, reverb: 0.25, pan: -0.1 },
  stabsHigh: { sample: 'trumpet', volume: 0.3, release: 0.05, gate: 0.5, reverb: 0.25, pan: 0.15 },
  // The creak: the strings being pulled.
  creak: { sample: 'violinsPizz', volume: 0.28, ring: true, reverb: 0.25, pan: 0.3, humanize: { time: 0.005, volume: 0.15 } },
  creakLow: { sample: 'cellosPizz', volume: 0.36, ring: true, reverb: 0.25, pan: -0.25, humanize: { time: 0.005, volume: 0.15 } },
  // The music box: glockenspiel, harp and a celesta (the piano two octaves
  // up), each with a twin a third of a semitone flat.
  glock: { sample: 'glock', volume: 0.11, ring: true, reverb: 0.5, pan: 0.2, echo: box },
  glockSour: { sample: 'glock', octave: cents(-35), volume: 0.09, ring: true, reverb: 0.55, pan: -0.25, echo: box },
  celesta: { sample: 'grandPiano', octave: 2, volume: 0.17, ring: true, reverb: 0.45, pan: 0.15, echo: box },
  celestaSour: { sample: 'grandPiano', octave: 2 + cents(-30), volume: 0.12, ring: true, reverb: 0.5, pan: -0.2, echo: box },
  harp: { sample: 'harp', volume: 0.24, ring: true, reverb: 0.45, pan: -0.15, humanize: { time: 0.006, volume: 0.15 } },
  // The cold light.
  vibes: { sample: 'vibesBowed', volume: 0.18, attack: 0.5, release: 1.2, reverb: 0.6, pan: -0.2 },
  vibesB: { sample: 'vibesBowed', volume: 0.15, attack: 0.6, release: 1.2, reverb: 0.6, pan: 0.2 },
  glass: { sample: 'glass', volume: 0.12, ring: true, reverb: 0.6, pan: 0.25, echo: { time: 0.5, feedback: 0.3, mix: 0.25 } },
  // The piano: dry and close for the tune; octaves hammered.
  piano: { sample: 'grandPiano', volume: 0.36, ring: true, reverb: 0.1, humanize: { time: 0.004, volume: 0.1 } },
  pianoLow: { sample: 'grandPiano', volume: 0.26, ring: true, reverb: 0.14, pan: -0.1, humanize: { time: 0.006, volume: 0.12 } },
  // Strings.
  soloViolin: { ...O.soloViolin, volume: 0.5 },
  violins: { ...O.violins, volume: 0.32 },
  violinsHigh: { ...O.violinsHigh, volume: 0.24 },
  violas: { sample: 'violas', volume: 0.28, attack: 0.03, release: 0.35, reverb: 0.38, pan: -0.1 },
  cellos: { ...O.cellos, volume: 0.34 },
  race: { ...O.race, volume: 0.2 },
  pound: { ...O.pound, volume: 0.32 },
  basses: { ...O.basses, volume: 0.4 },
  violinsTrem: { sample: 'violinsTrem', volume: 0.16, attack: 0.2, release: 0.5, reverb: 0.45, pan: 0.25 },
  violasTrem: { sample: 'violasTrem', volume: 0.16, attack: 0.2, release: 0.5, reverb: 0.45, pan: -0.2 },
  cellosTrem: { sample: 'cellosTrem', volume: 0.26, attack: 0.3, release: 0.6, reverb: 0.4, pan: -0.15 },
  // Winds.
  clarinet: { sample: 'clarinet', volume: 0.3, attack: 0.03, release: 0.2, reverb: 0.35, pan: -0.15 },
  oboe: { sample: 'oboe', volume: 0.26, attack: 0.02, release: 0.12, reverb: 0.35, pan: 0.15 },
  flute: { sample: 'flute', volume: 0.24, attack: 0.03, release: 0.2, reverb: 0.4, pan: 0.25 },
  piccolo: { sample: 'piccolo', volume: 0.1, attack: 0.01, release: 0.12, reverb: 0.35, pan: 0.3 },
  // Brass: a second trumpet a hair sharp, the horns a hair flat.
  trumpets: { ...O.trumpets, volume: 0.36 },
  trumpetsSour: { ...O.trumpets, volume: 0.18, octave: cents(14), pan: -0.15 },
  horns: { ...O.horns, volume: 0.4, octave: cents(-9) },
  hornsSoft: { ...O.hornsSoft, volume: 0.3 },
  trombones: { ...O.trombones, volume: 0.38 },
  tuba: { ...O.tuba, volume: 0.4 },
  // The BRAAAM: trombones, tuba and horns on one low note.
  braam: { ...O.braam, volume: 0.6 },
  braamTuba: { ...O.braamLow, volume: 0.55 },
  braamHorns: { sample: 'horns', volume: 0.5, release: 0.7, reverb: 0.45 },
  // The choir: the game's own "ah" voices.
  choir: { sample: 'choir', volume: 0.24, attack: 0.05, release: 0.4, reverb: 0.55, pan: 0.05, humanize: { time: 0.008, volume: 0.1 } },
  choirHeld: { sample: 'choir', volume: 0.18, attack: 0.9, release: 1, reverb: 0.6 },
  // Percussion.
  timpani: O.timpani,
  timpRoll: { ...O.timpRoll, volume: 0.42 },
  swell: { ...O.swell, volume: 0.3 },
  roll: { ...O.roll, volume: 0.14 },
  taiko: { ...O.taiko, volume: 0.5 },
  taikoHigh: { ...O.taikoHigh, volume: 0.3 },
  snare: { ...O.snare, volume: 0.36, reverb: 0.15 },
  bassDrum: { ...O.bassDrum, volume: 0.6 },
  concertBassDrum: { sample: 'concertBassDrum', drum: 'sample', volume: 0.7, ring: true, reverb: 0.35 },
  impact: O.impact,
  crash: { ...O.crash, volume: 0.36 },
  gong: O.gong,
};

// The tracks of a full statement of a tune (`mel`) on the whole orchestra,
// from bar `full` with everything doubled.
function tutti(mel, ch, full = 8) {
  const n = barList(ch).length;
  return {
    trumpets: mel,
    trumpetsSour: after(full, mel),
    violins: mel,
    violinsHigh: after(full, up(mel, 12)),
    piano: mel,
    horns: hornFit(up(mel, -12)),
    cellos: up(mel, -12),
    trombones: up(mel, -24),
    choir: after(full, mel),
    glock: after(full, up(mel, 24)),
    tuba: comp(ch, holdBar('R'), 34),
    basses: comp(ch, DIG, 34),
    pound: comp(ch, POUND, 46),
    creak: comp(ch, CREAK, 58),
    creakLow: comp(ch, CREAK_LOW, 38),
    race: after(full, comp(ch, RACE, 62)),
    timpani: timps(ch, T_POUND),
    tick: times(pitched(TICK, 'D6'), n),
    tock: times(TOCK, n),
  };
}
// The BRAAAM and the drop's hits, on `note`.
const drop = (note, n, hitsOn = [0, 8]) => ({
  braam: held(note, BAR),
  braamTuba: held(note, BAR),
  braamHorns: held(midi(note) + 12, BAR),
  gong: onBars(n, hitsOn, ONE),
  impact: onBars(n, hitsOn, ONE),
  concertBassDrum: onBars(n, [0, 4, 8, 12], ONE),
  crash: onBars(n, [0, 4, 8, 12], ONE),
});
// The jaw stuttering in the gap of the hook's last bar, the brass with it.
const jawIn = (n, list, low = 'Bb2', high = 'A4') => ({
  jaw: onBars(n, list, JAW_GAP),
  stabs: onBars(n, list, pitched(JAW_GAP, low)),
  stabsHigh: onBars(n, list, pitched(JAW_GAP, high)),
});

const song = {
  title: 'No Strings',
  bpm: 150,
  stepsPerBeat: 4,
  volume: 0.5,
  limit: 1,
  instruments: INSTRUMENTS,

  sections: {
    // THE CLOCK. The clock alone; the music box, slowly, and its twin; the
    // creak; the jaw stutters; the build; one beat of silence.
    intro: stopdown((() => {
      const tune = slow(barsOf(HOOK, 0, 2));
      return section(8 * BAR, {
        tick: times(pitched(TICK, 'D6'), 8),
        tock: times(TOCK, 8),
        violasTrem: held('A4', 4 * BAR),
        violinsTrem: at(1, held('Bb4', 3 * BAR)),
        celesta: tune,
        glock: up(tune, 24),
        harp: at(2, up(barsOf(tune, 2, 4), -12)),
        celestaSour: twin(tune, 16),
        glockSour: twin(up(tune, 24), 40),
        creak: at(2, comp('Bbm Bbm Bbm Bbm', CREAK, 58)),
        creakLow: at(2, comp('Bbm Bbm Bbm Bbm', CREAK_LOW, 38)),
        cellosTrem: at(2, held('Bb2', 4 * BAR)),
        jaw: at(4, [...JAW_A, ...JAW_B]),
        stabs: at(4, pitched([...JAW_A, ...JAW_B], 'Bb2')),
        stabsHigh: at(4, pitched([...JAW_A, ...JAW_B], 'A4')),
        timpani: at(4, [...timps('Bb', T_JAW), ...timps('Bb', T_JAW)]),
        tuba: at(6, held('F1', 2 * BAR)),
        horns: at(6, climb(41, 8, 4)),
        violins: at(6, climb(65, 8, 4)),
        choirHeld: at(6, held('F4', 2 * BAR)),
        timpRoll: at(6, held('F2', 2 * BAR)),
        roll: at(6, [...ROLL_8, ...ROLL_16]),
        swell: swellEnd(8 * BAR),
      });
    })()),

    // THE SHOW GOES ON. The drop; the hook on everything; the jaw in the gap.
    A: section(16 * BAR, {
      ...tutti(HOOK16, HOOK16_CH),
      ...drop('Bb1', 16),
      ...kit('drop', 16, [15], 'dropB'),
      ...jawIn(16, [7]),
    }),

    // THE JAW. The riff stutters in the low strings and brass; the chapter's
    // cell sings over it in every chord; bars 8 and 16 lose a 16th.
    B: jolt(section(16 * BAR, {
      cellos: CHORALE_RIFF,
      basses: up(CHORALE_RIFF, -12),
      trombones: CHORALE_RIFF,
      horns: after(8, CHORALE_RIFF),
      pianoLow: up(CHORALE_RIFF, 12),
      tuba: comp(CHORALE_CH, holdBar('R'), 34),
      choir: CHORALE,
      violins: CHORALE,
      violinsHigh: after(8, up(CHORALE, 12)),
      trumpets: after(8, CHORALE),
      hornsSoft: hornFit(up(barsOf(CHORALE, 0, 8), -12)),
      celesta: at(4, comp(bars(CHORALE_CH, 4, 8), RIPPLE, 58)),
      creak: comp(CHORALE_CH, CREAK, 58),
      tick: times(pitched(TICK, 'D6'), 16),
      tock: times(TOCK, 16),
      timpani: [...timps(bars(CHORALE_CH, 0, 8), T_HEART), ...timps(bars(CHORALE_CH, 8, 16), T_POUND)],
      ...then(kit('half', 8, [7]), kit('drop', 8, [7], 'dropB')),
      jaw: onBars(16, [3, 7, 11, 15], JAW_GAP),
      stabsHigh: onBars(16, [7, 15], pitched(JAW_GAP, 'A4')),
      crash: onBars(16, [0, 8], ONE),
      gong: onBars(16, [8], ONE),
    }), [7, 15]),

    // TUCK'S THREAD. Tuck small and in tune over the machinery, the king
    // muttering under; then the band, and the two tunes fight. Tuck's major
    // chord, and the beat goes dead.
    C: stopdown((() => {
      const tc = `${TUCK_CH} ${TUCK_CH}`;
      const king = kingUnder(TUCK_CH, 46);
      return section(16 * BAR, {
        soloViolin: TUCK,
        clarinet: up(TUCK, -12),
        harp: comp(TUCK_CH, RIPPLE, 46),
        hornsSoft: up(king, -12),
        cellosTrem: comp(TUCK_CH, holdBar('R'), 46),
        violins: at(8, TUCK),
        flute: at(8, TUCK),
        choir: at(8, up(TUCK, -12)),
        piano: at(8, up(TUCK, -12)),
        trombones: at(8, king),
        horns: at(8, hornFit(king)),
        cellos: at(8, up(king, -12)),
        tuba: at(8, comp(TUCK_CH, holdBar('R'), 34)),
        basses: at(8, comp(TUCK_CH, DIG, 34)),
        race: at(12, comp(bars(TUCK_CH, 4, 8), RACE, 62)),
        creak: comp(tc, CREAK, 58),
        creakLow: comp(bars(tc, 0, 8), CREAK_LOW, 38),
        tick: times(pitched(TICK, 'D6'), 16),
        tock: times(TOCK, 16),
        timpani: at(8, timps(TUCK_CH, T_POUND)),
        ...then(kit('soft', 8), kit('drop', 8, [], 'dropB')),
        jaw: onBars(16, [1, 3, 9, 11], hits('............x.x.')),
        crash: onBars(16, [8, 15], ONE),
        gong: onBars(16, [15], ONE),
        impact: onBars(16, [8], ONE),
      });
    })()),

    // THE MUSIC BOX. Near silence: the clock, and the hook upside down on the
    // music box, slowly, out of true; the cold light; Tuck answers twice.
    P: stopdown((() => {
      const turned = slow(barsOf(upsideDown(HOOK, midi('Bb4')), 0, 4));
      const answer = e('Ab4 . Ab4 Db5 - F5 Eb5 -');     // his stammer in D flat major
      return section(8 * BAR, {
        tick: times(pitched(TICK, 'D6'), 8),
        tock: times(TOCK, 8),
        glock: up(turned, 24),
        glockSour: twin(up(turned, 24)),
        celesta: turned,
        celestaSour: twin(turned, 8),
        vibes: held('E5', 4 * BAR),
        vibesB: held('Bb4', 4 * BAR),
        glass: at(1, held('E6', 2 * BAR)),
        piano: [...at(2, answer), ...rest(3), ...answer],
        harp: [...at(2, comp('Db', RIPPLE, 49)), ...rest(3), ...comp('Db', RIPPLE, 49)],
        violasTrem: at(4, held('F4', 4 * BAR)),
        violinsTrem: at(4, held('Ab4', 4 * BAR)),
        cellosTrem: at(4, held('Db3', 2 * BAR)),
        choirHeld: at(6, held('C5', 2 * BAR)),
        timpani: at(2, timps('Eb Eb Eb Eb F F', T_HEART)),
        timpRoll: at(7, held('F2', BAR)),
        roll: at(7, ROLL_8),
      });
    })()),

    // THE DANCE ON STRINGS. 7/8: the hook with every bar cut short; light
    // first, then the brass and the choir; the last bar 4/4, the swell, the
    // silence.
    W: (() => {
      const ch = HOOK16_CH;
      const mel = [...HOOK, ...HOOK];
      const tracks = section(16 * BAR, {
        oboe: barsOf(mel, 0, 8),
        clarinet: up(barsOf(mel, 0, 8), -12),
        creak: comp(bars(ch, 0, 8), CREAK7, 58),
        celesta: at(4, up(barsOf(mel, 4, 8), 0)),
        celestaSour: at(4, twin(barsOf(mel, 4, 8))),
        creakLow: comp(bars(ch, 0, 15), OOM7, 46),
        tick: times(pitched(TICK, 'D6'), 15),
        tock: times(TOCK, 15),
        trumpets: after(8, mel),
        trumpetsSour: after(12, mel),
        violins: after(8, mel),
        horns: after(8, hornFit(up(mel, -12))),
        trombones: after(8, up(mel, -24)),
        cellos: after(8, up(mel, -12)),
        choir: after(8, mel),
        piccolo: after(12, up(mel, 12)),
        race: after(8, comp(ch, RACE, 62)),
        tuba: after(8, comp(ch, holdBar('R'), 34)),
        basses: after(8, comp(ch, OOM7, 34)),
        timpani: [...rest(8), ...timps(bars(ch, 8, 15), T_DANCE)],
        ...kit('dance', 15),
        jaw: [...onBars(15, [3, 7, 11], hits('..........x..x..')), ...hits('x.x.x.x.xxxxxxxx')],
        crash: onBars(16, [8], ONE),
        gong: onBars(16, [8], ONE),
        timpRoll: at(15, held('F2', BAR)),
        roll: at(15, ROLL_16),
      });
      const cut = jolt(tracks, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
      const length = cut.tick.length;
      return stopdown({ ...cut, swell: swellEnd(length) });
    })(),

    // THE SECOND DROP, B minor. The hook half a step up on everything; then
    // Tuck's tune taken up by the whole orchestra, the king fighting under it.
    D: (() => {
      const ch = moveChords(HOOK_CH, 1);
      const tch = moveChords(TUCK_CH, 1);
      const tuck = up(TUCK, 1);
      const king = kingUnder(tch, 47);
      const hook = up(HOOK, 1);
      const both = `${ch} ${tch}`;
      return section(16 * BAR, {
        ...drop('B1', 16),
        trumpets: [...hook, ...up(tuck, -12)],
        trumpetsSour: hook,
        violins: [...hook, ...tuck],
        violinsHigh: up(hook, 12),
        piano: [...hook, ...up(tuck, -12)],
        horns: [...hornFit(up(hook, -12)), ...hornFit(up(tuck, -24))],
        cellos: [...up(hook, -12), ...up(king, -12)],
        trombones: [...up(hook, -24), ...king],
        choir: [...hook, ...up(tuck, -12)],
        flute: at(8, tuck),
        piccolo: at(8, up(tuck, 12)),
        glock: up(hook, 24),
        tuba: comp(both, holdBar('R'), 34),
        basses: comp(both, DIG, 34),
        pound: comp(both, POUND, 47),
        race: comp(both, RACE, 62),
        creak: comp(bars(both, 0, 8), CREAK, 59),
        tick: times(pitched(TICK, 'D6'), 16),
        tock: times(TOCK, 16),
        timpani: timps(both, T_POUND),
        ...kit('drop', 16, [7], 'dropB'),
        ...jawIn(16, [7], 'B2', 'A#4'),
      });
    })(),

    // THE STRINGS SLIP. The riff in B minor, the trumpets stuck on three
    // notes; then everything slides down by semitones to F.
    E: (() => {
      const ch = 'Bm Bm G Gb';
      const riff = [...riffBar(0, 1), ...riffBar(1, 1), ...riffBar(0, -3), ...riffBar(1, -4)];
      const stuckTune = stuck(midi('F#4'), midi('B4'), midi('D5'), 4 * BAR);
      const slide = q('F#5 F5 E5 Eb5 | D5 C#5 C5 B4 | Bb4 A4 Ab4 G4 | Gb4 - F4 -');
      const sink = h('B2 Bb2 | A2 Ab2 | G2 Gb2 | F2 -');
      return section(8 * BAR, {
        cellos: [...riff, ...up(slide, -15)],
        basses: up(riff, -12),
        trombones: [...riff, ...sink],
        horns: [...riff, ...up(slide, -24)],
        tuba: [...comp(ch, holdBar('R'), 34), ...up(sink, -12)],
        trumpets: [...stuckTune, ...slide],
        violins: [...up(stuckTune, 12), ...slide],
        violas: at(4, up(slide, -3)),
        choir: at(4, up(slide, -8)),
        celesta: up(stuckTune, 12),
        celestaSour: twin(up(stuckTune, 12)),
        piano: at(4, up(slide, -12)),
        tick: times(pitched(TICK, 'D6'), 8),
        tock: times(TOCK, 8),
        timpani: [...timps(ch, T_HEART), ...timps('Bb A G F', T_ONE)],
        ...kit('half', 8, [7]),
        jaw: onBars(8, [1, 3, 5], JAW_GAP),
        crash: onBars(8, [4], ONE),
      });
    })(),

    // HOME. Bb minor, quiet: the piano sticks halfway through the hook;
    // Tuck's stammer twice; the jaw stutters faster; the build; the silence.
    H: stopdown((() => {
      const ch = 'Bbm F Gb F Bbm Bbm Bbm Bbm F F F F';
      const tune = [...barsOf(HOOK, 0, 4), ...stuck(midi('F4'), midi('Bb4'), midi('Db5'), 4 * BAR)];
      const jawFaster = hits('x.......x....... x...x...x...x... x.x.x.x.x.x.x.x. xxxxxxxxxxxx....');
      return section(12 * BAR, {
        piano: tune,
        celestaSour: at(4, twin(up(barsOf(tune, 4, 8), 0))),
        glock: at(4, up(barsOf(tune, 4, 8), 24)),
        soloViolin: [...at(3, up(STAMMER, 0)), ...rest(3), ...STAMMER],
        creak: comp(bars(ch, 0, 8), CREAK, 58),
        creakLow: comp(bars(ch, 0, 8), CREAK_LOW, 38),
        cellosTrem: held('Bb2', 8 * BAR),
        hornsSoft: at(4, held('F3', 4 * BAR)),
        tick: times(pitched(TICK, 'D6'), 12),
        tock: times(TOCK, 12),
        taiko: times(hits('x..x............'), 8),
        jaw: at(8, jawFaster),
        stabs: at(8, pitched(jawFaster, 'F2')),
        stabsHigh: at(8, pitched(jawFaster, 'E4')),
        timpRoll: at(8, held('F2', 4 * BAR)),
        roll: at(9, [...ROLL_8, ...ROLL_16, ...ROLL_16]),
        tuba: at(8, held('F1', 4 * BAR)),
        horns: at(8, climb(41, 16, 4)),
        violins: at(8, climb(65, 16, 4)),
        race: at(10, comp('F F', RACE, 62)),
        choirHeld: at(8, held('F4', 4 * BAR)),
        swell: swellEnd(12 * BAR),
      });
    })()),
  },

  // The intro plays once; after that the show loops from the drop.
  order: ['intro', 'A', 'B', 'C', 'P', 'W', 'D', 'E', 'H'],
  loopFrom: 1,
};

// Every recorded instrument kept within reach of its recordings. The player
// stretches a note from the nearest recording, so any note inside an
// instrument's whole span keeps its written pitch. Only a note more than
// three semitones beyond the lowest or highest recording moves by octaves,
// to inside it. The doublers (bells, glass, piccolo) just leave out a note
// they can't reach. `song.moved` counts the notes moved, track by track.
const DOUBLERS = ['glock', 'glockSour', 'glass', 'piccolo'];
const near = (n, notes, reach) => notes.some((x) => Math.abs(x - n) <= reach);
export function fitToRecordings(target) {
  target.moved = {};
  for (const [sectionName, tracks] of Object.entries(target.sections)) {
    for (const [name, track] of Object.entries(tracks)) {
      const instrument = target.instruments[name];
      if (!instrument) throw new Error(`${target.title}: no instrument called '${name}'`);
      if (!instrument.sample || instrument.drum || SAMPLE_SETS[instrument.sample].notes.length < 2) continue;
      const { notes } = SAMPLE_SETS[instrument.sample];
      const shift = Math.round(12 * (instrument.octave ?? 0));
      let dropped = false;
      tracks[name] = track.map((s) => {
        if (s === HOLD) return dropped ? REST : s;
        dropped = false;
        if (typeof s !== 'number') return s;
        if (DOUBLERS.includes(name)) {
          if (near(s + shift, notes, 3)) return s;
          dropped = true;
          return REST;
        }
        const low = Math.min(...notes) - 3 - shift;
        const high = Math.max(...notes) + 3 - shift;
        const fit = [s, s - 12, s + 12, s - 24, s + 24].find((n) => n >= low && n <= high) ?? s;
        if (fit !== s) target.moved[`${sectionName}.${name}`] = (target.moved[`${sectionName}.${name}`] ?? 0) + 1;
        return fit;
      });
    }
  }
}
fitToRecordings(song);

export const RUMBOLD_ALIVE_THEME = song;

// The pieces the finale (rumboldTearTheme.js) is built from.
export const PARTS = {
  BAR, ONE, TICK, TOCK, ROLL_8, ROLL_16, JAW_B, T_POUND, DIG, CREAK, CREAK_LOW,
  e, h, rest, at, barsOf, held, times, onBars, pitched, climb, twin, section, stopdown, then, swellEnd,
  comp, timps, hornFit, tutti, drop, jawIn, kit,
};
