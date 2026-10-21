import { melody } from '../../audio/notation.js';
import { BAR, tune, rest, transpose, heldNotes } from './parts/chapter3.js';

// "Minding the Fire": the Keeper's theme, for when he turns up ahead of you
// again (keeperAtTheFire.js). Strings only, all of them real. A kind old man
// by a fire, and something a little strange about him: cello
// pizzicato ticking like his walking stick, or a clock, while the bass
// creeps down a half step a bar (E, D#, D, C#, C...), so the warm E minor
// tune on the solo violin never stands on the same floor twice. It leans
// on the Lydian sharp four over C (the F#), which is the part that sounds
// like a secret. In the middle the fire burns low and the tune slips a half
// step at a time over a tritone (Bb) held high on tremolo violins: the same
// slipping as the lantern in the hut dream (lanternTheme.js).
// 66 BPM in 4/4, one step a 16th. The stick plays once, then it loops from
// the tune, 32 bars, about 1m56s:
//
//   stick    4 bars  the cello pizzicato alone, tremolo violas creeping in
//   tune     8 bars  the Keeper's tune on the solo violin
//   fire     8 bars  the violas take it low; embers (violin pizzicato)
//   slip     8 bars  the pizzicato stops; the tune slips down a half step at
//                    a time over a low tremolo E and a high tritone
//   again    8 bars  the tune with the violins under it, kind again; it ends
//                    on B7 and goes round

// The bass, one note a bar, creeping down: Em, Em(maj7)/D#, Em7/D, A/C#,
// Cmaj7(#11), Am, F#m7b5, B7.
const BASS = 'E2 D#2 D2 C#2 C2 A1 F#1 B1';

// The stick: the cellos plucked on every beat, the root and what's over it.
const STICK = tune(`
  E2 . B2 . E3 . B2 . | D#2 . B2 . E3 . B2 . | D2 . B2 . E3 . B2 . | C#2 . A2 . E3 . A2 . |
  C2 . G2 . E3 . G2 . | A1 . E2 . C3 . E2 . | F#1 . C2 . A2 . C2 . | B1 . F#2 . A2 . D#3 . |
`);
// For the stick alone at the start: the first bar four times.
const STICK_ALONE = [...STICK.slice(0, BAR), ...STICK.slice(0, BAR), ...STICK.slice(0, BAR), ...STICK.slice(0, BAR)];

// The Keeper's tune (each token an 8th): up the fourth like a greeting,
// the D# under the bass's D#, the warm C# over A; then G and F# over C, the
// Lydian secret, and down to the leading tone, left hanging over B7.
const TUNE = tune(`
  B4 - - - E5 - F#5 G5 | F#5 - - - D#5 - E5 - | B4 - - - - - A4 B4 | C#5 - - - E5 - - - |
  G5 - - - F#5 - E5 - | C5 - - - B4 - A4 - | A4 - - - G4 - F#4 - | D#5 - - - - - . . |
`);

// The shimmer: two tremolo lines, a whole note a bar.
const SHIMMER_LOW = heldNotes('B3 B3 B3 A3 G3 C4 A3 A3', BAR);
const SHIMMER_HIGH = heldNotes('G4 F#4 F#4 E4 E4 E4 C4 D#4', BAR);

// Embers: now and then a high pluck, off the beat.
const EMBERS = tune(`
  . . . . . B5 . . | . . . . . . . . | . . . E6 . . . . | . . . . . . C#6 . |
  . . . . . F#5 . . | . . . . . . . . | . . . A5 . . . . | . . . . . F#5 . D#6 |
`);

// The slip (each token an 8th): the tune's opening, then everything after
// it a half step lower than it should be, and lower again, like the
// lantern's music box; down to B, and nothing.
const SLIP = tune(`
  B3 - - - E4 - F#4 G4 | F4 - - - Eb4 - D4 - | Bb3 - - - Eb4 - F4 Gb4 | E4 - - - D4 - Db4 - |
  A3 - - - D4 - E4 F4 | Eb4 - - - Db4 - C4 - | B3 - - - - - - - | . . . . . . . . |
`);
// The fire burning low under it: a low E, and the tritone hanging high.
const EMBER_GLOW = heldNotes('E2 E2 E2 E2 E2 E2 E2 E2', BAR);
const TRITONE = [...heldNotes('Bb5 Bb5 Bb5 Bb5 Bb5 Bb5', BAR), ...rest(2)];
// Two last plucks as the slip ends: a tritone, then the root.
const LAST_EMBERS = [...rest(6), ...tune('. . . . . . . . | Bb5 . . . E5 . . .')];

export const KEEPER_THEME = {
  title: 'Minding the Fire',
  bpm: 66,
  stepsPerBeat: 4,
  // A character theme, under talking.
  volume: 0.7,

  instruments: {
    // The tune: a solo violin, close, a little vibrato in the recording.
    violin: { sample: 'soloViolin', volume: 0.36, attack: 0.06, release: 0.6, reverb: 0.5, pan: 0.15, humanize: { time: 0.012, volume: 0.1 } },
    violins: { sample: 'violins', volume: 0.18, attack: 0.2, release: 0.8, reverb: 0.55, pan: 0.3 },
    violas: { sample: 'violas', volume: 0.34, attack: 0.12, release: 0.8, reverb: 0.5, pan: -0.05, humanize: { time: 0.014, volume: 0.1 } },
    // The stick: cellos plucked, dry and near.
    stick: { sample: 'cellosPizz', volume: 0.38, ring: true, reverb: 0.3, pan: -0.2, humanize: { time: 0.01, volume: 0.18 } },
    embers: { sample: 'violinsPizz', volume: 0.16, ring: true, reverb: 0.6, pan: 0.4, humanize: { time: 0.02, volume: 0.25 } },
    shimmerLow: { sample: 'violasTrem', volume: 0.12, attack: 0.7, release: 1, reverb: 0.6, pan: -0.3 },
    shimmerHigh: { sample: 'violinsTrem', volume: 0.08, attack: 0.9, release: 1.2, reverb: 0.65, pan: 0.35 },
    glow: { sample: 'cellosTrem', volume: 0.2, attack: 0.8, release: 1.2, reverb: 0.5, pan: -0.15 },
    cellos: { sample: 'cellos', volume: 0.22, attack: 0.4, release: 1, reverb: 0.5, pan: -0.25 },
    basses: { sample: 'bassSpic', volume: 0.22, release: 0.6, reverb: 0.4 },
  },

  sections: {
    // The stick alone; the violas' tremolo creeps in for the last two bars.
    stick: {
      stick: STICK_ALONE,
      shimmerLow: [...rest(2), ...heldNotes('B3 B3', BAR)],
    },

    // The Keeper's tune on the solo violin.
    tune: {
      stick: STICK,
      violin: TUNE,
      shimmerLow: SHIMMER_LOW,
    },

    // The violas take the tune low; the embers; violins high and soft.
    fire: {
      stick: STICK,
      violas: transpose(TUNE, -12),
      embers: EMBERS,
      shimmerLow: SHIMMER_LOW,
      shimmerHigh: SHIMMER_HIGH,
    },

    // The fire burns low. No stick: the tune slipping on the violas, a low
    // tremolo E under it and the tritone hanging over it.
    slip: {
      violas: SLIP,
      glow: EMBER_GLOW,
      shimmerHigh: TRITONE,
      embers: LAST_EMBERS,
    },

    // Kind again: the tune on the solo violin, the violins an octave under
    // it, the cellos holding the creeping bass, a low pluck on each bar.
    again: {
      stick: STICK,
      violin: TUNE,
      violins: transpose(TUNE, -12),
      cellos: heldNotes(BASS, BAR, 1),
      basses: BASS.split(' ').flatMap((n) => [...melody(n, 1), ...rest(1).slice(1)]),
      shimmerHigh: SHIMMER_HIGH,
    },
  },

  // The stick plays once; then the fire goes round from the tune.
  order: ['stick', 'tune', 'fire', 'slip', 'again'],
  loopFrom: 1,
};
