import { melody, chordLine, sustained, arpeggio } from '../../audio/notation.js';
import { timp } from './parts/usurper.js';
import { ORCHESTRA } from './parts/usurper.js';
import {
  rest, held, onNotes, cut, stopdown, after, fills, every, once, HERS_GRIEF_GM, hits, repeat, transpose, midi,
} from './parts/chapter3.js';
import { WALTZ } from './pinefallTheme.js';

// "Tooth and Tatter": the Pinefall Beast, the thing that hurt Ves, fought
// in the clearing of shredded plum fabric (pinefall_tatters). A hunt, by a
// real orchestra (the recordings in assets/audio/samples/) with a square wave
// over the brass, in 6/8 at a lope: the first midboss of Chapter 3, so
// shorter and leaner than the chapter's boss, but it has to bite. The beast's
// motif is claws: a minor third, a tritone, and the pounce onto the fifth (G
// Bb C#, D). Under everything a prowling ostinato on the low strings that
// never stops circling, even when the music grieves. Its chase is the
// forest's own tune: "The Scarlet Waltz" is twelve steps a bar and so is a
// bar of 6/8, so the waltz plays here note for note, nearly twice as fast,
// its three beats heard as two, a dance turned into a run. In the middle,
// her motif grieving in G minor over the prowl (what hurt her), then near
// silence: the beast on a music box while the basses stalk. Then the hero's
// own call from "Updraft", D up to A, answered by the beast from the low
// brass, and everything climbs a chromatic ladder back to the pounce.
// G minor (the hero's D minor for his stand). 160 BPM, the beat a dotted
// quarter, one step a 16th: a bar is 12 steps and three quarters of a second.
// The intro plays once (6s); then it loops from the pounce, 136 bars, 1m42s:
//
//   intro   8 bars  a growl (tuba and trombone a ninth apart), the prowl
//                   alone, twig snaps, a heartbeat, a roll
//   A      32 bars  THE POUNCE: gong, BRAAAM, the claws on trumpets and
//                   violins, the motif up a fourth, the Neapolitan Ab (the
//                   one borrowed chord), the snarl Eb-D; the second time
//                   with the square wave, racing violins and the piano
//   B      32 bars  the chase: the waltz in 6/8, its bass creeping down by
//                   semitones under its second half, the beast mocking from
//                   the trombones in the tune's long notes; the second time
//                   the solo violin an octave up
//   C      16 bars  what hurt her: her motif grieving on the solo violin
//                   over the prowl, a harp, the choir, a heartbeat
//   stalk  16 bars  near silence: plucked basses prowling, the beast on a
//                   music box, wind; a roll
//   D      32 bars  the hero's stand, D minor: his call on the solo violin
//                   in half time, the beast answering from the trombones;
//                   then the whole orchestra on it, and a climb up the
//                   scale over a D pedal
//   ladder  8 bars  the prowl climbs a semitone a bar, G to D, the claws
//                   with it on more brass each rung, and a dead beat

const SIX = 12;                                   // a bar of 6/8
const tune6 = (text) => melody(text, 2);          // each token an 8th: six to a bar
const rest6 = (bars) => rest(bars, SIX);
const every6 = (bars, n) => every(bars, n, SIX);
const once6 = (bars) => once(bars, SIX);
const after6 = (bars, track) => after(bars, track, SIX);
// The cymbal swell is loudest 3.18s in (sampleSets.js): 51 steps here.
const swell6 = (bars) => [...Array(bars * SIX - 51).fill('.'), ...held(60, 51)];
// Notes a bar each, from chord-root names, for the timpani.
const roots = (chords) => chords.replace(/m\b/g, '');

// --- The claws. One bar: minor third, tritone, pounce. ---
const CLAWS_LOW = tune6('G2 Bb2 C#3 D3 - -');
const BEAST_LOW = tune6('G2 - Bb2 - C#3 - | D3 - - - - -');
const BEAST_IN_D = tune6('D3 - F3 - G#3 - | A3 - - - - -');
// The beast at half speed on a music box (each token a 16th).
const BOX_BEAST = melody('G5 - - - Bb5 - - - C#6 - - - | D6 - - - - - - - - - - -', 1);

// --- A: the pounce. Sixteen bars, twice. The motif, the motif again with
// its seventh, a fall through Eb, the snarl round D; the motif, the motif
// up a fourth from C, down through the Neapolitan, and the snarl again. ---
const A_CHORDS = 'Gm Gm Eb D Gm Cm Ab D Gm Gm Eb D Gm Cm Ab D'; // one per two bars
const POUNCE = tune6(`
  G4 - Bb4 - C#5 - | D5 - - - - - | G4 - Bb4 - C#5 - | D5 - F5 - D5 - |
  G5 - Eb5 - Bb4 - | C5 - Bb4 - G4 - | A4 - Bb4 - A4 - | F#4 - - - - - |
  G4 - Bb4 - C#5 - | D5 - - - - - | C5 - Eb5 - F#5 - | G5 - - - - - |
  Ab5 - G5 - F5 - | Eb5 - D5 - C5 - | D5 - Eb5 - D5 - | C#5 - - - - - |
`);
const POUNCE_AGAIN = [...POUNCE.slice(0, 14 * SIX), ...tune6('D5 - Eb5 - F5 - | F#5 - - - - -')];
const HOOK = [...POUNCE, ...POUNCE_AGAIN];

// --- B: the chase. The waltz, a fourth down into G minor, two passes; the
// waltz's own harmony with it, and its creeping bass. ---
const CHASE = transpose(WALTZ, -7);
const B_CHORDS = 'Gm Gm Cm Cm Eb D Gm D Gm Gm Cm Cm Ab D Gm Gm';
const B_CREEP = 'G2 F#2 F2 E2 Eb2 D2 G2 D2';
// The beast, mocking, in the tune's long notes (its eighth and sixteenth bars).
const MOCK = [...rest6(6), ...BEAST_LOW, ...rest6(6), ...BEAST_LOW];

// --- C: what hurt her. Her motif grieving, G minor, with the lilt of 6/8. ---
const C_CHORDS = 'Gm Eb Cm D Gm Eb Cm D Gm Eb Cm D Gm Cm D Gm';
// (Her motif, D D Bb, C A Bb, re-barred: six 8ths to the bar, so its last
// note lands on the next bar's first beat.)
const GRIEF = tune6(`
  D5/D5 Bb5 - - C6 A5 | Bb5 - - G5 - - | Eb5 - G5 - C6 - | A5 - - - - . |
  D5/D5 Bb5 - - C6 A5 | Bb5 - - D6 - - | Eb6 - D6 - C6 - | A5 - - F#5 - - |
  G5 - A5 - Bb5 - | C6 - - Bb5 - - | Eb6 - - D6 - C6 | A5 - - - - - |
  D5/D5 Bb5 - - C6 A5 | Bb5 - - - - - | A5 - - - - - | G5 - - - - - |
`);

// --- stalk: the Neapolitan creeping into the prowl, and the music box. ---
const STALK_CHORDS = 'Gm Gm Gm Gm Gm Gm Ab Ab Gm Gm Gm Gm D D D D';
const STALK_BOX = [
  ...BOX_BEAST, ...rest6(2), ...transpose(BOX_BEAST, 5), ...rest6(2),
  ...BOX_BEAST, ...rest6(2), ...transpose(BOX_BEAST, 7), ...rest6(2),
];

// --- D: the hero's stand. His call, re-barred into 6/8, in half time with
// the beast answering; then with everything; then the climb. ---
const D_CHORDS = 'Dm Dm Bb A Dm Dm C A Dm Dm Dm Dm Gm Gm Gm Gm Dm Dm Bb A Dm Dm C A D D D D D D D D';
const STAND = tune6(`
  D5 - A5 - - G5 | A5 - C6 - Bb5 - | A5 - F5 - D5 - | E5 - - - - - |
  D5 - A5 - - G5 | A5 - D6 - F6 - | E6 - D6 - C6 - | C#6 - - - - - |
  D5 - A5 - - G5 | A5 - - - - - | . . . . . . | . . . . . . |
  G5 - D6 - - C6 | D6 - - - - - | . . . . . . | . . . . . . |
  D5 - A5 - - G5 | A5 - C6 - Bb5 - | A5 - F5 - D5 - | E5 - - - - - |
  D5 - A5 - - G5 | A5 - D6 - F6 - | E6 - D6 - C6 - | C#6 - - - - - |
  G4 - A4 - Bb4 - | C5 - D5 - Eb5 - | F5 - G5 - A5 - | Bb5 - C6 - D6 - |
  Eb6 - D6 - C6 - | Bb5 - A5 - G5 - | F#5 - G5 - A5 - | Bb5 - C#6 - - - |
`);
const STAND_LOW = transpose(STAND, -12);
const ANSWERS = [...rest6(10), ...BEAST_IN_D, ...rest6(2), ...BEAST_LOW, ...rest6(16)];

// --- The ladder: a semitone a bar, G up to D. ---
const LADDER = 'G2 G#2 A2 Bb2 B2 C3 C#3 D3';
const rungs = (from, octaves = 0) => Array.from({ length: 8 }, (_, i) => (i >= from ? transpose(CLAWS_LOW, i + 12 * octaves) : rest6(1))).flat();

// --- Patterns, one bar of 6/8 (12 steps). ---
// The prowl: root, fifth, seventh, a flick to the octave and back.
const PROWL = [0, '.', 7, '.', 10, 12, 0, '.', 7, '.', 12, 10];
const PROWL2 = [...PROWL, ...PROWL];
// The basses digging in on dotted eighths: four to a bar, against the two beats.
const DIG6 = [0, '.', '.', 0, '.', '.', 0, '.', '.', 0, '.', '.'];
const DIG6x2 = [...DIG6, ...DIG6];
const RACE6 = [0, 7, 12, 'third', 12, 7, 'tenth', 7, 12, 7, 0, 7];
const HAMMER6 = [12, '.', '.', 12, '.', '.', 12, '.', 12, '.', '.', 12];
const HAMMER6x2 = [...HAMMER6, ...HAMMER6];
const RIPPLE6 = [0, '-', 7, '-', 12, '-', 'tenth', '-', 12, '-', 7, '-'];
const HELD6 = [0, ...Array(SIX - 1).fill('-')];
// Timpani: the two beats and a pickup to the second; a heartbeat; the beats.
const T6_POUND = [0, '.', '.', '.', '.', -5, 0, '.', '.', 0, '.', '.'];
const T6_POUND2 = [...T6_POUND, ...T6_POUND];
const T6_HEART = [0, '.', '.', 0, '.', '.', '.', '.', '.', '.', '.', '.'];
const T6_BEATS = [0, '.', '.', '.', '.', '.', 0, '.', '.', '.', '.', '.'];

// --- Drums, a bar at a time. ---
const KICK6 = hits('x.....x.....');
const KICK6_ONE = hits('x...........');
const SNARE6 = hits('......x.....');
const SNARE6_DRIVE = hits('...x..x..x..');
const FILL6 = hits('x.x.x.xxxxxx');
const HAT6 = hits('x.x.x.x.x.x.');
const HAT6_16 = hits('xxxxxxxxxxxx');
const TAIKO6 = hits('x..x..x..x..');
const RIM6 = hits('..x..x..x..x');
const BUILD6_8 = hits('x.x.x.x.x.x.');
const BUILD6_16 = hits('xxxxxxxxxxxx');

// The war drums under `bars` bars, a fill every `n`th.
const drums = (bars, n = 8) => ({
  bassDrum: repeat(KICK6, bars),
  taiko: repeat(TAIKO6, bars),
  snare: fills(SNARE6, FILL6, bars, n),
  taikoHigh: fills(RIM6, FILL6, bars, n),
  crash: every6(bars, n),
});
// The chip kit on top, for the full stretches.
const machine = (bars) => ({
  kick: repeat(KICK6, bars),
  hat: repeat(HAT6, bars),
  snareDrive: repeat(SNARE6_DRIVE, bars),
});

// A gust: no note, just air, sweeping up and opening out as it blows.
const GUST = {
  voices: [{ wave: 'sine', level: 0 }],
  sweep: { from: 300, to: 5000, time: 2.4, q: 1.4 },
  attack: 1.2, decay: 1.5, sustain: 0.8, release: 0.7, gate: 1,
  breath: { level: 1, frequency: 1400, q: 0.5 },
  pan: 0.3,
  reverb: 0.4,
};

export const PINEFALL_BEAST_THEME = {
  title: 'Tooth and Tatter',
  bpm: 160,
  stepsPerBeat: 6,
  // A whole orchestra at once: turned down so the pounce doesn't clip.
  volume: 0.75,

  instruments: {
    ...ORCHESTRA,
    harp: { sample: 'harp', volume: 0.35, ring: true, reverb: 0.4, pan: -0.3, humanize: { time: 0.012, volume: 0.2 } },
    // The growl: a tuba on G and a trombone a minor ninth above it.
    growl: { sample: 'tuba', volume: 0.5, attack: 0.3, release: 0.8, reverb: 0.35 },
    growlHigh: { sample: 'trombone', volume: 0.3, attack: 0.5, release: 0.8, reverb: 0.4 },
    // The square wave over the brass (a touch sharp, its own vibrato), and a
    // drum machine over the war drums.
    chip: {
      wave: 'square', volume: 0.012, attack: 0.006, decay: 0.12, sustain: 0.7, release: 0.06, gate: 0.9,
      voices: [{ wave: 'square', detune: 12, level: 1 }],
      vibrato: { rate: 5.5, depth: 8, delay: 0.08 },
      filter: { type: 'lowpass', frequency: 3200 },
    },
    hat: { drum: 'hat', volume: 0.04 },
    snareDrive: { drum: 'snare', volume: 0.18 },
    // Plucked basses stalking, soft, for the near silence.
    stalkers: { sample: 'bassSpic', volume: 0.36, release: 0.1, reverb: 0.3, humanize: { time: 0.008, volume: 0.2 } },
    gust: { ...GUST, volume: 0.06 },
  },

  sections: {
    // The growl. The prowl alone on the low strings, twig snaps, a heartbeat
    // in the timpani, and a roll with a cymbal swell into the pounce.
    intro: {
      growl: held(midi('G1'), 8 * SIX),
      growlHigh: [...rest6(1), ...held(midi('Ab2'), 7 * SIX)],
      pound: [...rest6(2), ...onNotes('G2 G2 G2 G2 G2 G2', PROWL)],
      rim: [...rest6(2), ...repeat(RIM6, 6)],
      timpani: timp('G G G G G G G G', T6_HEART),
      roll: [...rest6(6), ...BUILD6_8, ...BUILD6_16],
      swell: swell6(8),
    },

    // THE POUNCE. Gong, the deep drum, a BRAAAM, and the claws on trumpets
    // and violins over the prowl and the war drums; the horns and tuba hold
    // the chords; the second time the square wave doubles the tune, the
    // violins race, the piano hammers and the drum machine joins.
    A: {
      gong: once6(32),
      impact: every6(32, 16),
      braam: [...cut(held(midi('G2'), SIX), 3), ...rest6(31)],
      braamLow: [...cut(held(midi('G1'), SIX), 3), ...rest6(31)],
      trumpets: HOOK,
      violins: HOOK,
      trombones: transpose(HOOK, -24),
      chip: after6(16, HOOK),
      horns: sustained(A_CHORDS, 2 * SIX, 0, 3),
      tuba: sustained(A_CHORDS, 2 * SIX, 0, 2),
      choir: after6(16, sustained(A_CHORDS, 2 * SIX, 1, 3)),
      race: after6(16, arpeggio(A_CHORDS, 2 * SIX, 4, RACE6)),
      pound: chordLine(A_CHORDS, PROWL2, 2),
      basses: chordLine(A_CHORDS, DIG6x2, 2),
      piano: after6(16, chordLine(A_CHORDS, HAMMER6x2, 3)),
      timpani: timp(roots(A_CHORDS), T6_POUND2),
      ...drums(32),
      ...machine(32),
      kick: after6(16, repeat(KICK6, 32)),
      hat: after6(16, repeat(HAT6, 32)),
      snareDrive: after6(16, repeat(SNARE6_DRIVE, 32)),
    },

    // The chase: the waltz in 6/8 on trumpets and violins, the beast mocking
    // from the trombones in its long notes, the bass creeping under its
    // second half; the second pass with the solo violin an octave up.
    B: {
      trumpets: repeat(CHASE, 2),
      violins: repeat(CHASE, 2),
      soloViolin: after6(16, repeat(transpose(CHASE, 12), 2)),
      chip: repeat(CHASE, 2),
      trombones: repeat(MOCK, 2),
      horns: sustained(`${B_CHORDS} ${B_CHORDS}`, SIX, 0, 3),
      tuba: sustained(`${B_CHORDS} ${B_CHORDS}`, SIX, 0, 2),
      choir: after6(16, sustained(`${B_CHORDS} ${B_CHORDS}`, SIX, 1, 3)),
      race: arpeggio(`${B_CHORDS} ${B_CHORDS}`, SIX, 4, RACE6),
      pound: chordLine(`${B_CHORDS} ${B_CHORDS}`, PROWL, 2),
      basses: repeat([...chordLine('Gm Gm Cm Cm Eb D Gm D', DIG6, 2), ...onNotes(B_CREEP, DIG6)], 2),
      piano: chordLine(`${B_CHORDS} ${B_CHORDS}`, HAMMER6, 3),
      timpani: timp(roots(`${B_CHORDS} ${B_CHORDS}`), T6_POUND),
      ...drums(32),
      ...machine(32),
      impact: every6(32, 16),
    },

    // What hurt her. The brass stops. Her motif grieving on the solo violin
    // over the prowl, which won't stop circling; a harp, the choir, the
    // cellos low, and a heartbeat.
    C: {
      soloViolin: GRIEF,
      cellos: sustained(C_CHORDS, SIX, 0, 2),
      choir: sustained(C_CHORDS, SIX, 1, 3),
      harp: arpeggio(C_CHORDS, SIX, 3, RIPPLE6),
      pound: chordLine(C_CHORDS, PROWL, 2),
      timpani: timp(roots(C_CHORDS), T6_HEART),
      boom: repeat(KICK6_ONE, 16),
      rim: repeat(RIM6, 16),
    },

    // Near silence. Plucked basses prowling with the Neapolitan creeping in,
    // the beast at half speed on a music box, a low drone, the wind; then a
    // roll pulls the hero in.
    stalk: {
      stalkers: chordLine(STALK_CHORDS, PROWL, 2),
      musicBox: STALK_BOX,
      cellos: [...held(midi('G2'), 12 * SIX), ...held(midi('D2'), 4 * SIX)],
      timpani: timp(roots(STALK_CHORDS), T6_HEART),
      rim: repeat(RIM6, 16),
      gust: [...held(60, 4 * SIX), ...rest6(4), ...held(60, 4 * SIX), ...rest6(4)],
      roll: [...rest6(14), ...BUILD6_8, ...BUILD6_16],
    },

    // The hero's stand, D minor. His call on the solo violin in half time
    // over a piano ripple, the beast answering from the trombones; then the
    // trumpets, violins and square wave take it with the whole orchestra,
    // and everything climbs the scale over a D pedal with a swell.
    D: {
      crash: [...once6(16), ...every6(16, 8)],
      soloViolin: STAND,
      trumpets: after6(16, STAND_LOW),
      violins: [...sustained(D_CHORDS.split(' ').slice(0, 16).join(' '), SIX, 1, 4), ...STAND_LOW.slice(16 * SIX)],
      chip: after6(16, STAND),
      trombones: [...ANSWERS.slice(0, 16 * SIX), ...transpose(STAND_LOW, -12).slice(16 * SIX)],
      horns: sustained(D_CHORDS, SIX, 0, 3),
      tuba: sustained(D_CHORDS, SIX, 0, 2),
      choir: after6(8, sustained(D_CHORDS, SIX, 1, 3)),
      cellos: [...sustained(D_CHORDS.split(' ').slice(0, 16).join(' '), SIX, 0, 2), ...rest6(16)],
      race: after6(16, arpeggio(D_CHORDS, SIX, 4, RACE6)),
      pound: after6(16, chordLine(D_CHORDS, PROWL, 2)),
      basses: chordLine(D_CHORDS, DIG6, 2),
      piano: [...arpeggio(D_CHORDS.split(' ').slice(0, 16).join(' '), SIX, 3, RIPPLE6), ...chordLine(D_CHORDS.split(' ').slice(16).join(' '), HAMMER6, 3)],
      timpani: [...timp(roots(D_CHORDS.split(' ').slice(0, 16).join(' ')), T6_HEART), ...timp(roots(D_CHORDS.split(' ').slice(16).join(' ')), T6_POUND)],
      bassDrum: [...repeat(KICK6_ONE, 16), ...repeat(KICK6, 16)],
      rim: [...repeat(RIM6, 16), ...rest6(16)],
      taiko: after6(16, repeat(TAIKO6, 32)),
      snare: [...rest6(16), ...fills(SNARE6, FILL6, 12, 4), ...BUILD6_8, ...BUILD6_8, ...BUILD6_16, ...BUILD6_16],
      taikoHigh: after6(16, fills(RIM6, FILL6, 32, 8)),
      ...machine(32),
      kick: after6(16, repeat(KICK6, 32)),
      hat: after6(16, repeat(HAT6, 32)),
      snareDrive: after6(16, repeat(SNARE6_DRIVE, 32)),
      roll: [...rest6(28), ...BUILD6_8, ...BUILD6_8, ...BUILD6_16, ...BUILD6_16],
      swell: swell6(32),
    },

    // The ladder: the prowl climbs a semitone a bar, the claws climbing with
    // it on the trombones, then the horns, the trumpets, the violins and the
    // square wave; the drums tighten into a roll; and a dead beat.
    ladder: stopdown({
      trombones: rungs(0),
      horns: rungs(2),
      trumpets: rungs(4, 2),
      violins: rungs(6, 2),
      chip: rungs(4, 2),
      pound: onNotes(LADDER, PROWL),
      basses: onNotes(LADDER, DIG6),
      tuba: onNotes(LADDER, HELD6),
      cellos: onNotes(LADDER, HELD6).map((s) => (typeof s === 'number' ? s + 12 : s)),
      timpani: timp('G G# A Bb B C C# D', T6_BEATS),
      bassDrum: repeat(KICK6, 8),
      taiko: [...repeat(TAIKO6, 4), ...repeat(BUILD6_8, 2), ...repeat(BUILD6_16, 2)],
      snare: [...repeat(SNARE6, 4), ...repeat(BUILD6_8, 2), ...repeat(BUILD6_16, 2)],
      hat: repeat(HAT6_16, 8),
      kick: repeat(KICK6, 8),
      crash: every6(8, 2),
      impact: every6(8, 2),
      roll: [...rest6(4), ...repeat(BUILD6_8, 2), ...repeat(BUILD6_16, 2)],
      swell: swell6(8),
    }, 6),
  },

  // The intro plays once; after that the hunt loops from the pounce.
  order: ['intro', 'A', 'B', 'C', 'stalk', 'D', 'ladder'],
  loopFrom: 1,
};
