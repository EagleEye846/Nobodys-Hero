import { defineBulletArt } from '../projectiles.js';
import { Pix } from '../../data/art/pixKit.js';
import { PathShot, Zone, Guide } from './coastKit.js';

// The Flatcap Bee's attacks. A tweed-capped bumblebee who has worked the same
// clover patch for forty years, so every attack is bee business:
//   - Waggle dance: a mate lands and waggles along a line; when the dance
//     ends, a file of bees streams out along the line it pointed.
//   - Honeycomb: he caps cells with wax one after another, then honey floods
//     every cell that isn't capped. Get on a lid.
//   - Flower round: clover springs up at your feet, and he visits the flowers
//     in the order they opened, the next leg dotted out first.
// He stands to the right of the box.

const BEE = { k: '#2a2018', y: '#ffcf2e', Y: '#e39c1c', b: '#3a2f28', v: '#cfe8f6', w: '#ffffff', T: '#8a8f7a', t: '#5e6450', u: '#b9bd9f', h: '#f0a020', H: '#c87a10', l: '#fff2a0' };

// A little bee, flying left, wings up.
function littleBee(flap) {
  const g = new Pix(11, 9);
  g.disc(6, 5, 4, 2.8, 'y');
  g.rect(5, 3, 1, 5, 'b');
  g.rect(8, 3, 1, 5, 'b');
  g.disc(2, 5, 1.8, 1.8, 'y');
  g.set(1, 4, 'k');
  g.line(10, 5, 10, 6, 'k');
  g.disc(5, flap ? 1 : 2, 2.6, flap ? 1.2 : 1.8, 'v');
  g.disc(8, flap ? 1 : 2, 2, flap ? 1 : 1.6, 'v');
  g.outline('k');
  return g.rows();
}
defineBulletArt('beeBuzz', { frames: [littleBee(0), littleBee(1)], palette: BEE, radius: 3, frameSeconds: 0.07 });

// A drop of honey, round at the bottom and pointed at the top.
defineBulletArt('beeDrop', {
  frames: [['...h...', '..hhh..', '..hhh..', '.hhlhh.', 'hhhlhhh', 'hhhhhhH', '.hhhHH.', '..HHH..']],
  palette: BEE,
  radius: 3.2,
});

// The honey about to fall: a swelling bead at the top of the box, blinking.
defineBulletArt('beeBead', { frames: [['.hh.', 'hhlh', 'hhhH', '.HH.']], palette: BEE, radius: 2 });

// A splash droplet.
defineBulletArt('beeSplat', { frames: [['.h.', 'hlh', '.H.']], palette: BEE, radius: 1.8 });

// The flat cap: tweed, with a short peak and a button.
function cap() {
  const g = new Pix(15, 9);
  g.disc(8, 4, 6.4, 3.4, 'T');
  g.disc(9, 3, 3.6, 1.6, 'u', 'T');
  g.rect(0, 5, 6, 2, 't');
  g.line(2, 5, 13, 6, 't');
  g.set(8, 1, 't');
  g.outline('k');
  return g.rows();
}
defineBulletArt('beeCap', { frames: [cap()], palette: BEE, radius: 4.6, spin: 7 });

// A clover flower springing up (harmless): bud, then open.
function clover(open) {
  const g = new Pix(9, 9);
  g.line(4, 5, 4, 8, 'g');
  if (open) {
    for (const [x, y] of [[2, 2], [6, 2], [4, 1], [3, 4], [5, 4]]) g.disc(x, y, 1.6, 1.6, 'p');
    g.disc(4, 3, 1.2, 1.2, 'P');
  } else {
    g.disc(4, 4, 1.6, 2, 'p');
  }
  g.outline('k');
  return g.rows();
}
const FLOWER = { ...BEE, g: '#5aa040', p: '#f2b8d8', P: '#d070a0' };
defineBulletArt('beeClover', { frames: [clover(false), clover(true)], palette: FLOWER, radius: 1, frameSeconds: 0.25 });

// The dancer: a bee waggling its bottom (two frames, side to side), drawn facing right.
defineBulletArt('beeDancer', { frames: [littleBee(0).map((r) => [...r].reverse().join('')), littleBee(1).map((r) => [...r].reverse().join(''))], palette: BEE, radius: 3, rotate: true, frameSeconds: 0.06 });
// A bee in flight facing the way it goes (drawn facing right).
defineBulletArt('beeFlyer', { frames: [littleBee(0).map((r) => [...r].reverse().join('')), littleBee(1).map((r) => [...r].reverse().join(''))], palette: BEE, radius: 3, rotate: true, frameSeconds: 0.07 });

// One cell of comb: drawn as a six-sided cell, empty wax, capped, or brim full of honey.
const cellPaint = (kind) => (ctx, z) => {
  const cx = z.x + z.w / 2;
  const cy = z.y + z.h / 2;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = Math.PI / 6 + (i * Math.PI) / 3;
    const px = cx + Math.cos(a) * 8.6;
    const py = cy + Math.sin(a) * 8.6;
    if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py);
  }
  ctx.closePath();
  if (kind === 'honey') {
    ctx.fillStyle = z.age < z.warn ? 'rgba(240,160,32,0.35)' : '#f0a020';
    ctx.fill();
    if (z.age >= z.warn) {
      ctx.fillStyle = '#fff2a0';
      ctx.fillRect(cx - 3, cy - 3, 3, 1);
    }
  } else {
    ctx.fillStyle = '#e8d8a0';
    ctx.fill();
    ctx.strokeStyle = '#b89848';
    ctx.stroke();
    ctx.fillStyle = '#c8b070';
    ctx.fillRect(cx - 2, cy - 1, 4, 2);
  }
  ctx.strokeStyle = '#8a5a10';
  ctx.lineWidth = 1;
  ctx.stroke();
};

export const CAPBEE_ATTACKS = {
  // Waggle dance: one of his mates lands in the box and does the waggle
  // dance, wiggling along a short line (a dotted line shows the way it's
  // pointing). The dance tells the others where to go: when it ends, a file
  // of bees comes streaming out of the dancer along that exact line. Four
  // dances, each pointed at where you were when it began.
  beeWaggle(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    const DANCE = 0.85;
    let t = 0;
    let n = 0;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= T(0.2 + n * 1.35) && n < 5) {
          n++;
          // The dancer lands a little way from you, never on top of you.
          let x;
          let y;
          let tries = 0;
          do {
            x = rand(box.x + 10, box.x + box.w - 10);
            y = rand(box.y + 10, box.y + box.h - 10);
            tries++;
          } while (tries < 30 && (Math.hypot(x - soul.x, y - soul.y) < 28 || Math.hypot(x - soul.x, y - soul.y) > 50));
          const ang = Math.atan2(soul.y - y, soul.x - x);
          // The waggle run: back and forth along the line, buzzing.
          bullets.push(new PathShot({
            art: 'beeDancer', harmless: true, life: DANCE,
            path: (k) => ({ x: x + Math.cos(ang) * 4 * Math.sin(k * 9), y: y + Math.sin(ang) * 4 * Math.sin(k * 9), a: ang + Math.sin(k * 40) * 0.35 }),
          }));
          bullets.push(new Guide({ x, y, angle: ang, length: 120, warn: DANCE, color: '#ffcf2e' }));
          // The file of bees out along the line.
          for (let i = 0; i < 5; i++) {
            bullets.push(new Shot({ x, y, vx: Math.cos(ang) * 105, vy: Math.sin(ang) * 105, art: 'beeFlyer', warn: DANCE + i * 0.1, life: 2 }));
          }
        }
      },
    };
  },

  // Honeycomb: the box is comb. He flies about capping cells with wax, one
  // after another (each one he caps gets a pale lid), and then the honey
  // comes in and fills every cell that isn't capped. Get on a lid before it
  // floods. Four floods; the cell you're on is never one he caps first.
  beeComb(box, density) {
    const T = (s) => s * density;
    const cells = [];
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 6; c++) {
        const x = box.x + c * 16 - (r % 2 ? 8 : 0);
        const x0 = Math.max(box.x, x);
        const x1 = Math.min(box.x + box.w, x + 16);
        if (x1 - x0 < 6) continue;
        cells.push({ x: x0, y: box.y + r * 16, w: x1 - x0, h: 16 });
      }
    }
    const ROUND = 1.75;
    const CAPS = 9;
    let t = 0;
    let n = 0;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= T(0.2 + n * ROUND) && n < 4) {
          n++;
          const inside = (c) => soul.x >= c.x && soul.x < c.x + c.w && soul.y >= c.y && soul.y < c.y + c.h;
          // Cells to cap: spread out, none the one you're on.
          const free = cells.filter((c) => !inside(c)).sort(() => Math.random() - 0.5);
          const capped = [];
          for (const c of free) {
            if (capped.length >= CAPS) break;
            if (capped.every((d) => Math.hypot(d.x - c.x, d.y - c.y) > 20)) capped.push(c);
          }
          const FLOOD = 1.3;
          capped.forEach((c, i) => {
            const lid = new Zone({ x: c.x, y: c.y, w: c.w, h: c.h, warn: 0.15 + i * 0.15, life: FLOOD - 0.15 - i * 0.15 + 0.6, paint: cellPaint('lid'), on: () => false });
            bullets.push(lid);
          });
          for (const c of cells) {
            if (capped.includes(c)) continue;
            bullets.push(new Zone({ x: c.x + 0.5, y: c.y + 0.5, w: c.w - 1, h: c.h - 1, warn: FLOOD, life: 0.55, paint: cellPaint('honey') }));
          }
        }
      },
    };
  },

  // Flower round: a clover flower springs up at your feet, and then another,
  // and another, wherever you are. He visits them in the order they opened:
  // a dotted line shows the next leg of his round, he flies it, sips a moment,
  // and moves on. Don't stand where a flower opened, and mind his way between.
  beeRound(box, density, { Shot }) {
    const T = (s) => s * density;
    const SPEED = 95;
    const SIP = 0.3;
    let t = 0;
    let real = 0;
    let n = 0;
    let at = { x: box.x + box.w + 8, y: box.y + box.h / 2 };
    let free = 0.9; // when (real seconds) he can next leave
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        real += dt / density;
        if (t >= T(0.2 + n * 0.7) && n < 8) {
          n++;
          const f = { x: soul.x, y: soul.y };
          const leave = Math.max(free, real + 0.75);
          const secs = Math.hypot(f.x - at.x, f.y - at.y) / SPEED;
          const wait = leave - real;
          const from = at;
          const flower = new Shot({ x: f.x, y: f.y, harmless: true, art: 'beeClover' });
          flower.life = wait + secs + SIP;
          bullets.push(flower);
          bullets.push(new Guide({ x: from.x, y: from.y, angle: Math.atan2(f.y - from.y, f.x - from.x), length: Math.hypot(f.x - from.x, f.y - from.y), warn: wait, color: '#ffcf2e' }));
          bullets.push(new PathShot({
            art: 'beeFlyer', warn: wait, life: secs + SIP,
            path: (k) => {
              const u = Math.min(1, k / secs);
              return { x: from.x + (f.x - from.x) * u, y: from.y + (f.y - from.y) * u, a: Math.atan2(f.y - from.y, f.x - from.x) };
            },
          }));
          at = f;
          free = leave + secs + SIP;
        }
      },
    };
  },
};
