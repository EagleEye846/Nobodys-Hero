import { melody, repeat, sustained, chordLine, arpeggio, transpose } from '../../audio/notation.js';
import { SHANTY, NO_PORT, GHOST_FIRST, SHANTY_CHORDS, fit as fitSteps, lay as layOn, dots, hold, voicings } from './parts/ghostShip.js';

// "Port Tomorrow": the song for every room of the ghost ship, the brig Fair
// Return, which went down on the Wreck Yard's bar a hundred years ago with all
// hands and has been sailing home ever since. Her crew are still aboard. They
// still answer "Aye, Captain". They still have the letters they meant to post.
// Nobody aboard knows they're dead except you.
//
// It is the saddest place in the chapter and the most frightening, and the
// two are the same thing: the fear is that nothing here will ever end. So the
// song is dread, never shock: nothing jumps, nothing slams, nothing is loud.
// Everything creeps, sags and goes flat.
//
// THE HOOK is the crew's own shanty, "Port Tomorrow" (parts/ghostShip.js): a
// homeward capstan song in 3/4, C minor, opening on the chapter's coast cell
// (G C C D, here as C - - C D: "PORT, to-mor-row"). You hear it first on a
// music box somewhere in the ship, the way a ghost would remember it: the box
// has gone flat and wavers like a warped cylinder (`detune`, `wow`), a second
// box a little sharp and a moment late smears every note, and from its second
// phrase on the notes start going missing and wrong (the leap up to home
// lands on B, a semitone short). THE RULE OF THE SHIP: the shanty never
// reaches its last note, the low C, "port". Every time, it stops on the B.
//
// THE SHIP: real timbers (the shipTimbers recordings) creak on the roll of
// the swell, once every two bars (six seconds, about the period of a real
// swell), and a loose knock in the hold falls on the first and third beats
// like a slow waltz nobody is dancing to. The sea hits the hull through the
// planks (seaWaves, muffled). Under it all, a low soft horn and a hummed C,
// tremolo violins up high and thin (as close to sul ponticello as the
// recordings go) against wine glasses rubbing a semitone apart, and bowed
// vibes holding a note that never quite changes.
//
// Sections (C minor; 3/4 at 60, one step a 16th, so a bar is 3 seconds). The
// intro plays once; then it loops from A, 52 bars, 2m36s:
//
//   intro   2 bars          the timbers, a wave on the hull, the drone and the
//                           hum coming in, a far ship's bell
//   A       8 bars  0:00    THE HOOK on the music box: the first phrase true,
//                           the second remembered wrong; a low harp on the
//                           roots, the creak and the knock
//   A1      8 bars  0:24    a ghost fiddler, far off and sagging flat at the
//                           ends of his notes, plays the last two phrases;
//                           pizzicato drips; it stops on the B. No port
//   list    8 bars  0:48    THE LIST (for the rooms where the ship heels over:
//                           start them here with `musicFrom: 'list'`): the
//                           bass sinks a semitone a bar, C B Bb A Ab G, the
//                           old lament; a low clarinet tries the hook and
//                           every note sinks as it holds; the timbers groan;
//                           the wrong chord (D flat) under a tritone
//   watch   8 bars  1:12    THE WATCH BELOW: anticipation. Pizzicato ticking
//                           like a clock, a heartbeat on the frame drum, a far
//                           horn calling G to C like a foghorn, far thunder,
//                           tremolo swelling; the music box tries the hook
//                           again and can't remember past the third note
//   crew   16 bars  1:36    THE CREW STILL WAITING: the whole shanty at last,
//                           sung by the crew a long way off, the box echoing
//                           them a beat behind, an oboe with them for the
//                           second half, the harp rocking, the soft strings;
//                           closest it ever gets. It reaches the B... and
//                           everything stops but the bell
//   tail    4 bars  2:24    the box, winding down, tries "port, to-" once,
//                           slower and slower; then it starts again
//
// Reference for the mood only: Luigi's Mansion's hum-along dread, Hollow
// Knight's Resting Grounds, the Wind Waker ghost ship, a music box left in an
// empty room.

const SONG = 'Port Tomorrow';
const BAR = 12;
const eighths = (text) => melody(text, 2);        // each token an 8th: 6 to a 3/4 bar
const rest = (bars) => Array(bars * BAR).fill('.');
const up = transpose;
const fit = (name, section, bars) => fitSteps(SONG, name, section, bars * BAR);
const lay = (name, bars) => layOn(SONG, name, bars * BAR);
const at = (bar, step = 0) => bar * BAR + step;
// A track `by` steps late (the second music box), the same length.
const late = (steps, by) => [...Array(by).fill('.'), ...steps.slice(0, steps.length - by)];
const chords = (from, to) => SHANTY_CHORDS.split(' ').slice(from, to).join(' ');

// --- The shanty ---
const PHRASE = SHANTY.map(eighths);                       // four phrases, 4 bars each
const GHOST = eighths(GHOST_FIRST);                       // phrases 1 and 2, misremembered
const LAST = eighths(NO_PORT);                            // phrase 4, stopping on the B
const BOX_A = [...PHRASE[0], ...GHOST.slice(4 * BAR)];    // true, then wrong

// --- The ship ---
// Every two bars: a creak as she rolls, a board shifting as she rolls back.
// The knock in the hold on beats 1 and 3.
const CREAK = dots(2 * BAR, [[0, 60], [at(1, 4), 61]]);
const BOARD = dots(2 * BAR, [[8, 63], [at(1, 10), 64]]);
const KNOCK = dots(BAR, [[0, 67], [8, 67]]);
const creaks = (bars) => repeat(CREAK, bars / 2);
const boards = (bars) => repeat(BOARD, bars / 2);
const knocks = (bars) => repeat(KNOCK, bars);
// The sea through the planks: a real wave, one of eight, every few bars.
const sea = (bars, every, notes, first = 0) => dots(bars * BAR, Array.from({ length: Math.ceil((bars - first) / every) }, (_, i) => [at(first + i * every), notes[i % notes.length]]));
// The ship's bell: two strokes close together, the way a watch is rung.
const bell = (bars, ...when) => dots(bars * BAR, when.flatMap(([bar, step = 0]) => [[at(bar, step), 'C5'], [at(bar, step + 2), 'C5']]));

// --- Patterns, a bar each ---
// The low harp: the root on the first beat, the fifth on the third.
const LOW = [0, '.', '.', '.', '.', '.', '.', '.', 7, '.', '.', '.'];
const ROOT = [0, ...Array(11).fill('.')];
// The harp rocking in 8ths (the crew): root, fifth, tenth, the twelfth, back.
const ROCK = [0, '-', 7, '-', 'tenth', '-', 19, '-', 'tenth', '-', 7, '-'];
// The clock in the watch below: plucked, on every beat.
const TICK = [0, '.', '.', '.', -5, '.', '.', '.', -5, '.', '.', '.'];

// The lament under the list: down a semitone a bar, to the wrong chord.
const LIST_BASS = 'C3 B2 Bb2 A2 Ab2 G2 Db3 G2';
const LIST_PADS = voicings('Eb4/G4/C5 D4/G4/B4 Eb4/G4/C5 C4/Eb4/F#4 C4/F4/Ab4 B3/D4/F4 Db4/F4/Ab4 B3/D4/G4', BAR);
const LIST_DRONE = 'C2 B1 Bb1 A1 Ab1 G1 Db2 G1';

const onBars = (names, pattern) => names.split(' ').flatMap((n) => pattern.map((p) => (typeof p === 'number' ? melody(n, 1)[0] + p : p)));
const heldBars = (names, bars = 1) => names.split(' ').flatMap((n) => hold(n, bars * BAR));

// ------------------------------------------------------------------ intro
const intro = fit('intro', {
  creak: creaks(2),
  board: boards(2),
  waves: dots(2 * BAR, [[0, 'D4']]),
  drone: [...hold('C2', 2 * BAR - 1), '.'],
  hum: [...rest(1), ...hold('C3', BAR - 1), '.'],
  shiver: [...rest(1), ...hold('D6', BAR - 1), '.'],
  bell: bell(2, [1, 0]),
}, 2);

// ---------------------------------------------- A: THE HOOK on the music box
const A = fit('A', {
  box: up(BOX_A, 24),
  boxGhost: late(up(BOX_A, 24), 1),
  harp: chordLine(chords(0, 8), LOW, 3),
  drone: [...hold('C2', 4 * BAR), ...hold('Ab1', 2 * BAR), ...hold('G1', 2 * BAR)],
  hum: [...hold('C3', 4 * BAR), ...hold('C3', 2 * BAR), ...hold('B2', 2 * BAR)],
  shiver: [...hold('D6', 4 * BAR), ...hold('Eb6', 4 * BAR - 1), '.'],
  air: [...rest(1), ...hold('G4', 3 * BAR), ...hold('Ab4', 2 * BAR), ...hold('G4', 2 * BAR - 1), '.'],
  creak: creaks(8),
  board: boards(8),
  knock: knocks(8),
  waves: sea(8, 4, ['C4', 'D4'], 2),
  bell: bell(8, [7, 6]),
}, 8);

// --------------------------------------- A1: the ghost fiddler, and no port
const A1 = (() => {
  const t = lay('A1', 8);
  const chordsA1 = 'Ab Fm Cm G Cm Ab G G';
  return fit('A1', {
    fiddle: up([...PHRASE[2], ...LAST], 12),
    box: t([at(7), up(eighths('. . B3 - - -'), 24)]),
    harp: [...chordLine(chordsA1.split(' ').slice(0, 7).join(' '), LOW, 3), ...onBars('G2', ROOT)],
    pizz: dots(8 * BAR, [[at(0, 10), 'Eb6'], [at(2, 6), 'C6'], [at(3, 9), 'D6'], [at(5, 2), 'Ab5'], [at(6, 8), 'G5']]),
    pad: sustained(chordsA1, BAR, 1, 4),
    padLow: sustained(chordsA1, BAR, 0, 4),
    drone: [...hold('Ab1', 2 * BAR), ...hold('C2', 2 * BAR), ...hold('C2', 3 * BAR), ...hold('G1', BAR)],
    choir: [...hold('C4', 4 * BAR), ...hold('Eb4', 3 * BAR), ...hold('D4', BAR)],
    glass: [...rest(4), ...hold('Eb5', 4 * BAR - 1), '.'],
    creak: creaks(8),
    board: boards(8),
    knock: [...knocks(7), ...rest(1)],
    waves: sea(8, 4, ['Eb4', 'C#4']),
    bell: bell(8, [7, 4]),
  }, 8);
})();

// --------------------------------------------------- list: the ship heels over
const list = (() => {
  const t = lay('list', 8);
  return fit('list', {
    clarinet: t(
      [0, eighths('C4 - - C4 D4 -   Eb4 - - - - .')],
      [at(4), eighths('C4 - - C4 Db4 -   C4 - - - - .')],
      [at(6), eighths('Ab3 - - - G3 -   G3 - - - - .')],
    ),
    box: t([at(2), up(eighths('D4 - . - G3 -   . . . . . .'), 24)]),
    harp: onBars(LIST_BASS, ROOT),
    padLow: LIST_PADS[0],
    pad: LIST_PADS[1],
    padHigh: LIST_PADS[2],
    drone: heldBars(LIST_DRONE),
    hum: heldBars('C3 B2 Bb2 A2 Ab2 G2 Ab2 G2'),
    glass: t([0, hold('D6', 4 * BAR - 2)], [at(4), hold('Eb5', 2 * BAR)], [at(6), hold('D6', 2 * BAR - 1)]),
    shiver: t([at(4), hold('Eb6', 2 * BAR)], [at(6), hold('D6', 2 * BAR - 1)]),
    air: t([0, hold('D5', 3 * BAR)], [at(4), hold('Eb5', 2 * BAR)], [at(6), hold('D5', 2 * BAR - 1)]),
    groan: dots(8 * BAR, [[0, 65], [at(4, 4), 66]]),
    creak: dots(8 * BAR, [[at(2, 4), 61], [at(6), 60]]),
    knock: dots(8 * BAR, [[0, 67], [at(2), 67], [at(4), 67], [at(6), 67], [at(7), 67]]),
    waves: sea(8, 2, ['F4', 'E4', 'G4', 'Eb4'], 1),
  }, 8);
})();

// --------------------------------------- watch: the watch below, waiting
const watch = (() => {
  const t = lay('watch', 8);
  const watchChords = 'Cm Cm Ab Ab Fm Fm G G';
  return fit('watch', {
    tick: chordLine(watchChords, TICK, 3),
    heart: repeat(dots(BAR, [[0, 'x'], [2, 'x']]), 8),
    horn: t([0, hold('G2', BAR)], [at(1), hold('C3', 2 * BAR - 2)], [at(4), hold('G2', BAR)], [at(5), hold('Db3', 2 * BAR - 2)]),
    box: t([at(4), up(eighths('C4 - - C4 . .   . . . . D4 -   . . . . . .   . . . . . .'), 24)]),
    boxGhost: late(t([at(4), up(eighths('C4 - - C4 . .   . . . . D4 -   . . . . . .   . . . . . .'), 24)]), 1),
    trem: t([0, sustained('Cm Cm', BAR, 1, 5)], [at(4), sustained('Fm Fm', BAR, 1, 5)], [at(6), sustained('G G', BAR, 2, 5)]),
    lowTrem: sustained(watchChords, BAR, 0, 3),
    choir: [...hold('C4', 2 * BAR), ...hold('Eb4', 2 * BAR), ...hold('F4', 2 * BAR), ...hold('D4', 2 * BAR - 1), '.'],
    drone: [...hold('C2', 4 * BAR), ...hold('Ab1', 2 * BAR), ...hold('G1', 2 * BAR - 1), '.'],
    thunder: t([0, hold('F#2', 2 * BAR)], [at(4), hold('Ab2', 2 * BAR)]),
    shiver: t([at(6), hold('D6', 2 * BAR - 1)]),
    creak: repeat(dots(BAR, [[0, 60], [6, 61]]), 8),
    board: boards(8),
    waves: sea(8, 2, ['D4', 'F4', 'C4', 'G4']),
    bell: bell(8, [3, 6], [7, 6]),
  }, 8);
})();

// ------------------------------------------ crew: the crew still waiting
const crew = (() => {
  const t = lay('crew', 16);
  const tune = [...PHRASE[0], ...PHRASE[1], ...PHRASE[2], ...LAST];
  // The box echoes the crew a beat behind, in the second and fourth phrases.
  const echo = t([at(4), late(up(PHRASE[1], 24), 4)], [at(12), late(up(LAST, 24), 4)]);
  return fit('crew', {
    crew: tune,
    oboe: t([at(8), up([...PHRASE[2], ...LAST], 12)]),
    box: echo,
    boxGhost: late(echo, 1),
    harp: [...arpeggio(chords(0, 15), BAR, 3, ROCK), ...onBars('G2', ROOT)],
    padLow: [...sustained(chords(0, 15), BAR, 0, 4), ...rest(1)],
    pad: [...sustained(chords(0, 15), BAR, 1, 4), ...rest(1)],
    violins: t([at(8), sustained(chords(8, 15), BAR, 2, 5)]),
    hum: [...sustained(chords(0, 15), BAR, 0, 3), ...hold('G2', BAR - 1), '.'],
    drone: [...hold('C2', 4 * BAR), ...hold('Ab1', 4 * BAR), ...hold('Ab1', 2 * BAR), ...hold('C2', 2 * BAR), ...hold('C2', 2 * BAR), ...hold('G1', 2 * BAR - 1), '.'],
    shiver: t([at(15), hold('D6', BAR - 1)]),
    air: t([at(12), hold('G4', 3 * BAR)]),
    creak: creaks(16),
    board: boards(16),
    knock: [...knocks(15), ...rest(1)],
    frame: [...repeat(dots(BAR, [[0, 'x']]), 15), ...rest(1)],
    tom: [...repeat(dots(4 * BAR, [[0, 'x']]), 3), ...rest(4)],
    waves: sea(16, 2, ['C4', 'D4', 'Eb4', 'C#4'], 1),
    bell: bell(16, [15, 4]),
  }, 16);
})();

// ------------------------------------------- tail: the box winding down
const tail = fit('tail', {
  box: dots(4 * BAR, [[0, 'C6'], [at(0, 10), 'C6'], [at(1, 9), 'D6'], [at(3), 'Eb6']]),
  boxSlow: dots(4 * BAR, [[at(3), 'Eb6']]),
  drone: [...hold('C2', 4 * BAR - 1), '.'],
  hum: [...hold('C3', 4 * BAR - 1), '.'],
  glass: [...hold('D6', 2 * BAR), ...hold('Eb5', 2 * BAR - 1), '.'],
  creak: creaks(4),
  board: boards(4),
  waves: dots(4 * BAR, [[at(1), 'C4']]),
}, 4);

export const GHOST_SHIP_THEME = {
  title: SONG,
  bpm: 60,
  stepsPerBeat: 4,
  // An area song: level with "Fog Bell" and "Under Her Ribs".
  volume: 1.13,

  instruments: {
    // The music box: flat, wavering, a little lost; and a second, sharp, a 16th late.
    box: { sample: 'glock', volume: 0.42, ring: true, detune: -22, drift: 8, wow: { cents: 14, rate: 0.55 }, reverb: 0.65, pan: 0.2, echo: { time: 0.75, feedback: 0.28, mix: 0.2 }, humanize: { time: 0.02, volume: 0.15 } },
    boxGhost: { sample: 'glock', volume: 0.15, ring: true, detune: 6, drift: 10, wow: { cents: 18, rate: 0.4 }, reverb: 0.75, pan: -0.35, muffle: 5000 },
    // In the tail, the last note of the box, sinking as the spring runs out.
    boxSlow: { sample: 'glock', volume: 0.14, ring: true, detune: -40, sag: 60, reverb: 0.8, pan: 0.2 },
    // The ghost fiddler: far off, the top taken off, every note sagging flat.
    fiddle: { sample: 'soloViolin', volume: 0.2, attack: 0.14, release: 0.9, detune: -10, drift: 6, sag: 28, muffle: 3200, reverb: 0.7, pan: -0.15, humanize: { time: 0.02, volume: 0.12 } },
    clarinet: { sample: 'clarinet', volume: 0.22, attack: 0.1, release: 0.8, sag: 35, muffle: 2600, reverb: 0.6, pan: -0.1, humanize: { time: 0.015, volume: 0.1 } },
    oboe: { sample: 'oboe', volume: 0.15, attack: 0.1, release: 0.7, detune: -8, drift: 5, reverb: 0.65, pan: 0.15, muffle: 3500, humanize: { time: 0.015, volume: 0.1 } },
    // The crew singing, a long way off, ragged and a little flat.
    crew: { sample: 'choir', volume: 0.17, attack: 0.15, release: 0.7, detune: -12, drift: 12, muffle: 2200, reverb: 0.8, pan: -0.05, humanize: { time: 0.03, volume: 0.12 } },
    choir: { sample: 'choir', volume: 0.08, attack: 1.4, release: 2, detune: -15, wow: { cents: 8, rate: 0.3 }, muffle: 1600, reverb: 0.85, pan: 0.1 },
    hum: { sample: 'choir', volume: 0.07, attack: 1.6, release: 2, muffle: 1100, reverb: 0.7, pan: -0.1 },
    // The low harp, and drips of pizzicato.
    harp: { sample: 'harp', volume: 0.17, ring: true, reverb: 0.5, pan: -0.2, humanize: { time: 0.012, volume: 0.15 } },
    pizz: { sample: 'violinsPizz', volume: 0.14, ring: true, reverb: 0.75, pan: 0.4, echo: { time: 0.5, feedback: 0.3, mix: 0.25 } },
    tick: { sample: 'cellosPizz', volume: 0.12, ring: true, muffle: 1100, reverb: 0.45, pan: -0.25, humanize: { time: 0.01, volume: 0.2 } },
    // Soft strings, far back, sul tasto.
    pad: { sample: 'violas', volume: 0.065, attack: 1.4, release: 1.8, muffle: 1400, reverb: 0.65, pan: 0.2 },
    padLow: { sample: 'violas', volume: 0.06, attack: 1.4, release: 1.8, muffle: 1100, reverb: 0.6, pan: -0.2 },
    padHigh: { sample: 'violins', volume: 0.04, attack: 1.6, release: 2, muffle: 2000, reverb: 0.7, pan: 0.3 },
    violins: { sample: 'violins', volume: 0.045, attack: 1.8, release: 2.2, muffle: 2400, reverb: 0.7, pan: 0.3 },
    // Thin and high, near the bridge; the glasses a semitone off it.
    shiver: { sample: 'violinsTrem', volume: 0.06, attack: 2.2, release: 2, detune: 8, reverb: 0.7, pan: 0.35 },
    trem: { sample: 'violinsTrem', volume: 0.07, attack: 2.5, release: 2, muffle: 3000, reverb: 0.7, pan: 0.3 },
    lowTrem: { sample: 'violasTrem', volume: 0.06, attack: 1.5, release: 1.5, muffle: 900, reverb: 0.55, pan: -0.25 },
    glass: { sample: 'glass', volume: 0.08, attack: 1.6, release: 2.4, reverb: 0.75, pan: -0.35, wow: { cents: 6, rate: 0.2 } },
    air: { sample: 'vibesBowed', volume: 0.07, attack: 1.2, release: 2, reverb: 0.75, pan: 0.1, echo: { time: 0.75, feedback: 0.25, mix: 0.2 } },
    // The drone: a soft horn and nothing else down there.
    drone: { sample: 'hornsSoft', volume: 0.14, attack: 2, release: 2.2, muffle: 520, reverb: 0.5 },
    horn: { sample: 'hornsSoft', volume: 0.3, attack: 0.8, release: 2, muffle: 900, reverb: 0.8, pan: -0.3, sag: 20 },
    thunder: { sample: 'timpaniRoll', volume: 0.12, attack: 1.5, release: 2, muffle: 420, reverb: 0.6, pan: 0.25 },
    // The ship: her timbers, the knock in the hold, the sea on the hull, her bell.
    creak: { sample: 'shipTimbers', volume: 0.4, ring: true, detune: -200, reverb: 0.4, pan: -0.3, humanize: { time: 0.04, volume: 0.25 } },
    board: { sample: 'shipTimbers', volume: 0.25, ring: true, detune: -300, muffle: 2500, reverb: 0.45, pan: 0.35, humanize: { time: 0.04, volume: 0.3 } },
    groan: { sample: 'shipTimbers', volume: 0.3, ring: true, detune: -300, muffle: 2200, reverb: 0.5, pan: 0.2 },
    knock: { sample: 'shipTimbers', volume: 0.26, ring: true, detune: -500, muffle: 1400, reverb: 0.35, pan: -0.05, humanize: { time: 0.012, volume: 0.3 } },
    waves: { sample: 'seaWaves', volume: 0.1, ring: true, muffle: 650, reverb: 0.35, pan: 0.1 },
    bell: { sample: 'chimes', volume: 0.08, ring: true, muffle: 2200, reverb: 0.8, pan: 0.4 },
    heart: { sample: 'frameDrum', drum: 'sample', volume: 0.09, ring: true, muffle: 600, reverb: 0.3, humanize: { time: 0.006, volume: 0.2 } },
    frame: { sample: 'frameDrum', drum: 'sample', volume: 0.06, ring: true, muffle: 800, reverb: 0.35 },
    tom: { sample: 'tom', drum: 'sample', volume: 0.08, ring: true, muffle: 700, reverb: 0.55, pan: -0.15 },
  },

  sections: { intro, A, A1, list, watch, crew, tail },

  order: ['intro', 'A', 'A1', 'list', 'watch', 'crew', 'tail'],
  loopFrom: 1,
};
