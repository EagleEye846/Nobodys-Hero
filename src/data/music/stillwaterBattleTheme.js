import { melody, hits, repeat, arpeggio, chordLine, sustained } from './parts/chapter4.js';

// "Black Ripples": the battle theme for ordinary fights in the Stillwater,
// the lake at the bottom of the buried kingdom (the reed things, the pale
// fish, whatever is rowing out of the mist). Everywhere else underground keeps
// "Scurry" (belowBattleTheme.js). It's a fight, but a quiet, cold one, and
// nothing in it is cheery: a harp rippling in a lopsided 10 (counted
// 1-2-3, 1-2-3, 1-2, 1-2) so it never quite lands where you expect, like
// rings spreading from a stone dropped somewhere in the dark; a plucked cello
// walking under it; glockenspiel drips; a clarinet and a flute singing the
// lake's own tune; and a soft choir "ah" underneath, hardly moving. A minor,
// with the F chord (and its sharp fourth, the B) of "Slow Water" and E major
// at the end of each phrase to pull you round again. No brass, no pickaxes,
// no big cellos, no cymbals, no war drums.
//
// THE CHAPTER'S TUNE (the "first cell", parts/chapter4.js): in A minor it is
// E A C B, up a fourth, up a minor third, one step down: the opening of the
// clarinet tune (an octave lower than the oboe's version in "Slow Water",
// stillwaterTheme.js), and in the middle section the harp plays it and the
// water plays it back to front, an octave lower, the way it does in "Slow
// Water". The third time, the mirror stops one note short.
//
// 10 steps to a bar, one step a 16th, grouped 3 + 3 + 2 + 2, at 132 quarter
// notes a minute (a bar is about 1.1 seconds). The intro plays once (2 bars);
// then it loops from A, 76 bars, about 1m26s:
//
//   intro    2 bars  the harp ripple alone, a drip or two
//   A       20 bars  the ripple and plucked cello; the clarinet comes in at
//                    the 5th bar with the tune; hand drum and a ghost tom
//   B       20 bars  the flute takes over, higher and colder, with a bowed
//                    vibraphone under it; plucked cello walking, tom beat
//   C       16 bars  the reflection: the harp plays the cell, the vibraphone
//                    plays it back mirrored; tremolo violas swell, a slow
//                    heartbeat on the deep drum, choir
//   D       20 bars  the tune again from clarinet and flute together, the
//                    ripple back with plucked violins, tom and snare; a
//                    tag that hangs on E and goes round

const BAR = 10;
const tune = (text) => melody(text, 2);   // each token two steps: 5 to a bar
const rest = (bars) => Array(bars * BAR).fill('.');
const tight = (name, section, bars) => {
  for (const [track, steps] of Object.entries(section)) {
    if (steps.length !== bars * BAR) throw new Error(`Black Ripples ${name}: '${track}' is ${steps.length} steps, not ${bars} bars`);
  }
  return section;
};

// --- Harmony, a bar each ---
const P1 = 'Am F Am E';
const A_CHORDS = `${P1} ${P1} ${P1} Dm F Am E Am F Dm E`;
const B_CHORDS = 'Dm Am F C Dm Am F E Dm Am F C Dm Am F E F G Am E';
const C_CHORDS = 'Am Am F F Dm Dm E E Am Am F F Dm Dm E E';
const D_CHORDS = `${P1} ${P1} Dm F Am E Am F Dm E Am F Dm E`;
const INTRO_CHORDS = 'Am Am';

// --- The clarinet's tune: the cell (E A C B) opens it, the B over F is
// the lydian note that looks up, and the phrases end on G# over E major. ---
const TUNE_CLARINET = tune(`
  E4 - A4 - C5   B4 - - A4 -   E4 - G4 - A4   G#4 - - - .
  E4 - A4 - C5   B4 - D5 - C5   A4 - - E4 -   G#4 - B4 - .
  F4 - A4 - D5   C5 - A4 - F4   E4 - A4 - C5   B4 - - G#4 -
  A4 - C5 - E5   D5 - C5 - A4   F4 - A4 - D5   D5 - B4 - G#4
`);
// The flute's song for B: higher, colder, drifting.
const TUNE_FLUTE = tune(`
  D5 - F5 - A5   A5 - - E5 -   C5 - F5 - A5   G5 - - - E5
  D5 - F5 - A5   C6 - - A5 -   B5 - - A5 -   G#5 - - - .
  D5 - F5 - A5   E6 - - C6 -   A5 - C6 - F6   E6 - - C6 -
  D6 - A5 - F5   E5 - A5 - C6   B5 - A5 - F5   G#5 - B5 - .
  A5 - C6 - F6   G5 - B5 - D6   C6 - - E6 -   B5 - - - .
`);
// The tag at the end of D: the cell once more, then the hanging G#.
const TAG = tune(`
  E4 - A4 - C5   B4 - - - .   G#4 - - - .   . . . . .
`);
const up = (track, semitones) => track.map((n) => (typeof n === 'number' ? n + semitones : n));

// --- The water's reflection in C: the cell, and its mirror an octave down
// and back to front (B C A E). The third time it stops one note short. ---
const CELL = tune('E5 - A5 - C6   B5 - - - .');
const MIRROR = tune('B4 - C5 - A4   E4 - - - .');
const MIRROR_SHORT = tune('B4 - C5 - A4   . . . . .');
const HARP_CELL = [...CELL, ...rest(2), ...CELL, ...rest(2), ...CELL, ...rest(2), ...CELL, ...rest(2)];
const MIRRORS = [
  ...rest(2), ...MIRROR,
  ...rest(2), ...MIRROR,
  ...rest(2), ...MIRROR,
  ...rest(2), ...MIRROR_SHORT,
];

// --- Patterns, a bar each ---
// The ripple (harp): root, fifth, the third and the octave, lopsided.
const RIPPLE = [0, '.', 7, '.', '.', 'third', '.', 12, '.', 7];
// A thinner ripple for the second half of C.
const RIPPLE_THIN = [0, '.', '.', '.', '.', '.', '.', 12, '.', '.'];
// Plucked cello: the root, then the fifth leaning in before the next bar.
const BASS = [0, '.', '.', '.', '.', 0, '.', '.', 7, '.'];
const BASS_WALK = [0, '.', 7, '.', '.', 'third', '.', 0, '.', 7];
// Plucked violins, high, on the ripple's off-beats.
const PLUCK = ['.', 12, '.', '.', 'tenth', '.', '.', 12, '.', '.'];
// Glockenspiel drips: one high chord tone, now and then.
function drip(chords, chance, seed) {
  let s = seed >>> 0;
  const rand = () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296;
  return arpeggio(chords, BAR, 6, [0, 7, 'third', 12, 7, 0, 'third', 7, 12, 'third'])
    .map((note, i) => (i % 2 === 1 && rand() < chance ? note : '.'));
}

// --- Drums, a bar each ---
const HAND = hits('x..x..x.x.');
const TOM = hits('x.....x...');
const TOM_BUSY = hits('x..x..x.xx');
const SNARE = hits('...x......');
const SNARE_BUILD = hits('x.x.x.x.xx');
const HEART = hits('x.........');
const HEART2 = hits('x.x.......');

export const STILLWATER_BATTLE_THEME = {
  title: 'Black Ripples',
  bpm: 132,
  stepsPerBeat: 4,
  volume: 1.0,

  instruments: {
    // The tunes.
    clarinet: { sample: 'clarinet', volume: 0.3, attack: 0.04, release: 0.25, reverb: 0.5, pan: -0.1, humanize: { time: 0.006, volume: 0.1 } },
    flute: { sample: 'flute', volume: 0.26, attack: 0.05, release: 0.3, reverb: 0.55, pan: 0.2, humanize: { time: 0.006, volume: 0.1 } },
    fluteHigh: { sample: 'flute', volume: 0.14, attack: 0.05, release: 0.3, reverb: 0.6, pan: 0.3, humanize: { time: 0.006, volume: 0.1 } },
    // The ripple and the drips.
    harp: { sample: 'harp', volume: 0.36, ring: true, reverb: 0.55, pan: -0.25, humanize: { time: 0.005, volume: 0.15 } },
    harpCell: { sample: 'harp', volume: 0.34, ring: true, reverb: 0.7, pan: -0.1, humanize: { time: 0.008, volume: 0.1 } },
    glock: { sample: 'glock', volume: 0.12, ring: true, reverb: 0.7, pan: 0.35, humanize: { time: 0.02, volume: 0.25 } },
    mirror: { sample: 'vibesBowed', volume: 0.3, attack: 0.1, release: 1.2, reverb: 0.8, pan: 0.4, echo: { time: 0.45, feedback: 0.45, mix: 0.4 } },
    vibes: { sample: 'vibesBowed', volume: 0.1, attack: 0.5, release: 0.9, reverb: 0.55, pan: 0.15 },
    // Low strings, plucked, and the high ones.
    cellosPizz: { sample: 'cellosPizz', volume: 0.4, ring: true, reverb: 0.25, pan: -0.05, humanize: { time: 0.004, volume: 0.12 } },
    pluck: { sample: 'violinsPizz', volume: 0.18, ring: true, reverb: 0.4, pan: 0.3, humanize: { time: 0.005, volume: 0.15 } },
    violasTrem: { sample: 'violasTrem', volume: 0.16, attack: 1.2, release: 1.2, reverb: 0.6, pan: -0.2 },
    // The pad: a soft choir and one low cello held.
    choir: { sample: 'choir', volume: 0.2, attack: 0.9, release: 1.2, reverb: 0.7, pan: 0.0 },
    low: { sample: 'cellos', volume: 0.2, attack: 0.5, release: 0.8, reverb: 0.5, pan: -0.1 },
    // Drums: a hand drum, a tom, a deep drum for the heartbeat, a soft snare.
    hand: { sample: 'frameDrum', drum: 'sample', volume: 0.26, ring: true, reverb: 0.25, humanize: { time: 0.003, volume: 0.15 } },
    tom: { sample: 'tom', drum: 'sample', volume: 0.3, ring: true, reverb: 0.35, pan: -0.15, humanize: { time: 0.004, volume: 0.2 } },
    deep: { sample: 'bassDrumDeep', drum: 'sample', volume: 0.3, ring: true, reverb: 0.4, humanize: { time: 0.003, volume: 0.12 } },
    snare: { sample: 'snareSoft', drum: 'sample', volume: 0.14, release: 0.08, reverb: 0.3, humanize: { time: 0.003, volume: 0.25 } },
  },

  sections: {
    // The ripple alone, a drip or two on the dark.
    intro: tight('intro', {
      harp: arpeggio(INTRO_CHORDS, BAR, 3, RIPPLE),
      glock: drip(INTRO_CHORDS, 0.4, 7),
      choir: sustained(INTRO_CHORDS, BAR, 2, 3),
    }, 2),

    // The ripple and the plucked cello; the clarinet comes in on bar 5.
    A: tight('A', {
      clarinet: [...rest(4), ...TUNE_CLARINET],
      harp: arpeggio(A_CHORDS, BAR, 3, RIPPLE),
      cellosPizz: chordLine(A_CHORDS, BASS, 2),
      glock: drip(A_CHORDS, 0.3, 11),
      choir: sustained(A_CHORDS, BAR, 2, 3),
      low: sustained(A_CHORDS, BAR, 0, 2),
      hand: repeat(HAND, 20),
      tom: [...rest(8), ...repeat(TOM, 12)],
    }, 20),

    // The flute takes it, higher and colder; the cello walks.
    B: tight('B', {
      flute: TUNE_FLUTE,
      harp: arpeggio(B_CHORDS, BAR, 3, RIPPLE),
      cellosPizz: chordLine(B_CHORDS, BASS_WALK, 2),
      vibes: sustained(B_CHORDS, BAR, 1, 4),
      glock: drip(B_CHORDS, 0.35, 23),
      choir: sustained(B_CHORDS, BAR, 2, 3),
      low: sustained(B_CHORDS, BAR, 0, 2),
      hand: repeat(HAND, 20),
      tom: repeat(TOM, 20),
    }, 20),

    // The reflection: the harp plays the cell; the water plays it back, and
    // the third time stops short. Violas swell; a slow heartbeat.
    C: tight('C', {
      harpCell: HARP_CELL,
      mirror: MIRRORS,
      violasTrem: sustained(C_CHORDS, BAR, 1, 4),
      choir: sustained(C_CHORDS, BAR, 2, 3),
      low: sustained(C_CHORDS, BAR, 0, 2),
      harp: [...rest(8), ...arpeggio(C_CHORDS.split(' ').slice(8).join(' '), BAR, 3, RIPPLE_THIN)],
      glock: drip(C_CHORDS, 0.22, 31),
      deep: [...repeat(HEART, 8), ...repeat(HEART2, 8)],
    }, 16),

    // The tune again from clarinet and flute together; the ripple back with
    // plucked violins; the tag hangs on E and goes round.
    D: tight('D', {
      clarinet: [...TUNE_CLARINET, ...TAG],
      fluteHigh: [...up(TUNE_CLARINET, 12), ...rest(4)],
      harp: arpeggio(D_CHORDS, BAR, 3, RIPPLE),
      cellosPizz: chordLine(D_CHORDS, BASS_WALK, 2),
      pluck: arpeggio(D_CHORDS, BAR, 4, PLUCK),
      glock: drip(D_CHORDS, 0.3, 41),
      choir: sustained(D_CHORDS, BAR, 2, 3),
      low: sustained(D_CHORDS, BAR, 0, 2),
      hand: repeat(HAND, 20),
      tom: [...repeat(TOM_BUSY, 16), ...repeat(TOM, 4)],
      snare: [...repeat(SNARE, 15), ...SNARE_BUILD, ...rest(4)],
    }, 20),
  },

  order: ['intro', 'A', 'B', 'C', 'D'],
  loopFrom: 1,
};
