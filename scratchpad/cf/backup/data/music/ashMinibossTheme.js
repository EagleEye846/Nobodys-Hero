import { melody, hits, repeat, arpeggio, chordLine, sustained, transpose } from '../../audio/notation.js';
import { ORCHESTRA, timp as timpAll, held } from './parts/usurper.js';
import { SAMPLE_SETS } from '../../audio/sampleSets.js';

// "Under the Drift": the mini-boss of the ash wastes' first area. Something
// very old and very big has been lying under the ash so long the ash forgot
// it was there, and now it is getting up. A short boss song in Toby Fox's
// way: its own motif, slow and heavy, woven through every section, the
// area's tune pulled into the fight, a quiet turn in the middle, and home
// before the loop. All real recorded instruments.
//
// ITS MOTIF (new, 8 bars, B minor): up a fifth from the bottom, like a
// back lifting out of a drift (B, F#), a step up to G, and a slow sink
// (F# E D). Said again, it climbs the other way, A B C: C natural, the flat
// second, the one dark borrowed chord. Then it sinks home onto F#. Low
// brass carry it: trumpets at pitch, horns and trombones an octave under,
// the tuba two, low strings with them.
//
// THE SECOND THEME is the area's hook ("Footprints Fill In", ashTheme.js),
// the ember cell's waltz, re-barred into 4/4 and moved into B minor: B C#
// D F#, G falling to F#. The little music box tune you walked in on, now
// on racing violins and a flute.
//
// THE TURN (about 55% in): the drums stop and the ash settles. A piano
// plays the motif at half speed in D major, so the thing sounds tired
// rather than angry for a moment; a glockenspiel picks out the ember cell
// (which sits inside D major), a choir hums. Then it gets up again: the
// motif in C minor, a semitone higher, the area's hook on trumpets over
// it, and a turnaround back down to B minor before the loop.
//
// B minor, C major (bII) the borrowed colour, D major for the turn and C
// minor for the climb. 4/4 at 140 BPM, one step a 16th (a bar is about 1.7
// seconds). The intro plays once (4 bars); then it loops from A, 76 bars,
// about 2m10s:
//
//   intro   4 bars  0:00  the low ostinato alone, a crackle; the tuba
//                         teases the motif's first bar
//   A      16 bars  0:07  THE MOTIF on low strings and horns, then the
//                         trumpets take it with the full kit
//   B       8 bars  0:34  THE AREA'S HOOK re-barred, on violins and flute;
//                         brass stabs under it
//   C       8 bars  0:48  the build: the motif's first bar climbing a step
//                         a bar over a snare roll; stops dead
//   D      16 bars  1:02  THE DROP: gong, braam, the motif on every seat
//                         and a choir; the hook as a counter-line
//   E       8 bars  1:29  THE TURN: no drums; the motif at half speed in D
//                         major on the piano, the ember cell on the glock
//   F       8 bars  1:43  it gets up: the motif in C minor, a semitone up
//   G       8 bars  1:57  the climb: the hook in C minor on the trumpets,
//                         the motif in the bass
//   H       4 bars  2:10  home: down to F#, round to A

const BAR = 16;
const tune = (text) => melody(text, 2);   // each token an 8th: 8 to a bar
const rest = (bars) => Array(bars * BAR).fill('.');
const tight = (name, section, bars) => {
  for (const [track, steps] of Object.entries(section)) {
    if (steps.length !== bars * BAR) throw new Error(`Under the Drift ${name}: '${track}' is ${steps.length} steps, not ${bars} bars`);
  }
  return section;
};
const once = (pattern, bars) => [...pattern, ...Array(bars * BAR - pattern.length).fill('.')];
const stopAt = (steps, keep = 12) => [...steps.slice(0, steps.length - BAR + keep), ...Array(BAR - keep).fill('.')];
// The cymbal swell is loudest 3.18 seconds in: about 30 steps at 140 BPM.
const SWELL_STEPS = 30;
const swellInto = (bars, keep = 0) => {
  const len = Math.min(SWELL_STEPS, bars * BAR - keep);
  return [...Array(bars * BAR - keep - len).fill('.'), ...held(60, len), ...Array(keep).fill('.')];
};
const beat = (pattern, bars) => repeat(hits(pattern), bars);
const playable = (track, set) => track.map((n) => (
  typeof n === 'number' && SAMPLE_SETS[set].notes.every((r) => Math.abs(r - n) > 5) ? '.' : n));
const half = (steps) => steps.flatMap((s) => [s, typeof s === 'number' ? '-' : s]);
const up = (steps, semitones) => transpose(steps, semitones);
// The timpani, with any note over the top drum taken down an octave.
const timp = (names, pattern) => timpAll(names, pattern).map((n) => (typeof n === 'number' && n > 55 ? n - 12 : n));

// --- Harmony, a bar each ---
const MOTIF_CHORDS = 'Bm G Bm C Bm G Em F#';
const MOTIF_CHORDS_16 = `${MOTIF_CHORDS} ${MOTIF_CHORDS}`;
const HOOK_CHORDS = 'Bm G Em D Bm G Em F#';
const C_CHORDS = 'Bm C# D E F# G G F#';
const E_CHORDS = 'D D G G D D A A';
const F_CHORDS = 'Cm Ab Cm Db Cm Ab Fm G';
const G_CHORDS = 'Cm Ab Fm Eb Cm Ab Fm G';
const H_CHORDS = 'G G F# F#';

// --- THE MOTIF ---
const MOTIF = tune(`
  B3 - - F#4 - - G4 - | F#4 - E4 - D4 - - - | B3 - - F#4 - - G4 - | A4 - B4 - C5 - - - |
  B4 - - F#4 - - G4 - | F#4 - E4 - D4 - E4 - | F#4 - - G4 - - E4 - | F#4 - - - - - . . |
`);
const MOTIF16 = [...MOTIF, ...MOTIF];
// The area's hook, re-barred into 4/4, in B minor.
const HOOK = tune(`
  B4 - C#5 D5 - F#5 - - | G5 - F#5 - - - . . | E5 - D5 C#5 - D5 - - | A4 - - - - - . . |
  B4 - C#5 D5 - F#5 - - | A5 - - G5 - F#5 - - | E5 - G5 F#5 - D5 - - | C#5 - - - - - . . |
`);
// The build: the motif's first bar, a step higher each bar.
const BUILD = tune(`
  B3 - - F#4 - - G4 - | C#4 - - G#4 - - A4 - | D4 - - A4 - - B4 - | E4 - - B4 - - C5 - |
  F#4 - - C#5 - - D5 - | G4 - - D5 - - E5 - | G4 - - D5 - - E5 - | F#4 - - - - - . . |
`);
// The turn: the motif at half speed, in D major.
const TIRED = half(tune(`
  D4 - - A4 - - B4 - | A4 - G4 - F#4 - - - | D4 - - A4 - - B4 - | C#5 - D5 - E5 - - - |
`));
// The ember cell on the glock, in the turn (B C# D F#, G to F#: inside D major).
const EMBER = tune(`
  . . . . . . . . | B5 - C#6 D6 - F#6 - - | G6 - - F#6 - - - - | . . . . . . . . |
  . . . . . . . . | B5 - C#6 D6 - F#6 - - | A6 - - G6 - - F#6 - | E6 - - - - - . . |
`);
// The climb: the hook in C minor.
const HOOK_C = up(HOOK, 1);
const MOTIF_C = up(MOTIF, 1);
// Home: the motif's last two bars, twice, sinking onto F#.
const HOME = tune(`
  F#4 - - G4 - - E4 - | F#4 - - - - - . . | B3 - - D4 - - C#4 - | A#3 - - - - - . . |
`);
// The drop's counter-line: the hook's opening, high, on the violins.
const COUNTER = tune(`
  . . . . . . . . | . . . . . . . . | B5 - C#6 D6 - F#6 - - | G6 - F#6 - - - . . |
  . . . . . . . . | . . . . . . . . | E6 - D6 C#6 - D6 - - | C#6 - - - - - . . |
`);

// --- The ostinato and the low strings ---
const RIFF = [0, '.', 0, 0, 7, '.', 0, '.', 12, '.', 7, '.', 0, '.', 'third', '.'];
const HEAVE = [0, '-', '-', 0, '.', '.', 0, '.', 0, '-', '-', 0, '.', '.', 0, '.'];
const ROOTS = [0, '-', '-', '-', '-', '-', '-', '-', 0, '-', '-', '-', 7, '-', '-', '-'];
const RACE = [0, 7, 'third', 7, 12, 7, 'third', 7, 0, 7, 'third', 7, 12, 7, 'tenth', 7];
const T_DRIVE = [0, '.', '.', 0, '.', '.', 0, '.', 0, '.', '.', 0, '.', '.', 7, '.'];
const T_HEART = [0, '.', '.', 0, ...Array(12).fill('.')];

// --- Drums, a bar each ---
const TAIKO = 'x..x..x.x..x..x.';
const TAIKO_HI = '....x.......x..x';
const SNARE = '....x.......x...';
const SNARE_FILL = '....x.......xxxx';
const SNARE_BUILD = 'x.x.x.x.x.x.x.x.';
const SNARE_ROLL = 'xxxxxxxxxxxxxxxx';
const KICK = 'x.......x.x.....';
const CRASH = 'x...............';
const CRACKLE = ['x.xx..x.x..xx.x.', '.x.x.xx..x.x.xx.'];
const crackle = (bars) => Array.from({ length: bars }, (_, i) => hits(CRACKLE[i % 2])).flat();

export const ASH_MINIBOSS_THEME = {
  title: 'Under the Drift',
  bpm: 140,
  stepsPerBeat: 4,
  volume: 0.89,

  instruments: {
    ...ORCHESTRA,
    pound: { ...ORCHESTRA.pound, volume: 0.38 },
    basses: { ...ORCHESTRA.basses, volume: 0.44 },
    race: { ...ORCHESTRA.race, volume: 0.2 },
    impact: { ...ORCHESTRA.impact, volume: 0.55 },
    gong: { ...ORCHESTRA.gong, volume: 0.45 },
    braam: { ...ORCHESTRA.braam, volume: 0.6 },
    braamLow: { ...ORCHESTRA.braamLow, volume: 0.55 },
    crash: { ...ORCHESTRA.crash, volume: 0.3 },
    taiko: { ...ORCHESTRA.taiko, volume: 0.48 },
    timpani: { ...ORCHESTRA.timpani, volume: 0.55 },
    trumpets: { ...ORCHESTRA.trumpets, volume: 0.36 },
    horns: { ...ORCHESTRA.horns, volume: 0.44 },
    trombones: { ...ORCHESTRA.trombones, volume: 0.42 },
    tuba: { ...ORCHESTRA.tuba, volume: 0.42 },
    cellos: { ...ORCHESTRA.cellos, volume: 0.36 },
    violins: { ...ORCHESTRA.violins, volume: 0.32 },
    violinsHigh: { ...ORCHESTRA.violinsHigh, volume: 0.26 },
    violas: { sample: 'violas', volume: 0.22, attack: 0.03, release: 0.3, reverb: 0.4, pan: 0.2, humanize: { time: 0.006, volume: 0.08 } },
    flute: { sample: 'flute', volume: 0.22, attack: 0.03, release: 0.3, reverb: 0.45, pan: 0.25, humanize: { time: 0.006, volume: 0.08 } },
    choir: { sample: 'choir', volume: 0.26, attack: 0.25, release: 0.8, reverb: 0.6 },
    grand: { sample: 'grandPiano', volume: 0.3, ring: true, reverb: 0.55, humanize: { time: 0.012, volume: 0.12 } },
    glock: { sample: 'glock', volume: 0.1, ring: true, detune: -18, reverb: 0.6, echo: { time: 0.43, feedback: 0.25, mix: 0.2 } },
    lowTrem: { sample: 'cellosTrem', volume: 0.24, attack: 0.5, release: 0.6, reverb: 0.4, pan: -0.2 },
    violinsTrem: { sample: 'violinsTrem', volume: 0.14, attack: 0.5, release: 0.8, reverb: 0.5, pan: 0.25 },
    crackle: { sample: 'shaker', drum: 'sample', volume: 0.16, ring: true, reverb: 0.2, pan: 0.3, humanize: { time: 0.006, volume: 0.45 } },
    kick: { sample: 'concertBassDrum', drum: 'sample', volume: 0.55, ring: true, reverb: 0.3 },
    wind: { sample: 'cymbalSwell', volume: 0.2, release: 0.3, reverb: 0.5, muffle: 1600 },
  },

  sections: {
    // The ostinato alone, a crackle; the tuba teases the motif's first bar.
    intro: tight('intro', {
      basses: chordLine('Bm Bm Bm Bm', RIFF, 2),
      pound: [...rest(2), ...chordLine('Bm Bm', RIFF, 2)],
      lowTrem: sustained('Bm Bm Bm Bm', BAR, 0, 2),
      crackle: crackle(4),
      tuba: [...rest(2), ...transpose(MOTIF.slice(0, 2 * BAR), -12)],
      timpani: [...rest(2), ...timp('Bm Bm', T_HEART)],
      taiko: [...rest(3), ...beat(TAIKO, 1)],
      swell: swellInto(4),
    }, 4),

    // THE MOTIF on low strings and horns, then the trumpets take it.
    A: tight('A', {
      cellos: MOTIF16,
      horns: playable(transpose(MOTIF16, -12), 'horns'),
      trombones: [...rest(8), ...playable(transpose(MOTIF, -12), 'trombone')],
      tuba: [...rest(8), ...transpose(MOTIF, -24)],
      trumpets: [...rest(8), ...MOTIF],
      violas: [...rest(8), ...MOTIF],
      race: [...rest(8), ...arpeggio(MOTIF_CHORDS, BAR, 4, RACE)],
      basses: chordLine(MOTIF_CHORDS_16, RIFF, 2),
      pound: chordLine(MOTIF_CHORDS_16, HEAVE, 2),
      timpani: timp(MOTIF_CHORDS_16, T_DRIVE),
      taiko: beat(TAIKO, 16),
      taikoHigh: [...rest(8), ...beat(TAIKO_HI, 8)],
      snare: [...rest(8), ...beat(SNARE, 7), ...hits(SNARE_FILL)],
      kick: beat(KICK, 16),
      crackle: crackle(16),
      crash: [...once(hits(CRASH), 8), ...once(hits(CRASH), 8)],
    }, 16),

    // THE AREA'S HOOK re-barred, on violins and flute; brass stabs under it.
    B: tight('B', {
      violins: HOOK,
      flute: up(HOOK, 12),
      violas: transpose(HOOK, -12),
      horns: chordLine(HOOK_CHORDS, [0, '.', '.', '.', '.', '.', 0, '.', '.', '.', '.', '.', '.', '.', '.', '.'], 2),
      trombones: chordLine(HOOK_CHORDS, [7, '.', '.', '.', '.', '.', 7, '.', '.', '.', '.', '.', '.', '.', '.', '.'], 2),
      race: arpeggio(HOOK_CHORDS, BAR, 4, RACE),
      basses: chordLine(HOOK_CHORDS, RIFF, 2),
      pound: chordLine(HOOK_CHORDS, HEAVE, 2),
      timpani: timp(HOOK_CHORDS, T_DRIVE),
      taiko: beat(TAIKO, 8),
      snare: [...beat(SNARE, 7), ...hits(SNARE_FILL)],
      kick: beat(KICK, 8),
      crackle: crackle(8),
      crash: once(hits(CRASH), 8),
    }, 8),

    // The build: the motif's first bar a step higher each bar; stops dead.
    C: tight('C', {
      horns: stopAt(playable(transpose(BUILD, -12), 'horns')),
      trombones: stopAt(playable(transpose(BUILD, -12), 'trombone')),
      tuba: stopAt(transpose(BUILD, -24)),
      trumpets: stopAt([...rest(4), ...BUILD.slice(4 * BAR)]),
      cellos: stopAt(BUILD),
      violinsTrem: stopAt(sustained(C_CHORDS, BAR, 0, 5)),
      lowTrem: stopAt(sustained(C_CHORDS, BAR, 0, 2)),
      basses: stopAt(chordLine(C_CHORDS, ROOTS, 2)),
      timpani: stopAt(timp(C_CHORDS, T_DRIVE)),
      taiko: stopAt(beat(TAIKO, 8)),
      roll: stopAt([...rest(4), ...beat(SNARE_BUILD, 2), ...beat(SNARE_ROLL, 2)]),
      crackle: stopAt(crackle(8)),
      swell: swellInto(8, BAR - 12),
    }, 8),

    // THE DROP: gong, braam, the motif on every seat and the choir; the
    // hook's opening as a counter-line up high.
    D: tight('D', {
      gong: once(hits('x'), 16),
      impact: [...once(hits('x'), 8), ...once(hits('x'), 8)],
      braam: [...held('B2', 2 * BAR), ...rest(14)],
      braamLow: [...held('B1', 2 * BAR), ...rest(14)],
      trumpets: up(MOTIF16, 12),
      horns: playable(transpose(MOTIF16, -12), 'horns'),
      trombones: playable(transpose(MOTIF16, -12), 'trombone'),
      tuba: transpose(MOTIF16, -24),
      cellos: MOTIF16,
      violas: MOTIF16,
      violinsHigh: up(MOTIF16, 12),
      violins: [...COUNTER, ...COUNTER],
      choir: sustained(MOTIF_CHORDS_16, BAR, 2, 3),
      race: arpeggio(MOTIF_CHORDS_16, BAR, 4, RACE),
      basses: chordLine(MOTIF_CHORDS_16, RIFF, 2),
      pound: chordLine(MOTIF_CHORDS_16, HEAVE, 2),
      timpani: timp(MOTIF_CHORDS_16, T_DRIVE),
      taiko: beat(TAIKO, 16),
      taikoHigh: beat(TAIKO_HI, 16),
      snare: [...beat(SNARE, 7), ...hits(SNARE_FILL), ...beat(SNARE, 7), ...hits(SNARE_FILL)],
      kick: beat(KICK, 16),
      crackle: crackle(16),
      crash: [...once(hits(CRASH), 4), ...once(hits(CRASH), 4), ...once(hits(CRASH), 4), ...once(hits(CRASH), 4)],
    }, 16),

    // THE TURN: no drums; the motif at half speed in D major on the piano,
    // the ember cell on the glock, a choir.
    E: tight('E', {
      grand: TIRED,
      glock: EMBER,
      choir: sustained(E_CHORDS, BAR, 0, 3),
      hornsSoft: [...rest(4), ...sustained(E_CHORDS.split(' ').slice(4).join(' '), BAR, 0, 2)],
      lowTrem: sustained(E_CHORDS, BAR, 0, 2),
      timpani: [...rest(6), ...timp('A A', T_HEART)],
      wind: [...swellInto(4), ...rest(2), ...swellInto(2)],
      crackle: [...rest(4), ...crackle(4)],
    }, 8),

    // It gets up: the motif in C minor, a semitone higher.
    F: tight('F', {
      horns: playable(transpose(MOTIF_C, -12), 'horns'),
      trombones: playable(transpose(MOTIF_C, -12), 'trombone'),
      tuba: transpose(MOTIF_C, -24),
      cellos: MOTIF_C,
      trumpets: [...rest(4), ...up(MOTIF_C, 12).slice(4 * BAR)],
      violinsTrem: sustained(F_CHORDS, BAR, 0, 5),
      basses: chordLine(F_CHORDS, RIFF, 2),
      pound: chordLine(F_CHORDS, HEAVE, 2),
      timpani: timp(F_CHORDS, T_DRIVE),
      taiko: beat(TAIKO, 8),
      kick: beat(KICK, 8),
      snare: [...beat(SNARE, 4), ...beat(SNARE_BUILD, 3), ...hits(SNARE_ROLL)],
      crackle: crackle(8),
      crash: once(hits(CRASH), 8),
      swell: swellInto(8),
    }, 8),

    // The climb: the hook in C minor on the trumpets and violins, the motif
    // in the bass.
    G: tight('G', {
      gong: once(hits('x'), 8),
      impact: once(hits('x'), 8),
      trumpets: HOOK_C,
      violins: HOOK_C,
      violinsHigh: up(HOOK_C, 12).map((n) => (typeof n === 'number' && n > 88 ? n - 12 : n)),
      flute: up(HOOK_C, 12),
      horns: playable(transpose(HOOK_C, -12), 'horns'),
      trombones: playable(transpose(MOTIF_C, -12), 'trombone'),
      tuba: transpose(MOTIF_C, -24),
      cellos: transpose(MOTIF_C, -12),
      choir: sustained(G_CHORDS, BAR, 2, 3),
      race: arpeggio(G_CHORDS, BAR, 4, RACE),
      basses: chordLine(G_CHORDS, RIFF, 2),
      pound: chordLine(G_CHORDS, HEAVE, 2),
      timpani: timp(G_CHORDS, T_DRIVE),
      taiko: beat(TAIKO, 8),
      taikoHigh: beat(TAIKO_HI, 8),
      snare: [...beat(SNARE, 7), ...hits(SNARE_FILL)],
      kick: beat(KICK, 8),
      crackle: crackle(8),
      crash: [...once(hits(CRASH), 4), ...once(hits(CRASH), 4)],
    }, 8),

    // Home: down to F#, round to A.
    H: tight('H', {
      cellos: HOME,
      horns: playable(transpose(HOME, -12), 'horns'),
      trombones: playable(transpose(HOME, -12), 'trombone'),
      tuba: transpose(HOME, -24),
      lowTrem: sustained(H_CHORDS, BAR, 0, 2),
      basses: chordLine(H_CHORDS, RIFF, 2),
      timpani: timp(H_CHORDS, T_DRIVE),
      taiko: beat(TAIKO, 4),
      snare: [...beat(SNARE, 3), ...hits(SNARE_ROLL)],
      crackle: crackle(4),
      swell: swellInto(4),
    }, 4),
  },

  order: ['intro', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  loopFrom: 1,
};
