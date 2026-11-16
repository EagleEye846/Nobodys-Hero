import { defineBulletArt } from '../projectiles.js';
import { art } from '../../data/art/ch5Kit.js';
import { PathShot, Deco, Zone, Tether, blit } from './coastKit.js';
import { drawText } from '../../ui/text.js';

// The Sandcastle's attacks. A sandcastle that has come to life, is very
// pleased with itself, and cannot move, which it would like you to know:
// as each attack begins a little sand hand pokes up in the box holding a
// sign that says so (and in its battle clip, out of a tower: CAN'T), then turns the sign over to say what it will do
// about it instead.
//   - SO IT BUILDS WHERE YOU ARE: a bucket comes down on you and leaves a
//     tower, and every tower fires one pellet from its window.
//   - SO IT SENDS THE GARRISON: shell soldiers march out in two files, in step,
//     along a row and back the next.
//   - SO IT BRINGS THE MOAT TO YOU: it scratches channels across the sand,
//     and the moat runs down them from the castle end.
// It stands to the right of the box.

const SAND = { k: '#3a2e1c', s: '#e8cf8e', S: '#caa968', d: '#a88848', l: '#f6e6b0', m: '#9a7c44', w: '#5aa0c8', W: '#a8d8ec', e: '#ffffff', r: '#d8453a', R: '#9c2a2a', f: '#e0d4b0', c: '#f4dcdc', C: '#e49aa0' };


// A pellet of sand: a tight little ball, and a clod (bigger, lumpier).
defineBulletArt('castlePellet', {
  frames: [art(6, 6, (p) => { p.ellipse(2.5, 2.5, 2.2, 2.2, 's'); p.set(3, 3, 'S'); p.set(1, 1, 'l'); })],
  palette: SAND,
  radius: 2.4,
  spin: 3,
});
defineBulletArt('castleClod', {
  frames: [art(10, 10, (p) => { p.ellipse(4.5, 4.5, 4.2, 4, 's'); p.ellipse(5.5, 5.5, 2.8, 2.4, 'S'); p.set(2, 2, 'l'); p.set(3, 2, 'l'); p.set(6, 3, 'd'); p.set(3, 6, 'd'); })],
  palette: SAND,
  radius: 4.2,
  spin: 2,
});
// A puff where a turret fires.
defineBulletArt('castlePuff', {
  frames: [['..lll..', '.lssSl.', 'lsSSssl', '.lsSsl.', '..lll..']],
  palette: SAND,
  radius: 1,
});

// A cresting wave of moat water along the floor: a rounded curl with foam.
defineBulletArt('castleWave', {
  frames: [
    art(14, 10, (p) => { p.ellipse(7, 7, 6.6, 3.6, 'w'); p.ellipse(8, 3.6, 4, 3.2, 'w'); p.ellipse(7, 7.5, 5, 1.4, 'W'); p.set(4, 3, 'e'); p.set(10, 2, 'e'); p.set(11, 3, 'e'); }),
    art(14, 10, (p) => { p.ellipse(7, 7, 6.6, 3.6, 'w'); p.ellipse(6, 3.2, 3.6, 3, 'w'); p.ellipse(7, 7.5, 5, 1.4, 'W'); p.set(3, 3, 'e'); p.set(8, 1, 'e'); p.set(9, 2, 'e'); }),
  ],
  palette: SAND,
  radius: 4.6,
  frameSeconds: 0.25,
});

// A crab of the garrison: a little shell soldier marching (two frames of legs).
const soldier = (step) => art(11, 9, (p) => {
  p.ellipse(5, 4, 4, 2.8, 'C');
  p.ellipse(5, 3.4, 2.6, 1.4, 'c');
  p.set(3, 2, 'k');
  p.set(7, 2, 'k');
  p.line(1, 5, 0, 7 - step, 'R');
  p.line(9, 5, 10, 7 - step, 'R');
  p.line(3, 6, 2, 8 + step - 1, 'R');
  p.line(7, 6, 8, 8 - step, 'R');
  p.line(5, 1, 5, -1, 'd');
});
defineBulletArt('castleSoldier', { frames: [soldier(0), soldier(1)], palette: SAND, radius: 3.6, frameSeconds: 0.15 });
// A bucket coming down (harmless in the air): a red seaside pail, upside down.
defineBulletArt('castleBucket', { frames: [art(13, 12, (p) => { p.poly([[1, 11], [3, 1], [9, 1], [11, 11]], 'r'); p.rect(2, 9, 9, 2, 'R'); p.line(4, 2, 4, 9, 'c'); p.line(0, 4, 12, 4, 'k'); })], palette: SAND, radius: 1 });
defineBulletArt('castleShadow', { frames: [['..mmmmm..', '.mmmmmmm.', '..mmmmm..']], palette: SAND, radius: 1 });
// A tower stamped out of the bucket: ridged sand with a shell window.
const TOWER = art(13, 15, (p) => {
  p.rect(1, 3, 11, 12, 's');
  p.rect(8, 3, 4, 12, 'S');
  for (let y = 6; y < 15; y += 4) p.rect(1, y, 11, 1, 'd');
  for (const x of [1, 5, 9]) p.rect(x, 0, 3, 3, 's');
  p.ellipse(6, 8, 1.6, 1.4, 'c');
});
const TOWER_LIT = TOWER.map((r, y) => (y >= 7 && y <= 9 ? r.replace(/c/g, 'e') : r));

// The sign. It can't move, so as each attack begins a little sand hand pokes
// up from the bottom of the box holding a sign on a lolly stick, and says
// so; then it turns the sign over to say what it's going to do about it
// instead, and ducks back down. Drawn in the game's own lettering so it can
// be read, and under everything else, so nothing that hurts is hidden.
const GAG = "IT WOULD LIKE TO\nMOVE, BUT IT'S A\nSANDCASTLE.\nIT CAN'T.";
const SIGN_LIFE = 3.2;
const sign = (box, then) => new Deco({ life: SIGN_LIFE, paint(ctx, d) {
  const W = box.w - 8;
  const H = 40;
  const cx = box.x + box.w / 2;
  const up = Math.min(1, d.age / 0.25);
  const down = d.age > SIGN_LIFE - 0.3 ? Math.max(0, (SIGN_LIFE - d.age) / 0.3) : 1;
  const top = box.y + 4 + (1 - Math.min(up, down)) * (box.h + 4);
  ctx.save();
  // The lolly stick, and the sand hand gripping it at the bottom of the box.
  ctx.fillStyle = '#3a2e1c';
  ctx.fillRect(cx - 2, top + H - 1, 4, box.h);
  ctx.fillStyle = '#e0d4b0';
  ctx.fillRect(cx - 1, top + H, 2, box.h);
  const hy = top + H + 22;
  ctx.fillStyle = '#3a2e1c';
  ctx.fillRect(cx - 5, hy, 11, 10);
  ctx.fillStyle = '#e8cf8e';
  ctx.fillRect(cx - 4, hy + 1, 9, 9);
  ctx.fillStyle = '#caa968';
  ctx.fillRect(cx - 4, hy + 3, 9, 1);
  ctx.fillRect(cx - 4, hy + 5, 9, 1);
  ctx.fillRect(cx - 4, hy + 7, 9, 1);
  // The board.
  ctx.fillStyle = '#3a2e1c';
  ctx.fillRect(cx - W / 2 - 1, top - 1, W + 2, H + 2);
  ctx.fillStyle = '#f6e6b0';
  ctx.fillRect(cx - W / 2, top, W, H);
  ctx.fillStyle = '#e8cf8e';
  ctx.fillRect(cx - W / 2, top + H - 3, W, 3);
  // Front, then (turned over with a flip) the back.
  const flip = d.age - 1.6;
  const squash = Math.abs(flip) < 0.12 ? Math.abs(flip) / 0.12 : 1;
  ctx.translate(cx, top);
  ctx.scale(1, squash);
  drawText(ctx, flip < 0 ? GAG : then, 0, 2, { size: 9, lineHeight: 9, align: 'center', color: '#3a2e1c' });
  ctx.restore();
} });

export const SANDCASTLE_ATTACKS = {
  // "SO IT BUILDS WHERE YOU ARE." A bucket's shadow lands on you, and down
  // comes the bucket: when it lifts there's a new tower standing there (it
  // hurts to touch, and stays). A moment later the tower's shell window
  // glints and it fires a pellet of sand at you. Every tower fires once.
  castleTowers(box, density, { Shot }) {
    const T = (s) => s * density;
    const DROP = 0.75;
    const AIM = 0.9;
    let t = 0;
    let n = 0;
    let made = false;
    const towers = [];
    return {
      duration: 7.8,
      update: (dt, bullets, soul, real = dt / density) => {
        t += dt;
        if (!made) {
          made = true;
          bullets.push(sign(box, 'SO IT BUILDS\nWHERE YOU ARE\nINSTEAD.'));
        }
        if (t >= T(1.3 + n * 0.8) && n < 7) {
          n++;
          const x = Math.min(Math.max(soul.x, box.x + 7), box.x + box.w - 7);
          const y = Math.min(Math.max(soul.y, box.y + 8), box.y + box.h - 8);
          bullets.push(new Shot({ x, y: y + 5, harmless: true, life: DROP, art: 'castleShadow' }));
          bullets.push(new PathShot({ art: 'castleBucket', harmless: true, life: DROP, path: (k) => ({ x, y: y - 30 * (1 - Math.min(1, k / DROP) ** 2) }) }));
          bullets.push(new Zone({ x: x - 5, y: y - 6, w: 10, h: 13, warn: DROP, life: 3.2, paint(ctx, z) {
            if (z.age < z.warn) return;
            const glint = z.age > z.warn + AIM - 0.35 && z.age < z.warn + AIM;
            blit(ctx, glint && Math.floor(z.age * 12) % 2 ? TOWER_LIT : TOWER, SAND, z.x + 5, z.y + 6);
          } }));
          towers.push({ x, y, fire: DROP + AIM, done: false });
        }
        for (const tw of towers) {
          if (tw.done) continue;
          tw.fire -= real;
          if (tw.fire > 0) continue;
          tw.done = true;
          const a = Math.atan2(soul.y - tw.y, soul.x - tw.x);
          bullets.push(new Shot({ x: tw.x + Math.cos(a) * 7, y: tw.y + Math.sin(a) * 7, vx: Math.cos(a) * 55, vy: Math.sin(a) * 55, art: 'castlePellet', warn: 0.3, life: 1.6 }));
        }
      },
    };
  },

  // "SO IT SENDS THE GARRISON." The door opens and its shell soldiers march
  // out in two files, in step: a step, a stop, a step. One marches along
  // the top row to the wall, turns down a row and marches back; the other
  // does the same up from the bottom. Slip through the file
  // between steps, or keep ahead of the column.
  castleGarrison(box, density) {
    const ROW = 16;
    const STEP = 10;
    const BEAT = 0.26;
    const MEN = 6;
    const SPACING = 11;
    const L = box.x + 6;
    const R = box.x + box.w - 6;
    const rows = Math.floor((box.h - 8) / ROW) + 1;
    // The way they march, as distance along it: right to left on the top
    // row, down a row, back, and so on.
    const span = R - L;
    const along = (s) => {
      const leg = span + ROW;
      let i = Math.floor(s / leg);
      const f = s - i * leg;
      if (i >= rows) i = rows - 1;
      const y = box.y + 6 + i * ROW + (f > span ? f - span : 0);
      const run = Math.min(f, span);
      const x = i % 2 ? L + run : R - run;
      return { x, y: Math.min(y, box.y + box.h - 6) };
    };
    // In step: each beat a quick stride, then a stand.
    const marched = (k) => {
      const beats = Math.floor(k / BEAT);
      const f = Math.min(1, (k - beats * BEAT) / (BEAT * 0.45));
      return (beats + f) * STEP;
    };
    let made = false;
    return {
      duration: 7.8,
      update: (dt, bullets) => {
        if (made) return;
        made = true;
        bullets.push(sign(box, 'SO IT SENDS\nTHE GARRISON.'));
        for (let j = 0; j < 2; j++) {
          for (let i = 0; i < MEN; i++) {
            const lag = i * SPACING;
            const start = 1.7 + j * 1.3;
            // The second file marches up from the bottom row, the mirror of the first.
            const flip = (q) => (j ? { x: box.x + box.w - (q.x - box.x), y: box.y + box.h - (q.y - box.y) } : q);
            bullets.push(new PathShot({ art: 'castleSoldier', warn: start, life: 7 - start, path: (k) => flip(along(Math.max(0, marched(k) - lag))) }));
          }
        }
      },
    };
  },

  // "SO IT BRINGS THE MOAT TO YOU." It digs channels across the sand (a
  // groove scratched from the castle side, one of them through you), and
  // then lets the moat in: the water runs down each channel from the castle
  // end and stays a moment. Cross a channel before the water reaches you.
  castleMoat(box, density, { rand }) {
    const T = (s) => s * density;
    const DIG = 0.9;
    const FLOW = 120;
    const WET = 0.55;
    let t = 0;
    let n = 0;
    let made = false;
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (!made) {
          made = true;
          bullets.push(sign(box, 'SO IT BRINGS\nTHE MOAT\nTO YOU.'));
        }
        if (t >= T(1.4 + n * 0.75) && n < 7) {
          n++;
          // From a point on the castle side, across the box through (or near) you.
          const sx = box.x + box.w + 2;
          const sy = rand(box.y + 6, box.y + box.h - 6);
          const ty = n % 2 ? soul.y : rand(box.y + 6, box.y + box.h - 6);
          const tx = n % 2 ? soul.x : rand(box.x, box.x + box.w * 0.6);
          const a = Math.atan2(ty - sy, tx - sx);
          const len = 130;
          const reach = (k) => Math.max(0, Math.min(len, k * FLOW));
          // The groove, scratched in first.
          bullets.push(new Deco({ life: DIG + len / FLOW + WET, paint(ctx, d) {
            const g = Math.min(1, d.age / (DIG * 0.6));
            ctx.strokeStyle = '#a88848';
            ctx.lineWidth = 3;
            ctx.setLineDash([3, 1]);
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(sx + Math.cos(a) * len * g, sy + Math.sin(a) * len * g);
            ctx.stroke();
          } }));
          bullets.push(new Tether({
            warn: DIG, life: len / FLOW + WET, thick: 5, color: '#5aa0c8', dark: '#9a7c44',
            ends: (k) => {
              const head = reach(k);
              const tail = Math.max(0, (k - WET) * FLOW);
              return [sx + Math.cos(a) * tail, sy + Math.sin(a) * tail, sx + Math.cos(a) * head, sy + Math.sin(a) * head];
            },
          }));
        }
      },
    };
  },
};
