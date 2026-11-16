// SEAM NINE'S LOWER WORKINGS (draft): the few props the secret detour under
// Seam Nine needs that nothing else has: the miners' tea shelf in the Pale Olm's
// pool (a kettle, seven tin mugs and one small dish), and the crack in the
// floor of Seam Nine that the star's light comes up through. Same way of
// working as deepProps.js: each prop is { palette, rows } on a small grid, 16 px
// to a tile, and the palettes are folded into PROP_PALETTE under characters
// nothing else uses (src/data/art/props.js spreads these three exports).

class Grid {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.cells = Array.from({ length: h }, () => Array(w).fill('.'));
  }
  px(x, y, c) { x = Math.round(x); y = Math.round(y); if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.cells[y][x] = c; return this; }
  at(x, y) { return this.cells[y]?.[x] ?? '.'; }
  rect(x, y, w, h, c) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.px(x + i, y + j, c); return this; }
  line(x0, y0, x1, y1, c) {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= n; i++) this.px(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, c);
    return this;
  }
  outline(c = 'k') {
    const marks = [];
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) {
      if (this.cells[y][x] !== '.') continue;
      if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => this.at(x + dx, y + dy) !== '.' && this.at(x + dx, y + dy) !== c)) marks.push([x, y]);
    }
    for (const [x, y] of marks) this.cells[y][x] = c;
    return this;
  }
  rows() { return this.cells.map((r) => r.join('')); }
}

const SS_PALETTE_EXTRA = {};
const SS_PROP_SPRITES = {};
const SS_FOOTPRINTS = {};
let nextChar = 0x5a00;
function register(name, palette, rows, footprint = 1) {
  const map = {};
  for (const [key, color] of Object.entries(palette)) {
    const char = String.fromCharCode(nextChar++);
    map[key] = char;
    SS_PALETTE_EXTRA[char] = color;
  }
  SS_PROP_SPRITES[name] = rows.map((row) => [...row].map((ch) => map[ch] ?? '.').join(''));
  if (footprint > 1) SS_FOOTPRINTS[name] = footprint;
}

// The tea shelf, 48x28 (three tiles wide): a plank shelf on two posts with a
// kettle at one end, seven tin mugs in a row, and a small flat tin dish at the
// other end (the olm's). Every mug is a slightly different tilt of tin.
(() => {
  const g = new Grid(48, 28);
  // Posts and shelf.
  g.rect(3, 17, 3, 11, 'w');
  g.rect(42, 17, 3, 11, 'w');
  g.rect(1, 14, 46, 3, 'W');
  g.rect(1, 16, 46, 1, 'w');
  // Kettle (round belly, spout, handle).
  g.rect(3, 7, 8, 7, 'p');
  g.rect(3, 7, 2, 7, 'P');
  g.rect(5, 5, 4, 2, 'p');
  g.rect(6, 4, 2, 1, 'P');
  g.rect(11, 9, 3, 1, 'p');
  g.rect(13, 8, 1, 1, 'p');
  g.line(4, 6, 9, 6, 'P');
  // Seven mugs.
  for (let i = 0; i < 7; i++) {
    const x = 15 + i * 4;
    g.rect(x, 9, 3, 5, i === 3 ? 's' : 't');
    g.rect(x, 9, 3, 1, 'T');
    g.px(x + 3, 10, 't');
    g.px(x + 3, 12, 't');
    g.px(x, 12, i === 3 ? 's' : 'T');
  }
  // The dish: wide, low, and a little warm in the middle.
  g.rect(43, 12, 4, 2, 't');
  g.rect(43, 12, 4, 1, 'T');
  g.px(44, 13, 'g');
  g.px(45, 13, 'g');
  g.outline('k');
  register('tea_shelf', {
    k: '#1c1612', w: '#5c3e22', W: '#8a6234', p: '#8a5a3a', P: '#b88458', t: '#a9b2bc', T: '#e6ebf0', s: '#6f7a86', g: '#fff2a8',
  }, g.rows(), 3);
})();

// The crack, 16x16: a jagged split in the floor with cold white light
// coming up out of it, hairline cracks running off it.
(() => {
  const g = new Grid(16, 16);
  const path = [[7, 2], [8, 4], [6, 6], [9, 8], [7, 10], [8, 12], [7, 14]];
  for (let i = 0; i < path.length - 1; i++) {
    g.line(path[i][0] - 1, path[i][1], path[i + 1][0] - 1, path[i + 1][1], 'c');
    g.line(path[i][0] + 1, path[i][1], path[i + 1][0] + 1, path[i + 1][1], 'c');
    g.line(path[i][0], path[i][1], path[i + 1][0], path[i + 1][1], 'w');
  }
  g.line(6, 6, 2, 7, 'c');
  g.line(9, 8, 13, 9, 'c');
  g.line(7, 10, 4, 12, 'c');
  g.outline('k');
  register('star_crack', { k: '#0c1220', c: '#7fb4e8', w: '#f4fbff' }, g.rows());
})();

export { SS_PALETTE_EXTRA, SS_PROP_SPRITES, SS_FOOTPRINTS };
