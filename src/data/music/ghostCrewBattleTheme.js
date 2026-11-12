import { melody, chordLine, transpose } from '../../audio/notation.js';
import { SHANTY, NO_PORT, SHANTY_CHORDS, fit as fitSteps, lay as layOn, dots, hold } from './parts/ghostShip.js';

// "Still on Watch": the fight song for the two boys of the Fair Return's crew,
// the DECKHAND (sixteen, still swabbing a deck that went down a hundred years
// ago, a letter in his pocket he never posted) and the POWDER MONKEY (ten or
// eleven, in a man's coat, still running powder to the guns and waiting for
// somebody to say "fire"). They are the only ordinary fights on the ghost ship
// (src/data/enemies/ghost_deckhand.js and powder_monkey.js ask for it by name).
//
// They mean no harm. They're children a long way from home who don't know the
// voyage is over. So this isn't a fight song in the usual sense: it is small,
// slow and lonely, with a lot of air in it. No drums, no brass, nothing loud.
// One boy's whistle, one far fiddle, the sea on the hull, and a ship's bell
// nobody is ringing.
//
// THE TUNE is the crew's own shanty, "Port Tomorrow" (parts/ghostShip.js; the
// ship's song, ghostShipTheme.js, is built on it too): the homeward capstan
// song in 3/4, C minor, "PORT, to-mor-row". Here it's played the way a boy
// would play it alone on watch, on a tin whistle (the recorder recordings),
// plainly and correctly, with nobody singing along. And THE RULE OF THE SHIP
// still holds: the shanty never reaches its last note, the low C, "port". The
// fiddle gets to the B a semitone short of home and stops. When the whistle
// tries the crew's answer (Eb D C, "Aye, Captain"), it stops on the D: there's
// nobody left to say it to.
//
// The one warm moment (C, "home") is the shanty's leap up a sixth, Eb to the
// high C, played slowly on the ship's flat music box, with the harp rocking and
// the whistle holding long notes over it, in A flat and E flat major: what home
// sounded like. It turns a corner on D flat (the wrong chord, as everywhere on
// the ship) and sinks back.
//
// All real recordings: recorder (the whistle), solo violin (the fiddle),
// glockenspiel (the music box, flat and wavering), harp, violas, the game's
// choir (humming, muffled), soft horns (a low held C, very quiet), wine
// glasses, violin pizzicato, chimes (the ship's bell, two strokes for a
// watch), the ship's own timbers (shipTimbers) and the real sea (seaWaves).
//
// C minor (the shanty's own chords: Cm Ab Eb G...), with A flat and E flat
// major for home and D flat as the one wrong chord. 3/4 at 66, one step a
// 16th, so a bar is about 2.7 seconds. The intro plays once (2 bars, 5.5 s);
// then it loops from A, 36 bars, about 1m38s:
//
//   section  length          what happens
//   intro    2 bars  (once)  a wave on the hull, the ship's bell, a low hum
//   A        8 bars  0:00    THE WHISTLE, alone: the shanty's first two
//                            phrases, true, the harp only on the downbeats,
//                            the timbers creaking on the roll
//   B        8 bars  0:22    THE FIDDLE, a long way off on its low string: the
//                            last two phrases, and it stops on the B. No port.
//                            The whistle answers "Aye..." and can't finish
//   C        8 bars  0:44    HOME: the music box plays the leap up a sixth,
//                            twice, the harp rocks, soft violas, the whistle
//                            holds long notes over it; the D flat turns it
//                            back to G
//   D        8 bars  1:05    THE TWO OF THEM: the whistle plays the first
//                            phrase, the fiddle the last, a boy humming each
//                            an octave down; the whistle holds a high G over
//                            the end like a light on the horizon; stops on B
//   E        4 bars  1:27    THE EMPTY DECK: the sea, the bell, the whistle
//                            starts again ("PORT, to-mor-") and gives up
//
// Reference for the mood only: a tin whistle on a night watch, Hollow Knight's
// "Resting Grounds", Undertale's "Memory", the Wind Waker's empty sea.

const SONG = 'Still on Watch';
const BAR = 12;
const eighths = (text) => melody(text, 2);        // each token an 8th: 6 to a 3/4 bar
const rest = (bars) => Array(bars * BAR).fill('.');
const up = transpose;
const fit = (name, section, bars) => fitSteps(SONG, name, section, bars * BAR);
const lay = (name, bars) => layOn(SONG, name, bars * BAR);
const at = (bar, step = 0) => bar * BAR + step;
const chords = (from, to) => SHANTY_CHORDS.split(' ').slice(from, to).join(' ');
const heldBars = (names) => names.split(' ').flatMap((n) => hold(n, BAR));
// A track `by` steps late, the same length.
const late = (steps, by) => [...Array(by).fill('.'), ...steps.slice(0, steps.length - by)];

// --- The shanty ---
const PHRASE = SHANTY.map(eighths);                       // four phrases, 4 bars each
const LAST = eighths(NO_PORT);                            // phrase 4, stopping on the B

// --- The ship ---
// The sea on the hull: a real wave, one of eight, every few bars.
const sea = (bars, every, notes, first = 0) => dots(bars * BAR, Array.from({ length: Math.ceil((bars - first) / every) }, (_, i) => [at(first + i * every), notes[i % notes.length]]));
// The ship's bell: two strokes close together, the way a watch is rung.
const bell = (bars, ...when) => dots(bars * BAR, when.flatMap(([bar, step = 0]) => [[at(bar, step), 'C5'], [at(bar, step + 2), 'C5']]));
// A creak as she rolls, every four bars, and the board settling after.
const creaks = (bars) => dots(bars * BAR, Array.from({ length: bars / 4 }, (_, i) => [[at(i * 4 + 1), 60], [at(i * 4 + 3, 6), 61]]).flat());

// --- Patterns, a bar each ---
// The harp, sparse: the root on the first beat, a soft fifth on the third.
const LOW = [0, '.', '.', '.', '.', '.', '.', '.', 7, '.', '.', '.'];
// The harp rocking in 8ths (home): root, fifth, tenth, the twelfth, back.
const ROCK = [0, '-', 7, '-', 'tenth', '-', 19, '-', 'tenth', '-', 7, '-'];

// ------------------------------------------------------------------ intro
const intro = fit('intro', {
  waves: dots(2 * BAR, [[0, 'D4']]),
  bell: bell(2, [1, 0]),
  drone: [...rest(1), ...hold('C2', BAR - 1), '.'],
  hum: [...hold('C3', 2 * BAR - 1), '.'],
}, 2);

// --------------------------------------------------- A: the whistle, alone
const A = fit('A', {
  whistle: up([...PHRASE[0], ...PHRASE[1]], 12),
  harp: chordLine(chords(0, 8), LOW, 3),
  drone: [...hold('C2', 4 * BAR), ...hold('Ab1', 2 * BAR), ...hold('F2', BAR), ...hold('Eb2', BAR - 1), '.'],
  hum: [...hold('C3', 4 * BAR), ...hold('C3', 2 * BAR), ...hold('C3', 2 * BAR - 1), '.'],
  creak: creaks(8),
  waves: sea(8, 4, ['C4', 'E4'], 2),
  bell: bell(8, [7, 6]),
}, 8);

// ------------------------------------- B: the fiddle far off, and no port
const B = (() => {
  const t = lay('B', 8);
  const chordsB = 'Ab Fm Cm G Cm Ab G G';
  return fit('B', {
    fiddle: [...PHRASE[2], ...LAST],
    // "Aye..." and nothing after it.
    whistle: t([at(7), eighths('. . Eb5 - D5 -')]),
    harp: chordLine(chordsB, LOW, 3),
    pad: t([0, heldBars('Eb4 F4 Eb4 D4')]),
    drone: [...hold('Ab1', BAR), ...hold('F2', BAR), ...hold('C2', BAR), ...hold('G1', BAR), ...hold('C2', BAR), ...hold('Ab1', BAR), ...hold('G1', 2 * BAR - 1), '.'],
    glass: t([at(4), hold('Eb5', 4 * BAR - 1)]),
    pizz: dots(8 * BAR, [[at(1, 10), 'Eb6'], [at(3, 6), 'D6'], [at(6, 8), 'G5']]),
    creak: creaks(8),
    waves: sea(8, 4, ['F4', 'D4'], 1),
    bell: bell(8, [6, 6]),
  }, 8);
})();

// --------------------------------------------- C: home, on the music box
const C = (() => {
  const t = lay('C', 8);
  const chordsC = 'Ab Eb Ab Eb Fm Cm Db G';
  // The shanty's leap up a sixth, Eb to the high C, and down: the hope in it.
  const LEAP = eighths('Eb4 - - - C5 -   Bb4 - Ab4 - G4 -');
  return fit('C', {
    box: t([0, up(LEAP, 24)], [at(4), up(LEAP, 24)]),
    boxGhost: late(t([0, up(LEAP, 24)], [at(4), up(LEAP, 24)]), 1),
    whistle: t(
      [at(2), eighths('C6 - - - Bb5 -   G5 - - - - .')],
      [at(6), eighths('Ab5 - - - G5 -   F5 - - - D5 -')],
    ),
    harp: chordLine(chordsC, ROCK, 3),
    pad: heldBars('C4 Bb3 C4 Bb3 Ab3 G3 Ab3 G3'),
    padLow: heldBars('Ab3 G3 Ab3 G3 F3 Eb3 F3 D3'),
    drone: [...hold('Ab1', 2 * BAR), ...hold('Ab1', 2 * BAR), ...hold('F2', BAR), ...hold('C2', BAR), ...hold('Db2', BAR), ...hold('G1', BAR - 1), '.'],
    creak: creaks(8),
    waves: sea(8, 4, ['G4', 'Eb4'], 0),
  }, 8);
})();

// --------------------------------------------- D: the two of them
const D = (() => {
  const t = lay('D', 8);
  return fit('D', {
    whistle: t([0, up(PHRASE[0], 12)], [at(4), hold('G5', 3 * BAR - 1)]),
    fiddle: t([at(4), up(LAST.slice(0, 4 * BAR), 12)]),
    // A boy humming along, an octave down from each of them.
    hum: t([0, PHRASE[0]], [at(4), LAST]),
    harp: chordLine('Cm Ab Eb G Cm Ab G G', LOW, 3),
    pad: t([at(4), heldBars('Eb4 Eb4 D4 D4')]),
    drone: [...hold('C2', 2 * BAR), ...hold('Ab1', BAR), ...hold('Eb2', BAR), ...hold('C2', BAR), ...hold('Ab1', BAR), ...hold('G1', 2 * BAR - 1), '.'],
    glass: t([at(6), hold('D6', 2 * BAR - 1)]),
    pizz: dots(8 * BAR, [[at(2, 10), 'G5'], [at(7, 4), 'D6']]),
    creak: creaks(8),
    waves: sea(8, 4, ['C4', 'F4'], 2),
    bell: bell(8, [7, 6]),
  }, 8);
})();

// --------------------------------------------- E: the empty deck
const E = (() => {
  const t = lay('E', 4);
  return fit('E', {
    whistle: t([at(1), eighths('C5 - - C5 D5 -   . . . . . .')]),
    harp: dots(4 * BAR, [[0, 'C3'], [at(3), 'G2']]),
    drone: [...hold('C2', 3 * BAR), ...hold('G1', BAR - 1), '.'],
    hum: [...hold('C3', 3 * BAR), ...hold('B2', BAR - 1), '.'],
    glass: t([0, hold('D6', 3 * BAR)]),
    waves: dots(4 * BAR, [[0, 'E4'], [at(3), 'C4']]),
    bell: bell(4, [2, 0]),
  }, 4);
})();

export const GHOST_CREW_BATTLE_THEME = {
  title: SONG,
  bpm: 66,
  stepsPerBeat: 4,
  // Sparse, so it sits a little higher than the ship's song to land at the same loudness.
  volume: 1.3,

  instruments: {
    // The whistle: a boy on watch, plain and a little breathy, a long way off.
    whistle: { sample: 'recorder', volume: 0.3, attack: 0.06, release: 0.7, detune: -6, drift: 4, reverb: 0.7, pan: 0.15, echo: { time: 0.91, feedback: 0.22, mix: 0.18 }, humanize: { time: 0.02, volume: 0.12 } },
    // The fiddle: further off still, on its low string, sagging a little at the ends.
    fiddle: { sample: 'soloViolin', volume: 0.26, attack: 0.14, release: 1, detune: -8, drift: 5, sag: 14, muffle: 3800, reverb: 0.75, pan: -0.25, humanize: { time: 0.02, volume: 0.12 } },
    // The ship's music box, flat and wavering; and its echo, sharp and a 16th late.
    box: { sample: 'glock', volume: 0.32, ring: true, detune: -22, drift: 8, wow: { cents: 14, rate: 0.55 }, reverb: 0.7, pan: 0.2, echo: { time: 0.91, feedback: 0.25, mix: 0.2 } },
    boxGhost: { sample: 'glock', volume: 0.11, ring: true, detune: 6, drift: 10, wow: { cents: 18, rate: 0.4 }, reverb: 0.75, pan: -0.35, muffle: 5000 },
    // Humming, muffled, as if through a closed mouth.
    hum: { sample: 'choir', volume: 0.07, attack: 0.5, release: 1.4, detune: -10, muffle: 1000, reverb: 0.75, pan: -0.1 },
    harp: { sample: 'harp', volume: 0.16, ring: true, reverb: 0.6, pan: -0.2, humanize: { time: 0.012, volume: 0.15 } },
    pad: { sample: 'violas', volume: 0.055, attack: 1.4, release: 1.8, muffle: 1400, reverb: 0.7, pan: 0.2 },
    padLow: { sample: 'violas', volume: 0.05, attack: 1.4, release: 1.8, muffle: 1100, reverb: 0.65, pan: -0.2 },
    drone: { sample: 'hornsSoft', volume: 0.1, attack: 2, release: 2.2, muffle: 520, reverb: 0.55 },
    glass: { sample: 'glass', volume: 0.06, attack: 1.6, release: 2.4, reverb: 0.8, pan: -0.35, wow: { cents: 6, rate: 0.2 } },
    pizz: { sample: 'violinsPizz', volume: 0.1, ring: true, reverb: 0.8, pan: 0.4, echo: { time: 0.61, feedback: 0.3, mix: 0.25 } },
    // The ship: her timbers, the sea on the hull, her bell.
    creak: { sample: 'shipTimbers', volume: 0.26, ring: true, detune: -200, reverb: 0.45, pan: -0.3, humanize: { time: 0.04, volume: 0.25 } },
    waves: { sample: 'seaWaves', volume: 0.1, ring: true, muffle: 900, reverb: 0.4, pan: 0.1 },
    bell: { sample: 'chimes', volume: 0.07, ring: true, muffle: 2200, reverb: 0.85, pan: 0.4 },
  },

  sections: { intro, A, B, C, D, E },

  order: ['intro', 'A', 'B', 'C', 'D', 'E'],
  loopFrom: 1,
};
