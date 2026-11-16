import {
  melody, repeat, sustained, chordLine, transpose, rest as restBars, hits,
  tight, midi,
} from './parts/chapter5.js';

// "Bells Under Water": the theme of Merrow, the town the green storm drowned.
// Rooftops and chimneys stick up out of green water; the square is under it;
// the streets go down into it like slipways. It should still sound like a
// town: cosy, a bit daft, the kind of place with a band on Sundays. But the
// bells in its towers ring by themselves, nobody in them, and one house has
// its door open and the table laid. The song is that: a little music-box town
// tune heard through water, and something not right underneath it.
//
// THE BELLS OF MERROW (the first hook, and a clue): a far tower rings a peal
// of four, G C C D, the coast cell (parts/chapter5.js, A D D E in D minor)
// moved into C minor. It is always the same four notes, in that order, evenly
// spaced (a quarter apart), at the same pitch, on the same muffled, far-off
// chimes, and nothing else in the song plays on the chimes, so the peal is
// never mixed up with anything. It rings about every 23 to 31 seconds, always
// in a gap the tune leaves for it, and always starting just off the beat (on
// the "and"), so the tower never quite agrees with the band. In the drowned
// square there are three small bells on those same notes (G4, C5, D5): ring
// them the way the tower does and something opens. The music is the only
// hint.
//
// THE TUNE (the second hook, on a clarinet, with a far music box doubling it
// an octave up): the town answering its bells. It starts on the same four
// notes, G C C D, but in its own skipping rhythm, then climbs to Eb and falls
// back: "G, C-C, D, Eb / D, C...". Then the same shape on A-flat (Eb Ab Ab Bb
// C), then on F (C F F G Ab), each a step of the sequence, then a sigh down
// to B natural that leaves it hanging on G. So the bells ring, and the tune
// says it back. Hum the first bar and you have the clue.
//
// THE BAND: a harp rocks a fixed music-box figure over everything (C G D G
// Eb G D G: a G that never moves, with C D Eb D climbing on top, after City
// of Tears' rain); a low harp walks the bass down C Bb Ab G, the lament
// under the cosy tune. Soft violas and far violins hold the chords; in B
// some plucked violins waddle on beats 2 and 4 (the comic bit), and the
// clarinet hiccups little two-note answers to the flute. The real sea
// (seaWaves, very soft) laps at the eaves every two bars. No cellos, no big
// drums: a frame drum, barely there, in B and the payoff.
//
// THE WRONG THING: one borrowed chord, D-flat (the flat second of C minor,
// the Neapolitan), in the middle section. Over it the harp's figure bends
// into D-flat with it (C Ab Db Ab Eb Ab Db Ab) and a low flute plays the
// bells' cell bent into D-flat (Ab Db Db Eb), as if the town were trying to
// remember its own bells and getting them wrong. Then the real peal rings,
// alone, with almost nothing under it.
//
// THE OPEN DOOR (the tail): the band stops; the music box plays the tune's
// first bar on its own, like one left wound on a laid table, then tries again
// and stalls on D. The tower rings, and the clarinet answers it from the top.
//
// C minor, 4/4 at 70 (a bar is about 3.4 seconds); one step an 8th, 8 to a
// bar. The intro plays once (2 bars); then it loops from A, 40 bars, about
// 2m17s:
//
//   intro   2 bars  the peal alone over a held C, then the harp's figure
//   A       8 bars  THE TUNE on clarinet and far music box: Cm Cm Ab Eb Fm Eb
//                   G G, the bass walking C Bb Ab G; the peal rings in bar 8
//   B       8 bars  the flute's tune in E-flat (Ab Bb Eb Cm Ab Fm G G): the
//                   cosy, comic bit, with plucked violins and the clarinet's
//                   hiccups; the frame drum; the peal in bar 8
//   C       8 bars  under the water: the drums and the tune stop; bowed vibes
//                   play the cell slowed right down (the town answering); in
//                   bars 4 and 5 the D-flat chord, the bent figure, the bent
//                   cell on a low flute, a glass note; the peal alone in bar 7
//   A2      8 bars  THE PAYOFF: the tune on clarinet and muted violins, the
//                   music box, a flute descant, the choir humming, the frame
//                   drum; it lands on C at last; the peal over the last bar
//   tail    8 bars  the open door: no band, the music box alone plays the
//                   tune's first bar and stalls; vibes; the harp figure comes
//                   back for the turn on G; the peal in bar 8, and the clarinet
//                   answers it as the loop comes round to A
//
// The peal, in seconds from the start of the loop (A): 24.4, 52.7, 75.9,
// 107.1 and 134.1, then 24.4 again on the next time round (161.6); the
// intro's own peal starts at 0.4 s into the song. Reference for the mood only:
// Animal Crossing's town at night, Wind Waker's Windfall heard from the sea,
// Hollow Knight's City of Tears, a church bell from across a flooded field.

const BAR = 8;
const tune = (text) => melody(text, 1);   // each token an 8th: 8 to a bar
const rest = (bars) => restBars(bars, BAR);
const fit = (name, section, bars) => tight('Bells Under Water', name, section, bars, BAR);
const beat = (pattern, bars) => repeat(hits(pattern), bars);
// One bar of each, in order (to splice bars of different patterns).
const bars = (...parts) => parts.flat();

// --- Harmony, a bar each ---
const INTRO_CHORDS = 'Cm G';
const A_CHORDS = 'Cm Cm Ab Eb Fm Eb G G';
const B_CHORDS = 'Ab Bb Eb Cm Ab Fm G G';
const C_CHORDS = 'Cm Cm Cm Db Db Fm Cm G';
const A2_CHORDS = 'Cm Cm Ab Eb Fm Eb G Cm';
const TAIL_CHORDS = 'Cm Cm Ab Eb Fm Fm G G';

// --- Where everything starts, in bars from the top of the song ---
const START = { intro: 0, A: 2, B: 10, C: 18, A2: 26, tail: 34 };
const TOTAL_BARS = 42;

// --- THE BELLS OF MERROW: G C C D, a quarter apart, never anything else. ---
// One track for the whole song; each section takes its slice (two peals run
// over a section's end into the next). Each start is in 8ths from the top of
// the song, and every one is just off a beat.
const PEAL = ['G4', 'C5', 'C5', 'D5'];
const PEAL_STARTS = [
  1,                     // intro, bar 1
  START.A * BAR + 7 * BAR + 1,     // A, bar 8 (the tune's gap)
  START.B * BAR + 7 * BAR + 3,     // B, bar 8, running into C's first beat
  START.C * BAR + 6 * BAR + 1,     // C, bar 7, alone
  START.A2 * BAR + 7 * BAR + 2,    // A2, bar 8, its D on the tail's downbeat
  START.tail * BAR + 7 * BAR + 1,  // tail, bar 8, before the tune answers
];
const PEALS = (() => {
  const out = Array(TOTAL_BARS * BAR).fill('.');
  for (const s of PEAL_STARTS) PEAL.forEach((note, i) => { out[s + 2 * i] = midi(note); });
  return out;
})();
const bell = (name, length) => PEALS.slice(START[name] * BAR, (START[name] + length) * BAR);

// --- The real sea, lapping at the eaves: a different wave each time. ---
let waveNo = 0;
const waves = (length, every = [0]) => Array.from({ length: length * BAR }, (_, step) => {
  if (step % BAR || !every.includes(Math.floor(step / BAR))) return '.';
  return 60 + (waveNo++ % 8);
});
const everyOther = (length) => Array.from({ length: length / 2 }, (_, i) => i * 2);

// --- The tunes (sing them: the first bar is the bells, said back) ---
// The clarinet: G C-C D Eb, falls back; the cell on A-flat; a sigh; the cell
// on F, climbing to A-flat; down through E-flat; the sigh to B natural, and
// it hangs on G (the bells ring in the gap).
const TUNE_A = tune(`
  G4 - C5 C5 D5 - Eb5 -    D5 - C5 - - - G4 -
  Eb4 - Ab4 Ab4 Bb4 - C5 - Bb4 - Ab4 - G4 - - -
  C5 - F5 F5 G5 - Ab5 -    G5 - F5 - Eb5 - C5 -
  D5 - - Eb5 D5 - B4 -     G4 . . . . . . .
`);
// The same, landing on C (for A2), short, so the peal is clear after it.
const TUNE_A_HOME = [...TUNE_A.slice(0, 7 * BAR), ...tune('C5 - . . . . . .')];
// The flute's tune in B, in E-flat: an arpeggio up, a little fall, twice;
// then down from A-flat to the B natural, and quiet for the bells.
const TUNE_B = tune(`
  Eb5 - - C5 Eb5 - Ab5 -   G5 - F5 - D5 - . .
  Eb5 - - Bb4 Eb5 - G5 -   G5 - - F5 Eb5 - . .
  F5 - - Eb5 C5 - Eb5 -    Ab5 - G5 - F5 - C5 -
  D5 - Eb5 - F5 - D5 -     B4 - - . . . . .
`);
// The clarinet's hiccups: two notes, down, in the flute's gaps.
const HICCUPS = tune(`
  . . . . . . . .          . . . . . . F4 D4
  . . . . . . . .          . . . . . . G4 Eb4
  . . . . . . . .          . . . . . . . .
  . . . . . . . .          . . . . . . . .
`);
// A flute descant over the payoff, long notes above the tune. (Bar 2 holds
// the G over the tune's D, then steps down, so it never rubs a half step
// against it.)
const DESCANT = tune(`
  G5 - - - - - - -         G5 - - - Eb5 - F5 -
  Ab5 - - - - - Eb5 -      G5 - - - Bb5 - - -
  Ab5 - - - - - C6 -       Bb5 - - - G5 - - -
  B5 - - - - - - -         C6 - . . . . . .
`);
// Under the water: the cell slowed to half a bar a note on bowed vibes (the
// town answering the bells, very slowly), then a sigh down over F minor, and
// the B natural leaning home. Bars 4 and 5 and 7 are left to the others.
const UNDER = tune(`
  . . . . . . . .          G4 - - - C5 - - -
  C5 - - - D5 - - -        . . . . . . . .
  . . . . . . . .          Ab4 - - - G4 - - -
  . . . . . . . .          B4 - - - D5 - - -
`);
// The bells' cell bent into D-flat (Ab Db Db Eb), on a low flute.
const BENT = tune(`
  . . . . . . . .          . . . . . . . .
  . . . . . . . .          Ab4 - - - Db5 - - -
  Db5 - - - Eb5 - - -      . . . . . . . .
  . . . . . . . .          . . . . . . . .
`);
// The open door: the music box plays the tune's first bar alone, then tries
// again and stalls on D.
const BOX_TAIL = tune(`
  . . . . . . . .          G5 - C6 C6 D6 - Eb6 -
  D6 - C6 - - - . .        . . . . . . . .
  G5 - C6 C6 D6 - - -      - - . . . . . .
  . . . . . . . .          . . . . . . . .
`);
const VIBES_TAIL = tune(`
  . . . . . . . .          . . . . . . . .
  . . . . . . . .          . . . . . . . .
  . . . . . . . .          Ab4 - - - - - - -
  B4 - - - - - . .         . . . . . . . .
`);

// --- The band ---
// The music-box figure on the harp: a G that never moves, C D Eb D on top.
const FIGURE = tune('C6 G5 D6 G5 Eb6 G5 D6 G5');
// Bent into D-flat over the wrong chord.
const FIGURE_BENT = tune('C6 Ab5 Db6 Ab5 Eb6 Ab5 Db6 Ab5');
// Thinned to two notes a bar (in the bells' bars, and under the water).
const THIN = tune('C6 . . . Eb6 . . .');
const figure = (n) => repeat(FIGURE, n);
const thin = (n) => repeat(THIN, n);
const none = (n) => rest(n);

// The bass on a low harp: a half note each, walking the lament down C Bb Ab
// G under the cosy tune. (Nothing under F2: the harp's lowest strings boing.)
const A_BASS = tune(`
  C3 - - - G2 - - -        C3 - - - Bb2 - - -
  Ab2 - - - Eb3 - - -      G2 - - - Bb2 - - -
  F2 - - - C3 - - -        Eb3 - - - Bb2 - - -
  G2 - - - D3 - - -        G2 - - - B2 - - -
`);
const B_BASS = tune(`
  Ab2 - - - Eb3 - - -      Bb2 - - - F2 - - -
  Eb3 - - - Bb2 - - -      C3 - - - G2 - - -
  Ab2 - - - Eb3 - - -      F2 - - - Ab2 - - -
  G2 - - - D3 - - -        G2 - - - B2 - - -
`);
const C_BASS = tune(`
  C3 - - - - - - -         C3 - - - - - - -
  C3 - - - G2 - - -        Db3 - - - - - - -
  Db3 - - - Ab2 - - -      F2 - - - - - - -
  C3 - - - - - - -         G2 - - - - - - -
`);
const A2_BASS = [...A_BASS.slice(0, 7 * BAR), ...tune('C3 - - - - - - -')];
const TAIL_BASS = tune(`
  C3 - - - - - - -         C3 - - - - - - -
  Ab2 - - - - - - -        G2 - - - - - - -
  F2 - - - - - - -         F2 - - - - - - -
  G2 - - - - - - -         G2 - - - D3 - - -
`);
const INTRO_BASS = tune('C3 - - - - - - -   G2 - - - - - - -');

// Plucked violins waddling on beats 2 and 4 (the fifth, then the octave).
const waddle = (chords) => chordLine(chords, ['.', '.', 7, '.', '.', '.', 12, '.'], 4);
// The frame drum, barely there.
const STEP = 'x.....x.';
const STEP_FULL = 'x...x.x.';
const LAST = 'x.......';

export const MERROW_THEME = {
  title: 'Bells Under Water',
  bpm: 70,
  stepsPerBeat: 2,
  volume: 1.45,

  instruments: {
    clarinet: { sample: 'clarinet', volume: 0.16, attack: 0.06, release: 0.5, reverb: 0.6, pan: -0.15, humanize: { time: 0.012, volume: 0.12 } },
    // The far music box: a glock, muffled, an octave up on the tune.
    box: { sample: 'glock', volume: 0.06, ring: true, muffle: 3400, reverb: 0.8, pan: 0.35, humanize: { time: 0.015, volume: 0.15 } },
    flute: { sample: 'flute', volume: 0.17, attack: 0.08, release: 0.6, reverb: 0.65, pan: 0.2, humanize: { time: 0.012, volume: 0.1 } },
    descant: { sample: 'flute', volume: 0.11, attack: 0.3, release: 0.9, reverb: 0.75, pan: 0.3 },
    // The tune on muted violins in the payoff, far back.
    violinsTune: { sample: 'violins', volume: 0.09, attack: 0.15, release: 0.8, reverb: 0.7, pan: 0.25, muffle: 3400, humanize: { time: 0.012, volume: 0.08 } },
    under: { sample: 'vibesBowed', volume: 0.15, attack: 0.4, release: 1.4, reverb: 0.85, pan: 0.15, echo: { time: 0.86, feedback: 0.3, mix: 0.25 } },
    // The harp's music-box figure, a little muffled, as if through water.
    figure: { sample: 'harp', volume: 0.1, ring: true, muffle: 4500, reverb: 0.65, pan: 0.3, humanize: { time: 0.012, volume: 0.2 }, echo: { time: 0.43, feedback: 0.15, mix: 0.12 } },
    harpBass: { sample: 'harp', volume: 0.18, ring: true, reverb: 0.5, pan: -0.25, humanize: { time: 0.01, volume: 0.12 } },
    violas: { sample: 'violas', volume: 0.1, attack: 1.4, release: 1.8, reverb: 0.65, pan: -0.1, muffle: 1500 },
    violins: { sample: 'violins', volume: 0.06, attack: 1.8, release: 2.0, reverb: 0.75, pan: 0.35, muffle: 2400 },
    pizz: { sample: 'violinsPizz', volume: 0.08, ring: true, reverb: 0.55, pan: 0.15, muffle: 3200, humanize: { time: 0.012, volume: 0.2 } },
    choir: { sample: 'choir', volume: 0.07, attack: 1.8, release: 2.2, reverb: 0.8, muffle: 2600 },
    glass: { sample: 'glass', volume: 0.06, attack: 1.4, release: 2.4, reverb: 0.85, pan: -0.3 },
    knock: { sample: 'frameDrum', drum: 'sample', volume: 0.09, ring: true, reverb: 0.45, pan: 0.05, humanize: { time: 0.008, volume: 0.25 } },
    // The real sea (seaWaves, cut from a CC0 beach recording), very soft.
    waves: { sample: 'seaWaves', volume: 0.1, ring: true, reverb: 0.2, pan: 0 },
    // THE BELLS OF MERROW: an empty tower a street or two away. Muffled and
    // in a big reverb, but no echo, so the four notes never blur.
    bell: { sample: 'chimes', volume: 0.15, ring: true, muffle: 2800, reverb: 0.85, pan: -0.35 },
  },

  sections: {
    // The peal alone over a held C, then the figure starts on G.
    intro: fit('intro', {
      bell: bell('intro', 2),
      violas: sustained(INTRO_CHORDS, BAR, 1, 3),
      harpBass: INTRO_BASS,
      figure: bars(none(1), figure(1)),
      waves: waves(2),
    }, 2),

    // THE TUNE: clarinet and the far music box; the peal in bar 8.
    A: fit('A', {
      clarinet: TUNE_A,
      box: transpose(TUNE_A, 12),
      figure: bars(figure(7), thin(1)),
      harpBass: A_BASS,
      violas: sustained(A_CHORDS, BAR, 1, 3),
      waves: waves(8, everyOther(8)),
      bell: bell('A', 8),
    }, 8),

    // The flute's tune in E-flat, the waddle, the hiccups; the peal in bar 8.
    B: fit('B', {
      flute: TUNE_B,
      clarinet: HICCUPS,
      figure: bars(figure(7), thin(1)),
      harpBass: B_BASS,
      violas: sustained(B_CHORDS, BAR, 1, 3),
      violins: sustained(B_CHORDS, BAR, 2, 4),
      pizz: [...waddle(B_CHORDS).slice(0, 7 * BAR), ...rest(1)],
      knock: bars(beat(STEP, 7), rest(1)),
      waves: waves(8, everyOther(8)),
      bell: bell('B', 8),
    }, 8),

    // Under the water: the cell slowed; the wrong chord; the peal alone.
    C: fit('C', {
      under: UNDER,
      flute: BENT,
      figure: bars(thin(3), repeat(FIGURE_BENT, 2), thin(1), none(1), thin(1)),
      harpBass: C_BASS,
      violas: sustained(C_CHORDS, BAR, 1, 3),
      choir: sustained(C_CHORDS, BAR, 0, 4),
      glass: bars(rest(3), tune('F5 - - - - - - -   - - - - - - - -   - - - - - . . .'), rest(2)),
      waves: waves(8, [0, 4]),
      bell: bell('C', 8),
    }, 8),

    // THE PAYOFF: everyone, softly; home on C; the peal over the last bar.
    A2: fit('A2', {
      clarinet: TUNE_A_HOME,
      violinsTune: TUNE_A_HOME,
      box: transpose(TUNE_A_HOME, 12),
      descant: DESCANT,
      figure: bars(figure(7), thin(1)),
      harpBass: A2_BASS,
      violas: sustained(A2_CHORDS, BAR, 1, 3),
      violins: sustained(A2_CHORDS, BAR, 2, 4),
      pizz: [...waddle(A2_CHORDS).slice(0, 7 * BAR), ...rest(1)],
      choir: sustained(A2_CHORDS, BAR, 0, 4),
      knock: bars(beat(STEP_FULL, 7), hits(LAST)),
      waves: waves(8, everyOther(8)),
      bell: bell('A2', 8),
    }, 8),

    // The open door: the music box alone, stalling; the figure back for the
    // turn; the peal, and the loop's clarinet answers it.
    tail: fit('tail', {
      box: BOX_TAIL,
      under: VIBES_TAIL,
      figure: bars(thin(1), none(5), figure(1), thin(1)),
      harpBass: TAIL_BASS,
      violas: sustained(TAIL_CHORDS, BAR, 1, 3),
      violins: bars(rest(4), sustained('Fm Fm G G', BAR, 2, 4)),
      waves: waves(8, everyOther(8)),
      bell: bell('tail', 8),
    }, 8),
  },

  order: ['intro', 'A', 'B', 'C', 'A2', 'tail'],
  loopFrom: 1,
};
