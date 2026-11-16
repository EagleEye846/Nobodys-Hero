// Props for Chapter 6's Ash Road: the ash heaps Ves blows (ar_drift, _mid, _big),
// the wind post that lays them back, cairns with a red rag (the road's markers,
// seen through an ash storm), milestones and signposts of the old road, a cart
// burnt on its side, a boat left on the bare seabed, the head of the carved
// boat-slip, a burnt farmhouse, the buried town's gate, and little things: a
// skull, dried weed, one green shoot. Drawn like wreckYard.js (a tiny painter,
// 16 pixels to a tile, standing on the bottom edge and centred over the
// footprint). Every id starts `ar_`.

const colors = new Map();
const palette = {};
function char(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0xd000 + colors.size);
    colors.set(hex, c);
    palette[c] = hex;
  }
  return colors.get(hex);
}

export class Grid {
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

// A tiny deterministic roll, so a sprite looks the same every time.
export const roll = (n) => {
  const x = Math.sin(n * 91.7 + 13.3) * 43758.5453;
  return x - Math.floor(x);
};

export const OUT = '#1a1614';
export const ASH = ['#5e5a55', '#74706b', '#8b8782', '#a6a29b', '#c9c5bd'];
export const CHAR = ['#0e0c0b', '#1e1816', '#2e2622', '#45382f'];
export const STONE = ['#2e2a28', '#4a4440', '#625b55', '#7e7770', '#9a938a'];
export const RAG = ['#5a1a16', '#8a2a20', '#b0402c'];
export const WOOD = ['#2a201a', '#45362a', '#64503c', '#806a50'];
export const SAND = ['#6a5a42', '#8c7656', '#a8916e', '#c2ab86'];
export const HOT = ['#8a2a0c', '#e0601a', '#ffc04a'];

// --- Ash heaps: soft mounds, ripples blown into the windward side, flakes on top. ---
function heap(w, h, seed) {
  // Fresh, paler than the ground it lies on, so it reads as a heap and not a stain.
  const BODY = '#b2aea6';
  const TOP = '#d2cec6';
  const LEE = '#97938c';
  const g = new Grid(w, h + 2);
  const cx = Math.floor(w / 2);
  const base = h + 1;
  for (let x = 0; x < w; x++) {
    const d = Math.abs(x - cx) / (w / 2);
    const top = Math.round(base - (h - 1) * Math.sqrt(Math.max(0, 1 - d * d)) - (x < cx ? roll(seed + x) * 1.2 : 0));
    for (let y = top; y <= base; y++) g.set(x, y, x > cx + 1 ? LEE : BODY);
    g.set(x, top, TOP);
    if (x < cx && roll(seed + x * 3) < 0.5) g.set(x, top + 1, TOP);
  }
  // Wind ripples across the windward face, flakes, and a charred stick in the big ones.
  for (let i = 0; i < Math.floor(w / 3); i++) {
    const x = 2 + Math.floor(roll(seed + 50 + i) * (w - 4));
    const y = base - 2 - Math.floor(roll(seed + 70 + i) * Math.max(1, h - 4));
    if (g.get(x, y)) { g.set(x, y, '#e4e0d8'); g.set(x + 1, y, LEE); }
  }
  if (w > 18) g.line(cx - 4, base - h + 3, cx - 7, base - h - 1, CHAR[1]);
  g.outline('#5a5650');
  // Its shadow on the ground.
  g.rect(1, base + 1, w - 2, 1, 'rgba(0, 0, 0, 0.3)');
  return g.rows();
}

// --- The wind post: a road post with a long rag tied at the top, streaming. ---
function windpost(frame) {
  const g = new Grid(20, 32);
  g.rect(8, 6, 3, 26, CHAR[1]);
  g.rect(9, 6, 1, 26, WOOD[1]);
  g.rect(7, 29, 5, 3, CHAR[1]);
  g.set(9, 5, CHAR[1]);
  // A cross-bar with a notch, and ash on it.
  g.rect(5, 10, 9, 2, CHAR[1]);
  g.rect(5, 10, 9, 1, WOOD[2]);
  g.rect(6, 9, 4, 1, ASH[3]);
  // The rag, knotted round the top, streaming one way in waves.
  g.rect(8, 7, 3, 2, RAG[0]);
  const wave = frame === 0 ? [0, 1, 1, 0, -1, -1, 0, 1] : [1, 1, 0, -1, -1, 0, 1, 1];
  for (let i = 0; i < 8; i++) {
    const y = 7 + wave[i] + Math.floor(i / 3);
    g.rect(11 + i, y, 1, 3 - Math.floor(i / 4), i < 3 ? RAG[2] : i < 6 ? RAG[1] : RAG[0]);
  }
  return g.rows();
}

// --- A cairn of the old road: stacked stones and a stick with a red rag. ---
function cairn() {
  const g = new Grid(16, 24);
  g.oval(8, 20, 6, 3, STONE[1]);
  g.oval(8, 15, 5, 3, STONE[2]);
  g.oval(7, 11, 4, 2, STONE[1]);
  g.oval(8, 8, 3, 2, STONE[2]);
  for (const [x, y] of [[5, 19], [9, 14], [6, 10], [8, 7]]) g.rect(x, y, 3, 1, STONE[3]);
  g.rect(3, 22, 10, 1, STONE[0]);
  // Ash settled on each stone.
  for (const [x, y, w] of [[4, 17, 4], [6, 12, 3], [6, 9, 2]]) g.rect(x, y, w, 1, ASH[3]);
  // The stick and the rag.
  g.rect(10, 1, 1, 9, WOOD[1]);
  g.rect(11, 2, 3, 2, RAG[2]);
  g.rect(12, 4, 2, 1, RAG[1]);
  g.set(14, 3, RAG[1]);
  g.outline(OUT);
  return g.rows();
}

// --- A milestone: a rounded stone with a number cut in it, sunk in ash. ---
function milestone() {
  const g = new Grid(16, 22);
  g.rect(3, 6, 10, 15, STONE[2]);
  g.oval(8, 6, 5, 4, STONE[2]);
  g.rect(3, 6, 2, 15, STONE[3]);
  g.rect(11, 6, 2, 15, STONE[1]);
  // The carved number and the line under it (a shape, not a real figure).
  g.rect(6, 8, 4, 1, STONE[0]);
  g.rect(9, 9, 1, 2, STONE[0]);
  g.rect(6, 11, 4, 1, STONE[0]);
  g.rect(6, 12, 1, 2, STONE[0]);
  g.rect(6, 14, 4, 1, STONE[0]);
  g.rect(5, 16, 6, 1, STONE[1]);
  // Soot, and ash drifted against its foot.
  g.rect(10, 4, 2, 8, CHAR[2]);
  g.rect(2, 18, 12, 3, ASH[2]);
  g.rect(3, 17, 7, 1, ASH[3]);
  g.outline(OUT);
  return g.rows();
}

// --- A signpost: two arms on a charred post, one pointing on, one hanging. ---
function signpost() {
  const g = new Grid(26, 32);
  g.rect(12, 4, 3, 28, CHAR[1]);
  g.rect(13, 4, 1, 28, WOOD[1]);
  g.rect(11, 29, 5, 3, CHAR[1]);
  // The arm pointing on: a board with a pointed end, its letters burnt off.
  g.poly([[14, 7], [23, 7], [25, 9], [23, 11], [14, 11]], WOOD[2]);
  g.rect(14, 7, 9, 1, WOOD[3]);
  g.rect(16, 9, 2, 1, CHAR[2]);
  g.rect(19, 9, 3, 1, CHAR[2]);
  g.rect(14, 11, 10, 1, CHAR[1]);
  // The other, hanging by one nail.
  g.poly([[11, 13], [4, 19], [2, 18], [3, 16], [10, 11]], WOOD[1]);
  g.line(10, 12, 4, 17, WOOD[2]);
  g.set(11, 12, STONE[3]);
  g.rect(12, 3, 3, 1, ASH[3]);
  g.rect(15, 6, 6, 1, ASH[3]);
  g.outline(OUT);
  return g.rows();
}

// --- A cart burnt on its side: the bed, one wheel up in the air. ---
function cart() {
  const g = new Grid(40, 26);
  // The bed, tipped.
  g.poly([[3, 12], [30, 8], [33, 22], [5, 24]], WOOD[1]);
  for (let i = 0; i < 5; i++) g.line(4 + i * 6, 12 - i, 6 + i * 6, 24 - i * 0.4, CHAR[1]);
  g.line(3, 12, 30, 8, WOOD[2]);
  // Burnt through in places.
  g.oval(18, 17, 3, 2, CHAR[0]);
  g.oval(26, 14, 2, 2, CHAR[0]);
  // The wheel, up.
  g.oval(32, 8, 6, 6, CHAR[1]);
  g.oval(32, 8, 4, 4, null);
  g.oval(32, 8, 1, 1, WOOD[1]);
  for (let a = 0; a < 6; a++) g.line(32, 8, 32 + Math.round(Math.cos(a) * 4), 8 + Math.round(Math.sin(a) * 4), WOOD[1]);
  // The shafts, snapped.
  g.line(4, 20, 0, 23, CHAR[1]);
  g.line(5, 22, 1, 25, CHAR[1]);
  // Ash drifted up its side.
  g.poly([[5, 25], [24, 25], [16, 19], [8, 20]], ASH[2]);
  g.rect(8, 20, 7, 1, ASH[3]);
  g.outline(OUT);
  return g.rows();
}

// --- A rowing boat on its side on the bare seabed, weed on the keel. ---
function boat() {
  const g = new Grid(44, 22);
  g.poly([[2, 13], [10, 7], [34, 6], [42, 11], [36, 19], [8, 20]], WOOD[2]);
  g.poly([[6, 14], [12, 10], [32, 9], [38, 12], [34, 16], [10, 17]], WOOD[1]);
  for (let i = 0; i < 4; i++) g.line(8, 9 + i * 3, 38, 8 + i * 3, WOOD[3]);
  g.line(10, 7, 34, 6, WOOD[3]);
  // The keel, weedy, and a hole.
  g.line(8, 20, 36, 19, '#3e4a2c');
  g.line(10, 19, 33, 18, '#5e6a3e');
  g.oval(28, 12, 2, 1, CHAR[0]);
  // Sand drifted in along the foot.
  g.poly([[1, 21], [43, 21], [36, 17], [8, 18]], SAND[2]);
  g.rect(10, 18, 20, 1, SAND[3]);
  g.outline(OUT);
  return g.rows();
}

// --- The head of the old boat-slip: worn stone, the prow of a small boat cut in it. ---
function slipProw() {
  const g = new Grid(48, 34);
  // The slip's head block.
  g.rect(4, 12, 40, 20, STONE[2]);
  g.rect(4, 12, 40, 2, STONE[3]);
  g.rect(4, 30, 40, 2, STONE[1]);
  for (let i = 0; i < 4; i++) g.rect(4 + i * 10, 14, 1, 16, STONE[1]);
  // The carved prow rising out of it, worn nearly smooth.
  g.poly([[18, 13], [24, 2], [30, 13]], STONE[3]);
  g.poly([[20, 13], [24, 5], [28, 13]], STONE[2]);
  g.line(24, 3, 24, 12, STONE[1]);
  g.line(19, 12, 29, 12, STONE[4]);
  // A ring for a rope, and weed dried white on the stone.
  g.oval(38, 20, 2, 2, STONE[0]);
  g.oval(38, 20, 1, 1, null);
  g.rect(6, 28, 12, 1, '#d8d0c0');
  g.rect(30, 27, 9, 1, '#b8b0a0');
  // Sand drifted up the foot.
  g.rect(0, 31, 48, 3, SAND[2]);
  g.rect(2, 30, 10, 1, SAND[3]);
  g.outline(OUT);
  return g.rows();
}

// --- Dried weed, lying flat. ---
function weed() {
  const g = new Grid(18, 7);
  for (let i = 0; i < 16; i++) {
    const y = 2 + Math.round(Math.sin(i * 0.9) * 1.5);
    g.set(1 + i, y + 1, '#2e3820');
    g.set(1 + i, y, i % 3 ? '#4e5a34' : '#6a7448');
  }
  g.rect(4, 5, 8, 1, '#3e4a2c');
  return g.rows();
}

// --- One green shoot through the ash. The only green for miles. ---
function shoot() {
  const g = new Grid(8, 8);
  g.rect(2, 7, 4, 1, '#74706b');
  g.rect(4, 3, 1, 4, '#4f8a4a');
  g.rect(2, 2, 2, 1, '#6aa65c');
  g.set(1, 1, '#6aa65c');
  g.rect(5, 1, 2, 1, '#6aa65c');
  g.set(6, 0, '#8ac66c');
  return g.rows();
}

// --- An old cow's skull, bleached. ---
function skull() {
  const g = new Grid(14, 9);
  g.oval(7, 5, 3, 3, '#d8d2c4');
  g.rect(5, 6, 5, 2, '#c8c2b4');
  g.set(5, 4, OUT);
  g.set(9, 4, OUT);
  g.line(4, 3, 1, 1, '#c8c2b4');
  g.line(10, 3, 13, 1, '#c8c2b4');
  g.rect(6, 8, 3, 1, '#8a847a');
  g.outline('#3a3532');
  return g.rows();
}

// --- The burnt farmhouse: four walls of blackened stone, no roof, holes for
// windows, a door gone; where its chimney stood, a gap. 4 tiles wide. ---
function farmhouse() {
  const g = new Grid(64, 50);
  // The back wall and the gable end.
  g.rect(4, 14, 56, 30, STONE[1]);
  g.poly([[4, 14], [16, 2], [28, 14]], STONE[1]);
  // Stone courses.
  for (let y = 16; y < 44; y += 4) for (let x = 4 + ((y / 4) % 2) * 3; x < 60; x += 7) g.rect(x, y, 6, 3, roll(x * 3 + y) < 0.5 ? STONE[2] : STONE[1]);
  // The broken top edge of the wall.
  for (let x = 28; x < 60; x++) {
    const drop = Math.round(roll(x) * 4 + (x > 44 ? 3 : 0));
    g.rect(x, 14, 1, drop, null);
  }
  // Soot pouring up from the windows.
  for (const wx of [12, 36]) {
    g.rect(wx, 22, 8, 9, CHAR[0]);
    g.rect(wx + 1, 23, 6, 7, '#140f0d');
    g.poly([[wx - 1, 22], [wx + 9, 22], [wx + 6, 12], [wx + 2, 12]], CHAR[2]);
    g.rect(wx, 31, 8, 1, STONE[3]);
  }
  // The door, an empty arch with ash drifted in.
  g.rect(48, 28, 8, 16, CHAR[0]);
  g.oval(52, 28, 4, 3, CHAR[0]);
  g.poly([[47, 44], [57, 44], [53, 38]], ASH[2]);
  // Where the chimney stood: a ragged gap in the gable with sky through it.
  g.rect(14, 2, 5, 14, null);
  g.rect(13, 14, 7, 2, STONE[0]);
  // A charred beam still across the top, sagging.
  g.line(6, 15, 58, 18, CHAR[1]);
  g.line(6, 16, 58, 19, CHAR[2]);
  // Ash drifted along the foot.
  g.poly([[0, 49], [64, 49], [58, 43], [40, 44], [20, 42], [6, 44]], ASH[2]);
  g.rect(8, 44, 20, 1, ASH[3]);
  g.outline(OUT);
  return g.rows();
}

// --- The farmhouse with its chimney back in its place (after the Lum): the stack
// standing in the gap of the gable, a red glow low in it. ---
function farmhouseWhole() {
  const rows = farmhouse();
  const g = new Grid(64, 50);
  // Copy the house back in (its colours by its own characters).
  const back = new Map([...colors.entries()].map(([hex, c]) => [c, hex]));
  rows.forEach((row, y) => [...row].forEach((c, x) => { if (c !== '.') g.set(x, y, back.get(c)); }));
  // The stack, brick by brick, up through the gap and above the gable.
  g.rect(13, 0, 7, 16, STONE[1]);
  for (let y = 1; y < 16; y += 3) for (let x = 13 + ((y / 3) % 2) * 2; x < 20; x += 4) g.rect(x, y, 3, 2, STONE[2]);
  g.rect(12, 0, 9, 2, STONE[3]);
  g.rect(14, 0, 5, 1, CHAR[0]);
  g.rect(13, 0, 7, 1, OUT);
  // Its hearth, low down: banked, a red glow.
  g.rect(14, 10, 5, 4, CHAR[0]);
  g.rect(15, 12, 3, 2, HOT[0]);
  g.set(16, 12, HOT[1]);
  return g.rows();
}

// --- A post by a doorway with an iron hook for a lantern, and no lantern on it.
// The ash under the hook is swept in a neat ring. ---
function hookPost() {
  const g = new Grid(16, 34);
  g.rect(3, 4, 3, 30, CHAR[1]);
  g.rect(4, 4, 1, 30, WOOD[1]);
  g.rect(2, 31, 5, 3, CHAR[1]);
  g.rect(5, 6, 7, 2, WOOD[1]);
  g.rect(5, 6, 7, 1, WOOD[2]);
  // The hook: iron, curled, rubbed bright where a handle hung.
  g.rect(10, 8, 1, 4, STONE[0]);
  g.rect(9, 12, 1, 2, STONE[0]);
  g.rect(10, 13, 2, 1, STONE[0]);
  g.set(12, 12, STONE[0]);
  g.set(10, 13, STONE[4]);
  g.rect(3, 3, 3, 1, ASH[3]);
  return g.rows();
}

// --- The buried town's gate: the top of an arch and its posts, standing up
// out of the ash, a board across with the name burnt off. 3 tiles wide. ---
function townGate() {
  const g = new Grid(56, 56);
  // Posts.
  g.rect(4, 14, 9, 40, STONE[2]);
  g.rect(43, 14, 9, 40, STONE[2]);
  for (let y = 16; y < 54; y += 5) { g.rect(4, y, 9, 1, STONE[1]); g.rect(43, y, 9, 1, STONE[1]); }
  g.rect(4, 14, 2, 40, STONE[3]);
  g.rect(43, 14, 2, 40, STONE[3]);
  // The arch.
  for (let a = 0; a <= 40; a++) {
    const t = (a / 40) * Math.PI;
    const x = 28 - Math.cos(t) * 20;
    const y = 16 - Math.sin(t) * 12;
    g.rect(Math.round(x) - 3, Math.round(y) - 2, 6, 5, STONE[2]);
    g.set(Math.round(x), Math.round(y) - 2, STONE[3]);
  }
  // The board, its letters burnt away, hung on two chains from the arch.
  g.line(18, 8, 18, 18, STONE[0]);
  g.line(38, 8, 38, 18, STONE[0]);
  g.rect(15, 18, 26, 7, WOOD[1]);
  g.rect(15, 18, 26, 1, WOOD[2]);
  for (const x of [18, 22, 27, 31, 35]) g.rect(x, 20, 2, 3, CHAR[1]);
  // Soot up the arch, ash on every ledge.
  g.rect(20, 3, 16, 2, CHAR[2]);
  g.rect(4, 13, 9, 1, ASH[3]);
  g.rect(43, 13, 9, 1, ASH[3]);
  g.rect(10, 6, 6, 1, ASH[3]);
  g.rect(40, 6, 6, 1, ASH[3]);
  // Ash up to the posts' knees.
  g.poly([[0, 56], [56, 56], [52, 44], [44, 46], [12, 46], [4, 44]], ASH[2]);
  g.rect(6, 45, 8, 1, ASH[3]);
  g.rect(42, 45, 8, 1, ASH[3]);
  g.outline(OUT);
  return g.rows();
}

// --- A roof of the buried town, just its ridge and a chimney pot above the ash. ---
function buriedRoof() {
  const g = new Grid(40, 20);
  g.poly([[2, 18], [10, 6], [32, 6], [38, 18]], '#3a2a24');
  for (let y = 8; y < 18; y += 2) g.line(4 + (18 - y) * 0.6, y, 36 - (18 - y) * 0.2, y, '#2a1e1a');
  g.line(10, 6, 32, 6, '#5a4434');
  g.rect(26, 0, 4, 7, STONE[1]);
  g.rect(25, 0, 6, 1, STONE[2]);
  g.poly([[0, 20], [40, 20], [36, 15], [4, 16]], ASH[2]);
  g.rect(10, 6, 22, 1, ASH[3]);
  g.outline(OUT);
  return g.rows();
}

// --- A heap of burnt rubble with a beam in it (blocks a tile). ---
function rubbleHeap() {
  const g = new Grid(18, 16);
  g.oval(9, 11, 8, 4, CHAR[2]);
  for (let i = 0; i < 7; i++) g.rect(2 + Math.floor(roll(i) * 12), 7 + Math.floor(roll(i + 9) * 6), 3, 2, roll(i + 3) < 0.5 ? STONE[1] : STONE[2]);
  g.line(1, 13, 16, 4, CHAR[1]);
  g.line(1, 14, 16, 5, WOOD[1]);
  g.rect(5, 6, 5, 1, ASH[3]);
  g.outline(OUT);
  return g.rows();
}

// --- A cold fire ring where someone camped, long ago. Flat. ---
function oldFire() {
  const g = new Grid(16, 10);
  for (let a = 0; a < 8; a++) g.rect(7 + Math.round(Math.cos(a * 0.785) * 6) - 1, 5 + Math.round(Math.sin(a * 0.785) * 3) - 1, 3, 2, STONE[2]);
  g.oval(8, 5, 3, 1, CHAR[1]);
  g.rect(6, 4, 4, 1, CHAR[2]);
  return g.rows();
}

// --- A hot vent: a ring of cracked stone with heat shimmer and a red heart. ---
function emberHeart(frame) {
  const g = new Grid(14, 10);
  g.oval(7, 5, 6, 3, STONE[0]);
  g.oval(7, 5, 4, 2, CHAR[0]);
  g.oval(7, 5, 2, 1, HOT[frame % 2]);
  g.set(7, 5, HOT[2]);
  return g.rows();
}

export const AR_PALETTE_EXTRA = palette;
export const AR_PALETTE = palette;

export const AR_PROP_SPRITES = {
  ar_drift: heap(16, 12, 1),
  ar_drift_mid: heap(20, 15, 7),
  ar_drift_big: heap(24, 18, 13),
  ar_windpost: windpost(0),
  ar_cairn: cairn(),
  ar_milestone: milestone(),
  ar_signpost: signpost(),
  ar_cart: cart(),
  ar_boat: boat(),
  ar_slip_prow: slipProw(),
  ar_weed: weed(),
  ar_shoot: shoot(),
  ar_skull: skull(),
  ar_farmhouse: farmhouse(),
  ar_farmhouse_whole: farmhouseWhole(),
  ar_hook_post: hookPost(),
  ar_town_gate: townGate(),
  ar_buried_roof: buriedRoof(),
  ar_rubble: rubbleHeap(),
  ar_old_fire: oldFire(),
  ar_ember_heart: emberHeart(0),
};

// The rag on the wind post streams, and the ember heart breathes.
export const AR_WINDPOST_SPRITES = { f1: windpost(0), f2: windpost(1) };
export const AR_EMBER_HEART_SPRITES = { f1: emberHeart(0), f2: emberHeart(1) };

export const AR_FOOTPRINTS = { ar_cart: 2, ar_boat: 2, ar_slip_prow: 3, ar_farmhouse: 4, ar_farmhouse_whole: 4, ar_town_gate: 3, ar_buried_roof: 2 };
