// Shared pieces of the star guardians' songs (not songs themselves:
// tools/serve.py only lists the files directly in src/data/music/). A star
// guardian is whatever a fallen star shard woke up and now keeps: the
// Figurehead on the ghost ship in chapter 5 is the first ("Star Aboard",
// figureheadBattleTheme.js). Each later chapter's guardian shares this one
// motif, in its own key, speed and colour, so the player hears the same star
// falling every time and knows what they've found.
//
//   THE FALLING STAR (4 notes): the high tonic, down to the fifth, a
//     semitone slip to the flat fifth, then down a tritone to land on the
//     tonic. In C: C6 G5 F#5 C5. The first fall (an octave to a fifth) is
//     the star dropping clean; the slip is the crack in it, the wrongness
//     the shard puts into whatever it lands in; the tritone drop is the
//     impact. Rhythm: quick, quick, a breath, long (STAR_LENGTHS, in 8ths:
//     1 1 2 4, or 1 1 2 2 to fit a 3/4 bar). Nothing else in the game uses
//     the octave, fifth, flat-fifth, tonic fall, so keep the shape exact;
//     change the key, the tempo, the instruments, the octave.
//
//   THE RISING STAR (the same, upside down: tonic, flat fifth, fifth,
//     octave): kept back for the true ending, when a shard is taken home
//     instead of guarded. Don't spend it in a fight.
//
//   HOW THE FIRST ONE USES IT: on a music box at the very start; as the
//     first bar of the Figurehead's hook; as the call in her call and
//     laugh; slowed right down in the quiet middle; and at the very end it
//     is the only thing that lands on the home note the ship's shanty never
//     reaches (the ship never made port; the star took it).
//
// starFall('C5') gives the motif as steps for a track (C6 G5 F#5 C5, an
// 8th a token on a 16th-note grid). starNotes('C5') gives just the notes.

import { midi } from '../../../audio/notation.js';

// Semitones from the tonic.
export const STAR_STEPS = [12, 7, 6, 0];
export const RISING_STAR_STEPS = [0, 6, 7, 12];
// How long each note lasts, in 8ths: quick, quick, a breath, long.
export const STAR_LENGTHS = [1, 1, 2, 4];
// The same, cut to fit one 3/4 bar.
export const STAR_LENGTHS_WALTZ = [1, 1, 2, 2];

// The four notes over the tonic `tonic` ('C5' gives C6 G5 F#5 C5).
export const starNotes = (tonic, steps = STAR_STEPS) => {
  const base = typeof tonic === 'number' ? tonic : midi(tonic);
  return steps.map((s) => base + s);
};

// The motif laid out as steps for a track: each note held `lengths[i] *
// unit` steps (unit 2: the lengths are 8ths on a 16th-note grid).
export function starFall(tonic, { lengths = STAR_LENGTHS, unit = 2, steps = STAR_STEPS } = {}) {
  const out = [];
  starNotes(tonic, steps).forEach((note, i) => {
    out.push(note);
    for (let k = 1; k < lengths[i] * unit; k++) out.push('-');
  });
  return out;
}

// The motif squeezed into a bar of any length (a carousel spinning up):
// the notes fall at 0, a sixth, a third and two thirds of the way through.
export function starIn(tonic, length, steps = STAR_STEPS) {
  const notes = starNotes(tonic, steps);
  const at = [0, Math.round(length / 6), Math.round(length / 3), Math.round((2 * length) / 3)];
  const out = Array(length).fill('-');
  at.forEach((p, i) => { out[p] = notes[i]; });
  return out;
}
