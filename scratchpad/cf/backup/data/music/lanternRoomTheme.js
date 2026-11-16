import { melody, sustained, arpeggio, transpose, scatter, tight } from './parts/chapter5.js';

// "The Flame Doesn't Lean": the small still rooms on the coast where somebody
// has left a lantern burning, and nobody says who: the dry pocket under the
// Sunken Lanes (lanes_bubble) and the swept sea cave on the Isles
// (secret_isles_cave). Out there is a storm or a flood; in here it is quiet,
// tidy, warm, and a little too still. The song is that stillness: very soft,
// no drums, no beat you could tap.
//
// THE FLAME: one note, F sharp, on the glass from the first bar to the last
// (breathed again each bar) and never moving, whatever the chords do under it (the ninth of E
// minor, the bright raised fourth over C, the sixth over A minor, the fifth
// of B). That is the flame that doesn't lean.
//
// THE TUNE, on a far music box (a muffled glock): a slow figure in E minor,
// up a fourth like a greeting (B, E, F# G), down to the leading note, and
// left hanging on B. In the middle the violas play it an octave down and
// the music box answers only its first notes, the way you'd hum a tune you
// half know. Who lit the lamps is for later; the song only keeps the tune.
//
// Harmony: Em, C (with the F# over it), Am, B, slowly, over a low harp; the
// bowed vibraphone and the soft violas breathe the chords. The real sea
// (seaWaves) heard as a dull thud through rock or water, now and then.
//
// E minor, 4/4 at 60 (a bar is 4 seconds), one step an 8th. The intro plays
// once (2 bars); then it loops from A, 20 bars, 1m20s:
//
//   intro  2 bars  the flame alone, then the vibes
//   A      8 bars  the tune on the music box, the harp turning the chords
//   B      8 bars  the violas take it low; the music box answers its start
//   still  4 bars  just the flame, the vibes and one far wave; and round

const BAR = 8;
const tune = (text) => melody(text, 1);   // each token an 8th
const rest = (bars) => Array(bars * BAR).fill('.');
const fit = (name, section, bars) => tight("The Flame Doesn't Lean", name, section, bars, BAR);
// Struck again softly every bar (a recording doesn't last for ever), with a
// slow attack and a long release, so it never seems to stop.
const flame = (bars) => Array.from({ length: bars }, () => tune('F#5 - - - - - - -')).flat();

const A_CHORDS = 'Em Em C C Am Am B B';
const B_CHORDS = 'C C Am Am Em Em B B';
const STILL_CHORDS = 'Em Em C B';

const TUNE = tune(`
  B4 - - - E5 - F#5 G5     F#5 - - - - - - -
  D#5 - - - E5 - - -       B4 - - - - - - -
  G5 - - - F#5 - E5 -      C5 - - - B4 - - -
  A4 - - - B4 - - -        D#5 - - - - - . .
`);
const ANSWER = tune(`
  . . . . . . . .          B5 - - - E6 - - -
  . . . . . . . .          . . . . . . . .
  . . . . . . . .          B5 - - - E6 - F#6 -
  . . . . . . . .          . . . . . . . .
`);
// The harp turning each chord over slowly: root, fifth, third above.
const TURN = ['.', 0, '.', 7, '.', 'tenth', '.', '.'];

export const LANTERN_ROOM_THEME = {
  title: "The Flame Doesn't Lean",
  bpm: 60,
  stepsPerBeat: 2,
  volume: 1.5,

  instruments: {
    // The flame: one glass note, held for the whole song.
    flame: { sample: 'glass', volume: 0.07, attack: 1.5, release: 3, reverb: 0.8, pan: 0.1 },
    box: { sample: 'glock', volume: 0.07, ring: true, muffle: 3000, reverb: 0.8, pan: 0.3, humanize: { time: 0.02, volume: 0.15 } },
    harp: { sample: 'harp', volume: 0.13, ring: true, reverb: 0.65, pan: -0.2, humanize: { time: 0.015, volume: 0.15 } },
    vibes: { sample: 'vibesBowed', volume: 0.09, attack: 1.5, release: 2.5, reverb: 0.8, pan: 0.15 },
    violas: { sample: 'violas', volume: 0.1, attack: 0.8, release: 1.6, muffle: 2200, reverb: 0.7, pan: -0.1 },
    violasPad: { sample: 'violas', volume: 0.06, attack: 2, release: 2.4, muffle: 1600, reverb: 0.7, pan: 0.2 },
    // The sea outside, a dull thud through the rock or the water.
    waves: { sample: 'seaWaves', volume: 0.12, ring: true, muffle: 500, reverb: 0.8 },
  },

  sections: {
    intro: fit('intro', {
      flame: flame(2),
      vibes: [...rest(1), ...sustained('Em', BAR, 2, 4)],
    }, 2),

    A: fit('A', {
      flame: flame(8),
      box: transpose(TUNE, 12),
      harp: arpeggio(A_CHORDS, BAR, 3, TURN),
      vibes: sustained(A_CHORDS, BAR, 0, 4),
      violasPad: [...rest(4), ...sustained('Am Am B B', BAR, 1, 3)],
      waves: scatter(8, BAR, [[3, 2, 'C4']]),
    }, 8),

    B: fit('B', {
      flame: flame(8),
      violas: TUNE,
      box: ANSWER,
      harp: arpeggio(B_CHORDS, BAR, 3, TURN),
      vibes: sustained(B_CHORDS, BAR, 2, 4),
      violasPad: sustained(B_CHORDS, BAR, 0, 3),
      waves: scatter(8, BAR, [[1, 5, 'D4'], [6, 0, 'C4']]),
    }, 8),

    still: fit('still', {
      flame: flame(4),
      vibes: sustained(STILL_CHORDS, BAR, 2, 4),
      harp: [...rest(3), ...arpeggio('B', BAR, 3, TURN)],
      waves: scatter(4, BAR, [[1, 0, 'C#4']]),
    }, 4),
  },

  order: ['intro', 'A', 'B', 'still'],
  loopFrom: 1,
};
