import { Pix, flash, shift, crumble } from './ch5Kit.js';

// PUDDING, 64x50: the Glass Olm of Seam Nine (src/data/enemies/pudding.js).
// The miners' tea-break mascot, a blind pale cave olm they kept in a tin dish
// by the kettle, until it touched the star in the pool at the bottom of the
// glassy shaft. Now it is huge and see-through, like blown glass, with a
// fan of crystal gills on each side of its blunt head, four small stubby
// legs, a long tail that dives into the rock as if the stone were water
// (rings of stone spread out round where it goes in), and a star burning
// in its belly. It has no eyes; the star sees for it. It faces left
// (toward you). Drawn from a pose, like the Chapter 5 monsters (ch5Kit.js):
//   wave    how far along its swim it is (the body's S-curve moves)
//   bob     it floats up and down a little
//   glow    the star in its belly: 0 a faint ember, 1 awake, 2 blazing
//   cracks  0 none, 1 a few bright cracks in the glass, 2 it is coming apart
//   fan     how wide the gills are spread (0 folded, 1 open, 2 flared)
//   mouth   0 shut, 1 open, 2 yawning
//   chaos   the glass flickers through other colours (chaos, phase 3)
//   eyes    0 none (blind), 1 two star-glints, where the star looks out
export const PUDDING_PALETTE = {
  k: '#0e1a2e',
  w: '#f4ffff',
  g: '#bfeee8',
  G: '#7cc8d4',
  z: '#3f86a8',
  Z: '#245070',
  e: '#ffffff',
  s: '#ffd95a',
  S: '#fff6c8',
  y: '#ffe9a0',
  Y: '#d9a03a',
  p: '#ffb8e0',
  P: '#e070b8',
  c: '#b0f0ff',
  C: '#5ad0e8',
  r: '#4a3a52',
  R: '#7a6684',
  t: '#a898b4',
  m: '#1a0c18',
  // The chaos colours: the glass flickering through other stars' colours.
  a: '#ff7a7a',
  b: '#7aff9a',
  d: '#9a7aff',
  f: '#ffc27a',
};

// The olm is drawn on a 100x78 plan and shrunk to this size (K), so the
// plan's numbers stay easy to read: sprites are drawn at 2x on the stage, and
// the olm has the right-hand side of the box to itself (about 62 pixels).
const K = 0.64;
const W = Math.round(100 * K);
const H = Math.round(78 * K);
const CHAOS = ['a', 'f', 'b', 'C', 'd', 'p'];

function hash(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// Draws in the plan's own coordinates onto the shrunken canvas.
class Plan {
  constructor(pix) { this.pix = pix; }
  set(x, y, c) { this.pix.set(x * K, y * K, c); }
  rect(x, y, w, h, c, only = null) { this.pix.rect(Math.round(x * K), Math.round(y * K), Math.max(1, Math.round(w * K)), Math.max(1, Math.round(h * K)), c, only); }
  ellipse(cx, cy, rx, ry, c, only = null) { this.pix.ellipse(cx * K, cy * K, Math.max(0.6, rx * K), Math.max(0.6, ry * K), c, only); }
  ring(cx, cy, rx, ry, c, thick = 1) { this.pix.ring(cx * K, cy * K, rx * K, Math.max(1, ry * K), c, thick); }
  line(x0, y0, x1, y1, c, thick = 1) { this.pix.line(x0 * K, y0 * K, x1 * K, y1 * K, c, thick); }
  poly(points, c, only = null) { this.pix.poly(points.map(([x, y]) => [x * K, y * K]), c, only); }
}

// The body's spine at t (0 snout, 1 tail tip): where it is and how thick.
function spineAt(t, wave, bob) {
  const x = 22 + 74 * t;
  const y = 33 + bob + 4.5 * Math.sin(t * 5.4 + wave) + 26 * t * t;
  let r;
  if (t < 0.08) r = 5.5 + t * 22;
  else if (t < 0.17) r = 7.2 - (t - 0.08) * 14;
  else if (t < 0.4) r = 6 + (t - 0.17) * 27;
  else r = 12.2 - (t - 0.4) * 17;
  return { x, y, r: Math.max(1.6, r) };
}

function draw(pose = {}) {
  const { wave = 0, bob = 0, glow = 0, cracks = 0, fan = 1, mouth = 0, chaos = 0, eyes = 0, frame = 0 } = pose;
  const r = new Pix(W, H);
  const p = new Plan(r);

  // The rock it is swimming in: a slab at the bottom right, with the olm's
  // tail going into it, and rings of stone rippling out from where it goes in.
  const rock = (x, y) => y > 62 - (x - 56) * 0.45 && x > 54;
  const entry = spineAt(0.84, wave, bob);

  // The tail first (it goes under the stone), then the body over it.
  for (let i = 0; i <= 150; i++) {
    const s = spineAt(i / 150, wave, bob);
    p.ellipse(s.x, s.y, s.r, s.r * 0.92, 'g');
  }
  // The head: a blunt, flat snout.
  const head = spineAt(0.03, wave, bob);
  p.ellipse(head.x - 2, head.y + 1, 8.5, 6, 'g');
  p.rect(head.x - 11, head.y - 1, 4, 4, 'g');

  // Shade: lit from above, deeper glass below, bright rim on the top edge.
  const snap = r.g.map((row) => [...row]);
  const solid = (x, y) => (snap[y]?.[x] ?? '.') !== '.';
  for (let x = 0; x < W; x++) {
    let top = -1;
    let bottom = -1;
    for (let y = 0; y < H; y++) if (solid(x, y)) { if (top < 0) top = y; bottom = y; }
    if (top < 0) continue;
    const span = Math.max(1, bottom - top);
    for (let y = top; y <= bottom; y++) {
      if (!solid(x, y)) continue;
      const f = (y - top) / span;
      let c = f < 0.14 ? 'w' : f < 0.42 ? 'g' : f < 0.72 ? 'G' : 'z';
      if (f > 0.9) c = 'Z';
      if ((x * 5 + y * 11) % 17 === 0 && f > 0.15 && f < 0.7) c = 'c';
      r.set(x, y, c);
    }
  }

  // Little legs: two at the front, two at the back, stubby, with toes.
  for (const t of [0.2, 0.52]) {
    const s = spineAt(t, wave, bob);
    for (const dx of [-3, 4]) {
      const bx = s.x + dx;
      const by = s.y + s.r * 0.8;
      p.rect(bx, by, 2.4, 6, 'G');
      p.rect(bx - 1.4, by + 6, 1.6, 2, 'g');
      p.rect(bx + 1.8, by + 6, 1.6, 2, 'g');
    }
  }

  // Gills: three plumes, crystal feathers, rising from behind the head.
  const gx = head.x + 11;
  const gy = head.y - 2;
  const spread = [-0.15, 0.5, 1.1].map((a) => a + (fan - 1) * 0.28);
  spread.forEach((a, i) => {
    const length = 19 + i * 2 + (fan > 1 ? 4 : 0);
    const ang = -Math.PI / 2 - 0.1 + (a - 0.5) * 1.15;
    const col = chaos ? CHAOS[(i + frame) % CHAOS.length] : (i === 1 ? 'p' : 'c');
    const mid = chaos ? CHAOS[(i + frame + 2) % CHAOS.length] : (i === 1 ? 'P' : 'C');
    const ex = gx + Math.cos(ang) * length;
    const ey = gy + Math.sin(ang) * length + 3;
    p.line(gx, gy, ex, ey, mid, 1);
    for (let k = 3; k < length; k += 3) {
      const f = k / length;
      const cx = gx + (ex - gx) * f;
      const cy = gy + (ey - gy) * f;
      const barb = 4.5 * Math.sin(f * Math.PI) + 1.5;
      p.line(cx, cy, cx - Math.sin(ang) * barb + 1, cy + Math.cos(ang) * barb, col, 1);
      p.line(cx, cy, cx + Math.sin(ang) * barb + 1, cy - Math.cos(ang) * barb, col, 1);
    }
    p.set(ex, ey, 'e');
  });

  // The mouth and nostrils. No eyes: it is blind (until the star looks out).
  const mx = head.x - 10;
  const my = head.y + 3;
  p.set(mx + 1, my - 3, 'k');
  if (mouth === 0) {
    p.line(mx, my, mx + 9, my + 1, 'k', 1);
  } else {
    const open = mouth === 2 ? 6 : 4;
    p.poly([[mx, my], [mx + 10, my + 1], [mx + 8, my + 1 + open], [mx + 1, my + open]], 'm');
    p.line(mx, my, mx + 10, my + 1, 'k', 1);
    p.line(mx + 1, my + open, mx + 8, my + 1 + open, 'k', 1);
  }
  const ex0 = head.x - 3;
  const ey0 = head.y - 2;
  if (eyes) {
    for (const dx of [0, 7]) {
      p.set(ex0 + dx, ey0, 's');
      p.rect(ex0 + dx - 1, ey0 - 1, 2, 2, 'y');
    }
  } else {
    p.set(ex0, ey0, 'Z');
  }

  // The star in its belly (drawn at its own size, so it reads).
  const belly = spineAt(0.33, wave, bob);
  const bx = Math.round(belly.x * K);
  const by = Math.round((belly.y + 1) * K);
  const halo = [2.6, 4, 6][glow];
  r.ellipse(bx, by, halo, halo * 0.9, 'y', ['g', 'G', 'z', 'w', 'c']);
  r.ellipse(bx, by, halo * 0.6, halo * 0.55, 'Y', ['y']);
  const R = [2.5, 4, 5][glow];
  const star = [];
  for (let k = 0; k < 10; k++) {
    const a = -Math.PI / 2 + (k * Math.PI) / 5;
    const rad = k % 2 === 0 ? R : R * 0.42;
    star.push([bx + Math.cos(a) * rad, by + Math.sin(a) * rad]);
  }
  r.poly(star, 's');
  r.set(bx, by, 'S');
  if (glow > 0) r.rect(bx - 1, by - 1, 2, 2, 'S');
  if (glow > 1) for (const [dx, dy] of [[0, -7], [0, 7], [-7, 0], [7, 0]]) r.set(bx + dx, by + dy, 'S');

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
        if (r.get(Math.round(x), Math.round(y)) !== '.') r.set(x, y, k < 3 ? 'S' : 'e');
      }
    }
  }

  // Chaos: the glass breaks into pieces that flicker through other colours.
  if (chaos) {
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const v = r.get(x, y);
        if (!'gGzw'.includes(v)) continue;
        const cell = Math.floor((x + frame * 2) / 4) + Math.floor((y - frame) / 4) * 17;
        if (hash(cell + frame * 0.37) < 0.34) r.set(x, y, CHAOS[Math.floor(hash(cell * 3 + 1) * CHAOS.length)]);
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
  p.ring(ex, ey + 2, 12 + (frame % 3), 4 + (frame % 3) * 0.6, 't', 1.4);
  p.ring(ex, ey + 4, 19 + (frame % 3) * 1.5, 6.5 + (frame % 3), 'R', 1.4);
  for (let i = 0; i < 6; i++) {
    const px = ex - 10 + hash(i + frame) * 30;
    const py = ey - 6 - hash(i * 5 + frame * 2) * 12;
    p.rect(px, py, 2.5, 2.5, i % 2 ? 'R' : 't');
  }
  r.outline('k');
  return r.rows();
}

// Phase 1 (the olm) and phase 2 (the star wakes, glass cracking) idles.
const IDLE = [0, 1, 2, 3].map((i) => draw({ wave: i * 0.55, bob: Math.round(Math.sin(i * 1.6)), glow: 0, fan: 1, frame: i }));
export const PUDDING_SPRITE = IDLE[0];
const WAKE = [0, 1, 2, 3].map((i) => draw({ wave: i * 0.7, bob: Math.round(Math.sin(i * 1.6)), glow: 1, cracks: 1, fan: 1 + (i % 2), eyes: 1, frame: i }));
export const PUDDING_WAKE_SPRITE = WAKE[0];
const CHAOTIC = [0, 1, 2, 3, 4, 5].map((i) => draw({ wave: i * 1.1, bob: Math.round(2 * Math.sin(i * 2.3)), glow: 2, cracks: 2, fan: 2, eyes: 1, mouth: i % 2 ? 1 : 0, chaos: 1, frame: i }));
export const PUDDING_CHAOS_SPRITE = CHAOTIC[0];

const CHIPS = ['#bfeee8', '#7cc8d4', '#ffd95a', '#f4ffff', '#4a3a52'];

export const PUDDING_ANIM = {
  chips: CHIPS,
  idle: { fps: 3, frames: IDLE },
  windup: {
    fps: 7,
    frames: [
      draw({ wave: 0.4, glow: 0, fan: 2, mouth: 1 }),
      draw({ wave: 0.8, bob: -2, glow: 1, fan: 2, mouth: 2 }),
      draw({ wave: 1.2, bob: -3, glow: 1, fan: 2, mouth: 2 }),
    ],
  },
  hurt: {
    fps: 10,
    frames: [
      flash(shift(draw({ wave: 0.2, fan: 0, mouth: 1 }), 2, 0)),
      shift(draw({ wave: 0.5, fan: 0, mouth: 1 }), 2, 0),
      shift(draw({ wave: 0.9, fan: 1 }), 1, 0),
    ],
  },
  death: {
    fps: 3,
    frames: [
      draw({ wave: 0.6, glow: 1, cracks: 2, fan: 0 }),
      crumble(draw({ wave: 0.9, bob: 2, glow: 2, cracks: 2, fan: 0 }), 0.4, true),
      crumble(draw({ wave: 1.2, bob: 4, glow: 2, cracks: 2, fan: 0 }), 0.75, true),
      crumble(draw({ wave: 1.5, bob: 6, glow: 0, cracks: 2, fan: 0 }), 1, true),
    ],
  },
  spared: {
    fps: 3,
    frames: [
      draw({ wave: 0.4, glow: 0, fan: 0, mouth: 0 }),
      draw({ wave: 0.8, bob: -1, glow: 0, fan: 1, mouth: 1 }),
      draw({ wave: 1.1, bob: -1, glow: 1, fan: 1, mouth: 0 }),
    ],
    holds: [2, 2, 5],
  },
};

export const PUDDING_WAKE_ANIM = {
  chips: CHIPS,
  idle: { fps: 5, frames: WAKE },
  windup: {
    fps: 9,
    frames: [
      draw({ wave: 0.4, glow: 1, cracks: 1, fan: 2, mouth: 1, eyes: 1 }),
      draw({ wave: 0.9, bob: -2, glow: 2, cracks: 1, fan: 2, mouth: 2, eyes: 1 }),
      draw({ wave: 1.3, bob: -3, glow: 2, cracks: 2, fan: 2, mouth: 2, eyes: 1 }),
    ],
  },
  hurt: {
    fps: 10,
    frames: [
      flash(shift(draw({ wave: 0.2, glow: 1, cracks: 1, fan: 0, mouth: 1 }), 2, 0)),
      shift(draw({ wave: 0.5, glow: 1, cracks: 1, fan: 0, mouth: 1 }), 2, 0),
      shift(draw({ wave: 0.9, glow: 1, cracks: 1, fan: 1, eyes: 1 }), 1, 0),
    ],
  },
  death: PUDDING_ANIM.death,
  spared: PUDDING_ANIM.spared,
  // Played as the star wakes: the glass cracks and the glow comes up.
  intro: {
    fps: 6,
    frames: [
      flash(draw({ wave: 0.2, glow: 1, cracks: 1, fan: 0, mouth: 2 })),
      draw({ wave: 0.5, glow: 2, cracks: 1, fan: 2, mouth: 2, eyes: 1 }),
      draw({ wave: 0.9, glow: 1, cracks: 1, fan: 1, eyes: 1 }),
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
      draw({ wave: 1.3, bob: -3, glow: 2, cracks: 2, fan: 2, mouth: 1, eyes: 1, chaos: 1, frame: 3 }),
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
  // Played as chaos starts: the whole glass shatters into other colours.
  intro: {
    fps: 8,
    frames: [
      flash(draw({ wave: 0.2, glow: 2, cracks: 2, fan: 2, mouth: 2, eyes: 1, chaos: 1, frame: 0 })),
      draw({ wave: 0.6, glow: 2, cracks: 2, fan: 2, mouth: 2, eyes: 1, chaos: 1, frame: 4 }),
      draw({ wave: 1.0, glow: 2, cracks: 2, fan: 2, eyes: 1, chaos: 1, frame: 5 }),
    ],
  },
};

// What is left on the floor of the pool when it is beaten: the glass in
// pieces, the star dull, and the little tin dish.
export const PUDDING_BEATEN_SPRITE = PUDDING_ANIM.death.frames[PUDDING_ANIM.death.frames.length - 1];
