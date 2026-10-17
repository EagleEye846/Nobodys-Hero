// Helpers for writing songs as text. Every helper returns an array with one
// entry per step: a MIDI note number to start a note, HOLD to keep the previous
// note sounding, REST for silence, or HIT for a drum hit.
export const HOLD = '-';
export const REST = '.';
export const HIT = 'x';

const NOTE_OFFSETS = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

// 'C4' is middle C, 'F#3', 'Bb5' and so on.
export function midi(name) {
  const match = name.match(/^([A-G])([#b]?)(-?\d)$/);
  if (!match) throw new Error(`Can't read the note '${name}'`);
  const [, letter, accidental, octave] = match;
  const shift = accidental === '#' ? 1 : accidental === 'b' ? -1 : 0;
  return 12 * (Number(octave) + 1) + NOTE_OFFSETS[letter] + shift;
}

// A tune as space-separated tokens, each lasting `steps` steps. A note name
// starts a note, '-' holds the one before, '.' rests, and 'A/B' splits the
// token into quicker notes. '|' marks bar lines and is ignored.
export function melody(text, steps = 2) {
  const out = [];
  for (const token of text.split(/\s+/)) {
    if (!token || token === '|') continue;
    const parts = token.split('/');
    const each = steps / parts.length;
    if (!Number.isInteger(each)) throw new Error(`'${token}' can't be split evenly into ${steps} steps`);
    for (const part of parts) {
      const held = part === REST ? REST : HOLD;
      out.push(part === HOLD || part === REST ? part : midi(part));
      for (let i = 1; i < each; i++) out.push(held);
    }
  }
  return out;
}

// 'Dm' is D minor, 'Bb' is B-flat major, and so on.
function chord(symbol) {
  const match = symbol.match(/^([A-G][#b]?)(m?)$/);
  if (!match) throw new Error(`Can't read the chord '${symbol}'`);
  return { root: midi(`${match[1]}0`) - 12, third: match[2] ? 3 : 4 };
}

function eachChord(chords, build) {
  return chords.split(/\s+/).filter(Boolean).flatMap((symbol) => build(chord(symbol)));
}

const noteIn = (octave, pitchClass) => 12 * (octave + 1) + pitchClass;

// One pattern per chord, written as semitones above the chord's root, or
// 'third' for the chord's own third and 'tenth' for that third an octave up
// ('-' and '.' work as in melody()). One
// pattern entry per step. Good for basslines and chord stabs.
export function chordLine(chords, pattern, octave = 2) {
  return eachChord(chords, ({ root, third }) => pattern.map((p) => {
    if (p === 'third') return noteIn(octave, root) + third;
    if (p === 'tenth') return noteIn(octave, root) + third + 12;
    return typeof p === 'number' ? noteIn(octave, root) + p : p;
  }));
}

// The same notes, shifted by some semitones (12 is an octave).
export function transpose(steps, semitones) {
  return steps.map((step) => (typeof step === 'number' ? step + semitones : step));
}

// Quick broken chords: cycles through `shape` (semitones, or 'third' for the
// chord's own third) one note per step, for `steps` steps per chord.
export function arpeggio(chords, steps, octave = 4, shape = [0, 'third', 7, 12]) {
  return eachChord(chords, ({ root, third }) => Array.from({ length: steps }, (_, i) => {
    const interval = shape[i % shape.length];
    if (interval === REST || interval === HOLD) return interval;
    return noteIn(octave, root) + (interval === 'third' ? third : interval === 'tenth' ? third + 12 : interval);
  }));
}

// One held note per chord: voice 0 is the root, 1 the third, 2 the fifth.
export function sustained(chords, steps, voice, octave = 3) {
  return eachChord(chords, ({ root, third }) => {
    const note = noteIn(octave, root) + [0, third, 7][voice];
    return [note, ...Array(steps - 1).fill(HOLD)];
  });
}

// Drum hits: 'x' for a hit and '.' for nothing, one character per step.
// Spaces and '|' are ignored.
export function hits(text) {
  return [...text.replace(/[\s|]/g, '')].map((c) => (c === 'x' ? HIT : REST));
}

export function repeat(steps, times) {
  return Array.from({ length: times }, () => steps).flat();
}

// A tune with lyrics, for songs whose words show on screen (the credits). Like
// melody(), but a note can carry a syllable after a colon: 'D5:light' or
// 'F#5:lit-' (a syllable ending in '-' joins the next one, "lit-tle"). Notes
// without one are just played. Returns the notes, and each syllable with the
// step it starts on.
export function sung(text, steps = 1) {
  const syllables = [];
  let at = 0;
  const plain = text.split(/\s+/).filter((token) => token && token !== '|').map((token) => {
    const parts = token.split('/');
    return parts.map((part) => {
      const [note, syllable] = part.split(':');
      if (syllable) syllables.push({ step: at, text: syllable });
      at += steps / parts.length;
      return note;
    }).join('/');
  });
  return { notes: melody(plain.join(' '), steps), syllables };
}
