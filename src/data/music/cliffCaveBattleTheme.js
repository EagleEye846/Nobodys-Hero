import { melody, hits, repeat, transpose, sustained, chordLine, scatter, tight } from './parts/chapter5.js';

// "Echoes Back": the fights in the cliff cave between the Sea View and
// Gullrest (sunny_cliff_cave, sunny_cliff_hollow), against the barnacle bats
// and the whelklings. The cave's own song, "The Sea Downstairs", is sunlit
// and curious; this is the same cave with something hanging from the roof
// that sees you by its echoes. Dark and a little spooky, never cheery, but
// still the easy end of the coast, so it skitters more than it stamps. No
// brass and no snare in the cave: a harp, plucked and bitten strings, an oboe,
// low drums, drips, all real recordings.
//
// THE HOOK is the cave song's hook (the coast cell, D G G A B in G) turned
// into E minor, the relative minor: B E-E F# G. Every phrase leaves a gap,
// and the cave sends its last two notes back from the other side (the `echo`
// track: a dimmer ocarina, panned the other way, a beat late). That is the
// bat's trick, and the cave song's "hello" shouted into the rock, gone sour.
//
// THE RIPPLE: the cave song's harp ripple, moved into E minor (E B F# B G B
// F# B, a 16th each), fixed over every chord so the harmony moves under it;
// over the one borrowed chord, F major (the flat second, in B), it bends into
// F with it.
//
// Harmony: E minor down the lament (Em D C B), then Em C Am B; the middle goes
// to A minor and up to the F chord for its menace; B major (with a G in the
// tune over it) at every turn home. Bass on bitten basses, 3+3+2 like a bat's
// wingbeat; a low tom and a frame drum, no backbeat claps.
//
// E minor, 4/4 at 140; one step a 16th, 16 to a bar (a bar is about 1.7 s).
// The intro plays once; then it loops from A, 46 bars, about 1m19s:
//
//   intro   2 bars  the ripple alone, a drip, the bass creeping in
//   A       8 bars  THE HOOK on the oboe, the echo answering; ripple, bass, drums
//   A'      8 bars  the hook again with the violins on it and the violas a
//                   third under; the echo louder
//   B       8 bars  the middle: Haddock's motif in A minor on the oboe and
//                   violas, climbing to the F chord, the ripple bent into F;
//                   B major and the leading note at the end
//   C       8 bars  the dark: drums out but a heartbeat, the ripple thinned, a low string
//                   tremolo on E; bowed vibes play the hook at quarter speed;
//                   echo pings bouncing left and right; a timpani roll
//   D       4 bars  the build: the hook's first bar on the strings up a step
//                   each bar, the toms doubling
//   A2      8 bars  the payoff: the hook on violins and oboe, violas and cellos
//                   under, the echo, timpani on the ones
//   tail    2 bars  the ripple and the bass carry it round to A

const BAR = 16;
const tune = (text) => melody(text, 2);   // each token an 8th
const rest = (bars) => Array(bars * BAR).fill('.');
const fit = (name, section, bars) => tight('Echoes Back', name, section, bars, BAR);
const beat = (pattern, bars) => repeat(hits(pattern), bars);

// --- Harmony, a bar each ---
const A_CHORDS = 'Em D C B Em C Am B';
const B_CHORDS = 'Am Am Em Em F F B B';
const C_CHORDS = 'Em Em C C Em Em B B';
const D_CHORDS = 'Am B C B';
const TAIL_CHORDS = 'B B';

// --- THE HOOK: B E-E F# G, and the cave says the end of it back. ---
const HOOK = tune(`
  B4 - E5 E5 - F#5 G5 -    F#5 - D5 - . . . .
  B4 - E5 E5 - F#5 G5 -    A5 - G5 F#5 - D#5 - -
  E5 - B5 B5 - A5 G5 -     A5 - G5 - E5 - . .
  C5 - E5 - A5 - G5 F#5    F#5 - - - D#5 - B4 -
`);
// The echo: the last two notes of a phrase, a beat late, from the other side.
const ECHO = tune(`
  . . . . . . . .          . . . . . F#5 D5 -
  . . . . . . . .          . . . . . . . .
  . . . . . . . .          . . . . . . G5 E5
  . . . . . . . .          . . . . . . . .
`);
// A third under the hook, for the violas in A'.
const UNDER = tune(`
  G4 - B4 B4 - D5 E5 -     D5 - A4 - . . . .
  G4 - C5 C5 - C5 E5 -     F#5 - E5 D#5 - B4 - -
  B4 - G5 G5 - E5 E5 -     E5 - E5 - C5 - . .
  A4 - C5 - E5 - E5 D#5    D#5 - - - B4 - F#4 -
`);

// --- The middle: Haddock's motif in A minor (C B A, E: 3 2 1, down to 5),
// then climbing to the F chord, and the leading note home. ---
const MIDDLE = tune(`
  C5 - - B4 A4 - - E4      A4 - B4 - C5 - E5 -
  G5 - - F#5 E5 - - B4     E5 - F#5 - G5 - B5 -
  C6 - - A5 F5 - - C5      F5 - A5 - C6 - - -
  B5 - A5 - G5 - F#5 -     D#5 - - - F#5 - - -
`);

// --- The dark: the hook at quarter speed on bowed vibes (two notes a bar). ---
const SLOW = tune(`
  B4 - - - E5 - - -        E5 - - - F#5 - - -
  G5 - - - - - - -         . . . . . . . .
  B4 - - - E5 - - -        E5 - - - F#5 - - -
  A5 - - - G5 - - -        F#5 - - - D#5 - - -
`);
// Echo pings in the dark, bouncing off one wall and then the other.
const PINGS_L = scatter(8, BAR, [[0, 6, 'B5'], [2, 10, 'B5'], [4, 6, 'E6'], [6, 2, 'D#6']]);
const PINGS_R = scatter(8, BAR, [[0, 10, 'B5'], [2, 14, 'B5'], [4, 10, 'E6'], [6, 6, 'D#6']]);

// --- The build: the hook's first bar, up a step each bar. ---
const BUILD = tune(`
  A4 - D5 D5 - E5 F5 -     B4 - E5 E5 - F#5 G5 -
  C5 - F5 F5 - G5 A5 -     D#5 - F#5 F#5 - A5 B5 -
`);

// --- THE RIPPLE (fixed), and bent into F over the borrowed chord. ---
const RIPPLE = melody('E5 B5 F#5 B5 G5 B5 F#5 B5 E5 B5 F#5 B5 G5 B5 F#5 B5', 1);
const RIPPLE_F = melody('F5 C6 A5 C6 F5 C6 A5 C6 F5 C6 A5 C6 F5 C6 A5 C6', 1);
const THIN = melody('E5 . . . . . . . G5 . . . . . . .', 1);
const ripple = (chords) => chords.split(/\s+/).filter(Boolean).flatMap((c) => (c === 'F' ? RIPPLE_F : RIPPLE));

// --- The bass: bitten, 3+3+2 like a wingbeat. Roots between B1 and E2. ---
const WING = [0, '.', '.', 0, '.', '.', 0, '.', 0, '.', '.', 0, '.', '.', 7, '.'];
const LOWEST = { E: 'E2', D: 'D2', C: 'C2', B: 'B1', A: 'A1', F: 'F2', Em: 'E2', Am: 'A1' };
const bass = (chords, pattern = WING) => chords.split(/\s+/).filter(Boolean).flatMap((c) => {
  const root = melody(LOWEST[c], 1)[0];
  return pattern.map((p) => (typeof p === 'number' ? root + p : p));
});
// Held chord tones on pizzicato strings, short stabs on the ones.
const STAB = [0, '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'];

// --- Drums ---
const TOM = 'x.....x...x.....';
const TOM_FULL = 'x.....x...x...x.';
const TOM_DOUBLE = 'x.x...x.x.x.x.xx';
const FRAME = '....x.......x...';
const FRAME_GHOST = '....x..x....x.x.';
const ONE = 'x...............';
// Drips: single high notes with a stone echo, where they fall.
const DRIPS_A = scatter(8, BAR, [[1, 9, 'B6'], [3, 3, 'E7'], [6, 13, 'G6']]);
const DRIPS_C = scatter(8, BAR, [[0, 3, 'E7'], [1, 11, 'B6'], [3, 7, 'G6'], [5, 1, 'D7'], [6, 12, 'B6']]);

export const CLIFF_CAVE_BATTLE_THEME = {
  title: 'Echoes Back',
  bpm: 140,
  stepsPerBeat: 4,
  volume: 1.4,

  instruments: {
    lead: { sample: 'oboe', volume: 0.3, attack: 0.02, release: 0.25, reverb: 0.45, pan: 0.1, humanize: { time: 0.006, volume: 0.1 } },
    // The cave saying it back: a dimmer ocarina, the other side, far.
    echo: { sample: 'ocarina', volume: 0.16, attack: 0.03, release: 0.5, muffle: 2600, reverb: 0.8, pan: -0.5, humanize: { time: 0.01, volume: 0.1 } },
    violins: { sample: 'violins', volume: 0.2, attack: 0.04, release: 0.3, reverb: 0.45, pan: 0.25, humanize: { time: 0.006, volume: 0.08 } },
    violas: { sample: 'violas', volume: 0.18, attack: 0.04, release: 0.3, reverb: 0.45, pan: -0.2, humanize: { time: 0.006, volume: 0.08 } },
    cellos: { sample: 'cellos', volume: 0.14, attack: 0.05, release: 0.3, reverb: 0.4, pan: -0.1 },
    // The ripple: a harp, real, close, 16ths.
    ripple: { sample: 'harp', volume: 0.13, ring: true, reverb: 0.5, pan: 0.3, humanize: { time: 0.008, volume: 0.25 } },
    pizz: { sample: 'violinsPizz', volume: 0.12, ring: true, reverb: 0.45, pan: -0.3, humanize: { time: 0.006, volume: 0.15 } },
    basses: { sample: 'bassSpic', volume: 0.36, release: 0.15, reverb: 0.3, humanize: { time: 0.005, volume: 0.12 } },
    lowTrem: { sample: 'cellosTrem', volume: 0.22, attack: 0.6, release: 0.8, reverb: 0.5, pan: -0.15 },
    vibes: { sample: 'vibesBowed', volume: 0.24, attack: 0.3, release: 1.2, reverb: 0.7, pan: 0.2 },
    pingL: { sample: 'glock', volume: 0.06, ring: true, muffle: 4000, reverb: 0.7, pan: -0.7, echo: { time: 0.32, feedback: 0.35, mix: 0.35 } },
    pingR: { sample: 'glock', volume: 0.05, ring: true, muffle: 3000, reverb: 0.8, pan: 0.7, echo: { time: 0.32, feedback: 0.35, mix: 0.35 } },
    drips: { sample: 'glock', volume: 0.05, ring: true, muffle: 5000, reverb: 0.7, pan: 0.4, echo: { time: 0.43, feedback: 0.3, mix: 0.3 } },
    tom: { sample: 'tom', drum: 'sample', volume: 0.36, ring: true, reverb: 0.35, pan: -0.05, humanize: { time: 0.005, volume: 0.2 } },
    frame: { sample: 'frameDrum', drum: 'sample', volume: 0.26, ring: true, reverb: 0.35, pan: 0.1, humanize: { time: 0.005, volume: 0.25 } },
    boom: { sample: 'concertBassDrum', drum: 'sample', volume: 0.4, ring: true, reverb: 0.45 },
    timpani: { sample: 'timpani', volume: 0.32, ring: true, reverb: 0.4 },
    roll: { sample: 'timpaniRoll', volume: 0.3, ring: true, reverb: 0.4 },
  },

  sections: {
    // The ripple alone, a drip, the bass creeping in on the second bar.
    intro: fit('intro', {
      ripple: ripple('Em Em'),
      basses: [...rest(1), ...bass('Em', [0, '.', '.', '.', '.', '.', 0, '.', '.', '.', '.', '.', 0, '.', 0, '.'])],
      drips: scatter(2, BAR, [[0, 9, 'B6']]),
      boom: hits(`${ONE}................`),
    }, 2),

    // THE HOOK on the oboe; the echo answers.
    A: fit('A', {
      lead: HOOK,
      echo: ECHO,
      ripple: ripple(A_CHORDS),
      basses: bass(A_CHORDS),
      pizz: chordLine(A_CHORDS, STAB, 4),
      tom: beat(TOM, 8),
      frame: [...rest(4), ...beat(FRAME, 4)],
      boom: [...hits(ONE), ...rest(7)],
      drips: DRIPS_A,
    }, 8),

    // Again, the violins on it and the violas a third under.
    A1: fit('A1', {
      lead: HOOK,
      violins: HOOK,
      violas: UNDER,
      echo: ECHO,
      ripple: ripple(A_CHORDS),
      basses: bass(A_CHORDS),
      pizz: chordLine(A_CHORDS, STAB, 4),
      tom: beat(TOM_FULL, 8),
      frame: beat(FRAME_GHOST, 8),
      boom: [...hits(ONE), ...rest(3), ...hits(ONE), ...rest(3)],
    }, 8),

    // The middle: Haddock's motif in A minor, up to the F chord.
    B: fit('B', {
      lead: MIDDLE,
      violas: transpose(MIDDLE, -12),
      lowTrem: [...rest(4), ...sustained('F F B B', BAR, 0, 2)],
      ripple: ripple(B_CHORDS),
      basses: bass(B_CHORDS),
      pizz: chordLine(B_CHORDS, STAB, 4),
      tom: [...beat(TOM, 6), ...beat(TOM_FULL, 2)],
      frame: beat(FRAME, 8),
      boom: [...hits(ONE), ...rest(3), ...hits(ONE), ...rest(3)],
      timpani: [...rest(4), ...hits(ONE).map((h) => (h === 'x' ? 53 : h)), ...rest(1), ...hits(ONE).map((h) => (h === 'x' ? 47 : h)), ...rest(1)],
    }, 8),

    // The dark: drums out; the hook very slow on vibes; echoes bouncing.
    C: fit('C', {
      vibes: SLOW,
      pingL: PINGS_L,
      pingR: PINGS_R,
      ripple: [...repeat(THIN, 6), ...ripple('B B')],
      lowTrem: sustained(C_CHORDS, BAR, 0, 2),
      basses: [...bass(C_CHORDS.split(' ').slice(0, 6).join(' '), [0, ...Array(15).fill('.')]), ...bass('B B')],
      drips: DRIPS_C,
      // A heartbeat on the frame drum, so the dark never drops right out.
      frame: [...beat('x..x............', 6), ...rest(2)],
      roll: [...rest(6), 47, ...Array(2 * BAR - 1).fill('-')],
    }, 8),

    // The build: the hook's first bar up a step each bar; toms doubling.
    D: fit('D', {
      violins: BUILD,
      violas: transpose(BUILD, -12),
      lead: BUILD,
      ripple: ripple(D_CHORDS),
      basses: bass(D_CHORDS),
      tom: [...beat(TOM_FULL, 2), ...beat(TOM_DOUBLE, 2)],
      frame: beat(FRAME_GHOST, 4),
      timpani: [...rest(3), ...melody('B2 . B2 . B2 . B2 . B2 B2 B2 B2 B2 B2 B2 B2', 1)],
    }, 4),

    // The payoff: everyone on the hook.
    A2: fit('A2', {
      lead: HOOK,
      violins: HOOK,
      violas: transpose(HOOK, -12),
      cellos: transpose(HOOK, -24),
      echo: ECHO,
      ripple: ripple(A_CHORDS),
      basses: bass(A_CHORDS),
      pizz: chordLine(A_CHORDS, STAB, 4),
      tom: beat(TOM_FULL, 8),
      frame: beat(FRAME_GHOST, 8),
      boom: beat(`${ONE}`, 8),
      timpani: chordLine(A_CHORDS, STAB, 2).map((n) => (typeof n === 'number' ? 41 + ((n - 41) % 12 + 12) % 12 : n)),
      drips: DRIPS_A,
    }, 8),

    // The ripple and the bass carry it round.
    tail: fit('tail', {
      ripple: ripple(TAIL_CHORDS),
      basses: bass(TAIL_CHORDS),
      lead: tune('. . . . . . . .   . . . . F#5 - D#5 -'),
      echo: tune('. . . . . . . .   . . . . . . . F#5'),
      tom: beat(TOM, 2),
      frame: [...rest(1), ...hits('....x.......x.xx')],
    }, 2),
  },

  order: ['intro', 'A', 'A1', 'B', 'C', 'D', 'A2', 'tail'],
  loopFrom: 1,
};
