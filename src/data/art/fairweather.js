// MADAM FAIRWEATHER, 64x72: the figurehead of the brig Fair Return, carved from one block of wood and come alive, facing
// left (toward you). THE LONELY HOSTESS (concept 4 of notes/stills/fairweather-v5, drawn there by concepts.py with kit.py;
// this is that code, ported line for line, then posed).
//   Her face is a painted wooden MASK: flat ivory with a carved rim, painted eye lines with an iris dot, single-arc brows,
//   a hard triangle nose, a tiny mouth, flat round rouge, a seam down the side, chips to the wood, and a check under one eye
//   like the track of a tear. Every face she makes is that mask, repainted.
//   Her body is one block: thick smooth arms, mitten hands, a gown in a few big flat folds with a gilt-banded neckline,
//   an iron strap bolting her back to the stem, and the gown running down into the gilt scroll on the knee.
//   Carved ribbon hair, painted walnut. One hand pressed over the star in her breast (its light leaks between the
//   fingers); the other held open toward you. Still dressed for the party: on the empty deck behind her, a lantern,
//   a goblet tipped on the rail, a streamer gone slack.
// The life of the party, who never wanted to be left alone: she keeps looking back at the empty deck, then at you, as if
// checking you are still there.
//
// Four looks, one per phase (see src/data/enemies/fairweather.js):
//   LAUGH      the hostess: gazing at the deck, glancing back at you, the light pulsing under her hand
//   SHOWER     the light gets out: more of it between her fingers, the paint cracking over it
//   CAROUSEL   she asks you to dance: the mask turned to you, delighted, the hand beckoning, swaying, more cracks
//   CHAOS      split along the grain, light in every crack, the mask slipped askew, its eyes lit and nobody in them
// Spared she settles, both hands over the star, the mask serene. Beaten she turns away to the empty deck as the star
// goes out.
//
// `figure` draws her alone (the overworld uses it too: src/data/art/figureheadWake.js); `draw` puts the bow behind her.
export const FAIRWEATHER_PALETTE = {
  k: '#140c0c',
  // ship's wood, and raw split wood where the carving has torn
  1: '#1c1510', 2: '#33271c', 3: '#4c3b2a', 4: '#6a5640', 5: '#8a7456', W: '#b8976a',
  // gilt
  a: '#4a3410', b: '#8a6420', c: '#c49a38', d: '#f0d070',
  // her paint: an old ship's ivory (paint on wood, never skin), the carved rim and seam, grain showing through
  P: '#eee2c4', p: '#d2c3a0', o: '#a39272', O: '#6c5c44', 6: '#d8c8a4', 7: '#b4a27f',
  // painted eyes, lips, a round dab of rouge
  K: '#24161a', z: '#2a5a86', r: '#c0353f', R: '#7e2230', y: '#e2a28e',
  // carved hair, painted walnut
  n: '#24160c', N: '#5a3e26', M: '#7e5a3a', m: '#c49a66',
  // her gown: a figurehead green
  G: '#14362c', g: '#235846', H: '#3a7c60', X: '#70ae8c',
  // the party left on the deck: a streamer, a paper lantern
  '&': '#dc6e8c', '*': '#8a3a54', $: '#4ca69c', '+': '#286660',
  // iron (the strap)
  I: '#262e36', j: '#4c5864', J: '#8a9aa6',
  // foam
  f: '#9fc2c4', F: '#e2f2f0',
  // the star (the Wreck Star Shard), its halos and motes
  w: '#ffffff', s: '#bff4ff', S: '#4ab8e0', Z: '#2a7aa8',
  t: 'rgba(191, 244, 255, 0.5)', T: 'rgba(120, 210, 240, 0.22)', x: 'rgba(255, 255, 255, 0.85)',
};

const W = 64;
const H = 72;

// Python's round (halves to even), so every pixel lands where the concept's did.
const pr = (v) => {
  const f = Math.floor(v);
  if (v - f === 0.5) return f % 2 === 0 ? f : f + 1;
  return Math.round(v);
};

// The concept kit's Pix (notes/stills/fairweather-v5/kit.py), method for method.
class KPix {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.g = Array.from({ length: h }, () => Array(w).fill('.'));
  }

  set(x, y, c) {
    x = pr(x); y = pr(y);
    if (x >= 0 && x < this.w && y >= 0 && y < this.h) this.g[y][x] = c;
    return this;
  }

  get(x, y) {
    return x >= 0 && x < this.w && y >= 0 && y < this.h ? this.g[y][x] : '.';
  }

  put(x, y, c, only = null) {
    x = pr(x); y = pr(y);
    if (!(x >= 0 && x < this.w && y >= 0 && y < this.h)) return this;
    const v = this.g[y][x];
    if (only === null || v === only || (Array.isArray(only) && only.includes(v))) this.g[y][x] = c;
    return this;
  }

  rect(x, y, w, h, c, only = null) {
    for (let j = 0; j < Math.trunc(h); j++) for (let i = 0; i < Math.trunc(w); i++) this.put(x + i, y + j, c, only);
    return this;
  }

  ellipse(cx, cy, rx, ry, c, only = null) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        const dx = (x - cx) / (rx + 0.35);
        const dy = (y - cy) / (ry + 0.35);
        if (dx * dx + dy * dy <= 1) this.put(x, y, c, only);
      }
    }
    return this;
  }

  ring(cx, cy, rx, ry, c, thick = 1.1) {
    for (let y = Math.floor(cy - ry - 1); y <= Math.ceil(cy + ry + 1); y++) {
      for (let x = Math.floor(cx - rx - 1); x <= Math.ceil(cx + rx + 1); x++) {
        const dx = (x - cx) / (rx + 0.35);
        const dy = (y - cy) / (ry + 0.35);
        const d = dx * dx + dy * dy;
        const inner = ((rx - thick) / (rx + 0.35)) ** 2;
        if (d <= 1 && d >= Math.max(0, inner)) this.put(x, y, c);
      }
    }
    return this;
  }

  line(x0, y0, x1, y1, c, thick = 1, only = null) {
    const n = Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))) * 2 || 1;
    for (let i = 0; i <= n; i++) {
      const x = x0 + ((x1 - x0) * i) / n;
      const y = y0 + ((y1 - y0) * i) / n;
      if (thick <= 1) this.put(x, y, c, only);
      else this.ellipse(x, y, (thick - 1) / 2, (thick - 1) / 2, c, only);
    }
    return this;
  }

  curve(pts, c, thick = 1, n = 48, only = null) {
    const out = bez(pts, n);
    for (let i = 0; i + 1 < out.length; i++) this.line(out[i][0], out[i][1], out[i + 1][0], out[i + 1][1], c, thick, only);
    return out;
  }

  poly(pts, c, only = null) {
    const ys = pts.map((q) => q[1]);
    for (let y = Math.floor(Math.min(...ys)); y <= Math.ceil(Math.max(...ys)); y++) {
      const xs = [];
      for (let i = 0; i < pts.length; i++) {
        const [ax, ay] = pts[i];
        const [bx, by] = pts[(i + 1) % pts.length];
        if ((ay <= y && y < by) || (by <= y && y < ay)) xs.push(ax + ((y - ay) / (by - ay)) * (bx - ax));
      }
      xs.sort((a, b) => a - b);
      for (let i = 0; i + 1 < xs.length; i += 2) for (let x = pr(xs[i]); x < pr(xs[i + 1]); x++) this.put(x, y, c, only);
    }
    return this;
  }

  outline(c = 'k') {
    const filled = this.g.map((row) => row.map((v) => v !== '.'));
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        if (filled[y][x]) continue;
        if ((y > 0 && filled[y - 1][x]) || (y < this.h - 1 && filled[y + 1][x]) || (x > 0 && filled[y][x - 1]) || (x < this.w - 1 && filled[y][x + 1])) this.g[y][x] = c;
      }
    }
    return this;
  }

  over(other, dx = 0, dy = 0) {
    for (let y = 0; y < other.h; y++) for (let x = 0; x < other.w; x++) {
      const v = other.g[y][x];
      if (v !== '.') this.set(x + dx, y + dy, v);
    }
    return this;
  }

  rows() {
    return this.g.map((row) => row.join(''));
  }
}

const hsh = (x, y, seed = 0) => { const v = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453; return v - Math.floor(v); };

function bez(pts, n = 40) {
  const out = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    let q = pts.map((v) => [...v]);
    while (q.length > 1) q = q.slice(1).map((b, j) => [(1 - t) * q[j][0] + t * b[0], (1 - t) * q[j][1] + t * b[1]]);
    out.push(q[0]);
  }
  return out;
}

// ---------------------------------------------------------------------------------------------------------------
// The carver's tools (concepts.py)
// ---------------------------------------------------------------------------------------------------------------

// A carved band along a bezier: w0 wide at the start, w1 at the end; `lead` lights one edge, `back` darkens the other.
function band(p, pts, w0, w1, fill, lead = null, back = null, groove = null, only = null, n = 60) {
  const c = bez(pts, n);
  const A = [];
  const B = [];
  c.forEach(([x, y], i) => {
    const [x2, y2] = c[Math.min(i + 1, c.length - 1)];
    const [x1, y1] = c[Math.max(i - 1, 0)];
    const dx = x2 - x1;
    const dy = y2 - y1;
    const d = Math.hypot(dx, dy) || 1;
    const nx = -dy / d;
    const ny = dx / d;
    const w = (w0 + ((w1 - w0) * i) / (c.length - 1)) / 2;
    A.push([x + nx * w, y + ny * w]);
    B.push([x - nx * w, y - ny * w]);
  });
  p.poly([...A, ...B.slice().reverse()], fill, only);
  for (let i = 0; i + 1 < c.length; i++) p.line(c[i][0], c[i][1], c[i + 1][0], c[i + 1][1], fill, 1, only);
  let sa = 0;
  let sb = 0;
  for (const [x, y] of A) sa += y + x * 0.5;
  for (const [x, y] of B) sb += y + x * 0.5;
  const [lit, dark] = sa < sb ? [A, B] : [B, A];
  if (lead) for (let i = 0; i + 1 < lit.length; i++) p.line(lit[i][0], lit[i][1], lit[i + 1][0], lit[i + 1][1], lead, 1, [fill]);
  if (back) for (let i = 0; i + 1 < dark.length; i++) p.line(dark[i][0], dark[i][1], dark[i + 1][0], dark[i + 1][1], back, 1, [fill, lead]);
  if (groove) for (let i = 3; i < c.length - 6; i++) p.line(c[i][0], c[i][1], c[i + 1][0], c[i + 1][1], groove, 1, [fill, lead, back]);
  return c;
}

// A carved volute: a spiral band, lit on top.
function scroll(p, cx, cy, r, turn = 1, c1 = 'c', c2 = 'd', c3 = 'b', turns = 2.1, thick = 2) {
  const pts = [];
  const n = 80;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = turn * (t * turns * 2 * Math.PI) - Math.PI / 2;
    const rr = r * (1 - t * 0.85);
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  for (let i = 0; i + 1 < pts.length; i++) p.line(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], c1, thick);
  for (let i = 0; i + 1 < pts.length; i++) {
    const [ax, ay] = pts[i];
    const [bx, by] = pts[i + 1];
    if ((ay + by) / 2 < cy) p.line(ax, ay, bx, by, c2);
    else p.line(ax + 0.5, ay + 0.5, bx + 0.5, by + 0.5, c3);
  }
  p.set(cx, cy, c2);
}

// Carved parallel grooves along a lock or a fold: k dark cuts, each with a lit lip above it.
function incise(p, pts, w0, w1, colours, cut, lit, k = 2) {
  for (let j = 0; j < k; j++) {
    const f = (j + 1) / (k + 1) - 0.5;
    const c = bez(pts, 60);
    let line = c.map(([x, y], i) => {
      const [x2, y2] = c[Math.min(i + 1, c.length - 1)];
      const [x1, y1] = c[Math.max(i - 1, 0)];
      const dx = x2 - x1;
      const dy = y2 - y1;
      const dd = Math.hypot(dx, dy) || 1;
      const w = w0 + ((w1 - w0) * i) / (c.length - 1);
      return [x - dy / dd * w * f, y + dx / dd * w * f];
    });
    line = line.slice(4, -8);
    for (let i = 0; i + 1 < line.length; i++) p.line(line[i][0], line[i][1] - 1, line[i + 1][0], line[i + 1][1] - 1, lit, 1, colours);
    for (let i = 0; i + 1 < line.length; i++) p.line(line[i][0], line[i][1], line[i + 1][0], line[i + 1][1], cut, 1, [...colours, lit]);
  }
}

// The walnut hair: fill, lit edge, dark edge, groove, mid.
const HAIR = ['N', 'm', 'n', 'k', 'm'];
const GOWN = ['G', 'g', 'H', 'X'];

// One carved lock of hair: a broad ribbon cut with grooves, lit along its top, ending in a tight curl.
function lock(p, pts, w0, w1, hair, curl = true, turn = 1, cuts = 1) {
  const [f, lead, back, groove, mid] = hair;
  const q = new KPix(p.w, p.h);
  const c = band(q, pts, w0, w1, f, lead, back);
  incise(q, pts, w0, w1, [f], back, mid, cuts);
  if (curl) {
    const [ex, ey] = c[c.length - 1];
    scroll(q, ex, ey + w1 * 0.3, Math.max(1.6, w1 * 0.8), turn, f, lead, back, 1.3, 2);
  }
  q.outline(groove);
  p.over(q);
  return c;
}

// A patch where the paint has gone and the bare wood shows, grain and all, with a lit rim of paint edge.
function worn(p, cx, cy, rx, ry, seed, on, slope = 0.4) {
  const pts = [];
  const key = new Set();
  for (let y = Math.trunc(cy - ry - 1); y < Math.trunc(cy + ry + 2); y++) {
    for (let x = Math.trunc(cx - rx - 1); x < Math.trunc(cx + rx + 2); x++) {
      const dx = (x - cx) / rx;
      const dy = (y - cy) / ry;
      if (dx * dx + dy * dy <= 0.75 + 0.5 * hsh(x, y, seed) && on.includes(p.get(x, y))) { pts.push([x, y]); key.add(`${x},${y}`); }
    }
  }
  for (const [x, y] of pts) p.set(x, y, pr(y - x * slope) % 3 === 0 ? '3' : '4');
  for (const [x, y] of pts) if (!key.has(`${x},${y - 1}`) && on.includes(p.get(x, y - 1))) p.set(x, y, '5');
}

// Stamps a hand-drawn grid ('.' = leave alone), mirrored if `flip`.
function stamp(p, x, y, rows, flip = false) {
  rows.forEach((row, j) => {
    const r = flip ? [...row].reverse() : [...row];
    r.forEach((c, i) => { if (c !== '.') p.set(x + i, y + j, c); });
  });
}

// Pixel-art doubling (Scale2x), for turning a grid cleanly.
function scale2x(rows) {
  const h = rows.length;
  const w = rows[0].length;
  const g = (x, y) => rows[Math.min(Math.max(y, 0), h - 1)][Math.min(Math.max(x, 0), w - 1)];
  const out = Array.from({ length: h * 2 }, () => Array(w * 2));
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const P = g(x, y); const A = g(x, y - 1); const B = g(x + 1, y); const C = g(x - 1, y); const D = g(x, y + 1);
    out[y * 2][x * 2] = C === A && C !== D && A !== B ? A : P;
    out[y * 2][x * 2 + 1] = A === B && A !== C && B !== D ? B : P;
    out[y * 2 + 1][x * 2] = D === C && D !== B && C !== A ? C : P;
    out[y * 2 + 1][x * 2 + 1] = B === D && B !== A && D !== C ? D : P;
  }
  return out.map((r) => r.join(''));
}

// Turns a hand-drawn grid by deg (clockwise on screen) the RotSprite way; the result is `pad` bigger all round.
function rotateGrid(rows, deg, pad = 3) {
  const w = rows[0].length + pad * 2;
  const h = rows.length + pad * 2;
  let big = [...Array(pad).fill('.'.repeat(w)), ...rows.map((r) => '.'.repeat(pad) + r + '.'.repeat(pad)), ...Array(pad).fill('.'.repeat(w))];
  for (let i = 0; i < 3; i++) big = scale2x(big);
  const a = (deg * Math.PI) / 180;
  const ca = Math.cos(a);
  const sa = Math.sin(a);
  const cx = w / 2;
  const cy = h / 2;
  const out = [];
  for (let y = 0; y < h; y++) {
    let row = '';
    for (let x = 0; x < w; x++) {
      const dx = x + 0.5 - cx;
      const dy = y + 0.5 - cy;
      const bx = Math.trunc((cx + dx * ca + dy * sa) * 8);
      const by = Math.trunc((cy - dx * sa + dy * ca) * 8);
      row += bx >= 0 && bx < w * 8 && by >= 0 && by < h * 8 ? big[by][bx] : '.';
    }
    out.push(row);
  }
  return out;
}

// Paint flaked off to the wood: a few flakes, most of them at edges and corners.
function chips(p, x0, y0, x1, y1, seed, rate = 0.02, on = ['P', 'p', '6', '7'], wood = '4') {
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    if (!on.includes(p.get(x, y))) continue;
    let edge = 0;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (['k', '.'].includes(p.get(x + dx, y + dy))) edge++;
    if (hsh(x, y, seed) < rate * (1 + 3.5 * edge)) p.set(x, y, wood);
  }
}

// A paper party lantern on its post: a gilt cap, a ribbed paper body, a tassel.
function lantern(p, x, y, c1, c2, tall = 4) {
  p.set(x + 1, y + 1, 'b');
  p.rect(x, y + 2, 3, tall, c1);
  p.line(x + 2, y + 2, x + 2, y + tall + 1, c2);
  for (let j = 1; j < tall; j += 2) p.set(x + 1, y + 2 + j, c2);
  if (tall >= 4) { p.set(x - 1, y + 3, c1); p.set(x + 3, y + 3, c2); p.set(x - 1, y + 4, c1); p.set(x + 3, y + 4, c2); }
  p.set(x + 1, y + tall + 2, 'b');
  p.set(x + 1, y + tall + 3, c1);
}

// A carved party streamer: a thin ribbon twisting as it goes.
function streamer(p, pts, c1, c2, n = 50) {
  const c = bez(pts, n);
  for (let i = 0; i + 1 < c.length; i++) p.line(c[i][0], c[i][1], c[i + 1][0], c[i + 1][1], Math.floor(i / 4) % 2 === 0 ? c1 : c2, 2);
  const [ex, ey] = c[c.length - 1];
  p.set(ex, ey + 1, c2);
  p.set(ex - 1, ey + 2, c1);
}

// A thick smooth carved arm: flat ivory, one hard side plane underneath.
function arm5(p, pts, w0 = 6, w1 = 5) {
  const c = band(p, pts, w0, w1, 'P', null, 'p');
  band(p, pts.map(([x, y]) => [x, y + w0 * 0.28]), w0 * 0.35, w1 * 0.35, 'p', null, null, null, ['P']);
  return c;
}

// The wood bending more than wood bends: a split at the joint, raw wood in it. `wide` opens it further, flakes falling.
function elbowCrack(p, x, y, wide = 0, fall = 0) {
  p.set(x, y, 'k'); p.set(x, y + 1, 'k'); p.set(x - 1, y + 2, 'k');
  p.set(x + 1, y, 'W'); p.set(x + 1, y + 1, 'W'); p.set(x, y + 2, 'W'); p.set(x - 1, y - 1, 'O');
  if (wide) {
    p.set(x + 1, y - 1, 'k'); p.set(x - 1, y + 3, 'k'); p.set(x + 2, y, 'W'); p.set(x - 2, y + 3, 'W'); p.set(x, y + 3, 'W');
    p.set(x + 1, y + 4 + fall, 'W'); p.set(x - 1, y + 6 + fall * 2, 'W');
  }
}

// Where the carver doweled the arm on: a seam ring and a peg.
function shoulderJoint(p, cx, cy, r = 2.4) {
  p.ring(cx, cy, r, r, 'O', 1.0);
  p.set(cx, cy, 'O');
}

// An iron strap bolting her back to the stem.
function strap(p, a, b) {
  p.line(a[0], a[1], b[0], b[1], 'I', 3);
  p.line(a[0], a[1] - 1, b[0], b[1] - 1, 'j');
  const n = Math.trunc(Math.floor(Math.hypot(b[0] - a[0], b[1] - a[1]) / 4));
  for (let k = 0; k <= n; k++) {
    const x = a[0] + ((b[0] - a[0]) * k) / Math.max(n, 1);
    const y = a[1] + ((b[1] - a[1]) * k) / Math.max(n, 1);
    p.set(x, y, 'J'); p.set(x + 1, y + 1, 'k');
  }
}

// One block: a thick neck, a chest pushed out as a single form, a flat bodice, a gilt band neckline.
function torso5(p, gown) {
  const [D, M] = gown;
  p.poly([[10, 31], [27, 27], [31, 33], [33, 40], [13, 43], [9, 37]], M);
  p.poly([[25, 28], [27, 27], [31, 33], [33, 40], [26, 41]], D, [M]);
  p.poly([[11, 20], [20, 19], [24, 25], [28, 27], [27, 31], [10, 32], [8, 29], [11, 25]], 'P');
  p.poly([[19, 19], [24, 25], [28, 27], [27, 31], [22, 31], [21, 24]], 'p', ['P']);
  p.line(9, 31, 27, 27, 'c', 2); p.line(9, 30, 27, 26, 'd');
  p.line(12, 43, 33, 39, 'c', 3); p.line(12, 42, 33, 38, 'd');
}

// The gown in a few big flat folds: a lit plane, a shadow plane, two deep grooves, a gilt hem.
function skirt5(p, gown) {
  const [D, M] = gown;
  p.poly([[12, 44], [33, 40], [40, 45], [47, 52], [49, 60], [44, 66], [34, 67], [23, 61], [15, 52]], M);
  p.poly([[31, 41], [33, 40], [40, 45], [47, 52], [49, 60], [44, 65], [38, 54]], D, [M]);
  for (const pts of [[[19, 44], [21, 54], [31, 63]], [[26, 43], [30, 52], [39, 60]]]) p.curve(pts, D, 2, 30, [M]);
  p.curve([[15, 52], [22, 61], [34, 67], [44, 66]], 'c', 2, 40);
}

// Where the gown becomes the ship: a great gilt volute on the knee of the head, the knee running down below.
function kneeScroll(p, cx = 42, cy = 61, r = 7) {
  band(p, [[cx - 2, cy + 3], [cx + 4, cy + 9], [cx + 8, cy + 14]], 7, 7, '3', '5', '2');
  scroll(p, cx, cy, r, -1, 'c', 'd', 'b', 2.1, 2);
}

// Carved hair framing the mask: a thick roll over the brow, cut with a groove.
function hairCap(p, hair, x, y) {
  const [f, lead, back, groove, mid] = hair;
  const q = new KPix(p.w, p.h);
  const pts = [[x - 1, y + 9], [x + 1, y - 3], [x + 13, y - 3], [x + 14, y + 9]];
  band(q, pts, 5, 5, f, lead, back);
  incise(q, pts, 5, 5, [f], back, mid, 1);
  q.outline(groove);
  p.over(q);
}

// ---------------------------------------------------------------------------------------------------------------
// The mask. 13 wide, 17 tall, three-quarters to the left. 'O' is the carved rim (and the seam down the right side of
// the face); 'p' is the one side plane, cut with a hard edge; no other shading. Each mood is the same carving repainted.
// ---------------------------------------------------------------------------------------------------------------
const MASK_TOP = ['....OOOOO....', '..OOPPPPPOO..', '.OPPPPPPPPOpO', '.OPPPPPPPPOpO'];
const MASK_NOSE = ['OPPPPPPoPPPOp', 'OPyyPPPoPyyOp', 'OPyyPPoooyyOp'];
const MASK_CHIN = ['.OPPPPPPPPOO.', '..OOPPPPPOO..', '....OOOOO....'];
const SMILE = ['OPPPPrPrPPPOO', '.OPPPPrPPPPO.'];
const mk = (brows, eyes, mouth = SMILE, top = MASK_TOP) => [...top, ...brows, ...eyes, ...MASK_NOSE, ...mouth, ...MASK_CHIN];
const BROWS = ['OPPNNNPNNNPOO', 'ONNPPPPPPPNNO', 'OPPPPPPPPPPOO'];
const SAD_BROWS = ['OPPPNNPNNPPOO', 'OPNNPPPPPNNOO', 'OPPPPPPPPPPOO'];
const MASK = {
  // serene, the painted smile: a tiny carved 'v'
  serene: mk(BROWS, ['OPKKKPPPKKKOp', 'OPPzPPPPPzPOp']),
  // the lonely one: brows tipped up in the middle, eyes slid sideways, the smile kept
  sad: mk(SAD_BROWS, ['OPKKKPPPKKKOp', 'OPPPzPPPPPzOp']),
  // the same, the eyes slid back the other way: checking you are still there
  look: mk(SAD_BROWS, ['OPKKKPPPKKKOp', 'OPzPPPPPzPPOp']),
  // shut: the painted lids down
  shut: mk(SAD_BROWS, ['OPPPPPPPPPPOp', 'OPKKKPPPKKKOp']),
  // waking: the lids still heavy, a thread of light under them
  half: mk(SAD_BROWS, ['OPPPPPPPPPPOp', 'OPKSKPPPKSKOp']),
  // delighted: brows lifted, the eyes painted as happy arcs, the smile wider
  delight: mk(['OPNPPPPPPPNOO', 'OPPPPPPPPPPOO', 'OPPKPPPPPKPOp'], ['OPKPKPPPKPKOp', 'OPPPPPPPPPPOp'], ['OPPPrPPPrPPOO', '.OPPPrrrPPPO.'],
    ['....OOOOO....', '..OOPPPPPOO..', '.OPPPPPPPPOpO', '.OPNNNPNNNOpO']),
  // hurt: the eyes squeezed, a little round mouth
  oh: mk(BROWS, ['OPKPPPPPPPKOp', 'OPPKKPPPKKPOp'], ['OPPPPPrPPPPOO', '.OPPPrRrPPPO.']),
  // the star behind the eyes: lit, and nobody in them
  lit: mk(SAD_BROWS, ['OPKKKPPPKKKOp', 'OPswsPPPswsOp']),
};

// The same mask seen full face (turning round to you): symmetrical, the side plane down its right.
const FRONT_TOP = ['....OOOOO....', '..OOPPPPPOO..', '.OPPPPPPPPpO.', '.OPPPPPPPPpO.'];
const FRONT_NOSE = ['OPPPPPoPPPPpO', 'OPyyPPoPPyypO', 'OPyyPoooPyypO'];
const FRONT_CHIN = ['.OPPPPPPPPpO.', '..OOPPPPpOO..', '....OOOOO....'];
const fr = (brows, eyes, mouth = ['OPPPPrPrPPPpO', '.OPPPPrPPPpO.'], top = FRONT_TOP) => [...top, ...brows, ...eyes, ...FRONT_NOSE, ...mouth, ...FRONT_CHIN];
const F_BROWS = ['OPPNNNPNNNPpO', 'OPNPPPPPPPNpO', 'OPPPPPPPPPPpO'];
const F_SAD = ['OPPPNNPNNPPpO', 'OPNNPPPPPNNpO', 'OPPPPPPPPPPpO'];
const FRONT = {
  serene: fr(F_BROWS, ['OPKKKPPPKKKpO', 'OPPzPPPPPzPpO']),
  sad: fr(F_SAD, ['OPKKKPPPKKKpO', 'OPPzPPPPPzPpO']),
  look: fr(F_SAD, ['OPKKKPPPKKKpO', 'OPPzPPPPPzPpO']),
  shut: fr(F_SAD, ['OPPPPPPPPPPpO', 'OPKKKPPPKKKpO']),
  half: fr(F_SAD, ['OPPPPPPPPPPpO', 'OPKSKPPPKSKpO']),
  delight: fr(['OPNPPPPPPPNpO', 'OPPPPPPPPPPpO', 'OPPKPPPPPKPpO'], ['OPKPKPPPKPKpO', 'OPPPPPPPPPPpO'], ['OPPPrPPPrPPpO', '.OPPPrrrPPpO.'],
    ['....OOOOO....', '..OOPPPPPOO..', '.OPPPPPPPPpO.', '.OPNNNPNNNpO.']),
  oh: fr(F_BROWS, ['OPKPPPPPPPKpO', 'OPPKKPPPKKPpO'], ['OPPPPPrPPPPpO', '.OPPPrRrPPpO.']),
  lit: fr(F_SAD, ['OPKKKPPPKKKpO', 'OPswsPPPswspO']),
};

// The mask on its own grid, worn: a chip to the grain at the chin and the cheek, a fine check down from the brow,
// and (`tear`) the check under her eye like the track of a tear.
function maskGrid(mood, flip, front = false, tear = true) {
  const rows = (front ? FRONT : MASK)[mood];
  const q = new KPix(13, 17);
  stamp(q, 0, 0, rows, flip);
  const X = (i) => (flip ? 12 - i : i);
  for (const [i, j, c] of [[5, 15, '4'], [6, 15, '3'], [6, 14, '4'], [3, 13, '4'], [2, 12, '3'], [2, 9, '4'], [3, 9, '3']]) {
    if (['P', 'p', 'y', '&'].includes(q.get(X(i), j))) q.set(X(i), j, c);
  }
  for (let j = 1; j < 4; j++) q.set(X(7), j, '7');
  if (tear) for (let j = 0; j < 4; j++) q.set(X(8), 9 + j, '7');
  return q;
}

// ---------------------------------------------------------------------------------------------------------------
// The bow behind her (battle): the stem she is fixed to, hull planks, a trailboard, and above the rail the empty deck,
// one lantern still on its post, a cup on its side, a streamer gone slack.
// ---------------------------------------------------------------------------------------------------------------
const STEM = [[27, 0], [30, 26], [46, 52], [54, 72]];

function ship(sway = 0) {
  const p = new KPix(W, H);
  const stem = bez(STEM, 60);
  p.poly([stem[0], [64, 0], [64, 72], ...stem.slice().reverse()], '2');
  for (let k = 0; k < 18; k++) {
    const y0 = -6 + k * 5;
    for (let x = 24; x < 64; x++) {
      const y = y0 + (x - 30) * 0.22;
      p.put(x, y, '1', ['2']); p.put(x, y + 1, '3', ['2']);
    }
  }
  for (let i = 0; i + 1 < stem.length; i++) {
    const [ax, ay] = stem[i];
    const [bx, by] = stem[i + 1];
    for (const [d, c] of [[1, '4'], [2, '4'], [3, '3']]) p.line(ax + d, ay, bx + d, by, c, 1, d > 1 ? ['2', '3', '1', '4'] : ['2', '3', '1']);
    p.line(ax, ay, bx, by, '5', 1, ['2', '3', '1']);
  }
  // the trailboard: a carved board running back from her along the bow, gilt-edged
  band(p, [[36, 36], [50, 31], [64, 29]], 6, 5, '3', '4', '2');
  p.line(36, 33, 64, 26, 'c'); p.line(37, 39, 64, 32, 'b');
  // the empty deck above the rail
  p.line(30, 14, 64, 8, 'c', 2); p.line(30, 13, 64, 7, 'd'); p.line(30, 16, 64, 10, 'b');
  for (const x of [36, 46, 56]) p.line(x, 13 - (x - 30) * 0.18, x, 7 - (x - 30) * 0.18, '4', 2);
  streamer(p, [[40, 10], [43 + sway, 15], [41 + sway * 1.5, 20], [44 + sway * 2, 24]], '&', '*');
  p.line(52, 7, 53, 0, '1'); lantern(p, 51, 0, '$', '+', 4);
  stamp(p, 58, 5, ['b.ccd', 'abcc.']);
  p.outline('k');
  return p;
}
const SHIPS = {};
const shipRows = (sway) => { SHIPS[sway] ??= ship(sway); return SHIPS[sway]; };

// ---------------------------------------------------------------------------------------------------------------
// HER (without the ship), from a pose. `o` (all optional; the defaults are concept 4 exactly):
//   look     where the mask is turned: deck (back over her shoulder to the empty deck), front (full face), you (to you)
//   mood     the mask's paint (see MASK)       jolt [dx, dy] the mask knocked out of place     askew  degrees it has slipped
//   far      the open arm: open (held out low to you), beckon (raised, palm up: come in), heart (over the star too)
//   hand     the open hand: open, up (palm up), side, down (palm down, asleep)
//   elbow    0 none, 1 the old split, 2 opening (the wood creaks)       fall  flakes from the split, how far down
//   leak     0-3 how much light gets out between her fingers             star  lit, dim or out
//   cracks   0-3 how far the light has split her                         nod   the head dropped (pixels)
//   hit, bob, lean, split    shoved, raised, swayed (top half), the top half out of true
//   flakes   paint chips flying off her, how far they have flown       flash  white (a hit)
// `world`: drawn for the overworld (80 tall, the knee running on down to the cutwater).
// ---------------------------------------------------------------------------------------------------------------
export function figure(over = {}, world = false) {
  const o = {
    look: 'deck', mood: 'sad', far: 'open', hand: 'open', elbow: 1, fall: 0, leak: 2, star: 'lit', cracks: 1, askew: 0,
    jolt: [0, 0], nod: 0, hit: 0, bob: 0, lean: 0, split: 0, flakes: 0, flash: false, ...over,
  };
  const FH = world ? 80 : H;
  const hair = HAIR;
  const gown = GOWN;

  const hb = new KPix(W, FH);
  for (const [pts, w0, w1, t] of [[[[18, 5], [28, 2], [35, 9], [35, 19]], 8, 4, 1], [[[19, 10], [28, 12], [31, 20], [29, 28]], 7, 3, 1]]) {
    lock(hb, pts, w0, w1, hair, true, t, 2);
  }
  hb.outline('k');

  const body = new KPix(W, FH);
  skirt5(body, gown); torso5(body, gown); body.outline('k');
  const ks = new KPix(W, FH);
  kneeScroll(ks); strap(ks, [29, 39], [35, 37]); ks.outline('k');

  // The open arm.
  const arms = new KPix(W, FH);
  if (o.far === 'beckon') {
    // raised, the palm up and the mitten curling in: come in, come in
    arm5(arms, [[12, 30], [7, 31], [3, 27]], 6, 5);
    stamp(arms, 0, 22, ['.P...', 'P.PP.', 'PPPPp', 'pppp.']);
    arms.outline('k');
    if (o.elbow) elbowCrack(arms, 7, 29, o.elbow > 1 ? 1 : 0, o.fall);
  } else if (o.far === 'heart') {
    // brought in to lie over the other, both hands over the star
    arm5(arms, [[12, 30], [11, 36], [15, 38]], 6, 5);
    stamp(arms, 12, 35, ['.PPPP.', 'PPPPPp', 'PpPPpp', '.pppp.']);
    arms.outline('k');
    if (o.elbow) elbowCrack(arms, 10, 34);
  } else {
    // held open toward you, low, not quite sure you'll take it
    arm5(arms, [[12, 30], [6, 34], [3, 35]], 6, 5);
    const HAND = {
      open: [0, 32, ['PPPP.', 'PPPPp', 'pppp.']],
      up: [0, 31, ['P.P..', 'PPPP.', 'PPPPp', 'pppp.']],
      side: [0, 32, ['PPP..', 'PPPPp', 'pPPp.', '.pp..']],
      down: [0, 33, ['PPPP.', 'pppPp', 'oo...']],
    }[o.hand];
    stamp(arms, HAND[0], HAND[1], HAND[2]);
    arms.outline('k');
    if (o.elbow) elbowCrack(arms, 7, 33, o.elbow > 1 ? 1 : 0, o.fall);
  }

  // The near hand pressed flat over the star.
  const near = new KPix(W, FH);
  arm5(near, [[25, 29], [27, 35], [22, 36]], 6, 5);
  stamp(near, 15, 32, ['.PPPP.', 'PPPPPp', 'PpPPpp', '.pppp.']);
  near.outline('k');
  shoulderJoint(near, 25, 29, 2.2);

  // The head: the hair over the brow, the mask, and (turned to the deck) the back of her hair.
  const head = new KPix(W, FH);
  hairCap(head, hair, 9, 6);
  let mx;
  let grid;
  if (o.look === 'deck') { mx = 11; grid = maskGrid(o.mood, true); }
  else if (o.look === 'front') { mx = 10; grid = maskGrid(o.mood, false, true); }
  else { mx = 9; grid = maskGrid(o.mood, false); }
  if (o.cracks >= 3) {
    // split through the brow, light in it
    for (const [x, y, c] of [[6, 1, 'k'], [6, 2, 's'], [5, 3, 's'], [5, 4, 'k'], [6, 5, 's'], [6, 6, 'k']]) if (grid.get(x, y) !== '.') grid.set(x, y, c);
  }
  let gr = grid.rows();
  let gx = mx + o.jolt[0];
  let gy = 7 + o.jolt[1];
  if (o.askew) { gr = rotateGrid(gr, o.askew); gx -= 3; gy -= 3; }
  stamp(head, gx, gy, gr);
  if (o.look === 'deck') {
    const r = new KPix(W, FH);
    lock(r, [[10, 6], [7, 12], [6, 19], [8, 25]], 6, 3, hair, true, -1);
    head.over(r);
  } else if (o.look === 'front') {
    // a lock either side, the left one shorter as she comes round
    const r = new KPix(W, FH);
    lock(r, [[9, 13], [7, 18], [9, 23]], 4, 3, hair, true, -1);
    head.over(r);
  }
  head.outline('k');

  const fig = new KPix(W, FH);
  for (const layer of [hb, body, ks, arms, near]) fig.over(layer);
  fig.over(head, 0, o.nod);
  chips(fig, 0, 24, 34, 70, 17, 0.015, ['P', 'p', gown[1], gown[2]]);
  worn(fig, 24, 58, 2.5, 2, 3, gown);

  // The light: out between her fingers, and (cracks 2, 3) out through the splits in the wood.
  const core = new KPix(W, FH);
  if (o.cracks >= 2 && o.star === 'lit') {
    // (only across her own wood, never out into the air)
    const wood = (x, y) => !['.', 'k'].includes(fig.get(x, y));
    const splits = [[[21, 37], [23, 41], [22, 45], [25, 50]], [[14, 36], [12, 40]], [[24, 30], [27, 26]]];
    if (o.cracks >= 3) splits.push([[16, 45], [18, 51], [17, 57], [20, 62]], [[28, 44], [33, 52], [36, 55]], [[12, 30], [13, 25]]);
    const cr = new KPix(W, FH);
    for (const pts of splits) {
      for (let i = 0; i + 1 < pts.length; i++) {
        cr.line(pts[i][0] + 1, pts[i][1], pts[i + 1][0] + 1, pts[i + 1][1], 'k');
        cr.line(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], i % 2 ? 'S' : 's');
      }
    }
    for (let y = 0; y < FH; y++) for (let x = 0; x < W; x++) if (cr.g[y][x] !== '.' && wood(x, y)) core.g[y][x] = cr.g[y][x];
  }
  if (o.star !== 'out') {
    if (o.far === 'heart') {
      if (o.star === 'lit') { core.set(21, 34, 's'); core.set(19, 39, 'S'); core.set(11, 37, 'S'); }
      else { core.set(21, 34, 'Z'); core.set(19, 39, 'Z'); }
    } else if (o.star === 'dim') {
      core.set(16, 36, 'S'); core.set(20, 36, 'Z');
    } else {
      const L = o.leak;
      if (L >= 1) { core.set(16, 36, 's'); core.set(20, 36, 's'); }
      if (L >= 2) { core.set(15, 33, 's'); core.set(21, 33, 's'); }
      if (L >= 2) for (const [x, y] of [[13, 32], [12, 31], [23, 32], [24, 31]]) core.set(x, y, 'x');
      if (L >= 1) core.set(14, 37, 'x');
      if (L >= 3) {
        core.set(15, 33, 'w'); core.set(21, 33, 'w'); core.set(16, 34, 's'); core.set(19, 34, 's'); core.set(18, 36, 's');
        for (const [x, y] of [[11, 30], [10, 29], [25, 30], [26, 29], [13, 38], [12, 39], [22, 38], [23, 39]]) core.set(x, y, 'x');
      }
    }
  }
  fig.over(core);

  let rows = fig.rows();
  const shiftRow = (row, dx) => (dx ? [...row].map((_, x) => row[x - dx] ?? '.').join('') : row);
  if (o.lean) rows = rows.map((row, y) => (y < 44 ? shiftRow(row, Math.round((o.lean * (44 - y)) / 44)) : row));
  if (o.split) rows = rows.map((row, y) => (y < 30 ? shiftRow(row, o.split) : row));
  if (o.hit || o.bob) rows = rows.map((_, y) => shiftRow(rows[y - o.bob] ?? '.'.repeat(W), o.hit));
  if (o.flash) rows = rows.map((row) => [...row].map((v) => (v === '.' || v === 'k' ? v : 'w')).join(''));
  // Paint chips flying off her, back and up, then falling.
  if (o.flakes) {
    const p = new KPix(W, FH);
    p.g = rows.map((row) => [...row]);
    for (let i = 0; i < 12; i++) {
      const x = 8 + hsh(i, 1) * 22 + o.flakes * (4 + hsh(i, 3) * 6);
      const y = 8 + hsh(i, 2) * 34 - o.flakes * (3 - hsh(i, 4) * 2) + o.flakes * o.flakes;
      p.set(x, y, ['P', 'p', 'g', 'W', 'c', 'P'][i % 6]);
      if (i % 3 === 0) p.set(x + 1, y, 'p');
    }
    rows = p.rows();
  }
  return rows;
}

// One battle frame: the glow round the star, the bow and the empty deck behind her, and her.
function draw(pose = {}) {
  const o = { glow: 1, star: 'lit', sway: 0, ...pose };
  const p = new KPix(W, H);
  if (o.star === 'lit' && o.glow > 0) {
    const [r1, r2] = [[3, 6], [3, 6], [4, 8], [5, 10]][o.glow];
    p.ellipse(18, 34, r2, r2, 'T');
    p.ellipse(18, 34, r1, r1, 't');
  }
  p.over(shipRows(o.sway));
  const her = figure(o);
  her.forEach((row, y) => [...row].forEach((c, x) => { if (c !== '.') p.set(x, y, c); }));
  return p.rows();
}

// THE LAUGH (the hostess): she gazes at the empty deck, then glances back at you, the light pulsing under her hand.
const LAUGH = [
  draw({ leak: 1, glow: 1 }),
  draw({ leak: 2, glow: 2, sway: 1 }),
  draw({ look: 'you', mood: 'look', leak: 2, glow: 1, sway: 1 }),
  draw({ leak: 3, glow: 2 }),
];
export const FAIRWEATHER_SPRITE = LAUGH[0];

// Beaten: she turns away to the empty deck as the star goes out. Spared: she settles, both hands over the star.
const DEATH = [
  draw({ look: 'you', mood: 'sad', leak: 1, glow: 1 }),
  draw({ look: 'front', mood: 'sad', star: 'dim', glow: 0, hand: 'side', nod: 1 }),
  draw({ look: 'deck', mood: 'shut', star: 'out', glow: 0, hand: 'down', nod: 1 }),
];
const SPARED = [
  draw({ look: 'you', mood: 'serene', leak: 2, glow: 1 }),
  draw({ look: 'you', mood: 'serene', far: 'heart', glow: 1, bob: -1 }),
  draw({ look: 'you', mood: 'shut', far: 'heart', star: 'dim', glow: 0, nod: 1 }),
];
// The windup: she turns her mask fully to you, delighted, the open hand beckoning, and the wood creaks at the elbow.
const windup = (base) => ({
  fps: 8,
  frames: [
    draw({ ...base, look: 'front', mood: 'look', far: 'open', hand: 'up', elbow: 1 }),
    draw({ ...base, look: 'you', mood: 'delight', far: 'beckon', elbow: 2, glow: 2, bob: -1 }),
    draw({ ...base, look: 'you', mood: 'delight', far: 'beckon', elbow: 2, fall: 2, glow: 3, leak: 3 }),
  ],
});
// Hurt: the mask jolts, paint chips fly.
const hurt = (base) => ({
  fps: 10,
  frames: [
    draw({ ...base, mood: 'oh', jolt: [1, -1], hit: 2, flakes: 0.4, flash: true }),
    draw({ ...base, mood: 'oh', jolt: [2, 0], hit: 2, flakes: 1.3 }),
    draw({ ...base, hit: 1, flakes: 2.2 }),
  ],
});

export const FAIRWEATHER_ANIM = {
  chips: ['#235846', '#eee2c4', '#c49a38', '#bff4ff'],
  idle: { fps: 4, frames: LAUGH, holds: [3, 2, 3, 2] },
  windup: windup({}),
  hurt: hurt({}),
  death: { fps: 3, frames: DEATH, holds: [2, 2, 5] },
  spared: { fps: 3, frames: SPARED, holds: [2, 2, 5] },
  intro: {
    fps: 5,
    frames: [
      draw({ mood: 'half', leak: 3, glow: 3, flash: true }),
      draw({ look: 'front', mood: 'look', leak: 3, glow: 2 }),
      draw({ leak: 2 }),
    ],
  },
};

// STAR SHOWER: the light gets out. More of it between her fingers, the paint split over it; she watches you more.
const SH = { cracks: 2, leak: 3, glow: 2 };
const SHOWER = [
  draw({ ...SH }),
  draw({ ...SH, look: 'you', mood: 'look', glow: 3, sway: 1 }),
  draw({ ...SH, look: 'you', mood: 'serene', glow: 2, sway: 1 }),
  draw({ ...SH, look: 'front', mood: 'look', glow: 3 }),
];
export const FAIRWEATHER_SHOWER_SPRITE = SHOWER[0];
export const FAIRWEATHER_SHOWER_ANIM = {
  chips: FAIRWEATHER_ANIM.chips,
  idle: { fps: 5, frames: SHOWER, holds: [2, 2, 2, 2] },
  windup: windup(SH),
  hurt: hurt(SH),
  death: FAIRWEATHER_ANIM.death,
  spared: FAIRWEATHER_ANIM.spared,
  intro: {
    fps: 6,
    frames: [
      draw({ ...SH, glow: 3, flash: true }),
      draw({ ...SH, look: 'front', mood: 'lit', glow: 3 }),
      draw({ ...SH, look: 'you', mood: 'look' }),
    ],
  },
};

// THE CAROUSEL: she asks you to dance. The mask turned to you, delighted, the hand beckoning, swaying as the deck turns.
const CA = { cracks: 2, leak: 3, glow: 2, look: 'you', mood: 'delight', elbow: 2 };
const CAROUSEL = [
  draw({ ...CA, far: 'beckon', lean: -2 }),
  draw({ ...CA, far: 'open', hand: 'up', lean: 0, sway: 1, glow: 3 }),
  draw({ ...CA, far: 'beckon', lean: 2, sway: 2 }),
  draw({ ...CA, far: 'open', hand: 'up', lean: 0, sway: 1, look: 'front', mood: 'look' }),
];
export const FAIRWEATHER_CAROUSEL_SPRITE = CAROUSEL[0];
export const FAIRWEATHER_CAROUSEL_ANIM = {
  chips: FAIRWEATHER_ANIM.chips,
  idle: { fps: 6, frames: CAROUSEL },
  windup: {
    fps: 9,
    frames: [
      draw({ ...CA, far: 'beckon', lean: -3, glow: 3 }),
      draw({ ...CA, far: 'beckon', fall: 2, lean: 3, bob: -1, glow: 3, sway: 2 }),
      draw({ ...CA, far: 'open', hand: 'up', lean: 0, glow: 3, sway: 1 }),
    ],
  },
  hurt: hurt(CA),
  death: FAIRWEATHER_ANIM.death,
  spared: FAIRWEATHER_ANIM.spared,
  intro: {
    fps: 8,
    frames: [
      draw({ ...CA, far: 'beckon', lean: -3, flash: true }),
      draw({ ...CA, far: 'beckon', lean: 3 }),
      draw({ ...CA, far: 'open', hand: 'up', lean: -2, sway: 2 }),
      draw({ ...CA, far: 'beckon', lean: 2, sway: 1 }),
    ],
  },
};

// CHAOS: split along the grain, light in every crack, the mask slipped askew, its eyes lit and nobody in them.
const CH = { cracks: 3, leak: 3, glow: 3, mood: 'lit', elbow: 2, fall: 1 };
const CHAOS = [
  draw({ ...CH, look: 'you', askew: -14, jolt: [1, 1], split: 1 }),
  draw({ ...CH, look: 'deck', askew: 10, split: -1, far: 'beckon', sway: 2 }),
  draw({ ...CH, look: 'you', askew: -18, jolt: [2, 1], split: 2, sway: 1, hand: 'up' }),
  draw({ ...CH, look: 'front', askew: 12, split: -1, far: 'beckon', bob: -1 }),
];
export const FAIRWEATHER_CHAOS_SPRITE = CHAOS[0];
export const FAIRWEATHER_CHAOS_ANIM = {
  chips: ['#235846', '#eee2c4', '#b8976a', '#bff4ff'],
  idle: { fps: 8, frames: CHAOS },
  windup: {
    fps: 10,
    frames: [
      draw({ ...CH, look: 'front', askew: -16, split: 2, far: 'open', hand: 'up' }),
      draw({ ...CH, look: 'you', mood: 'delight', askew: -22, jolt: [2, 1], split: -2, far: 'beckon', bob: -1 }),
      draw({ ...CH, look: 'you', askew: 18, split: 2, far: 'beckon', fall: 3, bob: -1 }),
    ],
  },
  hurt: {
    fps: 10,
    frames: [
      draw({ ...CH, look: 'you', mood: 'oh', askew: -20, jolt: [2, -1], split: 2, hit: 2, flakes: 0.4, flash: true }),
      draw({ ...CH, look: 'you', mood: 'oh', askew: -24, jolt: [3, 0], split: -2, hit: 2, flakes: 1.3 }),
      draw({ ...CH, look: 'you', askew: -14, jolt: [1, 1], split: 1, hit: 1, flakes: 2.2 }),
    ],
  },
  death: FAIRWEATHER_ANIM.death,
  spared: FAIRWEATHER_ANIM.spared,
  intro: {
    fps: 6,
    frames: [
      draw({ ...CH, look: 'you', askew: -8, flash: true }),
      draw({ ...CH, look: 'you', askew: -16, jolt: [1, 1], split: 2 }),
      draw({ ...CH, look: 'you', askew: -14, jolt: [1, 1], split: 1 }),
    ],
  },
};

// Beaten (or spared): a figurehead again, turned to the deck, eyes shut, the star out. The room's scene finishes it.
export const FAIRWEATHER_DEATH_LAST = DEATH[2];

// (for checking the port: concept 4 exactly)
export const FAIRWEATHER_CONCEPT = draw({});
