import { melody, chordLine, sustained, arpeggio, transpose, hits, repeat, midi } from '../../audio/notation.js';

// "They'll Come": the song for the Chapter 3 trailer (tools/trailer3.html),
// played by a real orchestra (recordings from assets/audio/samples/, not
// synths), the way "Nobody Came" (trailerTheme.js) was. The chapter is the
// search for Ves, so it's built on her motif ("Carried on the Wind",
// vesTheme.js: C C, up to A, Bb G A) and the two tunes that chase her down
// the mountain: Bramble's "three cuts and a tick" (brambleTheme.js) and the
// beast's claws (a minor third, a tritone, the pounce; pinefallBeastTheme.js).
//
// Under nearly all of it, the chapter's own sound (the way Christopher
// Larkin wrote Hollow Knight's City of Tears, and the way the Pinefall and
// the Hushwood are written): a grand piano turning three notes over and
// over, D A E, a stack of fifths falling in threes against the beat, that
// never changes while the bass moves under it and keeps turning it into
// new chords. The rain. Up a step after the drop it's E B F#: the
// Hushwood's three steps.
//
// The fall: a harp tumbling down three octaves, the strings ringing, a thud,
// and her motif far off on a music box. Then the search: the rain starts,
// plucked cellos walking under it, her motif limping on an oboe, the
// whistle answering with Bramble's tick; from bar 5 a solo violin takes her
// motif up high and long over soft violas, the horns swell in, the timpani
// start a heartbeat, and the strings start to move. The
// strings race, the claws creep up through the low brass, the horns climb,
// the cymbal swells... one beat of dead silence; then the drop: gong, bass
// drum and a low BRAAAM, and her motif on the whole brass section in four
// octaves, climbing past its ache instead of settling (the way "Nobody's
// Dawn" has it), with the hero's call answering. Up a step, with the
// violins, a piccolo and a glockenspiel on it, the piano hammering, and the
// piccolo throwing in Bramble's tick. Then everything stops but the
// strings: the claws, slowed right down, under chords that won't settle
// (the Pinefall's E flat among them), and a solo violin asking the start of
// her motif and not finishing it. One huge hit for the title card, and the
// finale: the whole orchestra on her motif one last time, crashes on every
// bar, up to one held chord. Then the music box alone, one note short of
// home: she isn't found yet. Plays once.
//
// D minor (F major for the search), then E minor; 136 BPM, one step is a
// 16th note, so a bar is 1.76 seconds. About 88 seconds in all:
//
//   fall      4 bars  0:00  black screen: the harp falls, the thud, the box
//   search   12 bars  0:07  the red wood, the boy: pizzicato, oboe, whistle;
//                           then the solo violin, and the strings stirring
//   build     4 bars  0:28  strings racing, the claws, the horns climbing...
//                           then a beat of dead silence
//   drop      8 bars  0:35  THE DROP: the fights and the puzzles
//   rise      8 bars  0:49  up a step: the prophecy, the game's own theme, on
//                           everything, with the tick thrown in
//   hush      4 bars  1:03  something in the trees: strings, the claws slow
//   finale    8 bars  1:11  the hit for NOBODY'S HERO, and everything, once more
//   tag       2 bars  1:25  the music box alone
//
// tools/trailer3.html cuts its shots on these bars. The only synths are a
// kick and a sub-boom under the drop, for punch.

const BAR = 16;
const rest = (bars) => Array(bars * BAR).fill('.');
const held = (note, steps) => [typeof note === 'number' ? note : midi(note), ...Array(steps - 1).fill('-')];
const tune = (text) => melody(text, 2); // each token an 8th note
const run = (text) => melody(text, 1);  // each token a 16th

// --- The rain: D A E, three notes in a bar of four, over and over. ---
const RAIN = run('D5 A5 E6 D5 A5 E6 D5 A5 E6 D5 A5 E6 D5 A5 E6 A5');
const rain = (bars) => repeat(RAIN, bars);

// --- Her motif, limping: at half speed, on the oboe. ---
const LIMPING = tune('C5 - C5 - A5 - - - | Bb5 - G5 - A5 - - -');
// Bramble's tick on the whistle: three cuts and a jump up a fourth; the
// second time, showing off, a sixth.
const TICK = tune('D5 D5 D5 G5 - A5 . . | . . . . . . . .');
const TICK_BIG = tune('D5 D5 D5 B5 - A5 . . | . . . . . . . .');
// Far off, on a music box, high up.
const BOX = tune('C6/C6 A6 - - Bb6 G6 A6 - | - - - - . . . .');

// --- The drop: her motif in D minor, climbing past the ache (A A F, G A)
// and the hero's call (D, A, G A C; Bb A F D) answering; twice, the second
// time ending higher. ---
const DROP_TUNE = `
  A4/A4 F5 - - G5 A5 - - | Bb5 - - - A5 - F5 - | A4/A4 F5 - - G5 A5 - - | C6 - - - Bb5 - G5 - |
  D5 - A5 - - G5 A5 C6 | Bb5 - A5 - F5 - D5 - | G5 - - - Bb5 - D6 - |
`;
const DROP_A = tune(`${DROP_TUNE} C#6 - - - A5 - E5 - |`);
const DROP_B = tune(`${DROP_TUNE} C#6 - - - D6 - - - |`);
// The piccolo answering with the tick in the gaps of the rise.
const TICK_ANSWER = tune(`
  . . . . . . . . | D6 D6 D6 G6 - A6 . . | . . . . . . . . | D6 D6 D6 B6 - A6 . . |
  . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . |
`);

// The claws, in D minor: D, F, G sharp, and the pounce onto A. Under the
// build on the low brass; in the hush, four times as slow.
const CLAWS = tune('D2 - - - F2 - - - | G#2 - - - A2 - - -');
const CLAWS_SLOW = tune('D2 - - - - - - - | F2 - - - - - - - | G#2 - - - - - - - | A2 - - - - . . .');
// The build's last bar: the violins run up chromatically, then silence.
const RUN_UP = melody('D5/Eb5 E5/F5 F#5/G5 G#5/A5 A#5/B5 C6/C#6 . .');
const HORN_CLIMB = tune('C#4 - - - E4 - - - | F4 - G4 - A4 - . .');

// The rise: the game's own theme, the prophecy ("Once, a Promise",
// prophecyTheme.js; "Nobody Came" was built on it), in D minor, on
// everything: the trailer's callback. Its chords end A, Dm.
const PROPHECY = tune(`
  . . A4 - - - D5 - | F5 - - - E5 - D5 - | C5 - - - - - . . | . . A4 - C5 - F5 - |
  E5 - - - D5 - A4 - | Bb4 - - - D5 - - - | C#5 - - - - - E5 - | D5 - - - - - . . |
`);
const RISE_CHORDS = 'Dm Bb F C Dm Bb A Dm';

// A solo violin singing long over the drop, the way the voice sits over
// the City of Tears: her motif's shape stretched across the brass.
const DESCANT = tune(`
  A6 - - - - - - - | Bb6 - - - A6 - - - | A6 - - - - - G6 - | F6 - - - - - - - |
  A6 - - - - - - - | Bb6 - - - C7 - - - | A6 - - - G6 - F6 - | E6 - - - - - - - |
`);

// The hush: the solo violin starts her motif twice and never gets to the end.
const ASKING = tune('A4/A4 F5 - - - - - - | . . . . . . . . | A4/A4 F5 - - G5 - - - | - - - - . . . .');

// The tag: the music box, one note short of home.
const TITLE_BOX = tune('A5/A5 F6 - - G6 E6 . . | . . . . . . . .');

// --- The search's walking bass, on plucked cellos: quarter notes, stepwise. ---
const WALK = tune(`
  F2 - A2 - C3 - A2 - | C3 - E3 - G3 - E3 - | D3 - F3 - A3 - F3 - | Bb2 - D3 - F3 - D3 - |
  F2 - A2 - C3 - D3 - | C3 - E3 - G3 - A3 - | G2 - Bb2 - D3 - Bb2 - | C3 - E3 - G3 - Bb3 - |
  D3 - F3 - A3 - F3 - | Bb2 - D3 - F3 - D3 - | G2 - Bb2 - D3 - Bb2 - | C3 - E3 - G3 - Bb3 - |
`);
// Her motif high on the solo violin, whole and long; then reaching up and
// not coming down.
const SOARING = tune('C6/C6 A6 - - Bb6 G6 A6 - | - - - - - - - - | C6/C6 A6 - - Bb6 C7 - - | - - - - - - - - |');
const SOARING_ON = tune('A6 - - - G6 - F6 - | G6 - - - - - - - | A6 - - - Bb6 - C7 - | - - - - - - - - |');

// The finale: the hit, held; then her motif and the hero's call one last
// time, on everything; and one chord, held.
const FINALE = tune(`
  D6 - - - - - - - | A4/A4 F5 - - G5 A5 - - | Bb5 - - - A5 - F5 - | A4/A4 F5 - - G5 A5 - - |
  C6 - - - Bb5 - G5 - | D5 - A5 - - G5 A5 C6 | Bb5 - A5 - F5 - D5 - | D6 - - - - - - - |
`);

const SEARCH_CHORDS = 'F C Dm Bb F C Gm C Dm Bb Gm C';
const FINALE_CHORDS = 'Dm Dm Bb F C Dm Bb Dm';
const DROP_CHORDS = 'Dm Bb F C Dm Bb Gm A';
const HUSH_CHORDS = 'Gm Eb Bb A';

// --- Patterns, as semitones above each chord's root. ---
const DRIVE = [0, '.', 0, 12, '.', 0, 12, '.', 0, '.', 0, 12, '.', 0, 12, 7];
const DIG = [0, '.', '.', 0, '.', '.', 0, '.', 0, '.', '.', 0, '.', '.', 0, 0];
const RACE = [0, 7, 12, 'third', 12, 7, 'tenth', 7];
const EIGHTHS = [0, '.', 7, '.', 12, '.', 7, '.'];
const RIPPLE = [0, '-', 7, '-', 12, '-', 'tenth', '-', 19, '-', 'tenth', '-', 12, '-', 7, '-'];
const HAMMER = [12, '.', '.', 12, '.', '.', 12, '.', 12, '.', '.', 12, '.', '.', 19, '.'];
const PEDAL_8 = [0, '.', 0, '.', 0, '.', 0, '.', 0, '.', 0, '.', 0, '.', 0, '.'];
const PEDAL_16 = Array(16).fill(0);
const PEDAL_CUT = [...Array(12).fill(0), '.', '.', '.', '.'];

// --- Timpani: every chord's root lands between F2 and E3, where the real
// drums are tuned. -5 is the fifth below. ---
const timpRoot = (chord) => 41 + ((midi(`${chord.replace(/m$/, '')}4`) % 12) - 5 + 12) % 12;
const timp = (chords, pattern) => chords.split(/\s+/).filter(Boolean).flatMap((chord) => pattern.map((p) => (typeof p === 'number' ? timpRoot(chord) + p : p)));
const T_ON_ONE = [0, ...Array(15).fill('.')];
const T_HEART = [0, '.', '.', 0, ...Array(12).fill('.')];
const T_QUARTERS = [0, '-', '-', '-', 0, '-', '-', '-', 0, '-', '-', '-', 0, '-', '-', '-'];
const T_EIGHTHS = [0, '-', 0, '-', 0, '-', 0, '-', 0, '-', 0, '-', 0, '-', -5, '-'];
const T_CUT = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '.', '.', '.', '.'];
const T_POUND = [0, '.', '.', 0, '.', '.', -5, '.', 0, '.', '.', 0, '.', '.', -5, 0];
const timpRoll = (chord) => held(timpRoot(chord), BAR);

// --- Drums. ---
const HIT = hits('x....... ........');
const BASS_DRUM = hits('x....... x.......');
const TAIKO = hits('x..x..x. x..x..x.');
const TAIKO_HI = hits('....x..x ..x.x.xx');
const TAIKO_HI_2 = hits('x.xx.xx. x.xx.xxx');
const SNARE = hits('....x... ....x...');
const FILL = hits('x.x.xxxx xxxxxxxx');
const KICK = hits('x.....x. ..x.....');
const STEPS = hits('x...x... x...x...');
const TOM = hits('..x...x. ..x..x..');
const every = (bars, n) => Array.from({ length: bars }, (_, i) => (i % n === 0 ? HIT : rest(1))).flat();
// The cymbal swell is loudest 3.18s in (sampleSets.js): at 136 BPM that's
// 29 steps, so it starts 29 steps before where it should peak.
const SWELL_STEPS = 29;
const swellInto = (bars, silentSteps = 0) => {
  const before = bars * BAR - SWELL_STEPS - silentSteps;
  return [...Array(before).fill('.'), ...held(60, SWELL_STEPS), ...Array(silentSteps).fill('.')];
};

// The last `steps` of every track in a section cut dead: a beat of silence.
const cutEnd = (section, steps = 4) => Object.fromEntries(Object.entries(section).map(([track, notes]) => [track, [...notes.slice(0, notes.length - steps), ...Array(steps).fill('.')]]));

// Shifts every pitched track in a section, leaving the drums alone.
const UNPITCHED = ['kick', 'boom', 'snare', 'snareRoll', 'taikoBuild', 'impact', 'crash', 'gong', 'bassDrum', 'bigDrum', 'tom', 'taiko', 'taikoHigh', 'swell', 'frameDrum'];
function shiftSection(section, semitones) {
  return Object.fromEntries(Object.entries(section).map(([track, steps]) => [track, UNPITCHED.includes(track) ? steps : transpose(steps, semitones)]));
}

// Everything after the drop is written in D minor and played a step up.
const UP = 2;

export const TRAILER_SEARCH_THEME = {
  title: "They'll Come",
  bpm: 136,
  stepsPerBeat: 4,
  loop: false,
  // Lots of real instruments at once, through a limiter (see SongPlayer in
  // src/audio/music.js), so it can be loud without the hits clipping.
  volume: 0.9,
  limit: 1.4,

  instruments: {
    piano: { sample: 'piano', volume: 0.55, ring: true, reverb: 0.35, humanize: { time: 0.01, volume: 0.15 } },
    soloViolin: { sample: 'soloViolin', volume: 0.6, release: 0.4, reverb: 0.45, pan: 0.15 },
    harp: { sample: 'harp', volume: 0.38, ring: true, reverb: 0.45, pan: -0.3, humanize: { time: 0.012, volume: 0.2 } },
    // The music box, far off: a glockenspiel in a lot of hall.
    box: { sample: 'glock', volume: 0.22, ring: true, reverb: 0.6, pan: 0.1 },
    rain: { sample: 'grandPiano', volume: 0.34, ring: true, reverb: 0.5, pan: 0.1, humanize: { time: 0.006, volume: 0.12 } },
    violas: { sample: 'violas', volume: 0.3, attack: 0.12, release: 0.5, reverb: 0.45, pan: -0.15 },
    glock: { sample: 'glock', volume: 0.28, ring: true, reverb: 0.4, pan: 0.1, humanize: { time: 0.006, volume: 0.15 } },
    oboe: { sample: 'oboe', volume: 0.5, release: 0.3, reverb: 0.4, pan: -0.1 },
    recorder: { sample: 'recorder', volume: 0.42, release: 0.2, reverb: 0.35, pan: 0.2 },
    piccolo: { sample: 'piccolo', volume: 0.3, release: 0.15, reverb: 0.35, pan: 0.2 },
    piccoloTick: { sample: 'piccolo', volume: 0.3, release: 0.15, reverb: 0.35, pan: -0.2 },
    violins: { sample: 'violins', volume: 0.4, attack: 0.04, release: 0.4, reverb: 0.35, pan: 0.25 },
    // The tune at pitch too, on the drop: a second violin section and a
    // second trumpet, so it's in four octaves.
    violinsHigh: { sample: 'violins', volume: 0.32, attack: 0.03, release: 0.35, reverb: 0.4, pan: -0.25 },
    trumpetHigh: { sample: 'trumpet', volume: 0.36, release: 0.15, reverb: 0.4, pan: -0.1, humanize: { time: 0.006, volume: 0.08 } },
    cellos: { sample: 'cellos', volume: 0.45, release: 0.4, reverb: 0.3, pan: -0.25 },
    violinsTrem: { sample: 'violinsTrem', volume: 0.3, attack: 0.1, release: 0.6, reverb: 0.5, pan: 0.25 },
    violasTrem: { sample: 'violasTrem', volume: 0.3, attack: 0.1, release: 0.6, reverb: 0.45, pan: -0.2 },
    cellosPizz: { sample: 'cellosPizz', volume: 0.5, ring: true, reverb: 0.25, pan: -0.2, humanize: { time: 0.008, volume: 0.15 } },
    vibesBowed: { sample: 'vibesBowed', volume: 0.3, attack: 0.2, release: 0.8, reverb: 0.5 },
    violinsSpic: { sample: 'violinsSpic', volume: 0.35, release: 0.06, reverb: 0.25, pan: 0.3, humanize: { time: 0.006, volume: 0.15 } },
    cellosSpic: { sample: 'cellosSpic', volume: 0.45, release: 0.06, reverb: 0.2, pan: -0.2, humanize: { time: 0.006, volume: 0.15 } },
    bassSpic: { sample: 'bassSpic', volume: 0.5, release: 0.06, reverb: 0.15 },
    // The same strings, held back during the build so the drop takes over.
    violinsBuild: { sample: 'violinsSpic', volume: 0.25, release: 0.06, reverb: 0.25, pan: 0.3, humanize: { time: 0.006, volume: 0.15 } },
    cellosBuild: { sample: 'cellosSpic', volume: 0.28, release: 0.06, reverb: 0.2, pan: -0.2, humanize: { time: 0.006, volume: 0.15 } },
    bassBuild: { sample: 'bassSpic', volume: 0.3, release: 0.06, reverb: 0.15 },
    hornsBuild: { sample: 'horns', volume: 0.28, release: 0.15, reverb: 0.4, pan: -0.1 },
    tromboneBuild: { sample: 'trombone', volume: 0.3, release: 0.2, reverb: 0.35, pan: -0.15 },
    tubaBuild: { sample: 'tuba', volume: 0.32, release: 0.2, reverb: 0.3 },
    hornsSoft: { sample: 'hornsSoft', volume: 0.5, attack: 0.25, release: 0.5, reverb: 0.45 },
    horns: { sample: 'horns', volume: 0.5, release: 0.2, reverb: 0.35, pan: -0.1 },
    trumpet: { sample: 'trumpet', volume: 0.45, release: 0.15, reverb: 0.35, pan: 0.1 },
    trombone: { sample: 'trombone', volume: 0.45, release: 0.2, reverb: 0.3, pan: -0.15 },
    tuba: { sample: 'tuba', volume: 0.5, release: 0.3, reverb: 0.25 },
    timpani: { sample: 'timpani', volume: 0.7, ring: true, reverb: 0.3 },
    // The build's timpani and drums are choked (each stops when the next
    // starts), so the beat of silence before the drop really is silent.
    timpBuild: { sample: 'timpani', volume: 0.35, release: 0.08, reverb: 0.2 },
    taikoBuild: { sample: 'tenorDrum', drum: 'sample', volume: 0.5, release: 0.12, gate: 2.5, reverb: 0.2 },
    timpRoll: { sample: 'timpaniRoll', volume: 0.6, release: 0.3, reverb: 0.3 },
    swell: { sample: 'cymbalSwell', volume: 0.45, release: 0.04, reverb: 0.3 },
    frameDrum: { sample: 'frameDrum', drum: 'sample', volume: 0.28, ring: true, reverb: 0.3, humanize: { time: 0.005, volume: 0.2 } },
    bassDrum: { sample: 'bassDrum', drum: 'sample', volume: 0.8, ring: true, reverb: 0.3 },
    bigDrum: { sample: 'concertBassDrum', drum: 'sample', volume: 0.6, ring: true, reverb: 0.35 },
    tom: { sample: 'tom', drum: 'sample', volume: 0.4, ring: true, reverb: 0.25, pan: -0.2, humanize: { time: 0.004, volume: 0.2 } },
    taiko: { sample: 'tenorDrum', drum: 'sample', volume: 0.6, ring: true, reverb: 0.25, humanize: { time: 0.004, volume: 0.15 } },
    taikoHigh: { sample: 'tenorDrumHigh', drum: 'sample', volume: 0.4, ring: true, reverb: 0.25, pan: 0.2, humanize: { time: 0.004, volume: 0.2 } },
    snareRoll: { sample: 'snare', drum: 'sample', volume: 0.17, release: 0.08, reverb: 0.3, humanize: { time: 0.003, volume: 0.25 } },
    snare: { sample: 'snare', drum: 'sample', volume: 0.45, ring: true, reverb: 0.25, humanize: { time: 0.003, volume: 0.2 } },
    crash: { sample: 'crash', drum: 'sample', volume: 0.45, ring: true, reverb: 0.3 },
    // The BRAAAM: low trombones and a tuba blasting the drop's first chord.
    braam: { sample: 'trombone', volume: 0.75, release: 0.6, reverb: 0.45 },
    braamLow: { sample: 'tuba', volume: 0.6, release: 0.6, reverb: 0.4 },
    // The deepest bass drum, on the downbeats that matter.
    impact: { sample: 'bassDrumDeep', drum: 'sample', volume: 1, ring: true, reverb: 0.4 },
    gong: { sample: 'gong', drum: 'sample', volume: 0.6, ring: true, reverb: 0.3 },
    kick: { drum: 'kick', volume: 0.5 },
    boom: { drum: 'boom', volume: 0.9 },
  },

  sections: {
    // Black screen: the harp tumbles down three octaves while the high
    // strings ring; the thud of landing; a low D; and her motif, far off,
    // on the music box.
    fall: {
      harp: [...run('A6 F6 D6 A5 F5 D5 A4 F4 D4 A3 F3 D3 A2 F2 D2 .'), ...rest(3)],
      violinsTrem: [...held('A5', 2 * BAR), ...rest(2)],
      impact: [...rest(1), ...HIT, ...rest(2)],
      boom: [...rest(1), ...HIT, ...rest(2)],
      cellos: [...rest(1), ...held('D2', 3 * BAR)],
      box: [...rest(2), ...BOX],
    },

    // The search: plucked cellos walking under a harp, her motif limping on
    // the oboe, the whistle answering with Bramble's tick; from bar 5 the
    // strings and horns swell in and the timpani start a heartbeat; from bar
    // 9 the solo violin takes her motif up high, whole, and the strings and
    // a drum start to move under it.
    search: {
      rain: rain(12),
      cellosPizz: WALK,
      harp: [...rest(4), ...arpeggio('F C Gm C Dm Bb Gm C', BAR, 3, RIPPLE)],
      oboe: [...LIMPING, ...rest(10)],
      recorder: [...rest(2), ...TICK, ...rest(2), ...TICK_BIG, ...rest(2), ...TICK],
      soloViolin: [...rest(4), ...SOARING, ...SOARING_ON],
      violas: [...rest(4), ...sustained('F C Gm C Dm Bb Gm C', BAR, 2, 3)],
      frameDrum: [...rest(2), ...repeat(STEPS, 10)],
      violins: [...rest(4), ...sustained('F C Gm C Dm Bb Gm C', BAR, 1, 4)],
      cellos: [...rest(8), ...sustained('Dm Bb Gm C', BAR, 0, 2)],
      hornsSoft: [...rest(4), ...sustained('F C Gm C Dm Bb Gm C', BAR, 0, 3)],
      timpani: [...rest(4), ...timp('F C G C D Bb G C', T_HEART)],
      violinsBuild: [...rest(8), ...arpeggio('Dm Bb Gm C', BAR, 4, EIGHTHS)],
      taikoBuild: [...rest(10), ...hits('x...x... x...x...'), ...hits('x...x... x...x...')],
    },

    // Everything winds up: the strings go from 8ths to 16ths, the claws
    // creep up through the low brass, the drums roll tighter, the horns
    // climb, the cymbal swells... and it all stops dead a beat before the drop.
    build: {
      rain: rain(4),
      violinsBuild: [...arpeggio('Gm', BAR, 4, EIGHTHS), ...arpeggio('A A', BAR, 4, RACE), ...RUN_UP],
      cellosBuild: [...chordLine('Gm A', PEDAL_8, 2), ...chordLine('A', PEDAL_16, 2), ...chordLine('A', PEDAL_CUT, 2)],
      bassBuild: [...chordLine('Gm A', PEDAL_8, 1), ...chordLine('A', PEDAL_16, 1), ...chordLine('A', PEDAL_CUT, 1)],
      tromboneBuild: [...CLAWS, ...rest(2)],
      tubaBuild: [...CLAWS, ...rest(2)],
      hornsBuild: [...rest(2), ...HORN_CLIMB],
      timpBuild: [...timp('Gm A', T_QUARTERS), ...timp('A', T_EIGHTHS), ...timp('A', T_CUT)],
      snareRoll: [...rest(1), ...hits('x.x.x.x. x.x.x.x.'), ...hits('xxxxxxxx xxxxxxxx'), ...hits('xxxxxxxx xxxx....')],
      taikoBuild: [...rest(2), ...hits('x...x... x...x...'), ...hits('x.x.x.x. x.x.....')],
      swell: swellInto(4, 4),
      // Out of the silence, one deep boom a 16th before the drop lands.
      boom: [...rest(3), ...hits('........ .......x')],
      impact: [...rest(3), ...hits('........ .......x')],
    },

    // THE DROP. Gong, bass drum, crash and a low BRAAAM on the downbeat;
    // then her motif on trumpets, horns and trombones in three octaves, the
    // strings racing, the basses digging in, timpani and war drums pounding.
    drop: {
      rain: rain(8),
      soloViolin: DESCANT,
      trumpetHigh: DROP_A,
      violinsHigh: DROP_A,
      trumpet: transpose(DROP_A, -12),
      horns: transpose(DROP_A, -12),
      trombone: transpose(DROP_A, -24),
      braam: [...held('D2', 14), '.', '.', ...rest(7)],
      braamLow: [...held('D2', 14), '.', '.', ...rest(7)],
      tuba: sustained(DROP_CHORDS, BAR, 0, 2),
      violins: sustained(DROP_CHORDS, BAR, 1, 4),
      // High tremolo strings shimmering over the top.
      violinsTrem: sustained(DROP_CHORDS, BAR, 2, 5),
      violinsSpic: arpeggio(DROP_CHORDS, BAR, 4, RACE),
      cellosSpic: chordLine(DROP_CHORDS, DRIVE, 2),
      bassSpic: chordLine(DROP_CHORDS, DIG, 1),
      timpani: [...timp('Dm Bb F C Dm Bb Gm', T_POUND), ...rest(1)],
      timpRoll: [...rest(7), ...timpRoll('A')],
      bassDrum: repeat(BASS_DRUM, 8),
      bigDrum: every(8, 1),
      tom: repeat(TOM, 8),
      taiko: repeat(TAIKO, 8),
      taikoHigh: [...repeat(TAIKO_HI, 3), ...FILL, ...repeat(TAIKO_HI, 3), ...FILL],
      snare: [...repeat(SNARE, 3), ...FILL, ...repeat(SNARE, 3), ...FILL],
      kick: repeat(KICK, 8),
      crash: every(8, 2),
      gong: every(8, 8),
      // The first hit doubled: the landing, and the bounce.
      impact: [...hits('x...x... ........'), ...every(7, 4)],
      boom: [...hits('x...x... ........'), ...every(7, 2)],
    },

    // Up a step and louder still: the violins sing it with the brass, the
    // glockenspiel catching the light on it, the piano hammering octaves,
    // the piccolo throwing Bramble's tick into the gaps, the drums doubled.
    rise: shiftSection({
      rain: rain(8),
      violins: PROPHECY,
      violinsHigh: PROPHECY,
      soloViolin: transpose(PROPHECY, 12),
      trumpetHigh: PROPHECY,
      glock: transpose(PROPHECY, 12),
      piccolo: transpose(PROPHECY, 12),
      piccoloTick: TICK_ANSWER,
      braam: [...held('D2', 12), ...Array(4).fill('.'), ...rest(7)],
      braamLow: [...held('D2', 12), ...Array(4).fill('.'), ...rest(7)],
      trumpet: transpose(PROPHECY, -12),
      horns: transpose(PROPHECY, -12),
      trombone: transpose(PROPHECY, -24),
      tuba: sustained(RISE_CHORDS, BAR, 0, 2),
      violinsTrem: sustained(RISE_CHORDS, BAR, 2, 5),
      piano: chordLine(RISE_CHORDS, HAMMER, 3),
      violinsSpic: arpeggio(RISE_CHORDS, BAR, 4, RACE),
      cellosSpic: chordLine(RISE_CHORDS, DRIVE, 2),
      bassSpic: chordLine(RISE_CHORDS, DIG, 1),
      timpani: [...timp('Dm Bb F C Dm Bb A', T_POUND), ...rest(1)],
      timpRoll: [...rest(7), ...timpRoll('Dm')],
      bassDrum: repeat(BASS_DRUM, 8),
      bigDrum: every(8, 1),
      tom: repeat(TOM, 8),
      taiko: repeat(TAIKO, 8),
      taikoHigh: [...repeat(TAIKO_HI_2, 7), ...FILL],
      snare: [...repeat(SNARE, 7), ...FILL],
      kick: repeat(KICK, 8),
      crash: every(8, 2),
      gong: every(8, 8),
      impact: every(8, 4),
      boom: every(8, 2),
    }, UP),

    // Drums out. Something follows: the claws four times as slow on the tuba
    // under strings that tremble on chords that won't settle, a heartbeat,
    // the solo violin starting her motif and not finishing it; then a roll
    // and the cymbal swell pull everything up to... a beat of dead silence,
    // and the last hit.
    hush: shiftSection(cutEnd({
      rain: rain(4),
      soloViolin: ASKING,
      tuba: CLAWS_SLOW,
      cellos: sustained(HUSH_CHORDS, BAR, 0, 2),
      violasTrem: sustained(HUSH_CHORDS, BAR, 2, 3),
      violinsTrem: sustained(HUSH_CHORDS, BAR, 1, 4),
      vibesBowed: sustained(HUSH_CHORDS, BAR, 0, 4),
      hornsSoft: [...rest(2), ...sustained('A', 2 * BAR, 1, 3)],
      timpani: timp('G Eb Bb A', T_HEART),
      timpRoll: [...rest(3), ...timpRoll('A')],
      snareRoll: [...rest(3), ...hits('x.x.x.x. xxxxxxxx')],
      swell: swellInto(4, 4),
    }), UP),

    // NOBODY'S HERO: the whole orchestra on one chord, held; then her motif
    // and the hero's call one last time on everything there is, a crash
    // every other bar, the drums doubled, up to one chord held with a roll.
    finale: shiftSection({
      rain: rain(8),
      soloViolin: transpose(FINALE, 12),
      violins: FINALE,
      violinsHigh: FINALE,
      trumpetHigh: FINALE,
      trumpet: transpose(FINALE, -12),
      horns: transpose(FINALE, -12),
      trombone: transpose(FINALE, -24),
      glock: transpose(FINALE, 12),
      piccolo: transpose(FINALE, 12),
      tuba: sustained(FINALE_CHORDS, BAR, 0, 2),
      cellos: sustained(FINALE_CHORDS, BAR, 0, 3),
      braam: [...held('D2', 12), ...Array(4).fill('.'), ...rest(6), ...held('D2', BAR)],
      braamLow: [...held('D2', 12), ...Array(4).fill('.'), ...rest(6), ...held('D2', BAR)],
      piano: chordLine(FINALE_CHORDS, HAMMER, 3),
      violinsSpic: arpeggio(FINALE_CHORDS, BAR, 4, RACE),
      cellosSpic: chordLine(FINALE_CHORDS, DRIVE, 2),
      bassSpic: chordLine(FINALE_CHORDS, DIG, 1),
      timpani: [...timp('Dm Dm Bb F C Dm Bb', T_POUND), ...timp('Dm', T_ON_ONE)],
      timpRoll: [...rest(7), ...timpRoll('Dm')],
      bassDrum: repeat(BASS_DRUM, 8),
      bigDrum: every(8, 1),
      tom: [...repeat(TOM, 7), ...rest(1)],
      taiko: [...repeat(TAIKO, 7), ...rest(1)],
      taikoHigh: [...repeat(TAIKO_HI_2, 6), ...FILL, ...rest(1)],
      snare: [...repeat(SNARE, 6), ...FILL, ...rest(1)],
      kick: [...repeat(KICK, 7), ...rest(1)],
      crash: [...every(7, 2), ...HIT],
      gong: [...every(7, 2), ...HIT],
      impact: [...HIT, ...rest(6), ...HIT],
      boom: every(8, 2),
      swell: [...swellInto(7), ...rest(1)],
    }, UP),

    // The music box alone, stopping one note short of home, over the last
    // of the low strings.
    tag: shiftSection({
      rain: rain(2),
      box: TITLE_BOX,
      cellos: held('D2', 2 * BAR),
    }, UP),
  },

  order: ['fall', 'search', 'build', 'drop', 'rise', 'hush', 'finale', 'tag'],
};
