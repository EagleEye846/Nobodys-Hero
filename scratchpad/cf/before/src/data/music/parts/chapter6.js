// Shared pieces of Chapter 6's songs (not songs themselves: tools/serve.py
// only lists the files directly in src/data/music/). Chapter 6 is the ash
// wastes: a land that was green about a hundred years ago and burned, and
// is still smouldering. Grey ash lying like snow, footprints that fill back
// in, embers drifting up out of cracks, ash storms that hide the path, and
// an old town somewhere ahead, buried to its eaves.
//
//   THE EMBER CELL (1 2 b3 5, then the b6 falling to 5): up three steps and
//     a leap, like an ember lifting off the ground, and a half step down,
//     like it going out. In F# minor: F# G# A C#, D C#. It opens the area
//     song's hook ("Footprints Fill In", ashTheme.js), where it drifts on a
//     music box in 3/4; the fights cram it into 4/4 and push it ("Ash in the
//     Teeth", ashBattleTheme.js); the first mini-boss re-bars the whole hook
//     as its second theme ("Under the Drift", ashMinibossTheme.js). The
//     half step at the end is the whole chapter's sigh: keep it. Change the
//     key, the speed, the metre; never land the last note anywhere but the
//     fifth.
//
//   THE CREEPING BASS: the Keeper's half-step walk down ("Minding the Fire",
//     keeperTheme.js) turns up once under the ash storm in the area song, as
//     if somebody had walked this way ahead of you. Only the bass, only for
//     a few bars, never his tune.
//
// emberNotes('F#4') gives the six notes; ASH_HOOK is the area hook as text
// for melody(text, 2) (one token an 8th, six to a 3/4 bar).

import { midi } from '../../../audio/notation.js';

export { melody, midi, hits, repeat, transpose, arpeggio, sustained, chordLine } from '../../../audio/notation.js';
export { rest, held, until, after, every, fills, onNotes, heldNotes, stopdown, once, drops } from './chapter3.js';
export { tight, scatter } from './chapter5.js';

// Semitones from the tonic: 1, 2, b3, 5, then b6 down to 5.
export const EMBER_STEPS = [0, 2, 3, 7, 8, 7];
export const emberNotes = (tonic) => EMBER_STEPS.map((s) => midi(tonic) + s);

// The area hook, F# minor, 3/4, eight bars (the first time it hangs on C#).
export const ASH_HOOK = `
  F#4 - G#4 A4 C#5 - | D5 - - C#5 - - | B4 - A4 G#4 - A4 | E4 - - - - . |
  F#4 - G#4 A4 C#5 - | E5 - - D5 - C#5 | B4 - D5 C#5 - A4 | G#4 - - - - . |
`;
// Its chords, a bar each.
export const ASH_HOOK_CHORDS = 'F#m D Bm A F#m D Bm C#';
