import { defineBulletArt } from '../projectiles.js';

// The Clinker's attacks. It's a crayfish living in an old enamel mug that
// came down Hollin's well, so it fights like a crayfish and a mug: pincers
// that snap shut like shears, the CLANG when it bangs on the mug (it's a
// bit deaf from it), rust flaking off the drain pipes, the way a crayfish
// shoots off backwards with a flick of its tail, and the mug itself, with
// the Clinker tucked inside, rolling round the box.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape.

const SHELL = { k: '#14101c', r: '#b8442a', R: '#7a2a1a', h: '#e8784e', e: '#000000', w: '#ffffff' };
const TIN = { k: '#14101c', m: '#e8e4dc', M: '#b0aca4', b: '#3a5a9a', B: '#26407a', c: '#2a2630', i: '#3a3440' };
const RUST = { u: '#c8743a', U: '#8a4a22', o: '#e8a060' };
const GRIT = { g: '#8a8296', G: '#5e5664', s: '#b8b0c0' };
const CLANG = { y: '#ffe08a', Y: '#d8a83a', w: '#ffffff' };

// One of its pincers, drawn pointing right: two fingers, a little open.
defineBulletArt('clinkerClaw', {
  frames: [[
    '.kkkk.......kkkk.',
    'krrrrkkkkkkkhhhrk',
    'kRrrrrrrrrrrrrrk.',
    'kRrrhrrrkkkkkkk..',
    'kRrrrrrk.........',
    'kRrrhrrrkkkkkkk..',
    'kRrrrrrrrrrrrrrk.',
    'krrrrkkkkkkkrrrrk',
    '.kkkk.......kkkk.',
  ]],
  palette: SHELL,
  hitbox: { w: 15, h: 8 },
  rotate: true,
});

// A bit of grit, kicked up off the drain floor.
defineBulletArt('clinkerGrit', {
  frames: [['.g.', 'gsG', '.G.'], ['g..', 'sGg', '..G']],
  palette: GRIT,
  radius: 1.4,
  frameSeconds: 0.1,
});

// A piece of the CLANG: a short bright bar of sound, drawn side-on to where
// it flies, so a ring of them reads as one ring going out.
defineBulletArt('clinkerRing', {
  frames: [['.Y', 'yY', 'yw', 'yw', 'yw', 'yY', '.Y']],
  palette: CLANG,
  radius: 2.5,
  rotate: true,
});

// The word itself, bursting out where it bangs the mug (harmless).
defineBulletArt('clinkerClangWord', {
  frames: [[
    '.yy.y....yy..y..y..yy..y',
    'y...y...y..y.yy.y.y....y',
    'y...y...yyyy.y.yy.y.yy.y',
    'y...y...y..y.y..y.y..y..',
    '.yy.yyy.y..y.y..y..yy..y',
  ]],
  palette: CLANG,
  radius: 1,
});

// A flake of rust off the pipes, fluttering; and a drip of rusty water.
defineBulletArt('clinkerFlake', {
  frames: [['uUo', 'Uu.'], ['.uo', 'uU.'], ['oU.', 'uuU']],
  palette: RUST,
  radius: 1.5,
  frameSeconds: 0.18,
});
defineBulletArt('clinkerDrip', {
  frames: [['.o.', 'uou', 'uUu', '.U.']],
  palette: RUST,
  radius: 1.6,
});

// The drain pipe it all comes off, along the top of the box (harmless).
defineBulletArt('clinkerPipe', {
  frames: [[
    'UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU',
    'uouuuuuuuouuuuuuuuuuuuuouuuuuuuuuuuouuuuuuuuuuuuuouuuuuuuuuuuuouuuuuuuuuuuouuuuu',
    'uuuuUuuuuuuuuuUuuuuuuuuuuuuUuuuuuuuuuuuuuUuuuuuuuuuuuuUuuuuuuuuuuuuuUuuuuuuuuuuu',
    'UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU',
  ]],
  palette: RUST,
  radius: 1,
});

// The Clinker going backwards, tail first, drawn heading right: its fanned
// tail at the front, claws trailing behind.
defineBulletArt('clinkerDash', {
  frames: [
    [
      'kk.......kk..',
      'krk.kkkkkrhk.',
      '.krkrrrrrrrrk',
      'kewrrhrrrrRrk',
      '.krkrrrrrrrrk',
      'krk.kkkkkrhk.',
      'kk.......kk..',
    ],
    [
      'kk........k..',
      'krk.kkkkkkhk.',
      '.krkrrrrrrrrk',
      'kewrrhrrrrRRk',
      '.krkrrrrrrrrk',
      'krk.kkkkkkhk.',
      'kk........k..',
    ],
  ],
  palette: SHELL,
  hitbox: { w: 12, h: 5 },
  rotate: true,
  frameSeconds: 0.08,
});

// The mug, on its side and rolling, with the Clinker tucked up inside.
defineBulletArt('clinkerMug', {
  frames: [[
    '..kkkkkkkk..',
    '.kbmmmmmmbk.',
    'kbmmmmcmmbbk',
    'kbmmmmmmmbik',
    'kbmMmmmmmbik',
    'kbmMMmmmmbik',
    'kbmmmmmmmbbk',
    '.kbmmmmmmbk.',
    '..kkkkkkkk..',
  ]],
  palette: TIN,
  radius: 4.5,
  spin: 7,
});

export const CLINKER_ATTACKS = {
  // Snip: its pincers come in from both sides of the box at once, on the
  // line you're standing on, and snap shut in the middle like shears (a
  // spray of grit where they meet), then open out again. Across, then up
  // and down, then across. Get off the line before they close.
  clinkerShears(box, density, { Shot, rand, clamp }) {
    const cx = box.x + box.w / 2;
    const cy = box.y + box.h / 2;
    const warn = 0.5;
    const closeSeconds = 0.32;
    const holdSeconds = 0.12;
    const openSeconds = 0.3;
    let snips = [];
    let count = 0;
    let t = 0;
    let next = 0.15;
    const snip = (bullets, soul) => {
      const across = count++ % 2 === 0;
      // Mostly right on your line; now and then just off it, to keep you honest.
      const wobble = count % 3 === 0 ? rand(-12, 12) : 0;
      const at = across ? clamp(soul.y + wobble, box.y + 6, box.y + box.h - 6) : clamp(soul.x + wobble, box.x + 6, box.x + box.w - 6);
      const pair = [-1, 1].map((side) => {
        const from = across ? { x: cx + side * (box.w / 2 + 6), y: at } : { x: at, y: cy + side * (box.h / 2 + 6) };
        const to = across ? { x: cx + side * 8, y: at } : { x: at, y: cy + side * 8 };
        // Pointing in, at the other claw.
        const angle = across ? (side < 0 ? 0 : Math.PI) : (side < 0 ? Math.PI / 2 : -Math.PI / 2);
        const claw = new Shot({ x: from.x, y: from.y, warn, life: closeSeconds + holdSeconds + openSeconds, angle, art: 'clinkerClaw' });
        return { claw, from, to };
      });
      bullets.push(...pair.map((p) => p.claw));
      snips.push({ pair, t: 0, burst: false, across, at });
    };
    return {
      duration: 6.4,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 5.6) {
          snip(bullets, soul);
          next = t + 0.95;
        }
        for (const s of snips) {
          s.t += dt;
          const moving = s.t - warn;
          if (moving < 0) continue;
          // In fast, a moment shut, then back out more slowly.
          let k;
          if (moving < closeSeconds) k = (moving / closeSeconds) ** 2;
          else if (moving < closeSeconds + holdSeconds) k = 1;
          else k = Math.max(0, 1 - (moving - closeSeconds - holdSeconds) / openSeconds);
          for (const { claw, from, to } of s.pair) {
            claw.x = from.x + (to.x - from.x) * k;
            claw.y = from.y + (to.y - from.y) * k;
          }
          if (!s.burst && moving >= closeSeconds) {
            s.burst = true;
            const p = s.across ? { x: cx, y: s.at } : { x: s.at, y: cy };
            for (let i = 0; i < 4; i++) {
              const a = Math.PI / 4 + (i * Math.PI) / 2;
              bullets.push(new Shot({ x: p.x, y: p.y, vx: Math.cos(a) * 46, vy: Math.sin(a) * 46, accel: -30, life: 1.2, art: 'clinkerGrit' }));
            }
          }
        }
        snips = snips.filter((s) => s.t < warn + closeSeconds + holdSeconds + openSeconds + 0.3);
      },
    };
  },

  // CLANG: it bangs a claw on its mug, up above the box, and the noise comes
  // down in a ring of sound. There's always one gap in the ring, but it's
  // somewhere new every bang, and the bangs come quicker as it gets cross.
  clinkerClang(box, density, { Shot, rand }) {
    const origin = { x: box.x + box.w / 2, y: box.y - 14 };
    const pieces = 25;
    let t = 0;
    let next = 0.2;
    let gap = Math.floor(pieces / 2) - 1;
    let bangs = 0;
    const bang = (bullets) => {
      bullets.push(new Shot({ x: origin.x, y: origin.y + 6, harmless: true, life: 0.35, art: 'clinkerClangWord' }));
      // The gap moves a few places each bang: far enough to make you go, not
      // so far you can't get there.
      gap = Math.max(2, Math.min(pieces - 5, gap + (Math.random() < 0.5 ? -1 : 1) * Math.floor(rand(3, 7))));
      for (let i = 0; i < pieces; i++) {
        if (i >= gap && i <= gap + 2) continue;
        const a = 0.12 + (i / (pieces - 1)) * (Math.PI - 0.24);
        bullets.push(new Shot({ x: origin.x, y: origin.y, vx: Math.cos(a) * 44, vy: Math.sin(a) * 44, life: 3, art: 'clinkerRing' }));
      }
      bangs++;
    };
    return {
      duration: 6.6,
      update: (dt, bullets) => {
        t += dt;
        if (t >= next && t < 5.4) {
          bang(bullets);
          next = t + Math.max(0.75, 1.15 - bangs * 0.07);
        }
      },
    };
  },

  // Rust: something up in the pipes shakes loose. Flakes of rust come
  // fluttering down all over, rocking side to side as they fall; and every
  // so often a fat drip of rusty water drops straight onto you and splashes
  // out along the floor.
  clinkerRust(box, density, { Shot, every, rand, clamp, spreadAcross }) {
    const nextX = spreadAcross(box.x + 5, box.x + box.w - 5, 6);
    let flakes = [];
    const pipe = new Shot({ x: box.x + box.w / 2, y: box.y + 2, harmless: true, life: 6.2, art: 'clinkerPipe' });
    const flutter = every(0.2, 0.28, (bullets) => {
      const x = nextX();
      const flake = new Shot({ x, y: box.y + 4, vy: rand(20, 28), art: 'clinkerFlake' });
      flake.baseX = x;
      flake.sway = rand(0, Math.PI * 2);
      flake.swing = rand(5, 9);
      bullets.push(flake);
      flakes.push(flake);
    });
    let drips = [];
    const drip = every(1.0, 1.3, (bullets, soul) => {
      const x = clamp(soul.x + rand(-4, 4), box.x + 5, box.x + box.w - 5);
      const d = new Shot({ x, y: box.y + 5, vy: 20, gravity: 260, warn: 0.45, art: 'clinkerDrip' });
      bullets.push(d);
      drips.push(d);
    }, { first: 0.7 });
    let started = false;
    return {
      duration: 6.4,
      update: (dt, bullets, soul) => {
        if (!started) {
          started = true;
          bullets.push(pipe);
        }
        flutter(dt, bullets);
        drip(dt, bullets, soul);
        for (const flake of flakes) flake.x = flake.baseX + Math.sin(flake.age * 3.2 + flake.sway) * flake.swing;
        flakes = flakes.filter((flake) => flake.y < box.y + box.h + 8);
        for (const d of drips) {
          if (d.age < d.warn || d.y < box.y + box.h - 3) continue;
          // Splash: it bursts along the floor both ways.
          d.life = d.age - d.warn;
          d.done = true;
          for (const side of [-1, 1]) {
            for (const speed of [34, 58]) {
              bullets.push(new Shot({ x: d.x, y: box.y + box.h - 3, vx: side * speed, vy: -40, gravity: 160, life: 1.2, art: 'clinkerDrip' }));
            }
          }
        }
        drips = drips.filter((d) => !d.done);
      },
    };
  },

  // Backwards! Crayfish run away backwards, with a flick of the tail, and
  // the Clinker does it straight through the box: it blinks at one side,
  // then shoots across tail first. The grit it kicks up flies on ahead of
  // it, slows, and then comes shooting back the other way.
  clinkerBackflip(box, density, { Shot, rand, clamp, spreadAcross }) {
    const nextY = spreadAcross(box.y + 8, box.y + box.h - 8, 5);
    let dashes = [];
    let t = 0;
    let next = 0.15;
    let count = 0;
    const flick = (bullets, soul) => {
      const fromLeft = count % 2 === 0;
      const y = ++count % 3 === 0 ? clamp(soul.y, box.y + 8, box.y + box.h - 8) : nextY();
      const dir = fromLeft ? 1 : -1;
      const x = fromLeft ? box.x - 8 : box.x + box.w + 8;
      const crayfish = new Shot({ x, y, vx: dir * 150, warn: 0.55, angle: fromLeft ? 0 : Math.PI, art: 'clinkerDash' });
      bullets.push(crayfish);
      dashes.push({ crayfish, dir, kicked: 0, grit: [] });
    };
    return {
      duration: 6.5,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < 5.5) {
          flick(bullets, soul);
          next = t + 0.9;
        }
        for (const d of dashes) {
          const c = d.crayfish;
          if (c.age < c.warn) continue;
          const inside = c.x > box.x + 4 && c.x < box.x + box.w - 4;
          // A spurt of grit every few pixels it covers, thrown forward.
          if (inside && c.age - c.warn > d.kicked * 0.09) {
            d.kicked++;
            const g = new Shot({ x: c.x, y: c.y + rand(-3, 3), vx: d.dir * rand(40, 60), vy: rand(-26, 26), accel: -70, life: 2.6, art: 'clinkerGrit' });
            g.turnAt = rand(0.6, 0.85);
            bullets.push(g);
            d.grit.push(g);
          }
          for (const g of d.grit) {
            if (g.turned || g.age < g.turnAt) continue;
            // Back it comes, the way it went.
            g.turned = true;
            g.accel = 0;
            g.vx = -d.dir * 62;
            g.vy *= 0.5;
          }
        }
        dashes = dashes.filter((d) => d.crayfish.age < 3.5);
      },
    };
  },

  // In the mug: it pulls itself right inside its mug, and the mug rolls,
  // bouncing round the box off every wall. Each time it hits one there's a
  // little CLANG, and a few rings of sound go off from where it hit. Then it
  // gets dizzy and slows down, a bit.
  clinkerMugRoll(box, density, { Shot, rand }) {
    const start = { x: box.x + box.w / 2, y: box.y + 12 };
    const angle = rand(0.6, 1.0) * (Math.random() < 0.5 ? 1 : -1) + Math.PI / 2;
    const mug = new Shot({ x: start.x, y: start.y, vx: Math.cos(angle) * 78, vy: Math.sin(angle) * 78, bounce: true, warn: 0.6, life: 5.4, art: 'clinkerMug' });
    let lastVx = mug.vx;
    let lastVy = mug.vy;
    let started = false;
    let t = 0;
    const ring = (bullets, nx, ny) => {
      // Off the wall it hit, away from it, in a fan.
      const out = Math.atan2(ny, nx);
      for (let i = -2; i <= 2; i++) {
        const a = out + i * 0.42;
        bullets.push(new Shot({ x: mug.x + nx * 3, y: mug.y + ny * 3, vx: Math.cos(a) * 40, vy: Math.sin(a) * 40, life: 1.6, art: 'clinkerRing' }));
      }
      // And the knock shakes rust down off the pipes overhead.
      for (let i = 0; i < 3; i++) {
        bullets.push(new Shot({ x: rand(box.x + 6, box.x + box.w - 6), y: box.y + 3, vy: rand(16, 24), gravity: 30, warn: 0.3, art: 'clinkerFlake' }));
      }
    };
    return {
      duration: 6.4,
      update: (dt, bullets) => {
        t += dt;
        if (!started) {
          started = true;
          bullets.push(mug);
        }
        if (mug.age < mug.warn) return;
        // Dizzier as it goes.
        const speed = Math.hypot(mug.vx, mug.vy);
        const want = t < 3.5 ? 78 : 60;
        if (speed > 0) {
          mug.vx *= want / speed;
          mug.vy *= want / speed;
        }
        const hitSide = Math.sign(mug.vx) !== Math.sign(lastVx);
        const hitEnd = Math.sign(mug.vy) !== Math.sign(lastVy);
        if (hitSide || hitEnd) ring(bullets, hitSide ? Math.sign(mug.vx) : 0, hitEnd ? Math.sign(mug.vy) : 0);
        lastVx = mug.vx;
        lastVy = mug.vy;
      },
    };
  },
};
