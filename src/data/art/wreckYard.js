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
};

export const WY_FOOTPRINTS = { wy_crew_table: 4 };

