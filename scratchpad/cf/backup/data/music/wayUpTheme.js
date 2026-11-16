import { melody, arpeggio, sustained, chordLine } from '../../audio/notation.js';
import { drops } from './parts/chapter3.js';
import { rest as restBars, held, until as untilBars, after as afterBars, midi, cellIn, FIRST_STEPS, BAR_44 as BAR } from './parts/chapter4.js';

// "Eight Flights": the theme of the Way Up, the old stair the Hero came down
// by, cut into the rock in eight long switchbacks at the end of Chapter 4.
// Down here it was always dark. Now the root has been relit and the light has
// gone up through the rock ahead of you, so the veins glow between the
// flights and for the first time in forever the stair is lit. Somebody went
// down it alone with a pile of flat stones; you go up it with the light, and
// it is a long way, and nothing lives on it. So this is the Deep's song
// ("Counting Days", deepTheme.js) turned inside out: the same low
// drone and the same far-off piano, one note at a time, at the very start,
// then the same cell, no longer hummed too slowly in the dark but sung in the
// major and handed up the stair, a step higher each time. It is an area
// theme, not a fight: slow, rising and hopeful, nothing driving, a flight of
// stairs and not a charge. Real recordings only (violas, violins,
// horns, flute, harp, glockenspiel, bowed vibraphone, piano, timpani). Mood
// references only: the quiet climbing themes of Hollow Knight, and the
// lamp-lit stairs of Undertale and Zelda.
//
// THE CHAPTER'S TUNE (the "first cell", parts/chapter4.js): up a fourth, up
// a third, one step down. In "Counting Days" it was G C Eb D, minor and far
// too slow. Here it is G C E D, in C major, the way it was sung up in the
// sun (that song's warm part), and it climbs: the same four intervals start
// a step higher each bar (G C E D, A D F E, B E G F sharp, C F A G...), the
// bass walking up the scale underneath, a bar a stair. Near the top it does
// the trick again in A flat, then B flat, then C (flat six, flat seven,
// one: the "door opens" lift). The Lydian colour (D major, the raised
// fourth, floating over C) glows in the middle. At the very end the tune is
// answered: the last note of the melody is C, finishing at last, and then
// only the drone, which is where the song began.
//
// C major, 72 BPM, one step a 16th note: a bar is 3 1/3 seconds. There is no
// separate start; the whole song loops, 40 bars, about 2 minutes 13 seconds.
// It builds flight by flight (an instrument more every few bars) and thins
// again at the landing so the loop begins from the drone:
//
//   foot     4 bars  0:00  the soft viola drone; the far piano plays the cell one
//                          note a bar, the way the Deep did, only in major
//   first    5 bars  0:13  a viola sings the cell in long notes, a step
//                          higher the second time; a harp starts to rise
//   climb    5 bars  0:30  the flute takes the cell up the scale a bar at a
//                          time over a walking bass; a low harp steps
//   glow     5 bars  0:47  C then D (Lydian): the solo violin sings long
//                          notes, the glockenspiel glitters, horns breathe
//   lift     5 bars  1:03  A flat, B flat, C: the cell in three keys, the
//                          flute and violin, a timpani note, harp in 8ths
//   higher   5 bars  1:20  the second climb, a step each bar again, brighter
//   top      5 bars  1:37  the tune whole and high with everything
//                          (the peak, still never loud)
//   landing  6 bars  1:53  thinning: the solo violin, the piano an octave
//                          under it, the cell answered on C; then only the
//                          drone, and the stair starts again

const rest = (bars) => restBars(bars, BAR);
const after = (bars, track) => afterBars(bars, track, BAR);
const until = (bars, track) => untilBars(bars, track, BAR);
const q = (text) => melody(text, 4);   // each token a quarter note: 4 to a bar
const h = (text) => melody(text, 8);   // each token a half note: 2 to a bar
// Fails loudly if a section's tracks are not all the same whole number of bars.
const tight = (name, section, bars) => {
  for (const [track, steps] of Object.entries(section)) {
    if (steps.length !== bars * BAR) throw new Error(`Eight Flights ${name}: '${track}' is ${steps.length} steps, not ${bars} bars`);
  }
  return section;
};
// A note, or a few, placed on given steps of a stretch of bars; rest silent.
const placed = (bars, notes) => {
  const out = rest(bars);
  for (const [step, note] of Object.entries(notes)) out[Number(step)] = typeof note === 'number' ? note : midi(note);
  return out;
};
const nm = (note) => `${['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'][note % 12]}${Math.floor(note / 12) - 1}`;
// The cell in the major, as four note names (G4 C5 E5 D5 for tonic C5).
const [c0, c1, c2, c3] = cellIn('C5', FIRST_STEPS).map(nm);

// Slow broken chords for the harp: a rise in quarters, and a lift in 8ths.
const RISE = [0, '.', '.', '.', 7, '.', '.', '.', 12, '.', '.', '.', 'tenth', '.', '.', '.'];
const LIFT = [0, '.', 7, '.', 12, '.', 'tenth', '.', 19, '.', 'tenth', '.', 12, '.', 7, '.'];
// The low harp: one step a beat, steady, like feet on a stair.
const STEP = [0, '.', '.', '.', 7, '.', '.', '.', 0, '.', '.', '.', 7, '.', '.', '.'];
const sust = (chords, voice, octave) => sustained(chords, BAR, voice, octave);

export const WAY_UP_THEME = {
  title: 'Eight Flights',
  bpm: 72,
  stepsPerBeat: 4,
  // An area theme, and the warmest in the chapter's last stretch.
  volume: 0.7,

  instruments: {
    // The rock under it all: soft violas now, no cellos anywhere (they were
    // too big and loud for a song that should just be beautiful).
    drone: { sample: 'violas', volume: 0.1, attack: 2, release: 3, reverb: 0.65, pan: -0.05 },
    fifth: { sample: 'violas', volume: 0.08, attack: 2, release: 3, reverb: 0.6, pan: 0.2 },
    // The piano from the other end of the cave, a little closer than before.
    far: { sample: 'grandPiano', volume: 0.3, ring: true, reverb: 0.8, pan: 0.3, echo: { time: 0.8, feedback: 0.4, mix: 0.3 }, humanize: { time: 0.03, volume: 0.2 } },
    piano: { sample: 'grandPiano', volume: 0.2, ring: true, reverb: 0.55, pan: -0.15, humanize: { time: 0.014, volume: 0.15 } },
    drops: { sample: 'grandPiano', volume: 0.1, ring: true, reverb: 0.85, pan: -0.4, humanize: { time: 0.03, volume: 0.3 } },
    viola: { sample: 'violas', volume: 0.42, attack: 0.3, release: 0.9, reverb: 0.5, pan: 0.05, humanize: { time: 0.02, volume: 0.15 } },
    padViolas: { sample: 'violas', volume: 0.2, attack: 0.6, release: 1.2, reverb: 0.6, pan: -0.2 },
    padViolins: { sample: 'violins', volume: 0.18, attack: 0.8, release: 1.4, reverb: 0.65, pan: 0.25 },
    violins: { sample: 'violins', volume: 0.16, attack: 0.5, release: 1.2, reverb: 0.6, pan: 0.3 },
    // The bass: a soft piano on the roots, and a low harp stepping.
    bass: { sample: 'grandPiano', volume: 0.13, ring: true, reverb: 0.6, pan: -0.25, humanize: { time: 0.012, volume: 0.1 } },
    pluck: { sample: 'harp', volume: 0.1, reverb: 0.45, pan: -0.3, humanize: { time: 0.01, volume: 0.15 } },
    flute: { sample: 'flute', volume: 0.3, attack: 0.15, release: 0.9, reverb: 0.7, pan: 0.1, humanize: { time: 0.012, volume: 0.1 } },
    violin: { sample: 'soloViolin', volume: 0.28, attack: 0.3, release: 1.1, reverb: 0.7, pan: -0.05, humanize: { time: 0.014, volume: 0.1 } },
    horns: { sample: 'hornsSoft', volume: 0.1, attack: 0.9, release: 1.5, reverb: 0.65, pan: 0.0 },
    harp: { sample: 'harp', volume: 0.24, ring: true, reverb: 0.65, pan: -0.3, humanize: { time: 0.014, volume: 0.2 } },
    glock: { sample: 'glock', volume: 0.13, ring: true, pan: 0.35, reverb: 0.7, echo: { time: 0.42, feedback: 0.35, mix: 0.35 } },
    vibes: { sample: 'vibesBowed', volume: 0.16, attack: 0.6, release: 1.6, reverb: 0.7, pan: 0.2 },
    glass: { sample: 'glass', volume: 0.12, attack: 1.4, release: 2.5, reverb: 0.85, pan: -0.35 },
    timpani: { sample: 'timpani', volume: 0.08, ring: true, reverb: 0.5 },
  },

  sections: {
    // The drone; the piano plays the cell one note a bar, now in major.
    foot: tight('foot', {
      drone: held(midi('C3'), 4 * BAR),
      fifth: [...rest(1), ...held(midi('G3'), 3 * BAR)],
      far: placed(4, { 0: midi(c0), [BAR]: midi(c1), [2 * BAR]: midi(c2), [3 * BAR]: midi(c3) }),
      glass: [...rest(2), ...held(midi('E5'), 2 * BAR)],
      drops: drops('C C C C', BAR, 0.05, 11, 1),
    }, 4),

    // A viola sings the cell, then again a step higher; the harp rises.
    first: tight('first', {
      drone: held(midi('C3'), 5 * BAR),
      viola: h(`${c0} ${c1} ${c2} ${c3} A4 D5 F5 E5 B4 -`),
      bass: sust('C C Dm Dm Em', 0, 2),
      harp: after(1, arpeggio('C C Dm Dm Em', BAR, 3, RISE)),
      horns: [...rest(3), ...sust('Dm Em', 2, 3)],
      far: placed(5, { [4 * BAR + 8]: 'G5' }),
    }, 5),

    // The flute climbs the scale a bar at a time over a walking bass.
    climb: tight('climb', {
      drone: held(midi('C3'), 5 * BAR),
      flute: q('G4 C5 E5 D5  A4 D5 F5 E5  B4 E5 G5 F#5  C5 F5 A5 G5  D5 G5 B5 A5'),
      bass: sust('C Dm Em F G', 0, 2),
      padViolas: sust('C Dm Em F G', 1, 3),
      horns: sust('C Dm Em F G', 0, 3),
      harp: arpeggio('C Dm Em F G', BAR, 4, RISE),
      pluck: chordLine('C Dm Em F G', STEP, 2),
    }, 5),

    // The Lydian pair, C then D: the solo violin sings long notes and the
    // glockenspiel glitters.
    glow: tight('glow', {
      drone: held(midi('C3'), 5 * BAR),
      violin: h('G4 C5 E5 D5 B4 E5 G5 F#5 B5 A5'),
      bass: sust('C D Em D G', 0, 2),
      padViolins: sust('C D Em D G', 2, 4),
      padViolas: sust('C D Em D G', 1, 3),
      horns: sust('C D Em D G', 0, 3),
      vibes: sust('C D Em D G', 1, 4),
      harp: arpeggio('C D Em D G', BAR, 4, LIFT),
      pluck: chordLine('C D Em D G', STEP, 2),
      glock: placed(5, { [BAR + 8]: 'E6', [BAR + 12]: 'D6', [3 * BAR + 8]: 'G6', [3 * BAR + 12]: 'F#6', [4 * BAR + 8]: 'B6' }),
    }, 5),

    // The cell in A flat, B flat and C: the door opens.
    lift: tight('lift', {
      drone: held(midi('C3'), 5 * BAR),
      flute: q('Eb5 Ab5 C6 Bb5  F5 Bb5 D6 C6  G5 C6 E6 D6  D6 - B5 G5  C6 - - -'),
      violin: q('Eb5 Ab5 C6 Bb5  F5 Bb5 D6 C6  G5 C6 E6 D6  D6 - B5 G5  C6 - - -'),
      bass: sust('Ab Bb C G C', 0, 2),
      padViolins: sust('Ab Bb C G C', 2, 4),
      padViolas: sust('Ab Bb C G C', 1, 3),
      horns: sust('Ab Bb C G C', 0, 3),
      harp: arpeggio('Ab Bb C G C', BAR, 4, LIFT),
      pluck: chordLine('Ab Bb C G C', STEP, 2),
      timpani: placed(5, { [2 * BAR]: 'C3', [4 * BAR]: 'C3' }),
      glock: placed(5, { [2 * BAR + 8]: 'G6', [2 * BAR + 12]: 'E6', [4 * BAR]: 'C7' }),
    }, 5),

    // The second climb, a step each bar again, brighter and fuller.
    higher: tight('higher', {
      drone: held(midi('C3'), 5 * BAR),
      flute: q('C5 F5 A5 G5  D5 G5 B5 A5  E5 A5 C6 B5  F5 A5 C6 A5  D6 - - -'),
      violin: q('C5 F5 A5 G5  D5 G5 B5 A5  E5 A5 C6 B5  F5 A5 C6 A5  D6 - - -'),
      bass: sust('F G Am F G', 0, 2),
      padViolins: sust('F G Am F G', 2, 4),
      padViolas: sust('F G Am F G', 1, 3),
      horns: sust('F G Am F G', 0, 3),
      vibes: sust('F G Am F G', 1, 4),
      harp: arpeggio('F G Am F G', BAR, 4, LIFT),
      pluck: chordLine('F G Am F G', STEP, 2),
      glock: placed(5, { [BAR]: 'G6', [2 * BAR]: 'A6', [4 * BAR]: 'B6' }),
    }, 5),

    // The tune whole and high: the cell in half notes, with everything.
    top: tight('top', {
      drone: held(midi('C3'), 5 * BAR),
      flute: h('G5 C6 E6 D6 C6 A5 B5 D6 C6 -'),
      violin: h('G5 C6 E6 D6 C6 A5 B5 D6 C6 -'),
      violins: h('G4 C5 E5 D5 C5 A4 B4 D5 C5 -'),
      bass: sust('C Em F G C', 0, 2),
      padViolins: sust('C Em F G C', 2, 4),
      padViolas: sust('C Em F G C', 1, 3),
      horns: sust('C Em F G C', 0, 3),
      vibes: sust('C Em F G C', 1, 4),
      harp: arpeggio('C Em F G C', BAR, 4, LIFT),
      pluck: chordLine('C Em F G C', STEP, 2),
      timpani: placed(5, { 0: 'C3', [2 * BAR]: 'F2', [3 * BAR]: 'G2', [4 * BAR]: 'C3' }),
      glock: placed(5, { 0: 'C7', [BAR]: 'G6', [BAR + 8]: 'E6', [4 * BAR]: 'G6', [4 * BAR + 4]: 'C7', [4 * BAR + 8]: 'E7' }),
    }, 5),

    // Thinning: the cell on the solo violin with the piano under it, and at
    // last answered on C; then only the drone.
    landing: tight('landing', {
      drone: held(midi('C3'), 6 * BAR),
      violin: h('G4 C5 E5 D5 G4 C5 E5 D5 C5 - . .'),
      piano: [...h('G3 C4 E4 D4 G3 C4 E4 D4 C4 -'), ...rest(1)],
      padViolas: until(4, sust('C D C D C C', 1, 3)),
      harp: until(5, arpeggio('C D C D C C', BAR, 3, RISE)),
      glass: [...rest(3), ...held(midi('E5'), 3 * BAR)],
      far: placed(6, { [5 * BAR]: 'C5' }),
      drops: until(5, drops('C C C C C C', BAR, 0.05, 90, 1)),
    }, 6),
  },

  order: ['foot', 'first', 'climb', 'glow', 'lift', 'higher', 'top', 'landing'],
  loopFrom: 0,
};
