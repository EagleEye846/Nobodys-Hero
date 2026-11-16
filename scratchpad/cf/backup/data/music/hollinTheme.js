import { melody } from '../../audio/notation.js';
import {
  rest as restBars, held, until as untilBars, transpose, midi, onNotes, heldNotes, patter, cellsFor, drops,
} from './parts/chapter3.js';

// "Hush, Little Hollin": the theme of Hollin, the woodcutters' old village
// at the end of the Hushwood, left empty "when the Hush came", when
// Bramble's grandad was young (notes/docs/chapter-3-hushwood.md). Empty
// cottages, a well in the square, a scarecrow still guarding fields nobody
// plants. Melancholy and tender: a lullaby somebody's music box still
// knows, and grandad's stories. But the beast is near, so there's a held
// breath of dread under it.
//
// Still written the Chapter 3 way (Larkin's City of Tears, by way of a
// nursery): a harp rocks three notes, G D A, a stack of fifths, like a
// cradle (the low G, then A D A D), and never changes, except that on a D
// chord the low G steps down to F# out of its way. The bass moves under it,
// so the same cradle is G with the ninth, E minor eleven, C six-nine, D with
// its fourth, and two borrowed chords: C minor (the minor four, the grief in
// a major key, its sixth the Dorian A) and E flat (the flat six, with the
// cradle's A on top as its sharp eleventh: a dream going wrong).
//
// The lullaby is plain enough to hum: a rocking 3-2-3, down to the sixth; a
// step lower, and the ninth over D left open; then up to the ninth over C,
// down through C minor, and the third. First on the music box, then a high
// violin with the music box answering in its rests. In the middle grandad
// tells the story on the cellos, low: it starts like a fairy tale and turns
// at the E flat, and under it, so softly it's nearly not there, the beast's
// claws (G Bb C#, "Tooth and Tatter") turn the E flat into a German sixth
// whose C# pounces onto the D (the claws resolving, like a door clicking
// shut). Then down the well: the cradle stops, and the first three notes
// of the lullaby come back up on bowed vibes, with an echo. Last, the
// lullaby again, and the music box runs down: notes come late, then not at
// all, and the last one never comes. Only a low C# trembling where the G
// should be, until someone winds it up again (the loop).
//
// G major, with C minor and E flat borrowed. 3/4 at 66 BPM, one step a
// 16th: a bar is 12 steps and 2.7 seconds. The cradle plays once (11s); then
// it loops from A, 36 bars, 1m38s:
//
//   cradle   4 bars  the harp rocking alone, a low G, the music box wound
//   A        8 bars  the lullaby on the music box over the cradle
//   A2       8 bars  a high violin sings it, the music box answering in its
//                    rests, plucked violins rocking, the violas humming
//   B        8 bars  grandad's story on the cellos; E flat; the claws
//                    hidden in a tremolo, pouncing onto D; a heartbeat
//   well     4 bars  the cradle stops: the lullaby's first notes on bowed
//                    vibes, echoing up the well; a drip
//   A3       8 bars  the lullaby, violin and music box in octaves; then the
//                    music box alone, running down before the end

const BAR = 12;                                    // a bar of 3/4, in 16ths
const tune = (text) => melody(text, 2);            // each token an 8th: six to a bar
const rest = (bars) => restBars(bars, BAR);
const until = (bars, track) => untilBars(bars, track, BAR);

// --- The cradle: G D A on the harp, the low G and then A D A D. ---
const CRADLE = [0, '.', '.', '.', 2, '.', 1, '.', 2, '.', 1, '.'];
const CRADLE_TABLE = { D: 'F#3 D4 A4' };
const cradle = (chords) => patter(cellsFor(chords, CRADLE_TABLE, 'G3 D4 A4'), CRADLE);

// --- The harmony: what the bass makes of the cradle, a bar each. ---
const A_CHORDS = 'G Em C D G C Cm G';
const A_BASS = 'G2 E2 C2 D2 G2 C2 C2 G2';
const B_CHORDS = 'Em Em C C Eb Eb D D';
const B_BASS = 'E2 E2 C2 C2 Eb2 Eb2 D2 D2';
// The bass: the cellos plucked on the one; and held, bowed, all bar.
const ONE = [0, ...Array(BAR - 1).fill('.')];
const plucked = (names) => onNotes(names, ONE);
const bowed = (names) => heldNotes(names, BAR);

// --- The lullaby (each token an 8th). Rocking 3-2-3, down to the sixth; a
// step lower, and the ninth over D left open. Then the ninth over C, down
// through C minor's sixth, and the third. ---
const LULLABY = tune(`
  B4 - A4 - B4 - | G4 - - - E4 - | A4 - G4 - A4 - | E4 - - - - - |
  B4 - A4 - B4 - | D5 - - - C5 - | G4 - - - A4 - | B4 - - - - - |
`);
// The music box plays it an octave up.
const BOX = transpose(LULLABY, 12);
// The music box answering the violin in its long notes (bars 4 and 8).
const BOX_ANSWERS = tune(`
  . . . . . . | . . . . . . | . . . . . . | . . A5 - F#5 - |
  . . . . . . | . . . . . . | . . . . . . | . . D6 - B5 - |
`);
// The violas humming the chords' thirds (C minor's is the E flat).
const HUM = bowed('B3 G3 E3 F#3 B3 E3 Eb3 D3');

// --- B: grandad's story, on the cellos, low. Like a fairy tale (up the
// E minor chord), the major seventh over C; then the E flat, the sharp
// eleventh hanging, and up to D's fifth: "and then...". ---
const STORY = tune(`
  E3 - G3 - B3 - | A3 - - - G3 - | E3 - G3 - C4 - | B3 - - - - - |
  Bb3 - - - G3 - | A3 - - - - - | F#3 - - - G3 - | A3 - - - - - |
`);
// The claws, hidden: G Bb over the E flat, the C# (its German sixth), and
// the pounce onto D.
const CLAWS = tune(`
  . . . . . . | . . . . . . | . . . . . . | . . . . . . |
  G2 - - - Bb2 - | C#3 - - - - - | D3 - - - - - | . . . . . . |
`);
// A heartbeat on D, twice.
const HEART = [midi('D3'), '.', '.', midi('D3'), ...Array(BAR - 4).fill('.')];

// --- The well: the lullaby's first three notes, slowed right down. ---
const WELL = tune('B5 - - - - - | A5 - - - - - | B5 - - - - - | . . . . . .');

// --- A3: the music box running down. The tune's second half, late and
// with notes missing, and the last one never comes. ---
const RUN_DOWN = tune(`
  B5 - A5 - B5 - | D6 - - - - - | . . G5 - - - | . . . . . . |
`);

export const HOLLIN_THEME = {
  title: 'Hush, Little Hollin',
  bpm: 66,
  stepsPerBeat: 4,
  // An area theme, and a quiet one.
  volume: 0.72,

  instruments: {
    // The cradle: a harp, close, left to ring.
    harp: { sample: 'harp', volume: 0.15, ring: true, reverb: 0.55, pan: -0.25, humanize: { time: 0.014, volume: 0.2 } },
    // Plucked violins rocking with it an octave up, for the second verse.
    pizz: { sample: 'violinsPizz', volume: 0.09, ring: true, reverb: 0.5, pan: 0.3, humanize: { time: 0.01, volume: 0.25 } },
    // The music box: a glockenspiel, soft, with a little echo.
    musicBox: { sample: 'glock', volume: 0.36, ring: true, reverb: 0.55, pan: 0.2, echo: { time: 0.45, feedback: 0.28, mix: 0.25 } },
    violin: { sample: 'soloViolin', volume: 0.36, attack: 0.12, release: 0.8, reverb: 0.6, pan: 0.15, humanize: { time: 0.012, volume: 0.1 } },
    // Grandad's voice: the cellos, warm and low.
    story: { sample: 'cellos', volume: 0.3, attack: 0.12, release: 0.8, reverb: 0.5, pan: -0.15, humanize: { time: 0.015, volume: 0.1 } },
    // Where a choir would hum: the viola section, bowed so softly it's mostly air.
    hum: { sample: 'violas', volume: 0.1, attack: 1.2, release: 1.6, reverb: 0.7, pan: 0.1 },
    // The bass, plucked, and bowed.
    plucked: { sample: 'cellosPizz', volume: 0.22, release: 0.6, reverb: 0.4, pan: -0.1, humanize: { time: 0.01, volume: 0.15 } },
    low: { sample: 'cellos', volume: 0.09, attack: 0.7, release: 1.2, reverb: 0.45, pan: -0.1 },
    // The dread: the claws in a tremolo so soft it's nearly not there, and
    // a ringing high up.
    claws: { sample: 'cellosTrem', volume: 0.12, attack: 0.4, release: 1, reverb: 0.5, pan: -0.3 },
    ringing: { sample: 'violinsTrem', volume: 0.05, attack: 1.8, release: 1.5, reverb: 0.6, pan: 0.3 },
    heart: { sample: 'timpani', volume: 0.16, ring: true, reverb: 0.45 },
    // Down the well: bowed vibes, echoing.
    well: { sample: 'vibesBowed', volume: 0.32, attack: 0.3, release: 1.5, reverb: 0.8, pan: 0.2, echo: { time: 0.9, feedback: 0.45, mix: 0.4 } },
    drip: { sample: 'grandPiano', volume: 0.07, ring: true, reverb: 0.75, pan: 0.4, humanize: { time: 0.02, volume: 0.3 } },
  },

  sections: {
    // The cradle alone, a low G, and the music box wound: two notes.
    cradle: {
      harp: cradle('G G G G'),
      plucked: [...plucked('G2'), ...rest(1), ...plucked('G2'), ...rest(1)],
      low: bowed('G2 G2 G2 G2'),
      musicBox: [...rest(2), ...tune('D6 - - - - - | . . G5 - - -')],
    },

    // The lullaby on the music box over the cradle.
    A: {
      harp: cradle(A_CHORDS),
      musicBox: BOX,
      plucked: plucked(A_BASS),
      low: bowed(A_BASS),
    },

    // A high violin sings it; the music box answers in its long notes;
    // plucked violins rock with the harp; the violas hum.
    A2: {
      harp: cradle(A_CHORDS),
      pizz: transpose(cradle(A_CHORDS), 12),
      violin: transpose(LULLABY, 12),
      musicBox: BOX_ANSWERS,
      hum: HUM,
      plucked: plucked(A_BASS),
      low: bowed(A_BASS),
    },

    // Grandad's story on the cellos, low. It turns at the E flat; under it
    // the claws, hidden in a tremolo, pounce onto D; a ringing high up, and
    // a heartbeat, twice.
    B: {
      harp: cradle(B_CHORDS),
      story: STORY,
      claws: CLAWS,
      plucked: plucked(B_BASS),
      low: bowed(B_BASS),
      ringing: [...rest(4), ...heldNotes('D6 D6', 2 * BAR)],
      heart: [...rest(6), ...HEART, ...HEART],
    },

    // Down the well: the cradle stops; the lullaby's first notes on bowed
    // vibes, echoing; a low G; a drip.
    well: {
      well: WELL,
      low: bowed('G2 G2 G2 G2'),
      drip: drops('G G G G', BAR, 0.12, 4, 3),
    },

    // The lullaby with the violin and music box in octaves; then the music
    // box alone, running down, the cradle thinning with it; and a low C#
    // trembling where the G should be.
    A3: {
      musicBox: [...BOX.slice(0, 4 * BAR), ...RUN_DOWN],
      violin: until(4, LULLABY),
      hum: until(4, HUM),
      harp: [...cradle(A_CHORDS).slice(0, 6 * BAR), midi('G3'), ...Array(2 * BAR - 1).fill('.')],
      plucked: until(6, plucked(A_BASS)),
      low: [...bowed(A_BASS).slice(0, 6 * BAR), ...held(midi('G2'), BAR), ...rest(1)],
      claws: [...rest(7), ...held(midi('C#3'), BAR)],
    },
  },

  // The cradle plays once; then the lullaby goes round from A.
  order: ['cradle', 'A', 'A2', 'B', 'well', 'A3'],
  loopFrom: 1,
};
