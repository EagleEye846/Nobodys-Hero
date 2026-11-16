import { melody, hits, repeat, sustained, onNotes, held, midi } from './parts/chapter4.js';

// "Rain on the Roots": the battle theme for ordinary fights in the Deep, the
// last stretch of Chapter 4 (the pitch-dark caves, the glow-worms, the great
// crystal root of the Sunstone, the lost child-hero's old camp). Everywhere
// else underground keeps "Scurry" (belowBattleTheme.js). It is "Counting
// Days" (deepTheme.js) turned into a fight: the same C minor, the same
// falling harp drops that never stop, the same choir and solo violin, but
// the pulse is quick and something is driving underneath: plucked cellos on
// the eighths, timpani on the beat, tremolo strings swelling. It stays
// beautiful rather than aggressive, in the way of Hollow Knight's City of
// Tears (its shape and sound, not its tune): rain, a moving bass, a soaring
// voice on top. No brass, no pickaxes, no big loud blasts.
//
// THE CHAPTER'S TUNE (the "first cell", parts/chapter4.js): G C Eb D, up a
// fourth, up a minor third, one step down. It is Counting Days' own tune,
// the first bar of A, and in the build it climbs the chords (Ab, Bb, C, Eb)
// getting higher each bar.
//
// C minor, 4/4 at 140 quarter notes a minute, one step a 16th: 16 steps to a
// bar, 1.71 seconds. The intro plays once (4 bars); then it loops from A,
// 64 bars, about 1m50s:
//
//   intro    4 bars  the rain alone (a harp falling D G C G, over and over,
//                    the same all song), violas, the timpani starting to beat
//   A       16 bars  Counting Days' tune on the solo violin over plucked
//                    cellos and timpani; then the choir takes it, with the
//                    violin singing long notes above
//   B       16 bars  a new, soaring tune over A flat, E flat, F minor: solo
//                    violin, then the choir under it, tremolo cellos, the
//                    pluck busier, a snare ghosting
//   pivot   16 bars  8 bars of hush (the rain, a low harp, one choir voice,
//                    the harp playing STAY on one note) and 8 bars of build:
//                    the cell climbing on the violin, tremolo strings and a
//                    timpani roll rising into the return
//   A3      16 bars  home and biggest: the whole choir sings the tune in
//                    octaves, the violin above, the cellos trembling, the
//                    bass walking in octaves; it ends on G major going round

const BAR = 16;
const rest = (bars) => Array(bars * BAR).fill('.');
const twice = (steps) => [...steps, ...steps];
const up = (steps, semitones) => steps.map((n) => (typeof n === 'number' ? n + semitones : n));
// Fails loudly if a section's tracks are not all the same whole number of bars.
const tight = (name, section, bars) => {
  for (const [track, steps] of Object.entries(section)) {
    if (steps.length !== bars * BAR) throw new Error(`Rain on the Roots ${name}: '${track}' is ${steps.length} steps, not ${bars} bars`);
  }
  return section;
};

// --- The rain: a harp falling D G C G, an eighth at a time, never stopping
// or changing (a stack of fifths, like the drops of Counting Days). A soft
// piano drops the same notes a 16th later. 4 notes: two cycles a bar. ---
const HARP_DROP = ['D6', 'G5', 'C5', 'G4'].map(midi);
const PIANO_DROP = ['D5', 'G4', 'C4', 'G3'].map(midi);
const rain = (bars) => Array.from({ length: bars * BAR }, (_, i) => (i % 2 === 0 ? HARP_DROP[(i / 2) % 4] : '.'));
const rainPiano = (bars) => Array.from({ length: bars * BAR }, (_, i) => (i % 2 === 1 ? PIANO_DROP[((i - 1) / 2) % 4] : '.'));

// --- Chords and basses, a bar each. ---
const A_CHORDS = 'Cm Ab Eb Bb Cm Ab Fm G';
const B_CHORDS = 'Ab Eb Fm Cm Ab Bb Eb G';
const HUSH_CHORDS = 'Cm Ab Cm Ab Fm Cm Bb G';
const BUILD_CHORDS = 'Ab Bb Cm Eb Ab Bb G G';
const A_BASS = 'C2 Ab2 Eb2 Bb2 C2 Ab2 F2 G2';
const B_BASS = 'Ab2 Eb2 F2 C2 Ab2 Bb2 Eb2 G2';
const HUSH_BASS = 'C2 Ab2 C2 Ab2 F2 C2 Bb2 G2';
const BUILD_BASS = 'Ab2 Bb2 C2 Eb2 Ab2 Bb2 G2 G2';
const A_TIMP = 'C3 Ab2 Eb3 Bb2 C3 Ab2 F2 G2';
const B_TIMP = 'Ab2 Eb3 F2 C3 Ab2 Bb2 Eb3 G2';
const BUILD_TIMP = 'Ab2 Bb2 C3 Eb3 Ab2 Bb2 G2 G2';

// --- The tune (each token a quarter, four to a bar): Counting Days' own. ---
const q = (text) => melody(text, 4);
const TUNE = q(`
  G4 C5 Eb5 D5 | C5 - - - | G4 - Bb4 D5 | C5 - - - |
  G4 C5 Eb5 G5 | G5 - - F5 | Ab5 - G5 F5 | D5 - - -
`);
// The violin over the choir: long notes, high.
const ABOVE = q(`
  G5 - - - | Eb5 - - - | G5 - - - | F5 - - - |
  G5 - - - | C6 - - - | C6 - - Ab5 | B5 - - -
`);
// The new tune (B): a soaring line over A flat, E flat, F minor, C minor.
const SOAR = q(`
  Eb5 - Ab5 - | G5 - Bb5 - | C6 - Ab5 - | G5 - - Eb5 |
  Ab5 - C6 - | D6 - Bb5 - | Bb5 - G5 - | D5 - - -
`);
// The build: the cell climbing the chords (Ab, Bb, Cm, Eb), then a held rise.
const CLIMB = q(`
  Eb5 Ab5 C6 Bb5 | F5 Bb5 D6 C6 | G5 C6 Eb6 D6 | Bb5 Eb6 G6 F6 |
  Ab5 - C6 - | D6 - Bb5 - | B5 - D6 - | G5 - - -
`);

// --- Patterns, a bar each (16 sixteenths). ---
// Plucked cellos: the eighths, the root and its octave.
const PLUCK = [0, '.', 12, '.', 0, '.', 12, '.', 0, '.', 12, '.', 0, '.', 7, 12];
// Busier (B): sixteenth pushes.
const PLUCK_BUSY = [0, '.', 0, 12, '.', 0, 12, '.', 0, '.', 0, 12, '.', 0, 7, '.'];
// Timpani: beat 1, beat 3, and the "and" of 3.
const TIMP = [0, '.', '.', '.', '.', '.', '.', '.', 0, '.', '.', 0, '.', '.', '.', '.'];
// The walking bass in octaves, for the return.
const WALK = [0, '.', 12, '.', 0, '.', 12, '.', 7, '.', 12, '.', 0, 12, 7, 12];
// The low harp in the hush: the root, and its fifth halfway through.
const LOW = [0, '.', '.', '.', '.', '.', '.', '.', 7, '.', '.', '.', '.', '.', '.', '.'];

// --- Drums, a bar each. ---
const TOMS = hits('x.....x.x.x.....');
const GHOST = hits('....x.......x.x.');
const BUILD = hits('x.x.x.x.x.x.x.x.');
const ROLL = hits('xxxxxxxxxxxxxxxx');

// STAY: one harp note, a long way apart, in the hush.
const stay = (bars) => {
  const out = rest(bars);
  [0, 2 * BAR + 6, 4 * BAR + 9].forEach((i) => { out[i] = midi('G4'); });
  return out;
};

export const DEEP_BATTLE_THEME = {
  title: 'Rain on the Roots',
  bpm: 140,
  stepsPerBeat: 4,
  volume: 1.53,

  instruments: {
    // The rain: harp and soft piano, each note left to ring.
    harp: { sample: 'harp', volume: 0.16, ring: true, reverb: 0.45, pan: 0.2, humanize: { time: 0.006, volume: 0.15 } },
    harpFar: { sample: 'harp', volume: 0.09, ring: true, reverb: 0.5, pan: 0.2, humanize: { time: 0.008, volume: 0.2 } },
    rainPiano: { sample: 'grandPiano', volume: 0.07, ring: true, muffle: 3000, reverb: 0.4, pan: -0.15, humanize: { time: 0.006, volume: 0.2 } },
    stay: { sample: 'harp', volume: 0.24, ring: true, muffle: 2500, reverb: 0.5 },
    // The low drive: plucked cellos, and timpani on the beat.
    pluck: { sample: 'cellosPizz', volume: 0.4, release: 0.12, reverb: 0.2, humanize: { time: 0.004, volume: 0.12 } },
    timp: { sample: 'timpani', volume: 0.4, ring: true, reverb: 0.35, humanize: { time: 0.004, volume: 0.15 } },
    timpRoll: { sample: 'timpaniRoll', volume: 0.3, attack: 0.3, release: 0.8, reverb: 0.35 },
    harpLow: { sample: 'harp', volume: 0.2, ring: true, octave: 1, reverb: 0.4, pan: -0.15 },
    // Strings: violas holding, tremolo violins and cellos swelling.
    violas: { sample: 'violas', volume: 0.14, attack: 1.2, release: 1.6, muffle: 3000, reverb: 0.45, pan: -0.2 },
    violins: { sample: 'violins', volume: 0.13, attack: 1.0, release: 1.4, muffle: 3500, reverb: 0.45, pan: 0.25 },
    tremViolins: { sample: 'violinsTrem', volume: 0.13, attack: 0.9, release: 1.0, reverb: 0.45, pan: 0.3 },
    tremCellos: { sample: 'cellosTrem', volume: 0.2, attack: 0.8, release: 1.0, reverb: 0.35, pan: -0.25 },
    // The soprano: a solo violin.
    voice: { sample: 'soloViolin', volume: 0.2, attack: 0.15, release: 1.0, muffle: 5000, reverb: 0.5, pan: 0.05, humanize: { time: 0.01, volume: 0.1 } },
    // The choir singing "ah", and singing the tune.
    choirLow: { sample: 'choir', volume: 0.22, attack: 1.0, release: 1.4, muffle: 2600, reverb: 0.5, pan: -0.25 },
    choirMid: { sample: 'choir', volume: 0.2, attack: 1.0, release: 1.4, muffle: 2600, reverb: 0.5, pan: 0.05 },
    choirHigh: { sample: 'choir', volume: 0.18, attack: 1.2, release: 1.6, muffle: 3000, reverb: 0.5, pan: 0.3 },
    sing: { sample: 'choir', volume: 0.32, attack: 0.3, release: 1.2, muffle: 3000, reverb: 0.5, pan: -0.05, humanize: { time: 0.01, volume: 0.08 } },
    sopranos: { sample: 'choir', volume: 0.24, attack: 0.35, release: 1.3, muffle: 3400, reverb: 0.5, pan: 0.15, humanize: { time: 0.01, volume: 0.08 } },
    // Soft drums.
    tom: { sample: 'tom', drum: 'sample', volume: 0.24, ring: true, reverb: 0.3, pan: -0.15, humanize: { time: 0.004, volume: 0.2 } },
    snare: { sample: 'snareSoft', drum: 'sample', volume: 0.13, release: 0.08, reverb: 0.2, humanize: { time: 0.003, volume: 0.25 } },
  },

  sections: {
    // The rain alone, the violas, the timpani starting to beat.
    intro: tight('intro', {
      harpFar: rain(4),
      rainPiano: rainPiano(4),
      violas: [...rest(1), ...held('G3', 3 * BAR)],
      timp: [...rest(2), ...onNotes('Ab2 F2', TIMP)],
      pluck: [...rest(3), ...onNotes('G2', PLUCK)],
    }, 4),

    // Counting Days' tune on the solo violin over the drive; then the choir
    // takes it and the violin sings long notes above.
    A: tight('A', {
      harp: rain(16),
      rainPiano: rainPiano(16),
      voice: [...TUNE, ...ABOVE],
      sing: [...rest(8), ...TUNE],
      pluck: twice(onNotes(A_BASS, PLUCK)),
      timp: twice(onNotes(A_TIMP, TIMP)),
      violas: twice(sustained(A_CHORDS, BAR, 0, 3)),
      choirLow: [...rest(8), ...sustained(A_CHORDS, BAR, 0, 3)],
      tom: [...rest(8), ...repeat(TOMS, 8)],
    }, 16),

    // A new, soaring tune: the violin, then the choir under it. Tremolo
    // cellos, the pluck busier, a snare ghosting.
    B: tight('B', {
      harp: rain(16),
      rainPiano: rainPiano(16),
      voice: twice(SOAR),
      sing: [...rest(8), ...up(SOAR, -12)],
      pluck: twice(onNotes(B_BASS, PLUCK_BUSY)),
      timp: twice(onNotes(B_TIMP, TIMP)),
      tremCellos: twice(sustained(B_CHORDS, BAR, 0, 3)),
      violins: [...rest(8), ...sustained(B_CHORDS, BAR, 2, 4)],
      choirMid: [...rest(8), ...sustained(B_CHORDS, BAR, 1, 3)],
      tom: repeat(TOMS, 16),
      snare: [...rest(8), ...repeat(GHOST, 8)],
    }, 16),

    // The pivot. Hush: the rain, a low harp, one choir voice, STAY. Then the
    // build: the cell climbing, tremolo swelling, a timpani roll.
    pivot: tight('pivot', {
      harp: [...rest(8), ...rain(8)],
      harpFar: [...rain(8), ...rest(8)],
      rainPiano: rainPiano(16),
      stay: [...stay(8), ...rest(8)],
      harpLow: [...onNotes(HUSH_BASS, LOW), ...rest(8)],
      violas: [...sustained(HUSH_CHORDS, BAR, 0, 3), ...rest(8)],
      choirHigh: [...held('G4', 3 * BAR), ...held('Ab4', 2 * BAR), ...held('G4', 3 * BAR), ...sustained(BUILD_CHORDS, BAR, 2, 4)],
      voice: [...rest(8), ...CLIMB],
      pluck: [...rest(8), ...onNotes(BUILD_BASS, PLUCK)],
      timp: [...rest(8), ...onNotes(BUILD_TIMP, TIMP)],
      tremCellos: [...rest(8), ...sustained(BUILD_CHORDS, BAR, 0, 3)],
      tremViolins: [...rest(10), ...sustained('Cm Eb Ab Bb G G', BAR, 1, 4)],
      timpRoll: [...rest(14), ...held('F3', 2 * BAR)],
      tom: [...rest(8), ...repeat(TOMS, 4), ...repeat(BUILD, 4)],
      snare: [...rest(12), ...repeat(BUILD, 2), ...repeat(ROLL, 2)],
    }, 16),

    // Home, and the biggest: the whole choir sings the tune in octaves, the
    // violin above, trembling cellos, the bass walking in octaves.
    A3: tight('A3', {
      harp: rain(16),
      rainPiano: rainPiano(16),
      sing: up(twice(TUNE), -12),
      sopranos: twice(TUNE),
      voice: twice(ABOVE),
      pluck: twice(onNotes(A_BASS, WALK)),
      timp: twice(onNotes(A_TIMP, TIMP)),
      tremCellos: twice(sustained(A_CHORDS, BAR, 0, 3)),
      violins: twice(sustained(A_CHORDS, BAR, 1, 4)),
      choirLow: twice(sustained(A_CHORDS, BAR, 0, 3)),
      choirMid: twice(sustained(A_CHORDS, BAR, 1, 3)),
      tom: repeat(TOMS, 16),
      snare: repeat(GHOST, 16),
    }, 16),
  },

  order: ['intro', 'A', 'B', 'pivot', 'A3'],
  loopFrom: 1,
};
