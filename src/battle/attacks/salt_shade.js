import { defineBulletArt } from '../projectiles.js';
import { art } from '../../data/art/ch5Kit.js';
import { Ring } from './underShapes.js';
import { Line } from '../projectiles.js';
import { PathShot, Deco, Zone, Tether, blit } from './coastKit.js';

// The Salt Shade's attacks. A drowned sailor's ghost in a sou'wester,
// still keeping watch for a ship that was meant to come back for him:
//   - Signal lamp: he signals in dots and dashes. A short flash flicks salt
//     at you; a long one throws a beam. Each is aimed when the flash begins.
//   - Brine: sea water runs off his oilskins into puddles that dry, and the
//     salt grows into white spikes. Get off a puddle before it dries.
//   - Heave the lead: he casts the sounding lead at you; the line snaps taut
//     back to his hand, and he hauls the lead home along it.
// He stands to the right of the box.

const SEA = { k: '#132a34', b: '#6fb8b2', B: '#3f8088', w: '#d4f0ec', e: '#f0ffff', x: '#9ad8d0', g: '#4c8044', r: '#cfae7c', R: '#8c6c42', c: '#c8d8d0', p: '#e8dcb0', P: '#b8a878' };


// A bottle with a message in it, neck to the right.
defineBulletArt('shdBottle', {
  frames: [art(13, 8, (p) => {
    p.ellipse(4.5, 3.5, 4, 3, 'x');
    p.rect(7, 2, 4, 3, 'x');
    p.rect(11, 2, 2, 3, 'R');
    p.rect(2, 2, 5, 3, 'p');
    p.line(3, 3, 6, 3, 'P');
    p.set(2, 1, 'w');
    p.set(3, 0, 'w');
  })],
  palette: SEA,
  radius: 3.4,
  spin: 5,
});

// A bubble, and a bigger one.
defineBulletArt('shdBubble', {
  frames: [
    art(7, 7, (p) => { p.ring(3, 3, 2.6, 2.6, 'x', 1); p.set(2, 2, 'e'); }),
    art(7, 7, (p) => { p.ring(3, 3, 2.6, 2.6, 'w', 1); p.set(4, 2, 'e'); }),
  ],
  palette: SEA,
  radius: 2.8,
  frameSeconds: 0.3,
});
defineBulletArt('shdBubbleBig', {
  frames: [art(11, 11, (p) => { p.ring(5, 5, 4.4, 4.4, 'x', 1.2); p.set(3, 3, 'e'); p.set(4, 3, 'e'); p.set(3, 4, 'e'); })],
  palette: SEA,
  radius: 4.6,
});

// The message, harmless, floating down once the bottle bursts.
defineBulletArt('shdScroll', {
  frames: [art(9, 6, (p) => { p.rect(1, 1, 7, 4, 'p'); p.line(2, 2, 6, 2, 'P'); p.line(2, 3, 5, 3, 'P'); })],
  palette: SEA,
  radius: 1,
});

const LAMP = { ...SEA, y: '#ffe08a', Y: '#e0a040', n: '#3a4448', N: '#6a7478' };
// A grain of salt, flicked off the lamp's dot of light: a little white crystal.
defineBulletArt('shdSalt', { frames: [['.e.', 'eWe', '.e.'].map((r) => r.replace('W', 'w')), ['e.e', '.w.', 'e.e']], palette: SEA, radius: 1.8, frameSeconds: 0.08 });
// The lead weight on its line: a heavy grey plumb.
defineBulletArt('shdLead', { frames: [art(7, 9, (p) => { p.rect(3, 0, 1, 2, 'r'); p.poly([[1, 2], [5, 2], [6, 8], [0, 8]], 'N'); p.line(2, 3, 2, 7, 'c'); })], palette: LAMP, radius: 3.2 });
defineBulletArt('shdMark', { frames: [['.BBB.', 'BBBBB', '.BBB.']], palette: SEA, radius: 1 });
// Salt crust grown out of a puddle: white spikes.
const CRUST = ['..e...e..', '.eWe.eWe.', 'eWWWeWWWe', '.eeeeeee.'].map((r) => r.replace(/W/g, 'w'));

// The lantern on the right of the box, signalling: lit while `on(k)`.
const lantern = (box, life, on) => new Deco({ life, paint(ctx, d) {
  const x = box.x + box.w - 6;
  const y = box.y + 7;
  const lit = on(d.age);
  blit(ctx, ['.nnn.', 'n...n', 'n...n', 'n...n', '.nnn.'], LAMP, x, y);
  if (lit) {
    ctx.save();
    ctx.globalAlpha *= 0.4;
    ctx.fillStyle = '#ffe08a';
    ctx.beginPath();
    ctx.arc(x, y, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = lit ? '#ffe08a' : '#3a4448';
  ctx.fillRect(x - 1, y - 1, 3, 3);
} });

export const SALT_SHADE_ATTACKS = {
  // Signal lamp: he still signals to the ship from the shore, with his lamp,
  // in dots and dashes. A short flash (a dot) flicks a grain of salt at you;
  // a long flash (a dash) throws a beam of light straight at you. Each is
  // aimed when the flash begins and goes when it ends. Read the lamp.
  shadeLamp(box, density, { Shot }) {
    const DOT = 0.24;
    const DASH = 0.55;
    const GAP = 0.26;
    // A message of dots and dashes, spaced out: on (start, length) times.
    const code = '.-..-.--.-.'.split('');
    const marks = [];
    let at = 0.35;
    for (const c of code) {
      const len = c === '.' ? DOT : DASH;
      marks.push({ at, len, dash: c === '-' });
      at += len + GAP;
    }
    const on = (k) => marks.some((m) => k >= m.at && k < m.at + m.len);
    const x = box.x + box.w - 6;
    const y = box.y + 7;
    let real = 0;
    let made = false;
    const aims = [];
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (!made) {
          made = true;
          bullets.push(lantern(box, 7, on));
        }
        // Aim when each flash begins; it goes when the flash ends. A dash's
        // beam shows faintly along its line while the lamp is lit.
        while (aims.length < marks.length && real >= marks[aims.length].at) {
          const m = marks[aims.length];
          const a = Math.atan2(soul.y - y, soul.x - x);
          aims.push(a);
          if (m.dash) {
            bullets.push(new Line({ x, y, angle: a, length: 140, thickness: 9, warn: m.len, life: 0.4, grow: 500, color: '#ffe08a', glow: '#e0a040' }));
          } else {
            for (const o of [-0.12, 0.12]) bullets.push(new Shot({ x, y, vx: Math.cos(a + o) * 110, vy: Math.sin(a + o) * 110, art: 'shdSalt', warn: m.len, life: 1.6 }));
          }
        }
      },
    };
  },

  // Brine: sea water runs off his oilskins in drops. Where a drop lands it
  // spreads into a puddle, harmless at first; then the puddle dries, and
  // the salt in it grows into a crust of white spikes. Get off a puddle
  // before it turns to salt. One drop always lands where you are.
  shadeBrine(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    const FALL = 0.45;
    const DRY = 0.95;
    let t = 0;
    let n = 0;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= T(0.2 + n * 0.45) && n < 14) {
          n++;
          const spots = [{ x: soul.x, y: soul.y }];
          if (n % 2) spots.push({ x: rand(box.x + 8, box.x + box.w - 8), y: rand(box.y + 8, box.y + box.h - 8) });
          for (const s of spots) {
            bullets.push(new PathShot({ art: 'shdBubble', harmless: true, life: FALL, path: (k) => ({ x: s.x, y: s.y - 30 * (1 - Math.min(1, k / FALL)) }) }));
            bullets.push(new Zone({ x: s.x, y: s.y, r: 10, warn: FALL + DRY, life: 0.8, paint(ctx, z) {
              if (z.age < FALL) return;
              if (z.age < z.warn) {
                const g = Math.min(1, (z.age - FALL) / 0.3);
                ctx.globalAlpha = 0.35 + 0.25 * ((z.age - FALL) / DRY);
                ctx.fillStyle = '#6fb8b2';
                ctx.beginPath();
                ctx.ellipse(z.x, z.y, 9 * g, 6 * g, 0, 0, Math.PI * 2);
                ctx.fill();
                // Glints of salt as it dries.
                if ((z.age - FALL) / DRY > 0.6) { ctx.fillStyle = '#f0ffff'; ctx.fillRect(Math.round(z.x) - 3, Math.round(z.y), 1, 1); ctx.fillRect(Math.round(z.x) + 2, Math.round(z.y) - 2, 1, 1); }
                return;
              }
              blit(ctx, CRUST, SEA, z.x, z.y);
              blit(ctx, CRUST, SEA, z.x, z.y - 4);
            } }));
            // As it turns to salt, the crust cracks and flicks grains out.
            for (let i = 0; i < 4; i++) {
              const a = Math.PI / 4 + (i * Math.PI) / 2;
              bullets.push(new Shot({ x: s.x, y: s.y, vx: Math.cos(a) * 60, vy: Math.sin(a) * 60, art: 'shdSalt', warn: FALL + DRY, life: 1 }));
            }
          }
        }
      },
    };
  },

  // Heave the lead: he takes soundings, the way he did on watch. He swings
  // the lead and casts it at you; it lands with a thump, the line snaps
  // taut from the lead back to his hand, and then he hauls it in along the
  // line, dragging. The line goes taut first; the lead comes home along it.
  shadeLead(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    const FLY = 0.6;
    const TAUT = 0.45;
    const HAUL = 0.4;
    let t = 0;
    let n = 0;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= T(0.2 + n * 0.9) && n < 7) {
          n++;
          const hand = { x: box.x + box.w + 6, y: rand(box.y + 6, box.y + box.h - 6) };
          const to = { x: soul.x, y: soul.y };
          // Out in an arc (harmless in the air), down, then hauled home.
          bullets.push(new PathShot({
            art: 'shdLead', harmless: true, life: FLY,
            path: (k) => { const u = Math.min(1, k / FLY); return { x: hand.x + (to.x - hand.x) * u, y: hand.y + (to.y - hand.y) * u - Math.sin(Math.PI * u) * 20 }; },
          }));
          bullets.push(new Shot({ x: to.x, y: to.y + 3, harmless: true, life: FLY, art: 'shdMark' }));
          bullets.push(new Zone({ x: to.x, y: to.y, r: 5, warn: FLY, life: 0.18, paint() {} }));
          bullets.push(new PathShot({
            art: 'shdLead', warn: FLY + TAUT, life: HAUL,
            path: (k) => { const u = Math.min(1, k / HAUL); const e = u * u; return { x: to.x + (hand.x - to.x) * e, y: to.y + (hand.y - to.y) * e }; },
          }));
          bullets.push(new Tether({ warn: FLY + 0.12, life: TAUT - 0.12 + HAUL, thick: 2, color: '#cfae7c', dark: '#3a2a18', ends: (k) => {
            const h = Math.max(0, k - (TAUT - 0.12));
            const u = Math.min(1, h / HAUL);
            const e = u * u;
            return [to.x + (hand.x - to.x) * e, to.y + (hand.y - to.y) * e, hand.x, hand.y];
          } }));
        }
      },
    };
  },
};
