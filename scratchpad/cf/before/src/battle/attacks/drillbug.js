import { defineBulletArt } from '../projectiles.js';
import { PathShot, Deco, Guide } from './coastKit.js';

// The Drillbug's attacks. It's a beetle with a drill for a nose and a lamp
// on its helmet, very proud of its tunnels, and an awful navigator:
//   - Through the wall: the drill bores in along your row; the holes spit grit.
//   - Boring along: it tunnels under your trail and bursts up where you were.
//   - Rail: a rail-load of rock dust whizzes along a mine-cart rail.
//   - The lamp: its helmet lamp sweeps the box. Stay in the light and it
//     finds you, and the drill comes straight down the beam.
//   - The wrong turn: it plans a tunnel (the plan shows, dotted), digs
//     exactly along it, and comes up in somebody's cellar at the end.
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

// The cellar's trapdoor, at the end of the plan (harmless).
defineBulletArt('drillTrapdoor', {
  frames: [['RRRRRRR', 'RrrkrrR', 'RrrkrrR', 'RkkkkkR', 'RrrkrrR', 'RRRRRRR']],
  palette: { R: '#4a321c', r: '#8a6238', k: '#241810' },
  radius: 1,
});

// What's in the cellar: a jam jar and a potato.
defineBulletArt('drillJar', {
  frames: [['.www.', 'wkkkw', 'wrrrw', 'wrlrw', 'wrrrw', '.www.']],
  palette: { w: '#e8f0f4', k: '#d8b060', r: '#c83c4c', l: '#ff9aa8' },
  radius: 2.2,
  spin: 4,
});
defineBulletArt('drillSpud', {
  frames: [['.ppp.', 'ppPpp', 'pPppP', '.ppp.']],
  palette: { p: '#c8a066', P: '#8a6a3a' },
  radius: 2,
  spin: 3,
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
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && count < 5) {
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
          next = t + 1.6;
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
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= nextDot && t < 9) {
          nextDot = t + 0.22;
          const dot = { x: soul.x, y: soul.y, at: t };
          dots.push(dot);
          bullets.push(new Shot({ x: soul.x, y: soul.y + 3, harmless: true, life: 3, art: 'drillTunnelDot' }));
        }
        // (Seven, closer together, now each shows where it'll come up.)
        if (t >= nextBurst && bursts < 10 && t < 9) {
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

  // Rail: a mine-cart rail flickers into being across the box, and a
  // rail-load of rock dust comes whizzing along it, shedding stones that
  // fall away below. The first rail is across your row.
  drillRail(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let next = 0.15;
    let count = 0;
    let carts = [];
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && count < 5) {
          const fromRight = count % 2 === 0;
          const y = clamp(soul.y + (count ? rand(-9, 9) : rand(-3, 3)), box.y + 8, box.y + box.h - 8);
          const warn = 0.85;
          bullets.push(new Rail({ x: box.x, y, w: box.w, warn, life: 1.6 }));
          const cart = new Shot({ x: fromRight ? box.x + box.w - 6 : box.x + 6, y: y - 1, vx: (fromRight ? -1 : 1) * 92, warn, art: 'drillRubble', life: 2 });
          cart.shed = 0;
          carts.push(cart);
          bullets.push(cart);
          count++;
          next = t + 1.7;
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

  // The lamp: it pokes its head through a hole in the wall and looks for you
  // with the lamp on its helmet. The beam sweeps the box (it's only light),
  // and swings after you once its edge touches you, a little slower than
  // you can run. Stay in it a moment and it's found you: the beam goes red, and down it
  // comes the drill, straight along the middle of the beam. Step out of the
  // middle. Then it tries the hole on the other side.
  drillLamp(box, density, { Shot }) {
    const SPOT = 0.22;
    const LOCK = 0.5;
    const HALF = 0.24;
    const WIDE = HALF * 1.35;
    const SWEEP = 1.25;
    const FOLLOW = 1.1;
    const HOLE = 2.7;
    const beam = { x: 0, y: 0, a: 0, locked: 0, on: false };
    let now = 0;
    let hole = -1;
    let seen = 0;
    let rest = 0;
    let dir = 1;
    const lo = Math.PI / 2 + 0.12;
    const hi = (3 * Math.PI) / 2 - 0.12;
    return {
      duration: 8.2,
      update: (dt, bullets, soul) => {
        const real = dt / density;
        now += real;
        const h = Math.floor(now / HOLE);
        if (h !== hole && h < 3) {
          hole = h;
          // A new hole: right wall, then left, then right, at a fresh height.
          const right = h % 2 === 0;
          beam.right = right;
          beam.x = right ? box.x + box.w : box.x;
          beam.y = box.y + 14 + Math.random() * (box.h - 28);
          beam.a = right ? (Math.random() < 0.5 ? lo : hi) : (Math.random() < 0.5 ? lo - Math.PI : hi - Math.PI);
          dir = beam.a === lo || beam.a === lo - Math.PI ? 1 : -1;
          beam.on = true;
          beam.locked = 0;
          seen = 0;
          rest = 0.45;
          bullets.push(new Shot({ x: beam.x, y: beam.y, harmless: true, art: 'drillHole', life: HOLE - 0.1 }));
          bullets.push(new Deco({
            life: HOLE - 0.05,
            paint: (ctx) => {
              const r = 120;
              ctx.globalAlpha *= beam.locked > 0 ? 0.32 : 0.16;
              ctx.fillStyle = beam.locked > 0 ? '#ff6a4a' : '#fff2a0';
              ctx.beginPath();
              ctx.moveTo(beam.x, beam.y);
              ctx.lineTo(beam.x + Math.cos(beam.a - WIDE) * r, beam.y + Math.sin(beam.a - WIDE) * r);
              ctx.lineTo(beam.x + Math.cos(beam.a + WIDE) * r, beam.y + Math.sin(beam.a + WIDE) * r);
              ctx.closePath();
              ctx.fill();
            },
          }));
        }
        if (!beam.on || now > HOLE * 3 - 0.2) return;
        if (rest > 0) {
          rest -= real;
          return;
        }
        if (beam.locked > 0) {
          beam.locked -= real;
          if (beam.locked <= 0) rest = 0.35;
          return;
        }
        // Sweep, turning back at the walls; but once the edge of the light
        // touches you, it swings after you (not quite as fast as you can run).
        const span = beam.right ? [lo, hi] : [lo - Math.PI, hi - Math.PI];
        const to = Math.atan2(soul.y - beam.y, soul.x - beam.x);
        const diff = Math.atan2(Math.sin(to - beam.a), Math.cos(to - beam.a));
        if (Math.abs(diff) < WIDE + 0.08) {
          beam.a += Math.sign(diff) * Math.min(Math.abs(diff), FOLLOW * real);
          dir = Math.sign(diff) || dir;
        } else beam.a += dir * SWEEP * real;
        if (beam.a > span[1]) { beam.a = span[1]; dir = -1; }
        if (beam.a < span[0]) { beam.a = span[0]; dir = 1; }
        // Are you in the light?
        const off = Math.abs(Math.atan2(Math.sin(to - beam.a), Math.cos(to - beam.a)));
        seen = off < HALF ? seen + real : Math.max(0, seen - real);
        if (seen >= SPOT) {
          // Found you. The beam reddens, holds, and the drill comes down it.
          seen = 0;
          beam.locked = LOCK + 0.5;
          beam.a = to;
          bullets.push(new Shot({ x: beam.x, y: beam.y, vx: Math.cos(to) * 150, vy: Math.sin(to) * 150, warn: LOCK, art: 'drillTip', life: 1.2 }));
          // Grit thrown out either side of it, so it's a proper step aside.
          for (const off of [-0.2, -0.1, 0.1, 0.2]) {
            const a = to + off;
            bullets.push(new Shot({ x: beam.x, y: beam.y, vx: Math.cos(a) * 120, vy: Math.sin(a) * 120, warn: LOCK + 0.06, art: 'drillGrit', life: 1.3 }));
          }
        }
      },
    };
  },

  // The wrong turn: it plans a tunnel, and the plan shows, dotted, before it
  // digs: in from a wall, past you, and off round a turn or two, because it
  // has no idea where it's going. Then the drill comes along exactly that
  // line. Where the plan ends is somebody's cellar, and it bursts up into it,
  // and out come the jars and the potatoes, all round.
  drillRoute(box, density, { Shot, rand, clamp }) {
    const T = (s) => s * density;
    const PLAN = 0.85;
    const SPEED = 110;
    let t = 0;
    let n = 0;
    return {
      duration: 8.2,
      update: (dt, bullets, soul) => {
        t += dt;
        if (n >= 3 || t < T(0.1 + n * 2.5)) return;
        n++;
        // In from a wall, through a spot right beside you, then two wrong turns.
        const side = Math.floor(rand(0, 4));
        const start = [
          { x: box.x - 4, y: rand(box.y + 8, box.y + box.h - 8) },
          { x: box.x + box.w + 4, y: rand(box.y + 8, box.y + box.h - 8) },
          { x: rand(box.x + 8, box.x + box.w - 8), y: box.y - 4 },
          { x: rand(box.x + 8, box.x + box.w - 8), y: box.y + box.h + 4 },
        ][side];
        const pts = [start, { x: clamp(soul.x + rand(-5, 5), box.x + 6, box.x + box.w - 6), y: clamp(soul.y + rand(-5, 5), box.y + 6, box.y + box.h - 6) }];
        for (let i = 0; i < 2; i++) {
          const last = pts[pts.length - 1];
          let p;
          for (let tries = 0; tries < 30; tries++) {
            p = { x: rand(box.x + 10, box.x + box.w - 10), y: rand(box.y + 10, box.y + box.h - 10) };
            if (Math.hypot(p.x - last.x, p.y - last.y) > 26 && (i < 1 || Math.hypot(p.x - soul.x, p.y - soul.y) > 22)) break;
          }
          pts.push(p);
        }
        // Lengths along the route, for the drill's clock.
        const legs = [];
        let total = 0;
        for (let i = 1; i < pts.length; i++) {
          const len = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
          legs.push({ a: pts[i - 1], b: pts[i], from: total, len });
          total += len;
          bullets.push(new Guide({ x: pts[i - 1].x, y: pts[i - 1].y, angle: Math.atan2(pts[i].y - pts[i - 1].y, pts[i].x - pts[i - 1].x), length: len, warn: PLAN + total / SPEED, color: '#d2b080' }));
        }
        const along = (d) => {
          const leg = legs.find((l) => d <= l.from + l.len) ?? legs[legs.length - 1];
          const u = Math.min(1, (d - leg.from) / leg.len);
          return { x: leg.a.x + (leg.b.x - leg.a.x) * u, y: leg.a.y + (leg.b.y - leg.a.y) * u, a: Math.atan2(leg.b.y - leg.a.y, leg.b.x - leg.a.x) };
        };
        const time = total / SPEED;
        bullets.push(new PathShot({ path: (k) => along(Math.min(total, k * SPEED)), warn: PLAN, art: 'drillTip', life: time }));
        // The tunnel caves in behind it: loose grit along the route for a moment.
        for (let d = 6; d < total; d += 9) {
          const p = along(d);
          bullets.push(new Shot({ x: p.x, y: p.y, harmless: false, warn: PLAN + d / SPEED, art: 'drillGrit', life: 0.6 }));
        }
        // The cellar: its trapdoor shows at the end of the plan, then out it all comes.
        const end = pts[pts.length - 1];
        bullets.push(new Shot({ x: end.x, y: end.y, harmless: true, art: 'drillTrapdoor', life: PLAN + time }));
        const turn = rand(0, Math.PI);
        for (let i = 0; i < 12; i++) {
          const a = turn + (i / 12) * Math.PI * 2;
          bullets.push(new Shot({ x: end.x, y: end.y, vx: Math.cos(a) * 44, vy: Math.sin(a) * 44, warn: PLAN + time, art: i % 3 === 0 ? 'drillJar' : 'drillSpud', life: 1.8 }));
        }
      },
    };
  },
};
