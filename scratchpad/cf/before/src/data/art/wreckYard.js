// Props for the Wreck Yard (Chapter 5, the ship graveyard): the ghost cook in
// the galley, the bilge pumps, flooded hatches, the cook's pot and a hole in a
// hull. Drawn like coastProps.js (a tiny painter, 16 pixels to a tile, standing
// on the bottom edge and centred over the footprint). Every id starts `wy_`.
// Ones that move are animations too (WY_..._SPRITES): give the prop
// `animation: '<its name>'` and a `speed`.

const colors = new Map();
const palette = {};
function char(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0xf100 + colors.size);
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

  thick(x0, y0, x1, y1, t, c) {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= steps; i++) this.rect(Math.round(x0 + ((x1 - x0) * i) / steps) - Math.floor(t / 2), Math.round(y0 + ((y1 - y0) * i) / steps) - Math.floor(t / 2), t, t, c);
  }

  // Scanline fill of a polygon [[x, y], ...].
  poly(pts, c) {
    const ys = pts.map((p) => p[1]);
    for (let y = Math.floor(Math.min(...ys)); y <= Math.ceil(Math.max(...ys)); y++) {
      const xs = [];
      for (let i = 0; i < pts.length; i++) {
        const [ax, ay] = pts[i];
        const [bx, by] = pts[(i + 1) % pts.length];
        if ((ay <= y + 0.5 && by > y + 0.5) || (by <= y + 0.5 && ay > y + 0.5)) xs.push(ax + ((y + 0.5 - ay) / (by - ay)) * (bx - ax));
      }
      xs.sort((a, b) => a - b);
      for (let i = 0; i + 1 < xs.length; i += 2) this.rect(Math.round(xs[i]), y, Math.max(1, Math.round(xs[i + 1]) - Math.round(xs[i])), 1, c);
    }
  }

  // Outline only the cells next to a filled one that are still empty, but only
  // where `keep(x, y)` says (so a thing lying in water can lose its outline
  // under the waterline).
  outlineWhere(c, keep) {
    const edge = [];
    for (let y = -1; y <= this.h; y++) {
      for (let x = -1; x <= this.w; x++) {
        if (this.get(x, y) || !keep(x, y)) continue;
        if (this.get(x - 1, y) || this.get(x + 1, y) || this.get(x, y - 1) || this.get(x, y + 1)) edge.push([x, y]);
      }
    }
    for (const [x, y] of edge) this.set(x, y, c);
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

const OUT = '#10181e';
const IRON = ['#161a22', '#2e3642', '#505c6a', '#7c8c9a'];
const RUST = ['#3a1c14', '#6a3420', '#9a5430', '#c8803c'];
const BRASS = ['#5c3e10', '#a07020', '#d8a838', '#fae27c'];
const WOOD = ['#2a231e', '#4a3a2c', '#6c5440', '#907a5c'];
const WATER = ['#0b262c', '#123c42', '#1f5a5c', '#5aa89c'];
// The ghost: pale sea-green, see-through.
const GHOST = ['rgba(60, 120, 110, 0.55)', 'rgba(150, 214, 196, 0.62)', 'rgba(206, 246, 230, 0.7)', 'rgba(240, 255, 250, 0.8)'];
const GHOST_OUT = 'rgba(20, 60, 56, 0.6)';

// --- The ghost cook ----------------------------------------------------
// A drowned ship's cook who hasn't noticed: a tall floppy toque, a walrus of a
// moustache, an apron with a stain, a ladle in one hand. No legs: he trails
// off into a wisp. Frame f bobs him and stirs the ladle.
function ghostCook(f) {
  const g = new Grid(20, 30);
  const bob = [0, -1, -1, 0][f];
  const y0 = 2 + bob;
  // Toque: tall and leaning, puffed at the top.
  g.oval(10, y0 + 3, 5, 3, GHOST[2]);
  g.oval(9, y0 + 2, 3, 2, GHOST[3]);
  g.rect(6, y0 + 5, 9, 4, GHOST[2]);
  g.rect(6, y0 + 8, 9, 1, GHOST[1]);
  // Head.
  g.oval(10, y0 + 12, 4, 3, GHOST[1]);
  g.rect(8, y0 + 11, 1, 1, OUT);
  g.rect(12, y0 + 11, 1, 1, OUT);
  // The moustache, drooping both ways.
  g.rect(7, y0 + 13, 7, 1, GHOST[3]);
  g.set(6, y0 + 14, GHOST[3]);
  g.set(14, y0 + 14, GHOST[3]);
  // Body and apron.
  g.oval(10, y0 + 19, 5, 4, GHOST[1]);
  g.rect(7, y0 + 16, 7, 8, GHOST[2]);
  g.rect(9, y0 + 18, 2, 2, 'rgba(120, 150, 90, 0.6)');
  // The wisp where his legs should be.
  const sway = [0, 1, 0, -1][f];
  g.oval(10 + sway, y0 + 24, 3, 2, GHOST[1]);
  g.oval(11 + sway * 2, y0 + 26, 2, 1, GHOST[0]);
  g.set(12 + sway * 2, y0 + 27, GHOST[0]);
  // The arm and ladle (stirring: the bowl goes round).
  const lx = [16, 17, 16, 15][f];
  const ly = [y0 + 20, y0 + 19, y0 + 18, y0 + 19][f];
  g.line(14, y0 + 17, lx, ly - 4, GHOST[2]);
  g.line(lx, ly - 4, lx, ly, IRON[3]);
  g.rect(lx - 1, ly, 3, 2, IRON[2]);
  g.outline(GHOST_OUT);
  return g.rows();
}

// --- A bilge pump --------------------------------------------------------
// An iron barrel of a pump bolted to the deck, a spout on one side and a long
// brass-capped handle on a pivot. Off: handle up. On (being worked): handle
// down, water gushing from the spout.
function pump(on) {
  const g = new Grid(16, 26);
  // The barrel.
  g.rect(5, 10, 6, 14, IRON[1]);
  g.rect(5, 10, 1, 14, IRON[2]);
  g.rect(10, 10, 1, 14, IRON[0]);
  g.rect(4, 22, 8, 2, IRON[0]);
  for (const y of [12, 17, 21]) g.rect(5, y, 6, 1, RUST[1]);
  g.set(7, 14, RUST[2]);
  g.set(8, 19, RUST[2]);
  // The spout.
  g.rect(11, 15, 3, 2, IRON[2]);
  g.set(13, 17, IRON[1]);
  // The pivot post and the handle.
  g.rect(7, 6, 2, 4, IRON[2]);
  if (on) {
    g.line(1, 11, 8, 7, WOOD[2]);
    g.rect(0, 11, 2, 2, BRASS[2]);
    // Water from the spout.
    g.rect(13, 18, 2, 3, WATER[3]);
    g.rect(12, 21, 4, 2, WATER[2]);
    g.set(15, 20, '#dff4ee');
  } else {
    g.line(8, 7, 3, 1, WOOD[2]);
    g.rect(2, 0, 2, 2, BRASS[2]);
  }
  g.outline(OUT);
  return g.rows();
}

// --- A flooded hatch -----------------------------------------------------
// A square of black-green bilge water standing level with the deck, a slick
// of oil and a ripple going across it. It's a gate: pump it out and it's gone.
function flood(f) {
  const g = new Grid(16, 16);
  g.rect(0, 0, 16, 16, WATER[1]);
  g.rect(0, 0, 16, 2, WATER[0]);
  const r = [3, 7, 11, 7][f];
  g.rect(2, r, 5, 1, WATER[3]);
  g.rect(9, (r + 6) % 14 + 1, 4, 1, WATER[2]);
  g.set(12, 4, 'rgba(160, 120, 200, 0.6)');
  g.set(13, 4, 'rgba(200, 180, 90, 0.6)');
  return g.rows();
}

// --- The cook's pot ------------------------------------------------------
// A big dented iron pot with a lid; full, a wisp of (ghostly) steam.
function pot(full) {
  const g = new Grid(16, 16);
  g.oval(8, 10, 6, 4, IRON[1]);
  g.rect(2, 8, 13, 5, IRON[1]);
  g.rect(2, 8, 13, 1, IRON[2]);
  g.rect(1, 9, 1, 2, IRON[0]);
  g.rect(15, 9, 1, 2, IRON[0]);
  g.set(5, 11, RUST[1]);
  if (full) {
    g.rect(4, 6, 9, 2, IRON[2]);
    g.rect(7, 5, 3, 1, IRON[3]);
    g.line(9, 4, 10, 0, GHOST[2]);
    g.line(6, 4, 5, 1, GHOST[1]);
  } else {
    g.rect(4, 8, 9, 1, IRON[0]);
  }
  g.outline(OUT);
  return g.rows();
}

// --- A hole in a hull ----------------------------------------------------
// Rusted plate torn open, the edges curled back, black inside: a way in. Lies
// against a hull wall; walk into it.
function hullHole() {
  const g = new Grid(16, 22);
  g.rect(1, 2, 14, 20, RUST[1]);
  g.rect(1, 2, 14, 1, RUST[2]);
  for (const y of [6, 12, 18]) for (let x = 2; x < 15; x += 4) g.set(x, y, IRON[3]);
  g.oval(8, 14, 5, 7, '#05080a');
  g.rect(3, 14, 11, 8, '#05080a');
  // The torn lips.
  g.line(3, 9, 5, 6, RUST[3]);
  g.line(12, 7, 14, 10, RUST[3]);
  g.set(4, 15, RUST[2]);
  g.set(13, 16, RUST[2]);
  g.outline(OUT);
  return g.rows();
}

// --- A deck hatch, open ----------------------------------------------------
// A square hole in the planks with its lid thrown back and the top of a ladder
// going down into the dark. Lies flat: walk onto it.
function hatch() {
  const g = new Grid(16, 16);
  g.rect(1, 2, 14, 13, WOOD[0]);
  g.rect(1, 2, 14, 1, WOOD[3]);
  g.rect(1, 14, 14, 1, WOOD[1]);
  g.rect(3, 4, 10, 10, '#05080a');
  // The ladder's top rungs.
  g.rect(5, 4, 1, 10, WOOD[2]);
  g.rect(10, 4, 1, 10, WOOD[2]);
  for (const y of [6, 9, 12]) g.rect(5, y, 6, 1, WOOD[2]);
  // The lid, thrown back, with its iron ring.
  g.rect(2, 0, 12, 2, WOOD[2]);
  g.set(8, 1, IRON[3]);
  return g.rows();
}

// --- The crew's table (the galley) ----------------------------------------
// A long plank mess table, four tiles wide, laid for twelve: six tin bowls a
// side, each full of rain, a spoon by each. No candle: nothing's lit in here.
function crewTable() {
  const g = new Grid(64, 26);
  // The top: planks running the length, a lip along the front.
  g.rect(1, 4, 62, 14, WOOD[2]);
  for (const y of [7, 11, 15]) g.rect(1, y, 62, 1, WOOD[1]);
  g.rect(1, 4, 62, 1, WOOD[3]);
  g.rect(1, 18, 62, 3, WOOD[1]);
  g.rect(1, 20, 62, 1, WOOD[0]);
  // Legs.
  for (const x of [3, 30, 58]) { g.rect(x, 21, 3, 5, WOOD[1]); g.rect(x + 2, 21, 1, 5, WOOD[0]); }
  // Bowls of rain, and spoons.
  for (const y of [6, 13]) {
    for (let i = 0; i < 6; i++) {
      const x = 5 + i * 10;
      g.rect(x, y, 6, 3, IRON[2]);
      g.rect(x + 1, y + 3, 4, 1, IRON[1]);
      g.rect(x + 1, y, 4, 2, WATER[2]);
      g.set(x + 1, y, WATER[3]);
      g.set(x + 7, y + 1, IRON[3]);
      g.set(x + 7, y + 2, IRON[3]);
    }
  }
  g.outline(OUT);
  return g.rows();
}

// --- The great mast (wreck_mast) -----------------------------------------
// The hulk's mainmast, a ship's mast and not a pole: a thick round trunk of
// dark timber with iron hoops, a wooden cleat-ring at its foot, the
// cross-trees just under the fighting top (the planks sit on them), and the
// shrouds running down from there to deadeyes on the hulk's rail, with
// ratlines across. Stand it on the hulk's north side (15,11), footprint one
// tile: its top meets the fighting top's lower edge at row 4. The split top
// that pokes up through the planks is a separate prop (wy_mast_tip, at 15,4)
// so the star shard can sit in it.
const ROPE = ['#5a4a2c', '#8c7644', '#bca46c'];
function mainmast() {
  const W = 56;
  const H = 116;
  const g = new Grid(W, H);
  const cx = 28; // the mast's middle (the footprint's middle)
  // The shrouds first (behind the trunk): from the cross-trees out to deadeyes
  // on the hulk's rail at the bottom corners, with ratlines every 6 rows.
  const shroud = (x0, x1) => {
    g.line(x0, 6, x1, H - 10, ROPE[1]);
    g.line(x0 + (x1 > x0 ? 2 : -2), 6, x1 + (x1 > x0 ? 2 : -2), H - 10, ROPE[0]);
  };
  shroud(cx - 6, 3); shroud(cx + 5, W - 4);
  for (let y = 16; y < H - 14; y += 7) {
    const t = (y - 6) / (H - 16);
    const l = Math.round(cx - 6 + (3 - (cx - 6)) * t);
    const r = Math.round(cx + 5 + (W - 4 - (cx + 5)) * t);
    g.line(l, y, cx - 4, y, ROPE[0]);
    g.line(cx + 4, y, r + 2, y, ROPE[0]);
  }
  // Deadeyes on the rail.
  for (const x of [2, 5, W - 6, W - 3]) { g.rect(x, H - 10, 2, 3, WOOD[0]); g.set(x, H - 9, WOOD[3]); }
  // The trunk: round (light down the left, shadow down the right), a touch
  // thicker at the foot.
  for (let y = 0; y < H - 6; y++) {
    const half = 4 + (y > H * 0.55 ? 1 : 0);
    for (let x = cx - half; x < cx + half; x++) {
      const i = x - (cx - half);
      const tone = i === 0 ? WOOD[1] : i === 1 || i === 2 ? WOOD[3] : i >= half * 2 - 2 ? WOOD[0] : WOOD[2];
      g.set(x, y, tone);
    }
    // The grain: a dark seam now and then.
    if (y % 11 === 3) g.set(cx - 1, y, WOOD[1]);
    if (y % 13 === 7) g.set(cx + 1, y, WOOD[1]);
  }
  // Iron hoops round the trunk.
  for (const y of [14, 34, 56, 78]) {
    const half = 5 + (y > H * 0.55 ? 1 : 0);
    g.rect(cx - half, y, half * 2, 2, IRON[1]);
    g.rect(cx - half, y, half * 2, 1, IRON[2]);
    g.set(cx - half + 1, y, IRON[3]);
    g.set(cx + 1, y + 1, RUST[1]);
  }
  // The cross-trees at the top, which the fighting top rests on.
  g.rect(cx - 13, 0, 26, 3, WOOD[1]);
  g.rect(cx - 13, 0, 26, 1, WOOD[3]);
  g.rect(cx - 13, 2, 26, 1, WOOD[0]);
  g.rect(cx - 6, 3, 2, 4, WOOD[0]);
  g.rect(cx + 4, 3, 2, 4, WOOD[0]);
  // The foot: a ring of wedges and a cleat-ring, belaying pins round it.
  g.rect(cx - 9, H - 7, 18, 5, WOOD[1]);
  g.rect(cx - 9, H - 7, 18, 1, WOOD[3]);
  g.rect(cx - 9, H - 3, 18, 1, WOOD[0]);
  for (const x of [cx - 8, cx - 4, cx + 3, cx + 7]) { g.rect(x, H - 9, 1, 3, IRON[3]); g.set(x, H - 9, BRASS[2]); }
  // A coil of the halyard round a pin, and weed at the foot.
  g.rect(cx + 6, H - 6, 3, 2, ROPE[2]);
  g.rect(cx - 10, H - 2, 20, 2, '#2c4a2e');
  g.set(cx - 6, H - 3, '#3e6a3e');
  g.set(cx + 4, H - 3, '#3e6a3e');
  g.outline(OUT);
  return g.rows();
}

// The top of the great mast, snapped: it comes up through the fighting top's
// planks and splits like a broken pencil into two ragged prongs. The star
// shard prop (c5_star_shard, same tile, listed after this one) sits in the
// split; once it's taken the split is empty.
function mastTip() {
  const g = new Grid(16, 26);
  // The two halves of the split top, leaning apart from the iron band where
  // it comes through the planks, with splintered tips. Each half is a thick
  // wedge, light on its outer face and dark inside.
  for (let y = 4; y < 23; y++) {
    const t = (22 - y) / 18; // 0 at the band, 1 at the top
    const lo = Math.round(4 - 3 * t);
    const ro = Math.round(11 + 3 * t);
    const lw = y < 7 ? 2 : 3;
    for (let i = 0; i < lw; i++) g.set(lo + i, y, i === 0 ? WOOD[3] : WOOD[2]);
    if (y >= 6) for (let i = 0; i < lw; i++) g.set(ro - i, y, i === 0 ? WOOD[0] : WOOD[1]);
  }
  g.set(1, 2, WOOD[3]); g.set(2, 3, WOOD[3]); g.set(13, 4, WOOD[2]); g.set(14, 5, WOOD[1]);
  // Inside the split: raw, pale, torn wood (the shard sits at the bottom of it).
  for (let y = 12; y < 22; y++) { g.set(7, y, WOOD[1]); g.set(8, y, WOOD[1]); }
  g.set(7, 15, WOOD[3]); g.set(8, 13, WOOD[3]); g.set(6, 18, WOOD[3]); g.set(9, 17, WOOD[0]);
  // The iron band, and splintered planks round the foot.
  g.rect(3, 22, 10, 2, IRON[1]);
  g.rect(3, 22, 10, 1, IRON[2]);
  g.set(4, 22, IRON[3]); g.set(9, 23, RUST[1]);
  g.rect(1, 24, 14, 2, WOOD[1]);
  g.rect(1, 24, 14, 1, WOOD[3]);
  g.set(0, 25, WOOD[2]); g.set(15, 25, WOOD[2]);
  g.outline(OUT);
  return g.rows();
}

// --- The ghost cook's portrait (32 x 32) -----------------------------------
// The same pale sea-green ghost, close up: the floppy toque, round cheerful
// face, little dark eyes, the drooping moustache, the apron's bib. He has no
// expressions but a beam and a startled look ({surprised}).
function cookFace({ blink = false, surprised = false } = {}) {
  const g = new Grid(32, 32);
  const P = ['#3c7a6e', '#7ec8b2', '#bdeedd', '#e8fff6'];
  // Shoulders and the apron's bib.
  g.oval(16, 31, 13, 5, P[1]);
  g.rect(10, 27, 12, 5, P[3]);
  g.rect(10, 27, 12, 1, P[2]);
  g.set(13, 29, '#8aa070'); g.set(14, 29, '#8aa070'); g.set(14, 30, '#8aa070');
  // The face.
  g.oval(16, 18, 9, 8, P[2]);
  g.oval(14, 16, 5, 4, P[3]);
  // The toque: a tall puff leaning to one side, and its band.
  g.oval(14, 5, 10, 5, P[3]);
  g.oval(20, 3, 6, 3, P[3]);
  g.rect(7, 8, 18, 4, P[3]);
  g.rect(7, 11, 18, 1, P[1]);
  g.set(12, 4, P[2]); g.set(19, 6, P[2]); g.set(15, 2, P[2]);
  // Eyes.
  const ink = '#14322e';
  if (blink) { g.rect(10, 17, 3, 1, ink); g.rect(19, 17, 3, 1, ink); }
  else if (surprised) { g.rect(10, 15, 3, 4, ink); g.rect(19, 15, 3, 4, ink); g.set(10, 15, '#ffffff'); g.set(19, 15, '#ffffff'); }
  else { g.rect(10, 16, 3, 2, ink); g.rect(19, 16, 3, 2, ink); g.set(10, 16, '#ffffff'); g.set(19, 16, '#ffffff'); }
  // Cheeks.
  g.rect(8, 20, 2, 1, '#9adcc0'); g.rect(22, 20, 2, 1, '#9adcc0');
  // The moustache, drooping both ways; his mouth under it.
  g.rect(11, 21, 10, 2, '#ffffff');
  g.rect(9, 22, 3, 2, '#ffffff'); g.rect(20, 22, 3, 2, '#ffffff');
  g.set(8, 24, '#ffffff'); g.set(23, 24, '#ffffff');
  g.rect(12, 23, 8, 1, P[1]);
  if (surprised) g.rect(14, 24, 4, 2, ink);
  else g.rect(13, 24, 6, 1, ink);
  g.outline(GHOST_OUT);
  return g.rows();
}
const COOK_IDLE = cookFace();
const COOK_BLINK = cookFace({ blink: true });
const COOK_SURPRISED = cookFace({ surprised: true });
const rowPatches = (base, rows) => rows.flatMap((row, y) => {
  if (row === base[y]) return [];
  let a = 0;
  while (row[a] === base[y][a]) a++;
  let b = row.length - 1;
  while (row[b] === base[y][b]) b--;
  return [[y, a, row.slice(a, b + 1)]];
});
export const WY_COOK_PORTRAIT = {
  palette,
  eyes: COOK_IDLE.map((row, y) => (row === COOK_BLINK[y] ? -1 : y)).filter((y) => y >= 0),
  expressions: { surprised: { patches: rowPatches(COOK_IDLE, COOK_SURPRISED) } },
  idle: COOK_IDLE,
  blink: COOK_BLINK,
};

// ===================== WATER'S EDGE AND DECK DRESSING (2026-11-08) =====================
// To break up a straight quay, a square of water or a bare deck. Ones that lie in the water
// or on the deck are flat: lay them `flat: true, walkable: true` (in the water they sit on
// solid tiles anyway). The tall ones (a post, the bow, ribs, a hammock on a bulkhead) stand
// on a water or wall tile, never on a floor anyone walks. Each has its own dice.
let edgeSeed = 7741;
const er = () => {
  edgeSeed = (edgeSeed * 1664525 + 1013904223) >>> 0;
  return edgeSeed / 4294967296;
};
const eri = (n) => Math.floor(er() * n);
// Under the water: a see-through dark green, so the sea's own colour shows through it.
const SUNK = ['rgba(6, 30, 28, 0.55)', 'rgba(10, 44, 40, 0.45)', 'rgba(40, 90, 80, 0.4)'];
const FOAM = ['rgba(196, 228, 216, 0.55)', 'rgba(220, 244, 236, 0.85)'];
const MSTONE = ['#222a26', '#3c4642', '#5e6a64', '#7e8a82', '#a0aca2'];
const IROCK = ['#22302c', '#3a4a46', '#5a6a66', '#7a8a84', '#9aaaa2'];
const WEED = ['#16301a', '#2a4a26', '#3a5c30', '#5a8444', '#86ac64'];
const KELP = ['#2a2412', '#4a3e1c', '#6a5a28', '#8a7a3a'];
const BARN = ['#5a5a50', '#8a8a7c', '#c8c4b4', '#ecead8'];
const SLICK = ['#0e2a2e', '#163a3e', '#245254', '#4a7a78'];
const SACK = ['#4a3c26', '#7a6440', '#a08a5c', '#c4b080'];

// A ring of foam pixels round a point, broken up.
function foamAround(g, cx, cy, rx, ry, n = 14) {
  for (let i = 0; i < n; i++) {
    const a = (i / n) * 6.2832 + er() * 0.4;
    if (er() < 0.3) continue;
    g.set(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, FOAM[er() < 0.4 ? 1 : 0]);
  }
}

// One dressed block, seen from above and a little in front: a top face and its front.
function block(g, x, y, w, h, d, S) {
  g.rect(x, y, w, h, S[3]);
  g.rect(x, y, w, 1, S[4]);
  g.rect(x, y + h, w, d, S[2]);
  g.rect(x + w - 1, y, 1, h + d, S[1]);
  if (w > 4) g.set(x + 1 + eri(w - 2), y + 1 + eri(Math.max(1, h - 1)), S[2]);
}

// wy_steps_water: stone steps going down off a quay into the water: the top step level with
// the flags, the next one wet, the last two under the green, weed in the corners and a chipped
// side stone (2 wide, flat; put it on the water tile below the quay's edge: it reaches up into it).
function stepsWater(S = MSTONE) {
  edgeSeed = 7741;
  const g = new Grid(32, 20);
  // The side walls, broken off at different heights.
  g.rect(3, 0, 4, 12, S[2]); g.rect(3, 0, 4, 1, S[4]); g.rect(6, 0, 1, 12, S[1]);
  g.rect(25, 0, 4, 9, S[2]); g.rect(25, 0, 4, 1, S[4]); g.rect(25, 0, 1, 9, S[1]);
  g.set(28, 9, S[1]); g.set(27, 9, S[2]); g.set(3, 12, S[1]);
  // The treads, each one down and darker.
  const treads = [[0, S[3], S[4]], [5, S[2], S[3]], [10, SUNK[2], S[2]], [14, SUNK[1], SUNK[2]]];
  for (const [y, top, lip] of treads) {
    g.rect(7, y, 18, 4, top);
    g.rect(7, y, 18, 1, lip);
    g.rect(7, y + 4, 18, 1, y < 10 ? S[1] : SUNK[0]);
  }
  g.rect(12, 5, 1, 4, S[1]); g.rect(19, 0, 1, 4, S[2]);
  // The waterline across the third step, weed in its corners.
  for (let x = 7; x < 25; x++) if (er() < 0.7) g.set(x, 10, FOAM[er() < 0.3 ? 1 : 0]);
  g.rect(7, 8, 2, 3, WEED[2]); g.set(8, 7, WEED[3]); g.rect(23, 8, 2, 3, WEED[1]); g.set(24, 7, WEED[3]);
  g.set(8, 12, WEED[2]); g.set(23, 13, WEED[2]); g.set(9, 15, WEED[1]);
  g.outlineWhere(MSTONE[0], (x, y) => y < 11);
  foamAround(g, 16, 18, 13, 2, 16);
  return g.rows();
}

// wy_coping_fallen: coping stones knocked off a quay's edge by the sea: one lying tipped in
// the shallows, one mostly under, chips about them and the foam round them (2 wide, flat).
function copingFallen(S = MSTONE, seed = 812) {
  edgeSeed = seed;
  const g = new Grid(32, 16);
  // The one mostly under: a dark shape and its top edge.
  g.poly([[17, 7], [28, 5], [30, 11], [19, 13]], SUNK[1]);
  g.line(17, 7, 28, 5, S[2]);
  g.set(29, 6, S[3]);
  // The tipped one, half out.
  g.poly([[3, 3], [13, 1], [15, 7], [5, 9]], S[3]);
  g.line(3, 3, 13, 1, S[4]);
  g.poly([[5, 9], [15, 7], [15, 10], [6, 12]], S[1]);
  g.set(8, 5, S[2]); g.set(11, 4, S[2]); g.set(6, 6, S[4]);
  g.outlineWhere(S[0], (x, y) => y < 10);
  // Chips.
  for (const [x, y] of [[16, 2], [20, 3], [24, 13], [11, 13], [2, 11]]) { g.set(x, y, S[3]); g.set(x + 1, y, S[1]); }
  // The waterline round them.
  for (let x = 4; x < 16; x++) if (er() < 0.75) g.set(x, 11 + (x % 3 === 0 ? 1 : 0), FOAM[er() < 0.35 ? 1 : 0]);
  for (let x = 18; x < 30; x++) if (er() < 0.5) g.set(x, 13 - Math.floor((x - 18) / 6), FOAM[0]);
  g.set(14, 8, WEED[3]); g.set(15, 9, WEED[2]); g.set(4, 9, WEED[2]);
  return g.rows();
}

// wy_block_sunk: one big block fallen in, a corner standing out of the water (1 wide, flat).
function blockSunk(S = MSTONE, seed = 431) {
  edgeSeed = seed;
  const g = new Grid(16, 14);
  g.poly([[1, 6], [9, 2], [15, 6], [7, 11]], SUNK[1]);
  g.poly([[4, 5], [9, 2], [13, 5], [8, 8]], S[3]);
  g.line(4, 5, 9, 2, S[4]);
  g.poly([[8, 8], [13, 5], [13, 7], [8, 10]], S[1]);
  g.set(9, 5, S[2]);
  g.outlineWhere(S[0], (x, y) => y < 9);
  foamAround(g, 8, 7, 7, 4, 16);
  g.set(5, 8, WEED[3]); g.set(4, 9, WEED[2]);
  return g.rows();
}

// wy_timber_sunk: a great baulk of timber, an old quay beam, lying slantwise half under the
// water: its iron strap, its square end and the green growing on it (2 wide, flat).
function timberSunk() {
  edgeSeed = 5150;
  const g = new Grid(40, 16);
  // The under part: dark, see-through, the far end lost.
  g.thick(22, 9, 37, 13, 4, SUNK[1]);
  // The out part.
  g.thick(3, 4, 22, 9, 4, WOOD[2]);
  g.line(2, 3, 21, 8, WOOD[3]);
  g.line(4, 6, 22, 11, WOOD[1]);
  g.rect(1, 2, 3, 4, WOOD[1]); g.set(2, 3, WOOD[3]); g.set(1, 5, WOOD[0]);
  // Its iron strap and bolts, rusted.
  g.rect(12, 5, 2, 5, RUST[1]); g.set(12, 5, RUST[3]); g.set(13, 8, RUST[2]);
  for (const x of [6, 9, 16, 19]) g.set(x, 4 + Math.round((x - 3) * 5 / 19), WOOD[0]);
  // Green slime along its wet side.
  for (let x = 14; x < 23; x++) g.set(x, 9 + Math.round((x - 14) / 4), WEED[2]);
  g.outlineWhere(OUT, (x, y) => x < 23);
  for (let x = 20; x < 26; x++) g.set(x, 7 + (x % 2), FOAM[1]);
  for (let x = 19; x < 25; x++) if (er() < 0.6) g.set(x, 12 + (x % 2), FOAM[0]);
  return g.rows();
}

// wy_weed_mat: a raft of torn weed floating, brown kelp and green wrack, bladders, a cork in it
// (2 wide, flat; on open water, or caught against a wall).
function weedMat(seed = 2203) {
  edgeSeed = seed;
  const g = new Grid(32, 14);
  for (let i = 0; i < 26; i++) {
    const x = 4 + eri(24), y = 3 + eri(8);
    const c = er() < 0.5 ? KELP[1 + eri(2)] : WEED[1 + eri(3)];
    g.thick(x, y, x + eri(5) - 2, y + eri(3) - 1, 2, c);
  }
  for (let i = 0; i < 9; i++) g.set(3 + eri(26), 3 + eri(9), er() < 0.5 ? KELP[3] : WEED[4]);
  g.rect(18, 6, 2, 2, '#b4482e'); g.set(18, 6, '#e07050');
  g.outline(SUNK[0]);
  // Loose strands drifting off it.
  g.line(28, 8, 31, 10, WEED[2]); g.line(2, 5, 0, 3, KELP[1]); g.line(10, 11, 8, 13, WEED[1]);
  foamAround(g, 16, 7, 15, 6, 18);
  return g.rows();
}

// wy_weed_fringe: weed hanging off a quay or hull into the water, the tops caught on the edge
// and the ends streaming out (2 wide, flat; put it on the water tile under the edge).
function weedFringe(seed = 3307) {
  edgeSeed = seed;
  const g = new Grid(32, 16);
  for (let x = 1; x < 31; x++) {
    if (er() < 0.25) continue;
    const len = 3 + eri(9);
    const c = er() < 0.4 ? KELP[1 + eri(2)] : WEED[1 + eri(3)];
    let xx = x;
    for (let y = 0; y < len; y++) {
      if (y > 2 && er() < 0.3) xx += er() < 0.5 ? -1 : 1;
      g.set(xx, y, y > len - 3 ? SUNK[2] : c);
    }
    if (er() < 0.2) g.set(x, 1, KELP[3]);
  }
  for (let x = 0; x < 32; x++) if (er() < 0.5) g.set(x, 0, WEED[er() < 0.5 ? 3 : 2]);
  for (let x = 1; x < 31; x += 2 + eri(3)) g.set(x, 4 + eri(3), FOAM[0]);
  return g.rows();
}

// wy_mooring_post: an old timber mooring post standing in the water off a quay, an iron ring
// bolted through it with a rope's end still tied on and trailing in the sea, barnacles at the
// waterline (1 wide; it stands on a water tile and reaches a little up over the edge).
function mooringPost() {
  edgeSeed = 6021;
  const g = new Grid(16, 26);
  g.rect(5, 2, 6, 19, WOOD[2]);
  g.rect(5, 2, 1, 19, WOOD[3]);
  g.rect(10, 2, 1, 19, WOOD[1]);
  g.rect(5, 1, 6, 2, WOOD[3]); g.set(7, 0, WOOD[3]); g.set(8, 0, WOOD[2]);
  g.set(7, 6, WOOD[1]); g.set(8, 11, WOOD[1]); g.set(6, 14, WOOD[1]);
  // The ring and its bolt, and the rope off it.
  g.rect(7, 8, 2, 2, IRON[2]);
  g.set(11, 9, IRON[3]); g.set(12, 10, IRON[2]); g.set(12, 11, IRON[2]); g.set(11, 12, IRON[2]); g.set(10, 12, IRON[1]);
  g.line(12, 12, 13, 17, ROPE[1]); g.line(13, 17, 12, 21, ROPE[1]); g.set(13, 14, ROPE[2]);
  // Barnacles and green at the waterline.
  g.rect(5, 17, 6, 3, BARN[1]); g.set(6, 18, BARN[3]); g.set(9, 17, BARN[2]); g.set(7, 19, BARN[2]);
  g.rect(5, 20, 6, 1, WEED[2]);
  g.outlineWhere(OUT, (x, y) => y < 21);
  // Under the water: the post's shadow, the rope gone green.
  g.rect(5, 21, 6, 3, SUNK[0]);
  g.set(12, 22, SUNK[2]); g.set(13, 23, SUNK[2]);
  foamAround(g, 8, 21, 5, 2, 14);
  return g.rows();
}

// wy_cart_drowned: a handcart the flood carried off the quay, tipped in the shallows: its bed
// slanting, one wheel's rim and spokes out of the water, the shafts sticking up (2 wide, flat).
function cartDrowned() {
  edgeSeed = 4410;
  const g = new Grid(32, 18);
  // The bed, going under at its far end.
  g.poly([[6, 6], [22, 3], [26, 10], [9, 13]], WOOD[2]);
  for (let i = 0; i < 4; i++) g.line(7 + i, 7 + i * 1.6, 23 + i, 4 + i * 1.6, i % 2 ? WOOD[1] : WOOD[3]);
  g.poly([[18, 8], [26, 10], [24, 14], [14, 13]], SUNK[1]);
  // The shafts, up out of it.
  g.thick(6, 7, 1, 1, 2, WOOD[2]); g.thick(9, 12, 3, 5, 2, WOOD[1]); g.set(1, 1, WOOD[3]); g.set(3, 5, WOOD[3]);
  // The wheel: the top of the rim, three spokes, the hub.
  for (let a = 3.3; a < 6.2; a += 0.12) g.set(13 + Math.cos(a) * 6, 10 + Math.sin(a) * 6, WOOD[0]);
  for (let a = 3.3; a < 6.2; a += 0.12) g.set(13 + Math.cos(a) * 5, 10 + Math.sin(a) * 5, IRON[2]);
  g.line(13, 10, 9, 6, WOOD[1]); g.line(13, 10, 13, 5, WOOD[1]); g.line(13, 10, 17, 6, WOOD[1]);
  g.rect(12, 9, 3, 2, IRON[1]);
  g.outlineWhere(OUT, (x, y) => y < 11 || x < 10);
  foamAround(g, 15, 11, 12, 4, 22);
  return g.rows();
}

// wy_boat_swamped: a rowing boat sunk at her moorings, just her gunwales out, the sea inside
// her, a thwart and her painter going off to nothing (2 wide, flat).
function boatSwamped() {
  edgeSeed = 9090;
  const g = new Grid(32, 14);
  const hull = [[3, 7], [8, 3], [22, 2], [29, 5], [30, 7], [27, 10], [10, 11], [4, 9]];
  g.poly(hull, WOOD[1]);
  g.poly([[5, 7], [9, 4], [22, 3], [27, 6], [26, 9], [10, 10], [6, 9]], SUNK[2]);
  g.poly([[6, 7], [10, 5], [21, 4], [26, 6], [25, 8], [10, 9], [7, 8]], 'rgba(30, 80, 76, 0.5)');
  g.line(8, 3, 22, 2, WOOD[3]); g.line(22, 2, 29, 5, WOOD[3]);
  g.thick(15, 4, 16, 9, 2, WOOD[2]); g.thick(21, 4, 21, 8, 1, WOOD[2]);
  g.outline(OUT);
  g.line(2, 8, 0, 11, ROPE[1]);
  foamAround(g, 17, 7, 15, 5, 22);
  return g.rows();
}

// wy_scorch_line: the hint at the mast's split top: a streak of burnt grain running east along the
// planks, as if something fell here lengthways and was carried off on, with a few pale star-dust
// flecks still caught in the char (2 wide, flat). The second one is the streak further on.
function scorchLine(seed = 1) {
  const g = new Grid(32, 16);
  let r = seed * 9301 + 49297;
  const rnd = () => { r = (r * 9301 + 49297) % 233280; return r / 233280; };
  const y0 = seed === 1 ? 9 : 7;
  for (let x = 0; x < 32; x++) {
    const w = Math.max(1, Math.round(3 - x * 0.07 + (rnd() - 0.5) * 1.4));
    const y = y0 + Math.round(Math.sin(x * 0.35 + seed) * 1.2) - Math.floor(x / 14);
    g.rect(x, y - Math.floor(w / 2), 1, w, IRON[0]);
    if (rnd() < 0.5) g.set(x, y - Math.floor(w / 2) - 1, IRON[1]);
    if (rnd() < 0.18) g.set(x, y, '#9fd6e8');
    if (rnd() < 0.06) g.set(x, y + 2, '#e6f6ff');
  }
  g.set(30, y0 - 3, '#e6f6ff');
  return g.rows();
}

// wy_plank_slick: what a ship sheds as she breaks: planks and a barrel's staves floating in a
// loose slick, a nail or two standing up, foam caught among them (2 wide, flat).
function plankSlick(seed = 1717) {
  edgeSeed = seed;
  const g = new Grid(32, 16);
  const planks = [[2, 4, 14, 2], [9, 9, 24, 6], [18, 12, 29, 13], [4, 12, 9, 10], [22, 2, 30, 4]];
  for (const [x0, y0, x1, y1] of planks) {
    g.thick(x0, y0, x1, y1, 2, WOOD[2]);
    g.line(x0, y0 - 1, x1, y1 - 1, WOOD[3]);
    g.set(x0, y0, WOOD[1]); g.set(x1, y1, WOOD[1]);
  }
  g.set(12, 7, IRON[3]); g.set(25, 12, IRON[3]);
  // Staves.
  for (const [x, y] of [[16, 2], [27, 8], [1, 8]]) { g.line(x, y, x + 3, y + 1, WOOD[1]); g.set(x + 1, y, WOOD[3]); }
  g.outline('rgba(8, 24, 24, 0.7)');
  for (let i = 0; i < 12; i++) g.set(1 + eri(30), 1 + eri(14), FOAM[er() < 0.4 ? 1 : 0]);
  return g.rows();
}

// wy_mast_fallen: a topmast that came down and lies across the water: its splintered butt, the
// iron hoops, a cross-tree still on it, its rigging trailing off into the sea (4 wide, flat).
function mastFallen() {
  edgeSeed = 2468;
  const g = new Grid(64, 24);
  const x0 = 3, y0 = 18, x1 = 60, y1 = 6;
  g.thick(x0, y0, x1, y1, 5, WOOD[2]);
  g.line(x0, y0 - 2, x1, y1 - 2, WOOD[3]);
  g.line(x0, y0 + 2, x1, y1 + 2, WOOD[1]);
  // The hoops.
  for (let t = 0.15; t < 0.95; t += 0.2) {
    const x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t;
    g.line(x - 1, y - 3, x + 1, y + 2, IRON[1]); g.set(x - 1, y - 3, IRON[3]);
  }
  // The cross-tree, two-thirds up.
  g.thick(38, 4, 44, 18, 2, WOOD[1]); g.line(38, 3, 44, 17, WOOD[3]);
  // The splintered butt.
  for (const [dx, dy] of [[-3, -1], [-2, 2], [-4, 1], [-1, 3]]) g.set(x0 + dx, y0 + dy, WOOD[3]);
  g.outline(OUT);
  // Rigging going off into the water.
  g.line(44, 18, 52, 23, ROPE[0]); g.line(30, 12, 26, 3, ROPE[0]); g.line(26, 3, 20, 1, SUNK[2]);
  g.line(52, 9, 58, 16, ROPE[0]); g.line(58, 16, 63, 18, SUNK[2]);
  // Foam along its weather side.
  for (let x = 6; x < 60; x += 2) if (er() < 0.6) g.set(x, Math.round(y0 + 4 + ((y1 - y0) * (x - x0)) / (x1 - x0)), FOAM[er() < 0.4 ? 1 : 0]);
  return g.rows();
}

// wy_bow_broken: the front of a ship broken off from the rest and lying in the sea: the stem
// post standing up, her planks running to it, the break ragged with splintered ends and her
// ribs showing, barnacles and weed where the water is (2 wide; stands on a water tile).
function bowBroken() {
  edgeSeed = 3141;
  const g = new Grid(40, 44);
  // The hull's side, narrowing to the stem (pointing up and right).
  const side = [[2, 30], [10, 18], [22, 9], [33, 2], [36, 4], [34, 16], [28, 30], [20, 38], [6, 39]];
  g.poly(side, WOOD[1]);
  // Strakes (her planks), each a lighter line running to the stem.
  for (let i = 0; i < 7; i++) {
    const y = 34 - i * 4;
    g.line(4 + i * 3, y, 33 - i, 3 + i * 2, i % 2 ? WOOD[2] : WOOD[3]);
  }
  // The stem post.
  g.thick(33, 2, 36, 0, 3, WOOD[2]); g.line(32, 1, 37, 0, WOOD[3]);
  // The break: dark inside, ribs showing, splintered plank ends.
  g.poly([[2, 30], [8, 23], [12, 27], [9, 32], [12, 36], [6, 39]], '#14100c');
  for (const [x, y] of [[8, 23], [10, 26], [7, 29], [10, 33]]) g.line(x, y, x - 4, y - 2 + eri(3), WOOD[3]);
  g.thick(6, 26, 6, 36, 2, WOOD[0]); g.thick(10, 24, 10, 34, 1, WOOD[2]);
  // An iron hawse-hole and the anchor chain gone into the sea.
  g.rect(27, 11, 3, 3, IRON[0]); g.set(28, 12, '#000000');
  for (let y = 14; y < 32; y += 2) g.set(29 + (y % 4 ? 1 : 0), y, IRON[2]);
  // Barnacles and weed along the waterline.
  for (let x = 4; x < 32; x++) {
    const y = 33 - Math.round((x - 4) * 0.25);
    if (er() < 0.7) g.set(x, y, BARN[1 + eri(3)]);
    if (er() < 0.5) g.set(x, y + 1, WEED[2]);
  }
  g.outlineWhere(OUT, (x, y) => y < 36);
  // Under the water: her shape going down.
  g.poly([[6, 39], [20, 38], [28, 31], [30, 40], [8, 43]], SUNK[0]);
  foamAround(g, 18, 37, 16, 4, 26);
  return g.rows();
}

// wy_ribs_jag: three ribs of a hull standing up out of the water, splintered at the tops,
// barnacled at the foot (1 wide; stands on a water tile).
function ribsJag(seed = 8282) {
  edgeSeed = seed;
  const g = new Grid(24, 30);
  const ribs = [[4, 26, 2, 6, 7], [11, 26, 9, 2, 6], [18, 26, 20, 9, 5]];
  for (const [x, yb, xt, yt, ] of ribs) {
    g.thick(x, yb, xt, yt, 2, WOOD[1]);
    g.line(x - 1, yb, xt - 1, yt, WOOD[3]);
    g.set(xt, yt - 1, WOOD[3]); g.set(xt + 1, yt - 2, WOOD[2]); g.set(xt - 1, yt - 1, WOOD[2]);
  }
  g.thick(3, 25, 20, 25, 2, WOOD[0]);
  for (let x = 2; x < 22; x++) if (er() < 0.6) g.set(x, 24 - eri(2), BARN[1 + eri(3)]);
  g.outlineWhere(OUT, (x, y) => y < 26);
  g.rect(3, 27, 18, 2, SUNK[0]);
  foamAround(g, 12, 26, 10, 2, 16);
  return g.rows();
}

// wy_barnacle_band: the waterline along a hull's foot: barnacles packed along it, weed hanging
// below, a ragged foam line (3 wide, flat; on the water tile under a hull side).
function barnacleBand(seed = 5521) {
  edgeSeed = seed;
  const g = new Grid(48, 16);
  for (let x = 0; x < 48; x++) {
    const h = 2 + eri(3);
    for (let y = 0; y < h; y++) g.set(x, y, er() < 0.5 ? BARN[1] : BARN[0]);
    if (er() < 0.4) g.set(x, eri(h), BARN[3]);
    if (er() < 0.55) { const l = 2 + eri(6); for (let y = h; y < h + l; y++) g.set(x, y, y > h + l - 2 ? SUNK[2] : WEED[1 + eri(2)]); }
    if (er() < 0.5) g.set(x, h + 1 + eri(2), FOAM[eri(2)]);
  }
  return g.rows();
}

// wy_edge_l / wy_edge_r: the same waterline, down a side: barnacles packed up the edge of the
// land or hull on the tile's left (wy_edge_l) or right (wy_edge_r), weed streaming out from it
// into the water (1 wide and 2 high, flat; on the water tile beside the edge).
function edgeSide(right, seed) {
  edgeSeed = seed;
  const g = new Grid(16, 32);
  for (let y = 0; y < 32; y++) {
    const w = 1 + eri(3);
    const at = (x) => (right ? 15 - x : x);
    for (let x = 0; x < w; x++) g.set(at(x), y, er() < 0.5 ? BARN[1] : BARN[0]);
    if (er() < 0.35) g.set(at(eri(w)), y, BARN[3]);
    if (er() < 0.5) {
      const l = 2 + eri(6);
      let yy = y;
      for (let x = w; x < w + l; x++) {
        if (er() < 0.3) yy += er() < 0.5 ? -1 : 1;
        g.set(at(x), yy, x > w + l - 2 ? SUNK[2] : WEED[1 + eri(2)]);
      }
    }
    if (er() < 0.45) g.set(at(w + 1 + eri(2)), y, FOAM[eri(2)]);
  }
  return g.rows();
}

// wy_grating: an iron grating let into the deck over the hold, squares of dark under it and
// rust round its frame (1 wide, flat).
function grating() {
  edgeSeed = 1212;
  const g = new Grid(16, 16);
  g.rect(1, 1, 14, 14, IRON[1]);
  g.rect(2, 2, 12, 12, '#06090c');
  for (let i = 4; i < 14; i += 3) { g.rect(i, 2, 1, 12, IRON[2]); g.rect(2, i, 12, 1, IRON[2]); }
  g.rect(1, 1, 14, 1, IRON[3]);
  g.rect(1, 14, 14, 1, IRON[0]);
  for (let i = 0; i < 7; i++) g.set(1 + eri(14), er() < 0.5 ? 1 + eri(2) : 13 + eri(2), RUST[1 + eri(2)]);
  g.set(0, 9, RUST[1]); g.set(15, 4, RUST[1]); g.set(9, 15, RUST[0]);
  g.outline('rgba(10, 14, 18, 0.6)');
  return g.rows();
}

// wy_scupper: a drain slot in the foot of the bulwark where the sea runs off the deck, and the
// rust it has left in a long stain across the plates (1 wide, flat; on the deck tile under the
// rail or wall).
function scupper() {
  edgeSeed = 3434;
  const g = new Grid(16, 16);
  for (let y = 2; y < 15; y++) {
    const w = 2 + Math.floor(y / 3);
    for (let x = 8 - w; x <= 8 + w; x++) {
      if (er() < 0.45 + y * 0.03) continue;
      g.set(x, y, y < 6 ? 'rgba(130, 60, 30, 0.75)' : y < 10 ? 'rgba(130, 64, 32, 0.5)' : 'rgba(120, 70, 40, 0.3)');
    }
  }
  g.rect(5, 0, 6, 2, '#0a0c0e');
  g.rect(5, 2, 6, 1, RUST[1]);
  g.line(7, 3, 6, 9, 'rgba(60, 110, 100, 0.55)'); g.line(9, 3, 10, 7, 'rgba(60, 110, 100, 0.45)');
  return g.rows();
}

// wy_cargo_spill: a crate burst and a sack split where they fell: beans spilled in a fan, the
// broken slats, a tin rolled off on its own (2 wide, flat).
function cargoSpill() {
  edgeSeed = 7272;
  const g = new Grid(32, 16);
  // The sack, on its side, split.
  g.oval(9, 8, 6, 4, SACK[1]);
  g.oval(8, 7, 4, 2, SACK[2]);
  g.set(6, 6, SACK[3]); g.line(5, 10, 12, 11, SACK[0]); g.rect(3, 5, 2, 2, SACK[0]); g.set(3, 4, SACK[2]);
  g.outline(OUT);
  // The beans, fanned out.
  for (let i = 0; i < 40; i++) {
    const a = -0.6 + er() * 1.4, r = 4 + er() * 12;
    g.set(15 + Math.cos(a) * r, 9 + Math.sin(a) * r * 0.45, er() < 0.5 ? '#6a4a2a' : '#9a7448');
  }
  // Slats.
  g.thick(18, 3, 25, 1, 2, WOOD[2]); g.line(18, 2, 25, 0, WOOD[3]);
  g.thick(23, 13, 30, 14, 2, WOOD[1]); g.set(27, 13, IRON[3]);
  // The tin.
  g.rect(28, 5, 3, 4, IRON[2]); g.rect(28, 5, 3, 1, IRON[3]); g.set(30, 8, RUST[2]);
  return g.rows();
}

// wy_rail_shadow: the dark the bulwark throws on the deck under it, deepest by the rail and
// thinning out raggedly (3 wide, flat; lay along the first row of deck under a rail).
function railShadow(seed = 6161) {
  edgeSeed = seed;
  const g = new Grid(48, 10);
  for (let x = 0; x < 48; x++) {
    const fadeIn = Math.min(1, Math.min(x, 47 - x) / 6);
    const h = Math.round((3 + eri(3)) * fadeIn + 1);
    for (let y = 0; y < h; y++) g.set(x, y, `rgba(4, 10, 10, ${(0.42 * fadeIn * (1 - y / (h + 1))).toFixed(2)})`);
  }
  return g.rows();
}

// wy_chain_pile: a heap of rusted anchor chain dropped on the deck (1 wide, flat).
function chainPile() {
  edgeSeed = 4646;
  const g = new Grid(16, 12);
  const link = (x, y, flip) => {
    if (flip) { g.rect(x, y, 2, 4, IRON[1]); g.set(x, y, IRON[3]); g.set(x + 1, y + 1, '#0a0c0e'); g.set(x + 1, y + 2, '#0a0c0e'); }
    else { g.rect(x, y, 4, 2, IRON[2]); g.set(x, y, IRON[3]); g.set(x + 1, y + 1, '#0a0c0e'); g.set(x + 2, y + 1, '#0a0c0e'); }
  };
  for (let i = 0; i < 16; i++) {
    const a = i * 0.9, r = 1 + i * 0.32;
    link(Math.round(7 + Math.cos(a) * r * 1.3) - 1, Math.round(6 + Math.sin(a) * r * 0.7) - 1, i % 2);
  }
  for (let i = 0; i < 6; i++) g.set(2 + eri(12), 2 + eri(8), RUST[2]);
  g.outline(OUT);
  // The chain going off out of the heap.
  for (let x = 13; x < 16; x++) g.set(x, 9 + (x % 2), IRON[1]);
  return g.rows();
}

// wy_hammock: a canvas hammock slung along a bulkhead between two iron hooks, sagging, a grey
// blanket left in it (2 wide; it hangs on a wall tile).
function hammock() {
  edgeSeed = 5858;
  const g = new Grid(32, 16);
  // The hooks, screwed into the plate.
  g.rect(1, 2, 3, 3, IRON[1]); g.set(2, 3, IRON[3]); g.rect(28, 2, 3, 3, IRON[1]); g.set(29, 3, IRON[3]);
  // The clews (the cords fanning out from each hook).
  for (let i = 0; i < 4; i++) { g.line(3, 4, 7, 5 + i * 1.5, ROPE[1]); g.line(28, 4, 24, 5 + i * 1.5, ROPE[1]); }
  // The canvas, sagging.
  for (let x = 7; x <= 24; x++) {
    const s = Math.round(Math.sin(((x - 7) / 17) * Math.PI) * 3);
    g.rect(x, 5 + s, 1, 6, '#a29a84');
    g.set(x, 5 + s, '#c4bca4');
    g.set(x, 10 + s, '#605848');
  }
  // The blanket in it.
  g.poly([[11, 8], [19, 7], [21, 11], [12, 12]], '#5a6268');
  g.line(11, 8, 19, 7, '#7a848a');
  g.outline(OUT);
  return g.rows();
}

// wy_bilge_slick: black bilge water spreading out over the plates from a hole, with an oily
// sheen on it (2 wide, flat; lay it on the deck round a square of water to give it a shape).
function bilgeSlick(seed = 1919) {
  edgeSeed = seed;
  const g = new Grid(32, 14);
  const pts = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * 6.2832;
    pts.push([16 + Math.cos(a) * (11 + eri(4)), 7 + Math.sin(a) * (4 + eri(2))]);
  }
  g.poly(pts, SLICK[0]);
  g.poly(pts.map(([x, y]) => [16 + (x - 16) * 0.8, 7 + (y - 7) * 0.7]), SLICK[1]);
  g.line(9, 5, 20, 4, SLICK[3]); g.line(14, 9, 22, 8, SLICK[2]);
  g.set(11, 6, '#6a5a8a'); g.set(12, 6, '#5a7a6a'); g.set(19, 5, '#7a6a4a');
  g.outline('rgba(6, 16, 16, 0.6)');
  return g.rows();
}

// wy_rock_cleft: a way out through a west-facing cliff, seen from above and to the south (the Watch Rock's way
// back into the cave under the point). Not a doorway: a split in the rock that the shelf runs into. The tiles
// give the rock round it (the cliff's face above, its top below); this lays the dark over them: the floor going
// on into black toward the room's west edge, the cleft's north wall falling into its own shadow, the overhang's
// shadow across the floor, wet on the floor catching the last of the light, a few stones fallen at the mouth,
// weed at the wall's foot and a drip running down it. Flat, walkable, 3 wide x 3 high: put it on the floor tile
// of the cleft at the room's edge (the door), with the face tiles (W) above it and clifftop (#) below.
function rockCleft() {
  const g = new Grid(48, 48);
  const dark = (a) => `rgba(2, 6, 7, ${a.toFixed(2)})`;
  const step = (a) => Math.round(Math.max(0, Math.min(1, a)) * 8) / 8;
  edgeSeed = 4471;
  // The cleft's north wall (the face above the floor): darker toward the inside (west) and down toward the floor.
  for (let y = 4; y < 32; y++) {
    for (let x = 0; x < 48; x++) {
      const a = step(Math.pow(Math.max(0, (42 - x) / 42), 0.8) * 0.9 + Math.max(0, (y - 10) / 22) * 0.45 - ((x + y) % 2 ? 0 : 0.06));
      if (a > 0.05) g.set(x, y, dark(Math.min(0.9, a)));
    }
  }
  // The floor running in: black at the west edge, opening out toward the shelf; the overhang's shadow along the top.
  for (let y = 32; y < 48; y++) {
    const lip = y < 36 + ((y * 7) % 3) ? 0.35 : 0;
    for (let x = 0; x < 48; x++) {
      const ragged = ((x * 13 + y * 5) % 7) / 40;
      const a = step((x < 14 ? 1 : Math.pow(Math.max(0, (47 - x) / 33), 0.7)) * 0.97 + lip - ragged + (y > 45 ? 0.1 : 0));
      // (The far lip's broken edge shows through at the bottom: the dark thins out raggedly there.)
      const thin = y >= 41 + ((x * 7 + (x >> 2)) % 5) ? 0.4 : 1;
      if (a * thin > 0.05) g.set(x, y, dark(Math.min(0.96, step(a * thin))));
    }
  }
  // The very back: no light at all.
  for (let y = 26; y < 48; y++) g.rect(0, y, 7 + ((y * 5) % 4), 1, '#020607');
  // A puddle in the mouth catching the last of the light from the shelf, and the wet going on in.
  g.oval(33, 40, 5, 1, 'rgba(20, 44, 46, 0.7)');
  g.rect(30, 39, 5, 1, 'rgba(150, 196, 186, 0.32)');
  g.set(36, 41, 'rgba(150, 196, 186, 0.2)');
  g.rect(19, 41, 3, 1, 'rgba(150, 196, 186, 0.12)');
  // A few stones fallen at the mouth, half in the shadow.
  const stone = (x, y, w, h) => {
    g.oval(x + 1, y + 1, w, h, 'rgba(2, 8, 8, 0.5)');
    g.oval(x, y, w, h, IROCK[1]);
    g.rect(x - w + 1, y - h, w * 2 - 1, 1, IROCK[3]);
    g.set(x - w, y - h + 1, IROCK[2]);
    g.rect(x - w + 2, y + h, w * 2 - 2, 1, IROCK[0]);
  };
  stone(42, 45, 3, 2);
  stone(46, 41, 1, 1);
  stone(37, 46, 1, 1);
  stone(25, 45, 2, 1);
  return g.rows();
}

export const WY_PALETTE = palette;
export const WY_GHOST_COOK_SPRITES = { f1: ghostCook(0), f2: ghostCook(1), f3: ghostCook(2), f4: ghostCook(3) };
export const WY_FLOOD_SPRITES = { f1: flood(0), f2: flood(1), f3: flood(2), f4: flood(3) };

export const WY_PROP_SPRITES = {
  wy_ghost_cook: WY_GHOST_COOK_SPRITES.f1,
  wy_pump: pump(false),
  wy_pump_on: pump(true),
  wy_flood: WY_FLOOD_SPRITES.f1,
  wy_pot: pot(true),
  wy_pot_empty: pot(false),
  wy_hull_hole: hullHole(),
  wy_hatch: hatch(),
  wy_mainmast: mainmast(),
  wy_mast_tip: mastTip(),
  wy_crew_table: crewTable(),
  wy_steps_water: stepsWater(),
  wy_steps_rock: stepsWater(IROCK),
  wy_coping_fallen: copingFallen(),
  wy_coping_fallen_b: copingFallen(MSTONE, 2290),
  wy_rocks_fallen: copingFallen(IROCK, 3381),
  wy_block_sunk: blockSunk(),
  wy_rock_sunk: blockSunk(IROCK, 977),
  wy_timber_sunk: timberSunk(),
  wy_weed_mat: weedMat(),
  wy_weed_mat_b: weedMat(6403),
  wy_weed_fringe: weedFringe(),
  wy_weed_fringe_b: weedFringe(8115),
  wy_mooring_post: mooringPost(),
  wy_cart_drowned: cartDrowned(),
  wy_boat_swamped: boatSwamped(),
  wy_plank_slick: plankSlick(),
  wy_scorch_line: scorchLine(1),
  wy_scorch_line_b: scorchLine(2),
  wy_plank_slick_b: plankSlick(4242),
  wy_mast_fallen: mastFallen(),
  wy_bow_broken: bowBroken(),
  wy_ribs_jag: ribsJag(),
  wy_ribs_jag_b: ribsJag(1357),
  wy_barnacle_band: barnacleBand(),
  wy_barnacle_band_b: barnacleBand(9753),
  wy_edge_l: edgeSide(false, 6611),
  wy_edge_r: edgeSide(true, 7722),
  wy_grating: grating(),
  wy_scupper: scupper(),
  wy_cargo_spill: cargoSpill(),
  wy_rail_shadow: railShadow(),
  wy_rail_shadow_b: railShadow(2727),
  wy_chain_pile: chainPile(),
  wy_hammock: hammock(),
  wy_bilge_slick: bilgeSlick(),
  wy_bilge_slick_b: bilgeSlick(5353),
  wy_rock_cleft: rockCleft(),
};

export const WY_FOOTPRINTS = { wy_crew_table: 4, wy_scorch_line: 2, wy_scorch_line_b: 2, wy_rock_cleft: 3 };

