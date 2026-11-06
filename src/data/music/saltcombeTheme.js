import {
  melody, hits, repeat, arpeggio, sustained, chordLine, transpose, rest as restBars,
  haddockPhrase, tight, midi, after as afterBars, scatter,
} from './parts/chapter5.js';

// "Salt and Rope": the theme of Saltcombe, the stilt town on the quay, lit
// up inside the storm. Outside is rain and a green sky; in here every
// window is gold, there is a fire in the inn and the smell of the cockle
// stall, and the whole town is busy and a bit loud and perfectly safe. So
// the song is a warm little waltz: a reed "accordion" (clarinet and oboe
// swelling together, bellows-style) leans on the afterbeats, plucked
// strings go oom-pah-pah, a harp, a flute for the tune, a hand drum, a
// bell for the quay clock. Busy but soft. Reference for the mood only:
// Undertale's Snowdin and Hotland's mellow corners, a Cornish fishing
// village on a Saturday, Koji Kondo's Kakariko.
//
// ONE WRONG NOTE: a very quiet violas note, Gb, held under two bars of the
// repeat: it clashes gently with F major and no one can say what it is. The
// town is lit, and the lamps up the hill are not. It is meant to be felt,
// not heard.
//
// HADDOCK'S MOTIF is the little town tune (section B): everyone in Saltcombe
// knows the lightman, so his four notes (parts/chapter5.js) go round the
// town as a tune, in F (A G F, C), then in B-flat, F, C, D minor, G minor
// and F again, one to a bar, the way a street tune gets passed from
// whistler to whistler.
//
// F major, 3/4 at 88 (a bar is about 2 seconds); one step a 16th, 12 to a
// bar. The intro plays once (2 bars); then it loops from A, 48 bars,
// about 1m38s:
//
//   intro    2 bars  the quay bell and the harp; the reed breathes in
//   A        8 bars  the tune on flute over the oom-pah-pah; the reed leans
//   A2       8 bars  oboe and violins take it, the reed in thirds; Gb
//   B        8 bars  THE TOWN TUNE: Haddock's motif bar by bar, a glock and
//                    clarinet trading it, the plucks bouncing
//   bridge   8 bars  the inn by the fire: D minor, soft strings and harp,
//                    the oboe alone with a slower tune; quiet
//   B2       8 bars  the town tune again, flute and oboe, Gb again, the
//                    hand drum
//   A3       8 bars  the tune home, a bell for the quay clock; loops

const BAR = 12;
const tune = (text) => melody(text, 2);   // each token an 8th: 6 to a bar
const rest = (bars) => restBars(bars, BAR);
const after = (bars, track) => afterBars(bars, track, BAR);
const up = (steps, semitones) => transpose(steps, semitones);
const fit = (name, section, bars) => tight('Salt and Rope', name, section, bars, BAR);

// --- Harmony, a bar each ---
const A_CHORDS = 'F C Dm Bb F C Gm C';
const B_CHORDS = 'F Bb F C Dm Gm C F';
const BRIDGE_CHORDS = 'Dm Bb F C Dm Gm A A';
const INTRO_CHORDS = 'F C';

// --- The tune: a waltz that climbs and settles. ---
const TUNE_A = tune(`
  A4 C5 F5 E5 F5 A5     G5 E5 C5 E5 G5 -
  F5 D5 A4 D5 F5 A5     G5 F5 D5 Bb4 D5 F5
  A5 F5 C5 F5 A5 C6     Bb5 G5 E5 G5 Bb5 -
  Bb5 A5 G5 F5 D5 Bb4   C5 E5 G5 C6 - -
`);
// THE TOWN TUNE: Haddock's motif on every chord in turn (A G F, C and so on).
const TOWN = tune(`
  A5 - G5 F5 - C5       D5 - C5 Bb4 - F4
  A5 - G5 F5 - C5       E5 - D5 C5 - G4
  F5 - E5 D5 - A4       Bb4 - A4 G4 - D4
  E5 - D5 C5 - G4       A5 - G5 F5 - -
`);
// The inn by the fire: slower, one long line.
const FIRE = tune(`
  D5 - - F5 - -         D5 - - Bb4 - -
  A4 - C5 - F5 -        E5 - - - - -
  F5 - - A5 - -         G5 - - Bb5 - -
  A5 - - C#6 - -        D6 - - - - -
`);
// The reed's thirds below the tune.
const THIRDS = tune(`
  F4 A4 C5 C5 C5 F5     E5 C5 G4 C5 E5 -
  D5 Bb4 F4 Bb4 D5 F5   E5 D5 Bb4 G4 Bb4 D5
  F5 D5 A4 D5 F5 A5     G5 E5 C5 E5 G5 -
  G5 F5 E5 D5 Bb4 G4    G4 C5 E5 G5 - -
`);

// --- The band ---
const OOM = [0, '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'];
const PAH = ['.', '.', '.', '.', 'third', '.', '.', '.', 7, '.', '.', '.'];
const WALTZ = [0, '.', '.', '.', 7, '.', '.', '.', 12, '.', '.', '.'];
const SLOW = [0, '-', '-', '-', 7, '-', '-', '-', 12, '-', '-', '-'];
const bass = (chords) => chordLine(chords, OOM, 2).map((n) => (typeof n === 'number' ? n + 12 : n));
const pah = (chords) => chordLine(chords, PAH, 4);
const harp = (chords) => arpeggio(chords, BAR, 3, WALTZ);
const harpSlow = (chords) => arpeggio(chords, BAR, 3, SLOW);
// The reed leans on beats two and three: a chord swelling out of nowhere.
const reedChord = (chords, voice) => chordLine(chords, ['.', '.', '.', '.', voice, ...Array(7).fill('-')], 4);
const TICK = hits('x...x.x...x.');
// The quay clock: a bell on the first beat of the last bar of a section.
const clock = (bars) => scatter(bars, BAR, [[bars - 1, 0, 'F5']]);
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
    flute: { sample: 'flute', volume: 0.26, attack: 0.05, release: 0.4, reverb: 0.35, pan: 0.1, humanize: { time: 0.012, volume: 0.12 } },
    // The accordion: two reeds together.
    reed: { sample: 'clarinet', volume: 0.12, attack: 0.25, release: 0.4, reverb: 0.3, pan: -0.2, humanize: { time: 0.01, volume: 0.1 } },
    reedOboe: { sample: 'oboe', volume: 0.11, attack: 0.25, release: 0.4, reverb: 0.3, pan: -0.1, humanize: { time: 0.01, volume: 0.1 } },
    clarinet: { sample: 'clarinet', volume: 0.26, attack: 0.05, release: 0.35, reverb: 0.35, pan: -0.2, humanize: { time: 0.012, volume: 0.12 } },
    oboe: { sample: 'oboe', volume: 0.26, attack: 0.05, release: 0.35, reverb: 0.35, pan: 0.2, humanize: { time: 0.012, volume: 0.12 } },
    violins: { sample: 'violins', volume: 0.12, attack: 0.25, release: 0.6, reverb: 0.4, pan: 0.3 },
    harp: { sample: 'harp', volume: 0.2, ring: true, reverb: 0.4, pan: -0.3, humanize: { time: 0.012, volume: 0.2 } },
    harpSoft: { sample: 'harp', volume: 0.15, ring: true, reverb: 0.5, pan: -0.25, humanize: { time: 0.014, volume: 0.2 } },
    pad: { sample: 'violas', volume: 0.1, attack: 0.5, release: 0.9, reverb: 0.4, pan: -0.15 },
    wrong: { sample: 'violas', volume: 0.05, attack: 1.2, release: 1.4, reverb: 0.5, pan: 0.1 },
    bass: { sample: 'cellosPizz', volume: 0.3, release: 0.15, reverb: 0.2, pan: -0.15, humanize: { time: 0.006, volume: 0.12 } },
    pah: { sample: 'violinsPizz', volume: 0.18, release: 0.1, reverb: 0.25, pan: 0.3, humanize: { time: 0.008, volume: 0.15 } },
    bells: { sample: 'glock', volume: 0.14, ring: true, reverb: 0.5, pan: 0.35, echo: { time: 0.4, feedback: 0.25, mix: 0.2 } },
    clock: { sample: 'chimes', volume: 0.16, ring: true, reverb: 0.6, pan: 0.3 },
    tick: { sample: 'frameDrum', drum: 'sample', volume: 0.1, ring: true, reverb: 0.25, humanize: { time: 0.005, volume: 0.25 } },
  },

  sections: {
    intro: fit('intro', {
      harp: harpSlow(INTRO_CHORDS),
      clock: scatter(2, BAR, [[0, 0, 'F5']]),
      reed: [...rest(1), midi('F4'), ...Array(11).fill('-')],
    }, 2),

    A: fit('A', {
      flute: TUNE_A,
      reed: reedChord(A_CHORDS, 'third'),
      reedOboe: reedChord(A_CHORDS, 7),
      harp: harp(A_CHORDS),
      bass: bass(A_CHORDS),
      pah: pah(A_CHORDS),
    }, 8),

    A2: fit('A2', {
      oboe: TUNE_A,
      violins: up(TUNE_A, 0),
      clarinet: THIRDS,
      harp: harp(A_CHORDS),
      bass: bass(A_CHORDS),
      pah: pah(A_CHORDS),
      pad: sustained(A_CHORDS, BAR, 2, 3),
      wrong: WRONG(8, 3),
      tick: repeat(TICK, 8),
    }, 8),

    // The town tune: the motif a bar at a time, clarinet and glock trading.
    B: fit('B', {
      clarinet: TOWN,
      bells: after(4, up(TOWN, 12)),
      reed: reedChord(B_CHORDS, 'third'),
      harp: harp(B_CHORDS),
      bass: bass(B_CHORDS),
      pah: pah(B_CHORDS),
      tick: repeat(TICK, 8),
    }, 8),

    bridge: fit('bridge', {
      oboe: FIRE,
      violins: sustained(BRIDGE_CHORDS, BAR, 2, 4),
      pad: sustained(BRIDGE_CHORDS, BAR, 0, 3),
      harpSoft: harpSlow(BRIDGE_CHORDS),
      bass: chordLine(BRIDGE_CHORDS, [0, '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'], 3),
    }, 8),

    B2: fit('B2', {
      flute: TOWN,
      oboe: up(TOWN, -12),
      violins: sustained(B_CHORDS, BAR, 2, 4),
      reed: reedChord(B_CHORDS, 'third'),
      harp: harp(B_CHORDS),
      bass: bass(B_CHORDS),
      pah: pah(B_CHORDS),
      wrong: WRONG(8, 0),
      tick: repeat(TICK, 8),
    }, 8),

    A3: fit('A3', {
      flute: TUNE_A,
      clarinet: THIRDS,
      violins: sustained(A_CHORDS, BAR, 0, 4),
      reed: reedChord(A_CHORDS, 'third'),
      harp: harp(A_CHORDS),
      bass: bass(A_CHORDS),
      pah: pah(A_CHORDS),
      clock: clock(8),
    }, 8),
  },

  order: ['intro', 'A', 'A2', 'B', 'bridge', 'B2', 'A3'],
  loopFrom: 1,
};
