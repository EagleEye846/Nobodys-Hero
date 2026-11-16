import { defineBulletArt } from '../projectiles.js';

// The Burrhog's attacks. It's a hedgehog whose back is a pinecone: soft from
// the front, prickly everywhere else, and it curls up at anything. So it
// fights the way it lives: it trots after you and curls up in a bristling
// panic whenever you come close; it goes rolling downhill through the trees,
// bumping off every trunk; and it rolls along the rows, flinging quills.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape.

const CONE = { k: '#2a160c', c: '#9a5a2a', C: '#5e3216', h: '#d08a44', q: '#f0d8a8', f: '#b08060', p: '#f0a0a0' };
const TREE = { k: '#1c2a14', g: '#4a7a34', G: '#2e5a22', t: '#5e3216' };

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

// Uncurled and trotting: pinecone back, soft pink-nosed face, little feet.
const HOG = [
  ['...k.k.k.....', '..khkhkhkk...', '.khcChcChkff.', 'khcChcChcffkf', '.cChcChcCfffp', '..ffffffff...', '..f..f.f..f..'],
  ['...k.k.k.....', '..khkhkhkk...', '.khcChcChkff.', 'khcChcChcffkf', '.cChcChcCfffp', '..ffffffff...', '...f..f..f...'],
];
const flip = (frame) => frame.map((row) => [...row].reverse().join(''));
defineBulletArt('burrHogR', { frames: HOG, palette: CONE, radius: 4, frameSeconds: 0.15 });
defineBulletArt('burrHogL', { frames: HOG.map(flip), palette: CONE, radius: 4, frameSeconds: 0.15 });

// A quill, pale at the root and dark at the point.
defineBulletArt('burrQuill', {
  frames: [['.qqhhCk', 'qqhhCCk', '.qqhhCk']],
  palette: CONE,
  radius: 1.5,
  rotate: true,
});

// A pinecone shaken off a tree.
defineBulletArt('burrCone', {
  frames: [['.k.', 'khk', 'cCc', '.C.']],
  palette: CONE,
  radius: 1.6,
  spin: 3,
});

// A little pine on the slope (harmless: the rolling hog bounces off it).
defineBulletArt('burrPine', {
  frames: [['..g..', '.gGg.', 'gGgGg', '.gGg.', 'gGgGg', '..t..']],
  palette: TREE,
  radius: 2.5,
});

export const BURRHOG_ATTACKS = {
  // Don't crowd it: it trots after you, soft face first. Get too close (or
  // let it get too close) and it panics: it stops, curls up (the quills
  // flash first), and bursts two rings of quills off its back. Every second
  // panic it stays curled and rolls off at where you were, bounces off a
  // wall, and uncurls. Keep a good distance, but it never stops coming.
  burrCurl(box, density, { Shot, rand, angleTo, clamp }) {
    const hog = new Shot({ x: box.x + (Math.random() < 0.5 ? 10 : box.w - 10), y: box.y + 10, warn: 0.5, art: 'burrHogR' });
    let state = 'trot';
    let timer = 1.2;
    let panics = 0;
    let shed = 0;
    let started = false;
    // It changes look as it goes (the art of a bullet made with each look).
    const look = (name, art) => { hog.artName = name; hog.art = art; };
    const arts = {};
    const burst = (bullets) => {
      // It bristles twice: the second ring sits in the first one's gaps.
      const count = 12;
      const turn = rand(0, Math.PI * 2);
      for (let ring = 0; ring < 2; ring++) {
        for (let i = 0; i < count; i++) {
          const angle = turn + ((i + ring / 2) / count) * Math.PI * 2;
          bullets.push(new Shot({
            x: hog.x + Math.cos(angle) * 5, y: hog.y + Math.sin(angle) * 5,
            vx: Math.cos(angle) * 58, vy: Math.sin(angle) * 58, warn: 0.45 + ring * 0.4, life: 2, art: 'burrQuill', angle,
          }));
        }
      }
    };
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        if (!started) {
          started = true;
          bullets.push(hog);
          for (const name of ['burrHogR', 'burrHogL', 'burrBall']) arts[name] = new Shot({ x: 0, y: 0, art: name }).art;
        }
        if (hog.age < hog.warn) return;
        timer -= dt;
        const near = Math.hypot(soul.x - hog.x, soul.y - hog.y);
        if (state === 'trot') {
          const angle = angleTo(hog, soul);
          hog.vx = Math.cos(angle) * 34;
          hog.vy = Math.sin(angle) * 34;
          look(hog.vx >= 0 ? 'burrHogR' : 'burrHogL', arts[hog.vx >= 0 ? 'burrHogR' : 'burrHogL']);
          // It panics when you're close, or when it's been brave too long.
          if ((near < 26 && timer < 0.6) || timer <= 0) {
            state = 'curl';
            timer = 0.9;
            hog.vx = 0;
            hog.vy = 0;
            look('burrBall', arts.burrBall);
            burst(bullets);
            panics++;
          }
        } else if (state === 'curl') {
          if (timer <= 0) {
            if (panics % 2 === 0) {
              // Off it rolls, at where you were.
              state = 'roll';
              timer = 1.3;
              const angle = angleTo(hog, soul);
              hog.vx = Math.cos(angle) * 85;
              hog.vy = Math.sin(angle) * 85;
            } else {
              state = 'trot';
              timer = rand(1.3, 1.6);
            }
          }
        } else if (state === 'roll') {
          if (hog.x < box.x + 5 || hog.x > box.x + box.w - 5) hog.vx = -hog.vx;
          if (hog.y < box.y + 5 || hog.y > box.y + box.h - 5) hog.vy = -hog.vy;
          hog.x = clamp(hog.x, box.x + 5, box.x + box.w - 5);
          hog.y = clamp(hog.y, box.y + 5, box.y + box.h - 5);
          // Quills shake loose behind it as it goes.
          shed -= dt;
          if (shed <= 0) {
            shed = 0.16;
            const back = Math.atan2(-hog.vy, -hog.vx) + rand(-0.6, 0.6);
            bullets.push(new Shot({ x: hog.x, y: hog.y, vx: Math.cos(back) * 30, vy: Math.sin(back) * 30, life: 1.4, art: 'burrQuill' }));
          }
          if (timer <= 0) {
            state = 'trot';
            timer = rand(1.3, 1.6);
          }
        }
      },
    };
  },

  // Downhill: the box is a slope planted with little pines. Burrhogs come
  // rolling down it from the top (each blinks first, and every other one
  // starts right over you), bumping off every tree they meet and going off
  // at an angle; at the bottom they roll away along the floor. The trees
  // themselves are safe to stand by. Watch each ball's bounce, not its start.
  burrDownhill(box, density, { Shot, every, rand, clamp }) {
    const trees = [];
    const rows = [box.y + 24, box.y + 42, box.y + 60];
    rows.forEach((y, r) => {
      for (let x = box.x + (r % 2 ? 10 : 20); x < box.x + box.w - 4; x += 20) trees.push({ x, y });
    });
    const floor = box.y + box.h - 5;
    let balls = [];
    let aimed = true;
    let planted = false;
    const drop = every(0.55, 0.7, (bullets, soul) => {
      const x = aimed ? clamp(soul.x, box.x + 6, box.x + box.w - 6) : rand(box.x + 6, box.x + box.w - 6);
      aimed = !aimed;
      const ball = new Shot({ x, y: box.y + 4, vx: rand(-10, 10), warn: 0.5, gravity: 140, art: 'burrBall' });
      ball.rolling = false;
      bullets.push(ball);
      balls.push(ball);
    }, { first: 0.4 });
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        if (!planted) {
          planted = true;
          for (const tree of trees) bullets.push(new Shot({ x: tree.x, y: tree.y, harmless: true, art: 'burrPine' }));
        }
        drop(dt, bullets, soul);
        for (const ball of balls) {
          if (ball.age < ball.warn || ball.rolling) continue;
          for (const tree of trees) {
            const dx = ball.x - tree.x;
            const dy = ball.y - tree.y;
            const d = Math.hypot(dx, dy);
            const reach = 7;
            if (d >= reach || d === 0) continue;
            const nx = dx / d;
            const ny = dy / d;
            const along = ball.vx * nx + ball.vy * ny;
            if (along >= 0) continue;
            // Bump: off the trunk at an angle, losing a little speed.
            ball.vx -= 1.6 * along * nx;
            ball.vy -= 1.6 * along * ny;
            if (Math.abs(ball.vx) < 25) ball.vx = (nx >= 0 ? 1 : -1) * rand(25, 40);
            ball.x = tree.x + nx * reach;
            ball.y = tree.y + ny * reach;
            // The tree shakes, and a cone drops off it.
            if (ball.age - (tree.shook ?? -9) > 0.3) {
              tree.shook = ball.age;
              bullets.push(new Shot({ x: tree.x + rand(-3, 3), y: tree.y + 3, vx: rand(-15, 15), vy: 10, gravity: 100, life: 1.6, art: 'burrCone' }));
            }
          }
          if (ball.x < box.x + 4 || ball.x > box.x + box.w - 4) {
            ball.vx = -ball.vx;
            ball.x = clamp(ball.x, box.x + 4, box.x + box.w - 4);
          }
          if (ball.y >= floor) {
            // At the bottom it rolls away the way it was going.
            ball.rolling = true;
            ball.y = floor;
            ball.gravity = 0;
            ball.vy = 0;
            ball.vx = (ball.vx >= 0 ? 1 : -1) * 70;
          }
        }
        balls = balls.filter((ball) => ball.x > box.x - 12 && ball.x < box.x + box.w + 12);
      },
    };
  },

  // Rolling burr: a dotted line flashes along a row, then the Burrhog comes
  // rolling along it curled into a ball, flinging quills up as it goes that
  // arc over and fall. Rows alternate sides, and every other one is yours.
  burrRoll(box, density, { Shot, Line, every, rand, clamp }) {
    let fromLeft = Math.random() < 0.5;
    let aimed = true;
    let balls = [];
    const roll = every(1.3, 1.5, (bullets, soul) => {
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
      duration: 8,
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
};
