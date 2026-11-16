import { Pix, dissolve, recolour, clip } from './pixKit.js';

// The TIDEWIGHT, 48x52: a shape of black water out of the deepest of the
// Soundings' wells, standing up out of its own pool as tall as the tide has
// risen. It has the outline of somebody (shoulders, a long head, two arms that
// hang a little too far) but it is only the water, the dark kind you can't see
// the bottom of. Two pale hollows for eyes. Down inside it, small and amber and
// quite steady, hang the old sounders' work lamps, like a few lit windows in
// the dark. Foam runs along its edges. Idle, it sways with the swell; before an
// attack it climbs up taller and the lamps crowd in; hit, it splashes apart and
// pulls itself back; beaten, it slumps into a flat black puddle; spared, it
// settles down level and the lamps drift off down into it one by one.
// Drawn in code (see pixKit.js): every frame is the same drawing with a pose.
export const TIDEWIGHT_PALETTE = {
  k: '#050a14',
  b: '#0e1a2c',
  B: '#17304a',
  d: '#235070',
  m: '#3a7f9c',
  c: '#8fd8e4',
  f: '#d6f4f4',
  e: '#e8fafa',
  y: '#ffc65c',
  Y: '#ffefa6',
  o: '#c8832a',
  t: '#ffffff',
};

const W = 48;
const H = 52;

// pose: ph (swell), rise (how tall it stands, 0.5 to 1.1), arms (0 hanging, 1 reaching up), mouth (0 shut, 1 open),
// lamps (how many are lit), lampPh (their drift), sag (slumped), dy.
function drawWight(pose) {
  const { ph = 0, rise = 1, arms = 0, mouth = 0, lamps = 3, lampPh = 0, sag = 0, dy = 0, eyes = 'open', spray = 0 } = pose;
  const g = new Pix(W, H);
  const cx = 24;
  const base = 47 + dy;
  const top = base - 40 * rise * (1 - sag * 0.7);

  // The pool it stands in, wider than it is, with rings.
  g.disc(cx, base + 1, 21, 4.2, 'b');
  g.disc(cx, base + 2, 17, 2.2, 'B', 'b');
  g.disc(cx + Math.sin(ph) * 3, base, 16 + Math.sin(ph) * 2, 2.8, 'd', 'b');
  g.disc(cx, base, 12, 1.4, 'b');

  // The body: row by row, a head, shoulders, a body that spreads into the pool.
  const body = [];
  for (let y = Math.round(top); y <= base; y++) {
    const t = (y - top) / Math.max(1, base - top);
    let hw;
    if (t < 0.2) hw = 4.5 + t * 14;
    else if (t < 0.3) hw = 7.3 + (t - 0.2) * 52;
    else hw = 12.5 + (t - 0.3) * 8;
    hw *= 1 - sag * 0.2;
    const wob = Math.sin(ph + y * 0.28) * (0.8 + t * 1.8);
    const l = Math.round(cx - hw + wob);
    const r = Math.round(cx + hw + wob);
    body.push({ y, l, r, t });
    for (let x = l; x <= r; x++) {
      const inner = x - l;
      let c = 'b';
      if ((x * 3 + y * 5 + Math.round(ph * 2)) % 11 === 0) c = 'B';
      if (inner < 2 && t > 0.12) c = 'B';
      g.set(x, y, c);
    }
  }
  // Slow streaks of lighter water running down inside it.
  for (const s of [-7, -1, 6]) {
    for (const row of body) {
      if (row.t < 0.25 || row.t > 0.95) continue;
      if (Math.sin(ph * 1.2 + row.y * 0.45 + s) > 0.4) g.set(cx + s + Math.sin(ph + row.y * 0.3) * 2, row.y, 'B');
    }
  }
  // Foam along the edges and a rim of light on the left (the lit side).
  for (const row of body) {
    if (row.t < 0.05) continue;
    g.set(row.l, row.y, row.y % 4 === 0 ? 'f' : 'm');
    g.set(row.l + 1, row.y, row.y % 3 === 0 ? 'd' : 'B');
    if (row.y % 5 === 2) g.set(row.r, row.y, 'c');
  }
  // Top of the head: a rim of light too.
  const head = body.slice(0, 3);
  for (const row of head) for (let x = row.l; x <= row.r; x++) if (row === head[0]) g.set(x, row.y, 'm');

  // Arms: long, hanging a little too far, outside the body, ending in drips; or up, reaching, when it's about to attack.
  for (const side of [-1, 1]) {
    const sy = top + 12 * rise;
    const sx = cx + side * 12;
    const ex = cx + side * (21 + arms * 2 + Math.sin(ph + side) * 1.2);
    const ey = sy + 21 * rise * (1 - arms * 1.8) + (arms ? -5 : 0);
    const mx = cx + side * (19 + arms * 1);
    const my = sy + (ey - sy) * 0.45;
    g.line(sx, sy, mx, my, 'B', 4);
    g.line(mx, my, ex, ey, 'B', 3);
    g.line(sx + side, sy - 2, mx + side, my - 1, 'm', 1);
    g.line(mx + side, my - 1, ex + side, ey, 'm', 1);
    g.line(mx - side, my, ex - side, ey, 'b', 1);
    g.disc(ex, ey + 1, 2.4, 3, 'B');
    g.set(ex, ey + 4, 'c');
    g.set(ex + side, ey + 6 + Math.round((ph * 2) % 2), 'c');
    g.set(ex - side, ey + 8 + Math.round((ph * 3) % 3), 'm');
  }

  // The face: two pale hollows and a long dark mouth.
  const fy = top + 8 * rise + 1;
  const ex = eyes === 'shut' ? 0 : 1;
  if (eyes === 'x') {
    for (const sx of [cx - 3, cx + 3]) { g.set(sx - 1, fy - 1, 'e'); g.set(sx + 1, fy - 1, 'e'); g.set(sx, fy, 'e'); g.set(sx - 1, fy + 1, 'e'); g.set(sx + 1, fy + 1, 'e'); }
  } else if (eyes === 'shut') {
    g.line(cx - 5, fy, cx - 1, fy, 'e', 1);
    g.line(cx + 1, fy, cx + 5, fy, 'e', 1);
  } else {
    g.disc(cx - 3, fy, 1.1 + ex * 0.1, 2.8, 'e');
    g.disc(cx + 3, fy, 1.1 + ex * 0.1, 2.8, 'e');
    g.set(cx - 3, fy + 2, 'c');
    g.set(cx + 3, fy + 2, 'c');
  }
  const my = fy + 5;
  if (mouth > 0) g.disc(cx, my, 2.2 + mouth, 2 + mouth * 1.8, 'k');
  else g.line(cx - 2, my, cx + 2, my, 'k', 1);

  // The sounders' lamps, down inside it, drifting a little.
  const spots = [[-4, 0.46], [5, 0.58], [-1, 0.7], [-7, 0.8], [8, 0.78]];
  for (let i = 0; i < Math.min(lamps, spots.length); i++) {
    const [ox, ot] = spots[i];
    const lx = Math.round(cx + ox + Math.sin(lampPh + i * 1.9) * 2);
    const ly = Math.round(top + (base - top) * ot + Math.cos(lampPh * 0.8 + i * 1.3) * 2);
    g.set(lx - 1, ly, 'o');
    g.set(lx + 1, ly, 'o');
    g.set(lx, ly - 1, 'o');
    g.set(lx, ly, 'y');
    g.set(lx, ly + 1, 'Y');
    g.set(lx - 1, ly + 1, 'y');
    g.set(lx + 1, ly + 1, 'y');
    g.set(lx, ly + 2, 'o');
  }
  // Spray flung off it.
  for (let i = 0; i < spray; i++) {
    const a = i * 2.4 + ph;
    g.set(cx + Math.cos(a) * (14 + i * 1.7), top + 10 + Math.sin(a) * 9 - i, i % 2 ? 'c' : 'f');
  }
  g.outline('k');
  return g.rows();
}

const FLASH = { b: 'd', B: 'm', d: 'c', m: 'f', c: 'f' };

export const TIDEWIGHT_SPRITE = drawWight({ ph: 0.6 });

export const TIDEWIGHT_ANIM = {
  chips: ['#0e1a2c', '#3a7f9c', '#ffc65c'],
  // It sways on the swell; the lamps drift.
  idle: clip(5, [0, 1, 2, 3, 4, 5], (i) => drawWight({ ph: i * 1.05, rise: 1 + Math.sin(i) * 0.03, lampPh: i * 0.8, mouth: i === 4 ? 0.5 : 0 })),
  // It climbs up taller, its arms come up, the lamps crowd in and the mouth opens.
  windup: clip(8, [0, 1, 2, 3, 4, 5], (i) => drawWight({ ph: i * 0.9, rise: 1 + i * 0.03, arms: Math.min(1, i * 0.22), mouth: i > 2 ? 1 : 0.3, lamps: 3 + (i > 2 ? 2 : 0), lampPh: i * 1.4 })),
  hurt: clip(12, [0, 1, 2, 3], (i) => {
    const rows = drawWight({ ph: 1.5 + i, rise: 0.85, mouth: 1, eyes: 'x', lamps: 2, lampPh: i * 2, spray: 7, dy: i === 1 ? 1 : 0 });
    return i === 0 ? recolour(rows, FLASH) : rows;
  }),
  death: clip(4, [0, 1, 2, 3, 4, 5], (i) => dissolve(drawWight({ ph: 1 + i, rise: 1 - i * 0.14, sag: Math.min(1, i * 0.25), eyes: 'x', mouth: 1, lamps: Math.max(0, 3 - i), lampPh: i, dy: 0 }), i >= 4 ? (i - 3) * 0.15 : 0, 9)),
  spared: clip(4, [0, 1, 2, 3], (i) => drawWight({ ph: i * 0.8, rise: 0.82, eyes: 'shut', lamps: 3 - Math.min(3, i), lampPh: i * 1.8 + 3, mouth: 0 })),
};
