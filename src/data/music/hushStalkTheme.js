import { melody } from '../../audio/notation.js';
import { rest as restBars, held, until as untilBars, after as afterBars, onNotes, heldNotes, transpose, midi, patter, cells } from './parts/chapter3.js';

// "Something in the Trees": the Hush hunting. It plays in the Hushwood rooms
// where the beast's shadow sweeps over the wood and you hide in the leaf
// piles until it passes (the Windfall, the Quiet, Hollin Lane), and under
// the last scene at Hollin Well, where it corners you and you jump
// (notes/docs/chapter-3-hushwood.md). Tension, not a battle: no drums, no
// brass blaring, nothing to fight. Something big moving slowly, very near,
// and stopping to listen.
//
// It's built from the beast's own fight, "Tooth and Tatter"
// (pinefallBeastTheme.js), slowed to half speed. That fight runs at 160
// dotted quarters; this runs at 80, so its prowling ostinato (root, fifth,
// seventh, a flick to the octave) is here note for note at half speed, and
// at first with the flick left out: it's stalking, not running. Under the
// prowl, a heartbeat on the timpani, once a bar, then on both beats. Over
// it, violins in tremolo so high and soft they're more a ringing in your
// ears; later a second one a half step above, rubbing.
//
// The claws (G Bb C#, D: a minor third, a tritone, the pounce) surface in
// the low brass and cellos. Twice in the first part; the second time the
// pounce never comes. In the last part the claws grow into the harmony
// itself: the bass moves G, Bb, C#, D, four bars on each, so the whole
// section is the motif at sixteen times its length, closing in. Then
// everything stops for a bar to listen, and it goes round.
//
// In the middle the music stops dead for whole bars: the shadow passing over
// your leaf pile. Only a heartbeat. A twig. Then the Hushwood's own three
// steps (hushwoodTheme.js, here G D A on the harp), the wood still holding
// its breath, and the prowl creeping back.
//
// G minor, with the Neapolitan A flat creeping in. 6/8 at 80 dotted quarters
// a minute, one step a 16th: a bar is 12 steps and a second and a half. The
// growl plays once (6s); then it loops from the prowl, 56 bars, 1m24s:
//
//   growl      4 bars  a tuba and a trombone a minor ninth apart, the high
//                      tremolo fading in, the first heartbeats
//   prowl     16 bars  the prowl on plucked cellos, a heartbeat a bar, the
//                      claws in the trombones twice (the second time without
//                      the pounce); A flat creeping into G
//   circling  16 bars  the bass circles (G, A flat, G, F#) and the claws
//                      follow it; spiccato now, the heartbeat on both beats,
//                      a clarinet holding the tritone, the high rub
//   listening  8 bars  everything stops. A heartbeat. A twig. The wood's
//                      three steps on the harp, a glass; the prowl creeping
//                      back under a timpani roll
//   closer    16 bars  the claws as the bass (G, B flat, C#, D), the full
//                      prowl, the claws on each new root on more brass each
//                      time, tremolo violas swelling; the last bar silent

const SIX = 12;                                   // a bar of 6/8, in 16ths
const tune6 = (text) => melody(text, 2);          // each token an 8th: six to a bar
const rest = (bars) => restBars(bars, SIX);
const until = (bars, track) => untilBars(bars, track, SIX);
const after = (bars, track) => afterBars(bars, track, SIX);

// --- The prowl ("Tooth and Tatter"'s, at half speed). One bar: root, fifth,
// seventh, root, fifth; and with the octave flick back for the full prowl. ---
const STALK = [0, '.', 7, '.', 10, '.', 0, '.', 7, '.', '.', '.'];
const PROWL = [0, '.', 7, '.', 10, 12, 0, '.', 7, '.', 12, 10];
// Roots in octave 2 for the cellos; one name per bar.
const prowl = (roots, shape = STALK) => onNotes(roots, shape);
const bars = (name, n) => Array(n).fill(name).join(' ');

// --- The heartbeat: lub on the beat, dub three 16ths later and softer (its
// own track), once a bar or on both beats. ---
const LUB_ONE = [0, ...Array(SIX - 1).fill('.')];
const DUB_ONE = ['.', '.', '.', 0, ...Array(SIX - 4).fill('.')];
const LUB_TWO = [0, '.', '.', '.', '.', '.', 0, '.', '.', '.', '.', '.'];
const DUB_TWO = ['.', '.', '.', 0, '.', '.', '.', '.', '.', 0, '.', '.'];
const beat = (shape, n) => Array(n).fill(shape).flat().map((s) => (s === 0 ? midi('G2') : s));
// On the D of the last part the heart follows the bass down to D.
const beatOn = (note, shape, n) => Array(n).fill(shape).flat().map((s) => (s === 0 ? midi(note) : s));

// --- The claws. Two bars: G Bb C# as quarters across the 6/8 (three against
// two), then the pounce held. And the same with the pounce withheld. ---
const CLAWS = tune6('G2 - Bb2 - C#3 - | D3 - - - - -');
const CLAWS_HELD_BACK = tune6('G2 - Bb2 - C#3 - | . . . . . .');
// The claws starting on any root.
const clawsOn = (root) => transpose(CLAWS, midi(root) - midi('G2'));

// --- The listening: the Hushwood's three steps, carried into G (G D A), one
// set to a bar and then nothing. ---
const THREE_STEPS = [0, '.', 1, '.', 2, '.', '.', '.', '.', '.', '.', '.'];

// --- The harmony, one root a bar. ---
const PROWL_ROOTS = `${bars('G2', 8)} ${bars('Ab2', 4)} ${bars('G2', 4)}`;
const CIRCLE_ROOTS = `${bars('G2', 4)} ${bars('Ab2', 4)} ${bars('G2', 4)} ${bars('F#2', 4)}`;
const CLOSER_ROOTS = `${bars('G2', 4)} ${bars('Bb2', 4)} ${bars('C#2', 4)} ${bars('D2', 4)}`;
// A plucked double bass on the one, two octaves under the prowl's roots.
const ONE = [0, ...Array(SIX - 1).fill('.')];
const basses = (roots) => transpose(onNotes(roots, ONE), -12);
// The cellos holding the root, re-bowed every two bars.
const lowHeld = (roots) => {
  const names = roots.split(/\s+/).filter(Boolean);
  return names.flatMap((name, i) => (i % 2 === 0 ? held(midi(name), 2 * SIX) : [])).slice(0, names.length * SIX);
};

// The high ringing: tremolo violins re-bowed every two bars, so it breathes.
const ringing = (note, n) => heldNotes(Array(n / 2).fill(note).join(' '), 2 * SIX);

export const HUSH_STALK_THEME = {
  title: 'Something in the Trees',
  bpm: 80,
  stepsPerBeat: 6,
  // Tension under exploring and a cutscene: kept below the area themes' fuller moments.
  volume: 0.72,

  instruments: {
    // The prowl, plucked (footfalls), then bowed short (closer).
    prowl: { sample: 'cellosPizz', volume: 0.3, release: 0.4, reverb: 0.4, pan: -0.2, humanize: { time: 0.008, volume: 0.2 } },
    prowlBowed: { sample: 'cellosSpic', volume: 0.26, release: 0.06, reverb: 0.3, pan: -0.25, humanize: { time: 0.006, volume: 0.18 } },
    basses: { sample: 'bassSpic', volume: 0.3, release: 0.4, reverb: 0.35, humanize: { time: 0.006, volume: 0.12 } },
    low: { sample: 'cellos', volume: 0.11, attack: 0.9, release: 1.2, reverb: 0.45, pan: -0.1 },
    // The heartbeat: timpani, the dub softer.
    lub: { sample: 'timpani', volume: 0.26, ring: true, reverb: 0.4 },
    dub: { sample: 'timpani', volume: 0.15, ring: true, reverb: 0.4 },
    // The claws: trombones, a tuba an octave under, soft horns joining them.
    claws: { sample: 'trombone', volume: 0.34, attack: 0.08, release: 0.6, reverb: 0.45, pan: -0.1, humanize: { time: 0.01, volume: 0.08 } },
    clawsLow: { sample: 'tuba', volume: 0.26, attack: 0.12, release: 0.6, reverb: 0.4 },
    clawsHorn: { sample: 'hornsSoft', volume: 0.32, attack: 0.15, release: 0.7, reverb: 0.5, pan: 0.15 },
    // The cellos taking the claws, in the circling part.
    clawsCello: { sample: 'cellos', volume: 0.22, attack: 0.06, release: 0.5, reverb: 0.4, pan: -0.25 },
    // The growl: a tuba on G and a trombone a minor ninth above it.
    growl: { sample: 'tuba', volume: 0.5, attack: 0.6, release: 1, reverb: 0.4 },
    growlHigh: { sample: 'trombone', volume: 0.26, attack: 0.9, release: 1, reverb: 0.45 },
    // The ringing in your ears: tremolo violins, very high, very soft, and a
    // second line a half step above.
    ringing: { sample: 'violinsTrem', volume: 0.06, attack: 1.6, release: 1.5, reverb: 0.6, pan: 0.3 },
    rub: { sample: 'violinsTrem', volume: 0.04, attack: 2, release: 1.5, reverb: 0.6, pan: -0.3 },
    swell: { sample: 'violasTrem', volume: 0.14, attack: 2.2, release: 1.4, reverb: 0.55, pan: -0.15 },
    // A clarinet low, holding the tritone like a held breath.
    breath: { sample: 'clarinet', volume: 0.06, attack: 1.2, release: 1.2, reverb: 0.6, pan: 0.25 },
    // The wood's three steps, and a glass.
    harp: { sample: 'harp', volume: 0.15, ring: true, reverb: 0.65, pan: -0.25, humanize: { time: 0.014, volume: 0.2 } },
    glass: { sample: 'glass', volume: 0.05, attack: 1.4, release: 2, reverb: 0.8, pan: 0.3 },
    // A twig snapping somewhere.
    twig: { sample: 'snareSoft', drum: 'sample', volume: 0.07, ring: true, reverb: 0.6 },
    roll: { sample: 'timpaniRoll', volume: 0.13, attack: 2.4, release: 0.5, reverb: 0.45 },
  },

  sections: {
    // The growl: a tuba and a trombone a minor ninth apart, the high
    // ringing fading in, the first heartbeats.
    growl: {
      growl: heldNotes('G1 G1', 2 * SIX),
      growlHigh: [...rest(1), ...held(midi('Ab2'), 3 * SIX)],
      ringing: ringing('D6', 4),
      lub: [...rest(2), ...beat(LUB_ONE, 2)],
      dub: [...rest(2), ...beat(DUB_ONE, 2)],
    },

    // The prowl on plucked cellos, a heartbeat a bar, the cellos low on G.
    // The claws in the trombones and tuba; the second time, no pounce. A flat
    // creeps in under the middle.
    prowl: {
      prowl: prowl(PROWL_ROOTS),
      basses: basses(PROWL_ROOTS),
      low: lowHeld(PROWL_ROOTS),
      lub: beat(LUB_ONE, 16),
      dub: beat(DUB_ONE, 16),
      claws: [...rest(4), ...CLAWS, ...rest(6), ...CLAWS_HELD_BACK, ...rest(2)],
      clawsLow: [...rest(4), ...transpose(CLAWS, -12), ...rest(6), ...transpose(CLAWS_HELD_BACK, -12), ...rest(2)],
      ringing: ringing('D6', 16),
    },

    // It circles: the bass G, A flat, G, F#, and the claws follow it round
    // on the cellos and horns; the prowl bowed now, the heartbeat on both
    // beats, a clarinet holding the tritone, the high rub coming in.
    circling: {
      prowlBowed: prowl(CIRCLE_ROOTS),
      prowl: after(8, prowl(CIRCLE_ROOTS)),
      basses: basses(CIRCLE_ROOTS),
      low: lowHeld(CIRCLE_ROOTS),
      lub: beat(LUB_TWO, 16),
      dub: beat(DUB_TWO, 16),
      clawsCello: [...transpose(CLAWS, 12), ...rest(6), ...transpose(CLAWS, 12), ...rest(6)],
      clawsHorn: [...rest(4), ...clawsOn('Ab2'), ...rest(6), ...clawsOn('F#2'), ...rest(2)],
      breath: after(4, heldNotes(Array(8).fill('C#4').join(' '), 2 * SIX)),
      ringing: ringing('D6', 16),
      rub: after(8, ringing('Eb6', 16)),
      swell: [...rest(8), ...heldNotes('Bb3 Bb3 A3 A3', 2 * SIX)],
    },

    // Listening. Everything stops; the ringing dies away. One heartbeat. A
    // twig. The wood's three steps on the harp, a glass; then the prowl
    // creeping back in under a timpani roll.
    listening: {
      ringing: [...held(midi('D6'), SIX), ...rest(7)],
      lub: [...rest(2), ...beat(LUB_ONE, 1), ...rest(5)],
      dub: [...rest(2), ...beat(DUB_ONE, 1), ...rest(5)],
      twig: [...rest(3), ...'.......x....'.split(''), ...rest(4)],
      harp: [...rest(4), ...patter(cells('G3 D4 A4', 2), THREE_STEPS), ...rest(2)],
      glass: [...rest(4), ...held(midi('D6'), 3 * SIX), ...rest(1)],
      prowl: [...rest(6), ...onNotes('G2 G2', [0, '.', '.', '.', '.', '.', 7, '.', '.', '.', '.', '.'])],
      roll: [...rest(6), ...held(midi('G2'), 2 * SIX)],
    },

    // Closer. The bass moves the way the claws do, G, B flat, C#, D, four
    // bars on each; the full prowl, plucked and bowed; the claws on each new
    // root, on more brass each time; tremolo violas swelling, the high rub;
    // and the last bar silent but for the ringing, listening, before it goes
    // round.
    closer: {
      prowlBowed: until(15, prowl(CLOSER_ROOTS, PROWL)),
      prowl: until(15, prowl(CLOSER_ROOTS)),
      basses: until(15, basses(CLOSER_ROOTS)),
      low: until(15, lowHeld(CLOSER_ROOTS)),
      lub: until(15, [...beat(LUB_TWO, 12), ...beatOn('D3', LUB_TWO, 4)]),
      dub: until(15, [...beat(DUB_TWO, 12), ...beatOn('D3', DUB_TWO, 4)]),
      claws: [...CLAWS, ...rest(2), ...clawsOn('Bb2'), ...rest(2), ...clawsOn('C#3'), ...rest(2), ...clawsOn('D3'), ...rest(2)],
      clawsLow: [...rest(4), ...transpose(clawsOn('Bb2'), -12), ...rest(2), ...transpose(clawsOn('C#3'), -12), ...rest(2), ...transpose(clawsOn('D3'), -12), ...rest(2)],
      clawsHorn: [...rest(8), ...clawsOn('C#3'), ...rest(2), ...clawsOn('D3'), ...rest(2)],
      swell: until(15, heldNotes('Bb3 Bb3 D4 D4 F4 F4 F#4 F#4', 2 * SIX)),
      ringing: ringing('D6', 16),
      rub: until(15, ringing('Eb6', 16)),
    },
  },

  // The growl plays once; then the hunt goes round from the prowl.
  order: ['growl', 'prowl', 'circling', 'listening', 'closer'],
  loopFrom: 1,
};
