import {
  melody, arpeggio, sustained, chordLine, transpose, rest as restBars, hits, repeat,
  haddockPhrase, tight, midi, scatter,
} from './parts/chapter5.js';

// "Out Past the Light": the theme of the Storm Reach, the open sea between
// Haddock's Light and the Last Light. You are in a rowboat (the *Bother*),
// putting in at a rock, a reef, a wreck, between rough crossings, and the
// black tower is a little bigger on the skyline every time. It is going out
// past where it's safe, and it pulls: this is the area song that rows.
//
// THE PULSE is the oars. A frame drum knocks on the two big beats of the
// 6/8 bar, with a soft tom pulling on the last 8th every other bar ("row,
// row, and pull"); plucked cellos and a low harp row the bass (root, root,
// fifth, then a step into the next chord, so the boat is always being
// pulled on to the next one). Over it a harp turns one fixed figure over
// and over like a swell lifting the boat (a fixed ostinato with a moving
// bass, after Hollow Knight's City of Tears), tremolo strings hiss like
// rain, and gusts are quick flute runs and a cymbal swelling into the big
// sections. The storm is in the drive, not in loud low strings: there are
// no big cellos, no brass blasts, nothing like a boss.
//
// THE HOOK is the brave tune on the solo violin, and it is the coast cell
// (A D D E in D minor), here in G minor: D G G A, Bb - A G. It lands in
// the first bar of A, the flute joins it in unison the second time round,
// and in D it comes back as the payoff with everyone: violin and flute,
// the violins an octave under, a viola countermelody against it, timpani
// on the downbeats. The harp's swell is made of the same three notes (D G
// A D A G), so the sea and the tune are one thing. In the eye a bowed
// vibraphone plays the cell slowed to a bar a note; in D the oboe turns it
// upside down (D G G F).
//
// HADDOCK'S MOTIF (parts/chapter5.js), minor, in G: Bb A G, D. In the eye
// the clarinet plays it once, slow; then the harp starts it again and stops
// after three notes. That's all: he is in the boat with you, saying little.
//
// THE BELL is the tower out there: a far, muffled chime, once or twice a
// section, and in D it comes closer together (bars 4, 8, 12, 14, 16) and
// the last three are a nearer, brighter bell.
//
// G minor, 6/8 at 76 dotted quarters a minute (a bar is about 1.58
// seconds); one step an 8th, six to a bar. The intro plays once (2 bars);
// then it loops from A, 64 bars, about 1m41s:
//
//   intro   2 bars    3s   the swell alone; a far bell
//   A      16 bars   25s   THE HOOK on solo violin (D G G A, Bb - A G):
//                          the first half asks (stops on A over D), the
//                          second comes home to G with the flute on it too;
//                          the oars row from bar 1; rain from bar 9; a
//                          cymbal swells into
//   B      16 bars   25s   the fight: a higher second tune in E-flat and B
//                          flat, the violin up to F6; flute gusts at each
//                          phrase end; the tom pulls every bar now; more
//                          rain (violas tremolo too)
//   C      12 bars   19s   the eye: the oars stop; held strings; Haddock's
//                          motif on the clarinet, a broken piece of it on
//                          the harp; the slowed cell on bowed vibes, asking
//                          on A over D; then the drum creeps back and a
//                          cymbal swells into
//   D      16 bars   25s   THE HOOK, the payoff: everyone, the violas'
//                          countermelody, timpani on the downbeats, the
//                          oboe's upside-down cell; the bell comes closer;
//                          the last four bars climb through C minor and
//                          A-flat (the one borrowed chord) to D
//   tail    4 bars    6s   the swell and the bell; D major hangs and loops
//                          round to G minor

const BAR = 6;
const tune = (text) => melody(text, 1);   // each token an 8th: 6 to a bar
const rest = (bars) => restBars(bars, BAR);
const fit = (name, section, bars) => tight('Out Past the Light', name, section, bars, BAR);
// Lay [startBar, steps] parts down on a track of rests `bars` long.
const place = (bars, ...parts) => {
  const out = rest(bars);
  for (const [at, steps] of parts) {
    if (at * BAR + steps.length > out.length) throw new Error(`Out Past the Light: a part from bar ${at} runs past ${bars} bars`);
    steps.forEach((s, i) => { out[at * BAR + i] = s; });
  }
  return out;
};

// --- Harmony, a bar each ---
const INTRO_CHORDS = 'Gm Gm';
const A_CHORDS = 'Gm Eb F D Gm Eb F D   Gm Eb Bb Gm Cm Gm D Gm';
const B_CHORDS = 'Eb F Bb Gm Eb F D D   Cm Gm Eb Bb Cm Eb D D';
const C_CHORDS = 'Gm Gm Eb Eb Gm Gm Eb Eb Cm Cm D D';
const D_CHORDS = 'Gm Eb F D Gm Eb F D   Gm Eb Bb Gm Cm Ab D D';
const TAIL_CHORDS = 'Gm Eb Cm D';

// --- The brave tune (sing it: D G G A, Bb - A G) ---
const TUNE_A = tune(`
  D5 - G5 G5 - A5    Bb5 - - A5 - G5    F5 - D5 - - C5     D5 - - - - .
  D5 - G5 G5 - A5    Bb5 - C6 D6 - -    C6 - Bb5 A5 - F5   A5 - - - - .
  D5 - G5 G5 - A5    Bb5 - - D6 - C6    Bb5 - A5 G5 - F5   G5 - - D5 - -
  Eb5 - - D5 - C5    Bb4 - C5 D5 - G5   F#5 - - A5 - F#5   G5 - - - - .
`);
// The last four bars of D: the climb toward the tower.
const CLIMB_D = tune(`
  Eb5 - G5 C6 - Eb6  Eb6 - - C6 - Ab5   A5 - - D6 - -      D6 - - - - .
`);
// The fight: higher, wider, in E-flat and B-flat.
const TUNE_B = tune(`
  G5 - Bb5 Eb6 - D6  C6 - - A5 - F5     D6 - - Bb5 - F5    G5 - - - - .
  G5 - Bb5 Eb6 - F6  F6 - Eb6 D6 - C6   D6 - - A5 - F#5    A5 - - - - .
  G5 - C6 Eb6 - D6   D6 - Bb5 G5 - D5   Eb5 - G5 Bb5 - C6  D6 - - - - F5
  G5 - - Eb6 - D6    C6 - - Bb5 - G5    F#5 - A5 D6 - C6   A5 - - F#5 - .
`);
// Gusts: quick flute runs where the violin holds.
const GUST_DOWN_G = tune('. . D6 C6 Bb5 G5');
const GUST_UP_D = tune('. . F#5 A5 D6 -');
const GUST_UP_BB = tune('. . F5 Bb5 D6 -');
const GUST_DOWN_D = tune('. . D6 C6 A5 F#5');
// The coast cell slowed to a bar a note (the eye), and upside down (D).
const SLOW_CELL = tune('D5 - - - - -  G5 - - - - -  G5 - - - - -  A5 - - - - .');
const CELL_DOWN = tune('D5 - - G5 - -  G5 - - F5 - -');
// Haddock in the eye: his motif whole, slow; then only three notes.
const HADDOCK = haddockPhrase('G4', { minor: true, lengths: [4, 2, 4, 2], unit: 1 });
const HADDOCK_BROKEN = tune('Bb4 - - - A4 -  G4 - - - - .');

// The violas' countermelody under the payoff (D): two notes a bar, always
// on the chord, moving while the tune holds.
const COUNTER_D = tune(`
  Bb4 - - D5 - -     G4 - - Bb4 - -     A4 - - C5 - -      F#4 - - A4 - -
  G4 - - Bb4 - -     Bb4 - - G4 - -     A4 - - F4 - -      F#4 - - - - -
  D5 - - Bb4 - -     Bb4 - - G4 - -     D5 - - F5 - -      D5 - - Bb4 - -
  C5 - - Eb5 - -     Eb5 - - C5 - -     F#4 - - A4 - -     F#4 - - - - -
`);

// --- The band ---
// The swell: one fixed figure on the cell's notes, rocking up and back.
const SWELL = tune('D4 G4 A4 D5 A4 G4');
const swell = (bars) => Array.from({ length: bars }, () => SWELL).flat();
const swellWide = (chords) => arpeggio(chords, BAR, 3, [0, 7, 12, 'tenth', 12, 7]);
// The low strings hold root to fifth in the eye, a dotted quarter each.
const rock = (chords) => chordLine(chords, [0, '-', '-', 7, '-', '-'], 2);
// Low harp notes under E-flat 2 go up an octave: the harp's lowest strings
// boom and wobble ("boing") instead of ringing.
const lift = (track) => track.map((n) => (typeof n === 'number' && n < 39 ? n + 12 : n));
const harpRoot = (chords) => lift(chordLine(chords, [0, '.', '.', '.', '.', '.'], 2));

// The oars: the rowing bass. Root, root, fifth, then a step of the scale
// into the next chord's root.
const NAMES = { C: 0, D: 2, Eb: 3, E: 4, F: 5, 'F#': 6, G: 7, Ab: 8, A: 9, Bb: 10, B: 11 };
const G_MINOR = [7, 9, 10, 0, 2, 3, 5, 6];   // with F# for the D chords
const rootOf = (symbol) => NAMES[symbol.replace(/m$/, '')];
const low = (pc) => 36 + pc;   // C2 up to B2
function oars(chords) {
  const list = chords.split(/\s+/).filter(Boolean);
  return list.flatMap((symbol, i) => {
    const root = low(rootOf(symbol));
    const next = low(rootOf(list[(i + 1) % list.length]));
    let lead = root + 7;
    if (next !== root) {
      const step = next > root ? -1 : 1;
      lead = next + step;
      while (!G_MINOR.includes(lead % 12)) lead += step;
      if (lead === root) lead = root + 7;
    }
    return [root, '.', root, root + 7, '.', lead];
  });
}
const OAR = hits('x..x..');
const PULL = hits('x..x.x');
const row = (bars) => repeat([...OAR, ...PULL], bars / 2);
const pull = (bars) => repeat(PULL, bars);
// Timpani on the payoff's downbeats, on the chord's root.
const TIMP = { Gm: 'G2', Eb: 'Eb2', F: 'F2', D: 'D2', Bb: 'Bb2', Cm: 'C3', Ab: 'Ab2' };
const timp = (chords) => chords.split(/\s+/).filter(Boolean).flatMap((c) => [midi(TIMP[c]), ...Array(BAR - 1).fill('.')]);
// Rain: tremolo, held a bar a chord.
const rain = (chords) => sustained(chords, BAR, 1, 5);
const rainLow = (chords) => sustained(chords, BAR, 2, 4);
// The bell: the tower out there, far; and nearer.
const bell = (bars, at) => scatter(bars, BAR, at.map((b) => [b, 0, 'D4']));
// A cymbal swelling to a downbeat: its peak is 3.18 s in, 12 8ths at 76,
// so it starts two bars before.
const gust = (bars, at) => { const out = rest(bars); out[at * BAR] = 'x'; return out; };

export const REACH_THEME = {
  title: 'Out Past the Light',
  bpm: 76,
  stepsPerBeat: 3,
  volume: 1.25,

  instruments: {
    swell: { sample: 'harp', volume: 0.15, ring: true, reverb: 0.55, pan: 0.2, humanize: { time: 0.01, volume: 0.2 } },
    swellWide: { sample: 'harp', volume: 0.12, ring: true, reverb: 0.6, pan: -0.2, humanize: { time: 0.012, volume: 0.2 } },
    harpRoot: { sample: 'harp', volume: 0.15, ring: true, reverb: 0.45, pan: -0.25, humanize: { time: 0.01, volume: 0.15 } },
    harpSolo: { sample: 'harp', volume: 0.18, ring: true, reverb: 0.7, pan: 0.15 },
    oars: { sample: 'cellosPizz', volume: 0.2, release: 0.3, reverb: 0.35, pan: -0.1, muffle: 1600, humanize: { time: 0.006, volume: 0.15 } },
    rock: { sample: 'cellos', volume: 0.07, attack: 0.5, release: 0.9, reverb: 0.5, pan: -0.15, muffle: 700 },
    drum: { sample: 'frameDrum', drum: 'sample', volume: 0.17, reverb: 0.35, muffle: 1600, humanize: { time: 0.005, volume: 0.12 } },
    tom: { sample: 'tom', drum: 'sample', volume: 0.08, reverb: 0.45, muffle: 1000, humanize: { time: 0.005, volume: 0.12 } },
    timpani: { sample: 'timpani', volume: 0.13, ring: true, reverb: 0.5, muffle: 2500 },
    gust: { sample: 'cymbalSwell', drum: 'sample', volume: 0.06, reverb: 0.7, muffle: 5000 },
    violin: { sample: 'soloViolin', volume: 0.2, attack: 0.08, release: 0.55, reverb: 0.5, pan: 0.05, humanize: { time: 0.01, volume: 0.1 } },
    fluteHook: { sample: 'flute', volume: 0.13, attack: 0.05, release: 0.45, reverb: 0.55, pan: 0.25, humanize: { time: 0.01, volume: 0.1 } },
    violinsHook: { sample: 'violins', volume: 0.07, attack: 0.12, release: 0.6, reverb: 0.6, pan: 0.3 },
    counter: { sample: 'violas', volume: 0.1, attack: 0.25, release: 0.8, reverb: 0.6, pan: -0.3 },
    flute: { sample: 'flute', volume: 0.14, attack: 0.03, release: 0.4, reverb: 0.6, pan: 0.35, humanize: { time: 0.01, volume: 0.15 } },
    fluteLong: { sample: 'flute', volume: 0.12, attack: 0.3, release: 0.9, reverb: 0.7, pan: 0.3 },
    oboe: { sample: 'oboe', volume: 0.15, attack: 0.1, release: 0.6, reverb: 0.55, pan: -0.2, humanize: { time: 0.012, volume: 0.12 } },
    clarinet: { sample: 'clarinet', volume: 0.17, attack: 0.15, release: 0.8, reverb: 0.65, pan: -0.15 },
    horn: { sample: 'hornsSoft', volume: 0.08, attack: 0.6, release: 1.2, reverb: 0.6, pan: -0.3 },
    rain: { sample: 'violinsTrem', volume: 0.045, attack: 1.2, release: 1.4, reverb: 0.65, pan: 0.35 },
    rainLow: { sample: 'violasTrem', volume: 0.045, attack: 1.2, release: 1.4, reverb: 0.65, pan: -0.35 },
    violas: { sample: 'violas', volume: 0.08, attack: 1.4, release: 1.8, reverb: 0.65, pan: -0.1 },
    violins: { sample: 'violins', volume: 0.05, attack: 1.6, release: 2.0, reverb: 0.7, pan: 0.3 },
    vibes: { sample: 'vibesBowed', volume: 0.1, attack: 0.4, release: 1.4, reverb: 0.8, pan: 0.2, echo: { time: 0.6, feedback: 0.3, mix: 0.25 } },
    choir: { sample: 'choir', volume: 0.06, attack: 1.4, release: 1.8, reverb: 0.8 },
    bell: { sample: 'chimes', volume: 0.09, ring: true, reverb: 0.85, pan: -0.4, muffle: 2200, echo: { time: 0.79, feedback: 0.3, mix: 0.3 } },
    bellNear: { sample: 'chimes', volume: 0.12, ring: true, reverb: 0.7, pan: -0.25, muffle: 4500, echo: { time: 0.79, feedback: 0.25, mix: 0.25 } },
    drop: { sample: 'glass', volume: 0.06, ring: true, reverb: 0.8, pan: 0.35, echo: { time: 0.53, feedback: 0.3, mix: 0.25 } },
  },

  sections: {
    intro: fit('intro', {
      swell: swell(2),
      harpRoot: harpRoot(INTRO_CHORDS),
      bell: bell(2, [1]),
    }, 2),

    A: fit('A', {
      violin: TUNE_A,
      fluteHook: [...rest(8), ...TUNE_A.slice(8 * BAR)],
      swell: swell(16),
      harpRoot: harpRoot(A_CHORDS),
      oars: oars(A_CHORDS),
      drum: row(16),
      horn: sustained(A_CHORDS, BAR, 0, 3),
      rain: [...rest(8), ...rain(A_CHORDS).slice(8 * BAR)],
      bell: bell(16, [7, 15]),
      gust: gust(16, 14),
    }, 16),

    B: fit('B', {
      violin: TUNE_B,
      flute: place(16, [3, GUST_DOWN_G], [7, GUST_UP_D], [11, GUST_UP_BB], [15, GUST_DOWN_D]),
      swell: swell(16),
      swellWide: [...rest(8), ...swellWide(B_CHORDS).slice(8 * BAR)],
      harpRoot: harpRoot(B_CHORDS),
      oars: oars(B_CHORDS),
      drum: pull(16),
      tom: pull(16),
      violas: sustained(B_CHORDS, BAR, 1, 3),
      rain: rain(B_CHORDS),
      rainLow: rainLow(B_CHORDS),
    }, 16),

    // The eye: nearly still. Haddock's tune, once whole and once in pieces;
    // then the oars creep back in.
    C: fit('C', {
      clarinet: place(12, [0, HADDOCK]),
      harpSolo: place(12, [4, HADDOCK_BROKEN]),
      fluteLong: place(12, [6, tune('Bb5 - - - - -  G5 - - - - .')]),
      vibes: place(12, [8, SLOW_CELL]),
      rock: sustained(C_CHORDS, BAR, 0, 2),
      // On the bar where the slowed cell holds G over D, the violas hold G
      // too (a suspension) and fall to F sharp a bar later.
      violas: sustained(C_CHORDS, BAR, 1, 3).map((n, i) => (n === 54 && Math.floor(i / BAR) === 10 ? 55 : n)),
      violins: sustained(C_CHORDS, BAR, 2, 4),
      choir: [...rest(4), ...sustained(C_CHORDS, BAR, 2, 4).slice(4 * BAR)],
      drop: scatter(12, BAR, [[1, 4, 'D6'], [3, 2, 'A5'], [5, 5, 'G5'], [7, 1, 'D6'], [9, 3, 'Bb5'], [11, 4, 'A5']]),
      drum: [...rest(8), ...hits('x.....'), ...hits('x.....'), ...OAR, ...PULL],
      gust: gust(12, 10),
    }, 12),

    // The payoff: the hook with everyone, then the climb to the tower.
    D: fit('D', {
      violin: [...TUNE_A.slice(0, 12 * BAR), ...CLIMB_D],
      fluteHook: [...TUNE_A.slice(0, 12 * BAR), ...CLIMB_D],
      violinsHook: transpose([...TUNE_A.slice(0, 12 * BAR), ...CLIMB_D], -12),
      counter: COUNTER_D,
      oboe: place(16, [10, CELL_DOWN]),
      flute: place(16, [3, GUST_UP_D], [7, GUST_DOWN_D]),
      swell: [...swell(12), ...rest(4)],
      swellWide: [...rest(12), ...swellWide(D_CHORDS).slice(12 * BAR)],
      harpRoot: harpRoot(D_CHORDS),
      oars: oars(D_CHORDS),
      drum: pull(16),
      tom: row(16),
      timpani: timp(D_CHORDS),
      horn: sustained(D_CHORDS, BAR, 0, 3),
      choir: [...rest(8), ...sustained(D_CHORDS, BAR, 1, 4).slice(8 * BAR)],
      rain: rain(D_CHORDS),
      rainLow: rainLow(D_CHORDS),
      bell: bell(16, [3, 7]),
      bellNear: bell(16, [11, 13, 15]),
    }, 16),

    tail: fit('tail', {
      swell: swell(4),
      harpRoot: harpRoot(TAIL_CHORDS),
      rock: rock(TAIL_CHORDS),
      drum: [...OAR, ...rest(3)],
      violins: [...rest(2), midi('A4'), ...Array(2 * BAR - 1).fill('-')],
      bell: bell(4, [1, 3]),
    }, 4),
  },

  order: ['intro', 'A', 'B', 'C', 'D', 'tail'],
  loopFrom: 1,
};
