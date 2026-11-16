import { melody, hits, repeat, arpeggio, chordLine, sustained, transpose } from '../../audio/notation.js';
import { ORCHESTRA, timp as timpLow, held, onNotes } from './parts/usurper.js';
import { LULLABY_A, LULLABY_B, LULLABY_OPENING, haddockNotes } from './parts/chapter5.js';

// "Salt in the Wound": the boss theme for Corrie, the Tidecaller, at the top
// of the Last Light. It is a dark sea shanty: a crew stamping on a deck in a
// storm, nothing jolly about it. A fiddle takes the coast tune (A D D E) over
// a low drone, boots and a bass drum stamp the 6/8, and a ship's bell tolls
// every four bars. Grown on 7 November 2026 from the shanty version picked as
// Corrie's song on 6 November (that version is backed up in
// notes/music-backup-2026-11-07/corrieBattleTheme.js; the first boss version,
// in 4/4, is in notes/music-backup-2026-11-06/). The shanty is still the
// heart of it; around it now are the two other tunes of the chapter:
//
//   THE COAST TUNE (A D D E, parts/chapter5.js): the sea's tune, the shanty.
//   CORRIE'S LULLABY ("Come In, Little Boat", F A D / D C Bb / A G F / E):
//     the boy's own tune. It opens the song on a music box, comes back
//     darkened over a pedal D, is wrecked in the middle (its notes pushed
//     off true, and re-barred into three heavy beats against the stamp's
//     two), trades lines with the crew, and at the very end is sung plain by
//     the choir, landing on D at last.
//   HADDOCK'S MOTIF (F E D, then down to A: long, short, long, longer): it
//     arrives in the lamp, when Corrie is a child again, low in the cellos,
//     then grows on the horns and trumpets; at the end it sits under the
//     lullaby on every chord in turn, the way he hums it.
//
// D minor, with the flat sixth and seventh (Bb, C) and A major to pull home;
// the one borrowed colour is the Neapolitan Eb in the second verse. G minor
// for the second verse. The bass walks: down by semitones under the wrecked
// lullaby (D C# C B Bb A G# A), down by step under the lullaby's lift (F E
// Eb D Db C), so even the major bars never feel like comfort. Real
// recordings for the orchestra (solo violin, strings, horns, trumpets,
// trombones, tuba, timpani, gong, glockenspiel, harp, chimes), and the
// game's own "ah" choir (never above MIDI 83). No claps, no bouncy
// afterbeats. Reference for the shape: Toby Fox's ASGORE and Hopes and
// Dreams (a new tune every 17 to 35 seconds, the surprise just under halfway,
// home before the loop), and the trailer's stopdown and drop.
//
// 6/8 at 112 dotted quarters a minute; 12 steps to a bar, one step a 16th
// (a bar is about 1.07 seconds). The intro plays once (8 bars, 9s); then it
// loops from A, 152 bars, about 2m43s (2m51s with the intro):
//
//   section  bars  time          what happens
//   intro      8   (once, 9s)    the music box plays the lullaby's opening at
//                                its own slow pace over the drone and a hum;
//                                it stops on E, asking; the stamp comes in
//   A         16   0:00-0:17     the fiddle's shanty over the drone; boots
//                                join at bar 5, the deck's backbeat (a snare
//                                on the second stamp) at bar 9  (phase 1)
//   B         16   0:17-0:34     the crew (a gang of voices, low) and a
//                                trombone sing it, horns joining them for the
//                                second half; the fiddle whirls; anvil,
//                                timpani, the backbeat
//   L         16   0:34-0:51     the lullaby darkened, at the fight's pace:
//                                clarinet and music box over a pedal D; then
//                                its lift into F on trumpets and violins
//                                while the bass sinks a step a bar (F E
//                                Eb D Db C), so the lift never comforts
//   C         16   0:51-1:09     THE STORM GATHERS: a deep hit
//                                and a low BRAAAM; the coast tune slowed to a
//                                crawl on trombones and horns over rolling
//                                timpani and tremolo; then the lightning, a
//                                high trumpet line over the whirl, the stamp
//                                building back... and a beat of silence
//   W         16   1:09-1:26     THE DROP (phase 2, the storm, starts here):
//                                gong, deep drum, crash, BRAAAM, everyone on
//                                the first beat, so it works as a cold start.
//                                The lullaby wrecked: wrong notes, and
//                                re-barred into three beats against the
//                                stamp's two, a snare on beats 2 and 3; the
//                                bass crawls down by semitones; at bar 9 a
//                                second BRAAAM on Bb and the crew takes the
//                                wreck up an octave; its last note never lands
//   R         16   1:26-1:43     call and response: the crew sings the coast
//                                tune two bars at a time, and the brass and
//                                the music box answer with the lullaby
//   D         16   1:43-2:00     THE WHIRLPOOL (phase 3): the second verse in
//                                G minor, oboe and clarinet, then trumpets
//                                and violins; the Eb darkening it
//   E         16   2:00-2:17     THE LAMP (phase 4): the music box again,
//                                tired, over a rocking harp and a heartbeat;
//                                low cellos begin Haddock's motif; then the
//                                motif on horns, trombones, the choir, the
//                                trumpets, gongs, a swell; the last bar turns
//                                to B major, the door into E minor
//   F         16   2:17-2:34     ALL HANDS, a step up in E minor: the shanty
//                                at its biggest, the hook stacked the way a
//                                big tune is: fiddle, violins and trumpets at
//                                pitch, the crew in two octaves, horns and
//                                trombones two octaves down, tuba on the
//                                roots; a rolling 8th-note bass, racing
//                                strings, gongs at bars 1 and 9
//   H          8   2:34-2:43     back in D minor (E minor slides up to
//                                F major): the choir sings the lullaby's last line
//                                plain and lands on D at last; Haddock's
//                                motif under it on every chord; the box has
//                                the last word, and it loops to A
//
// The drop (W) is 42% in; the G minor verse 63%; the lift into E minor 85%.
// The fight starts a section for each phase (src/data/enemies/corrie.js,
// `musicFrom`): W for the storm, D for the whirlpool, E for the lamp. W and D
// open on a full hit and E on a quiet bar, so the cut never lands
// mid-phrase. (The 7 November version before this pass is in
// notes/music-backup-2026-11-07-b/.)

const BAR = 12;
const tune = (text) => melody(text, 2);   // each token an eighth: 6 to a bar
const slow = (text) => melody(text, 4);   // each token a quarter: the tune at half speed
const rest = (bars) => Array(bars * BAR).fill('.');
const up = transpose;
// The timpani, with any note below the lowest drum (E2) taken up an octave.
const timp = (names, pattern) => timpLow(names, pattern).map((n) => (typeof n === 'number' && n < 40 ? n + 12 : n));
// The crew can't sing above MIDI 83: anyone who can't reach drops an octave.
const reach = (steps) => steps.map((n) => (typeof n === 'number' && n > 83 ? n - 12 : n));
const DRUMS = new Set(['stamp', 'boots', 'frame', 'anvil', 'roll', 'crash', 'gong', 'impact', 'snap', 'swell']);
// Every tuned track up `semis`, the drums left alone.
const keyUp = (section, semis) => Object.fromEntries(Object.entries(section).map(([k, v]) => [k, DRUMS.has(k) ? v : up(v, semis)]));

// Lay `parts` ([startBar, steps]) on a track `bars` long, the rest silent.
// Throws if a part runs past the end, so a miscounted bar is caught when the
// song loads.
const lay = (name, bars) => (...parts) => {
  const out = rest(bars);
  for (const [at, steps] of parts) {
    if (at * BAR + steps.length > out.length) throw new Error(`Salt in the Wound ${name}: a part from bar ${at} (${steps.length} steps) runs past ${bars} bars`);
    steps.forEach((step, i) => { out[at * BAR + i] = step; });
  }
  return out;
};
const tight = (name, section, bars) => {
  for (const [track, steps] of Object.entries(section)) {
    if (steps.length !== bars * BAR) throw new Error(`Salt in the Wound ${name}: '${track}' is ${steps.length} steps, not ${bars} bars`);
  }
  return section;
};
// The stopdown: every track goes silent for the last `n` steps of a section.
const stopdown = (section, n) => Object.fromEntries(Object.entries(section).map(([track, steps]) => [track, [...steps.slice(0, steps.length - n), ...Array(n).fill('.')]]));
const bars = (text, from, to) => text.split(' ').slice(from, to).join(' ');

// --- Harmony, a bar each ---
const TUNE_CHORDS = 'Dm C Dm Am Bb C A Dm Dm C Bb A Dm Bb A Dm';
const INTRO_CHORDS = 'Dm Dm Bb Bb Gm Gm A A';           // the lullaby's opening, at half speed
const LULL_CHORDS = 'Bb Bb Gm A Dm Bb Gm Dm';            // over the pedal D
const LIFT_CHORDS = 'F C Dm Gm F C A Dm';
const LIFT_BASS = 'F1 E1 Eb1 D1 Db1 C1 A1 D1';           // sinking under the lift
const C_CHORDS = 'Dm Dm Bb Bb Gm Gm A A';
const LIGHT_CHORDS = 'Gm C F Bb Dm F Gm A';
const W_CHORDS = 'Dm Dm A A Am Fm G G Bb Bb F F E E A A';  // bar 8 is Bb: the second braam
const W_BASS = 'D2 D2 C#2 C#2 C2 C2 B1 B1 Bb1 Bb1 A1 A1 G#1 G#1 A1 A1';
const R_CHORDS = 'Dm C Dm Bb Dm Am Gm A Bb C Dm Bb A Dm Gm Dm';
const D_CHORDS = 'Gm Gm Dm Dm Bb Eb A A Gm Gm Dm Bb Eb C A A';
const E1_CHORDS = 'Dm Dm Bb Bb Gm Gm A A';
const E2_CHORDS = 'Dm A Bb A Gm A Bb B';    // B: the door into E minor
const H_CHORDS = 'F F C C A A Dm Dm';

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
// The storm: the tune's first notes, slow, on low brass.
const SLOW = tune(`
  A3 - - - - -   D4 - - - - -   D4 - - E4 - -   F4 - - - - -
  G4 - - - - -   F4 - - E4 - -  E4 - - - - -    C#4 - - - - .
`);
// The lightning: a high trumpet line, climbing in jolts.
const LIGHTNING = tune(`
  D5 - - - - -   G5 - - F5 - E5
  F5 - - - - -   Bb5 - - A5 - G5
  A5 - - - - -   C6 - - Bb5 - A5
  G5 - - E5 - -  C#5 - - - - -
`);

// --- Corrie's lullaby ---
const LULL_A = tune(LULLABY_A);          // its own 6/8, at the fight's pace
const LULL_B = tune(LULLABY_B);          // the lift into F
const BOX_OPEN = slow(LULLABY_OPENING);  // its real, slow pace: 8 bars
const LAST_LINE = slow(bars(LULLABY_B.trim().replace(/\s+/g, ' '), 24, 48)); // A C F / G F E / E C# A / D
// The lullaby wrecked: each 6/8 bar's three notes become three heavy beats
// (a quarter each: 3/4 against the stamp's 6/8), and the notes are pushed
// off true. The lift becomes a siren, and the last note is the wrong one.
const WRECK = melody(`
  F4 A4 D5    Eb5 Db5 B4    A4 Ab4 F#4   Bb4 - -
  F4 A4 D5    F5 Eb5 D5     Bb4 A4 Ab4   G4 - -
  A4 C5 F5    E5 Eb5 C5     D5 Db5 A4    Bb4 A4 G#4
  A4 C5 F5    G5 F5 E5      E5 C#5 A4    Bb4 - -
`, 4);

// --- Haddock's motif in 6/8, over two bars: F (a quarter) E (an eighth)
// D (a dotted quarter), then the low A held. Long, short, long, longer. ---
const haddock = (tonic, minor = true) => {
  const [a, b, c, d] = haddockNotes(tonic, { minor });
  return [a, '-', '-', '-', b, '-', c, '-', '-', '-', '-', '-', d, ...Array(9).fill('-'), '.', '.'];
};
// On every chord in turn, the way he hums it: F, C, A, then D minor.
const HADDOCK_HOME = (oct) => [...haddock(`F${oct}`, false), ...haddock(`C${oct}`, false), ...haddock(`A${oct - 1}`, false), ...haddock(`D${oct}`)];

// --- Patterns, a bar each ---
// The low strings: a heavy root, the root again, the fifth, the root.
const STAMP_BASS = [0, '-', '-', '-', 0, '.', 7, '-', '-', '-', 0, '.'];
// In three beats (the wreck): low-high pairs a quarter apart.
const HEMI_BASS = [0, '.', 12, '.', 0, '.', 12, '.', 0, '.', 12, '.'];
const HELD_BAR = [0, ...Array(11).fill('-')];
const ROOTS6 = [0, '-', '-', '-', '-', '-', 7, '-', '-', '-', '-', '-'];
// The fiddle's whirl over the crew.
const WHIRL = [0, '-', 7, '.', 12, '.', 'tenth', '-', 12, '.', 7, '.'];
// The all-hands bass: rolling 8ths, root and octave, leaning on the fifth.
const DRIVE_BASS = [0, '.', 12, '.', 0, '.', 7, '.', 12, '.', 7, '.'];
// Spiccato violins flickering in the lightning.
const FLICKER = [0, 7, 12, 'tenth', 12, 7, 0, 7, 12, 'tenth', 19, 'tenth'];
// The cradle: Corrie's harp, rocking in eighths.
const ROCK = [0, '-', 7, '-', 12, '-', 'tenth', '-', 12, '-', 7, '-'];
// Timpani: the stamp, with the fifth below leaning in.
const T_STAMP = [0, '.', '.', '.', '.', '.', 0, '.', '.', -5, '.', '.'];
const T_THREE = [0, '.', '.', '.', 0, '.', '.', '.', -5, '.', 0, '.'];
const T_ROLL6 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const T_HEART = [0, '.', 0, '.', '.', '.', '.', '.', '.', '.', '.', '.'];

// --- Drums, a bar each ---
const STAMP = hits('x.....x.....');
const BOOTS = hits('x...x.x...x.');
const BOOTS3 = hits('x...x...x...');
const FRAME = hits('..x.x...x.xx');
const ANVIL = hits('......x.....');
// The deck's backbeat: a snare cracking on the second stamp of the bar, so
// the 6/8 goes STAMP-crack, STAMP-crack.
const SNAP = hits('......x.....');
const SNAP_FILL = hits('......x...xx');
const ANVIL3 = hits('........x...');
const BUILD = hits('x.x.x.x.x.xx');
const ROLL = hits('xxxxxxxxxxxx');
const ONE = hits('x');
// The ship's bell: D, then A below, every four bars.
const BELL = [74, '-', '-', '-', '-', '-', 69, '-', '-', '-', '-', '-', ...rest(3)];
// The cymbal swell is loudest 3.18 seconds in: 36 steps at this tempo.
const SWELL = held(60, 36);

// ----------------------------------------------------------------- intro
const intro = (() => {
  const t = lay('intro', 8);
  return tight('intro', {
    box: t([0, up(BOX_OPEN, 12)]),
    harp: t([0, arpeggio(INTRO_CHORDS, BAR, 3, ROCK)]),
    drone: sustained(INTRO_CHORDS, BAR, 0, 2),
    crewHeld: t([2, sustained(bars(INTRO_CHORDS, 2, 8), BAR, 0, 3)]),
    bell: t([0, BELL.slice(0, 2 * BAR)], [4, BELL.slice(0, 2 * BAR)]),
    stamp: t([6, repeat(STAMP, 2)]),
    roll: t([7, ROLL]),
  }, 8);
})();

// ----------------------------------------------------------- A (phase 1)
const A = tight('A', {
  fiddle: TUNE,
  drone: sustained(TUNE_CHORDS, BAR, 0, 2),
  stampBass: chordLine(TUNE_CHORDS, STAMP_BASS, 2),
  basses: sustained(TUNE_CHORDS, BAR, 0, 1),
  bell: repeat(BELL, 4),
  stamp: repeat(STAMP, 16),
  boots: [...rest(4), ...repeat(BOOTS, 12)],
  frame: [...rest(8), ...repeat(FRAME, 8)],
  snap: [...rest(8), ...repeat(SNAP, 7), ...SNAP_FILL],
}, 16);

// ------------------------------------------------------------------- B
const B = tight('B', {
  crew: up(TUNE, -12),
  trombone: up(TUNE, -24),
  horns: [...rest(8), ...up(TUNE.slice(8 * BAR), -24)],
  whirl: arpeggio(TUNE_CHORDS, BAR, 5, WHIRL),
  snap: [...repeat(SNAP, 15), ...SNAP_FILL],
  tuba: chordLine(TUNE_CHORDS, ROOTS6, 1),
  stampBass: chordLine(TUNE_CHORDS, STAMP_BASS, 2),
  timpani: timp(TUNE_CHORDS, T_STAMP),
  bell: repeat(BELL, 4),
  stamp: repeat(STAMP, 16),
  boots: repeat(BOOTS, 16),
  frame: repeat(FRAME, 16),
  anvil: repeat(ANVIL, 16),
  crash: [...ONE, ...Array(16 * BAR - 1).fill('.')],
}, 16);

// ------------------------------------- L: the lullaby darkened, then lifted
const L = (() => {
  const t = lay('L', 16);
  return tight('L', {
    clarinet: t([0, LULL_A]),
    box: t([0, up(LULL_A, 12)], [8, up(LULL_B, 12).slice(0, 4 * BAR)]),
    trumpets: t([8, LULL_B]),
    violins: t([8, LULL_B]),
    hum: t([0, up(LULL_A, -12)]),
    crewHeld: t([0, sustained(LULL_CHORDS, BAR, 1, 3)], [8, sustained(LIFT_CHORDS, BAR, 2, 3)]),
    drone: t([0, repeat(held('D2', BAR), 8)], [8, onNotes(bars(LIFT_BASS, 0, 8).replace(/1/g, '2'), HELD_BAR)]),
    stampBass: t([0, repeat(onNotes('D2', STAMP_BASS), 8)], [8, onNotes(LIFT_BASS.replace(/1/g, '2'), STAMP_BASS)]),
    basses: t([8, onNotes(LIFT_BASS, HELD_BAR)]),
    timpani: t([4, repeat(timp('Dm', T_STAMP), 4)], [8, timp('F E Eb D Db C A D', T_STAMP)]),
    stamp: repeat(STAMP, 16),
    boots: t([4, repeat(BOOTS, 11)], [15, BUILD]),
    frame: t([8, repeat(FRAME, 8)]),
    bell: t([0, BELL], [8, BELL]),
    roll: t([15, ROLL]),
  }, 16);
})();

// ------------------------------------------------ C: the storm (phase 2)
const C = (() => {
  const t = lay('C', 16);
  const swellAt = 16 * BAR - 6 - 36;   // peaks right on the stopdown
  return tight('C', stopdown({
    braamLow: t([0, held('D2', 2 * BAR)]),
    impact: t([0, ONE]),
    crash: t([8, ONE]),
    trombone: t([0, SLOW], [8, up(LIGHTNING, -24)]),
    horns: t([0, up(SLOW, -12)]),
    tuba: t([0, up(SLOW, -12)], [8, chordLine(LIGHT_CHORDS, ROOTS6, 1)]),
    tremolo: t([0, sustained(C_CHORDS, BAR, 0, 2)]),
    violinsTrem: t([0, sustained(C_CHORDS, BAR, 2, 4)], [8, sustained(LIGHT_CHORDS, BAR, 1, 4)]),
    choirBig: t([2, sustained(bars(C_CHORDS, 2, 8), BAR, 2, 3)], [8, sustained(LIGHT_CHORDS, BAR, 0, 4)]),
    crewHeld: t([8, sustained(LIGHT_CHORDS, BAR, 1, 3)]),
    basses: t([0, sustained(C_CHORDS, BAR, 0, 1)], [8, sustained(LIGHT_CHORDS, BAR, 0, 1)]),
    trumpets: t([8, LIGHTNING]),
    violins: t([8, LIGHTNING]),
    race: t([8, arpeggio(LIGHT_CHORDS, BAR, 4, FLICKER)]),
    stampBass: t([8, chordLine(LIGHT_CHORDS, STAMP_BASS, 2)]),
    timpRoll: t([0, timp('Dm Dm Bb Bb Gm Gm', [0, ...Array(11).fill('-')])]),
    timpani: t([6, timp('A A', T_STAMP)], [8, timp(LIGHT_CHORDS, T_STAMP)]),
    stamp: t([6, repeat(STAMP, 10)]),
    boots: t([6, [...BOOTS, ...BUILD]], [8, repeat(BOOTS, 6)], [14, [...BUILD, ...BUILD]]),
    anvil: t([8, repeat(ANVIL, 8)]),
    roll: t([7, ROLL], [14, [...ROLL, ...ROLL]]),
    bell: t([4, held(74, BAR)], [12, held(74, BAR)]),
    swell: t([0, [...Array(swellAt).fill('.'), ...SWELL]]),
  }, 6), 16);
})();

// ------------------------------------------ W: the drop, the wrecked lullaby
const W = (() => {
  const t = lay('W', 16);
  return tight('W', stopdown({
    gong: t([0, ONE], [8, ONE]),
    impact: t([0, ONE], [8, ONE]),
    crash: t([0, ONE], [8, ONE]),
    braam: t([0, held('D3', 2 * BAR)], [8, held('Bb2', 2 * BAR)]),
    braamLow: t([0, held('D2', 2 * BAR)], [8, held('Bb1', 2 * BAR)]),
    trumpets: WRECK,
    violins: up(WRECK, 12),
    trombone: up(WRECK, -12),
    horns: up(WRECK, -24),
    crew: [...up(WRECK.slice(0, 8 * BAR), -12), ...WRECK.slice(8 * BAR)],
    snap: [...repeat(hits('....x...x...'), 15), ...rest(1)],
    race: arpeggio(W_CHORDS, BAR, 4, [0, 7, 12, 7, 0, 7, 12, 7, 'tenth', 12, 7, 12]),
    violinsTrem: t([8, sustained(bars(W_CHORDS, 8, 16), BAR, 0, 5)]),
    choirBig: sustained(W_CHORDS, BAR, 2, 3),
    crewHeld: sustained(W_CHORDS, BAR, 1, 4),
    tuba: onNotes(W_BASS, HELD_BAR),
    basses: onNotes(W_BASS, HELD_BAR),
    stampBass: up(onNotes(W_BASS, HEMI_BASS), 12),
    timpani: timp(W_BASS.replace(/\d/g, ''), T_THREE),
    stamp: repeat(STAMP, 16),
    boots: [...repeat(BOOTS3, 15), ...BUILD],
    anvil: repeat(ANVIL3, 16),
    roll: t([15, ROLL]),
  }, 6), 16);
})();

// --------------------------------- R: call and response, crew and lullaby
const R = (() => {
  const t = lay('R', 16);
  const call = (b) => up(TUNE.slice(b * BAR, (b + 2) * BAR), -12);
  const answer = (b) => LULL_A.slice(b * BAR, (b + 2) * BAR);
  const calls = t([0, call(0)], [4, call(2)], [8, call(4)], [12, call(6)]);
  const answers = t([2, answer(0)], [6, answer(2)], [10, answer(4)], [14, answer(6)]);
  return tight('R', {
    crew: calls,
    trombone: t([8, up(TUNE.slice(4 * BAR, 6 * BAR), -24)], [12, up(TUNE.slice(6 * BAR, 8 * BAR), -24)]),
    trumpets: answers,
    horns: up(answers, -12),
    box: up(answers, 12),
    whirl: t([8, arpeggio(bars(R_CHORDS, 8, 16), BAR, 5, WHIRL)]),
    crewHeld: sustained(R_CHORDS, BAR, 0, 3),
    drone: sustained(R_CHORDS, BAR, 0, 2),
    tuba: chordLine(R_CHORDS, ROOTS6, 1),
    stampBass: chordLine(R_CHORDS, STAMP_BASS, 2),
    basses: sustained(R_CHORDS, BAR, 0, 1),
    timpani: timp(R_CHORDS, T_STAMP),
    stamp: repeat(STAMP, 16),
    boots: [...repeat(BOOTS, 15), ...BUILD],
    frame: repeat(FRAME, 16),
    anvil: t([8, repeat(ANVIL, 8)]),
    snap: [...repeat(SNAP, 15), ...SNAP_FILL],
    bell: repeat(BELL, 4),
    crash: t([0, ONE], [8, ONE]),
    roll: t([15, ROLL]),
  }, 16);
})();

// --------------------------------- D: the second verse, G minor (phase 3)
const D = (() => {
  const t = lay('D', 16);
  return tight('D', {
    crash: t([0, ONE], [8, ONE]),
    impact: t([0, ONE]),
    oboe: VERSE,
    clarinet: up(VERSE, -12),
    trumpets: t([8, VERSE.slice(8 * BAR)]),
    violins: t([8, VERSE.slice(8 * BAR)]),
    whirl: arpeggio(D_CHORDS, BAR, 5, WHIRL),
    crewHeld: sustained(D_CHORDS, BAR, 0, 3),
    choirBig: t([8, sustained(bars(D_CHORDS, 8, 16), BAR, 2, 3)]),
    drone: sustained(D_CHORDS, BAR, 0, 2),
    stampBass: chordLine(D_CHORDS, STAMP_BASS, 2),
    basses: sustained(D_CHORDS, BAR, 0, 1),
    tuba: chordLine(D_CHORDS, ROOTS6, 1),
    timpani: [...timp(bars(D_CHORDS, 0, 8), [0, ...Array(11).fill('.')]), ...timp(bars(D_CHORDS, 8, 16), T_STAMP)],
    bell: repeat(BELL, 4),
    stamp: repeat(STAMP, 16),
    boots: repeat(BOOTS, 16),
    frame: repeat(FRAME, 16),
    anvil: t([8, repeat(ANVIL, 8)]),
    snap: t([8, repeat(SNAP, 7)]),
    roll: t([15, ROLL]),
  }, 16);
})();

// ------------------------------- E: the lamp, Haddock's motif (phase 4)
const E = (() => {
  const t = lay('E', 16);
  const swellAt = 16 * BAR - 36;   // peaks on F's first beat
  return tight('E', {
    box: t([0, up(BOX_OPEN, 12)]),
    harp: t([0, arpeggio(E1_CHORDS, BAR, 3, ROCK)]),
    hum: t([0, sustained(E1_CHORDS, BAR, 0, 3)]),
    lowCellos: t([4, repeat(haddock('D3'), 6)]),
    horns: t([8, repeat(haddock('D3'), 4)]),
    trombone: t([10, repeat(haddock('D3'), 3)]),
    choirBig: t([8, repeat(haddock('D4'), 4)]),
    trumpets: t([12, repeat(haddock('D5'), 2)]),
    violinsTrem: t([8, sustained(E2_CHORDS, BAR, 1, 4)]),
    crewHeld: t([8, sustained(E2_CHORDS, BAR, 2, 3)]),
    tuba: t([8, chordLine(E2_CHORDS, ROOTS6, 1)]),
    basses: t([4, sustained(bars(E1_CHORDS, 4, 8), BAR, 0, 1)], [8, sustained(E2_CHORDS, BAR, 0, 1)]),
    timpani: t([0, timp(E1_CHORDS, T_HEART)], [8, timp(bars(E2_CHORDS, 0, 6), T_STAMP)], [14, timp('Bb B', T_ROLL6)]),
    stamp: t([8, repeat(STAMP, 8)]),
    boots: t([12, [...repeat(BOOTS, 3), ...BUILD]]),
    gong: t([8, ONE], [12, ONE]),
    impact: t([8, ONE]),
    bell: t([3, held(69, BAR)], [7, held(69, BAR)]),
    roll: t([14, [...ROLL, ...ROLL]]),
    swell: t([0, [...Array(swellAt).fill('.'), ...SWELL]]),
  }, 16);
})();

// ----------------------------------------------------------- F: all hands
// Written in D, then the whole thing is lifted a step into E minor (keyUp):
// the shanty's last chorus, the highest and loudest it ever gets.
const F = (() => {
  const t = lay('F', 16);
  return tight('F', keyUp({
    fiddle: TUNE,
    violins: TUNE,
    trumpets: TUNE,
    crew: up(TUNE, -12),
    crewHigh: reach(up(TUNE, 2)).map((n) => (typeof n === 'number' ? n - 2 : n)),
    trombone: up(TUNE, -24),
    horns: up(TUNE, -24),
    whirl: t([8, arpeggio(bars(TUNE_CHORDS, 8, 16), BAR, 5, WHIRL)]),
    race: arpeggio(TUNE_CHORDS, BAR, 4, FLICKER),
    choirBig: sustained(TUNE_CHORDS, BAR, 2, 3),
    tuba: chordLine(TUNE_CHORDS, ROOTS6, 1),
    drone: sustained(TUNE_CHORDS, BAR, 0, 2),
    stampBass: chordLine(TUNE_CHORDS, DRIVE_BASS, 2),
    basses: chordLine(TUNE_CHORDS, STAMP_BASS, 1),
    timpani: timp(TUNE_CHORDS, T_STAMP),
    bell: repeat(BELL, 4),
    stamp: repeat(STAMP, 16),
    boots: repeat(BOOTS, 16),
    frame: repeat(FRAME, 16),
    anvil: repeat(ANVIL, 16),
    snap: [...repeat(SNAP, 7), ...SNAP_FILL, ...repeat(SNAP, 7), ...SNAP_FILL],
    gong: t([0, ONE], [8, ONE]),
    impact: t([0, ONE], [8, ONE]),
    crash: t([0, ONE], [4, ONE], [8, ONE], [12, ONE]),
  }, 2), 16);
})();

// ------------------------------------------- H: the lullaby lands, at last
const H = (() => {
  const t = lay('H', 8);
  return tight('H', {
    choirBig: LAST_LINE,
    box: up(LAST_LINE, 12),
    hornsSoft: HADDOCK_HOME(3),
    harp: t([0, arpeggio(bars(H_CHORDS, 0, 7), BAR, 3, ROCK)]),
    pad: t([0, sustained(bars(H_CHORDS, 0, 7), BAR, 1, 4)]),
    drone: t([0, sustained(bars(H_CHORDS, 0, 7), BAR, 0, 2)]),
    basses: t([0, sustained(bars(H_CHORDS, 0, 6), BAR, 0, 1)]),
    timpani: t([0, timp('F', T_HEART)], [2, timp('C', T_HEART)], [4, timp('A', T_HEART)], [6, timp('D', T_HEART)]),
    bell: t([6, held(74, BAR)]),
  }, 8);
})();

export const CORRIE_BATTLE_THEME = {
  title: 'Salt in the Wound',
  bpm: 112,
  stepsPerBeat: 6,
  volume: 1.05,

  instruments: {
    // the shanty
    fiddle: { ...ORCHESTRA.soloViolin, volume: 0.5, humanize: { time: 0.006, volume: 0.1 } },
    whirl: { ...ORCHESTRA.soloViolin, volume: 0.3, pan: 0.35, humanize: { time: 0.006, volume: 0.15 } },
    // the crew: a gang of voices, quick to speak, a little ragged
    crew: { sample: 'choir', volume: 0.34, attack: 0.03, release: 0.25, reverb: 0.45, pan: -0.1, humanize: { time: 0.012, volume: 0.12 } },
    crewHigh: { sample: 'choir', volume: 0.22, attack: 0.03, release: 0.25, reverb: 0.5, pan: 0.15, humanize: { time: 0.012, volume: 0.12 } },
    crewHeld: { sample: 'choir', volume: 0.18, attack: 0.8, release: 1.0, reverb: 0.6 },
    choirBig: { sample: 'choir', volume: 0.26, attack: 0.4, release: 0.9, reverb: 0.6, pan: 0.1 },
    hum: { sample: 'choir', volume: 0.15, attack: 0.5, release: 1.0, reverb: 0.7, humanize: { time: 0.01, volume: 0.1 } },
    oboe: { sample: 'oboe', volume: 0.32, attack: 0.03, release: 0.25, reverb: 0.45, pan: 0.1, humanize: { time: 0.006, volume: 0.1 } },
    clarinet: { sample: 'clarinet', volume: 0.26, attack: 0.03, release: 0.25, reverb: 0.45, pan: -0.15, humanize: { time: 0.006, volume: 0.1 } },
    // Corrie's music box and his cradle harp
    box: { sample: 'glock', volume: 0.2, ring: true, reverb: 0.55, pan: 0.15, echo: { time: 0.36, feedback: 0.3, mix: 0.25 }, humanize: { time: 0.008, volume: 0.1 } },
    harp: { sample: 'harp', volume: 0.2, ring: true, reverb: 0.5, pan: -0.25, humanize: { time: 0.01, volume: 0.18 } },
    pad: { sample: 'violas', volume: 0.14, attack: 0.9, release: 1.2, reverb: 0.5, pan: 0.2 },
    // strings
    violins: { ...ORCHESTRA.violins, volume: 0.3 },
    violinsTrem: { sample: 'violinsTrem', volume: 0.2, attack: 0.4, release: 0.6, reverb: 0.45, pan: 0.2 },
    race: { ...ORCHESTRA.race, volume: 0.2 },
    drone: { sample: 'cellos', volume: 0.22, attack: 0.3, release: 0.6, reverb: 0.4, pan: -0.2 },
    lowCellos: { sample: 'cellos', volume: 0.3, attack: 0.08, release: 0.5, reverb: 0.4, pan: -0.25, humanize: { time: 0.008, volume: 0.1 } },
    tremolo: { sample: 'cellosTrem', volume: 0.24, attack: 0.6, release: 0.8, reverb: 0.4, pan: -0.2 },
    stampBass: { ...ORCHESTRA.pound, volume: 0.36 },
    basses: { ...ORCHESTRA.basses, volume: 0.36 },
    // brass
    trumpets: { ...ORCHESTRA.trumpets, volume: 0.32 },
    horns: { ...ORCHESTRA.horns, volume: 0.38 },
    hornsSoft: { ...ORCHESTRA.hornsSoft, volume: 0.3 },
    trombone: { ...ORCHESTRA.trombones, volume: 0.34 },
    tuba: { ...ORCHESTRA.tuba, volume: 0.36 },
    braam: { ...ORCHESTRA.braam, volume: 0.55 },
    braamLow: { ...ORCHESTRA.braamLow, volume: 0.55 },
    // percussion
    bell: { sample: 'chimes', volume: 0.22, ring: true, reverb: 0.6, pan: 0.3 },
    timpani: { ...ORCHESTRA.timpani, volume: 0.5 },
    timpRoll: { ...ORCHESTRA.timpRoll, volume: 0.4 },
    stamp: { ...ORCHESTRA.bassDrum, volume: 0.55 },
    boots: { ...ORCHESTRA.taiko, volume: 0.4 },
    frame: { sample: 'frameDrum', drum: 'sample', volume: 0.24, ring: true, reverb: 0.25, humanize: { time: 0.004, volume: 0.2 } },
    snap: { ...ORCHESTRA.snare, volume: 0.3 },
    anvil: { sample: 'anvil', drum: 'sample', volume: 0.16, ring: true, reverb: 0.4, pan: 0.2 },
    roll: { ...ORCHESTRA.roll, volume: 0.22 },
    crash: { ...ORCHESTRA.crash, volume: 0.3 },
    gong: { ...ORCHESTRA.gong, volume: 0.45 },
    impact: { ...ORCHESTRA.impact, volume: 0.7 },
    swell: { ...ORCHESTRA.swell, volume: 0.35 },
  },

  sections: { intro, A, B, L, C, W, R, D, E, F, H },

  order: ['intro', 'A', 'B', 'L', 'C', 'W', 'R', 'D', 'E', 'F', 'H'],
  loopFrom: 1,
};
