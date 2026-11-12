import { Pix, dissolve, recolour, clip } from './pixKit.js';

// The PINWHEEL, 44x40: a violet sea urchin with a round, cross little face
// and a ring of spines that turn like the arms of a pinwheel, each tipped
// in pink. Idle, the spines creep out and in and the whole ring turns a
// notch; before an attack the spines bristle out to their fullest and the
// face scowls; hit, they flatten; beaten, they drop off one by one; spared,
// they droop soft and it smiles. Drawn in code (see pixKit.js).
export const PINWHEEL_PALETTE = {
  k: '#1a1030',
  p: '#7a46b8',
  P: '#a574e0',
  d: '#4a2a78',
  s: '#5a2f94',
  S: '#8a58d0',
  t: '#ff9ad0',
  T: '#ffd6ec',
  w: '#ffffff',
  e: '#2a1840',
  r: '#e0587a',
  g: '#ffd24a',
  b: '#ffc0d8',
};

const W = 44;
const H = 40;
const CX = 22;
const CY = 21;

// pose: ext (spine length, 1 normal), rot (radians), face ('cross' | 'scowl' | 'hurt' | 'glad' | 'dead'),
// droop (0 stiff, 1 hanging), dy.
function drawUrchin(pose) {
  const { ext = 1, rot = 0, face = 'cross', droop = 0, dy = 0 } = pose;
  const g = new Pix(W, H);
  const cy = CY + dy;
  const N = 20;
  for (let i = 0; i < N; i++) {
    const long = i % 2 === 0;
    let a = rot + (i / N) * Math.PI * 2;
    // A drooping spine bends toward the ground.
    if (droop) {
      const down = Math.PI / 2;
      const d = Math.atan2(Math.sin(down - a), Math.cos(down - a));
      a += d * droop * 0.55;
    }
    const len = (long ? 11 : 6.5) * ext;
    const x0 = CX + Math.cos(a) * 7;
    const y0 = cy + Math.sin(a) * 7;
    const x1 = CX + Math.cos(a) * (7 + len);
    const y1 = cy + Math.sin(a) * (7 + len);
    g.line(x0, y0, x1, y1, long ? 's' : 'S', 1);
    // Spines are two pixels thick near the root.
    g.line(x0, y0, CX + Math.cos(a) * (7 + len * 0.45), cy + Math.sin(a) * (7 + len * 0.45), long ? 's' : 'S', 2);
    g.set(x1, y1, 't');
    if (long && ext > 0.5) g.set(CX + Math.cos(a) * (6.2 + len), cy + Math.sin(a) * (6.2 + len), 'T');
  }
  g.disc(CX, cy, 9, 8.6, 'p');
  g.disc(CX - 2, cy - 3, 5, 3.4, 'P', 'p');
  g.disc(CX + 3, cy + 5, 6, 2.6, 'd', 'p');
  // Tube feet along the bottom: little pale nubs.
  for (const fx of [-6, -2, 2, 6]) g.set(CX + fx, cy + 9, 'b');
  // The face.
  const ex = [CX - 4, CX + 2];
  for (const x of ex) {
    if (face === 'hurt') { g.set(x, cy - 3, 'e'); g.set(x + 2, cy - 3, 'e'); g.set(x + 1, cy - 2, 'e'); g.set(x, cy - 1, 'e'); g.set(x + 2, cy - 1, 'e'); }
    else if (face === 'glad') { g.set(x, cy - 2, 'e'); g.set(x + 1, cy - 3, 'e'); g.set(x + 2, cy - 3, 'e'); g.set(x + 3, cy - 2, 'e'); }
    else if (face === 'dead') { g.line(x, cy - 3, x + 2, cy - 1, 'e'); g.line(x + 2, cy - 3, x, cy - 1, 'e'); }
    else {
      g.rect(x, cy - 4, 3, 3, 'w');
      g.rect(x + 1, cy - 3, 2, 2, 'e');
    }
  }
  if (face === 'scowl') {
    g.line(CX - 5, cy - 6, CX - 1, cy - 4, 'k');
    g.line(CX + 5, cy - 6, CX + 1, cy - 4, 'k');
  } else if (face === 'cross') {
    g.line(CX - 5, cy - 5, CX - 2, cy - 5, 'd');
    g.line(CX + 3, cy - 5, CX + 6, cy - 5, 'd');
  }
  // Mouth.
  if (face === 'glad') { g.line(CX - 3, cy + 2, CX - 2, cy + 3, 'k'); g.line(CX - 2, cy + 3, CX + 2, cy + 3, 'k'); g.line(CX + 2, cy + 3, CX + 3, cy + 2, 'k'); }
  else if (face === 'scowl') { g.rect(CX - 3, cy + 2, 7, 3, 'r'); for (const x of [-3, -1, 1, 3]) g.set(CX + x, cy + 2, 'w'); }
  else if (face === 'hurt' || face === 'dead') g.line(CX - 3, cy + 3, CX + 3, cy + 3, 'k');
  else { g.line(CX - 3, cy + 3, CX + 3, cy + 3, 'k'); g.set(CX - 3, cy + 2, 'k'); g.set(CX + 3, cy + 2, 'k'); }
  g.outline('k');
  // A bead of gold roe at the tip of a spine or two, when it's calm.
  if (face === 'cross' || face === 'glad') {
    const a = rot + 0.2;
    g.set(CX + Math.cos(a) * (7 + 11 * ext), cy + Math.sin(a) * (7 + 11 * ext), 'g');
  }
  return g.rows();
}

const FLASH = { p: 'w', P: 'w', d: 'T', s: 'T', S: 'w', t: 'w' };

export const PINWHEEL_SPRITE = drawUrchin({ ext: 1, rot: 0.1 });

export const PINWHEEL_ANIM = {
  chips: ['#7a46b8', '#ff9ad0', '#a574e0'],
  idle: clip(5, [0, 1, 2, 3, 4, 5], (i) => drawUrchin({ ext: 1 + Math.sin(i * 1.05) * 0.12, rot: 0.1 + i * 0.06, dy: i % 2 ? 0 : -1 })),
  windup: clip(9, [0, 1, 2, 3, 4, 5], (i) => drawUrchin({ ext: 1 + i * 0.06, rot: 0.3 + i * 0.22, face: 'scowl', dy: i > 3 ? -1 : 0 })),
  hurt: clip(12, [0, 1, 2, 3], (i) => {
    const rows = drawUrchin({ ext: i < 2 ? 0.4 : 0.8, rot: 0.1, face: 'hurt', dy: i === 1 ? 1 : 0 });
    return i === 0 ? recolour(rows, FLASH) : rows;
  }),
  death: clip(4, [0, 1, 2, 3, 4, 5], (i) => dissolve(drawUrchin({ ext: Math.max(0.1, 0.7 - i * 0.15), rot: 0.1, face: 'dead', droop: 1, dy: Math.min(i, 3) }), 0, 5)),
  spared: clip(4, [0, 1, 2, 3], (i) => drawUrchin({ ext: 0.9, rot: 0.1 + i * 0.03, face: 'glad', droop: 0.9, dy: i % 2 ? -1 : 0 })),
};
