import { melody, hits, repeat, arpeggio, chordLine, sustained, transpose } from '../../audio/notation.js';
import { ORCHESTRA, timp as timpLow } from './parts/usurper.js';
import { SHANTY, NO_PORT, GHOST_FIRST, fit as fitSteps, lay as layOn, dots, hold } from './parts/ghostShip.js';

// "Still Under Way": the fight with Captain Tarry, master of the Fair Return,
// in his cabin at the stern of the ghost ship. He went down with her a hundred
// years ago and won't have it. He still gives the orders he gave that night,
// still promises the crew they'll be home tomorrow. All bluster and command on
// top, and under it a grief he won't look at. So the song is a march, his,
// that keeps breaking down into a shanty, theirs.
//
// TWO TIMES AT ONCE. His music is in 4/4: a minor-key quarterdeck march, snare
// and bass drum, brass barking, the low strings marching in dotted rhythm. The
// crew's music is the 3/4 shanty from the ship's own song, "Port Tomorrow"
// (ghostShipTheme.js, parts/ghostShip.js), slow and sad. Every time his march
// falters, the waltz is underneath it.
//
// THE HOOK (from the first bar) is the shanty itself, re-barred by him into a
// march: two shanty bars to one of his, the lilt turned to a dotted snap
// ("PORT, to-mor-row" becomes DUM-da DUM, DUM-da DUM), and the leap up to home
// flung up an octave and a sixth. He never finishes it: it climbs to the B
// natural, a semitone short of home, and he barks the next order (G G) and
// starts again. One more tide.
//
// HIS ORDERS (B): a bugle call in the shanty's rhythm (G, up to C, up to G:
// "HARD a-PORT"), echoed by a far trumpet across an empty deck; and the crew
// answers, flat and dead, with the only three notes they have left: Eb D C,
// "Aye, Captain", the shanty's second bar. In the mutiny (M) the orders come
// and the answers don't: two bars of silence where the crew should be.
//
// C minor, with the shanty's own chords (Cm Ab Eb G...), the Neapolitan D flat
// as the one borrowed colour (under the last answer in B), and an Ab Lydian
// bar in the music box's verse (the D over A flat, like a held breath). The
// mutiny goes up a semitone to C sharp minor, and the heave comes back down
// into C minor a semitone lower, like a deck dropping away.
//
// All real recordings: trumpets, horns, trombones, tuba, soft horns, violins,
// violas, cellos, basses, spiccato strings, solo violin, the game's choir, oboe,
// glockenspiel (his music box, flat and wavering), harp, chimes (the ship's
// bell, rung in pairs), timpani, snare, bass drum, cymbals, gong, the ship's own
// timbers (shipTimbers) and the real sea (seaWaves). Nothing jumps out at you:
// every crash and gong is rolled or swelled into.
//
// 4/4 at 128, one step a 16th, so a bar is 1.875 seconds; the waltz bars (C and
// H) are 3/4 at half the speed, 24 steps, about 2.8 seconds. The intro plays
// once (4 bars, 7.5 s); then it loops from A, about 2m54s:
//
//   section  length          what happens
//   intro    4 bars  (once)  the ship's bell, rung in pairs; timbers creaking;
//                            a low tremolo C; one order on low brass; the snare
//                            rolls up into the march
//   A       16 bars  0:00    ORDERS (phase 1): THE HOOK, the shanty as his
//                            march, on horns and trombones over snare, bass
//                            drum, timpani and marching low strings; then
//                            trumpets and violins at pitch, the crew shouting
//                            it an octave down, tuba, the racing violins
//   B       16 bars  0:30    AYE, CAPTAIN: his orders on low brass, each echoed
//                            by a far trumpet, and the crew answering Eb D C,
//                            flat and dead; the orders climb (C, A flat, F, D
//                            flat) and the last answer sits wrong over G
//   C    8+2 bars    1:00    DAY 41: the march breaks down. The waltz: the
//                            shanty on his music box (true), then a ghost
//                            fiddle (wrong: the leap falls short), a rocking
//                            harp, the bass sinking C Bb Ab G; the timbers; the
//                            sea. Two bars of 4/4 creep back in under a snare
//                            roll
//   M       16 bars  1:26    MUTINY (phase 2, `musicFrom: 'M'`; the pivot, 49%
//                            in): up a semitone, C sharp minor; his orders,
//                            echoed, and nobody answers: two empty bars each
//                            time, the strings racing, the timbers groaning,
//                            the bell clanging; then the hook at full strength,
//                            desperate
//   H    8+2 bars    1:56    HEAVE TO (phase 3, `musicFrom: 'H'`): down a
//                            semitone into C minor, the deck dropping away; the
//                            hat comes off. The shanty's last two phrases in
//                            the waltz, big and sad: the whole choir, violins,
//                            violas, cellos, soft horns, the harp, the box, the
//                            bell rung in pairs, the sea; it stops on the B;
//                            then a long swell back into the march
//   F       17 bars  2:22    MAKE PORT: the hook at its fullest in C minor,
//                            the crew singing it with him this time, two
//                            octaves of them, the box in the band; at the very
//                            end the band stops on the B and, alone, the music
//                            box plays the last note, C: port, and it rings
//                            for a bar. Then he starts again, round to A
//
// Reference for the shape only: Toby Fox's boss themes (a new idea every 25
// to 35 seconds, the turn just before halfway, home before the loop) and the
// way "Salt in the Wound" grows its fight out of the chapter's own tunes.

const SONG = 'Still Under Way';
const BAR = 16;
const WALTZ = 24;   // a bar of the shanty, 3/4 at half speed
const sixteenths = (text) => melody(text, 1);
const slow = (text) => melody(text, 4);   // the shanty's 8ths as quarters: its own 3/4, half speed
const rest = (steps) => Array(steps).fill('.');
const up = transpose;
const fit = (name, section, steps) => fitSteps(SONG, name, section, steps);
const lay = (name, steps) => layOn(SONG, name, steps);
// The timpani, with any note below the lowest drum taken up an octave.
const timp = (names, pattern) => timpLow(names, pattern).map((n) => (typeof n === 'number' && n < 40 ? n + 12 : n));
// The choir can't sing above MIDI 83: anyone who can't reach drops an octave.
const reach = (steps) => steps.map((n) => (typeof n === 'number' && n > 83 ? n - 12 : n));
const DRUMS = new Set(['snare', 'roll', 'kick', 'crash', 'gong', 'swell', 'frame']);
// Every tuned track up `semis`; the drums (and the ship: timbers, the sea) left alone.
const UNTUNED = new Set([...DRUMS, 'creak', 'groan', 'waves']);
const keyUp = (section, semis) => Object.fromEntries(Object.entries(section).map(([k, v]) => [k, UNTUNED.has(k) ? v : up(v, semis)]));
// Low lines kept on the recordings: the basses no lower than E1, the tuba F1.
const floor = (steps, lowest) => steps.map((n) => (typeof n === 'number' && n < lowest ? n + 12 : n));
const stopAt = (steps, from) => [...steps.slice(0, from), ...rest(steps.length - from)];
const late = (steps, by) => [...rest(by), ...steps.slice(0, steps.length - by)];
const bell = (length, ...at) => dots(length, at.flatMap((s) => [[s, 'C5'], [s + 2, 'C5']]));

// --- THE HOOK: the shanty as his march (16ths, 16 to a bar) ---
const HOOK = sixteenths(`
  C5 - - C5 D5 - . .  Eb5 - - D5 C5 - . .  |  D5 - - - Bb4 - G4 -  - - - - . . G4 G4 |
  C5 - - C5 D5 - . .  Eb5 - - - C6 - - -   |  Bb5 - - Ab5 G5 - - - G5 - - - . . . . |
  C6 - - Bb5 Ab5 - . . Ab5 - G5 - F5 - . . |  Eb5 - F5 - G5 - - -  D5 - - - . . G4 G4 |
  C5 - - C5 D5 - . .  Eb5 - - D5 C5 - . .  |  Bb4 - D5 - B4 - - -  - - - - . . G4 G4 |
`);
// One chord to a half bar (the shanty's chords, a shanty bar each), ending on G:
// he never lets it come home.
const HOOK_CHORDS = 'Cm Ab Eb G Cm Ab Fm Eb Ab Fm Cm G Cm Ab G G';
// The last time (F), the band stops on the B; no pickup.
const HOOK_END = [...HOOK.slice(0, 7 * BAR), ...sixteenths('Bb4 - D5 - B4 - - - . . . . . . . .')];

// --- HIS ORDERS (a bar each), and the far trumpet echoing them ---
const ORDER = {
  Cm: 'G3 - - G3 C4 - - - G4 - - - - - - -',
  Ab: 'Ab3 - - Ab3 C4 - - - Eb4 - - - Ab4 - - -',
  Fm: 'C4 - - C4 F4 - - - Ab4 - - - C5 - - -',
  Db: 'Db4 - - Db4 F4 - - - Ab4 - - - Db5 - - -',
};
// Barked low: on the horns and trombones, an octave under where it's written.
const order = (key) => up(sixteenths(ORDER[key]), -12);
const ECHO = {
  Cm: '. . . . G4 - - G4 C5 - - - G5 - - -',
  Ab: '. . . . Ab4 - - Ab4 C5 - - - Eb5 - - -',
  Fm: '. . . . C5 - - C5 F5 - - - Ab5 - - -',
  G: '. . . . D5 - - D5 G5 - - - B5 - - -',
};
const echo = (key) => sixteenths(ECHO[key]);
// "Aye, Captain": two bars, flat.
const AYE = sixteenths('Eb4 - - - - - - - D4 - - - C4 - - -   - - - - - - - - - - - - . . . .');

// --- Patterns, half a bar each (8 steps) ---
// The low strings marching: DUM-da DUM-da, root then fifth.
const MARCH = [0, '-', '-', 0, 7, '-', '-', 0];
const STEP = [0, '-', '.', '.', 0, '-', '.', '.'];
const ROOTS = [0, '-', '-', '-', '.', '.', '.', '.'];
const RACE = [0, 7, 12, 'tenth', 12, 7, 'tenth', 7];
const T_HALF = [0, '.', '.', '.', '.', '.', '.', '.'];
const T_PUSH = [0, '.', '.', '.', '.', '.', 0, 0];
// Waltz patterns, a 24-step bar each: the harp rocking in (slow) 8ths.
const ROCK = [0, '-', '-', '-', 7, '-', '-', '-', 'tenth', '-', '-', '-', 12, '-', '-', '-', 'tenth', '-', '-', '-', 7, '-', '-', '-'];
const W_ONE = [0, ...Array(23).fill('.')];
const W_HEART = [0, '.', '.', '.', 0, ...Array(19).fill('.')];

// --- Drums, a bar each ---
const SNARE = hits('x..xx.x.x..xxxx.');
const SNARE_FILL = hits('x.x.x.x.xxxxxxxx');
const KICK = hits('x.......x.......');
const KICK_PUSH = hits('x.......x.....x.');
const ONE = hits('x...............');
const ROLL = hits('xxxxxxxxxxxxxxxx');
const ROLL_IN = hits('x...x...x.x.x.xx');
const ROLL_UP = hits('x.x.x.x.xxxxxxxx');

const bars = (n) => n * BAR;

// ----------------------------------------------------------------- intro
const intro = (() => {
  const t = lay('intro', bars(4));
  return fit('intro', {
    bell: bell(bars(4), 0, bars(2)),
    creak: dots(bars(4), [[0, 60], [bars(1) + 8, 61], [bars(2) + 4, 63], [bars(3), 60]]),
    lowTrem: [...hold('C3', bars(4) - 2), '.', '.'],
    hornsSoft: t([bars(2), sixteenths('G2 - - G2 C3 - - - G3 - - - - - - -')]),
    timpani: t([bars(2), timp('Cm', [0, ...rest(15)])], [bars(3), timp('G G', T_PUSH)]),
    roll: t([bars(2), ROLL_IN], [bars(3), ROLL_UP]),
    kick: t([bars(3) + 8, hits('x.......')]),
  }, bars(4));
})();

// ----------------------------------------------------- A: ORDERS (the hook)
const A = (() => {
  const t = lay('A', bars(16));
  const twice = `${HOOK_CHORDS} ${HOOK_CHORDS}`;
  return fit('A', {
    horns: up([...HOOK, ...HOOK], -24),
    trombone: up([...HOOK, ...HOOK], -24),
    violas: t([0, up(HOOK, -12)]),
    trumpets: t([bars(8), HOOK]),
    violins: t([bars(8), HOOK]),
    crew: t([bars(8), up(HOOK, -12)]),
    race: t([bars(8), arpeggio(HOOK_CHORDS, 8, 4, RACE)]),
    pound: chordLine(twice, MARCH, 2),
    basses: floor(chordLine(twice, STEP, 1), 28),
    tuba: floor(t([bars(8), chordLine(HOOK_CHORDS, ROOTS, 1)]), 29),
    timpani: timp(twice, T_HALF),
    snare: [...repeat(SNARE, 7), ...SNARE_FILL, ...repeat(SNARE, 7), ...SNARE_FILL],
    kick: repeat(KICK, 16),
    crash: t([bars(8), ONE]),
    bell: bell(bars(16), bars(8)),
  }, bars(16));
})();

// ------------------------------------------------------- B: AYE, CAPTAIN
const B = (() => {
  const t = lay('B', bars(16));
  const chords = 'Cm Cm Cm Cm Ab Ab Ab Ab Fm Fm Fm Fm Db G G G';
  const half = chords.split(' ').flatMap((c) => [c, c]).join(' ');
  return fit('B', {
    trombone: t([0, order('Cm')], [bars(4), order('Ab')], [bars(8), order('Fm')], [bars(12), order('Db')]),
    horns: t([0, order('Cm')], [bars(4), order('Ab')], [bars(8), order('Fm')], [bars(12), order('Db')]),
    trumpetEcho: t([bars(1), echo('Cm')], [bars(5), echo('Ab')], [bars(9), echo('Fm')], [bars(13), echo('G')]),
    aye: t([bars(2), AYE], [bars(6), AYE], [bars(10), AYE], [bars(14), AYE]),
    ayeLow: t([bars(2), up(AYE, -12)], [bars(6), up(AYE, -12)], [bars(10), up(AYE, -12)], [bars(14), up(AYE, -12)]),
    race: arpeggio(half, 8, 4, RACE),
    trem: sustained(chords, BAR, 2, 4),
    pound: chordLine(half, MARCH, 2),
    basses: floor(chordLine(half, STEP, 1), 28),
    tuba: floor(chordLine(chords, [...ROOTS, ...rest(8)], 1), 29),
    timpani: timp(half, T_HALF),
    snare: [...repeat(SNARE, 7), ...SNARE_FILL, ...repeat(SNARE, 7), ...SNARE_FILL],
    kick: repeat(KICK, 16),
    bell: bell(bars(16), 0, bars(8)),
    creak: dots(bars(16), [[bars(3), 60], [bars(7), 61], [bars(11), 60], [bars(15), 63]]),
  }, bars(16));
})();

// ------------------------------------------- C: DAY 41, the march breaks down
const C = (() => {
  const len = 8 * WALTZ + bars(2);
  const t = lay('C', len);
  const w = (n) => n * WALTZ;
  const chords = 'Cm Eb Ab G Cm Ab Fm G';
  const bass = 'C3 Bb2 Ab2 G2 C3 Ab2 F2 G2';
  const verse = slow(SHANTY[0]);                                  // the first phrase, true
  const wrong = slow(GHOST_FIRST.split(/\s{3}/).slice(4).join(' '));  // the second, misremembered
  return fit('C', {
    box: t([0, up(verse, 24)], [w(4), up(wrong, 24)]),
    fiddle: t([w(4), up(wrong, 12)]),
    harp: t([0, arpeggio(chords, WALTZ, 3, ROCK)]),
    cellos: t([0, bass.split(' ').flatMap((n) => hold(n, WALTZ))]),
    hum: t([0, sustained(chords, WALTZ, 1, 4)]),
    hornsSoft: t([w(4), sustained('Cm Ab Fm G', WALTZ, 0, 3)], [w(8), sixteenths('G2 - - G2 C3 - - - G3 - - - - - - -   - - - - - - - - . . . . . . . .')]),
    timpani: t([0, timp('C Bb Ab G C Ab F G', W_HEART)], [w(8), timp('G G G G', T_PUSH)]),
    bell: bell(len, 0, w(4)),
    creak: dots(len, [[w(1), 60], [w(3), 61], [w(5), 60], [w(7), 63]]),
    groan: dots(len, [[w(2), 65]]),
    waves: dots(len, [[0, 'C4'], [w(4), 'D4']]),
    roll: t([w(8), [...ROLL_IN, ...ROLL_UP]]),
    kick: t([w(8) + bars(1), hits('x.......x...x.x.')]),
  }, len);
})();

// --------------------------------------------- M: MUTINY (phase 2, the pivot)
// Written in C, then lifted a semitone into C sharp minor (keyUp).
const M = (() => {
  const t = lay('M', bars(16));
  const first = 'Cm Cm Cm Cm Fm Fm G G';
  const half = (s) => s.split(' ').flatMap((c) => [c, c]).join(' ');
  const allHalf = `${half(first)} ${HOOK_CHORDS}`;
  return fit('M', keyUp({
    // the orders, echoed, and nobody answering
    trombone: t([0, order('Cm')], [bars(4), order('Fm')], [bars(8), up(HOOK, -24)]),
    horns: t([0, order('Cm')], [bars(4), order('Fm')], [bars(8), up(HOOK, -24)]),
    trumpetEcho: t([bars(1), echo('Cm')], [bars(5), echo('Fm')]),
    // the mutiny brewing in the empty bars: tremolo a semitone apart
    trem: t([bars(2), hold('G4', bars(2))], [bars(6), hold('B4', bars(2))]),
    tremHigh: t([bars(2), hold('Ab4', bars(2))], [bars(6), hold('C5', bars(2))]),
    // then the hook, desperate, everyone
    trumpets: t([bars(8), HOOK]),
    violins: t([bars(8), HOOK]),
    crew: t([bars(8), up(HOOK, -12)]),
    race: arpeggio(allHalf, 8, 4, RACE),
    pound: chordLine(allHalf, MARCH, 2),
    basses: floor(chordLine(allHalf, STEP, 1), 28),
    tuba: floor(t([0, chordLine(half(first), ROOTS, 1)], [bars(8), chordLine(HOOK_CHORDS, ROOTS, 1)]), 29),
    timpani: [...timp(half(first).split(' ').slice(0, 12).join(' '), T_HALF), ...timp('G G G G', T_PUSH), ...timp(HOOK_CHORDS, T_HALF)],
    snare: [...repeat(SNARE, 7), ...SNARE_FILL, ...repeat(SNARE, 7), ...SNARE_FILL],
    roll: t([bars(6), [...ROLL_IN, ...ROLL_UP]]),
    kick: [...repeat(KICK, 6), ...repeat(KICK_PUSH, 2), ...repeat(KICK, 8)],
    crash: t([bars(8), ONE]),
    bell: bell(bars(16), bars(2), bars(3), bars(6), bars(7), bars(8)),
    creak: dots(bars(16), [[bars(2), 60], [bars(3) + 8, 61], [bars(6), 63], [bars(7) + 8, 60]]),
    groan: dots(bars(16), [[bars(2) + 4, 65], [bars(6) + 4, 66]]),
  }, 1), bars(16));
})();

// ----------------------------------------- H: HEAVE TO (phase 3), the waltz
const H = (() => {
  const len = 8 * WALTZ + bars(2);
  const t = lay('H', len);
  const w = (n) => n * WALTZ;
  const chords = 'Ab Fm Cm G Cm Ab G G';
  const tune = slow(`${SHANTY[2]}   ${NO_PORT}`);   // the last two phrases; it stops on the B
  const swellAt = len - 27;                          // the cymbal swell peaks on F's first beat (3.18 s)
  return fit('H', {
    choirBig: t([0, tune]),
    violins: t([0, up(tune, 12)]),
    violas: t([0, tune]),
    cellos: t([0, up(tune, -12)]),
    box: t([w(4), up(slow(NO_PORT), 24)]),
    harp: t([0, arpeggio(chords, WALTZ, 3, ROCK)]),
    hornsSoft: t([0, sustained(chords, WALTZ, 0, 3)], [w(8), up(sixteenths('G3 - - G3 B3 - - - D4 - - - G4 - - -   F4 - - - D4 - - - B3 - - - - - - -'), -12)]),
    hum: t([0, sustained(chords, WALTZ, 1, 4)]),
    lowHorn: t([0, 'Ab1 F2 C2 G1 C2 Ab1 G1 G1'.split(' ').flatMap((n) => hold(n, WALTZ))], [w(8), hold('G1', bars(2) - 2)]),
    timpani: t([0, timp('Ab F C G C Ab G G', W_HEART)]),
    timpRoll: t([w(8), timp('G G', [0, ...Array(15).fill('-')])]),
    bell: bell(len, 0, w(2), w(4), w(6)),
    creak: dots(len, [[w(1), 61], [w(3), 60], [w(5), 63], [w(7), 61]]),
    groan: dots(len, [[0, 65], [w(4), 66]]),
    waves: dots(len, [[0, 'E4'], [w(2), 'F4'], [w(4), 'G4'], [w(6), 'Eb4']]),
    pound: t([w(8), chordLine('G G G G', [0, '.', 0, '.', 0, '.', 0, 0], 2)]),
    roll: t([w(8), [...ROLL_IN, ...ROLL_UP]]),
    kick: t([w(8) + bars(1), hits('x.......x...x.x.')]),
    swell: t([swellAt, hold(60, 27)]),
  }, len);
})();

// --------------------------------------------------------- F: MAKE PORT
const F = (() => {
  const len = bars(17);
  const t = lay('F', len);
  const twice = `${HOOK_CHORDS} ${HOOK_CHORDS}`;
  const both = [...HOOK, ...HOOK_END];
  const BAND_STOP = bars(15) + 8;          // the band stops on the B
  // Each band part is the hook's 16 bars, cut at the B, then a bar of nothing.
  const band = (steps) => [...stopAt(steps, BAND_STOP), ...rest(BAR)];
  return fit('F', {
    trumpets: band(both),
    violins: band(both),
    horns: band(up(both, -24)),
    trombone: band(up(both, -24)),
    crew: band(up(both, -12)),
    crewHigh: band(reach([...rest(bars(8)), ...HOOK_END])),
    // and alone, flat, the box plays the last note: port
    box: t([bars(8), stopAt(up(HOOK_END, 12), bars(7) + 8)], [BAND_STOP, hold('C6', 8 + BAR - 2)]),
    race: band(arpeggio(twice, 8, 4, RACE)),
    choirBig: band(sustained(twice.split(' ').filter((_, i) => i % 2 === 0).join(' '), BAR, 2, 4)),
    pound: band(chordLine(twice, MARCH, 2)),
    basses: band(floor(chordLine(twice, STEP, 1), 28)),
    tuba: floor(band(chordLine(twice, ROOTS, 1)), 29),
    timpani: band(timp(twice, T_HALF)),
    snare: band([...repeat(SNARE, 7), ...SNARE_FILL, ...repeat(SNARE, 8)]),
    kick: band(repeat(KICK, 16)),
    crash: t([0, ONE], [bars(8), ONE]),
    gong: t([bars(8), ONE]),
    bell: bell(len, 0, bars(8), bars(16) + 4),
    hum: t([BAND_STOP, hold('C4', 8 + BAR - 2)]),
    humLow: t([BAND_STOP, hold('G3', 8 + BAR - 2)]),
  }, len);
})();

export const GHOST_CAPTAIN_BATTLE_THEME = {
  title: SONG,
  bpm: 128,
  stepsPerBeat: 4,
  // Level with the chapter's other big fights ("Salt in the Wound", the Dowager Crab's).
  volume: 1.15,

  instruments: {
    // brass: his voice
    trumpets: { ...ORCHESTRA.trumpets, volume: 0.3 },
    trumpetEcho: { sample: 'trumpet', volume: 0.13, release: 0.4, detune: -12, muffle: 2800, reverb: 0.85, pan: 0.45, echo: { time: 0.47, feedback: 0.35, mix: 0.35 } },
    horns: { ...ORCHESTRA.horns, volume: 0.38 },
    trombone: { ...ORCHESTRA.trombones, volume: 0.34 },
    tuba: { ...ORCHESTRA.tuba, volume: 0.34 },
    hornsSoft: { ...ORCHESTRA.hornsSoft, volume: 0.4 },
    lowHorn: { sample: 'hornsSoft', volume: 0.22, attack: 0.6, release: 1, reverb: 0.5 },
    // the crew: a gang of voices, a little flat; and the dead answer
    crew: { sample: 'choir', volume: 0.3, attack: 0.03, release: 0.25, detune: -10, drift: 10, reverb: 0.45, pan: -0.1, humanize: { time: 0.012, volume: 0.12 } },
    crewHigh: { sample: 'choir', volume: 0.2, attack: 0.03, release: 0.25, detune: -10, drift: 10, reverb: 0.5, pan: 0.15, humanize: { time: 0.012, volume: 0.12 } },
    aye: { sample: 'choir', volume: 0.3, attack: 0.18, release: 0.6, detune: -18, sag: 25, muffle: 2400, reverb: 0.65, pan: 0.1 },
    ayeLow: { sample: 'choir', volume: 0.22, attack: 0.18, release: 0.6, detune: -22, sag: 25, muffle: 1800, reverb: 0.65, pan: -0.15 },
    choirBig: { sample: 'choir', volume: 0.3, attack: 0.3, release: 0.9, detune: -6, reverb: 0.6, pan: 0.05 },
    hum: { sample: 'choir', volume: 0.13, attack: 0.6, release: 1.2, reverb: 0.7 },
    humLow: { sample: 'choir', volume: 0.1, attack: 0.6, release: 1.2, reverb: 0.7 },
    // strings
    violins: { ...ORCHESTRA.violins, volume: 0.28 },
    violas: { sample: 'violas', volume: 0.24, attack: 0.03, release: 0.35, reverb: 0.4, pan: -0.1 },
    race: { ...ORCHESTRA.race, volume: 0.28 },
    lowTrem: { sample: 'cellosTrem', volume: 0.18, attack: 1.2, release: 1, reverb: 0.5, pan: -0.2 },
    trem: { sample: 'violinsTrem', volume: 0.22, attack: 0.5, release: 0.8, reverb: 0.5, pan: 0.25 },
    tremHigh: { sample: 'violinsTrem', volume: 0.18, attack: 0.5, release: 0.8, detune: 10, reverb: 0.5, pan: -0.25 },
    cellos: { sample: 'cellos', volume: 0.2, attack: 0.2, release: 0.8, reverb: 0.45, pan: -0.25 },
    pound: { ...ORCHESTRA.pound, volume: 0.3 },
    basses: { ...ORCHESTRA.basses, volume: 0.34 },
    fiddle: { ...ORCHESTRA.soloViolin, volume: 0.36, attack: 0.08, release: 0.7, detune: -10, drift: 6, sag: 22, reverb: 0.6, humanize: { time: 0.012, volume: 0.1 } },
    // his music box: flat, wavering
    box: { sample: 'glock', volume: 0.3, ring: true, detune: -20, drift: 8, wow: { cents: 12, rate: 0.5 }, reverb: 0.6, pan: 0.2, echo: { time: 0.47, feedback: 0.25, mix: 0.2 } },
    harp: { sample: 'harp', volume: 0.24, ring: true, reverb: 0.5, pan: -0.25, humanize: { time: 0.01, volume: 0.15 } },
    // the ship
    bell: { sample: 'chimes', volume: 0.2, ring: true, reverb: 0.65, pan: 0.35 },
    creak: { sample: 'shipTimbers', volume: 0.6, ring: true, detune: -200, reverb: 0.4, pan: -0.35, humanize: { time: 0.03, volume: 0.25 } },
    groan: { sample: 'shipTimbers', volume: 0.45, ring: true, detune: -300, muffle: 2500, reverb: 0.5, pan: 0.3 },
    waves: { sample: 'seaWaves', volume: 0.12, ring: true, muffle: 900, reverb: 0.4, pan: 0.1 },
    // percussion
    timpani: { ...ORCHESTRA.timpani, volume: 0.48 },
    timpRoll: { ...ORCHESTRA.timpRoll, volume: 0.36 },
    snare: { ...ORCHESTRA.snare, volume: 0.3 },
    roll: { ...ORCHESTRA.roll, volume: 0.22 },
    kick: { ...ORCHESTRA.bassDrum, volume: 0.5 },
    crash: { ...ORCHESTRA.crash, volume: 0.32 },
    gong: { ...ORCHESTRA.gong, volume: 0.36 },
    swell: { ...ORCHESTRA.swell, volume: 0.32 },
  },

  sections: { intro, A, B, C, M, H, F },

  order: ['intro', 'A', 'B', 'C', 'M', 'H', 'F'],
  loopFrom: 1,
};
