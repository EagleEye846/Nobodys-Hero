// Spell effects in battle: short bursts drawn over the stage while a spell's
// words are up, each in its own spell's colours. Heals send motes rising off
// whoever's healed; Rend slashes, Spark crackles, Starfall rains stars, a
// Comet streaks in and hits; Ember Flare sets every enemy smouldering; Chain
// Bolt jumps foe to foe; Siphon draws a stream of light back to you. Ward,
// SHELTER and COVER close a shell (or an umbrella, or a coat) over the party;
// the calming spells ripple and snow. And Nova: everything goes white.
//
// Each effect is a few numbers (where, how long, a seed); every frame works
// its specks out from those, so nothing is kept per speck. Stage effects are
// drawn in stage pixels, on 2-pixel squares like the sprites; the white-out
// covers the whole screen. See BattleScene.spellFx and allyFx.

// The stage, in stage pixels (UI_WIDTH / UI_SCALE wide, hud.STAGE_HEIGHT tall).
const STAGE_W = 320;
const STAGE_H = 164;
const PX = 2;

// How long each kind lasts, in seconds.
const LIFE = {
  heal: 1.3, aurora: 1.8, wind: 1.3,
  slash: 0.55, spark: 0.6, starfall: 1.1, comet: 1.0, embers: 1.2, chain: 0.8, siphon: 1.2, pebble: 0.7,
  snow: 1.5, downdraft: 0.9,
  shell: 1.5, calm: 1.5, shout: 0.9, leaves: 1.1,
  nova: 2.8,
};

// The white-out: up fast, held, then a slow fade (seconds into the Nova).
const NOVA_UP = 0.18;
const NOVA_HOLD = 0.75;
const NOVA_END = 2.6;
// When a Comet (or a falling log) lands, and when the Nova bursts: the stage shakes then.
const IMPACT = { comet: 0.34, nova: 0.18 };

const COLORS = {
  heal: ['#7dff9a', '#3ee08f', '#ffe14d', '#ffffff'],
  aurora: ['#7dff9a', '#4fe3d0', '#b07cff', '#ffffff'],
  wind: ['#ffe9a0', '#ffd25e', '#fff6dc'],
  slash: ['#ffffff', '#ff5470'],
  chop: ['#ffffff', '#ff8c1a'],
  spark: ['#ffffff', '#fff2a0', '#7fd0ff'],
  star: ['#fff6dc', '#ffe14d', '#ffd25e'],
  comet: ['#ffffff', '#fff2a0', '#ff8c1a', '#ff5470'],
  log: ['#c08a4e', '#7a4f2a', '#5a3a1e', '#e0b888'],
  team: ['#ffffff', '#ffe14d', '#4fe3d0', '#b07cff'],
  ember: ['#ffd25e', '#ff8c1a', '#ff5470', '#fff2a0'],
  bolt: ['#ffffff', '#bfe8ff', '#7fd0ff'],
  siphon: ['#ff5470', '#ff8ca0', '#7dff9a', '#3ee08f'],
  snow: ['#ffffff', '#e6f6ff', '#bfe8ff'],
  ward: ['#ffe9a0', '#ffd25e', '#ffffff'],
  umbrella: ['#7a3a5e', '#a8608a', '#5a2846', '#e0aa48'],
  coat: ['#3e4f8e', '#5a6cb0', '#2c3868', '#f4ecdc'],
  calm: ['#ffe14d', '#fff6b0', '#ffffff'],
  shout: ['#ff8c1a', '#ffe14d', '#ffffff'],
  leaves: ['#b81e30', '#e0383e', '#ff8c1a', '#8a1426'],
};

// A steady 0-1 number for speck `i` of an effect (and a `salt` for each thing about it).
function rand(seed, i, salt = 0) {
  let n = (seed * 374761393 + i * 668265263 + salt * 2246822519) >>> 0;
  n = Math.imul(n ^ (n >>> 13), 1274126177) >>> 0;
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

function square(ctx, x, y, color, size = PX) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x / PX) * PX, Math.round(y / PX) * PX, size, size);
}

// A line of squares from a to b, `upTo` (0-1) of the way along.
function streak(ctx, ax, ay, bx, by, color, upTo = 1, size = PX) {
  const steps = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / PX));
  const last = Math.floor(steps * Math.max(0, Math.min(1, upTo)));
  for (let s = 0; s <= last; s++) square(ctx, ax + ((bx - ax) * s) / steps, ay + ((by - ay) * s) / steps, color, size);
}

// A ring of squares round (x, y), squashed a little like the stage's floor.
function ring(ctx, x, y, radius, color, squash = 0.6, gaps = 0) {
  const count = Math.max(8, Math.round(radius * 1.2));
  for (let i = 0; i < count; i++) {
    if (gaps && i % gaps === 0) continue;
    const a = (i / count) * Math.PI * 2;
    square(ctx, x + Math.cos(a) * radius, y + Math.sin(a) * radius * squash, color);
  }
}

// A little plus sign: a heal's sparkle, or a star.
function plus(ctx, x, y, color, arm = 1) {
  for (let k = -arm; k <= arm; k++) {
    square(ctx, x + k * PX, y, color);
    square(ctx, x, y + k * PX, color);
  }
}

const fade = (t, life, tail = 0.35) => Math.max(0, Math.min(1, (life - t) / (life * tail)));

const DRAW = {
  // Motes rising round them, a ring of light at their feet, a few sparkles.
  heal(ctx, e) {
    const c = e.colors ?? COLORS.heal;
    const alpha = fade(e.t, e.life);
    ctx.globalAlpha = alpha * Math.max(0, 1 - e.t / 0.7);
    ring(ctx, e.x, e.y + e.h / 2 - 2, 6 + e.t * 34, c[0], 0.35);
    for (let i = 0; i < 18; i++) {
      const age = e.t - rand(e.seed, i) * 0.55;
      if (age < 0 || age > 0.85) continue;
      ctx.globalAlpha = alpha * (1 - age / 0.85);
      const x = e.x + (rand(e.seed, i, 1) - 0.5) * 30 + Math.sin(age * 7 + i) * 2;
      const y = e.y + e.h / 2 - 4 - age * 48;
      if (i % 5 === 0) plus(ctx, x, y, c[3]);
      else square(ctx, x, y, c[i % 3]);
    }
    ctx.globalAlpha = 1;
  },

  // Curtains of northern light over the party, then motes like a heal.
  aurora(ctx, e) {
    const alpha = fade(e.t, e.life);
    const c = COLORS.aurora;
    for (let b = 0; b < 9; b++) {
      const x = e.x - 40 + b * 10 + Math.sin(e.t * 2 + b) * 3;
      const top = 10 + Math.sin(e.t * 3 + b * 1.7) * 6;
      const len = 40 + rand(e.seed, b) * 30;
      for (let y = 0; y < len; y += PX) {
        ctx.globalAlpha = alpha * 0.55 * (1 - y / len) * Math.min(1, e.t / 0.3);
        square(ctx, x, top + y, c[(b + Math.floor(y / 12)) % 3]);
      }
    }
    DRAW.heal(ctx, { ...e, colors: c, t: Math.max(0, e.t - 0.3), life: e.life - 0.3 });
  },

  // A warm wind across the party: long gold streaks blowing through.
  wind(ctx, e) {
    const alpha = fade(e.t, e.life);
    const c = COLORS.wind;
    for (let i = 0; i < 10; i++) {
      const y = e.y - 30 + rand(e.seed, i) * 60;
      const head = -30 + ((e.t * 260 + rand(e.seed, i, 1) * 200) % 260);
      ctx.globalAlpha = alpha * 0.8;
      streak(ctx, head - 18, y + Math.sin(head / 14) * 3, head, y + Math.sin(head / 14 + 1) * 3, c[i % 3]);
    }
    ctx.globalAlpha = 1;
  },

  // Three slashes across the target, one after another.
  slash(ctx, e) {
    const c = e.colors ?? COLORS.slash;
    for (let k = 0; k < 3; k++) {
      const t = e.t - k * 0.07;
      if (t < 0) continue;
      ctx.globalAlpha = Math.max(0, 1 - t / 0.4);
      const off = (k - 1) * 9;
      const upTo = t / 0.09;
      streak(ctx, e.x - 26 + off, e.y - 22, e.x + 22 + off, e.y + 22, c[1], upTo, PX * 2);
      streak(ctx, e.x - 25 + off, e.y - 22, e.x + 23 + off, e.y + 22, c[0], upTo);
    }
    ctx.globalAlpha = 1;
  },

  // Crackling: jagged arcs out of the target, new ones every few frames.
  spark(ctx, e) {
    const c = COLORS.spark;
    const flick = Math.floor(e.t * 22);
    ctx.globalAlpha = fade(e.t, e.life, 0.5) * (flick % 3 === 0 ? 0.6 : 1);
    for (let b = 0; b < 6; b++) {
      let x = e.x;
      let y = e.y;
      const a = (b / 6) * Math.PI * 2 + rand(e.seed, b, flick) * 0.8;
      for (let s = 0; s < 4; s++) {
        const nx = x + Math.cos(a) * 7 + (rand(e.seed, b * 9 + s, flick + 1) - 0.5) * 8;
        const ny = y + Math.sin(a) * 7 + (rand(e.seed, b * 9 + s, flick + 2) - 0.5) * 8;
        streak(ctx, x, y, nx, ny, c[s === 0 ? 0 : 1 + (b % 2)]);
        x = nx;
        y = ny;
      }
    }
    ctx.globalAlpha = 1;
  },

  // Stars falling onto the target, each a little burst as it lands.
  starfall(ctx, e) {
    const c = COLORS.star;
    for (let i = 0; i < 8; i++) {
      const age = e.t - i * 0.08;
      if (age < 0) continue;
      const x = e.x + (rand(e.seed, i) - 0.5) * 50;
      const y0 = -10;
      const y1 = e.y + (rand(e.seed, i, 1) - 0.5) * 24;
      const fall = Math.min(1, age / 0.3);
      const y = y0 + (y1 - y0) * fall;
      const dx = (x - e.x) * 0.3 * (1 - fall);
      if (fall < 1) {
        for (let k = 1; k <= 3; k++) {
          ctx.globalAlpha = 0.5 / k;
          square(ctx, x + dx, y - k * 6, c[2]);
        }
        ctx.globalAlpha = 1;
        plus(ctx, x + dx, y, c[i % 2]);
      } else {
        const burst = age - 0.3;
        if (burst > 0.35) continue;
        ctx.globalAlpha = 1 - burst / 0.35;
        for (let k = 0; k < 4; k++) {
          const a = (k / 4) * Math.PI * 2 + Math.PI / 4;
          square(ctx, x + Math.cos(a) * burst * 40, y + Math.sin(a) * burst * 40, c[0]);
        }
        ctx.globalAlpha = 1;
      }
    }
  },

  // One great streak down onto the target, and the hit: a ring and a spray.
  // (With `colors: log` it's a felled tree coming down: TIMBER!)
  comet(ctx, e) {
    const c = e.colors ?? COLORS.comet;
    const land = IMPACT.comet;
    const sx = e.x - 130;
    const sy = -24;
    if (e.t < land) {
      const p = e.t / land;
      const hx = sx + (e.x - sx) * p;
      const hy = sy + (e.y - sy) * p;
      for (let k = 12; k >= 1; k--) {
        ctx.globalAlpha = (1 - k / 13) * 0.9;
        square(ctx, hx - (e.x - sx) * 0.012 * k * 4, hy - (e.y - sy) * 0.012 * k * 4, c[Math.min(3, 1 + Math.floor(k / 4))], PX * 2);
      }
      ctx.globalAlpha = 1;
      square(ctx, hx - PX * 2, hy - PX * 2, c[0], PX * 4);
      return;
    }
    const after = e.t - land;
    ctx.globalAlpha = Math.max(0, 1 - after / 0.5);
    ring(ctx, e.x, e.y, 6 + after * 90, c[1], 0.7);
    ring(ctx, e.x, e.y, 2 + after * 60, c[0], 0.7, 3);
    for (let i = 0; i < 14; i++) {
      const a = rand(e.seed, i) * Math.PI * 2;
      const d = after * (50 + rand(e.seed, i, 1) * 50);
      square(ctx, e.x + Math.cos(a) * d, e.y + Math.sin(a) * d * 0.7 + after * after * 60, c[2 + (i % 2)]);
    }
    ctx.globalAlpha = 1;
  },

  // A pebble looping in from the side, and a puff where it hits.
  pebble(ctx, e) {
    const land = 0.25;
    if (e.t < land) {
      const p = e.t / land;
      square(ctx, 70 + (e.x - 70) * p, 110 + (e.y - 110) * p - Math.sin(p * Math.PI) * 30, '#8a8296', PX * 2);
      return;
    }
    const after = e.t - land;
    ctx.globalAlpha = Math.max(0, 1 - after / 0.4);
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2;
      square(ctx, e.x + Math.cos(a) * after * 50, e.y + Math.sin(a) * after * 35, '#ffffff');
    }
    ctx.globalAlpha = 1;
  },

  // Embers on every enemy: a flare at the start, then sparks drifting up.
  embers(ctx, e) {
    const c = COLORS.ember;
    for (let p = 0; p < e.points.length; p++) {
      const { x, y } = e.points[p];
      ctx.globalAlpha = Math.max(0, 1 - e.t / 0.35);
      ring(ctx, x, y, 4 + e.t * 50, c[1], 0.7);
      for (let i = 0; i < 22; i++) {
        const age = e.t - rand(e.seed, p * 31 + i) * 0.6;
        if (age < 0 || age > 0.75) continue;
        ctx.globalAlpha = (1 - age / 0.75) * (Math.floor((e.t + i) * 18) % 4 ? 1 : 0.5);
        square(ctx, x + (rand(e.seed, p * 31 + i, 1) - 0.5) * 38 + Math.sin(age * 9 + i) * 3, y + 16 - age * 64, c[i % 4], i % 3 ? PX : PX * 2);
      }
    }
    ctx.globalAlpha = 1;
  },

  // A bolt from you to the first enemy, then on to each of the rest.
  chain(ctx, e) {
    const c = COLORS.bolt;
    const flick = Math.floor(e.t * 24);
    for (let k = 0; k + 1 < e.points.length; k++) {
      const start = k * 0.12;
      const age = e.t - start;
      if (age < 0) continue;
      ctx.globalAlpha = Math.max(0, 1 - age / 0.5) * (flick % 3 === 0 ? 0.55 : 1);
      const a = e.points[k];
      const b = e.points[k + 1];
      let px = a.x;
      let py = a.y;
      const reach = Math.min(1, age / 0.08);
      const joints = 6;
      for (let j = 1; j <= joints; j++) {
        const f = (j / joints) * reach;
        const jit = j === joints ? 0 : (rand(e.seed, k * 17 + j, flick) - 0.5) * 16;
        const nx = a.x + (b.x - a.x) * f;
        const ny = a.y + (b.y - a.y) * f + jit;
        streak(ctx, px, py, nx, ny, c[1], 1, PX * 2);
        streak(ctx, px, py, nx, ny, c[0]);
        px = nx;
        py = ny;
      }
    }
    ctx.globalAlpha = 1;
  },

  // A stream of motes from the enemy back to you, red turning green.
  siphon(ctx, e) {
    const c = COLORS.siphon;
    for (let i = 0; i < 18; i++) {
      const age = e.t - rand(e.seed, i) * 0.6;
      if (age < 0 || age > 0.55) continue;
      const p = age / 0.55;
      const cx = (e.x + e.to.x) / 2;
      const cy = Math.min(e.y, e.to.y) - 40 + (rand(e.seed, i, 1) - 0.5) * 30;
      const x = (1 - p) * (1 - p) * e.x + 2 * (1 - p) * p * cx + p * p * e.to.x;
      const y = (1 - p) * (1 - p) * e.y + 2 * (1 - p) * p * cy + p * p * e.to.y;
      ctx.globalAlpha = p > 0.85 ? (1 - p) / 0.15 : 1;
      square(ctx, x, y, c[Math.min(3, Math.floor(p * 4))], PX * 2);
    }
    ctx.globalAlpha = 1;
  },

  // Snow across the whole stage: soft and slow (FLURRY, Hush), driving
  // sleet (SLEET), or a white-out, with the stage washed pale.
  snow(ctx, e) {
    const c = COLORS.snow;
    const style = e.style ?? 'flurry';
    const alpha = fade(e.t, e.life) * Math.min(1, e.t / 0.2);
    const count = style === 'whiteout' ? 70 : style === 'sleet' ? 40 : 30;
    const vx = style === 'flurry' ? 30 : 220;
    const vy = style === 'flurry' ? 40 : 160;
    if (style === 'whiteout') {
      ctx.globalAlpha = alpha * 0.45;
      ctx.fillStyle = '#e6f6ff';
      ctx.fillRect(0, 0, STAGE_W, STAGE_H);
    }
    for (let i = 0; i < count; i++) {
      const x = (rand(e.seed, i) * STAGE_W * 1.5 + e.t * vx) % (STAGE_W * 1.5) - STAGE_W * 0.25;
      const y = (rand(e.seed, i, 1) * STAGE_H + e.t * vy * (0.7 + rand(e.seed, i, 2) * 0.6)) % STAGE_H;
      ctx.globalAlpha = alpha * (0.5 + rand(e.seed, i, 3) * 0.5);
      if (style === 'flurry') square(ctx, x + Math.sin(e.t * 3 + i) * 4, y, c[i % 3]);
      else streak(ctx, x, y, x + vx * 0.03, y + vy * 0.03, c[i % 3]);
    }
    ctx.globalAlpha = 1;
  },

  // Wind slamming straight down onto the target, and the dust kicked up.
  downdraft(ctx, e) {
    const c = COLORS.snow;
    for (let i = 0; i < 9; i++) {
      const x = e.x - 28 + i * 7;
      const age = e.t - rand(e.seed, i) * 0.2;
      if (age < 0) continue;
      const head = Math.min(e.y + 20, -10 + age * 600);
      ctx.globalAlpha = Math.max(0, 1 - age / 0.5);
      streak(ctx, x, head - 30, x, head, c[i % 3]);
    }
    const hit = e.t - 0.2;
    if (hit > 0) {
      ctx.globalAlpha = Math.max(0, 1 - hit / 0.5);
      ring(ctx, e.x, e.y + 20, 8 + hit * 80, c[0], 0.3);
    }
    ctx.globalAlpha = 1;
  },

  // Something closing over the party: a bubble of light (Bright Ward), or a
  // canopy over their heads, Ves's umbrella (SHELTER) or her coat (COVER).
  // `top` is the top of the tallest of them.
  shell(ctx, e) {
    const style = e.style ?? 'ward';
    const c = COLORS[style];
    const grow = Math.min(1, e.t / 0.22);
    const alpha = fade(e.t, e.life, 0.4);
    if (style === 'ward') {
      ctx.globalAlpha = alpha * (0.75 + 0.25 * Math.sin(e.t * 12));
      ring(ctx, e.x, e.y, 40 * grow, c[0], 1.05);
      ring(ctx, e.x, e.y, 36 * grow, c[1], 1.05, 3);
      const s = e.t * 3;
      ctx.globalAlpha = alpha;
      for (let k = 0; k < 3; k++) plus(ctx, e.x + Math.cos(s + k * 2.1) * 40 * grow, e.y + Math.sin(s + k * 2.1) * 42 * grow, c[2]);
      ctx.globalAlpha = 1;
      return;
    }
    // The canopy: a dome over them, lit along its top, scalloped at its rim.
    const rx = 38 * grow;
    const ry = 15 * grow;
    const apexY = (e.top ?? e.y - 30) - 16;
    const rimY = apexY + ry;
    ctx.globalAlpha = alpha * 0.92;
    for (let y = 0; y <= ry; y += PX) {
      const half = rx * Math.sqrt(1 - ((ry - y) / Math.max(1, ry)) ** 2);
      for (let x = -half; x <= half; x += PX) {
        const scallop = y >= ry - PX && Math.floor((x + rx) / 10) % 2 === 1;
        if (scallop) continue;
        square(ctx, e.x + x, apexY + y, y < ry * 0.35 ? c[1] : c[0]);
      }
    }
    if (style === 'umbrella') {
      // Its ribs, out from the tip, and the patch; the shaft down to her hand.
      for (let k = -2; k <= 2; k++) streak(ctx, e.x, apexY, e.x + k * rx * 0.45, rimY - PX, c[2]);
      square(ctx, e.x - rx * 0.3, apexY + ry * 0.45, c[3], PX * 2);
      streak(ctx, e.x, apexY - PX * 2, e.x, rimY + 22, c[2]);
      square(ctx, e.x, apexY - PX * 3, c[2]);
    } else {
      // The coat's cream lining showing at its edge.
      streak(ctx, e.x - rx * 0.9, rimY - PX, e.x + rx * 0.9, rimY - PX, c[3]);
    }
    ctx.globalAlpha = 1;
  },

  // Soft rings going out from the enemy, and a little snow over it.
  calm(ctx, e) {
    const c = COLORS.calm;
    const alpha = fade(e.t, e.life);
    for (let k = 0; k < 3; k++) {
      const t = e.t - k * 0.25;
      if (t < 0 || t > 0.9) continue;
      ctx.globalAlpha = alpha * (1 - t / 0.9);
      ring(ctx, e.x, e.y, 6 + t * 46, c[k % 2], 0.55, 2);
    }
    for (let i = 0; i < 12; i++) {
      const age = e.t - rand(e.seed, i) * 0.7;
      if (age < 0 || age > 0.8) continue;
      ctx.globalAlpha = alpha * (1 - age / 0.8);
      const x = e.x + (rand(e.seed, i, 1) - 0.5) * 60 + Math.sin(age * 4 + i) * 3;
      const y = e.y - 40 + age * 40;
      if (e.style === 'pacify' && i % 3 === 0) plus(ctx, x, y, c[2]);
      else square(ctx, x, y, c[2]);
    }
    ctx.globalAlpha = 1;
  },

  // A shout: arcs going out from them towards the enemies.
  shout(ctx, e) {
    const c = COLORS.shout;
    for (let k = 0; k < 3; k++) {
      const t = e.t - k * 0.12;
      if (t < 0 || t > 0.6) continue;
      ctx.globalAlpha = 1 - t / 0.6;
      const r = 10 + t * 120;
      for (let i = -4; i <= 4; i++) {
        const a = (i / 4) * 0.7;
        square(ctx, e.x + Math.cos(a) * r, e.y + Math.sin(a) * r * 0.8, c[k % 3]);
      }
    }
    ctx.globalAlpha = 1;
  },

  // Leaves whirling round them as they duck out of sight.
  leaves(ctx, e) {
    const c = COLORS.leaves;
    const alpha = fade(e.t, e.life);
    for (let i = 0; i < 14; i++) {
      const a = rand(e.seed, i) * Math.PI * 2 + e.t * (5 + rand(e.seed, i, 1) * 3);
      const r = 10 + rand(e.seed, i, 2) * 14;
      ctx.globalAlpha = alpha;
      const x = e.x + Math.cos(a) * r;
      const y = e.y + Math.sin(a) * r * 0.6 - e.t * 10;
      square(ctx, x, y, c[i % 4]);
      square(ctx, x + PX, y, c[(i + 1) % 4]);
    }
    ctx.globalAlpha = 1;
  },

  // The Nova's heart on the target: a white core swelling, then (once the
  // white goes) a last ring of light and sparkles going out from it.
  nova(ctx, e) {
    if (e.t < NOVA_HOLD) {
      const r = Math.min(1, e.t / NOVA_UP) * 70;
      for (let k = 0; k < 4; k++) ring(ctx, e.x, e.y, r * (1 - k * 0.2), '#ffffff', 0.85);
      return;
    }
    const after = e.t - NOVA_HOLD;
    ctx.globalAlpha = Math.max(0, 1 - after / 1.3);
    ring(ctx, e.x, e.y, 20 + after * 120, '#fff6dc', 0.8);
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      plus(ctx, e.x + Math.cos(a) * (14 + after * 70), e.y + Math.sin(a) * (14 + after * 55), i % 2 ? '#ffe14d' : '#ffffff', 1);
    }
    ctx.globalAlpha = 1;
  },
};

export class SpellEffects {
  constructor() {
    this.effects = [];
  }

  // A new effect: `kind` (a key of DRAW), `at` (x, y in stage pixels; and
  // `h` for a person, `to` for Siphon, `points` for the ones on several).
  add(kind, at = {}) {
    this.effects.push({ kind, x: 0, y: 0, h: 0, ...at, t: 0, life: LIFE[kind] ?? 1, seed: Math.floor(Math.random() * 1e6) });
  }

  // Moves them on. True when one has just landed hard enough to shake the stage.
  update(dt) {
    let impact = false;
    for (let i = this.effects.length - 1; i >= 0; i--) {
      const e = this.effects[i];
      const at = IMPACT[e.style === 'log' ? 'comet' : e.kind];
      if (at !== undefined && e.t < at && e.t + dt >= at) impact = true;
      e.t += dt;
      if (e.t >= e.life) this.effects.splice(i, 1);
    }
    return impact;
  }

  get busy() {
    return this.effects.length > 0;
  }

  // Over the stage (in stage pixels, shaking with it).
  drawStage(ctx) {
    ctx.save();
    for (const e of this.effects) DRAW[e.kind]?.(ctx, e);
    ctx.restore();
  }

  // Over everything: Nova's white-out.
  drawScreen(ctx) {
    let white = 0;
    for (const e of this.effects) {
      if (e.kind !== 'nova') continue;
      const w = e.t < NOVA_UP ? e.t / NOVA_UP : e.t < NOVA_HOLD ? 1 : Math.max(0, 1 - (e.t - NOVA_HOLD) / (NOVA_END - NOVA_HOLD));
      white = Math.max(white, w);
    }
    if (white <= 0) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = `rgba(255, 255, 255, ${white.toFixed(3)})`;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.restore();
  }
}
