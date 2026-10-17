import { melody, chordLine, sustained, transpose, hits, repeat } from '../../audio/notation.js';
import { SongBuilder, lyricLine } from '../../audio/songBuilder.js';
import { CONCERT_PIANO, SOLO_VIOLIN, CELLO, HORN, STRING_SECTION, TIMPANI, PIZZICATO_BASS, LOW_STRINGS, BRASS } from '../../audio/instruments.js';

// "The Morning Past the Hill": the credits song, after you leave the Ruins.
// An original piece for piano, solo violin and orchestra, in the spirit of
// "Don't Forget" and the piano arrangement of "Field of Hopes and Dreams":
// a quiet piano figure turning over and over like wheels on a road, and a
// violin singing the tune, starting uncertain in B minor and lifting into
// D major, then up again to E major for the last chorus. Nobody sings, but
// the words show at the bottom of the credits as the violin plays them
// (see `lyrics`). 84 BPM, one step is an 8th note. Plays once: three minutes.
//
//   intro       4 bars  the piano figure alone, the cello underneath
//   verse 1     8 bars  the violin enters
//   verse 2     8 bars  strings join
//   chorus      8 bars  the orchestra lifts it into D major, low strings driving
//   interlude   4 bars  a horn remembers the tune
//   verse 3     8 bars  pared back: plucked basses, the piano, the violin
//   bridge      8 bars  wider, building, rolling drums turning toward a new key
//   chorus      8 bars  up a step, everything: brass, cymbals, the lot
//   outro       7 bars  one last swell, then the figure, the violin, one last chord

const BAR = 8;
const song = new SongBuilder('The Morning Past the Hill', [
  'violin', 'violins', 'piano', 'cello', 'lowStrings', 'horn', 'brass', 'strings', 'stringsHigh', 'timpani', 'pizz', 'boom', 'snare', 'crash',
], BAR, 'violin');
const rest = (bars) => song.rest(bars);
const wordless = (text) => ({ notes: melody(text, 1), syllables: [] });

// --- Patterns, as semitones above each chord's root. ---
// The piano figure: the same few notes turning over.
const TURNING = [12, 19, 'tenth', 19, 12, 19, 'tenth', 19];
const LAST_TURN = [12, 19, 'tenth', 24, '-', '-', '-', '-'];
// Held chords for the bridge, where the figure stops turning.
const HALVES = [12, '-', '-', '-', 'tenth', '-', '-', '-'];
const ON_ONE = [0, '.', '.', '.', '.', '.', '.', '.'];
const ROLL = [0, 0, 0, 0, 0, 0, 0, 0];
const PLUCK = [0, '.', '.', '.', 7, '.', '.', '.'];
// Low strings digging in, driving the big parts along.
const DRIVE = [0, 0, 12, 0, 0, 12, 0, 12];
const ONE_AND_THREE = [0, '.', '.', '.', 7, '.', '.', '.'];

// Drums: a bass drum on each bar, a cymbal, and a snare roll building.
const BOOM = hits('x.......');
const CRASH = hits('x.......');
const SNARE_BUILD = hits('x...x... x.x.x.x. xxxxxxxx xxxxxxxx');

const pad = (chords) => ({
  strings: sustained(chords, BAR, 0, 3),
  stringsHigh: sustained(chords, BAR, 2, 4),
});
const down = (steps) => transpose(steps, -12);

// --- The tunes and the words. ---
const VERSE_TUNE = [
  '. . F#5 A5 B5 - C#6 D6 | B5 - G5 - - - . .',
  '. . F#5 G5 A5 - F#5 D5 | E5 - C#5 - - - . .',
  '. . F#5 A5 B5 - D6 C#6 | B5 - A5 - G5 - . .',
  '. . E5 F#5 G5 - B5 A5 | A#5 - F#5 - - - . .',
];
const verse = (...lines) => lines.map((words, i) => lyricLine(VERSE_TUNE[i], words));

const CHORUS_TUNE = [
  '. D5 G5 - B5 A5 - G5 | A5 - - - E5 - . .',
  '. C#5 F#5 - A5 F#5 - C#6 | B5 - - - F#5 - . .',
  'B4 D5 G5 - B5 A5 B5 - | C#6 - - A5 E5 - . .',
  'D5 F#5 A5 - B5 A5 - E5 | F#5 - - - D5~ - - -',
];
const CHORUS_WORDS = [
  'So go on, and don\'t look back,',
  'there\'s a morn-ing past the hill,',
  'you were nev-er what they wait-ed for,',
  'but you came, and that\'s e-nough.',
];
const chorus = (semitones = 0) => CHORUS_WORDS.map((words, i) => {
  const { notes, syllables } = lyricLine(CHORUS_TUNE[i], words);
  return { notes: transpose(notes, semitones), syllables };
});

const VERSE_CHORDS = 'Bm G D A Bm G Em F#';
const CHORUS_CHORDS = 'G A F#m Bm G A D D';
const BRIDGE_CHORDS = 'G A F#m Bm Em G B B';
const LAST_CHORUS_CHORDS = 'A B G#m C#m A B E E';
const OUTRO_CHORDS = 'C#m A E B C#m B E';

// --- The song, in order. ---

// The figure alone; the cello comes in under it.
song.part(4, {
  piano: chordLine('Bm G D A', TURNING, 3),
  cello: [...rest(2), ...sustained('D A', BAR, 0, 2)],
});

// The violin enters; the cello halfway.
song.part(8, {
  piano: chordLine(VERSE_CHORDS, TURNING, 3),
  cello: [...rest(4), ...sustained('Bm G Em F#', BAR, 0, 2)],
}, verse(
  'Past the door the world is wide,',
  'and the sky is not a stone,',
  'ev-ry road you\'ll ev-er walk on',
  'some-one walked it long a-go.',
));

// The strings join, softly.
song.part(8, {
  piano: chordLine(VERSE_CHORDS, TURNING, 3),
  cello: sustained(VERSE_CHORDS, BAR, 0, 2),
  ...pad(VERSE_CHORDS),
}, verse(
  'You will meet them on the way,',
  'strang-ers turn-ing in-to friends,',
  'and you\'ll leave a lit-tle of you',
  'ev-ry-where you\'ve ev-er been.',
));

// The orchestra lifts the chorus into the light.
song.part(8, {
  piano: chordLine(CHORUS_CHORDS, TURNING, 3),
  cello: sustained(CHORUS_CHORDS, BAR, 0, 2),
  // Held back a little, so the last chorus can go further.
  lowStrings: chordLine(CHORUS_CHORDS, DRIVE, 2).map((n, i) => (i % 2 ? '.' : n)),
  horn: sustained(CHORUS_CHORDS, BAR, 1, 4),
  violins: down(chorus().flatMap((line) => line.notes)),
  ...pad(CHORUS_CHORDS),
  timpani: [...chordLine('G', ON_ONE, 2), ...rest(5), ...chordLine('D', ROLL, 2), ...chordLine('D', ON_ONE, 2)],
  boom: [...BOOM, ...rest(3), ...BOOM, ...rest(3)],
  crash: [...CRASH, ...rest(7)],
}, chorus());

// A horn remembers the tune, far off; the violin rests.
song.part(4, {
  piano: chordLine('Bm G D A', TURNING, 3),
  horn: melody('F#4 - B4 - D5 - C#5 B4 | G4 - - - B4 - - - | A4 - D5 - F#5 - E5 D5 | E5 - - - C#5 - - -', 1),
  cello: sustained('Bm G D A', BAR, 0, 2),
  strings: sustained('Bm G D A', BAR, 0, 3),
});

// Pared right back: plucked basses, the figure, the violin.
song.part(8, {
  piano: chordLine(VERSE_CHORDS, TURNING, 3),
  pizz: chordLine(VERSE_CHORDS, PLUCK, 2),
  stringsHigh: [...rest(4), ...sustained('Bm G Em F#', BAR, 2, 4)],
}, verse(
  'When the nights are long and cold,',
  'and the stars are hard to see,',
  'there are old and gen-tle voi-ces',
  'who will al-ways know the way.',
));

// The figure stops turning: wide held chords, building, the timpani rolling
// up into the last chorus.
song.part(8, {
  piano: chordLine(BRIDGE_CHORDS, HALVES, 3),
  cello: sustained(BRIDGE_CHORDS, BAR, 0, 2),
  horn: sustained(BRIDGE_CHORDS, BAR, 1, 4),
  lowStrings: [...rest(4), ...chordLine('Em G B B', DRIVE, 2)],
  ...pad(BRIDGE_CHORDS),
  timpani: [...rest(4), ...chordLine('Em G', ON_ONE, 2), ...chordLine('B B', ROLL, 2)],
  boom: [...rest(4), ...repeat(BOOM, 4)],
  snare: [...rest(4), ...SNARE_BUILD],
}, [
  lyricLine('. . B4 D5 G5 - F#5 G5 | A5 - E5 - C#5 - . .', 'Some-day the road will lead you back'),
  lyricLine('. . A4 C#5 F#5 - E5 F#5 | D5 - B4 - F#5 - . .', 'to where the sto-ry first be-gan,'),
  lyricLine('. . G5 F#5 E5 - G5 B5 | D6 - B5 - - - . .', 'and you\'ll see it with new eyes,'),
  lyricLine('. . D#5 F#5 B5 - - - | A5 - - - F#5 - - -', 'and you\'ll un-der-stand.'),
]);

// Up a step: everything at once. The brass blares the tune below the violin,
// the strings double it, the horns hold the harmony, and the drums hit hard.
const LAST_CHORUS = chorus(2);
const LAST_TUNE = LAST_CHORUS.flatMap((line) => line.notes);
song.part(8, {
  piano: chordLine(LAST_CHORUS_CHORDS, TURNING, 3),
  cello: sustained(LAST_CHORUS_CHORDS, BAR, 0, 2),
  lowStrings: chordLine(LAST_CHORUS_CHORDS, DRIVE, 2),
  brass: down(LAST_TUNE),
  violins: LAST_TUNE,
  horn: sustained(LAST_CHORUS_CHORDS, BAR, 1, 4),
  ...pad(LAST_CHORUS_CHORDS),
  timpani: chordLine(LAST_CHORUS_CHORDS, ONE_AND_THREE, 2),
  boom: repeat(BOOM, 8),
  crash: [...CRASH, ...rest(3), ...CRASH, ...rest(3)],
}, LAST_CHORUS);

// The road goes on: one last "go on", the violin alone, and a final chord.
song.part(7, {
  piano: [...chordLine('C#m A E B C#m B', TURNING, 3), ...chordLine('E', LAST_TURN, 3)],
  cello: sustained(OUTRO_CHORDS, BAR, 0, 2),
  brass: [...sustained('C#m A', BAR, 1, 3), ...rest(5)],
  horn: [...sustained('C#m A', BAR, 2, 3), ...rest(5)],
  strings: [...sustained('C#m A', BAR, 0, 3), ...rest(5)],
  timpani: [...chordLine('C#m', ON_ONE, 2), ...rest(6)],
  crash: [...CRASH, ...rest(6)],
  stringsHigh: [...rest(4), ...sustained('C#m B E', BAR, 2, 4)],
}, [
  2,
  lyricLine('. . G#5 - E5 - . . | . . G#5 - F#5 - - -', 'go on, go on.'),
  wordless('E5 - - - C#5 - B4 - | D#5 - - - - - - - | E5 - - - - - - -'),
]);

export const CREDITS_THEME = {
  title: 'The Morning Past the Hill',
  bpm: 84,
  stepsPerBeat: 2,
  // Plays once, then the credits end.
  loop: false,
  // The words, for the credits to show: each line's first and last step, and
  // the step each syllable lands on.
  lyrics: song.lyrics,

  instruments: {
    violin: { ...SOLO_VIOLIN, volume: 0.07 },
    piano: { ...CONCERT_PIANO, volume: 0.05, pan: -0.2 },
    // The violin section, doubling the tune in the big choruses.
    violins: { ...STRING_SECTION, volume: 0.03, attack: 0.12, pan: 0.25 },
    cello: { ...CELLO, volume: 0.05 },
    lowStrings: { ...LOW_STRINGS, volume: 0.05, humanize: { time: 0.008, volume: 0.15 }, pan: -0.2, reverb: 0.4 },
    horn: { ...HORN, volume: 0.035 },
    brass: { ...BRASS, volume: 0.04, humanize: { time: 0.01, volume: 0.1 }, reverb: 0.5 },
    strings: { ...STRING_SECTION, volume: 0.024, pan: -0.3 },
    stringsHigh: { ...STRING_SECTION, volume: 0.018, pan: 0.3 },
    timpani: { ...TIMPANI, volume: 0.1 },
    pizz: { ...PIZZICATO_BASS, volume: 0.12 },
    boom: { drum: 'boom', volume: 0.3 },
    snare: { drum: 'snare', volume: 0.07 },
    crash: { drum: 'crash', volume: 0.06 },
  },

  sections: { song: song.tracks },
  order: ['song'],
};
