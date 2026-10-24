import { defineBulletArt } from '../projectiles.js';
import { clamp, shuffleBag } from '../patternTools.js';
import { FONT as HERALD_FONT } from './heralds_echo.js';

// The Warden of the Gate's attacks. It's a colossal stone statue of the
// Hero, built by the old city to greet him, so everything it throws is part
// of itself or of the Gate it stands before: its great stone sword, the
// carved garland on its chest and its stone petals, its open hand, the
// prophecy carved into its plinth, and in the end its own falling stone and
// the Gate's.
//
// Its fight has three phases as it breaks (see `phases` in
// src/data/enemies/warden.js):
//   WELCOME    it greets you the way it was built to: the sword, the
//              garland, the open hand, and the prophecy, carved letter by
//              letter and let fall
//   JUDGEMENT  it measures you: lines scan the box with one gap your size
//              (be in it), the box fills with stone round a hero-shaped gap
//              (stand in it), its own outline shelters you from falling
//              stone (stay inside it as it shrinks), and its verdict comes
//              down in great carved letters
//   RUIN       it's coming apart: masonry falls, the Gate's doors topple
//              in, cracks race across the box, and at the last everything
//              at once
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape. `density` speeds up an attack's own clock, so
// the ones here keep `real` time (time / density) to know when to stop. The
// bullets themselves move in real time.

const WD = {
  k: '#120c1c', // outline
  w: '#c8bce8', // stone, a lit edge
  T: '#9284c0', // stone, lit
  t: '#6e60a2', // stone
  S: '#5a4890', // stone in shadow
  s: '#4a3a7a', // deep shadow
  P: '#e8b4c4', // the garland's flowers (painted, once)
  p: '#c07890',
  G: '#8ab870', // its leaves, and moss
  g: '#4f7a4a',
  Y: '#f0d890', // old gilding
  y: '#c8a050',
};
const STONE = '#6e60a2';
const STONE_LIT = '#9284c0';
const STONE_EDGE = '#c8bce8';
const STONE_DARK = '#4a3a7a';
const OUTLINE = '#120c1c';
const GOLD = '#f0d890';

// --- Its letters ---

// The Herald's Echo's blocky alphabet, and the few more the prophecy needs.
const FONT = {
  ...HERALD_FONT,
  B: ['####.', '#...#', '####.', '#...#', '####.'],
  F: ['#####', '#....', '####.', '#....', '#....'],
  K: ['#...#', '#..#.', '###..', '#..#.', '#...#'],
  P: ['####.', '#...#', '####.', '#....', '#....'],
  U: ['#...#', '#...#', '#...#', '#...#', '.###.'],
  V: ['#...#', '#...#', '#...#', '.#.#.', '..#..'],
};

// A glyph as carved stone: the letter lit, an outline round it, and a
// shadow on its lower right where it's cut deep. `size` scales it up.
function carved(glyph, size = 1) {
  const big = glyph.flatMap((row) => Array(size).fill([...row].flatMap((c) => Array(size).fill(c)).join('')));
  const w = big[0].length + 2;
  const h = big.length + 2;
  const filled = (x, y) => big[y - 1]?.[x - 1] === '#';
  const rows = [];
  for (let y = 0; y < h; y++) {
    let row = '';
    for (let x = 0; x < w; x++) {
      if (filled(x, y)) row += filled(x + 1, y) && filled(x, y + 1) ? 'w' : 'T';
      else if ([[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [-1, 1], [1, -1]].some(([dx, dy]) => filled(x + dx, y + dy))) row += 'k';
      else row += '.';
    }
    rows.push(row);
  }
  return rows;
}

for (const [char, glyph] of Object.entries(FONT)) {
  if (char === '!') continue;
  defineBulletArt(`wdLetter${char}`, { frames: [carved(glyph)], palette: WD, radius: 2.6 });
  // Crumbling (the Ruin's): the same, darker, and a chip knocked off.
  const worn = carved(glyph).map((row, y) => (y === 1 ? row.replace(/w/, 'S') : row));
  defineBulletArt(`wdWorn${char}`, { frames: [worn], palette: { ...WD, w: STONE_LIT, T: STONE }, radius: 2.4 });
  // Twice the size, for the verdict.
  defineBulletArt(`wdBig${char}`, { frames: [carved(glyph, 2)], palette: WD, hitbox: { w: 10, h: 10 } });
}
const letterArt = (char, kind = 'Letter') => `wd${kind}${char}`;

// The lines of the prophecy, the way the city carved them. Each comes down
// as a row; the spaces are where you get through.
const PROPHECY = ['WHEN THE', 'LANTERNS BURN', 'A HERO WILL', 'COME DOWN', 'WE WILL KNOW', 'YOUR FACE', 'WELCOME HOME'];
// What it decides about you.
const VERDICTS = ['NO', 'NOT HIM', 'NO NAME', 'NOBODY'];

// --- Art ---

// A stone petal from its garland, tumbling.
defineBulletArt('wdPetal', {
  frames: [['.PP.', 'PPpk', '.pk.'], ['.P..', 'PPp.', 'kpp.'], ['..P.', '.pPP', '.kp.']],
  palette: WD,
  radius: 1.5,
  frameSeconds: 0.14,
});

// A carved flower of the garland, a gold boss in its middle.
defineBulletArt('wdFlower', {
  frames: [['.kPk.', 'kPpPk', 'PpYpP', 'kPpPk', '.kpk.']],
  palette: WD,
  radius: 2.2,
});

// A carved leaf between the flowers.
defineBulletArt('wdLeaf', {
  frames: [['.kk..', 'kGGgk', '.kggk', '..kk.']],
  palette: WD,
  radius: 1.5,
  rotate: true,
});

// A chip of stone, spinning.
defineBulletArt('wdChip', {
  frames: [['.Tk', 'TtS', 'kS.']],
  palette: WD,
  radius: 1.3,
  spin: 7,
});

// Blocks of masonry, small to large, with a carved line or two (the Gate's
// and its own).
defineBulletArt('wdBlockS', {
  frames: [['kkkkkkkk', 'kwTTTTSk', 'kTttttSk', 'kTtsttSk', 'kSSSSSSk', 'kkkkkkkk']],
  palette: WD,
  hitbox: { w: 8, h: 6 },
});
defineBulletArt('wdBlockM', {
  frames: [[
    'kkkkkkkkkkkk',
    'kwTTTTTTTTSk',
    'kTttttttttSk',
    'kTtsssssttSk',
    'kTttttttttSk',
    'kTtttsstttSk',
    'kSSSSSSSSSSk',
    'kkkkkkkkkkkk',
  ]],
  palette: WD,
  hitbox: { w: 12, h: 8 },
});
defineBulletArt('wdBlockL', {
  frames: [[
    'kkkkkkkkkkkkkkkk',
    'kwTTTTTTTTTTTTSk',
    'kTttttttyttttgSk',
    'kTtttttyYytttgSk',
    'kTttttttyttttgSk',
    'kTsssssssssssssk',
    'kTtttttStttttttk',
    'kTtttttStttttttk',
    'kSSSSSSSSSSSSSSk',
    'kkkkkkkkkkkkkkkk',
  ]],
  palette: WD,
  hitbox: { w: 16, h: 10 },
});

// --- Bullets of its own ---

// THE GREAT SWORD, point down. First the column it'll come down blinks,
// then it plunges from above, sticks in the floor of the box (`onLand`
// fires once, as it hits), and draws back up. The blade hurts all the way
// along while it's moving or stuck.
function plungingSword({ x, box, warn = 0.65, speed = 280, stick = 0.45, length = 64, onLand }) {
  const floor = box.y + box.h - 1;
  return {
    x, y: box.y - 4, dmg: null, grazed: false, age: 0, tip: box.y - 4, landed: 0, rising: false,
    update(dt) {
      this.age += dt;
      if (this.age < warn) return;
      if (!this.landed) {
        this.tip = Math.min(floor, this.tip + speed * dt);
        if (this.tip >= floor) {
          this.landed = this.age;
          onLand?.(this);
        }
      } else if (this.age > this.landed + stick) {
        this.rising = true;
        this.tip -= 150 * dt;
      }
      this.y = this.tip;
    },
    isGone() { return this.rising && this.tip < box.y - 6; },
    edgeDistance(px, py) {
      if (this.age < warn) return Infinity;
      const dx = Math.max(Math.abs(px - this.x) - 3, 0);
      const dy = Math.max(this.tip - length - py, 0, py - this.tip);
      return Math.hypot(dx, dy);
    },
    draw(ctx) {
      ctx.save();
      if (this.age < warn) {
        ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.12 : 0.3;
        ctx.fillStyle = STONE_LIT;
        ctx.fillRect(Math.round(this.x) - 4, box.y, 9, box.h);
        ctx.restore();
        return;
      }
      const x = Math.round(this.x);
      const tip = Math.round(this.tip);
      const top = tip - length;
      // The blade: outline, stone, a lit edge down its left, a point.
      ctx.fillStyle = OUTLINE;
      ctx.fillRect(x - 4, top, 9, length - 3);
      ctx.fillRect(x - 3, tip - 4, 7, 3);
      ctx.fillRect(x - 1, tip - 1, 3, 2);
      ctx.fillStyle = STONE;
      ctx.fillRect(x - 3, top, 7, length - 4);
      ctx.fillRect(x - 2, tip - 4, 5, 2);
      ctx.fillRect(x, tip - 2, 1, 2);
      ctx.fillStyle = STONE_EDGE;
      ctx.fillRect(x - 2, top, 1, length - 5);
      ctx.fillStyle = STONE_DARK;
      ctx.fillRect(x + 2, top, 1, length - 5);
      ctx.fillRect(x, top, 1, length - 8);
      // The crossguard, way up at its top.
      ctx.fillStyle = OUTLINE;
      ctx.fillRect(x - 11, top - 4, 23, 5);
      ctx.fillStyle = STONE_LIT;
      ctx.fillRect(x - 10, top - 3, 21, 3);
      // Dust, where it's stuck.
      if (this.landed && !this.rising) {
        const puff = this.age - this.landed;
        ctx.globalAlpha = Math.max(0, 0.6 - puff);
        ctx.fillStyle = STONE_EDGE;
        ctx.fillRect(x - 8 - puff * 20, tip - 3, 4, 2);
        ctx.fillRect(x + 5 + puff * 20, tip - 3, 4, 2);
      }
      ctx.restore();
    },
  };
}

// Its OPEN HAND, held out in welcome: a band across the box blinks, then the
// great stone palm sweeps through it, fingers first. The whole hand hurts.
function sweepingHand({ y, box, from, warn = 0.6, speed = 150, h = 16 }) {
  const way = from === 'left' ? 1 : -1;
  const w = 34;
  const start = way > 0 ? box.x - w : box.x + box.w;
  return {
    x: start, y, dmg: null, grazed: false, age: 0,
    update(dt) {
      this.age += dt;
      if (this.age >= warn) this.x += way * speed * dt;
    },
    isGone() { return this.age > warn && (way > 0 ? this.x > box.x + box.w + 4 : this.x + w < box.x - 4); },
    edgeDistance(px, py) {
      if (this.age < warn) return Infinity;
      const dx = Math.max(this.x - px, 0, px - (this.x + w));
      const dy = Math.max(this.y - h / 2 - py, 0, py - (this.y + h / 2));
      return Math.hypot(dx, dy);
    },
    draw(ctx) {
      ctx.save();
      if (this.age < warn) {
        ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.12 : 0.3;
        ctx.fillStyle = STONE_LIT;
        ctx.fillRect(box.x, Math.round(this.y - h / 2), box.w, h);
        ctx.restore();
        return;
      }
      const x = Math.round(this.x);
      const top = Math.round(this.y - h / 2);
      // The palm (the wrist trailing), then four fingers reaching ahead,
      // and the thumb along the top.
      const palm = way > 0 ? x : x + 12;
      const fingers = way > 0 ? x + 22 : x;
      ctx.fillStyle = OUTLINE;
      ctx.fillRect(palm - 1, top - 1, 24, h + 2);
      for (let i = 0; i < 4; i++) ctx.fillRect(fingers - 1, top + 2 + i * 3, 14, 4);
      ctx.fillStyle = STONE;
      ctx.fillRect(palm, top, 22, h);
      ctx.fillStyle = STONE_LIT;
      ctx.fillRect(palm, top, 22, 2);
      ctx.fillStyle = STONE;
      for (let i = 0; i < 4; i++) ctx.fillRect(fingers + (way > 0 ? 0 : 1), top + 3 + i * 3, 12 - i, 2);
      ctx.fillStyle = STONE_EDGE;
      for (let i = 0; i < 4; i++) ctx.fillRect(fingers + (way > 0 ? 0 : 1), top + 3 + i * 3, 12 - i, 1);
      // The lines of the palm.
      ctx.fillStyle = STONE_DARK;
      ctx.fillRect(palm + 4, top + 6, 14, 1);
      ctx.fillRect(palm + 6, top + 10, 10, 1);
      ctx.restore();
    },
  };
}

// The GARLAND, swinging like a pendulum from a pin above the box: a chain
// of carved flowers and leaves, `links` of them, each `gap` apart. Only the
// flowers and leaves hurt, not the space between.
function swingingGarland({ pivot, length, swing, period, phase, Shot, links = 12, gap = 6 }) {
  const parts = Array.from({ length: links }, (_, i) => new Shot({ x: pivot.x, y: pivot.y, art: i % 2 ? 'wdLeaf' : 'wdFlower', harmless: true }));
  let fade = 0;
  return {
    x: pivot.x, y: pivot.y, dmg: null, grazed: false, age: 0, ending: false,
    update(dt) {
      this.age += dt;
      if (this.ending) fade += dt;
      const a = Math.PI / 2 + Math.sin((this.age / period) * Math.PI * 2 + phase) * swing;
      parts.forEach((part, i) => {
        const r = length - (links - 1 - i) * gap;
        part.x = pivot.x + Math.cos(a) * r;
        part.y = pivot.y + Math.sin(a) * r;
        part.angle = a + Math.PI / 2;
        part.age = this.age;
      });
      const end = parts[parts.length - 1];
      this.x = end.x;
      this.y = end.y;
    },
    isGone() { return fade > 0.3; },
    edgeDistance(px, py) {
      if (this.ending || this.age < 0.5) return Infinity;
      return Math.min(...parts.map((part) => Math.hypot(px - part.x, py - part.y) - part.r));
    },
    draw(ctx) {
      ctx.save();
      // Blinks as it's let down, fades once it's done.
      if (this.age < 0.5) ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.3 : 0.6;
      if (this.ending) ctx.globalAlpha = Math.max(0, 1 - fade / 0.3);
      for (const part of parts) part.draw(ctx);
      ctx.restore();
    },
  };
}

// A HERO-SHAPED GAP: the box fills with stone, all but a figure the shape
// it was carved to greet. First the figure shows in gold and the stone
// blinks where it's coming; then it's solid for `hold`; then it crumbles.
// The figure, in 5-pixel cells: sword up on the left, head, shoulders,
// body, legs.
const HERO_SHAPE = [
  '#.....',
  '#.....',
  '#..##.',
  '#..##.',
  '######',
  '.####.',
  '.####.',
  '.####.',
  '.#..#.',
  '.#..#.',
];
const CELL = 5;
function heroMould({ box, col, row, warn = 1.2, hold = 0.8 }) {
  const cols = box.w / CELL;
  const rows = box.h / CELL;
  const gap = (cx, cy) => HERO_SHAPE[cy - row]?.[cx - col] === '#';
  const solid = [];
  for (let cy = 0; cy < rows; cy++) for (let cx = 0; cx < cols; cx++) if (!gap(cx, cy)) solid.push({ x: box.x + cx * CELL, y: box.y + cy * CELL });
  return {
    x: box.x + (col + 3) * CELL, y: box.y + (row + 5) * CELL, dmg: null, grazed: false, age: 0,
    update(dt) { this.age += dt; },
    isGone() { return this.age > warn + hold + 0.35; },
    edgeDistance(px, py) {
      if (this.age < warn || this.age > warn + hold) return Infinity;
      // Only the cells near you matter.
      const cx = Math.floor((px - box.x) / CELL);
      const cy = Math.floor((py - box.y) / CELL);
      let best = Infinity;
      for (let y = cy - 2; y <= cy + 2; y++) {
        for (let x = cx - 2; x <= cx + 2; x++) {
          if (x < 0 || y < 0 || x >= cols || y >= rows || gap(x, y)) continue;
          const left = box.x + x * CELL;
          const top = box.y + y * CELL;
          best = Math.min(best, Math.hypot(Math.max(left - px, 0, px - (left + CELL)), Math.max(top - py, 0, py - (top + CELL))));
        }
      }
      return best;
    },
    draw(ctx) {
      ctx.save();
      if (this.age < warn) {
        // Where the stone's coming, blinking; the figure, picked out in gold.
        ctx.globalAlpha = Math.floor(this.age * 8) % 2 ? 0.1 : 0.22;
        ctx.fillStyle = STONE_LIT;
        for (const cell of solid) ctx.fillRect(cell.x, cell.y, CELL, CELL);
        ctx.globalAlpha = 0.5 + 0.3 * Math.sin(this.age * 12);
        ctx.fillStyle = GOLD;
        HERO_SHAPE.forEach((line, y) => [...line].forEach((c, x) => {
          if (c !== '#') return;
          const left = box.x + (col + x) * CELL;
          const top = box.y + (row + y) * CELL;
          if (!gap(col + x - 1, row + y)) ctx.fillRect(left, top, 1, CELL);
          if (!gap(col + x + 1, row + y)) ctx.fillRect(left + CELL - 1, top, 1, CELL);
          if (!gap(col + x, row + y - 1)) ctx.fillRect(left, top, CELL, 1);
          if (!gap(col + x, row + y + 1)) ctx.fillRect(left, top + CELL - 1, CELL, 1);
        }));
        ctx.restore();
        return;
      }
      // Solid stone, in courses, then crumbling away.
      const crumble = Math.max(0, this.age - warn - hold) / 0.35;
      ctx.globalAlpha = 1 - crumble;
      for (const cell of solid) {
        const drop = crumble * 10 * (((cell.x * 7 + cell.y * 13) % 5) / 5 + 0.5);
        ctx.fillStyle = STONE;
        ctx.fillRect(cell.x, cell.y + drop, CELL, CELL);
        ctx.fillStyle = (cell.x / CELL + cell.y / CELL) % 2 ? STONE_LIT : STONE_DARK;
        ctx.fillRect(cell.x, cell.y + drop, CELL, 1);
        ctx.fillStyle = OUTLINE;
        ctx.fillRect(cell.x + CELL - 1, cell.y + drop, 1, CELL);
      }
      ctx.restore();
    },
  };
}

// Its OWN OUTLINE: the shape of the Hero it was carved as, drawn in a
// chiselled line that hurts. Inside it, falling stone can't reach you (the
// pattern clears any that falls in). It drifts, and shrinks as it goes.
// Points are round its middle, sword up on the left.
const OUTLINE_SHAPE = [
  [-6, -30], [-2, -30], [-2, -15], [2, -18], [8, -18], [10, -12], [9, -7], [15, -5], [16, 7], [10, 7],
  [10, 26], [3, 26], [3, 13], [-2, 13], [-2, 26], [-9, 26], [-9, 7], [-15, 7], [-15, -5], [-6, -8],
];
function heroOutline({ box, start, swing = 14, period = 3.2, from = 1.15, to = 0.82, seconds = 6.4 }) {
  const middle = { x: box.x + box.w / 2, y: box.y + box.h / 2 - 2 };
  return {
    x: middle.x, y: middle.y, dmg: null, grazed: false, age: 0, scale: from,
    points: [],
    update(dt) {
      this.age += dt;
      this.scale = from + (to - from) * clamp(this.age / seconds, 0, 1);
      this.x = middle.x + Math.sin((this.age / period) * Math.PI * 2 + start) * swing;
      this.y = middle.y;
      this.points = OUTLINE_SHAPE.map(([x, y]) => ({ x: this.x + x * this.scale, y: this.y + y * this.scale }));
    },
    isGone() { return this.age > seconds + 0.5; },
    inside(px, py) {
      let hit = false;
      const pts = this.points;
      for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
        if ((pts[i].y > py) !== (pts[j].y > py) && px < ((pts[j].x - pts[i].x) * (py - pts[i].y)) / (pts[j].y - pts[i].y) + pts[i].x) hit = !hit;
      }
      return hit;
    },
    edgeDistance(px, py) {
      if (this.age < 0.6 || this.age > seconds) return Infinity;
      let best = Infinity;
      const pts = this.points;
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        const b = pts[(i + 1) % pts.length];
        const lx = b.x - a.x;
        const ly = b.y - a.y;
        const u = clamp(((px - a.x) * lx + (py - a.y) * ly) / (lx * lx + ly * ly), 0, 1);
        best = Math.min(best, Math.hypot(px - (a.x + lx * u), py - (a.y + ly * u)) - 1);
      }
      return best;
    },
    draw(ctx) {
      if (!this.points.length) return;
      ctx.save();
      if (this.age < 0.6) ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.3 : 0.7;
      if (this.age > seconds) ctx.globalAlpha = Math.max(0, 1 - (this.age - seconds) / 0.5);
      ctx.beginPath();
      this.points.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.closePath();
      ctx.fillStyle = 'rgba(240, 216, 144, 0.08)';
      ctx.fill();
      ctx.lineJoin = 'round';
      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.strokeStyle = STONE_EDGE;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    },
  };
}

// One of the GATE'S DOORS, toppling in. It stands up at one side of the
// box, its hinge at the bottom corner; first the quarter-circle it'll fall
// across blinks, then it tips over and comes down flat along the floor,
// lies there a moment, and breaks up. The whole slab hurts while it falls
// and lies.
function topplingDoor({ box, side, length = 58, thick = 9, warn = 0.8, seconds = 0.55, lie = 0.5, onLand }) {
  // Which side of its hinge line the slab's thickness is on (so it lands
  // lying on the floor, not under it).
  const across = side === 'left' ? -1 : 1;
  const pivot = { x: side === 'left' ? box.x : box.x + box.w, y: box.y + box.h };
  // Angles: standing straight up, then flat along the floor into the box.
  const up = -Math.PI / 2;
  const down = side === 'left' ? 0 : -Math.PI;
  return {
    x: pivot.x, y: pivot.y, dmg: null, grazed: false, age: 0, landed: false,
    angle() {
      const t = clamp((this.age - warn) / seconds, 0, 1);
      // Slow to start, then crashing down.
      return up + (down - up) * t * t;
    },
    update(dt) {
      this.age += dt;
      if (!this.landed && this.age >= warn + seconds) {
        this.landed = true;
        onLand?.(this);
      }
    },
    isGone() { return this.age > warn + seconds + lie + 0.3; },
    // The slab is a thick line from the hinge out to `length`, `thick` wide,
    // lying on the inside of the swing.
    edgeDistance(px, py) {
      if (this.age < warn || this.age > warn + seconds + lie) return Infinity;
      const a = this.angle();
      const dx = Math.cos(a);
      const dy = Math.sin(a);
      // The middle line of the slab: off the hinge line by half its
      // thickness, on the side that ends up on top.
      const ox = pivot.x - Math.sin(a) * across * (thick / 2);
      const oy = pivot.y + Math.cos(a) * across * (thick / 2);
      const along = clamp((px - ox) * dx + (py - oy) * dy, 0, length);
      return Math.hypot(px - (ox + dx * along), py - (oy + dy * along)) - thick / 2;
    },
    draw(ctx) {
      ctx.save();
      if (this.age < warn) {
        ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.1 : 0.25;
        ctx.fillStyle = STONE_LIT;
        ctx.beginPath();
        ctx.moveTo(pivot.x, pivot.y);
        ctx.arc(pivot.x, pivot.y, length, Math.min(up, down), Math.max(up, down));
        ctx.closePath();
        ctx.fill();
        // The door itself, standing, just showing at the edge.
        ctx.globalAlpha = 0.8;
      }
      const a = this.age < warn ? up : this.angle();
      const fade = this.age > warn + seconds + lie ? Math.max(0, 1 - (this.age - warn - seconds - lie) / 0.3) : 1;
      ctx.globalAlpha *= fade;
      ctx.translate(pivot.x, pivot.y);
      ctx.rotate(a);
      // Drawn lying along +x, its thickness to the side that ends up on top.
      const y0 = across < 0 ? -thick : 0;
      ctx.fillStyle = OUTLINE;
      ctx.fillRect(0, y0 - 1, length + 1, thick + 2);
      ctx.fillStyle = STONE;
      ctx.fillRect(0, y0, length, thick);
      ctx.fillStyle = STONE_LIT;
      ctx.fillRect(0, y0, length, 1);
      // Its carved panels: the figure walking toward the light, worn down
      // to a line of panels and a sun at the top.
      ctx.fillStyle = STONE_DARK;
      for (let x = 4; x < length - 6; x += 12) ctx.fillRect(x, y0 + 2, 9, thick - 4);
      ctx.fillStyle = GOLD;
      ctx.fillRect(length - 5, y0 + Math.floor(thick / 2) - 1, 2, 2);
      ctx.restore();
    },
  };
}

// A CRACK racing across the box: a line from `from`, in `steps` jagged
// legs, each one starting as the last one ends, a hairline first, then
// splitting open. It forks once on the way. Each leg is a Line.
function racingCrack(bullets, Line, rand, { from, angle, legs = 5, leg = 18, delay = 0, warn = 0.45 }) {
  let at = { ...from };
  let a = angle;
  let when = delay;
  const joints = [];
  for (let i = 0; i < legs; i++) {
    a += rand(-0.6, 0.6);
    const length = leg * rand(0.8, 1.2);
    bullets.push(new Line({
      x: at.x, y: at.y, angle: a, length, thickness: 3, warn: warn + when, life: 0.7, grow: 220,
      color: STONE_EDGE, glow: STONE_LIT,
    }));
    when += length / 220;
    at = { x: at.x + Math.cos(a) * length, y: at.y + Math.sin(a) * length };
    joints.push({ ...at, when: warn + when });
    // A fork, off the middle of it.
    if (i === Math.floor(legs / 2)) {
      const fork = a + (Math.random() < 0.5 ? -1 : 1) * rand(0.7, 1.1);
      bullets.push(new Line({
        x: at.x, y: at.y, angle: fork, length: leg * 1.3, thickness: 2, warn: warn + when, life: 0.6, grow: 200,
        color: STONE_EDGE, glow: STONE_LIT,
      }));
    }
  }
  return joints;
}

// A burst of chips off something landing: they fly up and out, and fall.
function chips(bullets, Shot, rand, { x, y, count = 4, spread = 60, up = 60 }) {
  for (let i = 0; i < count; i++) {
    const vx = (i / Math.max(1, count - 1) - 0.5) * 2 * spread + rand(-10, 10);
    bullets.push(new Shot({ x, y, vx, vy: -up * rand(0.6, 1.1), gravity: 160, art: 'wdChip', life: 1.4 }));
  }
}

// Letters laid along a row, starting at x, each `gap` apart. Spaces make no
// bullet. Returns the shots, left to right.
function carve(Shot, text, x, y, gap, extra = {}, kind = 'Letter') {
  const shots = [];
  [...text].forEach((char, i) => {
    if (char === ' ' || !FONT[char]) return;
    shots.push(new Shot({ x: x + i * gap, y, art: letterArt(char, kind), ...extra }));
  });
  return shots;
}

// Lets a carved row fall, one letter after another, left to right (the
// way it's read). Each letter blinks where it is, then drops.
function letFall(shots, { start = 0.7, step = 0.09, speed = 30, gravity = 110 }) {
  shots.forEach((shot, i) => {
    shot.warn = start + i * step;
    shot.vy = speed;
    shot.gravity = gravity;
  });
  return shots;
}

export const WARDEN_ATTACKS = {
  // --- WELCOME ---

  // THE SWORD RAISED IN WELCOME, brought down. Its great stone sword
  // plunges point-first into the box down the column you're in (it blinks
  // first: step aside), sticks in the floor, and sends chips skidding out
  // both ways along it. Then again, and in pairs.
  wardenSword(box, density, { Shot, every, rand }) {
    let real = 0;
    let count = 0;
    const land = (bullets) => (sword) => {
      chips(bullets, Shot, rand, { x: sword.x, y: box.y + box.h - 3, count: 4, spread: 55, up: 50 });
    };
    const plunge = every(1.2, 1.35, (bullets, soul) => {
      count++;
      const x = clamp(soul.x + rand(-4, 4), box.x + 6, box.x + box.w - 6);
      bullets.push(plungingSword({ x, box, onLand: land(bullets) }));
      // Every third, a second blade a little apart: get between, or out.
      if (count % 3 === 0) {
        const other = x < box.x + box.w / 2 ? x + rand(26, 34) : x - rand(26, 34);
        bullets.push(plungingSword({ x: clamp(other, box.x + 6, box.x + box.w - 6), box, warn: 0.85, onLand: land(bullets) }));
      }
    }, { first: 0.15 });
    // Stone petals, shaken off the garland every time it moves.
    const petals = every(0.3, 0.42, (bullets) => {
      bullets.push(new Shot({ x: rand(box.x + 4, box.x + box.w - 4), y: box.y - 2, vx: rand(-12, 12), vy: rand(26, 36), art: 'wdPetal' }));
    }, { first: 0.6 });
    return {
      duration: 7.5,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (real > 6.3) return;
        plunge(dt, bullets, soul);
        petals(dt, bullets);
      },
    };
  },

  // THE GARLAND. The carved garland off its chest comes down into the box
  // in two long strands, swinging like bells from pins above it, one
  // against the other. Keep out from under them, or time it. Stone petals
  // shake off them as they go.
  wardenGarland(box, density, { Shot, every, rand }) {
    let real = 0;
    let strands = [];
    const left = Math.random() < 0.5;
    const hang = (bullets) => {
      strands = [
        swingingGarland({ pivot: { x: box.x + box.w * 0.3, y: box.y - 26 }, length: 100, swing: 0.62, period: 2.3, phase: left ? 0 : Math.PI, Shot, links: 15 }),
        swingingGarland({ pivot: { x: box.x + box.w * 0.7, y: box.y - 26 }, length: 84, swing: 0.7, period: 2.3, phase: left ? Math.PI : 0, Shot, links: 12 }),
      ];
      bullets.push(...strands);
    };
    const petals = every(0.22, 0.32, (bullets) => {
      const strand = strands[Math.floor(rand(0, strands.length))];
      if (!strand || strand.ending) return;
      bullets.push(new Shot({ x: strand.x, y: strand.y, vx: rand(-20, 20), vy: rand(20, 34), art: 'wdPetal', gravity: 20 }));
    }, { first: 0.8 });
    return {
      duration: 7.2,
      update: (dt, bullets) => {
        real += dt / density;
        if (!strands.length) hang(bullets);
        if (real > 6.6) {
          for (const strand of strands) strand.ending = true;
          return;
        }
        petals(dt, bullets);
      },
    };
  },

  // THE PROPHECY, carved on its plinth: it reads it out to you, and each
  // line is carved across the top of the box, letter by letter, then let
  // fall in the order it's read. The spaces between the words, and the
  // ends of the shorter lines, are where you get through.
  wardenProphecy(box, density, { Shot, every, rand }) {
    let real = 0;
    let line = Math.floor(rand(0, PROPHECY.length));
    const gap = 6;
    const row = every(1.25, 1.35, (bullets) => {
      const text = PROPHECY[line++ % PROPHECY.length];
      const width = (text.length - 1) * gap;
      const start = box.x + 4 + rand(0, Math.max(0, box.w - 8 - width));
      bullets.push(...letFall(carve(Shot, text, start, box.y + 4, gap), { start: 0.6, step: 0.07, speed: 34, gravity: 90 }));
    }, { first: 0.1 });
    return {
      duration: 7.4,
      update: (dt, bullets) => {
        real += dt / density;
        if (real < 6) row(dt, bullets);
      },
    };
  },

  // THE OPEN HAND. It holds out its great stone hand to welcome you in, and
  // the palm sweeps across the box at your height (the band blinks first:
  // get above it or below it), from one side, then the other. Each pass
  // knocks a few petals loose from its sleeve.
  wardenHand(box, density, { Shot, every, rand }) {
    let real = 0;
    let from = Math.random() < 0.5 ? 'left' : 'right';
    const sweep = every(1.05, 1.2, (bullets, soul) => {
      from = from === 'left' ? 'right' : 'left';
      const y = clamp(soul.y + rand(-3, 3), box.y + 9, box.y + box.h - 9);
      bullets.push(sweepingHand({ y, box, from }));
      for (let i = 0; i < 3; i++) {
        bullets.push(new Shot({
          x: from === 'left' ? box.x + 3 : box.x + box.w - 3, y: y + rand(-6, 6),
          vx: (from === 'left' ? 1 : -1) * rand(36, 50), vy: rand(-18, 18), warn: 0.6 + i * 0.12, art: 'wdPetal',
        }));
      }
    }, { first: 0.15 });
    return {
      duration: 7.2,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (real < 6.2) sweep(dt, bullets, soul);
      },
    };
  },

  // --- JUDGEMENT ---

  // MEASURED. It measures you: a carved rule scans down the box, then
  // across it, then down again, faster each time, and each has one notch
  // in it the width of the Hero. Be in the notch when it passes. It
  // dashes where it'll be first.
  wardenMeasure(box, density, { Line, every, rand }) {
    let real = 0;
    let scans = 0;
    const rule = (bullets, soul) => {
      const across = scans % 2 === 1;
      const speed = 48 + scans * 3;
      scans++;
      const notch = 14;
      // The notch, near where you are (it measures YOU), but not on you.
      const span = across ? box.h : box.w;
      const you = across ? soul.y - box.y : soul.x - box.x;
      const at = clamp(you + rand(-24, 24), notch / 2 + 4, span - notch / 2 - 4);
      const pieces = [[0, at - notch / 2], [at + notch / 2, span]];
      const life = (across ? box.w : box.h) / speed + 0.1;
      // It starts outside the box, so its blinking warning slides in ahead of it
      // and it's solid as it crosses the edge (about: the attack's speed
      // scales it a little).
      const back = 0.45 * speed * 1.2;
      for (const [a, b] of pieces) {
        if (b - a < 1) continue;
        bullets.push(new Line(across
          ? { x: box.x - back, y: box.y + a, angle: Math.PI / 2, length: b - a, vx: speed, warn: 0.45, life, thickness: 3, color: GOLD, glow: '#c8a050' }
          : { x: box.x + a, y: box.y - back, angle: 0, length: b - a, vy: speed, warn: 0.45, life, thickness: 3, color: GOLD, glow: '#c8a050' }));
      }
    };
    const scan = every(1.3, 1.4, rule, { first: 0.1 });
    return {
      duration: 7.2,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (real < 5.6) scan(dt, bullets, soul);
      },
    };
  },

  // THE HERO-SHAPED GAP. The box fills with stone, all but a figure the
  // shape of the Hero (sword up, head, shoulders, legs), picked out in gold
  // first: get in it before the stone comes down. Then it crumbles, and
  // the next figure is somewhere else. Chips skitter in through the gap's
  // edges between times.
  wardenMould(box, density, { Shot, every, rand }) {
    let real = 0;
    let last = -1;
    const cols = box.w / CELL;
    const rows = box.h / CELL;
    // One figure at a time (two at once would leave nowhere to stand), so
    // these go by the clock, not the attack's speed.
    let nextAt = 0.1;
    const place = (bullets, soul) => {
      // Somewhere you'll have to move to, but can reach.
      let col;
      let row;
      for (let tries = 0; tries < 10; tries++) {
        col = Math.floor(rand(1, cols - HERO_SHAPE[0].length - 1));
        row = Math.floor(rand(1, rows - HERO_SHAPE.length - 1));
        const mx = box.x + (col + 3) * CELL;
        const my = box.y + (row + 5) * CELL;
        const far = Math.hypot(mx - soul.x, my - soul.y);
        if (far > 16 && far < 48 && col !== last) break;
      }
      last = col;
      bullets.push(heroMould({ box, col, row, warn: 1.1, hold: 0.75 }));
    };
    const skitter = every(0.55, 0.7, (bullets, soul) => {
      const fromLeft = Math.random() < 0.5;
      bullets.push(new Shot({
        x: fromLeft ? box.x - 2 : box.x + box.w + 2, y: clamp(soul.y + rand(-20, 20), box.y + 4, box.y + box.h - 4),
        vx: fromLeft ? 48 : -48, vy: 0, art: 'wdChip', warn: 0.2,
      }));
    }, { first: 1.6 });
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (real >= nextAt && real < 4.5) {
          nextAt += 2.05;
          place(bullets, soul);
        }
        if (real < 6.2) skitter(dt, bullets, soul);
      },
    };
  },

  // COMPARED. It holds you up against its own shape: the outline of the
  // Hero it was carved as, chiselled into the box. Stone falls everywhere
  // but inside it, so stay in, without touching its edge, as it drifts
  // side to side, and shrinks. (You don't fit. Try anyway.)
  wardenCompare(box, density, { Shot, every, rand }) {
    let real = 0;
    let shape = null;
    const rain = every(0.075, 0.1, (bullets) => {
      const x = rand(box.x + 2, box.x + box.w - 2);
      if (shape?.inside(x, box.y + 2)) return;
      const chip = new Shot({ x, y: box.y - 2, vy: rand(50, 62), art: Math.random() < 0.3 ? 'wdPetal' : 'wdChip' });
      // Anything falling into the outline is gone: it's the Hero's place.
      const move = chip.update.bind(chip);
      chip.update = (step, area) => {
        move(step, area);
        if (shape && shape.age < shape.seconds && shape.inside(chip.x, chip.y)) chip.spent = true;
      };
      bullets.push(chip);
    }, { first: 0.9 });
    return {
      duration: 7.4,
      update: (dt, bullets) => {
        real += dt / density;
        if (!shape) {
          shape = heroOutline({ box, start: Math.random() < 0.5 ? 0 : Math.PI });
          shape.seconds = 6.4;
          bullets.push(shape);
        }
        if (real < 6.2) rain(dt, bullets);
      },
    };
  },

  // THE VERDICT. It tells you what it's decided, in great carved letters
  // (NO. NOT HIM. NO NAME. NOBODY.): each word blinks across the top of
  // the box, then its letters slam down one after another and burst into
  // chips along the floor. Get between them.
  wardenVerdict(box, density, { Shot, every, rand }) {
    let real = 0;
    let word = 0;
    const falling = [];
    const say = every(1.6, 1.75, (bullets) => {
      const text = VERDICTS[word++ % VERDICTS.length];
      const gap = 11;
      const width = (text.length - 1) * gap;
      const start = box.x + 7 + rand(0, Math.max(0, box.w - 14 - width));
      const shots = carve(Shot, text, start, box.y + 7, gap, {}, 'Big');
      letFall(shots, { start: 0.7, step: 0.16, speed: 60, gravity: 260 });
      bullets.push(...shots);
      falling.push(...shots);
    }, { first: 0.1 });
    return {
      duration: 7.4,
      update: (dt, bullets) => {
        real += dt / density;
        if (real < 6.3) say(dt, bullets);
        // A letter that hits the floor breaks.
        for (const letter of falling) {
          if (letter.spent || letter.y < box.y + box.h - 6) continue;
          letter.spent = true;
          chips(bullets, Shot, rand, { x: letter.x, y: box.y + box.h - 4, count: 3, spread: 50, up: 40 });
        }
        for (let i = falling.length - 1; i >= 0; i--) if (falling[i].spent) falling.splice(i, 1);
      },
    };
  },

  // --- RUIN ---

  // FALLING MASONRY. It's coming apart: blocks of it, small and great, shake
  // loose from above (they blink at the top of the box first), fall, and
  // break into chips where they land.
  wardenMasonry(box, density, { Shot, every, rand, spreadAcross }) {
    let real = 0;
    const falling = [];
    const nextX = spreadAcross(box.x + 8, box.x + box.w - 8, 5);
    const drop = every(0.42, 0.55, (bullets, soul) => {
      const size = Math.random();
      const art = size < 0.45 ? 'wdBlockS' : size < 0.85 ? 'wdBlockM' : 'wdBlockL';
      // Now and then one right over you.
      const x = Math.random() < 0.3 ? clamp(soul.x, box.x + 8, box.x + box.w - 8) : nextX();
      const block = new Shot({ x, y: box.y + 4, vy: 10, gravity: 190, warn: 0.5, art });
      bullets.push(block);
      falling.push(block);
    }, { first: 0.1 });
    return {
      duration: 7.4,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (real < 6.4) drop(dt, bullets, soul);
        for (const block of falling) {
          if (block.spent || block.y < box.y + box.h - 5) continue;
          block.spent = true;
          chips(bullets, Shot, rand, { x: block.x, y: box.y + box.h - 4, count: block.artName === 'wdBlockL' ? 5 : 3, spread: 45, up: 55 });
        }
        for (let i = falling.length - 1; i >= 0; i--) if (falling[i].spent) falling.splice(i, 1);
      },
    };
  },

  // THE GATE COMES DOWN. The Gate's great doors topple in, one from each
  // side, hinged at the floor's corners: the quarter of the box each will
  // fall across blinks first (be further off than it's tall), then it
  // crashes down flat and breaks up. Between doors, stones of the arch
  // fall in the middle.
  wardenGate(box, density, { Shot, every, rand }) {
    let real = 0;
    const side = shuffleBag(['left', 'right']);
    let count = 0;
    const land = (bullets) => (door) => {
      for (let i = 0; i < 3; i++) chips(bullets, Shot, rand, { x: door.x + (door.x < box.x + box.w / 2 ? 1 : -1) * (12 + i * 18), y: box.y + box.h - 5, count: 2, spread: 30, up: 50 });
    };
    const topple = every(1.7, 1.85, (bullets) => {
      count++;
      if (count % 3 === 0) {
        // Both at once, shorter: the middle top is the only safe place.
        bullets.push(topplingDoor({ box, side: 'left', length: 46, onLand: land(bullets) }));
        bullets.push(topplingDoor({ box, side: 'right', length: 46, onLand: land(bullets) }));
      } else {
        bullets.push(topplingDoor({ box, side: side(), length: 60, onLand: land(bullets) }));
      }
    }, { first: 0.1 });
    const arch = every(0.7, 0.85, (bullets) => {
      bullets.push(new Shot({ x: rand(box.x + 24, box.x + box.w - 24), y: box.y + 4, vy: 10, gravity: 170, warn: 0.45, art: 'wdBlockS' }));
    }, { first: 1.0 });
    return {
      duration: 7.6,
      update: (dt, bullets) => {
        real += dt / density;
        if (real < 6.2) topple(dt, bullets);
        if (real < 6.4) arch(dt, bullets);
      },
    };
  },

  // CRACKS. Cracks race across the box from its edges, splitting as they
  // go: each shows as a hairline first, then splits open behind its tip.
  // Where a crack turns, a chip jumps out of it.
  wardenCracks(box, density, { Shot, Line, every, rand, edgePoint }) {
    let real = 0;
    let joints = [];
    let t = 0;
    const sides = shuffleBag(['top', 'left', 'right', 'bottom']);
    const crack = every(0.8, 0.95, (bullets, soul) => {
      const start = edgePoint(box, sides(), -1);
      const angle = Math.atan2(soul.y - start.y, soul.x - start.x) + rand(-0.35, 0.35);
      const found = racingCrack(bullets, Line, rand, { from: start, angle, legs: 5, leg: 17 });
      joints.push(...found.map((joint) => ({ ...joint, when: t + joint.when * density })));
    }, { first: 0.1 });
    return {
      duration: 7.4,
      update: (dt, bullets, soul) => {
        t += dt;
        real += dt / density;
        if (real < 6.2) crack(dt, bullets, soul);
        for (const joint of joints) {
          if (t < joint.when) continue;
          joint.done = true;
          if (joint.x < box.x || joint.x > box.x + box.w || joint.y < box.y || joint.y > box.y + box.h) continue;
          if (Math.hypot(joint.x - soul.x, joint.y - soul.y) < 10) continue;
          const a = rand(0, Math.PI * 2);
          bullets.push(new Shot({ x: joint.x, y: joint.y, vx: Math.cos(a) * 34, vy: Math.sin(a) * 34, art: 'wdChip', life: 1.6 }));
        }
        joints = joints.filter((joint) => !joint.done);
      },
    };
  },

  // THE LAST WELCOME. Everything it has left, at once, each thinned so
  // there's always a way: the snapped blade still comes down, the stone
  // falls, cracks run, and the prophecy, worn now, falls apart a line at
  // a time.
  wardenLastWelcome(box, density, { Shot, Line, every, rand, edgePoint }) {
    let real = 0;
    let line = Math.floor(rand(0, PROPHECY.length));
    const falling = [];
    const land = (bullets) => (sword) => chips(bullets, Shot, rand, { x: sword.x, y: box.y + box.h - 3, count: 3, spread: 50, up: 45 });
    const plunge = every(2.0, 2.2, (bullets, soul) => {
      bullets.push(plungingSword({ x: clamp(soul.x, box.x + 6, box.x + box.w - 6), box, length: 34, onLand: land(bullets) }));
    }, { first: 0.2 });
    const words = every(2.1, 2.3, (bullets) => {
      const text = PROPHECY[line++ % PROPHECY.length];
      const width = (text.length - 1) * 6;
      const start = box.x + 4 + rand(0, Math.max(0, box.w - 8 - width));
      bullets.push(...letFall(carve(Shot, text, start, box.y + 4, 6, {}, 'Worn'), { start: 0.6, step: 0.06, speed: 30, gravity: 100 }));
    }, { first: 1.0 });
    const drop = every(0.9, 1.05, (bullets) => {
      const block = new Shot({ x: rand(box.x + 8, box.x + box.w - 8), y: box.y + 4, vy: 10, gravity: 180, warn: 0.5, art: Math.random() < 0.6 ? 'wdBlockS' : 'wdBlockM' });
      bullets.push(block);
      falling.push(block);
    }, { first: 0.6 });
    const crack = every(2.4, 2.6, (bullets, soul) => {
      const start = edgePoint(box, Math.random() < 0.5 ? 'left' : 'right', -1);
      racingCrack(bullets, Line, rand, { from: start, angle: Math.atan2(soul.y - start.y, soul.x - start.x), legs: 4, leg: 17 });
    }, { first: 1.6 });
    return {
      duration: 8.4,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (real < 7.4) {
          plunge(dt, bullets, soul);
          words(dt, bullets);
          drop(dt, bullets);
          crack(dt, bullets, soul);
        }
        for (const block of falling) {
          if (block.spent || block.y < box.y + box.h - 5) continue;
          block.spent = true;
          chips(bullets, Shot, rand, { x: block.x, y: box.y + box.h - 4, count: 3, spread: 40, up: 50 });
        }
        for (let i = falling.length - 1; i >= 0; i--) if (falling[i].spent) falling.splice(i, 1);
      },
    };
  },
};
