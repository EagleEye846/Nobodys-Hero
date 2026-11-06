import { SCREEN_WIDTH as W } from '../config.js';

// Battle backgrounds for Chapter 5's coast (see BACKDROPS in backdrops.js),
// picked by the room's `area`: gullrest (the sunny beach), wrack (the storm
// starts), saltcombe (lamplit stilt houses), lanes (drowned roads), wreck (the
// ship graveyard under the green storm), soundings (the sea cave), isles and
// haddock_light (little lights), reach (the open storm sea) and lastlight
// (the lamp room at the top of the tower). Each draws the stage from y = 0
// down to `height`; the battle panel covers the rest. Everything moves a
// little: waves, rain, mist, flags, lights. Scenery that never moves is drawn
// once onto its own canvas.

function hash(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
const rect = (ctx, color, x, y, w, h) => {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
};
function disc(ctx, color, cx, cy, r) {
  ctx.fillStyle = color;
  for (let dy = -r; dy <= r; dy++) {
    const w = Math.round(Math.sqrt(Math.max(0, r * r - dy * dy + 0.25)));
    ctx.fillRect(Math.round(cx - w), Math.round(cy + dy), w * 2 + 1, 1);
  }
}
function oval(ctx, color, cx, cy, rx, ry) {
  ctx.fillStyle = color;
  for (let dy = -ry; dy <= ry; dy++) {
    const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (dy * dy) / (ry * ry + 0.25))));
    ctx.fillRect(Math.round(cx - w), Math.round(cy + dy), w * 2 + 1, 1);
  }
}
function line(ctx, color, x0, y0, x1, y1) {
  ctx.fillStyle = color;
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
  for (let i = 0; i <= n; i++) ctx.fillRect(Math.round(x0 + ((x1 - x0) * i) / n), Math.round(y0 + ((y1 - y0) * i) / n), 1, 1);
}
// A hanging cord: sags by `sag` pixels in the middle.
function cord(ctx, color, x0, y0, x1, y1, sag) {
  ctx.fillStyle = color;
  const n = Math.max(Math.abs(x1 - x0), 1);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    ctx.fillRect(Math.round(x0 + (x1 - x0) * t), Math.round(y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * sag), 1, 1);
  }
}
function poly(ctx, color, pts) {
  ctx.fillStyle = color;
  const ys = pts.map((p) => p[1]);
  for (let y = Math.floor(Math.min(...ys)); y <= Math.ceil(Math.max(...ys)); y++) {
    const xs = [];
    for (let i = 0; i < pts.length; i++) {
      const [ax, ay] = pts[i];
      const [bx, by] = pts[(i + 1) % pts.length];
      if ((ay <= y + 0.5 && by > y + 0.5) || (by <= y + 0.5 && ay > y + 0.5)) xs.push(ax + ((y + 0.5 - ay) / (by - ay)) * (bx - ax));
    }
    xs.sort((a, b) => a - b);
    for (let i = 0; i + 1 < xs.length; i += 2) ctx.fillRect(Math.round(xs[i]), y, Math.max(1, Math.round(xs[i + 1]) - Math.round(xs[i])), 1);
  }
}
function glow(ctx, x, y, radius, rgb, strength) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
  g.addColorStop(0, `rgba(${rgb}, ${strength})`);
  g.addColorStop(1, `rgba(${rgb}, 0)`);
  ctx.fillStyle = g;
  ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}
const CACHED = new Map();
function cached(key, height, draw) {
  const id = `${key}:${height}`;
  if (!CACHED.has(id)) {
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = height;
    draw(canvas.getContext('2d'));
    CACHED.set(id, canvas);
  }
  return CACHED.get(id);
}
function hexToRgb(h) {
  return [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
}
function mix(a, b, t) {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`;
}
// Vertical gradient through the given colours, drawn in 2 pixel bands.
function skyGradient(ctx, y0, y1, stops) {
  for (let y = y0; y < y1; y += 2) {
    const t = ((y - y0) / Math.max(1, y1 - y0)) * (stops.length - 1);
    const i = Math.min(stops.length - 2, Math.floor(t));
    rect(ctx, mix(stops[i], stops[i + 1], t - i), 0, y, W, 2);
  }
}

// ---------- shared weather ----------

// A strip of clouds as wide as the screen that wraps, so it can drift forever.
function cloudStrip(key, height, y0, y1, colors, seedN, density) {
  return cached(key, height, (ctx) => {
    for (let i = 0; i < density; i++) {
      const cx = hash(seedN + i) * W;
      const cy = y0 + hash(seedN + i + 40) * (y1 - y0);
      const rx = 22 + hash(seedN + i + 80) * 34;
      const ry = 5 + hash(seedN + i + 120) * 9;
      const c = colors[i % colors.length];
      for (const off of [-W, 0, W]) {
        oval(ctx, c, cx + off, cy, rx, ry);
        oval(ctx, c, cx + off - rx * 0.4, cy + ry * 0.3, rx * 0.6, ry * 0.8);
        oval(ctx, c, cx + off + rx * 0.5, cy + ry * 0.2, rx * 0.5, ry * 0.7);
      }
    }
  });
}
function drift(ctx, strip, time, speed) {
  const off = (time * speed) % W;
  ctx.drawImage(strip, -off, 0);
  ctx.drawImage(strip, W - off, 0);
}
function rain(ctx, time, height, count, color, speed, slant, seedN = 0, depthBias = 1) {
  ctx.fillStyle = color;
  for (let i = 0; i < count; i++) {
    const sp = speed * (0.8 + hash(seedN + i + 5) * 0.5);
    const y = (hash(seedN + i + 1) * height + time * sp) % (height + 8) - 4;
    const x = (hash(seedN + i + 2) * (W + 80) - y * slant - time * 4 * slant) % (W + 40);
    const xx = x < -20 ? x + W + 40 : x;
    const len = 3 + Math.floor(hash(seedN + i + 3) * 3 * depthBias);
    for (let k = 0; k < len; k++) ctx.fillRect(Math.round(xx - k * slant), Math.round(y + k), 1, 1);
  }
}
// 0..1: how bright the lightning is just now (a double flicker, then it fades).
function flashAt(time, period, offset = 0) {
  if (!period) return { f: 0, n: 0, p: 9 };
  const t = time + offset;
  const n = Math.floor(t / period);
  const p = t - n * period;
  let f = 0;
  if (p < 0.06) f = 1;
  else if (p < 0.14) f = 0.15;
  else if (p < 0.26) f = 0.85;
  else if (p < 0.55) f = ((0.55 - p) / 0.29) * 0.4;
  return { f, n, p };
}
function bolt(ctx, x0, y0, y1, seedN, color) {
  let x = x0;
  const pts = [[x, y0]];
  for (let y = y0; y < y1; y += 6) {
    x += (hash(seedN + y) - 0.5) * 12;
    pts.push([x, y + 6]);
  }
  for (let i = 0; i + 1 < pts.length; i++) line(ctx, color, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]);
  for (let i = 2; i < pts.length - 2; i += 3) line(ctx, color, pts[i][0], pts[i][1], pts[i][0] + (hash(seedN + i) - 0.5) * 24, pts[i][1] + 10);
}
// Rolling water: layers of waves from the horizon down. `cols` is far to near.
function sea(ctx, time, y0, y1, cols, amp, wavelength, speed, foam = '#cfe8dc') {
  const n = cols.length;
  for (let i = 0; i < n; i++) {
    const base = y0 + ((y1 - y0) * i) / n;
    const a = amp * (0.35 + (0.9 * i) / n);
    const wl = wavelength * (0.6 + (0.8 * i) / n);
    const phase = i * 1.7;
    ctx.fillStyle = cols[i];
    for (let x = 0; x < W; x++) {
      const arg = (x / wl) * 6.2832 + time * speed * (0.6 + i * 0.25) + phase;
      const y = base + Math.sin(arg) * a + Math.sin(arg * 2.3 + 1) * a * 0.3;
      ctx.fillRect(x, Math.round(y), 1, Math.ceil(y1 - y) + 1);
      if (foam && Math.cos(arg) > 0.9 && i > 0) {
        ctx.fillStyle = foam;
        ctx.fillRect(x, Math.round(y), 1, 1);
        if (i > 1 && Math.cos(arg) > 0.97) ctx.fillRect(x - 1, Math.round(y) + 1, 3, 1);
        ctx.fillStyle = cols[i];
      }
    }
  }
}
function mist(ctx, time, y, h, rgb, alpha, seedN, count = 5) {
  for (let i = 0; i < count; i++) {
    const w = 80 + hash(seedN + i) * 80;
    const x = ((hash(seedN + i + 9) * (W + 160) + time * (3 + hash(seedN + i + 17) * 5)) % (W + 160)) - 80;
    const yy = y + hash(seedN + i + 23) * h;
    const g = ctx.createRadialGradient(x, yy, 0, x, yy, w);
    g.addColorStop(0, `rgba(${rgb}, ${alpha})`);
    g.addColorStop(1, `rgba(${rgb}, 0)`);
    ctx.save();
    ctx.translate(0, yy);
    ctx.scale(1, 0.18);
    ctx.translate(0, -yy);
    ctx.fillStyle = g;
    ctx.fillRect(x - w, yy - w, w * 2, w * 2);
    ctx.restore();
  }
}
function vignette(ctx, height, rgb, alpha) {
  const g = ctx.createRadialGradient(W / 2, height * 0.5, 50, W / 2, height * 0.5, 230);
  g.addColorStop(0, `rgba(${rgb}, 0)`);
  g.addColorStop(1, `rgba(${rgb}, ${alpha})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, height);
}

// ---------- shapes ----------

// The Last Light: a tall black lighthouse crowned with broken spars.
function lastLight(ctx, x, baseY, s, color, glint = null) {
  const h = 78 * s;
  poly(ctx, color, [[x - 5 * s, baseY], [x - 3 * s, baseY - h], [x + 3 * s, baseY - h], [x + 5 * s, baseY]]);
  rect(ctx, color, x - 6 * s, baseY - h - 1, 12 * s, 3 * s);
  rect(ctx, color, x - 4 * s, baseY - h - 6 * s, 8 * s, 6 * s);
  // The crown: spikes and ribs at every angle.
  const spikes = [[-9, -14], [-6, -20], [-3, -24], [0, -28], [3, -22], [6, -18], [9, -13], [-12, -8], [12, -7]];
  for (const [dx, dy] of spikes) line(ctx, color, x + dx * 0.3 * s, baseY - h - 4 * s, x + dx * s, baseY - h + dy * s);
  line(ctx, color, x - 2 * s, baseY - h - 4 * s, x - 11 * s, baseY - h - 18 * s);
  line(ctx, color, x + 2 * s, baseY - h - 4 * s, x + 8 * s, baseY - h - 24 * s);
  // Ribs down the tower.
  for (let i = 1; i < 5; i++) rect(ctx, color, x - (4 + 0.4 * i) * s, baseY - (h * i) / 5, (8 + 0.8 * i) * s, Math.max(1, s));
  if (glint) rect(ctx, glint, x - 1, baseY - h - 2 * s, 2, 2);
}
// A mast with a yard and a tatter of sail that flaps; `lean` leans the top.
function mast(ctx, time, x, baseY, h, lean, color, sailColor, seedN) {
  const topX = x + lean;
  line(ctx, color, x, baseY, topX, baseY - h);
  line(ctx, color, x + 1, baseY, topX + 1, baseY - h);
  if (h > 40) line(ctx, color, x - 1, baseY, topX - 1, baseY - h);
  if (h > 24) {
    // Yard.
    const yy = baseY - h * 0.7;
    const yx = x + lean * 0.3;
    line(ctx, color, yx - h * 0.28, yy - 2, yx + h * 0.28, yy + 1);
    if (sailColor) {
      for (let i = 0; i < 9; i++) {
        const sx = yx - h * 0.26 + i * ((h * 0.52) / 8);
        const len = 8 + hash(seedN + i) * (h * 0.3);
        const sway = Math.round(Math.sin(time * 1.6 + i * 0.7 + seedN) * (1 + i * 0.15));
        rect(ctx, sailColor, sx, yy, 2, 1);
        for (let k = 1; k < len; k++) rect(ctx, sailColor, sx + sway * (k / len), yy + k, 2, 1);
      }
    }
    // A crow's nest.
    rect(ctx, color, topX - 3 + lean * 0.0, baseY - h * 0.88, 6, 3);
  }
}
// A hull on its side in the water, leaning: a smooth sheer line from a high
// bow down to the stern, one great bite out of it where the planking is gone
// (ribs poke up there), planking seams, a few portholes.
function hullSil(ctx, color, x, baseY, w, h, lean, bowLeft, seedN, ribColor) {
  const biteAt = 0.3 + hash(seedN) * 0.35;
  const topOf = (i) => {
    const t = i / (w - 1);
    const u = bowLeft ? t : 1 - t;
    // Bow is high, curving down to the stern; the bow end swoops up at the very tip.
    let top = baseY - h + Math.pow(u, 1.4) * h * 0.55 + lean * (0.5 - t);
    if (u < 0.08) top -= (0.08 - u) * h * 1.2;
    const bite = Math.max(0, 1 - Math.abs(t - biteAt) / 0.12);
    top += bite * bite * h * 0.45;
    return top;
  };
  for (let i = 0; i < w; i++) {
    const t = i / (w - 1);
    const u2 = Math.min(1, Math.min(t, 1 - t) / 0.3);
    const top = topOf(i);
    const bottom = baseY + 6 - Math.pow(1 - u2, 2) * h * 0.55;
    rect(ctx, color, x + i, top, 1, bottom - top);
    if (ribColor) rect(ctx, ribColor, x + i, top, 1, 1);
  }
  // Bowsprit stub, stern cabin with a window, rail posts.
  const dir = bowLeft ? -1 : 1;
  const bowI = bowLeft ? 0 : w - 1;
  const sternI = bowLeft ? w - 1 : 0;
  const bowTop = topOf(bowI);
  line(ctx, color, x + bowI, bowTop + 6, x + bowI + dir * 26, bowTop - 8);
  line(ctx, color, x + bowI, bowTop + 7, x + bowI + dir * 26, bowTop - 7);
  const cabX = x + sternI - (bowLeft ? 24 : 0);
  const cabTop = topOf(sternI) - 14;
  rect(ctx, color, cabX + (bowLeft ? 6 : 0), cabTop, 18, 16);
  if (ribColor) { rect(ctx, ribColor, cabX + (bowLeft ? 10 : 4), cabTop + 4, 3, 3); rect(ctx, ribColor, cabX + (bowLeft ? 16 : 10), cabTop + 4, 3, 3); }
  for (let i = 6; i < w - 30; i += 12) { const t = topOf(i); rect(ctx, color, x + i, t - 4, 1, 4); }
  if (ribColor) {
    for (let k = -2; k <= 3; k++) {
      const t = biteAt + k * 0.04;
      const i = Math.round(t * (w - 1));
      if (i < 3 || i > w - 3) continue;
      const base = topOf(i);
      const hh = 12 + hash(seedN + k) * 8;
      line(ctx, color, x + i, base + 2, x + i + k, base - hh);
      line(ctx, color, x + i + 1, base + 2, x + i + 1 + k, base - hh);
    }
    for (let i = 8; i < w - 8; i += 10) {
      const top = topOf(i);
      rect(ctx, ribColor, x + i, top + 4, 1, (baseY - top) * 0.7);
    }
    for (let i = 3; i < w - 3; i += 11) {
      const top = topOf(i);
      if (top < baseY - 14) { rect(ctx, ribColor, x + i, top + 10, 3, 3); }
    }
  }
}

// ---------- the happy beach ----------
function drawGullrest(ctx, time, height) {
  const horizon = 60;
  skyGradient(ctx, 0, horizon + 6, ['#4aa8e8', '#78c4f2', '#a8dcf8', '#d6f0fa']);
  // The sun and a few soft clouds going by.
  glow(ctx, 262, 30, 80, '255, 244, 190', 0.5);
  disc(ctx, '#fff6c8', 262, 30, 11);
  disc(ctx, '#ffffe8', 262, 30, 8);
  for (let i = 0; i < 5; i++) {
    const x = ((hash(i + 9100) * (W + 100) + time * (2 + hash(i + 9110) * 2)) % (W + 100)) - 50;
    const y = 12 + hash(i + 9120) * 30;
    for (let k = 0; k < 4; k++) oval(ctx, '#ffffff', x + k * 9 - 12, y + (k % 2) * -2, 11 - k, 4);
    oval(ctx, '#dff0fa', x, y + 3, 18, 2);
  }
  // A thin dark smudge on the far horizon: the weather, a long way off.
  const edge = cached('gull_edge', height, (c) => {
    for (let x = 220; x < W; x++) {
      const k = (x - 220) / 100;
      rect(c, '#3a5a5a', x, horizon - 3 - Math.sin(x * 0.2) * 1 - k * 5, 1, 4 + k * 5);
    }
  });
  ctx.globalAlpha = 0.55;
  ctx.drawImage(edge, 0, 0);
  ctx.globalAlpha = 1;
  // Far sea, bright, with glitter.
  sea(ctx, time, horizon, height, ['#3a9ac8', '#3088b8', '#2a7aaa', '#46a6c4', '#6cc4d0', '#9adcd4'], 1.2, 70, 1.2, '#f0fffc');
  for (let i = 0; i < 26; i++) {
    const x = hash(i + 9200) * W;
    const y = horizon + 3 + hash(i + 9210) * 36;
    if (Math.sin(time * 2 + i * 1.7) > 0.4) rect(ctx, '#ffffff', x, y, 2, 1);
  }
  // A little boat or two bobbing, with sails.
  for (const [bx, by, sc] of [[96, horizon + 10, 1], [168, horizon + 5, 0.7]]) {
    const bob = Math.sin(time * 1.5 + bx) * 1.4;
    poly(ctx, '#8a4a30', [[bx - 6 * sc, by + bob], [bx + 6 * sc, by + bob], [bx + 4 * sc, by + 3 * sc + bob], [bx - 4 * sc, by + 3 * sc + bob]]);
    rect(ctx, '#6a4a30', bx, by - 9 * sc + bob, 1, 9 * sc);
    poly(ctx, '#ffffff', [[bx + 1, by - 9 * sc + bob], [bx + 6 * sc, by - 1 + bob], [bx + 1, by - 1 + bob]]);
  }
  // Sand, wet where the waves come up.
  const shore = height - 52;
  rect(ctx, '#e8d29c', 0, shore, W, 60);
  for (let x = 0; x < W; x++) {
    const wash = Math.sin(x * 0.04 + time * 0.9) * 2 + Math.sin(time * 0.6) * 4;
    const y = shore + 4 + wash;
    rect(ctx, '#9adcd4', x, shore - 6, 1, y - shore + 6);
    rect(ctx, '#f6fff8', x, y, 1, 2);
    rect(ctx, '#cdb680', x, y + 2, 1, 5);
  }
  for (let i = 0; i < 40; i++) rect(ctx, i % 2 ? '#d4bc84' : '#f4e2b0', hash(i + 9300) * W, shore + 12 + hash(i + 9310) * 40, 2, 1);
  // Bunting strung across the top, waving, from two posts.
  const flags = ['#e8483c', '#ffd24a', '#4a9aea', '#58c86a', '#ffffff', '#ff7ac8'];
  rect(ctx, '#6a4a30', 4, 4, 3, shore - 6);
  rect(ctx, '#6a4a30', W - 7, 4, 3, shore - 6);
  rect(ctx, '#3a2a1c', 6, 4, 1, shore - 6);
  rect(ctx, '#3a2a1c', W - 5, 4, 1, shore - 6);
  cord(ctx, '#8a7448', 7, 6, W - 7, 6, 14);
  for (let i = 0; i < 24; i++) {
    const t = (i + 0.5) / 24;
    const x = 7 + t * (W - 14);
    const y = 6 + Math.sin(t * Math.PI) * 14;
    const sway = Math.round(Math.sin(time * 2.4 + i * 0.9));
    for (let r = 0; r < 6; r++) rect(ctx, flags[i % flags.length], x + (r > 3 ? sway : 0), y + 1 + r, 4 - Math.floor(r / 2), 1);
  }
  // Gulls.
  for (let i = 0; i < 4; i++) {
    const x = ((hash(i + 9400) * (W + 40) + time * (14 + hash(i + 9410) * 8)) % (W + 40)) - 20;
    const y = 30 + hash(i + 9420) * 40 + Math.sin(time * 1.4 + i) * 4;
    const up = Math.sin(time * 7 + i * 2) > 0 ? 1 : 0;
    rect(ctx, '#ffffff', x - 3, y - up, 3, 1);
    rect(ctx, '#ffffff', x, y - up, 3, 1);
    rect(ctx, '#b4c4d0', x - 1, y + 1 - up, 3, 1);
  }
}

// ---------- the storm scene (wrack, saltcombe, lanes, wreck, reach) ----------
// opts: { key, horizon, sky, clouds: [[colors, y0, y1, seedN, density, speed]...],
//   sea: { cols, amp, wl, speed, foam }, rain, rainColor, flash (period), lastLight: {x, s, color},
//   far(ctx, time, f), mid(ctx, time, f), near(ctx, time, f), fogRgb, fogAlpha, vignette }
function stormScene(ctx, time, height, o) {
  const fl = flashAt(time, o.flash, o.flashOffset ?? 0);
  skyGradient(ctx, 0, o.horizon + 4, o.sky);
  // Lightning lifts the whole sky for a frame or two.
  if (fl.f) rect(ctx, `rgba(215, 255, 225, ${(fl.f * 0.45).toFixed(3)})`, 0, 0, W, o.horizon + 4);
  o.clouds.forEach(([colors, y0, y1, seedN, density, speed], i) => {
    drift(ctx, cloudStrip(`${o.key}_cl${i}`, height, y0, y1, colors, seedN, density), time, speed);
  });
  if (fl.f) rect(ctx, `rgba(215, 255, 225, ${(fl.f * 0.18).toFixed(3)})`, 0, 0, W, o.horizon);
  if (fl.f > 0.5 && fl.p < 0.3 && o.bolt !== false) bolt(ctx, 40 + hash(fl.n * 3.1) * 240, 0, o.horizon - 2, fl.n * 17, '#f4fff6');
  if (o.horizonGlow) glow(ctx, o.horizonGlow[0], o.horizon, o.horizonGlow[1], o.horizonGlow[2], o.horizonGlow[3]);
  if (o.lastLight) lastLight(ctx, o.lastLight.x, o.horizon + (o.lastLight.dy ?? 4), o.lastLight.s, o.lastLight.color, fl.f > 0.5 ? '#ffffff' : null);
  o.far?.(ctx, time, fl.f);
  if (o.fogRgb) mist(ctx, time, o.horizon - 6, 14, o.fogRgb, o.fogAlpha ?? 0.5, 31, 7);
  sea(ctx, time, o.horizon, height, o.sea.cols, o.sea.amp, o.sea.wl, o.sea.speed, o.sea.foam);
  // Lightning on the water.
  if (fl.f) rect(ctx, `rgba(215, 255, 225, ${(fl.f * 0.16).toFixed(3)})`, 0, o.horizon, W, height - o.horizon);
  o.mid?.(ctx, time, fl.f);
  if (o.fogRgb) mist(ctx, time, o.horizon + 8, o.sea.fogDepth ?? 40, o.fogRgb, (o.fogAlpha ?? 0.5) * 0.7, 61, 6);
  rain(ctx, time, height, Math.round(o.rain * 0.6), o.rainColor, 150, 1, 100, 0.8);
  o.near?.(ctx, time, fl.f);
  rain(ctx, time, height, Math.round(o.rain * 0.4), o.rainColor, 230, 1.4, 300, 1.4);
  if (o.vignette) vignette(ctx, height, o.vignette[0], o.vignette[1]);
}

const STORM_SEA = (a, b, c, d, e, f) => [a, b, c, d, e, f];

// Tidepools and a rocky shelf in the foreground.
function rockShelf(ctx, time, y, key, height, rock, pool) {
  const sprite = cached(key, height, (c) => {
    for (let x = 0; x < W; x++) {
      const top = y + Math.round(Math.sin(x * 0.07) * 2 + Math.sin(x * 0.21 + 1) * 1.5);
      rect(c, rock[0], x, top, 1, height - top);
      rect(c, rock[1], x, top, 1, 2);
    }
    for (let i = 0; i < 70; i++) rect(c, rock[2], hash(i + 500) * W, y + 4 + hash(i + 510) * (height - y - 6), 2 + (i % 3), 1);
  });
  ctx.drawImage(sprite, 0, 0);
  for (const [px, py, rw] of [[60, y + 12, 22], [160, y + 20, 30], [250, y + 10, 20]]) {
    oval(ctx, pool[0], px, py, rw, 4);
    oval(ctx, pool[1], px, py, rw - 2, 3);
    const gl = Math.sin(time * 1.6 + px) * 0.5 + 0.5;
    rect(ctx, pool[2], px - rw / 2 + gl * rw * 0.7, py - 1, 3, 1);
  }
}

// ---------- the Wrack Shore: the storm starts ----------
function drawWrack(ctx, time, height) {
  stormScene(ctx, time, height, {
    key: 'wrack', horizon: 62, flash: 11,
    sky: ['#1c4a4e', '#2c6258', '#4a8062', '#86a870', '#c4c88c'],
    clouds: [[['#244a50', '#2c5a58'], 4, 34, 1000, 9, 4], [['#173a40', '#1e464a'], 14, 52, 1100, 8, 8]],
    sea: { cols: STORM_SEA('#3c7266', '#2e625c', '#245450', '#1c4848', '#143c3c', '#0e3034'), amp: 2, wl: 80, speed: 1.4 },
    rain: 70, rainColor: 'rgba(200, 235, 225, 0.4)',
    lastLight: { x: 262, s: 0.55, color: '#142628' },
    fogRgb: '170, 205, 180', fogAlpha: 0.35,
    near: (c, t) => rockShelf(c, t, height - 40, 'wrack_rock', height, ['#26323a', '#3c4e54', '#52666a'], ['#1c4848', '#2c6c68', '#a8e0d4']),
    vignette: ['4, 14, 16', 0.5],
  });
  // A rotted jetty stub and a washed-up bell buoy.
  const sway = Math.sin(time * 1.1) * 1.2;
  rect(ctx, '#1a1c1c', 30, height - 70, 3, 24);
  rect(ctx, '#1a1c1c', 50, height - 66, 3, 20);
  rect(ctx, '#2a2a28', 24, height - 72, 40, 3);
  rect(ctx, '#1a1c1c', 70, height - 74, 22, 2);
  oval(ctx, '#7a2a24', 292, height - 52 + sway, 5, 5);
  rect(ctx, '#2a2a2a', 291, height - 62 + sway, 2, 6);
}

// ---------- Saltcombe's edge: lamplit stilt houses in the storm ----------
function drawSaltcombe(ctx, time, height) {
  stormScene(ctx, time, height, {
    key: 'salt', horizon: 66, flash: 14, flashOffset: 3,
    sky: ['#143e44', '#245850', '#3e7658', '#6e9c68'],
    clouds: [[['#1c464a', '#26564f'], 4, 34, 2000, 8, 3], [['#12343a', '#183e42'], 18, 56, 2100, 7, 6]],
    sea: { cols: STORM_SEA('#1c4a48', '#16403f', '#103638', '#0c2e32', '#0a262c', '#081e24'), amp: 1.4, wl: 70, speed: 1.1, foam: '#8cb8a8' },
    rain: 80, rainColor: 'rgba(190, 225, 215, 0.38)',
    lastLight: { x: 40, s: 0.45, color: '#0c1c20' },
    fogRgb: '120, 160, 140', fogAlpha: 0.3,
    mid(c, t) {
      // Stilt houses: black shapes, windows warm, lamps on strings, reflections.
      const houses = [[18, 66, 56, 28], [96, 72, 46, 24], [168, 62, 62, 32], [250, 70, 52, 26]];
      houses.forEach(([x, by, w, h], i) => {
        const top = by - h;
        for (let k = 0; k < 4; k++) rect(c, '#08141a', x + 4 + k * ((w - 8) / 3), by, 3, 18);
        for (let k = 0; k < 3; k++) rect(c, '#0c1c22', x + 6 + k * 10, by + 6 + k * 2, 8, 1);
        rect(c, '#0a1a20', x, top + 8, w, h - 8);
        poly(c, '#07121a', [[x - 3, top + 9], [x + w / 2, top - 4], [x + w + 3, top + 9]]);
        for (let k = 0; k < 2 + (w > 50 ? 1 : 0); k++) {
          const wx = x + 6 + k * ((w - 14) / (w > 50 ? 2 : 1));
          const flick = 0.85 + Math.sin(t * 3 + i * 3 + k) * 0.08;
          rect(c, `rgba(255, 205, 110, ${flick.toFixed(2)})`, wx, top + 14, 6, 6);
          rect(c, 'rgba(255, 240, 180, 0.9)', wx + 2, top + 15, 2, 3);
          glow(c, wx + 3, top + 17, 18, '255, 190, 90', 0.28);
          // A reflection wobbling in the water below.
          for (let r = 0; r < 8; r++) rect(c, `rgba(255, 190, 90, ${(0.3 - r * 0.03).toFixed(2)})`, wx + Math.sin(t * 2 + r) * 1.5, by + 20 + r * 3, 5, 2);
        }
      });
      for (let i = 0; i < 4; i++) {
        const [x, by, w] = houses[i];
        const nx = houses[(i + 1) % 4][0];
        if (i < 3) {
          cord(c, '#1a2a2a', x + w - 2, by - 24, nx + 2, houses[i + 1][1] - 24, 6);
          for (let k = 1; k < 5; k++) {
            const tt = k / 5;
            const lx = x + w + (nx - x - w) * tt;
            const ly = by - 24 + (houses[i + 1][1] - by) * tt + Math.sin(tt * Math.PI) * 6 + 1;
            rect(c, '#ffe08a', lx, ly, 2, 2);
            glow(c, lx + 1, ly + 1, 9, '255, 210, 120', 0.35 + Math.sin(t * 3 + k + i) * 0.08);
          }
        }
      }
      // A boardwalk at the water line and mooring posts.
      rect(c, '#0a1a20', 0, 96, W, 3);
      for (let x = 6; x < W; x += 30) rect(c, '#0a1a20', x, 84, 3, 16);
    },
    near(c, t) {
      rect(c, '#06121a', 0, height - 24, W, 24);
      for (let x = 0; x < W; x++) rect(c, '#0a1c24', x, height - 24 + Math.round(Math.sin(x * 0.2 + t * 0.8)), 1, 2);
    },
    vignette: ['2, 10, 14', 0.55],
  });
}

// ---------- the Sunken Lanes: drowned roads ----------
function drawLanes(ctx, time, height) {
  stormScene(ctx, time, height, {
    key: 'lanes', horizon: 58, flash: 16, flashOffset: 5,
    sky: ['#1a4a48', '#2c6458', '#52845e', '#98b472'],
    clouds: [[['#244e4c', '#2e5e56'], 4, 30, 3000, 8, 3], [['#16403c', '#1c4a44'], 16, 46, 3100, 7, 5]],
    sea: { cols: STORM_SEA('#4a7a68', '#3e6c60', '#345e58', '#2a5250', '#224848', '#1a3c3e'), amp: 0.8, wl: 90, speed: 0.8, foam: '#a8c8b8', fogDepth: 60 },
    rain: 90, rainColor: 'rgba(190, 225, 215, 0.4)',
    lastLight: { x: 290, s: 0.4, color: '#1a3430' },
    fogRgb: '150, 190, 160', fogAlpha: 0.4,
    far(c, t) {
      // Church tower and chimney tops sticking out of the flood.
      poly(c, '#16302e', [[108, 62], [108, 36], [112, 28], [116, 36], [116, 62]]);
      rect(c, '#16302e', 104, 50, 16, 12);
      rect(c, '#2a4a40', 110, 42, 2, 5);
      rect(c, '#16302e', 168, 54, 3, 8);
      rect(c, '#16302e', 188, 52, 3, 10);
    },
    mid(c, t) {
      // A road running under the water into the distance: its two banks, hedge tufts, fence posts.
      const roadL = (y) => 150 - (y - 60) * 1.15;
      const roadR = (y) => 170 + (y - 60) * 1.35;
      poly(c, 'rgba(196, 214, 176, 0.13)', [[148, 60], [172, 60], [roadR(140), 140], [roadL(140), 140]]);
      for (let y = 62; y < 140; y += 2) {
        rect(c, 'rgba(210, 228, 190, 0.28)', roadL(y), y, 1, 1);
        rect(c, 'rgba(210, 228, 190, 0.28)', roadR(y), y, 1, 1);
      }
      for (let i = 0; i < 9; i++) {
        const y = 64 + i * i * 1.1 + i * 3;
        const k = (y - 60) / 80;
        for (const [x, dir] of [[roadL(y), -1], [roadR(y), 1]]) {
          oval(c, '#17352c', x + dir * (4 + k * 4), y - 1, 3 + k * 5, 1 + k * 2);
          if (i % 2) rect(c, '#101e1c', x + dir * (10 + k * 10), y - 7 - k * 6, 2, 8 + k * 6);
        }
        rect(c, 'rgba(210, 228, 190, 0.25)', 158 + k * 2, y, 3 + k * 2, 1);
      }
      // A half-sunk cottage on the left, a signpost on the right.
      poly(c, '#10242a', [[14, 80], [14, 70], [40, 56], [66, 70], [66, 80]]);
      rect(c, '#10242a', 20, 70, 40, 12);
      rect(c, '#ffd88a', 28, 72, 5, 5);
      glow(c, 30, 74, 14, '255, 200, 110', 0.25 + Math.sin(t * 3) * 0.05);
      rect(c, '#10242a', 292, 56, 3, 26);
      rect(c, '#10242a', 282, 60, 16, 4);
      rect(c, '#10242a', 290, 68, 14, 4);
      for (let i = 0; i < 18; i++) {
        const x = 12 + i * 18;
        const y = 76 + hash(i + 3300) * 10;
        const r = (t * 0.7 + hash(i + 3310)) % 1;
        ctx.strokeStyle = `rgba(190, 225, 215, ${(0.4 * (1 - r)).toFixed(2)})`;
        ctx.strokeRect(Math.round(x - r * 5), Math.round(y - r), Math.round(r * 10), 1);
      }
    },
    near(c, t) {
      // Fence posts in the foreground water, ripples around them.
      for (const [x, y] of [[20, height - 36], [96, height - 28], [214, height - 30], [292, height - 38]]) {
        rect(c, '#0c1c1c', x, y - 22, 4, 24);
        rect(c, '#1c3030', x, y - 22, 1, 24);
        const r = Math.abs(Math.sin(t * 1.2 + x));
        rect(c, `rgba(190, 225, 215, ${(0.5 - r * 0.3).toFixed(2)})`, x - 3 - r * 3, y + 1, 10 + r * 6, 1);
      }
    },
    vignette: ['4, 14, 14', 0.5],
  });
}

// ---------- the Wreck Yard: the ship graveyard under the green storm ----------
function drawWreck(ctx, time, height) {
  const hz = 64;
  stormScene(ctx, time, height, {
    key: 'wreck', horizon: hz, flash: 8.5, flashOffset: 2,
    sky: ['#04181c', '#0a2c2c', '#14483a', '#2a7046', '#68a050', '#b8c868'],
    clouds: [
      [['#06222a', '#0a2e30', '#0e3a36'], 2, 40, 4000, 10, 4],
      [['#0c2e2e', '#134038', '#1a5240'], 12, 52, 4100, 9, 8],
      [['#2a6a46', '#3a8450'], 40, hz - 2, 4200, 6, 12],
    ],
    horizonGlow: [200, 8, '190, 220, 110', 0.35],
    sea: { cols: STORM_SEA('#2a5c44', '#1c4a3c', '#143c34', '#0e3030', '#0a2628', '#071c20'), amp: 2.4, wl: 64, speed: 1.9, foam: '#a6d4b0', fogDepth: 50 },
    rain: 150, rainColor: 'rgba(190, 235, 215, 0.45)',
    lastLight: { x: 248, s: 0.75, color: '#08181a' },
    fogRgb: '120, 170, 120', fogAlpha: 0.5,
    far(c, t, f) {
      // The graveyard in the distance: many masts and hulls, faint in the haze.
      const haze = f > 0.3 ? '#1e3a30' : '#315a40';
      for (const [x, h, lean] of [[8, 30, 5], [38, 22, -4], [64, 36, 6], [112, 24, -3], [150, 40, 4], [186, 26, -5], [214, 34, 3], [292, 28, -6], [312, 38, 4]]) {
        mast(c, t, x, hz + 3, h, lean, haze, null, x);
        line(c, haze, x, hz - h * 0.7, x + lean * 3, hz + 3);
      }
      for (const [x, w, h, b] of [[24, 40, 12, true], [124, 34, 10, false], [270, 38, 12, true]]) hullSil(c, haze, x, hz + 4, w, h, 3, b, x, null);
    },
    mid(c, t, f) {
      const dark = f > 0.4 ? '#0a1e1c' : '#041214';
      const rib = f > 0.4 ? '#183a30' : '#0a2420';
      const sail = f > 0.4 ? '#2a4a3a' : '#0e2a24';
      // Left: a big hull heeled over, its two masts snapped and rigging trailing.
      hullSil(c, dark, -22, hz + 46, 124, 62, -20, false, 11, rib);
      mast(c, t, 26, hz + 12, 62, -10, dark, sail, 3);
      mast(c, t, 64, hz + 14, 44, 8, dark, sail, 7);
      cord(c, dark, 26, hz - 50, 80, hz + 12, 14);
      cord(c, dark, 34, hz - 46, 70, hz + 12, 10);
      // Right: a larger hull, bow high, a splintered bowsprit, and a mast with a crow's nest.
      hullSil(c, dark, 200, hz + 50, 126, 70, 22, true, 23, rib);
      mast(c, t, 262, hz + 16, 70, 12, dark, sail, 5);
      line(c, dark, 322, hz + 6, 336, hz - 6);
      cord(c, dark, 262, hz - 56, 316, hz + 10, 12);
      // Middle, low and small: a broken mast, a barrel ring on top, a glint of star.
      mast(c, t, 150, hz + 20, 34, 3, dark, null, 9);
      const tw = Math.sin(t * 4) > 0.55;
      if (tw) { rect(c, '#fff4b8', 153, hz - 16, 2, 2); rect(c, '#ffe27a', 152, hz - 15, 4, 1); rect(c, '#ffe27a', 153, hz - 17, 2, 4); }
      glow(c, 154, hz - 15, 8, '255, 226, 140', tw ? 0.45 : 0.15);
      // Planks and a barrel drifting at the middle distance.
      for (const [x, y] of [[104, hz + 30], [190, hz + 36], [140, hz + 46]]) {
        const bob = Math.sin(t * 1.3 + x) * 1.5;
        rect(c, dark, x, y + bob, 16, 2);
        rect(c, rib, x + 3, y - 1 + bob, 2, 1);
      }
    },
    near(c, t, f) {
      // Foreground: black timbers and chain, close to the screen edges.
      const dark = '#020a0c';
      const lift = f > 0.4 ? '#122826' : dark;
      // Left snapped mast, right chain from a high stump.
      poly(c, lift, [[0, 0], [14, 0], [16, 34], [11, height - 30], [0, height - 30]]);
      for (let y = 18; y < height - 40; y += 16) line(c, '#0e2420', 0, y + 4, 14, y);
      cord(c, lift, 14, 8, 60, 52, 12);
      cord(c, lift, 14, 18, 44, 58, 8);
      poly(c, lift, [[W - 6, 0], [W, 0], [W, height - 30], [W - 16, height - 30]]);
      // A tatter of sail snapping from the right.
      for (let i = 0; i < 12; i++) {
        const sw = Math.sin(t * 2.2 + i * 0.5) * (2 + i * 0.3);
        rect(c, lift, W - 7 - i * 2 + sw * 0.3, 16 + i * 3, 7 + i, 3);
      }
      // A chain hanging from the right with a hook.
      for (let k = 0; k < 14; k++) rect(c, '#0c1818', W - 30 + Math.sin(t * 0.8 + k * 0.4) * 1.5, k * 4 + 6, 2, 3);
      // Black foreground swell and spray.
      for (let x = 0; x < W; x++) {
        const y = height - 22 + Math.sin(x * 0.09 + t * 1.6) * 3 + Math.sin(x * 0.23 + t * 2.1) * 1.4;
        rect(c, '#050f12', x, y, 1, height - y);
        if (Math.sin(x * 0.09 + t * 1.6) > 0.92) rect(c, '#9ec8ac', x, y - 1, 2, 1);
      }
    },
    vignette: ['0, 6, 6', 0.7],
  });
}

// ---------- the Storm Reach: open sea, huge waves ----------
function drawReach(ctx, time, height) {
  const hz = 54;
  stormScene(ctx, time, height, {
    key: 'reach', horizon: hz, flash: 9, flashOffset: 6,
    sky: ['#04181c', '#0a2c2e', '#14463c', '#2c6c48', '#58944e', '#98b862'],
    clouds: [
      [['#06202a', '#0a2c30', '#0e3636'], 2, 34, 5000, 10, 6],
      [['#0c2e2e', '#143e38', '#1a5040'], 10, 46, 5100, 9, 11],
    ],
    horizonGlow: [150, 8, '190, 220, 110', 0.3],
    sea: { cols: STORM_SEA('#245a44', '#1a4a3e', '#123c36', '#0c3030', '#082628', '#051c20'), amp: 6, wl: 120, speed: 2.1, foam: '#c0e4cc', fogDepth: 70 },
    rain: 160, rainColor: 'rgba(190, 235, 215, 0.45)',
    lastLight: { x: 160, s: 0.6, color: '#061416', dy: 6 },
    fogRgb: '120, 170, 120', fogAlpha: 0.45,
    mid(c, t) {
      // Haddock's little boat, tiny, riding a wave far off.
      const bx = 78;
      const by = 86 + Math.sin(t * 1.1 + 2) * 4;
      const tilt = Math.cos(t * 1.1 + 2) * 2;
      poly(c, '#0a1c1a', [[bx - 7, by - tilt], [bx + 7, by + tilt], [bx + 4, by + 4], [bx - 4, by + 4]]);
      rect(c, '#0a1c1a', bx, by - 9, 1, 9);
      poly(c, '#6a7a6a', [[bx + 1, by - 9], [bx + 6, by - 1], [bx + 1, by - 1]]);
      rect(c, '#ffd88a', bx - 5, by - 3, 2, 2);
      glow(c, bx - 4, by - 2, 8, '255, 200, 110', 0.4);
    },
    near(c, t) {
      // Big rolling swells in front, with spray flying off the crests.
      for (let layer = 0; layer < 2; layer++) {
        const y0 = height - 30 + layer * 8;
        for (let x = 0; x < W; x++) {
          const arg = x * 0.035 + t * (1.2 + layer * 0.5) + layer * 2;
          const y = y0 + Math.sin(arg) * (8 - layer * 2) + Math.sin(arg * 2.1) * 2;
          rect(c, layer ? '#04141a' : '#082a2c', x, y, 1, height - y);
          if (Math.cos(arg) > 0.95) {
            rect(c, '#cfe8d8', x, y - 1, 2, 2);
            for (let s = 0; s < 3; s++) rect(c, 'rgba(220, 245, 230, 0.7)', x + s * 2 - 2, y - 3 - ((t * 20 + s * 5 + x) % 7), 1, 1);
          }
        }
      }
    },
    vignette: ['0, 8, 8', 0.65],
  });
}

// ---------- the Soundings: a sea cave with the tide in it ----------
function drawSoundings(ctx, time, height) {
  skyGradient(ctx, 0, height, ['#06141a', '#0a2028', '#0e2c34', '#12383e']);
  // The mouth of the cave far off: a pale green-grey sea beyond it.
  const mouth = cached('sound_mouth', height, (c) => {
    oval(c, '#2c5a56', 160, 66, 40, 26);
    oval(c, '#4a8a7c', 160, 64, 34, 21);
    oval(c, '#9ac8b0', 160, 60, 22, 11);
    rect(c, '#9ac8b0', 138, 66, 44, 3);
  });
  ctx.drawImage(mouth, 0, 0);
  const hz = 68;
  for (let x = 126; x < 194; x++) rect(ctx, 'rgba(210,245,230,0.8)', x, hz + Math.round(Math.sin(x * 0.2 + time * 2) * 1), 1, 1);
  // Walls: dark rock closing in from both sides, with ridges.
  const rock = cached('sound_rock', height, (c) => {
    for (let y = 0; y < height; y++) {
      const wl = 70 + Math.sin(y * 0.09) * 10 + Math.sin(y * 0.31 + 1) * 3 - (y > 70 ? (y - 70) * 0.35 : 0);
      const wr = 250 - Math.sin(y * 0.08 + 2) * 10 - Math.sin(y * 0.29) * 3 + (y > 70 ? (y - 70) * 0.35 : 0);
      rect(c, '#071c26', 0, y, Math.max(0, wl), 1);
      rect(c, '#071c26', Math.min(W, wr), y, W - Math.min(W, wr), 1);
      rect(c, '#1a3c4c', Math.max(0, wl - 3), y, 3, 1);
      rect(c, '#1a3c4c', wr, y, 3, 1);
      if (y % 7 === 0) { rect(c, '#08181f', Math.max(0, wl - 22), y, 22, 1); rect(c, '#08181f', wr + 3, y, 22, 1); }
    }
    // The roof: a dark arch with stalactites.
    for (let x = 0; x < W; x++) {
      const t = (x - 160) / 160;
      const top = 14 + t * t * 34 + Math.sin(x * 0.4) * 2;
      rect(c, '#04101a', x, 0, 1, Math.round(top));
      rect(c, '#0c2230', x, Math.round(top), 1, 1);
    }
    for (let i = 0; i < 14; i++) {
      const x = 30 + hash(i + 5600) * 260;
      const t = (x - 160) / 160;
      const top = 14 + t * t * 34;
      const len = 6 + hash(i + 5610) * 22;
      poly(c, '#06161e', [[x - 3, top], [x + 3, top], [x, top + len]]);
      rect(c, '#14323c', x - 2, top, 1, len * 0.5);
    }
  });
  ctx.drawImage(rock, 0, 0);
  // Slow light shafts from the roof's cracks.
  for (let i = 0; i < 2; i++) {
    const x = 90 + i * 130;
    const a = 0.05 + Math.sin(time * 0.5 + i * 2) * 0.02;
    poly(ctx, `rgba(180, 235, 220, ${a.toFixed(3)})`, [[x, 0], [x + 14, 0], [x + 44 + i * 10, 120], [x + 10, 120]]);
  }
  // The tide water: rises and falls slowly, with glowing algae specks in it.
  const level = 94 + Math.sin(time * 0.35) * 5;
  for (let x = 0; x < W; x++) {
    const y = level + Math.sin(x * 0.06 + time * 1.6) * 1.5 + Math.sin(x * 0.17 + time) * 0.8;
    rect(ctx, '#0e3a42', x, y, 1, height - y);
    rect(ctx, '#2a7a7c', x, y, 1, 1);
    if (Math.cos(x * 0.06 + time * 1.6) > 0.96) rect(ctx, '#a8e8d8', x, y - 1, 2, 1);
  }
  for (let i = 0; i < 4; i++) {
    const y = level + 8 + i * 14;
    for (let x = 0; x < W; x += 2) if (Math.sin(x * 0.2 + time * (1 + i * 0.3) + i) > 0.97) rect(ctx, '#3a9a98', x, y, 3, 1);
  }
  for (let i = 0; i < 18; i++) {
    const x = hash(i + 5700) * W;
    const y = level + 6 + hash(i + 5710) * (height - level - 12);
    const tw = Math.sin(time * 1.5 + i * 2.3);
    if (tw > 0.2) {
      rect(ctx, '#7af0d0', x, y, 1, 1);
      if (tw > 0.8) glow(ctx, x, y, 6, '120, 255, 220', 0.4);
    }
  }
  // Drips falling from the stalactites into rings in the water.
  for (let i = 0; i < 4; i++) {
    const x = 70 + i * 62 + hash(i + 5800) * 14;
    const cycle = 2.4 + i * 0.5;
    const p = ((time + i * 0.9) % cycle) / cycle;
    const top = 30 + (x > 200 ? 10 : 0);
    if (p < 0.5) rect(ctx, '#a8e8f0', x, top + p * 2 * (level - top), 1, 2);
    else {
      const r = (p - 0.5) * 2;
      rect(ctx, `rgba(168, 232, 240, ${(0.7 * (1 - r)).toFixed(2)})`, x - r * 8, level + 2 + i, r * 16, 1);
    }
  }
  mist(ctx, time, level - 8, 10, '100, 170, 160', 0.25, 77, 4);
  vignette(ctx, height, '0, 4, 8', 0.65);
}

// ---------- the Beacon Isles and Haddock's Light: little lights ----------
function drawIsles(ctx, time, height, home = false) {
  const hz = 64;
  skyGradient(ctx, 0, hz + 4, ['#0c3038', '#18504a', '#2c7050', '#5c9a60', '#a0c476']);
  drift(ctx, cloudStrip('isles_cl0', height, 4, 40, ['#164448', '#1e544e'], 6000, 8), time, 3);
  drift(ctx, cloudStrip('isles_cl1', height, 18, 54, ['#103a40', '#18484a'], 6100, 7), time, 5);
  // A few early stars through the thinning cloud.
  for (let i = 0; i < 14; i++) {
    const tw = Math.sin(time * 1.3 + i * 1.9);
    if (tw > 0.1) rect(ctx, '#e8fff0', hash(i + 6200) * W, 4 + hash(i + 6210) * 30, 1, 1);
  }
  sea(ctx, time, hz, height, ['#2c6458', '#22544e', '#1a4646', '#143a3c', '#0e2e34', '#0a252c'], 1.6, 70, 1.2, '#9cc8b8');
  // Little islands, each with a lighthouse that is lit (or about to be).
  const isles = [[28, 12, 0.5], [92, 8, 0.38], [214, 10, 0.44], [286, 14, 0.55]];
  isles.forEach(([x, r, s], i) => {
    const by = hz + 4 + (i % 2) * 3;
    oval(ctx, '#0a1c20', x, by, r + 8, 4);
    poly(ctx, '#0c2024', [[x - 6, by], [x - 3, by - 3], [x + 4, by - 3], [x + 8, by]]);
    const hh = 26 * s * 2;
    poly(ctx, '#0a1c20', [[x - 3 * s * 2, by - 3], [x - 2 * s * 2, by - 3 - hh], [x + 2 * s * 2, by - 3 - hh], [x + 3 * s * 2, by - 3]]);
    rect(ctx, '#0a1c20', x - 3, by - 3 - hh - 4, 6, 4);
    const lit = Math.sin(time * 0.7 + i * 1.7) > -0.5;
    const on = lit ? 1 : 0.35;
    rect(ctx, `rgba(255, 214, 120, ${on})`, x - 2, by - 3 - hh - 3, 4, 3);
    glow(ctx, x, by - 3 - hh - 2, 22, '255, 210, 120', 0.5 * on);
    // A slow beam of light.
    const sweep = Math.sin(time * 0.6 + i) * 30;
    poly(ctx, `rgba(255, 230, 160, ${(0.08 * on).toFixed(3)})`, [[x, by - 3 - hh - 2], [x + sweep + 50, by - 3 - hh - 12], [x + sweep + 50, by - 3 - hh + 10]]);
    // The light on the water.
    for (let k = 0; k < 6; k++) rect(ctx, `rgba(255, 210, 120, ${(0.3 * on - k * 0.04).toFixed(2)})`, x - 2 + Math.sin(time * 2 + k) * 2, by + 3 + k * 3, 4, 1);
  });
  // A rope bridge between the two left isles, swaying; the sea comes up in the middle ground.
  cord(ctx, '#0a1c20', 36, hz - 4, 86, hz - 4, 4 + Math.sin(time) * 0.8);
  cord(ctx, '#0a1c20', 36, hz - 7, 86, hz - 7, 4 + Math.sin(time) * 0.8);
  if (home) {
    // Haddock's tall light at the right edge, a warm window below the lamp.
    poly(ctx, '#071418', [[W - 54, height - 20], [W - 46, 24], [W - 28, 24], [W - 20, height - 20]]);
    rect(ctx, '#071418', W - 50, 12, 26, 12);
    rect(ctx, 'rgba(255, 230, 150, 0.95)', W - 45, 14, 16, 8);
    glow(ctx, W - 37, 18, 50, '255, 220, 130', 0.6);
    rect(ctx, '#ffd070', W - 40, height - 70, 6, 8);
    glow(ctx, W - 37, height - 66, 18, '255, 200, 100', 0.4);
    poly(ctx, 'rgba(255, 230, 160, 0.07)', [[W - 37, 18], [0, 4], [0, 44]]);
  }
  mist(ctx, time, hz - 4, 12, '150, 190, 170', 0.3, 91, 5);
  // Foreground rocks with weed, and light rain.
  for (let x = 0; x < W; x++) {
    const y = height - 22 + Math.sin(x * 0.07) * 3 + Math.sin(x * 0.19) * 1.5;
    rect(ctx, '#071418', x, y, 1, height - y);
    if (Math.sin(x * 0.07 + time * 1.4) > 0.94) rect(ctx, '#9cc8b8', x, y - 1, 2, 1);
  }
  rain(ctx, time, height, 40, 'rgba(200, 235, 225, 0.3)', 150, 1, 700, 0.8);
  vignette(ctx, height, '2, 12, 14', 0.5);
}

// ---------- the Last Light: the lamp room at the top ----------
function drawLastLight(ctx, time, height) {
  const fl = flashAt(time, 7.5, 1);
  // Outside, seen through the glass all round: green storm sky.
  skyGradient(ctx, 0, height, ['#04181c', '#0a2c2c', '#14483a', '#2a7046', '#58944c']);
  if (fl.f) rect(ctx, `rgba(215, 255, 225, ${(fl.f * 0.5).toFixed(3)})`, 0, 0, W, height);
  drift(ctx, cloudStrip('lastlight_cl', height, 4, 70, ['#06222a', '#0c3434', '#144238'], 7000, 12), time, 9);
  if (fl.f > 0.5 && fl.p < 0.3) bolt(ctx, 60 + hash(fl.n * 5.3) * 200, 0, 90, fl.n * 13, '#f4fff6');
  // Waves far below, hardly visible.
  for (let x = 0; x < W; x++) {
    const y = 118 + Math.sin(x * 0.05 + time * 1.4) * 3;
    rect(ctx, '#0a2c2c', x, y, 1, height - y);
    if (Math.sin(x * 0.05 + time * 1.4) > 0.93) rect(ctx, '#8cc8a8', x, y - 1, 2, 1);
  }
  rain(ctx, time, height, 130, 'rgba(200, 235, 225, 0.5)', 220, 1.5, 800, 1.2);
  // The great lens at the back, turning: its beam sweeps across the room.
  const cx = 160;
  const cy = 74;
  const sweep = (time * 0.5) % 6.2832;
  const bx = Math.cos(sweep);
  glow(ctx, cx, cy, 90, '255, 240, 190', 0.55);
  glow(ctx, cx, cy, 36, '255, 252, 225', 0.8);
  const beamW = 8 + Math.abs(bx) * 40;
  poly(ctx, `rgba(255, 244, 200, ${(0.14 * (0.4 + Math.abs(bx) * 0.6)).toFixed(3)})`, [[cx, cy], [cx + bx * 200, cy - 20 - beamW], [cx + bx * 200, cy + 20 + beamW]]);
  // The lens: a barrel of glass rings.
  oval(ctx, '#3a2a0c', cx, cy, 38, 40);
  oval(ctx, '#b88a28', cx, cy, 36, 38);
  for (let r = 36; r > 6; r -= 5) oval(ctx, r % 10 === 6 ? '#e8f4d8' : '#8cc8c0', cx, cy, r - 2, r - 1);
  oval(ctx, '#ffffff', cx, cy, 8, 8);
  oval(ctx, '#fff6c8', cx, cy, 5, 5);
  rect(ctx, '#d8a838', cx - 40, cy - 1, 80, 3);
  rect(ctx, '#6a4a14', cx - 18, cy + 40, 36, 14);
  // A glint sliding over the glass.
  const gx = cx - 30 + ((time * 22) % 60);
  for (let y = cy - 30; y < cy + 30; y++) rect(ctx, 'rgba(255,255,255,0.75)', gx + (y - cy) / 4, y, 2, 1);
  // Window frames: brass mullions all round, rain streaks on the glass.
  for (const x of [26, 94, 226, 294]) {
    rect(ctx, '#2a1c08', x - 2, 0, 6, 120);
    rect(ctx, '#a07820', x - 1, 0, 3, 120);
    rect(ctx, '#e8c860', x - 1, 0, 1, 120);
  }
  rect(ctx, '#2a1c08', 0, 118, W, 4);
  rect(ctx, '#a07820', 0, 119, W, 2);
  for (let i = 0; i < 16; i++) {
    const x = hash(i + 7100) * W;
    const y = (hash(i + 7110) * 120 + time * (8 + hash(i + 7120) * 8)) % 120;
    rect(ctx, 'rgba(190, 235, 225, 0.5)', x, y, 1, 4);
  }
  // The floor: iron grating, a rail, the room's lamp stand and brass bands.
  rect(ctx, '#0a1014', 0, 122, W, height - 122);
  for (let y = 124; y < height; y += 6) rect(ctx, '#1a242c', 0, y, W, 1);
  for (let x = 0; x < W; x += 10) rect(ctx, '#141c24', x, 122, 2, height - 122);
  rect(ctx, '#c89a30', 0, 122, W, 2);
  // Warm light from the lens on the floor, swinging with the beam.
  glow(ctx, cx + bx * 70, 140, 60, '255, 230, 150', 0.28);
  // A handrail along the near side, with balusters, and an iron stair post.
  for (let x = 4; x < W; x += 16) rect(ctx, '#1a242c', x, height - 24, 2, 24);
  rect(ctx, '#3a4854', 0, height - 26, W, 3);
  rect(ctx, '#7c8c9a', 0, height - 26, W, 1);
  vignette(ctx, height, '2, 6, 8', 0.55);
}

export const COAST_BACKDROPS = {
  gullrest: drawGullrest,
  wrack: drawWrack,
  saltcombe: drawSaltcombe,
  lanes: drawLanes,
  wreck: drawWreck,
  soundings: drawSoundings,
  isles: (ctx, time, height) => drawIsles(ctx, time, height, false),
  haddock_light: (ctx, time, height) => drawIsles(ctx, time, height, true),
  reach: drawReach,
  lastlight: drawLastLight,
};
