import { defineBulletArt } from '../projectiles.js';

// The Knotling's attacks. It's a cross old stump that was cut down once and
// has never got over it, so it fights with everything a tree has left: its
// rings, rippling out across the box with a notch where the saw went in; the
// memory of the axe, chopping across the box in a spray of splinters; bark
// and sap coming down, the sap sticking where it lands; a grudge against
// every spot you've stood on; and the saw itself, working its way down.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape.

const WOOD = {
  k: '#1a0e06', b: '#6a4a30', B: '#3e2a1a', r: '#d8b07a', R: '#a87a48', q: '#f0d8a8',
  a: '#8a5a2a', A: '#5a3a1a', c: '#4a3420', s: '#ffb02e', S: '#c87a14', w: '#ffe6a0',
};
const BARK = '#6a4a30';
const RING = '#d8b07a';
const RING_EDGE = '#3e2a1a';

// A splinter, pale where it broke and dark at its sharp end.
defineBulletArt('knotSplinter', {
  frames: [['qqrrRBk', '.rrRBk.']],
  palette: WOOD,
  radius: 1.4,
  rotate: true,
});

// The stump's rings, flashing on the spot they're about to ripple out from.
defineBulletArt('knotStamp', {
  frames: [['.kkkkk.', 'krRRRrk', 'kRrkrRk', 'krRRRrk', '.kkkkk.']],
  palette: WOOD,
  radius: 3,
});

// A notch it cuts where you stood (harmless, for now), the spike of old wood
// that bursts up out of it, and a pinch of sawdust.
defineBulletArt('knotNotch', {
  frames: [['k...k', '.kBk.', '..k..', '.kBk.', 'k...k']],
  palette: WOOD,
  radius: 1,
});
defineBulletArt('knotSpike', {
  frames: [['..k..', '.kqk.', '.krk.', 'krRRk', 'kRBRk', 'kkkkk']],
  palette: WOOD,
  radius: 3,
});
defineBulletArt('knotDust', {
  frames: [['q.r', '.q.', 'r.q']],
  palette: WOOD,
  radius: 1.2,
  spin: 3,
});

// A slab of bark, falling flat, with its grooves.
defineBulletArt('knotBark', {
  frames: [['kkkkkkkkkkkkkk', 'kbBbbBbbbBbbBk', 'kBbbBbbBbbbBbk', 'kkkkkkkkkkkkkk']],
  palette: WOOD,
  hitbox: { w: 13, h: 3 },
});

// A drop of sap, falling, and the sticky puddle it leaves on the floor.
defineBulletArt('knotSap', {
  frames: [['.s.', 'sws', 'sSs', '.S.']],
  palette: WOOD,
  radius: 1.5,
});
defineBulletArt('knotPuddle', {
  frames: [
    ['..sssss..', '.ssswsss.', 'sSsssssSs', '.SSSSSSS.'],
    ['..sssss..', '.sssssws.', 'sSsssssSs', '.SSSSSSS.'],
  ],
  palette: WOOD,
  radius: 4,
  frameSeconds: 0.5,
});

// One of its tree rings, rippling outward from (x, y), with a notch in it
// where the saw went in (`gapAt`, an angle, `gap` wide in radians). It
// flashes at its centre first (`warn`), then spreads at `grow` pixels a
// second; standing in the notch as it passes is safe, anywhere else on the
// ring hurts.
class Ring {
  constructor({ x, y, grow = 40, gapAt = 0, gap = 0.5, warn = 0.45, thickness = 3, reach = 140 }) {
    Object.assign(this, { x, y, grow, gapAt, gap, warn, thickness, reach });
    this.r = 3;
    this.vx = 0;
    this.vy = 0;
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
  }

  update(dt) {
    this.age += dt;
    if (this.age >= this.warn) this.r = 3 + (this.age - this.warn) * this.grow;
  }

  isGone() {
    return this.r > this.reach;
  }

  // How far the angle a is from the middle of the notch.
  offNotch(a) {
    return Math.abs(((a - this.gapAt + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
  }

  edgeDistance(px, py) {
    if (this.age < this.warn) return Infinity;
    const dx = px - this.x;
    const dy = py - this.y;
    if (this.offNotch(Math.atan2(dy, dx)) < this.gap / 2) {
      // In the notch: only the ends of the ring can touch you.
      return Math.min(...[-1, 1].map((side) => {
        const a = this.gapAt + side * this.gap / 2;
        return Math.hypot(px - (this.x + Math.cos(a) * this.r), py - (this.y + Math.sin(a) * this.r));
      })) - this.thickness / 2;
    }
    return Math.abs(Math.hypot(dx, dy) - this.r) - this.thickness / 2;
  }

  draw(ctx) {
    ctx.save();
    if (this.age < this.warn) {
      ctx.globalAlpha = Math.floor(this.age * 10) % 2 ? 0.25 : 0.6;
      ctx.strokeStyle = RING;
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.arc(this.x, this.y, 8, this.gapAt + this.gap / 2, this.gapAt - this.gap / 2 + Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      return;
    }
    const from = this.gapAt + this.gap / 2;
    const to = this.gapAt - this.gap / 2 + Math.PI * 2;
    // A dark edge, then the pale wood of the ring on top.
    for (const [color, width] of [[RING_EDGE, this.thickness + 2], [RING, this.thickness]]) {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, from, to);
      ctx.stroke();
    }
    // A fine darker grain line along the middle of the ring.
    ctx.strokeStyle = '#a87a48';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 2]);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, from, to);
    ctx.stroke();
    ctx.restore();
  }
}

export const KNOTLING_ATTACKS = {
  // Counting Rings: it thumps down, and its rings ripple out across the box
  // from one edge, one after another, each with a notch where the saw went
  // in. Every other notch is aimed right at you and the ones between are
  // aimed a little aside, so you step into the notch, then step again.
  // Every few rings it thumps down somewhere else.
  knotRings(box, density, { Shot, every, angleTo, shuffleBag }) {
    const spots = shuffleBag([
      { x: box.x + box.w / 2, y: box.y + box.h + 1 },
      { x: box.x - 1, y: box.y + box.h / 2 },
      { x: box.x + box.w + 1, y: box.y + box.h / 2 },
      { x: box.x - 1, y: box.y + box.h + 1 },
      { x: box.x + box.w + 1, y: box.y + box.h + 1 },
    ]);
    let from = spots();
    let count = 0;
    let lean = Math.random() < 0.5 ? -1 : 1;
    const ripple = every(0.95, 1.05, (bullets, soul) => {
      if (count && count % 3 === 0) from = spots();
      const warn = count % 3 === 0 ? 0.6 : 0.3;
      const reach = Math.max(18, Math.hypot(soul.x - from.x, soul.y - from.y));
      // About 20 pixels of notch where it'll pass you.
      const gap = Math.min(0.9, Math.max(0.3, 20 / reach));
      let gapAt = angleTo(from, soul);
      if (count % 2) {
        gapAt += lean * gap * 1.15;
        lean = -lean;
      }
      count++;
      if (warn > 0.5) bullets.push(new Shot({ x: from.x, y: from.y, harmless: true, life: warn, art: 'knotStamp' }));
      bullets.push(new Ring({ x: from.x, y: from.y, grow: 38, gapAt, gap, warn }));
    }, { first: 0.2 });
    return { duration: 8, update: (dt, bullets, soul) => ripple(dt, bullets, soul) };
  },

  // Old Wounds: it remembers the axe. A cut flashes across the box, close by
  // you, at a slant; then the axe comes down along it, and splinters burst
  // off both sides of the cut, staggered so there's a gap to stand in. Every
  // third blow is two cuts at once, crossed.
  knotChop(box, density, { Line, Shot, every, rand, clamp }) {
    let pending = [];
    let blow = 0;
    const cut = (bullets, x, y, angle) => {
      const warn = 0.75;
      const line = new Line({
        x: x - Math.cos(angle) * 120, y: y - Math.sin(angle) * 120, angle, length: 240,
        thickness: 3, warn, life: 0.18, color: '#f0d8a8',
      });
      bullets.push(line);
      pending.push({ line, x, y, angle });
    };
    const swing = every(1.25, 1.4, (bullets, soul) => {
      const x = clamp(soul.x + rand(-10, 10), box.x + 10, box.x + box.w - 10);
      const y = clamp(soul.y + rand(-10, 10), box.y + 10, box.y + box.h - 10);
      const angle = rand(0, Math.PI);
      cut(bullets, x, y, angle);
      if (blow++ % 3 === 2) cut(bullets, x, y, angle + Math.PI / 2 + rand(-0.2, 0.2));
    }, { first: 0.2 });
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        swing(dt, bullets, soul);
        for (const chop of pending) {
          // The splinters fly the moment the axe lands on the cut.
          if (chop.line.age < chop.line.warn || chop.done) continue;
          chop.done = true;
          const along = { x: Math.cos(chop.angle), y: Math.sin(chop.angle) };
          for (const side of [-1, 1]) {
            const out = { x: -along.y * side, y: along.x * side };
            // One side's splinters sit between the other side's.
            for (let i = -5; i <= 5; i++) {
              const d = (i + (side > 0 ? 0.5 : 0)) * 15;
              const speed = rand(50, 58);
              bullets.push(new Shot({
                x: chop.x + along.x * d, y: chop.y + along.y * d,
                vx: out.x * speed, vy: out.y * speed, life: 2, art: 'knotSplinter',
              }));
            }
          }
        }
        pending = pending.filter((chop) => !chop.done);
      },
    };
  },

  // Sticky Situation: it shakes itself, and slabs of old bark come down in
  // rows, each with one gap, while drops of sap fall between them. Where the
  // sap lands it leaves a puddle on the floor, and wading through one is
  // slow going. Keep off the floor, or pick your way round the puddles.
  knotSap(box, density, { Shot, every, rand, clamp }) {
    const floor = box.y + box.h;
    const slots = 5;
    const slot = box.w / slots;
    let gapSlot = Math.floor(Math.random() * slots);
    let drops = [];
    let puddles = [];
    let stuck = 0;
    let last = null;
    let drip = 0;
    const shed = every(1.1, 1.25, (bullets) => {
      // The gap wanders, but never more than two slots, so you can reach it
      // even with sap on your shoes.
      gapSlot = clamp(gapSlot + Math.floor(rand(-2, 3)), 0, slots - 1);
      for (let i = 0; i < slots; i++) {
        if (i === gapSlot) continue;
        bullets.push(new Shot({ x: box.x + (i + 0.5) * slot, y: box.y - 3, vy: 34, warn: 0.3, life: 3.5, art: 'knotBark' }));
      }
    }, { first: 0.2 });
    const ooze = every(0.45, 0.6, (bullets, soul) => {
      const x = drip++ % 3 === 0 ? clamp(soul.x, box.x + 4, box.x + box.w - 4) : rand(box.x + 4, box.x + box.w - 4);
      const drop = new Shot({ x, y: box.y - 2, vy: 25, gravity: 90, art: 'knotSap' });
      bullets.push(drop);
      drops.push(drop);
    }, { first: 0.6 });
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        shed(dt, bullets, soul);
        ooze(dt, bullets, soul);
        for (const drop of drops) {
          if (drop.y < floor - 3) continue;
          drop.life = drop.age;
          if (puddles.length < 5) {
            const puddle = new Shot({ x: drop.x, y: floor - 2, harmless: true, life: 3, art: 'knotPuddle' });
            bullets.push(puddle);
            puddles.push(puddle);
          }
        }
        drops = drops.filter((drop) => drop.y < floor - 3);
        puddles = puddles.filter((puddle) => puddle.age < puddle.life);
        // Wading through sap: for a moment you move at half speed.
        if (puddles.some((puddle) => Math.abs(puddle.x - soul.x) < 6 && soul.y > floor - 8)) stuck = 0.4;
        if (stuck > 0 && last) {
          stuck -= dt;
          soul.x = last.x + (soul.x - last.x) * 0.5;
          soul.y = last.y + (soul.y - last.y) * 0.5;
        }
        last = { x: soul.x, y: soul.y };
      },
    };
  },
  // Holding a grudge: it never forgets a thing, and it's keeping a list of
  // everywhere you've stood. Every moment it carves a notch where you are.
  // A little later each notch cracks (it blinks) and a spike of old wood
  // bursts up out of it, throwing splinters. So everywhere you've been comes
  // back at you: keep moving on to new ground, and don't double back.
  knotGrudge(box, density, { Shot, rand }) {
    let t = 0;
    let carve = 0.3;
    let events = [];
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        carve -= dt;
        if (carve <= 0 && t < 8.4) {
          carve = 0.55;
          const at = { x: soul.x, y: soul.y };
          bullets.push(new Shot({ x: at.x, y: at.y, harmless: true, life: 1.35, art: 'knotNotch' }));
          events.push({ when: t + 1.35, at, step: 0 });
        }
        for (const event of events) {
          if (event.when > t) continue;
          if (event.step === 0) {
            // It cracks open, and the spike comes up.
            event.step = 1;
            event.when = t + 0.45;
            bullets.push(new Shot({ x: event.at.x, y: event.at.y, warn: 0.45, life: 0.55, art: 'knotSpike' }));
          } else if (event.step === 1) {
            event.step = 2;
            const turn = rand(0, Math.PI * 2);
            for (let i = 0; i < 6; i++) {
              const a = turn + (i / 6) * Math.PI * 2;
              bullets.push(new Shot({ x: event.at.x, y: event.at.y, vx: Math.cos(a) * 46, vy: Math.sin(a) * 46, life: 1.1, art: 'knotSplinter' }));
            }
          }
        }
        events = events.filter((event) => event.step < 2);
      },
    };
  },

  // The saw: a great two-handled saw comes in across the top of the box
  // and goes to work, back and forth, back and forth, cutting its way down
  // through the box (and sawdust pours out under it), and then back up
  // again. It's shorter than the box is wide, so at the end of each stroke
  // there's a gap on one side: slip through the gap past it, then again
  // when it comes back.
  knotSaw(box, density, { Line, Shot, rand }) {
    const LENGTH = 56;
    const STROKE = 1.3;
    const top = box.y + 5;
    let t = 0;
    let saw = null;
    let dust = 0;
    const left = (time) => box.x + (box.w - LENGTH) / 2 + Math.sin((time / STROKE) * Math.PI * 2) * ((box.w - LENGTH) / 2);
    // Down through the box, then back up the other way.
    // It saws a full stroke at the top and at the bottom before it turns.
    const SPEED = 18;
    const travel = (box.y + box.h - 5) - (box.y + 5);
    const height = (time) => {
      const go = travel / SPEED;
      let u = time - 0.6 - STROKE;
      if (u <= 0) return box.y + 5;
      if (u < go) return box.y + 5 + u * SPEED;
      u -= go + STROKE;
      if (u <= 0) return box.y + box.h - 5;
      return Math.max(box.y + 5, box.y + box.h - 5 - u * SPEED);
    };
    return {
      duration: 8,
      update: (dt, bullets) => {
        t += dt;
        if (!saw) {
          saw = new Line({ x: left(0), y: top, angle: 0, length: LENGTH, thickness: 4, warn: 0.6, life: 30, color: '#c0c8d0', dash: [2, 1] });
          bullets.push(saw);
          return;
        }
        // It moves by its velocity, so it reads as moving.
        // (Its own clock runs `density` times fast; the box's doesn't.)
        const step = Math.max(dt / density, 1e-4);
        saw.vx = (left(t + dt) - saw.x) / step;
        saw.vy = (height(t + dt) - saw.y) / step;
        if (saw.age < saw.warn) return;
        dust -= dt;
        if (dust <= 0) {
          dust = 0.05;
          // Out of the cut, under the leading end.
          const end = saw.vx >= 0 ? saw.x + LENGTH : saw.x;
          bullets.push(new Shot({ x: end + rand(-4, 4), y: saw.y + 3, vx: rand(-10, 10), vy: 15, gravity: 70, life: 1.2, art: 'knotDust' }));
        }
      },
    };
  },
};
