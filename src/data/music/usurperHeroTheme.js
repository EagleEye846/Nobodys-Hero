import { sustained, arpeggio, chordLine, melody } from '../../audio/notation.js';
import {
  BPM, BAR, tune, rest, held, heldBars, onNotes, transpose, repeat, hits, HIS, HERS_HERO,
  POUND, DIG, RACE, HAMMER, TREMBLE, timp, timpRoot, T_POUND, T_HEART, T_ONE,
  HIT, KICK, KICK_FOUR, SNARE, FILL, TAIKO, TAIKO_HI, HALF_TAIKO, RIM, BUILD_8THS, BUILD_16THS, every, swellInto, ORCHESTRA,
} from './parts/usurper.js';

// "Who Would Be Hero": the Usurper's battle theme, played by a real orchestra
// (the recordings in assets/audio/samples/, like the trailer's "Nobody Came")
// with a few chip voices over it. Built the way the trailer was: a build, one
// beat of dead silence, and THE DROP (gong, the deep drum, a low brass
// BRAAAM), then three minutes of the fight that keep climbing. His motif, her
// motif and the village's fanfare are the ones in parts/usurper.js; everything
// they're set in is new. Where the old theme sank, this one rises: the bass
// climbs through the fight, a chromatic ladder carries his motif up rung by
// rung, the duel goes up a key with every exchange, and the climax is a
// fourth above where it started. D minor; the climax in G major, her key.
// 150 BPM, one step a 16th note. The intro plays once (13s); then it loops
// from the drop, 110 bars, 2m56s:
//
//   intro     8 bars  a gong, and the fight's hook alone on a piano over a
//                     heartbeat (you know the tune before the drop); then the
//                     build: strings racing, drums rolling, the brass
//                     climbing... and a beat of silence
//   A        16 bars  THE DROP: trumpets and violins blare the hook (his
//                     motif punched into a 3-3-2) over a bass that climbs
//                     D F G A Bb C D, with room round the hit: just the
//                     brass, basses and war drums for two bars, then the
//                     strings pile in, then the piano, a square-wave double
//                     and breakbeat drums for the second half
//   B        16 bars  the village's fanfare, stolen into minor, with its
//                     climb on top; a march under it, his motif mocking from
//                     the trombones in the gaps; the violins run a six-note
//                     figure that never fits the bar (6+6+4)
//   C         8 bars  the ladder: the whole orchestra on one chromatic climb,
//                     D to G#, his motif a semitone higher every bar, brass
//                     piling on, and it lands on one ringing D major chord,
//                     the way into her G minor
//   D        18 bars  her motif, re-barred into 6/8 (a lilt, not a march):
//                     G minor, grieving on a solo violin over a piano ripple;
//                     then Bb major, the violins and horns carrying it over a
//                     bass that holds the wrong note under the chord (the
//                     lullaby trick: a V chord over its IV's bass)
//   hush      4 bars  back to 4/4: her music box alone with a heartbeat; a
//                     roll and a cymbal swell pull the fight back
//   duel     16 bars  his motif calls, hers answers, up a key each time
//                     (D, E, F#), then both at once, then everything runs up
//                     the scale... and stops dead for a beat
//   climax   24 bars  THE SECOND DROP, G major: her heroic motif on the whole
//                     orchestra, his drowning underneath; then the fanfare,
//                     taken back
//   turn      8 bars  his motif crawling back through E minor and the
//                     Neapolitan (Eb, the one borrowed chord) to D minor, a
//                     second build, and the silence before the drop again
//
// The tricks come from how Fox, Kondo and the rest do it (notes/reports/):
// the hook heard plainly before it's blared; one borrowed chord per loop; a
// bass that walks a scale; a tune re-barred into a new meter for a new
// section; the Mario/Zelda bVI-bVII-i (Bb C Dm) under the hook; a stopdown
// before each drop; chip voices doubling sampled ones.

// --- Patterns. ---
const PULSE = [0, '.', '.', '.', 0, '.', '.', '.', 0, '.', '.', '.', 0, '.', '.', '.'];
const EIGHTHS = [0, '.', 7, '.', 12, '.', 7, '.'];
// Six notes round and round in a 16-step bar: 6+6+4, so it leans on a
// different beat every bar (Koshiro's Ys ostinato, Fox's "Run!").
const SWAY = [0, 7, 12, 'third', 12, 7];
const PEDAL_8 = [0, '.', 0, '.', 0, '.', 0, '.', 0, '.', 0, '.', 0, '.', 0, '.'];
const PEDAL_16 = Array(16).fill(0);
const PEDAL_CUT = [...Array(12).fill(0), '.', '.', '.', '.'];
const T_QUARTERS = [0, '.', '.', '.', 0, '.', '.', '.', 0, '.', '.', '.', 0, '.', '.', '.'];
const T_EIGHTHS = [0, '.', 0, '.', 0, '.', 0, '.', 0, '.', 0, '.', 0, '.', -5, '.'];
const T_CUT = [0, '.', 0, '.', 0, '.', 0, '.', 0, 0, 0, 0, '.', '.', '.', '.'];
const BASS_DRUM = hits('x....... x.......');
const QUARTERS = hits('x...x... x...x...');
// The chip kit: closed hats every 16th, open hats off the beat, and a
// breakbeat snare (2, the "e" of 3, 4, and the "a" of 4) for the second
// halves, over the war drums.
const HAT_16THS = hits('xxxxxxxx xxxxxxxx');
const OPEN_HAT = hits('..x...x. ..x...x.');
const BREAK = hits('....x... .x..x.x.');
// Silences the last `steps` of a track (the beat of nothing before a drop).
const cut = (track, steps = 4) => [...track.slice(0, track.length - steps), ...Array(steps).fill('.')];
// Every track of a section cut the same way: the whole orchestra stops dead.
const stopdown = (section) => Object.fromEntries(Object.entries(section).map(([name, track]) => [name, cut(track)]));
// A pattern for `bars` bars, with a fill on every `n`th bar.
const fills = (pattern, bars, n) => Array.from({ length: bars }, (_, i) => ((i + 1) % n === 0 ? FILL : pattern)).flat();
// A track that sits out its first `bars` bars.
const after = (bars, track) => [...rest(bars), ...track.slice(bars * BAR)];

// --- The build, four bars: the strings go from 8ths to 16ths, the drums roll
// tighter, the brass climbs, the cymbal swells, and everything stops dead a
// beat early. Its instruments are held back so the drop takes over. It
// starts `after` bars into its section. ---
const RUN_UP = tune('E5/F5 F#5/G5 G#5/A5 Bb5/B5 C6/C#6 D6/D#6 . .');
const HORN_CLIMB = tune('F3 - - - G#3 - - - | A3 - Bb3 - C#4 - . .');
function build(chords, from) {
  const [a, b, c] = chords.split(' ');
  const tracks = {
    raceSoft: [...arpeggio(`${a} ${b}`, BAR, 4, EIGHTHS), ...arpeggio(c, BAR, 4, RACE), ...RUN_UP],
    poundSoft: [...chordLine(`${a} ${b}`, PEDAL_8, 2), ...chordLine(c, PEDAL_16, 2), ...chordLine(c, PEDAL_CUT, 2)],
    bassesSoft: [...chordLine(`${a} ${b}`, PEDAL_8, 1), ...chordLine(c, PEDAL_16, 1), ...chordLine(c, PEDAL_CUT, 1)],
    hornsBuild: [...rest(2), ...HORN_CLIMB],
    tromboneBuild: [...rest(2), ...cut(held('A2', 2 * BAR))],
    timpSoft: [...timp(`${a} ${b}`, T_QUARTERS), ...timp(c, T_EIGHTHS), ...timp(c, T_CUT)],
    roll: [...rest(1), ...BUILD_8THS, ...BUILD_16THS, ...hits('xxxxxxxx xxxx....')],
    taikoSoft: [...rest(2), ...hits('x...x... x...x...'), ...hits('x.x.x.x. x.x.....')],
    hat: [...rest(2), ...hits('x.x.x.x. x.x.x.x.'), ...hits('xxxxxxxx xxxx....')],
    swell: cut(swellInto(4)),
  };
  return Object.fromEntries(Object.entries(tracks).map(([name, steps]) => [name, [...rest(from), ...steps]]));
}

// --- A: the fight's hook, his motif punched into a 3-3-2 over a rising bass
// (D F G A, then the Bb C Dm that every triumphant game tune leans on). ---
const A_CHORDS = 'Dm F Gm A Bb C Dm A Dm F Gm A Bb C Dm A';
// His bell: a low toll on D every few bars under the fight, the church bell
// of his old theme, so the drive never forgets whose fight this is.
const tolls = (bars, n) => Array.from({ length: bars }, (_, i) => (i % n === 0 ? held('D4', BAR) : rest(1))).flat();
const LEAD = tune(`
  ${HIS} | F5 - - C6 - - A5 - | G5 - - D6 - - Bb5 - | A5 - - - C#6 - E6 - |
  F6 - D6 - Bb5 - F5 - | G5 - - E5 - - C5 - | ${HIS} | A5 - - - - - E5/G5 C#6/E6 |
  D6 - - A5 - - F5 - | C6 - - A5 - - F5 - | D6 - - Bb5 - - G5 - | E6 - - - C#6 - A5 - |
  F6 - - - D6 - Bb5 - | E6 - - - C6 - G5 - | ${HIS} | A5 - - - C#6 - E6 - |
`);

// --- B: the Long Stair's fanfare (stairTheme.js) and its climb, dragged
// into D minor, with his motif mocking in the gaps between its phrases. ---
const STOLEN_CHORDS = 'Dm A Bb Dm Dm Gm C A Gm Dm Gm A Gm A Gm A';
const STOLEN = tune(`
  A4 - D5 - F5 - A5 - | G5 - - E5 C#5 - E5 - | F5 - - - D5 - Bb4 - | D5 - - - - - . . |
  A4 - D5 - F5 - A5 - | Bb5 - A5 - G5 - E5 - | G5 - F5 - E5 - D5 - | E5 - - - - - . . |
  Bb5 - - - A5 - G5 - | A5 - - - F5 - E5 - | D5 - E5 - G5 - Bb5 - | A5 - - - - - . . |
  Bb5 - - - A5 - G5 - | C#6 - - - Bb5 - A5 - | Bb5 - A5 - G5 - E5 - | F5 - - - E5 - C#5 - |
`);
const MOCK = repeat([...rest(3), ...transpose(tune(HIS), -24)], 4);

// --- C: the ladder. The bass climbs D to A a semitone a bar, and his motif
// climbs with it, more of the brass joining on every other rung. ---
const LADDER = 'D D# E F F# G G# A';
const ladder = (octave) => LADDER.split(' ').map((name) => `${name}${octave}`).join(' ');
// His motif on rungs `from` up to `to` (the other bars silent), some octaves down.
const rungs = (from, to, octaves = 0) => Array.from({ length: 8 }, (_, i) => (i >= from && i < to ? transpose(tune(HIS), i + 12 * octaves) : rest(1))).flat();
// The ladder's last bar, replaced by where it lands: a D major chord, the
// dominant of the G minor that follows, struck once and left ringing, so the
// climb arrives somewhere and breathes out into the quiet instead of
// stopping dead.
const land = (track, landing) => [...track.slice(0, 7 * BAR), ...landing];

// --- D: her motif in 6/8. A 6/8 bar is 12 steps (two beats of three 8ths);
// 24 of them fill the section's 18 bars. Each token of a tune is an 8th, six
// to a bar. ---
const SIX = 12;
const rest6 = (bars) => Array(bars * SIX).fill('.');
// A 6/8 ripple: root, fifth, octave, tenth, octave, fifth.
const RIPPLE6 = [0, '-', 7, '-', 12, '-', 'tenth', '-', 12, '-', 7, '-'];
const HELD6 = [0, ...Array(SIX - 1).fill('-')];
const T_HEART6 = [0, '.', '.', 0, ...Array(SIX - 4).fill('.')];
const BEAT6 = hits('x...........');
const RIM6 = hits('..x..x..x..x');
// Grieving, in G minor: her motif (D D Bb, C A Bb) with the lilt of 6/8.
const GRIEF_CHORDS6 = 'Gm Eb Cm D Gm Eb Cm D Gm Eb Cm D';
const GRIEF6 = tune(`
  D5/D5 Bb5 - - C6 A5 | Bb5 - - G5 - - | Eb5 - G5 - C6 - | A5 - - - - . |
  D5/D5 Bb5 - - C6 A5 | Bb5 - - D6 - - | Eb6 - D6 - C6 - | A5 - - F#5 - - |
  G5 - A5 - Bb5 - | C6 - - Bb5 - - | Eb6 - - D6 - C6 | A5 - - - - - |
`);
// Remembering itself in Bb major: the motif climbs on past the ache. Under
// every F chord the bass holds Eb instead (Zelda's Lullaby's D over C): it
// shimmers and never quite settles.
const LIGHT_CHORDS6 = 'Bb F Gm Eb Bb F Gm Eb Bb F Eb F';
const LIGHT_BASS6 = 'Bb2 Eb2 G2 Eb2 Bb2 Eb2 G2 Eb2 Bb2 Eb2 Eb2 Eb2';
const LIGHT6 = tune(`
  D5/D5 Bb5 - - C6 D6 | C6 - - A5 - - | G5 - Bb5 - D6 - | Eb6 - - D6 - - |
  D5/D5 Bb5 - - C6 D6 | F6 - - C6 - A5 | Bb5 - D6 - G5 - | Eb6 - - - - - |
  D6 - Bb5 - F5 - | A5 - - C6 - - | Eb6 - D6 - C6 - | A5 - - - - - |
`);
// The hush: her motif at half speed on the music box, and a low G.
const BOX = melody('D4/D4 Bb4 - - C5 A4 Bb4 - | G4 - - - - - - -', 4);

// --- The duel: his call, her answer, up a key every exchange; then both at
// once, and a run up the scale of D into G. ---
const DUEL_CHORDS = 'Dm Bb Gm A Em C Am B F#m D Bm C# F#m D D D';
const CALL = tune(`${HIS} | Bb5 - A5 - F5 - D5 -`);
const ANSWER = tune('A4/A4 F5 - - G5 E5 F5 - | G5 - A5 - D6 - - -');
const RUN = tune('D5 - E5 - F#5 - G5 - | A5 - B5 - C6 - D6 -');
const CALLS = [...CALL, ...rest(2), ...transpose(CALL, 2), ...rest(2), ...transpose(CALL, 4), ...rest(2), ...transpose(CALL, 4), ...RUN];
const answers = (run) => [...rest(2), ...ANSWER, ...rest(2), ...transpose(ANSWER, 2), ...rest(2), ...transpose(ANSWER, 4), ...transpose(ANSWER, 4), ...run];

// --- The climax: her motif, heroic, in G major; then the fanfare taken back. ---
// Two of its C chords borrowed from G minor (Cm, the minor iv): the light
// has won, but it's cost something, and you can hear it.
const HERO_CHORDS = 'G D Em Cm G D Em D Cm G Am D Em C D G';
const HERO = tune(`
  ${HERS_HERO} | A5 - - - F#5 - D5 - | E5 - - G5 - - B5 - | C6 - - - B5 - A5 - |
  B4/B4 G5 - - A5 B5 - C6 | D6 - - - A5 - F#5 - | G5 - - - A5 - B5 - | A5 - - - - - . . |
  C5/C5 A5 - - B5 C6 - - | B5 - - - G5 - D5 - | A5 - - C6 - - E6 - | D6 - - - C6 - A5 - |
  B5 - - - G5 - E5 - | C6 - - - D6 - E6 - | D6 - - - C6 - A5 - | G5 - - - - - D5 - |
`);
const RETAKEN_CHORDS = 'G D Em G G C Am D';
const RETAKEN = tune(`
  D5 - G5 - B5 - D6 - | C6 - - A5 F#5 - A5 - | B5 - - - G5 - E5 - | G5 - - - - - . . |
  D5 - G5 - B5 - D6 - | E6 - D6 - C6 - A5 - | C6 - B5 - A5 - G5 - | A5 - - - - - . . |
`);
const CLIMAX_CHORDS = `${HERO_CHORDS} ${RETAKEN_CHORDS}`;
const CLIMAX_TUNE = [...HERO, ...RETAKEN];
// His motif in E minor, drowning in the trombones under her.
const DROWN = repeat([...tune('E3/E3 C4 - - B3 A#3 B3 -'), ...rest(1)], 8);

// --- The turn: his motif crawling back, E minor, then the Neapolitan (Eb,
// a half step above home: the loop's one borrowed chord), into D minor. ---
const TURN_CHORDS = 'Em Em Eb Eb';
const CRAWL = tune(`
  E5/E5 C6 - - B5 A#5 B5 - | G5 - - - E5 - - - | Eb5/Eb5 B5 - - Bb5 A5 Bb5 - | F5 - - - Eb5 - - - |
`);

export const USURPER_HERO_THEME = {
  title: 'Who Would Be Hero',
  bpm: BPM,
  stepsPerBeat: 4,
  // A whole orchestra at once: turned down so the drop's hits don't clip
  // (peaks about 0.75, a touch under the trailer).
  volume: 0.75,

  instruments: {
    ...ORCHESTRA,
    harp: { sample: 'harp', volume: 0.35, ring: true, reverb: 0.4, pan: -0.3, humanize: { time: 0.012, volume: 0.2 } },
    // The chip voices (Fox's trick: a square wave over the recorded lead, a
    // touch sharp, with its own vibrato, so the tune reads as both orchestra
    // and chiptune), and a drum machine over the war drums.
    chip: {
      wave: 'square', volume: 0.012, attack: 0.006, decay: 0.12, sustain: 0.7, release: 0.06, gate: 0.9,
      voices: [{ wave: 'square', detune: 12, level: 1 }],
      vibrato: { rate: 5.5, depth: 8, delay: 0.08 },
      filter: { type: 'lowpass', frequency: 3200 },
    },
    hat: { drum: 'hat', volume: 0.04 },
    openHat: { drum: 'openHat', volume: 0.05 },
    breakSnare: { drum: 'snare', volume: 0.22 },
    // The build's players, held back so the drop takes over; its drums are
    // choked (each hit stops when the next starts) so the silence is silent.
    raceSoft: { ...ORCHESTRA.race, volume: 0.17 },
    poundSoft: { ...ORCHESTRA.pound, volume: 0.26 },
    bassesSoft: { ...ORCHESTRA.basses, volume: 0.3 },
    hornsBuild: { ...ORCHESTRA.horns, volume: 0.3 },
    tromboneBuild: { ...ORCHESTRA.trombones, volume: 0.3 },
    timpSoft: { sample: 'timpani', volume: 0.35, release: 0.08, reverb: 0.2 },
    taikoSoft: { sample: 'tenorDrum', drum: 'sample', volume: 0.5, release: 0.12, gate: 2.5, reverb: 0.2 },
  },

  sections: {
    // A gong. The hook, alone on the piano, over a heartbeat in the timpani
    // (so when the brass blares it after the drop you already know it); the
    // cellos and choir creep in under it; then the build.
    intro: {
      gong: every(8, 8),
      piano: [...LEAD.slice(0, 4 * BAR), ...rest(4)],
      cellos: [...rest(2), ...sustained('Dm Dm', BAR, 0, 2), ...rest(4)],
      choir: [...rest(2), ...sustained('Dm Dm', BAR, 0, 3), ...cut(sustained('Dm Bb A A', BAR, 0, 3))],
      timpani: [...timp('Dm Dm Dm Dm', T_HEART), ...rest(4)],
      ...build('Dm Bb A', 4),
    },

    // THE DROP. Gong, the deep drum, a crash and a BRAAAM on the downbeat,
    // and for two bars nothing but the hook on the brass, the basses digging
    // in and the war drums: room round the hit. Then the strings race and
    // pound, the horns and tuba fill the chords; from the halfway bar the
    // piano hammers octaves, the square wave doubles the tune, and the drum
    // machine breaks under the war drums.
    A: {
      gong: every(16, 16),
      impact: every(16, 8),
      crash: every(16, 4),
      boom: every(16, 4),
      braam: [...cut(held('D2', BAR)), ...rest(15)],
      braamLow: [...cut(held('D1', BAR)), ...rest(15)],
      toll: tolls(16, 4),
      trumpets: LEAD,
      violins: LEAD,
      trombones: transpose(LEAD, -24),
      chip: after(8, LEAD),
      horns: after(2, sustained(A_CHORDS, BAR, 0, 3)),
      tuba: after(2, sustained(A_CHORDS, BAR, 0, 2)),
      choir: after(2, sustained(A_CHORDS, BAR, 1, 3)),
      race: after(2, arpeggio(A_CHORDS, BAR, 4, RACE)),
      pound: after(2, chordLine(A_CHORDS, POUND, 2)),
      basses: chordLine(A_CHORDS, DIG, 1),
      piano: after(8, chordLine(A_CHORDS, HAMMER, 3)),
      timpani: timp(A_CHORDS, T_POUND),
      bassDrum: repeat(BASS_DRUM, 16),
      taiko: repeat(TAIKO, 16),
      taikoHigh: fills(TAIKO_HI, 16, 8),
      snare: fills(SNARE, 16, 8),
      breakSnare: [...rest(8), ...fills(BREAK, 8, 4)],
      hat: [...rest(8), ...repeat(HAT_16THS, 8)],
      openHat: [...rest(8), ...repeat(OPEN_HAT, 8)],
      kick: repeat(KICK, 16),
    },

    // The stolen fanfare, blared on trumpets and violins over a march, his
    // motif mocking from the trombones at the end of every phrase, and the
    // racing violins on a six-note figure that leans on a different beat
    // every bar.
    B: {
      toll: tolls(16, 2),
      trumpets: STOLEN,
      violins: STOLEN,
      violinsHigh: sustained(STOLEN_CHORDS, BAR, 1, 5),
      trombones: MOCK,
      horns: sustained(STOLEN_CHORDS, BAR, 0, 3),
      tuba: sustained(STOLEN_CHORDS, BAR, 0, 2),
      choir: sustained(STOLEN_CHORDS, BAR, 0, 3),
      race: arpeggio(STOLEN_CHORDS, BAR, 4, SWAY),
      pound: chordLine(STOLEN_CHORDS, POUND, 2),
      basses: chordLine(STOLEN_CHORDS, DIG, 1),
      piano: chordLine(STOLEN_CHORDS, HAMMER, 3),
      timpani: timp(STOLEN_CHORDS, T_POUND),
      bassDrum: repeat(BASS_DRUM, 16),
      taiko: repeat(HALF_TAIKO, 16),
      rim: repeat(RIM, 16),
      snare: fills(SNARE, 16, 4),
      kick: repeat(KICK_FOUR, 16),
      hat: repeat(hits('x.x.x.x. x.x.x.x.'), 16),
      crash: every(16, 4),
      impact: every(16, 8),
      boom: every(16, 4),
    },

    // The ladder: everything on one note, climbing a semitone a bar. His
    // motif on the trombones, then the horns join, then the trumpets, then
    // the violins; the strings shudder, the drums pound every beat and
    // tighten into a roll; and at the top the whole orchestra lands on one
    // D major chord, struck with a crash and left ringing over a timpani
    // rumble, the way into her G minor.
    C: {
      trombones: land(rungs(0, 7, -2), sustained('D', BAR, 0, 3)),
      horns: land(rungs(2, 7, -2), sustained('D', BAR, 1, 3)),
      trumpets: land(rungs(4, 7, -1), sustained('D', BAR, 2, 4)),
      violins: land(rungs(6, 7), sustained('D', BAR, 1, 5)),
      chip: rungs(6, 7),
      race: land(onNotes(ladder(5), TREMBLE), onNotes('F#5', TREMBLE)),
      pound: land(onNotes(ladder(2), POUND), onNotes('D2', POUND)),
      basses: land(onNotes(ladder(1), T_QUARTERS), held('D1', BAR)),
      cellos: land(heldBars(ladder(3)), held('D3', BAR)),
      tuba: land(heldBars(ladder(2)), held('D2', BAR)),
      choir: land(heldBars(ladder(3)), sustained('D', BAR, 1, 4)),
      timpani: [...timp('D D# E F F# G G#', T_QUARTERS), ...rest(1)],
      timpRoll: [...rest(7), ...held(timpRoot('D'), BAR)],
      bassDrum: [...repeat(QUARTERS, 7), ...HIT],
      taiko: [...repeat(QUARTERS, 5), ...BUILD_8THS, ...BUILD_16THS, ...HIT],
      snare: [...repeat(SNARE, 5), ...BUILD_8THS, ...BUILD_16THS, ...HIT],
      hat: [...rest(4), ...repeat(hits('x.x.x.x. x.x.x.x.'), 2), ...HAT_16THS, ...rest(1)],
      crash: [...every(7, 2), ...HIT],
      impact: [...every(7, 2), ...HIT],
      boom: [...every(7, 2), ...HIT],
    },

    // 6/8, G minor. A gong, and her motif grieving on a solo violin over a
    // piano ripple and a heartbeat; then it turns toward Bb major and the
    // violins, horns, harp and choir carry it, over a bass that won't settle.
    D: {
      gong: [...HIT, ...Array(24 * SIX - BAR).fill('.')],
      soloViolin: [...GRIEF6, ...LIGHT6],
      violins: [...rest6(12), ...LIGHT6],
      hornsSoft: [...rest6(12), ...sustained(LIGHT_CHORDS6, SIX, 0, 3)],
      cellos: [...sustained(GRIEF_CHORDS6, SIX, 0, 2), ...onNotes(LIGHT_BASS6, HELD6)],
      piano: arpeggio(`${GRIEF_CHORDS6} ${LIGHT_CHORDS6}`, SIX, 3, RIPPLE6),
      harp: [...rest6(12), ...arpeggio(LIGHT_CHORDS6, SIX, 4, RIPPLE6)],
      choir: [...rest6(12), ...sustained(LIGHT_CHORDS6, SIX, 1, 3)],
      timpani: [...timp(GRIEF_CHORDS6, T_HEART6), ...rest6(12)],
      boom: [...repeat(BEAT6, 12), ...rest6(12)],
      // The beat drops out for the last bar, so the music box can take over.
      bassDrum: [...rest6(12), ...repeat(BEAT6, 11), ...rest6(1)],
      rim: [...rest6(12), ...repeat(RIM6, 11), ...rest6(1)],
    },

    // Back in 4/4. Her music box alone over a low G and a heartbeat; then
    // the ground shifts to A, a roll and the cymbal swell pull the fight
    // back in.
    hush: {
      musicBox: BOX,
      piano: heldBars('G3 G3 Eb3 A3'),
      cellos: heldBars('G2 G2 Eb2 A2'),
      boom: [...repeat(hits('x..x.... ........'), 3), ...rest(1)],
      roll: [...rest(3), ...hits('x.x.x.x. xxxxxxxx')],
      timpRoll: [...rest(3), ...held(timpRoot('A'), BAR)],
      swell: swellInto(4),
    },

    // His motif on the brass, her answer on the violins, each exchange a
    // key higher; the fourth time both at once; then everything runs up the
    // scale with a roll and a swell, and stops dead a beat before the climax.
    duel: stopdown({
      trumpets: CALLS,
      trombones: transpose(CALLS, -24),
      chip: CALLS,
      violins: answers(RUN),
      soloViolin: answers(transpose(RUN, 12)),
      horns: sustained(DUEL_CHORDS, BAR, 0, 3),
      tuba: sustained(DUEL_CHORDS, BAR, 0, 2),
      choir: sustained(DUEL_CHORDS, BAR, 1, 3),
      race: arpeggio(DUEL_CHORDS, BAR, 4, RACE),
      pound: chordLine(DUEL_CHORDS, POUND, 2),
      basses: chordLine(DUEL_CHORDS, DIG, 1),
      piano: chordLine(DUEL_CHORDS, HAMMER, 3),
      timpani: [...timp('Dm Bb Gm A Em C Am B F#m D Bm C# F#m D', T_POUND), ...rest(2)],
      timpRoll: [...rest(14), ...held(timpRoot('D'), 2 * BAR)],
      bassDrum: [...repeat(BASS_DRUM, 14), ...repeat(QUARTERS, 2)],
      taiko: repeat(TAIKO, 16),
      taikoHigh: fills(TAIKO_HI, 16, 4),
      snare: [...fills(SNARE, 14, 4), ...BUILD_8THS, ...BUILD_16THS],
      hat: [...rest(8), ...repeat(hits('x.x.x.x. x.x.x.x.'), 6), ...repeat(HAT_16THS, 2)],
      kick: repeat(KICK, 16),
      crash: every(16, 4),
      impact: every(16, 4),
      boom: every(16, 4),
      swell: swellInto(16),
    }),

    // THE SECOND DROP, G major, as big as it gets: a gong and a BRAAAM, her
    // heroic motif on trumpets, violins and the square wave with the whole
    // orchestra driving, his motif drowning in the trombones, the drum
    // machine breaking under the war drums; then the fanfare taken back, in
    // her key, with the trombones under it.
    climax: {
      gong: every(24, 16),
      impact: every(24, 8),
      crash: every(24, 2),
      boom: every(24, 2),
      braam: [...cut(held('G2', BAR)), ...rest(23)],
      trumpets: CLIMAX_TUNE,
      violins: CLIMAX_TUNE,
      chip: CLIMAX_TUNE,
      violinsHigh: sustained(CLIMAX_CHORDS, BAR, 1, 5),
      horns: sustained(CLIMAX_CHORDS, BAR, 0, 3),
      trombones: [...DROWN, ...transpose(RETAKEN, -24)],
      tuba: sustained(CLIMAX_CHORDS, BAR, 0, 2),
      choir: sustained(CLIMAX_CHORDS, BAR, 1, 3),
      piano: chordLine(CLIMAX_CHORDS, HAMMER, 3),
      race: arpeggio(CLIMAX_CHORDS, BAR, 4, RACE),
      pound: chordLine(CLIMAX_CHORDS, POUND, 2),
      basses: chordLine(CLIMAX_CHORDS, DIG, 1),
      timpani: timp(CLIMAX_CHORDS, T_POUND),
      bassDrum: repeat(BASS_DRUM, 24),
      taiko: repeat(TAIKO, 24),
      taikoHigh: fills(TAIKO_HI, 24, 8),
      snare: fills(SNARE, 24, 8),
      breakSnare: [...rest(8), ...fills(BREAK, 8, 4), ...rest(8)],
      hat: [...rest(8), ...repeat(HAT_16THS, 16)],
      openHat: [...rest(8), ...repeat(OPEN_HAT, 16)],
      kick: repeat(KICK, 24),
    },

    // Half time: his motif crawling back on the trombones and violins, E
    // minor, then Eb; then the build again, and the silence, and the drop.
    turn: {
      // The climax's last chord let go of with a crash and a gong, so the
      // half time lands as a release rather than a stall.
      crash: [...HIT, ...rest(7)],
      gong: [...HIT, ...rest(7)],
      trombones: [...transpose(CRAWL, -24), ...rest(4)],
      violins: [...CRAWL, ...rest(4)],
      horns: [...sustained(TURN_CHORDS, BAR, 0, 3), ...rest(4)],
      cellos: [...sustained(TURN_CHORDS, BAR, 0, 2), ...rest(4)],
      choir: [...sustained(TURN_CHORDS, BAR, 0, 3), ...cut(sustained('Gm Bb A A', BAR, 0, 3))],
      piano: [...chordLine(TURN_CHORDS, PULSE, 2), ...rest(4)],
      timpani: [...timp(TURN_CHORDS, T_ONE), ...rest(4)],
      bassDrum: [...repeat(HIT, 4), ...rest(4)],
      boom: [...every(4, 2), ...rest(4)],
      ...build('Gm Bb A', 4),
    },
  },

  // The intro plays once; after that the fight loops from the drop.
  order: ['intro', 'A', 'B', 'C', 'D', 'hush', 'duel', 'climax', 'turn'],
  loopFrom: 1,
};
