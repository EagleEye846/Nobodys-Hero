import { midi } from '../../audio/notation.js';
import { rest as restBars, held, onNotes, patter, cells } from './parts/chapter3.js';
import { melody, sustained, arpeggio, transpose, scatter, tight } from './parts/chapter5.js';

// "The Sea Downstairs": the way down through the cliff from the Sea View to
// Gullrest (sunny_cliff_cave, then sunny_cliff_hollow). Bramble's question
// on the plank steps ("...Why is the sea downstairs?") is the title. Old
// fishers' steps going down beside a sea pool, a hole through the rock with
// the sea in it, a tin lantern, shafts of sun with dust in them, drips; and
// at the bottom the sea itself coming in along a long inlet, nets and pots
// and an old boat. Sunlit, cool, echoing stone, light dancing on the water.
// It sits between the wonder of "All of It, All at Once" (the first sight
// of the sea) and the bunting of Gullrest: gentle, curious, a little
// magical. Soft, like every area song: harps, an ocarina, a low flute,
// strings so quiet they are mostly air, a bowed vibraphone humming like the
// cave itself. No cellos, no brass, no drums.
//
// THE HOOK is the chapter's COAST CELL (A D D E, parts/chapter5.js) in G
// major, D G G A, the way "Bunting" will play it on the sand in a minute;
// here it is slower and wondering, and it climbs through C sharp, the
// raised fourth (G Lydian: the A major chord over a G bass), which is what
// makes it sound a little magic. The cave answers it: every phrase of the
// ocarina is said back softly, a bar later, from the other side of the
// rock by a second, dimmer ocarina (the `echo` track), like shouting "hello"
// into a cave. The first sight of the sea ended hanging on a G major chord;
// this song picks up that G and carries it down the steps to Gullrest's
// door, which is in G too.
//
// THE MIDDLE (B) goes into E minor, the sea pool: a low flute plays the
// coast cell there (B E E F#), then in G again (D G G A B); and once, very
// quietly, Haddock's motif in E minor (G F# E, B: 3 2 1, down to 5), which
// the cave echoes back. Nobody points at it.
//
// THE WAVES are the real sea (seaWaves: waves recorded on a beach, CC0),
// heard through the rock: dulled hard (a lowpass at 900 and 650 Hz), lots
// of reverb, one from the left and one, further off, from the right, and
// never on a pattern: one breaks every 4 to 8 bars (7 to 14 seconds), on
// whatever beat it likes, mostly the small ones of the eight recordings.
// The drips are written too: single high glock and harp notes from the G
// major scale scattered where they fall (seeded, so they fall the same way
// each time), each with its own short stone echo.
//
// G major (Lydian colour), 6/8 at 70 dotted quarters a minute (a bar is
// about 1.7 seconds), one step an 8th, 6 to a bar. The intro plays once
// (2 bars, 3 s); then it loops from A, 76 bars, about 2m10s:
//
//   intro   2 bars  the harp starts its ripple, a drip, a far wave
//   A      16 bars  0:00  THE HOOK on the ocarina, the cave echoing it back;
//                         the harp ripple (D A B, the light on the water),
//                         the low harp, the violas breathing
//   A2     16 bars  0:27  the hook on the low flute, the ocarina now the
//                         echo; plucked violins lapping, a second harp
//                         catching the light, violins warm
//   B      16 bars  0:55  the sea pool, E minor: the flute's coast cell in
//                         E minor and G, Haddock's motif and its echo, the
//                         choir humming, the bowed vibes
//   still   8 bars  1:22  the hush: one harp, the vibes, the coast cell
//                         slowed to a bar a note on the ocarina and echoed
//                         back; a bigger wave, heard clearer
//   A3     16 bars  1:36  home: the hook on the ocarina with the flute an
//                         octave under, the echo, everyone (still soft), the
//                         choir on "ah"; lands on G
//   out     4 bars  2:03  the ripple alone on G, a drip, a wave, and round

const BAR = 6;
const tune = (text) => melody(text, 1);   // each token an 8th: 6 to a bar
const rest = (bars) => restBars(bars, BAR);
const up = (steps, semitones) => transpose(steps, semitones);
const fit = (name, section, bars) => tight('The Sea Downstairs', name, section, bars, BAR);

// --- The harmony, a bar each. 'A' sits over a G bass: G Lydian. ---
const A_CHORDS = 'G A G A Em C Am D   G A G A Em C D G';
const A_BASS = 'G1 G1 G1 G1 E1 C2 A1 D2   G1 G1 G1 G1 E1 C2 D2 G1';
const B_CHORDS = 'Em Em C C G G D D   Em Em C C Am Am D D';
const B_BASS = 'E1 E1 C2 C2 G1 G1 D2 D2   E1 E1 C2 C2 A1 A1 D2 D2';
const STILL_CHORDS = 'G A G A Em C D D';
const STILL_BASS = 'G1 G1 G1 G1 E1 C2 D2 D2';
// The low harp: the root, then its fifth halfway through the bar. (C and D
// sit an octave higher than the rest: below E-flat 2 the harp goes "boing".)
const LOW = [0, '.', '.', 7, '.', '.'];

// --- The light on the water: the harp rolls D A B (the coast cell's own
// notes) every bar of the song, whatever the bass does under it. A second
// harp catches the light higher up, off the beat. ---
const RIPPLE = [0, 1, 2, '.', 1, '.'];
const ripple = (bars) => patter(cells('D5 A5 B5', bars), RIPPLE);
const glints = (bars) => patter(cells('G5 D6 E6', bars), ['.', '.', '.', 2, '.', 1]);

// --- THE HOOK: the coast cell in G (D G G A), up to B; then up through the
// raised fourth (C#) and home. Each phrase leaves a bar for the echo. ---
const HOOK = tune(`
  D5 - G5 G5 - A5 | B5 - - - - . | . . . . . . | . . B5 C#6 - D6 |
  E6 - D6 B5 - A5 | B5 - - - - . | . . . . . . | A5 - - G5 - F#5 |
  D5 - G5 G5 - A5 | B5 - - - - . | . . . . . . | . . B5 C#6 - D6 |
  E6 - D6 B5 - A5 | B5 - - - - . | C6 - B5 A5 - F#5 | G5 - - - - . |
`);
// The cave saying it back, a bar later, in the bars the hook leaves.
const ECHO = tune(`
  . . . . . . | . . . . . . | G5 - A5 B5 - - | . . . . . . |
  . . . . . . | . . . . . . | B5 - A5 B5 - - | . . . . . . |
  . . . . . . | . . . . . . | G5 - A5 B5 - - | . . . . . . |
  . . . . . . | . . . . . . | . . . . . . | . . . A5 F#5 G5 |
`);

// --- The sea pool (B): the coast cell in E minor (B E E F#), then in G
// (D G G A B); Haddock's motif in E minor (G F# E, B), left for the echo. ---
const POOL = tune(`
  B4 - - E5 - - | E5 - F#5 G5 - - | G5 - - E5 - D5 | E5 - - - - . |
  D5 - - G5 - - | G5 - A5 B5 - - | A5 - - F#5 - E5 | D5 - - - - . |
  G5 - - F#5 E5 - | - - - B4 - - | . . . . . . | . . . . . . |
  C5 - - E5 - A5 | G5 - - E5 - - | F#5 - E5 F#5 - A5 | - - - - - . |
`);
const POOL_ECHO = tune(`
  . . . . . . | . . . . . . | . . . . . . | . . . . . . |
  . . . . . . | . . . . . . | . . . . . . | . . . . . . |
  . . . . . . | . . . . . . | G5 - - F#5 E5 - | - - - B4 - - |
  . . . . . . | . . . . . . | . . . . . . | . . . . . . |
`);

// --- The hush: the coast cell slowed to a bar a note, and said back. ---
const SLOW_CELL = tune(`
  D5 - - - - - | G5 - - - - - | G5 - - - - - | A5 - - - - . |
  . . . . . . | . . . . . . | . . . . . . | . . . . . . |
`);
const SLOW_ECHO = tune(`
  . . . . . . | . . . . . . | . . . . . . | . . . . . . |
  D5 - - - - - | G5 - - - - - | G5 - - - - - | A5 - - - - . |
`);

// A chord held for `each` bars at a time (one voice: 0 root, 1 third, 2 fifth).
const pad = (chords, voice, octave, each = 1) => {
  const names = chords.split(/\s+/).filter(Boolean);
  const out = [];
  for (let i = 0; i < names.length; i += each) out.push(...sustained(names[i], BAR * each, voice, octave));
  return out;
};

// Drips: single high notes from the scale, where they fall. Seeded, so
// they fall the same way every time round.
const DRIP_NOTES = ['D6', 'E6', 'G6', 'A6', 'B6', 'D7', 'G6', 'B6'];
function drips(bars, count, seed) {
  let s = seed >>> 0;
  const rand = () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296;
  const out = Array(bars * BAR).fill('.');
  for (let i = 0; i < count; i++) out[Math.floor(rand() * bars * BAR)] = midi(DRIP_NOTES[Math.floor(rand() * DRIP_NOTES.length)]);
  return out;
}

export const SEA_DOWNSTAIRS_THEME = {
  title: 'The Sea Downstairs',
  bpm: 70,
  stepsPerBeat: 3,
  // An area theme: soft.
  volume: 1,

  instruments: {
    // The real sea, through the rock (seaWaves: cut from a CC0 recording of
    // waves on a beach), dulled and far: one from the left, one further off
    // on the right, each left to ring into the stone.
    waves: { sample: 'seaWaves', volume: 0.16, ring: true, muffle: 900, reverb: 0.7, pan: -0.35 },
    wavesFar: { sample: 'seaWaves', volume: 0.13, ring: true, muffle: 650, reverb: 0.8, pan: 0.45 },
    // The light on the water: a harp rippling, and a second catching it.
    ripple: { sample: 'harp', volume: 0.15, ring: true, reverb: 0.6, pan: 0.2, humanize: { time: 0.012, volume: 0.25 } },
    glints: { sample: 'harp', volume: 0.08, ring: true, reverb: 0.7, pan: -0.3, echo: { time: 0.64, feedback: 0.25, mix: 0.25 }, humanize: { time: 0.015, volume: 0.3 } },
    // The low harp (an octave up: the harp's lowest strings go "boing").
    low: { sample: 'harp', volume: 0.2, ring: true, octave: 1, reverb: 0.5, pan: -0.1, humanize: { time: 0.012, volume: 0.1 } },
    // The hook, and the cave saying it back from the other side.
    lead: { sample: 'ocarina', volume: 0.25, attack: 0.05, release: 0.6, reverb: 0.6, pan: 0.12, echo: { time: 0.857, feedback: 0.2, mix: 0.15 }, humanize: { time: 0.012, volume: 0.1 } },
    // The same ocarina, softer, for the hush.
    leadSoft: { sample: 'ocarina', volume: 0.15, attack: 0.3, release: 0.9, reverb: 0.7, pan: 0.12, humanize: { time: 0.012, volume: 0.1 } },
    echo: { sample: 'ocarina', volume: 0.12, attack: 0.1, release: 0.9, muffle: 2400, reverb: 0.85, pan: -0.45, humanize: { time: 0.015, volume: 0.1 } },
    // A low, breathy flute.
    flute: { sample: 'flute', volume: 0.2, attack: 0.08, release: 0.6, reverb: 0.6, pan: 0.25, humanize: { time: 0.012, volume: 0.1 } },
    // Plucked violins lapping like water on the boat.
    pizz: { sample: 'violinsPizz', volume: 0.11, ring: true, reverb: 0.5, pan: 0.3, humanize: { time: 0.006, volume: 0.2 } },
    // Strings so soft they're mostly air.
    violas: { sample: 'violas', volume: 0.1, attack: 1.6, release: 2, muffle: 2400, reverb: 0.6, pan: -0.2 },
    violins: { sample: 'violins', volume: 0.08, attack: 1.8, release: 2.2, muffle: 3000, reverb: 0.6, pan: 0.25 },
    // The cave humming: a bowed vibraphone.
    vibes: { sample: 'vibesBowed', volume: 0.08, attack: 1, release: 2, reverb: 0.7, pan: 0.15 },
    // The choir: a low hum in the pool, an "ah" at the end.
    hum: { sample: 'choir', volume: 0.09, attack: 2.5, release: 2.5, muffle: 2000, reverb: 0.65, pan: -0.1 },
    ah: { sample: 'choir', volume: 0.11, attack: 2, release: 2.4, muffle: 2600, reverb: 0.6, pan: 0.1 },
    // Drips: high glock and harp notes with a short stone echo each.
    drips: { sample: 'glock', volume: 0.05, ring: true, muffle: 5500, reverb: 0.7, pan: 0.35, echo: { time: 0.43, feedback: 0.35, mix: 0.3 }, humanize: { time: 0.02, volume: 0.35 } },
    plinks: { sample: 'harp', volume: 0.07, ring: true, reverb: 0.75, pan: -0.4, echo: { time: 0.57, feedback: 0.3, mix: 0.3 }, humanize: { time: 0.02, volume: 0.3 } },
  },

  sections: {
    // The harp starts rippling; a drip, a far wave.
    intro: fit('intro', {
      ripple: ripple(2),
      low: onNotes('G1 G1', LOW),
      vibes: held('D5', 2 * BAR),
      drips: scatter(2, BAR, [[1, 4, 'B6']]),
      wavesFar: scatter(2, BAR, [[0, 0, 'C4']]),
    }, 2),

    // THE HOOK on the ocarina, the cave echoing it back.
    A: fit('A', {
      lead: HOOK,
      echo: ECHO,
      ripple: ripple(16),
      low: onNotes(A_BASS, LOW),
      violas: [...rest(4), ...pad('Em C Am D G A G A Em C D G', 1, 3)],
      vibes: [...pad('G A G A', 2, 4), ...rest(12)],
      drips: drips(16, 5, 11),
      plinks: drips(16, 3, 29),
      waves: scatter(16, BAR, [[3, 2, 'D4'], [12, 4, 'C#4']]),
      wavesFar: scatter(16, BAR, [[8, 0, 'C4']]),
    }, 16),

    // The hook on the low flute, the ocarina now the echo; the lapping.
    A2: fit('A2', {
      flute: HOOK,
      echo: ECHO,
      ripple: ripple(16),
      glints: [...rest(4), ...glints(12)],
      low: onNotes(A_BASS, LOW),
      pizz: arpeggio(A_CHORDS, BAR, 3, ['.', '.', 'third', '.', 7, '.']),
      violas: pad(A_CHORDS, 1, 3),
      violins: [...rest(8), ...pad('G A G A Em C D G', 2, 4)],
      drips: drips(16, 4, 47),
      plinks: drips(16, 3, 83),
      waves: scatter(16, BAR, [[1, 3, 'E4'], [10, 1, 'D4']]),
      wavesFar: scatter(16, BAR, [[6, 0, 'C#4'], [14, 4, 'C4']]),
    }, 16),

    // The sea pool, E minor: the coast cell, Haddock's motif and its echo.
    B: fit('B', {
      flute: POOL,
      echo: POOL_ECHO,
      ripple: ripple(16),
      low: onNotes(B_BASS, LOW),
      vibes: pad(B_CHORDS, 2, 4, 2),
      hum: pad(B_CHORDS, 0, 3, 2),
      violas: pad(B_CHORDS, 1, 3, 2),
      drips: drips(16, 6, 101),
      plinks: drips(16, 2, 131),
      waves: scatter(16, BAR, [[4, 0, 'Eb4']]),
      wavesFar: scatter(16, BAR, [[0, 3, 'C4'], [9, 2, 'D4'], [13, 5, 'C#4']]),
    }, 16),

    // The hush: one harp, the vibes, the coast cell slowed and said back.
    still: fit('still', {
      leadSoft: SLOW_CELL,
      echo: SLOW_ECHO,
      // Thinned to two notes a bar, so the hush is quieter than what's round it.
      ripple: patter(cells('D5 A5 B5', 8), [0, '.', '.', 2, '.', '.']),
      low: onNotes(STILL_BASS, LOW),
      vibes: pad(STILL_CHORDS, 2, 4),
      hum: [...rest(4), ...pad('Em C D D', 0, 3)],
      drips: drips(8, 3, 173),
      waves: scatter(8, BAR, [[0, 0, 'F4']]),
      wavesFar: scatter(8, BAR, [[5, 3, 'D4']]),
    }, 8),

    // Home: the hook on the ocarina with the flute an octave under; everyone.
    A3: fit('A3', {
      lead: HOOK,
      flute: up(HOOK, -12),
      echo: ECHO,
      ripple: ripple(16),
      glints: glints(16),
      low: onNotes(A_BASS, LOW),
      pizz: arpeggio(A_CHORDS, BAR, 3, ['.', '.', 'third', '.', 7, '.']),
      violas: pad(A_CHORDS, 1, 3),
      violins: pad(A_CHORDS, 2, 4),
      ah: pad(A_CHORDS, 0, 3, 2),
      drips: drips(16, 4, 211),
      plinks: drips(16, 2, 257),
      waves: scatter(16, BAR, [[2, 4, 'D4'], [11, 0, 'E4']]),
      wavesFar: scatter(16, BAR, [[7, 2, 'C4'], [15, 3, 'C#4']]),
    }, 16),

    // The ripple alone on G, thinning; a drip, a wave; and round.
    out: fit('out', {
      ripple: [...ripple(3), ...patter(['D5 A5 B5'], [0, '.', '.', '.', '.', '.'])],
      low: onNotes('G1 G1 G1 G1', LOW),
      vibes: held('D5', 4 * BAR),
      drips: scatter(4, BAR, [[0, 4, 'G6'], [2, 1, 'D7']]),
      waves: scatter(4, BAR, [[1, 0, 'Eb4']]),
    }, 4),
  },

  // The intro once, then round from A.
  order: ['intro', 'A', 'A2', 'B', 'still', 'A3', 'out'],
  loopFrom: 1,
};
