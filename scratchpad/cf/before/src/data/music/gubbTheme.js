import { melody, arpeggio, REST, HOLD } from '../../audio/notation.js';
import { midi } from './parts/chapter4.js';

// "Next Verse, Probably": Gubb's ferry song. Gubb is the old fat green frog who
// poles the punt across the Stillwater with a lantern on the prow, and who has
// not had a passenger in a hundred years. He sings to himself, slow and
// croaky, and he has been working on the next verse for most of that time.
// This is the lake's own tune, "Slow Water" (E A C B: up a fourth, up a minor
// third, down a step, the chapter's first cell), the way a ferryman would
// sing it: put into a boatman's rocking rhythm, with a lilt, and with the
// words going missing. It plays on the three ferry rides (gubb_crossing,
// gubb_ferry_over, gubb_ferry_back) and hands back to the lake's song when
// each one ends.
//
// A barcarolle: 6/8, a long note and a short one, the harp rocking under it
// once to each pole stroke. His voice is a trombone, low in its range, with a
// slow breath on every note, because there is no choir to borrow and a
// synth would not croak; now and then it scoops up to a note from half a step
// under, and once a note sags a half step flat and he puts it right, the way
// a singer does who has not heard anyone else sing for a century. When he
// loses the words he does what anyone does: carries on on one note, humming
// (a soft horn, the same note for two whole bars, while the harp and the
// plucked cellos go on rocking as if nothing were wrong), and then finds the
// tune again. Underneath: a harp, plucked cellos for the pole, a few plucked
// violins for drips off the pole, and bowed vibraphone and glass for the water.
//
// Instruments, all real recordings (VSCO 2 and VCSL, sampleSets.js): trombone,
// horns, harp, plucked cellos and violins, bowed vibraphone, glass.
//
// A minor, 6/8 at 58 dotted quarters a minute, one step an 8th: a bar is 2.07
// seconds. The intro plays once (4s); then it loops from A, 32 bars, 1m06s:
//
//   intro   2 bars  0:00 the harp starts rocking, the pole comes down, and
//                   Gubb hums one note to see if anyone is listening
//   A       8 bars  0:04 the verse as he knows it: the lake's cell (E A C B)
//                   first, then the answer, with a scoop up into the second
//                   line; he ends on A
//   B       8 bars  0:21 the second verse, and he forgets: the first line goes
//                   well, he starts the second, loses it, and hums one note
//                   for two bars (0:29 to 0:34) while the harp rocks on; then
//                   he finds the end of the line, a little late
//   C       8 bars  0:38 the next verse: the harp plays the lake's cell and the
//                   vibraphone answers it upside down in the water, and Gubb
//                   tries out a new line, going somewhere he has not been
//                   before; it ends hanging on a B over an E chord, as if he
//                   were waiting for the rhyme
//   D       8 bars  0:55 the verse once more, a horn an octave under him, warm,
//                   and one note that sags a half step flat (bar 6) and is put
//                   right; ends on A, ready to go round

const BAR = 6;
const R = REST;
const rest = (bars) => Array(bars * BAR).fill(R);
const held = (note, steps) => [midi(note), ...Array(steps - 1).fill(HOLD)];
// Fails loudly if a section's tracks are not all the same whole number of bars.
const tight = (name, section, bars) => {
  for (const [track, steps] of Object.entries(section)) {
    if (steps.length !== bars * BAR) throw new Error(`Next Verse, Probably ${name}: '${track}' is ${steps.length} steps, not ${bars} bars`);
  }
  return section;
};
const eighths = (text) => melody(text, 1);

// --- The harmony, a bar each. ---
const A_CHORDS = 'Am F C G Am F Dm Am';
const C_CHORDS = 'Am F Dm Am Am Dm G E';

// --- His voice (each token an 8th note; a bar is six). ---
// The verse. E A C B is the lake's cell; the answer comes down to G, E, D.
const VERSE_1 = `
  E3 - - A3 - -  C4 - - B3 - A3  G3 - - E3 - D3  E3 - - - - -
`;
const VERSE_2 = `
  E3 - - A3 - -  C4 - - D4 - C4  A3 - F3 G3 - E3  A3 - - - - -
`;
// The second line, scooping into its first note from half a step under.
const VERSE_2_SCOOP = `
  Eb3 E3 - A3 - -  C4 - - D4 - C4  A3 - F3 G3 - E3  A3 - - - - -
`;
// The last verse: on the D in bar six he lands a half step flat.
const VERSE_2_SAG = `
  E3 - - A3 - -  C4 - - Db4 - C4  A3 - F3 G3 - E3  A3 - - - - -
`;
// The second verse: he starts line two and the words go (two bars of nothing
// here, the hum has them), then he finds the end of the line.
const FORGETS = `
  E3 - - A3 - -  . . . . . .  . . . . . .  Eb3 E3 - A3 - -
`;
// The next verse: new notes, going somewhere he has not been.
const NEXT_VERSE = `
  . . . . . .  . . . . . .  . . . . . .  . . . . . .
  A3 - - C4 - -  D4 - - E4 - -  D4 - C4 B3 - G3  B3 - - - - -
`;

// --- The water. ---
// The lake's cell and its reflection (B C A E, an octave down), a dotted quarter each.
const CELL = melody('E5 A5 C6 B5', 3);
const MIRROR = melody('B4 C5 A4 E4', 3);
// Harp rocking: root, fifth, third, octave, third, fifth. Once a stroke.
const ROCK_SHAPE = [0, 7, 'tenth', 12, 'tenth', 7];
const rock = (chords) => arpeggio(chords, BAR, 4, ROCK_SHAPE);
// The pole: a plucked root on the stroke and a fifth halfway.
const pole = (chords) => arpeggio(chords, BAR, 2, [0, R, R, 7, R, R]);
// A drip off the pole: one high plucked note, now and then, off the beat.
function drip(chords, chance, seed) {
  let s = seed >>> 0;
  const rand = () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296;
  return arpeggio(chords, BAR, 5, [R, R, 'tenth', R, R, 12])
    .map((note) => (note !== R && rand() < chance ? note : R));
}

export const GUBB_THEME = {
  title: 'Next Verse, Probably',
  bpm: 58,
  stepsPerBeat: 3,
  volume: 1,

  instruments: {
    // His voice: a trombone, low, with a slow breath.
    gubb: { sample: 'trombone', volume: 0.5, attack: 0.16, release: 0.5, reverb: 0.4, pan: 0.05, humanize: { time: 0.03, volume: 0.15 } },
    // The hum: a soft horn on one note.
    hum: { sample: 'hornsSoft', volume: 0.3, attack: 0.5, release: 0.9, reverb: 0.5, pan: 0.05, humanize: { time: 0.02, volume: 0.1 } },
    // Warmth under the last verse.
    under: { sample: 'hornsSoft', volume: 0.18, attack: 0.3, release: 0.7, reverb: 0.5, pan: -0.1, humanize: { time: 0.03, volume: 0.1 } },
    harp: { sample: 'harp', volume: 0.3, ring: true, reverb: 0.55, pan: -0.3, humanize: { time: 0.012, volume: 0.15 } },
    harpSolo: { sample: 'harp', volume: 0.34, ring: true, reverb: 0.7, pan: 0.2, echo: { time: 0.5, feedback: 0.25, mix: 0.2 }, humanize: { time: 0.012, volume: 0.1 } },
    pole: { sample: 'cellosPizz', volume: 0.3, ring: true, reverb: 0.35, pan: -0.2, humanize: { time: 0.01, volume: 0.15 } },
    drip: { sample: 'violinsPizz', volume: 0.14, ring: true, octave: -2, reverb: 0.7, pan: 0.4, humanize: { time: 0.03, volume: 0.3 } },
    mirror: { sample: 'vibesBowed', volume: 0.28, attack: 0.15, release: 1.2, reverb: 0.8, pan: 0.35, echo: { time: 0.7, feedback: 0.4, mix: 0.4 } },
    glass: { sample: 'glass', volume: 0.08, attack: 1.5, release: 2.5, reverb: 0.85, pan: -0.4 },
  },

  sections: {
    // The harp starts, the pole comes down, and Gubb hums one note.
    intro: tight('intro', {
      harp: rock('Am Am'),
      pole: arpeggio('Am Am', BAR, 2, [0, R, R, 7, R, R]),
      gubb: [...rest(1), ...eighths('A3 - - - - .')],
    }, 2),

    // The verse as he knows it.
    A: tight('A', {
      gubb: [...eighths(VERSE_1), ...eighths(VERSE_2_SCOOP)],
      harp: rock(A_CHORDS),
      pole: pole(A_CHORDS),
      drip: drip(A_CHORDS, 0.2, 7),
    }, 8),

    // The second verse: the words go, he hums, he finds them.
    B: tight('B', {
      gubb: [...eighths(VERSE_1), ...eighths(FORGETS)],
      hum: [...rest(5), ...held('A3', 2 * BAR), ...rest(1)],
      harp: rock(A_CHORDS),
      pole: pole(A_CHORDS),
      drip: drip(A_CHORDS, 0.15, 19),
      mirror: [...rest(5), ...held('E5', BAR), ...rest(2)],
    }, 8),

    // The next verse: the lake's cell in the harp, its reflection in the
    // water, and a line he has never sung before.
    C: tight('C', {
      harpSolo: [...CELL, ...rest(6)],
      mirror: [...rest(2), ...MIRROR, ...rest(4)],
      gubb: eighths(NEXT_VERSE),
      harp: rock(C_CHORDS),
      pole: pole(C_CHORDS),
      drip: drip(C_CHORDS, 0.2, 33),
      glass: [...rest(2), ...held('E5', 4 * BAR), ...rest(2)],
    }, 8),

    // The verse once more, a horn under him; one note sags and is put right.
    D: tight('D', {
      gubb: [...eighths(VERSE_1), ...eighths(VERSE_2_SAG)],
      under: [...eighths(VERSE_1), ...eighths(VERSE_2)].map((n) => (typeof n === 'number' ? n - 12 : n)),
      harp: rock(A_CHORDS),
      pole: pole(A_CHORDS),
      drip: drip(A_CHORDS, 0.22, 51),
      harpSolo: [...rest(7), ...eighths('. . . . E5 -')],
    }, 8),
  },

  // The intro plays once; then the lake goes round from the verse.
  order: ['intro', 'A', 'B', 'C', 'D'],
  loopFrom: 1,
};
