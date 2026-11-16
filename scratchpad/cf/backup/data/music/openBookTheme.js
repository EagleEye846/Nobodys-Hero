import { arpeggio, chordLine, sustained, melody, rest as restBars, held, midi } from './parts/chapter4.js';
import { drops } from './parts/chapter3.js';

// "A Book Left Open": the theme of the dead city's three secret rooms, the
// ones nobody was meant to find: the Reading Room behind the shelf that
// moves, the Stacks under the library floor, and the Sculptor's Yard behind
// the stone head. Until now they were silent. They are the places where
// somebody stopped in the middle of something: a book open on a desk with a
// sword for a bookmark, a statue half done, books nobody asked for. So the
// song is small and private and dry (these rooms never flooded), and it
// belongs to the city's own song, "What They Built for Him": the same
// rain, three notes patted out by a close harp (E A C, the chapter's first
// cell without its last step), going on and on with the page not turned,
// while only the bass moves under it and turns the same three notes into
// new colours. Over the rain a flute reads the chapter's first cell aloud in
// long notes (E A C B in A minor, up a fourth, up a minor third, one step
// down), and an oboe answers it. Soft strings, woodwinds, a piano that
// barely touches the keys; no cellos at all above a whisper, nothing boss-
// like. Reference for the mood only: the quiet rooms of Hollow Knight's
// City of Tears, and the library tracks of Toby Fox's Undertale.
//
// A minor with one borrowed chord (B flat, the flat second, in the hush)
// and a bass that moves by step; 56 BPM in 4/4, one step a 16th: a bar is
// about 4.3 seconds. The dust plays once (2 bars); then it loops from A,
// 40 bars, about 2m50s:
//
//   dust     2 bars  the rain starts, one note of piano, a low A
//   A        8 bars  THE TUNE on the flute over the rain; the bass walks
//   A2       8 bars  the oboe answers it, a solo violin high above, violas
//   B       10 bars  F major and C: the page is turned; the clarinet sings
//                    the cell's inversion (it goes down a fourth, down a
//                    minor third, one step up), the harp climbs the rain
//   hush     4 bars  B flat under the same rain: the cell on glass, one
//                    note a bar, and the dust catching the lamp
//   A3       8 bars  the tune again, flute and violins, and back to A

const BAR = 16;
const rest = (bars) => restBars(bars, BAR);
const tune = (text) => melody(text, 2);   // each token an 8th
// Fails loudly if a section's tracks are not all the same whole number of bars.
const tight = (name, section, bars) => {
  for (const [track, steps] of Object.entries(section)) {
    if (steps.length !== bars * BAR) throw new Error(`A Book Left Open ${name}: '${track}' is ${steps.length} steps, not ${bars} bars`);
  }
  return section;
};
const down = (steps, semitones) => steps.map((n) => (typeof n === 'number' ? n + semitones : n));

// The rain: E A C A, in 16ths, a bar of it, never changing.
const DROP = ['E5', 'A5', 'C6', 'A5'].map(midi);
const rain = (bars) => Array.from({ length: bars * 4 }, () => DROP).flat();
// --- The harmony: what the bass makes of the rain, a bar each. ---
const A_CHORDS = 'Am Am F C G Em Dm E';
const B_CHORDS = 'F C Dm Am F C E E Am Am';
const HUSH_CHORDS = 'Bb Bb Am Am';
// The bass, one note to a bar, left to ring, going down by step.
const ROOT = [0, ...Array(BAR - 1).fill('-')];
// The left hand adds the fifth halfway through the bar.
const LEFT = [0, '-', '-', '-', '-', '-', '-', '-', 7, '-', '-', '-', '-', '-', '-', '-'];

// --- THE TUNE. Bar 1 is the cell: E A C B. ---
const TUNE = tune(`
  E5 - - - A5 - C6 - | B5 - - - - - - - | A5 - - - F5 - - - | E5 - - - - - - - |
  D5 - - - G5 - B5 - | G5 - - - E5 - - - | F5 - - - A5 - - - | G#5 - - - - - - -
`);
// The oboe's answer: the same steps, a third lower.
const ANSWER = down(TUNE, -4);
// The page turned: the cell upside down, in F (C5 G4 E4 F4: down a fourth,
// down a minor third, one step up), then on.
const TURNED = tune(`
  C5 - - - G4 - E4 - | F4 - - - - - - - | E4 - - - A4 - C5 - | D5 - - - - - - - |
  F5 - - - C5 - A4 - | G4 - - - C5 - - - | G#4 - - - B4 - - - | E5 - - - - - - - |
  C5 - - - A4 - - - | A4 - - - - - - -
`);
// The hush: the cell, a bar a note, on glass, over B flat and then A.
const [e6, a6, c7, b6] = ['E5', 'A5', 'C6', 'B5'].map(midi);
const GLASS_CELL = [...held(e6, BAR), ...held(a6, BAR), ...held(c7, BAR), ...held(b6, BAR)];

export const OPEN_BOOK_THEME = {
  title: 'A Book Left Open',
  bpm: 56,
  stepsPerBeat: 4,
  volume: 0.7,

  instruments: {
    // The rain: a close harp, soft, the same three notes.
    rain: { sample: 'harp', volume: 0.12, release: 0.9, reverb: 0.5, pan: 0.15, humanize: { time: 0.008, volume: 0.22 } },
    harp: { sample: 'harp', volume: 0.22, ring: true, reverb: 0.55, pan: -0.3, humanize: { time: 0.015, volume: 0.2 } },
    left: { sample: 'grandPiano', volume: 0.17, ring: true, reverb: 0.5, pan: -0.1, humanize: { time: 0.012, volume: 0.12 } },
    drops: { sample: 'grandPiano', volume: 0.09, ring: true, reverb: 0.7, pan: -0.45, humanize: { time: 0.03, volume: 0.3 } },
    flute: { sample: 'flute', volume: 0.26, attack: 0.15, release: 0.9, reverb: 0.65, pan: 0.1, humanize: { time: 0.012, volume: 0.1 } },
    oboe: { sample: 'oboe', volume: 0.22, attack: 0.12, release: 0.8, reverb: 0.6, pan: 0.2, humanize: { time: 0.012, volume: 0.1 } },
    clarinet: { sample: 'clarinet', volume: 0.26, attack: 0.12, release: 0.8, reverb: 0.55, pan: -0.15, humanize: { time: 0.012, volume: 0.1 } },
    soprano: { sample: 'soloViolin', volume: 0.18, attack: 0.5, release: 1.3, reverb: 0.8, pan: 0.05 },
    violins: { sample: 'violins', volume: 0.12, attack: 0.8, release: 1.4, reverb: 0.6, pan: 0.25 },
    violas: { sample: 'violas', volume: 0.14, attack: 1, release: 1.6, reverb: 0.6, pan: -0.25 },
    // The glass cell and the dust: a glass tone, a glockenspiel far back.
    glass: { sample: 'glass', volume: 0.2, ring: true, reverb: 0.8, pan: 0.2, echo: { time: 1.07, feedback: 0.3, mix: 0.3 } },
    dust: { sample: 'glock', volume: 0.06, ring: true, reverb: 0.75, pan: 0.4, echo: { time: 1.07, feedback: 0.25, mix: 0.25 } },
    drone: { sample: 'violas', volume: 0.07, attack: 2, release: 3, reverb: 0.6, pan: -0.1 },
  },

  sections: {
    // The rain starts; a low A; one note of piano.
    dust: tight('dust', {
      rain: [...rest(1), ...rain(1)],
      drone: held(midi('A3'), 2 * BAR),
      drops: drops('Am Am', BAR, 0.1, 9, 4),
    }, 2),

    // The tune read aloud on the flute, the rain, the bass moving.
    A: tight('A', {
      flute: TUNE,
      rain: rain(8),
      left: chordLine(A_CHORDS, LEFT, 2),
      harp: arpeggio(A_CHORDS, BAR, 3, [0, '-', '-', '-', 7, '-', '-', '-', 'tenth', '-', '-', '-', 7, '-', '-', '-']),
      violas: sustained(A_CHORDS, BAR, 2, 3),
      dust: drops(A_CHORDS, BAR, 0.04, 11, 4),
    }, 8),

    // The oboe answers; a solo violin high above; violas and a pad.
    A2: tight('A2', {
      oboe: ANSWER,
      soprano: TUNE,
      rain: rain(8),
      left: chordLine(A_CHORDS, LEFT, 2),
      violins: sustained(A_CHORDS, BAR, 1, 4),
      violas: sustained(A_CHORDS, BAR, 2, 3),
      dust: drops(A_CHORDS, BAR, 0.06, 23, 4),
    }, 8),

    // The page turned: F major, the cell upside down on the clarinet.
    B: tight('B', {
      clarinet: TURNED,
      rain: rain(10),
      left: chordLine(B_CHORDS, LEFT, 2),
      harp: arpeggio(B_CHORDS, BAR, 3, [0, '-', 7, '-', 'tenth', '-', 12, '-', 19, '-', 12, '-', 'tenth', '-', 7, '-']),
      violins: sustained(B_CHORDS, BAR, 1, 4),
      violas: sustained(B_CHORDS, BAR, 0, 3),
      dust: drops(B_CHORDS, BAR, 0.08, 41, 4),
    }, 10),

    // Only the rain and the glass: the cell, a bar a note.
    hush: tight('hush', {
      rain: rain(4),
      glass: GLASS_CELL,
      left: chordLine(HUSH_CHORDS, ROOT, 2),
      drone: held(midi('A3'), 4 * BAR),
      dust: drops(HUSH_CHORDS, BAR, 0.1, 5, 4),
    }, 4),

    // The tune again, flute and violins; then the rain and nothing else.
    A3: tight('A3', {
      flute: TUNE,
      violins: down(TUNE, -12),
      soprano: [...rest(4), ...down(TUNE.slice(4 * BAR), 12)],
      rain: rain(8),
      left: chordLine(A_CHORDS, LEFT, 2),
      harp: arpeggio(A_CHORDS, BAR, 3, [0, '-', '-', '-', 7, '-', '-', '-', 'tenth', '-', '-', '-', 7, '-', '-', '-']),
      violas: sustained(A_CHORDS, BAR, 2, 3),
      dust: drops(A_CHORDS, BAR, 0.06, 7, 4),
    }, 8),
  },

  // The dust settles once; then the room goes round from the tune.
  order: ['dust', 'A', 'A2', 'B', 'hush', 'A3'],
  loopFrom: 1,
};
