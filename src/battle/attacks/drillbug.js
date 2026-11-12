import { defineBulletArt } from '../projectiles.js';

// The Drillbug's attacks. It's a beetle with a drill for a nose, proud of
// its tunnels, so it digs: it drills through the walls of the box and the
// holes spit grit, it bores along under your feet and bursts out where you
// were, it spins up drill bits and sends them off, it makes the whole place
// rumble and rocks come down, and it sends a rail-load of rock dust whizzing
// across. Every tunnel it digs, it digs towards you.
//
// It stands to the right of the box. Each attack is a factory
// `(box, density, tools) => ({ duration, update })`; see dummy.js for the
// shape. The rails are a custom bullet (same four methods as Shot: update,
// isGone, edgeDistance, draw).

const GRIT = { r: '#a88a5c', R: '#6a4a2c', d: '#d2b080', k: '#3a2a1a' };
const STEEL = { s: '#c4d0dc', S: '#6a7c8e', w: '#f0f6fc', k: '#2a3440' };
const DIRT = { d: '#74522e', D: '#4a321c', u: '#a88a5c', k: '#241810' };
const ROCK = { r: '#8e8478', R: '#5e564e', l: '#b8aea0', k: '#2e2824' };
const DUST = { d: '#d2b080', D: '#a88a5c', w: '#efe0c0' };

// A chip of rock, spat out of a tunnel.
defineBulletArt('drillGrit', {
  frames: [['.r.', 'rdR', '.R.'], ['.d.', 'rRr', '.r.']],
  palette: GRIT,
  radius: 1.5,
  spin: 4,
});

// A little stone.
defineBulletArt('drillPebble', {
  frames: [['.lr.', 'lrrR', 'rrRR', '.RR.']],
  palette: ROCK,
  radius: 2,
  spin: 2,
});

// A big rock off the ceiling.
defineBulletArt('drillRock', {
  frames: [[
    '..kkkk..',
    '.kllrrk.',
    'klrrrrRk',
    'krrrrRRk',
    'krrrRRRk',
    'krrRRRRk',
    '.kRRRRk.',
    '..kkkk..',
  ]],
  palette: ROCK,
  radius: 3.5,
  spin: 1.5,
});

// A drill bit, drawn pointing right, banded like a screw.
defineBulletArt('drillBit', {
  frames: [
    ['.....ss...', 'kSSsswwss.', 'kSSwsswSSs', 'kSSsswwss.', '.....ss...'],
    ['.....ss...', 'kSSwwssss.', 'kSSsswwSSs', 'kSSwwssss.', '.....ss...'],
  ],
  palette: STEEL,
  radius: 2.6,
  rotate: true,
  frameSeconds: 0.05,
});

// The drill tip poking through a wall, drawn pointing right.
defineBulletArt('drillTip', {
  frames: [
    ['kS........', 'kSSsw.....', 'kSSswwss..', 'kSSsswwsss', 'kSSswwss..', 'kSSsw.....', 'kS........'],
    ['kS........', 'kSSws.....', 'kSSsswwss.', 'kSSswwssss', 'kSSsswwss.', 'kSSws.....', 'kS........'],
  ],
  palette: STEEL,
  radius: 3,
  rotate: true,
  frameSeconds: 0.05,
});

// A hole it left in the wall.
defineBulletArt('drillHole', {
  frames: [['.uddu.', 'uDkkDu', 'dkkkkd', 'uDkkDu', '.uddu.']],
  palette: DIRT,
  radius: 1,
});

// A heap of loose dirt over a tunnel (harmless: a bore is on its way).
defineBulletArt('drillMound', {
  frames: [['..uu..', '.udduu', 'uddDdu', 'DDDDDD']],
  palette: DIRT,
  radius: 1,
});

// A dark scuff in the floor where it's been tunnelling (harmless).
defineBulletArt('drillTunnelDot', {
  frames: [['.uu.', 'uDDu', '.uu.']],
  palette: DIRT,
  radius: 1,
});

// The rail-load of rock dust: a boiling little cloud with stones in it.
defineBulletArt('drillRubble', {
  frames: [
    ['..wdddw....', '.wdDddDdw..', 'wddrDdDdddw', 'dDdDddrdDdd', 'wdDddDdddDw', '.dDddDddDd.', '..DDddDDD..'],
    ['...wddw....', '.wddDdddw..', 'wdDddDrddDw', 'ddDdrddDddd', 'wddDddDdddw', '.dDdddDdDd.', '..DDdDDDD..'],
  ],
  palette: { ...DUST, r: '#8e8478' },
  radius: 3,
  hitbox: { w: 12, h: 7 },
  frameSeconds: 0.1,
});

// A mine-cart rail across the box: two lines with ties. Harmless; it only
// shows where the load is coming.
class Rail {
  constructor({ x, y, w, warn = 0.8, life = 2.4 }) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.warn = warn;
    this.life = life;
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
    this.vx = 0;
    this.vy = 0;
  }

  update(dt) {
    this.age += dt;
  }

  isGone() {
    return this.age > this.warn + this.life + 0.3;
  }

  edgeDistance() {
    return Infinity;
  }

  draw(ctx) {
    const blink = this.age < this.warn ? (Math.floor(this.age * 10) % 2 ? 0.3 : 0.7) : Math.max(0, 1 - (this.age - this.warn - this.life) / 0.3);
    ctx.save();
    ctx.globalAlpha = blink;
    ctx.fillStyle = '#4a321c';
    for (let x = this.x + 2; x < this.x + this.w; x += 6) ctx.fillRect(Math.round(x), Math.round(this.y) - 3, 2, 7);
    ctx.fillStyle = '#a8b4c0';
    ctx.fillRect(Math.round(this.x), Math.round(this.y) - 2, this.w, 1);
    ctx.fillRect(Math.round(this.x), Math.round(this.y) + 2, this.w, 1);
    ctx.fillStyle = '#6a7c8e';
    ctx.fillRect(Math.round(this.x), Math.round(this.y) - 1, this.w, 1);
    ctx.fillRect(Math.round(this.x), Math.round(this.y) + 3, this.w, 1);
    ctx.restore();
  }
}

// A drill through the wall: in fast, held a moment, then back out.
function driveOut(line, depth) {
  const k = line.age - line.warn;
  if (k < 0) return 0;
  if (k < 0.18) return (k / 0.18) * depth;
  if (k < 0.55) return depth;
  return Math.max(0, 1 - (k - 0.55) / 0.3) * depth;
}

export const DRILLBUG_ATTACKS = {
  // Through the wall: a crack runs along the wall, and a drill comes boring
  // right through it, along your row, from one side and then the other. When
  // it backs out it leaves a hole, and the hole spits grit at you.
  drillWalls(box, density, { Shot, Line, rand, clamp }) {
    let t = 0;
    let next = 0.15;
    let count = 0;
    let drills = [];
    let holes = [];
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && count < 5 && t < 5.4) {
          const fromRight = count % 2 === 0;
          const wallX = fromRight ? box.x + box.w : box.x;
          const y = clamp(soul.y + rand(-5, 5), box.y + 7, box.y + box.h - 7);
          const depth = clamp(Math.abs(soul.x - wallX) + 6, 26, 66);
          const dir = fromRight ? Math.PI : 0;
          const warn = 0.85;
          const line = new Line({ x: wallX, y, angle: dir, length: depth, thickness: 5, warn, life: 0.9, color: '#6a7c8e' });
          const tip = new Shot({ x: wallX, y, warn, life: 0.9, angle: dir, art: 'drillTip' });
          bullets.push(line, tip);
          drills.push({ line, tip, wallX, y, dir, depth, fromRight, spat: false });
          // A crack in the wall where it will come through.
          bullets.push(new Shot({ x: wallX + (fromRight ? -2 : 2), y, harmless: true, warn: 0, life: warn, art: 'drillHole' }));
          count++;
          next = t + 1.4;
        }
        for (const drill of drills) {
          if (drill.line.age < drill.line.warn) {
            // Nothing hurts until it goes: the line shows the whole bore, flashing.
            drill.line.length = drill.line.age > drill.line.warn - 0.04 ? 1 : drill.depth;
            drill.tip.x = drill.wallX;
            continue;
          }
          const out = driveOut(drill.line, drill.depth);
          drill.line.length = Math.max(1, out);
          const sign = drill.fromRight ? -1 : 1;
          drill.tip.x = drill.wallX + sign * (out + 3);
          drill.tip.y = drill.y;
          if (!drill.spat && drill.line.age - drill.line.warn > 0.85) {
            drill.spat = true;
            holes.push({ at: t + 0.1, ...drill });
            bullets.push(new Shot({ x: drill.wallX + (drill.fromRight ? -2 : 2), y: drill.y, harmless: true, life: 1.2, art: 'drillHole' }));
          }
        }
        for (const hole of holes) {
          if (t < hole.at) continue;
          hole.done = true;
          const aim = Math.atan2(soul.y - hole.y, soul.x - hole.wallX);
          for (let i = -2; i <= 2; i++) {
            const a = aim + i * 0.3;
            bullets.push(new Shot({ x: hole.wallX + (hole.fromRight ? -3 : 3), y: hole.y, vx: Math.cos(a) * 54, vy: Math.sin(a) * 54, gravity: 18, art: 'drillGrit', life: 2 }));
          }
        }
        holes = holes.filter((hole) => !hole.done);
        drills = drills.filter((drill) => drill.line.age < drill.line.warn + 1.3);
      },
    };
  },

  // Boring along: it tunnels along under your feet, and you can see its
  // tunnel, a trail of scuffs where you've been. A moment later it bursts up
  // out of the oldest of them, in a ring of grit around a spinning bit. So
  // if you stay in one place, that's where. Before it bursts, the ground
  // heaves into a mound and the rock it'll throw up shows through it,
  // flickering, for MOUND_SECONDS (real seconds, however fast the fight:
  // it was 0.8 of the attack's own quicker clock, about half a second in
  // the Diggings, and the burst came with no warning a dodger could see).
  drillTunnels(box, density, { Shot, rand }) {
    const MOUND_SECONDS = 0.85;
    const dots = [];
    let t = 0;
    let nextDot = 0.1;
    let nextBurst = 1.4;
    let bursts = 0;
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= nextDot && t < 5.6) {
          nextDot = t + 0.22;
          const dot = { x: soul.x, y: soul.y, at: t };
          dots.push(dot);
          bullets.push(new Shot({ x: soul.x, y: soul.y + 3, harmless: true, life: 3, art: 'drillTunnelDot' }));
        }
        // (Seven, closer together, now each shows where it'll come up.)
        if (t >= nextBurst && bursts < 7 && t < 5.6) {
          nextBurst = t + 0.68;
          // The oldest scuff that isn't already spoken for.
          const spot = dots.find((dot) => !dot.used && t - dot.at > 0.9) ?? dots.find((dot) => !dot.used);
          if (spot) {
            spot.used = true;
            const warn = MOUND_SECONDS;
            bullets.push(new Shot({ x: spot.x, y: spot.y + 2, harmless: true, life: warn, art: 'drillMound' }));
            // What it'll throw up shows through the mound, flickering, until
            // it bursts: the rock, the bit (it stays a moment), and the grit
            // in a ring.
            bullets.push(new Shot({ x: spot.x, y: spot.y, art: 'drillRock', warn, life: 0.35 }));
            bullets.push(new Shot({ x: spot.x, y: spot.y - 3, vy: -26, accel: -60, art: 'drillBit', angle: -Math.PI / 2, warn, life: 0.7 }));
            const turn = rand(0, Math.PI / 5);
            for (let i = 0; i < 10; i++) {
              const a = turn + (i / 10) * Math.PI * 2;
              bullets.push(new Shot({ x: spot.x, y: spot.y, vx: Math.cos(a) * 50, vy: Math.sin(a) * 50, gravity: 14, art: 'drillGrit', warn, life: 1.9 }));
            }
            bursts++;
          }
        }
      },
    };
  },

  // Bit rack: drill bits sit in a row along the top, revving (they blink),
  // and one after another each is let go at where you are, picking up speed
  // and slowly turning to follow you as it goes.
  drillBits(box, density, { Shot, rand, shuffleBag }) {
    const racked = [];
    let t = 0;
    let built = false;
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (!built) {
          built = true;
          const order = [...Array(6).keys()].sort(() => Math.random() - 0.5);
          for (let i = 0; i < 6; i++) {
            const x = box.x + 8 + i * ((box.w - 16) / 5);
            const bit = new Shot({ x, y: box.y + 5, harmless: true, angle: Math.PI / 2, life: 8, art: 'drillBit' });
            racked.push({ bit, goAt: 0.9 + order[i] * 0.7 });
            bullets.push(bit);
          }
        }
        for (const slot of racked) {
          if (slot.gone) continue;
          // Revving: it shakes a little before it goes.
          const left = slot.goAt - t;
          if (left < 0.5 && left > 0) slot.bit.x += Math.sin(t * 90) * 0.5;
          if (left > 0) continue;
          slot.gone = true;
          slot.bit.age = 1e9;
          const aim = Math.atan2(soul.y - slot.bit.y, soul.x - slot.bit.x);
          bullets.push(new Shot({ x: slot.bit.x, y: slot.bit.y, vx: Math.cos(aim) * 22, vy: Math.sin(aim) * 22, accel: 75, homing: { target: soul, turn: 1.8 }, art: 'drillBit', life: 3 }));
        }
      },
    };
  },

  // Rumble: the place shakes. Dust trickles from the ceiling in a few
  // places, one of them over you, and a moment later rocks come down where
  // the dust was. Big ones crack on the floor into stones that skip away.
  drillRumble(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let next = 0.15;
    let waves = 0;
    let rocks = [];
    const floor = box.y + box.h - 4;
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && waves < 5 && t < 5.2) {
          waves++;
          next = t + 1.1;
          const xs = [clamp(soul.x + rand(-4, 4), box.x + 5, box.x + box.w - 5)];
          while (xs.length < 3) {
            const x = rand(box.x + 5, box.x + box.w - 5);
            if (xs.every((other) => Math.abs(other - x) > 14)) xs.push(x);
          }
          for (const x of xs) {
            // Dust trickling, where it's about to come down.
            for (let i = 0; i < 4; i++) bullets.push(new Shot({ x: x + rand(-3, 3), y: box.y + 3 + i * 3, vy: 14, harmless: true, life: 0.7, art: 'drillGrit' }));
            const big = Math.random() < 0.5;
            const rock = new Shot({ x, y: box.y + 3, gravity: 200, warn: 0.75, art: big ? 'drillRock' : 'drillPebble', life: 3 });
            rock.big = big;
            rocks.push(rock);
            bullets.push(rock);
          }
        }
        for (const rock of rocks) {
          if (rock.age <= rock.warn || rock.vy <= 0 || rock.y < floor) continue;
          rock.age = 1e9;
          rock.done = true;
          if (rock.big) {
            for (const side of [-1, 1]) {
              bullets.push(new Shot({ x: rock.x, y: floor, vx: side * rand(24, 40), vy: -rand(50, 70), gravity: 200, art: 'drillPebble', life: 1.6 }));
            }
          }
        }
        rocks = rocks.filter((rock) => !rock.done);
      },
    };
  },

  // Rail: a mine-cart rail flickers into being across the box, and a
  // rail-load of rock dust comes whizzing along it, shedding stones that
  // fall away below. The first rail is across your row.
  drillRail(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let next = 0.15;
    let count = 0;
    let carts = [];
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && count < 5 && t < 5.4) {
          const fromRight = count % 2 === 0;
          const y = clamp(soul.y + (count ? rand(-9, 9) : rand(-3, 3)), box.y + 8, box.y + box.h - 8);
          const warn = 0.85;
          bullets.push(new Rail({ x: box.x, y, w: box.w, warn, life: 1.6 }));
          const cart = new Shot({ x: fromRight ? box.x + box.w - 6 : box.x + 6, y: y - 1, vx: (fromRight ? -1 : 1) * 92, warn, art: 'drillRubble', life: 2 });
          cart.shed = 0;
          carts.push(cart);
          bullets.push(cart);
          count++;
          next = t + 1.05;
        }
        for (const cart of carts) {
          if (cart.age <= cart.warn) continue;
          cart.shed -= dt;
          if (cart.shed <= 0) {
            cart.shed = 0.13;
            bullets.push(new Shot({ x: cart.x + rand(-4, 4), y: cart.y + 3, vx: rand(-8, 8), vy: -rand(0, 20), gravity: 160, art: 'drillPebble', life: 1.2 }));
          }
        }
        carts = carts.filter((cart) => cart.age < 3);
      },
    };
  },
};
