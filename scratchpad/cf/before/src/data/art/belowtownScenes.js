// Art for Belowtown's set pieces (Chapter 4): the Sunstone hanging over the
// town (dim, flickering, blazing), the glass cases with the Hero's relics,
// the frog drummer and the beetle with the CHEER sign for King Peptup's
// show, the red carpet, the heat vent in Hobnail's forge and the little
// paintings in the Hall of the Visit.
//
//   sunstone              the Sunstone, dim and cracked (a prop; one tile
//                         wide on the ground, but the picture is 64 across)
//   sunstone_bright       the same, blazing
//   sunstone_dim_pulse    the dim one breathing slowly (3 frames)
//   sunstone_bright_pulse the bright one shimmering (3 frames)
//   sunstone_flicker      the dim one stuttering, for the welcome (6 frames)
//   sunstone_blaze        dim, then flaring up to full (5 frames, once)
//   relic_case_cloak / _cup / _boot    glass cases (props)
//   bf_drummer            a frog beating a drum on its belly (2 frames)
//   bf_cheer_beetle       a beetle with a CHEER sign, down then up (2 frames)
//   red_carpet            a runner tile (flat, walkable)
//   heat_vent             a grate over the hot rock, glowing and steaming
//   hist_panel_a / _b / _c   small old paintings in frames
//   bt_spot               an invisible tile to hang words on
//
// Colours are on characters from U+3800 up so nothing clashes with the
// other art files; BT_SCENE_PALETTE_EXTRA is merged into PROP_PALETTE
// (props.js).

// --- A tiny painter ---------------------------------------------------
const colors = new Map();
const palette = {};
function P(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0x3800 + colors.size);
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
    x = Math.round(x);
    y = Math.round(y);
    if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.cells[y][x] = c || null;
  }

  get(x, y) {
    return x >= 0 && y >= 0 && x < this.w && y < this.h ? this.cells[y][x] : null;
  }

  rect(x, y, w, h, c) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c);
  }

  oval(cx, cy, rx, ry, c) {
    for (let dy = -ry; dy <= ry; dy++) {
      const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (dy * dy) / (ry * ry + 0.25))));
      this.rect(cx - w, cy + dy, w * 2 + 1, 1, c);
    }
  }

  line(x0, y0, x1, y1, c) {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= steps; i++) this.set(x0 + ((x1 - x0) * i) / steps, y0 + ((y1 - y0) * i) / steps, c);
  }

  // A filled polygon, [[x, y], ...].
  poly(pts, c) {
    const ys = pts.map((p) => p[1]);
    for (let y = Math.floor(Math.min(...ys)); y <= Math.ceil(Math.max(...ys)); y++) {
      const xs = [];
      for (let i = 0; i < pts.length; i++) {
        const [x1, y1] = pts[i];
        const [x2, y2] = pts[(i + 1) % pts.length];
        if ((y1 <= y && y2 > y) || (y2 <= y && y1 > y)) xs.push(x1 + ((y - y1) / (y2 - y1)) * (x2 - x1));
      }
      xs.sort((a, b) => a - b);
      for (let i = 0; i + 1 < xs.length; i += 2) this.rect(Math.round(xs[i]), y, Math.max(1, Math.round(xs[i + 1]) - Math.round(xs[i])), 1, c);
    }
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
    return this.cells.map((row) => row.map((c) => c ?? '.').join(''));
  }
}

const OUT = P('#1c1226');
const hexToRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a, b, k) => {
  const A = hexToRgb(a);
  const B = hexToRgb(b);
  return `#${A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join('')}`;
};

// =====================================================================
// 1. The Sunstone
// =====================================================================
const SS_W = 64;
const SS_H = 80;
const K = 4 / 3; // drawn on a 48 x 60 plan, then made a third bigger

// `level` 0 is the dim, dull stone; 1 is blazing. `cracks` draws the dark
// seams of the dying one; `rays` the spokes of the blaze.
function sunstone(level, { cracks = true, rays = false } = {}) {
  const g = new Grid(SS_W, SS_H);
  const dull = ['#6a4a2c', '#8c6232', '#ac7e3a', '#cc9c50'];
  const blaze = ['#e0a830', '#ffcf54', '#fff0a0', '#ffffff'];
  const tone = (i) => P(mix(dull[i], blaze[i], level));
  const poly = (pts, c) => g.poly(pts.map(([x, y]) => [x * K, y * K]), c);
  const line = (x0, y0, x1, y1, c) => g.line(x0 * K, y0 * K, x1 * K, y1 * K, c);
  // The rock it hangs from.
  poly([[8, 0], [40, 0], [37, 9], [30, 12], [18, 12], [11, 9]], P('#2a2030'));
  poly([[12, 0], [34, 0], [31, 7], [20, 9]], P('#3a2e44'));
  for (const x of [13, 20, 28, 35]) line(x, 0, x + (x < 24 ? 2 : -2), 10, P('#1c1226'));
  // The crystal, point down: left face, left middle, right middle, right face.
  const top = 10;
  const mid = 24;
  const tip = 58;
  poly([[24, top], [8, mid], [24, tip]], tone(0));
  poly([[24, top], [24, tip], [18, mid + 2], [14, mid]], tone(1));
  poly([[24, top], [24, tip], [32, mid + 4], [29, mid - 4]], tone(2));
  poly([[24, top], [40, mid], [24, tip]], tone(1));
  poly([[24, top], [40, mid], [35, mid + 1], [29, mid - 3]], tone(3));
  // A bright facet near the top, the glint.
  poly([[22, top + 3], [27, top + 6], [24, top + 15], [20, top + 10]], tone(3));
  g.rect(Math.round(23 * K), Math.round((top + 5) * K), 2, 2, P(mix('#f0d8a0', '#ffffff', level)));
  // Facet edges.
  const edge = P(mix('#3a2418', '#d89820', level));
  line(24, top, 8, mid, edge);
  line(24, top, 40, mid, edge);
  line(8, mid, 24, tip, edge);
  line(40, mid, 24, tip, edge);
  line(24, top, 24, tip, P(mix('#4a3020', '#ffe890', level)));
  if (cracks && level < 0.8) {
    const dark = P(mix('#1c1226', '#a07830', level * 1.2));
    line(30, 20, 34, 28, dark);
    line(34, 28, 31, 35, dark);
    line(31, 35, 33, 42, dark);
    line(15, 26, 19, 33, dark);
    line(19, 33, 17, 41, dark);
    // A dead, grey patch where the light has gone out of it.
    if (level < 0.35) poly([[24, 40], [30, 36], [27, 50]], P('#4a4046'));
  }
  if (!rays) {
    g.outline(OUT);
    return g;
  }
  // The blaze: spokes of light all round, pale gold, behind the crystal.
  const cx = 24 * K;
  const cy = 32 * K;
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const len = (i % 2 ? 9 : 14) * K;
    const r0 = 17 * K;
    const col = P(i % 2 ? '#ffe070' : '#fff6c0');
    const x0 = cx + Math.cos(a) * r0 * 0.9;
    const y0 = cy + Math.sin(a) * r0 * 1.3;
    const x1 = cx + Math.cos(a) * (r0 + len) * 0.9;
    const y1 = cy + Math.sin(a) * (r0 + len) * 1.3;
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let t = 0; t <= steps; t++) {
      const x = Math.round(x0 + ((x1 - x0) * t) / steps);
      const y = Math.round(y0 + ((y1 - y0) * t) / steps);
      if (!g.get(x, y)) g.set(x, y, col);
    }
  }
  g.outline(OUT);
  return g;
}

const SUNSTONE_DIM = sunstone(0.05).rows();
const SUNSTONE_DIMMER = sunstone(0, { cracks: true }).rows();
const SUNSTONE_DIM_UP = sunstone(0.16).rows();
const SUNSTONE_BRIGHT = sunstone(1, { cracks: false, rays: true }).rows();
const SUNSTONE_BRIGHT_B = sunstone(0.9, { cracks: false, rays: true }).rows();
const SUNSTONE_BRIGHT_C = sunstone(0.96, { cracks: false, rays: true }).rows();
const SUNSTONE_OFF = sunstone(0, { cracks: true }).rows();

export const SUNSTONE_DIM_PULSE_PALETTE = palette;
export const SUNSTONE_DIM_PULSE_SPRITES = { a: SUNSTONE_DIM, b: SUNSTONE_DIM_UP, c: SUNSTONE_DIM };
export const SUNSTONE_BRIGHT_PULSE_PALETTE = palette;
export const SUNSTONE_BRIGHT_PULSE_SPRITES = { a: SUNSTONE_BRIGHT, b: SUNSTONE_BRIGHT_B, c: SUNSTONE_BRIGHT_C };
export const SUNSTONE_FLICKER_PALETTE = palette;
export const SUNSTONE_FLICKER_SPRITES = {
  a: SUNSTONE_DIM, b: sunstone(0.3).rows(), c: SUNSTONE_OFF, d: SUNSTONE_DIM_UP, e: SUNSTONE_OFF, f: SUNSTONE_DIMMER,
};
export const SUNSTONE_BLAZE_PALETTE = palette;
export const SUNSTONE_BLAZE_SPRITES = {
  a: SUNSTONE_DIM, b: sunstone(0.3, { cracks: true }).rows(), c: sunstone(0.65, { cracks: false, rays: true }).rows(), d: SUNSTONE_BRIGHT, e: SUNSTONE_BRIGHT_C,
};

// =====================================================================
// 2. The Hero's relics in glass cases
// =====================================================================
function relicCase(draw) {
  const g = new Grid(16, 30);
  // Stone plinth.
  g.rect(2, 22, 12, 8, P('#6a6070'));
  g.rect(2, 22, 12, 2, P('#8a8096'));
  g.rect(1, 29, 14, 1, P('#4a4258'));
  g.rect(3, 25, 10, 1, P('#544c60'));
  // Glass: pale blue, a bright edge on the left.
  g.rect(2, 4, 12, 18, P('#2a3848'));
  g.rect(3, 5, 10, 16, P('#4a6478'));
  g.rect(3, 5, 1, 16, P('#a8d0e0'));
  g.rect(12, 5, 1, 16, P('#385064'));
  g.rect(3, 5, 10, 1, P('#8cb4c8'));
  // Brass cap.
  g.rect(2, 3, 12, 2, P('#c89a40'));
  g.rect(3, 2, 10, 1, P('#e8c060'));
  draw(g);
  // A shine across the glass.
  g.line(5, 8, 8, 5, P('#d8f0f8'));
  g.line(5, 10, 10, 5, P('#a8d0e0'));
  g.outline(OUT);
  return g.rows();
}

const cloak = relicCase((g) => {
  // A small grey-green cloak, folded over a stand, with a tarnished clasp.
  g.poly([[5, 9], [11, 9], [12, 21], [4, 21]], P('#5c7060'));
  g.poly([[6, 9], [10, 9], [10, 21], [8, 21]], P('#74887a'));
  g.rect(4, 19, 8, 2, P('#465848'));
  g.rect(7, 10, 2, 2, P('#b8a050'));
  g.line(5, 14, 5, 20, P('#465848'));
});
const cup = relicCase((g) => {
  // A tin cup, dented, on its side of the plinth, a tiny handle.
  g.rect(5, 15, 6, 6, P('#a8acb8'));
  g.rect(5, 15, 1, 6, P('#d8dce8'));
  g.rect(10, 16, 1, 5, P('#767a88'));
  g.rect(5, 14, 6, 1, P('#d8dce8'));
  g.set(4, 17, P('#767a88'));
  g.set(4, 18, P('#767a88'));
  g.set(4, 19, P('#767a88'));
  g.set(8, 19, P('#767a88')); // the dent
  g.set(9, 18, P('#8a8e9c'));
});
const boot = relicCase((g) => {
  // One boot. Very small. Worn through at the toe.
  g.rect(5, 12, 4, 8, P('#6a4426'));
  g.rect(5, 12, 1, 8, P('#8c6238'));
  g.rect(5, 20, 7, 2, P('#4a2e1a'));
  g.rect(9, 17, 3, 3, P('#6a4426'));
  g.rect(5, 11, 4, 1, P('#a07a48'));
  g.set(11, 18, P('#2a1c14')); // the hole
  g.set(7, 15, P('#c8b078')); // a lace tie
  g.set(8, 16, P('#c8b078'));
});

// =====================================================================
// 3. The show: a frog drummer, the CHEER beetle, the carpet
// =====================================================================
const FROG = ['#8aa874', '#b6cf98', '#587350', '#e6e8bc'];

function drummer(frame) {
  const g = new Grid(22, 22);
  const skin = P(FROG[0]);
  const lit = P(FROG[1]);
  const dark = P(FROG[2]);
  const belly = P(FROG[3]);
  // Legs folded, body, big round belly with a drum painted on it.
  g.oval(11, 17, 8, 4, dark);
  g.oval(11, 14, 7, 7, skin);
  g.oval(10, 12, 4, 4, lit);
  g.oval(11, 15, 5, 5, belly);
  // The drum on the belly: a red rim and a skin head.
  g.oval(11, 16, 4, 3, P('#a8322e'));
  g.oval(11, 16, 3, 2, P('#f0dcb0'));
  // Head and eyes.
  g.oval(11, 6, 6, 4, skin);
  g.oval(7, 3, 2, 2, skin);
  g.oval(15, 3, 2, 2, skin);
  g.set(7, 3, P('#120c1c'));
  g.set(15, 3, P('#120c1c'));
  g.set(8, 2, P('#ffffff'));
  g.set(16, 2, P('#ffffff'));
  g.line(8, 8, 14, 8, P('#3a5430'));
  // Arms with sticks: one up, one down, then swapped.
  const [up, down] = frame ? [[4, 10], [17, 14]] : [[17, 10], [4, 14]];
  g.line(11 + (up[0] < 11 ? -4 : 4), 12, up[0], up[1] - 4, dark);
  g.line(up[0], up[1] - 4, up[0], up[1] - 7, P('#b88a50'));
  g.line(11 + (down[0] < 11 ? -4 : 4), 14, down[0] + (down[0] < 11 ? 3 : -3), 16, dark);
  g.set(down[0] + (down[0] < 11 ? 3 : -3), 16, P('#b88a50'));
  if (frame === 0) g.set(11, 15, P('#fff0c0')); // a thump
  g.outline(OUT);
  return g.rows();
}
export const BF_DRUMMER_PALETTE = palette;
export const BF_DRUMMER_SPRITES = { left: drummer(0), right: drummer(1) };

// A five-pixel-high alphabet for signs.
const FONT = {
  C: ['011', '100', '100', '100', '011'],
  H: ['101', '101', '111', '101', '101'],
  E: ['111', '100', '110', '100', '111'],
  R: ['110', '101', '110', '101', '101'],
};
function signText(g, text, x, y, color) {
  for (const ch of text) {
    FONT[ch].forEach((row, j) => [...row].forEach((bit, i) => { if (bit === '1') g.set(x + i, y + j, color); }));
    x += 4;
  }
}

function cheerBeetle(up) {
  const g = new Grid(28, 40);
  const shell = P('#6c5a7a');
  const shellDark = P('#4a3a58');
  const shellLit = P('#9a86ae');
  const cap = P('#3a64a8');
  // Little legs.
  for (const x of [10, 14, 18]) g.rect(x, 36, 2, 3, shellDark);
  // The shell, the body under the cap, a face.
  g.oval(14, 29, 7, 8, shell);
  g.oval(12, 27, 3, 4, shellLit);
  g.line(14, 22, 14, 36, shellDark);
  g.oval(14, 17, 5, 4, P('#7e6a8e'));
  g.rect(9, 13, 11, 3, cap);
  g.rect(11, 11, 7, 3, cap);
  g.set(12, 17, P('#120c1c'));
  g.set(16, 17, P('#120c1c'));
  g.line(13, 20, 15, 20, P('#2a1c30'));
  // Feelers.
  g.line(12, 11, 9, 7, shellDark);
  g.line(16, 11, 19, 7, shellDark);
  const board = P('#f4ead0');
  const edge = P('#8a5a32');
  if (up) {
    // The sign on a stick, high over his head, and an arm holding it.
    g.rect(2, 0, 24, 9, edge);
    g.rect(3, 1, 22, 7, board);
    signText(g, 'CHEER', 4, 2, P('#b02a3c'));
    g.line(14, 9, 14, 16, P('#b88a50'));
    g.line(18, 24, 16, 18, shellDark);
    g.line(10, 24, 7, 20, shellDark);
  } else {
    // The sign held down low by his side, the writing facing away.
    g.rect(19, 24, 8, 7, edge);
    g.rect(20, 25, 6, 5, P('#cdbf9c'));
    g.line(16, 25, 20, 27, shellDark);
    g.line(10, 25, 8, 30, shellDark);
  }
  g.outline(OUT);
  return g.rows();
}
export const BF_CHEER_BEETLE_PALETTE = palette;
export const BF_CHEER_BEETLE_SPRITES = { down: cheerBeetle(false), up: cheerBeetle(true) };

function redCarpet() {
  const g = new Grid(16, 16);
  g.rect(0, 0, 16, 16, P('#8c1a30'));
  g.rect(2, 0, 12, 16, P('#a82440'));
  g.rect(1, 0, 1, 16, P('#e0b040'));
  g.rect(14, 0, 1, 16, P('#e0b040'));
  g.rect(7, 0, 2, 16, P('#b83450'));
  g.rect(0, 7, 16, 1, P('#8c1a30'));
  return g.rows();
}

// =====================================================================
// 4. The forge's heat vent, and small paintings
// =====================================================================
function heatVent(frame) {
  const g = new Grid(32, 14);
  g.rect(0, 5, 32, 9, P('#3a3238'));
  g.rect(1, 6, 30, 7, P('#241e28'));
  const heat = [P('#ff8c1a'), P('#ffb040'), P('#fff0a0')];
  // Grate bars over a glowing throat.
  g.rect(3, 7, 26, 5, heat[0]);
  g.rect(6, 8, 20, 3, heat[1]);
  g.rect(11, 9, 10, 1, heat[2]);
  for (let x = 4; x < 29; x += 4) g.rect(x, 7, 1, 5, P('#241e28'));
  g.rect(3, 7, 26, 1, P('#5a5060'));
  // Steam curling up, different each frame.
  const steam = [P('#d8d4e4'), P('#a8a4b8')];
  const puffs = [[8, 3], [16, 1], [24, 4]];
  puffs.forEach(([x, y], i) => {
    const dy = ((frame + i) % 3) * 1;
    g.oval(x + ((frame + i) % 2), y - dy, 2, 1, steam[(frame + i) % 2]);
  });
  g.outline(OUT);
  return g.rows();
}
export const HEAT_VENT_PALETTE = palette;
export const HEAT_VENT_SPRITES = { a: heatVent(0), b: heatVent(1), c: heatVent(2) };

function frame(painting) {
  const g = new Grid(16, 28);
  g.rect(1, 6, 14, 20, P('#8a5a32'));
  g.rect(2, 7, 12, 18, P('#c89a64'));
  g.rect(3, 8, 10, 16, P('#e8dcc0'));
  painting(g);
  g.rect(1, 6, 14, 1, P('#b07a48'));
  g.rect(7, 4, 2, 3, P('#e0b040'));
  g.outline(OUT);
  return g.rows();
}
// A, the town being founded: three little figures round a lamp.
const histA = frame((g) => {
  g.rect(3, 19, 10, 5, P('#6a8a58'));
  g.rect(3, 8, 10, 6, P('#3a3a68'));
  g.oval(8, 13, 2, 2, P('#ffd860'));
  for (const [x, c] of [[5, '#8a6a98'], [8, '#6a5a3a'], [11, '#6a8a58']]) {
    g.rect(x - 1, 17, 3, 3, P(c));
    g.set(x, 16, P('#e8c8a0'));
  }
});
// B, a very large mushroom and a very proud toad.
const histB = frame((g) => {
  g.rect(3, 19, 10, 5, P('#5a7048'));
  g.rect(7, 15, 3, 5, P('#e8e0d0'));
  g.oval(8, 14, 4, 2, P('#c83a3a'));
  g.set(6, 13, P('#ffffff'));
  g.set(9, 14, P('#ffffff'));
  g.oval(4, 21, 1, 1, P('#8a9a58'));
  g.set(4, 20, P('#ffffff'));
});
// C, the long stair going down, and nothing at the bottom of it.
const histC = frame((g) => {
  g.rect(3, 8, 10, 16, P('#2a2038'));
  for (let i = 0; i < 6; i++) g.rect(3 + i, 10 + i * 2, 10 - i * 2, 2, P(i % 2 ? '#8a7a6a' : '#a89a88'));
});

export const BT_SCENE_PALETTE_EXTRA = palette;
export const BT_SCENE_PROP_SPRITES = {
  sunstone: SUNSTONE_DIM,
  sunstone_bright: SUNSTONE_BRIGHT,
  relic_case_cloak: cloak,
  relic_case_cup: cup,
  relic_case_boot: boot,
  bf_drummer: BF_DRUMMER_SPRITES.left,
  bf_cheer_beetle: BF_CHEER_BEETLE_SPRITES.down,
  red_carpet: redCarpet(),
  heat_vent: HEAT_VENT_SPRITES.a,
  hist_panel_a: histA,
  hist_panel_b: histB,
  hist_panel_c: histC,
  // Nothing to see: a spot on a wall that has words of its own (the lantern in the mural).
  bt_spot: Array.from({ length: 16 }, () => '.'.repeat(16)),
};
export const BT_SCENE_FOOTPRINTS = {
  heat_vent: 2,
};

// =====================================================================
// What the Sunstone lights. Placed from the foot of the prop (up is
// negative): the stone's own bloom, and a pool on the floor `floor` pixels
// below the foot. Dim, it only just lifts the dark; blazing, it floods the
// whole town.
// =====================================================================
export function sunstoneGlow(blazing, floor = 120) {
  return blazing
    ? [
      { dy: -38, bloom: 72, strength: 1, flicker: 0.1, color: '255, 236, 170' },
      { dy: floor, pool: 320, strength: 1, flicker: 0.05, color: '255, 232, 170' },
      { dy: floor, pool: 190, strength: 0.7, flicker: 0.05, color: '255, 244, 200' },
    ]
    : [
      { dy: -38, bloom: 46, strength: 0.8, flicker: 0.4, color: '255, 188, 108' },
      { dy: floor, pool: 240, strength: 0.55, flicker: 0.5, color: '255, 190, 112' },
    ];
}
export const HEAT_VENT_GLOW = [
  { dy: -4, bloom: 18, strength: 0.7, flicker: 0.8, color: '255, 128, 48' },
  { dy: 2, pool: 100, strength: 0.65, flicker: 0.6, color: '255, 128, 48' },
];
export const DRUMMER_GLOW = [{ dy: 2, pool: 30, strength: 0.2, flicker: 0, color: '255, 200, 120' }];
