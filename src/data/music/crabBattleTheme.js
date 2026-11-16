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
// pivot (A E E D, a clarinet sinking), banged under the minuet in G on the
// trombones and tuba every fourth bar (the old lady's manners and her temper
// at once), and shouted once as the minuet breaks off in H.
//
// THE MINUET (8 bars), rewritten 7 November 2026 around one figure, THE
// CURTSY: a long note, a quick little turn of two 16ths, and a step ("DUM,
// ta-ta DUM da": D, A-Bb-A, D). It comes four times in the eight bars,
// stepping down a chord at a time, then the tune leaps up to A and climbs to
// Bb before it bows home to D. It is the one idea the song keeps coming back
// to (A, B, E slow, G, H), the way she keeps coming back to her manners. The
// earlier minuet (D A D F) is in notes/music-backup-2026-11-07-b/. The
// second tune (D, "wipe your feet") is three nagging repeated notes and a
// drop, over plucked strings ticking on one note like a tapping foot.
// No oom-pah-pah anywhere: the plucked strings roll in 8ths instead.
//
// KEY: D minor, with G minor for the second tune and the Eb and Bb that make
// it sour. BPM 144 (a quarter); 3/4; 12 steps a bar (stepsPerBeat 4), so one
// bar is 1.25 s.
//
// SECTION MAP (intro once, then loops from A; the loop is 108 bars = 2m15s):
//   intro  2 bars  (2.5 s)   the ship's bell, a cello drone, a timpani thud
//   A     16 bars  (20 s)    the prim minuet: harp over rolling plucked
//                            strings, oboe and glock join the second time
//   B     16 bars  (20 s)    the grand minuet: violins and oboe, the cellos'
//                            counter-line under it, harp, timpani; trumpets,
//                            horns and a snare on beat 3 the second time
//   C      8 bars  (10 s)    INTERRUPTED: a deep hit, the coast cell as
//                            brass fists climbing, bass drum and toms
//                            hitting with every fist; the harp tries to
//                            carry on; roll
//   D     16 bars  (20 s)    "wipe your feet": nagging second tune, G minor,
//                            oboe over a ticking pizzicato; rim on beat 3
//   E     16 bars  (20 s)    PIVOT (starts 52 percent in): the minuet at half
//                            speed on solo violin, choir, tremolo violas,
//                            the bell tolling alone, clarinet sinking on the
//                            upside-down cell; roll swells into F
//   F      8 bars  (10 s)    the build: the cell climbing, racing violins,
//                            timpani and snare rolls; last beat of bar 8 silent
//   G     16 bars  (20 s)    THE TEMPER: gong and a deep hit; the minuet at
//                            fortissimo on trumpets, violins, flute, then
//                            again a semitone UP in Eb minor (she loses it
//                            completely); the coast cell banged on
//                            trombones, tuba and toms every fourth bar, a
//                            drum on every beat, the snare cracking on 3,
//                            the bell clanging on every bar
//   H     12 bars  (15 s)    home: straight back to D minor, as if she had
//                            cleared her throat: the harp starts the prim
//                            minuet, the cell
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
// The curtsy: a long note, a quick little turn (two 16ths), and a step:
// "DUM, ta-ta DUM da". It comes four times in eight bars, stepping down a
// chord then climbing, so it is in your head by the second time round.
const MINUET = `
  D5 - A4/Bb4   A4 - D5
  F5 - E5/F5    E5 - A4
  Bb4 - A4/Bb4  G4 - D5
  C#5 - -       E5 - A5
  D5 - A4/Bb4   A4 - D5
  F5 - E5/F5    G5 - Bb5
  A5 G5/F5 E5   - C#5 E5
  D5 - -        - - .
`;
// Her counter-line, low in the cellos under the grand minuet: quarter notes
// that move when the tune holds still.
const COUNTER = melody(`
  A3 - F3   D3 E3 F3   G3 - Bb3   A3 - E3
  F3 - A3   D4 - Bb3   C#4 - A3   D4 - -
`, 4);
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
// Plucked broken chords in 8ths (prim, not oom-pah-pah).
const PIZZ_ROLL = [0, '.', 7, '.', 'tenth', '.', 12, '.', 'tenth', '.', 7, '.'];
// A foot tapping on the fifth: impatient repeated 8ths, for "wipe your feet".
const TICK = [7, '.', 7, '.', 7, '.', 7, '.', 7, '.', 7, '.'];
const POUND = [0, '.', 0, '.', 0, '.', 0, '.', 0, '.', 0, '.'];
const RUN = [0, 'third', 7, 12, 7, 'third', 0, 'third', 7, 12, 7, 'third'];
const HARP_SPREAD = [0, '.', 'third', '.', 7, '.', 12, '.', 7, '.', 'third', '.'];
const T_1 = [0, ...Array(11).fill('.')];
const T_13 = [0, '.', '.', '.', '.', '.', '.', '.', 0, '.', '.', '.'];
const T_FIST = [0, '.', '.', '.', 0, '.', '.', '.', 0, '.', '.', '.'];
const T_EIGHTH = [0, '.', 0, '.', 0, '.', 0, '.', 0, 0, 0, 0];
const ONE = hits('x...........');
const BEAT_23 = hits('....x...x...');
const BEAT_3 = hits('........x.x.');
// The temper's kit: a drum on every beat, the snare cracking on 3 with a
// pickup into the next bar, toms digging in on the fist rhythm.
const STOMP = hits('x...x...x...');
const CRACK = hits('........x..x');
const FIST_HITS = hits('x..x..x..x..');
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
  volume: 1.18,

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
    impact: { ...ORCHESTRA.impact, volume: 0.6 },
    tom: { sample: 'tom', drum: 'sample', volume: 0.32, ring: true, reverb: 0.25, humanize: { time: 0.004, volume: 0.15 } },
  },

  sections: (() => {
    const CH16 = `${MINUET_CHORDS} ${MINUET_CHORDS}`;
    const CH_E = twice(MINUET_CHORDS);
    const C_CHORDS = 'Dm Dm Gm Gm Bb Bb A A';
    const F_CHORDS = 'Dm Dm F F Gm Gm A A';
    const tune2 = [...MIN, ...MIN];
    // the cell on given bars (0-based) of a section, else rests
    const cellAt = (bars, at, semis) => Array.from({ length: bars }, (_, b) => (at.includes(b) ? transpose(CELL, semis(b)) : rest(1))).flat();
    const fistsHigh = cellAt(8, [4, 6], climb([0, 5, 8, 7]));
    // The horns and trombones only have recordings so high: once the climb
    // passes a fourth, the horns stop and the trombones drop to a growl an
    // octave lower, and the trumpets carry the top.
    const hornFists = (rise) => cellAt(8, [0, 2, 4, 6].filter((b) => rise[b / 2] <= 5), climb(rise));
    const boneFists = (rise) => Array.from({ length: 8 }, (_, b) => (b % 2 === 0 ? transpose(CELL, rise[b / 2] + (rise[b / 2] > 3 ? -24 : -12)) : rest(1))).flat();
    // only on even bars: the pounding strings stop for the harp
    const evenBars = (track) => track.map((s, i) => (Math.floor(i / BAR) % 2 === 0 ? s : '.'));
    const tC = [...timp('D D', T_FIST), ...timp('G G', T_FIST), ...timp('Bb Bb', T_FIST), ...timp('A A', T_FIST)];

    return {
      // The bell, a cello drone, a timpani thud.
      intro: t('intro', {
        bell: [...BELL_BAR, ...rest(1)],
        tremolo: sustained('Dm Dm', BAR, 0, 2),
        timpani: [...rest(1), ...timp('D', T_13)],
        harpSoft: [...rest(1), ...tl('D5 - A4/Bb4 A4 - D5')],
      }, 2),

      // The prim minuet: harp, plucked strings, oboe the second time.
      A: t('A', {
        harp: tune2,
        oboe: [...rest(8), ...MIN],
        pizz: chordLine(CH16, PIZZ_ROLL, 3),
        bassPizz: chordLine(CH16, BASS13, 2),
        glock: [...rest(8), ...transpose(MIN, 12)],
        tremolo: sustained(CH16, BAR, 0, 2),
        bell: repeat(BELL4, 4),
        timpani: [...rest(14), ...timp('A Dm', T_1)],
      }, 16),

      // The grand minuet: the whole stuffy orchestra.
      B: t('B', {
        violins: tune2,
        oboe: tune2,
        cellos: [...COUNTER, ...COUNTER],
        horns: [...rest(8), ...sustained(MINUET_CHORDS, BAR, 0, 2)],
        basses: chordLine(CH16, BASS13, 2),
        harpSoft: arpeggio(CH16, BAR, 4, HARP_SPREAD),
        timpani: timp(CH16, T_13),
        trumpets: [...rest(8), ...MIN],
        snare: [...rest(8), ...repeat(BEAT_3, 8)],
        bassDrum: [...rest(8), ...repeat(ONE, 8)],
        crash: [...ONE, ...rest(7), ...ONE, ...rest(7)],
        bell: repeat(BELL4, 4),
      }, 16),

      // INTERRUPTED: the coast cell as fists, climbing; the harp tries to carry on.
      C: t('C', {
        trombones: boneFists([0, 5, 8, 7]),
        hornsHard: hornFists([0, 5, 8, 7]),
        trumpets: fistsHigh,
        tuba: chordLine(C_CHORDS, LONG, 2),
        pound: evenBars(chordLine(C_CHORDS, POUND, 2)),
        harp: [...rest(1), ...tl('D5 - A4/Bb4 A4 - D5'), ...rest(1), ...tl('D5 - A4/Bb4 A4 - D5'), ...rest(4)],
        timpani: tC.map((s, i) => (Math.floor(i / BAR) % 2 === 1 && i % BAR >= 4 ? '.' : s)),
        bassDrum: Array.from({ length: 8 }, (_, b) => (b % 2 === 0 ? FIST_HITS : ONE)).flat(),
        tom: Array.from({ length: 8 }, (_, b) => (b % 2 === 0 ? FIST_HITS : rest(1))).flat(),
        impact: [...ONE, ...rest(7)],
        crash: [...ONE, ...rest(3), ...ONE, ...rest(3)],
        roll: [...rest(7), ...cut(ROLL, 8)],
        bell: [...rest(2), ...BELL_BAR, ...rest(5)],
      }, 8),

      // "Wipe your feet": the nagging second tune, G minor.
      D: t('D', {
        oboe: WIPE,
        clarinet: transpose(WIPE, -12),
        pizz: chordLine(WIPE_CHORDS, TICK, 4),
        bassPizz: chordLine(WIPE_CHORDS, BASS13, 2),
        rim: repeat(BEAT_3, 16),
        violins: [...rest(8), ...WIPE.slice(8 * BAR)],
        tremolo: sustained(WIPE_CHORDS, BAR, 0, 2),
        timpani: [...rest(12), ...timp('Bb A A A', T_1)],
        // Only on the G minor bars: on C minor its D would grind on the
        // tune's E flat.
        bell: [...BELL4, ...rest(4), ...BELL4, ...rest(4)],
      }, 16),

      // PIVOT: the minuet at half speed, the bell alone, the cell upside down.
      E: t('E', {
        solo: MIN_SLOW,
        choir: sustained(CH_E, BAR, 1, 4),
        violasTrem: sustained(CH_E, BAR, 0, 3),
        cellos: sustained(CH_E, BAR, 0, 2),
        harpSoft: arpeggio(CH_E, BAR, 4, [0, '.', '.', '.', 'third', '.', '.', '.', 7, '.', '.', '.']),
        clarinet: Array.from({ length: 16 }, (_, b) => (b % 4 === 3 ? CELL_UPSIDE : rest(1))).flat(),
        // Not on the A bars, where its D would rub on the choir's C sharp.
        bell: Array.from({ length: 8 }, (_, i) => (i === 3 || i === 6 ? rest(2) : [...BELL_BAR, ...rest(1)])).flat(),
        gong: [...ONE, ...rest(15)],
        timpRoll: [...rest(14), 45, ...Array(2 * BAR - 1).fill('-')],
      }, 16),

      // The build: the cell climbing, racing violins, rolls; the last beat is silent.
      F: t('F', Object.fromEntries(Object.entries({
        trombones: boneFists([0, 3, 5, 7]),
        hornsHard: hornFists([0, 3, 5, 7]),
        trumpets: cellAt(8, [4, 6], climb([0, 3, 5, 7])),
        race: arpeggio(F_CHORDS, BAR, 4, RUN),
        tuba: chordLine(F_CHORDS, LONG, 2),
        timpani: timp('D D F F G G A A', T_EIGHTH),
        snare: [...rest(4), ...repeat(BEAT_3, 2), ...ROLL, ...ROLL],
        bassDrum: Array.from({ length: 8 }, (_, b) => (b % 2 === 0 ? FIST_HITS : STOMP)).flat(),
        tom: Array.from({ length: 8 }, (_, b) => (b % 2 === 0 ? FIST_HITS : rest(1))).flat(),
        bell: [...rest(3), ...BELL_BAR, ...rest(4)],
      }).map(([k, v]) => [k, cut(v, 7 * BAR + 8)])), 8),

      // The full fury: the minuet fortissimo, then again a semitone UP (Eb
      // minor: she loses her temper completely). The coast cell is banged on
      // trombones and tuba under every fourth bar, a drum on every beat.
      G: (() => {
        const UP = 'Ebm Ebm Abm Bb Ebm B Bb Ebm';
        const ch = `${MINUET_CHORDS} ${UP}`.split(' ');
        const both = (track) => [...track, ...transpose(track, 1)];
        const low = (b, octs, pattern) => {
          const semis = b >= 8 ? 1 : 0;
          return b % 4 === 0 ? transpose(CELL, -12 * octs + semis) : chordLine(ch[b], pattern, 2);
        };
        return t('G', {
          trumpets: both(MIN),
          violinsLoud: both(MIN),
          flute: transpose(both(MIN), 12),
          hornsHard: [...sustained(MINUET_CHORDS, BAR, 0, 2), ...sustained(UP, BAR, 0, 2)],
          trombones: Array.from({ length: 16 }, (_, b) => low(b, 1, LONG)).flat(),
          tuba: Array.from({ length: 16 }, (_, b) => low(b, 2, BASS13)).flat(),
          pound: chordLine(ch.join(' '), POUND, 2),
          timpani: timp(ch.join(' '), T_FIST),
          bassDrum: repeat(STOMP, 16),
          tom: Array.from({ length: 16 }, (_, b) => (b % 4 === 0 ? FIST_HITS : rest(1))).flat(),
          snare: [...repeat(CRACK, 7), ...ROLL, ...repeat(CRACK, 7), ...cut(ROLL, 8)],
          impact: [...ONE, ...rest(7), ...ONE, ...rest(7)],
          gong: [...ONE, ...rest(15)],
          crash: [...ONE, ...rest(3), ...ONE, ...rest(3), ...ONE, ...rest(3), ...ONE, ...rest(3)],
          bellHard: [...repeat(BELL_ON_3, 8), ...transpose(repeat(BELL_ON_3, 8), 1)],
        }, 16);
      })(),

      // Home: the prim minuet is broken off by the cell; bell; rising harp on the dominant.
      H: t('H', {
        harp: [...MIN.slice(0, 6 * BAR), ...rest(5), ...tl('A4 C#5 E5 A5 C#6 E6')],
        pizz: [...chordLine('Dm Dm Gm A Dm Bb', PIZZ_ROLL, 3), ...rest(2), ...chordLine('A A A', PIZZ_ROLL, 3), ...rest(1)],
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
