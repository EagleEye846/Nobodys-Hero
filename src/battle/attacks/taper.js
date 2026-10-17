import { defineBulletArt } from '../projectiles.js';

// Mother Taper's attacks, for when she blocks the way out of the Ruins. She's
// a tall old candle who loves her flowers and doesn't really want to hurt you,
// so her attacks are wax and flame and candles and petals, always with a way
// through. She's the Ruins' boss, so they're busy, and each one picks up a
// little partway through. (Her data file marks her `gentle`, so they thin out
// as her MERCY rises, and she adds a light second attack when she's low: see
// `secondWind`.)

const WAX = { c: '#f2e6c8', C: '#cdb98f', w: '#ffffff' };
const FIRE = { f: '#ff8c1a', F: '#ffcc66', r: '#e0401a', w: '#fff2c0' };

// A heavy drop of her wax.
defineBulletArt('taperDrop', {
  frames: [[
    '..c..',
    '.ccc.',
    'cwccc',
    'ccccC',
    '.cCC.',
  ]],
  palette: WAX,
  radius: 2,
});

// One of her flames, flickering.
defineBulletArt('taperFlame', {
  frames: [
    ['..f..', '.fFf.', 'fFwFf', 'fFwFr', '.fFr.'],
    ['.f...', '.fFf.', 'fFFwf', 'rFwFf', '.rFf.'],
    ['...f.', '.fFf.', 'fwFFf', 'fFwFr', '.fFf.'],
  ],
  palette: FIRE,
  radius: 2,
  frameSeconds: 0.08,
});

// A little candle she sets down (harmless itself; it fires its flame a moment later).
defineBulletArt('taperCandle', {
  frames: [
    ['..f..', '.fFf.', '..k..', '.ccc.', '.cwC.', '.ccC.', 'CCCCC'],
    ['.f...', '.Ff..', '..k..', '.ccc.', '.cwC.', '.ccC.', 'CCCCC'],
  ],
  palette: { ...WAX, ...FIRE, k: '#4a2a14' },
  radius: 3,
  frameSeconds: 0.12,
});

// A petal from her flowers, tumbling.
defineBulletArt('taperPetal', {
  frames: [
    ['.pp.', 'pPPp', '.pp.'],
    ['.p..', 'pPp.', '.pPp', '..p.'],
    ['.pp.', 'pPPp', '.pp.'],
    ['..p.', '.pPp', 'pPp.', '.p..'],
  ],
  palette: { p: '#ff7aa8', P: '#ffd6e6' },
  radius: 1.5,
  frameSeconds: 0.14,
});

// A tear of melting wax, falling slowly.
defineBulletArt('taperTear', {
  frames: [[
    '.c.',
    'cwc',
    'cCc',
    '.C.',
  ]],
  palette: { ...WAX, c: '#e8eef8', C: '#a8b8d0' },
  radius: 1.5,
});

export const TAPER_ATTACKS = {
  // Wax pours down across the box with one gap left in it, swaying from side
  // to side, and swaying faster the longer it goes. Stay in it.
  taperWaxRain(box, density, { Shot, every, rand, clamp }) {
    let time = 0;
    let sway = rand(0, Math.PI * 2);
    const gapWidth = 30;
    const gapAt = () => box.x + box.w / 2 + Math.sin(sway) * (box.w / 2 - gapWidth);
    const rain = every(0.07, 0.1, (bullets) => {
      const gap = gapAt();
      let x = rand(box.x + 4, box.x + box.w - 4);
      if (Math.abs(x - gap) < gapWidth / 2) x = clamp(gap + Math.sign(x - gap || 1) * (gapWidth / 2 + rand(2, 8)), box.x + 4, box.x + box.w - 4);
      bullets.push(new Shot({ x, y: box.y - 3, vy: rand(75, 95), art: 'taperDrop' }));
    });
    // Now and then a heavy drop falls right down the middle of the gap.
    const plop = every(1.8, 2.2, (bullets) => {
      bullets.push(new Shot({ x: gapAt() + rand(-4, 4), y: box.y - 3, vy: 60, accel: 40, art: 'taperDrop', warn: 0.6 }));
    }, { first: 2 });
    return {
      duration: 7,
      update: (dt, bullets) => {
        time += dt;
        sway += dt * (0.8 + time * 0.05);
        rain(dt, bullets);
        plop(dt, bullets);
      },
    };
  },

  // Walls of flame sweep across with one narrow gap, near you but never on
  // you. Halfway through, walls come from both sides at once, gaps apart.
  taperFlameWall(box, density, { Shot, every, rand, clamp, shuffleBag }) {
    let time = 0;
    const side = shuffleBag(['left', 'right']);
    const wall = (bullets, fromLeft, gapY) => {
      for (let y = box.y + 4; y < box.y + box.h; y += 8) {
        if (Math.abs(y - gapY) < 12) continue;
        bullets.push(new Shot({ x: fromLeft ? box.x - 4 : box.x + box.w + 4, y, vx: fromLeft ? 80 : -80, art: 'taperFlame', warn: 0.6 }));
      }
    };
    const sweep = every(1.3, 1.5, (bullets, soul) => {
      const gapY = clamp(soul.y + rand(18, 36) * (Math.random() < 0.5 ? -1 : 1), box.y + 10, box.y + box.h - 10);
      if (time < 4.5) {
        wall(bullets, side() === 'left', gapY);
        return;
      }
      // Both sides: the second wall's gap is somewhere else, so you have to move between them.
      const otherY = clamp(gapY + rand(22, 32) * (gapY > box.y + box.h / 2 ? -1 : 1), box.y + 10, box.y + box.h - 10);
      wall(bullets, true, gapY);
      wall(bullets, false, otherY);
    });
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        time += dt;
        sweep(dt, bullets, soul);
      },
    };
  },

  // She sets candles down in a tight ring around you. A moment later each one
  // throws its flame across where you were standing, and on out the other
  // side. Get out of the ring before they're lit; later, two rings at once.
  taperCandleRing(box, density, { Shot, every, rand, clamp, angleTo }) {
    let time = 0;
    let rings = [];
    const ring = (bullets, center, count, radius, fuse) => {
      const turn = rand(0, Math.PI * 2);
      const candles = [];
      for (let i = 0; i < count; i++) {
        const angle = turn + (i / count) * Math.PI * 2;
        const x = clamp(center.x + Math.cos(angle) * radius, box.x + 5, box.x + box.w - 5);
        const y = clamp(center.y + Math.sin(angle) * radius, box.y + 5, box.y + box.h - 5);
        bullets.push(new Shot({ x, y, art: 'taperCandle', harmless: true, life: fuse + 0.1 }));
        candles.push({ x, y });
      }
      rings.push({ center, candles, t: fuse });
    };
    const place = every(1.7, 1.9, (bullets, soul) => {
      ring(bullets, { x: soul.x, y: soul.y }, 8, 40, 1);
      // Later on, a second, wider ring around a spot nearby.
      if (time > 4.5) ring(bullets, { x: soul.x + rand(-30, 30), y: soul.y + rand(-15, 15) }, 6, 50, 1.4);
    });
    return {
      duration: 7.5,
      update: (dt, bullets, soul) => {
        time += dt;
        place(dt, bullets, soul);
        for (const lit of rings) {
          lit.t -= dt;
          if (lit.t > 0) continue;
          for (const candle of lit.candles) {
            const aim = angleTo(candle, lit.center);
            bullets.push(new Shot({ x: candle.x, y: candle.y, vx: Math.cos(aim) * 75, vy: Math.sin(aim) * 75, art: 'taperFlame' }));
          }
        }
        rings = rings.filter((lit) => lit.t > 0);
      },
    };
  },

  // Petals swirl in from the edges, weaving toward you, and every so often
  // one of her flowers blooms open somewhere in the box and throws its petals
  // out in a ring.
  taperPetals(box, density, { Shot, every, rand, edgePoint, angleTo, shuffleBag }) {
    const edge = shuffleBag(['top', 'left', 'right', 'top']);
    const drift = every(0.14, 0.2, (bullets, soul) => {
      const start = edgePoint(box, edge());
      const aim = angleTo(start, soul) + rand(-0.45, 0.45);
      const speed = rand(36, 48);
      bullets.push(new Shot({
        x: start.x, y: start.y, vx: Math.cos(aim) * speed, vy: Math.sin(aim) * speed,
        art: 'taperPetal', wobble: { amplitude: rand(4, 7), frequency: rand(3, 5) },
      }));
    });
    const bloom = every(2, 2.4, (bullets, soul) => {
      // Not right on top of you: somewhere you can see it coming.
      let x = rand(box.x + 12, box.x + box.w - 12);
      if (Math.abs(x - soul.x) < 36) x = soul.x + (x < soul.x ? -36 : 36);
      const y = rand(box.y + 10, box.y + box.h - 10);
      const turn = rand(0, Math.PI);
      for (let i = 0; i < 8; i++) {
        const angle = turn + (i / 8) * Math.PI * 2;
        bullets.push(new Shot({ x, y, vx: Math.cos(angle) * 45, vy: Math.sin(angle) * 45, art: 'taperPetal', warn: 0.7 }));
      }
    }, { first: 1.5 });
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        drift(dt, bullets, soul);
        bloom(dt, bullets, soul);
      },
    };
  },

  // Her wax melts and falls like tears, bending toward you as they fall, then
  // splashing into flecks that bounce back up when they hit the floor of the box.
  taperTears(box, density, { Shot, every, rand, spreadAcross }) {
    const dropX = spreadAcross(box.x + 8, box.x + box.w - 8, 6);
    let tears = [];
    const cry = every(0.36, 0.46, (bullets, soul) => {
      const shot = new Shot({ x: dropX(), y: box.y + 2, vy: 38, art: 'taperTear', warn: 0.35, homing: { target: soul, turn: 0.55 }, accel: 20 });
      bullets.push(shot);
      tears.push(shot);
    });
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        cry(dt, bullets, soul);
        for (const tear of tears) {
          if (tear.y < box.y + box.h - 4) continue;
          tear.life = 0;
          for (const side of [-1, 1]) {
            bullets.push(new Shot({ x: tear.x, y: box.y + box.h - 4, vx: side * rand(30, 45), vy: -rand(50, 70), gravity: 150, art: 'taperDrop', life: 1.2 }));
          }
        }
        tears = tears.filter((tear) => tear.y < box.y + box.h - 4 && tear.life > 0);
      },
    };
  },
};
