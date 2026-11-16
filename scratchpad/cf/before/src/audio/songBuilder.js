import { sung } from './notation.js';

// Builds a song with on-screen lyrics (like the credits song) one part at a
// time, keeping every track the same length and noting the step each
// syllable lands on.
//
//   const song = new SongBuilder('My Song', ['voice', 'piano'], 8, 'voice');
//   song.part(4, { piano: ... });                                 // no words
//   song.part(8, { piano: ... }, [lyricLine(tune, 'Hel-lo there'), 2]);
//   ... then use song.tracks as a section, and song.lyrics as `lyrics`.

// A lyric line sung to a tune: `shape` is the tune (one token per step), and
// the words' syllables go onto its notes in order ('lit-tle' is two). A note
// ending in '~' is played without a syllable.
export function lyricLine(shape, words) {
  const syllables = words.split(' ').flatMap((word) => word.split(/(?<=-)/));
  let i = 0;
  const text = shape.split(/\s+/).filter(Boolean).map((token) => {
    if (token === '|' || token === '-' || token === '.') return token;
    if (token.endsWith('~')) return token.slice(0, -1);
    if (i >= syllables.length) throw new Error(`"${words}" has fewer syllables than its tune has notes`);
    return `${token}:${syllables[i++]}`;
  }).join(' ');
  if (i !== syllables.length) throw new Error(`"${words}" has more syllables than its tune has notes`);
  return sung(text);
}

export class SongBuilder {
  // `trackNames` are every track in the song; `stepsPerBar` is how long a bar
  // is; `voiceTrack` is the one that plays the tune the words are sung to.
  constructor(title, trackNames, stepsPerBar, voiceTrack = 'voice') {
    this.title = title;
    this.voiceTrack = voiceTrack;
    this.bar = stepsPerBar;
    this.tracks = Object.fromEntries(trackNames.map((name) => [name, []]));
    this.lyrics = [];
    this.at = 0;
  }

  rest(bars) {
    return Array(bars * this.bar).fill('.');
  }

  // One part, `bars` long. `tracks` are its instruments (any left out rest).
  // `vocal` is the tune the words are sung to, on the voice track: a list of
  // lyricLine()s and rests (a number of bars).
  part(bars, tracks, vocal = null) {
    const length = bars * this.bar;
    const all = { ...tracks };
    if (vocal) {
      const voice = [];
      for (const entry of vocal) {
        if (typeof entry === 'number') {
          voice.push(...this.rest(entry));
          continue;
        }
        const start = this.at + voice.length;
        // A passage with no words ({ notes, syllables: [] }) just plays.
        if (entry.syllables.length) this.lyrics.push({
          start,
          end: start + entry.notes.length,
          syllables: entry.syllables.map((s) => ({ step: start + s.step, text: s.text })),
        });
        voice.push(...entry.notes);
      }
      all[this.voiceTrack] = voice;
    }
    for (const [name, steps] of Object.entries(all)) {
      if (!this.tracks[name]) throw new Error(`${this.title}: no track called '${name}'`);
      if (steps.length !== length) throw new Error(`${this.title}: '${name}' is ${steps.length} steps in a ${bars}-bar part`);
    }
    for (const [name, steps] of Object.entries(this.tracks)) steps.push(...(all[name] ?? this.rest(bars)));
    this.at += length;
  }
}
