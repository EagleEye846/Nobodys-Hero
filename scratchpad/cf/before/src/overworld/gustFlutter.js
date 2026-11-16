import { HERO_ANIMATIONS, heroFrame } from '../characters/hero.js';
import { memberFrames, hurtState } from '../characters/party.js';
import { PLAYER_PALETTE } from '../data/art/player.js';
import { VES_PALETTE } from '../data/art/vesper.js';
import { BRAMBLE_PALETTE } from '../data/art/bramble.js';

// The party in the storm wind (chapter 5's coast). When a gust comes through
// (atmosphere.gust, see windGust in atmosphere.js), the hero's scarf streams
// out and his hair lifts, Ves's umbrella is leaned into the wind and jerks
// back, her coat hem flaps, and Bramble's hair and shirt tails blow.
//
// Nothing is redrawn: each walking, running or standing frame gets a few
// variants made from it the first time they're needed (a pixel or two of
// scarf or hem pushed out past the outline on the downwind side, the
// umbrella's top rows slid over), and the frame is swapped for one while the
// gust blows. Any other frame (carrying Ves, hanging off her hand, crawling,
// sitting, a scene's own animation) isn't known here and is drawn as it is,
// so nothing flaps where it would look wrong.
//
// OverworldScene sets the gust each frame (setGust): only outdoors with rain
// falling, so never indoors, nor once the storm has lifted (calmAfter sets
// the rain to 0). Debug: tools/preview.html ?gust=0.8 holds a gust.

// The wind blows toward the left of the screen (the way the rain is pushed).
const WIND = -1;
// Variants are this much wider each side, so a flap can stick out.
const PAD = 4;

const rgb = (hex) => parseInt(hex.slice(1), 16);
const OUTLINE = rgb('#120c1c');

// What blows on each of them: `rows` to look in, the colours it's made of,
// which end of those rows to start from, and how many pixels each row in turn
// sticks out, per level (1 a breeze, 2 a strong gust) and phase (A, B).
const RIGS = {
  hero: [
    // The scarf at his neck streams out downwind, longer and shorter.
    { rows: [9, 10], colours: [PLAYER_PALETTE.f], from: 'top', lengths: { 1: [[1], [2]], 2: [[3], [4]] } },
    // In a strong gust the top of his hair is swept over.
    { spikes: [0, 1], colours: [PLAYER_PALETTE.h], shifts: { 2: [[-1, 0], [-1, -1]] } },
  ],
  vesper: [
    // Her umbrella's held into the wind (its top slid upwind), and in a strong
    // gust it jerks back the other way.
    { shear: [0, 5], shifts: { 1: [[1, 1, 0, 0, 0, 0], [1, 1, 1, 0, 0, 0]], 2: [[2, 2, 1, 1, 0, 0], [-1, -1, 0, 0, 0, 0]] } },
    // Her coat hem flaps.
    { rows: [17, 21], colours: [VES_PALETTE.G, VES_PALETTE.J], from: 'bottom', lengths: { 1: [[1], [0, 1]], 2: [[2, 1], [1, 2]] } },
  ],
  bramble: [
    // The spikes of his hair (they won't lie flat anyway) bent over.
    { spikes: [1, 3], colours: [BRAMBLE_PALETTE['+'], BRAMBLE_PALETTE['-'], BRAMBLE_PALETTE['/']], shifts: { 1: [[0, 0, 0], [-1, 0, 0]], 2: [[-1, -1, 0], [-1, 0, 0]] } },
    // The flannel tails hanging past his hips.
    { rows: [12, 18], colours: [BRAMBLE_PALETTE['3'], BRAMBLE_PALETTE.U, BRAMBLE_PALETTE.Z], from: 'bottom', lengths: { 1: [[1], [0, 1]], 2: [[2, 1], [1, 2]] } },
  ],
};

// Which frames are whose (filled in lazily), and the variants made so far.
const owner = new WeakMap();
const variants = new WeakMap();
const known = new WeakSet();
let heroDone = false;

function learnHero() {
  heroDone = true;
  for (const [facing, frames] of Object.entries(HERO_ANIMATIONS)) {
    for (const frame of frames) owner.set(frame, 'hero');
    // The run frames (four to a cycle, 0.09 s each).
    for (let i = 0; i < 4; i++) owner.set(heroFrame(facing, true, false, i * 0.09 + 0.01, true), 'hero');
  }
}

function learnMember(id) {
  if (hurtState(id)?.frames) return;
  const set = memberFrames(id);
  if (!set || known.has(set)) return;
  known.add(set);
  // (Only the standing, walking and running ones: not floating up a geyser and the like.)
  for (const [name, frame] of Object.entries(set)) if (/(Idle|Step|Stride|Pass)$/.test(name)) owner.set(frame, id);
}

// The gust now (0 to 1) and the scene's clock, set by OverworldScene.
let gust = 0;
let clock = 0;
let forced = null;
let forcedPhase = null;
// `open`: out under the storm (raining, not indoors); otherwise nothing blows.
export function setGust(k, t, open = true) {
  gust = open ? forced ?? k : 0;
  clock = t;
}
// tools/preview.html ?gust=: hold a gust of this strength for stills (and,
// with `phase` 0 or 1, that phase of the flap).
export function forceGust(k, phase = null) {
  forced = k;
  forcedPhase = phase;
}

// The frame to draw in place of `frame` now: a blown variant during a gust,
// or `frame` itself. `seed` puts each of them a little out of step.
export function gustFrame(frame, seed = 0) {
  if (gust < 0.22 || !frame) return frame;
  if (!heroDone) learnHero();
  let who = owner.get(frame);
  if (!who) {
    learnMember('vesper');
    learnMember('bramble');
    who = owner.get(frame);
    if (!who) return frame;
  }
  const level = gust < 0.55 ? 1 : 2;
  const phase = forcedPhase ?? Math.floor((clock + seed * 0.37) * (level === 2 ? 8 : 5)) % 2;
  let made = variants.get(frame);
  if (!made) variants.set(frame, (made = {}));
  const key = level * 2 + phase;
  return (made[key] ??= makeVariant(frame, RIGS[who], level, phase));
}

function makeVariant(frame, rig, level, phase) {
  const w = frame.width + PAD * 2;
  const h = frame.height;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  // Worked on as if the wind blew left; mirrored for a wind blowing right.
  if (WIND > 0) {
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(frame, PAD, 0);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const image = ctx.getImageData(0, 0, w, h);
  const px = new Uint32Array(w * h);
  const d = image.data;
  for (let i = 0; i < px.length; i++) px[i] = d[i * 4 + 3] > 0 ? ((d[i * 4] << 16) | (d[i * 4 + 1] << 8) | d[i * 4 + 2]) + 1 : 0;
  for (const part of rig) {
    if (part.shear) shear(px, w, part, part.shifts[level]?.[phase]);
    else if (part.spikes) spikes(px, w, h, part, part.shifts[level]?.[phase]);
    else flap(px, w, h, part, part.lengths[level]?.[phase]);
  }
  for (let i = 0; i < px.length; i++) {
    const c = px[i];
    d[i * 4 + 3] = c ? 255 : 0;
    if (c) {
      d[i * 4] = ((c - 1) >> 16) & 255;
      d[i * 4 + 1] = ((c - 1) >> 8) & 255;
      d[i * 4 + 2] = (c - 1) & 255;
    }
  }
  if (WIND > 0) {
    // Back the right way round.
    const flipped = document.createElement('canvas');
    flipped.width = w;
    flipped.height = h;
    const f = flipped.getContext('2d');
    f.putImageData(image, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(flipped, 0, 0);
    return canvas;
  }
  ctx.putImageData(image, 0, 0);
  return canvas;
}

// Slides whole rows over (positive is upwind, to the right here).
function shear(px, w, part, shifts) {
  if (!shifts) return;
  const [top] = part.shear;
  shifts.forEach((s, i) => {
    if (!s) return;
    const y = top + i;
    const row = px.slice(y * w, (y + 1) * w);
    for (let x = 0; x < w; x++) {
      const from = x - s;
      px[y * w + x] = from >= 0 && from < w ? row[from] : 0;
    }
  });
}

// Slides the top of some hair over (negative is downwind, to the left here).
// Only the hair and its own outline move: anything else (Bramble's hatchet)
// and the outline round it stay put and are never drawn over. Where a slid
// row leaves hair below it uncovered, an outline closes it.
function spikes(px, w, h, part, shifts) {
  if (!shifts) return;
  const colours = part.colours.map((c) => rgb(c) + 1);
  const [top, bottom] = part.spikes;
  const hair = (c) => colours.includes(c);
  const fixed = (c) => c && c !== OUTLINE + 1 && !hair(c);
  // How far across the hair goes, in these rows and the few below.
  let from = w;
  let to = -1;
  for (let y = top; y <= Math.min(h - 1, bottom + 3); y++) {
    for (let x = 0; x < w; x++) {
      if (!hair(px[y * w + x])) continue;
      from = Math.min(from, x);
      to = Math.max(to, x);
    }
  }
  if (to < 0) return;
  from = Math.max(0, from - 1);
  to = Math.min(w - 1, to + 1);
  const at = (x, y) => (x >= 0 && x < w && y >= 0 && y < h ? px[y * w + x] : 0);
  shifts.forEach((s, i) => {
    if (!s) return;
    const y = top + i;
    const row = px.slice(y * w, (y + 1) * w);
    const moves = (x) => {
      const c = row[x];
      if (hair(c)) return true;
      if (c !== OUTLINE + 1) return false;
      return ![at(x - 1, y), at(x + 1, y), at(x, y - 1), at(x, y + 1)].some(fixed);
    };
    const moving = [];
    for (let x = from; x <= to; x++) {
      if (!moves(x)) continue;
      moving.push([x, row[x]]);
      px[y * w + x] = 0;
    }
    for (const [x, c] of moving) {
      const nx = x + s;
      if (nx < 0 || nx >= w || fixed(px[y * w + nx]) || (px[y * w + nx] === OUTLINE + 1 && !moving.some(([mx]) => mx === nx))) continue;
      px[y * w + nx] = c;
    }
    // Close the hair under any gap the slide opened.
    if (y + 1 < h) {
      for (let x = from; x <= to; x++) {
        if (!px[y * w + x] && hair(px[(y + 1) * w + x]) && row[x]) px[y * w + x] = OUTLINE + 1;
      }
    }
  });
}

// Pushes the downwind (left) edge of some rows out: the outline moves out
// `n` pixels and the cloth fills in behind it, with an outline above and
// below wherever the new pixels would otherwise show against nothing.
function flap(px, w, h, part, lengths) {
  if (!lengths) return;
  const colours = part.colours.map((c) => rgb(c) + 1);
  const [a, b] = part.rows;
  const rows = [];
  for (let y = a; y <= Math.min(b, h - 1); y++) rows.push(y);
  if (part.from === 'bottom') rows.reverse();
  // The rows whose edge is outline-then-cloth, in order from the chosen end.
  const edges = [];
  for (const y of rows) {
    let x0 = 0;
    while (x0 < w && !px[y * w + x0]) x0++;
    if (x0 >= w - 1 || px[y * w + x0] !== OUTLINE + 1) continue;
    const cloth = px[y * w + x0 + 1];
    if (!colours.includes(cloth)) continue;
    edges.push({ y, x0, cloth });
  }
  const added = [];
  edges.slice(0, lengths.length).forEach((edge, i) => {
    const { y, x0, cloth } = edge;
    const n = Math.min(lengths[i], x0);
    if (!n) return;
    px[y * w + x0 - n] = OUTLINE + 1;
    for (let x = x0 - n + 1; x <= x0; x++) px[y * w + x] = cloth;
    for (let x = x0 - n; x < x0; x++) added.push([x, y]);
  });
  for (const [x, y] of added) {
    for (const yy of [y - 1, y + 1]) if (yy >= 0 && yy < h && !px[yy * w + x]) px[yy * w + x] = OUTLINE + 1;
  }
}
