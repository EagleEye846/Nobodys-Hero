import { sustained, arpeggio, chordLine } from '../../audio/notation.js';
import {
  BPM, BAR, tune, rest, held, transpose, repeat, hits, onNotes, HERS_HERO,
  POUND, DIG, RACE, RIPPLE, timp, timpRoot, T_POUND, T_HEART,
  HIT, TAIKO, TAIKO_HI, HALF_TAIKO, SNARE, FILL, BUILD_8THS, BUILD_16THS, every, swellInto, ORCHESTRA,
} from './parts/usurper.js';
import { stopdown, after, once, fills, heldNotes } from './parts/chapter3.js';

// "Nobody's Dawn": the last phase of chapter 3's last fight, the moment Ves
// gets her umbrella back from the Hush (src/data/enemies/the_hush.js, the
// `dawn` phase), and the music under what comes after (hushSpared.js,
// hushDefeated.js). All chapter she's been on a crutch with no umbrella,
// and her motif (C C, up to A, Bb G A; "Carried on the Wind", vesTheme.js)
// has only ever been a music box far off, or limping on an oboe. Here it's
// heroic at last, in G major, on the whole real orchestra: it climbs on past
// the ache instead of settling (B B, up to G, A B). The heralds' fanfare,
// the one the city wrote for a Hero who never came, is taken back in G
// major: somebody came. Under it all, the close piano figure from the
// Warden's fight ("Found Wanting", wardenBattleTheme.js), the same 3-3-2,
// now on bright chords, and the broken kit; the glockenspiel catches the
// light on her tune like snow. Then she lifts it a step, into A. In the
// middle, the umbrella: the fight falls away to a piano and a harp, and her
// motif tender on a solo violin, as her mother might have hummed it; the
// hero's call answers on a horn (his fifth, G up to D); and the two of them
// climb in octaves over a bass rising C D E G, then the Mario cadence, Eb F,
// the flat sixth and seventh, and a dead beat before G comes back as the
// drop. G major, 150 BPM (the Hush's fight's speed, and the Warden's), one
// step a 16th: a bar is 1.6 seconds. The light catching plays once (3s);
// then it loops from A, 64 bars, 1m42s:
//
//   intro   2 bars  the umbrella opens: gong, concert bass drum, BRAAAM,
//                   a harp sweeping up, the strings shimmering, a roll
//   A      16 bars  her heroic motif on trumpets and violins, horns and
//                   trombones under, the piano figure, war drums; from the
//                   halfway bar the glockenspiel, the square wave and the break
//   B      16 bars  the fanfare taken back, in G major, on horns, trumpets
//                   and violins above, her solo violin on the second line
//   lift   16 bars  up a step, into A: her motif on everything; the second
//                   time the fanfare under it on the horns; a dead beat
//   C      16 bars  THE UMBRELLA (0:54): a piano and a harp; her motif
//                   tender on the solo violin; the hero's call on a horn;
//                   then both in octaves over the bass rising C D E G, the
//                   flat sixth and seventh (Eb, F), a swell, and a dead beat

// --- The piano figure (as in "Found Wanting"), one bar per chord. ---
const FIGURE = [12, 7, 'tenth', 12, 7, 'tenth', 12, 7, 19, 'tenth', 12, 19, 'tenth', 12, 7, 24];
const figure = (chords) => chordLine(chords, FIGURE, 3);
// A harp sweeping up through the chord.
const SWEEP = [0, 'third', 7, 12, 'tenth', 19, 24, '-'];

// --- The kit. ---
const BK_KICK = hits('x.x..... ..x.....');
const BK_SNARE = hits('....x..x .x..x..x');
const BK_HAT = hits('x.x.x.x. x.x.x.x.');
const BK_HAT16 = hits('xxxxxxxx xxxxxxxx');
const OPEN_HAT = hits('..x...x. ..x...x.');

// --- A: her motif, heroic. ---
const HERO = tune(`
  ${HERS_HERO} | D5 - - - G5 - A5 - |
  B4/B4 G5 - - A5 B5 - C6 | D6 - - - C6 - B5 - |
  C6 - - - B5 - A5 - | B5 - - - G5 - E5 - |
  C5 - - - D5 - E5 - | D5 - - - - - . . |
`);
const HERO_END = tune('C6 - B5 - A5 - F#5 - | G5 - - - - - . . |');
const HERO_TWICE = [...HERO, ...HERO.slice(0, 6 * BAR), ...HERO_END];
const A_CHORDS = 'G D Em G Am Em C D G D Em G Am Em D G';
const A_ROOTS = 'G D E G A E C D G D E G A E D G';
const A_BASS = 'G2 D2 E2 G2 A2 E2 C2 D2 G2 D2 E2 G2 A2 E2 D2 G2';

// --- B: the fanfare, taken back. ---
const FANFARE = tune(`
  D4 - G4 - B4 - D5 - | C5 - - A4 F#4 - A4 - | B4 - - - G4 - E4 - | G4 - - - - - . . |
  D4 - G4 - B4 - D5 - | E5 - D5 - C5 - A4 - | C5 - B4 - A4 - G4 - | A4 - - - - - . . |
`);
const FANFARE_END = tune('C5 - B4 - A4 - F#4 - | G4 - - - - - . . |');
const FANFARE_TWICE = [...FANFARE, ...FANFARE.slice(0, 6 * BAR), ...FANFARE_END];
const B_CHORDS = 'G D Em G G C D D G D Em G G C D G';
const B_ROOTS = 'G D E G G C D D G D E G G C D G';
const B_BASS = 'G2 D2 E2 G2 G2 C2 D2 D2 G2 D2 E2 G2 G2 C2 D2 G2';

// --- The lift: up a step, into A. ---
const LIFT = transpose(HERO, 2);
const LIFT_CHORDS = 'A E F#m A Bm F#m D E A E F#m A Bm F#m D E';
const LIFT_ROOTS = 'A E F# A B F# D E A E F# A B F# D E';
const LIFT_BASS = 'A2 E2 F#2 A2 B2 F#2 D2 E2 A2 E2 F#2 A2 B2 F#2 D2 E2';

// --- C: the umbrella. Her motif tender (C C A, Bb G A, in G), the hero's
// call answering (his fifth, G up to D), then the two of them climbing. ---
const C_CHORDS = 'G Em C D G Em C D C D Em G C D Eb F';
const C_ROOTS = 'G E C D G E C D C D E G C D Eb F';
const C_CLIMB = 'C2 D2 E2 G2 C2 D2 Eb2 F2';
const HER_TENDER = tune(`
  D5/D5 B5 - - C6 A5 B5 - | G5 - - - - - . . | C5/C5 A5 - - B5 G5 A5 - | F#5 - - - D5 - - - |
  . . . . . . . . | . . . . . . . . | D5/D5 B5 - - C6 D6 - - | E6 - - - D6 - - - |
`);
const HIS_CALL = tune(`
  . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . |
  G4 - D5 - - C5 D5 F#5 | E5 - D5 - B4 - G4 - | . . . . . . . . | . . . . . . . . |
`);
const TOGETHER = tune(`
  E5 - G5 - C6 - - - | F#5 - A5 - D6 - - - | G5 - B5 - E6 - D6 - | D6 - - - B5 - - - |
  C6 - - - E6 - - - | D6 - - - F#6 - - - | Eb6 - - - G6 - - - | F6 - - - A6 - . . |
`);

// The full kit for `bars` bars, the break and doubled hats from `breakFrom`.
const kit = (bars, breakFrom = bars / 2) => ({
  taiko: repeat(TAIKO, bars),
  taikoHigh: fills(TAIKO_HI, FILL, bars, 8),
  snare: fills(SNARE, FILL, bars, 8),
  bassDrum: repeat(hits('x....... x.......'), bars),
  kick: repeat(BK_KICK, bars),
  breakSnare: after(breakFrom, repeat(BK_SNARE, bars)),
  hat: [...repeat(BK_HAT, breakFrom), ...repeat(BK_HAT16, bars - breakFrom)],
  openHat: after(breakFrom, repeat(OPEN_HAT, bars)),
  crash: every(bars, 4),
});
// The low strings under a run of bass notes.
const strings = (bass) => ({
  basses: onNotes(bass, DIG),
  pound: transpose(onNotes(bass, POUND), 12),
});

export const NOBODYS_DAWN_THEME = {
  title: "Nobody's Dawn",
  bpm: BPM,
  stepsPerBeat: 4,
  // The whole orchestra and a drum machine: down, so it doesn't clip.
  volume: 0.66,

  instruments: {
    ...ORCHESTRA,
    figure: { sample: 'grandPiano', volume: 0.3, ring: true, reverb: 0.18, pan: -0.08, humanize: { time: 0.006, volume: 0.14 } },
    piano: { sample: 'grandPiano', volume: 0.42, ring: true, reverb: 0.42, humanize: { time: 0.012, volume: 0.15 } },
    // Real violas for the held chords (no synth choir in chapter 3).
    choir: { sample: 'violas', volume: 0.32, attack: 0.2, release: 0.6, reverb: 0.45, pan: -0.1 },
    trem: { sample: 'violinsTrem', volume: 0.24, attack: 0.3, release: 0.5, reverb: 0.45, pan: 0.3 },
    harp: { sample: 'harp', volume: 0.36, ring: true, reverb: 0.42, pan: -0.3, humanize: { time: 0.012, volume: 0.2 } },
    // The snow catching the light: a glockenspiel on her tune.
    glock: { sample: 'glock', volume: 0.16, ring: true, reverb: 0.5, pan: 0.25 },
    thud: { sample: 'concertBassDrum', drum: 'sample', volume: 0.8, ring: true, reverb: 0.4 },
    chip: {
      wave: 'square', volume: 0.011, attack: 0.006, decay: 0.12, sustain: 0.7, release: 0.06, gate: 0.9,
      voices: [{ wave: 'square', detune: 12, level: 1 }],
      vibrato: { rate: 5.5, depth: 8, delay: 0.08 },
      filter: { type: 'lowpass', frequency: 3200 },
    },
    kick: { drum: 'kick', volume: 0.4 },
    breakSnare: { drum: 'snare', volume: 0.2 },
    hat: { drum: 'hat', volume: 0.04 },
    openHat: { drum: 'openHat', volume: 0.045 },
  },

  sections: {
    // The umbrella opens: a gong, the deep drums, a BRAAAM on G, the horns
    // and violas on the chord, a harp sweeping up, the strings shimmering,
    // and a roll into her tune.
    intro: {
      gong: once(2),
      thud: once(2),
      impact: once(2),
      crash: once(2),
      braam: held('G2', 2 * BAR),
      braamLow: held('G1', 2 * BAR),
      horns: held('B3', 2 * BAR),
      choir: sustained('G G', BAR, 1, 3),
      cellos: held('G2', 2 * BAR),
      harp: arpeggio('G C', BAR, 3, SWEEP),
      trem: held('D5', 2 * BAR),
      timpRoll: [...rest(1), ...held(timpRoot('D'), BAR)],
      roll: [...rest(1), ...BUILD_16THS],
    },

    // Her motif, heroic, on the trumpets and violins, the horns and
    // trombones under it; the piano figure, the strings racing, war drums;
    // from the halfway bar the glockenspiel on her tune, the square wave,
    // the solo violin, and the break.
    A: {
      trumpets: HERO_TWICE,
      violins: HERO_TWICE,
      soloViolin: after(8, HERO_TWICE),
      glock: after(8, transpose(HERO_TWICE, 12)),
      chip: after(8, HERO_TWICE),
      horns: transpose(HERO_TWICE, -12),
      trombones: transpose(HERO_TWICE, -24),
      tuba: heldNotes(A_BASS, BAR),
      figure: figure(A_CHORDS),
      race: arpeggio(A_CHORDS, BAR, 4, RACE),
      choir: sustained(A_CHORDS, BAR, 1, 3),
      ...strings(A_BASS),
      timpani: timp(A_ROOTS, T_POUND),
      ...kit(16),
      impact: every(16, 8),
    },

    // The fanfare, taken back: on the horns, with the trumpets and violins an
    // octave up; the second line with her solo violin on top.
    B: {
      gong: once(16),
      horns: FANFARE_TWICE,
      trumpets: transpose(FANFARE_TWICE, 12),
      violins: transpose(FANFARE_TWICE, 12),
      trombones: transpose(FANFARE_TWICE, -12),
      soloViolin: after(8, transpose(FANFARE_TWICE, 12)),
      chip: after(8, transpose(FANFARE_TWICE, 12)),
      tuba: heldNotes(B_BASS, BAR),
      figure: figure(B_CHORDS),
      race: arpeggio(B_CHORDS, BAR, 4, RACE),
      choir: sustained(B_CHORDS, BAR, 1, 3),
      ...strings(B_BASS),
      timpani: timp(B_ROOTS, T_POUND),
      ...kit(16),
      impact: every(16, 4),
    },

    // Up a step, into A: her motif on everything, a BRAAAM; the second time
    // the fanfare under it on the horns. And a dead beat.
    lift: stopdown({
      gong: once(16),
      thud: every(16, 8),
      impact: every(16, 4),
      braam: [...held('A2', 2 * BAR), ...rest(14)],
      trumpets: repeat(LIFT, 2),
      violins: repeat(LIFT, 2),
      soloViolin: repeat(LIFT, 2),
      glock: transpose(repeat(LIFT, 2), 12),
      chip: repeat(LIFT, 2),
      horns: [...transpose(LIFT, -12), ...transpose(FANFARE, 2)],
      trombones: transpose(repeat(LIFT, 2), -24),
      tuba: heldNotes(LIFT_BASS, BAR),
      figure: figure(LIFT_CHORDS),
      race: arpeggio(LIFT_CHORDS, BAR, 4, RACE),
      choir: sustained(LIFT_CHORDS, BAR, 1, 3),
      ...strings(LIFT_BASS),
      timpani: timp(LIFT_ROOTS, T_POUND),
      ...kit(16, 0),
      crash: every(16, 2),
    }),

    // THE UMBRELLA. A piano and a harp; her motif tender on the solo violin;
    // the hero's call answering on a horn; then the two of them in octaves,
    // the violins and solo violin, over a bass rising C D E G and the flat
    // sixth and seventh, the drums coming back, a roll, a swell, and the
    // silence before G.
    C: stopdown({
      piano: [...arpeggio(C_CHORDS.split(' ').slice(0, 8).join(' '), BAR, 3, RIPPLE), ...figure(C_CHORDS.split(' ').slice(8).join(' '))],
      harp: arpeggio(C_CHORDS, BAR, 4, RIPPLE),
      soloViolin: [...HER_TENDER, ...TOGETHER],
      violins: [...rest(8), ...transpose(TOGETHER, -12)],
      hornsSoft: [...HIS_CALL, ...sustained(C_CHORDS.split(' ').slice(8).join(' '), BAR, 0, 3)],
      horns: [...rest(12), ...transpose(TOGETHER.slice(4 * BAR), -24)],
      glock: [...rest(8), ...TOGETHER],
      cellos: [...sustained(C_CHORDS.split(' ').slice(0, 8).join(' '), BAR, 0, 2), ...heldNotes(C_CLIMB, BAR)],
      choir: [...rest(8), ...sustained(C_CHORDS.split(' ').slice(8).join(' '), BAR, 1, 3)],
      tuba: [...rest(12), ...heldNotes('C2 D2 Eb2 F2', BAR)],
      basses: [...rest(8), ...onNotes(C_CLIMB, DIG)],
      pound: [...rest(12), ...transpose(onNotes('C2 D2 Eb2 F2', POUND), 12)],
      race: [...rest(12), ...arpeggio('C D Eb F', BAR, 4, RACE)],
      timpani: [...rest(4), ...timp('G E C D', T_HEART), ...timp('C D E G', T_HEART), ...timp('C D Eb F', T_POUND)],
      taiko: [...rest(8), ...repeat(HALF_TAIKO, 4), ...repeat(TAIKO, 4)],
      kick: [...rest(12), ...repeat(BK_KICK, 4)],
      snare: [...rest(12), ...SNARE, ...SNARE, ...BUILD_8THS, ...BUILD_16THS],
      roll: [...rest(14), ...BUILD_8THS, ...BUILD_16THS],
      timpRoll: [...rest(14), ...held(timpRoot('D'), 2 * BAR)],
      crash: [...rest(8), ...HIT, ...rest(7)],
      swell: swellInto(16),
    }),
  },

  // The light catches once; then it loops from her tune.
  order: ['intro', 'A', 'B', 'lift', 'C'],
  loopFrom: 1,
};
