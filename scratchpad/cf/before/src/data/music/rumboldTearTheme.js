import { transpose, hits } from '../../audio/notation.js';
import { midi } from './parts/usurper.js';
import { HOOK, TUCK, RIFF, INSTRUMENTS, PARTS, upsideDown, fitToRecordings } from './rumboldAliveTheme.js';

// "Upside Down": the finale cue of the duel with King Peptup. Once he's
// low in "No Strings" (rumboldAliveTheme.js), his head turns
// upside down to stare at you, his strings tear the box in two and the whole
// stage becomes the box (the attack rumboldAliveTear). The battle cuts to
// this song when he picks that attack (the phase's `finale.music`) and it
// plays to the end of the fight.
//
// THE IDEA: "No Strings", turned over. The king's hook is played literally
// upside down (every step up a step down, inside the minor scale), and a
// tritone away from home, in E minor, as far from B flat as a key can get.
// Turned over, the hook's slide down becomes a climb, its answer becomes
// the chapter's cell in D minor, and the tonic chord never comes: the
// harmony is Am Dm C Dm Am Cm F Bdim over a low E nobody plays a chord on,
// a floor that isn't there. The jaw riff is turned over too. The one thing
// still the right way up is Tuck's stammer, screaming on the solo violin,
// flute and piccolo over the top.
//
// Same orchestra and machinery as "No Strings" (all real recordings: VSCO 2,
// VCSL and the game's own choir), the same tempo, so the cut lands on the
// beat it would have anyway. E minor (more or less). 150 BPM, one step a
// 16th, a bar 1.6 seconds. The intro plays once (3.2s), then it loops,
// 24 bars, 38.4s:
//
//   intro   2 bars       THE HEAD TURNS: BRAAAM and gong on E, the strings
//                        yanked up a chromatic scale, the jaw stuttering, a
//                        roll and a swell, ONE BEAT of silence
//   U1      8 bars  0:00 the hook upside down on everything at once, choir and
//                        all, the jaw in the gap at the end
//   U2      8 bars  0:13 the jaw riff upside down in the low strings and
//                        brass; the chapter's cell upside down on the choir,
//                        a note every two beats; Tuck's stammer, the right way
//                        up, crying out every other bar on top
//   U3      8 bars  0:26 the upside-down hook again, the piccolo on top, the
//                        build, the silence, and round to U1

const {
  BAR, ONE, TICK, TOCK, ROLL_8, ROLL_16, JAW_B, T_POUND, CREAK,
  h, at, barsOf, held, times, onBars, pitched, climb, twin, section, stopdown, then, swellEnd,
  comp, timps, hornFit, tutti, drop, jawIn, kit,
} = PARTS;
const up = transpose;

// The hook turned over around B flat, then up a tritone to E.
const TURNED = up(upsideDown(HOOK, midi('Bb4')), 6);
const TURNED_CH = 'Am Dm C Dm Am Cm F Bdim';
{
  // Turned over, its second bar is the chapter's cell in D minor (A D F E).
  const second = barsOf(TURNED, 1, 2).filter((s) => typeof s === 'number');
  if (second.join() !== [midi('A4'), midi('D5'), midi('F5'), midi('E5')].join()) throw new Error("Upside Down: the hook didn't turn over as it should");
}
// The jaw riff turned over, in E, moved to each chord's root.
const RIFF_TURNED = up(upsideDown(RIFF, midi('Bb2')), 6);
const riffBar = (bar, by) => up(barsOf(RIFF_TURNED, bar, bar + 1), by);
const U2_CH = 'Em Em C C Am Am B B';
const U2_RIFF = [...riffBar(0, 0), ...riffBar(1, 0), ...riffBar(0, -4), ...riffBar(1, -4), ...riffBar(0, 5), ...riffBar(1, 5), ...riffBar(0, -5), ...riffBar(1, -5)];
// The chapter's cell upside down (down a fourth, down a third, a step up)
// in each chord, a note every two beats.
const CELL_TURNED = h('B4 F#4 D4 E4 | G4 D4 B3 C4 | E4 B3 G3 A3 | F#4 C#4 A#3 B3');
// Tuck's stammer, the right way up, in E minor.
const STAMMER = up(barsOf(TUCK, 0, 1), 6);
const JAW_GAP = hits('........x.x.x..x');

const song = {
  title: 'Upside Down',
  bpm: 150,
  stepsPerBeat: 4,
  volume: 0.4,
  limit: 1,
  instruments: INSTRUMENTS,

  sections: {
    // THE HEAD TURNS.
    intro: stopdown(section(2 * BAR, {
      ...drop('E2', 2, [0]),
      violins: climb(64, 16, 1),
      violinsHigh: climb(76, 16, 1),
      cellosTrem: held('E2', 2 * BAR),
      celesta: barsOf(TURNED, 0, 1),
      celestaSour: twin(barsOf(TURNED, 0, 1)),
      jaw: JAW_B,
      stabs: pitched(JAW_B, 'E2'),
      stabsHigh: pitched(JAW_B, 'D#4'),
      choirHeld: held('B4', 2 * BAR),
      timpRoll: at(1, held('B2', BAR)),
      roll: at(1, ROLL_16),
      swell: swellEnd(2 * BAR),
    })),

    // The hook upside down, everything at once.
    U1: section(8 * BAR, {
      ...tutti(TURNED, TURNED_CH, 0),
      ...drop('E2', 8, [0]),
      ...kit('drop', 8, [7], 'dropB'),
      ...jawIn(8, [7], 'E2', 'D#4'),
      cellosTrem: held('E2', 8 * BAR),
    }),

    // The riff upside down; the cell upside down on the choir; Tuck the
    // right way up on top.
    U2: section(8 * BAR, {
      cellos: U2_RIFF,
      trombones: U2_RIFF,
      basses: up(U2_RIFF, -12),
      horns: at(4, barsOf(U2_RIFF, 4, 8)),
      tuba: comp(U2_CH, ['R', ...Array(15).fill('-')], 34),
      choir: CELL_TURNED,
      violins: up(CELL_TURNED, 12),
      hornsSoft: hornFit(CELL_TURNED),
      soloViolin: onBars(8, [0, 2, 4, 6], STAMMER),
      flute: onBars(8, [0, 2, 4, 6], STAMMER),
      piccolo: onBars(8, [4, 6], up(STAMMER, 12)),
      creak: comp(U2_CH, CREAK, 58),
      tick: times(pitched(TICK, 'D6'), 8),
      tock: times(TOCK, 8),
      timpani: timps(U2_CH, T_POUND),
      ...then(kit('half', 4, [3]), kit('drop', 4, [3], 'dropB')),
      jaw: onBars(8, [1, 3, 5, 7], JAW_GAP),
      crash: onBars(8, [0, 4], ONE),
      gong: onBars(8, [4], ONE),
    }),

    // The upside-down hook again, the piccolo on top; the build; silence.
    U3: stopdown(section(8 * BAR, {
      ...tutti(TURNED, TURNED_CH, 0),
      piccolo: up(barsOf(TURNED, 0, 6), 12),
      soloViolin: onBars(8, [0, 4], STAMMER),
      flute: onBars(8, [0, 4], STAMMER),
      cellosTrem: held('E2', 8 * BAR),
      ...kit('drop', 8, [6, 7], 'dropB'),
      crash: onBars(8, [0, 4], ONE),
      gong: onBars(8, [0], ONE),
      timpRoll: at(6, held('B2', 2 * BAR)),
      roll: at(6, [...ROLL_8, ...ROLL_16]),
      choirHeld: at(6, held('B4', 2 * BAR)),
      swell: swellEnd(8 * BAR),
    })),
  },

  order: ['intro', 'U1', 'U2', 'U3'],
  loopFrom: 1,
};

fitToRecordings(song);

export const RUMBOLD_TEAR_THEME = song;
