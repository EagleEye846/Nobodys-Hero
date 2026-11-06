import {
  melody, hits, repeat, arpeggio, sustained, chordLine, transpose, rest as restBars,
  haddockPhrase, tight, midi, after as afterBars,
} from './parts/chapter5.js';

// "Bunting": the theme of Gullrest, the happy beach, the last bright place
// in the chapter. A fresh sea breeze: a flute whistling a skipping tune in
// G major, a strummed harp, plucked strings going "oom, pah" like a
// ukulele band on the sand, a clarinet and oboe trading answers, a tiny
// hand drum, a piccolo that cries now and then like a gull. Nothing in it
// is sad; it should be a little too perfect, because the sky is about to
// go green and the player does not know yet. Reference for the mood only:
// Koji Kondo's seaside tunes (Windfall Island, the Great Sea), Undertale's
// gentler towns.
//
// HADDOCK'S MOTIF hides in it once: in the bridge, a clarinet low under the
// harp plays B A G, D (the motif in G, see parts/chapter5.js) as if
// someone is humming on a rock out of sight. Nothing points at it.
//
// G major, 4/4 at 100 (a bar is 2.4 seconds); one step a 16th, 16 to a bar.
// The intro plays once (2 bars); then it loops from A, 40 bars, about 1m38s:
//
//   intro    2 bars  the harp strums; the flute whistles a pickup
//   A        8 bars  THE TUNE: the flute alone over pluck and strum
//   A2       8 bars  the clarinet answers, the oboe takes the tune, a hand drum
//   B        8 bars  a second, rising tune, flute and oboe in thirds
//   bridge   8 bars  hushed: the harp and bells, a gull; the hidden motif
//   A3       8 bars  the tune again, flute and piccolo, the whole band; the
//                    last bar is a gull

const BAR = 16;
const tune = (text) => melody(text, 2);   // each token an 8th: 8 to a bar
const rest = (bars) => restBars(bars, BAR);
const after = (bars, track) => afterBars(bars, track, BAR);
const up = (steps, semitones) => transpose(steps, semitones);
const fit = (name, section, bars) => tight('Bunting', name, section, bars, BAR);

// --- Harmony, a bar each ---
const A_CHORDS = 'G D Em C G Am C D';
const B_CHORDS = 'C G Am D C G D G';
const BRIDGE_CHORDS = 'C G Em D C G D D';
const INTRO_CHORDS = 'G D';

// --- THE TUNE: an arpeggio that skips, then a little fall. ---
const TUNE_A = tune(`
  G5 - B5 D6 - B5 G5 -    F#5 - A5 - D6 - C#6 -
  B5 - G5 - E5 - G5 B5    C6 - B5 A5 G5 - E5 -
  G5 - B5 D6 - B5 G5 -    A5 - C6 E6 - C6 A5 -
  G5 - C6 - E6 - D6 C6    B5 - A5 - F#5 - - .
`);
// The second tune: climbing steps and skips.
const TUNE_B = tune(`
  E5 - G5 - C6 - B5 -     D6 - B5 - G5 - - .
  C6 - E6 - A5 - C6 -     D6 - C6 B5 A5 - F#5 -
  E5 - G5 - C6 - E6 -     D6 - G6 - B5 - D6 -
  A5 - F#5 - A5 - D6 -    B5 - G5 - G5 - - -
`);
// The clarinet answers underneath the oboe's version, a sixth lower.
const ANSWER = tune(`
  . . . . B4 - D5 -       . . . . A4 - C#5 -
  . . . . G4 - B4 -       . . . . E4 - G4 -
  . . . . B4 - D5 -       . . . . C5 - E5 -
  . . . . E5 - D5 C5      B4 - - - . . . .
`);
// The bridge: one hushed line, the harp and bells under it, and the
// hidden motif low (B A G, D).
const BRIDGE = tune(`
  E5 - - - G5 - - -       D5 - - - B4 - - -
  G5 - - - B5 - - -       A5 - - - F#5 - - -
  E5 - - - G5 - - -       D5 - - - B4 - - -
  A5 - - - F#5 - - -      D5 - - - . . . .
`);
// Gulls: two quick falling notes, now and then.
const GULL = [midi('C7'), '-', midi('A6'), '-', '-', '-', ...Array(10).fill('.')];
const gulls = (bars, atBars) => Array.from({ length: bars }, (_, i) => (atBars.includes(i) ? GULL : rest(1))).flat();

// --- The band ---
const OOM = [0, '.', '.', '.', 7, '.', '.', '.', 0, '.', '.', '.', 7, '.', '.', '.'];
const PAH = ['.', '.', '.', '.', 'third', '.', '.', 7, '.', '.', '.', '.', 'third', '.', '.', 7];
const DANCE = [0, 7, 12, 'tenth', 12, 7, 12, 7, 0, 7, 12, 'tenth', 12, 7, 12, 7];
const SLOW_HARP = [0, '-', '-', '-', 7, '-', '-', '-', 12, '-', '-', '-', 7, '-', '-', '-'];
const harpDance = (chords) => arpeggio(chords, BAR, 3, DANCE);
const bass = (chords) => chordLine(chords, OOM, 2).map((n) => (typeof n === 'number' ? n + 12 : n));
const pah = (chords) => chordLine(chords, PAH, 4);
const TICK = hits('x.......x.x.....');

export const GULLREST_THEME = {
  title: 'Bunting',
  bpm: 100,
  stepsPerBeat: 4,
  volume: 0.7,

  instruments: {
    flute: { sample: 'flute', volume: 0.3, attack: 0.04, release: 0.35, reverb: 0.35, pan: 0.1, humanize: { time: 0.012, volume: 0.12 } },
    piccolo: { sample: 'piccolo', volume: 0.12, attack: 0.04, release: 0.35, reverb: 0.4, pan: 0.3, humanize: { time: 0.012, volume: 0.12 } },
    gull: { sample: 'piccolo', volume: 0.1, attack: 0.02, release: 0.5, reverb: 0.5, pan: -0.35 },
    clarinet: { sample: 'clarinet', volume: 0.24, attack: 0.05, release: 0.35, reverb: 0.35, pan: -0.2, humanize: { time: 0.012, volume: 0.12 } },
    oboe: { sample: 'oboe', volume: 0.26, attack: 0.05, release: 0.3, reverb: 0.35, pan: 0.2, humanize: { time: 0.012, volume: 0.12 } },
    harp: { sample: 'harp', volume: 0.22, ring: true, reverb: 0.4, pan: -0.3, humanize: { time: 0.012, volume: 0.2 } },
    harpSoft: { sample: 'harp', volume: 0.16, ring: true, reverb: 0.5, pan: -0.25, humanize: { time: 0.014, volume: 0.2 } },
    violins: { sample: 'violins', volume: 0.1, attack: 0.2, release: 0.6, reverb: 0.4, pan: 0.3 },
    pad: { sample: 'violas', volume: 0.1, attack: 0.5, release: 0.9, reverb: 0.4, pan: -0.15 },
    bass: { sample: 'cellosPizz', volume: 0.3, release: 0.15, reverb: 0.2, pan: -0.15, humanize: { time: 0.006, volume: 0.12 } },
    pah: { sample: 'violinsPizz', volume: 0.2, release: 0.1, reverb: 0.25, pan: 0.3, humanize: { time: 0.008, volume: 0.15 } },
    bells: { sample: 'glock', volume: 0.12, ring: true, pan: 0.35, reverb: 0.55, echo: { time: 0.4, feedback: 0.25, mix: 0.25 } },
    hidden: { sample: 'clarinet', volume: 0.18, attack: 0.1, release: 0.6, reverb: 0.55, pan: -0.4 },
    tick: { sample: 'frameDrum', drum: 'sample', volume: 0.1, ring: true, reverb: 0.25, humanize: { time: 0.005, volume: 0.25 } },
  },

  sections: {
    intro: fit('intro', {
      harp: harpDance(INTRO_CHORDS),
      flute: [...rest(1), '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', midi('D5'), midi('F#5'), midi('A5'), '-'],
    }, 2),

    // THE TUNE, the flute alone over pluck and strum.
    A: fit('A', {
      flute: TUNE_A,
      harp: harpDance(A_CHORDS),
      bass: bass(A_CHORDS),
      pah: pah(A_CHORDS),
      gull: gulls(8, [7]),
    }, 8),

    // The oboe has the tune; the clarinet answers; a hand drum joins.
    A2: fit('A2', {
      oboe: TUNE_A,
      clarinet: ANSWER,
      harp: harpDance(A_CHORDS),
      pad: sustained(A_CHORDS, BAR, 2, 4),
      bass: bass(A_CHORDS),
      pah: pah(A_CHORDS),
      tick: repeat(TICK, 8),
    }, 8),

    // A second tune, flute and oboe in thirds, the violins held under.
    B: fit('B', {
      flute: TUNE_B,
      oboe: up(TUNE_B, -4),
      violins: sustained(B_CHORDS, BAR, 2, 4),
      harp: harpDance(B_CHORDS),
      bass: bass(B_CHORDS),
      pah: pah(B_CHORDS),
      tick: repeat(TICK, 8),
    }, 8),

    // Hushed: a lone line, bells, a gull; someone humming out of sight.
    bridge: fit('bridge', {
      flute: BRIDGE,
      bells: after(2, up(BRIDGE, 12)),
      harpSoft: arpeggio(BRIDGE_CHORDS, BAR, 3, SLOW_HARP),
      pad: sustained(BRIDGE_CHORDS, BAR, 0, 3),
      hidden: [...rest(1), ...haddockPhrase('G4'), ...rest(6)],
      gull: gulls(8, [4]),
    }, 8),

    // The tune once more, flute and piccolo, everybody; a last gull.
    A3: fit('A3', {
      flute: TUNE_A,
      piccolo: up(TUNE_A, 12),
      clarinet: sustained(A_CHORDS, BAR, 1, 4),
      violins: sustained(A_CHORDS, BAR, 2, 4),
      harp: harpDance(A_CHORDS),
      bass: bass(A_CHORDS),
      pah: pah(A_CHORDS),
      tick: repeat(TICK, 8),
      gull: gulls(8, [7]),
    }, 8),
  },

  order: ['intro', 'A', 'A2', 'B', 'bridge', 'A3'],
  loopFrom: 1,
};
