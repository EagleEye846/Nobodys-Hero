import { melody, hits, repeat, arpeggio, chordLine, sustained, transpose } from '../../audio/notation.js';
import { ORCHESTRA, timp, held } from './parts/usurper.js';

// "Salt in the Wound": the boss theme for Corrie, the Tidecaller (decided
// 2026-11-06). It began as a rough version of the coast battle theme, one of
// two to compare by ear (the other is "Salt in the Wound (Storm)",
// coastBattleStormTheme.js, which plays the same tune), and was picked as the
// boss song over the version first written for him (backed up in
// notes/music-backup-2026-11-06/corrieBattleTheme.js). This one is a dark sea shanty: a crew stamping on a deck
// in a storm, nothing jolly about it. A fiddle takes the tune over a low
// drone, boots and a bass drum stamp the 6/8, a ship's bell tolls every four
// bars, and in the second half the crew (the choir, low) and a trombone sing
// the tune while the fiddle whirls over them. D minor, with the flat sixth
// and seventh (Bb, C) and A major to pull home. No claps, no bouncy
// afterbeats, nothing in a major key for long.
//
// THE COAST TUNE (draft, shared with the storm version): up a fourth to the
// tonic, then a step up (A D D E), the first bar of the fiddle's tune. Not
// written into any other song yet.
//
// 6/8 at 112 dotted quarters a minute; 12 steps to a bar, one step a 16th
// (a bar is about 1.07 seconds). The intro plays once (2 bars); then it
// loops from A, 80 bars, about 1m26s:
//
//   intro    2 bars  the drone, the stamp and the bell
//   A       16 bars  the fiddle's tune over the drone; boots join at bar 5
//   B       16 bars  the crew and a trombone sing the tune an octave down;
//                    the fiddle whirls above; anvil on the deck; timpani
//   C        8 bars  the storm break: the tune's first notes slow on low
//                    brass over a timpani roll and tremolo cellos; the
//                    stamp builds back
//   D       16 bars  the second verse, in G minor: a new tune on oboe and
//                    clarinet, with the flat second (Eb) darkening it; the
//                    fiddle whirls, the crew holds the chords
//   E        8 bars  the breakdown: only the boots and the crew humming the
//                    tune, low; a roll pulls everyone back
//   F       16 bars  all hands: fiddle, crew and trombones on the tune
//                    together, everything stamping, and home to A

const BAR = 12;
const tune = (text) => melody(text, 2);   // each token an eighth: 6 to a bar
const rest = (bars) => Array(bars * BAR).fill('.');
const tight = (name, section, bars) => {
  for (const [track, steps] of Object.entries(section)) {
    if (steps.length !== bars * BAR) throw new Error(`Salt in the Wound (Shanty) ${name}: '${track}' is ${steps.length} steps, not ${bars} bars`);
  }
  return section;
};

// --- Harmony, a bar each ---
const TUNE_CHORDS = 'Dm C Dm Am Bb C A Dm Dm C Bb A Dm Bb A Dm';
const C_CHORDS = 'Dm Dm Bb Bb Gm Gm A A';
const D_CHORDS = 'Gm Gm Dm Dm Bb Eb A A Gm Gm Dm Bb Eb C A A';
const E_CHORDS = 'Dm C Dm Am Bb C A Dm';
const INTRO_CHORDS = 'Dm Dm';

// --- The coast tune: long-short, long-short, like a heavy step on a
// rolling deck. The first half answers itself; the second climbs and falls
// home through C# over A. ---
const TUNE = tune(`
  A4 - D5   D5 - E5       F5 - E5   C5 - -
  A4 - D5   D5 - E5       F5 - G5   E5 - -
  F5 - D5   Bb4 - D5      C5 - A4   G4 - A4
  Bb4 - A4  G4 F4 E4      D4 - -    D4/E4 F4/G4 A4
  D5 - F5   A5 - G5       E5 - C5   G4 - C5
  D5 - F5   Bb5 - A5      A5 - -    G5 F5 E5
  F5 - E5   D5 - A4       Bb4 - D5  F5 - D5
  E5 - C#5  A4 Bb4 C#5    D5 - -    - - .
`);
// The second verse, in G minor: it starts like the coast tune (up a fourth,
// then a step), climbs higher, and the Eb pulls it down to A.
const VERSE = tune(`
  D5 - G5   G5 - A5       Bb5 - A5  G5 - D5
  F5 - E5   D5 - A4       D5 - -    - - .
  D5 - F5   F5 - Bb5      G5 - F5   Eb5 - Bb4
  C#5 - E5  A5 - G5       E5 - -    C#5 - .
  D5 - G5   G5 - A5       Bb5 - C6  D6 - Bb5
  A5 - F5   D5 - F5       F5 - D5   Bb4 - D5
  Eb5 - G5  Bb5 - G5      E5 - G5   C6 - Bb5
  A5 - G5   F5 E5 C#5     A4 - -    - - .
`);
// The storm break: the tune's first notes, slow, on low brass.
const SLOW = tune(`
  A3 - - - - -   D4 - - - - -   D4 - - E4 - -   F4 - - - - -
  G4 - - - - -   F4 - - E4 - -  E4 - - - - -    C#4 - - - - .
`);

// --- Patterns, a bar each ---
// The low strings: a heavy root, the root again, the fifth, the root.
const STAMP_BASS = [0, '-', '-', '-', 0, '.', 7, '-', '-', '-', 0, '.'];
// The fiddle's whirl over the crew in B.
const WHIRL = [0, '-', 7, '.', 12, '.', 'tenth', '-', 12, '.', 7, '.'];
// Timpani: the stamp, with the fifth below leaning in.
const T_STAMP = [0, '.', '.', '.', '.', '.', 0, '.', '.', -5, '.', '.'];
const T_ROLL6 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

// --- Drums, a bar each ---
const STAMP = hits('x.....x.....');
const BOOTS = hits('x...x.x...x.');
const FRAME = hits('..x.x...x.xx');
const ANVIL = hits('......x.....');
const BUILD = hits('x.x.x.x.x.xx');
// The ship's bell: D, then A below, every four bars.
const BELL = [74, '-', '-', '-', '-', '-', 69, '-', '-', '-', '-', '-', ...rest(3)];

export const CORRIE_BATTLE_THEME = {
  title: 'Salt in the Wound',
  bpm: 112,
  stepsPerBeat: 6,
  volume: 0.9,

  instruments: {
    fiddle: { ...ORCHESTRA.soloViolin, volume: 0.5, humanize: { time: 0.006, volume: 0.1 } },
    whirl: { ...ORCHESTRA.soloViolin, volume: 0.3, pan: 0.35, humanize: { time: 0.006, volume: 0.15 } },
    crew: { sample: 'choir', volume: 0.3, attack: 0.06, release: 0.3, reverb: 0.5, pan: -0.1 },
    crewHeld: { sample: 'choir', volume: 0.18, attack: 0.8, release: 1.0, reverb: 0.6 },
    oboe: { sample: 'oboe', volume: 0.32, attack: 0.03, release: 0.25, reverb: 0.45, pan: 0.1, humanize: { time: 0.006, volume: 0.1 } },
    clarinet: { sample: 'clarinet', volume: 0.24, attack: 0.03, release: 0.25, reverb: 0.45, pan: -0.15, humanize: { time: 0.006, volume: 0.1 } },
    trombone: { ...ORCHESTRA.trombones, volume: 0.34 },
    tuba: { ...ORCHESTRA.tuba, volume: 0.36 },
    drone: { sample: 'cellos', volume: 0.22, attack: 0.3, release: 0.6, reverb: 0.4, pan: -0.2 },
    tremolo: { sample: 'cellosTrem', volume: 0.24, attack: 0.6, release: 0.8, reverb: 0.4, pan: -0.2 },
    stampBass: { ...ORCHESTRA.pound, volume: 0.36 },
    basses: { ...ORCHESTRA.basses, volume: 0.36 },
    bell: { sample: 'chimes', volume: 0.22, ring: true, reverb: 0.6, pan: 0.3 },
    timpani: { ...ORCHESTRA.timpani, volume: 0.5 },
    stamp: { ...ORCHESTRA.bassDrum, volume: 0.55 },
    boots: { ...ORCHESTRA.taiko, volume: 0.4 },
    frame: { sample: 'frameDrum', drum: 'sample', volume: 0.24, ring: true, reverb: 0.25, humanize: { time: 0.004, volume: 0.2 } },
    anvil: { sample: 'anvil', drum: 'sample', volume: 0.16, ring: true, reverb: 0.4, pan: 0.2 },
    roll: { ...ORCHESTRA.roll, volume: 0.22 },
    crash: { ...ORCHESTRA.crash, volume: 0.3 },
  },

  sections: {
    // The drone, the stamp and the bell.
    intro: tight('intro', {
      drone: sustained(INTRO_CHORDS, BAR, 0, 2),
      crewHeld: sustained(INTRO_CHORDS, BAR, 0, 3),
      stamp: repeat(STAMP, 2),
      bell: [...BELL.slice(0, 2 * BAR)],
    }, 2),

    // The fiddle's tune over the drone; the boots join at bar 5.
    A: tight('A', {
      fiddle: TUNE,
      drone: sustained(TUNE_CHORDS, BAR, 0, 2),
      stampBass: chordLine(TUNE_CHORDS, STAMP_BASS, 2),
      basses: sustained(TUNE_CHORDS, BAR, 0, 1),
      bell: repeat(BELL, 4),
      stamp: repeat(STAMP, 16),
      boots: [...rest(4), ...repeat(BOOTS, 12)],
      frame: [...rest(8), ...repeat(FRAME, 8)],
    }, 16),

    // The crew and a trombone sing it an octave down; the fiddle whirls.
    B: tight('B', {
      crew: transpose(TUNE, -12),
      trombone: transpose(TUNE, -24),
      whirl: arpeggio(TUNE_CHORDS, BAR, 5, WHIRL),
      tuba: chordLine(TUNE_CHORDS, [0, '-', '-', '-', '-', '-', 7, '-', '-', '-', '-', '-'], 1),
      stampBass: chordLine(TUNE_CHORDS, STAMP_BASS, 2),
      timpani: timp(TUNE_CHORDS, T_STAMP),
      bell: repeat(BELL, 4),
      stamp: repeat(STAMP, 16),
      boots: repeat(BOOTS, 16),
      frame: repeat(FRAME, 16),
      anvil: repeat(ANVIL, 16),
      crash: [...hits('x'), ...Array(16 * BAR - 1).fill('.')],
    }, 16),

    // The storm break: the slow tune on low brass, a roll, tremolo; the
    // stamp builds back.
    C: tight('C', {
      trombone: SLOW,
      tuba: transpose(SLOW, -12),
      tremolo: sustained(C_CHORDS, BAR, 0, 2),
      crewHeld: sustained(C_CHORDS, BAR, 2, 3),
      basses: sustained(C_CHORDS, BAR, 0, 1),
      timpani: [...timp('Dm Dm Bb Bb Gm Gm', T_ROLL6), ...timp('A A', T_STAMP)],
      stamp: [...rest(6), ...repeat(STAMP, 2)],
      boots: [...rest(6), ...BOOTS, ...BUILD],
      roll: [...rest(7), ...hits('xxxxxxxxxxxx')],
      bell: [...rest(4), ...held(74, BAR), ...rest(3)],
    }, 8),

    // The second verse in G minor: oboe and clarinet, the fiddle whirling,
    // the crew holding the chords.
    D: tight('D', {
      oboe: VERSE,
      clarinet: transpose(VERSE, -12),
      whirl: arpeggio(D_CHORDS, BAR, 5, WHIRL),
      crewHeld: sustained(D_CHORDS, BAR, 0, 3),
      drone: sustained(D_CHORDS, BAR, 0, 2),
      stampBass: chordLine(D_CHORDS, STAMP_BASS, 2),
      tuba: chordLine(D_CHORDS, [0, '-', '-', '-', '-', '-', 7, '-', '-', '-', '-', '-'], 1),
      timpani: [...rest(8), ...timp(D_CHORDS.split(' ').slice(8).join(' '), T_STAMP)],
      bell: repeat(BELL, 4),
      stamp: repeat(STAMP, 16),
      boots: repeat(BOOTS, 16),
      frame: repeat(FRAME, 16),
      anvil: [...rest(8), ...repeat(ANVIL, 8)],
    }, 16),

    // The breakdown: only the boots and the crew humming the tune, low.
    E: tight('E', {
      crew: transpose(TUNE.slice(0, 8 * BAR), -12),
      drone: sustained(E_CHORDS, BAR, 0, 2),
      boots: [...repeat(BOOTS, 7), ...BUILD],
      stamp: [...rest(4), ...repeat(STAMP, 4)],
      roll: [...rest(7), ...hits('xxxxxxxxxxxx')],
    }, 8),

    // All hands: fiddle, crew and trombones on the tune together.
    F: tight('F', {
      fiddle: TUNE,
      crew: transpose(TUNE, -12),
      trombone: transpose(TUNE, -24),
      whirl: [...rest(8), ...arpeggio(TUNE_CHORDS.split(' ').slice(8).join(' '), BAR, 5, WHIRL)],
      tuba: chordLine(TUNE_CHORDS, [0, '-', '-', '-', '-', '-', 7, '-', '-', '-', '-', '-'], 1),
      drone: sustained(TUNE_CHORDS, BAR, 0, 2),
      stampBass: chordLine(TUNE_CHORDS, STAMP_BASS, 2),
      timpani: timp(TUNE_CHORDS, T_STAMP),
      bell: repeat(BELL, 4),
      stamp: repeat(STAMP, 16),
      boots: [...repeat(BOOTS, 15), ...BUILD],
      frame: repeat(FRAME, 16),
      anvil: repeat(ANVIL, 16),
      crash: [...hits('x'), ...Array(8 * BAR - 1).fill('.'), ...hits('x'), ...Array(8 * BAR - 1).fill('.')],
    }, 16),
  },

  order: ['intro', 'A', 'B', 'C', 'D', 'E', 'F'],
  loopFrom: 1,
};
