import { melody, midi, hits, transpose } from '../../audio/notation.js';

// "Everything Falls Somewhere": the secret junk shop of Rummage, the raccoon
// in the hollow trunk off the Gorge (Rummage's Hollow), who catches
// everything that falls off the mountain and sells the very good bits. A
// shop theme in the spirit of Toby Fox's shops: a little tune that loops
// without ever getting tiring, a bit cheeky, a bit sneaky, swung. All real
// recordings (VSCO 2 and VCSL, sampleSets.js), no synth presets: a tuba
// bouncing under it all (the bassoon we don't have, a size up), plucked
// cellos on the off beats, a clarinet tiptoeing the tune, a glockenspiel
// for the shiny things, and junk: a tom, a high drum, a soft snare and
// wine glasses clattering like Rummage digging through his pile.
//
// His motif is a sniff: a note, and the half step under it, quick (D#5 E5
// in the tiptoe; D#6 E6 when he finds something). The tune leaves gaps
// after each tiptoe, and in the second time round the junk answers in them.
// The tiptoe is A minor over a line cliche, the bass creeping down by half
// steps (A, G#, G, F#, F, E): the oldest sneaking-about sound there is.
// The chorus is C major, a ragtime circle (C, A7, Dm, G7), "look what I
// found". In the middle he digs: clarinet runs up into the pile, then a
// clatter, three times, then he finds it (a glockenspiel going up).
// 4/4 swung, at 112 BPM; one step is a triplet 8th, so a bar is 12 steps
// and a swung pair of 8ths is 2 steps then 1. The intro plays once (4.3s);
// then it loops from A, 40 bars, about 1m26s:
//
//   intro  2 bars  the tuba sneaks in, the brushes, a sniff
//   A      8 bars  the tiptoe on the clarinet, A minor, the bass creeping
//                  down by half steps
//   A2     8 bars  again, with plucked violins on the tune and the junk
//                  answering in the gaps; it turns to G7 for the chorus
//   B      8 bars  C major: the glockenspiel on the tune, plucked violins an
//                  octave down, the clarinet holding the guide tones, claps
//   C      8 bars  he digs: clarinet runs into the pile, then a clatter, three
//                  times; then E7, and "found it!" up the glockenspiel
//   B2     8 bars  the chorus with everyone, the clarinet on the tune an
//                  octave under the glockenspiel, horns; it ends on E7 to
//                  go round

// One step is a triplet 8th: a bar of 4/4 is 12 of them.
const BAR = 12;
const rest = (bars) => Array(bars * BAR).fill('.');
const loop = (pattern, bars) => Array.from({ length: bars }, () => hits(pattern)).flat();

// A swung tune: each token an 8th, the first of each pair 2 steps long and
// the second 1 (long-short). '-' holds, '.' rests, '|' is a bar line. A
// long 8th can be split in two quick notes with '/': 'D#5/E5' is the sniff.
function swing(text) {
  const out = [];
  let i = 0;
  for (const token of text.split(/\s+/)) {
    if (!token || token === '|') continue;
    const steps = i++ % 2 === 0 ? 2 : 1;
    const parts = token.split('/');
    if (steps % parts.length) throw new Error(`Everything Falls Somewhere: '${token}' can't be split on a short 8th`);
    for (const part of parts) {
      const each = steps / parts.length;
      if (part === '-' || part === '.') out.push(...Array(each).fill(part));
      else out.push(midi(part), ...Array(each - 1).fill('-'));
    }
  }
  return out;
}
// Straight triplet 8ths, twelve to a bar: for runs.
const triplets = (text) => melody(text, 1);

// --- Chords, a bar each. ---
const PC = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
function chordOf(symbol) {
  const m = symbol.match(/^([A-G])([#b]?)(m?)(7?)$/);
  if (!m) throw new Error(`Everything Falls Somewhere: can't read the chord '${symbol}'`);
  const root = (PC[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + 12) % 12;
  return { root, third: m[3] ? 3 : 4, top: m[4] ? 10 : 7 };
}
const from = (pc, low) => low + ((((pc - low) % 12) + 12) % 12);
const comp = (chords, make) => chords.split(/\s+/).filter(Boolean).flatMap((symbol) => make(chordOf(symbol)));
const at = (notes) => { const bar = Array(BAR).fill('.'); for (const [step, note] of notes) bar[step] = note; return bar; };
// The pah: a chord tone plucked on beats 2 and 4 (voice 0 the third, 1 the
// fifth or seventh).
const pah = (chords, voice, low = 52) => comp(chords, (c) => {
  const note = voice === 0 ? from(c.root + c.third, low) : from(c.root + c.top, low + 3);
  return at([[3, note], [9, note]]);
});
// The tuba's oom-pah for the chorus: the root on 1, the fifth on 3.
const oompah = (chords) => comp(chords, (c) => {
  const root = from(c.root, 36);
  return at([[0, root], [6, root + 7]]);
});
// Long notes, a bar each.
const longNotes = (names) => names.split(/\s+/).filter(Boolean).flatMap((n) => [midi(n), ...Array(BAR - 1).fill('-')]);

// --- A: the tiptoe, over the line cliche. ---
const A_CHORDS = 'Am E7 Am D F E7 Am E7';
const A2_CHORDS = 'Am E7 Am D F E7 Am G7';
const TIPTOE = swing(`
  A4 . C5 . E5 . D#5/E5 . | . . D5 . . B4 . G#4 | A4 . C5 . E5 . A5 . | . . F#5 . . D5 . A4 |
  C5 . F5 . A5 . G#5/A5 . | . . G#5 . . E5 . D5 | C5 . E5 . A5 . C6 . | B5 - - . G#5 . E5 . |
`);
// The second time, the last bar turns to G7 for the chorus.
const TIPTOE_TO_C = [...TIPTOE.slice(0, 7 * BAR), ...swing('B5 - - . G5 . F5 .')];
const CREEP = swing(`
  A2 . . . E2 . . A2 | G#2 . . . E2 . . G#2 | G2 . . . E2 . . G2 | F#2 . . . D2 . . F#2 |
  F2 . . . C2 . . F2 | E2 . . . B1 . . E2 | A2 . . . E2 . . E2 | E2 . . . G#2 . B2 . |
`);
const CREEP_TO_C = [...CREEP.slice(0, 7 * BAR), ...swing('G2 . . . D2 . B1 .')];
// The junk answering in the tiptoe's gaps (bars 2, 4 and 6), on the glasses.
const ANSWER = swing(`
  . . . . . . . . | E6 C6 . . . . . . | . . . . . . . . | D6 A5 . . . . . . |
  . . . . . . . . | B5 G#5 E6 . . . . . | . . . . . . . . | . . . . . . . . |
`);

// --- B: the chorus, C major, "look what I found". ---
const B_CHORDS = 'C A7 Dm G7 C A7 D7 G7';
const B2_CHORDS = 'C A7 Dm G7 C A7 Dm E7';
const FOUND = swing(`
  G5 . C6 . D#6/E6 . C6 . | G6 - - . E6 . C#6 . | D6 . F6 . A6 - - . | G6 . F6 . D6 . B5 . |
  G5 . C6 . D#6/E6 . C6 . | A6 - - . G6 . E6 . | F#6 . E6 . D6 . C6 . | B5 . D6 . G6 - - . |
`);
// The second time, it goes round through Dm and E7 back to the tiptoe.
const FOUND_HOME = [...FOUND.slice(0, 6 * BAR), ...swing('F6 . E6 . D6 . A5 . | B5 . D6 . G#6 - - .')];
// The clarinet holding the guide tones under the glockenspiel.
const GUIDES = longNotes('E5 E5 F5 F5 E5 G5 F#5 F5');

// --- C: digging. Runs up into the pile, and a clatter after each. ---
const C_CHORDS = 'Am Am F F Dm Dm E7 G7';
const DIG = triplets(`
  E4 F4 G#4 A4 B4 C5 D5 E5 . . . . | . . . . . . . . . . . . |
  F4 G4 A4 Bb4 C5 D5 E5 F5 . . . . | . . . . . . . . . . . . |
  D5 E5 F5 G5 A5 Bb5 A5 G5 F5 E5 D5 . | . . . . . . . . . . . . |
  E5 . . G#5 . . B5 . . D6 . . | . . . . . . . . . . . . |
`);
const FOUND_IT = [...rest(7), ...triplets('G5 . B5 . D6 . F6 . G6 - - .')];

// The clatter: junk tumbling, seeded so it falls the same way every time.
// In `bars` (1 for a clatter bar, 0 for a quiet one), each step has a
// chance of a thud (tom), a clonk (high drum), a rattle (soft snare) or a
// glass, rung on one of `glasses` (a chord's notes).
function clatter(bars, seed, glasses) {
  let s = seed >>> 0;
  const rand = () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296;
  const out = { thud: [], clonk: [], rattle: [], glass: [] };
  bars.forEach((on, b) => {
    const notes = glasses[b].split(' ').map(midi);
    for (let i = 0; i < BAR; i++) {
      const r = on ? rand() : 1;
      out.thud.push(r < 0.12 || (on && i === 0) ? 'x' : '.');
      out.clonk.push(r >= 0.12 && r < 0.24 ? 'x' : '.');
      out.rattle.push(r >= 0.24 && r < 0.4 ? 'x' : '.');
      out.glass.push(r >= 0.4 && r < 0.52 ? notes[Math.floor(rand() * notes.length)] : '.');
    }
  });
  return out;
}
const JUNK = clatter([0, 1, 0, 1, 0, 1, 0, 0], 7, ['A5', 'A5 C6 E6', 'A5', 'A5 C6', 'A5', 'A5 D6', 'A5', 'A5']);

export const RUMMAGE_THEME = {
  title: 'Everything Falls Somewhere',
  bpm: 112,
  stepsPerBeat: 3,
  // A shop: under the talking, so quieter than a fight.
  volume: 1.4,

  instruments: {
    // The tiptoe: a clarinet, short and dry.
    clarinet: { sample: 'clarinet', volume: 0.3, attack: 0.01, release: 0.09, reverb: 0.3, pan: 0.15, humanize: { time: 0.008, volume: 0.12 } },
    // The clarinet again, a little back, doubling the chorus an octave down.
    clarinetLow: { sample: 'clarinet', volume: 0.15, attack: 0.01, release: 0.09, reverb: 0.3, pan: 0.15, humanize: { time: 0.008, volume: 0.12 } },
    // The clarinet again, holding long notes under the chorus.
    clarinetLong: { sample: 'clarinet', volume: 0.09, attack: 0.12, release: 0.4, reverb: 0.4, pan: 0.2 },
    // Plucked violins on the tune.
    pizz: { sample: 'violinsPizz', volume: 0.22, ring: true, reverb: 0.3, pan: 0.3, humanize: { time: 0.006, volume: 0.18 } },
    // The shiny things.
    glock: { sample: 'glock', volume: 0.24, ring: true, reverb: 0.4, pan: -0.2, humanize: { time: 0.005, volume: 0.12 } },
    // The bounce: a tuba, short; plucked cellos on the off beats.
    tuba: { sample: 'tuba', volume: 0.5, attack: 0.01, release: 0.1, gate: 0.8, reverb: 0.2, pan: -0.1, humanize: { time: 0.006, volume: 0.1 } },
    pah: { sample: 'cellosPizz', volume: 0.2, ring: true, reverb: 0.25, pan: 0.25, humanize: { time: 0.006, volume: 0.15 } },
    pahHi: { sample: 'cellosPizz', volume: 0.17, ring: true, reverb: 0.25, pan: 0.35, humanize: { time: 0.006, volume: 0.15 } },
    horns: { sample: 'hornsSoft', volume: 0.35, attack: 0.2, release: 0.5, reverb: 0.45, pan: -0.25 },
    // Brushes: a soft snare on 2 and 4, and a quieter swung touch.
    brush: { sample: 'snareSoft', drum: 'sample', volume: 0.2, ring: true, reverb: 0.25, pan: 0.1, humanize: { time: 0.005, volume: 0.25 } },
    brushGhost: { sample: 'snareSoft', drum: 'sample', volume: 0.08, ring: true, reverb: 0.25, pan: 0.1, humanize: { time: 0.006, volume: 0.35 } },
    claps: { sample: 'claps', drum: 'sample', volume: 0.25, ring: true, reverb: 0.3, pan: -0.1, humanize: { time: 0.008, volume: 0.25 } },
    drum: { sample: 'frameDrum', drum: 'sample', volume: 0.16, ring: true, reverb: 0.2, humanize: { time: 0.005, volume: 0.15 } },
    // The junk.
    thud: { sample: 'tom', drum: 'sample', volume: 0.26, ring: true, reverb: 0.3, pan: -0.3, humanize: { time: 0.01, volume: 0.3 } },
    clonk: { sample: 'tenorDrumHigh', drum: 'sample', volume: 0.22, ring: true, reverb: 0.3, pan: 0.35, humanize: { time: 0.01, volume: 0.3 } },
    rattle: { sample: 'snareSoft', drum: 'sample', volume: 0.18, ring: true, reverb: 0.3, pan: -0.15, humanize: { time: 0.01, volume: 0.35 } },
    glass: { sample: 'glass', volume: 0.15, release: 0.35, gate: 0.6, reverb: 0.45, pan: 0.4, humanize: { time: 0.008, volume: 0.25 } },
  },

  sections: {
    // The tuba sneaks in under the brushes; a sniff.
    intro: {
      tuba: swing('A2 . . . E2 . . A2 | E2 . . . B1 . . E2'),
      pah: pah('Am E7', 0),
      pahHi: pah('Am E7', 1),
      brush: loop('...x.....x..', 2),
      clarinet: swing('. . . . . . . . | . . . . . . D#5/E5 .'),
    },

    // The tiptoe on the clarinet; the bass creeps down by half steps.
    A: {
      clarinet: TIPTOE,
      tuba: CREEP,
      pah: pah(A_CHORDS, 0),
      pahHi: pah(A_CHORDS, 1),
      brush: loop('...x.....x..', 8),
      brushGhost: loop('..x.....x...', 8),
    },

    // Again, plucked violins on the tune and the glasses answering in the
    // gaps; it turns to G7 for the chorus.
    A2: {
      clarinet: TIPTOE_TO_C,
      pizz: TIPTOE_TO_C,
      glass: ANSWER,
      tuba: CREEP_TO_C,
      pah: pah(A2_CHORDS, 0),
      pahHi: pah(A2_CHORDS, 1),
      brush: loop('...x.....x..', 8),
      brushGhost: loop('..x.....x...', 8),
      thud: loop('............ x........... ............ x........... ............ x........... ............ ............', 1),
    },

    // "Look what I found": the glockenspiel, the violins an octave down, the
    // clarinet on the guide tones, claps.
    B: {
      glock: FOUND,
      pizz: transpose(FOUND, -12),
      clarinetLong: GUIDES,
      tuba: oompah(B_CHORDS),
      pah: pah(B_CHORDS, 0),
      pahHi: pah(B_CHORDS, 1),
      brush: loop('...x.....x..', 8),
      brushGhost: loop('..x.....x...', 8),
      claps: loop('...x.....x..', 8),
      drum: loop('x.....x.....', 8),
    },

    // He digs: a run up into the pile, then a clatter, three times; E7,
    // and "found it!" up the glockenspiel.
    C: {
      clarinet: DIG,
      glock: FOUND_IT,
      tuba: [...oompah('Am Am F F Dm Dm E7'), ...at([[0, midi('G2')]])],
      pah: [...pah('Am Am F F Dm Dm E7', 0), ...rest(1)],
      pahHi: [...pah('Am Am F F Dm Dm E7', 1), ...rest(1)],
      brush: [...loop('...x.....x..', 7), ...rest(1)],
      thud: JUNK.thud,
      clonk: JUNK.clonk,
      rattle: JUNK.rattle,
      glass: JUNK.glass,
    },

    // The chorus with everyone, the clarinet on the tune an octave under
    // the glockenspiel, horns warm underneath; home through Dm and E7.
    B2: {
      glock: FOUND_HOME,
      clarinetLow: transpose(FOUND_HOME, -12),
      pizz: transpose(FOUND_HOME, -12),
      horns: comp(B2_CHORDS, (c) => [from(c.root + c.third, 52), ...Array(BAR - 1).fill('-')]),
      tuba: oompah(B2_CHORDS),
      pah: pah(B2_CHORDS, 0),
      pahHi: pah(B2_CHORDS, 1),
      brush: loop('...x.....x..', 8),
      brushGhost: loop('..x.....x...', 8),
      claps: loop('...x.....x..', 8),
      drum: loop('x.....x.....', 8),
    },
  },

  // The intro plays once; then the shop goes round from the tiptoe.
  order: ['intro', 'A', 'A2', 'B', 'C', 'B2'],
  loopFrom: 1,
};
