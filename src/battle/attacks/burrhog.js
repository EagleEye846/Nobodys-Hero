import { defineBulletArt } from '../projectiles.js';

// The Burrhog's attacks. It's a hedgehog whose back is a pinecone, so
// everything it throws is off its own back: it curls into a spiky ball and
// rolls at you, shakes loose volleys of quills, drops pinecones that burst
// into scales, and curls up tight in the middle of the box to bristle.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape.

const CONE = { k: '#2a160c', c: '#9a5a2a', C: '#5e3216', h: '#d08a44', q: '#f0d8a8' };

// Curled up: a ball of pinecone scales with a tip on every one.
defineBulletArt('burrBall', {
  frames: [[
    '...k.k.k...',
    '..khkhkhk..',
    '.khcChcChk.',
    'khcChcChchk',
    '.cChcChcCc.',
    'khcChcChchk',
    '.cChcChcCc.',
    'khcChcChchk',
    '.khcChcChk.',
    '..khkhkhk..',
    '...k.k.k...',
  ]],
  palette: CONE,
  radius: 4.5,
  spin: 9,
});

// A quill, pale at the root and dark at the point.
defineBulletArt('burrQuill', {
  frames: [['.qqhhCk', 'qqhhCCk', '.qqhhCk']],
  palette: CONE,
  radius: 1.5,
  rotate: true,
});

// A pinecone, falling, and a scale off one.
defineBulletArt('burrCone', {
  frames: [['..k..', '.khk.', 'khcCk', 'kcChk', 'khcCk', '.kCk.', '..k..']],
  palette: CONE,
  radius: 2.5,
  spin: 2,
});
defineBulletArt('burrScale', {
  frames: [['.h.', 'hcC', '.C.']],
  palette: CONE,
  radius: 1.2,
  spin: 7,
});

export const BURRHOG_ATTACKS = {
  // Rolling burr: a dotted line flashes along a row, then the Burrhog comes
  // rolling along it curled into a ball, flinging quills up as it goes that
  // arc over and fall. Rows alternate sides, and every other one is yours.
  burrRoll(box, density, { Shot, Line, every, rand, clamp }) {
    let fromLeft = Math.random() < 0.5;
    let aimed = true;
    let balls = [];
    const roll = every(1.1, 1.35, (bullets, soul) => {
      const y = aimed ? clamp(soul.y, box.y + 6, box.y + box.h - 6) : rand(box.y + 8, box.y + box.h - 8);
      aimed = !aimed;
      const warn = 0.6;
      bullets.push(new Line({
        x: box.x, y, angle: 0, length: box.w, thickness: 9, warn, life: 0, color: '#5e3216',
      }));
      const ball = new Shot({ x: fromLeft ? box.x + 5 : box.x + box.w - 5, y, vx: fromLeft ? 105 : -105, warn, art: 'burrBall' });
      ball.flingIn = 0.15;
      bullets.push(ball);
      balls.push(ball);
      fromLeft = !fromLeft;
    });
    return {
      duration: 6.5,
      update: (dt, bullets, soul) => {
        roll(dt, bullets, soul);
        for (const ball of balls) {
          if (ball.age < ball.warn || ball.x < box.x || ball.x > box.x + box.w) continue;
          ball.flingIn -= dt;
          if (ball.flingIn > 0) continue;
          ball.flingIn += 0.2;
          // Flung up and back, it arcs over and comes down.
          bullets.push(new Shot({
            x: ball.x, y: ball.y - 4, vx: -Math.sign(ball.vx) * rand(5, 25), vy: rand(-80, -55), gravity: 150, life: 2.2, art: 'burrQuill',
          }));
        }
        balls = balls.filter((ball) => ball.x > box.x - 12 && ball.x < box.x + box.w + 12);
      },
    };
  },

  // Quill volley: it shakes itself from the top of the box and loose quills
  // fly at you in fans. Every other fan is aimed straight at you, and the
  // ones between are aimed half a gap aside, so stepping into a gap once
  // isn't enough: you step, then step back.
  burrQuills(box, density, { Shot, every, rand, angleTo, shuffleBag }) {
    const spots = shuffleBag([box.x + 12, box.x + box.w / 2, box.x + box.w - 12]);
    let from = { x: spots(), y: box.y - 2 };
    let volley = 0;
    const count = 7;
    const spacing = 0.2;
    const shake = every(0.85, 1.0, (bullets, soul) => {
      if (volley % 3 === 0) from = { x: spots(), y: box.y - 2 };
      const aim = angleTo(from, soul) + (volley % 2 ? spacing / 2 : 0);
      volley++;
      const speed = rand(70, 80);
      for (let i = 0; i < count; i++) {
        const angle = aim + (i - (count - 1) / 2) * spacing;
        bullets.push(new Shot({ x: from.x, y: from.y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, warn: 0.25, life: 2.5, art: 'burrQuill' }));
      }
    }, { first: 0.2 });
    return { duration: 6.5, update: (dt, bullets, soul) => shake(dt, bullets, soul) };
  },

  // Pinecones: they fall from the top of the box, and when they hit the
  // floor they burst into a fountain of scales that fly up and rain down
  // again. One in three falls right over you.
  burrCones(box, density, { Shot, every, rand, clamp, spreadAcross }) {
    const floor = box.y + box.h - 3;
    const nextX = spreadAcross(box.x + 6, box.x + box.w - 6, 5);
    let cones = [];
    let drop = 0;
    const fall = every(0.6, 0.8, (bullets, soul) => {
      const x = drop++ % 3 === 0 ? clamp(soul.x, box.x + 4, box.x + box.w - 4) : nextX();
      const cone = new Shot({ x, y: box.y - 4, vy: 30, gravity: 140, art: 'burrCone' });
      bullets.push(cone);
      cones.push(cone);
    });
    return {
      duration: 6.5,
      update: (dt, bullets, soul) => {
        fall(dt, bullets, soul);
        for (const cone of cones) {
          if (cone.y < floor) continue;
          cone.life = cone.age;
          for (let i = 0; i < 5; i++) {
            const angle = -Math.PI / 2 + (i - 2) * 0.32 + rand(-0.08, 0.08);
            const speed = rand(85, 105);
            bullets.push(new Shot({ x: cone.x, y: floor - 2, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, gravity: 160, life: 2, art: 'burrScale' }));
          }
        }
        cones = cones.filter((cone) => cone.y < floor);
      },
    };
  },

  // Bristle: it curls up tight in the middle of the box, and rings of quills
  // burst off it, each with one gap, and the gap creeps round a little every
  // ring. Circle the box with the gap.
  burrBristle(box, density, { Shot, every, rand }) {
    const centre = { x: box.x + box.w / 2, y: box.y + box.h / 2 };
    const count = 16;
    const turn = (Math.random() < 0.5 ? -1 : 1) * rand(0.35, 0.45);
    let gapAngle = Math.random() * Math.PI * 2;
    let ball = null;
    const ring = every(0.8, 0.8, (bullets) => {
      if (!ball) {
        ball = new Shot({ x: centre.x, y: centre.y, warn: 0.6, art: 'burrBall' });
        bullets.push(ball);
      }
      for (let i = 0; i < count; i++) {
        const angle = gapAngle + ((i + 0.5) / count) * Math.PI * 2;
        // Two quills either side of the gap's middle are left out.
        if (i === 0 || i === count - 1) continue;
        bullets.push(new Shot({
          x: centre.x + Math.cos(angle) * 6, y: centre.y + Math.sin(angle) * 6,
          vx: Math.cos(angle) * 48, vy: Math.sin(angle) * 48, warn: 0.15, life: 2, art: 'burrQuill',
        }));
      }
      gapAngle += turn;
    }, { first: 0.9 });
    return { duration: 6.5, update: (dt, bullets, soul) => ring(dt, bullets, soul) };
  },
};
