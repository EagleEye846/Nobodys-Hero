import { defineBulletArt } from '../projectiles.js';
import { Slab, stillness } from './underShapes.js';

// The Slagling's attacks. It's a lump of mine slag, still hot, that came
// out of the old furnace vents and never went back, and fights with what a
// lump of slag has: it spits sparks (in fans, never quite where you'd like),
// drips molten rock from above, oozes along the floor leaving cooling crust
// behind it, pours itself across the box in a slow glowing wave, and lets off
// cinders that drift upward like a chimney. Slow, hot and heavy; nothing
// here is fast, but all of it sticks around.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape. The attack's own clock (`t`) runs `density`
// times faster than the seconds on the wall, hence the `T` below.

const SPARK = { o: '#ff7a18', y: '#ffc23a', w: '#fff2a8', r: '#c2300c' };
const DRIP = { o: '#ff7a18', y: '#ffd25e', r: '#c2300c', w: '#fff2a8' };
const CRUST = { k: '#1a1216', c: '#7a6a68', C: '#524446', d: '#33292c', o: '#ff7a18', r: '#c2300c' };
const BLOB = { k: '#1a1216', o: '#ff7a18', y: '#ffc23a', r: '#c2300c', e: '#3a1608', w: '#fff2a8' };
const CINDER = { g: '#6a5a5a', G: '#8a7a7a', o: '#ff7a18', y: '#ffc23a', d: '#33292c' };
const BUBBLE = { o: '#ff9a40', y: '#ffe08a', r: '#c2300c' };

// A spark spat out of its mouth: a white-hot head with a flickering red
// tail, drawn flying right.
defineBulletArt('slagSpark', {
  frames: [['..roy.', 'rooyww', '..roy.'], ['.r.oy.', 'r.oyww', '.r.oy.']],
  palette: SPARK,
  radius: 1.8,
  rotate: true,
  frameSeconds: 0.08,
});

// The big spark that leads a fan, with a red heart.
defineBulletArt('slagSparkBig', {
  frames: [['..o..', '.oyo.', 'oywyo', '.oyo.', '..o..'], ['..y..', '.owo.', 'yowoy', '.owo.', '..y..']],
  palette: SPARK,
  radius: 2.8,
  spin: 3,
  frameSeconds: 0.1,
});

// A drip of molten rock, falling.
defineBulletArt('slagDrip', {
  frames: [['.o.', '.o.', 'oyo', 'oyo', '.o.'], ['.y.', '.o.', 'oyo', 'owo', '.o.']],
  palette: DRIP,
  radius: 2.2,
  frameSeconds: 0.12,
});

// A splash of it where it landed.
defineBulletArt('slagSplash', {
  frames: [['.y', 'o.'], ['y.', '.o']],
  palette: DRIP,
  radius: 1.2,
  frameSeconds: 0.07,
});

// The ooze itself, creeping along the floor with its face on, very focused.
defineBulletArt('slagBlob', {
  frames: [
    ['..kkkkkk..', '.koooooyok', 'koyeoyeyok', 'koooyyoook', 'krrrrrrrrk', '.kkkkkkkk.'],
    ['...kkkk...', '.kooyyook.', 'koyeoyeyok', 'kooooyoook', 'krrrrrrrrk', '.kkkkkkkk.'],
  ],
  palette: BLOB,
  hitbox: { w: 9, h: 5 },
  frameSeconds: 0.25,
});

// A slab of fresh crust, still glowing at its cracks (it'll cool).
defineBulletArt('slagCrustHot', {
  frames: [
    ['.kkkkkkkkk.', 'kCCoCCCoCCk', 'kCcCCoCCCCk', 'kCCCoCCoCCk', 'kdCCCCdCddk', '.kkkkkkkkk.'],
    ['.kkkkkkkkk.', 'kCCrCCCrCCk', 'kCcCCrCCCCk', 'kCCCrCCrCCk', 'kdCCCCdCddk', '.kkkkkkkkk.'],
  ],
  palette: CRUST,
  hitbox: { w: 10, h: 5 },
  frameSeconds: 0.2,
});

// The same slab, gone cold and black.
defineBulletArt('slagCrust', {
  frames: [['.kkkkkkkkk.', 'kccCCCCCCCk', 'kCcCCCCdCCk', 'kCCCCCdCdCk', 'kdCCCddddCk', '.kkkkkkkkk.']],
  palette: CRUST,
  hitbox: { w: 10, h: 5 },
});

// A cinder, rising: grey on the outside, a coal inside.
defineBulletArt('slagCinder', {
  frames: [['.g.', 'gyG', '.dg'], ['.G.', 'goG', '.dg']],
  palette: CINDER,
  radius: 1.6,
  frameSeconds: 0.2,
});

// A bigger, hotter ember off the bellows.
defineBulletArt('slagEmber', {
  frames: [['.oo.', 'oyyo', 'oywo', '.oo.'], ['.oo.', 'oyyo', 'oyyo', '.oo.']],
  palette: SPARK,
  radius: 2.4,
  frameSeconds: 0.15,
});

// A bubble rising off the wave, about to pop.
defineBulletArt('slagBubble', {
  frames: [['.oo.', 'o..o', 'o.yo', '.oo.'], ['.oo.', 'oyyo', 'oyyo', '.oo.']],
  palette: BUBBLE,
  radius: 2,
  frameSeconds: 0.3,
});

// A glob it lobs when you stand there thinking.
defineBulletArt('slagGlob', {
  frames: [['..oo..', '.oyyo.', 'oyyyyo', 'oywyyo', '.oyyo.', '..oo..']],
  palette: SPARK,
  radius: 3.2,
  spin: 2,
});

// Paints a slab of the pour: a body of ooze with a bright lip.
function paintPour(ctx, slab, lipSide) {
  const x = Math.round(slab.x);
  const y = Math.round(slab.y);
  ctx.fillStyle = '#7a1c0a';
  ctx.fillRect(x, y, slab.w, slab.h);
  ctx.fillStyle = '#c2300c';
  ctx.fillRect(x + 1, y, slab.w - 2, slab.h);
  ctx.fillStyle = '#ff7a18';
  for (let row = 0; row < slab.h; row += 3) {
    const wob = Math.sin(slab.age * 2 + row * 0.9) * 2;
    ctx.fillRect(x + 2 + wob + 3, y + row, slab.w - 8, 1);
  }
  ctx.fillStyle = '#ffc23a';
  // The leading lip glows.
  const lipX = lipSide < 0 ? x : x + slab.w - 3;
  ctx.fillRect(lipX, y, 3, slab.h);
  ctx.fillStyle = '#fff2a8';
  ctx.fillRect(lipX + (lipSide < 0 ? 0 : 1), y, 1, slab.h);
}

export const SLAGLING_ATTACKS = {
  // Sparks: it spits them out of its mouth, from one side or the other, in
  // fans (five, then seven, then a lone big one with two small ones behind),
  // aimed where you were a moment ago. Each fan slows a little as it goes.
  slagSpitSparks(box, density, { Shot, rand, clamp }) {
    const T = (s) => s * density;
    let t = 0;
    let next = 0.2;
    let round = 0;
    return {
      duration: 6.6,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t < next || t > T(5.8)) return;
        next = t + 0.85;
        const high = round % 2 === 0;
        const from = { x: box.x + box.w + 6, y: box.y + (high ? 14 : box.h - 14) };
        const aim = Math.atan2(soul.y - from.y, soul.x - from.x);
        bullets.push(new Shot({ x: from.x - 3, y: from.y, harmless: true, life: 0.3, art: 'slagSpark' }));
        const kind = round % 3;
        if (kind === 2) {
          // The lone big one, and two small ones trailing it.
          bullets.push(new Shot({ x: from.x, y: from.y, warn: 0.3, vx: Math.cos(aim) * 80, vy: Math.sin(aim) * 80, art: 'slagSparkBig' }));
          for (const lag of [-0.28, 0.28]) {
            bullets.push(new Shot({ x: from.x, y: from.y, warn: 0.3, vx: Math.cos(aim + lag) * 64, vy: Math.sin(aim + lag) * 64, accel: -8, art: 'slagSpark' }));
          }
        } else {
          const n = kind === 0 ? 5 : 7;
          for (let i = 0; i < n; i++) {
            const a = aim + (i - (n - 1) / 2) * 0.26 + rand(-0.03, 0.03);
            const speed = rand(60, 76);
            bullets.push(new Shot({ x: from.x, y: from.y, warn: 0.3, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, accel: -14, gravity: 8, art: 'slagSpark' }));
          }
        }
        round++;
      },
    };
  },

  // Drips: beads of molten rock gather on the ceiling of the box and let go,
  // one after another across the width, with every third one right over
  // your head. Where one lands it splashes in two small hot sprays.
  slagDrips(box, density, { Shot, rand, spreadAcross }) {
    const T = (s) => s * density;
    const nextX = spreadAcross(box.x + 5, box.x + box.w - 5, 6);
    let t = 0;
    let next = 0.1;
    let count = 0;
    let drops = [];
    return {
      duration: 6.6,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < T(5.8)) {
          next = t + 0.3;
          const x = ++count % 3 === 0 ? soul.x + rand(-3, 3) : nextX();
          const drop = new Shot({ x: Math.max(box.x + 4, Math.min(box.x + box.w - 4, x)), y: box.y + 3, warn: 0.55, vy: 18, gravity: 150, art: 'slagDrip' });
          drops.push(drop);
          bullets.push(drop);
        }
        for (const drop of drops) {
          if (drop.y < box.y + box.h - 3) continue;
          drop.spent = true;
          for (const way of [-1, 1]) {
            bullets.push(new Shot({ x: drop.x, y: box.y + box.h - 3, vx: way * rand(24, 42), vy: -rand(40, 70), gravity: 170, life: 0.8, art: 'slagSplash' }));
          }
        }
        drops = drops.filter((drop) => !drop.spent);
      },
    };
  },

  // Ooze: it slides across the floor of the box, three times, along rows
  // near yours, and where it has been the slag cools into crust, glowing at
  // first and then black, and stays a while. Gaps in the crust are where the
  // ooze was thinnest. Don't be in a row when it comes.
  slagOoze(box, density, { Shot, rand, clamp }) {
    const T = (s) => s * density;
    let t = 0;
    const passes = [];
    let launched = 0;
    let nextLaunch = 0.1;
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (launched < 3 && t >= nextLaunch) {
          nextLaunch = t + T(1.9);
          const fromLeft = launched % 2 === 0;
          const y = clamp(soul.y + rand(-7, 7), box.y + 7, box.y + box.h - 7);
          const x = fromLeft ? box.x - 6 : box.x + box.w + 6;
          const blob = new Shot({ x, y, warn: 0.6, vx: (fromLeft ? 1 : -1) * 31, art: 'slagBlob' });
          const gapAt = box.x + rand(14, box.w - 14);
          passes.push({ blob, y, way: fromLeft ? 1 : -1, laid: x, gapAt });
          bullets.push(blob);
          launched++;
        }
        for (const pass of passes) {
          if (pass.blob.age < pass.blob.warn) continue;
          // Lay crust every 10 px behind it, except across the gap.
          while ((pass.blob.x - pass.laid) * pass.way >= 10) {
            pass.laid += pass.way * 10;
            if (pass.laid < box.x - 3 || pass.laid > box.x + box.w + 3) continue;
            if (Math.abs(pass.laid - pass.gapAt) < 10) continue;
            bullets.push(new Shot({ x: pass.laid, y: pass.y + 1, life: 0.9, art: 'slagCrustHot' }));
            bullets.push(new Shot({ x: pass.laid, y: pass.y + 1, warn: 0.9, life: 1.9, art: 'slagCrust' }));
          }
        }
      },
    };
  },

  // The pour: a slow wave of glowing ooze comes across the box with a gap in
  // it you can ride through, bubbles popping off its back, and then a second
  // wave comes the other way with its gap a little way off. Stand and gawp
  // and it lobs a glob at you.
  slagPour(box, density, { Shot, rand, clamp }) {
    const T = (s) => s * density;
    const still = stillness();
    const GAP = 26;
    const WIDTH = 14;
    let t = 0;
    let waves = 0;
    let nextWave = 0.1;
    let gapY = rand(box.y + 22, box.y + box.h - 22);
    let live = [];
    let nextBubble = 0.5;
    let nextGlob = 0;
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        const stood = still(dt, soul);
        if (waves < 2 && t >= nextWave) {
          nextWave = t + T(2.3);
          const fromRight = waves % 2 === 0;
          if (waves > 0) gapY = clamp(gapY + (Math.random() < 0.5 ? -1 : 1) * 24, box.y + 16, box.y + box.h - 16);
          const x = fromRight ? box.x + box.w + 2 : box.x - WIDTH - 2;
          const vx = (fromRight ? -1 : 1) * 24;
          const lip = fromRight ? -1 : 1;
          const top = new Slab({ x, y: box.y - 4, w: WIDTH, h: gapY - GAP / 2 - (box.y - 4), vx, warn: 0.7, paint: (ctx, s) => paintPour(ctx, s, lip < 0 ? -1 : 1) });
          const bottom = new Slab({ x, y: gapY + GAP / 2, w: WIDTH, h: box.y + box.h + 4 - (gapY + GAP / 2), vx, warn: 0.7, paint: (ctx, s) => paintPour(ctx, s, lip < 0 ? -1 : 1) });
          bullets.push(top, bottom);
          live.push({ top, bottom, gapY });
          waves++;
        }
        live = live.filter((wave) => wave.top.x > box.x - 40 && wave.top.x < box.x + box.w + 40);
        if (t >= nextBubble && t < T(6)) {
          nextBubble = t + 0.34;
          const wave = live.find((w) => w.top.age > w.top.warn);
          if (wave) {
            const x = wave.top.x + rand(2, WIDTH - 2);
            const y = Math.random() < 0.5 ? wave.gapY - GAP / 2 - rand(2, 8) : wave.gapY + GAP / 2 + rand(2, 8);
            bullets.push(new Shot({ x, y, vx: wave.top.vx * 0.5, vy: -14, life: 1.1, art: 'slagBubble' }));
          }
        }
        // Standing about: it lobs a glob from the wave's front at you.
        if (stood > 0.7 && t >= nextGlob) {
          const wave = live.find((w) => w.top.age > w.top.warn);
          if (wave) {
            nextGlob = t + 1.6;
            const x = wave.top.vx < 0 ? wave.top.x : wave.top.x + WIDTH;
            const y = wave.gapY;
            const aim = Math.atan2(soul.y - y, soul.x - x);
            bullets.push(new Shot({ x, y, warn: 0.25, vx: Math.cos(aim) * 55, vy: Math.sin(aim) * 55, art: 'slagGlob' }));
          }
        }
      },
    };
  },

  // Cinders: the Slagling breathes out, and ash and embers lift off the
  // floor all across the box, drifting slowly up, swaying. Every so often it
  // works its bellows, and a burst of hot embers comes up under where you
  // are. Stand still and the little cinders drift your way.
  slagCinders(box, density, { Shot, rand, spreadAcross }) {
    const T = (s) => s * density;
    const still = stillness();
    const nextX = spreadAcross(box.x + 4, box.x + box.w - 4, 6);
    let t = 0;
    let next = 0.1;
    let nextBellows = 1.3;
    let rising = [];
    return {
      duration: 6.6,
      update: (dt, bullets, soul) => {
        t += dt;
        const stood = still(dt, soul);
        if (t >= next && t < T(5.8)) {
          next = t + 0.3;
          const x = nextX();
          const cinder = new Shot({ x, y: box.y + box.h + 3, vy: -rand(14, 22), art: 'slagCinder' });
          cinder.baseX = x;
          cinder.sway = rand(0, Math.PI * 2);
          rising.push(cinder);
          bullets.push(cinder);
          if (stood > 0.6) {
            // Drifting your way.
            const lean = new Shot({ x: soul.x + rand(-16, 16), y: box.y + box.h + 3, warn: 0.2, vy: -rand(22, 30), art: 'slagCinder' });
            lean.baseX = lean.x;
            lean.sway = 0;
            lean.toward = soul;
            rising.push(lean);
            bullets.push(lean);
          }
        }
        if (t >= nextBellows && t < T(5.6)) {
          nextBellows = t + 1.7;
          bullets.push(new Shot({ x: soul.x, y: box.y + box.h - 2, harmless: true, life: 0.45, art: 'slagSpark' }));
          for (let i = -2; i <= 2; i++) {
            bullets.push(new Shot({ x: soul.x + i * 6, y: box.y + box.h + 2, warn: 0.45, vy: -rand(44, 54), vx: i * 3, accel: -6, art: 'slagEmber' }));
          }
        }
        for (const cinder of rising) {
          if (cinder.toward) cinder.baseX += Math.sign(cinder.toward.x - cinder.baseX) * 9 * dt;
          cinder.x = cinder.baseX + Math.sin(cinder.age * 2.2 + cinder.sway) * 5;
        }
        rising = rising.filter((cinder) => cinder.y > box.y - 6);
      },
    };
  },
};
