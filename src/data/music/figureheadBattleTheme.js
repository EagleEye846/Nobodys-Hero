import { melody, midi, transpose } from '../../audio/notation.js';
import { ORCHESTRA } from './parts/usurper.js';
import { SHANTY, NO_PORT, GHOST_FIRST } from './parts/ghostShip.js';
import { starFall, starIn, starNotes, STAR_LENGTHS, STAR_LENGTHS_WALTZ } from './parts/starGuardians.js';
import { SAMPLE_SETS } from '../../audio/sampleSets.js';

// "Star Aboard": the fight with the Figurehead, the carved woman on the bow
// of the ghost ship, woken a hundred years ago by a star shard lodged in her
// wood. She's the optional guardian of the shard, and the hardest fight in
// chapter 5. She laughs, she spins, she never stops. She may be the real
// reason the Fair Return never made port.
//
// So the song is a merry-go-round gone mad: a fast waltz in C minor on a
// steam calliope (flute and clarinet, pipes out of true, wheezing), an
// out-of-tune tack piano, an oom-pah-pah band (tuba on the one, horns and
// pizzicato on the two and three), and star glitter over all of it
// (glockenspiel, glass, chimes). It keeps flipping its feet: the waltz's
// three beats against a jig's two (6/8), bars of seven and five, and twice
// the carousel spins up, every bar shorter than the one before, until it
// flies off.
//
// THREE TUNES:
//   THE FALLING STAR (parts/starGuardians.js, C6 G5 F#5 C5): hers, and every
//     star guardian's after her. Wherever it falls, its own bells ring it
//     (tubular bells and glockenspiel, in tune: starRing), so it cuts
//     through the carousel every time. It opens the song on a music box
//     over the bells, it is the first and third bars of the hook, it is the
//     call she answers with a laugh, it goes round in canon at half speed in
//     the quiet middle and comes back faster and faster, then it gets a
//     whole section of its own (stardance: the star is the tune, sequenced,
//     answered, crossed with its own tritone twin, slowed and sped at
//     once), and at the very end the whole band plays it in its own rhythm, the
//     diminished chord under the slip: the only thing that ever lands on
//     the home C the ship's shanty can't reach.
//   THE HOOK (8 bars): the star falls, then spins back up around the fifth
//     (Eb F G Ab G F# G, a carousel horse going round), falls again over F
//     minor, climbs to the leading note, and tumbles down chromatically: her
//     laugh. Chords Cm Ab Fm G.
//   "PORT TOMORROW" (parts/ghostShip.js): the ship's own shanty, warped.
//     The calliope plays it at the carousel's speed over a jig, so its 3/4
//     drags against the band's 6/8; the hope phrase falls short (B, not C),
//     the third phrase is wrenched up a tritone into F sharp minor, and the
//     last stops on the B, as it always does on the ship. Then her star
//     falls and lands on the C. She has port; they never will.
//
// HER LAUGH is the rhythm under everything: HA . . ha . ha-ha . ha-ha
// (LAUGH_RHYTHM), sung staccato by the choir, a semitone lower each "ha",
// and clapped and drummed in the fast sections.
//
// C minor, with the tritone (F sharp minor) as the other key: the slip in
// the star motif made into a whole key. The one borrowed colour is the
// Neapolitan D flat in the spin. Real recordings throughout: flute, clarinet,
// grand piano, glockenspiel, glass, chimes, bowed vibraphone, harp, solo
// violin, violins (and pizzicato, spiccato), violas, cellos, basses, horns,
// trumpets, trombones, tuba, timpani, the game's choir, bass drum, snare,
// hi-hats, ride, claps, tenor drum, cymbals, gong, and the ship's timbers.
// The calliope, the tack piano, the music box and the laugh are all played
// out of tune on purpose (detune, drift, wow, sag).
//
// 3/4 at 180 crotchets a minute, one step a 16th: a waltz bar is 12 steps,
// exactly one second. The intro plays once (8 bars of the carousel winding
// up, 12.75 s); then it loops from 'carousel', about 3m18s:
//
//   section     bars  time          what happens
//   windup      8     (once, 13s)   a music box plays the star, then runs
//                                   down flat; the band starts slowly and
//                                   speeds up (each bar shorter); she
//                                   giggles; the calliope's pickup
//   carousel    24    0:00-0:24     THE HOOK (phase 1). On the calliope and
//                                   tack piano over the band; then everyone
//                                   (violins, trumpets, horns, trombones,
//                                   racing strings, the box); then the
//                                   call and laugh: the star from C, E flat,
//                                   F sharp, each answered by her laugh; a
//                                   run up, a hit, and a beat of nothing
//   port        24    0:24-0:48     PORT TOMORROW, warped, over a jig (6/8
//                                   against the shanty's 3/4); stops on the
//                                   B; her star lands on C. Then the crew
//                                   sings it slow and sagging while the
//                                   strings spin around them
//   spin        25    0:48-1:13     THE MERRY-GO-ROUND LOSES ITS FEET:
//                                   (phase 2) bars of 3/4 and 6/8 in turn,
//                                   then four of 7/8, six of 5/8 (the star
//                                   squeezed into each, the Neapolitan D
//                                   flat), two of 9/8, then the spin-up:
//                                   bars of 12, 11, 10... 6 steps, the star
//                                   falling faster each time; a gong, and
//                                   one laugh in the silence
//   starfall    32    1:13-1:45     THE TURN (37% in): F sharp minor, the
//                                   tritone away. The star at half speed in
//                                   canon (box, harp, the box running down),
//                                   a choir humming, glass; then her own
//                                   melody, slow and lovely and a little
//                                   wrong (a C major chord under an F
//                                   sharp), solo violin, then the violins
//                                   and choir; then the build: the star on
//                                   the horns at half speed, the trumpets,
//                                   the violins, then five voices tumbling
//                                   in canon in 16ths; rolls, a swell
//   stardance   26    1:45-2:11     THE STAR'S OWN DANCE (53% in): nothing
//                                   but the four notes, full band. F sharp
//                                   minor: the calliope calls the star, the
//                                   low brass answer with it, up a minor
//                                   third, then twice as fast round the
//                                   diminished chord (C, E flat, F#, A), the
//                                   whole band, two quick stars on G. C
//                                   minor in 6/8: the star in a jig's rhythm
//                                   on every chord while the crew sings Port
//                                   Tomorrow in 3/4, the trumpets echoing it
//                                   a beat behind; her laugh. Back in 3/4:
//                                   the star on C answered by the star on F
//                                   sharp (each one's slip is the other's
//                                   home note), then both at once; round the
//                                   diminished chord in 16ths; the climax,
//                                   the star at half speed in the tuba and
//                                   trombones under it four times over on
//                                   top (gong); one more on C sharp, her
//                                   laugh, a roll into the drop
//   masquerade  24    2:11-2:35     THE DROP (phase 3): the hook in F sharp
//                                   minor, down low and heavy, over the jig;
//                                   then with the shanty under it on the
//                                   crew and cellos; then the call and
//                                   laugh climbing F sharp, A, C, and a
//                                   run up to G
//   chaos       43    2:35-3:18     EVERYTHING AT ONCE (phase 4), home in
//                                   C minor: the hook with the crew singing
//                                   the shanty against it; the hook again
//                                   flipping key and meter every two bars;
//                                   Port Tomorrow at full size, stopping on
//                                   the B under her laugh; a staircase of
//                                   falling stars in canon over a bass
//                                   climbing C to G; the last spin-up; the
//                                   whole band plays the star and it lands
//                                   on C; her laugh. Round to carousel.
//
// The fight can start a section for each phase (`musicFrom` in the enemy
// file): 'spin', 'masquerade', 'chaos'; 'starfall' too, for a quiet turn.
// spin, masquerade and chaos open on a full bar, so the cut lands clean.
// Reference for the shape: a new idea every 25 to 35 seconds, the turn a
// little before halfway and the star's own dance just after it, home before
// the loop, like "Salt in the Wound".

const SONG = 'Star Aboard';
const BAR = 12;
const s16 = (text) => melody(text, 1);   // one token a 16th
const s8 = (text) => melody(text, 2);    // one token an 8th
const rest = (n) => Array(n).fill('.');
const up = transpose;
const sum = (list) => list.reduce((a, b) => a + b, 0);

// --- chords and voicings ---
const PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
// [root, third, fifth] as pitch classes: 'Cm', 'Ab', 'F#m', 'Bdim'.
function chordOf(symbol) {
  const m = symbol.match(/^([A-G])([#b]?)(m|dim)?$/);
  if (!m) throw new Error(`${SONG}: can't read the chord '${symbol}'`);
  const root = (PC[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + 12) % 12;
  return [root, (root + (m[3] ? 3 : 4)) % 12, (root + (m[3] === 'dim' ? 6 : 7)) % 12];
}
// The lowest note of pitch class `pc` at or above `lo`.
const near = (pc, lo) => lo + (((pc - lo) % 12) + 12) % 12;
// Timpani: every root between F2 and E3.
const timpRoot = (pc) => near(pc, 41);

// --- the score: a section is built by laying parts on silent tracks ---
function score(name, length) {
  const tracks = {};
  const api = {
    length,
    put(track, at, steps) {
      if (at + steps.length > length) throw new Error(`${SONG} ${name}: '${track}' at step ${at} (${steps.length} steps) runs past ${length}`);
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

// --- bars: { len, chord, groups } ---
// How a bar's beats fall, by its length in 16ths.
function groupsFor(len) {
  const table = { 6: [2, 2, 2], 7: [3, 2, 2], 8: [3, 3, 2], 9: [3, 3, 3], 10: [4, 6], 11: [4, 4, 3], 12: [4, 4, 4], 14: [4, 4, 6], 15: [5, 5, 5], 18: [6, 6, 6], 24: [8, 8, 8] };
  if (!table[len]) throw new Error(`${SONG}: no beats for a bar of ${len}`);
  return table[len];
}
const barsOf = (chords, len = 12, groups) => chords.split(/\s+/).filter(Boolean).map((chord) => ({ len, chord, groups }));
const jigBars = (chords) => barsOf(chords, 12, [6, 6]);
const lengthOf = (bars) => sum(bars.map((b) => b.len));

// A note held `len` steps on a track (only over silence).
function note(track, at, n, len) {
  if (at >= track.length) return;
  track[at] = n;
  for (let k = 1; k < len && at + k < track.length; k++) if (track[at + k] === '.') track[at + k] = '-';
}

// The band, bar by bar. Waltz: oom on the first beat (tuba, basses, kick,
// timpani), pah on the others (horns, pizzicato, tack piano, rim). Jig
// (feel: 'jig'): oom on each dotted beat, root then fifth, pah on the 8ths
// between. The tuba swaps root and fifth bar to bar unless `alt: false`.
function band(bars, o = {}) {
  const length = lengthOf(bars);
  const out = {};
  const T = (name) => (out[name] ??= rest(length));
  const jig = o.feel === 'jig';
  let at = 0;
  bars.forEach((bar, i) => {
    const groups = bar.groups ?? groupsFor(bar.len);
    const [root, third, fifth] = chordOf(bar.chord);
    let g = at;
    groups.forEach((n, gi) => {
      const oom = gi === 0 || jig || o.oomAll;
      if (oom) {
        const onFifth = jig ? gi % 2 === 1 : o.alt !== false && i % 2 === 1;
        const low = onFifth ? near(fifth, 28) : near(root, 33);
        if (o.tuba !== false) note(T('tuba'), g, low, Math.min(n, 3));
        if (o.basses !== false) note(T('basses'), g, low, 2);
        if (o.timp && (gi === 0 || jig)) note(T('timpani'), g, timpRoot(onFifth ? fifth : root), 1);
        if (o.kick) T('kick')[g] = 'x';
      }
      if (o.kick === 'all') T('kick')[g] = 'x';
      const pahs = jig ? [g + 2, g + 4].filter((p) => p < g + n) : o.oomAll ? [g + Math.floor(n / 2)] : gi === 0 ? [] : [g];
      for (const p of pahs) {
        if (o.pah) { note(T('pahLo'), p, near(third, 51), 2); note(T('pahHi'), p, near(fifth, 51), 2); }
        if (o.pizz) { note(T('pizzLo'), p, near(third, 62), 1); note(T('pizzHi'), p, near(fifth, 62), 1); }
        if (o.tack) { note(T('tackLo'), p, near(third, 55), 2); note(T('tackHi'), p, near(fifth, 55), 2); }
        if (o.rim) T('rim')[p] = 'x';
        if (o.snare === 'pah') T('snare')[p] = 'x';
      }
      g += n;
    });
    if (o.snare === 'back') T('snare')[at + (jig ? 6 : 4)] = 'x';
    if (o.hats) for (let k = 0; k < bar.len; k += 2) T('hats')[at + k] = 'x';
    if (o.ride) for (let k = 0; k < bar.len; k += 2) T('ride')[at + k] = 'x';
    if (o.open) T('hatOpen')[at + bar.len - 2] = 'x';
    at += bar.len;
  });
  return out;
}

// Held chords, a bar each: one track per voice ([root, third, fifth]), each
// voice the lowest of its pitch class at or above `lo`.
function pads(bars, names, lo) {
  const out = {};
  names.forEach((name, v) => {
    out[name] = bars.flatMap((bar) => {
      const pc = chordOf(bar.chord)[v];
      return [near(pc, lo), ...Array(bar.len - 1).fill('-')];
    });
  });
  return out;
}
// A held bass note a bar.
const roots = (bars, lo) => bars.flatMap((bar) => [near(chordOf(bar.chord)[0], lo), ...Array(bar.len - 1).fill('-')]);

// Racing 16ths up and down each chord, from `lo`.
function race(bars, lo, shape = [0, 1, 2, 3, 4, 3, 2, 1]) {
  return bars.flatMap((bar) => {
    const [r, t, f] = chordOf(bar.chord);
    const base = near(r, lo);
    const tones = [base, near(t, base), near(f, base)];
    const ladder = [...tones, ...tones.map((n) => n + 12), tones[0] + 24];
    return Array.from({ length: bar.len }, (_, k) => ladder[shape[k % shape.length]]);
  });
}
// The carousel horse going round: the chord's fifth, a semitone under, the
// fifth, a semitone over, in 16ths (or 8ths with `every: 2`).
function spinning(bars, lo, every = 1) {
  const turn = [0, -1, 0, 1];
  return bars.flatMap((bar) => {
    const f = near(chordOf(bar.chord)[2], lo);
    return Array.from({ length: bar.len }, (_, k) => (k % every ? '.' : f + turn[(k / every) % 4]));
  });
}
// Star glitter: high chord tones scattered on the off 16ths.
function sparkle(bars, lo = 89, places = [1, 4, 7, 10]) {
  return bars.flatMap((bar, i) => {
    const [r, t, f] = chordOf(bar.chord);
    const tones = [near(r, lo), near(t, lo), near(f, lo), near(r, lo) + 12];
    const out = rest(bar.len);
    places.filter((p) => p < bar.len).forEach((p, k) => { out[p] = tones[(k + i) % 4]; });
    return out;
  });
}

// --- her laugh: HA . . ha . ha-ha . ha-ha, a semitone lower each "ha" ---
const LAUGH_RHYTHM = [0, 3, 5, 6, 8, 9];
function laugh(top, len = 12) {
  const hi = typeof top === 'number' ? top : midi(top);
  const out = rest(len);
  LAUGH_RHYTHM.forEach((p, i) => { if (p < len) out[p] = hi - i; });
  if (len > 1) out[1] = '-';
  return out;
}
const laughHits = (len = 12) => {
  const out = rest(len);
  LAUGH_RHYTHM.forEach((p) => { if (p < len) out[p] = 'x'; });
  return out;
};

// The cymbal swell is loudest 3.18 s in (sampleSets.js): 38 steps here, so
// it's laid 38 steps before the downbeat it swells into.
const SWELL = [60, ...Array(37).fill('-')];

// Stretch a line by `k`: each step lasts k steps.
const stretch = (steps, k) => steps.flatMap((s) => [s, ...Array(k - 1).fill(s === '.' ? '.' : '-')]);
// Shift a line later by `by` steps, keeping its length.
const late = (steps, by) => [...rest(by), ...steps.slice(0, steps.length - by)];

// THE STAR'S OWN BELLS. Wherever the star falls, the tubular bells ring it
// in the tune's rhythm and the glockenspiel rings it two octaves over, both
// in tune and clear of the band: the one sound every star guardian shares,
// so the star is never lost under the carousel. Each only plays where all
// four notes sit on its recordings (an octave jump would break the shape):
// the bells take any key from C to F sharp, the glockenspiel most others.
const fits = (sample, notes) => notes.every((n) => SAMPLE_SETS[sample].notes.some((r) => Math.abs(r - n) <= 2));
// The pitch class of a note: 60, 'C5' or just 'C'.
const pcOf = (tonic) => {
  const n = typeof tonic === 'number' ? tonic : midi(/\d$/.test(tonic) ? tonic : `${tonic}4`);
  return ((n % 12) + 12) % 12;
};
function starRing(s, at, tonic, { lengths = STAR_LENGTHS_WALTZ, unit = 2, bells = true, glock = true } = {}) {
  const pc = pcOf(tonic);
  const fall = (t) => starFall(t, { lengths, unit });
  const low = [near(pc, 58), near(pc, 58) - 12].find((t) => fits('chimes', starNotes(t)));
  const high = [near(pc, 84), near(pc, 72), near(pc, 96)].find((t) => fits('glock', starNotes(t)));
  if (bells && low != null) s.put('starBells', at, fall(low));
  if (glock && high != null) s.put('starGlock', at, fall(high));
  return s;
}
// A line moved by whole octaves (the first of `shifts` that works) so every
// note sits on the instrument's recordings and the shape stays whole.
const inReach = (sample, line, shifts = [0, -12, 12, -24, 24]) => {
  const notes = line.filter((n) => typeof n === 'number');
  const k = shifts.find((d) => fits(sample, notes.map((n) => n + d)));
  return up(line, k ?? shifts[0]);
};
// The same, bar by bar: each bar of a spin-up moved on its own, so a star
// that climbs out of reach in one bar doesn't drag the others with it.
const reachEach = (sample, lines, shifts) => lines.flatMap((line) => inReach(sample, line, shifts));
// The hook's two star bars (its first and third), rung.
const ringHook = (s, at, tonic) => starRing(starRing(s, at, tonic), at + 2 * BAR, tonic);
// A line over the hook with its star bars left out (the music box and the
// glitter step aside there, so the star rings alone at the top).
const noStar = (line, bars = [0, 2]) => line.map((n, i) => (bars.includes(Math.floor(i / BAR)) ? '.' : n));

// ------------------------------------------------------------- the tunes
// THE HOOK, one 3/4 bar a line.
const HOOK = s8(`
  C6 G5 F#5 - C5 -
  Eb5/F5 G5 Ab5 G5 F#5 G5
  C6 G5 F#5 - C5 -
  Eb5/F5 G5 Ab5 Bb5 B5 -
  C6 - Eb6 D6 C6 B5
  Ab5 - C6 B5 Ab5 G5
  F5/G5 Ab5 B5 D6 F6 -
  Eb6/D6 Db6/C6 B5 . G5 G5
`);
const HOOK_CHORDS = 'Cm Ab Fm G Cm Ab Fm G';
const hookBar = (b) => HOOK.slice(b * BAR, (b + 1) * BAR);
// The star in one 3/4 bar: quick, quick, a breath, long.
const star = (tonic) => starFall(tonic, { lengths: STAR_LENGTHS_WALTZ });
// The run up a G7, in 16ths, to the top.
const RUN_G = s16('G4 B4 D5 F5 G5 B5 D6 F6 G6 - - -');

// THE SHANTY, warped: true, then the hope falling short, then wrenched up a
// tritone, then stopping on the B (16 bars).
const SHANTY_WARPED = [
  ...s8(SHANTY[0]),
  ...s8(GHOST_FIRST).slice(4 * BAR),
  ...up(s8(SHANTY[2]), 6),
  ...s8(NO_PORT),
];
const SHANTY_WARPED_CHORDS = 'Cm Ab Eb G Cm Ab Fm Eb D Bm F#m C# Cm Ab G G';

// HER MELODY, for the quiet middle: F sharp minor, slow, a little wrong.
const ARIA = s8(`
  F#6 - - - C#6 -    C6 - - - - B5      A5 - G#5 - F#5 -   G#5 - - - - -
  F#6 - - - C#6 -    C6 - - - D6 E6     F#6 - E6 - D6 C#6  C#6 - - - - -
  A5 - - - E6 -      D6 - - - C#6 B5    C#6 - - - A5 F#5   G#5 - - - E5 -
  F#5 - A5 - C6 -    B5 - - - D6 -      C#6 - - - B5 G#5   C#6 - - - - -
`);
const ARIA_CHORDS = 'F#m D Bm C# F#m D Bm C# A D F#m E C Bm C# C#';

// ------------------------------------------------------------ windup (intro)
const windup = (() => {
  const lens = [24, 24, 24, 24, 18, 15, 12, 12];
  const starts = lens.map((_, i) => sum(lens.slice(0, i)));
  const length = sum(lens);
  const s = score('windup', length);
  const chords = ['Cm', 'Cm', 'Cm', 'Ab', 'Fm', 'G', 'Fm', 'G'];
  const bars = lens.map((len, i) => ({ len, chord: chords[i] }));
  // the music box, alone: the star in its own rhythm (quick, quick, a
  // breath, long), the bells under it; then again, running down
  const slowStar = starFall('C6', { unit: 3 });
  s.put('box', 0, slowStar).put('boxSag', starts[1], slowStar);
  starRing(s, 0, 'C', { lengths: STAR_LENGTHS, unit: 3, glock: false });
  s.put('lowTrem', 0, [midi('C3'), ...Array(2 * 24 - 1).fill('-')]);
  s.put('hum', 0, [midi('G3'), ...Array(2 * 24 - 1).fill('-')]);
  s.put('creak', 10, [60]).put('creak', starts[1] + 14, [63]);
  // the band starts, slowly, and speeds up
  s.add(band(bars.slice(2, 6), { pizz: true, rim: true, alt: true }), starts[2]);
  s.put('box', starts[2], [...stretch(up(hookBar(0), 12), 2), ...stretch(hookBar(1), 2)]);
  starRing(s, starts[2], 'C', { unit: 4, glock: false });
  s.put('glitter', starts[2], sparkle(bars.slice(2, 6), 89, [3, 9, 15, 21]));
  // she giggles, quicker each time
  s.put('laughVox', starts[4], laugh('G5', 18));
  s.put('laughVox', starts[5] + 2, laugh('Bb5', 12));
  // full speed: the pickup into the hook
  s.add(band(bars.slice(6), { pizz: true, tack: true, rim: true, kick: true, hats: true }), starts[6]);
  s.put('calliope', starts[6], hookBar(6)).put('calliope', starts[7], hookBar(7));
  s.put('reed', starts[6], up([...hookBar(6), ...hookBar(7)], -12));
  s.put('roll', starts[7], Array(BAR).fill('x'));
  s.put('swell', length - 38, SWELL);
  return s.done();
})();

// ------------------------------------------------------- carousel (phase 1)
const carousel = (() => {
  const s = score('carousel', 24 * BAR);
  const hook = barsOf(HOOK_CHORDS);
  // 1-8: the calliope and the tack piano, the band
  s.add(band(hook, { tack: true, pizz: true, kick: true, rim: true, hats: true, open: true }));
  s.put('calliope', 0, HOOK).put('reed', 0, up(HOOK, -12)).put('tack', 0, HOOK).put('tack2', 0, HOOK);
  s.put('glitter', 0, noStar(sparkle(hook)));
  ringHook(s, 0, 'C');
  s.hit('crash', 0);
  // 9-16: everyone
  const B2 = 8 * BAR;
  s.add(band(hook, { pah: true, pizz: true, kick: true, snare: 'pah', hats: true, timp: true, open: true }), B2);
  s.put('calliope', B2, HOOK).put('violins', B2, HOOK).put('trumpets', B2, up(HOOK, -12));
  s.put('trombone', B2, up(HOOK, -24));
  s.put('box', B2, noStar(up(HOOK, 12))).put('race', B2, race(hook, 67));
  ringHook(s, B2, 'C');
  // the star bars hit harder: the low brass bite on the slip
  for (const b of [0, 2]) s.put('horns', B2 + b * BAR + 4, [midi('A3'), '-', '-', '-']).put('pahLo', B2 + b * BAR + 4, [midi('Eb3'), '-']);
  s.add(pads(hook, ['choirLo', 'choirMid', 'choirHi'], 55), B2);
  s.hit('crash', B2).hit('impact', B2);
  // 17-24: the call and the laugh
  const B3 = 16 * BAR;
  const tag = barsOf('Cm Cm Eb Eb F#m F#m G G');
  s.add(band(tag.slice(0, 7), { pah: true, pizz: true, kick: true, snare: 'pah', hats: true, timp: true }), B3);
  [['C5', 'G5'], ['Eb5', 'Bb5'], ['F#5', 'C#6']].forEach(([tonic, top], k) => {
    const at = B3 + k * 2 * BAR;
    s.put('violins', at, inReach('violins', star(tonic), [0, -12])).put('calliope', at, star(tonic)).put('trumpets', at, up(star(tonic), -12));
    s.put('trombone', at, inReach('trombone', star(tonic), [-24, -36, -12]));
    starRing(s, at, tonic);
    s.put('laughVox', at + BAR, laugh(top)).put('giggle', at + BAR, up(laugh(top), 12)).put('claps', at + BAR, laughHits());
  });
  s.put('violins', B3 + 6 * BAR, RUN_G).put('calliope', B3 + 6 * BAR, RUN_G).put('race', B3 + 6 * BAR, RUN_G);
  s.put('trumpets', B3 + 6 * BAR, [midi('G4'), ...Array(11).fill('-')]).put('horns', B3 + 6 * BAR, [midi('B3'), ...Array(11).fill('-')]);
  s.put('roll', B3 + 6 * BAR, Array(BAR).fill('x'));
  // the hit, and a beat of nothing; she giggles into it
  const hit = B3 + 7 * BAR;
  s.put('tuba', hit, [midi('G2'), '-']).put('basses', hit, [midi('G2'), '-']).put('timpani', hit, [timpRoot(7)]);
  s.put('trumpets', hit, [midi('G5'), '-']).put('horns', hit, [midi('D4'), '-']).put('pahLo', hit, [midi('F3'), '-']).put('pahHi', hit, [midi('B3'), '-']);
  s.put('violins', hit, [midi('B5'), '-']).put('calliope', hit, [midi('G5'), '-']);
  s.hit('kick', hit).hit('crash', hit);
  s.put('laughVox', hit + 2, laugh('D5', 10)).put('giggle', hit + 2, up(laugh('D5', 10), 24));
  return s.done();
})();

// ------------------------------------------------------- port (the shanty)
const port = (() => {
  const s = score('port', 24 * BAR);
  const bars = jigBars(SHANTY_WARPED_CHORDS);
  // 1-15: the calliope's shanty against the jig
  s.add(band(bars.slice(0, 15), { feel: 'jig', tack: true, pizz: true, kick: true, snare: 'back', hats: true }));
  s.put('calliope', 0, up(SHANTY_WARPED, 12)).put('reed', 0, SHANTY_WARPED);
  s.put('tack', 0, up(SHANTY_WARPED, 12)).put('tack2', 0, up(SHANTY_WARPED, 12));
  s.put('shaker', 0, Array(15 * BAR).fill('x'));
  // phrase 3, the tritone: the box comes in, the glitter
  s.put('box', 8 * BAR, up(SHANTY_WARPED.slice(8 * BAR, 12 * BAR), 24));
  s.put('glitter', 8 * BAR, sparkle(bars.slice(8, 12)));
  s.hit('crash', 0).hit('crash', 8 * BAR).hit('gong', 8 * BAR);
  s.add(pads(bars.slice(8, 12), ['choirLo', 'choirMid', 'choirHi'], 55), 8 * BAR);
  s.put('creak', 4 * BAR, [61]).put('creak', 12 * BAR + 6, [60]);
  // bar 16: it stops on the B; her star falls, and lands on C
  const b16 = 15 * BAR;
  const fall = s16('C7 G6 F#6 - C6 - - -');
  s.put('box', b16 + 4, fall);
  starRing(s, b16 + 4, 'C', { lengths: STAR_LENGTHS, unit: 1 });
  s.put('tuba', b16 + 8, [midi('C2'), '-', '-', '-']).put('timpani', b16 + 8, [timpRoot(0)]).hit('impact', b16 + 8);
  // 17-24: the crew sings it, slow and sagging; the strings spin round them
  const B2 = 16 * BAR;
  const slow = barsOf('Cm Cm Ab Ab Eb Eb G G');
  s.add(band(slow, { pizz: true, rim: true, kick: true, hats: true, timp: true }), B2);
  s.put('crew', B2, melody(SHANTY[0], 4)).put('crewLow', B2, up(melody(SHANTY[0], 4), -12));
  s.put('race', B2, spinning(slow, 79));
  s.put('box', B2 + 3 * BAR, up(star('C5'), 12)).put('box', B2 + 7 * BAR, up(star('C5'), 12));
  starRing(s, B2 + 3 * BAR, 'C', { glock: false });
  starRing(s, B2 + 7 * BAR, 'C', { glock: false });
  s.put('laughVox', B2 + 5 * BAR, laugh('Bb5')).put('giggle', B2 + 5 * BAR, up(laugh('Bb5'), 12));
  s.put('roll', B2 + 7 * BAR, Array(BAR).fill('x'));
  s.put('swell', 24 * BAR - 38, SWELL);
  return s.done();
})();

// ----------------------------------------------------------- spin (phase 2)
const spin = (() => {
  const bars = [
    // 3/4 and 6/8 in turn, the hook's first half
    { len: 12, chord: 'Cm', groups: [4, 4, 4] }, { len: 12, chord: 'Ab', groups: [6, 6] },
    { len: 12, chord: 'Fm', groups: [4, 4, 4] }, { len: 12, chord: 'G', groups: [6, 6] },
    // four bars of 7/8
    ...barsOf('Cm Ab Fm G', 14),
    // six of 5/8: the star squeezed in, the Neapolitan
    ...barsOf('Cm Db Cm Db F#m G', 10),
    // two of 9/8
    ...barsOf('Ab G', 18),
    // the spin-up
    ...[12, 11, 10, 9, 8, 7, 6, 6, 6, 6].map((len, i) => ({ len, chord: i % 2 ? 'G' : 'Cm' })),
    // the stop
    { len: 24, chord: 'Cm' },
  ];
  const starts = bars.map((_, i) => sum(bars.slice(0, i).map((b) => b.len)));
  const s = score('spin', lengthOf(bars));
  const lead = [
    ...HOOK.slice(0, 4 * BAR),
    ...s16('C6 - G5 - F#5 - - - C5 - Eb5 - G5 -'),
    ...s16('Ab5 - G5 - F#5 - G5 - Eb6 - D6 - C6 -'),
    ...s16('C6 - G5 - F#5 - - - C5 - F5 - Ab5 -'),
    ...s16('B5 - D6 - F6 - - - Eb6 D6 Db6 C6 B5 -'),
    ...['C5', 'Db5', 'C5', 'Db5', 'F#4', 'G4'].flatMap((t) => starFall(t, { lengths: [2, 2, 4, 2], unit: 1 })),
    ...s16('Ab5 - - G5 F#5 G5 Eb6 - - D6 C6 B5 Ab5 - - G5 F#5 G5'),
    ...s16('B5 - - D6 C6 B5 F6 - - Eb6 D6 Db6 C6 - B5 - - -'),
  ];
  const spinUp = bars.slice(16, 26);
  const spinAt = starts[16];
  const spinBars = spinUp.map((bar, i) => starIn(i % 2 ? 'G4' : 'C5', bar.len).map((n) => (typeof n === 'number' ? n + i : n)));
  const spinLead = spinBars.flat();
  const stopAt = starts[26];
  // the band: waltz, the 7/8s and 5/8s with an oom on every beat
  s.add(band(bars.slice(0, 4), { pah: true, pizz: true, kick: 'all', snare: 'pah', hats: true, timp: true }));
  s.add(band(bars.slice(4, 14), { pah: true, pizz: true, kick: 'all', snare: 'pah', hats: true, timp: true, oomAll: true }), starts[4]);
  s.add(band(bars.slice(14, 16), { feel: 'jig', pah: true, pizz: true, kick: 'all', snare: 'back', ride: true, timp: true }), starts[14]);
  s.add(band(spinUp, { pah: true, pizz: true, kick: 'all', snare: 'pah', hats: true, timp: true, alt: false }), spinAt);
  // the tune: the calliope and violins all through, brass from the 7/8s
  s.put('calliope', 0, lead).put('violins', 0, lead).put('tack', 0, lead.slice(0, starts[4]));
  s.put('trumpets', starts[4], up(lead.slice(starts[4]), -12)).put('horns', starts[4], up(lead.slice(starts[4]), -24));
  s.put('calliope', spinAt, spinLead).put('violins', spinAt, reachEach('violins', spinBars, [0, -12])).put('trumpets', spinAt, up(spinLead, -12));
  s.put('box', spinAt, reachEach('glock', spinBars, [24, 12, 36]));
  s.put('race', 0, race(bars.slice(0, 26), 67));
  s.put('glitter', starts[14], sparkle(bars.slice(14, 16)));
  // the 5/8s: the star rung in each, her laugh clapped against it
  ['C', 'Db', 'C', 'Db', 'F#', 'G'].forEach((t, k) => starRing(s, starts[8 + k], t + '4', { lengths: [2, 2, 4, 2], unit: 1 }));
  for (let b = 8; b < 14; b++) s.put('claps', starts[b] + 4, laughHits(6));
  s.put('laughVox', starts[13], laugh('G5', 10)).put('giggle', starts[13], up(laugh('G5', 10), 12));
  s.hit('crash', 0).hit('crash', starts[4]).hit('crash', starts[8]).hit('crash', starts[14]).hit('gong', starts[14]);
  s.add(pads(bars.slice(14, 16), ['choirLo', 'choirMid', 'choirHi'], 55), starts[14]);
  // the spin-up: rolls, a swell, the choir climbing
  s.put('timpRoll', spinAt, [timpRoot(0), ...Array(stopAt - spinAt - 1).fill('-')]);
  s.put('roll', starts[20], Array(stopAt - starts[20]).fill('x'));
  s.put('choirHi', spinAt, [midi('G4'), ...Array(stopAt - spinAt - 1).fill('-')]);
  s.put('choirMid', spinAt, [midi('Eb4'), ...Array(stopAt - spinAt - 1).fill('-')]);
  s.put('swell', stopAt - 38, SWELL);
  // the stop: one blow, and one laugh in the silence
  s.put('tuba', stopAt, [midi('C2'), '-', '-']).put('basses', stopAt, [midi('C2'), '-']).put('timpani', stopAt, [timpRoot(0)]);
  s.put('trumpets', stopAt, [midi('C5'), '-']).put('horns', stopAt, [midi('G3'), '-']).put('trombone', stopAt, [midi('Eb3'), '-']);
  s.put('braamLow', stopAt, [midi('C2'), ...Array(11).fill('-')]);
  s.hit('gong', stopAt).hit('impact', stopAt).hit('crash', stopAt);
  s.put('laughVox', stopAt + 6, laugh('A5')).put('creak', stopAt + 20, [65]);
  return s.done();
})();

// ------------------------------------------------- starfall (the pivot)
const starfall = (() => {
  const s = score('starfall', 32 * BAR);
  const quiet = barsOf('F#m D Bm C# F#m D Bm C#');
  const aria = barsOf(ARIA_CHORDS);
  const build = barsOf('F#m F#m D D Bm Bm C# C#');
  // 1-8: the box alone, the choir humming, glass
  // the star at half speed, in its own rhythm, and in canon with itself:
  // the box, the harp two bars behind, the box running down two more behind
  const slowStar = starFall('F#5', { unit: 4 });
  s.put('box', 0, slowStar).put('harp', 2 * BAR, up(slowStar, -12)).put('boxSag', 4 * BAR, slowStar);
  s.add(pads(quiet, ['hum', 'humMid'], 52));
  s.put('lowTrem', 0, roots(quiet, 40));
  s.put('glass', 0, sparkle(quiet, 75, [0, 3, 6, 9]));
  s.put('laughFar', 6 * BAR + 4, laugh('C#6', 8));
  s.put('creak', 2 * BAR, [60]).put('creak', 6 * BAR + 6, [64]);
  // 9-24: her melody: solo violin, then the violins and the choir
  const A = 8 * BAR;
  s.put('solo', A, ARIA);
  s.put('violins', A + 8 * BAR, ARIA.slice(8 * BAR)).put('choirTune', A + 8 * BAR, up(ARIA.slice(8 * BAR), -12));
  s.put('box', A + 12 * BAR, up(ARIA.slice(12 * BAR), 12));
  s.put('harp', A, race(aria, 54, [0, 2, 3, 4, 3, 2, 0, 2, 3, 4, 5, 4]));
  s.add(band(aria, { pizz: true, tuba: false, alt: false }), A);
  s.put('basses', A, roots(aria, 33).map((n, i) => (i % BAR === 0 ? n : '.')));
  s.add(pads(aria, ['hum', 'humMid', 'humHigh'], 55), A);
  s.put('cellos', A + 8 * BAR, roots(aria.slice(8), 43));
  // the star under her melody, low, and the bells answering it a bar later
  s.put('trombone', A + 8 * BAR, star('F#3')).put('trombone', A + 12 * BAR, star('F#3'));
  starRing(s, A + 9 * BAR, 'F#', { glock: false });
  starRing(s, A + 13 * BAR, 'F#', { glock: false });
  s.put('timpani', A + 8 * BAR, aria.slice(8).flatMap((bar) => [timpRoot(chordOf(bar.chord)[0]), ...rest(BAR - 1)]));
  s.put('glass', A + 8 * BAR, sparkle(aria.slice(8), 75, [3, 9]));
  // 25-32: the build: pizzicato spinning in 8ths, then spiccato 16ths
  const C = 24 * BAR;
  s.put('pizzHi', C, spinning(build.slice(0, 4), 66, 2)).put('race', C + 4 * BAR, spinning(build.slice(4), 78));
  // the star comes back faster and faster: at half speed on the horns, at
  // its own speed on the trumpets, then the violins; then in 16ths, five
  // voices tumbling in canon a beat apart into its own dance
  s.put('horns', C, starFall('F#2', { unit: 4 }));
  s.put('trumpets', C + 3 * BAR, starFall('F#4')).put('violins', C + 4 * BAR + 6, starFall('F#4'));
  const flick = (t) => starFall(t, { unit: 1 });
  const S = C + 6 * BAR;
  s.put('trumpets', S, flick('F#4')).put('violins', S + 4, flick('F#4')).put('calliope', S + 8, flick('F#5'));
  s.put('starGlock', S + 12, flick('F#6')).put('trumpets', S + 16, flick('F#4'));
  s.add(band(build, { pah: true, kick: true, hats: true, alt: false }), C);
  s.add(pads(build, ['choirLo', 'choirMid', 'choirHi'], 55), C);
  s.put('timpRoll', C + 4 * BAR, [timpRoot(6), ...Array(4 * BAR - 1).fill('-')]);
  s.put('roll', C + 6 * BAR, Array(2 * BAR - 2).fill('x'));
  s.put('swell', 32 * BAR - 38, SWELL);
  return s.done();
})();

// ------------------------------------------- stardance (the star's own turn)
// The star stops being a quote and becomes the tune: 26 bars made of
// nothing but the four notes, played by the whole carousel. Every time it's
// stated the shape is whole (C6 G5 F#5 C5 moved to a key); only its key,
// octave and rhythm change. The slip always gets its own diminished chord
// under it (the horns' pah), so the crack is heard as a chord too.
const stardance = (() => {
  const A = barsOf('F#m F#m A A Cm F#m F#m G');
  const B = jigBars('Cm Ab Eb G Cm Ab Eb G');
  const C = barsOf('Cm F#m Cdim Cdim Cm F#m Cm Cm C# C#');
  const P2 = lengthOf(A);
  const P3 = P2 + lengthOf(B);
  const length = P3 + lengthOf(C);
  const s = score('stardance', length);
  const bar = (n) => (n - 1) * BAR;   // where bar n (1-26) starts
  // the star in a waltz bar; twice in one bar, in 16ths; in a jig bar
  // (quick, quick, quick, long); and at half speed over two bars
  const W = (t) => star(t);
  const Q = (t) => starFall(t, { lengths: STAR_LENGTHS_WALTZ, unit: 1 });
  const JIG = [1, 1, 1, 3];
  const J = (t) => starFall(t, { lengths: JIG });
  const SLOW = { lengths: STAR_LENGTHS_WALTZ, unit: 4 };
  const held = (n) => Array(n).fill('-');
  // the slip's own diminished chord: the minor third and the sixth over the
  // star's tonic, on the horns' pah, for as long as the slip lasts
  const slip = (at, tonic, len = 4) => {
    const pc = pcOf(tonic);
    s.put('pahLo', at, [near(pc + 3, 51), ...held(len - 1)]).put('pahHi', at, [near(pc + 9, 51), ...held(len - 1)]);
  };

  // 1-8, F SHARP MINOR: THE STAR AS A TUNE. The calliope calls, the low brass
  // answer with the same four notes; it climbs a minor third (F#, A), then
  // goes round the diminished chord twice as fast (C, E flat, F#, A: the
  // tritone key on the way), and the whole band plays it home; two quick
  // stars on G turn it to C minor.
  s.add(band(A, { pah: true, pizz: true, tack: true, kick: true, snare: 'pah', hats: true, timp: true, open: true }));
  const leadA = [
    ...W('F#5'), ...rest(BAR), ...W('A5'), ...rest(BAR),
    ...Q('C5'), ...Q('Eb5'), ...Q('F#5'), ...Q('A5'),
    ...W('F#5'), ...Q('G5'), ...Q('G4'),
  ];
  s.put('calliope', 0, leadA).put('reed', 0, up(leadA, -12)).put('tack', 0, leadA).put('tack2', 0, leadA);
  s.put('violins', 0, up(leadA, -12)).put('trumpets', bar(5), up(leadA.slice(bar(5)), -12));
  // the answers: trombones, horns and cellos
  for (const [b, t] of [[2, 'F#3'], [4, 'A2']]) {
    s.put('trombone', bar(b), inReach('trombone', W(t), [0, -12])).put('horns', bar(b), inReach('horns', W(t), [0, -12]));
    s.put('cellos', bar(b), inReach('cellos', W(t), [0, -12]));
    starRing(s, bar(b), t, { glock: false });
    slip(bar(b) + 4, t);
    s.put('claps', bar(b), laughHits());
  }
  for (const [b, t] of [[1, 'F#'], [3, 'A'], [7, 'F#']]) { starRing(s, bar(b), t); slip(bar(b) + 4, t); }
  [['C', 'Eb'], ['F#', 'A'], ['G5', 'G4']].forEach(([t1, t2], k) => {
    const at = bar(5 + k + (k === 2 ? 1 : 0));
    starRing(s, at, t1, { unit: 1 }); starRing(s, at + 6, t2, { unit: 1 });
  });
  // bar 7, everyone
  s.put('trombone', bar(7), W('F#3')).put('horns', bar(7), inReach('horns', W('F#3'), [0, -12])).put('choirBig', bar(7), W('F#4'));
  s.put('race', bar(5), spinning(A.slice(4), 78));
  s.put('glitter', bar(1), noStar(sparkle(A.slice(0, 4)), [0, 2]));
  s.hit('crash', 0).hit('impact', 0).hit('crash', bar(5)).hit('crash', bar(7)).hit('impact', bar(7));
  s.put('braam', 0, [midi('F#2'), ...held(BAR - 1)]);
  s.put('roll', bar(8), Array(BAR).fill('x'));

  // 9-16, C MINOR, THE BAND IN 6/8: the crew sings Port Tomorrow in its 3/4
  // while the calliope plays the star in a jig's rhythm on each chord
  // (C, A flat, E flat, G); then the trumpets answer each star a beat behind,
  // and on the last bar she laughs over the shanty's G.
  s.add(band(B, { feel: 'jig', pah: true, pizz: true, kick: 'all', snare: 'back', ride: true, timp: true }), P2);
  const jigTonics = ['C5', 'Ab4', 'Eb5', 'G4', 'C5', 'Ab4', 'Eb5'];
  const leadB = [...jigTonics.flatMap(J), ...rest(BAR)];
  s.put('calliope', P2, leadB).put('reed', P2, up(leadB, -12)).put('tack', P2, leadB.slice(0, 4 * BAR));
  s.put('violins', P2 + 4 * BAR, inReach('violins', leadB.slice(4 * BAR, 7 * BAR), [0, -12]));
  jigTonics.forEach((t, k) => {
    starRing(s, P2 + k * BAR, t, { lengths: JIG, glock: k < 4 });
    if (k >= 4) s.put('trumpets', P2 + k * BAR + 6, up(J(t), -12));
  });
  const shanty = s8([SHANTY[0], SHANTY[1]].join(' '));
  s.put('crew', P2, shanty).put('crewLow', P2, up(shanty, -12)).put('cellos', P2, up(shanty, -12)).put('trombone', P2, up(shanty, -12));
  s.put('race', P2, race(B, 67)).put('glitter', P2 + 4 * BAR, sparkle(B.slice(4)));
  s.hit('crash', P2).hit('crash', P2 + 4 * BAR);
  const b16 = P2 + 7 * BAR;
  s.put('laughVox', b16, laugh('D6')).put('giggle', b16, up(laugh('D6'), 12)).put('claps', b16, laughHits());
  s.put('roll', b16 + 6, Array(6).fill('x'));

  // 17-26, THE TWO KEYS: the star on C, answered by the star on F sharp, a
  // tritone away, under the calliope's held C (the C is the F sharp star's
  // slip, and the F sharp the C star's). Then both at once, the slips
  // crossing; then round the diminished chord in 16ths; then the climax: the
  // star at half speed in the tuba, trombones and horns, against the star at
  // four times the speed on top. The star falls once more on C sharp, and
  // her laugh turns it into the drop.
  const at = (n) => P3 + (n - 17) * BAR;
  const full = { pah: true, pizz: true, tack: true, kick: 'all', snare: 'pah', ride: true, timp: true, open: true };
  s.add(band(C.slice(0, 6), full), at(17));
  s.add(band(C.slice(6, 8), { ...full, tuba: false, basses: false }), at(23));
  s.add(band(C.slice(8, 9), full), at(25));
  const leadC = [
    ...W('C5'), ...held(BAR), ...W('C5'), ...W('C6'),
    ...Q('C5'), ...Q('Eb5'), ...Q('F#5'), ...Q('A5'),
    ...Q('C5'), ...Q('C5'), ...Q('C5'), ...Q('C5'),
    ...W('C#5'),
  ];
  s.put('calliope', at(17), leadC).put('reed', at(17), up(leadC, -12)).put('tack', at(17), leadC).put('tack2', at(17), leadC);
  const violinsC = [
    ...W('C5'), ...rest(BAR), ...W('C5'), ...W('C5'),
    ...up(leadC.slice(4 * BAR, 6 * BAR), -12),
    ...leadC.slice(6 * BAR, 8 * BAR),
    ...W('C#5'),
  ];
  s.put('violins', at(17), violinsC);
  // the answer a tritone away, then both at once
  for (const n of [18, 19, 20]) {
    s.put('trumpets', at(n), W('F#4')).put('horns', at(n), inReach('horns', W('F#4'), [-12, 0, -24]));
  }
  s.put('choirBig', at(20), W('F#4')).put('trombone', at(20), W('C3')).put('cellos', at(20), W('C3'));
  starRing(s, at(17), 'C'); starRing(s, at(18), 'F#');
  for (const n of [19, 20]) { starRing(s, at(n), 'C', { glock: false }); starRing(s, at(n), 'F#', { bells: false }); }
  for (const [n, t] of [[17, 'C'], [18, 'F#'], [19, 'C'], [20, 'C'], [25, 'C#']]) slip(at(n) + 4, t);
  s.put('trumpets', at(21), up(leadC.slice(4 * BAR, 8 * BAR), -12));
  [['C', 'Eb'], ['F#', 'A']].forEach(([t1, t2], k) => { starRing(s, at(21 + k), t1, { unit: 1 }); starRing(s, at(21 + k) + 6, t2, { unit: 1 }); });
  // the climax: the star at half speed underneath, four times over on top
  s.put('tuba', at(23), starFall('C2', SLOW)).put('trombone', at(23), starFall('C3', SLOW));
  s.put('horns', at(23), starFall('C3', SLOW)).put('cellos', at(23), starFall('C3', SLOW));
  s.put('box', at(23), up(leadC.slice(6 * BAR, 8 * BAR), 12));
  starRing(s, at(23), 'C', { ...SLOW, glock: false });
  for (let k = 0; k < 4; k++) starRing(s, at(23) + 6 * k, 'C', { unit: 1, bells: false });
  slip(at(23) + 8, 'C', 8);
  s.put('braamLow', at(23), [midi('C2'), ...held(2 * BAR - 1)]);
  s.hit('gong', at(23)).hit('impact', at(23));
  // bar 25: everyone, on C sharp
  s.put('trumpets', at(25), W('C#4')).put('trombone', at(25), inReach('trombone', W('C#3'), [0, -12])).put('horns', at(25), W('C#3')).put('choirBig', at(25), W('C#4'));
  starRing(s, at(25), 'C#');
  s.add(pads(C.slice(0, 8), ['choirLo', 'choirMid', 'choirHi'], 55), at(17));
  s.put('race', at(17), race(C.slice(0, 6), 67)).put('glitter', at(21), sparkle(C.slice(4, 6)));
  for (const n of [17, 19, 21, 25]) s.hit('crash', at(n));
  s.hit('impact', at(17)).put('claps', at(20), laughHits()).put('claps', at(22), laughHits());
  s.put('timpRoll', at(24), [timpRoot(0), ...held(BAR - 1)]);
  // bar 26: her laugh, and the roll into the drop
  const b26 = at(26);
  s.put('laughVox', b26, laugh('G#5')).put('giggle', b26, up(laugh('G#5'), 12)).put('claps', b26, laughHits());
  s.put('taikoHigh', b26, laughHits()).put('pizzLo', b26, [midi('E4')]).put('pizzHi', b26, [midi('G#4')]);
  s.put('tuba', b26, [midi('C#2'), '-', '-']).put('basses', b26, [midi('C#2'), '-']).put('timpani', b26, [timpRoot(1)]);
  s.put('roll', b26 + 4, Array(BAR - 6).fill('x')).put('timpRoll', b26 + 4, [timpRoot(1), ...held(BAR - 7)]);
  s.put('braam', b26, [midi('C#2'), ...held(BAR - 3)]);
  s.put('swell', length - 38, SWELL);
  return s.done();
})();

// -------------------------------------------------- masquerade (phase 3)
const masquerade = (() => {
  const s = score('masquerade', 24 * BAR);
  const HOOK_F = up(HOOK, -6);
  const hook = jigBars('F#m D Bm C# F#m D Bm C#');
  const heavy = { feel: 'jig', pah: true, pizz: true, kick: 'all', snare: 'back', hats: true, timp: true };
  // 1-8: the drop
  s.add(band(hook, heavy));
  s.put('trumpets', 0, HOOK_F).put('violins', 0, HOOK_F).put('calliope', 0, up(HOOK_F, 12));
  s.put('horns', 0, up(HOOK_F, -24)).put('trombone', 0, up(HOOK_F, -24));
  s.add(pads(hook, ['choirLo', 'choirMid', 'choirHi'], 54));
  ringHook(s, 0, 'F#');
  s.put('braam', 0, [midi('F#2'), ...Array(2 * BAR - 1).fill('-')]).put('braamLow', 0, [midi('F#1'), ...Array(2 * BAR - 1).fill('-')]);
  s.hit('gong', 0).hit('impact', 0).hit('crash', 0);
  s.put('race', 0, race(hook, 66));
  // 9-16: again, with the shanty under it
  const B2 = 8 * BAR;
  s.add(band(hook, { ...heavy, ride: true, hats: false }), B2);
  s.put('trumpets', B2, HOOK_F).put('violins', B2, HOOK_F).put('calliope', B2, up(HOOK_F, 12)).put('box', B2, noStar(up(HOOK_F, 24)));
  ringHook(s, B2, 'F#');
  const shantyF = up(s8([SHANTY[0], SHANTY[1]].join(' ')), -6);
  s.put('crew', B2, shantyF).put('cellos', B2, shantyF).put('trombone', B2, shantyF);
  s.put('glitter', B2, noStar(sparkle(hook)));
  s.hit('crash', B2).hit('impact', B2);
  // 17-24: the call and the laugh, climbing F#, A, C; then G
  const B3 = 16 * BAR;
  const tag = jigBars('F#m F#m A A C C G G');
  s.add(band(tag.slice(0, 7), heavy), B3);
  [['F#4', 'C#6'], ['A4', 'E5'], ['C5', 'G5']].forEach(([tonic, top], k) => {
    const at = B3 + k * 2 * BAR;
    s.put('trumpets', at, star(tonic)).put('violins', at, inReach('violins', star(tonic), [12, 0])).put('calliope', at, up(star(tonic), 12));
    s.put('horns', at, inReach('horns', star(tonic), [-12, -24]));
    starRing(s, at, tonic);
    s.put('laughVox', at + BAR, laugh(top)).put('giggle', at + BAR, up(laugh(top), 12)).put('claps', at + BAR, laughHits());
    s.hit('crash', at);
  });
  s.put('violins', B3 + 6 * BAR, RUN_G).put('calliope', B3 + 6 * BAR, RUN_G).put('race', B3 + 6 * BAR, RUN_G);
  s.put('trumpets', B3 + 6 * BAR, [midi('G4'), ...Array(11).fill('-')]).put('horns', B3 + 6 * BAR, [midi('B3'), ...Array(11).fill('-')]);
  s.put('choirHi', B3 + 6 * BAR, [midi('B4'), ...Array(2 * BAR - 3).fill('-')]).put('choirMid', B3 + 6 * BAR, [midi('F4'), ...Array(2 * BAR - 3).fill('-')]);
  s.put('roll', B3 + 6 * BAR, Array(2 * BAR - 2).fill('x'));
  s.put('timpRoll', B3 + 6 * BAR, [timpRoot(7), ...Array(2 * BAR - 3).fill('-')]);
  s.put('swell', 24 * BAR - 38, SWELL);
  s.put('braam', B3 + 7 * BAR, [midi('G2'), ...Array(BAR - 3).fill('-')]);
  return s.done();
})();

// ------------------------------------------------------- chaos (phase 4)
const chaos = (() => {
  // 1-8, the hook and the shanty; 9-16, flipping key and feet; 17-24, Port
  // Tomorrow, big; 25-32, the staircase of stars; then the last spin-up
  const hook = barsOf(HOOK_CHORDS);
  const flip = [
    { len: 12, chord: 'Cm' }, { len: 12, chord: 'Ab' },
    { len: 12, chord: 'Bm', groups: [6, 6] }, { len: 12, chord: 'C#', groups: [6, 6] },
    { len: 14, chord: 'Cm' }, { len: 14, chord: 'Ab' },
    { len: 12, chord: 'Fm' }, { len: 12, chord: 'G' },
  ];
  const big = barsOf('Cm Ab Fm Eb Cm Ab G G');
  const stair = barsOf('Cm D Eb E F F# G G');
  const spinUp = [12, 11, 10, 9, 8, 7, 6, 6, 6, 6, 6, 6].map((len, i) => ({ len, chord: i % 2 ? 'G' : 'Cm' }));
  const land = [{ len: 12, chord: 'Cm' }, { len: 12, chord: 'Cm' }, { len: 12, chord: 'Cm' }];
  const P1 = 0;
  const P2 = lengthOf(hook);
  const P3 = P2 + lengthOf(flip);
  const P4 = P3 + lengthOf(big);
  const P5 = P4 + lengthOf(stair);
  const P6 = P5 + lengthOf(spinUp);
  const length = P6 + lengthOf(land);
  const s = score('chaos', length);
  const full = { pah: true, pizz: true, tack: true, kick: 'all', snare: 'pah', ride: true, timp: true, open: true };

  // 1-8: the hook, everyone, and the crew singing the shanty against it
  s.add(band(hook, full), P1);
  s.put('calliope', P1, HOOK).put('violins', P1, HOOK).put('trumpets', P1, up(HOOK, -12)).put('box', P1, noStar(up(HOOK, 12)));
  s.put('tack', P1, HOOK).put('tack2', P1, HOOK);
  ringHook(s, P1, 'C');
  const shanty = s8([SHANTY[0], SHANTY[1]].join(' '));
  s.put('crew', P1, shanty).put('crewLow', P1, up(shanty, -12)).put('trombone', P1, shanty);
  s.put('race', P1, race(hook, 67)).put('glitter', P1, noStar(sparkle(hook)));
  for (let b = 1; b < 8; b += 2) s.put('claps', P1 + b * BAR, laughHits());
  s.hit('gong', P1).hit('impact', P1).hit('crash', P1).hit('crash', P1 + 4 * BAR);
  s.put('braam', P1, [midi('C3'), ...Array(2 * BAR - 1).fill('-')]).put('braamLow', P1, [midi('C2'), ...Array(2 * BAR - 1).fill('-')]);

  // 9-16: the hook again, flipping key and feet
  const flipLead = [
    ...hookBar(0), ...hookBar(1),
    ...up(hookBar(2), -6), ...up(hookBar(3), -6),
    ...s16('C6 - - - Eb6 - D6 - C6 - B5 - G5 -'),
    ...s16('Ab5 - - - C6 - B5 - Ab5 - G5 - F#5 -'),
    ...hookBar(6), ...hookBar(7),
  ];
  s.add(band(flip.slice(0, 2), full), P2);
  s.add(band(flip.slice(2, 4), { ...full, feel: 'jig', snare: 'back' }), P2 + 2 * BAR);
  s.add(band(flip.slice(4), { ...full, oomAll: true }), P2 + 4 * BAR);
  s.put('calliope', P2, flipLead).put('violins', P2, flipLead).put('trumpets', P2, up(flipLead, -12)).put('box', P2, noStar(up(flipLead, 12)));
  s.put('trombone', P2, up(flipLead, -24));
  starRing(s, P2, 'C').hit('crash', P2 + 2 * BAR);
  starRing(s, P2 + 2 * BAR, 'F#');
  s.put('race', P2, race(flip, 67));
  s.add(pads(flip, ['choirLo', 'choirMid', 'choirHi'], 55), P2);
  s.hit('crash', P2).hit('crash', P2 + 2 * BAR).hit('gong', P2 + 2 * BAR).hit('crash', P2 + 4 * BAR);
  s.put('laughVox', P2 + 3 * BAR, laugh('G#5')).put('giggle', P2 + 3 * BAR, up(laugh('G#5'), 12));

  // 17-24: Port Tomorrow at full size; it stops on the B; she laughs
  const portBig = [...s8(SHANTY[1]), ...s8(NO_PORT)];
  s.add(band(big.slice(0, 7), { ...full, tack: false }), P3);
  s.put('violins', P3, up(portBig, 12)).put('trumpets', P3, up(portBig, 12)).put('calliope', P3, up(portBig, 24));
  s.put('choirBig', P3, portBig).put('crewLow', P3, up(portBig, -12)).put('horns', P3, up(portBig, -12)).put('trombone', P3, up(portBig, -12));
  s.put('cellos', P3, up(portBig, -12));
  s.add(pads(big, ['choirLo', 'choirMid'], 52), P3);
  s.hit('crash', P3).hit('gong', P3).hit('impact', P3);
  s.put('bell', P3, [midi('C5')]).put('bell', P3 + 4 * BAR, [midi('C5')]);
  const lastBar = P3 + 7 * BAR;
  s.put('laughVox', lastBar, laugh('B5')).put('giggle', lastBar, up(laugh('B5'), 12)).put('claps', lastBar, laughHits());
  s.put('taikoHigh', lastBar, laughHits()).put('roll', lastBar + 6, Array(6).fill('x'));

  // 25-32: a staircase of falling stars, in canon, over a climbing bass
  const stars = stair.flatMap((bar) => star(near(chordOf(bar.chord)[0], 60)));
  s.add(band(stair, { ...full, tack: false, alt: false }), P4);
  s.put('trumpets', P4, stars).put('calliope', P4, up(stars, 12));
  const hornStars = stair.flatMap((bar) => inReach('horns', star(near(chordOf(bar.chord)[0], 60)), [-12, -24]));
  s.put('violins', P4, late(stars, 4)).put('horns', P4, late(hornStars, 8)).put('cellos', P4, late(up(stars, -12), 6));
  stair.forEach((bar, i) => starRing(s, P4 + i * BAR, chordOf(bar.chord)[0]));
  s.add(pads(stair, ['choirLo', 'choirMid', 'choirHi'], 55), P4);
  s.hit('crash', P4).hit('crash', P4 + 4 * BAR);
  s.put('timpRoll', P4 + 6 * BAR, [timpRoot(7), ...Array(2 * BAR - 1).fill('-')]);

  // the last spin-up: the star falling faster and faster
  const spinBars = spinUp.map((bar, i) => starIn(i % 2 ? 'G4' : 'C5', bar.len).map((n) => (typeof n === 'number' ? n + Math.floor(i / 2) : n)));
  const spinLead = spinBars.flat();
  s.add(band(spinUp, { pah: true, pizz: true, kick: 'all', snare: 'pah', ride: true, timp: true, alt: false }), P5);
  s.put('calliope', P5, spinLead).put('violins', P5, reachEach('violins', spinBars, [0, -12])).put('trumpets', P5, up(spinLead, -12));
  s.put('box', P5, reachEach('glock', spinBars, [24, 12, 36]));
  s.put('horns', P5, reachEach('horns', spinBars, [-24, -12, -36])).put('race', P5, race(spinUp, 67));
  s.put('roll', P5 + 24, Array(P6 - P5 - 24).fill('x'));
  s.put('choirHi', P5, [midi('G4'), ...Array(P6 - P5 - 1).fill('-')]).put('choirMid', P5, [midi('D4'), ...Array(P6 - P5 - 1).fill('-')]);
  s.put('choirLo', P5, [midi('B3'), ...Array(P6 - P5 - 1).fill('-')]);
  s.put('swell', P6 - 38, SWELL);

  // it lands: the whole band plays the star at once, in its own rhythm
  // (quick, quick, a breath, long), with the diminished chord on C under the
  // slip; it lands on C with the gong; then her laugh, going round again
  const BIG = { lengths: STAR_LENGTHS };
  s.put('calliope', P6, starFall('C5', BIG)).put('violins', P6, starFall('C5', BIG)).put('reed', P6, starFall('C4', BIG));
  s.put('trumpets', P6, starFall('C4', BIG)).put('trombone', P6, starFall('C3', BIG)).put('choirBig', P6, starFall('C4', BIG));
  starRing(s, P6, 'C', BIG);
  s.put('horns', P6, [midi('G3'), '-', '-', '-', midi('A3'), '-', '-', '-', midi('G3'), ...Array(7).fill('-')]);
  s.put('choirLo', P6, [midi('Eb4'), ...Array(15).fill('-')]).put('choirMid', P6, [midi('G4'), '-', '-', '-', midi('A4'), '-', '-', '-', midi('G4'), ...Array(7).fill('-')]);
  s.put('pahLo', P6 + 4, [midi('Eb3'), '-', '-', '-']).put('pahHi', P6 + 4, [midi('A3'), '-', '-', '-']);
  s.put('tuba', P6, [midi('C2'), ...Array(15).fill('-')]).put('basses', P6, [midi('C2'), '-']).put('basses', P6 + 8, [midi('C2'), '-']);
  s.put('braamLow', P6, [midi('C2'), ...Array(19).fill('-')]).put('braam', P6 + 8, [midi('C3'), ...Array(11).fill('-')]);
  s.put('timpani', P6, [timpRoot(0)]).put('timpani', P6 + 4, [timpRoot(6)]).put('timpani', P6 + 8, [timpRoot(0)]);
  s.hit('crash', P6).hit('kick', P6).hit('snare', P6 + 2).hit('snare', P6 + 4).hit('kick', P6 + 8);
  s.hit('gong', P6 + 8).hit('impact', P6 + 8).hit('crash', P6 + 8);
  const L = P6 + 2 * BAR;
  s.put('laughVox', L, laugh('G5')).put('giggle', L, up(laugh('G5'), 12)).put('claps', L, laughHits());
  s.put('creak', L + 8, [62]);
  s.put('roll', L + BAR - 4, ['x', 'x', 'x', 'x']);
  return s.done();
})();

// ------------------------------------------------------------ the players
// The recordings: where a note lands too far from any recording (more than
// two semitones), it moves an octave; where no octave works (the
// glockenspiel has no E flat or E anywhere it can reach), the note goes to
// that track's glass twin instead.
const TWINS = { box: 'boxGlass', boxSag: 'boxGlass', glitter: 'glitterGlass' };
function settleNotes(instruments, sections) {
  const reach = (sample, n) => Math.min(...SAMPLE_SETS[sample].notes.map((r) => Math.abs(r - n))) <= 2;
  const settle = (sample, n) => [0, -12, 12, -24, 24].map((k) => n + k).find((m) => reach(sample, m));
  for (const section of Object.values(sections)) {
    const length = Object.values(section)[0].length;
    for (const [track, steps] of Object.entries(section)) {
      const sample = instruments[track]?.sample;
      if (!sample || instruments[track].drum) continue;
      for (let i = 0; i < steps.length; i++) {
        if (typeof steps[i] !== 'number') continue;
        const moved = settle(sample, steps[i]);
        if (moved != null) { steps[i] = moved; continue; }
        const twin = TWINS[track];
        if (!twin) continue;
        const twinSteps = (section[twin] ??= rest(length));
        twinSteps[i] = settle(instruments[twin].sample, steps[i]) ?? steps[i];
        steps[i] = '.';
        for (let k = i + 1; k < steps.length && steps[k] === '-'; k++) { twinSteps[k] = '-'; steps[k] = '.'; }
      }
    }
  }
  return sections;
}

const instruments = {
  // the calliope: a steam organ's pipes, wheezing, out of true
  calliope: { sample: 'flute', volume: 0.36, attack: 0.01, release: 0.08, detune: 9, drift: 14, wow: { cents: 11, rate: 5.6 }, reverb: 0.3, pan: 0.1, humanize: { time: 0.005, volume: 0.12 } },
  reed: { sample: 'clarinet', volume: 0.26, attack: 0.01, release: 0.08, detune: -11, drift: 12, wow: { cents: 9, rate: 5.1 }, reverb: 0.3, pan: -0.15, humanize: { time: 0.005, volume: 0.12 } },
  // the tack piano: two pianos a little apart, beating against each other
  tack: { sample: 'grandPiano', volume: 0.2, release: 0.15, detune: 14, reverb: 0.25, pan: -0.2, humanize: { time: 0.006, volume: 0.15 } },
  tack2: { sample: 'grandPiano', volume: 0.16, release: 0.15, detune: -12, reverb: 0.25, pan: 0.2, humanize: { time: 0.006, volume: 0.15 } },
  tackLo: { sample: 'grandPiano', volume: 0.13, release: 0.1, detune: 12, reverb: 0.2, pan: -0.1, humanize: { time: 0.006, volume: 0.15 } },
  tackHi: { sample: 'grandPiano', volume: 0.13, release: 0.1, detune: -10, reverb: 0.2, pan: 0.1, humanize: { time: 0.006, volume: 0.15 } },
  // the music box, flat and wavering; and one running right down
  box: { sample: 'glock', volume: 0.22, ring: true, detune: -28, drift: 10, wow: { cents: 16, rate: 0.45 }, reverb: 0.55, pan: 0.2, echo: { time: 0.333, feedback: 0.25, mix: 0.2 } },
  boxSag: { sample: 'glock', volume: 0.22, ring: true, detune: -40, drift: 18, sag: 60, wow: { cents: 24, rate: 0.35 }, reverb: 0.6, pan: -0.15, echo: { time: 0.333, feedback: 0.3, mix: 0.25 } },
  boxGlass: { sample: 'glass', volume: 0.16, ring: true, detune: -28, drift: 10, wow: { cents: 16, rate: 0.45 }, reverb: 0.55, pan: 0.2 },
  // star glitter
  glitter: { sample: 'glock', volume: 0.1, ring: true, reverb: 0.65, pan: 0.4, humanize: { time: 0.004, volume: 0.25 } },
  glitterGlass: { sample: 'glass', volume: 0.09, ring: true, reverb: 0.65, pan: -0.4, humanize: { time: 0.004, volume: 0.25 } },
  glass: { sample: 'glass', volume: 0.12, ring: true, detune: 6, reverb: 0.7, pan: -0.3, humanize: { time: 0.006, volume: 0.25 } },
  // the star's own bells (starRing): tubular bells and a glockenspiel, in tune
  starBells: { sample: 'chimes', volume: 0.27, ring: true, reverb: 0.5, pan: -0.05, humanize: { time: 0.003, volume: 0.06 } },
  starGlock: { sample: 'glock', volume: 0.2, ring: true, reverb: 0.5, pan: 0.15, echo: { time: 0.333, feedback: 0.2, mix: 0.15 } },
  bell: { sample: 'chimes', volume: 0.22, ring: true, reverb: 0.65, pan: -0.3 },
  harp: { sample: 'harp', volume: 0.22, ring: true, reverb: 0.5, pan: -0.25, humanize: { time: 0.008, volume: 0.15 } },
  // her laugh: the choir, staccato, giddy, never quite in tune
  laughVox: { sample: 'choir', volume: 0.34, attack: 0.005, release: 0.07, drift: 30, reverb: 0.5, pan: 0.15, humanize: { time: 0.008, volume: 0.2 } },
  laughFar: { sample: 'choir', volume: 0.2, attack: 0.005, release: 0.1, detune: -20, drift: 30, muffle: 1800, reverb: 0.8, pan: -0.35, echo: { time: 0.333, feedback: 0.35, mix: 0.35 } },
  giggle: { sample: 'violinsSpic', volume: 0.2, release: 0.05, drift: 20, reverb: 0.4, pan: -0.2, humanize: { time: 0.005, volume: 0.2 } },
  // voices
  crew: { sample: 'choir', volume: 0.3, attack: 0.03, release: 0.3, detune: -14, drift: 10, sag: 30, reverb: 0.5, pan: -0.1, humanize: { time: 0.012, volume: 0.12 } },
  crewLow: { sample: 'choir', volume: 0.22, attack: 0.03, release: 0.3, detune: -18, drift: 10, sag: 30, reverb: 0.5, pan: 0.15, humanize: { time: 0.012, volume: 0.12 } },
  choirBig: { sample: 'choir', volume: 0.3, attack: 0.08, release: 0.5, reverb: 0.55, pan: 0.05 },
  choirTune: { sample: 'choir', volume: 0.24, attack: 0.15, release: 0.6, reverb: 0.6, pan: -0.05 },
  choirLo: { sample: 'choir', volume: 0.13, attack: 0.3, release: 0.6, reverb: 0.55, pan: -0.2 },
  choirMid: { sample: 'choir', volume: 0.13, attack: 0.3, release: 0.6, reverb: 0.55 },
  choirHi: { sample: 'choir', volume: 0.13, attack: 0.3, release: 0.6, reverb: 0.55, pan: 0.2 },
  hum: { sample: 'choir', volume: 0.12, attack: 0.8, release: 1.2, reverb: 0.7, pan: -0.15 },
  humMid: { sample: 'choir', volume: 0.1, attack: 0.8, release: 1.2, reverb: 0.7, pan: 0.15 },
  humHigh: { sample: 'choir', volume: 0.08, attack: 0.8, release: 1.2, reverb: 0.7 },
  // strings
  solo: { ...ORCHESTRA.soloViolin, volume: 0.42, attack: 0.06, release: 0.6, reverb: 0.55, humanize: { time: 0.01, volume: 0.08 } },
  violins: { ...ORCHESTRA.violins, volume: 0.28 },
  race: { ...ORCHESTRA.race, volume: 0.17 },
  pizzLo: { sample: 'violinsPizz', volume: 0.2, ring: true, reverb: 0.3, pan: -0.3, humanize: { time: 0.005, volume: 0.15 } },
  pizzHi: { sample: 'violinsPizz', volume: 0.2, ring: true, reverb: 0.3, pan: 0.3, humanize: { time: 0.005, volume: 0.15 } },
  cellos: { sample: 'cellos', volume: 0.24, attack: 0.03, release: 0.3, reverb: 0.4, pan: -0.25 },
  lowTrem: { sample: 'cellosTrem', volume: 0.2, attack: 0.8, release: 1, reverb: 0.5, pan: -0.2 },
  basses: { sample: 'bassPizz', volume: 0.4, ring: true, reverb: 0.2, humanize: { time: 0.004, volume: 0.1 } },
  // brass: the oom-pah band, and the big tune
  tuba: { ...ORCHESTRA.tuba, volume: 0.36, release: 0.15, humanize: { time: 0.004, volume: 0.1 } },
  pahLo: { sample: 'horns', volume: 0.2, release: 0.08, reverb: 0.35, pan: -0.15, humanize: { time: 0.005, volume: 0.15 } },
  pahHi: { sample: 'horns', volume: 0.2, release: 0.08, reverb: 0.35, pan: 0.15, humanize: { time: 0.005, volume: 0.15 } },
  trumpets: { ...ORCHESTRA.trumpets, volume: 0.28 },
  horns: { ...ORCHESTRA.horns, volume: 0.32 },
  trombone: { ...ORCHESTRA.trombones, volume: 0.3 },
  braam: { ...ORCHESTRA.braam, volume: 0.5 },
  braamLow: { ...ORCHESTRA.braamLow, volume: 0.5 },
  // percussion
  timpani: { ...ORCHESTRA.timpani, volume: 0.42 },
  timpRoll: { ...ORCHESTRA.timpRoll, volume: 0.32 },
  kick: { ...ORCHESTRA.bassDrum, volume: 0.48, humanize: { time: 0.003, volume: 0.12 } },
  snare: { ...ORCHESTRA.snare, volume: 0.24 },
  rim: { ...ORCHESTRA.rim, volume: 0.2 },
  roll: { ...ORCHESTRA.roll, volume: 0.2 },
  hats: { sample: 'hatClosed', drum: 'sample', volume: 0.16, ring: true, reverb: 0.15, pan: 0.25, humanize: { time: 0.004, volume: 0.3 } },
  hatOpen: { sample: 'hatOpen', drum: 'sample', volume: 0.14, ring: true, reverb: 0.2, pan: 0.25 },
  ride: { sample: 'ride', drum: 'sample', volume: 0.16, ring: true, reverb: 0.25, pan: -0.25, humanize: { time: 0.004, volume: 0.25 } },
  shaker: { sample: 'shaker', drum: 'sample', volume: 0.12, ring: true, reverb: 0.15, pan: 0.3, humanize: { time: 0.004, volume: 0.35 } },
  claps: { sample: 'claps', drum: 'sample', volume: 0.24, ring: true, reverb: 0.3, pan: -0.1, humanize: { time: 0.006, volume: 0.2 } },
  taikoHigh: { ...ORCHESTRA.taikoHigh, volume: 0.3 },
  crash: { ...ORCHESTRA.crash, volume: 0.3 },
  gong: { ...ORCHESTRA.gong, volume: 0.4 },
  impact: { ...ORCHESTRA.impact, volume: 0.6 },
  swell: { ...ORCHESTRA.swell, volume: 0.3 },
  // the ship
  creak: { sample: 'shipTimbers', volume: 0.45, ring: true, detune: -200, reverb: 0.45, pan: -0.35, humanize: { time: 0.02, volume: 0.2 } },
};

// Every track in every section, so sections line up.
const sections = settleNotes(instruments, { windup, carousel, port, spin, starfall, stardance, masquerade, chaos });

export const FIGUREHEAD_BATTLE_THEME = {
  title: SONG,
  bpm: 180,
  stepsPerBeat: 4,
  volume: 1.12,
  instruments,
  sections,
  order: ['windup', 'carousel', 'port', 'spin', 'starfall', 'stardance', 'masquerade', 'chaos'],
  loopFrom: 1,
};
