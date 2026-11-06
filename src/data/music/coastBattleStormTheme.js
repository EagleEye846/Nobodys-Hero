import { melody, hits, repeat, arpeggio, chordLine, sustained, transpose } from '../../audio/notation.js';
import { ORCHESTRA, timp, held, T_POUND, T_HEART, TAIKO, TAIKO_HI, SNARE, FILL } from './parts/usurper.js';

// "Salt in the Wound (Storm)": a rough version of the battle theme for
// ordinary fights on the chapter 5 coast, one of two to compare by ear (the
// other is "Salt in the Wound (Shanty)", now Corrie's boss theme in corrieBattleTheme.js, which
// plays the same tune). This one is the storm: fast and driving, waves
// breaking over and over. Spiccato violins rise and fall in 16ths like
// swell, cellos and basses gallop, timpani and war drums pound, and the
// horns carry the tune. In the middle the lightning: trumpets high over a
// choir, then a beat of silence and a drop (gong, deep drum, a low brass
// BRAAAM) with the tune on all the low brass. D minor, with Bb, C and Gm and
// A major to pull home. Nothing cheery.
//
// THE COAST TUNE (draft, shared with the shanty version): A D D E, the
// first bar of the horns' tune.
//
// 4/4 at 168 BPM, 16 steps to a bar, one step a 16th (a bar is about 1.43
// seconds). The intro plays once (4 bars); then it loops from A, 64 bars,
// about 1m31s:
//
//   intro    4 bars  the violins' swell alone, timpani, a cymbal swell in
//   A       16 bars  the horns' tune over the gallop and the drums
//   B        8 bars  the lightning: trumpets high, choir, tremolo; it stops
//                    dead for the last two beats
//   C        8 bars  the drop: gong, deep drum, BRAAAM; the tune's first
//                    half on trombones and tuba, the violins doubled
//   D       16 bars  the second verse, in G minor (the shanty's verse, in
//                    straight eighths): violins soaring with the horns
//                    under them, the Eb darkening it, the gallop going on
//   E        8 bars  the eye of the storm: the tune's first notes slow on
//                    soft horns over tremolo and a timpani heartbeat; the
//                    violins creep back and a cymbal swell pulls into F
//   F        8 bars  all hands: the tune's second half on trumpets, horns
//                    and trombones together, a gong, everything pounding,
//                    and home to A

const BAR = 16;
const tune = (text) => melody(text, 2);   // each token an eighth: 8 to a bar
const rest = (bars) => Array(bars * BAR).fill('.');
const tight = (name, section, bars) => {
  for (const [track, steps] of Object.entries(section)) {
    if (steps.length !== bars * BAR) throw new Error(`Salt in the Wound (Storm) ${name}: '${track}' is ${steps.length} steps, not ${bars} bars`);
  }
  return section;
};
// Cut the last two beats of a part, for the silent beat before the drop.
const cut = (steps) => [...steps.slice(0, steps.length - 8), ...Array(8).fill('.')];
// The cymbal swell is loudest 3.18 seconds in: 36 steps at 168 BPM.
const SWELL_STEPS = 36;
const swellInto = (bars) => [...Array(bars * BAR - SWELL_STEPS).fill('.'), ...held(60, SWELL_STEPS)];
const once = (pattern, bars) => [...pattern, ...Array(bars * BAR - pattern.length).fill('.')];

// --- Harmony, a bar each ---
const TUNE_CHORDS = 'Dm C Dm Am Bb C A Dm Dm C Bb A Dm Bb A Dm';
const B_CHORDS = 'Gm Gm Bb Bb C C A A';
const C_CHORDS = 'Dm C Dm Am Bb C A A';
const INTRO_CHORDS = 'Dm Dm Dm A';
const D_CHORDS = 'Gm Gm Dm Dm Bb Eb A A Gm Gm Dm Bb Eb C A A';
const E_CHORDS = 'Dm Dm Bb Bb Gm Gm A A';
const F_CHORDS = 'Dm C Bb A Dm Bb A Dm';

// --- The coast tune, in straight eighths. ---
const TUNE = tune(`
  A4 - - D5 D5 - E5 -    F5 - - E5 C5 - - -
  A4 - - D5 D5 - E5 -    F5 - - G5 E5 - - -
  F5 - - D5 Bb4 - D5 -   C5 - - A4 G4 - A4 -
  Bb4 - A4 - G4 F4 E4 -  D4 - - - D4 E4 F4 A4
  D5 - - F5 A5 - G5 -    E5 - - C5 G4 - C5 -
  D5 - - F5 Bb5 - A5 -   A5 - - - G5 F5 E5 -
  F5 - - E5 D5 - A4 -    Bb4 - - D5 F5 - D5 -
  E5 - - C#5 A4 Bb4 C#5 -  D5 - - - - - . .
`);
// The lightning: the trumpets climb the Gm and Bb chords and fall to A.
const LIGHTNING = tune(`
  D5 - - - G5 - - -      Bb5 - - A5 G5 - - -
  F5 - - - Bb5 - - -     D6 - - C6 Bb5 - - -
  C6 - - - E5 - G5 -     C6 - - Bb5 A5 - G5 -
  A5 - - - - - G5 -      E5 - - - C#5 - . .
`);

// The second verse, in G minor: the shanty's verse in straight eighths.
const VERSE = tune(`
  D5 - - G5 G5 - A5 -    Bb5 - - A5 G5 - D5 -
  F5 - - E5 D5 - A4 -    D5 - - - - - . .
  D5 - - F5 F5 - Bb5 -   G5 - - F5 Eb5 - Bb4 -
  C#5 - - E5 A5 - G5 -   E5 - - - C#5 - - .
  D5 - - G5 G5 - A5 -    Bb5 - - C6 D6 - Bb5 -
  A5 - - F5 D5 - F5 -    F5 - - D5 Bb4 - D5 -
  Eb5 - - G5 Bb5 - G5 -  E5 - - G5 C6 - Bb5 -
  A5 - G5 - F5 E5 C#5 -  A4 - - - - - . .
`);
// The eye of the storm: the tune's first notes, slow.
const SLOW = tune(`
  A3 - - - - - - -   D4 - - - - - - -   D4 - - - E4 - - -   F4 - - - - - - -
  G4 - - - - - - -   F4 - - - E4 - - -  E4 - - - - - - -    C#4 - - - - - . .
`);

// --- Patterns, a bar each ---
// The violins' swell: up the chord and back, two waves to a bar.
const SWELL = [0, 7, 12, 'tenth', 12, 7, 'third', 7, 0, 7, 12, 'tenth', 19, 'tenth', 12, 7];
// The gallop: an eighth and two sixteenths, four times.
const GALLOP = [0, '.', 0, 0, 0, '.', 0, 0, 0, '.', 0, 0, 7, '.', 7, 7];
const ROOTS = [0, '-', '-', '-', '-', '-', '-', '-', 0, '-', '-', '-', '-', '-', 7, '.'];
const T_DROP = [0, '.', '.', '.', '.', '.', '.', '.', 0, '.', '.', 0, '.', '.', '.', '.'];

export const COAST_BATTLE_STORM_THEME = {
  title: 'Salt in the Wound (Storm)',
  bpm: 168,
  stepsPerBeat: 4,
  volume: 0.7,

  instruments: {
    ...ORCHESTRA,
    race: { ...ORCHESTRA.race, volume: 0.24 },
    raceHigh: { ...ORCHESTRA.race, volume: 0.16, pan: -0.3 },
    violinsTrem: { sample: 'violinsTrem', volume: 0.22, attack: 0.4, release: 0.6, reverb: 0.45, pan: 0.2 },
    lowTrem: { sample: 'cellosTrem', volume: 0.26, attack: 0.5, release: 0.6, reverb: 0.4, pan: -0.2 },
    choirBig: { sample: 'choir', volume: 0.28, attack: 0.5, release: 0.8, reverb: 0.6 },
    horns: { ...ORCHESTRA.horns, volume: 0.42 },
    trumpets: { ...ORCHESTRA.trumpets, volume: 0.36 },
    tom: { sample: 'tom', drum: 'sample', volume: 0.36, ring: true, reverb: 0.3, pan: -0.15, humanize: { time: 0.004, volume: 0.2 } },
  },

  sections: {
    // The violins' swell alone over the timpani; a cymbal swell into A.
    intro: tight('intro', {
      race: arpeggio(INTRO_CHORDS, BAR, 4, SWELL),
      lowTrem: sustained(INTRO_CHORDS, BAR, 0, 2),
      timpani: timp(INTRO_CHORDS, T_POUND),
      swell: swellInto(4),
    }, 4),

    // The horns' tune over the gallop and the drums.
    A: tight('A', {
      horns: TUNE,
      trombones: [...rest(8), ...transpose(TUNE.slice(8 * BAR), -12)],
      race: arpeggio(TUNE_CHORDS, BAR, 4, SWELL),
      pound: chordLine(TUNE_CHORDS, GALLOP, 2),
      basses: chordLine(TUNE_CHORDS, ROOTS, 1),
      cellos: sustained(TUNE_CHORDS, BAR, 0, 2),
      timpani: timp(TUNE_CHORDS, T_POUND),
      taiko: repeat(TAIKO, 16),
      taikoHigh: [...rest(8), ...repeat(TAIKO_HI, 8)],
      snare: [...repeat(SNARE, 15), ...FILL],
      crash: once(hits('x'), 16),
    }, 16),

    // The lightning: trumpets high over the choir; it stops dead for the
    // last two beats.
    B: tight('B', {
      trumpets: LIGHTNING,
      horns: cut(sustained(B_CHORDS, BAR, 1, 3)),
      choirBig: cut(sustained(B_CHORDS, BAR, 2, 4)),
      violinsTrem: cut(sustained(B_CHORDS, BAR, 0, 5)),
      raceHigh: cut(arpeggio(B_CHORDS, BAR, 5, SWELL)),
      pound: cut(chordLine(B_CHORDS, GALLOP, 2)),
      basses: cut(chordLine(B_CHORDS, ROOTS, 1)),
      timpani: cut(timp(B_CHORDS, T_POUND)),
      taiko: cut(repeat(TAIKO, 8)),
      tom: cut([...rest(4), ...repeat(hits('....x..x....x.x.'), 4)]),
      crash: once(hits('x'), 8),
      swell: cut(swellInto(8)),
    }, 8),

    // The drop: gong, deep drum, BRAAAM; the tune's first half on the low
    // brass, the violins doubled.
    C: tight('C', {
      gong: once(hits('x'), 8),
      impact: [...hits('x'), ...rest(4).slice(1), ...hits('x'), ...rest(4).slice(1)],
      braam: [...held('D3', 2 * BAR), ...rest(6)],
      braamLow: [...held('D2', 2 * BAR), ...rest(6)],
      trombones: transpose(TUNE.slice(0, 8 * BAR), -12),
      tuba: transpose(TUNE.slice(0, 8 * BAR), -24),
      horns: TUNE.slice(0, 8 * BAR),
      race: arpeggio(C_CHORDS, BAR, 4, SWELL),
      raceHigh: arpeggio(C_CHORDS, BAR, 5, SWELL),
      pound: chordLine(C_CHORDS, GALLOP, 2),
      basses: chordLine(C_CHORDS, ROOTS, 1),
      choirBig: sustained(C_CHORDS, BAR, 0, 3),
      timpani: [...timp('Dm C Dm Am Bb C', T_POUND), ...timp('A A', T_DROP)],
      taiko: repeat(TAIKO, 8),
      taikoHigh: repeat(TAIKO_HI, 8),
      snare: [...repeat(SNARE, 7), ...FILL],
      crash: [...once(hits('x'), 4), ...once(hits('x'), 4)],
    }, 8),

    // The second verse in G minor: violins soaring, horns under them.
    D: tight('D', {
      violins: VERSE,
      horns: transpose(VERSE, -12),
      race: arpeggio(D_CHORDS, BAR, 4, SWELL),
      pound: chordLine(D_CHORDS, GALLOP, 2),
      basses: chordLine(D_CHORDS, ROOTS, 1),
      cellos: sustained(D_CHORDS, BAR, 0, 2),
      choirBig: [...rest(8), ...sustained(D_CHORDS.split(' ').slice(8).join(' '), BAR, 2, 4)],
      timpani: timp(D_CHORDS, T_POUND),
      taiko: repeat(TAIKO, 16),
      taikoHigh: repeat(TAIKO_HI, 16),
      snare: [...repeat(SNARE, 15), ...FILL],
      crash: [...once(hits('x'), 8), ...once(hits('x'), 8)],
    }, 16),

    // The eye of the storm: soft horns, tremolo, a heartbeat; the violins
    // creep back and a swell pulls into F.
    E: tight('E', {
      hornsSoft: SLOW,
      lowTrem: sustained(E_CHORDS, BAR, 0, 2),
      violinsTrem: [...rest(4), ...sustained(E_CHORDS.split(' ').slice(4).join(' '), BAR, 2, 4)],
      choirBig: sustained(E_CHORDS, BAR, 0, 3),
      timpani: timp(E_CHORDS, T_HEART),
      race: [...rest(6), ...arpeggio('A A', BAR, 4, SWELL)],
      roll: [...rest(7), ...hits('xxxxxxxxxxxxxxxx')],
      swell: swellInto(8),
    }, 8),

    // All hands: the tune's second half on trumpets, horns and trombones.
    F: tight('F', {
      gong: once(hits('x'), 8),
      trumpets: TUNE.slice(8 * BAR),
      horns: transpose(TUNE.slice(8 * BAR), -12),
      trombones: transpose(TUNE.slice(8 * BAR), -24),
      race: arpeggio(F_CHORDS, BAR, 4, SWELL),
      raceHigh: arpeggio(F_CHORDS, BAR, 5, SWELL),
      pound: chordLine(F_CHORDS, GALLOP, 2),
      basses: chordLine(F_CHORDS, ROOTS, 1),
      tuba: chordLine(F_CHORDS, ROOTS, 1),
      choirBig: sustained(F_CHORDS, BAR, 2, 4),
      timpani: timp(F_CHORDS, T_POUND),
      taiko: repeat(TAIKO, 8),
      taikoHigh: repeat(TAIKO_HI, 8),
      snare: [...repeat(SNARE, 7), ...FILL],
      crash: [...once(hits('x'), 4), ...once(hits('x'), 4)],
    }, 8),
  },

  order: ['intro', 'A', 'B', 'C', 'D', 'E', 'F'],
  loopFrom: 1,
};
