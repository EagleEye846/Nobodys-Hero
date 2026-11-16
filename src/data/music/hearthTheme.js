import {
  melody, repeat, hits, midi, sustained, chordLine, transpose, rest as restBars,
  tight, scatter, emberNotes,
} from './parts/chapter6.js';

// "Sweep the Step": the song for Hearth, the old town at the end of the Ash
// Road, buried to its eaves. A hundred years of ash have come down on it
// and every morning, for a hundred years, the few folk who wouldn't leave
// have swept it off their doorsteps again. Pots of green on every sill,
// kids sledding down the drifts on tea trays, an inn with a board of old
// pictures. Nobody here is brave about it; they just aren't going. So the
// song is warm and a bit stubborn: a small band on a street corner, a tune
// you could hum while you sweep, and it comes home every time, which no
// other song in this chapter does.
//
// THE BAND: a fiddle (the solo violin) for the tune; a concertina (a
// clarinet and an oboe swelling together on the off-beats, the way the
// bellows push); a harp picking 8ths like a guitar; a plucked upright bass
// on the beats, leaning into each new chord; a frame drum, soft; and a
// broom: the shaker on the last 8th of each beat, swish, swish, all the
// way through. A clarinet and a tin whistle (the recorder) join later.
// No cellos, no brass, nothing loud.
//
// THE HOOK (the first two bars are the whole song): THE EMBER CELL
// (parts/chapter6.js) in A major and re-barred into a jig-ish 6/8: A B C#
// E, up like the ember in the ash song, then F falling to E. The F is the
// cell's half step kept as it is, so in a major key it has to come from
// somewhere borrowed: it sits on a D minor chord, a little ache inside the
// warm key, and it always lands on E, the fifth. Then the cell again from
// higher (C# D E A, F E, this time over F major), and a long answer that
// comes straight in on F sharp, as if the town had heard the sigh and said
// no. It walks down and comes home on A.
//
// THE STREET (B): D major, a running tune on the fiddle that goes up and
// down like a broom on a step; one bar on G (the borrowed flat seventh)
// for warmth. The second time the clarinet takes it, low, with the whistle
// doubling its second half and the fiddle holding long notes over it.
//
// THE ASH AT THE DOOR (C): F sharp minor, the ash song's own key. The band
// drops out, a gust goes by, an ember drifts up past the window, and a low
// clarinet plays the cell the way the ash plays it (F# G# A C#, D C#). The
// fiddle answers it in major with the hook's first two bars, and the
// concertina comes back in under the answer. Twice. The broom never stops.
// It ends on D minor and goes home to A, the soft church "amen".
//
// THE PAYOFF (A3): the hook on the fiddle with the clarinet an octave under
// it, the whistle playing the countermelody over the top, the whole band;
// the first chord under it is F sharp minor, the ash's chord, and the tune
// goes on over it in A major anyway.
//
// A major, with D minor, F and G borrowed from A minor. 6/8 at 64 (dotted
// quarters); one step a 16th, 12 to a bar (a bar is about 1.9 seconds).
// The intro plays once (4 bars); then it loops from A, 50 bars, about
// 1m34s:
//
//   intro   4 bars  the broom alone, then the harp, the bass, a breath of
//                   the concertina
//   A       8 bars  THE HOOK on the fiddle; the concertina pumps, the harp
//                   picks, the bass walks, the drum on the one
//   A2      8 bars  the clarinet takes the hook, the fiddle plays a
//                   countermelody over it
//   B       8 bars  THE STREET: D major, the fiddle running, the clarinet
//                   holding under it
//   B2      8 bars  the street again, the clarinet low, the whistle with it
//                   for the second half, the fiddle holding over
//   C       8 bars  THE ASH AT THE DOOR: F# minor, the cell low on the
//                   clarinet, the fiddle answering in major; a gust, embers
//   A3      8 bars  THE PAYOFF: fiddle and clarinet in octaves, the whistle
//                   over, everybody; starts on F# minor, lands on A
//   tail    2 bars  the broom, the harp and the bass, round to A

const BAR = 12;
const tune = (text) => melody(text, 2);   // each token an 8th: 6 to a bar
const rest = (bars) => restBars(bars, BAR);
const fit = (name, section, bars) => tight('Sweep the Step', name, section, bars, BAR);
const up = (steps, semitones) => transpose(steps, semitones);

// --- Harmony, a bar each ---
export const HEARTH_A_CHORDS = 'A Dm A F D F#m E A';
// The payoff: the same tune over the ash's chord first.
export const HEARTH_A3_CHORDS = 'F#m Dm A F Bm D E A';
export const HEARTH_B_CHORDS = 'D A Bm F#m G D E E';
export const HEARTH_C_CHORDS = 'F#m D A Dm F#m D A Dm';
const INTRO_CHORDS = 'A A Dm E';
const TAIL_CHORDS = 'A E';

// --- THE HOOK: the ember cell in A major (A B C# E, F to E), sung twice,
// answered by a longer line that comes in on F sharp and walks home. ---
export const HEARTH_HOOK = tune(`
  A4 - B4 C#5 - E5 | F5 - - E5 - . |
  C#5 - D5 E5 - A5 | F5 - - E5 - . |
  F#5 - E5 D5 - A4 | C#5 - B4 A4 - E4 |
  B4 - C#5 D5 - B4 | A4 - - - - . |
`);
// The countermelody: it holds while the hook moves and moves while the
// hook holds (the F to E bars).
export const HEARTH_COUNTER = tune(`
  E5 - - - - - | D5 - F5 A5 - - |
  E5 - - - - - | C5 - F5 A5 - G5 |
  F#5 - - - - - | A5 - - F#5 - - |
  G#5 - - - - - | A5 - - - - . |
`);
// The same, over the payoff's F# minor first bar.
export const HEARTH_COUNTER_A3 = [...tune('C#5 - - - - -'), ...HEARTH_COUNTER.slice(BAR)];

// --- THE STREET (B): up and down the step, like a broom. ---
export const HEARTH_STREET = tune(`
  A4 D5 F#5 A5 F#5 D5 | E5 C#5 A4 C#5 E5 - |
  F#5 D5 B4 D5 F#5 B5 | A5 - F#5 C#5 - - |
  B5 A5 G5 D5 G5 B5 | A5 F#5 D5 F#5 A5 - |
  G#5 - B5 E5 - G#5 | B5 - A5 G#5 - E5 |
`);
// Long notes held over it the second time.
export const HEARTH_STREET_HOLD = tune(`
  F#5 - - - - - | E5 - - - - - | D5 - - - - - | C#5 - - - - - |
  D5 - - - - - | F#5 - - - - - | E5 - - - - - | E5 - - - - . |
`);

// --- THE ASH AT THE DOOR (C): the cell in minor, as the ash plays it, low;
// the hook's first two bars answering it in major. ---
const ASH_CELL = (() => {
  const [a, b, c, d, e, f] = emberNotes('F#3');   // F#3 G#3 A3 C#4, D4 C#4
  return [a, '-', '-', '-', b, '-', c, '-', '-', '-', d, '-', e, '-', '-', '-', '-', '-', f, '-', '-', '-', '.', '.'];
})();
export const HEARTH_ASH = [...ASH_CELL, ...rest(2), ...ASH_CELL, ...rest(2)];
export const HEARTH_ANSWER = [...rest(2), ...HEARTH_HOOK.slice(0, 2 * BAR), ...rest(2), ...HEARTH_HOOK.slice(0, 2 * BAR)];

// --- The band ---
const chordsOf = (chords) => chords.split(/\s+/).filter(Boolean).map((symbol) => {
  const [, name, minor] = symbol.match(/^([A-G][#b]?)(m?)$/);
  return { root: midi(`${name}2`), third: minor ? 3 : 4 };
});
// The upright bass: the root on the one, the fifth on the four, and on the
// last 8th a note leaning into the next bar's root (a step under it when
// the bass climbs, a step over when it falls). Kept between A1 and G#2.
const fitBass = (n) => { let low = n; while (low < 33) low += 12; while (low > 44) low -= 12; return low; };
const leanInto = (from, to) => {
  if (to === from) return from + 7;
  if (to > from) return to - (to - from > 2 ? 2 : 1);
  return to + 2;
};
function walk(chords) {
  const lows = chordsOf(chords).map((c) => fitBass(c.root));
  return lows.flatMap((low, i) => [low, '-', '-', '-', '-', '.', low + 7, '-', '-', '.', leanInto(low, lows[(i + 1) % lows.length]), '.']);
}
// Just the root, held most of the bar (the ash bars).
const plainBass = (chords) => chordsOf(chords).flatMap((c) => [fitBass(c.root), ...Array(9).fill('-'), '.', '.']);
// The harp, picking like a guitar: root, fifth, tenth, octave, tenth, fifth.
const PICK = [0, '.', 7, '.', 'tenth', '.', 12, '.', 'tenth', '.', 7, '.'];
const pick = (chords) => chordLine(chords, PICK, 3);
// In the ash bars it only touches the beats.
const SPARE = [0, '.', '.', '.', '.', '.', 7, '.', '.', 'tenth', '.', '.'];
const spare = (chords) => chordLine(chords, SPARE, 3);
// The concertina: a chord tone swelling on the 2nd and 5th 8ths, held
// through the beat, like the bellows pushing.
const BELLOWS = (voice) => ['.', '.', voice, '-', '-', '.', '.', '.', voice, '-', '-', '.'];
const bellows = (chords, voice) => chordLine(chords, BELLOWS(voice), 4);
// The broom: swish on the last 8th of each beat.
const BROOM = hits('....x.....x.');
const broom = (bars) => repeat(BROOM, bars);
// The frame drum: the one, and a little pickup into the next bar.
const DRUM = hits('x.........x.');
const DRUM_FULL = hits('x.....x...x.');
// A gust of ash going past the window (the cymbal swell, muffled right down).
const gusts = (bars, at) => {
  const out = rest(bars);
  for (const b of at) out[b * BAR] = 60;
  return out;
};

export const HEARTH_THEME = {
  title: 'Sweep the Step',
  bpm: 64,
  stepsPerBeat: 6,
  // An area song: level with the others (about -26.5 on tools/loudnessCheck.html).
  volume: 0.87,

  instruments: {
    // The tune.
    fiddle: { sample: 'soloViolin', volume: 0.3, attack: 0.05, release: 0.45, reverb: 0.35, pan: 0.1, humanize: { time: 0.012, volume: 0.12 } },
    clarinet: { sample: 'clarinet', volume: 0.24, attack: 0.05, release: 0.4, reverb: 0.35, pan: -0.2, humanize: { time: 0.012, volume: 0.12 } },
    whistle: { sample: 'recorder', volume: 0.15, attack: 0.05, release: 0.4, reverb: 0.4, pan: 0.3, humanize: { time: 0.012, volume: 0.12 } },
    // The concertina: two reeds together.
    reed: { sample: 'clarinet', volume: 0.1, attack: 0.18, release: 0.3, reverb: 0.3, pan: -0.25, humanize: { time: 0.01, volume: 0.1 } },
    reedOboe: { sample: 'oboe', volume: 0.08, attack: 0.18, release: 0.3, reverb: 0.3, pan: -0.15, humanize: { time: 0.01, volume: 0.1 } },
    // The guitar (a harp, picked) and the upright bass.
    harp: { sample: 'harp', volume: 0.17, ring: true, reverb: 0.35, pan: 0.25, humanize: { time: 0.012, volume: 0.2 } },
    bass: { sample: 'bassPizz', volume: 0.32, release: 0.2, reverb: 0.2, pan: -0.1, humanize: { time: 0.006, volume: 0.12 } },
    // The hand drum and the broom.
    drum: { sample: 'frameDrum', drum: 'sample', volume: 0.09, ring: true, reverb: 0.3, muffle: 2000, humanize: { time: 0.006, volume: 0.25 } },
    broom: { sample: 'shaker', drum: 'sample', volume: 0.05, ring: true, reverb: 0.25, pan: 0.2, humanize: { time: 0.01, volume: 0.3 } },
    // Soft violas, only under the ash and the payoff.
    pad: { sample: 'violas', volume: 0.06, attack: 0.9, release: 1.4, reverb: 0.5, pan: -0.2, muffle: 1800 },
    // The ash outside: a gust, an ember drifting up.
    wind: { sample: 'cymbalSwell', volume: 0.06, release: 0.6, reverb: 0.6, pan: 0.3, muffle: 1200 },
    embers: { sample: 'glass', volume: 0.04, ring: true, reverb: 0.6, pan: -0.35, humanize: { time: 0.01, volume: 0.25 } },
  },

  sections: {
    // The broom first, then the harp, the bass, a breath of the concertina.
    intro: fit('intro', {
      broom: broom(4),
      harp: [...rest(1), ...pick(INTRO_CHORDS).slice(BAR)],
      bass: [...rest(2), ...walk(INTRO_CHORDS).slice(2 * BAR)],
      reed: [...rest(3), ...bellows('E', 'third')],
    }, 4),

    // THE HOOK on the fiddle.
    A: fit('A', {
      fiddle: HEARTH_HOOK,
      reed: bellows(HEARTH_A_CHORDS, 'third'),
      reedOboe: bellows(HEARTH_A_CHORDS, 7),
      harp: pick(HEARTH_A_CHORDS),
      bass: walk(HEARTH_A_CHORDS),
      drum: repeat(DRUM, 8),
      broom: broom(8),
    }, 8),

    // The clarinet takes it; the fiddle plays the countermelody over it.
    A2: fit('A2', {
      clarinet: HEARTH_HOOK,
      fiddle: HEARTH_COUNTER,
      reed: bellows(HEARTH_A_CHORDS, 7),
      harp: pick(HEARTH_A_CHORDS),
      bass: walk(HEARTH_A_CHORDS),
      drum: repeat(DRUM, 8),
      broom: broom(8),
    }, 8),

    // THE STREET: the fiddle running, the clarinet holding under it.
    B: fit('B', {
      fiddle: HEARTH_STREET,
      clarinet: sustained(HEARTH_B_CHORDS, BAR, 1, 4),
      reed: bellows(HEARTH_B_CHORDS, 7),
      harp: pick(HEARTH_B_CHORDS),
      bass: walk(HEARTH_B_CHORDS),
      drum: repeat(DRUM, 8),
      broom: broom(8),
    }, 8),

    // The street again: the clarinet low, the whistle with it for the
    // second half, the fiddle holding over.
    B2: fit('B2', {
      clarinet: up(HEARTH_STREET, -12),
      whistle: [...rest(4), ...HEARTH_STREET.slice(4 * BAR)],
      fiddle: HEARTH_STREET_HOLD,
      reed: bellows(HEARTH_B_CHORDS, 'third'),
      reedOboe: bellows(HEARTH_B_CHORDS, 7),
      harp: pick(HEARTH_B_CHORDS),
      bass: walk(HEARTH_B_CHORDS),
      drum: repeat(DRUM, 8),
      broom: broom(8),
    }, 8),

    // THE ASH AT THE DOOR: the cell low and minor, the fiddle answering in
    // major, the concertina back in under the answer. The broom keeps on.
    C: fit('C', {
      clarinet: HEARTH_ASH,
      fiddle: HEARTH_ANSWER,
      reed: [...rest(2), ...bellows('A Dm', 'third'), ...rest(2), ...bellows('A Dm', 'third')],
      harp: spare(HEARTH_C_CHORDS),
      bass: plainBass(HEARTH_C_CHORDS),
      pad: sustained(HEARTH_C_CHORDS, BAR, 1, 3),
      wind: gusts(8, [0, 4]),
      embers: scatter(8, BAR, [[1, 6, 'C#6'], [1, 7, 'F#6'], [1, 8, 'A6'], [5, 4, 'F#5'], [5, 5, 'A5'], [5, 6, 'C#6']]),
      broom: broom(8),
    }, 8),

    // THE PAYOFF: the hook in octaves, the whistle's countermelody over,
    // everybody; over the ash's chord first, and home on A.
    A3: fit('A3', {
      fiddle: HEARTH_HOOK,
      clarinet: up(HEARTH_HOOK, -12),
      whistle: HEARTH_COUNTER_A3,
      reed: bellows(HEARTH_A3_CHORDS, 'third'),
      reedOboe: bellows(HEARTH_A3_CHORDS, 7),
      harp: pick(HEARTH_A3_CHORDS),
      bass: walk(HEARTH_A3_CHORDS),
      pad: sustained(HEARTH_A3_CHORDS, BAR, 2, 3),
      drum: repeat(DRUM_FULL, 8),
      broom: broom(8),
    }, 8),

    // The broom, the harp and the bass, round to the hook.
    tail: fit('tail', {
      broom: broom(2),
      harp: pick(TAIL_CHORDS),
      bass: walk(TAIL_CHORDS),
      reed: [...rest(1), ...bellows('E', 'third')],
    }, 2),
  },

  order: ['intro', 'A', 'A2', 'B', 'B2', 'C', 'A3', 'tail'],
  loopFrom: 1,
};

