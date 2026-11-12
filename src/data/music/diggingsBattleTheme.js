import { melody, midi, hits, repeat, arpeggio, sustained } from './parts/chapter4.js';

// "Struck Quartz": the battle theme for ordinary fights in the Diggings, the
// creature folk's mines in Chapter 4 (the drillbugs, the magpie moles and the
// slaglings). Everywhere else underground keeps "Scurry" (belowBattleTheme.js).
// The idea: a fight in a seam of crystal, where every blow makes the walls
// ring. The tune is played on the gems themselves: a real glockenspiel, with
// a little glass-bell celesta under it to give it a body, and a struck-quartz
// "tink" (a short, bright ping, slightly out of tune with itself, like a
// stone that isn't a bell) that glints in sixteenths and lands on the
// off-beats like a pick catching a crystal. Under the sparkle it is dark and
// driven: plucked basses and cellos galloping 3-3-2 like a cart on its
// rails (the same 3-3-2 as the pick strike in the area's own "Shift Change",
// diggingsTheme.js, but straight 4/4 this time, nothing lopsided), a hand
// drum and toms, a soft snare on the backbeat, a real anvil struck small on
// the last off-beat of the bar, and a low drone of the deep under the quiet
// parts. In the crystal cave the drums fall away and the gems take over:
// tubular chimes and a singing wine glass holding the chapter's tune one note
// a bar while the harmony slides under it. Not cheery: D minor all the way,
// with the falling bass D C B-flat A under the hook (a lament walking down a
// shaft) and one borrowed chord, the flat E (the Neapolitan), in the cave.
// No brass, no choir, no war drums, no sax: nothing like the mountain's
// fights or the old 7/8 "Uneven Rails" (kept in
// notes/music-backup-2026-11-09/diggingsBattleTheme.js).
//
// THE CHAPTER'S TUNE (the "first cell", parts/chapter4.js): up a fourth, up a
// minor third, one step down. In D minor it is A D F E, and it is the first
// four notes of the hook, sounded alone on the glockenspiel in the very first
// bar, in the cart's 3-3-2 rhythm. The hook says it again on G (D G B-flat A)
// in bar 3. In the second tune a low piano and plucked cellos rattle it off in
// sixteenths (twice as fast) and the gems answer with it high up, on G minor,
// D minor and B-flat major. In the crystal cave it is slowed to one note a
// bar on the chimes and then the wine glass, while the glockenspiel plays it
// in dotted eighths, three steps a note against the four-step beat, so it
// keeps slipping across the bar.
//
// D minor, 4/4 at 144 quarter notes a minute, one step a 16th: a bar is 1.67
// seconds. The intro plays once (2 bars); then it loops from A, 32 bars,
// about 53 seconds (times from the start of the intro):
//
//   intro    2 bars  0:00  the cell alone on the gems over the drone, then the
//                          cart starts: plucked bass, hand drum, a tom fill
//   A        8 bars  0:03  THE HOOK on glockenspiel and celesta, the bass
//                          walking down D C B-flat A, tinks on the off-beats,
//                          the snare on 2 and 4; quartz glints join at bar 5
//   B        8 bars  0:17  the drill: the cell in fast sixteenths on low
//                          piano and plucked cellos (G minor, D minor,
//                          B-flat, A), the gems answering it a bar later;
//                          toms busier
//   crystal  8 bars  0:30  the cave: drums out but a hand-drum heartbeat; the
//                          quartz glints in threes across the beat, bowed
//                          vibes, the cell a bar a note on chimes then wine
//                          glass over B-flat, G minor, E-flat, A; the
//                          glockenspiel slips it in dotted eighths; the cart
//                          comes back and the snare rolls in the last bars
//   return   8 bars  0:43  the hook again, fuller: the quartz doubling it an
//                          octave up, bowed cellos and piano octaves under
//                          the bass, home on D minor with a tom fill to go
//                          round

const BAR = 16;
const rest = (bars) => Array(bars * BAR).fill('.');
const up = (track, semitones) => track.map((n) => (typeof n === 'number' ? n + semitones : n));
// A line written as 'note:steps' tokens ('A4:3 D5:3 F5:2'), '.' for a rest.
const line = (text) => text.split(/\s+/).filter((t) => t && t !== '|').flatMap((token) => {
  const [name, count = '1'] = token.split(':');
  const steps = Number(count);
  if (name === '.') return Array(steps).fill('.');
  return [midi(name), ...Array(steps - 1).fill('-')];
});

// --- THE HOOK (8 bars): the cell, the cart's 3-3-2 in the tune itself. ---
const HOOK = line(`
  A4:3 D5:3 F5:2 E5:2 D5:2 C5:2 D5:2  | A4:3 D5:3 F5:2 A5:4 G5:2 F5:2
  D5:3 G5:3 Bb5:2 A5:2 G5:2 F5:2 E5:2 | C#5:3 E5:3 A5:8 .:2
  A4:3 D5:3 F5:2 E5:2 D5:2 C5:2 D5:2  | A4:3 D5:3 F5:2 Bb5:4 A5:2 G5:2
  E5:3 F5:3 G5:2 C6:4 Bb5:2 G5:2      | A5:3 F5:3 E5:2 D5:6 .:2
`);
// The bass under the hook walks down the shaft: D C Bb A, then D Bb C D.
const HOOK_ROOTS = ['D2', 'C2', 'Bb1', 'A1', 'D2', 'Bb1', 'C2', 'D2'];
const HOOK_CHORDS = 'Dm Dm Gm A Dm Bb C Dm';

// --- THE DRILL (B): chords and the gems' answers. ---
const DRILL_CHORDS = 'Gm Gm Dm Dm Bb Bb A A';
const DRILL_ROOTS = ['G1', 'G1', 'D2', 'D2', 'Bb1', 'Bb1', 'A1', 'A1'];
const ANSWER = line(`
  .:16                                  | D6:2 G6:2 Bb6:2 A6:6 G6:2 F6:2
  .:16                                  | A5:2 D6:2 F6:2 E6:6 D6:2 C6:2
  .:16                                  | F6:2 Bb6:2 D7:2 C7:6 Bb6:2 A6:2
  E6:2 A6:2 C#7:2 Bb6:2 A6:2 G6:2 F6:2 E6:2 | C#6:3 E6:3 A6:6 .:4
`);

// --- THE CRYSTAL CAVE: B-flat, G minor, the borrowed E-flat, A. ---
const CAVE_CHORDS = 'Bb Gm Eb A Bb Gm Eb A';
const CAVE_ROOTS = ['Bb1', 'G1', 'Eb2', 'A1', 'Bb1', 'G1', 'Eb2', 'A1'];
// The cell a bar a note, the harmony sliding under it (A over B-flat, D over
// G minor, F over E-flat, E over A).
const SLOW_CELL = line('A4:16 D5:16 F5:16 E5:16');
// The cell in dotted eighths, three steps a note against the beat.
const SLIPPING = line(`
  .:16 | .:16 | .:16 | .:12 E5:1 F5:1 G5:1 A5:1
  F6:3 Bb6:3 D7:3 C7:3 .:4 | D6:3 G6:3 Bb6:3 A6:3 .:4
  Bb5:3 Eb6:3 G6:3 F6:3 .:4 | E6:3 A6:3 C#7:3 Bb6:3 A6:4
`);

// --- Patterns, a bar each. ---
// The cart: 3-3-2, 3-3-2 (semitones above the bar's root).
const CART = [0, '.', '.', 0, '.', '.', 12, '.', 0, '.', '.', 0, '.', '.', 7, '.'];
// The drill riff: the cell in sixteenths, twice, with a turn down.
const DRILL = (root, third) => {
  const r = midi(root) + 12;
  return [r - 5, r, r + third, r + 2, '.', '.', r, '.', r - 5, r, r + third, r + 2, '.', r - 2, '.', r - 4];
};
// One bass line from a list of roots and a pattern of semitones.
const walk = (roots, pattern) => roots.flatMap((root) => pattern.map((p) => (typeof p === 'number' ? midi(root) + p : p)));
const held = (roots, octaves = 0) => roots.flatMap((root) => [midi(root) + 12 * octaves, ...Array(BAR - 1).fill('-')]);

// The tinks on the off-beats: a pick catching quartz, high D and A in turn.
const TINK = line('.:2 D7:1 .:3 A6:1 .:3 D7:1 .:3 A6:1 .:1');
// Quartz glints: the chord's notes in threes, across the four-step beat.
const glints = (chords, octave) => arpeggio(chords, BAR, octave, [12, 7, 'tenth']);

// --- Drums, a bar each. ---
const HAND = hits('x.....x.x.......');
const HAND_BUSY = hits('x..x..x.x..x..x.');
const HEART = hits('x.......x.......');
const BACKBEAT = hits('....x.......x...');
const RAILS = hits('..........x...xx');
const RAILS_BUSY = hits('..x...x...x.x.xx');
const PICK = hits('..............x.');
const FILL = hits('x.x.x.x.xxxxxxxx');
const ROLL = hits('x.x.x.x.x.x.xxxx');

// --- Instruments. ---
// The struck quartz: a pure ping with two partials that don't belong to it
// (2.76 and 5.4 times the note, like a glass or a stone) and a twin a few
// cents sharp so it shimmers. Gone in a blink.
const QUARTZ = {
  voices: [
    { wave: 'sine', level: 0.55 },
    { wave: 'sine', detune: 7, level: 0.3 },
    { wave: 'sine', detune: 1758, level: 0.22 },
    { wave: 'sine', detune: 2920, level: 0.08 },
  ],
  attack: 0.001, decay: 0.07, sustain: 0, release: 0.12, gate: 1,
  click: 0.05,
  filter: { type: 'highpass', frequency: 900 },
};
// A small glass-bell celesta to give the glockenspiel's tune a body.
const CELESTA = {
  voices: [
    { wave: 'sine', level: 0.75 },
    { wave: 'sine', octave: 1, detune: 4, level: 0.22 },
    { wave: 'sine', octave: 2, detune: -6, level: 0.06 },
  ],
  attack: 0.002, decay: 0.32, sustain: 0.08, release: 0.3, gate: 0.9,
};
// The deep: a low drone, two sines a fifth apart, swelling in slowly.
const DEEP = {
  voices: [{ wave: 'sine', level: 0.7 }, { wave: 'sine', octave: 1, level: 0.25 }, { wave: 'triangle', octave: 1, detune: 702, level: 0.08 }],
  attack: 1.5, decay: 2, sustain: 0.9, release: 1.5, gate: 1,
};

export const DIGGINGS_BATTLE_THEME = {
  title: 'Struck Quartz',
  bpm: 144,
  stepsPerBeat: 4,
  volume: 1.25,

  instruments: {
    // The gems: the tune on a real glockenspiel with the celesta under it.
    glock: { sample: 'glock', volume: 0.32, ring: true, reverb: 0.35, pan: 0.1, filter: { type: 'lowpass', frequency: 9000 }, humanize: { time: 0.003, volume: 0.1 } },
    celesta: { ...CELESTA, volume: 0.11, reverb: 0.3, pan: -0.1, humanize: { time: 0.003, volume: 0.1 } },
    // The quartz, three ways: the off-beat tinks, the glints, the hook's top.
    tink: { ...QUARTZ, volume: 0.07, reverb: 0.35, pan: 0.35, echo: { time: 0.3125, feedback: 0.25, mix: 0.18 }, humanize: { time: 0.004, volume: 0.25 } },
    glint: { ...QUARTZ, volume: 0.04, reverb: 0.4, pan: -0.35, humanize: { time: 0.003, volume: 0.35 } },
    sparkle: { ...QUARTZ, decay: 0.12, volume: 0.05, reverb: 0.4, pan: 0.2 },
    // The cave's long notes: tubular chimes, a singing wine glass, bowed vibes.
    chimes: { sample: 'chimes', volume: 0.16, ring: true, reverb: 0.5, pan: -0.2 },
    glass: { sample: 'glass', volume: 0.13, offset: 1.4, attack: 0.3, release: 1.2, reverb: 0.5, pan: 0.25 },
    vibes: { sample: 'vibesBowed', volume: 0.08, attack: 0.6, release: 1, reverb: 0.5 },
    // The bed: plucked basses and cellos on the cart rhythm, a low piano,
    // bowed cellos in the return, the drone of the deep.
    basses: { sample: 'bassSpic', volume: 0.34, release: 0.08, reverb: 0.15, humanize: { time: 0.003, volume: 0.12 } },
    pizz: { sample: 'cellosPizz', volume: 0.24, ring: true, reverb: 0.2, pan: -0.15, humanize: { time: 0.004, volume: 0.15 } },
    piano: { sample: 'grandPiano', volume: 0.26, release: 0.1, reverb: 0.2, pan: 0.05, humanize: { time: 0.003, volume: 0.12 } },
    cellos: { sample: 'cellos', volume: 0.13, attack: 0.15, release: 0.5, reverb: 0.35, pan: -0.25 },
    deep: { ...DEEP, volume: 0.14, reverb: 0.3 },
    // Drums: a hand drum, toms, a soft snare, and the anvil struck small.
    hand: { sample: 'frameDrum', drum: 'sample', volume: 0.4, ring: true, reverb: 0.15, humanize: { time: 0.003, volume: 0.15 } },
    tom: { sample: 'tom', drum: 'sample', volume: 0.28, ring: true, reverb: 0.25, pan: 0.15, humanize: { time: 0.004, volume: 0.2 } },
    snare: { sample: 'snareSoft', drum: 'sample', volume: 0.18, release: 0.08, reverb: 0.2, humanize: { time: 0.003, volume: 0.2 } },
    pick: { sample: 'anvil', volume: 0.08, octave: 1, ring: true, reverb: 0.3, pan: 0.3, humanize: { time: 0.004, volume: 0.3 } },
  },

  sections: {
    // The cell alone on the gems over the drone; then the cart starts.
    intro: {
      glock: [...line('A5:3 D6:3 F6:2 E6:8'), ...rest(1)],
      celesta: [...line('A4:3 D5:3 F5:2 E5:8'), ...rest(1)],
      deep: held(['D2', 'D2']),
      tink: repeat(TINK, 2),
      basses: [...rest(1), ...walk(['D2'], CART)],
      pizz: [...rest(1), ...walk(['D3'], CART)],
      hand: [...rest(1), ...HAND],
      tom: [...rest(1), ...hits('........x.x.xxxx')],
    },

    // THE HOOK, the bass walking down.
    A: {
      glock: up(HOOK, 12),
      celesta: HOOK,
      tink: repeat(TINK, 8),
      glint: [...rest(4), ...glints('Dm Bb C Dm', 5)],
      basses: walk(HOOK_ROOTS, CART),
      pizz: up(walk(HOOK_ROOTS, CART), 12),
      hand: repeat(HAND, 8),
      snare: repeat(BACKBEAT, 8),
      tom: repeat(RAILS, 8),
      pick: repeat(PICK, 8).map((s) => (s === 'x' ? midi('C4') : s)),
    },

    // The drill: the cell in fast sixteenths, low; the gems answer.
    B: {
      piano: up(DRILL_ROOTS.flatMap((root, i) => DRILL(root, DRILL_CHORDS.split(' ')[i].endsWith('m') ? 3 : 4)), 12),
      pizz: DRILL_ROOTS.flatMap((root, i) => DRILL(root, DRILL_CHORDS.split(' ')[i].endsWith('m') ? 3 : 4)),
      basses: walk(DRILL_ROOTS, [0, '.', '.', '.', '.', '.', 0, '.', 0, '.', '.', '.', '.', '.', 0, '.']),
      glock: ANSWER,
      celesta: up(ANSWER, -12),
      tink: repeat(TINK, 8),
      glint: glints(DRILL_CHORDS, 5),
      hand: repeat(HAND_BUSY, 8),
      snare: repeat(BACKBEAT, 8),
      tom: repeat(RAILS_BUSY, 8),
      pick: repeat(PICK, 8).map((s) => (s === 'x' ? midi('C4') : s)),
    },

    // The crystal cave: the gems take over.
    crystal: {
      glint: [...glints(CAVE_CHORDS.split(' ').slice(0, 4).join(' '), 5), ...glints(CAVE_CHORDS.split(' ').slice(4).join(' '), 6)],
      chimes: [...SLOW_CELL, ...SLOW_CELL],
      glass: [...rest(4), ...up(SLOW_CELL, 12)],
      glock: SLIPPING,
      vibes: sustained(CAVE_CHORDS, BAR, 1, 4),
      deep: held(['D2', 'D2', 'D2', 'D2', 'D2', 'D2']).concat(rest(2)),
      basses: [...walk(CAVE_ROOTS.slice(0, 6), [0, ...Array(15).fill('.')]), ...walk(CAVE_ROOTS.slice(6), CART)],
      pizz: [...rest(4), ...walk(CAVE_ROOTS.slice(4, 6).map((r) => r.replace('1', '2')), [0, '.', '.', '.', '.', '.', '.', '.', 7, '.', '.', '.', '.', '.', '.', '.']), ...up(walk(CAVE_ROOTS.slice(6), CART), 12)],
      hand: [...repeat(HEART, 6), ...repeat(HAND, 2)],
      tink: [...repeat(hits('......x.......x.').map((s) => (s === 'x' ? midi('D7') : s)), 6), ...repeat(TINK, 2)],
      tom: [...rest(6), ...RAILS, ...FILL],
      snare: [...rest(7), ...ROLL],
    },

    // The hook again, fuller.
    return: {
      glock: up(HOOK, 12),
      celesta: HOOK,
      sparkle: up(HOOK, 24),
      tink: repeat(TINK, 8),
      glint: glints(HOOK_CHORDS, 5),
      basses: walk(HOOK_ROOTS, CART),
      pizz: up(walk(HOOK_ROOTS, CART), 12),
      piano: walk(HOOK_ROOTS, CART).map((n) => (typeof n === 'number' ? n + 12 : n)),
      cellos: held(HOOK_ROOTS, 1),
      hand: repeat(HAND_BUSY, 8),
      snare: repeat(BACKBEAT, 8),
      tom: [...repeat(RAILS_BUSY, 7), ...FILL],
      pick: repeat(PICK, 8).map((s) => (s === 'x' ? midi('C4') : s)),
    },
  },

  order: ['intro', 'A', 'B', 'crystal', 'return'],
  loopFrom: 1,
};
