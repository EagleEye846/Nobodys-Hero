// Fidgets: what the party does when you've stood still a while, rather than
// freezing. The hero stretches, taps a foot or ties a boot; Ves twirls her
// umbrella, hoists it up to look at the sky, or leans her head toward it;
// Bramble yawns, scratches his head or practises a swing of the hatchet.
//
// Each is a short thing, rare and random (see pickIdle): the hero's lives in
// Player.updateIdle, the others' in Follower.updateFidget, and either one is
// cancelled the moment you move, or a cutscene, a conversation, a cart or a
// rope takes over (they only run while the hero is free to walk about).
//
// An idle is a function of the seconds since it began. It gives back what to
// draw: a `sprite` to show in place of their usual frame (from an animation
// in src/data/art: see engine/animations.js), or `step` to use the hero's
// stepping frame, and a `pose` that moves or squashes it (like acts.js), or
// null once it's over.

import { animationFrame } from '../engine/animations.js';
import { flipHorizontal } from '../engine/sprite.js';

// How the idles get on with each other: which come up, in what order, is
// picked at random but never the one just done.
export function pickIdle(who, last = null) {
  const names = Object.keys(IDLES[who] ?? {}).filter((name) => name !== last);
  return names.length ? names[Math.floor(Math.random() * names.length)] : null;
}

export const idleLength = (who, name) => IDLES[who]?.[name]?.length ?? 0;

// Where idle `name` is `t` seconds in, for `who`: { sprite, step, pose, face },
// or null when it's over. `facing` is 1 or -1 (the way they're turned, for
// the ones that only go one way), `face` the way they turn to do it.
export function idleStep(who, name, t, facing = 1) {
  const idle = IDLES[who]?.[name];
  if (!idle || t >= idle.length) return null;
  const step = idle.at(t, facing);
  return { sprite: null, step: false, face: null, ...step, pose: pose(step.pose) };
}

const ease = (k) => 1 - (1 - Math.min(1, Math.max(0, k))) ** 2;
const hump = (k) => Math.sin(Math.min(1, Math.max(0, k)) * Math.PI);

// A full pose (see acts.js) from the bits given.
function pose(bits = {}) {
  return { dx: 0, lift: 0, forward: 0, sx: 1, sy: 1, look: null, toward: null, ...bits };
}

// Frame `index` of an animation.
const frame = (name, index) => animationFrame(name, index + 0.5, 1, true);

const flipped = new WeakMap();
function mirrored(sprite) {
  if (sprite && !flipped.has(sprite)) flipped.set(sprite, flipHorizontal(sprite));
  return flipped.get(sprite);
}

// Which of `times` (seconds each frame begins) is showing at `t`.
const index = (times, t) => times.filter((from) => t >= from).length - 1;

const IDLES = {
  hero: {
    // Arms up, up on their toes, and a long breath out.
    stretch: {
      length: 2.1,
      at: (t) => {
        const k = t / 2.1;
        return { pose: k < 0.6 ? { sy: 1 + 0.08 * hump(k / 0.7), lift: k > 0.1 && k < 0.5 ? 1 : 0 } : { sy: 1 - 0.07 * hump((k - 0.6) / 0.4), sx: 1 + 0.03 * hump((k - 0.6) / 0.4) } };
      },
    },
    // Three taps of a foot, using the lifted foot of their walk.
    tap: {
      length: 1.7,
      at: (t) => ({ step: t >= 0.25 && t < 1.45 && Math.floor((t - 0.25) / 0.2) % 2 === 0 }),
    },
    // Down on a knee to fiddle with a boot, and back up.
    boot: {
      length: 2.4,
      at: (t) => {
        if (t < 0.25) return { pose: { sx: 1 + 0.1 * ease(t / 0.25), sy: 1 - 0.2 * ease(t / 0.25) } };
        if (t < 2.0) return { pose: { sx: 1.1, sy: 0.8, dx: t > 0.7 && t < 1.7 ? Math.floor(t * 6) % 2 : 0 } };
        const k = (t - 2.0) / 0.4;
        return { pose: { sx: 1.1 - 0.1 * ease(k), sy: 0.8 + 0.2 * ease(k) + 0.04 * hump(k) } };
      },
    },
  },
  vesper: {
    // Her umbrella going round overhead, a few times.
    twirl: {
      length: 1.7,
      at: (t) => ({ face: 'down', sprite: t < 0.15 || t > 1.55 ? null : frame('ves_twirl', Math.floor((t - 0.15) / 0.1) % 4) }),
    },
    // The umbrella up a notch, and her chin up to see what the sky's doing.
    sky: {
      length: 2.4,
      at: (t) => {
        const i = index([0, 0.15, 0.4, 1.8, 2.05], t);
        const up = i >= 1 && i <= 3;
        return { face: 'down', sprite: frame('ves_idle', [0, 1, 2, 1, 0][i]), pose: { sy: up ? 1.03 : 1 } };
      },
    },
    // Her head tipped toward the umbrella, and a small sigh.
    lean: {
      length: 2.6,
      at: (t) => ({
        face: 'down',
        sprite: frame('ves_idle', t > 0.2 && t < 2.3 ? 3 : 0),
        pose: { sy: 1 - 0.04 * hump((t - 1.1) / 0.9) },
      }),
    },
  },
  bramble: {
    // A big one: eyes shut, mouth wide, chest up.
    yawn: {
      length: 2.3,
      at: (t) => {
        const i = index([0, 0.3, 0.8, 1.75, 2.1], t);
        return { face: 'down', sprite: i < 1 || i > 3 ? null : frame('bramble_idle', i === 2 ? 1 : 0), pose: { sy: i === 2 ? 1 + 0.05 * hump((t - 0.8) / 0.95) : 1 } };
      },
    },
    // One hand up in his hair, scritching.
    scratch: {
      length: 2.4,
      at: (t) => ({ face: 'down', sprite: t < 0.2 || t > 2.1 ? null : frame('bramble_idle', 2 + (Math.floor((t - 0.2) / 0.18) % 2)) }),
    },
    // Side-on, the hatchet up and down twice, working out how he'd do it.
    swing: {
      length: 2.0,
      at: (t, facing) => {
        const i = index([0, 0.35, 0.6, 1.0, 1.2], t);
        const raised = [true, false, true, false, true][i];
        const sprite = frame('bramble_chop', raised ? 0 : 1);
        return { face: facing < 0 ? 'left' : 'right', sprite: t > 1.7 ? null : facing < 0 ? sprite : mirrored(sprite), pose: { forward: raised ? 0 : 1 } };
      },
    },
  },
};
