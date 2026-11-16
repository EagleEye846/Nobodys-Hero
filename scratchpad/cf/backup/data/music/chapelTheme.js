import { melody, arpeggio, transpose, midi, HOLD, REST } from '../../audio/notation.js';
import { CONCERT_PIANO, CHOIR, BELLS } from '../../audio/instruments.js';

// "Vespers": the theme of the little log chapel in Heralds' Rest, after dark.
// The candles are lit and someone has been kneeling here every evening for
// someone who went up the mountain and didn't come back. A soft, breathy
// organ and a hushed choir hold the stillness of the place, with a low
// drone that never quite lets it settle; over them a felted piano sings a
// plain, tender tune, close by, the way a prayer is said under the breath.
// A glass harmonica and a celesta flicker high up like candlelight, and a
// distant bell tolls once as each part begins. In the dark middle the organ
// plays the heralds' prophecy (prophecyTheme.js), slowly, over a pedal that
// won't move; then, in the quiet before the end, a music box remembers a
// scrap of the village's own tune (restTheme.js, "A Light Left On"), as if
// the door had opened onto the square for a moment.
// D Dorian / D minor, 4/4 at 60 BPM, one step is an 8th note. About two
// minutes forty; the opening plays once, then it loops from the prayer.
//
//   nave          4 bars   the organ breathes in, the bell, a glass shimmer
//   prayer        8 bars   the tune on the piano, organ low and soft
//   prayerAnswer  8 bars   again, warmer: the choir comes in, the glass answers
//   prophecy      8 bars   darker: the prophecy on the organ over a held pedal
//   candle        4 bars   hushed: the village's tune on a music box
//   amen          8 bars   the tune comes home, the glass above it, and rests

const BAR = 8;
const H = HOLD;

// Chord voicings, one bar at a time ('|' between bars); '>' splits a bar
// into equal parts so a voice can lean from one note to the next (a
// suspension resolving). A voice holding the same note into the next chord
// keeps sounding instead of striking again, the way an organist ties it.
// '.' rests that voice. Returns one line of steps per voice, low to high.
function voicing(spec, voiceCount) {
  const lines = Array.from({ length: voiceCount }, () => []);
  const previous = Array(voiceCount).fill(null);
  for (const bar of spec.split('|').map((s) => s.trim()).filter(Boolean)) {
    const chords = bar.split('>').map((s) => s.trim());
    const each = BAR / chords.length;
    if (!Number.isInteger(each)) throw new Error(`Vespers: '${bar}' can't be split evenly`);
    for (const chord of chords) {
      const notes = chord.split(/\s+/);
      if (notes.length !== voiceCount) throw new Error(`Vespers: '${chord}' should have ${voiceCount} notes`);
      notes.forEach((name, v) => {
        if (name === REST) {
          lines[v].push(...Array(each).fill(REST));
          previous[v] = null;
          return;
        }
        const note = midi(name);
        lines[v].push(previous[v] === note ? H : note, ...Array(each - 1).fill(H));
        previous[v] = note;
      });
    }
  }
  return lines;
}

const organ = (spec) => {
  const [organLow, organMid, organHigh] = voicing(spec, 3);
  return { organLow, organMid, organHigh };
};
const organLow2 = (spec) => {
  const [organLow, organMid] = voicing(spec, 3);
  return { organLow, organMid };
};
const choir = (spec) => {
  const [choirLow, choirHigh] = voicing(spec, 2);
  return { choirLow, choirHigh };
};
const pedal = (spec) => voicing(spec, 1)[0];
const line = (text) => melody(text, 1);
const silence = (bars) => Array(bars * BAR).fill(REST);

// The piano's left hand: open fifths and octaves, no thirds, so the organ
// gives the chords their colour. And a slower one for the hush.
const LEFT_HAND = [0, H, 7, H, 12, H, 7, H];
const LEFT_HAND_SLOW = [0, H, H, H, 7, H, 12, H];

// The bell: one toll, low and far off, as a part begins.
const toll = (bars) => [midi('D3'), ...Array(BAR * 2 - 1).fill(H), ...silence(bars - 2)];

// --- Tunes. Each token is an 8th note; eight to a bar. ---

// The prayer: a small rise and a long sigh down, asking.
const PRAYER_ASK = `
  . . A4 - D5 - F5 -   | E5 - - - D5 - B4 -   | D5 - - - C5 - Bb4 -  | A4 - - - - - . .  |
`;
const PRAYER = line(`${PRAYER_ASK}
  . . G4 - Bb4 - D5 -  | F5 - - - E5 - D5 -   | E5 - - - G5 - - F5   | E5 - - - - - . .  |
`);
// Again, and this time it finds somewhere warm to land (F major).
const PRAYER_WARM = line(`${PRAYER_ASK}
  . . G4 - Bb4 - D5 -  | G5 - - - F5 - E5 -   | F5 - - - D5 - Bb4 -  | C5 - - - A4 - - - |
`);
// Coming home to D, and resting there.
const AMEN_TAIL = `
  . . G4 - Bb4 - D5 -  | F5 - - - G5 - F5 -   | E5 - - - C#5 - E5 -  | D5 - - - - - . .  |
`;
const AMEN = line(`${PRAYER_ASK}${AMEN_TAIL}`);
// The glass harmonica, an octave above the end of it, like a candle beside her.
const AMEN_GLASS = [...silence(4), ...transpose(line(AMEN_TAIL), 12)];

// The glass answering the piano where it breathes.
const ANSWER_GLASS = line(`
  . . . . . . . .      | . . . . . . . .      | . . . . . . . .      | . . . . . . C6 -  |
  A5 - - - . . . .     | . . . . . . . .      | . . . . . . . .      | . . . . . . A5 -  |
`);

// The heralds' prophecy (prophecyTheme.js), moved down into D minor, on the organ.
const PROPHECY = line(`
  . . A4 - - - D5 -    | F5 - - - E5 - D5 -   | C5 - - - - - . .     | . . A4 - C5 - F5 - |
  E5 - - - D5 - A4 -   | Bb4 - - - D5 - - -   | C#5 - - - - - E5 -   | D5 - - - - - . .   |
`);

// The village's tune (restTheme.js), half-remembered, in F: the same rise of
// a sixth and sigh down, slowed and straightened into four.
const VILLAGE = line(`
  C5 - A5 - - - G5 F5  | D5 - - - F5 - D5 -   | C5 - - - - - . .     | . . . . . . . .   |
`);

// Candlelight: a high note now and then, where nothing else is moving.
const NAVE_LIGHT = line(`
  . . . . . . . .      | . . . . . . A6 -     | . . . . F6 - . .     | . . . . . . E6 -  |
`);
const PRAYER_LIGHT = line(`
  . . . . . . . .      | . . . . . . . .      | . . . . . . . .      | . . . . A6 - . .  |
  . . . . . . . .      | . . . . . . . .      | . . . . . . . .      | . . . . . . E6 -  |
`);
const ANSWER_LIGHT = line(`
  . . . . . . . .      | . . . . . . . D6     | . . . . . . . .      | . . . . . . . .   |
  . . . . . . . .      | . . . . . . . G6     | . . . . . . . .      | . . . . . . . .   |
`);
const PROPHECY_LIGHT = [...silence(7), ...line('. . . . . . A6 -')];
const CANDLE_LIGHT = [...silence(3), ...line('. . . . A6 - E6 -')];
const AMEN_LIGHT = line(`
  . . . . . . . .      | . . . . . . . .      | . . . . . . . .      | . . . . A6 - . .  |
  . . . . . . . .      | . . . . . . . .      | . . . . . . . .      | . . . . . . E6 -  |
`);
// The glass's shimmer in the opening: one long note, then another.
const NAVE_GLASS = line(`
  . . . . A5 - - -     | - - - - - - - -      | G5 - - - - - - -     | . . . . . . . .   |
`);

// --- Instruments. ---

// A small chapel organ, played softly: flue pipes slightly out of tune with
// each other, a soft 16' underneath and a quiet 4' on top, wind in the pipes,
// a slow swell into each chord and a long ring in the stone.
const PIPE = [1, 0.5, 0.25, 0.15, 0.08, 0.04];
const ORGAN_SOFT = {
  voices: [
    { harmonics: PIPE, detune: -5, level: 0.4 },
    { harmonics: PIPE, detune: 5, level: 0.4 },
    { wave: 'sine', octave: -1, level: 0.3 },
    { harmonics: [1, 0.3], octave: 1, detune: 3, level: 0.12 },
  ],
  filter: { type: 'lowpass', frequency: 2000 },
  attack: 0.5, decay: 1.2, sustain: 0.9, release: 1.3, gate: 1,
  vibrato: { rate: 5.4, depth: 3 },
  breath: { level: 0.015, frequency: 1200, q: 0.6 },
  reverb: 0.75,
};
// The same organ with a principal drawn, for a tune: quicker to speak.
const ORGAN_SOLO = {
  ...ORGAN_SOFT,
  voices: [
    { harmonics: [1, 0.6, 0.35, 0.25, 0.12, 0.08, 0.04], detune: -4, level: 0.45 },
    { harmonics: [1, 0.6, 0.35, 0.25, 0.12, 0.08, 0.04], detune: 4, level: 0.45 },
    { wave: 'sine', octave: -1, level: 0.2 },
    { harmonics: [1, 0.3], octave: 1, detune: 2, level: 0.15 },
  ],
  filter: { type: 'lowpass', frequency: 2600 },
  attack: 0.14, decay: 1, release: 0.9, gate: 0.97,
  vibrato: { rate: 5.4, depth: 4 },
};
// The pedal: a deep, still note under everything.
const PEDAL = {
  voices: [{ wave: 'sine', level: 1 }, { harmonics: [1, 0.3, 0.1], octave: 1, level: 0.22 }],
  attack: 1.5, decay: 2, sustain: 0.9, release: 2, gate: 1,
  reverb: 0.5,
};
// A choir singing under its breath: a darker, airier "ah".
const HUSHED_CHOIR = {
  ...CHOIR,
  filter: { type: 'lowpass', frequency: 1400 },
  attack: 0.9, release: 1.4,
  vibrato: { rate: 4.6, depth: 8, delay: 0.6 },
  breath: { level: 0.05, frequency: 2400, q: 0.6 },
  reverb: 0.75,
};
// A felted piano, close by: the concert grand, softened.
const FELT_PIANO = { ...CONCERT_PIANO, filter: { type: 'lowpass', frequency: 2500 }, reverb: 0.55 };
// A glass harmonica: wet fingers on glass, a pure tone that swells and wavers.
const GLASS = {
  voices: [
    { wave: 'sine', level: 1 },
    { harmonics: [1, 0, 0.2], detune: -4, level: 0.3 },
    { wave: 'sine', octave: 1, detune: 3, level: 0.18 },
  ],
  attack: 0.3, decay: 1.5, sustain: 0.7, release: 1.2, gate: 1,
  vibrato: { rate: 4.2, depth: 6, delay: 0.3 },
  breath: { level: 0.03, frequency: 5000, q: 0.5 },
  humanize: { time: 0.01, volume: 0.1 },
  reverb: 0.75,
};
// A celesta: a tiny bell with a bright octave above it.
const CELESTA = {
  voices: [
    { harmonics: [1, 0, 0.3, 0, 0.12], level: 1 },
    { wave: 'sine', octave: 1, detune: 3, level: 0.3 },
    { wave: 'sine', octave: 2, level: 0.06 },
  ],
  attack: 0.002, decay: 0.9, sustain: 0, release: 0.9, gate: 1,
  click: 0.02,
  humanize: { time: 0.01, volume: 0.15 },
  reverb: 0.7,
};
// A church bell a long way off: a hum an octave down, the strike tone, the
// bell's minor-third tierce and its fifth, and a slightly-off octave that
// beats against it; muffled by distance and left to ring.
const CHURCH_BELL = {
  voices: [
    { wave: 'sine', octave: -1, level: 0.5 },
    { wave: 'sine', level: 0.6 },
    { wave: 'sine', detune: 310, level: 0.3 },
    { wave: 'sine', detune: 705, level: 0.18 },
    { wave: 'sine', octave: 1, level: 0.35 },
    { wave: 'sine', octave: 1, detune: 14, level: 0.25 },
  ],
  filter: { type: 'lowpass', frequency: 1600 },
  attack: 0.004, decay: 2.4, sustain: 0, release: 2.5, gate: 1,
  click: 0.08,
  pan: -0.35,
  reverb: 0.85,
};

export const CHAPEL_THEME = {
  title: 'Vespers',
  bpm: 60,
  stepsPerBeat: 2,
  loopFrom: 1,

  instruments: {
    piano: { ...FELT_PIANO, volume: 0.085, pan: 0.05, echo: { time: 0.75, feedback: 0.25, mix: 0.18 } },
    pianoLow: { ...FELT_PIANO, volume: 0.028, pan: -0.15 },
    organLow: { ...ORGAN_SOFT, volume: 0.022, pan: -0.25 },
    organMid: { ...ORGAN_SOFT, volume: 0.018, pan: 0.2 },
    organHigh: { ...ORGAN_SOFT, volume: 0.014, pan: 0 },
    organLead: { ...ORGAN_SOLO, volume: 0.045, pan: 0.05, echo: { time: 1, feedback: 0.25, mix: 0.2 } },
    pedal: { ...PEDAL, volume: 0.036 },
    choirLow: { ...HUSHED_CHOIR, volume: 0.012, pan: -0.3 },
    choirHigh: { ...HUSHED_CHOIR, volume: 0.01, pan: 0.3 },
    glass: { ...GLASS, volume: 0.025, pan: 0.25, echo: { time: 1.5, feedback: 0.3, mix: 0.25 } },
    musicBox: { ...BELLS, volume: 0.045, pan: -0.1, reverb: 0.6, echo: { time: 0.75, feedback: 0.3, mix: 0.3 } },
    celesta: { ...CELESTA, volume: 0.022, pan: 0.35, echo: { time: 1.5, feedback: 0.35, mix: 0.35 } },
    bell: { ...CHURCH_BELL, volume: 0.022 },
  },

  sections: {
    // The nave: the organ breathes in, the bell tolls, a glass shimmer.
    nave: {
      ...organ('D3 A3 E4 | D3 Bb3 F4 | D3 B3 G4 | E3 A3 D4 > E3 A3 C#4'),
      pedal: pedal('D2 | D2 | D2 | A1'),
      glass: NAVE_GLASS,
      celesta: NAVE_LIGHT,
      bell: toll(4),
    },
    // The prayer: the tune on the piano, the organ low and soft.
    prayer: {
      piano: PRAYER,
      pianoLow: arpeggio('Dm G Bb F Gm Dm C A', BAR, 3, LEFT_HAND),
      ...organLow2('D3 A3 F4 | D3 B3 G4 | D3 Bb3 F4 | C3 A3 F4 | D3 Bb3 G4 | D3 A3 F4 | C3 G3 E4 | E3 A3 D4 > E3 A3 C#4'),
      pedal: pedal('D2 | D2 | D2 | D2 | D2 | D2 | C2 | A1'),
      celesta: PRAYER_LIGHT,
      bell: toll(8),
    },
    // Again, warmer: the choir joins under its breath and the glass answers.
    prayerAnswer: {
      piano: PRAYER_WARM,
      pianoLow: [...arpeggio('Dm G Bb F Gm C Bb', BAR, 3, LEFT_HAND), ...arpeggio('C F', BAR / 2, 3, [0, H, 7, H])],
      ...organ('D3 A3 F4 | D3 B3 G4 | D3 Bb3 F4 | C3 A3 F4 | D3 Bb3 G4 | C3 G3 E4 | D3 Bb3 F4 | C3 G3 E4 > C3 A3 F4'),
      ...choir('A3 D4 | B3 D4 | Bb3 D4 | A3 C4 | Bb3 D4 | G3 C4 | Bb3 D4 | G3 C4 > A3 C4'),
      pedal: pedal('D2 | D2 | D2 | D2 | D2 | C2 | Bb1 | C2 > F1'),
      glass: ANSWER_GLASS,
      celesta: ANSWER_LIGHT,
      bell: toll(8),
    },
    // The prophecy: darker, the old tune on the organ over a pedal that won't
    // move, the chords leaning on suspensions that take their time.
    prophecy: {
      organLead: PROPHECY,
      ...organ('D3 F3 A3 | D3 F3 Bb3 | C3 F3 A3 | C3 E3 G3 > C3 D3 G3 | D3 F3 A3 | D3 F3 Bb3 > D3 G3 Bb3 | C#3 E3 A3 > C#3 G3 A3 | D3 F3 A3 > D3 E3 A3'),
      ...choir('A3 F4 | Bb3 F4 | A3 F4 | G3 E4 > G3 D4 | A3 F4 | Bb3 F4 > Bb3 G4 | A3 E4 > G3 E4 | A3 F4 > A3 E4'),
      pedal: pedal('D2 | D2 | D2 | D2 | D2 | D2 | A1 | D2'),
      celesta: PROPHECY_LIGHT,
      bell: toll(8),
    },
    // The candle: hushed; the village's tune on a music box, nothing else moving.
    candle: {
      musicBox: VILLAGE,
      pianoLow: arpeggio('F Bb C A', BAR, 3, LEFT_HAND_SLOW),
      ...choir('A3 C4 | Bb3 D4 | G3 C4 | A3 D4 > A3 C#4'),
      pedal: pedal('F2 | Bb1 | C2 | A1'),
      celesta: CANDLE_LIGHT,
    },
    // Amen: the tune comes home to D, the glass above it, and it rests.
    amen: {
      piano: AMEN,
      pianoLow: [...arpeggio('Dm G Bb F Gm Bb A', BAR, 3, LEFT_HAND), ...arpeggio('Dm A', BAR / 2, 3, [0, H, 7, H])],
      ...organ('D3 A3 F4 | D3 B3 G4 | D3 Bb3 F4 | C3 A3 F4 | D3 Bb3 G4 | D3 Bb3 F4 | E3 A3 D4 > E3 A3 C#4 | D3 A3 F4 > E3 A3 C#4'),
      ...choir('. . | . . | . . | . . | Bb3 D4 | Bb3 D4 | A3 D4 > A3 C#4 | A3 D4 > A3 C#4'),
      pedal: pedal('D2 | D2 | D2 | D2 | D2 | D2 | A1 | D2 > A1'),
      glass: AMEN_GLASS,
      celesta: AMEN_LIGHT,
      bell: toll(8),
    },
  },

  order: ['nave', 'prayer', 'prayerAnswer', 'prophecy', 'candle', 'amen'],
};
