import { defineBulletArt } from '../projectiles.js';
import { withSnipes } from './snipes.js';

// The Soot Gull's attacks. A herring gull gone grey with soot, a long way from
// the sea and still a thief: what there is to steal out here is embers. It
// dives through the box along a line it marks first (dotted ticks, which
// follow you until the last moment and then hold), shedding sooty feathers
// behind it; throws fans of feathers; flies over the top dropping its stolen
// embers, which bounce once and fizzle; and shakes itself, so soot clouds
// bloom round you and burst into rings of feathers. It stands to the right
// of the box. When a dive or an ember lands on you it snatches some food from
// the bag (`steals` in src/data/enemies/soot_gull.js).

const SOOT = {
  k: '#141012', a: '#3c3637', A: '#5e5856', g: '#8d8781', G: '#b4aea6', w: '#e8e4dc',
  y: '#d8c060', e: '#ff8c1a', E: '#ffd25e', r: '#a8401a', c: '#24201f',
};

// A sooty feather, pointing the way it flies.
defineBulletArt('sootFeather', {
  frames: [['..AAg..', 'aAgGGGw', '..AAg..'], ['...Ag..', 'aAgGGGw', '..AA...']],
  palette: SOOT,
  radius: 1.8,
  rotate: true,
  frameSeconds: 0.2,
});

// The gull itself, diving: wings swept back, beak first (it points right; it turns to fly).
defineBulletArt('sootDiver', {
  frames: [[
    'aa.........',
    '.aAA.......',
    '..AgGGg....',
    'cAgGGGGgGyy',
    '..AgGGg....',
    '.aAA.......',
    'aa.........',
  ], [
    '...........',
    'aaAA.......',
    '..AgGGg....',
    'cAgGGGGgGyy',
    '..AgGGg....',
    'aaAA.......',
    '...........',
  ]],
  palette: SOOT,
  radius: 3.6,
  rotate: true,
  frameSeconds: 0.08,
});

// The gull flying over the top of the box (harmless), wings out.
defineBulletArt('sootFlyer', {
  frames: [[
    'aA.......Aa',
    '.AgG...GgA.',
    '..gGGgGGg..',
    'y.GGGGGgA..',
    '...aA..Aa..',
  ], [
    '...........',
    '...........',
    'aAgGGgGGgAa',
    'y.GGGGGgA..',
    '...aA..Aa..',
  ]],
  palette: SOOT,
  radius: 1,
  frameSeconds: 0.14,
});

// A stolen ember, bright and wobbling.
defineBulletArt('sootEmber', {
  frames: [['.rer.', 'reEer', 'eEwEe', '.rer.'], ['.rer.', 'reEer', 'eEEEe', '.rer.']],
  palette: SOOT,
  radius: 2.3,
  frameSeconds: 0.08,
});

// A spark off a fizzling ember.
defineBulletArt('sootSpark', { frames: [['.E.', 'EwE', '.E.'], ['E.E', '.w.', 'E.E']], palette: SOOT, radius: 1.4, frameSeconds: 0.07 });

// A soot cloud blooming (harmless): it swells before it bursts.
defineBulletArt('sootCloud', {
  frames: [
    ['...aa...', '..aAAa..', '.aAgAAa.', '.aAAgAa.', '..aAAa..', '...aa...'],
    ['..aAAa..', '.aAgAAa.', 'aAgGAAAa', 'aAAAgAAa', '.aAAAAa.', '..aaaa..'],
  ],
  palette: SOOT,
  radius: 1,
  frameSeconds: 0.18,
});

// Where an ember lands (harmless): a scorch mark, glowing.
defineBulletArt('sootScorch', { frames: [['.r.r.', 'r.e.r', '.r.r.'], ['..r..', '.rer.', '..r..']], palette: SOOT, radius: 1, frameSeconds: 0.1, rim: false });

// The dotted line a dive will take (harmless): it follows you until the last
// moment, then holds still, then the gull comes down it.
class Guide {
  constructor({ x, y, angle, length, life }) {
    Object.assign(this, { x, y, angle, length, life });
    this.age = 0;
    this.grazed = false;
  }

  update(dt) {
    this.age += dt;
  }

  isGone() {
    return this.age >= this.life;
  }

  edgeDistance() {
    return Infinity;
  }

  draw(ctx) {
    const blink = Math.floor(this.age * 10) % 2 ? 0.35 : 0.75;
    ctx.save();
    ctx.globalAlpha = blink;
    ctx.fillStyle = '#b4aea6';
    const dx = Math.cos(this.angle);
    const dy = Math.sin(this.angle);
    for (let d = 0; d < this.length; d += 6) ctx.fillRect(Math.round(this.x + dx * d), Math.round(this.y + dy * d), 2, 1);
    ctx.restore();
  }
}

// Tracks where you're heading (for aiming a touch ahead).
function tracker() {
  const heading = { x: 0, y: 0 };
  let seen = null;
  return {
    heading,
    see(soul, dt) {
      if (seen && dt > 0) {
        heading.x = heading.x * 0.85 + ((soul.x - seen.x) / dt) * 0.15;
        heading.y = heading.y * 0.85 + ((soul.y - seen.y) / dt) * 0.15;
      }
      seen = { x: soul.x, y: soul.y };
    },
  };
}

export const SOOT_GULL_ATTACKS = {
  // Dive: four swoops. Each is marked by a dotted line through where you are
  // (and a little ahead), from outside the box on the far side; the line holds
  // still for the last third of a second, then the gull comes down it, shedding
  // feathers that drift behind.
  sootDive(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let dives = 0;
    const track = tracker();
    const live = [];
    return {
      duration: 7.0,
      update: (dt, bullets, soul) => {
        t += dt;
        track.see(soul, dt);
        if (dives < 4 && t >= 0.2 + dives * 1.45) {
          const guide = new Guide({ x: 0, y: 0, angle: 0, length: 0, life: 0.95 });
          live.push({ guide, lead: dives % 2 ? 0.45 : 0.1, from: dives % 2 ? 'right' : 'top', side: rand(-1, 1) });
          bullets.push(guide);
          dives++;
        }
        const cx = box.x + box.w / 2;
        const cy = box.y + box.h / 2;
        for (const d of live) {
          const g = d.guide;
          if (!d.gone && g.age < g.life - 0.32) {
            const tx = clamp(soul.x + track.heading.x * d.lead, box.x + 4, box.x + box.w - 4);
            const ty = clamp(soul.y + track.heading.y * d.lead, box.y + 4, box.y + box.h - 4);
            // It comes in from the top right, from above or from the side.
            const sx = d.from === 'top' ? cx + 20 + d.side * 22 : box.x + box.w + 14;
            const sy = d.from === 'top' ? box.y - 14 : cy - 26 + d.side * 14;
            const angle = Math.atan2(ty - sy, tx - sx);
            Object.assign(g, { x: sx, y: sy, angle, length: 200 });
          }
          if (!d.diver && g.age >= g.life - 0.02) {
            d.diver = new Shot({ x: g.x, y: g.y, art: 'sootDiver', life: 2.2 });
            d.vx = Math.cos(g.angle) * 175;
            d.vy = Math.sin(g.angle) * 175;
            d.drop = 0;
            bullets.push(d.diver);
          } else if (d.diver && !d.launched) {
            d.launched = true;
            d.diver.vx = d.vx;
            d.diver.vy = d.vy;
          }
          if (d.launched && d.diver.age < 1.5) {
            d.drop -= dt;
            const inside = d.diver.x > box.x && d.diver.x < box.x + box.w && d.diver.y > box.y && d.diver.y < box.y + box.h;
            if (d.drop <= 0 && inside) {
              d.drop = 0.16;
              const a = g.angle + Math.PI + rand(-0.5, 0.5);
              bullets.push(new Shot({ x: d.diver.x, y: d.diver.y, vx: Math.cos(a) * 16, vy: Math.sin(a) * 16 + 6, gravity: 18, art: 'sootFeather', life: 1.1 }));
            }
          }
        }
      },
    };
  },

  // Fans: fans of five feathers flicked from the right side, every other one
  // aimed where you're heading; each fan shows still for a moment first.
  sootFans(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let fans = 0;
    const track = tracker();
    const waiting = [];
    return {
      duration: 6.6,
      update: (dt, bullets, soul) => {
        t += dt;
        track.see(soul, dt);
        if (fans < 7 && t >= 0.2 + fans * 0.75) {
          const x = box.x + box.w + 4;
          const y = clamp(soul.y + rand(-24, 24), box.y + 8, box.y + box.h - 8);
          const lead = fans % 2 ? 0.5 : 0;
          const feathers = [];
          for (let k = -2; k <= 2; k++) {
            const f = new Shot({ x, y, warn: 0.4, art: 'sootFeather', life: 2.4 });
            f.k = k;
            feathers.push(f);
            bullets.push(f);
          }
          waiting.push({ feathers, x, y, lead });
          fans++;
        }
        for (const w of waiting) {
          if (w.fired) continue;
          const age = w.feathers[0].age;
          if (age < w.feathers[0].warn - 0.25) {
            const tx = soul.x + track.heading.x * w.lead;
            const ty = soul.y + track.heading.y * w.lead;
            w.aim = Math.atan2(ty - w.y, tx - w.x);
          }
          for (const f of w.feathers) f.angle = w.aim + f.k * 0.26;
          if (age >= w.feathers[0].warn - 0.02) {
            w.fired = true;
            for (const f of w.feathers) { f.vx = Math.cos(f.angle) * 96; f.vy = Math.sin(f.angle) * 96; }
          }
        }
      },
    };
  },

  // Embers: it flies over the top of the box with its beak full of stolen
  // embers and lets them go: some anywhere, every third one right over you
  // (that one shows still first). Each bounces once off the floor and fizzles
  // into sparks.
  sootEmbers(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let passes = 0;
    let flyer = null;
    let dir = -1;
    let next = 0;
    let count = 0;
    const track = tracker();
    const embers = [];
    return {
      duration: 7.2,
      update: (dt, bullets, soul) => {
        t += dt;
        track.see(soul, dt);
        if ((!flyer || flyer.done) && passes < 3 && t >= 0.2 + passes * 2.1) {
          dir = passes % 2 ? 1 : -1;
          const x = dir < 0 ? box.x + box.w + 12 : box.x - 12;
          flyer = { shot: new Shot({ x, y: box.y + 3, harmless: true, art: 'sootFlyer', life: 2.6 }), dir, started: false };
          bullets.push(flyer.shot);
          next = 0.15;
          passes++;
        }
        if (flyer && !flyer.done) {
          if (!flyer.started) { flyer.started = true; flyer.shot.vx = dir * 62; }
          const fx = flyer.shot.x;
          if (fx < box.x - 14 || fx > box.x + box.w + 14) {
            if (flyer.shot.age > 0.5) flyer.done = true;
          } else {
            next -= dt;
            if (next <= 0) {
              next = 0.24;
              const aimed = count % 3 === 0;
              const ex = aimed ? clamp(soul.x + track.heading.x * 0.35, box.x + 4, box.x + box.w - 4) : clamp(fx + rand(-6, 6), box.x + 3, box.x + box.w - 3);
              const ember = new Shot({ x: ex, y: box.y + 5, vx: rand(-8, 8), vy: 20, gravity: 150, warn: aimed ? 0.35 : 0, art: 'sootEmber', life: 3 });
              ember.bounced = 0;
              embers.push(ember);
              bullets.push(ember);
              count++;
            }
          }
        }
        for (const e of embers) {
          if (e.done || e.age < e.warn) continue;
          if (e.y >= box.y + box.h - 3 && e.vy > 0) {
            if (!e.bounced) {
              e.bounced = 1;
              e.vy = -e.vy * 0.5;
              e.y = box.y + box.h - 3;
              bullets.push(new Shot({ x: e.x, y: box.y + box.h - 2, harmless: true, life: 0.3, art: 'sootScorch' }));
            } else {
              e.done = true;
              e.life = e.age - e.warn;
              for (const s of [-1, 1]) bullets.push(new Shot({ x: e.x, y: box.y + box.h - 4, vx: s * 40, vy: -36, gravity: 90, art: 'sootSpark', life: 0.7 }));
            }
          }
        }
      },
    };
  },

  // Shake: it shakes itself, and soot clouds bloom round you, close but not on
  // you; each swells, then bursts into a ring of feathers.
  sootShake(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let clouds = 0;
    const track = tracker();
    const blooms = [];
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        track.see(soul, dt);
        if (clouds < 6 && t >= 0.2 + clouds * 0.85) {
          const a = rand(0, Math.PI * 2);
          const r = rand(20, 30);
          const x = clamp(soul.x + track.heading.x * 0.3 + Math.cos(a) * r, box.x + 8, box.x + box.w - 8);
          const y = clamp(soul.y + track.heading.y * 0.3 + Math.sin(a) * r, box.y + 8, box.y + box.h - 8);
          const cloud = new Shot({ x, y, harmless: true, art: 'sootCloud', life: 0.7 });
          blooms.push({ cloud, x, y });
          bullets.push(cloud);
          clouds++;
        }
        for (const b of blooms) {
          if (b.done || b.cloud.age < 0.65) continue;
          b.done = true;
          const n = 9;
          const turn = rand(0, Math.PI * 2);
          for (let k = 0; k < n; k++) {
            const a = turn + (k / n) * Math.PI * 2;
            bullets.push(new Shot({ x: b.x, y: b.y, vx: Math.cos(a) * 40, vy: Math.sin(a) * 40, art: 'sootFeather', life: 2 }));
          }
        }
      },
    };
  },
};

// Aimed feathers on top (see snipes.js): with the dives marked so plainly, standing aside was too easy.
SOOT_GULL_ATTACKS.sootDive = withSnipes(SOOT_GULL_ATTACKS.sootDive, { art: 'sootFeather', count: 4, first: 1.0, every: 1.3, lead: ['mean', 0.9, 'mean', 0.4], until: 5.6 });
SOOT_GULL_ATTACKS.sootEmbers = withSnipes(SOOT_GULL_ATTACKS.sootEmbers, { art: 'sootEmber', count: 4, first: 0.8, every: 1.3, lead: [0.9, 'mean', 0.4, 'mean'], until: 6 });
