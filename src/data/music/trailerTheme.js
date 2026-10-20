import { melody, chordLine, sustained, arpeggio, transpose, hits, repeat, midi } from '../../audio/notation.js';

// "Nobody Came": the trailer's song, played by a real orchestra (recordings
// from assets/audio/samples/, not synths). The prophecy ("Once, a Promise",
// prophecyTheme.js) told slowly on a lone piano over a black screen; a solo
// violin takes it up; the strings start racing and everything climbs; one
// beat of silence; then the drop: gong, bass drum and a low brass BRAAAM,
// and the same tune blared by trumpets, horns and trombones over war drums.
// Then up a step, with the violins singing it and the piano hammering. A
// hush, one last hit for the title card, and the piano alone. Plays once.
// A minor, then B minor; 128 BPM, one step is a 16th note. One bar is just
// under two seconds, about 82 seconds in all:
//
//   intro     8 bars  0:00  black screen: piano tells the prophecy, cellos under
//   calm      8 bars  0:15  the hero, the chapel, Ves: solo violin and harp
//   build     4 bars  0:30  strings racing, drums rolling, brass climbing...
//                           then a beat of dead silence
//   drop      8 bars  0:37  THE DROP: the gameplay cuts
//   rise      8 bars  0:52  up a step: violins sing it, everything louder
//   hush      4 bars  1:07  something's wrong: drums out, strings hold
//   title     4 bars  1:15  one huge hit for NOBODY'S HERO, then the piano
//
// tools/trailer.html cuts its shots on these bars. The only synths left are
// a kick and a sub-boom under the drop, for punch.

const BAR = 16;
const rest = (bars) => Array(bars * BAR).fill('.');
const held = (note, steps) => [note, ...Array(steps - 1).fill('-')];

// --- The prophecy's tune, as prophecyTheme.js has it: one token per 8th. ---
const PROPHECY = `
  . . E5 - - - A5 - | C6 - - - B5 - A5 - | G5 - - - - - . . | . . E5 - G5 - C6 - |
  B5 - - - A5 - E5 - | F5 - - - A5 - - - | G#5 - - - - - B5 - | A5 - - - - - . . |
`;
// Told slowly: one token per beat, so each of its bars takes two of ours.
const TOLD = melody(PROPHECY, 4);

const INTRO_CHORDS = 'Am F C G';
const CALM_CHORDS = 'Am F E Am';
const DROP_CHORDS = 'Am F C G Am F E Am';
const HUSH_CHORDS = 'F G E E';

// --- The drop: the same tune, punched into a 3-3-2 rhythm, with the gaps
// filled. Once, then again (up a step) with a climbing ending. ---
const DROP_TUNE = `
  E5 - - A5 - - C6 - | C6 - - B5 - - A5 - | G5 - - - - - E5/G5 C6/E6 | D6 - - B5 - - G5 - |
  B5 - - A5 - - E5 - | F5 - - A5 - - C6 - | B5 - - - G#5 - B5 - |
`;
const DROP_A = melody(`${DROP_TUNE} A5 - - - - - E5/G5 A5/C6 |`);
const DROP_B = melody(`${DROP_TUNE} A5 - - - C6 - E6 - |`);

// The build's last bar: the violins run up chromatically, then silence.
const RUN_UP = melody('E5/F5 F#5/G5 G#5/A5 A#5/B5 C6/C#6 D6/D#6 . .');
const HORN_CLIMB = melody('G#3 - - - B3 - - - | D4 - E4 - F4 - . .');

// The hush: the tune's first notes, slowly, over chords that don't resolve.
const HUSH_TUNE = melody('E5 - - - A5 - C6 - | B5 - - - - - - - | G#5 - - - - - - - | - - - - . . . .');

// The title hit: everything on A, held, then the piano alone, fading.
const TITLE_HIT = melody('A5 - - - - - - - | - - - - - - - - | . . . . . . . . | . . . . . . . .');
const TITLE_PIANO = melody('. . E5 - - - A5 - | - - - - - - - -');

// --- Patterns, as semitones above each chord's root. ---
// Driving low strings: octaves with a push before each beat.
const DRIVE = [0, '.', 0, 12, '.', 0, 12, '.', 0, '.', 0, 12, '.', 0, 12, 7];
// The basses dig in on the 3-3-2.
const DIG = [0, '.', '.', 0, '.', '.', 0, '.', 0, '.', '.', 0, '.', '.', 0, 0];
// Racing 16th-note spiccato violins.
const RACE = [0, 7, 12, 'third', 12, 7, 'tenth', 7];
const EIGHTHS = [0, '.', 7, '.', 12, '.', 7, '.'];
// A slow harp ripple in 8ths for the calm.
const RIPPLE = [0, '-', 7, '-', 12, '-', 'tenth', '-', 19, '-', 'tenth', '-', 12, '-', 7, '-'];
// Piano octaves hammered on the 3-3-2.
const HAMMER = [12, '.', '.', 12, '.', '.', 12, '.', 12, '.', '.', 12, '.', '.', 19, '.'];
// The build's pedal, in 8ths and then 16ths, stopping a beat early.
const PEDAL_8 = [0, '.', 0, '.', 0, '.', 0, '.', 0, '.', 0, '.', 0, '.', 0, '.'];
const PEDAL_16 = Array(16).fill(0);
const PEDAL_CUT = [...Array(12).fill(0), '.', '.', '.', '.'];

// --- Timpani: five real drums, so every chord's root lands between F2 and
// E3, where they're tuned. -5 is the fifth below. ---
const timpRoot = (chord) => 41 + ((midi(`${chord.replace(/m$/, '')}4`) % 12) - 5 + 12) % 12;
const timp = (chords, pattern) => chords.split(/\s+/).filter(Boolean).flatMap((chord) => pattern.map((p) => (typeof p === 'number' ? timpRoot(chord) + p : p)));
const T_ON_ONE = [0, ...Array(15).fill('.')];
const T_HEART = [0, '.', '.', 0, ...Array(12).fill('.')];
const T_QUARTERS = [0, '-', '-', '-', 0, '-', '-', '-', 0, '-', '-', '-', 0, '-', '-', '-'];
const T_EIGHTHS = [0, '-', 0, '-', 0, '-', 0, '-', 0, '-', 0, '-', 0, '-', -5, '-'];
const T_CUT = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '.', '.', '.', '.'];
const T_POUND = [0, '.', '.', 0, '.', '.', -5, '.', 0, '.', '.', 0, '.', '.', -5, 0];
// A held roll for a bar, on the roll recordings.
const timpRoll = (chord) => held(timpRoot(chord), BAR);

// --- Drums. ---
const HIT = hits('x....... ........');
const BASS_DRUM = hits('x....... x.......');
// War drums on the 3-3-2, a high drum answering.
const TAIKO = hits('x..x..x. x..x..x.');
const TAIKO_HI = hits('....x..x ..x.x.xx');
const TAIKO_HI_2 = hits('x.xx.xx. x.xx.xxx');
const SNARE = hits('....x... ....x...');
const FILL = hits('x.x.xxxx xxxxxxxx');
const KICK = hits('x.....x. ..x.....');
// Every `n`th bar starts with a hit.
const every = (bars, n) => Array.from({ length: bars }, (_, i) => (i % n === 0 ? HIT : rest(1))).flat();
// The cymbal swell is loudest 3.18s in (sampleSets.js): at 128 BPM that's 27
// steps, so it starts 27 steps before where it should peak.
const SWELL_STEPS = 27;
const swellInto = (bars, silentSteps = 0) => {
  const before = bars * BAR - SWELL_STEPS - silentSteps;
  return [...Array(before).fill('.'), ...held(60, SWELL_STEPS), ...Array(silentSteps).fill('.')];
};

// Shifts every pitched track in a section, leaving the drums (and the
// cymbal swell, which would peak early if it played faster) alone.
const UNPITCHED = ['kick', 'boom', 'snare', 'snareRoll', 'taikoBuild', 'impact', 'crash', 'gong', 'bassDrum', 'taiko', 'taikoHigh', 'swell'];
function shiftSection(section, semitones) {
  return Object.fromEntries(Object.entries(section).map(([track, steps]) => [track, UNPITCHED.includes(track) ? steps : transpose(steps, semitones)]));
}

// Everything after the drop is written in A minor and played a step up.
const UP = 2;

export const TRAILER_THEME = {
  title: 'Nobody Came',
  bpm: 128,
  stepsPerBeat: 4,
  loop: false,
  // Lots of real instruments at once: turned down a touch so the hits don't clip.
  volume: 0.72,

  instruments: {
    piano: { sample: 'piano', volume: 0.55, ring: true, reverb: 0.35, humanize: { time: 0.01, volume: 0.15 } },
    soloViolin: { sample: 'soloViolin', volume: 0.6, release: 0.4, reverb: 0.4, pan: 0.15 },
    harp: { sample: 'harp', volume: 0.35, ring: true, reverb: 0.4, pan: -0.3, humanize: { time: 0.012, volume: 0.2 } },
    violins: { sample: 'violins', volume: 0.4, attack: 0.04, release: 0.4, reverb: 0.35, pan: 0.25 },
    cellos: { sample: 'cellos', volume: 0.45, release: 0.4, reverb: 0.3, pan: -0.25 },
    violinsSpic: { sample: 'violinsSpic', volume: 0.35, release: 0.06, reverb: 0.25, pan: 0.3, humanize: { time: 0.006, volume: 0.15 } },
    cellosSpic: { sample: 'cellosSpic', volume: 0.45, release: 0.06, reverb: 0.2, pan: -0.2, humanize: { time: 0.006, volume: 0.15 } },
    bassSpic: { sample: 'bassSpic', volume: 0.5, release: 0.06, reverb: 0.15 },
    // The same strings, held back during the build so the drop takes over.
    violinsBuild: { sample: 'violinsSpic', volume: 0.25, release: 0.06, reverb: 0.25, pan: 0.3, humanize: { time: 0.006, volume: 0.15 } },
    cellosBuild: { sample: 'cellosSpic', volume: 0.28, release: 0.06, reverb: 0.2, pan: -0.2, humanize: { time: 0.006, volume: 0.15 } },
    bassBuild: { sample: 'bassSpic', volume: 0.3, release: 0.06, reverb: 0.15 },
    hornsBuild: { sample: 'horns', volume: 0.28, release: 0.15, reverb: 0.4, pan: -0.1 },
    tromboneBuild: { sample: 'trombone', volume: 0.28, release: 0.15, reverb: 0.35, pan: -0.15 },
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
    bassDrum: { sample: 'bassDrum', drum: 'sample', volume: 0.8, ring: true, reverb: 0.3 },
    taiko: { sample: 'tenorDrum', drum: 'sample', volume: 0.6, ring: true, reverb: 0.25, humanize: { time: 0.004, volume: 0.15 } },
    taikoHigh: { sample: 'tenorDrumHigh', drum: 'sample', volume: 0.4, ring: true, reverb: 0.25, pan: 0.2, humanize: { time: 0.004, volume: 0.2 } },
    // The build's rolls, quieter than the drop's snare so the drop hits harder.
    snareRoll: { sample: 'snare', drum: 'sample', volume: 0.17, release: 0.08, reverb: 0.3, humanize: { time: 0.003, volume: 0.25 } },
    snare: { sample: 'snare', drum: 'sample', volume: 0.45, ring: true, reverb: 0.25, humanize: { time: 0.003, volume: 0.2 } },
    crash: { sample: 'crash', drum: 'sample', volume: 0.45, ring: true, reverb: 0.3 },
    // The deepest bass drum, on the downbeats that matter.
    // The BRAAAM: low trombones blasting the drop's first chord.
    braam: { sample: 'trombone', volume: 0.75, release: 0.6, reverb: 0.45 },
    impact: { sample: 'bassDrumDeep', drum: 'sample', volume: 1, ring: true, reverb: 0.4 },
    gong: { sample: 'gong', drum: 'sample', volume: 0.6, ring: true, reverb: 0.3 },
    kick: { drum: 'kick', volume: 0.5 },
    boom: { drum: 'boom', volume: 0.9 },
  },

  sections: {
    // Black screen: the piano tells the prophecy, the cellos under it, and
    // the violins creep in for the second half.
    intro: {
      piano: TOLD.slice(0, 8 * BAR),
      cellos: sustained(INTRO_CHORDS, 2 * BAR, 0, 2),
      violins: [...rest(4), ...sustained('C G', 2 * BAR, 1, 4)],
    },

    // The solo violin takes the tune over a harp; horns swell in, and the
    // timpani start a heartbeat.
    calm: {
      soloViolin: TOLD.slice(8 * BAR),
      harp: arpeggio(CALM_CHORDS, 2 * BAR, 3, RIPPLE),
      cellos: sustained(CALM_CHORDS, 2 * BAR, 0, 2),
      violins: sustained(CALM_CHORDS, 2 * BAR, 1, 4),
      hornsSoft: [...rest(4), ...sustained('E Am', 2 * BAR, 0, 3)],
      timpani: [...rest(4), ...timp('E E Am Am', T_HEART)],
    },

    // Everything winds up: the strings go from 8ths to 16ths, the drums
    // roll tighter, the brass climbs, the cymbal swells... and it all stops
    // dead a beat before the drop.
    build: {
      violinsBuild: [...arpeggio('F', BAR, 4, EIGHTHS), ...arpeggio('G E', BAR, 4, RACE), ...RUN_UP],
      cellosBuild: [...chordLine('F G', PEDAL_8, 2), ...chordLine('E', PEDAL_16, 2), ...chordLine('E', PEDAL_CUT, 2)],
      bassBuild: [...chordLine('F G', PEDAL_8, 1), ...chordLine('E', PEDAL_16, 1), ...chordLine('E', PEDAL_CUT, 1)],
      hornsBuild: [...rest(2), ...HORN_CLIMB],
      tromboneBuild: [...rest(2), ...held(midi('E2'), 28), '.', '.', '.', '.'],
      timpBuild: [...timp('F G', T_QUARTERS), ...timp('E', T_EIGHTHS), ...timp('E', T_CUT)],
      snareRoll: [...rest(1), ...hits('x.x.x.x. x.x.x.x.'), ...hits('xxxxxxxx xxxxxxxx'), ...hits('xxxxxxxx xxxx....')],
      taikoBuild: [...rest(2), ...hits('x...x... x...x...'), ...hits('x.x.x.x. x.x.....')],
      swell: swellInto(4, 4),
    },

    // THE DROP. Gong, bass drum, crash and a low BRAAAM on the downbeat;
    // then the tune on trumpets, horns and trombones in three octaves, the
    // strings racing, the basses digging in, timpani and war drums pounding.
    drop: {
      trumpet: transpose(DROP_A, -12),
      horns: transpose(DROP_A, -12),
      trombone: transpose(DROP_A, -24),
      braam: [...held(midi('A1'), 12), ...Array(4).fill('.'), ...rest(7)],
      tuba: sustained(DROP_CHORDS, BAR, 0, 1),
      violins: sustained(DROP_CHORDS, BAR, 1, 4),
      violinsSpic: arpeggio(DROP_CHORDS, BAR, 4, RACE),
      cellosSpic: chordLine(DROP_CHORDS, DRIVE, 2),
      bassSpic: chordLine(DROP_CHORDS, DIG, 1),
      timpani: [...timp('Am F C G Am F E', T_POUND), ...rest(1)],
      timpRoll: [...rest(7), ...timpRoll('E')],
      bassDrum: repeat(BASS_DRUM, 8),
      taiko: repeat(TAIKO, 8),
      taikoHigh: [...repeat(TAIKO_HI, 7), ...FILL],
      snare: [...repeat(SNARE, 7), ...FILL],
      kick: repeat(KICK, 8),
      crash: every(8, 4),
      gong: every(8, 8),
      impact: every(8, 8),
      boom: every(8, 4),
    },

    // Up a step and louder still: the violins sing the tune with the brass,
    // the piano hammers octaves, the war drums double up.
    rise: shiftSection({
      violins: DROP_B,
      braam: [...held(midi('A1'), 12), ...Array(4).fill('.'), ...rest(7)],
      trumpet: transpose(DROP_B, -12),
      horns: transpose(DROP_B, -12),
      trombone: transpose(DROP_B, -24),
      tuba: sustained(DROP_CHORDS, BAR, 0, 1),
      piano: chordLine(DROP_CHORDS, HAMMER, 3),
      violinsSpic: arpeggio(DROP_CHORDS, BAR, 4, RACE),
      cellosSpic: chordLine(DROP_CHORDS, DRIVE, 2),
      bassSpic: chordLine(DROP_CHORDS, DIG, 1),
      timpani: [...timp('Am F C G Am F E', T_POUND), ...rest(1)],
      timpRoll: [...rest(7), ...timpRoll('Am')],
      bassDrum: repeat(BASS_DRUM, 8),
      taiko: repeat(TAIKO, 8),
      taikoHigh: [...repeat(TAIKO_HI_2, 7), ...FILL],
      snare: [...repeat(SNARE, 7), ...FILL],
      kick: repeat(KICK, 8),
      crash: every(8, 2),
      gong: every(8, 8),
      impact: every(8, 8),
      boom: every(8, 2),
    }, UP),

    // Drums out. Cellos and violins hold chords that won't settle, the horns
    // swell, and the piano half-remembers the tune; then a roll and the
    // cymbal swell pull everything into the last hit.
    hush: shiftSection({
      piano: HUSH_TUNE,
      cellos: sustained(HUSH_CHORDS, BAR, 0, 2),
      violins: sustained(HUSH_CHORDS, BAR, 1, 4),
      hornsSoft: [...rest(2), ...sustained('E', 2 * BAR, 1, 3)],
      timpRoll: [...rest(3), ...timpRoll('E')],
      snareRoll: [...rest(3), ...hits('x.x.x.x. xxxxxxxx')],
      swell: swellInto(4),
    }, UP),

    // NOBODY'S HERO: the whole orchestra on one chord, then the piano alone.
    title: shiftSection({
      trumpet: transpose(TITLE_HIT, -12),
      horns: transpose(TITLE_HIT, -12),
      trombone: transpose(TITLE_HIT, -24),
      violins: TITLE_HIT,
      tuba: [...held(midi('A1'), 2 * BAR), ...rest(2)],
      cellos: [...held(midi('A2'), 2 * BAR), ...rest(2)],
      timpani: [...timp('Am', T_ON_ONE), ...rest(3)],
      piano: [...held(midi('A3'), BAR), ...rest(1), ...TITLE_PIANO],
      bassDrum: [...HIT, ...rest(3)],
      gong: [...HIT, ...rest(3)],
      impact: [...HIT, ...rest(3)],
      crash: [...HIT, ...rest(3)],
      kick: [...HIT, ...rest(3)],
      boom: [...HIT, ...rest(3)],
    }, UP),
  },

  order: ['intro', 'calm', 'build', 'drop', 'rise', 'hush', 'title'],
};
