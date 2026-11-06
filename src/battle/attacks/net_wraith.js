import { defineBulletArt } from '../projectiles.js';
import { Pix } from '../../data/art/pixKit.js';
import { withSnipes } from './snipes.js';

// The Net Wraith's attacks. It's a drowned fishing net, so it's a net's whole
// business: the box closing to a small window like a net being hauled tight
// (the window shows first), a line of cork floats bobbing in on the swell, a
// hook let down on a line that stops, then jerks home, and a curtain of knots
// let fall with a hole torn in it. It hangs to the right of the box.

const NET = { n: '#c8b48a', N: '#8a7650', i: '#cfd8dc', o: '#e0583a', O: '#a83a28', W: '#f4ece0', w: '#ffffff', g: '#9af0c8', G: '#4ab08a', k: '#1c2a2a' };

// A cork float: red and white.
function float(size) {
  const c = (size - 1) / 2;
  const g = new Pix(size, size);
  g.disc(c, c, c, c, 'o');
  g.rect(0, Math.round(c) - 1, size, 2, 'W');
  g.disc(c + 1, c + 1.5, c * 0.7, c * 0.5, 'O', 'o');
  g.set(c - 1, c - 2, 'w');
  g.outline('k');
  return g.rows();
}
defineBulletArt('netFloat', { frames: [float(7)], palette: NET, radius: 3, spin: 1.5 });

// A hook on its line, point down.
defineBulletArt('netHook', {
  frames: [['...i...', '...i...', '...i...', '...i...', '...i.i.', '.i.i.i.', '..iii..']],
  palette: NET,
  radius: 2.6,
});

// A bead of the fishing line (harmless).
defineBulletArt('netThread', { frames: [['i'], ['n']], palette: NET, radius: 1, frameSeconds: 0.3 });

// A glint where a hook will go down (harmless).
defineBulletArt('netGlint', {
  frames: [['..w..', '.....', 'w...w', '.....', '..w..'], ['.....', '..w..', '.wgw.', '..w..', '.....']],
  palette: NET,
  radius: 1,
  frameSeconds: 0.1,
});

// A knot of rope, in the curtain.
defineBulletArt('netKnot', {
  frames: [['n...n', '.nNn.', '.NNN.', '.nNn.', 'n...n']],
  palette: NET,
  radius: 2.6,
  spin: 0.8,
});

// A corner of the window (harmless): a green bracket.
defineBulletArt('netPeg', {
  frames: [['gggg.', 'g....', 'g....', 'g....', '.....'], ['GGGG.', 'G....', 'G....', 'G....', '.....']],
  palette: NET,
  radius: 1,
  frameSeconds: 0.12,
});

export const NET_WRAITH_ATTACKS = {
  // Grid: the net is hauled tight. A window shows at four green corners (one a
  // good way off you), and then bars of rope slide in from all four sides until
  // only the window is left, holding a moment. Be in the window. Three hauls,
  // each window somewhere else.
  netGrid(box, density, { Shot, Line, rand, clamp }) {
    let t = 0;
    let hauls = 0;
    let bars = [];
    const WIN = 32;
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (hauls < 3 && t >= 0.2 + hauls * 2.5) {
          let wx = 0;
          let wy = 0;
          let tries = 0;
          do {
            wx = rand(box.x + 6, box.x + box.w - WIN - 6);
            wy = rand(box.y + 6, box.y + box.h - WIN - 6);
            tries++;
          } while (tries < 30 && Math.hypot(wx + WIN / 2 - soul.x, wy + WIN / 2 - soul.y) < 30);
          const warn = 0.9;
          for (const [px, py, a] of [[wx, wy, 0], [wx + WIN, wy, 1], [wx, wy + WIN, 3], [wx + WIN, wy + WIN, 2]]) {
            bullets.push(new Shot({ x: px, y: py, harmless: true, life: warn + 1.3, art: 'netPeg', angle: (a * Math.PI) / 2 }));
          }
          const SPEED = 74;
          const mk = (x, y, angle, length, vx, vy, stop) => {
            const line = new Line({ x, y, angle, length, thickness: 5, warn: 0, life: 4, color: '#c8b48a', glow: '#8a7650', dash: [7, 2] });
            line.go = t + warn;
            line.vx0 = vx;
            line.vy0 = vy;
            line.stop = stop;
            bars.push(line);
            bullets.push(line);
          };
          // Four bars waiting off the box, sliding in to the window's edges.
          mk(box.x - 10, box.y - 9, 0, box.w + 20, 0, SPEED, (l) => l.y >= wy - 3);
          mk(box.x - 10, box.y + box.h + 9, 0, box.w + 20, 0, -SPEED, (l) => l.y <= wy + WIN + 3);
          mk(box.x - 9, box.y - 10, Math.PI / 2, box.h + 20, SPEED, 0, (l) => l.x >= wx - 3);
          mk(box.x + box.w + 9, box.y - 10, Math.PI / 2, box.h + 20, -SPEED, 0, (l) => l.x <= wx + WIN + 3);
          hauls++;
        }
        for (const bar of bars) {
          if (t < bar.go || bar.stopped) {
            if (bar.stopped && t > bar.until) bar.life = bar.age - bar.warn;
            continue;
          }
          bar.vx = bar.vx0;
          bar.vy = bar.vy0;
          if (bar.stop(bar)) {
            bar.vx = 0;
            bar.vy = 0;
            bar.stopped = true;
            bar.until = t + 0.55;
          }
        }
        bars = bars.filter((bar) => !(bar.stopped && t > bar.until + 0.1));
      },
    };
  },

  // Floats: a line of cork floats comes in on the swell from the right, each one
  // bobbing up and down a beat after the one before it, so the line rolls like a
  // wave. Three lines; the first rides on your row.
  netFloats(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let lines = 0;
    let made = 0;
    let next = 0;
    let base = 0;
    let lineShift = 0;
    let gapAt = 4;
    // A float bobs by itself (so its path can be read ahead).
    class Cork extends Shot {
      update(dt, box2) {
        super.update(dt, box2);
        if (this.age > this.warn) this.y = this.row + Math.sin((this.age - this.warn) * 4.4 + this.phase) * 15;
      }
    }
    return {
      duration: 7.2,
      update: (dt, bullets, soul) => {
        t += dt;
        if (made === 0 && lines < 3 && t >= 0.2 + lines * 2.2) {
          base = lines === 0 ? soul.y : soul.y + (lines === 1 ? 12 : -12);
          base = clamp(base, box.y + 18, box.y + box.h - 18);
          lineShift = rand(0, 6.28);
          gapAt = 2 + Math.floor(rand(0, 4));
          made = 1;
          lines++;
          next = t;
        }
        if (made > 0 && t >= next) {
          next = t + 0.21;
          // Each float's bob starts when it comes in, so the line rolls like a wave.
          // A second line rides the mirror row on the other side of the box.
          // A gap in each line (two floats missing) is the way through.
          for (const row of (made >= gapAt && made <= gapAt + 2) ? [] : [base, box.y * 2 + box.h - base]) {
            const f = new Cork({ x: box.x + box.w + 5, y: row, vx: -48, warn: 0.15, art: 'netFloat', life: 3.6 });
            f.row = row;
            f.phase = made * 0.9 + lineShift;
            bullets.push(f);
          }
          made++;
          if (made > 9) made = 0;
        }
      },
    };
  },

  // Hooks: a hook is let down on a fishing line onto your column (a glint at the
  // top shows where), stops at about your depth, hangs a beat, then is jerked
  // back up much faster. Six hooks.
  netHooks(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let hooks = 0;
    let next = 0.2;
    let live = [];
    const heading = { x: 0 };
    let lastX = null;
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (lastX !== null && dt > 0) heading.x = heading.x * 0.85 + ((soul.x - lastX) / dt) * 0.15;
        lastX = soul.x;
        if (t >= next && hooks < 6 && t < 6.4) {
          next = t + 1.1;
          const x = clamp(soul.x + rand(-4, 4), box.x + 6, box.x + box.w - 6);
          const depth = clamp(soul.y + rand(-8, 14), box.y + 26, box.y + box.h - 8);
          const warn = 0.7;
          const glint = new Shot({ x, y: box.y + 4, harmless: true, life: warn, art: 'netGlint' });
          bullets.push(glint);
          const hook = new Shot({ x, y: box.y - 6, vy: 0, warn, art: 'netHook', life: 3 });
          hook.glint = glint;
          hook.depth = depth;
          hook.state = 'fall';
          hook.bead = 0;
          live.push(hook);
          bullets.push(hook);
          hooks++;
        }
        for (const h of live) {
          // The hook lines up on your column (a little ahead of you) until the last moment.
          if (h.age < h.warn - 0.15) {
            h.x = clamp(soul.x + heading.x * 0.5, box.x + 6, box.x + box.w - 6);
            h.glint.x = h.x;
          }
          if (h.age < h.warn) continue;
          h.bead -= dt;
          if (h.bead <= 0 && h.state !== 'done') {
            h.bead = 0.05;
            bullets.push(new Shot({ x: h.x, y: h.y - 4, harmless: true, life: 0.7, art: 'netThread' }));
          }
          if (h.state === 'fall') {
            h.vy = 150;
            if (h.y >= h.depth) { h.state = 'hang'; h.vy = 0; h.hung = h.age; }
          } else if (h.state === 'hang') {
            if (h.age - h.hung > 0.4) { h.state = 'rise'; h.vy = -200; }
          } else if (h.state === 'rise' && h.y < box.y - 10) {
            h.state = 'done';
            h.vy = 0;
            h.life = h.age - h.warn;
          }
        }
        live = live.filter((h) => h.state !== 'done');
      },
    };
  },

  // Curtain: the net is let fall over the box like a sheet: rows of knots
  // drifting down, with a hole torn in it two columns wide, a good way from
  // where you stand. Three curtains, one after the other.
  netCurtain(box, density, { Shot, rand, clamp }) {
    let t = 0;
    let sheets = 0;
    const COLS = 8;
    return {
      duration: 8.2,
      update: (dt, bullets, soul) => {
        t += dt;
        if (sheets < 3 && t >= 0.2 + sheets * 1.9) {
          const colW = box.w / COLS;
          const want = clamp(soul.x + (Math.random() < 0.5 ? -1 : 1) * rand(16, 30), box.x + 12, box.x + box.w - 12);
          const gap = Math.round((want - box.x) / colW - 0.5);
          for (let row = 0; row < 3; row++) {
            for (let c = 0; c < COLS; c++) {
              if (c === gap || c === Math.min(COLS - 1, gap + 1)) continue;
              const x = box.x + colW * (c + 0.5) + (row % 2 ? colW / 2 : 0);
              if (x > box.x + box.w + 2) continue;
              bullets.push(new Shot({ x, y: box.y - 4 - row * 8, vy: 50, warn: 0.5, art: 'netKnot', life: 4 }));
            }
          }
          sheets++;
        }
      },
    };
  },
};

// Aimed shots on top, so standing still or running one way is never safe (see snipes.js).
NET_WRAITH_ATTACKS.netGrid = withSnipes(NET_WRAITH_ATTACKS.netGrid, { art: 'netKnot' });
NET_WRAITH_ATTACKS.netHooks = withSnipes(NET_WRAITH_ATTACKS.netHooks, { art: 'netKnot', count: 6, first: 0.6, every: 0.9, lead: [0.4, 'mean', 0, 0.9, 'mean', 0.2], until: 5.8, speed: 66, fan: 3 });
NET_WRAITH_ATTACKS.netCurtain = withSnipes(NET_WRAITH_ATTACKS.netCurtain, { art: 'netKnot', count: 4, first: 1.0, every: 1.2, lead: 0.8 });
