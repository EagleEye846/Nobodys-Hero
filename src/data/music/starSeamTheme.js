import {
  melody, arpeggio, chordLine, sustained, held, midi, hits, repeat,
  rest as restBars, after as afterBars, BAR_44 as BAR,
} from './parts/chapter4.js';
import { drops } from './parts/chapter3.js';
import { starFall } from './parts/starGuardians.js';

// "Something Hums Below": the secret seam under Seam Nine (The Scorch, The
// Glassworks, The Last Camp and Pudding's Pool). The star came down through
// the roof here and glazed the rock to glass, and the miners laid their line
// across it anyway, until one day they sat down to lunch at the last camp
// and never came back. A tin mug, a kettle, a tea shelf; seven hats left
// tidy. And from somewhere under all of it, a hum.
//
// So the song is deep and glassy and lit from inside: a harp turning the
// same three notes over and over like light in a prism, the real glass
// carrying the tune, a pizzicato bass under it, and the hum itself (a choir,
// muffled and a little flat, the very same voice the olm has in its own
// fight) never quite going away. Nothing loud, no brass and no big cellos:
// it is an area theme, and the danger is still a room or two off. It leans
// forward instead: every time round it gets a little nearer the pool.
// Reference for the mood only: Hollow Knight's Crystal Peak and City of
// Tears (one small figure that never changes while the bass moves under it,
// so the same notes keep turning into new chords), and Toby Fox's habit of
// letting the area play the boss's tune before you meet the boss.
//
// THE HOOK is the miners' end-of-shift whistle (three long notes down, one
// short note up: B G E, F#), set in a 3 + 3 + 2 lilt so it rocks; the same
// four notes the olm's fight ("Seven Mugs", puddingBattleTheme.js) is built
// on, in the same key. Its second call climbs (A B, C A F#, G), the whistle
// comes again, and then THE FALLING STAR (parts/starGuardians.js: E6 B5
// B-flat5 E5, the motif every star guardian shares) closes the phrase, with
// the crack in it, the B flat, sitting on a C chord so it sounds like a
// question. It ends a semitone short of home, on D sharp, every time.
//
// THE PRISM (the ostinato): E5 B5 F#5 on the harp, 3 + 3 + 2, the same notes
// whatever the chord. Over E minor they are the root and the ninth; over C,
// the major seventh and the sharp eleventh; over D, the ninth and the sixth.
//
// THE CHAPTER'S TUNE (the "first cell", parts/chapter4.js) is the climb:
// D G B A over C, then A D F# E, then G C E D, on the flute, while the
// violas hold the whistle under it one note a bar.
//
// THE LAST CAMP is a waltz, the only bars in 3/4: the whistle on an old
// music-box piano, whole this time, both calls, and then it stops one note
// short of home and a tin mug clinks in the gap. The olm's own fight is a
// waltz on the same tune; this is where it is first heard. (The camp room
// starts the song here: `musicFrom: 'camp'`.)
//
// E minor, 84 BPM, one step a 16th: a 4/4 bar is about 2.86 seconds, a
// waltz bar 2.14. The hum plays once (4 bars, 11s); then it loops from A,
// 34 bars of 4/4 and 12 of 3/4, about 2m03s:
//
//   hum     4 bars  the hum alone, the star falling once on the glass, then
//                   low on the chimes; the prism starts turning; a drip
//   A       8 bars  THE HOOK on the glass, the prism, the pizzicato bass
//                   in 3 + 3 + 2, the hum under it
//   A2      8 bars  the solo violin takes the hook, the glass answers it,
//                   a choir and soft strings breathe, a heartbeat comes in
//   B       8 bars  the climb, G major: the chapter's cell on the flute,
//                   the harp turning twice as fast, the whistle on the
//                   violas a note a bar, the star low on the chimes at the
//                   top, ending on the dominant
//   camp   12 bars  (3/4) the tea break: the whistle as a music-box waltz,
//                   the harp's oom-pah, the mug in the gap where the tune
//                   should come home, the star once on the glass
//   A3      8 bars  the hook with everybody: violin and glass and flute, a
//                   violin line moving under it, tremolo strings, the
//                   choir; the nearest it gets
//   below   2 bars  the hum alone again, and the chimes whistle the first
//                   three notes back up from below; nobody answers

const BAR3 = 12;                              // a 3/4 bar, in 16ths
const rest = (bars, bar = BAR) => restBars(bars, bar);
const after = (bars, track) => afterBars(bars, track, BAR);
const tune = (text) => melody(text, 2);       // each token an 8th
const quarters = (text) => melody(text, 4);   // each token a quarter
const up = (steps, semitones) => steps.map((n) => (typeof n === 'number' ? n + semitones : n));
// Fails loudly if a section's tracks are not all the same whole number of bars.
const tight = (name, section, bars, bar = BAR) => {
  for (const [track, steps] of Object.entries(section)) {
    if (steps.length !== bars * bar) throw new Error(`Something Hums Below ${name}: '${track}' is ${steps.length} steps, not ${bars} bars`);
  }
  return section;
};

// --- The harmony, a bar each. ---
const A_CHORDS = 'Em D Am C Em B C B';
const B_CHORDS = 'C G D Em C G D B';
const CAMP_CHORDS = 'Em C Am D D B B B Em C Am B';

// --- THE HOOK: the whistle, its climbing answer, the whistle, the star. ---
const HOOK = tune(`
  B5 - - G5 - - E5 - | F#5 - - - . . A5 B5 | C6 - - A5 - - F#5 - | G5 - - - - - . . |
  B5 - - G5 - - E5 - | F#5 - - - A5 - B5 - | E6 B5 Bb5 - E5 - - - | D#5 - - - - - . . |
`);
// A violin line for the last time round: it moves where the hook holds.
const UNDER = tune(`
  G4 - - - - - B4 - | A4 - - - D5 - - - | C5 - - - - - E5 - | E5 - - - D5 - C5 - |
  B4 - - - - - G4 - | A4 - - - F#4 - - - | G4 - - - - - - - | F#4 - - - B4 - - - |
`);

// --- THE PRISM: E5 B5 F#5, 3 + 3 + 2, whatever the chord. ---
const [E5, B5, Fs5] = [midi('E5'), midi('B5'), midi('F#5')];
const PRISM = [E5, '.', '.', B5, '.', '.', Fs5, '.', E5, '.', '.', B5, '.', '.', Fs5, '.'];
// Only its first notes (the start and the end of the song).
const PRISM_THIN = [E5, '.', '.', B5, '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'];

// --- The bass: the root, the fifth, the octave, on the same 3 + 3 + 2. ---
const LILT = [0, '-', '-', '-', '-', '-', 7, '-', '-', '-', '-', '-', 12, '-', '-', '-'];
const ROOT = [0, ...Array(BAR - 1).fill('-')];
// The heartbeat (a soft frame drum), on the same lilt.
const BEAT = hits('x.....x.........');

// --- THE CLIMB: the chapter's cell three times, rising, on the flute. ---
const CLIMB = tune(`
  D5 - G5 - B5 - A5 - | G5 - - - D5 - - - | A4 - D5 - F#5 - E5 - | E5 - - - B4 - - - |
  G5 - C6 - E6 - D6 - | D6 - - - B5 - - - | C6 - B5 - A5 - F#5 - | D#6 - - - B5 - - - |
`);
// The whistle under the climb, a note a bar, on the violas.
const WHISTLE_SLOW = [...rest(4), ...['B3', 'G3', 'E4', 'F#3'].flatMap((n) => held(n, BAR))];
// The harp turning twice as fast in the climb: light round a prism.
const TURN = [0, 7, 12, 'tenth', 19, 'tenth', 12, 7, 0, 7, 12, 'tenth', 19, 24, 19, 12];

// --- THE CAMP: the whistle as a waltz, both calls, one short of home. ---
const CAMP_TUNE = quarters(`
  B5 - - | G5 - - | E5 - - | F#5 - . | A5 - - | F#5 - - | D#5 - - | . . . |
  . . . | . . . | . . . | . . . |
`);
// The star in the waltz's own rhythm (quick, quick, a breath, long).
const CAMP_STAR = [...rest(9, BAR3), ...quarters('E6/B5 Bb5 E5'), ...rest(2, BAR3)];
// Oom-pah-pah: the root low, then two chord notes.
const OOM = [0, '.', '.', '.', 'tenth', '.', '.', '.', 19, '.', '.', '.'];
// Two clinks of a mug in the gap where the tune doesn't come home, and one
// more as the waltz ends.
const MUG = [...rest(7, BAR3), ...hits('....x...x...'), ...rest(3, BAR3), ...hits('........x...')];

// --- The star, falling: on the glass (an 8th a token), or low and slow on the chimes. ---
const STAR_GLASS = starFall('E5');
const STAR_CHIMES = starFall('E4', { unit: 4 }); // two bars long

// Drips, now and then, high on the harp (seeded: they fall the same way every time).
const drip = (chords, seed, chance = 0.08) => drops(chords, BAR, chance, seed, 4);

// The hum, under everything: E, low, held as long as the section.
const hum = (bars, bar = BAR) => held('E3', bars * bar);

export const STAR_SEAM_THEME = {
  title: 'Something Hums Below',
  bpm: 84,
  stepsPerBeat: 4,
  // An area theme, level with the Diggings' others.
  volume: 0.95,

  instruments: {
    // The tune: the real glass, slow to speak and ringing on.
    glass: { sample: 'glass', volume: 0.3, attack: 0.03, release: 1.1, reverb: 0.7, pan: 0.1, echo: { time: 0.536, feedback: 0.22, mix: 0.18 }, humanize: { time: 0.008, volume: 0.1 } },
    violin: { sample: 'soloViolin', volume: 0.24, attack: 0.14, release: 0.9, reverb: 0.65, pan: -0.08, humanize: { time: 0.01, volume: 0.1 } },
    under: { sample: 'soloViolin', volume: 0.15, attack: 0.2, release: 0.9, reverb: 0.65, pan: -0.3, humanize: { time: 0.012, volume: 0.1 } },
    flute: { sample: 'flute', volume: 0.24, attack: 0.08, release: 0.7, reverb: 0.65, pan: 0.18, humanize: { time: 0.01, volume: 0.1 } },
    // The prism, and the camp's oom-pah.
    harp: { sample: 'harp', volume: 0.22, ring: true, reverb: 0.55, pan: -0.22, humanize: { time: 0.008, volume: 0.15 } },
    // Water dripping somewhere, high on the harp, with an echo off the glass.
    drip: { sample: 'harp', volume: 0.09, ring: true, reverb: 0.8, pan: 0.4, echo: { time: 0.4, feedback: 0.35, mix: 0.4 } },
    // The plucked double bass on the 3 + 3 + 2.
    bass: { sample: 'bassPizz', volume: 0.34, ring: true, reverb: 0.3, humanize: { time: 0.006, volume: 0.12 } },
    // THE HUM: the olm's own voice in its fight, muffled and a little flat,
    // heard from much further off; and a bowed vibraphone glowing on top of it,
    // one held E (its recordings are far apart, so it stays on the one note).
    hum: { sample: 'choir', volume: 0.15, attack: 1.4, release: 1.6, detune: -12, muffle: 1000, reverb: 0.75, pan: -0.1 },
    glow: { sample: 'vibesBowed', volume: 0.14, attack: 0.7, release: 1.5, reverb: 0.75, pan: 0.2 },
    // Soft breath under the tune: a choir and high strings, slow.
    choir: { sample: 'choir', volume: 0.11, attack: 0.7, release: 1.2, reverb: 0.7, pan: 0.15 },
    strings: { sample: 'violins', volume: 0.12, attack: 0.7, release: 1.2, reverb: 0.6, pan: 0.25 },
    violas: { sample: 'violas', volume: 0.2, attack: 0.4, release: 1, reverb: 0.6, pan: -0.15 },
    trem: { sample: 'violinsTrem', volume: 0.07, attack: 0.6, release: 1, reverb: 0.6, pan: 0.3 },
    // The star, deep, on tubular bells; and a glint up high now and then.
    chimes: { sample: 'chimes', volume: 0.15, ring: true, reverb: 0.75, pan: -0.25 },
    glint: { sample: 'glock', volume: 0.08, ring: true, reverb: 0.7, pan: 0.35, echo: { time: 0.536, feedback: 0.3, mix: 0.3 } },
    // The camp's music box: an old piano up high, a touch out of tune.
    box: { sample: 'grandPiano', volume: 0.15, ring: true, detune: -14, drift: 5, reverb: 0.6, pan: 0.15, humanize: { time: 0.01, volume: 0.12 } },
    // A tin mug set down (a ride cymbal's bell, pitched up and dulled, as in
    // the olm's fight), and a soft heartbeat.
    mug: { sample: 'rideBell', drum: 'sample', volume: 0.05, ring: true, detune: 600, muffle: 6000, reverb: 0.45, pan: 0.35, humanize: { time: 0.008, volume: 0.3 } },
    beat: { sample: 'frameDrum', drum: 'sample', volume: 0.14, ring: true, reverb: 0.45, humanize: { time: 0.004, volume: 0.2 } },
  },

  sections: {
    // The hum alone; the star falls once on the glass, then low on the
    // chimes; the prism starts turning, a drip.
    hum: tight('hum', {
      hum: hum(4),
      glow: [...rest(1), ...held('E4', 3 * BAR)],
      glass: [...STAR_GLASS, ...rest(3)],
      chimes: [...rest(1), ...STAR_CHIMES, ...rest(1)],
      harp: [...rest(2), ...PRISM_THIN, ...PRISM],
      bass: [...rest(3), ...chordLine('Em', ROOT, 2)],
      drip: [...rest(1), ...drip('Em Em Em', 11, 0.12)],
    }, 4),

    // THE HOOK on the glass, over the prism and the pizzicato lilt.
    A: tight('A', {
      glass: HOOK,
      harp: repeat(PRISM, 8),
      bass: chordLine(A_CHORDS, LILT, 2),
      hum: hum(8),
      glow: held('E4', 8 * BAR),
      drip: drip(A_CHORDS, 23),
    }, 8),

    // The violin takes the hook, the glass answers its long notes; a choir
    // and soft strings come in, and a heartbeat.
    A2: tight('A2', {
      violin: HOOK,
      glass: tune(`
        . . . . . . . . | . . . . E6 - D6 - | . . . . . . . . | . . . . B5 - G5 - |
        . . . . . . . . | . . . . . . . . | . . . . . . . . | . . . . F#5 - B5 - |
      `),
      harp: repeat(PRISM, 8),
      bass: chordLine(A_CHORDS, LILT, 2),
      hum: hum(8),
      choir: sustained(A_CHORDS, BAR, 2, 4),
      strings: after(4, sustained(A_CHORDS, BAR, 1, 5)),
      beat: after(4, repeat(BEAT, 8)),
      glint: [...rest(1), ...tune('. . . . B6 - F#6 -'), ...rest(3), ...tune('. . . . G6 - B6 -'), ...rest(2)],
    }, 8),

    // The climb, G major: the cell on the flute, the harp turning twice as
    // fast, the whistle under it on the violas, the star low at the top.
    B: tight('B', {
      flute: CLIMB,
      violas: WHISTLE_SLOW,
      harp: arpeggio(B_CHORDS, BAR, 3, TURN),
      bass: chordLine(B_CHORDS, LILT, 2),
      hum: hum(8),
      glow: held('E4', 8 * BAR),
      choir: after(4, sustained(B_CHORDS, BAR, 1, 4)),
      beat: repeat(BEAT, 8),
      chimes: [...rest(6), ...STAR_CHIMES],
      glint: [...rest(4), ...tune('B6 - . . G6 - . .'), ...rest(3)],
    }, 8),

    // The tea break, in 3/4: the whistle on the music box, both calls, one
    // note short of home; the mug in the gap; the star once on the glass.
    camp: tight('camp', {
      box: up(CAMP_TUNE, 12),
      glass: CAMP_STAR,
      harp: chordLine(CAMP_CHORDS, OOM, 2),
      hum: [...held('E3', 8 * BAR3), ...held('E3', 4 * BAR3)],
      glow: held('E4', 12 * BAR3),
      mug: MUG,
    }, 12, BAR3),

    // The hook with everybody: violin and glass and flute together, a
    // second violin moving under it, tremolo strings, the choir.
    A3: tight('A3', {
      violin: HOOK,
      glass: HOOK,
      flute: up(HOOK, -12),
      under: UNDER,
      harp: repeat(PRISM, 8),
      bass: chordLine(A_CHORDS, LILT, 2),
      hum: hum(8),
      choir: sustained(A_CHORDS, BAR, 2, 4),
      strings: sustained(A_CHORDS, BAR, 1, 5),
      trem: sustained(A_CHORDS, BAR, 0, 5),
      beat: repeat(BEAT, 8),
      glint: [...rest(5), ...tune('B6 - . . G6 - . .'), ...rest(2)],
      drip: drip(A_CHORDS, 37, 0.05),
    }, 8),

    // The hum alone; the chimes whistle the first three notes back up from
    // below, and nobody answers.
    below: tight('below', {
      hum: hum(2),
      glow: held('B3', 2 * BAR),
      harp: [...PRISM_THIN, ...rest(1)],
      chimes: tune('B4 - - G4 - - E4 - | - - - - . . . .'),
      bass: [...chordLine('Em', ROOT, 2), ...rest(1)],
    }, 2),
  },

  // The hum plays once; then the seam goes round from the hook.
  order: ['hum', 'A', 'A2', 'B', 'camp', 'A3', 'below'],
  loopFrom: 1,
};
