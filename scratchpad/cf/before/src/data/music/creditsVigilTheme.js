import { melody, chordLine, transpose, hits, repeat } from '../../audio/notation.js';
import { SongBuilder, lyricLine } from '../../audio/songBuilder.js';
import { CONCERT_PIANO } from '../../audio/instruments.js';
import { VES_MOTIF } from './vesTheme.js';

// "Nobody's Hero": the credits song at the end of Chapter Two, after the fall
// from the summit. A song about the whole journey so far: down the stair into
// the Ruins, Taper letting you go, the Long Stair, a girl praying in the
// chapel, the dark and the wind, the shadow at the summit and the hand you
// missed; and then what's to come: find her, and walk on together to the end
// of the land. In the spirit of the piano credits version of "Field of Hopes
// and Dreams": just a piano and a drum kit, bright and brisk, a driving octave
// bass, chords struck in a 3-3-2 swing, and the tune in the right hand in
// octaves, tied across the bar lines. F major, the key of Ves's motif, which
// opens the song and closes it; the last chorus lifts a step to G. Nobody
// sings: the words glow at the bottom of the credits as the piano plays them
// (see `lyrics`). 138 BPM, one step is an 8th note. Plays once: two and a half
// minutes.
//
//   intro       8 bars  her motif alone, then the hook, the drums kicking in
//   verse 1     8 bars  rolling piano, a hi-hat: the Ruins
//   verse 2     8 bars  the full groove: Taper, the stair, the chapel
//   chorus      8 bars  everything: nobody's hero
//   solo        8 bars  the chorus again up an octave, no words, sparkling
//   interlude   4 bars  the drums drop out; her motif
//   verse 3     8 bars  half time: the dark, the wind, her hand
//   bridge      8 bars  minor, struck chords, a snare building: the fall
//   breath      2 bars  one chord ringing, and silence
//   chorus      8 bars  up a step: what's to come
//   tag         8 bars  the last chorus again, the piano flat out
//   outro       8 bars  "nobody's hero", her motif once more, one last chord

const BAR = 8;
const song = new SongBuilder('Nobody\'s Hero', [
  'melody', 'melodyLow', 'arp', 'bass', 'chordA', 'chordB', 'chordC', 'sparkle', 'kick', 'snare', 'hat', 'crash',
], BAR, 'melody');
const rest = (bars) => song.rest(bars);
const wordless = (notes) => ({ notes: typeof notes === 'string' ? melody(notes, 1) : notes, syllables: [] });
const tuneOf = (lines) => lines.flatMap((line) => (typeof line === 'number' ? rest(line) : line.notes));
// A part whose tune is played: the right hand doubles it an octave down.
const play = (bars, tracks, lines) => song.part(bars, { ...tracks, melodyLow: transpose(tuneOf(lines), -12) }, lines);

// --- The piano's left hand and chords, as semitones above each chord's root. ---
// A broken chord rolling up and back, for the quiet parts.
const ROLLING = [0, 7, 12, 'tenth', 19, 'tenth', 12, 7];
const LAST_ROLL = [0, 7, 12, 'tenth', 19, '-', '-', '-'];
// The bass: walking octaves, then driving ones.
const WALK = [0, '.', 12, '.', 7, '.', 12, '.'];
const DRIVE = [0, 12, 0, 12, 0, 12, 0, 12];
const ON_ONE = [0, '-', '-', '-', '-', '-', '-', '-'];
// Chords struck 3-3-2, the push under the whole song, and held for the bridge.
const PUSH = (top) => [top, '-', '-', top, '-', '-', top, '-'];
const STRUCK = (top) => [top, '-', '-', '-', top, '-', '-', '-'];
const comp = (chords, rhythm = PUSH) => ({
  chordA: chordLine(chords, rhythm(12), 3),
  chordB: chordLine(chords, rhythm('tenth'), 3),
  chordC: chordLine(chords, rhythm(19), 3),
});
// High up, glittering over the big parts.
const SPARKLE = ['tenth', 19, 24, 19, 'tenth', 19, 24, 19];

// --- The drums. ---
const KICK = hits('x...x...');
const KICK_PUSH = hits('x..x..x.');
const KICK_HALF = hits('x.......');
const SNARE = hits('..x...x.');
const SNARE_HALF = hits('....x...');
const FILL = hits('..x.xxxx');
const HAT = hits('xxxxxxxx');
const HAT_QUARTERS = hits('x.x.x.x.');
const CRASH = hits('x.......');
// A groove `bars` long, with a fill in the last bar.
const groove = (bars, kick = KICK_PUSH, snare = SNARE, hat = HAT) => ({
  kick: repeat(kick, bars),
  snare: [...repeat(snare, bars - 1), ...FILL],
  hat: repeat(hat, bars),
});

// --- The tunes and the words. Each line is two bars; the tunes push ahead,
// tying across the bar line. ---
const VERSE_TUNE = [
  '. C5 C5 D5 - F5 - G5 | - A5 G5 - E5 - . .',
  '. D5 D5 E5 - F5 - G5 | - F5 - - C5 - . .',
  '. A4 A4 C5 - D5 - F5 | - E5 C5 - A4 - . .',
  '. Bb4 Bb4 C5 - D5 - F5 | - E5 - - G5 - . .',
];
const verse = (...lines) => lines.map((words, i) => lyricLine(VERSE_TUNE[i], words));

const CHORUS_TUNE = [
  'D5 F5 - G5 A5 - Bb5 A5 | - G5 - - E5 - . .',
  'C5 E5 - A5 - G5 E5 - | F5 - - D5 - - . .',
  'Bb4 D5 - F5 Bb5 - A5 G5 | - G5 - - E5 - . .',
  'C5 F5 - A5 C6 - A5 G5 | - F5 - - - - - -',
];
const chorus = (words, semitones = 0) => words.map((line, i) => {
  const { notes, syllables } = lyricLine(CHORUS_TUNE[i], line);
  return { notes: transpose(notes, semitones), syllables };
});
// The chorus tune with no words, for the solos.
const chorusTune = (semitones) => wordless(transpose(tuneOf(chorus(['a b c d e f g h', 'a b c d e f g', 'a b c d e f g h', 'a b c d e f g'])), semitones));

const INTRO_CHORDS = 'F C Dm Bb F C Bb C';
const VERSE_CHORDS = 'F Am Bb F Dm Am Bb C';
const CHORUS_CHORDS = 'Bb C Am Dm Bb C F F';
const BRIDGE_CHORDS = 'Dm Bb F C Gm Bb C D';
const LAST_CHORUS_CHORDS = 'C D Bm Em C D G G';
const OUTRO_CHORDS = 'C D Em C Am D G G';

// --- The song, in order. ---

// Her motif alone over the rolling piano, then the hook, and the drums kick in.
play(8, {
  arp: [...chordLine('F C Dm Bb', ROLLING, 2), ...rest(4)],
  bass: [...rest(4), ...chordLine('F C Bb C', WALK, 2)],
  ...Object.fromEntries(Object.entries(comp('F C Bb C')).map(([k, v]) => [k, [...rest(4), ...v]])),
  kick: [...rest(4), ...repeat(KICK, 3), ...KICK_PUSH],
  snare: [...rest(7), ...FILL],
  hat: [...rest(4), ...repeat(HAT_QUARTERS, 4)],
  crash: [...rest(4), ...CRASH, ...rest(3)],
}, [
  wordless(VES_MOTIF),
  wordless(melody('D5/D5 Bb5 - - C6 G5 - -', 2)),
  wordless('F5 - - E5 - - C5 - | D5 - - C5 - - A4 - | Bb4 - - C5 - - D5 - | E5 - - - G5 - - -'),
]);

// Rolling piano and a hi-hat: the Ruins.
play(8, {
  arp: chordLine(VERSE_CHORDS, ROLLING, 2),
  kick: repeat(KICK_HALF, 8),
  hat: repeat(HAT_QUARTERS, 8),
}, verse(
  'You came wan-d\'ring down the stair-way,',
  'and you nev-er said your name;',
  'they had wait-ed for a He-ro,',
  'and the He-ro nev-er came.',
));

// The full groove: Taper, the Long Stair, the chapel.
play(8, {
  bass: chordLine(VERSE_CHORDS, WALK, 2),
  ...comp(VERSE_CHORDS),
  ...groove(8, KICK),
  crash: [...CRASH, ...rest(7)],
}, verse(
  'and a can-dle in the dark-ness',
  'let you climb a-bove the snow,',
  'where a bell rang in the still-ness',
  'and a prayer was on the wind.',
));

// Everything: nobody's hero.
play(8, {
  bass: chordLine(CHORUS_CHORDS, DRIVE, 2),
  ...comp(CHORUS_CHORDS),
  ...groove(8),
  crash: [...CRASH, ...rest(3), ...CRASH, ...rest(3)],
}, chorus([
  'No, you were no-bod-y\'s He-ro,',
  'not the one the sto-ries told,',
  'but you climbed when no one else would,',
  'and you made it all your own.',
]));

// The chorus again, up an octave, no words, glittering.
play(8, {
  bass: chordLine(CHORUS_CHORDS, DRIVE, 2),
  ...comp(CHORUS_CHORDS),
  sparkle: chordLine(CHORUS_CHORDS, SPARKLE, 4),
  ...groove(8),
  crash: [...CRASH, ...rest(3), ...CRASH, ...rest(3)],
}, [chorusTune(12)]);

// The drums drop out; her motif, and its reach.
play(4, {
  arp: chordLine('F C Bb C', ROLLING, 2),
}, [
  wordless(VES_MOTIF),
  wordless(melody('D5/D5 Bb5 - - C6 G5 - -', 2)),
]);

// Half time, the bass walking: the dark, the wind, her hand.
play(8, {
  arp: chordLine(VERSE_CHORDS, ROLLING, 2),
  bass: chordLine(VERSE_CHORDS, WALK, 2),
  kick: repeat(KICK_HALF, 8),
  snare: [...repeat(SNARE_HALF, 7), ...FILL],
  hat: repeat(HAT_QUARTERS, 8),
}, verse(
  'Through the snow and through the dark-ness,',
  'where she braved the thing she feared,',
  'her um-brel-la a-gainst the wind,',
  'and her hand was in your hand.',
));

// Minor, the chords struck and held, a snare roll building: the fall.
play(8, {
  bass: chordLine(BRIDGE_CHORDS, [0, '-', '-', '-', 12, '-', '-', '-'], 2),
  ...comp(BRIDGE_CHORDS, STRUCK),
  kick: [...repeat(KICK_HALF, 4), ...repeat(KICK, 3), ...KICK_PUSH],
  snare: [...rest(4), ...hits('....x... x...x... x.x.x.x. xxxxxxxx')],
  crash: [...CRASH, ...rest(7)],
}, [
  lyricLine('. . A4 D5 F5 - E5 F5 | G5 - D5 - Bb4 - . .', 'Then the cold came down the moun-tain'),
  lyricLine('. . A4 C5 F5 - E5 F5 | G5 - - - - - . .', 'and it tore you a-part,'),
  lyricLine('G5 A5 Bb5 - G5 A5 Bb5 - | A5 Bb5 D6 - - - . .', 'and you reached, and you reached, and you reached,'),
  lyricLine('. . C6 Bb5 A5 - G5 A5 | F#5 - - - D5 - - -', 'and the wind took her a-way.'),
]);

// One chord ringing, and nothing.
play(2, {
  bass: chordLine('D', ON_ONE, 1).concat(rest(1)),
  ...comp('D', (top) => [top, ...Array(15).fill('-')]),
  crash: [...CRASH, ...rest(1)],
}, [2]);

// Up a step, flat out: what's to come.
const LAST_CHORUS = chorus([
  'Now go be some-bod-y\'s He-ro,',
  'find her where the wind has gone,',
  'and walk on, the two to-geth-er,',
  'to the end of all the land.',
], 2);
play(8, {
  bass: chordLine(LAST_CHORUS_CHORDS, DRIVE, 2),
  ...comp(LAST_CHORUS_CHORDS),
  sparkle: chordLine(LAST_CHORUS_CHORDS, SPARKLE, 4),
  ...groove(8),
  crash: [...CRASH, ...rest(1), ...CRASH, ...rest(1), ...CRASH, ...rest(1), ...CRASH, ...rest(1)],
}, LAST_CHORUS);

// The last chorus once more, no words, everything going.
play(8, {
  bass: chordLine(LAST_CHORUS_CHORDS, DRIVE, 2),
  ...comp(LAST_CHORUS_CHORDS),
  sparkle: chordLine(LAST_CHORUS_CHORDS, SPARKLE, 4),
  ...groove(8),
  crash: [...CRASH, ...rest(3), ...CRASH, ...rest(3)],
}, [chorusTune(2)]);

// The name, once more; her motif, a step higher than it began; the drums
// fall away, and one last chord.
play(8, {
  arp: [...chordLine('C D Em C Am D', ROLLING, 2), ...chordLine('G', LAST_ROLL, 2), ...rest(1)],
  bass: [...chordLine('C D', DRIVE, 2), ...chordLine('Em C Am D', WALK, 2), ...chordLine('G', ON_ONE, 1), ...rest(1)],
  ...comp(OUTRO_CHORDS, (top) => [top, '-', '-', '-', '-', '-', '-', '-']),
  kick: [...repeat(KICK, 2), ...repeat(KICK_HALF, 2), ...rest(4)],
  snare: [...SNARE, ...FILL, ...rest(6)],
  hat: [...repeat(HAT, 2), ...repeat(HAT_QUARTERS, 2), ...rest(4)],
  crash: [...CRASH, ...rest(5), ...CRASH, ...rest(1)],
}, [
  lyricLine('. . G5 - E5 - D5 - | . . F#5 - D5 - - -', 'No-bod-y\'s He-ro.'),
  wordless(transpose(VES_MOTIF, 2)),
  wordless('A5 - - G5 - - E5 - | F#5 - - - D5 - - - | G5 - - - - - - - | - - - - - - - -'),
]);

export const CREDITS_VIGIL_THEME = {
  title: 'Nobody\'s Hero',
  bpm: 138,
  stepsPerBeat: 2,
  // Plays once, then the credits end.
  loop: false,
  // The words, for the credits to show: each line's first and last step, and
  // the step each syllable lands on.
  lyrics: song.lyrics,

  // One piano (its hands split into tracks) and a drum kit.
  instruments: {
    melody: { ...CONCERT_PIANO, volume: 0.075, pan: 0.1 },
    melodyLow: { ...CONCERT_PIANO, volume: 0.045, pan: 0.1 },
    arp: { ...CONCERT_PIANO, volume: 0.05, pan: -0.15 },
    bass: { ...CONCERT_PIANO, volume: 0.055, pan: -0.2 },
    chordA: { ...CONCERT_PIANO, volume: 0.026 },
    chordB: { ...CONCERT_PIANO, volume: 0.026 },
    chordC: { ...CONCERT_PIANO, volume: 0.026 },
    sparkle: { ...CONCERT_PIANO, volume: 0.02, pan: 0.3 },
    kick: { drum: 'kick', volume: 0.32 },
    snare: { drum: 'snare', volume: 0.13 },
    hat: { drum: 'hat', volume: 0.028 },
    crash: { drum: 'crash', volume: 0.05 },
  },

  sections: { song: song.tracks },
  order: ['song'],
};
