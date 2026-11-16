// The end of chapter 5, restaged (src/data/scenes/tideHeldFinale.js): the storm
// taking Corrie one last time, the wave through the lamp room's glass, the beach
// under the Last Light, Bramble's dive and the haul out, and Haddock's things on
// the water. All animations, so a scene actor can play them ('anim:tr_hat_float').
// Every id starts `tr_`. Where a character already has a drawing (the hero's and
// Ves's heads, Bramble's walking frames) these start from it, so they stay the
// same people. (Corrie's own frames for this are coastFolk.js's cf_corrie_tired
// and cf_corrie_possessed.)
//
// In the world (standing on the bottom edge):
//   tr_hero_struggle     the hero in the sea, head and arms up, thrashing (3, 20x22)
//   tr_hero_sink         going under: limp, face up, arms out on the water (2)
//   tr_ves_struggle      Ves the same, no umbrella (3, 22x22); tr_ves_sink (2)
//   tr_umbrella_float    her umbrella upside down on the swell, rocking (4, 22x12)
//   tr_hat_float         Haddock's sou'wester on the water, alone, turning (6, 28x15)
//   tr_bramble_lie       washed up face down on the sand (2, 24x14)
//   tr_bramble_dive      from behind: the crouch, the spring, arms up, flying (3, 18x27, `once`)
//   tr_bramble_haul      facing you, leaning into it, hauling the two up the sand
//                        behind him (4, 16x21)
//   tr_hatchet           his hatchet, dropped on the sand (2, 14x7)
//   tr_ves_mouth         Ves with a mitten pressed to her mouth, trembling (2, 16x26)
// Props (TR_PROP_SPRITES, merged into props.js): the lamp room after the fight.
//   tr_glass_broken      a run of the lantern glass with the panes blown in: jagged teeth
//                        of glass left in the frame, a mullion snapped, the storm sky
//                        straight through (2 wide, like il_lantern_glass)
//   tr_glass_broken_corner, tr_glass_broken_corner_r   the corners the same
//   tr_glass_shards      glass all over the boards, glinting (flat, 2 wide)
//   tr_spar              a length of the iron frame, torn off and fallen (flat, 2 wide)
//   tr_lamp_lit          the great lamp (ll_dead_lamp) burning: the rings of its glass warm
//                        and bright, the heart of it white (4 wide)
//   tr_sill              a length of the brass foot rail the glass stood in, where the wall
//                        has gone (2 wide; the rest of the wreck is drawn by
//                        src/overworld/lampWreck.js, this is what you press Z on)
//   tr_boards_torn       boards ripped up, the iron grating of the gallery under them and
//                        the dark below that (flat, 2 wide)
// Under the water (side on, for the 'undertow' vision in tideVisions.js, drawn
// big there):
//   tr_uw_bramble        swimming, badly: arms digging, legs kicking (4, 32x18)
//   tr_uw_bramble_puff   the same, cheeks puffed, going up (4)
//   tr_uw_bramble_reach  one arm stretched out as far as it goes (2)
//   tr_uw_hero, tr_uw_ves  limp, sinking: hair, scarf and coat drifting (2 each)
// (draft).

import { PLAYER_SPRITES, PLAYER_PALETTE } from './player.js';
import { VES_FRAMES, VES_PALETTE } from './vesper.js';
import { BRAMBLE_FRAMES, BRAMBLE_PALETTE } from './bramble.js';
import { IL_PROP_SPRITES, IL_PALETTE } from './islesProps.js';
import { LL_PROP_SPRITES, LL_PALETTE_EXTRA } from './lastLightProps.js';

// --- A tiny painter (colours in the cells; turned into rows at the end) ---
const colors = new Map();
const palette = {};
function char(color) {
  if (!colors.has(color)) {
    const c = String.fromCharCode(0x6200 + colors.size);
    colors.set(color, c);
    palette[c] = color;
  }
  return colors.get(color);
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
    for (let dy = -Math.ceil(ry); dy <= Math.ceil(ry); dy++) {
      const k = 1 - (dy * dy) / (ry * ry + 0.25);
      if (k < 0) continue;
      const w = Math.round(rx * Math.sqrt(k));
      this.rect(Math.round(cx) - w, Math.round(cy) + dy, w * 2 + 1, 1, c);
    }
  }

  line(x0, y0, x1, y1, c, thick = 1) {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= steps; i++) {
      const x = x0 + ((x1 - x0) * i) / steps;
      const y = y0 + ((y1 - y0) * i) / steps;
      this.set(x, y, c);
      if (thick > 1) { this.set(x + 1, y, c); this.set(x, y + 1, c); }
    }
  }

  // Another drawing's rows on top, at (ox, oy): `keep(color, x, y)` can leave a pixel out,
  // `swap` changes colours on the way in.
  paste(rows, pal, ox = 0, oy = 0, { keep = null, swap = {} } = {}) {
    rows.forEach((row, y) => [...row].forEach((ch, x) => {
      const color = pal[ch];
      if (!color) return;
      if (keep && !keep(color, x, y)) return;
      this.set(ox + x, oy + y, swap[color] ?? color);
    }));
  }

  // A one-pixel outline round everything drawn, skipping colours in `skip`.
  outline(c, skip = []) {
    const solid = (x, y) => {
      const v = this.get(x, y);
      return v && !skip.includes(v);
    };
    const edge = [];
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        if (this.get(x, y)) continue;
        if (solid(x - 1, y) || solid(x + 1, y) || solid(x, y - 1) || solid(x, y + 1)) edge.push([x, y]);
      }
    }
    for (const [x, y] of edge) this.set(x, y, c);
    return this;
  }

  rows() {
    return this.cells.map((row) => row.map((c) => (c ? char(c) : '.')).join(''));
  }
}

// A drawing turned a quarter (or any angle) about its middle, into a size x size square.
function turned(rows, pal, angle, size) {
  const h = rows.length;
  const w = rows[0].length;
  const g = new Grid(size, size);
  const cos = Math.cos(-angle);
  const sin = Math.sin(-angle);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - size / 2 + 0.5;
      const dy = y - size / 2 + 0.5;
      const sx = Math.round(dx * cos - dy * sin + w / 2 - 0.5);
      const sy = Math.round(dx * sin + dy * cos + h / 2 - 0.5);
      const color = pal[rows[sy]?.[sx]];
      if (color) g.set(x, y, color);
    }
  }
  return g;
}

const OUT = '#120c1c';

// =====================================================================
// THE HERO AND VES IN THE SEA
// =====================================================================
const P = PLAYER_PALETTE;
const V = VES_PALETTE;
const SPRAY = ['#ffffff', 'rgba(220, 250, 240, 0.85)'];

// A swimmer's arm: a sleeve from the shoulder, then a hand (or a mitten).
function arm(g, x0, y0, x1, y1, sleeve, hand) {
  g.line(x0, y0, x1, y1, sleeve, 2);
  g.rect(x1 - 1, y1 - 1, 2, 2, hand);
}

// The hero, out at sea: head and shoulders up, arms thrashing (`pose` 0-2), the
// mouth open; or `limp`, face up, eyes shut, arms out on the water.
function heroInSea(pose, limp = false, drift = 0) {
  const g = new Grid(20, 22);
  const hx = 4;
  const hy = limp ? 5 : 3;
  // The shirt and the scarf at his neck (the rest is under the water).
  g.rect(5, hy + 9, 10, 10, P.c);
  g.rect(5, hy + 9, 10, 2, P.f);
  g.set(14, hy + 11, P.f);
  if (limp) {
    // Arms out on the water, the scarf's end floating off.
    arm(g, 5, hy + 11, 1, hy + 12 + drift, P.c, P.s);
    arm(g, 14, hy + 11, 18, hy + 12 - drift, P.c, P.s);
    g.line(14, hy + 10, 17, hy + 8 + drift, P.f);
  } else {
    const arms = [
      [[5, hy + 10, 2, 1], [14, hy + 10, 18, hy + 9]],
      [[5, hy + 10, 3, 1], [14, hy + 10, 16, 1]],
      [[5, hy + 10, 1, hy + 9], [14, hy + 10, 17, 0]],
    ][pose];
    for (const [x0, y0, x1, y1] of arms) {
      arm(g, x0, y0, x1, y1, P.c, P.s);
      // Spray off the hands.
      g.set(x1 + (x1 < 10 ? -2 : 2), y1 + 1, SPRAY[0]);
      g.set(x1, y1 - 2, SPRAY[1]);
    }
  }
  // The head (his own), mouth open gasping, or eyes shut.
  g.paste(PLAYER_SPRITES.downIdle.slice(0, 9), P, hx, hy, {
    swap: limp ? { [P.e]: '#c9946e' } : {},
  });
  if (!limp) {
    g.set(hx + 5, hy + 7, P.k);
    g.set(hx + 6, hy + 7, P.k);
  } else {
    g.set(hx + 2, hy + 6, P.e);
    g.set(hx + 9, hy + 6, P.e);
  }
  return g.outline(OUT, SPRAY).rows();
}
export const TR_HERO_STRUGGLE_SPRITES = { a: heroInSea(0), b: heroInSea(1), c: heroInSea(2) };
export const TR_HERO_SINK_SPRITES = { a: heroInSea(0, true, 0), b: heroInSea(0, true, 1) };

// Her head and hair from her own drawing (no umbrella: it's floating off), coat
// and scarf; thrashing, or limp with her hair spread out on the water.
const VES_HEAD = VES_FRAMES.downIdle.slice(6, 15).map((row) => row.replace(/d/g, '.'));
function vesInSea(pose, limp = false, drift = 0) {
  const g = new Grid(22, 22);
  const hx = 3;
  const hy = limp ? 5 : 3;
  if (limp) {
    // Her hair, spread out round her head on the water.
    for (const [x, y] of [[2, 3], [1, 5], [2, 7], [16, 3], [18, 5], [17, 8]]) g.line(hx + 8, hy + 4, hx + x - 3 + drift, hy + y, x < 9 ? V.L : V.l);
  }
  g.rect(5, hy + 9, 11, 10, V.G);
  g.rect(6, hy + 9, 9, 2, V.E);
  g.set(9, hy + 11, V.T);
  if (limp) {
    arm(g, 5, hy + 11, 1, hy + 13 - drift, V.G, V['4']);
    arm(g, 15, hy + 11, 20, hy + 12 + drift, V.G, V['4']);
  } else {
    const arms = [
      [[5, hy + 10, 1, 2], [15, hy + 10, 20, hy + 8]],
      [[5, hy + 10, 2, 0], [15, hy + 10, 19, 1]],
      [[5, hy + 10, 1, hy + 9], [15, hy + 10, 19, 0]],
    ][pose];
    for (const [x0, y0, x1, y1] of arms) {
      arm(g, x0, y0, x1, y1, V.G, V['4']);
      g.set(x1 + (x1 < 10 ? -2 : 2), y1 + 1, SPRAY[0]);
      g.set(x1, y1 - 2, SPRAY[1]);
    }
  }
  g.paste(VES_HEAD, V, hx, hy, {
    swap: limp ? { [V.u]: V.C } : {},
  });
  if (!limp) g.set(hx + 7, hy + 7, V.k);
  return g.outline(OUT, SPRAY).rows();
}
export const TR_VES_STRUGGLE_SPRITES = { a: vesInSea(0), b: vesInSea(1), c: vesInSea(2) };
export const TR_VES_SINK_SPRITES = { a: vesInSea(0, true, 0), b: vesInSea(0, true, 1) };

// =====================================================================
// THINGS ON THE WATER
// =====================================================================
const LAP = 'rgba(206, 240, 236, 0.75)';
const UNDER = 'rgba(8, 30, 34, 0.55)';

// Her umbrella, blown inside out and floating upside down: the bowl of the canopy
// on the water, the ribs, the handle crooked up out of it, rocking.
function umbrellaFloat(f) {
  const g = new Grid(22, 12);
  const tilt = [0, 1, 0, -1][f];
  g.oval(10, 9, 10, 1.6, UNDER);
  g.oval(10, 7, 9, 3, V.q);
  g.oval(10, 6 + (tilt > 0 ? 1 : 0), 7, 2, V.Q);
  // The ribs, out to the scalloped rim.
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + tilt * 0.15;
    g.line(10, 6, 10 + Math.cos(a) * 8, 7 + Math.sin(a) * 2.6, V.q);
    g.set(10 + Math.cos(a) * 9, 7 + Math.sin(a) * 3, V.Q);
  }
  // The handle, crooked up and over.
  const top = 14 + tilt;
  g.line(10, 6, top, 1, V.d);
  g.set(top + 1, 0, V.d);
  g.set(top + 2, 1, V.d);
  g.set(top + 2, 2, V.d);
  g.set(10, 6, V['4']);
  // The swell lapping at the rim.
  g.rect(1 + f % 2, 9, 3, 1, LAP);
  g.rect(15 - f % 2, 10, 4, 1, LAP);
  return g.outline(OUT, [UNDER, LAP]).rows();
}
export const TR_UMBRELLA_FLOAT_SPRITES = { a: umbrellaFloat(0), b: umbrellaFloat(1), c: umbrellaFloat(2), d: umbrellaFloat(3) };

// Haddock's sou'wester (coastFolk.js's navy), on the water by itself, the right way
// up, turning slowly round: the crown, the wide brim, the long flap at the back
// coming round, and the end of its cord trailing.
const HAT = { Y: '#46587a', y: '#33415c', Z: '#6a7c9c', X: '#222b40', t: '#6b4a2c', k: '#1a1220' };
function hatFloat(f) {
  const g = new Grid(28, 15);
  const a = (f / 6) * Math.PI * 2;
  const bob = [0, 0, 1, 1, 1, 0][f];
  g.oval(14, 13, 13, 1.4, UNDER);
  // The back flap, coming round as it turns (behind the brim when it's at the back).
  const fx = 14 + Math.cos(a) * 11;
  const fy = 9 + bob + Math.sin(a) * 2.6;
  if (Math.sin(a) < 0) g.oval(fx, fy, 2.6, 1.4, HAT.y);
  // The brim: wide, floppy, its near edge catching the light.
  g.oval(14, 9.6 + bob, 12, 3, HAT.y);
  g.oval(14, 9 + bob, 11, 2.4, HAT.Y);
  for (let x = 4; x <= 24; x++) {
    const k = (x - 14) / 11;
    g.set(x, Math.round(9 + bob + Math.sqrt(Math.max(0, 1 - k * k)) * 2.4), HAT.Z);
  }
  if (Math.sin(a) >= 0) g.oval(fx, fy, 2.6, 1.4, HAT.y);
  // The crown: a round dome standing up out of the brim, a band round its foot.
  const cx = 14 - Math.round(Math.cos(a) * 0.8);
  g.oval(cx, 5.4 + bob, 5.5, 3.6, HAT.Y);
  g.oval(cx - 2, 4 + bob, 2, 1.2, HAT.Z);
  g.rect(cx - 5, 8 + bob, 11, 1, HAT.X);
  // The cord's end, trailing in the water.
  const tx = 14 + Math.cos(a + 2.2) * 12;
  g.line(14 + Math.cos(a + 2.2) * 7, 11 + bob, tx, 13, HAT.t);
  // The swell lapping at the brim.
  g.rect(2 + (f % 3), 13, 4, 1, LAP);
  g.rect(21 - (f % 2), 13, 4, 1, LAP);
  return g.outline(HAT.k, [UNDER, LAP]).rows();
}
export const TR_HAT_FLOAT_SPRITES = Object.fromEntries(Array.from({ length: 6 }, (_, f) => ['abcdef'[f], hatFloat(f)]));


// =====================================================================
// BRAMBLE ON THE BEACH
// =====================================================================
const B = BRAMBLE_PALETTE;
const HATCHET = [B.S, B.M, B.O, B.l];
// His walking frames with the hatchet taken off his shoulder (he drops it).
const noHatchet = (rows) => rows.map((row) => [...row].map((ch, x) => (x <= 4 && 'SMOl'.includes(ch) ? '.' : ch)).join(''));

// Washed up face down: his own drawing laid down flat, wet; `heave`, his back lifts.
function brambleLie(heave) {
  const flat = turned(noHatchet(BRAMBLE_FRAMES.downIdle), B, -Math.PI / 2, 24);
  const g = new Grid(24, 14);
  for (let y = 0; y < 24; y++) for (let x = 0; x < 24; x++) {
    const c = flat.get(x, y);
    if (c && c !== B.k) g.set(x, y - 7 - (heave && x > 8 && x < 16 ? 1 : 0), c);
  }
  // The wet sand dark round him, the sea's last wash running off.
  g.outline(OUT);
  for (const [x, y] of [[2, 13], [9, 13], [15, 13], [21, 12]]) if (!g.get(x, y)) g.set(x, y, LAP);
  return g.rows();
}
export const TR_BRAMBLE_LIE_SPRITES = { a: brambleLie(false), b: brambleLie(true) };

// From behind, going for the water. `stage` 0: crouched to spring, arms swung back;
// 1: springing, stretched tall, arms straight up; 2: in the air, flat out, arms
// together over his head, boots together.
function brambleDive(stage) {
  const g = new Grid(18, 27);
  const up = noHatchet(BRAMBLE_FRAMES.upIdle);
  if (stage === 0) {
    // Head and shirt three rows lower, the knees bent out, hands back by his hips.
    g.paste(up.slice(0, 15), B, 1, 8);
    g.paste(['..k))Lk..k))Lk..'], B, 1, 26);
    g.paste(['...kDDDDDDDDk...', '..kDDk....kDDk..', '..kDk......kDk..'], B, 1, 23);
    g.rect(2, 21, 2, 2, B.C);
    g.rect(14, 21, 2, 2, B.C);
  } else {
    const lift = stage === 2 ? 2 : 0;
    // (Without the arms hanging at his sides: they go up.)
    g.paste(up, B, 1, 6 - lift, { keep: (color, x, y) => !(y >= 12 && color === B.C && (x <= 4 || x >= 12)) });
    // Arms straight up over his head, hands together at the top.
    g.line(4, 18 - lift, 6, 2, B[3], 2);
    g.line(12, 18 - lift, 10, 2, B[3], 2);
    g.rect(7, 0, 4, 2, B.C);
    if (stage === 2) {
      // Flat out: boots together and pointed, off the ground.
      for (let y = 22; y < 27; y++) g.rect(0, y, 18, 1, null);
      g.paste(['....kDDDDDDk....', '.....kDDDDk.....', '.....k)LL)k.....'], B, 1, 22);
    } else {
      // One boot pushing off, the other already up.
      for (let y = 25; y < 27; y++) g.rect(0, y, 18, 1, null);
      g.paste(['...kDwk..kDDk...', '..k))Lk..k))k...', '.........kLk....'], B, 1, 24);
    }
  }
  return g.outline(OUT).rows();
}
export const TR_BRAMBLE_DIVE_SPRITES = { a: brambleDive(0), b: brambleDive(1), c: brambleDive(2) };

// Facing you, bent nearly double, teeth gritted, both fists up at his shoulders on
// the collar and the hand behind him, boots digging into the sand one after the other.
function brambleHaul(f) {
  const g = new Grid(16, 21);
  const down = noHatchet(BRAMBLE_FRAMES.downIdle);
  const dip = f % 2;
  // Head and shoulders, bent forward (a row lower).
  g.paste(down.slice(0, 15), B, 0, 2 + dip);
  // Gritted teeth.
  g.rect(7, 13 + dip, 3, 1, '#ffffff');
  g.set(6, 13 + dip, B.k);
  g.set(10, 13 + dip, B.k);
  // Fists up over each shoulder, gripping what's behind him.
  g.rect(2, 12 + dip, 2, 3, B.C);
  g.rect(13, 12 + dip, 2, 3, B.C);
  g.rect(3, 11 + dip, 1, 1, B.k);
  // The shirt tails and the legs, one boot driving in.
  g.paste(['...k3U33U33Uk...', '...kUkUkkUkZk...'], B, 0, 16);
  const legs = [
    ['...kDDDDDwDDk...', '..kDDk...kDDk...', '.k))Lk...k))Lk..'],
    ['...kDDDDDwDDk...', '...kDDk.kDDk....', '..k))Lk.k))Lk...'],
    ['...kDDDDDwDDk...', '...kDDk...kDDk..', '..k))Lk...k))Lk.'],
    ['...kDDDDDwDDk...', '...kDDk.kDDk....', '..k))Lk.k))Lk...'],
  ][f];
  g.paste(legs, B, 0, 18);
  // Water running off him.
  g.set(1, 17 + dip, LAP);
  g.set(14, 19 - dip, LAP);
  return g.outline(OUT, [LAP]).rows();
}
export const TR_BRAMBLE_HAUL_SPRITES = { a: brambleHaul(0), b: brambleHaul(1), c: brambleHaul(2), d: brambleHaul(3) };

// The hatchet he dropped on the sand.
function hatchet(glint) {
  const g = new Grid(14, 7);
  g.line(1, 4, 10, 2, B.l);
  g.set(5, 3, '#6a4426');
  g.rect(9, 0, 3, 4, B.M);
  g.rect(12, 1, 1, 3, B.S);
  g.set(10, 3, B.O);
  if (glint) g.set(12, 1, '#ffffff');
  g.outline(OUT);
  g.rect(2, 6, 9, 1, 'rgba(40, 46, 44, 0.35)');
  return g.rows();
}
export const TR_HATCHET_SPRITES = { a: hatchet(false), b: hatchet(true) };

// =====================================================================
// UNDER THE WATER (side on, facing right; the vision turns them)
// =====================================================================
// Bramble swimming: head at the right, hair floating up off it, the flannel shirt
// ballooning and its tails flapping, the arms digging (`f` 0-3: reach, pull, push,
// recover), the legs kicking like he's cross. `puff`: his cheeks blown out,
// holding his breath. `reach`: one arm out as far as it goes.
const WET = { hair: '#9a4218', hairHi: '#d07a34', skin: '#e8c8a4', skinLo: '#c49a7a' };
function underBramble(f, { puff = false, reach = false } = {}) {
  const g = new Grid(32, 18);
  const kick = [0, 2, 0, -2][f];
  // Legs, kicking: one up, one down, boots at the ends.
  g.line(10, 10, 2, 9 - kick, B.D, 2);
  g.line(10, 11, 2, 12 + kick, B.D, 2);
  g.rect(0, 8 - kick, 3, 2, B[')']);
  g.rect(0, 12 + kick, 3, 2, B[')']);
  g.set(6, 9 - Math.round(kick / 2), B.w);
  // The shirt, ballooning, its tails flapping back past his hips.
  g.oval(16, 9, 7, 3.4, B[3]);
  for (const x of [11, 14, 17, 20]) g.line(x, 6, x, 12, B.U);
  g.line(10, 7, 22, 7, B.Z);
  g.line(10, 11, 22, 11, B.Z);
  const flap = [0, 1, 2, 1][f];
  g.line(10, 12, 6, 13 + flap, B[3]);
  g.line(10, 13, 5, 15 + flap, B.U);
  // The head, a bit up and forward, hair floating up off it in tufts.
  const hx = 26;
  const hy = 8;
  g.oval(hx, hy, puff ? 4 : 3.4, puff ? 3.6 : 3.2, WET.skin);
  g.oval(hx - 1, hy - 2.4, 3.6, 1.8, WET.hair);
  for (const [dx, up] of [[-3, 3], [-1, 4], [1, 3], [3, 2]]) {
    const sway = (f + dx) % 2;
    g.line(hx + dx, hy - 3, hx + dx - 1 - sway, hy - 3 - up, dx % 2 ? WET.hairHi : WET.hair);
  }
  g.set(hx + 1, hy, B.k);
  g.set(hx + 2, hy + 1, B['*']);
  if (puff) {
    // Cheeks blown out, lips pressed shut.
    g.oval(hx + 2, hy + 2, 2, 1.4, '#f2b8a0');
    g.set(hx + 4, hy + 2, B.k);
  } else {
    g.set(hx + 3, hy + 2, B.k);
  }
  // The arms: digging, all elbows.
  const shoulder = [21, 7];
  const arms = reach
    ? [[31, 6 + (f % 2)], [24, 14]]
    : [[[30, 4], [28, 13], [20, 14], [25, 2]][f], [[22, 14], [29, 11], [30, 3], [17, 13]][f]];
  arms.forEach(([x, y], i) => {
    g.line(shoulder[0], shoulder[1] + i * 2, x, y, i ? B.U : B[3], 2);
    g.rect(x - 1, y - 1, 2, 2, WET.skin);
  });
  return g.outline(OUT).rows();
}
export const TR_UW_BRAMBLE_SPRITES = { a: underBramble(0), b: underBramble(1), c: underBramble(2), d: underBramble(3) };
export const TR_UW_BRAMBLE_PUFF_SPRITES = { a: underBramble(0, { puff: true }), b: underBramble(1, { puff: true }), c: underBramble(2, { puff: true }), d: underBramble(3, { puff: true }) };
export const TR_UW_BRAMBLE_REACH_SPRITES = { a: underBramble(0, { reach: true }), b: underBramble(1, { reach: true }) };

// The hero, limp, sinking: lying back in the water, head tipped back, arms floating
// up, the scarf drifting up off him in a long ribbon, his hair lifting.
function underHero(f) {
  const g = new Grid(30, 18);
  const d = f ? 1 : 0;
  // Legs trailing down and back.
  g.line(13, 11, 3, 14 + d, P.p, 2);
  g.line(13, 12, 4, 16, P.p, 2);
  g.rect(1, 13 + d, 3, 2, P.b);
  g.rect(2, 15, 3, 2, P.b);
  // The body, bent back.
  g.oval(17, 10, 5, 3, P.c);
  // Arms floating up loose.
  g.line(18, 8, 13, 3 - d, P.c, 2);
  g.rect(12, 2 - d, 2, 2, P.s);
  g.line(20, 8, 24, 2 + d, P.c, 2);
  g.rect(24, 1 + d, 2, 2, P.s);
  // The head, tipped back, eyes shut.
  g.oval(24, 10, 3.6, 3.4, P.s);
  g.oval(26, 9, 2.4, 3, P.h);
  g.line(27, 7, 29, 5 - d, P.h);
  g.line(27, 10, 29, 9 + d, P.h);
  g.set(22, 9, '#c9946e');
  g.set(23, 9, '#c9946e');
  // The scarf, drifting up off his neck in a ribbon.
  g.line(21, 9, 19, 5, P.f, 2);
  g.line(19, 5, 21 + d, 1, P.f);
  g.set(22 + d, 0, P.f);
  return g.outline(OUT).rows();
}
export const TR_UW_HERO_SPRITES = { a: underHero(0), b: underHero(1) };

// Ves, limp, sinking: her coat billowing, her scarf trailing, her hair spread out
// above her head in long strands, the mittens loose.
function underVes(f) {
  const g = new Grid(32, 20);
  const d = f ? 1 : 0;
  g.line(13, 13, 3, 16 + d, V.Z, 2);
  g.line(13, 14, 4, 18, V.Z, 2);
  // The coat, billowing open.
  g.oval(17, 12, 6, 3.4, V.G);
  g.line(11, 13, 8, 10 - d, V.G, 2);
  g.line(14, 10, 20, 10, V.J);
  // The scarf trailing.
  g.line(22, 10, 18, 6, V.E, 2);
  g.line(18, 6, 15 + d, 3, V.T);
  // Arms loose, mittens.
  g.line(19, 10, 15, 5 - d, V.G, 2);
  g.rect(14, 4 - d, 2, 2, V['4']);
  g.line(21, 11, 26, 6 + d, V.G, 2);
  g.rect(26, 5 + d, 2, 2, V['4']);
  // The head tipped back, eyes shut, the hair spread out round it in strands.
  g.oval(25, 12, 3.4, 3.2, V.C);
  for (const [x, y] of [[31, 4], [31, 8], [30, 12], [29, 17]]) g.line(27, 11, x, y + (x % 2 ? d : -d), V.L);
  g.line(27, 10, 30, 6, V.l);
  g.oval(27, 11, 2, 2.6, V.L);
  g.set(23, 12, V.k);
  g.set(24, 14, V.u);
  return g.outline(OUT).rows();
}
export const TR_UW_VES_SPRITES = { a: underVes(0), b: underVes(1) };

// Ves, a mitten pressed to her mouth (her own standing drawing), a tremble.
function vesMouth(f) {
  const g = new Grid(16, 26);
  g.paste(VES_FRAMES.downIdle, V, 0, 0);
  // The arm up across the coat, the mitten over her mouth.
  g.line(4, 17, 6, 13, V.G, 2);
  g.rect(6, 12, 3, 2, V['4']);
  g.set(5, 12, V.k);
  return g.rows().map((row) => (f ? row : row));
}
export const TR_VES_MOUTH_SPRITES = { a: vesMouth(0), b: ['................', ...vesMouth(1).slice(0, 25)] };

// --- The lamp room's glass, blown in ------------------------------------------------
const IL_GLASS = ['#16303a', '#22444e', '#3a6670', '#8ab8b4'];
const SKY = ['#081814', '#10261f', '#1c4434', '#4c8a6c'];
const SHARD = ['#3a6670', '#8ab8b4', '#c8eee6'];
const h2 = (x, y, k = 0) => {
  const v = Math.sin(x * 12.9898 + y * 78.233 + k * 37.719) * 43758.5453;
  return v - Math.floor(v);
};
// Any of the glass's drawings with its panes gone: what's left of each pane is a ragged
// edge of teeth along the iron, and through the rest the storm sky, rain streaking it.
// `snap`: columns of mullion broken out (from x0 to x1, rows y0 to y1).
function blownIn(rows, snaps = []) {
  const h = rows.length;
  const w = rows[0].length;
  const g = new Grid(w, h);
  const colour = (x, y) => IL_PALETTE[rows[y]?.[x]];
  const isGlass = (x, y) => IL_GLASS.includes(colour(x, y));
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const c = colour(x, y);
      if (!c) continue;
      const broken = snaps.some(([x0, x1, y0, y1]) => x >= x0 && x <= x1 && y >= y0 && y <= y1);
      if (!isGlass(x, y) && !broken) { g.set(x, y, c); continue; }
      // How far in from the frame this bit of the pane is.
      let d = 9;
      for (let k = 1; k < 9; k++) {
        if (!isGlass(x - k, y) || !isGlass(x + k, y) || !isGlass(x, y - k) || !isGlass(x, y + k)) { d = k; break; }
      }
      // A few long teeth left in the frame (in clumps), the odd short one; the rest gone.
      const clump = h2(Math.floor(x / 3), Math.floor(y / 5), 4) > 0.9;
      const tooth = !broken && ((d === 1 && h2(x, y) > 0.82) || (clump && d <= 2));
      if (tooth) g.set(x, y, d === 1 && h2(x, y, 2) > 0.5 ? SHARD[2] : SHARD[h2(x, y, 3) > 0.4 ? 1 : 0]);
      else {
        // The storm sky through it: green-black, lighter low down where the sea throws the light back, rain.
        const streak = (x * 2 - y * 3 + 40) % 9 === 0;
        g.set(x, y, streak ? SKY[3] : SKY[y > h * 0.45 ? 2 : h2(x, y, 5) > 0.8 ? 1 : 0]);
      }
    }
  }
  return g.rows();
}

// Glass all over the boards, and a length of iron torn out of the frame.
function shards() {
  const g = new Grid(32, 12);
  for (let i = 0; i < 46; i++) {
    const x = Math.floor(h2(i, 1) * 31);
    const y = Math.floor(h2(i, 2) * 11);
    const big = h2(i, 3) > 0.75;
    g.set(x, y, SHARD[big ? 1 : 0]);
    if (big) { g.set(x + 1, y, SHARD[0]); g.set(x, y - 1, SHARD[2]); }
  }
  for (const [x, y] of [[4, 6], [17, 3], [26, 8], [11, 9]]) g.set(x, y, '#ffffff');
  return g.rows();
}
function spar() {
  const g = new Grid(32, 10);
  g.line(1, 7, 29, 2, '#2e343c', 2);
  g.line(2, 8, 30, 3, '#1c2026');
  g.line(1, 6, 28, 1, '#4a5260');
  // Bolts, a bent end, a tooth of glass still in it.
  for (const x of [6, 14, 22]) g.set(x, 6 - Math.round(x / 6), '#6a7480');
  g.set(30, 1, '#2e343c');
  g.set(31, 0, '#2e343c');
  g.set(18, 3, SHARD[1]);
  g.set(18, 2, SHARD[2]);
  g.outline(OUT);
  g.rect(3, 9, 26, 1, 'rgba(0, 0, 0, 0.3)');
  return g.rows();
}
// The great lamp, lit: the dead lamp's drawing with its glass burning. The rings go from
// white at the heart to gold at the rim; the crack stays, black across the light.
function lampLit() {
  const rows = LL_PROP_SPRITES.ll_dead_lamp;
  const g = new Grid(rows[0].length, rows.length);
  const WARM = { '#0e1c20': '#ffd878', '#16282e': '#f6c458', '#22404a': '#fff0b0', '#3a6670': '#fffbe0', '#1a1a1a': '#ffffff' };
  rows.forEach((row, y) => [...row].forEach((ch, x) => {
    const c = LL_PALETTE_EXTRA[ch];
    if (!c) return;
    const d = Math.hypot(x - 34, y - 30);
    // (Only the glass in the drum: the same dark colours are in the brass's shadows lower down.)
    g.set(x, y, d < 25 && WARM[c] ? (d < 8 ? '#ffffff' : WARM[c]) : c);
  }));
  return g.rows();
}
function sill() {
  const g = new Grid(32, 2);
  g.rect(0, 0, 32, 1, '#a07820');
  g.rect(0, 1, 32, 1, '#2a1c08');
  return g.rows();
}
function boardsTorn() {
  const g = new Grid(32, 14);
  // The hole: dark, the grating's bars across it, the sea's green far down between them.
  for (let y = 2; y < 12; y++) {
    const x0 = 3 + Math.round(h2(y, 1, 8) * 3);
    const x1 = 28 - Math.round(h2(y, 2, 8) * 4);
    for (let x = x0; x <= x1; x++) g.set(x, y, (x % 4 === 0 || y % 4 === 1) ? '#2a343c' : h2(x, y, 9) > 0.86 ? '#17574a' : '#06090c');
    g.set(x0, y, '#141c24');
  }
  for (let x = 4; x < 28; x += 4) g.set(x, 5, '#4a5a66');
  // Board ends, split and lifted round its edge.
  for (const [x, y, w] of [[1, 1, 7], [10, 0, 6], [19, 1, 8], [2, 12, 9], [14, 13, 7], [23, 12, 6]]) {
    g.rect(x, y, w, 1, '#564838');
    g.set(x + w - 1, y, '#6a5a46');
    g.set(x, y + (y < 6 ? 1 : -1), '#2e241a');
  }
  g.line(26, 3, 31, 0, '#4e4034');
  g.line(27, 3, 31, 1, '#2e241a');
  return g.rows();
}
export const TR_PROP_SPRITES = {
  tr_lamp_lit: lampLit(),
  tr_sill: sill(),
  tr_boards_torn: boardsTorn(),
  tr_glass_broken: blownIn(IL_PROP_SPRITES.il_lantern_glass, [[16, 17, 4, 11]]),
  tr_glass_broken_b: blownIn(IL_PROP_SPRITES.il_lantern_glass, [[8, 9, 13, 22], [24, 25, 3, 8]]),
  tr_glass_broken_corner: blownIn(IL_PROP_SPRITES.il_lantern_glass_corner),
  tr_glass_broken_corner_r: blownIn(IL_PROP_SPRITES.il_lantern_glass_corner_r),
  tr_glass_shards: shards(),
  tr_spar: spar(),
};

export const TR_PALETTE = palette;
// For props.js: every colour these drawings use.
export const TR_PALETTE_EXTRA = palette;
