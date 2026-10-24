import { defineBulletArt } from '../projectiles.js';

// The Lamp Mites' attacks. They're tiny dusty moths that nest in the dead
// street lamps of the old city, and they can't leave anything that glows
// alone: your SOUL glows. So they fight the way moths do round a light, and
// all at once, in swarms: pouring out of an old lamp and streaming at you,
// shaking dust off their wings, bursting out through panes of old lamp
// glass, circling round and round you, and darting about in those mad
// zigzags moths do. Lots of tiny, quick things; none of them big.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape. Their `density` is high, so their own clock
// (`t`) runs fast: about 8 of it fits in a turn.

const WING = { w: '#c8bca8', W: '#8a7e70', F: '#b0a088', f: '#e8dcc0', a: '#6a5e50' };
const DUST = { d: '#d8c890', D: '#f4ecc8' };
const SCALE = { w: '#c8bca8', W: '#8a7e70' };
const GLASS = { G: '#6a8494', g: '#b8d0d8', w: '#ffffff' };
const PANE = { k: '#2a2430', i: '#6a6278', G: '#3a4650', g: '#8aa8b4', w: '#ffffff' };
const LAMP = { k: '#1a1620', i: '#4a4458', I: '#6a6278', G: '#2a3038', g: '#5a6a70', f: '#e8dcc0', e: '#101010' };

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

// A scale off a wing, see-sawing down.
defineBulletArt('miteScale', {
  frames: [['.w', 'wW', 'W.']],
  palette: SCALE,
  radius: 1.2,
  spin: 4,
});

// A sliver of old lamp glass, tumbling.
defineBulletArt('miteShard', {
  frames: [['g...', 'Gg..', 'GGg.', 'GGGw']],
  palette: GLASS,
  radius: 1.8,
  spin: 9,
});

// A pane of old lamp glass in its iron frame (harmless): it cracks, more
// and more, then they burst out through it.
defineBulletArt('mitePane', {
  frames: [
    ['kiiiiik', 'iGGgGGi', 'iGgGGGi', 'iGGGGgi', 'iGgGGGi', 'iGGGgGi', 'kiiiiik'],
    ['kiiiiik', 'iGGgGGi', 'iGgwGGi', 'iGGwwgi', 'iGwGGGi', 'iGGGgGi', 'kiiiiik'],
    ['kiiiiik', 'iwGgGwi', 'iGwwGwi', 'iwGwwgi', 'iGwGwGi', 'iwGGgwi', 'kiiiiik'],
  ],
  palette: PANE,
  radius: 1,
  frameSeconds: 0.2,
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

export const LAMP_MITE_ATTACKS = {
  // The swarm: a dead lamp leans in over one top corner of the box, and
  // they come pouring out of it in a stream, all wanting your light,
  // swerving after you. Halfway through, the lamp on the other side wakes
  // up too.
  miteSwarm(box, density, { Shot, rand }) {
    let t = 0;
    let next = 0.4;
    let lamps = [];
    const lampAt = (bullets, side) => {
      const x = side < 0 ? box.x + 8 : box.x + box.w - 8;
      const lamp = new Shot({ x, y: box.y + 3, harmless: true, life: 4.2, art: 'miteLamp' });
      bullets.push(lamp);
      lamps.push({ lamp, x, y: box.y + 8 });
    };
    return {
      duration: 6.6,
      update: (dt, bullets, soul) => {
        if (t === 0) lampAt(bullets, Math.random() < 0.5 ? -1 : 1);
        t += dt;
        if (lamps.length === 1 && t > 3.6) lampAt(bullets, lamps[0].x < box.x + box.w / 2 ? 1 : -1);
        // Every so often the stream stops for a breath.
        const pause = (t % 2.6) > 2.1;
        if (t >= next && t < 8 && !pause) {
          next = t + rand(0.14, 0.2);
          for (const { x, y } of lamps) {
            const aim = Math.atan2(soul.y - y, soul.x - x) + rand(-0.45, 0.45);
            const speed = rand(40, 52);
            bullets.push(new Shot({
              x, y, vx: Math.cos(aim) * speed, vy: Math.sin(aim) * speed,
              homing: { target: soul, turn: 0.9 }, life: 2.4, art: 'miteMite',
            }));
          }
        }
      },
    };
  },

  // Dust: they're all up over the box, beating their wings, and a curtain
  // of dust sifts down out of them. There's always a clear patch where
  // fewer of them are, and it wanders. Now and then a wing scale comes
  // see-sawing down through it.
  miteDust(box, density, { Shot, rand }) {
    let t = 0;
    let next = 0;
    let scales = [];
    const gapWidth = 20;
    return {
      duration: 6.4,
      update: (dt, bullets) => {
        t += dt;
        const gap = box.x + box.w / 2 + Math.sin(t * 0.55) * (box.w / 2 - gapWidth / 2 - 4);
        if (t >= next && t < 8) {
          next = t + 0.3;
          for (let x = box.x + 3 + rand(0, 4); x < box.x + box.w - 2; x += rand(6, 8)) {
            if (Math.abs(x - gap) < gapWidth / 2) continue;
            bullets.push(new Shot({ x, y: box.y - 3, vx: rand(-4, 4), vy: rand(30, 36), art: 'miteDust' }));
          }
          // A scale, falling through the clear patch.
          if (Math.random() < 0.35) {
            const scale = new Shot({ x: gap, y: box.y - 3, vy: 18, art: 'miteScale' });
            scale.baseX = gap;
            scales.push(scale);
            bullets.push(scale);
          }
        }
        for (const scale of scales) scale.x = scale.baseX + Math.sin(scale.age * 3) * 8;
        scales = scales.filter((scale) => scale.y < box.y + box.h + 6);
      },
    };
  },

  // Old glass: panes of lamp glass turn up round the box, crack, and burst,
  // and the glass flies out every way, with a couple of mites in it that
  // were nesting behind.
  miteGlass(box, density, { Shot, rand, pointAwayFrom }) {
    let t = 0;
    let next = 0.2;
    let panes = [];
    return {
      duration: 6.6,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 7.6) {
          next = t + 1.05;
          const at = pointAwayFrom(box, soul, 30, 10);
          const pane = new Shot({ x: at.x, y: at.y, harmless: true, life: 0.6, art: 'mitePane' });
          pane.burstAt = t + 0.6;
          bullets.push(pane);
          panes.push(pane);
        }
        for (const pane of panes) {
          if (pane.burst || t < pane.burstAt) continue;
          pane.burst = true;
          const count = 9;
          const turn = rand(0, Math.PI * 2);
          for (let i = 0; i < count; i++) {
            const angle = turn + (i / count) * Math.PI * 2;
            const speed = rand(42, 56);
            bullets.push(new Shot({ x: pane.x, y: pane.y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, art: 'miteShard' }));
          }
          // The mites that lived behind it, off after your light.
          for (let i = 0; i < 2; i++) {
            const aim = Math.atan2(soul.y - pane.y, soul.x - pane.x) + (i ? 0.5 : -0.5);
            bullets.push(new Shot({ x: pane.x, y: pane.y, vx: Math.cos(aim) * 50, vy: Math.sin(aim) * 50, life: 2.5, art: 'miteMite' }));
          }
        }
        panes = panes.filter((pane) => !pane.burst);
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
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 7.2) {
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

  // Zigzag: one at a time, quick as anything, mites dart in from the edges
  // at you, and halfway there each one changes its mind, the way moths do,
  // and jinks off somewhere else.
  miteDart(box, density, { Shot, rand, edgePoint }) {
    let t = 0;
    let next = 0.1;
    let darts = [];
    return {
      duration: 6.4,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 8) {
          next = t + rand(0.22, 0.3);
          const from = edgePoint(box, undefined, 2);
          const aim = Math.atan2(soul.y - from.y, soul.x - from.x);
          const speed = rand(70, 85);
          const dart = new Shot({ x: from.x, y: from.y, warn: 0.3, vx: Math.cos(aim) * speed, vy: Math.sin(aim) * speed, art: 'miteMite' });
          dart.jinkAt = rand(0.25, 0.45);
          darts.push(dart);
          bullets.push(dart);
        }
        for (const dart of darts) {
          if (dart.jinked || dart.age - dart.warn < dart.jinkAt) continue;
          dart.jinked = true;
          const heading = Math.atan2(dart.vy, dart.vx) + (Math.random() < 0.5 ? -1 : 1) * rand(0.6, 0.9);
          const speed = Math.hypot(dart.vx, dart.vy);
          dart.vx = Math.cos(heading) * speed;
          dart.vy = Math.sin(heading) * speed;
        }
        darts = darts.filter((dart) => !dart.jinked);
      },
    };
  },
};
