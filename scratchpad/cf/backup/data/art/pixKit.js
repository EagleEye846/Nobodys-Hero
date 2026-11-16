// A small pixel-drawing kit for monsters whose frames are worked out in code
// (shapes, lines, an outline) instead of typed row by row. A `Pix` is a grid
// of palette characters; `.rows()` gives the strings every sprite uses.
// Chapter 5's coast monsters use it, so a pose (mouth open, spines out, body
// bent) is just a number handed to one draw function.
//
//   const g = new Pix(40, 32);
//   g.disc(20, 16, 8, 6, 'b');        // filled ellipse, centre then radii
//   g.line(2, 2, 30, 10, 'k', 2);     // thick line
//   g.outline('k');                   // 1px dark rim round everything drawn
//   return g.rows();
export class Pix {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.g = Array.from({ length: h }, () => Array(w).fill('.'));
  }

  set(x, y, c) {
    x = Math.round(x);
    y = Math.round(y);
    if (c && x >= 0 && y >= 0 && x < this.w && y < this.h) this.g[y][x] = c;
    return this;
  }

  get(x, y) {
    x = Math.round(x);
    y = Math.round(y);
    return x >= 0 && y >= 0 && x < this.w && y < this.h ? this.g[y][x] : '.';
  }

  rect(x, y, w, h, c) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c);
    return this;
  }

  // A filled ellipse. `only` limits it to pixels currently holding one of those characters.
  disc(cx, cy, rx, ry, c, only = null) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        const dx = (x - cx) / Math.max(rx, 0.01);
        const dy = (y - cy) / Math.max(ry, 0.01);
        if (dx * dx + dy * dy <= 1.0001 && (!only || only.includes(this.get(x, y)))) this.set(x, y, c);
      }
    }
    return this;
  }

  // A thick line (`t` pixels across).
  line(x0, y0, x1, y1, c, t = 1) {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1) * 2;
    for (let i = 0; i <= n; i++) {
      const x = x0 + ((x1 - x0) * i) / n;
      const y = y0 + ((y1 - y0) * i) / n;
      if (t <= 1) this.set(x, y, c);
      else this.disc(x, y, t / 2 - 0.2, t / 2 - 0.2, c);
    }
    return this;
  }

  // Copies string rows in at (dx, dy); '.' is see-through.
  stamp(rows, dx, dy, map = null) {
    rows.forEach((row, j) => {
      [...row].forEach((ch, i) => {
        if (ch !== '.') this.set(dx + i, dy + j, map ? (map[ch] ?? ch) : ch);
      });
    });
    return this;
  }

  // A one-pixel rim in `c` round everything drawn (not diagonally).
  outline(c) {
    const add = [];
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        if (this.g[y][x] !== '.') continue;
        if (this.get(x - 1, y) !== '.' || this.get(x + 1, y) !== '.' || this.get(x, y - 1) !== '.' || this.get(x, y + 1) !== '.') add.push([x, y]);
      }
    }
    for (const [x, y] of add) this.g[y][x] = c;
    return this;
  }

  // Swaps one character for another everywhere.
  swap(from, to) {
    for (const row of this.g) for (let x = 0; x < row.length; x++) if (row[x] === from) row[x] = to;
    return this;
  }

  rows() {
    return this.g.map((row) => row.join(''));
  }
}

// The same rows moved by (dx, dy), the gap left see-through.
export function shiftRows(rows, dx, dy) {
  const h = rows.length;
  const w = rows[0].length;
  return rows.map((_, y) => [...rows[0]].map((__, x) => {
    const sx = x - dx;
    const sy = y - dy;
    return sx >= 0 && sy >= 0 && sx < w && sy < h ? rows[sy][sx] : '.';
  }).join(''));
}

// A tidy random: the same pixels go every time, so frames don't flicker between loads.
function lcg(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// Rows with a share of pixels dropped (0 = all kept, 1 = gone). Pixels drop in a
// fixed order, so a longer run of frames dissolves steadily.
export function dissolve(rows, amount, seed = 7) {
  const rand = lcg(seed);
  const order = rows.map((row) => [...row].map(() => rand()));
  return rows.map((row, y) => [...row].map((ch, x) => (ch !== '.' && order[y][x] < amount ? '.' : ch)).join(''));
}

// Every character mapped through `map` (a flash to white, a dim for a faint look).
export function recolour(rows, map) {
  return rows.map((row) => [...row].map((ch) => map[ch] ?? ch).join(''));
}

// Turns the picture over (a creature belly-up).
export function flipV(rows) {
  return [...rows].reverse();
}

// A clip: draw(pose) for each pose in the list.
export function clip(fps, poses, draw, extra = {}) {
  return { fps, frames: poses.map((pose) => draw(pose)), ...extra };
}
