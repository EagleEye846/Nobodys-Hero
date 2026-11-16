import { defineBulletArt } from '../projectiles.js';
import { Slab, stillness } from './underShapes.js';
import { Zone } from './coastKit.js';

// The Slagling's attacks. It's a lump of mine slag, still hot, that came
// out of the old furnace vents and never went back. It's nervous (it spits
// sparks), it oozes, and it would very much like someone to sit with it:
//   - Sparks: spat out in fans, never quite where you'd like.
//   - Ooze: it slides along the floor leaving cooling crust behind it.
//   - The pour: a slow glowing wave with a gap to ride through.
//   - The crust: the floor is plates of crust over melt; a plate ticks,
//     cracks glowing, and then the melt wells up through it. Ticking = move.
//   - Sit with me: a little lump shuffles over to sit with you, leaving hot
//     crust where it's been, and panics into a ring of sparks when it's close.
// Slow, hot and heavy; nothing here is fast, but all of it sticks around.
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

// A little lump of it that wants to sit with you: a hot blob with a shy face.
defineBulletArt('slagLump', {
  frames: [
    ['..kkkk..', '.kooyok.', 'koeoyeok', 'kooyyook', '.krrrrk.', '..kkkk..'],
    ['..kkkk..', '.koyook.', 'koeoyeok', 'koyoyook', '.krrrrk.', '..kkkk..'],
  ],
  palette: BLOB,
  radius: 3.4,
  frameSeconds: 0.3,
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
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t < next || t > T(6.8)) return;
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
      duration: 7.8,
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
      duration: 7.8,
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


  // The crust: the floor of the box is a skin of cooled slag in plates, and
  // underneath it's all still molten. A plate starts to tick (cracks show
  // and glow), and then it splits and the melt wells up through it for a
  // moment before it crusts over again. Plates go one after another, often
  // the one you're on. Ticking means move.
  slagCrust(box, density, { rand }) {
    const T = (s) => s * density;
    const N = 4;
    const W = box.w / N;
    const H = box.h / N;
    const TICK = 0.75;
    const HOT = 0.7;
    let t = 0;
    let next = T(0.15);
    let count = 0;
    const busy = new Map();
    const plate = (c, r) => (ctx, z, hot) => {
      const x = Math.round(z.x);
      const y = Math.round(z.y);
      if (hot) {
        ctx.fillStyle = '#ff7a18';
        ctx.fillRect(x + 1, y + 1, W - 2, H - 2);
        ctx.fillStyle = '#ffc23a';
        ctx.fillRect(x + 3, y + 3, W - 6, H - 6);
        ctx.fillStyle = '#fff2a8';
        ctx.fillRect(x + W / 2 - 2, y + H / 2 - 1, 4, 2);
        return;
      }
      // Ticking: the cracks spread and glow.
      ctx.globalAlpha = 1;
      const k = Math.min(1, z.age / TICK);
      ctx.fillStyle = Math.floor(z.age * 12) % 2 ? '#ff7a18' : '#c2300c';
      const cx = x + W / 2;
      const cy = y + H / 2;
      const len = 2 + k * (W / 2 - 2);
      ctx.fillRect(cx - len, cy, len * 2, 1);
      ctx.fillRect(cx, cy - len * (H / W), 1, len * 2 * (H / W));
      ctx.fillRect(cx - len * 0.6, cy - len * 0.6, 1, 1);
      ctx.fillRect(cx + len * 0.6, cy + len * 0.6, 1, 1);
      ctx.fillRect(cx + len * 0.6, cy - len * 0.6, 1, 1);
      ctx.fillRect(cx - len * 0.6, cy + len * 0.6, 1, 1);
    };
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        const now = t / density;
        if (t < next || now > 6.7) return;
        next = t + T(0.32);
        count++;
        // Every third plate is the one you're on.
        let c;
        let r;
        if (count % 3 === 0) {
          c = Math.min(N - 1, Math.max(0, Math.floor((soul.x - box.x) / W)));
          r = Math.min(N - 1, Math.max(0, Math.floor((soul.y - box.y) / H)));
        } else {
          c = Math.floor(rand(0, N));
          r = Math.floor(rand(0, N));
        }
        const key = c + r * N;
        if ((busy.get(key) ?? -1) > now) return;
        busy.set(key, now + TICK + HOT + 0.2);
        bullets.push(new Zone({ x: box.x + c * W, y: box.y + r * H, w: W, h: H, warn: TICK, life: HOT, paint: plate(c, r) }));
      },
    };
  },

  // Sit with me: a little lump of it comes shuffling over to sit with you,
  // slow and shy, leaving warm sticky crust where it's been. When it gets
  // close it panics (it trembles first) and spits a ring of sparks, backs
  // off, and tries again. A second one comes to join in. Keep them at arm's
  // length, and mind where they've been.
  slagHug(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    const NEAR = 20;
    const TREMBLE = 0.4;
    const lumps = [];
    let t = 0;
    let made = 0;
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        const real = dt / density;
        if (made < 2 && t >= T(0.1 + made * 3.2)) {
          made++;
          // In from a corner away from you.
          const right = soul.x < box.x + box.w / 2;
          const low = soul.y < box.y + box.h / 2;
          const lump = new Shot({ x: right ? box.x + box.w - 6 : box.x + 6, y: low ? box.y + box.h - 6 : box.y + 6, warn: 0.6, art: 'slagLump', life: 8 });
          lump.mode = 'come';
          lump.timer = 0;
          lump.drip = 0;
          lumps.push(lump);
          bullets.push(lump);
        }
        for (const lump of lumps) {
          if (lump.age < lump.warn || lump.age > lump.warn + lump.life) continue;
          const dx = soul.x - lump.x;
          const dy = soul.y - lump.y;
          const d = Math.hypot(dx, dy) || 1;
          if (lump.mode === 'come') {
            lump.x += (dx / d) * 27 * real;
            lump.y += (dy / d) * 27 * real;
            if (d < NEAR) {
              lump.mode = 'tremble';
              lump.timer = TREMBLE;
            }
          } else if (lump.mode === 'tremble') {
            lump.timer -= real;
            lump.x += Math.sin(t * 80) * 0.4;
            if (lump.timer <= 0) {
              // Panic: sparks all round.
              const turn = rand(0, Math.PI);
              for (let i = 0; i < 9; i++) {
                const a = turn + (i / 9) * Math.PI * 2;
                bullets.push(new Shot({ x: lump.x, y: lump.y, vx: Math.cos(a) * 48, vy: Math.sin(a) * 48, art: 'slagSpark', life: 1.6 }));
              }
              lump.mode = 'back';
              lump.timer = 0.7;
            }
          } else {
            lump.timer -= real;
            lump.x -= (dx / d) * 20 * real;
            lump.y -= (dy / d) * 20 * real;
            if (lump.timer <= 0) lump.mode = 'come';
          }
          lump.x = Math.min(Math.max(lump.x, box.x + 5), box.x + box.w - 5);
          lump.y = Math.min(Math.max(lump.y, box.y + 5), box.y + box.h - 5);
          // Where it's been stays hot a moment.
          lump.drip -= real;
          if (lump.drip <= 0 && lump.mode !== 'tremble') {
            lump.drip = 0.32;
            bullets.push(new Shot({ x: lump.x, y: lump.y, life: 1.1, art: 'slagCrustHot' }));
          }
        }
      },
    };
  },
};
