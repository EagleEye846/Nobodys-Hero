// Helpers for writing attack patterns. Every pattern is handed these (along
// with the bullet classes) as PATTERN_TOOLS, so attack files and Pattern Lab
// patterns don't need to import anything.

export const rand = (min, max) => min + Math.random() * (max - min);
export const pick = (options) => options[Math.floor(Math.random() * options.length)];
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// The angle from one point to another, for aiming.
export const angleTo = (from, to) => Math.atan2(to.y - from.y, to.x - from.x);

// Runs an action at random intervals between min and max seconds.
export function every(min, max, action) {
  let timer = rand(min, max);
  return (dt, ...args) => {
    timer -= dt;
    while (timer <= 0) {
      timer += rand(min, max);
      action(...args);
    }
  };
}

// A random point just outside one edge of the box, and which edge it's on.
export function edgePoint(box, side = pick(['top', 'left', 'right', 'bottom']), outside = 3) {
  switch (side) {
    case 'top': return { side, x: rand(box.x + 4, box.x + box.w - 4), y: box.y - outside };
    case 'bottom': return { side, x: rand(box.x + 4, box.x + box.w - 4), y: box.y + box.h + outside };
    case 'left': return { side, x: box.x - outside, y: rand(box.y + 4, box.y + box.h - 4) };
    default: return { side: 'right', x: box.x + box.w + outside, y: rand(box.y + 4, box.y + box.h - 4) };
  }
}

// A random point inside the box at least `minGap` away from the soul, so things
// don't appear right on top of it.
export function pointAwayFrom(box, soul, minGap = 26, inset = 10) {
  let point = { x: 0, y: 0 };
  for (let tries = 0; tries < 12; tries++) {
    point = { x: rand(box.x + inset, box.x + box.w - inset), y: rand(box.y + inset, box.y + box.h - inset) };
    if (Math.hypot(point.x - soul.x, point.y - soul.y) >= minGap) break;
  }
  return point;
}
