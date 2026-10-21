import { sustained } from '../../audio/notation.js';
import {
  BAR_128 as BAR, slow, eighths, rest as restBars, held, until as untilBars, transpose, midi,
  onNotes, heldNotes, patter, cells, drops,
} from './parts/chapter3.js';

// "The Quiet Way": the theme of the Lantern Marsh, Chapter 3's second
// region. Flat grey water, waist-deep mist, old lanterns on poles marking
// the one safe path, and lights out in the fog that look exactly like them.
// Where Ves came down. Written the way Christopher Larkin wrote Hollow
// Knight's City of Tears and its waterways: a harp turns three notes over
// and over, G D A, a stack of fifths, like rain on still water, and never
// changes; only the bass moves under it, so the same rain is G minor 9 one
// bar, E-flat with a sharp eleventh (the Lydian light) the next, then C, B
// flat, F, and D with its fourth hanging. Over it a lament in long notes on
// a viola's voice: it enters on the fifth, leans onto the flat sixth and
// falls back (Eb to D, the half step every lament has), and ends on the
// fifth, unresolved, so the mist never lifts. In the middle her motif
// grieves on the cellos at half speed (she's out here, hurt); and then the
// rain stops, the one time anything in the marsh stops, and a warped music
// box plays four bars of the tune from the lamplighter's hut dream
// (lanternTheme.js) with a soprano far out in the fog singing it with it,
// the dream's tritone hanging high above: lanterns leading travellers
// somewhere. Rolling 12/8 at 54 dotted quarters a minute, one step an 8th.
// The mist plays once (18s); then it loops from the lanterns, 36 bars, 2m40s:
//
//   mist       4 bars  the drone, water, a breath of choir; the rain begins
//   lanterns   8 bars  the lament low on the viola, the harp's rain
//   path       8 bars  the second tune on the piano, higher, toward Bb major;
//                      the viola answers with the first
//   hurt       8 bars  her motif grieving on the cellos, then the viola;
//                      the strings and choir swell, a heartbeat
//   wisps      4 bars  the rain stops: the dream's music box and a far voice
//                      over the drone and its tritone
//   home       8 bars  the lament with everything, the soprano on top; then
//                      the rain alone

// In 12/8 a bar is 12 steps.
const rest = (bars) => restBars(bars, BAR);
const until = (bars, track) => untilBars(bars, track, BAR);

// The rain: G D A on the harp, rising in 8ths, then once more an octave up.
const RAIN_CELL = 'G3 D4 A4 D5 A5';
const RAIN = [0, 1, 2, 3, 2, 1, 0, 1, 2, 4, 3, 2];
const rain = (bars) => patter(cells(RAIN_CELL, bars), RAIN);

// --- The harmony: what the bass makes of the rain, a bar each. ---
const LANTERN_BASS = 'G1 C2 Bb1 Eb2 Eb2 C2 F2 D2';
const LANTERN_CHORDS = 'Gm Cm Bb Eb Eb Cm F D';
const PATH_BASS = 'Eb2 Bb1 G1 Eb2 Bb1 F2 C2 D2';
const PATH_CHORDS = 'Eb Bb Gm Eb Bb F Cm D';
const HURT_BASS = 'G1 Eb2 C2 D2 G1 Eb2 C2 D2';
const HURT_CHORDS = 'Gm Eb Cm D Gm Eb Cm D';
const ONE = [0, ...Array(BAR - 1).fill('.')];
// The bass held all bar, a low string.
const LOW = [0, ...Array(BAR - 1).fill('-')];
// A heartbeat on the timpani's low G... the lowest it has is F#: so D, the
// fifth, long and short.
const HEART = [midi('D3'), '.', '.', '.', '.', midi('D3'), ...Array(BAR - 6).fill('.')];

// --- The lament (each token a dotted quarter). Fifth, flat sixth, fifth,
// fourth; third, fourth, fifth; the octave and down; and the fifth left
// hanging. ---
const LANTERNS = slow(`
  D4 - - Eb4 | D4 - C4 - | Bb3 - - C4 | D4 - - - |
  G4 - - F4 | Eb4 - D4 - | C4 - D4 Eb4 | D4 - - . |
`);
// The second tune, on the piano: from the octave down; and the fourth left
// hanging over D.
const PATH = slow(`
  G5 - - - | F5 - Eb5 - | D5 - - - | . . Bb4 C5 |
  D5 - - Eb5 | F5 - - - | Eb5 - D5 - | C5 - - - |
`);
// Under the second tune's second half, the lament's opening, as an answer.
const ANSWER = [...rest(4), ...LANTERNS.slice(0, 4 * BAR)];
// Her motif grieving, in G minor, at half speed (each token an 8th): two
// quick notes, up to the third and held, the fourth, the ninth, and the
// third again; the second time down to the root.
const HURT = eighths(`
  D3 D3 Bb3 - - - - - C4 - A3 - | Bb3 - - - - - - - - - . . |
  D3 D3 Bb3 - - - - - C4 - A3 - | A3 - - - - - G3 - - - - - |
`);
// The dream's music box (lanternTheme.js), carried from D into G: its tune
// keeps slipping a half step.
const DREAM_BOX = slow('G5 - Bb5 Ab5 | G5 - - . | D5 - F5 Eb5 | D5 - - . ');


export const MARSH_THEME = {
  title: 'The Quiet Way',
  bpm: 54,
  stepsPerBeat: 3,
  // An area theme, and a quiet one.
  volume: 0.7,

  instruments: {
    rain: { sample: 'harp', volume: 0.24, ring: true, reverb: 0.6, pan: -0.25, humanize: { time: 0.012, volume: 0.22 } },
    // The lament, low on the violas. Slow bow, long tail.
    viola: { sample: 'violas', volume: 0.36, attack: 0.12, release: 0.8, reverb: 0.55, pan: 0.1, humanize: { time: 0.015, volume: 0.1 } },
    // The far voice in the fog: a solo violin high up, slow bow, mostly hall.
    soprano: { sample: 'soloViolin', volume: 0.2, attack: 0.5, release: 1.4, reverb: 0.9, pan: 0.35 },
    violins: { sample: 'violins', volume: 0.22, attack: 0.4, release: 1, reverb: 0.55, pan: 0.3 },
    violinsHigh: { sample: 'violins', volume: 0.09, attack: 1.4, release: 1.6, reverb: 0.65, pan: -0.3 },
    cellos: { sample: 'cellos', volume: 0.32, attack: 0.25, release: 1, reverb: 0.5, pan: -0.2, humanize: { time: 0.015, volume: 0.1 } },
    low: { sample: 'cellos', volume: 0.22, attack: 0.8, release: 1.4, reverb: 0.5, pan: -0.1 },
    drone: { sample: 'cellos', volume: 0.28, attack: 1.5, release: 2, reverb: 0.5, pan: -0.1 },
    basses: { sample: 'bassSpic', volume: 0.28, release: 0.6, reverb: 0.45, humanize: { time: 0.01, volume: 0.15 } },
    piano: { sample: 'grandPiano', volume: 0.2, ring: true, reverb: 0.6, pan: 0.15, humanize: { time: 0.015, volume: 0.15 } },
    drops: { sample: 'grandPiano', volume: 0.1, ring: true, reverb: 0.7, pan: 0.4, humanize: { time: 0.03, volume: 0.3 } },
// Where a choir would breathe: the viola section, bowed so softly it's mostly air.
    choir: { sample: 'violas', volume: 0.13, attack: 1.4, release: 1.8, reverb: 0.75, pan: -0.15 },
    // A music box left somewhere damp: a glockenspiel, soft, with a long echo.
    musicBox: { sample: 'glock', volume: 0.16, ring: true, reverb: 0.6, pan: 0.3, echo: { time: 0.75, feedback: 0.42, mix: 0.4 } },
    // The rain stops, and a wine glass sings the tritone over the drone.
    glass: { sample: 'glass', volume: 0.1, attack: 1.2, release: 2, reverb: 0.8, pan: -0.3 },
    timpani: { sample: 'timpani', volume: 0.24, ring: true, reverb: 0.5 },
  },

  sections: {
    // The drone, water falling somewhere, a breath of choir; the rain
    // starts in the last two bars.
    mist: {
      drone: held(midi('G2'), 4 * BAR),
      drops: drops('Gm Gm Gm Gm', BAR, 0.12, 7, 1),
      choir: [...rest(1), ...sustained('Gm Gm Gm', BAR, 1, 4)],
      rain: [...rest(2), ...rain(2)],
    },

    // The lament, low, over the harp's rain; the bass makes the chords.
    lanterns: {
      rain: rain(8),
      viola: LANTERNS,
      low: transpose(onNotes(LANTERN_BASS, LOW), 12),
      basses: onNotes(LANTERN_BASS, ONE),
      drops: drops(LANTERN_CHORDS, BAR, 0.04, 3, 1),
    },

    // The second tune on the piano, higher, leaning toward Bb major; the
    // viola answers it with the lament's opening.
    path: {
      rain: rain(8),
      piano: PATH,
      viola: ANSWER,
      low: transpose(onNotes(PATH_BASS, LOW), 12),
      basses: onNotes(PATH_BASS, ONE),
      violinsHigh: sustained(PATH_CHORDS, BAR, 2, 5),
    },

    // She's out here, hurt: her motif on the cellos at half speed, then the
    // viola takes it an octave up; violins and choir swell over the rain, a
    // heartbeat under it.
    hurt: {
      rain: rain(8),
      cellos: [...HURT, ...rest(4)],
      viola: [...rest(4), ...transpose(HURT, 12)],
      violins: sustained(HURT_CHORDS, BAR, 1, 4),
      choir: sustained(HURT_CHORDS, BAR, 2, 3),
      low: transpose(onNotes(HURT_BASS, LOW), 12),
      basses: onNotes(HURT_BASS, ONE),
      timpani: [...rest(4), ...Array(4).fill(HEART).flat()],
    },

    // The rain stops. The dream's music box, a far voice singing it with it,
    // over the drone, and its tritone (C#) hanging high above.
    wisps: {
      musicBox: DREAM_BOX,
      soprano: DREAM_BOX,
      drone: held(midi('G2'), 4 * BAR),
      glass: held(midi('C#6'), 4 * BAR),
      drops: drops('Gm Gm Gm Gm', BAR, 0.08, 11, 1),
    },

    // The lament again with everything: violins in octaves with the viola,
    // the soprano an octave over them for the second half; the last two
    // bars, only the rain over the drone.
    home: {
      rain: rain(8),
      viola: until(6, LANTERNS),
      violins: until(6, transpose(LANTERNS, 12)),
      soprano: [...rest(4), ...transpose(LANTERNS.slice(4 * BAR, 6 * BAR), 12), ...rest(2)],
      cellos: until(6, heldNotes(LANTERN_BASS, BAR, 1)),
      choir: until(6, sustained(LANTERN_CHORDS, BAR, 1, 4)),
      low: until(6, transpose(onNotes(LANTERN_BASS, LOW), 12)),
      basses: until(6, onNotes(LANTERN_BASS, ONE)),
      drone: [...rest(6), ...held(midi('G2'), 2 * BAR)],
    },
  },

  // The mist plays once; then the marsh goes round from the lanterns.
  order: ['mist', 'lanterns', 'path', 'hurt', 'wisps', 'home'],
  loopFrom: 1,
};
