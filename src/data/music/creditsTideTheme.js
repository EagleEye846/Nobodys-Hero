import {
  melody, transpose, arpeggio, sustained, chordLine, rest as restBars, held, midi, scatter,
  haddockPhrase, lullaby, LULLABY_A, LULLABY_B, LULLABY_A_CHORDS, LULLABY_B_CHORDS, tight,
} from './parts/chapter5.js';
import { BRAMBLE_MOTIF } from './brambleTheme.js';

// "Found": the credits song at the end of Chapter Five, after the night the
// light held. Haddock's ledger ends on that word (he wrote it down the
// morning Corrie came to him, and again at the last). The party beat Corrie;
// Bramble stood up ("My turn."); Haddock turned the flood crank so the rest
// could get away, made a joke, and did not come back; the hero's light held
// the sea; and at dawn the water had pulled back further than anyone had
// ever seen it. So this is grief that has been carried all the way through to
// something warm: a dawn after a storm, not epic, not cheery, beautiful and
// sad and gently hopeful. In the spirit of Toby Fox's credits pieces and the
// quiet end of Hollow Knight, it walks back through the chapter's three
// tunes (parts/chapter5.js), each one changed, and never gets loud:
//
//   - THE LULLABY, "Come In, Little Boat" (corrieLullabyTheme.js): it opens
//     the song alone on a music box, slowly, as if Haddock were humming it
//     in the dark (the choir joins as the hum). At the very end it comes
//     home in D major: the same notes with the flats lifted (F to F#, C to
//     C#, Bb to B), so the tune that always stopped on a question lands on D.
//   - HADDOCK'S MOTIF (F E D, A in the minor; F# E D, A in the major) on a
//     low clarinet, long short long longer. First in the minor, then, in the
//     same section, the major: the one flat note is the whole difference
//     between him sad and him comfortable. It is sung under the lullaby
//     at the end (the lullaby's own last bar is that same fall, F# E D).
//   - THE COAST CELL (A D D E, 5 1 1 2 of the scale) is the dawn. In the
//     Wrack Shore it crept in on a flute in D minor; here it opens a broad,
//     rising tune in D major, on a flute, then a solo violin, then strings,
//     choir and soft horns, as the sea draws back. The sea that was the
//     enemy is the thing that sings.
//   - BRAMBLE'S MOTIF (BRAMBLE_MOTIF, brambleTheme.js): "three cuts and a
//     tick", D D D up to G, on a recorder. It is the little boy's "My turn.":
//     once, then again a fourth higher (braver), and the strings stand up
//     under him and lift into the dawn.
//
// All real recordings (harp, glockenspiel, choir, violins, solo violin,
// violas, flute, clarinet, recorder, soft horns, basses, timpani); no synth
// presets, no drums, no cellos. The timpani only plays softly at the dawn.
// Choir notes stay at or below B5.
//
// D minor and D major, 6/8 at 54 dotted quarters a minute (as the lullaby),
// one step an 8th, six to a bar of about 2.2 seconds. Plays once, 82 bars,
// about 3m02s, and the last chord rings out:
//
//   hum      8 bars  0:00  the lullaby on a music box, alone; a harp rocks it
//                          from the third bar; a low hum joins for the second
//                          half; violas
//   he       8 bars  0:18  D minor: Haddock's motif on a low clarinet over
//                          the rocking harp, plodding basses, twice; then the
//                          same notes in D major, twice, as the chords brighten;
//                          a last glint of the music box
//   tide    16 bars  0:36  D major: the coast cell grows into a tune on a
//                          flute; again on a solo violin with the clarinet an
//                          octave under and the hum
//   ledger  10 bars  1:11  the lift into F: the lullaby's second half on a
//                          solo violin, fragile, over the harp; Haddock's
//                          motif in the minor, low, alone; the music box asks
//   turn     6 bars  1:33  G: Bramble's three cuts on the recorder, then a
//                          fourth higher; the strings stand under him; a
//                          timpani roll rises on the dominant
//   dawn    20 bars  1:47  D major, the swell: the tune on violins, soft
//                          horns and choir, flute over it from bar 5, harp
//                          running, soft timpani; it climbs (second half,
//                          choir carrying it, bells); then Haddock's motif in
//                          the major, said plainly on horns and clarinet
//   home    14 bars  2:31  D major: the lullaby in D major on the music box and
//                          hum, Haddock's motif under it; the motif once more,
//                          a music-box phrase, and a D chord left to ring

const BAR = 6;
const rest = (bars) => restBars(bars, BAR);
const tune = (text) => melody(text, 1);   // each token an 8th: six to a bar
const fit = (name, section, bars) => tight('Found', name, section, bars, BAR);

// --- The harp's cradle: root, fifth, octave, as in the lullaby. ---
const ROCK = [0, '.', 7, '.', 12, '.'];
const rocking = (chords) => arpeggio(chords, BAR, 3, ROCK);
// The harp running up and back, for the dawn.
const RUN = [0, 7, 12, 'tenth', 19, 12];
const ONE = [0, '.', '.', '.', '.', '.'];

// --- The lullaby, in D minor and F major (parts/chapter5.js), and in D
// major: the same notes with the flats lifted. ---
const LULLABY_MINOR = lullaby(LULLABY_A);
const LULLABY_LIFT = lullaby(LULLABY_B);
const LULLABY_MAJOR = tune(`
  F#4 - - A4 - D5   D5 - - C#5 - B4
  A4 - - G4 - F#4   E4 - - - - .
  F#4 - - A4 - D5   F#5 - - E5 - D5
  B4 - - A4 - G4    F#4 - E4 D4 - -
`);
const MAJOR_CHORDS = 'D Bm G A D D G D';

// --- Haddock's motif over two bars (eight steps and four of rest). ---
const HIS_MINOR = [...haddockPhrase('D4', { minor: true, unit: 1 }), ...Array(4).fill('.')];
const HIS_MAJOR = [...haddockPhrase('D4', { unit: 1 }), ...Array(4).fill('.')];

// --- The coast cell grown into a tune, in D major: A D D E opens it. ---
// First, asking (it ends away from home).
const TIDE_A = tune(`
  A4 - - D5 - -      D5 - - E5 - -
  F#5 - - E5 - D5    E5 - - - - .
  A4 - - D5 - -      D5 - - E5 - -
  F#5 - - A5 - -     G5 - - E5 - C#5
`);
const TIDE_A_CHORDS = 'D D Bm A D G Bm A';
// Then climbing, and home.
const TIDE_B = tune(`
  A4 - - D5 - -      D5 - - E5 - -
  F#5 - - A5 - -     B5 - - A5 - F#5
  G5 - - F#5 - E5    F#5 - - E5 - D5
  E5 - - D5 - E5     D5 - - - - -
`);
const TIDE_B_CHORDS = 'D D Bm G Em D A D';
// The cell's last word: A D D, settling.
const CELL_END = tune('A5 - - D6 - -   D6 - - - - -');

// --- Bramble: three cuts and a tick, then a fourth higher. ---
const THREE_CUTS = tune('D5 D5 D5 G5 - A5');
// If his motif is ever changed, this song should notice.
{
  const notes = BRAMBLE_MOTIF.filter((n) => typeof n === 'number');
  if (notes.join() !== [74, 74, 74, 79, 81].join()) throw new Error("Found: Bramble's motif has changed");
}

// A bar a note: timpani on the bars named (null is a bar's rest).
const timpBars = (list) => list.flatMap((n) => (n ? [midi(n), ...Array(BAR - 1).fill('.')] : rest(1)));

export const CREDITS_TIDE_THEME = {
  title: 'Found',
  bpm: 54,
  stepsPerBeat: 3,
  // Plays once, then the credits end.
  loop: false,
  volume: 1.0,

  instruments: {
    // The music box: a glockenspiel with a long echo.
    box: { sample: 'glock', volume: 0.2, ring: true, reverb: 0.6, pan: 0.2, echo: { time: 0.55, feedback: 0.32, mix: 0.3 }, humanize: { time: 0.008, volume: 0.1 } },
    bells: { sample: 'glock', volume: 0.09, ring: true, reverb: 0.65, pan: 0.35 },
    harp: { sample: 'harp', volume: 0.2, ring: true, reverb: 0.55, pan: -0.28, humanize: { time: 0.01, volume: 0.18 } },
    harpRun: { sample: 'harp', volume: 0.17, ring: true, reverb: 0.6, pan: -0.3, humanize: { time: 0.01, volume: 0.15 } },
    // The hum, and the dawn's choir.
    hum: { sample: 'choir', volume: 0.12, attack: 0.5, release: 1.1, reverb: 0.7, humanize: { time: 0.01, volume: 0.1 } },
    choir: { sample: 'choir', volume: 0.27, attack: 0.5, release: 1, reverb: 0.65, humanize: { time: 0.008, volume: 0.08 } },
    // Haddock: a low clarinet, and a soft horn.
    reed: { sample: 'clarinet', volume: 0.26, attack: 0.08, release: 0.7, reverb: 0.5, pan: -0.15, humanize: { time: 0.012, volume: 0.12 } },
    horns: { sample: 'hornsSoft', volume: 0.25, attack: 0.3, release: 0.9, reverb: 0.55, pan: -0.1 },
    seaFlute: { sample: 'flute', volume: 0.15, attack: 0.08, release: 0.6, reverb: 0.55, pan: 0.25, humanize: { time: 0.012, volume: 0.1 } },
    seaFiddle: { sample: 'soloViolin', volume: 0.2, attack: 0.08, release: 0.7, reverb: 0.5, pan: 0.15, humanize: { time: 0.012, volume: 0.12 } },
    flute: { sample: 'flute', volume: 0.27, attack: 0.08, release: 0.6, reverb: 0.55, pan: 0.25, humanize: { time: 0.012, volume: 0.1 } },
    whistle: { sample: 'recorder', volume: 0.22, attack: 0.05, release: 0.5, reverb: 0.5, pan: 0.2, humanize: { time: 0.012, volume: 0.12 } },
    fiddle: { sample: 'soloViolin', volume: 0.3, attack: 0.08, release: 0.7, reverb: 0.5, pan: 0.15, humanize: { time: 0.012, volume: 0.12 } },
    violins: { sample: 'violins', volume: 0.38, attack: 0.1, release: 0.8, reverb: 0.5, pan: -0.25, humanize: { time: 0.008, volume: 0.08 } },
    strings: { sample: 'violins', volume: 0.2, attack: 0.5, release: 1, reverb: 0.55, pan: -0.25 },
    pad: { sample: 'violas', volume: 0.12, attack: 1, release: 1.5, reverb: 0.6, pan: -0.05 },
    violas: { sample: 'violas', volume: 0.17, attack: 0.3, release: 1, reverb: 0.5 },
    basses: { sample: 'bassSpic', volume: 0.16, release: 0.5, reverb: 0.4, humanize: { time: 0.01, volume: 0.15 } },
    timpani: { sample: 'timpani', volume: 0.3, ring: true, reverb: 0.45 },
    timpRoll: { sample: 'timpaniRoll', volume: 0.2, attack: 2.5, release: 0.6, reverb: 0.45 },
  },

  sections: {
    // The lullaby on the music box, alone and slow; the harp rocks from
    // the third bar; the hum comes in for the second half.
    hum: fit('hum', {
      box: transpose(LULLABY_MINOR, 12),
      harp: [...rest(2), ...rocking(LULLABY_A_CHORDS).slice(2 * BAR)],
      hum: [...rest(4), ...LULLABY_MINOR.slice(4 * BAR)],
      pad: [...rest(4), ...sustained('Gm A Dm Dm', BAR, 1, 4)],
    }, 8),

    // Haddock's motif on the low clarinet: minor twice, then major twice as
    // the chords brighten. The music box glints once at the end.
    he: fit('he', {
      reed: [...HIS_MINOR, ...HIS_MINOR, ...HIS_MAJOR, ...HIS_MAJOR],
      harp: rocking('Dm Bb Gm A D Bm G A'),
      pad: sustained('Dm Bb Gm A D Bm G A', BAR, 1, 4),
      basses: chordLine('Dm Bb Gm A D Bm G A', ONE, 2),
      box: [...rest(7), '.', '.', midi('A5'), '-', midi('D6'), '-'],
    }, 8),

    // The coast cell grows: a flute carries the tune, then a solo violin
    // with the clarinet under it and the hum on the chords.
    tide: fit('tide', {
      seaFlute: [...TIDE_A, ...rest(8)],
      seaFiddle: [...rest(8), ...TIDE_A],
      reed: [...rest(8), ...transpose(TIDE_A, -12)],
      harp: [...rocking(TIDE_A_CHORDS), ...rocking(TIDE_A_CHORDS)],
      pad: [...sustained(TIDE_A_CHORDS, BAR, 1, 4), ...sustained(TIDE_A_CHORDS, BAR, 1, 4)],
      hum: [...rest(8), ...sustained(TIDE_A_CHORDS, BAR, 2, 4)],
    }, 16),

    // The lift into F: the lullaby's second half on a solo violin, thin and
    // fragile; Haddock's motif in the minor, alone; the music box asks.
    ledger: fit('ledger', {
      fiddle: [...LULLABY_LIFT, ...rest(2)],
      harp: rocking(`${LULLABY_B_CHORDS} Dm Dm`),
      pad: sustained(`${LULLABY_B_CHORDS} Dm Dm`, BAR, 1, 4),
      reed: [...rest(8), ...HIS_MINOR],
      box: [...rest(9), '.', '.', midi('F5'), '-', midi('A5'), '-'],
    }, 10),

    // Bramble: three cuts and a tick on the recorder, then a fourth higher.
    // The strings stand under him, a timpani roll rises on the dominant.
    turn: fit('turn', {
      whistle: [...THREE_CUTS, ...THREE_CUTS, ...transpose(THREE_CUTS, 5), ...transpose(THREE_CUTS, 5), ...rest(2)],
      harp: rocking('G G G G A A'),
      pad: sustained('G G G G A A', BAR, 1, 4),
      strings: [...rest(2), ...sustained('G G A A', BAR, 2, 4)],
      hum: [...rest(4), ...sustained('A A', BAR, 1, 4)],
      timpRoll: [...rest(3), ...held(midi('A2'), 3 * BAR)],
    }, 6),

    // The dawn. The tune on violins and soft horns under choir, the flute
    // joining over it; then the climb, the choir carrying it, bells; then
    // Haddock's motif in the major, plain, to close.
    dawn: fit('dawn', {
      violins: [...TIDE_A, ...TIDE_B, ...rest(4)],
      flute: [...rest(4), ...transpose(TIDE_A, 12).slice(4 * BAR), ...transpose(TIDE_B, 12), ...CELL_END, ...rest(2)],
      choir: [
        ...sustained(TIDE_A_CHORDS, BAR, 1, 4),
        ...TIDE_B,
        ...sustained('D D D D', BAR, 2, 4),
      ],
      horns: [
        ...sustained(TIDE_A_CHORDS, BAR, 0, 3),
        ...sustained(TIDE_B_CHORDS, BAR, 1, 3),
        ...HIS_MAJOR, ...HIS_MAJOR,
      ],
      reed: [...rest(16), ...HIS_MAJOR, ...HIS_MAJOR],
      violas: [
        ...sustained(TIDE_A_CHORDS, BAR, 1, 4),
        ...sustained(TIDE_B_CHORDS, BAR, 1, 4),
        ...sustained('D D D D', BAR, 1, 4),
      ],
      harpRun: [
        ...arpeggio(TIDE_A_CHORDS, BAR, 3, RUN),
        ...arpeggio(TIDE_B_CHORDS, BAR, 3, RUN),
        ...arpeggio('D D D D', BAR, 3, RUN),
      ],
      basses: chordLine(`${TIDE_A_CHORDS} ${TIDE_B_CHORDS} D D D D`, ONE, 2),
      timpRoll: [...held(midi('D3'), 2 * BAR), ...rest(18)],
      timpani: timpBars([null, null, null, null, 'D3', null, 'D3', null, 'D3', null, 'D3', null, 'E3', null, 'A2', null, 'D3', null, null, null]),
      bells: scatter(20, BAR, [[8, 0, 'D6'], [10, 0, 'F#6'], [12, 0, 'G6'], [14, 0, 'A6'], [16, 0, 'D6']]),
    }, 20),

    // Home. The lullaby in D major on the music box and the hum, Haddock's
    // motif under it (its fall is the lullaby's last bar); the motif once
    // more, a music-box phrase, and a D chord left to ring.
    home: fit('home', {
      box: [...transpose(LULLABY_MAJOR, 12), ...transpose(LULLABY_MAJOR.slice(0, 2 * BAR), 12), ...rest(1), ...held(midi('D6'), BAR), ...rest(2)],
      hum: [...LULLABY_MAJOR, ...rest(6)],
      reed: [...HIS_MAJOR, ...HIS_MAJOR, ...HIS_MAJOR, ...HIS_MAJOR, ...HIS_MAJOR, ...rest(4)],
      harp: [...rocking(MAJOR_CHORDS), ...rocking('D D D D'), ...held(midi('D3'), 2 * BAR)],
      violas: [...sustained(MAJOR_CHORDS, BAR, 1, 4), ...held(midi('F#4'), 6 * BAR)],
      strings: [...rest(6), ...held(midi('A4'), 8 * BAR)],
      basses: [...chordLine(MAJOR_CHORDS, ONE, 2), ...chordLine('D D', ONE, 2), ...rest(4)],
    }, 14),
  },

  order: ['hum', 'he', 'tide', 'ledger', 'turn', 'dawn', 'home'],
};
