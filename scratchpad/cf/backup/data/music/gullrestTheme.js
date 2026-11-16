import {
  melody, hits, repeat, arpeggio, sustained, chordLine, transpose, rest as restBars,
  haddockPhrase, tight, midi, after as afterBars, until as untilBars,
} from './parts/chapter5.js';

// "Bunting": the theme of Gullrest, the happy beach, the last bright place
// in the chapter. Flags on a string over the sand and everyone out in the
// sun. A flute whistles a hook you can hum after one go round, a plucked
// bass bounces in a little beach-band rhythm (DUM . . da . DUM . da: three,
// three and two), plucked violins chop the off-beats like a ukulele, a harp
// strums, a hand drum, a shaker and claps keep it moving, and a piccolo
// cries now and then like a gull. Nothing in it is sad; it should be a
// little too perfect, because the sky is about to go green and the player
// does not know yet. Reference for the mood only: Koji Kondo's seaside
// tunes (Windfall Island, the Great Sea), Undertale's gentler towns.
//
// THE HOOK IS THE COAST CELL (A D D E, the sea's tune, parts/chapter5.js)
// in its brightest form: in G major it is D G G A, and the hook runs it on
// up to B and skips back down (D G-G A B, D B G E). It comes round three
// times: on the flute alone (A), with a clarinet countermelody (A2), and
// at the end with everybody (A3). Bars 5 and 6 answer it with the same
// skipping rhythm stepping down (E D-C B A, D C-B A G), so the whole tune is
// one rhythm you can tap. The player has just heard the sea's tune on the
// clifftop ("All of It, All at Once"); here it is played on the sand,
// skipping, before the storm takes it. In the tide pools (C) it turns to E
// minor (B E-E F# G) with the major one floating over it in thirds: the
// first, faint cloud.
//
// HADDOCK'S MOTIF hides in it once: in the bridge, a clarinet low under the
// harp plays B A G, D (the motif in G, see parts/chapter5.js) as if
// someone is humming on a rock out of sight. Nothing points at it.
//
// G major, 4/4 at 108 (a bar is about 2.2 seconds); one step a 16th, 16 to
// a bar. The intro plays once (2 bars); then it loops from A, 48 bars,
// about 1m47s:
//
//   intro    2 bars  the bass and the harp start the bounce; the flute
//                    runs up into the hook
//   A        8 bars  THE HOOK on the flute over the bouncing band; a gull
//   A2       8 bars  the hook again, a clarinet countermelody moving
//                    wherever the hook holds; shaker and claps join
//   B        8 bars  a climbing second tune on the oboe, the flute a third
//                    above for its second half; one borrowed F major
//                    chord (the sunny flat seventh); the bass walks down
//                    C B A G F E D
//   C        8 bars  the tide pools: the hook in E minor on the oboe, the
//                    major hook over it on the flute; no drums, a gull;
//                    it lands on B major, a tiny shadow
//   bridge   8 bars  hushed: the hook slowed right down on the flute, bells
//                    after it, the harp still; the hidden motif
//   A3       8 bars  THE PAYOFF: the hook on flute and piccolo, the oboe
//                    countermelody, the harp rolling, glock, the whole
//                    band; the last bar is a gull

const BAR = 16;
const tune = (text) => melody(text, 2);   // each token an 8th: 8 to a bar
const rest = (bars) => restBars(bars, BAR);
const after = (bars, track) => afterBars(bars, track, BAR);
const until = (bars, track) => untilBars(bars, track, BAR);
const up = (steps, semitones) => transpose(steps, semitones);
const fit = (name, section, bars) => tight('Bunting', name, section, bars, BAR);

// --- Harmony, a bar each ---
const A_CHORDS = 'G Em C D C G D G';
// One borrowed chord here: F, the flat seventh, Kondo's sunny one.
const B_CHORDS = 'C G Am Em F C D D';
// The bass under B walks down by step (C, G over B, A, G, F, C over E, D).
const B_BASS = 'C3 B2 A2 G2 F2 E2 D3 D3';
const C_CHORDS = 'Em C G D Em C Am B';
const BRIDGE_CHORDS = 'C G Em D C G D D';
const INTRO_CHORDS = 'G D';

// --- THE HOOK: the coast cell (D G-G A), up to B, and skipping home. ---
const HOOK = tune(`
  D5 G5 - G5 A5 - B5 -     D6 - B5 - G5 E5 - .
  E5 G5 - G5 A5 - B5 -     C6 - B5 - A5 - - .
  E6 D6 - C6 B5 - A5 -     D6 C6 - B5 A5 - G5 -
  C6 - B5 - A5 - F#5 -     G5 - - - . . . .
`);
// The countermelody: it moves where the hook holds, and holds where it moves.
const COUNTER = tune(`
  B4 - - - D5 - - -        E5 - - - . . G4/A4 B4
  C5 - - - E5 - - -        F#5 - - - E5 - D5 C5
  C5 - - - E5 - - -        B4 - - - D5 - - -
  D5 - C5 - A4 - F#4 -     G4 - B4 - D5 - - .
`);
// The second tune: it climbs.
const TUNE_B = tune(`
  G4 - - C5 E5 - - -       D5 - C5 - B4 - G4 -
  A4 - - C5 E5 - - -       D5 - - - B4 - - -
  A5 - - - C6 - A5 -       G5 - E5 - C5 - E5 -
  F#5 - - - A5 - - -       C6 - B5 - A5 - F#5 -
`);
// The flute over its second half.
const TUNE_B_ABOVE = tune(`
  . . . . . . . .          . . . . . . . .
  . . . . . . . .          . . . . . . . .
  C6 - - - F6 - C6 -       C6 - G5 - E5 - G5 -
  A5 - - - D6 - - -        E6 - D6 - C6 - A5 -
`);
// The tide pools: the hook in E minor (B E-E F# G), then in G again.
const TUNE_C = tune(`
  B4 E5 - E5 F#5 - G5 -    B5 - G5 - E5 - . .
  D5 G5 - G5 A5 - B5 -     A5 - - - F#5 - - -
  B4 E5 - E5 F#5 - G5 -    C6 - B5 - G5 - E5 -
  A5 - G5 - E5 - C5 -      D#5 - - - F#5 - - -
`);
// The major hook floating a third over the minor one, halfway in.
const TUNE_C_ABOVE = tune(`
  . . . . . . . .          . . . . . . . .
  . . . . . . . .          . . . . . . . .
  D5 G5 - G5 A5 - B5 -     E6 - D6 - B5 - G5 -
  C6 - B5 - G5 - E5 -      F#5 - - - B5 - - -
`);
// The bridge: the hook slowed to half speed, one hushed line.
const BRIDGE = tune(`
  D5 - G5 - - - G5 -       A5 - - - B5 - - -
  D6 - - - B5 - - -        A5 - - - F#5 - - -
  E5 - - - G5 - - -        D5 - - - B4 - - -
  A4 - - - D5 - - -        F#5 - - - - - . .
`);
// Gulls: two quick falling notes, now and then.
const GULL = [midi('C7'), '-', midi('A6'), '-', '-', '-', ...Array(10).fill('.')];
const gulls = (bars, atBars) => Array.from({ length: bars }, (_, i) => (atBars.includes(i) ? GULL : rest(1))).flat();

// --- The band ---
// The bass: DUM . . da . DUM . da (3+3+2), the root, its fifth, the root,
// and a last note that leans into the next bar's root (from a semitone
// below when it climbs, a step above when it falls). It never sits still.
const chordsOf = (chords) => chords.split(/\s+/).filter(Boolean).map((symbol) => {
  const [, name, minor] = symbol.match(/^([A-G][#b]?)(m?)$/);
  return { root: midi(`${name}2`), third: minor ? 3 : 4 };
});
const fitBass = (n) => (n < 40 ? n + 12 : n);            // E2 up to D#3
const nextAbove = (n, pitchClass) => { let f = n + 1; while (f % 12 !== pitchClass) f += 1; return f; };
const leanInto = (from, to, third) => {
  if (to === from) return from + third;
  if (to > from || from - to <= 2) return to - 1;
  return to + 2;
};
function groove(chords, bassNotes) {
  const list = chordsOf(chords);
  const lows = bassNotes ? bassNotes.split(/\s+/).filter(Boolean).map(midi) : list.map((c) => fitBass(c.root));
  return list.flatMap((c, i) => {
    const low = lows[i];
    const fifth = nextAbove(low, (c.root + 7) % 12);
    const next = lows[(i + 1) % lows.length];
    return [low, '-', '.', '.', '.', '.', fifth, '.', '.', '.', low, '.', '.', '.', leanInto(low, next, c.third), '.'];
  });
}
// The chop: plucked violins on the off-beat 8ths, like a ukulele.
const CHOP = ['.', '.', 'third', '.', '.', '.', 7, '.', '.', '.', 'third', '.', '.', '.', 7, '.'];
const chop = (chords) => chordLine(chords, CHOP, 4);
// The harp in 8ths (strumming), in 16ths for the payoff, and hushed.
const STRUM = [0, '.', 7, '.', 12, '.', 7, '.', 'tenth', '.', 7, '.', 12, '.', 7, '.'];
const ROLL = [0, 7, 12, 'tenth', 12, 7, 12, 7, 0, 7, 12, 'tenth', 12, 7, 12, 7];
const SLOW_HARP = [0, '-', '-', '-', 7, '-', '-', '-', 12, '-', '-', '-', 7, '-', '-', '-'];
const strum = (chords) => arpeggio(chords, BAR, 3, STRUM);
const roll = (chords) => arpeggio(chords, BAR, 3, ROLL);
// The kit: a hand drum with the bass, a shaker on the off-beats, claps on
// two and four.
const TICK = hits('x.....x...x.....');
const SHAKE = hits('..x...x...x...x.');
const CLAP = hits('....x.......x...');

export const GULLREST_THEME = {
  title: 'Bunting',
  bpm: 108,
  stepsPerBeat: 4,
  volume: 0.7,

  instruments: {
    flute: { sample: 'flute', volume: 0.32, attack: 0.03, release: 0.3, reverb: 0.3, pan: 0.1, humanize: { time: 0.01, volume: 0.12 } },
    piccolo: { sample: 'piccolo', volume: 0.1, attack: 0.03, release: 0.3, reverb: 0.4, pan: 0.3, humanize: { time: 0.01, volume: 0.12 } },
    gull: { sample: 'piccolo', volume: 0.1, attack: 0.02, release: 0.5, reverb: 0.5, pan: -0.35 },
    clarinet: { sample: 'clarinet', volume: 0.22, attack: 0.04, release: 0.3, reverb: 0.35, pan: -0.25, humanize: { time: 0.012, volume: 0.12 } },
    oboe: { sample: 'oboe', volume: 0.24, attack: 0.04, release: 0.3, reverb: 0.35, pan: 0.2, humanize: { time: 0.012, volume: 0.12 } },
    harp: { sample: 'harp', volume: 0.2, ring: true, reverb: 0.4, pan: -0.3, humanize: { time: 0.012, volume: 0.2 } },
    harpSoft: { sample: 'harp', volume: 0.16, ring: true, reverb: 0.5, pan: -0.25, humanize: { time: 0.014, volume: 0.2 } },
    violins: { sample: 'violins', volume: 0.08, attack: 0.3, release: 0.6, reverb: 0.4, pan: 0.3 },
    pad: { sample: 'violas', volume: 0.09, attack: 0.5, release: 0.9, reverb: 0.4, pan: -0.15 },
    bass: { sample: 'cellosPizz', volume: 0.34, release: 0.12, reverb: 0.18, pan: -0.1, humanize: { time: 0.005, volume: 0.1 } },
    chop: { sample: 'violinsPizz', volume: 0.17, release: 0.08, reverb: 0.22, pan: 0.3, humanize: { time: 0.006, volume: 0.15 } },
    bells: { sample: 'glock', volume: 0.1, ring: true, pan: 0.35, reverb: 0.55, echo: { time: 0.42, feedback: 0.25, mix: 0.22 } },
    hidden: { sample: 'clarinet', volume: 0.18, attack: 0.1, release: 0.6, reverb: 0.55, pan: -0.4 },
    tick: { sample: 'frameDrum', drum: 'sample', volume: 0.11, ring: true, reverb: 0.22, humanize: { time: 0.004, volume: 0.25 } },
    shaker: { drum: 'hat', volume: 0.028 },
    clap: { sample: 'claps', drum: 'sample', volume: 0.06, ring: true, reverb: 0.3, humanize: { time: 0.004, volume: 0.3 } },
  },

  sections: {
    // The bounce starts; the flute runs up into the hook.
    intro: fit('intro', {
      harp: strum(INTRO_CHORDS),
      bass: groove(INTRO_CHORDS),
      tick: repeat(TICK, 2),
      flute: [...rest(1), ...Array(12).fill('.'), midi('G4'), midi('A4'), midi('B4'), midi('C5')],
    }, 2),

    // THE HOOK, the flute over the band.
    A: fit('A', {
      flute: HOOK,
      harp: strum(A_CHORDS),
      bass: groove(A_CHORDS),
      chop: chop(A_CHORDS),
      tick: repeat(TICK, 8),
      gull: gulls(8, [7]),
    }, 8),

    // The hook again; the clarinet's countermelody; shaker and claps.
    A2: fit('A2', {
      flute: HOOK,
      clarinet: COUNTER,
      harp: strum(A_CHORDS),
      pad: sustained(A_CHORDS, BAR, 2, 4),
      bass: groove(A_CHORDS),
      chop: chop(A_CHORDS),
      tick: repeat(TICK, 8),
      shaker: repeat(SHAKE, 8),
      clap: repeat(CLAP, 8),
    }, 8),

    // The climbing tune, the flute a third over its second half; the bass
    // walks down.
    B: fit('B', {
      oboe: TUNE_B,
      flute: TUNE_B_ABOVE,
      violins: sustained(B_CHORDS, BAR, 2, 4),
      harp: strum(B_CHORDS),
      bass: groove(B_CHORDS, B_BASS),
      chop: chop(B_CHORDS),
      tick: repeat(TICK, 8),
      shaker: repeat(SHAKE, 8),
    }, 8),

    // The tide pools: the hook in E minor, the major one over it; no drums.
    C: fit('C', {
      oboe: TUNE_C,
      flute: TUNE_C_ABOVE,
      harpSoft: roll(C_CHORDS),
      pad: sustained(C_CHORDS, BAR, 0, 3),
      bass: chordLine(C_CHORDS, [0, '-', '.', '.', '.', '.', '.', '.', 7, '.', '.', '.', '.', '.', '.', '.'], 2).map((n) => (typeof n === 'number' && n < 40 ? n + 12 : n)),
      gull: gulls(8, [3]),
    }, 8),

    // Hushed: the hook slowed, bells after it, a gull; someone humming out
    // of sight.
    bridge: fit('bridge', {
      flute: BRIDGE,
      bells: after(4, up(BRIDGE, 12)),
      harpSoft: arpeggio(BRIDGE_CHORDS, BAR, 3, SLOW_HARP),
      pad: sustained(BRIDGE_CHORDS, BAR, 0, 3),
      hidden: [...rest(1), ...haddockPhrase('G4'), ...rest(6)],
      gull: gulls(8, [5]),
    }, 8),

    // THE PAYOFF: the hook with everybody; a last gull.
    A3: fit('A3', {
      flute: HOOK,
      piccolo: up(HOOK, 12),
      oboe: COUNTER,
      bells: until(2, up(HOOK, 12)),
      clarinet: sustained(A_CHORDS, BAR, 1, 4),
      violins: sustained(A_CHORDS, BAR, 2, 4),
      harp: roll(A_CHORDS),
      bass: groove(A_CHORDS),
      chop: chop(A_CHORDS),
      tick: repeat(TICK, 8),
      shaker: repeat(SHAKE, 8),
      clap: repeat(CLAP, 8),
      gull: gulls(8, [7]),
    }, 8),
  },

  order: ['intro', 'A', 'A2', 'B', 'C', 'bridge', 'A3'],
  loopFrom: 1,
};
