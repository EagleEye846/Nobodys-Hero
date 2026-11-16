import { defineBulletArt } from '../projectiles.js';

// The Rogue Dummy's attacks. It's a training dummy stuffed with cotton, so
// everything it throws comes out of a sewing basket: buttons, needles and
// thread, its own stuffing (which it wants back), the practice targets it was
// made to face, and the wooden sword it was trained with, swung the way it
// was taught: a practice swing first, every time.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// `tools` holds the bullet classes and helpers (see PATTERN_TOOLS in
// src/battle/bullets.js). Bullet art is drawn pointing right when `rotate` is
// set, so pins and needles face where they fly.

defineBulletArt('pin', {
  frames: [[
    '.rr.....',
    'rRrsssst',
    '.rr.....',
  ]],
  palette: { r: '#ff5470', R: '#ffa0b4', s: '#c9ccd6', t: '#ffffff' },
  radius: 2,
  rotate: true,
});

defineBulletArt('button', {
  frames: [[
    '.bbbbb.',
    'bBBBBBb',
    'bBkBkBb',
    'bBBBBBb',
    'bBkBkBb',
    'bBBBBBb',
    '.bbbbb.',
  ]],
  palette: { b: '#6b3f1a', B: '#c08a4e', k: '#2a160a' },
  radius: 3,
  spin: 3,
});

defineBulletArt('needle', {
  frames: [[
    'kk........',
    'k.sssssssw',
    'kk........',
  ]],
  palette: { k: '#8a8fa0', s: '#d8dce6', w: '#ffffff' },
  radius: 2,
  rotate: true,
});

// Tufts of stuffing, fluffing as they fly.
defineBulletArt('tuft', {
  frames: [
    ['.w.w.', 'wwWww', '.wWw.', 'wwWww', '.w.w.'],
    ['w.w.w', '.wWw.', 'wWwWw', '.wWw.', 'w.w.w'],
  ],
  palette: { w: '#f2ecff', W: '#c9c2e0' },
  radius: 2,
  frameSeconds: 0.15,
});

// A practice target (harmless itself; it fires pins).
defineBulletArt('target', {
  frames: [[
    '..rrrrr..',
    '.rwwwwwr.',
    'rwrrrrrwr',
    'rwrwwwrwr',
    'rwrwrwrwr',
    'rwrwwwrwr',
    'rwrrrrrwr',
    '.rwwwwwr.',
    '..rrrrr..',
  ]],
  palette: { r: '#ff5470', w: '#f2ecff' },
  radius: 4,
});

// A split in the dummy's burlap where the stuffing comes out (harmless).
defineBulletArt('dummySeam', {
  frames: [
    ['.w.', 'kWk', '.w.', 'kWk', '.w.'],
    ['w.w', 'kWk', 'w.w', 'kWk', 'w.w'],
  ],
  palette: { k: '#6b4a2a', w: '#f2ecff', W: '#c9c2e0' },
  radius: 1,
  frameSeconds: 0.1,
});

// The dummy's wooden practice sword, swung from a pivot at the edge of the
// box. A `ghost` swing is the dummy practising: dashed, faint and harmless.
// The real one follows exactly the same arc. (Its own little hazard: it has
// update, isGone, edgeDistance and draw like any bullet.)
class PracticeSwing {
  constructor({ px, py, from, to, length, warn, time, ghost }) {
    this.x = px;
    this.y = py;
    this.from = from;
    this.to = to;
    this.length = length;
    this.warn = warn;
    this.time = time;
    this.ghost = ghost;
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
  }

  get angle() {
    const t = Math.min(Math.max((this.age - this.warn) / this.time, 0), 1);
    return this.from + (this.to - this.from) * t * t * (3 - 2 * t);
  }

  update(dt) {
    this.age += dt;
  }

  isGone() {
    return this.age > this.warn + this.time + 0.3;
  }

  edgeDistance(px, py) {
    if (this.ghost || this.age < this.warn || this.age > this.warn + this.time + 0.05) return Infinity;
    const dx = Math.cos(this.angle);
    const dy = Math.sin(this.angle);
    const along = Math.min(Math.max((px - this.x) * dx + (py - this.y) * dy, 0), this.length);
    return Math.hypot(px - (this.x + dx * along), py - (this.y + dy * along)) - 2.5;
  }

  draw(ctx) {
    const angle = this.angle;
    const tipX = this.x + Math.cos(angle) * this.length;
    const tipY = this.y + Math.sin(angle) * this.length;
    const stroke = (colour, width) => {
      ctx.strokeStyle = colour;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(tipX, tipY);
      ctx.stroke();
    };
    ctx.save();
    ctx.lineCap = 'round';
    if (this.ghost || this.age < this.warn) {
      // The practice swing: a faint dashed sword.
      ctx.globalAlpha = this.age < this.warn ? 0.25 : 0.55;
      ctx.setLineDash([3, 2]);
      stroke('#f2ecff', 1);
    } else {
      const over = this.age - (this.warn + this.time);
      if (over > 0) ctx.globalAlpha = Math.max(0, 1 - over / 0.25);
      stroke('#08070d', 6);
      stroke('#a8703a', 4);
      stroke('#e0b070', 1);
    }
    ctx.restore();
  }
}

export const DUMMY_ATTACKS = {
  // Practice makes perfect. The dummy swings its wooden practice sword in
  // from one edge of the box, but it was made for training, so it always
  // practises first: a faint dashed swing shows the exact arc (sized to
  // reach you), then the real swing follows it, faster. Watch the practice
  // and get out of the arc: further away than the sword reaches, or round
  // past the end of the swing.
  dummyPractice(box, density, { rand, clamp, angleTo, shuffleBag }) {
    const edges = shuffleBag(['left', 'right', 'top', 'bottom']);
    const half = Math.PI * 0.3;
    const drill = (bullets, soul) => {
      const edge = edges();
      const nearX = clamp(soul.x + rand(-22, 22), box.x + 6, box.x + box.w - 6);
      const nearY = clamp(soul.y + rand(-22, 22), box.y + 6, box.y + box.h - 6);
      const px = edge === 'left' ? box.x - 2 : edge === 'right' ? box.x + box.w + 2 : nearX;
      const py = edge === 'top' ? box.y - 2 : edge === 'bottom' ? box.y + box.h + 2 : nearY;
      const facing = angleTo({ x: px, y: py }, soul);
      const length = clamp(Math.hypot(soul.x - px, soul.y - py) + 14, 40, 92);
      const way = Math.random() < 0.5 ? 1 : -1;
      const from = facing - way * half;
      const to = facing + way * half;
      bullets.push(new PracticeSwing({ px, py, from, to, length, warn: 0.15, time: 0.9, ghost: true }));
      bullets.push(new PracticeSwing({ px, py, from, to, length, warn: 1.45, time: 0.5, ghost: false }));
    };
    let timer = 0.1;
    return {
      duration: 7.2,
      update: (dt, bullets, soul) => {
        timer -= dt;
        if (timer <= 0) {
          timer += 2.3;
          drill(bullets, soul);
        }
      },
    };
  },

  // Big buttons pop off and ricochet around the box, spinning, while loose
  // stuffing drifts down between them. The last button off is flicked
  // straight at you, so a corner isn't a hiding place.
  buttonBounce(box, density, { Shot, every, rand, shuffleBag, spreadAcross, angleTo }) {
    const dropX = spreadAcross(box.x + 10, box.x + box.w - 10);
    const fluffX = spreadAcross(box.x + 4, box.x + box.w - 4, 5);
    const heading = shuffleBag([-1, 1]);
    const total = 2 + Math.round(density);
    let thrown = 0;
    const pop = every(0.8, 1.1, (bullets, soul) => {
      if (thrown >= total) return;
      thrown++;
      const x = dropX();
      const at = thrown === total ? angleTo({ x, y: box.y + 6 }, soul) : null;
      const angle = at ?? rand(0.25, 0.75) * Math.PI;
      const speed = rand(48, 62);
      bullets.push(new Shot({
        x,
        y: box.y + 6,
        vx: Math.cos(angle) * speed * (at === null ? heading() : 1),
        vy: Math.sin(angle) * speed,
        art: 'button',
        bounce: true,
        warn: 0.5,
      }));
    });
    const fluff = every(0.9, 1.3, (bullets) => {
      bullets.push(new Shot({ x: fluffX(), y: box.y - 3, vy: rand(38, 52), art: 'tuft' }));
    });
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        pop(dt, bullets, soul);
        fluff(dt, bullets);
      },
    };
  },

  // A needle shoots across the box pulling a line of thread behind it, near
  // where you are. The thread lingers for a moment, so lines can box you in.
  stitchLine(box, density, { Shot, Line, every, rand, clamp, shuffleBag }) {
    const direction = shuffleBag(['right', 'left', 'down', 'up', 'right', 'left']);
    const warn = 0.8;
    const speed = 150;
    const stitch = every(1.8, 2.2, (bullets, soul) => {
      const way = direction();
      const horizontal = way === 'right' || way === 'left';
      const forward = way === 'right' || way === 'down';
      let x;
      let y;
      let angle;
      let length;
      if (horizontal) {
        y = clamp(soul.y + rand(-4, 4), box.y + 6, box.y + box.h - 6);
        x = forward ? box.x - 4 : box.x + box.w + 4;
        angle = forward ? 0 : Math.PI;
        length = box.w + 8;
      } else {
        x = clamp(soul.x + rand(-4, 4), box.x + 6, box.x + box.w - 6);
        y = forward ? box.y - 4 : box.y + box.h + 4;
        angle = forward ? Math.PI / 2 : -Math.PI / 2;
        length = box.h + 8;
      }
      bullets.push(new Line({ x, y, angle, length, thickness: 2, warn, grow: speed, life: 0.9, color: '#f2ecff', dash: [3, 2] }));
      bullets.push(new Shot({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, art: 'needle', warn }));
    });
    return { duration: 7, update: (dt, bullets, soul) => stitch(dt, bullets, soul) };
  },

  // Coming apart at the seams. A seam splits at the edge of the box and a
  // fan of stuffing bursts out, slows and hangs in the air... then the dummy
  // sucks it all back in, down exactly the same lines it came out on. Stand
  // between the lines, and stay there for the way back.
  dummyRestuff(box, density, { Shot, rand, clamp, angleTo, shuffleBag }) {
    const edges = shuffleBag(['left', 'right', 'top', 'bottom']);
    const WARN = 0.6;
    const OUT = 0.9;
    const HANG = 0.45;
    let seams = [];
    let timer = 0.1;
    const split = (bullets, soul) => {
      const edge = edges();
      const x = edge === 'left' ? box.x + 1 : edge === 'right' ? box.x + box.w - 1 : clamp(soul.x + rand(-20, 20), box.x + 14, box.x + box.w - 14);
      const y = edge === 'top' ? box.y + 1 : edge === 'bottom' ? box.y + box.h - 1 : clamp(soul.y + rand(-20, 20), box.y + 14, box.y + box.h - 14);
      bullets.push(new Shot({ x, y, art: 'dummySeam', harmless: true, life: WARN + OUT + HANG + 1.2 }));
      // (Aimed so the middle tuft stops just past you.)
      const facing = angleTo({ x, y }, soul);
      const reach = Math.hypot(soul.x - x, soul.y - y) + 10;
      const tufts = [];
      for (let i = 0; i < 5; i++) {
        const angle = facing + (i - 2) * 0.32 + rand(-0.04, 0.04);
        const speed = clamp((2 * reach) / OUT, 60, 190) * rand(0.92, 1.08);
        // (It slows to a stop at the end of its burst.)
        // (Its burst is set next frame, after the battle's bullet-speed
        // tuning, so it still stops just where it was meant to.)
        const tuft = new Shot({ x, y, warn: WARN, art: 'tuft' });
        tuft.burst = { vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, accel: -speed / OUT };
        bullets.push(tuft);
        tufts.push(tuft);
      }
      seams.push({ x, y, tufts, t: 0 });
    };
    return {
      duration: 7.4,
      update: (dt, bullets, soul) => {
        timer -= dt;
        if (timer <= 0) {
          timer += 2.2;
          split(bullets, soul);
        }
        for (const seam of seams) {
          for (const tuft of seam.tufts) {
            if (!tuft.burst || tuft.age === 0) continue;
            Object.assign(tuft, tuft.burst);
            tuft.burst = null;
          }
          seam.t += dt;
          if (seam.t < WARN + OUT + HANG) continue;
          seam.pulled = true;
          for (const tuft of seam.tufts) {
            const angle = angleTo(tuft, seam);
            tuft.vx = Math.cos(angle) * 12;
            tuft.vy = Math.sin(angle) * 12;
            tuft.accel = 130;
            // (Gone once it's back in the seam.)
            const back = Math.hypot(tuft.x - seam.x, tuft.y - seam.y);
            tuft.life = tuft.age - tuft.warn + Math.max(0.2, (Math.sqrt(144 + 260 * back) - 12) / 130);
          }
        }
        seams = seams.filter((seam) => !seam.pulled);
      },
    };
  },

  // Practice targets pop up in the top of the box and, a moment later, each
  // fires three pins at you.
  trainingTargets(box, density, { Shot, every, rand, angleTo, spreadAcross }) {
    const targetX = spreadAcross(box.x + 12, box.x + box.w - 12, 3);
    let targets = [];
    const raise = every(1.9, 2.25, (bullets) => {
      const x = targetX();
      const y = rand(box.y + 10, box.y + box.h * 0.45);
      bullets.push(new Shot({ x, y, art: 'target', harmless: true, life: 1.3 }));
      targets.push({ x, y, t: 0.75 });
    });
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        raise(dt, bullets);
        for (const target of targets) {
          target.t -= dt;
          if (target.t > 0) continue;
          const aim = angleTo(target, soul);
          for (const offset of [-0.4, 0, 0.4]) {
            bullets.push(new Shot({ x: target.x, y: target.y, vx: Math.cos(aim + offset) * 72, vy: Math.sin(aim + offset) * 72, art: 'pin' }));
          }
        }
        targets = targets.filter((target) => target.t > 0);
      },
    };
  },
};
