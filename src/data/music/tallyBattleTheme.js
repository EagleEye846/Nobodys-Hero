import { melody, midi, transpose } from '../../audio/notation.js';
import { ORCHESTRA } from './parts/usurper.js';
import { starFall, starNotes, STAR_LENGTHS } from './parts/starGuardians.js';
import { SAMPLE_SETS } from '../../audio/sampleSets.js';

// "Present and Correct": the fight with QUIRE, the Welcome Register, chapter
// 3's secret star guardian. The old city kept one great ledger of everyone
// who promised to be present the day the Hero came, and counted it every
// night. A splinter of the Fallen Star went into its binding, the book wished
// on it that the count would come out right, and now it counts by itself,
// and the sum never comes out. Fussy, fast, over-polite,
// losing its place and starting again from the top. Eerie and funny at once.
//
// So the song is a count: a harpsichord (a bright grand piano, two of them
// a little apart, with short releases and a pizzicato edge on every note),
// pizzicato strings, and the clerk's desk as the drum kit: real typewriter
// keys on the beat, a real pencil scratching between, a rubber stamp (tenor
// drum and claps) on every fifth stroke, and the typewriter's bell (the ride
// cymbal's bell) at the end of every line. A pen scratching in a quiet room,
// and then a whole room of pens. B minor, 5/8, fast.
//
// THREE TUNES:
//   THE COUNT (the hook): the dead city's own tune ("What They Built for
//     Him", valleyTheme.js) opens F# E D C#, falling a step at a time. Quire
//     counts it in fives, like a tally mark: four strokes (F# E D C#, the
//     valley's cell) and the fifth cutting across them, a leap up to B (the
//     stroke through the gate). One tally a 5/8 bar. Then the stroke falls
//     short (A), the count slips up a step, it loses its place (C# B A# B, C#
//     B A# B) and starts again twice as fast, two tallies a bar; and the
//     answer to all that counting is THE FALLING STAR, two whole bars of it
//     in its own rhythm (quick, quick, a breath, long), landing on the
//     stamp.
//   THE FALLING STAR (parts/starGuardians.js: tonic, fifth, flat fifth,
//     tonic): every star guardian's. Its own bells ring it every time it
//     falls (tubular bells and glockenspiel, in tune: starRing, the same as
//     "Star Aboard"): at the very start, alone; as the answer to every hook
//     (in F#, the dominant, so it falls home); after the roll call, where
//     the Hero's name is called and nobody answers; slowed right down in
//     canon in the quiet middle, then tumbling in 16ths into the Margins;
//     cascading on every bar there; then a whole section of its own (the
//     Shard, below); and at the end of the loop the whole room plays it in
//     B, the diminished chord under the slip, landing home.
//     Cut to one 5/8 bar (STAR5) it keeps its breath and lands on the last
//     8th, the fifth stroke, with the stamp.
//   THE ROLL CALL: a trumpet calling names on one note (D D D-E-F# G), the
//     choir answering "pre-sent" on a falling third. The last name is the
//     Hero's, and nobody answers it.
//
// THE SHARD: the star's own passage, the way every star guardian gets one
// (as Deltarune's secret bosses each take the same tune somewhere of their
// own). After the count breaks at the end of the Margins, the star is the
// tune: four notes, never bent out of shape, only moved, sped up, slowed
// down and counted. In Quire's hands that means a harpsichord, the desk,
// and fives: the star cut to a 5/8 bar and answered by itself in 16ths;
// five stars on the brass across eight bars, against the harpsichord
// counting one a bar like a tally mark; then the star climbing a step at a
// time to a C major chord on its slip, a tritone from home. (The Rising
// Star stays where it is, kept for the true ending.)
//
// And the valley's tune itself, whole, in 7/8, over the city's rain (its D A
// E patter, here on the harpsichord) with the bass moving under it: what the
// ledger was kept for.
//
// 5/8 at 150 crotchets a minute, one step a 16th: a bar of 5/8 is 10 steps,
// exactly one second (a 7/8 bar is 1.4 s). The intro plays once (12 s); then
// it loops from 'rollCall', about 3m12s:
//
//   section    time          what happens
//   quill      (once, 12s)   one pencil in a quiet room; the star on the
//                             glass; the harpsichord counts four and stops;
//                             counts four and STAMPS the fifth; the desk
//                             starts up and speeds into the hook
//   rollCall   0:00-0:32     PHASE 1. THE COUNT on the harpsichord over the
//                             pizzicato and the typewriter; then the flute
//                             and violins with the drums and pens; the roll
//                             call (a name, "pre-sent", a name, "pre-sent",
//                             the Hero's name, nothing: only the star); the
//                             count again with everyone, the valley's tune
//                             under it on the cellos and horns
//   ledger     0:32-0:59     THE VALLEY'S TUNE in 7/8: the city's rain patter
//                             on the harpsichord (D A E, never changing), the
//                             bass moving under it (G F# B C...), the tune on
//                             flute and violins, then high on the solo violin
//                             and choir; two bars of the count accelerating
//   lateFees   0:59-1:26     PHASE 2. THE SUMS GO WRONG: no two bars the same
//                             length (10, 10, 11, 9, 12, 8, 13, 7...), the count
//                             squeezed and stretched to fit, a stroke missing
//                             here, stuttered there, over a bass sliding down
//                             a semitone a bar; the brass come in on it; the
//                             bell rings in the wrong places; stamp, stamp
//   recount    1:26-1:54     THE PIVOT (45% in): everything stops. One pencil.
//                             The star slowly on the glass, the city's rain on
//                             the piano, and the count as a slow lament on a
//                             solo violin that never reaches five (it's
//                             missing someone); the violins and choir take it
//                             up; then the pens come back one at a time in
//                             canon, faster and faster: a room full of them
//   margins    1:54-2:28     PHASE 3. CONTROLLED CHAOS: the count against
//                             itself at two speeds (5/8 against the brass
//                             counting in dotted 8ths, three bars to their
//                             two); the hook in canon a half bar apart with
//                             stars cascading; the hook in double-length
//                             notes on the brass while the harpsichord counts
//                             at full speed over it; then the bars shrink
//                             (10, 9, 8... 2) until it can't keep up: a gong
//   shard      2:28-2:56     THE STAR'S OWN SECTION. The count broke: only the
//                             star's bells are left, in B, and the keys. Then
//                             the star as a tune on the harpsichord: stated
//                             (cut to the bar, landing on the stamp), answered
//                             by itself in 16ths, then again on G, A and F#
//                             (the hook's chords), each slip with its own
//                             chord, plucked. Then five stars in eight bars:
//                             the brass at the star's own pace, drifting
//                             across the 5/8 barlines and level again only
//                             at the end, while the harpsichord tallies it
//                             once a bar (four strokes, the fifth back at the
//                             top). Then the climb: B, D, E, F#, the low brass
//                             answering each, the glockenspiel in canon; on
//                             F# the slip gets a C major from the whole room,
//                             and the long note holds. The star ticked off
//                             faster and faster, a roll, and home
//   home       2:56-3:12     the count, home in B minor, with everyone; then
//                             the desk stops and the whole room plays the
//                             star in B; it lands on the fifth stroke with
//                             the stamp and a gong. Three typewriter keys,
//                             and round again to rollCall
//
//   present    (a coda: reached only by name, never in the loop) MERCY. The
//              count, slowly, on the harp, over a held F sharp; and this time
//              the fifth stroke isn't a leap across: it lands, on B, a held
//              B major chord, the strings, choir and glass. It comes out right.
//
// The fight starts a section for each phase (`musicFrom` in
// src/data/enemies/tally.js): 'lateFees' and 'margins'; the spare scene
// (tallySpared.js) plays 'present'. Each opens on a full bar.

const SONG = 'Present and Correct';
const BAR = 10;
const s16 = (text) => melody(text, 1);
const rest = (n) => Array(n).fill('.');
const up = transpose;
const sum = (list) => list.reduce((a, b) => a + b, 0);
const hold = (n, len) => [typeof n === 'number' ? n : midi(n), ...Array(len - 1).fill('-')];

// --- chords ---
const PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const pcOf = (name) => (PC[name[0]] + (name[1] === '#' ? 1 : name[1] === 'b' ? -1 : 0) + 12) % 12;
// [root, third, fifth] as pitch classes, and the bass: 'Bm', 'F#', 'G#dim', 'D/F#'.
function chordOf(symbol) {
  const [main, over] = symbol.split('/');
  const m = main.match(/^([A-G][#b]?)(m|dim)?$/);
  if (!m) throw new Error(`${SONG}: can't read the chord '${symbol}'`);
  const root = pcOf(m[1]);
  const tones = [root, (root + (m[2] ? 3 : 4)) % 12, (root + (m[2] === 'dim' ? 6 : 7)) % 12];
  return { tones, bass: over ? pcOf(over) : root };
}
// The lowest note of pitch class `pc` at or above `lo`.
const near = (pc, lo) => lo + (((pc - lo) % 12) + 12) % 12;
const timpRoot = (pc) => near(pc, 41);

// B minor, and over F sharp its leading note.
const MINOR = [11, 1, 2, 4, 6, 7, 9];
const scaleFor = (symbol) => (chordOf(symbol).tones[0] === 6 ? MINOR.map((p) => (p === 9 ? 10 : p)) : MINOR);
// `n` notes stepping down the scale from `top`.
function stepsDown(top, n, scale) {
  const out = [top];
  let x = top;
  while (out.length < n) {
    x--;
    if (scale.includes(((x % 12) + 12) % 12)) out.push(x);
  }
  return out;
}
// A tally over a chord: four strokes down the scale from the chord's fifth
// (over B minor: F# E D C#, the valley's cell), and the fifth stroke, the
// root above them, cutting across.
function tallyNotes(symbol, lo = 74) {
  const { tones } = chordOf(symbol);
  const top = near(tones[2], lo);
  const strokes = stepsDown(top, 4, scaleFor(symbol));
  return [...strokes, near(tones[0], top + 1)];
}

// --- the score ---
function score(name, length) {
  const tracks = {};
  const api = {
    length,
    put(track, at, steps) {
      if (at < 0 || at + steps.length > length) throw new Error(`${SONG} ${name}: '${track}' at ${at} (${steps.length} steps) runs past ${length}`);
      const t = (tracks[track] ??= rest(length));
      steps.forEach((s, i) => { if (s !== '.') t[at + i] = s; });
      return api;
    },
    add(layer, at = 0) {
      for (const [track, steps] of Object.entries(layer)) api.put(track, at, steps);
      return api;
    },
    hit(track, ...ats) {
      for (const a of ats) api.put(track, a, ['x']);
      return api;
    },
    done: () => tracks,
  };
  return api;
}

const barsOf = (chords, len = BAR) => chords.split(/\s+/).filter(Boolean).map((chord) => ({ len, chord }));
const lengthOf = (bars) => sum(bars.map((b) => b.len));
const startsOf = (bars) => bars.map((_, i) => sum(bars.slice(0, i).map((b) => b.len)));

// A note held `len` steps on a track (only over silence).
function note(track, at, n, len) {
  if (at >= track.length) return;
  track[at] = n;
  for (let k = 1; k < len && at + k < track.length; k++) if (track[at + k] === '.') track[at + k] = '-';
}

// The desk and the band, bar by bar. In every bar the last 8th is the
// stroke: the stamp lands on it (`stamp`), the typewriter's key comes back
// up, the pizzicato hits the chord. The beats before it are the count:
// kick on the first and third, the typewriter on each, a pencil between.
//   lh      the harpsichord's left hand, racing up and down the chord
//   bass    pizzicato bass on the one, walking into the next bar
//   pizz    the chord, plucked, on the one and the stroke
//   kick, snare ('stroke' or 'back'), stamp, hats, type, pen, ding (the
//   typewriter's bell, every fourth bar)
function desk(bars, o = {}) {
  const length = lengthOf(bars);
  const out = {};
  const T = (name) => (out[name] ??= rest(length));
  let at = 0;
  bars.forEach((bar, i) => {
    const { tones, bass } = chordOf(bar.chord);
    const [r, t, f] = tones;
    const len = bar.len;
    const stroke = Math.max(0, len - 2);
    if (o.lh) {
      const base = near(r, o.lh === true ? 54 : o.lh);
      const ladder = [base, near(t, base), near(f, base), base + 12, near(t, base) + 12, near(f, base) + 12];
      const shape = [0, 2, 3, 2, 4, 2, 3, 2, 5, 3, 1, 2, 4, 3];
      for (let k = 0; k < len; k++) T('lh')[at + k] = ladder[shape[k % shape.length]];
    }
    if (o.bass !== false) {
      const low = near(bass, 33);
      note(T('bass'), at, low, 3);
      if (o.cello !== false) note(T('celloPizz'), at, low + 12, 2);
      const next = bars[i + 1] ? near(chordOf(bars[i + 1].chord).bass, 33) : null;
      if (o.walk !== false && next != null && len >= 6) {
        const mid = near(f, low);
        note(T('bass'), at + Math.floor(len / 2) - (len % 2 ? 0 : 1), mid > low + 9 ? mid - 12 : mid, 2);
        if (next !== low) note(T('bass'), at + stroke, next + (next > low ? -1 : 1), 2);
      }
    }
    if (o.pizz) {
      for (const p of [at, at + stroke]) {
        note(T('pizzLo'), p, near(t, 62), 1);
        note(T('pizzHi'), p, near(f, 62), 1);
        note(T('pizzTop'), p, near(r, 69), 1);
      }
    }
    if (o.kick) {
      T('kick')[at] = 'x';
      if (len >= 8) T('kick')[at + 4] = 'x';
      if (o.kick === 'all') for (let k = 2; k < stroke; k += 2) T('kick')[at + k] = 'x';
    }
    if (o.snare === 'stroke' && len >= 4) T('snare')[at + stroke] = 'x';
    if (o.stamp && len >= 4) { T('stamp')[at + stroke] = 'x'; T('stampClap')[at + stroke] = 'x'; }
    if (o.hats) for (let k = 0; k < len; k += 2) T('hats')[at + k] = 'x';
    if (o.open && i % 2 === 1 && len >= 4) T('hatOpen')[at + stroke] = 'x';
    if (o.type) {
      for (let k = 0; k < len; k += 2) {
        if (k === stroke && len >= 4) note(T('typeBack'), at + k, 67, 1);
        else note(T('type'), at + k, 60 + ((i * 3 + k * 5) % 7), 1);
      }
    }
    if (o.pen) for (let k = 1; k < len; k += 2) note(T('pen'), at + k, 60 + ((i + k * 2) % 6), 1);
    if (o.ding && i % 4 === 3 && len >= 4) T('ding')[at + stroke] = 'x';
    at += len;
  });
  return out;
}

// Held chords, a bar each, one track per voice ([root, third, fifth]).
function pads(bars, names, lo) {
  const out = {};
  names.forEach((name, v) => {
    out[name] = bars.flatMap((bar) => hold(near(chordOf(bar.chord).tones[v], lo), bar.len));
  });
  return out;
}
const roots = (bars, lo) => bars.flatMap((bar) => hold(near(chordOf(bar.chord).bass, lo), bar.len));
// Star glitter: high chord tones on the off 16ths.
function sparkle(bars, lo = 84, places = [1, 5, 7]) {
  return bars.flatMap((bar, i) => {
    const [r, t, f] = chordOf(bar.chord).tones;
    const tones = [near(r, lo), near(t, lo), near(f, lo), near(r, lo) + 12];
    const out = rest(bar.len);
    places.filter((p) => p < bar.len).forEach((p, k) => { out[p] = tones[(k + i) % 4]; });
    return out;
  });
}
// A tally squeezed or stretched into a bar of any length: the four strokes
// as evenly as they'll go, the fifth on the last 8th. Too short a bar and
// the count gets lost: it never gets to the fifth. Too long, and it
// stutters the stroke (starts again).
function countIn(symbol, len, lo = 74) {
  const [a, b, c, d, stroke] = tallyNotes(symbol, lo);
  const out = rest(len);
  if (len < 8) {
    const gap = Math.max(1, Math.floor(len / 4));
    [a, b, c, d].forEach((n, k) => { if (k * gap < len) out[k * gap] = n; });
    return out;
  }
  [a, b, c, d].forEach((n, k) => { out[k * 2] = n; });
  if (len === 8) return out;                          // lost count: no fifth
  if (len === 9) { out[8] = stroke; return out; }     // a hiccup of a fifth
  out[8] = stroke;
  out[9] = '-';
  for (let k = 10; k < len; k++) out[k] = k % 2 === 0 ? stroke : '-';  // again, again
  return out;
}
// The cymbal swell is loudest 3.18 s in (sampleSets.js): 32 steps.
const SWELL = [60, ...Array(31).fill('-')];
const late = (steps, by) => [...rest(by), ...steps.slice(0, steps.length - by)];
// Each step lasts k steps.
const stretch = (steps, k) => steps.flatMap((s) => [s, ...Array(k - 1).fill(s === '.' ? '.' : '-')]);

// ------------------------------------------------------------- the tunes
// THE COUNT, one 5/8 bar a line.
const HOOK = s16(`
  F#5 .  E5 .  D5 .   C#5 .  B5 -
  F#5 .  E5 .  D5 .   C#5 .  A5 -
  G5  .  F#5 . E5 .   D5  .  C#6 -
  C#6 B5 A#5 B5 C#6 B5 A#5 B5 F#5 -
  F#5 E5 D5 C#5 B5 F#5 E5 D5 C#5 A5
  G5 F#5 E5 D5 D6 G5 F#5 E5 D5 B5
  F#5 - C#5 - C5 - - - F#4 -
  - - - - - - A#4 - C#5 -
`);
const HOOK_CHORDS = 'Bm G A F# Bm G F# F#';
const hookBar = (b) => HOOK.slice(b * BAR, (b + 1) * BAR);
// The count running down a step, for the intro (where the hook's star
// answer would come too soon).
const COUNT_DOWN = s16('E5 D5 C#5 B4 G5 . F#5 . E5 .');
// The star cut to one 5/8 bar: quick, quick, a breath, and it lands on the
// last 8th, the fifth stroke, with the stamp.
const STAR5 = [1, 1, 2, 1];
const star5 = (tonic) => starFall(tonic, { lengths: STAR5 });
// The star at its own pace (quick, quick, a breath, long), each 8th `unit` steps.
const starSlow = (tonic, unit) => starFall(tonic, { unit });

// THE STAR'S OWN BELLS. Wherever the star falls, the tubular bells ring it
// and the glockenspiel rings it two octaves over, both in tune: the sound
// every star guardian's song shares ("Star Aboard" rings it the same way).
// Each only plays where all four notes sit on its recordings, so an octave
// jump never breaks the shape (the glass can't: its recordings span less
// than the star's octave).
const fits = (sample, notes) => notes.every((n) => SAMPLE_SETS[sample].notes.some((r) => Math.abs(r - n) <= 2));
const pcAny = (tonic) => (typeof tonic === 'number' ? ((tonic % 12) + 12) % 12 : pcOf(tonic));
function starRing(s, at, tonic, { lengths = STAR5, unit = 2, bells = true, glock = true } = {}) {
  const pc = pcAny(tonic);
  const fall = (t) => starFall(t, { lengths, unit });
  const low = [near(pc, 58), near(pc, 58) - 12].find((t) => fits('chimes', starNotes(t)));
  const high = [near(pc, 79), near(pc, 67), near(pc, 91)].find((t) => fits('glock', starNotes(t)));
  if (bells && low != null) s.put('starBells', at, fall(low));
  if (glock && high != null) s.put('glock', at, fall(high));
  return s;
}
// A line moved by whole octaves (the first of `shifts` that works) so every
// note sits on the instrument's recordings.
const inReach = (sample, line, shifts = [0, -12, 12, -24, 24]) => {
  const notes = line.filter((n) => typeof n === 'number');
  const k = shifts.find((d) => fits(sample, notes.map((n) => n + d)));
  return up(line, k ?? shifts[0]);
};

// The valley's tune under the count, in long notes (8 bars of 5/8).
const UNDER = [...hold('F#3', 20), ...hold('E3', 10), ...hold('C#3', 10), ...hold('D3', 10), ...hold('D3', 10), ...hold('E3', 10), ...hold('C#3', 10)];

// THE ROLL CALL: a name on one note, then "pre-sent".
const CALLS = [
  s16('D5 . D5 . D5 E5 F#5 . G5 -'),
  s16('C#5 . C#5 . C#5 D5 E5 . F#5 -'),
  s16('G5 . G5 . G5 F#5 E5 . D5 -'),
  s16('F#5 . F#5 . F#5 G5 A#5 . B5 -'),
];
const ANSWERS = [s16('E5 - - - C#5 - - - . .'), s16('D5 - - - B4 - - - . .'), s16('E5 - - - A5 - - - . .')];
const CALL_CHORDS = 'G A F#m Bm G A F# F#';

// THE VALLEY'S TUNE (valleyTheme.js), a bar of its 12/8 to a bar of 7/8: the
// four dotted quarters become 4, 4, 3 and 3 16ths.
const VALLEY = [
  'F#5 - - -', 'E5 - D5 -', 'C#5 - - D5', 'E5 - - -', 'F#5 - G5 -', 'F#5 - E5 -', 'D5 - C#5 B4', 'C#5 - - -',
];
const VALLEY_HIGH = [
  'B5 - - -', 'A5 - G5 -', 'F#5 - - E5', 'F#5 - - -', 'G5 - - A5', 'B5 - A5 -', 'G5 - F#5 E5', 'F#5 - - -',
];
const SEVEN = [4, 4, 3, 3];
const inSeven = (lines) => lines.flatMap((line) => line.split(' ').flatMap((tok, k) => (tok === '-' ? Array(SEVEN[k]).fill('-') : hold(tok, SEVEN[k]))));
const VALLEY_CHORDS = 'G D/F# Bm C G D/F# Em F#m';
// The city's rain: D A E, low, top, middle, top, for ever.
const RAIN = [midi('D5'), midi('E6'), midi('A5'), midi('E6')];
const rain = (len) => Array.from({ length: len }, (_, k) => RAIN[k % 4]);

// THE LAMENT, for the quiet middle: the count, slow, that never gets to five.
const LAMENT = s16(`
  B5 - - - - - - - A5 -
  F#5 - - - - E5 - - D5 -
  E5 - - - - - - - G5 -
  F#5 - - - - - - - - -
  B5 - - - - - - - C#6 -
  D6 - - - - C#6 - - B5 -
  A5 - - - - G5 - - F#5 -
  F#5 - E5 - D5 - C#5 - . .
`);
const LAMENT_CHORDS = 'G D/F# Em F# G D/F# Em F#';

// ------------------------------------------------------------ quill (intro)
const quill = (() => {
  const s = score('quill', 12 * BAR);
  // 1-2: one pencil; a key; the star on the glass, over a low B
  s.put('penLine', 0, [66]).put('type', 7, [63]).put('penLine', 12, [66]).put('pen', 17, [67]);
  starRing(s, 0, 'B', { lengths: STAR_LENGTHS });
  s.put('harp', 6, starSlow('B3', 2));
  s.put('lowTrem', 0, hold('B2', 4 * BAR));
  s.put('violas', 0, hold('F#3', 4 * BAR));
  // 3: the harpsichord counts four, and stops; 4: counts four and STAMPS
  s.put('harpsi', 2 * BAR, s16('F#5 . E5 . D5 . C#5 . . .'));
  s.put('type', 2 * BAR, [60, '.', 62, '.', 64, '.', 61]);
  s.put('harpsi', 3 * BAR, hookBar(0)).put('type', 3 * BAR, [60, '.', 62, '.', 64, '.', 61]).put('typeBack', 3 * BAR + 8, [67]);
  s.hit('stamp', 3 * BAR + 8).hit('stampClap', 3 * BAR + 8);
  s.put('pizzTop', 3 * BAR + 8, [midi('B4')]).put('bass', 3 * BAR + 8, [midi('B1'), '-']);
  // 5-8: the desk starts up: the left hand, the bass, the keys
  const run = barsOf('Bm G A F#');
  s.add(desk(run, { lh: true, type: true, stamp: true, ding: true }), 4 * BAR);
  s.put('harpsi', 4 * BAR, HOOK.slice(0, 4 * BAR));
  starRing(s, 7 * BAR, 'F#');
  // 9-12: faster: two tallies a bar, the drums, a roll and a swell
  const fast = barsOf('Bm G Em F#');
  s.add(desk(fast, { lh: true, type: true, pen: true, stamp: true, kick: true, hats: true, pizz: true, ding: true }), 8 * BAR);
  s.put('harpsi', 8 * BAR, [...hookBar(4), ...hookBar(5), ...COUNT_DOWN]).put('harpsi', 11 * BAR, s16('F#5 E5 D5 C#5 F#5 E5 D5 C#5 F#5 C#5'));
  s.put('roll', 10 * BAR, Array(2 * BAR).fill('x'));
  s.put('swell', 12 * BAR - SWELL.length, SWELL);
  return s.done();
})();

// ------------------------------------------------------- rollCall (phase 1)
const rollCall = (() => {
  const s = score('rollCall', 32 * BAR);
  const hook = barsOf(HOOK_CHORDS);
  // 1-8: the count on the harpsichord, the pizzicato and the keys
  s.add(desk(hook, { lh: true, pizz: true, type: true, kick: true, stamp: true, ding: true }));
  s.put('harpsi', 0, HOOK).put('harpsiPluck', 0, HOOK);
  starRing(s, 6 * BAR, 'F#', { lengths: STAR_LENGTHS });
  s.hit('crash', 0);
  // 9-16: the flute and violins, the drums and the pens
  const B2 = 8 * BAR;
  s.add(desk(hook, { lh: true, pizz: true, type: true, pen: true, kick: true, snare: 'stroke', stamp: true, hats: true, open: true, ding: true }), B2);
  s.put('harpsi', B2, HOOK).put('flute', B2, up(HOOK, 12)).put('violins', B2, HOOK);
  s.add(pads(hook, ['violas', 'hornLo', 'hornHi'], 54), B2);
  starRing(s, B2 + 6 * BAR, 'F#', { lengths: STAR_LENGTHS });
  s.put('trumpets', B2 + 6 * BAR, HOOK.slice(6 * BAR));
  s.hit('crash', B2);
  // 17-24: the roll call: a name, "pre-sent"; the Hero's name: nothing
  const B3 = 16 * BAR;
  const call = barsOf(CALL_CHORDS);
  s.add(desk(call.slice(0, 7), { lh: true, pizz: true, type: true, pen: true, kick: true, hats: true }), B3);
  [0, 2, 4].forEach((b, k) => {
    s.put('trumpets', B3 + b * BAR, CALLS[k]).put('violins', B3 + b * BAR, up(CALLS[k], 12));
    s.put('callVox', B3 + (b + 1) * BAR, ANSWERS[k]).put('callLow', B3 + (b + 1) * BAR, up(ANSWERS[k], -12));
    s.hit('stamp', B3 + (b + 1) * BAR, B3 + (b + 1) * BAR + 4).hit('stampClap', B3 + (b + 1) * BAR + 4);
    s.put('pizzTop', B3 + (b + 1) * BAR + 4, [ANSWERS[k][4]]);
  });
  s.put('trumpets', B3 + 6 * BAR, CALLS[3]).put('violins', B3 + 6 * BAR, up(CALLS[3], 12)).put('flute', B3 + 6 * BAR, up(CALLS[3], 12));
  s.add(pads(call.slice(0, 7), ['choirLo', 'choirMid', 'choirHi'], 55), B3);
  // bar 24: no answer. Only the star, the low F#, and a page rubbed out
  const b24 = B3 + 7 * BAR;
  starRing(s, b24, 'F#').put('harp', b24, star5('F#4'));
  s.put('lowTrem', b24, hold('F#2', BAR)).put('pen', b24 + 6, [67]);
  s.put('lh', b24 + 6, s16('F#4 A#4 C#5 E5'));
  // 25-32: the count with everyone; the valley's tune under it
  const B4 = 24 * BAR;
  s.add(desk(hook, { lh: true, pizz: true, type: true, pen: true, kick: true, snare: 'stroke', stamp: true, hats: true, open: true, ding: true }), B4);
  s.put('harpsi', B4, HOOK).put('flute', B4, up(HOOK, 12)).put('violins', B4, HOOK);
  s.put('trumpets', B4, up(HOOK.slice(0, 6 * BAR), -12)).put('trumpets', B4 + 6 * BAR, HOOK.slice(6 * BAR));
  s.put('cellos', B4, UNDER).put('hornLo', B4, UNDER).put('trombone', B4, UNDER.slice(0, 6 * BAR));
  // the star answer: the low brass under it, the slip bitten off
  s.put('trombone', B4 + 6 * BAR, starFall('F#3')).put('hornHi', B4 + 6 * BAR + 4, hold('D#3', 4));
  s.put('race', B4, desk(hook, { lh: 66, bass: false }).lh);
  starRing(s, B4 + 6 * BAR, 'F#', { lengths: STAR_LENGTHS });
  s.hit('crash', B4).hit('impact', B4).hit('crash', B4 + 4 * BAR).hit('crash', B4 + 6 * BAR);
  s.put('timpani', B4, hook.flatMap((bar) => [timpRoot(chordOf(bar.chord).tones[0]), ...rest(BAR - 1)]));
  return s.done();
})();

// -------------------------------------------------- ledger (the valley's tune)
const ledger = (() => {
  const bars = [...barsOf('Bm Bm', 14), ...barsOf(VALLEY_CHORDS, 14), ...barsOf(VALLEY_CHORDS, 14), ...barsOf('F# F#', 10)];
  const starts = startsOf(bars);
  const s = score('ledger', lengthOf(bars));
  const L = 14;
  const groove = (from, to, extra = {}) => {
    const part = bars.slice(from, to);
    const o = desk(part, { type: true, pen: true, pizz: true, ding: true, ...extra });
    s.add(o, starts[from]);
    part.forEach((bar, i) => {
      const at = starts[from + i];
      s.hit('kick', at, at + 8).hit('stamp', at + 11).hit('stampClap', at + 11);
      if (extra.drums) s.hit('snare', at + 4, at + 11);
      for (let k = 0; k < L; k += 2) if (extra.drums) s.hit('hats', at + k);
    });
  };
  // 1-2: the rain on the harpsichord, the keys
  groove(0, 2);
  // 3-10: the tune on the flute and violins
  groove(2, 10, { drums: true });
  // 11-18: high on the solo violin and the choir, everyone
  groove(10, 18, { drums: true });
  s.put('rain', 0, rain(starts[18]));
  s.put('harpsiPluck', 0, rain(starts[18]).map((n, k) => (k % 2 ? '.' : n)));
  const tune = inSeven(VALLEY);
  const high = inSeven(VALLEY_HIGH);
  s.put('flute', starts[2], tune).put('violins', starts[2], tune).put('violas', starts[2], up(tune, -12));
  s.put('solo', starts[10], high).put('violins', starts[10], high).put('choirTune', starts[10], up(high, -12)).put('flute', starts[10], up(high, 12));
  s.put('cellos', starts[2], roots(bars.slice(2, 18), 40));
  s.add(pads(bars.slice(10, 18), ['hornLo', 'hornHi', 'choirMid'], 54), starts[10]);
  s.put('trumpets', starts[10], up(tune, 0).map((n, k) => (k % 28 < 14 ? n : '.')));
  s.put('glass', starts[2], sparkle(bars.slice(2, 18), 75, [3, 9]));
  s.hit('crash', starts[2]).hit('crash', starts[10]).hit('impact', starts[10]);
  // 19-20: the count accelerating into the late fees
  const T = starts[18];
  s.add(desk(bars.slice(18), { lh: true, type: true, pen: true, kick: 'all', hats: true }), T);
  s.put('harpsi', T, s16('F#5 E5 D5 C#5 F#5 E5 D5 C#5 F#5 E5 D5 C#5 F#5 E5 D5 C#5 F#5 E5 D5 C#5'));
  s.put('violins', T, s16('F#5 E5 D5 C#5 F#5 E5 D5 C#5 F#5 E5 D5 C#5 F#5 E5 D5 C#5 F#5 E5 D5 C#5'));
  s.put('trombone', T, hold('F#3', 20)).put('hornLo', T, hold('A#3', 20)).put('hornHi', T, hold('C#4', 20));
  s.put('roll', T, Array(20).fill('x')).put('timpRoll', T, hold(timpRoot(6), 20));
  s.put('swell', lengthOf(bars) - SWELL.length, SWELL);
  return s.done();
})();

// ------------------------------------------------------ lateFees (phase 2)
const lateFees = (() => {
  // The bars drift as the sums go wrong; the bass slides down a semitone a
  // bar; the second time round the chords slip with it.
  const lens = [10, 10, 11, 9, 10, 12, 8, 13, 7, 10, 11, 9, 12, 8, 14, 10, 10, 9, 11, 8, 12, 10, 13, 10];
  const chords = [
    'Bm', 'F#/A#', 'Bm/A', 'G#dim', 'G', 'F#', 'F', 'Em',
    'D', 'C#', 'C', 'Bm', 'Bb', 'A', 'G#dim', 'F#',
    'Bm', 'G', 'A', 'F#', 'Bm', 'G', 'C', 'F#',
  ];
  const bars = lens.map((len, i) => ({ len, chord: chords[i] }));
  bars.push({ len: 10, chord: 'F#' }, { len: 10, chord: 'F#' });
  const starts = startsOf(bars);
  const s = score('lateFees', lengthOf(bars));
  const main = bars.slice(0, 24);
  s.add(desk(main, { lh: true, pizz: true, type: true, pen: true, kick: true, snare: 'stroke', stamp: true, hats: true, open: true }));
  // the count, squeezed and stretched to fit each bar
  const count = main.flatMap((bar) => countIn(bar.chord, bar.len));
  s.put('harpsi', 0, count).put('violins', 0, count).put('harpsiPluck', 0, count);
  s.put('flute', starts[8], up(count.slice(starts[8]), 12));
  // the brass: a line going down a semitone a bar, and stabs on the strokes
  const slide = main.flatMap((bar) => hold(near(chordOf(bar.chord).bass, 45), bar.len));
  s.put('trombone', 0, slide).put('hornLo', starts[4], slide.slice(starts[4]));
  main.forEach((bar, i) => {
    if (bar.len < 9) return;
    const [r, t, f] = chordOf(bar.chord).tones;
    const at = starts[i] + bar.len - 2;
    s.put('trumpets', at, [near(t, 66), '-']).put('hornHi', at, [near(f, 60), '-']);
  });
  // the bell rings in the wrong places
  [2, 5, 9, 10, 15, 19, 22].forEach((b) => s.hit('ding', starts[b] + Math.min(4, bars[b].len - 1)));
  s.add(pads(main.slice(16), ['choirLo', 'choirMid', 'choirHi'], 55), starts[16]);
  s.put('glock', starts[16], sparkle(main.slice(16), 84, [1, 5]));
  s.put('race', starts[16], desk(main.slice(16), { lh: 66, bass: false }).lh);
  s.put('timpani', 0, main.flatMap((bar) => [timpRoot(chordOf(bar.chord).bass), ...rest(bar.len - 1)]));
  s.hit('crash', 0).hit('impact', 0).hit('crash', starts[8]).hit('crash', starts[16]).hit('gong', starts[16]);
  // stamp. stamp. (the last two bars: the fee, in full)
  const E = starts[24];
  for (const k of [0, 4, 8, 10, 14, 18]) s.hit('stamp', E + k).hit('stampClap', E + k).hit('kick', E + k);
  s.put('trumpets', E, s16('C#5 - . . C#5 - . . C#5 . C#5 - . . C#5 - . . A#4 -'));
  s.put('hornHi', E, s16('A#4 - . . A#4 - . . A#4 . A#4 - . . A#4 - . . F#4 -'));
  s.put('trombone', E, s16('F#3 - . . F#3 - . . F#3 . F#3 - . . F#3 - . . F#2 -'));
  s.put('bass', E, s16('F#2 - . . F#2 - . . F#2 . F#2 - . . F#2 - . . F#1 -'));
  starRing(s, E + 10, 'F#');
  s.put('roll', E + 10, Array(10).fill('x'));
  return s.done();
})();

// ------------------------------------------------------ recount (the pivot)
const recount = (() => {
  const s = score('recount', 28 * BAR);
  const lament = barsOf(LAMENT_CHORDS);
  // 1-4: one pencil; the star slowly on the glass; the rain on the piano
  s.put('penLine', 0, [66]).put('penLine', 2 * BAR + 3, [66]).put('pen', BAR + 6, [61]).put('pen', 3 * BAR + 5, [67]);
  // the star slowed right down, in canon with itself: the glockenspiel,
  // then the bells a bar behind
  starRing(s, 0, 'B', { lengths: STAR_LENGTHS, unit: 3, bells: false });
  starRing(s, BAR, 'B', { lengths: STAR_LENGTHS, unit: 3, glock: false });
  s.put('rain', BAR, rain(27 * BAR));
  s.put('lowTrem', 0, hold('B2', 4 * BAR));
  s.put('hum', 0, hold('F#3', 4 * BAR)).put('humMid', 0, hold('D4', 4 * BAR));
  // 5-12: the lament on a solo violin, the harp, the bass moving under
  const A = 4 * BAR;
  s.put('solo', A, LAMENT);
  s.put('harp', A, desk(lament, { lh: 50, bass: false }).lh.map((n, k) => (k % 2 ? '.' : n)));
  s.put('cellos', A, roots(lament, 40));
  s.add(pads(lament, ['hum', 'humMid', 'humHigh'], 55), A);
  // (the count's last bar: four strokes, and nothing where the fifth should be)
  // 13-20: the violins and the choir take it up; a key, a pencil, now and then
  const B = 12 * BAR;
  s.put('violins', B, LAMENT).put('choirTune', B, up(LAMENT, -12)).put('flute', B + 4 * BAR, up(LAMENT.slice(4 * BAR), 12));
  s.put('harp', B, desk(lament, { lh: 50, bass: false }).lh);
  s.add(desk(lament, { pizz: true, cello: true, walk: true }), B);
  s.add(pads(lament, ['choirLo', 'choirMid', 'choirHi'], 55), B);
  starRing(s, B + 3 * BAR, 'F#', { bells: false });
  starRing(s, B + 7 * BAR, 'F#');
  for (let b = 0; b < 8; b += 2) s.put('type', B + b * BAR + 2, [62]).put('pen', B + b * BAR + 7, [63]);
  // 21-28: the pens come back, one at a time, faster and faster: a room of them
  const C = 20 * BAR;
  const build = barsOf('Bm Bm G G A A F# F#');
  s.add(desk(build.slice(0, 2), { type: true }), C);
  s.add(desk(build.slice(2, 4), { type: true, pen: true, lh: true }), C + 2 * BAR);
  s.add(desk(build.slice(4), { type: true, pen: true, lh: true, pizz: true, kick: true, stamp: true, hats: true }), C + 4 * BAR);
  // the count in canon, quarter speed, half speed, full
  s.put('harpsi', C, stretch(s16('F#5 E5 D5 C#5 B5'), 4));
  s.put('trumpets', C + 2 * BAR, stretch(s16('D5 C#5 B4 A4 G5 D5 C#5 B4 A4 G5'), 2));
  s.put('harpsi', C + 2 * BAR, stretch(s16('D5 C#5 B4 A4 G5 D5 C#5 B4 A4 G5'), 2));
  s.put('harpsi', C + 4 * BAR, s16('E5 D5 C#5 B4 A5 E5 D5 C#5 B4 A5 E5 D5 C#5 B4 A5 E5 D5 C#5 B4 A5'));
  s.put('violins', C + 4 * BAR, s16('E5 D5 C#5 B4 A5 E5 D5 C#5 B4 A5 E5 D5 C#5 B4 A5 E5 D5 C#5 B4 A5'));
  s.put('harpsi', C + 6 * BAR, s16('C#6 B5 A#5 G5 F#5 C#6 B5 A#5 G5 F#5 C#6 B5 A#5 G5 F#5 C#6 B5 A#5 G5 F#5'));
  s.put('violins', C + 6 * BAR, s16('C#6 B5 A#5 G5 F#5 C#6 B5 A#5 G5 F#5 C#6 B5 A#5 G5 F#5 C#6 B5 A#5 G5 F#5'));
  s.add(pads(build, ['hornLo', 'hornHi', 'violas'], 54), C);
  s.put('timpRoll', C + 4 * BAR, hold(timpRoot(6), 4 * BAR));
  s.put('roll', C + 6 * BAR, Array(2 * BAR).fill('x'));
  // and the star, four times in canon, a beat apart, the brass taking the last
  for (const k of [0, 4, 8, 12]) starRing(s, C + 6 * BAR + k, 'F#', { lengths: STAR_LENGTHS, unit: 1, bells: k % 8 === 0, glock: k % 8 === 4 });
  s.put('hornLo', C + 6 * BAR + 12, starFall('F#2', { unit: 1 })).put('trombone', C + 6 * BAR + 12, starFall('F#2', { unit: 1 }));
  s.put('swell', 28 * BAR - SWELL.length, SWELL);
  return s.done();
})();

// ------------------------------------------------------- margins (phase 3)
const margins = (() => {
  const hook = barsOf(HOOK_CHORDS);
  const slow = barsOf('Bm Bm G G A A F# F#');
  const shrink = [10, 9, 8, 7, 6, 6, 5, 5, 4, 4, 4, 4, 3, 3, 3, 3, 2, 2, 2, 2].map((len, i) => ({ len, chord: ['Bm', 'G', 'A', 'F#'][Math.floor(i / 5) % 4] }));
  const P1 = 0;
  const P2 = 8 * BAR;
  const P3 = 16 * BAR;
  const P4 = 24 * BAR;
  const P5 = P4 + lengthOf(shrink);
  const length = P5 + BAR;
  const s = score('margins', length);
  const full = { lh: true, pizz: true, type: true, pen: true, kick: 'all', snare: 'stroke', stamp: true, hats: true, open: true, ding: true };

  // 1-8: the count, and the brass counting against it in dotted 8ths
  s.add(desk(hook, full), P1);
  s.put('harpsi', P1, HOOK).put('violins', P1, HOOK).put('flute', P1, up(HOOK, 12));
  const dotted = stretch(s16('F#4 E4 D4 C#4 B4'), 3);
  const brass = Array.from({ length: Math.ceil(8 * BAR / dotted.length) }, () => dotted).flat().slice(0, 8 * BAR);
  s.put('hornLo', P1, up(brass, -12)).put('trombone', P1, up(brass, -24)).put('trumpets', P1, brass.map((n) => (n === midi('B4') ? n : '.')));
  for (let k = 12; k < 8 * BAR; k += 15) s.hit('taiko', P1 + k);
  s.hit('crash', P1).hit('impact', P1).hit('gong', P1);
  s.put('braam', P1, hold('B2', 2 * BAR)).put('braamLow', P1, hold('B1', 2 * BAR));

  // 9-16: the count in canon, half a bar apart; stars cascading
  s.add(desk(hook, full), P2);
  s.put('violins', P2, HOOK).put('trumpets', P2, up(HOOK, -12)).put('harpsi', P2, late(HOOK, 5)).put('flute', P2, late(up(HOOK, 12), 5));
  s.put('hornLo', P2, up(late(HOOK, 5), -24));
  // a star on every bar's root, the bells on the beat and the glockenspiel
  // half a bar behind, like the hook's canon
  hook.forEach((bar, i) => {
    const r = chordOf(bar.chord).tones[0];
    starRing(s, P2 + i * BAR, r, { glock: false });
    starRing(s, P2 + i * BAR + 5, r, { bells: false });
  });
  s.add(pads(hook, ['choirLo', 'choirMid', 'choirHi'], 55), P2);
  s.hit('crash', P2).hit('crash', P2 + 4 * BAR);

  // 17-24: the hook in long notes on the brass, the count racing over it
  s.add(desk(slow, full), P3);
  const big = stretch(HOOK.slice(0, 4 * BAR), 2);
  s.put('trumpets', P3, big).put('hornLo', P3, up(big, -24)).put('trombone', P3, up(big, -24)).put('choirTune', P3, up(big, -12));
  const fast = slow.flatMap((bar) => {
    const [a, b, c, d, e] = tallyNotes(bar.chord);
    return [a, b, c, d, e, a, b, c, d, e];
  });
  s.put('harpsi', P3, fast).put('violins', P3, up(fast, 12)).put('flute', P3, up(fast, 12)).put('harpsiPluck', P3, fast);
  s.put('race', P3, desk(slow, { lh: 66, bass: false }).lh);
  s.hit('crash', P3).hit('gong', P3).hit('impact', P3).hit('crash', P3 + 4 * BAR);
  s.put('timpani', P3, slow.flatMap((bar) => [timpRoot(chordOf(bar.chord).tones[0]), ...rest(BAR - 1)]));

  // 25-: the bars shrink until it can't keep up; a gong
  s.add(desk(shrink, { lh: true, type: true, pen: true, kick: true, stamp: true, hats: true, pizz: true }), P4);
  const squeeze = shrink.flatMap((bar) => countIn(bar.chord, bar.len));
  s.put('harpsi', P4, squeeze).put('violins', P4, squeeze).put('flute', P4, up(squeeze, 12));
  s.put('glock', P4, up(squeeze, 24));
  s.put('roll', P4 + 30, Array(P5 - P4 - 30).fill('x'));
  s.put('choirHi', P4, hold('F#4', P5 - P4)).put('choirMid', P4, hold('C#4', P5 - P4)).put('choirLo', P4, hold('A#3', P5 - P4));
  s.put('timpRoll', P4 + 30, hold(timpRoot(6), P5 - P4 - 30));
  s.put('swell', P5 - SWELL.length, SWELL);
  // the gong, and a beat of nothing; one page rubbed out
  s.hit('gong', P5).hit('impact', P5).hit('crash', P5);
  s.put('braamLow', P5, hold('F#1', 6)).put('trombone', P5, hold('F#2', 4)).put('bass', P5, hold('F#1', 3));
  s.put('pen', P5 + 6, [67]);
  return s.done();
})();

// ------------------------------------------- shard (the star, entered in full)
// The slip's own chord: a diminished chord built on the slip, which already
// holds the note the star is about to land on. (`lo`: as low as it goes.)
const slipChord = (tonic, lo) => {
  const n = near((pcAny(tonic) + 6) % 12, lo);
  return [n, n + 3, n + 6];
};
// The star counted like a tally: its four notes as four even strokes, and
// the fifth stroke back up at the top. It won't stay counted.
const starTally = (tonic) => {
  const [a, b, c, d] = starNotes(tonic);
  return [a, '.', b, '.', c, '.', d, '.', a, '-'];
};
// The star ticked off in 16ths, quick as a pen.
const starTick = (tonic) => starFall(tonic, { lengths: [1, 1, 1, 1], unit: 1 });

const shard = (() => {
  const s = score('shard', 28 * BAR);

  // 1-2: the count broke at the gong. What's left is the star: its bells
  // alone in B, the keys still going, a low B; the left hand comes back
  const open = barsOf('Bm Bm');
  s.add(desk(open, { type: true, pen: true, stamp: true, walk: false }));
  s.add(desk(open.slice(1), { lh: true, bass: false }), BAR);
  starRing(s, 0, 'B', { lengths: STAR_LENGTHS });
  s.put('lowTrem', 0, hold('B2', 2 * BAR)).put('violas', 0, hold('F#3', 2 * BAR));

  // 3-10: THE STAR AS A TUNE, on the harpsichord. Stated in its own rhythm
  // (cut to the bar, so it lands on the stamp), then answered by itself in
  // 16ths; and again a third down, a seventh up, and on the dominant (the
  // hook's own chords, Bm G A F#), the last one running up into the brass.
  // Every slip gets its own chord, plucked: a diminished chord on the slip.
  const A = 2 * BAR;
  const tune = barsOf('Bm Bm G G A A F# F#');
  s.add(desk(tune, { lh: true, pizz: true, type: true, pen: true, kick: true, stamp: true, ding: true }), A);
  const TUNE = s16(`
    B5  .  F#5 .  F5  - - - B4  -
    B4  -  -   -  -   - B5 F#5 F5 B4
    G5  .  D5  .  C#5 - - - G4  -
    G4  -  -   -  -   - G5 D5 C#5 G4
    A5  .  E5  .  D#5 - - - A4  -
    A4  -  -   -  -   - A5 E5 D#5 A4
    F#5 .  C#5 .  C5  - - - F#4 -
    F#4 -  -   -  A#4 - C#5 - E5 -
  `);
  s.put('harpsi', A, TUNE).put('harpsiPluck', A, TUNE);
  s.put('violins', A + 4 * BAR, TUNE.slice(4 * BAR)).put('flute', A + 4 * BAR, up(TUNE.slice(4 * BAR), 12));
  ['B4', 'G4', 'A4', 'F#4'].forEach((t, k) => {
    const at = A + 2 * k * BAR;
    starRing(s, at, t);
    const [lo, mid, hi] = slipChord(t, 60);
    s.put('pizzLo', at + 4, [lo]).put('pizzHi', at + 4, [mid]).put('pizzTop', at + 4, [hi]);
    // the answer, on the glass and glockenspiel too
    if (fits('glock', starNotes(midi(t) + 12))) s.put('glock', at + BAR + 6, starTick(midi(t) + 12));
  });
  s.put('cellos', A + 4 * BAR, roots(tune.slice(4), 40));
  s.hit('crash', A + 4 * BAR);

  // 11-18: FIVE STARS IN EIGHT BARS. The brass play the star at its own
  // pace (quick, quick, a breath, long: eight 8ths) against the bar's five,
  // so they drift across the barlines and come back level only at the end:
  // five of them in eight bars, counted in fives. Over them the harpsichord
  // counts the star in the bar like a tally (four strokes, and the fifth
  // back at the top), eight times, one a bar: eight against five.
  const B = 10 * BAR;
  const five = barsOf('Bm G G Em Em C# F# F#');
  s.add(desk(five, { lh: true, pizz: true, type: true, pen: true, kick: true, snare: 'stroke', stamp: true, hats: true, open: true, ding: true }), B);
  const TALLY_ON = { Bm: 'B4', G: 'G4', Em: 'E5', 'C#': 'C#5', 'F#': 'F#4' };
  const eight = five.flatMap((bar) => starTally(TALLY_ON[bar.chord]));
  s.put('harpsi', B, eight).put('harpsiPluck', B, eight).put('violins', B, eight);
  ['B2', 'G2', 'E2', 'C#2', 'F#2'].forEach((t, k) => {
    const at = B + 16 * k;
    s.put('trombone', at, starFall(t)).put('hornLo', at, starFall(t));
    s.put('trumpets', at, inReach('trumpet', starFall(midi(t) + 12), [0, 12, -12]));
    starRing(s, at, t, { lengths: STAR_LENGTHS, glock: k % 2 === 0, bells: k % 2 === 1 });
  });
  s.add(pads(five, ['choirLo', 'choirMid', 'choirHi'], 55), B);
  s.put('cellos', B, roots(five, 40));
  s.hit('crash', B).hit('impact', B).hit('crash', B + 4 * BAR);

  // 19-26: THE CLIMB. The star in its own rhythm on the violins, trumpets
  // and flute, a step higher each time (B, D, E, F#), its long note running
  // up into the next; the low brass answer it with itself under the long
  // note; the glockenspiel follows it in canon an 8th behind; the
  // harpsichord tallies it underneath at full speed. The last one, on F#,
  // is the climax: the slip's own chord is a C major, a tritone from home,
  // the whole room on it, and the long note held.
  const C = 18 * BAR;
  const climb = barsOf('Bm Bm D D Em Em F# F#');
  const full = { lh: true, pizz: true, type: true, pen: true, kick: 'all', snare: 'stroke', stamp: true, hats: true, open: true, ding: true };
  s.add(desk(climb, full), C);
  s.put('race', C, desk(climb, { lh: 66, bass: false }).lh);
  const harpTally = climb.flatMap((bar) => starTally({ Bm: 'B4', D: 'D5', Em: 'E5', 'F#': 'F#4' }[bar.chord]));
  s.put('harpsi', C, harpTally).put('harpsiPluck', C, harpTally);
  const RUNS = ['D5 F#5 A5 C#6', 'E5 G5 B5 D#6', 'F#5 A#5 C#6 E6'];
  [['B4', 'B2'], ['D5', 'D3'], ['E5', 'E3']].forEach(([t, low], k) => {
    const at = C + 2 * k * BAR;
    const line = [...starFall(t), ...s16(RUNS[k])];
    s.put('violins', at, line).put('flute', at, line).put('trumpets', at, up(line, -12));
    s.put('trombone', at + BAR, starFall(low, { lengths: STAR5 })).put('hornLo', at + BAR, starFall(midi(low) - 12, { lengths: STAR5 }));
    const [a, b, c] = slipChord(t, 45);
    s.put('hornLo', at + 4, hold(a, 4)).put('hornHi', at + 4, hold(b, 4)).put('trombone', at + 4, hold(c - 12, 4));
    starRing(s, at + 2, t, { lengths: STAR_LENGTHS, bells: false });
    s.hit('crash', at);
  });
  s.add(pads(climb.slice(0, 6), ['choirLo', 'choirMid', 'choirHi'], 55), C);
  s.put('cellos', C, roots(climb, 40));
  s.put('timpani', C, climb.flatMap((bar) => [timpRoot(chordOf(bar.chord).tones[0]), ...rest(BAR - 1)]));
  // the climax: F#, the long note held through both bars
  const X = C + 6 * BAR;
  const peak = (t) => starFall(t, { lengths: [1, 1, 2, 6] });
  s.put('solo', X, peak('F#5')).put('flute', X, peak('F#5')).put('violins', X, peak('F#4'));
  s.put('trumpets', X, peak('F#4')).put('choirTune', X, peak('F#3'));
  s.put('trombone', X, peak('F#2')).put('hornLo', X, peak('F#2'));
  starRing(s, X, 'F#', { lengths: [1, 1, 2, 6] });
  // the slip: C major, everyone
  s.put('choirLo', X + 4, hold('C4', 4)).put('choirMid', X + 4, hold('E4', 4)).put('choirHi', X + 4, hold('G4', 4));
  s.put('hornHi', X + 4, hold('E3', 4)).put('violas', X + 4, hold('G3', 4)).put('cellos', X + 4, hold('C3', 4));
  s.put('bass', X + 4, hold('C2', 4)).put('braamLow', X + 4, hold('C2', 4));
  s.put('timpani', X + 4, [timpRoot(0)]);
  s.hit('crash', X + 4).hit('impact', X + 4).hit('stamp', X + 4).hit('stampClap', X + 4);
  // (12 November 2026) the chord's weight: the pads above take a while to
  // speak, so a stab on top of them speaks at once: brass and voices on C
  // major, a braam on C and the bass drum, so this is the loudest moment of
  // the section, not the climb before it
  s.put('stabTpt', X + 4, hold('E4', 4)).put('stabHorn', X + 4, hold('G3', 4)).put('stabBone', X + 4, hold('C3', 4));
  s.put('stabVoxLo', X + 4, hold('E4', 4)).put('stabVoxHi', X + 4, hold('G4', 4));
  s.put('braam', X + 4, hold('C3', 4)).hit('kick', X + 4).hit('taiko', X + 4);
  // and it lands on F#: the dominant, held
  s.put('choirLo', X + 8, hold('A#3', 12)).put('choirMid', X + 8, hold('C#4', 12)).put('choirHi', X + 8, hold('F#4', 12));
  s.put('hornHi', X + 8, hold('C#3', 12)).put('violas', X + 8, hold('A#3', 12)).put('cellos', X + 8, hold('F#2', 12));
  s.put('bass', X + 8, hold('F#1', 3)).put('braam', X + 8, hold('F#2', 12));
  s.hit('crash', X + 8);

  // 27-28: the star ticked off faster and faster, a roll, and the count
  // comes back home
  const D = 26 * BAR;
  const last = barsOf('F# F#');
  s.add(desk(last, { lh: true, pizz: true, type: true, pen: true, kick: 'all', hats: true }), D);
  const run = [...starTick('F#4'), ...starTick('F#4'), ...s16('F#5 -'), ...starTick('F#4'), ...s16('A#4 C#5 E5 F#5 A#5 C#6')];
  s.put('harpsi', D, run).put('violins', D, run).put('harpsiPluck', D, run);
  s.put('trombone', D + BAR, starFall('F#2', { lengths: STAR5 })).put('hornLo', D + BAR, starFall('F#2', { lengths: STAR5 }));
  s.put('choirLo', D, hold('A#3', 2 * BAR)).put('choirMid', D, hold('C#4', 2 * BAR)).put('choirHi', D, hold('E4', 2 * BAR));
  s.put('roll', D, Array(2 * BAR).fill('x')).put('timpRoll', D, hold(timpRoot(6), 2 * BAR));
  s.put('swell', 28 * BAR - SWELL.length, SWELL);
  return s.done();
})();

// ------------------------------------------------------------- home
const home = (() => {
  const s = score('home', 16 * BAR);
  const hook = barsOf(HOOK_CHORDS);
  const full = { lh: true, pizz: true, type: true, pen: true, kick: true, snare: 'stroke', stamp: true, hats: true, open: true, ding: true };
  // 1-8: the count, home, everyone
  s.add(desk(hook, full));
  s.put('harpsi', 0, HOOK).put('flute', 0, up(HOOK, 12)).put('violins', 0, HOOK);
  s.put('trumpets', 0, up(HOOK.slice(0, 6 * BAR), -12)).put('trumpets', 6 * BAR, HOOK.slice(6 * BAR));
  s.put('hornLo', 0, up(HOOK, -24)).put('cellos', 0, UNDER);
  s.add(pads(hook, ['choirLo', 'choirMid', 'choirHi'], 55));
  starRing(s, 6 * BAR, 'F#', { lengths: STAR_LENGTHS });
  s.hit('crash', 0).hit('impact', 0).hit('crash', 6 * BAR);
  // 9-16: once more, the valley's tune under it; and this time the answer
  // is the star in B, the whole room playing it, the diminished chord on B
  // under the slip, landing home on the fifth stroke with the stamp
  const B = 8 * BAR;
  const last = barsOf('Bm G A F# Bm G Bm Bm');
  s.add(desk(last.slice(0, 6), full), B);
  const tail = HOOK.slice(0, 6 * BAR);
  s.put('harpsi', B, tail).put('flute', B, up(tail, 12)).put('violins', B, tail).put('trumpets', B, up(tail, -12));
  s.put('trombone', B, UNDER.slice(0, 6 * BAR)).put('hornLo', B, UNDER.slice(0, 6 * BAR));
  s.put('race', B, desk(last.slice(0, 6), { lh: 66, bass: false }).lh);
  s.hit('crash', B);
  const S = B + 6 * BAR;
  const fall = (t) => starFall(t, { lengths: STAR_LENGTHS });
  s.put('harpsi', S, fall('B4')).put('flute', S, fall('B5')).put('violins', S, fall('B4')).put('harpsiPluck', S, fall('B4'));
  s.put('trumpets', S, fall('B4')).put('hornLo', S, fall('B2')).put('trombone', S, fall('B2')).put('cellos', S, fall('B2'));
  s.put('choirTune', S, fall('B3'));
  starRing(s, S, 'B', { lengths: STAR_LENGTHS });
  s.put('choirLo', S, hold('B3', 16)).put('choirMid', S, hold('D4', 16)).put('choirHi', S, [...hold('F#4', 4), ...hold('G#4', 4), ...hold('F#4', 8)]);
  s.put('hornHi', S + 4, hold('D3', 4)).put('violas', S + 4, hold('G#3', 4));
  s.put('bass', S, hold('B1', 16)).put('braamLow', S, hold('B1', 16)).put('braam', S + 8, hold('B2', 10));
  s.put('timpani', S, [timpRoot(11)]).put('timpani', S + 4, [timpRoot(5)]);
  s.hit('kick', S).hit('kick', S + 2).hit('kick', S + 4).hit('snare', S + 4).hit('crash', S);
  // it lands on the stroke: the stamp, the gong, B
  const land = S + 8;
  s.put('timpani', land, [timpRoot(11)]).put('celloPizz', land, [midi('B2')]);
  s.hit('crash', land).hit('impact', land).hit('gong', land).hit('stamp', land).hit('stampClap', land).hit('kick', land);
  // three keys: and round again
  s.put('type', land + 8, [60, 64, 62]);
  return s.done();
})();

// -------------------------------------------------- present (the coda: MERCY)
const present = (() => {
  const s = score('present', 18 * BAR);
  // the count, slowly, on the harp, over a held F sharp
  const slowCount = stretch(s16('F#5 E5 D5 C#5'), 6);
  s.put('harp', 0, slowCount).put('glass', 0, up(slowCount, 12).map((n, k) => (k % 6 === 0 ? n : '.')));
  s.put('violas', 0, hold('A#3', 24)).put('cellos', 0, hold('F#2', 24)).put('hum', 0, hold('C#4', 24)).put('humMid', 0, hold('F#3', 24));
  s.put('penLine', 2, [66]);
  // and the fifth lands: B major, held, everything settling
  const B = 24;
  const held = 18 * BAR - B;
  s.put('harp', B, s16('B2 F#3 B3 D#4 F#4 B4 D#5 F#5 B5 - - -'));
  s.put('glass', B, s16('B5 - - - D#6 - - - F#6 - - - B6'));
  s.put('glock', B + 4, [midi('B6')]);
  s.put('solo', B, hold('B5', held - 10)).put('violins', B, hold('F#5', held - 10)).put('violas', B, hold('D#4', held - 10));
  s.put('cellos', B, hold('B2', held - 10)).put('bass', B, [midi('B1')]);
  s.put('choirHi', B, hold('D#5', held - 10)).put('choirMid', B, hold('F#4', held - 10)).put('choirLo', B, hold('B3', held - 10));
  s.put('hornHi', B, hold('F#4', held - 20)).put('hornLo', B, hold('B3', held - 20));
  s.put('chimes', B, [midi('B4')]).put('timpani', B, [timpRoot(11)]);
  s.put('glass', B + 6 * BAR, [midi('F#6')]).put('glass', B + 9 * BAR, [midi('B5')]);
  return s.done();
})();

// ------------------------------------------------------------ the players
// Where a note lands too far from any recording (more than two semitones),
// it moves an octave; where none works, a glockenspiel note goes to the glass.
const TWINS = { glock: 'glass' };
function settleNotes(instruments, sections) {
  const reach = (sample, n) => Math.min(...SAMPLE_SETS[sample].notes.map((r) => Math.abs(r - n))) <= 2;
  const settle = (inst, n) => [0, -12, 12, -24, 24].map((k) => n + k).find((m) => reach(inst.sample, m + 12 * (inst.octave ?? 0)));
  for (const section of Object.values(sections)) {
    const length = Object.values(section)[0].length;
    for (const [track, steps] of Object.entries(section)) {
      const inst = instruments[track];
      if (!inst?.sample || inst.drum) continue;
      for (let i = 0; i < steps.length; i++) {
        if (typeof steps[i] !== 'number') continue;
        const moved = settle(inst, steps[i]);
        if (moved != null) { steps[i] = moved; continue; }
        const twin = TWINS[track];
        if (!twin) continue;
        const twinSteps = (section[twin] ??= rest(length));
        twinSteps[i] = settle(instruments[twin], steps[i]) ?? steps[i];
        steps[i] = '.';
        for (let k = i + 1; k < steps.length && steps[k] === '-'; k++) { twinSteps[k] = '-'; steps[k] = '.'; }
      }
    }
  }
  return sections;
}

const instruments = {
  // the harpsichord: two bright pianos a little apart, short and dry, with a
  // pizzicato edge on every note for the pluck
  harpsi: { sample: 'grandPiano', volume: 0.27, release: 0.05, detune: 7, reverb: 0.22, pan: -0.15, humanize: { time: 0.004, volume: 0.12 } },
  harpsiHi: { sample: 'grandPiano', volume: 0.12, release: 0.04, detune: -9, octave: 1, reverb: 0.22, pan: 0.15 },
  harpsiPluck: { sample: 'violinsPizz', volume: 0.13, ring: true, reverb: 0.2, pan: 0.2, humanize: { time: 0.004, volume: 0.15 } },
  lh: { sample: 'grandPiano', volume: 0.15, release: 0.04, detune: -6, reverb: 0.2, pan: 0.1, humanize: { time: 0.004, volume: 0.2 } },
  rain: { sample: 'grandPiano', volume: 0.1, ring: true, reverb: 0.5, pan: 0.25, humanize: { time: 0.008, volume: 0.25 } },
  harp: { sample: 'harp', volume: 0.24, ring: true, reverb: 0.5, pan: -0.25, humanize: { time: 0.008, volume: 0.15 } },
  // the star
  glock: { sample: 'glock', volume: 0.2, ring: true, reverb: 0.55, pan: 0.2, echo: { time: 0.3, feedback: 0.25, mix: 0.2 } },
  glass: { sample: 'glass', volume: 0.2, ring: true, reverb: 0.6, pan: -0.2 },
  chimes: { sample: 'chimes', volume: 0.2, ring: true, reverb: 0.6, pan: 0.3 },
  // the star's own bells (starRing): tubular bells, in tune
  starBells: { sample: 'chimes', volume: 0.26, ring: true, reverb: 0.5, pan: -0.05, humanize: { time: 0.003, volume: 0.06 } },
  // strings
  solo: { ...ORCHESTRA.soloViolin, volume: 0.4, attack: 0.06, release: 0.6, reverb: 0.55, humanize: { time: 0.01, volume: 0.08 } },
  violins: { ...ORCHESTRA.violins, volume: 0.24, attack: 0.01, release: 0.12 },
  race: { ...ORCHESTRA.race, volume: 0.13 },
  violas: { sample: 'violas', volume: 0.16, attack: 0.15, release: 0.5, reverb: 0.45, pan: -0.2 },
  cellos: { sample: 'cellos', volume: 0.24, attack: 0.05, release: 0.4, reverb: 0.4, pan: -0.25 },
  lowTrem: { sample: 'cellosTrem', volume: 0.2, attack: 0.6, release: 1, reverb: 0.5, pan: -0.2 },
  pizzLo: { sample: 'violinsPizz', volume: 0.17, ring: true, reverb: 0.3, pan: -0.3, humanize: { time: 0.005, volume: 0.15 } },
  pizzHi: { sample: 'violinsPizz', volume: 0.17, ring: true, reverb: 0.3, pan: 0.3, humanize: { time: 0.005, volume: 0.15 } },
  pizzTop: { sample: 'violinsPizz', volume: 0.15, ring: true, reverb: 0.3, pan: 0.05, humanize: { time: 0.005, volume: 0.15 } },
  celloPizz: { sample: 'cellosPizz', volume: 0.22, ring: true, reverb: 0.25, pan: -0.15 },
  bass: { sample: 'bassPizz', volume: 0.42, ring: true, reverb: 0.2, humanize: { time: 0.004, volume: 0.1 } },
  // winds and brass
  flute: { sample: 'flute', volume: 0.2, attack: 0.01, release: 0.08, reverb: 0.35, pan: 0.15, humanize: { time: 0.004, volume: 0.1 } },
  trumpets: { ...ORCHESTRA.trumpets, volume: 0.26 },
  hornLo: { ...ORCHESTRA.horns, volume: 0.24 },
  hornHi: { ...ORCHESTRA.horns, volume: 0.2, pan: 0.15 },
  trombone: { ...ORCHESTRA.trombones, volume: 0.26 },
  braam: { ...ORCHESTRA.braam, volume: 0.45 },
  // the stab on the shard's climax chord (fast to speak, where the pads aren't)
  stabTpt: { ...ORCHESTRA.trumpets, volume: 0.26, attack: 0.01 },
  stabHorn: { ...ORCHESTRA.horns, volume: 0.26, attack: 0.01, pan: -0.15 },
  stabBone: { ...ORCHESTRA.trombones, volume: 0.28, attack: 0.01 },
  stabVoxLo: { sample: 'choir', volume: 0.24, attack: 0.02, release: 0.5, reverb: 0.55, pan: -0.15 },
  stabVoxHi: { sample: 'choir', volume: 0.24, attack: 0.02, release: 0.5, reverb: 0.55, pan: 0.15 },
  braamLow: { ...ORCHESTRA.braamLow, volume: 0.45 },
  // voices: the roll call's "pre-sent", and the pads
  callVox: { sample: 'choir', volume: 0.32, attack: 0.01, release: 0.12, reverb: 0.5, pan: 0.1, humanize: { time: 0.006, volume: 0.1 } },
  callLow: { sample: 'choir', volume: 0.22, attack: 0.01, release: 0.12, reverb: 0.5, pan: -0.1 },
  choirTune: { sample: 'choir', volume: 0.22, attack: 0.1, release: 0.5, reverb: 0.6 },
  choirLo: { sample: 'choir', volume: 0.12, attack: 0.3, release: 0.6, reverb: 0.55, pan: -0.2 },
  choirMid: { sample: 'choir', volume: 0.12, attack: 0.3, release: 0.6, reverb: 0.55 },
  choirHi: { sample: 'choir', volume: 0.12, attack: 0.3, release: 0.6, reverb: 0.55, pan: 0.2 },
  hum: { sample: 'choir', volume: 0.11, attack: 0.8, release: 1.2, reverb: 0.7, pan: -0.15 },
  humMid: { sample: 'choir', volume: 0.09, attack: 0.8, release: 1.2, reverb: 0.7, pan: 0.15 },
  humHigh: { sample: 'choir', volume: 0.07, attack: 0.8, release: 1.2, reverb: 0.7 },
  // the desk: typewriter keys, a pencil, the stamp, the bell
  // (turned down about 5 dB on 12 November 2026 so it won't grate over a long fight)
  type: { sample: 'typewriter', volume: 0.11, ring: true, reverb: 0.12, pan: 0.3, humanize: { time: 0.006, volume: 0.3 } },
  typeBack: { sample: 'typewriter', volume: 0.13, ring: true, reverb: 0.15, pan: 0.3 },
  pen: { sample: 'penScratch', volume: 0.16, ring: true, reverb: 0.15, pan: -0.35, humanize: { time: 0.008, volume: 0.35 } },
  penLine: { sample: 'penScratch', volume: 0.24, ring: true, reverb: 0.3, pan: -0.25 },
  stamp: { ...ORCHESTRA.taiko, volume: 0.4 },
  stampClap: { sample: 'claps', drum: 'sample', volume: 0.2, ring: true, reverb: 0.2, pan: -0.05, humanize: { time: 0.004, volume: 0.15 } },
  ding: { sample: 'rideBell', drum: 'sample', volume: 0.2, ring: true, reverb: 0.35, pan: 0.35 },
  // drums
  kick: { ...ORCHESTRA.bassDrum, volume: 0.45, humanize: { time: 0.003, volume: 0.12 } },
  snare: { ...ORCHESTRA.snare, volume: 0.22 },
  taiko: { ...ORCHESTRA.taikoHigh, volume: 0.3 },
  roll: { ...ORCHESTRA.roll, volume: 0.18 },
  hats: { sample: 'hatClosed', drum: 'sample', volume: 0.13, ring: true, reverb: 0.15, pan: 0.25, humanize: { time: 0.004, volume: 0.3 } },
  hatOpen: { sample: 'hatOpen', drum: 'sample', volume: 0.12, ring: true, reverb: 0.2, pan: 0.25 },
  timpani: { ...ORCHESTRA.timpani, volume: 0.4 },
  timpRoll: { ...ORCHESTRA.timpRoll, volume: 0.3 },
  crash: { ...ORCHESTRA.crash, volume: 0.28 },
  gong: { ...ORCHESTRA.gong, volume: 0.38 },
  impact: { ...ORCHESTRA.impact, volume: 0.55 },
  swell: { ...ORCHESTRA.swell, volume: 0.28 },
};

// The harpsichord's top octave doubles it everywhere.
const sections = { quill, rollCall, ledger, lateFees, recount, margins, shard, home, present };
for (const section of Object.values(sections)) if (section.harpsi) section.harpsiHi = [...section.harpsi];

// Every track in every section, so sections line up.
for (const section of Object.values(sections)) {
  const length = Object.values(section)[0].length;
  for (const track of Object.keys(instruments)) section[track] ??= rest(length);
}

export const TALLY_BATTLE_THEME = {
  title: SONG,
  bpm: 150,
  stepsPerBeat: 4,
  volume: 1.1,
  instruments,
  sections: settleNotes(instruments, sections),
  order: ['quill', 'rollCall', 'ledger', 'lateFees', 'recount', 'margins', 'shard', 'home'],
  loopFrom: 1,
  // MERCY: only the spare scene goes here (by name); it plays once and rings out.
  coda: ['present'],
};
