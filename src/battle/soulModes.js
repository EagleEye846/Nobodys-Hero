// Soul modes change how the soul looks and moves. They are for special boss
// battles only: an attack pattern can ask for a mode (see bullets.js), and the
// battle refuses it unless the enemy has `boss: true`.
//
// Each mode has a colour pair, a hint shown the first time it appears in a
// battle, and update(soul, dt, input, box) to move the soul.

// How close the soul's centre can get to the box walls.
export const SOUL_INSET = 5;

const SPEED = 80; // pixels per second
const FOCUS_SPEED = 38;

const HEAVY_SPEED = 72;
const HEAVY_GRAVITY = 420;
const HEAVY_JUMP = 165;
// Letting go of jump early cuts the rise to this fraction, for short hops.
const HEAVY_SHORT_HOP = 0.45;

function axis(input, negative, positive) {
  return (input.isDown(positive) ? 1 : 0) - (input.isDown(negative) ? 1 : 0);
}

export const SOUL_MODES = {
  // Every regular battle. Moves freely; hold focus (X) to move slower.
  normal: {
    color: '#ffffff',
    hint: '',
    update(soul, dt, input) {
      soul.focused = input.isDown('focus');
      const dx = axis(input, 'left', 'right');
      const dy = axis(input, 'up', 'down');
      if (dx === 0 && dy === 0) return;
      const speed = (soul.focused ? FOCUS_SPEED : SPEED) / Math.hypot(dx, dy);
      soul.x += dx * speed * dt;
      soul.y += dy * speed * dt;
    },
  },

  // Boss only. Falls to the floor of the box and jumps; hold jump to go higher.
  // An attack can give the box `platforms` ({ x, y, w }, which it can move)
  // to stand on as well: you jump up through them and land on top, and ride
  // one wherever it goes till you jump or walk off its end.
  heavy: {
    color: '#b07cff',
    hint: 'Your SHADOW turns HEAVY and falls.\nPress UP to jump. Hold it to jump higher.',
    update(soul, dt, input, box) {
      soul.focused = false;
      soul.x += axis(input, 'left', 'right') * HEAVY_SPEED * dt;

      const platforms = box.platforms ?? null;
      const under = (p) => soul.x >= p.x - 2 && soul.x <= p.x + p.w + 2;
      if (soul.platform && !(platforms?.includes(soul.platform) && under(soul.platform))) soul.platform = null;
      if (soul.platform) soul.grounded = true;

      const jumpPressed = (input.firstPressed?.('up') ?? input.wasPressed('up')) || input.wasPressed('jump');
      const jumpHeld = input.isDown('up') || input.isDown('jump');
      if (soul.grounded && jumpPressed) {
        soul.vy = -HEAVY_JUMP;
        soul.grounded = false;
        soul.platform = null;
      }
      if (!jumpHeld && soul.vy < -HEAVY_JUMP * HEAVY_SHORT_HOP) soul.vy = -HEAVY_JUMP * HEAVY_SHORT_HOP;

      if (soul.platform) {
        soul.y = soul.platform.y - SOUL_INSET;
        soul.vy = 0;
      } else {
        const was = soul.y;
        soul.vy += HEAVY_GRAVITY * dt;
        soul.y += soul.vy * dt;
        // Landing on one, coming down onto its top (a little slack, as it
        // may have moved down this frame too).
        if (platforms && soul.vy >= 0) {
          const landed = platforms.find((p) => under(p) && was <= p.y - SOUL_INSET + 1.5 && soul.y >= p.y - SOUL_INSET);
          if (landed) {
            soul.platform = landed;
            soul.y = landed.y - SOUL_INSET;
            soul.vy = 0;
          }
        }
      }

      const floor = box.y + box.h - SOUL_INSET;
      soul.grounded = Boolean(soul.platform) || soul.y >= floor;
      if (soul.y >= floor) {
        soul.platform = null;
        soul.y = floor;
        soul.vy = 0;
      }
      const ceiling = box.y + SOUL_INSET;
      if (soul.y < ceiling) {
        soul.y = ceiling;
        soul.vy = 0;
      }
    },
  },
};
