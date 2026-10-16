import { melody, chordLine, transpose, hits, repeat } from '../../audio/notation.js';

// "Cotton Clash": the battle theme. An original piece leaning into the style of
// Toby Fox's "Rude Buster" and "From Now On": fast and driving, a brassy
// sawtooth lead doubled an octave below, a syncopated bass, off-beat chord
// stabs and a busy kit. E minor, lifting into a hopeful major-sounding second
// half. 160 BPM, one step is a 16th note.

const A_CHORDS = 'Em C D B Em C D B';
const B_CHORDS = 'C D Em G C D B B';

// Syncopated octave bass with a bluesy flat-seventh pickup, as semitones above each chord's root.
const BASS = [0, '.', 12, '.', 0, 12, '.', 0, '.', 0, 12, '.', 7, '-', 10, 12];
// Chord stabs punch the off-beats.
const STAB_THIRD = ['.', '.', 'third', '.', '.', '.', 'third', '.', '.', '.', 'third', '.', '.', 'third', '.', '.'];
const STAB_FIFTH = STAB_THIRD.map((step) => (step === 'third' ? 7 : step));

const KICK = hits('x.....x. x.x...x.');
const SNARE = hits('....x... ....x..x');
const HAT = hits('xxxxxxxx xxxxxxxx');
const OPEN_HAT = hits('..x...x. ..x...x.');
const SNARE_FILL = hits('x.x.x.x. xxxxxxxx');

// Each token is an 8th note; 'A/B' is two 16ths.
const LEAD_A = melody(`
  E5 - - G5 - B5 A5 G5 | E5 - - - G5/A5 G5 E5 D5 |
  F#5 - - A5 - D6 C#6 A5 | B5 - - - D#5/F#5 B5 A5 F#5 |
  E5 - G5 B5 - E6 D6 B5 | C6 - B5 G5 - E5 G5 A5 |
  A5 - F#5 D5 - F#5 A5 D6 | D#6 - - - B5 - F#5/A5 B5
`);

// The lift: brighter chords and a melody that climbs.
const LEAD_B = melody(`
  G5 - - E5 G5 - C6 - | A5 - - F#5 A5 - D6 - |
  B5 - - - G5 - E5 - | D6 - - B5 - G5 - D5 |
  E6 - - C6 - G5 E5 G5 | F#6 - - D6 - A5 F#5 A5 |
  B5 - D#6 - F#6 - D#6 - | B5 - - - . . F#5/G5 A5
`);

const SILENT_BARS = melody('. . . . . . . . | . . . . . . . .');

function section(chords, lead, snare) {
  return {
    lead,
    leadLow: transpose(lead, -12),
    stabThird: chordLine(chords, STAB_THIRD, 4),
    stabFifth: chordLine(chords, STAB_FIFTH, 4),
    bass: chordLine(chords, BASS, 2),
    kick: repeat(KICK, 8),
    snare,
    hat: repeat(HAT, 8),
    openHat: repeat(OPEN_HAT, 8),
  };
}

const STAB = { wave: 'sawtooth', volume: 0.028, attack: 0.003, decay: 0.06, sustain: 0.3, release: 0.03, gate: 0.5, filter: { type: 'lowpass', frequency: 3000 } };

export const BATTLE_THEME = {
  title: 'Cotton Clash',
  bpm: 160,
  stepsPerBeat: 4,

  instruments: {
    lead: {
      wave: 'sawtooth',
      volume: 0.05,
      attack: 0.01,
      decay: 0.15,
      sustain: 0.7,
      release: 0.06,
      gate: 0.9,
      vibrato: { rate: 5.5, depth: 12 },
      filter: { type: 'lowpass', frequency: 4000 },
    },
    leadLow: { wave: 'square', volume: 0.03, attack: 0.01, decay: 0.15, sustain: 0.7, release: 0.06, gate: 0.9, filter: { type: 'lowpass', frequency: 2500 } },
    stabThird: STAB,
    stabFifth: STAB,
    bass: { wave: 'sawtooth', volume: 0.13, attack: 0.003, decay: 0.08, sustain: 0.7, release: 0.03, gate: 0.8, filter: { type: 'lowpass', frequency: 700 } },
    kick: { drum: 'kick', volume: 0.6 },
    snare: { drum: 'snare', volume: 0.3 },
    hat: { drum: 'hat', volume: 0.05 },
    openHat: { drum: 'openHat', volume: 0.07 },
  },

  sections: {
    // Two bars of bass, stabs and drums building up, then straight in.
    intro: {
      lead: SILENT_BARS,
      leadLow: SILENT_BARS,
      stabThird: chordLine('Em B', STAB_THIRD, 4),
      stabFifth: chordLine('Em B', STAB_FIFTH, 4),
      bass: chordLine('Em B', BASS, 2),
      kick: repeat(KICK, 2),
      snare: [...hits('................'), ...SNARE_FILL],
      hat: repeat(HAT, 2),
      openHat: repeat(OPEN_HAT, 2),
    },
    A: section(A_CHORDS, LEAD_A, repeat(SNARE, 8)),
    B: section(B_CHORDS, LEAD_B, [...repeat(SNARE, 7), ...SNARE_FILL]),
  },

  // The intro plays once; after that A and B loop.
  order: ['intro', 'A', 'B'],
  loopFrom: 1,
};
