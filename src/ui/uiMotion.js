// Small bits of movement shared by the menus: a cursor that slides to its new
// spot instead of jumping, a panel that eases open, a number that counts up
// or down to its new value. All of it is only drawing: input is never held
// up, and a key pressed part way through still does its thing at once.
//
// Each thing is remembered by a `key` (any string). Something not drawn for a
// moment (a menu closed and opened again) starts fresh, so it snaps straight
// to where it should be rather than sliding in from where it was last time.

const FORGET_MS = 250;
const now = () => performance.now();
// The checking pages in tools/ (preview.html's stills) draw a menu once, so
// there everything is shown already settled: open, in place, counted.
export const STILL = typeof location !== 'undefined' && /\/tools\//.test(location.pathname);
const smooth = (k) => 1 - (1 - k) * (1 - k) * (1 - k);

// A cursor at `x`, `y` that glides there from wherever it last was, taking
// `ms`. Returns where to draw it this frame.
const cursors = new Map();
export function glide(key, x, y, ms = 90) {
  const t = now();
  let c = cursors.get(key);
  if (!c || t - c.seen > FORGET_MS) {
    c = { fromX: x, fromY: y, toX: x, toY: y, at: t, seen: t };
    cursors.set(key, c);
  }
  if (STILL) return { x, y };
  if (c.toX !== x || c.toY !== y) {
    // Start from where it is now, so a quick second press carries on smoothly.
    const here = position(c, t, ms);
    Object.assign(c, { fromX: here.x, fromY: here.y, toX: x, toY: y, at: t });
  }
  c.seen = t;
  return position(c, t, ms);
}
function position(c, t, ms) {
  const k = smooth(Math.min(1, (t - c.at) / ms));
  return { x: Math.round(c.fromX + (c.toX - c.fromX) * k), y: Math.round(c.fromY + (c.toY - c.fromY) * k) };
}

// How far open a panel is, 0 to 1, over `ms` from the first frame it's drawn.
const panels = new Map();
export function opening(key, ms = 110) {
  const t = now();
  let p = panels.get(key);
  if (!p || t - p.seen > FORGET_MS) p = { at: t };
  p.seen = t;
  panels.set(key, p);
  if (STILL) return 1;
  return smooth(Math.min(1, (t - p.at) / ms));
}

// A number that counts its way to `value` (gold after buying, say) over
// about `ms`, instead of changing all at once. The first time it's drawn it
// just shows the value.
const counters = new Map();
export function counting(key, value, ms = 400) {
  const t = now();
  let c = counters.get(key);
  if (!c || t - c.seen > FORGET_MS) c = { from: value, to: value, at: t };
  if (c.to !== value) Object.assign(c, { from: shown(c, t, ms), to: value, at: t });
  c.seen = t;
  counters.set(key, c);
  if (STILL) return value;
  return shown(c, t, ms);
}
function shown(c, t, ms) {
  const k = smooth(Math.min(1, (t - c.at) / ms));
  return Math.round(c.from + (c.to - c.from) * k);
}

// A gentle up-and-down, in pixels (0 to `pixels`), for an arrow that says
// "there's more" or a cursor at rest.
export function bob(pixels = 3, periodMs = 700) {
  return Math.round(((Math.sin((now() / periodMs) * Math.PI * 2) + 1) / 2) * pixels);
}

// A small solid arrow pointing down (or up, `direction` -1), its tip at `x`, `y`.
export function arrow(ctx, x, y, color, size = 6, direction = 1) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - size, y - direction * size);
  ctx.lineTo(x + size, y - direction * size);
  ctx.lineTo(x, y);
  ctx.fill();
}
