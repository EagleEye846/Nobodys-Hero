import { defineBulletArt, Shot } from '../projectiles.js';
import { Pix, art } from '../../data/art/ch5Kit.js';
import { Deco } from './coastKit.js';

// The Echo Bat-Shrimp's attacks. A shrimp with no eyes that finds the world
// by clicking at it and listening to what comes back:
//   - Sound rings: it clicks and a ring of sound spreads out, with a gap in
//     it toward you. The nearest wall of the box throws it back, and the
//     answer comes off the wall with its own gap, pointed at where you are
//     by then, give or take.
//   - Echoes: it calls a shape of chits (a fan at where you are, a ring of
//     them, a row), and a beat later the shape comes back, fainter, the
//     same shape from the same spot (the fan from the far side). It
//     remembers where you were, not where you are.
//   - Click volley: it clicks on a steady beat, with rests, and every click
//     flings a row of tiny shrimp through the box with one lane left open.
//     The open lanes go round in a loop; learn the loop and the beat.
// It curls to the right of the box.
//
// Timing: a pattern's update is handed dt scaled by the enemy's density,
// so every attack here divides it back out and counts real seconds.
// Bullet speeds on shots are scaled by the enemy's speed (bullets.js).

const SOUND = { c: '#8ff6ff', C: '#3cc4dc', w: '#ffffff', k: '#18203a' };
const FAINT = { c: '#c2aae0', C: '#8a70b8', w: '#e8dcf8', k: '#18203a' };
const SHELL = { b: '#dce8f0', B: '#a4bcd0', p: '#f4e2ea', m: '#c2aae0', M: '#8a70b8', c: '#8ff6ff', w: '#ffffff', k: '#18203a' };

const CHEVRON = [
  ['.cC.....', '..cC....', '...cCw..', '....cCw.', '...cCw..', '..cC....', '.cC.....'],
  ['..cC....', '...cC...', '....cCw.', '.....cCw', '....cCw.', '...cC...', '..cC....'],
];
// A chit of sound: a pale chevron, pointing the way it goes.
defineBulletArt('shrDart', { frames: CHEVRON, palette: SOUND, radius: 2.8, rotate: true, frameSeconds: 0.1 });
// Its echo, fainter and lilac.
defineBulletArt('shrEchoDart', { frames: CHEVRON, palette: FAINT, radius: 2.8, rotate: true, frameSeconds: 0.1 });

// A tiny shrimp, curled, with its ears up: the click volley's ammunition.
function krill(wag) {
  const g = new Pix(13, 10);
  g.ellipse(9, 4.5, 2.6, 2.3, 'b');
  g.ellipse(6.4, 4.2, 2.3, 2.2, 'b');
  g.ellipse(4, 5.2, 2, 1.9, 'b');
  g.ellipse(2, 6.8, 1.6, 1.5, 'B');
  g.ellipse(9, 6.2, 1.8, 0.9, 'p');
  g.poly([[8, 3], [9, 0], [10.5, 3]], 'm');
  g.poly([[6, 3], [6.4, 0.5], [8, 3]], 'm');
  g.set(9, 1.5, 'M');
  g.line(0.5, 8 + wag, 0, 9 + wag, 'B');
  g.line(2.5, 8, 3, 9 - wag, 'B');
  g.line(11, 5, 12, 6, 'B');
  g.set(11, 4, 'c');
  g.outline('k');
  return g.rows();
}
defineBulletArt('shrKrill', { frames: [krill(0), krill(1)], palette: SHELL, radius: 3, rotate: true, frameSeconds: 0.12 });

// A pulse of the beat (harmless): a ring that pops at the shrimp's side.
defineBulletArt('shrBeat', {
  frames: [art(5, 5, (p) => { p.ring(2, 2, 2, 2, 'c', 1); }), art(5, 5, (p) => { p.set(2, 2, 'w'); })],
  palette: SOUND,
  radius: 1,
  frameSeconds: 0.2,
});

const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

// A ring of sound that bounces off the nearest wall of the box. The bounce is the same ring spreading from
// the origin's mirror image on the far side of that wall, and it shows up inside the box once it has
// crossed the wall. Each has a gap: the first is turned toward where you were when it clicked, the bounce
// toward where you are when it comes off the wall, but turned a little to one side either way: a still soul is never quite in the gap, a small step puts it there.
class BounceRing {
  constructor({ x, y, box, soul, grow = 46, thick = 2.2, life = 3.4, warn = 0.7, gap, jitter = 0.7 }) {
    const L = box.x;
    const R = box.x + box.w;
    const T = box.y;
    const B = box.y + box.h;
    this.box = { x: L, y: T, w: box.w, h: box.h };
    this.soul = soul;
    this.jitter = jitter;
    // The nearest wall, and the origin's image across it.
    const walls = [[x - L, { x: 2 * L - x, y }], [R - x, { x: 2 * R - x, y }], [y - T, { x, y: 2 * T - y }], [B - y, { x, y: 2 * B - y }]];
    walls.sort((a, b2) => a[0] - b2[0]);
    const [distance, image] = walls[0];
    this.images = [
      { x, y, angle: gap.angle, show: true },
      { x: image.x, y: image.y, angle: 0, show: false, reveal: distance + 2, bounced: true },
    ];
    this.gapWidth = gap.width;
    this.r = 3;
    this.grow = grow;
    this.thick = thick;
    this.life = life;
    this.warn = warn;
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
  }

  get active() {
    return this.age >= this.warn && this.age < this.warn + this.life;
  }

  update(dt) {
    this.age += dt;
    if (this.age >= this.warn) this.r = Math.max(0, this.r + this.grow * dt);
    for (const im of this.images) {
      if (!im.show && this.r >= im.reveal) {
        // It comes off the wall with its gap pointed at you, give or take.
        im.show = true;
        im.angle = Math.atan2(this.soul.y - im.y, this.soul.x - im.x) + (Math.random() < 0.5 ? -1 : 1) * (this.jitter + Math.random() * 0.45);
      }
    }
  }

  isGone() {
    return this.age >= this.warn + this.life + 0.25;
  }

  edgeDistance(px, py) {
    if (!this.active) return Infinity;
    let best = Infinity;
    for (const im of this.images) {
      if (!im.show) continue;
      const dx = px - im.x;
      const dy = py - im.y;
      if (Math.abs(wrap(Math.atan2(dy, dx) - im.angle)) < this.gapWidth / 2) continue;
      best = Math.min(best, Math.abs(Math.hypot(dx, dy) - this.r) - this.thick / 2);
    }
    return best;
  }

  draw(ctx) {
    const b = this.box;
    ctx.save();
    ctx.beginPath();
    ctx.rect(b.x, b.y, b.w, b.h);
    ctx.clip();
    const over = this.age - (this.warn + this.life);
    const fade = over > 0 ? Math.max(0, 1 - over / 0.25) : 1;
    const warning = this.age < this.warn;
    ctx.lineCap = 'butt';
    for (const im of this.images) {
      if (!im.show) continue;
      const rr = Math.max(this.r, 3);
      ctx.globalAlpha = (warning ? (Math.floor(this.age * 10) % 2 ? 0.25 : 0.55) : im.bounced ? 0.8 : 1) * fade;
      ctx.strokeStyle = im.bounced ? '#6fdcf0' : '#8ff6ff';
      if (!warning) { ctx.shadowColor = '#3cc4dc'; ctx.shadowBlur = 5; }
      ctx.lineWidth = warning ? 1 : this.thick;
      if (warning) ctx.setLineDash([2, 2]);
      ctx.beginPath();
      const half = this.gapWidth / 2;
      ctx.arc(im.x, im.y, rr, im.angle + half, im.angle - half + Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }
}

export const ECHO_SHRIMP_ATTACKS = {
  // Sound rings. Four clicks, a beat and a half apart, from places that are not on you. Each
  // ring has a gap pointed at where you were when it clicked, and the walls turn it back on you
  // from the sides: look for the gap in the answer, too.
  shrimpRings(box, density, { rand }) {
    let real = 0;
    let n = 0;
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (n < 4 && real >= 0.2 + n * 1.75) {
          n++;
          let x;
          let y;
          let tries = 0;
          do {
            x = rand(box.x + 12, box.x + box.w - 12);
            y = rand(box.y + 12, box.y + box.h - 12);
            tries++;
          } while (tries < 40 && Math.hypot(x - soul.x, y - soul.y) < 26);
          const toward = Math.atan2(soul.y - y, soul.x - x) + (Math.random() < 0.5 ? -1 : 1) * rand(0.8, 1.25);
          bullets.push(new BounceRing({ x, y, box, soul, grow: 44, warn: 0.75, gap: { angle: toward, width: 1.8 }, jitter: 0.8 }));
          bullets.push(new Shot({ x, y, art: 'shrBeat', harmless: true, warn: 0, life: 0.75 }));
        }
      },
    };
  },

  // Echoes. It calls out a shape of chits and, a beat later, the very same shape comes back,
  // fainter: from the same spot, the same angles (the fan comes from the far side instead, as
  // a wall would send it). Three calls: a fan at you, a ring of them, a row falling with a gap.
  // The echo is the call over again, so what you learned dodging it is what you do next.
  shrimpEcho(box, density, { rand }) {
    let real = 0;
    const queue = [];
    const calls = [0.3, 3.0, 5.6];
    let made = 0;
    const EDGE = 8;
    // A call: its darts, set to fly at `at`; the echo copies it a beat later, fainter.
    const send = (shots, at, echo) => queue.push({ at, shots, echo });
    return {
      duration: 8.6,
      update: (dt, bullets, soul) => {
        real += dt / density;
        if (made < calls.length && real >= calls[made]) {
          const which = made++;
          const shots = [];
          if (which === 0) {
            // A fan at where you are (the spot is kept), from the shrimp's side. Its echo is the same
            // fan from the far wall, aimed at the same spot.
            const spot = { x: soul.x, y: soul.y };
            const fan = (ox) => {
              const oy = rand(box.y + 20, box.y + box.h - 20);
              const aim = Math.atan2(spot.y - oy, spot.x - ox);
              const out = [];
              for (let i = -3; i <= 3; i++) {
                const a = aim + i * 0.19;
                out.push({ x: ox, y: oy, vx: Math.cos(a) * 64, vy: Math.sin(a) * 64 });
              }
              return out;
            };
            send(fan(box.x + box.w + EDGE), real, false);
            send(fan(box.x - EDGE), real + 1.1, true);
          } else if (which === 1) {
            // A ring of chits spreading from a point in the box.
            const ox = rand(box.x + 22, box.x + box.w - 22);
            const oy = rand(box.y + 22, box.y + box.h - 22);
            const turn = rand(0, Math.PI * 2);
            for (let i = 0; i < 10; i++) {
              const a = turn + (i / 10) * Math.PI * 2;
              shots.push({ x: ox, y: oy, vx: Math.cos(a) * 40, vy: Math.sin(a) * 40 });
            }
            send(shots, real, false);
            send(shots, real + 1.1, true);
          } else {
            // A row falling from the roof with one lane open, where you stand; the echo rises from the floor.
            const lanes = 7;
            const open = Math.min(lanes - 1, Math.max(0, Math.floor(((soul.x - box.x) / box.w) * lanes)));
            const down = [];
            const up = [];
            for (let i = 0; i < lanes; i++) {
              if (i === open) continue;
              const x = box.x + (box.w / lanes) * (i + 0.5);
              down.push({ x, y: box.y - EDGE, vx: 0, vy: 62 });
              up.push({ x, y: box.y + box.h + EDGE, vx: 0, vy: -62 });
            }
            send(down, real, false);
            send(up, real + 1.1, true);
          }
        }
        for (let i = queue.length - 1; i >= 0; i--) {
          const call = queue[i];
          if (real < call.at) continue;
          queue.splice(i, 1);
          for (const s of call.shots) {
            bullets.push(new Shot({
              x: s.x, y: s.y, vx: s.vx, vy: s.vy, art: call.echo ? 'shrEchoDart' : 'shrDart', warn: call.echo ? 0.45 : 0.5,
            }));
          }
        }
      },
    };
  },

  // Click volley. A steady beat with rests in it (click, rest, click, click, rest, click). Each
  // click flings a row of tiny shrimp from the right, one lane of the four left open, and the
  // open lanes go round in the same loop: 2, 0, 3, 1, 2. Count the beat, learn the lanes.
  shrimpClicks(box, density) {
    const BEAT = 0.5;
    const RHYTHM = ['x', '.', 'x', 'x', '.', 'x', '.', 'x'];
    const LANES = [2, 0, 3, 1, 2];
    const COUNT = 4;
    let real = 0;
    let step = 0;
    let click = 0;
    return {
      duration: 8.6,
      update: (dt, bullets) => {
        real += dt / density;
        while (step < 17 && real >= 0.3 + step * BEAT) {
          const beat = RHYTHM[step % RHYTHM.length];
          // The metronome: the shrimp's click, shown at the wall on every beat, even the rests.
          bullets.push(new Deco({
            x: box.x + box.w + 7, y: box.y + box.h / 2, life: 0.22,
            paint: (ctx, d) => {
              const k = d.age / 0.22;
              ctx.strokeStyle = beat === 'x' ? '#8ff6ff' : '#8a70b8';
              ctx.globalAlpha *= 0.9 - k * 0.5;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.arc(d.x, d.y, 2 + k * (beat === 'x' ? 6 : 3), 0, Math.PI * 2);
              ctx.stroke();
            },
          }));
          if (beat === 'x') {
            const open = LANES[click % LANES.length];
            click++;
            for (let i = 0; i < COUNT; i++) {
              if (i === open) continue;
              const y = box.y + (box.h / COUNT) * (i + 0.5);
              bullets.push(new Shot({ x: box.x + box.w + 9, y, vx: -88, vy: 0, art: 'shrKrill', warn: 0.3 }));
            }
          }
          step++;
        }
      },
    };
  },
};
