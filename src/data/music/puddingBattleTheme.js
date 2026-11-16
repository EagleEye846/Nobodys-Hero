import { melody, midi, transpose } from '../../audio/notation.js';
import { ORCHESTRA } from './parts/usurper.js';
import { starFall, starIn, starNotes, STAR_LENGTHS, STAR_LENGTHS_WALTZ } from './parts/starGuardians.js';
import { SAMPLE_SETS } from '../../audio/sampleSets.js';

// "Seven Mugs": the fight with the PALE OLM, chapter 4's secret
// star guardian (src/data/enemies/pudding.js). The miners kept a blind cave
// olm in a tin dish by the kettle, their tea-break mascot. It touched the
// star's shard in the pool at the bottom of Seam Nine and grew huge and
// see-through, with the star burning in its belly, and it swims through rock.
// It wished on the star that the miners would come back after lunch, and the
// star gave it their voices and their things instead. It isn't cruel and it
// isn't mad. It is still waiting for everybody to come back after lunch.
//
// So the song is a lazy, lopsided waltz on a glass harmonica (the real glass
// recording, doubled by a bowed vibraphone), with pizzicato bass walking
// under it, a tin mug clinking very quietly on beats two and three, and the
// olm's own hum underneath everything (a choir, muffled and a little flat,
// over one soft sine tone: the only synth in the song). When the star wakes
// it tightens into a driving 6/8. In the chaos it stops choosing: the bars
// change length, the key slips up a semitone at a time, and four tunes play
// at once. When the glass shatters, two huge bright chords and then the star
// on everyone. No brass.
//
// TWO TUNES:
//   THE WHISTLE: the miners' end-of-shift whistle, the one the hero whistles
//     in the TALK: three long notes down, one short note up (B G E, F#). It
//     is the chapter's own four notes (the "first cell", parts/chapter4.js,
//     B E G F# in E minor) put in a different order, so it walks down
//     instead of asking. It never gets home: the short note up is always
//     the second of the scale, a question left hanging. Whole, it is two
//     calls (B G E F#, then A F# D#, E): the second one is the one that
//     comes home, and in the fight it is never finished.
//   THE FALLING STAR (parts/starGuardians.js: E6 B5 B-flat5 E5 here): every
//     star guardian's, and it is the spine of the song. Wherever it falls,
//     its own bells ring it (tubular bells in tune, and a glockenspiel two
//     octaves over, or the top of the piano in the keys the glockenspiel
//     can't reach: starRing, the same sound as "Star Aboard" and "Present
//     and Correct"). It is the first thing you hear (the glass and the
//     bells), the answer of the hook, the whole tune of its own passage
//     after the star wakes (starSong), on the bells over the turn's hook,
//     squeezed into every bar of the climb, the signal at the end of
//     each key in the chaos, and the last chord of the finale is the whole
//     band playing it, a diminished chord cracking under the slip, landing
//     on E with the gong.
//
//   THE HOOK (16 waltz bars, two of them a beat too long, where it gulps):
//     the whistle, the whistle again over the borrowed F major, then the
//     star falling and a waltz line climbing back up after it.
//   LUNCH (16 bars, G major): the chapter's cell (D G B A) as a warm tune on
//     the cellos, then the violins: the tea break as it used to be. Seven
//     clinks at the end of it.
//
// E minor, with B flat minor (the tritone, the star's crack made into a
// key) for the turn after the middle. The waltz is 3/4 at 96 crotchets a
// minute; the 6/8 keeps the same 96 beats but each beat now carries three
// quick notes, so the bar tightens from 1.88 s to 1.25 s. One step is a
// twelfth of a beat (a waltz bar is 36 steps, a 6/8 bar 24). The intro plays
// once (11 s); then it loops from 'olm', about 3m20s:
//
//   section    bars        time          what happens
//   teaBreak   6 (3/4)     (once, 11s)   the star alone on the glass and
//                                        its bells, in its rhythm; the hum; two mugs set down; the olm
//                                        hums the whistle, flat; the
//                                        pizzicato starts walking
//   olm        16 (3/4)    0:00-0:31     PHASE 1. THE HOOK on the glass
//                                        harmonica over the walking pizz,
//                                        the clinks and the hum; then the
//                                        harp, a choir, the whistle slowed
//                                        right down on the cellos under it;
//                                        the star's bells ring each answer
//   lunch      16 (3/4)    0:31-1:01     LUNCH in G major on the cellos,
//                                        then the violins; the glass answers
//                                        with the whistle; the star falls
//                                        over the dominant; seven clinks;
//                                        a timpani roll
//   wake       24 (6/8)    1:01-1:31     PHASE 2. THE STAR WAKES: harp and
//                                        celesta turning in quick notes,
//                                        tremolo strings, timpani on every
//                                        beat (the star's pulses); the
//                                        whistle passed in pieces from the
//                                        glass to the celesta to the pizz to
//                                        the choir, one note wrong each
//                                        time; then the hook in 6/8 on the
//                                        violins and glass, the choir rising,
//                                        the bells on the star, and the
//                                        second time the crack under it
//   starSong   16 (3/4)    1:31-2:02     THE STAR'S OWN SONG: the waltz
//                                        comes back and the star is the tune,
//                                        the whole way. It falls and the
//                                        whistle answers, down E, D, C, B,
//                                        from the glass to the violins to
//                                        the cellos; then it sings in canon
//                                        with itself, in E and then in G,
//                                        with its slip on its own chord (B
//                                        flat major under the B flat); then
//                                        a stretto, the star a beat behind
//                                        the star, on the crack's chord, the
//                                        bowls ringing the whistle over it;
//                                        then the star on everyone; then,
//                                        softly, the star in B flat, its
//                                        mirror, onto F (bar by bar at
//                                        starSong below). Bars 8 and 16
//                                        are a beat too long
//   starlight  12 (6/8)    2:02-2:17     THE TURN (61% in): B flat minor,
//                                        the tritone away, straight in on a
//                                        gong: the star half of the hook on
//                                        the violins and bells, the whistle
//                                        long on the cellos; then a climb a
//                                        semitone a bar, the star squeezed
//                                        into each on the bells and violins,
//                                        and a breath of nothing
//   chaos      16 (mixed)  2:17-2:55    PHASE 3. IT HAS STOPPED CHOOSING:
//                                        bars of 3/4, 5/4, 4/4 and 7/8 in a
//                                        fixed shuffle, the key slipping up
//                                        a semitone every four bars (E, F,
//                                        F#, G), and four tunes at once: the
//                                        hook on a music box, LUNCH twice
//                                        as fast on a toy piano (in the
//                                        relative major, so it fits), the
//                                        whistle in long notes on glass
//                                        bowls, a jig on a tin whistle, with
//                                        a glorious beat and a crash at each
//                                        key change. In each key's last bar
//                                        they all stop and the star falls on
//                                        its bells and the violins; the last
//                                        one, in G, on everyone, with the
//                                        crack. It hiccups, off the beat,
//                                        every third bar
//   shatter    (4/4)       2:55-3:12    THE FINALE: a crack and a beat of
//                                        nothing, then a wall of glass (a
//                                        rising shimmer, every drum, a choir
//                                        cluster); then two huge bright
//                                        chords, C and D major, and the
//                                        third is the star itself on the
//                                        whole band, broad, E major under
//                                        it, the crack under the slip, and
//                                        it lands on E with the gong
//   home       4 (3/4)     3:12-3:20     the whistle, whole, on a solo
//                                        violin over the quiet hum; its
//                                        last note up never comes. One clink,
//                                        and round to 'olm', which starts
//                                        with the whistle again
//
//   afterLunch (a coda, reached only by name, never in the loop) MERCY: the
//              same violin, and this time the last note up comes, onto E
//              major, and the hum stops. Back after lunch.
//
// The fight starts a section for each phase (`musicFrom` in the enemy file):
// 'wake' and 'chaos', and its last gauntlet plays 'shatter'. Each opens on a
// full bar.

const SONG = 'Seven Mugs';
const Q = 12;                              // a crotchet, in steps
const W8 = (text) => melody(text, 6);      // waltz 8ths
const W16 = (text) => melody(text, 3);     // waltz 16ths
const J8 = (text) => melody(text, 4);      // 6/8 8ths
const rest = (n) => Array(n).fill('.');
const hold = (n, len) => [typeof n === 'number' ? n : midi(n), ...Array(len - 1).fill('-')];
const up = transpose;
const sum = (list) => list.reduce((a, b) => a + b, 0);
const cut = (steps, len) => (steps.length >= len ? steps.slice(0, len) : [...steps, ...rest(len - steps.length)]);
const cycle = (steps, len) => Array.from({ length: len }, (_, i) => steps[i % steps.length]);
const hits = (len, every) => Array.from({ length: len }, (_, i) => (i % every ? '.' : 'x'));

// --- chords ---
const PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const pcOf = (name) => (PC[name[0]] + (name[1] === '#' ? 1 : name[1] === 'b' ? -1 : 0) + 12) % 12;
// [root, third, fifth] as pitch classes: 'Em', 'C', 'Bbm', 'C#', 'B7' (a 7 is
// read as the plain chord; the walking bass and the tunes supply the seventh).
function chordOf(symbol) {
  const m = symbol.match(/^([A-G][#b]?)(m|dim)?7?$/);
  if (!m) throw new Error(`${SONG}: can't read the chord '${symbol}'`);
  const root = pcOf(m[1]);
  return [root, (root + (m[2] ? 3 : 4)) % 12, (root + (m[2] === 'dim' ? 6 : 7)) % 12];
}
// The same chord `k` semitones higher.
function shiftChord(symbol, k) {
  const m = symbol.match(/^([A-G][#b]?)(.*)$/);
  return NAMES[(pcOf(m[1]) + k + 12) % 12] + m[2];
}
// The lowest note of pitch class `pc` at or above `lo`.
const near = (pc, lo) => lo + (((pc - lo) % 12) + 12) % 12;

// --- bars: { len, chord, groups (the beats, in steps) } ---
const GROUPS = { 24: [12, 12], 36: [12, 12, 12], 42: [12, 12, 18], 48: [12, 12, 12, 12], 60: [12, 12, 12, 12, 12] };
const barsOf = (chords, len) => chords.split(/\s+/).filter(Boolean).map((chord) => ({ len, chord, groups: GROUPS[len] }));
const waltz = (chords) => barsOf(chords, 36);
const jig = (chords) => barsOf(chords, 24);
const lengthOf = (bars) => sum(bars.map((b) => b.len));
const startsOf = (bars) => bars.map((_, i) => sum(bars.slice(0, i).map((b) => b.len)));

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
    // Silence everything from `from` to the end (a breath before the next part).
    hush(from) {
      for (const t of Object.values(tracks)) for (let i = from; i < length; i++) t[i] = '.';
      return api;
    },
    // Silence the named tracks from `from` for `len` steps (they step aside).
    clear(names, from, len) {
      for (const name of names) {
        const t = tracks[name];
        if (!t) continue;
        const end = Math.min(length, from + len);
        for (let i = from; i < end; i++) t[i] = '.';
        // a note held over the gap is struck again after it
        if (end < length && t[end] === '-') {
          let k = from - 1;
          while (k >= 0 && t[k] === '-') k--;
          t[end] = typeof t[k] === 'number' ? t[k] : '.';
        }
      }
      return api;
    },
    // THE CRACK under the star's slip: every note held on the named tracks
    // bends to the nearest note of the chord `pcs` (a diminished chord on the
    // home note) for `len` steps, then comes back as it was.
    crack(at, len, pcs, names) {
      for (const name of names) {
        const t = tracks[name];
        if (!t) continue;
        let k = at;
        while (k > 0 && t[k] === '-') k--;
        const note = t[k];
        if (typeof note !== 'number' || pcs.includes(((note % 12) + 12) % 12)) continue;
        const bent = [-1, 1, -2, 2].map((d) => note + d).find((n) => pcs.includes(((n % 12) + 12) % 12));
        let end = at + 1;
        while (end < length && t[end] === '-') end++;
        t[at] = bent;
        for (let i = at + 1; i < Math.min(at + len, end); i++) t[i] = '-';
        if (at + len < end) t[at + len] = note;
      }
      return api;
    },
    done: () => tracks,
  };
  return api;
}

// --- the band ---
// The pizzicato bass walks: the root on the first beat, the fifth (or the
// third) in the middle, and on the last beat a semitone under the next bar's
// root, so every bar leans into the next one.
function walk(bars, lo = 35) {
  return bars.flatMap((bar, i) => {
    const [r, t, f] = chordOf(bar.chord);
    const next = bars[i + 1] ? chordOf(bars[i + 1].chord)[0] : r;
    const out = rest(bar.len);
    const root = near(r, lo);
    let at = 0;
    bar.groups.forEach((n, gi) => {
      if (gi === 0) out[at] = root;
      else if (gi === bar.groups.length - 1 && bar.groups.length > 2 && next !== r) out[at] = near((next + 11) % 12, lo);
      else out[at] = gi % 2 ? near(f, root) : near(t, root);
      at += n;
    });
    return out;
  });
}
// The waltz's "pah, pah": the chord's third and fifth, plucked, on beats two and three.
function pah(bars, lo = 60) {
  const out = { pahLo: [], pahHi: [] };
  for (const bar of bars) {
    const [, t, f] = chordOf(bar.chord);
    const lo3 = rest(bar.len);
    const hi5 = rest(bar.len);
    let at = 0;
    bar.groups.forEach((n, gi) => { if (gi) { lo3[at] = near(t, lo); hi5[at] = near(f, lo); } at += n; });
    out.pahLo.push(...lo3);
    out.pahHi.push(...hi5);
  }
  return out;
}
// A tin mug set down, very quietly, on every beat but the first.
function clinks(bars) {
  return bars.flatMap((bar) => {
    const out = rest(bar.len);
    let at = 0;
    bar.groups.forEach((n, gi) => { if (gi) out[at] = 'x'; at += n; });
    return out;
  });
}
// Broken chords: a note every `every` steps, walking `shape` (indexes into
// the chord's tones from `lo` up three octaves), starting again each bar.
function arp(bars, lo, every, shape) {
  return bars.flatMap((bar) => {
    const [r, t, f] = chordOf(bar.chord);
    const base = near(r, lo);
    const tones = [base, near(t, base), near(f, base)];
    const ladder = [...tones, ...tones.map((n) => n + 12), ...tones.map((n) => n + 24)];
    return Array.from({ length: bar.len }, (_, i) => (i % every ? '.' : ladder[shape[(i / every) % shape.length]]));
  });
}
// One voice of the chords, held a bar each: voice 0 the root, 1 the third, 2 the fifth.
const voice = (bars, v, lo) => bars.flatMap((bar) => hold(near(chordOf(bar.chord)[v], lo), bar.len));
function pads(bars, names, lo) {
  return Object.fromEntries(names.map((name, v) => [name, voice(bars, v, lo)]));
}
const roots = (bars, lo) => voice(bars, 0, lo);
// The cymbal swell is loudest 3.18 s in (sampleSets.js): 61 steps here, so
// it's laid 61 steps before the downbeat it swells into.
const SW = 61;
const SWELL = hold(60, SW);

// THE STAR'S OWN BELLS. Wherever the star falls, the tubular bells ring it
// in its rhythm and the glockenspiel rings it two octaves over, both in tune:
// the one sound every star guardian's song shares ("Star Aboard" and
// "Present and Correct" ring it the same way). Each only plays where all four
// notes sit on its recordings, so an octave jump never breaks the shape. The
// glockenspiel can't ring it in E or B flat (its recordings have holes in
// both octaves), so there the top of the piano takes its place, in tune.
const fits = (sample, notes) => notes.every((n) => SAMPLE_SETS[sample].notes.some((r) => Math.abs(r - n) <= 2));
const pcAny = (tonic) => (typeof tonic === 'number' ? ((tonic % 12) + 12) % 12 : pcOf(tonic));
function starRing(s, at, tonic, { lengths = STAR_LENGTHS_WALTZ, unit = 6, bells = true, glock = true, shape } = {}) {
  const pc = pcAny(tonic);
  const fall = shape ?? ((t) => starFall(t, { lengths, unit }));
  const low = [near(pc, 58), near(pc, 58) - 12].find((t) => fits('chimes', starNotes(t)));
  const high = [near(pc, 84), near(pc, 72), near(pc, 96)].find((t) => fits('glock', starNotes(t)));
  if (bells && low != null) s.put('starBells', at, fall(low));
  if (glock && high != null) s.put('starGlock', at, fall(high));
  else if (glock && low != null) s.put('starCel', at, fall(low + 24));
  return s;
}
// The diminished chord on the home note (E G B-flat D-flat; the same four
// notes serve G), the crack under the star's slip at the big moments.
const CRACK = [4, 7, 10, 1];
const HELD = ['choirLo', 'choirMid', 'choirHi', 'choirBig', 'vTrem', 'vaTrem', 'cTrem', 'cellos', 'padV1', 'padV2', 'padV3', 'hum', 'humSynth', 'bowls'];

// ------------------------------------------------------------- the tunes
// THE HOOK, one bar a line (8ths). Bars 8 and 16 are a beat too long.
const HOOK = [
  'B5 - - - G5 -', '- - E5 - - F#5', 'G5 - A5 - C6 -', 'B5 - - - D#5 F#5',
  'B5 - - - G5 -', '- - E5 - - F#5', 'G5 - A5 - C6 -', 'B5 - - - A5 G5 F#5 -',
  'E6 B5 Bb5 - E5 -', 'G5 - B5 - E6 -', 'D6 - C6 - A5 -', 'B5 - - - A5 F#5',
  'E6 B5 Bb5 - E5 -', 'G5 - B5 - E6 -', 'D6 - C6 - A5 -', 'B5 - - - D#5 - F#5 -',
];
const HOOK_CHORDS = 'Em C Am B Em C F B Em C Am D Em C F B'.split(' ');
const hookBars = () => HOOK.map((text, i) => {
  const len = text.split(/\s+/).length * 6;
  return { len, chord: HOOK_CHORDS[i], groups: GROUPS[len] };
});
const HOOK_W = HOOK.flatMap(W8);
// The same tune in 6/8: the long bars lose their extra beat.
const HOOK_J = HOOK.map((text, i) => (i === 7 ? 'B5 - A5 G5 F#5 -' : i === 15 ? 'B5 - - D#5 - F#5' : text)).flatMap(J8);

// LUNCH, one bar a line (8ths): the chapter's cell, D G B A, in G major.
const LUNCH = [
  'D4 - G4 - B4 -', 'A4 - - - F#4 G4', 'E4 - B4 - D5 -', 'C5 - - - B4 A4',
  'C5 - B4 - A4 -', 'F#4 - - - A4 -', 'G4 - D4 - G4 B4', 'A4 - - - - -',
  'D4 - G4 - B4 -', 'A4 - - - F#4 G4', 'E4 - B4 - D5 -', 'C5 - - - E5 -',
  'D5 - C5 - B4 A4', 'A4 - - - C5 -', 'B4 - - - - -', 'B4 - - - - -',
];
const LUNCH_CHORDS = 'G D Em C Am D G D G D Em C Am F B B';

// THE WHISTLE slowed right down under the hook: B, G, E long, F# short, over four bars.
const WHISTLE_LONG = ['B3', 'G3', 'E3', 'F#3'].map(midi);
function whistleLong(bars, [a, b, c, d]) {
  const L = bars.map((x) => x.len);
  return [...hold(a, L[0]), ...hold(b, L[1]), ...hold(c, L[2] + L[3] - Q), ...hold(d, Q)];
}
// THE WHISTLE whole, on the violin: the first call, then the second, which
// would come home on E if it ever finished.
const WHISTLE_WHOLE = 'B5 - - - G5 - - - E5 - - F#5 A5 - - - F#5 - - - D#5 - - -';

// The tin whistle's jig (6/8 8ths): the whistle, skipping.
const JIG = J8(`
  B5 G5 E5 F#5 - -   G5 A5 B5 A5 G5 F#5   E5 F#5 G5 B5 - A5   G5 E5 D5 E5 - -
`);

// ------------------------------------------------------- teaBreak (intro)
const teaBreak = (() => {
  const bars = waltz('Em Em Em Em Em B');
  const st = startsOf(bars);
  const length = lengthOf(bars);
  const s = score('teaBreak', length);
  // the star, alone, on the glass and its own bells, in its own rhythm
  s.put('glass', 0, starFall('E5', { unit: 6 }));
  starRing(s, 0, 'E', { lengths: STAR_LENGTHS, glock: false });
  // the hum comes up under it
  s.put('hum', 0, hold('E3', length)).put('humSynth', 0, hold('E2', length));
  // two mugs set down, then one more
  s.hit('mug', st[1] + 12, st[1] + 24, st[2] + 24);
  // the olm hums the whistle, flat
  s.put('humTune', st[2], W8('B4 - - - G4 - - - E4 - - F#4'));
  // the waltz starts walking
  const last = bars.slice(4);
  s.put('bass', st[4], walk(last)).add(pah(last), st[4]).put('mug', st[4], clinks(last));
  s.put('harp', st[4], arp(last, 40, 6, [0, 2, 3, 4, 5, 6]));
  s.put('timpani', st[5], [near(11, 40)]);
  s.put('swell', length - SW, SWELL);
  return s.done();
})();

// ------------------------------------------------------------ olm (phase 1)
const olm = (() => {
  const bars = hookBars();
  const st = startsOf(bars);
  const length = lengthOf(bars);
  const s = score('olm', length);
  // THE HOOK on the glass harmonica, over the walking pizz, the mugs and the hum
  s.put('glass', 0, HOOK_W).put('vibes', 0, HOOK_W);
  s.put('bass', 0, walk(bars)).add(pah(bars)).put('mug', 0, clinks(bars));
  s.put('hum', 0, roots(bars, 52)).put('humSynth', 0, roots(bars, 40));
  // 9-16: the harp, a choir, the whistle slowed right down on the cellos
  const B = st[8];
  const back = bars.slice(8);
  s.put('harp', B, arp(back, 40, 6, [0, 2, 3, 4, 5, 4, 3, 2]));
  // (the choir sits over the cellos and the hum, not on top of them)
  s.add(pads(back, ['choirLo', 'choirMid', 'choirHi'], 60), B);
  s.put('cellos', B, whistleLong(back.slice(0, 4), WHISTLE_LONG)).put('cellos', st[12], whistleLong(back.slice(4), WHISTLE_LONG));
  // the hook's answer: each time the star falls, its bells ring it
  starRing(s, st[8], 'E');
  starRing(s, st[12], 'E');
  s.put('timpani', st[8], [near(4, 40)]).put('timpani', st[12], [near(4, 40)]);
  s.put('timpani', st[15], [near(11, 40)]).put('timpani', st[15] + 36, [near(11, 40)]);
  return s.done();
})();

// ------------------------------------------------------ lunch (the tea break)
const lunch = (() => {
  const bars = waltz(LUNCH_CHORDS);
  const st = startsOf(bars);
  const length = lengthOf(bars);
  const s = score('lunch', length);
  const tune = LUNCH.flatMap(W8);
  // the cellos, then the violins over them
  s.put('cellos', 0, tune);
  s.put('violins', st[8], up(tune.slice(st[8]), 12));
  s.put('bass', 0, walk(bars)).add(pah(bars)).put('mug', 0, clinks(bars.slice(0, 15)));
  s.put('harp', 0, arp(bars, 43, 6, [0, 2, 3, 4, 3, 2]));
  s.put('hum', 0, roots(bars, 52)).put('humSynth', 0, roots(bars, 40));
  s.add(pads(bars.slice(8), ['choirLo', 'choirMid', 'choirHi'], 60), st[8]);
  s.put('timpani', st[8], [near(7, 40)]);
  // the glass answers with the whistle; the star falls over the dominant
  s.put('glass', st[3] + 24, W16('E6 D6 B5 - ')).put('glass', st[7], W8('B5 - G5 - E5 F#5'));
  s.put('glass', st[14], W8(HOOK[8]));
  starRing(s, st[14], 'E');
  // seven mugs, and a roll into the wake
  s.put('mug', st[15], [0, 5, 10, 15, 20, 25, 30].reduce((out, p) => { out[p] = 'x'; return out; }, rest(36)));
  s.put('timpRoll', st[15], hold(near(11, 40), 36));
  s.put('swell', length - SW, SWELL);
  return s.done();
})();

// ----------------------------------------------------------- wake (phase 2)
const wake = (() => {
  const bars = jig(`Em Em C C Am Am B B ${HOOK_CHORDS.join(' ')}`);
  const st = startsOf(bars);
  const length = lengthOf(bars);
  const s = score('wake', length);
  // light turning: the harp in quick notes, the strings trembling
  s.put('harp', 0, arp(bars, 40, 4, [0, 2, 3, 4, 5, 4]));
  s.put('cpizz', 0, arp(bars, 40, 4, [0, 0, 2, 0, 3, 2]));
  s.put('bass', 0, bars.flatMap((bar) => { const r = near(chordOf(bar.chord)[0], 35); return [r, ...rest(11), r, ...rest(11)]; }));
  s.put('vTrem', 0, voice(bars, 2, 67)).put('vaTrem', 0, voice(bars, 1, 57)).put('cTrem', 0, voice(bars, 0, 43));
  // the star's pulses: the timpani on every beat, root and fifth
  s.put('timpani', 0, bars.flatMap((bar) => { const [r, , f] = chordOf(bar.chord); return [near(r, 40), ...rest(11), near(f, 40), ...rest(11)]; }));
  s.put('frame', 0, bars.flatMap(() => [...rest(8), 'x', ...rest(11), 'x', ...rest(3)]));
  // the whistle in pieces, passed along, one note wrong each time
  s.put('glass', st[0], J8('B5 - - G5 - - Eb5 - - - - F#5'));
  s.put('celesta', st[2], J8('C6 - - G5 - - E5 - - - - F#5'));
  s.put('pizzHi', st[4], J8('B5 - - G5 - - E5 - - - - F5'));
  s.put('choirTune', st[6], J8('B4 - - G#4 - - E4 - - - - F#4'));
  s.put('timpRoll', st[7], hold(near(11, 40), 24));
  // 9-24: the hook in 6/8, the choir rising
  const H = st[8];
  s.put('violins', H, HOOK_J).put('glass', H, HOOK_J).put('vibes', H, HOOK_J).put('celesta', H, up(HOOK_J, 12));
  s.add(pads(bars.slice(8, 16), ['choirLo', 'choirMid', 'choirHi'], 60), H).add(pads(bars.slice(16), ['choirLo', 'choirMid', 'choirHi'], 64), st[16]);
  for (const b of [8, 12, 16, 20]) s.put('cellos', st[b], whistleLong(bars.slice(b, b + 4), WHISTLE_LONG));
  s.put('kick', H, bars.slice(8).flatMap(() => ['x', ...rest(23)]));
  s.hit('crash', H).hit('crash', st[16]);
  // the hook's answer: the star on its bells (the celesta steps aside), and
  // the second time, the crack under the slip
  for (const b of [16, 20]) starRing(s, st[b], 'E', { unit: 4 }).clear(['celesta'], st[b], 24);
  s.crack(st[20] + 8, 8, CRACK, HELD).put('timpani', st[20] + 8, [near(10, 40)]).hit('crash', st[20] + 16);
  s.put('timpRoll', st[23], hold(near(11, 40), 24));
  s.put('swell', length - SW, SWELL);
  return s.done();
})();

// ------------------------------------------- starSong (the olm sings it)
// The star's own passage: sixteen bars where it is the tune, start to end,
// and nothing else is. The 6/8 lets go and the lazy waltz comes back, and the
// olm sings the star the way it sings everything, on the glass, with the mugs
// going. Every time the four notes come they're whole and in their own
// rhythm; only the key, the octave and who plays them change.
//   1-8   THE STAR FALLS THROUGH THE HOUSE. It falls, the whistle answers;
//         it falls a step lower, the whistle answers; down the old Spanish
//         stair (E, D, C, B), passed from the glass to the violins to the
//         cellos, falling a little deeper each time; then the whistle's
//         second call on the glass, a beat too long, never coming home.
//   9-12  IT SINGS WITH ITSELF. The star on the glass and the violins, then
//         the same star a bar behind in the cellos and the choir, a canon,
//         while the glass sings a tail over it; then all of that again a
//         third higher, in G. Here the slip gets its own chord: under the
//         B flat a B flat major chord (and under the D flat in G, D flat),
//         so the crack is a key for one beat, the key of the turn coming.
//   13-14 THE STRETTO. The star on top and the star an octave down a beat
//         behind it, twice, on the crack's own diminished chord, the bowls
//         ringing the whistle in long notes over it, the drums coming in.
//   15    THE TOP: the star on everyone, B flat major under its slip.
//   16    The mirror, softly: the star in B flat, E major under its slip
//         (each one's crack is the other's key), a beat too long, onto F,
//         and a breath. The turn starts in B flat minor.
const starSong = (() => {
  const bars = waltz('Em Em D D C C B B  Em Em G G Em Em Em Bbm');
  for (const b of [7, 15]) bars[b] = { ...bars[b], len: 48, groups: GROUPS[48] };
  const st = startsOf(bars);
  const length = lengthOf(bars);
  const s = score('starSong', length);
  const fall = (t) => starFall(t, { lengths: STAR_LENGTHS_WALTZ, unit: 6 });
  const n = midi;
  // 1-8: the waltz again, thin: the walking pizz, the pah, the mugs, the hum
  const house = bars.slice(0, 8);
  s.put('bass', 0, walk(house)).add(pah(house)).put('mug', 0, clinks(house));
  s.put('hum', 0, roots(house, 52)).put('humSynth', 0, roots(house, 40));
  s.put('timpani', 0, [near(4, 40)]);
  s.put('harp', st[4], arp(bars.slice(4, 8), 40, 6, [0, 2, 3, 4, 5, 4]));
  // the star falls and the whistle answers, down E, D, C, B
  const call = [
    ['glass', 'E5', 'B5 - G5 - E5 F#5'],
    ['glass', 'D5', 'A5 - F#5 - D5 E5'],
    ['violins', 'C5', 'G5 - E5 - C5 D5'],
  ];
  call.forEach(([track, tonic, whistle], i) => {
    const at = st[2 * i];
    s.put(track, at, fall(n(tonic))).put(track, at + 36, W8(whistle));
    if (track === 'glass') s.put('vibes', at, fall(n(tonic))).put('vibes', at + 36, W8(whistle));
    starRing(s, at, tonic.slice(0, -1), { glock: i === 0 });
  });
  s.put('cellos', st[6], fall(n('B3'))).put('choirTune', st[6], fall(n('B3')));
  starRing(s, st[6], 'B');
  // the whistle's second call, a beat too long, and it doesn't come home
  s.put('glass', st[7], W8('A5 - F#5 - D#5 - - -')).put('vibes', st[7], W8('A5 - F#5 - D#5 - - -'));
  s.put('timpani', st[7], [near(11, 40)]).put('timpRoll', st[7] + 36, hold(near(11, 40), 12));
  s.put('swell', st[8] - SW, SWELL);

  // 9-16: a chord a beat, so the slip can have its own
  const BEATS = [
    'Em Bb Em', 'Em Bb Em', 'G Db G', 'G Db G',
    'Em Edim Edim', 'Em Edim Edim', 'Em Bb Em', 'Bbm E Bbm F',
  ];
  const beats = BEATS.flatMap((b) => b.split(' ')).map((chord) => ({ len: Q, chord, groups: [Q] }));
  // the same chords with the repeats joined, for the held parts
  const held = beats.reduce((out, b) => {
    const last = out[out.length - 1];
    if (last && last.chord === b.chord) last.len += b.len; else out.push({ ...b });
    return out;
  }, []);
  const B = st[8];
  const heldFrom = (at) => {
    // the joined chords from step `at` (relative to B) on
    let pos = 0;
    return held.filter((h) => { const keep = pos >= at; pos += h.len; return keep; });
  };
  s.put('bass', B, beats.map((b) => [near(chordOf(b.chord)[0], 35), ...rest(Q - 1)]).flat());
  s.put('cpizz', B, beats.map((b) => ['.', ...rest(5), near(chordOf(b.chord)[2], 48), ...rest(5)]).flat());
  s.add(pads(held, ['choirLo', 'choirMid', 'choirHi'], 60), B);
  s.put('hum', B, roots(held, 52)).put('humSynth', B, roots(held, 40));
  s.put('harp', B, arp(held, 40, 6, [0, 2, 3, 4, 5, 4, 3, 2]));
  s.put('mug', B, clinks(bars.slice(8, 12)));
  s.hit('crash', B).put('timpani', B, [near(4, 40)]);
  // 9-12: the canon, in E and then in G, the glass singing a tail over it
  const canon = [
    { tonic: 'E', lead: 'E4', glass: 'E5', follow: ['E3', 'E3'], tail: 'G5 - D6 - B5 -' },
    { tonic: 'G', lead: 'G4', glass: null, follow: ['G2', 'G3'], tail: 'D6 - F5 - B5 -' },
  ];
  canon.forEach(({ tonic, lead, glass, follow, tail }, i) => {
    const at = st[8 + 2 * i];
    s.put('violins', at, fall(n(lead))).put('vibes', at, fall(n(lead)));
    if (glass) s.put('glass', at, fall(n(glass)));
    starRing(s, at, tonic);
    s.put('cellos', at + 36, fall(n(follow[0]))).put('choirTune', at + 36, fall(n(follow[1])));
    s.put('glass', at + 36, W8(tail));
    s.put('timpani', at + 36, [near(pcOf(tonic), 40)]);
  });
  // 13-14: the stretto: the star, and the star an octave down a beat behind
  // it, twice, on the crack's chord; the bowls ring the whistle long over it
  for (const b of [12, 13]) {
    s.put('glass', st[b], fall(n('E5'))).put('violins', st[b], fall(n('E4'))).put('vibes', st[b], fall(n('E4')));
    s.put('choirTune', st[b] + Q, fall(n('E4'))).put('cellos', st[b] + Q, fall(n('E3')));
  }
  starRing(s, st[12], 'E', { glock: false });
  s.put('bowls', st[12], [...hold('B5', 36), ...hold('G5', 36), ...hold('E5', 60)]);
  const rise = heldFrom(st[12] - B);
  s.put('vTrem', st[12], voice(rise, 2, 67)).put('vaTrem', st[12], voice(rise, 1, 57)).put('cTrem', st[12], voice(rise, 0, 43));
  s.put('timpani', st[12], beats.slice(12).map((b) => [near(chordOf(b.chord)[0], 40), ...rest(Q - 1)]).flat());
  s.put('kick', st[12], [...hits(36, 36), ...hits(36, 36), ...hits(36, 36)]);
  s.put('frame', st[12], [...rest(12), 'x', ...rest(11), 'x', ...rest(11), ...rest(12), 'x', ...rest(11), 'x', ...rest(11)]);
  s.hit('crash', st[12]);
  s.put('roll', st[13], hits(36, 3)).put('timpRoll', st[13] + 24, hold(near(4, 40), 12));
  s.put('swell', st[14] - SW, SWELL);
  // 15: the top: the star on everyone, B flat major under the slip
  const top = st[14];
  s.put('glass', top, fall(n('E5'))).put('vibes', top, fall(n('E5'))).put('violins', top, fall(n('E4')));
  s.put('choirTune', top, fall(n('E4'))).put('cellos', top, fall(n('E2')));
  s.add(pads(heldFrom(top - B).slice(0, 3), ['padV1', 'padV2', 'padV3'], 72), top);
  s.put('choirBig', top, [...hold('B4', Q), ...hold('Bb4', Q), ...hold('B4', Q)]);
  starRing(s, top, 'E');
  s.hit('crash', top).hit('impact', top).hit('taiko', top, top + Q, top + 2 * Q);
  // 16: the mirror, softly: the star in B flat, E major under its slip, onto F
  const last = st[15];
  s.put('violins', last, fall(n('Bb4'))).put('choirTune', last, fall(n('Bb3')));
  starRing(s, last, 'Bb', { glock: false });
  s.put('timpani', last + 36, [near(5, 40)]);
  // two mugs, very quietly, as if nothing had happened
  s.hit('mug', last + Q, last + 2 * Q);
  // a breath of nothing
  s.hush(length - 6);
  return s.done();
})();

// ------------------------------------------------- starlight (the turn)
const starlight = (() => {
  const bars = jig('Bbm Gb Ebm Ab Bbm Gb B F  C C# D D#');
  const st = startsOf(bars);
  const length = lengthOf(bars);
  const s = score('starlight', length);
  const theme = bars.slice(0, 8);
  const climb = bars.slice(8);
  // (It used to open with eight quiet bars, the star slowed down in canon;
  // cut on 12 November 2026 so the star's run after starSong is shorter. The
  // mirror at the end of starSong lands on F, so it goes straight in.)
  s.hit('gong', 0);
  s.put('hum', 0, roots(theme, 46)).put('humSynth', 0, roots(theme, 34));
  // 1-8: the star half of the hook, in B flat minor
  const line = up(HOOK_J.slice(8 * 24), -6);
  s.put('violins', st[0], line).put('vibes', st[0], line).put('choirTune', st[0], up(line, -12));
  s.put('harp', st[0], arp(theme, 46, 4, [0, 2, 3, 4, 5, 4]));
  s.put('celesta', st[0], arp(theme, 70, 2, [6, 5, 4, 3, 4, 5]));
  s.put('vTrem', st[0], voice(theme, 2, 67)).put('vaTrem', st[0], voice(theme, 1, 57)).put('cTrem', st[0], voice(theme, 0, 43));
  s.put('timpani', st[0], theme.flatMap((bar) => { const [r, , f] = chordOf(bar.chord); return [near(r, 40), ...rest(11), near(f, 40), ...rest(11)]; }));
  const wBb = ['F3', 'Db3', 'Bb2', 'C3'].map(midi);
  s.put('cellos', st[0], whistleLong(theme.slice(0, 4), wBb)).put('cellos', st[4], whistleLong(theme.slice(4), wBb));
  s.put('bass', st[0], theme.flatMap((bar) => { const r = near(chordOf(bar.chord)[0], 35); return [r, ...rest(11), r, ...rest(11)]; }));
  s.hit('crash', st[0]);
  // its two star bars rung on the bells (the celesta steps aside)
  for (const b of [0, 4]) starRing(s, st[b], 'Bb', { unit: 4 }).clear(['celesta'], st[b], 24);
  // 9-12: the climb, a semitone a bar, the star squeezed into each, on the
  // bells and the violins (all four notes whole in every key)
  s.put('harp', st[8], arp(climb, 52, 2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 7, 6, 5]));
  s.add(pads(climb, ['choirLo', 'choirMid', 'choirHi'], 55), st[8]);
  s.put('vTrem', st[8], voice(climb, 2, 67)).put('vaTrem', st[8], voice(climb, 1, 57)).put('cTrem', st[8], voice(climb, 0, 43));
  climb.forEach((bar, i) => {
    const root = chordOf(bar.chord)[0];
    starRing(s, st[8 + i], root, { shape: (t) => starIn(t, 24) });
    s.put('violins', st[8 + i], starIn(near(root, 72), 24));
  });
  s.put('bass', st[8], climb.flatMap((bar) => { const r = near(chordOf(bar.chord)[0], 35); return [r, ...rest(5), r, ...rest(5), r, ...rest(5), r, ...rest(5)]; }));
  s.put('timpRoll', st[8], hold(near(0, 40), 4 * 24));
  s.put('roll', st[10], hits(48, 3));
  s.put('swell', length - 6 - SW, SWELL);
  // a breath of nothing
  s.hush(length - 6);
  return s.done();
})();

// ------------------------------------------------------- chaos (phase 3)
// The bars, shuffled once and kept: 3/4, 5/4, 4/4, 7/8...
const CHAOS_METERS = [36, 60, 48, 42, 36, 42, 60, 48, 36, 42, 48, 36, 60, 42, 36, 48];
const CHAOS_KEYS = [0, 1, 2, 3];
const CHAOS_DEGREES = ['Em', 'C', 'Am', 'B'];
const LUNCH_FAST = LUNCH.flatMap(W16);
const chaos = (() => {
  const bars = CHAOS_METERS.map((len, i) => ({ len, groups: GROUPS[len], chord: shiftChord(CHAOS_DEGREES[i % 4], CHAOS_KEYS[Math.floor(i / 4)]) }));
  const st = startsOf(bars);
  const length = lengthOf(bars);
  const s = score('chaos', length);
  // four tunes at once, each starting again at every key change: the hook
  // on top, the jig under it, LUNCH (in the relative major, so it fits the
  // minor chords) in the middle, the whistle held on the bowls. In each key's
  // last bar they all stop and the star falls on its bells over the dominant,
  // then the key slips up a semitone and they start again.
  for (let b = 0; b < 4; b++) {
    const block = bars.slice(4 * b, 4 * b + 4);
    const at = st[4 * b];
    const L = lengthOf(block);
    const run = L - block[3].len;
    const k = CHAOS_KEYS[b];
    s.put('box', at, up(cut(HOOK_W, run), 12 + k));
    s.put('toy', at, up(cut(LUNCH_FAST, run), 12 + k));
    s.put('bowls', at, up([...hold('B5', 36), ...hold('G5', 36), ...hold('E5', L - 84), ...hold('F#5', 12)], k));
    s.put('tin', at, up(cycle(JIG, run), k));
    // the glorious beat
    s.hit('crash', at).put('choirBig', at, hold(midi('B4') + k, 12)).put('glass', at, [midi('B5') + k]);
    // the star, on its own
    const tonic = 4 + k;
    const S = st[4 * b + 3];
    const fall = (t) => starFall(t, { lengths: STAR_LENGTHS_WALTZ, unit: 6 });
    starRing(s, S, tonic);
    s.put('violins', S, fall(near(tonic, 65)));
    if (fits('glass', starNotes(near(tonic, 73)))) s.put('glass', S, fall(near(tonic, 73)));
  }
  // the last one, in G, on everyone, with the crack under the slip
  const S4 = st[15];
  const fallG = (t) => starFall(t, { lengths: STAR_LENGTHS_WALTZ, unit: 6 });
  s.put('cellos', S4, fallG(midi('G3'))).put('choirTune', S4, fallG(midi('G4'))).put('celesta', S4, fallG(midi('G5')));
  bars.forEach((bar, i) => {
    const [r, t, f] = chordOf(bar.chord);
    let g = st[i];
    bar.groups.forEach((n, gi) => {
      s.put('bass', g, [gi === 0 ? near(r, 35) : near(gi % 2 ? f : r, 35)]);
      if (gi) s.put('cpizz', g, [near(f, 48)]);
      s.hit('taiko', g).hit('rim', g + 6);
      g += n;
    });
    s.put('timpani', st[i], [near(r, 40)]);
    // a cluster under the bars of seven
    if (bar.len === 42) s.put('vaTrem', st[i], hold(near(r, 60) + 1, bar.len));
    // the hiccup: off the beat, every third bar (never in a star's bar)
    if (i % 3 === 1 && i % 4 !== 3) {
      const h = st[i] + Q + 9;
      s.put('hup', h, [near(t, 72)]).put('hupPizz', h, [near(r, 72) + 1]);
      s.hit('tenorHigh', h).hit('claps', h);
    }
  });
  s.add(pads(bars, ['choirLo', 'choirMid', 'choirHi'], 55));
  s.put('vTrem', 0, voice(bars, 2, 67)).put('cTrem', 0, voice(bars, 0, 43));
  s.crack(S4 + 12, 12, CRACK, HELD).put('timpani', S4 + 12, [near(10, 40)]);
  const lastBar = st[15];
  s.put('timpRoll', lastBar + 24, hold(near(7, 40), 24)).put('roll', lastBar + 24, hits(24, 3));
  return s.done();
})();

// ---------------------------------------------------- shatter (the finale)
const shatter = (() => {
  const length = 336;
  const s = score('shatter', length);
  // a crack, and a beat of nothing
  s.put('glass', 0, [midi('D6')]).put('bowls', 0, [midi('E6')]);
  const W0 = 12;
  const C1 = 132;
  const C2 = 180;
  const C3 = 228;
  // the wall of glass: a shimmer rising up the scale, a run at a time
  const SCALE = [0, 2, 3, 5, 7, 9, 11];
  const deg = (d, base) => base + 12 * Math.floor(d / 7) + SCALE[d % 7];
  const shimmer = rest(C1 - W0);
  for (let i = 0; i < shimmer.length / 3; i++) shimmer[i * 3] = deg(Math.floor(i / 8) * 2 + (i % 8), 76);
  s.put('celesta', W0, shimmer);
  const gliss = rest(C1 - W0);
  for (let i = 0; i < gliss.length / 2; i++) gliss[i * 2] = deg(i % 15, 52);
  s.put('harp', W0, gliss);
  s.put('glass', W0, cycle([midi('B5'), '.', '.', midi('D6'), '.', '.', midi('E6'), '.', '.'], C1 - W0));
  s.put('vibes', W0, hold('E6', C1 - W0));
  // the choir cluster, every drum
  s.put('choirLo', W0, hold('E4', C1 - W0)).put('choirMid', W0, hold('F#4', C1 - W0)).put('choirHi', W0, hold('G4', C1 - W0));
  s.put('choirTune', W0, hold('A4', C1 - W0)).put('choirBig', W0, hold('B4', C1 - W0));
  s.put('vTrem', W0, hold('B5', C1 - W0)).put('vaTrem', W0, hold('C5', C1 - W0)).put('cTrem', W0, hold('E3', C1 - W0));
  s.put('timpRoll', W0, hold(near(4, 40), C1 - W0));
  s.put('roll', 72, hits(C1 - 72, 3));
  s.hit('kick', 12, 48, 72, 90, 102, 111, 117, 121, 124, 127, 130);
  s.hit('taiko', 96, 108, 114, 120, 123, 126, 129);
  s.put('swell', C1 - SW, SWELL);
  // two huge bright chords, C and D major...
  const chord = (name, at, len) => {
    const [r, t, f] = chordOf(name);
    s.put('choirLo', at, hold(near(r, 48), len)).put('choirMid', at, hold(near(t, 55), len)).put('choirHi', at, hold(near(f, 60), len));
    s.put('choirBig', at, hold(near(r, 60), len));
    s.put('padV1', at, hold(near(r, 72), len)).put('padV2', at, hold(near(t, 72), len)).put('padV3', at, hold(near(f, 72), len));
    s.put('cellos', at, hold(near(r, 36), len)).put('bass', at, [near(r, 35)]);
    s.put('timpani', at, [near(r, 40)]);
    s.put('bowls', at, hold(near(f, 76), len));
    s.hit('crash', at).hit('impact', at).hit('kick', at);
  };
  [['C', C1], ['D', C2]].forEach(([name, at]) => {
    const [r, t, f] = chordOf(name);
    chord(name, at, 48);
    s.put('choirTune', at, hold(near(t, 64), 48)).put('gong', at, ['x']);
    s.put('harp', at, arp([{ len: 16, chord: name }], 40, 2, [0, 1, 2, 3, 4, 5, 6, 7]));
    s.put('glass', at, hold(near(t, 76), 48)).put('vibes', at, hold(near(r, 76), 48));
    s.put('celesta', at, [near(r, 84), '.', near(t, 84), '.', near(f, 84), '.', near(r, 96)]);
  });
  // ...and the third is the star itself, on the whole band, broad (a
  // crotchet to its 8th): E major under the fall, the crack under the slip,
  // and it lands on E with the gong
  const len = length - C3;
  const big = (t) => cut(starFall(t, { unit: 12 }), len).map((n, i) => (n === '.' && i > 0 ? '-' : n));
  chord('E', C3, len);
  s.put('violins', C3, big(midi('E5'))).put('glass', C3, big(midi('E5'))).put('vibes', C3, big(midi('E5')));
  s.put('choirTune', C3, big(midi('E4'))).put('cellos', C3, big(midi('E3'))).put('harp', C3, big(midi('E3')));
  s.put('bass', C3, big(midi('E2'))).put('cTrem', C3, hold('E2', len));
  starRing(s, C3, 'E', { lengths: STAR_LENGTHS, unit: 12 });
  const slip = C3 + 24;
  const land = C3 + 48;
  s.crack(slip, 24, CRACK, HELD).put('vaTrem', slip, hold('C#5', 24));
  s.put('timpani', C3 + 12, [near(11, 40)]).put('timpani', slip, [near(10, 40)]).put('timpani', land, [near(4, 40)]);
  s.hit('kick', C3 + 12, slip).hit('taiko', C3 + 12, slip, slip + 12).put('roll', slip, hits(24, 2));
  s.put('swell', land - SW, SWELL);
  s.hit('crash', land).hit('gong', land).hit('impact', land).hit('kick', land);
  s.put('celesta', land, [76, '.', 80, '.', 83, '.', 88, '.', 92, '.', 95, '.', 100]);
  return s.done();
})();

// ------------------------------------------------------------ home (the loop)
const home = (() => {
  const bars = waltz('Em C B B');
  const length = lengthOf(bars);
  const s = score('home', length);
  s.put('solo', 0, W8(WHISTLE_WHOLE));
  s.put('hum', 0, roots(bars, 52)).put('humSynth', 0, roots(bars, 40));
  s.put('bass', 0, bars.flatMap((bar) => [near(chordOf(bar.chord)[0], 35), ...rest(bar.len - 1)]));
  s.put('harp', 0, arp(bars, 40, 12, [0, 2, 4]));
  s.hit('mug', length - Q);
  return s.done();
})();

// ------------------------------------------------- afterLunch (mercy, a coda)
const afterLunch = (() => {
  const bars = waltz('Em C B B E E');
  const st = startsOf(bars);
  const length = lengthOf(bars);
  const s = score('afterLunch', length);
  const upNote = st[3] + 30;
  s.put('solo', 0, W8(`${WHISTLE_WHOLE.replace(/ -$/, ' E5')} - - - - - - - - - - - -`));
  // the hum, until the last note comes
  s.put('hum', 0, cut(roots(bars.slice(0, 4), 52), upNote)).put('humSynth', 0, cut(roots(bars.slice(0, 4), 40), upNote));
  s.put('bass', 0, bars.slice(0, 4).flatMap((bar) => [near(chordOf(bar.chord)[0], 35), ...rest(bar.len - 1)]));
  s.put('harp', 0, arp(bars.slice(0, 4), 40, 12, [0, 2, 4]));
  // E major: the harp, the glass, the choir
  s.put('bass', upNote, [near(4, 35)]).put('cellos', upNote, hold('E2', length - upNote));
  s.put('harp', upNote, [52, '.', 56, '.', 59, '.', 64, '.', 68, '.', 71, '.', 76]);
  s.put('glass', upNote, hold('E6', length - upNote)).put('bowls', upNote, hold('B5', length - upNote)).put('vibes', upNote, hold('G#5', length - upNote));
  s.put('choirLo', upNote, hold('E3', length - upNote)).put('choirMid', upNote, hold('G#3', length - upNote)).put('choirHi', upNote, hold('B3', length - upNote));
  s.hit('mug', st[5] + 24);
  return s.done();
})();

// ------------------------------------------------------------ the players
// The recordings: a note too far from any recording (more than two
// semitones) moves an octave; on the doubling tracks it's simply left out
// (the line it doubles still plays it).
const DOUBLES = new Set(['vibes']);
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
        if (reach(sample, steps[i])) continue;
        const clear = () => { for (let k = i + 1; k < steps.length && steps[k] === '-'; k++) steps[k] = '.'; };
        if (DOUBLES.has(track)) { steps[i] = '.'; clear(); continue; }
        steps[i] = settle(sample, steps[i]) ?? steps[i];
      }
    }
  }
  return sections;
}

const humanize = (time, volume) => ({ humanize: { time, volume } });
const instruments = {
  // the glass harmonica: the real glass, wavering a little, and a bowed vibraphone under it
  glass: { sample: 'glass', volume: 0.3, attack: 0.04, release: 0.7, drift: 4, wow: { cents: 7, rate: 4.2 }, reverb: 0.6, pan: 0.05, ...humanize(0.006, 0.1) },
  vibes: { sample: 'vibesBowed', volume: 0.16, attack: 0.08, release: 0.8, reverb: 0.6, pan: -0.1 },
  // glass bowls, rung and left to sing, a little out of true
  bowls: { sample: 'glass', volume: 0.2, ring: true, detune: 12, wow: { cents: 14, rate: 0.6 }, reverb: 0.75, pan: -0.35 },
  // the celesta's job, on the top of a piano
  celesta: { sample: 'grandPiano', volume: 0.13, ring: true, reverb: 0.55, pan: 0.3, ...humanize(0.006, 0.15) },
  // the star's own bells (starRing): tubular bells and a glockenspiel, in
  // tune, and the top of the piano where the glockenspiel can't reach
  starBells: { sample: 'chimes', volume: 0.27, ring: true, reverb: 0.55, pan: -0.05, ...humanize(0.003, 0.06) },
  starGlock: { sample: 'glock', volume: 0.2, ring: true, reverb: 0.5, pan: 0.15, echo: { time: 0.3125, feedback: 0.2, mix: 0.15 } },
  starCel: { sample: 'grandPiano', volume: 0.17, ring: true, reverb: 0.5, pan: 0.15, echo: { time: 0.3125, feedback: 0.2, mix: 0.15 }, ...humanize(0.003, 0.06) },
  harp: { sample: 'harp', volume: 0.24, ring: true, reverb: 0.5, pan: -0.25, ...humanize(0.008, 0.15) },
  // the walking pizzicato
  bass: { sample: 'bassPizz', volume: 0.42, ring: true, reverb: 0.25, ...humanize(0.005, 0.12) },
  cpizz: { sample: 'cellosPizz', volume: 0.2, ring: true, reverb: 0.3, pan: -0.2, ...humanize(0.005, 0.15) },
  pahLo: { sample: 'violinsPizz', volume: 0.12, ring: true, reverb: 0.3, pan: -0.3, ...humanize(0.005, 0.2) },
  pahHi: { sample: 'violinsPizz', volume: 0.12, ring: true, reverb: 0.3, pan: 0.3, ...humanize(0.005, 0.2) },
  pizzHi: { sample: 'violinsPizz', volume: 0.2, ring: true, reverb: 0.35, pan: 0.2, ...humanize(0.005, 0.15) },
  // a tin mug, set down by the kettle: a small bell, higher and dulled
  mug: { sample: 'rideBell', drum: 'sample', volume: 0.06, ring: true, detune: 600, muffle: 6000, reverb: 0.3, pan: 0.35, ...humanize(0.008, 0.35) },
  // the olm's hum: a choir, muffled and a bit flat, over one soft sine
  hum: { sample: 'choir', volume: 0.12, attack: 1, release: 1.4, detune: -12, muffle: 1100, reverb: 0.7, pan: -0.1 },
  humSynth: { wave: 'sine', volume: 0.05, attack: 1.2, decay: 0.3, sustain: 1, release: 1.5, gate: 1, vibrato: { rate: 0.3, depth: 6 } },
  humTune: { sample: 'choir', volume: 0.2, attack: 0.25, release: 0.8, detune: -25, muffle: 1400, reverb: 0.75, pan: 0.1 },
  // voices
  choirLo: { sample: 'choir', volume: 0.12, attack: 0.3, release: 0.6, reverb: 0.55, pan: -0.2 },
  choirMid: { sample: 'choir', volume: 0.12, attack: 0.3, release: 0.6, reverb: 0.55 },
  choirHi: { sample: 'choir', volume: 0.12, attack: 0.3, release: 0.6, reverb: 0.55, pan: 0.2 },
  choirBig: { sample: 'choir', volume: 0.24, attack: 0.08, release: 0.8, reverb: 0.6, pan: 0.05 },
  choirTune: { sample: 'choir', volume: 0.24, attack: 0.15, release: 0.6, reverb: 0.6, pan: -0.05 },
  hup: { sample: 'choir', volume: 0.22, attack: 0.005, release: 0.06, drift: 25, reverb: 0.45, pan: 0.15 },
  // strings
  solo: { ...ORCHESTRA.soloViolin, volume: 0.44, attack: 0.06, release: 0.7, reverb: 0.6, ...humanize(0.01, 0.08) },
  violins: { ...ORCHESTRA.violins, volume: 0.26 },
  cellos: { sample: 'cellos', volume: 0.26, attack: 0.06, release: 0.5, reverb: 0.45, pan: -0.25 },
  padV1: { sample: 'violins', volume: 0.16, attack: 0.05, release: 0.9, reverb: 0.5, pan: 0.25 },
  padV2: { sample: 'violins', volume: 0.16, attack: 0.05, release: 0.9, reverb: 0.5 },
  padV3: { sample: 'violins', volume: 0.16, attack: 0.05, release: 0.9, reverb: 0.5, pan: -0.25 },
  vTrem: { sample: 'violinsTrem', volume: 0.11, attack: 0.4, release: 0.6, reverb: 0.5, pan: 0.25 },
  vaTrem: { sample: 'violasTrem', volume: 0.11, attack: 0.4, release: 0.6, reverb: 0.5, pan: -0.1 },
  cTrem: { sample: 'cellosTrem', volume: 0.13, attack: 0.4, release: 0.6, reverb: 0.45, pan: -0.25 },
  lowTrem: { sample: 'cellosTrem', volume: 0.16, attack: 0.8, release: 1, reverb: 0.5, pan: -0.2 },
  hupPizz: { sample: 'violinsPizz', volume: 0.2, ring: true, reverb: 0.3, pan: -0.2 },
  // the chaos's other three: a music box gone flat, a toy piano, a tin whistle
  // (the box is the top of a piano, so the hook stays whole in every key; the
  // two pianos are only a little out of true, so the tunes stay tunes)
  box: { sample: 'grandPiano', volume: 0.15, ring: true, detune: -10, drift: 6, wow: { cents: 9, rate: 0.45 }, reverb: 0.55, pan: 0.2, echo: { time: 0.3125, feedback: 0.25, mix: 0.2 }, ...humanize(0.004, 0.12) },
  toy: { sample: 'grandPiano', volume: 0.11, release: 0.08, detune: 16, drift: 8, reverb: 0.3, pan: 0.3, ...humanize(0.006, 0.2) },
  tin: { sample: 'recorder', volume: 0.17, attack: 0.01, release: 0.05, detune: 10, drift: 14, reverb: 0.35, pan: -0.3, ...humanize(0.006, 0.15) },
  // percussion
  timpani: { ...ORCHESTRA.timpani, volume: 0.4, ...humanize(0.004, 0.14) },
  timpRoll: { ...ORCHESTRA.timpRoll, volume: 0.3 },
  kick: { ...ORCHESTRA.bassDrum, volume: 0.36, ...humanize(0.004, 0.16) },
  frame: { sample: 'frameDrum', drum: 'sample', volume: 0.18, ring: true, reverb: 0.3, pan: 0.15, ...humanize(0.004, 0.25) },
  taiko: { ...ORCHESTRA.taiko, volume: 0.22 },
  tenorHigh: { ...ORCHESTRA.taikoHigh, volume: 0.26 },
  rim: { ...ORCHESTRA.rim, volume: 0.16 },
  claps: { sample: 'claps', drum: 'sample', volume: 0.16, ring: true, reverb: 0.3, pan: -0.1 },
  roll: { ...ORCHESTRA.roll, volume: 0.18 },
  crash: { ...ORCHESTRA.crash, volume: 0.26 },
  gong: { ...ORCHESTRA.gong, volume: 0.36 },
  impact: { ...ORCHESTRA.impact, volume: 0.45 },
  swell: { ...ORCHESTRA.swell, volume: 0.28 },
};

const sections = { teaBreak, olm, lunch, wake, starSong, starlight, chaos, shatter, home, afterLunch };
// Every track in every section, so sections line up.
for (const section of Object.values(sections)) {
  const length = Object.values(section)[0].length;
  for (const track of Object.keys(instruments)) section[track] ??= rest(length);
}

export const PUDDING_BATTLE_THEME = {
  title: SONG,
  bpm: 96,
  stepsPerBeat: 12,
  volume: 1.48,
  instruments,
  sections: settleNotes(instruments, sections),
  order: ['teaBreak', 'olm', 'lunch', 'wake', 'starSong', 'starlight', 'chaos', 'shatter', 'home'],
  loopFrom: 1,
  // MERCY: only the spare scene goes here (by name); it plays once and rings out.
  coda: ['afterLunch'],
};
