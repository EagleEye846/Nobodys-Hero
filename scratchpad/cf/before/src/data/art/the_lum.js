import { Pix, recolour, shiftRows } from './pixKit.js';

// THE LUM, 54x74 ("lum" is an old word for a chimney): the last standing
// chimney stack of a burnt farmhouse, at the gate of the buried town. The
// house went in the fire; the chimney didn't, and neither did the fire in it.
// A tall brick stack with a clay pot on top, still breathing smoke, widening
// to a broad hearth-breast. Two bricks are gone above the mantel, and the glow
// shows through them like eyes; the hearth under the mantel is its mouth, a
// fire in it that has never gone out. One mug still stands on the mantelshelf.
// It walks on two fallen hearthstones. Old, gruff, keeping the road. Its
// battle clips (THE_LUM_ANIM): idle, the smoke curls and the fire breathes;
// before an attack the eyes flare and the fire roars up; hit, a brick
// rattles, soot puffs; caught (its second phase, THE_LUM_CAUGHT_ANIM), the
// hearth has caught: flames out of the mouth and the pot, the mortar glowing
// in cracks; beaten, the fire sinks to a red glow and the stack settles;
// spared, the smoke goes up in one slow ring and the eyes go soft. Drawn from
// a pose (see pixKit.js).
export const THE_LUM_PALETTE = {
  k: '#120c0c',
  b: '#7a3a2a',
  B: '#9a5038',
  n: '#5a2a20',
  m: '#3a2420',
  c: '#24201f',
  C: '#3e3633',
  s: '#6e6a66',
  S: '#8e8a84',
  d: '#4a4642',
  p: '#b0683a',
  P: '#d08a54',
  o: '#7a4424',
  e: '#ff8c1a',
  E: '#ffd25e',
  y: '#fff4c8',
  r: '#a8401a',
  R: '#3a120a',
  w: '#5a3a26',
  W: '#7a5634',
  g: '#8d8781',
  G: '#b4aea6',
  u: '#c8c0b0',
};

const W = 54;
const H = 74;

// Fills a row span with brickwork: courses three pixels high, joints staggered.
function bricks(g, y, x0, x1, light = 0) {
  const course = Math.floor(y / 3);
  const inCourse = y % 3;
  for (let x = Math.round(x0); x <= Math.round(x1); x++) {
    let c = 'b';
    if (inCourse === 2) c = 'm';
    else if ((x + (course % 2) * 3) % 6 === 0) c = 'm';
    else if (inCourse === 0 && (x + course) % 5 === 0) c = 'B';
    else if ((x * 7 + course * 3) % 11 === 0) c = 'n';
    if (light && c === 'b' && x < x0 + 3) c = 'B';
    g.set(x, y, c);
  }
}

// pose: flame (0 a red glow, 1 burning, 2 roaring), eye ('glow' | 'blaze' |
// 'dim' | 'out' | 'soft'), lean (-2..2: the stack sways), lift (-1/0/1: a
// hearthstone up), pot (0 sitting, 1 jumping), smoke (0-3: phase of the curl),
// caught (0/1: its second phase), settle (beaten: sunk down this far), ring
// (spared: a smoke ring going up).
function drawLum(pose) {
  const { flame = 1, eye = 'glow', lean = 0, lift = 0, pot = 0, smoke = 0, caught = 0, settle = 0, ring = 0 } = pose;
  const g = new Pix(W, H);
  const base = 66 + settle;
  // The two hearthstones it walks on.
  const stone = (x0, x1, up) => {
    g.rect(x0, base + 1 - up, x1 - x0, 5, 's');
    g.rect(x0, base + 1 - up, x1 - x0, 1, 'S');
    g.rect(x0, base + 5 - up, x1 - x0, 1, 'd');
    g.set(x0 + 3, base + 3 - up, 'd');
    g.set(x1 - 4, base + 2 - up, 'd');
  };
  stone(4, 24, lift < 0 ? 2 : 0);
  stone(30, 50, lift > 0 ? 2 : 0);
  // The hearth-breast: broad, from the shoulders down.
  const breastTop = 37 + settle;
  for (let y = breastTop; y <= base; y++) bricks(g, y, 6, 47, 1);
  // The shoulders, sloping in to the stack.
  for (let y = breastTop - 5; y < breastTop; y++) {
    const k = (breastTop - y) / 5;
    bricks(g, y, 6 + k * 11, 47 - k * 11, 1);
  }
  g.rect(6, breastTop - 1, 42, 1, 'n');
  // The stack, swaying.
  const stackTop = 11 + settle;
  for (let y = stackTop; y < breastTop - 5; y++) {
    const sway = Math.round(lean * (1 - (y - stackTop) / (breastTop - 5 - stackTop)));
    bricks(g, y, 18 + sway, 35 + sway, 1);
  }
  // A course of stone round the top of the stack (the cope).
  g.rect(16 + lean, stackTop, 22, 2, 's');
  g.rect(16 + lean, stackTop, 22, 1, 'S');
  // The pot.
  const py = stackTop - 7 - pot * 2;
  g.rect(21 + lean, py + 1, 12, 6, 'p');
  g.rect(20 + lean, py, 14, 2, 'P');
  g.rect(30 + lean, py + 2, 3, 5, 'o');
  g.rect(22 + lean, py + 2, 1, 4, 'P');
  g.rect(22 + lean, py, 10, 1, 'R');
  // Soot down the stack under the pot.
  for (const x of [22, 27, 31]) g.line(x + lean, stackTop + 2, x + lean, stackTop + 6 + (x % 3), 'm');
  // Mortar cracks glowing (once it has caught).
  if (caught) {
    for (const [x0, y0, x1, y1] of [[20, 20, 24, 27], [31, 15, 29, 24], [9, 44, 13, 52], [42, 41, 39, 50], [26, 30, 23, 36]]) {
      g.line(x0, y0 + settle, x1, y1 + settle, 'r');
    }
    for (const [x, y] of [[22, 24], [30, 19], [11, 48], [40, 45], [24, 33]]) g.set(x, y + settle, 'e');
  }
  // The eyes: two missing bricks above the mantel, the glow behind them.
  const ey = 40 + settle;
  for (const x of [13, 34]) {
    g.rect(x, ey, 6, 3, 'R');
    if (eye === 'glow') { g.rect(x + 1, ey + 1, 4, 1, 'r'); g.set(x + 2, ey + 1, 'e'); g.set(x + 3, ey + 1, 'e'); }
    else if (eye === 'blaze') { g.rect(x + 1, ey, 4, 3, 'e'); g.rect(x + 2, ey + 1, 2, 1, 'E'); g.set(x + 2, ey + 1, 'y'); }
    else if (eye === 'dim') { g.set(x + 2, ey + 1, 'r'); g.set(x + 3, ey + 1, 'r'); }
    else if (eye === 'soft') { g.rect(x + 1, ey + 2, 4, 1, 'r'); g.set(x + 2, ey + 2, 'e'); g.set(x + 3, ey + 2, 'e'); }
  }
  // Heavy brows of soot over them.
  if (eye === 'blaze') { g.line(12, ey - 2, 19, ey - 1, 'c'); g.line(41, ey - 2, 34, ey - 1, 'c'); }
  else { g.line(12, ey - 1, 19, ey - 1, 'm'); g.line(34, ey - 1, 41, ey - 1, 'm'); }
  // The mantelshelf, with the one mug still on it.
  const my = 46 + settle;
  g.rect(3, my, 48, 2, 'W');
  g.rect(3, my + 1, 48, 1, 'w');
  g.rect(4, my + 2, 2, 2, 'w');
  g.rect(48, my + 2, 2, 2, 'w');
  g.rect(40, my - 3, 3, 3, 'u');
  g.set(43, my - 2, 'u');
  g.set(40, my - 3, 'S');
  // The lintel over the hearth.
  g.rect(15, my + 3, 24, 2, 's');
  g.rect(15, my + 3, 24, 1, 'S');
  // The hearth: its mouth, an arch full of dark with the fire at the bottom.
  const top = my + 5;
  for (let y = top; y <= base; y++) {
    const r = y < top + 3 ? [3, 1, 0][y - top] : 0;
    for (let x = 17 + r; x <= 36 - r; x++) g.set(x, y, 'R');
  }
  // Soot round the mouth.
  for (const x of [17, 36]) g.line(x, top, x, base, 'c');
  // Fire-dogs and the fire.
  g.rect(19, base - 1, 2, 2, 'c');
  g.rect(33, base - 1, 2, 2, 'c');
  g.rect(20, base - 2, 14, 1, 'C');
  const fh = [2, 7, 12][flame] + (caught ? 2 : 0);
  for (let x = 19; x <= 34; x++) {
    const h = Math.max(1, Math.round(fh * (0.55 + 0.45 * Math.sin(x * 1.3 + smoke * 1.7)) * (1 - Math.abs(x - 26.5) / 11)));
    for (let k = 0; k < h; k++) {
      const y = base - 2 - k;
      if (y < top) break;
      const hot = k / h;
      g.set(x, y, flame === 0 ? (hot < 0.5 ? 'r' : 'R') : hot < 0.3 ? 'E' : hot < 0.65 ? 'e' : 'r');
    }
  }
  if (flame === 0) for (let x = 20; x <= 33; x += 2) g.set(x, base - 2, 'r');
  else { g.set(25, base - 3, 'y'); g.set(28, base - 4, 'y'); }
  g.outline('k');
  // Caught: flames licking out of the top of the mouth and out of the pot.
  if (caught) {
    for (const [x, h] of [[18, 3], [22, 5], [27, 4], [31, 5], [35, 3]]) {
      for (let k = 0; k < h; k++) g.set(x + ((k + smoke) % 2), top - 1 - k, k < 2 ? 'e' : 'E');
    }
    for (const [x, h] of [[23, 3], [26, 5], [29, 4]]) {
      for (let k = 0; k < h; k++) g.set(x + lean + ((k + smoke) % 2), py - 1 - k, k < 1 ? 'e' : k < 3 ? 'E' : 'y');
    }
  }
  // Smoke curling up off the pot.
  if (!caught && flame > 0 && !ring) {
    const curl = [[0, 0], [1, -1], [0, -2], [-1, -3]];
    for (let i = 0; i < 4; i++) {
      const [dx, dy] = curl[(i + smoke) % 4];
      const y = py - 1 - i + dy * 0.3;
      if (y >= 0) g.set(26 + lean + dx + (i > 1 ? 1 : 0), y, i % 2 ? 'G' : 'g');
    }
  }
  // Spared: one slow ring of smoke going up.
  if (ring) {
    const ry = Math.max(1, py - 2 - ring);
    for (const [dx, dy] of [[-2, 0], [2, 0], [-1, -1], [1, -1], [0, -1], [-1, 1], [1, 1], [0, 1]]) g.set(27 + lean + dx, ry + dy, 'G');
  }
  return g.rows();
}

const FLASH = { b: 'B', B: 'u', n: 'b', m: 'n', s: 'S', S: 'u' };

const IDLE = [0, 1, 2, 3].map((i) => drawLum({ smoke: i, lean: [0, 1, 0, -1][i], flame: 1 }));
export const THE_LUM_SPRITE = IDLE[0];

const CAUGHT = [0, 1, 2, 3].map((i) => drawLum({ smoke: i, lean: [0, 1, 0, -1][i], flame: 2, caught: 1, eye: 'blaze', pot: i % 2 }));
export const THE_LUM_CAUGHT_SPRITE = CAUGHT[0];

// Beaten: the fire down to a red glow, the stack settled, the eyes nearly out.
export const THE_LUM_DEATH_LAST = drawLum({ flame: 0, eye: 'dim', settle: 2, lean: 1 });

export const THE_LUM_ANIM = {
  chips: ['#7a3a2a', '#9a5038', '#6e6a66', '#ff8c1a'],
  idle: { fps: 3, frames: IDLE, holds: [2, 1, 2, 1] },
  windup: {
    fps: 7,
    frames: [
      drawLum({ eye: 'blaze', flame: 2, smoke: 1, lean: 1 }),
      drawLum({ eye: 'blaze', flame: 2, smoke: 2, lean: -1, pot: 1 }),
      drawLum({ eye: 'blaze', flame: 2, smoke: 3, lean: 0, lift: 1 }),
    ],
  },
  hurt: {
    fps: 10,
    frames: [
      recolour(shiftRows(drawLum({ eye: 'dim', flame: 1, lean: 2, pot: 1 }), 2, 0), FLASH),
      shiftRows(drawLum({ eye: 'dim', flame: 1, lean: -2 }), 2, 0),
      shiftRows(drawLum({ eye: 'glow', flame: 1, lean: 1 }), 1, 0),
    ],
  },
  death: {
    fps: 3,
    frames: [
      drawLum({ eye: 'dim', flame: 1, lean: 2, pot: 1 }),
      drawLum({ eye: 'dim', flame: 1, lean: -2, settle: 1 }),
      drawLum({ eye: 'dim', flame: 0, lean: 1, settle: 2 }),
      THE_LUM_DEATH_LAST,
    ],
  },
  spared: {
    fps: 3,
    frames: [0, 1, 2, 3, 4, 5].map((i) => drawLum({ eye: 'soft', flame: 1, smoke: i % 4, ring: 1 + i * 2 })),
  },
  // The hearth catches (played as its second phase starts): the fire roars up out of the mouth and the pot.
  intro: {
    fps: 8,
    frames: [
      recolour(drawLum({ eye: 'blaze', flame: 2, caught: 1, pot: 1, smoke: 0 }), { b: 'B', m: 'r' }),
      drawLum({ eye: 'blaze', flame: 2, caught: 1, pot: 1, smoke: 1, lean: 2 }),
      drawLum({ eye: 'blaze', flame: 2, caught: 1, pot: 0, smoke: 2, lean: -2 }),
    ],
  },
};

// Its second phase's own clips: the same, on fire.
export const THE_LUM_CAUGHT_ANIM = {
  chips: ['#7a3a2a', '#ff8c1a', '#ffd25e', '#6e6a66'],
  idle: { fps: 5, frames: CAUGHT, holds: [1, 1, 1, 1] },
  windup: {
    fps: 8,
    frames: [
      drawLum({ eye: 'blaze', flame: 2, caught: 1, smoke: 1, lean: 2, pot: 1 }),
      drawLum({ eye: 'blaze', flame: 2, caught: 1, smoke: 2, lean: -2, lift: -1 }),
      drawLum({ eye: 'blaze', flame: 2, caught: 1, smoke: 3, lean: 0, lift: 1, pot: 1 }),
    ],
  },
  hurt: {
    fps: 10,
    frames: [
      recolour(shiftRows(drawLum({ eye: 'dim', flame: 2, caught: 1, lean: 2, pot: 1 }), 2, 0), FLASH),
      shiftRows(drawLum({ eye: 'blaze', flame: 2, caught: 1, lean: -2 }), 2, 0),
      shiftRows(drawLum({ eye: 'blaze', flame: 2, caught: 1, lean: 1 }), 1, 0),
    ],
  },
  death: THE_LUM_ANIM.death,
  spared: THE_LUM_ANIM.spared,
};
