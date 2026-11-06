// A small pixel-drawing kit for Chapter 5's monsters (batch 1: shellac,
// moonjelly, limpet_knight, dunlin_dancer, bellbuoy, salt_shade, sandcastle).
// Instead of typing every frame by hand, a monster is a function that draws
// a `Pix` canvas from a pose, so its idle, windup, hurt, death and spared
// clips are the same picture drawn a little differently. `rows()` gives the
// usual array of strings (one character per pixel, '.' clear) that every
// sprite and clip in the game uses.
export class Pix {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.g = Array.from({ length: h }, () => Array(w).fill('.'));
  }

  set(x, y, c) {
    x = Math.round(x);
    y = Math.round(y);
    if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.g[y][x] = c;
    return this;
  }

  get(x, y) {
    return this.g[y]?.[x] ?? '.';
  }

  rect(x, y, w, h, c, only = null) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.put(x + i, y + j, c, only);
    return this;
  }

  // Sets a pixel only where the pixel is currently `only` (any when null).
  put(x, y, c, only = null) {
    x = Math.round(x);
    y = Math.round(y);
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return this;
    if (only === null || this.g[y][x] === only || (Array.isArray(only) && only.includes(this.g[y][x]))) this.g[y][x] = c;
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

  line(x0, y0, x1, y1, c, thick = 1) {
    const n = Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0))) * 2 || 1;
    for (let i = 0; i <= n; i++) {
      const x = x0 + ((x1 - x0) * i) / n;
      const y = y0 + ((y1 - y0) * i) / n;
      if (thick <= 1) this.set(x, y, c);
      else this.ellipse(x, y, (thick - 1) / 2, (thick - 1) / 2, c);
    }
    return this;
  }

  // A triangle / any convex polygon, filled.
  poly(points, c, only = null) {
    const ys = points.map((p) => p[1]);
    for (let y = Math.floor(Math.min(...ys)); y <= Math.ceil(Math.max(...ys)); y++) {
      const xs = [];
      for (let i = 0; i < points.length; i++) {
        const [ax, ay] = points[i];
        const [bx, by] = points[(i + 1) % points.length];
        if ((ay <= y && by > y) || (by <= y && ay > y)) xs.push(ax + ((y - ay) / (by - ay)) * (bx - ax));
      }
      xs.sort((a, b) => a - b);
      for (let i = 0; i + 1 < xs.length; i += 2) for (let x = Math.round(xs[i]); x < Math.round(xs[i + 1]); x++) this.put(x, y, c, only);
    }
    return this;
  }

  // Paints rows of text onto it at (x, y); `skip` characters are left alone.
  stamp(rows, x, y, skip = '.') {
    rows.forEach((row, j) => [...row].forEach((c, i) => { if (c !== skip) this.set(x + i, y + j, c); }));
    return this;
  }

  // An outline of `c` round everything drawn (not diagonally, so it stays crisp).
  outline(c = 'k') {
    const filled = this.g.map((row) => row.map((v) => v !== '.'));
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        if (filled[y][x]) continue;
        if (filled[y - 1]?.[x] || filled[y + 1]?.[x] || filled[y]?.[x - 1] || filled[y]?.[x + 1]) this.g[y][x] = c;
      }
    }
    return this;
  }

  rows() {
    return this.g.map((row) => row.join(''));
  }
}

// ---------------------------------------------------------------------------
// Whole-clip helpers (work on arrays of rows)

// Every drawn pixel (but outlines) becomes `c`: the white flash of a hit.
export function flash(rows, c = 'w', keep = 'k') {
  return rows.map((row) => [...row].map((v) => (v === '.' || v === keep ? v : c)).join(''));
}

export function shift(rows, dx, dy) {
  const h = rows.length;
  const w = rows[0].length;
  return rows.map((_, y) => {
    const src = rows[y - dy];
    if (!src) return '.'.repeat(w);
    return [...src].map((__, x) => src[x - dx] ?? '.').join('');
  });
}

// Rubs pixels out, a share of them (deterministic), from the top down: death.
export function crumble(rows, k, fromTop = true) {
  const h = rows.length;
  return rows.map((row, y) => [...row].map((v, x) => {
    if (v === '.') return v;
    const rank = fromTop ? y / h : 1 - y / h;
    const hash = ((x * 7 + y * 13 + x * y * 3) % 17) / 17;
    return k >= 1 || hash + rank * 0.7 < k * 1.7 ? '.' : v;
  }).join(''));
}

// Swaps the colours of every pixel through `map`.
export function recolor(rows, map) {
  return rows.map((row) => [...row].map((v) => map[v] ?? v).join(''));
}

// Squashes (k<1) or stretches the picture vertically about its bottom edge.
export function stretchY(rows, k) {
  const h = rows.length;
  const newH = Math.max(1, Math.round(h * k));
  const out = [];
  for (let y = 0; y < h; y++) {
    const srcY = Math.floor((y - (h - newH)) / k);
    out.push(srcY >= 0 && srcY < h && y >= h - newH ? rows[srcY] : '.'.repeat(rows[0].length));
  }
  return out;
}
