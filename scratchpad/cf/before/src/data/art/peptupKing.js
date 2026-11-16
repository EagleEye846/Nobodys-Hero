// KING PEPTUP on the stage, in battle, as the man the Below Folk see (the
// overworld and cutscene king, `kingFigure` and the portrait in
// belowFolk.js): skin, greying hair, small dark eyes, a curled moustache over
// a closed smile, a small jewelled crown, a royal-blue doublet in an ermine
// collar, a purple ermine cape, white gloves, striped hose and pointed shoes,
// and the gold sceptre. Nothing wooden shows: no joints, no strings, no
// control bar. His mouth never moves. He stands very straight, a hair too
// straight (the only hint).
//
// The same canvas as the mannequin (peptupPuppet.js): 88 wide and 82 tall,
// drawn at double size, centred on x 44, his shoes on the boards at row 80, so
// the clips in rumboldBattle.js can swap one for the other. Without the bar
// above him he stands from his crown (row 14) to his feet, a lanky 66 rows.
//
// Built from shapes lit by the one spotlight (from above and a little left),
// each part with its own dark outline so the parts read apart.

const LOCAL_COLORS = {
  k: '#120c1c', // outline
  // Skin, hair
  s: '#f0c49a',
  S: '#cf9470', // skin in shadow
  t: '#fbdcb8', // skin, lit
  a: '#9a8676', // greying hair
  A: '#5e4c42', // hair in shadow, brows, moustache
  o: '#ee7e8c', // rosy cheeks
  q: '#cc2a3c', // lips
  d: '#2c2632', // eyes, belt, shoe leather
  w: '#f4f1ea', // ermine, gloves, the whites of his eyes
  W: '#cfc8bc', // ermine, gloves in shadow
  M: '#2a2630', // ermine tails
  // Royal blue
  b: '#3b5bd6',
  B: '#26398f',
  l: '#6f8cf0',
  // Purple cape
  p: '#6a35a8',
  P: '#42206e',
  r: '#8d58c8',
  // Gold and jewels
  g: '#f0c050',
  G: '#bf8a26',
  h: '#dfae48',
  j: '#ff4a5e',
  J: '#fff0a0', // a glint
};

const REMAP = {};
export const KING_PALETTE = {};
Object.entries(LOCAL_COLORS).forEach(([letter, color], i) => {
  const char = String.fromCharCode(0xe800 + i);
  REMAP[letter] = char;
  KING_PALETTE[char] = color;
});
const remap = (rows) => rows.map((row) => [...row].map((ch) => REMAP[ch] ?? ch).join(''));
// The character a colour letter here turns into (for the art drawn round him).
export const kingChar = (letter) => REMAP[letter];

export const KW = 88;
export const KH = 82;

class Cv {
  constructor(w = KW, h = KH) {
    this.w = w;
    this.h = h;
    this.g = Array.from({ length: h }, () => Array(w).fill('.'));
  }
  get(x, y) { return this.g[y]?.[x]; }
  px(x, y, c) {
    x = Math.round(x);
    y = Math.round(y);
    if (x >= 0 && y >= 0 && x < this.w && y < this.h && c !== undefined) this.g[y][x] = c;
    return this;
  }
  rect(x, y, w, h, c) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.px(x + i, y + j, c);
    return this;
  }
  // A filled ellipse about (cx, cy), shaded from the upper left: `hi` where it
  // faces the light, `lo` where it turns away.
  ell(cx, cy, rx, ry, c, hi = null, lo = null) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) {
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        const n = (x - cx) / rx;
        const m = (y - cy) / ry;
        if (n * n + m * m > 1) continue;
        const v = -0.6 * n - 0.8 * m;
        this.px(x, y, hi && v > 0.5 ? hi : lo && v < -0.4 ? lo : c);
      }
    }
    return this;
  }
  line(x0, y0, x1, y1, c) {
    const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let i = 0; i <= n; i++) this.px(x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n, c);
    return this;
  }
  // A limb from a to b, `w` wide, lit on its upper-left edge and shaded on
  // the lower-right: ramp is [lit, mid, shade].
  limb([ax, ay], [bx, by], w, ramp) {
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy) || 1;
    const r = w / 2;
    for (let y = Math.floor(Math.min(ay, by) - r - 1); y <= Math.ceil(Math.max(ay, by) + r + 1); y++) {
      for (let x = Math.floor(Math.min(ax, bx) - r - 1); x <= Math.ceil(Math.max(ax, bx) + r + 1); x++) {
        const t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / (len * len)));
        const ox = x - (ax + dx * t);
        const oy = y - (ay + dy * t);
        if (ox * ox + oy * oy > r * r) continue;
        // Which side of the limb's axis: the upper-left is the lit one.
        const side = (ox * dy - oy * dx) / len / r;
        const lit = (dy >= 0 ? -1 : 1) * side;
        this.px(x, y, lit < -0.35 ? ramp[0] : lit > 0.35 ? ramp[2] : ramp[1]);
      }
    }
    return this;
  }
  stamp(other, ox = 0, oy = 0) {
    other.g.forEach((row, j) => row.forEach((ch, i) => { if (ch !== '.') this.px(ox + i, oy + j, ch); }));
    return this;
  }
  outline(c = 'k') {
    const keep = this.g.map((row) => [...row]);
    for (let y = 0; y < this.h; y++) {
      for (let x = 0; x < this.w; x++) {
        if (keep[y][x] !== '.') continue;
        if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => (keep[y + dy]?.[x + dx] ?? '.') !== '.')) this.g[y][x] = c;
      }
    }
    return this;
  }
  rows() { return this.g.map((row) => row.join('')); }
}

const part = (draw) => { const c = new Cv(); draw(c); return c.outline(); };

const MID = 44;
const BLUE = ['l', 'b', 'B'];
const SKIN = ['t', 's', 'S'];
const GLOVE = ['w', 'w', 'W'];

// --- The cape ---
// Deep purple behind him, wider towards the hem, ermine down both front
// edges and along the hem, tails every so often.
function cape() {
  return part((c) => {
    for (let y = 42; y <= 76; y++) {
      const half = Math.round(9 + ((y - 42) * 9) / 34);
      const x0 = MID - half;
      const x1 = MID + half - 1;
      for (let x = x0; x <= x1; x++) {
        const k = (x - x0) % 8;
        c.px(x, y, x - x0 < 2 ? 'P' : x1 - x < 2 ? 'P' : k === 3 ? 'r' : k === 6 ? 'P' : 'p');
      }
      // Ermine down the front edges (the cape hangs open).
      for (let k = 0; k < 2; k++) { c.px(x0 + 2 + k, y, 'w'); c.px(x1 - 2 - k, y, k ? 'w' : 'W'); }
      if (y % 6 === 2) { c.px(x0 + 2, y, 'M'); c.px(x0 + 2, y + 1, 'M'); c.px(x1 - 2, y, 'M'); c.px(x1 - 2, y + 1, 'M'); }
    }
    // The hem: ermine in a band with tails.
    for (let x = 0; x < KW; x++) {
      if (c.get(x, 76) === '.') continue;
      c.px(x, 74, 'w'); c.px(x, 75, 'w'); c.px(x, 76, x % 4 === 1 ? 'M' : 'W');
    }
  });
}

// --- Legs and shoes ---
// Long and thin in striped hose (blue and cream), standing very straight.
function legs() {
  return part((c) => {
    [[39, 0], [46, 1]].forEach(([x, side]) => {
      for (let y = 58; y <= 77; y++) {
        const blue = ((y - 58) >> 1) % 2 === 0;
        for (let i = 0; i < 4; i++) {
          const lit = i === 0;
          const dark = i === 3;
          c.px(x + i, y, blue ? (lit ? 'l' : dark ? 'B' : 'b') : (lit ? 'w' : dark ? 'W' : 'w'));
        }
      }
      // A pointed shoe: the toe curls out and up, a brass buckle.
      const dir = side ? 1 : -1;
      const edge = side ? x + 4 : x - 1;
      c.rect(x - 1, 78, 6, 3, 'd');
      for (let i = 1; i <= 6; i++) {
        c.px(edge + dir * i, 80, 'd');
        if (i <= 5) c.px(edge + dir * i, 79, 'd');
        if (i <= 3) c.px(edge + dir * i, 78, 'd');
      }
      c.px(edge + dir * 6, 78, 'd'); c.px(edge + dir * 6, 77, 'd');
      c.px(x + 1 + side, 78, 'h'); c.px(x + 2 + side, 78, 'G');
    });
  });
}

// --- The body ---
function body() {
  return part((c) => {
    // The doublet: narrow shoulders, a long waist, a short flared skirt.
    for (let y = 44; y <= 62; y++) {
      const half = y <= 46 ? 8 : y <= 56 ? 6.5 : y <= 58 ? 7 : 7 + (y - 58) * 0.9;
      const x0 = Math.round(MID - half);
      const x1 = Math.round(MID + half) - 1;
      for (let x = x0; x <= x1; x++) c.px(x, y, x - x0 < 2 ? 'l' : x1 - x < 2 ? 'B' : 'b');
    }
    // A seam and gold buttons down the front.
    c.rect(MID - 1, 46, 1, 10, 'B');
    [47, 50, 53].forEach((y) => { c.px(MID, y, 'g'); c.px(MID + 1, y, 'h'); });
    // The belt, with a gold buckle.
    c.rect(MID - 7, 56, 14, 2, 'd');
    c.rect(MID - 2, 56, 4, 2, 'g'); c.px(MID - 1, 56, 'J'); c.rect(MID - 1, 57, 2, 1, 'G');
    // A gold zigzag along the hem of the skirt, and little gold diamonds
    // embroidered above it.
    for (let x = MID - 11; x <= MID + 10; x++) c.px(x, 62, x % 2 ? 'g' : 'G');
    for (let x = MID - 6; x <= MID + 5; x += 4) { c.px(x, 59, 'h'); c.px(x - 1, 60, 'G'); c.px(x + 1, 60, 'h'); c.px(x, 61, 'G'); }
  });
}

// The ermine collar over his narrow shoulders, with a gold clasp.
function collar() {
  return part((c) => {
    const rows = [[39, 49], [37, 51], [35, 53], [35, 53], [36, 52], [38, 50]];
    rows.forEach(([x0, x1], i) => {
      for (let x = x0; x <= x1; x++) c.px(x, 40 + i, x - x0 < 2 || (i < 3 && i > 0 && x1 - x > 7) ? 'w' : x1 - x < 2 ? 'W' : 'w');
    });
    [37, 41, 47, 51].forEach((x) => { c.px(x, 43, 'M'); c.px(x, 44, 'M'); });
    c.px(MID - 1, 43, 'g'); c.px(MID, 43, 'g'); c.px(MID - 1, 44, 'G'); c.px(MID, 44, 'G'); c.px(MID - 1, 42, 'h');
  });
}

// --- Arms ---
// A sleeve from the shoulder to the wrist in two lengths (stiff, a hard
// bend at the elbow), a gold cuff, and a white glove.
function arm(s, e, w, hand) {
  return part((c) => {
    c.limb(s, e, 4, BLUE);
    c.limb(e, w, 3.4, BLUE);
    c.px(s[0], s[1], 'g'); c.px(s[0] + 1, s[1], 'h');
    c.px(w[0], w[1], 'g'); c.px(w[0] + 1, w[1], 'h'); c.px(w[0], w[1] + 1, 'G');
    hand(c, w);
  });
}
// The flourish: an open glove, palm up and out, fingers spread.
function openHand(c, [x, y]) {
  c.ell(x - 3, y - 2, 2.6, 2.2, 'w', null, 'W');
  c.rect(x - 7, y - 4, 2, 1, 'w'); c.rect(x - 8, y - 2, 2, 1, 'w'); c.rect(x - 7, y, 2, 1, 'w');
  c.px(x - 5, y - 4, 'w'); c.px(x - 5, y - 2, 'W'); c.px(x - 5, y, 'W');
  c.rect(x - 5, y - 2, 1, 1, 'w');
  c.px(x - 2, y - 5, 'w'); c.px(x - 1, y - 5, 'w');
}
// Closed round the sceptre.
function fist(c, [x, y]) {
  c.rect(x - 1, y + 1, 4, 4, 'w');
  c.rect(x + 2, y + 1, 1, 4, 'W');
  c.rect(x - 1, y + 4, 4, 1, 'W');
  c.px(x - 2, y + 2, 'w'); c.px(x - 2, y + 3, 'w');
}

// The sceptre planted on the boards: gold, with a red jewel and a star on top.
function sceptre(x) {
  return part((c) => {
    c.rect(x, 18, 1, 62, 'h'); c.rect(x + 1, 18, 1, 62, 'G');
    c.ell(x + 0.5, 15, 2.8, 2.8, 'g', 'J', 'G');
    c.px(x, 15, 'j'); c.px(x + 1, 15, 'j'); c.px(x, 14, 'j');
    [[x - 3, 11], [x + 4, 11], [x + 0, 10], [x + 1, 10]].forEach(([px, py]) => c.px(px, py, 'g'));
    c.px(x - 2, 12, 'g'); c.px(x + 3, 12, 'g'); c.px(x, 11, 'g'); c.px(x + 1, 11, 'g');
    c.rect(x - 1, 22, 4, 1, 'G'); c.px(x, 22, 'g');
  });
}

// --- The head ---
// An egg of a head, a man's: greying hair at the temples and under the crown,
// brows, small dark eyes, a nose, rosy cheeks, the moustache with its ends
// curled up over a closed smile that stays closed.
function head(blink = false) {
  return part((c) => {
    c.rect(MID - 3, 37, 6, 5, 'S'); c.rect(MID + 1, 37, 2, 5, 'S');
    c.ell(MID - 0.5, 29.5, 7.4, 8.4, 'a', null, 'A');
    c.ell(MID - 0.5, 32.4, 6.2, 7.6, 's', 't', 'S');
    c.ell(MID - 6.8, 32, 1, 2, 's'); c.ell(MID + 5.8, 32, 1, 2, 'S');
    // The hair: a fringe under the crown, thinning at the temples.
    c.rect(MID - 5, 24, 10, 1, 'a'); c.px(MID - 5, 25, 'a'); c.px(MID + 4, 25, 'A');
    [[MID - 3, 24], [MID + 1, 24], [MID + 3, 24]].forEach(([x, y]) => c.px(x, y, 'A'));
    // Brows: arched.
    [[-5, 29], [-4, 28], [-3, 28], [-2, 28]].forEach(([x, y]) => { c.px(MID + x, y, 'A'); c.px(MID - 1 - x, y, 'A'); });
    // Eyes: small and dark with a white corner.
    if (blink) {
      c.rect(MID - 4, 31, 3, 1, 'S'); c.rect(MID + 1, 31, 3, 1, 'S');
    } else {
      c.px(MID - 4, 30, 'w'); c.px(MID - 3, 30, 'd'); c.px(MID - 2, 30, 'd'); c.px(MID - 3, 31, 'd'); c.px(MID - 2, 31, 'd');
      c.px(MID + 3, 30, 'w'); c.px(MID + 2, 30, 'd'); c.px(MID + 1, 30, 'd'); c.px(MID + 2, 31, 'd'); c.px(MID + 1, 31, 'd');
    }
    // The nose.
    c.rect(MID - 1, 32, 2, 3, 'S'); c.px(MID - 1, 32, 's'); c.px(MID - 1, 34, 'S'); c.px(MID, 35, 'S');
    // Rosy cheeks.
    c.rect(MID - 5, 34, 2, 2, 'o'); c.rect(MID + 3, 34, 2, 2, 'o');
    // The moustache, thick, drooping at the middle and its ends curled up,
    // over a closed smile that stays closed.
    c.rect(MID - 5, 35, 10, 1, 'A'); c.rect(MID - 4, 36, 8, 1, 'A'); c.px(MID - 1, 35, 'S'); c.px(MID, 35, 'S');
    c.px(MID - 6, 34, 'A'); c.px(MID + 5, 34, 'A'); c.px(MID - 6, 35, 'A'); c.px(MID + 5, 35, 'A');
    c.px(MID - 3, 37, 'A'); c.px(MID + 2, 37, 'A');
    c.rect(MID - 2, 38, 4, 1, 'q'); c.px(MID - 3, 37, 'A'); c.px(MID - 3, 38, 'q'); c.px(MID + 2, 38, 'q');
  });
}

// A small crown, 18 wide: five gold points, a band with jewels. `glint`
// (0 to 4) catches the spotlight on one of the points: a little star.
function crown(glint = null) {
  return part((c) => {
    const points = [[37, 17], [40, 15], [43, 13], [46, 15], [49, 17]];
    points.forEach(([x, top]) => {
      c.rect(x, top, 3, 21 - top, 'g'); c.rect(x + 2, top, 1, 21 - top, 'G'); c.px(x, top, 'J');
    });
    c.rect(37, 19, 15, 3, 'g'); c.rect(37, 21, 15, 1, 'G');
    c.px(39, 20, 'j'); c.px(44, 20, 'j'); c.px(45, 20, 'j'); c.px(50, 20, 'j');
    c.px(43, 12, 'j'); c.px(44, 12, 'j'); c.px(44, 13, 'j');
    // Engraving along the band, between the jewels.
    [41, 42, 47, 48].forEach((x) => c.px(x, 20, 'h'));
    if (glint !== null && points[glint]) {
      const [x, top] = points[glint];
      c.px(x, top - 2, 'J'); c.px(x - 1, top - 1, 'J'); c.px(x + 1, top - 1, 'J'); c.px(x, top - 1, 'J');
    }
  });
}

// --- Him, whole ---
// pose names the two arms: the flourish (the left one out wide, palm up) and
// the sceptre planted at his right; or both at his sides.
// `down`: that arm at his side; `point`: flung straight out at you (an
// attack starting).
const POSES = {
  show: { flourish: true },
  down: { down: true },
  point: { point: true },
};

// opts: blink, ox, oy (him moved on the canvas), hx (just his head),
// glint (the light catching a point of his crown, 0 to 4).
export function kingRows(pose = 'show', opts = {}) {
  const p = POSES[pose] ?? POSES.show;
  const c = new Cv();
  const parts = [];
  parts.push(cape());
  parts.push(legs());
  parts.push(body());
  parts.push(collar());
  // The arm out wide at his right (the left of the picture), over the cape.
  if (p.flourish) parts.push(arm([37, 47], [27, 51], [17, 44], openHand));
  if (p.down) parts.push(arm([37, 47], [34, 55], [33, 62], fist));
  if (p.point) parts.push(arm([37, 47], [27, 47], [17, 47], fist));
  // The other, bent at the elbow to hold the sceptre planted by his side.
  const scep = sceptre(61);
  parts.push(scep);
  parts.push(arm([51, 47], [56, 54], [60, 58], fist));
  const top = [head(opts.blink), crown(opts.glint)];
  parts.push(...top);
  // (Everything but the legs and the sceptre is raised three rows: long legs.
  // `hx` ticks his head and crown sideways on their own.)
  parts.forEach((pc, i) => c.stamp(pc, (opts.ox ?? 0) + (top.includes(pc) ? opts.hx ?? 0 : 0), (opts.oy ?? 0) + (i === 1 || pc === scep ? 0 : -3)));
  return remap(c.rows());
}

// The sprite he stands on the stage with.
export const KING_SPRITE = kingRows('show');

// His clips for the show (the fight's first phase), in the shape of
// RUMBOLD_SHOW_ANIM. Nobody knows he's a puppet yet: no strings, no bar, and
// his mouth never moves; he talks with his head and his hand.
const k = (pose, opts) => kingRows(pose, opts);
export const KING_SHOW_ANIM = {
  // A showman holding his pose: a breath, a blink; and once in a while his
  // head ticks over a pixel and straight back, too quick and too even, like
  // something on a hinge (the only hint, in the show, of what he is).
  // (The light runs along his crown as he breathes.)
  idle: {
    fps: 3,
    frames: [
      k('show'), k('show', { oy: 1, glint: 1 }), k('show', { oy: 1, glint: 2 }), k('show', { glint: 3 }), k('show'),
      k('show', { blink: true }), k('show'), k('show', { hx: 1 }), k('show'),
    ],
    holds: [3, 1, 1, 0.5, 2.5, 0.5, 4, 0.25, 2],
  },
  // Talking: a sway, never the mouth.
  talk: { fps: 6, frames: [k('show', { ox: 1 }), k('show'), k('show', { ox: -1 }), k('show')] },
  // An attack starting: the arm swept round to point at you, a lean in.
  // (A dip first, gathering himself, then the lunge.)
  windup: { fps: 10, frames: [k('down'), k('down', { oy: 1, ox: 1 }), k('point', { ox: -2 }), k('point', { ox: -3, glint: 0 }), k('point', { ox: -3 }), k('point', { ox: -2 }), k('show')] },
  // Hit: a recoil, eyes shut.
  // (His head snaps back a beat behind the rest of him.)
  hurt: { fps: 12, frames: [k('down', { ox: 3, oy: 1, blink: true }), k('down', { ox: 2, oy: 1, hx: 1, blink: true }), k('show', { ox: -2, blink: true }), k('show')] },
  // The curtains part on him standing at ease; he lifts his arm to the house.
  intro: { fps: 6, frames: [k('down'), k('down'), k('down', { blink: true }), k('down'), k('show', { oy: 1 }), k('show'), k('show'), k('show')] },
  chips: ['#f6e6c4', '#e6c896', '#c9a06a', '#d4ac48'],
};
