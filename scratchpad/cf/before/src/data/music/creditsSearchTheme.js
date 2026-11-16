import { sustained, arpeggio, chordLine } from '../../audio/notation.js';
import {
  BAR_128 as BAR, slow, eighths, rest as restBars, held, repeat, transpose, midi, hits,
  onNotes, heldNotes, patter, cells, cellsFor, drops,
} from './parts/chapter3.js';

// "Somebody Came": the credits song at the end of Chapter Three, after the
// Hero's Gate. The hero fell from the summit and went looking for Ves:
// through the scarlet Pinefall, the old Hushwood with Bramble, an empty
// village and the drains under it, the Lantern Marsh where he found her
// hurt, Lasthome (the town of the ones who stopped waiting), the dead city
// built for a Hero who never came, and the Gate, where a stone Warden stood
// and the Hush had her mother's umbrella. She got it back, and they walked
// through the Gate together, umbrella up. Nobody came for the land; somebody
// came for her. So this is coming out the other side: warm, a little tired,
// looking back on the way, and hopeful. In the spirit of Toby Fox's credits
// pieces, it walks back through the chapter's tunes, each one changed:
//
//   - her motif ("Carried on the Wind", vesTheme.js) re-barred into a 12/8
//     lilt (C C, up to A; a long Bb, G, and the A held). At the start the
//     music box only gets as far as C C A, twice, and stops: she's missing.
//     It comes back tender on the fiddle in the marsh, answers the town tune
//     on the flute, climbs past the ache at the Gate, and at the very end
//     the music box plays it through to the finish.
//   - Bramble's jig ("Didn't Mind the Camp", brambleTheme.js), once, on the
//     tin whistle, in F at well under half his speed: a fond memory, not a
//     dance. His three cuts start on C just like her motif does. Then, in
//     the empty village, the clarinet plays his three cuts with no tick.
//   - the marsh lament ("The Quiet Way", marshTheme.js) on an oboe, moved
//     from G minor into D minor; and this time the mist lifts: it ends on D
//     major, the lament's falling half step turned into a major third.
//   - the Lasthome tune ("The Ones Who Stopped Waiting", lasthomeTheme.js)
//     in G on the felt piano, then the fiddle with the flute a third below;
//     at the end of the dawn it's in the cellos, under her tune, and it
//     comes home on G instead of hanging on its second.
//   - the Long Stair's fanfare fallen into E minor on soft horns in the dead
//     city, never reaching home; the Warden's falling fourth and his "no"
//     on the trombones, and the Hush's claws on the cellos.
//   - "Nobody's Dawn" (nobodysDawnTheme.js), the tune she won the umbrella
//     back to, slowed from a 150-BPM battle cry to a walk, in its own G
//     major; it closes on the amen from her theme (C going to C minor
//     before G), and a G with its ninth left ringing.
//
// The chapter's sound throughout (parts/chapter3.js): a fixed stack of
// fifths falling like rain on the harp or a felt piano while the bass
// recolours it underneath. All real recordings (VSCO 2 and VCSL, both CC0);
// no synth presets. Keys: F (her key) to D minor and D major, G for the
// town, E minor for the dead city, D minor at the Gate opening into F, and a
// step up to G for the dawn. Rolling 12/8 at 68 dotted quarters a minute,
// one step an 8th, a bar 3.5s. Plays once: 50 bars, just under three
// minutes, and the last chord rings out.
//
//   fall    4 bars  0:00  a low F, a glass ringing; her motif on a music box,
//                         C C A and no further, twice; the harp's rain
//                         begins; a hatchet taps three times and a tick
//   wood    4 bars  0:14  Bramble's jig on the whistle, slow, pizzicato
//                         oom-cha and a bodhran; his jar of treasure glints
//   empty   4 bars  0:28  D minor, the rain thinned out: the empty village
//                         and the drains, water dripping; three cuts and no
//                         tick on the clarinet
//   marsh   8 bars  0:42  the marsh lament on the oboe over the rain; then
//                         her motif on the fiddle, tender, then grieving,
//                         the strings swelling, a heartbeat; and D major
//   town    8 bars  1:11  Lasthome: its tune on the felt piano, then the
//                         fiddle with the flute a third below, the cellos and
//                         horn warm, a soft knock; her motif answers
//   city    4 bars  1:39  the rain stops: tremolo strings, the fanfare
//                         fallen on soft horns, a glass; a timpani roll
//   gate    8 bars  1:53  the Warden and the Hush, D minor, a swell; then F
//                         major and everything: her motif past the ache on
//                         violins and flute, trumpets and cellos under, the
//                         harp running, timpani, a gong; and a lift to D
//   dawn   10 bars  2:21  up a step to G: "Nobody's Dawn" slowed to a walk on
//                         the strings and flute, the Lasthome tune in the
//                         cellos under it; the amen; then a G with its
//                         ninth, and the music box plays her motif to the
//                         end

// In 12/8 a bar is 12 steps.
const rest = (bars) => restBars(bars, BAR);
// Every track of a section padded with rests to the same length (and none
// allowed to run over), so a line can stop early without counting its rests.
const section = (bars, tracks) => Object.fromEntries(Object.entries(tracks).map(([name, track]) => {
  const length = bars * BAR;
  if (track.length > length) throw new Error(`Somebody Came: '${name}' is ${track.length} steps, more than ${bars} bars`);
  return [name, [...track, ...Array(length - track.length).fill('.')]];
}));

// --- The rain: a stack of fifths, rising in 8ths, then once more up top
// (the marsh's shape). ---
const RAIN = [0, 1, 2, 3, 2, 1, 0, 1, 2, 4, 3, 2];
// Thinned out, for the empty village.
const RAIN_THIN = [0, '.', 2, '.', 3, '.', 4, '.', 2, '.', 1, '.'];
// The town's felt piano, in threes (Lasthome's shape).
const PATTER = [0, 2, 1, 0, 2, 1, 0, 2, 1, 0, 2, 1];
const F_RAIN = 'F3 C4 G4 C5 G5';
const D_RAIN = 'D3 A3 E4 A4 E5';

// --- Bass shapes, a bar each. ---
const ONE = [0, ...Array(BAR - 1).fill('.')];
// The town's left hand: the root, leaning onto its fifth halfway through.
const LEFT = [0, '-', '-', '-', '-', '-', 7, '-', '-', '-', '-', '-'];
// The marsh's heartbeat on the timpani: long and short.
const HEART = [midi('D3'), '.', '.', '.', '.', midi('D3'), ...Array(BAR - 6).fill('.')];
const KNOCK = hits('...x.....x..');
// The cymbal swell peaks 3.18s in: 11 steps, so it lands on the next downbeat.
const swellInto = (bars) => [...rest(bars).slice(11), ...held(60, 11)];

// --- Her motif, re-barred into 12/8: C C, up to A; a long Bb, G, and the
// A held. Only its first three notes, to begin with. ---
const HERS_UNFINISHED = eighths('C6 C6 A6 - - - . . . . . .');
// In D minor, tender; and in G minor, grieving (the marsh's forms of it).
const HERS_FOUND = eighths(`
  A4 A4 F5 - - - G5 - E5 F5 - - | D5 D5 Bb5 - - - C6 - A5 Bb5 - - |
  A5 - - G5 - - E5 - - C#5 - - | D5 - - - - - - - - . . . |
`);
// In G, answering the town tune.
const HERS_ANSWER = eighths('D5 D5 B5 - - - C6 - A5 B5 - -');
// At the end, the music box gets all the way through it.
const HERS_FINISHED = eighths('D6 D6 B6 - - - C7 - A6 B6 - -');

// --- Bramble's jig, in F, its eight bars of 6/8 laid two to a bar of
// 12/8: three cuts and a tick (C C C, up to F), and it ends on F with no
// run-up into the next strain. ---
const BRAMBLE = eighths(`
  C5 C5 C5 F5 - G5 A5 - F5 C5 - A4 | D5 D5 D5 G5 - A5 Bb5 - G5 E5 - C5 |
  C5 C5 C5 F5 - G5 A5 - F5 D5 - F5 | Bb5 - A5 G5 - E5 F5 - - - - - |
`);
const WOOD_HALVES = 'F F Bb C F Dm C F';
// Three cuts, and no tick: he slips back down.
const NO_TICK = eighths(`
  F4 F4 F4 E4 - D4 . . . . . . | . . . . . . . . . . . . |
  A4 A4 A4 G4 - F4 E4 - - - - - | E4 - - - - - - - - . . . |
`);
const EMPTY_CHORDS = 'Dm Bb Gm Am';

// --- The marsh: its lament in D minor (each token a dotted quarter), then
// the mist lifting. ---
const LAMENT = slow('A4 - - Bb4 | A4 - G4 - | F4 - - G4 | A4 - - - ');
const LIFTS = eighths('A4 - - - - - F#4 - - - - -');
const MARSH_CHORDS = 'Dm Gm F Bb Bb Gm A D';
const MARSH_BASS = 'D2 G1 F1 Bb1 Bb1 G1 A1 D2';

// --- Lasthome's tune in G (each token a dotted quarter), and the flute a
// third below its second half. ---
const TOWN_TUNE = slow('B4 D5 E5 D5 | B4 - A4 - | G4 A4 B4 D5 | A4 - - - ');
const TOWN_TUNE_2 = slow('B4 D5 E5 G5 | F#5 - E5 D5 | C5 B4 A4 B4 | G4 - - - ');
const TOWN_THIRDS = slow('G4 B4 C5 E5 | D5 - C5 B4 | A4 G4 F#4 G4 ');
const TOWN_CHORDS = 'C G Em F C G D G';
const TOWN_BASS = 'C3 B2 E2 F2 C3 G2 D2 G2';

// --- The dead city: the Long Stair's fanfare fallen into E minor. It
// stops on its fifth. ---
const FANFARE_FALLEN = [
  ...slow('B2 E3 G3 B3'),
  ...eighths('A3 - - - - F#3 D#3 - - F#3 - - | G3 - - - - - E3 - - C3 - - | E3 - - - - - - - - . . .'),
];

// --- The Gate. The Warden: a fourth falling, and a half step that says
// no; the Hush: a minor third, a tritone, and the pounce. ---
const WARDEN = slow('D3 - A2 - | Eb3 - D3 - ');
const HUSH = eighths('G3 - Bb3 - C#4 - D4 - - - - -');
// Then her motif, climbing on past the ache instead of settling, and the
// lift up to D.
const UMBRELLA_UP = eighths(`
  C5 C5 A5 - - - Bb5 - C6 F6 - - | E6 - - D6 - C6 G5 - - - - - |
  A4 A4 F5 - - - G5 - A5 D6 - - | C6 - - Bb5 - A5 F5 - - - - - |
  Bb5 - - A5 - G5 A5 - - G5 - - | F5 - - - - - D5 - - F#5 - - |
`);
const GATE_HALVES = 'F F C C Dm Dm Bb Bb Gm C F D';
const GATE_TIMPANI = eighths(`
  F2 . . . . . F2 . . . . . | C3 . . . . . C3 . . . . . | D3 . . . . . D3 . . . . . |
  Bb2 . . . . . Bb2 . . . . . | G2 . . . . . C3 . . . . . | F2 . . . . . D3 . . . D3 D3 |
`);
// The harp running up and back, half a bar a chord.
const RUN = [0, 7, 12, 'tenth', 19, 12];

// --- The dawn: "Nobody's Dawn" slowed to a walk, in G; then the amen. ---
const DAWN = eighths(`
  B4 B4 G5 - - - A5 - B5 C6 - - | D6 - - - - - C6 - - B5 - - |
  C6 - - - - - B5 - - A5 - - | B5 - - - - - G5 - - E5 - - |
  C5 - - - - - D5 - - E5 - - | D5 - - - - - - - - . . . |
  C6 - - B5 - - A5 - - F#5 - - | G5 - - - - - - - - - - - |
`);
// Under it, in the cellos: the Lasthome tune, coming home on G; then a
// tenor line down to the amen.
const DAWN_CELLOS = slow(`
  B3 D4 E4 D4 | B3 - A3 - | G3 A3 B3 D4 | G3 - - - |
  E4 - D4 C4 | A3 - - - | G3 - A3 - | G3 - - - |
`);
const DAWN_HALVES = 'G G D D C C Em Em Am Am D D C D Cm G';
const DAWN_BASS = slow(`
  G2 - - - | F#2 - - - | C3 - - - | E2 - - - | A2 - - - | D2 - - - |
  C2 - D2 - | C2 - G2 - | G2 - - - | - - - - |
`);
// The last chord, rolled up the harp: G with its ninth.
const LAST_ROLL = eighths('G2 D3 G3 A3 B3 D4 G4 A4 B4 D5 - -');

export const CREDITS_SEARCH_THEME = {
  title: 'Somebody Came',
  bpm: 68,
  stepsPerBeat: 3,
  // Plays once, then the credits end.
  loop: false,
  // Level with the chapter two credits: quiet at the start, fullest at the Gate.
  volume: 0.8,

  instruments: {
    // The rain, and the harp running at the Gate.
    rain: { sample: 'harp', volume: 0.18, ring: true, reverb: 0.6, pan: -0.25, humanize: { time: 0.012, volume: 0.2 } },
    harp: { sample: 'harp', volume: 0.2, ring: true, reverb: 0.55, pan: -0.3, humanize: { time: 0.01, volume: 0.15 } },
    // The town's felt piano: the rain, the left hand, the tune.
    patter: { sample: 'grandPiano', volume: 0.1, release: 1, reverb: 0.45, pan: 0.2, humanize: { time: 0.012, volume: 0.25 } },
    left: { sample: 'grandPiano', volume: 0.15, ring: true, reverb: 0.45, pan: -0.1, humanize: { time: 0.012, volume: 0.12 } },
    piano: { sample: 'grandPiano', volume: 0.19, ring: true, reverb: 0.45, humanize: { time: 0.014, volume: 0.15 } },
    drops: { sample: 'grandPiano', volume: 0.09, ring: true, reverb: 0.7, pan: 0.4, humanize: { time: 0.03, volume: 0.3 } },
    musicBox: { sample: 'glock', volume: 0.15, ring: true, reverb: 0.6, pan: 0.3, echo: { time: 0.6, feedback: 0.38, mix: 0.35 } },
    bells: { sample: 'glock', volume: 0.08, ring: true, reverb: 0.6, pan: 0.35 },
    glass: { sample: 'glass', volume: 0.08, attack: 1.2, release: 2, reverb: 0.8, pan: -0.3 },
    // Woodwinds, close.
    whistle: { sample: 'recorder', volume: 0.22, attack: 0.06, release: 0.5, reverb: 0.5, pan: 0.2, humanize: { time: 0.012, volume: 0.12 } },
    flute: { sample: 'flute', volume: 0.22, attack: 0.08, release: 0.6, reverb: 0.55, pan: 0.25, humanize: { time: 0.012, volume: 0.1 } },
    oboe: { sample: 'oboe', volume: 0.26, attack: 0.1, release: 0.7, reverb: 0.55, pan: 0.1, humanize: { time: 0.012, volume: 0.1 } },
    clarinet: { sample: 'clarinet', volume: 0.26, attack: 0.08, release: 0.7, reverb: 0.55, pan: -0.15, humanize: { time: 0.012, volume: 0.1 } },
    // Strings: violins left, cellos right, basses in the middle.
    fiddle: { sample: 'soloViolin', volume: 0.3, attack: 0.08, release: 0.6, reverb: 0.5, pan: 0.15, humanize: { time: 0.012, volume: 0.12 } },
    violins: { sample: 'violins', volume: 0.32, attack: 0.05, release: 0.6, reverb: 0.5, pan: -0.25, humanize: { time: 0.008, volume: 0.08 } },
    strings: { sample: 'violins', volume: 0.24, attack: 0.25, release: 1, reverb: 0.55, pan: -0.25, humanize: { time: 0.01, volume: 0.08 } },
    // Where a choir would breathe: the violas, bowed so softly it's mostly air.
    pad: { sample: 'violas', volume: 0.11, attack: 1.4, release: 1.8, reverb: 0.75, pan: -0.1 },
    violas: { sample: 'violas', volume: 0.18, attack: 0.3, release: 1, reverb: 0.5, pan: -0.05 },
    cellos: { sample: 'cellos', volume: 0.28, attack: 0.15, release: 0.9, reverb: 0.5, pan: 0.25, humanize: { time: 0.012, volume: 0.1 } },
    low: { sample: 'cellos', volume: 0.16, attack: 0.6, release: 1.4, reverb: 0.5, pan: 0.15 },
    drone: { sample: 'cellos', volume: 0.15, attack: 1.5, release: 2, reverb: 0.5, pan: 0.1 },
    basses: { sample: 'bassSpic', volume: 0.2, release: 0.6, reverb: 0.45, humanize: { time: 0.01, volume: 0.15 } },
    tremolo: { sample: 'cellosTrem', volume: 0.18, attack: 0.8, release: 1.2, reverb: 0.55, pan: 0.2 },
    tremoloHigh: { sample: 'violasTrem', volume: 0.12, attack: 0.8, release: 1.2, reverb: 0.6, pan: -0.15 },
    tremoloTop: { sample: 'violinsTrem', volume: 0.12, attack: 1, release: 1, reverb: 0.55, pan: -0.25 },
    pizzLow: { sample: 'cellosPizz', volume: 0.18, ring: true, reverb: 0.4, pan: 0.2, humanize: { time: 0.008, volume: 0.15 } },
    pizz: { sample: 'violinsPizz', volume: 0.13, ring: true, reverb: 0.4, pan: -0.2, humanize: { time: 0.008, volume: 0.2 } },
    pizzHigh: { sample: 'violinsPizz', volume: 0.11, ring: true, reverb: 0.4, pan: -0.3, humanize: { time: 0.008, volume: 0.2 } },
    // Brass, behind.
    horns: { sample: 'hornsSoft', volume: 0.26, attack: 0.3, release: 0.9, reverb: 0.55, pan: -0.1 },
    hornsFull: { sample: 'horns', volume: 0.26, attack: 0.1, release: 0.6, reverb: 0.5, pan: -0.1 },
    trumpets: { sample: 'trumpet', volume: 0.24, attack: 0.04, release: 0.5, reverb: 0.5, pan: 0.1, humanize: { time: 0.006, volume: 0.08 } },
    trombones: { sample: 'trombone', volume: 0.24, attack: 0.08, release: 0.7, reverb: 0.45, pan: -0.15 },
    warden: { sample: 'trombone', volume: 0.32, attack: 0.05, release: 0.9, reverb: 0.5, pan: -0.1 },
    tuba: { sample: 'tuba', volume: 0.3, attack: 0.08, release: 0.8, reverb: 0.4 },
    // Percussion.
    timpani: { sample: 'timpani', volume: 0.36, ring: true, reverb: 0.4 },
    heart: { sample: 'timpani', volume: 0.2, ring: true, reverb: 0.5 },
    timpRoll: { sample: 'timpaniRoll', volume: 0.26, attack: 2.5, release: 0.4, reverb: 0.4 },
    swell: { sample: 'cymbalSwell', volume: 0.26, release: 0.04, reverb: 0.35 },
    crash: { sample: 'crash', drum: 'sample', volume: 0.2, ring: true, reverb: 0.4 },
    gong: { sample: 'gong', drum: 'sample', volume: 0.26, ring: true, reverb: 0.45 },
    bassDrum: { sample: 'concertBassDrum', drum: 'sample', volume: 0.36, ring: true, reverb: 0.4 },
    bodhran: { sample: 'frameDrum', drum: 'sample', volume: 0.18, ring: true, reverb: 0.35, humanize: { time: 0.006, volume: 0.25 } },
    knock: { sample: 'snareSoft', drum: 'sample', volume: 0.1, ring: true, reverb: 0.35, humanize: { time: 0.006, volume: 0.3 } },
  },

  sections: {
    // A low F and a glass ringing; her motif's first three notes on the
    // music box, twice, and no further; the rain begins; then a hatchet
    // taps three times and a tick.
    fall: section(4, {
      drone: heldNotes('F2 F2 D2 Bb1', BAR),
      glass: held(midi('C6'), 2 * BAR),
      musicBox: [...HERS_UNFINISHED, ...rest(1), ...HERS_UNFINISHED],
      rain: [...rest(1), ...patter(cells(F_RAIN, 3), RAIN)],
      pad: [...rest(1), ...sustained('F Dm Bb', BAR, 1, 4)],
      drops: drops('F F Dm Bb', BAR, 0.06, 5, 1),
      knock: [...rest(3), ...hits('......x.x.x.')],
    }),

    // Bramble's jig on the whistle, slow and fond, over a pizzicato oom-cha
    // and a bodhran; his jar of treasure glints at the end.
    wood: section(4, {
      whistle: BRAMBLE,
      pizzLow: chordLine(WOOD_HALVES, [0, '.', '.', 7, '.', '.'], 2),
      pizz: chordLine(WOOD_HALVES, ['.', '.', 'third', '.', '.', 'third'], 4),
      pizzHigh: chordLine(WOOD_HALVES, ['.', '.', 7, '.', '.', 7], 4),
      bodhran: repeat(hits('x.....x..x..'), 4),
      bells: [...rest(3), ...eighths('. . . . . . A6 . C7 . F7 .')],
    }),

    // The empty village and the drains: D minor, the rain thinned out,
    // water dripping; his three cuts on the clarinet, and no tick.
    empty: section(4, {
      rain: patter(cells(D_RAIN, 4), RAIN_THIN),
      clarinet: NO_TICK,
      low: heldNotes('D3 Bb2 G2 A2', BAR),
      basses: onNotes('D2 Bb1 G1 A1', ONE),
      pad: sustained(EMPTY_CHORDS, BAR, 1, 4),
      drops: drops(EMPTY_CHORDS, BAR, 0.1, 9, 1),
    }),

    // The marsh lament on the oboe over the rain; then her motif on the
    // fiddle, tender, then grieving, the strings swelling and a heartbeat
    // under them; and the mist lifts onto D major.
    marsh: section(8, {
      rain: patter(cellsFor(MARSH_CHORDS, { A: 'A3 E4 B4 E5 C#6' }, D_RAIN), RAIN),
      oboe: [...LAMENT, ...rest(3), ...LIFTS],
      fiddle: [...rest(4), ...HERS_FOUND],
      strings: [...rest(4), ...sustained('Bb Gm A D', BAR, 2, 4)],
      pad: [...rest(2), ...sustained('F Bb Bb Gm A D', BAR, 1, 4)],
      low: heldNotes(MARSH_BASS, BAR, 1),
      basses: onNotes(MARSH_BASS, ONE),
      heart: [...rest(4), ...HEART, ...HEART],
      drops: drops(MARSH_CHORDS, BAR, 0.04, 3, 1),
    }),

    // Lasthome: its tune on the felt piano over the rain; then the fiddle,
    // the flute a third below, the cellos and horn warm, a soft knock; and
    // when the tune comes home, her motif answers it.
    town: section(8, {
      patter: patter(cells('G5 D6 A6', 8), PATTER),
      left: onNotes(TOWN_BASS, LEFT),
      piano: TOWN_TUNE,
      fiddle: [...rest(4), ...TOWN_TUNE_2],
      flute: [...rest(4), ...TOWN_THIRDS, ...HERS_ANSWER],
      cellos: [...rest(4), ...heldNotes('C3 G2 D3 G2', BAR)],
      horns: [...rest(4), ...heldNotes('G3 D3 A3 B3', BAR)],
      pad: [...rest(4), ...sustained('C G D G', BAR, 1, 4)],
      knock: [...rest(4), ...repeat(KNOCK, 4)],
      bells: drops(TOWN_CHORDS, BAR, 0.04, 2, 1),
    }),

    // The rain stops. The dead city: tremolo strings, the fanfare fallen on
    // soft horns, a glass high up; and a timpani roll toward the Gate.
    city: section(4, {
      horns: FANFARE_FALLEN,
      tremolo: heldNotes('E3 B2 C3 A2', BAR),
      tremoloHigh: sustained('Em B C A', BAR, 1, 4),
      basses: onNotes('E2 B1 C2 A1', ONE),
      glass: held(midi('B5'), 2 * BAR),
      timpRoll: [...rest(3), ...held(midi('A2'), BAR)],
    }),

    // The Warden on the trombones and tuba, the Hush on the cellos, the
    // violins trembling, a swell; then F major and everything: her motif on
    // violins and flute, trumpets an octave under, cellos two, the harp
    // running, horns and trombones holding the chords, timpani and a gong;
    // and the lift up to D.
    gate: section(8, {
      warden: WARDEN,
      tuba: [...slow('D2 - A1 - | Eb2 - D2 -'), ...slow('F1 - - - | C2 - - - | D2 - - - | Bb1 - - - | G1 - C2 - | F1 - D2 -')],
      cellos: [...HUSH, ...rest(1), ...transpose(UMBRELLA_UP, -24)],
      tremolo: held(midi('D3'), 2 * BAR),
      tremoloTop: [...held(midi('A4'), BAR), ...held(midi('Bb4'), 6), ...held(midi('A4'), 6)],
      timpRoll: [...rest(1), ...held(midi('D3'), BAR)],
      swell: swellInto(2),
      violins: [...rest(2), ...UMBRELLA_UP],
      flute: [...rest(2), ...UMBRELLA_UP],
      trumpets: [...rest(2), ...transpose(UMBRELLA_UP, -12)],
      harp: [...rest(2), ...arpeggio(GATE_HALVES, 6, 3, RUN)],
      violas: [...rest(2), ...sustained(GATE_HALVES, 6, 1, 4)],
      hornsFull: [...rest(2), ...sustained(GATE_HALVES, 6, 0, 3)],
      trombones: [...rest(2), ...sustained(GATE_HALVES, 6, 1, 3)],
      basses: onNotes('D2 D2 F1 C2 D2 Bb1 G1 F1', ONE),
      timpani: [...rest(2), ...GATE_TIMPANI],
      crash: [...rest(2), 'x'],
      gong: [...rest(2), 'x'],
      bassDrum: [...rest(2), 'x', ...rest(2).slice(1), 'x', ...rest(2).slice(1), 'x'],
    }),

    // Up a step to G: "Nobody's Dawn" slowed to a walk on the strings and
    // flute, the Lasthome tune in the cellos under it, the harp rolling, the
    // horns soft; the amen (C, then C minor, then G); a swell into the last
    // chord, G with its ninth; and the music box plays her motif to the end.
    dawn: section(10, {
      strings: [...DAWN, ...held(midi('B4'), 2 * BAR)],
      flute: DAWN,
      cellos: [...DAWN_CELLOS, ...held(midi('G3'), 2 * BAR)],
      low: DAWN_BASS,
      horns: sustained(DAWN_HALVES, 6, 1, 3),
      violas: [...sustained(DAWN_HALVES, 6, 2, 4), ...held(midi('D5'), 2 * BAR)],
      harp: [...arpeggio(DAWN_HALVES, 6, 3, RUN), ...LAST_ROLL],
      swell: swellInto(8),
      heart: [...rest(8), midi('G2')],
      musicBox: [...rest(8), ...HERS_FINISHED],
      glass: [...rest(8), ...held(midi('A5'), 2 * BAR)],
    }),
  },

  order: ['fall', 'wood', 'empty', 'marsh', 'town', 'city', 'gate', 'dawn'],
};
