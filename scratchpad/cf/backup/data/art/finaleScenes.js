// Art for the end of Chapter 4 (rumbolds_duel's aftermath, the_hall_falls and
// bramble_and_the_log): every moment of the collapse that has its own frames,
// so it plays as real animation rather than a sprite swap. All of it is
// scene art (cutscene actors playing `anim:` looks, and the hero's own
// `animate`); nothing here is a room prop. They all share FINALE_PALETTE.
//
//   finale_pillar_crack   a crack running up a carved pillar, glowing from
//                         inside, growing over 4 frames (16x48, transparent:
//                         laid over a pillar tile, feet on the tile's bottom)
//   finale_arch           the hall's great doorway (144x64): the lintel
//                         whole, cracking, then gone (the hero has it)
//   finale_arch_fail      the posts cracking while it's held, more light and grit
//   finale_arch_drop      they let go: the lintel dropping (play `once`)
//   finale_arch_jam       the log rammed in under the lintel, high, shoving it
//                         back up: it settles onto the log, creaks, holds
//   finale_pot_lid        the pot lid lying on the floor, rattling (4 frames, 22x11)
//   finale_pot_lid_fall   it slips off him, clangs and rocks flat (24x40, `once`)
//   finale_hero_roll      the dive-roll for the lid and up with it (8 frames, 152x56, `once`)
//   finale_hero_brace_in  the lintel dropping onto the lid he holds over his head:
//                         catch, buckle, heave (152x56: the lintel is drawn in his
//                         frames, resting on the lid's knob)
//   finale_hero_strain    holding it, the lid wobbling, sweat flying (4 frames, loop)
//   finale_hero_slip      the lid tips, his knees go, he heaves it back up (`once`)
//   finale_hero_whistle   one hand on the lid, the other at his mouth with
//                         Bramble's whistle (4 frames, loop)
//   finale_hero_dive      diving out of the log's way, flat on the floor (`once`)
//   finale_ves_hold       Ves with her open umbrella wedged under the high end,
//                         the shaft bowing more and more (5 frames, 40x48; play `once`)
//   finale_ves_dive       Ves diving clear (`once`)
//   finale_ves_bent       afterwards: the umbrella hangs from her hand like a
//                         noodle (2 frames)
//   finale_tunnel         the rock at the head of the hall bursting open on a
//                         dark tunnel (4 frames, 96x48)
//   finale_log_roll       the huge log (72 wide) rolling (4 frames)
//   finale_log_ride       Bramble riding it, hatchet up, hair flying (4 frames, 72x54)
//   finale_bramble_fly    Bramble spinning through the air (8 frames, 32x32)
//   finale_bramble_splat  face down: SQUASHED flat, popping back tall, settling
//                         (6 frames, 40x32; play `once`; ends at rest)
//   finale_puff           the dust cloud that goes up where he lands (6 frames, 44x24; `once`)
//   finale_face_print     the face-shaped dent he leaves in the dirt (2 frames, lies flat)
//   finale_bramble_up     lifting his head, then sitting up (3 frames, 28x28; `once`)
//   finale_bump           the lump of fallen roof the log hits (whole, then smashed; `once`)
//   finale_planks         King Peptup beaten: a heap of painted planks and the crown
//   finale_bramble_thumbs sitting there with a dirty face and a proud thumbs-up (2 frames, loop)
//   finale_rope_hero / _ves / _bramble  each of you from behind, hand over hand
//                         up the Long Rope: a 4-frame climb, plus _hang (2) and
//                         _ready (2) (src/overworld/ropeClimb.js; 26x30)
//   finale_bramble_cart_side / _down / _up  Bramble hanging on the back of a
//                         mine cart, legs flailing (3 frames each; src/overworld/carts.js)
//
// Drawn with a few shape helpers (Grid), borrowing the hero's, Ves's and
// Bramble's own figures (remapped into one palette) wherever they appear.

import { VES_PALETTE, VES_FRAMES } from './vesper.js';
import { BRAMBLE_PALETTE, BRAMBLE_PROP_SPRITES, BRAMBLE_FRAMES } from './bramble.js';
import { PLAYER_PALETTE, PLAYER_SPRITES } from './player.js';

// --- A tiny painter ---------------------------------------------------
const colors = new Map();
const palette = {};
function P(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0x3000 + colors.size);
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
    x = Math.round(x);
    y = Math.round(y);
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

  // Draws a character grid onto this one at (ox, oy); '.' is clear.
  paste(rows, ox, oy) {
    rows.forEach((row, y) => [...row].forEach((c, x) => { if (c !== '.') this.set(ox + x, oy + y, c); }));
  }

  // A one-pixel outline round everything drawn (not round the outline itself).
  outline(c) {
    const edge = [];
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        if (this.cells[y][x]) continue;
        for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
          const n = this.get(x + dx, y + dy);
          if (n && n !== c) {
            edge.push([x, y]);
            break;
          }
        }
      }
    }
    for (const [x, y] of edge) this.set(x, y, c);
  }

  rows() {
    return this.cells.map((row) => row.map((cell) => cell ?? '.').join(''));
  }
}

// Little deterministic dice, so every redraw of the file gives the same art.
function dice(start) {
  let seed = start;
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

// Another character set's rows, in this file's colours.
function remap(rows, pal) {
  return rows.map((row) => [...row].map((c) => (c === '.' ? '.' : pal[c] ? P(pal[c]) : '.')).join(''));
}

// Rows blown up or shrunk (nearest pixel) to a new size.
function resize(rows, w, h) {
  const sw = rows[0].length;
  const sh = rows.length;
  const g = new Grid(w, h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const c = rows[Math.min(sh - 1, Math.floor((y * sh) / h))][Math.min(sw - 1, Math.floor((x * sw) / w))];
    if (c !== '.') g.set(x, y, c);
  }
  return g.rows();
}

// Rows turned by an angle (radians) about their middle, onto a square canvas.
function rotate(rows, angle, size) {
  const sw = rows[0].length;
  const sh = rows.length;
  const g = new Grid(size, size);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const dx = x - size / 2 + 0.5;
    const dy = y - size / 2 + 0.5;
    const sx = Math.floor(dx * cos + dy * sin + sw / 2);
    const sy = Math.floor(-dx * sin + dy * cos + sh / 2);
    if (sx < 0 || sy < 0 || sx >= sw || sy >= sh) continue;
    const c = rows[sy][sx];
    if (c !== '.') g.set(x, y, c);
  }
  return g.rows();
}

const OUT = P('#120c1c');
const NONE = null;

// --- The stone, the timber and the dust ----------------------------------
const STONE = P('#5c5468');
const STONE_LIT = P('#7e748c');
const STONE_DK = P('#3c3448');
const STONE_VDK = P('#241e30');
const MORTAR = P('#2e2838');
const CRYSTAL = P('#7ad8d0');
const GLOW = P('#fff4b8');
const GLOW_HOT = P('#ffffff');
const GLOW_MID = P('#ffd870');
const WOOD = P('#8a5a32');
const WOOD_LIT = P('#b8804a');
const WOOD_DK = P('#5a3a1e');
const BARK_DK = P('#3e2614');
const RING = P('#e4be80');
const RING_DK = P('#a87a44');
const DUST = P('#d8c8a8');
const DUST_MID = P('#b8a684');
const DUST_DK = P('#8a7a5e');
// The hall's bricks (its end wall, and the wall over the great doorway).
const BRICK = P('#7d6d5e');
const BRICK_LIT = P('#9a8a74');
const BRICK_DK = P('#55473b');

// =====================================================================
// 1. A crack running up a pillar
// =====================================================================
// 16x48: lay it over a carved pillar tile (the pillar's body is 8 wide, from
// row 7 to row 40 of this). Glowing from inside, longer and wider each frame.
function pillarCrack(stage) {
  const g = new Grid(16, 48);
  const roll = dice(41);
  const reach = [8, 15, 26, 33][stage];
  const lit = [GLOW_MID, GLOW, GLOW, GLOW_HOT][stage];
  let x = 7;
  const path = [];
  for (let y = 36; y > 40 - reach - 4; y--) {
    path.push([x, y]);
    if (roll() > 0.55) x += roll() > 0.5 ? 1 : -1;
    x = Math.max(5, Math.min(10, x));
  }
  for (const [px, py] of path) {
    g.set(px, py, stage >= 2 ? GLOW_MID : OUT);
    g.set(px + 1, py, stage >= 1 ? OUT : null);
    if (stage >= 2) g.set(px - 1, py, OUT);
  }
  // The light inside.
  for (const [px, py] of path) g.set(px, py, lit);
  if (stage >= 2) path.forEach(([px, py], i) => { if (i % 2) g.set(px + 1, py, GLOW_MID); });
  // Side cracks, branching off.
  if (stage >= 1) {
    for (const k of [0.35, 0.65]) {
      const [bx, by] = path[Math.floor(path.length * k)];
      const dir = k < 0.5 ? -1 : 1;
      for (let i = 1; i <= 2 + stage; i++) g.set(bx + dir * i, by - Math.floor(i / 2), i % 2 ? lit : OUT);
    }
  }
  // Chips and sparks falling off it.
  if (stage >= 2) {
    g.rect(11, 42, 2, 2, STONE_LIT);
    g.set(3, 44, STONE_DK);
    g.set(12, 39, GLOW_HOT);
  }
  if (stage >= 3) {
    g.rect(3, 40, 3, 3, STONE_LIT);
    g.rect(2, 41, 1, 1, OUT);
    g.set(13, 30, GLOW_HOT);
    g.set(2, 22, GLOW_HOT);
    g.set(12, 12, GLOW_HOT);
  }
  return g.rows();
}
export const FINALE_PILLAR_CRACK_SPRITES = { c0: pillarCrack(0), c1: pillarCrack(1), c2: pillarCrack(2), c3: pillarCrack(3) };

// =====================================================================
// 2. The log (the huge one)
// =====================================================================
const LOG_W = 72;
const LOG_H = 24;

// Draws the log into `g` with its top-left at (ox, oy). `phase` 0 to 3 is how
// far round it has turned: the bark grooves slide down the front.
function drawLog(g, ox, oy, phase) {
  const roll = dice(7);
  // The body: a long drum, lit from above.
  g.rect(ox + 4, oy + 1, LOG_W - 8, LOG_H - 2, OUT);
  g.rect(ox + 3, oy + 3, LOG_W - 6, LOG_H - 6, OUT);
  g.rect(ox + 5, oy + 2, LOG_W - 10, 5, WOOD_LIT);
  g.rect(ox + 5, oy + 7, LOG_W - 10, 9, WOOD);
  g.rect(ox + 5, oy + 16, LOG_W - 10, 6, WOOD_DK);
  g.rect(ox + 4, oy + 3, LOG_W - 8, 3, WOOD_LIT);
  g.rect(ox + 4, oy + 6, LOG_W - 8, 10, WOOD);
  g.rect(ox + 4, oy + 16, LOG_W - 8, 5, WOOD_DK);
  // Grooves in the bark, running along it, sliding with the turn.
  for (let i = -1; i < 7; i++) {
    const y = oy + 2 + i * 4 + phase;
    if (y < oy + 2 || y > oy + LOG_H - 4) continue;
    const dark = y > oy + 15 ? OUT : BARK_DK;
    let x = ox + 6;
    const seed = dice(100 + i + 20);
    while (x < ox + LOG_W - 8) {
      const run = 5 + Math.floor(seed() * 10);
      for (let k = 0; k < run && x + k < ox + LOG_W - 7; k++) g.set(x + k, y, dark);
      x += run + 2 + Math.floor(seed() * 4);
    }
  }
  // A knot or two (they stay with the bark: they slide too).
  for (const [kx, ky] of [[22, 4], [50, 9], [38, 1]]) {
    const y = oy + ((ky + phase * 1) % 17) + 3;
    g.set(ox + kx, y, BARK_DK);
    g.set(ox + kx + 1, y, BARK_DK);
    g.set(ox + kx, y + 1, WOOD_LIT);
  }
  // A stub of branch on top.
  g.rect(ox + 56, oy + 0, 4, 3, OUT);
  g.rect(ox + 57, oy + 1, 2, 2, WOOD_DK);
  // The left end, sawn flat: pale rings.
  g.oval(ox + 4, oy + 12, 4, 10, OUT);
  g.oval(ox + 4, oy + 12, 3, 9, RING);
  g.oval(ox + 4, oy + 12, 2, 6, RING_DK);
  g.oval(ox + 4, oy + 12, 1, 3, RING);
  g.set(ox + 4, oy + 12, RING_DK);
  // The right end, round and bark-covered.
  g.oval(ox + LOG_W - 5, oy + 12, 3, 9, WOOD_DK);
  g.set(ox + LOG_W - 3, oy + 8, OUT);
  // A few bits of moss and leaf.
  g.set(ox + 30, oy + 3, P('#58a848'));
  g.set(ox + 31, oy + 3, P('#58a848'));
  g.set(ox + 44, oy + 2, P('#58a848'));
  void roll;
}

function logRoll(phase) {
  const g = new Grid(LOG_W, LOG_H);
  drawLog(g, 0, 0, phase);
  return g.rows();
}
export const FINALE_LOG_ROLL_SPRITES = { r0: logRoll(0), r1: logRoll(1), r2: logRoll(2), r3: logRoll(3) };

// =====================================================================
// 3. Bramble riding it
// =====================================================================
const BRAMBLE_ROWS = (name) => remap(BRAMBLE_PROP_SPRITES[name], BRAMBLE_PALETTE);

function logRide(phase) {
  const w = LOG_W;
  const h = 54;
  const g = new Grid(w, h);
  const roll = dice(60 + phase);
  // Speed streaks over the top: he's coming down at full speed.
  for (let i = 0; i < 9; i++) {
    const x = 6 + Math.floor(roll() * (w - 12));
    const y = (Math.floor(roll() * 20) + phase * 7) % 24;
    g.line(x, y, x, y + 3 + Math.floor(roll() * 3), DUST_MID);
  }
  drawLog(g, 0, h - LOG_H, phase);
  // Bramble, hatchet up and mouth open, bouncing on the log: a pixel up, a pixel down.
  const bob = phase % 2 ? 1 : 0;
  g.paste(BRAMBLE_ROWS('bramble_cornered'), 28, h - LOG_H - 21 + bob + 1);
  // A kick of dust off the back of the log.
  const dustY = (phase * 3) % 8;
  g.set(2, 6 + dustY, DUST);
  g.set(3, 6 + dustY, DUST);
  g.set(68, 10 + dustY, DUST);
  return g.rows();
}
export const FINALE_LOG_RIDE_SPRITES = { d0: logRide(0), d1: logRide(1), d2: logRide(2), d3: logRide(3) };

// =====================================================================
// 4. Bramble in the air, turning over
// =====================================================================
export const FINALE_BRAMBLE_FLY_SPRITES = Object.fromEntries(
  Array.from({ length: 8 }, (_, i) => [`spin${i}`, rotate(BRAMBLE_ROWS('bramble_cornered'), (i * Math.PI) / 4, 32)]),
);

// =====================================================================
// 5. Face down: the SQUISH
// =====================================================================
const HAIR = P('#b4501e');
const HAIR_LIT = P('#e88a3c');
const HAIR_DK = P('#8a3418');
const SKIN = P('#f2d6b0');
const FLANNEL = P('#c43b3b');
const FLANNEL_DK = P('#8a2a2a');
const FLANNEL_BK = P('#2a2630');
const TROUSERS = P('#7a5a3a');
const PATCH = P('#c08a4e');
const BOOT = P('#3a2418');
const SOLE = P('#5a3a1e');
const LEAF = P('#e0402e');
const STEEL = P('#8a8296');
const EDGE = P('#b8c0d0');
const DIRT = P('#8a7658');
const DIRT_DK = P('#5e4e38');

// Bramble flat on his face, seen from above: hair at the top, arms flung out,
// legs splayed, the hatchet skidding off to one side. 30x28 before it's squashed.
function proneBramble(withHead = true) {
  const g = new Grid(30, 28);
  const cx = 15;
  // Legs, splayed, with the boots at the ends.
  for (const side of [-1, 1]) {
    g.rect(cx + (side < 0 ? -6 : 2), 17, 4, 7, TROUSERS);
    g.rect(cx + (side < 0 ? -7 : 3), 23, 4, 3, BOOT);
    g.rect(cx + (side < 0 ? -7 : 3), 26, 4, 1, SOLE);
    g.set(cx + (side < 0 ? -5 : 4), 20, PATCH);
  }
  // The flannel back, with its stripes.
  g.rect(cx - 5, 9, 10, 9, FLANNEL);
  for (let y = 9; y < 18; y++) {
    g.set(cx - 3, y, FLANNEL_DK);
    g.set(cx, y, FLANNEL_BK);
    g.set(cx + 3, y, FLANNEL_DK);
  }
  for (let x = cx - 5; x < cx + 5; x += 3) g.set(x, 13, FLANNEL_DK);
  g.rect(cx - 5, 17, 10, 1, FLANNEL_DK);
  // Arms flung out wide, hands open.
  g.rect(cx - 13, 10, 8, 3, FLANNEL);
  g.rect(cx - 14, 9, 2, 4, SKIN);
  g.rect(cx + 5, 10, 8, 3, FLANNEL);
  g.rect(cx + 13, 9, 2, 4, SKIN);
  g.set(cx - 9, 11, FLANNEL_DK);
  g.set(cx + 9, 11, FLANNEL_DK);
  // The head: all hair from above, the red leaf still stuck in it.
  if (withHead) {
    g.oval(cx, 5, 6, 5, HAIR);
    g.oval(cx - 1, 4, 3, 2, HAIR_LIT);
    g.line(cx - 5, 7, cx + 4, 8, HAIR_DK);
    g.set(cx + 3, 3, LEAF);
    g.set(cx + 4, 3, LEAF);
    g.set(cx - 5, 2, HAIR);
    g.set(cx + 5, 1, HAIR_LIT);
    g.set(cx - 2, 0, HAIR_LIT);
  }
  // The hatchet, skidded away beside one hand.
  g.line(cx - 14, 17, cx - 14, 26, WOOD);
  g.rect(cx - 15, 15, 3, 3, STEEL);
  g.set(cx - 16, 16, EDGE);
  g.outline(OUT);
  return g;
}

// A frame of 40x32: the figure squashed or stretched, standing on the bottom edge.
function splat(sx, sy, extra) {
  const base = proneBramble();
  const w = Math.round(base.w * sx);
  const h = Math.round(base.h * sy);
  const g = new Grid(40, 32);
  const rows = resize(base.rows(), w, h);
  g.paste(rows, Math.floor((40 - w) / 2), 32 - h);
  if (extra) extra(g);
  return g.rows();
}
// Stars and dizzy bits around him on the first squash.
const stars = (g) => {
  for (const [x, y] of [[3, 14], [36, 12], [8, 3], [31, 4]]) {
    g.set(x, y, GLOW_MID);
    g.set(x - 1, y, GLOW);
    g.set(x + 1, y, GLOW);
    g.set(x, y - 1, GLOW);
    g.set(x, y + 1, GLOW);
  }
};
export const FINALE_BRAMBLE_SPLAT_SPRITES = {
  hit: splat(1.3, 0.62, stars), // flat as a pancake
  flat: splat(1.32, 0.58),
  pop: splat(0.8, 1.14), // springs back too far,
  wobble: splat(1.12, 0.9),
  shape: splat(0.96, 1.04),
  rest: splat(1, 1), // and settles: face down
};

// =====================================================================
// 6. The dust
// =====================================================================
function puff(stage) {
  const g = new Grid(44, 24);
  const roll = dice(300 + stage);
  const spread = [4, 9, 14, 18, 20, 21][stage];
  const lift = [2, 5, 8, 11, 14, 16][stage];
  const count = [4, 6, 7, 7, 6, 5][stage];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + roll() * 0.4;
    const x = 22 + Math.cos(a) * spread * (0.6 + roll() * 0.4);
    const y = 20 - lift * (0.35 + 0.65 * Math.abs(Math.sin(a))) + Math.sin(a) * 2;
    const r = 3 + Math.floor(roll() * 3) - (stage > 3 ? 1 : 0);
    g.oval(x, y, r, Math.max(2, r - 1), DUST_MID);
  }
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + 0.3;
    const x = 22 + Math.cos(a) * spread * 0.7;
    const y = 19 - lift * 0.5 * Math.abs(Math.sin(a));
    g.oval(x - 1, y - 1, 2, 1, DUST);
  }
  if (stage < 3) g.oval(22, 20, spread * 0.6, 2, DUST_MID);
  for (let i = 0; i < 4; i++) g.set(10 + Math.floor(roll() * 24), 22 + (i % 2), DUST_DK);
  return g.rows();
}
export const FINALE_PUFF_SPRITES = Object.fromEntries(Array.from({ length: 6 }, (_, i) => [`p${i}`, puff(i)]));

// =====================================================================
// 7. The dent his face left in the dirt
// =====================================================================
function facePrint(settled) {
  const g = new Grid(24, 18);
  // The crater, pushed up round the rim.
  g.oval(12, 10, 10, 7, OUT);
  g.oval(12, 10, 9, 6, DIRT);
  g.oval(12, 10, 8, 5, DIRT_DK);
  g.oval(12, 11, 7, 5, DIRT);
  // Rim lumps.
  for (const [x, y] of [[3, 8], [4, 5], [20, 7], [19, 4], [7, 3], [16, 2]]) g.oval(x, y, 1, 1, DIRT);
  // His face, pressed in: a spiky fringe, two eyes, a nose, a big squashed grin.
  const f = settled ? DIRT : P('#6a583e');
  for (const x of [6, 8, 10, 12, 14, 16]) g.set(x, 6, f);
  g.line(6, 7, 17, 7, f);
  g.rect(7, 9, 3, 2, f);
  g.rect(14, 9, 3, 2, f);
  g.rect(11, 11, 2, 2, f);
  g.line(7, 14, 8, 15, f);
  g.line(8, 15, 15, 15, f);
  g.line(15, 15, 16, 14, f);
  g.set(5, 11, f);
  g.set(18, 11, f);
  if (!settled) {
    for (const [x, y] of [[2, 12], [21, 12], [9, 1], [14, 17]]) g.set(x, y, DUST);
  }
  return g.rows();
}
export const FINALE_FACE_PRINT_SPRITES = { fresh: facePrint(false), settled: facePrint(true) };

// =====================================================================
// 8. Getting up, and the thumbs-up
// =====================================================================
const SIT = BRAMBLE_ROWS('bramble_sit');

// The sitting figure with a dirty face (a smear on the brow, one on each cheek).
function dirtyFace(rows) {
  const g = new Grid(rows[0].length, rows.length);
  g.paste(rows, 0, 0);
  for (const [x, y] of [[7, 6], [8, 6], [10, 7], [6, 9], [7, 9], [12, 9], [9, 10], [11, 10]]) {
    if (g.get(x, y) === SKIN) g.set(x, y, DIRT);
  }
  for (const [x, y] of [[8, 7], [11, 8], [7, 10]]) if (g.get(x, y) === SKIN) g.set(x, y, DIRT_DK);
  return g;
}

// 28x28 canvas, feet on the bottom edge.
function sitFrame(arm) {
  const g = new Grid(28, 28);
  const sit = dirtyFace(SIT);
  g.paste(sit.rows(), 6, 28 - SIT.length);
  if (arm) {
    // The right arm (his left, on our right) flung up with a thumb out.
    const ox = 6;
    const oy = 28 - SIT.length;
    // Clear the sleeve that hung by his side.
    g.rect(ox + 13, oy + 11, 3, 6, null);
    // Shoulder up to a fist.
    const lean = arm === 2 ? 1 : 0;
    g.line(ox + 13, oy + 11, ox + 17 + lean, oy + 4, OUT);
    g.line(ox + 14, oy + 11, ox + 18 + lean, oy + 4, OUT);
    g.line(ox + 13, oy + 12, ox + 16, oy + 6, FLANNEL);
    g.line(ox + 14, oy + 12, ox + 17, oy + 6, FLANNEL);
    // The fist, the thumb up.
    g.rect(ox + 15 + lean, oy + 2, 4, 4, OUT);
    g.rect(ox + 16 + lean, oy + 3, 2, 2, SKIN);
    g.rect(ox + 16 + lean, oy + 1, 2, 3, OUT);
    g.rect(ox + 16 + lean, oy + 2, 1, 1, SKIN);
    g.set(ox + 17 + lean, oy + 2, SKIN);
    g.set(ox + 16 + lean, oy + 1, SKIN);
    g.rect(ox + 15 + lean, oy + 5, 4, 1, OUT);
    // A glint off the thumbnail.
    g.set(ox + 17 + lean, oy + 0, GLOW);
    if (arm === 2) { g.set(ox + 20, oy + 1, GLOW_MID); g.set(ox + 20, oy + 3, GLOW_MID); }
  }
  return g.rows();
}

// Head up out of the dirt, body still flat (the first look at the world).
function liftFrame() {
  const g = new Grid(28, 28);
  const body = proneBramble(false);
  g.paste(resize(body.rows(), 28, 22), 0, 6);
  // The head, face-on, from the sitting figure (hair, brow, grin, dirt).
  const sit = dirtyFace(SIT).rows();
  const head = sit.slice(1, 12).map((row) => row.slice(5, 16));
  g.paste(head, 8, 0);
  g.rect(6, 4, 1, 1, null);
  return g.rows();
}

export const FINALE_BRAMBLE_UP_SPRITES = { lift: liftFrame(), push: sitFrame(0), sit: sitFrame(0) };
export const FINALE_BRAMBLE_THUMBS_SPRITES = { t0: sitFrame(1), t1: sitFrame(2) };

// =====================================================================
// 9-11. Holding up the doorway
// =====================================================================
// The doorway's lintel (the great stone beam across the top) breaks off both
// posts and comes down. The hero takes its low end on his arms, under the
// left post; Ves wedges her open umbrella (its own length, no longer) under
// the high end by the right post. The beam itself is drawn in the HERO's
// frames while he holds it, so it sinks and heaves with him; the arch's own
// frames show the empty gap where it was (and draw it again, falling, once
// he lets go, and back up in place on top of the log).
//
// Everything below is measured in the ARCH's pixels (144 wide, 64 tall; the
// floor the folk stand on is at 65.6): the hero stands at x 40, Ves at 104.
const ARCH_W = 144;
const ARCH_H = 64;
const LINTEL = 13; // rows 0 to 13: the lintel, between the posts (x 32 to 112)
const SLAB_X0 = 33;
const SLAB_X1 = 111;
const HERO_LX = 40;
const VES_LX = 104;
// Where the slab's underside comes to rest, held: on the lid's knob (about 41 at x 40,
// lower as he sinks) and on her canopy (26 at x 104).
const HELD_LEFT = 43;
const HELD_RIGHT = 26;
const heldBottom = (sink) => (x) => HELD_LEFT + sink + (x - HERO_LX) * ((HELD_RIGHT - HELD_LEFT - sink) / (VES_LX - HERO_LX));

const SWEAT = P('#9fd4ff');
const TEETH = P('#fff8ec');
const BRASS = P('#f0c050');
function PLAYER_C(ch) {
  return P(PLAYER_PALETTE[ch]);
}

// The lintel as a loose slab: `bottom(x)` is its underside at each column
// (arch pixels), drawn into `g` shifted by (ox, oy). Broken ends, mortar
// seams, a crack or two, and light caught along its top edge.
function drawSlab(g, ox, oy, bottom) {
  const roll = dice(4242);
  const notch = Array.from({ length: SLAB_X1 - SLAB_X0 + 1 }, () => roll());
  for (let x = SLAB_X0; x <= SLAB_X1; x++) {
    const b = Math.round(bottom(x));
    const t = b - LINTEL;
    const end = x <= SLAB_X0 + 2 || x >= SLAB_X1 - 2;
    const n = notch[x - SLAB_X0];
    // The broken ends are ragged: bites out of the top and bottom.
    const top = t + (end && n > 0.5 ? 1 + Math.floor(n * 3) : 0);
    const bot = b - (end && n < 0.4 ? 1 + Math.floor(n * 4) : 0);
    for (let y = top; y <= bot; y++) {
      let c = STONE;
      if (y === top || y === bot || x === SLAB_X0 || x === SLAB_X1) c = OUT;
      else if (y === top + 1) c = STONE_LIT;
      else if (y === bot - 1) c = STONE_DK;
      else if (x === 52 || x === 72 || x === 92) c = MORTAR;
      else if (y === t + 7 && (x < 52 || (x > 72 && x < 92))) c = MORTAR;
      g.set(x + ox, y + oy, c);
    }
  }
  // A crack across it, where it took the blow.
  for (let i = 0; i < 9; i++) {
    const x = 60 + i;
    g.set(x + ox, Math.round(bottom(x)) - 3 - Math.floor(i / 2) + oy, OUT);
  }
}

// --- The pot lid -------------------------------------------------------
// A round metal pot lid with a knob, the kind off the feast's stew pot. He
// dives for it, springs up and holds it over his head; the lintel's low end
// rests on its knob. Steel greys, a darker lip, a dark knob.
const LID = P('#9aa3b2');
const LID_LIT = P('#d6deea');
const LID_DK = P('#5f6877');
const LID_KNOB = P('#6b7384');
const LID_KNOB_LIT = P('#b8c2d2');

// The lid held up, seen from the side-front: 20 wide; a 3-row knob, then 4
// rows of dome with the lip (darkest row) at the bottom.
function lidHeld() {
  const g = new Grid(20, 7);
  g.rect(7, 0, 6, 3, LID_KNOB);
  g.rect(8, 0, 2, 1, LID_KNOB_LIT);
  g.set(8, 1, LID_KNOB_LIT);
  g.rect(6, 3, 8, 1, LID_LIT);
  g.rect(3, 4, 14, 1, LID);
  g.rect(1, 5, 18, 1, LID);
  g.rect(0, 6, 20, 1, LID_DK);
  // The light along the left of the dome, the shade on the right.
  g.rect(3, 4, 3, 1, LID_LIT);
  g.rect(1, 5, 3, 1, LID_LIT);
  g.rect(14, 4, 3, 1, LID_DK);
  g.rect(15, 5, 4, 1, LID_DK);
  g.rect(8, 5, 3, 1, LID_DK); // a ring pressed into the dome
  return g;
}

// The lid lying on the floor (22x11, a round lid seen from above at a slant);
// `rock` 0 flat, 1 and 2 tipped a touch (a quake rattles it).
function lidFloor(rock) {
  const g = new Grid(22, 11);
  const lift = rock === 0 ? 0 : 1;
  const cx = 11 + (rock === 2 ? 1 : 0);
  g.oval(cx, 6 + lift, 9, 3, LID_DK);
  g.oval(cx, 5 + lift, 9, 3, LID);
  g.oval(cx - 1, 4 + lift, 6, 1, LID_LIT);
  g.oval(cx, 5 + lift, 4, 1, LID_DK);
  g.rect(cx - 1, 3 + lift, 3, 2, LID_KNOB);
  g.set(cx - 1, 3 + lift, LID_KNOB_LIT);
  g.outline(OUT);
  return g.rows();
}
export const FINALE_POT_LID_SPRITES = { l0: lidFloor(0), l1: lidFloor(1), l2: lidFloor(0), l3: lidFloor(2) };

// The lid shaken loose when he lets go: it drops off over his head, tumbles,
// clangs and rocks flat on the floor (24x40, feet at the bottom; `once`).
function lidFall() {
  const frames = {};
  const held = lidHeld();
  const dome = new Grid(22, 9);
  dome.paste(held.rows(), 1, 1);
  dome.outline(OUT);
  const rows = dome.rows();
  const put = (name, oy, tumble) => {
    const g = new Grid(24, 40);
    g.paste(tumble === undefined ? rows.map((r) => `.${r}`) : rotate(rows, tumble, 24), 0, oy);
    frames[name] = g.rows();
  };
  put('d0', 10);
  put('d1', 14, 0.5);
  put('d2', 19, 1.5);
  put('d3', 23, 2.6);
  put('d4', 26, 3.4);
  // It hits the floor, rings, and rocks down flat.
  const flat = (name, rock, oy, grit) => {
    const g = new Grid(24, 40);
    g.paste(lidFloor(rock).map((r) => `.${r}.`), 0, oy);
    if (grit) {
      g.set(2, oy - 2, DUST);
      g.set(21, oy - 1, DUST);
    }
    frames[name] = g.rows();
  };
  flat('f0', 1, 28, true);
  flat('f1', 3, 27, true);
  flat('f2', 1, 29, false);
  flat('f3', 0, 29, false);
  return frames;
}
export const FINALE_POT_LID_FALL_SPRITES = lidFall();

// --- The hero, holding the lid up under the low end ---------------------
// 152x56, his feet at the bottom middle (the arch's x 40 at column 76).
const HERO_W = 152;
const HERO_H = 56;
const HOX = 36; // a column of this = arch x + HOX
const HOY = -10; // a row of this = arch y + HOY

// `sink` 0 to 2: how far the weight has pressed him down (knees going);
// `dx` the tremble; `sweat` 0 to 2; `lift` 1 the lid held up over his head,
// less when it's still coming up off the floor; `tilt` -2 to 2 how far the lid
// tips (left side up when positive); `slab` 'none', 'socket' (still in the
// lintel, about to go), 'drop' (coming down) or 'held'; `whistle`: one hand
// to his mouth with Bramble's whistle, the other holding the lid alone;
// `crouch`: down on his haunches.
function heroHold({ sink = 0, dx = 0, sweat = 0, lift = 1, tilt = 0, slab = 'held', whistle = false, crouch = 0 }) {
  const g = new Grid(HERO_W, HERO_H);
  const hero = (rows) => remap(rows, PLAYER_PALETTE);
  const x0 = 70 + dx;
  const headTop = 38 + sink + crouch;
  const feet = HERO_H - 1;
  const lidMid = x0 + 5.5;
  // How far the lid rides up (positive tilt: its left side up).
  const lean = (x) => Math.round((tilt * (lidMid - x)) / 10);
  const rimY = headTop - 2 + Math.round((1 - lift) * 11);
  const lidTop = rimY - 6;

  // The lintel's low end, resting on the lid's knob (drawn first: the lid and
  // his arms are in front of it).
  if (slab === 'socket') drawSlab(g, HOX, HOY, () => LINTEL);
  else if (slab === 'drop') drawSlab(g, HOX, HOY, (x) => LINTEL + 8 + (SLAB_X1 - x) * 0.1);
  else if (slab === 'held') {
    const left = lidTop + lean(lidMid) + 1 - HOY;
    // Flat over the lid, then rising to Ves's umbrella.
    drawSlab(g, HOX, HOY, (x) => (x <= 52 ? left : left + (x - 52) * ((HELD_RIGHT - left) / (VES_LX - 52))));
  }

  // Legs: a braced stance, the knees out as he sinks.
  const hip = headTop + 15;
  const spread = 1 + sink + crouch;
  for (const [hx, fx] of [[x0 + 3, x0 + 2 - spread], [x0 + 8, x0 + 9 + spread]]) {
    for (let y = hip; y < feet; y++) {
      const k = (y - hip) / Math.max(1, feet - 1 - hip);
      const knee = Math.sin(k * Math.PI) * (sink + crouch) * (hx < x0 + 5 ? -1 : 1);
      const x = Math.round(hx + (fx - hx) * k + knee);
      g.rect(x - 1, y, 3, 1, PLAYER_C('p'));
    }
    g.rect(fx - 1, feet, 3, 1, PLAYER_C('b'));
  }
  // Body and head (looking out at you, round the lid).
  const front = hero(PLAYER_SPRITES.downIdle);
  g.paste(front.slice(9, 15), x0, headTop + 9);
  g.paste(front.slice(0, 9), x0, headTop);

  // The arms: short and chunky, 3 wide like his walking frames', from the
  // shoulders out to the elbows and up to the hands under the lid's lip.
  const limb = (ax, ay, bx, by) => {
    const n = Math.max(Math.abs(bx - ax), Math.abs(by - ay), 1);
    for (let i = 0; i <= n; i++) g.rect(Math.round(ax + ((bx - ax) * i) / n) - 1, Math.round(ay + ((by - ay) * i) / n), 3, 1, PLAYER_C('c'));
  };
  const shoulderY = headTop + 10;
  const lipY = (x) => rimY + lean(x);
  const elbowY = Math.min(headTop + 5 + Math.round((1 - lift) * 4), headTop + 9);
  const arm = (sx, handX, ex) => {
    const handY = lipY(handX);
    limb(sx, shoulderY + 1, ex, elbowY);
    limb(ex, elbowY, handX, handY + 1);
    // The hand wraps the lip: three wide, over the edge of the lid.
    g.rect(handX - 1, handY, 3, 3, PLAYER_C('s'));
  };
  arm(x0, x0 - 3, x0 - 4);
  if (whistle) {
    // The other hand is up at his mouth, round the whistle.
    limb(x0 + 11, shoulderY + 1, x0 + 14, headTop + 10);
    limb(x0 + 14, headTop + 10, x0 + 12, headTop + 7);
    g.rect(x0 + 10, headTop + 6, 3, 3, PLAYER_C('s'));
  } else {
    arm(x0 + 11, x0 + 14, x0 + 15);
  }

  // The lid itself, in front of the stone, a gap between its lip and his head.
  const lid = lidHeld();
  for (let y = 0; y < lid.h; y++) for (let x = 0; x < lid.w; x++) {
    const c = lid.get(x, y);
    if (c) g.set(x0 - 4 + x, lidTop + y + lean(x0 - 4 + x), c);
  }

  g.outline(OUT);
  // The face: eyes screwed shut, teeth gritted (or cheeks out round the whistle).
  const hy = headTop;
  for (const x of [2, 3, 7, 8]) g.set(x0 + x, hy + 6, OUT);
  g.set(x0 + 3, hy + 5, OUT);
  g.set(x0 + 7, hy + 5, OUT);
  if (whistle) {
    g.set(x0 + 1, hy + 7, PLAYER_C('s'));
    g.rect(x0 + 4, hy + 7, 4, 1, OUT);
    g.rect(x0 + 5, hy + 7, 2, 1, BRASS);
    g.set(x0 + 7, hy + 8, BRASS);
  } else {
    g.rect(x0 + 3, hy + 7, 6, 1, OUT);
    g.rect(x0 + 4, hy + 7, 4, 1, TEETH);
    g.set(x0 + 6, hy + 7, OUT);
  }
  // Sweat flying off him.
  if (sweat >= 1) {
    g.set(x0 - 2, hy + 3, SWEAT);
    g.set(x0 - 2, hy + 4, SWEAT);
    g.set(x0 + 13, hy + 5, SWEAT);
  }
  if (sweat >= 2) {
    g.set(x0 - 3, hy + 8, SWEAT);
    g.set(x0 + 14, hy + 1, SWEAT);
    g.set(x0 + 14, hy + 2, SWEAT);
  }
  // Grit sifting off the stone onto the lid as it presses down.
  if (slab === 'held' && sink >= 1) {
    g.set(x0 - 6, rimY + 2 + sweat, DUST_MID);
    g.set(x0 + 18, rimY + 4 - sweat, DUST);
    g.set(x0 + 20, rimY + 1 + sink, DUST);
  }
  return g.rows();
}
// Getting under it: the lid is up, the lintel cracks and drops onto its knob,
// it buckles him, and he heaves it back up.
export const FINALE_HERO_BRACE_IN_SPRITES = {
  b0: heroHold({ slab: 'socket' }),
  b1: heroHold({ slab: 'drop', tilt: 1 }),
  b2: heroHold({ sink: 2, sweat: 1, tilt: -1 }),
  b3: heroHold({ sink: 2, dx: 1, sweat: 2, tilt: 1 }),
  b4: heroHold({ sink: 1, sweat: 1 }),
};
// Holding it: trembling, the lid wobbling, the knees giving a little and locking again.
export const FINALE_HERO_STRAIN_SPRITES = {
  s0: heroHold({ sink: 0, dx: -1, sweat: 1, tilt: 1 }),
  s1: heroHold({ sink: 1, dx: 0, sweat: 2, tilt: -1 }),
  s2: heroHold({ sink: 1, dx: 1, sweat: 1, tilt: 1 }),
  s3: heroHold({ sink: 0, dx: 0, sweat: 0, tilt: -1 }),
};
// It slips: the lid tips, down, down, nearly gone... and he heaves it back up (play `once`).
export const FINALE_HERO_SLIP_SPRITES = {
  p0: heroHold({ sink: 1, sweat: 1, tilt: 1 }),
  p1: heroHold({ sink: 2, dx: 1, sweat: 2, tilt: 2 }),
  p2: heroHold({ sink: 2, dx: -1, sweat: 2, tilt: -2 }),
  p3: heroHold({ sink: 2, dx: 1, sweat: 2, tilt: 2 }),
  p4: heroHold({ sink: 1, sweat: 1, tilt: -1 }),
  p5: heroHold({ sink: 0, sweat: 0 }),
};
// One hand on the lid, the other at his mouth with the whistle.
export const FINALE_HERO_WHISTLE_SPRITES = {
  w0: heroHold({ sink: 1, sweat: 1, whistle: true, tilt: -1 }),
  w1: heroHold({ sink: 1, dx: 1, sweat: 2, whistle: true, tilt: -2 }),
  w2: heroHold({ sink: 1, sweat: 1, whistle: true, tilt: -1 }),
  w3: heroHold({ sink: 1, dx: -1, sweat: 0, whistle: true, tilt: -2 }),
};

// The dive-roll for the lid, then up with it (play `once`; 152x56 like the
// holding frames, so he lands exactly in them). He faces right, flying in
// from the left: five frames in the air and the roll, then crouched over the
// lid, standing with it, and lifting it.
const RIGHT_IDLE = PLAYER_SPRITES.leftIdle.map((row) => [...row].reverse().join(''));
function rollFrame(angle, oy, ox, ball) {
  const g = new Grid(HERO_W, HERO_H);
  const rows = ball ? resize(remap(PLAYER_SPRITES.downIdle, PLAYER_PALETTE), 12, 12) : remap(RIGHT_IDLE, PLAYER_PALETTE);
  g.paste(rotate(rows, angle, 24), 76 - 12 + ox, HERO_H - 24 + oy);
  return g.rows();
}
export const FINALE_HERO_ROLL_SPRITES = {
  r0: rollFrame(0.35, -2, -6, false),
  r1: rollFrame(1.2, -8, -2, false),
  r2: rollFrame(1.7, -9, 3, false),
  r3: rollFrame(3.0, -1, 5, true),
  r4: rollFrame(4.6, -1, 7, true),
  r5: heroHold({ slab: 'none', crouch: 5, lift: 0 }),
  r6: heroHold({ slab: 'none', sink: 1, lift: 0.1 }),
  r7: heroHold({ slab: 'none', lift: 0.55 }),
};

// Diving out of the log's way, and lying flat where he lands (play `once`).
function diveFrame(rows, pal, size, angle, flat) {
  const g = new Grid(size, size);
  g.paste(rotate(remap(rows, pal), angle, size), 0, flat ? 3 : 0);
  if (flat) {
    g.set(1, size - 2, DUST);
    g.set(size - 2, size - 3, DUST);
    g.set(3, size - 1, DUST_MID);
  }
  return g.rows();
}
export const FINALE_HERO_DIVE_SPRITES = {
  v0: diveFrame(PLAYER_SPRITES.leftIdle, PLAYER_PALETTE, 22, -Math.PI / 2.6, false),
  v1: diveFrame(PLAYER_SPRITES.leftIdle, PLAYER_PALETTE, 22, -Math.PI / 2, false),
  v2: diveFrame(PLAYER_SPRITES.leftIdle, PLAYER_PALETTE, 22, -Math.PI / 2, true),
};
const VES_RIGHT = VES_FRAMES.leftIdle.map((row) => [...row].reverse().join(''));
export const FINALE_VES_DIVE_SPRITES = {
  v0: diveFrame(VES_RIGHT, VES_PALETTE, 30, Math.PI / 2.6, false),
  v1: diveFrame(VES_RIGHT, VES_PALETTE, 30, Math.PI / 2, false),
  v2: diveFrame(VES_RIGHT, VES_PALETTE, 30, Math.PI / 2, true),
};

// --- Ves, with her umbrella wedged under the high end ------------------
// 40x48, her feet at the bottom middle (the arch's x 104 at column 20).
const VES_W = 40;
const VES_H = 48;
const VOX = -84;
const VOY = -18;
const UMB = P(VES_PALETTE.q);
const UMB_RIB = P(VES_PALETTE.Q);
const SHAFT = P(VES_PALETTE.d);
const MITT = P(VES_PALETTE['4']);
const VES_COAT = P(VES_PALETTE.G);
// Her, with the umbrella taken out of her hand (it's up over her head now).
const VES_BODY = remap(VES_FRAMES.downIdle, VES_PALETTE).slice(6).map((row) => `${row.slice(0, 13)}...`);

// `crouch` how far she's been pressed down, `bow` how far the shaft has
// bent out, `cw` how wide the canopy still is, `broken` a snapped rib.
function vesHold(crouch, bow, cw, broken, strain) {
  const g = new Grid(VES_W, VES_H);
  const x0 = 14;
  // Pressed down: a row or two of her skirt folds away.
  const body = [...VES_BODY.slice(0, 13), ...VES_BODY.slice(13 + crouch)];
  const top = VES_H - body.length;
  // Both arms up over her head, hands together on the shaft.
  const handY = top - 5;
  g.line(x0 + 1, top + 4, 18, handY + 2, VES_COAT);
  g.line(x0 + 2, top + 4, 19, handY + 2, VES_COAT);
  g.line(x0 + 11, top + 4, 22, handY + 2, VES_COAT);
  g.line(x0 + 10, top + 4, 21, handY + 2, VES_COAT);
  g.paste(body, x0, top);
  // The canopy, its top jammed flat against the stone.
  const under = (x) => Math.round(heldBottom(0)(x - VOX)) + VOY + 1;
  const cx = 20 + Math.round(bow * 0.4);
  const canopyBottom = under(cx) + 4;
  for (let x = -cw; x <= cw; x++) {
    const t = under(cx + x);
    const tip = Math.abs(x) === cw ? 1 : 0;
    for (let y = t; y <= t + 3 + tip; y++) g.set(cx + x, y, (x + 40) % 3 === 0 ? UMB_RIB : UMB);
  }
  // The shaft, from her hands up into it, bowing as the weight comes on.
  const steps = handY - canopyBottom;
  for (let i = 0; i <= steps; i++) {
    const k = i / Math.max(1, steps);
    g.set(Math.round(20 + Math.sin(k * Math.PI) * bow + (cx - 20) * k), handY - i, SHAFT);
  }
  g.rect(19, handY, 3, 3, MITT);
  g.outline(OUT);
  // Ribs showing under the canopy.
  for (let x = -cw; x <= cw; x += 3) g.set(cx + x, under(cx + x) + 4 + (Math.abs(x) === cw ? 1 : 0), OUT);
  if (broken) {
    // A rib snapped, hanging by a thread.
    g.line(cx + cw - 1, under(cx + cw) + 4, cx + cw + 2, under(cx + cw) + 8, UMB_RIB);
    g.set(cx + cw + 2, under(cx + cw) + 9, OUT);
  }
  // Teeth set, eyes shut.
  g.rect(x0 + 4, top + 5, 2, 1, OUT);
  g.rect(x0 + 7, top + 5, 2, 1, OUT);
  if (strain) {
    g.set(x0 - 1, top + 2, SWEAT);
    g.set(x0 - 1, top + 3, SWEAT);
    g.set(x0 + 14, top + 1, SWEAT);
    g.set(cx + 4, canopyBottom + 3, DUST);
    g.set(cx - 5, canopyBottom + 6, DUST);
  }
  return g.rows();
}
export const FINALE_VES_HOLD_SPRITES = {
  h0: vesHold(0, 0, 7, false, false),
  h1: vesHold(0, 1, 7, false, true),
  h2: vesHold(1, 3, 7, false, true),
  h3: vesHold(2, 5, 6, true, true),
  h4: vesHold(3, 7, 5, true, true),
};

// Afterwards: she's got it back, and it hangs from her hand in a U, the
// canopy folded over and drooping.
const BENT_W = 40;
const BENT_H = 56;
const VES_BASE = remap(VES_FRAMES.downIdle, VES_PALETTE);
function vesBent(sway) {
  const g = new Grid(BENT_W, BENT_H);
  const ox = 10;
  const oy = BENT_H - 20;
  g.paste(VES_BASE.slice(6), ox, oy);
  g.rect(ox + 14, oy, 1, 9, null);
  const handX = ox + 14;
  const handY = oy + 9;
  // Up, over, and down again.
  const pts = [];
  for (let i = 0; i <= 14; i++) pts.push([handX, handY - i]);
  for (let i = 1; i <= 8; i++) pts.push([handX + Math.round(Math.sin((i / 8) * Math.PI * 0.5) * 8) + sway, handY - 14 - Math.round(Math.cos((i / 8) * Math.PI * 0.5) * 3)]);
  const endX = handX + 9 + sway;
  for (let i = 0; i <= 8; i++) pts.push([endX, handY - 14 + i]);
  for (const [x, y] of pts) {
    g.set(x, y, SHAFT);
  }
  // The canopy, folded and wilted at the end.
  for (let y = 0; y < 9; y++) {
    const w = y < 2 ? 1 : y < 6 ? 3 : 2 + (y % 2);
    g.rect(endX - w + 1, handY - 6 + y, w * 2, 1, y % 3 === 0 ? UMB_RIB : UMB);
  }
  g.line(endX - 3, handY + 2, endX - 5, handY + 6, UMB_RIB);
  g.line(endX + 4, handY + 1, endX + 6, handY + 5, UMB_RIB);
  g.outline(OUT);
  return g.rows();
}
export const FINALE_VES_BENT_SPRITES = { b0: vesBent(0), b1: vesBent(1) };

// --- The great doorway --------------------------------------------------

function stoneRect(g, x, y, w, h, seed) {
  const roll = dice(seed);
  g.rect(x, y, w, h, OUT);
  g.rect(x + 1, y + 1, w - 2, h - 2, STONE);
  // Courses of blocks, staggered.
  for (let row = 0; row * 8 < h; row++) {
    const yy = y + row * 8;
    if (row > 0) g.rect(x + 1, yy, w - 2, 1, MORTAR);
    for (let jx = x + 5 + ((row * 11) % 16); jx < x + w - 1; jx += 16) g.rect(jx, yy, 1, Math.min(8, y + h - yy - 1), MORTAR);
  }
  g.rect(x + 1, y + 1, w - 2, 1, STONE_LIT);
  g.rect(x + 1, y + 1, 1, h - 2, STONE_LIT);
  g.rect(x + w - 2, y + 1, 1, h - 2, STONE_DK);
  for (let i = 0; i < Math.floor((w * h) / 90); i++) g.set(x + 2 + Math.floor(roll() * (w - 4)), y + 2 + Math.floor(roll() * (h - 4)), roll() > 0.5 ? STONE_LIT : STONE_DK);
}

// The two posts, cracking as `wear` goes from 0 to 3.
function drawPosts(g, wear) {
  stoneRect(g, 0, 0, 32, ARCH_H, 11);
  stoneRect(g, ARCH_W - 32, 0, 32, ARCH_H, 12);
  g.rect(0, ARCH_H - 4, 32, 4, STONE_DK);
  g.rect(ARCH_W - 32, ARCH_H - 4, 32, 4, STONE_DK);
  if (wear >= 1) {
    // Cracks running down from the broken sockets.
    g.line(30, 2, 26, 14, OUT);
    g.line(26, 14, 28, 24, OUT);
    g.line(114, 3, 118, 16, OUT);
  }
  if (wear >= 2) {
    g.line(28, 24, 24, 38, OUT);
    g.line(118, 16, 115, 30, OUT);
    g.set(27, 18, GLOW_MID);
    g.set(117, 12, GLOW_MID);
  }
  if (wear >= 3) {
    g.line(115, 30, 119, 44, OUT);
    g.set(25, 31, GLOW);
    g.set(116, 24, GLOW);
    // Rubble at the foot of each post.
    g.rect(33, ARCH_H - 3, 3, 3, STONE_DK);
    g.rect(108, ARCH_H - 4, 4, 4, STONE_LIT);
    g.set(37, ARCH_H - 1, STONE_VDK);
  }
}

// Where the lintel was: a ragged gap between the posts, with the light (and
// the grit) of the falling hall coming down through it.
function drawGap(g, wear, roll) {
  g.rect(32, 0, 80, LINTEL + 1, STONE_VDK);
  for (let x = 34; x < 110; x += 5) g.rect(x + (x % 3), 0, 1, 3 + ((x * 7) % 6), OUT);
  g.rect(60, 0, 24, 2 + wear, wear >= 2 ? GLOW : GLOW_MID);
  g.rect(66, 0, 12, 1 + wear, GLOW_HOT);
  // The broken stubs of it in each post.
  for (let y = 0; y <= LINTEL; y++) {
    g.set(32 + (y % 3), y, STONE_DK);
    g.set(111 - ((y + 1) % 3), y, STONE_DK);
  }
  for (let i = 0; i < 6 + wear * 4; i++) g.set(40 + Math.floor(roll() * 64), LINTEL + 2 + Math.floor(roll() * 40), i % 2 ? DUST : STONE_LIT);
}

// The lintel in place, `cracked` 0 (whole), 1 (cracks at both ends, light
// in them: it's going).
function archWhole(cracked) {
  const g = new Grid(ARCH_W, ARCH_H);
  drawPosts(g, 0);
  stoneRect(g, 28, 0, 88, LINTEL + 1, 21);
  if (cracked) {
    for (const x of [34, 109]) {
      g.line(x, 0, x + 1, LINTEL, OUT);
      g.line(x + 1, 1, x + 2, LINTEL - 1, GLOW_MID);
    }
    g.set(50, LINTEL + 3, DUST);
    g.set(96, LINTEL + 5, DUST);
  }
  return g.rows();
}
// The lintel cracking and dropping out (it goes on, held, in the hero's frames).
export const FINALE_ARCH_SPRITES = {
  a0: archWhole(0),
  a1: archWhole(1),
  a2: (() => { const g = new Grid(ARCH_W, ARCH_H); drawPosts(g, 1); drawGap(g, 0, dice(901)); return g.rows(); })(),
};

// While they hold it: the posts cracking more and more, more light and grit.
function archFail(wear) {
  const g = new Grid(ARCH_W, ARCH_H);
  drawPosts(g, 1 + wear);
  drawGap(g, wear, dice(910 + wear));
  return g.rows();
}
export const FINALE_ARCH_FAIL_SPRITES = { f0: archFail(0), f1: archFail(1), f2: archFail(2) };

// They let go: the slab drops (play `once`; the log comes in under it).
function archDrop(fall) {
  const g = new Grid(ARCH_W, ARCH_H);
  drawPosts(g, 3);
  drawGap(g, 2, dice(930 + fall));
  drawSlab(g, 0, 0, (x) => heldBottom(1)(x) + fall * (1.4 - (x - SLAB_X0) / 120));
  if (fall) {
    g.oval(36, ARCH_H - 3, 4, 2, DUST_MID);
    g.oval(106, ARCH_H - 3, 4, 2, DUST_MID);
  }
  return g.rows();
}
export const FINALE_ARCH_DROP_SPRITES = { d0: archDrop(0), d1: archDrop(5), d2: archDrop(10) };

// The log, rammed in under the lintel and shoving it back up into its
// sockets: up high, so the doorway's clear underneath. `settle` is how far
// the stone has come down onto it since (it creaks, and holds); `dust` the
// burst of the impact; `grit` still falling.
function archJam(settle, dust, grit) {
  const g = new Grid(ARCH_W, ARCH_H);
  const roll = dice(950 + settle);
  drawPosts(g, 3);
  // The lintel, back across the top, sagging onto the log.
  drawSlab(g, 0, 0, (x) => LINTEL + settle * Math.sin(((x - SLAB_X0) / (SLAB_X1 - SLAB_X0)) * Math.PI));
  // The log, wedged between the posts right under it.
  const logY = LINTEL + 1 + settle;
  drawLog(g, 36, logY, 0);
  // Chocks hammered into each post by the weight.
  for (const x of [31, 108]) {
    g.rect(x, logY + 3, 5, LOG_H - 6, OUT);
    g.rect(x + 1, logY + 4, 3, LOG_H - 8, WOOD_DK);
    g.rect(x + 1, logY + 4, 1, LOG_H - 8, WOOD);
  }
  // The bark split where it took the weight.
  if (settle) {
    g.line(70, logY + 1, 73, logY + 4, OUT);
    g.line(73, logY + 4, 76, logY + 2, OUT);
  }
  if (dust) {
    for (const [x, y, r] of [[34, logY + 10, 5], [110, logY + 8, 5], [72, logY + LOG_H + 2, 6], [52, logY + LOG_H, 3], [92, logY + LOG_H + 1, 4]]) g.oval(x, y, r, Math.max(2, r - 2), DUST_MID);
  }
  if (grit) for (let i = 0; i < 10; i++) g.set(38 + Math.floor(roll() * 68), logY + LOG_H + 1 + Math.floor(roll() * 22), i % 2 ? DUST : STONE_LIT);
  return g.rows();
}
export const FINALE_ARCH_JAM_SPRITES = { j0: archJam(0, true, true), j1: archJam(1, false, true), j2: archJam(2, false, true), j3: archJam(2, false, false) };

// The hall's wall going on over the doorway (144x16, standing on the arch's
// top edge), so you can see what the lintel carries. With the lintel gone
// (`state` 'sag') its underside over the gap hangs in tatters, bricks
// dropping out of it; 'cracked' as it's going; 'settled' back on the lintel
// once the log's under it, cracked through.
const WALL_W = 144;
const WALL_H = 16;
function archWall(state) {
  const g = new Grid(WALL_W, WALL_H);
  const roll = dice(1400 + ['whole', 'cracked', 'sag', 'settled'].indexOf(state));
  const sag = state === 'sag';
  for (let row = 0; row * 6 < WALL_H; row++) {
    const y = row * 6 - 2;
    for (let x = -((row % 2) * 6); x < WALL_W; x += 12) {
      const mid = x + 6;
      const over = mid > 34 && mid < 110;
      // Over the gap, the bottom course is gone, and some of the one above.
      if (sag && over && (row === 2 || (row === 1 && roll() < 0.35))) continue;
      const drop = sag && over && row === 1 ? Math.floor(roll() * 3) : 0;
      brick(g, x, y + drop, 12, 6, roll());
    }
  }
  // The coping along the top.
  g.rect(0, 0, WALL_W, 2, BRICK_DK);
  g.rect(0, 0, WALL_W, 1, OUT);
  if (state !== 'whole') {
    // Cracks down to each end of the lintel, and one across the middle.
    for (const x of [34, 109]) g.line(x, 2, x + 2, WALL_H - 1, OUT);
    if (state !== 'cracked') g.line(66, 3, 78, WALL_H - 3, OUT);
  }
  if (sag) for (let i = 0; i < 8; i++) g.set(38 + Math.floor(roll() * 68), WALL_H - 1 - Math.floor(roll() * 4), DUST);
  return g.rows();
}
// (Two of each still frame: an animation needs two.)
export const FINALE_ARCH_WALL_SPRITES = { w0: archWall('whole'), w1: archWall('whole') };
export const FINALE_ARCH_WALL_CRACK_SPRITES = { c0: archWall('cracked'), c1: archWall('sag') };
export const FINALE_ARCH_WALL_SETTLED_SPRITES = { s0: archWall('settled'), s1: archWall('settled') };

// =====================================================================
// 12. The brick wall at the head of the hall, and Bramble through it
// =====================================================================
// The hall's own end wall (its colours), bricked up across an old tunnel.
// Bramble comes through it on his log: it cracks, bulges, bursts, and leaves
// a ragged hole on the dark tunnel, the bricks flying out over the floor
// (finale_bricks, below).
const TUNNEL_W = 96;
const TUNNEL_H = 48;

// A brick (w by h) with a lit top and a dark foot.
function brick(g, x, y, w, h, tone = 0) {
  g.rect(x, y, w, h, OUT);
  g.rect(x + 1, y + 1, Math.max(1, w - 2), Math.max(1, h - 2), tone > 0.66 ? BRICK_LIT : tone < 0.2 ? BRICK_DK : BRICK);
  if (w > 3) g.rect(x + 1, y + 1, w - 2, 1, BRICK_LIT);
}

// How far the hole is open at each stage (half its width at the bottom).
const HOLE = [0, 0, 26, 38];
function tunnelFrame(stage) {
  const g = new Grid(TUNNEL_W, TUNNEL_H);
  const roll = dice(1200 + stage);
  const cx = TUNNEL_W / 2;
  const half = HOLE[stage];
  // An arch-shaped hole, open at the floor, ragged at its edge by whole bricks.
  const inHole = (x, y) => half > 0 && Math.abs(x - cx) < half * Math.sqrt(Math.max(0, 1 - ((TUNNEL_H - y) / (half * 1.05)) ** 2));
  // Courses of bricks, staggered; a brick is left out if its middle is in the
  // hole. On the bulge (stage 1) the middle ones are pushed out of line.
  for (let row = 0; row * 6 < TUNNEL_H; row++) {
    const y = row * 6;
    for (let x = -((row % 2) * 6); x < TUNNEL_W; x += 12) {
      const mx = x + 6;
      const my = y + 3;
      if (inHole(mx, my)) continue;
      const near = Math.hypot(mx - cx, (my - 34) * 1.4);
      const push = stage === 1 && near < 22 ? Math.round((22 - near) / 9) : 0;
      brick(g, x + (mx < cx ? -push : push), y - push, 12, 6, roll());
    }
  }
  // The tunnel through the hole: dark, a glimmer far up it.
  for (let y = 0; y < TUNNEL_H; y++) for (let x = 0; x < TUNNEL_W; x++) {
    if (!inHole(x, y)) continue;
    g.set(x, y, y > TUNNEL_H - 8 && stage >= 3 ? STONE_VDK : OUT);
  }
  if (stage >= 3) {
    g.set(cx, TUNNEL_H - 26, GLOW_MID);
    g.set(cx, TUNNEL_H - 25, GLOW);
  }
  // Cracks running out from where he'll come through.
  if (stage <= 1) {
    for (const [dx, dy] of [[-1, -0.6], [1, -0.7], [-1.2, 0.3], [1.1, 0.4], [0.1, -1]]) {
      let x = cx;
      let y = 36;
      for (let i = 0; i < (stage ? 18 : 9); i++) {
        x += dx + (roll() - 0.5);
        y += dy + (roll() - 0.5);
        g.set(Math.round(x), Math.round(y), OUT);
      }
    }
    // Mortar dust puffing from the cracks.
    for (let i = 0; i < 4 + stage * 6; i++) g.set(cx - 20 + Math.floor(roll() * 40), 22 + Math.floor(roll() * 24), DUST);
  }
  return g.rows();
}
export const FINALE_TUNNEL_SPRITES = { t0: tunnelFrame(0), t1: tunnelFrame(1), t2: tunnelFrame(2), t3: tunnelFrame(3) };

// The bricks he knocks out, flying out of the wall and strewn over the floor
// of the hall (160x96, lying flat: its top edge is the foot of the wall, the
// hole in the middle). b0 to b4 in the air, b5 where they come to rest.
const BRICKS_W = 160;
const BRICKS_H = 96;
const FLYING = (() => {
  const roll = dice(1290);
  return Array.from({ length: 46 }, (_, i) => {
    const a = (roll() - 0.5) * 2.4;
    const far = 14 + roll() * 76;
    return {
      x0: BRICKS_W / 2 + (roll() - 0.5) * 50,
      x1: BRICKS_W / 2 + Math.sin(a) * far * 1.25,
      y1: 4 + Math.cos(a) * far,
      up: 6 + roll() * 16,
      half: i % 3 === 0,
      side: roll() > 0.5,
      tone: roll(),
      late: roll() * 0.3,
    };
  });
})();
function bricksFrame(t) {
  const g = new Grid(BRICKS_W, BRICKS_H);
  const roll = dice(1300 + Math.round(t * 10));
  for (const b of FLYING) {
    const k = Math.max(0, Math.min(1, (t - b.late) / (1 - b.late)));
    if (k === 0) continue;
    const x = b.x0 + (b.x1 - b.x0) * k;
    const y = b.y1 * k - Math.sin(k * Math.PI) * b.up;
    const w = b.half ? 6 : 10;
    // Tumbling in the air: end on, side on.
    const turned = k < 1 ? Math.floor(k * 6 + b.tone * 3) % 2 === 1 : b.side;
    if (y < 0) continue;
    brick(g, Math.round(x), Math.round(y), turned ? 5 : w, turned ? w - 2 : 5, b.tone);
  }
  // Mortar dust and chips, thinning as they settle.
  const dust = t < 1 ? 26 : 12;
  for (let i = 0; i < dust; i++) {
    const a = (roll() - 0.5) * 2.4;
    const r = roll() * 80 * Math.min(1, t + 0.2);
    g.set(BRICKS_W / 2 + Math.sin(a) * r * 1.2, 2 + Math.cos(a) * r, i % 3 ? DUST : BRICK_DK);
  }
  if (t < 0.6) for (const [x, y, r] of [[BRICKS_W / 2, 4, 14], [BRICKS_W / 2 - 18, 10, 7], [BRICKS_W / 2 + 18, 9, 7]]) g.oval(x, y, r * (0.6 + t), Math.max(2, r * 0.5), DUST_MID);
  return g.rows();
}
export const FINALE_BRICKS_SPRITES = Object.fromEntries([0.15, 0.35, 0.55, 0.75, 0.9, 1].map((t, i) => [`b${i}`, bricksFrame(t)]));

// =====================================================================
// 13. The bump the log hits, and what's left of the king
// =====================================================================
// A fallen lump of roof lying on the carpet (24x14): whole, then kicked to bits.
function bump(broken) {
  const g = new Grid(24, 14);
  if (!broken) {
    g.oval(12, 9, 10, 5, STONE_DK);
    g.oval(12, 8, 9, 4, STONE);
    g.oval(10, 6, 5, 2, STONE_LIT);
    g.line(14, 5, 17, 10, STONE_VDK);
    g.set(8, 9, STONE_VDK);
    g.outline(OUT);
  } else {
    for (const [x, y, r] of [[5, 10, 3], [12, 11, 2], [19, 10, 3], [9, 5, 2], [16, 4, 2], [3, 6, 1], [21, 5, 1]]) g.oval(x, y, r, Math.max(1, r - 1), r > 1 ? STONE : STONE_LIT);
    g.outline(OUT);
    for (const [x, y] of [[7, 2], [13, 1], [18, 2]]) g.set(x, y, DUST);
  }
  return g.rows();
}
export const FINALE_BUMP_SPRITES = { whole: bump(false), broken: bump(true) };

// King Peptup, beaten: a heap of painted planks on the dais with the paper
// crown on top (40x22; the crown rocks).
function planks(rock) {
  const g = new Grid(40, 22);
  const grey = P('#8a8296');
  const grey_lit = P('#b0a8be');
  const paint = P('#f2ead8');
  const dark = P('#4a4258');
  const gold = P('#e8b830');
  const gold_lit = P('#fff0a0');
  // Planks, every which way.
  const board = (x0, y0, x1, y1, c) => {
    g.line(x0, y0 - 1, x1, y1 - 1, dark);
    g.line(x0, y0, x1, y1, c);
    g.line(x0, y0 + 1, x1, y1 + 1, c);
    g.line(x0, y0 + 2, x1, y1 + 2, dark);
  };
  board(3, 18, 30, 15, grey);
  board(8, 14, 36, 17, grey_lit);
  board(5, 12, 22, 19, grey);
  board(20, 11, 34, 19, grey_lit);
  board(10, 9, 28, 12, grey);
  for (const [x, y] of [[9, 16], [16, 14], [25, 16], [30, 14], [14, 11], [23, 10]]) g.rect(x, y, 3, 1, paint);
  g.rect(33, 17, 3, 2, P('#2a2630'));
  g.set(34, 17, paint);
  // The crown, a bit squashed.
  const lean = rock ? 1 : 0;
  g.rect(14 + lean, 3, 10, 6, dark);
  g.rect(15 + lean, 5, 8, 3, gold);
  for (const x of [15, 18, 21]) {
    g.rect(x + lean, 2, 2, 3, dark);
    g.rect(x + lean, 3, 2, 2, gold);
  }
  g.set(16 + lean, 3, gold_lit);
  g.set(19 + lean, 6, gold_lit);
  // A loose bit of paper.
  g.set(6, 8, paint);
  g.set(7, 8, paint);
  g.outline(OUT);
  return g.rows();
}
export const FINALE_PLANKS_SPRITES = { still: planks(false), rock: planks(true) };

// =====================================================================
// 14. Up the long rope (src/overworld/ropeClimb.js)
// =====================================================================
// Each of you from behind on a rope that runs down the middle of the frame
// (its two columns, 12 and 13 of 26, are left clear for the world's rope to
// show through between your hands and your feet). Three sets apiece, all 26x30
// and all standing on the same bottom row:
//   _rope_x         the climb: reach, pull, reach with the other hand, pull (4 frames)
//   _rope_x_hang    hanging still, a leg swinging (2 frames)
//   _rope_x_ready   waiting at the foot, fists up, about to take hold (2 frames)
// `rows` are a back view in the character's own colours, down to the hip row;
// the arms and legs are drawn here, behind and below it.
const ROPE_W = 26;
const ROPE_H = 30;
const ROPE_HIP = 24;
const rope_c = P('#c8a46a');
const rope_d = P('#a07c48');

// A limb: a line, one pixel thick (or two).
function limb(g, x0, y0, x1, y1, c, thick = 1) {
  g.line(x0, y0, x1, y1, c);
  if (thick > 1) g.line(x0 + 1, y0, x1 + 1, y1, c);
}

function ropeFigure(spec, pose) {
  const { rows, ox, hipRow, shoulder, arm, forearm, hand, legs, extra } = spec;
  const oy = ROPE_HIP - hipRow;
  const g = new Grid(ROPE_W, ROPE_H);
  const top = oy + spec.headTop;
  const body = remap(rows, spec.pal);
  // Arms, behind the body: [hand height above the head's top, elbow out].
  // The elbows stand clear of the head either side, the forearms going up and
  // in to the rope; or, waiting, the fists are held up by the head.
  if (pose.arms) {
    pose.arms.forEach(([rel, flare], i) => {
      const side = i ? 1 : -1;
      const sx = ox + shoulder[i][0] + (i ? 1 : 0);
      const sy = oy + shoulder[i][1];
      const hx = pose.ready ? sx + side * 3 - (i ? 0 : 1) : i ? 13 : 11;
      const hy = top + rel;
      const ex = sx + side * flare;
      const ey = top + Math.round(pose.ready ? 6 : 4 + flare);
      limb(g, hx + (i ? 1 : 0), hy + 2, ex, ey, forearm);
      limb(g, ex, ey, sx, sy, arm);
      g.rect(hx, hy, 2, 2, hand);
    });
  }
  g.paste(body, ox, oy);
  extra?.(g, ox, oy, pose);
  // Legs: [how far the knee is drawn up and out, 0 to 2].
  const { pants, boot, w, bw, left, right } = legs;
  [[left, -1, pose.legs?.[0] ?? 0], [right, 1, pose.legs?.[1] ?? 0]].forEach(([hx, side, r]) => {
    const x = ox + hx;
    const yh = oy + hipRow;
    const out = r ? 1 : 0;
    const col = (shift, width) => (side < 0 ? x + shift * side : x + shift * side - (width - w));
    g.rect(col(0, w), yh + 1, w, 1, pants);
    g.rect(col(out, w), yh + 2, w, r === 2 ? 1 : 1, pants);
    // Boots: down below, or tucked up and in against the rope.
    const bx = side < 0 ? x + (r === 2 ? 2 : r ? 1 : 0) : x - (bw - w) - (r === 2 ? 2 : r ? 1 : 0);
    g.rect(bx, yh + (r ? 2 : 3), bw, 1, boot);
    if (!r) g.rect(bx, yh + 2, bw, 1, boot);
    if (r) g.rect(bx, yh + 3, bw, 0, boot);
  });
  g.outline(OUT);
  return g.rows();
}

const armPose = (k) => {
  // The left hand's height, and the right's half a cycle on.
  const h = [-4, -3, -1, 0];
  const f = [0, 1, 1, 0];
  return [[h[k], f[k]], [h[(k + 2) % 4], f[(k + 2) % 4]]];
};
const legPose = (k) => [[2, 1, 0, 1][k], [0, 1, 2, 1][k]];
const climbFrames = (spec) => ({
  c0: ropeFigure(spec, { arms: armPose(0), legs: legPose(0) }),
  c1: ropeFigure(spec, { arms: armPose(1), legs: legPose(1) }),
  c2: ropeFigure(spec, { arms: armPose(2), legs: legPose(2) }),
  c3: ropeFigure(spec, { arms: armPose(3), legs: legPose(3) }),
});
const hangFrames = (spec) => ({
  h0: ropeFigure(spec, { arms: [[-3, 1], [-3, 1]], legs: [1, 0] }),
  h1: ropeFigure(spec, { arms: [[-3, 1], [-3, 1]], legs: [0, 1] }),
});
const readyFrames = (spec) => ({
  r0: ropeFigure(spec, { arms: [[3, 3], [3, 3]], legs: [0, 0], ready: true }),
  r1: ropeFigure(spec, { arms: [[2, 3], [2, 3]], legs: [0, 0], ready: true }),
});

const HERO_ROPE = {
  pal: PLAYER_PALETTE,
  rows: PLAYER_SPRITES.upIdle.slice(0, 16).map((row, y) => (y >= 11 ? row.replace('s', 'c').replace(/s(?=k$)/, 'c') : row)),
  ox: 7, hipRow: 15, headTop: 0,
  shoulder: [[2, 11], [10, 11]],
  arm: PLAYER_C('c'), forearm: PLAYER_C('c'), hand: PLAYER_C('s'),
  legs: { pants: PLAYER_C('p'), boot: PLAYER_C('b'), w: 2, bw: 2, left: 2, right: 8 },
};
const VES_ROPE = {
  pal: VES_PALETTE,
  rows: VES_FRAMES.upIdle.slice(6, 23).map((row) => row.slice(0, 13) + '...'),
  ox: 5, hipRow: 16, headTop: 0,
  shoulder: [[4, 9], [11, 9]],
  arm: P(VES_PALETTE.G), forearm: P(VES_PALETTE.G), hand: MITT,
  legs: { pants: P(VES_PALETTE.Z), boot: P(VES_PALETTE.Z), w: 1, bw: 2, left: 5, right: 10 },
  extra: (g, ox, oy) => {
    // The umbrella, furled, across her back.
    limb(g, ox + 4, oy + 14, ox + 10, oy + 6, UMB, 2);
    g.line(ox + 5, oy + 14, ox + 11, oy + 6, UMB_RIB);
    g.line(ox + 3, oy + 16, ox + 4, oy + 14, SHAFT);
    g.set(ox + 3, oy + 17, SHAFT);
  },
};
const BRAMBLE_ROPE = {
  pal: BRAMBLE_PALETTE,
  rows: [
    ...BRAMBLE_FRAMES.upIdle.slice(1, 12).map((row) => row.slice(5, 15).padEnd(10, '.')),
    '.33U33U3..'.replace(/\./g, '.'),
    '.3U33U33..',
    '.33U33U3..',
    '.ZZZZZZZ..',
    '.DDwDDDD..',
  ],
  ox: 8, hipRow: 15, headTop: 0,
  shoulder: [[1, 12], [8, 12]],
  arm: P(BRAMBLE_PALETTE['3']), forearm: P(BRAMBLE_PALETTE['3']), hand: P(BRAMBLE_PALETTE.C),
  legs: { pants: P(BRAMBLE_PALETTE.D), boot: P(BRAMBLE_PALETTE[')']), w: 2, bw: 2, left: 2, right: 6 },
  extra: (g, ox, oy) => {
    // The hatchet through his belt at the back, handle down, head up by his shoulder.
    g.line(ox + 6, oy + 15, ox + 6, oy + 12, P(BRAMBLE_PALETTE.w));
    g.rect(ox + 6, oy + 11, 3, 2, P(BRAMBLE_PALETTE.M));
    g.set(ox + 8, oy + 11, P(BRAMBLE_PALETTE.S));
    g.set(ox + 8, oy + 12, P(BRAMBLE_PALETTE.S));
    g.set(ox + 6, oy + 12, P(BRAMBLE_PALETTE.O));
  },
};
export const FINALE_ROPE_HERO_SPRITES = climbFrames(HERO_ROPE);
export const FINALE_ROPE_HERO_HANG_SPRITES = hangFrames(HERO_ROPE);
export const FINALE_ROPE_HERO_READY_SPRITES = readyFrames(HERO_ROPE);
export const FINALE_ROPE_VES_SPRITES = climbFrames(VES_ROPE);
export const FINALE_ROPE_VES_HANG_SPRITES = hangFrames(VES_ROPE);
export const FINALE_ROPE_VES_READY_SPRITES = readyFrames(VES_ROPE);
export const FINALE_ROPE_BRAMBLE_SPRITES = climbFrames(BRAMBLE_ROPE);
export const FINALE_ROPE_BRAMBLE_HANG_SPRITES = hangFrames(BRAMBLE_ROPE);
export const FINALE_ROPE_BRAMBLE_READY_SPRITES = readyFrames(BRAMBLE_ROPE);

// =====================================================================
// 15. Bramble hanging on the back of a mine cart (src/overworld/carts.js)
// =====================================================================
// When all three ride, he's not in the cart: he's hanging on to the back
// of it, hair whipping, legs flailing out behind in the wind. Three frames
// of flailing for each way the cart can go (finale_bramble_cart_side: going
// right, 24x16, hands on the right; _down: going down the screen, he's
// above the cart looking at you, 16x22; _up: going up, he's below it and
// you see his back, 16x20; the left ride is the right one turned round).
const CTROUSER = P('#7a5a3a');
const CBOOT = P('#3a2418');
const CSOLE = P('#5a3a1e');
const CDARK = P('#120c1c');
function bootAt(g, x, y) {
  g.rect(x - 1, y, 3, 2, CBOOT);
  g.set(x - 1, y + 1, CSOLE);
  g.set(x, y + 1, CSOLE);
  g.set(x + 1, y + 1, CSOLE);
}
function trousered(g, x0, y0, x1, y1, x2, y2) {
  limb(g, x0, y0, x1, y1, CTROUSER, 2);
  limb(g, x1, y1, x2, y2, CTROUSER, 2);
  bootAt(g, x2, y2);
}
function flannelBlock(g, x, y, w, h) {
  g.rect(x, y, w, h, FLANNEL);
  for (let i = 2; i < w; i += 3) for (let j = 0; j < h; j++) g.set(x + i, y + j, FLANNEL_DK);
  for (let j = 2; j < h; j += 3) for (let i = 0; i < w; i++) g.set(x + i, y + j, FLANNEL_BK);
}
function brambleCartSide(k) {
  const g = new Grid(24, 16);
  const flap = [0, 1, 2][k];
  // Legs streaming out behind.
  const legs = [[[3, 5, 0, 2], [3, 10, 1, 12]], [[3, 7, 0, 6], [3, 10, 0, 10]], [[3, 8, 0, 10], [3, 9, 1, 6]]][k];
  for (const [kx, ky, fx, fy] of legs) trousered(g, 6, fy < 8 ? 7 : 8, kx, ky, fx, fy);
  g.rect(5, 6, 4, 4, CTROUSER);
  flannelBlock(g, 8, 6, 8, 4);
  // Arms out to the rim.
  limb(g, 15, 7, 22, 8, FLANNEL);
  limb(g, 15, 8, 22, 9, FLANNEL_DK);
  g.rect(22, 8, 2, 2, SKIN);
  // Hair flying back.
  const spikes = [[16, 3, 11, 2 + flap], [16, 4, 10, 4 - (flap % 2)], [16, 5, 11, 6 - flap % 2], [16, 6, 12, 7 + flap]];
  for (const [x0, y0, x1, y1] of spikes) { g.line(x0, y0, x1, y1, HAIR); g.line(x0 + 1, y0 + 1, x1 + 3, y1 + 1, HAIR_LIT); }
  g.oval(19, 6, 3, 3, SKIN);
  g.rect(16, 3, 6, 3, HAIR);
  g.rect(16, 5, 2, 4, HAIR);
  g.set(20, 3, HAIR_LIT);
  g.set(21, 6, CDARK);
  g.rect(21, 8, 1, 1, CDARK);
  g.outline(OUT);
  return g.rows();
}
function brambleCartDown(k) {
  const g = new Grid(16, 22);
  const legs = [[[3, 3, 0, 1], [12, 4, 14, 4]], [[3, 3, 1, 0], [12, 3, 14, 1]], [[3, 4, 1, 3], [12, 3, 15, 0]]][k];
  trousered(g, 6, 7, ...legs[0]);
  trousered(g, 9, 7, ...legs[1]);
  g.rect(5, 6, 6, 3, CTROUSER);
  flannelBlock(g, 5, 9, 6, 7);
  limb(g, 5, 12, 1, 18, FLANNEL, 2);
  limb(g, 10, 12, 14, 18, FLANNEL, 2);
  g.rect(0, 18, 2, 2, SKIN);
  g.rect(14, 18, 2, 2, SKIN);
  const up = [0, 1, 0][k];
  for (const [x, y, dx] of [[5, 15, -2], [7, 14, -1], [9, 14, 1], [11, 15, 2]]) g.line(x, y, x + dx, y - 2 - up, HAIR);
  g.oval(8, 18, 3, 3, SKIN);
  g.rect(5, 15, 7, 2, HAIR);
  g.set(7, 15, HAIR_LIT);
  g.set(6, 18, CDARK);
  g.set(10, 18, CDARK);
  g.rect(7, 20, 3, 1, CDARK);
  g.outline(OUT);
  return g.rows();
}
function brambleCartUp(k) {
  const g = new Grid(16, 20);
  const legs = [[[3, 16, 0, 15], [12, 18, 13, 19]], [[3, 18, 1, 19], [12, 18, 14, 19]], [[3, 18, 2, 19], [12, 16, 15, 14]]][k];
  trousered(g, 6, 15, ...legs[0]);
  trousered(g, 9, 15, ...legs[1]);
  g.rect(5, 13, 6, 3, CTROUSER);
  flannelBlock(g, 4, 8, 8, 5);
  limb(g, 4, 9, 1, 2, FLANNEL, 2);
  limb(g, 11, 9, 14, 2, FLANNEL, 2);
  g.rect(0, 0, 2, 2, SKIN);
  g.rect(14, 0, 2, 2, SKIN);
  g.oval(8, 6, 3, 3, HAIR);
  const up = [0, 1, 2][k];
  for (const [x, dx] of [[5, -1], [7, 0], [9, 0], [11, 1]]) g.line(x, 4, x + dx, 1 + up % 2, HAIR);
  g.set(6, 5, HAIR_LIT);
  g.set(7, 4, HAIR_LIT);
  g.set(10, 8, HAIR_DK);
  g.rect(6, 9, 4, 1, SKIN);
  g.outline(OUT);
  return g.rows();
}
export const FINALE_BRAMBLE_CART_SIDE_SPRITES = { a: brambleCartSide(0), b: brambleCartSide(1), c: brambleCartSide(2) };
export const FINALE_BRAMBLE_CART_DOWN_SPRITES = { a: brambleCartDown(0), b: brambleCartDown(1), c: brambleCartDown(2) };
export const FINALE_BRAMBLE_CART_UP_SPRITES = { a: brambleCartUp(0), b: brambleCartUp(1), c: brambleCartUp(2) };

// =====================================================================
export const FINALE_PALETTE = palette;
