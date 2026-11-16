import { sustained, arpeggio, chordLine, melody } from '../../audio/notation.js';
import { held, onNotes, transpose, repeat, midi, timp, timpRoot, ORCHESTRA } from './parts/usurper.js';
import { HERS_GRIEF_GM } from './parts/chapter3.js';

// "Nothing Sings": written for the Hush (Chapter 3's last boss) but set aside
// for a later point in the game; the Hush has its own theme in hushTheme.js. The huge,
// silent black boar that has hunted the party down the mountain and through
// the Hushwood, standing upright now with Ves's umbrella in its jaws. The
// birds stop singing when it's near, so the song has a stretch where they do.
// Plays for its first two phases; once the umbrella is back in her hands it
// gives way to "Nobody's Dawn" (nobodysDawnTheme.js).
//
// A dark, limping waltz, tragic and heroic at once, with the dancer the thing
// hunting you. Strings come first: a cello sings the tune and the violins
// take it up, with the horns soft behind and the clarinet in the gaps; the
// prowl (root, fifth, seventh, a flick to the octave: the ostinato the Hush
// has made all chapter in "Tooth and Tatter" and "Something in the Trees",
// pinefallBeastTheme.js and hushStalkTheme.js) is the rhythm, plucked on
// cellos and basses with the violins plucking the off beats and a low piano
// under: oom, pah, pah. There is no snare, no breakbeat and no war drums; the
// timpani only marks a bar now and then, and the gong and the deep drum are
// struck ONCE a loop, at the drop after the quiet, so when they land it means
// something. No trumpet leads anything.
//
// Everything grows from two small cells, in the way Fox builds ASGORE out of
// tunes the player has already heard:
//   THE CLAWS: G Bb C#, D (a minor third, a tritone, the pounce).
//   HERS: the grieving G minor form of Ves's motif (parts/chapter3.js), with
//     one beat taken out so it fits a bar of 3. The fight is about her umbrella.
// The main tune opens with the claws' first two notes made gentle: G Bb D, a
// plain rising minor triad; four bars later the same three notes come back
// with one changed, G Bb C# (Fox: change one note), and the leading tone
// leans on the pounce. Then it is re-barred, harmonised in thirds, frayed
// against itself in 3-against-2, taken into 6/8, answered by hers, and finally
// lifted into B flat major.
//
// The harmony is Fox's: minor i, VII, VI over a bass that walks down a scale
// (G F Eb D, a lament), and ONE borrowed colour chord per phrase: the
// Neapolitan A flat (a half step over home) under the second phrase, where
// the pounce lands. In the climax the borrowed chord is the minor iv (E flat
// minor), grief inside the major key. G minor; the climax in B flat. 112 BPM,
// one step a 16th, a bar is 12 steps (3/4, or 6/8 when it's re-barred). The
// intro plays once (6s); then it loops from the stalk, 104 bars, 2m47s. A
// new idea every 25 seconds or so, the pivot at 1:11 (a near-silence, then the
// pounce re-barred into 6/8), and home again before the loop:
//
//   intro      4 bars  a tuba growl, the prowl alone on a plucked cello over
//                      a low piano and a heartbeat, the claws on a clarinet
//                      with the pounce held back
//   A         16 bars  the stalk: the tune on a solo cello, then the violins
//                      take it with the cello an octave down; the bass walks
//                      G F Eb D, then G F Ab D
//   B         16 bars  her motif: on a solo violin over a harp, then on the
//                      violins harmonised in thirds under a horn, the claws
//                      in the low horn under the last two bars of each pass
//   fray      12 bars  the waltz comes apart: the claws in groups of three
//                      against the bar of two (6/8 over 3/4), climbing a
//                      semitone every two bars over a chromatic bass, tremolo
//                      strings, stabs on the wrong beat; a dead stop
//   hush      12 bars  the birds stop. Eight bars of almost nothing: high
//                      glass chirping, fewer every bar, then none; her motif
//                      on bowed vibraphone; the prowl creeping back on plucked
//                      basses under a drone. Then four bars of tremolo strings
//                      rising, a timpani roll and a swell, and a beat of
//                      silence
//   D          8 bars  THE DROP, the only one: a gong, the deep drum and a low
//                      brass BRAAAM; the pounce held a whole bar, and the
//                      tune re-barred into 6/8 (dotted quarters), horns,
//                      cellos and violins, with the Neapolitan under it
//   duel      16 bars  its claws call in 6/8 (horns and cellos), her motif
//                      answers in 3/4 (violins), up a step each time (G, A,
//                      B flat); the fourth time both at once, and a run to
//                      the dominant of B flat
//   climax    16 bars  B flat major: the tune lifted into the major (D F Bb for
//                      G Bb D), her motif heroic in the middle of it, violins
//                      and horns and cellos over a rolling piano and harp, the
//                      claws drowning below in the trombones
//   turn       8 bars  the claws crawl back, B flat then A flat, to the
//                      dominant; the prowl returns in the opening texture and
//                      the stalk begins again

const B3 = 12;                                     // a bar of 3/4 (or 6/8), in 16ths
const tune = (text) => melody(text, 2);            // each token an 8th: six to a bar
const rest = (bars) => Array(bars * B3).fill('.');
const every = (bars, n) => Array.from({ length: bars }, (_, i) => (i % n === 0 ? ['x', ...Array(B3 - 1).fill('.')] : rest(1))).flat();
// Keeps only every `n`th bar of a track: for a drum that only marks a bar now and then.
const sparse = (track, n) => track.map((s, i) => (Math.floor(i / B3) % n === 0 ? s : '.'));
const cut = (track, steps = 4) => [...track.slice(0, track.length - steps), ...Array(steps).fill('.')];
const stopdown = (section) => Object.fromEntries(Object.entries(section).map(([name, track]) => [name, cut(track)]));
const after = (bars, track) => [...rest(bars), ...track.slice(bars * B3)];
// The cymbal swell is loudest 3.18s in (sampleSets.js): 24 steps at 112 BPM.
const SWELL_STEPS = 24;
const swellInto = (bars) => [...Array(bars * B3 - SWELL_STEPS).fill('.'), ...held(60, SWELL_STEPS)];
// A diatonic third below every note, in G minor (Fox's parallel thirds).
const THIRD_DOWN = { 7: 4, 9: 4, 10: 3, 0: 3, 2: 4, 3: 4, 5: 3, 6: 3 };
const thirds = (track) => track.map((n) => (typeof n === 'number' ? n - (THIRD_DOWN[n % 12] ?? 3) : n));

// --- Patterns, one bar. ---
// The prowl: oom on one, then fifth, seventh, a flick to the octave and back.
const PROWL = [0, '.', '.', '.', 7, '.', '.', 10, 12, '.', 10, '.'];
// The prowl in the quiet: no flick, and slow.
const STALK = [0, '.', '.', '.', '.', '.', 7, '.', '.', '.', 10, '.'];
// The prowl in 6/8: two beats of three.
const SWING = [0, '.', '.', '.', '.', '.', 7, '.', '.', 10, '.', '.'];
// The violins plucking the off beats: pah, pah (and in 6/8, against it).
const PAH = ['.', '.', '.', '.', 7, '.', '.', '.', 'third', '.', '.', '.'];
const PAH_68 = ['third', '.', '.', '.', '.', '.', 12, '.', '.', '.', '.', '.'];
const PAH_HIGH = ['.', '.', '.', '.', 'tenth', '.', '.', '.', 12, '.', '.', '.'];
const RIPPLE = [0, '-', 7, '-', 12, '-', 'tenth', '-', 12, '-', 7, '-'];
const ROLL = [0, 7, 12, 'tenth', 12, 7, 0, 7, 12, 'tenth', 12, 7];
const ONE = [0, ...Array(11).fill('.')];                     // a hit on the downbeat
const PEDAL = Array(12).fill(0);
const PEDAL_QUARTERS = [0, '.', '.', '.', 0, '.', '.', '.', 0, '.', '.', '.'];
const PEDAL_CUT = [...Array(8).fill(0), '.', '.', '.', '.'];
const T_HEART = [0, '.', '.', 0, ...Array(8).fill('.')];     // lub-dub
const T_TWO = [0, '.', '.', '.', '.', '.', '.', '.', 0, '.', '.', '.'];
// Stabs on the wrong beat, a different one each bar, for the fray.
const STABS = [
  ['.', '.', '.', '.', '.', '.', '.', 0, '.', '.', '.', '.'],
  ['.', '.', 0, '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', 0, '.', '.', '.', '.', 0, '.'],
];
const TIMP_STABS = [
  ['.', '.', '.', '.', '.', '.', '.', '.', '.', 0, '.', '.'],
  [0, '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', '.', '.', '.', '.', '.', 0, '.', '.', '.', '.'],
];
const stabs = (chords, patterns, octave, fn) => chords.split(' ').flatMap((chord, i) => fn(chord, patterns[i % patterns.length], octave));
const stabLine = (chords, patterns, octave) => stabs(chords, patterns, octave, (c, p, o) => chordLine(c, p, o));
const timpStabs = (chords) => stabs(chords, TIMP_STABS, 0, (c, p) => timp(c, p));

// --- The claws. Three quarters and the pounce held a bar (3/4); or in 6/8,
// four dotted quarters. ---
const CLAWS = tune('G3 - Bb3 - C#4 - | D4 - - - - -');
const CLAWS_68 = tune('G4 - - Bb4 - - | C#5 - - D5 - -');
// Her motif for a bar of 3: the grief form with one beat taken out (the 4th
// and last tokens, both held notes), so it fits six 8ths.
const HERS = HERS_GRIEF_GM.split(' ').filter((_, i) => i !== 3 && i !== 7).join(' ');
// The same, at half speed on the bowed vibraphone (each token a quarter note).
const BOX_HERS = melody(`${HERS} | G5 - - - - -`, 4);

// --- A: the stalk. G Bb D (the claws, gentle), then down through F and Eb,
// and the claws proper (G Bb C#) leaning on the pounce. Second pass: the
// answer reaches higher over the Neapolitan Ab, and the second ending is the
// pounce itself, held. ---
const A_CHORDS = 'Gm F Eb D Gm F Ab D';
const A_ALL = `${A_CHORDS} ${A_CHORDS}`;
const STALK_1 = tune(`
  G4 - Bb4 - D5 - | C5 - A4 - F4 - | Bb4 - G4 - Eb4 - | G4 - Bb4 - C#5 - |
  D5 - Bb4 - G5 - | A5 - - F5 - C5 | Ab5 - - Eb5 - C5 | A5 - G5 - F#5 - |
`);
const STALK_2 = tune(`
  G4 - Bb4 - D5 - | C5 - A4 - F4 - | Bb4 - G4 - Eb4 - | G4 - Bb4 - C#5 - |
  D5 - Bb4 - G5 - | C6 - - A5 - F5 | Ab5 - - Eb5 - C5 | D5 - - - - - |
`);

// --- B: her motif. Her grieving G minor form (re-barred to a bar of 3), the
// tender F-major form in the middle of it, the ache on a D chord. ---
const B_CHORDS = 'Gm Eb F Gm Gm Eb D D';
const B_ALL = `${B_CHORDS} ${B_CHORDS}`;
const HERS_TUNE = tune(`
  ${HERS} | G5 - - - Eb5 - | C5/C5 A5 - Bb5 G5 A5 | Bb5 - - G5 - D5 |
  D6/D6 Bb5 - C6 D6 Eb6 | F6 - - D6 - Bb5 | C6 - A5 - F#5 - | A5 - - - - - |
`);

// --- fray: the claws in groups of three eighths against the bar of two (6/8
// over 3/4), a semitone higher every two bars, over a bass that climbs a
// semitone a bar. ---
const FRAY_CHORDS = 'Gm Gm Gm Gm Cm Cm Cm Cm D D D D';
const FRAY_BASS = 'G2 G#2 A2 Bb2 B2 C3 C#3 D3 D3 D3 D3 D3';
const FRAY_CLAWS = [0, 1, 2, 3, 4, 5].flatMap((s) => transpose(CLAWS_68, s));

// --- hush: the birds, fewer every bar, then none (each token a 16th). ---
const CHIRPS = melody(`
  D7 . . . G6 . . Bb6 . . D7 . |
  D7 . . . G6 . . Bb6 . . . . |
  D7 . . . G6 . . . . . . . |
  D7 . . . . . . . . . . . |
`, 1);
const HUSH_BASS = 'G2 G2 G2 G2 Ab2 Ab2 G2 G2';
// The hush's build, four bars: tremolo violas, then cellos, then violins, the
// horns climbing, a timpani roll and a swell, and everything stops dead a beat
// early. It starts `from` bars into its section.
const HORN_CLIMB = tune('C3 - D3 - E3 - | F3 - F#3 - G3 -');
function build(chords, from) {
  const [a, b, c] = chords.split(' ');
  const tracks = {
    violasTrem: cut(sustained(`${a} ${b} ${c} ${c}`, B3, 2, 4)),
    cellosTrem: [...rest(1), ...cut(sustained(`${b} ${c} ${c}`, B3, 0, 3))],
    violinsTrem: [...rest(2), ...cut(sustained(`${c} ${c}`, B3, 1, 4))],
    hornsBuild: [...rest(2), ...cut(HORN_CLIMB)],
    pluckBuild: [...chordLine(`${a} ${b}`, PEDAL_QUARTERS, 2), ...chordLine(c, PEDAL, 2), ...chordLine(c, PEDAL_CUT, 2)],
    timpSoft: [...timp(`${a} ${b}`, ONE), ...timp(c, T_TWO), ...timp(c, PEDAL_CUT)],
    timpRoll: [...rest(2), ...cut(held(timpRoot(c), 2 * B3))],
    swell: cut(swellInto(4)),
  };
  return Object.fromEntries(Object.entries(tracks).map(([name, steps]) => [name, [...rest(from), ...steps]]));
}

// --- D: the drop. The pounce held a bar, then the tune in 6/8, dotted
// quarters, up through the Neapolitan Ab. ---
const D_CHORDS = 'Gm Gm Gm F Ab Ab D D';
const ROAR = tune(`
  D5 - - - - - | G4 - - Bb4 - - | C#5 - - D5 - - | C6 - - A5 - - |
  Eb6 - - C6 - - | Ab5 - - Eb5 - - | F#5 - - A5 - - | D6 - - - - - |
`);

// --- The duel: its claws call in 6/8, her motif answers in 3/4, a step higher
// each time. ---
const DUEL_CHORDS = 'Gm Gm Eb D Am Am F E Bb Bb Gm F Bb Cm F F';
const CALL = CLAWS_68;
const ANSWER = tune(`${HERS} | G5 - - - - -`);
const RUN = tune('Bb5 - C6 - D6 - | Eb6 - F6 - C7 -');
const CALLS = [...CALL, ...rest(2), ...transpose(CALL, 2), ...rest(2), ...transpose(CALL, 3), ...rest(2), ...transpose(CALL, 3), ...RUN];
const ANSWERS = [
  ...rest(2), ...ANSWER, ...rest(2), ...transpose(ANSWER, 2), ...rest(2), ...transpose(ANSWER, 3), ...transpose(ANSWER, 3), ...transpose(RUN, -12),
];

// --- The climax: the tune in B flat major (D F Bb where it was G Bb D), her
// motif heroic in the middle, and the minor iv (Ebm) borrowed from the dark. ---
const CLIMAX_CHORDS = 'Bb F Gm Eb Bb F Ebm F Gm Eb Bb F Gm Eb F F';
const CLIMAX = tune(`
  D5 - F5 - Bb5 - | C6 - A5 - F5 - | Bb5 - G5 - D5 - | G5 - Bb5 - Eb6 - |
  F6 - - D6 - Bb5 | C6 - - A5 - F5 | Bb5 - Gb5 - Eb5 - | F5 - A5 - C6 - |
  D5/D5 Bb5 - C6 D6 - | Eb6 - - G5 - Bb5 | D6 - F6 - D6 - | C6 - - A5 - C6 |
  D6 - Bb5 - G5 - | G5 - Bb5 - Eb6 - | D6 - C6 - A5 - | F5 - - - - - |
`);
// The claws a minor third up (Bb Db E, F), drowning in the trombones.
const DROWN = repeat(tune('Bb2 - Db3 - E3 - | F3 - - - - -'), 8);

// --- The turn: the claws crawling back, Bb then Ab, to the dominant. ---
const TURN_CHORDS = 'Bb Bb Ab Ab D D D D';
const CRAWL = tune('Bb4 - Db5 - E5 - | F5 - - - - - | Ab4 - B4 - D5 - | Eb5 - - - - -');

export const NOTHING_SINGS_THEME = {
  title: 'Nothing Sings',
  bpm: 112,
  stepsPerBeat: 4,
  volume: 1.0,

  instruments: {
    ...ORCHESTRA,
    // The lead voices: cellos, violins, a low clarinet, horns kept soft.
    cello: { sample: 'cellos', volume: 0.55, attack: 0.06, release: 0.45, reverb: 0.4, pan: -0.2 },
    viola: { sample: 'violas', volume: 0.5, attack: 0.05, release: 0.4, reverb: 0.4, pan: 0.15 },
    clarinet: { sample: 'clarinet', volume: 0.5, attack: 0.04, release: 0.3, reverb: 0.4, pan: 0.2 },
    hornsBass: { sample: 'hornsSoft', volume: 0.38, attack: 0.15, release: 0.5, reverb: 0.45, pan: -0.1 },
    hornsClaws: { sample: 'horns', volume: 0.42, attack: 0.05, release: 0.3, reverb: 0.4, pan: -0.1 },
    hornsLow: { sample: 'hornsSoft', volume: 0.42, attack: 0.12, release: 0.45, reverb: 0.45, pan: -0.1 },
    violinsLead: { sample: 'violins', volume: 0.42, attack: 0.05, release: 0.4, reverb: 0.42, pan: 0.25 },
    violasTrem: { sample: 'violasTrem', volume: 0.32, attack: 0.1, release: 0.4, reverb: 0.4 },
    cellosTrem: { sample: 'cellosTrem', volume: 0.34, attack: 0.1, release: 0.4, reverb: 0.4, pan: -0.2 },
    violinsTrem: { sample: 'violinsTrem', volume: 0.28, attack: 0.1, release: 0.4, reverb: 0.45, pan: 0.25 },
    // The prowl, plucked: cellos and basses on the beat, violins on the off beats.
    pluck: { sample: 'cellosPizz', volume: 0.55, release: 0.1, reverb: 0.25, pan: -0.25, humanize: { time: 0.006, volume: 0.15 } },
    pluckSoft: { sample: 'cellosPizz', volume: 0.3, release: 0.1, reverb: 0.3, pan: -0.25, humanize: { time: 0.008, volume: 0.2 } },
    bassPluck: { sample: 'bassSpic', volume: 0.5, release: 0.08, reverb: 0.2, humanize: { time: 0.006, volume: 0.15 } },
    pah: { sample: 'violinsPizz', volume: 0.36, release: 0.08, reverb: 0.3, pan: 0.3, humanize: { time: 0.008, volume: 0.2 } },
    pah68: { sample: 'violinsPizz', volume: 0.3, release: 0.08, reverb: 0.3, pan: -0.3, humanize: { time: 0.008, volume: 0.2 } },
    pahHigh: { sample: 'violinsPizz', volume: 0.22, release: 0.08, reverb: 0.35, pan: 0.45, humanize: { time: 0.008, volume: 0.2 } },
    grand: { sample: 'grandPiano', volume: 0.42, ring: true, reverb: 0.45, humanize: { time: 0.01, volume: 0.15 } },
    harp: { sample: 'harp', volume: 0.35, ring: true, reverb: 0.4, pan: -0.3, humanize: { time: 0.012, volume: 0.2 } },
    // A square wave doubling the violins, near-dry, a touch sharp.
    chip: {
      wave: 'square', volume: 0.01, attack: 0.006, decay: 0.12, sustain: 0.7, release: 0.06, gate: 0.9,
      voices: [{ wave: 'square', detune: 12, level: 1 }],
      vibrato: { rate: 5.5, depth: 8, delay: 0.08 },
      filter: { type: 'lowpass', frequency: 3200 },
    },
    // The growl: a tuba on G and a trombone a minor ninth above it.
    growl: { sample: 'tuba', volume: 0.5, attack: 0.3, release: 0.8, reverb: 0.35 },
    growlHigh: { sample: 'trombone', volume: 0.3, attack: 0.5, release: 0.8, reverb: 0.4 },
    // The quiet: chirping glass, a bowed vibraphone for her motif, a drone.
    birds: { sample: 'glock', volume: 0.1, release: 0.5, reverb: 0.5, pan: 0.4 },
    vibes: { sample: 'vibesBowed', volume: 0.4, attack: 0.08, release: 0.8, reverb: 0.55 },
    drone: { sample: 'cellos', volume: 0.2, attack: 0.5, release: 1, reverb: 0.4 },
    // The drop's one deep drum.
    boomDeep: { sample: 'concertBassDrum', drum: 'sample', volume: 0.85, ring: true, reverb: 0.4 },
    // The build's players, held back so the drop takes over.
    hornsBuild: { sample: 'hornsSoft', volume: 0.3, attack: 0.2, release: 0.4, reverb: 0.4 },
    timpSoft: { sample: 'timpani', volume: 0.35, release: 0.08, reverb: 0.2 },
    pluckBuild: { sample: 'cellosPizz', volume: 0.35, release: 0.08, reverb: 0.25 },
    // A timpani mark on a bar, now and then: the only drum there is.
    timp: { sample: 'timpani', volume: 0.5, ring: true, reverb: 0.35 },
  },

  sections: {
    // The growl. The prowl alone on a plucked cello under a low piano and a
    // heartbeat; the claws on a low clarinet, the pounce held back.
    intro: {
      growl: held(midi('G1'), 4 * B3),
      growlHigh: [...rest(1), ...held(midi('Ab2'), 3 * B3)],
      pluck: [...rest(1), ...onNotes('G2 G2 G2', STALK)],
      grand: [...rest(1), ...chordLine('Gm Gm Gm', ONE, 1)],
      clarinet: [...rest(2), ...tune('G3 - Bb3 - C#4 -'), ...rest(1)],
      violasTrem: [...rest(2), ...sustained('Gm Gm', B3, 2, 4)],
      timpani: timp('Gm Gm Gm Gm', T_HEART),
    },

    // The stalk. The tune on a solo cello over the plucked prowl, the violins
    // plucking the off beats, a low piano under it; then the violins take it
    // with the cello an octave down and the horns soft underneath.
    A: {
      cello: [...STALK_1, ...transpose(STALK_2, -12)],
      violinsLead: [...rest(8), ...STALK_2],
      chip: [...rest(8), ...STALK_2],
      viola: sustained(A_ALL, B3, 1, 4),
      hornsLow: after(8, sustained(A_ALL, B3, 0, 3)),
      clarinet: after(8, arpeggio(A_ALL, B3, 4, ['.', '.', '.', '.', '.', '.', '.', '.', 'third', '-', '-', '-'])),
      pluck: chordLine(A_ALL, PROWL, 2),
      bassPluck: chordLine(A_ALL, ONE, 1),
      pah: arpeggio(A_ALL, B3, 4, PAH),
      pahHigh: after(8, arpeggio(A_ALL, B3, 4, PAH_HIGH)),
      grand: chordLine(A_ALL, ONE, 1),
      timp: sparse(timp(A_ALL, ONE), 4),
    },

    // Her motif: first alone on a solo violin over a harp ripple and the soft
    // prowl; then the violins with the violas a third below, a horn an octave
    // down, and the claws in the low horn under the D chords.
    B: {
      soloViolin: HERS_TUNE.concat(rest(8)),
      violinsLead: after(8, [...HERS_TUNE, ...HERS_TUNE]),
      viola: after(8, thirds([...HERS_TUNE, ...HERS_TUNE])),
      hornsLow: after(8, transpose([...HERS_TUNE, ...HERS_TUNE], -12)),
      cello: sustained(B_ALL, B3, 0, 3),
      hornsClaws: [...rest(6), ...CLAWS, ...rest(6), ...CLAWS],
      harp: arpeggio(B_ALL, B3, 3, RIPPLE),
      pluckSoft: chordLine(B_ALL, PROWL, 2),
      pah: after(8, arpeggio(B_ALL, B3, 4, PAH)),
      grand: chordLine(B_ALL, ONE, 1),
      timp: sparse(timp(B_ALL, ONE), 4),
    },

    // The waltz comes apart. The claws in groups of three against the bar of
    // two, a semitone higher every two bars, on the horns, the cellos and then
    // the clarinet and violins; a bass climbing a semitone a bar; the violins
    // plucking twice against the bar, tremolo strings, stabs on a different
    // wrong beat each bar. Then a dead stop.
    fray: stopdown({
      hornsLow: transpose(FRAY_CLAWS, -12),
      cello: FRAY_CLAWS,
      clarinet: after(4, FRAY_CLAWS),
      violinsLead: after(8, FRAY_CLAWS),
      pluck: onNotes(FRAY_BASS, PROWL),
      bassPluck: onNotes(FRAY_BASS, ONE).map((n) => (typeof n === 'number' ? n - 12 : n)),
      pah: arpeggio(FRAY_CHORDS, B3, 4, PAH),
      pah68: arpeggio(FRAY_CHORDS, B3, 4, PAH_68),
      violasTrem: sustained(FRAY_CHORDS, B3, 2, 4),
      violinsTrem: after(4, sustained(FRAY_CHORDS, B3, 1, 5)),
      cellosTrem: after(8, sustained(FRAY_CHORDS, B3, 0, 3)),
      grand: stabLine(FRAY_CHORDS, STABS, 2),
      timp: timpStabs(FRAY_CHORDS),
      timpRoll: [...rest(10), ...held(timpRoot('D'), 2 * B3)],
    }),

    // The birds stop. Eight bars of almost nothing: glass chirping high,
    // fewer every bar, then none; her motif on bowed vibraphone; the prowl
    // creeping back on plucked basses over a low drone. Then the build, and a
    // beat of silence.
    hush: {
      birds: [...CHIRPS, ...rest(8)],
      vibes: [...rest(4), ...BOX_HERS, ...rest(4)],
      drone: [...held(midi('G2'), 8 * B3), ...rest(4)],
      bassPluck: [...rest(2), ...onNotes(HUSH_BASS, STALK).slice(2 * B3), ...rest(4)],
      timpani: [...timp('Gm Gm Gm Gm Gm Gm Gm Gm', T_HEART), ...rest(4)],
      ...build('Gm Ab D', 8),
    },

    // THE DROP. The song's one gong, the deep drum, a BRAAAM in the low brass,
    // and the pounce held a whole bar; then the tune in 6/8, dotted quarters,
    // on horns, cellos and violins, climbing through Ab over the plucked prowl
    // and the strings, the timpani on every other bar.
    D: {
      gong: every(8, 8),
      impact: every(8, 8),
      boomDeep: every(8, 8),
      braam: [...cut(held('G2', B3)), ...rest(7)],
      braamLow: [...cut(held('G1', B3)), ...rest(7)],
      hornsLow: ROAR,
      cello: transpose(ROAR, -12),
      violinsLead: ROAR,
      trombones: transpose(ROAR, -24),
      viola: sustained(D_CHORDS, B3, 1, 4),
      violinsTrem: sustained(D_CHORDS, B3, 2, 4),
      cellosTrem: sustained(D_CHORDS, B3, 0, 3),
      tuba: sustained(D_CHORDS, B3, 0, 2),
      pluck: chordLine(D_CHORDS, SWING, 2),
      bassPluck: chordLine(D_CHORDS, ONE, 1),
      pah: arpeggio(D_CHORDS, B3, 4, PAH_68),
      grand: chordLine(D_CHORDS, ONE, 1),
      timp: sparse(timp(D_CHORDS, ONE), 2),
    },

    // Its claws on the horns and cellos in 6/8, her answer on the violins in
    // 3/4, each exchange a step higher; the fourth time both at once; then a
    // run to the dominant, and a dead beat.
    duel: stopdown({
      hornsLow: CALLS,
      cello: transpose(CALLS, -12),
      clarinet: CALLS,
      violinsLead: ANSWERS,
      soloViolin: transpose(ANSWERS, 12),
      viola: sustained(DUEL_CHORDS, B3, 1, 4),
      cellosTrem: sustained(DUEL_CHORDS, B3, 2, 3),
      pluck: chordLine(DUEL_CHORDS, SWING, 2),
      bassPluck: chordLine(DUEL_CHORDS, ONE, 1),
      pah: arpeggio(DUEL_CHORDS, B3, 4, PAH),
      grand: chordLine(DUEL_CHORDS, ONE, 1),
      timp: [...sparse(timp(DUEL_CHORDS, ONE), 4).slice(0, 12 * B3), ...rest(4)],
      timpRoll: [...rest(14), ...held(timpRoot('F'), 2 * B3)],
      swell: swellInto(16),
    }),

    // B flat major. The tune lifted into the major, her motif heroic in the
    // middle of it, on violins, horns and cellos over a rolling piano and
    // harp and the plucked waltz; the claws drowning in the trombones.
    climax: {
      violinsLead: CLIMAX,
      soloViolin: transpose(CLIMAX, 12),
      chip: CLIMAX,
      hornsLow: transpose(CLIMAX, -12),
      cello: transpose(CLIMAX, -12),
      violinsTrem: sustained(CLIMAX_CHORDS, B3, 1, 5),
      viola: sustained(CLIMAX_CHORDS, B3, 2, 4),
      trombones: DROWN,
      tuba: sustained(CLIMAX_CHORDS, B3, 0, 2),
      hornsBass: sustained(CLIMAX_CHORDS, B3, 0, 3),
      grand: chordLine(CLIMAX_CHORDS, ROLL, 3),
      harp: arpeggio(CLIMAX_CHORDS, B3, 4, RIPPLE),
      pluck: chordLine(CLIMAX_CHORDS, PROWL, 2),
      bassPluck: chordLine(CLIMAX_CHORDS, ONE, 1),
      pah: arpeggio(CLIMAX_CHORDS, B3, 4, PAH),
      pahHigh: arpeggio(CLIMAX_CHORDS, B3, 4, PAH_HIGH),
      timp: sparse(timp(CLIMAX_CHORDS, ONE), 2),
    },

    // The claws crawling back on the cello and viola, B flat, then A flat, to
    // the dominant; the prowl comes back in the opening texture, and the
    // stalk begins again.
    turn: {
      cello: CRAWL.concat(rest(4)),
      viola: transpose(CRAWL, 12).concat(rest(4)),
      hornsLow: sustained(TURN_CHORDS, B3, 0, 3),
      violasTrem: [...rest(4), ...sustained('D D D D', B3, 2, 4)],
      cellosTrem: [...rest(4), ...sustained('D D D D', B3, 0, 3)],
      pluckSoft: [...rest(4), ...onNotes('D2 D2 D2 D2', STALK)],
      grand: [...chordLine(TURN_CHORDS, ONE, 1).slice(0, 4 * B3), ...chordLine('D D D D', ONE, 1)],
      timpani: timp(TURN_CHORDS, T_HEART),
    },
  },

  // The intro plays once; after that the fight loops from the stalk.
  order: ['intro', 'A', 'B', 'fray', 'hush', 'D', 'duel', 'climax', 'turn'],
  loopFrom: 1,
};
