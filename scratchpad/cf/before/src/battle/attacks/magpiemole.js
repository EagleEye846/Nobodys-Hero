import { defineBulletArt } from '../projectiles.js';
import { PathShot, Deco, blit } from './coastKit.js';

// The Magpie Mole's attacks. It's a mole that runs the lost property office:
// everything shiny is lost property, it has a sack of it, and it can't stop
// looking at your buttons:
//   - Finds: coins, spoons, keys and buttons thrown from the sack.
//   - Hills: molehills that pop with a pink digging paw.
//   - Swing: the sack swung round on its strap.
//   - Filing: every kind of find has its own pigeonhole in the rack down the
//     left of the box, and goes straight into it. Know the holes, know the line.
//   - Finders keepers: shinies glint round you and its long arm reaches in
//     for each one, in order. Don't stand between the paw and a shiny.
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

// Its digging arm's paw, reaching (drawn pointing right).
defineBulletArt('moleGrabPaw', {
  frames: [['....c..', 'ppppcp.', 'pPpppcc', 'ppppcp.', '....c..']],
  palette: PAW,
  radius: 2.6,
  rotate: true,
});

// Little pictures on the pigeonholes: coin, spoon, key, button.
const ICONS = [
  ['.yyy.', 'yyYyy', 'yYyYy', 'yyYyy', '.yyy.'],
  ['.....', 'zz...', 'zzzzz', 'zz...', '.....'],
  ['.....', 'yy...', 'y.yyy', 'yy.y.', '.....'],
  ['.zzz.', 'zZzZz', 'zzzzz', 'zZzZz', '.zzz.'],
];
const ICON_PAL = { ...COIN, ...STEEL };

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
      duration: 7.8,
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
        if (t < next || t > 8.6) return;
        next = t + 0.42;
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
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t < next || waves >= 5) return;
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
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (!started) {
          started = true;
          // Starts out aimed through where you are.
          center = Math.atan2(soul.y - pivot.y, soul.x - pivot.x);
          sack = new Shot({ x: pivot.x, y: pivot.y, art: 'moleSack', warn: 0.8, life: 6.8 });
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
        if (k > thrown * 1.2 + 0.7 && thrown < 6) {
          thrown++;
          const art = thrown % 2 ? 'moleCoin' : 'moleSpoon';
          // What flies off comes straight at you.
          const out = Math.atan2(soul.y - sack.y, soul.x - sack.x);
          bullets.push(new Shot({ x: sack.x, y: sack.y, vx: Math.cos(out) * 52, vy: Math.sin(out) * 52, art, life: 3 }));
        }
      },
    };
  },


  // Filing: it runs the lost property office, and everything has its own
  // pigeonhole. The rack is down the left of the box: coins in the top hole,
  // spoons the next, keys the next, buttons at the bottom. It holds each find
  // up at the counter (the paw on the right) and throws it straight into its
  // own hole. So learn the holes: the moment you see what it's holding, you
  // know the line it'll fly. The counter moves up and down as it works.
  moleSort(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    const KINDS = ['moleCoin', 'moleSpoon', 'moleKey', 'moleButton'];
    const holeY = (i) => box.y + 10 + i * 20;
    const HOLD = 0.45;
    const SPEED = 135;
    let t = 0;
    let next = T(0.2);
    let thrown = 0;
    let counter = box.y + box.h / 2;
    let started = false;
    return {
      duration: 8,
      update: (dt, bullets) => {
        t += dt;
        if (!started) {
          started = true;
          // The rack, with a picture of what goes in each hole (harmless).
          bullets.push(new Deco({
            life: 8,
            under: true,
            paint: (ctx) => {
              for (let i = 0; i < 4; i++) {
                const y = holeY(i);
                ctx.fillStyle = '#4a3422';
                ctx.fillRect(box.x, y - 6, 9, 12);
                ctx.fillStyle = '#1a120a';
                ctx.fillRect(box.x + 1, y - 5, 7, 10);
                ctx.fillStyle = '#a88256';
                ctx.fillRect(box.x, y + 6, 9, 1);
                blit(ctx, ICONS[i], ICON_PAL, box.x + 4.5, y, 0.9);
              }
            },
          }));
        }
        if (t < next || thrown >= 26) return;
        thrown++;
        next = t + T(0.24);
        // Every few throws it shuffles along the counter.
        if (thrown % 5 === 1) counter = rand(box.y + 8, box.y + box.h - 8);
        const kind = Math.floor(rand(0, 4));
        const from = { x: box.x + box.w - 4, y: counter };
        const to = { x: box.x + 4, y: holeY(kind) };
        const a = Math.atan2(to.y - from.y, to.x - from.x);
        bullets.push(new Shot({ x: from.x, y: from.y, vx: Math.cos(a) * SPEED, vy: Math.sin(a) * SPEED, warn: HOLD, art: KINDS[kind], life: Math.hypot(to.x - from.x, to.y - from.y) / SPEED }));
      },
    };
  },

  // Finders keepers: shiny things glint on the floor of the box round you,
  // and it reaches in for every one of them, in the order they glinted, with
  // its long pink digging arm, straight from where it's poked through the
  // wall, and digs it up in a spray of dirt. A dotted line shows each reach
  // first. Don't stand between the paw and something shiny, or next to it. Three handfuls, from three different holes.
  moleGrab(box, density, { Shot, Line, rand, clamp }) {
    const T = (s) => s * density;
    const WARN = 0.5;
    const GAP = 0.3;
    const sprays = [];
    let t = 0;
    let n = 0;
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        for (const spray of sprays) {
          if (spray.done || t / density < spray.at) continue;
          spray.done = true;
          const spin = rand(0, Math.PI);
          for (let j = 0; j < 5; j++) {
            const b = spin + (j / 5) * Math.PI * 2;
            bullets.push(new Shot({ x: spray.x, y: spray.y, vx: Math.cos(b) * 42, vy: Math.sin(b) * 42, art: 'molePebble', life: 1.3 }));
          }
        }
        if (n >= 3 || t < T(0.1 + n * 2.55)) return;
        n++;
        // Where it pokes through: right wall, top or bottom.
        const side = (n + Math.floor(rand(0, 2))) % 3;
        const from = side === 0 ? { x: box.x + box.w + 2, y: rand(box.y + 10, box.y + box.h - 10) }
          : side === 1 ? { x: rand(box.x + 10, box.x + box.w - 10), y: box.y - 2 } : { x: rand(box.x + 10, box.x + box.w - 10), y: box.y + box.h + 2 };
        bullets.push(new Shot({ x: clamp(from.x, box.x + 3, box.x + box.w - 3), y: clamp(from.y, box.y + 3, box.y + box.h - 3), harmless: true, art: 'moleHill', life: WARN + GAP * 5 + 0.4 }));
        const turn = rand(0, Math.PI * 2);
        for (let i = 0; i < 5; i++) {
          const a = turn + (i / 5) * Math.PI * 2 + rand(-0.3, 0.3);
          const d = rand(8, 22);
          const shiny = { x: clamp(soul.x + Math.cos(a) * d, box.x + 6, box.x + box.w - 6), y: clamp(soul.y + Math.sin(a) * d, box.y + 6, box.y + box.h - 6) };
          const at = i * GAP;
          const ang = Math.atan2(shiny.y - from.y, shiny.x - from.x);
          const reach = Math.hypot(shiny.x - from.x, shiny.y - from.y);
          // The shiny thing, lying there until it's taken.
          bullets.push(new Shot({ x: shiny.x, y: shiny.y, harmless: true, art: i % 2 ? 'moleCoin' : 'moleButton', life: at + WARN + 0.15 }));
          // The arm: a dotted warning, then out it shoots, with the paw on the end.
          bullets.push(new Line({ x: from.x, y: from.y, angle: ang, length: reach, thickness: 4, warn: at + WARN, life: 0.3, grow: 320, color: '#f0a0b0' }));
          // It digs the thing up: dirt flies out round where it was.
          sprays.push({ at: t / density + at + WARN + reach / 320, x: shiny.x, y: shiny.y });
          bullets.push(new PathShot({
            art: 'moleGrabPaw', warn: at + WARN, life: 0.3,
            path: (k) => {
              const r = Math.min(reach, k * 320);
              return { x: from.x + Math.cos(ang) * r, y: from.y + Math.sin(ang) * r, a: ang };
            },
          }));
        }
      },
    };
  },
};
