import { melody, chordLine, sustained, arpeggio, transpose, hits, repeat } from '../../audio/notation.js';
import { FLUTE, HARP, SOLO_VIOLIN, CONCERT_PIANO, STRING_SECTION, HORN, CELLO, LOW_STRINGS, BRASS, TIMPANI } from '../../audio/instruments.js';

// "Where the Road Began": the title screen's song once you've finished the
// Ruins (spared or beaten Taper). Before that the title plays "Once, a Promise"
// (prophecyTheme.js). This one answers it: the prophecy's melody on a flute
// over a harp, where the story began; then the credits' chorus ("So go on...",
// creditsTheme.js) on a solo violin over the turning piano figure, where it's
// going. Then it grows: the orchestra rises, and the chorus comes back up a
// step as an anthem, brass and drums and all, before settling to begin again.
// A minor, C major, then D major; 72 BPM, one step is an 8th note. A short
// harp opening plays once; then the rest loops (about two minutes):
//
//   promise   8 bars  the prophecy, flute and harp
//   onward    8 bars  the credits' chorus, violin and piano
//   rise      8 bars  low strings driving, horns climbing, drums rolling
//   anthem    8 bars  the chorus up a step, the whole orchestra
//   settle    4 bars  flute and harp, turning home to A minor

const BAR = 8;
const rest = (bars) => Array(bars * BAR).fill('.');

const RIPPLE = [0, 7, 12, 'tenth', 19, 'tenth', 12, 7];
const TURNING = [12, 19, 'tenth', 19, 12, 19, 'tenth', 19];
const DRIVE = [0, 0, 12, 0, 0, 12, 0, 12];
const ON_ONE = [0, '.', '.', '.', '.', '.', '.', '.'];
const ONE_AND_THREE = [0, '.', '.', '.', 7, '.', '.', '.'];
const ROLL = [0, 0, 0, 0, 0, 0, 0, 0];
const BOOM = hits('x.......');
const CRASH = hits('x.......');
const SNARE_BUILD = hits('x...x... x.x.x.x. xxxxxxxx xxxxxxxx');

const A_CHORDS = 'Am F C G Am F E E';
const B_CHORDS = 'F G Em Am F G C C';
const RISE_CHORDS = 'F G Am Am F G A A';
const ANTHEM_CHORDS = 'G A F#m Bm G A D D';
const SETTLE_CHORDS = 'Bm G E E';

// The prophecy, then a new answer to it.
const PROMISE = melody(`
  . . E5 - - - A5 - | C6 - - - B5 - A5 - | G5 - - - - - . . | . . E5 - G5 - C6 - |
  . . E5 - A5 - B5 - | C6 - - - A5 - F5 - | E5 - - - G#5 - B5 - | B5 - - - - - . . |
`, 1);

// The credits' chorus, in C.
const ONWARD = melody(`
  . C5 F5 - A5 G5 - F5 | G5 - - - D5 - . . | . B4 E5 - G5 E5 - B5 | A5 - - - E5 - . . |
  A4 C5 F5 - A5 G5 A5 - | B5 - - G5 D5 - . . | C5 E5 G5 - A5 G5 - D5 | E5 - - - C5 - - - |
`, 1);

// The rise: horns climbing in long notes, then in broken chords.
const CLIMB = melody(`
  A4 - - - - - C5 - | B4 - - - - - D5 - | C5 - - - E5 - - - | A5 - - - - - - - |
  A4 - C5 - F5 - A5 - | B4 - D5 - G5 - B5 - | C#5 - E5 - A5 - C#6 - | E6 - - - - - - - |
`, 1);
// The anthem: the chorus again, a step higher.
const ANTHEM = transpose(ONWARD, 2);
// Settling: turning back toward A minor.
const SETTLE = melody('F#5 - - - D5 - B4 - | D5 - - - - - . . | B4 - - - G#4 - B4 - | E5 - - - - - . .', 1);

export const TITLE_THEME = {
  title: 'Where the Road Began',
  bpm: 72,
  stepsPerBeat: 2,

  instruments: {
    flute: { ...FLUTE, volume: 0.06 },
    violin: { ...SOLO_VIOLIN, volume: 0.075 },
    harp: { ...HARP, volume: 0.032 },
    piano: { ...CONCERT_PIANO, volume: 0.05, pan: -0.2 },
    strings: { ...STRING_SECTION, volume: 0.02, pan: -0.3 },
    stringsHigh: { ...STRING_SECTION, volume: 0.016, pan: 0.3 },
    horn: { ...HORN, volume: 0.028 },
    cello: { ...CELLO, volume: 0.04 },
    violins: { ...STRING_SECTION, volume: 0.036, attack: 0.12, pan: 0.25 },
    lowStrings: { ...LOW_STRINGS, volume: 0.06, humanize: { time: 0.008, volume: 0.15 }, pan: -0.2, reverb: 0.4 },
    brass: { ...BRASS, volume: 0.055, humanize: { time: 0.01, volume: 0.1 }, reverb: 0.5 },
    timpani: { ...TIMPANI, volume: 0.1 },
    boom: { drum: 'boom', volume: 0.35 },
    snare: { drum: 'snare', volume: 0.07 },
    crash: { drum: 'crash', volume: 0.06 },
  },

  sections: {
    // The harp alone, as the title fades in.
    intro: {
      harp: arpeggio('Am F', BAR, 3, RIPPLE),
    },
    // The prophecy on the flute; the strings come in for its answer.
    promise: {
      flute: PROMISE,
      harp: arpeggio(A_CHORDS, BAR, 3, RIPPLE),
      cello: sustained(A_CHORDS, BAR, 0, 2),
      stringsHigh: [...rest(4), ...sustained('Am F E E', BAR, 2, 4)],
    },
    // The road on: the violin, the piano figure, the orchestra warm underneath.
    onward: {
      violin: ONWARD,
      piano: chordLine(B_CHORDS, TURNING, 3),
      cello: sustained(B_CHORDS, BAR, 0, 2),
      strings: sustained(B_CHORDS, BAR, 0, 3),
      stringsHigh: sustained(B_CHORDS, BAR, 2, 4),
      horn: sustained(B_CHORDS, BAR, 1, 4),
    },
    // The orchestra rises: low strings digging in, horns climbing, the
    // violin soaring over them, and the drums rolling up into a new key.
    rise: {
      horn: transpose(CLIMB, -12),
      violins: CLIMB,
      piano: chordLine(RISE_CHORDS, TURNING, 3),
      lowStrings: chordLine(RISE_CHORDS, DRIVE, 2),
      cello: sustained(RISE_CHORDS, BAR, 0, 2),
      strings: sustained(RISE_CHORDS, BAR, 0, 3),
      stringsHigh: sustained(RISE_CHORDS, BAR, 2, 4),
      timpani: [...chordLine('F G Am Am F G', ON_ONE, 2), ...chordLine('A A', ROLL, 2)],
      boom: [...BOOM, ...rest(3), ...BOOM, ...rest(3)],
      snare: [...rest(4), ...SNARE_BUILD],
    },
    // The anthem: the chorus up a step, the brass blaring it below the violin,
    // the strings doubling it, the drums hitting hard.
    anthem: {
      violin: ANTHEM,
      violins: ANTHEM,
      brass: transpose(ANTHEM, -12),
      horn: sustained(ANTHEM_CHORDS, BAR, 1, 4),
      piano: chordLine(ANTHEM_CHORDS, TURNING, 3),
      lowStrings: chordLine(ANTHEM_CHORDS, DRIVE, 2),
      cello: sustained(ANTHEM_CHORDS, BAR, 0, 2),
      strings: sustained(ANTHEM_CHORDS, BAR, 0, 3),
      stringsHigh: sustained(ANTHEM_CHORDS, BAR, 2, 4),
      timpani: chordLine(ANTHEM_CHORDS, ONE_AND_THREE, 2),
      boom: repeat(BOOM, 8),
      crash: [...CRASH, ...rest(3), ...CRASH, ...rest(3)],
    },
    // Settling back down: the flute and harp, turning home to A minor.
    settle: {
      flute: SETTLE,
      harp: arpeggio(SETTLE_CHORDS, BAR, 3, RIPPLE),
      cello: sustained(SETTLE_CHORDS, BAR, 0, 2),
      stringsHigh: sustained(SETTLE_CHORDS, BAR, 2, 4),
    },
  },

  order: ['intro', 'promise', 'onward', 'rise', 'anthem', 'settle'],
  loopFrom: 1,
};
