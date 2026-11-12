import { melody, hits, repeat, sustained, transpose, haddockPhrase, tight, scatter } from './parts/chapter5.js';
import { SAMPLE_SETS } from '../../audio/sampleSets.js';

// "Shore Leave": the battle theme for Gullrest's fights, the happy beach of
// chapter 5 (bunting, deckchairs, gulls, sandcastles, an old walrus lightman
// ringing a bell at nothing). A pirate hornpipe for a skirmish on the sand,
// and a fight all the same: the beach is sunny, the song isn't. A fiddle takes a swaggering tune with a dotted kick in
// it ("da-di DUM DUM"), plucked strings chop on every off-beat like a
// squeezebox, a tuba stomps, a bodhran rattles, and every half of the tune
// ends on the hornpipe's three hammer blows (DUM, DUM, DUM) with the whole
// band. Darkened on 8 November 2026 (fights aren't cheery: the jolly first
// version is in notes/music-backup-2026-11-08d/): the home key is A minor
// now, not A mixolydian. The hook and every note of its rhythm are the same,
// but its C sharps and F sharps came down to C and F, and its chords are
// the minor ones (Am, Dm, F in place of A, D, F#m), with E and E7 kept major
// so the G sharp pulls hard back home (the harmonic minor's bite). It still
// takes its turn into F sharp minor for a low brass swagger with a nasty
// flat ninth in it, and climbs to a chromatic run and stops dead before the
// breakdown. A bit more grit than before: short bowed cellos dig in under
// the stomp, a low tremolo A growls under the second half of the tune, and
// in the last time round a tremolo shimmer on the chords takes the
// piccolo's place. There are no hand claps (they made it a party, and this
// is a fight); the crew stamps on the deck instead, on a dry drum, and in
// the breakdown the old walrus's bell rings his tune (in minor now) over an
// F major chord, since the man ringing it will not see the end of the
// chapter.
//
// It is deliberately unlike the coast's other fights: "Salt in the Wound"
// (Corrie's song) and "Cutlass Weather" (the ships' fights) are D minor,
// 6/8, dark and orchestral, with no claps and no afterbeats. This one is
// 4/4, A minor, small band, all afterbeats and stamps. It is the seaside
// cousin of "Dandelion Lion Rag" (Sunnyside's fights): the same size of
// band and the same cheek, but salt in place of straw.
//
// THE COAST CELL (A D D E in D minor, 5 1 1 2; parts/chapter5.js) runs all
// through it, never in its home key:
//   - THE HOOK (two bars, heard four seconds in) opens with the cell in
//     A, re-rhythmed as a dotted hornpipe kick: E, A-A, B ("da-di DUM
//     DUM"), then it climbs on to a held C (a C sharp before it was
//     darkened) and steps back (B A); bar 2 drops onto the G chord, the
//     minor key's flat seventh, and stops for a beat. It is played,
//     climbed a step up the ladder (on D and E), played again, and comes
//     back twice more in the second half: four times in every
//     A section. Each beat it leaves empty gets a quick run from another
//     player (the oboe, then the trumpet), so the gaps answer back;
//   - the bass plays it UPSIDE DOWN on every chord (5 1 1 flat 7: in A,
//     E A A G), so the groove under the whole song is the cell inverted,
//     and the G natural it lands on is the swagger;
//   - the B section's brass swagger opens with it in F sharp minor (C# F#
//     F# G#), low and slow;
//   - in the breakdown the ship's bell rings it in half notes.
// HADDOCK'S MOTIF (3 2 1, the low 5) rings once on the bell in the
// breakdown, in A minor (C B A, E) over F major, so it sounds wistful: the old walrus at his bell, and then one more
// clang a moment later at nothing at all.
//
// A minor, 4/4 at 138 BPM, one step a 16th: a bar is about 1.74
// seconds. The intro plays once (2 bars, 3.5s); then it loops from A, 56
// bars, about 1m37s:
//
//   intro   2 bars   3.5s  the bell twice, a stamp, the tuba on the upside-
//                          down cell; the fiddle runs up the scale into A
//   A      16 bars  27.8s  THE HOOK on the fiddle over pizzicato off-beats,
//                          the stomping cell bass and a bodhran, the oboe
//                          answering in its gaps; the second half answers
//                          it (F, Dm, E7) with a clarinet underneath, short
//                          cellos and a low tremolo growl, and
//                          brings the hook back twice; each half ends on
//                          three hammer blows
//   B      16 bars  27.8s  the minor turn, F sharp minor: the brass swagger
//                          on the cell (trombone, horns, clarinet) traded
//                          bar by bar with fiddle runs, a C#7 with a flat
//                          ninth; the band stabs and stops; then the fiddle
//                          soars over held horns, through G and G7, climbs
//                          chromatically on tremolo strings and a snare roll,
//                          and the band hits one E and stops dead (the bell
//                          answers, alone)
//   C       8 bars  13.9s  the breakdown: stamps on the deck, the bass alone
//                          on the upside-down cell, the crew humming, the
//                          ship's bell on the cell, then Haddock's motif over
//                          F#m, then a clang at nothing; the oboe and clarinet
//                          sneak the
//                          tune back in like a squeezebox; a roll
//   A2     16 bars  27.8s  the hook with everything: fiddle, oboe and
//                          clarinet, horns and trombone on the guide notes,
//                          the trumpet answering in the gaps and on the
//                          hammer blows, short bowed cellos digging in,
//                          a tremolo shimmer on the chords in the second
//                          half, the crew stamping the deck on 2 and 4; a
//                          pickup runs it home
//
// New ideas land at 0s (hook), 14s (answer), 28s (swagger), 42s (soar and
// climb), 56s (breakdown), 70s (all hands).

const BAR = 16;
const riff = (text) => melody(text, 1);   // each token a 16th
const steps = (text) => melody(text, 4);  // each token a quarter
const rest = (bars) => Array(bars * BAR).fill('.');
const up = (track, semitones) => transpose(track, semitones);
const fit = (name, section, bars) => tight('Shore Leave', name, section, bars, BAR);
// A track for bars `from` to `to` (counting from 0) of a longer one, silent elsewhere.
const only = (from, to, track) => track.map((n, i) => (i >= from * BAR && i < to * BAR ? n : '.'));
// A doubling that leaves out any note too far from one of its instrument's
// recordings (the horns have a gap in the middle, so they leave those
// notes to the clarinet and trombone).
const playable = (track, set, far = 2) => track.map((n) => (
  typeof n === 'number' && SAMPLE_SETS[set].notes.every((r) => Math.abs(r - n) > far) ? '.' : n));
const crashOn = (bars, ...at) => Array.from({ length: bars }, (_, i) => (at.includes(i) ? ['x', ...Array(BAR - 1).fill('.')] : Array(BAR).fill('.'))).flat();
// One pattern for chosen bars, another (or silence) elsewhere.
const barsOf = (bars, fn) => Array.from({ length: bars }, (_, i) => fn(i)).flat();

// --- Chords, written two to a bar (a half bar each). ---
const PITCH = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const KINDS = { '': [0, 4, 7], m: [0, 3, 7], 7: [0, 4, 7, 10] };
const chordOf = (symbol) => {
  const m = symbol.match(/^([A-G])([#b]?)(7|m)?$/);
  if (!m) throw new Error(`Shore Leave: can't read the chord '${symbol}'`);
  const pc = (PITCH[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + 12) % 12;
  return { pc, seventh: m[3] === '7', tones: KINDS[m[3] ?? ''].map((i) => (pc + i) % 12) };
};
const halves = (text) => text.split(/\s+/).filter((t) => t && t !== '|').map(chordOf);
// The lowest note of pitch class `pc` at or above `low`.
const from = (low, pc) => low + (((pc - low) % 12) + 12) % 12;
// The notes of the old A mixolydian (and F sharp minor's G sharp, and the
// E sharp of C#7 when a chord names its seventh): the B section, in F sharp
// minor, still walks by these.
const SCALE = [9, 11, 1, 2, 4, 6, 7, 8];
// The notes of A minor, with the G sharp of the E chords: the rest of the song.
const MINOR_SCALE = [9, 11, 0, 2, 4, 5, 7, 8];
// The upside-down cell's last note: a whole step under the root (the flat
// seventh), unless that note is out of the key; then the sixth under it.
const lead = (ch, scale = SCALE) => (ch.seventh || scale.includes((ch.pc + 10) % 12) ? -2 : -3);
// The tune in A minor: every C sharp down to C and every F sharp to F (the
// G sharps stay, over the E chords).
const minor = (track) => track.map((n) => (typeof n === 'number' && [1, 6].includes(((n % 12) + 12) % 12) ? n - 1 : n));

// The band for a run of chords: the stomping bass (the cell upside down,
// 5 1 1 b7, on the first half of each chord; root, fifth, octave, fifth on
// a held chord's second half), the pizzicato "squeezebox" chops on every
// off-beat 8th, and a guide note (the chord's third) for the horns. `blow`
// bars are the hornpipe's three hammer blows: everyone on beats 1, 2 and 3,
// nothing on 4 (it's left to the tune's pickup).
function band(text, blow = [], scale = SCALE) {
  const out = { bass: [], comp1: [], comp2: [], comp3: [], guide: [] };
  halves(text).forEach((ch, i, all) => {
    const bar = i >> 1;
    const second = i % 2 === 1;
    const held = second && all[i - 1].pc === ch.pc && all[i - 1].seventh === ch.seventh;
    const root = from(40, ch.pc);
    const voicing = (ch.tones.length === 4 ? ch.tones.slice(1) : ch.tones).map((pc) => from(57, pc)).sort((a, b) => a - b);
    const third = from(56, ch.tones[1]);
    if (blow.includes(bar)) {
      out.bass.push(...(second ? [root - 12, '-', '-', '.', '.', '.', '.', '.'] : [root, '-', '.', '.', root - 5, '-', '.', '.']));
      voicing.forEach((n, v) => out[`comp${v + 1}`].push(...(second ? [n, '-', '.', '.', '.', '.', '.', '.'] : [n, '-', '.', '.', n, '-', '.', '.'])));
      out.guide.push(...(second ? [third, '-', '.', '.', '.', '.', '.', '.'] : [third, '-', '.', '.', third, '-', '.', '.']));
      return;
    }
    out.bass.push(...(held
      ? [root, '-', root + 7, '-', root + 12, '-', root + 7, '-']
      : [root - 5, '-', '.', root, root, '-', root + lead(ch, scale), '-']));
    voicing.forEach((n, v) => out[`comp${v + 1}`].push('.', '.', n, '-', '.', '.', n, '-'));
    out.guide.push(...(held ? Array(8).fill('-') : [third, ...Array(7).fill('-')]));
  });
  return out;
}

const A_HALVES = `
  Am Am | G G | Dm Dm | E E | Am Am | G G | Dm E | Am Am
  F F | Dm Dm | Am Am | E E | Am Am | G G | E7 E7 | Am Am
`;
const B_HALVES = `
  F#m F#m | F#m F#m | D D | C#7 C#7 | F#m F#m | F#m F#m | Bm Bm | C#7 C#7
  D D | E E | F#m F#m | F#m F#m | G G | G7 G7 | E E | E E
`;
// Bar 3 is F: Haddock's motif rings over it (see the header).
const C_CHORDS = 'Am Am F E Am G Dm E';
const BLOWS = [7, 15];

// --- THE TUNE. The hook is two bars: bar 1 is the coast cell in A (E,
// A-A, B) with a dotted hornpipe kick, climbing on to a held C and
// stepping back (B A); bar 2 drops onto the G chord, the pirate's flat
// seventh, and stops for a beat. Then the same two bars a step up the
// ladder (on D and E), the hook again, and a run down to the three hammer
// blows. The second half answers over F major, and the hook comes
// back twice before the blows. Every gap the tune leaves at the end of a
// bar gets a quick reply from another player (FILLS). ---
const HOOK_BARS = `
  E5 - - A5 | A5 - B5 - | C#6 - - - | B5 - A5 -
  G5 - - E5 | - - D5 - | E5 - - - | . . . .
`;
const TUNE_BARS = `
  ${HOOK_BARS}
  F#5 - - A5 | A5 - B5 - | D6 - - - | C#6 - B5 -
  A5 - - G#5 | - - E5 - | B5 - - - | . . . .
  E5 - - A5 | A5 - B5 - | C#6 - - - | B5 - A5 -
  G5 - - E5 | - - D5 - | G5 - A5 - | B5 - D6 -
  D6 - C#6 - | B5 - A5 - | B5 - - G#5 | E5 - - -
  A5 - . . | E5 - . . | A4 - . . | . . A5 B5
  C#6 - - B5 | A5 - F#5 - | A5 - - G#5 | F#5 - C#5 -
  D5 - - F#5 | A5 - D6 - | C#6 - B5 - | A5 - F#5 -
  E5 - - A5 | A5 - B5 - | C#6 - - - | B5 - A5 -
  B5 - - G#5 | E5 - B4 - | D5 - - C#5 | B4 - . .
  E5 - - A5 | A5 - B5 - | C#6 - - - | B5 - A5 -
  G5 - - E5 | - - D5 - | G5 - B5 - | D6 - B5 -
  G#5 - - A5 | B5 - E6 - | D6 - B5 - | G#5 - E5 -
  A5 - . . | E5 - . . | A4 - . . | . C#5 D5 D#5
`;
// The replies in the tune's gaps: a quick run up into its next note.
const FILLS = minor(scatter(16, BAR, [
  [1, 12, 'B4'], [1, 13, 'C#5'], [1, 14, 'D5'], [1, 15, 'E5'],
  [3, 12, 'G#4'], [3, 13, 'A4'], [3, 14, 'B4'], [3, 15, 'D5'],
  [11, 14, 'C#5'], [11, 15, 'D5'],
]));
const TUNE = minor(riff(TUNE_BARS));

// --- B: the swagger. Low brass on the cell in F sharp minor (C# F# F#
// G#), traded bar by bar with the fiddle; the C#7 bars carry a D on top
// (the flat ninth). Bar 8 is a stab and a stop. ---
const SWAGGER = riff(`
  C#4 - - F#4 | F#4 - G#4 - | A4 - - G#4 | F#4 - C#4 -
  . . . . | . . . . | . . . . | . . . .
  D4 - - F#4 | A4 - - G#4 | F#4 - E4 - | D4 - C#4 -
  . . . . | . . . . | . . . . | . . . .
  C#4 - - F#4 | F#4 - G#4 - | A4 - B4 - | C#5 - - -
  . . . . | . . . . | . . . . | . . . .
  D4 - - B3 | D4 - F#4 - | B4 - A4 - | F#4 - D4 -
  G#4 - . G#4 | . . B4 - | C#5 - . . | . . . .
`);
const B_FIDDLE = riff(`
  . . . . | . . . . | . . . . | . . . .
  . . . . | C#6 B5 A5 G#5 | F#5 - A5 - | C#6 - . .
  . . . . | . . . . | . . . . | . . . .
  . . . . | C#5 F5 G#5 B5 | D6 - C#6 - | B5 - G#5 -
  . . . . | . . . . | . . . . | . . . .
  A5 G#5 F#5 E5 | F#5 - C#5 - | A4 - C#5 - | F#5 - . .
  . . . . | . . . . | . . . . | . . . .
  G#5 - . G#5 | . . B5 - | C#6 - . . | . . . .
  F#5 - - - | A5 - - F#5 | D6 - - - | C#6 - B5 -
  B5 - - - | G#5 - - E5 | B5 - - - | A5 - G#5 -
  A5 - - - | F#5 - - C#5 | F#5 - G#5 - | A5 - B5 -
  C#6 - - - | B5 - A5 - | G#5 - F#5 - | E5 - C#5 -
  D5 - G5 - | B5 - D6 - | B5 - G5 - | D5 - B4 -
  G5 - B5 - | D6 - F6 - | E6 - D6 - | B5 - G5 -
  E5 F5 F#5 G5 | G#5 A5 A#5 B5 | C6 C#6 D6 D#6 | E6 - - -
  E6 - . . | . . . . | . . . . | . . . .
`);
// The stab at the end of bar 8 and the hit at the start of bar 16: the band
// follows the brass/fiddle rhythm there and is silent otherwise.
const STAB8 = (bar) => (bar === 7 ? hits('x.......x.......') : Array(BAR).fill('.'));
// Clear every track of a section in the listed bars from step `at` on,
// except the ones named in `keep`.
const stopIn = (section, bars, at, keep = []) => Object.fromEntries(Object.entries(section).map(([name, track]) => [
  name, keep.includes(name) ? track : track.map((n, i) => (bars.includes(Math.floor(i / BAR)) && i % BAR >= at ? '.' : n)),
]));

// --- C: the breakdown's bass, the cell upside down in quarters (E A A G
// on A), one bar a chord. ---
const C_BASS = halves(C_CHORDS).flatMap((ch) => {
  const r = from(40, ch.pc);
  return [r - 5, '-', '-', '.', r, '-', '-', '.', r, '-', '-', '.', r + lead(ch, MINOR_SCALE), '-', '-', '.'];
});
// The ship's bell: the cell in half notes (E A, A B), Haddock's motif in A
// (C# B A, E), and then one clang at nothing.
const BELL = (() => {
  const t = scatter(8, BAR, [[0, 0, 'E4'], [0, 8, 'A4'], [1, 0, 'A4'], [1, 8, 'B4'], [3, 11, 'A4'], [4, 0, 'A4'], [6, 0, 'A4']]);
  haddockPhrase('A4', { lengths: [4, 2, 6, 4], unit: 1 }).forEach((n, i) => { t[2 * BAR + i] = n; });
  return minor(t);
})();

// --- The intro: the fiddle runs up the A minor scale into the tune (written in
// the old A mixolydian, and brought down by minor()). ---
const RUN_UP = minor(riff(`
  . . . . | . . . . | . . . . | . . . .
  A4 B4 C#5 D5 | E5 F#5 G5 A5 | G5 F#5 E5 D5 | C#5 - D5 D#5
`));

// --- The kit: a soft kick on 1 and 3, a rim on 2 and 4, a bodhran
// rattling the hornpipe, the crew's boots on the deck (a dry drum) on 2
// and 4 when they join in. ---
const KICK = hits('x.......x.......');
const RIM = hits('....x.......x...');
const BODHRAN = hits('x..xx.x.x..xx.xx');
const BODHRAN_FILL = hits('x.xxx.x.x.x.xxxx');
const DECK = hits('....x.......x...');
const BLOW_HITS = hits('x...x...x.......');
const ROLL = hits('x.x.x.x.xxxxxxxx');
// A kit for `bars` bars, with the hammer blows in `blow` bars and a
// bodhran fill every fourth bar otherwise.
const kit = (bars, blow = []) => ({
  kick: barsOf(bars, (i) => (blow.includes(i) ? BLOW_HITS : KICK)),
  rim: barsOf(bars, (i) => (blow.includes(i) ? Array(BAR).fill('.') : RIM)),
  bodhran: barsOf(bars, (i) => (blow.includes(i) ? BLOW_HITS : (i % 4 === 3 ? BODHRAN_FILL : BODHRAN))),
});

const A_BAND = band(A_HALVES, BLOWS, MINOR_SCALE);
// The breakdown's chops, when the tune sneaks back in.
const C_BAND = band('Am Am | G G | Dm Dm | E E', [], MINOR_SCALE);
// The growl: a low A, tremolo, held under the tune's second half.
const GROWL = [...rest(8), ...repeat(steps('A2 - - -'), 7), ...steps('E2 - - -')];
// The shimmer in the last time round: the chords' thirds, high and tremolo.
const SHIMMER = sustained(A_HALVES.replace(/[|7]/g, ' '), BAR / 2, 1, 5);
const B_BAND = band(B_HALVES);

export const GULLREST_BATTLE_THEME = {
  title: 'Shore Leave',
  bpm: 138,
  stepsPerBeat: 4,
  volume: 1.3,

  instruments: {
    // The lead: a solo fiddle, short and bowed hard.
    fiddle: { sample: 'soloViolin', volume: 0.42, release: 0.12, reverb: 0.25, pan: 0.1, humanize: { time: 0.005, volume: 0.1 } },
    oboe: { sample: 'oboe', volume: 0.24, attack: 0.01, release: 0.1, reverb: 0.25, pan: 0.2, humanize: { time: 0.005, volume: 0.1 } },
    clarinet: { sample: 'clarinet', volume: 0.26, attack: 0.01, release: 0.1, reverb: 0.25, pan: -0.25, humanize: { time: 0.005, volume: 0.1 } },
    // The squeezebox chops (pizzicato chords on the off-beats).
    comp1: { sample: 'violinsPizz', volume: 0.13, release: 0.08, reverb: 0.2, pan: -0.1, humanize: { time: 0.004, volume: 0.15 } },
    comp2: { sample: 'violinsPizz', volume: 0.13, release: 0.08, reverb: 0.2, pan: 0.05, humanize: { time: 0.004, volume: 0.15 } },
    comp3: { sample: 'violinsPizz', volume: 0.13, release: 0.08, reverb: 0.2, pan: 0.2, humanize: { time: 0.004, volume: 0.15 } },
    // The stomp.
    tuba: { sample: 'tuba', volume: 0.28, attack: 0.01, release: 0.08, reverb: 0.15, pan: -0.05, humanize: { time: 0.004, volume: 0.1 } },
    bassPizz: { sample: 'cellosPizz', volume: 0.3, release: 0.12, reverb: 0.18, pan: -0.15, humanize: { time: 0.004, volume: 0.12 } },
    basses: { sample: 'bassSpic', volume: 0.13, release: 0.06, reverb: 0.15, humanize: { time: 0.004, volume: 0.12 } },
    // The grit: short bowed cellos digging in under the stomp.
    grit: { sample: 'cellosSpic', volume: 0.14, release: 0.06, reverb: 0.15, pan: 0.1, humanize: { time: 0.004, volume: 0.15 } },
    // Brass.
    trombone: { sample: 'trombone', volume: 0.26, attack: 0.02, release: 0.12, reverb: 0.25, pan: 0.3, humanize: { time: 0.006, volume: 0.1 } },
    horns: { sample: 'horns', volume: 0.19, attack: 0.03, release: 0.2, reverb: 0.3, pan: -0.2, humanize: { time: 0.006, volume: 0.08 } },
    trumpet: { sample: 'trumpet', volume: 0.24, release: 0.1, reverb: 0.28, pan: 0.15, humanize: { time: 0.005, volume: 0.08 } },
    // Strings for the climb, the crew's hum, the ship's bell.
    violinsTrem: { sample: 'violinsTrem', volume: 0.14, attack: 0.3, release: 0.3, reverb: 0.35, pan: 0.2 },
    cellosTrem: { sample: 'cellosTrem', volume: 0.18, attack: 0.3, release: 0.3, reverb: 0.3, pan: -0.2 },
    crewHi: { sample: 'choir', volume: 0.1, attack: 0.3, release: 0.6, reverb: 0.5, pan: 0.15 },
    crewLo: { sample: 'choir', volume: 0.1, attack: 0.3, release: 0.6, reverb: 0.5, pan: -0.15 },
    bell: { sample: 'chimes', volume: 0.24, ring: true, reverb: 0.5, pan: 0.3 },
    // The kit.
    kick: { drum: 'kick', volume: 0.34 },
    rim: { sample: 'snareSoft', drum: 'sample', volume: 0.17, release: 0.08, reverb: 0.2, humanize: { time: 0.004, volume: 0.25 } },
    bodhran: { sample: 'frameDrum', drum: 'sample', volume: 0.18, ring: true, reverb: 0.15, pan: 0.15, humanize: { time: 0.003, volume: 0.3 } },
    // The crew's boots on the deck (in place of hand claps, which were too
    // much of a party for a fight).
    deck: { sample: 'tenorDrum', drum: 'sample', volume: 0.2, ring: true, reverb: 0.22, pan: -0.05, humanize: { time: 0.006, volume: 0.2 } },
    stamp: { sample: 'bassDrum', drum: 'sample', volume: 0.32, ring: true, reverb: 0.25, humanize: { time: 0.004, volume: 0.15 } },
    snare: { sample: 'snare', drum: 'sample', volume: 0.16, ring: true, reverb: 0.25, humanize: { time: 0.003, volume: 0.25 } },
    crash: { sample: 'crash', drum: 'sample', volume: 0.2, ring: true, reverb: 0.3 },
  },

  sections: {
    // The bell twice, a stamp, the tuba on the upside-down cell; then the
    // fiddle runs up into the tune.
    intro: fit('intro', {
      bell: scatter(2, BAR, [[0, 0, 'A4'], [0, 8, 'E4']]),
      stamp: [...KICK, ...rest(1)],
      tuba: [...steps('E2 A2 A2 G2'), ...steps('E2 - - -')],
      fiddle: RUN_UP,
      bodhran: [...rest(1), ...ROLL],
    }, 2),

    // THE TUNE on the fiddle over the chops, the stomp and the bodhran; a
    // clarinet joins under the answer.
    A: fit('A', {
      fiddle: TUNE,
      oboe: FILLS,
      clarinet: only(8, 16, up(TUNE, -12)),
      tuba: A_BAND.bass,
      bassPizz: A_BAND.bass,
      comp1: A_BAND.comp1,
      comp2: A_BAND.comp2,
      comp3: A_BAND.comp3,
      trumpet: only(15, 16, up(TUNE, -12)),
      grit: only(8, 16, A_BAND.bass),
      cellosTrem: GROWL,
      ...kit(16, BLOWS),
      crash: crashOn(16, 0, 8),
    }, 16),

    // The minor turn: brass swagger, fiddle answers, a stab; the fiddle
    // soars over held horns; the chromatic climb; one E and stop.
    B: fit('B', stopIn(stopIn({
      trombone: [...up(SWAGGER, -12), ...rest(8)],
      horns: playable([...SWAGGER, ...only(8, 16, B_BAND.guide).slice(8 * BAR)], 'horns', 5),
      clarinet: [...SWAGGER, ...up(B_FIDDLE, -12).slice(8 * BAR, 14 * BAR), ...rest(2)],
      fiddle: B_FIDDLE,
      tuba: B_BAND.bass,
      bassPizz: B_BAND.bass,
      comp1: B_BAND.comp1,
      comp2: B_BAND.comp2,
      comp3: B_BAND.comp3,
      violinsTrem: [...rest(14), ...steps('E4 - - -'), ...rest(1)],
      cellosTrem: [...rest(14), ...steps('E3 - - -'), ...rest(1)],
      kick: [...repeat(KICK, 7), ...STAB8(7), ...repeat(KICK, 6), ...hits('x...x...x...x...'), ...hits('x...............')],
      rim: [...repeat(RIM, 7), ...rest(1), ...repeat(RIM, 6), ...rest(2)],
      bodhran: [...rest(8), ...repeat(BODHRAN, 3), ...BODHRAN_FILL, ...repeat(BODHRAN, 2), ...rest(2)],
      snare: [...rest(7), ...STAB8(7), ...rest(6), ...ROLL, ...hits('x...............')],
      trumpet: [...rest(7), ...riff('G#4 - . G#4 | . . B4 - | C#5 - . . | . . . .'), ...rest(7), ...riff('E5 - . . | . . . . | . . . . | . . . .')],
      bell: scatter(16, BAR, [[15, 8, 'E4']]),
      crash: crashOn(16, 0, 8, 15),
    }, [7], 10, ['fiddle', 'trumpet', 'trombone', 'horns', 'clarinet', 'kick', 'snare', 'crash']), [15], 2, ['bell']), 16),

    // The breakdown: stamps on the deck, the bass alone on the upside-down
    // cell, the crew humming, the bell; the oboe and clarinet sneak the
    // tune back in; a roll.
    C: fit('C', {
      stamp: [...repeat(KICK, 7), ...hits('x..x..x.x.x.xxxx')],
      deck: [...repeat(DECK, 3), ...hits('....x..x....x.x.'), ...repeat(DECK, 3), ...hits('....x...x.x.x.x.')],
      bassPizz: C_BASS,
      tuba: only(4, 8, C_BASS),
      crewLo: sustained(C_CHORDS, BAR, 2, 3),
      crewHi: sustained(C_CHORDS, BAR, 1, 3),
      bell: BELL,
      oboe: [...rest(4), ...TUNE.slice(0, 4 * BAR)],
      clarinet: [...rest(4), ...up(TUNE.slice(0, 4 * BAR), -12)],
      comp1: [...rest(4), ...C_BAND.comp1],
      comp2: [...rest(4), ...C_BAND.comp2],
      comp3: [...rest(4), ...C_BAND.comp3],
      bodhran: [...rest(4), ...repeat(BODHRAN, 3), ...BODHRAN_FILL],
      snare: [...rest(7), ...ROLL],
    }, 8),

    // All hands: the tune on fiddle, oboe and clarinet; horns and trombone
    // on the guide notes; trumpets on the blows; the grit under the stomp;
    // a tremolo shimmer on the chords in the second half; the crew's boots
    // on 2 and 4.
    A2: fit('A2', {
      fiddle: TUNE,
      oboe: TUNE,
      clarinet: up(TUNE, -12),
      violinsTrem: [...rest(8), ...SHIMMER.slice(8 * BAR)],
      horns: playable(A_BAND.guide, 'horns', 5),
      trombone: up(A_BAND.guide, -12),
      trumpet: up(TUNE, -12).map((n, i) => (BLOWS.includes(Math.floor(i / BAR)) ? n : FILLS[i])),
      tuba: A_BAND.bass,
      basses: A_BAND.bass,
      bassPizz: A_BAND.bass,
      grit: A_BAND.bass,
      comp1: A_BAND.comp1,
      comp2: A_BAND.comp2,
      comp3: A_BAND.comp3,
      ...kit(16, BLOWS),
      deck: barsOf(16, (i) => (BLOWS.includes(i) ? BLOW_HITS : DECK)),
      crash: crashOn(16, 0, 4, 8, 12),
    }, 16),
  },

  // The intro plays once; then the fight goes round from the tune.
  order: ['intro', 'A', 'B', 'C', 'A2'],
  loopFrom: 1,
};
