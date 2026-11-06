// Snipes: wraps an attack so that, on top of its own pattern, the monster also
// takes a few aimed shots with a short warning (the bullet shows, still and
// harmless, then flies). Each is aimed a little ahead of where you are heading,
// so standing still, running one way or circling all get hit, while a player
// who watches the warning and steps off the line never does.
//
//   X_ATTACKS.name = withSnipes(X_ATTACKS.name, { art: 'bulletArt', count: 3 });
//
// Options: art (the monster's own bullet art), count (shots a turn), first
// (seconds before the first), every, speed, warn, lead (total seconds ahead to aim, about warn plus the flight; a
// list is cycled shot by shot, so some aim ahead and some straight at you;
// 'mean' aims at where you have been on average, which catches circling),
// fan (shots a volley, spread 0.4 rad apart: wide enough to catch a loop),
// until (no new shot after this many seconds), life.
export function withSnipes(attack, opts = {}) {
  const { art, count = 3, first = 1.4, every = 1.6, speed = 78, warn = 0.55, lead = 0.95, until = 5.6, life = 3, fan = 1 } = opts;
  return (box, density, kit) => {
    const base = attack(box, density, kit);
    const { Shot } = kit;
    let t = 0;
    let fired = 0;
    const heading = { x: 0, y: 0 };
    const seen = { x: null, y: null };
    const mean = { x: null, y: null };
    return {
      ...base,
      update: (dt, bullets, soul) => {
        base.update(dt, bullets, soul);
        t += dt;
        if (seen.x !== null && dt > 0) {
          heading.x = heading.x * 0.85 + ((soul.x - seen.x) / dt) * 0.15;
          heading.y = heading.y * 0.85 + ((soul.y - seen.y) / dt) * 0.15;
        }
        mean.x = mean.x === null ? soul.x : mean.x + (soul.x - mean.x) * Math.min(1, dt * 1.2);
        mean.y = mean.y === null ? soul.y : mean.y + (soul.y - mean.y) * Math.min(1, dt * 1.2);
        seen.x = soul.x;
        seen.y = soul.y;
        if (fired >= count || t < first + fired * every || t > until) return;
        // From the edge of the box that is furthest from you, so there is always room to see it.
        const side = fired % 4;
        const from = [
          { x: box.x + box.w + 8, y: soul.y },
          { x: soul.x, y: box.y - 8 },
          { x: box.x - 8, y: soul.y },
          { x: soul.x, y: box.y + box.h + 8 },
        ][(side + (soul.x < box.x + box.w / 2 ? 0 : 2)) % 4];
        const ahead = Array.isArray(lead) ? lead[fired % lead.length] : lead;
        const tx = ahead === 'mean' ? mean.x : soul.x + heading.x * ahead;
        const ty = ahead === 'mean' ? mean.y : soul.y + heading.y * ahead;
        const a = Math.atan2(ty - from.y, tx - from.x);
        for (let k = 0; k < fan; k++) {
          const b = a + (k - (fan - 1) / 2) * 0.4;
          bullets.push(new Shot({ x: from.x, y: from.y, vx: Math.cos(b) * speed, vy: Math.sin(b) * speed, warn, art, life }));
        }
        fired++;
      },
    };
  };
}
