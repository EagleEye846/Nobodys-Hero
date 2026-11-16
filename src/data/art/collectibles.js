// The collectible sets' little floor pickups (src/data/collections.js): a clay welcome charm in
// eight kinds (chapter 1), a climber's pin in nine (chapter 2), a marble in ten (chapter 3), a brass
// tally token (chapter 4), a piece of sea glass in ten colours (chapter 5) and a pressed flower on a
// scrap of card in eight (chapter 6). Each is only a few pixels across and lies flat on the floor.
// Every id starts `col_`. Drawn like ashProps.js: a tiny painter, 16 pixels to a tile.

const colors = new Map();
const palette = {};
function char(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0xfe80 + colors.size);
    colors.set(hex, c);
    palette[c] = hex;
  }
  return colors.get(hex);
}

class Grid {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.cells = Array.from({ length: h }, () => Array(w).fill(null));
  }

  set(x, y, c) {
    if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.cells[y][x] = c || null;
  }

  get(x, y) {
    return x >= 0 && y >= 0 && x < this.w && y < this.h ? this.cells[y][x] : null;
  }

  rect(x, y, w, h, c) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c);
  }

  outline(c) {
    const edge = [];
    for (let y = -1; y <= this.h; y++) {
      for (let x = -1; x <= this.w; x++) {
        if (this.get(x, y)) continue;
        if (this.get(x - 1, y) || this.get(x + 1, y) || this.get(x, y - 1) || this.get(x, y + 1)) edge.push([x, y]);
      }
    }
    for (const [x, y] of edge) this.set(x, y, c);
  }

  rows() {
    return this.cells.map((row) => row.map((c) => (c ? char(c) : '.')).join(''));
  }
}

// --- A tally token: a brass disc with a hole punched near the top and a mark stamped on it. ---
function token() {
  const g = new Grid(10, 10);
  g.rect(2, 3, 6, 5, '#b8903c');
  g.rect(3, 2, 4, 7, '#b8903c');
  g.rect(3, 3, 3, 1, '#e8c868');
  g.set(2, 4, '#e8c868');
  g.rect(6, 6, 2, 2, '#8a6a24');
  g.rect(4, 5, 2, 3, '#6a4e1c');
  g.set(5, 5, '#8a6a24');
  g.set(4, 3, '#2a2018');
  g.set(5, 3, '#2a2018');
  g.outline('#2a2018');
  // It lies on the floor: a small shadow under it.
  g.rect(3, 9, 5, 1, 'rgba(0, 0, 0, 0.28)');
  return g.rows();
}

// --- Sea glass: a frosted, rounded chip, with a pale glint on its upper edge. ---
function glass(body, lit, dark) {
  const g = new Grid(10, 9);
  g.rect(2, 3, 6, 4, body);
  g.rect(3, 2, 4, 6, body);
  g.rect(3, 3, 2, 1, lit);
  g.set(2, 4, lit);
  g.rect(6, 6, 2, 1, dark);
  g.set(7, 5, dark);
  g.set(4, 4, '#ffffff');
  g.outline('rgba(20, 30, 40, 0.55)');
  g.rect(3, 8, 5, 1, 'rgba(0, 0, 0, 0.25)');
  return g.rows();
}

// --- A pressed flower: a scrap of folded card with a flat bloom and a stalk pressed onto it. ---
function pressed(petal, lit) {
  const g = new Grid(11, 11);
  g.rect(1, 2, 9, 8, '#d8cba6');
  g.rect(1, 2, 9, 1, '#efe4c4');
  g.rect(8, 8, 2, 2, '#b8a87c');
  g.rect(5, 6, 1, 3, '#5a6a2c');
  g.set(6, 8, '#5a6a2c');
  g.rect(4, 4, 3, 3, petal);
  g.set(5, 3, petal);
  g.set(5, 7, petal);
  g.set(3, 5, petal);
  g.set(7, 5, petal);
  g.set(5, 5, lit);
  g.outline('#3a3022');
  g.rect(2, 10, 8, 1, 'rgba(0, 0, 0, 0.25)');
  return g.rows();
}

// --- Chapter 1: a clay welcome charm, a disc with a hole to hang it by and a little mark pressed in. ---
// `glyph` is 5 rows of 5 ('#' is the mark).
const GLYPHS = {
  sun: ['..#..', '#.#.#', '.###.', '#.#.#', '..#..'],
  moon: ['.###.', '#....', '#....', '#....', '.###.'],
  star: ['..#..', '..#..', '#####', '.###.', '#...#'],
  leaf: ['....#', '..###', '.####', '###..', '#....'],
  key: ['.##..', '#..#.', '.##..', '..#..', '..###'],
  bell: ['..#..', '.###.', '.###.', '#####', '..#..'],
  flame: ['..#..', '.##..', '.###.', '#####', '.###.'],
  feather: ['...##', '..###', '.###.', '##...', '#....'],
};
function charm(glyph, clay, lit, mark) {
  const g = new Grid(11, 11);
  g.rect(1, 2, 9, 7, clay);
  g.rect(2, 1, 7, 9, clay);
  g.rect(2, 2, 4, 1, lit);
  g.set(1, 3, lit);
  g.rect(7, 8, 2, 1, 'rgba(60, 30, 10, 0.35)');
  g.set(5, 2, '#2a2018');
  GLYPHS[glyph].forEach((row, j) => [...row].forEach((c, i) => { if (c === '#') g.set(3 + i, 3 + j, mark); }));
  g.outline('#3a2a1c');
  g.rect(2, 10, 7, 1, 'rgba(0, 0, 0, 0.25)');
  return g.rows();
}

// --- Chapter 2: a climber's enamel pin, a little shield with a picture and the pin-back showing. ---
const EMBLEMS = {
  rope: ['.###.', '#...#', '.###.', '#...#', '.###.'],
  axe: ['.###.', '.##.#', '..#..', '..#..', '..#..'],
  goat: ['#...#', '#####', '.###.', '.#.#.', '.#.#.'],
  lamp: ['..#..', '.###.', '#...#', '#...#', '.###.'],
  bell: ['..#..', '.###.', '.###.', '#####', '..#..'],
  kettle: ['.###.', '#####', '#####', '.###.', '.....'],
  boot: ['.##..', '.##..', '.##..', '.####', '#####'],
  owl: ['#...#', '#####', '#.#.#', '#####', '.###.'],
  crow: ['..##.', '.####', '#####', '..#..', '.#.#.'],
};
function pin(emblem, field, rim, mark) {
  const g = new Grid(11, 12);
  g.rect(1, 1, 9, 8, rim);
  g.rect(2, 9, 7, 1, rim);
  g.rect(4, 10, 3, 1, rim);
  g.rect(2, 2, 7, 7, field);
  g.rect(2, 2, 7, 1, 'rgba(255, 255, 255, 0.35)');
  EMBLEMS[emblem].forEach((row, j) => [...row].forEach((c, i) => { if (c === '#') g.set(3 + i, 3 + j, mark); }));
  g.outline('#2a2430');
  g.rect(2, 11, 7, 1, 'rgba(0, 0, 0, 0.25)');
  return g.rows();
}

// --- Chapter 3: a glass marble, a round with a twist of colour through it and a spot of light. ---
function marble(body, twist, lit) {
  const g = new Grid(9, 9);
  g.rect(2, 1, 5, 6, body);
  g.rect(1, 2, 7, 4, body);
  g.rect(2, 3, 5, 1, twist);
  g.rect(3, 4, 3, 1, twist);
  g.set(3, 2, lit);
  g.set(2, 3, lit);
  g.set(3, 3, '#ffffff');
  g.rect(5, 5, 2, 1, 'rgba(0, 0, 20, 0.35)');
  g.outline('rgba(20, 20, 40, 0.65)');
  g.rect(2, 8, 5, 1, 'rgba(0, 0, 0, 0.25)');
  return g.rows();
}

export const COL_PALETTE_EXTRA = palette;

export const COL_PROP_SPRITES = {
  col_token: token(),
  // Sea glass: green, blue, white, amber, brown, frosted, lilac, pink, black and red.
  col_glass_green: glass('#5ea878', '#9ad8ae', '#3a7a56'),
  col_glass_blue: glass('#5a8ec8', '#9ac4ee', '#385e96'),
  col_glass_white: glass('#d8e6e4', '#f6fffe', '#a4b8b6'),
  col_glass_amber: glass('#d8962c', '#f6c864', '#a2661c'),
  col_glass_brown: glass('#8a5a34', '#b88858', '#5c3a1e'),
  col_glass_frosted: glass('#b8cfd4', '#e4f2f4', '#8aa4ac'),
  col_glass_lilac: glass('#a888d0', '#d4bcf0', '#7a5ea4'),
  col_glass_pink: glass('#e08aa8', '#f8bcd0', '#b05a7c'),
  col_glass_black: glass('#38343c', '#6a6470', '#1c1a20'),
  col_glass_red: glass('#c8383c', '#f07872', '#8a1c24'),
  // Pressed flowers.
  col_flower_marigold: pressed('#e8902c', '#ffd060'),
  col_flower_cornflower: pressed('#4a78d8', '#a4c0f8'),
  col_flower_poppy: pressed('#d0302c', '#ff7a6a'),
  col_flower_violet: pressed('#8a58c0', '#c8a4f0'),
  col_flower_harebell: pressed('#7a9ae0', '#cadcff'),
  col_flower_foxglove: pressed('#c85a9a', '#f4a4d0'),
  col_flower_clover: pressed('#e89aaa', '#ffd4dc'),
  col_flower_heather: pressed('#a8508a', '#e49ac8'),
  // Chapter 1: welcome charms in clay.
  col_charm_sun: charm('sun', '#d8a04c', '#f0c878', '#8a4a1c'),
  col_charm_moon: charm('moon', '#b8b4c8', '#e0dcf0', '#5a5478'),
  col_charm_star: charm('star', '#d8c470', '#f4e69c', '#7a6420'),
  col_charm_leaf: charm('leaf', '#8aa860', '#b8d088', '#3c5a24'),
  col_charm_key: charm('key', '#a8886c', '#d0b090', '#503a28'),
  col_charm_bell: charm('bell', '#c89060', '#e8b888', '#6a3c1c'),
  col_charm_flame: charm('flame', '#d07850', '#f0a478', '#7a2c14'),
  col_charm_feather: charm('feather', '#98a8b8', '#c4d4e4', '#3c4a5c'),
  // Chapter 2: climbers' pins.
  col_pin_rope: pin('rope', '#c8a050', '#d8d8e0', '#4a3418'),
  col_pin_axe: pin('axe', '#4a78b0', '#d8d8e0', '#e8f0f8'),
  col_pin_goat: pin('goat', '#8a6a4a', '#d8d8e0', '#f0e4d0'),
  col_pin_lamp: pin('lamp', '#2c3a58', '#d8d8e0', '#ffd870'),
  col_pin_bell: pin('bell', '#a83c3c', '#d8d8e0', '#ffe0a0'),
  col_pin_kettle: pin('kettle', '#3c7a5a', '#d8d8e0', '#e8f0e0'),
  col_pin_boot: pin('boot', '#6a4a8a', '#d8d8e0', '#f0e4f8'),
  col_pin_owl: pin('owl', '#d8d0b8', '#8a8a96', '#3a3028'),
  col_pin_crow: pin('crow', '#2a2a34', '#d8d8e0', '#e84a3c'),
  // Chapter 3: marbles.
  col_marble_cats_eye: marble('#4aa8a0', '#e8d878', '#a8e8e0'),
  col_marble_oxblood: marble('#8a2a2c', '#c85a4c', '#e89a8a'),
  col_marble_aggie: marble('#d8a05c', '#8a4a2c', '#f4d8a0'),
  col_marble_swirl: marble('#e8e0d0', '#5a78c8', '#ffffff'),
  col_marble_clearie: marble('#c8e0e8', '#a0c0d0', '#ffffff'),
  col_marble_galaxy: marble('#2a2a5c', '#a888e0', '#c8c8ff'),
  col_marble_tiger: marble('#c88a2c', '#3a2a18', '#f4d078'),
  col_marble_peewee: marble('#78b858', '#e8f0a8', '#c8f0a8'),
  col_marble_steelie: marble('#8a909c', '#b4bac4', '#e8ecf4'),
  col_marble_corkscrew: marble('#e8e0c8', '#d0483c', '#ffffff'),
};
