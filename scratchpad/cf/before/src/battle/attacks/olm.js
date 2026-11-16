import { defineBulletArt } from '../projectiles.js';
import { Ring, Glow, dimmed, stillness } from './underShapes.js';
import { PathShot } from './coastKit.js';

// The Olm's attacks. It's a long, pale, blind salamander, older than the
// stair, and it is terribly polite and hates being looked at. So it fights
// the way a very polite thing would if it had to:
//   - Coiling: its long body winds round the box (apologising).
//   - Eggs: it lays some (so sorry), and they hatch into tiny olms.
//   - The queue: its hatchlings file across in a polite queue, nose to
//     tail, each exactly where the leader went, and stop to let you go first.
//   - The dark: it puts the lights out so it can't be seen.
//   - Dripping: water runs off it, in rhythm.
// It never moves fast. It just doesn't stop.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape. The attack's own clock (`t`) runs `density`
// times faster than the seconds on the wall, hence the `T` below.

const BODY = { k: '#1c1418', p: '#ecd4d4', P: '#fbeeec', B: '#c8a4ac', b: '#a88290', r: '#e04a50', R: '#a82a3c', q: '#ff8a8e', e: '#2a1a22' };
const GLOWY = { k: '#6a3a58', p: '#fff0ee', P: '#ffffff', B: '#f0c8d0', r: '#ff6a70', e: '#2a1a22', g: '#ffd8e0' };
const EGG = { k: '#3a3048', e: '#c8d8e8', E: '#f0f8ff', d: '#5a4a6a', w: '#ffffff' };
const WATER = { a: '#4e6a9c', A: '#a4c0e4', h: '#d0e0f4', w: '#ffffff' };

// One round piece of its body.
defineBulletArt('olmSeg', {
  frames: [['.kkk.', 'kpPpk', 'kPpBk', 'kpBBk', '.kkk.']],
  palette: BODY,
  radius: 2.8,
});

// Its head, heading right: a long flat snout and a ruff of frills.
defineBulletArt('olmHead', {
  frames: [
    ['..rr.....', '.rRrkkkk.', 'rqrkppPPk', '.rRkpePPk', '..rkkkkkk'],
    ['...r.....', '.rrrkkkk.', 'rqRkppPPk', '.rrkpePPk', '..rkkkkkk'],
  ],
  palette: BODY,
  radius: 3.4,
  rotate: true,
  frameSeconds: 0.25,
});

// A feather of its gill frills, heading right.
defineBulletArt('olmFrill', {
  frames: [
    ['..rrr...', 'rrRrrrq.', '.rrRrrrq', 'rrRrrrq.', '..rrr...'],
    ['..rrr...', 'rrrRrrq.', '.rRrrrrq', 'rrrRrrq.', '..rrr...'],
  ],
  palette: BODY,
  hitbox: { w: 7, h: 3 },
  rotate: true,
  frameSeconds: 0.18,
});

// An egg: pale and clear, with something curled up inside.
defineBulletArt('olmEgg', {
  frames: [
    ['.kkk.', 'keEek', 'kEddk', 'keEek', 'kEEek', '.kkk.'],
    ['.kkk.', 'keEek', 'kEdEk', 'keddk', 'kEEek', '.kkk.'],
  ],
  palette: EGG,
  radius: 2.6,
  frameSeconds: 0.4,
});

// A bit of shell, afterwards (harmless).
defineBulletArt('olmShell', {
  frames: [['.e', 'ek'], ['e.', 'ke']],
  palette: EGG,
  radius: 1,
  spin: 5,
});

// A hatchling: a pinprick olm, wriggling, with two red whiskers of gill.
defineBulletArt('olmHatchling', {
  frames: [
    ['r...kkkk', 'rppppPPk', '.ppPkkkk'],
    ['r..kkkkk', 'rppppPPk', '..pPkkkk'].map((row) => row.slice(0, 8)),
    ['r...kkkk', 'rpPpppPk', 'rppkkkkk'],
  ],
  palette: BODY,
  radius: 1.8,
  rotate: true,
  frameSeconds: 0.1,
});

// A piece of the body in the dark: it glows, so it can be seen.
defineBulletArt('olmGlowSeg', {
  frames: [['..ggg..', '.gpppg.', 'gpPPPpg', 'gpPPPpg', '.gpppg.', '..ggg..']],
  palette: GLOWY,
  radius: 3,
});
defineBulletArt('olmGlowHead', {
  frames: [['..rr......', '.grrkkkkk.', 'grpppPPPg.', 'gpppePPPPg', '.gppPPPPg.', '..gggggg..']],
  palette: GLOWY,
  radius: 3.6,
  rotate: true,
});

// A drop of water off its skin; a big one.
defineBulletArt('olmDrop', {
  frames: [['.h.', '.h.', 'hAh', 'hAh', '.h.']],
  palette: WATER,
  radius: 1.7,
});
defineBulletArt('olmDropBig', {
  frames: [['..h..', '..h..', '.hAh.', '.hAAh', 'hAAAh', 'hAwAh', '.hAh.', '..h..']],
  palette: WATER,
  radius: 3,
});

// The path a snake of segments follows: a spiral round the middle of the
// box, winding in. Built once; `at(s)` gives the point `s` pixels along it.
function spiral(cx, cy, outer, inner, turns, clockwise) {
  const points = [];
  const total = Math.PI * 2 * turns;
  let theta = -0.9;
  let s = -80;
  const start = Math.random() * Math.PI * 2;
  while (s < 520) {
    const f = Math.max(0, theta) / total;
    const r = outer + (inner - outer) * Math.min(1, f) + Math.max(0, -theta) * 8;
    const a = start + (clockwise ? theta : -theta);
    points.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, a: a + (clockwise ? Math.PI / 2 : -Math.PI / 2) });
    theta += 1.2 / r;
    s += 1.2;
  }
  return (at) => points[Math.max(0, Math.min(points.length - 1, Math.round((at + 80) / 1.2)))];
}

export const OLM_ATTACKS = {
  // Coiling: its long body comes winding in round the box in a spiral, head
  // first, and then another comes the other way round, tighter. You can ride
  // the gaps between the coils, but not forever: the middle gets smaller, and
  // if you sit in it, it flicks a frill at you.
  olmCoil(box, density, { Shot }) {
    const T = (s) => s * density;
    const still = stillness();
    let nextFlick = 0;
    const cx = box.x + box.w / 2;
    const cy = box.y + box.h / 2;
    const snakes = [];
    let t = 0;
    const make = (outer, inner, turns, clockwise, length, speed) => {
      const path = spiral(cx, cy, outer, inner, turns, clockwise);
      return { path, speed, length, head: null, segs: [], s: 0 };
    };
    snakes.push({ ...make(62, 6, 1.5, true, 17, 60), startAt: 0.1 });
    snakes.push({ ...make(54, 20, 1.1, false, 13, 50), startAt: T(2.6) });
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        // Stood in the middle of the coil: it flicks a frill at you, politely.
        if (still(dt, soul) > 0.8 && t >= nextFlick) {
          nextFlick = t + 0.6;
          const from = { x: box.x + (Math.random() < 0.5 ? -3 : box.w + 3), y: box.y + Math.random() * box.h };
          const aim = Math.atan2(soul.y - from.y, soul.x - from.x);
          bullets.push(new Shot({ x: from.x, y: from.y, warn: 0.3, vx: Math.cos(aim) * 62, vy: Math.sin(aim) * 62, art: 'olmFrill' }));
        }
        for (const snake of snakes) {
          if (t < snake.startAt) continue;
          if (!snake.head) {
            snake.head = new Shot({ x: -99, y: -99, art: 'olmHead' });
            bullets.push(snake.head);
            for (let i = 0; i < snake.length; i++) {
              const seg = new Shot({ x: -99, y: -99, art: 'olmSeg' });
              snake.segs.push(seg);
              bullets.push(seg);
            }
          }
          snake.s += snake.speed * (dt / density);
          const p = snake.path(snake.s);
          snake.head.x = p.x;
          snake.head.y = p.y;
          snake.head.angle = p.a;
          snake.segs.forEach((seg, i) => {
            const q = snake.path(snake.s - 5.4 * (i + 1));
            seg.x = q.x;
            seg.y = q.y;
          });
        }
      },
    };
  },

  // Eggs: it is so sorry, but it has laid some. They come drifting down all
  // across the box, slowly, swaying, and after a moment each one hatches: a
  // puff of shell, and a tiny olm that wriggles after you.
  olmEggs(box, density, { Shot, rand, spreadAcross }) {
    const T = (s) => s * density;
    const nextX = spreadAcross(box.x + 6, box.x + box.w - 6, 6);
    let t = 0;
    let next = 0.1;
    let eggs = [];
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < T(5.4)) {
          next = t + 0.62;
          const x = nextX();
          const egg = new Shot({ x, y: box.y - 3, vy: rand(13, 17), art: 'olmEgg' });
          egg.baseX = x;
          egg.sway = rand(0, Math.PI * 2);
          egg.hatchAt = rand(1.4, 2.4);
          eggs.push(egg);
          bullets.push(egg);
        }
        for (const egg of eggs) {
          egg.x = egg.baseX + Math.sin(egg.age * 2 + egg.sway) * 4;
          if (egg.age < egg.hatchAt) continue;
          egg.spent = true;
          for (let i = 0; i < 3; i++) {
            bullets.push(new Shot({ x: egg.x, y: egg.y, vx: rand(-22, 22), vy: rand(-26, -6), gravity: 90, life: 0.5, harmless: true, art: 'olmShell' }));
          }
          const aim = Math.atan2(soul.y - egg.y, soul.x - egg.x);
          bullets.push(new Shot({
            x: egg.x, y: egg.y, warn: 0.2, vx: Math.cos(aim) * 36, vy: Math.sin(aim) * 36,
            homing: { target: soul, turn: 1.5 }, wobble: { amplitude: 1.5, frequency: 14 }, life: 3, art: 'olmHatchling',
          }));
        }
        eggs = eggs.filter((egg) => !egg.spent);
      },
    };
  },

  // The dark: it can't bear to be seen, so it puts the lights out. The box
  // goes dim, with only a small pool of light round you, and the olm's own
  // pale body glows as it slides across in long waves, and water drips off it
  // in the dark: the drops are only there where your light reaches, so
  // watch the body, and what falls from it.
  olmDim(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    const light = { x: box.x + box.w / 2, y: box.y + box.h / 2, r: 22 };
    const Dim = dimmed(Shot, light, 0.07);
    const glow = new Glow(light, { color: '255, 236, 238', alpha: 0.22 });
    let t = 0;
    let started = false;
    const crossings = [
      { start: 0.5, from: -1, mid: rand(0.2, 0.34), amp: 20, freq: 0.075, phase: 0 },
      { start: T(2.3), from: 1, mid: rand(0.66, 0.8), amp: 20, freq: 0.09, phase: 2 },
      { start: T(4.1), from: -1, mid: rand(0.42, 0.58), amp: 18, freq: 0.08, phase: 4 },
    ];
    let nextRain = 1.2;
    let nextDrip = 1;
    const bodies = [];
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        if (!started) {
          started = true;
          bullets.push(glow);
        }
        t += dt;
        light.x = soul.x;
        light.y = soul.y;
        // The light closes in over the first moments.
        light.r = Math.max(15, 28 - t * 6);
        for (const c of crossings) {
          if (t < c.start || c.body) continue;
          c.body = { head: new Shot({ x: -99, y: -99, art: 'olmGlowHead' }), segs: [], s: 0 };
          bullets.push(c.body.head);
          for (let i = 0; i < 15; i++) {
            const seg = new Shot({ x: -99, y: -99, art: 'olmGlowSeg' });
            c.body.segs.push(seg);
            bullets.push(seg);
          }
          bodies.push(c);
        }
        const place = (c, s) => {
          const x = c.from < 0 ? box.x - 10 + s : box.x + box.w + 10 - s;
          const y = box.y + box.h * c.mid + Math.sin(s * c.freq * 0.8 + c.phase) * c.amp;
          const dy = Math.cos(s * c.freq * 0.8 + c.phase) * c.amp * c.freq * 0.8;
          return { x, y, a: Math.atan2(dy, c.from < 0 ? 1 : -1) };
        };
        for (const c of bodies) {
          c.body.s += 40 * (dt / density);
          const h = place(c, c.body.s);
          c.body.head.x = h.x;
          c.body.head.y = h.y;
          c.body.head.angle = h.a;
          c.body.segs.forEach((seg, i) => {
            const q = place(c, c.body.s - 5.2 * (i + 1));
            seg.x = q.x;
            seg.y = q.y;
          });
        }
        // And water falling from the roof of the cave, down onto wherever you are.
        if (t >= nextRain && t < T(6.6)) {
          nextRain = t + 0.9;
          bullets.push(new Dim({ x: Math.max(box.x + 5, Math.min(box.x + box.w - 5, soul.x + rand(-5, 5))), y: box.y - 2, warn: 0.5, vy: 30, gravity: 40, art: 'olmDrop' }));
        }
        // Drips off it, in the dark.
        if (t >= nextDrip && t < T(6.6)) {
          nextDrip = t + 0.26;
          const live = bodies.filter((c) => c.body.s < box.w + 140);
          if (live.length) {
            const c = live[Math.floor(Math.random() * live.length)];
            const seg = c.body.segs[Math.floor(rand(1, c.body.segs.length))];
            if (seg.x > box.x && seg.x < box.x + box.w) {
              bullets.push(new Dim({ x: seg.x, y: seg.y + 3, warn: 0.25, vy: 14, gravity: 120, art: 'olmDrop' }));
            }
          }
        }
      },
    };
  },

  // Dripping: water runs off it in the dark above the box and falls, in
  // rhythm: plink, plink, plink, and a long wait, and a big one. Where each
  // lands, a flat ripple runs out along the floor both ways, and the big one
  // breaks into spray. Every second drop falls where you're standing.
  olmDrip(box, density, { Shot, rand, clamp }) {
    const T = (s) => s * density;
    let t = 0;
    let next = 0.1;
    let count = 0;
    let drops = [];
    // The rhythm: gaps between drops, repeating.
    const GAPS = [0.28, 0.28, 0.28, 0.75, 0.28, 0.28, 0.28, 1.0];
    const floor = box.y + box.h - 2;
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < T(6.6)) {
          const gap = GAPS[count % GAPS.length];
          next = t + gap * (0.6 + 0.4 * density / 1.5);
          const big = count % GAPS.length === 7;
          const x = clamp(count % 2 === 0 ? soul.x + rand(-4, 4) : rand(box.x + 6, box.x + box.w - 6), box.x + 5, box.x + box.w - 5);
          const drop = new Shot({ x, y: box.y + 3, warn: 0.5, vy: 12, gravity: big ? 90 : 120, art: big ? 'olmDropBig' : 'olmDrop' });
          drop.big = big;
          drops.push(drop);
          bullets.push(drop);
          count++;
        }
        for (const drop of drops) {
          if (drop.y < floor - 2) continue;
          drop.spent = true;
          bullets.push(new Ring({ x: drop.x, y: floor, r: 2, grow: drop.big ? 44 : 34, thick: 1.6, warn: 0.05, life: drop.big ? 1 : 0.7, squash: 0.28, color: '#a4c0e4', glow: '#4e6a9c' }));
          if (drop.big) {
            for (let i = -2; i <= 2; i++) {
              bullets.push(new Shot({ x: drop.x, y: floor - 2, vx: i * 14, vy: -rand(55, 80), gravity: 190, life: 1, art: 'olmDrop' }));
            }
          }
        }
        drops = drops.filter((drop) => !drop.spent);
      },
    };
  },

  // The queue: its hatchlings have been brought up very politely, and they
  // go everywhere in a queue, nose to tail, each one exactly where the one in
  // front went. The eldest leads (it flickers at the wall first), wriggling
  // across the box past where you were, stops there a moment to let you go
  // first (after you, no, after you), and carries on out the other side. The
  // whole queue stops and starts with it. Two queues at a time, one from each
  // side, one through your spot and one just past it. Watch the leaders.
  olmQueue(box, density, { rand, clamp }) {
    const T = (s) => s * density;
    const LONG = 12;
    const GAP = 0.1;
    const GO = 1.2;
    const BOW = 0.45;
    let t = 0;
    let n = 0;
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (n >= 3 || t < T(0.1 + n * 2.3)) return;
        n++;
        // Two queues at once, one from each side: one right through where
        // you are, the other just past you.
        for (const fromLeft of [true, false]) {
          const side = fromLeft ? -1 : 1;
          const S = { x: fromLeft ? box.x - 4 : box.x + box.w + 4, y: rand(box.y + 8, box.y + box.h - 8) };
          const E = { x: fromLeft ? box.x + box.w + 8 : box.x - 8, y: rand(box.y + 8, box.y + box.h - 8) };
          const P = { x: clamp(soul.x, box.x + 6, box.x + box.w - 6), y: clamp(soul.y + (fromLeft === (n % 2 === 1) ? 0 : side * rand(9, 14)), box.y + 6, box.y + box.h - 6) };
          // A curve through where you were: halfway along it, it's on that spot.
          const C = { x: 2 * P.x - (S.x + E.x) / 2, y: 2 * P.y - (S.y + E.y) / 2 };
          const bez = (u) => {
            const a = (1 - u) * (1 - u);
            const b = 2 * (1 - u) * u;
            const c = u * u;
            return { x: a * S.x + b * C.x + c * E.x, y: a * S.y + b * C.y + c * E.y };
          };
          // How far along the curve it is after k seconds: there, a bow, and on.
          const u = (k) => {
            if (k < GO) return 0.5 * (k / GO);
            if (k < GO + BOW) return 0.5;
            return Math.min(1.15, 0.5 + 0.5 * ((k - GO - BOW) / GO));
          };
          const path = (k) => {
            const now = bez(u(Math.max(0, k)));
            const ahead = bez(u(Math.max(0, k)) + 0.02);
            const a = Math.atan2(ahead.y - now.y, ahead.x - now.x);
            // A little wriggle side to side as it goes (not while it bows).
            const w = k > GO && k < GO + BOW ? 0 : Math.sin(k * 14) * 1.6;
            return { x: now.x - Math.sin(a) * w, y: now.y + Math.cos(a) * w, a };
          };
          for (let i = 0; i < LONG; i++) {
            bullets.push(new PathShot({ art: 'olmHatchling', warn: 0.6, life: GO * 2 + BOW + 0.3 + i * GAP, path: (k) => path(k - i * GAP) }));
          }
        }
      },
    };
  },
};
