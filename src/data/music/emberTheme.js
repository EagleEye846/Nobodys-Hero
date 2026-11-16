import {
  melody, repeat, hits, midi, transpose, arpeggio, sustained, chordLine, rest as restBars, held, heldNotes, onNotes,
  tight,
} from './parts/chapter6.js';

// "Where the Ground Ticks": the song for the ember lands, chapter 6's fifth
// area. Past the buried woods the ash thins and the ground goes red and
// black: cracked crust with the glow showing through, vents that breathe out
// heat, gusts that come off them hot enough to lean on, and a bridge of
// embers you carry across before it cools. Somewhere at the end of it is the
// dragon's cave. Nobody walks here slowly. Driving, warm and uneasy, always
// leaning toward the next room, never a boss song.
//
// THE TICK (the first thing you hear, and it never stops): the ground
// clicking as it heats, the way a stove or a tin roof does. Pizzicato
// violins with a soft piano under them, high up and dry, on three fixed
// notes that never follow the chords: B, B, E, B, B, then C to B, a 16th
// apart. Grouped 3+3+2 inside the 4/4, so it limps forward. The C to B at
// the end of it is the ember cell's half step, small enough to miss. Under
// it a hi-hat ticks very quietly out of step, a tick here and there, like
// the crust cooling and cracking. The fights use the same tick, re-barred
// ("Nothing Left to Burn", emberBattleTheme.js).
//
// THE HOOK (sing it): THE EMBER CELL (parts/chapter6.js) moved to E minor
// and pushed off the beat: E F# G, B tied over the bar's middle, then C
// falling to B. It runs down and hangs on F#, says the cell again, reaches
// up to D, and the first time it stops on the low B (asking). An oboe has
// it first with a clarinet under it in long notes; then a flute takes it,
// a solo violin an octave under it, and it lands on E.
//
// UNDER IT: hand drums, all real: a frame drum on the 3+3+2 (the doum), a
// high tenor drum tapping in between (the tek), a low tom now and then. A
// plucked double bass walks the same 3+3+2 on the roots. A harp rolls the
// chords in 8ths, muffled, and the ground smoulders under the long bars (a
// timpani roll, almost not there).
//
// THE VENTS (B): a second tune on an ocarina, in C with a sharp F (the
// Lydian F# over C: the heat haze over the ground), and a glockenspiel
// throwing up the ember cell in quick notes after each line, like a spark
// lifting off a vent. The second time the flute joins it, bowed vibraphone
// and soft violins under it, and it turns to B to ask again.
//
// THE GUSTS (C, about 60% in): the drums go but for a low heartbeat on the
// frame drum. The tick keeps going, alone. Wind comes in gusts (the real
// cymbal swell, muffled), embers fly thick on the glass, tremolo strings
// hold a B over everything, and a low choir comes up far back. The clarinet
// says the ember cell in E, then in A (still landing on its fifth). In the
// last bar the bass climbs B, C, C#, D, D# into the payoff and the hand
// drums roll back in.
//
// THE PAYOFF (A2): the hook on oboe and flute together, soft violins with
// them, a solo violin singing a long line over it, soft horns far back (only
// under, never on top), a soft bass drum on the one. No cellos anywhere.
//
// E minor, with C major's colour (the B over C, a major seventh) and the
// Lydian F# over C in the vents; B major to pull home. 4/4 at 112 BPM, one
// step a 16th (a bar is about 2.1 seconds). The intro plays once (4 bars);
// then it loops from A, 50 bars, about 1m47s:
//
//   intro   4 bars  0:00  the tick alone; the bass in bar 2, the hand drums
//                         in bar 3, the harp in bar 4
//   A       8 bars  0:09  THE HOOK on the oboe, the clarinet under it; it
//                         stops on the low B
//   A1      8 bars  0:26  the flute takes it, the solo violin under it, the
//                         violas join; it lands on E
//   B       8 bars  0:43  THE VENTS: the ocarina in C Lydian, the glock
//                         throwing up the ember cell; the drums lighter
//   B1      8 bars  1:00  the vents again, the flute with it, vibes and
//                         soft violins; it turns to B
//   C       8 bars  1:17  THE GUSTS: the tick alone over a heartbeat, wind,
//                         embers, the cell in E and in A; the bass climbs
//                         into
//   A2      8 bars  1:34  THE PAYOFF: oboe and flute, soft violins, the solo
//                         violin's long line, soft horns far back
//   tail    2 bars  1:51  the tick, the bass and the harp, round to A

const BAR = 16;
const tune = (text) => melody(text, 2);   // each token an 8th: 8 to a bar
const riff = (text) => melody(text, 1);   // each token a 16th
const rest = (bars) => restBars(bars, BAR);
const fit = (name, section, bars) => tight('Where the Ground Ticks', name, section, bars, BAR);
const up = transpose;
const beat = (pattern, bars) => repeat(hits(pattern), bars);
const after = (bars, track) => [...rest(bars), ...track.slice(bars * BAR)];

// --- THE TICK: shared with the fights (emberBattleTheme.js) ---
// Semitones from the tonic, one a 16th: 5 5 8va 5 5, then the b6 to 5.
// Grouped 3+3+2 in a 4/4 bar. It never follows the chords.
export const EMBER_TICK = [7, '.', '.', 7, '.', '.', 12, '.', 7, '.', '.', 7, '.', 8, 7, '.'];
const tick = (bars) => repeat(EMBER_TICK.map((s) => (typeof s === 'number' ? midi('E5') + s : s)), bars);
// The crust cooling: a hi-hat ticking very softly out of step (four bars
// that go round).
const CRACKS = ['x.x..x.xx..x.x..', '.xx.x..x.x.xx..x', 'x..xx.x..xx.x.x.', '.x.x.xx..x.x.xx.'];
const cracks = (bars, from = 0) => Array.from({ length: bars }, (_, i) => hits(CRACKS[(i + from) % 4])).flat();

// --- Harmony, a bar each ---
const A_CHORDS = 'Em C Am B Em C Am B';      // stops on B (asking)
const HOME_CHORDS = 'Em C Am B Em C D Em';   // lands on E
const B_CHORDS = 'C D Bm Em C D B B';

// --- THE HOOK, 8 bars, one token an 8th ---
const HOOK_OPEN = `
  E5 - F#5 G5 - B5 - - | C6 - - B5 - - - . | A5 - G5 - F#5 G5 - E5 | F#5 - - - B4 - - . |
  E5 - F#5 G5 - B5 - - | D6 - - C6 - - B5 - |`;
const HOOK_ASK = tune(`${HOOK_OPEN} A5 - G5 - F#5 - E5 D#5 | B4 - - - - - . . |`);
const HOOK_HOME = tune(`${HOOK_OPEN} A5 - G5 - F#5 - G5 F#5 | E5 - - - - - . . |`);
// Under the oboe: the clarinet in long notes.
const COUNTER_OPEN = `
  B4 - - - G4 - - - | G4 - - - E4 - - - | E4 - - - C5 - - - | D#4 - - - F#4 - - - |
  B4 - - - G4 - - - | G4 - - - E4 - - - |`;
const COUNTER_ASK = tune(`${COUNTER_OPEN} E4 - - - C5 - - - | D#4 - - - F#4 - - . |`);
const COUNTER_HOME = tune(`${COUNTER_OPEN} F#4 - - - A4 - - - | G4 - - - - - . . |`);
// Over the payoff: the solo violin, long, landing on the fifth.
const DESCANT = tune(`
  B5 - - - - - - - | G5 - - - - - - - | C6 - - - - - - - | D#6 - - - - - - - |
  E6 - - - - - - - | E6 - - - D6 - - - | C6 - - - A5 - - - | B5 - - - - - . . |
`);

// --- THE VENTS (B): the ocarina, C with a sharp F ---
const VENTS = tune(`
  G5 - - F#5 E5 - G5 A5 | F#5 - - - D5 - - . | B5 - - A5 F#5 - A5 B5 | G5 - - - - - . . |
  G5 - - F#5 E5 - G5 A5 | B5 - - - A5 - F#5 - | F#5 - - - D#5 - E5 F#5 | F#5 - - - - - . . |
`);
// The spark off a vent: the ember cell in quick notes on the glock, after
// each line (bars 2, 4, 6 and 8 of the vents). [bar, first step, tonic]
const sparkCell = (bars, at) => {
  const out = rest(bars);
  const shape = [[0, 0], [1, 2], [2, 3], [3, 7], [5, 8], [7, 7]];   // [step, semitones]
  for (const [bar, step, tonic] of at) for (const [s, n] of shape) out[bar * BAR + step + s] = midi(tonic) + n;
  return out;
};

// --- THE GUSTS (C): the cell in E, then in A, on the clarinet ---
const GUST_CELL = tune(`
  E4 - F#4 G4 - B4 - - | C5 - - B4 - - - - | . . . . . . . . | . . . . . . . . |
  A4 - B4 C5 - E5 - - | F5 - - E5 - - - - | . . . . . . . . | . . . . . . . . |
`);
// The bass pulsing, then climbing into the payoff.
const PULSE = [0, '-', '-', 0, '-', '-', 0, '-', 0, '-', '-', 0, '-', '-', 0, '-'];
const GUST_BASS = [...onNotes('E2 E2 C2 C2 A1 A1 B1', PULSE), ...riff('B1 - - C2 - - C#2 - D2 - - D#2 - - - -')];

// --- The groove ---
// The plucked bass on the 3+3+2.
const WALK = [0, '-', '-', 0, '-', '-', 7, '-', 12, '-', '-', 7, '-', '-', 0, '-'];
const bass = (chords) => chordLine(chords, WALK, 2);
// The harp rolling the chord in 8ths.
const ROLL = [0, '-', 7, '-', 12, '-', 'tenth', '-', 19, '-', 'tenth', '-', 12, '-', 7, '-'];
const roll = (chords) => arpeggio(chords, BAR, 3, ROLL);
// Hand drums.
const DOUM = 'x.....x.....x...';
const TEK = '..x..x...x..x.xx';
const TOM = '...........x..x.';
const HEART = 'x..x............';
const ROLL_IN = '....x..x.xx.xxxx';
const KICK = 'x.......x.......';
// Embers: three quick notes rising on the glass. [bar, step, 'notes']
const embers = (bars, at) => {
  const out = rest(bars);
  for (const [bar, step, notes = 'E5 G5 B5'] of at) notes.split(' ').forEach((name, i) => { out[bar * BAR + step + i] = midi(name); });
  return out;
};
// Wind: the cymbal swell, muffled, one gust every `every` bars.
const gusts = (bars, every, first = 0) => {
  const out = rest(bars);
  for (let b = first; b < bars; b += every) out[b * BAR] = 60;
  return out;
};
// The ground smouldering: a long timpani roll, almost not there.
const smoulder = (bars, note, from = 0, len = 2) => [...rest(from), ...held(note, len * BAR - 2), '.', '.', ...rest(bars - from - len)];

export const EMBER_THEME = {
  title: 'Where the Ground Ticks',
  bpm: 112,
  stepsPerBeat: 4,
  // An area song: level with the others (about -26.5 on tools/loudnessCheck.html).
  volume: 0.85,

  instruments: {
    // The tick: pizzicato violins, a soft piano under them; the crust cracking.
    tick: { sample: 'violinsPizz', volume: 0.13, ring: true, reverb: 0.3, pan: 0.3, humanize: { time: 0.004, volume: 0.18 } },
    tickKey: { sample: 'grandPiano', volume: 0.05, ring: true, muffle: 2400, reverb: 0.35, pan: 0.25, humanize: { time: 0.004, volume: 0.2 } },
    cracks: { sample: 'hatSoft', drum: 'sample', volume: 0.05, ring: true, reverb: 0.25, pan: -0.35, humanize: { time: 0.008, volume: 0.5 } },
    // The winds and the fiddle.
    oboe: { sample: 'oboe', volume: 0.22, attack: 0.05, release: 0.45, reverb: 0.5, pan: 0.1, humanize: { time: 0.01, volume: 0.1 } },
    flute: { sample: 'flute', volume: 0.18, attack: 0.08, release: 0.5, reverb: 0.55, pan: 0.2, humanize: { time: 0.01, volume: 0.1 } },
    clarinet: { sample: 'clarinet', volume: 0.16, attack: 0.08, release: 0.5, reverb: 0.5, pan: -0.2, humanize: { time: 0.012, volume: 0.1 } },
    ocarina: { sample: 'ocarina', volume: 0.2, attack: 0.05, release: 0.45, reverb: 0.5, pan: 0.15, humanize: { time: 0.012, volume: 0.1 } },
    fiddle: { sample: 'soloViolin', volume: 0.16, attack: 0.06, release: 0.5, reverb: 0.5, pan: -0.1, humanize: { time: 0.01, volume: 0.08 } },
    glock: { sample: 'glock', volume: 0.06, ring: true, reverb: 0.55, pan: 0.3, echo: { time: 0.4, feedback: 0.25, mix: 0.2 } },
    // The harp and the plucked bass.
    harp: { sample: 'harp', volume: 0.12, ring: true, muffle: 2600, reverb: 0.4, pan: -0.2, humanize: { time: 0.008, volume: 0.12 } },
    bass: { sample: 'bassPizz', volume: 0.3, ring: true, reverb: 0.2, humanize: { time: 0.004, volume: 0.12 } },
    // Soft strings and pads, far back.
    violas: { sample: 'violas', volume: 0.06, attack: 0.9, release: 1.4, reverb: 0.55, pan: -0.25, muffle: 1600 },
    violins: { sample: 'violins', volume: 0.08, attack: 0.15, release: 0.8, reverb: 0.55, pan: 0.3, muffle: 3000 },
    vibes: { sample: 'vibesBowed', volume: 0.08, attack: 0.4, release: 1.2, reverb: 0.65, pan: 0.2 },
    trem: { sample: 'violinsTrem', volume: 0.05, attack: 1.4, release: 1.6, reverb: 0.65, pan: 0.35, muffle: 1800 },
    tremLow: { sample: 'violasTrem', volume: 0.06, attack: 1.2, release: 1.6, reverb: 0.6, pan: -0.3, muffle: 1200 },
    choir: { sample: 'choir', volume: 0.07, attack: 1.6, release: 2, reverb: 0.75, pan: -0.1, muffle: 1600 },
    horns: { sample: 'hornsSoft', volume: 0.06, attack: 0.8, release: 1.2, reverb: 0.6, pan: -0.25, muffle: 1300 },
    // The ground, the wind, the embers.
    smoulder: { sample: 'timpaniRoll', volume: 0.12, attack: 1, release: 1.4, reverb: 0.55, pan: -0.2, muffle: 420 },
    wind: { sample: 'cymbalSwell', volume: 0.09, release: 0.6, reverb: 0.7, pan: 0.25, muffle: 1300 },
    embers: { sample: 'glass', volume: 0.05, ring: true, reverb: 0.6, pan: -0.35, humanize: { time: 0.01, volume: 0.25 } },
    // The hand drums.
    doum: { sample: 'frameDrum', drum: 'sample', volume: 0.22, ring: true, reverb: 0.25, muffle: 2200, humanize: { time: 0.004, volume: 0.15 } },
    tek: { sample: 'tenorDrumHigh', drum: 'sample', volume: 0.07, ring: true, reverb: 0.25, pan: 0.2, muffle: 3000, humanize: { time: 0.004, volume: 0.3 } },
    tom: { sample: 'tom', drum: 'sample', volume: 0.12, ring: true, reverb: 0.3, pan: -0.15, muffle: 1800, humanize: { time: 0.005, volume: 0.2 } },
    kick: { sample: 'concertBassDrum', drum: 'sample', volume: 0.1, ring: true, reverb: 0.35, muffle: 900 },
  },

  sections: {
    // The tick alone; the bass in bar 2, the hand drums in bar 3, the harp in bar 4.
    intro: fit('intro', {
      tick: tick(4),
      tickKey: tick(4),
      cracks: cracks(4),
      smoulder: smoulder(4, 'E2', 0, 3),
      bass: after(1, bass('Em Em Em Em')),
      doum: after(2, beat(DOUM, 4)),
      tek: after(2, beat(TEK, 4)),
      tom: [...rest(3), ...hits(ROLL_IN)],
      harp: after(3, roll('Em Em Em B')),
      embers: embers(4, [[1, 10]]),
    }, 4),

    // THE HOOK on the oboe, the clarinet under it; it stops on the low B.
    A: fit('A', {
      oboe: HOOK_ASK,
      clarinet: COUNTER_ASK,
      tick: tick(8),
      tickKey: tick(8),
      cracks: cracks(8),
      bass: bass(A_CHORDS),
      harp: roll(A_CHORDS),
      doum: beat(DOUM, 8),
      tek: beat(TEK, 8),
      tom: beat(TOM, 8),
      embers: embers(8, [[3, 10], [7, 8, 'F#5 B5 D#6']]),
      smoulder: smoulder(8, 'E2', 0, 2),
    }, 8),

    // The flute takes it, the solo violin an octave under it, the violas
    // join; it lands on E.
    A1: fit('A1', {
      flute: HOOK_HOME,
      fiddle: up(HOOK_HOME, -12),
      oboe: [...rest(7), ...tune('. . . . B5 - G5 -')],
      violas: sustained(HOME_CHORDS, BAR, 1, 3),
      tick: tick(8),
      tickKey: tick(8),
      cracks: cracks(8, 2),
      bass: bass(HOME_CHORDS),
      harp: roll(HOME_CHORDS),
      doum: beat(DOUM, 8),
      tek: beat(TEK, 8),
      tom: [...beat(TOM, 7), ...hits(ROLL_IN)],
      embers: embers(8, [[1, 12], [5, 10, 'E5 G5 C6']]),
      smoulder: smoulder(8, 'C3', 4, 2),
    }, 8),

    // THE VENTS: the ocarina, C with a sharp F; the glock throws up the
    // ember cell after each line; the drums lighter.
    B: fit('B', {
      ocarina: VENTS,
      glock: sparkCell(8, [[1, 6, 'E6'], [3, 6, 'E6'], [5, 6, 'B5']]),
      clarinet: sustained(B_CHORDS, BAR, 2, 3),
      violas: sustained(B_CHORDS, BAR, 1, 3),
      tick: tick(8),
      tickKey: tick(8),
      cracks: cracks(8, 1),
      bass: bass(B_CHORDS),
      harp: roll(B_CHORDS),
      doum: beat(DOUM, 8),
      wind: gusts(8, 8, 4),
    }, 8),

    // The vents again, the flute with the ocarina, bowed vibes and soft
    // violins under; it turns to B.
    B1: fit('B1', {
      ocarina: VENTS,
      flute: VENTS,
      glock: sparkCell(8, [[1, 6, 'E6'], [3, 6, 'E6'], [5, 6, 'B5']]),
      vibes: sustained(B_CHORDS, BAR, 2, 5),
      violins: sustained(B_CHORDS, BAR, 1, 4),
      violas: sustained(B_CHORDS, BAR, 0, 3),
      tick: tick(8),
      tickKey: tick(8),
      cracks: cracks(8, 3),
      bass: bass(B_CHORDS),
      harp: roll(B_CHORDS),
      doum: beat(DOUM, 8),
      tek: beat(TEK, 8),
      tom: [...beat(TOM, 7), ...hits(ROLL_IN)],
      embers: embers(8, [[7, 8, 'F#5 B5 D#6']]),
      smoulder: smoulder(8, 'B2', 6, 2),
    }, 8),

    // THE GUSTS: the drums go but for a heartbeat; the tick alone; wind and
    // embers; the cell in E, then in A; the bass climbs into the payoff.
    C: fit('C', {
      clarinet: GUST_CELL,
      tick: tick(8),
      tickKey: tick(8),
      cracks: [...cracks(4), ...hits('x.xxx.x.xx.xxx.x'), ...cracks(3, 1)],
      bass: GUST_BASS,
      trem: heldNotes('B4 B4 B4 B4 B4 B4 B4 B4', BAR),
      tremLow: heldNotes('G3 G3 G3 G3 E3 E3 D#3 D#3', BAR),
      choir: [...rest(2), ...heldNotes('C4 C4 C4 C4 B3 B3', BAR)],
      wind: gusts(8, 2),
      smoulder: [...smoulder(4, 'E2', 0, 4), ...smoulder(4, 'B2', 0, 4)],
      embers: embers(8, [[0, 4], [1, 10, 'E5 G5 C6'], [2, 2], [3, 8, 'E5 G5 C6'], [4, 0, 'A5 C6 E6'], [4, 10], [5, 4, 'A5 C6 E6'], [6, 2, 'F#5 B5 D#6'], [6, 10]]),
      doum: [...beat(HEART, 7), ...hits('x.....x.....x.xx')],
      tom: [...rest(7), ...hits(ROLL_IN)],
      harp: [...rest(7), ...roll('B')],
    }, 8),

    // THE PAYOFF: oboe and flute, soft violins with them, the solo violin's
    // long line over it, soft horns far back; a soft bass drum on the one.
    A2: fit('A2', {
      oboe: HOOK_HOME,
      flute: HOOK_HOME,
      violins: HOOK_HOME,
      fiddle: DESCANT,
      clarinet: COUNTER_HOME,
      violas: sustained(HOME_CHORDS, BAR, 1, 3),
      horns: sustained(HOME_CHORDS, BAR, 0, 3),
      glock: sparkCell(8, [[7, 6, 'E6']]),
      tick: tick(8),
      tickKey: tick(8),
      cracks: cracks(8),
      bass: bass(HOME_CHORDS),
      harp: roll(HOME_CHORDS),
      doum: beat(DOUM, 8),
      tek: beat(TEK, 8),
      tom: beat(TOM, 8),
      kick: beat(KICK, 8),
      embers: embers(8, [[3, 10, 'F#5 B5 D#6']]),
      smoulder: smoulder(8, 'E2', 6, 2),
    }, 8),

    // A breath: the tick, the bass and the harp, round to the hook.
    tail: fit('tail', {
      tick: tick(2),
      tickKey: tick(2),
      cracks: cracks(2, 1),
      bass: bass('Em B'),
      harp: roll('Em B'),
      doum: beat(DOUM, 2),
      wind: gusts(2, 2),
      violas: [...held('B3', 2 * BAR - 2), '.', '.'],
    }, 2),
  },

  order: ['intro', 'A', 'A1', 'B', 'B1', 'C', 'A2', 'tail'],
  loopFrom: 1,
};
