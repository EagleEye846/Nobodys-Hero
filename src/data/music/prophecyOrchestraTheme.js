import { CHOIR } from '../../audio/instruments.js';
import { arpeggio, sustained } from '../../audio/notation.js';
import { BAR, tune, rest, held, heldNotes, onNotes, transpose, cut } from './parts/chapter3.js';

// "Once, a Promise (Orchestra)": the prophecy's tune ("Once, a Promise",
// prophecyTheme.js), the music box from the title screen, played out in
// full by a real orchestra (the recordings in assets/audio/samples/). The
// old tale read aloud again, slowly, by more and more voices: a harp and
// a flute first, like the music box grown up; the cellos take it, low,
// with the clarinet turning round them; then all the strings, warm, over a
// bass that walks down under every bar. In the middle the tune turns to C
// major on the oboe over plucked violins, a kinder telling, until one
// borrowed chord (F minor) clouds it. Then almost nothing: a solo violin
// remembering the first three notes over a high shimmer, a timpani roll,
// and the whole orchestra on the tune at last, horns under the violins,
// the choir, and an A major chord at the end where the minor should be,
// like a promise kept. And the piano, alone again, to take it home.
// A minor, 66 BPM in 4/4, one step a 16th: a bar is 3.6 seconds. The harp
// plays once (15s); then it loops from the tale, 52 bars, about 3m09s:
//
//   intro   4 bars  the harp alone, a bowed shimmer, the cellos' low A
//   tale    8 bars  the tune on the flute over the harp, and the music box
//                   (a glockenspiel) far off, as it was
//   passed  8 bars  the cellos take it, an octave down, a little looser;
//                   the clarinet around them; Am Dm C Em F Dm E Am
//   warm    8 bars  all the strings: violins on the tune, violas a third
//                   under, the flute an octave up, soft horns holding the
//                   chords, the bass walking down under every bar
//   turn    8 bars  C major: the tune's shape on the oboe, over violin
//                   pizzicato and the harp; F minor (the one borrowed
//                   chord) on the seventh bar, and back
//   hush    4 bars  nearly nothing: a solo violin, the first notes and a
//                   long held C, a high tremolo, a timpani roll and the
//                   cymbal swelling into...
//   broad   8 bars  the whole orchestra: the tune on violins, flute and
//                   horns in three octaves, the choir, timpani on every
//                   bar, the harp sweeping; it ends on A major
//   home    8 bars  the piano alone with the tune, the strings holding on
//                   underneath, the solo violin low and kind; back round

// The tune, as the music box played it (each token an 8th).
const PROMISE = tune(`
  . . E5 - - - A5 - | C6 - - - B5 - A5 - | G5 - - - - - . . | . . E5 - G5 - C6 - |
  B5 - - - A5 - E5 - | F5 - - - A5 - - - | G#5 - - - - - B5 - | A5 - - - - - . . |
`);
const CHORDS = 'Am F C G Am F E Am';

// The cellos' telling: an octave down, a little looser (a turn in the
// second bar, a pickup into the fourth, the fifth bar leaning).
const PASSED = tune(`
  . . E4 - - A4 - - | C5 - - - B4 - A4/G4 A4 | G4 - - - - - . E4 | . . E4 - G4 - C5 - |
  B4 - - A4 - - E4 - | F4 - - - A4 - - - | G#4 - - - - - B4 - | A4 - - - - - . . |
`);
const PASSED_CHORDS = 'Am Dm C Em F Dm E Am';
// The clarinet, round them: long notes, mostly where the cellos breathe.
const CLARINET = tune(`
  C5 - - - - - B4 - | A4 - - - - - - - | E5 - - - D5 - C5 - | B4 - - - - - - - |
  . . . . C5 - - - | D5 - - - - - F5 - | E5 - - - D5 - B4 - | C5 - - - - - . . |
`);

// All the strings: C over G in the fourth bar, so the tune's high C rests.
const WARM_CHORDS = 'Am F C C Am F E Am';
// The violas, a third or a sixth under the tune.
const UNDER = tune(`
  . . C5 - - - E5 - | A4 - - - G4 - F4 - | E4 - - - - - . . | . . C5 - D5 - E5 - |
  E5 - - - C5 - C5 - | C5 - - - C5 - - - | B4 - - - - - D5 - | C5 - - - - - . . |
`);
// The bass, walking down under every bar (two notes a bar).
const WALK = heldNotes('A2 G2 F2 E2 C3 B2 C3 G2 A2 G2 F2 D2 E2 E2 A2 A2', BAR / 2);

// The turn: the tune's shape in C major on the oboe, up a third, slower,
// with F minor clouding the seventh bar.
const TURN_CHORDS = 'C Em Am G F C Fm G';
const TURN = tune(`
  G4 - - - C5 - - - | E5 - - - D5 - C5 - | C5 - - - B4 - - - | . . G4 - B4 - E5 - |
  F5 - - - E5 - C5 - | E5 - - - G5 - - - | Ab5 - - - G5 - F5 - | D5 - - - - - . . |
`);

// The hush: the first three notes of the tune, and a long C; then B.
const HUSH_CHORDS = 'F F E E';
const REMEMBER = tune(`
  . . E5 - - - A5 - | C6 - - - - - - - | . . . . . . . . | B5 - - - - - - - |
`);

// The end of everything: A major, where the tune's A minor was.
const BROAD_CHORDS = 'Am F C C Am F E A';
const UNDER_MAJOR = [...UNDER.slice(0, 7 * BAR), ...tune('C#5 - - - - - . .')];

// Home: the solo violin, low and kind, under the piano's tune.
const KIND = tune(`
  . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . |
  C5 - - - - - - - | C5 - - - A4 - - - | B4 - - - D5 - - - | C5 - - - - - . . |
`);

// Broken chords, in 8ths: root, fifth, tenth, octave, and back down.
const HARP_8THS = [0, '-', 7, '-', 'tenth', '-', 12, '-', 19, '-', 'tenth', '-', 12, '-', 7, '-'];
// Sweeping: open fifths and octaves (no third, so major or minor alike).
const HARP_SWEEP = [0, 7, 12, 19, 24, 19, 12, 7, 0, 7, 12, 19, 24, 31, 24, 19];
// The music box's own figure, as prophecyTheme.js plays it, in 8ths.
const BOX_SHAPE = [0, '-', 7, '-', 'third', '-', 12, '-', 'third', '-', 7, '-', 0, '-', 7, '-'];
// A hit on the first beat of every bar, on each named note.
const downbeats = (names) => onNotes(names, [0, ...rest(1).slice(1)]);

export const PROPHECY_ORCHESTRA_THEME = {
  title: 'Once, a Promise (Orchestra)',
  bpm: 66,
  stepsPerBeat: 4,
  volume: 0.8,

  instruments: {
    // The voices that carry the tune.
    flute: { sample: 'flute', volume: 0.34, attack: 0.08, release: 0.7, reverb: 0.55, pan: 0.2, humanize: { time: 0.012, volume: 0.08 } },
    oboe: { sample: 'oboe', volume: 0.32, attack: 0.06, release: 0.6, reverb: 0.55, pan: 0.15, humanize: { time: 0.012, volume: 0.08 } },
    clarinet: { sample: 'clarinet', volume: 0.24, attack: 0.1, release: 0.7, reverb: 0.55, pan: -0.3 },
    soloViolin: { sample: 'soloViolin', volume: 0.36, attack: 0.08, release: 0.7, reverb: 0.55, pan: 0.15, humanize: { time: 0.012, volume: 0.1 } },
    piano: { sample: 'grandPiano', volume: 0.34, ring: true, reverb: 0.5, humanize: { time: 0.012, volume: 0.12 } },
    // The strings, legato.
    violins: { sample: 'violins', volume: 0.3, attack: 0.12, release: 0.8, reverb: 0.5, pan: 0.25 },
    violas: { sample: 'violas', volume: 0.26, attack: 0.15, release: 0.8, reverb: 0.5, pan: -0.05 },
    cellos: { sample: 'cellos', volume: 0.34, attack: 0.1, release: 0.8, reverb: 0.45, pan: -0.25, humanize: { time: 0.012, volume: 0.08 } },
    bass: { sample: 'cellos', volume: 0.26, attack: 0.25, release: 1, reverb: 0.4, pan: -0.1 },
    shimmer: { sample: 'violinsTrem', volume: 0.08, attack: 1, release: 1.4, reverb: 0.65, pan: 0.35 },
    pizz: { sample: 'violinsPizz', volume: 0.18, ring: true, reverb: 0.5, pan: 0.3, humanize: { time: 0.01, volume: 0.2 } },
    plucks: { sample: 'bassSpic', volume: 0.3, release: 0.3, reverb: 0.4 },
    // The harp and the bells.
    harp: { sample: 'harp', volume: 0.3, ring: true, reverb: 0.55, pan: -0.2, humanize: { time: 0.01, volume: 0.15 } },
    musicBox: { sample: 'glock', volume: 0.07, ring: true, reverb: 0.65, pan: 0.4 },
    glow: { sample: 'vibesBowed', volume: 0.1, attack: 0.8, release: 1.6, reverb: 0.7, pan: 0.3 },
    // Brass and voices, for the end.
    hornsSoft: { sample: 'hornsSoft', volume: 0.3, attack: 0.3, release: 0.8, reverb: 0.5, pan: -0.1 },
    horns: { sample: 'horns', volume: 0.38, attack: 0.08, release: 0.5, reverb: 0.45, pan: -0.15, humanize: { time: 0.008, volume: 0.06 } },
    choir: { ...CHOIR, volume: 0.04 },
    // Percussion.
    timpani: { sample: 'timpani', volume: 0.5, ring: true, reverb: 0.4 },
    timpRoll: { sample: 'timpaniRoll', volume: 0.4, release: 0.4, reverb: 0.4 },
    swell: { sample: 'cymbalSwell', volume: 0.35, release: 0.04, reverb: 0.4 },
  },

  sections: {
    // The harp alone, the bowed shimmer, the cellos' low A.
    intro: {
      harp: arpeggio('Am F Am E', BAR, 3, HARP_8THS),
      glow: [...held(76, 2 * BAR), ...held(69, 2 * BAR)],
      bass: heldNotes('A2 A2 A2 A2', BAR),
    },

    // The tune on the flute; the music box far off.
    tale: {
      flute: PROMISE,
      harp: arpeggio(CHORDS, BAR, 3, HARP_8THS),
      musicBox: arpeggio(CHORDS, BAR, 6, BOX_SHAPE),
      bass: sustained(CHORDS, BAR, 0, 2),
      glow: sustained(CHORDS, BAR, 2, 4),
    },

    // The cellos take it; the clarinet around them.
    passed: {
      cellos: PASSED,
      clarinet: CLARINET,
      harp: arpeggio(PASSED_CHORDS, BAR, 3, HARP_8THS),
      violas: sustained(PASSED_CHORDS, BAR, 1, 4),
      bass: sustained(PASSED_CHORDS, BAR, 0, 2),
    },

    // All the strings, warm.
    warm: {
      violins: PROMISE,
      flute: transpose(PROMISE, 12),
      violas: UNDER,
      cellos: WALK,
      hornsSoft: sustained(WARM_CHORDS, BAR, 1, 3),
      harp: arpeggio(WARM_CHORDS, BAR, 3, HARP_8THS),
      plucks: downbeats('A1 F1 C2 C2 A1 F1 E1 A1'),
    },

    // C major on the oboe, over violin pizzicato; F minor, and back.
    turn: {
      oboe: TURN,
      pizz: arpeggio(TURN_CHORDS, BAR, 4, [0, '.', 7, '.', 'third', '.', 7, '.', 12, '.', 7, '.', 'third', '.', 7, '.']),
      harp: arpeggio(TURN_CHORDS, BAR, 3, [0, '-', '-', '-', 7, '-', '-', '-', 'tenth', '-', '-', '-', 12, '-', '-', '-']),
      clarinet: sustained(TURN_CHORDS, BAR, 1, 4),
      bass: sustained(TURN_CHORDS, BAR, 0, 2),
      glow: [...rest(4), ...sustained('F C Fm G', BAR, 2, 4)],
    },

    // Nearly nothing; then the roll and the swell, and a beat of silence.
    hush: {
      soloViolin: cut(REMEMBER, 2),
      shimmer: cut(heldNotes('E5 E5 E5 E5', BAR), 2),
      harp: cut(onNotes('F3 F3 E3 E3', [0, ...rest(1).slice(1)]), 2),
      bass: cut(heldNotes('F2 F2 E2 E2', BAR), 2),
      timpRoll: cut([...rest(3), ...held(52, BAR)], 2),
      // The swell peaks 3.18s in (sampleSets.js): 14 steps at this tempo.
      swell: [...Array(4 * BAR - 14).fill('.'), ...held(60, 14)],
    },

    // The whole orchestra on the tune; A major at the end.
    broad: {
      violins: PROMISE,
      flute: transpose(PROMISE, 12),
      horns: transpose(PROMISE, -12),
      violas: UNDER_MAJOR,
      cellos: WALK,
      hornsSoft: sustained(BROAD_CHORDS, BAR, 1, 3),
      choir: sustained(BROAD_CHORDS, BAR, 2, 4),
      harp: arpeggio(BROAD_CHORDS, BAR, 3, HARP_SWEEP),
      timpani: downbeats('A2 F2 C3 C3 A2 F2 E2 A2'),
      plucks: downbeats('A1 F1 C2 C2 A1 F1 E1 A1'),
    },

    // The piano alone again, with the strings holding on underneath.
    home: {
      piano: [...PROMISE],
      harp: arpeggio(CHORDS, BAR, 3, [0, '-', '-', '-', '-', '-', '-', '-', 12, '-', '-', '-', '-', '-', '-', '-']),
      soloViolin: KIND,
      violins: sustained(CHORDS, BAR, 2, 4),
      bass: sustained(CHORDS, BAR, 0, 2),
    },
  },

  // The harp plays once; then the tale goes round.
  order: ['intro', 'tale', 'passed', 'warm', 'turn', 'hush', 'broad', 'home'],
  loopFrom: 1,
};
