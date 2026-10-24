import { defineBulletArt } from '../projectiles.js';

// The Slipjack's attacks. It's an eel that lives in the Old Drains' fast
// culvert currents and rides them for fun, so it fights with the water and
// with itself: currents that run across the box and carry you with them,
// itself shooting through in an S with bubbles in its wake, lunging wall to
// wall, coiling round you and pulling tight, and a whirlpool it swims round
// and round. Its body is a chain of pieces that follow its head along the
// way it went, so you dodge the whole eel, not just its teeth.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape.

const EEL = { k: '#0e1410', o: '#3a4a2c', h: '#5e7640', y: '#d8c46a', w: '#e8ffc8', e: '#000000', m: '#a83040', f: '#8aa84a' };
const WATER = { b: '#8ad0e8', B: '#3a8ab0', w: '#ffffff' };
const FISH = { s: '#c8d8e0', S: '#7a92a0', k: '#0e1410', f: '#e8f4f8' };

// Its head, drawn pointing right: one big eye and the grin.
defineBulletArt('slipHead', {
  frames: [[
    '..kkkkk..',
    '.khhhkwk.',
    'khoookek.',
    'kooooohkk',
    'kyymmmmmm',
    '.kywywyk.',
    '..kkkkk..',
  ]],
  palette: EEL,
  radius: 3.5,
  rotate: true,
});
// A length of its body, with the fin along the top.
defineBulletArt('slipBody', {
  frames: [['.fff.', 'khhhk', 'koook', 'kyyyk', '.kkk.']],
  palette: EEL,
  radius: 2.5,
  rotate: true,
});
// Its tail, a little flag of fin.
defineBulletArt('slipTail', {
  frames: [['ff....', '.ffkk.', '..kook', '.ffkk.', 'ff....']],
  palette: EEL,
  radius: 2,
  rotate: true,
});

// Bubbles from its wake, wobbling as they go: a big one and a little one.
defineBulletArt('slipBubble', {
  frames: [['.bb.', 'bw.b', 'b..b', '.bb.'], ['.bb.', 'b.wb', 'b..b', '.bb.']],
  palette: WATER,
  radius: 1.8,
  frameSeconds: 0.2,
});
defineBulletArt('slipFroth', {
  frames: [['.b.', 'bwb', '.b.']],
  palette: WATER,
  radius: 1.3,
});
// Spray off its snap, a drop flying.
defineBulletArt('slipSpray', {
  frames: [['Bbw']],
  palette: WATER,
  radius: 1.2,
  rotate: true,
});
// A minnow it's chasing, drawn swimming right.
defineBulletArt('slipMinnow', {
  frames: [['S.sss.', '.SsfSk', 'S.sss.'], ['.Ssss.', 'S.sfSk', '.Ssss.']],
  palette: FISH,
  radius: 1.6,
  rotate: true,
  frameSeconds: 0.14,
});
// A streak of fast water (harmless: it shows which way a current runs).
defineBulletArt('slipRipple', {
  frames: [['BBbbw']],
  palette: WATER,
  radius: 1,
  rotate: true,
});
// The whirlpool: the swirl (harmless) and its dark eye (not).
defineBulletArt('slipSwirl', {
  frames: [[
    '....BBBBB....',
    '..BB.....bB..',
    '.B...bbbb..B.',
    '.B..b....b.B.',
    'B..b..BB..b.B',
    'B..b.B..B.b.B',
    'B.b..B..b.b.B',
    'B.b..bBB..b.B',
    'B..b.....b..B',
    '.B..bbbbb..B.',
    '.Bb.......B..',
    '..BBB...BB...',
    '.....BBB.....',
  ]],
  palette: WATER,
  radius: 1,
  spin: 3,
});
defineBulletArt('slipEye', {
  frames: [['.kBk.', 'kBkBk', 'BkwkB', 'kBkBk', '.kBk.']],
  palette: { ...WATER, k: '#0e2030' },
  radius: 3.5,
  spin: -6,
});

// An eel: its head and a chain of body pieces that follow along the way its
// head has been (`trail`, newest first), then its tail. Move it by calling
// `to(x, y)`; it faces where it's going.
function makeEel(bullets, Shot, { x, y, length = 9, gap = 4.5, warn = 0, life = Infinity }) {
  const head = new Shot({ x, y, warn, life, art: 'slipHead', angle: 0 });
  const parts = Array.from({ length }, (_, i) => new Shot({ x, y, warn, life, art: i === length - 1 ? 'slipTail' : 'slipBody', angle: 0 }));
  bullets.push(...parts.slice().reverse(), head);
  const trail = [{ x, y }];
  const eel = {
    head,
    parts,
    to(nx, ny) {
      const last = trail[0];
      if (nx !== last.x || ny !== last.y) head.angle = Math.atan2(ny - last.y, nx - last.x);
      head.x = nx;
      head.y = ny;
      trail.unshift({ x: nx, y: ny });
      if (trail.length > 400) trail.length = 400;
      // Each piece sits `gap` pixels further back along the trail.
      let walked = 0;
      let i = 0;
      parts.forEach((part, n) => {
        const want = (n + 1) * gap;
        while (i < trail.length - 1) {
          const step = Math.hypot(trail[i].x - trail[i + 1].x, trail[i].y - trail[i + 1].y);
          if (walked + step >= want) break;
          walked += step;
          i++;
        }
        const a = trail[i];
        const b = trail[Math.min(i + 1, trail.length - 1)];
        const step = Math.hypot(a.x - b.x, a.y - b.y) || 1;
        const k = Math.min(1, Math.max(0, (want - walked) / step));
        part.x = a.x + (b.x - a.x) * k;
        part.y = a.y + (b.y - a.y) * k;
        part.angle = Math.atan2(a.y - b.y, a.x - b.x);
      });
    },
    // It's gone: all of it fades.
    end() {
      for (const shot of [head, ...parts]) shot.life = Math.max(0, shot.age - shot.warn);
    },
  };
  // Lay the body out behind the head, back the way it's coming from.
  return eel;
}

export const SLIPJACK_ATTACKS = {
  // The culvert run: the box is four lanes of water, and the Slipjack opens
  // the sluices on them one or two at a time. Ripples show which way a lane
  // is about to run; then it runs, and carries you along if you're in it,
  // with minnows swept down it. Now and then the Slipjack rides one itself,
  // whooping. The still lanes are safe.
  slipRun(box, density, { Shot, every, rand, pick, shuffleBag }) {
    const laneH = box.h / 4;
    const lanes = [0, 1, 2, 3].map((i) => ({ top: box.y + i * laneH, dir: 0, warn: 0, run: 0 }));
    const nextLane = shuffleBag([0, 1, 2, 3]);
    let eels = [];
    let opens = 0;
    const open = every(1.2, 1.5, (bullets, soul) => {
      opens++;
      // Every third time, it rides the lane you're in itself.
      const riding = opens % 3 === 0;
      const yours = Math.min(3, Math.max(0, Math.floor((soul.y - box.y) / laneH)));
      const picks = new Set(riding ? [yours] : []);
      const count = opens % 3 === 2 ? 2 : 1;
      while (picks.size < count) picks.add(nextLane());
      for (const i of picks) {
        const lane = lanes[i];
        if (lane.run > 0 || lane.warn > 0) continue;
        lane.dir = pick([-1, 1]);
        lane.warn = 0.55;
        lane.run = 0;
        lane.ride = riding && i === yours;
        // Ripples blink where it'll run, pointing the way.
        for (let k = 0; k < 4; k++) {
          bullets.push(new Shot({
            x: box.x + 10 + k * 20, y: lane.top + laneH / 2, harmless: true, warn: 0.55, life: 0.01,
            art: 'slipRipple', angle: lane.dir > 0 ? 0 : Math.PI,
          }));
        }
      }
    }, { first: 0.2 });
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        open(dt, bullets, soul);
        for (const lane of lanes) {
          if (lane.warn > 0) {
            lane.warn -= dt;
            if (lane.warn <= 0) {
              lane.run = 1.5;
              lane.spawn = 0;
              if (lane.ride) {
                const from = lane.dir > 0 ? box.x - 6 : box.x + box.w + 6;
                // Right along where you are in the lane.
                const rideY = Math.min(lane.top + laneH - 3, Math.max(lane.top + 3, soul.y));
                eels.push({ eel: makeEel(bullets, Shot, { x: from, y: rideY, length: 8 }), dir: lane.dir, y: rideY, x: from });
              }
            }
            continue;
          }
          if (lane.run <= 0) continue;
          lane.run -= dt;
          const y = lane.top + laneH / 2;
          // The water runs: streaks along it, and minnows swept down it.
          lane.spawn -= dt;
          if (lane.spawn <= 0) {
            lane.spawn = 0.16;
            const from = lane.dir > 0 ? box.x - 3 : box.x + box.w + 3;
            bullets.push(new Shot({ x: from, y: y + rand(-7, 7), vx: lane.dir * 120, harmless: true, life: 0.8, art: 'slipRipple' }));
            if (Math.random() < 0.45) {
              bullets.push(new Shot({ x: from, y: y + rand(-9, 9), vx: lane.dir * rand(62, 80), wobble: { amplitude: 2, frequency: 9 }, art: 'slipMinnow' }));
            }
          }
          // And it carries you with it.
          if (soul.y >= lane.top && soul.y < lane.top + laneH) soul.x += lane.dir * 36 * dt;
        }
        for (const ride of eels) {
          ride.x += ride.dir * 150 * dt;
          ride.eel.to(ride.x, ride.y + Math.sin(ride.x / 6) * 3);
          if (Math.abs(ride.x - (box.x + box.w / 2)) > box.w / 2 + 50) {
            ride.eel.end();
            ride.done = true;
          }
        }
        eels = eels.filter((ride) => !ride.done);
      },
    };
  },

  // Look at me go: the Slipjack shoots through the box in a big S, showing
  // off, and leaves a trail of bubbles hanging in its wake that slowly rise.
  // A string of ripples blinks along the way it's going to go first. Across,
  // then down, then across the other way.
  slipShowOff(box, density, { Shot, rand }) {
    const passes = [];
    let made = 0;
    let t = 0;
    const cx = box.x + box.w / 2;
    const cy = box.y + box.h / 2;
    // Where pass `p` is at `s` pixels along its way.
    const pointOf = (p, s) => {
      const wave = Math.sin(s / p.wavelength * Math.PI * 2 + p.phase) * p.amp;
      return p.across
        ? { x: p.start + p.dir * s, y: cy + wave }
        : { x: cx + wave, y: p.start + p.dir * s };
    };
    const launch = (bullets) => {
      const across = made !== 1;
      const dir = made === 2 ? -1 : 1;
      const span = across ? box.w : box.h;
      const start = across ? (dir > 0 ? box.x - 14 : box.x + box.w + 14) : box.y - 14;
      const p = { across, dir, start, amp: rand(22, 28), wavelength: rand(52, 62), phase: rand(0, Math.PI * 2), s: 0, length: span + 80, warn: 0.6 };
      // The route, blinking.
      for (let s = 14; s < span + 14; s += 7) {
        const a = pointOf(p, s);
        const b = pointOf(p, s + 1);
        bullets.push(new Shot({ x: a.x, y: a.y, harmless: true, warn: 0.6, life: 0.01, art: 'slipRipple', angle: Math.atan2(b.y - a.y, b.x - a.x) }));
      }
      const first = pointOf(p, 0);
      p.eel = makeEel(bullets, Shot, { x: first.x, y: first.y, length: 10 });
      p.bubble = 0;
      passes.push(p);
      made++;
    };
    return {
      duration: 6.9,
      update: (dt, bullets) => {
        t += dt;
        if (made < 3 && t >= 0.1 + made * 2.1) launch(bullets);
        for (const p of passes) {
          if (p.warn > 0) {
            p.warn -= dt;
            continue;
          }
          p.s += 105 * dt;
          const at = pointOf(p, p.s);
          p.eel.to(at.x, at.y);
          // Bubbles left hanging in its wake, which drift up.
          p.bubble -= dt;
          const inside = at.x > box.x && at.x < box.x + box.w && at.y > box.y && at.y < box.y + box.h;
          if (p.bubble <= 0 && inside) {
            p.bubble = 0.13;
            bullets.push(new Shot({ x: at.x + rand(-2, 2), y: at.y + rand(-2, 2), vy: -rand(6, 12), wobble: { amplitude: 1.5, frequency: 5 }, life: 2.2, art: Math.random() < 0.5 ? 'slipBubble' : 'slipFroth' }));
          }
          if (p.s > p.length) {
            p.eel.end();
            p.done = true;
          }
        }
        for (let i = passes.length - 1; i >= 0; i--) if (passes[i].done) passes.splice(i, 1);
      },
    };
  },

  // Snap: its head shows at one wall, level with you, and ripples run
  // across the box where it's going to go. Then it lunges wall to wall, the
  // whole of it, faster than anything, and snaps its jaws at the far side:
  // spray flies back off it. From the sides, and then from above.
  slipSnap(box, density, { Shot, rand, clamp, shuffleBag }) {
    const side = shuffleBag(['left', 'right', 'top']);
    const lunges = [];
    let made = 0;
    let t = 0;
    const plan = (bullets, soul) => {
      const from = side();
      const across = from !== 'top';
      const dir = from === 'right' ? -1 : 1;
      const lane = across ? clamp(soul.y + rand(-4, 4), box.y + 6, box.y + box.h - 6) : clamp(soul.x + rand(-4, 4), box.x + 6, box.x + box.w - 6);
      const start = across ? (dir > 0 ? box.x - 4 : box.x + box.w + 4) : box.y - 4;
      const span = across ? box.w : box.h;
      const angle = across ? (dir > 0 ? 0 : Math.PI) : Math.PI / 2;
      for (let s = 8; s < span; s += 9) {
        bullets.push(new Shot({
          x: across ? start + dir * s : lane, y: across ? lane : start + s,
          harmless: true, warn: 0.6, life: 0.01, art: 'slipRipple', angle,
        }));
      }
      // Its head waits at the wall, blinking.
      const point = (s) => (across ? { x: start + dir * s, y: lane } : { x: lane, y: start + s });
      const eel = makeEel(bullets, Shot, { ...point(-1), length: 9, warn: 0.6 });
      eel.head.angle = angle;
      lunges.push({ eel, point, s: 0, wait: 0.6, span, angle, snapped: false });
      made++;
    };
    return {
      duration: 6.6,
      update: (dt, bullets, soul) => {
        t += dt;
        if (made < 5 && t >= 0.15 + made * 1.2) plan(bullets, soul);
        for (const l of lunges) {
          if (l.wait > 0) {
            l.wait -= dt;
            continue;
          }
          l.s += 270 * dt;
          const p = l.point(l.s);
          l.eel.to(p.x, p.y);
          if (!l.snapped && l.s >= l.span - 4) {
            // Snap! Spray flies back off its jaws.
            l.snapped = true;
            for (let i = -2; i <= 2; i++) {
              const a = l.angle + Math.PI + i * 0.38;
              bullets.push(new Shot({ x: p.x, y: p.y, vx: Math.cos(a) * 70, vy: Math.sin(a) * 70, accel: -40, life: 1.4, art: 'slipSpray' }));
            }
          }
          if (l.s > l.span + 70) {
            l.eel.end();
            l.done = true;
          }
        }
        for (let i = lunges.length - 1; i >= 0; i--) if (lunges[i].done) lunges.splice(i, 1);
      },
    };
  },

  // Coil: it wraps itself round the box in a ring and pulls tight. There's
  // one gap, between its head and its tail, and the ring turns, so the gap
  // goes round. Get out through it before it closes up on you; then it
  // lets go and the ring comes out again, so get back in.
  slipCoil(box, density, { Shot, rand, pick }) {
    const cx = box.x + box.w / 2;
    const cy = box.y + box.h / 2;
    const count = 32;
    const missing = 5;
    const pieces = [];
    let spin = rand(0, Math.PI * 2);
    let way = pick([-1, 1]);
    let t = 0;
    let built = false;
    const build = (bullets) => {
      for (let i = 0; i < count - missing; i++) {
        const art = i === 0 ? 'slipTail' : i === count - missing - 1 ? 'slipHead' : 'slipBody';
        const shot = new Shot({ x: cx, y: cy, warn: 0.7, art, angle: 0 });
        shot.slot = i;
        pieces.push(shot);
        bullets.push(shot);
      }
      built = true;
    };
    // How far out the ring is: tightening, then letting go, twice.
    const radiusAt = (time) => {
      const cycle = 3.1;
      const k = (time % cycle) / cycle;
      return k < 0.62 ? 54 - (54 - 3) * (k / 0.62) : 3 + (54 - 3) * ((k - 0.62) / 0.38);
    };
    return {
      duration: 6.8,
      update: (dt, bullets) => {
        t += dt;
        if (!built) build(bullets);
        // Each time it lets go, it turns the other way.
        const was = Math.floor((t - dt) / 3.1);
        if (Math.floor(t / 3.1) !== was) way = -way;
        spin += way * 0.55 * dt;
        const r = t < 0.7 ? 54 : radiusAt(t - 0.7);
        for (const shot of pieces) {
          const a = spin + (shot.slot / count) * Math.PI * 2;
          shot.x = cx + Math.cos(a) * r;
          shot.y = cy + Math.sin(a) * r;
          shot.angle = a + (Math.PI / 2) * way;
        }
        if (t > 6.5) for (const shot of pieces) shot.life = Math.min(shot.life, shot.age - shot.warn);
      },
    };
  },

  // The whirlpool: it swims round and round the box till the water turns,
  // and the middle pulls you in. Don't get pulled down the dark eye in the
  // middle; don't get swept out into the Slipjack going round the edge. And
  // minnows caught in the swirl spiral in past you.
  slipWhirl(box, density, { Shot, every, rand }) {
    const cx = box.x + box.w / 2;
    const cy = box.y + box.h / 2;
    let eel = null;
    let angle = rand(0, Math.PI * 2);
    let t = 0;
    let fish = [];
    const swirl = new Shot({ x: cx, y: cy, harmless: true, art: 'slipSwirl' });
    const eye = new Shot({ x: cx, y: cy, warn: 0.8, art: 'slipEye' });
    let started = false;
    const catchFish = every(0.32, 0.42, (bullets) => {
      const a = rand(0, Math.PI * 2);
      const shot = new Shot({ x: cx + Math.cos(a) * 46, y: cy + Math.sin(a) * 46, warn: 0.3, art: Math.random() < 0.6 ? 'slipMinnow' : 'slipBubble' });
      shot.polar = { a, r: 46 };
      fish.push(shot);
      bullets.push(shot);
    }, { first: 0.6 });
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (!started) {
          started = true;
          bullets.push(swirl, eye);
          eel = makeEel(bullets, Shot, { x: cx + Math.cos(angle) * 37, y: cy + Math.sin(angle) * 37, length: 12, gap: 4.2, warn: 0.5 });
        }
        // Round it goes, a little faster as the water gets going.
        angle += (1.7 + Math.min(t, 4) * 0.12) * dt;
        eel.to(cx + Math.cos(angle) * 37, cy + Math.sin(angle) * 37);
        // The pull, towards the middle (and a little round with the water).
        if (t > 0.8 && t < 6.4) {
          const a = Math.atan2(soul.y - cy, soul.x - cx);
          const d = Math.hypot(soul.x - cx, soul.y - cy);
          if (d > 2) {
            soul.x -= Math.cos(a) * 17 * dt;
            soul.y -= Math.sin(a) * 17 * dt;
            soul.x += -Math.sin(a) * 9 * dt;
            soul.y += Math.cos(a) * 9 * dt;
          }
        }
        if (t < 6.2) catchFish(dt, bullets);
        for (const f of fish) {
          if (f.age < f.warn) continue;
          f.polar.a += 2.1 * dt;
          f.polar.r -= 13 * dt;
          f.x = cx + Math.cos(f.polar.a) * f.polar.r;
          f.y = cy + Math.sin(f.polar.a) * f.polar.r;
          f.angle = f.polar.a + Math.PI / 2;
          if (f.polar.r < 6) {
            f.life = f.age - f.warn;
            f.done = true;
          }
        }
        fish = fish.filter((f) => !f.done);
        if (t > 6.4) {
          eel.end();
          eye.life = Math.min(eye.life, eye.age - eye.warn);
          swirl.life = Math.min(swirl.life, swirl.age);
        }
      },
    };
  },
};
