import { melody, chordLine, arpeggio, sustained, transpose, hits, repeat } from '../../audio/notation.js';
import { BRASS, STRINGS, LOW_STRINGS, PIANO, CHOIR, TIMPANI, BELLS, ORGAN } from '../../audio/instruments.js';

// "Keeper of the Small Flames": Mother Taper's boss theme, when she stands in
// front of the door. An original piece in the spirit of Toby Fox's
// "Heartache" and "ASGORE": driving and heroic, but sad underneath, because
// she doesn't want to fight you either. Her lullaby ("Wax and Lullaby",
// taperTheme.js) runs all the way through it, first as a whisper, then
// sung back over the drums, and finally blared out in full, a step higher.
// B minor (the climax in C# minor), 4/4 at 140 BPM. One step is a 16th note.
// About three minutes before it loops:
//
//   intro     8 bars  her lullaby alone on a music box, in the dark
//   A        16 bars  the fight: brass tune, racing arpeggios, drums
//   motif    16 bars  her lullaby over the beat, strings and then brass
//   bridge   16 bars  D major, half-time: the warm, aching part
//   hush      8 bars  everything drops out but the music box and a heartbeat
//   duel     16 bars  brass and her lullaby answer each other, climbing
//   climax   16 bars  up a step: the whole lullaby, full orchestra
//   turn      8 bars  winding back round into the fight

// --- Chords. ---
const INTRO_CHORDS = 'Bm Bm G G Em Em F# F#';
const A_CHORDS = 'Bm G D A Bm G Em F# Bm G D A G Em F# F#';
// Her lullaby's chords, two to a bar.
const LULLABY_CHORDS = 'Bm G D A Bm G Em F# G A F#m Bm G Em F# Bm';
const MOTIF_CHORDS = `${LULLABY_CHORDS} ${LULLABY_CHORDS}`;
const BRIDGE_CHORDS = 'D A Bm F#m G D Em A D A Bm F#m G A Bm Bm';
const DUEL_CHORDS = 'Em F# Bm Bm G A D F# Em F# G A Em F# G G#';
// The same lullaby chords, one to a bar (the climax is written in B minor and
// shifted up a step).
const CLIMAX_CHORDS = LULLABY_CHORDS;
const TURN_CHORDS = 'A A G G Em Em F# F#';

const BAR = 16;
const rest = (bars) => Array(bars * BAR).fill('.');

// --- Patterns, as semitones above each chord's root. ---
// A pumping octave bass, a bar long and half a bar long.
const BASS = [0, '-', 12, 0, '.', 0, 12, '.', 0, '-', 12, 0, '.', 7, 12, '.'];
const HALF_BASS = [0, '-', 12, 0, '.', 0, 12, '.'];
// Racing arpeggios under everything, like a candle flame flickering.
const FLICKER = [0, 7, 'third', 7, 12, 7, 'third', 7];
// Slow, heavy low strings for the bridge: root, then fifth.
const OOM = [0, '-', '-', '-', '.', '.', '.', '.', 7, '-', '-', '-', '.', '.', '.', '.'];
const ON_ONE = [0, ...Array(15).fill('.')];
const ONE_AND_THREE = [0, '.', '.', '.', '.', '.', '.', '.', 7, '.', '.', '.', '.', '.', '.', '.'];
const ROLL = [0, '.', 0, '.', 0, '.', 0, '.', 0, 0, 0, 0, 0, 0, 0, 0];

// --- Drums. ---
const KICK = hits('x.....x. x.......');
const KICK_BIG = hits('x.....x. x...x...');
const SNARE = hits('....x... ....x...');
// A marching snare for the climax, with little ghost notes.
const MARCH = hits('....x..x ....x.xx');
const FILL = hits('....x... x.x.xxxx');
const SNARE_ROLL = hits('x.x.x.x. xxxxxxxx');
const HAT = hits('x.x.x.x. x.x.x.x.');
const OPEN_HAT = hits('..x...x. ..x...x.');
const HALF_KICK = hits('x....... ........');
const HALF_SNARE = hits('........ x.......');
const QUARTER_HAT = hits('x...x... x...x...');
const HEARTBEAT = hits('x..x.... ........');

// A full kit for `bars` bars, with a fill on every 8th bar.
function kit(bars, { kick = KICK, snare = SNARE } = {}) {
  return {
    kick: repeat(kick, bars),
    snare: Array.from({ length: bars }, (_, i) => ((i + 1) % 8 === 0 ? FILL : snare)).flat(),
    hat: repeat(HAT, bars),
    openHat: repeat(OPEN_HAT, bars),
  };
}
// A crash on the first bar of every `every` bars.
const crashes = (bars, every) => Array.from({ length: bars }, (_, i) => (i % every === 0 ? hits('x...............') : rest(1))).flat();

// --- Her lullaby (from "Wax and Lullaby"), squeezed into eight bars. ---
const MOTIF = melody(`
  F#5 - D5 E5 F#5 - B4 - | A4 - F#4 A4 E5 - - - |
  F#5 - D5 E5 G5 - F#5 E5 | D5 - E5 B4 C#5 - - - |
  D5 - E5 F#5 E5 - C#5 A4 | C#5 - A4 F#4 B4 - - D5 |
  B4 - D5 G5 F#5 - E5 D5 | C#5 - A#4 C#5 B4 - - - |
`);

// --- The same lullaby at its own slow pace, sixteen bars, for the climax. ---
const LULLABY = melody(`
  F#5 - - - D5 - E5 - | F#5 - - - B4 - - - | A4 - - - F#4 - A4 - | E5 - - - - - . . |
  F#5 - - - D5 - E5 - | G5 - - - F#5 - E5 - | D5 - - - E5 - B4 - | C#5 - - - - - . . |
  D5 - - - E5 - F#5 - | E5 - - - C#5 - A4 - | C#5 - - - A4 - F#4 - | B4 - - - - - D5 - |
  B4 - - - D5 - G5 - | F#5 - - - E5 - D5 - | C#5 - - - A#4 - C#5 - | B4 - - - - - . . |
`);

// --- The intro: just the first notes of her lullaby, then strings rising. ---
const INTRO_BOX = melody(`
  F#5 - - - D5 - E5 - | F#5 - - - B4 - - - | A4 - - - F#4 - A4 - | E5 - - - - - . . |
  . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . |
`);
const INTRO_STRINGS = melody(`
  . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . |
  E4 - - - - - - - | G4 - - - - - - - | F#4 - - - - - - - | A#4 - - - C#5 - - - |
`);

// --- A: the fight. ---
const LEAD_A = melody(`
  B4 - - D5 - F#5 - B5 | A5 - G5 - F#5 - D5 - | F#5 - - A5 - D6 - C#6 | C#6 - - - A5 - E5 - |
  B5 - - A5 - F#5 - D5 | E5 - D5 - B4 - D5 - | E5 - G5 - B5 - E6 - | C#6 - - - A#5 - F#5 - |
  B4 - - D5 - F#5 - B5 | D6 - B5 - G5 - B5 - | A5 - F#5 - D5 - F#5 - | E5 - - - C#5 E5 A5 - |
  B5 - - D6 - B5 - G5 | G5 - E5 - B4 - E5 - | F#5 - A#5 - C#6 - E6 - | F#6 - - - - - . . |
`);

// --- The bridge: warm and aching, with her lullaby's opening turned major. ---
const BRIDGE = melody(`
  F#5 - - - - - A5 - | E5 - - - - - C#5 - | D5 - - - F#5 - B5 - | A5 - - - - - . . |
  B5 - - - A5 - G5 - | F#5 - - - D5 - F#5 - | G5 - - - F#5 - E5 - | E5 - - - - - . . |
  F#5 - D5 E5 F#5 - - - | E5 - C#5 D5 E5 - - - | D5 - B4 C#5 D5 - F#5 - | C#6 - - - A5 - - - |
  B5 - - - D6 - - - | C#6 - - - E6 - - - | D6 - - - - - - - | - - - - . . . . |
`);

// --- The duel: the brass calls, her lullaby answers; then they climb together. ---
const DUEL_CALL = melody(`
  E5 - G5 B5 E6 - D6 B5 | C#6 - A#5 C#6 F#6 - E6 C#6 | . . . . . . . . | . . . . . . . . |
  B5 - G5 B5 D6 - B5 G5 | C#6 - A5 C#6 E6 - C#6 A5 | . . . . . . . . | . . . . . . . . |
  G5 - - - F#5 - E5 - | F#5 - - - E5 - C#5 - | D6 - - - B5 - G5 - | E6 - - - C#6 - A5 - |
  B5 - - - G5 - E5 - | A#5 - - - C#6 - F#6 - | G6 - - - - - D6 - | G#5 - C6 - D#6 - G#6 - |
`);
const DUEL_ANSWER = melody(`
  . . . . . . . . | . . . . . . . . | F#5 - D5 E5 F#5 - B4 - | D5/C#5 B4 C#5 D5 F#5 - B5 - |
  . . . . . . . . | . . . . . . . . | A5 - F#5 G5 A5 - D5 - | F#5 - A#5 C#6 F#6 - E6 - |
  . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . |
  . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . |
`);

// --- The turn: back round into the fight. ---
const LEAD_TURN = melody(`
  E5 - - - C#5 - E5 - | A5 - - - - - . . | D5 - - - B4 - D5 - | G5 - - - - - . . |
  E5 - G5 - B5 - E6 - | B5 - - - - - - - | A#5 - - - - - - - | C#6 - - - - - . . |
`);

// Shifts every pitched track in a section, leaving the drums alone.
const DRUMS = ['kick', 'snare', 'hat', 'openHat', 'crash', 'boom'];
function shiftSection(section, semitones) {
  return Object.fromEntries(Object.entries(section).map(([track, steps]) => [track, DRUMS.includes(track) ? steps : transpose(steps, semitones)]));
}

// Held organ chords (root, third and fifth), `steps` steps per chord.
const organ = (chords, steps) => ({
  organ: sustained(chords, steps, 0, 3),
  organThird: sustained(chords, steps, 1, 4),
  organFifth: sustained(chords, steps, 2, 4),
});

const CLIMAX = {
  lead: LULLABY,
  leadLow: transpose(LULLABY, -12),
  choirTune: transpose(LULLABY, -12),
  strings: sustained(CLIMAX_CHORDS, BAR, 1, 5),
  ...organ(CLIMAX_CHORDS, BAR),
  choir: sustained(CLIMAX_CHORDS, BAR, 0, 4),
  arp: arpeggio(CLIMAX_CHORDS, BAR, 4, FLICKER),
  bass: chordLine(CLIMAX_CHORDS, BASS, 2),
  timpani: chordLine(CLIMAX_CHORDS, ONE_AND_THREE, 2),
  ...kit(16, { kick: KICK_BIG, snare: MARCH }),
  crash: crashes(16, 4),
};

export const TAPER_BATTLE_THEME = {
  title: 'Keeper of the Small Flames',
  bpm: 140,
  stepsPerBeat: 4,

  instruments: {
    lead: { ...BRASS, volume: 0.06 },
    // A buzzy synth doubling the brass an octave down, for that Heartache edge.
    leadLow: {
      wave: 'square', volume: 0.026, attack: 0.008, decay: 0.15, sustain: 0.7, release: 0.06, gate: 0.9,
      vibrato: { rate: 5.5, depth: 8 },
      filter: { type: 'lowpass', frequency: 2600 },
    },
    // Her music box, the same one from her house.
    musicBox: {
      wave: 'sine', volume: 0.11, attack: 0.004, decay: 0.9, sustain: 0.25, release: 1, gate: 0.8,
      vibrato: { rate: 5, depth: 6 },
      echo: { time: 0.64, feedback: 0.35, mix: 0.32 },
    },
    bells: { ...BELLS, volume: 0.055 },
    piano: { ...PIANO, volume: 0.07 },
    strings: { ...STRINGS, volume: 0.05 },
    choir: { ...CHOIR, volume: 0.04 },
    choirTune: { ...CHOIR, volume: 0.03 },
    organ: { ...ORGAN, volume: 0.03 },
    organThird: { ...ORGAN, volume: 0.02 },
    organFifth: { ...ORGAN, volume: 0.02 },
    // The flickering arpeggio: a short square pluck with a dotted-8th echo.
    arp: {
      wave: 'square', volume: 0.02, attack: 0.002, decay: 0.08, sustain: 0.2, release: 0.05, gate: 0.5,
      filter: { type: 'lowpass', frequency: 2800 },
      echo: { time: 0.32, feedback: 0.25, mix: 0.2 },
    },
    bass: { wave: 'sawtooth', volume: 0.11, attack: 0.003, decay: 0.08, sustain: 0.7, release: 0.03, gate: 0.8, filter: { type: 'lowpass', frequency: 650 } },
    lowStrings: { ...LOW_STRINGS, volume: 0.07 },
    timpani: { ...TIMPANI, volume: 0.13 },
    kick: { drum: 'kick', volume: 0.55 },
    snare: { drum: 'snare', volume: 0.27 },
    hat: { drum: 'hat', volume: 0.045 },
    openHat: { drum: 'openHat', volume: 0.055 },
    crash: { drum: 'crash', volume: 0.08 },
    boom: { drum: 'boom', volume: 0.35 },
  },

  sections: {
    // In the dark: her music box half-remembering the lullaby, the organ and
    // choir underneath, then strings rising and a snare roll into the fight.
    intro: {
      musicBox: INTRO_BOX,
      strings: INTRO_STRINGS,
      ...organ(INTRO_CHORDS, BAR),
      choir: sustained(INTRO_CHORDS, BAR, 0, 4),
      timpani: [...chordLine('Bm Bm G G Em Em', ON_ONE, 2), ...chordLine('F# F#', ROLL, 2)],
      snare: [...rest(7), ...SNARE_ROLL],
    },

    // The fight.
    A: {
      lead: LEAD_A,
      leadLow: transpose(LEAD_A, -12),
      arp: arpeggio(A_CHORDS, BAR, 4, FLICKER),
      bass: chordLine(A_CHORDS, BASS, 2),
      organThird: sustained(A_CHORDS, BAR, 1, 4),
      organFifth: sustained(A_CHORDS, BAR, 2, 4),
      ...kit(16),
      crash: crashes(16, 8),
    },

    // Her lullaby over the beat: first the strings and bells, gently; then
    // the brass takes it up.
    motif: {
      strings: [...MOTIF, ...transpose(MOTIF, -12)],
      bells: [...transpose(MOTIF, 12), ...rest(8)],
      lead: [...rest(8), ...MOTIF],
      leadLow: [...rest(8), ...transpose(MOTIF, -12)],
      choir: sustained(MOTIF_CHORDS, 8, 0, 4),
      organThird: sustained(MOTIF_CHORDS, 8, 1, 4),
      organFifth: sustained(MOTIF_CHORDS, 8, 2, 4),
      arp: arpeggio(MOTIF_CHORDS, 8, 4, FLICKER),
      bass: chordLine(MOTIF_CHORDS, HALF_BASS, 2),
      ...kit(16),
      crash: crashes(16, 8),
    },

    // D major and half-time: the strings sing, a piano ripples, and the
    // brass joins in the second half.
    bridge: {
      strings: BRIDGE,
      lead: [...rest(8), ...transpose(BRIDGE.slice(8 * BAR), -12)],
      piano: arpeggio(BRIDGE_CHORDS, BAR, 4, [0, 7, 12, 7, 'third', 7, 12, 7]),
      choir: sustained(BRIDGE_CHORDS, BAR, 0, 4),
      organThird: sustained(BRIDGE_CHORDS, BAR, 1, 4),
      lowStrings: chordLine(BRIDGE_CHORDS, OOM, 2),
      kick: repeat(HALF_KICK, 16),
      snare: [...repeat(HALF_SNARE, 15), ...hits('........x.x.xxxx')],
      hat: repeat(QUARTER_HAT, 16),
      crash: crashes(16, 8),
    },

    // Everything falls away but her music box and a slow heartbeat; then a
    // roll pulls the fight back in.
    hush: {
      musicBox: MOTIF,
      choir: sustained(LULLABY_CHORDS, 8, 0, 4),
      organThird: sustained(LULLABY_CHORDS, 8, 1, 4),
      boom: [...repeat(HEARTBEAT, 7), ...rest(1)],
      timpani: [...rest(7), ...chordLine('F#', ROLL, 2)],
      snare: [...rest(7), ...hits('....x.x. xxxxxxxx')],
    },

    // The brass calls and her lullaby answers, then they climb together
    // toward a new key.
    duel: {
      lead: DUEL_CALL,
      leadLow: transpose(DUEL_CALL, -12),
      bells: transpose(DUEL_ANSWER, 12),
      strings: DUEL_ANSWER,
      choirTune: [...rest(8), ...transpose(DUEL_CALL.slice(8 * BAR), -12)],
      choir: sustained(DUEL_CHORDS, BAR, 0, 4),
      ...organ(DUEL_CHORDS, BAR),
      arp: arpeggio(DUEL_CHORDS, BAR, 4, FLICKER),
      bass: chordLine(DUEL_CHORDS, BASS, 2),
      timpani: [...rest(8), ...chordLine(DUEL_CHORDS.split(' ').slice(8).join(' '), ONE_AND_THREE, 2)],
      ...kit(16),
      crash: crashes(16, 8),
    },

    // Up a step to C# minor: her whole lullaby, as loud as it gets.
    climax: shiftSection(CLIMAX, 2),

    // C# minor's A chord is B minor's too, so the music pivots on it and
    // winds back home to the fight.
    turn: {
      lead: LEAD_TURN,
      leadLow: transpose(LEAD_TURN, -12),
      choir: sustained(TURN_CHORDS, BAR, 0, 4),
      ...organ(TURN_CHORDS, BAR),
      bass: chordLine(TURN_CHORDS, HALF_BASS.concat(HALF_BASS), 2),
      timpani: [...chordLine('A A G G Em Em', ON_ONE, 2), ...chordLine('F# F#', ROLL, 2)],
      kick: [...repeat(HALF_KICK, 6), ...repeat(KICK, 2)],
      snare: [...repeat(HALF_SNARE, 6), ...SNARE, ...SNARE_ROLL],
      hat: repeat(QUARTER_HAT, 8),
      crash: crashes(8, 8),
    },
  },

  // The intro plays once; after that the whole fight loops.
  order: ['intro', 'A', 'motif', 'bridge', 'hush', 'duel', 'climax', 'turn'],
  loopFrom: 1,
};
