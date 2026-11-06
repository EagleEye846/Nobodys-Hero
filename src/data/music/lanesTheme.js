import {
  melody, arpeggio, sustained, chordLine, transpose, rest as restBars,
  tight, midi, scatter, LULLABY_OPENING,
} from './parts/chapter5.js';

// "Half-Drowned Church": the theme of the Sunken Lanes, the roads and
// hamlets the sea has half taken, and most of all the hamlet's church, with
// water up to its altar rail and a lantern burning in a dry pocket under the
// surface. It is eerie and very quiet. Soft strings and a faint choir hold
// long chords like an organ somebody left a key down on; a harp lets a note
// fall every few seconds; glass bells drip; a quiet horn sits under it all.
// Nothing moves fast. The harmony is D minor with a flat second (Eb) held
// high on glass in the second part, the one thing in it that is wrong.
// Reference for the mood only: the submerged cathedral of Debussy, Hollow
// Knight's Fog Canyon, Dark Souls' quiet corners.
//
// THE LULLABY SURFACES ONCE (section C): "Come In, Little Boat" (parts/
// chapter5.js, LULLABY_OPENING), its first four bars, at half speed on a
// bowed vibraphone with a long echo, as if a child's tune were being sung
// somewhere under the water and carried up. It is in the lullaby's own key
// (D minor) over its own chords (D minor, B-flat, G minor, A). Then it
// drifts away on drops and does not come back.
//
// D minor, 4/4 at 52 (a bar is about 4.6 seconds); one step a beat third,
// 12 to a bar. The intro plays once (2 bars); then it loops from A, 30
// bars, about 2m18s:
//
//   intro   2 bars  a drop, a held low horn, the water
//   A       8 bars  the organ chords (violas, violins, choir) in D minor and
//                   B-flat, G minor, A; a harp note falls now and then
//   B       8 bars  a slow hymn on a flute-like glass line; the choir
//                   moves; the high Eb on glass hangs over it
//   C       8 bars  THE LULLABY, half speed, from under the water; then the
//                   drops thin to nothing
//   D       6 bars  the organ chords again, thinner; the A major open to
//                   loop back round

const BAR = 12;
const rest = (bars) => restBars(bars, BAR);
const fit = (name, section, bars) => tight('Half-Drowned Church', name, section, bars, BAR);

// --- Harmony, a bar each ---
const A_CHORDS = 'Dm Dm Bb Bb Gm Gm A A';
const B_CHORDS = 'Bb Bb Gm Gm Dm Dm A A';
const C_CHORDS = 'Dm Bb Gm A Dm Dm Bb Bb';
const D_CHORDS = 'Dm Dm Bb Gm A A';
const INTRO_CHORDS = 'Dm Dm';

// A hymn, half a bar a note (6 steps).
const HYMN = melody(`
  D5 F5   D5 Bb4  Bb4 D5  C5 A4
  A4 F4   F4 A4   C#5 E5  A4 -
`, 6);
// The lullaby at half speed: each of its 8ths lasts two steps.
const LULLABY_SLOW = melody(LULLABY_OPENING, 2);

const pedal = (chords, octave = 3) => sustained(chords, BAR, 0, octave);
const SLOWHARP = [0, '-', '-', '-', '-', '-', 7, '-', '-', '-', '-', '-'];
const slowHarp = (chords) => arpeggio(chords, BAR, 3, SLOWHARP);

export const LANES_THEME = {
  title: 'Half-Drowned Church',
  bpm: 52,
  stepsPerBeat: 3,
  volume: 1.3,

  instruments: {
    violas: { sample: 'violas', volume: 0.16, attack: 1.4, release: 1.8, reverb: 0.7, pan: -0.2 },
    violins: { sample: 'violins', volume: 0.1, attack: 1.6, release: 2.0, reverb: 0.75, pan: 0.25 },
    choir: { sample: 'choir', volume: 0.09, attack: 1.6, release: 2.0, reverb: 0.8, pan: 0 },
    horn: { sample: 'hornsSoft', volume: 0.1, attack: 1.4, release: 2.0, reverb: 0.7, pan: -0.1 },
    harp: { sample: 'harp', volume: 0.18, ring: true, reverb: 0.75, pan: -0.3, humanize: { time: 0.02, volume: 0.2 } },
    drop: { sample: 'glock', volume: 0.1, ring: true, reverb: 0.8, pan: 0.35, echo: { time: 0.55, feedback: 0.35, mix: 0.3 } },
    glass: { sample: 'glass', volume: 0.07, attack: 1.4, release: 2.4, reverb: 0.85, pan: 0.3 },
    hymn: { sample: 'vibesBowed', volume: 0.12, attack: 0.4, release: 1.2, reverb: 0.8, pan: 0.2, echo: { time: 0.6, feedback: 0.3, mix: 0.2 } },
    // The lullaby, from under the water.
    under: { sample: 'vibesBowed', volume: 0.14, attack: 0.15, release: 1.4, reverb: 0.9, pan: -0.1, echo: { time: 0.75, feedback: 0.45, mix: 0.4 } },
    underHum: { sample: 'choir', volume: 0.06, attack: 0.8, release: 1.6, reverb: 0.9 },
    bell: { sample: 'chimes', volume: 0.1, ring: true, reverb: 0.85, pan: -0.4 },
  },

  sections: {
    intro: fit('intro', {
      horn: pedal(INTRO_CHORDS, 3),
      drop: scatter(2, BAR, [[0, 5, 'D6'], [1, 8, 'A6']]),
    }, 2),

    A: fit('A', {
      violas: sustained(A_CHORDS, BAR, 1, 3),
      violins: sustained(A_CHORDS, BAR, 2, 4),
      choir: sustained(A_CHORDS, BAR, 0, 4),
      horn: pedal(A_CHORDS, 3),
      harp: slowHarp(A_CHORDS),
      drop: scatter(8, BAR, [[0, 9, 'A6'], [1, 4, 'F6'], [3, 7, 'D7'], [4, 2, 'E6'], [5, 10, 'A6'], [6, 5, 'C#7'], [7, 8, 'F6']]),
    }, 8),

    B: fit('B', {
      hymn: HYMN,
      violas: sustained(B_CHORDS, BAR, 0, 3),
      violins: sustained(B_CHORDS, BAR, 1, 4),
      choir: sustained(B_CHORDS, BAR, 2, 4),
      horn: pedal(B_CHORDS, 3),
      // The wrong thing: Eb held high over D minor.
      glass: [...rest(4), midi('Eb6'), ...Array(BAR * 2 - 1).fill('-'), ...rest(2)],
      harp: slowHarp(B_CHORDS),
      drop: scatter(8, BAR, [[0, 3, 'D7'], [2, 6, 'F6'], [3, 10, 'A6'], [5, 4, 'E6'], [7, 9, 'A6']]),
      bell: scatter(8, BAR, [[3, 0, 'A5']]),
    }, 8),

    // THE LULLABY, from under the water; then the drops thin out.
    C: fit('C', {
      under: [...LULLABY_SLOW, ...rest(4)],
      underHum: [...rest(4), ...transpose(LULLABY_SLOW, -12).slice(0, 2 * BAR), ...rest(2)],
      violas: sustained(C_CHORDS, BAR, 1, 3),
      horn: pedal(C_CHORDS, 3),
      drop: scatter(8, BAR, [[2, 9, 'A6'], [5, 3, 'F6'], [6, 8, 'D7'], [7, 4, 'A6']]),
    }, 8),

    D: fit('D', {
      violas: sustained(D_CHORDS, BAR, 1, 3),
      choir: sustained(D_CHORDS, BAR, 0, 4),
      horn: pedal(D_CHORDS, 3),
      harp: slowHarp(D_CHORDS),
      drop: scatter(6, BAR, [[1, 6, 'D7'], [3, 2, 'A6'], [5, 9, 'E6']]),
      bell: scatter(6, BAR, [[4, 0, 'E5']]),
    }, 6),
  },

  order: ['intro', 'A', 'B', 'C', 'D'],
  loopFrom: 1,
};
