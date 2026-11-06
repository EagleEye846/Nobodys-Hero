import {
  BF_PALETTE,
  BF_TUCK_SPRITES,
  BF_TUCK_STRUNG_SPRITES,
  TUCK_STRUNG_ANCHORS as BF_TUCK_ANCHORS,
  bfChar,
} from './belowFolk.js';
import {
  PUPPET_PALETTE,
  PUPPET_GLOW_CORE,
  PW,
  PH,
  BAR_Y,
  puppetRows,
  puppetParts,
  puppetHandL,
  puppetShoulders,
  puppetChar,
  borderAt,
  gougeLength,
  gougeTip,
} from './peptupPuppet.js';
import { kingRows, kingChar } from './peptupKing.js';

// KING PEPTUP in battle (src/data/enemies/rumbold.js): the mannequin on
// strings (peptupPuppet.js) hanging over the dark stage, and what's round him:
// the border across the top of the stage, the rafters behind it where Tuck
// works the bar, and (in his last act) Tuck hung on his strings. The overworld
// and the cutscenes keep the painted king and his throne (belowFolk.js).
//
// His face is blank wood. When he wants to show something he raises a hand
// and digs the face in with his fingertips, chips flying (a grin as he talks,
// a scowl as he attacks, a gape when he's hit), and wipes it smooth after.
//
//   THE SHOW        he hangs from the bar, the rafters hidden behind the
//                   border. He sways; the strings jerk him into poses.
//   BEHIND THE      the string to his left arm snaps, his jaw jams open, his
//   CURTAIN         head lolls with half a grin dug in it, and a piece of the
//                   border falls: Tuck, lying along a beam in the rafters,
//                   working the bar. (`intro` is the jam itself.)
//   BEATEN          every string snaps and he falls apart onto the boards
//                   (`death`); Tuck is left up on his beam, unhurt.
//   SPARED          Tuck lets go: the strings go slack, the bar drops, and he
//                   falls in a heap (`spared`).
//   ALIVE           (phase 3, see the block at the bottom) the heap lights up
//                   inside and hauls itself up on its own strings; Tuck is
//                   dragged down out of the rafters and hung from its hand.
//
// Every clip is a list of 82 rows of 88 characters in RUMBOLD_PALETTE.

export const RUMBOLD_PALETTE = { ...BF_PALETTE, ...PUPPET_PALETTE };
// (Read by the bullets: where Tuck's strings tie on him.)
export const TUCK_STRUNG_ANCHORS = BF_TUCK_ANCHORS;
// The light's brightest colour, for the stage's bloom (puppetStage.js).
export const GLOW_CORE = PUPPET_GLOW_CORE;

const W = PW;
const H = PH;
// The boards he'd land on (the bottom row a fallen piece rests on).
const FLOOR = 80;
// The stage's x of the sprite's left edge, halved (its battlePos is 144): the
// border's columns are counted across the whole stage, so the backdrop's
// border and the sprite's line up.
const COL0 = 72;

const grid = (rows) => rows.map((row) => [...row]);
const rowsOf = (g) => g.map((row) => row.join(''));
function stamp(g, rows, ox, oy) {
  rows.forEach((row, j) => [...row].forEach((ch, i) => {
    const x = ox + i;
    const y = oy + j;
    if (ch !== '.' && x >= 0 && y >= 0 && x < W && y < H) g[y][x] = ch;
  }));
  return g;
}
function lineOn(g, x0, y0, x1, y1, ch) {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
  for (let i = 0; i <= n; i++) {
    const x = Math.round(x0 + ((x1 - x0) * i) / n);
    const y = Math.round(y0 + ((y1 - y0) * i) / n);
    if (x >= 0 && y >= 0 && x < W && y < H) g[y][x] = ch;
  }
}

const STRING = puppetChar('s');
const BEAM = puppetChar('x');
const BEAM_LIT = puppetChar('W');
const GOLD = puppetChar(',');
const CORE = puppetChar('`');

// --- What's round him ---

// The border across the top: rotted velvet, ragged at the hem. `drop`: a
// piece of it falling (pixels down), `gone` for none.
function border(g, drop = 0) {
  for (let i = 0; i < W; i++) {
    const { color, hem } = borderAt(COL0 + i);
    const ch = puppetChar(color);
    for (let y = 0; y <= hem; y++) if (y + drop < H) g[y + drop][i] = ch;
  }
}

// The rafters: a beam across the top, and Tuck lying along it, peering over,
// both paws on the bar's hanger. tuck: which of his faces (a; b blinking; c
// an ear up), or null for the beam alone.
const TUCK_HEAD = (k) => BF_TUCK_SPRITES[k].slice(0, 11);
function rafters(g, tuck = 'a') {
  for (let x = 0; x < W; x++) { g[12][x] = BEAM_LIT; g[13][x] = BEAM; }
  if (!tuck) return;
  const head = TUCK_HEAD(tuck);
  stamp(g, head, 44 - Math.floor(head[0].length / 2), 2);
  // His paws round the hanger, under the beam.
  const fur = bfChar('F');
  const dark = bfChar('k');
  [[43, 14], [45, 14]].forEach(([x, y]) => { g[y][x] = fur; g[y + 1][x] = dark; });
}

// Bits of the light, each a bright dot with a gold tail.
function motes(g, points) {
  points.forEach(([x, y]) => {
    [[0, 0, CORE], [1, 0, GOLD], [0, 1, GOLD], [0, 2, GOLD]].forEach(([i, j, ch]) => {
      if (x + i >= 0 && x + i < W && y + j >= 0 && y + j < H) g[y + j][x + i] = ch;
    });
  });
}

// Tuck hung on strings from the king's left hand (`hand`, on the sprite).
// how: 'taut', 'slack' or 'none'.
function tuckStrung(g, { hand, tuck = 'a', tx = 1, ty = 44, how = 'taut' }) {
  stamp(g, BF_TUCK_STRUNG_SPRITES[tuck], tx, ty);
  Object.values(TUCK_STRUNG_ANCHORS).forEach(([ax, ay]) => {
    if (how === 'taut') lineOn(g, hand[0], hand[1], tx + ax, ty + ay, STRING);
    else if (how === 'slack') lineOn(g, tx + ax, ty + ay, tx + ax + (ax < 8 ? 1 : -1), ty + ay - 4, STRING);
  });
}

// One frame: him (pose and puppetRows' options), and round him: `top`, what's
// at the top of the stage ('border', 'rafters' with Tuck, 'beam' alone, or a
// { drop } of the border falling over the rafters), and `after`, anything
// else drawn on.
function frame(pose, opts = {}, { top = 'border', tuck = 'a', after = null } = {}) {
  const g = grid(puppetRows(pose, opts));
  if (top === 'rafters') rafters(g, tuck);
  else if (top === 'beam') rafters(g, null);
  else if (top === 'border') border(g);
  else if (top?.drop !== undefined) { rafters(g, tuck); border(g, top.drop); }
  if (after) after(g);
  return rowsOf(g);
}

// Digging a face: `steps` frames of his hand at his face, the face coming
// as it goes, chips flying. Then the face, done.
function dig(kind, steps, pose, opts = {}, round = {}) {
  const len = gougeLength(kind);
  const out = [];
  for (let i = 1; i <= steps; i++) {
    const n = Math.round((len * i) / steps);
    const [tx, ty] = gougeTip(kind, n);
    const ox = opts.ox ?? 0;
    const oy = opts.oy ?? 0;
    const chips = [[tx + ox - 2 - i, ty + oy - 3], [tx + ox + 3, ty + oy - 2 - i], [tx + ox - 4, ty + oy + 1], [tx + ox + 5 + i, ty + oy - 4]];
    out.push(frame({ ...poseOf(pose), l: { tip: [tx, ty] } }, { ...opts, gouge: { kind, n }, chips }, round));
  }
  return out;
}
// Wiping his face smooth: his palm dragged across it, a little dust.
function wipe(pose, opts = {}, round = {}) {
  const { gouge, ...rest } = opts;
  return [
    frame({ ...poseOf(pose), l: { tip: [40, 37] } }, { ...rest, gouge }, round),
    frame({ ...poseOf(pose), l: { tip: [47, 39] } }, { ...rest, chips: [[52 + (rest.ox ?? 0), 37 + (rest.oy ?? 0)], [53 + (rest.ox ?? 0), 40 + (rest.oy ?? 0)]] }, round),
  ];
}
const POSES = { idle: { l: 'hang', r: 'sag' }, swing: { l: 'sag', r: 'hang' } };
const poseOf = (pose) => (typeof pose === 'string' ? (POSES[pose] ?? { l: 'hang', r: 'sag' }) : pose);

// --- The show ---

// The sprite he hangs on the stage with.
export const RUMBOLD_SPRITE = frame('idle');

// His lurch: yanked forward (towards you) and up, below the bar.
const LURCH = (k) => ({ ox: -Math.round(k), oy: -Math.round(k * 0.3) });

export const RUMBOLD_SHOW_ANIM = {
  // He hangs and sways, his arms swinging a little, his head ticking.
  idle: { fps: 3, frames: [
    frame('idle'),
    frame('idle', { ox: 1, dx: 1 }),
    frame('swing', { ox: 1 }),
    frame('swing', { hy: 1 }),
    frame('idle', { ox: -1 }),
    frame('idle', { ox: -1, dx: -1 }),
    frame('idle'),
    frame('swing', { oy: 1 }),
  ] },
  // While he talks: a grin dug in, and his jaw clacking on its hinge.
  talk: { fps: 9, frames: [0, 2, 1, 3, 2, 0].map((jaw, i) => frame('idle', { gouge: { kind: 'grin' }, jaw, dx: i === 5 ? 1 : 0 })) },
  // As an attack starts: he digs a scowl in, quick, the strings yank him
  // into his wave, held stiff, and he drops back and wipes his face.
  windup: { fps: 10, frames: [
    ...dig('scowl', 3, 'idle'),
    frame('wave', { gouge: { kind: 'scowl' }, ...LURCH(6) }),
    frame('wave', { gouge: { kind: 'scowl' }, ...LURCH(12) }),
    frame('wave', { gouge: { kind: 'scowl' }, ...LURCH(12) }),
    frame('wave', { gouge: { kind: 'scowl' }, ...LURCH(12) }),
    frame('half', { gouge: { kind: 'scowl' }, ...LURCH(6) }),
    frame('idle', { gouge: { kind: 'scowl' } }),
    ...wipe('idle', { gouge: { kind: 'scowl' } }),
    frame('idle'),
  ] },
  // Hit: his face caves into a gape, and he swings.
  hurt: { fps: 12, frames: [frame('half', { gouge: { kind: 'gape' }, ox: 3, oy: 1 }), frame('swing', { gouge: { kind: 'gape' }, ox: -2 }), frame('idle')] },
  // The show begins: he hangs limp, the strings snap him up, he digs his
  // grin in, and TA-DA: arms wide.
  intro: { fps: 6, frames: [
    frame('limp', { hy: 3, oy: 3 }, {}),
    frame('limp', { hy: 2, oy: 1 }),
    frame('half', { oy: -2 }),
    ...dig('grin', 4, 'idle'),
    frame('gesture', { gouge: { kind: 'grin' }, jaw: 2 }),
    frame('gesture', { gouge: { kind: 'grin' }, jaw: 3 }),
    frame('wave', { gouge: { kind: 'grin' }, jaw: 1 }),
    frame('gesture', { gouge: { kind: 'grin' } }),
    ...wipe('idle', { gouge: { kind: 'grin' } }),
  ] },
  chips: ['#f6e6c4', '#e6c896', '#c9a06a', '#d4ac48'],
};

// --- Behind the curtain ---

// The look he's stuck in: the string to his left arm snapped and the arm
// hanging dead, his head lolled over with the jaw jammed open and half a grin
// dug in, and Tuck up in the rafters, working the bar.
const JAM = { pose: 'jam', opts: { cut: ['handL'], twist: 0.35, dx: 2, hy: 2, jaw: 3, gouge: { kind: 'grin', n: 12 } } };
const jam = (extra = {}, tuck = 'a', more = {}) => frame(JAM.pose, { ...JAM.opts, ...extra }, { top: 'rafters', tuck, ...more });
export const RUMBOLD_JAMMED_SPRITE = jam();

// --- Coming apart ---

const bboxOf = (rows) => {
  let x0 = 1e9; let y0 = 1e9; let x1 = -1; let y1 = -1;
  rows.forEach((row, y) => [...row].forEach((ch, x) => {
    if (ch === '.') return;
    x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
  }));
  return { x0, y0, x1, y1 };
};
const cutOut = (rows, b) => rows.slice(b.y0, b.y1 + 1).map((r) => [...r].slice(b.x0, b.x1 + 1).join(''));
// A piece turned on its side (rows become columns).
const turned = (rows) => Array.from({ length: [...rows[0]].length }, (_, i) => rows.map((r) => [...r][i]).join(''));
const easeOut = (k) => 1 - (1 - k) * (1 - k);

// A falling piece: cut out of its rows, where it starts, and `land` (its left
// edge, and the row its bottom comes to rest on).
function piece(rows, land, turn = false) {
  const b = bboxOf(rows);
  const flat = cutOut(rows, b);
  return { flat, side: turned(flat), sx: b.x0, sy: b.y0, land, turn };
}
// A piece `t` (0 to 1) through its fall: an arc out and down, turned on its
// side halfway if it turns.
function fall(g, p, t, arc = 4) {
  const rows = p.turn && t > 0.5 ? p.side : p.flat;
  const x = Math.round(p.sx + (p.land[0] - p.sx) * easeOut(t));
  const ly = p.land[1] - rows.length + 1;
  const y = Math.round(p.sy + (ly - p.sy) * t * t) - (t < 1 ? Math.round(Math.sin(t * Math.PI) * arc) : 0);
  stamp(g, rows, x, y);
}

// The strings snap and he comes apart a piece at a time: his head first (it
// rolls off to the left), the arms, the legs, and last his body drops onto
// the boards among them. Tuck stays up on his beam.
function breakUp(steps) {
  const parts = puppetParts(JAM.pose, JAM.opts);
  const pieces = [
    { p: piece(parts.head, [2, FLOOR]), at: 0.05 },
    { p: piece(parts.armL, [30, FLOOR], true), at: 0.2 },
    { p: piece(parts.armR, [52, FLOOR], true), at: 0.28 },
    { p: piece(parts.legL, [24, FLOOR], true), at: 0.4 },
    { p: piece(parts.legR, [48, FLOOR], true), at: 0.46 },
  ];
  const body = piece(parts.body, [0, FLOOR]);
  body.land[0] = body.sx;
  const out = [];
  for (let f = 0; f <= steps; f++) {
    const t = f / steps;
    const g = grid(puppetRows('idle', { bar: {}, strings: 'none', cut: 'all', glow: null, ox: 0, oy: 200 }));
    rafters(g, f > steps * 0.6 ? 'c' : 'a');
    fall(g, body, Math.max(0, Math.min(1, (t - 0.5) / 0.45)), 0);
    for (const { p, at } of pieces) {
      const k = Math.max(0, Math.min(1, (t - at) / (1 - at) / 0.55));
      const jolt = k > 0 && k < 0.2 ? Math.round(Math.sin(f * 9)) : 0;
      if (k === 0) stamp(g, p.flat, p.sx + jolt, p.sy);
      else fall(g, p, k);
    }
    out.push(rowsOf(g));
  }
  return out;
}
const BREAK_FRAMES = breakUp(12);

// What's left: the pieces about the boards, the bar hanging empty, Tuck up on
// his beam, unhurt.
export const RUMBOLD_BEATEN_SPRITE = BREAK_FRAMES[BREAK_FRAMES.length - 1];

// Tuck lets go: the bar drops a little, the strings go slack, and he folds up
// in a heap on the boards.
const HEAPED = { cut: ['handL'], twist: 0.6, dx: 3, hy: 3, jaw: 3, gouge: { kind: 'grin', n: 12 }, strings: 'slack', bar: { dy: 6 }, oy: 5 };
const SPARED_FRAMES = [
  jam({ strings: 'slack', bar: { dy: 2 } }, 'b'),
  jam({ strings: 'slack', bar: { dy: 4 }, oy: 2 }, 'a'),
  frame('limp', { ...HEAPED, oy: 3, bar: { dy: 5 } }, { top: 'rafters', tuck: 'b' }),
  frame('heap', HEAPED, { top: 'rafters', tuck: 'a' }),
  frame('heap', HEAPED, { top: 'rafters', tuck: 'a' }),
];

// --- The paint comes off ---

// The blow that finds him out: the king he's been all show (peptupKing.js)
// stops dead, cracks spread over him from where he was hit, and he comes off
// in flakes of paint that drop to the boards, the wooden mannequin underneath.
// Then his strings drop down out of the dark to the bar, and the jam goes on
// from there. (`steps`: frames of flaking.)
const CRACK = kingChar('k');
// A fixed scatter, so the same flake goes at the same time every fight.
const hash = (x, y) => {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
};
function revealFrames(steps) {
  const king = grid(kingRows('down', { blink: true }));
  const under = grid(puppetRows('half', {}));
  border(under);
  // Where he was struck (his chest), the cracks running out from it.
  const hit = [40, 46];
  const cracks = [[-1, -0.9], [1, -1.1], [-1.2, 0.2], [1.1, 0.4], [-0.4, 1.2], [0.5, 1.3], [0.1, -1.4]];
  const crackFrame = (reach) => {
    const g = grid(rowsOf(king));
    cracks.forEach(([dx, dy], i) => {
      let x = hit[0];
      let y = hit[1];
      for (let s = 0; s < reach; s++) {
        x += dx + (hash(i, s) - 0.5) * 1.4;
        y += dy + (hash(s, i) - 0.5) * 1.4;
        const rx = Math.round(x);
        const ry = Math.round(y);
        if (g[ry]?.[rx] && g[ry][rx] !== '.') g[ry][rx] = CRACK;
      }
    });
    return g;
  };
  const crackedFull = crackFrame(26);
  // Each pixel of him goes when the flaking passes its time: soonest nearest
  // the blow, and a little at random, so he comes off in patches.
  const goesAt = (x, y) => Math.min(0.98, Math.hypot(x - hit[0], (y - hit[1]) * 0.8) / 60 + hash(x >> 1, y >> 1) * 0.45);
  const out = [
    rowsOf(crackFrame(4)),
    rowsOf(crackFrame(10)),
    rowsOf(crackFrame(18)),
    rowsOf(crackedFull),
    rowsOf(crackedFull),
  ];
  for (let f = 1; f <= steps; f++) {
    const t = f / steps;
    const g = grid(under.map((row) => row.map(() => '.')));
    // The mannequin, where the paint's gone (only where the king stood: his
    // strings and bar are still hidden in the dark).
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (king[y][x] !== '.' && under[y][x] !== '.') g[y][x] = under[y][x];
      if ((y <= 12 || (t > 0.7 && under[y][x] !== STRING)) && under[y][x] !== '.') g[y][x] = under[y][x];
    }
    // The paint still on, and flakes falling: a flake drops further the
    // longer since it came loose, and lands on the boards.
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const ch = crackedFull[y][x];
      if (ch === '.') continue;
      const at = goesAt(x, y);
      if (t < at) { g[y][x] = ch; continue; }
      const gone = (t - at) * steps;
      if (gone > 3 || hash(x, y) < 0.55) continue;
      const fy = Math.min(FLOOR, y + Math.round(gone * gone * 3 + gone * 2));
      const fx = x + Math.round((hash(y, x) - 0.5) * gone * 3);
      if (fx >= 0 && fx < W && fy < H) g[fy][fx] = ch;
    }
    out.push(rowsOf(g));
  }
  // The strings drop down out of the dark to the bar.
  [24, 44, 64, H].forEach((reach) => {
    const g = grid(rowsOf(under));
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (king[y][x] === '.' && y > 12 && y > reach && g[y][x] === STRING) g[y][x] = '.';
    }
    out.push(rowsOf(g));
  });
  return out;
}
const REVEAL_FRAMES = revealFrames(8);

export const RUMBOLD_JAMMED_ANIM = {
  idle: { fps: 3, frames: [jam(), jam({}, 'b'), jam({ twist: 0.45, dx: 3 }), jam(), jam({ ox: 1 }, 'c'), jam({ twist: 0.45, dx: 3, ox: 1 }, 'c'), jam({ ox: 1 })] },
  // The bar jerking on a king whose arm won't come: a stiff twitch.
  windup: { fps: 8, frames: [jam({ twist: 0.45, dx: 3 }, 'c'), jam({ ox: 3 }, 'c'), jam({ twist: 0.45, dx: 3, ox: -3 }, 'c'), jam({ ox: 2 }), jam()] },
  hurt: { fps: 12, frames: [jam({ ox: 3 }), jam({ twist: 0.45, dx: 3, ox: -2 }), jam()] },
  // THE JAM: he's yanked into his wave, scowling, the string to his arm snaps
  // and the arm drops, his jaw drops with a clunk, his head lolls over, and a
  // piece of the border falls away off the rafters: Tuck.
  // First the paint comes off him (twice as quick), then the jam itself.
  intro: { fps: 12, frames: [
    ...REVEAL_FRAMES,
    ...[
    frame('half', { gouge: { kind: 'scowl' } }),
    frame('wave', { gouge: { kind: 'scowl' }, ...LURCH(10) }),
    frame({ l: 'limp', r: 'hip', ll: 'kick' }, { gouge: { kind: 'scowl' }, cut: ['handL'], ...LURCH(10) }),
    frame('jam', { gouge: { kind: 'grin', n: 12 }, cut: ['handL'], jaw: 1, twist: 0.1, ...LURCH(8) }),
    frame('jam', { gouge: { kind: 'grin', n: 12 }, cut: ['handL'], jaw: 3, twist: 0.2, dx: 1, ...LURCH(5) }),
    frame('jam', { ...JAM.opts, ...LURCH(2) }),
    frame(JAM.pose, JAM.opts, { top: { drop: 0 } }),
    frame(JAM.pose, JAM.opts, { top: { drop: 4 } }),
    frame(JAM.pose, JAM.opts, { top: { drop: 12 }, tuck: 'b' }),
    frame(JAM.pose, JAM.opts, { top: { drop: 28 }, tuck: 'c' }),
    frame(JAM.pose, JAM.opts, { top: { drop: 60 }, tuck: 'c' }),
    jam(),
    jam({}, 'b'),
    ].flatMap((rows) => [rows, rows]),
  ] },
  // Beaten: he comes apart. His last frame holds.
  death: { fps: 8, frames: BREAK_FRAMES },
  spared: { fps: 4, frames: SPARED_FRAMES },
  chips: ['#f6e6c4', '#e6c896', '#c9a06a', '#d4ac48'],
};

// --- The living king (phase 3) ---
//
// Tuck has let go, and the heap gets up anyway: a light burns INSIDE the
// hollow wood, white-gold and a little cold, and shows through the gaps at
// every joint, a seam down his chest, the crack in his head and every face he
// digs. His strings go taut up to a bar nobody's holding. Its idle is wrong:
// the head ticks sideways, the jaw clacks out of time with anything, the arms
// hang and then snap up. Tuck has been dragged down out of the rafters and
// hangs from strings tied to its hand, at the left, small and scared, his
// feet off the boards.
//
// What there is (all 88x82, in RUMBOLD_PALETTE, the same size and place as
// RUMBOLD_SPRITE, so the stage and battlePos don't change):
//   RUMBOLD_ALIVE_SPRITE   a still of it, light on, arms hanging, Tuck hung
//   RUMBOLD_ALIVE_ANIM     the clips:
//       idle    the twitching: head ticks, jaw clacks, arms snap up
//       windup  as an attack starts: a scowl dug in, glowing, and a lurch
//       hurt    a hit: the light gutters and comes back
//       intro   the heap lights up and hauls itself up; Tuck is dragged down
//               off his beam onto the strings (puppetStage.js plays it in
//               steps: frames 1 to 3 the kindling, 4 on the rising)
//       stare   his finale (rumboldAliveTear): his head turns slowly right
//               round on his neck, upside down, two eyes dug in and burning,
//               to look out at you; the last frame holds
//       out     the end (also `spared`): the light slips up out of his jaw
//               and away, the strings go slack, Tuck is lowered to the
//               boards, and the wood drops in a heap
//       death   beaten: he comes apart joint by joint, still lit, then the
//               light goes (from frame 12: LEAVE_AT in puppetStage.js)
//   TUCK_STRUNG_SPRITE     Tuck hanging from his strings on his own (16x22),
//                          TUCK_STRUNG_ANIM his idle (swaying 'idle', head
//                          down 'down')

// One frame of the living king. pose (l, r arms, legs both legs) and
// puppetRows' options (glow 3 unless said); tuck, ty, tx: Tuck's frame and
// where he hangs; tie: Tuck's strings 'taut', 'slack' or 'none'; dots:
// motes of light.
function alive({ l = 'hang', r = 'sag', legs = 'dangle', tuck = 'a', ty = 44, tx = 1, tie = 'taut', dots = [], withTuck = true, ...opts }) {
  const pose = { l, r, ll: legs, rl: legs };
  const o = { glow: 3, ...opts };
  return frame(pose, o, {
    top: 'beam',
    after: (g) => {
      if (withTuck) tuckStrung(g, { hand: puppetHandL(pose, o), tuck, tx, ty, how: tie });
      motes(g, dots);
    },
  });
}

export const RUMBOLD_ALIVE_SPRITE = alive({ jaw: 2 });

// Clawing a face in, the way he does it now (a fire in him, long fingers): his
// hand up at his head, fingertips dragging the face in a few points at a time,
// chips flying. `extra`: puppetRows options for the whole stretch.
function aliveDig(kind, steps, extra = {}) {
  const len = gougeLength(kind);
  return Array.from({ length: steps }, (_, k) => {
    const n = Math.round((len * (k + 1)) / steps);
    const [tx, ty] = gougeTip(kind, n);
    const chips = [[tx - 3 - k, ty - 3], [tx + 3, ty - 2 - k], [tx - 4, ty + 1], [tx + 5 + k, ty - 4]];
    return alive({ ...extra, l: { tip: [tx, ty], claw: true }, gouge: { kind, n }, chips });
  });
}
// Wiping it smooth: the palm dragged across the face, the dug face half gone,
// then gone.
function aliveWipe(kind, extra = {}) {
  return [
    alive({ ...extra, l: { tip: [40, 37], claw: true }, gouge: { kind } }),
    alive({ ...extra, l: { tip: [47, 39], claw: true }, chips: [[52, 37], [53, 40]] }),
  ];
}
// Shoulder to shoulder, as the stage reaches his arms over the box
// (puppetStage.js): his body leans out towards it, and no arms are drawn on
// the sprite at all.
export const REACH_OX = -4;
// Seconds into his `windup` when the face is dug and the stage's hands start
// out over the box (the 4 digging frames of it, at 9 a second).
export const REACH_AT = 4 / 9;
export const REACH_SHOULDERS = puppetShoulders({ ox: REACH_OX, oy: 0 });
const reach = (extra = {}) => alive({ l: 'none', r: 'none', legs: 'splay', ox: REACH_OX, gouge: { kind: 'rictus' }, jaw: 3, ...extra });
export const RUMBOLD_REACH = { fps: 7, frames: [reach(), reach({ dx: 1, jaw: 2 }), reach({ glow: 2, jaw: 3, hy: 1 }), reach({ dx: -1, jaw: 1 })] };

// His head snapped right round on its side, the face turned out at you.
export const SNAP_TWIST = Math.PI / 2;
const snap = (extra = {}) => alive({ twist: SNAP_TWIST, ...extra });
// Mid-snap, for the frame or two the head is on its way.
export const RUMBOLD_SNAP_MID = alive({ twist: 0.8, gouge: { kind: 'smile' }, jaw: 1 });

// Tuck on the strings by himself.
const TS = BF_TUCK_STRUNG_SPRITES;
export const TUCK_STRUNG_SPRITE = TS.a;
export const TUCK_STRUNG_ANIM = {
  idle: { fps: 3, frames: [TS.a, TS.b, TS.a, TS.c] },
  // Head hung, eyes shut: when the strings go slack.
  down: { fps: 2, frames: [TS.d, TS.e] },
};

// The heap he's left in when Tuck lets go, lighting up.
const kindle = (glow, dx = 3) => frame('heap', { ...HEAPED, glow, dx }, { top: 'rafters', tuck: glow >= 2 ? 'c' : 'a' });

// The end: the light slips out of him and leaves, the strings go slack, and
// the dull wood drops in a heap.
const HEAP_OUT = { l: 'limp', r: 'limp', legs: 'fold', strings: 'slack', bar: { dy: 6 }, oy: 5, hy: 3, twist: 0.5, dx: 2, jaw: 3 };
export const RUMBOLD_ALIVE_OUT = {
  fps: 6,
  frames: [
    alive({ jaw: 3 }),
    alive({ jaw: 3, oy: -1, tuck: 'b', dots: [[44, 44], [45, 40], [43, 37]] }),
    alive({ jaw: 3, glow: 2, tuck: 'd', ty: 50, tie: 'slack', strings: 'slack', dots: [[44, 38], [46, 33], [42, 30], [45, 26], [47, 35]] }),
    alive({ l: 'limp', r: 'limp', jaw: 3, glow: 1, hy: 1, oy: 2, tuck: 'd', ty: 56, tie: 'slack', strings: 'slack', bar: { dy: 3 }, dots: [[44, 28], [47, 22], [41, 18], [43, 24]] }),
    alive({ ...HEAP_OUT, glow: 1, oy: 4, tuck: 'e', ty: 59, tie: 'slack', dots: [[45, 16], [42, 12]] }),
    alive({ ...HEAP_OUT, glow: 0, tuck: 'd', ty: 59, tie: 'none', dots: [[46, 6]] }),
    alive({ ...HEAP_OUT, glow: 0, tuck: 'd', ty: 59, tie: 'none' }),
    alive({ ...HEAP_OUT, glow: 0, tuck: 'e', ty: 59, tie: 'none' }),
  ],
};
export const RUMBOLD_ALIVE_OUT_SPRITE = RUMBOLD_ALIVE_OUT.frames[RUMBOLD_ALIVE_OUT.frames.length - 1];

// --- The living king beaten (phase 3): coming apart ---
//
// Joint by joint, still lit and still moving (the right arm, the left arm,
// letting Tuck down, a leg, the other), the jaw clacking on its own to the
// last; then his strings snap, the light slips out through the jaw and away
// (the stage draws it, from frame 12: LEAVE_AT in puppetStage.js), and his
// body and head drop onto the boards among the rest. Tuck ends on the boards,
// head down, free.
function breakFrames() {
  const total = 18;
  const jawBy = [2, 3, 3, 1, 0, 3, 1, 3, 2, 0, 3, 3, 3, 3, 3, 3, 3, 3];
  const dxBy = [0, 1, -1, 0, -1, 1, 0, 2, -1, 1, 0, 0, 0, 0, 0, 0, 0, 0];
  const glowBy = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 1, 0, 0, 0, 0, 0];
  const tuckY = [44, 44, 44, 44, 44, 46, 50, 55, 59, 59, 59, 59, 59, 59, 59, 59, 59, 59];
  const tuckPose = ['a', 'b', 'a', 'c', 'b', 'a', 'b', 'd', 'd', 'e', 'd', 'e', 'd', 'e', 'd', 'e', 'd', 'e'];
  const dotsBy = {
    11: [[44, 40]],
    12: [[44, 36], [46, 32]],
    13: [[44, 30], [47, 25], [42, 22]],
    14: [[45, 18], [42, 12]],
    15: [[46, 6]],
  };
  // When each piece lets go (frame), and where it comes to rest.
  const at = { armR: 3, armL: 5, legR: 7, legL: 8, body: 12, head: 13 };
  const land = { armR: [54, FLOOR], armL: [22, FLOOR], legR: [48, FLOOR], legL: [30, FLOOR], head: [56, FLOOR - 1] };
  const pose = { l: 'hang', r: 'sag' };
  const out = [];
  for (let f = 0; f < total; f++) {
    const opts = { glow: glowBy[f], jaw: jawBy[f], dx: dxBy[f] };
    const parts = puppetParts(pose, opts);
    const g = grid(puppetRows(pose, { ...opts, oy: 200, strings: 'none', cut: f >= 10 ? 'all' : [] }));
    rafters(g, null);
    // Strings still holding him, to the parts still on.
    const shiver = (id) => (at[id] - f === 1 ? (f % 2 ? 1 : -1) : 0);
    // The body drops once the strings snap.
    const bodyPiece = piece(parts.body, [0, FLOOR]);
    bodyPiece.land[0] = bodyPiece.sx;
    if (f < at.body) stamp(g, bodyPiece.flat, bodyPiece.sx + shiver('body'), bodyPiece.sy);
    else fall(g, bodyPiece, Math.min(1, (f - at.body + 1) / 3), 0);
    for (const id of ['legL', 'legR', 'armR', 'armL', 'head']) {
      const p = piece(parts[id], land[id], id !== 'head');
      if (f < at[id]) stamp(g, p.flat, p.sx + shiver(id), p.sy);
      else fall(g, p, Math.min(1, (f - at[id] + 1) / 3));
    }
    if (f < 10) {
      // His own strings, taut to the bar while the light holds him.
      const hand = puppetHandL(pose);
      lineOn(g, 22, BAR_Y, hand[0], hand[1], STRING);
    }
    tuckStrung(g, { hand: puppetHandL(pose), tuck: tuckPose[f], ty: tuckY[f], how: f < at.armL ? 'taut' : f < 10 ? 'slack' : 'none' });
    motes(g, dotsBy[f] ?? []);
    out.push(rowsOf(g));
  }
  return out;
}

export const RUMBOLD_ALIVE_BREAK = { fps: 8, frames: breakFrames() };
// What the stage holds on: the pieces on the boards, Tuck free.
export const RUMBOLD_ALIVE_BREAK_SPRITE = RUMBOLD_ALIVE_BREAK.frames[RUMBOLD_ALIVE_BREAK.frames.length - 1];

// His finale: the head turning slowly right round to look at you, two eyes
// dug deep and burning, upside down at the last. The last frame holds.
export const RUMBOLD_STARE = {
  fps: 4,
  frames: [
    alive({}),
    ...dig('stare', 3, { l: 'hang', r: 'sag' }, { glow: 3 }, { top: 'beam', after: (g) => tuckStrung(g, { hand: puppetHandL('idle'), tuck: 'd', ty: 44 }) }),
    ...[0.3, 0.8, 1.4, 2.0, 2.6, Math.PI].map((twist, i) => alive({ gouge: { kind: 'stare' }, twist, tuck: i % 2 ? 'd' : 'e' })),
    alive({ gouge: { kind: 'stare' }, twist: Math.PI, tuck: 'e' }),
  ],
};

export const RUMBOLD_ALIVE_ANIM = {
  // Wrong: the head ticks, the jaw clacks, the arms hang and snap up; and
  // now and then he raises a hand, claws a face into his own head, holds it
  // (a rictus, a smile too wide, a stare), and wipes it away.
  idle: { fps: 6, frames: [
    alive({}),
    alive({ dx: 2, tuck: 'b' }),
    alive({ dx: -2, jaw: 1, glow: 2 }),
    alive({ jaw: 3, hy: 1, tuck: 'c' }),
    alive({ l: 'snap', jaw: 1, dx: 1, tuck: 'b' }),
    alive({ l: 'up', r: 'snap', legs: 'kick', jaw: 2, glow: 2 }),
    ...aliveDig('rictus', 6),
    alive({ gouge: { kind: 'rictus' }, jaw: 1, dx: 1 }),
    alive({ gouge: { kind: 'rictus' }, jaw: 2, glow: 2, tuck: 'b' }),
    alive({ gouge: { kind: 'rictus' }, dx: -1, tuck: 'c' }),
    alive({ gouge: { kind: 'rictus' }, jaw: 1 }),
    ...aliveWipe('rictus'),
    alive({ twist: 0.3, dx: -1, hy: 2, tuck: 'c' }),
    alive({ jaw: 3, glow: 2 }),
    alive({ jaw: 0, dx: 2, tuck: 'b' }),
    ...aliveDig('smile', 5),
    alive({ gouge: { kind: 'smile' }, jaw: 0 }),
    alive({ gouge: { kind: 'smile' }, jaw: 0, hy: 1, tuck: 'b' }),
    alive({ gouge: { kind: 'smile' }, jaw: 0, dx: 1, glow: 2 }),
    alive({ gouge: { kind: 'smile' }, jaw: 0, tuck: 'c' }),
    ...aliveWipe('smile'),
    alive({ l: 'snap', jaw: 1, dx: 1, tuck: 'b' }),
    alive({ jaw: 3, hy: 1, tuck: 'c' }),
    ...aliveDig('glare', 5),
    alive({ gouge: { kind: 'glare' } }),
    alive({ gouge: { kind: 'glare' }, glow: 2 }),
    alive({ gouge: { kind: 'glare' }, tuck: 'b' }),
    ...aliveWipe('glare'),
    alive({ dx: 2, tuck: 'b' }),
  ],
  // Stop-motion: long dead stills, then a twitch or two flicked through in
  // no time; each face dug slowly, and stared out with for a long while.
  holds: [
    5, 0.4, 0.4, 3, 0.5, 2.5,
    1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 4, 0.5, 0.5, 5, 0.7, 0.7,
    0.4, 3, 0.4,
    1.5, 1.5, 1.5, 1.5, 1.5, 5, 0.5, 0.5, 4, 0.7, 0.7,
    0.4, 2,
    1.5, 1.5, 1.5, 1.5, 1.5, 6, 0.4, 3, 0.7, 0.7,
    2,
  ] },
  // Talking: his head SNAPS round on its side, the face turned straight out at
  // you, and he talks to you over his shoulder, jaw clacking, the head ticking
  // (the stage plays the snap itself, puppetStage.js).
  talk: { fps: 8, frames: [
    snap({ gouge: { kind: 'smile' }, jaw: 2 }),
    snap({ gouge: { kind: 'smile' }, jaw: 0, dx: 1 }),
    snap({ gouge: { kind: 'smile' }, jaw: 3, twist: SNAP_TWIST + 0.08 }),
    snap({ gouge: { kind: 'smile' }, jaw: 1, glow: 2 }),
    snap({ gouge: { kind: 'smile' }, jaw: 3, dx: -1, twist: SNAP_TWIST - 0.07, tuck: 'b' }),
    snap({ gouge: { kind: 'smile' }, jaw: 0 }),
  ],
  // (Jerky, never on the beat.)
  holds: [1, 0.5, 2, 0.5, 1.5, 1] },
  // A face clawed in, burning, and then he leans out to the box: his arms
  // aren't drawn (the stage reaches them over it, and the frames after this
  // are RUMBOLD_REACH).
  windup: { fps: 9, frames: [
    ...aliveDig('rictus', 4),
    reach({ ox: -2 }),
    reach({ ox: -4, dx: 1 }),
  ] },
  hurt: { fps: 12, frames: [alive({ ox: 3, oy: 1, glow: 1, gouge: { kind: 'gape' } }), alive({ ox: -2, glow: 2, gouge: { kind: 'gape' } }), alive({})] },
  // The heap Tuck dropped: dark, then a flicker in the joints, then the
  // light; the strings go taut and haul it up, and Tuck comes down off his
  // beam on them.
  intro: { fps: 5, frames: [
    SPARED_FRAMES[SPARED_FRAMES.length - 1],
    kindle(0),
    kindle(1, 2),
    kindle(2, 3),
    alive({ l: 'limp', r: 'limp', legs: 'limp', jaw: 3, twist: 0.4, hy: 2, oy: 3, tuck: 'd', ty: 14 }),
    alive({ l: 'up', r: 'snap', jaw: 1, tuck: 'a', ty: 30 }),
    alive({ l: 'snap', r: 'up', legs: 'kick', jaw: 3, dx: 1, tuck: 'c', ty: 40 }),
    alive({}),
  ] },
  stare: RUMBOLD_STARE,
  out: RUMBOLD_ALIVE_OUT,
  death: RUMBOLD_ALIVE_BREAK,
  spared: RUMBOLD_ALIVE_OUT,
  chips: ['#fff6c8', '#ffd070', '#e6c896', '#c9a06a'],
};
