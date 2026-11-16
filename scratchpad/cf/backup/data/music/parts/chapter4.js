// Shared pieces of Chapter 4's songs (not songs themselves: tools/serve.py
// only lists the files directly in src/data/music/). Chapter 4 is "The
// First": above the fields it's sunny, then the ground gives way and the
// hero and Ves land in a buried kingdom whose folk remember a Hero who came
// once, long ago, and went back up the stair. So the whole chapter shares
// one small tune, the four notes of that visit:
//
//   THE FIRST CELL: up a fourth, up a third, and a step back down. In D
//     major, A D F# E (5, 1, 3, 2 of the scale). It asks a question and
//     doesn't finish: the Hero came, and... Plain and bright in Sunnyside
//     ("Where the Buttercups Are"), glittering on bells in the Glimmering,
//     a jaunty town tune in Belowtown, and (for the later songs) it can go
//     minor, drop into the dark, or be played too slowly. Every form below
//     is the same four intervals; only the key, the speed and the colour
//     change.
//
// cellIn('G4') gives the cell in the key whose tonic is that note, as note
// numbers (D4 G4 B4 A4). Put them into a bar however the song needs.

import { midi } from '../../../audio/notation.js';

export { melody, midi, hits, repeat, transpose, arpeggio, sustained, chordLine } from '../../../audio/notation.js';
export { rest, held, until, after, every, fills, onNotes, heldNotes, stopdown, once, BAR as BAR_44, BAR_128 } from './chapter3.js';

// The cell in D major, as written in "Where the Buttercups Are".
export const FIRST_CELL = 'A4 D5 F#5 E5';
// The same four notes as semitones from the key's tonic: 5, 1, 3, 2.
export const FIRST_STEPS = [-5, 0, 4, 2];
// Its minor form (the third flattened), for the darker songs.
export const FIRST_STEPS_MINOR = [-5, 0, 3, 2];

// The cell as four note numbers in the key whose tonic is `tonic` ('G4').
export const cellIn = (tonic, steps = FIRST_STEPS) => steps.map((s) => midi(tonic) + s);
