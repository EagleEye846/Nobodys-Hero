import {
  melody, hits, repeat, arpeggio, sustained, chordLine, transpose, rest as restBars,
  tight, midi, after as afterBars, scatter,
} from './parts/chapter5.js';

// "Salt and Rope": the theme of Saltcombe, the stilt town on the quay, lit
// up inside the storm. Outside is rain and a green sky; in here every
// window is gold, there is a fire in the inn and the smell of the cockle
// stall, and the whole town is busy and a bit loud and perfectly safe. So
// the song is a warm little waltz: a reed "accordion" (clarinet and oboe
// swelling together, bellows-style) leans on the afterbeats, plucked
// strings go oom-pah-pah, a harp, a flute for the tune, a hand drum, a
// bell for the quay clock, and now and then a drip off the eaves. Busy but
// soft. Reference for the mood only: Undertale's Snowdin and Hotland's
// mellow corners, a Cornish fishing village on a Saturday, Koji Kondo's
// Kakariko.
//
// THE HOOK IS HADDOCK'S MOTIF. Everyone in Saltcombe knows the lightman, so
// the town's own tune starts with his four notes (parts/chapter5.js), in F,
// in a waltz lilt: A - G F - C ("salt and rope, and"), then a little climb
// back up, E - F G. Then the motif again with its last note changed (A G
// F, D), a breath, the motif a step higher on G minor (B-flat A G, D), the
// climb again, and home (B-flat A G E, F). Two short phrases on the cell,
// answered by a longer one: it is the bar you leave the town humming. It
// opens the loop (A), goes down an octave onto a warm clarinet with a
// flute countermelody over it (A2), and comes home at the end in octaves
// with everybody, on new chords underneath (A3: D minor where it had F,
// and one warm borrowed E-flat for the G minor), the way a tune sounds
// different from the other end of the quay.
//
// ONE WRONG NOTE: a very quiet violas note, Gb, held under two bars, twice
// round the loop: it clashes gently and no one can say what it is. The
// town is lit, and the lamps up the hill are not. It is meant to be felt,
// not heard.
//
// THE COAST CELL (A D D E, the sea's tune) comes in once, from outside: in
// "rain" the waltz turns to D minor, the town's own relative minor, and a
// flute plays the cell over a far tremolo hiss, like someone opening the
// inn door on the storm and shutting it again.
//
// F major, 3/4 at 88 (a bar is about 2 seconds); one step a 16th, 12 to a
// bar. The intro plays once (2 bars); then it loops from A, 48 bars,
// about 1m38s:
//
//   intro    2 bars  the quay bell and the harp; the reed breathes in
//   A        8 bars  THE HOOK on the flute over the oom-pah-pah; the reed
//                    leans; the bass steps into every chord; a drip
//   A2       8 bars  the hook an octave down on the clarinet, a flute
//                    countermelody over it, the hand drum; Gb
//   B        8 bars  the market: a busy running tune on the oboe, the
//                    clarinet in thirds under it, a glock for the second
//                    half
//   rain     8 bars  the door opens: D minor, the coast cell on the flute,
//                    rain hissing far off on tremolo strings; then shut
//   bridge   8 bars  the inn by the fire: D minor, soft strings and harp,
//                    the oboe alone with a slower tune; quiet; it ends on
//                    A major, leaning into
//   A3       8 bars  THE PAYOFF: the hook in octaves (flute and clarinet)
//                    on new chords with the borrowed E-flat, the violins'
//                    countermelody, everybody; Gb; a bell for the quay
//                    clock; loops

const BAR = 12;
const tune = (text) => melody(text, 2);   // each token an 8th: 6 to a bar
const rest = (bars) => restBars(bars, BAR);
const after = (bars, track) => afterBars(bars, track, BAR);
const up = (steps, semitones) => transpose(steps, semitones);
const fit = (name, section, bars) => tight('Salt and Rope', name, section, bars, BAR);

// --- Harmony, a bar each ---
const A_CHORDS = 'F C Dm Bb Gm Am C F';
// The hook again, on new chords (one borrowed: the E-flat).
const A3_CHORDS = 'Dm Am F Bb Eb Am C F';
const MARKET_CHORDS = 'F C Dm Bb F C Gm C';
const BRIDGE_CHORDS = 'Dm Bb F C Dm Gm A A';
const RAIN_CHORDS = 'Dm Bb Gm A Dm Bb C A';
const INTRO_CHORDS = 'F C';

// --- THE HOOK: Haddock's motif (A G F, C) in a waltz, answered. ---
const HOOK = tune(`
  A5 - G5 F5 - C5       E5 - F5 G5 - -
  A5 - G5 F5 - D5       F5 - - - - .
  Bb5 - A5 G5 - D5      E5 - F5 G5 - A5
  Bb5 - A5 G5 - E5      F5 - - - - .
`);
// The countermelody over it: it holds while the hook moves and moves while
// the hook holds.
const COUNTER = tune(`
  C6 - - - - -          G5 - - . A5 Bb5
  A5 - - - - -          D6 - C6 Bb5 - A5
  G5 - - - - -          C6 - - . A5 -
  G5 - - - C6 Bb5       A5 - - - - .
`);
// The same, fitted to the new chords of A3.
const COUNTER_A3 = tune(`
  D6 - - - - -          C6 - - . A5 -
  C6 - - - - -          D6 - C6 Bb5 - A5
  G5 - - - - -          C6 - - . A5 -
  G5 - - - C6 Bb5       A5 - - - - .
`);
// The market: a busy waltz that runs up and settles.
const MARKET = tune(`
  A4 C5 F5 E5 F5 A5     G5 E5 C5 E5 G5 -
  F5 D5 A4 D5 F5 A5     G5 F5 D5 Bb4 D5 F5
  A5 F5 C5 F5 A5 C6     Bb5 G5 E5 G5 Bb5 -
  Bb5 A5 G5 F5 D5 Bb4   C5 E5 G5 C6 - -
`);
// The clarinet's thirds under the market tune.
const THIRDS = tune(`
  F4 A4 C5 C5 C5 F5     E5 C5 G4 C5 E5 -
  D5 Bb4 F4 Bb4 D5 F5   E5 D5 Bb4 G4 Bb4 D5
  F5 D5 A4 D5 F5 A5     G5 E5 C5 E5 G5 -
  G5 F5 E5 D5 Bb4 G4    G4 C5 E5 G5 - -
`);
// The inn by the fire: slower, one long line.
const FIRE = tune(`
  D5 - - F5 - -         D5 - - Bb4 - -
  A4 - C5 - F5 -        E5 - - - - -
  F5 - - A5 - -         G5 - - Bb5 - -
  A5 - - C#6 - -        D6 - - - - -
`);
// The door opens on the storm: the coast cell (A D D E) in D minor, twice.
const RAIN = tune(`
  A4 - D5 D5 - E5       F5 - - D5 - -
  A4 - D5 D5 - E5       E5 - - C#5 - -
  D5 - F5 A5 - G5       F5 - - D5 - -
  E5 - G5 - E5 C5       C#5 - - - - -
`);

// --- The band ---
// The bass: the root on one, left to ring, and on three a note that steps
// into the next bar's root (from below when it climbs, from above when it
// falls), so the waltz always leans forward.
const chordsOf = (chords) => chords.split(/\s+/).filter(Boolean).map((symbol) => {
  const [, name, minor] = symbol.match(/^([A-G][#b]?)(m?)$/);
  return { root: midi(`${name}2`), third: minor ? 3 : 4 };
});
const fitBass = (n) => { let low = n; while (low < 45) low += 12; while (low > 56) low -= 12; return low; };   // A2 to G#3
const leanInto = (from, to, third) => {
  if (to === from) return from + third;
  if (to > from || from - to <= 2) return to - 1;
  return to + 2;
};
function walk(chords) {
  const lows = chordsOf(chords).map((c) => ({ ...c, low: fitBass(c.root) }));
  return lows.flatMap((c, i) => [c.low, '-', '-', '-', '.', '.', '.', '.', leanInto(c.low, lows[(i + 1) % lows.length].low, c.third), '.', '.', '.']);
}
const PAH = ['.', '.', '.', '.', 'third', '.', '.', '.', 7, '.', '.', '.'];
const WALTZ = [0, '.', '.', '.', 7, '.', '.', '.', 12, '.', '.', '.'];
const SLOW = [0, '-', '-', '-', 7, '-', '-', '-', 12, '-', '-', '-'];
const pah = (chords) => chordLine(chords, PAH, 4);
const harp = (chords) => arpeggio(chords, BAR, 3, WALTZ);
const harpSlow = (chords) => arpeggio(chords, BAR, 3, SLOW);
const plainBass = (chords) => chordLine(chords, [0, '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'], 2).map((n) => (typeof n === 'number' ? n + 12 : n));
// The reed leans on beats two and three: a chord swelling out of nowhere.
const reedChord = (chords, voice) => chordLine(chords, ['.', '.', '.', '.', voice, ...Array(7).fill('-')], 4);
const TICK = hits('x...x.x...x.');
// The quay clock: a bell on the first beat of the last bar of a section.
const clock = (bars) => scatter(bars, BAR, [[bars - 1, 0, 'F5']]);
// Drips off the eaves, now and then.
const drips = (events) => scatter(8, BAR, events);
// The wrong note: Gb, held two bars.
const WRONG = (bars, at) => {
  const out = rest(bars);
  out[at * BAR] = midi('Gb3');
  for (let i = 1; i < 2 * BAR; i++) out[at * BAR + i] = '-';
  return out;
};

export const SALTCOMBE_THEME = {
  title: 'Salt and Rope',
  bpm: 88,
  stepsPerBeat: 4,
  volume: 0.9,

  instruments: {
    flute: { sample: 'flute', volume: 0.28, attack: 0.05, release: 0.4, reverb: 0.35, pan: 0.1, humanize: { time: 0.012, volume: 0.12 } },
    flute2: { sample: 'flute', volume: 0.18, attack: 0.08, release: 0.5, reverb: 0.45, pan: 0.3, humanize: { time: 0.012, volume: 0.12 } },
    // The accordion: two reeds together.
    reed: { sample: 'clarinet', volume: 0.12, attack: 0.25, release: 0.4, reverb: 0.3, pan: -0.2, humanize: { time: 0.01, volume: 0.1 } },
    reedOboe: { sample: 'oboe', volume: 0.1, attack: 0.25, release: 0.4, reverb: 0.3, pan: -0.1, humanize: { time: 0.01, volume: 0.1 } },
    clarinet: { sample: 'clarinet', volume: 0.27, attack: 0.05, release: 0.4, reverb: 0.35, pan: -0.2, humanize: { time: 0.012, volume: 0.12 } },
    thirds: { sample: 'clarinet', volume: 0.18, attack: 0.05, release: 0.35, reverb: 0.35, pan: -0.25, humanize: { time: 0.012, volume: 0.12 } },
    oboe: { sample: 'oboe', volume: 0.25, attack: 0.05, release: 0.35, reverb: 0.35, pan: 0.2, humanize: { time: 0.012, volume: 0.12 } },
    violins: { sample: 'violins', volume: 0.11, attack: 0.25, release: 0.6, reverb: 0.4, pan: 0.3 },
    harp: { sample: 'harp', volume: 0.2, ring: true, reverb: 0.4, pan: -0.3, humanize: { time: 0.012, volume: 0.2 } },
    harpSoft: { sample: 'harp', volume: 0.15, ring: true, reverb: 0.5, pan: -0.25, humanize: { time: 0.014, volume: 0.2 } },
    pad: { sample: 'violas', volume: 0.1, attack: 0.5, release: 0.9, reverb: 0.4, pan: -0.15 },
    // The rain outside, a long way off.
    rain: { sample: 'violinsTrem', volume: 0.05, attack: 1.2, release: 1.6, muffle: 2200, reverb: 0.6, pan: 0.25 },
    drop: { sample: 'glass', volume: 0.06, ring: true, reverb: 0.7, pan: -0.3, echo: { time: 0.45, feedback: 0.3, mix: 0.25 } },
    wrong: { sample: 'violas', volume: 0.05, attack: 1.2, release: 1.4, reverb: 0.5, pan: 0.1 },
    bass: { sample: 'cellosPizz', volume: 0.3, release: 0.15, reverb: 0.2, pan: -0.15, humanize: { time: 0.006, volume: 0.12 } },
    pah: { sample: 'violinsPizz', volume: 0.17, release: 0.1, reverb: 0.25, pan: 0.3, humanize: { time: 0.008, volume: 0.15 } },
    bells: { sample: 'glock', volume: 0.11, ring: true, reverb: 0.5, pan: 0.35, echo: { time: 0.4, feedback: 0.25, mix: 0.2 } },
    clock: { sample: 'chimes', volume: 0.16, ring: true, reverb: 0.6, pan: 0.3 },
    tick: { sample: 'frameDrum', drum: 'sample', volume: 0.1, ring: true, reverb: 0.25, humanize: { time: 0.005, volume: 0.25 } },
  },

  sections: {
    intro: fit('intro', {
      harp: harpSlow(INTRO_CHORDS),
      clock: scatter(2, BAR, [[0, 0, 'F5']]),
      reed: [...rest(1), midi('F4'), ...Array(11).fill('-')],
    }, 2),

    // THE HOOK on the flute; the reed leans; a drip off the eaves.
    A: fit('A', {
      flute: HOOK,
      reed: reedChord(A_CHORDS, 'third'),
      reedOboe: reedChord(A_CHORDS, 7),
      harp: harp(A_CHORDS),
      bass: walk(A_CHORDS),
      pah: pah(A_CHORDS),
      drop: drips([[3, 6, 'C6'], [7, 6, 'F6']]),
    }, 8),

    // The hook down an octave on the clarinet, the flute's countermelody
    // over it; the hand drum; the wrong note.
    A2: fit('A2', {
      clarinet: up(HOOK, -12),
      flute2: COUNTER,
      reed: reedChord(A_CHORDS, 7),
      harp: harp(A_CHORDS),
      bass: walk(A_CHORDS),
      pah: pah(A_CHORDS),
      pad: sustained(A_CHORDS, BAR, 2, 3),
      wrong: WRONG(8, 3),
      tick: repeat(TICK, 8),
      drop: drips([[1, 8, 'A5']]),
    }, 8),

    // The market: a busy running tune, thirds under it, a glock later.
    B: fit('B', {
      oboe: MARKET,
      thirds: THIRDS,
      bells: after(4, up(MARKET, 12)),
      reed: reedChord(MARKET_CHORDS, 'third'),
      harp: harp(MARKET_CHORDS),
      bass: walk(MARKET_CHORDS),
      pah: pah(MARKET_CHORDS),
      tick: repeat(TICK, 8),
    }, 8),

    // The door opens on the storm, then shuts.
    rain: fit('rain', {
      flute: RAIN,
      harpSoft: harp(RAIN_CHORDS),
      pad: sustained(RAIN_CHORDS, BAR, 0, 3),
      rain: [...sustained('Dm Bb Gm A Dm Bb', BAR, 2, 4), ...rest(2)],
      bass: plainBass(RAIN_CHORDS),
      pah: pah(RAIN_CHORDS),
      drop: scatter(8, BAR, [[1, 6, 'D6'], [3, 9, 'A5'], [5, 3, 'F5']]),
    }, 8),

    bridge: fit('bridge', {
      oboe: FIRE,
      violins: sustained(BRIDGE_CHORDS, BAR, 2, 4),
      pad: sustained(BRIDGE_CHORDS, BAR, 0, 3),
      harpSoft: harpSlow(BRIDGE_CHORDS),
      bass: chordLine(BRIDGE_CHORDS, [0, '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'], 3),
    }, 8),

    // THE PAYOFF: the hook in octaves on new chords, everybody.
    A3: fit('A3', {
      flute: HOOK,
      clarinet: up(HOOK, -12),
      violins: COUNTER_A3,
      reed: reedChord(A3_CHORDS, 'third'),
      reedOboe: reedChord(A3_CHORDS, 7),
      harp: harp(A3_CHORDS),
      bass: walk(A3_CHORDS),
      pah: pah(A3_CHORDS),
      wrong: WRONG(8, 0),
      tick: repeat(TICK, 8),
      clock: clock(8),
    }, 8),
  },

  order: ['intro', 'A', 'A2', 'B', 'rain', 'bridge', 'A3'],
  loopFrom: 1,
};
