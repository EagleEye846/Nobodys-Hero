import {
  melody, hits, repeat, arpeggio, sustained, chordLine, rest as restBars,
  held, after as afterBars, midi, cellIn,
} from './parts/chapter4.js';

// "Where the Buttercups Are": the theme of Sunnyside, the sunny fields just
// past the Hero's Gate, Chapter 4's first four rooms. After a whole chapter
// in the dark this is the first plain, carefree, skipping song in a long
// time: D major, a flute whistling a tune you could hum, a clarinet
// answering, a harp strumming like a guitar and plucked strings going
// "oom, pah" underneath, a tiny hand drum keeping time with the grass.
// Reference for the mood only: the warmth of Undertale's Snowdin and the
// cheer of Deltarune's Field of Hopes and Dreams. It should feel almost too
// perfect, because the player is about to fall through the ground. So there
// are two small wrong things, once each round the loop: a single bell note
// that doesn't belong in D major (a B flat) near the end, and in the last
// two bars a very low cello note, quiet as a rumble under the field. Nobody
// should be sure they heard either.
//
// THE CHAPTER'S TUNE (the "first cell", see parts/chapter4.js): the Hero came
// once. Four notes, up a fourth, up a third, and one step back down, the
// way a question sounds: A D F# E in this key (the fifth, the tonic, the
// third and the second of the scale). It opens the tune (bar 1 of A), plain
// and bright. The other Chapter 4 songs use the same four intervals in other
// keys and colours (cellIn('G4') etc., exported from parts/chapter4.js).
//
// Compound time: 6/8 at 104 dotted quarters a minute, one step an 8th, a bar
// is 6 steps (1.15s). The pickup plays once (2 bars, 2s); then it loops from
// A, 80 bars, about 92 seconds:
//
//   intro   2 bars  the harp strums, the flute whistles a pickup
//   A       8 bars  THE TUNE: the flute alone over pluck and strum
//   A2      8 bars  the clarinet takes it, the flute above, a hand drum
//   B       8 bars  a bouncier answer, staccato piano
//   A3      8 bars  the tune on oboe and violins, the harp dancing
//   bridge  8 bars  the cell on bells, over a hushed, still harp; the
//                   plainest it gets
//   C       8 bars  a new skipping tune, flute and clarinet in thirds
//   C2      8 bars  the same, with the whole band and the piano
//   B2      8 bars  the bouncy answer again, everybody
//   A4      8 bars  the tune again, bright, flutes in octaves
//   A5      8 bars  the tune a last time, the lone flute, a long breath
//                   out; the wrong B flat, then the rumble

const BAR = 6;
const rest = (bars) => restBars(bars, BAR);
const after = (bars, track) => afterBars(bars, track, BAR);
const tune = (text) => melody(text, 1);   // each token an 8th
const up = (steps, semitones) => steps.map((n) => (typeof n === 'number' ? n + semitones : n));

// --- The harmony, a bar each. ---
const A_CHORDS = 'D Bm G A D Bm A D';
const B_CHORDS = 'G D Em Bm G D A A';
const C_CHORDS = 'D A Bm G D A G D';
const BRIDGE_CHORDS = 'G Em A D G Em A D';

// --- THE TUNE. Its first bar is the cell: A D F# E. ---
const TUNE_A = tune(`
  A4 - D5 - F#5 E5 | D5 - B4 - D5 F#5 | G5 - F#5 E5 D5 B4 | A4 - - B4 C#5 E5 |
  F#5 - A5 - F#5 D5 | B4 - D5 - F#5 G5 | E5 - C#5 - A4 C#5 | D5 - - - . .
`);
// A little dressed up for the repeats: the same tune with a skip in it.
const TUNE_A_DRESSED = tune(`
  A4 D5 F#5 E5 - D5 | D5 - B4 - D5 F#5 | G5 - F#5 E5 D5 B4 | A4 - - B4 C#5 E5 |
  F#5 - A5 - A5 F#5 | B4 - D5 - F#5 G5 | E5 - C#5 - A4 C#5 | D5 - - - . .
`);
// The bouncy answer: staccato leaps, up to the sixth.
const TUNE_B = tune(`
  G5 - B5 - A5 G5 | F#5 - A5 - D6 - | E5 - G5 - B5 A5 | F#5 - D5 - . . |
  B5 - D6 - B5 G5 | A5 - F#5 - D5 F#5 | E5 - G5 - C#6 - | E6 - - - . .
`);
// The new skipping tune.
const TUNE_C = tune(`
  F#5 - A5 - D6 - | E6 D6 C#6 B5 A5 F#5 | D6 - B5 - F#5 B5 | B5 A5 G5 F#5 E5 D5 |
  F#5 - A5 - D6 - | E6 D6 C#6 B5 A5 F#5 | G5 - B5 A5 G5 F#5 | D5 - - - . .
`);
// Thirds under it, a clarinet walking with the flute (near enough).
const TUNE_C_BELOW = tune(`
  D5 - F#5 - A5 - | C#6 B5 A5 G5 F#5 D5 | B5 - G5 - D5 G5 | G5 F#5 E5 D5 C#5 B4 |
  D5 - F#5 - A5 - | C#6 B5 A5 G5 F#5 D5 | E5 - G5 F#5 E5 D5 | B4 - - - . .
`);
// The bridge: the cell hushed in G, then answered higher.
const BRIDGE = tune(`
  D5 - G5 - B5 A5 | G5 - - - . . | E5 - G5 - B5 A5 | G5 - - - . . |
  B5 - D6 - G6 F#6 | E6 - - - . . | C#6 - E6 - A5 C#6 | D6 - - - . .
`);

// --- The band, under any 8 bars of chords. ---
// "Oom": the plucked bass on the beat, then its fifth.
const OOM = [0, '.', '.', 7, '.', '.'];
// "Pah": plucked violins on the off 8ths.
const PAH = ['.', '.', 'third', '.', '.', 7];
const DANCE = [0, 7, 12, 'tenth', 12, 7];        // the harp, one to a step
const SLOW_HARP = [0, '-', 7, '-', 12, '-'];     // the harp, hushed
const TICK = hits('x..x..');                     // the hand drum
const CLAP = hits('...x..');
const harpDance = (chords) => arpeggio(chords, BAR, 3, DANCE);
const bass = (chords) => chordLine(chords, OOM, 2);
const pah = (chords) => chordLine(chords, PAH, 4);
const lowPluck = (chords) => chordLine(chords, ['.', '.', '.', 'third', '.', '.'], 3);
const stabs = (chords) => chordLine(chords, ['.', 'third', '.', 7, '.', 12], 4);

// The cell on bells, in the bridge's key (G): D G B A, an octave high.
const [c0, c1, c2, c3] = cellIn('G6');
const BELL_CELL = [c0, '-', c1, '-', c2, c3];
const BELLS_BRIDGE = [...BELL_CELL, ...rest(1), ...BELL_CELL, ...rest(1), ...BELL_CELL, ...rest(1), ...BELL_CELL, ...rest(1)];

// The first wrong thing: one B flat on the bells in bar 6 of the last
// section, where the chord is D major. And the second: D, very low.
const WRONG_NOTE = [...rest(5), '.', '.', '.', midi('Bb5'), '-', '-', ...rest(2)];
const RUMBLE = [...rest(6), ...held('D2', 2 * BAR)];

export const SUNNYSIDE_THEME = {
  title: 'Where the Buttercups Are',
  bpm: 104,
  stepsPerBeat: 3,
  volume: 0.7,

  instruments: {
    // The whistled tune.
    flute: { sample: 'flute', volume: 0.3, attack: 0.05, release: 0.4, reverb: 0.35, pan: 0.1, humanize: { time: 0.012, volume: 0.12 } },
    fluteHigh: { sample: 'flute', volume: 0.2, attack: 0.05, release: 0.4, reverb: 0.4, pan: 0.25, humanize: { time: 0.012, volume: 0.12 } },
    clarinet: { sample: 'clarinet', volume: 0.3, attack: 0.05, release: 0.4, reverb: 0.35, pan: -0.2, humanize: { time: 0.012, volume: 0.12 } },
    oboe: { sample: 'oboe', volume: 0.3, attack: 0.05, release: 0.35, reverb: 0.35, pan: 0.2, humanize: { time: 0.012, volume: 0.12 } },
    violins: { sample: 'violins', volume: 0.2, attack: 0.15, release: 0.5, reverb: 0.4, pan: 0.3, humanize: { time: 0.01, volume: 0.1 } },
    // Strummed like a guitar.
    harp: { sample: 'harp', volume: 0.22, ring: true, reverb: 0.4, pan: -0.3, humanize: { time: 0.012, volume: 0.2 } },
    harpSoft: { sample: 'harp', volume: 0.15, ring: true, reverb: 0.5, pan: -0.25, humanize: { time: 0.014, volume: 0.2 } },
    piano: { sample: 'grandPiano', volume: 0.14, release: 0.12, reverb: 0.3, pan: 0.05, humanize: { time: 0.008, volume: 0.15 } },
    // Oom-pah.
    bass: { sample: 'bassSpic', volume: 0.46, release: 0.1, reverb: 0.15, humanize: { time: 0.006, volume: 0.12 } },
    pah: { sample: 'violinsPizz', volume: 0.2, release: 0.1, reverb: 0.25, pan: 0.3, humanize: { time: 0.008, volume: 0.15 } },
    pizzLow: { sample: 'cellosPizz', volume: 0.2, release: 0.1, reverb: 0.25, pan: -0.25, humanize: { time: 0.008, volume: 0.15 } },
    // A soft held root (violas: cellos sat too heavy under a skipping tune).
    pad: { sample: 'violas', volume: 0.17, attack: 0.35, release: 0.8, reverb: 0.4, pan: -0.15 },
    bells: { sample: 'glock', volume: 0.12, ring: true, pan: 0.35, reverb: 0.55, echo: { time: 0.4, feedback: 0.25, mix: 0.25 } },
    // A small hand drum and a clap, light as a skipped stone.
    tick: { sample: 'frameDrum', drum: 'sample', volume: 0.12, ring: true, reverb: 0.25, humanize: { time: 0.004, volume: 0.25 } },
    clap: { sample: 'claps', drum: 'sample', volume: 0.07, ring: true, reverb: 0.3, humanize: { time: 0.004, volume: 0.3 } },
    // Under the field.
    hum: { sample: 'cellos', volume: 0.22, attack: 1.2, release: 1.6, reverb: 0.5, pan: 0 },
  },

  sections: {
    // The harp strums; the flute whistles a pickup into the tune.
    intro: {
      harp: harpDance('D D'),
      bass: chordLine('D D', OOM, 2),
      flute: [...rest(1), '.', '.', '.', '.', midi('E4'), midi('F#4')],
    },

    // THE TUNE, the flute alone over the pluck and the strum.
    A: {
      flute: TUNE_A,
      harp: harpDance(A_CHORDS),
      bass: bass(A_CHORDS),
      pah: pah(A_CHORDS),
    },

    // The clarinet takes the tune; the flute whistles over it an octave up
    // for the second half; a hand drum joins in.
    A2: {
      clarinet: TUNE_A_DRESSED,
      fluteHigh: after(4, up(TUNE_A_DRESSED, 12)),
      harp: harpDance(A_CHORDS),
      bass: bass(A_CHORDS),
      pah: pah(A_CHORDS),
      tick: repeat(TICK, 8),
    },

    // The bouncy answer: staccato piano on top, flute joining halfway.
    B: {
      piano: TUNE_B,
      flute: after(4, TUNE_B),
      clarinet: sustained(B_CHORDS, BAR, 1, 4),
      harp: harpDance(B_CHORDS),
      bass: bass(B_CHORDS),
      pah: pah(B_CHORDS),
      tick: repeat(TICK, 8),
      clap: repeat(CLAP, 8),
    },

    // The tune on oboe and violins together, the harp dancing.
    A3: {
      oboe: TUNE_A_DRESSED,
      violins: TUNE_A_DRESSED,
      pad: sustained(A_CHORDS, BAR, 0, 3),
      harp: harpDance(A_CHORDS),
      bass: bass(A_CHORDS),
      pah: pah(A_CHORDS),
      pizzLow: lowPluck(A_CHORDS),
      tick: repeat(TICK, 8),
    },

    // The plainest part: the cell on bells over a hushed harp, a flute
    // singing it in G; nothing else for a moment.
    bridge: {
      flute: BRIDGE,
      bells: BELLS_BRIDGE,
      harpSoft: arpeggio(BRIDGE_CHORDS, BAR, 3, SLOW_HARP),
      pad: sustained(BRIDGE_CHORDS, BAR, 0, 3),
      bass: chordLine(BRIDGE_CHORDS, [0, '.', '.', '.', '.', '.'], 2),
    },

    // A new skipping tune: flute and clarinet in thirds.
    C: {
      flute: TUNE_C,
      clarinet: TUNE_C_BELOW,
      harp: harpDance(C_CHORDS),
      bass: bass(C_CHORDS),
      pah: pah(C_CHORDS),
      tick: repeat(TICK, 8),
      clap: repeat(CLAP, 8),
    },

    // The same with the piano and the strings added.
    C2: {
      flute: TUNE_C,
      clarinet: TUNE_C_BELOW,
      violins: sustained(C_CHORDS, BAR, 2, 4),
      piano: stabs(C_CHORDS),
      harp: harpDance(C_CHORDS),
      bass: bass(C_CHORDS),
      pah: pah(C_CHORDS),
      pizzLow: lowPluck(C_CHORDS),
      tick: repeat(TICK, 8),
      clap: repeat(CLAP, 8),
    },

    // The bouncy answer again, all of them.
    B2: {
      flute: TUNE_B,
      oboe: TUNE_B,
      piano: stabs(B_CHORDS),
      clarinet: sustained(B_CHORDS, BAR, 1, 4),
      harp: harpDance(B_CHORDS),
      bass: bass(B_CHORDS),
      pah: pah(B_CHORDS),
      pizzLow: lowPluck(B_CHORDS),
      tick: repeat(TICK, 8),
      clap: repeat(CLAP, 8),
    },

    // The tune again, bright, two flutes an octave apart.
    A4: {
      flute: TUNE_A_DRESSED,
      fluteHigh: up(TUNE_A_DRESSED, 12),
      clarinet: sustained(A_CHORDS, BAR, 1, 4),
      violins: sustained(A_CHORDS, BAR, 2, 4),
      harp: harpDance(A_CHORDS),
      bass: bass(A_CHORDS),
      pah: pah(A_CHORDS),
      tick: repeat(TICK, 8),
      clap: repeat(CLAP, 8),
    },

    // The last time round: the lone flute, a long breath out. A B flat on
    // the bells where there shouldn't be one; and in the last two bars,
    // something very low under the field.
    A5: {
      flute: TUNE_A,
      harp: harpDance(A_CHORDS),
      bass: bass(A_CHORDS),
      pah: pah(A_CHORDS),
      bells: WRONG_NOTE,
      hum: RUMBLE,
    },
  },

  order: ['intro', 'A', 'A2', 'B', 'A3', 'bridge', 'C', 'C2', 'B2', 'A4', 'A5'],
  loopFrom: 1,
};
