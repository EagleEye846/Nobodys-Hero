import { melody } from '../../audio/notation.js';
import { rest as restBars, held, midi } from './parts/chapter3.js';

// "Five and a Line": the music of the Hero's Camp, the cold ring of fire
// stones deep in the dark, the tally marks on the wall and the little bedroll.
// The most private piece in the chapter. Nobody says whose it is; the music
// only keeps the count. A small bell plays the chapter's tune (the "first
// cell", G C E D, the same four notes "Counting Days" hums in the dark) the
// way a child hums it to stay brave: four notes, and then a low note that is
// the fifth stroke across the four, the way tallies are scratched in fives.
// Every bar is five beats long for that reason: four to the tune, one to the
// stroke. Over the song the count gets worse. The bell starts high and neat,
// the tune goes minor and drops to a piano, it is sung once more in the sun
// (the hero's call from the prophecy, played gently on a solo violin over a
// harp), and then the tune climbs down and loses a note a bar until only the
// low stroke is left, and then not even that. Whoever was counting stopped
// reaching. Then it begins again. Nothing here is horror, and nothing says
// who it was; it is only tender and a little too quiet. Reference for the
// mood only: Toby Fox's small character pieces and the bare rooms of Hollow
// Knight. Real recordings only (bell, grand piano, cellos, violas, solo
// violin, harp, soft horn).
//
// C major turning to C minor and back, 66 BPM, 5/4 (a bar is 20 steps, a step
// a 16th note, about 4.5 seconds). 16 bars, about 73 seconds, the whole song
// loops:
//
//   tally   4 bars   0:00  the bell alone, high and neat: G C E D, then the stroke
//                          on a low piano note; a cello drone like the rock; the
//                          fourth bar leaves the fifth beat hanging
//   worn    4 bars   0:18  the tune an octave lower on the piano, the third turned
//                          flat (Eb); violas hold under it; the last bar is cut
//                          short, the way the hummer loses the end
//   sun     4 bars   0:36  the prophecy's call (the hero's fragment) on a solo
//                          violin, very softly, over a rocking harp, with the
//                          third back in the bell's tune; the stick figure's sun
//   lower   4 bars   0:55  the tune a little lower each bar and one note shorter,
//                          the strokes fewer, until the last bar is only the drone

const BAR = 20;
const rest = (bars) => restBars(bars, BAR);
const beats = (text) => melody(text, 4);   // each token a quarter note, five to a bar
const tight = (name, section, bars) => {
  for (const [track, steps] of Object.entries(section)) {
    if (steps.length !== bars * BAR) throw new Error(`Five and a Line ${name}: '${track}' is ${steps.length} steps, not ${bars} bars`);
  }
  return section;
};

// The hero's call from the prophecy theme (D5 A5 G5 A5 C6 / Bb5 A5 F5 D5), down
// a tone into C, in 8ths: 32 steps, then 8 of quiet, so it fills two bars.
const CALL = [
  ...melody('C5 - G5 - - F5 G5 Bb5 | Ab5 - G5 - Eb5 - C5 -', 2),
  ...rest(1).slice(0, 8),
];

export const HEROS_CAMP_THEME = {
  title: 'Five and a Line',
  bpm: 66,
  stepsPerBeat: 4,
  // Raised a little (2026-11-01): it was half as loud as the area themes
  // around it, and a quiet room shouldn't make you reach for the volume.
  volume: 1.15,

  instruments: {
    // The little bell that carries the tune.
    bell: { sample: 'glock', volume: 0.2, ring: true, reverb: 0.65, pan: 0.2, humanize: { time: 0.03, volume: 0.2 }, echo: { time: 0.909, feedback: 0.3, mix: 0.25 } },
    piano: { sample: 'grandPiano', volume: 0.3, ring: true, reverb: 0.7, pan: 0.1, humanize: { time: 0.04, volume: 0.22 } },
    // The stroke across the four.
    stroke: { sample: 'grandPiano', volume: 0.3, ring: true, reverb: 0.8, pan: -0.15, humanize: { time: 0.02, volume: 0.15 } },
    // The rock: a cello drone, kept low in the mix (felt more than heard).
    drone: { sample: 'cellos', volume: 0.18, attack: 2.5, release: 3, reverb: 0.55, pan: -0.05 },
    violas: { sample: 'violas', volume: 0.12, attack: 1.8, release: 2.5, reverb: 0.6, pan: 0.25 },
    violin: { sample: 'soloViolin', volume: 0.2, attack: 0.5, release: 1.6, reverb: 0.75, pan: 0.3, humanize: { time: 0.02, volume: 0.1 } },
    harp: { sample: 'harp', volume: 0.22, ring: true, reverb: 0.6, pan: -0.25, humanize: { time: 0.012, volume: 0.2 } },
    horn: { sample: 'hornsSoft', volume: 0.12, attack: 1.8, release: 2.5, reverb: 0.6, pan: -0.3 },
  },

  sections: {
    // The bell alone, neat and high. Four notes, then the stroke. The last
    // bar's fifth beat is not the stroke but the tune's first note again,
    // started and left hanging.
    tally: tight('tally', {
      bell: beats('G5 C6 E6 D6 . | G5 C6 E6 D6 . | G5 C6 E6 D6 . | G5 C6 E6 D6 G5'),
      stroke: beats('. . . . C4 | . . . . C4 | . . . . C4 | . . . . .'),
      drone: held(midi('C2'), 4 * BAR),
      violas: [...rest(1), ...held(midi('G3'), 3 * BAR)],
    }, 4),

    // Lower, on the piano, the third flattened. The hummer loses the end.
    worn: tight('worn', {
      piano: beats('G4 C5 Eb5 D5 . | G4 C5 Eb5 D5 . | G4 C5 Eb5 D5 . | G4 C5 Eb5 . .'),
      stroke: beats('. . . . C3 | . . . . C3 | . . . . Ab2 | . . . . .'),
      drone: held(midi('C2'), 4 * BAR),
      violas: [...held(midi('Eb4'), 2 * BAR), ...held(midi('Ab3'), 2 * BAR)],
      horn: [...rest(2), ...held(midi('Ab2'), 2 * BAR)],
    }, 4),

    // The sun: the hero's call, softly, a harp rocking under; the third
    // comes back in the bell.
    sun: tight('sun', {
      violin: [...CALL, ...rest(2)],
      harp: beats('C4 G4 C5 G4 E4 | C4 G4 C5 G4 E4 | Ab3 Eb4 Ab4 Eb4 C4 | G3 D4 G4 D4 B3'),
      bell: [...rest(2), ...beats('G5 C6 E6 D6 . | G5 C6 E6 D6 C6')],
      stroke: beats('. . . . . | . . . . . | . . . . C4 | . . . . .'),
      drone: held(midi('C2'), 4 * BAR),
      violas: held(midi('E4'), 4 * BAR),
    }, 4),

    // Stopped reaching: lower each bar, one note shorter, the stroke dropped
    // away, and in the end only the rock.
    lower: tight('lower', {
      piano: beats('G4 C5 E5 D5 . | G3 C4 E4 . . | G3 C4 . . . | G2 . . . .'),
      stroke: beats('. . . . C3 | . . . . C3 | . . . . . | . . . . .'),
      drone: held(midi('C2'), 4 * BAR),
      violas: [...held(midi('G3'), 3 * BAR), ...rest(1)],
    }, 4),
  },

  order: ['tally', 'worn', 'sun', 'lower'],
  loopFrom: 0,
};
