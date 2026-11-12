import { spotlights, trapdoors, confetti, strings, chorus, applause, curtain, finale } from './rumbold.js';
import { Shot } from '../projectiles.js';
import { sfx } from '../../audio/music.js';

// KING PEPTUP's attacks once his jaw has jammed and the curtain's slipped
// (phase 2 of his fight: BEHIND THE CURTAIN, src/data/enemies/rumbold.js).
// It's the same show, trying to carry on without anyone able to run it
// properly: a thing goes wrong in each one. Tuck is at the bar up in the
// rafters, and he's tired: his arms ache, and everything on his strings
// goes heavy with him.
//
//   rumboldStrings    hooks let down to reel you in, and control bars
//   rumboldFlicker    the spotlights going out as they sweep, a dying bulb
//   rumboldTangle     the puppet strings knotting up, drifting off course
//   rumboldFizzle     poppers that barely pop, then fireworks that droop
//   rumboldStumble    the chorus line out of step, one mole tripping flat
//   rumboldRestart    the trapdoors flapping, then the curtain stuck halfway
//   rumboldStuckSign  the CHEER sign stuck on CLAP, clapping slowly
//
// THE TIRED HANDS (tired, below): every one of them runs on Tuck's arms.
// Most of the time the whole attack goes at a weary two-thirds pace. Every
// few seconds his arms give out: it all sags to a near stop, and anything
// in the air sinks a little, as the strings go slack. Then he catches
// himself (a creak of the bar) and yanks it all back up to speed, never
// faster than the show itself went, and it slows again. Fewer things come,
// slower, with longer to see them; the stalls are a breath, and the yank
// after one is the thing to watch for.
//
// Built from the same pieces as the show (rumbold.js and rumboldBullets.js).

// How fast the show runs on Tuck's arms (a share of its own pace), stage by
// stage: working, sagging, slumped, the yank back, settling.
const WORK = 0.68;
const SLUMP = 0.14;
const YANK = 1.0;
// How fast things in the air sink while the strings are slack (px a second).
const DROOP = 11;

function tired(attack) {
  // The stages of one tired cycle, rolled fresh each time round.
  let stage = 0;
  let left = 0.6 + Math.random() * 0.9;
  let factor = WORK;
  const LENGTHS = [() => 1.5 + Math.random() * 0.9, () => 0.45, () => 0.4 + Math.random() * 0.35, () => 0.22, () => 0.3];
  const ease = (k) => k * k * (3 - 2 * k);
  let into = 0;
  let length = left;
  const step = (real) => {
    into += real;
    while (into >= length) {
      into -= length;
      stage = (stage + 1) % 5;
      length = LENGTHS[stage]();
      // (The bar's creak as he catches it: the yank is coming.)
      if (stage === 3) sfx('creak');
    }
    const k = ease(Math.min(1, into / length));
    factor = [WORK, WORK + (SLUMP - WORK) * k, SLUMP, YANK, YANK + (WORK - YANK) * k][stage];
  };
  const slack = () => stage === 1 || stage === 2;
  const own = new WeakSet();
  return {
    ...attack,
    update: (dt, bullets, soul) => {
      // (`dt` comes in sped up by the density; the cycle runs in real time.)
      const real = dt / (attack.density ?? 1);
      step(real);
      const before = bullets.length;
      attack.update(dt * factor, bullets, soul);
      // Whatever's on his strings goes at his pace too.
      for (let i = before; i < bullets.length; i++) {
        const b = bullets[i];
        if (own.has(b)) continue;
        own.add(b);
        const move = b.update;
        b.update = function (bdt, box) {
          move.call(this, bdt * factor, box);
          // Slack strings: the bits of the show in the air sink a little.
          if (slack() && this instanceof Shot && !this.harmless && this.age >= this.warn) {
            this.y += DROOP * bdt;
            if (this.baseY !== undefined) this.baseY += DROOP * bdt;
          }
        };
      }
    },
  };
}

// Runs one attack, then another from `at` seconds of its own (pausing the
// first there, so the two aren't in the box together for long).
function then(a, b, at, overlap = 0.6) {
  let t = 0;
  return {
    duration: Math.max(a.duration, at + b.duration * 0.75),
    update: (dt, bullets, soul) => {
      t += dt;
      if (t < at + overlap) a.update(dt, bullets, soul);
      if (t >= at) b.update(dt, bullets, soul);
    },
  };
}

// Each attack keeps its density on it, for the tired clock's real time.
const make = (fn) => (box, density, tools) => tired({ ...fn(box, density, tools), density });

export const RUMBOLD_BROKEN_ATTACKS = {
  // His strings, out in the open now: the hooks still reel you in, on his
  // tired arms.
  rumboldSlackStrings: make((box, density, tools) => strings(box, density, tools)),
  rumboldFlicker: make((box, density, tools) => spotlights(box, density, tools, { broken: true })),
  rumboldTangle: make((box, density, tools) => strings(box, density, tools, { broken: true })),
  // (The poppers first, then the rockets: never both at once.)
  rumboldFizzle: make((box, density, tools) => then(
    confetti(box, density, tools, { broken: true }),
    finale(box, density, tools, { broken: true }),
    2.4 * density,
  )),
  rumboldStumble: make((box, density, tools) => chorus(box, density, tools, { broken: true })),
  // (The trapdoors, and once they've given up, the curtain.)
  rumboldRestart: make((box, density, tools) => then(
    trapdoors(box, density, tools, { broken: true }),
    curtain(box, density, tools, { broken: true }),
    3.2 * density,
  )),
  rumboldStuckSign: make((box, density, tools) => applause(box, density, tools, { broken: true })),
};

