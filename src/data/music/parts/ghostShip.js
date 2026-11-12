// Shared pieces of the ghost ship's songs (not songs themselves: tools/serve.py
// only lists the files directly in src/data/music/). The ship is the brig Fair
// Return, which went down on the Wreck Yard's bar about a hundred years ago
// with Captain Tarry and all hands. Her crew are still aboard, still waiting to
// go home; the captain still writes "Day 41. Port tomorrow." in the log.
//
//   THE SHANTY, "Port Tomorrow": the crew's homeward song, the one they sang
//     at the capstan the night she went down. 3/4, C minor, sixteen bars in
//     four phrases, with the lilt of a capstan shanty (long, short, long:
//     "PORT - to-mor-row"). It opens on the chapter's coast cell (5 1 1 2,
//     G C C D here, parts/chapter5.js), so it belongs to the same sea.
//
//       1  C - - C D -  | Eb - - D C - | D - Bb - G - | G - - - G -
//       2  C - - C D -  | Eb - - - C' -| Bb - Ab - G -| G - - - - .
//       3  C' - - Bb Ab -| Ab - G - F - | Eb - F - G - | D - - - G -
//       4  C - - C D -  | Eb - - D C - | Bb - D - B -  | C - - - - .
//
//     Phrase 2's leap up a sixth (Eb to the high C) is the hope in it: home.
//     Phrase 4's crooked Bb then B natural is the bit everybody sings wrong,
//     and its last note, the low C, is PORT.
//
//   THE RULE: on the ship, nobody ever gets to that last C. The ghosts
//     remember the shanty wrong (notes missing, notes a semitone off, the
//     music box running flat and slowing down), and it always stops on the B,
//     a semitone short of home. Only the captain's fight lets it land, once,
//     and then he starts again ("one more tide").
//
//   THE CREW'S ANSWER: Eb D C (the shanty's second bar): "Aye, Captain".
//     The crew can only answer him with the notes of their own song.
//
// Chords, one a shanty bar: Cm Ab Eb G | Cm Ab Fm Eb | Ab Fm Cm G | Cm Ab G Cm.

import { melody, midi } from '../../../audio/notation.js';

export { melody, midi };

// The shanty as 8th-note tokens, six to a 3/4 bar (melody(text, steps) sets
// how long each token is).
export const SHANTY = [
  'C4 - - C4 D4 -   Eb4 - - D4 C4 -   D4 - Bb3 - G3 -   G3 - - - G3 -',
  'C4 - - C4 D4 -   Eb4 - - - C5 -    Bb4 - Ab4 - G4 -  G4 - - - - .',
  'C5 - - Bb4 Ab4 - Ab4 - G4 - F4 -   Eb4 - F4 - G4 -   D4 - - - G3 -',
  'C4 - - C4 D4 -   Eb4 - - D4 C4 -   Bb3 - D4 - B3 -   C4 - - - - .',
];
export const SHANTY_ALL = SHANTY.join('   ');
// The last phrase as the ghosts know it: it stops on the B. No port.
export const NO_PORT = 'C4 - - C4 D4 -   Eb4 - - D4 C4 -   Bb3 - D4 - B3 -   - - - - . .';
// The first two phrases remembered wrong: a note gone here and there, and
// the leap to home falling a semitone short (B instead of C).
export const GHOST_FIRST = [
  'C4 - - C4 D4 -   Eb4 - - D4 C4 -   D4 - . - G3 -     G3 - - - G3 -',
  'C4 - - . D4 -    Eb4 - - - B4 -    . - Ab4 - G4 -    G4 - - - - .',
].join('   ');

export const SHANTY_CHORDS = 'Cm Ab Eb G Cm Ab Fm Eb Ab Fm Cm G Cm Ab G Cm';
export const CREW_ANSWER = 'Eb4 D4 C4';

// Throws if any track of a section is not `steps` long: catches a miscounted
// bar when the song loads.
export function fit(song, name, section, steps) {
  for (const [track, notes] of Object.entries(section)) {
    if (notes.length !== steps) throw new Error(`${song} ${name}: '${track}' is ${notes.length} steps, not ${steps}`);
  }
  return section;
}

// Lay `parts` ([startStep, steps]) on a silent track `length` steps long.
export function lay(song, name, length) {
  return (...parts) => {
    const out = Array(length).fill('.');
    for (const [at, steps] of parts) {
      if (at + steps.length > length) throw new Error(`${song} ${name}: a part at step ${at} (${steps.length} steps) runs past ${length}`);
      steps.forEach((step, i) => { out[at + i] = step; });
    }
    return out;
  };
}

// Single notes or hits dropped in at given steps: [[step, 'C5'], [step, 'x']].
export function dots(length, events) {
  const out = Array(length).fill('.');
  for (const [at, what] of events) out[at] = what === 'x' ? 'x' : typeof what === 'number' ? what : midi(what);
  return out;
}

// A note held for `steps` steps.
export const hold = (note, steps) => [typeof note === 'number' ? note : midi(note), ...Array(steps - 1).fill('-')];

// Chords as written voicings: 'Eb4/G4/C5 D4/G4/B4' gives three tracks (low,
// middle, high), each note held `steps` steps, so a pad can be spread over
// three seats. Returns [low, middle, high].
export function voicings(text, steps) {
  const chords = text.split(/\s+/).filter(Boolean).map((c) => c.split('/'));
  return [0, 1, 2].map((v) => chords.flatMap((c) => hold(c[Math.min(v, c.length - 1)], steps)));
}
