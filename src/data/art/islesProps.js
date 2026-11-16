// Props for Chapter 5's Beacon Isles. Drawn like lanesProps.js: rows of characters from a small
// painter, 16 pixels to a tile, standing on the bottom edge and centred over their footprint.
// Every id starts `il_`. Ones that move are also animations: put the prop's name in the object's
// `animation` too (and a `speed`).
//
//   il_light_tower        a little lighthouse on its own rock: white with a red band, an iron
//                         gallery, the lantern's glass dark. The lit lamp is drawn over the
//                         glass by the room's sweeping lamp (lamps.js `art: 'lens'`), so a lamp
//                         that's shuttered just shows the dark glass. The lantern's middle is
//                         58 px above the foot: put the lamp three tiles above the prop's tile.
//   il_light_tower_old    the same tower, long out of use: rust, a cracked pane, a door at the
//                         foot (a room's door goes on its tile; lay it `walkable`)
//   il_dead_lens          the old light's great lens on its pedestal, grey with dust (2 wide)
//   il_tea_table*         a little table under the lightroom window: a lit lantern, and a cup of
//                         tea with the steam still coming off it (2 wide; speed about 0.3)
//   il_shutter_crank      a winch on a post with a pulley; its chain runs up to the lamp's
//   il_shutter_crank_on   shutter. The _on look has the handle round and the chain taut
//   il_light_shaft*       the big light's beam coming down through the forge's high window:
//                         a pale column with dust in it (lay it `flat, walkable`; speed 0.3)
//   il_cave_crack         a low dark gap in the cliff's foot, half behind a fallen slab and weed (1 tile)
//   il_far_light          Haddock's Light, far off across the water: a white tower, one warm
//                         window (stands on the sea; no footprint of its own to walk into)
//   il_note_tidy          a scrap of paper under a pebble (flat)
//   il_broom              a broom standing in a bucket
//   il_shell_row          shells set out in a neat row by size (flat)
//   il_logbook            the old light's logbook on a lectern
//   il_lantern_glass      the old lightroom's glass, all round: tall panes in an iron frame on a
//   il_lantern_glass_cracked  brick sill, the storm outside (2 wide; lay them side by side on
//   il_lantern_glass_salt     the wall row). One pane starred; salt crusted in the corners.
//   il_lantern_glass_corner   the glass turning the north-west corner (and _corner_r the north-east),
//                             two panes stepping back to the side wall (2 wide).

const colors = new Map();
const palette = {};
function char(hex) {
  if (!colors.has(hex)) {
    const c = String.fromCharCode(0xf500 + colors.size);
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

  rect(x, y, w, h, c) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, c);
  }

  get(x, y) {
    return x >= 0 && y >= 0 && x < this.w && y < this.h ? this.cells[y][x] : null;
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

  // A dark rim round everything drawn so far.
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

const frames = (fn, n) => Object.fromEntries(Array.from({ length: n }, (_, i) => [`f${i + 1}`, fn(i)]));

const WHITE = ['#8a887c', '#b8b4a4', '#d8d4c4', '#ece8da'];
const RED = ['#6a2624', '#9a3c34', '#b8524a'];
const IRON = ['#1c2026', '#2e343c', '#4a5260', '#6a7480'];
const GLASS = ['#16303a', '#22444e', '#3a6670', '#8ab8b4'];
const ROCK = ['#26302e', '#3c4a46', '#52625e', '#6a7a74'];
const WEED = ['#2e5030', '#3c6a38', '#5a8a4a'];
const RUST = ['#5a3420', '#8a4c2a'];
const WOOD = ['#3a2a1c', '#5a4430', '#7a6046', '#9a7c5a'];
const LAMP = ['#c88a30', '#ffc860', '#fff0b0', '#fffbe6'];
const DUST = ['#9a968a', '#b4b0a2', '#cfcabb'];
const PAPER = ['#cfc6ae', '#e8e0c8'];

// --- The little lighthouse ---------------------------------------------
// 28 wide, 76 high. The rock it stands on (the bottom 10 rows), the tower tapering from 14 to 10
// wide, a red band, the gallery, the lantern (glass at rows 14-24, its middle 58 px above the
// foot), and the cap.
function tower(old) {
  const g = new Grid(28, 76);
  const cx = 14;
  // The rock, wet, with weed at the waterline.
  for (let y = 64; y < 76; y++) {
    const half = Math.min(13, 7 + (y - 64));
    for (let x = cx - half; x < cx + half; x++) {
      const edge = x === cx - half || x === cx + half - 1;
      g.set(x, y, y > 72 ? WEED[(x + y) % 2] : edge ? ROCK[0] : (x + y) % 5 === 0 ? ROCK[3] : ROCK[(x * 3 + y) % 2 + 1]);
    }
  }
  // The tower: tapering, lit from the left.
  for (let y = 26; y < 66; y++) {
    const half = Math.round(5 + ((y - 26) / 40) * 2.5);
    for (let x = cx - half; x < cx + half; x++) {
      const t = (x - (cx - half)) / (2 * half);
      let c = t < 0.25 ? WHITE[3] : t < 0.7 ? WHITE[2] : t < 0.9 ? WHITE[1] : WHITE[0];
      if (y >= 40 && y < 47) c = t < 0.25 ? RED[2] : t < 0.8 ? RED[1] : RED[0];
      if (old && ((x * 7 + y * 3) % 23 === 0 || (y > 48 && (x * 5 + y) % 17 === 0))) c = RUST[(x + y) % 2];
      g.set(x, y, c);
    }
  }
  // Rust weeping down from the gallery on the old one.
  if (old) for (let y = 27; y < 38; y++) { g.set(cx - 3, y, RUST[1]); if (y < 33) g.set(cx + 2, y, RUST[0]); }
  // A small window half way up, and the door at the foot.
  g.rect(cx - 1, 34, 2, 3, old ? IRON[0] : LAMP[0]);
  g.rect(cx - 2, 56, 4, 9, WOOD[1]);
  g.rect(cx - 2, 56, 4, 1, WOOD[3]);
  g.set(cx + 1, 61, old ? RUST[1] : LAMP[1]);
  // The gallery: a ledge and a rail on posts.
  g.rect(cx - 8, 25, 16, 2, IRON[1]);
  g.rect(cx - 8, 25, 16, 1, IRON[3]);
  g.rect(cx - 8, 21, 16, 1, IRON[2]);
  for (let x = cx - 8; x <= cx + 7; x += 3) g.rect(x, 21, 1, 4, IRON[2]);
  // The lantern: iron frame and glass.
  g.rect(cx - 6, 12, 12, 13, IRON[1]);
  for (let y = 13; y < 24; y++) {
    for (let x = cx - 5; x < cx + 5; x++) {
      const pane = (x - (cx - 5)) % 4 === 3;
      g.set(x, y, pane ? IRON[0] : y < 16 ? GLASS[2] : GLASS[y % 3 === 0 ? 1 : 0]);
    }
  }
  g.set(cx - 4, 14, GLASS[3]); g.set(cx - 4, 15, GLASS[3]); g.set(cx - 3, 14, GLASS[3]);
  if (old) { g.set(cx + 2, 17, IRON[0]); g.set(cx + 3, 18, IRON[0]); g.set(cx + 2, 19, GLASS[3]); g.set(cx + 4, 16, IRON[0]); }
  // The cap: a dome, a ball and a vane rod.
  for (let y = 6; y < 12; y++) {
    const half = Math.round(2 + (y - 6) * 0.9);
    for (let x = cx - half; x < cx + half; x++) g.set(x, y, x < cx - half + 2 ? IRON[3] : old ? (x % 3 ? IRON[1] : RUST[0]) : IRON[2]);
  }
  g.rect(cx - 1, 2, 2, 4, IRON[2]);
  g.rect(cx - 1, 1, 2, 1, IRON[3]);
  return g.rows();
}

// --- The old light, up on its shelf ---------------------------------------
// 36 wide, 80 high (5 tiles, about four heroes), a stone plinth, a door the size of a door, a red band,
// the gallery, the lantern (dark and cracked) and the cap. Stands on its foot tile (the door's).
function towerOld() {
  const g = new Grid(36, 80);
  const cx = 18;
  // Plinth: two courses of big stones, with a step to the door.
  g.rect(1, 75, 34, 5, ROCK[1]);
  g.rect(1, 75, 34, 1, ROCK[3]);
  g.rect(3, 71, 30, 4, ROCK[2]);
  g.rect(3, 71, 30, 1, ROCK[3]);
  for (let x = 4; x < 34; x += 7) g.rect(x, 76, 1, 4, ROCK[0]);
  g.rect(cx - 7, 77, 14, 3, ROCK[3]);
  // The tower: tapering, lit from the left, rust weeping through the paint.
  for (let y = 24; y < 72; y++) {
    const half = Math.round(10 + ((y - 24) / 48) * 4);
    for (let x = cx - half; x < cx + half; x++) {
      const t = (x - (cx - half)) / (2 * half);
      let c = t < 0.25 ? WHITE[3] : t < 0.7 ? WHITE[2] : t < 0.9 ? WHITE[1] : WHITE[0];
      if (y >= 34 && y < 42) c = t < 0.25 ? RED[2] : t < 0.8 ? RED[1] : RED[0];
      if ((x * 7 + y * 3) % 19 === 0 || (y > 46 && (x * 5 + y) % 13 === 0)) c = RUST[(x + y) % 2];
      g.set(x, y, c);
    }
  }
  for (let y = 25; y < 36; y++) { g.set(cx - 5, y, RUST[1]); if (y < 32) g.set(cx + 4, y, RUST[0]); }
  // Two narrow windows, and the door: wide enough and tall enough for somebody, standing a little open.
  for (const wy of [28, 44]) { g.rect(cx - 1, wy, 3, 6, IRON[0]); g.set(cx, wy, IRON[2]); }
  g.rect(cx - 5, 53, 10, 24, IRON[0]);
  g.rect(cx - 4, 54, 8, 23, WOOD[1]);
  g.rect(cx - 4, 54, 8, 1, WOOD[3]);
  g.rect(cx - 4, 62, 8, 1, WOOD[0]);
  g.rect(cx - 4, 54, 2, 23, WOOD[2]);
  g.rect(cx + 1, 65, 1, 2, RUST[1]);
  g.rect(cx + 2, 54, 2, 23, IRON[0]);
  // The gallery: a ledge on brackets, a rail on posts.
  g.rect(cx - 13, 22, 26, 3, IRON[1]);
  g.rect(cx - 13, 22, 26, 1, IRON[3]);
  g.rect(cx - 13, 16, 26, 1, IRON[2]);
  for (let x = cx - 13; x <= cx + 12; x += 4) g.rect(x, 16, 1, 6, IRON[2]);
  // The lantern: iron frame, dark cracked glass.
  g.rect(cx - 8, 5, 16, 11, IRON[1]);
  for (let y = 6; y < 15; y++) for (let x = cx - 7; x < cx + 7; x++) g.set(x, y, (x - (cx - 7)) % 5 === 4 ? IRON[0] : GLASS[y % 3 === 0 ? 1 : 0]);
  g.set(cx - 5, 7, GLASS[3]); g.set(cx - 5, 8, GLASS[3]); g.set(cx - 4, 7, GLASS[3]);
  g.set(cx + 2, 9, IRON[0]); g.set(cx + 3, 10, IRON[0]); g.set(cx + 2, 11, GLASS[3]);
  // The cap and its vane rod.
  for (let y = 1; y < 5; y++) { const half = 3 + (y - 1) * 2; for (let x = cx - half; x < cx + half; x++) g.set(x, y, x < cx - half + 2 ? IRON[3] : x % 3 ? IRON[1] : RUST[0]); }
  g.rect(cx - 1, 0, 2, 2, IRON[2]);
  g.outline(OUT);
  return g.rows();
}

// --- The dead lens ------------------------------------------------------
function deadLens() {
  const g = new Grid(32, 36);
  // An iron pedestal and its foot.
  g.rect(6, 32, 20, 4, IRON[1]);
  g.rect(6, 32, 20, 1, IRON[3]);
  g.rect(12, 24, 8, 8, IRON[1]);
  g.rect(12, 24, 2, 8, IRON[2]);
  // The lens: a barrel of glass rings, brass bands, grey with dust.
  for (let y = 2; y < 25; y++) {
    const half = 11 - Math.round(Math.abs(y - 13) * 0.25);
    for (let x = 16 - half; x < 16 + half; x++) {
      const ring = (y - 2) % 4 === 0;
      const t = (x - (16 - half)) / (2 * half);
      let c = ring ? '#8a7a4a' : t < 0.3 ? '#7a8a86' : t < 0.75 ? '#5e6e6a' : '#46524e';
      if (!ring && (x * 5 + y * 3) % 7 === 0) c = DUST[(x + y) % 3];
      g.set(x, y, c);
    }
  }
  // Dust on its top, and a cobweb from the band to the pedestal.
  g.rect(8, 1, 16, 1, DUST[2]);
  g.rect(10, 0, 12, 1, DUST[1]);
  for (let i = 0; i < 6; i++) { g.set(5 + i, 24 + i, DUST[2]); g.set(5 + i, 30 - i, DUST[1]); }
  return g.rows();
}

// --- The old lightroom: the corner glass and the tea table -----------------
// The lantern glass turning a corner (the old lightroom is eight-sided): two
// panes stepping back and down from the north glass to the side wall, each a
// little darker than the last as it turns away from the light. 2 wide; stand
// `il_lantern_glass_corner` on the room's north-west corner and `_corner_r`
// on the north-east (foot one row below the north glass).
function cornerGlass(right) {
  const g = new Grid(32, 50);
  const pane = (x0, top, w, dark) => {
    const frame = dark ? IRON[0] : IRON[1];
    const sillTop = top + 25;
    // The sill: two courses of brick.
    for (let r = 0; r < 2; r++) {
      for (let bx = x0 + (r % 2 ? -4 : 0); bx < x0 + w; bx += 8) {
        const a = Math.max(x0, bx);
        const b = Math.min(bx + 7, x0 + w);
        if (b <= a) continue;
        g.rect(a, sillTop + 1 + r * 4, b - a, 3, ROCK[dark ? 1 : 2]);
        g.rect(a, sillTop + 1 + r * 4, b - a, 1, ROCK[dark ? 2 : 3]);
      }
    }
    g.rect(x0, sillTop, w, 1, IRON[0]);
    // Rails and mullions, and the glass between.
    g.rect(x0, top, w, 2, frame);
    g.rect(x0, top, w, 1, IRON[dark ? 2 : 3]);
    g.rect(x0, top + 23, w, 2, frame);
    g.rect(x0, top + 12, w, 1, frame);
    for (let x = x0; x < x0 + w; x += 8) g.rect(x, top + 2, 2, 21, frame);
    g.rect(x0 + w - 1, top + 2, 1, 21, frame);
    for (let x = x0; x < x0 + w - 1; x++) {
      if ((x - x0) % 8 < 2) continue;
      for (let y = top + 2; y < top + 23; y++) {
        if (y === top + 12) continue;
        const streak = (x * 2 + y) % 9 === 0;
        g.set(x, y, streak ? GLASS[dark ? 1 : 2] : y < top + 7 && !dark ? GLASS[1] : GLASS[0]);
      }
    }
    if (!dark) { g.set(x0 + 2, top + 3, GLASS[3]); g.set(x0 + 3, top + 3, GLASS[2]); }
    // Salt in the bottom corners.
    g.rect(x0 + 2, top + 20, 3, 3, DUST[0]);
  };
  // The nearer pane (meeting the north glass) and the farther one, lower down.
  if (right) { pane(0, 4, 16, false); pane(16, 15, 16, true); }
  else { pane(16, 4, 16, false); pane(0, 15, 16, true); }
  // The iron post where they meet, down to the sill.
  const px = 15;
  g.rect(px, 4, 2, 44, IRON[1]);
  g.rect(px, 4, 1, 44, IRON[2]);
  return g.rows();
}

// The tea table (lantern 5): a little round table under an old lace cloth,
// its scalloped edge hanging down, on one turned leg. On it the lantern
// (brass cap and base, the flame inside its glass), and the cup on its saucer
// with a spoon, the steam still coming off it. 8 frames: the flame licks and
// the steam rises. 30 x 30, the lantern where it always was, so the room's
// glow still sits on it.
function teaTable(i) {
  const g = new Grid(30, 30);
  const CLOTH = ['#a8a290', '#cfc8b2', '#e6e0cc', '#f4f0e2'];
  // The turned leg and its foot, under the cloth.
  g.rect(14, 24, 3, 4, WOOD[1]);
  g.rect(14, 24, 1, 4, WOOD[2]);
  g.rect(13, 26, 5, 1, WOOD[2]);
  g.rect(10, 28, 11, 2, WOOD[1]);
  g.rect(10, 28, 11, 1, WOOD[2]);
  g.set(10, 29, WOOD[0]); g.set(20, 29, WOOD[0]);
  // The top, round, under the cloth; the cloth hangs down all round in scallops.
  for (let y = 15; y <= 24; y++) {
    const dy = (y - 19) / 4.6;
    const half = Math.round(13 * Math.sqrt(Math.max(0, 1 - Math.min(1, dy * dy))));
    if (y > 19) {
      // Below the top's widest line: the drop of the cloth, straight down.
      for (let x = 2; x < 28; x++) {
        const scallop = y === 24 ? (x % 4 === 1 || x % 4 === 2) : true;
        if (!scallop) continue;
        g.set(x, y, y === 24 ? CLOTH[1] : x < 6 ? CLOTH[2] : x > 23 ? CLOTH[0] : CLOTH[1]);
      }
      continue;
    }
    for (let x = 15 - half; x < 15 + half; x++) g.set(x, y, y < 17 ? CLOTH[3] : CLOTH[2]);
  }
  // Lace: a row of little holes near the hem, and a fold or two.
  for (let x = 3; x < 27; x += 2) g.set(x, 22, CLOTH[0]);
  for (let x = 4; x < 27; x += 4) g.set(x, 23, CLOTH[0]);
  g.rect(9, 20, 1, 3, CLOTH[0]); g.rect(21, 20, 1, 3, CLOTH[0]);
  g.rect(2, 20, 26, 1, CLOTH[1]);
  // Its shadow on the boards.
  g.rect(4, 25, 22, 1, '#00000040');
  // The lantern, on the left: brass cap and ring, the iron cage, glass, the flame.
  g.rect(8, 5, 1, 2, IRON[2]);
  g.rect(7, 4, 3, 1, '#d8a838');
  g.rect(5, 7, 7, 2, '#a07020');
  g.rect(5, 7, 7, 1, '#d8a838');
  g.rect(5, 16, 7, 2, '#a07020');
  g.rect(4, 17, 9, 1, '#5c3e10');
  g.rect(5, 9, 1, 7, IRON[1]);
  g.rect(11, 9, 1, 7, IRON[1]);
  g.rect(8, 9, 1, 7, IRON[1]);
  const lick = [0, 1, 0, -1][i % 4];
  g.rect(6, 9, 2, 7, LAMP[0]);
  g.rect(9, 9, 2, 7, LAMP[0]);
  g.rect(6, 11, 2, 5, LAMP[1]);
  g.rect(9, 11, 2, 5, LAMP[1]);
  g.set(7 + (lick > 0 ? 2 : 0), 11 + (i % 2), LAMP[3]);
  g.set(7 + (lick > 0 ? 2 : 0), 12 + (i % 2), LAMP[2]);
  g.set(9 + lick, 10, LAMP[2]);
  // The saucer, the cup and its spoon, on the right.
  g.rect(16, 17, 10, 1, '#b8b4a8');
  g.rect(17, 16, 8, 1, '#d8d4c8');
  g.rect(18, 11, 6, 5, '#e4e0d4');
  g.rect(18, 11, 6, 1, '#f4f2ea');
  g.rect(19, 12, 4, 1, '#7a4a28');
  g.rect(24, 12, 1, 3, '#c8c4b8');
  g.set(25, 13, '#c8c4b8');
  g.rect(18, 14, 6, 1, '#4a7a8a');
  g.rect(16, 16, 1, 1, '#c8ccd0'); g.rect(14, 17, 3, 1, '#9aa0a6');
  // The steam: three wisps rising and swaying.
  for (let w = 0; w < 3; w++) {
    for (let k = 0; k < 4; k++) {
      const y = 9 - ((k * 3 + i + w) % 9);
      const x = 19 + w * 1.5 + Math.round(Math.sin((y + i + w * 2) / 2) * 1.2);
      if (y >= 0) g.set(x, y, k > 2 ? '#e8ecec80' : '#f4f8f8b0');
    }
  }
  return g.rows();
}

// --- The shutter crank --------------------------------------------------
function shutterCrank(on) {
  const g = new Grid(20, 36);
  // A post with a pulley at the top; the chain runs up and away to the shutter.
  g.rect(3, 4, 3, 30, WOOD[1]);
  g.rect(3, 4, 1, 30, WOOD[3]);
  g.rect(1, 34, 18, 2, ROCK[2]);
  g.rect(2, 3, 5, 1, IRON[2]);
  g.set(4, 2, IRON[3]); g.set(3, 2, IRON[2]); g.set(5, 2, IRON[2]);
  for (let y = 0; y < 22; y += 2) g.set(6 + (on ? 0 : y % 4 ? 1 : 0), 3 + y, IRON[3]);
  // The drum on its frame, bolted to the post.
  g.rect(6, 22, 10, 8, IRON[1]);
  g.rect(7, 23, 8, 6, on ? '#5a5248' : IRON[2]);
  for (let x = 7; x < 15; x += 2) g.rect(x, 24, 1, 4, IRON[0]);
  g.rect(6, 30, 2, 4, IRON[1]);
  g.rect(14, 30, 2, 4, IRON[1]);
  // The handle: down when idle, round the top when wound.
  if (on) { g.rect(15, 18, 1, 6, IRON[3]); g.rect(15, 17, 3, 2, WOOD[2]); }
  else { g.rect(15, 26, 1, 6, IRON[3]); g.rect(15, 31, 3, 2, WOOD[2]); }
  return g.rows();
}

// --- The light shaft in the forge ---------------------------------------
function lightShaft(i) {
  const g = new Grid(32, 72);
  for (let y = 0; y < 72; y++) {
    const half = 6 + Math.round(y / 9);
    const cx = 16 + Math.round((72 - y) / 18);
    for (let x = cx - half; x < cx + half; x++) {
      const t = Math.abs(x - cx) / half;
      g.set(x, y, t < 0.45 ? '#fff4c838' : t < 0.8 ? '#fff0c022' : '#fff0c012');
    }
  }
  // Dust drifting in it.
  for (let k = 0; k < 9; k++) {
    const y = (k * 8 + i * 3) % 70;
    const x = 12 + ((k * 5 + i) % 9) + Math.round(Math.sin((y + k) / 5));
    g.set(x, y, '#fff8e0a0');
  }
  return g.rows();
}

// --- Haddock's Light, far off -------------------------------------------
function farLight() {
  const g = new Grid(14, 44);
  g.rect(2, 40, 10, 4, ROCK[1]);
  g.rect(1, 42, 12, 2, ROCK[0]);
  for (let y = 12; y < 40; y++) {
    const half = 3 + Math.round((y - 12) / 14);
    for (let x = 7 - half; x < 7 + half; x++) g.set(x, y, x < 7 - half + 2 ? '#c8c8bc' : '#9a9a90');
  }
  g.rect(6, 30, 2, 2, LAMP[1]);
  g.rect(3, 10, 8, 2, IRON[1]);
  g.rect(4, 5, 6, 5, '#3a3428');
  g.rect(5, 6, 4, 3, LAMP[0]);
  g.rect(5, 3, 4, 2, IRON[1]);
  g.rect(6, 1, 2, 2, IRON[2]);
  return g.rows();
}

// --- The lantern glass, all round the old lightroom ------------------------
// 32 wide, 34 high (two tiles wide): a low brick sill, then tall panes in an iron frame with the
// storm outside them, rain running down. Laid side by side along the lightroom's wall row.
// `cracked` has one pane starred; `salt` has salt crusted in the corners.
function lanternGlass(kind) {
  const g = new Grid(32, 34);
  // The sill: brick, two courses.
  for (let r = 0; r < 2; r++) {
    for (let bx = r % 2 ? -4 : 0; bx < 32; bx += 8) {
      const x0 = Math.max(0, bx);
      g.rect(x0, 26 + r * 4, Math.min(bx + 7, 32) - x0, 3, ROCK[(bx / 8 + r) & 1 ? 2 : 1]);
      g.rect(x0, 26 + r * 4, Math.min(bx + 7, 32) - x0, 1, ROCK[3]);
    }
  }
  g.rect(0, 25, 32, 1, IRON[0]);
  // The frame: a rail top and bottom, and a mullion every 8 px.
  g.rect(0, 0, 32, 2, IRON[1]);
  g.rect(0, 0, 32, 1, IRON[3]);
  g.rect(0, 23, 32, 2, IRON[1]);
  g.rect(0, 23, 32, 1, IRON[2]);
  for (let x = 0; x < 32; x += 8) { g.rect(x, 2, 2, 21, IRON[1]); g.set(x, 2, IRON[3]); }
  g.rect(0, 12, 32, 1, IRON[1]);
  // The panes: the storm outside, darker low down, rain streaking across them.
  for (let pane = 0; pane < 4; pane++) {
    const px0 = pane * 8 + 2;
    for (let y = 2; y < 23; y++) {
      if (y === 12) continue;
      for (let x = px0; x < px0 + 6; x++) {
        const streak = (x * 2 + y + pane * 3) % 9 === 0;
        g.set(x, y, streak ? GLASS[2] : y < 7 ? GLASS[1] : GLASS[0]);
      }
    }
    // A cold glint in the top corner of each pane.
    g.set(px0, 3, GLASS[3]); g.set(px0 + 1, 3, GLASS[2]); g.set(px0, 4, GLASS[2]);
  }
  if (kind === 'cracked') {
    const cx = 19;
    const cy = 17;
    for (let k = -3; k <= 3; k++) { g.set(cx + k, cy + Math.round(k * 0.6), GLASS[3]); g.set(cx + Math.round(k * 0.4), cy - k, GLASS[3]); }
  }
  if (kind === 'salt') {
    for (let pane = 0; pane < 4; pane++) {
      const px0 = pane * 8 + 2;
      g.rect(px0, 20, 3, 3, DUST[1]); g.rect(px0, 21, 5, 2, DUST[0]); g.set(px0 + 5, 22, DUST[2]);
    }
  }
  return g.rows();
}

// --- Small things ---------------------------------------------------------
function noteTidy() {
  const g = new Grid(14, 9);
  g.rect(1, 2, 11, 6, PAPER[1]);
  g.rect(1, 7, 11, 1, PAPER[0]);
  g.rect(3, 4, 6, 1, '#4a4a52');
  g.rect(8, 1, 4, 3, ROCK[2]);
  g.rect(8, 1, 3, 1, ROCK[3]);
  return g.rows();
}

function broom() {
  const g = new Grid(12, 26);
  g.rect(5, 0, 2, 18, WOOD[2]);
  g.rect(5, 0, 1, 18, WOOD[3]);
  // The bucket it stands in.
  g.rect(2, 18, 8, 8, IRON[2]);
  g.rect(2, 18, 8, 1, IRON[3]);
  g.rect(3, 25, 6, 1, IRON[1]);
  g.rect(3, 15, 6, 3, '#a8904a');
  for (let x = 3; x < 9; x += 2) g.set(x, 14, '#c8b060');
  return g.rows();
}

function shellRow() {
  const g = new Grid(16, 6);
  const sizes = [4, 3, 3, 2, 2, 1];
  let x = 1;
  for (const s of sizes) {
    g.rect(x, 5 - s, s, s, '#e0d6c0');
    g.set(x, 5 - s, '#f4ecd8');
    x += s + 1;
  }
  return g.rows();
}

function logbook() {
  const g = new Grid(16, 26);
  g.rect(7, 10, 2, 14, WOOD[1]);
  g.rect(4, 23, 8, 3, WOOD[1]);
  g.rect(2, 6, 12, 5, WOOD[2]);
  g.rect(3, 4, 10, 4, PAPER[0]);
  g.rect(3, 4, 5, 4, PAPER[1]);
  g.rect(8, 4, 1, 4, WOOD[0]);
  g.rect(2, 3, 12, 1, DUST[2]);
  return g.rows();
}

// ===================== SHORE AND RUIN DRESSING (2026-11-08) =====================
// The isles' and the Reach's rocks, to break up bare slabs and turf: things the wind and the sea
// leave, and what the lamp-keepers left. Flat ones lie on the ground (`flat: true, walkable: true`);
// tufts are low enough to walk through (`walkable: true`). They roll their own dice, so adding
// them changes nothing above.
//   il_tidepool        a pool in the rock: a ragged rim, weed round the edge, red anemones and a
//                      starfish (2 wide, flat)
//   il_tidepool_small  a little one (1 wide, flat)
//   il_rocks           two or three wet stones with barnacles and weed at the foot (solid)
//   il_rocks_big       a heap of them (2 wide, solid)
//   il_rocks_flat      the tops of stones just breaking the ground or the sea (2 wide, flat)
//   il_thrift          a cushion of sea-pinks, the flowers all blown one way (walkable)
//   il_grass_tuft      wind-bent grass, a and b (walkable)
//   il_lichen          yellow and orange lichen on bare rock (flat)
//   il_drift_timber    a bleached ship's timber with its bolts still in (2 wide, flat)
//   il_gull            one gull, standing (walkable); il_gull_rock three on a rock (2 wide, solid)
//   il_cairn           a cairn of flat stones (solid)
//   il_pot_broken      a lobster pot stove in, its netting torn (solid)
//   il_stakes_rope     three stakes and a rope sagging between them (2 wide, solid)
//   il_rowboat_half    the bow half of a rowboat, broken off, ribs showing (2 wide, solid)
//   il_wall_ivy*       ivy hanging down a stone wall from the coping: put it on the wall's tile
//   il_wall_tumble     a stretch of wall come down in a heap of blocks: put it on the wall's tile
//   il_wall_stones     loose blocks sitting crooked on a wall's top: put it on the wall's tile
//   il_fallen_block    a squared block down off a wall, moss on it (solid)
//   il_workbench       a lens-maker's bench: a vice, tools, a prism, a lamp chimney (2 wide)
//   il_lens_rack       a rack of prism rings and lens pieces stood in slots (2 wide)
//   il_oil_cans        oil cans with long spouts, one fallen over
let shoreSeed = 7307;
const sr = () => {
  shoreSeed = (shoreSeed * 1664525 + 1013904223) >>> 0;
  return shoreSeed / 4294967296;
};
const sri = (n) => Math.floor(sr() * n);
const OUT = '#141a18';
const TURF = ['#2e4a2a', '#3e6034', '#4e7442', '#6a9458', '#9ab878'];
const PINK = ['#7a3050', '#c0608a', '#eaa0c0'];
const ANEM = ['#6a1e2a', '#b0404c', '#e47a72'];
const SEA = ['#0e2e38', '#174a54', '#2e7a80', '#9ad0c8'];
const BLEACH = ['#5a5648', '#8a846e', '#b4ae96', '#d8d2bc'];
const GULL = ['#22262a', '#7c868c', '#c4cace', '#eef0ee'];
const LICHEN = ['#a8902c', '#d0b440', '#c86a2c'];
const IVY = ['#1e3a22', '#2c5030', '#3e6a3a', '#5a8a48'];
const STONE = ['#3a3e38', '#5a6058', '#767c70', '#92988a'];

function stone(g, cx, cy, rx, ry, barn = true) {
  g.oval(cx, cy, rx, ry, ROCK[1]);
  g.oval(cx - 1, cy - 1, Math.max(1, rx - 1), Math.max(1, ry - 1), ROCK[2]);
  g.oval(cx - Math.ceil(rx / 2), cy - Math.ceil(ry / 2), Math.max(1, Math.floor(rx / 3)), Math.max(0, Math.floor(ry / 3)), ROCK[3]);
  g.rect(cx - rx + 1, cy + ry, rx * 2 - 1, 1, ROCK[0]);
  if (barn) for (let i = 0; i < rx; i++) g.set(cx - rx + 1 + sri(rx * 2 - 1), cy + sri(ry + 1), WHITE[sri(2) + 1]);
}

function weedFoot(g, x0, x1, y) {
  for (let x = x0; x <= x1; x++) {
    if (sr() < 0.7) g.set(x, y, WEED[sri(2)]);
    if (sr() < 0.35) g.set(x, y - 1, WEED[sri(3)]);
  }
}

function tidePool(big) {
  shoreSeed = big ? 811 : 823;
  const w = big ? 32 : 16;
  const g = new Grid(w, big ? 16 : 12);
  const pts = big
    ? [[1, 8], [4, 3], [11, 1], [19, 2], [26, 1], [31, 5], [30, 11], [24, 15], [14, 14], [6, 15], [1, 12]]
    : [[1, 6], [3, 2], [9, 1], [15, 3], [15, 8], [11, 11], [4, 11], [1, 9]];
  g.poly(pts, ROCK[1]);
  const inner = pts.map(([x, y]) => [x + (w / 2 - x) * (big ? 0.22 : 0.3), y + ((big ? 8 : 6) - y) * 0.3]);
  g.poly(inner, SEA[1]);
  const deep = pts.map(([x, y]) => [x + (w / 2 - x) * 0.5, y + ((big ? 8 : 6) - y) * 0.55]);
  g.poly(deep, SEA[0]);
  // The rim lit from the top left, darker below.
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < g.h; y++) {
      if (g.get(x, y) !== ROCK[1]) continue;
      if (g.get(x, y - 1) == null || g.get(x - 1, y) == null) g.set(x, y, ROCK[3]);
      else if (y > g.h / 2 && sr() < 0.4) g.set(x, y, ROCK[0]);
      else if (sr() < 0.12) g.set(x, y, WHITE[1]);
    }
  }
  // Weed round the inside edge.
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < g.h; y++) {
      if (g.get(x, y) !== SEA[1]) continue;
      const rim = [g.get(x - 1, y), g.get(x + 1, y), g.get(x, y - 1), g.get(x, y + 1)].some((c) => c && c.startsWith('#') && ROCK.includes(c));
      if (rim && sr() < 0.6) g.set(x, y, WEED[sri(3)]);
    }
  }
  // A glint, anemones and a starfish.
  g.line(Math.round(w * 0.3), big ? 6 : 4, Math.round(w * 0.5), big ? 5 : 4, SEA[2]);
  g.set(Math.round(w * 0.35), big ? 6 : 4, SEA[3]);
  const anem = (x, y) => { g.rect(x - 1, y, 3, 1, ANEM[1]); g.rect(x, y - 1, 1, 3, ANEM[1]); g.set(x, y, ANEM[2]); g.set(x + 1, y + 1, ANEM[0]); };
  if (big) {
    anem(8, 10); anem(23, 4); anem(26, 9);
    const sx = 16, sy = 10;
    g.line(sx - 2, sy, sx + 2, sy, LICHEN[2]); g.line(sx, sy - 2, sx, sy + 1, LICHEN[2]);
    g.set(sx - 1, sy + 1, LICHEN[2]); g.set(sx + 1, sy + 1, LICHEN[2]); g.set(sx, sy, '#e89a50');
  } else {
    anem(5, 7); anem(11, 5);
  }
  g.outline(OUT);
  return g.rows();
}

function rocks(kind) {
  shoreSeed = kind === 'big' ? 901 : kind === 'flat' ? 907 : 919;
  if (kind === 'flat') {
    const g = new Grid(32, 12);
    stone(g, 7, 6, 5, 2); stone(g, 17, 8, 3, 2); stone(g, 25, 5, 4, 2); stone(g, 13, 3, 2, 1, false);
    weedFoot(g, 2, 12, 9); weedFoot(g, 21, 29, 8);
    g.outline(OUT);
    return g.rows();
  }
  if (kind === 'big') {
    const g = new Grid(32, 22);
    stone(g, 10, 13, 8, 6); stone(g, 21, 15, 7, 5); stone(g, 15, 8, 5, 4); stone(g, 27, 18, 3, 2); stone(g, 4, 18, 3, 2);
    weedFoot(g, 2, 30, 21); weedFoot(g, 3, 28, 20);
    g.outline(OUT);
    return g.rows();
  }
  const g = new Grid(16, 14);
  stone(g, 6, 8, 5, 4); stone(g, 11, 10, 3, 3); stone(g, 2, 11, 2, 1, false);
  weedFoot(g, 1, 14, 13);
  g.outline(OUT);
  return g.rows();
}

function thrift() {
  shoreSeed = 1009;
  const g = new Grid(16, 14);
  g.oval(7, 11, 6, 2, TURF[1]);
  g.oval(6, 10, 4, 1, TURF[2]);
  for (let i = 0; i < 9; i++) g.set(2 + sri(11), 9 + sri(3), TURF[3]);
  g.outline(OUT);
  // Stalks, all blown east, and the round pink heads.
  const heads = [[3, 5], [6, 3], [9, 4], [11, 6], [13, 3], [7, 6]];
  for (const [hx, hy] of heads) {
    g.line(hx - 2, 10, hx, hy + 1, TURF[2]);
    g.rect(hx, hy - 1, 2, 2, PINK[1]);
    g.set(hx, hy - 1, PINK[2]);
    g.set(hx + 1, hy, PINK[0]);
  }
  return g.rows();
}

function grassTuft(b) {
  shoreSeed = b ? 1103 : 1109;
  const g = new Grid(18, 18);
  // A dark root clump, then blades, two pixels thick at the foot, all bent east by the wind.
  g.oval(7, 16, 5, 1, TURF[0]);
  const n = b ? 8 : 11;
  for (let i = 0; i < n; i++) {
    const x0 = 3 + sri(9);
    const h = 7 + sri(b ? 5 : 8);
    const lean = 2 + sri(5);
    const mx = x0 + Math.round(lean / 3), my = 16 - Math.round(h / 2);
    const c = TURF[2 + sri(2)];
    g.line(x0, 16, mx, my, c);
    g.line(x0 + 1, 16, mx + 1, my + 1, TURF[1]);
    g.line(mx, my, x0 + lean, 16 - h, c);
    g.set(x0 + lean, 16 - h, TURF[4]);
    g.set(x0 + lean - 1, 17 - h, TURF[4]);
  }
  if (!b) { g.set(5, 12, PINK[1]); g.set(4, 11, PINK[2]); g.set(11, 10, '#e0d078'); }
  g.outline(OUT);
  return g.rows();
}

function lichen() {
  shoreSeed = 1201;
  const g = new Grid(16, 10);
  // Little rosettes, spread thin, each a ring of crust round a darker eye.
  const spots = [[2, 3], [5, 6], [9, 2], [12, 7], [14, 4], [7, 8], [3, 8]];
  for (const [x, y] of spots) {
    const c = LICHEN[sri(3)];
    g.set(x, y - 1, c); g.set(x - 1, y, c); g.set(x + 1, y, c); g.set(x, y + 1, c);
    g.set(x, y, LICHEN[0]);
    if (sr() < 0.5) g.set(x + 1, y + 1, LICHEN[1]);
  }
  return g.rows();
}

function driftTimber() {
  shoreSeed = 1301;
  const g = new Grid(32, 12);
  g.poly([[2, 8], [28, 2], [30, 4], [4, 10]], BLEACH[2]);
  g.line(3, 8, 28, 2, BLEACH[3]);
  g.line(4, 10, 30, 4, BLEACH[0]);
  for (let i = 0; i < 4; i++) { const x = 6 + i * 6; g.line(x, 8 - Math.round(x / 5) + 1, x + 3, 8 - Math.round((x + 3) / 5) + 1, BLEACH[1]); }
  // Bolts, and the rust they've bled.
  for (const x of [9, 22]) { const y = 8 - Math.round(x * 0.23); g.set(x, y, IRON[0]); g.set(x + 1, y + 1, RUST[1]); g.set(x + 1, y + 2, RUST[0]); }
  // A splinter off the end and weed caught round it.
  g.line(28, 2, 31, 1, BLEACH[2]);
  g.set(14, 8, WEED[1]); g.set(15, 8, WEED[2]); g.set(15, 7, WEED[0]);
  g.outline(OUT);
  return g.rows();
}

function gullAt(g, x, y, facingLeft) {
  // About 9 x 7: white head and breast, grey back, black tips, a yellow bill, yellow legs.
  const d = facingLeft ? -1 : 1;
  g.oval(x, y, 3, 2, GULL[3]);
  g.rect(x - 2 * d, y - 1, 1, 2, GULL[1]);
  g.line(x - 3 * d, y - 1, x + 1 * d, y - 1, GULL[1]);
  g.set(x - 3 * d, y, GULL[0]); g.set(x - 4 * d, y, GULL[0]);
  g.oval(x + 2 * d, y - 3, 1, 1, GULL[3]);
  g.set(x + 2 * d, y - 3, GULL[0]);
  g.set(x + 4 * d, y - 3, LAMP[0]);
  g.set(x + 3 * d, y - 3, LAMP[0]);
  g.set(x, y + 3, LAMP[0]); g.set(x + 1 * d, y + 3, LAMP[0]);
  g.set(x - 1, y + 2, GULL[2]); g.set(x + 1, y + 2, GULL[2]);
}

function gull() {
  const g = new Grid(12, 10);
  gullAt(g, 5, 5, false);
  g.outline(OUT);
  return g.rows();
}

function gullRock() {
  shoreSeed = 1409;
  const g = new Grid(32, 26);
  stone(g, 15, 19, 12, 5);
  stone(g, 24, 21, 5, 3);
  // Their splashes all down it.
  for (let i = 0; i < 18; i++) g.set(5 + sri(22), 15 + sri(9), WHITE[3]);
  weedFoot(g, 3, 29, 25);
  g.outline(OUT);
  const tmp = new Grid(32, 26);
  gullAt(tmp, 8, 10, false); gullAt(tmp, 17, 9, true); gullAt(tmp, 24, 13, false);
  tmp.outline(OUT);
  for (let y = 0; y < 26; y++) for (let x = 0; x < 32; x++) if (tmp.cells[y][x]) g.set(x, y, tmp.cells[y][x]);
  return g.rows();
}

function cairn() {
  shoreSeed = 1511;
  const g = new Grid(16, 26);
  const layers = [[8, 22, 6, 2], [7, 18, 5, 2], [8, 14, 4, 2], [7, 10, 3, 2], [8, 7, 2, 1], [8, 4, 1, 1]];
  for (const [x, y, rx, ry] of layers) {
    g.oval(x, y, rx, ry, STONE[1]);
    g.rect(x - rx + 1, y - ry, rx * 2 - 2, 1, STONE[2]);
    g.set(x - rx + 1, y - ry, STONE[3]);
    g.rect(x - rx + 1, y + ry, rx * 2 - 1, 1, STONE[0]);
  }
  g.set(6, 18, LICHEN[1]); g.set(10, 22, LICHEN[0]); g.set(11, 21, LICHEN[2]);
  weedFoot(g, 2, 14, 25);
  g.outline(OUT);
  return g.rows();
}

function potBroken() {
  shoreSeed = 1601;
  const g = new Grid(20, 16);
  // The base, slatted, and the hoops: one standing, one stove in.
  g.rect(2, 11, 16, 3, WOOD[1]);
  g.rect(2, 11, 16, 1, WOOD[2]);
  for (let x = 3; x < 18; x += 3) g.set(x, 12, WOOD[0]);
  const net = '#8a8264';
  for (let a = 0; a <= 12; a++) {
    const t = (a / 12) * Math.PI;
    g.set(5 + Math.round(Math.cos(t) * 3), 11 - Math.round(Math.sin(t) * 8), WOOD[2]);
  }
  g.line(11, 11, 13, 6, WOOD[2]); g.line(13, 6, 17, 9, WOOD[2]);
  for (let y = 4; y < 11; y += 2) g.line(3, y, 8, y + 1, net);
  g.line(9, 5, 14, 10, net); g.line(13, 7, 11, 10, net);
  g.set(16, 10, RED[1]); g.set(17, 10, RED[2]); g.set(16, 11, RED[0]);
  g.outline(OUT);
  return g.rows();
}

function stakesRope() {
  shoreSeed = 1709;
  const g = new Grid(32, 22);
  const stakes = [[3, 5], [15, 3], [28, 6]];
  for (const [x, top] of stakes) {
    g.rect(x, top, 2, 20 - top, WOOD[1]);
    g.rect(x, top, 1, 20 - top, WOOD[2]);
    g.rect(x, top, 2, 1, WOOD[3]);
    g.set(x - 1, 20, WEED[1]); g.set(x + 2, 20, WEED[0]); g.set(x, 20, WEED[2]);
  }
  g.outline(OUT);
  const rope = '#b0a07c';
  for (let i = 0; i + 1 < stakes.length; i++) {
    const [ax, at] = stakes[i];
    const [bx, bt] = stakes[i + 1];
    for (let x = ax + 2; x < bx; x++) {
      const t = (x - ax) / (bx - ax);
      const y = at + 1 + (bt - at) * t + Math.sin(t * Math.PI) * 4;
      g.set(x, y, rope);
      g.set(x, y + 1, '#6a5e44');
    }
  }
  // A rag knotted on the middle stake, blowing east.
  g.rect(17, 4, 3, 2, RED[1]); g.set(20, 5, RED[2]); g.set(19, 6, RED[0]);
  return g.rows();
}

function rowboatHalf() {
  shoreSeed = 1801;
  const g = new Grid(34, 20);
  // Lying on her side: the bow on the left, the hull broken off on the right.
  g.poly([[1, 12], [6, 6], [26, 4], [30, 6], [28, 9], [31, 12], [27, 15], [8, 17], [3, 15]], WOOD[1]);
  // Her inside, dark, with ribs.
  g.poly([[6, 9], [9, 7], [26, 6], [27, 9], [24, 11], [10, 12]], WOOD[0]);
  for (const x of [12, 17, 22]) g.line(x, 7, x + 1, 12, WOOD[2]);
  // Strakes and a faded green band at the gunwale.
  for (let x = 3; x < 30; x++) {
    if (g.get(x, 13) === WOOD[1]) g.set(x, 13, WOOD[2]);
    if (g.get(x, 15) === WOOD[1]) g.set(x, 15, WOOD[0]);
  }
  g.line(6, 6, 26, 4, '#4a7a72'); g.line(7, 5, 25, 4, '#6a9a90');
  // Snapped plank ends sticking out.
  g.line(29, 6, 33, 4, WOOD[2]); g.line(30, 9, 33, 10, WOOD[1]); g.line(29, 12, 32, 14, WOOD[2]);
  g.set(2, 12, IRON[2]);
  weedFoot(g, 4, 28, 18);
  g.outline(OUT);
  return g.rows();
}

function wallIvy(b) {
  shoreSeed = b ? 1907 : 1913;
  // 24 wide over a one-tile wall, so it spills a little either side. The wall tile is the
  // bottom 16 rows (14-29): a mat over the coping, trails of different lengths down the face,
  // and a skirt of leaves on the ground at the foot.
  const g = new Grid(24, 30);
  const leaf = (x, y, c) => { g.set(x, y, c); g.set(x + 1, y, c); g.set(x, y + 1, IVY[0]); };
  for (let x = 3; x < 21; x++) {
    const top = 11 + sri(4) - (x > 7 && x < 16 ? 1 : 0);
    const bottom = 18 + sri(b ? 6 : 11);
    for (let y = top; y < bottom; y++) {
      if (y > 19 && sr() < 0.35) continue;
      g.set(x, y, IVY[y < top + 2 ? 3 : 1 + sri(2)]);
    }
  }
  for (let i = 0; i < 22; i++) leaf(2 + sri(20), 11 + sri(14), sr() < 0.5 ? IVY[3] : '#78a85a');
  // The skirt on the ground.
  for (let x = 1; x < 23; x++) if (sr() < 0.75) { g.set(x, 28, IVY[1 + sri(2)]); if (sr() < 0.5) g.set(x, 27, IVY[2 + sri(2)]); }
  g.outline(OUT);
  return g.rows();
}

// A stretch of the wall come down: blocks tumbled in a heap over its line, spilling either side.
function wallTumble() {
  shoreSeed = 2029;
  const g = new Grid(26, 24);
  const block = (x, y, w, h, tilt) => {
    g.poly([[x, y + tilt], [x + w, y], [x + w, y + h], [x, y + h + tilt]], STONE[1]);
    g.line(x, y + tilt, x + w, y, STONE[3]);
    g.line(x + 1, y + tilt + 1, x + w - 1, y + 1, STONE[2]);
    g.line(x, y + h + tilt, x + w, y + h, STONE[0]);
  };
  block(2, 15, 7, 5, 1); block(15, 16, 8, 5, -1); block(8, 12, 9, 6, 1); block(5, 8, 7, 5, -1); block(13, 6, 6, 5, 1); block(19, 11, 5, 4, 0);
  for (let i = 0; i < 6; i++) g.set(3 + sri(20), 22, STONE[2]);
  g.set(6, 9, IVY[3]); g.set(7, 9, IVY[2]); g.set(14, 7, IVY[3]); g.set(10, 12, LICHEN[1]); g.set(20, 12, LICHEN[0]);
  g.outline(OUT);
  for (let x = 1; x < 25; x += 2 + sri(3)) { g.set(x, 23, TURF[2]); g.set(x, 22, TURF[3]); }
  return g.rows();
}

function wallStones() {
  shoreSeed = 2003;
  const g = new Grid(16, 24);
  // Two blocks sat crooked on the wall top, one cocked up, moss in the joint.
  g.poly([[1, 9], [8, 7], [9, 13], [2, 14]], STONE[2]);
  g.line(1, 9, 8, 7, STONE[3]);
  g.line(2, 14, 9, 13, STONE[0]);
  g.poly([[8, 10], [14, 10], [15, 15], [9, 15]], STONE[1]);
  g.line(8, 10, 14, 10, STONE[3]);
  g.set(9, 14, IVY[2]); g.set(8, 15, IVY[3]); g.set(10, 15, IVY[2]); g.set(4, 8, LICHEN[1]);
  g.outline(OUT);
  return g.rows();
}

function fallenBlock() {
  shoreSeed = 2011;
  const g = new Grid(18, 14);
  g.poly([[2, 5], [12, 3], [15, 9], [5, 12]], STONE[1]);
  g.poly([[2, 5], [12, 3], [13, 5], [3, 7]], STONE[2]);
  g.line(2, 5, 12, 3, STONE[3]);
  g.line(5, 12, 15, 9, STONE[0]);
  g.rect(4, 4, 4, 1, IVY[3]); g.set(9, 3, IVY[2]); g.set(5, 5, IVY[2]);
  g.set(15, 12, STONE[2]); g.set(16, 12, STONE[1]); g.set(1, 11, STONE[2]);
  g.outline(OUT);
  return g.rows();
}

function workbench() {
  shoreSeed = 2101;
  const g = new Grid(32, 26);
  // Legs, a shelf of shavings under it, the top.
  g.rect(2, 14, 2, 11, WOOD[0]); g.rect(28, 14, 2, 11, WOOD[0]);
  g.rect(3, 20, 26, 2, WOOD[1]);
  for (let i = 0; i < 6; i++) g.set(6 + sri(20), 19, BLEACH[3]);
  g.rect(1, 11, 30, 4, WOOD[2]);
  g.rect(1, 11, 30, 1, WOOD[3]);
  g.rect(1, 14, 30, 1, WOOD[0]);
  // A vice on the left end.
  g.rect(2, 7, 5, 4, IRON[2]); g.rect(2, 7, 5, 1, IRON[3]); g.rect(4, 6, 1, 1, IRON[1]); g.rect(1, 9, 7, 1, IRON[1]);
  // A lamp chimney lying down, a prism, a hammer and pliers.
  g.rect(9, 8, 6, 3, GLASS[2]); g.rect(9, 8, 6, 1, GLASS[3]); g.set(14, 10, GLASS[1]);
  g.poly([[17, 10], [20, 6], [23, 10]], GLASS[2]); g.line(18, 9, 20, 7, GLASS[3]);
  g.rect(24, 9, 5, 1, WOOD[1]); g.rect(27, 7, 2, 3, IRON[2]);
  g.set(20, 13, IRON[2]); g.set(21, 12, IRON[2]); g.set(22, 13, IRON[2]);
  g.outline(OUT);
  return g.rows();
}

function lensRack() {
  shoreSeed = 2203;
  const g = new Grid(32, 30);
  // A frame of two uprights and two rails, and the pieces stood in it.
  g.rect(1, 6, 2, 23, WOOD[1]); g.rect(29, 6, 2, 23, WOOD[1]);
  g.rect(1, 6, 1, 23, WOOD[2]); g.rect(29, 6, 1, 23, WOOD[2]);
  g.rect(1, 16, 30, 2, WOOD[2]); g.rect(1, 27, 30, 2, WOOD[1]);
  g.rect(1, 16, 30, 1, WOOD[3]);
  // Upper rail: prism rings, curved glass bands.
  for (let i = 0; i < 4; i++) {
    const x = 5 + i * 6;
    g.rect(x, 7, 4, 9, GLASS[1]);
    g.rect(x, 7, 1, 9, GLASS[3]);
    g.rect(x + 1, 8, 1, 7, GLASS[2]);
    if (i === 2) { g.set(x + 2, 10, DUST[2]); g.set(x + 3, 11, DUST[2]); }
  }
  // Lower rail: a big lens piece on its edge, and an empty slot.
  g.oval(11, 22, 6, 5, GLASS[1]);
  g.oval(10, 21, 4, 3, GLASS[2]);
  g.set(8, 19, GLASS[3]); g.set(9, 19, GLASS[3]); g.set(8, 20, GLASS[3]);
  g.rect(20, 21, 6, 6, GLASS[0]); g.rect(20, 21, 6, 1, GLASS[2]);
  g.outline(OUT);
  return g.rows();
}

function oilCans() {
  const g = new Grid(20, 16);
  const can = (x, y, h) => {
    g.rect(x, y, 5, h, RED[1]); g.rect(x, y, 1, h, RED[2]); g.rect(x + 4, y, 1, h, RED[0]);
    g.rect(x + 1, y - 1, 3, 1, IRON[2]); g.line(x + 3, y - 1, x + 6, y - 4, IRON[2]);
    g.rect(x, y + 2, 5, 1, IRON[1]);
  };
  can(2, 7, 8); can(8, 9, 6);
  // One on its side, a black drip from its spout.
  g.rect(13, 11, 6, 4, RED[1]); g.rect(13, 11, 6, 1, RED[2]); g.line(13, 12, 11, 14, IRON[2]); g.set(11, 15, IRON[0]); g.set(10, 15, IRON[0]);
  g.outline(OUT);
  return g.rows();
}


// --- Life pass (2026-11-14) ---------------------------------------------
//   il_kettle      a black iron kettle stood on the floor, its lid beside it, a rag in the spout
//   il_dandelion   one dandelion growing out of a crack in the flagstones (walkable)
function kettle() {
  const g = new Grid(16, 14);
  g.oval(7, 8, 5, 4, IRON[1]);
  g.rect(3, 4, 9, 3, IRON[1]);
  g.rect(4, 3, 7, 1, IRON[2]);
  g.rect(3, 5, 1, 5, IRON[2]);
  g.rect(5, 12, 5, 1, IRON[0]);
  // The spout, with a bit of cloth rolled into it, and the handle arching over.
  g.line(12, 7, 14, 4, IRON[2]); g.line(13, 7, 15, 4, IRON[1]); g.set(14, 3, PAPER[1]); g.set(15, 3, PAPER[0]);
  g.line(4, 4, 7, 0, IRON[3]); g.line(10, 4, 7, 0, IRON[3]);
  g.rect(6, 0, 3, 1, IRON[3]);
  // A shine on the belly and a rust speck.
  g.set(5, 7, IRON[3]); g.set(5, 8, IRON[3]); g.set(9, 10, RUST[1]);
  g.outline(OUT);
  return g.rows();
}

function dandelion() {
  shoreSeed = 4421;
  const g = new Grid(16, 20);
  const LEAF = ['#1e3a22', '#2c5030', '#3e6a3a'];
  g.rect(1, 18, 14, 2, IRON[1]);
  g.rect(0, 19, 16, 1, IRON[0]);
  for (let i = 0; i < 4; i++) {
    g.line(8, 18, 3 + i * 3, 14 + (i % 2), LEAF[1 + (i % 2)]);
    g.line(8, 18, 3 + i * 3, 15 + (i % 2), LEAF[0]);
  }
  g.line(8, 18, 8, 7, LEAF[2]);
  g.line(9, 18, 9, 8, LEAF[1]);
  g.oval(8, 5, 4, 3, '#e8b820');
  g.oval(8, 4, 3, 2, '#ffd848');
  g.set(7, 3, '#fff08a'); g.set(9, 5, '#c88a10'); g.set(6, 5, '#c88a10');
  g.outline(OUT);
  return g.rows();
}


// A low dark gap in the foot of the cliff (the tidy cave's mouth, 1 tile), cut in the same grey-green
// courses as the cliff face, a fallen slab leaning across half of it and weed hanging over the rest.
function caveCrack() {
  const g = new Grid(16, 16);
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      const course = y % 6 === 5;
      const joint = (x + (Math.floor(y / 6) % 2) * 5) % 9 === 0;
      g.set(x, y, course || joint ? ROCK[0] : (x * 7 + y * 3) % 5 === 0 ? ROCK[2] : ROCK[1]);
    }
  }
  // The gap: low and ragged, wider at the foot.
  g.poly([[2, 15], [3, 8], [6, 5], [11, 5], [13, 8], [14, 15]], '#04080a');
  g.rect(5, 6, 6, 1, '#0a1418');
  // The slab that came down, leaning across the left half of it.
  g.poly([[0, 15], [2, 9], [7, 6], [8, 8], [5, 15]], ROCK[2]);
  g.poly([[2, 9], [7, 6], [7, 7], [3, 10]], ROCK[3]);
  g.line(5, 15, 8, 8, ROCK[0]);
  // Weed hanging over the lintel and heaped at the foot.
  for (const [x, l] of [[7, 3], [9, 2], [10, 4], [12, 2]]) for (let i = 0; i < l; i++) g.set(x, 5 + i, WEED[(x + i) % 3]);
  g.rect(9, 14, 4, 2, WEED[1]);
  g.set(10, 14, WEED[2]); g.set(12, 15, WEED[0]);
  return g.rows();
}

// --- Registry ----------------------------------------------------------
export const IL_PROP_SPRITES = {
  il_light_tower: tower(false),
  il_light_tower_old: towerOld(),
  il_dead_lens: deadLens(),
  il_tea_table: teaTable(0),
  il_shutter_crank: shutterCrank(false),
  il_shutter_crank_on: shutterCrank(true),
  il_light_shaft: lightShaft(0),
  il_far_light: farLight(),
  il_note_tidy: noteTidy(),
  il_broom: broom(),
  il_shell_row: shellRow(),
  il_cave_crack: caveCrack(),
  il_logbook: logbook(),
  il_lantern_glass: lanternGlass(''),
  il_lantern_glass_cracked: lanternGlass('cracked'),
  il_lantern_glass_salt: lanternGlass('salt'),
  il_lantern_glass_corner: cornerGlass(false),
  il_lantern_glass_corner_r: cornerGlass(true),
  il_tidepool: tidePool(true),
  il_tidepool_small: tidePool(false),
  il_rocks: rocks(''),
  il_rocks_big: rocks('big'),
  il_rocks_flat: rocks('flat'),
  il_thrift: thrift(),
  il_grass_tuft: grassTuft(false),
  il_grass_tuft_b: grassTuft(true),
  il_lichen: lichen(),
  il_drift_timber: driftTimber(),
  il_gull: gull(),
  il_gull_rock: gullRock(),
  il_cairn: cairn(),
  il_pot_broken: potBroken(),
  il_stakes_rope: stakesRope(),
  il_rowboat_half: rowboatHalf(),
  il_wall_ivy: wallIvy(false),
  il_wall_ivy_b: wallIvy(true),
  il_wall_stones: wallStones(),
  il_wall_tumble: wallTumble(),
  il_fallen_block: fallenBlock(),
  il_workbench: workbench(),
  il_lens_rack: lensRack(),
  il_oil_cans: oilCans(),
  il_kettle: kettle(),
  il_dandelion: dandelion(),
};

export const IL_PALETTE = palette;
export const IL_PALETTE_EXTRA = palette;
export const IL_TEA_TABLE_SPRITES = frames((i) => teaTable(i), 8);
export const IL_LIGHT_SHAFT_SPRITES = frames((i) => lightShaft(i), 8);

// How many tiles wide each big one stands.
export const IL_FOOTPRINTS = {
  il_dead_lens: 2,
  il_tea_table: 2,
  il_lantern_glass: 2,
  il_lantern_glass_cracked: 2,
  il_lantern_glass_salt: 2,
  il_lantern_glass_corner: 2,
  il_lantern_glass_corner_r: 2,
  il_tidepool: 2,
  il_rocks_big: 2,
  il_rocks_flat: 2,
  il_drift_timber: 2,
  il_gull_rock: 2,
  il_stakes_rope: 2,
  il_rowboat_half: 2,
  il_workbench: 2,
  il_lens_rack: 2,
};
