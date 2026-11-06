import { defineBulletArt } from '../projectiles.js';

// The Magpie Mole's attacks. It's a mole that has decided everything shiny
// is lost property, so it fights with its finds: coins, spoons, keys and
// buttons thrown from the sack, molehills that pop with a pink digging
// paw, the sack itself swung round on its strap, clods of dirt lobbed high
// that burst into pebbles when they land, and its tail feathers sprayed in
// a turning fan.
//
// It stands to the right of the box. Each attack is a factory `(box,
// density, tools) => ({ duration, update })`; see dummy.js for the shape.
// Custom bullets here (the pop-up paw) are plain Shots and Lines.

const COIN = { y: '#f4c84a', Y: '#c08a20', l: '#fff7a0' };
const STEEL = { z: '#d8dce8', Z: '#9098aa', w: '#ffffff' };
const DIRT = { d: '#7a5a3a', D: '#4a3422', l: '#a88256' };
const PAW = { p: '#f0a0b0', P: '#c8707e', c: '#fff0e0' };

// A coin, spinning edge-on and flat.
defineBulletArt('moleCoin', {
  frames: [
    ['.yyy.', 'ylyYy', 'yyyYy', 'yyYYy', '.yyy.'],
    ['..y..', '.yly.', '.yyY.', '.yYy.', '..y..'],
    ['.yyy.', 'yYyyy', 'yYyyy', 'yYYYy', '.yyy.'],
    ['..y..', '.yYy.', '.yyy.', '.yyY.', '..y..'],
  ],
  palette: COIN,
  radius: 2.4,
  frameSeconds: 0.09,
});

// A spoon, drawn pointing right, tumbling.
defineBulletArt('moleSpoon', {
  frames: [['..........', 'zzzzzzzzzZ', 'wzzzzzzzZZ', '..........']],
  palette: STEEL,
  radius: 2,
  rotate: true,
});

// A key: a loop and a few teeth, pointing right.
defineBulletArt('moleKey', {
  frames: [['.yy.......', 'y..yyyyyyy', 'y..yy.y.y.', '.yy.......']],
  palette: COIN,
  radius: 2,
  rotate: true,
  spin: 5,
});

// A button, spinning.
defineBulletArt('moleButton', {
  frames: [
    ['.zzz.', 'zZzZz', 'zzwzz', 'zZzZz', '.zzz.'],
    ['..z..', '.zZz.', '.zwz.', '.zZz.', '..z..'],
  ],
  palette: STEEL,
  radius: 2.3,
  frameSeconds: 0.12,
});

// A molehill, trembling (harmless: a paw is about to come up through it).
defineBulletArt('moleHill', {
  frames: [
    ['...dd...', '..dldd..', '.dllddd.', 'dllddddD', 'DDDDDDDD'],
    ['..dd....', '.dldd...', 'dlldddd.', '.dllddDD', 'DDDDDDDD'],
  ],
  palette: DIRT,
  radius: 1,
  frameSeconds: 0.07,
});

// A pink digging paw, claws up, drawn pointing up.
defineBulletArt('molePaw', {
  frames: [
    ['c.c.c.c', 'cpcpcpc', 'ppppppp', 'ppPppPp', '.ppppp.', '.pPppP.'],
    ['c.c.c.c', 'cpcpcpc', 'ppppppp', 'pPppPpp', '.ppppp.', '.pPppP.'],
  ],
  palette: PAW,
  radius: 3.2,
  frameSeconds: 0.2,
});

// A clod of dirt, and a pebble.
defineBulletArt('moleClod', {
  frames: [['..dd..', '.dlldd', 'dllddd', 'dddDdd', '.dDDd.', '..dd..']],
  palette: DIRT,
  radius: 3,
  spin: 2,
});
defineBulletArt('molePebble', {
  frames: [['.dd.', 'dlDd', '.dd.']],
  palette: DIRT,
  radius: 1.4,
  spin: 4,
});

// Where a clod will land (harmless): a little ring of shine, "mine" scratched in.
defineBulletArt('moleMark', {
  frames: [
    ['.g.g.', 'g...g', '..w..', 'g...g', '.g.g.'],
    ['..g..', '.g.g.', 'g.w.g', '.g.g.', '..g..'],
  ],
  palette: { g: '#fff6a8', w: '#ffffff' },
  radius: 1,
  frameSeconds: 0.12,
});

// The sack, swung on its strap: burlap, a patched seam, glints.
defineBulletArt('moleSack', {
  frames: [
    [
      '...ssss...',
      '..sSttSs..',
      '.sttttttS.',
      'sttyttttSs',
      'stttttzttS',
      'sSttttttSs',
      '.sSttttSs.',
      '..sSSSSs..',
    ],
    [
      '...ssss...',
      '..sSttSs..',
      '.stttyttS.',
      'sttttttzSs',
      'stttttttSS',
      'sSttttttSs',
      '.sSttttSs.',
      '..sSSSSs..',
    ],
  ],
  palette: { s: '#b08850', S: '#7a5a30', t: '#d8b070', y: '#f4c84a', z: '#d8dce8' },
  radius: 4.6,
  spin: 1.4,
  frameSeconds: 0.2,
});

// A tail feather, drawn pointing right: glossy blue-green going purple.
defineBulletArt('moleFeather', {
  frames: [['..bbbbbbbb', 'kbbcbbbvvv', '..bbbbbbbb']],
  palette: { b: '#1a6e9a', c: '#2fb0b8', v: '#6a5acd', k: '#55536e' },
  radius: 1.8,
  rotate: true,
});

export const MAGPIE_MOLE_ATTACKS = {
  // Finders keepers: it rummages in the sack and throws what it finds, a
  // coin, a spoon, a key, a button, in high arcs that land where you stand.
  // Coins bounce off the floor once.
  moleToss(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let n = 0;
    let next = 0.2;
    let flying = [];
    const G = 120;
    const ARTS = ['moleCoin', 'moleSpoon', 'moleKey', 'moleButton'];
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        // Gravity is done by hand, so the arc lands where it was aimed whatever
        // speed the fight has been tuned to (every bullet's speed is scaled, and
        // dt arrives stretched by density, so it's taken back out here).
        for (const b of flying) {
          if (!b.scale && b.age > 0) b.scale = b.vx / b.v0x;
          if (b.scale) b.vy += G * b.scale * b.scale * (dt / density);
        }
        flying = flying.filter((b) => b.age < 4);
        if (t < next || t > 5.4) return;
        next = t + 0.4;
        const art = ARTS[n % ARTS.length];
        n++;
        const x0 = box.x + box.w + 6;
        const y0 = rand(box.y + 6, box.y + box.h - 20);
        const T = rand(0.8, 1.0);
        // Lands right where you are, corners and walls included.
        const tx = clamp(soul.x + rand(-2, 2), box.x + 1, box.x + box.w - 1);
        const ty = clamp(soul.y + rand(-2, 2), box.y + 1, box.y + box.h - 1);
        const vx = (tx - x0) / T;
        const vy = (ty - y0 - 0.5 * G * T * T) / T;
        const b = new Shot({ x: x0, y: y0, vx, vy, art, life: 4 });
        b.v0x = vx;
        flying.push(b);
        bullets.push(b);
      },
    };
  },

  // Hills: molehills come up in the floor of the box, trembling, and then a
  // pink paw shoots up through each (a column of it, with the paw on top),
  // scattering dirt to either side. One hill is always under you.
  moleHills(box, density, { Shot, Line, rand, clamp }) {
    let t = 0;
    let waves = 0;
    let next = 0.2;
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t < next || waves >= 3 || t > 4.6) return;
        next = t + 1.7;
        waves++;
        const xs = [clamp(soul.x, box.x + 8, box.x + box.w - 8)];
        for (let i = 0; i < 2; i++) {
          const dir = i === 0 ? -1 : 1;
          xs.push(clamp(xs[0] + dir * rand(22, 34), box.x + 8, box.x + box.w - 8));
        }
        const floor = box.y + box.h;
        const warn = 0.95;
        xs.forEach((x) => {
          bullets.push(new Shot({ x, y: floor - 3, harmless: true, life: warn + 0.15, art: 'moleHill' }));
          bullets.push(new Line({ x, y: floor, angle: -Math.PI / 2, length: box.h + 8, thickness: 8, warn, life: 0.4, color: '#f0a0b0', glow: '#fff0e0' }));
          bullets.push(new Shot({ x, y: floor, vy: -300, warn, life: 0.28, art: 'molePaw' }));
          // Dirt thrown out either side as the paw comes up.
          [-1, 1].forEach((side) => {
            bullets.push(new Shot({ x, y: floor - 4, vx: side * rand(26, 40), vy: -rand(70, 90), gravity: 160, warn, art: 'molePebble', life: 1.6 }));
          });
        });
      },
    };
  },

  // Swing: it takes the sack off its back and swings it round on the strap,
  // a big heavy arc, in and out, sweeping across the box with a trail of
  // glints. Every time it comes round, something shiny flies off it.
  moleSwing(box, density, { Shot }) {
    const pivot = { x: box.x + box.w + 14, y: box.y + box.h / 2 };
    let t = 0;
    let sack = null;
    let started = false;
    let center = Math.PI;
    let thrown = 0;
    let shed = 0;
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (!started) {
          started = true;
          // Starts out aimed through where you are.
          center = Math.atan2(soul.y - pivot.y, soul.x - pivot.x);
          sack = new Shot({ x: pivot.x, y: pivot.y, art: 'moleSack', warn: 0.8, life: 5.4 });
          bullets.push(sack);
        }
        if (!sack || t <= sack.warn) return;
        const k = t - sack.warn;
        // Sweeps +-70 degrees, and the middle of the sweep drifts round to
        // wherever you are. It breathes right out to the far corners and in
        // to the strap, so no part of the box is out of reach.
        const want = Math.atan2(soul.y - pivot.y, soul.x - pivot.x);
        center += Math.max(-0.9 * dt, Math.min(0.9 * dt, want - center));
        const angle = center + Math.sin(k * 1.9 + 0.9) * 1.22;
        const r = 62 + Math.sin(k * 2.6) * 42;
        sack.x = pivot.x + Math.cos(angle) * r;
        sack.y = pivot.y + Math.sin(angle) * r;
        sack.vx = 0;
        sack.vy = 0;
        // Buttons shake loose along the arc and lie where they fall for a moment.
        if (k > shed) {
          shed = k + 0.3;
          bullets.push(new Shot({ x: sack.x, y: sack.y, art: 'moleButton', warn: 0.25, life: 1.1 }));
        }
        if (k > thrown * 1.2 + 0.7 && thrown < 4) {
          thrown++;
          const art = thrown % 2 ? 'moleCoin' : 'moleSpoon';
          // What flies off comes straight at you.
          const out = Math.atan2(soul.y - sack.y, soul.x - sack.x);
          bullets.push(new Shot({ x: sack.x, y: sack.y, vx: Math.cos(out) * 52, vy: Math.sin(out) * 52, art, life: 3 }));
        }
      },
    };
  },

  // Clods: it flicks dirt up out of its hole, big clods that come down from
  // the top of the box on a spot that sparkles first, and burst into a ring of
  // pebbles when they land. Three at a time, near you.
  moleClods(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let waves = 0;
    let next = 0.2;
    let landing = [];
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && waves < 3 && t < 4.4) {
          next = t + 1.6;
          waves++;
          for (let i = 0; i < 3; i++) {
            const x = clamp(soul.x + (i - 1) * rand(16, 26) + (i === 1 ? rand(-4, 4) : 0), box.x + 8, box.x + box.w - 8);
            const y = i === 1 ? clamp(soul.y, box.y + 16, box.y + box.h - 10) : rand(box.y + 20, box.y + box.h - 12);
            const fall = 0.7;
            const warn = 0.55 + i * 0.22;
            bullets.push(new Shot({ x, y, harmless: true, life: warn + fall, art: 'moleMark' }));
            const vy = (y - (box.y - 6)) / fall;
            bullets.push(new Shot({ x, y: box.y - 6, vy, warn, art: 'moleClod', life: fall }));
            landing.push({ at: t + warn + fall, x, y });
          }
        }
        for (const l of landing) {
          if (t < l.at) continue;
          l.done = true;
          for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2 + 0.3;
            bullets.push(new Shot({ x: l.x, y: l.y, vx: Math.cos(a) * 52, vy: Math.sin(a) * 52, art: 'molePebble', life: 1.1 }));
          }
        }
        landing = landing.filter((l) => !l.done);
      },
    };
  },

  // Feathers: it fans its tail and flicks the feathers off in a turning
  // spray, one way and then back, each feather a glossy blue-green blade
  // that goes straight where it's sent.
  moleFeathers(box, density, { Shot, rand }) {
    const mouth = { x: box.x + box.w + 2, y: box.y + box.h / 2 };
    let t = 0;
    let n = 0;
    let next = 0.4;
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t < next || t > 5.4) return;
        next = t + 0.11;
        n++;
        // Sweeps back and forth across the box, a half-turn each way.
        const base = Math.PI + Math.sin(t * 1.5) * 1.05;
        // Every third feather goes straight at you.
        const a = n % 3 === 0 ? Math.atan2(soul.y - mouth.y, soul.x - mouth.x) : base + rand(-0.05, 0.05);
        bullets.push(new Shot({ x: mouth.x, y: mouth.y + rand(-6, 6), vx: Math.cos(a) * 66, vy: Math.sin(a) * 66, art: 'moleFeather', life: 2.6 }));
      },
    };
  },
};
