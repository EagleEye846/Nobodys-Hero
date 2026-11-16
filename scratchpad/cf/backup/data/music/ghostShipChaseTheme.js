import { melody, repeat, hits, transpose } from '../../audio/notation.js';
import { SHANTY, NO_PORT, fit as fitSteps, lay as layOn, dots, hold } from './parts/ghostShip.js';

// "Nobody Leaves the Ship": for the chases on the ghost ship, when the crew
// (or the ship herself) comes after you. The same shanty as "Port Tomorrow"
// (ghostShipTheme.js, parts/ghostShip.js), but at a run: a fast, crooked
// waltz, one beat to a bar, the kind a dead fiddler plays for dancers who
// aren't there. Still dread rather than shock: no brass, no crashes, nothing
// that jumps out, only the speed and the circling.
//
// THE CIRCLE: spiccato violins go round and round the same six notes, C Eb G
// Eb C B (the B a semitone under home, the ship's own unfinished note), over
// a plucked bass on the first beat and the timbers knocking. In the climb the
// circle moves onto G and picks up an A flat (G B D B G Ab): the dominant
// with a flat ninth, the scariest chord in the key.
//
// THE TUNE: the ghost fiddler (a solo violin, flat and drifting) has the
// shanty at full speed, one shanty bar to a bar, with the music box two
// octaves over him. In the climb the shanty's first bar is pushed up the
// scale a step every two bars on violins and a low clarinet while the circle
// holds still, so the tune gets higher and tighter and the floor doesn't
// move. Then a break: the drums, the bell, a far choir, the fiddler's last
// phrase stopping on the B, and the circle winding up again.
//
// C minor, 3/4 at 168 (a bar is about 1.07 seconds), one step a 16th. The
// intro plays once; then it loops from A, 40 bars, about 43 seconds:
//
//   intro    2 bars         a creak, and the circle starting
//   A       16 bars  0:00   the shanty on the fiddler and the box, the circle,
//                           the plucked bass, the knocking
//   climb   16 bars  0:17   the shanty's first bar climbing a step every two
//                           bars over a C, then a G with the flat ninth; the
//                           frame drum and a far tom running
//   gasp     8 bars  0:34   the break: drums and bell, the far choir, the
//                           fiddler's last phrase stopping on the B; the
//                           circle winds back up into A

const SONG = 'Nobody Leaves the Ship';
const BAR = 12;
const eighths = (text) => melody(text, 2);
const rest = (bars) => Array(bars * BAR).fill('.');
const up = transpose;
const fit = (name, section, bars) => fitSteps(SONG, name, section, bars * BAR);
const lay = (name, bars) => layOn(SONG, name, bars * BAR);
const at = (bar, step = 0) => bar * BAR + step;

// --- The circle, a bar each (8ths) ---
const CIRCLE_C = eighths('C5 Eb5 G5 Eb5 C5 B4');
const CIRCLE_G = eighths('G4 B4 D5 B4 G4 Ab4');
// The plucked bass on the first beat, an answer on the third.
const BASS = (root, fifth) => [...melody(root, 1), ...Array(7).fill('.'), ...melody(fifth, 1), '.', '.', '.'];
const SHANTY_ROOTS = 'C3 Ab2 Eb3 G2 C3 Ab2 F2 Eb3 Ab2 F2 C3 G2 C3 Ab2 G2 C3'.split(' ');
const fifthOf = (n) => melody(n, 1)[0] + 7;
const plucks = (roots) => roots.flatMap((r) => [melody(r, 1)[0], ...Array(7).fill('.'), fifthOf(r), '.', '.', '.']);

// --- The tune ---
const TUNE = eighths(SHANTY.join('   '));         // 16 bars, one shanty bar a bar
const LAST = eighths(NO_PORT);                     // stops on the B
// The climb: the shanty's first two bars, a step higher every two bars.
const CLIMB = eighths(`
  C4 - - C4 D4 -   Eb4 - - D4 C4 -
  D4 - - D4 Eb4 -  F4 - - Eb4 D4 -
  Eb4 - - Eb4 F4 - G4 - - F4 Eb4 -
  F4 - - F4 G4 -   Ab4 - - G4 F4 -
  G4 - - G4 Ab4 -  B4 - - Ab4 G4 -
  Ab4 - - Ab4 B4 - C5 - - B4 Ab4 -
  B4 - - B4 C5 -   D5 - - C5 B4 -
  G4 - - - - -     G4 - - - G4 -
`);

// --- Drums, a bar each ---
const RUN = hits('x..x..x..x.x');
const RUN_SOFT = hits('x.....x.....');
const TOM = hits('x...........');
const KNOCK = dots(BAR, [[0, 67], [8, 67]]);

const intro = fit('intro', {
  creak: dots(2 * BAR, [[0, 60]]),
  circle: [...rest(1), ...CIRCLE_C],
  pluck: [...rest(1), ...BASS('C3', 'G3')],
}, 2);

const A = fit('A', {
  fiddle: TUNE,
  box: up(TUNE, 24),
  circle: repeat(CIRCLE_C, 16),
  pluck: plucks(SHANTY_ROOTS),
  harp: SHANTY_ROOTS.flatMap((r) => [melody(r, 1)[0], ...Array(11).fill('.')]),
  drone: [...hold('C2', 8 * BAR), ...hold('Ab1', 4 * BAR), ...hold('G1', 4 * BAR - 1), '.'],
  knock: repeat(KNOCK, 16),
  frame: repeat(RUN_SOFT, 16),
  creak: dots(16 * BAR, [[at(3), 60], [at(7, 6), 61], [at(11), 63], [at(15, 6), 60]]),
}, 16);

const climb = (() => {
  const t = lay('climb', 16);
  return fit('climb', {
    violins: up(CLIMB, 12),
    clarinet: CLIMB,
    box: t([at(14), up(eighths('G4 - - - - -   G4 - - - G4 -'), 24)]),
    circle: [...repeat(CIRCLE_C, 8), ...repeat(CIRCLE_G, 8)],
    pluck: [...repeat(BASS('C3', 'G3'), 8), ...repeat(BASS('G2', 'D3'), 8)],
    trem: [...hold('G5', 8 * BAR), ...hold('Ab5', 8 * BAR - 1), '.'],
    drone: [...hold('C2', 8 * BAR), ...hold('G1', 8 * BAR - 1), '.'],
    timpani: [...repeat(dots(BAR, [[0, 'C3']]), 8), ...repeat(dots(BAR, [[0, 'G2']]), 8)],
    frame: repeat(RUN, 16),
    tom: t([0, repeat(TOM, 16)]),
    knock: repeat(KNOCK, 16),
    creak: dots(16 * BAR, [[at(7), 61], [at(15), 63]]),
    groan: dots(16 * BAR, [[at(8), 65]]),
  }, 16);
})();

const gasp = (() => {
  const t = lay('gasp', 8);
  return fit('gasp', {
    fiddle: t([0, LAST]),
    choir: [...hold('C4', 4 * BAR), ...hold('B3', 4 * BAR - 1), '.'],
    choirHigh: [...hold('Eb4', 4 * BAR), ...hold('D4', 4 * BAR - 1), '.'],
    circle: t([at(4), [...repeat(dots(BAR, [[0, 'G4']]), 2), ...repeat(CIRCLE_G, 2)]]),
    pluck: [...repeat(BASS('C3', 'G3'), 4), ...repeat(BASS('G2', 'D3'), 4)],
    drone: [...hold('C2', 4 * BAR), ...hold('G1', 4 * BAR - 1), '.'],
    frame: [...repeat(RUN_SOFT, 4), ...repeat(RUN, 4)],
    tom: repeat(TOM, 8),
    bell: dots(8 * BAR, [[0, 'C5'], [2, 'C5'], [at(4), 'C5'], [at(4, 2), 'C5']]),
    waves: dots(8 * BAR, [[0, 'F4']]),
    groan: dots(8 * BAR, [[at(2), 66]]),
  }, 8);
})();

export const GHOST_SHIP_CHASE_THEME = {
  title: SONG,
  bpm: 168,
  stepsPerBeat: 4,
  volume: 0.85,

  instruments: {
    fiddle: { sample: 'soloViolin', volume: 0.3, attack: 0.02, release: 0.3, detune: -10, drift: 8, sag: 12, reverb: 0.5, pan: -0.1, humanize: { time: 0.01, volume: 0.12 } },
    box: { sample: 'glock', volume: 0.3, ring: true, detune: -20, drift: 8, wow: { cents: 12, rate: 0.6 }, reverb: 0.6, pan: 0.25, muffle: 6000 },
    violins: { sample: 'violins', volume: 0.16, attack: 0.03, release: 0.3, reverb: 0.5, pan: 0.25 },
    clarinet: { sample: 'clarinet', volume: 0.2, attack: 0.03, release: 0.3, reverb: 0.45, pan: -0.2 },
    circle: { sample: 'violinsSpic', volume: 0.15, release: 0.05, reverb: 0.4, pan: 0.3, humanize: { time: 0.006, volume: 0.2 } },
    pluck: { sample: 'cellosPizz', volume: 0.3, ring: true, reverb: 0.35, pan: -0.2, humanize: { time: 0.006, volume: 0.15 } },
    harp: { sample: 'harp', volume: 0.16, ring: true, reverb: 0.45, pan: -0.3 },
    trem: { sample: 'violinsTrem', volume: 0.06, attack: 1.5, release: 1, detune: 8, reverb: 0.6, pan: 0.35 },
    choir: { sample: 'choir', volume: 0.12, attack: 1, release: 1.5, detune: -12, muffle: 1800, reverb: 0.8 },
    choirHigh: { sample: 'choir', volume: 0.09, attack: 1, release: 1.5, detune: -16, muffle: 1800, reverb: 0.8, pan: 0.2 },
    drone: { sample: 'hornsSoft', volume: 0.14, attack: 1.5, release: 1.5, muffle: 520, reverb: 0.5 },
    timpani: { sample: 'timpani', volume: 0.28, ring: true, muffle: 1800, reverb: 0.4 },
    frame: { sample: 'frameDrum', drum: 'sample', volume: 0.13, ring: true, muffle: 2200, reverb: 0.3, humanize: { time: 0.005, volume: 0.25 } },
    tom: { sample: 'tom', drum: 'sample', volume: 0.12, ring: true, muffle: 900, reverb: 0.5, pan: -0.15 },
    knock: { sample: 'shipTimbers', volume: 0.22, ring: true, detune: -500, muffle: 1600, reverb: 0.35, humanize: { time: 0.008, volume: 0.3 } },
    creak: { sample: 'shipTimbers', volume: 0.35, ring: true, detune: -200, reverb: 0.4, pan: -0.3 },
    groan: { sample: 'shipTimbers', volume: 0.28, ring: true, detune: -300, muffle: 2200, reverb: 0.5, pan: 0.3 },
    bell: { sample: 'chimes', volume: 0.12, ring: true, muffle: 2400, reverb: 0.75, pan: 0.4 },
    waves: { sample: 'seaWaves', volume: 0.1, ring: true, muffle: 700, reverb: 0.35 },
  },

  sections: { intro, A, climb, gasp },
  order: ['intro', 'A', 'climb', 'gasp'],
  loopFrom: 1,
};
