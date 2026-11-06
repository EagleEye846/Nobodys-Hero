import { defineBulletArt } from '../projectiles.js';

// The Prismoth's attacks. Its wings are panes of rainbow, so everything it
// does is light bent into colours: a crystal that bursts into beams, scales
// of wing-glitter snowing down, copies of itself flashing across the box, a
// rainbow arching overhead, and shards that glance off every wall.
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
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t < next || count >= 3 || t > 4.6) return;
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

  // Glitter: it shakes its wings and the scales come off in a snow, drifting
  // down from the top of the box and swaying as they come. A column of
  // scales always falls where you are, and the rest fall around.
  prismGlitter(box, density, { Shot, rand, clamp, every }) {
    let t = 0;
    let n = 0;
    const fall = every(0.11, 0.17, (bullets, soul) => {
      n++;
      const near = n % 3 === 0;
      const x = near ? clamp(soul.x + rand(-5, 5), box.x + 5, box.x + box.w - 5) : rand(box.x + 5, box.x + box.w - 5);
      const scale = new Shot({ x, y: box.y - 4, vy: rand(34, 46), vx: 0, art: `prismScale${n % 7}`, life: 5 });
      // They sway: a sideways drift that turns.
      scale.sway = rand(0, 6.28);
      bullets.push(scale);
    });
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t < 5.2) fall(dt, bullets, soul);
        for (const b of bullets) {
          if (b.sway !== undefined && b.age > b.warn) b.vx = Math.sin(b.age * 2.4 + b.sway) * 14;
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
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (last && dt > 0) vel = { x: vel.x * 0.7 + ((soul.x - last.x) / dt) * 0.3, y: vel.y * 0.7 + ((soul.y - last.y) / dt) * 0.3 };
        last = { x: soul.x, y: soul.y };
        if (t < next || count >= 6 || t > 5) return;
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
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (beams < 4 && t >= 0.9 + beams * 1.25) {
          const x = Math.min(Math.max(soul.x, box.x + 2), box.x + box.w - 2);
          const color = BAND[(beams * 2 + 1) % 7];
          bullets.push(new Line({ x, y: box.y - 2, angle: Math.PI / 2, length: box.h + 4, thickness: 6, warn: 0.8, life: 0.3, color: color.c, glow: color.g }));
          beams++;
        }
        if (fired >= 2 || t < fired * 2.2 + 0.2) return;
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

  // Ricochet: shards of coloured glass spin into the box and glance off every
  // wall, a few at a time, one more colour each time, until the air is
  // full of them. They're slow; there are just a lot.
  prismBounce(box, density, { Shot, rand }) {
    let t = 0;
    let count = 0;
    let next = 0.2;
    return {
      duration: 6.8,
      update: (dt, bullets, soul) => {
        t += dt;
        if (t < next || count >= 7 || t > 4.4) return;
        next = t + 0.6;
        const y = box.y + rand(10, box.h - 10);
        const aim = Math.atan2(soul.y - y, soul.x - (box.x + box.w)) + rand(-0.3, 0.3);
        bullets.push(new Shot({
          x: box.x + box.w - 6, y, vx: Math.cos(aim) * 56, vy: Math.sin(aim) * 56, bounce: true,
          warn: 0.5, art: `prismShard${count % 7}`, life: 5.6,
        }));
        count++;
      },
    };
  },
};
