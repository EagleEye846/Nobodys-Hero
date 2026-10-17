import { melody, chordLine, sustained, arpeggio } from '../../audio/notation.js';
import { FLUTE, HARP, SOLO_VIOLIN, STRING_SECTION, HORN, PIZZICATO_BASS } from '../../audio/instruments.js';

// "The Long Stair": the theme of the mountain, Chapter 2. Open air after the
// Ruins: a flute over a rippling harp and plucked basses, strings swelling in.
// In the middle a solo violin brings back the credits' chorus ("So go on...",
// creditsTheme.js), because now you're really on that road; then the music
// climbs, the way the stair does, and starts again.
// D major, 96 BPM, one step is an 8th note. Loops (about a minute).

const BAR = 8;
const RIPPLE = [0, 7, 12, 'tenth', 19, 'tenth', 12, 7];
const PLUCK = [0, '.', '.', '.', 7, '.', '.', '.'];

const A_CHORDS = 'D A Bm G D A G A';
const B_CHORDS = 'G A F#m Bm G A D D';
const C_CHORDS = 'Em F#m G A Em F#m G A';

// Setting out: the flute's tune, looking up the mountain.
const SETTING_OUT = melody(`
  A4 - D5 - F#5 - A5 - | G5 - - E5 C#5 - E5 - | F#5 - - - D5 - B4 - | D5 - - - - - . . |
  A4 - D5 - F#5 - A5 - | B5 - A5 - G5 - E5 - | G5 - F#5 - E5 - D5 - | E5 - - - - - . . |
`, 1);

// The road: the credits' chorus, on the violin.
const THE_ROAD = melody(`
  . D5 G5 - B5 A5 - G5 | A5 - - - E5 - . . | . C#5 F#5 - A5 F#5 - C#6 | B5 - - - F#5 - . . |
  B4 D5 G5 - B5 A5 B5 - | C#6 - - A5 E5 - . . | D5 F#5 A5 - B5 A5 - E5 | F#5 - - - D5 - - - |
`, 1);

// The climb: the flute higher and higher, then round again.
const THE_CLIMB = melody(`
  B5 - - - A5 - G5 - | A5 - - - F#5 - E5 - | D5 - E5 - G5 - B5 - | A5 - - - - - . . |
  B5 - - - A5 - G5 - | C#6 - - - B5 - A5 - | B5 - A5 - G5 - E5 - | E5 - - - C#5 - - - |
`, 1);

const ground = (chords) => ({ harp: arpeggio(chords, BAR, 3, RIPPLE), bass: chordLine(chords, PLUCK, 2) });

export const STAIR_THEME = {
  title: 'The Long Stair',
  bpm: 96,
  stepsPerBeat: 2,

  instruments: {
    flute: { ...FLUTE, volume: 0.075 },
    violin: { ...SOLO_VIOLIN, volume: 0.065 },
    harp: { ...HARP, volume: 0.04 },
    bass: { ...PIZZICATO_BASS, volume: 0.1 },
    strings: { ...STRING_SECTION, volume: 0.02, pan: -0.3 },
    stringsHigh: { ...STRING_SECTION, volume: 0.016, pan: 0.3 },
    horn: { ...HORN, volume: 0.03 },
  },

  sections: {
    settingOut: { flute: SETTING_OUT, ...ground(A_CHORDS) },
    theRoad: {
      violin: THE_ROAD,
      ...ground(B_CHORDS),
      strings: sustained(B_CHORDS, BAR, 0, 3),
      stringsHigh: sustained(B_CHORDS, BAR, 2, 4),
    },
    theClimb: {
      flute: THE_CLIMB,
      ...ground(C_CHORDS),
      strings: sustained(C_CHORDS, BAR, 0, 3),
      stringsHigh: sustained(C_CHORDS, BAR, 2, 4),
      horn: sustained(C_CHORDS, BAR, 1, 4),
    },
  },

  order: ['settingOut', 'theRoad', 'theClimb'],
};
