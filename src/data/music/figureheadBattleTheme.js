import { melody, midi, transpose } from '../../audio/notation.js';
import { ORCHESTRA } from './parts/usurper.js';
import { SHANTY, NO_PORT } from './parts/ghostShip.js';
import { starFall, starNotes, STAR_LENGTHS, STAR_LENGTHS_WALTZ } from './parts/starGuardians.js';
import { SAMPLE_SETS } from '../../audio/sampleSets.js';

// "Never Morning": the fight with Madam Fairweather, the figurehead on the
// bow of the Fair Return. On the ship's last good night she wished on the
// splinter of star in her chest that the night would never end, and it
// didn't. Now it's a party nobody can leave, and she can't stop laughing.
// She's thrilled to have a guest. She doesn't know how hard she's playing.
// Underneath, she's been alone for a hundred years.
//
// So the song is a ballroom waltz played as a dance of the dead: a big,
// driving minor-key waltz for a full orchestra, at a party that has gone on
// far too long. A clock strikes midnight at the start, and again at the end
// of every loop, so the night starts over and morning never comes. The waltz
// pumps (low strings churning in 8ths, the bass drum on ONE, snare on three),
// the tune is big and sung, and her laugh keeps breaking through it.
//
// THE TUNES:
//   HER HOOK (16 bars, "A GUEST! Oh, a GUEST!"): two quick bursts, a leap up
//     a fifth and a giggle round the top (B flat, A, G sharp, A), then a leap
//     up a sixth and the giggle again higher; then a long sweep down. The
//     second time it climbs higher still, and the punchline is THE FALLING
//     STAR, followed by her laugh tumbling down the scale in 16ths. The
//     giggle's G sharp is the star's own crack (the flat fifth), so the star
//     is inside her tune from its second bar. Chords: a bass falling
//     chromatically D, C#, C, B, B flat (the oldest sad waltz bass there is),
//     with one borrowed colour, the E flat (Neapolitan) under her laugh.
//   THE FALLING STAR (parts/starGuardians.js, D6 A5 G#5 D5 here): every star
//     guardian's motif. It opens the song on a music box under the midnight
//     clock, it is the punchline of the hook, the brass blare it as their
//     call in the shower, it rains in canon, it climbs a step at a time, it
//     falls in half notes over two bars of the waltz (a hemiola) to the big
//     landing, it rings slowly in the quiet, and the star's own bells
//     (tubular bells and glockenspiel, in tune: starRing) ring it every time.
//     'spin' is its own section: 28 bars where the star IS the tune.
//     Wherever the star slips (the G sharp), her wood creaks: the crack.
//   THE LONELY LINE (16 bars, slow, on the violins): what's under the
//     laughing. It plays under her "Nobody leaves!" in 'laughter' and comes
//     back in the quiet as a solo violin, in the major, when she wonders if
//     it's morning.
//   HER LAUGH: "HA ha ha ha haaa", down by semitones (the end of the hook in
//     the choir); in the chaos it turns into HA! HA! HA! on the beats.
//   "PORT TOMORROW" (parts/ghostShip.js): the crew's shanty is the lost waltz
//     of 'masquerade', played as a ballroom dance in D minor. As always on
//     the ship, it stops a semitone short of home (C sharp, not D). In the
//     chaos it comes back at full size under her laughter, and still stops.
//
// D minor, with F major for the false dawn. Real recordings throughout:
// violins (legato, spiccato, tremolo), violas, cellos, basses, solo violin,
// flute, piccolo, oboe, clarinet, grand piano, harp, glockenspiel, tubular
// bells, horns, trumpets, trombones, tuba, timpani, choir, bass drum, snare,
// hi-hats, ride, cymbals, gong, and the ship's timbers.
//
// 3/4 at 180 crotchets a minute, one step a 16th: a bar is 12 steps,
// exactly one second, and EVERY bar of the song is a plain 3/4 bar, so her
// waltz (fairweatherDeck.js: you step on her beats, ONE two three, counted
// from the start of whatever section is playing) is always in time with
// what you hear. The intro plays once (12 s); then it loops from 'guest',
// 2m52s:
//
//   section     bars  time          what happens
//   midnight    12    (once, 12s)   the clock strikes twelve; a music box
//                                   lets the star fall; a fiddle tunes to the
//                                   tritone (D and G sharp) and plays her
//                                   giggle; then the band, brass hits across
//                                   the bar lines, and her laugh
//   guest       32    0:00-0:32     THE HOOK (phase 1, the laugh): violins,
//                                   flute and the ballroom piano over the
//                                   waltz; then everyone, trumpets, piccolo,
//                                   trombones, racing strings, choir
//   laughter    16    0:32-0:48     "NOBODY LEAVES!": brass bursts (three
//                                   quick notes, one long), each answered by
//                                   her laugh, over a viola ostinato winding
//                                   round and round; the lonely line above
//                                   it on the violins; then hits across the
//                                   bar lines into
//   spin        28    0:48-1:16     THE STAR'S OWN SECTION (phase 2, the
//                                   shower): the star is the tune. It falls
//                                   in the violins and brass from D, B flat,
//                                   G and A, each answered by a comet flying
//                                   up; then a slow star in the trumpets with
//                                   little ones raining round it in canon;
//                                   then the brass call it and the strings
//                                   giggle back, a step higher each time;
//                                   then it falls in half notes over the bar
//                                   lines, everyone, and lands (gong)
//   morning     20    1:16-1:36     THE TURN (44% in): "Is it morning?" F
//                                   major, near silence. A harp keeps the
//                                   waltz, the music box plays her giggle in
//                                   the major, a solo violin the lonely
//                                   line; the star rings slowly; her laugh
//                                   far off; then the band creeps back
//   masquerade  32    1:36-2:08     THE LOST WALTZ (phase 3, the carousel):
//                                   Port Tomorrow as a ballroom waltz (oboe
//                                   and violins, harp, cellos on ONE, violas
//                                   on two and three); it stops short of
//                                   home and the star falls into the gap;
//                                   then her hook in the same dress, the
//                                   strings spinning, the band growing
//   chaos       44    2:08-2:52     EVERYTHING AT ONCE (phase 4): the hook
//                                   at full size with little stars raining;
//                                   the hook cracking into E flat minor and
//                                   then A flat minor, laughing; Port
//                                   Tomorrow at full size, stopping short;
//                                   the star falls over the bar lines once
//                                   more and lands; the clock strikes twelve
//                                   again, and the party starts over
//
// Her fight starts a section for each phase (`musicFrom` in
// src/data/enemies/fairweather.js): 'spin' for the star shower, 'masquerade'
// for the carousel, 'chaos' for the end. Each opens on a full bar's ONE.

const SONG = 'Never Morning';
const BAR = 12;
const s16 = (text) => melody(text, 1);   // one token a 16th
const s8 = (text) => melody(text, 2);    // one token an 8th
const s4 = (text) => melody(text, 4);    // one token a crotchet
const rest = (n) => Array(n).fill('.');
const up = transpose;
const at = (n) => (n - 1) * BAR;          // where bar n (from 1) starts
const hold = (note, steps) => [typeof note === 'number' ? note : midi(note), ...Array(steps - 1).fill('-')];

// --- chords ---
const PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const pcOf = (name) => {
  if (typeof name === 'number') return ((name % 12) + 12) % 12;
  const m = name.match(/^([A-G])([#b]?)/);
  return (PC[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + 12) % 12;
};
// 'Dm', 'A7', 'A/C#', 'E7/G#', 'Bb', 'Ebm' -> { root, third, fifth, seventh, bass } (pitch classes)
function chordOf(symbol) {
  const m = symbol.match(/^([A-G][#b]?)(m|dim)?(7)?(?:\/([A-G][#b]?))?$/);
  if (!m) throw new Error(`${SONG}: can't read the chord '${symbol}'`);
  const root = pcOf(m[1]);
  const third = (root + (m[2] ? 3 : 4)) % 12;
  const fifth = (root + (m[2] === 'dim' ? 6 : 7)) % 12;
  const seventh = m[3] ? (root + 10) % 12 : null;
  return { root, third, fifth, seventh, bass: m[4] ? pcOf(m[4]) : root };
}
// The lowest note of pitch class `pc` at or above `lo`.
const near = (pc, lo) => lo + (((pc - lo) % 12) + 12) % 12;
const barsOf = (text) => text.split(/\s+/).filter(Boolean).map((c) => chordOf(c));

// --- the score: a section is built by laying parts on silent tracks ---
function score(name, length) {
  const tracks = {};
  const api = {
    length,
    // `clip`: cut whatever runs past the end of the section instead of failing
    put(track, from, steps, clip = false) {
      if (from + steps.length > length) {
        if (!clip) throw new Error(`${SONG} ${name}: '${track}' at step ${from} (${steps.length} steps) runs past ${length}`);
        steps = steps.slice(0, length - from);
      }
      const t = (tracks[track] ??= rest(length));
      steps.forEach((s, i) => { if (s !== '.') t[from + i] = s; });
      return api;
    },
    add(layer, from = 0) {
      for (const [track, steps] of Object.entries(layer)) api.put(track, from, steps);
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

// A note held `len` steps on a track array.
function note(track, from, n, len) {
  track[from] = n;
  for (let k = 1; k < len && from + k < track.length; k++) track[from + k] = '-';
}

// THE BAND, bar by bar (every bar 3/4, 12 steps; beats at 0, 4, 8).
//   tuba     the bass note on ONE
//   pump     the low strings churning in 8ths (basses on the bass note,
//            cellos root, root, fifth, root, octave, fifth)
//   pah      horns on two and three (third and fifth)
//   violas   violas on two and three, for the ballroom
//   cellos   cellos, bowed, on ONE (the ballroom)
//   harp     the harp's waltz: bass on ONE, the chord on two and three
//   timp     timpani on ONE
//   drums    'light' (kick on ONE, rim on two and three), 'waltz' (the same
//            and hi-hats in 8ths), 'drive' (kick on ONE and on the "and" of
//            two every other bar, rim on two, SNARE on three, hats, an open
//            hat each fourth bar), 'chaos' (drive with the ride, and the
//            snare on two and three)
function band(bars, o = {}) {
  const length = bars.length * BAR;
  const out = {};
  const T = (name) => (out[name] ??= rest(length));
  bars.forEach((c, i) => {
    const b = i * BAR;
    const lowBass = near(c.bass, 33);
    if (o.tuba) note(T('tuba'), b, lowBass, 4);
    if (o.pump) {
      for (let k = 0; k < 6; k++) note(T('basses'), b + 2 * k, lowBass, 1);
      const r = near(c.bass, 40);
      const f = near(c.fifth, r);
      [r, r, f, r, r + 12, f].forEach((n, k) => note(T('cellosPump'), b + 2 * k, n, 2));
    } else if (o.basses) note(T('basses'), b, lowBass, 3);
    if (o.pah) for (const p of [4, 8]) { note(T('pahLo'), b + p, near(c.third, 53), 3); note(T('pahHi'), b + p, near(c.seventh ?? c.fifth, 55), 3); }
    if (o.violas) for (const p of [4, 8]) { note(T('violaLo'), b + p, near(c.third, 55), 3); note(T('violaHi'), b + p, near(c.seventh ?? c.fifth, 60), 3); }
    if (o.cellos) note(T('cellos'), b, near(c.bass, 38), 4);
    if (o.harp) {
      note(T('harpLo'), b, near(c.bass, 38), 4);
      for (const p of [4, 8]) { note(T('harp'), b + p, near(c.third, 57), 2); note(T('harpHi'), b + p, near(c.fifth, 62), 2); }
    }
    if (o.timp) note(T('timpani'), b, near(c.root, 41), 1);
    const d = o.drums;
    if (d) {
      T('kick')[b] = 'x';
      if (d === 'light' || d === 'waltz') { T('rim')[b + 4] = 'x'; T('rim')[b + 8] = 'x'; }
      if (d === 'waltz') for (let k = 0; k < 12; k += 2) T('hats')[b + k] = 'x';
      if (d === 'drive' || d === 'chaos') {
        if (i % 2 === 1 || d === 'chaos') T('kick')[b + 6] = 'x';
        if (d === 'drive') T('rim')[b + 4] = 'x';
        else T('snare')[b + 4] = 'x';
        T('snare')[b + 8] = 'x';
        for (let k = 0; k < 12; k += 2) T(d === 'chaos' ? 'ride' : 'hats')[b + k] = 'x';
        if (i % (d === 'chaos' ? 2 : 4) === 3 || (d === 'chaos' && i % 2 === 1)) T('hatOpen')[b + 10] = 'x';
      }
    }
  });
  return out;
}

// Held chords, a bar each, one track per voice (root, third, fifth).
function pads(bars, names, lo) {
  const out = {};
  names.forEach((name, v) => {
    out[name] = bars.flatMap((c) => hold(near([c.root, c.third, c.fifth][v], lo), BAR));
  });
  return out;
}
// Racing 16ths up and down each chord, from `lo`.
function race(bars, lo) {
  const shape = [0, 1, 2, 3, 4, 3, 2, 1, 0, 1, 2, 3];
  return bars.flatMap((c) => {
    const base = near(c.root, lo);
    const tones = [base, near(c.third, base), near(c.fifth, base)];
    const ladder = [...tones, tones[0] + 12, near(c.third, base) + 12];
    return shape.map((k) => ladder[k]);
  });
}
// The viola ostinato in 'laughter', winding round each chord's root in 8ths:
// root, a step up, the third, a step up, root, a semitone under.
const winding = (bars, lo) => bars.flatMap((c) => {
  const r = near(c.root, lo);
  return [r, r + 2, near(c.third, r), r + 2, r, r - 1].flatMap((n) => [n, '-']);
});
// A comet flying up: six 16ths up the chord, the last held.
function comet(c, lo, len = 8) {
  const r = near(c.root, lo);
  const t = near(c.third, r);
  const f = near(c.fifth, r);
  const notes = [r, t, f, r + 12, t + 12, f + 12];
  return [...notes, ...Array(len - notes.length).fill('-')];
}
// Brass and timpani hits across the bar lines (a hemiola: three half notes
// over two bars of 3/4), on `chords` (three symbols), from `from`.
function hemiola(s, from, chords, { tb = true } = {}) {
  chords.forEach((sym, k) => {
    const c = chordOf(sym);
    const p = from + 8 * k;
    s.put('stabHi', p, hold(near(c.root, 69), 6)).put('stabMid', p, hold(near(c.third, 62), 6));
    if (tb) s.put('stabLo', p, hold(near(c.bass, 46), 6));
    s.put('tuba', p, hold(near(c.bass, 33), 6)).put('timpani', p, [near(c.root, 41)]);
    s.hit('kick', p).hit('crash', p);
  });
}

// --- her laugh ---
// "HA ha ha ha haaa": 8ths falling by semitones, the last held.
function laugh(top, len = BAR) {
  const hi = typeof top === 'number' ? top : midi(top);
  const out = rest(len);
  [0, 2, 4, 6, 8].forEach((p, i) => { if (p < len) out[p] = hi - i; });
  for (let k = 9; k < Math.min(len, 12); k++) out[k] = '-';
  return out;
}
// HA! HA! HA!, on the beats, each a semitone lower.
function haha(top) {
  const hi = typeof top === 'number' ? top : midi(top);
  const out = rest(BAR);
  [0, 4, 8].forEach((p, i) => { out[p] = hi - i; out[p + 1] = '-'; });
  return out;
}

// The cymbal swell is loudest 3.18 s in (sampleSets.js): 38 steps here.
const SWELL = [60, ...Array(37).fill('-')];
const swellInto = (s, step) => s.put('swell', step - 38, SWELL);

// THE STAR'S OWN BELLS (shared by every star guardian's song): wherever the
// star falls, the tubular bells ring it and the glockenspiel rings it high,
// both in tune, each only where all four notes sit on its recordings.
const fits = (sample, notes) => notes.every((n) => SAMPLE_SETS[sample].notes.some((r) => Math.abs(r - n) <= 2));
function starRing(s, from, tonic, { lengths = STAR_LENGTHS_WALTZ, unit = 2, bells = true, glock = true } = {}) {
  const pc = pcOf(tonic);
  const fall = (t) => starFall(t, { lengths, unit });
  const low = [near(pc, 58), near(pc, 58) - 12].find((t) => fits('chimes', starNotes(t)));
  const high = [near(pc, 84), near(pc, 72), near(pc, 96)].find((t) => fits('glock', starNotes(t)));
  if (bells && low != null) s.put('starBells', from, fall(low), true);
  if (glock && high != null) s.put('starGlock', from, fall(high), true);
  return s;
}
// Her wood creaks on the star's slip (the crack), with the timpani on the
// flat fifth: `from` is where the star starts, `slipAt` how far in the slip is.
function crack(s, from, tonic, slipAt = 4) {
  s.put('creak', from + slipAt, [60 + ((pcOf(tonic) + 6) % 8)]);
  s.put('timpani', from + slipAt, [near(pcOf(tonic) + 6, 41)]);
}

// ------------------------------------------------------------- the tunes
const HOOK = [
  ...s8('D5 - - - A5 -   Bb5 A5 G#5 A5 - -   F5 - - - D6 -   Eb6 D6 C#6 D6 - -'),
  ...s8('F6 - - E6 D6 C6   Bb5 - - A5 G5 F5   C#5 - E5 - G5 -   A5 - - - . .'),
  ...s8('D5 - - - A5 -   Bb5 A5 G#5 A5 - -   A5 - - - F6 -   E6 D6 C#6 D6 - -'),
  ...starFall('D5', { lengths: STAR_LENGTHS_WALTZ }),
  ...s16('F6 E6 Eb6 D6 Db6 C6 B5 Bb5 A5 - - -'),
  ...s8('E5 - A5 - C#6 -   A5 - - G5 F5 E5'),
];
const HOOK_CHORDS = 'Dm A/C# F/C G/B Bb Gm A A7 Dm A/C# F/C G/B Bb Eb A A7';
// (Each tune is checked for whole bars when the song loads.)
const whole = (name, line, bars) => {
  if (line.length !== bars * BAR) throw new Error(`${SONG}: ${name} is ${line.length} steps, not ${bars} bars`);
  return line;
};
whole('the hook', HOOK, 16);

// THE LONELY LINE, a crotchet a token.
const LONELY = whole('the lonely line', s4(`
  A5 - -   Bb5 - G5   F5 - -   E5 - -   D6 - -   D6 - Bb5   C#6 - -   A5 - -
  A5 - -   Bb5 - D6   F6 - -   E6 - -   Eb6 - -  D6 - Bb5   C#6 - -   E6 - -
`), 16);
// ...and in the major, for the false dawn.
const LONELY_MAJOR = whole('the lonely line in F', s4('A5 - -   Bb5 - G5   F5 - -   E5 - -   D6 - -   C6 - A5   D6 - Bb5   C6 - -'), 8);

// PORT TOMORROW, the lost waltz: the shanty in D minor, up where a ballroom
// would have it, stopping on the C sharp as it always does.
const LOST_WALTZ = whole('the lost waltz', up(s8([SHANTY[0], SHANTY[1], SHANTY[2], NO_PORT].join(' ')), 14), 16);
const LOST_WALTZ_CHORDS = 'Dm Bb F A Dm Bb Gm F Bb Gm Dm A Dm Bb A A';

// ----------------------------------------------------------- midnight (intro)
const midnight = (() => {
  const s = score('midnight', 12 * BAR);
  // 1-4: the clock strikes twelve, a stroke a beat; the music box lets the
  // star fall, slowly; the bells answer it under the strokes
  for (let k = 0; k < 12; k++) s.put('clock', 4 * k, [midi('D4')]);
  s.put('lowTrem', 0, hold('D3', 4 * BAR)).put('hum', 0, hold('A3', 4 * BAR)).put('humMid', 0, hold('F4', 4 * BAR));
  s.put('box', 0, starFall('D6', { unit: 3 }));
  starRing(s, at(3), 'D', { lengths: STAR_LENGTHS, unit: 3, glock: false });
  s.put('creak', at(3) + 6, [62]);
  // 5-8: a fiddle tuned to the tritone, then her giggle; the harp starts the waltz
  const B = at(5);
  s.add(band(barsOf('Dm Dm Dm A7'), { harp: true }), B);
  s.put('solo', B, hold('D5', 8)).put('solo2', B, hold('G#4', 8));
  s.put('solo', B + BAR, hold('D5', 8)).put('solo2', B + BAR, hold('G#4', 8));
  s.put('solo', at(7), s8('D5 - - - A5 -   Bb5 A5 G#5 A5 - -'));
  s.put('laughFar', at(6) + 2, laugh('A5', 10));
  s.put('lowTrem', B, hold('D3', 4 * BAR));
  // 9-12: the band; brass hits across the bar lines; her laugh
  const C = at(9);
  s.add(band(barsOf('Dm Bb'), { pump: true, drums: 'light' }), C);
  hemiola(s, C, ['Dm', 'Dm', 'Bb']);
  s.add(band(barsOf('Gm A7'), { pump: true, drums: 'light' }), at(11));
  hemiola(s, at(11), ['Gm', 'Eb', 'A7']);
  s.put('race', at(11), race(barsOf('Gm A7'), 62));
  s.put('timpRoll', at(11), hold(near(9, 41), 2 * BAR - 1));
  s.put('roll', at(12), Array(BAR).fill('x'));
  s.put('laughVox', at(12) + 2, laugh('A5', 10)).put('giggle', at(12) + 2, up(laugh('A5', 10), -12));
  swellInto(s, 12 * BAR);
  return s.done();
})();

// --------------------------------------------------- guest (phase 1, the hook)
const guest = (() => {
  const s = score('guest', 32 * BAR);
  const hb = barsOf(HOOK_CHORDS);
  // 1-16: violins, flute and the ballroom piano over the waltz
  s.add(band(hb, { tuba: true, pump: true, pah: true, timp: true, drums: 'waltz' }));
  s.put('lead', 0, HOOK).put('leadFl', 0, HOOK).put('piano', 0, HOOK).put('pianoLo', 0, up(HOOK, -12));
  starRing(s, at(13), 'D');
  crack(s, at(13), 'D');
  s.put('laughVox', at(14), laugh('F5'));
  s.hit('crash', 0).hit('impact', 0).hit('crash', at(9));
  s.put('roll', at(16) + 6, Array(6).fill('x'));
  // 17-32: everyone
  const B = 16 * BAR;
  s.add(band(hb, { tuba: true, pump: true, pah: true, timp: true, drums: 'drive' }), B);
  s.put('lead', B, HOOK).put('leadFl', B, HOOK).put('picc', B, up(HOOK, 12));
  s.put('leadTp', B, up(HOOK, -12)).put('leadTb', B, up(HOOK, -24));
  s.put('race', B, race(hb, 62));
  s.add(pads(hb, ['choirLo', 'choirMid', 'choirHi'], 55), B);
  starRing(s, B + at(13), 'D');
  crack(s, B + at(13), 'D');
  s.put('laughVox', B + at(14), laugh('A5')).put('giggle', B + at(14), up(laugh('A5'), -12));
  for (let k = 0; k < 4; k++) s.hit('crash', B + at(1 + 4 * k));
  s.hit('impact', B).hit('gong', B + at(13));
  s.put('roll', B + at(16), Array(BAR).fill('x'));
  return s.done();
})();

// -------------------------------------------- laughter ("NOBODY LEAVES!")
const laughter = (() => {
  const s = score('laughter', 16 * BAR);
  const lb = barsOf('Dm Gm Bb A Bb Gm A A Dm Gm Bb A Eb Eb A A7');
  s.add(band(lb.slice(0, 14), { tuba: true, pump: true, timp: true, drums: 'drive' }));
  s.put('violaOst', 0, winding(lb, 57));
  s.put('lonely', 0, LONELY).put('lonelyLo', 0, up(LONELY, -12));
  // the bursts: three quick notes and a long one, louder each time
  [['A4', 'D5'], ['D5', 'G5'], ['F5', 'Bb5'], ['Bb4', 'Eb5']].forEach(([p, land], g) => {
    const b = at(1 + 4 * g);
    const burst = [...rest(6), ...s8(`${p} ${p} ${p}`), ...hold(land, 6), ...rest(6)];
    s.put('burst', b, burst).put('burstLo', b, up(burst, burst.some((n) => typeof n === 'number' && n > 78) ? -24 : -12));
    s.hit('crash', b + BAR).hit('snare', b + 6).hit('snare', b + 8).hit('snare', b + 10);
    // ...and she laughs back
    if (g < 3) {
      const top = [77, 81, 82][g];
      s.put('laughVox', b + 2 * BAR, laugh(top)).put('giggle', b + 2 * BAR, up(laugh(top), -12));
      s.put('glitter', b + 2 * BAR, up(laugh(top), 12));
    }
  });
  s.put('creak', at(4) + 3, [61]).put('creak', at(12) + 5, [63]);
  // 14: she laughs over the E flat; 15-16: hits across the bar lines
  s.put('laughVox', at(14), haha('Bb5')).put('giggle', at(14), up(haha('Bb5'), -12));
  s.add(band(lb.slice(14), { pump: true }), at(15));
  hemiola(s, at(15), ['A', 'Dm/A', 'A7']);
  s.put('race', at(15), race(lb.slice(14), 62));
  s.put('roll', at(16), Array(BAR).fill('x'));
  swellInto(s, 16 * BAR);
  return s.done();
})();

// ---------------------------------------------- spin (phase 2, the star's own)
// 28 bars where the Falling Star is the melody. Its shape never changes
// (high tonic, fifth, the slip, tonic); only its key, octave and pace.
const spin = (() => {
  const s = score('spin', 28 * BAR);
  // 1-8: THE STAR AS A WALTZ TUNE, in crotchets over two bars (quick, quick,
  // a breath, long), from D, B flat, G and A (i, VI, iv, V); each answered
  // by a comet flying up the chord in the flutes and spiccato strings
  const A = barsOf('Dm Dm Bb Bb Gm Gm A A');
  s.add(band(A, { tuba: true, pump: true, pah: true, timp: true, drums: 'drive' }));
  s.add(pads(A, ['choirLo', 'choirMid', 'choirHi'], 55));
  ['D5', 'Bb4', 'G4', 'A4'].forEach((t, k) => {
    const b = at(1 + 2 * k);
    const big = starFall(t, { lengths: STAR_LENGTHS_WALTZ, unit: 4 });
    s.put('lead', b, big).put('leadTp', b, up(big, -12)).put('horns', b, up(big, -24)).put('leadTb', b, up(big, -24));
    starRing(s, b, t, { unit: 4 });
    crack(s, b, t, 8);
    const c = A[2 * k];
    s.put('comet', b + 16, comet(c, 67)).put('race', b + 16, comet(c, 55));
    s.hit('crash', b);
  });
  s.hit('impact', 0).hit('gong', 0);
  // 9-16: THE SHOWER. A slow star in the trumpets and trombones (half
  // notes), and little ones raining round it, a bar each, in canon a beat
  // apart (violins, flute an octave up, the glockenspiel), on every chord
  const B = at(9);
  const shower = barsOf('Dm Dm/C Bb A Gm Gm/F Eb A');
  s.add(band(shower, { tuba: true, pump: true, timp: true, drums: 'drive' }), B);
  s.add(pads(shower, ['choirLo', 'choirMid', 'choirHi'], 55), B);
  [['D4', 0], ['G3', 4]].forEach(([t, k]) => {
    const slow = starFall(t, { lengths: STAR_LENGTHS_WALTZ, unit: 8 });
    s.put('leadTp', B + at(1 + k), slow).put('leadTb', B + at(1 + k), up(slow, -12)).put('horns', B + at(1 + k), up(slow, -12));
    starRing(s, B + at(1 + k), t, { unit: 8, glock: false });
    s.put('creak', B + at(1 + k) + 16, [60 + k]);
  });
  shower.forEach((c, i) => {
    const b = B + i * BAR;
    const small = (lo) => starFall(near(c.root, lo), { lengths: STAR_LENGTHS_WALTZ });
    s.put('lead', b, small(62)).put('leadFl', b + 4, small(74), true);
    const g = near(c.root, 84);
    if (fits('glock', starNotes(g))) s.put('starGlock', b + 8, small(84), true);
    s.put('race', b, race([c], 67));
  });
  s.hit('crash', B).hit('crash', B + at(5)).hit('gong', B + at(5));
  // 17-24: the brass call the star, the strings giggle back (the hook's
  // giggle, round the fifth), a step higher each time: D, E, F, G
  const C = at(17);
  const climb = barsOf('Dm Dm Em Em F F Gm Gm');
  s.add(band(climb, { tuba: true, pump: true, pah: true, timp: true, drums: 'drive' }), C);
  s.add(pads(climb, ['choirLo', 'choirMid', 'choirHi'], 55), C);
  const tonics = ['D', 'E', 'F', 'G'];
  tonics.forEach((t, k) => {
    const b = C + 2 * k * BAR;
    const tonic = near(pcOf(t), 62);
    const call = starFall(tonic, { lengths: STAR_LENGTHS_WALTZ });
    s.put('leadTp', b, call).put('leadTb', b, up(call, -12)).put('horns', b, up(call, -24));
    s.put('lead', b, call).put('leadFl', b, up(call, 12)).put('picc', b, up(call, 24));
    starRing(s, b, t);
    crack(s, b, t);
    // the answer: the giggle round the fifth (an octave up), then a run
    // up to the next star's top note
    const f = tonic + 7;
    const next = k < 3 ? near(pcOf(tonics[k + 1]), 62) + 12 : midi('D6');
    const answer = [f + 1, '-', f, '-', f - 1, '-', f, '-', next - 4, next - 3, next - 2, next - 1];
    s.put('lead', b + BAR, answer).put('leadFl', b + BAR, up(answer, 12)).put('piano', b + BAR, answer);
    s.put('race', b + BAR, race([climb[2 * k + 1]], 62));
    s.put('laughVox', b + BAR, haha(Math.min(f + 12, 84)));
    s.hit('crash', b);
  });
  // 25-28: THE STAR OVER THE BAR LINES: everyone, in dotted crotchets and
  // half notes (D on ONE, A on the "and" of two, the slip on the next ONE,
  // the landing on the ONE after), and it lands with the gong
  const D = at(25);
  const land = barsOf('Bb E7/G# Dm');
  s.add(band(land, { pump: true }), D);
  const hemi = { lengths: STAR_LENGTHS_WALTZ, unit: 6 };
  const H = starFall('D5', hemi);
  s.put('lead', D, H).put('leadFl', D, H).put('picc', D, up(H, 12)).put('leadTp', D, up(H, -12));
  s.put('leadTb', D, up(H, -24)).put('horns', D, up(H, -24)).put('choirBig', D, up(H, -12));
  starRing(s, D, 'D', hemi);
  for (const [p, n] of [[0, 'Bb1'], [6, 'Bb1'], [12, 'G#1'], [24, 'D2']]) {
    s.put('tuba', D + p, hold(n, 6)).put('timpani', D + p, [near(pcOf(n), 41)]).hit('kick', D + p).hit('crash', D + p);
  }
  s.put('creak', D + 12, [62]);
  s.put('braam', D + 24, hold('D3', 2 * BAR)).put('braamLow', D + 24, hold('D2', 2 * BAR));
  s.hit('gong', D + 24).hit('impact', D + 24);
  s.put('timpRoll', D + 12, hold(44, 12));
  // 28: the land rings; one laugh in the quiet, and the low A
  s.put('lowTrem', at(28), hold('A3', BAR)).put('laughVox', at(28) + 2, laugh('C#6', 10));
  return s.done();
})();

// --------------------------------------------------- morning (the turn)
const morning = (() => {
  const s = score('morning', 20 * BAR);
  const mb = barsOf('F Dm Bb C F C/E Dm Bb F Am Bb C Dm Bb Gm A Dm Dm A A');
  // the harp keeps the waltz all the way through (her beats never stop)
  s.add(band(mb, { harp: true }));
  // 1-4: the music box plays her giggle in the major; the B natural (F's
  // flat fifth, the star's slip again) is still in it
  s.put('box', 0, s8('F5 - - - C6 -   D6 C6 B5 C6 - -   A5 - - - F6 -   G6 F6 E6 F6 - -'));
  s.put('glass', at(2) + 9, [82]).put('glass', at(4) + 9, [86]);
  // 5-12: "Is it morning?": the lonely line on a solo violin
  s.put('solo', at(5), LONELY_MAJOR);
  s.add(pads(mb.slice(4, 16), ['hum', 'humMid', 'humHigh'], 53), at(5));
  s.put('cellos', at(9), mb.slice(8, 12).flatMap((c) => hold(near(c.bass, 38), BAR)));
  s.put('laughFar', at(12) + 4, laugh('E5', 8));
  // 13-16: the star at half speed, on the piano and its bells, then again
  // an octave down
  const slow = { lengths: STAR_LENGTHS_WALTZ, unit: 4 };
  s.put('piano', at(13), starFall('D5', slow)).put('piano', at(15), starFall('D4', slow));
  starRing(s, at(13), 'D', slow);
  s.put('creak', at(14) + 2, [60]);
  // 17-20: the band creeps back
  s.put('trem', at(17), [...hold('D5', 2 * BAR), ...hold('C#5', 2 * BAR)]);
  s.put('tremLo', at(17), [...hold('A4', 2 * BAR), ...hold('A4', 2 * BAR)]);
  s.add(band(mb.slice(16), { pump: true, drums: 'light' }), at(17));
  s.put('timpRoll', at(17), hold('D3', 4 * BAR - 2));
  s.put('race', at(20), race([mb[19]], 57));
  s.put('roll', at(20), Array(BAR).fill('x'));
  s.put('laughVox', at(20) + 2, laugh('E5', 10));
  swellInto(s, 20 * BAR);
  return s.done();
})();

// ---------------------------------------- masquerade (phase 3, the lost waltz)
const masquerade = (() => {
  const s = score('masquerade', 32 * BAR);
  const wb = barsOf(LOST_WALTZ_CHORDS);
  // 1-16: Port Tomorrow as a ballroom waltz: oboe and violins, the clarinet
  // under them, the harp turning, cellos on ONE and violas on two and three
  s.add(band(wb.slice(0, 15), { cellos: true, violas: true, harp: true, basses: true, drums: 'waltz' }));
  s.put('oboe', 0, LOST_WALTZ).put('lead', 0, LOST_WALTZ).put('clar', 0, up(LOST_WALTZ, -12));
  s.put('harpRun', 0, wb.slice(0, 15).flatMap((c) => {
    const r = near(c.root, 62);
    return [r, near(c.third, r), near(c.fifth, r), r + 12, near(c.third, r) + 12, near(c.fifth, r) + 12].flatMap((n) => [n, '-']);
  }));
  for (let b = 0; b < 15; b++) s.put('glitter', at(b + 1) + 10, [near(wb[b].fifth, 91)]);
  s.hit('crash', 0);
  s.put('creak', at(8) + 7, [64]);
  // 16: it stops short of home, on the C sharp; the star falls into the gap
  s.put('cellos', at(16), hold('A2', 4)).put('basses', at(16), hold('A1', 3));
  s.put('box', at(16) + 4, starFall('D6', { lengths: STAR_LENGTHS, unit: 1 }));
  starRing(s, at(16) + 4, 'D', { lengths: STAR_LENGTHS, unit: 1 });
  // 17-32: her hook in the same dress: oboe and violins, the piccolo high,
  // the strings spinning; the trumpets join for the second half
  const B = at(17);
  const hb = barsOf(HOOK_CHORDS);
  s.add(band(hb.slice(0, 8), { cellos: true, violas: true, harp: true, basses: true, timp: true, drums: 'waltz' }), B);
  s.add(band(hb.slice(8), { tuba: true, pump: true, violas: true, timp: true, drums: 'drive' }), B + at(9));
  s.put('lead', B, HOOK).put('oboe', B, HOOK).put('picc', B, up(HOOK, 12));
  s.put('clar', B, up(HOOK, -12));
  s.put('leadTp', B + at(9), up(HOOK.slice(8 * BAR), -12)).put('leadTb', B + at(13), up(HOOK.slice(12 * BAR), -24));
  // the carousel turning: spiccato strings round each chord's fifth
  s.put('race', B, hb.flatMap((c) => {
    const f = near(c.fifth, 67);
    return Array.from({ length: BAR }, (_, k) => f + [0, -1, 0, 1][k % 4]);
  }));
  s.add(pads(hb.slice(8), ['choirLo', 'choirMid', 'choirHi'], 55), B + at(9));
  starRing(s, B + at(13), 'D');
  crack(s, B + at(13), 'D');
  s.put('laughVox', B + at(14), laugh('A5')).put('giggle', B + at(14), up(laugh('A5'), -12));
  s.hit('crash', B).hit('crash', B + at(9)).hit('impact', B + at(9)).hit('crash', B + at(13));
  s.put('roll', B + at(16), Array(BAR).fill('x'));
  swellInto(s, 32 * BAR);
  return s.done();
})();

// -------------------------------------------- chaos (phase 4, all at once)
const chaos = (() => {
  const s = score('chaos', 44 * BAR);
  const hb = barsOf(HOOK_CHORDS);
  // 1-16: the hook at full size, little stars raining over it
  s.add(band(hb, { tuba: true, pump: true, pah: true, timp: true, drums: 'chaos' }));
  s.put('lead', 0, HOOK).put('leadFl', 0, HOOK).put('picc', 0, up(HOOK, 12)).put('piano', 0, HOOK);
  s.put('leadTp', 0, up(HOOK, -12)).put('leadTb', 0, up(HOOK, -24));
  s.put('race', 0, race(hb, 62));
  s.add(pads(hb, ['choirLo', 'choirMid', 'choirHi'], 55));
  hb.forEach((c, i) => {
    if (i === 12) return;
    const g = near(c.root, 84);
    if (fits('glock', starNotes(g))) s.put('starGlock', at(i + 1) + 4, starFall(g, { lengths: STAR_LENGTHS_WALTZ, unit: 1 }));
  });
  starRing(s, at(13), 'D');
  crack(s, at(13), 'D');
  s.put('braam', 0, hold('D3', BAR)).put('braamLow', 0, hold('D2', BAR)).hit('gong', 0).hit('impact', 0);
  for (let k = 0; k < 8; k++) s.hit('crash', at(1 + 2 * k));
  s.put('laughVox', at(8) + 4, haha('A5').slice(0, 8)).put('laughVox', at(14), laugh('A5')).put('giggle', at(14), up(laugh('A5'), -12));
  // 17-24: the hook cracks: up a semitone into E flat minor, then down a
  // tritone into A flat minor; she laughs in every gap
  const B = at(17);
  const key = (k, shift, chords) => {
    const b = B + 4 * k * BAR;
    const bars = barsOf(chords);
    const line = up(HOOK.slice(0, 4 * BAR), shift);
    s.add(band(bars, { tuba: true, pump: true, pah: true, timp: true, drums: 'chaos' }), b);
    s.put('lead', b, line).put('leadFl', b, line).put('picc', b, up(line, 12)).put('leadTp', b, up(line, -12)).put('leadTb', b, up(line, -24));
    s.put('race', b, race(bars, 62));
    s.add(pads(bars, ['choirLo', 'choirMid', 'choirHi'], 55), b);
    s.put('laughVox', b + BAR + 6, haha(line[0] + 7).slice(0, 6));
    s.put('laughVox', b + 3 * BAR + 6, haha(line[0] + 9).slice(0, 6));
    s.hit('crash', b).hit('gong', b).hit('crash', b + 2 * BAR);
    s.put('creak', b + 2 * BAR + 3, [60 + k * 3]);
  };
  key(0, 1, 'Ebm Bb/D Gb/Db Ab/C');
  key(1, -6, 'G#m D#/G B/F# C#/F');
  // 25-32: Port Tomorrow at full size, under her laughter; it stops short
  const C = at(25);
  const portBig = up(s8([SHANTY[1], NO_PORT].join(' ')), 14);
  const pb = barsOf('Dm Bb Gm F Dm Bb A A');
  s.add(band(pb.slice(0, 7), { tuba: true, pump: true, pah: true, timp: true, drums: 'chaos' }), C);
  s.put('lead', C, portBig).put('oboe', C, portBig).put('leadTp', C, up(portBig, -12)).put('choirBig', C, up(portBig, -12));
  s.put('leadTb', C, up(portBig, -24)).put('horns', C, up(portBig, -24));
  s.add(pads(pb, ['choirLo', 'choirMid'], 52), C);
  s.put('glitter', C + at(2), up(laugh('A6'), 0)).put('glitter', C + at(6), up(laugh('C7'), 0));
  s.hit('crash', C).hit('impact', C).hit('crash', C + at(5));
  s.put('laughVox', C + at(8), laugh('C#6')).put('giggle', C + at(8), up(laugh('C#6'), -12));
  s.put('roll', C + at(8) + 6, Array(6).fill('x'));
  // 33-36: the star over the bar lines once more, everyone, and it lands
  const D = at(33);
  s.add(band(barsOf('Bb E7/G# Dm'), { pump: true, pah: true }), D);
  const hemi = { lengths: STAR_LENGTHS_WALTZ, unit: 6 };
  const H = starFall('D5', hemi);
  s.put('lead', D, H).put('leadFl', D, H).put('picc', D, up(H, 12)).put('leadTp', D, up(H, -12));
  s.put('leadTb', D, up(H, -24)).put('horns', D, up(H, -24)).put('choirBig', D, up(H, -12)).put('oboe', D, H);
  starRing(s, D, 'D', hemi);
  // little stars tumbling in 16ths round the big one
  for (let k = 0; k < 4; k++) s.put('race', D + 6 * k, starFall(k % 2 ? 'A5' : 'D5', { lengths: STAR_LENGTHS_WALTZ, unit: 1 }));
  for (const [p, n] of [[0, 'Bb1'], [6, 'Bb1'], [12, 'G#1'], [24, 'D2']]) {
    s.put('tuba', D + p, hold(n, 6)).put('timpani', D + p, [near(pcOf(n), 41)]).hit('kick', D + p).hit('crash', D + p);
  }
  s.put('creak', D + 12, [61]);
  s.put('braam', D + 24, hold('D3', 2 * BAR)).put('braamLow', D + 24, hold('D2', 2 * BAR));
  s.hit('gong', D + 24).hit('impact', D + 24);
  s.put('timpRoll', D + 12, hold(44, 12));
  s.put('laughVox', at(36) + 2, laugh('D6', 10)).put('giggle', at(36) + 2, up(laugh('D6', 10), -12));
  // 37-40: the clock strikes twelve again. The night starts over.
  const E = at(37);
  for (let k = 0; k < 12; k++) s.put('clock', E + 4 * k, [midi('D4')]);
  s.put('lowTrem', E, hold('D3', 4 * BAR)).put('hum', E, hold('A3', 4 * BAR)).put('humMid', E, hold('F4', 4 * BAR));
  s.put('box', E, starFall('D6', { unit: 3 }));
  s.add(band(barsOf('Dm Dm Dm A7'), { harp: true }), E);
  s.put('laughFar', E + at(3) + 2, laugh('A5', 10));
  // 41-44: the band again, hits across the bar lines, into the hook
  const F = at(41);
  s.add(band(barsOf('Dm Bb'), { pump: true, drums: 'light' }), F);
  hemiola(s, F, ['Dm', 'Dm', 'Bb']);
  s.add(band(barsOf('Gm A7'), { pump: true, drums: 'light' }), F + at(3));
  hemiola(s, F + at(3), ['Gm', 'Eb', 'A7']);
  s.put('race', F + at(3), race(barsOf('Gm A7'), 62));
  s.put('timpRoll', F + at(3), hold(near(9, 41), 2 * BAR - 1));
  s.put('roll', F + at(4), Array(BAR).fill('x'));
  s.put('laughVox', F + at(4) + 2, laugh('A5', 10)).put('giggle', F + at(4) + 2, up(laugh('A5', 10), -12));
  swellInto(s, 44 * BAR);
  return s.done();
})();

// ------------------------------------------------------------ the players
// Where a note lands too far from any recording (more than two semitones),
// it moves by octaves to the nearest that fits (or stays put if none does).
function settleNotes(instruments, sections) {
  const reach = (sample, n) => Math.min(...SAMPLE_SETS[sample].notes.map((r) => Math.abs(r - n))) <= 2;
  for (const section of Object.values(sections)) {
    for (const [track, steps] of Object.entries(section)) {
      const sample = instruments[track]?.sample;
      if (!sample || instruments[track].drum || track.startsWith('glitter')) continue;
      for (let i = 0; i < steps.length; i++) {
        if (typeof steps[i] !== 'number' || reach(sample, steps[i])) continue;
        const moved = [-12, 12, -24, 24].map((k) => steps[i] + k).find((m) => reach(sample, m));
        if (moved != null) steps[i] = moved;
      }
    }
  }
  return sections;
}

const instruments = {
  // the tune
  lead: { ...ORCHESTRA.violins, volume: 0.3 },
  leadFl: { sample: 'flute', volume: 0.24, attack: 0.01, release: 0.12, reverb: 0.35, pan: 0.15, humanize: { time: 0.005, volume: 0.1 } },
  picc: { sample: 'piccolo', volume: 0.13, attack: 0.01, release: 0.1, reverb: 0.35, pan: 0.25, humanize: { time: 0.005, volume: 0.1 } },
  oboe: { sample: 'oboe', volume: 0.28, attack: 0.02, release: 0.15, reverb: 0.4, pan: -0.1, humanize: { time: 0.006, volume: 0.1 } },
  clar: { sample: 'clarinet', volume: 0.2, attack: 0.02, release: 0.15, reverb: 0.4, pan: 0.2, humanize: { time: 0.006, volume: 0.1 } },
  leadTp: { ...ORCHESTRA.trumpets, volume: 0.3 },
  leadTb: { ...ORCHESTRA.trombones, volume: 0.26 },
  horns: { ...ORCHESTRA.horns, volume: 0.28 },
  // the ballroom piano
  piano: { sample: 'grandPiano', volume: 0.22, release: 0.2, reverb: 0.35, pan: -0.15, humanize: { time: 0.006, volume: 0.12 } },
  pianoLo: { sample: 'grandPiano', volume: 0.14, release: 0.2, reverb: 0.35, pan: -0.25, humanize: { time: 0.006, volume: 0.12 } },
  // the lonely line, and the fiddle
  lonely: { ...ORCHESTRA.violinsHigh, volume: 0.24, attack: 0.12, release: 0.5 },
  lonelyLo: { sample: 'violas', volume: 0.16, attack: 0.12, release: 0.5, reverb: 0.4, pan: 0.2 },
  solo: { ...ORCHESTRA.soloViolin, volume: 0.42, attack: 0.05, release: 0.6, reverb: 0.55, humanize: { time: 0.01, volume: 0.08 } },
  solo2: { ...ORCHESTRA.soloViolin, volume: 0.3, attack: 0.05, release: 0.6, detune: -12, reverb: 0.55, pan: -0.1 },
  // brass calls and hits
  burst: { ...ORCHESTRA.trumpets, volume: 0.34, release: 0.12 },
  burstLo: { ...ORCHESTRA.trombones, volume: 0.28, release: 0.12 },
  stabHi: { ...ORCHESTRA.trumpets, volume: 0.28, release: 0.12 },
  stabMid: { ...ORCHESTRA.horns, volume: 0.28, release: 0.15 },
  stabLo: { ...ORCHESTRA.trombones, volume: 0.28, release: 0.15 },
  braam: { ...ORCHESTRA.braam, volume: 0.45 },
  braamLow: { ...ORCHESTRA.braamLow, volume: 0.45 },
  // the band
  tuba: { ...ORCHESTRA.tuba, volume: 0.32, release: 0.15, humanize: { time: 0.004, volume: 0.1 } },
  basses: { ...ORCHESTRA.basses, volume: 0.3 },
  cellosPump: { ...ORCHESTRA.pound, volume: 0.22 },
  cellos: { sample: 'cellos', volume: 0.24, attack: 0.03, release: 0.3, reverb: 0.4, pan: -0.25 },
  pahLo: { sample: 'horns', volume: 0.15, release: 0.1, reverb: 0.35, pan: -0.15, humanize: { time: 0.005, volume: 0.15 } },
  pahHi: { sample: 'horns', volume: 0.15, release: 0.1, reverb: 0.35, pan: 0.15, humanize: { time: 0.005, volume: 0.15 } },
  violaLo: { sample: 'violas', volume: 0.15, attack: 0.02, release: 0.12, reverb: 0.35, pan: 0.2, humanize: { time: 0.005, volume: 0.12 } },
  violaHi: { sample: 'violas', volume: 0.13, attack: 0.02, release: 0.12, reverb: 0.35, pan: 0.3, humanize: { time: 0.005, volume: 0.12 } },
  violaOst: { sample: 'violas', volume: 0.2, attack: 0.01, release: 0.08, reverb: 0.3, pan: 0.25, humanize: { time: 0.005, volume: 0.12 } },
  race: { ...ORCHESTRA.race, volume: 0.15 },
  trem: { sample: 'violinsTrem', volume: 0.18, attack: 0.6, release: 0.4, reverb: 0.45, pan: 0.2 },
  tremLo: { sample: 'violasTrem', volume: 0.15, attack: 0.6, release: 0.4, reverb: 0.45, pan: -0.2 },
  lowTrem: { sample: 'cellosTrem', volume: 0.2, attack: 0.6, release: 0.8, reverb: 0.5, pan: -0.2 },
  // harp and glitter
  harp: { sample: 'harp', volume: 0.18, ring: true, reverb: 0.45, pan: -0.25, humanize: { time: 0.006, volume: 0.15 } },
  harpHi: { sample: 'harp', volume: 0.15, ring: true, reverb: 0.45, pan: -0.15, humanize: { time: 0.006, volume: 0.15 } },
  harpLo: { sample: 'harp', volume: 0.22, ring: true, reverb: 0.4, pan: -0.3, humanize: { time: 0.006, volume: 0.1 } },
  harpRun: { sample: 'harp', volume: 0.16, ring: true, reverb: 0.5, pan: 0.3, humanize: { time: 0.006, volume: 0.15 } },
  comet: { sample: 'flute', volume: 0.2, attack: 0.01, release: 0.1, reverb: 0.45, pan: 0.3, humanize: { time: 0.004, volume: 0.15 } },
  glitter: { sample: 'glock', volume: 0.09, ring: true, reverb: 0.6, pan: 0.4, humanize: { time: 0.004, volume: 0.2 } },
  glass: { sample: 'glass', volume: 0.12, ring: true, reverb: 0.7, pan: -0.3 },
  // the music box, a little flat; the clock
  box: { sample: 'glock', volume: 0.2, ring: true, detune: -22, drift: 8, wow: { cents: 12, rate: 0.5 }, reverb: 0.55, pan: 0.2, echo: { time: 0.333, feedback: 0.25, mix: 0.2 } },
  clock: { sample: 'chimes', volume: 0.17, ring: true, detune: -8, reverb: 0.6, pan: -0.2, humanize: { time: 0.004, volume: 0.08 } },
  // the star's own bells (starRing), in tune
  starBells: { sample: 'chimes', volume: 0.27, ring: true, reverb: 0.5, pan: -0.05, humanize: { time: 0.003, volume: 0.06 } },
  starGlock: { sample: 'glock', volume: 0.18, ring: true, reverb: 0.5, pan: 0.15, echo: { time: 0.333, feedback: 0.2, mix: 0.15 } },
  // voices: her laugh, staccato and never quite in tune; the choir
  laughVox: { sample: 'choir', volume: 0.32, attack: 0.005, release: 0.07, drift: 25, reverb: 0.5, pan: 0.15, humanize: { time: 0.008, volume: 0.2 } },
  giggle: { sample: 'violinsSpic', volume: 0.16, release: 0.05, drift: 20, reverb: 0.4, pan: -0.2, humanize: { time: 0.005, volume: 0.2 } },
  laughFar: { sample: 'choir', volume: 0.2, attack: 0.005, release: 0.1, detune: -20, drift: 30, muffle: 1800, reverb: 0.8, pan: -0.35, echo: { time: 0.333, feedback: 0.35, mix: 0.35 } },
  choirBig: { sample: 'choir', volume: 0.28, attack: 0.06, release: 0.5, reverb: 0.55, pan: 0.05 },
  choirLo: { sample: 'choir', volume: 0.12, attack: 0.25, release: 0.6, reverb: 0.55, pan: -0.2 },
  choirMid: { sample: 'choir', volume: 0.12, attack: 0.25, release: 0.6, reverb: 0.55 },
  choirHi: { sample: 'choir', volume: 0.12, attack: 0.25, release: 0.6, reverb: 0.55, pan: 0.2 },
  hum: { sample: 'choir', volume: 0.12, attack: 0.8, release: 1.2, reverb: 0.7, pan: -0.15 },
  humMid: { sample: 'choir', volume: 0.1, attack: 0.8, release: 1.2, reverb: 0.7, pan: 0.15 },
  humHigh: { sample: 'choir', volume: 0.08, attack: 0.8, release: 1.2, reverb: 0.7 },
  // percussion
  timpani: { ...ORCHESTRA.timpani, volume: 0.4 },
  timpRoll: { ...ORCHESTRA.timpRoll, volume: 0.3 },
  kick: { ...ORCHESTRA.bassDrum, volume: 0.54, humanize: { time: 0.003, volume: 0.12 } },
  snare: { ...ORCHESTRA.snare, volume: 0.32 },
  rim: { ...ORCHESTRA.rim, volume: 0.18 },
  roll: { ...ORCHESTRA.roll, volume: 0.18 },
  hats: { sample: 'hatClosed', drum: 'sample', volume: 0.13, ring: true, reverb: 0.15, pan: 0.25, humanize: { time: 0.004, volume: 0.3 } },
  hatOpen: { sample: 'hatOpen', drum: 'sample', volume: 0.12, ring: true, reverb: 0.2, pan: 0.25 },
  ride: { sample: 'ride', drum: 'sample', volume: 0.14, ring: true, reverb: 0.25, pan: -0.25, humanize: { time: 0.004, volume: 0.25 } },
  crash: { ...ORCHESTRA.crash, volume: 0.28 },
  gong: { ...ORCHESTRA.gong, volume: 0.38 },
  impact: { ...ORCHESTRA.impact, volume: 0.55 },
  swell: { ...ORCHESTRA.swell, volume: 0.28 },
  // the ship: her wood
  creak: { sample: 'shipTimbers', volume: 0.42, ring: true, detune: -200, reverb: 0.45, pan: -0.35, humanize: { time: 0.02, volume: 0.2 } },
};

// The quiet turn plays on quieter twins of its harp, fiddle and hum (the
// same notes), so it really is near silence after the star lands.
for (const track of ['harp', 'harpHi', 'harpLo', 'solo', 'hum', 'humMid', 'humHigh', 'box', 'piano', 'cellos']) {
  if (!morning[track]) continue;
  morning[`${track}Hush`] = morning[track];
  delete morning[track];
  instruments[`${track}Hush`] = { ...instruments[track], volume: instruments[track].volume * 0.55 };
}
const sections = settleNotes(instruments, { midnight, guest, laughter, spin, morning, masquerade, chaos });

export const FIGUREHEAD_BATTLE_THEME = {
  title: SONG,
  bpm: 180,
  stepsPerBeat: 4,
  volume: 1.4,
  instruments,
  sections,
  order: ['midnight', 'guest', 'laughter', 'spin', 'morning', 'masquerade', 'chaos'],
  loopFrom: 1,
};
