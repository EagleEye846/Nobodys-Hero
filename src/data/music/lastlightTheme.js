import {
  melody, arpeggio, sustained, rest as restBars,
  tight, midi, scatter, lullaby, LULLABY_OPENING,
} from './parts/chapter5.js';

// "The Long Climb": the theme of the Last Light, the tall black lighthouse
// with the crown of broken spars, inside. A spiral stair, the sea coming in
// at the bottom, the crank room, the gallery with Corrie's spell marks, the
// beams, and at the top the lamp, where Corrie is. It is quiet dread and
// sadness, not loud. A harp climbs the stair the whole way, triads stepping
// up the scale one after another (a fixed ostinato, after Hollow Knight's
// City of Tears; three notes to a step in bars of eight, so the stair winds
// round a different way each bar), a glass-bright glock catches the top of
// each step, and under it all one low note holds like a pedal and creeps up
// a step every section: D, E, F, G, A. The sea is a muffled tremolo at the
// bottom. A climbing tune ("step, step, step, and back one") goes up a step
// every two bars, on clarinet, then oboe, then a muted solo violin.
//
// CORRIE'S LULLABY (parts/chapter5.js, "Come In, Little Boat": F A D / D C
// Bb / A G F / E) comes in fragments, and each one is more broken than the
// last, like a music box running down as you climb: in A the box plays two
// bars and stops; in B a voice hums three bars with notes missing; in C the
// box comes in late, slowed, and stalls on F, never reaching the E; in D the
// voice gets three notes out and nothing more. At the top (E) the box plays
// the first four bars whole, in their own 6/8 over a rocking harp, exactly
// as "Salt in the Wound" (corrieBattle) begins, and stops on the fifth,
// asking. So when the fight starts, it is the same tune, picking up.
//
// D minor, 4/4 at 60 (a bar is 4 seconds); one step an 8th, eight to a bar.
// The intro plays once (2 bars); then it loops from A, 30 bars, 2m00s, and
// the loop falls back to the bottom of the stair (pedal D):
//
//   intro   2 bars    8s   the stair alone over the pedal D; the sea
//   A       8 bars   32s   pedal D. The climbing tune on clarinet (Dm Bb
//                          Gm A, twice); the box plays the lullaby's first
//                          two bars and stops
//   B       6 bars   24s   pedal E (under B-flat: a tritone). A voice hums
//                          the lullaby, three bars, notes missing; the
//                          glock joins the stair; the oboe climbs
//   C       6 bars   24s   pedal F (under A major: the dread chord). The
//                          muted violin climbs; the box comes in late and
//                          slowed and stalls on F
//   D       6 bars   24s   pedal G. Silence first: two bars of only the
//                          pedal, the sea and drips; then the stair again,
//                          the voice's three notes, the oboe at the top
//   E       4 bars   16s   pedal A. The stair stops; a rocking harp; the box
//                          plays the lullaby's opening whole, as the boss
//                          song does, and stops on E; then one bar of
//                          nothing but the pedal and the sea

const BAR = 8;
const tune = (text) => melody(text, 1);   // each token an 8th: 8 to a bar
const rest = (bars) => restBars(bars, BAR);
const fit = (name, section, bars) => tight('The Long Climb', name, section, bars, BAR);
const place = (bars, ...parts) => {
  const out = rest(bars);
  for (const [at, steps] of parts) {
    if (at * BAR + steps.length > out.length) throw new Error(`The Long Climb: a part from bar ${at} runs past ${bars} bars`);
    steps.forEach((s, i) => { out[at * BAR + i] = s; });
  }
  return out;
};

// --- Harmony over the pedal, a bar each (A chords stay open: no C#,
// so the stair's C natural never fights them) ---
const A_CHORDS = 'Dm Bb Gm A Dm Bb Gm A';
const B_CHORDS = 'Dm Bb Gm A Gm A';
const C_CHORDS = 'Dm Bb Gm Gm A A';
const D_CHORDS = 'Gm Gm Bb Bb Gm A';
const open = (chords, octave) => sustained(chords, BAR, 0, octave);
const fifth = (chords, octave) => sustained(chords, BAR, 2, octave);

// --- The stair: triads stepping up D minor, 24 notes, wound round ---
const STAIR = tune('D4 F4 A4  E4 G4 Bb4  F4 A4 C5  G4 Bb4 D5  A4 C5 E5  Bb4 D5 F5  C5 E5 G5  D5 F5 A5');
const stair = (bars) => Array.from({ length: bars * BAR }, (_, i) => STAIR[i % STAIR.length]);
// The glock catches the top of each step.
const STAIR_TOP = STAIR.map((n, i) => (i % 3 === 2 ? n : '.'));
const stairTop = (bars) => Array.from({ length: bars * BAR }, (_, i) => STAIR_TOP[i % STAIR_TOP.length]);

// The pedal: one low note a section, creeping up a step each time.
const pedal = (bars, name) => [midi(name), ...Array(bars * BAR - 1).fill('-')];
const pluck = (bars, name) => scatter(bars, BAR, Array.from({ length: bars }, (_, b) => [b, 0, name]));

// --- The climbing tune: step, step, step, and back one; up a step every
// two bars ---
const CLIMB = tune(`
  D5 - E5 - F5 - - E5    D5 - - - - - . .
  E5 - F5 - G5 - - F5    E5 - - - - - . .
  F5 - G5 - A5 - - G5    F5 - - - D5 - - .
  G5 - A5 - Bb5 - - A5   G5 - - - E5 - - .
`);
const CLIMB_TOP = tune('G5 - A5 - Bb5 - - A5   G5 - - - E5 - - .');
const CLIMB_HIGH = tune('Bb5 - C6 - D6 - - C6   A5 - - - E5 - - .');
const CLIMB_LOW = tune(`
  A4 - Bb4 - C5 - - Bb4  Bb4 - - - F4 - - .
  Bb4 - C5 - D5 - - C5   Bb4 - - - G4 - - .
`);

// --- The lullaby, breaking (in 4/4 its bars are 3-3-2) ---
const BOX_A = tune('F5 - - A5 - - D6 -   D6 - - C6 - - Bb5 -');
const VOICE_B = tune('F4 - - A4 - - D5 -   D5 - - C5 - - . .   A4 - - G4 - - . .');
const BOX_C = tune('. . A5 - - - - G5   - - - - F5 - - .');
const VOICE_D = tune('F4 - - A4 - - D5 -');
// At the top: the opening whole, in its own 6/8, as the boss song begins.
const BOX_E = [...lullaby(LULLABY_OPENING).map((s) => (typeof s === 'number' ? s + 12 : s)), ...rest(1)];
const ROCK_E = [...arpeggio('Dm Bb Gm A', 6, 3, [0, 7, 12, 'tenth', 12, 7]), midi('A2'), ...Array(BAR - 1).fill('.')];
const PAD_E = [...sustained('Dm Bb Gm A', 6, 0, 3), ...sustained('A', BAR, 0, 3)];

export const LASTLIGHT_THEME = {
  title: 'The Long Climb',
  bpm: 60,
  stepsPerBeat: 2,
  volume: 1.3,

  instruments: {
    stair: { sample: 'harp', volume: 0.14, ring: true, reverb: 0.65, pan: 0.2, humanize: { time: 0.012, volume: 0.2 } },
    stairTop: { sample: 'glock', volume: 0.035, ring: true, octave: 1, reverb: 0.8, pan: -0.3, echo: { time: 0.75, feedback: 0.3, mix: 0.3 } },
    rockHarp: { sample: 'harp', volume: 0.17, ring: true, reverb: 0.55, pan: -0.25, humanize: { time: 0.01, volume: 0.18 } },
    pedal: { sample: 'cellos', volume: 0.1, attack: 1.6, release: 2.0, reverb: 0.55, muffle: 500 },
    pluck: { sample: 'harp', volume: 0.15, ring: true, reverb: 0.5, pan: -0.2 },
    sea: { sample: 'cellosTrem', volume: 0.05, attack: 2.0, release: 2.0, reverb: 0.65, pan: -0.1, muffle: 320 },
    violas: { sample: 'violas', volume: 0.08, attack: 1.4, release: 1.8, reverb: 0.65, pan: -0.15 },
    violins: { sample: 'violins', volume: 0.045, attack: 1.8, release: 2.2, reverb: 0.75, pan: 0.3 },
    box: { sample: 'glock', volume: 0.13, ring: true, reverb: 0.6, pan: 0.15, echo: { time: 0.5, feedback: 0.3, mix: 0.25 }, humanize: { time: 0.008, volume: 0.1 } },
    voice: { sample: 'choir', volume: 0.1, attack: 0.3, release: 0.9, reverb: 0.8, pan: 0.05 },
    choir: { sample: 'choir', volume: 0.045, attack: 1.8, release: 2.2, reverb: 0.85 },
    clarinet: { sample: 'clarinet', volume: 0.16, attack: 0.15, release: 0.7, reverb: 0.65, pan: -0.2, humanize: { time: 0.012, volume: 0.1 } },
    oboe: { sample: 'oboe', volume: 0.15, attack: 0.12, release: 0.7, reverb: 0.65, pan: 0.2, humanize: { time: 0.012, volume: 0.1 } },
    violin: { sample: 'soloViolin', volume: 0.13, attack: 0.2, release: 0.8, reverb: 0.7, pan: -0.05, muffle: 2400 },
    drip: { sample: 'glass', volume: 0.05, ring: true, reverb: 0.85, pan: 0.35, echo: { time: 0.7, feedback: 0.35, mix: 0.3 } },
  },

  sections: {
    intro: fit('intro', {
      stair: stair(2),
      pedal: pedal(2, 'D2'),
      pluck: pluck(2, 'D2'),
      sea: pedal(2, 'D2'),
    }, 2),

    A: fit('A', {
      clarinet: CLIMB.map((s) => (typeof s === 'number' ? s - 12 : s)),
      box: place(8, [4, BOX_A]),
      stair: stair(8),
      pedal: pedal(8, 'D2'),
      pluck: pluck(8, 'D2'),
      sea: pedal(8, 'D2'),
      violas: fifth(A_CHORDS, 3),
      drip: scatter(8, BAR, [[1, 5, 'A5'], [3, 3, 'F5'], [6, 6, 'D6']]),
    }, 8),

    B: fit('B', {
      voice: place(6, [0, VOICE_B]),
      oboe: place(6, [4, CLIMB_TOP]),
      stair: stair(6),
      stairTop: stairTop(6),
      pedal: pedal(6, 'E2'),
      pluck: pluck(6, 'E2'),
      sea: pedal(6, 'E2'),
      violas: open(B_CHORDS, 3),
      violins: fifth(B_CHORDS, 4),
      drip: scatter(6, BAR, [[0, 6, 'E5'], [2, 3, 'A5'], [4, 7, 'Bb5']]),
    }, 6),

    C: fit('C', {
      violin: place(6, [0, CLIMB_LOW]),
      box: place(6, [4, BOX_C]),
      stair: stair(6),
      stairTop: stairTop(6),
      pedal: pedal(6, 'F2'),
      pluck: pluck(6, 'F2'),
      sea: pedal(6, 'F2'),
      violas: open(C_CHORDS, 3),
      choir: [...rest(2), ...fifth(C_CHORDS, 4).slice(2 * BAR)],
      drip: scatter(6, BAR, [[1, 2, 'D6'], [3, 6, 'A5'], [5, 1, 'F5']]),
    }, 6),

    // The upper rooms: silence first, then music.
    D: fit('D', {
      voice: place(6, [2, VOICE_D]),
      oboe: place(6, [4, CLIMB_HIGH]),
      stair: [...rest(2), ...stair(4)],
      stairTop: [...rest(2), ...stairTop(4)],
      pedal: pedal(6, 'G2'),
      sea: pedal(6, 'G2'),
      pluck: place(6, [2, pluck(4, 'G2')]),
      violas: [...rest(2), ...open(D_CHORDS, 3).slice(2 * BAR)],
      violins: [...rest(2), ...fifth(D_CHORDS, 4).slice(2 * BAR)],
      drip: scatter(6, BAR, [[0, 4, 'G5'], [1, 1, 'D6'], [1, 6, 'Bb5'], [4, 3, 'A5']]),
    }, 6),

    // The top: the lullaby whole, as the fight will begin it.
    E: fit('E', {
      box: BOX_E,
      rockHarp: ROCK_E,
      violas: PAD_E,
      pedal: pedal(4, 'A2'),
      sea: pedal(4, 'A2'),
    }, 4),
  },

  order: ['intro', 'A', 'B', 'C', 'D', 'E'],
  loopFrom: 1,
};
