import {
  melody, hits, repeat, sustained, chordLine, rest as restBars, held, midi, cellIn,
  after as afterBars, until as untilBars, FIRST_STEPS_MINOR, BAR_44 as BAR,
} from './parts/chapter4.js';

// "Shift Change": the theme of the Diggings, the creature folk's mines, the
// stretch of Chapter 4 where the sunny welcome of Belowtown starts to wear
// thin. Mole miners, mine carts on their rails, lamps on hooks, seams of
// crystal, and a long way down. Industrious and a little ominous: the work
// goes on, the same pick strike over and over, and under it the tunnels
// get quieter and the lamps further apart. Still warm in places (miners
// sing, and somebody always brings a flask), so there's a tune to hum and a
// turn to the major that feels like the end of a shift. Written the way
// Christopher Larkin built Hollow Knight's busy, dangerous places (a
// small figure that never changes, with the bass moving under it so the same
// notes keep turning into new chords), with the Deltarune habit of a
// working-rhythm that is also a tune. Reference for the mood only: Hollow
// Knight's Crystal Peak and Greenpath, Undertale's Hotland.
//
// THE PICK STRIKE (the ostinato): E E B, E E E, in plucked low cellos, 3-3-2
// each half bar, with a wooden tick on each strike and a soft drum for the
// cart rattling over the joins in the rails. It never changes pitch while
// the chords move under it, so it is the tonic, the sixth, the ninth and
// the (wrong) major seventh in turn.
//
// THE CHAPTER'S TUNE (the "first cell", parts/chapter4.js): B E G F# here, in
// E minor, up a fourth, up a minor third, one step down: the minor form,
// the Hero came and... The first tune starts with it on the clarinet, low
// and woody (a bassoon would be right, there's no bassoon recording). In
// the middle it goes up in G major (the cell with its major third) on the
// oboe, hopeful. In the dark part it is played slowly and low on violas
// over a pedal E, and the harmony slips under it (E flat, F, B) until it is
// left hanging on a B.
//
// E minor, 100 BPM, one step a 16th note: a bar is 2.4 seconds. The pick
// strikes play alone to start with, once (2 bars, 4.8s); then it loops from
// A, 48 bars, about 1m55s:
//
//   intro   2 bars  the pick strike alone, a plucked bass, a far-off tick
//   A       8 bars  THE TUNE (the cell first), low clarinet over the strike
//                   and a plodding bass; a soft viola pad
//   B       8 bars  the climb: oboe in G major with the cell, violas
//                   answering, the cart rattling in, a soft drum on beats 1
//                   and 3
//   C       8 bars  the dark part: pedal E, the cell very slow on violas,
//                   E flat and F and B underneath, bells on the cell high
//                   above, the drums nearly gone
//   A2      8 bars  the tune again with everybody: clarinet and oboe, violins
//                   on the off-beats, a harp strumming, the cart and drum
//   D       8 bars  the end of the shift: G major, the miners' tune on
//                   flute and cellos in the cell's major form, harp, horn
//   E       8 bars  back to the dark: the cell on the viola once, tender,
//                   the strike thinning to its first notes, a held B

const rest = (bars) => restBars(bars, BAR);
const after = (bars, track) => afterBars(bars, track, BAR);
const until = (bars, track) => untilBars(bars, track, BAR);
const tune = (text) => melody(text, 2);     // each token an 8th
const quarters = (text) => melody(text, 4); // each token a quarter
const up = (steps, semitones) => steps.map((n) => (typeof n === 'number' ? n + semitones : n));
// Fails loudly if a section's tracks are not all the same, whole number of bars.
const tight = (name, section, bars) => {
  for (const [track, steps] of Object.entries(section)) {
    if (steps.length !== bars * BAR) throw new Error(`Shift Change ${name}: '${track}' is ${steps.length} steps, not ${bars} bars`);
  }
  return section;
};

// --- The harmony, a bar each. ---
const A_CHORDS = 'Em Em C D Em Am D Em';
const B_CHORDS = 'G D Em C G D C B';
const C_CHORDS = 'Em Em Em Eb Em Em F B';
const D_CHORDS = 'G D Em Bm C G Am D';

// --- THE PICK STRIKE: the same notes whatever the chord. ---
const [E3, B3, E4] = [midi('E3'), midi('B3'), midi('E4')];
const PICK = [E3, '.', '.', E3, '.', '.', B3, '.', E3, '.', '.', E3, '.', '.', E4, '.'];
const PICK_THIN = [E3, ...Array(15).fill('.')];
// The strike on the end of the shift: two to the bar, easy.
const PICK_LIGHT = [E3, '.', '.', '.', '.', '.', B3, '.', E3, '.', '.', '.', '.', '.', '.', '.'];
const TICK = hits('x..x..x.x..x..x.');
const TICK_SOFT = hits('x.....x.x.......');
// The cart over the joins: a rattle after beat 2.
const CART = hits('....x.x.x.x.....');
const CART_OFF = hits('..x...x...x...x.');
const DRUM = hits('x.......x.......');
const DRUM_HEART = hits('x.....x.........');

// --- The walking bass: a root, the fifth, the octave, the fifth. ---
const PLOD = [0, '-', '-', '-', 7, '-', '-', '-', 12, '-', '-', '-', 7, '-', '-', '-'];
const PEDAL = [0, ...Array(15).fill('-')];
const STRUM = [0, '.', 7, '.', 'tenth', '.', 12, '.', 0, '.', 7, '.', 'tenth', '.', 12, '.'];

// --- THE TUNE, E minor: the cell (B E G F#), its answer, and on. ---
const TUNE_A = tune(`
  B4 - E5 - G5 - F#5 - | E5 - - - B4 - . . | C5 - E5 - D5 - C5 - | D5 - F#5 - A5 - - - |
  G5 - F#5 - E5 - G5 - | A5 - - G5 E5 - C5 - | D5 - F#5 - E5 - D5 - | E5 - - - . . . . |
`);
// The climb, G major, on the oboe: the cell with its major third.
const TUNE_B = tune(`
  D5 - G5 - B5 - A5 - | A5 - F#5 - D5 - . . | E5 - G5 - B5 - G5 - | E5 - G5 - C6 - B5 - |
  D5 - G5 - B5 - A5 - | A5 - F#5 - A5 - D6 - | C6 - B5 - A5 - G5 - | F#5 - - - D#5 - . . |
`);
// The violas answer the climb on the off bars with the cell, low.
const ANSWER_B = tune(`
  . . . . . . . . | B3 - E4 - G4 - F#4 - | . . . . . . . . | B3 - E4 - G4 - F#4 - |
  . . . . . . . . | B3 - E4 - G4 - F#4 - | . . . . . . . . | B3 - - - . . . . |
`);
// The dark part: the cell, very slow and low (a half note a note), over a
// pedal E. Under the E flat the G is its major third; under the F the A is
// its own third; B hangs.
const TUNE_C = quarters(`
  B3 - E4 - | G4 - F#4 - | B3 - E4 - | G4 - F4 - |
  B3 - E4 - | G4 - A4 - | A4 - C5 - | B4 - - - |
`);
// The miners' tune, G major, the cell's major form first (D G B A).
const TUNE_D = tune(`
  D5 - - G5 B5 - - A5 | A5 - F#5 - D5 - - - | G5 - B5 - E6 - D6 - | B5 - - - D6 - B5 - |
  C6 - B5 - A5 - G5 - | B5 - - - D6 - - - | C6 - B5 - A5 - E5 - | F#5 - - - A5 - - - |
`);
// The tender cell, once, in the last part (E minor, an octave up).
const TUNE_E = quarters(`
  B4 - - - | E5 - - - | G5 - - - | F#5 - - - |
  . . . . | . . . . | . . . . | . . . . |
`);
// Bells on the cell, very high, twice in the dark part.
const [b0, b1, b2, b3] = cellIn('E6', FIRST_STEPS_MINOR);
const BELLS_CELL = [b0, '.', '.', '.', b1, '.', '.', '.', b2, '.', '.', '.', b3, ...Array(3).fill('.')];

// What every section has under it: the strike, the tick, and the cart.
const work = (bars, { tick = TICK, cart = null, pick = PICK } = {}) => ({
  pick: repeat(pick, bars),
  tick: repeat(tick, bars),
  ...(cart ? { cart: repeat(cart, bars) } : {}),
});

export const DIGGINGS_THEME = {
  title: 'Shift Change',
  bpm: 100,
  stepsPerBeat: 4,
  // An area theme.
  volume: 0.55,

  instruments: {
    // The pick strike: plucked low cellos, short.
    pick: { sample: 'cellosPizz', volume: 0.5, release: 0.12, reverb: 0.25, pan: -0.1, humanize: { time: 0.005, volume: 0.12 } },
    // The tune's voices. The clarinet down low is the woody, bassoon-ish one.
    clarinet: { sample: 'clarinet', volume: 0.46, attack: 0.04, release: 0.3, reverb: 0.35, pan: -0.15, humanize: { time: 0.008, volume: 0.1 } },
    oboe: { sample: 'oboe', volume: 0.3, attack: 0.04, release: 0.3, reverb: 0.35, pan: 0.15, humanize: { time: 0.008, volume: 0.1 } },
    flute: { sample: 'flute', volume: 0.26, attack: 0.05, release: 0.3, reverb: 0.4, pan: 0.2, humanize: { time: 0.008, volume: 0.1 } },
    viola: { sample: 'violas', volume: 0.42, attack: 0.1, release: 0.5, reverb: 0.4, pan: 0.1, humanize: { time: 0.01, volume: 0.1 } },
    violins: { sample: 'violinsPizz', volume: 0.2, release: 0.1, reverb: 0.3, pan: 0.3, humanize: { time: 0.006, volume: 0.15 } },
    // Underneath: soft violas for the pad, plucked basses for the walk, and
    // a cello drone kept quiet (an area theme: the low end stays light, so
    // the pick strike and the tune aren't sunk in mud).
    pad: { sample: 'violas', volume: 0.17, attack: 0.5, release: 0.8, reverb: 0.4, pan: -0.2 },
    bass: { sample: 'bassSpic', volume: 0.4, release: 0.25, reverb: 0.25, humanize: { time: 0.006, volume: 0.12 } },
    drone: { sample: 'cellos', volume: 0.15, attack: 1.2, release: 1.4, reverb: 0.5, pan: -0.05 },
    harp: { sample: 'harp', volume: 0.2, ring: true, reverb: 0.4, pan: 0.25, humanize: { time: 0.006, volume: 0.15 } },
    horn: { sample: 'hornsSoft', volume: 0.2, attack: 0.5, release: 0.8, reverb: 0.45, pan: -0.3 },
    bells: { sample: 'glock', volume: 0.12, ring: true, pan: 0.35, reverb: 0.6, echo: { time: 0.4, feedback: 0.3, mix: 0.3 } },
    // The wooden tick and the cart (frame and tom, kept small and dry).
    tick: { sample: 'frameDrum', drum: 'sample', volume: 0.3, ring: true, reverb: 0.15, humanize: { time: 0.003, volume: 0.2 } },
    cart: { sample: 'tenorDrumHigh', drum: 'sample', volume: 0.2, ring: true, reverb: 0.2, pan: 0.2, humanize: { time: 0.004, volume: 0.25 } },
    drum: { sample: 'concertBassDrum', drum: 'sample', volume: 0.3, ring: true, reverb: 0.4 },
  },

  sections: {
    // The strike alone, a bass note, a far-off tick of someone else's pick.
    intro: tight('intro', {
      pick: repeat(PICK, 2),
      tick: [...rest(1), ...TICK_SOFT],
      drone: held(midi('E2'), 2 * BAR),
    }, 2),

    // THE TUNE, low clarinet, over the strike and a plodding bass.
    A: tight('A', {
      ...work(8),
      clarinet: up(TUNE_A, -12),
      bass: chordLine(A_CHORDS, PLOD, 2),
      pad: sustained(A_CHORDS, BAR, 2, 3),
    }, 8),

    // The climb, G major: oboe on the cell, violas answering, the cart in.
    B: tight('B', {
      ...work(8, { cart: CART }),
      oboe: TUNE_B,
      viola: ANSWER_B,
      bass: chordLine(B_CHORDS, PLOD, 2),
      pad: sustained(B_CHORDS, BAR, 1, 3),
      drum: repeat(DRUM, 8),
    }, 8),

    // The dark part: a pedal E, the cell very slow and low, the harmony
    // slipping under it, bells high above; the drum a slow heartbeat.
    C: tight('C', {
      ...work(8, { tick: TICK_SOFT }),
      viola: TUNE_C,
      // No drone here: the bass is the pedal, and it is the one that slips
      // (a held E2 under its E flat and F would only rub into mud).
      bass: chordLine(C_CHORDS, PEDAL, 2),
      pad: sustained(C_CHORDS, BAR, 1, 3),
      bells: [...BELLS_CELL, ...rest(3), ...BELLS_CELL, ...rest(3)],
      drum: after(2, repeat(DRUM_HEART, 8)),
    }, 8),

    // The tune with everybody: clarinet and oboe, violins plucked, harp.
    A2: tight('A2', {
      ...work(8, { cart: CART_OFF }),
      clarinet: up(TUNE_A, -12),
      oboe: TUNE_A,
      violins: chordLine(A_CHORDS, [ '.', '.', 'third', '.', '.', '.', 7, '.', '.', '.', 'third', '.', '.', '.', 7, '.' ], 4),
      harp: chordLine(A_CHORDS, STRUM, 3),
      bass: chordLine(A_CHORDS, PLOD, 2),
      pad: sustained(A_CHORDS, BAR, 2, 3),
      drum: repeat(DRUM, 8),
    }, 8),

    // The end of the shift: G major, the miners' tune on flute and cellos,
    // the strike lighter, a horn under it.
    D: tight('D', {
      pick: repeat(PICK_LIGHT, 8),
      tick: repeat(TICK_SOFT, 8),
      flute: TUNE_D,
      viola: up(TUNE_D, -12),
      harp: chordLine(D_CHORDS, STRUM, 3),
      bass: chordLine(D_CHORDS, PLOD, 2),
      horn: sustained(D_CHORDS, BAR, 2, 2),
      bells: [...rest(7), ...BELLS_CELL.map((n) => (typeof n === 'number' ? n + 3 : n))].slice(0, 8 * BAR),
    }, 8),

    // Back to the dark: the tender cell once on viola, the strike thinning,
    // a held B to hang the loop on.
    E: tight('E', {
      pick: [...repeat(PICK, 4), ...repeat(PICK_THIN, 4)],
      tick: [...repeat(TICK_SOFT, 4), ...rest(4)],
      viola: TUNE_E,
      drone: held(midi('E2'), 8 * BAR),
      pad: [...held(midi('B3'), 8 * BAR)],
      bass: chordLine('Em Em Em Em Em Em Em Em', PEDAL, 2),
    }, 8),
  },

  // The strike plays alone to start with; then the mine goes round from A.
  order: ['intro', 'A', 'B', 'C', 'A2', 'D', 'E'],
  loopFrom: 1,
};
