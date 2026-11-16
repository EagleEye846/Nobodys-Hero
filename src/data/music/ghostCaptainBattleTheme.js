import { melody, hits, repeat, arpeggio, chordLine, sustained, transpose } from '../../audio/notation.js';
import { ORCHESTRA, timp, POUND, DIG, TAIKO } from './parts/usurper.js';
import { fit as fitSteps, lay as layOn, dots, hold } from './parts/ghostShip.js';

// "One More Tide": the fight with Captain Tarry, master of the brig Fair
// Return, in his cabin at the stern of the ghost ship. She went down on the bar
// a hundred years ago, the night the lighthouse went out, and he still hasn't
// admitted it. He still gives the orders, still promises the crew they'll make
// port tomorrow; he promised their mothers he'd bring them home. He is kind,
// tired, sorry and proud, and he is not the villain of anything. So the song is
// heroic and driving on top and grieving underneath, the way Toby Fox's
// "Heartache" and "ASGORE" are: a fight with someone you don't want to beat.
// (The old song, "Still Under Way", is kept in notes/music-backup-2026-11-14/.)
//
// HIS CALL (his own motif, new, and the hook): a quarterdeck bugle call on the
// trumpet, his voice. Dotted, like a march: C, G-C-Eb, up to G, falling F Eb;
// then the same a step down (D, Bb-D-F, Eb D); then up again to A flat... and
// it lands on B natural, a semitone short of home. That's THE RULE OF THE SHIP
// (parts/ghostShip.js): nothing aboard ever reaches the low C, "port". The
// answer phrase climbs higher and ends on G with a barked "G G", the next
// order. Hum it: "DUM, da-dum-dum DUM, dum-dum". It comes back as a march
// (ORDERS), on the music box at half speed (the log), shouted in pieces with
// nobody answering (MUTINY), as a slow hymn on a lone trumpet (HEAVE TO), and
// blared up a key in the climax.
//
// THE CREW'S SHANTY, "Port Tomorrow" (the ship's own song, ghostShipTheme.js):
// the tune the player has heard in every room of the ship, here re-barred
// from its slow 3/4 into his 4/4 march (each shanty bar one march bar, the lilt
// kept as long-short-long: "PORT - - to MOR-row"). The crew sing it; he barks
// his call into the gaps where they hold a note. It stops on the B, like it
// always does. Once, at the very end of the loop, it lands: C. Port. And then
// he starts again: one more tide.
//
// THE CREW'S ANSWER, "Aye, Captain" (Eb D C, the shanty's second bar), turns
// up twice in the HEAVE TO on an oboe, gently, and both times it stops short.
//
// C minor, with the ship's own chords (Cm Ab Eb G...); the Neapolitan D flat
// is the one borrowed chord, in the mutiny's second call. The mutiny jumps up a
// semitone to C sharp minor (the music box's last A flat is its way in), the
// heave falls back to C minor like a deck dropping away, and the climax goes
// up a whole step to D minor; the turn home slides down from D minor's A chord
// to A flat and G and lands in C.
//
// THE DECK TIPPING (HEAVE TO): the hymn is written in slow beats (half notes),
// and its bars alternate four beats and three, 4, 3, 4, 3: every other bar
// comes round a beat early, like a deck lurching under you. The timbers groan
// on each short bar; the low strings swell into every chord.
//
// All real recordings (VSCO 2 and VCSL): trumpets, horns, soft horns,
// trombones, tuba, violins, violas, cellos, spiccato strings, tremolo strings,
// solo violin (the ghost fiddle), oboe, harp, glockenspiel (his music box, flat
// and wavering), the game's choir (the crew), chimes (the ship's bell, rung in
// pairs), timpani, snare, bass drum, tenor drum, cymbals, gong, a cymbal swell,
// the ship's own timbers and the real sea.
//
// 4/4 at 144, one step a 16th, so a bar is 1.67 seconds. The intro plays once
// (6 bars, 10 s); then it loops from A, about 2m55s:
//
//   section  length   time   what happens
//   intro    6 bars   once   the ship's bell; timbers; a low tremolo C; the
//                            basses start the march ostinato; his call, far
//                            off through the speaking-trumpet; a roll in
//   A       16 bars   0:00   ORDERS (phase 1): HIS CALL on trumpets and horns
//                            over snare, bass drum, timpani, marching basses,
//                            tuba and trombone off-beats; then again with the
//                            violins and racing strings, climbing higher, and
//                            stopping on the B
//   B       16 bars   0:27   PORT TOMORROW: the crew sing their shanty as his
//                            march, violas and cellos with them; his trumpet
//                            answers in every gap; the violins and horns take
//                            it up; it stops on the B, and he gives one order
//                            into silence
//   C       12 bars   0:53   DAY 41 (the quiet drop): no drums. His call on
//                            the music box, half speed, over a rippling harp
//                            and a timpani heartbeat; then the ghost fiddle
//                            tries the shanty and gets the leap wrong; a swell
//                            and a roll
//   M       16 bars   1:13   MUTINY (phase 2, `musicFrom: 'M'`): up a semitone.
//                            Call and response with nobody: he calls, and the
//                            strings answer in a panic, four times, climbing
//                            (C# minor, D, F# minor, then a chromatic run);
//                            tremolo a semitone apart like a shaking blade;
//                            war drums in 3-3-2; then his whole call, with the
//                            violins and violas a beat and an 8th behind him,
//                            out of step
//   H     12 bars     1:40   HEAVE TO (phase 3, `musicFrom: 'H'`): down into
//            (35 s)          C minor, slow and broad, the bars lurching 4, 3,
//                            4, 3. The hat comes off: his call as a hymn on one
//                            trumpet, soft horns and a harp under it, the bell
//                            tolling; the oboe answers "Aye, Captain" and stops
//                            on the B; then the strings and the whole crew sing
//                            the hymn with him; a swell
//   F       16 bars   2:15   MAKE PORT (the climax): up a whole step, D minor.
//                            The shanty blared by trumpets, violins and the
//                            crew, the brass barking his call in the gaps; then
//                            his call at full strength, everyone, a gong
//   R        8 bars   2:42   ONE MORE TIDE (home): sliding down through A flat
//                            and G into C minor, the shanty's last phrase, and
//                            this once it lands on C, port, with the gong and
//                            the bell; then the music box alone starts his call
//                            again, a roll, "G G", and round to A
//
// Reference for the shape only: Toby Fox's boss themes (a new idea every 25
// to 35 seconds, the turn just before halfway, home before the loop), and the
// way "Salt in the Wound" grows its fight out of the chapter's own tunes.

const SONG = 'One More Tide';
const BAR = 16;
const s = (text) => melody(text, 1);
const rest = (steps) => Array(steps).fill('.');
const bars = (n) => n * BAR;
const up = transpose;
const fit = (name, section, steps) => fitSteps(SONG, name, section, steps);
const lay = (name, steps) => layOn(SONG, name, steps);
// Low lines kept on the recordings: the basses no lower than E1.
const floor = (steps, lowest) => steps.map((n) => (typeof n === 'number' && n < lowest ? n + 12 : n));
// The choir can't sing above MIDI 83: anyone who can't reach drops an octave.
const reach = (steps) => steps.map((n) => (typeof n === 'number' && n > 83 ? n - 12 : n));
// Each chord twice: one per half bar.
const half = (chords) => chords.split(/\s+/).filter(Boolean).flatMap((c) => [c, c]).join(' ');
const late = (steps, by) => [...rest(by), ...steps.slice(0, steps.length - by)];
// Half speed: every step twice as long.
const stretch = (steps) => steps.flatMap((n) => (typeof n === 'number' ? [n, '-'] : [n, n]));
// Notes dropped onto a track that already has something on it.
const over = (base, ...parts) => {
  const out = [...base];
  for (const [at, steps] of parts) steps.forEach((n, i) => { out[at + i] = n; });
  return out;
};
const bell = (length, ...at) => dots(length, at.flatMap((t) => [[t, 'C5'], [t + 2, 'C5']]));
// Every tuned track up `semis`; the drums and the ship left alone.
const UNTUNED = new Set(['snare', 'rim', 'roll', 'kick', 'taiko', 'crash', 'gong', 'swell', 'creak', 'groan', 'waves']);
const keyUp = (section, semis) => Object.fromEntries(Object.entries(section).map(([k, v]) => [k, UNTUNED.has(k) ? v : up(v, semis)]));
// The cymbal swell is loudest 3.18 s in: 31 steps at 144.
const SWELL = 31;

// --- HIS CALL (16ths, 16 to a bar): eight bars, the first half ending on the B ---
const CALL = s(`
  C5 - - G4 C5 - Eb5 - G5 - - - F5 - Eb5 -    |  D5 - - Bb4 D5 - F5 - Eb5 - - - D5 - - - |
  C5 - - G4 C5 - Eb5 - Ab5 - - - G5 - F5 -    |  Eb5 - - D5 Eb5 - F5 - B4 - - - . . G4 G4 |
  C5 - - G4 C5 - Eb5 - G5 - - - F5 - Eb5 -    |  D5 - - Bb4 D5 - F5 - Bb5 - - - Ab5 - G5 - |
  Ab5 - - G5 F5 - Eb5 - D5 - - Eb5 F5 - D5 -  |  G5 - - - - - - - G4 - - G4 G4 - . . |
`);
// One chord a half bar.
const CALL_CHORDS = 'Cm Cm Bb Eb Ab Fm Cm G Cm Cm Bb Eb Ab Bb G G';
// The second time: the first half, then it climbs to the high C and falls back to the B.
const CALL2 = [...CALL.slice(0, bars(4)), ...s(`
  C5 - - G4 C5 - Eb5 - G5 - - - C6 - Bb5 -    |  Ab5 - - G5 Ab5 - Bb5 - C6 - - - Bb5 - Ab5 - |
  G5 - - F5 Eb5 - D5 - Eb5 - - D5 C5 - D5 -   |  B4 - - - - - - - - - - - . . G4 G4 |
`)];
const CALL2_CHORDS = 'Cm Cm Bb Eb Ab Fm Cm G Cm Eb Fm Ab Cm G G G';

// --- THE SHANTY as his march: one shanty bar to a march bar, long-short-long ---
const SHANTY_BARS = [
  'C4 - - - - - C4 - D4 - - - - - - -', 'Eb4 - - - - - D4 - C4 - - - - - - -',
  'D4 - - - - - Bb3 - G3 - - - - - - -', 'G3 - - - - - - - - - - - G3 - - -',
  'C4 - - - - - C4 - D4 - - - - - - -', 'Eb4 - - - - - - - C5 - - - - - - -',
  'Bb4 - - - - - Ab4 - G4 - - - - - - -', 'G4 - - - - - - - - - - - - - . .',
  'C5 - - - - - Bb4 - Ab4 - - - - - - -', 'Ab4 - - - - - G4 - F4 - - - - - - -',
  'Eb4 - - - - - F4 - G4 - - - - - - -', 'D4 - - - - - - - - - - - G3 - - -',
  'C4 - - - - - C4 - D4 - - - - - - -', 'Eb4 - - - - - D4 - C4 - - - - - - -',
  'Bb3 - - - - - D4 - B3 - - - - - - -', 'C4 - - - - - - - - - - - - - . .',
];
const SH = (from, to) => s(SHANTY_BARS.slice(from, to).join(' '));
// His call barked into the shanty's held notes: on G, and on E flat.
const BARK_G = 'G4 - - D4 G4 - B4 - D5 - - -';
const BARK_EB = 'Eb5 - - Bb4 Eb5 - G5 - Bb5 - - -';

// --- Patterns, half a bar each (8 steps), as semitones above the chord ---
const MARCH_BASS = [0, '.', '.', 0, 7, '.', 12, '.'];
const STEP = [0, '-', '.', '.', 0, '-', '.', '.'];
const CELLO = [0, '.', 0, 0, 12, '.', 7, '.'];
const ROOTS = [0, '-', '-', '-', '.', '.', '.', '.'];
const STAB = ['.', '.', '.', '.', 0, '-', '.', '.'];
const STAB5 = ['.', '.', '.', '.', 7, '-', '.', '.'];
const RACE = [0, 7, 12, 'tenth', 12, 7, 'tenth', 7];
const T_HALF = [0, '.', '.', '.', '.', '.', '.', '.'];
const T_PUSH = [0, '.', '.', '.', '.', '.', 0, 0];
// A bar each.
const RIPPLE = [0, '-', 7, '-', 12, '-', 'tenth', '-', 19, '-', 'tenth', '-', 12, '-', 7, '-'];
const T_HEART = [0, '.', '.', 0, ...rest(12)];
const T_FRANTIC = [0, '.', '.', 0, '.', '.', 0, '.', 0, '.', '.', '.', 0, 0, 0, 0];
const TUBA_LONG = [0, '-', '-', '-', '-', '-', '.', '.', 0, '-', '-', '-', '.', '.', '.', '.'];

// --- Drums, a bar each ---
const SNARE = hits('x..xx.x.x..xx.xx');
const SNARE_LIGHT = hits('....x.......x.x.');
const FILL = hits('x.x.x.x.xxxxxxxx');
const KICK = hits('x.......x.......');
const KICK_DRIVE = hits('x.....x.x.......');
const ONE = hits('x...............');
const ROLL = hits('xxxxxxxxxxxxxxxx');
const ROLL_IN = hits('x...x...x.x.x.xx');
const ROLL_UP = hits('x.x.x.x.xxxxxxxx');

// ----------------------------------------------------------------- intro
const intro = (() => {
  const L = bars(6);
  const t = lay('intro', L);
  return fit('intro', {
    bell: bell(L, 0, bars(1)),
    creak: dots(L, [[0, 60], [bars(1) + 8, 61], [bars(3), 63], [bars(4) + 8, 60]]),
    groan: dots(L, [[bars(2), 65]]),
    waves: dots(L, [[0, 'C4']]),
    lowTrem: t([0, hold('C3', bars(4) - 2)]),
    basses: t([bars(2), floor(chordLine('Cm Cm Cm Cm Ab Ab G G', MARCH_BASS, 1), 28)]),
    pound: t([bars(3), chordLine('Cm Cm Ab Ab G G', CELLO, 2)]),
    // his voice, far off down the deck, through the speaking-trumpet
    trumpetFar: t([bars(2), CALL.slice(0, bars(2))]),
    horns: t([bars(5), s('G3 - - D3 G3 - B3 - D4 - - - . . G3 G3')]),
    trumpets: t([bars(5) + 14, s('G4 G4')]),
    timpani: t([bars(2), timp('C', [...T_HALF, ...rest(8)])], [bars(4), timp('Ab', [...T_HALF, ...rest(8)])], [bars(5), timp('G G', T_PUSH)]),
    roll: t([bars(4), ROLL_IN], [bars(5), ROLL_UP]),
    kick: t([bars(5) + 8, hits('x...x...')]),
  }, L);
})();

// ----------------------------------------------------- A: ORDERS (his call)
const A = (() => {
  const L = bars(16);
  const t = lay('A', L);
  const chords = `${CALL_CHORDS} ${CALL2_CHORDS}`;
  const tune = [...CALL, ...CALL2];
  return fit('A', {
    trumpets: tune,
    horns: up(tune, -24),
    violins: t([bars(8), CALL2]),
    trombone: t([bars(8), chordLine(CALL2_CHORDS, STAB, 3)]),
    hornsStab: t([bars(8), chordLine(CALL2_CHORDS, STAB5, 2)]),
    tuba: chordLine(chords, ROOTS, 2),
    basses: floor(chordLine(chords, MARCH_BASS, 1), 28),
    pound: t([0, chordLine(CALL_CHORDS, STEP, 2)], [bars(8), chordLine(CALL2_CHORDS, CELLO, 2)]),
    race: t([bars(8), arpeggio(CALL2_CHORDS, 8, 4, RACE)]),
    timpani: timp(chords, T_HALF),
    snare: [...repeat(SNARE, 7), ...FILL, ...repeat(SNARE, 7), ...FILL],
    kick: [...repeat(KICK, 8), ...repeat(KICK_DRIVE, 8)],
    crash: t([0, ONE], [bars(8), ONE]),
    bell: bell(L, bars(8)),
  }, L);
})();

// ------------------------------------------------------- B: PORT TOMORROW
const B = (() => {
  const L = bars(16);
  const t = lay('B', L);
  const tune = [...SH(0, 15), ...rest(BAR)];          // it stops on the B
  const chords = 'Cm Ab Eb G Cm Ab Fm Eb Ab Fm Cm G Cm Ab G G';
  const hc = half(chords);
  const band = (steps) => [...steps.slice(0, bars(15)), ...rest(BAR)];   // the last bar is his alone
  const second = (steps) => steps.slice(bars(8));
  return fit('B', {
    crew: tune,
    violas: tune,
    cellos: up(tune, -12),
    violins: t([bars(8), second(up(tune, 12))]),
    horns: t([bars(8), second(up(tune, -12))]),
    hornsSoft: t([0, sustained('Cm Ab Eb G Cm Ab Fm Eb', BAR, 1, 3)]),
    // his call into the gaps; then one order, and nobody answers
    trumpets: t([bars(3) + 2, s(BARK_G)], [bars(7) + 4, s(BARK_EB)], [bars(11) + 2, s(BARK_G)], [bars(15), s('G4 - - G4 C5 - - - - - - - . . . .')]),
    tuba: band(chordLine(hc, ROOTS, 2)),
    basses: band(floor(chordLine(hc, MARCH_BASS, 1), 28)),
    pound: t([bars(8), second(band(chordLine(hc, CELLO, 2)))]),
    race: t([bars(8), second(band(arpeggio(hc, 8, 4, RACE)))]),
    timpani: band(timp(hc, T_HALF)),
    rim: [...repeat(SNARE_LIGHT, 8), ...rest(bars(8))],
    snare: [...rest(bars(8)), ...repeat(SNARE, 6), ...FILL, ...rest(BAR)],
    kick: band(repeat(KICK, 16)),
    crash: t([bars(8), ONE]),
    bell: bell(L, 0, bars(15)),
    creak: dots(L, [[bars(4), 60], [bars(12), 61], [bars(15) + 8, 63]]),
  }, L);
})();

// ------------------------------------------------- C: DAY 41 (the quiet drop)
const C = (() => {
  const L = bars(12);
  const t = lay('C', L);
  const chords = 'Cm Cm Bb Eb Ab Fm Cm G Cm Ab Fm Ab';
  return fit('C', {
    // his call on the music box, half speed
    box: t([0, up(stretch(CALL.slice(0, bars(4))), 12)]),
    harp: arpeggio(chords, BAR, 3, RIPPLE),
    cellos: sustained(chords, BAR, 0, 2),
    hum: sustained(chords, BAR, 1, 4),
    hornsSoft: t([bars(4), sustained('Ab Fm Cm G', BAR, 2, 3)]),
    // the ghost fiddle tries the shanty, and the leap to home lands on B
    fiddle: t([bars(8), s(`
      C5 - - - - - . . D5 - - - - - - -   Eb5 - - - - - - - B5 - - - - - - -
      . . . . . . Ab5 - G5 - - - - - - -   Ab5 - - - - - - - - - - - . . . .
    `)]),
    timpSoft: t([0, timp('C C Bb Eb Ab F C G C Ab F', T_HEART)]),
    timpRoll: t([bars(11), timp('Ab', [0, ...Array(15).fill('-')])]),
    roll: t([bars(11), ROLL_UP]),
    kick: t([bars(11) + 8, hits('x...x.x.')]),
    swell: t([L - SWELL, hold(60, SWELL)]),
    bell: bell(L, 0, bars(8)),
    creak: dots(L, [[bars(1), 60], [bars(3), 61], [bars(5), 60], [bars(7), 63], [bars(9), 61]]),
    groan: dots(L, [[bars(2), 65], [bars(10), 66]]),
    waves: dots(L, [[0, 'C4'], [bars(4), 'D4'], [bars(8), 'Eb4']]),
  }, L);
})();

// --------------------------------------------- M: MUTINY (phase 2, the pivot)
// Written in C, then lifted a semitone into C sharp minor (keyUp).
const M = (() => {
  const L = bars(16);
  const t = lay('M', L);
  const calls = 'Cm Cm Db Db Fm Fm G G';          // a bar each
  const CALL_ON = {
    Cm: 'C5 - - G4 C5 - Eb5 - G5 - - - . . . .',
    Db: 'Db5 - - Ab4 Db5 - F5 - Ab5 - - - . . . .',
    Fm: 'F5 - - C5 F5 - Ab5 - C6 - - - . . . .',
    G: 'G4 - - D4 G4 - B4 - D5 - - - . . . .',
  };
  // nobody answers him but the strings, in a panic
  const ANSWER = {
    Cm: 'Eb5 D5 C5 B4 C5 D5 Eb5 F5 G5 F5 Eb5 D5 C5 B4 C5 -',
    Db: 'F5 Eb5 Db5 C5 Db5 Eb5 F5 G5 Ab5 G5 F5 Eb5 Db5 C5 Db5 -',
    Fm: 'Ab5 G5 F5 E5 F5 G5 Ab5 Bb5 C6 Bb5 Ab5 G5 F5 E5 F5 -',
    G: 'G4 Ab4 A4 Bb4 B4 C5 C#5 D5 Eb5 E5 F5 F#5 G5 - . .',
  };
  const callsAt = (fn) => ['Cm', 'Db', 'Fm', 'G'].map((k, i) => [bars(2 * i), fn(s(CALL_ON[k]))]);
  const half8 = half(calls);
  return fit('M', keyUp({
    trumpets: t(...callsAt((x) => x), [bars(7) + 14, s('G4 G4')], [bars(8), CALL]),
    horns: t(...callsAt((x) => up(x, -24)), [bars(8), up(CALL, -24)]),
    violins: t(...['Cm', 'Db', 'Fm', 'G'].map((k, i) => [bars(2 * i + 1), s(ANSWER[k])]), [bars(8), late(CALL, 4)]),
    violas: t([bars(8), up(late(CALL, 2), -12)]),
    // the blade shaking: tremolo a semitone apart under each call
    trem: t([0, hold('G4', 12)], [bars(2), hold('Ab4', 12)], [bars(4), hold('C5', 12)], [bars(6), hold('D5', 12)]),
    tremHigh: t([0, hold('Ab4', 12)], [bars(2), hold('A4', 12)], [bars(4), hold('Db5', 12)], [bars(6), hold('Eb5', 12)]),
    race: arpeggio(`${half8} ${CALL_CHORDS}`, 8, 4, RACE),
    pound: [...chordLine(calls, POUND, 2), ...chordLine(CALL_CHORDS, CELLO, 2)],
    basses: [...floor(chordLine(calls, DIG, 1), 28), ...floor(chordLine(CALL_CHORDS, MARCH_BASS, 1), 28)],
    tuba: [...chordLine(calls, TUBA_LONG, 2), ...chordLine(CALL_CHORDS, ROOTS, 2)],
    trombone: t([bars(8), chordLine(CALL_CHORDS, STAB, 3)]),
    hornsStab: t([bars(8), chordLine(CALL_CHORDS, STAB5, 2)]),
    timpani: [...timp(calls, T_FRANTIC), ...timp(CALL_CHORDS, T_HALF)],
    taiko: [...repeat(TAIKO, 8), ...rest(bars(8))],
    snare: [...[0, 1, 2, 3].flatMap(() => [...SNARE, ...ROLL]), ...repeat(SNARE, 7), ...FILL],
    kick: [...repeat(KICK, 8), ...repeat(KICK_DRIVE, 8)],
    crash: t([0, ONE], [bars(8), ONE]),
    bell: bell(L, bars(1), bars(3), bars(5), bars(7)),
    creak: dots(L, [[bars(1), 60], [bars(3) + 8, 61], [bars(5), 63], [bars(7) + 8, 60]]),
    groan: dots(L, [[bars(2), 65], [bars(6), 66]]),
  }, 1), L);
})();

// ----------------------------------- H: HEAVE TO (phase 3), the deck tipping
// Slow beats (8 steps, a half note at 144), bars of four and three in turn.
const H = (() => {
  const LENS = [32, 24, 32, 24, 32, 24, 32, 24, 32, 24, 32, 24];
  const L = LENS.reduce((a, b) => a + b, 0);
  const t = lay('H', L);
  const at = (bar) => LENS.slice(0, bar).reduce((a, b) => a + b, 0);
  const perBar = (names, fn) => names.split(/\s+/).flatMap((n, i) => fn(n, LENS[i]));
  const chords = 'Cm Cm Fm Gm Bb G Ab Fm Eb Cm Ab G';
  // his call as a hymn (a token a slow beat)
  const hymn = melody(`
    C5 - - G4 | C5 Eb5 G5 | F5 - Eb5 - | D5 - Bb4 | D5 F5 Eb5 - | D5 - - |
    C5 - - G4 | C5 Eb5 Ab5 | G5 - F5 - | Eb5 - D5 | Eb5 - F5 - | B4 - - |
  `, 8);
  const second = hymn.slice(at(6));
  // the harp rocks up through the chord in 8ths; a short bar ends high, and the next falls
  const ROCK = [0, '-', '-', '-', 7, '-', '-', '-', 12, '-', '-', '-', 'tenth', '-', '-', '-', 19, '-', '-', '-', 'tenth', '-', '-', '-', 12, '-', '-', '-', 7, '-', '-', '-'];
  return fit('H', {
    trumpetSolo: t([0, hymn.slice(0, at(6))], [at(10), hymn.slice(at(10))]),
    violins: t([at(6), second]),
    violas: t([at(6), up(second, -12)]),
    choirBig: t([at(6), second]),
    hornsSoft: perBar(chords, (c, n) => sustained(c, n, 1, 3)),
    hum: perBar(chords, (c, n) => sustained(c, n, 2, 3)),
    cellos: perBar('C3 Bb2 Ab2 G2 F2 G2 Ab2 F2 Eb2 C2 Ab2 G2', (note, n) => hold(note, n)),
    lowHorn: perBar('C2 Bb1 Ab1 G1 F1 G1 Ab1 F1 Eb2 C2 Ab1 G1', (note, n) => hold(note, n)),
    harp: perBar(chords, (c, n) => arpeggio(c, n, 3, ROCK.slice(0, n))),
    // "Aye, Captain", gently, and it never gets home
    oboe: t([at(5) + 8, s('Eb4 - - - - - - - D4 - - - B3 - - -')], [at(11), s('Eb4 - - - - - - - D4 - - - - - - - . . . . . . . .')]),
    timpSoft: perBar(chords, (c, n) => timp(c, [0, ...rest(n - 1)])),
    timpRoll: t([at(11), timp('G', [0, ...Array(23).fill('-')])]),
    bell: bell(L, 0, at(6)),
    groan: dots(L, LENS.map((n, i) => [at(i), i % 4 === 1 ? 65 : 66]).filter((_, i) => i % 2 === 1)),
    creak: dots(L, LENS.map((n, i) => [at(i) + 16, i % 4 === 0 ? 60 : 61]).filter((_, i) => i % 2 === 0)),
    waves: dots(L, [[0, 'E4'], [at(4), 'F4'], [at(8), 'Eb4']]),
    roll: t([L - BAR, ROLL_UP]),
    kick: t([L - 8, hits('x...x.x.')]),
    swell: t([L - SWELL, hold(60, SWELL)]),
  }, L);
})();

// ------------------------------------------- F: MAKE PORT (the climax, D minor)
// Written in C, then up a whole step (keyUp).
const F = (() => {
  const L = bars(16);
  const t = lay('F', L);
  const shanty = SH(0, 8);
  const hc = `${half('Cm Ab Eb G Cm Ab Fm Eb')} ${CALL2_CHORDS}`;
  return fit('F', keyUp({
    trumpets: [...up(shanty, 12), ...CALL2],
    violins: [...up(shanty, 12), ...CALL2],
    horns: [...up(shanty, -12), ...up(CALL2, -24)],
    violas: [...shanty, ...up(CALL2, -12)],
    cellos: sustained(`Cm Ab Eb G Cm Ab Fm Eb Cm Bb Ab Cm Cm Fm Cm G`, BAR, 0, 2),
    crew: [...shanty, ...up(CALL2, -12)],
    crewHigh: reach([...up(shanty, 12), ...rest(bars(8))]),
    choirBig: t([bars(8), sustained('Cm Bb Ab Cm Cm Fm Cm G', BAR, 0, 4)]),
    // his call barked into the shanty's gaps, by the low brass
    trombone: over(chordLine(hc, STAB, 3), [bars(3) + 2, s('G3 - - D3 G3 - B3 - D4 - - -')], [bars(7) + 4, s('Eb3 - - Bb2 Eb3 - G3 - Bb3 - - -')]),
    hornsStab: over(chordLine(hc, STAB5, 2), [bars(3) + 2, up(s(BARK_G), -12)], [bars(7) + 4, up(s(BARK_EB), -24)]),
    tuba: chordLine(hc, ROOTS, 2),
    basses: floor(chordLine(hc, MARCH_BASS, 1), 28),
    pound: chordLine(hc, CELLO, 2),
    race: arpeggio(hc, 8, 4, RACE),
    timpani: timp(hc, T_PUSH),
    snare: [...repeat(SNARE, 7), ...FILL, ...repeat(SNARE, 7), ...FILL],
    kick: repeat(KICK_DRIVE, 16),
    crash: t([0, ONE], [bars(4), ONE], [bars(8), ONE], [bars(12), ONE]),
    gong: t([bars(8), ONE]),
    bell: bell(L, 0, bars(8)),
  }, 2), L);
})();

// ----------------------------------------------- R: ONE MORE TIDE (home)
const R = (() => {
  const L = bars(8);
  const t = lay('R', L);
  const last = SH(12, 16);                              // the shanty's last phrase, and this time: port
  const march = half('Cm Ab G');
  const long = (note) => hold(note, BAR - 1);
  const ring = (note) => timp(note, [0, ...Array(15).fill('-')]);
  return fit('R', {
    trumpets: t([bars(2), up(last, 12)], [bars(7) + 14, s('G4 G4')]),
    violins: t([bars(2), up(last, 12)]),
    horns: t([0, long('C4')], [BAR, long('B3')], [bars(2), up(last, -12)]),
    crew: t([0, long('C4')], [BAR, long('B3')], [bars(2), last]),
    crewHigh: t([bars(2), reach(up(last, 12))]),
    trombone: t([0, long('Ab2')], [BAR, long('G2')], [bars(2), up(last, -12)]),
    tuba: t([0, long('Ab1')], [BAR, long('G1')], [bars(2), chordLine(half('Cm Ab G Cm'), ROOTS, 2)]),
    basses: t([bars(2), floor(chordLine(march, MARCH_BASS, 1), 28)]),
    cellos: t([bars(5), hold('C3', bars(2))]),
    pound: t([bars(2), chordLine(march, CELLO, 2)]),
    race: t([bars(2), arpeggio(march, 8, 4, RACE)]),
    trem: t([0, long('Eb5')], [BAR, long('D5')], [bars(5), hold('G4', bars(2) - 2)]),
    hum: t([bars(5), hold('C4', bars(3) - 2)]),
    humLow: t([bars(5), hold('G3', bars(2))]),
    // and alone, flat, the music box starts his call again
    box: t([bars(6), s('C6 - - G5 C6 - Eb6 - G6 - - - . . . .')]),
    timpRoll: t([0, ring('Ab')], [BAR, ring('G')]),
    timpani: t([bars(2), timp(march, T_HALF)], [bars(5), timp('C', [0, ...rest(15)])], [bars(7), timp('G G', T_PUSH)]),
    roll: t([BAR, ROLL_UP], [bars(7), ROLL_UP]),
    snare: t([bars(2), [...repeat(SNARE, 2), ...FILL]]),
    kick: t([bars(2), repeat(KICK, 3)], [bars(5), ONE], [bars(7) + 8, hits('x...x.x.')]),
    crash: t([bars(2), ONE], [bars(5), ONE]),
    gong: t([bars(5), ONE]),
    swell: t([bars(2) - SWELL, hold(60, SWELL)]),
    bell: bell(L, bars(5), bars(6)),
    waves: dots(L, [[bars(6), 'D4']]),
  }, L);
})();

export const GHOST_CAPTAIN_BATTLE_THEME = {
  title: SONG,
  bpm: 144,
  stepsPerBeat: 4,
  // Level with the chapter's other big fights ("Salt in the Wound", the Dowager Crab's).
  volume: 1.5,

  instruments: {
    // brass: his voice
    trumpets: { ...ORCHESTRA.trumpets, volume: 0.32 },
    trumpetFar: { sample: 'trumpet', volume: 0.16, release: 0.3, detune: -10, muffle: 2200, reverb: 0.85, pan: 0.4, echo: { time: 0.42, feedback: 0.35, mix: 0.35 } },
    // the hat off: the same voice, without the speaking-trumpet
    trumpetSolo: { sample: 'trumpet', volume: 0.3, attack: 0.08, release: 0.7, reverb: 0.62, pan: 0.05, humanize: { time: 0.015, volume: 0.1 } },
    horns: { ...ORCHESTRA.horns, volume: 0.36 },
    hornsStab: { ...ORCHESTRA.horns, volume: 0.2, pan: 0.2 },
    trombone: { ...ORCHESTRA.trombones, volume: 0.3 },
    tuba: { ...ORCHESTRA.tuba, volume: 0.32 },
    hornsSoft: { ...ORCHESTRA.hornsSoft, volume: 0.32 },
    lowHorn: { sample: 'tuba', volume: 0.2, attack: 0.5, release: 1, reverb: 0.5 },
    // the crew: a gang of voices, a little flat
    crew: { sample: 'choir', volume: 0.3, attack: 0.03, release: 0.25, detune: -10, drift: 10, reverb: 0.45, pan: -0.1, humanize: { time: 0.012, volume: 0.12 } },
    crewHigh: { sample: 'choir', volume: 0.2, attack: 0.03, release: 0.25, detune: -10, drift: 10, reverb: 0.5, pan: 0.15, humanize: { time: 0.012, volume: 0.12 } },
    choirBig: { sample: 'choir', volume: 0.28, attack: 0.3, release: 0.9, detune: -6, reverb: 0.6, pan: 0.05 },
    hum: { sample: 'choir', volume: 0.13, attack: 0.6, release: 1.2, reverb: 0.7 },
    humLow: { sample: 'choir', volume: 0.1, attack: 0.6, release: 1.2, reverb: 0.7 },
    // strings
    violins: { ...ORCHESTRA.violins, volume: 0.28 },
    violas: { sample: 'violas', volume: 0.24, attack: 0.03, release: 0.35, reverb: 0.4, pan: -0.1 },
    race: { ...ORCHESTRA.race, volume: 0.26 },
    lowTrem: { sample: 'cellosTrem', volume: 0.18, attack: 1.2, release: 1, reverb: 0.5, pan: -0.2 },
    trem: { sample: 'violinsTrem', volume: 0.2, attack: 0.3, release: 0.6, reverb: 0.5, pan: 0.25 },
    tremHigh: { sample: 'violinsTrem', volume: 0.16, attack: 0.3, release: 0.6, detune: 10, reverb: 0.5, pan: -0.25 },
    // the low strings swell into every chord (the deck rolling)
    cellos: { sample: 'cellos', volume: 0.22, attack: 0.45, release: 0.8, reverb: 0.45, pan: -0.25 },
    pound: { ...ORCHESTRA.pound, volume: 0.28 },
    basses: { ...ORCHESTRA.basses, volume: 0.34 },
    fiddle: { ...ORCHESTRA.soloViolin, volume: 0.34, attack: 0.08, release: 0.7, detune: -10, drift: 6, sag: 22, reverb: 0.6, humanize: { time: 0.012, volume: 0.1 } },
    oboe: { sample: 'oboe', volume: 0.3, attack: 0.1, release: 0.6, detune: -8, sag: 15, reverb: 0.6, pan: -0.2 },
    // his music box: flat, wavering
    box: { sample: 'glock', volume: 0.28, ring: true, detune: -20, drift: 8, wow: { cents: 12, rate: 0.5 }, reverb: 0.6, pan: 0.2, echo: { time: 0.42, feedback: 0.25, mix: 0.2 } },
    harp: { sample: 'harp', volume: 0.24, ring: true, reverb: 0.5, pan: -0.25, humanize: { time: 0.01, volume: 0.15 } },
    // the ship
    bell: { sample: 'chimes', volume: 0.2, ring: true, reverb: 0.65, pan: 0.35 },
    creak: { sample: 'shipTimbers', volume: 0.6, ring: true, detune: -200, reverb: 0.4, pan: -0.35, humanize: { time: 0.03, volume: 0.25 } },
    groan: { sample: 'shipTimbers', volume: 0.45, ring: true, detune: -300, muffle: 2500, reverb: 0.5, pan: 0.3 },
    waves: { sample: 'seaWaves', volume: 0.12, ring: true, muffle: 900, reverb: 0.4, pan: 0.1 },
    // percussion
    timpani: { ...ORCHESTRA.timpani, volume: 0.46 },
    timpSoft: { ...ORCHESTRA.timpani, volume: 0.26, reverb: 0.45 },
    timpRoll: { ...ORCHESTRA.timpRoll, volume: 0.34 },
    snare: { ...ORCHESTRA.snare, volume: 0.3 },
    rim: { ...ORCHESTRA.rim, volume: 0.26 },
    roll: { ...ORCHESTRA.roll, volume: 0.22 },
    taiko: { ...ORCHESTRA.taiko, volume: 0.42 },
    kick: { ...ORCHESTRA.bassDrum, volume: 0.5 },
    crash: { ...ORCHESTRA.crash, volume: 0.32 },
    gong: { ...ORCHESTRA.gong, volume: 0.36 },
    swell: { ...ORCHESTRA.swell, volume: 0.32 },
  },

  sections: { intro, A, B, C, M, H, F, R },

  order: ['intro', 'A', 'B', 'C', 'M', 'H', 'F', 'R'],
  loopFrom: 1,
};
