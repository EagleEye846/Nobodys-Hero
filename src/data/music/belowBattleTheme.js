import { melody, midi, hits, repeat, arpeggio, chordLine, sustained } from './parts/chapter4.js';
import { SAMPLE_SETS } from '../../audio/sampleSets.js';

// "Scurry": the battle theme for every ordinary fight underground in
// Chapter 4, in the Glimmering, the Diggings, the Stillwater and the Deep:
// snails with lamps in their shells, crystal mites, drill beetles, little
// lumps of slag, pale fish, olms, the murk and the gnawers. All small, all
// quick, all in the dark, but there are so many of them, and the dark is
// so big. So it's a tarantella, the spider's dance, played by a real
// orchestra: a fast 12/8 that never sits still, and under everything the
// "legs", low spiccato cellos skittering in sixteenths, a twitch up and
// back down like something with too many feet running along a wall. On top,
// a staccato piano and a flute play the tune in unison, quick and a bit
// sly, with cellos singing it underneath. It never cheers up: it stays in
// the minor all the way round (the first version had a bright B flat
// crystal part, an oom-pa-pa and claps, and came out too happy; it's kept in
// notes/music-backup-2026-10-30). It starts small (plucked bass, a hand
// drum, a tapping tenor drum, bells in the crystal part) and the
// swarm gathers: war drums creep in under the hook, brass stabs join the
// chase, then a build of racing strings and rolling drums, a beat of dead
// silence, and THE DROP: gong, bass drum and a low brass BRAAAM, with
// trumpets, horns and trombones blaring the tune over galloping timpani.
// Then THE SIEGE (the brass stretch the four-note cell to a bar a note
// while the strings race the hook beneath them), and then everything a step
// higher for the last lap before it goes round again. Reference for
// the shape: the trailer's "Nobody Came" (trailerTheme.js) and "Who Would
// Be Hero" (usurperHeroTheme.js); for the mood, Toby Fox's quick fights
// (the bounce of "Spider Dance") and Koji Kondo's nervous, fun dungeon
// tunes. Only recorded instruments are used (no synths, no choir: there is
// no free recorded choir).
//
// THE CHAPTER'S TUNE (the "first cell", parts/chapter4.js): up a fourth, up
// a third, a step down. In G minor it is D G Bb A, and the hook opens with
// it twice, the second time flicking up to the high D. Bar 3 says it again on
// E flat (Bb Eb G F). The crystal part slows it to long notes, then says it
// on C minor and on the flat A (C F Ab G, Eb Ab C Bb), and the bells answer
// with it in sixteenths high up. In the dark part a low clarinet creeps through it a chord at a
// time, slowly, on E flat, on C minor, on the flat A that doesn't belong.
// In the chase a violin and the piano throw it back and forth. In the drop
// the brass play the hook in octaves; in the last lap it is a step higher
// (A minor) with the violins and piccolo singing it and a slow counter-line
// underneath.
//
// G minor, 12/8 at 132 dotted quarters a minute, one step a 16th (six to a
// beat, 24 to a bar): a bar is 1.82 seconds. The intro plays once (2 bars,
// 3.6s); then it loops from A, 60 bars, about 1m49s (0:00 is the start of
// the intro):
//
//   intro   2 bars  0:00  the legs alone, then the drums and the plucked bass
//   A       8 bars  0:03  THE HOOK: piano and flute over the legs, plucked
//                         bass, the tarantella tap on the tenor drum, a low
//                         horn pad and a timpani heartbeat underneath; cellos
//                         sing it from bar 3 and war drums creep in at bar 5
//   B       8 bars  0:18  the crystals: still G minor, leaning on the flat A,
//                         a long-note tune on flute and oboe, harp running,
//                         the bells answering with the cell; violas
//                         shimmering; no legs;
//                         a tuba and a timpani heartbeat keep the floor
//   C       8 bars  0:33  something in the dark: a low clarinet on the slowed
//                         cell, violins holding one high D, the legs twitching
//                         by half steps, tuba and trombone creeping below,
//                         little piano squeaks; a snare and timpani build
//   D       8 bars  0:47  the chase: a solo violin and the piano throwing the
//                         cell back and forth, trembling cellos, trombone
//                         stabs (trumpet and horn stabs and soft war drums
//                         join for the second half), then a two-bar scurry
//                         in unison
//   build   4 bars  1:02  everything racing and climbing: tremolo violins,
//                         timpani and snare tightening to a roll, horns and
//                         trombones rising, a cymbal swelling... then one
//                         beat of dead silence
//   drop    8 bars  1:09  THE DROP: gong, deep bass drum and a low brass
//                         BRAAAM; the hook blared by trumpets (an octave
//                         down), cellos and piano, horns and trombones two
//                         octaves down, violins racing, tuba on the root,
//                         timpani galloping, war drums
//   siege   8 bars  1:24  THE SIEGE: the same kit, but the brass say the cell
//                         in huge slow notes, a bar each (trumpets, horns an
//                         octave lower, trombones another), while the strings,
//                         piano and flute race the hook underneath
//   lift    8 bars  1:38  up a step to A minor: violins, piccolo, flute and
//                         brass all on the hook, clarinet and oboe on a slow
//                         counter-line, trembling cellos; the last two bars
//                         swing back down to G minor and the war drums let go
//                         in the last half bar, so the loop can start again
//                         on A (loops at 1:53)

const BAR = 24;
const tune = (text) => melody(text, 2);   // each token an 8th
const riff = (text) => melody(text, 1);   // each token a 16th
const slow = (text) => melody(text, 6);   // each token a dotted quarter
const rest = (bars) => Array(bars * BAR).fill('.');
const up = (track, semitones) => track.map((n) => (typeof n === 'number' ? n + semitones : n));
// A doubling that leaves out any note too far from one of its instrument's
// recordings (the piccolo, the bells and the violins only reach so far).
const playable = (track, set) => track.map((n) => (
  typeof n === 'number' && SAMPLE_SETS[set].notes.every((r) => Math.abs(r - n) > 2) ? '.' : n));
// The same for a brass or wind line that has to stay in one piece: a note
// anywhere inside the recorded span plays (stretched from the nearest
// recording, as the horns' gap from C4 to D5 needs), and only one more than
// `reach` semitones past either end of it is left out (a gap in a doubling is
// better than a note an octave away).
const reachable = (track, set, reach = 2) => {
  const notes = SAMPLE_SETS[set].notes;
  const low = Math.min(...notes) - reach;
  const high = Math.max(...notes) + reach;
  return track.map((n) => (typeof n === 'number' && (n < low || n > high) ? '.' : n));
};
// A track for bars `from` to `to` (counting from 0), silent elsewhere.
const only = (from, to, track) => track.map((n, i) => (i >= from * BAR && i < to * BAR ? n : '.'));
// A track with its first `bars` bars silent.
const after = (bars, track) => [...rest(bars), ...track.slice(bars * BAR)];
// Chords are written two to a bar (each lasts half a bar, two beats).
const halves = (text) => text.replace(/\|/g, ' ');

const A_HALVES = halves('Gm Gm | Gm D | Eb Eb | F F | Gm Gm | Eb Eb | Cm D | Gm D');
const B_HALVES = halves('Gm Gm | Eb Eb | Cm Cm | Ab D | Gm Gm | Eb Cm | Ab Fm | D D');
const C_HALVES = halves('Eb Eb | D D | Eb Eb | D D | Cm Cm | Gm Gm | Ab Ab | D D');
const D_HALVES = halves('Gm Gm | Cm Cm | Fm Fm | Bb Eb | Cm Cm | Gm Gm | A A | D D');

// --- THE HOOK: the cell twice (D G Bb A), the second flicked up; the cell
// again on E flat in bar 3. Each token an 8th, three to a beat. ---
const HOOK_BARS = `
  D5 G5 Bb5 A5 . G5 D5 G5 Bb5 A5 . D6 | C6 Bb5 A5 Bb5 A5 G5 F#5 G5 A5 D5 . .
  Bb4 Eb5 G5 F5 . Eb5 Bb4 Eb5 G5 F5 . Bb5 | A5 G5 F5 G5 F5 Eb5 D5 Eb5 F5 C5 . .
  D5 G5 Bb5 A5 . G5 Bb5 D6 G6 F6 . D6 | Eb6 D6 C6 Bb5 C6 Bb5 G5 . Eb5 G5 . Bb5
  C6 . Bb5 A5 . G5 F#5 . A5 D6 . C6 |
`;
// The first time it climbs by half steps into the crystal part; the second
// time it stops, a beat of nothing, and the loop starts again.
const HOOK = tune(`${HOOK_BARS} Bb5 A5 G5 D5 . G4 . . . D5 Eb5 E5`);
const HOOK2 = tune(`${HOOK_BARS} Bb5 A5 G5 D5 . G4 . . . . . .`);
// THE SIEGE: the cell stretched to a bar a note (it takes the brass eight
// bars to say it twice) while the strings, piano and flute keep racing
// through the hook underneath.
const SLOW_CELL = slow('D5 - - - G5 - - - Bb5 - - - A5 - - - Bb4 - - - Eb5 - - - G5 - - - F#5 - - -');
// The oboe's counter-line in the last hook, a dotted quarter a token.
const COUNTER = slow(`
  Bb4 - D5 C5 | Bb4 - A4 - | G4 - Bb4 Eb5 | D5 - C5 - | D5 - Bb4 G4 | G4 - Bb4 - | Eb5 - D5 - | D5 - . .
`);

// --- B: the crystals. The cell in long notes, then on C minor and on the
// flat A, holding still while the bells answer in its gaps. ---
const GLINT = tune(`
  D5 - - G5 - - Bb5 - - A5 - G5 | Bb5 - - - - G5 Eb5 - - . . .
  C5 - - F5 - - Ab5 - - G5 - F5 | Ab5 - - - - Eb5 F#5 - - . . .
  D5 - - G5 - - Bb5 - - D6 - Bb5 | Bb5 - - G5 - Eb5 C6 - - G5 - Eb5
  C6 - - Ab5 - Eb5 F5 - - Ab5 - C6 | Bb5 - - A5 - - F#5 - - D5 - -
`);
// The bells: a ding on the downbeats, and the cell in the tune's gaps.
const BELLS = riff(`
  G6 . . . . . . . . . . . . . . . . . . . . . . . | . . . . . . . . . . . . D6 . G6 . Bb6 . A6 - - - - -
  C7 . . . . . . . . . . . . . . . . . . . . . . . | . . . . . . . . . . . . Eb6 . Ab6 . C7 . Bb6 - - - - -
  G6 . . . . . . . . . . . . . . . . . . . . . . . | . . . . . . . . . . . . . . . . . . . . . . . .
  Ab6 . . . . . . . . . . . . . . . . . . . . . . . | A6 . . . . . . . . . . . D7 . . . . . . . . . . .
`);

// --- C: in the dark. The cell slowed to a dotted quarter a note, low on the
// clarinet, a chord at a time, with gaps for the squeaks. ---
const CREEP = tune(`
  Bb3 - - Eb4 - - G4 - - F4 - - | F#4 - - - - - . . . . . .
  Bb3 - - Eb4 - - G4 - - Bb4 - - | A4 - - F#4 - - . . . . . .
  G4 - - C5 - - Eb5 - - D5 - - | D5 - - Bb4 - - G4 - - . . .
  Eb4 - - Ab4 - - C5 - - Bb4 - - | A4 - - F#4 - - D4 - - . . .
`);
// Little squeaks high on the piano, in the clarinet's gaps.
const SQUEAK = tune(`
  . . . . . . . . . . . . | . . . . . . Eb6 D6 . Eb6 D6 .
  . . . . . . . . . . . . | . . . . . . Eb6 D6 . C#6 D6 .
  . . . . . . . . . . . . | . . . . . . . . . Ab6 G6 .
  . . . . . . . . . . . . | . . . . . . . . . Eb6 D6 .
`);
// Drips: one bell note, now and then.
const DRIPS = riff(`
  . . . . . . . . . . . . . . . . . . D7 . . . . . | . . . . . . . . . . . . . . . . . . . . . . . .
  . . . . . . . . . G6 . . . . . . . . . . . . . . | . . . . . . . . . . . . . . . . . . . . . . . .
  . . . . . . . . . . . . . . . . . . Bb6 . . . . . | . . . . . . . . . . . . . . . . . . . . . . . .
  . . . . . . . . . A6 . . . . . . . . . . . . . . | . . . . . . . . . . . . . . . . . . . . . . . .
`);

// --- D: the chase. The violin runs, the piano throws the cell back. ---
const CHASE_VN = tune(`
  G5 A5 Bb5 D6 . Bb5 G5 A5 Bb5 C6 . D6 | Eb6 D6 C6 G5 . . . . . . . .
  F5 G5 Ab5 C6 . Ab5 F5 G5 Ab5 Bb5 . C6 | D6 C6 Bb5 F5 . . . . . . . .
  C6 D6 Eb6 G6 . Eb6 C6 D6 Eb6 F6 . G6 | G6 F6 Eb6 D6 . . . . . . . .
`);
const CHASE_PNO = tune(`
  . . . . . . . . . . . . | . . . . . . G5 C6 Eb6 D6 . .
  . . . . . . . . . . . . | . . . . . . Bb5 Eb6 G6 F6 . .
  . . . . . . . . . . . . | . . . . . . D6 G6 Bb6 A6 . .
`);
// And both together for the last two bars: a scurry on A, then on D.
const SCURRY = riff(`
  E5 F5 E5 C#5 A4 C#5 E5 F5 E5 C#5 A4 C#5 E5 G5 E5 C#5 A4 G4 A4 C#5 E5 A5 G5 E5
  F#5 G5 F#5 D5 A4 D5 F#5 A5 F#5 D5 A4 D5 C6 - - - - - . . . . . .
`);

// --- Patterns, half a bar (two beats) each. ---
// The legs: a twitch up the scale and back, and a step under the root.
const LEGS = [0, 2, 'third', 2, 0, -1, 0, 2, 'third', 2, 0, -1];
// In the dark they only twitch by half steps.
const LEGS_DARK = [0, 1, 0, -1, 0, 1, 0, '.', 0, 1, 0, '.'];
// The plucked bass: the root, then the fifth above.
const BASS = [0, '-', '.', '.', '.', '.', 7, '-', '.', '.', '.', '.'];
const BASS_SLOW = [0, '-', '-', '-', '.', '.', '.', '.', '.', '.', '.', '.'];
// The harp running in 8ths in the crystal part.
const HARP = [0, '.', 7, '.', 'tenth', '.', 12, '.', 7, '.', 'third', '.'];

// --- Drums, a bar each. ---
const TAP = hits('x...x.x...x.x...x.x...x.');   // the tarantella: long, short
const FRAME = hits('x...........x...........');
const FRAME_ALL = hits('x.....x.....x.....x.....');
const SKITTER = hits('..x.x...x.x...x.x...x.xx');
const TOMS = hits('x.....................x.');
const BUILD = hits('x.....x.....x..x..x.x.xx');
const ROLL = hits('x.x.x.x.x.x.x.x.xxxxxxxx');
const crashOn = (bars, ...at) => Array.from({ length: bars }, (_, i) => (at.includes(i) ? ['x', ...Array(BAR - 1).fill('.')] : Array(BAR).fill('.'))).flat();
// A bar of the build at the end of every fourth bar.
const tapping = (bars) => Array.from({ length: bars }, (_, i) => ((i + 1) % 4 === 0 ? BUILD : TAP)).flat();

const strings = (chords) => ({
  legs: chordLine(chords, LEGS, 3),
  bass: chordLine(chords, BASS, 2),
});

// --- Helpers for the big band. ---
const held = (note, steps) => [note, ...Array(steps - 1).fill('-')];
// One note held `steps` steps at the start of an 8-bar section, then silence.
const oneNote = (note, steps) => [...held(note, steps), ...Array(8 * BAR - steps).fill('.')];
// A track with everything from step `from` on silenced (for the beat of
// silence before the drop).
const cut = (track, from) => track.map((n, i) => (i >= from ? '.' : n));
// A hit (or a note) every `n` steps, for `len` steps.
const everyN = (n, len, value = 'x') => Array.from({ length: len }, (_, i) => (i % n === 0 ? value : '.'));
// Pitched tracks of an 8-bar section as the hook has them: the first six
// bars a step higher (A minor), the last two back in G minor.
// The war drums stop in the last half bar of the lap, so the song doesn't
// fall off a cliff into the small, quiet start of the next one.
const easeOut = (track) => track.map((n, i) => (i >= 7 * BAR + 12 ? '.' : n));
const lifted = (track, shift = 0) => [...up(track.slice(0, 6 * BAR), shift + 2), ...up(track.slice(6 * BAR), shift)];

// Timpani: five real drums, so every chord's root lands between F2 and E3
// where they're tuned. -5 is the fifth below.
const timpRoot = (chord) => 41 + ((midi(`${chord.replace(/m$/, '')}4`) % 12) - 5 + 12) % 12;
const timp = (chords, pattern) => chords.split(/\s+/).filter(Boolean).flatMap((chord) => pattern.map((p) => {
  if (typeof p !== 'number') return p;
  const root = timpRoot(chord);
  return root + (root + p < 41 ? p + 12 : p);
}));
// Half a bar each (one chord): one hit; two hits; the tap, long-short.
const T_BEATS = [0, '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'];
const T_QUARTERS = [0, '.', '.', '.', '.', '.', 0, '.', '.', '.', '.', '.'];
const T_GALLOP = [0, '.', '.', '.', 0, '.', -5, '.', '.', '.', 0, '.'];
// A whole bar each: on the beats; in eighths with a fifth at the end.
const T_BAR_BEATS = everyN(6, BAR, 0);
const T_BAR_EIGHTHS = Array.from({ length: BAR }, (_, i) => (i % 2 === 0 ? (i >= 20 ? -5 : 0) : '.'));

// --- The big drums, a bar each. ---
const GALLOP_DRUM = hits('x...x.x...x.x...x.x...x.');
const BIG_BEATS = hits('x.....x.....x.....x.....');
const BIG_HALVES = hits('x...........x...........');
const BACKBEAT = hits('......x.....x.....x.....');
const DROP_TOMS = hits('x.....x.x...x.....x.....');
// A bar of fill: eighths, then sixteenths.
const FILL = [...everyN(2, 12), ...everyN(1, 12)];

// The last bar of the build, the violins running up by half steps from D
// and stopping a beat early.
const RUN_UP = riff('A4 Bb4 B4 C5 C#5 D5 Eb5 E5 F5 F#5 G5 G#5 A5 Bb5 B5 C6 C#6 D6 . . . . . .');
// The horns climb, a dotted quarter a note.
const HORN_CLIMB = slow('. . . . | . . . . | Bb2 Eb3 G3 Bb3 | C4 C4 D4 D4');
// Racing 16ths for the build.
const EIGHTHS = [0, '.', 7, '.', 12, '.', 7, '.'];
const RACE = [0, 7, 12, 'third', 12, 7, 'tenth', 7];
// A trombone stab on the first beat of a half bar.
const STAB = [0, '-', '-', '-', '.', '.', '.', '.', '.', '.', '.', '.'];

const BUILD_CHORDS = 'Eb Cm Ab D';
const LIFT_HALVES = halves('Am Am | Am E | F F | G G | Am Am | F F | Cm D | Gm D');

// The silent beat: the build stops here, a beat (six steps) before the end.
const STOP = 3 * BAR + 18;
// The cymbal swell peaks 3.18s in (sampleSets.js): at 132 BPM and 6 steps a
// beat that is about 42 steps, so it starts 42 steps before the stop.
const SWELL_STEPS = 42;
const SWELL = [...Array(STOP - SWELL_STEPS).fill('.'), ...held(60, SWELL_STEPS), ...Array(BAR * 4 - STOP).fill('.')];

// The hook, an octave and two octaves down, for the brass.
const HOOK_BRASS = up(HOOK2, -12);
const HOOK_LOW = up(HOOK2, -24);

export const BELOW_BATTLE_THEME = {
  title: 'Scurry',
  bpm: 132,
  stepsPerBeat: 6,
  volume: 1.2,

  instruments: {
    // The tune, staccato piano and a flute in unison.
    piano: { sample: 'grandPiano', volume: 0.46, release: 0.08, reverb: 0.2, pan: 0.1, humanize: { time: 0.004, volume: 0.1 } },
    pianoBig: { sample: 'grandPiano', volume: 0.4, release: 0.1, reverb: 0.25, pan: 0.1, humanize: { time: 0.004, volume: 0.1 } },
    flute: { sample: 'flute', volume: 0.28, attack: 0.01, release: 0.1, reverb: 0.3, pan: -0.15, humanize: { time: 0.005, volume: 0.1 } },
    violinsBig: { sample: 'violinsSpic', volume: 0.3, release: 0.08, reverb: 0.3, pan: 0.3, humanize: { time: 0.005, volume: 0.1 } },
    piccolo: { sample: 'piccolo', volume: 0.12, attack: 0.01, release: 0.08, reverb: 0.3, pan: 0.35, humanize: { time: 0.005, volume: 0.1 } },
    oboe: { sample: 'oboe', volume: 0.2, attack: 0.03, release: 0.15, reverb: 0.3, pan: -0.3, humanize: { time: 0.005, volume: 0.1 } },
    clarinet: { sample: 'clarinet', volume: 0.3, attack: 0.03, release: 0.2, reverb: 0.3, pan: -0.2, humanize: { time: 0.005, volume: 0.1 } },
    fiddle: { sample: 'soloViolin', volume: 0.24, attack: 0.01, release: 0.1, reverb: 0.3, pan: -0.25, humanize: { time: 0.005, volume: 0.1 } },
    // Cellos singing the tune an octave under the piano and flute.
    cellosHook: { sample: 'cellos', volume: 0.36, attack: 0.01, release: 0.1, reverb: 0.25, pan: -0.25, humanize: { time: 0.005, volume: 0.1 } },
    // The legs, the plucks and the crystals.
    legs: { sample: 'cellosSpic', volume: 0.25, release: 0.06, reverb: 0.15, pan: -0.1, humanize: { time: 0.004, volume: 0.2 } },
    legsBig: { sample: 'cellosSpic', volume: 0.3, release: 0.06, reverb: 0.15, pan: -0.1, humanize: { time: 0.004, volume: 0.2 } },
    bass: { sample: 'cellosPizz', volume: 0.44, release: 0.1, reverb: 0.15, humanize: { time: 0.004, volume: 0.1 } },
    basses: { sample: 'bassSpic', volume: 0.34, release: 0.08, reverb: 0.15, humanize: { time: 0.004, volume: 0.1 } },
    harp: { sample: 'harp', volume: 0.18, ring: true, reverb: 0.35, pan: 0.2, humanize: { time: 0.004, volume: 0.15 } },
    bells: { sample: 'glock', volume: 0.12, ring: true, reverb: 0.5, pan: 0.35, echo: { time: 0.34, feedback: 0.3, mix: 0.3 } },
    shimmer: { sample: 'violinsTrem', volume: 0.07, attack: 0.6, release: 0.8, reverb: 0.5, pan: 0.2 },
    // Sustained and trembling strings.
    violasPad: { sample: 'violasTrem', volume: 0.1, attack: 0.5, release: 0.6, reverb: 0.4, pan: -0.2 },
    tremViolins: { sample: 'violinsTrem', volume: 0.14, attack: 0.3, release: 0.4, reverb: 0.4, pan: 0.3 },
    tremCellos: { sample: 'cellosTrem', volume: 0.2, attack: 0.3, release: 0.4, reverb: 0.3, pan: -0.25 },
    // The brass: the roar of the drop.
    hornsPad: { sample: 'hornsSoft', volume: 0.24, attack: 0.3, release: 0.5, reverb: 0.45, pan: -0.1 },
    horns: { sample: 'horns', volume: 0.3, attack: 0.02, release: 0.2, reverb: 0.35, pan: -0.15 },
    hornsSwell: { sample: 'hornsSoft', volume: 0.3, attack: 0.5, release: 0.4, reverb: 0.4, pan: -0.15 },
    trumpet: { sample: 'trumpet', volume: 0.26, attack: 0.01, release: 0.15, reverb: 0.35, pan: 0.15 },
    trombone: { sample: 'trombone', volume: 0.3, release: 0.2, reverb: 0.3, pan: -0.2 },
    tromboneLow: { sample: 'trombone', volume: 0.1, attack: 0.3, release: 0.4, reverb: 0.3, pan: -0.15 },
    tuba: { sample: 'tuba', volume: 0.34, release: 0.25, reverb: 0.25 },
    tubaLow: { sample: 'tuba', volume: 0.1, attack: 0.3, release: 0.4, reverb: 0.25 },
    // The BRAAAM: low trombone, tuba and horns on one note.
    braam: { sample: 'trombone', volume: 0.75, release: 0.6, reverb: 0.45 },
    braamTuba: { sample: 'tuba', volume: 0.7, release: 0.6, reverb: 0.4 },
    braamHorns: { sample: 'horns', volume: 0.5, release: 0.5, reverb: 0.45 },
    // Timpani: a heartbeat, then galloping.
    timpani: { sample: 'timpani', volume: 0.44, ring: true, reverb: 0.3, humanize: { time: 0.004, volume: 0.15 } },
    timpBig: { sample: 'timpani', volume: 0.6, ring: true, reverb: 0.3, humanize: { time: 0.004, volume: 0.15 } },
    // The build's timpani, drums and strings, choked so the silence is silent.
    timpBuild: { sample: 'timpani', volume: 0.3, release: 0.08, reverb: 0.2 },
    timpRoll: { sample: 'timpaniRoll', volume: 0.22, release: 0.05, reverb: 0.3 },
    snareRoll: { sample: 'snare', drum: 'sample', volume: 0.1, release: 0.06, reverb: 0.3, humanize: { time: 0.003, volume: 0.25 } },
    taikoBuild: { sample: 'tenorDrum', drum: 'sample', volume: 0.22, release: 0.1, gate: 2.5, reverb: 0.2 },
    violinsBuild: { sample: 'violinsSpic', volume: 0.12, release: 0.05, reverb: 0.25, pan: 0.3, humanize: { time: 0.005, volume: 0.15 } },
    cellosBuild: { sample: 'cellosSpic', volume: 0.16, release: 0.05, reverb: 0.2, pan: -0.2, humanize: { time: 0.005, volume: 0.15 } },
    bassBuild: { sample: 'bassSpic', volume: 0.18, release: 0.05, reverb: 0.15 },
    hornsBuild: { sample: 'horns', volume: 0.12, release: 0.08, reverb: 0.4, pan: -0.15 },
    tromboneBuild: { sample: 'trombone', volume: 0.12, release: 0.08, reverb: 0.35, pan: -0.2 },
    tremBuild: { sample: 'violinsTrem', volume: 0.1, attack: 0.2, release: 0.05, reverb: 0.4, pan: 0.3 },
    swell: { sample: 'cymbalSwell', volume: 0.3, release: 0.04, reverb: 0.3 },
    // A hand drum and a tapping tenor drum; small.
    frame: { sample: 'frameDrum', drum: 'sample', volume: 0.34, ring: true, reverb: 0.15, humanize: { time: 0.003, volume: 0.15 } },
    tap: { sample: 'tenorDrumHigh', drum: 'sample', volume: 0.18, ring: true, reverb: 0.15, pan: 0.15, humanize: { time: 0.003, volume: 0.25 } },
    tom: { sample: 'tom', drum: 'sample', volume: 0.34, ring: true, reverb: 0.25, pan: -0.15, humanize: { time: 0.004, volume: 0.2 } },
    roll: { sample: 'snareSoft', drum: 'sample', volume: 0.14, release: 0.08, reverb: 0.2, humanize: { time: 0.003, volume: 0.25 } },
    crash: { sample: 'crash', drum: 'sample', volume: 0.16, ring: true, reverb: 0.3 },
    // The war drums and cymbals of the drop.
    taiko: { sample: 'tenorDrum', drum: 'sample', volume: 0.38, ring: true, reverb: 0.25, humanize: { time: 0.004, volume: 0.15 } },
    taikoHigh: { sample: 'tenorDrumHigh', drum: 'sample', volume: 0.26, ring: true, reverb: 0.25, pan: 0.2, humanize: { time: 0.004, volume: 0.2 } },
    bigTom: { sample: 'tom', drum: 'sample', volume: 0.4, ring: true, reverb: 0.3, pan: -0.2, humanize: { time: 0.004, volume: 0.2 } },
    snare: { sample: 'snare', drum: 'sample', volume: 0.3, ring: true, reverb: 0.25, humanize: { time: 0.003, volume: 0.2 } },
    bassDrum: { sample: 'concertBassDrum', drum: 'sample', volume: 0.6, ring: true, reverb: 0.3 },
    // The same drums, softer, for the verses: the war drums are already coming.
    bassDrumSoft: { sample: 'concertBassDrum', drum: 'sample', volume: 0.32, ring: true, reverb: 0.3 },
    taikoSoft: { sample: 'tenorDrum', drum: 'sample', volume: 0.2, ring: true, reverb: 0.25, humanize: { time: 0.004, volume: 0.15 } },
    impact: { sample: 'bassDrumDeep', drum: 'sample', volume: 0.9, ring: true, reverb: 0.4 },
    gong: { sample: 'gong', drum: 'sample', volume: 0.45, ring: true, reverb: 0.3 },
    cymbal: { sample: 'crash', drum: 'sample', volume: 0.3, ring: true, reverb: 0.3 },
  },

  sections: {
    // The legs alone, then the bass, the tap and a tom.
    intro: {
      legs: chordLine(halves('Gm Gm Gm Gm'), LEGS, 3),
      bass: [...rest(1), ...chordLine(halves('Gm Gm'), BASS, 2)],
      tap: [...rest(1), ...BUILD],
      tom: [...rest(1), ...TOMS],
      timpani: [...rest(1), ...timp('Gm Gm', T_BEATS)],
    },

    // THE HOOK over the legs and the plucked bass, a low horn pad and a
    // timpani heartbeat underneath.
    A: {
      piano: HOOK,
      flute: HOOK,
      cellosHook: after(2, reachable(up(HOOK, -12), 'cellos')),
      ...strings(A_HALVES),
      hornsPad: sustained(A_HALVES, 12, 0, 3),
      timpani: timp(A_HALVES, T_BEATS),
      frame: repeat(FRAME, 8),
      tap: tapping(8),
      tom: [...rest(3), ...TOMS, ...rest(3), ...TOMS],
      bassDrumSoft: only(4, 8, repeat(BIG_HALVES, 8)),
      taikoSoft: only(4, 8, repeat(GALLOP_DRUM, 8)),
      crash: crashOn(8, 0),
      swell: [...Array(8 * BAR - SWELL_STEPS).fill('.'), ...held(60, SWELL_STEPS)],
    },

    // The crystals: a long tune on flute and oboe, the harp, the bells
    // answering with the cell. The legs rest; the violas shimmer.
    B: {
      flute: GLINT,
      oboe: up(GLINT, -12),
      bells: BELLS,
      harp: arpeggio(B_HALVES, 12, 3, HARP),
      bass: chordLine(B_HALVES, BASS, 2),
      violasPad: sustained(B_HALVES, 12, 1, 3),
      hornsPad: [...rest(4), ...sustained('Gm Gm Eb Cm Ab Fm D D', 12, 2, 2)],
      tubaLow: sustained(B_HALVES, 12, 0, 2),
      timpani: after(4, timp(B_HALVES, T_BEATS)),
      frame: repeat(FRAME, 8),
      tap: repeat(SKITTER, 8),
      crash: crashOn(8, 0),
    },

    // In the dark: the low clarinet, the violins' one high D, the legs by
    // half steps, squeaks and drips; tuba and trombone creeping below, then
    // a build of timpani and snare into the chase.
    C: {
      clarinet: CREEP,
      piano: SQUEAK,
      bells: DRIPS,
      shimmer: [62 + 24, ...Array(4 * BAR - 1).fill('-'), 62 + 24, ...Array(4 * BAR - 1).fill('-')],
      legs: chordLine(C_HALVES, LEGS_DARK, 3),
      bass: chordLine(C_HALVES, BASS_SLOW, 2),
      tubaLow: sustained(C_HALVES, 12, 0, 2),
      tromboneLow: sustained(C_HALVES, 12, 1, 2),
      tom: repeat(TOMS, 8),
      timpani: [...rest(4), ...timp('Cm Cm Gm Gm', T_QUARTERS), ...timp('Ab Ab D D', T_BEATS)],
      timpRoll: [...rest(7), ...held(timpRoot('D'), BAR)],
      roll: [...rest(6), ...BUILD.map(() => '.'), ...ROLL],
      crash: crashOn(8, 0),
      swell: [...Array(8 * BAR - SWELL_STEPS).fill('.'), ...held(60, SWELL_STEPS)],
    },

    // The chase: the violin and the piano throwing the cell back and
    // forth, then the two-bar scurry together.
    D: {
      fiddle: [...CHASE_VN, ...SCURRY],
      piano: [...CHASE_PNO, ...SCURRY],
      flute: [...rest(6), ...SCURRY],
      ...strings(D_HALVES),
      tremCellos: sustained(D_HALVES, 12, 0, 3),
      trombone: chordLine(D_HALVES, STAB, 2),
      trumpet: only(4, 8, chordLine(D_HALVES, STAB, 4)),
      horns: only(4, 8, chordLine(D_HALVES, STAB, 3)),
      cellosHook: [...reachable(up(CHASE_VN, -12), 'cellos'), ...rest(2)],
      timpani: timp(D_HALVES, T_GALLOP),
      frame: repeat(FRAME_ALL, 8),
      tap: tapping(8),
      bassDrumSoft: only(4, 8, repeat(BIG_HALVES, 8)),
      taikoSoft: only(4, 8, repeat(GALLOP_DRUM, 8)),
      snare: only(4, 8, repeat(BACKBEAT, 8)),
      crash: crashOn(8, 0, 6),
    },

    // The build: strings racing and trembling, timpani and snare tightening
    // into rolls, the horns and trombones climbing, a cymbal swelling... and
    // then everything stops dead for a beat.
    build: {
      violinsBuild: cut([...arpeggio('Eb', BAR, 4, EIGHTHS), ...arpeggio('Cm Ab', BAR, 4, RACE), ...RUN_UP], STOP),
      tremBuild: cut(sustained(BUILD_CHORDS, BAR, 1, 4), STOP),
      cellosBuild: cut([...chordLine('Eb', everyN(6, BAR, 0), 2), ...chordLine('Cm', everyN(3, BAR, 0), 2), ...chordLine('Ab', everyN(2, BAR, 0), 2), ...chordLine('D', everyN(1, BAR, 0), 2)], STOP),
      bassBuild: cut([...chordLine('Eb', everyN(6, BAR, 0), 2), ...chordLine('Cm', everyN(3, BAR, 0), 2), ...chordLine('Ab', everyN(2, BAR, 0), 2), ...chordLine('D', everyN(1, BAR, 0), 2)], STOP),
      hornsBuild: cut(HORN_CLIMB, STOP),
      tromboneBuild: cut(sustained(BUILD_CHORDS, BAR, 0, 2), STOP),
      timpBuild: cut([...timp('Eb', T_BAR_BEATS), ...timp('Cm', T_BAR_EIGHTHS), ...Array(2 * BAR).fill('.')], STOP),
      timpRoll: cut([...rest(2), ...held(timpRoot('Ab'), BAR), ...held(timpRoot('D'), BAR)], STOP),
      snareRoll: cut([...rest(1), ...everyN(4, BAR), ...everyN(2, BAR), ...everyN(1, BAR)], STOP),
      taikoBuild: cut([...rest(1), ...BIG_BEATS, ...everyN(3, BAR), ...everyN(2, BAR)], STOP),
      swell: SWELL,
    },

    // THE DROP. Gong, deep bass drum, cymbal and a low BRAAAM on the
    // downbeat; then the hook on trumpets and horns (an octave down) and
    // trombones (two down), the violins racing, the tuba on the root,
    // timpani galloping, war drums pounding.
    drop: {
      trumpet: HOOK_BRASS,
      horns: reachable(HOOK_LOW, 'horns'),
      trombone: reachable(HOOK_LOW, 'trombone', 3),
      cellosHook: reachable(HOOK_BRASS, 'cellos'),
      violinsBig: playable(HOOK2, 'violinsSpic'),
      pianoBig: HOOK_BRASS,
      braam: oneNote(midi('G1'), 14),
      braamTuba: oneNote(midi('G1'), 14),
      braamHorns: oneNote(midi('G2'), 14),
      tuba: sustained(A_HALVES, 12, 0, 2),
      legsBig: chordLine(A_HALVES, LEGS, 3),
      basses: chordLine(A_HALVES, BASS, 2),
      tremCellos: sustained(A_HALVES, 12, 0, 3),
      timpBig: timp(A_HALVES, T_GALLOP),
      bassDrum: repeat(BIG_HALVES, 8),
      impact: crashOn(8, 0),
      gong: crashOn(8, 0),
      cymbal: crashOn(8, 0, 4),
      taiko: repeat(GALLOP_DRUM, 8),
      taikoHigh: repeat(BACKBEAT, 8),
      bigTom: [...repeat(DROP_TOMS, 7), ...FILL],
      snare: [...repeat(BACKBEAT, 7), ...FILL],
      frame: repeat(FRAME_ALL, 8),
    },

    // THE SIEGE: the same kit, but the brass now say the cell in huge slow
    // notes, a bar each (trumpets, horns an octave down, trombones another
    // octave down), while the strings, piano and flute race the hook
    // underneath. Then the tune is let go and the lift takes it up a step.
    siege: {
      trumpet: reachable(up(SLOW_CELL, -12), 'trumpet'),
      horns: reachable(up(SLOW_CELL, -24), 'horns'),
      trombone: reachable(up(SLOW_CELL, -36), 'trombone', 3),
      violinsBig: playable(HOOK2, 'violinsSpic'),
      pianoBig: HOOK_BRASS,
      flute: HOOK2,
      cellosHook: reachable(HOOK_BRASS, 'cellos'),
      piccolo: playable(up(HOOK2, 12), 'piccolo'),
      tuba: sustained(A_HALVES, 12, 0, 2),
      legsBig: chordLine(A_HALVES, LEGS, 3),
      basses: chordLine(A_HALVES, BASS, 2),
      tremCellos: sustained(A_HALVES, 12, 0, 3),
      tremViolins: sustained(A_HALVES, 12, 2, 4),
      timpBig: timp(A_HALVES, T_GALLOP),
      bassDrum: repeat(BIG_HALVES, 8),
      impact: crashOn(8, 0),
      gong: crashOn(8, 0),
      cymbal: crashOn(8, 0, 4),
      taiko: repeat(GALLOP_DRUM, 8),
      taikoHigh: repeat(BACKBEAT, 8),
      bigTom: repeat(DROP_TOMS, 8),
      snare: repeat(BACKBEAT, 8),
      frame: repeat(FRAME_ALL, 8),
    },

    // The last lap: a step up to A minor, the violins, piccolo and flute
    // singing the hook with the brass, the horns and oboe on a slow
    // counter-line, the cellos trembling, the whole kit. The last two bars
    // are back in G minor, ready to go round.
    lift: {
      trumpet: lifted(HOOK2, -12),
      horns: reachable(lifted(HOOK2, -24), 'horns'),
      trombone: reachable(lifted(HOOK2, -24), 'trombone', 3),
      cellosHook: reachable(lifted(HOOK2, -12), 'cellos'),
      violinsBig: playable(lifted(HOOK2), 'violinsSpic'),
      piccolo: playable(lifted(HOOK2, 12), 'piccolo'),
      flute: lifted(HOOK2),
      pianoBig: lifted(HOOK2, -12),
      oboe: lifted(COUNTER),
      clarinet: lifted(COUNTER, -12),
      hornsSwell: reachable(lifted(COUNTER, -24), 'hornsSoft'),
      tuba: sustained(LIFT_HALVES, 12, 0, 2),
      legsBig: chordLine(LIFT_HALVES, LEGS, 3),
      basses: chordLine(LIFT_HALVES, BASS, 2),
      tremCellos: sustained(LIFT_HALVES, 12, 0, 3),
      tremViolins: sustained(LIFT_HALVES, 12, 2, 4),
      timpBig: easeOut(timp(LIFT_HALVES, T_GALLOP)),
      bassDrum: easeOut(repeat(BIG_HALVES, 8)),
      impact: crashOn(8, 0),
      gong: crashOn(8, 0),
      cymbal: crashOn(8, 0, 2, 4, 6),
      taiko: easeOut(repeat(GALLOP_DRUM, 8)),
      taikoHigh: easeOut(repeat(BACKBEAT, 8)),
      bigTom: easeOut(repeat(DROP_TOMS, 8)),
      snare: easeOut(repeat(BACKBEAT, 8)),
      frame: repeat(FRAME_ALL, 8),
    },
  },

  // The intro plays once; then the fight goes round from the hook.
  order: ['intro', 'A', 'B', 'C', 'D', 'build', 'drop', 'siege', 'lift'],
  loopFrom: 1,
};
