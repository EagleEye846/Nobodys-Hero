import {
  melody, sustained, transpose, rest as restBars, held, heldNotes,
  tight, midi, scatter, LULLABY_OPENING,
} from './parts/chapter5.js';
import { patter, cells } from './parts/chapter3.js';

// "Half-Drowned Church": the theme of the Sunken Lanes, the roads and
// hamlets the sea has half taken, and most of all the hamlet's church, with
// water up to its altar rail and a lantern burning in a dry pocket under the
// surface. It is eerie and very quiet, and it has a hymn you can't get out
// of your head. Soft strings and a faint choir hold long chords like an
// organ; a harp rocks the same three notes like water slapping the pews;
// glass and glock drip; a soft horn sits low under it all. Nothing moves
// fast. Reference for the mood only: the submerged cathedral of Debussy,
// Hollow Knight's Fog Canyon and Resting Grounds, Dark Souls' quiet corners.
//
// THE HYMN (the hook): the church's own tune, sung slowly on bowed vibes
// with a glock an octave over it, like a music box left in the vestry. Its
// first two bars ARE Haddock's motif in its minor form (F E D, A: parts/
// chapter5.js), in his own rhythm (long, short, long, longer); then it
// climbs, G A C, E-D, and says the motif again a third lower, in B-flat
// major this time (D C B-flat, F: the comfortable form). So the place
// that drowned sings the lightman's tune, and nobody says why.
//
// THE LAMENT BASS: under the hymn the low harp walks down a half step at a
// time, D C# C B B-flat A G, G# A, like water rising a step at a time up
// the church steps. It is the second thing you remember.
//
// THE ORGAN KEY: one high A, held by the violins through the hymn, like an
// organ key somebody left down when the water came in. It never moves; the
// bass walking under it turns it into something new each bar: the fifth of
// D minor, the sixth over C, the major 7th over B-flat (the most beautiful
// and the most wrong), the 9th over G minor, and home on A, asking.
//
// THE WATER: a harp rocking A D F (the D minor chord, never changing) in a
// slow falling figure, F D A D, the shape of Haddock's motif again with its
// middle note left out. Over E-flat it turns Lydian and strange.
//
// THE ONE WRONG THING: in B a glass note holds E-flat high over D minor
// (the flat second, the storm's note), while the bass sinks to E-flat too.
//
// THE LULLABY SURFACES ONCE (section C): "Come In, Little Boat" (parts/
// chapter5.js, LULLABY_OPENING), its first four bars, at half speed on a
// bowed vibraphone with a long echo, as if a child's tune were being sung
// somewhere under the water and carried up. It is in the lullaby's own key
// (D minor) over its own chords. Then it drifts away on drops.
//
// THE PAYOFF (section D): the hymn at its fullest, the choir singing it,
// the violins with it, and under it the foghorn (a soft horn, low and
// muffled, like a foghorn heard through water) plays the first two bars two
// octaves down: Haddock's motif, out loud at last. Then the harp answers it
// over G minor, and the organ key is left alone.
//
// D minor, 4/4 at 58 (a bar is about 4.1 seconds); one step a beat third,
// 12 to a bar. The intro plays once (2 bars); then it loops from A, 42
// bars, about 2m54s:
//
//   intro   2 bars  a drop, a held low horn, the organ key, the water
//   A       8 bars  THE HYMN on vibes and glock over the lament bass and the
//                   organ key: D minor, C, B-flat, G minor, A
//   A2      8 bars  the hymn again on the choir, a solo violin above it, the
//                   violins warm; it comes home to D this time
//   B       8 bars  the outside: a new tune on the solo violin, the bass
//                   sinks to E-flat under the glass E-flat; strings swell to
//                   the fullest they get, then ebb
//   C       8 bars  THE LULLABY, half speed, from under the water; then the
//                   drops thin to nothing
//   D       8 bars  THE PAYOFF: the hymn fullest, and the foghorn under it
//                   plays Haddock's motif; the harp answers in G minor
//   E       2 bars  the organ key again, alone over A, open to loop round

const BAR = 12;
const rest = (bars) => restBars(bars, BAR);
const fit = (name, section, bars) => tight('Half-Drowned Church', name, section, bars, BAR);
const quarters = (text) => melody(text, 3);   // each token a beat: 4 to a bar

// --- Harmony, a bar each, and the lament bass that walks under it ---
const A_CHORDS = 'Dm Dm C C Bb Bb Gm A';
const A_BASS = quarters(`
  D3 - A2 -   D3 - C#3 -   C3 - G2 -   C3 - B2 -
  Bb2 - F2 -  Bb2 - A2 -   G2 - G#2 -  A2 - E3 -
`);
const HOME_CHORDS = 'Dm Dm C C Bb Gm A Dm';
const HOME_BASS = quarters(`
  D3 - A2 -   D3 - C#3 -   C3 - G2 -   C3 - B2 -
  Bb2 - A2 -  G2 - G#2 -   A2 - E3 -   D3 - A2 -
`);
const B_CHORDS = 'Bb Bb Gm Gm Dm Eb Dm A';
const B_BASS = quarters(`
  Bb2 - F2 -  Bb2 - A2 -   G2 - D3 -   G2 - A2 -
  D3 - A2 -   Eb3 - Bb2 -  D3 - A2 -   A2 - E3 -
`);
const C_CHORDS = 'Dm Bb Gm A Dm Dm Bb Bb';
const C_BASS = 'D3 Bb2 G2 A2 D3 D3 Bb2 Bb2';
const D_CHORDS = HOME_CHORDS;

// --- THE HYMN: Haddock's motif (minor), a climb, the motif in B-flat major,
// and up to hang on E. The second time it comes home to D. ---
const HYMN = quarters(`
  F5 - E5 D5   - - A4 -    G4 - A4 C5   E5 - - D5
  D5 - C5 Bb4  - - F4 -    G4 - Bb4 D5  E5 - - -
`);
const HYMN_HOME = quarters(`
  F5 - E5 D5   - - A4 -    G4 - A4 C5   F5 - - E5
  D5 - C5 Bb4  Bb4 - A4 G4 E5 - - C#5   D5 - - -
`);
// The solo violin's descant over the choir in A2: long notes above.
const DESCANT = quarters(`
  A5 - - -     A5 - G5 A5   G5 - - -     G5 - A5 G5
  F5 - - -     D5 - - -     A5 - - G5    F5 - - -
`);
// The outside: a new tune, climbing to the E-flat bar and falling back.
const OUTSIDE = quarters(`
  F5 - - D5    C5 - D5 F5   G5 - - D5    Bb4 - C5 D5
  A5 - - F5    G5 - Bb5 -   A5 - - -     - - G5 E5
`);
// The lullaby at half speed: each of its 8ths lasts two steps.
const LULLABY_SLOW = melody(LULLABY_OPENING, 2);

// Haddock's motif on the foghorn, two octaves under the hymn and in its
// rhythm; then the same shape in B-flat major, under the hymn's bar 5.
const FOGHORN = quarters(`
  F3 - E3 D3   - - A2 -    . . . .      . . . .
  D3 - C3 Bb2  - - F2 -    . . . .      . . . .
`);
// The harp answers over G minor at the end of the payoff: Bb A G, D.
const HARP_ANSWER = [...rest(6), ...quarters('Bb4 - A4 G4   - - D4 -')];

// --- The water: A D F on the harp, falling F D A D, every bar. ---
const WATER_CELL = 'A4 D5 F5';
const WATER = [2, '.', '.', 1, '.', '.', 0, '.', '.', 1, '.', 2];
const water = (bars) => patter(cells(WATER_CELL, bars), WATER);

// The low held voices (horn, choir) sit on each chord's fifth, not its
// root: the lament bass steps down a half step under the root halfway
// through most bars, and a held root right on top of it would grind.
const FIFTHS_A = 'A2 A2 G2 G2 F2 F2 D2 E2';
const FIFTHS_HOME = 'A2 A2 G2 G2 F2 D2 E2 A2';
// The violas' third, but G (not E) under the hymn's long F in bar 4 of the
// home verse, which leans on F before it falls to E.
const violasHome = () => sustained(HOME_CHORDS, BAR, 1, 3).map((n, i) => (n === 52 && Math.floor(i / BAR) === 3 ? 55 : n));

export const LANES_THEME = {
  title: 'Half-Drowned Church',
  bpm: 58,
  stepsPerBeat: 3,
  volume: 1.25,

  instruments: {
    violas: { sample: 'violas', volume: 0.14, attack: 1.4, release: 1.8, reverb: 0.7, pan: -0.2 },
    violins: { sample: 'violins', volume: 0.09, attack: 1.6, release: 2.0, muffle: 4200, reverb: 0.75, pan: 0.25 },
    // The violins on the hymn in the payoff.
    violinsHymn: { sample: 'violins', volume: 0.1, attack: 0.4, release: 1.2, muffle: 3800, reverb: 0.75, pan: 0.2 },
    // The organ key: one A, held.
    key: { sample: 'violins', volume: 0.07, attack: 2.4, release: 2.6, muffle: 3600, reverb: 0.8, pan: 0.1 },
    choir: { sample: 'choir', volume: 0.09, attack: 1.6, release: 2.0, muffle: 2800, reverb: 0.8, pan: 0 },
    // The choir singing the hymn.
    sing: { sample: 'choir', volume: 0.2, attack: 0.5, release: 1.4, muffle: 3000, reverb: 0.8, pan: -0.05, humanize: { time: 0.015, volume: 0.08 } },
    horn: { sample: 'hornsSoft', volume: 0.09, attack: 1.4, release: 2.0, muffle: 2000, reverb: 0.7, pan: -0.1 },
    // Haddock's motif, a foghorn through water.
    foghorn: { sample: 'hornsSoft', volume: 0.14, attack: 0.5, release: 1.6, muffle: 1600, reverb: 0.75, pan: -0.15 },
    // The lament bass on a low harp, and the water rocking above it.
    bass: { sample: 'harp', volume: 0.18, ring: true, reverb: 0.6, pan: -0.15, humanize: { time: 0.015, volume: 0.12 } },
    water: { sample: 'harp', volume: 0.11, ring: true, muffle: 4000, reverb: 0.75, pan: -0.3, humanize: { time: 0.02, volume: 0.2 } },
    harpMotif: { sample: 'harp', volume: 0.15, ring: true, reverb: 0.8, pan: 0.3, humanize: { time: 0.02, volume: 0.15 } },
    drop: { sample: 'glock', volume: 0.07, ring: true, reverb: 0.8, pan: 0.35, echo: { time: 0.55, feedback: 0.35, mix: 0.3 } },
    glass: { sample: 'glass', volume: 0.07, attack: 1.4, release: 2.4, reverb: 0.85, pan: 0.3 },
    // The hymn: bowed vibes, and a glock an octave over it like a music box.
    hymn: { sample: 'vibesBowed', volume: 0.15, attack: 0.3, release: 1.2, reverb: 0.8, pan: 0.2, echo: { time: 0.52, feedback: 0.25, mix: 0.18 } },
    box: { sample: 'glock', volume: 0.05, ring: true, muffle: 5000, reverb: 0.8, pan: 0.3, humanize: { time: 0.015, volume: 0.15 } },
    // A solo violin, high and far: the descant, and the outside tune.
    voice: { sample: 'soloViolin', volume: 0.15, attack: 0.5, release: 1.4, muffle: 4500, reverb: 0.75, pan: 0.1, humanize: { time: 0.015, volume: 0.1 } },
    // The lullaby, from under the water.
    under: { sample: 'vibesBowed', volume: 0.14, attack: 0.15, release: 1.4, reverb: 0.9, pan: -0.1, echo: { time: 0.75, feedback: 0.45, mix: 0.4 } },
    underHum: { sample: 'choir', volume: 0.06, attack: 0.8, release: 1.6, muffle: 2400, reverb: 0.9 },
    bell: { sample: 'chimes', volume: 0.08, ring: true, muffle: 3000, reverb: 0.85, pan: -0.4 },
  },

  sections: {
    intro: fit('intro', {
      key: held('A5', 2 * BAR),
      horn: heldNotes('D3 D3', BAR),
      water: [...rest(1), ...water(1)],
      drop: scatter(2, BAR, [[0, 5, 'D6'], [1, 8, 'A6']]),
    }, 2),

    // THE HYMN on vibes and glock, the lament bass, the organ key.
    A: fit('A', {
      hymn: HYMN,
      box: transpose(HYMN, 12),
      key: held('A5', 8 * BAR),
      bass: A_BASS,
      water: water(8),
      violas: sustained(A_CHORDS, BAR, 1, 3),
      horn: heldNotes(FIFTHS_A, BAR, 1),
      drop: scatter(8, BAR, [[1, 4, 'F6'], [3, 7, 'D7'], [5, 10, 'A6'], [7, 8, 'F6']]),
    }, 8),

    // The hymn on the choir, the solo violin's descant over it; home to D.
    A2: fit('A2', {
      sing: HYMN_HOME,
      hymn: [...rest(4), ...HYMN_HOME.slice(4 * BAR)],
      voice: DESCANT,
      bass: HOME_BASS,
      water: water(8),
      violas: violasHome(),
      violins: [...rest(2), ...sustained('C C Bb Gm A Dm', BAR, 2, 4)],
      choir: heldNotes(FIFTHS_HOME, BAR, 1),
      horn: heldNotes(FIFTHS_HOME, BAR, 1),
      bell: scatter(8, BAR, [[0, 0, 'D5'], [4, 0, 'A4']]),
      drop: scatter(8, BAR, [[2, 6, 'A6'], [6, 3, 'D7']]),
    }, 8),

    // The outside: the new tune; the strings swell to their fullest at the
    // E-flat, then ebb.
    B: fit('B', {
      voice: OUTSIDE,
      bass: B_BASS,
      water: water(8),
      violas: sustained(B_CHORDS, BAR, 0, 3),
      violins: [...rest(2), ...sustained('Gm Gm Dm Eb Dm', BAR, 1, 4), ...rest(1)],
      choir: sustained(B_CHORDS, BAR, 2, 4),
      horn: heldNotes('Bb1 F2 G1 G1 D2 Eb2 D2 A1', BAR, 1),
      // The wrong thing: E-flat held high, over the bass's E-flat and on.
      glass: [...rest(5), midi('Eb6'), ...Array(BAR * 2 - 1).fill('-'), ...rest(1)],
      drop: scatter(8, BAR, [[0, 3, 'D7'], [2, 6, 'F6'], [3, 10, 'A6'], [7, 9, 'A6']]),
      bell: scatter(8, BAR, [[3, 0, 'A4']]),
    }, 8),

    // THE LULLABY, from under the water; then the drops thin out.
    C: fit('C', {
      under: [...LULLABY_SLOW, ...rest(4)],
      underHum: [...rest(4), ...transpose(LULLABY_SLOW, -12).slice(0, 2 * BAR), ...rest(2)],
      water: [...water(4), ...rest(4)],
      violas: sustained(C_CHORDS, BAR, 1, 3),
      horn: heldNotes(C_BASS, BAR),
      drop: scatter(8, BAR, [[2, 9, 'A6'], [5, 3, 'F6'], [6, 8, 'D7'], [7, 4, 'A6']]),
    }, 8),

    // THE PAYOFF: the hymn on the choir, the violins and the vibes, the
    // foghorn under it playing Haddock's motif; the harp answers at the end.
    D: fit('D', {
      sing: HYMN_HOME,
      violinsHymn: HYMN_HOME,
      hymn: HYMN_HOME,
      box: transpose(HYMN_HOME, 12),
      foghorn: FOGHORN,
      harpMotif: HARP_ANSWER,
      key: [...held('A5', 4 * BAR), ...rest(4)],
      bass: HOME_BASS,
      water: water(8),
      violas: violasHome(),
      violins: sustained(D_CHORDS, BAR, 2, 4),
      choir: heldNotes(FIFTHS_HOME, BAR, 1),
      horn: [...rest(2), ...heldNotes('G2 G2', BAR, 1), ...rest(2), ...heldNotes('A1 D2', BAR, 1)],
      bell: scatter(8, BAR, [[0, 0, 'D5'], [6, 0, 'E5']]),
    }, 8),

    // The organ key, alone over A; open, back round.
    E: fit('E', {
      key: held('A5', 2 * BAR),
      violas: held('E3', 2 * BAR),
      horn: held('A2', 2 * BAR),
      water: [...water(1), ...rest(1)],
      drop: scatter(2, BAR, [[1, 3, 'A6']]),
    }, 2),
  },

  order: ['intro', 'A', 'A2', 'B', 'C', 'D', 'E'],
  loopFrom: 1,
};
