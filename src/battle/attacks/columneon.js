import { defineBulletArt } from '../projectiles.js';

// The Columneon's attacks. It's a chameleon pretending to be a pillar, so it
// fights with its tongue, its tail, its disguise (which column is it?), and bits of
// the "pillar" (some of which are, suspiciously, also looking at you).

// The sticky end of its tongue, drawn pointing right.
defineBulletArt('tongueTip', {
  frames: [[
    '.ttt..',
    'tTTTtt',
    'tTTTtt',
    '.ttt..',
  ]],
  palette: { t: '#ff5470', T: '#ffa0b4' },
  radius: 2,
  rotate: true,
});

// A chunk of the "pillar".
defineBulletArt('brick', {
  frames: [[
    'kkkkkkkk',
    'kSSSSSSk',
    'kssskssk',
    'kddddddk',
    'kkkkkkkk',
  ]],
  // Lighter than the pillars in the overworld, so they stand out in the dark box.
  palette: { k: '#3a2a5e', S: '#d4c8f4', s: '#a494d8', d: '#7462b0' },
  hitbox: { w: 7, h: 4 },
  spin: 1.5,
});

// A chunk of the "pillar" that is, on closer inspection, a very small chameleon.
defineBulletArt('mimicBrick', {
  frames: [
    ['kkkkkkkk', 'kepSSepk', 'kssssssk', 'kddttddk', 'kkkkkkkk'],
    ['kkkkkkkk', 'kpeSSpek', 'kssssssk', 'kddddddk', 'kkkkkkkk'],
  ],
  palette: { k: '#3a2a5e', S: '#d4c8f4', s: '#a494d8', d: '#7462b0', e: '#ffffff', p: '#1b1428', t: '#ff5470' },
  hitbox: { w: 7, h: 4 },
  frameSeconds: 0.3,
});

// A curl of tail, ringed like a chameleon's.
defineBulletArt('tailCurl', {
  frames: [[
    '.gggg.',
    'gGkkGg',
    'gk..kg',
    'gk..kg',
    'gGkkGg',
    '.gggg.',
  ]],
  palette: { g: '#5fc27a', G: '#3f8f5a', k: '#1b1428' },
  radius: 2,
  spin: 4,
});

// A stone column standing up off the floor (or hanging off the ceiling) of the
// box. One of them is never really a column: its eyes open, and then it
// scurries off along its wall, still pretending. Drawn like the pillars in the
// Ruins, a little lighter so it shows in the dark box. (Its own hazard: it
// has update, isGone, edgeDistance and draw like any bullet.)
class Colonnade {
  constructor({ box, x, h, ceiling }) {
    this.box = box;
    this.x = x;
    this.w = 9;
    this.h = h;
    this.ceiling = ceiling;
    this.y = ceiling ? box.y + h / 2 : box.y + box.h - h / 2;
    this.vx = 0;
    this.vy = 0;
    this.warn = 0.6;
    this.age = 0;
    // When its eyes open (it's the Columneon), and when it runs.
    this.eyesAt = Infinity;
    this.runAt = Infinity;
    this.lookX = x;
    this.dmg = null;
    this.grazed = false;
  }

  update(dt) {
    this.age += dt;
    if (this.age >= this.runAt) this.x += this.vx * dt;
  }

  isGone() {
    return this.x < this.box.x - 20 || this.x > this.box.x + this.box.w + 20;
  }

  edgeDistance(px, py) {
    if (this.age < this.warn) return Infinity;
    const dx = Math.max(Math.abs(px - this.x) - this.w / 2, 0);
    const dy = Math.max(Math.abs(py - this.y) - this.h / 2, 0);
    return Math.hypot(dx, dy);
  }

  draw(ctx) {
    const left = Math.round(this.x - this.w / 2);
    const top = Math.round(this.y - this.h / 2);
    ctx.save();
    if (this.age < this.warn) ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.25 : 0.6;
    ctx.fillStyle = '#3a2a5e';
    ctx.fillRect(left, top, this.w, this.h);
    ctx.fillStyle = '#a494d8';
    ctx.fillRect(left + 1, top + 1, this.w - 2, this.h - 2);
    ctx.fillStyle = '#d4c8f4';
    ctx.fillRect(left + 1, top + 1, 2, this.h - 2);
    ctx.fillStyle = '#7462b0';
    for (let line = top + 5; line < top + this.h - 2; line += 6) ctx.fillRect(left + 1, line, this.w - 2, 1);
    // Capital and base.
    ctx.fillStyle = '#d4c8f4';
    ctx.fillRect(left - 1, this.ceiling ? top + this.h - 3 : top, this.w + 2, 3);
    if (this.age >= this.eyesAt) {
      // Two eyes, looking about (and, at the last moment, the way it'll run).
      const eyeY = this.ceiling ? top + this.h - 8 : top + 5;
      const look = this.age >= this.runAt - 0.25 ? Math.sign(this.vx) : Math.sign(Math.sin(this.age * 9));
      for (const ex of [left + 1, left + 5]) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(ex, eyeY, 3, 3);
        ctx.fillStyle = '#1b1428';
        ctx.fillRect(ex + 1 + look, eyeY + 1, 1, 1);
      }
    }
    ctx.restore();
  }
}

export const COLUMNEON_ATTACKS = {
  // Its tongue shoots across the box at your height, from one side (or now and
  // then from above), after a flashing warning. Step out of the line.
  columneonTongue(box, density, { Shot, Line, every, rand, clamp, shuffleBag }) {
    const from = shuffleBag(['left', 'right', 'left', 'right', 'top']);
    const speed = 300;
    const warn = 0.75;
    const lash = every(1.3, 1.7, (bullets, soul) => {
      const side = from();
      let x;
      let y;
      let angle;
      let length;
      if (side === 'top') {
        x = clamp(soul.x + rand(-8, 8), box.x + 6, box.x + box.w - 6);
        y = box.y - 4;
        angle = Math.PI / 2;
        length = box.h + 8;
      } else {
        x = side === 'left' ? box.x - 4 : box.x + box.w + 4;
        y = clamp(soul.y + rand(-8, 8), box.y + 6, box.y + box.h - 6);
        angle = side === 'left' ? 0 : Math.PI;
        length = box.w + 8;
      }
      bullets.push(new Line({ x, y, angle, length, thickness: 4, warn, grow: speed, life: 0.35, color: '#ff5470' }));
      bullets.push(new Shot({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, art: 'tongueTip', warn }));
    });
    return { duration: 7, update: (dt, bullets, soul) => lash(dt, bullets, soul) };
  },

  // The "pillar" crumbles: bricks rain down all over the box. Every so often
  // one of them has eyes: it looks at you, creeps toward you wherever you
  // are (up into a corner too), and drifts after you for a moment before
  // giving up.
  columneonCrumble(box, density, { Shot, every, rand, spreadAcross }) {
    const dropX = spreadAcross(box.x + 6, box.x + box.w - 6, 5);
    const followSeconds = 1.6;
    let mimics = [];
    const crumble = every(0.4, 0.6, (bullets) => {
      bullets.push(new Shot({ x: dropX(), y: box.y + 4, vy: 10, gravity: 110, art: 'brick', warn: 0.35 }));
    });
    const sneak = every(1.7, 2.1, (bullets, soul) => {
      const x = dropX();
      const aim = Math.atan2(soul.y - (box.y + 4), soul.x - x);
      const shot = new Shot({ x, y: box.y + 4, vx: Math.cos(aim) * 30, vy: Math.sin(aim) * 30, art: 'mimicBrick', warn: 0.5, homing: { target: soul, turn: 1.4 } });
      bullets.push(shot);
      mimics.push(shot);
    });
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        crumble(dt, bullets);
        sneak(dt, bullets, soul);
        // Caught looking: it stops following and falls like the others.
        for (const shot of mimics) {
          if (shot.age < shot.warn + followSeconds) continue;
          shot.homing = null;
          shot.gravity = 90;
        }
        mimics = mimics.filter((shot) => shot.homing);
      },
    };
  },

  // I spy... Stone columns stand up off the floor and hang off the ceiling of
  // the box (don't walk into them). One of them is the Columneon: its eyes
  // open, dart about, then look the way it's going, and it scurries off
  // along its wall, right across the box. Get out of that column's reach
  // (above a floor one, below a ceiling one) before it runs. A new column
  // stands up where it was.
  columneonISpy(box, density, { rand, pick }) {
    const slots = [box.x + 14, box.x + 40, box.x + 66];
    let columns = [];
    const raise = (bullets, x) => {
      const column = new Colonnade({ box, x: x + rand(-3, 3), h: rand(30, 54), ceiling: Math.random() < 0.5 });
      bullets.push(column);
      columns.push(column);
    };
    let started = false;
    let timer = 1.0;
    let refill = [];
    return {
      duration: 7.4,
      update: (dt, bullets, soul) => {
        if (!started) {
          started = true;
          for (const x of slots) raise(bullets, x);
        }
        for (const slot of refill) slot.t -= dt;
        for (const slot of refill.filter((s) => s.t <= 0)) raise(bullets, slot.x);
        refill = refill.filter((s) => s.t > 0);
        columns = columns.filter((c) => !c.isGone() && c.runAt === Infinity);
        timer -= dt;
        if (timer > 0) return;
        timer += 1.75;
        const ready = columns.filter((c) => c.age >= c.warn);
        if (!ready.length) return;
        // Usually the one whose wall you're nearest: it fancies its chances.
        const reaching = ready.filter((c) => (c.ceiling ? soul.y < c.y + c.h / 2 + 6 : soul.y > c.y - c.h / 2 - 6));
        const it = reaching.length && Math.random() < 0.75 ? pick(reaching) : pick(ready);
        it.eyesAt = it.age;
        it.runAt = it.age + 0.75;
        // It runs the long way across, so it crosses the most box.
        it.vx = it.x < box.x + box.w / 2 ? 78 : -78;
        refill.push({ x: it.x, t: 1.3 });
      },
    };
  },

  // Its tail pokes in at one corner of the box and swishes back and forth,
  // flicking a stream of rings across the box, then moves to another corner.
  // Slip through the gap as the stream sweeps past.
  columneonTailCurl(box, density, { Shot, every, rand, shuffleBag }) {
    // Each corner, and the angle of the quarter-turn that points into the box from it.
    const corners = [
      { x: box.x + 4, y: box.y + 4, from: 0 },
      { x: box.x + box.w - 4, y: box.y + 4, from: Math.PI / 2 },
      { x: box.x + box.w - 4, y: box.y + box.h - 4, from: Math.PI },
      { x: box.x + 4, y: box.y + box.h - 4, from: -Math.PI / 2 },
    ];
    const corner = shuffleBag(corners);
    let at = corner();
    let swish = rand(0, Math.PI * 2);
    const move = every(2.8, 3.2, () => { at = corner(); }, { first: 2.8 });
    const flick = every(0.17, 0.17, (bullets) => {
      // Sweeps between 4 and 86 degrees into the box, so rings never fly
      // straight out, but do skim along the walls (hugging a wall by its
      // corner was safe when it only reached 10 degrees).
      const angle = at.from + Math.PI / 4 + Math.sin(swish) * (Math.PI * 41 / 180);
      bullets.push(new Shot({ x: at.x, y: at.y, vx: Math.cos(angle) * 54, vy: Math.sin(angle) * 54, art: 'tailCurl', warn: 0.2 }));
    });
    return {
      duration: 7,
      update: (dt, bullets) => {
        swish += 1.8 * dt;
        move(dt);
        flick(dt, bullets);
      },
    };
  },
};
