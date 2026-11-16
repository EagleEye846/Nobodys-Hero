// Props for Merrow, the drowned town (Chapter 5, "The Tide Held"). Drawn like lanesProps.js:
// rows of characters from a small painter, 16 pixels to a tile, standing on the bottom edge and
// centred over their footprint. Every id starts `mw_`. Ones that move are also animations: put
// the prop's name in the object's `animation` too (and a `speed`).
//
// The look: dressed grey-green stone, limewash gone green where the water sat, dark slate, black
// iron, old bronze turned to verdigris. Nothing here is lit (no lamps, no candles burning): the
// storm shade stays on them. Nothing hangs in the air: every bell, sign, rope and line has its
// post, bracket, beam or peg drawn in.
//
//   mw_bell_low / _mid / _high    a bronze bell on an iron bracket on its own post (big, middle,
//                                 small); each has an `_on` look, the bell just rung and gleaming
//   mw_ringers_frame (3)          the ringers' practice frame: two posts, a beam with empty
//                                 hooks, a painted board MERROW RINGERS
//   mw_market_cross (2)           a stone cross on three steps, the steps green from the water
//   mw_well (2)                   the town well: roof, winch, bucket, water to the lip
//   mw_sign_baker / mw_sign_post  shop signs on a bracketed post (a loaf; a letter)
//   mw_laundry_line (3)           washing left pegged out between two posts, sodden, dripping
//   mw_weathercock                a weathercock on its pole, the tip of a drowned roof, in water
//   mw_roof_boat (3)              a rowboat stranded keel-up on a roof ridge
//   mw_chimney_pots               a chimney stack with three pots
//   mw_laid_table (3)             a table laid for four, chairs pushed back, candles never lit
//   mw_stopped_clock              a grandfather clock, stopped (tall)
//   mw_dresser (2)                a kitchen dresser with its plates
//   mw_coat_pegs (2)              a peg rail on the wall: four coats and a small hat
//   mw_bell_tower (4)             the drowned bell tower from outside (128 high, decorative)
//   mw_tower_porch (5)            the tower's stone base over its porch (80x64); fades while the party is inside
//   mw_tower_door (2)             a studded oak door in a stone arch, barred; `_open` stands open
//   mw_flood_grate                an arched drain grating at the waterline, bars rusted out
//   mw_great_bell (3)             the great bell, fallen on its side in the shallows, cracked lip
//   mw_gulper_nest (4)            a nest of nets, rope, bones, spoons and shiny bits (flat)
//   mw_bell_rope                  a bell rope with a striped sally, from a beam on the wall
//   mw_sea_gate (4)               the iron sea gate, a fish's open mouth with one tooth gone;
//                                 `_open` swung back on dark tunnel water
//   mw_peal_board (2)             a board of peals rung, gilt letters, hung on two pegs
//   mw_ropes_coiled               bell ropes coiled on the floor (flat)
//   mw_bubbles*                   a few bubbles rising and popping (over water, flat)

const colors = new Map();
const palette = {};
function char(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0x6a00 + colors.size);
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

  line(x0, y0, x1, y1, c) {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= steps; i++) this.set(x0 + ((x1 - x0) * i) / steps, y0 + ((y1 - y0) * i) / steps, c);
  }

  oval(cx, cy, rx, ry, c) {
    for (let dy = -ry; dy <= ry; dy++) {
      const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (dy * dy) / (ry * ry + 0.25))));
      this.rect(cx - w, cy + dy, w * 2 + 1, 1, c);
    }
  }

  ring(cx, cy, rx, ry, c) {
    const n = Math.max(12, Math.round((rx + ry) * 4));
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      this.set(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, c);
    }
  }

  // A dark line round everything drawn so far (draw see-through water after this).
  outline(c, skip = () => false) {
    const out = [];
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) {
      if (this.cells[y][x]) continue;
      const n = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => {
        const v = this.get(x + dx, y + dy);
        return v && !skip(v);
      });
      if (n) out.push([x, y]);
    }
    for (const [x, y] of out) this.set(x, y, c);
  }

  // Tiny capitals and figures, 3 by 5.
  text(x, y, str, c) {
    let cx = x;
    for (const ch of str) {
      const glyph = FONT[ch];
      if (glyph) glyph.forEach((row, j) => [...row].forEach((bit, i) => { if (bit === '#') this.set(cx + i, y + j, c); }));
      cx += ch === ' ' ? 2 : (glyph?.[0].length ?? 3) + 1;
    }
    return cx - x - 1;
  }

  rows() {
    return this.cells.map((row) => row.map((c) => (c ? char(c) : '.')).join(''));
  }
}

const FONT = {
  A: ['.#.', '#.#', '###', '#.#', '#.#'], E: ['###', '#..', '##.', '#..', '###'], G: ['.##', '#..', '#.#', '#.#', '.##'],
  I: ['###', '.#.', '.#.', '.#.', '###'], L: ['#..', '#..', '#..', '#..', '###'], M: ['#...#', '##.##', '#.#.#', '#...#', '#...#'],
  N: ['#..#', '##.#', '#.##', '#..#', '#..#'], O: ['.#.', '#.#', '#.#', '#.#', '.#.'], P: ['##.', '#.#', '##.', '#..', '#..'],
  R: ['##.', '#.#', '##.', '#.#', '#.#'], S: ['.##', '#..', '.#.', '..#', '##.'], U: ['#.#', '#.#', '#.#', '#.#', '###'],
  W: ['#...#', '#...#', '#.#.#', '##.##', '#...#'], K: ['#.#', '#.#', '##.', '#.#', '#.#'], T: ['###', '.#.', '.#.', '.#.', '.#.'],
  0: ['###', '#.#', '#.#', '#.#', '###'], 1: ['.#', '##', '.#', '.#', '.#'], 2: ['##.', '..#', '.#.', '#..', '###'],
  3: ['##.', '..#', '.#.', '..#', '##.'], 4: ['#.#', '#.#', '###', '..#', '..#'], 5: ['###', '#..', '##.', '..#', '##.'],
  6: ['.##', '#..', '###', '#.#', '###'], 7: ['###', '..#', '.#.', '.#.', '.#.'], 8: ['###', '#.#', '###', '#.#', '###'],
  9: ['###', '#.#', '###', '..#', '##.'],
};

const frames = (fn, n) => Object.fromEntries(Array.from({ length: n }, (_, i) => [`f${i + 1}`, fn(i)]));

// --- Colours ------------------------------------------------------------
const OUT = '#0c1210';
const ST = ['#232c29', '#38433e', '#505c55', '#6a766d', '#8a968b', '#a8b2a4']; // dressed stone, dark to lit
const STAIN = ['#2c3e32', '#3a5240', '#4a6650']; // the green the water left
const WEED = ['#22422a', '#32603a', '#4a7c44', '#78a65e'];
const BR = ['#2e1c0c', '#5a3a18', '#8a5c28', '#b8863c', '#e0b860', '#fff0b0']; // bronze
const BR_ON = ['#4a2e10', '#8a5c22', '#c08a34', '#e8b84c', '#ffe08a', '#ffffff'];
const VG = ['#3a7262', '#5aa088']; // verdigris
const IRON = ['#121416', '#262a2c', '#3e4446', '#5a6264', '#7a8486'];
const RUST = ['#5a2e18', '#8a4a26'];
const IRON_BAND = '#2a3236';
const WOOD = ['#20160e', '#3a2a1a', '#56402c', '#745840', '#94785a'];
const OAK = ['#1e140a', '#3c2814', '#5a3e22', '#7a5834'];
const SLATE = ['#1a2226', '#262f34', '#334046', '#46565c'];
const LIME = ['#8e9688', '#a4ac9c', '#b8beae', '#ccd0c0'];
const CLOTH = ['#a8aca0', '#c4c8bc', '#dcdfd2', '#eef0e4'];
const WATER = { body: '#1d4a3ea8', deep: '#163a32c0', edge: '#7ec4acc8', foam: '#c8eedec0', glint: '#e6fff4d0' };
const GILT = ['#8a6a24', '#c8a040', '#ecd078'];

// See-through water over the foot of a prop, from row y down, a lapping edge on top.
function waterFoot(g, x0, x1, y, seed = 0) {
  for (let x = x0; x < x1; x++) {
    const edge = y + Math.round(Math.sin((x + seed) / 3.2) * 0.8);
    for (let yy = edge; yy < g.h; yy++) {
      if (yy === edge) g.set(x, yy, WATER.edge);
      else if (yy === edge + 1 && (x + seed) % 7 < 2) g.set(x, yy, WATER.foam);
      else g.set(x, yy, yy > edge + 3 ? WATER.deep : WATER.body);
    }
  }
}

// --- Bells --------------------------------------------------------------
// A bell hung by its crown from (cx, top): w wide at the lip, h tall.
function drawBell(g, cx, top, w, h, on) {
  const C = on ? BR_ON : BR;
  // The crown loop.
  g.rect(cx - 1, top, 3, 2, C[1]);
  g.set(cx, top, C[3]);
  for (let r = 0; r < h; r++) {
    const t = r / Math.max(1, h - 1);
    let half = (w / 2) * (0.5 + 0.38 * t * t);
    if (r >= h - 2) half = w / 2;
    half = Math.max(1, Math.round(half));
    const y = top + 2 + r;
    g.rect(cx - half, y, half * 2 + 1, 1, C[2]);
    // Lit on the left, dark on the right, the shoulder bright.
    g.rect(cx - half, y, Math.max(1, Math.round(half * 0.6)), 1, C[3]);
    g.set(cx - half + 1, y, C[4]);
    g.rect(cx + Math.round(half * 0.4), y, half - Math.round(half * 0.4) + 1, 1, C[1]);
    if (r === 0) g.rect(cx - half, y, half * 2 + 1, 1, C[3]);
  }
  const lip = top + 2 + h - 1;
  // The sound bow: a bright line just above the lip, the lip itself dark.
  g.rect(cx - Math.floor(w / 2), lip - 1, w, 1, C[4]);
  g.rect(cx - Math.floor(w / 2), lip, w + 1, 1, C[1]);
  // Waist band.
  g.rect(cx - Math.round(w * 0.3), top + 2 + Math.floor(h * 0.35), Math.round(w * 0.6) + 1, 1, C[1]);
  // The clapper's ball below the lip.
  g.set(cx, lip + 1, IRON[2]);
  if (w >= 9) g.set(cx, lip + 2, IRON[1]);
  if (on) {
    // Just rung: a hard glint, and the shiver drawn as little arcs either side.
    g.set(cx - Math.floor(w / 2) + 1, top + 3, C[5]);
    g.set(cx - Math.floor(w / 2) + 1, top + 4, C[5]);
    g.set(cx - 1, top + 2, C[5]);
  } else {
    // Old: verdigris weeping from the shoulder.
    g.set(cx + 1, top + 3, VG[0]);
    g.line(cx + 1, top + 4, cx + 2, top + 2 + Math.floor(h * 0.7), VG[0]);
    g.set(cx - 2, top + 2 + Math.floor(h * 0.5), VG[1]);
  }
}
function ringMarks(g, cx, cy, w) {
  const c = '#fff4c0d8';
  for (const s of [-1, 1]) {
    const x = cx + s * (Math.floor(w / 2) + 2);
    g.set(x, cy - 1, c); g.set(x + s, cy, c); g.set(x, cy + 1, c);
    g.set(x + s * 2, cy - 2, '#fff4c088'); g.set(x + s * 3, cy, '#fff4c088'); g.set(x + s * 2, cy + 2, '#fff4c088');
  }
}

// A bell on its own post: the post on the left, an iron arm out over the bell with a brace.
function bellPost(size, on) {
  const spec = { low: { h: 34, bw: 11, bh: 10 }, mid: { h: 36, bw: 9, bh: 8 }, high: { h: 38, bw: 7, bh: 6 } }[size];
  const g = new Grid(16, spec.h);
  const postTop = 4;
  // The stone footing and the post.
  g.rect(1, spec.h - 4, 7, 4, ST[2]);
  g.rect(1, spec.h - 4, 7, 1, ST[4]);
  g.rect(1, spec.h - 1, 7, 1, ST[1]);
  g.set(2, spec.h - 2, STAIN[1]); g.set(6, spec.h - 3, STAIN[0]);
  g.rect(3, postTop, 3, spec.h - 4 - postTop, WOOD[2]);
  g.rect(3, postTop, 1, spec.h - 4 - postTop, WOOD[3]);
  g.rect(5, postTop, 1, spec.h - 4 - postTop, WOOD[1]);
  g.rect(2, postTop - 1, 5, 2, WOOD[3]);
  // The iron arm, its scroll end, and the brace back to the post.
  const cx = 10;
  g.rect(4, postTop + 1, 11, 2, IRON[2]);
  g.rect(4, postTop + 1, 11, 1, IRON[3]);
  g.set(15, postTop + 1, IRON[2]); g.set(15, postTop, IRON[2]); g.set(14, postTop - 1, IRON[2]);
  g.line(6, postTop + 8, cx + 1, postTop + 3, IRON[2]);
  // Strap round the post where the arm's bolted.
  g.rect(2, postTop + 1, 5, 1, IRON[1]); g.rect(2, postTop + 7, 5, 1, IRON[1]);
  g.set(4, postTop + 7, IRON[3]);
  // The hanger down to the crown.
  g.set(cx, postTop + 3, IRON[1]);
  drawBell(g, cx, postTop + 4, spec.bw, spec.bh, on);
  g.outline(OUT, (v) => v === '#fff4c0d8' || v === '#fff4c088');
  if (on) {
    // A soft gleam round the bell while it sings.
    const y0 = postTop + 4;
    const y1 = postTop + 7 + spec.bh;
    const halo = [];
    for (let y = y0 - 1; y <= y1 + 1; y++) for (let x = cx - Math.ceil(spec.bw / 2) - 2; x <= cx + Math.ceil(spec.bw / 2) + 2; x++) {
      if (g.get(x, y)) continue;
      if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => g.get(x + dx, y + dy) === OUT && y + dy >= y0)) halo.push([x, y]);
    }
    for (const [x, y] of halo) g.set(x, y, '#ffe08a50');
    ringMarks(g, cx, postTop + 6 + Math.floor(spec.bh / 2), spec.bw);
  }
  return g.rows();
}

// --- The ringers' practice frame -----------------------------------------
function ringersFrame() {
  const g = new Grid(48, 40);
  // Posts on stone pads.
  for (const x of [3, 41]) {
    g.rect(x - 1, 36, 6, 4, ST[2]);
    g.rect(x - 1, 36, 6, 1, ST[4]);
    g.rect(x, 6, 4, 30, WOOD[2]);
    g.rect(x, 6, 1, 30, WOOD[3]);
    g.rect(x + 3, 6, 1, 30, WOOD[1]);
    for (let y = 30; y < 36; y += 2) g.set(x + 1 + (y % 3), y, STAIN[1]);
  }
  // The headbeam, with its pegged ends, and three empty hooks where bells hung.
  g.rect(1, 4, 46, 4, WOOD[2]);
  g.rect(1, 4, 46, 1, WOOD[4]);
  g.rect(1, 7, 46, 1, WOOD[1]);
  g.set(4, 5, WOOD[0]); g.set(43, 5, WOOD[0]);
  for (const hx of [14, 24, 34]) {
    g.set(hx, 8, IRON[3]); g.set(hx, 9, IRON[2]); g.set(hx, 10, IRON[2]); g.set(hx + 1, 11, IRON[2]); g.set(hx + 2, 10, IRON[2]);
  }
  // Two rails between the posts carry the board.
  g.rect(7, 14, 34, 2, WOOD[1]);
  g.rect(7, 30, 34, 2, WOOD[1]);
  // The painted board: old blue-green paint, a cream border, the letters; paint flaking.
  g.rect(7, 13, 34, 19, '#24403e');
  g.rect(7, 13, 34, 1, '#3a5c58');
  g.rect(8, 14, 32, 1, '#c8c4a4'); g.rect(8, 30, 32, 1, '#c8c4a4');
  g.rect(8, 14, 1, 17, '#c8c4a4'); g.rect(39, 14, 1, 17, '#c8c4a4');
  g.text(11, 16, 'MERROW', '#ddd6b0');
  g.text(10, 23, 'RINGERS', '#ddd6b0');
  for (const [x, y] of [[12, 20], [30, 19], [20, 28], [34, 27], [26, 21]]) { g.set(x, y, '#5a4a36'); g.set(x + 1, y, '#5a4a36'); }
  // Bolts through the board into the rails.
  for (const x of [9, 38]) { g.set(x, 15, IRON[3]); g.set(x, 29, IRON[3]); }
  g.outline(OUT);
  return g.rows();
}

// --- Market cross ----------------------------------------------------------
function marketCross() {
  const g = new Grid(32, 54);
  const steps = [[1, 43, 30, 11], [5, 35, 22, 8], [9, 28, 14, 7]];
  steps.forEach(([x, y, w, h], i) => {
    // Tread (lit), riser (in shade), the green climbing highest on the bottom step.
    g.rect(x, y, w, h, ST[2]);
    g.rect(x, y, w, 3, ST[3]);
    g.rect(x, y, w, 1, ST[4]);
    g.rect(x, y + h - 1, w, 1, ST[1]);
    for (let jx = x + 5 + i * 2; jx < x + w - 2; jx += 7) g.rect(jx, y + 3, 1, h - 4, ST[1]);
    const stain = [6, 3, 1][i];
    g.rect(x, y + h - 1 - stain, w, stain, STAIN[1]);
    if (stain > 1) g.rect(x, y + h - 1 - stain, w, 1, STAIN[2]);
    for (let k = 0; k < 4 + (2 - i) * 3; k++) g.set(x + 1 + ((k * 7 + i * 3) % (w - 2)), y + h - 2 - (k % stain), WEED[k % 3]);
  });
  // The shaft and head.
  g.rect(14, 6, 4, 22, ST[3]);
  g.rect(14, 6, 1, 22, ST[5]);
  g.rect(17, 6, 1, 22, ST[1]);
  g.rect(13, 25, 6, 3, ST[2]); g.rect(13, 25, 6, 1, ST[4]);
  g.rect(9, 8, 14, 4, ST[3]);
  g.rect(9, 8, 14, 1, ST[5]);
  g.rect(9, 11, 14, 1, ST[1]);
  g.rect(14, 1, 4, 6, ST[3]);
  g.rect(14, 1, 1, 6, ST[5]);
  // A ring through the arms, and a crack.
  g.ring(16, 10, 5, 5, ST[2]);
  g.set(16, 10, ST[1]);
  g.line(15, 15, 16, 20, ST[1]);
  // Lichen and a gull's streak.
  g.set(20, 9, '#8a9a5c'); g.set(21, 9, '#8a9a5c'); g.set(15, 3, '#d8dccc'); g.line(15, 4, 15, 7, '#c8ccbc');
  g.outline(OUT);
  return g.rows();
}

// --- Well ------------------------------------------------------------------
function well() {
  const g = new Grid(32, 46);
  // The stone drum: front face, then the rim seen from above.
  for (let y = 31; y < 46; y++) g.rect(3, y, 26, 1, ST[2]);
  for (let r = 0; r < 3; r++) for (let bx = 3 + (r % 2 ? 4 : 0); bx < 29; bx += 8) {
    g.rect(bx, 32 + r * 4, Math.min(7, 29 - bx), 3, ST[3]);
    g.rect(bx, 32 + r * 4, Math.min(7, 29 - bx), 1, ST[4]);
  }
  g.rect(3, 42, 26, 4, STAIN[1]);
  g.rect(3, 42, 26, 1, STAIN[2]);
  g.oval(16, 30, 14, 4, ST[4]);
  g.oval(16, 30, 12, 3, ST[1]);
  // The water right up to the lip.
  g.oval(16, 30, 11, 2, '#2c6a5a');
  g.rect(9, 29, 6, 1, '#6ab4a0'); g.rect(18, 31, 4, 1, '#4a8e7c');
  // The posts and the little roof.
  for (const x of [4, 25]) {
    g.rect(x, 9, 3, 22, WOOD[2]);
    g.rect(x, 9, 1, 22, WOOD[3]);
    g.rect(x + 2, 9, 1, 22, WOOD[1]);
  }
  for (let r = 0; r < 9; r++) {
    const half = 3 + Math.round(r * 1.5);
    g.rect(16 - half, 1 + r, half * 2, 1, r % 3 === 2 ? SLATE[0] : SLATE[2]);
    g.set(16 - half, 1 + r, SLATE[3]);
  }
  g.rect(15, 0, 2, 2, SLATE[3]);
  g.rect(2, 10, 28, 1, WOOD[1]);
  // The winch: drum on the axle, rope wound, crank on the right.
  g.rect(7, 15, 18, 1, IRON[2]);
  g.rect(11, 13, 10, 5, WOOD[3]);
  g.rect(11, 13, 10, 1, WOOD[4]);
  for (let x = 12; x < 21; x += 2) g.rect(x, 14, 1, 3, '#a8946a');
  g.rect(28, 15, 2, 1, IRON[2]); g.rect(29, 15, 1, 5, IRON[2]); g.rect(29, 19, 2, 2, WOOD[2]);
  // The rope down to the bucket floating on the brim.
  g.line(16, 18, 16, 26, '#a8946a');
  g.rect(14, 26, 5, 3, WOOD[2]); g.rect(14, 26, 5, 1, IRON[3]);
  g.outline(OUT);
  return g.rows();
}

// --- Shop signs on bracketed posts ---------------------------------------------
function shopSign(kind) {
  const g = new Grid(16, 40);
  g.rect(1, 36, 6, 4, ST[2]); g.rect(1, 36, 6, 1, ST[4]);
  g.rect(3, 4, 3, 32, WOOD[2]);
  g.rect(3, 4, 1, 32, WOOD[3]);
  g.rect(5, 4, 1, 32, WOOD[1]);
  g.rect(2, 3, 5, 2, WOOD[3]);
  // The wrought bracket: arm, curl and brace.
  g.rect(4, 6, 12, 1, IRON[2]);
  g.set(15, 5, IRON[2]); g.set(14, 4, IRON[2]);
  g.line(6, 12, 11, 7, IRON[2]);
  g.ring(9, 9, 1, 1, IRON[2]);
  // Two rings down to the board.
  g.set(8, 7, IRON[3]); g.set(8, 8, IRON[2]); g.set(14, 7, IRON[3]); g.set(14, 8, IRON[2]);
  const board = kind === 'baker' ? ['#5a3a22', '#7a5434'] : ['#6a2622', '#8e3a30'];
  g.rect(7, 9, 9, 11, board[0]);
  g.rect(7, 9, 9, 1, board[1]);
  g.rect(8, 10, 7, 9, board[1]);
  if (kind === 'baker') {
    // A cottage loaf: two rounds, slashed, golden crust.
    g.oval(11, 16, 3, 2, '#b8803c');
    g.oval(11, 13, 2, 1, '#c8904a');
    g.rect(10, 15, 1, 1, '#e8c070'); g.rect(12, 16, 1, 1, '#e8c070');
    g.rect(9, 18, 5, 1, '#6a4422');
  } else {
    // A letter, sealed.
    g.rect(8, 12, 7, 5, '#d8d2b8');
    g.line(8, 12, 11, 15, '#9a947c'); g.line(14, 12, 11, 15, '#9a947c');
    g.set(11, 15, '#b03028');
  }
  g.set(9, 19, STAIN[2]); g.set(13, 19, STAIN[2]);
  g.outline(OUT);
  // Rain dripping off its bottom edge.
  g.set(10, 22, '#9ad0c0a0'); g.set(14, 24, '#9ad0c080');
  return g.rows();
}

// --- Laundry line ----------------------------------------------------------
function laundryLine() {
  const g = new Grid(48, 36);
  for (const x of [2, 43]) {
    g.rect(x, 4, 3, 32, WOOD[2]);
    g.rect(x, 4, 1, 32, WOOD[3]);
    g.rect(x + 2, 4, 1, 32, WOOD[1]);
    g.rect(x - 2, 3, 7, 2, WOOD[3]);
    g.rect(x - 2, 4, 7, 1, WOOD[1]);
  }
  const lineY = (x) => 5 + Math.round(Math.sin(((x - 4) / 39) * Math.PI) * 4);
  for (let x = 5; x < 43; x++) g.set(x, lineY(x), '#8a8470');
  // Each thing: x, width, length, colour, light colour.
  const items = [
    [7, 7, 11, '#5a6a7a', '#6e7e8c', 'shirt'],
    [16, 12, 17, CLOTH[1], CLOTH[2], 'sheet'],
    [30, 3, 6, '#7a3a34', '#8e4c44', 'sock'],
    [34, 3, 6, '#7a3a34', '#8e4c44', 'sock'],
    [38, 4, 9, '#9a8a4a', '#ae9e5c', 'smock'],
  ];
  for (const [x0, w, len, c, hi, kind] of items) {
    for (let i = 0; i < w; i++) {
      const top = lineY(x0 + i) + 1;
      let l = len - (kind === 'sheet' ? ((i * 3) % 4 === 0 ? 1 : 0) : 0);
      if (kind === 'shirt' && (i === 0 || i === w - 1)) l = 5;
      g.rect(x0 + i, top, 1, l, i % 3 === 0 ? hi : c);
      // Sodden: the bottom of it dark with water.
      g.rect(x0 + i, top + l - 2, 1, 2, '#28343a');
    }
    // Pegs at each corner.
    for (const px of [x0, x0 + w - 1]) { g.set(px, lineY(px) - 1, WOOD[3]); g.set(px, lineY(px), WOOD[1]); }
  }
  g.rect(9, 9, 3, 1, '#4a5a68'); // the shirt's collar
  g.outline(OUT);
  // The drips under every hem.
  for (const [x, y] of [[9, 22], [13, 24], [19, 29], [24, 31], [27, 28], [31, 19], [35, 21], [40, 22]]) {
    g.set(x, y, '#a8dccca0'); g.set(x, y + 2, '#a8dccc60');
  }
  return g.rows();
}

// --- Weathercock on a drowned roof ----------------------------------------------
function weathercock() {
  const g = new Grid(16, 42);
  // The roof's last few courses of slate, the ridge, then water.
  for (let r = 0; r < 8; r++) {
    const half = 1 + r;
    g.rect(8 - half, 30 + r, half * 2, 1, r % 2 ? SLATE[1] : SLATE[2]);
    g.set(8 - half, 30 + r, SLATE[3]);
  }
  g.rect(7, 29, 2, 2, ST[3]);
  // The pole, the arms, the letters' tips.
  g.rect(7, 10, 2, 20, IRON[2]);
  g.rect(7, 10, 1, 20, IRON[3]);
  g.rect(2, 20, 12, 1, IRON[2]);
  g.set(1, 20, IRON[3]); g.set(14, 20, IRON[3]);
  g.rect(6, 24, 4, 1, IRON[1]);
  // The arrow, then the cock itself in old gilt gone dark.
  g.rect(2, 11, 12, 1, IRON[2]);
  g.set(1, 11, IRON[2]); g.set(2, 10, IRON[2]); g.set(2, 12, IRON[2]);
  g.rect(13, 9, 2, 5, IRON[2]);
  const cock = [
    '.....##...',
    '....####..',
    '.##..###..',
    '###..###.#',
    '.#..######',
    '...#######',
    '..#######.',
    '...#####..',
    '....#.#...',
  ];
  cock.forEach((row, j) => [...row].forEach((b, i) => { if (b === '#') g.set(3 + i, 1 + j, j < 3 && i < 4 ? '#8a3a2a' : (i + j) % 4 === 0 ? GILT[1] : GILT[0]); }));
  g.set(10, 2, '#e8e0c0');
  g.outline(OUT);
  waterFoot(g, 0, 16, 37, 3);
  return g.rows();
}

// --- A rowboat keel-up on a ridge ------------------------------------------------
function roofBoat() {
  const g = new Grid(48, 26);
  // The ridge it's caught on: a few ridge tiles showing under its middle.
  for (let x = 14; x < 34; x += 5) {
    g.rect(x, 22, 5, 4, SLATE[2]);
    g.rect(x, 22, 5, 1, SLATE[3]);
    g.rect(x + 4, 22, 1, 4, SLATE[0]);
  }
  // Keel up: the keel straight along the top, the stem coming down to a point at the bow (left),
  // the square transom at the stern (right), the gunwale along the bottom dipping at both ends.
  const keel = (x) => (x < 11 ? 6 + Math.round(Math.pow((11 - x) / 9, 1.6) * 12) : 6);
  const gun = (x) => 20 + Math.round(Math.pow(Math.abs(x - 24) / 21, 2) * 2);
  for (let x = 2; x <= 44; x++) {
    const t = keel(x);
    const b = gun(x);
    for (let y = t; y <= b; y++) {
      const k = (b - y) % 3;
      g.set(x, y, k === 0 ? WOOD[3] : k === 1 ? WOOD[2] : WOOD[1]);
    }
    g.set(x, t, WOOD[4]);
  }
  // The keel and stem as one dark timber, the transom's edge.
  for (let x = 11; x <= 44; x++) g.set(x, 5, OAK[1]);
  for (let x = 2; x < 11; x++) g.set(x, keel(x) - 1, OAK[1]);
  g.rect(43, 5, 2, 18, OAK[1]); g.rect(42, 6, 1, 16, WOOD[4]);
  // A faded blue band under the gunwale, the gunwale rail, a stove-in plank.
  for (let x = 4; x <= 42; x++) { g.set(x, gun(x) - 2, '#3a5a6e'); g.set(x, gun(x) - 1, '#2c4656'); g.set(x, gun(x), WOOD[0]); }
  g.rect(27, 10, 5, 3, WOOD[0]);
  g.set(28, 11, '#0a0e0c'); g.set(26, 11, WOOD[4]);
  // Weed draped over it and a barnacle or two.
  for (const [x, l] of [[9, 5], [11, 3], [33, 6], [35, 4], [40, 3]]) g.rect(x, gun(x) - l, 1, l + 2, WEED[1]);
  g.rect(20, 5, 4, 1, WEED[2]); g.rect(21, 6, 1, 3, WEED[1]);
  for (const [x, y] of [[17, 16], [19, 17], [37, 15], [6, 17]]) g.set(x, y, '#c8ccc0');
  g.outline(OUT);
  return g.rows();
}

// --- Chimney stack with three pots ------------------------------------------------
function chimneyPots() {
  const g = new Grid(16, 42);
  g.rect(2, 15, 12, 24, ST[2]);
  for (let r = 0; r < 6; r++) for (let bx = 2 + (r % 2 ? 3 : 0); bx < 14; bx += 6) {
    g.rect(bx, 16 + r * 4, Math.min(5, 14 - bx), 3, ST[3]);
    g.set(bx, 16 + r * 4, ST[4]);
  }
  g.rect(13, 15, 1, 24, ST[1]);
  // Soot down the face, and the green at the bottom.
  g.line(5, 15, 5, 22, '#26282a'); g.line(10, 15, 10, 19, '#26282a');
  g.rect(2, 35, 12, 4, STAIN[1]);
  // The cap stones.
  g.rect(1, 12, 14, 3, ST[4]); g.rect(1, 12, 14, 1, ST[5]); g.rect(1, 14, 14, 1, ST[1]);
  // Three clay pots, tall middle one.
  for (const [x, h] of [[2, 6], [6, 9], [11, 5]]) {
    g.rect(x, 12 - h, 3, h, '#8a5a3a');
    g.rect(x, 12 - h, 1, h, '#a87a52');
    g.rect(x - 0, 12 - h - 1, 3, 1, '#a87a52');
    g.set(x + 1, 12 - h - 1, '#1a1210');
  }
  // Lead flashing at the foot.
  g.rect(1, 38, 14, 4, '#5a6266'); g.rect(1, 38, 14, 1, '#7a8488');
  g.outline(OUT);
  return g.rows();
}

// --- The laid table ----------------------------------------------------------------
function laidTable() {
  const g = new Grid(48, 38);
  // Chairs pulled back: two behind, one each end, set askew.
  const chairBack = (x, y) => { g.rect(x, y, 8, 2, WOOD[3]); g.rect(x, y + 2, 1, 7, WOOD[2]); g.rect(x + 7, y + 2, 1, 7, WOOD[2]); g.rect(x + 2, y + 2, 1, 5, WOOD[2]); g.rect(x + 5, y + 2, 1, 5, WOOD[2]); g.rect(x, y, 8, 1, WOOD[4]); };
  chairBack(10, 0);
  chairBack(29, 2);
  // End chairs, side-on, pushed out from the table.
  const sideChair = (x, flip) => {
    g.rect(x, 18, 6, 2, WOOD[3]);
    g.rect(flip ? x + 5 : x, 8, 1, 12, WOOD[3]);
    g.rect(x, 20, 1, 8, WOOD[2]); g.rect(x + 5, 20, 1, 8, WOOD[2]);
    g.rect(flip ? x + 4 : x + 1, 9, 1, 1, WOOD[4]);
  };
  sideChair(0, false);
  sideChair(42, true);
  // Table legs and the cloth, hanging in folds.
  g.rect(9, 26, 2, 10, WOOD[1]); g.rect(37, 26, 2, 10, WOOD[1]);
  g.rect(7, 10, 34, 16, CLOTH[2]);
  g.rect(7, 10, 34, 1, CLOTH[3]);
  for (let x = 7; x < 41; x++) {
    g.set(x, 26 + ((x % 4) === 0 ? 1 : 0), CLOTH[1]);
    if (x % 4 === 1) g.rect(x, 22, 1, 4, CLOTH[1]);
  }
  g.rect(7, 21, 34, 1, CLOTH[1]);
  // Four places: plate, cup on its saucer, knife and fork.
  for (const [cx, cy] of [[13, 13], [35, 13], [13, 18], [35, 18]]) {
    g.oval(cx, cy, 3, 1, '#e8ecf0'); g.set(cx, cy, '#a8b8c8'); g.set(cx - 2, cy, '#5a78a0'); g.set(cx + 2, cy, '#5a78a0');
    g.rect(cx + (cx < 24 ? 5 : -6), cy - 1, 2, 2, '#5a78a0'); g.set(cx + (cx < 24 ? 5 : -6), cy - 1, '#e8ecf0');
    g.rect(cx - 4, cy - 1, 1, 3, '#98a0a4'); g.rect(cx + 4, cy - 1, 1, 3, '#98a0a4');
  }
  // The loaf on its board, the teapot, two candlesticks with their candles never lit.
  g.rect(20, 15, 8, 3, WOOD[3]);
  g.oval(24, 15, 3, 1, '#b8803c'); g.set(23, 14, '#e0b068'); g.rect(22, 15, 1, 1, '#7a4c24'); g.rect(25, 15, 1, 1, '#7a4c24');
  g.oval(25, 11, 2, 2, '#4a6a8a'); g.set(24, 10, '#7a9ab8'); g.rect(28, 11, 2, 1, '#4a6a8a'); g.set(22, 11, '#4a6a8a'); g.set(25, 8, '#7a9ab8');
  for (const x of [18, 30]) {
    g.rect(x, 11, 1, 1, GILT[1]); g.rect(x - 1, 12, 3, 1, GILT[0]);
    g.rect(x, 6, 1, 5, '#e4e0cc'); g.set(x, 5, '#202020');
  }
  g.outline(OUT);
  return g.rows();
}

// --- A grandfather clock, stopped --------------------------------------------------
function stoppedClock() {
  const g = new Grid(16, 48);
  g.rect(2, 41, 12, 7, OAK[2]); g.rect(2, 41, 12, 1, OAK[3]); g.rect(1, 46, 14, 2, OAK[1]);
  g.rect(4, 15, 8, 26, OAK[2]); g.rect(4, 15, 1, 26, OAK[3]); g.rect(11, 15, 1, 26, OAK[1]);
  // The trunk door with its little window on the pendulum, hanging dead still.
  g.rect(5, 18, 6, 18, OAK[1]); g.rect(6, 22, 4, 9, '#141a18'); g.set(8, 22, GILT[0]); g.rect(8, 23, 1, 5, GILT[0]); g.oval(8, 29, 1, 1, GILT[1]);
  g.set(10, 27, GILT[1]);
  // The hood: a broken pediment, the dial, its hands stopped at a quarter to four.
  g.rect(2, 3, 12, 12, OAK[2]); g.rect(2, 3, 12, 1, OAK[3]);
  g.rect(1, 1, 5, 2, OAK[3]); g.rect(10, 1, 5, 2, OAK[3]); g.rect(7, 0, 2, 2, GILT[1]);
  g.rect(3, 4, 10, 10, GILT[0]);
  g.oval(8, 9, 4, 4, '#e4e0cc');
  g.ring(8, 9, 4, 4, '#4a3e2e');
  for (const [dx, dy] of [[0, -3], [3, 0], [0, 3], [-3, 0]]) g.set(8 + dx, 9 + dy, '#8a8070');
  // Hands at a quarter to four: the long one to the nine, the short one near the four.
  g.line(8, 9, 5, 9, '#14100c'); g.set(10, 10, '#14100c'); g.set(9, 10, '#14100c');
  g.set(8, 9, '#14100c');
  g.rect(1, 14, 14, 1, OAK[1]);
  g.outline(OUT);
  return g.rows();
}

// --- A kitchen dresser --------------------------------------------------------------
function dresser() {
  const g = new Grid(32, 44);
  // The rack: back boards, three shelves with rails, plates leaning on them, cups on hooks.
  g.rect(2, 3, 28, 20, WOOD[1]);
  g.rect(1, 1, 30, 3, WOOD[3]); g.rect(1, 1, 30, 1, WOOD[4]);
  g.rect(2, 3, 2, 20, WOOD[2]); g.rect(28, 3, 2, 20, WOOD[2]);
  for (const y of [10, 16, 22]) { g.rect(2, y, 28, 1, WOOD[3]); g.rect(4, y - 2, 24, 1, WOOD[2]); }
  for (let i = 0; i < 4; i++) {
    for (const [y, c] of [[6, '#5a78a0'], [12, '#e6e6dc']]) {
      const cx = 7 + i * 6;
      g.oval(cx, y, 2, 2, '#e6e6dc');
      g.ring(cx, y, 2, 2, c);
      g.set(cx, y, c === '#e6e6dc' ? '#8aa0b8' : '#5a78a0');
    }
  }
  for (let i = 0; i < 5; i++) { const x = 5 + i * 5; g.set(x + 1, 17, IRON[3]); g.rect(x, 18, 3, 3, i % 2 ? '#5a78a0' : '#d8d8cc'); g.set(x + 3, 19, i % 2 ? '#5a78a0' : '#d8d8cc'); }
  // The counter, a jug left on it.
  g.rect(0, 23, 32, 3, WOOD[3]); g.rect(0, 23, 32, 1, WOOD[4]);
  g.rect(22, 19, 4, 4, '#c8b890'); g.set(21, 19, '#c8b890'); g.rect(22, 19, 1, 4, '#e4d8b8');
  // Cupboards below: two doors, two drawers, knobs.
  g.rect(1, 26, 30, 18, WOOD[2]);
  g.rect(2, 27, 13, 4, WOOD[3]); g.rect(17, 27, 13, 4, WOOD[3]);
  g.set(8, 29, GILT[1]); g.set(23, 29, GILT[1]);
  g.rect(2, 32, 13, 11, WOOD[1]); g.rect(17, 32, 13, 11, WOOD[1]);
  g.rect(3, 33, 11, 9, WOOD[2]); g.rect(18, 33, 11, 9, WOOD[2]);
  g.set(13, 37, GILT[1]); g.set(18, 37, GILT[1]);
  g.rect(1, 43, 30, 1, WOOD[0]);
  g.outline(OUT);
  return g.rows();
}

// --- Coat pegs ---------------------------------------------------------------------
function coatPegs() {
  const g = new Grid(32, 30);
  // The rail screwed to the wall, five turned pegs.
  g.rect(1, 2, 30, 4, WOOD[2]); g.rect(1, 2, 30, 1, WOOD[4]); g.rect(1, 5, 30, 1, WOOD[1]);
  g.set(2, 3, IRON[3]); g.set(29, 3, IRON[3]);
  const pegs = [5, 11, 17, 23, 28];
  for (const x of pegs) { g.rect(x, 3, 2, 3, WOOD[3]); g.set(x, 3, WOOD[4]); g.rect(x, 6, 2, 1, WOOD[1]); }
  // Four coats: a long dark one, an oilskin, a shawl-collared coat, a child's.
  const coat = (x, len, c, hi, lo) => {
    for (let r = 0; r < len; r++) {
      const half = 2 + Math.min(2, Math.floor(r / 3));
      g.rect(x + 1 - half, 7 + r, half * 2, 1, c);
      g.set(x + 1 - half, 7 + r, hi);
      g.set(x + half, 7 + r, lo);
    }
    g.rect(x, 7, 2, 2, lo);
    g.rect(x + 1, 10, 1, len - 4, lo);
  };
  coat(5, 20, '#2e3440', '#454c5a', '#1c2028');
  coat(11, 17, '#8a7a2a', '#a8983e', '#5a4e1a');
  coat(17, 19, '#5a3a30', '#74503e', '#3a2420');
  coat(23, 11, '#4a6a5a', '#5e826c', '#30483c');
  // The small hat.
  g.rect(27, 5, 4, 3, '#8a3a34'); g.rect(26, 8, 6, 1, '#6a2a26'); g.set(28, 5, '#a85048');
  g.outline(OUT);
  return g.rows();
}

// --- The drowned bell tower, from outside ----------------------------------------------
function bellTower() {
  const w = 64;
  const h = 128;
  const g = new Grid(w, h);
  const L = 7;
  const R = 56;
  // Dressed stone courses, the far right in shade.
  for (let y = 18; y < h; y++) {
    const course = Math.floor(y / 5);
    for (let x = L; x <= R; x++) {
      const joint = (x + (course % 2 ? 6 : 0)) % 12 === 0 || y % 5 === 0;
      let c = joint ? ST[1] : ST[(course + Math.floor(x / 12)) % 2 ? 3 : 2];
      if (x > R - 6 && !joint) c = ST[1];
      if (x < L + 3 && !joint) c = ST[4];
      g.set(x, y, c);
    }
  }
  // String courses.
  for (const y of [52, 88]) { g.rect(L - 1, y, R - L + 3, 3, ST[4]); g.rect(L - 1, y, R - L + 3, 1, ST[5]); g.rect(L - 1, y + 2, R - L + 3, 1, ST[1]); }
  // The parapet and corner pinnacles.
  g.rect(L - 2, 14, R - L + 5, 5, ST[3]); g.rect(L - 2, 14, R - L + 5, 1, ST[5]); g.rect(L - 2, 18, R - L + 5, 1, ST[1]);
  for (let x = L; x < R; x += 8) { g.rect(x, 10, 4, 4, ST[3]); g.rect(x, 10, 4, 1, ST[5]); }
  for (const x of [L - 3, R - 2]) {
    g.rect(x, 4, 6, 15, ST[3]); g.rect(x, 4, 1, 15, ST[5]); g.rect(x + 5, 4, 1, 15, ST[1]);
    for (let r = 0; r < 4; r++) g.rect(x + 1 + Math.floor(r / 2), r, 4 - Math.floor(r / 2) * 2, 1, ST[4]);
  }
  // Two louvred belfry openings: pointed arches, slats slanting down, dark behind.
  for (const ox of [15, 35]) {
    const ow = 14;
    for (let y = 22; y < 50; y++) {
      const fromTop = y - 22;
      const inset = fromTop < 7 ? Math.round(7 - Math.sqrt(49 - (7 - fromTop) * (7 - fromTop))) : 0;
      g.rect(ox + inset, y, ow - inset * 2, 1, '#0a100e');
      g.set(ox + inset - 1, y, ST[5]);
      g.set(ox + ow - inset, y, ST[1]);
    }
    for (let y = 29; y < 49; y += 3) { g.rect(ox, y, ow, 1, WOOD[2]); g.rect(ox, y + 1, ow, 1, WOOD[0]); }
    g.rect(ox - 1, 50, ow + 2, 2, ST[4]);
  }
  // The clock with no hands: a pale dial, the hours marked, a dark hole at the centre.
  g.oval(32, 70, 11, 11, ST[1]);
  g.oval(32, 70, 10, 10, '#c4c8b4');
  g.oval(32, 70, 8, 8, '#d4d8c4');
  for (let k = 0; k < 12; k++) {
    const a = (k / 12) * Math.PI * 2;
    g.set(32 + Math.cos(a) * 8.5, 70 + Math.sin(a) * 8.5, '#2a3030');
    if (k % 3 === 0) g.set(32 + Math.cos(a) * 7.5, 70 + Math.sin(a) * 7.5, '#2a3030');
  }
  g.rect(31, 69, 3, 3, '#141818');
  g.line(25, 76, 29, 79, '#9aa494');
  // A narrow window, and the long stain where the water stood.
  g.rect(30, 96, 4, 10, '#0a100e'); g.set(30, 96, ST[3]); g.set(33, 96, ST[3]); g.rect(29, 106, 6, 1, ST[4]);
  // Below the tide line the stone goes green: blotchy, darker toward the water.
  const blot = (x, y) => Math.sin(x * 0.7 + y * 0.3) + Math.sin(x * 0.23 - y * 0.61) + Math.sin((x + y) * 0.41);
  for (let y = 92; y < h; y++) for (let x = L; x <= R; x++) {
    const v = g.get(x, y);
    if (!v || v === ST[1]) continue;
    const n = blot(x, y) + (y - 92) / 12;
    if (n > 0.4) g.set(x, y, n > 2 ? STAIN[0] : n > 1.1 ? STAIN[1] : STAIN[2]);
  }
  g.rect(L, 91, R - L + 1, 1, STAIN[2]);
  // Streaks of verdigris from the belfry (the bells' green running down) round the clock.
  for (const x of [16, 19, 45, 48]) g.line(x, 52, x + (x % 2), 62 + (x % 9), VG[0]);
  for (let x = L; x <= R; x += 2) g.rect(x, 112 + (x % 3), 1, 6, WEED[(x >> 1) % 3]);
  // A crack.
  g.line(48, 20, 46, 28, ST[0]); g.line(46, 28, 49, 36, ST[0]);
  // The inner door at the foot of the back wall: a pointed arch of dressed stone, a dark oak
  // door with iron bands, and the sill. It stands over the porch's far side (the porch is
  // drawn in front of it, see porchFront).
  for (let y = 100; y < h; y++) {
    const inset = y < 108 ? Math.round(12 - Math.sqrt(Math.max(0, 144 - (108 - y) * (108 - y)))) : 0;
    g.rect(19 + inset, y, 26 - inset * 2, 1, ST[1]);
    g.set(19 + inset, y, ST[5]); g.set(44 - inset, y, ST[0]);
    g.rect(21 + inset, y, 22 - inset * 2, 1, y < 104 ? '#0a100e' : WOOD[1]);
    g.set(21 + inset, y, WOOD[0]); g.set(42 - inset, y, WOOD[0]);
  }
  for (let x = 23; x < 41; x += 4) g.rect(x, 104, 1, h - 104, WOOD[0]);
  g.rect(21, 112, 22, 2, IRON_BAND); g.rect(21, 122, 22, 2, IRON_BAND);
  g.rect(36, 117, 2, 2, '#b8a068');
  g.rect(17, h - 1, 30, 1, ST[4]);
  g.outline(OUT);
  return g.rows();
}

// The porch in front of the tower's foot: the tower's wider stone base seen from the lane
// (80 wide, 64 high, 5 tiles by 4 rows), with a coping on top. It is the tower's front wall
// over the porch floor, so from the lane you see a wall with its door. It is drawn only
// (walkable) and fades away while anyone is standing in the porch (src/overworld/porchCutaway.js).
function porchFront() {
  const w = 80;
  const h = 64;
  const g = new Grid(w, h);
  for (let y = 6; y < h; y++) {
    const course = Math.floor(y / 5);
    for (let x = 0; x < w; x++) {
      const joint = (x + (course % 2 ? 6 : 0)) % 12 === 0 || y % 5 === 0;
      let c = joint ? ST[1] : ST[(course + Math.floor(x / 12)) % 2 ? 3 : 2];
      if (x > w - 7 && !joint) c = ST[1];
      if (x < 3 && !joint) c = ST[4];
      g.set(x, y, c);
    }
  }
  // The coping: a lit lip, a dressed course below it and a shadow under that.
  g.rect(0, 2, w, 4, ST[3]); g.rect(0, 2, w, 1, ST[5]); g.rect(0, 5, w, 1, ST[1]);
  for (let x = 0; x < w; x += 10) g.set(x, 3, ST[1]);
  g.rect(0, 6, w, 1, ST[0]);
  // Below the tide line the stone goes green, darker toward the foot, and weed hangs from the sill.
  const blot = (x, y) => Math.sin(x * 0.7 + y * 0.3) + Math.sin(x * 0.23 - y * 0.61) + Math.sin((x + y) * 0.41);
  for (let y = 34; y < h; y++) for (let x = 0; x < w; x++) {
    const v = g.get(x, y);
    if (!v || v === ST[1]) continue;
    const n = blot(x, y) + (y - 34) / 12;
    if (n > 0.4) g.set(x, y, n > 2 ? STAIN[0] : n > 1.1 ? STAIN[1] : STAIN[2]);
  }
  for (let x = 1; x < w; x += 3) g.rect(x, 56 + (x % 4), 1, 5, WEED[(x >> 1) % 3]);
  // A long crack, and verdigris running down from the coping.
  g.line(30, 8, 28, 16, ST[0]); g.line(28, 16, 31, 24, ST[0]);
  for (const x of [12, 15, 58, 66]) g.line(x, 7, x + (x % 2), 15 + (x % 7), VG[0]);
  g.outline(OUT);
  return g.rows();
}

// --- The tower door --------------------------------------------------------------------
function towerDoor(open) {
  const g = new Grid(32, 46);
  // The arch: voussoirs round the top, jambs down the sides.
  for (let y = 0; y < 46; y++) for (let x = 0; x < 32; x++) {
    const dx = x - 15.5;
    const inArch = y < 16 ? dx * dx + (y - 16) * (y - 16) <= 16 * 16 : true;
    if (!inArch) continue;
    const course = Math.floor(y / 6);
    g.set(x, y, (x + course * 3) % 8 === 0 || y % 6 === 0 ? ST[1] : ST[(course + (x >> 3)) % 2 ? 3 : 2]);
  }
  const opening = (x, y) => {
    const dx = x - 15.5;
    return y >= 7 && (y >= 18 || dx * dx + (y - 18) * (y - 18) <= 11 * 11) && x >= 5 && x <= 26;
  };
  for (let y = 0; y < 46; y++) for (let x = 0; x < 32; x++) if (opening(x, y)) g.set(x, y, '#0a100e');
  // The arch's lit inner edge.
  for (let y = 7; y < 46; y++) for (let x = 0; x < 32; x++) if (opening(x, y) && !opening(x - 1, y)) g.set(x - 1, y, ST[5]);
  if (!open) {
    for (let y = 0; y < 46; y++) for (let x = 0; x < 32; x++) {
      if (!opening(x, y)) continue;
      g.set(x, y, (x - 5) % 4 === 0 ? OAK[0] : (x - 5) % 4 === 1 ? OAK[3] : OAK[2]);
    }
    // Studs in rows, strap hinges, the ring.
    for (let y = 12; y < 44; y += 5) for (let x = 7; x < 26; x += 4) g.set(x, y, IRON[4]);
    for (const y of [15, 36]) { g.rect(5, y, 18, 2, IRON[1]); g.rect(5, y, 18, 1, IRON[3]); }
    g.ring(20, 26, 2, 2, IRON[3]);
    // The bar: a beam across in iron hasps, and a padlock.
    g.rect(0, 23, 32, 4, WOOD[3]); g.rect(0, 23, 32, 1, WOOD[4]); g.rect(0, 26, 32, 1, WOOD[1]);
    for (const x of [3, 26]) { g.rect(x, 21, 3, 8, IRON[2]); g.rect(x, 21, 3, 1, IRON[3]); }
    g.rect(14, 26, 4, 4, IRON[2]); g.set(15, 27, IRON[0]); g.ring(15, 25, 1, 1, IRON[3]);
  } else {
    // Swung inwards: its edge against the left jamb, the dark beyond, the first steps up.
    for (let y = 9; y < 46; y++) { g.rect(5, y, 4, 1, OAK[2]); g.set(5, y, OAK[3]); g.set(8, y, OAK[0]); }
    for (let y = 12; y < 44; y += 5) g.set(7, y, IRON[4]);
    for (let k = 0; k < 3; k++) { g.rect(12 + k, 40 - k * 5, 12 - k, 1, '#26302c'); g.rect(12 + k, 41 - k * 5, 12 - k, 4, '#141c1a'); }
    // The bar, lifted off and leant against the wall.
    g.line(27, 45, 31, 20, WOOD[3]); g.line(28, 45, 31, 24, WOOD[2]);
    for (const x of [3, 26]) { g.rect(x, 21, 3, 8, IRON[2]); g.rect(x, 21, 3, 1, IRON[3]); g.rect(x + 1, 22, 1, 6, IRON[0]); }
  }
  // Green stain along the bottom.
  for (let x = 0; x < 32; x++) if (!opening(x, 42)) g.rect(x, 41, 1, 5, x % 3 ? STAIN[1] : STAIN[0]);
  g.outline(OUT);
  return g.rows();
}

// --- The flood grate ---------------------------------------------------------------------
function floodGrate() {
  const g = new Grid(16, 18);
  // The arch stones.
  for (let y = 0; y < 18; y++) for (let x = 0; x < 16; x++) {
    const dx = x - 7.5;
    if (y < 8 && dx * dx + (y - 8) * (y - 8) > 8.5 * 8.5) continue;
    g.set(x, y, (x + y) % 5 === 0 ? ST[1] : y % 4 === 0 ? ST[4] : ST[3]);
  }
  const hole = (x, y) => { const dx = x - 7.5; return y >= 3 && x >= 2 && x <= 13 && (y >= 8 || dx * dx + (y - 8) * (y - 8) <= 5.5 * 5.5); };
  for (let y = 0; y < 18; y++) for (let x = 0; x < 16; x++) if (hole(x, y)) g.set(x, y, '#060a08');
  // The bars: two outer ones whole, the middle two rusted through, stubs left top and bottom.
  for (const x of [3, 12]) g.rect(x, 3, 1, 15, IRON[3]);
  g.rect(3, 6, 10, 1, IRON[2]);
  for (const x of [6, 9]) {
    g.rect(x, 4, 1, 4, IRON[2]); g.set(x, 8, RUST[1]);
    g.set(x, 16, RUST[0]); g.set(x, 17, IRON[2]);
  }
  g.set(5, 6, RUST[1]); g.set(10, 6, RUST[1]);
  g.rect(4, 6, 2, 1, null); g.rect(10, 6, 2, 1, null);
  g.rect(4, 6, 1, 1, RUST[0]);
  g.rect(0, 13, 16, 5, STAIN[1]);
  g.outline(OUT);
  // Water lapping in and out of it.
  waterFoot(g, 0, 16, 13, 2);
  return g.rows();
}

// --- The great bell, fallen ---------------------------------------------------------------
function greatBell() {
  return greatBellGrid().rows();
}

function greatBellGrid() {
  const g = new Grid(48, 40);
  const cy = 21;
  // The body on its side: the domed crown to the left, the shoulder, a long waist, then the
  // flare out to the mouth on the right.
  const half = (x) => {
    const t = (x - 6) / 34;
    if (t < 0.14) return Math.round(10.5 * Math.sqrt(Math.max(0.02, t / 0.14)));
    return Math.round(10.5 + 0.8 * t + 5.5 * Math.pow(Math.max(0, t - 0.55) / 0.45, 2.2));
  };
  for (let x = 6; x <= 40; x++) {
    const hh = half(x);
    for (let y = cy - hh; y <= cy + hh; y++) {
      const v = (y - (cy - hh)) / (2 * hh);
      g.set(x, y, v < 0.18 ? BR[3] : v < 0.45 ? BR[2] : v < 0.82 ? BR[1] : BR[0]);
    }
    g.set(x, cy - hh, BR[4]);
    if (x > 10) g.set(x, cy - hh + 2, BR[4]);
  }
  // The crown's canons (the loops it hung by), and bands round the shoulder, waist and sound bow.
  g.rect(1, cy - 4, 5, 9, BR[1]); g.rect(1, cy - 4, 5, 1, BR[3]); g.rect(2, cy - 2, 3, 5, '#0a0e0c'); g.set(1, cy, BR[2]);
  for (const bx of [11, 26, 35, 38]) {
    const hh = half(bx);
    g.line(bx, cy - hh, bx, cy + hh, BR[4]);
    g.line(bx + 1, cy - hh + 1, bx + 1, cy + hh, BR[0]);
  }
  // An inscription band: little raised marks.
  for (let y = cy - 8; y <= cy + 8; y += 2) { g.set(19, y, BR[4]); g.set(21, y + 1, BR[4]); }
  // The mouth, end-on: the thick lip, and the dark inside, big enough to sleep in.
  g.oval(42, cy, 5, 16, BR[3]);
  g.oval(42, cy, 4, 15, BR[1]);
  g.oval(43, cy, 3, 13, '#060a08');
  g.oval(44, cy + 3, 1, 8, '#120c06');
  g.set(42, cy - 15, BR[5]); g.set(41, cy - 13, BR[4]); g.set(40, cy - 10, BR[4]);
  // The crack, from the lip back into the body, a chip out of the lip where it starts.
  g.line(43, cy - 12, 38, cy - 9, '#0a0606'); g.line(38, cy - 9, 34, cy - 10, '#0a0606'); g.line(34, cy - 10, 29, cy - 6, '#0a0606');
  g.line(38, cy - 8, 34, cy - 9, BR[4]);
  g.set(45, cy - 13, null); g.set(45, cy - 12, null); g.set(46, cy - 12, null); g.set(44, cy - 13, '#060a08');
  // Verdigris blooms on the bronze.
  for (const [x, y] of [[9, 18], [10, 19], [16, 12], [17, 13], [27, 28], [28, 29], [31, 9], [18, 27], [24, 25]]) g.set(x, y, (x + y) % 2 ? VG[0] : VG[1]);
  g.line(23, 13, 24, 22, VG[0]);
  g.outline(OUT);
  waterFoot(g, 0, 48, 33, 5);
  return g;
}

// --- Old Gulper at home in the great bell (the belfry, the scenes) -------------------------
// The very same bell as mw_great_bell, drawn by greatBellGrid() and set in a bigger frame (16 px
// spare each side, 24 above), so the frame stays centred on the bell's three tiles and stands
// on the same bottom edge: the bell never moves or changes size when he comes out of it, or
// when the fight ends. He comes out of its mouth (the right-hand end), mottled olive, with the
// pale eye and the crooked front tooth of his battle sprite.
//   mw_gulper_out (2)    out of the mouth in an S, head over the bell, jaw ajar (the scenes)
//   mw_gulper_doze (2)   spared: chin on the rim, eye shut, the tooth gone, breathing
//   mw_gulper_snore (2)  beaten: only the tip of his tail over the lip, a snore bubble
const GB_X = 16;
const GB_Y = 24;
const EEL = { k: '#16170c', G: '#3e4c18', h: '#5e6e22', g: '#7a8a2a', y: '#c8c050', Y: '#e8e090', E: '#f0f4d8', e: '#1e1a22', R: '#5a1c22', r: '#9a3a34', W: '#f4f0dc' };
const bezier = (a, b, c, d, t) => {
  const u = 1 - t;
  return [0, 1].map((i) => u * u * u * a[i] + 3 * u * u * t * b[i] + 3 * u * t * t * c[i] + t * t * t * d[i]);
};

// An eel body along a curve: dark belly side, olive back, mottles, a pale fin on the top edge.
function eelBody(g, a, b, c, d, w0, w1, n = 36) {
  const pts = Array.from({ length: n + 1 }, (_, i) => bezier(a, b, c, d, i / n));
  const r = (i) => (w0 + (w1 - w0) * (i / n)) / 2;
  for (let i = 0; i <= n; i++) g.oval(pts[i][0], pts[i][1], r(i), r(i), EEL.h);
  for (let i = 0; i <= n; i++) g.oval(pts[i][0] - 0.5, pts[i][1] - 0.7, Math.max(0.5, r(i) - 1), Math.max(0.5, r(i) - 1), EEL.g);
  for (let i = 2; i < n; i += 4) {
    const [x, y] = pts[i];
    const k = (i * 37) % 11;
    g.set(x + (k % 3) - 1, y + ((k >> 2) % 3) - 1, k % 2 ? EEL.G : EEL.y);
  }
  for (let i = 3; i < n - 1; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[i + 1];
    let nx = y1 - y0;
    let ny = -(x1 - x0);
    if (ny > 0) { nx = -nx; ny = -ny; }
    const len = Math.hypot(nx, ny) || 1;
    g.set(x0 + (nx / len) * (r(i) + 0.6), y0 + (ny / len) * (r(i) + 0.6), i % 3 ? EEL.y : EEL.Y);
  }
  return pts;
}

// His head, facing left (dir -1) or right (1), the snout end at (sx, sy): a long blunt skull,
// the gum line and needle teeth, the jaw hanging by `open`, the pale eye (lid 1 half down,
// 2 shut) and the gill.
function eelHead(g, sx, sy, dir, { open = 1, lid = 1, tooth = true, gill = 0 } = {}) {
  const X = (dx) => sx + dx * dir;
  // Skull and upper jaw.
  g.oval(X(9), sy, 8, 5, EEL.h);
  g.oval(X(9), sy - 0.5, 7, 4, EEL.g);
  g.line(X(1), sy + 1, X(9), sy - 4, EEL.g);
  g.rect(Math.min(X(0), X(6)), sy - 1, 7, 3, EEL.g);
  g.set(X(0), sy, EEL.G);
  g.set(X(1), sy - 1, EEL.G); // the nostril
  for (const [dx, dy, c] of [[5, -3, EEL.y], [11, -4, EEL.G], [14, -1, EEL.y], [8, 2, EEL.G]]) g.set(X(dx), sy + dy, c);
  // The mouth: dark gums, then the lower jaw.
  const jy = sy + 2;
  g.line(X(1), jy, X(12), jy, EEL.R);
  if (open > 0) g.rect(Math.min(X(2), X(11)), jy + 1, 10, open, '#2a0e12');
  g.line(X(1), jy + 1 + open, X(12), jy + 1, EEL.h);
  g.line(X(2), jy + 2 + open, X(12), jy + 2, EEL.G);
  g.line(X(1), jy, X(11), jy, EEL.r);
  // Needle teeth on the gum line (and the jaw's, when it's open).
  for (let dx = 3; dx <= 10; dx += 2) {
    g.set(X(dx), jy + 1, EEL.W);
    if (open > 1) g.set(X(dx + 1), jy + open, EEL.W);
  }
  // The crooked tooth, out of the front of the upper jaw, sideways and down.
  if (tooth) {
    g.set(X(1), jy + 1, EEL.W);
    g.set(X(0), jy + 2, EEL.W);
    g.set(X(-1), jy + 3, '#ffffff');
  } else {
    g.set(X(1), jy + 1, EEL.R);
  }
  // The eye: big and pale, one lid always half down.
  const ex = X(7);
  const ey = sy - 2;
  g.oval(ex, ey, 2, 2, EEL.h);
  g.oval(ex, ey, 1, 1, EEL.E);
  g.set(ex - 1, ey, EEL.E);
  g.set(ex + 1, ey, EEL.E);
  if (lid >= 2) {
    // Shut: a heavy lid, and the closed line curving down, content.
    g.oval(ex, ey, 2, 2, EEL.g);
    for (const [dx, dy] of [[-2, -1], [-1, 0], [0, 0], [1, 0], [2, -1]]) g.set(ex + dx, ey + dy, EEL.e);
  } else {
    g.set(X(6), ey, EEL.e);
    g.set(X(6), ey + 1, EEL.e);
    g.line(ex - 2, ey - 1, ex + 2, ey - 1, EEL.G);
    g.set(ex - 1, ey - 2, EEL.g);
  }
  // The gill, behind the head.
  g.oval(X(15), sy + 1, 1, 1 + gill, EEL.G);
  g.set(X(15), sy + 1, EEL.e);
}

function gulperBell(pose, frame) {
  const W = 48 + GB_X * 2;
  const H = 40 + GB_Y;
  const g = new Grid(W, H);
  const bell = greatBellGrid();
  for (let y = 0; y < bell.h; y++) for (let x = 0; x < bell.w; x++) if (bell.cells[y][x]) g.set(x + GB_X, y + GB_Y, bell.cells[y][x]);
  // The bell's mouth, in this frame: centre (58, 45), the dark inside about 3 x 13.
  const mx = 42 + GB_X;
  const my = 21 + GB_Y;
  const eel = new Grid(W, H);
  const s = frame ? 1 : 0;
  if (pose === 'out') {
    // Out of the mouth, round, up and back over the bell; head over its shoulder, facing you.
    eelBody(eel, [mx, my + 4], [mx + 16, my + 4], [mx + 14, 12 + s], [mx - 6 + s, 14 + s], 8, 6);
    eelHead(eel, mx - 26 + s, 13 + s, 1, { open: frame ? 2 : 1, lid: 1, tooth: true, gill: s });
  } else if (pose === 'doze') {
    // A short neck out over the lip, and his chin laid on the rim; eye shut, the tooth gone.
    eelBody(eel, [mx + 1, my - 5], [mx + 6, my - 9], [mx + 5, my - 16], [mx - 2, my - 16 + s * 0.5], 6, 6, 20);
    eelHead(eel, mx - 17, my - 17 + s, 1, { open: 0, lid: 2, tooth: false, gill: s });
  } else {
    // Only the tip of his tail, flopped out over the lower lip.
    eelBody(eel, [mx, my + 4], [mx + 5, my + 4], [mx + 8, my + 7 + s], [mx + 10, my + 11 - s], 4, 1, 14);
  }
  eel.outline(OUT);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (eel.cells[y][x]) g.set(x, y, eel.cells[y][x]);
  if (pose === 'snore' && frame) {
    // A snore bubble at the top of the mouth.
    g.oval(mx + 3, my - 9, 2, 2, BUB[0]);
    g.oval(mx + 3, my - 9, 1, 1, null);
    g.set(mx + 2, my - 10, BUB[1]);
  } else if (pose === 'snore') {
    g.set(mx + 2, my - 7, BUB[0]);
  }
  return g.rows();
}

// --- The eel's nest --------------------------------------------------------------------------
function gulperNest() {
  const w = 64;
  const h = 36;
  const g = new Grid(w, h);
  const cx = 32;
  const cy = 18;
  const inRing = (x, y) => { const d = Math.hypot((x - cx) / 30, (y - cy) / 16); return d < 1 && d > 0.42; };
  let seed = 7;
  const rand = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  // Net mesh laid round in a ring.
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (!inRing(x, y)) continue;
    if ((x + y) % 3 === 0 || (x - y + 99) % 3 === 0) g.set(x, y, (x * y) % 5 ? '#6a6a50' : '#4e5040');
  }
  // Rope loops.
  for (let k = 0; k < 6; k++) {
    const a = rand() * Math.PI * 2;
    const rx = 3 + Math.floor(rand() * 4);
    g.ring(cx + Math.cos(a) * 22, cy + Math.sin(a) * 11, rx, Math.max(1, rx - 2), '#a08a5e');
  }
  // Weed through it.
  for (let k = 0; k < 40; k++) {
    const a = rand() * Math.PI * 2;
    const r = 0.5 + rand() * 0.45;
    g.rect(cx + Math.cos(a) * 30 * r, cy + Math.sin(a) * 16 * r, 2, 1, WEED[k % 3]);
  }
  // Bones: a few long ones and a fish's spine.
  for (const [x0, y0, x1, y1] of [[8, 20, 15, 18], [46, 8, 52, 11], [50, 24, 56, 22], [18, 29, 24, 31]]) {
    g.line(x0, y0, x1, y1, '#d8d4c0'); g.set(x0, y0 - 1, '#d8d4c0'); g.set(x1, y1 + 1, '#d8d4c0');
  }
  g.line(10, 9, 19, 7, '#c8c4b0'); for (let x = 11; x < 19; x += 2) { g.set(x, 7, '#c8c4b0'); g.set(x, 10, '#c8c4b0'); }
  // Spoons, a ladle, a tin cup, a key, buttons and glints: everything shiny it could carry.
  for (const [x, y, flip] of [[40, 28, 1], [24, 5, -1], [54, 15, 1], [6, 14, -1]]) {
    g.line(x, y, x + 4 * flip, y - 1, '#a8b0b4'); g.oval(x + 6 * flip, y - 1, 1, 1, '#c8d0d4'); g.set(x + 6 * flip, y - 2, '#ffffff');
  }
  g.rect(44, 4, 3, 3, '#8a9294'); g.set(44, 4, '#c8d0d4');
  g.line(14, 26, 18, 26, GILT[1]); g.ring(13, 26, 1, 1, GILT[1]);
  for (const [x, y, c] of [[30, 3, '#e0d0a0'], [36, 32, '#b03a3a'], [28, 31, '#3a6aa8'], [52, 30, '#e8e8f0'], [12, 4, '#4ab088'], [58, 18, GILT[2]], [4, 22, '#ffffff']]) { g.set(x, y, c); g.set(x + 1, y, c); }
  // A green bottle and a doll's shoe.
  g.rect(48, 19, 5, 2, '#2e7a5a'); g.set(53, 19, '#2e7a5a'); g.set(48, 19, '#6ac0a0');
  g.rect(20, 11, 3, 2, '#7a2a2a'); g.set(22, 10, '#7a2a2a');
  // Seen through water: a faint wet sheen over it all.
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (g.get(x, y) && (x * 7 + y * 3) % 23 === 0) g.set(x, y, WATER.glint);
  return g.rows();
}

// --- A bell rope from its beam ---------------------------------------------------------------
function bellRope() {
  const g = new Grid(16, 50);
  // The beam, bolted into the wall with an iron knee at each end.
  g.rect(0, 1, 16, 5, OAK[2]); g.rect(0, 1, 16, 1, OAK[3]); g.rect(0, 5, 16, 1, OAK[0]);
  for (const x of [1, 13]) { g.rect(x, 6, 2, 6, IRON[2]); g.line(x + (x < 8 ? 2 : -1), 6, x + (x < 8 ? 4 : -3), 6, IRON[2]); g.set(x + 1, 3, IRON[4]); g.set(x, 9, IRON[4]); }
  // A hole worn in it where the rope runs up to the bell, the rope with its brass guide.
  g.rect(7, 2, 3, 3, '#0a0806');
  g.rect(7, 5, 3, 1, GILT[0]);
  g.rect(8, 6, 1, 38, '#b8a478');
  g.rect(9, 6, 1, 38, '#8a7852');
  // The sally: striped wool, red, white and blue.
  const stripes = ['#a83030', '#e8e0d0', '#2e4a8a'];
  for (let y = 20; y < 32; y++) g.rect(7, y, 4, 1, stripes[Math.floor((y - 20) / 2) % 3]);
  g.rect(7, 20, 1, 12, '#ffffff40');
  // The tail end, looped up and tucked, the last coil lying on the floor.
  g.line(9, 44, 11, 46, '#b8a478');
  g.ring(9, 47, 3, 1, '#a89468');
  g.set(9, 47, '#8a7852');
  g.outline(OUT);
  return g.rows();
}

// --- The sea gate --------------------------------------------------------------------------------
function seaGate(open) {
  const g = new Grid(64, 66);
  const archR = 26;
  const acx = 31.5;
  const springY = 30;
  // Stone surround.
  for (let y = 0; y < 66; y++) for (let x = 0; x < 64; x++) {
    const dx = x - acx;
    if (y < springY && dx * dx + (y - springY) * (y - springY) > (archR + 6) * (archR + 6)) continue;
    const course = Math.floor(y / 6);
    g.set(x, y, (x + course * 4) % 10 === 0 || y % 6 === 0 ? ST[1] : ST[(course + (x >> 3)) % 2 ? 3 : 2]);
  }
  const hole = (x, y) => { const dx = x - acx; return x >= 6 && x <= 57 && (y >= springY || dx * dx + (y - springY) * (y - springY) <= archR * archR); };
  for (let y = 0; y < 66; y++) for (let x = 0; x < 64; x++) if (hole(x, y)) g.set(x, y, '#050908');
  // The keystone and the lit inner edge.
  g.rect(28, 0, 8, 6, ST[4]); g.rect(28, 0, 8, 1, ST[5]);
  for (let y = 0; y < 66; y++) for (let x = 1; x < 64; x++) if (hole(x, y) && !hole(x - 1, y)) g.set(x - 1, y, ST[5]);
  // Tunnel water within.
  for (let y = 54; y < 66; y++) for (let x = 6; x <= 57; x++) g.set(x, y, y === 54 ? '#2a5a50' : (x + y) % 9 === 0 ? '#1e4840' : '#0e2a26');
  const ironC = IRON[2];
  const ironHi = IRON[3];
  if (!open) {
    // The great fish: upper and lower jaws curving to the hinge corners, an eye each side.
    const upper = (x) => springY - 14 + Math.round(Math.pow((x - acx) / 26, 2) * 22);
    const lower = (x) => 58 - Math.round(Math.pow((x - acx) / 26, 2) * 14);
    // Hammered scales: little arcs in rows, each row offset.
    const scale = (x, y) => {
      const band = Math.floor(y / 4);
      const sx = (x + (band % 2 ? 2 : 0)) % 4;
      const sy = y % 4;
      return (sy === 0 && (sx === 1 || sx === 2)) || (sy === 1 && (sx === 0 || sx === 3)) ? ironHi : sy === 3 && sx === 1 ? IRON[1] : ironC;
    };
    for (let x = 6; x <= 57; x++) {
      for (let y = 0; y < 66; y++) if (hole(x, y) && y < upper(x)) g.set(x, y, scale(x, y));
      for (let y = lower(x); y < 64; y++) g.set(x, y, scale(x, y));
      g.set(x, upper(x), IRON[4]); g.set(x, lower(x), IRON[4]);
    }
    // Bars down the throat, so the mouth is still a grille.
    for (let x = 10; x < 56; x += 5) for (let y = upper(x) + 1; y < lower(x); y++) g.set(x, y, IRON[1]);
    // Teeth: down from the top jaw, up from the bottom; the one at the middle top is gone.
    const missing = 30;
    for (let x = 10; x < 55; x += 5) {
      const t = upper(x + 2);
      if (x === missing) {
        // The empty socket: a tooth-shaped hole cut in the jaw, its rim bright where the iron
        // broke, rust bleeding from it. Something the shape of a tooth would fit back in.
        g.rect(x - 2, t - 4, 9, 5, IRON[1]);
        for (let k = 0; k < 5; k++) g.rect(x + Math.floor(k / 2), t - 3 + k, Math.max(1, 5 - Math.floor(k / 2) * 2), 1, '#000000');
        g.rect(x - 2, t - 4, 9, 1, IRON[4]);
        g.rect(x - 2, t - 3, 1, 3, IRON[4]); g.rect(x + 6, t - 3, 1, 3, IRON[4]);
        g.set(x, t + 2, RUST[1]); g.set(x + 4, t + 2, RUST[1]); g.line(x + 1, t + 2, x + 1, t + 6, RUST[0]);
        continue;
      }
      for (let k = 0; k < 6; k++) g.rect(x + Math.floor(k / 2), t + 1 + k, Math.max(1, 5 - Math.floor(k / 2) * 2), 1, k < 2 ? '#c8ccc4' : '#a8aca4');
      const b = lower(x + 2);
      for (let k = 0; k < 5; k++) g.rect(x + Math.floor(k / 2), b - 1 - k, Math.max(1, 5 - Math.floor(k / 2) * 2), 1, '#a8aca4');
    }
    // The eyes, up in the jaw's corners: iron rings round a dead black pupil.
    for (const ex of [17, 46]) { g.oval(ex, springY - 12, 4, 3, IRON[4]); g.oval(ex, springY - 12, 3, 2, '#c8ccb8'); g.oval(ex, springY - 12, 1, 2, '#050605'); g.set(ex - 2, springY - 13, '#ffffff'); }
    // Scales hammered into the upper jaw, rust weeping.
    for (let x = 20; x < 44; x += 4) g.ring(x, 14 + (x % 3), 1, 1, IRON[1]);
    for (const x of [12, 26, 40, 52]) g.line(x, 40, x, 46, RUST[0]);
    // The hinge straps on the piers.
    for (const y of [20, 46]) { g.rect(2, y, 6, 2, IRON[2]); g.rect(56, y, 6, 2, IRON[2]); }
  } else {
    // Swung back flat against the piers: each half a narrow slab of iron with its teeth showing edge-on.
    for (const [x0, dir] of [[6, 1], [52, -1]]) {
      for (let y = 6; y < 62; y++) g.rect(x0, y, 6, 1, y % 4 === 0 ? ironHi : ironC);
      for (let y = 18; y < 58; y += 5) for (let k = 0; k < 3; k++) g.set(dir > 0 ? x0 + 6 + k : x0 - 1 - k, y + k, '#a8aca4');
      g.oval(dir > 0 ? x0 + 3 : x0 + 2, 22, 1, 1, IRON[4]);
    }
    // The dark tunnel going on beyond, the water running in.
    for (let y = 30; y < 54; y++) for (let x = 20; x < 44; x++) if ((x + y) % 11 === 0) g.set(x, y, '#0c1412');
    for (let y = 56; y < 66; y += 3) g.rect(20 + (y % 5), y, 8, 1, '#3a7a6a');
  }
  // Weed on the piers at the water.
  for (let x = 0; x < 64; x += 2) if (!hole(x, 56)) g.rect(x, 52 + (x % 3), 1, 8, WEED[(x >> 1) % 3]);
  g.outline(OUT);
  return g.rows();
}

// --- The peal board -------------------------------------------------------------------------
function pealBoard() {
  const g = new Grid(32, 30);
  // The two pegs in the wall, cords down to the board's rings.
  for (const x of [7, 24]) { g.rect(x, 0, 2, 2, WOOD[3]); g.set(x, 0, WOOD[4]); g.line(x, 2, x - 2, 5, '#a8946a'); g.line(x + 1, 2, x + 3, 5, '#a8946a'); }
  g.rect(1, 5, 30, 24, '#1a2430');
  g.rect(1, 5, 30, 1, '#2e3c4c');
  g.rect(2, 6, 28, 1, GILT[0]); g.rect(2, 27, 28, 1, GILT[0]); g.rect(2, 6, 1, 22, GILT[0]); g.rect(29, 6, 1, 22, GILT[0]);
  g.text(7, 8, 'PEALS', GILT[2]);
  g.text(27 - 0, 8, '', GILT[2]);
  // The peals: a date column and the changes, in gilt; the last line only half lettered.
  for (const [y, n] of [[15, '5040'], [19, '1260'], [23, '5040']]) {
    g.rect(4, y + 2, 7, 1, GILT[1]);
    g.text(13, y, n, GILT[2]);
  }
  g.rect(4, 26, 4, 1, GILT[0]);
  g.rect(0, 28, 32, 1, WOOD[1]);
  g.outline(OUT);
  return g.rows();
}

// --- Coiled bell ropes on the floor ------------------------------------------------------------
function ropesCoiled() {
  const g = new Grid(16, 12);
  g.oval(8, 7, 7, 4, '#8a7852');
  g.oval(8, 7, 6, 3, '#b8a478');
  g.oval(8, 7, 4, 2, '#8a7852');
  g.oval(8, 7, 3, 1, '#b8a478');
  g.set(8, 7, '#5a4a32');
  // A sally showing in the coil, and the loose end.
  g.rect(3, 4, 3, 2, '#a83030'); g.rect(6, 4, 2, 2, '#e8e0d0'); g.rect(8, 4, 2, 2, '#2e4a8a');
  g.line(13, 9, 15, 11, '#b8a478');
  g.outline(OUT);
  return g.rows();
}

// --- Bubbles ---------------------------------------------------------------------------------------
const BUB = ['#b8e4d4', '#eefff8', '#7cbca8'];
function bubbles(i) {
  const g = new Grid(16, 22);
  for (let b = 0; b < 4; b++) {
    const phase = (i + b * 2) % 8;
    const x = 4 + b * 3 + Math.round(Math.sin(phase + b) * 1);
    const y = 20 - phase * 2.6;
    if (phase === 7) {
      // Popped: a little ring of spray where it broke the surface.
      g.set(x - 1, y, BUB[2]); g.set(x + 1, y, BUB[2]); g.set(x, y - 1, BUB[1]);
      continue;
    }
    const r = b % 2 === 0 && phase > 2 ? 2 : 1;
    if (r === 2) { g.set(x, y - 1, BUB[0]); g.set(x - 1, y, BUB[0]); g.set(x + 1, y, BUB[2]); g.set(x, y + 1, BUB[2]); g.set(x - 1, y - 1, BUB[1]); }
    else g.set(x, y, BUB[1]);
  }
  return g.rows();
}

// --- House fronts (2026-11-08, redrawn 2026-11-15 at the people's size) -------------------------------
// The terraces are two-storey houses now. A front door is 26 pixels tall (about 1.6 tiles, taller
// than the hero) with a step; ground-floor windows are 10 by 15, the upper floor's 10 by 13; a
// string course runs between the floors and the roof starts above. The pieces stand on the wall
// tiles (a solid row, never the street). The bottom of each is the street row; the tiles above
// it are wall too, so a piece 48 high is three tile rows of house, and a gable, parapet or stepped
// gable stands up past that into the roof.
//
// The steps and the rooftops have only two tile rows above the street, so their pieces come in a
// LOW size (32 high, `_low`): the roof's eave, then the ground floor with its full-height door; the
// upper floor is above the top of the screen.
//
//   mw_house_gable (2)     a gable to the street: arched door, a drowned window, open shutters
//                          upstairs, a round vent in the gable
//   mw_house_dutch (2)     a stepped gable in bare dressed stone: a plank door hanging off its top
//                          hinge, a bracket sign (a key), a bricked-up window upstairs
//   mw_house_parapet (2)   flat-fronted behind a stone parapet: a door with a knocker, a window
//                          box, the upstairs shutters closed
//   mw_house_shop (2)      a shop: a painted fascia, a wide drowned shop window with ropes on its
//                          shelf, a glazed door
//   mw_house_narrow        a narrow one with its own little gable: a boarded-up door, one shutter
//                          hanging by a hinge
//   mw_house_gable_b / _c, mw_house_parapet_b, mw_house_narrow_b   the same in other washes
//   (and the same names ending _low for the steps and the rooftops)
//   mw_dormer              a dormer window sitting on the slates (put it on a roof tile)
//   mw_chimney_short       a short chimney stack, one pot, sooty (on a roof tile)
// Pieces laid over a plain wall tile, 16 wide and 48 high (they let its wash show through):
//   mw_ov_shutters_open / _shut / _hanging, mw_ov_window_drowned, mw_ov_window_bricked,
//   mw_ov_window_box       a ground-floor window with an upper-floor one over it
//   mw_ov_door_arched / _knocker / _boarded / _hanging / _open   a full-height door and its step,
//                          a window over it
//   mw_ov_sign_fish / _key / _boot   a sign hung under a wrought arm bolted to a wall plate
//   mw_ov_awning (2) / mw_ov_awning_torn (2)   a striped awning on iron stays
//   mw_ov_drainpipe        a downpipe from a hopper at the eaves, green streaks down the wash
//   mw_ov_wall_lamp        a storm lamp hung off a wall bracket, lit (give it a `glow`)

const hr = (x, y, s) => { const v = Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5453; return v - Math.floor(v); };
function mix(a, b, t) {
  const p = (h, i) => parseInt(h.slice(1 + i * 2, 3 + i * 2), 16);
  return '#' + [0, 1, 2].map((i) => Math.round(p(a, i) + (p(b, i) - p(a, i)) * t).toString(16).padStart(2, '0')).join('');
}
// The town's limewashes, each dark to light: wet through and gone grey-green, with three old colours
// faded nearly out of them.
const WASH = {
  white: ['#566058', '#737d73', '#838d82', '#939d91'],
  ochre: ['#5e5a42', '#80795c', '#908968', '#a09878'],
  pink: ['#5e5252', '#7d6e6c', '#8d7e7a', '#9d8e8a'],
  blue: ['#485860', '#677982', '#778992', '#879aa2'],
  stone: ['#2a3430', '#46524c', '#566258', '#68766c'],
};
const DR = { dress: '#6c766e', hi: '#8a948a', lo: '#3e4842', glass: '#0a1412', sky: '#2a4c42', sash: '#323a36', tide: '#4e6e54' };
const PAINT = { teal: ['#1e3229', '#2a4239', '#3c5a50'], ox: ['#321c1a', '#432a26', '#5a3a34'], navy: ['#1e2834', '#2a3446', '#3c485e'], olive: ['#2a281c', '#38362a', '#4e4a36'], blue: ['#2a3e48', '#3e5662', '#566e7a'], green: ['#243628', '#375038', '#4c6a50'], red: ['#42261e', '#623a2c', '#7e4e3c'] };
const SOOT = '#26282a';

// Limewash over an area: mottled, a few flakes off showing the stone, rain run down from the top.
function wash(g, x0, y0, w, h, tone, seed) {
  for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) {
    const n = hr(x, y, seed);
    g.set(x, y, n < 0.1 ? tone[2] : n > 0.93 ? tone[0] : n > 0.8 ? mix(tone[1], tone[0], 0.3) : tone[1]);
  }
  for (let i = 0; i < Math.max(1, Math.round(w * h / 200)); i++) {
    const fx = x0 + 1 + Math.floor(hr(i, seed, 3) * (w - 6)); const fy = y0 + 1 + Math.floor(hr(seed, i, 5) * (h - 5));
    g.rect(fx, fy, 4, 2, ST[2]); g.set(fx, fy, ST[3]); g.set(fx + 3, fy + 1, ST[1]);
  }
  for (let i = 0; i < Math.round(w / 4); i++) {
    const sx = x0 + Math.floor(hr(i, seed, 9) * w);
    g.rect(sx, y0, 1, 3 + Math.floor(hr(seed, i, 11) * 9), tone[0]);
  }
}
// Quoins up a corner: big and small stones in turn.
function quoins(g, x, y0, y1, right, seed) {
  for (let y = y0, q = seed; y < y1; y += 4, q++) {
    const wide = q % 2 ? 4 : 2;
    const xx = right ? x - wide + 1 : x;
    g.rect(xx, y, wide, 3, q % 2 ? '#5c6860' : '#748078');
    g.rect(xx, y + 3, wide, 1, '#3a4440');
  }
}
// The tide: the foot of the wall stained green-grey, darker toward the ground, a ragged line where
// it stood and a few runs below it (no hard-edged block).
function tideMark(g, x0, x1, y, seed) {
  for (let x = x0; x < x1; x++) {
    const top = y + Math.round((hr(x, seed, 6) - 0.5) * 4);
    for (let yy = top + 1; yy < g.h; yy++) {
      const c = g.get(x, yy);
      if (c && c.length === 7) g.set(x, yy, mix(c, '#2c4a38', 0.06 + (yy - top) * 0.012));
    }
    if (hr(x, seed, 8) < 0.45 && g.get(x, top)) g.set(x, top, mix(g.get(x, top), DR.tide, 0.5));
  }
  for (let i = 0; i < (x1 - x0) / 5; i++) {
    const x = x0 + Math.floor(hr(i, seed, 2) * (x1 - x0));
    if (g.get(x, y + 1)) g.rect(x, y + 1, 1, 1 + Math.floor(hr(seed, i, 4) * 4), mix(g.get(x, y + 1), DR.tide, 0.6));
  }
}
// A window with stone dressings: (x, y) is its top left, w by h with a two-row sill. The glass is
// dark and holds a little of the storm sky.
function winAt(g, x, y, w, h) {
  g.rect(x, y, w, h - 2, DR.dress); g.rect(x, y, w, 1, DR.hi); g.rect(x + w - 1, y, 1, h - 2, DR.lo);
  const gx = x + 1, gy = y + 1, gw = w - 2, gh = h - 4;
  g.rect(gx, gy, gw, gh, DR.glass);
  g.rect(gx, gy, 3, 1, DR.sky); g.rect(gx, gy + 1, 1, 3, DR.sky);
  g.rect(gx + (gw >> 1), gy, 1, gh, DR.sash); g.rect(gx, gy + Math.round(gh * 0.4), gw, 1, DR.sash);
  g.rect(x - 1, y + h - 2, w + 2, 2, DR.hi); g.rect(x - 1, y + h - 1, w + 2, 1, DR.lo);
}
// A pair of shutters by a window (x, y, w, h as for winAt). 'open', 'shut' or 'hanging'.
function shutters(g, x, y, w, h, how, paint) {
  const gh = h - 2;
  const leaf = (lx, ly, lw, lh) => {
    g.rect(lx, ly, lw, lh, paint[1]); g.rect(lx, ly, 1, lh, paint[2]); g.rect(lx + lw - 1, ly, 1, lh, paint[0]);
    for (let j = ly + 1; j < ly + lh - 1; j += 2) g.rect(lx + 1, j, lw - 2, 1, paint[0]);
  };
  if (how === 'shut') {
    const half = (w - 2) >> 1;
    leaf(x + 1, y + 1, half, gh - 2); leaf(x + 1 + half, y + 1, w - 2 - half, gh - 2);
    g.rect(x + 1, y + Math.round(gh / 2), w - 2, 1, IRON[1]); g.set(x + (w >> 1), y + Math.round(gh / 2), IRON[3]);
    return;
  }
  leaf(x - 3, y, 3, gh);
  g.set(x - 2, y + 2, IRON[3]); g.set(x - 2, y + gh - 3, IRON[3]);
  if (how === 'open') { leaf(x + w, y, 3, gh); g.set(x + w + 1, y + 2, IRON[3]); g.set(x + w + 1, y + gh - 3, IRON[3]); return; }
  // Hanging by its bottom hinge: the leaf dropped and swung out askew, its top hinge torn out.
  for (let i = 0; i < 3; i++) {
    const top = y + 3 + i * 2;
    g.rect(x + w + i, top, 1, gh - 5 - i, i === 0 ? paint[2] : i === 2 ? paint[0] : paint[1]);
    for (let j = top + 1; j < top + gh - 7 - i; j += 2) if (i === 1) g.set(x + w + i, j, paint[0]);
  }
  g.set(x + w, y + 1, IRON[2]); g.set(x + w, y + 2, RUST[1]);
  g.set(x + w, y + gh - 2, IRON[3]);
}
// The flood standing in a window: water to halfway up the glass, weed hanging over the sill.
function drowned(g, x, y, w, h) {
  const top = y + 1 + Math.round((h - 4) * 0.45);
  for (let j = top; j < y + h - 3; j++) for (let i = 1; i < w - 1; i++) g.set(x + i, j, j === top ? '#4e8c78' : j === top + 1 ? '#2a6252' : '#1a4237');
  g.set(x + 2, top, '#a0d8c4'); g.set(x + w - 3, top, '#a0d8c4');
  for (const [i, l] of [[0, 3], [2, 5], [3, 2], [w - 3, 4], [w - 1, 2]]) g.rect(x + i, y + h - 2, 1, l, i % 2 ? WEED[1] : WEED[2]);
  g.set(x + (w >> 1) - 1, y + h - 2, WEED[3]);
}
// A window bricked up: the opening filled with smaller stone, a different grey, rough mortar.
function bricked(g, x, y, w, h) {
  for (let j = 1; j < h - 3; j++) for (let i = 1; i < w - 1; i++) {
    const course = Math.floor((j - 1) / 2);
    const joint = (i + (course % 2 ? 2 : 0)) % 4 === 0;
    g.set(x + i, y + j, (j - 1) % 2 === 1 || joint ? '#363a34' : hr(i, j, 7) < 0.3 ? '#767264' : '#625f54');
  }
  g.rect(x + 1, y + 1, w - 2, 1, '#44443a');
}
// A window box under the sill, the flowers drowned and the weed got in among them.
function windowBox(g, x, y, w, h) {
  const by = y + h - 1;
  g.rect(x - 2, by, w + 4, 5, WOOD[2]); g.rect(x - 2, by, w + 4, 1, WOOD[3]); g.rect(x - 2, by + 4, w + 4, 1, WOOD[1]);
  g.set(x, by + 2, WOOD[0]); g.set(x + w - 1, by + 2, WOOD[0]);
  g.rect(x - 2, by + 1, 1, 3, WOOD[3]); g.rect(x + w + 1, by + 1, 1, 3, WOOD[1]);
  for (const [i, hh, c] of [[-1, 3, WEED[2]], [1, 2, '#6a5a3a'], [3, 4, WEED[1]], [4, 2, '#8a6a6a'], [6, 3, WEED[2]], [8, 2, '#7a6a3a'], [w, 3, WEED[1]]]) g.rect(x + i, by - hh, 1, hh, c);
  g.set(x + 4, by - 3, '#a47474'); g.set(x + 8, by - 2, '#b8a458'); g.set(x + 1, by - 3, '#946868');
  for (const [i, l] of [[-1, 4], [2, 2], [7, 5], [w, 3]]) g.rect(x + i, by + 5, 1, l, WEED[1]);
}

// Doors: the frame stands w wide from x, its foot on row `foot` (the step is under it). The leaf
// is `h` tall, 26 for a house front (taller than the hero), and the frame has a lintel over it.
function stepAt(g, x, w, foot) {
  g.rect(x, foot + 1, w, 1, DR.hi);
  g.rect(x - 1, foot + 2, w + 2, 1, DR.dress);
  g.rect(x - 1, foot + 3, w + 2, 1, DR.lo);
}
function doorAt(g, x, foot, kind, paint, h = 26, w = 16) {
  const top = foot - h - 1;
  const lx = x + 2, lw = w - 4, ly = top + 3, lh = foot - ly + 1;
  g.rect(x, top, w, foot - top + 1, DR.dress); g.rect(x, top, w, 1, DR.hi); g.rect(x + w - 1, top, 1, foot - top + 1, DR.lo);
  g.rect(x + (w >> 1) - 1, top, 2, 3, DR.hi);
  const leaf = (c) => g.rect(lx, ly, lw, lh, c);
  const damp = () => { for (let y = foot - 7; y <= foot; y++) for (let i = 0; i < lw; i++) { const c = g.get(lx + i, y); if (c && c.length === 7) g.set(lx + i, y, mix(c, '#2c4a38', 0.18 + (y - foot + 7) * 0.03)); } };
  if (kind === 'arched') {
    leaf(paint[1]);
    // The round head: the corners given back to the stone, a dark fanlight in it.
    for (let j = 0; j < 5; j++) { const cut = [3, 2, 1, 1, 0][j]; for (let i = 0; i < cut; i++) { g.set(lx + i, ly + j, DR.dress); g.set(lx + lw - 1 - i, ly + j, DR.dress); } }
    g.rect(lx + 2, ly + 1, lw - 4, 5, DR.glass); g.rect(lx + 2, ly + 1, 3, 1, DR.sky);
    g.rect(lx + (lw >> 1), ly + 1, 1, 5, DR.sash); g.rect(lx + 2, ly + 6, lw - 4, 1, DR.sash);
    for (let i = 0; i < lw; i += 4) g.rect(lx + i, ly + 7, 1, lh - 7, paint[0]);
    for (let i = 1; i < lw; i += 4) g.rect(lx + i, ly + 7, 1, lh - 7, paint[2]);
    for (const by of [ly + 10, foot - 8]) { g.rect(lx, by, lw, 2, IRON[1]); g.rect(lx, by, lw, 1, IRON[2]); g.set(lx + 2, by, IRON[4]); g.set(lx + lw - 3, by, IRON[4]); }
    g.ring(lx + lw - 3, ly + 15, 1, 1, GILT[1]);
    damp();
  } else if (kind === 'knocker') {
    leaf(paint[1]);
    g.rect(lx + 1, ly + 1, lw - 2, 4, DR.glass); g.set(lx + 2, ly + 1, DR.sky); g.rect(lx + (lw >> 1), ly + 1, 1, 4, DR.sash);
    g.rect(lx, ly + 5, lw, 1, paint[0]);
    const mid = ly + 6 + Math.round((lh - 6) * 0.38);
    for (const [py, ph] of [[ly + 7, mid - ly - 8], [mid + 1, foot - 3 - mid]]) for (const px of [lx + 1, lx + 1 + (lw >> 1)]) {
      g.rect(px, py, (lw >> 1) - 2, ph, paint[0]); g.rect(px, py, (lw >> 1) - 2, 1, paint[2]); g.rect(px + 1, py + 1, (lw >> 1) - 4, ph - 2, paint[1]);
    }
    g.ring(lx + (lw >> 1), mid - 2, 1, 1, GILT[1]); g.set(lx + (lw >> 1), mid - 4, GILT[2]);
    g.rect(lx + lw - 4, mid + 2, 3, 1, GILT[0]);
    g.rect(lx, foot - 2, lw, 3, IRON[1]); g.rect(lx, foot - 2, lw, 1, IRON[2]);
    damp();
  } else if (kind === 'boarded') {
    leaf(paint[0]);
    for (let j = ly + 1; j < foot; j += 3) g.rect(lx, j, lw, 1, mix(paint[0], '#000000', 0.3));
    for (const [y0, y1] of [[3, 6], [10, 8], [17, 20]]) {
      g.line(lx - 1, ly + y0, lx + lw, ly + y1, WOOD[3]); g.line(lx - 1, ly + y0 + 1, lx + lw, ly + y1 + 1, WOOD[2]); g.line(lx - 1, ly + y0 + 2, lx + lw, ly + y1 + 2, WOOD[1]);
      g.set(lx, ly + y0 + 1, IRON[4]); g.set(lx + lw - 1, ly + y1 + 1, IRON[4]);
    }
    damp();
  } else if (kind === 'hanging') {
    leaf('#050908');
    g.rect(lx, foot - 6, lw, 7, '#0c2820'); g.rect(lx, foot - 6, lw, 1, '#367260');
    // The door off its bottom hinge, hanging from the top one: swung out and down to the right.
    for (let i = 0; i < lw - 3; i++) {
      const t = ly + 1 + Math.round(i * 0.7);
      g.rect(lx + 2 + i, t, 1, lh - 7 - Math.round(i * 0.3), i === 0 ? WOOD[3] : i % 2 ? WOOD[2] : WOOD[1]);
    }
    g.line(lx + 2, ly + 5, lx + lw - 1, ly + 10, WOOD[0]); g.line(lx + 2, ly + 15, lx + lw - 1, ly + 20, WOOD[0]);
    g.set(lx + 2, ly + 1, IRON[3]); g.set(lx + 1, ly + 1, IRON[2]); g.set(lx + 1, ly + 2, IRON[2]);
    g.set(lx + 1, ly + 17, RUST[1]);
    g.rect(lx + 1, foot - 3, 2, 4, WEED[1]);
  } else if (kind === 'glazed') {
    leaf(paint[1]);
    g.rect(lx + 1, ly + 1, lw - 2, 11, DR.glass); g.set(lx + 2, ly + 1, DR.sky); g.rect(lx + (lw >> 1), ly + 1, 1, 11, DR.sash); g.rect(lx + 1, ly + 6, lw - 2, 1, DR.sash);
    g.rect(lx + 1, ly + 13, lw - 2, foot - ly - 14, paint[0]); g.rect(lx + 2, ly + 14, lw - 4, foot - ly - 16, paint[1]);
    g.set(lx + lw - 3, ly + 14, GILT[1]);
    damp();
  } else if (kind === 'open') {
    // Open on a dark hall: a warm light low on the floor, rising a little up the back wall.
    leaf('#08100d');
    for (let y = ly + 1; y <= foot; y++) {
      const t = (y - (foot - 12)) / 12;
      if (t <= 0) continue;
      const c = mix('#0a0e0c', '#a8743a', Math.min(1, t * 0.9));
      for (let i = 3; i < lw - 1; i++) g.set(lx + i, y, hr(i, y, 5) < 0.12 ? mix(c, '#000000', 0.25) : c);
    }
    g.rect(lx + 5, foot - 3, lw - 8, 4, '#d8a458'); g.rect(lx + 6, foot - 2, lw - 10, 2, '#f0c878');
    g.rect(lx + lw - 3, ly + 3, 2, foot - ly - 6, '#16120c');
    // The leaf, swung in against the left of the frame: wood in a narrow slant.
    for (let i = 0; i < 3; i++) g.rect(lx + i, ly + 1 + i, 1, lh - 2 - i * 2, i === 0 ? WOOD[4] : i === 1 ? WOOD[3] : WOOD[2]);
    g.set(lx + 1, ly + 13, IRON[3]); g.set(lx, ly + 3, IRON[3]); g.set(lx, foot - 4, IRON[3]);
  }
  stepAt(g, x, w, foot);
  if (kind === 'open') { g.rect(x + 3, foot + 1, w - 6, 1, '#b08044'); g.rect(x + 4, foot + 2, w - 8, 1, '#7e5a30'); }
}
// A sign hung under an iron arm: the plate (x, y) bolted to the wall, the arm out along row y,
// a chain from it at each end of the board.
function bracketSign(g, x, y, kind, bw = 12) {
  g.rect(x, y - 2, 2, 12, IRON[2]); g.set(x, y, IRON[4]); g.set(x, y + 6, IRON[4]);
  g.rect(x + 1, y, bw + 3, 1, IRON[2]); g.set(x + bw + 3, y - 1, IRON[2]); g.set(x + bw + 2, y - 2, IRON[2]);
  g.line(x + 1, y + 8, x + 7, y + 1, IRON[1]);
  g.set(x + 4, y + 4, IRON[2]);
  const bx = x + 3, by = y + 3, bh = 11;
  g.set(bx + 1, y + 1, IRON[3]); g.set(bx + 1, y + 2, IRON[3]); g.set(bx + bw - 2, y + 1, IRON[3]); g.set(bx + bw - 2, y + 2, IRON[3]);
  const board = kind === 'key' ? ['#2a364a', '#3e4a64'] : kind === 'boot' ? ['#432a26', '#5c3c34'] : ['#2a4239', '#3e5c50'];
  g.rect(bx, by, bw, bh, board[0]); g.rect(bx + 1, by + 1, bw - 2, bh - 2, board[1]); g.rect(bx, by, bw, 1, mix(board[1], '#ffffff', 0.2));
  if (kind === 'fish') {
    g.oval(bx + 6, by + 5, 3, 2, '#9ca8a4'); g.set(bx + 2, by + 3, '#9ca8a4'); g.set(bx + 2, by + 7, '#9ca8a4'); g.set(bx + 3, by + 4, '#9ca8a4'); g.set(bx + 3, by + 6, '#9ca8a4');
    g.set(bx + 8, by + 4, '#1a1a1a'); g.rect(bx + 4, by + 6, 4, 1, '#728078');
  } else if (kind === 'key') {
    g.ring(bx + 3, by + 5, 2, 2, GILT[1]); g.rect(bx + 5, by + 5, 6, 1, GILT[1]); g.set(bx + 8, by + 6, GILT[1]); g.set(bx + 9, by + 6, GILT[0]); g.set(bx + 10, by + 6, GILT[1]);
  } else {
    g.rect(bx + 3, by + 2, 4, 5, '#241810'); g.rect(bx + 3, by + 6, 7, 3, '#241810'); g.set(bx + 4, by + 2, '#54402e'); g.set(bx + 9, by + 7, '#54402e');
  }
  g.set(bx + 2, by + bh, STAIN[2]); g.set(bx + 8, by + bh, STAIN[2]); g.set(bx + 8, by + bh + 1, STAIN[1]);
}
// A downpipe from a hopper at the eaves (row `top`) to `foot`, at x (2 wide).
function downpipe(g, x, top, foot) {
  g.rect(x - 1, top, 4, 3, IRON[1]); g.rect(x - 1, top, 4, 1, IRON[3]); g.set(x - 1, top + 2, IRON[0]);
  g.rect(x, top + 3, 2, foot - top - 3, '#1e2422'); g.rect(x, top + 3, 1, foot - top - 3, '#3a4442');
  for (let y = top + 8; y < foot - 1; y += 8) { g.rect(x - 1, y, 4, 1, IRON[0]); g.set(x - 1, y, IRON[2]); }
  g.rect(x, foot - 1, 3, 1, '#1e2422'); g.set(x + 2, foot - 2, '#1e2422');
  for (let y = top + 4; y < foot - 1; y++) if (hr(x, y, 21) < 0.7) g.set(x + 2, y, mix(g.get(x + 2, y) ?? '#808878', '#3a5a40', 0.45));
  for (let y = top + 9; y < foot - 1; y++) if (hr(y, x, 23) < 0.5) g.set(x - 1, y, mix(g.get(x - 1, y) ?? '#808878', '#3a5a40', 0.35));
}
// A striped awning: canvas from x0 for w wide, its batten along row y, iron stays under it.
function awning(g, x0, w, y, torn) {
  const RED = ['#4e2620', '#6e342a', '#86443a'], CRM = ['#76705f', '#948c78', '#aaa28a'];
  g.rect(x0, y, w, 2, WOOD[1]); g.rect(x0, y, w, 1, WOOD[2]);
  for (let j = 2; j <= 9; j++) for (let i = 0; i < w; i++) {
    const xx = x0 + i;
    if (torn && i > w * 0.55 && j > 4 + ((i * 7) % 3)) continue;
    const red = Math.floor(i / 3) % 2 === 0;
    const c = red ? RED : CRM;
    g.set(xx, y + j, j === 2 ? c[2] : j > 7 ? c[0] : c[1]);
  }
  // The valance: scalloped.
  for (let i = 0; i < w; i++) {
    if (torn && i > w * 0.55) continue;
    const red = Math.floor(i / 3) % 2 === 0;
    g.set(x0 + i, y + 10, red ? RED[0] : CRM[0]);
    if (i % 3 !== 2) g.set(x0 + i, y + 11, red ? RED[0] : CRM[0]);
  }
  if (torn) {
    for (const [i, l] of [[Math.round(w * 0.62), 8], [Math.round(w * 0.74), 5], [Math.round(w * 0.86), 9]]) {
      g.rect(x0 + i, y + 5, 1, l, Math.floor(i / 3) % 2 === 0 ? RED[1] : CRM[1]);
      g.set(x0 + i + 1, y + 5 + l, Math.floor(i / 3) % 2 === 0 ? RED[0] : CRM[0]);
    }
  }
  // Iron stays: an arm from the wall under each end of the canvas, bolted.
  for (const bx of [x0 + 1, x0 + w - 2]) { g.rect(bx, y + 12, 1, 5, IRON[1]); g.set(bx, y + 17, IRON[3]); g.set(bx, y + 14, IRON[3]); }
  g.line(x0 + 1, y + 17, x0 + 4, y + 12, IRON[1]); g.line(x0 + w - 2, y + 17, x0 + w - 5, y + 12, IRON[1]);
}
// A storm lamp hung off a wall bracket (plate at x, y), lit.
function wallLamp(g, x, y) {
  g.rect(x, y, 2, 7, IRON[2]); g.set(x, y + 1, IRON[4]); g.set(x, y + 5, IRON[4]);
  g.line(x + 1, y + 1, x + 4, y - 4, IRON[2]); g.rect(x + 4, y - 4, 6, 1, IRON[2]); g.set(x + 10, y - 5, IRON[2]);
  g.line(x + 1, y + 5, x + 5, y - 3, IRON[1]);
  g.set(x + 8, y - 3, IRON[3]);
  g.rect(x + 6, y - 2, 5, 1, IRON[1]); g.rect(x + 7, y - 3, 3, 1, IRON[2]);
  g.rect(x + 6, y - 1, 5, 7, '#c8862c'); g.rect(x + 7, y, 3, 5, '#ffd27a'); g.set(x + 8, y + 1, '#fff4c8');
  g.rect(x + 6, y - 1, 1, 7, '#8a5a1c'); g.rect(x + 8, y - 1, 1, 1, IRON[1]);
  g.rect(x + 6, y + 6, 5, 1, IRON[1]); g.set(x + 8, y + 7, IRON[2]);
}
// A gable end: a triangle of wash over x0..x0+w, its peak at (cx, peak), its foot on row base,
// slate barge boards along the slopes.
function gableEnd(g, x0, w, peak, base, tone, seed) {
  const cx = x0 + (w - 1) / 2;
  const half = (y) => ((y - peak) / (base - peak)) * (w / 2);
  for (let y = peak; y < base; y++) {
    const hw = half(y);
    for (let x = x0; x < x0 + w; x++) if (Math.abs(x - cx) <= hw) g.set(x, y, hr(x, y, seed) < 0.1 ? tone[2] : tone[1]);
  }
  for (let y = peak - 1; y < base; y++) {
    const hw = half(y) + 1;
    const l = Math.round(cx - hw), r = Math.round(cx + hw);
    g.set(l, y, SLATE[3]); g.set(l + 1, y, SLATE[1]); g.set(r, y, SLATE[1]); g.set(r - 1, y, SLATE[0]);
  }
  g.rect(Math.round(cx), peak - 3, 1, 3, IRON[2]); g.set(Math.round(cx) - 1, peak - 2, IRON[2]); g.set(Math.round(cx) + 1, peak - 2, IRON[2]);
}
// The roof's eave over a low front (the steps, the rooftops): a slate lip, then a stone cornice.
function eave(g, w) {
  for (let y = 0; y < 3; y++) for (let x = 0; x < w; x++) g.set(x, y, hr(x, y, 91) < 0.2 ? SLATE[3] : y === 0 ? SLATE[2] : SLATE[1]);
  g.rect(0, 3, w, 2, ST[3]); g.rect(0, 3, w, 1, ST[4]); g.rect(0, 4, w, 1, ST[1]);
  for (let x = 2; x < w; x += 6) g.set(x, 3, ST[2]);
}

// A low front is 32 high: its eave, then the ground floor (no upper floor).
const LOW_H = 32;
const doorFoot = (low, E) => (low ? LOW_H - 4 : E + 44);
const doorH = (low) => (low ? 23 : 26);
// Top y of a 15-high ground-floor window.
const groundY = (low, E) => (low ? 9 : E + 20);

function houseGable(low, tone = WASH.ochre, shut = PAINT.blue, door = PAINT.teal) {
  const E = 14, H = low ? LOW_H : E + 48;
  const g = new Grid(32, H);
  if (low) {
    wash(g, 0, 5, 32, H - 5, tone, 31); eave(g, 32);
  } else {
    wash(g, 0, E, 32, H - E, tone, 31);
    gableEnd(g, 0, 32, 3, E + 1, tone, 32);
    g.oval(16, 10, 2, 2, DR.dress); g.oval(16, 10, 1, 1, DR.glass); g.set(16, 10, DR.sash);
    g.rect(0, E + 17, 32, 1, DR.hi); g.rect(0, E + 18, 32, 1, DR.lo);
    winAt(g, 6, E + 3, 10, 13); shutters(g, 6, E + 3, 10, 13, 'open', shut);
    winAt(g, 20, E + 3, 10, 13); shutters(g, 20, E + 3, 10, 13, 'shut', shut);
  }
  quoins(g, 0, low ? 5 : E, H, false, 0); quoins(g, 31, low ? 5 : E, H, true, 1);
  doorAt(g, 2, doorFoot(low, E), 'arched', door, doorH(low));
  winAt(g, 20, groundY(low, E), 10, 15); drowned(g, 20, groundY(low, E), 10, 15);
  tideMark(g, 0, 32, H - 12, 3);
  g.outline(OUT);
  return g.rows();
}

function houseDutch(low) {
  const E = 14, H = low ? LOW_H : E + 48;
  const g = new Grid(32, H);
  const tone = WASH.stone;
  const y0 = low ? 5 : E;
  // Ashlar courses, each block its own shade.
  for (let y = y0; y < H; y++) for (let x = 0; x < 32; x++) {
    const course = Math.floor((y - y0) / 4); const off = course % 2 ? 4 : 0;
    const joint = (y - y0) % 4 === 3 || (x + off) % 8 === 0;
    g.set(x, y, joint ? tone[0] : hr(Math.floor((x + off) / 8), course, 41) < 0.4 ? tone[2] : tone[1]);
  }
  if (low) {
    eave(g, 32);
  } else {
    // The stepped gable: three steps up each side, coping stones on every tread.
    const steps = [[0, 32, E], [3, 26, E - 4], [7, 18, E - 8], [11, 10, E - 12]];
    for (const [x, w, y] of steps) {
      for (let yy = y; yy < y + 4; yy++) for (let xx = x; xx < x + w; xx++) g.set(xx, yy, hr(xx, yy, 43) < 0.15 ? tone[2] : tone[1]);
      g.rect(x, y, w, 1, tone[3]); g.rect(x, y + 1, w, 1, tone[0]);
    }
    g.rect(14, 3, 4, 5, DR.glass); g.rect(14, 3, 4, 1, tone[3]); g.set(15, 4, DR.sky);
    g.rect(0, E + 17, 32, 1, tone[3]); g.rect(0, E + 18, 32, 1, tone[0]);
    winAt(g, 11, E + 3, 10, 13); bricked(g, 11, E + 3, 10, 13);
  }
  doorAt(g, 2, doorFoot(low, E), 'hanging', null, doorH(low));
  winAt(g, 21, groundY(low, E), 10, 15);
  if (!low) bracketSign(g, 18, E + 21, 'key');
  tideMark(g, 0, 32, H - 12, 5);
  g.rect(3, H - 5, 2, 3, WEED[1]); g.set(18, H - 4, WEED[2]);
  g.outline(OUT);
  return g.rows();
}

function houseParapet(low, tone = WASH.white, shut = PAINT.green, door = PAINT.ox) {
  const E = 5, H = low ? LOW_H : E + 48;
  const g = new Grid(32, H);
  if (low) {
    wash(g, 0, 5, 32, H - 5, tone, 51); eave(g, 32);
  } else {
    wash(g, 0, 3, 32, H - 3, tone, 51);
    // The parapet and its coping.
    g.rect(0, 0, 32, 4, ST[3]); g.rect(0, 0, 32, 1, ST[5]); g.rect(0, 3, 32, 1, ST[1]);
    for (let x = 3; x < 32; x += 7) g.set(x, 1, ST[2]);
    g.rect(0, E + 17, 32, 1, DR.hi); g.rect(0, E + 18, 32, 1, DR.lo);
    winAt(g, 4, E + 3, 10, 13); shutters(g, 4, E + 3, 10, 13, 'shut', shut);
    winAt(g, 20, E + 3, 10, 13); shutters(g, 20, E + 3, 10, 13, 'shut', shut);
  }
  quoins(g, 0, low ? 5 : 3, H, false, 1); quoins(g, 31, low ? 5 : 3, H, true, 0);
  doorAt(g, 2, doorFoot(low, E), 'knocker', door, doorH(low));
  winAt(g, 20, groundY(low, E), 10, 15); windowBox(g, 20, groundY(low, E), 10, 15);
  tideMark(g, 0, 32, H - 12, 7);
  g.outline(OUT);
  return g.rows();
}

function houseShop(low) {
  const E = 3, H = low ? LOW_H : E + 48;
  const g = new Grid(32, H);
  const tone = WASH.blue;
  if (low) {
    wash(g, 0, 5, 32, H - 5, tone, 61); eave(g, 32);
  } else {
    wash(g, 0, 2, 32, H - 2, tone, 61);
    g.rect(0, 0, 32, 3, ST[3]); g.rect(0, 0, 32, 1, ST[4]); g.rect(0, 2, 32, 1, ST[1]);
    winAt(g, 11, E + 3, 10, 13); shutters(g, 11, E + 3, 10, 13, 'hanging', PAINT.red);
  }
  // The fascia, painted, its letters gone pale.
  const fy = low ? 6 : E + 19;
  g.rect(0, fy, 19, 6, '#1a2c24'); g.rect(0, fy, 19, 1, '#38544a'); g.rect(0, fy + 5, 19, 1, '#0e1814');
  g.text(3, fy + 1, 'SAIL', '#a8a07e');
  // The shop window, wide, drowned to half way, a stall riser under it; the glazed door.
  const wy = fy + 7, wh = H - 4 - wy - 4;
  g.rect(1, wy, 18, wh + 2, DR.dress); g.rect(2, wy + 1, 16, wh, DR.glass); g.rect(2, wy + 1, 5, 1, DR.sky);
  for (const x of [7, 12]) g.rect(x, wy + 1, 1, wh, DR.sash);
  const wt = wy + 1 + Math.round(wh * 0.55);
  for (let x = 2; x < 18; x++) { g.set(x, wt, '#4e8c78'); g.rect(x, wt + 1, 1, wy + wh - wt, '#1a4237'); }
  g.set(5, wt, '#a0d8c4'); g.set(14, wt, '#a0d8c4');
  for (const [x, l] of [[3, 2], [8, 3], [11, 1], [16, 2]]) g.rect(x, wy + wh - l + 1, 1, l, WEED[1]);
  // Coils of rope still on the window's shelf above the water.
  g.ring(4, wy + 4, 1, 1, '#7a6c48'); g.ring(10, wy + 4, 1, 1, '#8a7a50'); g.ring(15, wy + 4, 1, 1, '#7a6c48');
  g.rect(1, wy + wh + 2, 18, H - 4 - wy - wh - 1, ST[2]); g.rect(1, wy + wh + 2, 18, 1, ST[3]);
  doorAt(g, 19, doorFoot(low, E), 'glazed', PAINT.navy, doorH(low), 13);
  quoins(g, 0, low ? 5 : 2, H, false, 0);
  tideMark(g, 0, 32, H - 12, 9);
  g.outline(OUT);
  return g.rows();
}

function houseNarrow(low, tone = WASH.pink, shut = PAINT.blue) {
  const E = 8, H = low ? LOW_H : E + 48;
  const g = new Grid(16, H);
  if (low) {
    wash(g, 0, 5, 16, H - 5, tone, 71); eave(g, 16);
  } else {
    wash(g, 0, E, 16, H - E, tone, 71);
    gableEnd(g, 0, 16, 3, E + 1, tone, 72);
    g.rect(7, 4, 2, 2, DR.glass);
    winAt(g, 3, E + 3, 10, 13); shutters(g, 3, E + 3, 10, 13, 'hanging', shut);
    g.rect(0, E + 17, 16, 1, DR.hi); g.rect(0, E + 18, 16, 1, DR.lo);
  }
  doorAt(g, 0, doorFoot(low, E), 'boarded', PAINT.olive, doorH(low));
  tideMark(g, 0, 16, H - 12, 11);
  g.outline(OUT);
  return g.rows();
}

function dormer() {
  const g = new Grid(16, 18);
  // Slate cheeks and a little gable roof on the slope, the window looking out.
  for (let y = 2; y < 8; y++) { const hw = Math.round((y - 2) * 1.2) + 1; g.rect(8 - hw, y, hw * 2, 1, y % 2 ? SLATE[2] : SLATE[1]); g.set(8 - hw, y, SLATE[3]); }
  g.rect(2, 8, 12, 9, WASH.white[1]); g.rect(2, 8, 1, 9, WASH.white[3]); g.rect(13, 8, 1, 9, WASH.white[0]);
  g.rect(4, 9, 8, 7, DR.dress); g.rect(5, 10, 6, 5, DR.glass); g.rect(5, 10, 2, 1, DR.sky); g.rect(8, 10, 1, 5, DR.sash);
  g.rect(1, 16, 14, 2, SLATE[0]); g.rect(1, 16, 14, 1, SLATE[3]);
  g.set(8, 1, IRON[2]); g.set(8, 0, IRON[3]);
  g.outline(OUT);
  return g.rows();
}

function chimneyShort() {
  const g = new Grid(16, 16);
  g.rect(4, 5, 8, 9, ST[2]);
  for (let r = 0; r < 2; r++) for (let bx = 4 + (r % 2 ? 2 : 0); bx < 12; bx += 4) { g.rect(bx, 6 + r * 4, Math.min(3, 12 - bx), 3, ST[3]); g.set(bx, 6 + r * 4, ST[4]); }
  g.rect(11, 5, 1, 9, ST[1]);
  g.line(6, 5, 6, 10, SOOT);
  g.rect(3, 3, 10, 2, ST[4]); g.rect(3, 3, 10, 1, ST[5]);
  g.rect(6, 0, 4, 3, '#8a5a3a'); g.rect(6, 0, 1, 3, '#a87a52'); g.rect(6, 0, 4, 1, '#a87a52'); g.set(7, 0, '#1a1210');
  g.rect(2, 13, 12, 3, '#4a5256'); g.rect(2, 13, 12, 1, '#687276');
  g.outline(OUT);
  return g.rows();
}

// Pieces laid on a front tile (16 wide, 48 high unless said), see-through round what they add.
function ov(fn, w = 16, h = 48) {
  const g = new Grid(w, h);
  fn(g);
  return g.rows();
}
// A window pair: an upper-floor window over a ground-floor one (both 10 wide at x 3, so shutters
// open out to the tile's edges), `fn` adding to the ground one and `how` hanging shutters on it.
const OV_WIN = (fn, how = null, paint = null) => ov((g) => {
  winAt(g, 3, 2, 10, 13);
  winAt(g, 3, 24, 10, 15);
  fn(g, 3, 24, 10, 15);
  if (how) shutters(g, 3, 24, 10, 15, how, paint);
  g.rect(0, 19, 16, 1, DR.hi); g.rect(0, 20, 16, 1, DR.lo);
});
// A front door and a window over it.
const OV_DOOR = (kind, paint) => ov((g) => {
  winAt(g, 3, 2, 10, 13);
  doorAt(g, 0, 44, kind, paint, 26, 16);
});
const NO = () => {};

// --- In the water (2026-11-08) ----------------------------------------------------------------------
//   mw_cart_sunk (2)       a handcart gone nose-down in the flood, a wheel and the shafts out of it
//   mw_crate_drift         a crate low in the water (animated: mw_crate_drift)
//   mw_barrel_bob          a barrel bobbing on its side (animated: mw_barrel_bob)
//   mw_lamp_leaning        a street lamp leaning in the water, still burning (give it a `glow`)
//   mw_stall_drowned (3)   a market stall up to its counter, its striped canopy torn, apples afloat
//   mw_weed_mat (2)        a raft of weed on the water (flat)
//   mw_ripples             rings spreading round something standing in the water (flat; animated)
//   mw_slates_afloat       slates and a gutter's length washed off a roof (flat)
//   mw_eave_weed (2)       a gutter hanging off a drowned roof's edge, weed trailing into the water
//   mw_floorboards (2)     floorboards fallen from the belfry, lying in the water (flat)
//   mw_silt (2)            silt and weed settled on the drowned floor (flat)
//   mw_candle_ledge        the ringers' candle lantern on its iron spike, lit (give it a `glow`)
//   mw_roof_patch (2)      slates gone off a roof, the battens showing (flat, for a roof top)
//   mw_roof_moss / _b      moss and lichen in a roof's joints, a gull's feather (flat)
const WTR = { line: '#7ec4ac', foam: '#c8eede', body: '#1d4a3e', glint: '#e6fff4' };
// Under the water: everything below row y goes green and see-through.
function submerge(g, y) {
  for (let yy = y; yy < g.h; yy++) for (let x = 0; x < g.w; x++) {
    const c = g.get(x, yy);
    if (c && c.length === 7) g.set(x, yy, mix(c, '#1d4a3e', 0.55 + Math.min(0.3, (yy - y) * 0.06)) + '90');
  }
}
function lap(g, x0, x1, y, seed) {
  for (let x = x0; x < x1; x++) {
    const yy = y + (hr(x, seed, 31) < 0.3 ? 1 : 0);
    g.set(x, yy, WTR.line + 'c8');
    g.set(x, yy + 1, (x + seed) % 5 === 0 ? WTR.foam + 'b0' : WTR.body + '80');
  }
}
function cartSunk() {
  const g = new Grid(32, 26);
  // The bed tipped nose-down, its back end up out of the water.
  for (let i = 0; i < 18; i++) { const t = 14 - Math.round(i * 0.35); g.rect(4 + i, t, 1, 7, i % 4 === 0 ? WOOD[1] : WOOD[2]); g.set(4 + i, t, WOOD[3]); }
  g.line(4, 20, 21, 14, WOOD[0]);
  // The shafts, sticking up behind.
  g.line(21, 9, 30, 2, WOOD[3]); g.line(21, 10, 30, 3, WOOD[1]);
  g.line(19, 12, 27, 4, WOOD[3]); g.line(19, 13, 27, 5, WOOD[1]);
  // The wheel, half out: rim, spokes, hub.
  g.ring(14, 18, 6, 6, WOOD[1]); g.ring(14, 18, 5, 5, WOOD[3]);
  for (let a = 0; a < 6; a++) g.line(14, 18, 14 + Math.round(Math.cos(a * 1.05) * 5), 18 + Math.round(Math.sin(a * 1.05) * 5), WOOD[2]);
  g.oval(14, 18, 1, 1, IRON[2]); g.set(14, 18, IRON[4]);
  g.rect(6, 12, 3, 2, '#7a4a3a'); g.set(7, 11, '#8a5a40');
  g.rect(9, 17, 1, 3, WEED[2]); g.rect(20, 14, 1, 4, WEED[1]);
  g.outline(OUT);
  submerge(g, 20);
  lap(g, 1, 31, 19, 2);
  for (let y = 21; y < 24; y++) for (let x = 3; x < 28; x++) if (hr(x, y, 33) < 0.15) g.set(x, y, '#2e6a58a0');
  return g.rows();
}
function crateDrift(i) {
  const g = new Grid(16, 16);
  const b = [0, 1, 1, 0][i % 4];
  g.rect(2, 3 + b, 12, 8, WOOD[2]); g.rect(2, 3 + b, 12, 1, WOOD[4]); g.rect(2, 3 + b, 1, 8, WOOD[3]); g.rect(13, 3 + b, 1, 8, WOOD[1]);
  g.rect(3, 6 + b, 10, 1, WOOD[1]); g.line(3, 10 + b, 12, 4 + b, WOOD[3]);
  g.set(3, 4 + b, IRON[3]); g.set(12, 4 + b, IRON[3]);
  g.rect(5, 4 + b, 3, 1, '#2a2418');
  g.outline(OUT);
  submerge(g, 11);
  lap(g, 0, 16, 10, i);
  g.set(1 + (i % 3), 13, WTR.foam + '90'); g.set(13 - (i % 2), 13, WTR.line + '90');
  return g.rows();
}
function barrelBob(i) {
  const g = new Grid(16, 16);
  const b = [0, 1, 1, 0][i % 4];
  g.oval(8, 7 + b, 6, 4, WOOD[2]);
  for (let x = 3; x < 14; x++) g.set(x, 4 + b, WOOD[4]);
  g.rect(4, 7 + b, 9, 1, WOOD[1]);
  for (const x of [4, 11]) g.rect(x, 3 + b, 1, 8, IRON[2]);
  g.oval(3, 7 + b, 1, 3, WOOD[3]); g.set(3, 7 + b, '#2a1c10');
  g.outline(OUT);
  submerge(g, 11);
  lap(g, 0, 16, 10, i + 3);
  return g.rows();
}
function lampLeaning() {
  const g = new Grid(16, 46);
  // The post leans to the right, foot in the water.
  for (let y = 10; y < 42; y++) { const x = Math.round(5 + (42 - y) * 0.16); g.rect(x, y, 2, 1, IRON[2]); g.set(x, y, IRON[3]); }
  g.rect(3, 38, 5, 3, IRON[1]); g.rect(3, 38, 5, 1, IRON[3]);
  // The lantern at the top, tipped with it.
  g.rect(9, 3, 6, 1, IRON[1]); g.rect(10, 2, 4, 1, IRON[2]); g.set(11, 1, IRON[2]);
  g.rect(9, 4, 6, 6, '#c8862c'); g.rect(10, 5, 4, 4, '#ffd27a'); g.set(11, 6, '#fff4c8');
  g.rect(9, 4, 1, 6, IRON[1]); g.rect(11, 4, 1, 1, IRON[1]); g.rect(9, 10, 6, 1, IRON[1]);
  g.line(8, 13, 10, 11, IRON[2]);
  g.rect(7, 30, 1, 5, WEED[1]); g.set(8, 34, WEED[2]);
  g.outline(OUT);
  submerge(g, 41);
  lap(g, 0, 16, 40, 4);
  for (let y = 42; y < 46; y++) for (let x = 1; x < 15; x++) if (hr(x, y, 35) < 0.12) g.set(x, y, '#ffc87a40');
  return g.rows();
}
function stallDrowned() {
  const g = new Grid(48, 40);
  // Four posts, the canopy over them, half its stripes torn away.
  for (const x of [3, 43]) { g.rect(x, 8, 2, 28, WOOD[2]); g.rect(x, 8, 1, 28, WOOD[3]); }
  for (const x of [8, 38]) { g.rect(x, 12, 2, 22, WOOD[1]); }
  const RED = ['#5a2a24', '#7e3a30', '#9a4a3c'], CRM = ['#8a8270', '#aea490', '#c4baa2'];
  for (let i = 0; i < 46; i++) {
    const torn = i > 27 && i < 39;
    const sag = Math.round(Math.sin((i / 45) * Math.PI) * 2);
    const len = torn ? (i % 3 === 0 ? 9 : 2) : 7;
    const red = Math.floor(i / 4) % 2 === 0;
    const c = red ? RED : CRM;
    for (let j = 0; j < len; j++) g.set(1 + i, 4 + sag + j, j === 0 ? c[2] : j > 4 ? c[0] : c[1]);
    if (!torn && i % 4 !== 3) g.set(1 + i, 4 + sag + len, red ? RED[0] : CRM[0]);
  }
  g.rect(1, 4, 46, 1, WOOD[1]);
  // The counter, just at the water.
  g.rect(2, 26, 44, 4, WOOD[2]); g.rect(2, 26, 44, 1, WOOD[4]); g.rect(2, 29, 44, 1, WOOD[0]);
  // A crate and a basket on it, a scale's pan.
  g.rect(8, 20, 8, 6, WOOD[3]); g.rect(8, 20, 8, 1, WOOD[4]); g.line(9, 25, 15, 21, WOOD[1]);
  g.oval(26, 23, 4, 2, '#8a6a3a'); g.rect(22, 21, 9, 1, '#a8885a'); g.set(24, 21, '#7a2a20'); g.set(27, 21, '#8a3a24'); g.set(29, 22, '#6a8a30');
  g.rect(36, 19, 1, 6, IRON[2]); g.rect(33, 19, 7, 1, IRON[2]); g.oval(36, 25, 3, 0, GILT[0]);
  g.outline(OUT);
  submerge(g, 31);
  lap(g, 0, 48, 30, 6);
  for (let y = 32; y < 40; y++) for (let x = 0; x < 48; x++) if (hr(x, y, 37) < 0.08) g.set(x, y, '#2e6a58a0');
  // Apples and a cabbage, afloat.
  for (const [x, y, c] of [[12, 33, '#8a2a20'], [17, 35, '#9a3a24'], [31, 34, '#7a2a20'], [40, 36, '#5a7a2a'], [22, 37, '#8a3a24']]) { g.rect(x, y, 2, 2, c); g.set(x, y, '#c86a50'); }
  return g.rows();
}
function weedMat() {
  const g = new Grid(32, 16);
  for (let i = 0; i < 70; i++) {
    const a = hr(i, 1, 41) * Math.PI * 2; const r = Math.sqrt(hr(i, 2, 41));
    const x = 16 + Math.cos(a) * r * 13; const y = 8 + Math.sin(a) * r * 5;
    const l = 1 + Math.floor(hr(i, 3, 41) * 4);
    g.line(x, y, x + l, y + (hr(i, 4, 41) < 0.5 ? 0 : 1), WEED[Math.floor(hr(i, 5, 41) * 3)]);
  }
  for (const [x, y] of [[9, 6], [20, 9], [14, 10], [24, 6]]) { g.set(x, y, '#8a6a2a'); g.set(x + 1, y, '#a8843a'); }
  g.set(17, 7, '#c8c0a0'); g.set(6, 9, '#b84a34');
  return g.rows();
}
function ripples(i) {
  const g = new Grid(16, 16);
  for (let k = 0; k < 2; k++) {
    const r = ((i + k * 2) % 4) * 1.6 + 2.5;
    const a = Math.round(200 - r * 22).toString(16).padStart(2, '0');
    g.ring(8, 9, r, r * 0.5, '#9ed8c4' + a);
  }
  return g.rows();
}
function slatesAfloat() {
  const g = new Grid(32, 16);
  for (const [x, y, w] of [[3, 5, 5], [10, 9, 4], [15, 4, 5], [21, 10, 4], [26, 6, 4]]) {
    g.rect(x, y, w, 3, SLATE[2]); g.rect(x, y, w, 1, SLATE[3]); g.set(x + w - 1, y + 2, SLATE[0]);
    g.rect(x - 1, y + 3, w + 2, 1, '#7ec4ac70');
  }
  g.line(6, 12, 18, 13, '#2e3436'); g.line(6, 11, 18, 12, '#4a5254');
  g.rect(20, 3, 1, 1, '#c8eede90');
  return g.rows();
}
function eaveWeed() {
  const g = new Grid(32, 14);
  // A length of gutter slipped off its brackets, one end still up, weed hanging off it into the water.
  g.line(1, 2, 30, 5, IRON[1]); g.line(1, 3, 30, 6, IRON[2]); g.line(1, 4, 30, 7, IRON[0]);
  for (const x of [4, 15, 26]) { g.set(x, 1 + Math.round(x / 10), IRON[3]); }
  for (let x = 2; x < 30; x += 2) { const top = 4 + Math.round((x / 29) * 3); const l = 2 + Math.floor(hr(x, 0, 51) * 6); g.rect(x, top, 1, l, WEED[Math.floor(hr(x, 1, 51) * 3)]); }
  g.outline(OUT);
  lap(g, 0, 32, 11, 7);
  return g.rows();
}
function floorboards() {
  const g = new Grid(32, 16);
  for (const [x0, y0, x1, y1] of [[2, 4, 24, 7], [6, 9, 29, 11], [12, 13, 22, 14]]) {
    g.line(x0, y0, x1, y1, WOOD[3]); g.line(x0, y0 + 1, x1, y1 + 1, WOOD[2]); g.line(x0, y0 + 2, x1, y1 + 2, WOOD[1]);
    g.set(x0 + 3, y0 + 1, IRON[3]); g.set(x1 - 3, y1 + 1, IRON[3]);
  }
  g.outline('#0c1210c0');
  for (const [x, y] of [[1, 8], [25, 13], [30, 9], [10, 15]]) g.set(x, y, '#7ec4ac90');
  return g.rows();
}
function silt(seed) {
  const g = new Grid(32, 16);
  for (let i = 0; i < 90; i++) {
    const a = hr(i, seed, 61) * Math.PI * 2; const r = Math.sqrt(hr(seed, i, 61));
    const x = 16 + Math.cos(a) * r * 14; const y = 8 + Math.sin(a) * r * 6;
    g.set(x, y, hr(i, 3, 61 + seed) < 0.6 ? '#3a4a3270' : '#4a5a3a80');
  }
  for (let i = 0; i < 14; i++) {
    const x = 4 + hr(i, 7, seed) * 24; const y = 3 + hr(7, i, seed) * 10;
    g.line(x, y, x + 2, y + (i % 2), WEED[1] + 'c0');
  }
  g.set(10, 9, '#c8c0a0'); g.set(21, 6, '#a8a090');
  return g.rows();
}
function candleLedge() {
  const g = new Grid(16, 22);
  g.rect(7, 12, 2, 9, IRON[2]); g.set(7, 12, IRON[3]); g.rect(5, 20, 6, 2, IRON[1]);
  g.rect(5, 4, 6, 1, IRON[1]); g.rect(6, 3, 4, 1, IRON[2]); g.set(7, 2, IRON[2]); g.set(8, 1, IRON[3]);
  g.rect(5, 5, 6, 6, '#c8862c'); g.rect(6, 6, 4, 4, '#ffd27a'); g.set(7, 7, '#fff4c8'); g.set(8, 8, '#fff4c8');
  g.rect(5, 5, 1, 6, IRON[1]); g.rect(10, 5, 1, 6, IRON[1]); g.rect(5, 11, 6, 1, IRON[1]);
  g.outline(OUT);
  return g.rows();
}

// Roof dressing (flat, walkable): slates gone and the battens showing; moss and lichen in the joints.
function roofPatch() {
  const g = new Grid(32, 16);
  g.rect(9, 4, 13, 7, '#0c1012'); g.rect(10, 4, 11, 1, '#060808');
  for (const y of [5, 8]) { g.rect(8, y, 15, 1, WOOD[2]); g.rect(8, y + 1, 15, 1, WOOD[0]); }
  for (const [x, y] of [[7, 4], [22, 6], [8, 9], [20, 10], [13, 3]]) { g.rect(x, y, 4, 2, SLATE[3]); g.set(x + 3, y + 1, SLATE[0]); }
  g.line(4, 12, 9, 11, SLATE[3]); g.line(4, 13, 9, 12, SLATE[1]);
  g.line(24, 12, 28, 13, SLATE[3]); g.line(24, 13, 28, 14, SLATE[1]);
  for (let i = 0; i < 18; i++) g.set(3 + hr(i, 1, 71) * 26, 2 + hr(1, i, 71) * 12, i % 3 ? WEED[2] : '#8a9a5a');
  return g.rows();
}
function roofMoss(seed) {
  const g = new Grid(16, 16);
  for (let i = 0; i < 26; i++) {
    const x = 2 + hr(i, seed, 73) * 12; const y = 2 + Math.floor(hr(seed, i, 73) * 6) * 2;
    g.rect(x, y, 1 + (i % 3 === 0 ? 1 : 0), 1, i % 4 === 0 ? '#9aa86a' : i % 2 ? WEED[2] : WEED[1]);
  }
  g.set(5 + seed % 5, 6, '#c8ccc0'); g.set(6 + seed % 5, 7, '#c8ccc0');
  return g.rows();
}

// --- Registry ---------------------------------------------------------------------------------------
export const MW_PROP_SPRITES = {
  mw_bell_low: bellPost('low', false),
  mw_bell_low_on: bellPost('low', true),
  mw_bell_mid: bellPost('mid', false),
  mw_bell_mid_on: bellPost('mid', true),
  mw_bell_high: bellPost('high', false),
  mw_bell_high_on: bellPost('high', true),
  mw_ringers_frame: ringersFrame(),
  mw_market_cross: marketCross(),
  mw_well: well(),
  mw_sign_baker: shopSign('baker'),
  mw_sign_post: shopSign('post'),
  mw_laundry_line: laundryLine(),
  mw_weathercock: weathercock(),
  mw_roof_boat: roofBoat(),
  mw_chimney_pots: chimneyPots(),
  mw_laid_table: laidTable(),
  mw_stopped_clock: stoppedClock(),
  mw_dresser: dresser(),
  mw_coat_pegs: coatPegs(),
  mw_bell_tower: bellTower(),
  mw_tower_porch: porchFront(),
  mw_tower_door: towerDoor(false),
  mw_tower_door_open: towerDoor(true),
  mw_flood_grate: floodGrate(),
  mw_great_bell: greatBell(),
  mw_gulper_nest: gulperNest(),
  mw_bell_rope: bellRope(),
  mw_sea_gate: seaGate(false),
  mw_sea_gate_open: seaGate(true),
  mw_peal_board: pealBoard(),
  mw_ropes_coiled: ropesCoiled(),
  mw_bubbles: bubbles(0),
  // House fronts (2026-11-08, redrawn 2026-11-15): 48 high over the street row, `_low` 32 high.
  mw_house_gable: houseGable(false),
  mw_house_gable_b: houseGable(false, WASH.blue, PAINT.red, PAINT.ox),
  mw_house_gable_c: houseGable(false, WASH.pink, PAINT.green, PAINT.navy),
  mw_house_dutch: houseDutch(false),
  mw_house_parapet: houseParapet(false),
  mw_house_parapet_b: houseParapet(false, WASH.ochre, PAINT.blue, PAINT.green),
  mw_house_shop: houseShop(false),
  mw_house_narrow: houseNarrow(false),
  mw_house_narrow_b: houseNarrow(false, WASH.white, PAINT.red),
  mw_house_gable_low: houseGable(true),
  mw_house_gable_b_low: houseGable(true, WASH.blue, PAINT.red, PAINT.ox),
  mw_house_gable_c_low: houseGable(true, WASH.pink, PAINT.green, PAINT.navy),
  mw_house_dutch_low: houseDutch(true),
  mw_house_parapet_low: houseParapet(true),
  mw_house_parapet_b_low: houseParapet(true, WASH.ochre, PAINT.blue, PAINT.green),
  mw_house_shop_low: houseShop(true),
  mw_house_narrow_low: houseNarrow(true),
  mw_house_narrow_b_low: houseNarrow(true, WASH.white, PAINT.red),
  mw_dormer: dormer(),
  mw_chimney_short: chimneyShort(),
  mw_ov_shutters_open: OV_WIN(NO, 'open', PAINT.blue),
  mw_ov_shutters_shut: OV_WIN(NO, 'shut', PAINT.green),
  mw_ov_shutters_hanging: OV_WIN(NO, 'hanging', PAINT.red),
  mw_ov_window_drowned: OV_WIN(drowned),
  mw_ov_window_bricked: OV_WIN(bricked),
  mw_ov_window_box: OV_WIN(windowBox),
  mw_ov_door_arched: OV_DOOR('arched', PAINT.navy),
  mw_ov_door_knocker: OV_DOOR('knocker', PAINT.teal),
  mw_ov_door_boarded: OV_DOOR('boarded', PAINT.ox),
  mw_ov_door_hanging: OV_DOOR('hanging', null),
  mw_ov_door_open: OV_DOOR('open', null),
  mw_ov_sign_fish: ov((g) => bracketSign(g, 0, 20, 'fish')),
  mw_ov_sign_key: ov((g) => bracketSign(g, 0, 20, 'key')),
  mw_ov_sign_boot: ov((g) => bracketSign(g, 0, 20, 'boot')),
  mw_ov_awning: ov((g) => awning(g, 0, 32, 16, false), 32, 48),
  mw_ov_awning_torn: ov((g) => awning(g, 0, 32, 16, true), 32, 48),
  mw_ov_drainpipe: ov((g) => downpipe(g, 13, 2, 46)),
  mw_ov_wall_lamp: ov((g) => wallLamp(g, 2, 22)),
  // In the water (2026-11-08).
  mw_cart_sunk: cartSunk(),
  mw_crate_drift: crateDrift(0),
  mw_barrel_bob: barrelBob(0),
  mw_lamp_leaning: lampLeaning(),
  mw_stall_drowned: stallDrowned(),
  mw_weed_mat: weedMat(),
  mw_ripples: ripples(0),
  mw_slates_afloat: slatesAfloat(),
  mw_eave_weed: eaveWeed(),
  mw_floorboards: floorboards(),
  mw_silt: silt(1),
  mw_silt_b: silt(5),
  mw_candle_ledge: candleLedge(),
  mw_roof_patch: roofPatch(),
  mw_roof_moss: roofMoss(1),
  mw_roof_moss_b: roofMoss(4),
};

export const MW_PALETTE = palette;
export const MW_PALETTE_EXTRA = palette;
export const MW_BUBBLES_SPRITES = frames((i) => bubbles(i), 8);
export const MW_GULPER_OUT_SPRITES = frames((i) => gulperBell('out', i), 2);
export const MW_GULPER_DOZE_SPRITES = frames((i) => gulperBell('doze', i), 2);
export const MW_GULPER_SNORE_SPRITES = frames((i) => gulperBell('snore', i), 2);
export const MW_CRATE_DRIFT_SPRITES = frames((i) => crateDrift(i), 4);
export const MW_BARREL_BOB_SPRITES = frames((i) => barrelBob(i), 4);
export const MW_RIPPLES_SPRITES = frames((i) => ripples(i), 4);

// How many tiles wide each big one stands.
export const MW_FOOTPRINTS = {
  mw_ringers_frame: 3,
  mw_market_cross: 2,
  mw_well: 2,
  mw_laundry_line: 3,
  mw_roof_boat: 3,
  mw_laid_table: 3,
  mw_dresser: 2,
  mw_coat_pegs: 2,
  mw_bell_tower: 4,
  mw_tower_porch: 5,
  mw_tower_door: 2,
  mw_tower_door_open: 2,
  mw_great_bell: 3,
  mw_gulper_nest: 4,
  mw_sea_gate: 4,
  mw_sea_gate_open: 4,
  mw_peal_board: 2,
  mw_house_gable: 2,
  mw_house_gable_b: 2,
  mw_house_gable_c: 2,
  mw_house_parapet_b: 2,
  mw_house_dutch: 2,
  mw_house_parapet: 2,
  mw_house_shop: 2,
  mw_house_gable_low: 2,
  mw_house_gable_b_low: 2,
  mw_house_gable_c_low: 2,
  mw_house_parapet_b_low: 2,
  mw_house_dutch_low: 2,
  mw_house_parapet_low: 2,
  mw_house_shop_low: 2,
  mw_ov_awning: 2,
  mw_ov_awning_torn: 2,
  mw_cart_sunk: 2,
  mw_stall_drowned: 3,
  mw_weed_mat: 2,
  mw_slates_afloat: 2,
  mw_eave_weed: 2,
  mw_floorboards: 2,
  mw_silt: 2,
  mw_silt_b: 2,
  mw_roof_patch: 2,
};
