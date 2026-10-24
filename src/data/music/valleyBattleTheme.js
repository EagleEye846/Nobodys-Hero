import { chordLine, sustained, arpeggio } from '../../audio/notation.js';
import {
  BAR, tune, rest, held, onNotes, heldNotes, stopdown, after, fills, every, once,
  BUILD_8THS, BUILD_16THS, FILL, hits, repeat, transpose, midi, patter, cells,
} from './parts/chapter3.js';

// "Still Here": the battle theme in the Hollow Valley and its dead city,
// once Bramble has gone home and it's the hero and Ves again, she on her
// crutch with no umbrella. "Bramble Rush"'s sibling (the same brassy
// sawtooth hero, the same drive), but built on the city's own sound: the
// rain from "What They Built for Him" (valleyTheme.js), D A E, a stack of
// fifths, now in hard 16ths on the piano and never changing, while the bass
// underneath turns it into Bm11, Gmaj9, the Lydian C, and F# minor with the
// flat sixth on top. The hook is the hero's fifth from "Updraft", B up to
// F#, the way it fell into B minor in the Pinefall. Then the two bars where
// nobody answered him in the Pinefall: this time someone does. Her motif
// on the oboe, the tender form, but limping, a beat held where her bad leg
// is; and the second time she can't finish it, so the hero plays the last
// bar for her. The toms limp with her, 3-3-2 all the way through. In the
// middle the heralds' fanfare, fallen into B minor as the city plays it, on
// low brass over the rain; then her motif whole, as it was, on a solo
// violin, while the bass creeps down; and at the end she answers all the
// way through, with the hero a third under her.
// B minor, 144 BPM, one step a 16th note: a bar is 1.67 seconds. The intro
// plays once (3s); then it loops from A, 52 bars, about 87 seconds:
//
//   intro   2 bars  the rain alone, a timpani roll, the hook's pickup
//   A       8 bars  THE HOOK: the hero's fifth in B minor over the rain
//   B       8 bars  the call, and her answer, limping; the call again, and
//                   the answer she can't finish, finished for her
//   C       8 bars  the fallen fanfare on horns and trombone, the rain
//                   going on over it as if nothing happened
//   break   8 bars  half time: her motif whole on a solo violin, the bass
//                   creeping down by semitones under the rain; a build
//   A2      8 bars  the hook, full: violins on it, her oboe holding the
//                   chords' colour notes, a breakbeat under the second half
//   B2      8 bars  the call, and this time her whole answer, the hero a
//                   third under her
//   turn    4 bars  the rain stops; G to F#, everything climbing; a dead beat

// --- The rain: the city's three notes, a stack of fifths, in 16ths. It
// never changes; the bass does. ---
const RAIN_CELL = 'D5 A5 E6';
const RAIN_SHAPE = [0, 2, 1, 2, 0, 2, 1, 2, 0, 2, 1, 2, 0, 2, 1, 2];
const rain = (bars) => patter(cells(RAIN_CELL, bars), RAIN_SHAPE);
// Its echo, an octave down on plucked violins, on the off-beats only.
const RAIN_LOW_CELL = 'D4 A4 E5';
const RAIN_PIZZ = ['.', '.', 2, '.', '.', '.', 1, '.', '.', '.', 2, '.', '.', '.', 1, '.'];
const rainPizz = (bars) => patter(cells(RAIN_LOW_CELL, bars), RAIN_PIZZ);

// --- The harmony, a bar each: what the bass makes of the rain. ---
const A_CHORDS = 'Bm G Em F#m Bm G C F#m';
const B_CHORDS = 'Bm G D A Bm G D A';
const C_CHORDS = 'Bm A G Em Bm G F#m F#m';
const BREAK_CREEP = 'B1 A#1 A1 G#1 G1 F#1 F1 F#1';
const BREAK_CHORDS = 'Bm Bm F#m F#m G G F#m F#m'; // what the strings hold over it

// --- The hook: the hero's fifth, B up to F#, and C# over G, the sharp
// eleventh, the city's Lydian light. Each token an 8th. ---
const HOOK = tune(`
  B4 - F#5 - - E5 F#5 A5 | G5 - F#5 - D5 - B4 - | E5 - G5 - B5 - - A5 | C#6 - - - A5 - E5 - |
  B4 - F#5 - - E5 F#5 B5 | D6 - C#6 B5 - A5 G5 F#5 | E5 - G5 - C6 - B5 A5 | F#5 - - - C#5 - . . |
`);
const PICKUP = tune('. . . . . . . . | . . . . . . C#5 D5');

// --- The call, and her answer. ---
const CALL = 'B4 - F#5 - - E5 F#5 A5 | G5 - F#5 - D5 - B4 -';
const CALL_AGAIN = 'B4 - F#5 - - E5 F#5 B5 | D6 - C#6 B5 - A5 G5 F#5';
// Her motif (C C A, Bb G A), tender, in B minor; limping: the second note
// held back a beat, as if she's leaning on the stick to reach it.
const HER_LIMP = 'F#5 - . F#5 D6 - - - | E6 - C#6 - D6 - - -';
const HER_LIMP_HALF = 'F#5 - . F#5 D6 - - - | . . . . . . . .';
// The bar she can't finish, on the hero's lead.
const FINISHED_FOR_HER = '. . . . . . . . | E5 - C#5 - D5 - - -';
// Her motif whole, as it was before the marsh.
const HER_WHOLE = 'F#5/F#5 D6 - - E6 C#6 D6 - | - - - - . . . .';
const HER_ANSWER = 'F#5/F#5 D6 - - E6 C#6 D6 - | E6 - F#6 - D6 - - -';
const HIS_THIRD = 'D5/D5 B5 - - C#6 A5 B5 - | C#6 - D6 - B5 - - -';

const SILENT2 = '. . . . . . . . | . . . . . . . .';
const LEAD_B = tune([CALL, SILENT2, CALL_AGAIN, FINISHED_FOR_HER].join(' | '));
const OBOE_B = tune([SILENT2, HER_LIMP, SILENT2, HER_LIMP_HALF].join(' | '));
const LEAD_B2 = tune([CALL, HIS_THIRD, CALL_AGAIN, HIS_THIRD].join(' | '));
const OBOE_B2 = tune([SILENT2, HER_ANSWER, SILENT2, HER_ANSWER].join(' | '));

// --- The heralds' fanfare (stairTheme.js), fallen into B minor, and its
// answer. ---
const FALLEN = tune(`
  F#4 - B4 - D5 - F#5 - | E5 - - C#5 A4 - C#5 - | D5 - - - B4 - G4 - | B4 - - - - - . . |
  F#4 - B4 - D5 - F#5 - | G5 - - F#5 E5 - D5 - | C#5 - - - E5 - F#5 - | F#5 - - - - - . . |
`);

// --- The break: her motif whole on the solo violin, twice, the second
// time lower; then a run up. ---
const BREAK_VIOLIN = tune([HER_WHOLE, 'F#4/F#4 D5 - - E5 C#5 B4 - | - - - - . . . .'].join(' | '));
const RUN_UP = tune('F#4 - G4 - A4 - B4 - | C#5 - D5 - E5 - . .');

// --- The riser: G to F# (the flat sixth to the dominant), climbing. ---
const RISER = tune('G4 - B4 - D5 - G5 - | B5 - - - A5 - G5 - | F#5 - A#5 - C#6 - E6 - | F#6 - - - - - . .');

// --- Patterns, a bar each. ---
const STAB_HI = ['.', '.', 'third', '.', '.', '.', 'third', '.', '.', '.', 'third', '.', '.', '.', 'third', '.'];
const STAB_LO = ['.', '.', 7, '.', '.', '.', 7, '.', '.', '.', 7, '.', '.', '.', 7, '.'];
const BOUNCE = [0, '.', '.', 0, 12, '.', 0, '.', 0, '.', '.', 0, 12, '.', 0, '.'];
const PEDAL_8THS = [0, '.', 0, '.', 0, '.', 0, '.', 0, '.', 0, '.', 0, '.', 0, '.'];
const QUARTERS = [0, '.', '.', '.', 0, '.', '.', '.', 0, '.', '.', '.', 0, '.', '.', '.'];
const RIPPLE = [0, '-', 7, '-', 12, '-', 'tenth', '-', 12, '-', 7, '-', 0, '-', 7, '-'];

// --- Drums. The toms limp with her: 3, 3, 2. ---
const KICK = hits('x.....x. x..x....');
const KICK_HALF = hits('x....... x.......');
const FOUR = hits('x...x... x...x...');
const SNARE = hits('....x... ....x..x');
const SNARE_HALF = hits('........ x.......');
const HAT = hits('x.x.x.x. x.x.x.x.');
const HAT_16 = hits('xxxxxxxx xxxxxxxx');
const OPEN_HAT = hits('..x...x. ..x...x.');
const BREAKBEAT = hits('....x... .x..x.x.');
const LIMP = hits('x..x..x. x..x..x.');

// The rhythm section under any 8 bars of chords.
const band = (chords) => ({
  stabHi: chordLine(chords, STAB_HI, 4),
  stabLo: chordLine(chords, STAB_LO, 3),
  pizz: chordLine(chords, BOUNCE, 2),
  bass: chordLine(chords, BOUNCE, 1),
});
// An 8-bar kit: groove, a fill every fourth bar, a crash every fourth.
const kit = (bars = 8) => ({
  kick: repeat(KICK, bars),
  snare: fills(SNARE, FILL, bars, 4),
  hat: repeat(HAT, bars),
  openHat: repeat(OPEN_HAT, bars),
  crash: every(bars, 4),
});

export const VALLEY_BATTLE_THEME = {
  title: 'Still Here',
  bpm: 144,
  stepsPerBeat: 4,
  volume: 0.9,

  instruments: {
    // The hero: the same brassy sawtooth as "Updraft" and "Bramble Rush".
    lead: {
      wave: 'sawtooth', volume: 0.05, attack: 0.01, decay: 0.15, sustain: 0.7, release: 0.06, gate: 0.9,
      vibrato: { rate: 5.5, depth: 12 },
      filter: { type: 'lowpass', frequency: 4000 },
      pan: -0.12,
    },
    leadLow: { wave: 'square', volume: 0.028, attack: 0.01, decay: 0.15, sustain: 0.7, release: 0.06, gate: 0.9, filter: { type: 'lowpass', frequency: 2500 }, pan: -0.12 },
    // Ves: a real oboe, a little to the right of him.
    oboe: { sample: 'oboe', volume: 0.36, attack: 0.03, release: 0.25, reverb: 0.4, pan: 0.22, humanize: { time: 0.008, volume: 0.1 } },
    fiddle: { sample: 'soloViolin', volume: 0.3, attack: 0.04, release: 0.3, reverb: 0.45, pan: 0.15, humanize: { time: 0.008, volume: 0.1 } },
    // The city's rain: a close piano, and its echo on plucked violins.
    rain: { sample: 'grandPiano', volume: 0.16, ring: true, reverb: 0.35, pan: 0.1, humanize: { time: 0.004, volume: 0.18 } },
    rainPizz: { sample: 'violinsPizz', volume: 0.16, release: 0.05, reverb: 0.3, pan: 0.3, humanize: { time: 0.005, volume: 0.15 } },
    stabHi: { sample: 'violinsSpic', volume: 0.15, release: 0.05, reverb: 0.25, pan: 0.3, humanize: { time: 0.005, volume: 0.15 } },
    stabLo: { sample: 'cellosSpic', volume: 0.18, release: 0.05, reverb: 0.2, pan: -0.2, humanize: { time: 0.005, volume: 0.15 } },
    // Real plucked basses, with a sawtooth sub under them for the punch.
    pizz: { sample: 'bassSpic', volume: 0.42, release: 0.06, reverb: 0.15, humanize: { time: 0.005, volume: 0.12 } },
    bass: { wave: 'sawtooth', volume: 0.09, attack: 0.003, decay: 0.08, sustain: 0.7, release: 0.03, gate: 0.8, filter: { type: 'lowpass', frequency: 600 } },
    harp: { sample: 'harp', volume: 0.24, ring: true, reverb: 0.4, pan: -0.3, humanize: { time: 0.012, volume: 0.2 } },
    // The fallen fanfare: horns, and a trombone under them.
    horns: { sample: 'horns', volume: 0.3, attack: 0.03, release: 0.35, reverb: 0.4, pan: -0.15 },
    trombone: { sample: 'trombone', volume: 0.26, attack: 0.03, release: 0.3, reverb: 0.35, pan: 0.1 },
    violins: { sample: 'violins', volume: 0.2, attack: 0.05, release: 0.35, reverb: 0.38, pan: 0.25 },
    cellos: { sample: 'cellos', volume: 0.26, attack: 0.05, release: 0.4, reverb: 0.32, pan: -0.25 },
    // The kit, and the city's stone percussion.
    kick: { drum: 'kick', volume: 0.55 },
    snare: { drum: 'snare', volume: 0.3 },
    hat: { drum: 'hat', volume: 0.05 },
    openHat: { drum: 'openHat', volume: 0.06 },
    crash: { drum: 'crash', volume: 0.1 },
    boom: { sample: 'concertBassDrum', drum: 'sample', volume: 0.4, ring: true, reverb: 0.35 },
    toms: { sample: 'tenorDrum', drum: 'sample', volume: 0.36, ring: true, reverb: 0.3, humanize: { time: 0.004, volume: 0.15 } },
    rim: { sample: 'frameDrum', drum: 'sample', volume: 0.3, ring: true, reverb: 0.3, humanize: { time: 0.003, volume: 0.2 } },
    roll: { sample: 'snare', drum: 'sample', volume: 0.16, release: 0.08, reverb: 0.3, humanize: { time: 0.003, volume: 0.25 } },
    timpRoll: { sample: 'timpaniRoll', volume: 0.45, release: 0.3, reverb: 0.3 },
  },

  sections: {
    // The rain alone on B, a timpani roll, and the hook's pickup.
    intro: {
      rain: rain(2),
      pizz: onNotes('B1 B1', PEDAL_8THS),
      timpRoll: held(midi('F#2'), 2 * BAR),
      roll: [...rest(1), ...BUILD_16THS],
      lead: PICKUP,
    },

    // THE HOOK, over the rain; the toms start to limp halfway.
    A: {
      lead: HOOK,
      leadLow: transpose(HOOK, -12),
      rain: rain(8),
      ...band(A_CHORDS),
      toms: after(4, repeat(LIMP, 8)),
      ...kit(),
    },

    // The call, and her answer, limping; the call again, and the answer she
    // can't finish, which he finishes. Under her bars, only the rain, the
    // bass and the toms.
    B: {
      lead: LEAD_B,
      leadLow: transpose(LEAD_B, -12),
      oboe: OBOE_B,
      rain: rain(8),
      rainPizz: rainPizz(8),
      cellos: sustained(B_CHORDS, BAR, 0, 3),
      ...band(B_CHORDS),
      toms: repeat(LIMP, 8),
      ...kit(),
    },

    // The fallen fanfare on low brass; the rain goes on over it.
    C: {
      horns: transpose(FALLEN, -12),
      trombone: transpose(FALLEN, -24),
      rain: rain(8),
      rainPizz: rainPizz(8),
      violins: sustained(C_CHORDS, BAR, 1, 4),
      cellos: sustained(C_CHORDS, BAR, 0, 3),
      pizz: chordLine(C_CHORDS, QUARTERS, 2),
      bass: chordLine(C_CHORDS, QUARTERS, 1),
      boom: repeat(KICK_HALF, 8),
      toms: repeat(LIMP, 8),
      kick: repeat(KICK_HALF, 8),
      snare: repeat(SNARE_HALF, 8),
      crash: every(8, 4),
    },

    // Half time. Her motif whole on the solo violin, the bass creeping down
    // by semitones under the rain; then a run up and a roll.
    break: {
      fiddle: [...BREAK_VIOLIN, ...rest(4)],
      rain: rain(8),
      harp: arpeggio(BREAK_CHORDS, BAR, 3, RIPPLE),
      violins: sustained(BREAK_CHORDS, BAR, 1, 4),
      pizz: onNotes(BREAK_CREEP, QUARTERS),
      bass: heldNotes(BREAK_CREEP, BAR),
      kick: [...repeat(KICK_HALF, 6), ...repeat(FOUR, 2)],
      boom: repeat(KICK_HALF, 8),
      roll: [...rest(6), ...BUILD_8THS, ...BUILD_16THS],
      timpRoll: [...rest(6), ...held(midi('F#2'), 2 * BAR)],
      lead: [...rest(6), ...RUN_UP],
    },

    // The hook, full: violins on it with him, her oboe holding long notes,
    // the harp, and a breakbeat under the second half.
    A2: {
      lead: HOOK,
      leadLow: transpose(HOOK, -12),
      violins: HOOK,
      oboe: heldNotes('D5 B4 G5 A5 F#5 D5 E5 C#5', BAR),
      harp: arpeggio(A_CHORDS, BAR, 3, RIPPLE),
      rain: rain(8),
      rainPizz: rainPizz(8),
      cellos: sustained(A_CHORDS, BAR, 0, 3),
      ...band(A_CHORDS),
      toms: repeat(LIMP, 8),
      ...kit(),
      hat: [...repeat(HAT, 4), ...repeat(HAT_16, 4)],
      rim: after(4, repeat(BREAKBEAT, 8)),
    },

    // The call again, and this time she answers all the way, him a third
    // under her.
    B2: {
      lead: LEAD_B2,
      leadLow: transpose(LEAD_B2, -12),
      oboe: OBOE_B2,
      fiddle: OBOE_B2,
      rain: rain(8),
      rainPizz: rainPizz(8),
      violins: sustained(B_CHORDS, BAR, 1, 4),
      cellos: sustained(B_CHORDS, BAR, 0, 3),
      ...band(B_CHORDS),
      toms: repeat(LIMP, 8),
      ...kit(),
    },

    // The rain stops. G to F#, everything climbing, the drums tightening
    // into a roll; and a dead beat before the hook.
    turn: stopdown({
      lead: RISER,
      leadLow: transpose(RISER, -12),
      violins: transpose(RISER, -12),
      horns: sustained('G G F# F#', BAR, 1, 3),
      cellos: sustained('G G F# F#', BAR, 0, 3),
      stabHi: chordLine('G G F# F#', STAB_HI, 4),
      stabLo: chordLine('G G F# F#', STAB_LO, 3),
      pizz: onNotes('G1 G1 F#1 F#1', PEDAL_8THS),
      bass: onNotes('G0 G0 F#0 F#0', PEDAL_8THS),
      kick: repeat(FOUR, 4),
      boom: repeat(FOUR, 4),
      snare: [...BUILD_8THS, ...BUILD_8THS, ...BUILD_16THS, ...BUILD_16THS],
      hat: repeat(HAT_16, 4),
      crash: once(4),
      timpRoll: [...rest(2), ...held(midi('F#2'), 2 * BAR)],
    }),
  },

  // The intro plays once; then the fight goes round from the hook.
  order: ['intro', 'A', 'B', 'C', 'break', 'A2', 'B2', 'turn'],
  loopFrom: 1,
};
