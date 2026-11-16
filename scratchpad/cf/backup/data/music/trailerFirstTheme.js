import { melody, chordLine, sustained, arpeggio, transpose, hits, repeat, midi } from '../../audio/notation.js';
import { TRAILER_SEARCH_THEME } from './trailerSearchTheme.js';

// "Once, Somebody Came": the song for the Chapter 4 trailer
// (tools/trailer4.html), played by a real orchestra (recordings from
// assets/audio/samples/, not synths), built like "They'll Come"
// (trailerSearchTheme.js; it borrows that song's instrument list).
//
// The chapter's only tune is its four-note question, the first cell (see
// parts/chapter4.js): up a fourth, up a third, one step back down. This
// trailer tells the chapter by playing that one cell in each place's colour:
//
//   sunny    7 bars  0:00  D major, a flute whistling it over a strummed harp
//                          and plucked "oom-pah": a sunny walk, almost too
//                          perfect (one wrong bell near the end)
//   crack    1 bar   0:14  everything stops but a rumble under the grass
//   fall     2 bars  0:16  the harp tumbles down; the thud; a music box
//   glimmer  6 bars  0:20  A major with the raised fourth: glass and harp,
//                          a flute and solo violin singing it long: wonder
//   town     4 bars  0:32  D major again, warm: ocarina and clarinet, a harp
//                          strumming, an anvil far off: Belowtown
//   mines    4 bars  0:40  E minor: the pick strike (E E B) on plucked
//                          cellos, the cell on the horns, carts rattling
//   hush     4 bars  0:48  the Stillwater (an oboe, long, and its mirror in
//                          bowed glass) then the Deep (rain: C G D, a choir)
//   build    4 bars  0:56  strings racing, the drums tighten... and a beat
//                          of dead silence
//   drop     8 bars  1:04  THE DROP, E minor: the cell on all the brass
//   finale   8 bars  1:20  up into E major: the sunny tune again, on
//                          everything, for the title card
//   tag      2 bars  1:36  the music box alone, one note short of home
//
// 120 BPM, a step is a 16th note, so a bar is exactly 2 seconds. About 100
// seconds. tools/trailer4.html cuts its shots on these bars.

const BAR = 16;
const rest = (bars) => Array(bars * BAR).fill('.');
const held = (note, steps) => [typeof note === 'number' ? note : midi(note), ...Array(steps - 1).fill('-')];
const tune = (text) => melody(text, 2);
const run = (text) => melody(text, 1);

// The last `steps` of every track in a section cut dead.
const cutEnd = (section, steps = 4) => Object.fromEntries(Object.entries(section).map(([track, notes]) => [track, [...notes.slice(0, notes.length - steps), ...Array(steps).fill('.')]]));

// --- Sunnyside: the tune (the cell opens it, twice), D major. ---
const SUNNY_TUNE = tune(`
  A4 - D5 - F#5 - E5 - | D5 - B4 - D5 - G5 - | F#5 - E5 - D5 - F#5 - | E5 - - - E5 - C#5 - |
  A4 - D5 - F#5 - E5 - | B5 - A5 - G5 - B5 - | A5 - F#5 - E5 - C#5 - |
`);
const SUNNY_CLARINET = tune(`
  . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . |
  F#4 - A4 - A4 - G4 - | G4 - E4 - G4 - D5 - | F#4 - A4 - G4 - E4 - |
`);
const SUNNY_CHORDS = 'D G D A D G A';
const OOMPAH = [0, '.', '.', '.', 7, '.', '.', '.', 0, '.', '.', '.', 7, '.', '.', '.'];
const OFFBEAT = ['.', '.', 'third', '.', '.', '.', 'third', '.', '.', '.', 'third', '.', '.', '.', 'third', 7];
const STRUM = [0, '.', 'third', '.', 7, '.', 'third', '.', 0, '.', 'third', '.', 7, '.', 12, '.'];
// The one wrong note: a B flat on a bell, half way through the sixth bar.
const WRONG_BELL = [...Array(8).fill('.'), ...melody('Bb5 - - -', 2)];

// --- The fall. ---
const BOX_FALL = tune('A5/A5 D6 - - F#6 E6 - - ');

// --- The Glimmering: the cell in A (E A C# B) glittering, and the long tune. ---
const GLITTER = run('E6 A6 C#7 B6 E6 A6 C#7 B6 E6 A6 C#7 B6 E6 A6 C#7 B6');
const GLIM_CHORDS = 'A B A B F#m A';
const GLIM_TUNE = tune(`
  E5 - - - A5 - - - | D#5 - - - F#5 - - - | C#6 - - - B5 - A5 - | D#6 - - - C#6 - B5 - |
  A5 - - - C#6 - - - | B5 - - - E6 - - - |
`);
const GLIM_HIGH = tune(`
  . . . . . . . . | . . . . . . . . | E6 - - - A6 - - - | F#6 - - - D#6 - . . |
  C#6 - - - E6 - - - | F#6 - - - A6 - - - |
`);

// --- Belowtown: warm, D major, the cell as a town tune. ---
const TOWN_CHORDS = 'D G A D';
const TOWN_TUNE = tune(`
  A4 - D5 - F#5 - E5 - | D5 - B4 - G5 - F#5 - | E5 - A5 - G5 - F#5 - | F#5 - D5 - D5 - A4 - |
`);
const TOWN_ANSWER = tune(`
  . . . . . . . . | . . . . . . . . | A4 - . . . . . . | . . . . . . . . |
`);
const ROLL = [0, '.', 7, '.', 'third', '.', 7, '.', 12, '.', 7, '.', 'third', '.', 7, '.'];

// --- The mines: E minor. The pick strike E E B, E E E; the cell on horns. ---
const PICK = run('E3 . . E3 . . B3 . E3 . . E3 . . E3 .');
const PICK_TOP = run('E4 . . E4 . . B4 . E4 . . E4 . . E4 .');
const MINES_CHORDS = 'Em C Am B';
const MINES_TUNE = tune(`
  B4 - E5 - G5 - F#5 - | E5 - G5 - E5 - C5 - | C5 - E5 - A5 - G5 - | F#5 - D#5 - B4 - . . |
`);

// --- The Stillwater and the Deep. ---
const WATER = tune('E5 - - - A5 - - - | C6 - - - B5 - - -');
const WATER_MIRROR = tune('B4 - C5 - A4 - E4 -');
const RAIN_DEEP = run('C5 G5 D6 C5 G5 D6 C5 G5 D6 C5 G5 D6 C5 G5 D6 G5');
const DEEP_ASK = tune('B4 - E5 - - - - - | B4 - E5 - G5 - - -');

// --- The drop, E minor: the cell on the brass. ---
const DROP_CHORDS = 'Em C G D Em C Am B';
const DROP_TUNE = tune(`
  B4/B4 E5 - - G5 - F#5 - | E5 - G5 - C6 - B5 - | D6 - - - B5 - G5 - | F#5 - A5 - D6 - C#6 - |
  B4/B4 E5 - - G5 - F#5 - | E5 - G5 - C6 - E6 - | C6 - - - A5 - E5 - | F#6 - - - D#6 - B5 - |
`);
const DESCANT = tune(`
  B6 - - - - - - - | C7 - - - B6 - - - | D7 - - - - - B6 - | A6 - - - - - - - |
  B6 - - - - - - - | C7 - - - E7 - - - | C7 - - - B6 - A6 - | F#6 - - - - - - - |
`);
const HORN_CLIMB = tune('G#4 - - - B4 - - - | C5 - D5 - D#5 - . .');
const RUN_UP = melody('D#5/E5 F#5/G5 G#5/A5 A#5/B5 C#6/D6 D#6/E6 . .');

// --- The finale, E major: the sunny tune, on everything. ---
const FINALE_CHORDS = 'E E A B E C#m A E';
const FINALE_TUNE = tune(`
  E6 - - - - - - - | B4/B4 E5 - - G#5 - F#5 - | E5 - G#5 - A5 - G#5 - | F#5 - B5 - D#6 - C#6 - |
  B4/B4 E5 - - G#5 - F#5 - | E5 - G#5 - C#6 - B5 - | C#6 - - - E6 - A5 - | E6 - - - - - - - |
`);
const TAG_BOX = tune('B5/B5 E6 - - G#6 - . . | . . . . . . . .');

// --- Patterns. ---
const DRIVE = [0, '.', 0, 12, '.', 0, 12, '.', 0, '.', 0, 12, '.', 0, 12, 7];
const DIG = [0, '.', '.', 0, '.', '.', 0, '.', 0, '.', '.', 0, '.', '.', 0, 0];
const RACE = [0, 7, 12, 'third', 12, 7, 'tenth', 7];
const EIGHTHS = [0, '.', 7, '.', 12, '.', 7, '.'];
const RIPPLE = [0, '-', 7, '-', 12, '-', 'tenth', '-', 19, '-', 'tenth', '-', 12, '-', 7, '-'];
const SLOW_RIPPLE = [0, '-', '-', '-', 7, '-', '-', '-', 12, '-', '-', '-', 7, '-', '-', '-'];
const HAMMER = [12, '.', '.', 12, '.', '.', 12, '.', 12, '.', '.', 12, '.', '.', 19, '.'];
const PEDAL_8 = [0, '.', 0, '.', 0, '.', 0, '.', 0, '.', 0, '.', 0, '.', 0, '.'];
const PEDAL_16 = Array(16).fill(0);
const PEDAL_CUT = [...Array(12).fill(0), '.', '.', '.', '.'];

const timpRoot = (chord) => 41 + ((midi(`${chord.replace(/m$/, '')}4`) % 12) - 5 + 12) % 12;
const timp = (chords, pattern) => chords.split(/\s+/).filter(Boolean).flatMap((chord) => pattern.map((p) => (typeof p === 'number' ? timpRoot(chord) + p : p)));
const T_ON_ONE = [0, ...Array(15).fill('.')];
const T_HEART = [0, '.', '.', 0, ...Array(12).fill('.')];
const T_QUARTERS = [0, '-', '-', '-', 0, '-', '-', '-', 0, '-', '-', '-', 0, '-', '-', '-'];
const T_EIGHTHS = [0, '-', 0, '-', 0, '-', 0, '-', 0, '-', 0, '-', 0, '-', -5, '-'];
const T_CUT = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '.', '.', '.', '.'];
const T_POUND = [0, '.', '.', 0, '.', '.', -5, '.', 0, '.', '.', 0, '.', '.', -5, 0];
const timpRoll = (chord) => held(timpRoot(chord), BAR);

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
const HAND = hits('x.x..x.. x.x.x...');
const every = (bars, n) => Array.from({ length: bars }, (_, i) => (i % n === 0 ? HIT : rest(1))).flat();
// The cymbal swell is loudest 3.18s in: at 120 BPM that's 26 steps.
const SWELL_STEPS = 26;
const swellInto = (bars, silentSteps = 0) => {
  const before = bars * BAR - SWELL_STEPS - silentSteps;
  return [...Array(before).fill('.'), ...held(60, SWELL_STEPS), ...Array(silentSteps).fill('.')];
};

export const TRAILER_FIRST_THEME = {
  title: 'Once, Somebody Came',
  bpm: 120,
  stepsPerBeat: 4,
  loop: false,
  volume: 0.9,
  limit: 1.4,

  instruments: {
    ...TRAILER_SEARCH_THEME.instruments,
    flute: { sample: 'flute', volume: 0.5, release: 0.15, reverb: 0.3, pan: 0.1 },
    clarinet: { sample: 'clarinet', volume: 0.42, release: 0.15, reverb: 0.3, pan: -0.2 },
    ocarina: { sample: 'ocarina', volume: 0.5, release: 0.2, reverb: 0.35, pan: 0.1 },
    bell: { sample: 'glock', volume: 0.3, ring: true, reverb: 0.5, pan: 0.2 },
    strum: { sample: 'harp', volume: 0.4, ring: true, reverb: 0.3, pan: -0.25, humanize: { time: 0.01, volume: 0.15 } },
    pizzBass: { sample: 'cellosPizz', volume: 0.5, ring: true, reverb: 0.2, pan: -0.15, humanize: { time: 0.008, volume: 0.15 } },
    pizzUp: { sample: 'violinsPizz', volume: 0.32, ring: true, reverb: 0.2, pan: 0.25, humanize: { time: 0.008, volume: 0.15 } },
    pick: { sample: 'cellosPizz', volume: 0.6, ring: true, reverb: 0.15, humanize: { time: 0.004, volume: 0.12 } },
    pickTop: { sample: 'violinsPizz', volume: 0.3, ring: true, reverb: 0.15, pan: 0.2, humanize: { time: 0.004, volume: 0.12 } },
    anvil: { sample: 'anvil', drum: 'sample', volume: 0.3, ring: true, reverb: 0.4, pan: 0.3 },
    claps: { sample: 'claps', drum: 'sample', volume: 0.22, ring: true, reverb: 0.3 },
    choir: { sample: 'choir', volume: 0.4, attack: 0.3, release: 0.8, reverb: 0.5 },
    rumble: { sample: 'cellos', volume: 0.35, attack: 0.5, release: 0.4, reverb: 0.4 },
  },

  sections: {
    // D major: a flute whistling the cell over a strummed harp and plucked
    // oom-pah; a clarinet joins in thirds from bar 5; a hand drum keeps time
    // with the grass. Bar 6 has the one wrong bell; bar 7 stops mid-air.
    sunny: cutEnd({
      flute: SUNNY_TUNE,
      clarinet: SUNNY_CLARINET,
      strum: arpeggio(SUNNY_CHORDS, BAR, 4, STRUM),
      pizzBass: chordLine(SUNNY_CHORDS, OOMPAH, 2),
      pizzUp: [...rest(2), ...chordLine('D A D G A', OFFBEAT, 4)],
      frameDrum: [...rest(1), ...repeat(HAND, 6)],
      bell: [...rest(5), ...WRONG_BELL, ...rest(1)],
    }, 6),

    // Under the grass: one low, quiet cello note, getting louder.
    crack: {
      rumble: held('E2', BAR),
      violinsTrem: [...held('B5', 12), '.', '.', '.', '.'],
      boom: hits('........ ....x...'),
    },

    // The fall: a harp tumbling down three octaves with the strings ringing,
    // a thud, and the cell far off on a music box.
    fall: {
      harp: [...run('A6 F#6 D6 A5 F#5 D5 A4 F#4 D4 A3 F#3 D3 A2 F#2 D2 .'), ...rest(1)],
      violinsTrem: held('A5', 2 * BAR),
      impact: [...rest(1), ...HIT],
      boom: [...rest(1), ...HIT],
      cellos: [...rest(1), ...held('D2', BAR)],
      box: [...rest(1), ...BOX_FALL],
    },

    // The Glimmering, A major with the raised fourth (A, then B): the cell
    // glittering up top, a flute and a solo violin singing it long, warm
    // strings and bowed glass; swelling into the town.
    glimmer: {
      glock: [...rest(1), ...GLITTER, ...GLITTER, ...rest(1), ...GLITTER, ...rest(1)],
      harp: arpeggio(GLIM_CHORDS, BAR, 3, RIPPLE),
      flute: GLIM_TUNE,
      soloViolin: GLIM_HIGH,
      violas: sustained(GLIM_CHORDS, BAR, 2, 3),
      violins: [...rest(2), ...sustained('A B F#m A', BAR, 1, 4)],
      vibesBowed: sustained(GLIM_CHORDS, BAR, 0, 4),
      hornsSoft: [...rest(3), ...sustained('B F#m A', BAR, 0, 3)],
      cellos: [...held('A2', BAR), ...rest(5)],
      timpani: [...rest(4), ...timp('F#m A', T_HEART)],
      swell: swellInto(6, 0),
      frameDrum: [...rest(4), ...repeat(STEPS, 2)],
    },

    // Belowtown: D major, warm. An ocarina takes the cell, a clarinet
    // answers, the harp rolls like a guitar by a fire, an anvil ticks far
    // off, and the strings and a little hand clap warm up under it.
    town: {
      ocarina: TOWN_TUNE,
      clarinet: TOWN_ANSWER,
      harp: arpeggio(TOWN_CHORDS, BAR, 3, ROLL),
      strum: arpeggio(TOWN_CHORDS, BAR, 4, STRUM),
      piano: chordLine(TOWN_CHORDS, OOMPAH, 2),
      violas: sustained(TOWN_CHORDS, BAR, 1, 3),
      violins: [...rest(2), ...sustained('A D', BAR, 2, 4)],
      hornsSoft: [...rest(2), ...sustained('A D', BAR, 0, 3)],
      anvil: repeat(hits('x....... ........'), 4),
      claps: [...rest(2), ...repeat(hits('....x... ....x...'), 2)],
      frameDrum: repeat(STEPS, 4),
    },

    // The mines: E minor. The pick strike, E E B, E E E, on plucked cellos
    // and violins; the carts rattling in the drums; the cell on horns and
    // trumpet; the strings start to move.
    mines: {
      pick: repeat(PICK, 4),
      pickTop: [...rest(1), ...repeat(PICK_TOP, 3)],
      horns: MINES_TUNE,
      trumpet: [...rest(2), ...MINES_TUNE.slice(2 * BAR)],
      cellos: sustained(MINES_CHORDS, BAR, 0, 2),
      violas: sustained(MINES_CHORDS, BAR, 1, 3),
      violinsBuild: [...rest(2), ...arpeggio('Am B', BAR, 4, EIGHTHS)],
      timpani: [...rest(1), ...timp('C Am B', T_HEART)],
      anvil: repeat(hits('x...x... x...x...'), 4),
      tom: [...rest(1), ...repeat(TOM, 3)],
      taikoBuild: [...rest(2), ...repeat(hits('x...x... x...x...'), 2)],
    },

    // The Stillwater (a very few notes, an oboe left to ring, its mirror in
    // bowed glass) and then the Deep (rain: C G D; a choir; a solo violin
    // asking the cell and not finishing it); a swell pulls up into the build.
    hush: {
      oboe: [...WATER, ...rest(2)],
      vibesBowed: [...rest(1), ...WATER_MIRROR, ...rest(2)],
      harp: [...arpeggio('Am F', BAR, 3, SLOW_RIPPLE), ...rest(2)],
      cellos: [...sustained('Am F', BAR, 0, 2), ...rest(2)],
      violas: [...sustained('Am F', BAR, 1, 3), ...rest(2)],
      rain: [...rest(2), ...repeat(RAIN_DEEP, 2)],
      choir: [...rest(2), ...sustained('F Am', BAR, 1, 3)],
      soloViolin: [...rest(2), ...DEEP_ASK],
      violasTrem: [...rest(2), ...sustained('F Am', BAR, 2, 3)],
      timpani: [...rest(2), ...timp('F A', T_HEART)],
      swell: [...rest(2), ...held(60, 2 * BAR)],
    },

    // The strings go from 8ths to 16ths, the drums roll tighter, the horns
    // climb... and everything stops dead a beat before the drop.
    build: {
      violinsBuild: [...arpeggio('Em C', BAR, 4, EIGHTHS), ...arpeggio('B', BAR, 4, RACE), ...RUN_UP],
      cellosBuild: [...chordLine('Em C', PEDAL_8, 2), ...chordLine('B', PEDAL_16, 2), ...chordLine('B', PEDAL_CUT, 2)],
      bassBuild: [...chordLine('Em C', PEDAL_8, 1), ...chordLine('B', PEDAL_16, 1), ...chordLine('B', PEDAL_CUT, 1)],
      pick: [...repeat(PICK, 2), ...rest(2)],
      hornsBuild: [...rest(2), ...HORN_CLIMB],
      timpBuild: [...timp('Em C', T_QUARTERS), ...timp('B', T_EIGHTHS), ...timp('B', T_CUT)],
      snareRoll: [...rest(1), ...hits('x.x.x.x. x.x.x.x.'), ...hits('xxxxxxxx xxxxxxxx'), ...hits('xxxxxxxx xxxx....')],
      taikoBuild: [...rest(2), ...hits('x...x... x...x...'), ...hits('x.x.x.x. x.x.....')],
      swell: swellInto(4, 4),
      boom: [...rest(3), ...hits('........ .......x')],
      impact: [...rest(3), ...hits('........ .......x')],
    },

    // THE DROP. Gong, bass drum, crash and a low BRAAAM on the downbeat;
    // then the cell on trumpets, horns and trombones in three octaves.
    drop: {
      soloViolin: DESCANT,
      trumpetHigh: DROP_TUNE,
      violinsHigh: DROP_TUNE,
      trumpet: transpose(DROP_TUNE, -12),
      horns: transpose(DROP_TUNE, -12),
      trombone: transpose(DROP_TUNE, -24),
      braam: [...held('E2', 14), '.', '.', ...rest(7)],
      braamLow: [...held('E2', 14), '.', '.', ...rest(7)],
      tuba: sustained(DROP_CHORDS, BAR, 0, 2),
      violins: sustained(DROP_CHORDS, BAR, 1, 4),
      violinsTrem: sustained(DROP_CHORDS, BAR, 2, 5),
      violinsSpic: arpeggio(DROP_CHORDS, BAR, 4, RACE),
      cellosSpic: chordLine(DROP_CHORDS, DRIVE, 2),
      bassSpic: chordLine(DROP_CHORDS, DIG, 1),
      timpani: [...timp('Em C G D Em C Am', T_POUND), ...rest(1)],
      timpRoll: [...rest(7), ...timpRoll('B')],
      bassDrum: repeat(BASS_DRUM, 8),
      bigDrum: every(8, 1),
      tom: repeat(TOM, 8),
      taiko: repeat(TAIKO, 8),
      taikoHigh: [...repeat(TAIKO_HI, 3), ...FILL, ...repeat(TAIKO_HI, 3), ...FILL],
      snare: [...repeat(SNARE, 3), ...FILL, ...repeat(SNARE, 3), ...FILL],
      kick: repeat(KICK, 8),
      crash: every(8, 2),
      gong: every(8, 8),
      anvil: repeat(hits('..x...x. ..x...x.'), 8),
      impact: [...hits('x...x... ........'), ...every(7, 4)],
      boom: [...hits('x...x... ........'), ...every(7, 2)],
    },

    // Into E major: the Sunnyside tune, whole, on everything there is.
    // First bar: the hit for the title card, one chord held.
    finale: {
      soloViolin: transpose(FINALE_TUNE, 12),
      violins: FINALE_TUNE,
      violinsHigh: FINALE_TUNE,
      trumpetHigh: FINALE_TUNE,
      trumpet: transpose(FINALE_TUNE, -12),
      horns: transpose(FINALE_TUNE, -12),
      trombone: transpose(FINALE_TUNE, -24),
      glock: transpose(FINALE_TUNE, 12),
      flute: transpose(FINALE_TUNE, 12),
      piccolo: transpose(FINALE_TUNE, 12),
      tuba: sustained(FINALE_CHORDS, BAR, 0, 2),
      cellos: sustained(FINALE_CHORDS, BAR, 0, 3),
      braam: [...held('E2', 12), ...Array(4).fill('.'), ...rest(6), ...held('E2', BAR)],
      braamLow: [...held('E2', 12), ...Array(4).fill('.'), ...rest(6), ...held('E2', BAR)],
      piano: chordLine(FINALE_CHORDS, HAMMER, 3),
      harp: arpeggio(FINALE_CHORDS, BAR, 4, RIPPLE),
      violinsSpic: arpeggio(FINALE_CHORDS, BAR, 4, RACE),
      cellosSpic: chordLine(FINALE_CHORDS, DRIVE, 2),
      bassSpic: chordLine(FINALE_CHORDS, DIG, 1),
      timpani: [...timp('E E A B E C#m A', T_POUND), ...timp('E', T_ON_ONE)],
      timpRoll: [...rest(7), ...timpRoll('E')],
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
    },

    // The music box alone, one note short of home.
    tag: {
      box: TAG_BOX,
      cellos: held('E2', 2 * BAR),
      choir: held('E3', 2 * BAR),
    },
  },

  order: ['sunny', 'crack', 'fall', 'glimmer', 'town', 'mines', 'hush', 'build', 'drop', 'finale', 'tag'],
};
