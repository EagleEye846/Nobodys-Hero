import { defineBulletArt } from '../projectiles.js';
import { withSnipes } from './snipes.js';

// The Ashling's attacks. It is a little figure of packed ash with two ember
// eyes, and everything it throws is itself: flakes of ash falling like slow
// snow (the wind sways them, and the ones that are after you tick first),
// balls of packed ash lobbed in arcs that burst where they land (the landing
// spot is marked first), clods crumbling off it in a falling wall with a gap,
// and its own ember eyes, a pair at a time, that blink at the edge of the box
// and then fly at you. It stands to the right of the box.

const ASH = {
  k: '#141012', a: '#3c3637', A: '#5e5856', g: '#8d8781', G: '#b4aea6', w: '#d8d2c8',
  e: '#ff8c1a', E: '#ffd25e', r: '#a8401a', y: '#fff4c8',
};

// A flake of ash: a ragged grey scrap, two ways up.
defineBulletArt('ashlFlake', {
  frames: [['.GG..', 'GwgG.', '.gGgg', '..g..'], ['..G..', '.gwG.', 'GgGgg', '.g.g.']],
  palette: ASH,
  radius: 1.8,
  frameSeconds: 0.3,
});

// A ball of packed ash, light on top, with a warm crack in it.
defineBulletArt('ashlBall', {
  frames: [[
    '..AAAAA..',
    '.AgGGgAA.',
    'AgGwGggAA',
    'AgGGgrgAA',
    'AggggegAa',
    'AAggrggAa',
    '.AAgggAa.',
    '..aAAaa..',
  ]],
  palette: ASH,
  radius: 4,
  spin: 3,
});

// A clod of ash that breaks off (smaller).
defineBulletArt('ashlClod', {
  frames: [['.AgA.', 'AgGgA', 'AggrA', '.aAa.']],
  palette: ASH,
  radius: 2.2,
  spin: 5,
});

// One of its eyes: an ember, bright in the middle.
defineBulletArt('ashlEye', {
  frames: [['.rer.', 'reEer', 'eEyEe', 'reEer', '.rer.'], ['..r..', '.eEe.', 'rEyEr', '.eEe.', '..r..']],
  palette: ASH,
  radius: 2.4,
  frameSeconds: 0.09,
});

// Where a ball will land (harmless): a scorch with a ring of grey.
defineBulletArt('ashlMark', {
  frames: [['.g.g.g.', 'g.....g', '...r...', 'g..e..g', '...r...', 'g.....g', '.g.g.g.'], ['..g.g..', '.......', 'g..r..g', '..rer..', 'g..r..g', '.......', '..g.g..']],
  palette: ASH,
  radius: 1,
  frameSeconds: 0.12,
  rim: false,
});

// Grains trickling down a column before a clod comes (harmless).
defineBulletArt('ashlGrain', { frames: [['g', 'G']], palette: ASH, radius: 0.5, rim: false });

// A Shot whose own path matters (an arc to a marked spot) gets its velocity a
// frame after it's made, so the battle's speed setting doesn't bend it.
function launchLater(pending) {
  for (const p of pending.splice(0)) {
    p.shot.vx = p.vx;
    p.shot.vy = p.vy;
  }
}

export const ASHLING_ATTACKS = {
  // Flurry: ash falling like snow, swaying in a slow wind. Every fourth flake
  // is dropped over where you are and ticks at the top first.
  ashlFlurry(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let next = 0.1;
    let count = 0;
    const flakes = [];
    return {
      duration: 6.4,
      update: (dt, bullets, soul) => {
        t += dt;
        const wind = Math.sin(t * 0.9) * 14;
        for (const f of flakes) {
          if (f.base === undefined) { f.base = f.vx; continue; }
          if (f.age > f.warn) f.vx = f.base + wind + Math.sin(f.age * 2.6 + f.phase) * 9;
        }
        for (let i = flakes.length - 1; i >= 0; i--) if (flakes[i].y > box.y + box.h + 8) flakes.splice(i, 1);
        if (t < next || t > 5.2) return;
        next = t + 0.105;
        const aimed = count % 4 === 0;
        const x = aimed ? clamp(soul.x + rand(-3, 3), box.x + 3, box.x + box.w - 3) : rand(box.x - 6, box.x + box.w + 6);
        const flake = new Shot({ x, y: box.y - 2, vx: 0, vy: rand(40, 52), warn: aimed ? 0.42 : 0, art: 'ashlFlake', life: 3 });
        flake.phase = rand(0, 6.28);
        flakes.push(flake);
        bullets.push(flake);
        count++;
      },
    };
  },

  // Balls: it packs a ball of ash and lobs it. The spot it will land on (where
  // you are, or a little ahead) shows a scorch first; the ball arcs in from the
  // right and bursts there into clods.
  ashlBalls(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let thrown = 0;
    const pending = [];
    const balls = [];
    const heading = { x: 0, y: 0 };
    let seen = null;
    const GRAV = 160;
    const FLIGHT = 0.75;
    return {
      duration: 7.0,
      update: (dt, bullets, soul) => {
        t += dt;
        launchLater(pending);
        if (seen && dt > 0) {
          heading.x = heading.x * 0.85 + ((soul.x - seen.x) / dt) * 0.15;
          heading.y = heading.y * 0.85 + ((soul.y - seen.y) / dt) * 0.15;
        }
        seen = { x: soul.x, y: soul.y };
        if (thrown < 5 && t >= 0.25 + thrown * 1.05) {
          const lead = thrown % 2 ? 0.55 : 0.1;
          const tx = clamp(soul.x + heading.x * lead, box.x + 6, box.x + box.w - 6);
          const ty = clamp(soul.y + heading.y * lead, box.y + 6, box.y + box.h - 6);
          const warn = 0.6;
          bullets.push(new Shot({ x: tx, y: ty, harmless: true, life: warn + FLIGHT - 0.05, art: 'ashlMark' }));
          const x0 = box.x + box.w + 10;
          const y0 = box.y + rand(4, 30);
          const ball = new Shot({ x: x0, y: y0, warn, life: FLIGHT, art: 'ashlBall', gravity: GRAV });
          pending.push({ shot: ball, vx: (tx - x0) / FLIGHT, vy: (ty - y0 - 0.5 * GRAV * FLIGHT * FLIGHT) / FLIGHT });
          ball.target = { x: tx, y: ty };
          balls.push(ball);
          bullets.push(ball);
          thrown++;
        }
        for (const ball of balls) {
          if (ball.burst || ball.age < ball.warn + ball.life) continue;
          ball.burst = true;
          const spin = rand(0, 1);
          for (let k = 0; k < 6; k++) {
            const a = spin + (k / 6) * Math.PI * 2;
            bullets.push(new Shot({ x: ball.target.x, y: ball.target.y, vx: Math.cos(a) * 46, vy: Math.sin(a) * 46, art: 'ashlClod', life: 1.6 }));
          }
        }
      },
    };
  },

  // Crumble: it shakes, and clods of ash fall off in a wall across the box
  // with a two-column gap. Grains trickle down every column that's coming
  // first. The gap moves a little each time.
  ashlCrumble(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let waves = 0;
    const cols = 8;
    const cw = box.w / cols;
    let gap = Math.floor(rand(1, cols - 2));
    const due = [];
    // (The clods keep real time, like the grains that warn of them.)
    let real = 0;
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        real += dt / density;
        if (waves < 5 && t >= 0.15 + waves * 1.08) {
          // The gap steps one or two columns, never onto where you stand if it can help it.
          const here = clamp(Math.floor((soul.x - box.x) / cw), 0, cols - 1);
          let next = gap + (Math.random() < 0.5 ? -1 : 1) * (1 + Math.floor(rand(0, 2)));
          next = clamp(next, 0, cols - 2);
          if (next === here || next + 1 === here) next = clamp(here + (here > cols / 2 ? -3 : 2), 0, cols - 2);
          gap = next;
          const warn = 0.55;
          for (let c = 0; c < cols; c++) {
            if (c === gap || c === gap + 1) continue;
            const x = box.x + cw * (c + 0.5);
            bullets.push(new Shot({ x: x + rand(-1, 1), y: box.y + 1, vy: 22, harmless: true, life: warn, art: 'ashlGrain' }));
            due.push({ at: real + warn, x });
          }
          waves++;
        }
        for (const d of due) {
          if (real < d.at || d.done) continue;
          d.done = true;
          bullets.push(new Shot({ x: d.x + rand(-1.5, 1.5), y: box.y - 4, vy: 74, art: 'ashlClod', life: 2.2 }));
        }
      },
    };
  },

  // Eyes: its ember eyes, a pair at a time, appear at the edge of the box away
  // from you and blink; then the pair flies at where you are (a touch ahead),
  // side by side.
  ashlEyes(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let pairs = 0;
    const heading = { x: 0, y: 0 };
    let seen = null;
    const waiting = [];
    return {
      duration: 6.6,
      update: (dt, bullets, soul) => {
        t += dt;
        if (seen && dt > 0) {
          heading.x = heading.x * 0.85 + ((soul.x - seen.x) / dt) * 0.15;
          heading.y = heading.y * 0.85 + ((soul.y - seen.y) / dt) * 0.15;
        }
        seen = { x: soul.x, y: soul.y };
        if (pairs < 6 && t >= 0.2 + pairs * 0.78) {
          // From the side of the box furthest from you, at a random point along it.
          const sides = ['top', 'bottom', 'left', 'right'].sort((a, b) => far(b) - far(a));
          const side = sides[pairs % 2];
          const along = rand(0.15, 0.85);
          const x = side === 'left' ? box.x + 4 : side === 'right' ? box.x + box.w - 4 : box.x + box.w * along;
          const y = side === 'top' ? box.y + 4 : side === 'bottom' ? box.y + box.h - 4 : box.y + box.h * along;
          const warn = 0.7;
          const eyes = [];
          for (const s of [-1, 1]) {
            const eye = new Shot({ x, y, warn, art: 'ashlEye', life: 2.4 });
            eye.side = s;
            eyes.push(eye);
            bullets.push(eye);
          }
          waiting.push({ eyes, x, y, aim: 0, lead: pairs % 3 === 1 ? 0 : 0.35 });
          pairs++;
        }
        for (const w of waiting) {
          if (w.fired) continue;
          // (By the eyes' own clock: they blink for `warn` real seconds.)
          const age = w.eyes[0].age;
          const warn = w.eyes[0].warn;
          if (age <= warn - 0.3) {
            const tx = soul.x + heading.x * w.lead;
            const ty = soul.y + heading.y * w.lead;
            w.aim = Math.atan2(ty - w.y, tx - w.x);
          }
          // Side by side, across the line they'll fly along.
          const px = -Math.sin(w.aim) * 3.5;
          const py = Math.cos(w.aim) * 3.5;
          for (const eye of w.eyes) { eye.x = w.x + px * eye.side; eye.y = w.y + py * eye.side; }
          if (age >= warn - 0.02) {
            w.fired = true;
            for (const eye of w.eyes) { eye.vx = Math.cos(w.aim) * 104; eye.vy = Math.sin(w.aim) * 104; }
          }
        }
        function far(side) {
          if (side === 'top') return soul.y - box.y;
          if (side === 'bottom') return box.y + box.h - soul.y;
          if (side === 'left') return soul.x - box.x;
          return box.x + box.w - soul.x;
        }
      },
    };
  },
};

// Aimed clods on top (see snipes.js), so standing in one spot through the snow or the gap never works.
ASHLING_ATTACKS.ashlFlurry = withSnipes(ASHLING_ATTACKS.ashlFlurry, { art: 'ashlClod', count: 5, first: 0.7, every: 0.95, lead: [0.9, 'mean', 0.4, 'mean', 0.9], until: 5.4 });
ASHLING_ATTACKS.ashlCrumble = withSnipes(ASHLING_ATTACKS.ashlCrumble, { art: 'ashlClod', count: 4, first: 0.9, every: 1.2, lead: ['mean', 0.9, 'mean', 0.4], until: 5.6 });
