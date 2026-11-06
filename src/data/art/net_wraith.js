import { Pix, dissolve, recolour, clip } from './pixKit.js';

// The NET WRAITH, 40x42: a fishing net that drowned with its boat and still
// hangs in the air as if it were in the water. A ghost cut out of rope
// mesh, you can see the sea through it, hollow eyes where a few knots
// are gone, cork floats bobbing along its top edge and a fringe of loose
// strands (and one hook) trailing below. Idle, it sways and the floats bob;
// before an attack it draws tight, the mesh closing; hit, it tangles; beaten,
// it comes undone; spared, it hangs slack and calm. Drawn in code (see pixKit.js).
export const NET_WRAITH_PALETTE = {
  k: '#1c2a2a',
  n: '#c8b48a',
  N: '#8a7650',
  f: 'rgba(130,200,190,0.22)',
  F: 'rgba(130,200,190,0.38)',
  e: '#0e1c1c',
  g: '#9af0c8',
  o: '#e0583a',
  O: '#a83a28',
  W: '#f4ece0',
  i: '#cfd8dc',
  w: '#ffffff',
  m: '#324a46',
};

const W = 40;
const H = 42;

// pose: sway (the bottom swings), tight (0-1, mesh drawn narrower), eye ('glow' | 'narrow' | 'x' | 'happy'),
// bob (floats up/down 0/1), hook (hook line length), dy.
function drawNet(pose) {
  const { sway = 0, tight = 0, eye = 'glow', bob = 0, hook = 6, dy = 0, droop = 0 } = pose;
  const g = new Pix(W, H);
  const cx = 20;
  const cy = 15 + dy;
  const rx = 15 - tight * 3;
  const ry = 12;
  const lowEnd = 33 + dy + droop * 3;
  const inside = (x, y) => {
    if (y < cy) {
      const dx = (x - cx) / rx;
      const dyy = (y - cy) / ry;
      return dx * dx + dyy * dyy <= 1;
    }
    const f = Math.min(1, (y - cy) / (lowEnd - cy));
    const half = rx * (1 - f * 0.5) + 0.5;
    const shift = sway * f * f * 3;
    // A ragged hem.
    if (y > lowEnd - 3 && ((x * 7 + y * 3) % 5 < 2)) return false;
    return y <= lowEnd && Math.abs(x - cx - shift) <= half;
  };
  const mesh = (x, y) => (x + y) % 5 === 0 || (x - y + 100) % 5 === 0;
  const knot = (x, y) => (x + y) % 5 === 0 && (x - y + 100) % 5 === 0;
  const edge = (x, y) => inside(x, y) && (!inside(x - 1, y) || !inside(x + 1, y) || !inside(x, y - 1) || !inside(x, y + 1));
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!inside(x, y)) continue;
      if (edge(x, y)) g.set(x, y, 'N');
      else if (knot(x, y)) g.set(x, y, 'N');
      else if (mesh(x, y)) g.set(x, y, 'n');
      else g.set(x, y, y > cy ? 'F' : 'f');
    }
  }
  // Loose strands hanging from the hem.
  const strands = [-11, -7, -3, 2, 6, 10];
  strands.forEach((sx, i) => {
    const len = 4 + ((i * 5) % 4) + droop * 2;
    const swing = Math.round(Math.sin(i + sway * 1.5) * 1.2);
    g.line(cx + sx + sway * 2, lowEnd - 2, cx + sx + sway * 2 + swing, lowEnd + len, 'n');
    g.set(cx + sx + sway * 2 + swing, lowEnd + len, 'N');
  });
  // The hook and its line, off the right-hand side.
  const hx = cx + 12 + sway * 2;
  g.line(hx, lowEnd - 3, hx, lowEnd - 3 + hook, 'i');
  g.line(hx, lowEnd - 3 + hook, hx + 2, lowEnd - 3 + hook + 2, 'i');
  g.set(hx + 3, lowEnd - 3 + hook + 1, 'i');
  g.set(hx + 3, lowEnd - 3 + hook, 'i');
  // Cork floats along the top edge, bobbing.
  const fy = (i) => cy - ry + 1 + Math.round(Math.abs(Math.sin(i * 1.7)) * 1.5) + (((i + bob) % 2) ? 1 : 0);
  [-10, -5, 0, 5, 10].forEach((fx, i) => {
    const x = cx + fx;
    const y = fy(i) + Math.round(Math.abs(fx) * 0.18);
    g.disc(x, y - 1, 2.2, 2.2, i % 2 ? 'W' : 'o');
    g.set(x + 1, y, 'O');
    g.set(x, y - 2, 'w');
  });
  // The eyes: two holes where a few knots are gone, and a glow in each.
  const ey = cy - 1;
  const eyeAt = (x) => {
    g.disc(x, ey, 3.2, 3.8, 'e');
    if (eye === 'glow') { g.rect(x - 1, ey - 1, 2, 3, 'g'); }
    else if (eye === 'narrow') { g.rect(x - 2, ey, 4, 1, 'g'); g.set(x - 2, ey - 1, 'e'); }
    else if (eye === 'x') { g.set(x - 1, ey - 1, 'g'); g.set(x + 1, ey - 1, 'g'); g.set(x, ey, 'g'); g.set(x - 1, ey + 1, 'g'); g.set(x + 1, ey + 1, 'g'); }
    else { g.set(x - 2, ey + 1, 'g'); g.set(x - 1, ey, 'g'); g.set(x, ey, 'g'); g.set(x + 1, ey + 1, 'g'); }
  };
  eyeAt(cx - 6);
  eyeAt(cx + 5);
  // A mouth: a torn gap in the mesh.
  g.disc(cx - 0.5, ey + 8, 3.6, 2.2, 'e');
  if (eye === 'glow') { g.set(cx - 2, ey + 8, 'g'); g.set(cx + 1, ey + 8, 'g'); }
  if (eye === 'happy') g.line(cx - 3, ey + 7, cx + 2, ey + 7, 'g');
  g.outline('k');
  return g.rows();
}

const FLASH = { n: 'w', N: 'i', f: 'W', F: 'W' };

export const NET_WRAITH_SPRITE = drawNet({});

export const NET_WRAITH_ANIM = {
  chips: ['#c8b48a', '#e0583a', '#9af0c8'],
  idle: clip(3, [0, 1, 2, 3], (i) => drawNet({ sway: [0, 0.5, 0, -0.5][i], bob: i, hook: [6, 7, 6, 5][i], dy: i % 2 ? -1 : 0 })),
  windup: clip(8, [0, 1, 2, 3, 4], (i) => drawNet({ sway: i % 2 ? 0.4 : -0.4, tight: Math.min(1, i * 0.35), eye: 'narrow', bob: i, hook: 4 + i * 2, dy: i > 2 ? -1 : 0 })),
  hurt: clip(12, [0, 1, 2, 3], (i) => {
    const rows = drawNet({ sway: i % 2 ? 1 : -1, tight: 0.6, eye: 'x', hook: 3, dy: i === 1 ? 1 : 0 });
    return i === 0 ? recolour(rows, FLASH) : rows;
  }),
  death: clip(4, [0, 1, 2, 3, 4, 5], (i) => dissolve(drawNet({ sway: 0, eye: 'x', droop: Math.min(1, i * 0.4), dy: Math.min(i, 4), hook: 2 }), i >= 1 ? i * 0.17 : 0, 21)),
  spared: clip(3, [0, 1, 2, 3], (i) => drawNet({ sway: [0, 0.4, 0, -0.4][i], eye: 'happy', droop: 0.6, bob: i, hook: 4, dy: i % 2 ? 0 : -1 })),
};
