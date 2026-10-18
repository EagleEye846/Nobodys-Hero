import { melody, chordLine, sustained, transpose, hits, repeat, midi } from '../../audio/notation.js';
import { BRASS, STACCATO_STRINGS, LOW_STRINGS, PIANO, CHOIR, TIMPANI, ORGAN, HORN, SOLO_VIOLIN } from '../../audio/instruments.js';


// "The Usurper of Dawn": the battle on the summit against the shade who
// stole the Hero's blade and killed Ves's mother. In the spirit of Toby
// Fox's "ASGORE", "Heartache", "Battle Against a True Hero" and "Hopes and
// Dreams": a full orchestra, organ and choir over a pounding beat, with no
// light in it at all until the very end, when Ves takes the light back.
//
//   HIS MOTIF (USURPER): Ves's motif turned inside out. Hers is two quick
//     notes, a leap up a sixth, an ache, and home (C C, up to A, Bb G A). His
//     has exactly her rhythm, but the leap is a minor sixth and the ache
//     creeps down through a tritone (D D, up to Bb, A G# A): a false Hero,
//     the hope she carries, curdled. It is tolled on a bell, growled on the
//     brass, chanted twice as slow by the choir round a diminished cycle,
//     mocked under the stolen fanfare, and finally drowned under her.
//   THE STOLEN FANFARE: the Long Stair's tune (stairTheme.js / vigilTheme.js),
//     the village's own fanfare for the Hero, dragged into D minor over a
//     bass that keeps sinking, and blared by him as if it were his. At the
//     very end it's taken back, in G major, on the horns.
//   HER MOTIF (VES_MOTIF): grieving in G minor on a lone violin, a music box
//     in the dark, a brave answer to him in the duel, and at the climax its
//     heroic form (it climbs on past the ache: B B, G, A B) over a tonic the
//     music refuses to reach until the bVI-bVII-I at bar 15: hard-won.
//
// Harmony: D minor, with chromatic basses sinking under everything (D C# C
// B Bb A G#), Neapolitan Eb chords, a dominant with a flat ninth, and a
// minor-third cycle (G, Bb, C#, E) for the dread. The climax is up a step,
// in E minor / G major. 4/4 at 160 BPM, one step is a 16th note. The intro
// plays once (12s); then the fight loops from A, 112 bars, 2m48s:
//
//   intro     8 bars  a church bell tolling his motif over an organ pedal,
//                     the low choir, low strings and a roll into the fight
//   A        16 bars  the fight: his motif growled on the brass over a
//                     chromatic bass, pounding 16th low strings, brass stabs
//   dread     8 bars  his motif twice as slow, chanted by the choir round a
//                     cycle of minor thirds; tribal drums, shuddering strings
//   stolen   16 bars  the village's fanfare, stolen, in minor, brass and
//                     choir at full cry; his motif mocking underneath
//   bridge   16 bars  G minor, half time: her motif grieving on a violin over
//                     a lament bass, then her own lead takes it up
//   hush      8 bars  a heartbeat, a music box playing her motif, and his
//                     crawling back in on the organ
//   duel     16 bars  call and response: his motif, her answer, two bars,
//                     then one, then both at once, climbing a key each time
//   climax   24 bars  up a step: her heroic motif blazing, full choir, his
//                     motif drowning under it; then the fanfare taken back
//   turn      8 bars  his motif crawling back, round to the fight

const BAR = 16;
const tune = (text) => melody(text, 2); // each token an 8th note
const rest = (bars) => Array(bars * BAR).fill('.');
const HOLD = '-';

// One note held for `bars` bars per name ('.' for a silent bar).
const held = (notes, bars = 1) => notes.split(/\s+/).filter(Boolean)
  .flatMap((n) => (n === '.' ? rest(bars) : [midi(n), ...Array(bars * BAR - 1).fill(HOLD)]));
// A bar of `pattern` (semitones) over each named bass note: the sinking
// basslines aren't chord roots, so they're written out note by note.
const over = (notes, pattern) => notes.split(/\s+/).filter(Boolean)
  .flatMap((n) => pattern.map((p) => (typeof p === 'number' ? midi(n) + p : p)));
// A chord progression with a different shape (or none) each bar.
function shapes(chords, perBar, octave) {
  return chords.split(' ').flatMap((chord, i) => (perBar[i] ? chordLine(chord, perBar[i], octave) : rest(1)));
}
const onlyBars = (steps, list) => steps.map((step, i) => (list.includes(Math.floor(i / BAR)) ? step : '.'));

// --- His motif, as semitones over a minor chord's root (D: D D Bb A G# A). ---
const HIS = [0, 0, 8, HOLD, HOLD, HOLD, HOLD, HOLD, 7, HOLD, 6, HOLD, 7, HOLD, HOLD, HOLD];

// --- Patterns, as semitones above each chord's root (or bass note). ---
// The racing strings: a pedal on the root, the chord flickering above it.
const RACE = [12, 0, 7, 0, 'tenth', 0, 7, 0, 12, 0, 7, 0, 'tenth', 0, 12, 7];
// For the dread: shuddering on the flat ninth.
const RACE_DREAD = [0, 12, 1, 12, 0, 12, 'third', 12, 0, 12, 1, 12, 0, 12, 7, 12];
// For the stolen fanfare: hammering the fifth.
const RACE_MARCH = [0, 7, 0, 7, 'third', 7, 12, 7, 0, 7, 0, 7, 'third', 7, 12, 'third'];
// Half time, for the bridge.
const RACE_HALF = [0, '.', 7, '.', 'tenth', '.', 7, '.', 12, '.', 7, '.', 'third', '.', 7, '.'];
// The climax: climbing all the way up the chord, every beat.
const RACE_HERO = [0, 7, 12, 'tenth', 19, 'tenth', 12, 7, 0, 7, 12, 'tenth', 19, 24, 19, 'tenth'];
// The low strings, digging in: 16ths, never stopping.
const CHUG = [0, 0, 12, 0, 0, 0, 12, 0, 0, 0, 12, 0, 0, 12, 0, 12];
const GALLOP = [0, '.', 0, 0, 0, '.', 0, 0, 0, '.', 0, 0, 0, '.', 0, 0];
const EIGHTHS = [0, HOLD, 0, HOLD, 0, HOLD, 0, HOLD, 0, HOLD, 0, HOLD, 0, HOLD, 0, HOLD];
const OOM = [0, HOLD, HOLD, HOLD, '.', '.', '.', '.', 7, HOLD, HOLD, HOLD, '.', '.', '.', '.'];
// Brass stabs, 3+3+2 against the beat.
const STAB = [0, HOLD, '.', 0, HOLD, '.', 0, HOLD, '.', '.', 0, HOLD, '.', '.', '.', '.'];
const STAB_THIRD = STAB.map((p) => (p === 0 ? 'third' : p));
// The choir chanting, on every 8th.
const CHANT = [0, '.', 0, '.', 7, '.', 0, '.', 0, '.', 0, '.', 7, '.', 12, '.'];
const ON_ONE = [0, ...Array(15).fill('.')];
const ONE_AND_THREE = [0, '.', '.', '.', '.', '.', '.', '.', 7, '.', '.', '.', '.', '.', '.', '.'];
const TIMP_DRIVE = [0, '.', 0, '.', 7, '.', 0, '.', 0, '.', 0, 0, 7, '.', 7, '.'];
const ROLL = [0, '.', 0, '.', 0, '.', 0, '.', 0, 0, 0, 0, 0, 0, 0, 0];
const PIANO_FALL = [24, '.', 19, '.', 'tenth', '.', 12, '.', 7, '.', 'third', '.', 0, HOLD, HOLD, HOLD];

// --- Drums. ---
const KICK_DRIVE = hits('x...x... x...x.x.');
const KICK_TRIBAL = hits('x..x..x. x..x..x.');
const KICK_8THS = hits('x.x.x.x. x.x.x.x.');
const KICK_HALF = hits('x....... ........');
const SNARE = hits('....x... ....x...');
const MARCH = hits('....x..x ....x.xx');
const SNARE_DREAD = hits('....x... ..x.x..x');
const FILL = hits('....x... x.x.xxxx');
const SNARE_HALF = hits('........ x.......');
const SNARE_ROLL = hits('x.x.x.x. xxxxxxxx');
const HAT = hits('x.x.x.x. x.x.x.x.');
const HAT_16 = hits('xxxxxxxx xxxxxxxx');
const QUARTER_HAT = hits('x...x... x...x...');
const OPEN_HAT = hits('..x...x. ..x...x.');
const HEARTBEAT = hits('x..x.... ........');
const QUICK_HEART = hits('x..x..x. x..x..x.');
function kit(bars, { kick = KICK_DRIVE, snare = SNARE, hat = HAT } = {}) {
  return {
    kick: repeat(kick, bars),
    snare: Array.from({ length: bars }, (_, i) => ((i + 1) % 8 === 0 ? FILL : snare)).flat(),
    hat: repeat(hat, bars),
  };
}
const crashOn = (bars, list) => Array.from({ length: bars }, (_, i) => (list.includes(i) ? hits('x...............') : rest(1))).flat();

// --- Chords (one a bar) and the basses under them. ---
const INTRO_CHORDS = 'Dm Dm Eb Eb Gm Gm A A';
const A_CHORDS = 'Dm A F G Gm Dm E A Dm Eb Dm Eb Bb Gm A A';
const A_BASS = 'D2 C#2 C2 B1 Bb1 A1 G#1 A1 D2 Eb2 D2 Eb2 Bb1 G1 A1 A1';
// Round a cycle of minor thirds, G, Bb, C#, E, to the dominant.
const DREAD_CHORDS = 'Gm Gm Bbm Bbm C#m C#m Em A';
const DREAD_BASS = 'G1 G1 Bb1 Bb1 C#2 C#2 E2 A1';
const STOLEN_CHORDS = 'Dm A Bb Dm Dm Gm Bb A Dm A Bb G Bb Gm A D';
const STOLEN_BASS = 'D2 C#2 Bb1 A1 F2 G2 Bb1 A1 D2 C#2 C2 B1 Bb1 A1 A1 D2';
const BRIDGE_CHORDS = 'Gm D F C Eb Bb Cm D Gm Eb Cm D Eb Cm D D';
const BRIDGE_BASS = 'G2 F#2 F2 E2 Eb2 D2 C2 D2 G2 Eb2 C2 F#2 G2 A2 A2 D2';
const HUSH_CHORDS = 'Dm Dm Gm Gm Bb Bb A A';
// Each pair of bars a key higher, to the bVI and bVII of the climax's key.
const DUEL_CHORDS = 'Dm Dm F Bb Em Em G C F#m A Gm Bb Cm D Eb F';
// E minor, withholding G major until the bVI-bVII-I at bars 13-15.
const CLIMAX_CHORDS = 'Em C G D Em C Am B C D Bm Em Eb F G G C D Em C Em Am Eb F';
const TURN_CHORDS = 'Dm A Eb Dm Bb Gm A A';
const TURN_BASS = 'F2 E2 Eb2 D2 Bb1 G1 A1 A1';

// --- Tunes. ---
// The intro: his motif tolled on a bell, then a half step higher, wronger.
const INTRO_TOLL = tune(`
  D4/D4 Bb4 - - A4 G#4 A4 - | . . . . . . . . | Eb4/Eb4 B4 - - Bb4 A4 Bb4 - | . . . . . . . . |
  . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . |
`);
// The low choir takes it up, twice as slow.
const INTRO_CHOIR = tune(`
  . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . |
  G3 - G3 - Eb4 - - - | D4 - C#4 - D4 - - - | . . . . . . . . | . . . . . . . . |
`);
// And the brass rises up the dominant with its flat ninth.
const INTRO_BRASS = tune(`
  . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . |
  . . . . . . . . | . . . . . . . . | A3 - - - C#4 - - - | E4 - - - G4 - Bb4 - |
`);
// A: his motif on the brass, and where it goes.
const LEAD_A = tune(`
  D5/D5 Bb5 - - A5 G#5 A5 - | E5 - - - G5 - - E5 | F5 - - - A5 - C6 - | B5 - - - - - A5 G5 |
  Bb5 - - - A5 - G5 - | F5 - - - E5 - D5 - | E5 - - - G#5 - B5 - | A5 - - - - - . . |
  D6/D6 Bb6 - - A6 G#6 A6 - | G6 - - - Eb6 - Bb5 - | A5/A5 F6 - - E6 D#6 E6 - | Eb6 - - - D6 - Bb5 - |
  D6 - - - C6 - Bb5 - | G5 - Bb5 - D6 - G6 - | F6 - - - E6 - C#6 - | E6 - - - - - . . |
`);
// The dread: his motif twice as slow, round the cycle of minor thirds.
const DREAD = tune(`
  G4 G4 Eb5 - - - - - | D5 - C#5 - D5 - - - | Bb4 Bb4 Gb5 - - - - - | F5 - E5 - F5 - - - |
  C#5 C#5 A5 - - - - - | G#5 - G5 - G#5 - - - | E5 E5 C6 - - - - - | B5 - A#5 - B5 - - - |
`);
// The stolen fanfare: the Long Stair's tune, dragged into D minor; the
// second time an octave up, over a bass sinking a half step a bar.
const STOLEN = tune(`
  A4 - D5 - F5 - A5 - | G5 - - E5 C#5 - E5 - | F5 - - - D5 - Bb4 - | D5 - - - - - . . |
  A4 - D5 - F5 - A5 - | Bb5 - A5 - G5 - E5 - | G5 - F5 - E5 - D5 - | E5 - - - - - . . |
  A5 - D6 - F6 - A6 - | G6 - - E6 C#6 - E6 - | F6 - - - D6 - Bb5 - | D6 - - - - - . . |
  A5 - D6 - F6 - A6 - | Bb6 - A6 - G6 - E6 - | F6 - E6 - D6 - C#6 - | D6 - - - - - . . |
`);
// The bridge: her motif grieving in G minor, remembering itself in F and Eb.
const BRIDGE = tune(`
  D5/D5 Bb5 - - C6 A5 Bb5 - | A5 - - - F#5 - D5 - | C5/C5 A5 - - Bb5 G5 A5 - | G5 - - - E5 - C5 - |
  Bb4/Bb4 G5 - - Ab5 F5 G5 - | F5 - - - D5 - Bb4 - | Eb5 - - - G5 - C6 - | F#5 - - - A5 - - - |
  G5 - - - Bb5 - D6 - | Eb6 - - - D6 - Bb5 - | G5/G5 Eb6 - - F6 D6 Eb6 - | D6 - - - C6 - A5 - |
  Bb5/Bb5 G6 - - Ab6 F6 G6 - | Eb6 - - - D6 - C6 - | D6 - - - A5 - F#5 - | A5 - - - - - . . |
`);
// The hush: her motif on a music box, minor, very far away...
const HUSH_BOX = tune(`
  A5/A5 F6 - - G6 E6 F6 - | D6 - - - - - . . | D6/D6 Bb6 - - C7 A6 Bb6 - | G6 - - - - - . . |
  . . . . . . . . | F6 - - - - - . . | . . . . . . . . | . . . . . . . . |
`);
// ...and his, crawling back in underneath on the organ.
const HUSH_ORGAN = tune(`
  . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . |
  D4/D4 Bb4 - - A4 G#4 A4 - | F4 - - - D4 - - - | A3/A3 F4 - - E4 D#4 E4 - | C#4 - - - - - - - |
`);
// The duel: his call...
const DUEL_HIS = tune(`
  D5/D5 Bb5 - - A5 G#5 A5 - | D6 - C6 - Bb5 - A5 G#5 | . . . . . . . . | . . . . . . . . |
  E5/E5 C6 - - B5 A#5 B5 - | E6 - D6 - C6 - B5 A#5 | . . . . . . . . | . . . . . . . . |
  F#5/F#5 D6 - - C#6 C6 C#6 - | . . . . . . . . | G5/G5 Eb6 - - D6 C#6 D6 - | . . . . . . . . |
  C5/C5 Ab5 - - G5 F#5 G5 - | D5/D5 Bb5 - - A5 G#5 A5 - | Eb5 - - - D5 - - - | C5 - - - - - . . |
`);
// ...and her answer, braver each time, until she's singing over him.
const DUEL_HERS = tune(`
  . . . . . . . . | . . . . . . . . | C5/C5 A5 - - Bb5 G5 A5 - | D5 - F5 - A5 - C6 - |
  . . . . . . . . | . . . . . . . . | D5/D5 B5 - - C6 A5 B5 - | E5 - G5 - B5 - D6 - |
  . . . . . . . . | E5/E5 C#6 - - D6 B5 C#6 - | . . . . . . . . | F5/F5 D6 - - Eb6 C6 D6 - |
  G5/G5 Eb6 - - F6 D6 Eb6 - | A5/A5 F#6 - - G6 E6 F#6 - | G5 - Bb5 - Eb6 - G6 - | F6 - - - A6 - - - |
`);
// The climax: her heroic motif (it climbs on past the ache), never quite
// home until the G at bar 15; then a counter-melody over the fanfare.
const CLIMAX_VES = tune(`
  B4/B4 G5 - A5 - B5 - - | C6 - - - B5 - G5 - | D5/D5 B5 - C6 - D6 - - | D6 - - - A5 - F#5 - |
  G5/G5 E6 - F#6 - G6 - - | E6 - - - D6 - C6 - | E5/E5 C6 - D6 - E6 - - | D#6 - - - F#6 - B5 - |
  E6 - - - D6 - E6 G6 | F#6 - - - D6 - A5 - | F#5/F#5 D6 - E6 - F#6 - - | G6 - - - - - E6 - |
  Bb5 - - - Eb6 - G6 - | F6 - - - A6 - - - | G6 - - - - - - - | - - - - - - . . |
  E5/E5 C6 - D6 - E6 - - | F#6 - - - - - D6 - | B5/B5 G6 - - F#6 - E6 - | G6 - - - E6 - C6 - |
  D6 - - - E6 - G6 - | A6 - - - - - E6 - | G6 - - - F6 - Eb6 - | F6 - - - - - . . |
`);
// The arrival: her heroic motif on the brass, under the held G...
const CLIMAX_ARRIVAL = tune(`
  D4/D4 B4 - C5 - D5 - - | G5 - - - - - . . |
`);
// ...then the stolen fanfare, taken back: in G major, on the horns.
const FANFARE = tune(`
  D4 - G4 - B4 - D5 - | C5 - - A4 F#4 - A4 - | B4 - - - G4 - E4 - | G4 - - - - - . . |
  D4 - G4 - B4 - D5 - | E5 - D5 - C5 - A4 - | Bb4 - - - G4 - Eb4 - | F4 - - - A4 - C5 - |
`);
// The turn: his motif crawling back, through the Neapolitan, to the fight.
const TURN_LEAD = tune(`
  D5/D5 Bb5 - - A5 G#5 A5 - | E5 - - - C#5 - A4 - | Eb5/Eb5 B5 - - Bb5 A5 Bb5 - | A5 - - - F5 - D5 - |
  Bb4/Bb4 Gb5 - - F5 E5 F5 - | D5 - - - Bb4 - G4 - | C#5 - E5 - G5 - Bb5 - | C#6 - - - - - . . |
`);

// --- Instruments. ---
// His lead: a growling, buzzing brass with a hollow undertone.
const HIS_LEAD = {
  voices: [{ wave: 'sawtooth', level: 0.6 }, { wave: 'square', octave: -1, level: 0.35 }, { wave: 'sawtooth', detune: 9, level: 0.3 }],
  filter: { type: 'lowpass', frequency: 2400 },
  attack: 0.01, decay: 0.15, sustain: 0.8, release: 0.08, gate: 0.92,
  vibrato: { rate: 5, depth: 10, delay: 0.2 },
  pan: -0.12,
};
// Her lead (as in "Updraft"), a little darker here.
const VES_LEAD = {
  voices: [{ wave: 'square', level: 0.45 }, { wave: 'triangle', octave: 1, level: 0.25 }, { wave: 'sine', level: 0.5 }],
  filter: { type: 'lowpass', frequency: 3400 },
  attack: 0.008, decay: 0.2, sustain: 0.78, release: 0.1, gate: 0.92,
  vibrato: { rate: 5.8, depth: 14, delay: 0.12 },
  breath: { level: 0.05, frequency: 3000, q: 0.8 },
  pan: 0.15,
  echo: { time: 0.281, feedback: 0.2, mix: 0.14 },
};
// A church bell on the summit: a deep hum under it, and a sour partial above.
const TOLL = {
  voices: [
    { harmonics: [1, 0.5, 0.3, 0.45, 0.1, 0.3, 0, 0.15], level: 0.8 },
    { wave: 'sine', octave: -1, level: 0.4 },
    { wave: 'sine', octave: 1, detune: 35, level: 0.18 },
  ],
  attack: 0.002, decay: 1.6, sustain: 0, release: 1.8, gate: 1,
  click: 0.05, reverb: 0.65,
};
const MUSIC_BOX = {
  voices: [{ harmonics: [1, 0, 0.32, 0, 0.14, 0, 0.05], level: 1 }, { wave: 'sine', octave: 2, detune: 8, level: 0.07 }],
  attack: 0.002, decay: 1.1, sustain: 0, release: 1.2, gate: 1,
  click: 0.025, humanize: { time: 0.012, volume: 0.18 }, reverb: 0.6,
  echo: { time: 0.5625, feedback: 0.35, mix: 0.3 },
};

const pads = (chords) => ({
  padLow: sustained(chords, BAR, 1, 4),
  padHigh: sustained(chords, BAR, 2, 4),
  choir: sustained(chords, BAR, 0, 4),
});
const organ = (chords) => ({
  organ: sustained(chords, BAR, 0, 3),
  organThird: sustained(chords, BAR, 1, 4),
  organFifth: sustained(chords, BAR, 2, 4),
});

export const USURPER_BATTLE_THEME = {
  title: 'The Usurper of Dawn',
  bpm: 160,
  stepsPerBeat: 4,

  instruments: {
    lead: { ...HIS_LEAD, volume: 0.05 },
    leadLow: { ...BRASS, volume: 0.036, pan: -0.15, filter: { type: 'lowpass', frequency: 1600 } },
    brass: { ...BRASS, volume: 0.055, pan: 0.1 },
    stab: { ...BRASS, volume: 0.03, gate: 0.5, release: 0.08, pan: -0.1 },
    stabHigh: { ...BRASS, volume: 0.024, gate: 0.5, release: 0.08, pan: 0.1 },
    lowBrass: { ...BRASS, volume: 0.04, pan: -0.2, filter: { type: 'lowpass', frequency: 1400 } },
    horn: { ...HORN, volume: 0.055 },
    ves: { ...VES_LEAD, volume: 0.066 },
    violin: { ...SOLO_VIOLIN, volume: 0.042, pan: 0.25 },
    toll: { ...TOLL, volume: 0.075 },
    musicBox: { ...MUSIC_BOX, volume: 0.1 },
    organ: { ...ORGAN, volume: 0.034 },
    organThird: { ...ORGAN, volume: 0.022 },
    organFifth: { ...ORGAN, volume: 0.022 },
    pedal: { ...ORGAN, volume: 0.045 },
    piano: { ...PIANO, volume: 0.05, pan: -0.2 },
    race: { ...STACCATO_STRINGS, volume: 0.03, pan: 0.2 },
    padLow: { ...CHOIR, volume: 0.022, pan: -0.3 },
    padHigh: { ...CHOIR, volume: 0.022, pan: 0.3 },
    choir: { ...CHOIR, volume: 0.04 },
    choirTune: { ...CHOIR, volume: 0.032 },
    // The choir spitting out short syllables in time.
    chant: { ...CHOIR, volume: 0.03, attack: 0.03, decay: 0.25, sustain: 0.55, release: 0.15, gate: 0.75 },
    // Cellos and basses sawing away at 16ths.
    chug: { ...LOW_STRINGS, volume: 0.045, decay: 0.08, sustain: 0.45, gate: 0.6 },
    lowStrings: { ...LOW_STRINGS, volume: 0.07 },
    bass: { wave: 'sawtooth', volume: 0.1, attack: 0.003, decay: 0.08, sustain: 0.7, release: 0.03, gate: 0.8, filter: { type: 'lowpass', frequency: 650 } },
    timpani: { ...TIMPANI, volume: 0.15 },
    kick: { drum: 'kick', volume: 0.58 },
    snare: { drum: 'snare', volume: 0.28 },
    hat: { drum: 'hat', volume: 0.045 },
    openHat: { drum: 'openHat', volume: 0.05 },
    crash: { drum: 'crash', volume: 0.09 },
    boom: { drum: 'boom', volume: 0.3 },
  },

  sections: {
    // A bell tolls his motif over an organ pedal; the low choir sings it
    // slower; the cellos start sawing; the brass climbs the dominant.
    intro: {
      toll: INTRO_TOLL,
      ...organ(INTRO_CHORDS),
      pedal: [...held('D2', 6), ...held('A1', 2)],
      choirTune: INTRO_CHOIR,
      choir: [...rest(2), ...sustained('Eb Eb Gm Gm A A', BAR, 1, 4)],
      brass: INTRO_BRASS,
      chug: [...rest(4), ...over('D3 D3', EIGHTHS), ...over('A2 A2', CHUG)],
      timpani: [...over('D2 D2 D2 D2 D2 D2', ON_ONE), ...over('A1 A1', ROLL)],
      boom: [...repeat(HEARTBEAT, 6), ...repeat(QUICK_HEART, 2)],
      snare: [...rest(7), ...SNARE_ROLL],
    },

    // The fight: his motif growling on the brass over a bass that keeps sinking.
    A: {
      lead: LEAD_A,
      leadLow: transpose(LEAD_A, -12),
      stab: chordLine(A_CHORDS, STAB, 3),
      stabHigh: chordLine(A_CHORDS, STAB_THIRD, 4),
      race: chordLine(A_CHORDS, RACE, 4),
      chug: transpose(over(A_BASS, CHUG), 12),
      bass: over(A_BASS, EIGHTHS),
      ...pads(A_CHORDS),
      timpani: over(A_BASS, ONE_AND_THREE),
      ...kit(16),
      openHat: repeat(OPEN_HAT, 16),
      crash: crashOn(16, [0, 4, 8, 12]),
    },

    // His motif twice as slow, chanted round a cycle of minor thirds.
    dread: {
      lead: DREAD,
      brass: DREAD,
      choirTune: transpose(DREAD, -12),
      chant: chordLine(DREAD_CHORDS, CHANT, 4),
      ...organ(DREAD_CHORDS),
      race: chordLine(DREAD_CHORDS, RACE_DREAD, 4),
      chug: transpose(over(DREAD_BASS, CHUG), 12),
      bass: over(DREAD_BASS, EIGHTHS),
      timpani: transpose(over(DREAD_BASS, TIMP_DRIVE), 12),
      kick: repeat(KICK_TRIBAL, 8),
      snare: [...repeat(SNARE_DREAD, 7), ...SNARE_ROLL],
      boom: repeat(hits('x....... x.......'), 8),
      hat: repeat(HAT_16, 8),
      crash: crashOn(8, [0, 4]),
    },

    // The stolen fanfare: the village's tune for its Hero, in his hands, in minor.
    stolen: {
      brass: STOLEN,
      choirTune: transpose(STOLEN, -12),
      // His motif mocking underneath, at the end of every phrase.
      lead: shapes(STOLEN_CHORDS, [null, null, null, HIS, null, null, null, HIS, null, null, null, HIS, null, null, null, HIS], 4),
      ...organ(STOLEN_CHORDS),
      ...pads(STOLEN_CHORDS),
      race: chordLine(STOLEN_CHORDS, RACE_MARCH, 4),
      chug: transpose(over(STOLEN_BASS, GALLOP), 12),
      bass: over(STOLEN_BASS, EIGHTHS),
      timpani: over(STOLEN_BASS, ONE_AND_THREE),
      ...kit(16, { snare: MARCH }),
      openHat: repeat(OPEN_HAT, 16),
      crash: crashOn(16, [0, 4, 8, 12]),
    },

    // G minor, half time: her motif grieving on the violin, then her own lead.
    bridge: {
      violin: [...BRIDGE.slice(0, 8 * BAR), ...transpose(BRIDGE.slice(8 * BAR), -12)],
      ves: [...rest(8), ...BRIDGE.slice(8 * BAR)],
      ...pads(BRIDGE_CHORDS),
      piano: [...rest(8), ...chordLine('Gm Eb Cm D Eb Cm D D', PIANO_FALL, 3)],
      lowStrings: over(BRIDGE_BASS, OOM),
      race: chordLine(BRIDGE_CHORDS, RACE_HALF, 4),
      timpani: [...rest(8), ...over('G2 Eb2 C2 F#2 G2 A2 A2 D2', ON_ONE)],
      kick: repeat(KICK_HALF, 16),
      snare: [...repeat(SNARE_HALF, 15), ...hits('........x.x.xxxx')],
      hat: repeat(QUARTER_HAT, 16),
      crash: crashOn(16, [0, 8]),
    },

    // A heartbeat, her motif on a music box, and his crawling in on the organ.
    hush: {
      musicBox: HUSH_BOX,
      organ: HUSH_ORGAN,
      choir: sustained(HUSH_CHORDS, BAR, 0, 4),
      padLow: sustained(HUSH_CHORDS, BAR, 1, 3),
      boom: [...repeat(HEARTBEAT, 6), ...repeat(QUICK_HEART, 2)],
      timpani: [...rest(7), ...chordLine('A', ROLL, 2)],
      snare: [...rest(7), ...hits('....x.x. xxxxxxxx')],
    },

    // His call, her answer: two bars each, then one, then both at once,
    // climbing a key each time.
    duel: {
      lead: DUEL_HIS,
      leadLow: transpose(DUEL_HIS, -12),
      ves: DUEL_HERS,
      violin: onlyBars(transpose(DUEL_HERS, -12), [12, 13, 14, 15]),
      ...pads(DUEL_CHORDS),
      stab: onlyBars(chordLine(DUEL_CHORDS, STAB, 3), [8, 9, 10, 11, 12, 13, 14, 15]),
      race: chordLine(DUEL_CHORDS, RACE, 4),
      chug: chordLine(DUEL_CHORDS, CHUG, 3),
      bass: chordLine(DUEL_CHORDS, EIGHTHS, 2),
      timpani: [...rest(8), ...chordLine('F#m A Gm Bb', ONE_AND_THREE, 2), ...chordLine('Cm D Eb F', TIMP_DRIVE, 2)],
      kick: [...repeat(KICK_DRIVE, 12), ...repeat(KICK_8THS, 4)],
      snare: [...repeat(SNARE, 7), ...FILL, ...repeat(MARCH, 7), ...SNARE_ROLL],
      hat: [...repeat(HAT, 8), ...repeat(HAT_16, 8)],
      openHat: repeat(OPEN_HAT, 16),
      crash: crashOn(16, [0, 4, 8, 12]),
    },

    // Up a step: her heroic motif blazing over everything, his drowning
    // underneath, the tonic held back until bar 15; then the fanfare taken back.
    climax: {
      ves: CLIMAX_VES,
      violin: CLIMAX_VES,
      choirTune: [...transpose(CLIMAX_VES.slice(0, 16 * BAR), -12), ...FANFARE],
      brass: [...rest(14), ...CLIMAX_ARRIVAL, ...FANFARE],
      horn: [...rest(16), ...FANFARE],
      // His motif, low, under her every bar... then every other... then gone.
      lowBrass: shapes(CLIMAX_CHORDS, [HIS, HIS, HIS, HIS, HIS, HIS, HIS, HIS, HIS, null, HIS], 2),
      ...pads(CLIMAX_CHORDS),
      ...organ(CLIMAX_CHORDS),
      race: chordLine(CLIMAX_CHORDS, RACE_HERO, 4),
      chug: chordLine(CLIMAX_CHORDS, CHUG, 3),
      bass: chordLine(CLIMAX_CHORDS, EIGHTHS, 2),
      timpani: [...chordLine(CLIMAX_CHORDS.split(' ').slice(0, 13).join(' '), ONE_AND_THREE, 2), ...chordLine('F', ROLL, 2), ...chordLine(CLIMAX_CHORDS.split(' ').slice(14).join(' '), TIMP_DRIVE, 2)],
      kick: repeat(KICK_DRIVE, 24),
      snare: Array.from({ length: 24 }, (_, i) => (i === 13 ? SNARE_ROLL : (i + 1) % 8 === 0 ? FILL : MARCH)).flat(),
      hat: repeat(HAT_16, 24),
      openHat: repeat(OPEN_HAT, 24),
      crash: crashOn(24, [0, 4, 8, 12, 14, 16, 20]),
    },

    // His motif crawling back, round to the fight.
    turn: {
      lead: TURN_LEAD,
      leadLow: transpose(TURN_LEAD, -12),
      ...pads(TURN_CHORDS),
      race: [...rest(4), ...chordLine('Bb Gm A A', RACE, 4)],
      chug: [...rest(4), ...transpose(over('Bb1 G1 A1 A1', CHUG), 12)],
      bass: over(TURN_BASS, EIGHTHS),
      timpani: [...over('F2 E2 Eb2 D2 Bb1 G1', ON_ONE), ...over('A1 A1', ROLL)],
      kick: [...repeat(KICK_HALF, 4), ...repeat(KICK_DRIVE, 3), ...KICK_8THS],
      snare: [...repeat(SNARE_HALF, 4), ...SNARE, ...SNARE, ...MARCH, ...SNARE_ROLL],
      hat: [...repeat(QUARTER_HAT, 4), ...repeat(HAT, 2), ...repeat(HAT_16, 2)],
      crash: crashOn(8, [0, 4]),
    },
  },

  order: ['intro', 'A', 'dread', 'stolen', 'bridge', 'hush', 'duel', 'climax', 'turn'],
  loopFrom: 1,
};
