import { sustained, arpeggio } from '../../audio/notation.js';
import {
  slow, eighths, rest as restBars, held, until as untilBars, transpose, midi,
  onNotes, heldNotes, patter, cellsFor, drops,
} from './parts/chapter3.js';

// "Kept Sweet": the theme of the Old Drains, under Hollin's well
// (notes/docs/chapter-3-drains.md). Hollin's brick cistern and culverts,
// built down onto the old city's great stone water-conduit, which still
// carries the mountain's water on under the wood to a city that's gone.
// Dripping water, currents, the dark. Old Ladle, the cistern's hob, has kept
// the water sweet down here for fifty years for a village that isn't there
// any more. And Ves came this way: her chalk arrows on the brick, drawn lower
// and shakier the further you go, because she's hurt.
//
// Written the Chapter 3 way (Larkin's City of Tears), and a cousin of the
// marsh's song ("The Quiet Way", marshTheme.js), since the drains are where
// the marsh's water comes from. But where the marsh's rain rises all bar
// long on a harp, here it drips: plucked violins drop three notes, C G D, a
// stack of fifths, down and back up in 8ths (D G C G), then a hitch, and
// again. Four drips in a bar of three beats, so they never quite land with
// it, and an echo off the brick fills the gaps. The drips never change,
// except once a loop: on a D flat chord the D slips to D flat. The bass
// moves under them, so the same drips are C minor with the ninth, A flat
// with the major seventh and the sharp eleventh (the Lydian light), F minor
// six-nine (the Dorian colour), B flat six-nine, E flat with its sixth, G
// with its fourth hanging, and D flat (the flat second, the Neapolitan: a
// wrong turn in the dark).
//
// The tune is long notes low on the violas: up the C minor chord to the
// major seventh of A flat, down by step, then up again to the top C and down
// through the flat sixth to the fifth (A flat to G: the same half-step lean
// as the marsh's lament, E flat to D), and the fifth of G left open.
//
// The one quote: Ves's motif ("Carried on the Wind", vesTheme.js: C C, up to
// A, Bb G A), in C minor at its plain speed (G G, up to E flat, F D E flat),
// on bowed vibes with a damp echo, low: her chalk arrows. Three times, each
// a step lower and later, and the third gives up after four notes, one short.
// A heartbeat under it.
//
// Then Ladle's Nook: the drips go on, but the bass turns to E flat major, and
// a clarinet plays a little homely tune, long-short like a jig, with a
// plucked walking bass and a piano by the fire; a flute joins it. Then the
// old city's stone: the bass sinks onto a G and stays there (the marsh's home
// note), a horn holds it, tremolo violins swell, and far off a solo violin
// plays the first notes of the marsh's lament (D, E flat, D, C, B flat): the
// way on. The swell rises to B natural, and a timpani roll brings the tune
// back home with everything.
//
// C minor (Aeolian, with A flat Lydian colour, the Dorian F minor six-nine,
// and one Neapolitan D flat), E flat major for Ladle. 9/8 at 56 dotted
// quarters a minute, one step an 8th: a bar is 9 steps and 3.2 seconds. The
// well plays once (13s); then it loops from the cistern, 36 bars, 1m56s:
//
//   well     4 bars  a low C, one drip and its echo; the drips begin; a
//                    glass note
//   cistern  8 bars  inside: the tune low on the violas over the drips and
//                    the moving bass
//   chalk    8 bars  her motif on bowed vibes, three times, each lower, the
//                    last one breaking off; the violas answering; a
//                    heartbeat; the drips slip to D flat once
//   ladle    8 bars  E flat major: the clarinet's homely tune, a plucked
//                    walking bass, the piano by the fire, then a flute
//   conduit  4 bars  the old stone: a G pedal, a horn, tremolo violins
//                    swelling; the marsh's lament far off; a timpani roll
//   home     8 bars  outside: the tune high on a solo violin with the violas,
//                    a clarinet inside, strings, a horn, the harp catching
//                    the drips; then only the drips and the violas

// In 9/8 a bar is 9 steps.
const BAR = 9;
const rest = (bars) => restBars(bars, BAR);
const until = (bars, track) => untilBars(bars, track, BAR);

// --- The drips: C G D on plucked violins, falling D G C, back to G, a
// hitch. Only on the Neapolitan D flat does the D give way. ---
const DRIP_CELL = 'C5 G5 D6';
const DRIP = [2, '.', 1, '.', 0, '.', 1, '.', '.'];
const DRIP_TABLE = { Db: 'C5 G5 Db6' };
const dripsOn = (chords, octave = 0) => transpose(patter(cellsFor(chords, DRIP_TABLE, DRIP_CELL), DRIP), 12 * octave);
const same = (chord, bars) => Array(bars).fill(chord).join(' ');

// --- The harmony: what the bass makes of the drips, a bar each. ---
const A_CHORDS = 'Cm Ab Fm Bb Eb Ab Fm G';
const A_BASS = 'C2 Ab1 F1 Bb1 Eb2 Ab1 F1 G1';
const B_CHORDS = 'Ab Eb Fm Cm Ab Fm Db G';
const B_BASS = 'Ab1 Eb2 F1 C2 Ab1 F1 Db2 G1';
const C_CHORDS = 'Eb Bb Cm Ab Eb Ab Bb Bb';
const C_BASS = 'Eb2 Bb1 C2 Ab1 Eb2 Ab1 Bb1 Bb1';
// The bass: a plucked double bass on the one, and the cellos holding the
// note an octave up all bar.
const ONE = [0, ...Array(BAR - 1).fill('.')];
const LOW = [0, ...Array(BAR - 1).fill('-')];
const basses = (names) => onNotes(names, ONE);
const low = (names) => transpose(onNotes(names, LOW), 12);
// Ladle's walking bass, plucked: the root, the fifth, the octave (written
// higher than the bass line, where the plucked cellos have recordings).
const C_WALK = 'Eb2 Bb2 C2 Ab2 Eb2 Ab2 Bb2 Bb2';
const walk = (names) => onNotes(names, [0, '.', '.', 7, '.', '.', 12, '.', '.']);

// --- The tune (each token a dotted quarter: three to a bar). Up the C minor
// chord to A flat's major seventh; down by step to B flat's third. Then up
// to the top C, down through the flat sixth to the fifth, and G's fifth left
// open. ---
const TUNE = slow(`
  C4 - Eb4 | G4 - - | F4 - Eb4 | D4 - - |
  Eb4 - G4 | C5 - Bb4 | Ab4 - G4 | D4 - - |
`);

// --- Chalk: her motif in C minor (each token an 8th), G G, up the minor
// sixth to E flat, F D E flat. Each time a step lower; the third time it
// stops on the D, one short of home. ---
const CHALK = eighths(`
  G4 G4 Eb5 - - F5 D5 Eb5 - | . . . . . . . . . |
  . F4 F4 D5 - - Eb5 C5 D5 | - . . . . . . . . |
  . . Eb4 Eb4 C5 - - D5 - | - - . . . . . . . |
  . . . . . . . . . | . . . . . . . . . |
`);
// The violas answering her in the gaps: a fragment of the tune, and its end.
const CHALK_ANSWER = slow(`
  . . . | Bb3 - C4 | . . . | Eb4 - D4 |
  . . . | . . . | Ab4 - G4 | D4 - - |
`);
// A heartbeat on G, twice a bar, for the last four bars.
const HEART = [midi('G2'), '.', midi('G2'), ...Array(BAR - 3).fill('.')];

// --- Ladle: a homely tune on the clarinet, long-short like a jig (each
// token an 8th). ---
const LADLE = eighths(`
  G4 - Ab4 Bb4 - G4 Eb4 - - | F4 - G4 Ab4 - F4 D4 - - |
  Eb4 - F4 G4 - Eb4 C5 - - | Bb4 - Ab4 G4 - - - - - |
  G4 - Ab4 Bb4 - G4 Eb5 - - | Eb5 - C5 Ab4 - C5 Bb4 - - |
  Ab4 - G4 F4 - G4 Ab4 - - | G4 - - F4 - - - - - |
`);
// The piano by the fire: the chord broken on the beats, low and warm.
const FIRESIDE = arpeggio(C_CHORDS, BAR, 3, [0, '.', '.', 'third', '.', '.', 7, '.', '.']);

// --- The conduit: the first notes of the marsh's lament (marshTheme.js),
// far off over the G. ---
const MARSH_CALL = slow('. . . | D5 - Eb5 | D5 - C5 | Bb4 - - ');

// --- Home's inner line: a clarinet, long notes under the voice. ---
const INNER = slow(`
  G4 - - | Eb4 - - | C4 - - | Bb3 - F4 |
  G4 - - | Eb4 - - | C4 - - | B3 - - |
`);

export const DRAINS_THEME = {
  title: 'Kept Sweet',
  bpm: 56,
  stepsPerBeat: 3,
  // An area theme, and a quiet, dark one.
  volume: 0.66,

  instruments: {
    // The drips: plucked violins, with an echo off the brick two 8ths later.
    drips: { sample: 'violinsPizz', volume: 0.16, ring: true, reverb: 0.6, pan: -0.2, humanize: { time: 0.012, volume: 0.25 }, echo: { time: 0.714, feedback: 0.3, mix: 0.3 } },
    // A harp catching the drips an octave down, for outside.
    harp: { sample: 'harp', volume: 0.1, ring: true, reverb: 0.6, pan: 0.25, humanize: { time: 0.014, volume: 0.22 } },
    // The tune, low on the violas: slow bow, long tail.
    viola: { sample: 'violas', volume: 0.34, attack: 0.15, release: 0.9, reverb: 0.55, pan: 0.1, humanize: { time: 0.015, volume: 0.1 } },
    // The voice: a solo violin high up, slow bow, mostly hall.
    voice: { sample: 'soloViolin', volume: 0.28, attack: 0.45, release: 1.3, reverb: 0.85, pan: 0.3, humanize: { time: 0.015, volume: 0.08 } },
    violins: { sample: 'violins', volume: 0.12, attack: 1, release: 1.4, reverb: 0.6, pan: 0.3 },
    // Tremolo violins swelling up out of the dark, for the old stone.
    swell: { sample: 'violinsTrem', volume: 0.12, attack: 2.2, release: 1.6, reverb: 0.65, pan: -0.3 },
    // Where a choir would breathe: the viola section, bowed so softly it's mostly air.
    choir: { sample: 'violas', volume: 0.1, attack: 1.4, release: 1.8, reverb: 0.75, pan: -0.15 },
    cellos: { sample: 'cellos', volume: 0.18, attack: 0.8, release: 1.4, reverb: 0.5, pan: -0.1 },
    basses: { sample: 'bassSpic', volume: 0.26, release: 0.6, reverb: 0.45, humanize: { time: 0.01, volume: 0.15 } },
    drone: { sample: 'cellos', volume: 0.24, attack: 1.4, release: 2, reverb: 0.5, pan: -0.1 },
    // Her chalk: bowed vibes, low, with a damp echo; a little unsteady.
    chalk: { sample: 'vibesBowed', volume: 0.3, attack: 0.25, release: 1.4, reverb: 0.75, pan: 0.35, humanize: { time: 0.025, volume: 0.15 }, echo: { time: 1.07, feedback: 0.35, mix: 0.35 } },
    heart: { sample: 'timpani', volume: 0.14, ring: true, reverb: 0.45 },
    // Ladle's: the clarinet's tune, a flute with it, a plucked walking bass,
    // and the piano by the fire.
    clarinet: { sample: 'clarinet', volume: 0.2, attack: 0.06, release: 0.6, reverb: 0.5, pan: -0.15, humanize: { time: 0.015, volume: 0.12 } },
    inner: { sample: 'clarinet', volume: 0.07, attack: 0.3, release: 1, reverb: 0.6, pan: -0.3, humanize: { time: 0.015, volume: 0.1 } },
    flute: { sample: 'flute', volume: 0.09, attack: 0.1, release: 0.7, reverb: 0.6, pan: 0.25, humanize: { time: 0.015, volume: 0.1 } },
    walk: { sample: 'cellosPizz', volume: 0.2, release: 0.6, reverb: 0.4, pan: -0.1, humanize: { time: 0.01, volume: 0.15 } },
    fireside: { sample: 'grandPiano', volume: 0.1, ring: true, reverb: 0.55, pan: 0.15, humanize: { time: 0.015, volume: 0.2 } },
    horn: { sample: 'hornsSoft', volume: 0.28, attack: 0.7, release: 1.3, reverb: 0.6, pan: -0.15 },
    // A held breath: a wine glass, singing.
    glass: { sample: 'glass', volume: 0.06, attack: 1.5, release: 2, reverb: 0.8, pan: 0.25 },
    // Water falling somewhere: now and then one high piano note, left to ring.
    drops: { sample: 'grandPiano', volume: 0.07, ring: true, reverb: 0.75, pan: 0.4, humanize: { time: 0.03, volume: 0.3 } },
    roll: { sample: 'timpaniRoll', volume: 0.14, attack: 2.6, release: 0.6, reverb: 0.5 },
  },

  sections: {
    // A low C. One drip, and its echo off the brick; then the drips begin,
    // and a glass note hangs over them.
    well: {
      drone: heldNotes('C2 C2 C2 C2', BAR),
      drips: [midi('D6'), ...Array(BAR - 1).fill('.'), ...dripsOn(same('Cm', 3))],
      glass: [...rest(2), ...held(midi('G5'), 2 * BAR)],
      drops: [...rest(1), ...drops(same('Cm', 3), BAR, 0.15, 9, 3)],
    },

    // Inside: the tune low on the violas; the bass makes the chords.
    cistern: {
      drips: dripsOn(A_CHORDS),
      viola: TUNE,
      cellos: low(A_BASS),
      basses: basses(A_BASS),
      drops: drops(A_CHORDS, BAR, 0.06, 13, 3),
    },

    // Chalk: her motif on bowed vibes, three times, each a step lower and
    // later, the last one breaking off; the violas answer in the gaps; a
    // breath of choir, a glass note, a heartbeat; and the drips slip to
    // D flat once.
    chalk: {
      drips: dripsOn(B_CHORDS),
      chalk: CHALK,
      viola: CHALK_ANSWER,
      choir: sustained(B_CHORDS, BAR, 1, 3),
      cellos: low(B_BASS),
      basses: basses(B_BASS),
      glass: [...rest(5), ...held(midi('Eb5'), 2 * BAR), ...rest(1)],
      heart: [...rest(4), ...Array(4).fill(HEART).flat()],
    },

    // Ladle's Nook: the drips go on, but the bass turns to E flat major.
    // The clarinet's homely tune, a plucked walking bass, the piano by the
    // fire; a flute joins in an octave up for the second half.
    ladle: {
      drips: dripsOn(C_CHORDS),
      clarinet: LADLE,
      flute: [...rest(4), ...transpose(LADLE.slice(4 * BAR), 12)],
      walk: walk(C_WALK),
      basses: basses(C_BASS),
      fireside: FIRESIDE,
      cellos: low(C_BASS),
      choir: [...rest(4), ...sustained(C_CHORDS.split(' ').slice(4).join(' '), BAR, 1, 3)],
    },

    // The old city's stone: the bass sinks onto G and stays, a horn holds
    // it, tremolo violins swell up to B natural; far off a solo violin plays
    // the start of the marsh's lament; a timpani roll back to the cistern.
    conduit: {
      drips: dripsOn(same('G', 4)),
      drone: heldNotes('G2 G2 G2 G2', BAR),
      basses: basses('G1 G1 G1 G1'),
      horn: [...rest(1), ...held(midi('G2'), 3 * BAR)],
      swell: heldNotes('D4 Eb4 D4 B3', BAR),
      voice: MARSH_CALL,
      roll: [...rest(3), ...held(midi('G2'), BAR)],
    },

    // Outside: the tune high on the solo violin with the violas under it, a
    // clarinet's inner line, strings, a breath of choir, a horn, the harp
    // catching the drips; the last two bars only the drips, the low C and
    // the violas finishing the tune.
    home: {
      drips: dripsOn(A_CHORDS),
      harp: until(6, dripsOn(A_CHORDS, -1)),
      voice: until(6, transpose(TUNE, 12)),
      viola: TUNE,
      inner: until(6, INNER),
      violins: until(6, sustained(A_CHORDS, BAR, 2, 3)),
      choir: until(6, sustained(A_CHORDS, BAR, 1, 3)),
      horn: until(6, heldNotes('C3 Ab2 F2 Bb2 Eb3 Ab2 F2 G2', BAR)),
      cellos: until(6, low(A_BASS)),
      basses: until(6, basses(A_BASS)),
      drone: [...rest(6), ...heldNotes('C2 C2', BAR)],
    },
  },

  // The well plays once; then the drains go round from the cistern.
  order: ['well', 'cistern', 'chalk', 'ladle', 'conduit', 'home'],
  loopFrom: 1,
};
