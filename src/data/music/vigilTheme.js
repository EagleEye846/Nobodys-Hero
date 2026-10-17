import { melody, chordLine, sustained, arpeggio, transpose, hits, repeat } from '../../audio/notation.js';
import {
  FLUTE, HARP, STRING_SECTION, STACCATO_STRINGS, LOW_STRINGS, CHOIR, BELLS, HORN, BRASS, PIZZICATO_BASS, CELLO, SOLO_VIOLIN, PIANO,
} from '../../audio/instruments.js';

// "Thin Air": the theme of Mount Vigil, the spire you climb round. Not a
// fight: a place, and the pull of the top of it. Wide, cold and slow, the
// way the view is, but always leaning forward: strings and a far choir
// breathing like wind, a harp and bells turning over like ice catching
// light, a flute alone a long way up with a violin answering, a slow pulse
// of plucked basses like boots in snow, and under it all a heartbeat on the
// timpani that won't quite let you rest. The Long Stair's own tune
// (stairTheme.js) drifts through on the horn, because the stair is still
// under your feet. It gathers twice (a held breath before the stair, and a
// long rising climb before the peak) and opens out once, wide and warm above
// the clouds, before thinning back to the wind and going round again.
// E minor leaning to G major, 92 BPM, one step is an 8th note. About three
// and a half minutes, then it loops from the wind.
//
//   wind      8 bars   strings and choir, a bell now and then, the heartbeat
//   ascent    8 bars   the pulse starts, the harp turns, the flute enters
//   ledge     8 bars   the flute's second phrase; violin answers; strings tick
//   breath    4 bars   everything holds on one chord, a roll gathering
//   stair     8 bars   the Long Stair's tune on the horn, strings swelling
//   ice       8 bars   bells, harp and a lone piano over a drone, very still
//   climb     8 bars   up and up: harp runs, low strings driving, a snare
//                      roll, the brass closing in, the choir swelling
//   peak     16 bars   everything, warm and wide: flute and violin high, horn
//                      and brass under them, choir open, drums under the drop
//   thinning  8 bars   it all falls away to the wind

const BAR = 8;

// --- Patterns, as semitones above each chord's root (one chord per bar). ---
// Boots in snow: a pluck on one and three, soft.
const STEPS = [0, '.', '.', '.', 7, '.', '.', '.'];
const STEPS_SLOW = [0, '.', '.', '.', '.', '.', '.', '.'];
// The harp turning over, like light on ice, and running up when it climbs.
const TURN = [0, 7, 12, 'tenth', 19, 'tenth', 12, 7];
const TURN_SLOW = [0, '.', 7, '.', 12, '.', 'tenth', '.'];
const RUN_UP = [0, 7, 12, 'tenth', 19, 24, 'tenth', 24];
// Bells: one high note a bar, somewhere in it.
const CHIME = ['.', '.', '.', '.', '.', '.', 19, '.'];
const CHIME_TWO = [12, '.', '.', '.', '.', '.', 19, '.'];
// Strings ticking on the off-beats, like the pulse quickening.
const TICK = ['.', '.', 'third', '.', '.', '.', 7, '.'];
const TICK_BUSY = ['.', 12, '.', 'tenth', '.', 12, '.', 7];
// Low strings driving the climb.
const DRIVE = [0, '.', 0, '.', 0, 7, '.', 0];
// Brass: a low swell held through the bar.
const SWELL = [0, '-', '-', '-', '-', '-', '-', '-'];
// The piano, alone on the ice: a note on the one and a reply.
const PIANO_ICE = [12, '.', '.', '.', '.', 'tenth', '.', '.'];
// Drums.
const HEART = hits('x.....x.');
const HEART_SLOW = hits('x.......');
const BOOM = hits('x.......');
const BOOM_PICKUP = hits('x.....x.');
const QUIET = hits('........');
const ROLL_IN = [...hits('........'), ...hits('........'), ...hits('x...x...'), ...hits('x.x.x.x.')];
const SNARE_CLIMB = [...hits('....x...'), ...hits('....x...'), ...hits('....x..x'), ...hits('x...x..x'),
  ...hits('x.x.x.x.'), ...hits('x.x.x.x.'), ...hits('xxxxxxxx'), ...hits('xxxxxxxx')];
const CRASH = hits('x.......');

// --- Chords: one a bar. ---
const WIND_CHORDS = 'Em Em C C G G D D';
const ASCENT_CHORDS = 'Em C G D Em C Am B';
const LEDGE_CHORDS = 'C G D Em C G Am D';
const BREATH_CHORDS = 'B B B B';
const STAIR_CHORDS = 'D A Bm G D A G A';
const ICE_CHORDS = 'Em Em C C Em Em D D';
const CLIMB_CHORDS = 'Em C G D Em C D B';
const PEAK_CHORDS = 'G D Em C G D C D';
const PEAK_TWICE = `${PEAK_CHORDS} ${PEAK_CHORDS}`;
const THIN_CHORDS = 'Em C G D Em C Em Em';

// --- Tunes. Each token is an 8th note. ---
// The flute, setting off: long notes, a long way up.
const ASCENT = melody(`
  . . . . B4 - E5 - | G5 - - - F#5 - E5 - | D5 - - - - - B4 - | E5 - - - - - - - |
  . . . . E5 - G5 - | B5 - - - A5 - G5 - | F#5 - - - E5 - D5 - | D#5 - - - - - - - |
`, 1);

// The ledge: the second phrase, wider, looking out.
const LEDGE = melody(`
  G5 - - - E5 - G5 - | B5 - - - - - A5 - | A5 - - - F#5 - A5 - | B5 - - - - - - - |
  C6 - - - B5 - G5 - | D6 - - - - - B5 - | C6 - - - A5 - E5 - | F#5 - - - - - . . |
`, 1);
// The violin answers in the ledge's gaps.
const LEDGE_VIOLIN = melody(`
  . . . . . . . . | . . . . . . E5 F#5 | G5 - - - - - . . | . . . . G5 - A5 - |
  . . . . . . . . | . . . . . . G5 A5 | B5 - - - - - . . | A5 - - - - - - - |
`, 1);

// A held breath: the flute climbs the chord and waits.
const BREATH = melody(`
  F#5 - - - A#5 - - - | B5 - - - - - - - | - - - - - - - - | . . . . . . . . |
`, 1);

// The Long Stair's tune (stairTheme.js), on the horn.
const STAIR = melody(`
  A4 - D5 - F#5 - A5 - | G5 - - E5 C#5 - E5 - | F#5 - - - D5 - B4 - | D5 - - - - - . . |
  A4 - D5 - F#5 - A5 - | B5 - A5 - G5 - E5 - | G5 - F#5 - E5 - D5 - | E5 - - - - - . . |
`, 1);
// Over the stair, the violin lies a long line above the horn.
const STAIR_VIOLIN = melody(`
  . . . . . . . . | . . . . . . . . | A5 - - - - - - - | F#5 - - - - - - - |
  . . . . . . . . | D6 - - - - - - - | B5 - - - - - - - | A5 - - - - - - - |
`, 1);

// The climb: the flute in short, rising phrases, each a step higher.
const CLIMB = melody(`
  E5 - - - G5 - B5 - | - - - - . . . . | G5 - - - B5 - D6 - | - - - - . . . . |
  B5 - - - D6 - E6 - | - - - - . . . . | F#6 - - - - - G6 - | A#6 - - - B6 - - - |
`, 1);
// The violin climbs with it, a third below, then takes the top.
const CLIMB_VIOLIN = melody(`
  . . . . . . . . | B4 - - - E5 - G5 - | . . . . . . . . | D5 - - - G5 - B5 - |
  . . . . . . . . | G5 - - - B5 - D6 - | D#6 - - - - - - - | F#6 - - - - - - - |
`, 1);

// The peak: the ascent's tune, up high, with room to breathe between phrases.
const PEAK = melody(`
  . . . . B5 - E6 - | G6 - - - F#6 - E6 - | D6 - - - - - B5 - | E6 - - - - - - - |
  . . . . E6 - G6 - | B6 - - - A6 - G6 - | F#6 - - - E6 - D6 - | D6 - - - - - - - |
  G6 - - - E6 - G6 - | B6 - - - - - A6 - | A6 - - - F#6 - A6 - | B6 - - - - - - - |
  C7 - - - B6 - G6 - | D7 - - - - - B6 - | C7 - - - A6 - E6 - | G6 - - - - - - - |
`, 1);
// The violin, a third under the flute at the peak.
const PEAK_VIOLIN = melody(`
  . . . . G5 - B5 - | E6 - - - D6 - B5 - | B5 - - - - - G5 - | B5 - - - - - - - |
  . . . . B5 - D6 - | G6 - - - F#6 - D6 - | D6 - - - B5 - A5 - | B5 - - - - - - - |
  E6 - - - B5 - E6 - | G6 - - - - - F#6 - | F#6 - - - D6 - F#6 - | G6 - - - - - - - |
  A6 - - - G6 - E6 - | B6 - - - - - G6 - | A6 - - - F#6 - C6 - | B5 - - - - - - - |
`, 1);
// Under the peak, the horn answers with the stair's tune, slower.
const PEAK_HORN = melody(`
  . . . . . . . . | . . . . . . . . | A4 - - - D5 - F#5 - | A5 - - - - - - - |
  G5 - - - E5 - C#5 - | E5 - - - - - - - | F#5 - - - D5 - B4 - | D5 - - - - - - - |
  . . . . . . . . | . . . . . . . . | A4 - - - D5 - F#5 - | A5 - - - - - - - |
  B5 - - - A5 - G5 - | E5 - - - - - - - | G5 - - - F#5 - E5 - | D5 - - - - - - - |
`, 1);

// Thinning: the flute's last few notes, falling away.
const THINNING = melody(`
  E6 - - - - - B5 - | G5 - - - - - - - | . . . . E5 - G5 - | B5 - - - - - - - |
  . . . . . . . . | . . . . . . . . | E5 - - - - - - - | . . . . . . . . |
`, 1);

const SILENCE = (bars) => melody(Array(bars * 8).fill('.').join(' '), 1);

const pad = (chords) => ({
  strings: sustained(chords, BAR, 0, 3),
  stringsHigh: sustained(chords, BAR, 2, 4),
  choir: sustained(chords, BAR, 1, 4),
});
const quiet = (bars, ...tracks) => Object.fromEntries(tracks.map((t) => [t, SILENCE(bars)]));

export const VIGIL_THEME = {
  title: 'Thin Air',
  bpm: 92,
  stepsPerBeat: 2,

  instruments: {
    flute: { ...FLUTE, volume: 0.07, echo: { time: 0.65, feedback: 0.3, mix: 0.3 } },
    fluteLow: { ...FLUTE, volume: 0.02, pan: -0.2 },
    violin: { ...SOLO_VIOLIN, volume: 0.045 },
    horn: { ...HORN, volume: 0.04 },
    brass: { ...BRASS, volume: 0.022, pan: -0.15 },
    harp: { ...HARP, volume: 0.038 },
    bells: { ...BELLS, volume: 0.045, pan: 0.35, echo: { time: 0.98, feedback: 0.35, mix: 0.4 } },
    piano: { ...PIANO, volume: 0.05, pan: 0.2 },
    cello: { ...CELLO, volume: 0.03 },
    lowStrings: { ...LOW_STRINGS, volume: 0.035 },
    tick: { ...STACCATO_STRINGS, volume: 0.02, pan: 0.2 },
    strings: { ...STRING_SECTION, volume: 0.022, pan: -0.3 },
    stringsHigh: { ...STRING_SECTION, volume: 0.016, pan: 0.3 },
    choir: { ...CHOIR, volume: 0.02 },
    choirHigh: { ...CHOIR, volume: 0.014, pan: 0.25 },
    bass: { ...PIZZICATO_BASS, volume: 0.1 },
    drone: { wave: 'sine', volume: 0.08, attack: 1.5, decay: 2, sustain: 0.9, release: 2, gate: 1 },
    heart: { drum: 'kick', volume: 0.22 },
    // The big orchestral bass drum under the drop (a drum, so it takes hits).
    boom: { drum: 'boom', volume: 0.16 },
    snare: { drum: 'snare', volume: 0.12 },
    crash: { drum: 'crash', volume: 0.08 },
  },

  sections: {
    // Wind: strings and the choir breathing, a bell now and then, the heart.
    wind: {
      ...quiet(8, 'flute', 'fluteLow', 'violin', 'horn', 'brass', 'harp', 'piano', 'cello', 'lowStrings', 'tick', 'choirHigh', 'bass', 'boom', 'snare', 'crash'),
      ...pad(WIND_CHORDS),
      bells: chordLine(WIND_CHORDS, CHIME, 5),
      drone: sustained(WIND_CHORDS, BAR, 0, 2),
      heart: [...repeat(QUIET, 4), ...repeat(HEART_SLOW, 4)],
    },
    ascent: {
      ...quiet(8, 'violin', 'horn', 'brass', 'piano', 'lowStrings', 'tick', 'choirHigh', 'boom', 'snare', 'crash'),
      flute: ASCENT, fluteLow: transpose(ASCENT, -12),
      harp: arpeggio(ASCENT_CHORDS, BAR, 3, TURN),
      bells: chordLine(ASCENT_CHORDS, CHIME, 5),
      cello: sustained(ASCENT_CHORDS, BAR, 0, 3),
      ...pad(ASCENT_CHORDS),
      bass: chordLine(ASCENT_CHORDS, STEPS, 2),
      drone: sustained(ASCENT_CHORDS, BAR, 0, 2),
      heart: repeat(HEART_SLOW, 8),
    },
    ledge: {
      ...quiet(8, 'horn', 'brass', 'piano', 'lowStrings', 'boom', 'snare', 'crash'),
      flute: LEDGE, fluteLow: transpose(LEDGE, -12),
      violin: LEDGE_VIOLIN,
      harp: arpeggio(LEDGE_CHORDS, BAR, 3, TURN),
      bells: chordLine(LEDGE_CHORDS, CHIME_TWO, 5),
      cello: sustained(LEDGE_CHORDS, BAR, 0, 3),
      tick: chordLine(LEDGE_CHORDS, TICK, 4),
      ...pad(LEDGE_CHORDS),
      choirHigh: sustained(LEDGE_CHORDS, BAR, 2, 5),
      bass: chordLine(LEDGE_CHORDS, STEPS, 2),
      drone: sustained(LEDGE_CHORDS, BAR, 0, 2),
      heart: repeat(HEART, 8),
    },
    // A held breath on one chord, a roll gathering underneath.
    breath: {
      ...quiet(4, 'fluteLow', 'violin', 'horn', 'harp', 'piano', 'cello', 'tick', 'bass', 'crash'),
      flute: BREATH,
      bells: chordLine(BREATH_CHORDS, CHIME_TWO, 5),
      brass: chordLine(BREATH_CHORDS, SWELL, 3),
      lowStrings: chordLine(BREATH_CHORDS, [0, '-', '-', '-', '-', '-', '-', '-'], 2),
      ...pad(BREATH_CHORDS),
      choirHigh: sustained(BREATH_CHORDS, BAR, 2, 5),
      drone: sustained(BREATH_CHORDS, BAR, 0, 2),
      heart: repeat(HEART, 4),
      boom: ROLL_IN,
      snare: [...QUIET, ...QUIET, ...hits('......x.'), ...hits('x.x.xxxx')],
    },
    // The Long Stair's tune on the horn, the strings swelling under it.
    stair: {
      ...quiet(8, 'flute', 'fluteLow', 'piano', 'lowStrings', 'snare'),
      horn: STAIR,
      violin: STAIR_VIOLIN,
      brass: chordLine(STAIR_CHORDS, SWELL, 3),
      harp: arpeggio(STAIR_CHORDS, BAR, 3, TURN),
      bells: chordLine(STAIR_CHORDS, CHIME, 5),
      cello: sustained(STAIR_CHORDS, BAR, 0, 3),
      tick: chordLine(STAIR_CHORDS, TICK, 4),
      ...pad(STAIR_CHORDS),
      choirHigh: sustained(STAIR_CHORDS, BAR, 2, 5),
      bass: chordLine(STAIR_CHORDS, STEPS, 2),
      drone: sustained(STAIR_CHORDS, BAR, 0, 2),
      heart: repeat(HEART_SLOW, 8),
      boom: [...repeat(BOOM, 8)],
      crash: [...CRASH, ...repeat(QUIET, 7)],
    },
    // Ice: bells, harp and a lone piano over the drone, very still.
    ice: {
      ...quiet(8, 'flute', 'fluteLow', 'violin', 'horn', 'brass', 'cello', 'lowStrings', 'tick', 'strings', 'stringsHigh', 'choirHigh', 'bass', 'boom', 'snare', 'crash'),
      harp: arpeggio(ICE_CHORDS, BAR, 4, TURN_SLOW),
      bells: arpeggio(ICE_CHORDS, BAR, 5, ['.', 12, '.', 19, '.', 'tenth', '.', 24]),
      piano: chordLine(ICE_CHORDS, PIANO_ICE, 4),
      choir: sustained(ICE_CHORDS, BAR, 1, 4),
      drone: sustained(ICE_CHORDS, BAR, 0, 2),
      heart: [...repeat(QUIET, 6), ...repeat(HEART_SLOW, 2)],
    },
    // The climb: up and up, everything gathering.
    climb: {
      ...quiet(8, 'piano', 'crash'),
      flute: CLIMB, fluteLow: transpose(CLIMB, -12),
      violin: CLIMB_VIOLIN,
      horn: chordLine(CLIMB_CHORDS, [7, '-', '-', '-', '-', '-', '-', '-'], 3),
      brass: chordLine(CLIMB_CHORDS, SWELL, 3),
      harp: arpeggio(CLIMB_CHORDS, BAR, 3, RUN_UP),
      bells: chordLine(CLIMB_CHORDS, CHIME_TWO, 5),
      cello: sustained(CLIMB_CHORDS, BAR, 0, 3),
      lowStrings: chordLine(CLIMB_CHORDS, DRIVE, 2),
      tick: chordLine(CLIMB_CHORDS, TICK_BUSY, 4),
      ...pad(CLIMB_CHORDS),
      choirHigh: sustained(CLIMB_CHORDS, BAR, 2, 5),
      bass: chordLine(CLIMB_CHORDS, STEPS, 2),
      drone: sustained(CLIMB_CHORDS, BAR, 0, 2),
      heart: repeat(HEART, 8),
      boom: repeat(BOOM_PICKUP, 8),
      snare: SNARE_CLIMB,
    },
    // The peak: everything, warm and wide.
    peak: {
      flute: PEAK, fluteLow: transpose(PEAK, -12),
      violin: PEAK_VIOLIN,
      horn: PEAK_HORN,
      brass: chordLine(PEAK_TWICE, SWELL, 3),
      harp: arpeggio(PEAK_TWICE, BAR, 3, TURN),
      bells: chordLine(PEAK_TWICE, CHIME_TWO, 5),
      piano: chordLine(PEAK_TWICE, [12, '.', '.', '.', 'tenth', '.', '.', '.'], 4),
      cello: sustained(PEAK_TWICE, BAR, 0, 3),
      lowStrings: chordLine(PEAK_TWICE, DRIVE, 2),
      tick: chordLine(PEAK_TWICE, TICK, 4),
      ...pad(PEAK_TWICE),
      choirHigh: sustained(PEAK_TWICE, BAR, 2, 5),
      bass: chordLine(PEAK_TWICE, STEPS, 2),
      drone: sustained(PEAK_TWICE, BAR, 0, 2),
      heart: repeat(HEART, 16),
      boom: [...repeat(BOOM, 8), ...repeat(BOOM_PICKUP, 7), ...QUIET],
      snare: [...repeat(hits('....x...'), 15), ...hits('x.x.xxxx')],
      crash: [...CRASH, ...repeat(QUIET, 7), ...CRASH, ...repeat(QUIET, 7)],
    },
    // Thinning: it all falls away to the wind.
    thinning: {
      ...quiet(8, 'violin', 'horn', 'brass', 'piano', 'cello', 'lowStrings', 'tick', 'choirHigh', 'boom', 'snare'),
      flute: THINNING, fluteLow: SILENCE(8),
      harp: arpeggio(THIN_CHORDS, BAR, 4, TURN_SLOW),
      bells: chordLine(THIN_CHORDS, CHIME, 5),
      ...pad(THIN_CHORDS),
      bass: chordLine(THIN_CHORDS, STEPS_SLOW, 2),
      drone: sustained(THIN_CHORDS, BAR, 0, 2),
      heart: [...repeat(HEART_SLOW, 4), ...repeat(QUIET, 4)],
      crash: [...CRASH, ...repeat(QUIET, 7)],
    },
  },

  order: ['wind', 'ascent', 'ledge', 'breath', 'stair', 'ice', 'climb', 'peak', 'thinning'],
};
