import { defineBulletArt, Shot } from '../projectiles.js';
import { art } from '../../data/art/ch5Kit.js';
import { stampNumber } from '../../data/art/plumb_lead.js';
import { PathShot, Tether, Deco } from './coastKit.js';

// The Plumb Lead's attacks. A sounder's lead on a frayed line, still taking
// soundings:
//   - Swing: it drops its line from above the box and swings, the rope
//     sweeping the box like a clock's pendulum, the lead at the end of it.
//     Two lines, then three, each on its own beat. The rope stings as well
//     as the lead; the corners by the top are the only still places, and
//     the lines wander.
//   - Depth markers: tags knotted on cords fall like rain, each stamped with
//     a depth. A bigger number falls faster (the Harbour Board's men marked
//     deeper water further down the line), so the number tells you the speed
//     before it gets to you. The deeper marks come later.
//   - Drag: it hauls on its line and the floor of the box comes up, the room
//     to move shrinking from the bottom, twice, while little lead sinkers
//     bounce about in what's left. It lets go in the end.
// It hangs above and to the right of the box.
//
// Timing: a pattern's update is handed dt scaled by the enemy's density,
// so every attack here divides it back out and counts real seconds.
// (Shot speeds are scaled by the enemy's speed in bullets.js; paths and
// tethers keep to their own clocks.)

const LEAD = { l: '#8e9aa8', L: '#5c6878', d: '#3a4456', h: '#c4ceda', w: '#f2f8ff', t: '#d8c890', T: '#a08c58', r: '#b8a47c', R: '#7a6a4c', k: '#161c2c', e: '#e8fcff' };

// A lead bob on the end of a line: a fat cone, eyelet at the top, tallow in its base.
defineBulletArt('leadBob', {
  frames: [art(14, 17, (p) => {
    for (let y = 2; y < 15; y++) {
      const half = 2 + ((y - 2) / 13) * 4.6;
      for (let x = -Math.ceil(half); x <= Math.ceil(half); x++) {
        if (Math.abs(x) <= half) p.set(7 + x, y, x < -half * 0.4 ? 'h' : x > half * 0.4 ? 'L' : 'l');
      }
    }
    p.ellipse(7, 15, 5, 1.2, 'd');
    p.ellipse(7, 14.8, 3.4, 0.7, 't');
    p.ellipse(7, 2, 1.8, 1.2, 'd');
    p.set(7, 2, 'R');
    p.set(5, 6, 'w');
    p.set(5, 8, 'w');
  })],
  palette: LEAD,
  radius: 6,
});

// A lead sinker, smaller and rounder, with a loop at the top.
defineBulletArt('leadSinker', {
  frames: [art(9, 11, (p) => {
    p.ellipse(4, 6.5, 3.8, 3.6, 'l');
    p.ellipse(3, 5.5, 1.8, 1.4, 'h');
    p.ellipse(5, 8, 2.4, 1.5, 'L');
    p.ring(4, 1.5, 1.6, 1.4, 'R');
  })],
  palette: LEAD,
  radius: 3.6,
  spin: 2.2,
});

// A knotted tag stamped with a depth: a leather tag on a short cord, the number burnt in.
const TAG_NUMBERS = [2, 3, 5, 7, 10, 13, 15, 17, 20];
function tag(n, blink) {
  return art(11, 14, (p) => {
    p.rect(5, 0, 1, 3, 'R');
    p.ellipse(5, 3, 1.6, 1.2, 'R');
    p.rect(1, 4, 9, 10, 'r');
    p.rect(1, 4, 9, 1, 'w');
    p.rect(8, 4, 2, 10, 'R');
    p.set(5, 5, blink ? 'w' : 'k');
    stampNumber(p, n, n >= 10 ? 1 : 3, 7, 'k');
  });
}
for (const n of TAG_NUMBERS) {
  defineBulletArt(`leadTag${n}`, { frames: [tag(n, false), tag(n, true)], palette: { ...LEAD, w: '#e8dcb8', r: '#c4a878', R: '#7a5e3a' }, radius: 4, hitbox: { w: 9, h: 11 }, frameSeconds: 0.4 });
}

export const PLUMB_LEAD_ATTACKS = {
  // Swing. Lines drop from above the box and swing, the rope sweeping with the lead on the end.
  // The first line starts at once, the second joins on the opposite beat, the third comes in at
  // the end between them. Their tops slide about a little, so no corner stays safe.
  leadSwing(box, density, { rand }) {
    let real = 0;
    let made = 0;
    const WARN = 0.8;
    const TOP = box.y - 8;
    const LEN = 92;
    const lines = [
      { at: 0.2, x: box.x + 22, life: 5.0, phase: 0, period: 3.4, amp: 0.76 },
      { at: 2.2, x: box.x + 58, life: 5.4, phase: Math.PI, period: 3.4, amp: 0.76 },
      { at: 5.0, x: box.x + 40, life: 3.3, phase: Math.PI / 2, period: 2.8, amp: 0.7 },
    ];
    return {
      duration: 8.6,
      update: (dt, bullets) => {
        real += dt / density;
        while (made < lines.length && real >= lines[made].at) {
          const line = lines[made++];
          const slide = rand(0, 6);
          // Where the line and the lead are, k seconds after it starts to swing.
          const at = (k) => {
            const theta = line.amp * Math.sin((k / line.period) * Math.PI * 2 + line.phase);
            const px = line.x + Math.sin(k * 0.8 + slide) * 10;
            return { px, bx: px + Math.sin(theta) * LEN, by: TOP + Math.cos(theta) * LEN, theta };
          };
          bullets.push(new Tether({
            ends: (k) => {
              const p = at(k);
              return [p.px, TOP, p.bx, p.by];
            },
            warn: WARN, life: line.life, thick: 2.4, color: '#c4a878', dark: '#4a3a24',
          }));
          bullets.push(new PathShot({
            art: 'leadBob', warn: WARN, life: line.life,
            path: (k) => {
              const p = at(k);
              return { x: p.bx, y: p.by - 6 };
            },
          }));
          // The pivot: a knot hanging in the dark above the box (harmless).
          bullets.push(new Deco({
            x: line.x, y: TOP, life: WARN + line.life,
            paint: (ctx, d) => {
              const p = at(Math.max(0, d.age - WARN));
              ctx.fillStyle = '#7a5e3a';
              ctx.fillRect(Math.round(p.px) - 2, TOP - 2, 5, 4);
              ctx.fillStyle = '#c4a878';
              ctx.fillRect(Math.round(p.px) - 1, TOP - 1, 3, 2);
            },
          }));
        }
      },
    };
  },

  // Depth markers. Tags fall like rain, each stamped with a depth and falling the faster the
  // bigger the number. Five casts, each with deeper numbers than the last; one tag in each
  // cast comes down on your column (the others take other columns, with some left empty).
  leadTags(box, density, { rand }) {
    let real = 0;
    let cast = 0;
    const COLS = 6;
    // The numbers in each cast, shallow to deep.
    const NUMS = [[2, 3, 3, 5], [3, 5, 5, 7], [5, 7, 7, 10], [7, 10, 10, 13], [10, 13, 13, 15]];
    return {
      duration: 8.4,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (cast < NUMS.length && real >= 0.3 + cast * 1.4) {
          const nums = NUMS[cast++];
          const cols = [];
          const mine = Math.min(COLS - 1, Math.max(0, Math.floor(((soul.x - box.x) / box.w) * COLS)));
          cols.push(mine);
          while (cols.length < nums.length) {
            const c = Math.floor(rand(0, COLS));
            if (!cols.includes(c)) cols.push(c);
          }
          cols.forEach((c, i) => {
            const n = nums[i];
            const x = box.x + (box.w / COLS) * (c + 0.5) + rand(-3, 3);
            bullets.push(new Shot({ x, y: box.y - 10, vx: 0, vy: 15 + n * 4.2, art: `leadTag${n}`, warn: 0.45 + i * 0.12 }));
          });
        }
      },
    };
  },

  // Drag. The line takes hold of the floor and hauls it up: the box shrinks from the bottom,
  // twice, to about a half. Lead sinkers drop in and bounce about in what space is left; the
  // floor stops for a breath at the top of each haul. It lets go, and the floor drops back.
  leadDrag(box, density) {
    let real = 0;
    let made = 0;
    const FULL = box.h;
    const owner = !box.heldBy;
    if (owner) box.heldBy = 'leadDrag';
    // How much of the floor is gone, over the turn: up and hold, down, up higher, hold, down.
    const HAULS = [[0.9, 1.9, 4.0, 4.9, 22], [5.1, 6.0, 7.4, 8.2, 30]];
    const lift = (t) => {
      let v = 0;
      for (const [a, b, c, d, amount] of HAULS) {
        if (t >= a && t < b) v = Math.max(v, ((t - a) / (b - a)) * amount);
        else if (t >= b && t < c) v = Math.max(v, amount);
        else if (t >= c && t < d) v = Math.max(v, (1 - (t - c) / (d - c)) * amount);
      }
      return v;
    };
    const sinkerTimes = [0.5, 1.6, 2.5, 3.5, 5.2, 6.2];
    return {
      duration: 8.6,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (owner) {
          // The floor, hauled up; a tug is felt (it shakes) a moment before it moves.
          const shake = [0.55, 4.9, ...[]].some((s) => real > s - 0.4 && real < s) ? Math.sin(real * 60) * 0.8 : 0;
          box.h = FULL - lift(real) + shake;
          if (real >= 8.5) { box.h = FULL; delete box.heldBy; }
        }
        // The line itself, from the lead above to the floor (harmless): a taut cord at each end of the floor.
        if (made === 0) {
          made = 1;
          bullets.push(new Deco({
            x: 0, y: 0, life: 8.4,
            paint: (ctx, d) => {
              const lifted = lift(d.age);
              const base = box.y + box.h;
              ctx.strokeStyle = '#4a3a24';
              ctx.fillStyle = '#c4a878';
              ctx.lineWidth = 3;
              for (const x of [box.x + 4, box.x + box.w - 4]) {
                ctx.beginPath();
                ctx.moveTo(x, base);
                ctx.lineTo(box.x + box.w / 2, box.y - 24);
                ctx.stroke();
              }
              ctx.lineWidth = 1.5;
              ctx.strokeStyle = '#c4a878';
              for (const x of [box.x + 4, box.x + box.w - 4]) {
                ctx.beginPath();
                ctx.moveTo(x, base);
                ctx.lineTo(box.x + box.w / 2, box.y - 24);
                ctx.stroke();
              }
              // The floor itself, a heavy plank edge where it's been hauled to.
              if (lifted > 0.5) {
                ctx.fillStyle = '#5c6878';
                ctx.fillRect(box.x, base, box.w, 3);
                ctx.fillStyle = '#c4ceda';
                ctx.fillRect(box.x, base, box.w, 1);
              }
            },
          }));
        }
        // Sinkers dropped in: they bounce off every wall, floor included, so the floor coming up
        // squeezes them too. They live a few seconds each.
        if (sinkerTimes.length && real >= sinkerTimes[0]) {
          sinkerTimes.shift();
          const x = box.x + 10 + Math.random() * (box.w - 20);
          const vx = (Math.random() < 0.5 ? -1 : 1) * (22 + Math.random() * 12);
          bullets.push(new Shot({ x, y: box.y + 4, vx, vy: 10, gravity: 70, bounce: true, art: 'leadSinker', warn: 0.5, life: 3.2 }));
          // One at your column, dropped straight.
          bullets.push(new Shot({ x: Math.min(box.x + box.w - 6, Math.max(box.x + 6, soul.x)), y: box.y - 8, vx: 0, vy: 40, gravity: 60, art: 'leadSinker', warn: 0.6, life: 3.2 }));
        }
      },
    };
  },
};

