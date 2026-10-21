// Shared pieces of Chapter 3's songs (not songs themselves: tools/serve.py
// only lists the files directly in src/data/music/). The chapter's motifs,
// and the little helpers its songs are written with. Chapter 3 is "The
// Search" (notes/docs/chapter-3-the-search.md): the hero, alone, looking for Ves
// across the Pinefall, the Lantern Marsh and the Hollow Valley. So its
// music keeps reaching for tunes the player already knows and finding them
// changed, or missing:
//
//   THE WALTZ: the Pinefall's tune ("The Scarlet Waltz", pinefallTheme.js),
//     D minor, 3/4: A D F, E D, Bb D G, F E... Its battle theme crams the
//     same notes into 4/4; the Beast's hunt plays it in 6/8 at double speed.
//   THE HERO'S FIFTH: his own tune from "Updraft" (mountainBattleTheme.js):
//     D up to A, like looking up the mountain. In this chapter he looks
//     down it. On the mountain Ves answered it; here, nobody does.
//   HER MOTIF: C C, up to A, Bb G A ("Carried on the Wind", vesTheme.js).
//     Never played heroically before the end: a music box far off, the
//     tender D minor form, the G minor grief form. The whole chapter is
//     looking for her, and so is the music.
//   THE FANFARE: the Long Stair's tune (stairTheme.js), the heralds' fanfare
//     for the Hero. The Hollow Valley was where the prophecy was meant to
//     end, so its ruins play the fanfare fallen into B minor, and the Gate
//     plays it as a stone chorale.
//   THE PROPHECY: "Once, a Promise" (prophecyTheme.js), A minor: E A C B A G.
//     The inscriptions on the Hero's Gate.
//   THE LANTERN: the hut dream's warped music box (lanternTheme.js), a tune
//     that keeps slipping a half step over a tritone drone. The marsh
//     borrows a scrap of it: lanterns leading travellers somewhere.
//   THE BEAST (new): a minor third and a tritone, G Bb C#, then the pounce
//     up to D. Claws.
//   THE WARDEN (new): a fourth falling, D down to A, and a half step that
//     says no: Eb D. A monument measuring you and finding you wanting.

import { melody, midi, hits, repeat, transpose, arpeggio } from '../../../audio/notation.js';
import { VES_MOTIF } from '../vesTheme.js';

export const BAR = 16;                             // one step is a 16th note (4/4)
export const tune = (text) => melody(text, 2);     // each token an 8th note
export const riff = (text) => melody(text, 1);     // each token a 16th note
export const rest = (bars, bar = BAR) => Array(bars * bar).fill('.');
export const held = (note, steps) => [typeof note === 'number' ? note : midi(note), ...Array(steps - 1).fill('-')];
export { midi, hits, repeat, transpose };

// One `pattern` (semitones above it, '.' and '-' as usual) on each named
// note: for basslines that aren't chord roots.
export const onNotes = (names, pattern) => names.split(/\s+/).filter(Boolean).flatMap((name) => pattern.map((p) => (typeof p === 'number' ? midi(name) + p : p)));
// Each named note held for `steps` steps.
export const heldNotes = (names, steps, octaveShift = 0) => names.split(/\s+/).filter(Boolean).flatMap((name) => held(midi(name) + 12 * octaveShift, steps));
// Silences the last `steps` of a track (the beat of nothing before a drop).
export const cut = (track, steps = 4) => [...track.slice(0, track.length - steps), ...Array(steps).fill('.')];
// Every track of a section cut the same way: the whole band stops dead.
export const stopdown = (section, steps = 4) => Object.fromEntries(Object.entries(section).map(([name, track]) => [name, cut(track, steps)]));
// A track that sits out its first `bars` bars.
export const after = (bars, track, bar = BAR) => [...rest(bars, bar), ...track.slice(bars * bar)];
// A track that plays only its first `bars` bars, then sits out.
export const until = (bars, track, bar = BAR) => [...track.slice(0, bars * bar), ...rest(track.length / bar - bars, bar)];
// A pattern for `bars` bars, with `fill` on every `n`th bar.
export const fills = (pattern, fill, bars, n) => Array.from({ length: bars }, (_, i) => ((i + 1) % n === 0 ? fill : pattern)).flat();
// Every `n`th bar starts with a hit.
export const every = (bars, n, bar = BAR, first = 0) => Array.from({ length: bars }, (_, i) => (i % n === first % n ? ['x', ...Array(bar - 1).fill('.')] : Array(bar).fill('.'))).flat();
// A hit on the first step of a `bars`-bar stretch, then nothing.
export const once = (bars, bar = BAR) => ['x', ...Array(bars * bar - 1).fill('.')];

// --- The motifs, in their home keys (one token an 8th). ---
// The hero's fifth: D up to A, a turn, and down (the first two bars of his
// "Updraft" tune).
export const HERO_CALL = 'D5 - A5 - - G5 A5 C6 | Bb5 - A5 - F5 - D5 -';
// Her motif, tender, in D minor (the half-speed form her own theme names).
export const HERS_TENDER_DM = transpose(VES_MOTIF, -3); // A4 A4 F5, G5 E5 F5
// Her motif, grieving, in G minor (the lantern scene's form).
export const HERS_GRIEF_GM = 'D5/D5 Bb5 - - C6 A5 Bb5 -';
// The Long Stair's fanfare, in D major (the first phrase).
export const FANFARE_D = 'A4 - D5 - F#5 - A5 - | G5 - - E5 C#5 - E5 - | F#5 - - - D5 - B4 - | D5 - - - - - . .';
// The prophecy's tune, A minor (one token an 8th: the music box's first line).
export const PROPHECY_AM = '. . E5 - - - A5 - | C6 - - - B5 - A5 - | G5 - - - - - . . | . . E5 - G5 - C6 -';
// The Beast: a minor third, a tritone, and the pounce.
export const BEAST = 'G3 - Bb3 - C#4 - | D4 - - - - -';   // 6/8, one token an 8th
// The Warden: a falling fourth, and no.
export const WARDEN = 'D4 - - - A3 - - - | Eb4 - - - D4 - - -';

// --- Drums shared by the chapter's fights. ---
export const HIT = hits('x....... ........');
export const BUILD_8THS = hits('x.x.x.x. x.x.x.x.');
export const BUILD_16THS = hits('xxxxxxxx xxxxxxxx');
export const FILL = hits('x.x.xxxx xxxxxxxx');

// --- The chapter's sound: Hollow Knight's City of Tears (Christopher
// Larkin; notes/hollow-knight-music-research.md). One small figure, a stack
// of fifths, falls like rain all the way through a piece and never changes;
// the bass moves under it, so the same three notes keep turning into new
// chords (sus2, add9, 6/9, maj7#11). The tune sits on top in long notes on
// those colours (the major 7th, the 9th) and seldom comes home. Rolling
// 12/8 at about 60 dotted quarters a minute; a close piano or harp for the
// rain, strings and a voice swelling over it when you step outside.
export const BAR_128 = 12;                         // a bar of 12/8 (stepsPerBeat 3: one step an 8th)
export const slow = (text) => melody(text, 3);     // each token a dotted quarter (4 to a 12/8 bar)
export const eighths = (text) => melody(text, 1);  // each token an 8th in 12/8

// The rain: one `cell` of notes ('D5 A5 E6') a bar, played in `shape`
// (indices into the cell, '.' and '-' as usual, one entry per step).
export const patter = (cells, shape) => cells.flatMap((cell) => {
  const notes = cell.split(/\s+/).filter(Boolean).map(midi);
  return shape.map((s) => (typeof s === 'number' ? notes[s] : s));
});
// The same cell for `bars` bars.
export const cells = (cell, bars) => Array(bars).fill(cell);
// A cell per chord, from a table, with `fallback` for the rest: for the few
// bars where the rain has to move a note out of the melody's way.
export const cellsFor = (chords, table, fallback) => chords.split(/\s+/).filter(Boolean).map((c) => table[c] ?? fallback);

// Water: now and then, on a step that's a multiple of `every`, one high
// chord tone, left to ring. Seeded, so it falls the same way every time.
export function drops(chords, bar, chance, seed, every = 2) {
  let s = seed >>> 0;
  const rand = () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296;
  const notes = arpeggio(chords, bar, 6, [0, 7, 'third', 12, 7, 0, 'third', 7]);
  return notes.map((note, i) => (i % every === 0 && rand() < chance ? note : '.'));
}
