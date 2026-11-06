import { melody, transpose, HOLD, REST } from '../../audio/notation.js';
import { SAMPLE_SETS } from '../../audio/sampleSets.js';
import { midi } from './parts/usurper.js';
import { TUCK_TUNE, TUCK_CHORDS } from './rumboldTheme.js';

// "Small Enough to Hide": the theme of Tuck, the king's page, the dormouse in
// the red cap and the tabard that was cut for somebody bigger. He is nervous,
// kind, and very much wants to be brave; and he is the one who has done King
// Peptup's voice, behind the curtain, for forty-two years. It plays when he
// finds you in the grotto and when he walks you down the king's road, the two
// scenes where he is still only a shy little page.
//
// It is built from his tune, the one that already hides inside the boss music:
// TUCK_TUNE in rumboldTheme.js ("Behind the Curtain" plays it small, "No
// Strings" quotes it once more). The king's hook and Tuck's tune are the same
// four notes; the king shouts them and Tuck whispers them. Here nobody
// shouts. Note for note it is the same tune: a stammer at the front (D, D-G
// Bb A), a sigh down, a second line a step lower, then up and home to G.
// Heard here first, in a small room, so that the boss music's quotes mean
// something later.
//
// Instruments, all real recordings (VSCO 2 and VCSL, sampleSets.js), all
// small: a music box (the glockenspiel, high up) and a harp; plucked cellos
// and violins walking on tiptoe; a clarinet for his voice; a solo violin for
// the brave part; soft violas and cellos underneath. No drums, nothing loud.
//
// G minor, to a G major cadence at the end of his tune. 76 BPM, one step a
// 16th, so a bar is 3.2 seconds. The intro plays once (6.3s); then it loops
// from A, 24 bars, 1m16s:
//
//   intro   2 bars  0:00 the music box alone, the stammer and then no more,
//                   as if he'd peeked out and thought better of it
//   A       8 bars  0:06 the harp tells his tune, the cellos plucked on
//                   tiptoe, a violin plucked now and then; the music box
//                   answers with the little cell
//   B       8 bars  0:32 the clarinet sings it, close and in tune, the harp
//                   rocking under, violas holding; it ends on G major
//   C       8 bars  0:57 the brave part: E flat major, the stammer gone. The
//                   cell goes up instead of hesitating, the solo violin takes
//                   it and reaches for the top, cellos bowed underneath, the
//                   music box glittering. It never gets loud; it just
//                   doesn't hide. The last bar slides back down on a D chord
//                   to the harp's first note.

// --- Helpers. ---
const BAR = 16;
const R = REST;
const r8 = (text) => melody(text, 2);
const rest = (bars) => Array(bars * BAR).fill(R);
const at = (bars, track) => [...rest(bars), ...track];
function section(bars, tracks) {
  return Object.fromEntries(Object.entries(tracks).map(([name, steps]) => {
    if (steps.length > bars * BAR) throw new Error(`Small Enough to Hide: '${name}' is ${steps.length} steps, longer than ${bars} bars`);
    return [name, [...steps, ...Array(bars * BAR - steps.length).fill(R)]];
  }));
}

// Chords, a bar each ('Cm,D' is two, half a bar each).
const QUALITY = { '': [0, 4, 7], m: [0, 3, 7] };
function chordOf(symbol) {
  const m = symbol.match(/^([A-G][#b]?)(m)?7?$/);
  if (!m) throw new Error(`Small Enough to Hide: can't read the chord '${symbol}'`);
  return { root: midi(`${m[1]}4`) % 12, tones: QUALITY[m[2] ?? ''] };
}
const inBand = (pc, low) => low + ((pc - (low % 12) + 12) % 12);
// A pattern is 16 steps of R (rest), HOLD or 'R' 'T' 'F' (root, third, fifth;
// '+' an octave up, '-' an octave down), played against each bar's chord.
function comp(chords, pattern, low) {
  return chords.split(/\s+/).filter(Boolean).flatMap((bar) => {
    const parts = bar.split(',');
    const each = BAR / parts.length;
    return parts.flatMap((symbol, i) => {
      const chord = chordOf(symbol);
      const slice = pattern.slice(i * each, (i + 1) * each);
      return slice.map((p) => {
        if (p === R || p === HOLD) return p;
        const shift = p.endsWith('-') ? -12 : p.endsWith('+') ? 12 : 0;
        return inBand(chord.root, low) + chord.tones['RTF'.indexOf(p[0])] + shift;
      });
    });
  });
}
const holdBar = (p) => [p, ...Array(BAR - 1).fill(HOLD)];

// --- His tune (the same notes as TUCK_TUNE; chords from rumboldTheme.js). ---
const TUNE = r8(TUCK_TUNE);
// The music box answering with the cell, small and high (as in "Behind the Curtain").
const BOX_CELL = r8('. . . . . . . . | . . . . D6 G6 Bb6 A6 | . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . G6 C7 Eb7 D7 | . . . . . . . . | . . . . . . . .');
// The intro: the stammer, and then he thinks better of it.
const PEEK = r8('. . . . . . . . | D6 . D6 G6 - . . .');
// Tiptoe: the root, a fifth, and a plucked violin on the offbeat.
const TIPTOE = ['R', R, R, R, R, R, R, R, 'F', R, R, R, R, R, R, R];
const TICKS = [R, R, R, R, R, R, 'T', R, R, R, R, R, R, R, 'F', R];
// The harp rocking under the clarinet: root, fifth, octave, third, in 8ths.
const ROCK = ['R', R, 'F', R, 'R+', R, 'T+', R, 'R+', R, 'T+', R, 'F', R, 'T', R];

// --- C: the brave part, E flat major. The cell without the stammer, lifted. ---
const BRAVE_CHORDS = 'Eb Bb Cm Cm,D Eb F Gm D';
const BRAVE = r8(`
  Bb4 - Bb4 Eb5 - G5 F5 - | - - D5 F5 Bb5 - . . | C5 - C5 Eb5 - G5 F5 - | - - Eb5 D5 C5 - D5 - |
  Bb5 - Bb5 Eb6 - G6 F6 - | - - C6 D6 F6 - . . | G5 - G5 Bb5 - D6 C6 - | A5 - F#5 - A5 - D6 - |
`);
// The clarinet under it, tiny held notes.
const SUPPORT = r8(`
  . . . . G4 - - - | . . . . F4 - - - | . . . . Eb4 - - - | . . . . D4 - - - |
`);

const near = (n, notes) => n >= Math.min(...notes) - 3 && n <= Math.max(...notes) + 3;

const song = {
  title: 'Small Enough to Hide',
  bpm: 76,
  stepsPerBeat: 4,
  volume: 1.2,

  instruments: {
    // The music box: the glockenspiel, high.
    box: { sample: 'glock', volume: 0.1, ring: true, reverb: 0.5, pan: 0.35, humanize: { time: 0.012, volume: 0.15 } },
    harp: { sample: 'harp', volume: 0.3, ring: true, reverb: 0.5, pan: 0.15, echo: { time: 0.42, feedback: 0.22, mix: 0.18 }, humanize: { time: 0.01, volume: 0.12 } },
    harpSoft: { sample: 'harp', volume: 0.2, ring: true, reverb: 0.55, pan: 0.2, humanize: { time: 0.012, volume: 0.15 } },
    // Tiptoe.
    tiptoe: { sample: 'cellosPizz', volume: 0.26, ring: true, reverb: 0.3, pan: -0.25, humanize: { time: 0.006, volume: 0.15 } },
    ticks: { sample: 'violinsPizz', volume: 0.16, ring: true, reverb: 0.3, pan: 0.3, humanize: { time: 0.006, volume: 0.2 } },
    // His voice.
    tuck: { sample: 'clarinet', volume: 0.36, attack: 0.07, release: 0.5, reverb: 0.5, pan: -0.05, humanize: { time: 0.014, volume: 0.1 } },
    tuckSoft: { sample: 'clarinet', volume: 0.16, attack: 0.12, release: 0.7, reverb: 0.55, pan: -0.1, humanize: { time: 0.014, volume: 0.1 } },
    // The brave part.
    violin: { sample: 'soloViolin', volume: 0.36, attack: 0.12, release: 0.7, reverb: 0.5, pan: 0.1, humanize: { time: 0.012, volume: 0.1 } },
    violas: { sample: 'violas', volume: 0.17, attack: 0.5, release: 1, reverb: 0.5, pan: -0.1 },
    cellos: { sample: 'cellos', volume: 0.2, attack: 0.5, release: 1, reverb: 0.5, pan: -0.25 },
  },

  sections: {
    intro: section(2, { box: PEEK, tiptoe: at(1, [midi('G2')]) }),

    A: section(8, {
      harp: TUNE,
      box: BOX_CELL,
      tiptoe: comp(TUCK_CHORDS, TIPTOE, 43),
      ticks: at(2, comp(TUCK_CHORDS.split(' ').slice(2).join(' '), TICKS, 55)),
      cellos: at(7, holdBar(midi('G2'))),
    }),

    B: section(8, {
      tuck: TUNE,
      harp: comp(TUCK_CHORDS, ROCK, 50),
      tiptoe: comp(TUCK_CHORDS, TIPTOE, 43),
      violas: comp(TUCK_CHORDS, holdBar('F'), 50),
    }),

    C: section(8, {
      violin: BRAVE,
      tuckSoft: SUPPORT,
      harpSoft: comp(BRAVE_CHORDS, ROCK, 50),
      cellos: comp(BRAVE_CHORDS, holdBar('R'), 43),
      violas: comp(BRAVE_CHORDS, holdBar('T'), 55),
      tiptoe: comp(BRAVE_CHORDS, TIPTOE, 43),
      box: at(4, transpose(r8('Bb5 - Bb5 Eb6 - G6 F6 - | . . . . . . . . | C6 - C6 Eb6 - G6 F6 - | . . . . . . . .'), 12)),
    }),
  },

  order: ['intro', 'A', 'B', 'C'],
  loopFrom: 1,
};

for (const tracks of Object.values(song.sections)) {
  for (const [name, steps] of Object.entries(tracks)) {
    const instrument = song.instruments[name];
    if (!instrument?.sample || instrument.drum) continue;
    const { notes } = SAMPLE_SETS[instrument.sample];
    tracks[name] = steps.map((s) => (typeof s === 'number' ? [s, s - 12, s + 12, s - 24, s + 24].find((n) => near(n, notes)) ?? s : s));
  }
}

export const TUCK_THEME = song;
