import { defineBulletArt } from '../projectiles.js';
import { PathShot, GatedShot, Deco } from './coastKit.js';

// The Prismoth's attacks. Its wings are panes of rainbow glass, it is drawn
// to anything bright, and it is far too proud of its colours:
//   - Burst: a crystal bends the light into a star of beams.
//   - Mirror: flat copies of itself flash across the box.
//   - Rainbow: an arch of colours rolls across, light bent down under it.
//   - Lamps: a lamp lights, and moths fly straight to it from the edges,
//     whirl round it, and scatter when it goes out.
//   - Colours: the light turns red, yellow, green, in turn, and only the
//     glass of the colour the light is now is really there.
//
// It stands to the right of the box. Each attack is a factory `(box, density,
// tools) => ({ duration, update })`; see dummy.js for the shape.

const BAND = [
  { c: '#ff5a78', g: '#ff9ab0' },
  { c: '#ff9a4a', g: '#ffc89a' },
  { c: '#ffe65a', g: '#fff4a8' },
  { c: '#6ae88a', g: '#b0ffc8' },
  { c: '#5adcf0', g: '#b0f0ff' },
  { c: '#6a8cff', g: '#b0c4ff' },
  { c: '#b46af0', g: '#dcb0ff' },
];

// A scale off its wing: a tiny coloured kite, one per colour.
BAND.forEach((b, i) => {
  defineBulletArt(`prismScale${i}`, {
    frames: [
      ['.m.', 'mlm', '.m.', '.m.'],
      ['.m.', 'mmm', '.l.', '.m.'],
    ],
    palette: { m: b.c, l: '#ffffff' },
    radius: 1.5,
    frameSeconds: 0.2,
  });
});

// A shard of coloured glass, drawn pointing right, tumbling as it goes.
BAND.forEach((b, i) => {
  defineBulletArt(`prismShard${i}`, {
    frames: [['..mm....', '.mmllm..', 'mmllmmmm', '.mmmmm..', '..mm....']],
    palette: { m: b.c, l: '#ffffff' },
    radius: 2.6,
    spin: 3 + (i % 3),
  });
});

// A copy of the moth, flashing by: a small silhouette with a rainbow in it.
defineBulletArt('prismCopy', {
  frames: [
    [
      '..k..........k..',
      '...k...kk...k...',
      'rrrykkkkkkkkgcc.',
      'rrryyykwwkgggcc.',
      '.orrykkwwkgggb..',
      '..oyyyyyykgcbb..',
      '...ggkwwkkbbv...',
      '....gccwwcbvv...',
      '.....cccbbvv....',
    ],
    [
      '..k..........k..',
      '...k...kk...k...',
      '.rrykkkkkkkkgc..',
      'rrryyykwwkgggcc.',
      'orrryykwwkggbbb.',
      '.oyyyyyykgcbbv..',
      '..ggkwwkkbbvv...',
      '...gccwwcbvv....',
      '....cccbbvv.....',
    ],
  ],
  palette: { k: '#2a1e3c', w: '#f6f0fb', r: '#ff5a78', o: '#ff9a4a', y: '#ffe65a', g: '#6ae88a', c: '#5adcf0', b: '#6a8cff', v: '#b46af0' },
  radius: 5,
  frameSeconds: 0.08,
});

// A crystal about to burst: a facet of glass with a glint (harmless).
defineBulletArt('prismCrystal', {
  frames: [
    ['...w...', '..wcw..', '.wcccw.', 'wcclccw', '.wcccw.', '..wcw..', '...w...'],
    ['...c...', '..cwc..', '.cwwwc.', 'cwwwwwc', '.cwwwc.', '..cwc..', '...c...'],
  ],
  palette: { w: '#ffffff', c: '#9ae8f6', l: '#e8fcff' },
  radius: 1,
  frameSeconds: 0.09,
});

// A single point of light on a rainbow, a dot of colour.
BAND.forEach((b, i) => {
  defineBulletArt(`prismDot${i}`, {
    frames: [['.mm.', 'mllm', 'mmmm', '.mm.']],
    palette: { m: b.c, l: '#ffffff' },
    radius: 2,
  });
});

// A crystal lamp, lit (harmless: it's what the moths are after).
defineBulletArt('prismLamp', {
  frames: [
    ['..www..', '.wyyyw.', 'wyyWyyw', 'wyWWWyw', 'wyyWyyw', '.wyyyw.', '..kkk..'],
    ['.......', '..www..', '.wyyyw.', 'wyyWyyw', '.wyyyw.', '..www..', '..kkk..'],
  ],
  palette: { w: '#fff6c0', y: '#ffe65a', W: '#ffffff', k: '#5a4a6a' },
  radius: 1,
  frameSeconds: 0.12,
});

// A little moth, drawn flying right, with rainbow wings.
defineBulletArt('prismMothlet', {
  frames: [
    ['rr...', 'yrk..', '.kkkw', 'gck..', 'cc...'],
    ['.r...', 'yyk..', '.kkkw', 'gck..', '.c...'],
  ],
  palette: { k: '#2a1e3c', w: '#f6f0fb', r: '#ff5a78', y: '#ffe65a', g: '#6ae88a', c: '#5adcf0' },
  radius: 2,
  rotate: true,
  frameSeconds: 0.06,
});

export const PRISMOTH_ATTACKS = {
  // Burst: a crystal of glass hangs in the air (it flashes, and shows where
  // it will bend the light), then five beams of colour go off from it in a
  // star, one of them straight through where you stand. A second crystal
  // follows with the star turned half a step.
  prismBurst(box, density, { Shot, Line, rand, clamp }) {
    let t = 0;
    let count = 0;
    let next = 0.2;
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t < next || count >= 4) return;
        count++;
        next = t + 1.9;
        const d = rand(16, 24);
        const a0 = rand(0, Math.PI * 2);
        const at = { x: clamp(soul.x + Math.cos(a0) * d, box.x + 10, box.x + box.w - 10), y: clamp(soul.y + Math.sin(a0) * d, box.y + 10, box.y + box.h - 10) };
        const aim = Math.atan2(soul.y - at.y, soul.x - at.x) + (count % 2 === 0 ? Math.PI / 5 : 0);
        const warn = 1.0;
        bullets.push(new Shot({ x: at.x, y: at.y, harmless: true, life: warn + 0.4, art: 'prismCrystal' }));
        for (let i = 0; i < 5; i++) {
          const k = i + count;
          bullets.push(new Line({
            x: at.x, y: at.y, angle: aim + (i / 5) * Math.PI * 2, length: 120, thickness: 3, warn, life: 0.45,
            color: BAND[(k * 3) % 7].c, glow: BAND[(k * 3) % 7].g,
          }));
        }
      },
    };
  },

  // Mirror: it makes copies of itself, flat as glass, that flash across the
  // box one after another, along a row and then down a column, and so on.
  // The line the copy will cross flashes first, and the first one is always
  // where you're heading.
  prismMirror(box, density, { Shot, Line, rand, clamp }) {
    let t = 0;
    let count = 0;
    let next = 0.15;
    // Where you're heading, so a copy is sent a little ahead of you.
    let last = null;
    let vel = { x: 0, y: 0 };
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (last && dt > 0) vel = { x: vel.x * 0.7 + ((soul.x - last.x) / dt) * 0.3, y: vel.y * 0.7 + ((soul.y - last.y) / dt) * 0.3 };
        last = { x: soul.x, y: soul.y };
        if (t < next || count >= 8) return;
        const column = count % 2 === 1;
        const warn = 0.85;
        const color = BAND[(count * 2) % 7];
        const spread = count < 2 ? 0 : (count % 4 < 2 ? 1 : -1) * rand(2, 10);
        if (column) {
          const x = clamp(soul.x + vel.x * 0.7 + spread, box.x + 4, box.x + box.w - 4);
          const fromTop = count % 4 === 1;
          bullets.push(new Line({ x, y: box.y - 2, angle: Math.PI / 2, length: box.h + 4, thickness: 7, warn, life: 0, color: color.c }));
          bullets.push(new Shot({
            x, y: fromTop ? box.y - 14 : box.y + box.h + 14, vy: fromTop ? 190 : -190, warn, art: 'prismCopy', life: 2,
          }));
        } else {
          const y = clamp(soul.y + vel.y * 0.7 + spread, box.y + 4, box.y + box.h - 4);
          const fromLeft = count % 4 === 2;
          bullets.push(new Line({ x: box.x - 2, y, angle: 0, length: box.w + 4, thickness: 7, warn, life: 0, color: color.c }));
          bullets.push(new Shot({
            x: fromLeft ? box.x - 14 : box.x + box.w + 14, y, vx: fromLeft ? 190 : -190, warn, art: 'prismCopy', life: 2,
          }));
        }
        count++;
        next = t + 0.8;
      },
    };
  },

  // Rainbow: an arch of seven colours rolls across the box from the right,
  // standing on the floor, then one hung from the ceiling. Under the arch
  // (right on the floor, or right under the ceiling) is the safe place. In
  // between, the light is bent down in beams that flash first and then fall
  // straight through where you were standing.
  prismArc(box, density, { Shot, Line }) {
    let t = 0;
    let fired = 0;
    let beams = 0;
    return {
      duration: 7.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (beams < 6 && t >= 0.9 + beams * 1.25) {
          const x = Math.min(Math.max(soul.x, box.x + 2), box.x + box.w - 2);
          const color = BAND[(beams * 2 + 1) % 7];
          bullets.push(new Line({ x, y: box.y - 2, angle: Math.PI / 2, length: box.h + 4, thickness: 6, warn: 0.8, life: 0.3, color: color.c, glow: color.g }));
          beams++;
        }
        if (fired >= 3 || t < fired * 2.2 + 0.2) return;
        const up = fired === 1;
        const cx = box.x + box.w + 50;
        const cy = up ? box.y : box.y + box.h;
        for (let band = 0; band < 7; band++) {
          const r = 20 + band * 4.6;
          const steps = Math.round((Math.PI * r) / 5.2);
          for (let s = 0; s <= steps; s++) {
            const a = Math.PI + (s / steps) * Math.PI;
            const x = cx + Math.cos(a) * r;
            const y = cy + Math.sin(a) * r * (up ? -1 : 1);
            bullets.push(new Shot({ x, y, vx: -52, art: `prismDot${band}`, life: 7 }));
          }
        }
        fired++;
      },
    };
  },


  // Lamps: it can't resist anything bright. A crystal lamp lights up near
  // you (it flickers on first), and moths come flying straight to it from
  // the edges of the box, each flashing where it starts. They whirl round
  // the lamp while it burns, and when it goes out they scatter outward.
  // So: don't stand between a moth and the lamp, and don't stay close.
  prismLamps(box, density, { Shot, rand, clamp }) {
    const T = (s) => s * density;
    const WARN = 0.7;
    const FLY = 0.75;
    const WHIRL = 1.0;
    let t = 0;
    let n = 0;
    return {
      duration: 8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (n >= 5 || t < T(0.1 + n * 1.35)) return;
        n++;
        // The lamp, a little way from you.
        const a = rand(0, Math.PI * 2);
        const d = rand(10, 20);
        const lamp = { x: clamp(soul.x + Math.cos(a) * d, box.x + 10, box.x + box.w - 10), y: clamp(soul.y + Math.sin(a) * d, box.y + 10, box.y + box.h - 10) };
        bullets.push(new Shot({ x: lamp.x, y: lamp.y, harmless: true, art: 'prismLamp', life: WARN + FLY + WHIRL }));
        const moths = 4 + (n > 2 ? 1 : 0);
        const turn = rand(0, Math.PI * 2);
        for (let i = 0; i < moths; i++) {
          // From a point on the edge of the box, round the lamp.
          const dir = turn + (i / moths) * Math.PI * 2;
          const from = { x: clamp(lamp.x + Math.cos(dir) * 120, box.x + 2, box.x + box.w - 2), y: clamp(lamp.y + Math.sin(dir) * 120, box.y + 2, box.y + box.h - 2) };
          const spin = i % 2 ? 1 : -1;
          const path = (k) => {
            if (k < FLY) {
              const u = k / FLY;
              return { x: from.x + (lamp.x - from.x) * u, y: from.y + (lamp.y - from.y) * u, a: Math.atan2(lamp.y - from.y, lamp.x - from.x) };
            }
            const w = k - FLY;
            const ang = dir + spin * w * 7;
            if (w < WHIRL) return { x: lamp.x + Math.cos(ang) * 6, y: lamp.y + Math.sin(ang) * 6, a: ang + spin * Math.PI / 2 };
            // The lamp's out: off they go, outward.
            const end = dir + spin * WHIRL * 7;
            const r = 6 + (w - WHIRL) * 70;
            return { x: lamp.x + Math.cos(end) * r, y: lamp.y + Math.sin(end) * r, a: end };
          };
          bullets.push(new PathShot({ path, warn: WARN, art: 'prismMothlet', life: FLY + WHIRL + 1.6 }));
        }
      },
    };
  },

  // Colours: its wings turn the cave red, then yellow, then green, over and
  // over, and coloured glass hangs drifting all through the box. Only the
  // glass of the colour the light is now is really there; the rest is only
  // a reflection, faint, and you can go straight through it. The bar along
  // the top shows the colour, and flashes the next one just before it turns.
  prismColours(box, density, { rand }) {
    const T = (s) => s * density;
    const STEP = 1.15;
    const COLOURS = [0, 2, 3];
    const colourAt = (s) => Math.floor(s / STEP) % 3;
    let t = 0;
    let next = 0;
    let started = false;
    return {
      duration: 8.2,
      update: (dt, bullets, soul) => {
        t += dt;
        const now = t / density;
        if (!started) {
          started = true;
          bullets.push(new Deco({
            life: 8.2,
            paint: (ctx, d) => {
              const c = colourAt(d.age);
              const soon = d.age % STEP > STEP - 0.35;
              const show = soon && Math.floor(d.age * 10) % 2 ? (c + 1) % 3 : c;
              ctx.globalAlpha *= 0.08;
              ctx.fillStyle = BAND[COLOURS[c]].c;
              ctx.fillRect(box.x, box.y, box.w, box.h);
              ctx.globalAlpha /= 0.08;
              ctx.fillStyle = BAND[COLOURS[show]].c;
              ctx.fillRect(box.x, box.y, box.w, 2);
              ctx.fillRect(box.x, box.y + box.h - 2, box.w, 2);
            },
          }));
        }
        if (t < next || now > 6.6) return;
        next = t + T(0.13);
        // Glass drifting in from the right, some along your row.
        const which = Math.floor(rand(0, 3));
        const y = Math.random() < 0.3 ? soul.y + rand(-8, 8) : rand(box.y + 4, box.y + box.h - 4);
        const born = now;
        bullets.push(new GatedShot({
          x: box.x + box.w + 6, y: Math.min(Math.max(y, box.y + 4), box.y + box.h - 4), vx: -rand(30, 44), vy: rand(-6, 6),
          art: `prismShard${COLOURS[which]}`, life: 5, offAlpha: 0.22,
          on: (k) => colourAt(born + k) === which,
        }));
      },
    };
  },
};
