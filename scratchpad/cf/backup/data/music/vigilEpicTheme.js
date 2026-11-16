import { melody, chordLine, sustained, arpeggio, transpose, hits, repeat } from '../../audio/notation.js';
import {
  FLUTE, HARP, STRING_SECTION, STACCATO_STRINGS, LOW_STRINGS, CHOIR, BELLS, HORN, BRASS, TIMPANI, SOLO_VIOLIN, CELLO,
} from '../../audio/instruments.js';
import {
  ASCENT, LEDGE, LEDGE_VIOLIN, STAIR, STAIR_VIOLIN, CLIMB, CLIMB_VIOLIN, PEAK, PEAK_VIOLIN, PEAK_HORN,
  ASCENT_CHORDS, LEDGE_CHORDS, BREATH_CHORDS, STAIR_CHORDS, CLIMB_CHORDS, PEAK_TWICE, TURN, RUN_UP, DRIVE, SWELL, TICK_BUSY,
} from './vigilTheme.js';

// "Thin Air (Summit Push)": Mount Vigil's theme ("Thin Air", vigilTheme.js),
// played big, for the last climbs before the summit (the Vane Gardens and
// the Spire's Neck). The same tunes, but nothing held back: the ascent's
// melody on the horns over driving strings and timpani, the ledge on the
// violins with the horn answering, the Long Stair's tune on the whole brass
// section and the choir, the climb gathering under snare rolls, and the
// peak a whole step higher than before, everything playing. Still a place,
// not a fight: orchestral drums only (timpani, a big drum, a snare and a
// cymbal), no kit.
// E minor (the summit section in F-sharp minor / A major), 108 BPM, one step
// is an 8th note. The call plays once; then about two and a half minutes loop.
//
//   call      4 bars   a horn call over a timpani roll gathering
//   ascent    8 bars   the ascent's tune on horns and brass, strings driving
//   ledge     8 bars   the ledge on the violins, the horn answering
//   stair     8 bars   the Long Stair's tune on all the brass and the choir
//   climb     8 bars   up and up: snare rolls, harp runs, everything building
//   summit   16 bars   the peak, a step up, with everything
//   turn      4 bars   back down to E minor, round to the ascent

const BAR = 8;
const rest = (bars) => Array(bars * BAR).fill('.');

// --- Patterns, as semitones above each chord's root. ---
// Timpani: the root on one and the fifth on three; or a roll.
const TIMP = [0, '.', '.', '.', 7, '.', '.', '.'];
const TIMP_PUSH = [0, '.', '.', 0, 7, '.', 0, '.'];
const TIMP_ROLL = [0, 0, 0, 0, 0, 0, 0, 0];
// Strings sawing away under the tune.
const SAW = [0, 0, 7, 0, 'third', 0, 7, 0];
// Drums.
const BOOM = hits('x.......');
const BOOM_PUSH = hits('x..x.x..');
const MARCH = hits('....x..x');
const CRASH = hits('x.......');
const QUIET = hits('........');
const ROLL_UP = [...repeat(hits('....x...'), 2), ...repeat(hits('x...x.x.'), 2), ...repeat(hits('x.x.x.x.'), 2), ...repeat(hits('xxxxxxxx'), 2)];

// --- Chords. ---
const TURN_CHORDS = 'Em C D B';
// The summit: the peak's chords, a whole step higher.
const SUMMIT = 2;

// The horn's call: the first notes of the ascent, three times, climbing.
const CALL = melody(`
  B4 - E5 - - - - - | B4 - E5 - G5 - - - | B4 - E5 - G5 - B5 - | - - - - - - - - |
`, 1);
// The turn: the horn falling back down to the start.
const TURN_HORN = melody(`
  E5 - - - G5 - - - | E5 - - - C5 - - - | D5 - - - F#5 - - - | B4 - - - - - - - |
`, 1);

const pad = (chords) => ({
  strings: sustained(chords, BAR, 0, 3),
  stringsHigh: sustained(chords, BAR, 2, 4),
  choir: sustained(chords, BAR, 1, 4),
});

const up = (steps) => transpose(steps, SUMMIT);

export const VIGIL_EPIC_THEME = {
  title: 'Thin Air (Summit Push)',
  bpm: 108,
  stepsPerBeat: 2,

  instruments: {
    horn: { ...HORN, volume: 0.06 },
    hornLow: { ...HORN, volume: 0.035, pan: -0.2 },
    brass: { ...BRASS, volume: 0.04, pan: 0.15 },
    brassLow: { ...BRASS, volume: 0.03, pan: -0.15, filter: { type: 'lowpass', frequency: 1600 } },
    violin: { ...SOLO_VIOLIN, volume: 0.05 },
    flute: { ...FLUTE, volume: 0.05, echo: { time: 0.56, feedback: 0.25, mix: 0.25 } },
    harp: { ...HARP, volume: 0.04 },
    bells: { ...BELLS, volume: 0.04, pan: 0.35 },
    saw: { ...STACCATO_STRINGS, volume: 0.03, pan: 0.25 },
    tick: { ...STACCATO_STRINGS, volume: 0.022, pan: -0.25 },
    cello: { ...CELLO, volume: 0.035 },
    lowStrings: { ...LOW_STRINGS, volume: 0.05 },
    strings: { ...STRING_SECTION, volume: 0.028, pan: -0.3 },
    stringsHigh: { ...STRING_SECTION, volume: 0.022, pan: 0.3 },
    choir: { ...CHOIR, volume: 0.03 },
    choirTune: { ...CHOIR, volume: 0.03, pan: 0.1 },
    timpani: { ...TIMPANI, volume: 0.14 },
    boom: { drum: 'boom', volume: 0.2 },
    snare: { drum: 'snare', volume: 0.13 },
    crash: { drum: 'crash', volume: 0.09 },
  },

  sections: {
    // The call: a horn over a timpani roll, the brass swelling.
    call: {
      horn: CALL,
      brassLow: chordLine(BREATH_CHORDS, SWELL, 2),
      lowStrings: chordLine(BREATH_CHORDS, [0, '-', '-', '-', '-', '-', '-', '-'], 2),
      ...pad(BREATH_CHORDS),
      timpani: [...chordLine('B B', TIMP, 2), ...chordLine('B B', TIMP_ROLL, 2)],
      snare: [...rest(3), ...hits('x.x.xxxx')],
      boom: [...BOOM, ...QUIET, ...BOOM, ...BOOM_PUSH],
    },
    // The ascent's tune on the horns, the brass an octave down, the strings sawing.
    ascent: {
      horn: ASCENT,
      hornLow: transpose(ASCENT, -12),
      brassLow: chordLine(ASCENT_CHORDS, SWELL, 2),
      harp: arpeggio(ASCENT_CHORDS, BAR, 3, RUN_UP),
      saw: chordLine(ASCENT_CHORDS, SAW, 3),
      lowStrings: chordLine(ASCENT_CHORDS, DRIVE, 2),
      cello: sustained(ASCENT_CHORDS, BAR, 0, 3),
      ...pad(ASCENT_CHORDS),
      timpani: chordLine(ASCENT_CHORDS, TIMP, 2),
      boom: repeat(BOOM, 8),
      crash: [...CRASH, ...rest(7)],
    },
    // The ledge on the violin and flute, the horn answering in the gaps.
    ledge: {
      violin: LEDGE,
      flute: transpose(LEDGE, 12),
      horn: LEDGE_VIOLIN,
      brass: chordLine(LEDGE_CHORDS, SWELL, 3),
      harp: arpeggio(LEDGE_CHORDS, BAR, 3, TURN),
      saw: chordLine(LEDGE_CHORDS, SAW, 3),
      tick: chordLine(LEDGE_CHORDS, TICK_BUSY, 4),
      lowStrings: chordLine(LEDGE_CHORDS, DRIVE, 2),
      ...pad(LEDGE_CHORDS),
      timpani: chordLine(LEDGE_CHORDS, TIMP, 2),
      snare: repeat(MARCH, 8),
      boom: repeat(BOOM, 8),
    },
    // The Long Stair's tune on all the brass, the choir singing it too.
    stair: {
      brass: STAIR,
      brassLow: transpose(STAIR, -12),
      horn: STAIR,
      choirTune: STAIR,
      violin: STAIR_VIOLIN,
      harp: arpeggio(STAIR_CHORDS, BAR, 3, RUN_UP),
      saw: chordLine(STAIR_CHORDS, SAW, 3),
      lowStrings: chordLine(STAIR_CHORDS, DRIVE, 2),
      cello: sustained(STAIR_CHORDS, BAR, 0, 3),
      ...pad(STAIR_CHORDS),
      timpani: chordLine(STAIR_CHORDS, TIMP_PUSH, 2),
      boom: repeat(BOOM_PUSH, 8),
      snare: repeat(MARCH, 8),
      crash: [...CRASH, ...rest(3), ...CRASH, ...rest(3)],
    },
    // The climb: the flute and violin in rising phrases, everything gathering.
    climb: {
      flute: CLIMB,
      violin: CLIMB_VIOLIN,
      horn: chordLine(CLIMB_CHORDS, [7, '-', '-', '-', '-', '-', '-', '-'], 3),
      brass: chordLine(CLIMB_CHORDS, SWELL, 3),
      brassLow: chordLine(CLIMB_CHORDS, SWELL, 2),
      harp: arpeggio(CLIMB_CHORDS, BAR, 3, RUN_UP),
      saw: chordLine(CLIMB_CHORDS, SAW, 3),
      tick: chordLine(CLIMB_CHORDS, TICK_BUSY, 4),
      lowStrings: chordLine(CLIMB_CHORDS, DRIVE, 2),
      ...pad(CLIMB_CHORDS),
      timpani: [...chordLine(CLIMB_CHORDS.split(' ').slice(0, 6).join(' '), TIMP_PUSH, 2), ...chordLine('D B', TIMP_ROLL, 2)],
      boom: repeat(BOOM_PUSH, 8),
      snare: ROLL_UP,
    },
    // The summit: the peak a whole step up, with everything.
    summit: {
      brass: up(PEAK),
      choirTune: up(transpose(PEAK, -12)),
      violin: up(PEAK),
      flute: up(PEAK_VIOLIN),
      horn: up(PEAK_HORN),
      hornLow: up(transpose(PEAK_HORN, -12)),
      brassLow: up(chordLine(PEAK_TWICE, SWELL, 2)),
      harp: up(arpeggio(PEAK_TWICE, BAR, 3, RUN_UP)),
      bells: up(chordLine(PEAK_TWICE, ['.', '.', '.', '.', '.', '.', 19, '.'], 5)),
      saw: up(chordLine(PEAK_TWICE, SAW, 3)),
      lowStrings: up(chordLine(PEAK_TWICE, DRIVE, 2)),
      cello: up(sustained(PEAK_TWICE, BAR, 0, 3)),
      strings: up(sustained(PEAK_TWICE, BAR, 0, 3)),
      stringsHigh: up(sustained(PEAK_TWICE, BAR, 2, 4)),
      choir: up(sustained(PEAK_TWICE, BAR, 1, 4)),
      timpani: up(chordLine(PEAK_TWICE, TIMP_PUSH, 2)),
      boom: [...repeat(BOOM_PUSH, 15), ...QUIET],
      snare: [...repeat(MARCH, 15), ...hits('x.x.xxxx')],
      crash: [...CRASH, ...rest(7), ...CRASH, ...rest(7)],
    },
    // Back down to E minor, and round to the ascent.
    turn: {
      horn: TURN_HORN,
      hornLow: transpose(TURN_HORN, -12),
      brassLow: chordLine(TURN_CHORDS, SWELL, 2),
      lowStrings: chordLine(TURN_CHORDS, DRIVE, 2),
      ...pad(TURN_CHORDS),
      timpani: [...chordLine('Em C D', TIMP, 2), ...chordLine('B', TIMP_ROLL, 2)],
      boom: [...repeat(BOOM, 3), ...BOOM_PUSH],
      snare: [...rest(3), ...hits('x.x.xxxx')],
      crash: [...CRASH, ...rest(3)],
    },
  },

  order: ['call', 'ascent', 'ledge', 'stair', 'climb', 'summit', 'turn'],
  loopFrom: 1,
};
