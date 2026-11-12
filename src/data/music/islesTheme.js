import {
  melody, repeat, sustained, chordLine, transpose, rest as restBars, hits,
  haddockPhrase, tight, midi, scatter,
} from './parts/chapter5.js';

// "Four Small Lights": the theme of the Beacon Isles, a string of rocks in
// the storm, each with its own small lighthouse, three of them dark for
// years and one still lit. Orla's forge is out here, and past the last rock
// is Haddock's Light. After the Wreck Yard and the Soundings this is the
// first warm place in the storm: still wind, still rain, but the lamps are
// turning and somebody has kept them. So it is hopeful and it lifts: a
// tune you can hum, soft, in a lilting 3/4.
//
// THE LAMP is the ostinato: a harp turns four notes round and round (four
// notes in a bar of six, so the figure comes round a different way each
// bar and only lines up again every two: the beam sweeping past), and a
// glock catches the flash every two bars. Underneath, the bass walks (a
// fixed ostinato with a moving bass, after Hollow Knight's City of Tears):
// root, fifth, then a step into the next chord, so the harmony is always
// leaning forward. Soft plucked strings answer the bass on beats 2 and 3
// ("oom, pah, pah"), and a frame drum, barely there, marks the bar.
//
// THE HOOK is on the flute, and it is the coast cell itself, in D major for
// once: A D D E, then up to F# and a leap to A, the lamp flaring. It comes
// round four times in A (two short phrases, then a longer answer, twice),
// so it is in your ear before the violin's second tune takes over. In A2
// the whole song lifts a step, into E major, and the hook comes back on the
// violin with the flute a third above it: the payoff, the lamps all lit.
//
// THE COAST CELL (A D D E) is also the lamp's four notes, shuffled: A D E
// D. The sea's tune, but with a light in it.
//
// HADDOCK'S MOTIF (parts/chapter5.js, F# E D, A) peeks through at the end,
// because his Light is next: in the coda the soft horn plays it once, low
// and slow like a foghorn across the water (F#3 E3 D3, A2), in its own key
// (D major, his comfortable form), and the flute answers it two octaves
// up, like the lamp answering. Nowhere else.
//
// D major (A2 in E), 3/4 at 88 (a bar is about 2 seconds); one step an 8th,
// 6 to a bar. The intro plays once (2 bars); then it loops from A, 64
// bars, about 2m11s:
//
//   intro   2 bars    4s    the lamp turning alone, one flash
//   A      16 bars   33s    THE HOOK on flute (A D D E, F# A), four times;
//                           the walking bass; the plucks come in at bar 9
//   B      16 bars   33s    the solo violin, higher and wider: G, A, F#m,
//                           Bm; the soft horn answers under it; violas
//   C       8 bars   16s    back in the storm: B minor, tremolo strings
//                           very soft, the oboe, choir; the lamp turns on;
//                           it ends on B major, ready to lift
//   A2     16 bars   33s    THE HOOK up a step, in E: violin, the flute a
//                           third above, everyone, still soft
//   coda    8 bars   16s    back home in D: HADDOCK'S MOTIF on the soft
//                           horn, low like a foghorn, then high on the
//                           flute; the A major hangs and loops back to A

const BAR = 6;
const tune = (text) => melody(text, 1);   // each token an 8th: 6 to a bar
const rest = (bars) => restBars(bars, BAR);
const fit = (name, section, bars) => tight('Four Small Lights', name, section, bars, BAR);
const after = (bars, track) => [...rest(bars), ...track.slice(bars * BAR)];

// --- Harmony, a bar each ---
const INTRO_CHORDS = 'D D';
const A_CHORDS = 'D Bm G A D Bm G A   D Bm G D G A A D';
const B_CHORDS = 'G A F#m Bm G A D D   Em A F#m Bm G Em A A';
const C_CHORDS = 'Bm G D A Bm G F# B';
const A2_CHORDS = 'E C#m A B E C#m A B   E C#m A E A B B E';
const CODA_CHORDS = 'D Bm G A D Bm G A';

// --- The hook (sing it: A D D E, F# - A) ---
const HOOK = tune(`
  A4 - D5 D5 E5 -   F#5 - - - A5 -    B4 - D5 D5 E5 -   G5 - F#5 - E5 -
  A4 - D5 D5 E5 -   F#5 - A5 - D6 -   B5 - A5 - G5 -    A5 - - - - .
  A4 - D5 D5 E5 -   F#5 - - - A5 -    B5 - - A5 G5 -    F#5 - - - D5 -
  G5 - B5 - D6 -    C#6 - - - A5 -    B5 - A5 - G5 E5   D5 - - - - .
`);
// A third above the second half, for the flute in A2 (by hand, in D; the
// whole of A2 is then put up a step). Over the hook's E in bar 9 it takes
// A, not G, so it doesn't rub on the D chord's F sharp.
const THIRDS = tune(`
  . . . . . .       . . . . . .       . . . . . .       . . . . . .
  . . . . . .       . . . . . .       . . . . . .       . . . . . .
  C#5 - F#5 F#5 A5 -  A5 - - - C#6 -  D6 - - C#6 B5 -   A5 - - - F#5 -
  B5 - D6 - F#6 -   E6 - - - C#6 -    D6 - C#6 - B5 G5  F#5 - - - - .
`);
// The violin's tune: up high and wider, two phrases.
const TUNE_B = tune(`
  D6 - - - B5 -     C#6 - - - A5 -    A5 - - - F#5 -    B5 - - - - -
  G5 - B5 - D6 -    E6 - - - C#6 -    D6 - - - A5 -     F#5 - - - - .
  E6 - - - B5 -     C#6 - - - A5 -    A5 - C#6 - F#6 -  D6 - - - B5 -
  B5 - - - D6 -     G6 - - - E6 -     E6 - - - C#6 -    A5 - - - - .
`);
// The soft horn under the violin: it answers in the gaps.
const HORN_B = tune(`
  D4 - - - B3 -     C#4 - - - A3 -    C#4 - - - A3 -    D4 - - - - -
  B3 - - - D4 -     E4 - - - C#4 -    D4 - - - A3 -     A3 - - - - .
  G3 - - - B3 -     A3 - - - C#4 -    C#4 - - - A3 -    B3 - - - D4 -
  D4 - - - B3 -     B3 - - - G3 -     A3 - - - C#4 -    E4 - - - - .
`);
// Back in the storm: the oboe, B minor, ending on B major to lift into E.
const TUNE_C = tune(`
  B4 - D5 - F#5 -   G5 - - - F#5 E5   F#5 - - - D5 -    E5 - - - - -
  B4 - D5 - F#5 -   B5 - - - A5 G5    F#5 - - - C#5 -   D#5 - - - F#5 -
`);

// --- The band ---
// The lamp: four notes (the coast cell shuffled, A D E D) round and round
// in a bar of six, so the beam comes round a different way each bar.
const LAMP = tune('A5 D6 E6 D6');
const lamp = (bars, shift = 0) => transpose(repeat(LAMP, (bars * BAR) / 4), shift);
// The flash: a glock note as the beam lines up again, every two bars.
const flash = (bars, note = 'A6') => scatter(bars, BAR, Array.from({ length: bars / 2 }, (_, i) => [i * 2, 0, note]));

// The walking bass: root, fifth, and a step of the scale into the next
// chord's root (a bar a chord, a quarter each). Kept between E-flat 2 and
// E-flat 3: the harp's lowest strings boom ("boing") instead of ringing.
const NAMES = { C: 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9, 'A#': 10, Bb: 10, B: 11 };
const rootOf = (symbol) => NAMES[symbol.replace(/m$/, '')];
const place = (pc) => 39 + ((pc - 3 + 12) % 12);   // E-flat 2 up to D3
function walk(chords, scale) {
  const list = chords.split(/\s+/).filter(Boolean);
  return list.flatMap((symbol, i) => {
    const root = place(rootOf(symbol));
    const next = place(rootOf(list[(i + 1) % list.length]));
    const minor = symbol.endsWith('m');
    let lead;
    if (next === root) lead = root + (minor ? 3 : 4);   // same chord: the third
    else {
      // the scale note just below the next root (a step up into it)
      lead = next - 1;
      while (!scale.includes(((lead % 12) + 12) % 12)) lead -= 1;
      if (lead < 39) lead += 12;
    }
    return [root, '-', root + 7, '-', lead, '-'];
  });
}
const D_MAJOR = [2, 4, 6, 7, 9, 11, 1];
const E_MAJOR = [4, 6, 8, 9, 11, 1, 3];
const B_MINOR = [11, 1, 2, 4, 6, 7, 9, 10, 3];   // with A# and D# for F# and B
// Oom, pah, pah: the plucks on beats 2 and 3.
const pahHigh = (chords) => chordLine(chords, ['.', '.', 7, '.', 7, '.'], 4);
const pahLow = (chords) => chordLine(chords, ['.', '.', 'third', '.', 'third', '.'], 4);
// The frame drum: once a bar, and a soft pickup into every fourth.
const DRUM = [...hits('x.....'), ...hits('x.....'), ...hits('x.....'), ...hits('x...x.')];

// Haddock's motif in D major, slow (lengths 4 2 4 2 in 8ths: two bars).
const HADDOCK_LOW = haddockPhrase('D3', { lengths: [4, 2, 4, 2], unit: 1 });
const HADDOCK_HIGH = haddockPhrase('D5', { lengths: [4, 2, 4, 2], unit: 1 });

export const ISLES_THEME = {
  title: 'Four Small Lights',
  bpm: 88,
  stepsPerBeat: 2,
  volume: 1.6,

  instruments: {
    lamp: { sample: 'harp', volume: 0.12, ring: true, reverb: 0.55, pan: 0.25, humanize: { time: 0.01, volume: 0.18 } },
    flash: { sample: 'glock', volume: 0.07, ring: true, reverb: 0.7, pan: 0.35, echo: { time: 0.34, feedback: 0.25, mix: 0.2 } },
    harpBass: { sample: 'harp', volume: 0.19, ring: true, reverb: 0.45, pan: -0.25, humanize: { time: 0.01, volume: 0.12 } },
    pahHigh: { sample: 'violinsPizz', volume: 0.06, release: 0.2, reverb: 0.5, pan: 0.3, humanize: { time: 0.008, volume: 0.15 } },
    pahLow: { sample: 'violinsPizz', volume: 0.05, release: 0.2, reverb: 0.5, pan: -0.3, humanize: { time: 0.008, volume: 0.15 } },
    drum: { sample: 'frameDrum', drum: 'sample', volume: 0.07, reverb: 0.5, muffle: 1200, humanize: { time: 0.006, volume: 0.15 } },
    flute: { sample: 'flute', volume: 0.26, attack: 0.05, release: 0.45, reverb: 0.5, pan: 0.1, humanize: { time: 0.01, volume: 0.1 } },
    fluteTwo: { sample: 'flute', volume: 0.15, attack: 0.08, release: 0.5, reverb: 0.55, pan: 0.3, humanize: { time: 0.012, volume: 0.12 } },
    violin: { sample: 'soloViolin', volume: 0.18, attack: 0.1, release: 0.6, reverb: 0.55, pan: -0.1, humanize: { time: 0.012, volume: 0.1 } },
    // The foghorn under the coda's horn: a tuba an octave down, barely there.
    hornLow: { sample: 'tuba', volume: 0.06, attack: 0.5, release: 1.2, reverb: 0.65, pan: -0.2, muffle: 900 },
    horn: { sample: 'hornsSoft', volume: 0.12, attack: 0.35, release: 1.0, reverb: 0.6, pan: -0.2 },
    oboe: { sample: 'oboe', volume: 0.2, attack: 0.08, release: 0.5, reverb: 0.55, pan: 0.15, humanize: { time: 0.012, volume: 0.12 } },
    clarinet: { sample: 'clarinet', volume: 0.13, attack: 0.12, release: 0.5, reverb: 0.55, pan: -0.25 },
    violas: { sample: 'violas', volume: 0.1, attack: 0.9, release: 1.2, reverb: 0.55, pan: -0.15 },
    violins: { sample: 'violins', volume: 0.07, attack: 1.0, release: 1.4, reverb: 0.6, pan: 0.3 },
    trem: { sample: 'violinsTrem', volume: 0.05, attack: 1.2, release: 1.4, reverb: 0.6, pan: 0.3 },
    tremLow: { sample: 'violasTrem', volume: 0.05, attack: 1.2, release: 1.4, reverb: 0.6, pan: -0.3 },
    choir: { sample: 'choir', volume: 0.06, attack: 1.4, release: 1.8, reverb: 0.75 },
    swell: { sample: 'cymbalSwell', drum: 'sample', volume: 0.05, reverb: 0.7, muffle: 4000 },
  },

  sections: {
    intro: fit('intro', {
      lamp: lamp(2),
      flash: flash(2),
      harpBass: [midi('D3'), ...Array(2 * BAR - 1).fill('.')],
    }, 2),

    A: fit('A', {
      flute: HOOK,
      lamp: lamp(16),
      flash: flash(16),
      harpBass: walk(A_CHORDS, D_MAJOR),
      pahHigh: after(8, pahHigh(A_CHORDS)),
      pahLow: after(8, pahLow(A_CHORDS)),
      violas: after(8, sustained(A_CHORDS, BAR, 1, 3)),
    }, 16),

    B: fit('B', {
      violin: TUNE_B,
      horn: HORN_B,
      lamp: lamp(16),
      flash: flash(16),
      harpBass: walk(B_CHORDS, D_MAJOR),
      pahHigh: pahHigh(B_CHORDS),
      pahLow: pahLow(B_CHORDS),
      drum: repeat(DRUM, 4),
      violas: sustained(B_CHORDS, BAR, 2, 3),
      violins: after(8, sustained(B_CHORDS, BAR, 1, 4)),
    }, 16),

    C: fit('C', {
      oboe: TUNE_C,
      clarinet: after(4, transpose(TUNE_C, -12)),
      lamp: lamp(8),
      harpBass: walk(C_CHORDS, B_MINOR),
      trem: sustained(C_CHORDS, BAR, 1, 4),
      tremLow: sustained(C_CHORDS, BAR, 0, 3),
      choir: sustained(C_CHORDS, BAR, 2, 4),
      // Peaks on A2's downbeat (3.18 s is about 9 8ths at 88).
      swell: [...rest(6), ...hits('...x..'), ...rest(1)],
    }, 8),

    // The lift: the hook a step up, in E, everyone (still soft).
    A2: fit('A2', {
      violin: transpose(HOOK, 2),
      fluteTwo: transpose(THIRDS, 2),
      flute: after(8, transpose(HOOK, -10)),
      lamp: lamp(16, 2),
      flash: flash(16, 'B6'),
      harpBass: walk(A2_CHORDS, E_MAJOR),
      pahHigh: pahHigh(A2_CHORDS),
      pahLow: pahLow(A2_CHORDS),
      drum: repeat(DRUM, 4),
      violas: sustained(A2_CHORDS, BAR, 1, 3),
      violins: sustained(A2_CHORDS, BAR, 2, 4),
      horn: after(8, sustained(A2_CHORDS, BAR, 0, 3)),
      choir: after(8, sustained(A2_CHORDS, BAR, 1, 4)),
    }, 16),

    // Haddock's Light is next: his four notes on the horn, then the flute.
    coda: fit('coda', {
      horn: [...HADDOCK_LOW, ...rest(6)],
      hornLow: [...HADDOCK_LOW.map((n) => (typeof n === 'number' ? n - 12 : n)), ...rest(6)],
      flute: [...rest(4), ...HADDOCK_HIGH, ...rest(2)],
      lamp: lamp(8),
      flash: flash(8),
      harpBass: walk(CODA_CHORDS, D_MAJOR),
      violas: sustained(CODA_CHORDS, BAR, 1, 3),
      violins: [...rest(6), midi('A4'), ...Array(2 * BAR - 1).fill('-')],
    }, 8),
  },

  order: ['intro', 'A', 'B', 'C', 'A2', 'coda'],
  loopFrom: 1,
};
