// Shared pieces of Chapter 5's songs (not songs themselves: tools/serve.py
// only lists the files directly in src/data/music/). Chapter 5 is "The Tide
// Held": a bright beach, then a green storm, an old walrus lightman called
// Haddock, and the boy he raised, Corrie, who became the storm. Three tunes
// tie the whole chapter together. Reuse them; change the key, the speed and
// the colour, never the shape.
//
//   THE COAST CELL (A D D E in D minor): up a fourth to the tonic, then a
//     step up. The first bar of the coast fights ("Salt in the Wound", both
//     versions). It is the sea's tune: in the Wrack Shore it creeps in on a
//     flute; in the storm music it can be played hard, slowed, or turned
//     upside down. 5, 1, 1, 2 of the scale.
//
//   HADDOCK'S MOTIF (3 2 1, then down to 5): four notes, a slow plod that
//     sinks to a low note like a foghorn. In D major: F# E D, A (the A is a
//     fifth BELOW the D). In D minor the first note drops a semitone: F E D,
//     A. That one flat note is the whole difference between Haddock
//     comfortable and Haddock sad; use the major form when he is jolly or
//     the town is humming, the minor form for the Lanes, the farewell and
//     the last section of the boss. Nothing else about it changes. In
//     "Minding the Light" it is the song; in "Bunting" it is hidden once;
//     in "Salt and Rope" it is the little town tune (it sits on every
//     chord in turn); the boss brings it back, and the farewell plays it
//     alone on a harp. It has no leap bigger than a fifth, so it can be
//     hummed, whistled or played on a bell. Rhythm: long, short, long,
//     longer (HADDOCK_LENGTHS: 2 1 3 2 in 8ths, or 4 2 4 2 in 3/4 16ths).
//
//   THE LULLABY, "Come In, Little Boat" (Corrie's, which Haddock hums):
//     6/8, D minor then a lift into F major and back. Two 8-bar halves; the
//     first four bars (LULLABY_OPENING) are the part everyone remembers:
//     F A D / D C Bb / A G F / E (it stops on the fifth, asking). The boss
//     twists it into the storm: the same notes, but harder, in 4/4, the
//     lift into F turned to a siren, the last note never landing. The Lanes
//     let it float up once from under the water, slow.
//
// haddockPhrase('D5') gives the four notes (major) as steps for a track;
// haddockPhrase('D5', { minor: true }) gives the minor form.

import { midi, melody } from '../../../audio/notation.js';

export { melody, midi, hits, repeat, transpose, arpeggio, sustained, chordLine } from '../../../audio/notation.js';
export { rest, held, until, after, every, fills, onNotes, heldNotes, stopdown, once } from './chapter3.js';

// ---------------------------------------------------------------- the cell
// A D D E in D minor, as 8th-note tokens for melody(text, 2).
export const COAST_CELL = 'A4 D5 D5 E5';
// The same, as semitones from the key's tonic: 5, 1, 1, 2.
export const COAST_STEPS = [-5, 0, 0, 2];

// --------------------------------------------------------- Haddock's motif
// Semitones from the tonic: the 3rd, the 2nd, the tonic, then the 5th below.
export const HADDOCK_STEPS = [4, 2, 0, -5];
export const HADDOCK_STEPS_MINOR = [3, 2, 0, -5];
// How long each note lasts, in 8ths: long, short, long, longer (8 = one
// 4/4 bar of 8ths).
export const HADDOCK_LENGTHS = [2, 1, 3, 2];
// In D, as note names (D5 is the tonic): F#5 E5 D5 A4.
export const HADDOCK_D_MAJOR = 'F#5 E5 D5 A4';
export const HADDOCK_D_MINOR = 'F5 E5 D5 A4';

// The motif in the key whose tonic is `tonic` ('G4'), as note numbers.
export const haddockNotes = (tonic, { minor = false } = {}) => (minor ? HADDOCK_STEPS_MINOR : HADDOCK_STEPS).map((s) => midi(tonic) + s);

// The motif laid out as steps for a track: each note held `lengths[i] *
// unit` steps (unit 2 means the lengths are 8ths on a 16th-note grid; unit
// 1 means they are steps). Default fills 8 eighth-steps of a 4/4 bar's half.
export function haddockPhrase(tonic, { minor = false, lengths = HADDOCK_LENGTHS, unit = 2 } = {}) {
  const out = [];
  haddockNotes(tonic, { minor }).forEach((note, i) => {
    out.push(note);
    for (let k = 1; k < lengths[i] * unit; k++) out.push('-');
  });
  return out;
}

// ------------------------------------------------------------ the lullaby
// 6/8, one token an 8th, six tokens to a bar. D minor, then F major.
// Chords, one a bar:
export const LULLABY_A_CHORDS = 'Dm Bb Gm A Dm Bb Gm Dm';
export const LULLABY_B_CHORDS = 'F C Dm Bb F C A Dm';
// The first four bars: the part to hum.
export const LULLABY_OPENING = `
  F4 - - A4 - D5   D5 - - C5 - Bb4
  A4 - - G4 - F4   E4 - - - - .
`;
// The whole first half (the opening, then it answers and comes home to D).
export const LULLABY_A = `
  F4 - - A4 - D5   D5 - - C5 - Bb4
  A4 - - G4 - F4   E4 - - - - .
  F4 - - A4 - D5   F5 - - E5 - D5
  Bb4 - - A4 - G4  F4 - E4 D4 - -
`;
// The lift into F major.
export const LULLABY_B = `
  A4 - - C5 - F5   E5 - - D5 - C5
  D5 - - C5 - A4   Bb4 - - A4 - G4
  A4 - - C5 - F5   G5 - - F5 - E5
  E5 - - C#5 - A4  D5 - - - - .
`;
export const lullaby = (text) => melody(text, 1);   // 1 step an 8th (6 a bar)

// ------------------------------------------------------------------ tools
// Throws if any track of a section is not exactly `bars` bars of `bar`
// steps: catches a miscounted bar before the song plays.
export function tight(song, name, section, bars, bar) {
  for (const [track, steps] of Object.entries(section)) {
    if (steps.length !== bars * bar) throw new Error(`${song} ${name}: '${track}' is ${steps.length} steps, not ${bars} bars (${bars * bar})`);
  }
  return section;
}

// A track of single notes dropped in at given places, nothing else: water
// drops, far bells. `events` are [bar, step, 'D6'] with bars counted from 0.
export function scatter(bars, bar, events) {
  const out = Array(bars * bar).fill('.');
  for (const [b, step, name] of events) out[b * bar + step] = midi(name);
  return out;
}
