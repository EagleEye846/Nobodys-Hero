import { melody, chordLine, hits, repeat, transpose } from '../../audio/notation.js';
import { ORCHESTRA } from './parts/usurper.js';
import { fit as fitSteps, dots, hold } from './parts/ghostShip.js';

// "Nobody Said Fire": the fight song for the two boys of the Fair Return's
// crew, the DECKHAND (sixteen, still swabbing a deck that went down a hundred
// years ago, a letter in his pocket he never posted) and the POWDER MONKEY
// (ten or eleven, in a man's coat, still running powder to the guns and
// waiting for somebody to say "fire"). They are the only ordinary fights on
// the ghost ship (src/data/enemies/ghost_deckhand.js and powder_monkey.js ask
// for it by name).
//
// A dark pirate shanty, rowdy and fast: a dead crew stamping on a deck that
// isn't there any more, a wild fiddle on top. C minor, haunted, never cheery.
// Kept lean so the tune is always on top: the fiddle, one squeezebox, the
// bass, and the drums (boots on every beat, a bass drum, a snare on two and
// four, a bodhran). Sections change by what drops out and comes back.
//
// THE HOOK is a capstan chorus you can stamp to: "NO-bo-dy SAID it" (long,
// short short, long, long), sung on C minor, then again a step down on B
// flat, then C minor again, then a turn down onto the G chord. Then the big
// pull, two long notes a bar ("HEAVE... HO..." on A flat and B flat), the
// cell once more, and home. Eight bars, the same rhythm over and over. The
// first time the fiddle plays it plainly; the second time wild, with grace
// notes snapped onto every long note, turns, double-stops on the held notes,
// and the crew singing it under the fiddle an octave down.
//
// THE SHANTY, "Port Tomorrow" (parts/ghostShip.js), is the middle: the
// crew's slow 3/4 song re-barred into a stamping 4/4 march (each shanty bar
// squeezed into half a bar of 3-3-2, same pitches), the crew singing it over
// nothing but boots, bass and bodhran, the fiddle joining halfway. THE RULE OF
// THE SHIP holds: it stops on the B, a semitone short of the low C, "port".
// In the tail the crew's answer to the captain (Eb D C, "Aye, Captain")
// stops on the D.
//
// THE POWDER MONKEY'S BREAK: the hook at double speed as a fiddle reel,
// climbing Cm, Fm, A flat like guns being loaded, a bell for each; then the
// band hits the G chord "ready, ready, ready" and stops dead for a beat: the
// "fire" that nobody says.
//
// Real recordings: solo violin (the fiddle, and a second bow for the
// double-stops), clarinets (the squeezebox, two reeds a few cents apart),
// basses and cellos (spiccato), the game's choir (the crew), low horns under
// the crew in the payoff, toms (boots on the deck), bass drum, snare, frame
// drum (the bodhran), cymbals, timpani, chimes (the ship's bell),
// glockenspiel (the ship's music box, flat), the ship's timbers and the sea.
//
// C minor, 4/4 at 172; one step a 32nd (so the fiddle's grace notes can snap
// in), 32 to a bar, a bar about 1.4 seconds. The intro plays once (2 bars,
// 2.8 s); then it loops from A, 52 bars, 1m13s:
//
//   section  bars  time   what happens
//   intro    2     once   boots alone, the fiddle on a double-stop; then a
//                         wild run up into
//   A        16    0:00   THE HOOK, plain, on the fiddle over boots, bass
//                         drum, snare, bass and squeezebox; then again WILD,
//                         the crew singing it under, the bodhran in full
//   B        8     0:22   THE SHANTY: the crew sings it over boots, bass and
//                         bodhran only; the drums and the fiddle come back
//                         halfway. Stops on the B
//   C        8     0:33   THE POWDER MONKEY: the hook as a reel, climbing, a
//                         bell for each gun; "ready, ready, ready"; one silent
//                         beat
//   D        16    0:45   ALL HANDS: the hook wild, the crew and low horns
//                         under it, timpani and cymbals; the biggest it gets
//   E        4     1:07   THE TAIL: boots, the flat music box, the crew's
//                         "Aye..." stopping on the D; a snare fill into A
//
// Reference for the energy only: a rowdy capstan chorus, a ceili fiddle
// gone feral, Toby Fox's short punchy ordinary-battle loops.

const SONG = 'Nobody Said Fire';
const BAR = 32;
const e8 = (text) => melody(text, 4);      // each token an 8th (split it for grace notes)
const s16 = (text) => melody(text, 2);     // each token a 16th
const rest = (bars) => Array(bars * BAR).fill('.');
const up = transpose;
const fit = (name, section, bars) => fitSteps(SONG, name, section, bars * BAR);
// Bar and 16th → step.
const at = (bar, sixteenth = 0) => bar * BAR + sixteenth * 2;
// Patterns are written on a 16th grid; this stretches them to the 32nd grid.
const x2 = (steps) => steps.flatMap((s) => (typeof s === 'number' ? [s, '-'] : s === '-' ? ['-', '-'] : [s, '.']));
const beat = (pattern, bars) => x2(repeat(hits(pattern), bars));
const line = (chords, pattern16, octave) => x2(chordLine(chords, pattern16, octave));
// The basses' recordings start at E1: anything lower goes up an octave.
const deep = (steps) => steps.map((n) => (typeof n === 'number' && n < 28 ? n + 12 : n));
const once = (bars) => [...x2(hits('x')), ...Array(bars * BAR - 2).fill('.')];
const part = (chords, from, count) => chords.split(/\s+/).slice(from, from + count).join(' ');
// Stop dead for the last beat of the last bar: the silent beat.
const stopAt = (steps) => [...steps.slice(0, steps.length - BAR / 4), ...Array(BAR / 4).fill('.')];

// --- THE HOOK: "NO-bo-dy SAID it". One token an 8th. ---
const HOOK = e8(`
  C5 - C5 C5 G5 - Eb5 -      Bb4 - Bb4 Bb4 F5 - D5 -
  C5 - C5 C5 G5 - Eb5 -      Ab5 - G5 F5 Eb5 - D5 -
  C6 - - - Ab5 - - -         Bb5 - - - F5 - - -
  C5 - C5 C5 G5 - Eb5 -      G5 - F5 D5 C5 - - .
`);
// The same, played wild: a grace note snapped onto each long note, turns
// where it holds, a flick round the top.
const WILD = e8(`
  B4/C5/-/- - C5 C5 F#5/G5/-/- - Eb5 F5/Eb5/D5/Eb5
  A4/Bb4/-/- - Bb4 Bb4 E5/F5/-/- - D5 Eb5/D5/C5/D5
  B4/C5/-/- - C5 C5 F#5/G5/-/- - Eb5 F5/Eb5/D5/Eb5
  Ab5 - G5 F5 Eb5 F5/Eb5 D5 -
  B5/C6/-/- - - C6/Db6/C6/Bb5 Ab5 - - Ab5/G5/Ab5/Bb5
  A5/Bb5/-/- - - Bb5/C6/Bb5/A5 F5 - - G5/F5/Eb5/D5
  B4/C5/-/- - C5 C5 F#5/G5/-/- - Eb5 F5/Eb5/D5/Eb5
  G5 Ab5/G5 F5 D5 C5/G4/C5/- - - .
`);
// The second bow: double-stops under the hook's long notes.
const STOPS = e8(`
  . . . . C5 - . .     . . . . Bb4 - . .
  . . . . C5 - . .     C5 - . . G4 - B4 -
  Eb5 - - - C5 - - -   D5 - - - Bb4 - - -
  . . . . C5 - . .     B4 - . . G4 - - .
`);
const HOOK_CHORDS = 'Cm Bb Cm G Ab Bb Cm Cm';

// --- THE SHANTY re-barred: each 3/4 bar of "Port Tomorrow" squeezed into
// half a 4/4 bar of 3-3-2 (or 3-2-3). Same pitches, a march now. It stops
// on the B. 8 bars, one token a 16th. ---
const SHANTY_4 = s16(`
  C4 - - C4 - D4 - -    Eb4 - - D4 - C4 - -
  D4 - - Bb3 - G3 - -   G3 - - - - G3 - -
  C4 - - C4 - D4 - -    Eb4 - - - - C5 - -
  Bb4 - - Ab4 - G4 - -  G4 - - - - - . .
  C5 - - Bb4 - Ab4 - -  Ab4 - - G4 - F4 - -
  Eb4 - - F4 - G4 - -   D4 - - - - G3 - -
  C4 - - C4 - D4 - -    Eb4 - - D4 - C4 - -
  Bb3 - - D4 - B3 - -   - - - - - - . .
`);
// One chord a shanty bar; the last is G, not C minor: no port.
const SHANTY_CHORDS = 'Cm Ab Eb G Cm Ab Fm Eb Ab Fm Cm G Cm Ab G G';

// --- The powder monkey's reel: the hook's cell at double speed, then a
// run; moved up with the chord (Cm, Cm, Fm, Fm, Ab, Ab). ---
const REEL = s16('C5 - C5 C5 G5 - Eb5 - C5 Eb5 G5 C6 Bb5 G5 Eb5 D5');
const REEL_RIFF = [0, 0, 5, 5, 8, 8].flatMap((s) => up(REEL, s));
const BREAK_CHORDS = 'Cm Cm Fm Fm Ab Ab G G';
// "Ready, ready, ready": hits on G (16th grid), then the silent beat.
const READY = x2([
  0, '-', '.', 0, '-', '.', 0, '-', '.', '.', '.', '.', 0, '.', 0, '.',
  0, '-', '.', 0, '-', '.', 0, '-', '.', 0, '.', 0, '.', '.', '.', '.',
]);
const READY_HITS = READY.map((n) => (typeof n === 'number' ? 'x' : '.'));

// --- Patterns, a bar each, on the 16th grid ---
// The bass: 3-3-2, 3-3-2, like hauling on a rope.
const TRES = [0, '-', '.', 0, '-', '.', 0, '-', 0, '-', '.', 0, '-', '.', 7, '-'];
// The squeezebox, swaying: a long push on one and three.
const sway = (n) => [n, '-', '-', '-', '-', '.', n, '-', n, '-', '-', '-', '-', '.', n, '-'];

const KICK = 'x.......x.....x.';
const BOOTS = 'x...x...x...x...';
const SNARE = '....x.......x...';
const FILL = '....x...x.x.xxxx';
const BODHRAN = 'x.xxx.xxx.xxx.xx';
const BODHRAN_LITE = 'x.x.x.x.x.x.x.x.';
const ROLL = 'xxxxxxxxxxxxxxxx';

// --- The ship ---
const bell = (bars, ...when) => dots(bars * BAR, when.flatMap((bar) => [[at(bar), 'C5'], [at(bar, 3), 'C5']]));

// ------------------------------------------------------------------ intro
const intro = fit('intro', {
  boots: beat(BOOTS, 2),
  kick: [...rest(1), ...beat('x.......x.......', 1)],
  fiddle: [...hold('D5', BAR - 2), '.', '.', ...s16('G4 Ab4 B4 C5 D5 Eb5 F5 G5 Ab5 G5 F5 Eb5 D5 C5 B4 G4')],
  fiddle2: [...hold('G4', BAR - 2), '.', '.', ...rest(1)],
  creak: dots(2 * BAR, [[0, 60], [at(1, 8), 63]]),
  waves: dots(2 * BAR, [[0, 'D4']]),
}, 2);

// ---------------------------------------------------------- A: the hook
const A = fit('A', {
  fiddle: [...HOOK, ...WILD],
  fiddle2: [...rest(8), ...STOPS],
  crew: [...rest(8), ...up(HOOK, -12)],
  sqT: line(`${HOOK_CHORDS} ${HOOK_CHORDS}`, sway('third'), 3),
  sqF: line(`${HOOK_CHORDS} ${HOOK_CHORDS}`, sway(7), 3),
  basses: deep(line(`${HOOK_CHORDS} ${HOOK_CHORDS}`, TRES, 1)),
  pound: line(`${HOOK_CHORDS} ${HOOK_CHORDS}`, TRES, 2),
  kick: beat(KICK, 16),
  boots: beat(BOOTS, 16),
  snare: [...beat(SNARE, 7), ...x2(hits(FILL)), ...beat(SNARE, 7), ...x2(hits(FILL))],
  frame: [...beat(BODHRAN_LITE, 8), ...beat(BODHRAN, 8)],
  crash: [...once(8), ...once(8)],
}, 16);

// ------------------------------------------- B: the shanty, stamped
const B = fit('B', {
  crew: SHANTY_4,
  fiddle: [...rest(4), ...up(SHANTY_4.slice(at(4)), 12)],
  basses: deep(x2(chordLine(SHANTY_CHORDS, [0, '-', '.', 0, '-', '.', 7, '-'], 1))),
  pound: [...rest(4), ...x2(chordLine(part(SHANTY_CHORDS, 8, 8), [0, '-', '.', 0, '-', '.', 7, '-'], 2))],
  boots: beat(BOOTS, 8),
  kick: [...rest(4), ...beat(KICK, 4)],
  snare: [...rest(4), ...beat(SNARE, 3), ...x2(hits(FILL))],
  frame: [...beat(BODHRAN_LITE, 4), ...beat(BODHRAN, 4)],
  crash: [...rest(4), ...once(4)],
  creak: dots(8 * BAR, [[0, 61], [at(4), 64]]),
  waves: dots(8 * BAR, [[0, 'C4']]),
}, 8);

// ------------------------------------------ C: the powder monkey's break
const C = fit('C', {
  fiddle: stopAt([...REEL_RIFF, ...transpose(READY, 79)]),
  fiddle2: stopAt([...rest(6), ...transpose(READY, 71)]),
  brass: stopAt([...rest(6), ...transpose(READY, 43)]),
  basses: deep(stopAt([...line(part(BREAK_CHORDS, 0, 6), TRES, 1), ...transpose(READY, 31)])),
  pound: stopAt([...line(part(BREAK_CHORDS, 0, 6), TRES, 2), ...transpose(READY, 43)]),
  timpani: stopAt([...rest(6), ...transpose(READY, 43)]),
  kick: stopAt([...beat(KICK, 6), ...READY_HITS]),
  boots: stopAt([...beat(BOOTS, 6), ...READY_HITS]),
  snare: stopAt([...beat(SNARE, 4), ...beat(ROLL, 2), ...rest(2)]),
  frame: stopAt([...beat(BODHRAN, 6), ...rest(2)]),
  // A bell for each gun loaded.
  bell: bell(8, 0, 2, 4),
  crash: dots(8 * BAR, [[at(6), 'x']]),
}, 8);

// --------------------------------------------------- D: all hands
const D = fit('D', {
  impact: dots(16 * BAR, [[0, 'x'], [at(8), 'x']]),
  fiddle: [...WILD, ...WILD],
  fiddle2: [...STOPS, ...STOPS],
  crew: [...up(HOOK, -12), ...up(HOOK, -12)],
  brass: [...up(HOOK, -24), ...up(HOOK, -24)],
  sqT: line(`${HOOK_CHORDS} ${HOOK_CHORDS}`, sway('third'), 3),
  sqF: line(`${HOOK_CHORDS} ${HOOK_CHORDS}`, sway(7), 3),
  basses: deep(line(`${HOOK_CHORDS} ${HOOK_CHORDS}`, TRES, 1)),
  pound: line(`${HOOK_CHORDS} ${HOOK_CHORDS}`, TRES, 2),
  timpani: line(`${HOOK_CHORDS} ${HOOK_CHORDS}`, [0, '.', '.', '.', '.', '.', '.', '.', 0, '.', '.', '.', '.', '.', '.', '.'], 2).map((n) => (typeof n === 'number' ? 41 + ((n - 41) % 12 + 12) % 12 : n)),
  kick: beat(KICK, 16),
  boots: beat(BOOTS, 16),
  snare: [...beat(SNARE, 7), ...x2(hits(FILL)), ...beat(SNARE, 7), ...x2(hits(FILL))],
  frame: beat(BODHRAN, 16),
  crash: [...once(4), ...once(4), ...once(4), ...once(4)],
}, 16);

// --------------------------------------------------- E: the tail
const E = fit('E', {
  box: [...e8('C6 - - - G6 - - - F6 - D6 - C6 - - -'), ...rest(2)],
  // "Aye..." and it stops on the D.
  crew: [...rest(2), ...e8('Eb4 - - - D4 - - - - - - - . . . .')],
  basses: deep(line('Ab Ab G G', TRES, 1)),
  boots: beat(BOOTS, 4),
  kick: [...rest(3), ...beat(KICK, 1)],
  frame: [...rest(2), ...beat(BODHRAN_LITE, 2)],
  snare: [...rest(3), ...x2(hits(FILL))],
  creak: dots(4 * BAR, [[0, 62]]),
  bell: bell(4, 2),
}, 4);

export const GHOST_CREW_BATTLE_THEME = {
  title: SONG,
  bpm: 172,
  stepsPerBeat: 8,
  // Set to sit with the other chapter 5 fights (Cutlass Weather, No Bottom, Never Morning).
  volume: 1.1,

  instruments: {
    // The fiddle: out front, dry and bitten, a hair flat.
    fiddle: { sample: 'soloViolin', volume: 0.56, attack: 0.003, release: 0.08, detune: -6, reverb: 0.28, pan: 0.1, humanize: { time: 0.004, volume: 0.14 } },
    // The second bow, for the double-stops.
    fiddle2: { sample: 'soloViolin', volume: 0.3, attack: 0.003, release: 0.1, detune: 6, reverb: 0.3, pan: -0.05, humanize: { time: 0.004, volume: 0.12 } },
    // The squeezebox: two reeds a few cents apart, swaying.
    sqT: { sample: 'clarinet', volume: 0.12, attack: 0.02, release: 0.08, detune: -7, reverb: 0.3, pan: -0.3, humanize: { time: 0.004, volume: 0.1 } },
    sqF: { sample: 'clarinet', volume: 0.09, attack: 0.02, release: 0.08, detune: 9, reverb: 0.3, pan: -0.35, humanize: { time: 0.004, volume: 0.1 } },
    basses: { ...ORCHESTRA.basses, volume: 0.46 },
    pound: { ...ORCHESTRA.pound, volume: 0.3 },
    // The crew: dead men singing, a little flat.
    crew: { sample: 'choir', volume: 0.3, attack: 0.02, release: 0.2, detune: -10, drift: 8, reverb: 0.45, humanize: { time: 0.008, volume: 0.12 } },
    brass: { ...ORCHESTRA.horns, volume: 0.24, release: 0.12 },
    box: { sample: 'glock', volume: 0.22, ring: true, detune: -22, drift: 8, wow: { cents: 14, rate: 0.55 }, reverb: 0.6, pan: 0.2, echo: { time: 0.52, feedback: 0.3, mix: 0.25 } },
    // Drums: boots on the deck, a bass drum, a snare, the bodhran.
    boots: { sample: 'tom', drum: 'sample', volume: 0.5, ring: true, reverb: 0.18, humanize: { time: 0.003, volume: 0.15 } },
    kick: { ...ORCHESTRA.bassDrum, volume: 0.56, humanize: { time: 0.002, volume: 0.08 } },
    snare: { ...ORCHESTRA.snare, volume: 0.36 },
    frame: { sample: 'frameDrum', drum: 'sample', volume: 0.3, ring: true, reverb: 0.2, pan: 0.2, humanize: { time: 0.003, volume: 0.3 } },
    timpani: { ...ORCHESTRA.timpani, volume: 0.36 },
    crash: { ...ORCHESTRA.crash, volume: 0.24 },
    impact: { ...ORCHESTRA.impact, volume: 0.45 },
    // The ship: her timbers, the sea, her bell.
    creak: { sample: 'shipTimbers', volume: 0.3, ring: true, detune: -200, reverb: 0.4, pan: -0.3 },
    waves: { sample: 'seaWaves', volume: 0.14, ring: true, muffle: 1000, reverb: 0.35, pan: 0.1 },
    bell: { sample: 'chimes', volume: 0.13, ring: true, muffle: 2600, reverb: 0.6, pan: 0.35 },
  },

  sections: { intro, A, B, C, D, E },

  order: ['intro', 'A', 'B', 'C', 'D', 'E'],
  loopFrom: 1,
};
