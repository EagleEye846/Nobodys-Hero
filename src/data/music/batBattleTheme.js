import { melody, chordLine, sustained, arpeggio, transpose, hits, repeat } from '../../audio/notation.js';
import { BRASS, STRINGS, STACCATO_STRINGS, LOW_STRINGS, PIANO, CHOIR, TIMPANI, BELLS, FLUTE } from '../../audio/instruments.js';
import { VES_MOTIF } from './vesTheme.js';

// "Brave in the Dark": the boss theme for the great bat of Mount Vigil's ice
// caves, fought in its roost of ice crystals. An original piece in the spirit
// of Toby Fox's "Heartache" and "ASGORE", with a little of "Spider Dance" and
// "Battle Against a True Hero" in it: driving and heroic, with dread under
// everything, because Ves is terrified of bats (she was lost in a cave as a
// child, and swarmed) and she is fighting one anyway.
//
// Two motifs fight it out all the way through.
//   The bat's (BAT below): A A, down to D, then a chromatic writhe around it,
//     Eb-D-C#-D. Two quick sonar pings and a fall. Every time it calls, its
//     echo answers an 8th later, an octave higher and quieter, from the other
//     side, as if bouncing off the cave walls (the `echo` track), and its pings
//     carry their own delay too. Under it all, a fluttering chromatic ostinato
//     (the wingbeats), squeaking swarms of little bats, and ice crystals ringing.
//   Ves's (VES_MOTIF from "Carried on the Wind": C C, up to A, Bb G A). The
//     bat's motif has exactly her rhythm, and in D minor both start on the same
//     A, but hers leaps up a sixth where its falls a fifth: her fear is her
//     hope turned upside down. She starts timid, in D minor, on a trembling
//     flute and a music box, with the bat's pings cutting her off; she tries
//     her heroic form and is shouted down; in the duel she answers it call for
//     call; and in the climax her heroic form (climbing past the ache instead
//     of settling) blazes over the bat's motif, which keeps calling underneath
//     and can no longer be heard over her.
// D minor (the climax a step up, in G major / E minor), 4/4 at 152 BPM. One step
// is a 16th note. The intro plays once, then about three minutes loop from A:
//
//   intro     8 bars  the roost in the dark: sonar pings and their echoes, ice
//                     crystals, a heartbeat; Ves's motif, tiny and minor, on a
//                     music box; the pings close in to a feeding buzz
//   A        16 bars  the fight: the bat's motif on brass, the wingbeat
//                     ostinato, pumping bass, drums
//   echo     16 bars  echolocation: the motif called on the pings, each call
//                     answered by its echo; then brass and strings in canon,
//                     and a chromatic swarm climbing out of it
//   fear     16 bars  Ves: her motif, minor and trembling on the flute, with
//                     the bat's pings in every gap and her heart racing in the
//                     kick; she finds it in major, tries her heroic climb, and
//                     the bat shouts her down
//   bridge   16 bars  G minor, half time: the strings sing her motif broad
//                     and slow over a low piano tolling in the dark, and her
//                     trembling flute joins in: the aching part, with no
//                     comfort in it yet
//   hush      8 bars  lost in the dark: a heartbeat, the music box, pings
//                     bouncing side to side and closing in, the swarm rising
//   duel     16 bars  call and response: the bat calls, Ves answers, two bars,
//                     then one, then both at once, climbing to B major
//   climax   16 bars  up a step: her heroic motif blazing over the bat's,
//                     full orchestra, to the highest note in the song
//   turn      8 bars  her motif ringing on, the bat crawling back in, round to A

const BAR = 16;
const tune = (text) => melody(text, 2); // each token an 8th note
const rest = (bars) => Array(bars * BAR).fill('.');
const HOLD = '-';

// --- The two motifs. ---
// The bat: "da-da DAAAH di-di da DAH", the same rhythm as hers.
const BAT = 'A5/A5 D5 - - Eb5/D5 C#5 D5 -';
// The same, as semitones above a chord's root, to call it over any chord.
const BAT_SHAPE = [7, 7, 0, HOLD, HOLD, HOLD, HOLD, HOLD, 1, 0, -1, HOLD, 0, HOLD, HOLD, HOLD];
// Ves, timid and in D minor: her motif with its leap shrunk to a minor sixth.
const VES_MINOR = 'A4/A4 F5 - - G5 E5 F5 -';

// --- Helpers. ---
// The same notes `n` steps later (and `semis` higher), the end cut to fit.
const later = (steps, n, semis = 0) => [...Array(n).fill('.'), ...transpose(steps, semis).slice(0, steps.length - n)];
// Only the given bars (counting from 0) of a track; the rest silent.
const onlyBars = (steps, list) => steps.map((step, i) => (list.includes(Math.floor(i / BAR)) ? step : '.'));
// Two tracks laid over each other (where the first rests, the second plays).
const merge = (a, b) => a.map((step, i) => (step === '.' ? b[i] : step));

// A seeded random number generator, so the song sounds the same every time.
function seeded(seed) {
  let s = seed >>> 0;
  return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296;
}
// The swarm: little bats squeaking, high and chromatic, on random 16ths.
// `chance` is a number, or one a bar.
function swarm(bars, chance, seed) {
  const rand = seeded(seed);
  return Array.from({ length: bars * BAR }, (_, i) => {
    const c = Array.isArray(chance) ? chance[Math.floor(i / BAR)] : chance;
    return rand() < c ? 86 + Math.floor(rand() * 14) : '.';
  });
}
// Ice crystals: now and then, on an 8th, a high chord tone rings out.
function crystals(chords, chance, seed) {
  const rand = seeded(seed);
  const notes = arpeggio(chords, BAR, 6, [0, 'third', 7, 12, 7, 'third', 12, 0]);
  let ringing = false;
  return notes.map((note, i) => {
    if (i % 2 === 0 && rand() < chance) {
      ringing = true;
      return note;
    }
    return ringing ? HOLD : '.';
  });
}
// Wings: a flap of air on each 'x'.
const flap = (text) => hits(text).map((step) => (step === 'x' ? 60 : step));

// --- Patterns, as semitones above each chord's root. ---
// The wingbeats: a fluttering ostinato in 16ths with a chromatic flick in it.
const FLUTTER = [12, 13, 12, 7, 12, 13, 12, 'tenth', 12, 13, 12, 7, 'tenth', 7, 6, 7];
const FLUTTER_HALF = [12, '.', 13, '.', 12, '.', 7, '.', 12, '.', 13, '.', 'tenth', '.', 7, '.'];
const BASS = [0, HOLD, 12, 0, '.', 0, 12, '.', 0, HOLD, 12, 0, '.', 7, 12, '.'];
const BASS_EIGHTHS = [0, '.', 0, '.', 0, '.', 0, '.', 0, '.', 0, '.', 12, '.', 7, '.'];
const OOM = [0, HOLD, HOLD, HOLD, '.', '.', '.', '.', 7, HOLD, HOLD, HOLD, '.', '.', '.', '.'];
const TREMOLO = Array(16).fill('third');
const TREMOLO_FIFTH = Array(16).fill(7);
const ON_ONE = [0, ...Array(15).fill('.')];
const ONE_AND_THREE = [0, '.', '.', '.', '.', '.', '.', '.', 7, '.', '.', '.', '.', '.', '.', '.'];
const ROLL = [0, '.', 0, '.', 0, '.', 0, '.', 0, 0, 0, 0, 0, 0, 0, 0];
// A slow toll down through the chord, leaning on its minor sixth, then the
// root held low: 8ths, not a ripple.
const PIANO_TOLL = [12, '.', 8, '.', 7, '.', 'third', '.', 0, HOLD, HOLD, HOLD, 7, '.', 'third', '.'];

// --- Drums. ---
const KICK = hits('x.....x. x.......');
const KICK_BIG = hits('x.....x. x...x...');
const KICK_HALF = hits('x....... ........');
const SNARE = hits('....x... ....x...');
const MARCH = hits('....x..x ....x.xx');
const FILL = hits('....x... x.x.xxxx');
const SNARE_HALF = hits('........ x.......');
const SNARE_ROLL = hits('x.x.x.x. xxxxxxxx');
const HAT = hits('x.x.x.x. x.x.x.x.');
const HAT_16 = hits('xxxxxxxx xxxxxxxx');
const QUARTER_HAT = hits('x...x... x...x...');
const OPEN_HAT = hits('..x...x. ..x...x.');
const HEARTBEAT = hits('x..x.... ........');
const RACING = hits('x..x.... x..x....');
const NONE = hits('........ ........');

// A full kit for `bars` bars, with a fill on every 8th bar.
function kit(bars, { kick = KICK, snare = SNARE, hat = HAT } = {}) {
  return {
    kick: repeat(kick, bars),
    snare: Array.from({ length: bars }, (_, i) => ((i + 1) % 8 === 0 ? FILL : snare)).flat(),
    hat: repeat(hat, bars),
    openHat: repeat(OPEN_HAT, bars),
  };
}
const crashes = (bars, every) => Array.from({ length: bars }, (_, i) => (i % every === 0 ? hits('x...............') : NONE)).flat();

// --- Chords, one a bar. ---
const INTRO_CHORDS = 'Dm Dm Bb Bb Dm Gm A A';
const A_CHORDS = 'Dm Dm Bb A Dm Dm Eb A Gm Gm Dm Dm Bb C A A';
const ECHO_CHORDS = 'Dm Dm Bb Bb Gm Gm A A Dm Dm Bb Bb Eb Eb A A';
const FEAR_CHORDS = 'Dm Dm Bb C Dm Dm Gm A F F Dm C Dm Bb A A';
// Minor all the way (it was B-flat major, and too sunny for a roost of bones).
const BRIDGE_CHORDS = 'Gm Cm Gm Dm Gm Cm Gm Cm Gm Dm Gm Dm Cm Dm C A';
const HUSH_CHORDS = 'Dm Dm Bb Bb Gm Gm A A';
const DUEL_CHORDS = 'Dm A F C Gm D Bb F Eb Cm F Dm Bb C D B';
// Written in F major / D minor, and played a step higher (G major / E minor).
const CLIMAX_CHORDS = 'F C Dm Bb F C Bb C F Bb Gm C Bb C F F';
const TURN_CHORDS = 'G Em C C Bb Bb A A';

// --- Intro: the roost in the dark. ---
const INTRO_PING = tune(`
  A5 - . . . . . . | . . . . A5/A5 . . . | ${BAT} | . . . . . . . . |
  . . . . . . . . | . . . . . . A5/A5 D5 | - - . . A5/A5 D5 - - |
  A5/A5 A5/A5 A5/A5 A5/A5 A5/A5 A5/A5 A5/A5 A5/A5 |
`);
const INTRO_BOX = [...rest(4), ...tune(`A5 A5 F6 - - - - - | G6 - E6 - F6 - . . |`), ...rest(2)];

// --- A: the fight. ---
const LEAD_A = tune(`
  ${BAT} | F5 - A5 - D6 - E6 F6 | F6 - D6 - Bb5 - D6 - | C#6 - - - A5 - E5 - |
  ${BAT} | F5 - A5 - D6 - F6 E6 | Eb6 - - - Bb5 - G5 - | A5 - C#6 - E6 - G6 - |
  D6/D6 G5 - - Ab5/G5 F#5 G5 - | Bb5 - D6 - G6 - F6 Eb6 | D6 - - - A5 - F5 - | E5 - F5 - A5 - D6 - |
  D6 - - - F6 - D6 Bb5 | E6 - - - G6 - E6 C6 | E6 - - - C#6 - A5 C#6 | E6 - - - - - . . |
`);

// --- Echo: echolocation. The pings call, their echoes answer; the strings
// answer between. Then brass and strings take the motif in canon. ---
const ECHO_PING = tune(`
  ${BAT} | . . . . . . . . |
  F6/F6 Bb5 - - B5/Bb5 A5 Bb5 - | . . . . . . . . |
  D6/D6 G5 - - Ab5/G5 F#5 G5 - | . . . . . . . . |
  E6/E6 A5 - - Bb5/A5 G#5 A5 - | . . . . . . . . |
  . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . A5/A5 . |
  . . . . . . . . | . . . . . . A5/A5 . | . . . . . . . . | . . . . . . . . |
`);
const ECHO_LEAD = [...rest(8), ...tune(`
  ${BAT} | F5 - A5 - D6 - - - |
  F5/F5 Bb4 - - B4/Bb4 A4 Bb4 - | D5 - F5 - Bb5 - D6 - |
  Bb5/Bb5 Eb5 - - E5/Eb5 D5 Eb5 - | G5 - Bb5 - Eb6 - - - |
  A5 - Bb5 - B5 - C6 - | C#6 - D6 - Eb6 - E6 - |
`)];
const ECHO_STRINGS = tune(`
  . . . . . . . . | . . D5 - F5 - A5 - | . . . . . . . . | . . D5 - F5 - Bb5 - |
  . . . . . . . . | . . Bb4 - D5 - G5 - | . . . . . . . . | . . C#5 - E5 - G5 - |
  . . . . . . . . | ${BAT} | . . . . . . . . | F5/F5 Bb4 - - B4/Bb4 A4 Bb4 - |
  . . . . . . . . | Bb5/Bb5 Eb5 - - E5/Eb5 D5 Eb5 - | C#5 - - - - - - - | E5 - - - G5 - - - |
`);

// --- Fear: Ves, trembling. ---
const FEAR_FLUTE = tune(`
  ${VES_MINOR} | D5 - - - . . . . | Bb4/Bb4 G5 - - A5 F5 G5 - | E5 - - - . . . . |
  ${VES_MINOR} | A5 - G5 F5 E5 - D5 - | Bb4 - D5 - G5 - F5 E5 | E5 - - - C#5 - . . |
  . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . |
  ${VES_MINOR} | D5 - - - F5 - - - | E5 - - - - - . . | . . . . . . . . |
`);
// She finds her motif in major (exactly as in her own theme), and tries the
// heroic climb; the bat cuts her off.
const FEAR_VES = [
  ...rest(8),
  ...VES_MOTIF,
  ...tune(`F5 - - E5 D5 - E5 F5 | C5/C5 A5 - Bb5 - C6 - - | . . . . . . . . |`),
  ...rest(4),
];
const FEAR_LEAD = [
  ...rest(11),
  ...tune(`G5/G5 C5 - - Db5/C5 B4 C5 - |`),
  ...rest(2),
  ...tune(`A4 - - - Bb4 - - - | B4 - - - C5 - C#5 - |`),
];
const FEAR_PING = tune(`
  . . . . . . . . | . . . . A5/A5 D5 - - | . . . . . . . . | . . . . G5/G5 C5 - - |
  . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . E5/E5 A5 - - |
  . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . |
  . . . . . . . . | . . . . . . A5/A5 D5 | . . A5/A5 D5 . . A5/A5 D5 | A5/A5 A5/A5 A5/A5 A5/A5 A5/A5 A5/A5 A5/A5 A5/A5 |
`);

// --- Bridge: her motif broad and slow, over G minor, then reaching up. ---
const BRIDGE = tune(`
  F5 F5 D6 - - - - - | Eb6 - C6 - D6 - - - | Bb5 - - - A5 - G5 - | F5 - - - - - . . |
  F5 F5 D6 - - - Eb6 F6 | G6 - Eb6 - C6 - D6 Eb6 | Bb5 - - - G5 - Bb5 - | C6 - - - - - . . |
  D6 - - - C6 - Bb5 - | A5 - - - F5 - A5 - | Bb5 - - - D6 - G6 - | F6 - - - E6 - D6 - |
  Eb6 - - - G6 - - - | F6 - - - A6 - - - | G6 - - - F6 - E6 - | C#6 - - - - - . . |
`);
const BRIDGE_PING = tune(`
  . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . A5/A5 D5 |
  . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . A5/A5 D5 |
  . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . |
  . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . A5/A5 D5 A5/A5 D5 |
`);

// --- Hush: lost in the dark. ---
const HUSH_BOX = tune(`
  A5 A5 F6 - - - - - | G6 - E6 - F6 - - - | . . . . . . . . | . . . . . . . . |
  Bb5 Bb5 G6 - - - - - | A6 - - - . . . . | . . . . . . . . | . . . . . . . . |
`);
const HUSH_PING = tune(`
  . . . . . . . . | . . . . . . . . | ${BAT} | . . . . . . . . |
  . . . . . . . . | . . . . . . A5/A5 . | . . A5/A5 . . A5/A5 . A5/A5 |
  A5/A5 A5/A5 A5/A5 A5/A5 A5/A5 A5/A5 A5/A5 A5/A5 |
`);

// --- Duel: the bat calls, she answers. ---
const DUEL_BAT = tune(`
  ${BAT} | E5 - F5 - E5 - C#5 - | . . . . . . . . | . . . . . . . . |
  D6/D6 G5 - - Ab5/G5 F#5 G5 - | A5 - Bb5 - A5 - F#5 - | . . . . . . . . | . . . . . . . . |
  Bb5/Bb5 Eb5 - - E5/Eb5 D5 Eb5 - | . . . . . . . . | C6/C6 F5 - - Gb5/F5 E5 F5 - | . . . . . . . . |
  F5/F5 Bb4 - - B4/Bb4 A4 Bb4 - | G5/G5 C5 - - Db5/C5 B4 C5 - | ${BAT} | F#5 - - - A5 - - - |
`);
const DUEL_VES = [
  ...rest(2),
  ...VES_MOTIF,
  ...tune(`
    G5 - - - E5 - G5 - | . . . . . . . . | . . . . . . . . |
    F5/F5 D6 - - Eb6 C6 D6 - | C6 - - - A5 - C6 - |
    . . . . . . . . | G5/G5 Eb6 - F6 - G6 - - | . . . . . . . . | A5/A5 F6 - G6 - A6 - - |
    D5/D5 Bb5 - C6 - D6 - - | E5/E5 C6 - D6 - E6 - - | F#5/F#5 D6 - E6 - F#6 - - | B5 - - - D#6 - F#6 - |
  `),
];

// --- Climax (written in F, played in G): her heroic motif, all the way. ---
const CLIMAX_VES = tune(`
  C5/C5 A5 - Bb5 - C6 - - | E6 - - - G6 - E6 C6 | A5/A5 F6 - G6 - A6 - - | F6 - - - D6 - Bb5 D6 |
  C6/C6 A6 - - G6 - F6 E6 | G6 - - - E6 - C6 - | D6/D6 Bb6 - - A6 - G6 - | E6 - - - - - G6 - |
  C6 C6 A6 - - - - - | Bb6 - G6 - A6 - - - | D6 D6 Bb6 - - - A6 - | G6 - - - - - . . |
  F6 - D6 - Bb5 - D6 - | E6 - G6 - C6 - E6 - | C6/C6 A6 - Bb6 - C7 - - | F6 - - - - - . . |
`);
// Under her, the bat keeps calling, low, every bar.
const CLIMAX_BAT = chordLine(CLIMAX_CHORDS, BAT_SHAPE, 3);

// --- Turn: her motif ringing on, the bat crawling back. ---
const TURN_VES = [...tune(`D6/D6 B5 - C6 - D6 - - | E6 - - - B5 - G5 - |`), ...rest(6)];
const TURN_BAT = [...rest(2), ...tune(`
  G5/G5 C5 - - Db5/C5 B4 C5 - | E5 - G5 - C6 - - - |
  F5/F5 Bb4 - - B4/Bb4 A4 Bb4 - | D5 - F5 - Bb5 - - - |
  A5 - E5 - C#5 - E5 - | G5 - - - Bb5 - C#6 - |
`)];

// Shifts every pitched track in a section, leaving the drums alone.
const DRUM_TRACKS = ['kick', 'snare', 'hat', 'openHat', 'crash', 'boom', 'wings'];
function shiftSection(section, semitones) {
  return Object.fromEntries(Object.entries(section).map(([track, steps]) => [track, DRUM_TRACKS.includes(track) ? steps : transpose(steps, semitones)]));
}

// The pads under a section: strings on the third and fifth, the choir on the root.
const pads = (chords) => ({
  padLow: sustained(chords, BAR, 1, 4),
  padHigh: sustained(chords, BAR, 2, 4),
  choir: sustained(chords, BAR, 0, 4),
});

const CLIMAX = {
  ves: CLIMAX_VES,
  bells: CLIMAX_VES,
  lead: transpose(CLIMAX_VES, -12),
  choirTune: transpose(CLIMAX_VES, -12),
  lowBrass: CLIMAX_BAT,
  strings: sustained(CLIMAX_CHORDS, BAR, 1, 5),
  ...pads(CLIMAX_CHORDS),
  flutter: chordLine(CLIMAX_CHORDS, FLUTTER, 4),
  bass: chordLine(CLIMAX_CHORDS, BASS, 2),
  timpani: chordLine(CLIMAX_CHORDS, ONE_AND_THREE, 2),
  ice: crystals(CLIMAX_CHORDS, 0.12, 91),
  ...kit(16, { kick: KICK_BIG, snare: MARCH }),
  crash: crashes(16, 4),
};

// --- Instruments. ---
// A sonar ping: a pure high tone that squeaks in a touch sharp, with a
// dotted-8th echo bouncing after it.
const PING = {
  voices: [{ wave: 'sine', level: 1 }, { wave: 'sine', octave: 1, level: 0.35 }, { wave: 'triangle', octave: 2, level: 0.06 }],
  bend: { cents: 140, time: 0.03 },
  attack: 0.002, decay: 0.18, sustain: 0.15, release: 0.25, gate: 0.8,
  pan: 0.4,
  reverb: 0.5,
  echo: { time: 0.296, feedback: 0.45, mix: 0.35 },
};
// A little bat squeak: starts sharp and drops, gone in a blink.
const SQUEAK = {
  voices: [{ wave: 'triangle', level: 0.8 }, { wave: 'sine', octave: 1, level: 0.3 }],
  bend: { cents: 320, time: 0.05 },
  attack: 0.002, decay: 0.04, sustain: 0, release: 0.03, gate: 0.5,
  humanize: { time: 0.02, volume: 0.5 },
  reverb: 0.45,
};
// A wing flap: no note, just a puff of air.
const WING = {
  voices: [{ wave: 'sine', level: 0 }],
  attack: 0.006, decay: 0.05, sustain: 0, release: 0.04, gate: 0.6,
  breath: { level: 1, frequency: 1300, q: 0.7 },
  humanize: { time: 0.01, volume: 0.4 },
  reverb: 0.3,
};
// Ice crystals: thin and out of tune with themselves.
const ICE = {
  voices: [
    { wave: 'sine', level: 1 },
    { wave: 'sine', octave: 1, detune: 558, level: 0.25 },
    { wave: 'sine', octave: 2, detune: 520, level: 0.08 },
  ],
  attack: 0.002, decay: 0.9, sustain: 0, release: 1, gate: 1,
  pan: -0.45,
  reverb: 0.6,
};
// Ves: bright and airy (her lead from "Updraft").
const VES_LEAD = {
  voices: [
    { wave: 'square', level: 0.45 },
    { wave: 'triangle', octave: 1, level: 0.3 },
    { wave: 'sine', level: 0.45 },
  ],
  filter: { type: 'lowpass', frequency: 3800 },
  attack: 0.008, decay: 0.2, sustain: 0.75, release: 0.1, gate: 0.9,
  vibrato: { rate: 5.8, depth: 14, delay: 0.12 },
  breath: { level: 0.05, frequency: 3000, q: 0.8 },
  pan: 0.15,
  echo: { time: 0.296, feedback: 0.22, mix: 0.16 },
};
// Ves afraid: a flute with a fast, nervous tremble in it.
const TREMBLING_FLUTE = {
  ...FLUTE,
  vibrato: { rate: 7.5, depth: 18, delay: 0.1 },
  breath: { level: 0.16, frequency: 2400, q: 0.7 },
  echo: { time: 0.592, feedback: 0.3, mix: 0.25 },
};
// A music box, far off in the dark.
const MUSIC_BOX = {
  voices: [
    { harmonics: [1, 0, 0.32, 0, 0.14, 0, 0.05], level: 1 },
    { wave: 'sine', octave: 2, detune: 8, level: 0.07 },
  ],
  attack: 0.002, decay: 1.1, sustain: 0, release: 1.2, gate: 1,
  click: 0.025,
  humanize: { time: 0.012, volume: 0.18 },
  pan: -0.2,
  reverb: 0.6,
  echo: { time: 0.592, feedback: 0.35, mix: 0.3 },
};

export const BAT_BATTLE_THEME = {
  title: 'Brave in the Dark',
  bpm: 152,
  stepsPerBeat: 4,

  instruments: {
    lead: { ...BRASS, volume: 0.06, pan: -0.1 },
    leadLow: {
      wave: 'square', volume: 0.026, attack: 0.008, decay: 0.15, sustain: 0.7, release: 0.06, gate: 0.9,
      vibrato: { rate: 5.5, depth: 8 },
      filter: { type: 'lowpass', frequency: 2600 },
      pan: -0.1,
    },
    lowBrass: { ...BRASS, volume: 0.05, filter: { type: 'lowpass', frequency: 1800 }, pan: -0.2 },
    ves: { ...VES_LEAD, volume: 0.065 },
    flute: { ...TREMBLING_FLUTE, volume: 0.09 },
    musicBox: { ...MUSIC_BOX, volume: 0.1 },
    bells: { ...BELLS, volume: 0.045, pan: 0.3 },
    ping: { ...PING, volume: 0.08 },
    // The echo of the bat's calls, from the other wall.
    echo: { ...PING, volume: 0.032, pan: -0.55, reverb: 0.7, echo: { time: 0.444, feedback: 0.3, mix: 0.3 } },
    squeakL: { ...SQUEAK, volume: 0.035, pan: -0.6 },
    squeakR: { ...SQUEAK, volume: 0.035, pan: 0.6 },
    wings: { ...WING, volume: 0.06 },
    ice: { ...ICE, volume: 0.022 },
    flutter: { ...STACCATO_STRINGS, volume: 0.036, pan: 0.2 },
    tremolo: { ...STACCATO_STRINGS, volume: 0.022, pan: -0.3 },
    tremoloHigh: { ...STACCATO_STRINGS, volume: 0.02, pan: 0.35 },
    strings: { ...STRINGS, volume: 0.05 },
    padLow: { ...STRINGS, volume: 0.018, pan: -0.3 },
    padHigh: { ...STRINGS, volume: 0.018, pan: 0.3 },
    choir: { ...CHOIR, volume: 0.035 },
    choirTune: { ...CHOIR, volume: 0.028 },
    // Low and far off, in a lot of cave.
    piano: { ...PIANO, volume: 0.07, reverb: 0.65, filter: { type: 'lowpass', frequency: 2200 } },
    bass: { wave: 'sawtooth', volume: 0.11, attack: 0.003, decay: 0.08, sustain: 0.7, release: 0.03, gate: 0.8, filter: { type: 'lowpass', frequency: 650 } },
    lowStrings: { ...LOW_STRINGS, volume: 0.07 },
    timpani: { ...TIMPANI, volume: 0.13 },
    kick: { drum: 'kick', volume: 0.55 },
    snare: { drum: 'snare', volume: 0.27 },
    hat: { drum: 'hat', volume: 0.045 },
    openHat: { drum: 'openHat', volume: 0.055 },
    crash: { drum: 'crash', volume: 0.08 },
    boom: { drum: 'boom', volume: 0.2 },
  },

  sections: {
    // The roost in the dark: pings and their echoes, ice crystals, a slow
    // heartbeat; her motif, tiny, on a music box, cut off by the pings, which
    // close in to a buzz as the wings start beating.
    intro: {
      ping: INTRO_PING,
      echo: later(INTRO_PING.map((s, i) => (i >= 7 * BAR ? '.' : s)), 2, 12),
      musicBox: INTRO_BOX,
      padLow: [...rest(2), ...sustained('Bb Bb Dm Gm A A', BAR, 0, 3)],
      padHigh: [...rest(2), ...sustained('Bb Bb Dm Gm A A', BAR, 1, 4)],
      choir: [...rest(4), ...sustained('Dm Gm A A', BAR, 2, 4)],
      ice: crystals(INTRO_CHORDS, 0.1, 5),
      flutter: [...rest(6), ...chordLine('A A', FLUTTER, 4)],
      squeakL: swarm(8, [0, 0, 0, 0.02, 0, 0.03, 0.1, 0.3], 3),
      squeakR: swarm(8, [0, 0, 0.02, 0, 0.02, 0.03, 0.1, 0.3], 4),
      wings: [...rest(6), ...flap('x.x.x.x. x.x.x.x.'), ...flap('xxxxxxxx xxxxxxxx')],
      boom: [...repeat(HEARTBEAT, 6), ...repeat(RACING, 2)],
      timpani: [...chordLine('Dm Dm Bb Bb Dm Gm', ON_ONE, 2), ...chordLine('A A', ROLL, 2)],
      snare: [...rest(7), ...SNARE_ROLL],
    },

    // The fight: the bat's motif on brass, the wingbeats, the drums. Each of
    // its calls echoes back off the walls.
    A: {
      lead: LEAD_A,
      leadLow: transpose(LEAD_A, -12),
      echo: later(onlyBars(LEAD_A, [0, 4, 8]), 2, 12),
      flutter: chordLine(A_CHORDS, FLUTTER, 4),
      bass: chordLine(A_CHORDS, BASS, 2),
      padLow: sustained(A_CHORDS, BAR, 1, 4),
      padHigh: sustained(A_CHORDS, BAR, 2, 4),
      ice: crystals(A_CHORDS, 0.05, 7),
      squeakL: swarm(16, 0.025, 11),
      squeakR: swarm(16, 0.025, 12),
      ...kit(16),
      crash: crashes(16, 8),
    },

    // Echolocation: the pings call and the echoes answer, the strings
    // between; then brass and strings in canon, and the swarm climbs out.
    echo: {
      ping: ECHO_PING,
      echo: later(merge(ECHO_PING, onlyBars(ECHO_LEAD, [8, 10, 12])), 2, 12),
      lead: ECHO_LEAD,
      leadLow: transpose(ECHO_LEAD, -12),
      strings: ECHO_STRINGS,
      flutter: chordLine(ECHO_CHORDS, FLUTTER, 4),
      bass: chordLine(ECHO_CHORDS, BASS, 2),
      ...pads(ECHO_CHORDS),
      timpani: [...rest(8), ...chordLine(ECHO_CHORDS.split(' ').slice(8).join(' '), ONE_AND_THREE, 2)],
      ice: crystals(ECHO_CHORDS, 0.07, 17),
      squeakL: swarm(16, [0.03, 0.03, 0.03, 0.03, 0.04, 0.04, 0.05, 0.05, 0.05, 0.05, 0.06, 0.06, 0.08, 0.1, 0.2, 0.3], 21),
      squeakR: swarm(16, [0.03, 0.03, 0.03, 0.03, 0.04, 0.04, 0.05, 0.05, 0.05, 0.05, 0.06, 0.06, 0.08, 0.1, 0.2, 0.3], 22),
      wings: [...rest(14), ...flap('x.x.x.x. x.x.x.x.'), ...flap('xxxxxxxx xxxxxxxx')],
      ...kit(16, { kick: KICK_BIG }),
      crash: crashes(16, 8),
    },

    // Ves, afraid: her motif minor and trembling, the bat's pings in every
    // gap, her heart racing in the kick and the strings shivering. She finds
    // it in major and tries to climb; the bat cuts her off; the swarm comes.
    fear: {
      flute: FEAR_FLUTE,
      ves: FEAR_VES,
      bells: [...rest(8), ...FEAR_VES.slice(8 * BAR)],
      lead: FEAR_LEAD,
      leadLow: transpose(FEAR_LEAD, -12),
      ping: FEAR_PING,
      echo: later(merge(FEAR_PING, onlyBars(FEAR_LEAD, [11])), 2, 12),
      tremolo: chordLine(FEAR_CHORDS, TREMOLO, 4),
      tremoloHigh: chordLine(FEAR_CHORDS, TREMOLO_FIFTH, 4),
      flutter: chordLine(FEAR_CHORDS, FLUTTER_HALF, 4),
      bass: chordLine(FEAR_CHORDS, BASS_EIGHTHS, 2),
      ...pads(FEAR_CHORDS),
      ice: crystals(FEAR_CHORDS, 0.06, 29),
      squeakL: swarm(16, [...Array(13).fill(0.02), 0.06, 0.15, 0.35], 31),
      squeakR: swarm(16, [...Array(13).fill(0.02), 0.06, 0.15, 0.35], 32),
      wings: [...rest(15), ...flap('xxxxxxxx xxxxxxxx')],
      kick: repeat(RACING, 16),
      snare: [...repeat(hits('........ ....x...'), 7), ...FILL, ...repeat(hits('........ ....x...'), 7), ...SNARE_ROLL],
      hat: repeat(HAT, 16),
      crash: crashes(16, 8),
      timpani: [...rest(15), ...chordLine('A', ROLL, 2)],
    },

    // G minor and half time: the strings sing her motif broad and slow over
    // the piano's toll; her trembling flute joins them; the bat is only
    // far-off pings now.
    bridge: {
      strings: BRIDGE,
      flute: [...rest(8), ...BRIDGE.slice(8 * BAR)],
      lead: [...rest(12), ...transpose(BRIDGE.slice(12 * BAR), -12)],
      ping: BRIDGE_PING,
      echo: later(BRIDGE_PING, 2, 12),
      piano: arpeggio(BRIDGE_CHORDS, BAR, 3, PIANO_TOLL),
      choir: sustained(BRIDGE_CHORDS, BAR, 0, 4),
      padLow: sustained(BRIDGE_CHORDS, BAR, 1, 4),
      lowStrings: chordLine(BRIDGE_CHORDS, OOM, 2),
      ice: crystals(BRIDGE_CHORDS, 0.12, 41),
      kick: repeat(KICK_HALF, 16),
      snare: [...repeat(SNARE_HALF, 15), ...hits('........x.x.xxxx')],
      hat: repeat(QUARTER_HAT, 16),
      crash: crashes(16, 8),
    },

    // Lost in the dark: her heartbeat, the music box, the pings bouncing
    // from wall to wall and closing in, and the swarm rising.
    hush: {
      musicBox: HUSH_BOX,
      ping: HUSH_PING,
      echo: later(HUSH_PING.map((s, i) => (i >= 7 * BAR ? '.' : s)), 2, 12),
      choir: sustained(HUSH_CHORDS, BAR, 0, 4),
      padLow: sustained(HUSH_CHORDS, BAR, 1, 3),
      ice: crystals(HUSH_CHORDS, 0.08, 53),
      squeakL: swarm(8, [0, 0, 0.01, 0.01, 0.02, 0.04, 0.12, 0.35], 57),
      squeakR: swarm(8, [0, 0.01, 0, 0.01, 0.02, 0.04, 0.12, 0.35], 58),
      wings: [...rest(6), ...flap('x...x...x.x.x.x.'), ...flap('xxxxxxxx xxxxxxxx')],
      boom: [...repeat(HEARTBEAT, 5), ...repeat(RACING, 2), ...NONE],
      timpani: [...rest(7), ...chordLine('A', ROLL, 2)],
      snare: [...rest(7), ...hits('....x.x. xxxxxxxx')],
    },

    // The bat calls, she answers: two bars each, then one, then both together,
    // climbing to B major.
    duel: {
      lead: DUEL_BAT,
      leadLow: transpose(DUEL_BAT, -12),
      echo: later(DUEL_BAT, 2, 12),
      ves: DUEL_VES,
      bells: DUEL_VES,
      flutter: chordLine(DUEL_CHORDS, FLUTTER, 4),
      bass: chordLine(DUEL_CHORDS, BASS, 2),
      ...pads(DUEL_CHORDS),
      timpani: [...rest(8), ...chordLine(DUEL_CHORDS.split(' ').slice(8).join(' '), ONE_AND_THREE, 2)],
      ice: crystals(DUEL_CHORDS, 0.07, 67),
      squeakL: swarm(16, 0.03, 71),
      squeakR: swarm(16, 0.03, 72),
      ...kit(16, { kick: KICK_BIG }),
      openHat: repeat(OPEN_HAT, 16),
      crash: crashes(16, 8),
    },

    // Up a step: her heroic motif blazing over the bat's, everything in.
    climax: shiftSection(CLIMAX, 2),

    // Her motif rings on in G; the bat crawls back in, down through C and
    // B-flat to A, and round to the fight.
    turn: {
      ves: TURN_VES,
      lead: merge(TURN_BAT, transpose(TURN_VES, -12)),
      leadLow: transpose(merge(TURN_BAT, transpose(TURN_VES, -12)), -12),
      echo: later(onlyBars(TURN_BAT, [2, 4]), 2, 12),
      flutter: [...rest(4), ...chordLine('Bb Bb A A', FLUTTER, 4)],
      bass: chordLine(TURN_CHORDS, BASS, 2),
      ...pads(TURN_CHORDS),
      squeakL: swarm(8, [0, 0, 0.02, 0.02, 0.04, 0.06, 0.12, 0.25], 81),
      squeakR: swarm(8, [0, 0, 0.02, 0.02, 0.04, 0.06, 0.12, 0.25], 82),
      wings: [...rest(7), ...flap('x.x.x.x. xxxxxxxx')],
      timpani: [...chordLine('G Em C C Bb Bb', ON_ONE, 2), ...chordLine('A A', ROLL, 2)],
      kick: [...repeat(KICK_HALF, 6), ...repeat(KICK, 2)],
      snare: [...repeat(SNARE_HALF, 6), ...SNARE, ...SNARE_ROLL],
      hat: [...repeat(QUARTER_HAT, 6), ...repeat(HAT_16, 2)],
      crash: crashes(8, 8),
    },
  },

  // The intro plays once; after that the whole fight loops.
  order: ['intro', 'A', 'echo', 'fear', 'bridge', 'hush', 'duel', 'climax', 'turn'],
  loopFrom: 1,
};
