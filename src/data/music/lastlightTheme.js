import {
  melody, arpeggio, sustained, rest as restBars, hits, repeat,
  tight, midi, scatter, lullaby, LULLABY_OPENING,
} from './parts/chapter5.js';

// "The Long Climb": the theme of the Last Light, the tall black lighthouse
// with the crown of broken spars, inside. A spiral stair, the sea coming in
// at the bottom, the crank room, the gallery with Corrie's spell marks, the
// beams, and at the top the lamp, where Corrie is. It is dread that keeps
// moving: the area song with the strongest pulse in the chapter, climbing
// all the way, but held back (no brass blasts, no snare, nothing like a
// boss) so that Corrie's own song can hit harder when it starts.
//
// THE STAIR is the ostinato: a harp climbs triads up the scale one after
// another, three notes to a step in bars of eight, so the stair winds round
// a different way each bar (a fixed ostinato, after Hollow Knight's City of
// Tears), and a glock catches the top of each step. Under it one low note
// holds like a pedal and creeps up a step every section: D, E, F, G, A. The
// sea is a muffled tremolo at the bottom.
//
// THE HOOK is the climbing tune: "step, step, step, and back one", then a
// drop down the stairwell (D E F E D, down to A), and the same again a step
// higher every two bars until it reaches the top of the bar line and hangs
// on the dominant. Against it the violas sing the old lament going down (D,
// C, B-flat, A): the tune climbs while the floor sinks. It is on clarinet
// first, then the oboe, then a muted violin, and in D it comes back high on
// the violins with the oboe under it: the payoff.
//
// THE PULSE speeds up as you climb, like a heartbeat: a soft deep drum
// through a heavy lowpass, more felt than heard, with plucked strings on
// the pedal note. In A there is no pulse at all; in B the drum beats once
// every two bars and the plucks walk in quarters; in C the drum beats every
// bar and the plucks go to 8ths; in D the drum beats twice a bar (in the
// two bars of near silence it is the only thing that moves) and soft
// timpani join it; in E it stops while the music box plays, then comes back
// once, alone, before the loop falls to the bottom.
//
// CORRIE'S LULLABY (parts/chapter5.js, "Come In, Little Boat": F A D / D C
// Bb / A G F / E) comes in fragments, and each one is more broken than the
// last, like a music box running down as you climb: in A the box plays two
// bars and stops; in B a voice hums three bars with notes missing; in C the
// box comes in late, slowed, and stalls on F, never reaching the E; in D the
// voice gets three notes out in the silence and nothing more. At the top
// (E) the box plays the first four bars whole, in their own 6/8 over a
// rocking harp, exactly as "Salt in the Wound" (corrieBattle) begins, and
// stops on the fifth, asking. So when the fight starts, it is the same
// tune, picking up.
//
// D minor, 4/4 at 72 (a bar is 3.3 seconds); one step an 8th, eight to a
// bar. The intro plays once (2 bars); then it loops from A, 36 bars, 2m00s,
// and the loop falls back to the bottom of the stair (pedal D):
//
//   intro   2 bars    7s   the stair alone over the pedal D; the sea
//   A       8 bars   27s   pedal D. THE HOOK on clarinet, the lament under
//                          it on violas; the box plays the lullaby's first
//                          two bars over it and stops
//   B       8 bars   27s   pedal E (under B-flat: a tritone). A voice hums
//                          the lullaby, three bars, notes missing; the
//                          oboe takes the hook's top half; the glock joins
//                          the stair; the pulse starts (drum every two
//                          bars, plucks in quarters)
//   C       8 bars   27s   pedal F (under A major: the dread chord). THE
//                          HOOK whole on the muted violin, the lament under
//                          it; the box comes in late and slowed and stalls
//                          on F; drum every bar, plucks in 8ths, choir
//   D       8 bars   27s   pedal G. Two bars of only the pedal, the sea and
//                          the heartbeat (twice a bar), and the voice's
//                          three notes; then THE HOOK high on the violins
//                          and oboe, timpani with the heartbeat, choir, an
//                          E-flat (the Neapolitan, the one borrowed chord)
//                          and the A over the G pedal at the very top
//   E       4 bars   13s   pedal A. The stair stops; a rocking harp; the box
//                          plays the lullaby's opening whole, as the boss
//                          song does, and stops on E; then one bar of
//                          nothing but the pedal, the sea and one heartbeat

const BAR = 8;
const tune = (text) => melody(text, 1);   // each token an 8th: 8 to a bar
const rest = (bars) => restBars(bars, BAR);
const fit = (name, section, bars) => tight('The Long Climb', name, section, bars, BAR);
const after = (bars, track) => [...rest(bars), ...track.slice(bars * BAR)];
const down = (track) => track.map((s) => (typeof s === 'number' ? s - 12 : s));
const place = (bars, ...parts) => {
  const out = rest(bars);
  for (const [at, steps] of parts) {
    if (at * BAR + steps.length > out.length) throw new Error(`The Long Climb: a part from bar ${at} runs past ${bars} bars`);
    steps.forEach((s, i) => { out[at * BAR + i] = s; });
  }
  return out;
};

// --- Harmony over the pedal, a bar each. The A chords stay open (no C#),
// so the stair's C natural never fights them; the lament (D C Bb A) is the
// bass of the chords even when the pedal says otherwise. ---
const CLIMB_CHORDS = 'Dm Dm C C Bb Gm A A';
const D_CHORDS = 'Gm Gm Gm Gm Bb Gm Eb A';
const open = (chords, octave) => sustained(chords, BAR, 0, octave);
const third = (chords, octave) => sustained(chords, BAR, 1, octave);
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
// The pulse on the pedal note: quarters, then 8ths.
const QUARTERS = [0, '.', 0, '.', 0, '.', 0, '.'];
const EIGHTHS = [0, 0, 0, 0, 0, 0, 0, 0];
const pulse = (bars, name, shape) => repeat(shape.map((s) => (s === 0 ? midi(name) : s)), bars);

// --- The hook: step, step, step, back one, and down the stairwell; a step
// higher every two bars, until it hangs on the dominant. ---
const HOOK = tune(`
  D5 - E5 - F5 - - E5    D5 - - - A4 - - .
  E5 - F5 - G5 - - F5    E5 - - - A4 - - .
  F5 - G5 - A5 - - G5    F5 - - - D5 - E5 F5
  G5 - A5 - Bb5 - - A5   G5 - - - E5 - - .
`);
// The top of the climb, in D: higher, and the Neapolitan E-flat at the top.
const PEAK = tune(`
  F5 - G5 - A5 - - G5    F5 - - - D5 - - .
  G5 - A5 - Bb5 - - A5   G5 - - - D5 - Eb5 F5
  G5 - Bb5 - Eb6 - - D6  D6 - - - A5 - - .
`);
// The lament under it: D, C, B-flat, A, two bars each.
const LAMENT = tune(`
  D4 - - - - - - -   D4 - - - - - - -   C4 - - - - - - -   C4 - - - - - - -
  Bb3 - - - - - - -  Bb3 - - - - - - -  A3 - - - - - - -   A3 - - - - - - -
`);
const LAMENT_D = tune(`
  . . . . . . . .    . . . . . . . .    D4 - - - - - - -   D4 - - - - - - -
  D4 - - - - - - -   D4 - - - - - - -   Eb4 - - - - - - -  E4 - - - - - - -
`);

// The heartbeat: lub-dub, and nothing. One pattern a bar.
const BEAT = hits('xx......');
const BEAT_TWICE = hits('xx..xx..');
const NO_BEAT = hits('........');

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
  bpm: 72,
  stepsPerBeat: 2,
  volume: 1.35,

  instruments: {
    stair: { sample: 'harp', volume: 0.13, ring: true, reverb: 0.6, pan: 0.2, humanize: { time: 0.01, volume: 0.2 } },
    stairTop: { sample: 'glock', volume: 0.035, ring: true, octave: 1, reverb: 0.8, pan: -0.3, echo: { time: 0.83, feedback: 0.3, mix: 0.3 } },
    rockHarp: { sample: 'harp', volume: 0.17, ring: true, reverb: 0.55, pan: -0.25, humanize: { time: 0.01, volume: 0.18 } },
    pedal: { sample: 'cellos', volume: 0.1, attack: 1.6, release: 2.0, reverb: 0.55, muffle: 500 },
    pluck: { sample: 'harp', volume: 0.15, ring: true, reverb: 0.5, pan: -0.2 },
    pulse: { sample: 'cellosPizz', volume: 0.14, release: 0.25, reverb: 0.4, pan: -0.1, muffle: 1300, humanize: { time: 0.006, volume: 0.2 } },
    sea: { sample: 'cellosTrem', volume: 0.05, attack: 2.0, release: 2.0, reverb: 0.65, pan: -0.1, muffle: 320 },
    lament: { sample: 'violas', volume: 0.085, attack: 1.0, release: 1.6, reverb: 0.65, pan: -0.25 },
    violas: { sample: 'violas', volume: 0.07, attack: 1.4, release: 1.8, reverb: 0.65, pan: -0.15 },
    violins: { sample: 'violins', volume: 0.045, attack: 1.8, release: 2.2, reverb: 0.75, pan: 0.3 },
    hookHigh: { sample: 'violins', volume: 0.22, attack: 0.15, release: 0.7, reverb: 0.6, pan: 0.25, humanize: { time: 0.01, volume: 0.08 } },
    box: { sample: 'glock', volume: 0.11, ring: true, reverb: 0.6, pan: 0.15, echo: { time: 0.5, feedback: 0.3, mix: 0.25 }, humanize: { time: 0.008, volume: 0.1 } },
    voice: { sample: 'choir', volume: 0.1, attack: 0.3, release: 0.9, reverb: 0.8, pan: 0.05 },
    choir: { sample: 'choir', volume: 0.065, attack: 1.8, release: 2.2, reverb: 0.85 },
    clarinet: { sample: 'clarinet', volume: 0.12, attack: 0.12, release: 0.7, reverb: 0.6, pan: -0.2, humanize: { time: 0.01, volume: 0.1 } },
    oboe: { sample: 'oboe', volume: 0.17, attack: 0.1, release: 0.7, reverb: 0.6, pan: 0.2, humanize: { time: 0.01, volume: 0.1 } },
    violin: { sample: 'soloViolin', volume: 0.18, attack: 0.15, release: 0.8, reverb: 0.65, pan: -0.05, muffle: 2600 },
    heart: { sample: 'concertBassDrum', drum: 'sample', volume: 0.18, ring: true, reverb: 0.45, muffle: 220, humanize: { time: 0.01, volume: 0.15 } },
    timpani: { sample: 'timpani', volume: 0.14, ring: true, reverb: 0.5, muffle: 900 },
    horn: { sample: 'hornsSoft', volume: 0.06, attack: 2.0, release: 2.0, reverb: 0.65, pan: -0.3 },
    drip: { sample: 'glass', volume: 0.05, ring: true, reverb: 0.85, pan: 0.35, echo: { time: 0.7, feedback: 0.35, mix: 0.3 } },
  },

  sections: {
    intro: fit('intro', {
      stair: stair(2),
      pedal: pedal(2, 'D2'),
      pluck: pluck(2, 'D3'),
      sea: pedal(2, 'D2'),
    }, 2),

    A: fit('A', {
      clarinet: down(HOOK),
      lament: LAMENT,
      box: place(8, [4, BOX_A]),
      stair: stair(8),
      pedal: pedal(8, 'D2'),
      pluck: pluck(8, 'D3'),
      sea: pedal(8, 'D2'),
      drip: scatter(8, BAR, [[1, 5, 'A5'], [3, 3, 'F5'], [6, 6, 'D6']]),
    }, 8),

    B: fit('B', {
      voice: place(8, [0, VOICE_B]),
      oboe: after(4, HOOK),
      stair: stair(8),
      stairTop: stairTop(8),
      pedal: pedal(8, 'E2'),
      pluck: pluck(8, 'E2'),
      pulse: pulse(8, 'E3', QUARTERS),
      sea: pedal(8, 'E2'),
      violas: open(CLIMB_CHORDS, 3),
      violins: fifth(CLIMB_CHORDS, 4),
      drip: scatter(8, BAR, [[0, 6, 'E5'], [2, 3, 'A5'], [5, 7, 'Bb5']]),
      heart: repeat([...BEAT, ...NO_BEAT], 4),
    }, 8),

    C: fit('C', {
      violin: HOOK,
      lament: LAMENT,
      box: place(8, [6, BOX_C]),
      stair: stair(8),
      stairTop: stairTop(8),
      pedal: pedal(8, 'F2'),
      pluck: pluck(8, 'F2'),
      pulse: pulse(8, 'F3', EIGHTHS),
      sea: pedal(8, 'F2'),
      violins: fifth(CLIMB_CHORDS, 4),
      choir: after(2, third(CLIMB_CHORDS, 4)),
      drip: scatter(8, BAR, [[1, 2, 'D6'], [3, 6, 'A5'], [5, 1, 'F5']]),
      heart: repeat(BEAT, 8),
    }, 8),

    // The upper rooms: silence first, then the hook at the top.
    D: fit('D', {
      voice: place(8, [1, VOICE_D]),
      hookHigh: [...rest(2), ...PEAK],
      oboe: [...rest(2), ...down(PEAK)],
      lament: LAMENT_D,
      stair: after(2, stair(8)),
      stairTop: after(2, stairTop(8)),
      pedal: pedal(8, 'G2'),
      sea: pedal(8, 'G2'),
      pluck: after(2, pluck(8, 'G2')),
      pulse: after(2, pulse(8, 'G3', EIGHTHS)),
      // The A chord stays open here too (A, not C#): the hook hangs on D
      // over it.
      violas: after(2, third(D_CHORDS, 3).map((n) => (n === midi('C#4') ? midi('A3') : n))),
      violins: after(2, fifth(D_CHORDS, 4)),
      choir: after(2, open(D_CHORDS, 4)),
      horn: [...rest(2), ...pedal(6, 'G3')],
      drip: scatter(8, BAR, [[0, 4, 'G5'], [1, 6, 'Bb5'], [4, 3, 'A5']]),
      heart: repeat(BEAT_TWICE, 8),
      timpani: after(2, repeat(hits('x...x...').map((s) => (s === 'x' ? midi('G2') : s)), 8)),
    }, 8),

    // The top: the lullaby whole, as the fight will begin it.
    E: fit('E', {
      box: BOX_E,
      rockHarp: ROCK_E,
      violas: PAD_E,
      pedal: pedal(4, 'A2'),
      sea: pedal(4, 'A2'),
      heart: [...repeat(NO_BEAT, 3), ...BEAT],
    }, 4),
  },

  order: ['intro', 'A', 'B', 'C', 'D', 'E'],
  loopFrom: 1,
};
