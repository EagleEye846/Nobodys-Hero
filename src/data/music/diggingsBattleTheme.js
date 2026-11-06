import { melody, hits, repeat, arpeggio, chordLine, sustained } from './parts/chapter4.js';

// "Uneven Rails": the battle theme for ordinary fights in the Diggings, the
// creature folk's mines in Chapter 4 (the drillbugs and the slaglings).
// Everywhere else underground keeps "Scurry" (belowBattleTheme.js). It
// shouldn't sound like the mountain's big brass-and-choir fights (Chapter 2),
// so it's small, dark and sly: a lopsided 7/8 like a cart clattering over
// rails laid crooked (counted 1-2, 1-2, 1-2-3), a staccato piano riff, the
// tune on a saxophone and a clarinet together (smoky, sneaking, a bit noir),
// plucked strings, the crystals as a glockenspiel and chimes, a hand drum and
// toms. E Phrygian (E minor with the F natural on top of it) for something
// old and wrong down a shaft, and B major at the end of each phrase. No
// brass, no choir, no war drums, no pickaxes, no heavy cellos. (The mines'
// earlier battle themes are in notes/music-backup-2026-10-30.)
//
// THE CHAPTER'S TUNE (the "first cell", parts/chapter4.js): up a fourth, up a
// minor third, one step down. In E minor it's B E G F#, the first bar of the
// sax tune; in the crystal part the glockenspiel has it on A minor (E A C B).
//
// 7/8 at 150 quarter notes a minute, one step a 16th: 14 steps to a bar,
// grouped 4 + 4 + 6; a bar is 1.4 seconds. The intro plays once (2 bars);
// then it loops from A, 24 bars, about 34 seconds:
//
//   intro    2 bars  the piano riff alone, then the hand drum
//   A        8 bars  the tune on sax and clarinet over the riff, plucked
//                    basses on the beats, the drums in 2+2+3
//   crystal  8 bars  the crystals: the cell high on the glockenspiel, chimes,
//                    plucked violins running, the clarinet low and slow
//   deeper   8 bars  the tune again, darker and fuller: sax an octave down
//                    with the piano in octaves, toms rolling, a snare
//                    tightening at the end to go round

const BAR = 14;
const tune = (text) => melody(text, 2);   // each token an 8th: 7 to a bar
const rest = (bars) => Array(bars * BAR).fill('.');
const up = (track, semitones) => track.map((n) => (typeof n === 'number' ? n + semitones : n));

const A_CHORDS = 'Em F Em D C F B B';
const CRYSTAL_CHORDS = 'Am Em F B Am Em C B';

// --- The tune: the cell (B E G F#), the Phrygian F, home through B. ---
const TUNE = tune(`
  B4 E5 G5 F#5 - E5 - | F5 - E5 - C5 - A4 | B4 E5 G5 B5 - A5 G5 | F#5 - - D5 - A4 -
  G4 C5 E5 D5 - C5 - | A4 - C5 - F5 - E5 | D#5 - F#5 - B5 - A5 | F#5 - - - D#5 - -
`);
// --- The crystals: the cell high on the glockenspiel (E A C B). ---
const GLINT = tune(`
  E6 - A6 - C7 - B6 | G6 - - - E6 - - | F6 - A6 - C7 - A6 | F#6 - - - D#6 - -
  E6 A6 C7 B6 - A6 - | B6 - G6 - E6 - - | E6 - G6 - C7 - B6 | B6 - - - - - -
`);
// The clarinet, low and slow under the crystals: a note a chord.
const LOW_LINE = tune(`
  E4 - - - - - - | B3 - - - - - - | C4 - - - - - - | D#4 - - - - - -
  E4 - - - - - - | G4 - - - - - - | E4 - - - - - - | D#4 - - - - - -
`);

// --- Patterns, a bar each (4 + 4 + 6 sixteenths). ---
// The piano riff: the root and its octave, twice, then the fifth and third.
const RIFF = [0, '.', '.', 12, 0, '.', '.', 12, 7, '.', 12, '.', 'third', '.'];
// Plucked basses on the three beats of the bar.
const BASS = [0, '.', '.', '.', 0, '.', '.', '.', 0, '.', '.', '.', 7, '.'];
// Plucked violins running up the chord in the crystal part.
const RUN = [0, '.', 7, '.', 12, '.', 'tenth', '.', 12, '.', 19, '.', 12, '.'];

// --- Drums, a bar each. ---
const HAND = hits('x...x...x.....');
const HAND_BUSY = hits('x..xx...x..x..');
const TOMS = hits('..........x.x.');
const GHOST = hits('..x.....x.x...');
const BUILD = hits('x.x.x.x.x.x.x.');
const ROLL = hits('xxxxxxxxxxxxxx');

export const DIGGINGS_BATTLE_THEME = {
  title: 'Uneven Rails',
  bpm: 150,
  stepsPerBeat: 4,
  volume: 1.1,

  instruments: {
    // The tune: a sax and a clarinet together.
    sax: { sample: 'sax', volume: 0.24, attack: 0.02, release: 0.12, reverb: 0.3, pan: 0.15, humanize: { time: 0.005, volume: 0.1 } },
    clarinet: { sample: 'clarinet', volume: 0.26, attack: 0.02, release: 0.12, reverb: 0.3, pan: -0.15, humanize: { time: 0.005, volume: 0.1 } },
    clarinetLow: { sample: 'clarinet', volume: 0.24, attack: 0.3, release: 0.6, reverb: 0.4, pan: -0.2 },
    // The riff: a staccato piano.
    piano: { sample: 'grandPiano', volume: 0.32, release: 0.08, reverb: 0.2, pan: -0.05, humanize: { time: 0.004, volume: 0.12 } },
    pianoHigh: { sample: 'grandPiano', volume: 0.2, release: 0.08, reverb: 0.25, pan: 0.1, humanize: { time: 0.004, volume: 0.12 } },
    // Plucked basses and violins.
    basses: { sample: 'bassSpic', volume: 0.34, release: 0.06, reverb: 0.15, humanize: { time: 0.003, volume: 0.12 } },
    pluck: { sample: 'violinsPizz', volume: 0.22, ring: true, reverb: 0.3, pan: 0.25, humanize: { time: 0.004, volume: 0.15 } },
    // The crystals.
    glock: { sample: 'glock', volume: 0.15, ring: true, reverb: 0.4, pan: 0.3, humanize: { time: 0.004, volume: 0.15 } },
    chimes: { sample: 'chimes', volume: 0.1, ring: true, reverb: 0.4, pan: -0.3, humanize: { time: 0.004, volume: 0.2 } },
    vibes: { sample: 'vibesBowed', volume: 0.1, attack: 0.5, release: 0.9, reverb: 0.45, pan: 0.1 },
    // A hand drum, toms and a soft snare.
    hand: { sample: 'frameDrum', drum: 'sample', volume: 0.36, ring: true, reverb: 0.15, humanize: { time: 0.003, volume: 0.15 } },
    tom: { sample: 'tom', drum: 'sample', volume: 0.3, ring: true, reverb: 0.25, pan: -0.15, humanize: { time: 0.004, volume: 0.2 } },
    snare: { sample: 'snareSoft', drum: 'sample', volume: 0.14, release: 0.08, reverb: 0.2, humanize: { time: 0.003, volume: 0.25 } },
  },

  sections: {
    // The riff alone, then the hand drum.
    intro: {
      piano: chordLine('Em Em', RIFF, 3),
      hand: [...rest(1), ...HAND],
    },

    // The tune on sax and clarinet over the riff.
    A: {
      sax: TUNE,
      clarinet: TUNE,
      piano: chordLine(A_CHORDS, RIFF, 3),
      basses: chordLine(A_CHORDS, BASS, 2),
      hand: repeat(HAND, 8),
      tom: repeat(TOMS, 8),
      snare: repeat(GHOST, 8),
    },

    // The crystals: the cell high on the glockenspiel, plucked violins
    // running, the clarinet low and slow.
    crystal: {
      glock: GLINT,
      chimes: arpeggio(CRYSTAL_CHORDS, BAR, 4, [0, '.', '.', '.', '.', '.', '.', 7, '.', '.', '.', '.', '.', '.']),
      pluck: arpeggio(CRYSTAL_CHORDS, BAR, 4, RUN),
      clarinetLow: LOW_LINE,
      vibes: sustained(CRYSTAL_CHORDS, BAR, 2, 4),
      basses: chordLine(CRYSTAL_CHORDS, BASS, 2),
      hand: repeat(HAND, 8),
    },

    // Darker and fuller: the sax an octave down, the piano in octaves, toms
    // rolling, a snare tightening at the end.
    deeper: {
      sax: up(TUNE, -12),
      clarinet: TUNE,
      piano: chordLine(A_CHORDS, RIFF, 3),
      pianoHigh: up(TUNE, 12),
      basses: chordLine(A_CHORDS, BASS, 2),
      pluck: arpeggio(A_CHORDS, BAR, 4, RUN),
      hand: repeat(HAND_BUSY, 8),
      tom: [...repeat(TOMS, 6), ...repeat(hits('x.x.x...x.x.xx'), 2)],
      snare: [...repeat(GHOST, 6), ...BUILD, ...ROLL],
    },
  },

  order: ['intro', 'A', 'crystal', 'deeper'],
  loopFrom: 1,
};
