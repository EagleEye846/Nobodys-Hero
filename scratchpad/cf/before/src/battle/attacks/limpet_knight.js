import { defineBulletArt } from '../projectiles.js';
import { art } from '../../data/art/ch5Kit.js';
import { PathShot, Zone, Deco, blit } from './coastKit.js';

// The Limpet Knight's attacks. A limpet in tiny armour, very serious, and it
// will not be moved, so it brings the fight to you:
//   - Joust, and home again: visor down, it charges along your row, and then
//     (a limpet always goes home to its own scar) straight back the same way.
//   - Clamp down: the box is its rock. The cracks about to split show
//     faintly, one through you; then it clamps and they open.
//   - Clingers and the bugle: little limpets cling where they land, harmless,
//     until it sounds the bugle and every one of them clamps at once.
// It stands to the right of the box.

const ROCK = { k: '#1b1a22', h: '#b4a68a', H: '#d8ccb0', s: '#8a7c64', D: '#35302c', g: '#7e8a78', G: '#aab6a0', w: '#f0f4ee' };


// A rolling stone, two sizes: round and lumpy, with a pale crack.
const stone = (r) => art(r * 2 + 3, r * 2 + 3, (p) => {
  p.ellipse(r + 1, r + 1, r, r, 'h');
  p.ellipse(r + 2, r + 2, r - 1.5, r - 1.5, 's', ['h']);
  p.ellipse(r, r, r / 2.4, r / 2.6, 'H');
  p.line(r - 1, r + 2, r + 2, r - 1, 'D');
});
defineBulletArt('limpStone', { frames: [stone(3)], palette: ROCK, radius: 3.1, spin: 6 });
defineBulletArt('limpBoulder', { frames: [stone(5)], palette: ROCK, radius: 5.1, spin: 4 });

// A pebble dragged along in the suction.
defineBulletArt('limpPebble', { frames: [art(5, 5, (p) => { p.ellipse(2, 2, 1.6, 1.6, 'h'); p.set(3, 3, 's'); })], palette: ROCK, radius: 1.9, spin: 8 });

// A barnacle: a little white volcano with a dark mouth.
defineBulletArt('limpBarnacle', {
  frames: [
    art(9, 8, (p) => { p.poly([[1, 6], [3, 1], [6, 1], [8, 6]], 'G'); p.rect(3, 1, 3, 1, 'D'); p.line(2, 5, 3, 2, 'w'); p.rect(1, 6, 7, 1, 'g'); }),
    art(9, 8, (p) => { p.poly([[1, 6], [3, 1], [6, 1], [8, 6]], 'G'); p.rect(3, 1, 3, 2, 'D'); p.line(2, 5, 3, 2, 'w'); p.rect(1, 6, 7, 1, 'g'); }),
  ],
  palette: ROCK,
  radius: 3.4,
  frameSeconds: 0.3,
});

// The suction itself: a ring of dashes pulling in (harmless; it's the pull
// and what comes with it that hurts).
defineBulletArt('limpSwirl', {
  frames: [
    ['..w...w..', '.........', 'w.......w', '.........', '..w...w..'].map((r) => r),
    ['.w.....w.', '.........', '.........', '.........', '.w.....w.'],
  ],
  palette: ROCK,
  radius: 1,
  frameSeconds: 0.2,
  spin: 3,
});

const KNIGHT = { ...ROCK, r: '#c83a3a', R: '#ff7a6a', n: '#9aa4b0', N: '#5a6470', y: '#e8c050' };
// The knight at the charge, lance couched, drawn facing left: a limpet cone in
// a steel visor, a red plume streaming back, the lance out in front.
const charger = (f) => art(25, 13, (p) => {
  p.poly([[9, 11], [14, 2], [19, 11]], 'h');
  p.line(11, 9, 14, 3, 'H');
  p.rect(10, 7, 9, 3, 'n');
  p.rect(11, 8, 7, 1, 'N');
  p.line(17, 3, 23, 1 + f, 'r', 2);
  p.line(19, 4, 24, 4 - f, 'R');
  p.line(0, 9, 10, 9, 'y');
  p.line(0, 9, 3, 9, 'w');
  p.rect(9, 11, 11, 1, 'g');
});
defineBulletArt('limpCharger', { frames: [charger(0), charger(1)], palette: KNIGHT, hitbox: { w: 22, h: 8 }, radius: 4, frameSeconds: 0.08 });
defineBulletArt('limpChargerR', { frames: [charger(0).map((r) => [...r].reverse().join('')), charger(1).map((r) => [...r].reverse().join(''))], palette: KNIGHT, hitbox: { w: 22, h: 8 }, radius: 4, frameSeconds: 0.08 });
// A little limpet thrown out to cling where it lands (harmless while it clings).
defineBulletArt('limpClinger', { frames: [art(9, 7, (p) => { p.poly([[0, 6], [4, 0], [8, 6]], 'h'); p.line(2, 5, 4, 1, 'H'); p.rect(0, 6, 9, 1, 'g'); })], palette: KNIGHT, radius: 1 });
defineBulletArt('limpClingerFly', { frames: [art(9, 7, (p) => { p.poly([[0, 6], [4, 0], [8, 6]], 'h'); p.line(2, 5, 4, 1, 'H'); p.rect(0, 6, 9, 1, 'g'); })], palette: KNIGHT, radius: 3, spin: 6 });
// A spike of shell snapping out when a clinger clamps.
defineBulletArt('limpSpike', { frames: [art(7, 3, (p) => { p.line(0, 1, 6, 1, 'H'); p.set(6, 1, 'w'); })], palette: KNIGHT, radius: 1.8, rotate: true });
// The bugle note it sounds (harmless).
defineBulletArt('limpBugle', { frames: [['..y..', '.yyy.', 'yywyy', '..y..', '..y..'], ['.....', '..y..', '.yyy.', '..y..', '.....']], palette: KNIGHT, radius: 1, frameSeconds: 0.1 });

export const LIMPET_KNIGHT_ATTACKS = {
  // Joust, and home again: it lowers its visor (the row it faces lights up),
  // couches its lance and charges across the box along that row. Then,
  // because a limpet always goes home to its own scar on the rock, it comes
  // straight back along the same row. While the visor is up it turns to
  // face your row; once it's down, it's set.
  limpJoust(box, density, { rand }) {
    const T = (s) => s * density;
    const VISOR = 0.42;
    const SPEED = 260;
    const across = (box.w + 40) / SPEED;
    let t = 0;
    let n = 0;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= T(0.2 + n * 0.95) && n < 7) {
          n++;
          const y = Math.min(Math.max(soul.y + rand(-3, 3), box.y + 6), box.y + box.h - 6);
          const x0 = box.x + box.w + 20;
          const x1 = box.x - 20;
          bullets.push(new Deco({ warn: VISOR, life: VISOR, paint(ctx, d) {
            ctx.globalAlpha *= Math.floor(d.age * 10) % 2 ? 0.2 : 0.45;
            ctx.fillStyle = '#e8c050';
            ctx.fillRect(box.x, y - 4, box.w, 8);
          } }));
          bullets.push(new PathShot({ art: 'limpCharger', warn: VISOR, life: across, path: (k) => ({ x: x0 + (x1 - x0) * Math.min(1, k / across), y }) }));
          // Home again, after a breath at the far wall.
          bullets.push(new PathShot({ art: 'limpChargerR', warn: VISOR + across + 0.1, life: across, path: (k) => ({ x: x1 + (x0 - x1) * Math.min(1, k / across), y }) }));
        }
      },
    };
  },

  // Clamp down: the box is its rock, cracked into stones. Before each clamp
  // the cracks it is about to split show faintly (one runs through where
  // you are, across and down); then it clamps down hard and the cracks
  // split open. Stand in the middle of a stone, not on a crack.
  limpClamp(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    const WARN = 0.6;
    let t = 0;
    let n = 0;
    const crack = (x, y, w, h, i) => new Zone({ x, y, w, h, warn: WARN + i * 0.03, life: 0.4, paint(ctx, z) {
      if (z.age < z.warn) {
        ctx.fillStyle = '#d8ccb0';
        ctx.globalAlpha *= 0.6;
        if (z.w > z.h) ctx.fillRect(z.x, z.y + z.h / 2, z.w, 1); else ctx.fillRect(z.x + z.w / 2, z.y, 1, z.h);
        return;
      }
      ctx.fillStyle = '#35302c';
      ctx.fillRect(z.x, z.y, z.w, z.h);
      ctx.fillStyle = '#d8ccb0';
      if (z.w > z.h) ctx.fillRect(z.x, z.y, z.w, 1); else ctx.fillRect(z.x, z.y, 1, z.h);
    } });
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= T(0.2 + n * 0.8) && n < 8) {
          n++;
          // The seams: one row and one column through you, plus one of each more, a stone apart.
          const rows = [soul.y + rand(-2, 2)];
          const cols = [soul.x + rand(-2, 2)];
          rows.push(rows[0] + (rows[0] > box.y + box.h / 2 ? -1 : 1) * rand(18, 24));
          cols.push(cols[0] + (cols[0] > box.x + box.w / 2 ? -1 : 1) * rand(18, 24));
          rows.forEach((y, i) => bullets.push(crack(box.x, y - 3.5, box.w, 7, i)));
          cols.forEach((x, i) => bullets.push(crack(x - 3.5, box.y, 7, box.h, i + 2)));
          // Grit thrown up by the clamp, where the cracks through you cross.
          for (const y of rows.slice(0, 1)) for (const x of cols.slice(0, 1)) bullets.push(new Shot({ x, y, vx: rand(-20, 20), vy: -30, gravity: 80, art: 'limpPebble', warn: WARN, life: 0.8 }));
        }
      },
    };
  },

  // Clingers and the bugle: it flings little limpets out of its shield, and
  // every one clings where it lands (at your feet, mostly) and sits there
  // harmless. Then it sounds the bugle, and every clinger in the box clamps
  // at once, snapping out a star of shell spikes. Count the clingers, and
  // be clear of them when the bugle goes.
  limpBugle(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    const clingers = [];
    let t = 0;
    let n = 0;
    let calls = 0;
    const FLY = 0.55;
    return {
      duration: 7,
      update: (dt, bullets, soul) => {
        t += dt;
        // Four throws, then the bugle; three times over.
        const plan = [0.2, 0.45, 0.7, 0.95, 2.1, 2.35, 2.6, 2.85, 4.0, 4.25, 4.5];
        const bugles = [1.5, 3.4, 5.3];
        if (n < plan.length && t >= T(plan[n])) {
          n++;
          const from = { x: box.x + box.w + 6, y: rand(box.y + 10, box.y + box.h - 10) };
          const to = { x: soul.x + rand(-5, 5), y: soul.y + rand(-5, 5) };
          bullets.push(new PathShot({ art: 'limpClingerFly', life: FLY, path: (k) => { const u = Math.min(1, k / FLY); return { x: from.x + (to.x - from.x) * u, y: from.y + (to.y - from.y) * u - Math.sin(Math.PI * u) * 14 }; } }));
          const c = new Shot({ x: to.x, y: to.y, harmless: true, warn: FLY, art: 'limpClinger' });
          c.life = 9;
          clingers.push(c);
          bullets.push(c);
        }
        if (calls < bugles.length && t >= T(bugles[calls])) {
          calls++;
          const CALL = 0.5;
          bullets.push(new Shot({ x: box.x + box.w - 6, y: box.y + 6, harmless: true, life: CALL, art: 'limpBugle' }));
          for (const c of clingers.splice(0)) {
            c.life = c.age - c.warn + CALL + 0.3;
            bullets.push(new Zone({ x: c.x, y: c.y, r: 6, warn: CALL, life: 0.3, paint(ctx, z) { if (z.age >= z.warn) blit(ctx, ['..H..', '.HhH.', 'HhwhH', '.HhH.', '..H..'], KNIGHT, z.x, z.y); } }));
            for (let i = 0; i < 8; i++) {
              const a = (i / 8) * Math.PI * 2;
              bullets.push(new Shot({ x: c.x, y: c.y, vx: Math.cos(a) * 82, vy: Math.sin(a) * 82, art: 'limpSpike', warn: CALL, life: 0.6 }));
            }
          }
        }
      },
    };
  },
};
