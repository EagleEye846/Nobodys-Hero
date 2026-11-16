import { chordLine, sustained, arpeggio } from '../../audio/notation.js';
import {
  BPM, BAR, tune, rest, held, transpose, repeat, hits, onNotes,
  POUND, DIG, RACE, RIPPLE, timp, timpRoot, T_POUND, T_HEART,
  HIT, TAIKO, TAIKO_HI, HALF_TAIKO, SNARE, FILL, BUILD_8THS, BUILD_16THS, every, swellInto, ORCHESTRA,
} from './parts/usurper.js';
import { WARDEN, HERO_CALL, cut, stopdown, after, once, fills, heldNotes } from './parts/chapter3.js';

// "Found Wanting": the Warden of the Gate, fought. The statue at the Hero's
// Gate was built to greet the Hero; it wakes, measures you, and finds you
// wanting, and it won't stop till it breaks (src/data/enemies/warden.js).
// "At the Hero's Gate" (wardenTheme.js) is its hymn, the monument as the
// city meant it; this is the fight itself, and it hits like the stone does.
// Written the way the game's best boss themes were ("Who Would Be Hero",
// usurperHeroTheme.js; the trailer's "Nobody Came", trailerTheme.js): the
// real orchestra, a build, a dead beat and a drop. Under it, a close piano
// figure that never lets up, rolling 3-3-2 over a broken drum machine (the
// AZALI trick: the piano frantic, the tune broad, both at once), so the
// piano is the one thing that's there all the way through, the way the rain
// is in the dead city.
// Everything is built from the Warden's motif (WARDEN in parts/chapter3.js):
// a fourth falling, D down to A, and a half step that says no, Eb D. The
// drop's tune is that fourth and that no, opened out into a whole melody
// over a bass walking down D C Bb A; its second line turns the fall into a
// rise, D up to A, which is the hero's own fifth. Then they fight it out:
// the Warden's fourth on the low brass, the hero's fifth on the trumpets,
// two bars each, a key higher every time. The heralds' fanfare (stairTheme
// .js), the one the city wrote to greet him, comes in D minor, the no from
// the trombones after every line. In the middle it all stops: the piano
// alone, and Ves, on her crutch behind you, calling out her motif on a solo
// violin; the hero's call answers on a horn; then her motif, heroic, rises
// on everything over a bass climbing Bb to A. The climax is up a fourth, in
// G minor, the Warden's motif crawling under it in the trombones at a
// quarter speed. Then the ladder: the whole band in stabs, every chord the
// no, each a half step higher than the last, the hero pushing up through
// it; home to D minor and the tune; and the dead beat before the drop.
// D minor, 150 BPM ("Nobody's Dawn" and the Hush's fight's speed), one step
// a 16th note: a bar is 1.6 seconds. The intro plays once (13s); then it
// loops from the drop, 100 bars, 2m40s:
//
//   intro   8 bars  the stone wakes: a gong, the motif in whole notes on
//                   the tuba and trombones, the bowed vibes; the piano
//                   figure alone; a build and a dead beat
//   A      16 bars  THE DROP (0:13): gong, concert bass drum, BRAAAM; the
//                   tune on trumpets and violins, horns an octave down, the
//                   piano figure, the bass walking D C Bb A, war drums and
//                   the broken kit; the square wave doubles the second line
//   B      16 bars  the duel (0:39): the Warden's fourth on low brass over
//                   half-time drums, the hero's fifth on trumpets and solo
//                   violin over the full kit, two bars each, in D, E, F, G
//   C      16 bars  the fanfare (1:05), in D minor, on horns and violins,
//                   the no from the trombones after every line; the second
//                   time with trumpets and the square wave on top
//   D      16 bars  THE PIVOT (1:30, halfway): the piano alone; her motif
//                   on a solo violin, the hero's call on a horn; then her
//                   motif heroic over a bass climbing Bb C D Eb F G A; a
//                   roll, a swell, and a dead beat
//   E      16 bars  RUIN (1:56): up a fourth, G minor, everything, the
//                   Warden's motif under it in the trombones, a BRAAAM
//   F       8 bars  the ladder (2:21): stabs on D Eb E F F# G G# A, the no
//                   on top of each
//   A3      8 bars  home (2:34): the tune's second line in D minor, full
//   turn    4 bars  the piano figure and the kit, the build, a dead beat

// --- The piano figure: rolling 3-3-2 over each chord, low enough to stay
// out of the tune's way. One bar per chord. ---
const FIGURE = [12, 7, 'tenth', 12, 7, 'tenth', 12, 7, 19, 'tenth', 12, 19, 'tenth', 12, 7, 24];
const figure = (chords) => chordLine(chords, FIGURE, 3);

// --- The broken kit: an amen-ish break, and its hats. ---
const BK_KICK = hits('x.x..... ..x.....');
const BK_SNARE = hits('....x..x .x..x..x');
const BK_HAT = hits('x.x.x.x. x.x.x.x.');
const BK_HAT16 = hits('xxxxxxxx xxxxxxxx');
const OPEN_HAT = hits('..x...x. ..x...x.');

// --- A: the drop. The fourth and the no, opened out; then the fall turned
// into a rise (D up to A, the hero's fifth). Each token an 8th. ---
const A_CHORDS = 'Dm Cm Bb A Dm Cm Eb A Dm Cm Bb A Gm Bb Eb A';
const A_BASS = 'D2 C2 Bb1 A1 D2 C2 Eb2 A1 D2 C2 Bb1 A1 G1 Bb1 Eb2 A1';
const A_ROOTS = 'D C Bb A D C Eb A D C Bb A G Bb Eb A';
const LINE_ONE = tune(`
  D5 - - - A4 - - - | Eb5 - - - D5 - C5 - | D5 - F5 - Bb5 - A5 - | G5 - F5 - E5 - C#5 - |
  D5 - - - A5 - - - | G5 - F5 - Eb5 - D5 - | Eb5 - G5 - Bb5 - - - | A5 - - - - - . . |
`);
const LINE_TWO = tune(`
  D6 - - - A5 - - - | Eb6 - - - D6 - C6 - | Bb5 - D6 - F6 - D6 - | C#6 - - - E6 - G6 - |
  F6 - - - D6 - Bb5 - | D6 - - - C6 - Bb5 - | Bb5 - - - G5 - Eb5 - | E5 - - - C#5 - A4 - |
`);
const TUNE = [...LINE_ONE, ...LINE_TWO];
// The trumpets take the second line an octave down; the horns and
// trombones under them the same way.
const TRUMPETS = [...LINE_ONE, ...transpose(LINE_TWO, -12)];

// --- B: the duel. The Warden's fourth, two bars; the hero's fifth, two;
// a key higher each time (D, E, F, G). ---
const DUEL_KEYS = [0, 2, 3, 5];
const DUEL_CHORDS = ['Dm Eb Dm Bb', 'Em F Em C', 'Fm Gb Fm Db', 'Gm Ab Gm Eb'];
const DUEL_ROOTS = ['D Eb D Bb', 'E F E C', 'F Gb F Db', 'G Ab G Eb'];
const B_CHORDS = DUEL_CHORDS.join(' ');
const STONE = tune(WARDEN);          // D4 A3, Eb4 D4
const CALL = tune(HERO_CALL);        // D5 up to A5, and down
const duel = (each) => DUEL_KEYS.flatMap((shift, i) => each(shift, i));
const stoneHalf = (track) => duel((shift, i) => [...track(shift, i), ...rest(2)]);
const heroHalf = (track) => duel((shift, i) => [...rest(2), ...track(shift, i)]);

// --- C: the fanfare that greeted him, in D minor; the no after each line. ---
const FANFARE_MINOR = tune(`
  A4 - D5 - F5 - A5 - | G5 - - E5 C#5 - E5 - | F5 - - - D5 - Bb4 - | D5 - - - . . . . |
  A4 - D5 - F5 - A5 - | Bb5 - A5 - G5 - F5 - | E5 - G5 - Bb5 - A5 - | A5 - - - . . . . |
`);
const C_CHORDS = 'Dm A Bb Dm Dm Gm A A Dm A Bb Dm Dm Gm A A';
const C_ROOTS = 'D A Bb D D G A A D A Bb D D G A A';
const NO_AFTER = repeat([...rest(3), ...tune('. . . . Eb4 - D4 -')], 4);

// --- D: the pivot. Her motif (C C up to A, Bb G A) in D minor, and the
// hero's call answering; then her motif heroic, climbing. ---
const D_QUIET = 'Dm Bb F C Dm F Gm Gm';
const D_CLIMB = 'Bb C Dm Eb F Gm A A';
const D_CHORDS = `${D_QUIET} ${D_CLIMB}`;
const CLIMB_BASS = 'Bb1 C2 D2 Eb2 F2 G2 A2 A1';
const HER_CALLING = tune(`
  A4/A4 F5 - - G5 E5 F5 - | . . . . . . . . | Bb4/Bb4 G5 - - A5 F5 G5 - | . . . . . . . . |
`);
const HIS_ANSWER = tune(`
  . . . . . . . . | D4 - A4 - - G4 A4 C5 | . . . . . . . . | Bb4 - A4 - F4 - D4 - |
`);
const HER_RISING = tune(`
  D5/D5 Bb5 - - C6 D6 - - | E6 - - - C6 - G5 - | F5/F5 D6 - - E6 F6 - - | G6 - - - Eb6 - Bb5 - |
  A5 - C6 - F6 - - - | Bb5 - D6 - G6 - - - | A5 - C#6 - E6 - A6 - | A6 - - - - - . . |
`);
// The hero's fifth, on F, on G, on A, under her.
const FIFTHS_UP = tune('F4 - C5 - - Bb4 C5 F5 | G4 - D5 - - C5 D5 G5 | A4 - E5 - - D5 E5 A5 | A5 - - - - - . .');

// --- E: ruin, up a fourth. ---
const E_CHORDS = 'Gm Fm Eb D Gm Fm Ab D Gm Fm Eb D Cm Eb Ab D';
const E_BASS = 'G2 F2 Eb2 D2 G2 F2 Ab2 D2 G2 F2 Eb2 D2 C2 Eb2 Ab2 D2';
const E_ROOTS = 'G F Eb D G F Ab D G F Eb D C Eb Ab D';
const E_TUNE = [...transpose(LINE_ONE, 5), ...transpose(LINE_TWO, -7)];
// The Warden's motif at a quarter of its speed, crawling under it.
const CRAWL = repeat(heldNotes('G2 D2 Ab2 G2', 2 * BAR), 2);

// --- F: the ladder. Each bar a stab of the no, a half step higher. ---
const LADDER = 'D Eb E F F# G G# A';
const LADDER_TOP = 'D5 Eb5 E5 F5 F#5 G5 G#5 A5';
const LADDER_LOW = 'D2 Eb2 E2 F2 F#2 G2 G#2 A2';
const STAB = [0, '-', '-', 0, '-', '-', '.', '.', 0, '-', 0, '-', '.', '.', '.', '.'];
const STAB_NO = [1, '-', '-', 0, '-', '-', '.', '.', 1, '-', 0, '-', '.', '.', '.', '.'];
const STAB_HITS = hits('x..x.... x.x.....');
const T_STAB = [0, '.', '.', 0, '.', '.', '.', '.', 0, '.', 0, '.', '.', '.', '.', '.'];

// --- A3: home, the second line. ---
const HOME_CHORDS = 'Dm Cm Bb A Gm Bb Eb A';
const HOME_BASS = 'D2 C2 Bb1 A1 G1 Bb1 Eb2 A1';
const HOME_ROOTS = 'D C Bb A G Bb Eb A';

// The low strings under any run of bass notes.
const strings = (bass) => ({
  basses: onNotes(bass, DIG),
  pound: transpose(onNotes(bass, POUND), 12),
});
// The full kit for `bars` bars: war drums, the break, a fill every eighth.
const fullKit = (bars, hat16From = bars) => ({
  taiko: repeat(TAIKO, bars),
  taikoHigh: fills(TAIKO_HI, FILL, bars, 8),
  snare: fills(SNARE, FILL, bars, 8),
  kick: repeat(BK_KICK, bars),
  breakSnare: repeat(BK_SNARE, bars),
  hat: [...repeat(BK_HAT, Math.min(hat16From, bars)), ...repeat(BK_HAT16, bars - Math.min(hat16From, bars))],
  openHat: repeat(OPEN_HAT, bars),
  crash: every(bars, 4),
});
// The drop's hits: gong, the concert bass drum, the deep drum, a BRAAAM on `note`.
const drop = (bars, note) => ({
  gong: once(bars),
  thud: once(bars),
  impact: every(bars, 8),
  braam: [...cut(held(`${note}2`, BAR)), ...rest(bars - 1)],
  braamLow: [...cut(held(`${note}${note === 'G' ? 1 : 2}`, BAR)), ...rest(bars - 1)],
});

export const WARDEN_BATTLE_THEME = {
  title: 'Found Wanting',
  bpm: BPM,
  stepsPerBeat: 4,
  // The whole orchestra and a drum machine at once: down, so the drops don't clip.
  volume: 0.78,

  instruments: {
    ...ORCHESTRA,
    // The piano figure: close and nearly dry, under everything.
    figure: { sample: 'grandPiano', volume: 0.34, ring: true, reverb: 0.16, pan: -0.08, humanize: { time: 0.006, volume: 0.14 } },
    // The pivot's piano, further off.
    piano: { sample: 'grandPiano', volume: 0.42, ring: true, reverb: 0.42, humanize: { time: 0.012, volume: 0.15 } },
    // Real violas for the held chords (no synth choir in chapter 3).
    choir: { sample: 'violas', volume: 0.32, attack: 0.2, release: 0.6, reverb: 0.45, pan: -0.1 },
    trem: { sample: 'violinsTrem', volume: 0.24, attack: 0.08, release: 0.4, reverb: 0.4, pan: 0.3 },
    vibes: { sample: 'vibesBowed', volume: 0.3, attack: 0.3, release: 1.2, reverb: 0.55 },
    harp: { sample: 'harp', volume: 0.32, ring: true, reverb: 0.4, pan: -0.3, humanize: { time: 0.012, volume: 0.2 } },
    // The drop: a concert bass drum, as well as the deep one.
    thud: { sample: 'concertBassDrum', drum: 'sample', volume: 0.8, ring: true, reverb: 0.4 },
    // The square wave over the brass, a touch sharp, with its own vibrato.
    chip: {
      wave: 'square', volume: 0.011, attack: 0.006, decay: 0.12, sustain: 0.7, release: 0.06, gate: 0.9,
      voices: [{ wave: 'square', detune: 12, level: 1 }],
      vibrato: { rate: 5.5, depth: 8, delay: 0.08 },
      filter: { type: 'lowpass', frequency: 3200 },
    },
    // The broken kit, dry, over the war drums.
    kick: { drum: 'kick', volume: 0.4 },
    breakSnare: { drum: 'snare', volume: 0.2 },
    hat: { drum: 'hat', volume: 0.04 },
    openHat: { drum: 'openHat', volume: 0.045 },
  },

  sections: {
    // The stone wakes. A gong; the Warden's motif in whole notes on the
    // tuba, trombones and cellos, the bowed vibes holding D and slipping to
    // Eb, the timpani's heartbeat. Then the piano figure alone, a roll, the
    // swell, and a dead beat.
    intro: stopdown({
      gong: [...once(4), ...rest(4)],
      impact: [...HIT, ...rest(7)],
      tuba: [...heldNotes('D2 A1 Eb2 D2', BAR), ...rest(4)],
      trombones: [...heldNotes('D3 A2 Eb3 D3', BAR), ...rest(4)],
      cellos: [...heldNotes('D2 A1 Eb2 D2', BAR), ...heldNotes('Bb1 Bb1 A1 A1', BAR)],
      vibes: [...held('D5', 4 * BAR), ...held('Eb5', 2 * BAR), ...held('D5', 2 * BAR)],
      timpani: [...timp('D D D D', T_HEART), ...rest(4)],
      figure: [...rest(4), ...figure('Dm Cm Bb A')],
      basses: [...rest(6), ...onNotes('Bb1 A1', DIG)],
      trem: [...rest(6), ...held('A4', 2 * BAR)],
      timpRoll: [...rest(6), ...held(timpRoot('A'), 2 * BAR)],
      roll: [...rest(6), ...BUILD_8THS, ...BUILD_16THS],
      swell: swellInto(8),
    }),

    // THE DROP. The tune on trumpets and violins, the horns an octave down,
    // the trombones two; the piano figure under it, the bass walking down,
    // war drums and the break; the square wave doubles the second line and
    // the hats double up.
    A: {
      ...drop(16, 'D'),
      trumpets: TRUMPETS,
      violins: [...LINE_ONE, ...transpose(LINE_TWO, -12)],
      soloViolin: after(8, TUNE),
      chip: after(8, TUNE),
      horns: transpose(TRUMPETS, -12),
      trombones: transpose(TRUMPETS, -24),
      tuba: heldNotes(A_BASS, BAR),
      figure: figure(A_CHORDS),
      race: after(2, arpeggio(A_CHORDS, BAR, 4, RACE)),
      choir: sustained(A_CHORDS, BAR, 1, 3),
      ...strings(A_BASS),
      timpani: timp(A_ROOTS, T_POUND),
      ...fullKit(16, 8),
    },

    // The duel. The Warden: its fourth and its no on the horns, trombones and
    // tuba, tremolo strings, half-time drums and a deep hit. The hero: his
    // fifth on the trumpets, violins and solo violin an octave up, the strings
    // racing, the full kit. A key higher every time.
    B: {
      horns: stoneHalf((s) => transpose(STONE, s)),
      trombones: stoneHalf((s) => transpose(STONE, s - 12)),
      tuba: stoneHalf((s) => transpose(STONE, s - 24)),
      trem: stoneHalf((s, i) => sustained(DUEL_CHORDS[i].split(' ').slice(0, 2).join(' '), BAR, 0, 4)),
      impact: duel(() => [...HIT, ...rest(1), ...HIT, ...rest(1)]),
      trumpets: heroHalf((s) => transpose(CALL, s - 12)),
      violins: heroHalf((s) => transpose(CALL, s - 12)),
      soloViolin: heroHalf((s) => transpose(CALL, s)),
      chip: heroHalf((s) => transpose(CALL, s)),
      race: heroHalf((s, i) => arpeggio(DUEL_CHORDS[i].split(' ').slice(2).join(' '), BAR, 4, RACE)),
      figure: heroHalf((s, i) => figure(DUEL_CHORDS[i].split(' ').slice(2).join(' '))),
      choir: sustained(B_CHORDS, BAR, 1, 3),
      basses: chordLine(B_CHORDS, DIG, 2),
      pound: chordLine(B_CHORDS, POUND, 2),
      timpani: duel((s, i) => timp(DUEL_ROOTS[i], T_POUND)),
      taiko: duel(() => [...repeat(HALF_TAIKO, 2), ...repeat(TAIKO, 2)]),
      kick: heroHalf(() => repeat(BK_KICK, 2)),
      breakSnare: heroHalf(() => repeat(BK_SNARE, 2)),
      hat: heroHalf(() => repeat(BK_HAT16, 2)),
      snare: duel(() => [...rest(3), ...FILL]),
      crash: heroHalf(() => [...HIT, ...rest(1)]),
    },

    // The fanfare that greeted him, in D minor: horns an octave down and the
    // violins, the trombones saying no after every line; the second time the
    // violins go up an octave and the trumpets and square wave come in.
    C: {
      gong: once(16),
      horns: transpose(repeat(FANFARE_MINOR, 2), -12),
      violins: repeat(FANFARE_MINOR, 2),
      soloViolin: after(8, transpose(repeat(FANFARE_MINOR, 2), 12)),
      trumpets: after(8, repeat(FANFARE_MINOR, 2)),
      chip: after(8, transpose(repeat(FANFARE_MINOR, 2), 12)),
      trombones: transpose(NO_AFTER, -12),
      tuba: sustained(C_CHORDS, BAR, 0, 2),
      figure: figure(C_CHORDS),
      race: after(8, arpeggio(C_CHORDS, BAR, 4, RACE)),
      choir: sustained(C_CHORDS, BAR, 1, 3),
      basses: chordLine(C_CHORDS, DIG, 2),
      pound: chordLine(C_CHORDS, POUND, 2),
      timpani: timp(C_ROOTS, T_POUND),
      ...fullKit(16, 8),
      impact: every(16, 8),
    },

    // THE PIVOT. Everything stops but the piano. Then Ves, on her crutch:
    // her motif on a solo violin, and the hero's call answering on a soft
    // horn. Then her motif, heroic, on the violins and solo violin over the
    // bass climbing Bb to A, the hero's fifth rising under her on the
    // trumpets, the drums coming back; a roll, a swell, and a dead beat.
    D: stopdown({
      piano: [...arpeggio(D_QUIET, BAR, 3, RIPPLE), ...rest(8)],
      vibes: [...held('D5', 4 * BAR), ...rest(12)],
      soloViolin: [...rest(4), ...HER_CALLING, ...HER_RISING],
      hornsSoft: [...rest(4), ...HIS_ANSWER, ...sustained(D_CLIMB, BAR, 0, 3)],
      cellos: [...rest(4), ...sustained('Dm F Gm Gm', BAR, 0, 2), ...heldNotes(CLIMB_BASS, BAR)],
      timpani: [...rest(4), ...timp('D F G G', T_HEART), ...timp('Bb C D Eb', T_HEART), ...timp('F G A A', T_POUND)],
      violins: [...rest(8), ...transpose(HER_RISING, -12)],
      horns: [...rest(8), ...transpose(HER_RISING, -24)],
      trumpets: [...rest(12), ...FIFTHS_UP],
      chip: [...rest(12), ...HER_RISING.slice(4 * BAR)],
      harp: [...rest(8), ...arpeggio(D_CLIMB, BAR, 4, RIPPLE)],
      choir: [...rest(8), ...sustained(D_CLIMB, BAR, 1, 3)],
      tuba: [...rest(12), ...heldNotes('F2 G2 A2 A1', BAR)],
      basses: [...rest(8), ...onNotes(CLIMB_BASS, DIG)],
      pound: [...rest(12), ...transpose(onNotes('F2 G2 A2 A1', POUND), 12)],
      race: [...rest(12), ...arpeggio('F Gm A A', BAR, 4, RACE)],
      taiko: [...rest(8), ...repeat(HALF_TAIKO, 4), ...repeat(TAIKO, 4)],
      kick: [...rest(12), ...repeat(BK_KICK, 4)],
      snare: [...rest(12), ...SNARE, ...SNARE, ...BUILD_8THS, ...BUILD_16THS],
      roll: [...rest(14), ...BUILD_8THS, ...BUILD_16THS],
      timpRoll: [...rest(14), ...held(timpRoot('A'), 2 * BAR)],
      crash: [...rest(8), ...once(8)],
      swell: swellInto(16),
    }),

    // RUIN, up a fourth in G minor: the tune on everything, the Warden's
    // motif crawling under it on the trombones, the hats doubled throughout.
    E: {
      ...drop(16, 'G'),
      trumpets: transpose(E_TUNE, -12),
      violins: E_TUNE,
      soloViolin: after(8, E_TUNE),
      chip: E_TUNE,
      horns: transpose(E_TUNE, -12),
      trombones: CRAWL,
      tuba: heldNotes(E_BASS, BAR),
      figure: figure(E_CHORDS),
      race: arpeggio(E_CHORDS, BAR, 4, RACE),
      choir: sustained(E_CHORDS, BAR, 1, 3),
      ...strings(E_BASS),
      timpani: timp(E_ROOTS, T_POUND),
      ...fullKit(16, 0),
      crash: every(16, 2),
    },

    // The ladder: the whole band in stabs, the no on top of every chord, a
    // half step higher each bar, the strings racing through it; a roll into
    // home.
    F: {
      impact: every(8, 1),
      trumpets: onNotes(LADDER_TOP, STAB_NO),
      violins: onNotes(LADDER_TOP, STAB_NO),
      soloViolin: transpose(onNotes(LADDER_TOP, STAB_NO), 12),
      chip: onNotes(LADDER_TOP, STAB_NO),
      horns: chordLine(LADDER, STAB.map((p) => (p === 0 ? 'third' : p)), 3),
      trombones: chordLine(LADDER, STAB, 3),
      tuba: chordLine(LADDER, STAB, 2),
      choir: sustained(LADDER, BAR, 2, 3),
      race: arpeggio(LADDER, BAR, 4, RACE),
      basses: onNotes(LADDER_LOW, STAB),
      pound: transpose(onNotes(LADDER_LOW, STAB), 12),
      figure: figure(LADDER),
      timpani: timp(LADDER, T_STAB),
      taiko: repeat(STAB_HITS, 8),
      kick: repeat(STAB_HITS, 8),
      snare: [...repeat(STAB_HITS, 6), ...BUILD_8THS, ...BUILD_16THS],
      crash: every(8, 2),
      timpRoll: [...rest(7), ...held(timpRoot('A'), BAR)],
      gong: [...rest(7), ...HIT],
    },

    // Home: the tune's second line in D minor, everything on it.
    A3: {
      ...drop(8, 'D'),
      trumpets: transpose(LINE_TWO, -12),
      violins: transpose(LINE_TWO, -12),
      soloViolin: LINE_TWO,
      chip: LINE_TWO,
      horns: transpose(LINE_TWO, -24),
      trombones: transpose(LINE_TWO, -24),
      tuba: heldNotes(HOME_BASS, BAR),
      figure: figure(HOME_CHORDS),
      race: arpeggio(HOME_CHORDS, BAR, 4, RACE),
      choir: sustained(HOME_CHORDS, BAR, 1, 3),
      ...strings(HOME_BASS),
      timpani: timp(HOME_ROOTS, T_POUND),
      ...fullKit(8, 4),
    },

    // The piano figure and the break alone for two bars; then the build, the
    // swell and the silence before the drop.
    turn: stopdown({
      figure: figure('Dm Dm Bb A'),
      kick: [...repeat(BK_KICK, 2), ...rest(2)],
      breakSnare: [...repeat(BK_SNARE, 2), ...rest(2)],
      hat: repeat(BK_HAT16, 4),
      basses: [...rest(2), ...onNotes('Bb1 A1', DIG)],
      trem: [...rest(2), ...held('A4', 2 * BAR)],
      timpRoll: [...rest(2), ...held(timpRoot('A'), 2 * BAR)],
      roll: [...rest(2), ...BUILD_8THS, ...BUILD_16THS],
      swell: swellInto(4),
    }),
  },

  // The stone wakes once; then the fight loops from the drop.
  order: ['intro', 'A', 'B', 'C', 'D', 'E', 'F', 'A3', 'turn'],
  loopFrom: 1,
};
