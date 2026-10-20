import { melody, chordLine, sustained, arpeggio } from '../../audio/notation.js';
import { ORGAN } from '../../audio/instruments.js';
import {
  BPM, POUND, DIG, RACE, HAMMER, RIPPLE, TREMBLE, timp, timpRoot, T_POUND, T_HEART, T_ONE,
  KICK, KICK_FOUR, SNARE, FILL, TAIKO, TAIKO_HI, HALF_TAIKO, RIM, BUILD_8THS, BUILD_16THS, swellInto, ORCHESTRA,
} from './parts/usurper.js';
import {
  BAR, tune, rest, held, onNotes, heldNotes, cut, stopdown, after, fills, every, once,
  HERO_CALL, FANFARE_D, PROPHECY_AM, HIT, hits, repeat, transpose, midi,
} from './parts/chapter3.js';

// "At the Hero's Gate": Chapter 3's boss, the Warden of the Gate, by a real
// orchestra (the recordings in assets/audio/samples/) with an organ, a choir
// and a square wave over the brass. A colossal stone statue of the
// prophesied Hero, built by the city to greet him, standing at the Gate with
// its sword raised in welcome; it's been waiting too, and when you come it
// wakes to judge you and finds you wanting: wrong height, wrong face, no
// name. It isn't evil. It's a monument doing its job. So the music is a
// chorale that falls apart: it opens with the heralds' fanfare ("The Long
// Stair", stairTheme.js) as a stone hymn, organ and choir and low brass in
// D major, which slips a half step and cracks, and then the fight. The
// Warden's own motif is a fourth falling (D down to A) and a half step that
// says no (Eb, D): the Neapolitan is the loop's one borrowed chord, and it's
// the sound of the judgement. The fanfare comes back with one note changed
// (F sharp to F: D minor) as a limping march in 7/8, three-two-two, the
// statue measuring you. The prophecy's tune ("Once, a Promise",
// prophecyTheme.js) is chanted by the choir: the inscriptions on the Gate,
// read at you. The hero's own call from "Updraft" rises from a piano alone,
// his stand, and climbs a stepwise bass into the climax, where the Warden's
// motif, the fanfare and the prophecy all sound at once in G minor and the
// statue starts to come apart: the no, hammered, falling a semitone a bar.
// The chorale returns in minor, and the loop comes round. Written the way
// the game's other bosses were (notes/reports/): a hook heard plainly before
// it's blared, one borrowed chord, a bass that walks, a tune re-barred into
// a new meter, a quiet interlude just before the halfway point, and a dead
// beat before each drop. 150 BPM, like "Who Would Be Hero" and "Nobody's
// Dawn" (nobodysDawnTheme.js), which takes over for the last phase when Ves
// has her umbrella back; this loop ends on D, the dominant of its G major,
// so the switch lands like a resolution. One step a 16th note. The chorale
// plays once (19s); then it loops from the drop, 2m30s:
//
//   intro  12 bars  the chorale: the fanfare on trumpets over organ, choir
//                   and low brass in D major, grand; the last chord slips to
//                   Eb and cracks (a gong), a build, and a dead beat
//   A      16 bars  THE DROP: the Warden's motif on trumpets and violins
//                   with the organ in parallel fourths under it (stone),
//                   the bass walking down D C Bb A, the war drums; the
//                   second half adds the square wave and a breakbeat
//   B      16 bars  Judgement, 7/8: the fanfare in minor as a limping
//                   march, the no from the trombones at each phrase's end
//   C      16 bars  the inscriptions: the prophecy chanted by the choir
//                   over the ostinato, the brass saying no in its gaps; the
//                   second time with the solo violin and racing strings
//   D      16 bars  his stand: the hero's call from a piano alone, then the
//                   solo violin and harp, then the orchestra, the bass
//                   climbing Bb C D Eb F G A to D; a roll, and a dead beat
//   E      24 bars  RUIN, G minor: the Warden's motif, the fanfare (in the
//                   trombones) and the prophecy (in the choir) at once over
//                   everything; then the no, hammered, falling a semitone a
//                   bar as the statue comes apart, and a dead beat
//   turn    8 bars  the chorale again, in D minor, over a heartbeat; the
//                   build; the silence before the drop

const roots = (chords) => chords.replace(/m\b/g, '');
const BAR7 = 14;                                   // a bar of 7/8
const rest7 = (bars) => rest(bars, BAR7);
const QUARTERS = [0, '.', '.', '.', 0, '.', '.', '.', 0, '.', '.', '.', 0, '.', '.', '.'];
const T_QUARTERS = QUARTERS;
const BASS_DRUM = hits('x....... x.......');
const QUARTER_DRUM = hits('x...x... x...x...');
const HAT_8THS = hits('x.x.x.x. x.x.x.x.');
const HAT_16THS = hits('xxxxxxxx xxxxxxxx');
const OPEN_HAT = hits('..x...x. ..x...x.');
const BREAK = hits('....x... .x..x.x.');

// --- The chorale: the fanfare's first phrase, each 8th a half note. ---
const CHORALE = melody(FANFARE_D.split('|').slice(0, 2).join('|'), 8);
const CHORALE_MINOR = melody('A4 - D5 - F5 - A5 - | G5 - - E5 C#5 - E5 -', 4);
const INTRO_CHORDS = 'D D Bm D G A A A';

// --- A: the Warden. A fourth falling, the no; the fall to the leading
// tone; the sword raised (D A D) and down; and the no again. ---
const A_CHORDS = 'Dm Eb Dm A Dm C Gm A Dm Eb Dm A Dm C A Dm';
const A_BASS = 'D2 Eb2 D2 A1 D2 C2 Bb1 A1 D2 Eb2 D2 A1 D2 C2 A1 D2';
const A_BASS_UP = 'D3 Eb3 D3 A2 D3 C3 Bb2 A2 D3 Eb3 D3 A2 D3 C3 A2 D3';
const HOOK = tune(`
  D5 - - - A4 - - - | Eb5 - - - D5 - - - | D5 - - - A4 - - - | F5 - E5 - D5 - C#5 - |
  D5 - A5 - D6 - - - | C6 - Bb5 - A5 - - - | Bb5 - A5 - G5 - F5 - | E5 - - - C#5 - - - |
  D5 - - - A4 - - - | Eb5 - - - D5 - - - | D5 - - - A4 - - - | F5 - E5 - D5 - C#5 - |
  D5 - A5 - D6 - - - | C6 - - - Bb5 - - - | A5 - - - - - - - | Eb5 - - - D5 - - - |
`);

// --- B: judgement. The fanfare with one note changed, crammed into 7/8:
// seven 8ths to the bar, the last of each old bar's holds dropped. ---
const B_CHORDS = 'Dm A Bb Dm Dm Gm C A Gm Dm Eb A Gm A Eb A';
const JUDGE = tune(`
  A4 - D5 - F5 A5 - | G5 - - E5 C#5 E5 - | F5 - - D5 - Bb4 - | D5 - - - - . . |
  A4 - D5 - F5 A5 - | Bb5 - A5 - G5 E5 - | G5 - F5 - E5 D5 - | E5 - - - - . . |
  Bb5 - - A5 - G5 - | A5 - - F5 - E5 - | D5 - Eb5 - G5 Bb5 - | A5 - - - - . . |
  Bb5 - - A5 - G5 - | C#6 - - Bb5 - A5 - | Bb5 - G5 - Eb5 D5 - | F5 - - - E5 C#5 - |
`);
// The no, from the trombones, on the last two 8ths of each phrase's bar.
const NO7 = tune('. . . . Eb3 D3 -');
const NOS7 = repeat([...rest7(3), ...NO7], 4);

// --- C: the inscriptions. The prophecy's tune in D minor. ---
const C_CHORDS = 'Dm Bb F C Dm Bb A Dm';
const PROPHECY_DM = transpose(tune(`
  ${PROPHECY_AM} | B5 - - - A5 - E5 - | F5 - - - A5 - - - | G#5 - - - - - B5 - | A5 - - - - - . . |
`), 5);
// The no, in the tune's rests (its third and eighth bars).
const NO4 = tune('. . . . Eb5 - D5 -');
const NOS4 = repeat([...rest(2), ...NO4, ...rest(4), ...NO4], 2);

// --- D: his stand. The hero's call, his call again, his answer; the call,
// the call bent by the stone (Eb for E), the call up a fourth, and up to D. ---
const D_CHORDS_B = 'Bb F Gm C';
const D_CHORDS_C = 'Bb C Dm Eb F Gm A D';
const D_CHORDS = `Dm Bb Dm C ${D_CHORDS_B} ${D_CHORDS_C}`;
const CLIMB = 'Bb2 C3 D3 Eb3 F3 G3 A3 D3';
const STAND = tune(`
  ${HERO_CALL} | D5 - A5 - - G5 A5 D6 | F6 - E6 D6 - C6 Bb5 A5 |
  ${HERO_CALL} | G5 - C6 - - Bb5 A5 G5 | A5 - - - E5 - C#5/D5 E5 |
  ${HERO_CALL} | D5 - A5 - - G5 A5 D6 | F6 - Eb6 D6 - C6 Bb5 A5 |
  G5 - D6 - - C6 D6 F6 | Eb6 - D6 - Bb5 - G5 - | A5 - - - Bb5 - C#6 - | D6 - - - - - . . |
`);

// --- E: ruin. The Warden a fourth down (G minor) with the fanfare and the
// prophecy under it; then the no, falling a semitone a bar. ---
const E_CHORDS = 'Gm Ab Gm D Gm F Cm D Gm Ab Gm D Gm F D Gm';
const E_BASS = 'G2 Ab2 G2 D2 G2 F2 Eb2 D2 G2 Ab2 G2 D2 G2 F2 D2 G2';
const E_BASS_UP = 'G3 Ab3 G3 D3 G3 F3 Eb3 D3 G3 Ab3 G3 D3 G3 F3 D3 G3';
const RUIN = transpose(HOOK, -7);
const RUIN_HIGH = transpose(HOOK, 5);
// The fanfare in G minor at half speed, low, for the trombones.
const FANFARE_UNDER = repeat(melody('D3 - G3 - Bb3 - D4 - | C4 - - A3 F#3 - A3 -', 4), 2);
const PROPHECY_GM = transpose(PROPHECY_DM, 5);
const NO_G = tune('Ab4 - - - G4 - - -');
const CRACK = [
  ...Array.from({ length: 6 }, (_, i) => transpose(NO_G, -i)).flat(),
  ...tune('Eb4 D4 Eb4 D4 Eb4 D4 Eb4 D4 | D4 - - - - - . .'),
];
const CRACK_BASS = 'G2 F#2 F2 E2 Eb2 D2 D2 D2';
const CRACK_BASS_UP = 'G3 F#3 F3 E3 Eb3 D3 D3 D3';
const CRACK_TOP = 'G5 F#5 F5 E5 Eb5 D5 D5 D5';

// --- The turn: the chorale in minor, and the build. ---
const TURN_CHORDS = 'Dm Dm Gm A';
const HORN_CLIMB = tune('F3 - - - - - - - | G3 - - - - - - - | A3 - - - - - - - | Bb3 - - - - - - -');

// --- 7/8 patterns (14 steps) and drums. ---
const POUND7 = [0, 0, 12, 0, 0, 12, 0, 0, 12, 0, 0, 0, 12, 0];
const DIG7 = [0, '.', '.', '.', '.', '.', 0, '.', '.', '.', 0, '.', '.', '.'];
const RACE7 = [0, 7, 12, 'third', 12, 7, 'tenth'];
const HAMMER7 = [12, '.', '.', 12, '.', '.', 12, '.', 12, '.', '.', 12, '.', '.'];
const T7 = [0, '.', '.', '.', '.', '.', 0, '.', '.', '.', -5, '.', '.', '.'];
const KICK7 = hits('x.....x...x...');
const SNARE7 = hits('......x...x...');
const TAIKO7 = hits('x.x.x.x.x.x.x.');
const RIM7 = hits('...x.....x..x.');
const FILL7 = hits('x.x.x.xxxxxxxx');

export const WARDEN_THEME = {
  title: "At the Hero's Gate",
  bpm: BPM,
  stepsPerBeat: 4,
  // A whole orchestra and an organ at once: turned down so the drops don't clip.
  volume: 0.75,

  instruments: {
    ...ORCHESTRA,
    harp: { sample: 'harp', volume: 0.35, ring: true, reverb: 0.4, pan: -0.3, humanize: { time: 0.012, volume: 0.2 } },
    // The organ: the chorale's, and two more ranks for the parallel fourths
    // under the Warden's motif.
    organHigh: { ...ORGAN, volume: 0.035 },
    organQuartal: { ...ORGAN, volume: 0.03 },
    // The square wave over the brass (a touch sharp, its own vibrato), and a
    // drum machine over the war drums.
    chip: {
      wave: 'square', volume: 0.012, attack: 0.006, decay: 0.12, sustain: 0.7, release: 0.06, gate: 0.9,
      voices: [{ wave: 'square', detune: 12, level: 1 }],
      vibrato: { rate: 5.5, depth: 8, delay: 0.08 },
      filter: { type: 'lowpass', frequency: 3200 },
    },
    hat: { drum: 'hat', volume: 0.04 },
    openHat: { drum: 'openHat', volume: 0.05 },
    breakSnare: { drum: 'snare', volume: 0.22 },
  },

  sections: {
    // The chorale. A gong; the fanfare on the trumpets in half notes over
    // the organ, the choir, horns, trombones and tuba, in D major, as the
    // city meant it. Then the chord slips up a half step to Eb and holds,
    // cracked, with another gong and a stone's weight of drum; the strings
    // start to race on A, the roll, the swell; and a dead beat.
    intro: {
      gong: [...once(8), ...once(4)],
      impact: [...rest(8), ...HIT, ...rest(3)],
      trumpets: [...CHORALE, ...rest(4)],
      organHigh: [...CHORALE, ...held(midi('Eb5'), 2 * BAR), ...rest(2)],
      organ: [...sustained(INTRO_CHORDS, BAR, 0, 3), ...sustained('Eb Eb', BAR, 0, 3), ...rest(2)],
      choir: [...sustained(INTRO_CHORDS, BAR, 1, 3), ...sustained('Eb Eb', BAR, 1, 3), ...cut(sustained('A A', BAR, 0, 3))],
      hornsSoft: [...sustained(INTRO_CHORDS, BAR, 0, 3), ...sustained('Eb Eb', BAR, 0, 3), ...rest(2)],
      trombones: [...sustained(INTRO_CHORDS, BAR, 1, 3), ...sustained('Eb Eb', BAR, 1, 3), ...rest(2)],
      tuba: [...sustained(INTRO_CHORDS, BAR, 0, 2), ...sustained('Eb Eb', BAR, 0, 2), ...rest(2)],
      cellos: [...sustained(INTRO_CHORDS, BAR, 0, 2), ...sustained('Eb Eb', BAR, 0, 2), ...rest(2)],
      timpani: [...rest(8), ...timp('Eb Eb', T_ONE), ...rest(2)],
      timpRoll: [...rest(10), ...cut(held(timpRoot('A'), 2 * BAR))],
      race: [...rest(10), ...cut(arpeggio('A A', BAR, 4, RACE))],
      pound: [...rest(10), ...cut(onNotes('A2 A2', POUND))],
      basses: [...rest(10), ...cut(onNotes('A1 A1', DIG))],
      roll: [...rest(10), ...BUILD_8THS, ...cut(BUILD_16THS)],
      swell: cut(swellInto(12)),
    },

    // THE DROP. Gong, the deep drum, a crash and a BRAAAM, and the Warden's
    // motif on trumpets and violins with the organ in parallel fourths under
    // it, over a bass that walks down D C Bb A and the war drums; two bars
    // of just that, then the horns, tuba, choir and racing strings; from
    // the halfway bar the piano hammers, the square wave doubles the tune
    // and a breakbeat runs under the drums.
    A: {
      gong: once(16),
      impact: every(16, 8),
      crash: every(16, 4),
      braam: [...cut(held(midi('D2'), BAR)), ...rest(15)],
      braamLow: [...cut(held(midi('D1'), BAR)), ...rest(15)],
      trumpets: HOOK,
      violins: HOOK,
      trombones: transpose(HOOK, -24),
      organ: transpose(HOOK, -12),
      organQuartal: transpose(HOOK, -17),
      chip: after(8, HOOK),
      horns: after(2, sustained(A_CHORDS, BAR, 0, 3)),
      tuba: after(2, sustained(A_CHORDS, BAR, 0, 2)),
      choir: after(2, sustained(A_CHORDS, BAR, 1, 3)),
      race: after(2, arpeggio(A_CHORDS, BAR, 4, RACE)),
      pound: onNotes(A_BASS_UP, POUND),
      basses: onNotes(A_BASS, DIG),
      piano: after(8, onNotes(A_BASS_UP, HAMMER)),
      timpani: timp(roots(A_BASS.replace(/\d/g, '')), T_POUND),
      bassDrum: repeat(BASS_DRUM, 16),
      taiko: repeat(TAIKO, 16),
      taikoHigh: fills(TAIKO_HI, FILL, 16, 8),
      snare: fills(SNARE, FILL, 16, 8),
      kick: repeat(KICK, 16),
      breakSnare: after(8, repeat(BREAK, 16)),
      hat: after(8, repeat(HAT_16THS, 16)),
      openHat: after(8, repeat(OPEN_HAT, 16)),
    },

    // Judgement, in 7/8 (three-two-two): the fanfare in minor as a limping
    // march on trumpets, violins and the square wave, the trombones saying
    // no at the end of every phrase, the organ holding the chords, the
    // strings racing in sevens.
    B: {
      trumpets: JUDGE,
      violins: JUDGE,
      chip: JUDGE,
      trombones: NOS7,
      horns: sustained(B_CHORDS, BAR7, 0, 3),
      tuba: sustained(B_CHORDS, BAR7, 0, 2),
      choir: sustained(B_CHORDS, BAR7, 1, 3),
      organ: sustained(B_CHORDS, BAR7, 0, 3),
      race: arpeggio(B_CHORDS, BAR7, 4, RACE7),
      pound: chordLine(B_CHORDS, POUND7, 2),
      basses: chordLine(B_CHORDS, DIG7, 2),
      piano: chordLine(B_CHORDS, HAMMER7, 3),
      timpani: timp(roots(B_CHORDS), T7),
      bassDrum: repeat(KICK7, 16),
      taiko: repeat(TAIKO7, 16),
      snare: fills(SNARE7, FILL7, 16, 4),
      taikoHigh: repeat(RIM7, 16),
      hat: repeat(TAIKO7, 16),
      kick: repeat(KICK7, 16),
      crash: every(16, 4, BAR7),
      impact: every(16, 8, BAR7),
    },

    // The inscriptions. Back in 4/4: the prophecy's tune chanted by the
    // choir with the organ an octave down, over the ostinato and a piano
    // ripple, the brass saying no in its gaps; the second time the solo
    // violin sings it, the strings race and the piano hammers.
    C: {
      gong: once(16),
      chant: repeat(PROPHECY_DM, 2),
      soloViolin: after(8, repeat(PROPHECY_DM, 2)),
      organHigh: transpose(repeat(PROPHECY_DM, 2), -12),
      trumpets: NOS4,
      trombones: transpose(NOS4, -24),
      horns: sustained(`${C_CHORDS} ${C_CHORDS}`, BAR, 0, 3),
      tuba: sustained(`${C_CHORDS} ${C_CHORDS}`, BAR, 0, 2),
      choir: after(8, sustained(`${C_CHORDS} ${C_CHORDS}`, BAR, 1, 3)),
      race: after(8, arpeggio(`${C_CHORDS} ${C_CHORDS}`, BAR, 4, RACE)),
      pound: chordLine(`${C_CHORDS} ${C_CHORDS}`, POUND, 2),
      basses: chordLine(`${C_CHORDS} ${C_CHORDS}`, DIG, 2),
      piano: [...arpeggio(C_CHORDS, BAR, 3, RIPPLE), ...chordLine(C_CHORDS, HAMMER, 3)],
      timpani: timp(roots(`${C_CHORDS} ${C_CHORDS}`), T_POUND),
      bassDrum: repeat(BASS_DRUM, 16),
      taiko: [...repeat(HALF_TAIKO, 8), ...repeat(TAIKO, 8)],
      snare: fills(SNARE, FILL, 16, 8),
      taikoHigh: after(8, fills(TAIKO_HI, FILL, 16, 8)),
      kick: repeat(KICK_FOUR, 16),
      hat: after(8, repeat(HAT_8THS, 16)),
      crash: every(16, 8),
      impact: every(16, 8),
    },

    // His stand. The hero's call on a piano alone; then the solo violin
    // takes it over a harp and the cellos; then the violins, horns, choir and
    // the basses climbing Bb C D Eb F G A, the trumpets and square wave in
    // for the call up a fourth, a roll and a swell up to D; and a dead beat.
    D: stopdown({
      piano: [...STAND.slice(0, 4 * BAR), ...arpeggio(D_CHORDS_B, BAR, 3, RIPPLE), ...chordLine(D_CHORDS_C, HAMMER, 3)],
      soloViolin: after(4, STAND),
      violins: after(8, transpose(STAND, -12)),
      trumpets: after(12, transpose(STAND, -12)),
      chip: after(12, STAND),
      cellos: [...rest(4), ...sustained(D_CHORDS_B, BAR, 0, 2), ...heldNotes(CLIMB, BAR)],
      harp: after(4, arpeggio(D_CHORDS, BAR, 4, RIPPLE)),
      horns: after(8, sustained(D_CHORDS, BAR, 0, 3)),
      tuba: after(8, sustained(D_CHORDS, BAR, 0, 2)),
      choir: after(8, sustained(D_CHORDS, BAR, 1, 3)),
      basses: [...rest(8), ...onNotes(CLIMB, DIG)],
      pound: [...rest(12), ...onNotes('F3 G3 A3 D3', POUND)],
      race: [...rest(12), ...arpeggio('F Gm A D', BAR, 4, RACE)],
      timpani: [...rest(8), ...timp('Bb C D Eb', T_HEART), ...timp('F G A D', T_POUND)],
      timpRoll: [...rest(14), ...held(timpRoot('D'), 2 * BAR)],
      bassDrum: [...rest(8), ...repeat(HIT, 4), ...repeat(BASS_DRUM, 4)],
      taiko: [...rest(12), ...repeat(TAIKO, 4)],
      snare: [...rest(12), ...SNARE, ...SNARE, ...BUILD_8THS, ...BUILD_16THS],
      kick: [...rest(12), ...repeat(KICK, 4)],
      roll: [...rest(14), ...BUILD_8THS, ...BUILD_16THS],
      crash: [...rest(8), ...once(8)],
      swell: swellInto(16),
    }),

    // RUIN, G minor. Gong and BRAAAM: the Warden's motif on trumpets and
    // violins (the solo violin and square wave an octave up), the fanfare in
    // minor crawling under it in the trombones, the prophecy in the choir,
    // the organ in fourths, everything driving, a breakbeat; then the no,
    // hammered on all the brass and falling a semitone a bar over a bass
    // that falls with it, the statue coming apart, a roll; and a dead beat.
    E: stopdown({
      gong: [...every(16, 8), ...once(8)],
      impact: [...every(16, 4), ...every(8, 2)],
      crash: [...every(16, 2), ...every(8, 1)],
      braam: [...cut(held(midi('G2'), BAR)), ...rest(23)],
      trumpets: [...RUIN, ...CRACK],
      violins: [...RUIN, ...transpose(CRACK, 12)],
      soloViolin: [...RUIN_HIGH, ...transpose(CRACK, 12)],
      chip: [...RUIN_HIGH, ...transpose(CRACK, 12)],
      trombones: [...FANFARE_UNDER, ...transpose(CRACK, -12)],
      horns: [...sustained(E_CHORDS, BAR, 0, 3), ...transpose(CRACK, -12)],
      tuba: [...sustained(E_CHORDS, BAR, 0, 2), ...heldNotes(CRACK_BASS, BAR)],
      chant: [...PROPHECY_GM, ...rest(8)],
      choir: [...sustained(E_CHORDS, BAR, 1, 3), ...transpose(CRACK, -12)],
      organ: [...transpose(RUIN, -12), ...heldNotes(CRACK_BASS, BAR, 1)],
      organQuartal: [...transpose(RUIN, -17), ...rest(8)],
      race: [...arpeggio(E_CHORDS, BAR, 4, RACE), ...onNotes(CRACK_TOP, TREMBLE)],
      pound: [...onNotes(E_BASS_UP, POUND), ...onNotes(CRACK_BASS_UP, POUND)],
      basses: [...onNotes(E_BASS, DIG), ...onNotes(CRACK_BASS, QUARTERS)],
      piano: [...onNotes(E_BASS_UP, HAMMER), ...onNotes(CRACK_BASS_UP, HAMMER)],
      timpani: [...timp(roots(E_BASS.replace(/\d/g, '')), T_POUND), ...timp(roots(CRACK_BASS.replace(/\d/g, '')), T_QUARTERS)],
      timpRoll: [...rest(22), ...held(timpRoot('D'), 2 * BAR)],
      bassDrum: [...repeat(BASS_DRUM, 16), ...repeat(QUARTER_DRUM, 8)],
      taiko: [...repeat(TAIKO, 16), ...repeat(QUARTER_DRUM, 6), ...BUILD_8THS, ...BUILD_16THS],
      taikoHigh: [...fills(TAIKO_HI, FILL, 16, 8), ...rest(8)],
      snare: [...fills(SNARE, FILL, 16, 8), ...repeat(SNARE, 6), ...BUILD_8THS, ...BUILD_16THS],
      breakSnare: [...rest(8), ...repeat(BREAK, 8), ...rest(8)],
      hat: [...rest(8), ...repeat(HAT_16THS, 8), ...rest(8)],
      openHat: [...rest(8), ...repeat(OPEN_HAT, 8), ...rest(8)],
      kick: [...repeat(KICK, 16), ...repeat(KICK_FOUR, 8)],
      roll: [...rest(22), ...BUILD_8THS, ...BUILD_16THS],
      swell: swellInto(24),
    }),

    // The chorale again, in D minor, on the organ, choir and soft horns over
    // a heartbeat, the statue's hymn with the light gone out of it; then the
    // horns climb, the strings race on Bb and A, the roll, the swell, and the
    // silence before the drop.
    turn: {
      gong: once(8),
      impact: [...HIT, ...rest(7)],
      organHigh: [...CHORALE_MINOR, ...rest(4)],
      organ: [...sustained(TURN_CHORDS, BAR, 0, 3), ...rest(4)],
      choir: [...sustained(TURN_CHORDS, BAR, 1, 3), ...cut(sustained('Bb Bb A A', BAR, 0, 3))],
      hornsSoft: [...sustained(TURN_CHORDS, BAR, 0, 3), ...rest(4)],
      cellos: [...sustained(TURN_CHORDS, BAR, 0, 2), ...rest(4)],
      boom: [...repeat(hits('x..x.... ........'), 4), ...rest(4)],
      horns: [...rest(4), ...cut(HORN_CLIMB)],
      trombones: [...rest(4), ...cut(held(midi('A2'), 4 * BAR))],
      race: [...rest(4), ...cut(arpeggio('Bb Bb A A', BAR, 4, RACE))],
      pound: [...rest(4), ...cut(onNotes('Bb2 Bb2 A2 A2', POUND))],
      basses: [...rest(4), ...cut(onNotes('Bb1 Bb1 A1 A1', DIG))],
      timpani: [...timp('D D G A', T_HEART), ...cut(timp('Bb Bb A A', T_QUARTERS))],
      timpRoll: [...rest(6), ...cut(held(timpRoot('A'), 2 * BAR))],
      taiko: [...rest(6), ...QUARTER_DRUM, ...cut(hits('x.x.x.x. x.x.x.x.'))],
      roll: [...rest(5), ...BUILD_8THS, ...BUILD_8THS, ...cut(BUILD_16THS)],
      swell: cut(swellInto(8)),
    },
  },

  // The chorale plays once; after that the fight loops from the drop.
  order: ['intro', 'A', 'B', 'C', 'D', 'E', 'turn'],
  loopFrom: 1,
};
