import { defineBulletArt } from '../projectiles.js';
import { Ring, stillness } from './underShapes.js';
import { Deco } from './coastKit.js';

// The Gnawer's attacks. It's a blind, grey, mouse-ish thing with far too many
// teeth that has been down in the Deep a very long time, and it has learned
// to hear everything:
//   - Teeth: rows of teeth close on each other like jaws, with one gap.
//   - Listening: chips of tooth thrown at wherever it last HEARD you.
//   - The floor: it gnaws up through the floor where you are.
//   - Teething: the box is its mouth. A tooth works loose, wobbles, and
//     shoots across, and a new one grows in. The wobbly one goes next.
//   - The scream: rings with gaps in them, and the walls scream back.
// Keep moving, keep quiet where you can, and don't stand where it last
// heard you.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape. The attack's own clock (`t`) runs `density`
// times faster than the seconds on the wall, hence the `T` below.

const TOOTH = { k: '#14100e', t: '#f0e4c0', T: '#c8b888', u: '#8c7c58', g: '#d8908c' };
const BONE = { k: '#14100e', b: '#e8dcc0', B: '#b8a888', d: '#8c7c58' };
const DUST = { d: '#7c7268', D: '#564e46', s: '#a49a8e' };
const SOUND = { w: '#f0e4c0', W: '#c8b888' };

// A tooth, pointing down (from the roof), and one pointing up (from the floor).
const TOOTH_ROWS = ['ktttttk', 'kttTTtk', 'kttTTtk', '.kttTtk', '..ktTk.', '..kuuk.', '...k...'];
defineBulletArt('gnawTooth', { frames: [TOOTH_ROWS], palette: TOOTH, hitbox: { w: 7, h: 7 } });
defineBulletArt('gnawToothUp', { frames: [[...TOOTH_ROWS].reverse()], palette: TOOTH, hitbox: { w: 7, h: 7 } });

// A chip of tooth, flung.
defineBulletArt('gnawChip', {
  frames: [['.tt', 'ttT', 'tT.', 'T..']],
  palette: TOOTH,
  radius: 1.9,
  rotate: true,
});

// Three little arcs: sound being made where you were (harmless).
defineBulletArt('gnawEar', {
  frames: [
    ['.w.w.', 'w.w.w', '.w.w.', 'w.w.w', '.w.w.'],
    ['..W..', '.W.W.', 'W.W.W', '.W.W.', '..W..'],
  ],
  palette: SOUND,
  radius: 1,
  frameSeconds: 0.12,
});

// A crack running along the floor (harmless): it's about to come through.
defineBulletArt('gnawCrack', {
  frames: [['dD.Dd.D.dD'], ['.dD.dD.Dd.']],
  palette: DUST,
  radius: 1,
  frameSeconds: 0.15,
});

// Crumbs of floor, flying.
defineBulletArt('gnawCrumb', {
  frames: [['dD', 'sd'], ['Dd', 'ds']],
  palette: DUST,
  radius: 1.4,
  frameSeconds: 0.1,
});

// A fang coming up through the floor: a tall, yellow tooth with a root.
defineBulletArt('gnawFang', {
  frames: [[
    '..k.k..', '.ktTtk.', '.ktTtk.', '.ktTtk.', '.ktTTk.', '.ktTTk.', '.ktTTk.', '.kTTTk.', '.kTTuk.', 'kkTTukk', 'kTTuuuk', 'kTuuuuk',
  ]],
  palette: TOOTH,
  hitbox: { w: 5, h: 12 },
});

// Bones. A long one, tumbling; a rib; a skull the size of a fist.
defineBulletArt('gnawBone', {
  frames: [['bb.....bb', 'bBbbbbbBb', 'bb.....bb']],
  palette: BONE,
  radius: 2.6,
  spin: 7,
});
defineBulletArt('gnawRib', {
  frames: [['.bbb.', 'b...B', 'b....', 'bB...', '.bbb.']],
  palette: BONE,
  radius: 2.4,
  spin: -5,
});
defineBulletArt('gnawSkull', {
  frames: [['.bbbbb.', 'bbbbbbb', 'bkbbbkb', 'bkbbbkb', '.bbkbb.', '.bBbBb.']],
  palette: BONE,
  radius: 3,
  spin: 3,
});

export const GNAWER_ATTACKS = {
  // Teeth: rows of teeth come in from the roof and the floor and close in
  // on each other, like jaws, three times. In each row one tooth is missing,
  // the same place top and bottom (a tooth and a half's worth): that's the gap to be in.
  gnawTeeth(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    const LANES = 8;
    const lane = box.w / LANES;
    let t = 0;
    let closes = 0;
    let next = 0.15;
    let cycles = [];
    let lastGap = -1;
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        const real = dt / density;
        if (closes < 3 && t >= next) {
          next = t + T(2.5);
          // The gap is never where you are, but never more than a short run
          // away either: from the far wall you couldn't make it in time.
          let gap;
          let tries = 0;
          const away = (i) => Math.abs(i + 0.5 - (soul.x - box.x) / lane);
          do gap = Math.floor(rand(0, LANES)); while (++tries < 60 && (gap === lastGap || away(gap) < 1.2 || away(gap) > 3));
          lastGap = gap;
          // The hole is a little wider on the side nearer the middle.
          const gap2 = gap < LANES / 2 ? gap + 1 : gap - 1;
          const mid = Math.max(box.y + 22, Math.min(box.y + box.h - 22, soul.y));
          const teeth = [];
          for (let i = 0; i < LANES; i++) {
            if (i === gap || i === gap2) continue;
            const x = box.x + lane * (i + 0.5);
            const top = new Shot({ x, y: box.y + 3.5, warn: 1.2, art: 'gnawTooth' });
            const bottom = new Shot({ x, y: box.y + box.h - 3.5, warn: 1.2, art: 'gnawToothUp' });
            teeth.push(top, bottom);
            bullets.push(top, bottom);
          }
          cycles.push({ teeth, mid, state: 'wait', hold: 0, bites: 0 });
          closes++;
        }
        for (const c of cycles) {
          const top = c.teeth.filter((_, i) => i % 2 === 0);
          const bottom = c.teeth.filter((_, i) => i % 2 === 1);
          if (c.teeth[0].age < c.teeth[0].warn) continue;
          if (c.state === 'wait' || c.state === 'closing') {
            c.state = 'closing';
            let done = true;
            for (const tooth of top) { tooth.y = Math.min(c.mid - 4.5, tooth.y + 150 * real); done = done && tooth.y >= c.mid - 4.5; }
            for (const tooth of bottom) tooth.y = Math.max(c.mid + 4.5, tooth.y - 150 * real);
            if (done) c.state = 'bite';
          } else if (c.state === 'bite') {
            // Chatter: open a little, shut, open, shut.
            c.hold += real;
            const open = Math.floor(c.hold * 5) % 2 === 0 ? 0 : 3;
            for (const tooth of top) tooth.y = c.mid - 4.5 - open;
            for (const tooth of bottom) tooth.y = c.mid + 4.5 + open;
            if (c.hold > 0.5) c.state = 'opening';
          } else {
            for (const tooth of top) tooth.y -= 80 * real;
            for (const tooth of bottom) tooth.y += 80 * real;
          }
        }
        cycles = cycles.filter((c) => !(c.state === 'opening' && c.teeth[0].y < box.y - 10));
      },
    };
  },

  // Listening: every time you move, it hears it, and a moment later chips of
  // tooth come spitting in from the edge, aimed at where it heard you. Keep
  // moving and they land behind you. Stand still and it hears your heart,
  // every so often, right where you are.
  gnawHear(box, density, { Shot, rand, clamp }) {
    const T = (s) => s * density;
    const still = stillness(14);
    let t = 0;
    let last = null;
    let nextNoise = 0.15;
    let nextBeat = 0.9;
    let heard = [];
    const spit = (bullets, at) => {
      // From whichever edge is furthest from the spot.
      const side = Math.random() < 0.5 ? -1 : 1;
      const from = { x: side < 0 ? box.x - 3 : box.x + box.w + 3, y: clamp(at.y + rand(-30, 30), box.y + 4, box.y + box.h - 4) };
      const aim = Math.atan2(at.y - from.y, at.x - from.x);
      for (let i = -1; i <= 1; i++) {
        bullets.push(new Shot({ x: from.x, y: from.y, warn: 0.15, vx: Math.cos(aim + i * 0.16) * 74, vy: Math.sin(aim + i * 0.16) * 74, art: 'gnawChip' }));
      }
    };
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        const stood = still(dt, soul);
        if (!last) last = { x: soul.x, y: soul.y };
        if (t < T(6.8) && t >= nextNoise && Math.hypot(soul.x - last.x, soul.y - last.y) > 7) {
          nextNoise = t + 0.4;
          last = { x: soul.x, y: soul.y };
          bullets.push(new Shot({ x: soul.x, y: soul.y, harmless: true, life: 0.45, art: 'gnawEar' }));
          heard.push({ at: { x: soul.x, y: soul.y }, when: t + 0.35 });
        }
        // Still: its own heartbeat gives you away.
        if (t < T(6.8) && stood > 0.5 && t >= nextBeat) {
          nextBeat = t + 0.75;
          bullets.push(new Shot({ x: soul.x, y: soul.y, harmless: true, life: 0.45, art: 'gnawEar' }));
          heard.push({ at: { x: soul.x, y: soul.y }, when: t + 0.3 });
        }
        for (const h of heard) {
          if (t < h.when) continue;
          h.done = true;
          spit(bullets, h.at);
        }
        heard = heard.filter((h) => !h.done);
      },
    };
  },

  // The floor: it gnaws up through the floor of the box. A crack runs along
  // the floor where it's coming, and then a fang bursts up out of it, taller
  // each time, with crumbs of floor flying. First under you, then either
  // side of you (twice), then under you again, and again, the biggest. A tooth comes down from
  // the roof over you each time too.
  gnawFloor(box, density, { Shot, rand, clamp }) {
    const T = (s) => s * density;
    const floor = box.y + box.h;
    let t = 0;
    let bites = 0;
    let next = 0.15;
    let fangs = [];
    let roofs = [];
    const HEIGHTS = [14, 22, 22, 28, 34];
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        const real = dt / density;
        if (bites < 5 && t >= next) {
          next = t + T(1.45);
          const xs = bites === 1 || bites === 2 ? [soul.x - 16, soul.x + 16, rand(box.x + 8, box.x + box.w - 8)] : [soul.x, rand(box.x + 8, box.x + box.w - 8)];
          const reach = HEIGHTS[bites];
          for (const x0 of xs) {
            const x = clamp(x0, box.x + 5, box.x + box.w - 5);
            bullets.push(new Shot({ x, y: floor - 1, harmless: true, life: 0.8, art: 'gnawCrack' }));
            const fang = new Shot({ x, y: floor + 8, warn: 0.8, art: 'gnawFang' });
            fangs.push({ fang, x, top: floor - reach + 6, state: 'up', hold: 0 });
            bullets.push(fang);
          }
          // And from the roof, over you: it's gnawing down as well.
          const cx = clamp(soul.x + rand(-6, 6), box.x + 5, box.x + box.w - 5);
          bullets.push(new Shot({ x: cx, y: box.y + 1, harmless: true, life: 0.8, art: 'gnawCrack' }));
          const tooth = new Shot({ x: cx, y: box.y - 8, warn: 0.8, art: 'gnawTooth' });
          roofs.push({ tooth, bottom: box.y + reach * 0.7, state: 'up', hold: 0 });
          bullets.push(tooth);
          bites++;
        }
        for (const f of roofs) {
          if (f.tooth.age < f.tooth.warn) continue;
          if (f.state === 'up') {
            f.tooth.y += 220 * real;
            if (f.tooth.y >= f.bottom) { f.tooth.y = f.bottom; f.state = 'held'; }
          } else if (f.state === 'held') {
            f.hold += real;
            if (f.hold > 0.5) f.state = 'down';
          } else {
            f.tooth.y -= 70 * real;
          }
        }
        roofs = roofs.filter((f) => !(f.state === 'down' && f.tooth.y < box.y - 12));
        for (const f of fangs) {
          if (f.fang.age < f.fang.warn) continue;
          if (f.state === 'up') {
            if (!f.burst) {
              f.burst = true;
              for (let i = 0; i < 7; i++) {
                bullets.push(new Shot({ x: f.x, y: floor - 2, vx: rand(-34, 34), vy: -rand(70, 120), gravity: 210, life: 0.9, art: 'gnawCrumb' }));
              }
            }
            f.fang.y -= 260 * real;
            if (f.fang.y <= f.top) { f.fang.y = f.top; f.state = 'held'; }
          } else if (f.state === 'held') {
            f.hold += real;
            if (f.hold > 0.5) f.state = 'down';
          } else {
            f.fang.y += 70 * real;
          }
        }
        fangs = fangs.filter((f) => !(f.state === 'down' && f.fang.y > floor + 12));
      },
    };
  },

  // The scream: it opens its mouth to the right of the box and screams, and
  // the scream comes across the box as rings, each with a gap in it. Then the
  // walls give it back: an echo ring comes the other way a moment after, with
  // a gap somewhere else. Five screams. Slip through the gaps.
  gnawScream(box, density, { rand }) {
    const T = (s) => s * density;
    const mouth = { x: box.x + box.w + 12, y: box.y + box.h / 2 };
    let t = 0;
    let screams = 0;
    let next = 0.15;
    let echoes = [];
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (screams < 5 && t >= next) {
          next = t + T(1.55);
          // A gap, but not the one straight at you: you have to move for it.
          const toYou = Math.atan2(soul.y - mouth.y, soul.x - mouth.x);
          const gapAngle = toYou + (Math.random() < 0.5 ? -1 : 1) * rand(0.75, 0.95);
          bullets.push(new Ring({ x: mouth.x, y: mouth.y, r: 3, grow: 52, thick: 2.6, warn: 0.45, life: 2.5, gap: { angle: gapAngle, width: 1.15 }, color: '#f0e4c0', glow: '#c8b888' }));
          echoes.push({ when: t + T(0.85), y: rand(box.y + 14, box.y + box.h - 14) });
          screams++;
        }
        for (const echo of echoes) {
          if (t < echo.when) continue;
          echo.done = true;
          const from = { x: box.x - 12, y: echo.y };
          const gapAngle = Math.atan2(soul.y - from.y, soul.x - from.x) + (Math.random() < 0.5 ? -1 : 1) * rand(0.75, 0.95);
          bullets.push(new Ring({ x: from.x, y: from.y, r: 3, grow: 40, thick: 2.2, warn: 0.4, life: 2.6, gap: { angle: gapAngle, width: 1.25 }, color: '#c8b888', glow: '#8c7c58', alpha: 0.85 }));
        }
        echoes = echoes.filter((echo) => !echo.done);
      },
    };
  },

  // Teething: the box is its mouth, a row of teeth along the roof and a row
  // along the floor. A tooth works loose (it wobbles, blinking), then it
  // falls out and shoots straight across the mouth, cracking on the teeth
  // over there into chips that fly back, and a new one starts growing in
  // its place. The wobbly one is always the next to go, and it's
  // often the one over your head. Near the end they go in pairs.
  gnawTeething(box, density, { Shot, rand }) {
    const T = (s) => s * density;
    const COLS = 7;
    const W = box.w / COLS;
    const colX = (c) => box.x + W * (c + 0.5);
    const LOOSE = 0.5;
    const GROW = 1.1;
    // When each socket last lost its tooth (real seconds), for drawing.
    const lost = { top: Array(COLS).fill(-9), bottom: Array(COLS).fill(-9) };
    let t = 0;
    let next = T(0.15);
    let count = 0;
    let started = false;
    const cracks = [];
    const fire = (bullets, row, c, now) => {
      if (now - lost[row][c] < LOOSE + GROW) return false;
      lost[row][c] = now + LOOSE;
      const top = row === 'top';
      bullets.push(new Shot({ x: colX(c), y: top ? box.y + 3 : box.y + box.h - 3, vy: top ? 135 : -135, warn: LOOSE, art: top ? 'gnawTooth' : 'gnawToothUp', life: 1 }));
      // It cracks on the teeth across the mouth, and chips fly back.
      cracks.push({ at: now + LOOSE + (box.h - 8) / 135, x: colX(c), y: top ? box.y + box.h - 4 : box.y + 4, up: top ? -1 : 1 });
      return true;
    };
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        const now = t / density;
        if (!started) {
          started = true;
          // The gums and the teeth still in them (harmless), and the new
          // ones growing back.
          bullets.push(new Deco({
            life: 8,
            under: true,
            paint: (ctx, d) => {
              ctx.fillStyle = '#d8908c';
              ctx.fillRect(box.x, box.y, box.w, 2);
              ctx.fillRect(box.x, box.y + box.h - 2, box.w, 2);
              for (const row of ['top', 'bottom']) {
                for (let c = 0; c < COLS; c++) {
                  const since = d.age - lost[row][c];
                  if (since < 0 && since > -LOOSE) continue;
                  const h = since >= 0 && since < GROW ? Math.round(1 + (since / GROW) * 3) : 4;
                  const x = Math.round(colX(c)) - 2;
                  ctx.fillStyle = '#c8b888';
                  if (row === 'top') ctx.fillRect(x, box.y + 2, 4, h);
                  else ctx.fillRect(x, box.y + box.h - 2 - h, 4, h);
                }
              }
            },
          }));
        }
        for (const k of cracks) {
          if (k.done || now < k.at) continue;
          k.done = true;
          for (const a of [-0.6, 0.6]) {
            const dir = (Math.PI / 2) * k.up + a;
            bullets.push(new Shot({ x: k.x, y: k.y, vx: Math.cos(dir) * 40, vy: Math.sin(dir) * 40, art: 'gnawChip', life: 0.8 }));
          }
        }
        if (t < next || now > 6.6) return;
        next = t + T(now > 4.6 ? 0.5 : 0.32);
        count++;
        const mine = Math.min(COLS - 1, Math.max(0, Math.floor((soul.x - box.x) / W)));
        if (now > 4.6) {
          // A pair: one from the roof, one from the floor, side by side.
          const c = Math.min(COLS - 2, Math.max(0, mine - Math.floor(rand(0, 2))));
          fire(bullets, 'top', c, now);
          fire(bullets, 'bottom', c + 1, now);
          return;
        }
        const row = count % 2 ? 'top' : 'bottom';
        const c = Math.random() < 0.55 ? mine : Math.floor(rand(0, COLS));
        if (!fire(bullets, row, c, now)) fire(bullets, row, Math.floor(rand(0, COLS)), now);
      },
    };
  },
};
