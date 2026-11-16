import { Pix, flash, shift, crumble } from './ch5Kit.js';

// THE PALE OLM, 64x50 (code id `pudding`, its first draft name): the guardian
// of Seam Nine (src/data/enemies/pudding.js). Once the miners' cave olm, a
// blind pale thing they kept in a tin dish by the kettle, until it touched the
// star in the pool at the bottom of the glassy shaft. Now it is huge and
// translucent, like wet glass (its skin colours are part see-through, so the
// cave shows through it): you can see its long white spine and ribs, the star
// burning in its belly, and, turning slowly round the star, the things the
// miners left behind (a tin mug, a hard hat, a boot, a pocket watch): what
// the star gave it when it wished the miners back after lunch. Raw red
// gills hang off the back of its head. It has a long flat blind head with a
// mouth like a seam that runs nearly to the gills, and that seam can open much
// too wide, full of needle teeth. Six thin legs with long fingers. When the
// star wakes, seven eyes open down its side. Its tail dives into the rock as
// if the stone were water. It faces left (toward you). Drawn from a pose, like
// the Chapter 5 monsters (ch5Kit.js):
//   wave    how far along its swim it is (the body's S-curve moves)
//   bob     it floats up and down a little
//   glow    the star in its belly: 0 a faint ember, 1 awake, 2 blazing
//   cracks  0 none, 1 a few bright cracks in the glass, 2 it is coming apart
//   fan     how far the gills lift (0 hanging flat, 1 loose, 2 flared)
//   mouth   0 a shut seam, 1 parted, 2 the jaw dropped far too far
//   chaos   the glass flickers through bruise colours (chaos, phase 3)
//   eyes    0 blind (two dark spots under the skin), 1 seven eyes down its side
//   turn    where the kept things are in their slow turn round the star
// Its idle is nearly still on purpose: it holds, and holds, then twitches.
export const PUDDING_PALETTE = {
  k: '#0c0a10',
  // The skin: milky, and see-through in the middle.
  w: 'rgba(246, 240, 240, 0.94)',
  g: 'rgba(226, 216, 218, 0.66)',
  G: 'rgba(200, 186, 194, 0.26)',
  z: 'rgba(164, 144, 160, 0.52)',
  Z: 'rgba(120, 98, 118, 0.72)',
  // Inside: bone, veins, the dark under-skin eye spots.
  v: '#e8dfd2',
  V: '#9a8b84',
  n: 'rgba(178, 60, 72, 0.62)',
  q: 'rgba(58, 28, 42, 0.75)',
  // Gills, mouth, teeth.
  p: '#b4283c',
  P: '#5c0e1c',
  m: '#140409',
  M: '#4a0e1c',
  t: '#ece4d0',
  // The kept things: tin, a hat, a boot.
  i: '#cfd6dc',
  I: '#5a646c',
  h: '#e0b23a',
  H: '#6a5216',
  o: '#4c3628',
  O: '#2a1c14',
  // The star, and the eyes it looks out of.
  e: '#ffffff',
  s: '#ffd95a',
  S: '#fff6c8',
  y: 'rgba(255, 226, 140, 0.75)',
  Y: '#d9a03a',
  // The stone it swims in.
  r: '#4a3a52',
  R: '#7a6684',
  T: '#a898b4',
  // The chaos colours: the glass going every colour of a bruise.
  a: 'rgba(122, 40, 104, 0.78)',
  b: 'rgba(142, 160, 62, 0.66)',
  d: 'rgba(58, 40, 122, 0.78)',
  f: 'rgba(176, 40, 62, 0.78)',
  c: 'rgba(230, 236, 200, 0.7)',
};

// The olm is drawn on a 100x78 plan and shrunk to this size (K), so the
// plan's numbers stay easy to read: sprites are drawn at 2x on the stage, and
// the olm has the right-hand side of the box to itself (about 62 pixels).
const K = 0.64;
const W = Math.round(100 * K);
const H = Math.round(78 * K);
const CHAOS = ['a', 'f', 'b', 'd', 'c', 'f'];
const SKIN = ['w', 'g', 'G', 'z', 'Z'];

function hash(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// Draws in the plan's own coordinates onto the shrunken canvas.
class Plan {
  constructor(pix) { this.pix = pix; }
  set(x, y, c) { this.pix.set(x * K, y * K, c); }
  put(x, y, c, only) { this.pix.put(x * K, y * K, c, only); }
  rect(x, y, w, h, c, only = null) { this.pix.rect(Math.round(x * K), Math.round(y * K), Math.max(1, Math.round(w * K)), Math.max(1, Math.round(h * K)), c, only); }
  ellipse(cx, cy, rx, ry, c, only = null) { this.pix.ellipse(cx * K, cy * K, Math.max(0.6, rx * K), Math.max(0.6, ry * K), c, only); }
  ring(cx, cy, rx, ry, c, thick = 1) { this.pix.ring(cx * K, cy * K, rx * K, Math.max(1, ry * K), c, thick); }
  line(x0, y0, x1, y1, c, thick = 1) { this.pix.line(x0 * K, y0 * K, x1 * K, y1 * K, c, thick); }
  // A line that only paints over `only` (so the insides stay inside the skin).
  lineOn(x0, y0, x1, y1, c, only) {
    const n = Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) * K) * 2 || 1;
    for (let i = 0; i <= n; i++) this.pix.put((x0 + ((x1 - x0) * i) / n) * K, (y0 + ((y1 - y0) * i) / n) * K, c, only);
  }
  poly(points, c, only = null) { this.pix.poly(points.map(([x, y]) => [x * K, y * K]), c, only); }
}

// The body's spine at t (0 snout, 1 tail tip): where it is and how thick.
function spineAt(t, wave, bob) {
  const x = 20 + 76 * t;
  const y = 33 + bob + 3.5 * Math.sin(t * 5.4 + wave) + 26 * t * t;
  let r;
  if (t < 0.1) r = 5 + t * 16;
  else if (t < 0.18) r = 6.6 - (t - 0.1) * 8;
  else if (t < 0.42) r = 6 + (t - 0.18) * 32;
  else r = 13.7 - (t - 0.42) * 19;
  return { x, y, r: Math.max(1.6, r * 1.18) };
}

// The things it kept, at sprite size (stamped only onto its own glass).
const KEPT = {
  mug: ['iiii.', 'iIIiI', 'iIIi.', 'IIII.'],
  hat: ['.hhh.', 'hhhhh', 'HHHHH'],
  boot: ['oo..', 'oO..', 'oOoo', 'OOOO'],
  watch: ['.i.', 'iSi', '.i.'],
};

function draw(pose = {}) {
  const { wave = 0, bob = 0, glow = 0, cracks = 0, fan = 1, mouth = 0, chaos = 0, eyes = 0, frame = 0, turn = 0 } = pose;
  const r = new Pix(W, H);
  const p = new Plan(r);

  const rock = (x, y) => y > 62 - (x - 56) * 0.45 && x > 54;
  const entry = spineAt(0.84, wave, bob);
  const head = spineAt(0.04, wave, bob);

  // Legs first, so the body's glass lies over their tops: six of them, thin,
  // each ending in three long fingers. The far ones are darker.
  for (const t of [0.2, 0.4, 0.6]) {
    const s = spineAt(t, wave, bob);
    for (const [dx, far] of [[1, false]]) {
      const bx = s.x + dx;
      const by = s.y + s.r * 0.6;
      const kx = bx - 5;
      const ky = by + 9;
      const c = far ? 'Z' : 'z';
      p.line(bx, by, kx, ky, c, 1);
      p.line(kx, ky, kx - 1, ky + 6, c, 1);
      for (const f of [-5, -1.5, 2]) p.line(kx - 1, ky + 6, kx - 1 + f, ky + 11, far ? 'Z' : 'w', 1);
    }
  }

  // The body, then the head: long, flat and spade-shaped.
  for (let i = 0; i <= 150; i++) {
    const s = spineAt(i / 150, wave, bob);
    p.ellipse(s.x, s.y, s.r, s.r * 0.92, 'g');
  }
  p.ellipse(head.x - 3, head.y + 1, 11, 5, 'g');
  p.rect(head.x - 15, head.y - 1, 6, 4, 'g');

  // Shade: a wet rim on top, clear glass through the middle, murk below.
  const snap = r.g.map((row) => [...row]);
  const solid = (x, y) => snap[y]?.[x] === 'g';
  for (let x = 0; x < W; x++) {
    let top = -1;
    let bottom = -1;
    for (let y = 0; y < H; y++) if (solid(x, y)) { if (top < 0) top = y; bottom = y; }
    if (top < 0) continue;
    const span = Math.max(1, bottom - top);
    for (let y = top; y <= bottom; y++) {
      if (!solid(x, y)) continue;
      const f = (y - top) / span;
      r.set(x, y, f < 0.12 ? 'w' : f < 0.34 ? 'g' : f < 0.7 ? 'G' : f < 0.88 ? 'z' : 'Z');
    }
  }

  // Inside: the spine, the ribs, a few veins.
  for (let i = 8; i <= 128; i++) {
    const s = spineAt(i / 150, wave, bob);
    p.put(s.x, s.y - s.r * 0.3, i % 5 === 0 ? 'V' : 'v', SKIN);
  }
  for (let t = 0.2; t <= 0.62; t += 0.055) {
    const s = spineAt(t, wave, bob);
    const top = s.y - s.r * 0.3;
    p.lineOn(s.x, top, s.x + 2.5, top + s.r * 0.75, 'V', SKIN);
  }
  for (const [a, b] of [[0.1, 0.2], [0.16, 0.3]]) {
    const s0 = spineAt(a, wave, bob);
    const s1 = spineAt(b, wave, bob);
    p.lineOn(s0.x, s0.y + s0.r * 0.3, s1.x, s1.y + s1.r * 0.45, 'n', ['G', 'z']);
  }

  // The star in its belly (drawn at its own size, so it reads).
  const belly = spineAt(0.36, wave, bob);
  const bx = Math.round(belly.x * K);
  const by = Math.round((belly.y + 1) * K);
  const halo = [2.4, 3.6, 5.4][glow];
  r.ellipse(bx, by, halo, halo * 0.9, 'y', SKIN);
  const R = [2.2, 3.4, 4.4][glow];
  const star = [];
  for (let k = 0; k < 10; k++) {
    const a = -Math.PI / 2 + (k * Math.PI) / 5;
    const rad = k % 2 === 0 ? R : R * 0.42;
    star.push([bx + Math.cos(a) * rad, by + Math.sin(a) * rad]);
  }
  r.poly(star, 's');
  r.set(bx, by, 'S');
  if (glow > 0) r.rect(bx - 1, by - 1, 2, 2, 'S');

  // The kept things, turning slowly round the star, the way things turn in a jar.
  const kept = [['mug', 0], ['hat', 1.6], ['boot', 3.2], ['watch', 4.6]];
  for (const [name, phase] of kept) {
    const a = phase + turn;
    const s = spineAt(0.5 + Math.cos(a) * 0.1, wave, bob);
    const x = Math.round(s.x * K + Math.cos(a) * 1.5 - 2);
    const y = Math.round((s.y + s.r * 0.12 + Math.sin(a) * s.r * 0.3) * K - 1);
    KEPT[name].forEach((row, j) => [...row].forEach((c, i) => { if (c !== '.') r.put(x + i, y + j, c, [...SKIN, 'v', 'V', 'n']); }));
  }

  // Gills: three raw red fronds, sticking up and back from the neck.
  const gx = head.x + 8;
  const gy = head.y - 2;
  [0, 1, 2].forEach((i) => {
    const length = 8 + i * 2 + fan * 2.5;
    const ang = -Math.PI * (0.62 - i * 0.17) - fan * 0.12 * (1 - i);
    const ex = gx + Math.cos(ang) * length;
    const ey = gy + Math.sin(ang) * length + fan * 0.5 * i;
    p.line(gx, gy, ex, ey, 'P', 1);
    for (let k = 2.5; k < length; k += 2.5) {
      const f = k / length;
      const cx = gx + (ex - gx) * f;
      const cy = gy + (ey - gy) * f;
      p.line(cx, cy, cx + 2.4, cy + 1.2, 'p', 1);
    }
    p.set(ex, ey, 'p');
  });

  // The mouth: a seam from the snout nearly back to the gills.
  const tipX = head.x - 15;
  const tipY = head.y + 1.5;
  const hingeX = head.x + 6;
  const hingeY = head.y + 2.5;
  if (mouth === 0) {
    p.line(tipX, tipY, hingeX, hingeY, 'k', 1);
  } else {
    const open = mouth === 2 ? 15 : 5;
    const lowX = tipX + (mouth === 2 ? 5 : 2);
    const lowY = tipY + open;
    // The lower jaw, hanging, under the open mouth.
    p.poly([[lowX - 1, lowY], [hingeX, hingeY], [hingeX + 1, hingeY + 3], [lowX, lowY + 3]], 'z');
    p.line(lowX, lowY + 3, hingeX + 1, hingeY + 3, 'Z', 1);
    p.poly([[tipX, tipY], [hingeX, hingeY], [lowX, lowY]], 'm');
    p.line(tipX + 1, tipY + 1, hingeX - 2, hingeY + 1, 'M', 1);
    // Needle teeth along both jaws.
    for (let f = 0.05; f < 0.85; f += 0.11) {
      p.set(tipX + (hingeX - tipX) * f, tipY + (hingeY - tipY) * f + 1.6, 't');
      p.set(lowX + (hingeX - lowX) * f, lowY + (hingeY - lowY) * f - 1.6, 't');
    }
    p.line(tipX, tipY, hingeX, hingeY, 'k', 1);
  }
  p.set(tipX + 2, tipY - 2.5, 'k');

  // Eyes. Blind: two dark spots under the skin. Awake: seven down its side,
  // and the star looks out of every one.
  if (eyes) {
    for (let k = 0; k < 7; k++) {
      const s = spineAt(0.07 + k * 0.088, wave, bob);
      const ex = Math.round(s.x * K);
      const ey = Math.round((s.y + s.r * 0.1) * K) + (k % 2 ? 1 : -1);
      // A dark socket, and a hard bright point in it, looking your way.
      for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1]]) r.set(ex + dx, ey + dy, 'm');
      r.set(ex - 1, ey + 1, 'k');
      r.set(ex, ey, 'e');
      r.set(ex - 1, ey, 'S');
    }
  } else {
    p.set(head.x - 6, head.y - 1.5, 'q');
    p.set(head.x - 3, head.y - 1.5, 'q');
  }

  // Cracks in the glass, bright with the star's light, running out from it.
  if (cracks > 0) {
    const n = cracks === 1 ? 3 : 7;
    for (let i = 0; i < n; i++) {
      let x = bx;
      let y = by;
      let a = (i / n) * Math.PI * 2 + 0.4;
      const len = (9 + hash(i + 3) * 13) * K * 1.3;
      for (let k = 0; k < len; k++) {
        a += (hash(i * 31 + k) - 0.5) * 0.9;
        x += Math.cos(a);
        y += Math.sin(a);
        if (SKIN.includes(r.get(Math.round(x), Math.round(y)))) r.set(x, y, k < 3 ? 'S' : 'e');
      }
    }
  }

  // Chaos: the glass breaks into patches that flicker through bruise colours.
  if (chaos) {
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        if (!SKIN.includes(r.get(x, y))) continue;
        const cell = Math.floor((x + frame * 2) / 4) + Math.floor((y - frame) / 4) * 17;
        if (hash(cell + frame * 0.37) < 0.38) r.set(x, y, CHAOS[Math.floor(hash(cell * 3 + 1) * CHAOS.length)]);
      }
    }
  }

  // The stone: dark, the tail dives in, the rings spread out round the entry.
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!rock(x / K, y / K)) continue;
      const fleck = (x * 7 + y * 3) % 7 === 0;
      r.set(x, y, fleck ? 'R' : (y + x) % 6 === 0 ? 'm' : 'r');
    }
  }
  for (let i = 100; i <= 150; i += 2) {
    const s = spineAt(i / 150, wave, bob);
    if (rock(s.x, s.y)) p.set(s.x, s.y, 'Z');
  }
  const ex = entry.x;
  const ey = entry.y + 6;
  p.ring(ex, ey + 2, 12 + (frame % 3), 4 + (frame % 3) * 0.6, 'T', 1.4);
  p.ring(ex, ey + 4, 19 + (frame % 3) * 1.5, 6.5 + (frame % 3), 'R', 1.4);
  r.outline('k');
  return r.rows();
}

// Phase 1 idle: far too still. It holds one pose, then a gill twitches, then
// it holds again, then the seam of its mouth parts, just for a moment.
const STILL = { wave: 0.3, bob: 0, glow: 0, fan: 0 };
const IDLE = [
  draw({ ...STILL, frame: 0 }),
  draw({ ...STILL, fan: 1, frame: 0 }),
  draw({ ...STILL, frame: 0, turn: 0.2 }),
  draw({ ...STILL, mouth: 1, frame: 0, turn: 0.2 }),
];
export const PUDDING_SPRITE = IDLE[0];
// Phase 2: the star awake, seven eyes open; still slow, but it breathes now.
const WAKE = [0, 1, 2, 3].map((i) => draw({ wave: 0.3 + i * 0.25, bob: Math.round(Math.sin(i * 1.6)), glow: 1, cracks: 1, fan: 1 + (i % 2), eyes: 1, frame: i, turn: i * 0.4 }));
export const PUDDING_WAKE_SPRITE = WAKE[0];
const CHAOTIC = [0, 1, 2, 3, 4, 5].map((i) => draw({ wave: i * 1.1, bob: Math.round(2 * Math.sin(i * 2.3)), glow: 2, cracks: 2, fan: 2, eyes: 1, mouth: i % 3 === 0 ? 2 : 1, chaos: 1, frame: i, turn: i * 1.1 }));
export const PUDDING_CHAOS_SPRITE = CHAOTIC[0];

const CHIPS = ['#e0d6d8', '#a48ea0', '#ffd95a', '#f6f0f0', '#4a3a52', '#b4283c'];

export const PUDDING_ANIM = {
  chips: CHIPS,
  idle: { fps: 3, frames: IDLE, holds: [12, 1, 9, 2] },
  // Before it strikes, the jaw drops, all the way.
  windup: {
    fps: 7,
    frames: [
      draw({ wave: 0.3, glow: 0, fan: 1, mouth: 1 }),
      draw({ wave: 0.4, bob: -1, glow: 1, fan: 2, mouth: 2 }),
      draw({ wave: 0.5, bob: -2, glow: 1, fan: 2, mouth: 2 }),
    ],
  },
  hurt: {
    fps: 10,
    frames: [
      flash(shift(draw({ wave: 0.2, fan: 0, mouth: 1 }), 2, 0)),
      shift(draw({ wave: 0.3, fan: 0, mouth: 1 }), 2, 0),
      shift(draw({ wave: 0.3, fan: 0 }), 1, 0),
    ],
  },
  death: {
    fps: 3,
    frames: [
      draw({ wave: 0.6, glow: 1, cracks: 2, fan: 0, mouth: 2 }),
      crumble(draw({ wave: 0.9, bob: 2, glow: 2, cracks: 2, fan: 0, mouth: 2 }), 0.4, true),
      crumble(draw({ wave: 1.2, bob: 4, glow: 2, cracks: 2, fan: 0, mouth: 1 }), 0.75, true),
      crumble(draw({ wave: 1.5, bob: 6, glow: 0, cracks: 2, fan: 0 }), 1, true),
    ],
  },
  spared: {
    fps: 3,
    frames: [
      draw({ wave: 0.3, glow: 0, fan: 0, mouth: 0 }),
      draw({ wave: 0.4, bob: 1, glow: 0, fan: 0, mouth: 0 }),
      draw({ wave: 0.5, bob: 2, glow: 0, fan: 1, mouth: 0 }),
    ],
    holds: [2, 2, 5],
  },
};

export const PUDDING_WAKE_ANIM = {
  chips: CHIPS,
  idle: { fps: 4, frames: WAKE, holds: [3, 1, 3, 1] },
  windup: {
    fps: 9,
    frames: [
      draw({ wave: 0.4, glow: 1, cracks: 1, fan: 2, mouth: 1, eyes: 1 }),
      draw({ wave: 0.6, bob: -2, glow: 2, cracks: 1, fan: 2, mouth: 2, eyes: 1 }),
      draw({ wave: 0.8, bob: -3, glow: 2, cracks: 2, fan: 2, mouth: 2, eyes: 1 }),
    ],
  },
  hurt: {
    fps: 10,
    frames: [
      flash(shift(draw({ wave: 0.2, glow: 1, cracks: 1, fan: 0, mouth: 1 }), 2, 0)),
      shift(draw({ wave: 0.4, glow: 1, cracks: 1, fan: 0, mouth: 1, eyes: 1 }), 2, 0),
      shift(draw({ wave: 0.5, glow: 1, cracks: 1, fan: 1, eyes: 1 }), 1, 0),
    ],
  },
  death: PUDDING_ANIM.death,
  spared: PUDDING_ANIM.spared,
  // Played as the star wakes: the glass cracks, and the eyes open.
  intro: {
    fps: 6,
    frames: [
      flash(draw({ wave: 0.3, glow: 1, cracks: 1, fan: 0, mouth: 2 })),
      draw({ wave: 0.3, glow: 2, cracks: 1, fan: 2, mouth: 2 }),
      draw({ wave: 0.3, glow: 1, cracks: 1, fan: 1, eyes: 1 }),
    ],
  },
};

export const PUDDING_CHAOS_ANIM = {
  chips: CHIPS,
  idle: { fps: 8, frames: CHAOTIC },
  windup: {
    fps: 10,
    frames: [
      draw({ wave: 0.4, glow: 2, cracks: 2, fan: 2, mouth: 2, eyes: 1, chaos: 1, frame: 1 }),
      draw({ wave: 0.9, bob: -3, glow: 2, cracks: 2, fan: 2, mouth: 2, eyes: 1, chaos: 1, frame: 2 }),
      draw({ wave: 1.3, bob: -3, glow: 2, cracks: 2, fan: 2, mouth: 2, eyes: 1, chaos: 1, frame: 3 }),
    ],
  },
  hurt: {
    fps: 12,
    frames: [
      flash(shift(draw({ wave: 0.2, glow: 2, cracks: 2, fan: 0, mouth: 1, chaos: 1, frame: 1 }), 2, 0)),
      shift(draw({ wave: 0.5, glow: 2, cracks: 2, fan: 0, mouth: 1, chaos: 1, frame: 2 }), 2, 0),
      shift(draw({ wave: 0.9, glow: 2, cracks: 2, fan: 1, eyes: 1, chaos: 1, frame: 3 }), 1, 0),
    ],
  },
  death: PUDDING_ANIM.death,
  spared: PUDDING_ANIM.spared,
  // Played as chaos starts: the jaw drops past where a jaw should stop.
  intro: {
    fps: 8,
    frames: [
      flash(draw({ wave: 0.2, glow: 2, cracks: 2, fan: 2, mouth: 2, eyes: 1, chaos: 1, frame: 0 })),
      draw({ wave: 0.6, glow: 2, cracks: 2, fan: 2, mouth: 2, eyes: 1, chaos: 1, frame: 4 }),
      draw({ wave: 1.0, glow: 2, cracks: 2, fan: 2, mouth: 1, eyes: 1, chaos: 1, frame: 5 }),
    ],
  },
};

// What is left on the floor of the pool when it is beaten: the glass in
// pieces, the star dull.
export const PUDDING_BEATEN_SPRITE = PUDDING_ANIM.death.frames[PUDDING_ANIM.death.frames.length - 1];
