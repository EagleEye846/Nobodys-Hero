import { defineBulletArt } from '../projectiles.js';

// The Lamp Mites' attacks. They're tiny dusty moths that nest in the dead
// street lamps of the old city, and they can't leave anything that glows
// alone. So they fight the way moths do round a light, and all at once: the
// whole cloud of them streams for whichever old lamp flickers on, they
// bumble about the box bumping into each other in puffs of wing dust, and
// they circle round your own light, tighter and tighter. Lots of tiny,
// quick things; none of them big.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape. Their `density` is high, so their own clock
// (`t`) runs fast: about 11 of it fits in a turn.

const WING = { w: '#c8bca8', W: '#8a7e70', F: '#b0a088', f: '#e8dcc0', a: '#6a5e50' };
const DUST = { d: '#d8c890', D: '#f4ecc8' };
const LAMP = { k: '#1a1620', i: '#4a4458', I: '#6a6278', G: '#2a3038', g: '#5a6a70', f: '#e8dcc0', e: '#101010', y: '#ffe890', Y: '#ffc848', w: '#fffbe0' };

// One mite, drawn heading right: wings open, then shut, very fast.
defineBulletArt('miteMite', {
  frames: [
    ['ww..a', 'WwFFf', 'ww..a'],
    ['..w..', 'wWFFf', '..w..'],
  ],
  palette: WING,
  radius: 1.5,
  rotate: true,
  frameSeconds: 0.05,
});

// A pinch of the dust off their wings: a few grains, glittering.
defineBulletArt('miteDust', {
  frames: [
    ['d.d', '.D.', 'd..'],
    ['.d.', 'dD.', '..d'],
  ],
  palette: DUST,
  radius: 1.3,
  frameSeconds: 0.15,
});

// The dead street lamp they pour out of (harmless), leaning in over the
// top of the box, with a pair of eyes in the dark glass.
defineBulletArt('miteLamp', {
  frames: [
    ['..kk..', '.kiik.', 'kkkkkk', 'kGgeGk', 'kGGGgk', 'kGfGGk', 'kkkkkk', '.kIIk.', '..iI..', '..iI..'],
    ['..kk..', '.kiik.', 'kkkkkk', 'kGgGGk', 'kGGGgk', 'kGeGfk', 'kkkkkk', '.kIIk.', '..iI..', '..iI..'],
  ],
  palette: LAMP,
  radius: 1,
  frameSeconds: 0.3,
});

// The same lamp flickering as it tries to catch, and lit.
defineBulletArt('miteLampFlicker', {
  frames: [
    ['..kk..', '.kiik.', 'kkkkkk', 'kGyGGk', 'kGGGgk', 'kGfGGk', 'kkkkkk', '.kIIk.', '..iI..', '..iI..'],
    ['..kk..', '.kiik.', 'kkkkkk', 'kGgGGk', 'kGGGgk', 'kGfGGk', 'kkkkkk', '.kIIk.', '..iI..', '..iI..'],
    ['..kk..', '.kiik.', 'kkkkkk', 'kyYyYk', 'kYwYyk', 'kyYYyk', 'kkkkkk', '.kIIk.', '..iI..', '..iI..'],
  ],
  palette: LAMP,
  radius: 1,
  frameSeconds: 0.08,
});
defineBulletArt('miteLampLit', {
  frames: [
    ['..kk..', '.kiik.', 'kkkkkk', 'kyYyYk', 'kYwwyk', 'kyYwYk', 'kkkkkk', '.kIIk.', '..iI..', '..iI..'],
    ['..kk..', '.kiik.', 'kkkkkk', 'kYyYyk', 'kywwYk', 'kYwYyk', 'kkkkkk', '.kIIk.', '..iI..', '..iI..'],
  ],
  palette: LAMP,
  radius: 1,
  frameSeconds: 0.2,
});

// Changes a lamp's look (to the art of a bullet made with the new one).
const LOOKS = {};
const setLook = (shot, name, Shot) => {
  LOOKS[name] ??= new Shot({ x: 0, y: 0, art: name }).art;
  shot.artName = name;
  shot.art = LOOKS[name];
};

export const LAMP_MITE_ATTACKS = {
  // Lamplight: four dead street lamps stand round the edge of the box. One
  // flickers, then catches, and every mite there is goes straight for it:
  // a cloud of them pours out of the dark corners, and the ones already
  // flying turn round mid-air. Then it goes out, and another one catches.
  // They're not after you; they're after the light. Keep out of their way,
  // and away from a lamp when it goes out: they scatter off it.
  miteLamps(box, density, { Shot, rand, shuffleBag }) {
    const spots = [
      { x: box.x + 7, y: box.y + box.h / 2 },
      { x: box.x + box.w - 7, y: box.y + box.h / 2 },
      { x: box.x + box.w / 2, y: box.y + box.h - 9 },
      { x: box.x + box.w / 2, y: box.y + 9 },
    ];
    const order = shuffleBag([0, 1, 2, 3]);
    const light = { x: box.x + box.w / 2, y: box.y + box.h / 2 };
    let lamps = null;
    let mites = [];
    let lit = -1;
    let t = 0;
    let next = 0.2;
    let catching = null;
    let settled = 0;
    return {
      duration: 8,
      update: (dt, bullets) => {
        t += dt;
        if (!lamps) {
          lamps = spots.map((spot) => {
            const lamp = new Shot({ x: spot.x, y: spot.y, harmless: true, art: 'miteLamp' });
            bullets.push(lamp);
            return lamp;
          });
        }
        if (t >= next) {
          // The next lamp starts to flicker.
          next = t + 2.4;
          if (lit >= 0) {
            // It goes out, and the ones that settled on it scatter.
            setLook(lamps[lit], 'miteLamp', Shot);
            const count = Math.min(settled, 9);
            const turn = rand(0, Math.PI * 2);
            for (let i = 0; i < count; i++) {
              const out = turn + (i / count) * Math.PI * 2;
              bullets.push(new Shot({ x: light.x, y: light.y, vx: Math.cos(out) * 48, vy: Math.sin(out) * 48, life: 2.2, art: 'miteMite' }));
            }
          }
          settled = 0;
          lit = -1;
          catching = { lamp: order(), at: t + 0.8 };
          setLook(lamps[catching.lamp], 'miteLampFlicker', Shot);
        }
        if (catching && t >= catching.at) {
          // It catches: every mite in the box turns for it, and more come.
          lit = catching.lamp;
          catching = null;
          setLook(lamps[lit], 'miteLampLit', Shot);
          light.x = spots[lit].x;
          light.y = spots[lit].y;
          for (let i = 0; i < 10; i++) {
            // Out of the dark corners, the far ones first.
            const corners = [
              { x: box.x + 2, y: box.y + 2 }, { x: box.x + box.w - 2, y: box.y + 2 },
              { x: box.x + 2, y: box.y + box.h - 2 }, { x: box.x + box.w - 2, y: box.y + box.h - 2 },
            ].sort((p, q) => Math.hypot(q.x - light.x, q.y - light.y) - Math.hypot(p.x - light.x, p.y - light.y));
            const corner = corners[i % 3];
            const from = { x: corner.x + rand(-6, 6), y: corner.y + rand(-6, 6) };
            const angle = Math.atan2(light.y - from.y, light.x - from.x) + rand(-0.5, 0.5);
            const mite = new Shot({
              x: from.x, y: from.y, vx: Math.cos(angle) * 58, vy: Math.sin(angle) * 58,
              warn: 0.35 + i * 0.05, life: 3.2, homing: { target: light, turn: 3.2 }, art: 'miteMite',
            });
            bullets.push(mite);
            mites.push(mite);
          }
        }
        // The ones that reach it settle on the glass.
        for (const mite of mites) {
          if (mite.active && Math.hypot(mite.x - light.x, mite.y - light.y) < 5) {
            mite.life = mite.age - mite.warn;
            settled++;
          }
        }
        mites = mites.filter((mite) => mite.age < mite.warn + mite.life);
      },
    };
  },

  // Bumping about: they come fluttering in and bounce round the box in
  // straight lines, wall to wall, no sense at all. When two of them bump
  // into each other, they both go off in a puff of wing dust that flies out
  // from where they met. Then into you, if you're not careful. Watch for two
  // about to meet.
  miteBump(box, density, { Shot, rand, edgePoint, pick }) {
    let mites = [];
    let spawn = 0.1;
    return {
      duration: 8,
      update: (dt, bullets) => {
        spawn -= dt;
        if (spawn <= 0 && mites.length < 9) {
          spawn = rand(0.32, 0.42);
          const from = edgePoint(box, pick(['top', 'left', 'right', 'bottom']), -4);
          const to = { x: rand(box.x + 15, box.x + box.w - 15), y: rand(box.y + 15, box.y + box.h - 15) };
          const angle = Math.atan2(to.y - from.y, to.x - from.x);
          const mite = new Shot({ x: from.x, y: from.y, vx: Math.cos(angle) * 44, vy: Math.sin(angle) * 44, warn: 0.4, life: 4, bounce: true, art: 'miteMite' });
          bullets.push(mite);
          mites.push(mite);
        }
        mites = mites.filter((mite) => mite.age < mite.warn + mite.life);
        // Bump!
        for (let i = 0; i < mites.length; i++) {
          const a = mites[i];
          if (!a.active) continue;
          for (let j = i + 1; j < mites.length; j++) {
            const b = mites[j];
            if (!b.active || Math.hypot(a.x - b.x, a.y - b.y) > 4) continue;
            const at = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
            a.life = a.age - a.warn;
            b.life = b.age - b.warn;
            const turn = rand(0, Math.PI / 2);
            for (let k = 0; k < 4; k++) {
              const out = turn + (k / 4) * Math.PI * 2;
              bullets.push(new Shot({ x: at.x, y: at.y, vx: Math.cos(out) * 38, vy: Math.sin(out) * 38, life: 1.3, art: 'miteDust' }));
            }
            break;
          }
        }
      },
    };
  },

  // Round the light: a ring of them closes round you, circling, the way
  // moths circle a lamp, tighter and tighter. There's a gap in the ring:
  // get out through it before they close up, because at the end they all
  // scatter, straight out.
  miteCircle(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let next = 0;
    let rings = [];
    const COUNT = 14;
    const GAP = 3;
    const ring = (bullets, soul) => {
      const center = { x: clamp(soul.x, box.x + 14, box.x + box.w - 14), y: clamp(soul.y, box.y + 14, box.y + box.h - 14) };
      const spin = Math.random() < 0.5 ? -1.5 : 1.5;
      const skip = Math.floor(rand(0, COUNT));
      const mites = [];
      for (let i = 0; i < COUNT; i++) {
        if ((i - skip + COUNT) % COUNT < GAP) continue;
        const mite = new Shot({ x: center.x, y: center.y, warn: 0.3, art: 'miteMite' });
        mite.slot = (i / COUNT) * Math.PI * 2;
        mites.push(mite);
        bullets.push(mite);
      }
      rings.push({ center, spin, mites, age: 0, scattered: false });
    };
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 9.6) {
          next = t + 2.4;
          ring(bullets, soul);
        }
        for (const r of rings) {
          r.age += dt;
          if (r.scattered) continue;
          // In from wide to close over a couple of seconds, round and round.
          const radius = Math.max(2, 44 - r.age * 20);
          for (const mite of r.mites) {
            const angle = mite.slot + r.age * r.spin;
            mite.x = r.center.x + Math.cos(angle) * radius;
            mite.y = r.center.y + Math.sin(angle) * radius;
            mite.angle = angle + Math.sign(r.spin) * Math.PI / 2;
          }
          if (r.age > 2.3) {
            r.scattered = true;
            for (const mite of r.mites) {
              const out = Math.atan2(mite.y - r.center.y, mite.x - r.center.x);
              mite.vx = Math.cos(out) * 70;
              mite.vy = Math.sin(out) * 70;
            }
          }
        }
        rings = rings.filter((r) => r.age < 5);
      },
    };
  },
};
