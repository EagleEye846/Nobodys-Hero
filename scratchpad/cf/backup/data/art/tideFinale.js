// The end of chapter 5 (the scenes after the Corrie fight, src/data/scenes/
// tideHeldFinale.js): pictures that only those scenes use, all animations, so a
// scene actor can play them ('anim:tf_corrie_sit'). Drawn with the small painter
// below, standing on the bottom edge. Every id starts `tf_`.
//
//   tf_corrie_sit   Corrie after the fight: sitting on the floor, small, the
//                   oilskin round him like a tent, head down, dripping; his
//                   staff lying by him, its light nearly out (3 frames, 24x18)
//   tf_oilskin      where he was: only the oilskin, empty, slumped flat in a
//                   puddle on the boards (2 frames, 24x10)
//   tf_wave         the sea behind him standing up: a wall of green water
//                   rising out of the floor and curling over, foam on its
//                   crest, the lip pitching over (6 frames, 168x120; `once`)
//   tf_far_light    the far lantern out on the sand lighting (4 frames,
//                   17x23; `once`), then tf_far_glow, its halo twinkling (loop)
//   tf_haddock_strain  Haddock at the crank from behind, hat gone, both
//                   flippers up on the handle, leaning into it (4 frames,
//                   24x34, loop; drawn in coastFolk.js); tf_haddock_look, looking back over his
//                   shoulder without letting go (2 frames)

import { CF_PALETTE, HADDOCK_CRANK_BACK } from './coastFolk.js';

// --- A tiny painter ---------------------------------------------------
const colors = new Map();
const palette = {};
function char(color) {
  if (!colors.has(color)) {
    const c = String.fromCharCode(0x5600 + colors.size);
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
    for (let dy = -ry; dy <= ry; dy++) {
      const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (dy * dy) / (ry * ry + 0.25))));
      this.rect(cx - w, cy + dy, w * 2 + 1, 1, c);
    }
  }

  line(x0, y0, x1, y1, c) {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= steps; i++) this.set(x0 + ((x1 - x0) * i) / steps, y0 + ((y1 - y0) * i) / steps, c);
  }

  // A one-pixel outline round everything drawn, skipping colours in `skip`
  // (water and puddles get no hard edge).
  outline(c, skip = []) {
    const solid = (x, y) => {
      const v = this.get(x, y);
      return v && !skip.includes(v);
    };
    const edge = [];
    for (let y = -1; y <= this.h; y++) {
      for (let x = -1; x <= this.w; x++) {
        if (this.get(x, y)) continue;
        if (solid(x - 1, y) || solid(x + 1, y) || solid(x, y - 1) || solid(x, y + 1)) edge.push([x, y]);
      }
    }
    for (const [x, y] of edge) this.set(x, y, c);
  }

  rows() {
    return this.cells.map((row) => row.map((c) => (c ? char(c) : '.')).join(''));
  }
}

const OUT = '#141a24';
// Corrie's colours (as in coastFolk.js): see-through and pale.
const SKIN = ['rgba(222, 238, 246, 0.9)', 'rgba(158, 194, 218, 0.88)'];
const HAIR = ['rgba(58, 74, 118, 0.95)', 'rgba(104, 126, 178, 0.92)'];
const COAT = ['rgba(255, 232, 150, 0.85)', 'rgba(242, 208, 96, 0.82)', 'rgba(188, 148, 48, 0.82)', 'rgba(150, 112, 34, 0.85)'];
const WOOD = ['#7a5e44', '#a88a68'];
const GLOW = ['rgba(143, 240, 255, 0.55)', 'rgba(232, 255, 255, 0.7)'];
const DROP = 'rgba(196, 236, 255, 0.9)';
const PUDDLE = ['rgba(120, 190, 200, 0.35)', 'rgba(190, 236, 240, 0.5)'];
const SEA = ['#123c38', '#1c5a4e', '#2a7864', '#45967c', '#79bc9c', '#b4e2c8'];
const FOAM = ['#ffffff', '#e4fbef', '#c2ead8'];

// Corrie sitting on the floor, knees drawn up under the coat, which stands
// round him like a tent; head down, wet hair, eyes nearly shut. `drip` moves
// the drops; `glow` is how much light is left in the staff by him.
function corrieSit({ drip = 0, glow = 1, blink = false } = {}) {
  const g = new Grid(24, 18);
  // The staff, lying on the boards beside him, its end barely lit.
  g.line(1, 16, 9, 15, WOOD[0]);
  g.line(1, 15, 8, 14, WOOD[1]);
  if (glow) g.set(1, 14, GLOW[glow > 1 ? 1 : 0]);
  // The coat: a tent of yellow from his shoulders to the floor, spread wide.
  for (let y = 7; y <= 17; y++) {
    const half = 3.5 + (y - 7) * 0.75;
    const x0 = Math.round(13 - half);
    const x1 = Math.round(13 + half);
    for (let x = x0; x <= x1; x++) g.set(x, y, x <= x0 + 1 ? COAT[0] : x >= x1 - 1 ? COAT[2] : COAT[1]);
  }
  // Its hem on the floor, darker, a little ragged.
  g.rect(5, 17, 17, 1, COAT[3]);
  [6, 9, 15, 19].forEach((x) => g.set(x, 16, COAT[2]));
  // Folds where his knees push it up, and the line down the front.
  g.line(13, 9, 13, 16, COAT[2]);
  g.set(10, 11, COAT[0]);
  g.set(16, 11, COAT[0]);
  g.line(9, 12, 11, 12, COAT[2]);
  g.line(15, 12, 17, 12, COAT[2]);
  // Tiny hands, holding his knees through the sleeves.
  g.rect(11, 12, 2, 1, SKIN[0]);
  g.rect(14, 12, 2, 1, SKIN[0]);
  // The collar, up round his chin.
  g.rect(10, 7, 7, 1, COAT[2]);
  // His head, bowed a little: too big, pale, wet hair plastered down.
  g.oval(13, 4, 3, 3, SKIN[0]);
  g.rect(10, 1, 7, 2, HAIR[0]);
  g.rect(11, 0, 5, 1, HAIR[1]);
  g.set(10, 3, HAIR[0]);
  g.set(16, 3, HAIR[0]);
  g.set(12, 1, HAIR[1]);
  // Eyes nearly shut, looking at the floor.
  g.rect(11, 4, 2, 1, blink ? SKIN[1] : HAIR[0]);
  g.rect(14, 4, 2, 1, blink ? SKIN[1] : HAIR[0]);
  g.set(13, 6, SKIN[1]);
  g.outline(OUT, [GLOW[0], GLOW[1]]);
  // Drops running off the coat into the boards.
  g.set(5 + (drip % 2), 14 + drip, DROP);
  g.set(21 - (drip % 2), 13 + ((drip + 1) % 3), DROP);
  return g.rows();
}

export const TF_CORRIE_SIT_SPRITES = {
  a: corrieSit({ drip: 0, glow: 1 }),
  b: corrieSit({ drip: 1, glow: 1, blink: true }),
  c: corrieSit({ drip: 2, glow: 2 }),
};

// The oilskin, empty, slumped flat where he sat: the collar fallen in, one
// sleeve out across the boards, water running out of it.
function oilskin(shine = 0) {
  const g = new Grid(24, 10);
  // The puddle first, under everything.
  g.oval(12, 7, 11, 2, PUDDLE[0]);
  g.rect(3 + shine * 4, 7, 4, 1, PUDDLE[1]);
  // The coat, crumpled: a low heap with a fold on top.
  for (let y = 3; y <= 8; y++) {
    const half = 3 + (y - 3) * 1.4;
    const x0 = Math.round(12 - half);
    const x1 = Math.round(12 + half);
    for (let x = x0; x <= x1; x++) g.set(x, y, x <= x0 + 1 ? COAT[0] : x >= x1 - 1 ? COAT[2] : COAT[1]);
  }
  // The collar, fallen in on nothing.
  g.rect(9, 3, 6, 1, COAT[2]);
  g.rect(10, 4, 4, 1, COAT[3]);
  // A sleeve out across the floor, its cuff rolled four times.
  g.line(17, 7, 22, 8, COAT[1]);
  g.line(17, 6, 22, 7, COAT[0]);
  g.rect(21, 7, 2, 2, COAT[2]);
  // Fold lines.
  g.line(7, 6, 10, 5, COAT[2]);
  g.line(13, 6, 16, 7, COAT[2]);
  g.outline(OUT, [PUDDLE[0], PUDDLE[1]]);
  g.set(18 + shine, 9, DROP);
  return g.rows();
}

export const TF_OILSKIN_SPRITES = {
  a: oilskin(0),
  b: oilskin(1),
};

// The wave: frame `f` of 6, coming straight at you. A wall of green water
// standing up out of the floor behind the lamp, broad at the foot and taller
// than the room's glass by the end: dark and deep low down, jade and glassy
// near the top where the light comes through it, streaked with water running
// up its face. Its crest is ragged with foam and flings spray back off the
// top; from frame 4 the lip pitches forward over you, a curtain of white
// pouring down its front with a band of shadow under it. Two of his paper
// boats ride up in it. A dark edge round it so it stands off the floor.
const SEA_EDGE = '#0a2422';
const SEA_SHADE = '#0e302c';
const PAPER = ['#f4efe0', '#c8c2b0'];
function wave(f) {
  const W = 168;
  const H = 120;
  const g = new Grid(W, H);
  const rise = (f + 1) / 6;
  const height = 22 + rise * (H - 30);
  const pitch = f >= 3 ? (f - 2) / 3 : 0;
  const topAt = (x) => {
    const k = (x - W / 2) / (W / 2);
    // A broad wall, nearly flat along the top, falling away at the ends, and
    // heaped higher in two places, lumpy along the crest.
    const shape = Math.max(0, 1 - Math.pow(Math.abs(k), 3.2) * 0.78) * (0.9 + 0.1 * Math.cos(k * 7.5 + 0.6));
    return Math.round(H - 1 - height * shape - Math.sin(x * 0.31 + f * 0.9) * 2 - Math.sin(x * 0.11 + f) * 2);
  };
  // The body, banded from dark at the foot to glassy near the top.
  for (let x = 0; x < W; x++) {
    const top = topAt(x);
    for (let y = Math.max(0, top); y < H; y++) {
      const d = (y - top) / Math.max(1, H - top);
      const band = d < 0.06 ? 5 : d < 0.16 ? 4 : d < 0.34 ? 3 : d < 0.58 ? 2 : d < 0.82 ? 1 : 0;
      // Dither between bands so it isn't stripes.
      const edgeMix = (x + y) % 2 === 0 && d > 0.06 && [0.16, 0.34, 0.58, 0.82].some((b) => Math.abs(d - b) < 0.025);
      g.set(x, y, SEA[Math.max(0, band - (edgeMix ? 1 : 0))]);
    }
  }
  // Water running up the face: long streaks, lighter, longer as it climbs.
  for (let i = 0; i < 38; i++) {
    const x = Math.round(3 + ((i * 41 + 7) % (W - 6)));
    const top = topAt(x);
    const start = top + 8 + ((i * 13) % 12);
    const len = Math.round(8 + ((i * 7) % 18) * rise);
    for (let y = start; y < Math.min(H - 3, start + len); y++) g.set(x + ((y >> 3) % 2), y, i % 3 ? SEA[3] : SEA[4]);
  }
  // Curved ripple lines across it, like the skin of the water stretched.
  for (let r = 0; r < 5; r++) {
    const off = 18 + r * 15 + f * 2;
    for (let x = 6; x < W - 6; x += 1) {
      const y = topAt(x) + off + Math.round(Math.sin(x * 0.09 + r) * 3);
      if (y < H - 4 && (x + r * 3) % 5 < 3) g.set(x, y, r < 2 ? SEA[4] : SEA[2]);
    }
  }
  // His paper boats, tossed up in the face of it.
  const boat = (bx, by, tilt) => {
    bx = Math.round(bx);
    by = Math.round(by);
    g.line(bx - 3, by, bx + 3, by + tilt, PAPER[0]);
    g.line(bx - 2, by + 1, bx + 2, by + 1 + tilt, PAPER[1]);
    g.line(bx, by - 3, bx, by, PAPER[0]);
    g.set(bx - 1, by - 1, PAPER[0]);
    g.set(bx + 1, by - 1, PAPER[1]);
  };
  if (f >= 1) boat(48 + f * 2, topAt(48) + 14 + (5 - f) * 4, f % 2);
  if (f >= 2) boat(118 - f, topAt(118) + 10 + (5 - f) * 5, -(f % 2));
  // Under the lip as it pitches: a band of shadow, and the white curtain
  // pouring down the front from the crest.
  if (pitch > 0) {
    for (let x = 4; x < W - 4; x++) {
      const top = topAt(x);
      const shadowTop = top + 4;
      for (let y = shadowTop; y < shadowTop + 3 + Math.round(pitch * 4); y++) if (y < H) g.set(x, y, SEA_SHADE);
      const fall = Math.round(pitch * (14 + ((x * 17) % 11)));
      if ((x * 7 + f) % 4 !== 0) {
        for (let y = top + 3; y < Math.min(H - 2, top + 3 + fall); y++) {
          const k = (y - top - 3) / Math.max(1, fall);
          g.set(x, y, k < 0.4 ? FOAM[0] : k < 0.75 ? FOAM[1] : FOAM[2]);
        }
      }
    }
  }
  // The crest: a ragged band of foam, lumps of it standing up.
  for (let x = 1; x < W - 1; x++) {
    const top = topAt(x);
    if (top < 0) continue;
    g.set(x, top, FOAM[0]);
    g.set(x, top + 1, (x + f) % 3 ? FOAM[1] : FOAM[0]);
    g.set(x, top + 2, (x + f) % 4 ? FOAM[2] : SEA[5]);
    if ((x * 5 + f * 3) % 9 < 2 && top > 2) { g.set(x, top - 1, FOAM[0]); g.set(x, top - 2, FOAM[1]); }
  }
  // Spray flung up off the top: short tufts and loose drops, more as it grows.
  for (let i = 0; i < 14 + f * 6; i++) {
    const x0 = Math.round(6 + ((i * 53 + f * 11) % (W - 12)));
    const top = topAt(x0);
    const len = 1 + ((i * 7 + f * 3) % 3);
    for (let j = 1; j <= len; j++) if (top - 1 - j >= 0) g.set(x0 + (j > 1 && i % 2 ? 1 : 0), top - 1 - j, j === len ? FOAM[2] : FOAM[0]);
    const dropY = top - len - 3 - ((i * 5 + f) % (3 + f));
    if (dropY >= 0) g.set(x0 + (i % 3) - 1, dropY, i % 2 ? FOAM[1] : FOAM[2]);
  }
  g.outline(SEA_EDGE, [FOAM[0], FOAM[1], FOAM[2]]);
  // Foam churning along its foot, where it comes up out of the floor, a little wider than the wave.
  for (let x = 0; x < W; x++) {
    if ((x * 7 + f) % 5 < 3) g.set(x, H - 1 - ((x + f) % 2), FOAM[2]);
    if ((x * 3 + f) % 7 === 0) g.set(x, H - 3, FOAM[1]);
  }
  return g.rows();
}

export const TF_WAVE_SPRITES = Object.fromEntries(Array.from({ length: 6 }, (_, f) => [`f${f + 1}`, wave(f)]));

// The far lantern, out on the sand, seen from the top of the tower: a stick
// with a lantern on it, and the light catching. `step` 0 dark, 1 a spark, 2
// lit, 3 and on bright, with a soft halo round it and a small star of light
// that twinkles (`tw` 0-2), so it reads from that far off against the morning.
const FAR_POST = '#3a2e2a';
const FAR_IRON = '#2a2426';
const FAR_LIT = ['#7a6a50', '#ffb84a', '#ffd870', '#fff4c0'];
const HALO = ['rgba(255, 214, 130, 0.16)', 'rgba(255, 226, 150, 0.32)', 'rgba(255, 240, 190, 0.6)'];
function farLight(step, tw = 0) {
  const g = new Grid(17, 23);
  const cx = 8;
  const cy = 10;
  if (step >= 3) {
    g.oval(cx, cy, 7, 6, HALO[0]);
    g.oval(cx, cy, 4, 4, HALO[1]);
    g.oval(cx, cy, 2, 2, HALO[2]);
    // The star: long arms one way, short the other, swapping as it twinkles.
    const long = tw === 1 ? 8 : 6;
    const short = tw === 2 ? 5 : 3;
    for (let i = 3; i <= long; i++) { g.set(cx - i, cy, HALO[i < 5 ? 2 : 1]); g.set(cx + i, cy, HALO[i < 5 ? 2 : 1]); }
    for (let i = 3; i <= short; i++) { g.set(cx, cy - i, HALO[i < 4 ? 2 : 1]); }
  }
  // The post, driven into the sand, and its little shadow.
  g.rect(cx, cy + 3, 1, 9, FAR_POST);
  g.rect(cx - 2, 22, 5, 1, 'rgba(84, 60, 74, 0.5)');
  g.rect(cx - 1, 21, 3, 1, FAR_POST);
  // The lantern: a cap, the glass, a base.
  g.rect(cx - 1, cy - 2, 3, 1, FAR_IRON);
  g.rect(cx - 1, cy - 1, 3, 3, FAR_LIT[Math.min(3, step)]);
  g.rect(cx - 1, cy + 2, 3, 1, FAR_IRON);
  if (step === 1) g.set(cx, cy, '#fff0b0');
  if (step >= 2) g.set(cx, cy, '#ffffff');
  if (step >= 3) { g.set(cx - 2, cy, FAR_LIT[2]); g.set(cx + 2, cy, FAR_LIT[2]); }
  return g.rows();
}

export const TF_FAR_LIGHT_SPRITES = { a: farLight(0), b: farLight(1), c: farLight(2), d: farLight(3, 0) };
// Once it's lit: the halo breathing and the star twinkling (loop it).
export const TF_FAR_GLOW_SPRITES = { a: farLight(3, 0), b: farLight(3, 1), c: farLight(3, 0), d: farLight(3, 2) };

// Haddock at the crank in the sluice room (the_crank), from behind: his hat
// gone, the bare wet back of his head, both flippers up on the crank's handle
// on the wall above him, leaning his whole weight into it, one boot braced
// back. `strain` 0-2 sinks him lower into it (the crank fighting him); `look`
// turns his head over his shoulder (he can't let go of it to turn round), so
// we see his moustache, a tusk and one eye. 26x34, standing on the bottom.
const HD = {
  out: '#1a1220', hide: '#a8825f', lit: '#c9a27c', dark: '#7d5c42', deep: '#5e4230',
  coat: '#46587a', coatLo: '#33415c', coatHi: '#6a7c9c', coatDk: '#222b40', wet: '#5a6c8e',
  boot: '#3d4258', bootLo: '#2a2e40', tash: '#e4dfd0', tashLo: '#b2ab98', tusk: '#fffbea', eye: '#2a1a1e',
  drip: 'rgba(196, 236, 255, 0.9)',
};
function haddockStrain({ strain = 0, look = false, drip = 0 } = {}) {
  const g = new Grid(26, 34);
  const sink = strain;
  // Boots: the left one braced back and out, the right planted under him.
  g.oval(7, 32, 3, 1, HD.boot);
  g.rect(4, 33, 7, 1, HD.bootLo);
  g.oval(17, 32, 3, 1, HD.boot);
  g.rect(14, 33, 7, 1, HD.bootLo);
  // The coat: a bell, streaming wet, tipped forward a little (narrower at the top as he leans in).
  const top = 15 + sink;
  for (let y = top; y <= 31; y++) {
    const k = (y - top) / (31 - top);
    const half = 6 + k * 3.4;
    const cx = 13 - (1 - k) * 0.6;
    const x0 = Math.round(cx - half);
    const x1 = Math.round(cx + half);
    for (let x = x0; x <= x1; x++) g.set(x, y, x <= x0 + 1 ? HD.coatHi : x >= x1 - 2 ? HD.coatLo : HD.coat);
  }
  g.rect(4, 31, 18, 1, HD.coatDk);
  // The back seam and the belt, and the wet running down it in streaks.
  g.line(13, top + 2, 13, 30, HD.coatLo);
  g.rect(5, top + 8, 16, 1, HD.coatDk);
  for (const [x, y0, len] of [[8, top + 2, 6], [17, top + 4, 7], [10, top + 10, 5], [16, top + 11, 4]]) g.line(x, y0, x, y0 + len, HD.wet);
  // Both arms up to the handle above his head, the sleeves fat, the flippers on the knob.
  const reach = 1 + sink;
  g.line(6, top + 2, 9, reach + 3, HD.coat);
  g.line(7, top + 2, 10, reach + 3, HD.coat);
  g.line(5, top + 3, 8, reach + 4, HD.coatHi);
  g.line(20, top + 2, 16, reach + 3, HD.coat);
  g.line(19, top + 2, 15, reach + 3, HD.coatLo);
  g.line(21, top + 3, 17, reach + 4, HD.coatLo);
  g.oval(9, reach + 1, 2, 1, HD.hide);
  g.oval(16, reach + 1, 2, 1, HD.hide);
  g.set(9, reach, HD.lit);
  g.set(16, reach, HD.dark);
  // The head: no hat, the bare broad back of it, wet and shining, hunched down between his arms.
  const hy = 10 + sink;
  if (look) {
    // Turned over his right shoulder, toward us: the side of the muzzle, the moustache hanging, a tusk, one eye.
    g.oval(14, hy, 7, 5, HD.hide);
    g.oval(19, hy + 2, 4, 3, HD.lit);
    g.rect(16, hy + 4, 7, 2, HD.tash);
    g.rect(18, hy + 6, 4, 1, HD.tashLo);
    g.rect(21, hy + 6, 1, 3, HD.tusk);
    g.set(17, hy - 1, HD.eye);
    g.set(18, hy - 1, HD.eye);
    g.set(17, hy - 2, HD.dark);
    g.set(18, hy + 1, HD.eye);
    g.line(9, hy - 3, 13, hy - 4, HD.lit);
  } else {
    g.oval(13, hy, 7, 5, HD.hide);
    g.oval(13, hy + 3, 6, 2, HD.dark);
    // The moustache, sticking out either side of his head from behind.
    g.rect(4, hy + 3, 3, 2, HD.tash);
    g.set(4, hy + 5, HD.tashLo);
    g.rect(19, hy + 3, 3, 2, HD.tash);
    g.set(21, hy + 5, HD.tashLo);
    // Wet shine on the crown, and a few hairs plastered flat.
    g.line(10, hy - 3, 14, hy - 4, HD.lit);
    g.set(15, hy - 3, HD.lit);
    for (const x of [11, 13, 15]) g.set(x, hy - 1, HD.deep);
  }
  g.outline(HD.out, [HD.drip]);
  // Water running off him.
  g.set(4, 24 + drip, HD.drip);
  g.set(22, 20 + ((drip + 1) % 3), HD.drip);
  g.set(12, hy + 6 + drip, HD.drip);
  return g.rows();
}

// The crank scene draws him with coastFolk.js's own Haddock (haddockCrankBack:
// his usual size, coat and colours), so he is the same walrus as everywhere
// else on the coast. haddockStrain above is the first version, kept for now.
export const TF_HADDOCK_PALETTE = CF_PALETTE;
export const TF_HADDOCK_STRAIN_SPRITES = HADDOCK_CRANK_BACK.strain;
// Looking back over his shoulder at Bramble, still leaning on it.
export const TF_HADDOCK_LOOK_SPRITES = HADDOCK_CRANK_BACK.look;

// The colours every sprite here uses (private characters), for the animations.
export const TF_PALETTE = palette;
