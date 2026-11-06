import { defineBulletArt } from '../projectiles.js';

// The Gleamsnail's attacks. It's a slow, proud snail whose shell is a
// cracked-open geode, so it fights with the crystals in it and the light
// that goes through them: shards ringing out of the shell, a slime trail
// (it's a snail; it can't help it), prismatic beams bent through its shell,
// the whole shell rolling about the box with the snail tucked inside, and,
// because it's house-proud, rows of tidy little crystals set out very neatly
// and then knocked over one after another.
//
// It stands to the right of the box. Each attack is a factory
// `(box, density, tools) => ({ duration, update })`; see dummy.js for the
// shape. Custom bullets here (the slime, the toppling crystals) have the same
// four methods as Shot and Line: update, isGone, edgeDistance, draw.

const SHARD = { c: '#d8b0ff', C: '#8a4ad8', w: '#f6ecff', t: '#7af0dc', u: '#2fb0a2' };
const SHELL = { r: '#8a7a90', R: '#5a4c66', T: '#b8aac0', c: '#b46af0', t: '#5fe6d4', p: '#f48cc8', w: '#f6ecff', v: '#34254f' };
const GLINT = { g: '#fff6a8', w: '#ffffff', c: '#d8b0ff' };
const SNAIL = { o: '#8fb8a8', O: '#5f8a80', e: '#ffffff', k: '#1c1426', r: '#8a7a90', R: '#5a4c66' };

// A shard of crystal, drawn pointing right.
defineBulletArt('snailShard', {
  frames: [
    ['.....ww.', 'ccccwwcc', '.CCCCCcc'],
    ['.....ww.', 'tttwwttt', '.uuuuutt'],
  ],
  palette: SHARD,
  radius: 1.8,
  rotate: true,
  frameSeconds: 0.5,
});

// A crystal budding, glinting (harmless: a shard ring follows).
defineBulletArt('snailGlint', {
  frames: [
    ['..g..', '..g..', 'ggwgg', '..g..', '..g..'],
    ['.g.g.', '..c..', '.cwc.', '..c..', '.g.g.'],
  ],
  palette: GLINT,
  radius: 1,
  frameSeconds: 0.12,
});

// The shell itself, rolled up, spinning: rock outside, a gleam of geode.
defineBulletArt('snailShell', {
  frames: [[
    '....rrrrr....',
    '..rrTTTTTrr..',
    '.rTTcctttTTr.',
    '.rTcwwtttcTr.',
    'rTTcwpppttTTr',
    'rTTcpppvvttTr',
    'rrTTppvvvtTrr',
    'rRrTTTpvTTTrr',
    '.rRRrTTTTrRr.',
    '.rRRRrrrrRRr.',
    '..rRRRRRRRr..',
    '....rrrrr....',
  ]],
  palette: SHELL,
  radius: 5.2,
  spin: 3.4,
});

// A little snail, crawling by (harmless; it's the one making the slime).
defineBulletArt('snailCrawler', {
  frames: [
    ['.....rrrr.', '....rRRrRr', 'o...rRrRrr', 'ooo.rrRrr.', '.ooooooooo', '.OOOOOOOOO'],
    ['..o..rrrr.', '..o.rRRrRr', 'oooorRrRrr', '.ooorrRrr.', '.ooooooooo', '.OOOOOOOOO'],
  ],
  palette: SNAIL,
  radius: 1,
  frameSeconds: 0.25,
});

// A patch of slime on the floor of the box. It's harmless itself, but it
// drags at you: the attack slows whoever stands in it.
class Slime {
  constructor({ x, y, w = 12, h = 7, life = 4 }) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.life = life;
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.vx = 0;
    this.vy = 0;
  }

  get sticky() {
    return this.age > 0.15 && this.age < this.life;
  }

  holds(px, py) {
    return this.sticky && Math.abs(px - this.x) < this.w / 2 && Math.abs(py - this.y) < this.h / 2 + 2;
  }

  update(dt) {
    this.age += dt;
  }

  isGone() {
    return this.age > this.life + 0.4;
  }

  edgeDistance() {
    return Infinity;
  }

  draw(ctx) {
    const fadeIn = Math.min(1, this.age / 0.25);
    const fadeOut = this.age > this.life ? Math.max(0, 1 - (this.age - this.life) / 0.4) : 1;
    ctx.save();
    ctx.globalAlpha = 0.7 * fadeIn * fadeOut;
    ctx.fillStyle = '#8fe0b8';
    ctx.beginPath();
    ctx.ellipse(this.x, this.y, this.w / 2, this.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.8 * fadeIn * fadeOut;
    ctx.fillStyle = '#d8fff0';
    ctx.fillRect(Math.round(this.x - this.w / 4), Math.round(this.y - this.h / 4), 2, 1);
    ctx.fillRect(Math.round(this.x + 1), Math.round(this.y + 1), 1, 1);
    ctx.restore();
  }
}

// One of its tidy little crystals. It stands in a neat row, harmless, with a
// glint on it; then it's knocked over (it swings down from upright to flat,
// toward `dir`, and lies there a moment). Falling and lying, it hurts.
const TIDY_COLORS = [
  ['#ecd8ff', '#b46af0', '#5a3a8a'],
  ['#c8fff4', '#5fe6d4', '#1f7a70'],
  ['#ffd8ec', '#f48cc8', '#8a3a6a'],
];
class TidyCrystal {
  constructor({ x, y, len = 14, dir = 1, fallAt, tone = 0 }) {
    this.x = x;
    this.y = y;
    this.len = len;
    this.dir = dir;
    this.fallAt = fallAt;
    this.tone = tone % TIDY_COLORS.length;
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.vx = 0;
    this.vy = 0;
    this.FALL = 0.3;
    this.LIE = 0.9;
  }

  // 0 upright, 1 lying flat.
  get lean() {
    if (this.age < this.fallAt) return 0;
    const k = Math.min(1, (this.age - this.fallAt) / this.FALL);
    return k * k;
  }

  get angle() {
    // Upright is straight up (-90 degrees); lying is flat along the floor toward `dir`.
    return -Math.PI / 2 + this.dir * this.lean * (Math.PI / 2);
  }

  update(dt) {
    this.age += dt;
  }

  isGone() {
    return this.age > this.fallAt + this.FALL + this.LIE + 0.25;
  }

  edgeDistance(px, py) {
    if (this.age < this.fallAt || this.age > this.fallAt + this.FALL + this.LIE) return Infinity;
    const a = this.angle;
    const dx = Math.cos(a);
    const dy = Math.sin(a);
    const along = Math.min(Math.max((px - this.x) * dx + (py - this.y) * dy, 0), this.len);
    return Math.hypot(px - (this.x + dx * along), py - (this.y + dy * along)) - 2;
  }

  draw(ctx) {
    const [light, mid, dark] = TIDY_COLORS[this.tone];
    const over = this.age - (this.fallAt + this.FALL + this.LIE);
    ctx.save();
    if (over > 0) ctx.globalAlpha = Math.max(0, 1 - over / 0.25);
    ctx.translate(Math.round(this.x), Math.round(this.y));
    ctx.rotate(this.angle);
    const L = this.len;
    ctx.fillStyle = dark;
    ctx.beginPath();
    ctx.moveTo(0, -2.6); ctx.lineTo(L * 0.72, -2.6); ctx.lineTo(L, 0); ctx.lineTo(L * 0.72, 2.6); ctx.lineTo(0, 2.6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = mid;
    ctx.beginPath();
    ctx.moveTo(0, -1.8); ctx.lineTo(L * 0.7, -1.8); ctx.lineTo(L * 0.92, 0); ctx.lineTo(L * 0.7, 1.8); ctx.lineTo(0, 1.8);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = light;
    ctx.fillRect(1, -1.8, L * 0.6, 1);
    ctx.restore();
    // A glint while it stands, to show how tidy it is.
    if (this.age < this.fallAt && Math.floor(this.age * 3 + this.x) % 4 === 0) {
      ctx.fillStyle = '#fffbc8';
      const gx = Math.round(this.x - 1);
      const gy = Math.round(this.y - L);
      ctx.fillRect(gx, gy - 1, 1, 3);
      ctx.fillRect(gx - 1, gy, 3, 1);
    }
  }
}

// Keeps a guess at which way you're running and how fast (px a second),
// smoothed a little. Call it once a frame with the soul; read .x and .y.
function headingTracker() {
  const heading = { x: 0, y: 0, last: null };
  heading.see = (dt, soul) => {
    if (heading.last && dt > 0) {
      heading.x += ((soul.x - heading.last.x) / dt - heading.x) * Math.min(1, dt * 8);
      heading.y += ((soul.y - heading.last.y) / dt - heading.y) * Math.min(1, dt * 8);
    }
    heading.last = { x: soul.x, y: soul.y };
  };
  return heading;
}

export const GLEAMSNAIL_ATTACKS = {
  // Shards: crystals bud out of the floor near you, glint, and ring out in a
  // burst of shards, a second ring turned half a step behind the first. Stay
  // between the rays, then step across into the next ring's gap. (The buds
  // keep a little way off you, and the second ring waits long enough for
  // that step.)
  snailShards(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let next = 0.25;
    let count = 0;
    let buds = [];
    const ring = (bullets, at, turn) => {
      for (let i = 0; i < 8; i++) {
        const a = turn + (i / 8) * Math.PI * 2;
        bullets.push(new Shot({ x: at.x, y: at.y, vx: Math.cos(a) * 48, vy: Math.sin(a) * 48, art: 'snailShard', life: 2.4 }));
      }
    };
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && count < 5 && t < 5) {
          const a = rand(0, Math.PI * 2);
          const d = rand(20, 30);
          const at = { x: clamp(soul.x + Math.cos(a) * d, box.x + 8, box.x + box.w - 8), y: clamp(soul.y + Math.sin(a) * d, box.y + 8, box.y + box.h - 8) };
          bullets.push(new Shot({ x: at.x, y: at.y, harmless: true, life: 0.8, art: 'snailGlint' }));
          buds.push({ at: t + 0.8, pos: at, turn: rand(0, Math.PI / 4), second: false });
          count++;
          next = t + 1.05;
        }
        for (const bud of buds) {
          if (t >= bud.at && !bud.fired) {
            bud.fired = true;
            ring(bullets, bud.pos, bud.turn);
          }
          if (t >= bud.at + 0.5 && !bud.second) {
            bud.second = true;
            ring(bullets, bud.pos, bud.turn + Math.PI / 8);
          }
        }
        buds = buds.filter((bud) => !bud.second);
      },
    };
  },

  // Slime trail: a little snail crawls across the box leaving slime, and the
  // slime drags at you (you move at half speed in it), while crystals drop
  // out of the ceiling onto your column (they follow you till the last
  // moment, and a pair fall together). Don't get stuck in it.
  snailSlime(box, density, { Shot, Line, rand, clamp }) {
    let t = 0;
    let crawlers = [];
    let patches = [];
    let nextDrop = 1.2;
    let started = 0;
    let drops = [];
    const heading = headingTracker();
    const prev = { x: null, y: null };
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        heading.see(dt, soul);
        // Two crawlers, one each way, along your row.
        if (started < 2 && t >= started * 2.5 + 0.1) {
          const right = started % 2 === 0;
          const y = clamp(soul.y + rand(-6, 6), box.y + 10, box.y + box.h - 8);
          const crawler = new Shot({ x: right ? box.x + box.w - 4 : box.x + 4, y, vx: right ? -32 : 32, harmless: true, art: 'snailCrawler', life: 3.4 });
          crawler.drip = 0;
          crawler.faces = right ? -1 : 1;
          crawlers.push(crawler);
          bullets.push(crawler);
          started++;
        }
        for (const crawler of crawlers) {
          crawler.drip -= dt;
          if (crawler.drip <= 0 && crawler.age < 3.2) {
            crawler.drip = 0.2;
            const patch = new Slime({ x: crawler.x, y: crawler.y + 3, w: 13, h: 7, life: 4.2 });
            patches.push(patch);
            bullets.push(patch);
          }
        }
        // The drag: whatever you moved this frame, you only get a bit of.
        if (prev.x !== null && patches.some((patch) => patch.holds(soul.x, soul.y))) {
          soul.x = prev.x + (soul.x - prev.x) * 0.42;
          soul.y = prev.y + (soul.y - prev.y) * 0.42;
        }
        prev.x = soul.x;
        prev.y = soul.y;
        // Crystals fall on your column (it flashes first); a pair at a time,
        // every other drop, one either side of it.
        if (t >= nextDrop && t < 5.6) {
          nextDrop = t + 0.68;
          const pair = Math.round(t / 0.68) % 2 === 0;
          for (const shift of pair ? [-9, 9] : [0]) {
            const warn = 0.6;
            const line = new Line({ x: soul.x, y: box.y, angle: Math.PI / 2, length: box.h, thickness: 2, warn, life: 0, color: '#d8b0ff' });
            const shard = new Shot({ x: soul.x, y: box.y + 3, vy: 110, warn, art: 'snailShard', life: 2 });
            drops.push({ line, shard, shift });
            bullets.push(line, shard);
          }
        }
        for (const drop of drops) {
          if (drop.shard.age >= drop.shard.warn - 0.2) continue;
          const x = clamp(soul.x + heading.x * 0.3 + drop.shift, box.x + 5, box.x + box.w - 5);
          drop.line.x = x;
          drop.shard.x = x;
        }
        drops = drops.filter((drop) => drop.shard.age < drop.shard.warn);
        crawlers = crawlers.filter((crawler) => crawler.age < 3.6);
        patches = patches.filter((patch) => !patch.isGone());
      },
    };
  },

  // Prism: light through the shell. A beam of white light comes at the spot
  // where you stand, and there it bends through the geode and splits into
  // three colours that fan out (the whole bent path flashes first). Don't be
  // where it bends.
  snailBeams(box, density, { Shot, Line, rand, clamp }) {
    let t = 0;
    let next = 0.15;
    let count = 0;
    let beams = [];
    const heading = headingTracker();
    const COLORS = [['#ff6a8a', '#ff9ab0'], ['#7af0a0', '#b0ffc8'], ['#7ab0ff', '#b0d0ff']];
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        heading.see(dt, soul);
        // The bend follows you while it warns, and settles just before.
        for (const beam of beams) {
          if (beam.lead.age >= beam.lead.warn - 0.22) continue;
          const bend = { x: clamp(soul.x + heading.x * 0.3, box.x + 8, box.x + box.w - 8), y: clamp(soul.y + heading.y * 0.3, box.y + 8, box.y + box.h - 8) };
          const angle = Math.atan2(bend.y - beam.from.y, bend.x - beam.from.x);
          beam.lead.angle = angle;
          beam.lead.length = Math.hypot(bend.x - beam.from.x, bend.y - beam.from.y);
          beam.fan.forEach((line, i) => {
            line.x = bend.x;
            line.y = bend.y;
            line.angle = angle + beam.swing + [-0.3, 0, 0.3][i];
          });
          beam.glint.x = bend.x;
          beam.glint.y = bend.y;
        }
        beams = beams.filter((beam) => beam.lead.age < beam.lead.warn);
        if (t < next || count >= 4 || t > 5) return;
        count++;
        next = t + 1.5;
        const from = { x: box.x + box.w + 8, y: clamp(soul.y + rand(-28, 28), box.y + 4, box.y + box.h - 4) };
        const bend = { x: clamp(soul.x, box.x + 8, box.x + box.w - 8), y: clamp(soul.y, box.y + 8, box.y + box.h - 8) };
        const angle = Math.atan2(bend.y - from.y, bend.x - from.x);
        const warn = 0.95;
        const lead = new Line({ x: from.x, y: from.y, angle, length: Math.hypot(bend.x - from.x, bend.y - from.y), thickness: 3, warn, life: 0.5, color: '#ffffff', glow: '#c9a2ec' });
        bullets.push(lead);
        // Out the other side of the bend, split into three.
        const swing = (Math.random() < 0.5 ? -1 : 1) * rand(0.35, 0.7);
        const fan = [-0.3, 0, 0.3].map((spread, i) => new Line({ x: bend.x, y: bend.y, angle: angle + swing + spread, length: 90, thickness: 3, warn, life: 0.5, color: COLORS[i][0], glow: COLORS[i][1] }));
        const glint = new Shot({ x: bend.x, y: bend.y, harmless: true, life: warn, art: 'snailGlint' });
        bullets.push(...fan, glint);
        beams.push({ lead, fan, glint, from, swing });
      },
    };
  },

  // Rolling: it draws into its shell, and the shell comes rolling, ricocheting
  // off every wall of the box, a little faster each time, throwing shards
  // back across the box from where it hit. A second shell follows the first.
  snailShell(box, density, { Shot, rand }) {
    let t = 0;
    let shells = [];
    let started = 0;
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (started < 2 && t >= started * 2.6 + 0.1) {
          const start = { x: box.x + box.w - 8, y: box.y + rand(14, box.h - 14) };
          const aim = Math.atan2(soul.y - start.y, soul.x - start.x) + rand(-0.25, 0.25);
          const shell = new Shot({ x: start.x, y: start.y, vx: Math.cos(aim) * 50, vy: Math.sin(aim) * 50, bounce: true, warn: 0.75, art: 'snailShell', life: 4.4 });
          shell.lastVx = shell.vx;
          shell.lastVy = shell.vy;
          shells.push(shell);
          bullets.push(shell);
          started++;
        }
        for (const shell of shells) {
          if (shell.age <= shell.warn) continue;
          const bouncedX = shell.vx * shell.lastVx < 0;
          const bouncedY = shell.vy * shell.lastVy < 0;
          if (bouncedX || bouncedY) {
            // Faster each time, and a spray of shards back into the box.
            shell.vx *= 1.07;
            shell.vy *= 1.07;
            const base = Math.atan2(bouncedX ? 0 : Math.sign(shell.vy), bouncedX ? Math.sign(shell.vx) : 0);
            for (let i = -1; i <= 1; i++) {
              const a = base + i * 0.7 + rand(-0.1, 0.1);
              bullets.push(new Shot({ x: shell.x, y: shell.y, vx: Math.cos(a) * 48, vy: Math.sin(a) * 48, art: 'snailShard', life: 1.8 }));
            }
          }
          shell.lastVx = shell.vx;
          shell.lastVy = shell.vy;
        }
        shells = shells.filter((shell) => shell.age < 5.4);
      },
    };
  },

  // Tidy: it sets out neat rows of little crystals, every one the same
  // distance from the next, with a glint on each. Then, row by row, starting
  // with the row you're nearest, it knocks the first one over, and they all
  // go down like dominoes. Don't be on the row when it goes. (There's a row
  // right down at the floor, and each one falls upward, so no height is safe.)
  snailTidy(box, density, { Shot }) {
    const rows = [box.y + 14, box.y + 34, box.y + 54, box.y + 74];
    let t = 0;
    let set = false;
    let chimes = [];
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        for (const chime of chimes) {
          if (t < chime.at) continue;
          chime.done = true;
          bullets.push(new Shot({ x: chime.x, y: chime.y, harmless: true, life: 0.5, art: 'snailGlint' }));
        }
        chimes = chimes.filter((chime) => !chime.done);
        if (set || t < 0.15) return;
        set = true;
        // The row nearest you goes first.
        const byDistance = [...rows].sort((a, b) => Math.abs(a - soul.y) - Math.abs(b - soul.y));
        byDistance.forEach((y, k) => {
          const dir = k % 2 === 0 ? 1 : -1;
          const start = 1.5 + k * 1.05;
          const count = 7;
          for (let i = 0; i < count; i++) {
            const turn = dir === 1 ? i : count - 1 - i;
            bullets.push(new TidyCrystal({ x: box.x + 7 + i * 11, y, dir, fallAt: start + turn * 0.17, tone: i + k }));
          }
          // A glint on the first crystal, just before it goes over.
          chimes.push({ at: start - 0.55, x: dir === 1 ? box.x + 7 : box.x + 7 + 6 * 11, y: y - 18 });
        });
      },
    };
  },
};
