import {
  melody, hits, repeat, arpeggio, sustained, chordLine, transpose, rest as restBars,
  haddockPhrase, tight, midi, after as afterBars,
} from './parts/chapter5.js';

// "Minding the Light": Haddock's theme. He is the old walrus who looks after
// the coast's lights ("lightman", never "keeper"), and the song is him: slow,
// warm, gruff and kind, a little comic (the plodding bass trips over its
// own feet now and then), with something sad underneath that only shows when
// the major key gives way to its own minor. A low clarinet carries the
// tune like a concertina wheezing out a hymn, with a tuba growling it an
// octave under (an old walrus humming into his moustache); an oboe doubles
// it a third above, a harp strums, bowed basses plod with a grumble (a low
// note sliding up into each bar), a trombone harrumphs at the end of the
// phrases, and a hand bell rings the light's hour. Gruff outside, kind
// underneath: the oboe's tune and the minor bridge stay soft. Reference for the mood only: the warmth of Toby Fox's
// Snowdin shopkeepers, Koji Kondo's village tunes, a Cornish sea-song.
//
// HIS MOTIF (parts/chapter5.js, haddockPhrase): three notes sinking, then
// down to the low fifth: F# E D, A in D major; F E D, A in D minor. Long,
// short, long, longer. It opens the tune (bar 1 of A), sits in every key as
// the harmony changes (G: B A G, D in bar 3), turns minor in the bridge and
// is then said plainly on a lone bell at the end. The boss theme brings it
// back in its last section and the farewell plays it alone on a harp.
//
// D major, 4/4 at 62 (a bar is about 3.9 seconds); one step a 16th, 16 to a
// bar. The intro plays once (2 bars); then it loops from A, 40 bars, about
// 2m35s:
//
//   intro    2 bars  the harp and one bell; the clarinet and the tuba clear
//                    their throats
//   A        8 bars  THE TUNE: the motif, answered, on a low clarinet and
//                    the tuba an octave under, over harp and the grumbling
//                    plod; a rhyming second half
//   B        8 bars  the oboe sings a gentler tune over soft strings; the
//                    bell marks the hour
//   A2       8 bars  the tune again, clarinet and oboe in thirds, the
//                    trombone harrumphing at the end of each half
//   bridge   8 bars  the minor: the motif with its third flattened, slower,
//                    on violas and a lone harp; the hand bell far away
//   A3       8 bars  the tune home in D major, the whole band, soft; the
//                    last bar is the motif on the bell alone, in the
//                    minor, like a thought he did not finish

const BAR = 16;
const tune = (text) => melody(text, 2);   // each token an 8th: 8 to a bar
const rest = (bars) => restBars(bars, BAR);
const after = (bars, track) => afterBars(bars, track, BAR);
const fit = (name, section, bars) => tight('Minding the Light', name, section, bars, BAR);

// --- Harmony, a bar each ---
const A_CHORDS = 'D Bm G A D Bm Em A';
const B_CHORDS = 'G D Em Bm G D A A';
const BRIDGE_CHORDS = 'Dm Bb Gm A Dm Bb Gm A';
const INTRO_CHORDS = 'D D';

// --- THE TUNE. Bar 1 is the motif (F# E D, A); bar 3 is the motif in G. ---
const TUNE_A = tune(`
  F#4 - E4 D4 - - A3 -    D4 - F#4 B4 - - A4 -
  B4 - A4 G4 - - D4 -     E4 - G4 A4 - - - -
  F#4 - E4 D4 - - A3 -    D4 - F#4 B4 - - C#5 -
  B4 - A4 G4 - - E4 -     E4 - - D4 C#4 - A3 -
`);
// The gentler tune, the oboe's.
const TUNE_B = tune(`
  B4 - - D5 - - B4 -      A4 - - F#4 - - A4 -
  G4 - B4 - E5 - - D5     D5 - B4 - F#4 - - .
  B4 - D5 - G5 - - F#5    A5 - F#5 - D5 - - .
  E5 - C#5 - A4 - - .     C#5 - E5 - A4 - - -
`);
// The minor: the motif with its third flattened, slower to answer.
const TUNE_BRIDGE = tune(`
  F4 - E4 D4 - - A3 -     D4 - F4 Bb4 - - A4 -
  Bb4 - A4 G4 - - D4 -    E4 - G4 A4 - - - -
  A4 - D5 - F5 - - E5     D5 - Bb4 - F4 - - .
  G4 - Bb4 - D5 - - C5    E5 - C#5 - A4 - - -
`);
// The thirds over the tune for the oboe, in the repeat.
const THIRD_ABOVE = tune(`
  A4 - G4 F#4 - - D4 -    F#4 - A4 D5 - - C#5 -
  D5 - C#5 B4 - - G4 -    G4 - B4 C#5 - - - -
  A4 - G4 F#4 - - D4 -    F#4 - A4 D5 - - E5 -
  D5 - C#5 B4 - - G4 -    G4 - - F#4 E4 - C#4 -
`);
// The trombone's harrumph at the end of a phrase: a short grunt and a low
// one held, over the A chord.
const HARRUMPH = tune('. . . . E3 . A2 -');
const harrumphs = [...rest(3), ...HARRUMPH, ...rest(3), ...HARRUMPH];

// --- The band ---
// The plod: root, a stumble, the fifth, a step back. Plucked cellos, low.
const PLOD = [0, '.', '.', '.', 7, '.', '.', 0, 0, '.', '.', '.', 7, '.', '.', '.'];
const STRUM = [0, '.', 7, '.', 12, '.', 'tenth', '.', 12, '.', 7, '.', 'tenth', '.', 12, '.'];
const SOFT_STRUM = [0, '-', '-', '-', 7, '-', '-', '-', 12, '-', '-', '-', 7, '-', '-', '-'];
const strum = (chords) => arpeggio(chords, BAR, 3, STRUM);
const slow = (chords) => arpeggio(chords, BAR, 3, SOFT_STRUM);
const plod = (chords) => chordLine(chords, PLOD, 3);
// The grumble under the plod: a low note a semitone under the root sliding
// up into it, then the fifth below, bowed and short. Gruff, not bouncy.
const GRUMBLE = [-1, 0, '-', '-', '-', '-', '.', '.', -5, '-', '-', '-', '.', '.', '.', '.'];
const grumble = (chords) => chordLine(chords, GRUMBLE, 2);
// The hand bell rings the hour: a D at the top of the bar.
const BELL_HOUR = [midi('D6'), ...Array(15).fill('-')];
const bellEvery = (bars, n) => Array.from({ length: bars }, (_, i) => (i % n === n - 1 ? BELL_HOUR : rest(1))).flat();

// The motif said plainly on the bell, once, in the minor, at the very end.
const END_BELL = haddockPhrase('D6', { minor: true });

export const HADDOCK_THEME = {
  title: 'Minding the Light',
  bpm: 62,
  stepsPerBeat: 4,
  volume: 0.7,

  instruments: {
    // The concertina: a low clarinet.
    reed: { sample: 'clarinet', volume: 0.3, attack: 0.07, release: 0.45, reverb: 0.4, pan: -0.15, humanize: { time: 0.015, volume: 0.15 } },
    reedSoft: { sample: 'clarinet', volume: 0.15, attack: 0.5, release: 0.8, reverb: 0.45, pan: -0.2 },
    oboe: { sample: 'oboe', volume: 0.26, attack: 0.07, release: 0.4, reverb: 0.4, pan: 0.2, humanize: { time: 0.015, volume: 0.15 } },
    // The gruff voices: a tuba under the tune, a trombone's harrumph and
    // bowed basses grumbling.
    growl: { sample: 'tuba', volume: 0.26, attack: 0.06, release: 0.35, reverb: 0.3, pan: -0.05, humanize: { time: 0.015, volume: 0.15 } },
    harrumph: { sample: 'trombone', volume: 0.24, attack: 0.04, release: 0.3, reverb: 0.35, pan: 0.1, humanize: { time: 0.01, volume: 0.1 } },
    basses: { sample: 'bassSpic', volume: 0.3, release: 0.25, reverb: 0.25, humanize: { time: 0.012, volume: 0.15 } },
    harp: { sample: 'harp', volume: 0.22, ring: true, reverb: 0.45, pan: -0.3, humanize: { time: 0.012, volume: 0.2 } },
    harpSoft: { sample: 'harp', volume: 0.16, ring: true, reverb: 0.55, pan: -0.25, humanize: { time: 0.014, volume: 0.2 } },
    pad: { sample: 'violas', volume: 0.12, attack: 0.7, release: 1.2, reverb: 0.5, pan: 0.15 },
    violins: { sample: 'violins', volume: 0.1, attack: 0.9, release: 1.2, reverb: 0.55, pan: 0.3 },
    plod: { sample: 'cellosPizz', volume: 0.3, release: 0.25, reverb: 0.3, pan: -0.1, humanize: { time: 0.01, volume: 0.15 } },
    bell: { sample: 'chimes', volume: 0.16, ring: true, reverb: 0.6, pan: 0.3 },
    bellBright: { sample: 'glock', volume: 0.2, ring: true, reverb: 0.6, pan: 0.3, echo: { time: 0.45, feedback: 0.3, mix: 0.25 } },
    tick: { sample: 'frameDrum', drum: 'sample', volume: 0.1, ring: true, reverb: 0.25, humanize: { time: 0.006, volume: 0.25 } },
  },

  sections: {
    intro: fit('intro', {
      harp: slow(INTRO_CHORDS),
      bell: [...BELL_HOUR, ...rest(1)],
      reed: [...rest(1), '.', '.', '.', '.', '.', '.', '.', '.', midi('A3'), '-', midi('D4'), '-', '-', '-', '-', '-'],
      growl: [...rest(1), '.', '.', '.', '.', '.', '.', '.', '.', midi('A2'), '-', midi('D3'), '-', '-', '-', '-', '-'],
    }, 2),

    // THE TUNE on the low clarinet and the tuba, over harp and the grumble.
    A: fit('A', {
      reed: TUNE_A,
      growl: transpose(TUNE_A, -12),
      harp: strum(A_CHORDS),
      plod: plod(A_CHORDS),
      basses: grumble(A_CHORDS),
      pad: sustained(A_CHORDS, BAR, 2, 4),
      bell: bellEvery(8, 8),
    }, 8),

    // The oboe's gentler tune over strings; the bell marks the hour.
    B: fit('B', {
      oboe: TUNE_B,
      reedSoft: sustained(B_CHORDS, BAR, 1, 4),
      harp: slow(B_CHORDS),
      pad: sustained(B_CHORDS, BAR, 0, 4),
      violins: after(2, sustained(B_CHORDS, BAR, 2, 4)),
      plod: chordLine(B_CHORDS, [0, '.', '.', '.', '.', '.', '.', '.', 7, '.', '.', '.', '.', '.', '.', '.'], 3),
      bell: bellEvery(8, 4),
    }, 8),

    // The tune again, the oboe a third above, the trombone harrumphing.
    A2: fit('A2', {
      reed: TUNE_A,
      growl: transpose(TUNE_A, -12),
      oboe: THIRD_ABOVE,
      harrumph: harrumphs,
      harp: strum(A_CHORDS),
      plod: plod(A_CHORDS),
      basses: grumble(A_CHORDS),
      pad: sustained(A_CHORDS, BAR, 2, 4),
      violins: sustained(A_CHORDS, BAR, 0, 4),
      tick: repeat(hits('x...............'), 8),
      bell: bellEvery(8, 8),
    }, 8),

    // The minor: slower, the sadness showing.
    bridge: fit('bridge', {
      pad: TUNE_BRIDGE,
      oboe: after(4, transpose(TUNE_BRIDGE, 12)),
      reedSoft: sustained(BRIDGE_CHORDS, BAR, 1, 4),
      violins: sustained(BRIDGE_CHORDS, BAR, 2, 4),
      harpSoft: slow(BRIDGE_CHORDS),
      bell: bellEvery(8, 8),
    }, 8),

    // Home in D major, soft; the last bar is the bell saying the motif in
    // the minor.
    A3: fit('A3', {
      reed: [...TUNE_A.slice(0, 7 * BAR), ...rest(1)],
      growl: [...transpose(TUNE_A, -12).slice(0, 7 * BAR), ...rest(1)],
      oboe: [...THIRD_ABOVE.slice(0, 7 * BAR), ...rest(1)],
      harrumph: [...rest(3), ...HARRUMPH, ...rest(4)],
      harp: strum(A_CHORDS),
      plod: [...plod(A_CHORDS).slice(0, 7 * BAR), ...rest(1)],
      basses: [...grumble(A_CHORDS).slice(0, 7 * BAR), ...rest(1)],
      pad: sustained(A_CHORDS, BAR, 2, 4),
      violins: sustained(A_CHORDS, BAR, 0, 4),
      bellBright: [...rest(7), ...END_BELL],
    }, 8),
  },

  order: ['intro', 'A', 'B', 'A2', 'bridge', 'A3'],
  loopFrom: 1,
};
