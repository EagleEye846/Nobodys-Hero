import { defineBulletArt } from '../projectiles.js';
import { art } from '../../data/art/ch5Kit.js';
import { PathShot, Deco, Zone, blit } from './coastKit.js';

// The Shellac's attacks. A hermit crab that has moved into a teapot and is
// extremely house-proud, so everything it does is tea:
//   - Pouring: it tips the pot and a long arc of tea walks across the box as
//     it tips and rights itself. The lid rattles before each pour.
//   - The kettle: it sets the pot down by you to boil. The rattle gets
//     faster and faster, and when it can't go faster it blows steam all round.
//   - The tea set: cups about the box fill in turn, and each full cup spills
//     over the lip away from its handle.
// It stands to the right of the box.

const CHINA = { k: '#1c1a24', c: '#f4eedb', C: '#cfc7ac', w: '#ffffff', b: '#4f7fc8', B: '#2f4f94' };
const CLAW = { k: '#1c1a24', r: '#e0673a', R: '#a8432a', o: '#f5a070' };
const STEAM = { k: '#5a7a80', s: '#e8f6f4', S: '#b8d8d6', t: '#a8723a', T: '#7a4a22', y: '#d9a866' };


// A pincer pointing right: open, then snapped shut.
const pincer = (open) => art(13, 11, (p) => {
  p.ellipse(3, 5, 3, 3, 'r');
  p.ellipse(2, 4, 1.5, 1, 'o');
  const a = open ? 1.5 : 4;
  const b = open ? 8.5 : 6;
  p.line(5, 4, 11, a, 'r', 2);
  p.line(5, 6, 11, b, 'R', 2);
});
defineBulletArt('shlPincer', { frames: [pincer(true), pincer(false)], palette: CLAW, radius: 3.4, rotate: true, frameSeconds: 0.18 });

// A teacup: bowl, blue band, and a handle.
const CUP = art(11, 9, (p) => {
  p.ring(8.5, 3.5, 2, 2, 'C', 1);
  p.poly([[0, 1], [8, 1], [7, 6], [4, 7], [1, 6]], 'c');
  p.rect(1, 3, 7, 1, 'b');
  p.rect(0, 1, 9, 1, 'w');
  p.rect(2, 6, 4, 1, 'C');
});
defineBulletArt('shlCup', { frames: [CUP], palette: CHINA, radius: 3.6, spin: 3 });

// A shard of broken china, two sizes.
const SHARD = art(7, 7, (p) => {
  p.poly([[0, 3], [5, 0], [6, 5], [2, 6]], 'c');
  p.line(1, 3, 5, 1, 'b');
});
const CHUNK = art(9, 9, (p) => {
  p.poly([[0, 4], [3, 0], [8, 2], [7, 7], [2, 8]], 'c');
  p.line(1, 4, 4, 1, 'b');
  p.line(4, 2, 7, 3, 'B');
  p.set(5, 5, 'C');
  p.set(4, 6, 'C');
});
defineBulletArt('shlShard', { frames: [SHARD], palette: CHINA, radius: 2.2, spin: 7 });
defineBulletArt('shlChunk', { frames: [CHUNK], palette: CHINA, radius: 3.2, spin: 4 });

// The teapot itself, spinning (harmless: it's the shards that hurt).
const POT = art(19, 15, (p) => {
  p.ring(17, 7, 2, 3, 'C', 1.2);
  p.line(3, 6, 0, 2, 'C', 2);
  p.ellipse(9, 8, 7, 5.5, 'c');
  p.ellipse(8, 6, 4, 3, 'w');
  p.rect(3, 9, 12, 1, 'b');
  p.ellipse(9, 2.5, 4, 1.5, 'c');
  p.set(9, 0, 'b');
});
defineBulletArt('shlPot', { frames: [POT], palette: CHINA, radius: 1, spin: 5 });

// A scalding puff of steam, and a drop of tea.
defineBulletArt('shlPuff', {
  frames: [
    ['..sss..', '.sSsss.', 'sssSsss', '.sssSs.', '..sss..'],
    ['..sss..', '.ssSss.', 'sSsssss', '.ssSss.', '..sss..'],
  ],
  palette: STEAM,
  radius: 3,
  frameSeconds: 0.2,
});
defineBulletArt('shlDrop', { frames: [['.t.', 'ttt', 'tTt', '.t.']], palette: STEAM, radius: 1.6 });

// A teacup sitting still, handle to the right (the tea spills out to the left).
const SITTING = CUP;
const SITTING_L = CUP.map((r) => [...r].reverse().join(''));
// The teapot sitting still (not spinning): it rattles its lid when it boils.
defineBulletArt('shlKettle', { frames: [POT], palette: CHINA, radius: 5 });
// Its lid, jumping.
const LID = ['.cbc.', 'ccccc'];

export const SHELLAC_ATTACKS = {
  // Pouring: it tips the pot and pours, a long arc of hot tea from the spout
  // over the top right of the box, aimed to land at your height. The more it
  // tips, the further the tea lands, so the stream walks across the box as
  // it tips and rights itself. The lid rattles before each pour. Keep out from under it.
  shellPour(box, density, { rand }) {
    const T = (s) => s * density;
    const spout = { x: box.x + box.w + 4, y: box.y - 2 };
    const G = 160;
    let t = 0;
    let pour = 0;
    let drip = 0;
    let pours = 0;
    let started = -1;
    let from = 0;
    let to = 0;
    let level = 0;
    const POUR = 1.5;
    const RATTLE = 0.5;
    return {
      duration: 7,
      update: (dt, bullets, soul, real = dt / density) => {
        t += dt;
        if (started < 0 && pours < 4 && t >= T(0.2 + pours * 1.6)) {
          pours++;
          started = 0;
          // Sweep from one side of you to past the other.
          const near = soul.x;
          from = Math.min(Math.max(near + (pours % 2 ? 26 : -26), box.x), box.x + box.w);
          to = Math.min(Math.max(near + (pours % 2 ? -30 : 30) + rand(-6, 6), box.x), box.x + box.w);
          // It pours at the height you're at (the tea splashes on, and on down).
          level = soul.y;
          bullets.push(new Deco({ life: RATTLE, paint(ctx, d) { blit(ctx, LID, CHINA, box.x + box.w - 6, box.y + 3 + (Math.floor(d.age * 16) % 2) * 2); } }));
        }
        if (started < 0) return;
        started += real;
        pour = started - RATTLE;
        if (pour < 0) return;
        if (pour > POUR) { started = -1; return; }
        drip += real;
        if (drip < 0.035) return;
        drip = 0;
        // Where this drop should land on the floor: along the sweep, eased.
        const u = 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, pour / POUR));
        const landX = from + (to - from) * u;
        const fall = Math.max(14, level - spout.y);
        // A drop thrown level from the spout lands after sqrt(2h/g) at the right speed.
        const time = Math.sqrt((2 * fall) / G);
        const vx = (landX - spout.x) / time;
        bullets.push(new PathShot({ art: 'shlDrop', life: time * 1.6, path: (k) => ({ x: spout.x + vx * k, y: spout.y + 0.5 * G * k * k }) }));
      },
    };
  },

  // The kettle: it sets its teapot down in the box, near you, and leaves it
  // to boil. The lid starts to rattle, slow, then faster, faster, and when
  // it can't go any faster it blows: steam jets out all round, and the lid
  // flies off. The faster the rattle, the sooner it goes.
  shellKettle(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    const BOIL = 1.5;
    let t = 0;
    let n = 0;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= T(0.2 + n * 0.9) && n < 6) {
          n++;
          // Set down beside you, not on you.
          const side = rand(0, Math.PI * 2);
          const x = Math.min(Math.max(soul.x + Math.cos(side) * 16, box.x + 10), box.x + box.w - 10);
          const y = Math.min(Math.max(soul.y + Math.sin(side) * 16, box.y + 10), box.y + box.h - 10);
          // Ticks come closer together: at 0, 0.5, 0.85, 1.1, 1.28, 1.4 ... 1.5.
          const ticks = [0, 0.5, 0.85, 1.1, 1.28, 1.4, 1.47];
          bullets.push(new Deco({ x, y, life: BOIL, paint(ctx, d) {
            blit(ctx, POT, CHINA, d.x, d.y);
            const last = ticks.filter((k) => d.age >= k).pop() ?? 0;
            const jump = d.age - last < 0.07 ? 3 : 0;
            blit(ctx, LID, CHINA, d.x, d.y - 7 - jump);
          } }));
          bullets.push(new Zone({ x, y, r: 5, warn: 0.3, life: BOIL - 0.3, paint() {} }));
          for (let i = 0; i < 12; i++) {
            const a = (i / 12) * Math.PI * 2 + n * 0.3;
            bullets.push(new Shot({ x: x + Math.cos(a) * 6, y: y + Math.sin(a) * 6, vx: Math.cos(a) * 80, vy: Math.sin(a) * 80, art: 'shlPuff', warn: BOIL, life: 0.9 }));
          }
          bullets.push(new Shot({ x, y: y - 7, vx: rand(-20, 20), vy: -70, gravity: 120, art: 'shlShard', warn: BOIL, life: 1.4 }));
        }
      },
    };
  },

  // The tea set: it sets out cups about the box and pours, filling them in
  // turn (you can see the tea rise in the one being filled). When a cup is
  // full, it spills over the lip away from its handle, in a splash of hot
  // tea. Mind which way each handle points.
  shellTeaSet(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    const FILL = 0.55;
    let t = 0;
    let n = 0;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= T(0.2 + n * 1.8) && n < 4) {
          n++;
          // Five cups, the first one by you.
          const spots = [{ x: soul.x + rand(-8, 8), y: soul.y + rand(-8, 8) }];
          for (let guard = 0; spots.length < 5 && guard < 300; guard++) {
            const s = { x: rand(box.x + 10, box.x + box.w - 10), y: rand(box.y + 10, box.y + box.h - 10) };
            if (spots.every((o) => Math.hypot(o.x - s.x, o.y - s.y) > 18)) spots.push(s);
          }
          spots.forEach((s, i) => {
            const x = Math.min(Math.max(s.x, box.x + 8), box.x + box.w - 8);
            const y = Math.min(Math.max(s.y, box.y + 8), box.y + box.h - 8);
            const right = x < box.x + box.w / 2 ? -1 : 1;
            const full = 0.4 + i * FILL + FILL;
            bullets.push(new Deco({ x, y, life: full + 0.3, paint(ctx, d) {
              blit(ctx, right > 0 ? SITTING : SITTING_L, CHINA, d.x, d.y);
              const level = Math.max(0, Math.min(1, (d.age - (full - FILL)) / FILL));
              if (level > 0) {
                ctx.fillStyle = '#a8723a';
                ctx.fillRect(Math.round(d.x - 3), Math.round(d.y - 2 + (1 - level) * 3), 6, Math.max(1, Math.round(level * 3)));
              }
            } }));
            // The spill: away from the handle.
            const away = right > 0 ? Math.PI : 0;
            for (const o of [-0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6]) {
              bullets.push(new Shot({ x, y, vx: Math.cos(away + o) * 80, vy: Math.sin(away + o) * 80, art: 'shlDrop', warn: full, life: 1.2 }));
            }
            bullets.push(new Zone({ x: x + (right > 0 ? -8 : 8), y, r: 6, warn: full, life: 0.3, paint(ctx, z) { if (z.age >= z.warn) { ctx.fillStyle = '#a8723a'; ctx.beginPath(); ctx.arc(z.x, z.y, 5, 0, Math.PI * 2); ctx.fill(); } } }));
          });
        }
      },
    };
  },
};
