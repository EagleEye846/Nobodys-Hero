import { spotlights, trapdoors, confetti, strings, chorus, applause, curtain, finale } from './rumbold.js';

// KING PEPTUP's attacks once his jaw has jammed and the curtain's slipped
// (phase 2 of his fight: BEHIND THE CURTAIN, src/data/enemies/rumbold.js).
// It's the same show, trying to carry on without anyone able to run it
// properly: a thing goes wrong in each one. Slower, looser, smaller, and
// sadder, and there's a gap to breathe in. Tuck is at the levers, and he
// is not good at being fast.
//
//   rumboldFlicker    the spotlights going out as they sweep, a dying bulb
//   rumboldTangle     the puppet strings knotting up, drifting off course
//   rumboldFizzle     poppers that barely pop, fireworks that droop and fizz
//   rumboldStumble    the chorus line out of step, one mole tripping flat
//   rumboldRestart    the trapdoors flapping and the curtain stuck halfway
//   rumboldStuckSign  the CHEER sign stuck on CLAP, clapping slowly
//
// Built from the same pieces as the show (rumbold.js and rumboldBullets.js).

// Runs two attacks at once, each for its own length.
function together(a, b) {
  return {
    duration: Math.max(a.duration, b.duration),
    update: (dt, bullets, soul) => {
      a.update(dt, bullets, soul);
      b.update(dt, bullets, soul);
    },
  };
}

export const RUMBOLD_BROKEN_ATTACKS = {
  rumboldFlicker: (box, density, tools) => spotlights(box, density, tools, { broken: true }),
  rumboldTangle: (box, density, tools) => strings(box, density, tools, { broken: true }),
  rumboldFizzle: (box, density, tools) => together(
    confetti(box, density, tools, { broken: true }),
    finale(box, density, tools, { broken: true }),
  ),
  rumboldStumble: (box, density, tools) => chorus(box, density, tools, { broken: true }),
  rumboldRestart: (box, density, tools) => together(
    trapdoors(box, density, tools, { broken: true }),
    curtain(box, density, tools, { broken: true }),
  ),
  rumboldStuckSign: (box, density, tools) => applause(box, density, tools, { broken: true }),
};
