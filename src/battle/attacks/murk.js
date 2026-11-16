import { defineBulletArt } from '../projectiles.js';
import { Glow, dimmed, stillness } from './underShapes.js';
import { PathShot } from './coastKit.js';

// The Murk's attacks. It's a patch of the dark that got up and followed a
// light: afraid of it, and starving for it. So most of what it does is about
// your light:
//   - Tendrils: it reaches for your light from the edges, with hands.
//   - Motes: little lights drift down to catch (they heal), and its mouth
//     goes after them too.
//   - Shadows: the shadows of things that aren't there.
//   - The swallow: it drinks your light down, and there's only its eyes.
//   - Behind you: wherever you look, it's just behind. A hand opens at your
//     back and grabs where you were. Keep going; don't turn back.
//
// Each attack is a factory `(box, density, tools) => ({ duration, update })`;
// see dummy.js for the shape. The attack's own clock (`t`) runs `density`
// times faster than the seconds on the wall, hence the `T` below. Things in
// the dark use `dimmed` (src/battle/attacks/underShapes.js): they hurt just
// the same, but fade from sight away from your light.

const DARK = { k: '#0a0614', n: '#100c1a', N: '#1c1430', M: '#2a2046', v: '#4a3a78', V: '#7a68b8' };
const EYE = { c: '#d8f4ff', C: '#80c0e0', e: '#04020a' };
const MOTE = { w: '#ffffff', y: '#fff0b0', Y: '#ffd860', o: '#ff9a40' };
const SHADE = { M: '#2a2046', V: '#7a68b8', v: '#4a3a78', k: '#0a0614' };

// A wisp of the dark: a smudge with a thin lit rim.
defineBulletArt('murkWisp', {
  frames: [
    ['.vvv.', 'vMNMv', 'vNnNv', 'vMNMv', '.vvv.'],
    ['..v..', '.vMMv', 'vMNNv', '.vNMv', '..vv.'],
  ],
  palette: DARK,
  radius: 2.5,
  frameSeconds: 0.3,
});

// The reaching tip of a tendril: three dark fingers, heading right.
defineBulletArt('murkTip', {
  frames: [
    ['.vv....', 'vMMvvv.', 'vMNMMVv', 'vMMvvv.', '.vv....'],
    ['.v.....', 'vMMvv..', 'vMNMMVv', 'vMMvv..', '.v.....'],
  ],
  palette: DARK,
  radius: 2.5,
  rotate: true,
  frameSeconds: 0.2,
});

// A pair of eyes opening in the dark (harmless): the warning.
defineBulletArt('murkEyes', {
  frames: [
    ['.ccc..ccc.', 'ccecc.ccecc', '.ccc..ccc.'].map((row) => row.padEnd(11, '.')),
    ['...........', 'CCCCC.CCCCC', '...........'],
  ],
  palette: EYE,
  radius: 1,
  frameSeconds: 0.22,
});

// A mote of light: yours to catch. It heals (the Murk wants it).
defineBulletArt('murkMote', {
  frames: [
    ['..Y..', '.Yyy.', 'Yywyy', '.Yyy.', '..Y..'],
    ['..y..', '.yYy.', 'yYwYy', '.yYy.', '..y..'],
  ],
  palette: MOTE,
  radius: 2.6,
  frameSeconds: 0.25,
});

// Its mouth, opening in the dark: a ring of dark with pale teeth.
defineBulletArt('murkMaw', {
  frames: [
    ['..vvvvv..', '.vMMMMMv.', 'vMNnnnNMv', 'vMnkkknMv', 'vMNnnnNMv', '.vMMMMMv.', '..vvvvv..'],
    ['..VvvvV..', '.vMMMMMv.', 'vMNnnnNMv', 'vMnkkknMv', 'vMNnnnNMv', '.vMMMMMv.', '..VvvvV..'],
  ],
  palette: { ...DARK, V: '#d8f4ff' },
  radius: 3.8,
  frameSeconds: 0.2,
});

// A pale spark: a scrap of your own light, spat back out, bright, with a
// little smear behind it where the dark still has hold of it. Drawn flying
// right.
defineBulletArt('murkSpark', {
  frames: [['...c..', 'dCccwc', '...c..'], ['..c.c.', 'd.Cwwc', '..c.c.']],
  palette: { c: '#d8f4ff', C: '#80c0e0', w: '#ffffff', d: '#3a4a78' },
  radius: 1.8,
  rotate: true,
  frameSeconds: 0.1,
});

// Shadows of things that aren't there. A bird, wings up and wings down.
defineBulletArt('murkBird', {
  frames: [
    ['V.......V', 'vV.....Vv', '.vMMMMMv.', '..vMMMv..', '...vMv...'],
    ['.........', '..vvVvv..', 'vvMMMMMvv', 'vMMMvMMMv', '.vv...vv.'],
  ],
  palette: SHADE,
  hitbox: { w: 9, h: 4 },
  frameSeconds: 0.14,
});
// A hand, fingers spread, reaching from the left.
defineBulletArt('murkHand', {
  frames: [[
    '....vv.....', '..v.vMv.v..', '.vMvvMvvMv.', '.vMMvMMvMv.', 'vMMMMMMMMMv', '.vMMMMMMMMv', '..vMMMMMMv.', '...vvMMMv..',
  ]],
  palette: SHADE,
  radius: 4,
  rotate: false,
});
// A lantern, hanging by its ring: the shadow of one.
defineBulletArt('murkLamp', {
  frames: [[
    '..vVv..', '.vvVvv.', '..vMv..', '.vMMMv.', 'vMMVMMv', 'vMVVVMv', 'vMMVMMv', 'vMMMMMv', '.vvvvv.',
  ]],
  palette: SHADE,
  hitbox: { w: 7, h: 8 },
});

export const MURK_ATTACKS = {
  // Tendrils: pairs of eyes open at the edge of the box, and from each a
  // long dark tendril reaches across for where you are, ending in a hand. It
  // stays a moment, then slides back. Up to three at a time, from different
  // sides.
  murkTendrils(box, density, { Shot, Line, rand, clamp }) {
    const T = (s) => s * density;
    let t = 0;
    let next = 0.2;
    let volley = 0;
    let reaching = [];
    const SIDES = ['left', 'right', 'top', 'bottom'];
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t >= next && t < T(6.2)) {
          next = t + T(1.5);
          const n = Math.min(3, 1 + volley);
          const used = [];
          for (let i = 0; i < n; i++) {
            let side;
            do side = SIDES[Math.floor(Math.random() * 4)]; while (used.includes(side) && used.length < 4);
            used.push(side);
            const from = {
              left: { x: box.x - 2, y: rand(box.y + 8, box.y + box.h - 8) },
              right: { x: box.x + box.w + 2, y: rand(box.y + 8, box.y + box.h - 8) },
              top: { x: rand(box.x + 8, box.x + box.w - 8), y: box.y - 2 },
              bottom: { x: rand(box.x + 8, box.x + box.w - 8), y: box.y + box.h + 2 },
            }[side];
            const angle = Math.atan2(soul.y - from.y, soul.x - from.x);
            const length = Math.hypot(soul.x - from.x, soul.y - from.y) + 8;
            const eyesAt = { x: clamp(from.x, box.x + 6, box.x + box.w - 6), y: clamp(from.y, box.y + 3, box.y + box.h - 3) };
            bullets.push(new Shot({ x: eyesAt.x, y: eyesAt.y, harmless: true, life: 0.9, art: 'murkEyes' }));
            const line = new Line({ x: from.x, y: from.y, angle, length, thickness: 3, warn: 0.8, grow: 150, life: 0.9, color: '#4a3a78', glow: '#9a88e8' });
            const tip = new Shot({ x: from.x, y: from.y, warn: 0.8, life: 0.9, angle, art: 'murkTip' });
            bullets.push(line, tip);
            reaching.push({ line, tip, from, angle });
          }
          volley++;
        }
        for (const r of reaching) {
          const reach = Math.max(1, r.line.solidLength);
          r.tip.x = r.from.x + Math.cos(r.angle) * reach;
          r.tip.y = r.from.y + Math.sin(r.angle) * reach;
          r.tip.angle = r.angle;
        }
        reaching = reaching.filter((r) => r.line.age < r.line.warn + r.line.life + 0.3);
      },
    };
  },

  // Motes: little lights drift down through the box, and they're yours to
  // catch: each gives back a few HP. But the Murk's mouth opens at the
  // bottom and goes after them, eating every one it reaches, and it hurts
  // to touch. Dark drops come down as well, to keep you moving.
  murkMotes(box, density, { Shot, rand, clamp, spreadAcross }) {
    const T = (s) => s * density;
    const nextX = spreadAcross(box.x + 8, box.x + box.w - 8, 5);
    let t = 0;
    let next = 0.1;
    let nextDrop = 0.6;
    let nextSide = 1.1;
    let dropCount = 0;
    let sideCount = 0;
    let motes = [];
    let maw = null;
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (!maw) {
          maw = new Shot({ x: box.x + box.w - 10, y: box.y + box.h - 5, warn: 0.9, art: 'murkMaw' });
          bullets.push(maw);
        }
        if (t >= next && t < T(6.2)) {
          next = t + 0.62;
          const mote = new Shot({ x: nextX(), y: box.y - 3, vy: rand(15, 20), art: 'murkMote' });
          mote.heals = 8;
          mote.baseX = mote.x;
          mote.sway = rand(0, Math.PI * 2);
          motes.push(mote);
          bullets.push(mote);
        }
        if (t >= nextDrop && t < T(6.8)) {
          nextDrop = t + 0.5;
          // Every other drop falls on wherever you're standing.
          const dropX = dropCount++ % 2 ? soul.x + rand(-6, 6) : rand(box.x + 4, box.x + box.w - 4);
          bullets.push(new Shot({ x: clamp(dropX, box.x + 4, box.x + box.w - 4), y: box.y - 3, warn: 0.45, vy: rand(34, 44), art: 'murkWisp' }));
        }
        // The dark reaches in from the sides for you as well, along your row.
        if (t >= nextSide && t < T(6.4)) {
          nextSide = t + T(0.95);
          const left = sideCount++ % 2 === 0;
          const x = left ? box.x - 3 : box.x + box.w + 3;
          const y = clamp(soul.y, box.y + 4, box.y + box.h - 4);
          bullets.push(new Shot({ x, y, warn: 0.5, vx: (left ? 1 : -1) * 46, art: 'murkWisp' }));
        }
        for (const mote of motes) mote.x = mote.baseX + Math.sin(mote.age * 1.8 + mote.sway) * 5;
        // The maw: after the nearest mote that's still alive, and eats it.
        if (maw.age > maw.warn) {
          const live = motes.filter((m) => !m.spent);
          const goal = live.sort((a, b) => Math.hypot(a.x - maw.x, a.y - maw.y) - Math.hypot(b.x - maw.x, b.y - maw.y))[0];
          const aim = goal ?? { x: box.x + box.w / 2, y: box.y + box.h - 5 };
          const gap = Math.hypot(aim.x - maw.x, aim.y - maw.y);
          const speed = (goal ? 27 : 10) * (dt / density);
          if (gap > 0.5) {
            maw.x += ((aim.x - maw.x) / gap) * speed;
            maw.y += ((aim.y - maw.y) / gap) * speed;
          }
          for (const mote of live) {
            if (Math.hypot(mote.x - maw.x, mote.y - maw.y) < 5) {
              mote.spent = true;
              for (let i = 0; i < 4; i++) {
                bullets.push(new Shot({ x: mote.x, y: mote.y, vx: Math.cos(i * 1.57) * 18, vy: Math.sin(i * 1.57) * 18, life: 0.4, harmless: true, art: 'murkSpark' }));
              }
            }
          }
        }
        motes = motes.filter((mote) => !mote.spent && mote.y < box.y + box.h + 6);
      },
    };
  },

  // Shadows: things that aren't there, throwing shadows. A flock of birds
  // crosses; a hand reaches in from the side; a lantern swings on its
  // ring, back and forth, and then a second one. You never see what casts
  // them. They hurt all the same.
  murkShadows(box, density, { Shot, Line, rand, clamp }) {
    const T = (s) => s * density;
    let t = 0;
    let birds = 0;
    let nextBirds = 0.15;
    let hands = 0;
    let handAt = T(1.3);
    const reaching = [];
    let lampAt = T(2.6);
    const lamps = [];
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (birds < 2 && t >= nextBirds) {
          nextBirds = t + T(4);
          const fromLeft = birds % 2 === 0;
          const y = clamp(soul.y + rand(-10, 10), box.y + 14, box.y + box.h - 14);
          for (let i = 0; i < 5; i++) {
            const rank = Math.ceil(i / 2);
            const side = i % 2 ? 1 : -1;
            const x = fromLeft ? box.x - 6 - rank * 8 : box.x + box.w + 6 + rank * 8;
            bullets.push(new Shot({ x, y: y + side * rank * 7, warn: 0.5, vx: (fromLeft ? 1 : -1) * 64, wobble: { amplitude: 2, frequency: 6 }, art: 'murkBird' }));
          }
          birds++;
        }
        // Hands reach in, one after another, each from a different side, along
        // the row or column you're in.
        if (hands < 5 && t >= handAt) {
          handAt = t + T(1.2);
          const side = hands === 0 ? 0 : 1 + ((hands + Math.floor(rand(0, 2))) % 3);
          const wide = side < 2;
          const x = side === 0 ? box.x - 6 : side === 1 ? box.x + box.w + 6 : clamp(soul.x, box.x + 12, box.x + box.w - 12);
          const y = side === 0 || side === 1 ? clamp(soul.y, box.y + 12, box.y + box.h - 12) : side === 2 ? box.y - 6 : box.y + box.h + 6;
          const angle = [0, Math.PI, Math.PI / 2, -Math.PI / 2][side];
          const line = new Line({ x, y, angle, length: (wide ? box.w : box.h) + 4, thickness: 5, warn: 0.8, grow: wide ? 52 : 44, life: 1.4, color: '#2a2046', glow: '#7a68b8' });
          const tip = new Shot({ x, y, warn: 0.8, life: 1.4, art: 'murkHand' });
          bullets.push(line, tip);
          reaching.push({ line, tip, from: { x, y }, angle });
          hands++;
        }
        for (const r of reaching) {
          const reach = Math.max(1, r.line.solidLength) + 3;
          r.tip.x = r.from.x + Math.cos(r.angle) * reach;
          r.tip.y = r.from.y + Math.sin(r.angle) * reach;
        }
        if (lamps.length < 2 && t >= lampAt) {
          lampAt = t + T(1.6);
          const lamp = new Shot({ x: box.x + box.w / 2, y: box.y, warn: 0.5, art: 'murkLamp' });
          lamp.pivot = { x: box.x + box.w / 2 + (lamps.length ? 14 : -14), y: box.y - 8 };
          lamp.phase = lamps.length ? Math.PI : 0;
          lamp.arm = lamps.length ? 52 : 58;
          lamps.push(lamp);
          bullets.push(lamp);
        }
        for (const lamp of lamps) {
          const swing = Math.sin(Math.max(0, lamp.age - lamp.warn) * 2.1 + lamp.phase) * 0.78;
          lamp.x = lamp.pivot.x + Math.sin(swing) * lamp.arm;
          lamp.y = lamp.pivot.y + Math.cos(swing) * lamp.arm;
        }
      },
    };
  },

  // The swallow: it eats your light. Your light swells to fill the box, and
  // the dark rushes in and drinks it down to nothing. Then it's black, and
  // there's only its eyes, opening round you, one pair and the next, and
  // from each pair it spits some of the light back at where you are. Then
  // your light comes back, small.
  murkSwallow(box, density, { Shot, rand, clamp }) {
    const T = (s) => s * density;
    const light = { x: box.x + box.w / 2, y: box.y + box.h / 2, r: 62 };
    const glow = new Glow(light, { color: '216, 244, 255', alpha: 0.32 });
    let started = false;
    let t = 0;
    let nextEyes = T(1.35);
    let waiting = [];
    let ringDone = false;
    let prev = null;
    const vel = { x: 0, y: 0 };
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        if (!started) {
          started = true;
          bullets.push(glow);
        }
        t += dt;
        const real = t / density;
        light.x = soul.x;
        light.y = soul.y;
        // Where you're heading, so the eyes can get ahead of you.
        if (prev && dt > 0) {
          vel.x = vel.x * 0.8 + ((soul.x - prev.x) / dt) * 0.2;
          vel.y = vel.y * 0.8 + ((soul.y - prev.y) / dt) * 0.2;
        }
        prev = { x: soul.x, y: soul.y };
        // Swollen, then drunk down; black for a good while; then back, small.
        if (real < 0.5) light.r = 40 + real * 44;
        else if (real < 1.3) light.r = Math.max(0, 62 * (1 - (real - 0.5) / 0.8));
        else if (real < 4.6) light.r = 0;
        else light.r = Math.min(15, (real - 4.6) * 20);
        if (t >= nextEyes && real < 4.2) {
          nextEyes = t + T(0.6);
          for (let tries = 0; tries < 8; tries++) {
            const a = rand(0, Math.PI * 2);
            const d = rand(26, 36);
            const x = clamp(soul.x + vel.x * 0.4 + Math.cos(a) * d, box.x + 8, box.x + box.w - 8);
            const y = clamp(soul.y + vel.y * 0.4 + Math.sin(a) * d, box.y + 5, box.y + box.h - 5);
            if (Math.hypot(x - soul.x, y - soul.y) < 20) continue;
            bullets.push(new Shot({ x, y, harmless: true, life: 0.95, art: 'murkEyes' }));
            waiting.push({ x, y, when: t + T(0.68) });
            break;
          }
        }
        for (const eyes of waiting) {
          if (t < eyes.when) continue;
          eyes.done = true;
          const aim = Math.atan2(soul.y + vel.y * 0.45 - eyes.y, soul.x + vel.x * 0.45 - eyes.x);
          for (let i = -1; i <= 1; i++) {
            bullets.push(new Shot({ x: eyes.x, y: eyes.y, vx: Math.cos(aim + i * 0.3) * 50, vy: Math.sin(aim + i * 0.3) * 50, art: 'murkSpark' }));
          }
        }
        waiting = waiting.filter((eyes) => !eyes.done);
        // The light given back: a ring of sparks, slow, from where it came.
        if (real >= 4.6 && !ringDone) {
          ringDone = true;
          // (They twinkle a moment first, so you can pick a gap.)
          for (let i = 0; i < 9; i++) {
            const a = (i / 9) * Math.PI * 2;
            bullets.push(new Shot({ x: soul.x + Math.cos(a) * 30, y: soul.y + Math.sin(a) * 30, warn: 0.45, vx: -Math.cos(a) * 24, vy: -Math.sin(a) * 24, life: 1.4, art: 'murkSpark' }));
          }
        }
      },
    };
  },

  // Behind you: wherever you look, it's just behind it. Your light is a
  // small pool round you, getting smaller, and out of the dark at your back, a hand opens
  // (it flickers first) and grabs at the spot where you were when it opened.
  // Keep going (briskly) and it closes on nothing; dawdle, stop, or turn
  // back, and it has you. An empty hand crumbles into wisps that drift
  // after you. Again and again, always from behind, the way you've come.
  murkBehind(box, density, { Shot, rand, clamp }) {
    const WARN = 0.5;
    const REACH = 0.24;
    const HOLD = 0.18;
    const light = { x: box.x + box.w / 2, y: box.y + box.h / 2, r: 30 };
    const glow = new Glow(light, { color: '216, 244, 255', alpha: 0.24 });
    const Dim = dimmed(Shot, light, 0.05);
    const heading = { x: -1, y: 0 };
    const crumbles = [];
    let last = null;
    let now = 0;
    let next = 0.35;
    let started = false;
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        const real = dt / density;
        now += real;
        if (!started) {
          started = true;
          bullets.push(glow);
        }
        light.x = soul.x;
        light.y = soul.y;
        // The light gets smaller as it goes on.
        light.r = Math.max(18, 30 - now * 1.8);
        // Which way you're going (it remembers the last way, if you stop).
        if (last && real > 0) {
          const vx = (soul.x - last.x) / real;
          const vy = (soul.y - last.y) / real;
          const v = Math.hypot(vx, vy);
          if (v > 20) {
            heading.x = heading.x * 0.8 + (vx / v) * 0.2;
            heading.y = heading.y * 0.8 + (vy / v) * 0.2;
            const h = Math.hypot(heading.x, heading.y) || 1;
            heading.x /= h;
            heading.y /= h;
          }
        }
        last = { x: soul.x, y: soul.y };
        // An empty hand crumbles into wisps that drift after you in the dark.
        for (const c of crumbles) {
          if (c.done || now < c.at) continue;
          c.done = true;
          for (const side of [-1, 0, 1]) {
            const a = Math.atan2(soul.y - c.y, soul.x - c.x) + side * 0.9;
            bullets.push(new Dim({ x: c.x, y: c.y, vx: Math.cos(a) * 22, vy: Math.sin(a) * 22, homing: { target: soul, turn: 0.8 }, life: 2.2, art: 'murkWisp' }));
          }
        }
        if (now < next || now > 6.8) return;
        next = now + rand(0.44, 0.54);
        // Out of the dark just behind you; it grabs where you are now.
        const from = { x: clamp(soul.x - heading.x * 17, box.x + 3, box.x + box.w - 3), y: clamp(soul.y - heading.y * 17, box.y + 3, box.y + box.h - 3) };
        const to = { x: clamp(soul.x + heading.x * 12, box.x + 3, box.x + box.w - 3), y: clamp(soul.y + heading.y * 12, box.y + 3, box.y + box.h - 3) };
        crumbles.push({ at: now + WARN + REACH + HOLD, x: to.x, y: to.y });
        bullets.push(new PathShot({
          art: 'murkHand', warn: WARN, life: REACH + HOLD,
          path: (k) => {
            const u = Math.min(1, k / REACH);
            return { x: from.x + (to.x - from.x) * u, y: from.y + (to.y - from.y) * u };
          },
        }));
      },
    };
  },
};
