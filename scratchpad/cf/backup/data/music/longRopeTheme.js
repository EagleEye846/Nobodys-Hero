import { melody, HOLD, REST } from '../../audio/notation.js';
import { midi } from './parts/chapter4.js';
import { drops } from './parts/chapter3.js';
import { TUCK_CHORDS } from './rumboldTheme.js';

// "Pull It Twice": the goodbye at the foot of the Long Rope, the end of
// Chapter 4. The hall has come down, Bramble has got everybody out, and the
// passage ends at a sheer face with a rope hanging down it from a square of
// daylight a very long way up. Tuck is there with what's left of the king (the
// carved head under his arm), and a few of the folk have come to see you off.
// It starts as you walk in (the room and the_long_rope both ask for it) and
// carries on through the goodbyes and the whole climb, until the Soft Field
// takes over at the top. Tuck asks for two tugs on the rope from up there, so
// they'll know you made it; hence the name.
//
// Bittersweet and warm, not sad: a farewell to Belowtown, the way you'd wave
// from the end of a street. Nothing loud, no drums, no brass, no big cellos;
// a harp, soft strings, and the voices the chapter already gave its people.
// Real recordings only (VSCO 2 and VCSL, sampleSets.js).
//
// The tunes it remembers:
//   - Tuck's tune ("Small Enough to Hide", tuckTheme.js), on his clarinet,
//     but with the stammer gone: D G Bb A without the catch at the front. He
//     says goodbye without hiding behind anything. With the stammer gone his
//     tune starts on the chapter's four notes plain (the first cell, minor).
//   - THE FIRST CELL (parts/chapter4.js: 5 1 3 2, up a fourth, up a third,
//     a step down) all the way through: in Eb when he says thank you, climbing
//     a step at a time on the rope, and in D, high and open, in the daylight.
//   - "Lamps Lit Early" (belowtownTheme.js), its first eight bars slowed down
//     and moved to G, on the ocarina that played it in the town, with the
//     harp picking and the lamps glinting: a last look back down the street.
//   - "Where the Buttercups Are" (sunnysideTheme.js), its opening on the
//     flute, as the daylight comes down the shaft: the field you fell through
//     is up there waiting.
//
// G minor to G major, a turn to E flat for the thank-you, G for the town and
// the climb, and up into D major for the daylight (D is the fifth of G minor,
// so the loop comes home on its own). 72 BPM in 4/4, one step a 16th, so a
// bar is 3.3 seconds. The intro plays once (7s); then it loops from A, 44
// bars, about 2m27s:
//
//   intro    2 bars  0:00 the harp alone, the cell in G minor, slowly
//   A        8 bars  0:07 Tuck's goodbye: his tune on the clarinet, no stammer,
//                    the harp rocking, cellos plucked on tiptoe, the music box
//                    answering; it ends on G major
//   thanks   8 bars  0:33 E flat major, the brave part: a solo violin sings
//                    the cell and reaches up, the clarinet small under it
//   town     8 bars  1:00 the look back: "Lamps Lit Early" on the ocarina in
//                    G, the harp picking like a guitar by a fire, a felt
//                    piano, the lamps glinting high
//   climb    8 bars  1:27 hand over hand: the cell a step higher every two bars,
//                    the solo violin climbing, the harp in rising 16ths, the
//                    plucked bass walking up; it lands on A, ready for D
//   daylight 8 bars  1:53 D major: the Buttercups opening on the flute, the
//                    strings opening out above, a soft choir, plucked strings
//                    going "oom, pah"; then the cell high and slow on the violin
//   top      4 bars  2:20 out: the choir holds D, the music box plays the cell
//                    one last time and the flute leaves it on its question (the
//                    2, E over D); it thins to the harp, and D leads home to
//                    G minor and the loop

// --- Helpers. ---
const BAR = 16;
const R = REST;
const r8 = (text) => melody(text, 2);   // each token an 8th
const rest = (bars) => Array(bars * BAR).fill(R);
const at = (bars, track) => [...rest(bars), ...track];
function section(bars, tracks) {
  return Object.fromEntries(Object.entries(tracks).map(([name, steps]) => {
    if (steps.length > bars * BAR) throw new Error(`Pull It Twice: '${name}' is ${steps.length} steps, longer than ${bars} bars`);
    return [name, [...steps, ...Array(bars * BAR - steps.length).fill(R)]];
  }));
}

// Chords, a bar each ('Cm,D' is two, half a bar each).
const QUALITY = { '': [0, 4, 7], m: [0, 3, 7] };
function chordOf(symbol) {
  const m = symbol.match(/^([A-G][#b]?)(m)?$/);
  if (!m) throw new Error(`Pull It Twice: can't read the chord '${symbol}'`);
  return { root: midi(`${m[1]}4`) % 12, tones: QUALITY[m[2] ?? ''] };
}
const inBand = (pc, low) => low + ((pc - (low % 12) + 12) % 12);
// A pattern is 16 steps of R (rest), HOLD or 'R' 'T' 'F' (root, third, fifth;
// '+' an octave up, '-' an octave down), played against each bar's chord,
// the root put at or just above `low`.
function comp(chords, pattern, low) {
  return chords.split(/\s+/).filter(Boolean).flatMap((bar) => {
    const parts = bar.split(',');
    const each = BAR / parts.length;
    return parts.flatMap((symbol, i) => {
      const chord = chordOf(symbol);
      const slice = pattern.slice(i * each, (i + 1) * each);
      return slice.map((p) => {
        if (p === R || p === HOLD) return p;
        const shift = p.endsWith('-') ? -12 : p.endsWith('+') ? 12 : 0;
        return inBand(chord.root, low) + chord.tones['RTF'.indexOf(p[0])] + shift;
      });
    });
  });
}
const holdBar = (p) => [p, ...Array(BAR - 1).fill(HOLD)];
// Held chord tones, a new one each bar, or each half bar where it has two
// chords (so the strings never hang on to the wrong one).
const pad = (chords, p, low) => chords.split(/\s+/).filter(Boolean).flatMap((bar) => {
  const parts = bar.split(',');
  const each = BAR / parts.length;
  return comp(bar, Array.from({ length: BAR }, (_, i) => (i % each === 0 ? p : HOLD)), low);
});
// A plucked bass on given notes (not always the chord's root), on beats 1 and 3.
const walk = (names) => names.split(/\s+/).filter(Boolean).flatMap((name) => {
  const half = [midi(name), ...Array(BAR / 2 - 1).fill(R)];
  return [...half, ...half];
});

// --- The harmony, a bar each. ---
const A_CHORDS = TUCK_CHORDS;                    // Gm Eb Cm D Gm Eb Cm,D G
const THANKS_CHORDS = 'Eb Bb Cm D Eb F Gm D';
const TOWN_CHORDS = 'G C G D Em Am C D';        // Belowtown's first eight, in G
const CLIMB_CHORDS = 'G D Am Em Bm A G A';
const DAY_CHORDS = 'D Bm G A D Bm G A';
const TOP_CHORDS = 'D G D D';

// --- The harp's figures. ---
// Rocking under Tuck: root, fifth, octave, third, in 8ths.
const ROCK = ['R', R, 'F', R, 'R+', R, 'T+', R, 'R+', R, 'T+', R, 'F', R, 'T', R];
// Picking like a guitar by the fire, as in the town.
const PICK = ['R', R, 'F', R, 'T+', R, 'R+', R, 'T+', R, 'F', R, 'R+', R, 'F', R];
// Hand over hand: 16ths, a little higher each beat.
const RISE = ['R', 'F', 'R+', 'T+', 'R', 'F', 'R+', 'T+', 'F', 'R+', 'T+', 'F+', 'F', 'R+', 'T+', 'F+'];
// The daylight: up and open, with room to breathe.
const OPEN = ['R', R, 'F', R, 'R+', 'T+', 'F+', R, 'R+', R, 'T+', R, 'F+', R, 'T+', R];
// The top: just the chord, slowly.
const SLOW = ['R', R, R, R, 'F', R, R, R, 'R+', R, R, R, 'T+', R, R, R];
// Tiptoe (the plucked cellos under Tuck) and the oom-pah of the field.
const TIPTOE = ['R', R, R, R, R, R, R, R, 'F', R, R, R, R, R, R, R];
const PAH = [R, R, R, R, 'T', R, R, R, R, R, R, R, 'F', R, R, R];

// --- A: Tuck's tune with the stammer gone (TUCK_TUNE in rumboldTheme.js has
// "D5 . D5" at the front of each line; here he just says it). ---
const GOODBYE = r8(`
  D5 - - G5 - Bb5 A5 - | - - G5 F5 Eb5 - - - | G4 - - C5 - Eb5 D5 - | - - C5 Bb4 A4 - - - |
  D5 - - G5 - Bb5 A5 - | - - Bb5 C6 D6 - - - | C6 - Bb5 - A5 - F#5 - | G5 - - - - - - - |
`);
// The music box answering with the cell, as it does in his own theme.
const BOX_CELL = r8('. . . . . . . . | . . . . D6 G6 Bb6 A6 | . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . G6 C7 Eb7 D7');

// --- Thanks: the cell in E flat (Bb Eb G F), and up. ---
const THANKS = r8(`
  Bb4 - Eb5 - G5 - F5 - | - - - - D5 - Bb4 - | C5 - Eb5 - G5 - Bb5 - | A5 - - - F#5 - D5 - |
  Bb5 - - - G5 - Eb5 - | F5 - - - A5 - C6 - | Bb5 - - - G5 - D5 - | F#5 - - - - - - - |
`);
const UNDER = r8(`
  . . . . G4 - - - | . . . . F4 - - - | . . . . Eb4 - - - | . . . . D4 - - - |
`);

// --- The town: "Lamps Lit Early", its first eight bars, slowed and in G.
// Bars 1 and 2 are the cell, major (D G B A). ---
const LAMPS = r8(`
  D5 - - - G5 - - - | B5 - - - A5 - - - | G5 - - - D5 - - - | F#5 - - - - - - - |
  G5 - - - B5 - - - | A5 - - - C6 - - - | B5 - - A5 - - G5 - | A5 - - - - - - - |
`);

// --- The climb: the cell a step higher every two bars, ending on the A
// chord, the door into D. ---
const CLIMB = r8(`
  D5 - - G5 - - B5 - | A5 - - - - - - - | E5 - - A5 - - C6 - | B5 - - - - - - - |
  F#5 - - B5 - - D6 - | C#6 - - - - - - - | G5 - - B5 - - E6 - | - - - D6 - - C#6 - |
`);
// The plucked bass walking up under it.
const CLIMB_BASS = walk('G2 F#2 A2 B2 B2 C#3 D3 E3');

// --- The daylight: the Buttercups opening on the flute (in D, as in the
// field), then the cell high and slow on the violin, the flute under it. ---
const BUTTERCUPS = r8(`
  A4 - - D5 - - F#5 E5 | D5 - - B4 - - D5 F#5 | G5 - - F#5 E5 - D5 B4 | A4 - - - B4 - C#5 E5 |
  F#5 - - - - - - - | D5 - - - - - - - | D5 - - - B4 - - - | A4 - - - C#5 - - - |
`);
const HIGH_CELL = r8(`
  . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . . . . . |
  A5 - - - D6 - - - | F#6 - - - - - E6 - | D6 - - - - - B5 - | C#6 - - - E6 - - - |
`);

export const LONG_ROPE_THEME = {
  title: 'Pull It Twice',
  bpm: 72,
  stepsPerBeat: 4,
  volume: 0.95,

  instruments: {
    harp: { sample: 'harp', volume: 0.26, ring: true, reverb: 0.5, pan: 0.15, echo: { time: 0.42, feedback: 0.2, mix: 0.15 }, humanize: { time: 0.01, volume: 0.12 } },
    harpSoft: { sample: 'harp', volume: 0.17, ring: true, reverb: 0.55, pan: -0.15, humanize: { time: 0.012, volume: 0.15 } },
    // The music box (Tuck's), and the lamps of the town.
    box: { sample: 'glock', volume: 0.09, ring: true, reverb: 0.55, pan: 0.35, humanize: { time: 0.012, volume: 0.15 } },
    lamps: { sample: 'glock', volume: 0.06, ring: true, reverb: 0.6, pan: 0.35, echo: { time: 0.56, feedback: 0.25, mix: 0.25 } },
    // The voices: Tuck's clarinet, the town's ocarina, the field's flute, and
    // a solo violin for the brave parts.
    tuck: { sample: 'clarinet', volume: 0.34, attack: 0.07, release: 0.5, reverb: 0.5, pan: -0.05, humanize: { time: 0.014, volume: 0.1 } },
    tuckSoft: { sample: 'clarinet', volume: 0.15, attack: 0.12, release: 0.7, reverb: 0.55, pan: -0.1, humanize: { time: 0.014, volume: 0.1 } },
    ocarina: { sample: 'ocarina', volume: 0.26, attack: 0.05, release: 0.45, reverb: 0.5, pan: 0.15, humanize: { time: 0.012, volume: 0.1 } },
    flute: { sample: 'flute', volume: 0.26, attack: 0.06, release: 0.5, reverb: 0.5, pan: 0.2, humanize: { time: 0.012, volume: 0.1 } },
    violin: { sample: 'soloViolin', volume: 0.32, attack: 0.14, release: 0.8, reverb: 0.55, pan: 0.1, humanize: { time: 0.012, volume: 0.1 } },
    // Underneath: plucked strings and a felt piano.
    pluck: { sample: 'cellosPizz', volume: 0.24, ring: true, reverb: 0.35, pan: -0.25, humanize: { time: 0.006, volume: 0.15 } },
    pah: { sample: 'violinsPizz', volume: 0.13, ring: true, reverb: 0.35, pan: 0.3, humanize: { time: 0.006, volume: 0.2 } },
    piano: { sample: 'grandPiano', volume: 0.17, ring: true, reverb: 0.5, pan: -0.05, humanize: { time: 0.01, volume: 0.12 } },
    // Soft strings and a soft choir, held.
    violins: { sample: 'violins', volume: 0.1, attack: 0.9, release: 1.5, reverb: 0.6, pan: 0.25 },
    violas: { sample: 'violas', volume: 0.13, attack: 0.6, release: 1.2, reverb: 0.55, pan: -0.15 },
    cellos: { sample: 'cellos', volume: 0.13, attack: 0.7, release: 1.3, reverb: 0.55, pan: -0.25 },
    choir: { sample: 'choir', volume: 0.1, attack: 1.4, release: 2, reverb: 0.7, pan: 0 },
  },

  sections: {
    // The harp alone: the cell in G minor, slowly, over a low G left to ring.
    intro: section(2, {
      harp: r8('D5 - - - G5 - - - | Bb5 - - - A5 - - -'),
      harpSoft: [midi('G2'), ...Array(7).fill(R), midi('D3')],
    }),

    // Tuck's goodbye.
    A: section(8, {
      tuck: GOODBYE,
      harp: comp(A_CHORDS, ROCK, 50),
      pluck: comp(A_CHORDS, TIPTOE, 43),
      box: BOX_CELL,
      violas: at(2, pad(A_CHORDS.split(' ').slice(2).join(' '), 'T', 55)),
      cellos: at(4, pad(A_CHORDS.split(' ').slice(4).join(' '), 'R', 43)),
    }),

    // Thank you. For coming down.
    thanks: section(8, {
      violin: THANKS,
      tuckSoft: [...UNDER, ...rest(4)],
      harp: comp(THANKS_CHORDS, ROCK, 50),
      pluck: comp(THANKS_CHORDS, TIPTOE, 43),
      violas: pad(THANKS_CHORDS, 'T', 55),
      cellos: pad(THANKS_CHORDS, 'R', 43),
      box: at(4, r8('Bb6 - Eb7 - G7 - F7 -')),
    }),

    // The last look back down the street.
    town: section(8, {
      ocarina: LAMPS,
      harp: comp(TOWN_CHORDS, PICK, 48),
      piano: pad(TOWN_CHORDS, 'R', 38),
      lamps: drops(TOWN_CHORDS, BAR, 0.06, 17, 2),
      violas: at(4, pad(TOWN_CHORDS.split(' ').slice(4).join(' '), 'F', 50)),
      violins: at(4, pad(TOWN_CHORDS.split(' ').slice(4).join(' '), 'T', 64)),
    }),

    // Hand over hand.
    climb: section(8, {
      violin: CLIMB,
      harpSoft: comp(CLIMB_CHORDS, RISE, 48),
      pluck: CLIMB_BASS,
      violas: pad(CLIMB_CHORDS, 'T', 55),
      violins: at(4, pad(CLIMB_CHORDS.split(' ').slice(4).join(' '), 'F', 64)),
      choir: at(6, pad('G A', 'T', 60)),
    }),

    // Daylight down the shaft.
    daylight: section(8, {
      flute: BUTTERCUPS,
      violin: HIGH_CELL,
      harp: comp(DAY_CHORDS, OPEN, 50),
      pluck: comp(DAY_CHORDS, TIPTOE, 38),
      pah: comp(DAY_CHORDS, PAH, 62),
      violins: pad(DAY_CHORDS, 'R', 62),
      violas: pad(DAY_CHORDS, 'F', 50),
      choir: pad(DAY_CHORDS, 'T', 60),
      box: at(6, r8('A6 - D7 - F#7 - E7 -')),
    }),

    // Out at the top, and the cell left on its question.
    top: section(4, {
      harp: comp(TOP_CHORDS, SLOW, 50),
      violin: [...holdBar(midi('D6')), ...holdBar(HOLD)],
      flute: at(2, r8('F#5 - - - - - - - | E5 - - - - - - .')),
      box: at(2, r8('A6 - D7 - F#7 - E7 -')),
      choir: pad('D G D', 'T', 60),
      violins: pad('D G D', 'R', 62),
      cellos: [...holdBar(midi('D2')), ...holdBar(HOLD), ...holdBar(HOLD)],
    }),
  },

  order: ['intro', 'A', 'thanks', 'town', 'climb', 'daylight', 'top'],
  loopFrom: 1,
};
