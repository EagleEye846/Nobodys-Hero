import { Pix, flash, shift, crumble } from './ch5Kit.js';

// The BELLBUOY, 36x44: a haunted bell buoy. A red-and-white float with weed
// and barnacles round the waterline, a rusty lattice tower, and in the cage
// at the top a green bronze bell that rings by itself, with two pale lights
// for eyes in its mouth. Nobody has ever seen who rings it. Its battle clips
// (BELLBUOY_ANIM, see `anim` in src/battle/battleScene.js): it rocks on the
// swell and the bell swings; before an attack the bell swings wide and the
// eyes flare; hit, it lurches and flashes; beaten, it tips over and slides
// under, the bell going last; spared, the bell rings one soft, clear note and
// the lamp on top comes on. Drawn from a pose (see src/data/art/ch5Kit.js).
export const BELLBUOY_PALETTE = {
  k: '#1a1c22',
  r: '#c8402e',
  R: '#8a2a22',
  w: '#e8e4d8',
  W: '#b4b0a4',
  i: '#7a5a46',
  I: '#4e382c',
  v: '#4fa882',
  V: '#2e6a58',
  o: '#7ac8a0',
  y: '#e8ffb0',
  Y: '#a8d860',
  g: '#4a7a3a',
  G: '#2e5a2a',
  b: '#d8d0b8',
  l: '#ffe48a',
  L: '#c89a40',
  n: '#6a6e76',
  N: '#40444c',
};

// Poses: rock (px the top leans), swing (bell angle in radians), eyes
// ('glow' | 'flare' | 'dim' | 'dead' | 'happy'), lamp (lit), sink (px the
// whole thing has gone under), tilt (degrees the buoy has tipped, drawn as
// a shear), ring (a little ring-lines flare each side of the bell).
function draw(pose = {}) {
  const { rock = 0, swing = 0, eyes = 'glow', lamp = false, sink = 0, tilt = 0, ring = 0 } = pose;
  const p = new Pix(38, 46);
  const cx = 19;
  const wl = 36 + sink;
  const top = (y) => cx + rock * ((wl - y) / 30) + tilt * ((wl - y) / 30);
  const S = 1.45;

  // The float: a squat red barrel with a white band.
  p.ellipse(cx, wl, 13, 5.6, 'k');
  p.ellipse(cx, wl, 12, 4.8, 'r');
  p.rect(cx - 12, wl - 1, 25, 2, 'w', ['r']);
  p.ellipse(cx + 3, wl + 2, 9, 2, 'R', ['r']);
  p.ellipse(cx - 5, wl - 2.4, 4, 1, 'w', ['r']);
  // The mast and lattice (four struts and cross braces).
  for (const [a, b] of [[-9, -5], [9, 5]]) {
    p.line(cx + a, wl - 2, top(20) + b, 20, 'k', 3);
    p.line(cx + a, wl - 2, top(20) + b, 20, 'i', 1);
  }
  for (const y of [31, 25]) {
    const half = 5 + ((y - 20) / 16) * 4;
    p.line(top(y) - half, y, top(y) + half, y, 'I');
  }
  p.line(top(31) - 8, 31, top(25) + 6, 25, 'I');
  p.line(top(31) + 8, 31, top(25) - 6, 25, 'I');
  // The platform and the bell cage.
  p.rect(top(20) - 9, 19, 19, 2, 'k');
  p.rect(top(20) - 8, 19, 17, 1, 'n');
  p.line(top(20) - 8, 19, top(8) - 2, 3, 'n', 1);
  p.line(top(20) + 8, 19, top(8) + 2, 3, 'n', 1);
  p.line(top(8) - 3, 3, top(8) + 3, 3, 'n');
  // The lamp on top.
  p.ellipse(top(2), 2, 2.2, 2, 'k');
  p.ellipse(top(2), 2, 1.5, 1.3, lamp ? 'l' : 'N');
  if (lamp) { p.set(top(2) - 4, 2, 'l'); p.set(top(2) + 4, 2, 'l'); p.set(top(2), -1, 'l'); }
  // The bell, swinging from its pivot.
  const px = top(14) + 0;
  const py = 4;
  const rot = (x, y) => [px + S * (x * Math.cos(swing) - y * Math.sin(swing)), py + S * (x * Math.sin(swing) + y * Math.cos(swing))];
  const pts = [[-2.5, 0], [2.5, 0], [4.5, 5], [7.5, 9], [-7.5, 9], [-4.5, 5]].map(([x, y]) => rot(x, y));
  const outer = [[-3.5, -1], [3.5, -1], [5.5, 5], [8.8, 10.3], [-8.8, 10.3], [-5.5, 5]].map(([x, y]) => rot(x, y));
  p.poly(outer, 'k');
  p.poly(pts, 'v');
  p.poly([rot(1, 0), rot(2.5, 0), rot(4.5, 5), rot(7.5, 9), rot(3, 9)].map((a) => a), 'V', ['v']);
  const [hx, hy] = rot(-3.5, 3);
  p.line(hx, hy, rot(-5.5, 7)[0], rot(-5.5, 7)[1], 'o');
  // The mouth, the eyes, the clapper.
  const [mx, my] = rot(0, 8.4);
  p.ellipse(mx, my, 6, 1.7, 'k');
  for (const ex of [-3, 3]) {
    const [exx, eyy] = rot(ex, 8.3);
    if (eyes === 'dead') { p.set(exx - 1, eyy - 1, 'W'); p.set(exx + 1, eyy, 'W'); }
    else if (eyes === 'happy') { p.set(exx - 1, eyy, 'y'); p.set(exx, eyy - 1, 'y'); p.set(exx + 1, eyy, 'y'); }
    else if (eyes === 'dim') p.set(exx, eyy, 'Y');
    else {
      p.set(exx, eyy, 'y');
      p.set(exx + 1, eyy, 'y');
      if (eyes === 'flare') { p.set(exx, eyy - 1, 'y'); p.set(exx + 1, eyy - 1, 'Y'); p.set(exx - 1, eyy, 'Y'); p.set(exx + 2, eyy, 'Y'); p.set(exx, eyy + 1, 'Y'); }
    }
  }
  const [cx2, cy2] = rot(0, 12.4);
  p.ellipse(cx2, cy2, 1.6, 1.6, 'k');
  p.ellipse(cx2, cy2, 1, 1, 'L');
  // Ring lines.
  if (ring) {
    for (const s of [-1, 1]) {
      p.line(px + s * 13, 8, px + s * 15, 6, 'y');
      p.line(px + s * 14, 12, px + s * 17, 12, 'y');
      p.line(px + s * 13, 16, px + s * 15, 18, 'y');
    }
  }
  // Weed and barnacles around the waterline.
  for (const [wx, ph] of [[7, 0], [12, 1.3], [24, 0.6], [30, 2]]) {
    p.line(wx, wl + 2, wx + Math.sin(ph + wl) * 1.5, wl + 8 + (wx % 3), 'g', 2);
    p.set(wx, wl + 6, 'G');
  }
  for (const [bx, by] of [[10, wl - 1], [27, wl], [20, wl + 3]]) {
    p.ellipse(bx, by, 1.4, 1, 'b');
    p.set(bx, by, 'W');
  }
  // The water covers what's sunk.
  if (sink) p.rect(0, wl + 3, 38, 12, '.');
  return p.outline('k').rows();
}

const IDLE = [
  draw({ rock: -1, swing: -0.18 }),
  draw({ rock: 0, swing: 0 }),
  draw({ rock: 1, swing: 0.18 }),
  draw({ rock: 0, swing: 0, eyes: 'dim' }),
];

export const BELLBUOY_SPRITE = IDLE[0];

export const BELLBUOY_ANIM = {
  chips: ['#4fa882', '#c8402e', '#e8e4d8', '#7a5a46'],
  idle: { fps: 3, frames: IDLE },
  windup: {
    fps: 6,
    frames: [
      draw({ rock: -2, swing: -0.5, eyes: 'flare' }),
      draw({ rock: 0, swing: 0.7, eyes: 'flare', ring: 1 }),
      draw({ rock: 2, swing: -0.7, eyes: 'flare', ring: 1 }),
    ],
  },
  hurt: {
    fps: 10,
    frames: [
      flash(shift(draw({ rock: 3, swing: 0.6, eyes: 'dim' }), 2, 0)),
      shift(draw({ rock: 2, swing: -0.4, eyes: 'dim' }), 2, 0),
      shift(draw({ rock: 1, swing: 0.2 }), 1, 0),
    ],
  },
  death: {
    fps: 3,
    frames: [
      draw({ rock: 4, swing: 0.8, eyes: 'dead', tilt: 2 }),
      draw({ rock: 7, swing: 1.2, eyes: 'dead', tilt: 4, sink: 3 }),
      draw({ rock: 9, swing: 1.3, eyes: 'dead', tilt: 6, sink: 9 }),
      crumble(draw({ rock: 9, swing: 1.3, eyes: 'dead', tilt: 6, sink: 15 }), 0.4),
    ],
  },
  spared: {
    fps: 3,
    frames: [
      draw({ swing: 0, eyes: 'happy', lamp: true }),
      draw({ swing: 0.5, eyes: 'happy', lamp: true, ring: 1 }),
      draw({ swing: -0.3, eyes: 'happy', lamp: true }),
      draw({ swing: 0.3, eyes: 'happy', lamp: true, ring: 1 }),
    ],
  },
};
