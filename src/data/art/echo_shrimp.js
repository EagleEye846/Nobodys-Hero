import { Pix, flash, shift, crumble } from './ch5Kit.js';

// The ECHO BAT-SHRIMP, 44x36: a pale, eyeless cave shrimp, the blue-white of
// a tooth, curled like a comma, with two great bat-ears of lilac skin
// spread over its head and long feelers that taste the water. It has no eyes
// at all; where they should be the shell is smooth. It sees by clicking: a
// pore under its chin glows and sends out rings. Its battle clips
// (ECHO_SHRIMP_ANIM): the ears turn and the feelers sway; before an attack
// the ears fan out wide and the pore flares with rings; hit, it flinches,
// ears flat; beaten, it curls up tight and goes to flakes; spared, the ears
// droop and it hums, a single little ring in the air.
// Drawn from a pose (see src/data/art/ch5Kit.js).
export const ECHO_SHRIMP_PALETTE = {
  k: '#18203a',
  b: '#dce8f0',
  B: '#a4bcd0',
  d: '#6e88a8',
  p: '#f4e2ea',
  P: '#d4a8be',
  m: '#c2aae0',
  M: '#8a70b8',
  v: '#5a4890',
  c: '#8ff6ff',
  C: '#3cc4dc',
  w: '#ffffff',
  g: '#fff2b0',
};

// Poses: sway (feeler phase), ears (0 folded .. 1 fanned wide, <0 flat), click (0..1 the pore's
// flare, rings round it), curl (0..1 tighter), droop (spared), dead.
function draw(pose = {}) {
  const { sway = 0, ears = 0.3, click = 0, curl = 0, droop = 0, smile = false } = pose;
  const p = new Pix(44, 36);
  const head = [12, 22 + curl * 1.5];
  const bend = [24 - curl * 4, 2 + curl * 8];
  const tail = [34 - curl * 6, 25 - curl * 2];
  const at = (t) => {
    const a = (1 - t) * (1 - t);
    const b = 2 * (1 - t) * t;
    const c = t * t;
    return [a * head[0] + b * bend[0] + c * tail[0], a * head[1] + b * bend[1] + c * tail[1]];
  };
  const radius = (t) => 6.4 - 3.4 * Math.pow(t, 1.2);

  // Feelers, behind everything: two long wavy whips from the snout.
  for (const [dir, len] of [[-1, 24], [1, 19]]) {
    let x = 7;
    let y = 21 + dir * 0.5;
    for (let i = 0; i < len; i++) {
      const w = Math.sin(sway + i * 0.42 + dir) * (0.4 + i * 0.05);
      x -= 0.9;
      y += dir * 0.5 + w * 0.5 + (dir > 0 ? 0.08 * i : 0);
      p.set(x, y, i < len * 0.55 ? 'B' : 'd');
    }
  }

  // Swimmerets: small legs under the belly, fanning and wagging.
  for (const t of [0.08, 0.2, 0.32, 0.44, 0.56, 0.68]) {
    const [x, y] = at(t);
    const r = radius(t);
    const wob = Math.sin(sway * 1.5 + t * 9) * 1;
    p.line(x - 1, y + r - 1, x - 2.5 + wob, y + r + 3.5, 'd');
    p.line(x + 1, y + r - 1, x + 1 + wob, y + r + 3, 'd');
  }

  // The tail fan: three flat blades round the end, pink at the root.
  const [tx0, ty0] = at(1);
  for (const [dx, dy, rx, ry] of [[-3, 4, 1.8, 3.2], [0, 5, 1.8, 3.4], [3, 3.5, 1.8, 3]]) {
    p.ellipse(tx0 + dx, ty0 + dy, rx, ry, 'B');
    p.ellipse(tx0 + dx, ty0 + dy - 0.5, rx - 0.7, ry - 1, 'p');
  }

  // The body: overlapping plates, tail first so the head end lies on top. Each plate has a
  // darker edge, a lit back and a pink belly.
  const N = 9;
  for (let i = N; i >= 1; i--) {
    const t = i / N;
    const [x, y] = at(t);
    const r = radius(t);
    p.ellipse(x, y, r + 0.7, r * 1.1 + 0.4, 'B');
    p.ellipse(x - 0.6, y - 0.6, r, r * 1.05, 'b');
    p.ellipse(x - 0.4, y + r * 0.5, r * 0.75, r * 0.4, 'p');
    p.set(x - 1, y - r + 1, 'w');
    p.set(x, y - r + 0.6, 'w');
  }

  // The head: a big smooth shield with no eyes, only two faint dimples, a pointed rostrum.
  p.ellipse(head[0], head[1], 7.4, 6.4, 'B');
  p.ellipse(head[0] - 0.4, head[1] - 0.4, 6.8, 5.8, 'b');
  p.ellipse(head[0] - 0.4, head[1] + 3, 5.8, 2.8, 'p');
  p.ellipse(head[0] - 1.5, head[1] - 3, 3.6, 1.6, 'w');
  p.poly([[head[0] - 6, head[1] - 3], [head[0] - 12, head[1] - 0.5], [head[0] - 6, head[1] + 1]], 'b');
  p.line(head[0] - 6, head[1] - 1, head[0] - 11, head[1] - 0.5, 'B');
  p.set(head[0] - 2, head[1] - 0.5, 'd');
  p.set(head[0] + 2, head[1] - 0.5, 'd');
  // The click pore under the chin.
  const px = head[0] - 5;
  const py = head[1] + 3.5;
  p.ellipse(px, py, 1.3 + click * 0.8, 1.1 + click * 0.6, click > 0.3 ? 'c' : 'd');
  if (click > 0.3) p.set(px, py, 'w');
  if (smile) p.line(head[0] - 5, head[1] + 1, head[0] - 2, head[1] + 2, 'd');

  // The ears: two big bat-ears of lilac skin, apart, leaning outward and turning.
  const open = ears - droop * 1.3;
  for (const side of [0, 1]) {
    const bx = head[0] - 3 + side * 7;
    const by = head[1] - 4;
    const lean = (side ? 0.35 : -0.55) * (0.6 + open * 0.8) + (side ? 0.1 : -0.1);
    const height = (14 + open * 3) * (droop ? 0.55 : 1);
    const tx = bx + Math.sin(lean) * height + (droop ? (side ? 3 : -3) : 0);
    const ty = by - Math.cos(lean) * height + droop * 4;
    const nx = Math.cos(lean);
    const ny = Math.sin(lean);
    const wid = 4.6 + open * 1.2;
    const mid = [bx + (tx - bx) * 0.5 + nx * -wid * (side ? -0.4 : 0.9) * 0.0, by + (ty - by) * 0.5];
    // Outer edge bulges (the bat's ear is wide in the middle).
    p.poly([[bx - nx * 3, by - ny * 3], [mid[0] - nx * wid, mid[1] - ny * wid], [tx, ty], [mid[0] + nx * wid, mid[1] + ny * wid], [bx + nx * 3, by + ny * 3]], 'm');
    p.line(bx - nx * 3, by - ny * 3, mid[0] - nx * wid, mid[1] - ny * wid, 'v');
    p.line(mid[0] - nx * wid, mid[1] - ny * wid, tx, ty, 'v');
    p.line(bx + nx * 3, by + ny * 3, mid[0] + nx * wid, mid[1] + ny * wid, 'v');
    p.line(mid[0] + nx * wid, mid[1] + ny * wid, tx, ty, 'v');
    // Veins fanning from the root.
    for (const k of [-0.6, 0, 0.6]) p.line(bx, by, mid[0] + nx * wid * k * 0.8, mid[1] + ny * wid * k * 0.8, 'M');
    p.line(mid[0], mid[1], tx, ty, 'M');
    // The pale inner ear.
    p.ellipse(bx + (tx - bx) * 0.3, by + (ty - by) * 0.3, 1.6, 2.6, 'P');
  }

  // The clicks: rings of light round the pore.
  if (click > 0) {
    for (let i = 0; i < 3; i++) {
      const rr = 4 + i * 3.4 + click * 3;
      p.ring(px - 1, py + 1, rr, rr * 0.85, i === 0 ? 'c' : 'C', 1);
    }
  }

  return p.outline('k').rows();
}

const IDLE = [
  draw({ sway: 0, ears: 0.3 }),
  draw({ sway: 0.8, ears: 0.45 }),
  draw({ sway: 1.6, ears: 0.6, click: 0.4 }),
  draw({ sway: 2.4, ears: 0.45 }),
  draw({ sway: 3.2, ears: 0.3 }),
  draw({ sway: 4, ears: 0.15 }),
];

export const ECHO_SHRIMP_SPRITE = IDLE[0];

export const ECHO_SHRIMP_ANIM = {
  chips: ['#dce8f0', '#c2aae0', '#a4bcd0', '#8ff6ff'],
  idle: { fps: 4, frames: IDLE },
  windup: {
    fps: 6,
    frames: [
      draw({ sway: 0.5, ears: 0.8, click: 0.5 }),
      draw({ sway: 1.2, ears: 1, click: 1 }),
      draw({ sway: 2, ears: 1.1, click: 0.7, curl: 0.15 }),
    ],
  },
  hurt: {
    fps: 10,
    frames: [
      flash(shift(draw({ ears: -0.4, curl: 0.3 }), 2, 0)),
      shift(draw({ ears: -0.3, curl: 0.25, sway: 1 }), 2, 1),
      shift(draw({ ears: 0, curl: 0.1, sway: 2 }), 1, 0),
    ],
  },
  death: {
    fps: 5,
    frames: [
      draw({ ears: -0.3, curl: 0.4, sway: 1 }),
      draw({ ears: -0.6, curl: 0.8, sway: 2 }),
      crumble(draw({ ears: -0.8, curl: 1, sway: 2.5 }), 0.3, false),
      crumble(draw({ ears: -0.8, curl: 1, sway: 2.5 }), 0.65, false),
      crumble(draw({ ears: -0.8, curl: 1, sway: 2.5 }), 1, false),
    ],
  },
  spared: {
    fps: 3,
    frames: [
      draw({ droop: 0.5, smile: true, sway: 0, click: 0.5 }),
      draw({ droop: 0.6, smile: true, sway: 1.5 }),
      draw({ droop: 0.5, smile: true, sway: 3, click: 0.5 }),
      draw({ droop: 0.6, smile: true, sway: 4.5 }),
    ],
  },
};
