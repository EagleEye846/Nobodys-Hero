import { Pix, dissolve, recolour, clip } from './pixKit.js';

// The BLIND GROTTO CRAB, 64x40, facing left: a huge crab the white of a peeled
// egg, from a cave so deep it never needed eyes. Where the eyes go there are
// two smooth dimples and nothing else. Instead it is all feelers: a fan of long
// pale threads off the front of its shell, each with a bead at the tip, always
// waving, always reading the air. Two big flat claws, eight stilt legs, a
// little crust of cave-pearl at its mouth. Cold blue in the shadows, like
// everything else the Soundings has soaked in. Idle, the feelers wave; before
// an attack they all go stiff and point; hit, it flinches with its feelers
// laid flat; beaten, it folds up small and fades; spared, the feelers curl
// round you in a gentle, searching hug.
// Drawn in code (see pixKit.js): every frame is the same drawing with a pose.
export const BLIND_CRAB_PALETTE = {
  k: '#141a26',
  w: '#f2f6f6',
  W: '#d3e0e4',
  s: '#a3bac6',
  S: '#728fa4',
  d: '#4a6378',
  f: '#e6f2f2',
  p: '#fbe7f0',
  P: '#e2b4cc',
  r: '#9c4a5c',
  g: '#8ad8d0',
  c: '#bfeaf0',
  t: '#ffffff',
};

const W = 64;
const H = 40;

// pose: ph (feeler wave), wave (how much they wave), reach (how far out, 1 = usual), stiff (they go straight),
// claw (0 low, 1 raised), mouth (0 shut, 1 open), dy (body lift), squash (shrinks it), flat (feelers laid back), curl.
function drawCrab(pose) {
  const { ph = 0, wave = 1, reach = 1, stiff = 0, claw = 0, mouth = 0, dy = 0, squash = 0, flat = 0, curl = 0, glint = false } = pose;
  const g = new Pix(W, H);
  const cx = 34;
  const cy = 22 + dy + squash * 4;
  const rx = 18 - squash * 3;
  const ry = 10 - squash * 3;

  // Legs first, behind the body: four a side, a stilt and a kink.
  for (let i = 0; i < 4; i++) {
    const bx = cx - 12 + i * 8;
    const out = (i < 2 ? -1 : 1) * (4 + (i % 2) * 3);
    const kneeX = bx + out * 1.6;
    const kneeY = cy + ry - 1 + 2 + squash * 2;
    const footX = bx + out * 2.4 + (i < 2 ? -2 : 2);
    const footY = 37;
    g.line(bx, cy + ry - 3, kneeX, kneeY, 's', 2);
    g.line(kneeX, kneeY, footX, footY, 'S', 1);
    g.set(footX, footY, 'k');
  }

  // The shell: a wide pale dome, a rim of spikes at the back.
  for (let i = 0; i < 7; i++) {
    const a = Math.PI * (0.05 + i * 0.12);
    g.line(cx + 6 + Math.cos(a) * rx * 0.9, cy - Math.sin(a) * ry * 0.9, cx + 8 + Math.cos(a) * (rx + 2), cy - Math.sin(a) * (ry + 2), 'W', 1);
  }
  g.disc(cx, cy, rx, ry, 'w');
  g.disc(cx, cy + ry * 0.45, rx * 0.85, ry * 0.5, 'W', 'w');
  g.disc(cx + 1, cy + ry * 0.75, rx * 0.7, ry * 0.25, 's', 'W');
  // Ridges and cold shadow on the shell, a few cave-pearl bumps.
  g.line(cx - 4, cy - ry + 2, cx + 14, cy - ry + 4, 'W', 1);
  g.line(cx - 2, cy - 2, cx + 14, cy - 1, 'W', 1);
  for (const [bx, by] of [[cx + 6, cy - 5], [cx + 12, cy + 1], [cx - 2, cy - 6], [cx + 16, cy - 4]]) {
    g.disc(bx, by, 1.4, 1.1, 'p');
    g.set(bx - 0.5, by - 0.5, 't');
  }
  g.disc(cx + 4, cy + 2, 2, 1.4, 's', 'w');

  // The face: no eyes. Two smooth dimples where they would be, a seam, mouthparts.
  const fx = cx - rx + 4;
  const fy = cy - 1;
  g.disc(fx + 1, fy - 3, 1.5, 1.2, 'W', 'wW');
  g.disc(fx + 6, fy - 4, 1.5, 1.2, 'W', 'wW');
  g.set(fx + 1, fy - 3, 's');
  g.set(fx + 6, fy - 4, 's');
  if (mouth > 0) {
    g.disc(fx + 2, fy + 5, 4, 2.4 + mouth, 'k');
    g.disc(fx + 2, fy + 5, 3, 1.6 + mouth, 'r');
    g.set(fx, fy + 4, 't');
    g.set(fx + 4, fy + 4, 't');
  } else {
    g.line(fx - 1, fy + 4, fx + 6, fy + 5, 's', 1);
    g.disc(fx + 2, fy + 6, 2, 1, 'P');
    g.set(fx + 2, fy + 5, 'p');
  }

  // Claws: two flat paddles on jointed arms, held forward.
  const lift = claw * 9;
  g.line(cx - rx + 6, cy + 3, cx - rx - 4, cy + 7 - lift, 's', 3);
  g.line(cx - rx - 4, cy + 7 - lift, cx - rx - 10, cy + 4 - lift, 'w', 3);
  g.disc(cx - rx - 13, cy + 3 - lift, 5, 3.4, 'w');
  g.disc(cx - rx - 12, cy + 4.2 - lift, 4, 1.6, 'W', 'w');
  g.line(cx - rx - 18, cy + 3 - lift, cx - rx - 12, cy + 3 - lift, 'k', 1);
  g.set(cx - rx - 17, cy + 2 - lift, 'k');
  g.line(cx - rx + 8, cy + 6, cx - rx + 1, cy + 11 - lift * 0.6, 's', 2);
  g.disc(cx - rx - 4, cy + 11 - lift * 0.6, 4, 2.6, 'W');
  g.disc(cx - rx - 5, cy + 12 - lift * 0.6, 3, 1.1, 's', 'W');

  // The feelers: a fan of thin threads off the front, each with a bead.
  const baseX = fx + 2;
  const baseY = fy - 6;
  for (let i = 0; i < 7; i++) {
    const spread = -0.55 + i * 0.27;
    const a = Math.PI + (stiff ? -0.2 + i * 0.11 : spread) + (flat ? 0.9 : 0) * (i % 2 ? 0.4 : -0.1);
    const len = (13 + (i % 3) * 5 + (i === 3 ? 4 : 0)) * reach * (flat ? 0.6 : 1);
    let px = baseX + (i % 3);
    let py = baseY + (i % 2) * 2;
    let lastX = px;
    let lastY = py;
    const steps = 9;
    for (let j = 1; j <= steps; j++) {
      const u = j / steps;
      const sway = stiff ? 0 : Math.sin(ph + j * 0.8 + i * 1.3) * wave * u * 3.2;
      const bend = curl ? curl * u * u * 6 : 0;
      const nx = baseX + (i % 3) + Math.cos(a) * len * u - Math.sin(a) * sway;
      const ny = baseY + (i % 2) * 2 + Math.sin(a) * len * u + Math.cos(a) * sway + bend - (flat ? 0 : u * u * 2);
      g.line(lastX, lastY, nx, ny, j < 3 ? 'f' : 'W', 1);
      lastX = nx;
      lastY = ny;
      px = nx;
      py = ny;
    }
    g.set(px, py, 'p');
    g.set(px + 1, py, 'P');
    if (glint && i % 2 === 0) g.set(px - 1, py - 1, 'c');
  }
  g.outline('k');
  // The outline leaves the thin feelers dark; lighten the pixels the rim sits on beside their beads.
  return g.rows();
}

const FLASH = { w: 't', W: 't', s: 'f', f: 't', S: 'W', p: 't', P: 't' };

export const BLIND_CRAB_SPRITE = drawCrab({ ph: 0.5 });

// The pillar-white lump it passes for out in a room: a big pale shell on the cave floor, 26x18, with the
// odd twitch of a feeler under the lip. Frame 0 is how it sits; the other two give it away.
function drawShell(twitch) {
  const g = new Pix(26, 18);
  g.disc(13, 11, 12, 6.5, 'w');
  g.disc(13, 13, 11, 3.5, 'W', 'w');
  g.disc(14, 16, 11, 1.5, 's', 'W');
  // A spiral on the crown, like a shell, in cold grey.
  g.line(8, 7, 17, 6, 'W', 1);
  g.line(7, 9, 19, 9, 'W', 1);
  g.line(9, 11, 18, 11, 's', 1);
  g.disc(18, 6, 1.2, 1, 'p');
  g.disc(10, 8, 1.1, 0.9, 'p');
  // A skirt of barnacle-white crust.
  for (let x = 2; x < 24; x += 3) g.set(x, 16 + (x % 2), 'W');
  if (twitch === 1) {
    g.line(3, 14, 0, 11, 'f', 1);
    g.set(0, 11, 'p');
    g.line(5, 15, 1, 15, 'f', 1);
    g.set(1, 15, 'p');
  } else if (twitch === 2) {
    g.line(4, 15, 0, 13, 'f', 1);
    g.set(0, 13, 'p');
    g.line(23, 14, 25, 12, 'f', 1);
  }
  g.outline('k');
  return g.rows();
}
export const BLIND_CRAB_DISGUISE = [drawShell(0), drawShell(1), drawShell(2)];

export const BLIND_CRAB_ANIM = {
  chips: ['#f2f6f6', '#a3bac6', '#fbe7f0'],
  // The feelers wave and read the air; every so often it breathes.
  idle: clip(6, [0, 1, 2, 3, 4, 5], (i) => drawCrab({ ph: i * 1.05, wave: 1, mouth: i === 3 ? 1 : 0, dy: i % 3 === 0 ? -1 : 0 })),
  // All the feelers go stiff and point at you, and the claws come up.
  windup: clip(8, [0, 1, 2, 3, 4, 5], (i) => drawCrab({ ph: i * 0.6, wave: Math.max(0.1, 1 - i * 0.25), stiff: i > 1 ? 1 : 0, reach: 1 + i * 0.06, claw: Math.min(1, i * 0.25), mouth: i > 3 ? 1 : 0, glint: i > 3 })),
  hurt: clip(12, [0, 1, 2, 3], (i) => {
    const rows = drawCrab({ ph: 2, wave: 0.3, flat: 1, squash: i < 2 ? 0.6 : 0.3, mouth: 1, claw: 0, dy: 1 });
    return i === 0 ? recolour(rows, FLASH) : rows;
  }),
  death: clip(4, [0, 1, 2, 3, 4, 5], (i) => dissolve(drawCrab({ ph: 1, wave: 0.2, flat: 1, squash: Math.min(1, 0.3 + i * 0.2), mouth: 1, dy: i }), i >= 3 ? (i - 2) * 0.18 : 0, 5)),
  spared: clip(5, [0, 1, 2, 3], (i) => drawCrab({ ph: i * 1.3, wave: 1.3, curl: 1, claw: 0.2, mouth: 0, dy: i % 2 ? -1 : 0 })),
};
