import { chordLine, sustained, arpeggio } from '../../audio/notation.js';
import { BELLS } from '../../audio/instruments.js';
import {
  BAR, tune, riff, rest, held, onNotes, heldNotes, stopdown, after, fills, every, once,
  HERO_CALL, HIT, BUILD_8THS, BUILD_16THS, FILL, hits, repeat, transpose, midi,
} from './parts/chapter3.js';

// "Bramble Rush": the battle theme in the Pinefall, Chapter 3's scarlet wood,
// where the hero fights alone. "Updraft"'s sibling (same brassy sawtooth
// hero, same drive), but built on the forest's own tune: "The Scarlet
// Waltz" crammed from 3/4 into 4/4, two waltz bars to every bar of this, so
// the tune the player has been wandering to becomes the hook they fight to
// (Fox's re-barring trick: same notes, new meter, and it reads as new). The
// waltz's harmony comes with it at double speed, Neapolitan Eb and all, and
// so does its bass, which stops following the chords halfway and creeps down
// by semitones (darkness from the bass, not the tune). The real spiccato
// strings that played the waltz's pah-pah now stab the off-beats, and the
// waltz's violin saws the hook. In the middle, the hero's own call from
// "Updraft", D up to A, and then the two bars where Ves used to answer: a
// hole, with nothing in it but the drums. The second time round, a music box
// answers from somewhere far off with her motif in its tender D minor form.
// D minor, lifting to F major for the glade; 140 BPM (Rude Buster's tempo),
// one step a 16th note. The intro plays once (3s); then it loops from A, 52
// bars, about 89 seconds:
//
//   intro  2 bars  twig snaps and the bass alone, a roll
//   A      8 bars  THE HOOK: the waltz in 4/4, bass creeping under its half
//   B      8 bars  the hero's call, the hole where she answered, the hero's
//                  call again and his own answer
//   C      8 bars  the glade: the hook in F major (the same tune, re-moded)
//                  with the fiddle and a harp
//   break  8 bars  half time, the forest closing in: her motif on a music
//                  box, then the box falling a semitone every two beats over
//                  a bass falling one every bar, wind, and a build
//   A2     8 bars  the hook, full: fiddle, a horn countermelody from the
//                  waltz, the harp, a breakbeat under the second half
//   B2     8 bars  the call again; this time the music box answers
//   turn   4 bars  the Neapolitan riser, Eb to A, and a dead beat

const HOOK_CHORDS = 'Dm Dm Gm Gm Bb A Dm A Dm Dm Gm Gm Eb A Dm Dm'; // one per half bar
const B_CHORDS = 'Dm Dm Bb Bb C C A A Dm Dm Bb Bb C C A A';
const C_CHORDS = 'F C Dm Bb F C Gm C F C Dm Bb Gm Bb C C';
const BREAK_CHORDS = 'Dm Dm Bb Bb Gm Gm A A'; // one per bar
const TURN_CHORDS = 'Eb Eb Eb Eb A A A A';
// The waltz's creeping bass: a semitone down each step, whatever the chord.
const CREEP = 'D2 C#2 C2 B1 Bb1 A1 D2 A1';
const CREEP_LONG = 'D2 C#2 C2 B1 Bb1 A1 G#1 A1';

// --- The hook: the waltz's sixteen bars as eight, its three-beat figures
// landing as a 3-3-2. Each token a 16th. ---
const HOOK = riff(`
  A4 - - D5 - - F5 - E5 - - D5 - - . . | Bb4 - - D5 - - G5 - F5 - - E5 - - . . |
  D5 - - F5 - - Bb5 - A5 - G5 - F5 - E5 - | F5 - E5 - D5 - - - C#5 - - - - - . . |
  A4 - - D5 - - F5 - A5 - - G#5 - - . . | G5 - - Bb5 - - D6 - C#6 - - D6 - - . . |
  Bb5 - G5 - Eb5 - C#5 - E5 - G5 - F5 - E5 - | D5 - - - - - - - . . . . E4 - G4 - |
`);
// The same tune in F major: the glade, where the light gets in.
const HOOK_MAJOR = riff(`
  C5 - - F5 - - A5 - G5 - - F5 - - . . | D5 - - F5 - - Bb5 - A5 - - G5 - - . . |
  F5 - - A5 - - D6 - C6 - Bb5 - A5 - G5 - | A5 - G5 - F5 - - - E5 - - - - - . . |
  C5 - - F5 - - A5 - C6 - - B5 - - . . | A5 - - D6 - - F6 - D6 - - C6 - - . . |
  D6 - Bb5 - G5 - E5 - F5 - A5 - C6 - Bb5 - | A5 - - - - - . . . . . . . . . . |
`);
// The waltz's horn countermelody, two waltz bars to a bar, in the horns' range.
const HORN_COUNTER = 'D3 C#3 D3 Bb2 F3 E3 A2 E3 F3 E3 D3 E3 G3 E3 A2 D3';

// --- The hero's call (his fifth), the hole, the call again, and his answer
// to himself. Each token an 8th. ---
const CALL_AGAIN = 'D5 - A5 - - G5 A5 D6 | F6 - E6 D6 - C6 Bb5 A5';
const HIS_ANSWER = 'G5 - C6 - - Bb5 A5 G5 | A5 - - - E5 - C#5/D5 E5';
const CALLS = [...tune(HERO_CALL), ...rest(2), ...tune(CALL_AGAIN), ...tune(HIS_ANSWER)];
// Her motif, tender, at half speed, the way her own theme plays it in D minor.
const HER_GHOST = tune('A4 A4 F5 - - - - - | G5 - E5 - F5 - - -');
// The waltz's lost-in-the-wood line: the music box falling a semitone every
// two beats.
const FALLING = tune('D6 - - - C#6 - - - | C6 - - - B5 - - - | Bb5 - - - A5 - - - | G#5 - - - A5 - - -');
// The run up out of the break into the hook.
const RUN_UP = tune('D4 - E4 - F4 - G4 - | A4 - Bb4 - C#5 - . .');
// The riser: the Neapolitan, then the dominant, climbing to a stop.
const RISER = tune('Eb5 - G5 - Bb5 - D6 - | Eb6 - - - D6 - Bb5 - | C#6 - E6 - G6 - A6 - | E6 - G6 - A6 - . .');

// --- Patterns, per half-bar chord (8 steps). ---
const STAB_HI = ['.', '.', 'third', '.', '.', '.', 'third', '.'];
const STAB_LO = ['.', '.', 7, '.', '.', '.', 7, '.'];
// The bass: the root, a kick before the second beat, the octave on it.
const BOUNCE = [0, '.', '.', 0, 12, '.', 0, '.'];
const PEDAL_8THS = [0, '.', 0, '.', 0, '.', 0, '.'];
const RIPPLE8 = [0, '-', 7, '-', 12, '-', 'tenth', '-'];
const QUARTERS = [0, '.', '.', '.', 0, '.', '.', '.', 0, '.', '.', '.', 0, '.', '.', '.'];

// --- Drums. ---
const KICK = hits('x.....x. x..x....');
const KICK_HALF = hits('x....... x.......');
const FOUR = hits('x...x... x...x...');
const SNARE = hits('....x... ....x..x');
const HAT = hits('x.x.x.x. x.x.x.x.');
const HAT_16 = hits('xxxxxxxx xxxxxxxx');
const OPEN_HAT = hits('..x...x. ..x...x.');
const BREAKBEAT = hits('....x... .x..x.x.');
const GALLOP = hits('x..x..x. x..x..x.');
const TWIGS = hits('x..x..x. ..x..x..');

// The two bars where she'd answer: a track that sits them out.
const hole = (track) => [...track.slice(0, 2 * BAR), ...rest(2), ...track.slice(4 * BAR)];

// The rhythm section under any 8 bars of half-bar chords.
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

// A gust: no note, just air, sweeping up and opening out as it blows.
const GUST = {
  voices: [{ wave: 'sine', level: 0 }],
  sweep: { from: 300, to: 5000, time: 2.4, q: 1.4 },
  attack: 1.2, decay: 1.5, sustain: 0.8, release: 0.7, gate: 1,
  breath: { level: 1, frequency: 1400, q: 0.5 },
  pan: -0.3,
  reverb: 0.4,
};

export const PINEFALL_BATTLE_THEME = {
  title: 'Bramble Rush',
  bpm: 140,
  stepsPerBeat: 4,
  volume: 0.9,

  instruments: {
    // The hero: Cotton Clash's brassy sawtooth, a square an octave under it.
    lead: {
      wave: 'sawtooth', volume: 0.05, attack: 0.01, decay: 0.15, sustain: 0.7, release: 0.06, gate: 0.9,
      vibrato: { rate: 5.5, depth: 12 },
      filter: { type: 'lowpass', frequency: 4000 },
      pan: -0.12,
    },
    leadLow: { wave: 'square', volume: 0.028, attack: 0.01, decay: 0.15, sustain: 0.7, release: 0.06, gate: 0.9, filter: { type: 'lowpass', frequency: 2500 }, pan: -0.12 },
    // The waltz's violin, sawing the hook.
    fiddle: { sample: 'soloViolin', volume: 0.3, attack: 0.01, release: 0.12, reverb: 0.35, pan: 0.2, humanize: { time: 0.006, volume: 0.1 } },
    // The waltz's pah-pah strings, stabbing off the beat.
    stabHi: { sample: 'violinsSpic', volume: 0.18, release: 0.05, reverb: 0.25, pan: 0.3, humanize: { time: 0.005, volume: 0.15 } },
    stabLo: { sample: 'cellosSpic', volume: 0.2, release: 0.05, reverb: 0.2, pan: -0.2, humanize: { time: 0.005, volume: 0.15 } },
    // Real plucked basses, with a sawtooth sub under them for the punch.
    pizz: { sample: 'bassSpic', volume: 0.42, release: 0.06, reverb: 0.15, humanize: { time: 0.005, volume: 0.12 } },
    bass: { wave: 'sawtooth', volume: 0.09, attack: 0.003, decay: 0.08, sustain: 0.7, release: 0.03, gate: 0.8, filter: { type: 'lowpass', frequency: 600 } },
    harp: { sample: 'harp', volume: 0.26, ring: true, reverb: 0.4, pan: -0.3, humanize: { time: 0.012, volume: 0.2 } },
    hornsSoft: { sample: 'hornsSoft', volume: 0.32, attack: 0.15, release: 0.4, reverb: 0.4, pan: -0.1 },
    violins: { sample: 'violins', volume: 0.2, attack: 0.05, release: 0.35, reverb: 0.38, pan: 0.25 },
    cellos: { sample: 'cellos', volume: 0.26, attack: 0.05, release: 0.4, reverb: 0.32, pan: -0.25 },
    // Her music box, far off, with an echo.
    musicBox: { ...BELLS, volume: 0.075, echo: { time: 0.43, feedback: 0.35, mix: 0.3 } },
    gust: { ...GUST, volume: 0.06 },
    // The kit, and the forest's percussion: toms galloping, twigs snapping.
    kick: { drum: 'kick', volume: 0.55 },
    snare: { drum: 'snare', volume: 0.3 },
    hat: { drum: 'hat', volume: 0.05 },
    openHat: { drum: 'openHat', volume: 0.06 },
    crash: { drum: 'crash', volume: 0.1 },
    boom: { drum: 'boom', volume: 0.3 },
    toms: { sample: 'tenorDrum', drum: 'sample', volume: 0.4, ring: true, reverb: 0.25, humanize: { time: 0.004, volume: 0.15 } },
    rim: { sample: 'snareSoft', drum: 'sample', volume: 0.28, ring: true, reverb: 0.3, humanize: { time: 0.003, volume: 0.2 } },
    roll: { sample: 'snare', drum: 'sample', volume: 0.16, release: 0.08, reverb: 0.3, humanize: { time: 0.003, volume: 0.25 } },
    timpRoll: { sample: 'timpaniRoll', volume: 0.45, release: 0.3, reverb: 0.3 },
  },

  sections: {
    // Twig snaps and the bass pulsing on D; a roll, and the hook's pickup.
    intro: {
      rim: repeat(TWIGS, 2),
      pizz: onNotes('D2 D2 D2 D2', PEDAL_8THS),
      bass: onNotes('D1 D1 D1 D1', PEDAL_8THS),
      boom: repeat(KICK_HALF, 2),
      roll: [...rest(1), ...BUILD_16THS],
      lead: [...rest(1), ...riff('. . . . . . . . . . . . E4 - G4 -')],
    },

    // THE HOOK. The waltz in 4/4 on the hero's sawtooth, the strings stabbing
    // off the beat; under the second half the bass stops following the
    // chords and creeps down by semitones, and the toms start to gallop.
    A: {
      lead: HOOK,
      leadLow: transpose(HOOK, -12),
      ...band(HOOK_CHORDS),
      pizz: [...chordLine('Dm Dm Gm Gm Bb A Dm A', BOUNCE, 2), ...onNotes(CREEP, BOUNCE)],
      bass: [...chordLine('Dm Dm Gm Gm Bb A Dm A', BOUNCE, 1), ...onNotes(CREEP, BOUNCE).map((s) => (typeof s === 'number' ? s - 12 : s))],
      toms: after(4, repeat(GALLOP, 8)),
      ...kit(),
    },

    // The hero's call, and the hole: two bars where Ves answered on the
    // mountain, with nothing in them now but the kick, the bass and the toms.
    // Then he calls again and answers himself.
    B: {
      lead: CALLS,
      leadLow: transpose(CALLS, -12),
      cellos: sustained(B_CHORDS, 8, 0, 3),
      ...band(B_CHORDS),
      stabHi: hole(chordLine(B_CHORDS, STAB_HI, 4)),
      stabLo: hole(chordLine(B_CHORDS, STAB_LO, 3)),
      toms: [...rest(2), ...repeat(GALLOP, 2), ...rest(4)],
      ...kit(),
      snare: hole(fills(SNARE, FILL, 8, 4)),
      hat: hole(repeat(HAT, 8)),
      openHat: hole(repeat(OPEN_HAT, 8)),
    },

    // The glade: the hook in F major, the fiddle on it with the hero, a harp
    // rippling, the strings warm underneath.
    C: {
      lead: HOOK_MAJOR,
      leadLow: transpose(HOOK_MAJOR, -12),
      fiddle: HOOK_MAJOR,
      harp: arpeggio(C_CHORDS, 8, 4, RIPPLE8),
      violins: sustained(C_CHORDS, 8, 2, 4),
      cellos: sustained(C_CHORDS, 8, 0, 3),
      ...band(C_CHORDS),
      toms: after(4, repeat(GALLOP, 8)),
      ...kit(),
    },

    // Half time. The forest closes in: her motif, tender, on a music box;
    // then the box falls a semitone every two beats while the bass falls one
    // every bar and the strings hold chords that neither belongs to; the
    // wind; and a run up with a roll back into the hook.
    break: {
      musicBox: [...HER_GHOST, ...FALLING, ...rest(2)],
      violins: sustained(BREAK_CHORDS, BAR, 1, 4),
      cellos: sustained(BREAK_CHORDS, BAR, 0, 3),
      pizz: onNotes(CREEP_LONG, QUARTERS),
      bass: heldNotes(CREEP_LONG, BAR),
      gust: [...held(60, 3 * BAR), ...rest(1), ...held(60, 3 * BAR), ...rest(1)],
      kick: [...repeat(KICK_HALF, 6), ...repeat(FOUR, 2)],
      boom: repeat(KICK_HALF, 8),
      roll: [...rest(6), ...BUILD_8THS, ...BUILD_16THS],
      timpRoll: [...rest(6), ...held(midi('A2'), 2 * BAR)],
      lead: [...rest(6), ...RUN_UP],
    },

    // The hook, full: the fiddle and the hero together, the waltz's horn
    // line answering in long notes, the harp, a string pad, and under the
    // second half a breakbeat on top of the kit.
    A2: {
      lead: HOOK,
      leadLow: transpose(HOOK, -12),
      fiddle: HOOK,
      hornsSoft: heldNotes(HORN_COUNTER, 8),
      harp: arpeggio(HOOK_CHORDS, 8, 4, RIPPLE8),
      violins: sustained(HOOK_CHORDS, 8, 1, 4),
      ...band(HOOK_CHORDS),
      pizz: [...chordLine('Dm Dm Gm Gm Bb A Dm A', BOUNCE, 2), ...onNotes(CREEP, BOUNCE)],
      bass: [...chordLine('Dm Dm Gm Gm Bb A Dm A', BOUNCE, 1), ...onNotes(CREEP, BOUNCE).map((s) => (typeof s === 'number' ? s - 12 : s))],
      toms: repeat(GALLOP, 8),
      ...kit(),
      hat: [...repeat(HAT, 4), ...repeat(HAT_16, 4)],
      rim: after(4, repeat(BREAKBEAT, 8)),
    },

    // The call again, and this time something answers: a music box, far off,
    // with her motif. Then his answer, with the fiddle on it.
    B2: {
      lead: CALLS,
      leadLow: transpose(CALLS, -12),
      fiddle: CALLS,
      musicBox: [...rest(2), ...HER_GHOST, ...rest(4)],
      cellos: sustained(B_CHORDS, 8, 0, 3),
      violins: hole(sustained(B_CHORDS, 8, 1, 4)),
      ...band(B_CHORDS),
      stabHi: hole(chordLine(B_CHORDS, STAB_HI, 4)),
      stabLo: hole(chordLine(B_CHORDS, STAB_LO, 3)),
      toms: [...rest(2), ...repeat(GALLOP, 2), ...rest(4)],
      ...kit(),
      snare: hole(fills(SNARE, FILL, 8, 4)),
      hat: hole(repeat(HAT, 8)),
      openHat: hole(repeat(OPEN_HAT, 8)),
    },

    // The riser: the waltz's Neapolitan, Eb, then A, everything climbing,
    // the drums tightening into a roll; and a dead beat before the hook.
    turn: stopdown({
      lead: RISER,
      leadLow: transpose(RISER, -12),
      fiddle: RISER,
      violins: sustained('Eb Eb A A', BAR, 1, 4),
      cellos: sustained('Eb Eb A A', BAR, 0, 3),
      stabHi: chordLine(TURN_CHORDS, STAB_HI, 4),
      stabLo: chordLine(TURN_CHORDS, STAB_LO, 3),
      pizz: onNotes('Eb2 Eb2 Eb2 Eb2 A1 A1 A1 A1', PEDAL_8THS),
      bass: onNotes('Eb1 Eb1 Eb1 Eb1 A0 A0 A0 A0', PEDAL_8THS),
      kick: repeat(FOUR, 4),
      boom: repeat(FOUR, 4),
      snare: [...BUILD_8THS, ...BUILD_8THS, ...BUILD_16THS, ...BUILD_16THS],
      hat: repeat(HAT_16, 4),
      crash: once(4),
      timpRoll: [...rest(2), ...held(midi('A2'), 2 * BAR)],
    }),
  },

  // The intro plays once; then the fight goes round from the hook.
  order: ['intro', 'A', 'B', 'C', 'break', 'A2', 'B2', 'turn'],
  loopFrom: 1,
};
