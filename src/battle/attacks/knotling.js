import { defineBulletArt } from '../projectiles.js';

// The Knotling's attacks. It's a cross old stump that was cut down once and
// has never got over it, so it fights with everything a tree has left: its
// rings, rippling out across the box with a notch where the saw went in; its
// roots, bursting up through the floor and grabbing sideways; acorns, spat out
// of its knot-hole; the memory of the axe, chopping across the box in a spray
// of splinters; and bark and sap coming down, the sap sticking where it lands.
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

// An acorn, cap and all.
defineBulletArt('knotAcorn', {
  frames: [['.kck.', 'ccccc', 'kRrrk', 'kRrqk', '.kRk.', '..k..']],
  palette: WOOD,
  radius: 2.2,
  spin: 5,
});

// A splinter, pale where it broke and dark at its sharp end.
defineBulletArt('knotSplinter', {
  frames: [['qqrrRBk', '.rrRBk.']],
  palette: WOOD,
  radius: 1.4,
  rotate: true,
});

// A crack in the floor where a root's about to come up, and the stump's
// rings, flashing on the spot they're about to ripple out from.
defineBulletArt('knotCrack', {
  frames: [['k.k.k', '.kBk.', 'kBkBk']],
  palette: WOOD,
  radius: 2,
});
defineBulletArt('knotStamp', {
  frames: [['.kkkkk.', 'krRRRrk', 'kRrkrRk', 'krRRRrk', '.kkkkk.']],
  palette: WOOD,
  radius: 3,
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
    return { duration: 7, update: (dt, bullets, soul) => ripple(dt, bullets, soul) };
  },

  // Grudge Roots: the floor cracks under you and a root punches up out of
  // the crack, a little ahead of where you're going. Then it grabs: a shoot
  // flashes out sideways from the root, toward where you were, and snaps
  // across. Get clear of the root, then out of the way of its grab.
  knotRoots(box, density, { Line, Shot, every, rand, clamp }) {
    const floor = box.y + box.h;
    let last = null;
    let drift = 0;
    const root = every(0.62, 0.72, (bullets, soul) => {
      if (last !== null) drift = clamp((soul.x - last) * 6, -14, 14);
      last = soul.x;
      const x = clamp(soul.x + drift + rand(-3, 3), box.x + 4, box.x + box.w - 4);
      const warn = 0.6;
      const length = rand(44, 62);
      bullets.push(new Shot({ x, y: floor - 2, harmless: true, life: warn, art: 'knotCrack' }));
      bullets.push(new Line({
        x, y: floor, angle: -Math.PI / 2, length, thickness: 5, warn, life: 0.95, grow: 380, color: BARK,
      }));
      // The grab, toward whichever side you're on (or either, right on top).
      const way = soul.x < x - 2 ? Math.PI : soul.x > x + 2 ? 0 : (Math.random() < 0.5 ? 0 : Math.PI);
      const y = clamp(soul.y, floor - length + 4, floor - 8);
      bullets.push(new Line({
        x, y, angle: way + rand(-0.12, 0.12), length: rand(22, 28), thickness: 3, warn: warn + 0.35, life: 0.5, grow: 260, color: '#8a6a44',
      }));
    }, { first: 0.3 });
    return { duration: 6.5, update: (dt, bullets, soul) => root(dt, bullets, soul) };
  },

  // Spit Take: it hawks acorns out of its knot-hole, up over the top of the
  // box, and they come down where you're standing (or just beside it) and
  // bounce twice before they roll off. Every third spit is three at once.
  knotAcorns(box, density, { Shot, every, rand, clamp }) {
    const floor = box.y + box.h;
    const mouth = { x: box.x + box.w / 2, y: box.y - 4 };
    const gravity = 150;
    let acorns = [];
    let spit = 0;
    const lob = (bullets, targetX) => {
      const vy = rand(5, 20);
      // How long it takes to reach the floor, so it lands on target.
      const drop = floor - 3 - mouth.y;
      const t = (-vy + Math.sqrt(vy * vy + 2 * gravity * drop)) / gravity;
      const x = mouth.x + rand(-6, 6);
      const acorn = new Shot({ x, y: mouth.y, vx: (targetX - x) / t, vy, gravity, art: 'knotAcorn' });
      acorn.bounces = 0;
      bullets.push(acorn);
      acorns.push(acorn);
    };
    const hawk = every(0.7, 0.85, (bullets, soul) => {
      const at = clamp(soul.x, box.x + 4, box.x + box.w - 4);
      if (spit++ % 3 === 2) {
        for (const off of [-22, 0, 22]) lob(bullets, clamp(at + off, box.x + 3, box.x + box.w - 3));
      } else {
        lob(bullets, at + (spit % 2 ? 0 : rand(-12, 12)));
      }
    }, { first: 0.2 });
    return {
      duration: 6.5,
      update: (dt, bullets, soul) => {
        hawk(dt, bullets, soul);
        for (const acorn of acorns) {
          // Off the walls, and up off the floor (lower each time).
          if ((acorn.x < box.x + 2 && acorn.vx < 0) || (acorn.x > box.x + box.w - 2 && acorn.vx > 0)) acorn.vx = -acorn.vx;
          if (acorn.y >= floor - 3 && acorn.vy > 0 && acorn.bounces < 2) {
            acorn.y = floor - 3;
            acorn.vy = -acorn.vy * 0.6;
            acorn.bounces++;
          }
        }
        acorns = acorns.filter((acorn) => acorn.y < floor + 10);
      },
    };
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
      duration: 7,
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
      duration: 7,
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
};
