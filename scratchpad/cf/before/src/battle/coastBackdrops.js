import { SCREEN_WIDTH as W } from '../config.js';
import { vistaHash as hash } from '../engine/noise.js';
import { flashScale } from '../state/settings.js';

// Battle backgrounds for Chapter 5's coast (see BACKDROPS in backdrops.js),
// picked by the room's `area`: gullrest (the sunny beach), wrack (the storm
// starts), saltcombe (lamplit stilt houses), lanes (drowned roads), merrow (the
// drowned town), wreck (the ship graveyard under the green storm), soundings
// (the sea cave), isles and
// haddock_light (little lights), reach (the open storm sea) and lastlight
// (the lamp room at the top of the tower). Each draws the stage from y = 0
// down to `height`; the battle panel covers the rest. Everything moves a
// little: waves, rain, mist, flags, lights. Scenery that never moves is drawn
// once onto its own canvas.
//
// After chapter 5 the storm is over: a fight started in a room whose
// `calmAfter` scene has played gets `stormOver` (battleScene.js), and every
// storm backdrop here then draws its calm version (see "after the storm").

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
// A soft round light: one gradient sprite per colour, drawn at any size and
// strength (globalAlpha), so nothing builds a gradient each frame.
const SOFT = new Map();
function softSprite(rgb) {
  if (!SOFT.has(rgb)) {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 64;
    const c = canvas.getContext('2d');
    const g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, `rgba(${rgb}, 1)`);
    g.addColorStop(1, `rgba(${rgb}, 0)`);
    c.fillStyle = g;
    c.fillRect(0, 0, 64, 64);
    SOFT.set(rgb, canvas);
  }
  return SOFT.get(rgb);
}
function soft(ctx, rgb, strength, x, y, w, h) {
  if (strength <= 0) return;
  const before = ctx.globalAlpha;
  ctx.globalAlpha = before * Math.min(1, strength);
  ctx.drawImage(softSprite(rgb), x, y, w, h);
  ctx.globalAlpha = before;
}
function glow(ctx, x, y, radius, rgb, strength) {
  soft(ctx, rgb, strength, x - radius, y - radius, radius * 2, radius * 2);
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
// Vertical gradient through the given colours, drawn in 2 pixel bands (once,
// then kept: the bands never change).
function skyGradient(ctx, y0, y1, stops) {
  const bands = cached(`sky:${y0}:${y1}:${stops.join()}`, Math.max(1, Math.ceil(y1)), (c) => {
    for (let y = y0; y < y1; y += 2) {
      const t = ((y - y0) / Math.max(1, y1 - y0)) * (stops.length - 1);
      const i = Math.min(stops.length - 2, Math.floor(t));
      rect(c, mix(stops[i], stops[i + 1], t - i), 0, y, W, 2);
    }
  });
  ctx.drawImage(bands, 0, 0);
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
// Rain: every pixel of every drop goes into one path, filled once.
function rain(ctx, time, height, count, color, speed, slant, seedN = 0, depthBias = 1) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < count; i++) {
    const sp = speed * (0.8 + hash(seedN + i + 5) * 0.5);
    const y = (hash(seedN + i + 1) * height + time * sp) % (height + 8) - 4;
    const x = (hash(seedN + i + 2) * (W + 80) - y * slant - time * 4 * slant) % (W + 40);
    const xx = x < -20 ? x + W + 40 : x;
    const len = 3 + Math.floor(hash(seedN + i + 3) * 3 * depthBias);
    for (let k = 0; k < len; k++) ctx.rect(Math.round(xx - k * slant), Math.round(y + k), 1, 1);
  }
  ctx.fill();
}
// 0..1: how bright the lightning is just now (a double flicker, then it fades).
// The LIGHTNING FLASHES option scales it (OFF: no flash and no bolt at all).
function flashAt(time, period, offset = 0) {
  const scale = flashScale();
  if (!period || !scale) return { f: 0, n: 0, p: 9 };
  const t = time + offset;
  const n = Math.floor(t / period);
  const p = t - n * period;
  let f = 0;
  if (p < 0.06) f = 1;
  else if (p < 0.14) f = 0.15;
  else if (p < 0.26) f = 0.85;
  else if (p < 0.55) f = ((0.55 - p) / 0.29) * 0.4;
  return { f: f * scale, n, p };
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
// Each layer is filled only down to where the next one's crest covers it, one
// path a layer (and one for its foam), so the stage isn't painted six times over.
const SEA_TOPS = [];
function sea(ctx, time, y0, y1, cols, amp, wavelength, speed, foam = '#cfe8dc') {
  const n = cols.length;
  const wave = (i) => ({
    base: y0 + ((y1 - y0) * i) / n,
    a: amp * (0.35 + (0.9 * i) / n),
    wl: wavelength * (0.6 + (0.8 * i) / n),
    step: time * speed * (0.6 + i * 0.25) + i * 1.7,
  });
  // Where each layer's water starts, column by column (rounded, as drawn).
  for (let i = 0; i < n; i++) {
    const tops = (SEA_TOPS[i] ??= new Float32Array(W));
    const { base, a, wl, step } = wave(i);
    for (let x = 0; x < W; x++) {
      const arg = (x / wl) * 6.2832 + step;
      tops[x] = Math.round(base + Math.sin(arg) * a + Math.sin(arg * 2.3 + 1) * a * 0.3);
    }
  }
  const bottom = Math.ceil(y1) + 1;
  for (let i = 0; i < n; i++) {
    const tops = SEA_TOPS[i];
    const next = i + 1 < n ? SEA_TOPS[i + 1] : null;
    ctx.fillStyle = cols[i];
    ctx.beginPath();
    for (let x = 0; x < W; x++) {
      const end = next ? Math.min(bottom, next[x]) : bottom;
      if (end > tops[x]) ctx.rect(x, tops[x], 1, end - tops[x]);
    }
    ctx.fill();
    if (!foam || i === 0) continue;
    const { wl, step } = wave(i);
    ctx.fillStyle = foam;
    ctx.beginPath();
    for (let x = 0; x < W; x++) {
      const c = Math.cos((x / wl) * 6.2832 + step);
      // (None where the next layer's crest already covers it.)
      if (c <= 0.9 || (next && next[x] <= tops[x])) continue;
      ctx.rect(x, tops[x], 1, 1);
      if (i > 1 && c > 0.97 && !(next && next[x] <= tops[x] + 1)) ctx.rect(x - 1, tops[x] + 1, 3, 1);
    }
    ctx.fill();
  }
}
// Low flat banks of mist drifting: the soft sprite squashed flat.
function mist(ctx, time, y, h, rgb, alpha, seedN, count = 5) {
  for (let i = 0; i < count; i++) {
    const w = 80 + hash(seedN + i) * 80;
    const x = ((hash(seedN + i + 9) * (W + 160) + time * (3 + hash(seedN + i + 17) * 5)) % (W + 160)) - 80;
    const yy = y + hash(seedN + i + 23) * h;
    soft(ctx, rgb, alpha, x - w, yy - w * 0.18, w * 2, w * 0.36);
  }
}
// (Drawn once per colour and kept.)
function vignette(ctx, height, rgb, alpha) {
  ctx.drawImage(cached(`vignette:${rgb}:${alpha}`, height, (c) => {
    const g = c.createRadialGradient(W / 2, height * 0.5, 50, W / 2, height * 0.5, 230);
    g.addColorStop(0, `rgba(${rgb}, 0)`);
    g.addColorStop(1, `rgba(${rgb}, ${alpha})`);
    c.fillStyle = g;
    c.fillRect(0, 0, W, height);
  }), 0, 0);
}

// ---------- after the storm ----------
// After chapter 5 the coast fights stand under the same washed grey-blue sky as
// the calm rooms: no rain or lightning, a gentler grey sea with glints on it,
// gulls back, and the wrecks and the far Last Light soft grey shapes in clear
// air (its green gone).
const CALM_SKY = ['#47596e', '#5b6e84', '#7688a0', '#95a4b6', '#b6c0ca'];
const CALM_SEA = ['#5f778c', '#526a80', '#465e74', '#3c5268', '#32475c', '#293c50'];
const CALM_FOAM = '#d4e0e8';
// Far masts, hulls and the Last Light, grey in the clearing air.
const CALM_FAR = '#5a6a7e';
const CALM_FOG = '200, 210, 222';
const CALM_VIGNETTE = ['10, 16, 26', 0.35];

// A storm scene's options (see stormScene) with the storm taken out.
function calmed(o, over = {}) {
  const seedN = o.clouds[0][3] + 50;
  return {
    ...o,
    key: `${o.key}_calm`,
    flash: 0,
    bolt: false,
    rain: 0,
    horizonGlow: null,
    sky: CALM_SKY,
    clouds: [
      [['#73839a', '#7e8ea2'], 4, 24, seedN, 5, 2],
      [['#66778c', '#6c7d92'], 12, o.horizon - 10, seedN + 10, 4, 3],
    ],
    sea: { ...o.sea, cols: CALM_SEA, amp: o.sea.amp * 0.5, speed: o.sea.speed * 0.6, foam: CALM_FOAM },
    lastLight: o.lastLight && { ...o.lastLight, color: CALM_FAR },
    fogRgb: CALM_FOG,
    fogAlpha: (o.fogAlpha ?? 0.5) * 0.6,
    vignette: CALM_VIGNETTE,
    gulls: 3,
    shimmer: 16,
    sunbreak: true,
    sail: true,
    ...over,
  };
}
// Gulls wheeling over the water, smaller than Gullrest's (further off).
function gulls(ctx, time, n, top, span, seedN = 9500) {
  for (let i = 0; i < n; i++) {
    const x = ((hash(i + seedN) * (W + 40) + time * (9 + hash(i + seedN + 10) * 6)) % (W + 40)) - 20;
    const y = top + hash(i + seedN + 20) * span + Math.sin(time * 1.2 + i) * 3;
    const up = Math.sin(time * 6 + i * 2) > 0 ? 1 : 0;
    rect(ctx, '#e8eef2', x - 2, y - up, 2, 1);
    rect(ctx, '#e8eef2', x, y - up, 2, 1);
    rect(ctx, '#a8b4c0', x - 1, y + 1 - up, 2, 1);
  }
}
// Glints on a calm sea: little flashes of the pale sky.
function shimmer(ctx, time, n, y0, y1, seedN = 9600) {
  for (let i = 0; i < n; i++) {
    if (Math.sin(time * 1.8 + i * 1.7) < 0.45) continue;
    rect(ctx, 'rgba(232, 240, 246, 0.8)', hash(i + seedN) * W, y0 + 2 + hash(i + seedN + 10) * (y1 - y0 - 4), 2, 1);
  }
}
// After the storm: the sun breaking through low on the right, a soft patch in
// the cloud and three pale shafts down onto the sea, slowly brightening and
// dimming as the cloud moves over it. (Drawn once, then only faded.)
function sunBreak(ctx, time, horizon, height) {
  const shafts = cached(`sunbreak:${horizon}`, height, (c) => {
    glow(c, 228, 16, 70, '236, 240, 226', 0.35);
    glow(c, 228, 16, 24, '250, 250, 236', 0.4);
    for (const [x0, w, x1, a] of [[214, 6, 176, 0.07], [226, 5, 214, 0.09], [238, 7, 262, 0.06]]) {
      poly(c, `rgba(236, 240, 226, ${a})`, [[x0, 18], [x0 + w, 18], [x1 + w * 2.6, horizon + 2], [x1 - w * 0.6, horizon + 2]]);
    }
    // Where they land: a brighter run of light on the water.
    for (let k = 0; k < 5; k++) rect(c, 'rgba(244, 246, 236, 0.35)', 180 + k * 17, horizon + 3 + (k % 2), 9 - (k % 3) * 2, 1);
  });
  const before = ctx.globalAlpha;
  ctx.globalAlpha = before * (0.7 + 0.3 * Math.sin(time * 0.23));
  ctx.drawImage(shafts, 0, 0);
  ctx.globalAlpha = before;
}
// After the storm: a fishing boat out again, far off, its sail catching the light.
function farSail(ctx, time, horizon) {
  const x = ((time * 1.6 + 60) % (W + 40)) - 20;
  const y = horizon + 3 + Math.sin(time * 1.3) * 0.6;
  rect(ctx, '#3a4858', x - 3, y, 7, 1);
  rect(ctx, '#3a4858', x, y - 6, 1, 6);
  rect(ctx, '#e4e8ea', x + 1, y - 6, 1, 5);
  rect(ctx, '#e4e8ea', x + 2, y - 4, 1, 3);
  rect(ctx, '#c2c8cc', x - 2, y - 4, 2, 3);
}
// Rain hitting the water: little splashes coming and going all over the sea.
function rainSplashes(ctx, time, n, y0, y1, color, seedN = 9700) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const life = (time * 2.6 + hash(i + seedN) * 7) % 1;
    if (life > 0.35) continue;
    const round = Math.floor(time * 2.6 + hash(i + seedN) * 7);
    const x = Math.round(hash(i * 7.3 + round * 1.7 + seedN) * W);
    const y = Math.round(y0 + hash(i * 3.1 + round * 2.3 + seedN + 5) * (y1 - y0));
    if (life < 0.12) ctx.rect(x, y - 1, 1, 1);
    else { ctx.rect(x - 1, y, 1, 1); ctx.rect(x + 1, y, 1, 1); }
  }
  ctx.fill();
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
//   far(ctx, time, f), mid(ctx, time, f), near(ctx, time, f), fogRgb, fogAlpha, vignette,
//   gulls (how many), shimmer (glints on the sea; both for the calm after the storm) }
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
  if (o.sunbreak) sunBreak(ctx, time, o.horizon, height);
  if (o.lastLight) lastLight(ctx, o.lastLight.x, o.horizon + (o.lastLight.dy ?? 4), o.lastLight.s, o.lastLight.color, fl.f > 0.5 ? '#ffffff' : null);
  o.far?.(ctx, time, fl.f);
  if (o.gulls) gulls(ctx, time, o.gulls, 10, o.horizon - 24);
  if (o.fogRgb) mist(ctx, time, o.horizon - 6, 14, o.fogRgb, o.fogAlpha ?? 0.5, 31, 7);
  sea(ctx, time, o.horizon, height, o.sea.cols, o.sea.amp, o.sea.wl, o.sea.speed, o.sea.foam);
  if (o.shimmer) shimmer(ctx, time, o.shimmer, o.horizon, o.horizon + 40);
  if (o.sail) farSail(ctx, time, o.horizon);
  if (o.rain) rainSplashes(ctx, time, Math.round(o.rain * 0.4), o.horizon + 6, height - 8, 'rgba(220, 245, 235, 0.55)');
  // Lightning on the water.
  if (fl.f) rect(ctx, `rgba(215, 255, 225, ${(fl.f * 0.16).toFixed(3)})`, 0, o.horizon, W, height - o.horizon);
  o.mid?.(ctx, time, fl.f);
  if (o.fogRgb) mist(ctx, time, o.horizon + 8, o.sea.fogDepth ?? 40, o.fogRgb, (o.fogAlpha ?? 0.5) * 0.7, 61, 6);
  if (o.rain) rain(ctx, time, height, Math.round(o.rain * 0.6), o.rainColor, 150, 1, 100, 0.8);
  o.near?.(ctx, time, fl.f);
  if (o.rain) rain(ctx, time, height, Math.round(o.rain * 0.4), o.rainColor, 230, 1.4, 300, 1.4);
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
function drawWrack(ctx, time, height, calm = false) {
  const o = {
    key: 'wrack', horizon: 62, flash: 11,
    sky: ['#1c4a4e', '#2c6258', '#4a8062', '#86a870', '#c4c88c'],
    clouds: [[['#244a50', '#2c5a58'], 4, 34, 1000, 9, 4], [['#173a40', '#1e464a'], 14, 52, 1100, 8, 8]],
    sea: { cols: STORM_SEA('#3c7266', '#2e625c', '#245450', '#1c4848', '#143c3c', '#0e3034'), amp: 2, wl: 80, speed: 1.4 },
    rain: 70, rainColor: 'rgba(200, 235, 225, 0.4)',
    // The storm is only starting: a couple of gulls are still out, riding it.
    gulls: 2,
    lastLight: { x: 262, s: 0.55, color: '#142628' },
    fogRgb: '170, 205, 180', fogAlpha: 0.35,
    near: (c, t) => rockShelf(c, t, height - 40, 'wrack_rock', height, ['#26323a', '#3c4e54', '#52666a'], calm ? ['#2c3e50', '#4a6278', '#dce6ee'] : ['#1c4848', '#2c6c68', '#a8e0d4']),
    vignette: ['4, 14, 16', 0.5],  };
  stormScene(ctx, time, height, calm ? calmed(o) : o);
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
function drawSaltcombe(ctx, time, height, calm = false) {
  // Stilts, braces, walls, roofs, the lamp strings and the near boardwalk: black in the storm, grey after it.
  const P = calm
    ? { stilt: '#1c2834', brace: '#24303c', wall: '#222e3a', roof: '#1a2531', cord: '#2e3c48', near: '#18222c', nearTop: '#283644' }
    : { stilt: '#08141a', brace: '#0c1c22', wall: '#0a1a20', roof: '#07121a', cord: '#1a2a2a', near: '#06121a', nearTop: '#0a1c24' };
  const o = {
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
        for (let k = 0; k < 4; k++) rect(c, P.stilt, x + 4 + k * ((w - 8) / 3), by, 3, 18);
        for (let k = 0; k < 3; k++) rect(c, P.brace, x + 6 + k * 10, by + 6 + k * 2, 8, 1);
        rect(c, P.wall, x, top + 8, w, h - 8);
        poly(c, P.roof, [[x - 3, top + 9], [x + w / 2, top - 4], [x + w + 3, top + 9]]);
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
          cord(c, P.cord, x + w - 2, by - 24, nx + 2, houses[i + 1][1] - 24, 6);
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
      rect(c, P.wall, 0, 96, W, 3);
      for (let x = 6; x < W; x += 30) rect(c, P.wall, x, 84, 3, 16);
    },
    near(c, t) {
      rect(c, P.near, 0, height - 24, W, 24);
      for (let x = 0; x < W; x++) rect(c, P.nearTop, x, height - 24 + Math.round(Math.sin(x * 0.2 + t * 0.8)), 1, 2);
    },
    vignette: ['2, 10, 14', 0.55],  };
  stormScene(ctx, time, height, calm ? calmed(o) : o);
}

// ---------- the Sunken Lanes: drowned roads ----------
function drawLanes(ctx, time, height, calm = false) {
  // The drowned village's shapes and the light on the flood: green-black in the storm, grey after it.
  const P = calm
    ? { far: '#4c5c6e', farLit: '#66768a', bank: '200, 212, 224', edge: '214, 224, 234', hedge: '#2c3a48', post: '#202c38', house: '#202c38', ripple: '214, 226, 236', fpost: '#1c2834', fpostLit: '#2e3e4c' }
    : { far: '#16302e', farLit: '#2a4a40', bank: '196, 214, 176', edge: '210, 228, 190', hedge: '#17352c', post: '#101e1c', house: '#10242a', ripple: '190, 225, 215', fpost: '#0c1c1c', fpostLit: '#1c3030' };
  const o = {
    key: 'lanes', horizon: 58, flash: 16, flashOffset: 5,
    sky: ['#1a4a48', '#2c6458', '#52845e', '#98b472'],
    clouds: [[['#244e4c', '#2e5e56'], 4, 30, 3000, 8, 3], [['#16403c', '#1c4a44'], 16, 46, 3100, 7, 5]],
    sea: { cols: STORM_SEA('#4a7a68', '#3e6c60', '#345e58', '#2a5250', '#224848', '#1a3c3e'), amp: 0.8, wl: 90, speed: 0.8, foam: '#a8c8b8', fogDepth: 60 },
    rain: 90, rainColor: 'rgba(190, 225, 215, 0.4)',
    lastLight: { x: 290, s: 0.4, color: '#1a3430' },
    fogRgb: '150, 190, 160', fogAlpha: 0.4,
    far(c, t) {
      // Church tower and chimney tops sticking out of the flood.
      poly(c, P.far, [[108, 62], [108, 36], [112, 28], [116, 36], [116, 62]]);
      rect(c, P.far, 104, 50, 16, 12);
      rect(c, P.farLit, 110, 42, 2, 5);
      rect(c, P.far, 168, 54, 3, 8);
      rect(c, P.far, 188, 52, 3, 10);
    },
    mid(c, t) {
      // A road running under the water into the distance: its two banks, hedge tufts, fence posts.
      const roadL = (y) => 150 - (y - 60) * 1.15;
      const roadR = (y) => 170 + (y - 60) * 1.35;
      poly(c, `rgba(${P.bank}, 0.13)`, [[148, 60], [172, 60], [roadR(140), 140], [roadL(140), 140]]);
      for (let y = 62; y < 140; y += 2) {
        rect(c, `rgba(${P.edge}, 0.28)`, roadL(y), y, 1, 1);
        rect(c, `rgba(${P.edge}, 0.28)`, roadR(y), y, 1, 1);
      }
      for (let i = 0; i < 9; i++) {
        const y = 64 + i * i * 1.1 + i * 3;
        const k = (y - 60) / 80;
        for (const [x, dir] of [[roadL(y), -1], [roadR(y), 1]]) {
          oval(c, P.hedge, x + dir * (4 + k * 4), y - 1, 3 + k * 5, 1 + k * 2);
          if (i % 2) rect(c, P.post, x + dir * (10 + k * 10), y - 7 - k * 6, 2, 8 + k * 6);
        }
        rect(c, `rgba(${P.edge}, 0.25)`, 158 + k * 2, y, 3 + k * 2, 1);
      }
      // A half-sunk cottage on the left, a signpost on the right.
      poly(c, P.house, [[14, 80], [14, 70], [40, 56], [66, 70], [66, 80]]);
      rect(c, P.house, 20, 70, 40, 12);
      rect(c, '#ffd88a', 28, 72, 5, 5);
      glow(c, 30, 74, 14, '255, 200, 110', 0.25 + Math.sin(t * 3) * 0.05);
      rect(c, P.house, 292, 56, 3, 26);
      rect(c, P.house, 282, 60, 16, 4);
      rect(c, P.house, 290, 68, 14, 4);
      for (let i = 0; i < 18; i++) {
        const x = 12 + i * 18;
        const y = 76 + hash(i + 3300) * 10;
        const r = (t * 0.7 + hash(i + 3310)) % 1;
        ctx.strokeStyle = `rgba(${P.ripple}, ${(0.4 * (1 - r)).toFixed(2)})`;
        ctx.strokeRect(Math.round(x - r * 5), Math.round(y - r), Math.round(r * 10), 1);
      }
    },
    near(c, t) {
      // Fence posts in the foreground water, ripples around them.
      for (const [x, y] of [[20, height - 36], [96, height - 28], [214, height - 30], [292, height - 38]]) {
        rect(c, P.fpost, x, y - 22, 4, 24);
        rect(c, P.fpostLit, x, y - 22, 1, 24);
        const r = Math.abs(Math.sin(t * 1.2 + x));
        rect(c, `rgba(${P.ripple}, ${(0.5 - r * 0.3).toFixed(2)})`, x - 3 - r * 3, y + 1, 10 + r * 6, 1);
      }
    },
    vignette: ['4, 14, 14', 0.5],  };
  stormScene(ctx, time, height, calm ? calmed(o) : o);
}

// ---------- the Wreck Yard: the ship graveyard under the green storm ----------
function drawWreck(ctx, time, height, calm = false) {
  const hz = 64;
  const o = {
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
      const haze = calm ? CALM_FAR : f > 0.3 ? '#1e3a30' : '#315a40';
      for (const [x, h, lean] of [[8, 30, 5], [38, 22, -4], [64, 36, 6], [112, 24, -3], [150, 40, 4], [186, 26, -5], [214, 34, 3], [292, 28, -6], [312, 38, 4]]) {
        mast(c, t, x, hz + 3, h, lean, haze, null, x);
        line(c, haze, x, hz - h * 0.7, x + lean * 3, hz + 3);
      }
      for (const [x, w, h, b] of [[24, 40, 12, true], [124, 34, 10, false], [270, 38, 12, true]]) hullSil(c, haze, x, hz + 4, w, h, 3, b, x, null);
    },
    mid(c, t, f) {
      const dark = calm ? '#1e2a36' : f > 0.4 ? '#0a1e1c' : '#041214';
      const rib = calm ? '#2e3c4a' : f > 0.4 ? '#183a30' : '#0a2420';
      const sail = calm ? '#3a4856' : f > 0.4 ? '#2a4a3a' : '#0e2a24';
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
      const dark = calm ? '#0e1820' : '#020a0c';
      const lift = f > 0.4 ? '#122826' : dark;
      // Left snapped mast, right chain from a high stump.
      poly(c, lift, [[0, 0], [14, 0], [16, 34], [11, height - 30], [0, height - 30]]);
      for (let y = 18; y < height - 40; y += 16) line(c, calm ? '#1c2834' : '#0e2420', 0, y + 4, 14, y);
      cord(c, lift, 14, 8, 60, 52, 12);
      cord(c, lift, 14, 18, 44, 58, 8);
      poly(c, lift, [[W - 6, 0], [W, 0], [W, height - 30], [W - 16, height - 30]]);
      // A tatter of sail snapping from the right.
      for (let i = 0; i < 12; i++) {
        const sw = Math.sin(t * 2.2 + i * 0.5) * (2 + i * 0.3);
        rect(c, lift, W - 7 - i * 2 + sw * 0.3, 16 + i * 3, 7 + i, 3);
      }
      // A chain hanging from the right with a hook.
      for (let k = 0; k < 14; k++) rect(c, calm ? '#1a2630' : '#0c1818', W - 30 + Math.sin(t * 0.8 + k * 0.4) * 1.5, k * 4 + 6, 2, 3);
      // Black foreground swell and spray.
      for (let x = 0; x < W; x++) {
        const y = height - 22 + Math.sin(x * 0.09 + t * 1.6) * 3 + Math.sin(x * 0.23 + t * 2.1) * 1.4;
        rect(c, calm ? '#121c26' : '#050f12', x, y, 1, height - y);
        if (Math.sin(x * 0.09 + t * 1.6) > 0.92) rect(c, calm ? CALM_FOAM : '#9ec8ac', x, y - 1, 2, 1);
      }
    },
    vignette: ['0, 6, 6', 0.7],  };
  stormScene(ctx, time, height, calm ? calmed(o) : o);
}

// ---------- Merrow: the drowned town under the green storm ----------
// Rooftops and chimneys out of clear green water, the bell tower on the skyline (a bell in it
// swinging on its own, nobody pulling), a weathercock turning on a roof just under the surface,
// washing still out on a line. Not one window lit.
function drawMerrow(ctx, time, height, calm = false) {
  const hz = 66;
  const P = calm
    ? { far: '#4a5a6c', farLit: '#5e6e82', wall: '#26323e', wallLit: '#3a4856', roof: '#1c2630', roofLit: '#34424e', win: '#141c24', ripple: '214, 226, 236', near: '#121a22', nearLit: '#26323e', bell: '#6a7280', cloth: ['#8a96a4', '#6a7888'] }
    : { far: '#14302c', farLit: '#285044', wall: '#122a28', wallLit: '#24443c', roof: '#0a1c1c', roofLit: '#1e3a36', win: '#030c0c', ripple: '180, 225, 205', near: '#041010', nearLit: '#14302a', bell: '#7a6a30', cloth: ['#4a5a5a', '#2e3e40'] };
  // A town house half under: wall, pitched roof, chimney, dark windows; f lifts it in the lightning.
  const house = (c, x, base, w, wallH, roofH, f, chimney = 0, windows = 2) => {
    const wall = f > 0.4 ? P.wallLit : P.wall;
    const roof = f > 0.4 ? P.roofLit : P.roof;
    rect(c, wall, x, base - wallH, w, wallH);
    poly(c, roof, [[x - 2, base - wallH], [x + w / 2, base - wallH - roofH], [x + w + 2, base - wallH]]);
    line(c, P.farLit, x + w / 2, base - wallH - roofH, x + w + 2, base - wallH);
    if (chimney) {
      const cx = x + w * 0.72;
      rect(c, roof, cx, base - wallH - roofH * 0.7 - chimney, 5, chimney + roofH * 0.4);
      rect(c, roof, cx - 1, base - wallH - roofH * 0.7 - chimney - 2, 7, 2);
      rect(c, roof, cx + 1, base - wallH - roofH * 0.7 - chimney - 5, 2, 3);
    }
    for (let i = 0; i < windows; i++) rect(c, P.win, x + 4 + i * ((w - 10) / Math.max(1, windows - 1)), base - wallH + 3, 3, 4);
  };
  const o = {
    key: 'merrow', horizon: hz, flash: 11, flashOffset: 7,
    sky: ['#06201e', '#0c3230', '#16483e', '#2a6448', '#5e8c52', '#a4b868'],
    clouds: [
      [['#08262a', '#0c3030', '#123a36'], 2, 36, 5000, 10, 4],
      [['#0e3432', '#164438', '#1e5440'], 14, 50, 5100, 8, 7],
      [['#2a6448', '#3a7a4e'], 42, hz - 4, 5200, 5, 11],
    ],
    horizonGlow: [96, 8, '170, 210, 120', 0.3],
    sea: { cols: STORM_SEA('#2c6250', '#235446', '#1c4840', '#163e38', '#113430', '#0c2a28'), amp: 1.1, wl: 80, speed: 0.9, foam: '#a8d0bc', fogDepth: 50 },
    rain: 130, rainColor: 'rgba(190, 232, 212, 0.42)',
    fogRgb: '130, 180, 140', fogAlpha: 0.45,
    far(c, t, f) {
      const far = f > 0.3 ? P.farLit : P.far;
      // The far side of town: a ragged line of roofs, chimneys and a church spire.
      for (const [x, w, h] of [[0, 22, 8], [20, 16, 12], [36, 24, 7], [62, 18, 10], [126, 22, 9], [150, 18, 13], [172, 26, 8], [268, 20, 11], [290, 30, 8]]) {
        poly(c, far, [[x, hz + 2], [x, hz - h + 4], [x + w / 2, hz - h - 2], [x + w, hz - h + 4], [x + w, hz + 2]]);
        if (w > 18) rect(c, far, x + w * 0.7, hz - h - 3, 3, 6);
      }
      poly(c, far, [[84, hz + 2], [84, hz - 14], [90, hz - 34], [96, hz - 14], [96, hz + 2]]);
      rect(c, far, 89, hz - 38, 2, 5);
      // The bell tower: square, its belfry openings, the pale clock with no hands.
      const tx = 214;
      const top = 12;
      rect(c, far, tx, top, 30, hz + 2 - top);
      for (let k = 0; k < 4; k++) rect(c, far, tx - 2 + k * 9, top - 4, 5, 4);
      rect(c, far, tx - 2, top, 34, 3);
      for (const ox of [tx + 5, tx + 18]) {
        rect(c, '#020808', ox, top + 7, 7, 12);
        rect(c, '#020808', ox + 1, top + 6, 5, 1);
        for (let y = top + 9; y < top + 19; y += 3) rect(c, far, ox, y, 7, 1);
      }
      // A bell in the left opening, swinging though nobody is up there.
      const swing = Math.sin(t * 2.4) * (Math.sin(t * 0.37) > 0.2 ? 2 : 0.3);
      rect(c, P.bell, tx + 7 + swing, top + 9, 3, 3);
      rect(c, P.bell, tx + 6 + swing * 1.2, top + 12, 5, 1);
      oval(c, calm ? '#8a96a4' : '#7a9a84', tx + 15, top + 32, 6, 6);
      disc(c, '#020808', tx + 15, top + 32, 1);
      // The weathercock on its top.
      rect(c, far, tx + 14, top - 12, 1, 8);
      rect(c, far, tx + 12 + (Math.sin(t * 0.3) > 0 ? 0 : 1), top - 14, 5, 2);
    },
    mid(c, t, f) {
      // Nearer: whole roofs standing out of the water, the street under them.
      house(c, 8, hz + 30, 40, 10, 14, f, 7, 3);
      house(c, 58, hz + 24, 30, 6, 12, f, 0, 2);
      house(c, 236, hz + 26, 34, 8, 13, f, 9, 2);
      house(c, 278, hz + 34, 44, 12, 16, f, 6, 3);
      // A roof with a rowboat stranded upside down on its ridge.
      house(c, 104, hz + 30, 44, 4, 16, f, 0, 0);
      poly(c, f > 0.4 ? '#3e3020' : '#20180e', [[110, hz + 10], [120, hz + 4], [146, hz + 4], [146, hz + 10]]);
      line(c, f > 0.4 ? '#5a4630' : '#2e2414', 120, hz + 4, 146, hz + 4);
      // A washing line between two chimney stacks, the sheets sodden and still.
      const lx0 = 166;
      const lx1 = 214;
      for (const x of [lx0, lx1]) { rect(c, P.roof, x, hz + 6, 5, 22); rect(c, P.roof, x - 1, hz + 4, 7, 2); }
      cord(c, P.roof, lx0 + 4, hz + 8, lx1, hz + 8, 5);
      for (const [x, w, h, k] of [[172, 8, 10, 0], [184, 12, 14, 1], [200, 6, 8, 0]]) {
        const sway = Math.sin(t * 0.9 + x) * 0.6;
        const yy = hz + 8 + Math.sin(((x - lx0) / (lx1 - lx0)) * Math.PI) * 5;
        rect(c, P.cloth[k], x + sway, yy, w, h);
        rect(c, P.roof, x + sway, yy, 1, 1);
        rect(c, P.roof, x + w - 1 + sway, yy, 1, 1);
        // A drip falling off the hem now and then.
        const d = (t * 1.3 + x * 0.1) % 1;
        rect(c, `rgba(${P.ripple}, 0.6)`, x + w / 2, yy + h + d * 10, 1, 2);
      }
      // A weathercock on its pole, the very tip of a drowned roof, swinging in the wind.
      const wx = 160;
      const wy = hz + 44;
      poly(c, P.roof, [[wx - 7, wy], [wx, wy - 6], [wx + 7, wy]]);
      rect(c, P.roof, wx, wy - 26, 1, 20);
      rect(c, P.roof, wx - 5, wy - 16, 11, 1);
      const turn = Math.sin(t * 0.8) * Math.sin(t * 0.23);
      const dir = turn > 0 ? 1 : -1;
      rect(c, f > 0.4 ? '#c8a050' : '#5a4a1c', wx - 3 * dir - (dir < 0 ? 3 : 0), wy - 30, 6, 3);
      rect(c, f > 0.4 ? '#c8a050' : '#5a4a1c', wx + 2 * dir - (dir < 0 ? 1 : 0), wy - 33, 2, 3);
      rect(c, P.roof, wx - 6 * dir - (dir < 0 ? 1 : 0), wy - 26, 2, 1);
      // Rings on the water round everything standing in it.
      for (const [x, y] of [[28, hz + 31], [74, hz + 25], [126, hz + 31], [160, hz + 45], [252, hz + 27], [300, hz + 35], [190, hz + 30]]) {
        const r = (t * 0.6 + hash(x)) % 1;
        c.strokeStyle = `rgba(${P.ripple}, ${(0.45 * (1 - r)).toFixed(2)})`;
        c.strokeRect(Math.round(x - 6 - r * 8), Math.round(y), Math.round(12 + r * 16), 1);
      }
    },
    near(c, t, f) {
      const dark = f > 0.4 ? P.nearLit : P.near;
      // Left: a chimney stack with its pots, close to the screen. Right: a gable's slates.
      rect(c, dark, 0, 24, 22, height - 24);
      rect(c, dark, -2, 20, 26, 5);
      rect(c, dark, 4, 10, 5, 11);
      rect(c, dark, 13, 13, 5, 8);
      for (let y = 30; y < height - 30; y += 6) rect(c, f > 0.4 ? '#1e3a34' : '#0a1c1a', 0, y, 20, 1);
      poly(c, dark, [[W, 30], [W - 54, height - 26], [W, height - 26]]);
      for (let k = 0; k < 9; k++) line(c, f > 0.4 ? '#1e3a34' : '#0a1c1a', W - 6 - k * 5, 38 + k * 8, W, 38 + k * 8);
      rect(c, f > 0.4 ? '#2a4a40' : '#0e2420', W - 56, height - 28, 56, 2);
      // The near water, and the cobbles of the street showing through it.
      for (let x = 0; x < W; x++) {
        const y = height - 22 + Math.sin(x * 0.07 + t * 1.1) * 1.6 + Math.sin(x * 0.19 + t * 1.7) * 0.8;
        rect(c, calm ? '#1a2a38' : '#0a2420', x, y, 1, height - y);
        if (Math.sin(x * 0.07 + t * 1.1) > 0.95) rect(c, calm ? CALM_FOAM : '#8cc0a8', x, y - 1, 2, 1);
      }
      for (let i = 0; i < 26; i++) {
        const x = (i * 13 + (i % 3) * 5) % W;
        const y = height - 16 + (i % 3) * 5;
        oval(c, calm ? '#22344a' : '#0e302a', x, y, 4, 1);
      }
    },
    vignette: ['2, 10, 10', 0.6],
  };
  stormScene(ctx, time, height, calm ? calmed(o) : o);
}

// ---------- Merrow's belfry: inside the drowned bell tower (Old Gulper's fight) ----------
// Stone walls going up into the dark, the floor flooded, two great beams across with the empty
// bell frame hanging from them (the great bell itself has fallen and lies on its side in the
// water at the right: it is part of Old Gulper's own picture). Bell ropes hang from iron hooks
// in the beams, their woolly grips just clear of the water. Green storm light falls in through
// the louvres, the lightning flaring them, and rain drips through and rings the water. After
// the storm (`calm`) the louvres show a washed grey-blue sky and the drips stop.
// Where the bell ropes hang from the lower beam.
const BELFRY_ROPES = [100, 122, 186, 208, 300];
function drawBelfry(ctx, time, height, calm = false) {
  const fl = flashAt(time, calm ? 0 : 9, 3);
  const P = calm
    ? { wall: '#2a323c', wallHi: '#3a4450', mortar: '#1c2229', sky: ['#5e7088', '#8496ac'], slat: '#1e252c', light: '200, 212, 226', water: ['#2c3c4c', '#22323f', '#1a2733'], foam: CALM_FOAM, beam: '#2e241a', beamHi: '#4a3a28', moss: '#3c4a44', rope: '#7a6c58' }
    : { wall: '#16262a', wallHi: '#22383a', mortar: '#0c1618', sky: ['#1a4a3a', '#5e9a5a'], slat: '#081212', light: '150, 220, 160', water: ['#164036', '#10342c', '#0a2824'], foam: '#8cc0a8', beam: '#1e160e', beamHi: '#3a2a18', moss: '#2a4a30', rope: '#5a4c36' };
  const floor = 118;
  const still = cached(calm ? 'belfry_calm' : 'belfry', height, (c) => {
    // The walls: courses of big stones, darker toward the top.
    skyGradient(c, 0, height, calm ? ['#141a20', '#232b33', '#2a323c'] : ['#060e10', '#0e1c1e', '#16262a']);
    for (let row = 0, y = 2; y < floor + 6; row++, y += 11) {
      const off = row % 2 ? 9 : 0;
      for (let x = -off; x < W; x += 20) {
        const shade = hash(row * 7 + x * 0.13);
        rect(c, shade > 0.75 ? P.wallHi : P.wall, x + 1, y + 1, 18, 9);
        if (shade < 0.15) rect(c, P.moss, x + 2, y + 8, 6 + shade * 40, 2);
      }
      rect(c, P.mortar, 0, y, W, 1);
    }
    // Darker toward the top, where the tower goes on up into the dark.
    for (let y = 0; y < 40; y += 2) rect(c, `rgba(2, 6, 8, ${(((40 - y) / 40) * 0.7).toFixed(2)})`, 0, y, W, 2);
    // Two louvred openings, arched, with slats.
    for (const lx of [44, 150]) {
      poly(c, P.mortar, [[lx - 2, 92], [lx - 2, 50], [lx + 12, 38], [lx + 26, 50], [lx + 26, 92]]);
      for (let y = 40; y < 90; y += 2) {
        const t = (y - 40) / 50;
        const half = y < 50 ? ((y - 38) / 12) * 12 : 12;
        rect(c, mix(P.sky[0], P.sky[1], t), lx + 12 - half, y, half * 2, 2);
      }
      for (let y = 46; y < 90; y += 5) {
        rect(c, P.slat, lx - 1, y, 26, 2);
        rect(c, P.wallHi, lx - 1, y + 2, 26, 1);
      }
      rect(c, P.wallHi, lx - 4, 92, 32, 3);
    }
    // The beams, each into the wall on stone corbels.
    for (const [y, h] of [[16, 7], [34, 6]]) {
      rect(c, '#0a0806', 0, y - 1, W, h + 2);
      rect(c, P.beam, 0, y, W, h);
      rect(c, P.beamHi, 0, y, W, 1);
      for (let x = 12; x < W; x += 37) rect(c, '#0a0806', x, y + 2, 3, 1);
      for (const x of [0, W - 14]) {
        rect(c, P.wallHi, x, y + h, 14, 4);
        rect(c, P.mortar, x, y + h + 4, 14, 1);
      }
    }
    // The empty bell frame on the upper beam: a heavy yoke on iron straps, its bolts sheared.
    const fx = 236;
    for (const x of [fx + 4, fx + 34]) {
      rect(c, '#3a3e40', x, 14, 4, 18);
      rect(c, '#5a6062', x, 14, 1, 18);
    }
    rect(c, '#0a0806', fx - 1, 22, 44, 9);
    rect(c, P.beamHi, fx, 23, 42, 7);
    rect(c, P.beam, fx, 27, 42, 3);
    rect(c, '#3a3e40', fx + 18, 30, 6, 4);
    rect(c, '#5a6062', fx + 19, 34, 2, 3);
    rect(c, '#3a3e40', fx + 22, 34, 2, 2);
    // A broken timber leaning into the water on the left, from when the bell came down.
    poly(c, '#0a0806', [[6, floor + 4], [56, 52], [62, 56], [14, floor + 6]]);
    poly(c, P.beam, [[8, floor + 3], [56, 54], [60, 57], [14, floor + 4]]);
    // Hooks under the lower beam for the ropes.
    for (const x of BELFRY_ROPES) {
      rect(c, '#3a3e40', x - 1, 40, 3, 3);
      rect(c, '#5a6062', x - 1, 40, 1, 1);
    }
  });
  ctx.drawImage(still, 0, 0);
  // Light through the louvres: shafts down onto the water, flaring in the lightning.
  const bright = 0.12 + fl.f * 0.35;
  for (const lx of [44, 150]) {
    poly(ctx, `rgba(${P.light}, ${bright.toFixed(3)})`, [[lx, 48], [lx + 24, 48], [lx + 60, floor], [lx + 18, floor]]);
    if (fl.f) rect(ctx, `rgba(225, 255, 230, ${(fl.f * 0.5).toFixed(3)})`, lx, 46, 24, 44);
  }
  // The ropes, each from its hook, swaying a little, with a striped woolly grip.
  BELFRY_ROPES.forEach((x, i) => {
    const sway = Math.sin(time * (0.7 + i * 0.13) + i * 2) * (1.2 + i * 0.4);
    const len = 52 + (i % 3) * 9;
    for (let y = 43; y < 43 + len; y++) rect(ctx, P.rope, x + sway * ((y - 43) / len), y, 1, 1);
    const gx = x + sway;
    const gy = 43 + len;
    for (let k = 0; k < 8; k++) rect(ctx, k % 3 === 0 ? '#e8e0c8' : k % 3 === 1 ? '#a83a30' : '#2a4a7a', gx - 1, gy - 9 + k, 3, 1);
    rect(ctx, P.rope, gx, gy - 1, 1, 6);
  });
  // The flooded floor: dark green water, the light lying on it, slow ripples.
  for (let x = 0; x < W; x++) {
    const y = floor + Math.sin(x * 0.08 + time * 0.9) * 1.1 + Math.sin(x * 0.21 + time * 1.3) * 0.5;
    rect(ctx, P.water[0], x, y, 1, 10);
    rect(ctx, P.water[1], x, y + 10, 1, 14);
    rect(ctx, P.water[2], x, y + 24, 1, height - y - 24);
    if (Math.sin(x * 0.08 + time * 0.9) > 0.93) rect(ctx, P.foam, x, y - 1, 2, 1);
  }
  for (const lx of [44, 150]) glow(ctx, lx + 40, floor + 8, 30, P.light, 0.18 + fl.f * 0.2);
  // Rain coming in at the louvres and dripping off the beams, each drip ringing the water.
  if (!calm) {
    for (let i = 0; i < 14; i++) {
      const x = i < 6 ? 46 + hash(i + 3100) * 70 : hash(i + 3100) * W;
      const fall = 70 + hash(i + 3110) * 40;
      const top = i < 6 ? 52 : 42;
      const drop = (floor - top) / fall;
      const p = (time + hash(i + 3120) * 5) % (drop + 0.9);
      if (p < drop) rect(ctx, 'rgba(200, 240, 220, 0.6)', x, top + p * fall, 1, 3);
      else {
        const r = (p - drop) / 0.9;
        ctx.strokeStyle = `rgba(200, 240, 220, ${(0.5 * (1 - r)).toFixed(2)})`;
        ctx.strokeRect(Math.round(x - 2 - r * 7), floor + 2, Math.round(4 + r * 14), 1);
      }
    }
  }
  vignette(ctx, height, calm ? CALM_VIGNETTE[0] : '2, 8, 8', calm ? 0.45 : 0.65);
}

// ---------- the Storm Reach: open sea, huge waves ----------
function drawReach(ctx, time, height, calm = false) {
  const hz = 54;
  const o = {
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
    far(c, t) {
      // Masts of ships the Reach already took, standing out of the swell far off.
      const pole = calm ? CALM_FAR : '#071a1a';
      const rag = calm ? '#6e7e90' : '#1c3a32';
      mast(c, t, 214, hz + 9, 30, 4, pole, rag, 5200);
      mast(c, t, 300, hz + 7, 22, -3, pole, null, 5210);
      mast(c, t, 34, hz + 8, 26, -5, pole, rag, 5220);
    },
    mid(c, t) {
      // Haddock's little boat, tiny, riding a wave far off (in the gap between the party and the foe).
      // After the chapter the Bother is tied up at the tower's landing: the sea out here is empty.
      if (calm) return;
      const bx = 124;
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
          // After the storm the swells lie down to a long, low roll, with no spray.
          const y = y0 + (Math.sin(arg) * (8 - layer * 2) + Math.sin(arg * 2.1) * 2) * (calm ? 0.45 : 1);
          rect(c, calm ? (layer ? '#1e3042' : '#2a3e52') : layer ? '#04141a' : '#082a2c', x, y, 1, height - y);
          if (Math.cos(arg) > 0.95) {
            rect(c, calm ? CALM_FOAM : '#cfe8d8', x, y - 1, 2, calm ? 1 : 2);
            if (!calm) for (let s = 0; s < 3; s++) rect(c, 'rgba(220, 245, 230, 0.7)', x + s * 2 - 2, y - 3 - ((t * 20 + s * 5 + x) % 7), 1, 1);
          }
        }
      }
    },
    vignette: ['0, 8, 8', 0.65],  };
  stormScene(ctx, time, height, calm ? calmed(o, { sail: false }) : o);
}

// ---------- the Soundings: a sea cave with the tide in it ----------
function drawSoundings(ctx, time, height, calm = false) {
  skyGradient(ctx, 0, height, ['#06141a', '#0a2028', '#0e2c34', '#12383e']);
  // The mouth of the cave far off: a ragged arch, and through it the green storm sky over
  // a pale sea, with the Last Light a black splinter on the horizon. After the storm the
  // sky out there is grey-blue and the tower a grey shape.
  const hz = 68;
  const mouth = cached(calm ? 'sound_mouth_calm' : 'sound_mouth', height, (c) => {
    const sky = calm ? ['#5c6e84', '#70829a', '#8a9aae', '#a4b2c2', '#c0cad4'] : ['#1e4440', '#2c5a50', '#4a7e66', '#78a886', '#a8ccb0'];
    const half = (y) => 36 * Math.sqrt(Math.max(0, 1 - ((y - 92) / 56) ** 2)) + (hash(y * 3.7 + 5590) - 0.5) * 3;
    glow(c, 160, hz - 4, 70, calm ? '190, 205, 220' : '150, 210, 180', 0.18);
    for (let y = 36; y <= 92; y++) {
      const w = half(y);
      if (w < 1) continue;
      let col;
      if (y < hz) {
        const k = Math.min(sky.length - 1, Math.floor(((y - 36) / (hz - 36)) * sky.length));
        col = sky[k];
      } else col = calm ? mix('#6a8296', '#2a4054', Math.min(1, (y - hz) / 18)) : mix('#4a8a7c', '#1a4440', Math.min(1, (y - hz) / 18));
      rect(c, col, 160 - w, y, w * 2, 1);
      // The rim: wet rock catching the light.
      rect(c, '#2a5258', 160 - w - 2, y, 2, 1);
      rect(c, '#2a5258', 160 + w, y, 2, 1);
    }
    // Low cloud banks going across the opening.
    for (const [y, x0, len] of [[46, 146, 22], [52, 132, 30], [57, 150, 34], [61, 128, 18]]) rect(c, calm ? '#7a8a9e' : '#2c5a50', x0, y, len, 1);
    rect(c, calm ? '#dce4ea' : '#c4e0c8', 128, hz - 1, 64, 1);
    lastLight(c, 176, hz, 0.22, calm ? CALM_FAR : '#0c2224');
    // A rock or two in the mouth, black against the sea.
    poly(c, '#071c26', [[134, 80], [140, 71], [146, 74], [150, 80]]);
    poly(c, '#071c26', [[176, 78], [181, 73], [186, 78]]);
  });
  ctx.drawImage(mouth, 0, 0);
  for (let x = 126; x < 194; x++) rect(ctx, calm ? 'rgba(224,234,242,0.8)' : 'rgba(210,245,230,0.8)', x, hz + Math.round(Math.sin(x * 0.2 + time * 2) * 1), 1, 1);
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
// After the storm (`calm`): the grey-blue sky, a few gulls instead of stars, a gentle sea;
// the little lights still burn, and Haddock's lamp stands still, his window low like a banked fire.
function drawIsles(ctx, time, height, home = false, calm = false) {
  const hz = 64;
  const rock = calm ? '#2a3646' : '#0a1c20';
  if (calm) {
    skyGradient(ctx, 0, hz + 4, CALM_SKY);
    drift(ctx, cloudStrip('isles_calm0', height, 4, 26, ['#73839a', '#7e8ea2'], 6050, 5), time, 2);
    drift(ctx, cloudStrip('isles_calm1', height, 14, 50, ['#66778c', '#6c7d92'], 6150, 4), time, 3);
    gulls(ctx, time, 3, 10, 30);
    sea(ctx, time, hz, height, CALM_SEA, 0.8, 70, 0.7, CALM_FOAM);
    shimmer(ctx, time, 16, hz, hz + 40);
  } else {
    skyGradient(ctx, 0, hz + 4, ['#0c3038', '#18504a', '#2c7050', '#5c9a60', '#a0c476']);
    drift(ctx, cloudStrip('isles_cl0', height, 4, 40, ['#164448', '#1e544e'], 6000, 8), time, 3);
    drift(ctx, cloudStrip('isles_cl1', height, 18, 54, ['#103a40', '#18484a'], 6100, 7), time, 5);
    // A few early stars through the thinning cloud.
    for (let i = 0; i < 14; i++) {
      const tw = Math.sin(time * 1.3 + i * 1.9);
      if (tw > 0.1) rect(ctx, '#e8fff0', hash(i + 6200) * W, 4 + hash(i + 6210) * 30, 1, 1);
    }
    sea(ctx, time, hz, height, ['#2c6458', '#22544e', '#1a4646', '#143a3c', '#0e2e34', '#0a252c'], 1.6, 70, 1.2, '#9cc8b8');
  }
  // Little islands, each with a lighthouse that is lit (or about to be).
  const isles = [[28, 12, 0.5], [92, 8, 0.38], [214, 10, 0.44], [286, 14, 0.55]];
  isles.forEach(([x, r, s], i) => {
    const by = hz + 4 + (i % 2) * 3;
    oval(ctx, rock, x, by, r + 8, 4);
    poly(ctx, calm ? '#323e4e' : '#0c2024', [[x - 6, by], [x - 3, by - 3], [x + 4, by - 3], [x + 8, by]]);
    const hh = 26 * s * 2;
    poly(ctx, rock, [[x - 3 * s * 2, by - 3], [x - 2 * s * 2, by - 3 - hh], [x + 2 * s * 2, by - 3 - hh], [x + 3 * s * 2, by - 3]]);
    rect(ctx, rock, x - 3, by - 3 - hh - 4, 6, 4);
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
  cord(ctx, rock, 36, hz - 4, 86, hz - 4, 4 + Math.sin(time) * 0.8);
  cord(ctx, rock, 36, hz - 7, 86, hz - 7, 4 + Math.sin(time) * 0.8);
  const near = calm ? '#141e28' : '#071418';
  if (home) {
    // Haddock's tall light at the right edge, a warm window below the lamp.
    poly(ctx, near, [[W - 54, height - 20], [W - 46, 24], [W - 28, 24], [W - 20, height - 20]]);
    rect(ctx, near, W - 50, 12, 26, 12);
    if (calm) {
      // His lamp stands still and dark; the window below glows low, like a banked fire.
      rect(ctx, '#8a8a7c', W - 45, 14, 16, 8);
      rect(ctx, '#a8a898', W - 43, 15, 3, 6);
      rect(ctx, '#e0904a', W - 40, height - 70, 6, 8);
      glow(ctx, W - 37, height - 66, 16, '255, 160, 80', 0.3);
    } else {
      rect(ctx, 'rgba(255, 230, 150, 0.95)', W - 45, 14, 16, 8);
      glow(ctx, W - 37, 18, 50, '255, 220, 130', 0.6);
      rect(ctx, '#ffd070', W - 40, height - 70, 6, 8);
      glow(ctx, W - 37, height - 66, 18, '255, 200, 100', 0.4);
      poly(ctx, 'rgba(255, 230, 160, 0.07)', [[W - 37, 18], [0, 4], [0, 44]]);
    }
  }
  mist(ctx, time, hz - 4, 12, calm ? CALM_FOG : '150, 190, 170', calm ? 0.2 : 0.3, 91, 5);
  // Foreground rocks with weed, and light rain (none after the storm).
  for (let x = 0; x < W; x++) {
    const y = height - 22 + Math.sin(x * 0.07) * 3 + Math.sin(x * 0.19) * 1.5;
    rect(ctx, near, x, y, 1, height - y);
    if (Math.sin(x * 0.07 + time * 1.4) > 0.94) rect(ctx, calm ? CALM_FOAM : '#9cc8b8', x, y - 1, 2, 1);
  }
  if (!calm) rain(ctx, time, height, 40, 'rgba(200, 235, 225, 0.3)', 150, 1, 700, 0.8);
  if (calm) vignette(ctx, height, CALM_VIGNETTE[0], CALM_VIGNETTE[1]);
  else vignette(ctx, height, '2, 12, 14', 0.5);
}

// ---------- the Last Light: the lamp room at the top ----------
// After the storm (`calm`) the glass shows a washed grey-blue sky and a quiet sea: no
// lightning, no rain, no streaks on the panes.
function drawLastLight(ctx, time, height, calm = false) {
  const fl = flashAt(time, calm ? 0 : 7.5, 1);
  // Outside, seen through the glass all round: green storm sky (grey-blue after it).
  if (calm) {
    skyGradient(ctx, 0, height, ['#3e5064', '#53667c', '#6e8298', '#8c9db0', '#a8b4c2']);
    drift(ctx, cloudStrip('lastlight_calm', height, 4, 60, ['#5e6e82', '#68788c', '#728296'], 7050, 6), time, 3);
  } else {
    skyGradient(ctx, 0, height, ['#04181c', '#0a2c2c', '#14483a', '#2a7046', '#58944c']);
    if (fl.f) rect(ctx, `rgba(215, 255, 225, ${(fl.f * 0.5).toFixed(3)})`, 0, 0, W, height);
    drift(ctx, cloudStrip('lastlight_cl', height, 4, 70, ['#06222a', '#0c3434', '#144238'], 7000, 12), time, 9);
    if (fl.f > 0.5 && fl.p < 0.3) bolt(ctx, 60 + hash(fl.n * 5.3) * 200, 0, 90, fl.n * 13, '#f4fff6');
  }
  // Waves far below, hardly visible.
  for (let x = 0; x < W; x++) {
    const y = 118 + Math.sin(x * 0.05 + time * (calm ? 0.8 : 1.4)) * (calm ? 1.5 : 3);
    rect(ctx, calm ? '#30465a' : '#0a2c2c', x, y, 1, height - y);
    if (Math.sin(x * 0.05 + time * 1.4) > 0.93) rect(ctx, calm ? CALM_FOAM : '#8cc8a8', x, y - 1, 2, 1);
  }
  if (!calm) rain(ctx, time, height, 130, 'rgba(200, 235, 225, 0.5)', 220, 1.5, 800, 1.2);
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
  for (let i = 0; i < (calm ? 0 : 16); i++) {
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

// ---------- the cliff cave (sunny_cliff_cave, sunny_cliff_hollow) ----------
// Inside the cliff spur under the Sea View, before the storm: a dim, damp cave
// of grey-brown rock, the only daylight a cold grey-blue from a ragged hole
// onto the sunny sea, a thin dusty thread of it reaching the floor, the tin
// lantern on its post by a dark green pool, anemones glinting on the wet rock,
// drips off the stalactites. Rooms ask for it with `battleArea: 'cliff_cave'`.
function drawCliffCave(ctx, time, height) {
  const pool = height - 42;
  const back = cached('cliff_cave_back', height, (c) => {
    skyGradient(c, 0, height, ['#121315', '#1a1a1a', '#22211e', '#1c1d1c']);
    // Beds of rock in the back wall, darker toward the roof, with cracks.
    for (let y = 18; y < height - 40; y += 5) {
      const k = y / height;
      for (let x = 0; x < W; x++) {
        const wob = Math.sin(x * 0.05 + y * 0.3) * 1.5 + Math.sin(x * 0.17 + y) * 0.6;
        if (hash(x * 0.37 + y * 7.1) < 0.7) rect(c, k < 0.35 ? '#26241f' : '#2e2b25', x, y + wob, 1, 1);
      }
    }
    for (let i = 0; i < 14; i++) {
      let x = hash(i + 7700) * W;
      let y = 24 + hash(i + 7710) * (height - 80);
      for (let j = 0; j < 10; j++) {
        rect(c, '#141310', x, y, 1, 2);
        x += (hash(i * 13 + j + 7720) - 0.5) * 3;
        y += 2;
      }
    }
    // The hole onto the sea, high on the left: a ragged opening, cold daylight in it.
    const hx = 92;
    const hy = 48;
    const half = (y) => 30 * Math.sqrt(Math.max(0, 1 - ((y - hy) / 24) ** 2)) + (hash(y * 3.3 + 7800) - 0.5) * 3;
    for (let y = hy - 24; y <= hy + 24; y++) {
      const w = half(y);
      if (w < 1) continue;
      const col = y < hy + 2 ? mix('#8ea8bc', '#c4d2dc', (y - (hy - 24)) / 26) : mix('#4c7890', '#2a5068', Math.min(1, (y - hy - 2) / 20));
      rect(c, col, hx - w, y, w * 2, 1);
      rect(c, '#5c584e', hx - w - 2, y, 2, 1);
      rect(c, '#3a3730', hx + w, y, 3, 1);
    }
    rect(c, '#dce6ea', hx - 28, hy + 2, 56, 1);
    // A far headland in the hole, and the lit lower lip of the rock.
    poly(c, '#5a6e7c', [[hx + 6, hy + 2], [hx + 14, hy - 3], [hx + 24, hy - 1], [hx + 28, hy + 2]]);
    for (let x = hx - 26; x < hx + 26; x++) rect(c, '#7a7466', x, hy + 23 - Math.abs(Math.sin(x * 0.3)) * 2, 1, 2);
    // Stalactites along the roof, wet at the tips.
    for (let i = 0; i < 22; i++) {
      const x = 6 + hash(i + 7900) * (W - 12);
      const len = 8 + hash(i + 7910) * 22;
      const wide = 2 + Math.round(hash(i + 7920) * 3);
      for (let y = 0; y < len; y++) {
        const w = Math.max(1, Math.round(wide * (1 - y / len)));
        rect(c, y < len * 0.6 ? '#1a1916' : '#2c2a25', x - w / 2, y, w, 1);
      }
      rect(c, '#6a8a88', x, len - 1, 1, 1);
    }
    rect(c, '#0e0f10', 0, 0, W, 6);
    // The floor: wet rock, then the dark pool across the front.
    rect(c, '#2c2a24', 0, pool - 12, W, 12);
    for (let x = 0; x < W; x += 2) rect(c, hash(x * 0.71 + 8000) < 0.5 ? '#3a372f' : '#25231e', x, pool - 12 + hash(x + 8010) * 4, 2, 1);
    skyGradient(c, pool, height, ['#163c3a', '#123230', '#0e2a2a', '#0a2222']);
    rect(c, '#2c5a54', 0, pool, W, 1);
    // Barnacles and weed along the waterline.
    for (let i = 0; i < 40; i++) {
      const x = hash(i + 8100) * W;
      rect(c, i % 3 ? '#8a867a' : '#c8c4b4', x, pool - 2 - hash(i + 8110) * 3, 2, 1);
    }
    for (let i = 0; i < 18; i++) {
      const x = hash(i + 8200) * W;
      rect(c, '#365c3a', x, pool - 1, 1, 3 + hash(i + 8210) * 4);
    }
    // The lantern's post (stood on the rock, with an arm and a hook): the lantern hangs off it.
    rect(c, '#3a2c1c', 30, pool - 52, 3, 46);
    rect(c, '#5a4630', 30, pool - 52, 1, 46);
    rect(c, '#3a2c1c', 30, pool - 52, 10, 2);
    rect(c, '#2a2a2a', 38, pool - 50, 1, 4);
    vignette(c, height, '4, 6, 8', 0.6);
  });
  ctx.drawImage(back, 0, 0);
  // Cold grey daylight from the hole, and a thin dusty thread of it to the floor.
  glow(ctx, 92, 50, 60, '160, 184, 204', 0.16);
  for (let y = 74; y < pool; y += 2) {
    const k = (y - 74) / (pool - 74);
    ctx.fillStyle = `rgba(176, 190, 196, ${(0.13 * (1 - k * 0.5)).toFixed(3)})`;
    ctx.fillRect(Math.round(96 + k * 34), y, 5 + Math.round(k * 4), 2);
  }
  for (let i = 0; i < 6; i++) {
    const k = (hash(i + 8300) + time * 0.03 * (1 + hash(i + 8310))) % 1;
    rect(ctx, '#c8d0cc', 98 + k * 34 + Math.sin(time + i) * 2, 74 + k * (pool - 74), 1, 1);
  }
  // The sea through the hole: glints and a white wave coming and going.
  for (let i = 0; i < 8; i++) {
    const x = 70 + hash(i + 8400) * 44;
    const y = 52 + hash(i + 8410) * 14;
    if (Math.sin(time * 2.2 + i * 1.9) > 0.5) rect(ctx, '#f0f8fa', x, y, 2, 1);
  }
  for (let x = 72; x < 112; x++) if (Math.sin(x * 0.3 + time * 1.4) > 0.6) rect(ctx, '#e6f0f2', x, 62 + Math.round(Math.sin(x * 0.2 + time)), 1, 1);
  // The lantern, a small warm light by the pool.
  const flick = 1 + Math.sin(time * 9) * 0.05 + Math.sin(time * 23) * 0.03;
  glow(ctx, 39, pool - 40, 40 * flick, '255, 156, 68', 0.32);
  rect(ctx, '#2a2a2a', 35, pool - 46, 7, 1);
  rect(ctx, '#4a4a48', 35, pool - 45, 7, 9);
  rect(ctx, '#ffcc78', 37, pool - 44, 3, 6);
  rect(ctx, '#fff2c0', 38, pool - 42, 1, 3);
  rect(ctx, '#2a2a2a', 35, pool - 36, 7, 1);
  // The pool: slow ripples, the lantern and the hole shimmering in it.
  for (let i = 0; i < 26; i++) {
    const x = (hash(i + 8500) * W + time * (3 + hash(i + 8510) * 4)) % W;
    const y = pool + 3 + hash(i + 8520) * 36;
    rect(ctx, '#2c5a54', x, y, 4 + hash(i + 8530) * 6, 1);
  }
  for (let y = pool + 3; y < height; y += 3) {
    const wob = Math.round(Math.sin(y * 0.5 + time * 2) * 2);
    if ((y >> 1) % 2) rect(ctx, 'rgba(255, 170, 90, 0.35)', 36 + wob, y, 5, 1);
    rect(ctx, 'rgba(170, 196, 214, 0.18)', 104 + (y - pool) * 0.6 + wob, y, 10, 1);
  }
  // Anemones glinting along the wet rock, softly, out of step.
  for (let i = 0; i < 12; i++) {
    const x = 150 + hash(i + 8600) * (W - 160);
    const y = pool - 3 - hash(i + 8610) * 8;
    const a = 0.35 + 0.35 * Math.sin(time * 1.3 + i * 2.1);
    ctx.fillStyle = `rgba(200, 255, 232, ${a.toFixed(3)})`;
    ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
  }
  // Drips off the stalactites.
  for (let i = 0; i < 5; i++) {
    const x = 20 + hash(i + 8700) * (W - 40);
    const fall = (time * 0.5 + hash(i + 8710)) % 1;
    if (fall < 0.7) rect(ctx, '#a8d8e0', x, 12 + (fall / 0.7) * (pool - 14), 1, 2);
    else rect(ctx, '#6a9a98', x - 2 + Math.round((fall - 0.7) * 10), pool + 1, 1, 1);
  }
}


// ---------- the ghost ship: the brig Fair Return, below decks and in the captain's cabin ----------
// Two stages: `ghostship` (every regular fight aboard: a dark gun deck, plank walls, ribs, two gun
// ports on a grey tilting sea, a swinging ship's lamp, hammocks, mist on the boards) and
// `ghostship_cabin` (the captain's fight: the stern windows on a dawn that never comes, the chart
// table, the compass, a crooked portrait, a lamp low). The whole room lists a little, slowly, the
// way a ship that is not afloat shouldn't. Nothing storms here (no lightning): it is a hushed,
// creaking place, and the fog rolls along the floor.
const PLANK = ['#2c2218', '#33281c', '#261d14', '#3a2e20'];
function drawPlanks(c, x0, y0, w, h, rowH, shadeAlpha) {
  for (let y = y0, row = 0; y < y0 + h; y += rowH, row++) {
    rect(c, PLANK[row % 4], x0, y, w, rowH - 1);
    rect(c, '#150f0a', x0, y + rowH - 1, w, 1);
    for (let x = x0 + ((row * 37) % 53); x < x0 + w; x += 53 + (row % 3) * 7) rect(c, '#150f0a', x, y, 1, rowH - 1);
    for (let k = 0; k < 3; k++) {
      const gx = x0 + Math.floor(hash(row * 9 + k + 4400) * w);
      rect(c, '#46382a', gx, y + 1 + (k % 2), 8 + k * 3, 1);
    }
  }
  if (shadeAlpha) rect(c, `rgba(2, 6, 6, ${shadeAlpha})`, x0, y0, w, h);
}
// A hammock slung between two hooks, swaying a little, a shape asleep in it.
function drawHammock(ctx, x, y, w, sway, shape) {
  const sag = 7;
  const swing = sway * 3;
  for (let i = 0; i <= w; i++) {
    const t = i / w;
    const yy = y + Math.sin(t * Math.PI) * sag + swing * Math.sin(t * Math.PI) * 0.5;
    rect(ctx, '#6a6a58', x + i, yy, 1, 2);
    rect(ctx, '#3e3e32', x + i, yy + 2, 1, 1);
  }
  if (shape) {
    oval(ctx, 'rgba(170, 200, 190, 0.35)', x + w * 0.5, y + sag - 2 + swing * 0.5, w * 0.34, 3);
    oval(ctx, 'rgba(200, 224, 216, 0.4)', x + w * 0.25, y + sag - 3 + swing * 0.4, 2.5, 2.5);
  }
  rect(ctx, '#2a2218', x - 1, y - 2, 2, 4);
  rect(ctx, '#2a2218', x + w, y - 2, 2, 4);
}
// The ship's lamp swinging from its hook, a warm pool under it.
function drawShipLamp(ctx, time, x, y, len, amp, rgb) {
  const a = Math.sin(time * 0.9 + x) * amp;
  const lx = x + Math.sin(a) * len;
  const ly = y + Math.cos(a) * len;
  for (let i = 0; i <= len; i += 2) rect(ctx, '#4a4a40', x + Math.sin(a) * i, y + Math.cos(a) * i, 1, 2);
  const flick = 0.85 + Math.sin(time * 11 + x) * 0.06 + Math.sin(time * 27 + x) * 0.04;
  glow(ctx, lx, ly + 3, 46, rgb, 0.3 * flick);
  glow(ctx, lx, ly + 3, 16, '255, 226, 150', 0.5 * flick);
  rect(ctx, '#14100a', lx - 4, ly - 2, 9, 11);
  rect(ctx, '#3a3226', lx - 3, ly - 1, 7, 2);
  rect(ctx, '#ffd88a', lx - 2, ly + 1, 5, 6);
  rect(ctx, '#fff2c0', lx - 1, ly + 2, 3, 3);
  rect(ctx, '#3a3226', lx - 4, ly + 8, 9, 2);
  rect(ctx, '#4a4a40', lx - 1, ly - 5, 3, 3);
}

function drawGhostShip(ctx, time, height) {
  const floor = height - 46;
  const still = cached('ghostship', height, (c) => {
    skyGradient(c, 0, height, ['#0a0e0e', '#121a18', '#1a2420']);
    // The hull's side: planking, darker toward the deckhead.
    drawPlanks(c, 0, 8, W, floor - 8, 7, 0);
    for (let y = 8; y < 60; y += 2) rect(c, `rgba(2, 6, 6, ${(((60 - y) / 52) * 0.72).toFixed(2)})`, 0, y, W, 2);
    // Ribs: heavy frames up the side, into a deck beam.
    for (const x of [8, 74, 140, 206, 272]) {
      rect(c, '#0e0a06', x, 6, 14, floor - 6);
      rect(c, '#2e2418', x + 1, 7, 11, floor - 8);
      rect(c, '#46382a', x + 2, 7, 1, floor - 8);
      rect(c, '#0e0a06', x - 3, 6, 20, 5);
      rect(c, '#2e2418', x - 2, 7, 18, 3);
      for (let y = 20; y < floor - 8; y += 18) { rect(c, '#14100a', x + 3, y, 2, 2); rect(c, '#14100a', x + 8, y + 7, 2, 2); }
    }
    // Two gun ports with a cannon each (the sea and the tilting horizon are drawn live, below).
    for (const gx of [34, 168]) {
      rect(c, '#0a0806', gx - 2, 40, 40, 36);
      rect(c, '#26323a', gx, 42, 36, 32);
      rect(c, '#46382a', gx - 3, 38, 42, 3);
      rect(c, '#0a0806', gx - 3, 74, 42, 3);
      rect(c, '#101012', gx + 2, 56, 36, 11);
      rect(c, '#2e2e34', gx + 3, 57, 33, 9);
      rect(c, '#4a4a54', gx + 3, 57, 33, 2);
      rect(c, '#101012', gx + 28, 54, 8, 15);
      rect(c, '#3a3a42', gx + 29, 55, 6, 13);
      rect(c, '#2a2014', gx - 2, 66, 40, 9);
      rect(c, '#46382a', gx - 2, 66, 40, 1);
      for (const wx of [gx + 6, gx + 28]) { oval(c, '#14100a', wx, 76, 5, 5); oval(c, '#46382a', wx, 76, 3, 3); }
    }
    // The deck: boards running away, darker at the back.
    skyGradient(c, floor, height, ['#1c150e', '#241b12', '#2e2318']);
    for (let y = floor; y < height; y += 2) {
      const k = (y - floor) / (height - floor);
      rect(c, '#120d08', 0, y, W, 1);
      for (let x = ((y * 17) % 41); x < W; x += 41) rect(c, '#120d08', x + Math.round(k * 5), y, 1, 2);
      if ((y >> 1) % 3 === 0) rect(c, '#3a2e20', 0, y + 1, W, 1);
    }
    rect(c, '#0a0806', 0, floor - 1, W, 2);
    rect(c, '#46382a', 0, floor - 2, W, 1);
    // A coil of rope and a stack of barrels in the corners.
    for (let r = 0; r < 5; r++) oval(c, r % 2 ? '#5a4a32' : '#6a5a3c', 296, floor - 4 - r * 2, 12 - r, 2);
    for (const [bx, by] of [[16, floor - 3], [32, floor - 3], [24, floor - 14]]) {
      oval(c, '#0e0a06', bx, by, 9, 8);
      oval(c, '#4a3a28', bx, by, 8, 7);
      rect(c, '#2a2014', bx - 8, by - 3, 16, 1);
      rect(c, '#2a2014', bx - 8, by + 3, 16, 1);
      rect(c, '#14100a', bx - 8, by - 1, 16, 1);
    }
  });
  ctx.drawImage(still, 0, 0);
  // The grey sea in the ports, the horizon rolling slowly (the ship lists a little, and back).
  const roll = Math.sin(time * 0.45) * 0.14;
  for (const gx of [34, 168]) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(gx, 42, 36, 32);
    ctx.clip();
    ctx.translate(gx + 18, 58);
    ctx.rotate(roll);
    rect(ctx, '#46585c', -40, -40, 80, 40);
    rect(ctx, '#7a8c88', -40, -3, 80, 2);
    rect(ctx, '#1e3030', -40, -1, 80, 42);
    for (let i = 0; i < 5; i++) rect(ctx, '#3a5252', -30 + i * 14 + Math.round(Math.sin(time * 0.8 + i) * 3), 4 + i * 3, 8, 1);
    rect(ctx, '#18242a', -8, -22, 2, 20);
    rect(ctx, '#18242a', -12, -16, 10, 1);
    ctx.restore();
  }
  // Hammocks, asleep, swaying on the far side.
  drawHammock(ctx, 104, 30, 30, Math.sin(time * 0.5), true);
  drawHammock(ctx, 240, 30, 34, Math.sin(time * 0.5 + 1.4), true);
  drawHammock(ctx, 244, 44, 30, Math.sin(time * 0.5 + 2.8), false);
  // The ship's lamps, swinging.
  drawShipLamp(ctx, time, 126, 8, 24, 0.07, '255, 190, 100');
  drawShipLamp(ctx, time, 268, 8, 20, 0.06, '255, 190, 100');
  // Cold light from the ports, lying on the deck.
  for (const gx of [34, 168]) poly(ctx, 'rgba(150, 190, 180, 0.07)', [[gx, 74], [gx + 36, 74], [gx + 72, floor + 30], [gx + 20, floor + 30]]);
  // Mist along the boards, drifting.
  mist(ctx, time, floor - 6, 40, '150, 176, 168', 0.2, 4600, 7);
  mist(ctx, time * 0.6, floor + 4, 30, '170, 192, 184', 0.16, 4650, 5);
  // Drips off the deckhead.
  for (let i = 0; i < 4; i++) {
    const x = 20 + hash(i + 4700) * (W - 40);
    const fall = (time * 0.45 + hash(i + 4710)) % 1;
    if (fall < 0.7) rect(ctx, '#7a9a98', x, 10 + (fall / 0.7) * (floor - 12), 1, 2);
  }
  vignette(ctx, height, '2, 6, 6', 0.62);
}

function drawGhostCabin(ctx, time, height) {
  const floor = height - 44;
  const still = cached('ghostship_cabin', height, (c) => {
    skyGradient(c, 0, height, ['#0c1010', '#14201c', '#1c2822']);
    // The cabin's stern wall: painted panels, the paint gone grey-green with damp.
    for (let x = 0; x < W; x += 22) {
      rect(c, '#162420', x + 1, 8, 20, floor - 12);
      rect(c, '#223630', x + 2, 9, 18, 1);
      rect(c, '#0a1210', x + 4, 20, 14, floor - 36);
      rect(c, '#1c2c28', x + 5, 21, 12, floor - 38);
    }
    rect(c, '#0a1210', 0, 6, W, 4);
    rect(c, '#3a2e20', 0, 7, W, 2);
    // The stern windows: three tall panes in a bay, mullions of black wood.
    rect(c, '#0a0806', 78, 14, 164, 66);
    rect(c, '#3a2e20', 80, 16, 160, 62);
    for (const wx of [84, 140, 196]) rect(c, '#0e1a1c', wx, 20, 40, 54);
    for (let y = 20; y < 74; y += 2) {
      const t = (y - 20) / 54;
      for (const wx of [84, 140, 196]) rect(c, mix('#26383a', '#7a8c88', t * t), wx, y, 40, 2);
    }
    for (const wx of [82, 124, 138, 180, 194, 236]) rect(c, '#0a0806', wx, 18, 3, 58);
    rect(c, '#0a0806', 78, 46, 164, 2);
    rect(c, '#46382a', 76, 76, 168, 4);
    rect(c, '#0a0806', 76, 80, 168, 2);
    // The deck.
    drawPlanks(c, 0, floor, W, height - floor, 5, 0);
    rect(c, '#0a0806', 0, floor - 1, W, 2);
    rect(c, '#46382a', 0, floor - 2, W, 1);
    // A heavy chart table, a chart on it with nothing drawn on it any more.
    rect(c, '#0a0806', 118, floor - 18, 84, 4);
    rect(c, '#46382a', 119, floor - 19, 82, 2);
    rect(c, '#2a2014', 120, floor - 17, 80, 3);
    rect(c, '#d8d0b0', 128, floor - 22, 60, 4);
    rect(c, '#b8b090', 128, floor - 19, 60, 1);
    for (const lx of [124, 194]) { rect(c, '#0a0806', lx, floor - 14, 4, 14); rect(c, '#2a2014', lx + 1, floor - 14, 2, 14); }
    // A bookshelf at the left, books leaning; a portrait frame at the right.
    rect(c, '#0a0806', 12, 22, 46, 52);
    rect(c, '#2a2014', 14, 24, 42, 48);
    for (const sy of [34, 48, 62]) rect(c, '#0a0806', 14, sy, 42, 2);
    for (let i = 0; i < 18; i++) {
      const sy = [24, 38, 52][Math.floor(i / 6)];
      const bx = 15 + (i % 6) * 7;
      rect(c, ['#4a2a26', '#2a4a4a', '#4a4026', '#303a4a'][i % 4], bx, sy + (i % 3), 5, 10 - (i % 3));
    }
    rect(c, '#0a0806', 262, 22, 30, 36);
    rect(c, '#6a5430', 264, 24, 26, 32);
    rect(c, '#14201c', 267, 27, 20, 26);
  });
  ctx.drawImage(still, 0, 0);
  // The dawn in the windows: grey, thin, never brighter, with the horizon rocking a little.
  const roll = Math.sin(time * 0.38) * 0.1;
  for (const wx of [84, 140, 196]) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(wx, 20, 40, 54);
    ctx.clip();
    ctx.translate(wx + 20, 48);
    ctx.rotate(roll);
    rect(ctx, '#7a8c88', -40, -40, 80, 38);
    rect(ctx, '#aab8b0', -40, -6, 80, 5);
    rect(ctx, '#c8d0c4', -40, -3, 80, 2);
    rect(ctx, '#2c4040', -40, -1, 80, 50);
    for (let i = 0; i < 4; i++) rect(ctx, '#4a6464', -30 + i * 16 + Math.round(Math.sin(time * 0.7 + i) * 3), 5 + i * 4, 9, 1);
    ctx.restore();
  }
  glow(ctx, 160, 48, 80, '150, 176, 168', 0.14);
  // Streaks of damp on the glass, and a crack.
  for (const wx of [84, 140, 196]) {
    rect(ctx, 'rgba(200, 224, 216, 0.1)', wx + 4, 22, 3, 50);
    rect(ctx, 'rgba(200, 224, 216, 0.06)', wx + 26, 22, 2, 50);
  }
  line(ctx, 'rgba(220, 240, 232, 0.35)', 150, 30, 160, 52);
  line(ctx, 'rgba(220, 240, 232, 0.35)', 160, 52, 156, 66);
  // The compass on the table, its needle going round slowly, looking for ground.
  const cx = 168;
  const cy = height - 44 - 21;
  oval(ctx, '#0a0806', cx, cy, 5, 2);
  oval(ctx, '#c8a040', cx, cy, 4, 1);
  const na = time * 0.7;
  rect(ctx, '#f4f0dc', cx + Math.round(Math.cos(na) * 3), cy, 1, 1);
  rect(ctx, '#c8442a', cx - Math.round(Math.cos(na) * 3), cy, 1, 1);
  // The portrait, its eyes turning from side to side (not quite together).
  rect(ctx, '#c8d0c4', 274, 33, 10, 12);
  rect(ctx, '#8a9a94', 274, 40, 10, 5);
  rect(ctx, '#26323a', 272, 29, 14, 5);
  const look = Math.sin(time * 0.6) > 0 ? -1 : 0;
  rect(ctx, '#101a1c', 275 + look, 37, 2, 2);
  rect(ctx, '#101a1c', 281 + look, 37, 2, 2);
  rect(ctx, '#101a1c', 277, 43, 5, 1);
  // The lamp over the table, low, swinging gently.
  drawShipLamp(ctx, time, 160, 8, 16, 0.05, '255, 170, 90');
  // A candle stub guttering on the sill.
  rect(ctx, '#e8dcc0', 224, 70, 3, 5);
  const fl = 1 + Math.sin(time * 13) * 0.2;
  rect(ctx, '#ffd88a', 225, 68 - Math.round(fl), 1, 2);
  glow(ctx, 225, 68, 20, '255, 190, 100', 0.25 * fl);
  // Fog rolling in under the door along the boards.
  mist(ctx, time, floor - 4, 34, '150, 176, 168', 0.22, 4800, 6);
  mist(ctx, time * 0.5, floor + 3, 28, '170, 192, 184', 0.16, 4850, 5);
  vignette(ctx, height, '2, 6, 6', 0.6);
}

// `ghostship_perch` (Madam Fairweather's fight: the bowsprit's end, the figurehead's perch): open
// sea under a sky that is mostly stars, a fog bank on the water, the brig's bow planking and a
// gilt rail under you, and now and then a star that lets go and falls.
function drawGhostPerch(ctx, time, height) {
  const floor = height - 40;
  const still = cached('ghostship_perch', height, (c) => {
    skyGradient(c, 0, height, ['#04060e', '#0a1424', '#16283a']);
    for (let i = 0; i < 90; i++) {
      const x = Math.floor(hash(i + 5100) * W);
      const y = Math.floor(hash(i + 5200) * (floor - 30));
      rect(c, i % 7 === 0 ? '#bff4ff' : i % 3 === 0 ? '#8aa8c8' : '#4a6a88', x, y, 1, 1);
      if (i % 11 === 0) { rect(c, '#bff4ff', x - 1, y, 3, 1); rect(c, '#bff4ff', x, y - 1, 1, 3); }
    }
    // The sea: black, with a long swell and the pale of the fog on it.
    rect(c, '#0a1a28', 0, floor - 24, W, 24);
    for (let y = floor - 24; y < floor; y += 3) rect(c, y % 6 ? '#10283a' : '#16364a', 0, y, W, 1);
    // The bow: planking running off to the right, a gilt rail along its edge, a stay going up.
    drawPlanks(c, 0, floor, W, height - floor, 5, 0);
    rect(c, '#0a0806', 0, floor - 1, W, 2);
    rect(c, '#9a7220', 0, floor - 3, W, 2);
    rect(c, '#e8c060', 0, floor - 4, W, 1);
    for (let x = 6; x < W; x += 26) { rect(c, '#0a0806', x, floor - 12, 4, 10); rect(c, '#9a7220', x + 1, floor - 12, 2, 9); rect(c, '#e8c060', x, floor - 13, 4, 2); }
    line(c, '#2a2014', 300, floor - 3, 250, 6);
    line(c, '#2a2014', 20, floor - 3, 70, 6);
  });
  ctx.drawImage(still, 0, 0);
  // The sky never quite keeps still: a slow green-white wash, and a falling star now and then.
  glow(ctx, 160, 30, 110, '120, 190, 220', 0.07 + 0.03 * Math.sin(time * 0.7));
  for (let k = 0; k < 2; k++) {
    const ph = (time * 0.32 + k * 0.5) % 1;
    if (ph < 0.25) {
      const u = ph / 0.25;
      const sx = 60 + hash(k + Math.floor(time * 0.32 + k * 0.5) * 3) * 200 - u * 40;
      const sy = 6 + u * 60;
      rect(ctx, '#ffffff', sx, sy, 2, 2);
      for (let q = 1; q < 6; q++) rect(ctx, `rgba(191, 244, 255, ${(0.5 - q * 0.08).toFixed(2)})`, sx + q * 2, sy - q * 1.5, 1, 1);
    }
  }
  mist(ctx, time, floor - 8, 26, '120, 150, 170', 0.2, 5200, 6);
  mist(ctx, time * 0.6, floor + 2, 24, '150, 176, 190', 0.14, 5250, 5);
  vignette(ctx, height, '2, 4, 10', 0.55);
}

// A backdrop is drawn with the battle as its fourth argument; `stormOver` picks the calm version.
const calmFor = (battle) => Boolean(battle?.stormOver);

export const COAST_BACKDROPS = {
  gullrest: drawGullrest,
  cliff_cave: drawCliffCave,
  wrack: (ctx, time, height, battle) => drawWrack(ctx, time, height, calmFor(battle)),
  saltcombe: (ctx, time, height, battle) => drawSaltcombe(ctx, time, height, calmFor(battle)),
  lanes: (ctx, time, height, battle) => drawLanes(ctx, time, height, calmFor(battle)),
  wreck: (ctx, time, height, battle) => drawWreck(ctx, time, height, calmFor(battle)),
  merrow: (ctx, time, height, battle) => drawMerrow(ctx, time, height, calmFor(battle)),
  merrow_belfry: (ctx, time, height, battle) => drawBelfry(ctx, time, height, calmFor(battle)),
  soundings: (ctx, time, height, battle) => drawSoundings(ctx, time, height, calmFor(battle)),
  isles: (ctx, time, height, battle) => drawIsles(ctx, time, height, false, calmFor(battle)),
  haddock_light: (ctx, time, height, battle) => drawIsles(ctx, time, height, true, calmFor(battle)),
  reach: (ctx, time, height, battle) => drawReach(ctx, time, height, calmFor(battle)),
  lastlight: (ctx, time, height, battle) => drawLastLight(ctx, time, height, calmFor(battle)),
  // The brig Fair Return (see src/battle/attacks/ghost_deckhand.js and friends): below decks, and the captain's cabin.
  ghostship: (ctx, time, height) => drawGhostShip(ctx, time, height),
  ghostship_cabin: (ctx, time, height) => drawGhostCabin(ctx, time, height),
  ghostship_perch: (ctx, time, height) => drawGhostPerch(ctx, time, height),
};
