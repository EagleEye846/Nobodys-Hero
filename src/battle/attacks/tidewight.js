import { defineBulletArt, Shot } from '../projectiles.js';
import { rand, clamp } from '../patternTools.js';
import { PathShot, Deco, Zone, shove } from './coastKit.js';

// The Tidewight's attacks. A shape of black water from the deepest well in the
// Soundings, standing to the right of the box:
//   - Rising water: the level in the box climbs, holds and falls back. Below
//     the surface you wade at half speed and bubbles rise at you from the
//     bottom; at the surface, crests of foam ride along it. Stay above it.
//   - Drains: whirlpools open up near you. Each one pulls toward its middle,
//     with a ring of dark water spiralling in round it and a hurting eye.
//   - Lamps: the drowned sounders' work lamps drift through in small
//     processions, swaying on the swell. One in each flares, and sheds sparks.
// Every bullet is its own: foam, bubbles, spiralling water, lamps and sparks.

const PAL = {
  k: '#050a14', b: '#0e1a2c', B: '#17304a', d: '#235070', m: '#3a7f9c', c: '#8fd8e4', f: '#d6f4f4', t: '#ffffff',
  y: '#ffc65c', Y: '#ffefa6', o: '#c8832a', h: '#7a5a2a',
};

// A curl of foam off the top of a wave, white on dark.
defineBulletArt('tideFoam', {
  frames: [
    ['..ff...', '.fffc..', 'cfffffc', '.mmmmm.'],
    ['...ff..', '..cfff.', '.cfffcf', '..mmmm.'],
  ],
  palette: PAL,
  radius: 3,
  frameSeconds: 0.2,
});

// A bubble rising from the bottom: a ring with a glint.
defineBulletArt('tideBubble', {
  frames: [['.cc.', 'c..c', 'c.tc', '.cc.']],
  palette: PAL,
  radius: 2.2,
});

// A bit of black water going round a drain: a curled blade of it with a foam edge.
defineBulletArt('tideSwirl', {
  frames: [
    ['..cff', '.dBBc', 'dBbb.', 'Bbb..'],
    ['..ccf', '.dBBc', 'dBbb.', '.Bb..'],
  ],
  palette: PAL,
  radius: 2.4,
  rotate: true,
  frameSeconds: 0.15,
});

// A sounder's work lamp: a brass-capped lantern on a loop of old rope, steady and amber.
defineBulletArt('tideLamp', {
  frames: [
    ['..hhh..', '.h...h.', '..ooo..', '.oYYYo.', 'oyYYYyo', 'oyYYYyo', '.oyyyo.', '..ooo..'],
    ['..hhh..', '.h...h.', '..ooo..', '.oYyYo.', 'oyYYYyo', 'oyYYYyo', '.oyyyo.', '..ooo..'],
  ],
  palette: PAL,
  radius: 3.4,
  frameSeconds: 0.3,
});

// A spark off a flaring lamp.
defineBulletArt('tideGlint', {
  frames: [['.y.', 'yYy', '.y.'], ['y.y', '.Y.', 'y.y']],
  palette: PAL,
  radius: 1.7,
  frameSeconds: 0.1,
});

const smooth = (u) => u * u * (3 - 2 * u);

export const TIDEWIGHT_ATTACKS = {
  // Rising water: the level climbs to about half the box, holds, swells, and falls. Wading below it
  // is half speed, with bubbles rising; crests of foam ride along the top.
  tideRise(box, density) {
    const H = box.h;
    const MAXD = H * 0.66;
    const bottom = box.y + box.h;
    // How deep the water is at time t (seconds): up, hold with a slow swell, then back down.
    const depth = (t) => {
      if (t < 0.5) return 0;
      let d;
      if (t < 3.0) d = MAXD * smooth((t - 0.5) / 2.5);
      else if (t < 5.4) d = MAXD + Math.sin((t - 3) * 2.2) * 4;
      else d = MAXD * (1 - smooth(clamp((t - 5.4) / 1.8, 0, 1)));
      return Math.max(0, d);
    };
    const surfaceAt = (t) => bottom - depth(t);
    let real = 0;
    let made = false;
    let nextCrest = 1.1;
    let nextBubble = 0.8;
    let nextSpray = 1.6;
    let last = null;
    return {
      duration: 7.4,
      update: (dt, bullets, soul) => {
        const step = dt / density;
        real += step;
        if (!made) {
          made = true;
          // The water itself, drawn over everything but the foam: dark, with a bright wavering top.
          bullets.push(new Deco({ life: 7.4, paint(ctx, d) {
            const top = surfaceAt(d.age);
            const dep = bottom - top;
            // The line it is heading for, shown before it comes.
            if (d.age < 0.5) {
              ctx.globalAlpha *= Math.floor(d.age * 10) % 2 ? 0.2 : 0.5;
              ctx.fillStyle = '#3a7f9c';
              for (let x = box.x + 2; x < box.x + box.w - 2; x += 6) ctx.fillRect(x, bottom - MAXD, 3, 1);
              return;
            }
            if (dep < 1) return;
            ctx.fillStyle = 'rgba(20, 56, 96, 0.62)';
            ctx.fillRect(box.x, top, box.w, dep);
            ctx.fillStyle = 'rgba(70, 140, 180, 0.45)';
            ctx.fillRect(box.x, top + 2, box.w, 2);
            ctx.fillStyle = '#8fd8e4';
            for (let x = box.x; x < box.x + box.w; x++) {
              const y = top + Math.round(Math.sin(x * 0.28 + d.age * 3) * 1.6);
              ctx.fillRect(x, y, 1, 1);
              if ((x + Math.floor(d.age * 6)) % 7 === 0) ctx.fillRect(x, y - 1, 1, 1);
            }
          } }));
        }
        // Wading: below the surface everything you do goes at half speed.
        if (last && soul.y > surfaceAt(real) + 1) {
          soul.x = last.x + (soul.x - last.x) * 0.5;
          soul.y = last.y + (soul.y - last.y) * 0.5;
        }
        last = { x: soul.x, y: soul.y };
        // Crests of foam along the top, bobbing, alternating direction.
        if (real >= nextCrest && real < 5.6) {
          nextCrest = real + 0.85;
          const right = Math.floor(real / 0.85) % 2 === 0;
          const x0 = right ? box.x + box.w + 6 : box.x - 6;
          const x1 = right ? box.x - 10 : box.x + box.w + 10;
          const secs = Math.abs(x1 - x0) / 34;
          const t0 = real;
          const ph = rand(0, 6);
          bullets.push(new PathShot({ art: 'tideFoam', warn: 0.25, life: secs, path: (k) => ({
            x: x0 + (x1 - x0) * Math.min(1, k / secs),
            y: surfaceAt(t0 + 0.25 + k) - 3 - 4 * (1 + Math.sin(ph + k * 3.2)),
          }) }));
        }
        // Spray: a splash opens on the surface near where you are (it blinks first), and throws drops up.
        if (real >= nextSpray && real < 5.8) {
          nextSpray = real + 0.62;
          const x = clamp(soul.x + rand(-24, 24), box.x + 6, box.x + box.w - 6);
          const at = real + 0.4;
          const y = surfaceAt(at) - 2;
          bullets.push(new Deco({ life: 0.4, paint(ctx, d) {
            ctx.globalAlpha *= Math.floor(d.age * 14) % 2 ? 0.3 : 0.8;
            ctx.fillStyle = '#d6f4f4';
            ctx.fillRect(Math.round(x) - 3, Math.round(surfaceAt(real) - 1), 7, 1);
            ctx.fillRect(Math.round(x) - 1, Math.round(surfaceAt(real) - 2), 3, 1);
          } }));
          for (const vx of [-14, 0, 14]) bullets.push(new Shot({ x, y, vx, vy: -88, gravity: 175, art: 'tideBubble', warn: 0.4, life: 1.5 }));
        }
        // Bubbles rising from the bottom while there's water over them.
        if (real >= nextBubble && real < 6.2) {
          nextBubble = real + 0.52;
          const x = rand(box.x + 6, box.x + box.w - 6);
          const surf = surfaceAt(real + 0.5);
          const life = Math.max(0.3, (bottom - 3 - surf) / 34);
          if (bottom - surf > 12) bullets.push(new Shot({ x, y: bottom - 3, vx: 0, vy: -34, art: 'tideBubble', warn: 0.3, life }));
        }
      },
    };
  },

  // Drains: a whirlpool opens near you and pulls toward its eye, black water spiralling in round it.
  // A second opens on the other side while the first is closing.
  tideDrains(box, density) {
    let real = 0;
    let n = 0;
    const whirls = [];
    return {
      duration: 7.6,
      update: (dt, bullets, soul) => {
        const step = dt / density;
        real += step;
        if (n < 2 && real >= 0.2 + n * 3.5) {
          n++;
          // Near enough to feel it at once, far enough that you aren't in the eye.
          let cx;
          let cy;
          for (let tries = 0; tries < 30; tries++) {
            const a = rand(0, Math.PI * 2);
            cx = clamp(soul.x + Math.cos(a) * 34, box.x + 16, box.x + box.w - 16);
            cy = clamp(soul.y + Math.sin(a) * 34, box.y + 16, box.y + box.h - 16);
            if (whirls.every((w) => Math.hypot(w.x - cx, w.y - cy) > 36)) break;
          }
          const WARN = 0.7;
          const LIFE = 3.6;
          const start = real;
          whirls.push({ x: cx, y: cy, from: start + WARN, to: start + WARN + LIFE });
          // The spiral on the water and the hurting eye of it.
          bullets.push(new Zone({ x: cx, y: cy, r: 4.5, warn: WARN, life: LIFE, paint(ctx, z, hot) {
            const age = z.age;
            const grow = z.age < z.warn ? 0.5 + 0.5 * (z.age / z.warn) : 1;
            ctx.save();
            ctx.translate(cx, cy);
            // The reach of the pull, ringed.
            ctx.strokeStyle = 'rgba(58, 127, 156, 0.55)';
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 3]);
            ctx.beginPath();
            ctx.arc(0, 0, 44 * grow, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
            // Three arms of the spiral turning in.
            for (let arm = 0; arm < 3; arm++) {
              ctx.strokeStyle = arm === 0 ? '#8fd8e4' : '#235070';
              ctx.lineWidth = arm === 0 ? 1.5 : 2;
              ctx.beginPath();
              for (let i = 0; i <= 26; i++) {
                const u = i / 26;
                const rr = (22 * (1 - u) + 3) * grow;
                const aa = arm * 2.094 + u * 5.2 - age * 3.2;
                const x = Math.cos(aa) * rr;
                const y = Math.sin(aa) * rr;
                if (i) ctx.lineTo(x, y);
                else ctx.moveTo(x, y);
              }
              ctx.stroke();
            }
            ctx.fillStyle = hot ? '#050a14' : 'rgba(5, 10, 20, 0.5)';
            ctx.beginPath();
            ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
            ctx.fill();
            if (hot) { ctx.strokeStyle = '#d6f4f4'; ctx.lineWidth = 1; ctx.stroke(); }
            ctx.restore();
          } }));
          // Blades of dark water going round it and in.
          const turn = rand(0, Math.PI * 2);
          for (let k = 0; k < 6; k++) {
            const a0 = turn + (k / 6) * Math.PI * 2;
            bullets.push(new PathShot({ art: 'tideSwirl', warn: WARN, life: LIFE - 0.3, path: (t) => {
              const u = Math.min(1, t / (LIFE - 0.3));
              const rr = 27 - 22 * u * u;
              const aa = a0 + t * (1.7 + u * 1.6);
              return { x: cx + Math.cos(aa) * rr, y: cy + Math.sin(aa) * rr, a: aa + Math.PI / 2 };
            } }));
          }
        }
        // The pull: weak at the edge, strong at the eye (but never stronger than you can walk against).
        for (const w of whirls) {
          if (real < w.from || real > w.to) continue;
          const d = Math.hypot(w.x - soul.x, w.y - soul.y);
          if (d > 44 || d < 1) continue;
          const pull = 12 + 36 * (1 - d / 44);
          shove(soul, box, ((w.x - soul.x) / d) * pull * step, ((w.y - soul.y) / d) * pull * step);
        }
      },
    };
  },

  // Lamps: the old sounders' work lamps drift through on the swell, in twos and threes. The one in the
  // middle of each procession flares as it passes the middle of the box, and sheds sparks.
  tideLamps(box, density) {
    let real = 0;
    let n = 0;
    const flares = [];
    return {
      duration: 7.4,
      update: (dt, bullets) => {
        const step = dt / density;
        real += step;
        if (n < 4 && real >= 0.2 + n * 1.65) {
          const right = n % 2 === 1;
          n++;
          const x0 = right ? box.x - 8 : box.x + box.w + 8;
          const x1 = right ? box.x + box.w + 10 : box.x - 10;
          const SPEED = 30;
          const secs = Math.abs(x1 - x0) / SPEED;
          const base = rand(0.2, 0.8);
          const rows = [base, (base + 0.35) % 1, (base + 0.62) % 1].map((f) => box.y + 10 + f * (box.h - 20));
          rows.forEach((y0, i) => {
            const lag = i * 0.55;
            const amp = rand(5, 9);
            const ph = rand(0, 6);
            const path = (k) => ({ x: x0 + (x1 - x0) * Math.min(1, k / secs), y: clamp(y0 + Math.sin(ph + k * 1.5) * amp, box.y + 5, box.y + box.h - 5) });
            bullets.push(new PathShot({ art: 'tideLamp', warn: 0.5 + lag, life: secs, path }));
            // The middle one flares as it passes the middle of the box.
            if (i === 1) flares.push({ at: real + 0.5 + lag + secs / 2, k0: real + 0.5 + lag, path });
          });
        }
        for (let i = flares.length - 1; i >= 0; i--) {
          const f = flares[i];
          if (real < f.at - 0.4) continue;
          if (!f.warned) {
            // The glow swells and blinks just before it flares.
            f.warned = true;
            bullets.push(new Deco({ life: 0.4, paint(ctx, d) {
              const q = f.path(Math.max(0, real - f.k0));
              ctx.globalAlpha *= Math.floor(d.age * 14) % 2 ? 0.3 : 0.75;
              ctx.strokeStyle = '#ffc65c';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.arc(q.x, q.y, 3 + 9 * (d.age / 0.4), 0, Math.PI * 2);
              ctx.stroke();
            } }));
          }
          if (real < f.at) continue;
          flares.splice(i, 1);
          const p = f.path(Math.max(0, real - f.k0));
          const turn = rand(0, Math.PI);
          for (let s = 0; s < 6; s++) {
            const a = turn + (s / 6) * Math.PI * 2;
            bullets.push(new Shot({ x: p.x, y: p.y, vx: Math.cos(a) * 30, vy: Math.sin(a) * 30, art: 'tideGlint', life: 1.7 }));
          }
        }
      },
    };
  },
};
