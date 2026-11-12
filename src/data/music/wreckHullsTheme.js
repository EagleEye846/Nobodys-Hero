import {
  melody, repeat, hits, midi, sustained, rest as restBars, held, onNotes, chordLine,
  tight, scatter,
} from './parts/chapter5.js';

// "Under Her Ribs": the song for inside the Wreck Yard's beached hulls (the
// hold, the galley, the pump room and the pocket). Out in the yard it's "Fog
// Bell" (wreckTheme.js); step in through a hole in the plates and the storm
// is suddenly on the other side of the iron. The air in here has been
// trapped for forty years. The ship rocks a little on the shingle and her
// timbers answer. The sea hits the hull and you hear it through the metal,
// a dull boom with the top taken off. And in the galley a ghost cook is
// still laying the table for a crew that went down.
//
// THE HOOK (the first two bars are the whole song): a low clarinet, in a
// slow rocking 6/8, starts on THE COAST CELL (parts/chapter5.js, A D D E;
// here in E minor, B E E F#, upright, the way "Fog Bell" never quite
// manages) and turns back down: B E E F#, G F# E B. Said again over C (the
// F# against the C is the eerie one), then a lift to B, and down by step to
// a B major chord that leaves it hanging. Second time round the oboe takes
// it up an octave while the clarinet climbs slowly underneath; in the payoff
// they play it together and it lands on E.
//
// THE ROCK: a low harp (with a soft piano under it) on the root and the
// fifth, a dotted beat each, and pizzicato violins on the last 8th of each
// beat, a little late, like a hull settling back after a wave. A soft frame
// drum knocks with it. Violas, muffled, rock a half step every two bars:
// the timbers. Bubbles of trapped air rise on the glass now and then, and
// bowed vibes hold a long note over it all (the air itself).
//
// THE COOK (B): the tune goes to the relative major and a ghostly ocarina,
// a crooked little galley tune; somebody taps a ladle on a pot at the end
// of every four bars. Then the flute has it, and the clarinet a third under.
//
// THE STORM OUTSIDE (C): the drums stop. Real waves (the seaWaves recording,
// heavily muffled: through the plates) hit harder, a timpani roll rumbles
// like far thunder, tremolo violins wait a long way off, a choir hums low.
// The clarinet remembers the hook in pieces, the vibes hold the coast cell a
// bar a note, and then the knocking comes back, faster, and the payoff
// lands. Anticipation, never a boss song: no big strings, no brass on top.
//
// E minor, with C major's F# (Lydian) for the eerie bar and B major to pull
// home. 6/8 at 62 dotted quarters a minute; 12 steps to a bar, one step a
// 16th (a bar is about 1.9 seconds). The intro plays once (4 bars); then it
// loops from A, 50 bars, about 1m37s:
//
//   intro   4 bars  the timbers, the sea through the hull, far thunder, a
//                   bubble; the harp starts rocking in bar 4
//   A       8 bars  THE HOOK on the low clarinet over the rock
//   A'      8 bars  the oboe takes it up an octave, the clarinet climbing
//                   underneath, the bubbles and the piano join
//   B       8 bars  the cook's tune on the ocarina, in G; the ladle on a pot
//   B2      8 bars  the flute takes it, the clarinet a third under
//   C       8 bars  the storm outside: no drums, the hull booming, thunder,
//                   the hook in pieces; the knocking builds back in
//   A2      8 bars  THE PAYOFF: oboe and clarinet in octaves, the flute
//                   above, violins and soft horns far back, a brush on the
//                   second beat; home on E
//   tail    2 bars  the timbers and a bubble, then round to A

const BAR = 12;
const tune = (text) => melody(text, 2);   // each token an 8th: 6 to a bar
const rest = (bars) => restBars(bars, BAR);
const fit = (name, section, bars) => tight('Under Her Ribs', name, section, bars, BAR);
const beat = (pattern, bars) => repeat(hits(pattern), bars);
const up = (steps, semitones) => steps.map((n) => (typeof n === 'number' ? n + semitones : n));

// --- Harmony, a bar each ---
const A_CHORDS = 'Em Em C G Am B C B';
const A2_CHORDS = 'Em Em C G Am B C Em';
const B_CHORDS = 'G D Em C Am D G B';
const C_CHORDS = 'Em Em C C Am Am B B';

// --- THE HOOK (sing it) ---
const HOOK = tune(`
  B3 - E4 E4 - F#4 | G4 - F#4 E4 - B3 |
  C4 - E4 E4 - F#4 | G4 - - B4 - - |
  A4 - G4 F#4 - E4 | F#4 - - B3 - - |
  C4 - E4 G4 - F#4 | D#4 - - - - . |
`);
const HOOK_HOME = [...HOOK.slice(0, 7 * BAR), ...tune('E4 - - - - .')];
// Under the oboe in A': the clarinet climbs a chord tone a bar.
const CLIMB = tune(`
  G3 - - - - - | B3 - - - - - |
  G3 - - - - - | B3 - - D4 - - |
  C4 - - - - - | D#4 - - - - - |
  E4 - - - - - | F#4 - - - - . |
`);
// Over the payoff: the flute, high and long.
const DESCANT = tune(`
  B5 - - - - - | G5 - - - - - |
  G5 - - - - - | D6 - - B5 - - |
  C6 - - - - - | B5 - - - - - |
  E6 - - D6 - - | B5 - - - - . |
`);

// --- THE COOK'S TUNE (B), in G, and the clarinet a third under it ---
const COOK = tune(`
  D5 - B4 G5 - D5 | F#5 - E5 D5 - - |
  E5 - G5 B5 - A5 | G5 - E5 C5 - - |
  A4 - C5 E5 - D5 | C5 - B4 A4 - F#5 |
  G5 - - B4 - - | D#5 - - - - . |
`);
const COOK_UNDER = tune(`
  B4 - G4 D5 - B4 | D5 - C5 A4 - - |
  B4 - E5 G5 - F#5 | E5 - C5 G4 - - |
  E4 - A4 C5 - B4 | A4 - G4 F#4 - D5 |
  D5 - - G4 - - | B4 - - - - . |
`);

// --- THE STORM OUTSIDE (C): the hook in pieces, and the coast cell slowed
// to a bar a note on the vibes ---
const PIECES = tune(`
  B3 - E4 E4 - F#4 | G4 - - - - . |
  . . . . . . | . . . . . . |
  A4 - G4 F#4 - E4 | F#4 - - - - . |
  . . . . . . | . . . . . . |
`);
const SLOW_CELL = tune(`
  B4 - - - - - | E5 - - - - - |
  E5 - - - - - | F#5 - - - - - |
  G5 - - - - - | F#5 - - - - - |
  B4 - - - - - | - - - - - . |
`);

// --- THE ROCK ---
// The low harp: the root on the first beat, the fifth on the second. (Nothing
// under E2: the harp's lowest strings go "boing".)
const LOW = [0, '.', '.', '.', '.', '.', 7, '.', '.', '.', '.', '.'];
const A_BASS = 'E3 E3 C3 G2 A2 B2 C3 B2';
const A2_BASS = 'E3 E3 C3 G2 A2 B2 C3 E3';
const B_BASS = 'G2 D3 E3 C3 A2 D3 G2 B2';
const C_BASS = 'E3 E3 C3 C3 A2 A2 B2 B2';
// The piano an octave under the harp, on the first beat only.
const THUD = [0, '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'];
// Pizzicato on the last 8th of each beat (the hull settling back); fuller in
// the payoff, on the last two.
const PIZZ = ['.', '.', '.', '.', 7, '.', '.', '.', '.', '.', 12, '.'];
const PIZZ_FULL = ['.', '.', 'third', '.', 7, '.', '.', '.', 'third', '.', 12, '.'];
const pizz = (chords, full = false) => chordLine(chords, full ? PIZZ_FULL : PIZZ, 4);

// The timbers: muffled violas rocking a half step, once every two bars.
const CREAK = tune('. . . E3 - F3 | - - . . . .');
const creak = (bars) => repeat(CREAK, bars / 2);
// Trapped air: a bubble rising on the glass (three quick notes).
const bubbles = (bars, at) => {
  const out = rest(bars);
  for (const [bar, step, notes = 'E5 G5 B5'] of at) {
    notes.split(' ').forEach((name, i) => { out[bar * BAR + step + i] = midi(name); });
  }
  return out;
};

// The drums: a frame drum knocking with the rock; a far tom every other bar;
// a brush on the second beat in the payoff.
const KNOCK = 'x.....x..x..';
const KNOCK_FULL = 'x..x..x..x.x';
const TOM = 'x........... ............';
const BRUSH = '......x.....';
// The knocking coming back at the end of the storm, faster.
const BUILD = [...rest(5), ...hits('x.....x.....'), ...hits('x..x..x..x..'), ...hits('x.x.x.x.xx..')];

// The sea against the hull: a real wave (seaWaves, one of eight) every other
// bar, through the plates; in the storm, every bar and bigger.
const sea = (bars, notes, every = 2, first = 0) => {
  const out = rest(bars);
  let n = 0;
  for (let bar = first; bar < bars; bar += every) out[bar * BAR] = midi(notes[n++ % notes.length]);
  return out;
};
const SMALL_WAVES = ['C4', 'D4', 'C#4', 'Eb4'];
const BIG_WAVES = ['E4', 'G4', 'F4', 'F#4'];

// The ladle on the pot: the end of every four bars of the cook's tune.
const LADLE = [...rest(3), ...hits('......x...x.'), ...rest(3), ...hits('......x...x.')];

export const WRECK_HULLS_THEME = {
  title: 'Under Her Ribs',
  bpm: 62,
  stepsPerBeat: 6,
  // An area song: level with "Fog Bell" and the rest, not over them.
  volume: 0.81,

  instruments: {
    // The tunes.
    clarinet: { sample: 'clarinet', volume: 0.26, attack: 0.06, release: 0.5, reverb: 0.5, pan: -0.1, humanize: { time: 0.012, volume: 0.1 } },
    oboe: { sample: 'oboe', volume: 0.2, attack: 0.06, release: 0.5, reverb: 0.55, pan: 0.15, humanize: { time: 0.012, volume: 0.1 } },
    ocarina: { sample: 'ocarina', volume: 0.2, attack: 0.05, release: 0.6, reverb: 0.65, pan: 0.25, echo: { time: 0.48, feedback: 0.25, mix: 0.2 }, humanize: { time: 0.015, volume: 0.12 } },
    flute: { sample: 'flute', volume: 0.16, attack: 0.15, release: 0.7, reverb: 0.6, pan: 0.3, humanize: { time: 0.012, volume: 0.1 } },
    // The rock: a low harp, a soft piano under it, pizzicato violins.
    harp: { sample: 'harp', volume: 0.22, ring: true, reverb: 0.45, pan: -0.2, humanize: { time: 0.01, volume: 0.12 } },
    piano: { sample: 'grandPiano', volume: 0.1, ring: true, muffle: 1400, reverb: 0.4, pan: -0.1, humanize: { time: 0.01, volume: 0.1 } },
    pizz: { sample: 'violinsPizz', volume: 0.13, ring: true, reverb: 0.4, pan: 0.25, humanize: { time: 0.015, volume: 0.2 } },
    // The air: bowed vibes held long, and bubbles on the glass.
    air: { sample: 'vibesBowed', volume: 0.1, attack: 0.8, release: 1.6, reverb: 0.7, pan: 0.1, echo: { time: 0.58, feedback: 0.3, mix: 0.25 } },
    bubbles: { sample: 'glass', volume: 0.07, ring: true, reverb: 0.6, pan: 0.35, humanize: { time: 0.01, volume: 0.25 } },
    // The timbers.
    creak: { sample: 'violas', volume: 0.08, attack: 0.35, release: 0.6, reverb: 0.45, pan: -0.35, muffle: 650 },
    // Soft strings, far back, sul tasto (the top taken off).
    violas: { sample: 'violas', volume: 0.08, attack: 1.4, release: 1.8, reverb: 0.6, pan: -0.2, muffle: 1200 },
    violins: { sample: 'violins', volume: 0.07, attack: 1.6, release: 2, reverb: 0.65, pan: 0.3, muffle: 2400 },
    // The storm outside, through the iron.
    trem: { sample: 'violinsTrem', volume: 0.06, attack: 2, release: 2, reverb: 0.7, pan: 0.35, muffle: 1500 },
    thunder: { sample: 'timpaniRoll', volume: 0.16, attack: 0.8, release: 1.5, reverb: 0.6, pan: -0.3, muffle: 500 },
    waves: { sample: 'seaWaves', volume: 0.16, ring: true, muffle: 600, reverb: 0.35, pan: 0.1 },
    choir: { sample: 'choir', volume: 0.08, attack: 1.8, release: 2.2, reverb: 0.75, pan: -0.1, muffle: 1800 },
    // Soft horns in the payoff, far back and dark.
    horns: { sample: 'hornsSoft', volume: 0.07, attack: 0.9, release: 1.4, reverb: 0.65, pan: -0.25, muffle: 1500 },
    // The knocking: a frame drum, a far tom, a brush, and the cook's ladle.
    knock: { sample: 'frameDrum', drum: 'sample', volume: 0.15, ring: true, reverb: 0.35, pan: 0.05, humanize: { time: 0.008, volume: 0.25 } },
    tom: { sample: 'tom', drum: 'sample', volume: 0.13, ring: true, reverb: 0.55, pan: -0.15, muffle: 900, humanize: { time: 0.008, volume: 0.2 } },
    brush: { sample: 'snareSoft', drum: 'sample', volume: 0.06, ring: true, reverb: 0.4, pan: 0.15, humanize: { time: 0.008, volume: 0.3 } },
    ladle: { sample: 'anvil', drum: 'sample', volume: 0.035, ring: true, reverb: 0.6, pan: 0.4, muffle: 3000, humanize: { time: 0.01, volume: 0.3 } },
  },

  sections: {
    // The hull before anyone plays: timbers, the sea, far thunder, a bubble;
    // the harp starts rocking in the last bar.
    intro: fit('intro', {
      creak: creak(4),
      waves: sea(4, SMALL_WAVES, 2),
      thunder: [...rest(2), ...held('E2', BAR + 6), ...Array(6).fill('.')],
      air: [...rest(1), ...held('E5', 3 * BAR - 2), '.', '.'],
      bubbles: bubbles(4, [[1, 8]]),
      harp: [...rest(3), ...onNotes('E3', LOW)],
    }, 4),

    // THE HOOK on the low clarinet over the rock.
    A: fit('A', {
      clarinet: HOOK,
      harp: onNotes(A_BASS, LOW),
      pizz: pizz(A_CHORDS),
      creak: creak(8),
      knock: beat(KNOCK, 8),
      tom: beat(TOM, 4),
      waves: sea(8, SMALL_WAVES, 2, 1),
      air: [...held('B4', 4 * BAR), ...rest(4)],
    }, 8),

    // The oboe takes it up an octave; the clarinet climbs under it; the
    // piano and the bubbles join.
    A1: fit('A1', {
      oboe: up(HOOK, 12),
      clarinet: CLIMB,
      harp: onNotes(A_BASS, LOW),
      piano: onNotes('E2 E2 C2 G1 A1 B1 C2 B1', THUD),
      pizz: pizz(A_CHORDS),
      creak: creak(8),
      knock: beat(KNOCK, 8),
      tom: beat(TOM, 4),
      waves: sea(8, SMALL_WAVES, 2, 1),
      violas: sustained(A_CHORDS, BAR, 1, 3),
      bubbles: bubbles(8, [[0, 8], [3, 2, 'G5 B5 D6'], [6, 8]]),
    }, 8),

    // The cook's tune on the ocarina, in G; the ladle on the pot.
    B: fit('B', {
      ocarina: COOK,
      harp: onNotes(B_BASS, LOW),
      piano: onNotes('G1 D2 E2 C2 A1 D2 G1 B1', THUD),
      pizz: pizz(B_CHORDS),
      knock: beat(KNOCK, 8),
      ladle: LADLE,
      creak: creak(8),
      waves: sea(8, SMALL_WAVES, 2, 1),
      air: [...held('D5', 4 * BAR), ...rest(4)],
    }, 8),

    // The flute has it; the clarinet a third under.
    B2: fit('B2', {
      flute: COOK,
      clarinet: COOK_UNDER,
      ocarina: [...rest(7), ...tune('. . . F#5 - -')],
      harp: onNotes(B_BASS, LOW),
      piano: onNotes('G1 D2 E2 C2 A1 D2 G1 B1', THUD),
      pizz: pizz(B_CHORDS),
      knock: beat(KNOCK, 8),
      tom: beat(TOM, 4),
      ladle: LADLE,
      violas: sustained(B_CHORDS, BAR, 1, 3),
      waves: sea(8, SMALL_WAVES, 2, 1),
      bubbles: bubbles(8, [[2, 8], [6, 2, 'G5 B5 D6']]),
    }, 8),

    // The storm outside: the drums stop, the hull booms, thunder, the hook in
    // pieces; then the knocking comes back, faster.
    C: fit('C', {
      clarinet: PIECES,
      air: SLOW_CELL,
      harp: [...onNotes(C_BASS, THUD).slice(0, 6 * BAR), ...onNotes('B2 B2', LOW)],
      waves: sea(8, BIG_WAVES, 1),
      thunder: [...held('E2', BAR + 6), ...Array(2 * BAR + 6).fill('.'), ...held('A2', BAR + 6), ...Array(2 * BAR + 6).fill('.')],
      trem: sustained(C_CHORDS, BAR, 2, 4),
      choir: sustained(C_CHORDS, BAR, 0, 3),
      violas: sustained(C_CHORDS, BAR, 1, 3),
      creak: creak(8),
      pizz: [...rest(6), ...pizz('B B')],
      knock: BUILD,
      bubbles: bubbles(8, [[1, 4], [4, 8, 'E5 G5 B5']]),
    }, 8),

    // THE PAYOFF: oboe and clarinet in octaves, the flute above, strings and
    // soft horns far back, a brush on the second beat; home on E.
    A2: fit('A2', {
      oboe: up(HOOK_HOME, 12),
      clarinet: HOOK_HOME,
      flute: DESCANT,
      harp: onNotes(A2_BASS, LOW),
      piano: onNotes('E2 E2 C2 G1 A1 B1 C2 E2', THUD),
      pizz: pizz(A2_CHORDS, true),
      violas: sustained(A2_CHORDS, BAR, 1, 3),
      violins: sustained(A2_CHORDS, BAR, 2, 4),
      horns: sustained(A2_CHORDS, BAR, 0, 3),
      choir: sustained(A2_CHORDS, BAR, 2, 3),
      knock: [...beat(KNOCK_FULL, 7), ...hits('x...........')],
      tom: beat(TOM, 4),
      brush: [...beat(BRUSH, 7), ...rest(1)],
      waves: sea(8, BIG_WAVES, 2, 1),
      bubbles: bubbles(8, [[3, 8, 'G5 B5 D6'], [7, 4]]),
    }, 8),

    // A breath: the timbers and a bubble, then round to the hook.
    tail: fit('tail', {
      creak: creak(2),
      air: [...held('E5', 2 * BAR - 2), '.', '.'],
      bubbles: bubbles(2, [[0, 6]]),
      harp: [...onNotes('E3', THUD), ...rest(1)],
      waves: sea(2, SMALL_WAVES, 2, 1),
    }, 2),
  },

  order: ['intro', 'A', 'A1', 'B', 'B2', 'C', 'A2', 'tail'],
  loopFrom: 1,
};
