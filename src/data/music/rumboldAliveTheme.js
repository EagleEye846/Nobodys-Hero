import { melody, transpose, hits, HOLD, REST } from '../../audio/notation.js';
import { SAMPLE_SETS } from '../../audio/sampleSets.js';
import { midi, timpRoot, ORCHESTRA } from './parts/usurper.js';
import { cellIn, FIRST_STEPS_MINOR } from './parts/chapter4.js';

// "No Strings": the third and last part of the duel with King Peptup the
// Resplendent (after "The Resplendent Hour" and "Behind the Curtain"). Tuck
// lets go of the levers and the puppet keeps moving. A cold light kindles in
// his hollow chest, nobody is working him, and he strings Tuck up like a
// marionette and carries on the show alone, sure he really was the Hero's
// friend. The battle swaps to this song with the phase's `music`:
// `music: 'rumboldAlive'` on the phase where the puppet comes alive.
//
// WHAT IT SOUNDS LIKE: the show, possessed, at a sprint. The spine is a
// slow, sad piano tune (the king's four notes, one note every two beats)
// sitting on top of a breakbeat that runs at twice the speed underneath: the
// piano sings and the drums panic, both at once. Over that go the real
// orchestra (brass, strings, timpani, gong) for the weight, and a toy for the
// puppet: a music box (glockenspiel and harp) that plays the tune the way it
// always did, now a half-step wrong. The strings don't play so much as get
// yanked: short spiccato stabs that stop and start on a string pulled by
// somebody else. Real recordings only (VSCO 2 and VCSL, sampleSets.js); no
// choir, no synth. The whole song goes through the trailers' squeeze
// (`limit`), so the breaks hit hard and flat, the way a loud break should.
//
// THE HOOK ("the show-tune, wrong"): the chapter's cell, the king's four
// notes, in D minor: A D F E (up a fourth, up a third, a step back: it asks
// a question and doesn't finish). It is played two ways. SLOW is the
// piano's: a note every two beats, eight bars. FAST is the puppet's: the
// same four notes in one bar, jerking. In "The Resplendent Hour" the second
// phrase went up a third, bright. Here it goes up ONE SEMITONE (Bb Eb Gb F,
// the Neapolitan, the borrowed chord that means menace), and the last
// phrase falls through the tritone (Ab, as far from D as a note can be)
// before landing back on D. The tune alone on a piano is already the song.
// TUCK'S TUNE: the small stammering tune from "Behind the Curtain" (D D-G
// Bb A, G F Eb...) in G minor, re-barred into 4/4 (six bars). In D minor, G
// minor is the fourth degree: Tuck's key sits just beside the king's, and
// in the last big section the king's brass takes Tuck's key as its own.
//
// HOW IT IS BUILT (the boss recipe, with the breakbeat laid under it): the
// drums are a kit of real recordings (bass drum, snare and a ghost snare, a
// tenor drum as the hat, toms for fills), written as one-bar patterns that
// swap every other bar and fill every fourth: a chopped break (kick on 1,
// the "and" of 3 and a flam after it, snare on 2 and 4 with ghosts) for the
// drops, a half-time version (kick on 1, snare on 3) for the walks, and a
// two-step for the sad middle. The hook is doubled the Fox way, trumpets
// and violins at pitch, cellos an octave down, horns and trombones two
// octaves down (the horn recordings skip C#4 to Db5, so the horns live
// below it), tuba under, and a dry close grand piano carrying the same
// line; a glockenspiel on top is the toy-piano shine. A second trumpet line
// a hair sharp (14 cents) beats against the first and the horns sit a hair
// flat (10 cents): the "detuned brass" of a dread cue. Per-voice space:
// ticks, footfalls and the piano nearly dry, strings and brass in a hall,
// the music box wet with an echo. The drops are stacked: gong, deep bass
// drum, concert bass drum, crash, trombone and tuba BRAAAM (tuba an octave
// down), timpani. Bass walks by step (D Eb E F... up a chromatic ladder).
// One borrowed chord for colour (Eb, the flat second). A new tune every 25
// seconds or so, a pivot two-thirds in, and home before the loop. The
// builds are kept quieter than the drops.
//
// THE CREEP (what makes him wrong, not just loud):
//   THE MUSIC BOX OUT OF TRUE: the music box of the intro, the waltz and
//     HOME has a twin, a glockenspiel a third of a semitone flat and a harp
//     a quarter flat, playing the same notes a 16th late, so the box sounds warped and
//     doubled, like a toy left in the damp. (The flat box first turns up at
//     the end of "Behind the Curtain".)
//   STUCK ON WORDS: the way he sticks on "friends friends FRIENDS", the
//     tune sticks on the cell's first three notes, A D F, going round in
//     threes against the bar's fours so it never lines up, and can't get to
//     the fourth note. The intro's music box does it, the waltz is built on
//     it, and HOME does it on the piano.
//   THE WALTZ THAT SLIPS: a 3/4 waltz in the middle of a 4/4 breakbeat song,
//     its pah-pahs landing a 16th late, then a bar that loses a beat
//     altogether, as if the floor tipped.
//
// D minor; the climax in G minor; home in D minor. 176 BPM, one step a 16th,
// a bar of 4/4 is 16 steps = 1.36 seconds (the piano's half-speed tune
// feels like 88; a waltz bar is 12 steps, 1.02 seconds). The intro plays
// once (10.9s); then the loop runs from A: 2120 steps, 3m01s:
//
//   intro   8 bars  0:00 THE MUSIC BOX: the gong; the music box stuck on the
//                   king's first three notes, A D F A D F A D F... E, its
//                   flat twin creeping in a step behind, over a creaking low
//                   drone and little wooden ticks; (0:05) it snaps: the dry
//                   piano plays it at full speed, strings jerking; then the
//                   build (timpani roll, strings and horns climbing, a cymbal
//                   swell) and ONE BEAT of dead silence
//   A      16 bars  0:00 THE DROP (loop 0:00): gong, deep drum, BRAAAM, the
//                   break at full tilt; the slow hook on trumpets, piano,
//                   cellos, horns and trombones; the strings jerk in at bar 4,
//                   the piano hammers from bar 8, the toy shines
//   B      20 bars  0:22 THE LIMP: half-time. A new tune, a slow clarinet
//                   walk with a wrong note in it (G sharp against D) over a
//                   kick-and-snare that drags, the last beat always late;
//                   oboe, glockenspiel and a rippling piano join at 0:44; the
//                   hook creeps back in the low strings at 0:59
//   W      22 bars  0:49 THE WALTZ THAT SLIPS: the drums stop and it's 3/4,
//                   the music box and its flat twin waltzing the cell and
//                   sticking (A D F, A D F, A D F, E); (0:53) again on the
//                   flat second, the clarinet with it; (0:58) stuck for good,
//                   A D F four times, violins and sour trumpet on it, the
//                   pahs late, the bass climbing D Eb E F underneath; (1:02)
//                   a bar loses a beat, the piano stuck on F F F F; (1:03)
//                   gong and BRAAAM on the tritone, and the band stomps the
//                   hook as a waltz; (1:11) a chromatic slide back into 4/4
//   C      20 bars  1:12 STRUNG UP: Tuck's tune, music box then solo violin,
//                   fragile, a two-step starting under him while the king's
//                   tune begins to tread; (1:23) the brass drowns him, flute
//                   and violin keep singing over it; (1:34) Tuck's stammer
//                   cries out alone at the top, the snare rolls, and
//                   everything cuts off
//   D      16 bars  1:39 THE STRINGS PULL: the cell at full speed, climbing a
//                   semitone a bar over a bass that climbs with it (D Eb E F F#
//                   G Ab A), the break at full strength; then the hook comes
//                   home in D minor at half speed, piano first, with the bass;
//                   Tuck's stammer squeaks on the top every fourth bar
//   P       8 bars  2:01 THE LIGHT (the pivot, two-thirds in): no drums;
//                   bowed vibes and glass holding the tritone (the cold
//                   light), Tuck's tune on a lone piano and the music box, a
//                   heartbeat; then the climb to the dominant, a roll, a
//                   swell, and ONE BEAT of silence
//   E      24 bars  2:12 THE SECOND DROP, G minor: BRAAAM and gong; the
//                   hook on everything over the break; (2:23) Tuck's tune
//                   soars on the violins, horns and flute over the king's
//                   cell hammering in the trombones; (2:34) the hook again in
//                   G minor, (2:40) the cell climbing back up to A
//   H      12 bars  2:44 HOME: D minor, the piano alone with the hook, which
//                   sticks halfway (A D F, A D F...) and never finishes, the
//                   warped music box with it, a quiet half-time limp; Tuck's
//                   stammer squeaks twice; the king's cell low in the cellos;
//                   then the build and the silence, and the drop again at A

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
const onBars = (bars, list, pattern) => Array.from({ length: bars }, (_, i) => (list.includes(i) ? pattern : steps(pattern.length))).flat();
// A chromatic climb: `n` notes from `from`, `len` steps each.
const climb = (from, n, len = 4) => Array.from({ length: n }, (_, i) => [from + i, ...Array(len - 1).fill(H)]).flat();

function section(length, tracks) {
  return Object.fromEntries(Object.entries(tracks).map(([name, track]) => {
    if (track.length > length) throw new Error(`No Strings: '${name}' is ${track.length} steps, longer than ${length}`);
    return [name, [...track, ...steps(length - track.length)]];
  }));
}
// The whole band stops dead for the last beat (4 steps).
const stopdown = (tracks, n = 4) => Object.fromEntries(Object.entries(tracks).map(([name, track]) => [name, [...track.slice(0, -n), ...steps(n)]]));
// Every track of a bundle pushed `bars` bars later.
const place = (bars, tracks) => Object.fromEntries(Object.entries(tracks).map(([name, track]) => [name, at(bars, track)]));

// --- Chords: 'Dm', 'A7', 'Ebm'. Patterns name chord tones: R root, T third,
// F fifth, S seventh; '+' an octave up, '-' one down. One chord a bar. ---
const QUALITY = { '': [0, 4, 7, 12], m: [0, 3, 7, 12], 7: [0, 4, 7, 10], dim: [0, 3, 6, 9], aug: [0, 4, 8, 12] };
const NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
function chordOf(symbol) {
  const m = symbol.match(/^([A-G][#b]?)(m|7|dim|aug)?$/);
  if (!m) throw new Error(`No Strings: can't read the chord '${symbol}'`);
  return { root: midi(`${m[1]}4`) % 12, tones: QUALITY[m[2] ?? ''] };
}
const inBand = (pc, low) => low + ((pc - (low % 12) + 12) % 12);
function toneOf(chord, low, p) {
  const shift = p.endsWith('+') ? 12 : p.endsWith('-') ? -12 : 0;
  return inBand(chord.root, low) + chord.tones['RTFS'.indexOf(p[0])] + shift;
}
function comp(chords, pattern, low) {
  return chords.split(/\s+/).filter(Boolean).flatMap((bar) => {
    const chord = chordOf(bar);
    return pattern.map((p) => (p === R || p === H ? p : toneOf(chord, low, p)));
  });
}
const moveChords = (chords, by) => chords.replace(/([A-G][#b]?)(m|7|dim|aug)?/g, (_, root, q = '') => `${NAMES[(midi(`${root}4`) + by) % 12]}${q}`);
const bars = (chords, from, to) => chords.split(' ').slice(from, to).join(' ');
// Timpani on each chord's root.
const timps = (chords, pattern) => chords.split(/\s+/).filter(Boolean).flatMap((bar) => {
  const root = timpRoot(NAMES[chordOf(bar).root]);
  return pattern.map((p) => (typeof p === 'number' ? root + (root + p < 41 ? p + 12 : p) : p));
});

// --- THE HOOK, 8 bars, D minor. SLOW: a note every two beats (the piano's
// tune). FAST: a beat a note, one cell a bar (the puppet's). ---
const HOOK8 = h(`
  A4 D5 F5 E5      | Bb4 Eb5 Gb5 F5   |
  A4 D5 F5 A5      | Ab5 - E5 D5
`);
const HOOK_FAST = q(`
  A4 D5 F5 E5   | Bb4 Eb5 Gb5 F5   | A4 D5 F5 E5   | Bb4 Eb5 Gb5 F5 |
  A4 D5 F5 A5   | D5 F5 A5 Bb5     | A5 Ab5 G5 E5  | Ab5 - E5 D5
`);
const HOOK_CH = 'Dm Dm Ebm Ebm Dm Dm A7 A7';
const HOOK16 = [...HOOK8, ...HOOK8];
{
  const notes = HOOK8.filter((s) => typeof s === 'number').slice(0, 4);
  if (notes.join() !== cellIn('D5', FIRST_STEPS_MINOR).join()) throw new Error("No Strings: the hook's first cell isn't the chapter's cell");
  if (HOOK8.length !== 8 * BAR || HOOK_FAST.length !== 8 * BAR) throw new Error('No Strings: the hook is not eight bars');
}

// --- TUCK'S TUNE, G minor, 4/4, one token an 8th: the stammer, then the
// tune of "Behind the Curtain", hanging on its last bar. Six bars. ---
const TUCK = e(`
  D5 . D5 G5 - Bb5 A5 -  | - - G5 F5 Eb5 - - -  | . . G4 . G4 C5 - Eb5 |
  D5 - - - C5 Bb4 A4 -   | - - . . D5 . D5 G5   | - Bb5 D6 - C6 - Bb5 -
`);
const TUCK_CH = 'Gm Eb Cm D Gm Eb';
const STAMMER = e('D5 . D5 G5 - Bb5 - .');
const CRY = transpose(STAMMER, 12);

// The music box, stuck: the cell's first three notes going round in threes
// against the bar's fours (A D F, A D F, A D F...), the way he gets stuck on
// a word, before it finally lets out the fourth. Four bars.
const STUCK3 = [midi('A4'), midi('D5'), midi('F5')];
const BOX_STUCK = [...Array.from({ length: 9 }, (_, i) => [STUCK3[i % 3], H, H, H, H, H]).flat(), midi('E5'), ...Array(9).fill(H)];
// The detuned twin: the same notes a step late, starting from note `from`
// (in steps), on the flat music box: the box's two combs out of true.
const twin = (track, from = 0) => [R, ...track.slice(0, -1)].map((s, i) => (i <= from ? R : s));

// The hook, stuck: the first phrase as written, then the third phrase gets
// stuck on A D F and never lets go (for HOME).
const HOOK_STUCK = h(`
  A4 D5 F5 E5      | Bb4 Eb5 Gb5 F5   |
  A4 D5 F5 A4      | D5 F5 A4 D5
`);

// --- THE WALTZ THAT SLIPS: 3/4, twelve steps a bar, the cell as a waltz
// on the music box that keeps getting stuck; then the band joins and the
// beat slips (a bar loses a beat, the pah lands late). 264 steps. ---
const W3 = 12;
const cell3 = (a, b, c) => [midi(a), H, H, H, midi(b), H, H, H, midi(c), H, H, H];
const long3 = (a, bars = 1) => [midi(a), ...Array(bars * W3 - 1).fill(H)];
const STUCK_D = cell3('A4', 'D5', 'F5');
const STUCK_EB = cell3('Bb4', 'Eb5', 'Gb5');
const WALTZ = {
  p1: [...STUCK_D, ...STUCK_D, ...STUCK_D, ...long3('E5')],
  p2: [...STUCK_EB, ...STUCK_EB, ...STUCK_EB, ...long3('F5')],
  p3: [...STUCK_D, ...STUCK_D, ...STUCK_D, ...STUCK_D],
  slip: e('F5 F5 F5 F5'),
  p4: [...long3('Ab5'), ...long3('E5'), ...long3('D5', 2)],
  p5: [...STUCK_D, ...long3('E5'), ...STUCK_EB, ...long3('F5')],
  fall: q('Gb5 F5 E5 C#5'),
};
// The bass, one note a bar on the waltz's ONE (under the stuck third phrase
// it climbs D Eb E F while the tune can't move).
const W_BASS = 'D D D A Eb Eb Eb Eb D Eb E F F# Bb A D D D A Eb Eb';
const W_CH = 'Dm Dm Dm A7 Ebm Ebm Ebm Ebm Dm Dm Dm Dm - Bb A7 Dm Dm Dm A7 Ebm Ebm';
const OOM3 = ['R', ...steps(11)];
const PAH3 = [R, R, R, R, 'T', R, R, R, 'F', R, R, R];
const PAH3_HONK = [R, R, R, R, 'F', R, R, R, 'T', R, R, R];
// The slip: each pah a sixteenth late, then later.
const PAH3_LATE = [R, R, R, R, R, 'T', R, R, R, R, 'F', R];
// A waltz part, bar by bar: `fn(chord, i)` gives the bar's steps; the slip
// bar is two beats, the fall a whole 4/4 bar.
function waltzBars(fn, slip = steps(8), fall = steps(16)) {
  const out = [];
  W_CH.split(' ').forEach((symbol, i) => out.push(...(symbol === '-' ? slip : fn(symbol, i))));
  return [...out, ...fall];
}
const pahsOf = (pattern, low, from = 0, to = 99) => waltzBars((symbol, i) => (i >= from && i < to ? comp(symbol, pattern, low) : steps(W3)));
const W_MEL = [...WALTZ.p1, ...WALTZ.p2, ...WALTZ.p3, ...WALTZ.slip, ...WALTZ.p4, ...WALTZ.p5, ...WALTZ.fall];
// Where each part of the waltz starts, in steps.
const W_AT = { p2: 48, p3: 96, slip: 144, p4: 152, p5: 200, fall: 248, end: 264 };
const onlyIn = (track, from, to) => track.map((s, i) => (i >= from && i < to ? s : R));

// --- THE LIMP: the clarinet's walk, new, eight bars, with the wrong note. ---
const WALK = r(`
  D5 - - - F5 - - - A5 - - - G#5 - A5 -     |
  Bb5 - - - - - - - A5 - - - F5 - - -       |
  E5 - - - - - D5 - - - - - . . . .         |
  D5 - - - F5 - - - A5 - - - C#6 - D6 -     |
  Bb5 - - - A5 - - - G5 - - - F5 - - -      |
  E5 - - - - - - - D5 - - - . . . .         |
  Bb5 - - A5 - - G5 - - F5 - - E5 - - -     |
  D5 - - - - - - - - - - - . . . .
`);
const WALK_CH = 'Dm Bb Gm Gm Dm Dm Bb A7';

// --- Patterns, one bar (16 steps). ---
const BOOM = ['R', ...steps(15)];
const LIMP_PAH = [R, R, R, R, 'T', R, R, R, R, R, R, R, R, 'F', R, R];       // the last beat a sixteenth late
const LIMP_PAH2 = [R, R, R, R, 'F', R, R, R, R, R, R, R, R, 'T', R, R];
const BASS_BRK = ['R', R, 'R', R, R, R, R, R, R, R, 'R', 'R', R, R, R, R];    // locked to the kick
const JERK = ['R', R, 'R', 'R', R, R, 'F', R, 'R', R, R, 'R+', 'F', R, R, R]; // the yank: stops and starts
const POUND = ['R', R, 'R+', 'R', 'R', R, 'R+', 'R', 'R', R, 'R+', 'R', 'R', R, 'R+', 'R'];
const HAMMER = ['R+', R, R, 'R+', R, R, 'R+', R, 'R+', R, R, 'R+', R, R, 'R+', R];
const STAB = ['R', R, R, R, R, R, 'R', R, R, R, R, R, 'R+', R, R, R];
const RIPPLE = ['R', R, 'F', R, 'R+', R, 'T+', R, 'F+', R, 'T+', R, 'R+', R, 'F', R];
const T_BRK = [0, R, R, R, R, R, R, R, R, R, 0, R, 0, R, R, R];
const T_BEAT = [0, ...steps(7), 0, ...steps(7)];
const T_SLOW = [0, ...steps(15)];

const ONE = hits('x...............');
const ROLL_8 = hits('x.x.x.x.x.x.x.x.');
const ROLL_16 = hits('xxxxxxxxxxxxxxxx');
const FOOT = hits('x.......x.......');
const TICK = hits('x.x...x.x...x...');
// Ticks as pitched hits (a dry spiccato, the wooden click of col legno).
const ticks = (pattern, note = 'D4') => pattern.map((x) => (x === 'x' ? midi(note) : R));
// The cymbal swell is loudest 3.18s in: 37 steps at 176 BPM.
const SWELL_STEPS = 37;
const swellEnd = (length) => [...steps(length - SWELL_STEPS), ...held(60, SWELL_STEPS)];

// --- THE KIT. A one-bar pattern per voice; the second one is used on
// every other bar, and a fill replaces the bar named. ---
const KITS = {
  // The chopped break: kick on 1, 3-and and the flam after it, snare on 2
  // and 4 with ghost snares in between, eighth-note hat.
  break: {
    kick: ['x.x.......xx....', 'x.x...x...x.x...'],
    snare: ['....x.......x...', '....x.......x..x'],
    ghost: ['.......x.x....x.', '..x....x.x...x..'],
    hat: ['x.x.x.x.x.x.x.x.', 'x.x.x.x.x.x.xxxx'],
  },
  // Half-time: kick on 1, snare on 3, hat a hair shuffled.
  half: {
    kick: ['x.....x.......x.', 'x.......x.x.....'],
    snare: ['........x.......', '........x.......'],
    ghost: ['...x......x....x', '...x.....x....x.'],
    hat: ['x.xxx.xxx.xxx.xx', 'x.xxx.xxx.xxx.x.'],
  },
  // Two-step, the sad one: kick 1, kick 3-and, snare 2 and 4.
  step: {
    kick: ['x.........x.....', 'x.........x.x...'],
    snare: ['....x.......x...', '....x.......x...'],
    ghost: ['...x...x.x...x..', '...x...x.x......'],
    hat: ['x.x.x.x.x.x.x.x.', 'x.x.x.x.x.x.x.x.'],
  },
};
const FILL = { kick: 'x.......x.......', snare: '....x.x.x.xx....', ghost: '................', hat: '................', tom: '............xxxx' };
const NONE = '................';
// `n` bars of a kit; the bars named in `fills` are fills. Gives the five drum tracks.
function kit(style, n, fills = []) {
  const out = { kick: [], snare: [], ghost: [], hat: [], tom: [] };
  for (let i = 0; i < n; i++) {
    for (const voice of Object.keys(out)) {
      const pattern = fills.includes(i) ? FILL[voice] : KITS[style][voice]?.[i % 2] ?? NONE;
      out[voice].push(...hits(pattern));
    }
  }
  return out;
}

const O = ORCHESTRA;
const cents = (c) => c / 1200;

const song = {
  title: 'No Strings',
  bpm: 176,
  stepsPerBeat: 4,
  volume: 0.85,
  limit: 1,

  instruments: {
    // The music box, the light, the wood.
    glock: { sample: 'glock', volume: 0.12, ring: true, reverb: 0.5, pan: 0.2, echo: { time: 0.34, feedback: 0.3, mix: 0.28 } },
    boxHarp: { sample: 'harp', volume: 0.3, ring: true, reverb: 0.5, pan: -0.15, echo: { time: 0.34, feedback: 0.25, mix: 0.2 } },
    // The music box's twin, out of true: a glockenspiel a third of a
    // semitone flat and a harp a quarter flat, a step behind the first.
    glockSour: { sample: 'glock', octave: cents(-35), volume: 0.11, ring: true, reverb: 0.55, pan: -0.25, echo: { time: 0.34, feedback: 0.35, mix: 0.3 } },
    boxSour: { sample: 'harp', octave: cents(-25), volume: 0.22, ring: true, reverb: 0.55, pan: 0.25, echo: { time: 0.34, feedback: 0.3, mix: 0.25 } },
    glass: { sample: 'glass', volume: 0.14, ring: true, reverb: 0.6, pan: 0.25, echo: { time: 0.5, feedback: 0.3, mix: 0.25 } },
    vibes: { sample: 'vibesBowed', volume: 0.2, attack: 0.4, release: 1.2, reverb: 0.6, pan: -0.2 },
    vibesB: { sample: 'vibesBowed', volume: 0.16, attack: 0.5, release: 1.2, reverb: 0.6, pan: 0.2 },
    ticks: { sample: 'violinsSpic', volume: 0.2, release: 0.02, gate: 0.07, reverb: 0.08, pan: 0.1, humanize: { time: 0.004, volume: 0.2 } },
    frameDrum: { sample: 'frameDrum', drum: 'sample', volume: 0.3, ring: true, reverb: 0.1, pan: -0.1, humanize: { time: 0.004, volume: 0.15 } },
    tom: { sample: 'tom', drum: 'sample', volume: 0.3, ring: true, reverb: 0.2, pan: 0.1, humanize: { time: 0.003, volume: 0.2 } },
    // The break: real drums, close and dry.
    kick: { sample: 'bassDrum', drum: 'sample', volume: 0.62, ring: true, reverb: 0.06, humanize: { time: 0.002, volume: 0.08 } },
    snare: { sample: 'snare', drum: 'sample', volume: 0.46, ring: true, reverb: 0.1, humanize: { time: 0.002, volume: 0.12 } },
    ghost: { sample: 'snareSoft', drum: 'sample', volume: 0.2, ring: true, reverb: 0.08, humanize: { time: 0.003, volume: 0.3 } },
    hat: { sample: 'tenorDrumHigh', drum: 'sample', volume: 0.16, ring: true, reverb: 0.05, pan: 0.2, humanize: { time: 0.003, volume: 0.3 } },
    // Strings: creaking tremolo, pizzicato, the yank.
    violinsTrem: { sample: 'violinsTrem', volume: 0.2, attack: 0.15, release: 0.5, reverb: 0.45, pan: 0.25 },
    violasTrem: { sample: 'violasTrem', volume: 0.18, attack: 0.15, release: 0.5, reverb: 0.45, pan: -0.2 },
    cellosTrem: { sample: 'cellosTrem', volume: 0.3, attack: 0.3, release: 0.6, reverb: 0.4, pan: -0.15 },
    cellosPizz: { sample: 'cellosPizz', volume: 0.34, ring: true, reverb: 0.3, pan: -0.15, humanize: { time: 0.006, volume: 0.15 } },
    violinsPizz: { sample: 'violinsPizz', volume: 0.28, ring: true, reverb: 0.3, pan: 0.3, humanize: { time: 0.006, volume: 0.15 } },
    jerk: { sample: 'violinsSpic', volume: 0.3, release: 0.04, gate: 0.1, reverb: 0.2, pan: -0.3, humanize: { time: 0.004, volume: 0.15 } },
    // The piano: the tune's carrier, dry and close; the left hand rippling.
    pianoHook: { sample: 'grandPiano', volume: 0.5, ring: true, reverb: 0.1, pan: 0, humanize: { time: 0.004, volume: 0.1 } },
    pianoLow: { sample: 'grandPiano', volume: 0.3, ring: true, reverb: 0.12, pan: -0.1, humanize: { time: 0.006, volume: 0.12 } },
    honkChord: { sample: 'grandPiano', octave: cents(-14), volume: 0.16, release: 0.12, reverb: 0.25, pan: -0.1, humanize: { time: 0.008, volume: 0.12 } },
    // Winds.
    clarinet: { sample: 'clarinet', volume: 0.32, attack: 0.03, release: 0.2, reverb: 0.35, pan: -0.15 },
    oboeShort: { sample: 'oboe', volume: 0.26, attack: 0.02, release: 0.1, reverb: 0.35, pan: 0.15 },
    flute: { sample: 'flute', volume: 0.24, attack: 0.03, release: 0.2, reverb: 0.4, pan: 0.25 },
    piccolo: { sample: 'piccolo', volume: 0.1, attack: 0.01, release: 0.12, reverb: 0.35, pan: 0.3 },
    // The orchestra, as in "Who Would Be Hero".
    soloViolin: O.soloViolin,
    violins: { ...O.violins, volume: 0.32 },
    violinsHigh: { ...O.violinsHigh, volume: 0.26 },
    cellos: { ...O.cellos, volume: 0.34 },
    race: O.race,
    pound: O.pound,
    basses: O.basses,
    trumpets: { ...O.trumpets, volume: 0.38 },
    // A hair flat, so the brass sit a little wrong against the strings.
    horns: { ...O.horns, octave: -0.008 },
    // The trumpets doubled a hair sharp: the two beat against each other.
    trumpetsSour: { ...O.trumpets, volume: 0.2, octave: 0.012 },
    cellosHook: { ...O.cellos, volume: 0.3, attack: 0.02 },
    hornsSoft: { ...O.hornsSoft, volume: 0.3 },
    trombones: O.trombones,
    tuba: O.tuba,
    braam: O.braam,
    braamLow: { ...O.braamLow, octave: -1 },
    piano: { ...O.piano, volume: 0.3 },
    timpani: O.timpani,
    // The builds are held down a little so the drops stand well above them.
    timpRoll: { ...O.timpRoll, volume: 0.4 },
    swell: { ...O.swell, volume: 0.3 },
    roll: { ...O.roll, volume: 0.14 },
    bassDrum: O.bassDrum,
    concertBassDrum: { sample: 'concertBassDrum', drum: 'sample', volume: 0.8, ring: true, reverb: 0.35 },
    crash: O.crash,
    gong: O.gong,
    impact: O.impact,
  },

  sections: {
    // THE MUSIC BOX. A gong; the tune at a quarter speed; a creaking drone;
    // wooden ticks. At the fifth bar the piano snaps it to speed, strings
    // jerking. Then the build and one beat of silence.
    intro: stopdown(section(8 * BAR, {
      gong: ONE,
      cellosTrem: held('D2', 6 * BAR),
      glock: transpose(BOX_STUCK, 24),
      boxHarp: transpose(BOX_STUCK, 12),
      glockSour: twin(transpose(BOX_STUCK, 24), 18),
      boxSour: twin(transpose(BOX_STUCK, 12), 36),
      glass: at(1, held('Ab5', 3 * BAR)),
      violinsTrem: at(3, held('Gb5', 3 * BAR)),
      pianoHook: at(4, barsOf(HOOK_FAST, 0, 2)),
      jerk: at(4, comp('Dm Ebm', JERK, 55)),
      ticks: at(2, ticks(times(TICK, 4))),
      timpani: at(2, timps('Dm Dm Dm Dm', T_BEAT)),
      cellos: at(4, comp('Dm Ebm', holdBar('R'), 38)),
      tuba: at(6, held('D2', 2 * BAR)),
      horns: at(6, [...held('A3', BAR), ...held('Bb3', BAR)]),
      violins: at(6, climb(69, 8, 4)),
      timpRoll: at(6, held('D3', 2 * BAR)),
      roll: at(6, [...ROLL_8, ...ROLL_16]),
      swell: swellEnd(8 * BAR),
    })),

    // THE DROP. Gong, the deepest drum, a BRAAAM, the break; the slow hook on
    // the brass and the piano; strings jerk in at bar 4, piano hammers and the
    // toy joins at bar 8.
    A: (() => {
      const ch = `${HOOK_CH} ${HOOK_CH}`;
      return section(16 * BAR, {
        ...kit('break', 16, [3, 7, 11, 15]),
        gong: onBars(16, [0, 4, 8, 12], ONE),
        impact: onBars(16, [0, 4, 8, 12], ONE),
        concertBassDrum: onBars(16, [0, 2, 4, 6, 8, 10, 12, 14], ONE),
        crash: onBars(16, [0, 4, 8, 12], ONE),
        braam: held('D2', BAR),
        braamLow: held('D2', BAR),
        trumpets: HOOK16,
        trumpetsSour: after(4, HOOK16),
        violins: after(4, HOOK16),
        pianoHook: HOOK16,
        cellosHook: after(2, transpose(HOOK16, -12)),
        horns: transpose(HOOK16, -24),
        trombones: transpose(HOOK16, -24),
        glass: onBars(16, [8, 12], held('Ab5', BAR)),
        tuba: comp(ch, holdBar('R'), 34),
        basses: comp(ch, BASS_BRK, 34),
        jerk: after(4, comp(ch, JERK, 55)),
        pound: after(4, comp(ch, POUND, 43)),
        piano: after(8, comp(ch, HAMMER, 36)),
        glock: after(8, transpose(HOOK16, 24)),
        piccolo: after(12, transpose(HOOK16, 12)),
        timpani: timps(ch, T_BRK),
        bassDrum: times(hits('x...............'), 16),
      });
    })(),

    // THE LIMP. Half-time. The clarinet walks; the last beat is always late;
    // the hook creeps back low in the last four bars.
    B: (() => {
      const ch = `${WALK_CH} ${WALK_CH} ${bars(WALK_CH, 0, 4)}`;
      const walk = [...WALK, ...WALK, ...barsOf(WALK, 0, 4)];
      const low = barsOf(HOOK8, 0, 4);
      return section(20 * BAR, {
        ...kit('half', 20, [7, 15]),
        clarinet: walk,
        oboeShort: after(8, walk),
        glock: after(8, transpose(walk, 12)),
        cellosPizz: comp(ch, BOOM, 38),
        violinsPizz: comp(ch, LIMP_PAH, 60),
        honkChord: after(4, comp(ch, LIMP_PAH2, 55)),
        pianoLow: after(8, comp(ch, RIPPLE, 43)),
        violinsTrem: at(8, comp(bars(ch, 8, 20), holdBar('F'), 67)),
        frameDrum: times(FOOT, 20),
        ticks: at(4, ticks(times(TICK, 12))),
        horns: at(16, transpose(low, -24)),
        cellos: at(16, transpose(low, -12)),
        pianoHook: at(16, transpose(low, -12)),
        timpani: after(12, timps(ch, T_BEAT)),
        crash: onBars(20, [8], ONE),
        gong: onBars(20, [16], ONE),
      });
    })(),

    // THE WALTZ THAT SLIPS. 3/4. The music box (and its flat twin) plays the
    // cell as a waltz and gets stuck on it; the clarinet joins; the third
    // phrase can't get past A D F at all while the bass climbs under it; a
    // bar loses a beat (the piano stuck on F); then the band crashes in, the
    // tritone, the hook as a stomping waltz, and a slide back into 4/4.
    W: (() => {
      const bass = W_BASS.split(' ');
      const bassBar = (pitch, len) => [midi(`${pitch}${['Bb', 'A', 'F#'].includes(pitch) ? 1 : 2}`), ...steps(len - 1)];
      const cellos = [...bass.flatMap((p, i) => bassBar(p, i === 12 ? 8 : W3)), ...held('A1', 16)];
      const full = (track) => onlyIn(track, W_AT.p4, W_AT.end);
      const waltzKick = waltzBars((_, i) => (i >= 8 ? hits('x...........') : steps(W3)), steps(8), hits('x.......x.......'));
      const waltzSnare = waltzBars((_, i) => (i >= 17 ? hits('....x...x...') : i >= 8 && i < 12 ? hits('.....x....x.') : steps(W3)), hits('x.x.x.x.'), hits('....x.x.x.xx....'));
      const stuckPiano = onlyIn(W_MEL, W_AT.slip, W_AT.p4);
      return section(W_AT.end, {
        glock: transpose(W_MEL.map((s, i) => (i >= W_AT.slip && i < W_AT.p4 ? R : s)), 24),
        glockSour: twin(transpose(onlyIn(W_MEL, 0, W_AT.slip), 24), 24),
        boxHarp: transpose(onlyIn(W_MEL, 0, W_AT.slip), 12),
        boxSour: twin(transpose(onlyIn(W_MEL, W_AT.p2, W_AT.slip), 12)),
        clarinet: onlyIn(W_MEL, W_AT.p2, W_AT.slip),
        violins: onlyIn(W_MEL, W_AT.p3, W_AT.slip).map((s) => (typeof s === 'number' ? s + 12 : s)),
        trumpetsSour: onlyIn(W_MEL, W_AT.p3, W_AT.slip),
        pianoHook: [...onlyIn(W_MEL, W_AT.p3, W_AT.slip).slice(0, W_AT.slip), ...stuckPiano.slice(W_AT.slip, W_AT.p4), ...full(W_MEL).slice(W_AT.p4)],
        glass: at(0, [...steps(W_AT.p2), ...held('Ab5', 48)]),
        cellosPizz: onlyIn(cellos, 0, W_AT.p4),
        violinsPizz: pahsOf(PAH3, 60, 0, 8),
        jerk: pahsOf(PAH3_LATE, 55, 8, 12),
        honkChord: pahsOf(PAH3_HONK, 55, 4, 12),
        ticks: waltzBars((_, i) => (i < 12 ? ticks(hits('x...x...x...')) : steps(W3))),
        kick: waltzKick,
        snare: waltzSnare,
        // The band: the tritone, then the hook as a stomping waltz.
        trumpets: full(W_MEL),
        violinsHigh: full(W_MEL),
        cellosHook: transpose(full(W_MEL), -12),
        horns: transpose(full(W_MEL), -24),
        trombones: transpose(full(W_MEL), -24),
        tuba: onlyIn(cellos, W_AT.p4, W_AT.end),
        basses: onlyIn(cellos, W_AT.p4, W_AT.end).map((s) => (typeof s === 'number' ? s + 12 : s)),
        pound: pahsOf(PAH3, 43, 13, 21),
        timpani: waltzBars((symbol, i) => (i >= 8 && i !== 12 ? timps(symbol, [0, ...steps(11)]) : steps(W3)), steps(8), timps('A7', [0, R, R, R, 0, R, R, R, 0, R, 0, R, 0, 0, 0, 0])),
        gong: [...steps(W_AT.p4), ...ONE],
        braam: [...steps(W_AT.p4), ...held('Bb2', W3)],
        braamLow: [...steps(W_AT.p4), ...held('Bb2', W3)],
        crash: [...steps(W_AT.p4), ...ONE, ...steps(W_AT.p5 - W_AT.p4 - ONE.length), ...ONE],
        impact: [...steps(W_AT.p4), ...ONE],
        tom: [...steps(W_AT.fall), ...hits('............xxxx')],
      });
    })(),

    // STRUNG UP. Tuck's tune, music box then violin; a two-step under him;
    // the brass drowns it; his stammer cries out alone at the top; the snare
    // rolls and everything cuts.
    C: stopdown((() => {
      const tc = [TUCK_CH, TUCK_CH, TUCK_CH].join(' ');
      const hookLow = barsOf(HOOK8, 0, 4);
      const cry = at(16, [...CRY, ...CRY, ...held('A6', 2 * BAR)]);
      return section(20 * BAR, {
        ...place(6, kit('step', 10, [5, 9])),
        boxHarp: TUCK,
        glock: transpose(TUCK, 12),
        pianoLow: comp(bars(tc, 0, 12), RIPPLE, 43),
        soloViolin: at(6, TUCK),
        flute: at(6, transpose(TUCK, 12)),
        cellosPizz: comp(bars(tc, 0, 16), BOOM, 38),
        violinsTrem: comp(bars(tc, 0, 16), holdBar('F'), 67),
        violasTrem: at(2, comp(bars(tc, 2, 16), holdBar('R'), 55)),
        ticks: at(2, ticks(times(TICK, 14))),
        trumpets: at(12, hookLow),
        horns: at(12, transpose(hookLow, -24)),
        trombones: at(12, transpose(hookLow, -24)),
        tuba: at(12, comp(bars(HOOK_CH, 0, 4), holdBar('R'), 34)),
        basses: at(12, comp(bars(HOOK_CH, 0, 4), BASS_BRK, 34)),
        timpani: at(12, timps(bars(HOOK_CH, 0, 4), T_BEAT)),
        crash: onBars(20, [12], ONE),
        impact: onBars(20, [12], ONE),
        piccolo: cry,
        timpRoll: at(16, held('D3', 4 * BAR)),
        roll: at(18, [...ROLL_8, ...ROLL_16]),
        swell: swellEnd(20 * BAR),
      });
    })()),

    // THE STRINGS PULL. The cell at full speed climbs a semitone a bar over
    // a climbing bass and the break at full strength; then the hook comes
    // home at half speed. Tuck squeaks on top every fourth bar.
    D: (() => {
      const ch = `Dm Ebm Em Fm F#m Gm Abm Am ${HOOK_CH}`;
      const cellK = (k) => [69 + k, H, H, H, 74 + k, H, H, H, 77 + k, H, H, H, 76 + k, H, H, H];
      const first = Array.from({ length: 8 }, (_, k) => cellK(k)).flat();
      const melody16 = [...first, ...HOOK8];
      const cry = onBars(16, [3, 7, 11, 15], [...CRY, ...steps(BAR - CRY.length)]);
      return section(16 * BAR, {
        ...kit('break', 16, [7, 15]),
        gong: onBars(16, [0, 8], ONE),
        crash: onBars(16, [0, 4, 8, 12], ONE),
        concertBassDrum: onBars(16, [4, 6, 8, 10, 12, 14], ONE),
        trumpets: melody16,
        trumpetsSour: melody16,
        violins: melody16,
        pianoHook: after(8, melody16),
        cellosHook: transpose(melody16, -12),
        horns: transpose(melody16, -24),
        trombones: transpose(melody16, -24),
        tuba: comp(ch, holdBar('R'), 34),
        basses: comp(ch, BASS_BRK, 34),
        jerk: comp(ch, JERK, 55),
        pound: comp(ch, POUND, 43),
        piano: after(8, comp(ch, HAMMER, 36)),
        soloViolin: cry,
        glock: transpose(cry, 12),
        timpani: timps(ch, T_BRK),
        bassDrum: times(hits('x...............'), 16),
      });
    })(),

    // THE LIGHT. No drums: the cold light (vibes and glass on a tritone),
    // Tuck's tune on a lone piano and the music box, a heartbeat. Then the
    // climb.
    P: stopdown(section(8 * BAR, {
      vibes: held('D5', 4 * BAR),
      vibesB: held('A4', 4 * BAR),
      glass: at(1, held('Ab5', 3 * BAR)),
      pianoHook: at(1, barsOf(TUCK, 0, 4)),
      boxHarp: at(2, barsOf(TUCK, 0, 3)),
      glock: at(2, transpose(barsOf(TUCK, 0, 3), 12)),
      timpani: at(2, timps('Dm Dm', T_SLOW)),
      cellosTrem: at(3, held('D2', 5 * BAR)),
      violinsTrem: at(4, climb(70, 12, 4)),
      violasTrem: at(4, climb(58, 12, 4)),
      tuba: at(4, held('D2', 4 * BAR)),
      timpRoll: at(4, held('D3', 4 * BAR)),
      roll: at(5, [...ROLL_8, ...ROLL_8, ...ROLL_16]),
      swell: swellEnd(8 * BAR),
    })),

    // THE SECOND DROP, G minor. The hook on everything; then Tuck's tune
    // soars over the king's cell hammering low; then the hook; then the
    // climb back to A.
    E: (() => {
      const gch = moveChords(HOOK_CH, 5);
      const ch = `${gch} ${TUCK_CH} Gm D ${bars(gch, 0, 4)} Gm Abm Am A7`;
      const hookG = transpose(HOOK8, 5);
      const cells = [
        ...q('D5 G5 Bb5 A5'),
        ...q('Eb5 Ab5 B5 Bb5'),
        ...q('E5 A5 C6 B5'),
        ...held('A5', BAR),
      ];
      const cellG = q('D5 G5 Bb5 A5');
      const tail = [...barsOf(hookG, 0, 4), ...cells];
      const mel = [...hookG, ...rest(8), ...tail];
      const tuck = at(8, TUCK);
      const hammer = at(8, times(cellG, 8));
      return section(24 * BAR, {
        ...kit('break', 24, [3, 7, 11, 15, 19, 23]),
        gong: onBars(24, [0, 4, 8, 12, 16, 20], ONE),
        impact: onBars(24, [0, 4, 8, 12, 16, 20], ONE),
        concertBassDrum: onBars(24, [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22], ONE),
        crash: onBars(24, [0, 4, 8, 12, 16, 20], ONE),
        braam: held('G2', BAR),
        braamLow: held('G2', BAR),
        trumpets: [...barsOf(mel, 0, 8), ...comp(TUCK_CH, STAB, 60), ...rest(2), ...tail],
        trumpetsSour: [...barsOf(mel, 0, 8), ...rest(8), ...tail],
        violins: mel.map((s, i) => (typeof tuck[i] === 'number' || tuck[i] === H ? tuck[i] : s)),
        pianoHook: mel.map((s, i) => (typeof tuck[i] === 'number' || tuck[i] === H ? tuck[i] : s)),
        cellosHook: transpose([...barsOf(mel, 0, 8), ...rest(8), ...tail], -12),
        soloViolin: transpose(tuck, 12),
        flute: transpose(tuck, 12),
        horns: [...transpose(barsOf(mel, 0, 8), -24), ...transpose(barsOf(tuck, 8, 14), -24), ...rest(2), ...transpose(tail, -24)],
        trombones: [...transpose(barsOf(mel, 0, 8), -24), ...transpose(barsOf(hammer, 8, 16), -24), ...transpose(tail, -24)],
        tuba: comp(ch, holdBar('R'), 34),
        basses: comp(ch, BASS_BRK, 34),
        jerk: after(2, comp(ch, JERK, 55)),
        pound: comp(ch, POUND, 43),
        piano: after(4, comp(ch, HAMMER, 36)),
        glock: after(4, transpose(mel, 12)),
        piccolo: after(16, transpose(mel, 12)),
        timpani: timps(ch, T_BRK),
        bassDrum: times(hits('x...............'), 24),
      });
    })(),

    // HOME. D minor; the piano alone with the hook, the music box and a
    // quiet limp; Tuck squeaks twice; the king's cell low; then the build
    // and the beat of silence.
    H: stopdown((() => {
      const ch = 'Dm Dm Ebm Ebm Dm Dm A7 A7 Bb Gm A7 A7';
      const lowCell = transpose(barsOf(HOOK_FAST, 0, 2), -24);
      const quiet = kit('half', 8, []);
      return section(12 * BAR, {
        kick: quiet.kick,
        ghost: quiet.ghost,
        hat: quiet.hat,
        pianoHook: HOOK_STUCK,
        pianoLow: comp(bars(ch, 0, 8), RIPPLE, 43),
        glock: at(4, transpose(barsOf(HOOK_STUCK, 4, 8), 24)),
        glockSour: at(4, twin(transpose(barsOf(HOOK_STUCK, 4, 8), 24))),
        boxHarp: [...rest(3), ...STAMMER, ...rest(3), ...STAMMER],
        cellosTrem: held('D2', 8 * BAR),
        hornsSoft: comp(bars(ch, 0, 8), holdBar('R'), 43),
        cellosPizz: comp(bars(ch, 0, 8), BOOM, 38),
        violinsPizz: comp(bars(ch, 0, 8), LIMP_PAH, 60),
        frameDrum: times(FOOT, 8),
        ticks: at(2, ticks(times(TICK, 6))),
        cellos: at(6, lowCell),
        timpani: at(4, timps(bars(ch, 4, 8), T_BEAT)),
        violinsTrem: at(8, climb(62, 16, 4)),
        horns: at(8, [...held('A3', BAR), ...held('Bb3', BAR), ...held('B3', BAR), ...held('C#4', BAR)]),
        tuba: at(8, held('D2', 4 * BAR)),
        race: at(9, comp(bars(ch, 9, 12), JERK, 55)),
        timpRoll: at(8, held('D3', 4 * BAR)),
        roll: at(8, [...ROLL_8, ...ROLL_8, ...ROLL_16, ...ROLL_16]),
        swell: swellEnd(12 * BAR),
      });
    })()),
  },

  // The intro plays once; after that the show loops from the drop.
  order: ['intro', 'A', 'B', 'W', 'C', 'D', 'P', 'E', 'H'],
  loopFrom: 1,
};

// Every recorded instrument kept within reach of its recordings. The player
// stretches a note from the nearest recording, so any note inside an
// instrument's whole span keeps its written pitch (even across a wide gap,
// like the horns' between C4 and D5). Only a note more than three semitones
// beyond the lowest or highest recording moves by octaves, to inside it.
// The doublers (bells, glass, piccolo) just leave out a note they can't reach.
const DOUBLERS = ['glock', 'glockSour', 'glass', 'piccolo'];
const near = (n, notes, reach = 2) => notes.some((x) => Math.abs(x - n) <= reach);
// How many notes of each track had to move an octave (a check for whoever
// writes the song: a doubling should keep the tune's shape).
song.moved = {};
for (const [sectionName, tracks] of Object.entries(song.sections)) {
  for (const [name, track] of Object.entries(tracks)) {
    const instrument = song.instruments[name];
    if (!instrument) throw new Error(`No Strings: no instrument called '${name}'`);
    if (!instrument.sample || instrument.drum || SAMPLE_SETS[instrument.sample].notes.length < 2) continue;
    const { notes } = SAMPLE_SETS[instrument.sample];
    let dropped = false;
    tracks[name] = track.map((s) => {
      if (s === HOLD) return dropped ? REST : s;
      dropped = false;
      if (typeof s !== 'number') return s;
      if (DOUBLERS.includes(name)) {
        if (near(s, notes, 3)) return s;
        dropped = true;
        return REST;
      }
      const low = Math.min(...notes) - 3;
      const high = Math.max(...notes) + 3;
      const fit = [s, s - 12, s + 12, s - 24, s + 24].find((n) => n >= low && n <= high) ?? s;
      if (fit !== s) song.moved[`${sectionName}.${name}`] = (song.moved[`${sectionName}.${name}`] ?? 0) + 1;
      return fit;
    });
  }
}

export const RUMBOLD_ALIVE_THEME = song;
