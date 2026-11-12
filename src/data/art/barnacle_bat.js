import { Pix, dissolve, recolour, clip, flipV } from './pixKit.js';

// The BARNACLE BAT, 40x34: a little cave bat that has roosted over the same
// wet ledge for so long that the sea has started to keep it. Barnacles crust
// its folded wings like rivets, a frond of weed hangs off one ear, and its
// eyes catch the dark like two drops of pale green sea-glass. Idle, it hangs
// upside down from a knob of wet rock (the knob is in the picture, so it
// always has something to hang from), wrapped in its wings, swaying, blinking;
// before an attack it lets go and flaps; hit, it flinches with its eyes
// crossed; beaten, it flutters down and comes apart; spared, it goes back up
// and wraps itself up, eyes shut. Out in a room it flies about, wings out.
// Drawn in code (see pixKit.js).
export const BARNACLE_BAT_PALETTE = {
  k: '#14161a',
  f: '#4a4048',
  F: '#6a5e66',
  m: '#3a3440',
  M: '#5a5062',
  b: '#c8c4b4',
  B: '#8a867a',
  h: '#26262a',
  e: '#d8ffe8',
  E: '#7ae0b0',
  w: '#f4f0e8',
  p: '#a87282',
  r: '#5e564a',
  R: '#847a6a',
  g: '#3e6842',
  G: '#6a9a5a',
  s: '#a8d8e0',
  S: '#e8fcff',
};

const W = 40;
const H = 34;

// A barnacle: a little grey cone with a dark mouth, lit on its top edge.
function barnacle(g, x, y, big = false) {
  if (big) {
    g.disc(x, y, 1.6, 1.4, 'B');
    g.set(x - 1, y - 1, 'b');
    g.set(x, y - 1, 'b');
    g.set(x + 1, y - 1, 'b');
    g.set(x, y, 'h');
  } else {
    g.set(x, y, 'b');
    g.set(x + 1, y, 'B');
    g.set(x, y + 1, 'B');
    g.set(x + 1, y + 1, 'h');
  }
}

// The head: ears, a pug face, sea-glass eyes, and fangs.
function head(g, cx, cy, eye, mouth) {
  // Ears: tall, pointed, pink inside, weed caught on the left one.
  g.line(cx - 3, cy - 2, cx - 6, cy - 9, 'f', 3);
  g.line(cx + 3, cy - 2, cx + 6, cy - 9, 'f', 3);
  g.line(cx - 4, cy - 3, cx - 6, cy - 7, 'p');
  g.line(cx + 4, cy - 3, cx + 6, cy - 7, 'p');
  g.line(cx - 6, cy - 8, cx - 8, cy - 5, 'g');
  g.set(cx - 8, cy - 4, 'G');
  g.disc(cx, cy, 5.2, 4.4, 'f');
  g.disc(cx, cy + 1, 3.6, 2.6, 'F', 'f');
  // A squashed little snout.
  g.set(cx - 1, cy + 1, 'k');
  g.set(cx + 1, cy + 1, 'k');
  // Eyes.
  const lx = cx - 2.5;
  const rx = cx + 2.5;
  const ey = cy - 1;
  if (eye === 'glow' || eye === 'wide') {
    const r = eye === 'wide' ? 1.6 : 1.3;
    for (const x of [lx, rx]) {
      g.disc(x, ey, r, r, 'e');
      g.set(x, ey, 'E');
      if (eye === 'wide') g.set(x, ey - 1, 'E');
    }
  } else if (eye === 'x') {
    for (const x of [lx, rx]) { g.set(x - 1, ey - 1, 'k'); g.set(x + 1, ey + 1, 'k'); g.set(x + 1, ey - 1, 'k'); g.set(x - 1, ey + 1, 'k'); g.set(x, ey, 'k'); }
  } else if (eye === 'glad') {
    for (const x of [lx, rx]) { g.set(x - 1, ey, 'e'); g.set(x, ey - 1, 'e'); g.set(x + 1, ey, 'e'); }
  } else {
    for (const x of [lx, rx]) g.line(x - 1, ey, x + 1, ey, 'k');
  }
  // Mouth, with two little fangs.
  if (mouth) {
    g.rect(cx - 2, cy + 2, 5, 2, 'h');
    g.set(cx - 2, cy + 2, 'w');
    g.set(cx + 2, cy + 2, 'w');
  } else {
    g.line(cx - 1, cy + 3, cx + 1, cy + 3, 'k');
    g.set(cx - 2, cy + 3, 'w');
    g.set(cx + 2, cy + 3, 'w');
  }
}

// One wing, out from the shoulder to its tip (side -1 left, 1 right), scalloped
// between the finger bones, barnacles on the arm.
function wing(g, cx, sy, side, yt) {
  const sx = cx + side * 4;
  const tx = cx + side * 18;
  const n = 36;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const lx = sx + (tx - sx) * t;
    const ly = sy + (yt - sy) * t - Math.sin(t * Math.PI) * 3;
    const trail = sy + 8 + (yt + 2 - sy - 8) * t + Math.abs(Math.sin(t * Math.PI * 3)) * -3 + 3;
    g.line(lx, ly, lx, Math.max(ly, trail), t > 0.85 ? 'M' : 'm', 1);
  }
  // The arm and the finger bones.
  const wx = sx + (tx - sx) * 0.45;
  const wy = sy + (yt - sy) * 0.45 - 3;
  g.line(sx, sy, wx, wy, 'F', 2);
  g.line(wx, wy, tx, yt, 'M');
  for (const t of [0.66, 0.33]) {
    const fx = sx + (tx - sx) * t;
    const fy = sy + 8 + (yt + 2 - sy - 8) * t + 3;
    g.line(wx, wy, fx, fy, 'M');
  }
  // A thumb claw at the wrist.
  g.set(wx, wy - 1, 'w');
  // Barnacles along the arm and on the web.
  barnacle(g, sx + side * 2, sy + 1, true);
  barnacle(g, wx - side * 2, wy + 2);
  barnacle(g, sx + (tx - sx) * 0.3, sy + 6);
  barnacle(g, sx + (tx - sx) * 0.62, sy + (yt - sy) * 0.62 + 2);
}

// pose: mode ('fly' | 'roost'), wing (flap: 0 up, 1 level, 2 down), eye ('glow' |
// 'wide' | 'x' | 'glad' | 'shut'), mouth (0 shut, 1 open), dy, sway (roost: px), drip (roost: 0-3).
function drawBat(pose) {
  const { mode = 'fly', wing: flap = 1, eye = 'glow', mouth = 0, dy = 0, sway = 0, drip = -1 } = pose;
  const g = new Pix(W, H);
  if (mode === 'fly') {
    const cx = 20;
    const cy = 13 + dy;
    const yt = [cy - 9, cy + 1, cy + 10][flap];
    wing(g, cx, cy + 4, -1, yt);
    wing(g, cx, cy + 4, 1, yt);
    // The body: furry, with a pale chest, and little hooked feet tucked up.
    g.disc(cx, cy + 8, 4.6, 5.6, 'f');
    g.disc(cx, cy + 8, 2.6, 3.8, 'F', 'f');
    g.line(cx - 2, cy + 13, cx - 3, cy + 15, 'k');
    g.line(cx + 2, cy + 13, cx + 3, cy + 15, 'k');
    barnacle(g, cx + 2, cy + 6);
    head(g, cx, cy, eye, mouth);
    g.outline('k');
    return g.rows();
  }
  // Roosting: drawn the right way up (feet down, gripping a knob of rock) and
  // then turned over, so it hangs from the knob with its head at the bottom.
  const cx = 20 + sway;
  // The knob of wet rock it hangs from (at the bottom now, the top once turned).
  g.disc(20, H - 2, 9, 3, 'r');
  g.line(13, H - 3, 27, H - 3, 'R');
  g.line(15, H - 4, 24, H - 4, 'R');
  // Feet gripping it.
  g.line(cx - 2, H - 7, cx - 2, H - 4, 'k');
  g.line(cx + 2, H - 7, cx + 2, H - 4, 'k');
  // The wrapped wings: a cloak of membrane, folds down it, barnacles all over.
  g.disc(cx, 19, 7.4, 9, 'm');
  g.disc(cx - 2, 18, 3, 7, 'M', 'm');
  g.line(cx + 2, 12, cx + 3, 26, 'k');
  g.line(cx - 4, 13, cx - 5, 25, 'k');
  for (const [bx, by, big] of [[cx - 4, 16, true], [cx + 4, 14, false], [cx + 1, 21, true], [cx - 2, 25, false], [cx + 5, 22, false], [cx - 6, 20, false]]) barnacle(g, bx, by, big);
  // The head, out of the top of the wrap (so, once turned over, hanging upside
  // down below it, ears pointing at the floor), and the wrist claws either side.
  head(g, cx, 9, eye, mouth);
  g.set(cx - 6, 11, 'w');
  g.set(cx + 6, 11, 'w');
  g.outline('k');
  const rows = flipV(g.rows());
  // A drop of sea water falling off the knob.
  if (drip >= 0) {
    const out = rows.map((row) => [...row]);
    const dx = 26;
    const y = 4 + drip * 3;
    if (out[y]) out[y][dx] = 's';
    if (out[y + 1]) out[y + 1][dx] = 'S';
    return out.map((row) => row.join(''));
  }
  return rows;
}

const FLASH = { f: 'S', F: 'S', m: 's', M: 'S', b: 'S', B: 's' };

// Out in a room (and on the journal page) it is flying, wings out.
export const BARNACLE_BAT_SPRITE = drawBat({ mode: 'fly', wing: 0 });

export const BARNACLE_BAT_ANIM = {
  chips: ['#c8c4b4', '#5a5062', '#7ae0b0'],
  idle: clip(4, [0, 1, 2, 3, 4, 5], (i) => drawBat({ mode: 'roost', sway: [0, 1, 1, 0, -1, -1][i], eye: i === 4 ? 'shut' : 'glow', drip: i < 4 ? i : -1 })),
  windup: clip(10, [0, 1, 2, 3, 4], (i) => drawBat({ mode: 'fly', wing: [0, 1, 2, 1, 0][i], eye: 'wide', mouth: i > 1 ? 1 : 0, dy: [0, 1, 2, 1, 0][i] })),
  hurt: clip(12, [0, 1, 2, 3], (i) => {
    const rows = drawBat({ mode: 'fly', wing: 2, eye: 'x', mouth: 1, dy: i === 1 ? 2 : 1 });
    return i === 0 ? recolour(rows, FLASH) : rows;
  }),
  death: clip(5, [0, 1, 2, 3, 4, 5], (i) => dissolve(drawBat({ mode: 'fly', wing: i % 2 ? 2 : 1, eye: 'x', mouth: 1, dy: Math.min(8, i * 2) }), i >= 2 ? (i - 1) * 0.22 : 0, 23)),
  spared: clip(3, [0, 1, 2, 3], (i) => drawBat({ mode: 'roost', sway: [0, 1, 0, -1][i], eye: i === 3 ? 'glad' : 'shut' })),
};
