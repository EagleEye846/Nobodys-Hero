import { Pix, dissolve, flipV, recolour, clip } from './pixKit.js';

// The WRACKEEL, 48x32, facing left: a long teal eel that crackles. Pale belly,
// a ragged dorsal fin, a mouthful of little teeth and yellow sparks dancing
// along its back. Idle, it weaves; it coils up tight and glows before it
// attacks; it flinches straight when it's hit; belly-up when it's beaten; and
// it loops about, sparks all gone soft, when it's spared. Drawn in code (see
// pixKit.js): every frame is the same drawing with a different pose.
export const WRACKEEL_PALETTE = {
  k: '#0f1b26',
  b: '#2f8fa8',
  B: '#1d5f78',
  l: '#c4ece4',
  L: '#8fcfc8',
  y: '#fff06a',
  Y: '#ffc83a',
  w: '#ffffff',
  c: '#8ff0ff',
  e: '#fff7a0',
  r: '#d0485a',
  t: '#f4f2ea',
  g: '#6ac0c8',
};

const W = 48;
const H = 32;

// pose: ph (where the wave is), amp (how big), freq (how many bends), mouth (0 shut, 1 open, 2 wide),
// eye ('open' | 'shut' | 'x' | 'glad'), sparks (how many), spin (spark seed), dy.
function drawEel(pose) {
  const { ph = 0, amp = 6, freq = 2.1, mouth = 0, eye = 'open', sparks = 4, spin = 0, dy = 0, glow = false } = pose;
  const g = new Pix(W, H);
  const N = 70;
  const pts = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const x = 10 + t * 34;
    const y = 15 + dy + Math.sin(ph + t * Math.PI * freq) * amp * (0.2 + t * 0.9);
    const r = 4.3 * (1 - t) ** 0.7 + 1.1;
    pts.push({ x, y, r, t });
  }
  // The dorsal fin first (behind), a ragged comb of spikes.
  pts.forEach((p, i) => {
    if (i % 5 === 0 && p.t > 0.12 && p.t < 0.85) g.line(p.x, p.y - p.r, p.x + 1, p.y - p.r - 2 - (i % 10 === 0 ? 1 : 0), 'B');
  });
  for (const p of pts) g.disc(p.x, p.y, p.r, p.r, 'b');
  for (const p of pts) if (p.t < 0.9) g.disc(p.x, p.y + p.r * 0.45, p.r * 0.7, p.r * 0.45, 'l', 'b');
  for (const p of pts) if (p.t > 0.04) g.disc(p.x, p.y - p.r * 0.5, p.r * 0.6, p.r * 0.3, 'B', 'b');
  for (const p of pts) if (Math.round(p.t * N) % 7 === 0 && p.t < 0.8) g.set(p.x, p.y + p.r * 0.5, 'L');
  // The head: a blunt snout pointing left, and a jaw.
  const hy = pts[0].y;
  g.disc(8.5, hy, 6, 4.2, 'b');
  g.disc(8.5, hy + 2, 4.5, 1.8, 'l', 'b');
  g.rect(2, hy - 1, 3, 3, 'b');
  if (mouth > 0) {
    const open = mouth === 2 ? 4 : 2;
    g.rect(2, hy + 1, 9, open, 'r');
    g.rect(2, hy + 1 + open, 9, 1, 'b');
    for (let x = 3; x < 11; x += 2) { g.set(x, hy + 1, 't'); g.set(x + 1, hy + open, 't'); }
  } else {
    g.line(2, hy + 1, 10, hy + 1, 'k');
    for (let x = 3; x < 10; x += 2) g.set(x, hy + 2, 't');
  }
  // The eye.
  const ex = 9;
  const ey = hy - 2;
  if (eye === 'open') { g.rect(ex, ey, 2, 2, 'e'); g.set(ex, ey, 'k'); }
  else if (eye === 'shut') g.line(ex - 1, ey + 1, ex + 2, ey + 1, 'k');
  else if (eye === 'x') { g.set(ex - 1, ey, 'k'); g.set(ex + 1, ey, 'k'); g.set(ex, ey + 1, 'k'); g.set(ex - 1, ey + 2, 'k'); g.set(ex + 1, ey + 2, 'k'); }
  else if (eye === 'glad') { g.set(ex - 1, ey + 1, 'k'); g.set(ex, ey, 'k'); g.set(ex + 1, ey, 'k'); g.set(ex + 2, ey + 1, 'k'); }
  g.outline('k');
  // Sparks along its back, jumping a little each frame.
  for (let i = 0; i < sparks; i++) {
    const p = pts[Math.floor(((i * 0.23 + 0.12 + spin * 0.07) % 0.9) * N)];
    const sx = p.x + ((i * 5 + spin * 3) % 5) - 2;
    const sy = p.y - p.r - 3 - ((i + spin) % 3);
    const c = i % 2 ? 'y' : 'c';
    g.set(sx, sy, c);
    g.set(sx - 1, sy, 'Y');
    g.set(sx + 1, sy, 'Y');
    g.set(sx, sy - 1, c);
    g.set(sx, sy + 1, c);
    if (glow) g.set(sx + 2, sy + 2, 'y');
  }
  return g.rows();
}

const FLASH = { b: 'w', B: 'L', l: 'w', L: 'w', g: 'w' };

export const WRACKEEL_SPRITE = drawEel({ ph: 0.6, amp: 6, mouth: 0, sparks: 4 });

export const WRACKEEL_ANIM = {
  chips: ['#2f8fa8', '#fff06a', '#c4ece4'],
  // It weaves; sparks hop along its back.
  idle: clip(6, [0, 1, 2, 3, 4, 5].map((i) => i), (i) => drawEel({ ph: i * 1.05, amp: 6, mouth: i % 3 === 0 ? 1 : 0, sparks: 4, spin: i })),
  // It winds itself up into tight bends and the sparks crowd on.
  windup: clip(8, [0, 1, 2, 3, 4, 5], (i) => drawEel({ ph: i * 1.3, amp: 4 + i * 1.3, freq: 2.1 + i * 0.35, mouth: i > 2 ? 2 : 1, sparks: 3 + i * 2, spin: i, glow: i > 2 })),
  hurt: clip(12, [0, 1, 2, 3], (i) => {
    const rows = drawEel({ ph: 0.3, amp: i < 2 ? 1 : 3, freq: 1.4, mouth: 2, eye: 'x', sparks: i < 2 ? 0 : 3, spin: i, dy: i === 1 ? -1 : 0 });
    return i === 0 ? recolour(rows, FLASH) : rows;
  }),
  death: clip(4, [0, 1, 2, 3, 4, 5], (i) => {
    const belly = flipV(drawEel({ ph: 1.2, amp: 2.5 - i * 0.3, freq: 1.5, mouth: 1, eye: 'x', sparks: Math.max(0, 3 - i), spin: i, dy: 2 }));
    return dissolve(belly, i >= 4 ? (i - 3) * 0.12 : 0, 11);
  }),
  spared: clip(5, [0, 1, 2, 3], (i) => drawEel({ ph: i * 1.4, amp: 7, freq: 2.6, mouth: 1, eye: 'glad', sparks: 2, spin: i })),
};
