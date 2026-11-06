import { melody, hits, repeat, transpose, arpeggio, chordLine, sustained, tight, COAST_CELL } from './parts/chapter5.js';
import { ORCHESTRA, timp } from './parts/usurper.js';

// "The Dowager Will See You Now" (id crabBattle): midboss theme for the
// Dowager Crab on the Wrack Shore, chapter 5. She is a huge, very polite,
// prim old hermit crab whose shell is a bathtub with a ship's bell on it. She
// is furious about trespass and wants you to wipe your feet.
//
// PURPOSE: a battle theme with comic dignity and real menace. A grand, stuffy
// old minuet in 3/4 that keeps being interrupted by the danger underneath.
// Minor key, never cheery. The prim parts are plucked (harp, pizzicato
// strings, oboe, a toll of the ship's bell); the angry parts are the full
// orchestra (violins, horns, trumpets, trombones, tuba, timpani, bass drum).
// THE SHIP'S BELL (chimes) is her signature: a toll on D then A, usually
// every four bars; in the pivot it tolls alone; in section G it clangs on
// beat 3 of every bar.
//
// THE COAST CELL (A D D E, parts/chapter5.js COAST_CELL) is the sea's tune
// and her shell's rumble. In 3/4 its four notes fill one whole bar, so it
// sounds like a fist on a table. Played hard on brass in C (climbing a chord
// at a time), climbing again in F (the build), turned UPSIDE DOWN in the
// pivot (A E E D, a clarinet sinking), and shouted once as the minuet breaks
// off in H.
//
// THE MINUET (8 bars): D A D F, then up to A and down the scale, ending on
// the dominant: a hand-me-down tune with a bounce. It is the one idea the
// song keeps coming back to (A, B, E slow, G, H), the way she keeps coming
// back to her manners. The second tune (D, "wipe your feet") is three
// nagging repeated notes and a drop.
//
// KEY: D minor, with G minor for the second tune and the Eb and Bb that make
// it sour. BPM 144 (a quarter); 3/4; 12 steps a bar (stepsPerBeat 4), so one
// bar is 1.25 s.
//
// SECTION MAP (intro once, then loops from A; the loop is 108 bars = 2m15s):
//   intro  2 bars  (2.5 s)   the ship's bell, a cello drone, a timpani thud
//   A     16 bars  (20 s)    the prim minuet: harp and plucked strings, oboe
//                            joins the second time, quiet timpani under
//   B     16 bars  (20 s)    the grand minuet: violins and oboe, horns,
//                            harp, timpani; trumpets and snare second time
//   C      8 bars  (10 s)    INTERRUPTED: the coast cell as brass fists
//                            climbing; the harp tries to carry on; roll
//   D     16 bars  (20 s)    "wipe your feet": nagging second tune, G minor,
//                            oboe over pizzicato oom-pah-pah; rim clicks
//   E     16 bars  (20 s)    PIVOT (starts 52 percent in): the minuet at half
//                            speed on solo violin, choir, tremolo violas,
//                            the bell tolling alone, clarinet sinking on the
//                            upside-down cell; roll swells into F
//   F      8 bars  (10 s)    the build: the cell climbing, racing violins,
//                            timpani and snare rolls; last beat of bar 8 silent
//   G     16 bars  (20 s)    the full fury: the minuet at fortissimo on
//                            trumpets, violins, flute; trombone oom-pah-pah,
//                            timpani, bass drum, bell on every bar
//   H     12 bars  (15 s)    home: the harp starts the prim minuet, the cell
//                            breaks it off, then a bell and a rising harp
//                            on the dominant (A) back into A
// Choir stays below MIDI 83.

const BAR = 12;
const SONG = 'crabBattle';
const tl = (text, steps = 2) => melody(text, steps);   // 6 tokens a bar at 2 steps
const rest = (bars) => Array(bars * BAR).fill('.');
const cut = (track, from) => track.map((s, i) => (i >= from ? '.' : s));
const twice = (chords) => chords.split(/\s+/).filter(Boolean).flatMap((c) => [c, c]).join(' ');
const t = (name, section, bars) => tight(SONG, name, section, bars, BAR);

// --- The tunes ---
const MINUET = `
  D5 - A4   D5 - F5
  A5 - -    G5 F5 E5
  F5 - D5   Bb4 - D5
  C#5 - -   E5 - .
  D5 - A4   D5 - F5
  A5 - C6   Bb5 - G5
  F5 E5 D5  C#5 - E5
  D5 - -    - - .
`;
const MINUET_CHORDS = 'Dm Dm Gm A Dm Bb A Dm';
const MIN = tl(MINUET);
const MIN_SLOW = tl(MINUET, 4);

// "Wipe your feet": three nagging notes and a drop.
const WIPE = tl(`
  G5 . G5 . G5 Bb5     A5 - - G5 - .
  F#5 . F#5 . F#5 A5   G5 - - D5 - .
  Eb5 . Eb5 . Eb5 G5   F5 - - D5 - Bb4
  C#5 E5 A5 G5 E5 C#5  A5 - - - - .
  G5 . G5 . G5 Bb5     D6 - - C6 - Bb5
  Bb5 . Bb5 . Bb5 G5   A5 - F#5 - D5 -
  Eb6 - D6 C6 - Bb5    Bb5 - A5 G5 - D5
  E5 - G5 Bb5 - A5     A5 - - - - .
`);
const WIPE_CHORDS = 'Gm Gm D Gm Cm Gm A A Gm Gm Eb D Cm Gm A A';

// The coast cell fills one 3/4 bar (4 notes, 3 steps each).
const CELL = tl(COAST_CELL, 3);
// Turned upside down: down a fourth, a step down.
const CELL_UPSIDE = tl('A4 E4 E4 D4', 3);

// --- Patterns, one bar of 12 steps ---
const BASS1 = [0, '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'];
const BASS13 = [0, '.', '.', '.', '.', '.', '.', '.', 7, '.', '.', '.'];
const LONG = [0, ...Array(11).fill('-')];
const PAH = ['.', '.', '.', '.', 'tenth', '.', '.', '.', 19, '.', '.', '.'];
const POUND = [0, '.', 0, '.', 0, '.', 0, '.', 0, '.', 0, '.'];
const RUN = [0, 'third', 7, 12, 7, 'third', 0, 'third', 7, 12, 7, 'third'];
const HARP_SPREAD = [0, '.', 'third', '.', 7, '.', 12, '.', 7, '.', 'third', '.'];
const T_1 = [0, ...Array(11).fill('.')];
const T_13 = [0, '.', '.', '.', '.', '.', '.', '.', 0, '.', '.', '.'];
const T_FIST = [0, '.', '.', '.', 0, '.', '.', '.', 0, '.', '.', '.'];
const T_EIGHTH = [0, '.', 0, '.', 0, '.', 0, '.', 0, 0, 0, 0];
const ONE = hits('x...........');
const BEAT_23 = hits('....x...x...');
const FIST = hits('x...x...x...');
const ROLL = hits('xxxxxxxxxxxx');
// The ship's bell: D then A, every four bars.
const BELL_BAR = [74, '-', '-', '-', '-', '-', 69, '-', '-', '-', '-', '-'];
const BELL4 = [...BELL_BAR, ...rest(3)];
const BELL_ON_3 = ['.', '.', '.', '.', '.', '.', '.', '.', 74, '-', '-', '-'];

// Which transposition the cell gets on bar b (0-based) of the climb.
const climb = (steps) => (b) => steps[b / 2];

export const CRAB_BATTLE_THEME = {
  title: 'The Dowager Will See You Now',
  bpm: 144,
  stepsPerBeat: 4,
  volume: 1.1,

  instruments: {
    harp: { sample: 'harp', volume: 0.55, release: 0.5, reverb: 0.3, pan: -0.1 },
    harpSoft: { sample: 'harp', volume: 0.28, release: 0.6, reverb: 0.4, pan: 0.2 },
    pizz: { sample: 'violinsPizz', volume: 0.32, release: 0.2, reverb: 0.25, pan: 0.2 },
    bassPizz: { sample: 'cellosPizz', volume: 0.5, release: 0.2, reverb: 0.2, pan: -0.2 },
    glock: { sample: 'glock', volume: 0.12, release: 0.4, reverb: 0.4, pan: 0.3 },
    bell: { sample: 'chimes', volume: 0.24, ring: true, reverb: 0.6, pan: 0.3 },
    bellHard: { sample: 'chimes', volume: 0.3, ring: true, reverb: 0.5, pan: 0.3 },
    oboe: { sample: 'oboe', volume: 0.3, attack: 0.03, release: 0.25, reverb: 0.4, pan: 0.1, humanize: { time: 0.006, volume: 0.1 } },
    clarinet: { sample: 'clarinet', volume: 0.3, attack: 0.04, release: 0.3, reverb: 0.4, pan: -0.15 },
    flute: { sample: 'flute', volume: 0.2, attack: 0.03, release: 0.25, reverb: 0.4, pan: 0.2 },
    violins: { ...ORCHESTRA.violins, volume: 0.34 },
    violinsLoud: { ...ORCHESTRA.violins, volume: 0.4 },
    solo: { ...ORCHESTRA.soloViolin, volume: 0.45 },
    race: { ...ORCHESTRA.race, volume: 0.22 },
    violasTrem: { sample: 'violasTrem', volume: 0.2, attack: 0.5, release: 0.8, reverb: 0.4 },
    cellos: { ...ORCHESTRA.cellos, volume: 0.32 },
    tremolo: { sample: 'cellosTrem', volume: 0.2, attack: 0.5, release: 0.8, reverb: 0.4, pan: -0.2 },
    pound: { ...ORCHESTRA.pound, volume: 0.3 },
    basses: { ...ORCHESTRA.basses, volume: 0.36 },
    choir: { sample: 'choir', volume: 0.12, attack: 0.8, release: 1.0, reverb: 0.6 },
    horns: { ...ORCHESTRA.hornsSoft, volume: 0.3 },
    hornsHard: { ...ORCHESTRA.horns, volume: 0.42 },
    trumpets: { ...ORCHESTRA.trumpets, volume: 0.36 },
    trombones: { ...ORCHESTRA.trombones, volume: 0.4 },
    tuba: { ...ORCHESTRA.tuba, volume: 0.4 },
    timpani: { ...ORCHESTRA.timpani, volume: 0.5 },
    timpRoll: { ...ORCHESTRA.timpRoll, volume: 0.4, attack: 0.5 },
    bassDrum: { ...ORCHESTRA.bassDrum, volume: 0.5 },
    snare: { ...ORCHESTRA.snare, volume: 0.28 },
    roll: { ...ORCHESTRA.roll, volume: 0.2 },
    rim: { ...ORCHESTRA.rim, volume: 0.22 },
    crash: { ...ORCHESTRA.crash, volume: 0.32 },
    gong: { ...ORCHESTRA.gong, volume: 0.35 },
  },

  sections: (() => {
    const CH16 = `${MINUET_CHORDS} ${MINUET_CHORDS}`;
    const CH_E = twice(MINUET_CHORDS);
    const C_CHORDS = 'Dm Dm Gm Gm Bb Bb A A';
    const F_CHORDS = 'Dm Dm F F Gm Gm A A';
    const tune2 = [...MIN, ...MIN];
    // the cell on given bars (0-based) of a section, else rests
    const cellAt = (bars, at, semis) => Array.from({ length: bars }, (_, b) => (at.includes(b) ? transpose(CELL, semis(b)) : rest(1))).flat();
    const fists = cellAt(8, [0, 2, 4, 6], climb([0, 5, 8, 7]));
    const fistsHigh = cellAt(8, [4, 6], climb([0, 5, 8, 7]));
    // only on even bars: the pounding strings stop for the harp
    const evenBars = (track) => track.map((s, i) => (Math.floor(i / BAR) % 2 === 0 ? s : '.'));
    const tC = [...timp('D D', T_FIST), ...timp('G G', T_FIST), ...timp('Bb Bb', T_FIST), ...timp('A A', T_FIST)];

    return {
      // The bell, a cello drone, a timpani thud.
      intro: t('intro', {
        bell: [...BELL_BAR, ...rest(1)],
        tremolo: sustained('Dm Dm', BAR, 0, 2),
        timpani: [...rest(1), ...timp('D', T_13)],
        harpSoft: [...rest(1), ...tl('D5 - A4 D5 - .')],
      }, 2),

      // The prim minuet: harp, plucked strings, oboe the second time.
      A: t('A', {
        harp: tune2,
        oboe: [...rest(8), ...MIN],
        pizz: chordLine(CH16, PAH, 3),
        bassPizz: chordLine(CH16, BASS1, 2),
        glock: [...rest(8), ...transpose(MIN, 12)],
        tremolo: sustained(CH16, BAR, 0, 2),
        bell: repeat(BELL4, 4),
        timpani: [...rest(14), ...timp('A Dm', T_1)],
      }, 16),

      // The grand minuet: the whole stuffy orchestra.
      B: t('B', {
        violins: tune2,
        oboe: tune2,
        horns: sustained(CH16, BAR, 1, 3),
        cellos: chordLine(CH16, LONG, 2),
        basses: chordLine(CH16, BASS13, 2),
        harpSoft: arpeggio(CH16, BAR, 4, HARP_SPREAD),
        timpani: timp(CH16, T_13),
        trumpets: [...rest(8), ...MIN],
        snare: [...rest(8), ...repeat(BEAT_23, 8)],
        bassDrum: [...rest(8), ...repeat(ONE, 8)],
        crash: [...ONE, ...rest(7), ...ONE, ...rest(7)],
        bell: repeat(BELL4, 4),
      }, 16),

      // INTERRUPTED: the coast cell as fists, climbing; the harp tries to carry on.
      C: t('C', {
        trombones: transpose(fists, -12),
        hornsHard: fists,
        trumpets: fistsHigh,
        tuba: chordLine(C_CHORDS, LONG, 2),
        pound: evenBars(chordLine(C_CHORDS, POUND, 2)),
        harp: [...rest(1), ...tl('D5 - A4 D5 - .'), ...rest(1), ...tl('D5 - A4 D5 - .'), ...rest(4)],
        timpani: tC.map((s, i) => (Math.floor(i / BAR) % 2 === 1 && i % BAR >= 4 ? '.' : s)),
        bassDrum: repeat(ONE, 8),
        crash: [...ONE, ...rest(3), ...ONE, ...rest(3)],
        roll: [...rest(7), ...cut(ROLL, 8)],
        bell: [...rest(2), ...BELL_BAR, ...rest(5)],
      }, 8),

      // "Wipe your feet": the nagging second tune, G minor.
      D: t('D', {
        oboe: WIPE,
        clarinet: transpose(WIPE, -12),
        pizz: chordLine(WIPE_CHORDS, PAH, 3),
        bassPizz: chordLine(WIPE_CHORDS, BASS13, 2),
        rim: repeat(BEAT_23, 16),
        violins: [...rest(8), ...WIPE.slice(8 * BAR)],
        tremolo: sustained(WIPE_CHORDS, BAR, 0, 2),
        timpani: [...rest(12), ...timp('Bb A A A', T_1)],
        bell: repeat(BELL4, 4),
      }, 16),

      // PIVOT: the minuet at half speed, the bell alone, the cell upside down.
      E: t('E', {
        solo: MIN_SLOW,
        choir: sustained(CH_E, BAR, 1, 4),
        violasTrem: sustained(CH_E, BAR, 0, 3),
        cellos: sustained(CH_E, BAR, 0, 2),
        harpSoft: arpeggio(CH_E, BAR, 4, [0, '.', '.', '.', 'third', '.', '.', '.', 7, '.', '.', '.']),
        clarinet: Array.from({ length: 16 }, (_, b) => (b % 4 === 3 ? CELL_UPSIDE : rest(1))).flat(),
        bell: repeat([...BELL_BAR, ...rest(1)], 8),
        gong: [...ONE, ...rest(15)],
        timpRoll: [...rest(14), 45, ...Array(2 * BAR - 1).fill('-')],
      }, 16),

      // The build: the cell climbing, racing violins, rolls; the last beat is silent.
      F: t('F', Object.fromEntries(Object.entries({
        trombones: transpose(cellAt(8, [0, 2, 4, 6], climb([0, 3, 5, 7])), -12),
        hornsHard: cellAt(8, [0, 2, 4, 6], climb([0, 3, 5, 7])),
        trumpets: cellAt(8, [4, 6], climb([0, 3, 5, 7])),
        race: arpeggio(F_CHORDS, BAR, 4, RUN),
        tuba: chordLine(F_CHORDS, LONG, 2),
        timpani: timp('D D F F G G A A', T_EIGHTH),
        snare: [...rest(4), ...repeat(BEAT_23, 2), ...ROLL, ...ROLL],
        bassDrum: repeat(ONE, 8),
        bell: [...rest(3), ...BELL_BAR, ...rest(4)],
      }).map(([k, v]) => [k, cut(v, 7 * BAR + 8)])), 8),

      // The full fury: the minuet fortissimo, oom-pah-pah brass, the bell clangs.
      G: t('G', {
        trumpets: tune2,
        violinsLoud: tune2,
        flute: transpose(tune2, 12),
        hornsHard: sustained(CH16, BAR, 1, 3),
        trombones: chordLine(CH16, PAH, 2),
        tuba: chordLine(CH16, BASS13, 2),
        pound: chordLine(CH16, POUND, 2),
        timpani: timp(CH16, T_FIST),
        bassDrum: repeat(ONE, 16),
        snare: repeat(BEAT_23, 16),
        crash: [...ONE, ...rest(7), ...ONE, ...rest(7)],
        bellHard: repeat(BELL_ON_3, 16),
      }, 16),

      // Home: the prim minuet is broken off by the cell; bell; rising harp on the dominant.
      H: t('H', {
        harp: [...MIN.slice(0, 6 * BAR), ...rest(5), ...tl('A4 C#5 E5 A5 C#6 E6')],
        pizz: [...chordLine('Dm Dm Gm A Dm Bb', PAH, 3), ...rest(2), ...chordLine('A A A', PAH, 3), ...rest(1)],
        bassPizz: [...chordLine('Dm Dm Gm A Dm Bb', BASS1, 2), ...rest(2), ...chordLine('A A A A', BASS1, 2)],
        trombones: [...rest(6), ...transpose(CELL, -12), ...rest(5)],
        hornsHard: [...rest(6), ...CELL, ...rest(5)],
        tuba: [...rest(6), ...chordLine('A', LONG, 2), ...rest(5)],
        timpani: [...rest(6), ...timp('A', T_FIST), ...timp('A', T_1), ...rest(4)],
        bassDrum: [...rest(6), ...FIST, ...ONE, ...rest(4)],
        crash: [...rest(7), ...ONE, ...rest(4)],
        tremolo: [...rest(8), ...sustained('A A A A', BAR, 0, 2)],
        bell: [...rest(8), ...BELL_BAR, ...rest(1), ...BELL_BAR, ...rest(1)],
      }, 12),
    };
  })(),

  order: ['intro', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  loopFrom: 1,
};
