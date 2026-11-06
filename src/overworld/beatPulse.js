import { music } from '../audio/music.js';

// BEAT PULSE: a number that swells on each beat of the song that's playing,
// for things in the world that move with the music (a crystal prop with
// `pulse: 'beat'`, the Glimmering's glowing crystals). Worked out from the
// song's real timing (music.beatPosition), so it lands on the beat. With no
// music (sound not allowed yet, or a silent room) it falls back to a slow
// breathe, so nothing ever sits dead.
//
//   const { env, down } = beatPulse(seconds);
//
// `env` is 0 to 1: it jumps up a touch before the beat and eases away
// (soft attack, long tail). Quick songs (100 bpm and up) pulse every second
// beat, so it never flutters. `down` is the same for the first beat of each
// bar of four: a rarer, bigger swell (a glow ring).
//
// It's cached for the frame, so any number of crystals ask for free.

let stamp = -1;
let cached = { env: 0, down: 0, live: false };

const rise = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
// 1 right on the beat then a long ease down, with a very short soft rise just
// before the next beat so it never snaps.
const shape = (p) => Math.max(Math.pow(1 - p, 2.6), rise((p - 0.93) / 0.07));

export function beatPulse(seconds) {
  // (Everything drawn in the same hundredth of a second shares one answer.)
  const key = Math.floor(seconds * 100);
  if (key === stamp) return cached;
  stamp = key;
  const pos = music.beatPosition();
  if (!pos) {
    const slow = 0.5 + 0.5 * Math.sin(seconds * 1.1);
    cached = { env: 0.45 * slow * slow, down: 0, live: false };
    return cached;
  }
  const every = pos.bpm >= 100 ? 2 : 1;
  const unit = pos.beats / every;
  const p = unit - Math.floor(unit);
  const bar = pos.beats / 4;
  const q = bar - Math.floor(bar);
  cached = { env: shape(p), down: shape(q), live: true };
  return cached;
}
