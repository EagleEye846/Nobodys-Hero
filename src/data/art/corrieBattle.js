import { Pix, flash, shift } from './ch5Kit.js';

// CORRIE, THE TIDECALLER, in battle: 60x74, drawn twice that at the right of
// the box, over the Last Light's lamp room. The same boy as his overworld
// figure (corrieFigure in coastFolk.js): about eight, pale and see-through, a
// skinny boy lost in a yellow oilskin far too big for him (he copied the
// Hero's coat). It is wet and shiny, heavy, hanging in deep folds; the hood is
// up over his wet hair, the sleeves swallow his hands, the hem drags, and in
// the gap at the front his thin bare shins hang down. Big tired eyes the
// colour of the sea, a driftwood staff taller than he is with a glow caught
// in its fork. He floats over a ripple, and the storm's green catches the
// back edge of him. He faces left, at you.
//
// One drawing, corrie(pose), posed by numbers, so every clip is the same boy
// moving: the coat ripples down from the shoulders, the staff sways, the drops
// fall off the hem and the cuffs, and the hood, the hair and the eyes change
// with how he is:
//   boy     hood up, hovering, the staff held out, sad and stubborn
//   storm   the storm has him: taller and darker, the hood blown back, his
//           hair lifting, his eyes gone storm-green and burning, lightning
//           crawling through the coat, the hem flaring and tearing into spray
//   whirl   below the waist he is water going round, the coat wound into it;
//           his arms flung out, the staff high
//   lamp    small and tired: the hood down, the coat slipping off one
//           shoulder, sitting in the air with his knees up, the staff leaning
//           on him, a tear; the lamp's warm light down his side
//   beaten  sunk low over the water, the staff across his knees, head down
//
// (2026-11-15, second redraw: bigger (was 44x58), a hood, real folds, a face
// that can show things, and long clips for each change. This morning's
// drawing is in notes/art-backup-2026-11-15/corrie-v2/.)

export const CORRIE_BATTLE_PALETTE = {
  k: '#0a1222',
  // The oilskin: highlight, base, shade, deep fold, the dark inside, a wet shine.
  Y: '#fff0a8', y: '#f0c84a', z: '#c4902c', Z: '#835c1c', x: '#3a2814', q: '#fffcec',
  // Taken by the storm: the same coat gone dark olive.
  o: '#d2dc74', O: '#93a244', P: '#4e6836', Q: '#243a28',
  // The storm's green rim light; on skin and hair.
  r: '#c8f290', R: '#94ecc8',
  // Skin (pale, a little see-through), shade, deeper shade, blush, tired shadows.
  c: '#e6f2f8', C: '#b2c8dc', b: '#8aa0bc', p: '#e8c4d6', v: '#a2a4d0',
  // Wet hair, its sheen, its shine.
  H: '#232c56', h: '#44558e', i: '#8094c8',
  // Eyes: the sea's green, its dark, pupil and lashes, shine.
  g: '#46d2bc', G: '#1c7a74', n: '#0c1630', w: '#ffffff',
  // The storm's eyes: green fire, white-hot core, the glow they leave.
  e: '#62ffa2', E: '#efffef', j: '#62ffa288',
  // Mouth.
  m: '#5c3a50', M: '#a4687e',
  // Driftwood: light, base, dark, knots.
  U: '#d2b48e', W: '#a48664', V: '#6c533a', X: '#43321f',
  // The staff's glow: cyan, white, deep, and its halo.
  T: '#8ff0ff', t: '#f2ffff', A: '#3aa8c8', a: '#8ff0ff70',
  // Water: the ripple, its dark, foam, drops, a fading trail.
  s: '#7fd4eecc', S: '#2f78a8cc', F: '#e4f8ffee', D: '#d8f6ff', d: '#a8e4f4aa',
  // Lightning in the coat.
  l: '#f4fff0',
  // The lamp's warm light; his undershirt (where the coat slips off).
  L: '#ffe0a0', K: '#ffc870', B: '#dfe3ee', N: '#a4acc2',
  // The waterspout: foam, light, body, shade, deep.
  1: '#f2fcff', 2: '#a4e4f6', 3: '#52a8d4', 4: '#2a6c9e', 5: '#173f6a',
};

const W = 60;
const H = 74;

const lerp = (a, b, k) => a + (b - a) * k;
const clamp01 = (k) => Math.max(0, Math.min(1, k));
const TAU = Math.PI * 2;

// A smooth curve through control points (quadratic or cubic Bezier).
function bez(pts, n = 24) {
  const out = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    let ps = pts.map((p) => [...p]);
    while (ps.length > 1) ps = ps.slice(1).map((p, j) => [lerp(ps[j][0], p[0], t), lerp(ps[j][1], p[1], t)]);
    out.push(ps[0]);
  }
  return out;
}
function curve(p, pts, c, thick = 1) {
  const out = bez(pts, 40);
  for (let i = 0; i + 1 < out.length; i++) p.line(out[i][0], out[i][1], out[i + 1][0], out[i + 1][1], c, thick);
  return out;
}

// Recolour the coat when the storm has him.
const STORM_COAT = { Y: 'o', y: 'O', z: 'P', Z: 'Q', q: 'o' };

/// The pose. Every number eases, so the changes can be played a frame at a time:
//   look      'boy' | 'storm' | 'whirl' | 'lamp' | 'beaten' (what he wears it as)
//   t         0-1 round the idle loop (the coat's ripple, the drops, the sway)
//   bob       px down as he hovers
//   rise      px taller (the storm stretching him)
//   cast      0-1 the staff raised, the glow swelling, the coat flaring
//   hood      1 up, 0 fallen back
//   eyes      'open' | 'tired' | 'shut' | 'wince' | 'storm' | 'wide' | 'down'
//   mouth     'small' | 'sad' | 'open' | 'shout' | 'wobble'
//   lift      0-1 his hair lifting
//   flare     0-1 the coat flaring out and tearing at the hem
//   storm     0-1 the storm's colour in the coat (over 0.5: the dark coat)
//   bolts     lightning in the coat (a number picks which)
//   spin      0-1 below the waist turned to water, going round (whirl)
//   slip      0-1 the coat slipping off his far shoulder
//   sit       0-1 knees drawn up, sitting in the air
//   droop     px his head hangs
//   staff     'hold' | 'raise' | 'high' | 'lean' | 'across' | 'clutch' | 'drop'
//   lean      px he leans back (a flinch)
//   rim       'storm' | 'lamp' | 'none'
//   tear, blink
const HALO = [];
const TATTERS = [0, 3, 1, 6, 0, 2, 5, 1, 0, 4, 7, 2, 0, 3];
function corrie(o = {}) {
  HALO.length = 0;
  const {
    look = 'boy', t = 0, bob = 0, rise = 0, cast = 0, hood = look === 'boy' ? 1 : 0,
    eyes = look === 'storm' || look === 'whirl' ? 'storm' : look === 'lamp' ? 'tired' : look === 'beaten' ? 'shut' : 'open',
    mouth = look === 'storm' || look === 'whirl' ? 'shout' : look === 'lamp' ? 'sad' : 'small',
    lift = look === 'storm' || look === 'whirl' ? 1 : 0, flare = look === 'storm' ? 1 : 0,
    storm = look === 'storm' || look === 'whirl' ? 1 : 0, bolts = look === 'storm' ? 1 : 0, spin = look === 'whirl' ? 1 : 0,
    slip = look === 'lamp' || look === 'beaten' ? 1 : 0, sit = look === 'lamp' ? 0.7 : look === 'beaten' ? 1 : 0,
    droop = look === 'lamp' ? 2 : look === 'beaten' ? 4 : 0,
    staff = look === 'whirl' ? 'high' : look === 'lamp' ? 'lean' : look === 'beaten' ? 'across' : 'hold',
    lean = 0, rim = look === 'lamp' || look === 'beaten' ? 'lamp' : 'storm', tear = look === 'lamp', blink = false,
  } = o;
  const p = new Pix(W, H);
  const ph = t * TAU;
  // Where he is: bob down, rise up, sink when sitting.
  // (Only the storm tears the coat and throws it up: `torn`.)
  const torn = storm > 0.5 && spin < 0.5 ? flare : 0;
  const by = bob - rise + sit * 4 + (look === 'beaten' ? 6 : 0);
  const cx = 32 + lean;
  // The head (droops forward and down when he's tired).
  const hx = 31 + lean + Math.round(droop * -0.4) + (lean > 0 ? 1 : 0);
  const hy = 18 + by - Math.round(rise * 0.3) + droop;
  // Shoulders and hem.
  const neckY = hy + 8;
  const shY = neckY + 2;
  const hem = (spin > 0.5 ? 43 : 62 - sit * 6 + (look === 'beaten' ? 2 : 0)) + by + Math.round(rise * 0.7) - Math.round(Math.min(1, torn) * 5);
  // The coat's sway: down the coat, the ripple runs a little behind the top.
  const sway = (y) => {
    const k = clamp01((y - shY) / Math.max(1, hem - shY));
    return Math.sin(ph - k * 2.4) * (0.6 + k * 1.4) * (1 + flare * 0.8) + flare * k * k * -3 - lean * k * 0.6;
  };

  // ---------------------------------------------------------------- below
  // The ripple he floats over (or the funnel he's become), drawn last.

  // ------------------------------------------------- the staff (behind arm)
  // Its foot and its fork, by pose. `sw` sways it with the coat.
  const sw = Math.sin(ph + 0.6) * 1.2;
  let s0;
  let s1;
  let bendK = 2;
  const castUp = cast * 7;
  switch (staff) {
    case 'raise': s0 = [12 + lean, 60 + by - castUp]; s1 = [9 + lean + sw * 0.4, 6 + by - castUp]; break;
    case 'high': s0 = [16 + lean, 44 + by - castUp]; s1 = [6 + lean + sw, 2 + by - castUp * 0.3]; bendK = 1; break;
    case 'lean': s0 = [18 + lean, 70]; s1 = [10 + lean + sw * 0.5, 16 + by]; bendK = 1.5; break;
    case 'across': s0 = [8, hem - 6]; s1 = [52, hem - 9]; bendK = 1; break;
    case 'clutch': s0 = [20 + lean, 68]; s1 = [14 + lean + sw * 0.5, 10 + by]; bendK = 1.5; break;
    case 'drop': s0 = [4, 72]; s1 = [26, 69]; bendK = 0.5; break;
    default: s0 = [13 + lean, 70 + by * 0.3]; s1 = [8 + lean + sw, 8 + by - castUp]; break;
  }
  if (staff === 'raise' || staff === 'hold') s0 = [s0[0], Math.min(73, s0[1])];
  // (The light never leaves the top of the picture.)
  if (s1[1] < 6) { s0 = [s0[0], s0[1] + 6 - s1[1]]; s1 = [s1[0], 6]; }
  const staffOpts = {
    glow: look === 'beaten' || staff === 'drop' ? 0 : (look === 'lamp' ? 0.45 : 1) + cast * 0.8 + (storm > 0.5 ? 0.4 : 0),
    green: storm > 0.5, t,
  };
  // (Across his knees, it's drawn over the coat, further on.)
  const staffPts = drawStaff(staff === 'across' ? new Pix(W, H) : p, s0, s1, bendK, staffOpts);

  // ------------------------------------------------------- the hood, behind
  const hoodBack = 1 - hood;
  if (hood > 0.05 || hoodBack > 0.05) {
    // Up: a big rounded hood over his head. Back: slumped on his shoulders.
    const hcx = lerp(hx + 7, hx + 2, hood);
    const hcy = lerp(neckY + 2, hy - 1, hood);
    const rx = lerp(8, 11.5, hood);
    const ry = lerp(5, 11.5, hood);
    p.ellipse(hcx, hcy, rx, ry, 'y');
    p.ellipse(hcx + rx * 0.35, hcy + ry * 0.2, rx * 0.7, ry * 0.75, 'z', 'y');
    p.ellipse(hcx - rx * 0.4, hcy - ry * 0.45, rx * 0.45, ry * 0.3, 'Y', 'y');
    // The seam down its middle.
    if (hood > 0.5) curve(p, [[hcx - 2, hcy - ry], [hcx + 5, hcy - ry * 0.4], [hcx + 7, hcy + ry * 0.6]], 'z');
    else curve(p, [[hcx - rx + 1, hcy - 1], [hcx, hcy - ry + 1], [hcx + rx - 1, hcy]], 'z');
  }

  // ---------------------------------------------------------- the far arm
  // (our right): its sleeve hangs limp from the drooping shoulder, past his
  // hand; flung out in the whirl; up with the other on the staff overhead.
  const farSh = [46 + lean, shY + 4 + slip * 4];
  let farCuff;
  if (spin > 0.5) farCuff = [55, shY - 7 + Math.sin(ph) * 1.5];
  else if (staff === 'high' && look !== 'whirl') farCuff = [20 + lean, shY - 14];
  else if (staff === 'raise' && cast > 0.7) farCuff = [s1[0] + 9, s1[1] + 16];
  else if (staff === 'across') farCuff = [44, hem - 8];
  else if (staff === 'clutch') farCuff = [22 + lean, shY + 6];
  else farCuff = [49 + lean + sway(shY + 20) * 0.6 + flare * 3, shY + 20 - sit * 4 - cast * 4];
  drawSleeve(p, farSh, farCuff, { far: true, flap: spin > 0.5 || flare > 0.5 ? Math.sin(ph * 2) : 0, t, drip: look !== 'whirl' });

  // ---------------------------------------------------------- the coat body
  const topY = shY;
  const halfAt = (y) => {
    const k = clamp01((y - topY) / Math.max(1, hem - topY));
    if (spin > 0.5) return 8 + k * 1.5;
    return 12.5 + Math.pow(k, 1.1) * 6.5 + sit * k * 4 + flare * k * k * 7 + torn * k * 3;
  };
  const endY = spin > 0.5 ? hem : hem + 3 + Math.round(Math.min(1, torn) * 6);
  const rows = [];
  for (let y = topY; y <= endY; y++) {
    const k = clamp01((y - topY) / Math.max(1, hem - topY));
    const half = halfAt(y);
    const s = sway(y);
    // A 3/4 view: more of the coat to our right (his back).
    const L = Math.round(cx - half * 0.92 + s);
    const R = Math.round(cx + half * 1.08 + s + k * 2);
    rows.push({ y, L, R, k, s });
  }
  // The hem: ragged, longer at the back, rippling.
  const hemAt = (x, r0) => {
    const u = (x - r0.L) / Math.max(1, r0.R - r0.L);
    let h = hem + (u > 0.55 ? (u - 0.55) * 7 : 0) + Math.sin(x * 0.7 + ph * 1.0) * 0.9;
    for (const fu of [0.3, 0.6, 0.82]) if (Math.abs(u - fu) < 0.05) h -= 1;
    // The storm's wind is under the coat: its sides are thrown up like wings.
    if (torn > 0.3) h -= Math.min(1.2, torn) * (u > 0.42 ? 15 * Math.pow((u - 0.42) / 0.58, 1.5) : 10 * Math.pow((0.42 - u) / 0.42, 1.5));
    if (((x * 7 + 3) % 11) === 0) h += 1;
    // Blown to ribbons in the storm: long tatters, streaming sideways.
    if (torn > 0.3) h += TATTERS[(((x + Math.floor(t * 16)) % TATTERS.length) + TATTERS.length) % TATTERS.length] * Math.min(1, torn);
    return Math.round(h);
  };
  const last = rows[rows.length - 1];
  for (const r of rows) {
    for (let x = r.L; x <= r.R; x++) {
      if ((torn > 0.3 || r.y > hem - 2) && r.y > hemAt(x, last)) continue;
      const u = (x - r.L) / Math.max(1, r.R - r.L);
      let c = u < 0.07 ? 'Y' : u < 0.45 ? 'y' : u < 0.78 ? 'z' : 'Z';
      p.set(x, r.y, c);
    }
  }
  // The shoulders: wider than the body, drooping, the far one slipping.
  const yk = spin > 0.5 ? 0.7 : 1;
  p.poly([[cx - 6, neckY], [cx + 7, neckY], [cx + 15 * yk, shY + 2 + slip * 3], [cx + 17 * yk, shY + 6 + slip * 4], [cx - 15 * yk, shY + 6], [cx - 13 * yk, shY + 2]], 'y');
  p.line(cx - 13 * yk, shY + 2, cx - 5, neckY, 'Y');
  p.line(cx - 14 * yk, shY + 3, cx - 15 * yk, shY + 6, 'Y');
  p.line(cx + 8, neckY + 1, cx + 16 * yk, shY + 4 + slip * 3, 'z');
  // A shadow under the yoke, where it lifts off his chest.
  p.line(cx - 12 * yk, shY + 7, cx + 15 * yk, shY + 7 + slip * 3, 'z');

  // Folds: three long deep ones hanging from the shoulders, curving with
  // the sway; a lit ridge, a dark trough, and the hem scalloped under them.
  const folds = [{ u: 0.3, from: 0.2 }, { u: 0.6, from: 0.04 }, { u: 0.82, from: 0.32 }];
  for (const [i, f] of folds.entries()) {
    for (const r of rows) {
      if (r.k < f.from || r.y >= hem + 3) continue;
      const wob = Math.sin(ph - r.k * 3 + i * 1.7) * 0.03 * (r.k + 0.2);
      const x = Math.round(r.L + (r.R - r.L) * (f.u + wob));
      if (r.y > hemAt(x, last)) continue;
      const d = r.k - f.from;
      p.put(x - 1, r.y, f.u < 0.5 ? 'Y' : 'y', ['y', 'z', 'Z']);
      p.put(x, r.y, d > 0.15 ? 'Z' : 'z', ['Y', 'y', 'z', 'Z']);
      if (d > 0.3) p.put(x + 1, r.y, f.u > 0.5 ? 'x' : 'Z', ['Y', 'y', 'z', 'Z']);
      if (d > 0.45 && f.u > 0.5) p.put(x + 2, r.y, 'Z', ['y', 'z']);
    }
  }
  // Wet shine: two long bright streaks down the lit side.
  for (const [fx, fy, len] of [[0.08, 0.18, 6], [0.27, 0.3, 4]]) {
    const r = rows[Math.round(fy * (rows.length - 1))];
    if (!r) continue;
    for (let j = 0; j < len; j++) {
      const rr = rows[Math.min(rows.length - 1, Math.round(fy * (rows.length - 1)) + j)];
      p.put(Math.round(rr.L + (rr.R - rr.L) * fx), rr.y, j === 0 || j === len - 1 ? 'Y' : 'q', ['Y', 'y']);
    }
  }


  // The front: buttoned at the top, open below, his thin shins in the gap.
  if (spin < 0.5) {
    const fu = 0.32;
    const gapFrom = topY + Math.round((hem - topY) * (0.42 - sit * 0.15));
    for (const r of rows) {
      if (r.y >= hem + 2) continue;
      const x = Math.round(r.L + (r.R - r.L) * fu);
      if (r.y < gapFrom) {
        p.put(x, r.y, 'Z', ['Y', 'y', 'z']);
        p.put(x - 1, r.y, 'Y', ['y', 'z']);
      } else {
        const open = Math.min(5, 1 + (r.y - gapFrom) * 0.35 + sit * 2);
        for (let dx = -Math.floor(open / 2); dx <= Math.ceil(open / 2); dx++) p.set(x + dx, r.y, Math.abs(dx) >= open / 2 - 0.5 ? 'Z' : 'x');
        p.set(x - Math.floor(open / 2) - 1, r.y, 'Y');
      }
    }
    // Toggles (wood, on cords), down the closed part.
    for (const j of [0.12, 0.22, 0.32]) {
      const r = rows[Math.round(j * (rows.length - 1))];
      if (!r || r.y >= gapFrom) continue;
      const x = Math.round(r.L + (r.R - r.L) * fu);
      p.set(x, r.y, 'V'); p.set(x + 1, r.y, 'X'); p.set(x - 1, r.y, 'U');
    }
    // His legs: thin, bare, the feet hanging toes down, swinging a little.
    if (sit < 0.5) {
      const r = rows[rows.length - 1];
      const fx = Math.round(r.L + (r.R - r.L) * fu);
      const kick = Math.round(Math.sin(ph + 1.2) * 0.8);
      // (Held up by the storm, they hang right out of the coat, limp, swinging.)
      const dangle = Math.round(Math.min(1, torn) * 5);
      for (const [dx, k2] of [[-1, 0], [2, kick]]) {
        const top = hem - 4;
        const limp = (y) => (y > hem ? k2 + Math.round(Math.sin(ph + (y - hem) * 0.35 + dx) * Math.min(1, torn) * 1.2) : 0);
        for (let y = top; y <= hem + 4 + dangle; y++) p.set(fx + dx + limp(y), y, y > hem + 2 + dangle ? 'c' : dx < 0 ? 'C' : 'c');
        const fy = hem + 5 + dangle;
        p.set(fx + dx + limp(fy) - 1, fy, 'c');
        p.set(fx + dx + limp(fy), fy, 'C');
        if (dangle > 2) { p.set(fx + dx + limp(fy) - 1, fy + 1, 'c'); p.set(fx + dx + limp(fy) - 2, fy + 1, 'C'); }
      }
    } else {
      // Knees up under the coat: two round bumps; the feet tucked under the hem.
      const r = rows[Math.round(rows.length * 0.55)];
      for (const [u, c] of [[0.24, 'Y'], [0.48, 'y']]) {
        const x = Math.round(r.L + (r.R - r.L) * u);
        p.ellipse(x, r.y, 3.2, 2.4, c, ['Y', 'y', 'z', 'Z', 'x']);
        p.ellipse(x + 1, r.y + 1, 2.4, 1.4, 'y', ['Y', 'y', 'z', 'Z', 'x', 'q']);
        p.put(x - 2, r.y - 1, 'q', ['Y', 'y']);
      }
      for (const dx of [-2, 2]) {
        const x = Math.round(last.L + (last.R - last.L) * 0.34) + dx;
        p.set(x, hem + 1, 'c'); p.set(x + 1, hem + 1, 'C'); p.set(x, hem + 2, 'c');
      }
    }
  }

  // The whirl: below the waist, the coat wound into the water going round.
  if (spin > 0.5) {
    drawSpout(p, cx, hem - 3, t);
  }

  // The coat slipping off his far shoulder: his own thin shoulder in its undershirt.
  if (slip > 0.5) {
    // His thin shoulder in its undershirt, bare where the coat has slid off.
    p.poly([[cx + 3, neckY - 1], [cx + 9, neckY + 1], [cx + 13, neckY + 4], [cx + 12, neckY + 6], [cx + 3, neckY + 4]], 'B');
    p.line(cx + 4, neckY + 4, cx + 12, neckY + 5, 'N');
    p.line(cx + 6, neckY, cx + 11, neckY + 2, 'c');
    p.set(cx + 12, neckY + 3, 'C');
    // The coat's edge where it's slipped, a fold of it hanging off his arm.
    p.line(cx + 3, neckY + 5, cx + 13, neckY + 7, 'Y');
    p.line(cx + 3, neckY + 6, cx + 13, neckY + 8, 'z');
  }

  // ------------------------------------------- the collar, up round his ears
  const colTop = neckY - 6 - (hood > 0.5 ? 0 : 1);
  p.poly([[cx - 9, colTop + 1], [cx - 6, colTop + 3], [cx - 4, neckY + 3], [cx - 9, neckY + 3]], 'Y');
  p.line(cx - 9, colTop + 1, cx - 9, neckY + 2, 'q');
  p.line(cx - 6, colTop + 3, cx - 4, neckY + 2, 'y');
  if (slip < 0.5) {
    p.poly([[cx + 6, colTop + 2], [cx + 10, colTop], [cx + 10, neckY + 3], [cx + 5, neckY + 3]], 'z');
    p.line(cx + 10, colTop, cx + 10, neckY + 2, 'Z');
  }
  // The collar's dark inside, and his thin neck coming out of it.
  p.rect(cx - 5, neckY, 10, 3, 'x');
  p.rect(hx - 1, hy + 5, 4, neckY - hy - 3, 'C');
  p.rect(hx - 1, hy + 5, 1, neckY - hy - 3, 'c');

  // ------------------------------------------------------------- the head
  drawHead(p, hx, hy, { hood, eyes, mouth, lift, t, tear, blink, storm, look });

  if (staff === 'across') drawStaff(p, s0, s1, bendK, staffOpts);

  // ------------------------------------------------- the near arm (our left)
  // Its sleeve bunched round the staff, three fingertips showing on it.
  const grip = pointOn(staffPts, staff === 'across' ? 0.2 : staff === 'high' ? 0.62 : staff === 'lean' ? 0.6 : staff === 'clutch' ? 0.55 : staff === 'raise' ? 0.6 : 0.37);
  const nearSh = [cx - 8, shY + 3];
  if (staff === 'drop') drawSleeve(p, nearSh, [cx - 14, hem - 6], { t, drip: true });
  else drawSleeve(p, nearSh, [grip[0] + 3, grip[1] + 1], { t, hand: grip, drip: false });
  if (staff === 'clutch') drawSleeve(p, [cx - 4, shY + 6], [grip[0] + 4, grip[1] + 7], { t, hand: [grip[0], grip[1] + 6], drip: false });

  // --------------------------------------------------------- the lightning
  if (bolts) drawBolts(p, rows, hem, bolts, t);

  // ------------------------------------------------------- the storm's coat
  if (storm > 0.5) {
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const v = p.get(x, y);
      if (STORM_COAT[v]) p.set(x, y, STORM_COAT[v]);
    }
  }

  p.outline('k');
  for (const [hx0, hy0, hr] of HALO) p.ellipse(hx0, hy0, hr, hr, 'a', '.');

  // ------------------------------------------------------------- rim light
  // The storm's green (or the lamp's warmth) on his back edge.
  if (rim !== 'none') {
    const warm = rim === 'lamp';
    for (let y = 0; y < H; y++) {
      for (let x = W - 1; x >= 1; x--) {
        const v = p.get(x, y);
        if (v === '.' || v === 'k') continue;
        const out = p.get(x + 1, y) === 'k' || p.get(x + 1, y) === '.';
        if (!out) continue;
        if ('YyzZoOPqx'.includes(v)) p.set(x, y, warm ? 'L' : 'r');
        else if ('cCbHhiBN'.includes(v)) p.set(x, y, warm ? 'K' : 'R');
        if (warm && 'yzZoOPx'.includes(p.get(x - 1, y))) p.set(x - 1, y, 'K');
      }
    }
  }

  // ----------------------------------------------- water: under him, drops
  if (spin < 0.5) {
    const ry = Math.min(72, (look === 'beaten' ? hem + 3 : 71));
    const rr = (look === 'beaten' ? 16 : 11) + Math.sin(ph) * 1.2;
    for (let x = Math.round(cx - rr); x <= Math.round(cx + rr); x++) {
      const u = (x - cx) / rr;
      const yy = ry + Math.round(Math.sqrt(Math.max(0, 1 - u * u)) * 1.2);
      if (p.get(x, yy) === '.') p.set(x, yy, Math.abs(u) > 0.75 ? 'F' : 's');
      if (p.get(x, ry - 1) === '.' && Math.abs(u) > 0.5) p.set(x, ry - 1 + (Math.abs(u) > 0.85 ? 1 : 0), 'S');
    }
    // A ring spreading out from under him.
    const k = (t * 2) % 1;
    const r2 = rr * 0.6 + k * 8;
    for (const dx of [-1, 1]) p.set(Math.round(cx + dx * r2), ry + 1, k < 0.7 ? 'F' : 's');
  }
  // Drops off the hem and the cuffs, falling.
  if (look !== 'whirl') {
    const drops = [[0.2, 0], [0.55, 0.37], [0.85, 0.71]];
    for (const [u, off] of drops) {
      const x = Math.round(last.L + (last.R - last.L) * u);
      const k = (t + off) % 1;
      const y = hemAt(x, last) + 2 + Math.round(k * 9);
      if (y < H - 1 && p.get(x, y) === '.') { p.set(x, y, 'D'); if (p.get(x, y - 1) === '.') p.set(x, y - 1, 'd'); }
    }
  }
  return p.rows();
}

function pointOn(pts, k) {
  return pts[Math.max(0, Math.min(pts.length - 1, Math.round(k * (pts.length - 1))))];
}

// The staff: crooked driftwood, the grain pale on its lit side, knots, and a
// fork at the top with the glow caught in it.
function drawStaff(p, s0, s1, bendK, { glow, green, t }) {
  const mx = (s0[0] + s1[0]) / 2 + bendK * 1.5;
  const my = (s0[1] + s1[1]) / 2;
  const q1 = [lerp(s0[0], mx, 0.6) - bendK, lerp(s0[1], my, 0.6)];
  const q2 = [lerp(mx, s1[0], 0.4) + bendK, lerp(my, s1[1], 0.4)];
  const pts = bez([s0, q1, q2, s1], 48);
  for (let i = 0; i + 1 < pts.length; i++) p.line(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], 'W', 3);
  for (let i = 0; i + 1 < pts.length; i++) {
    p.line(pts[i][0] - 1, pts[i][1], pts[i + 1][0] - 1, pts[i + 1][1], 'U');
    p.line(pts[i][0] + 1, pts[i][1], pts[i + 1][0] + 1, pts[i + 1][1], 'V');
  }
  // Knots and a split in the grain.
  for (const k of [0.22, 0.48, 0.71]) {
    const [x, y] = pointOn(pts, k);
    p.set(x, y, 'X'); p.set(x + 1, y + 1, 'V');
  }
  if (glow <= 0) {
    p.set(s1[0], s1[1], 'V');
    return pts;
  }
  // The fork: two prongs curling up and in, round the light.
  const [tx, ty] = s1;
  const dir = Math.atan2(s1[1] - s0[1], s1[0] - s0[0]);
  const ux = Math.cos(dir);
  const uy = Math.sin(dir);
  const nx = -uy;
  const ny = ux;
  const ox = tx + ux * 3.5;
  const oy = ty + uy * 3.5;
  curve(p, [[tx, ty], [tx + nx * 4 + ux * 1, ty + ny * 4 + uy * 1], [ox + nx * 2.5 + ux * 2.5, oy + ny * 2.5 + uy * 2.5]], 'W', 2);
  curve(p, [[tx, ty], [tx - nx * 4 + ux * 1, ty - ny * 4 + uy * 1], [ox - nx * 2.5 + ux * 2.5, oy - ny * 2.5 + uy * 2.5]], 'V', 2);
  // The light, breathing.
  const pulse = 0.5 + 0.5 * Math.sin(t * TAU * 2);
  const r = 1.6 + glow * 1.1 + pulse * 0.4;
  HALO.push([ox, oy, r + 2.6]);
  p.ellipse(ox, oy, r, r, green ? 'e' : 'T');
  p.ellipse(ox - 0.4, oy - 0.4, Math.max(0.6, r - 1.2), Math.max(0.6, r - 1.2), green ? 'E' : 't');
  if (glow > 1.2) {
    // Sparks coming off it.
    for (let i = 0; i < 5; i++) {
      const a = t * TAU + i * 1.26;
      const d = r + 3 + ((i * 3 + Math.floor(t * 12)) % 3);
      p.set(ox + Math.cos(a) * d, oy + Math.sin(a) * d, green ? 'e' : 't');
    }
  }
  return pts;
}

// Draws a sleeve on its own and lays it over the coat with a dark line
// round it where it crosses the coat (so the arm reads against the body).
function drawSleeve(p, sh, cuff, opts) {
  const q = new Pix(W, H);
  sleeveShape(q, sh, cuff, opts);
  const filled = q.g.map((row) => row.map((v) => v !== '.'));
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (filled[y][x]) { p.set(x, y, q.g[y][x]); continue; }
    const edge = filled[y - 1]?.[x] || filled[y + 1]?.[x] || filled[y][x - 1] || filled[y][x + 1];
    if (edge && p.get(x, y) !== '.' && !'cCDT'.includes(p.get(x, y))) p.set(x, y, 'x');
  }
}

// A sleeve: a wide limp tube from the shoulder, widening to a bell of a cuff
// that swallows his hand. `hand`: the fingertips showing round the staff.
function sleeveShape(p, sh, cuff, { far = false, flap = 0, hand = null, t = 0, drip = false } = {}) {
  const [x0, y0] = sh;
  let [x1, y1] = cuff;
  const dx = x1 - x0;
  const dy = y1 - y0;
  const len = Math.max(1, Math.hypot(dx, dy));
  const ux = dx / len;
  const uy = dy / len;
  const nx = -uy;
  const ny = ux;
  // A sag in the middle (the sleeve's empty weight), and a flap at the end.
  const sag = 2 + flap * 2;
  const steps = Math.ceil(len * 2);
  for (let i = 0; i <= steps; i++) {
    const k = i / steps;
    const w = lerp(3.2, 4.6, k * k) + (k > 0.85 ? (k - 0.85) * 8 : 0);
    const bx = x0 + dx * k + Math.sin(k * Math.PI) * sag * (far ? 0.4 : -0.2);
    const byy = y0 + dy * k + Math.sin(k * Math.PI) * sag * 0.6 + (k > 0.8 ? flap * (k - 0.8) * 10 : 0);
    for (let j = -w; j <= w; j += 0.5) {
      const px = bx + nx * j;
      const py = byy + ny * j;
      const side = j / w; // -1 .. 1
      const lit = far ? side < -0.5 : side < -0.3;
      const dark = far ? side > 0.2 : side > 0.55;
      p.set(px, py, lit ? 'Y' : dark ? (far ? 'Z' : 'z') : far ? 'z' : 'y');
    }
  }
  // Creases round the elbow, where it bunches.
  for (const k of [0.45, 0.58, 0.7]) {
    const bx = x0 + dx * k;
    const byy = y0 + dy * k + Math.sin(k * Math.PI) * sag * 0.6;
    p.line(bx + nx * 2, byy + ny * 2, bx - nx * 1 + ux * 1.5, byy - ny * 1 + uy * 1.5, far ? 'Z' : 'z');
  }
  // A wet shine along the top.
  if (!far) for (let k = 0.15; k < 0.5; k += 0.08) p.put(x0 + dx * k - nx * 2.2, y0 + dy * k - ny * 2.2 + Math.sin(k * Math.PI) * sag * 0.6, 'q', ['Y', 'y']);
  // The open cuff: dark inside.
  const ex = x1 + ux * 0.5;
  const ey = y1 + uy * 0.5 + flap * 2;
  p.ellipse(ex, ey, 2.4, 2.4, 'x');
  p.ellipse(ex - ux, ey - uy, 1.4, 1.4, 'Z');
  if (hand) {
    // Fingertips curled round the staff, in front of it.
    const [hx, hy] = hand;
    p.set(hx - 1, hy, 'c'); p.set(hx - 1, hy + 1, 'c'); p.set(hx - 1, hy + 2, 'C');
    p.set(hx, hy, 'C');
  }
  if (drip) {
    const k = (t * 1.3 + (far ? 0.3 : 0)) % 1;
    p.set(ex, ey + 3 + Math.round(k * 7), 'D');
  }
}

// The head: too big for him, a pointed chin, wet hair plastered to his
// forehead in points, and big eyes.
function drawHead(p, hx, hy, { hood, eyes, mouth, lift, t, tear, blink, storm, look }) {
  const ph = t * TAU;
  // The face.
  p.ellipse(hx, hy, 7, 7.4, 'c');
  p.ellipse(hx - 1, hy + 3, 5.5, 4.6, 'c');
  p.rect(hx - 3, hy + 7, 4, 1, 'c');
  p.set(hx - 2, hy + 8, 'c'); p.set(hx - 1, hy + 8, 'C');
  // The far side of his face in shade, and his ear.
  p.ellipse(hx + 5, hy + 1, 2.4, 5.4, 'C', 'c');
  p.ellipse(hx + 6, hy + 2, 1.4, 2, 'C');
  p.set(hx + 6, hy + 2, 'b');
  // Under the chin.
  p.line(hx - 2, hy + 8, hx + 3, hy + 6, 'C');
  // Hair. Under the hood: just the plastered fringe. Hood back: the whole of
  // it, wet, lying flat, strands stuck to his neck; lifting in the storm.
  if (hood < 0.5) {
    // Wet, flat, dark: clumped in points round the edge, a parting, strands
    // stuck down the back of his neck, a sheen where the light's on it.
    p.ellipse(hx + 1, hy - 5, 8.4, 4.8, 'H');
    p.ellipse(hx + 5, hy - 1.5, 4, 5, 'H');
    for (const [dx, dy, len] of [[-7, -2, 3], [-8, 0, 2], [7, 1, 4], [9, 2, 6], [6, 3, 7], [8, 4, 9]]) {
      p.poly([[hx + dx - 1.2, hy + dy - 1], [hx + dx + 1.2, hy + dy - 1], [hx + dx + (dx > 0 ? 0.6 : -0.3), hy + dy + len * (1 - lift * 0.8)]], 'H');
    }
    // Tufts on top, stuck up where it dried a little.
    if (lift < 0.05) for (const [dx, dy] of [[-3, -9], [0, -10], [2, -9]]) { p.set(hx + dx, hy + dy, 'H'); p.set(hx + dx + 1, hy + dy + 1, 'H'); }
    // The parting and the strands.
    curve(p, [[hx - 1, hy - 9], [hx + 2, hy - 6], [hx + 3, hy - 3]], 'h');
    curve(p, [[hx + 3, hy - 8], [hx + 6, hy - 5], [hx + 7, hy - 1]], 'h');
    curve(p, [[hx - 5, hy - 6], [hx - 3, hy - 8], [hx - 1, hy - 9]], 'i');
    p.set(hx - 4, hy - 7, 'i'); p.set(hx + 4, hy - 7, 'i');
    if (lift > 0.05) {
      // Lifting: strands rising off his head, swaying, their ends lit.
      const tops = [[-7, 5], [-5, 7], [-3, 9], [-1, 7], [1, 10], [3, 8], [5, 9], [7, 7], [9, 5]];
      for (const [j, [dx, len]] of tops.entries()) {
        const L = len * lift;
        const wob = Math.sin(ph * 2 + j * 1.3) * 2 * lift;
        const bx = hx + dx;
        const byy = hy - 6 + Math.abs(dx) * 0.25;
        curve(p, [[bx, byy + 2], [bx - wob + 1, byy - L * 0.5], [bx + wob + 2, byy - L]], j % 3 === 1 ? 'h' : 'H', j % 2 ? 1 : 2);
        p.set(bx + wob + 2, byy - L, storm > 0.5 ? 'e' : 'i');
      }
    }
  }
  // The fringe: wet points stuck to his forehead, one hanging between his eyes.
  p.ellipse(hx + 0.5, hy - 6.5, 7.4, 2, 'H');
  if (lift < 0.6) {
    for (const [dx, len, w] of [[-6.5, 2, 1.2], [-4, 5, 1.4], [-1.5, 2, 1.1], [1, 4, 1.3], [3.5, 2, 1.1], [5.5, 3, 1]]) {
      p.poly([[hx + dx - w, hy - 5], [hx + dx + w, hy - 5], [hx + dx - 0.5, hy - 4 + len]], 'H');
    }
    // Wet shine on the clumps.
    p.set(hx - 4, hy - 5, 'h'); p.set(hx - 4, hy - 4, 'h'); p.set(hx - 1, hy - 6, 'i'); p.set(hx + 2, hy - 5, 'h');
  } else {
    p.set(hx - 2, hy - 6, 'h'); p.set(hx + 1, hy - 7, 'i');
  }
  // A drop running off a point of the fringe.
  if (look !== 'storm' && look !== 'whirl') {
    const k = (t * 1.5) % 1;
    if (k < 0.6) p.set(hx - 5, hy + Math.round(k * 4), 'D');
  }

  // The eyes. Near (left) is bigger; both look at you.
  const eyeY = hy;
  const near = { x: hx - 6, w: 4 };
  const farE = { x: hx + 1, w: 3 };
  for (const [idx, e] of [near, farE].entries()) {
    const { x, w } = e;
    const kind = blink && eyes !== 'storm' ? 'shut' : eyes;
    if (kind === 'shut') {
      // Closed, the lid curving down: sad sleep.
      p.set(x, eyeY + 2, 'n');
      for (let i = 1; i < w; i++) p.set(x + i, eyeY + 3, 'n');
      p.set(x + w - 1, eyeY + 2, 'n');
      if (idx === 0) p.set(x - 1, eyeY + 2, 'n');
      p.set(x + 1, eyeY + 4, 'v');
    } else if (kind === 'wince') {
      // Screwed shut: > <.
      p.line(x, eyeY + 1, x + w - 1, eyeY + 2, 'n');
      p.line(x, eyeY + 3, x + w - 1, eyeY + 2, 'n');
    } else if (kind === 'storm') {
      // Green fire, no pupils, the glow streaming back off them.
      p.rect(x, eyeY, w, 4, 'e');
      p.rect(x + 1, eyeY + 1, w - 2 || 1, 2, 'E');
      p.rect(x, eyeY - 1, w, 1, 'n');
      const k = Math.floor(t * 8) % 3;
      for (let i = 1; i <= 3; i++) if (p.get(x + w + i + k, eyeY + 1 - (i > 1 ? 1 : 0)) !== 'e') p.set(x + w + i + k + idx * 2, eyeY + 1 - Math.floor(i / 2), 'j');
    } else {
      const tired = kind === 'tired' || kind === 'down';
      const wide = kind === 'wide';
      // The white of the eye is hardly there: big irises, like a child's.
      p.rect(x, eyeY - (wide ? 1 : 0), w, 5 + (wide ? 1 : 0), 'g');
      p.rect(x, eyeY - (wide ? 1 : 0), w, 2, 'G');
      // Pupil, looking left at you (down at the floor when `down`).
      const pdx = kind === 'down' ? 0 : 0;
      const pdy = kind === 'down' ? 2 : 1;
      p.rect(x + pdx, eyeY + pdy, idx === 0 ? 2 : 2, wide ? 2 : 3, 'n');
      // Shine.
      p.set(x + pdx + (idx === 0 ? 1 : 1), eyeY + pdy, 'w');
      if (idx === 0) p.set(x + w - 1, eyeY + 3, 'T');
      // Lashes / upper lid, the outer corner flicking out.
      p.rect(x, eyeY - 1 - (wide ? 1 : 0), w, 1, 'n');
      if (idx === 0) p.set(x - 1, eyeY - (wide ? 1 : 0), 'n');
      else p.set(x + w, eyeY - 1, 'n');
      if (tired) {
        // Heavy lids, half down, and shadows under.
        // Heavy lids, half down: skin over the top of the eye, the lash line
        // low across it, the iris and pupil peeping under; shadows beneath.
        p.rect(x, eyeY - 1, w, 2, 'c');
        p.rect(x, eyeY + 1, w, 1, 'n');
        if (idx === 0) p.set(x - 1, eyeY + 1, 'n'); else p.set(x + w, eyeY + 1, 'n');
        p.set(x + 1, eyeY + 2, 'w');
        p.rect(x, eyeY + 5, w, 1, 'v');
      } else if (!wide) {
        // A soft lower lid.
        p.rect(x, eyeY + 5, w, 1, 'c');
        p.set(x + 1, eyeY + 5, 'v');
      }
    }
  }
  // Brows: thin, worried (inner ends up); down and in when he shouts.
  if (eyes === 'storm') {
    p.line(near.x - 1, eyeY - 3, near.x + 3, eyeY - 1, 'H');
    p.line(farE.x, eyeY - 1, farE.x + 3, eyeY - 3, 'H');
  } else if (eyes !== 'wince') {
    p.line(near.x - 1, eyeY - 2, near.x + 3, eyeY - 3 - (eyes === 'wide' ? 1 : 0), 'H');
    p.line(farE.x, eyeY - 3 - (eyes === 'wide' ? 1 : 0), farE.x + 2, eyeY - 2, 'H');
  } else {
    p.line(near.x, eyeY - 1, near.x + 3, eyeY, 'H');
    p.line(farE.x, eyeY, farE.x + 2, eyeY - 1, 'H');
  }
  // A little nose; a faint flush on his cheek.
  p.set(hx - 3, hy + 4, 'C');
  if (eyes !== 'storm') { p.set(near.x, eyeY + 6, 'p'); p.set(near.x + 1, eyeY + 6, 'p'); p.set(farE.x + 2, eyeY + 6, 'p'); }
  // The mouth.
  const mx = hx - 3;
  const my = hy + 6;
  if (mouth === 'shout') {
    p.rect(mx - 1, my - 1, 3, 3, 'm'); p.rect(mx, my, 1, 2, 'M');
    // (The storm's light is in his mouth too.)
    if (storm > 0.5) { p.rect(mx - 1, my - 1, 3, 4, 'n'); p.rect(mx, my, 1, 2, 'e'); p.set(mx, my, 'E'); }
  }
  else if (mouth === 'open') { p.rect(mx, my - 1, 2, 2, 'm'); p.set(mx, my, 'M'); }
  else if (mouth === 'sad') { p.set(mx - 1, my, 'm'); p.set(mx, my - 1, 'm'); p.set(mx + 1, my - 1, 'm'); p.set(mx + 2, my, 'm'); }
  else if (mouth === 'wobble') { p.set(mx - 1, my, 'm'); p.set(mx, my - 1, 'm'); p.set(mx + 1, my, 'm'); p.set(mx + 2, my - 1, 'm'); }
  else if (mouth === 'grit') { p.rect(mx - 1, my - 1, 4, 2, 'm'); p.rect(mx - 1, my - 1, 4, 1, 'w'); }
  else { p.rect(mx, my - 1, 2, 1, 'm'); }
  // A tear.
  if (tear && eyes !== 'storm') {
    const k = (t * 1.2) % 1;
    p.set(near.x + 1, eyeY + 6, 'D');
    p.set(near.x + 1, eyeY + 7 + Math.round(k * 2), 'D');
  }

  // The hood, up, framing his face: its thick lit rim round the top and front,
  // its shadow just over his hair.
  if (hood > 0.5) {
    const k = (hood - 0.5) * 2;
    const top = hy - 9 - Math.round((1 - k) * 2);
    curve(p, [[hx - 9, hy + 5], [hx - 11, top + 1], [hx - 2, top - 3], [hx + 8, top]], 'Y', 3);
    curve(p, [[hx - 10, hy + 5], [hx - 12, top + 1], [hx - 3, top - 4], [hx + 8, top - 1]], 'q');
    curve(p, [[hx - 8, hy + 5], [hx - 9, top + 3], [hx - 1, top], [hx + 7, top + 2]], 'z');
  }
}

// Lightning crawling through the coat: thin jagged white forks with a green
// glow, a different few each frame, so it seems to run about under the oilskin.
const hash = (n) => {
  const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return v - Math.floor(v);
};
function drawBolts(p, rows, hem, seed, t) {
  const n = Math.floor(t * 8) + seed * 5;
  const count = 1 + (seed > 1 ? 1 : 0) + (n % 2);
  for (let i = 0; i < count; i++) {
    const h0 = n * 3.7 + i * 11.3;
    let u = 0.15 + hash(h0) * 0.7;
    let k = 0.08 + hash(h0 + 1) * 0.45;
    let r = rows[Math.round(k * (rows.length - 1))];
    let x = Math.round(r.L + (r.R - r.L) * u);
    let y = r.y;
    const steps = 5 + Math.floor(hash(h0 + 2) * 4);
    for (let j = 0; j < steps; j++) {
      const nx = x + Math.round((hash(h0 + j * 2.1) - 0.5) * 6);
      const ny = y + 2 + Math.floor(hash(h0 + j * 3.3) * 3);
      const m = Math.max(Math.abs(nx - x), Math.abs(ny - y), 1);
      for (let s2 = 0; s2 <= m; s2++) {
        const px = Math.round(x + ((nx - x) * s2) / m);
        const py = Math.round(y + ((ny - y) * s2) / m);
        if (!'YyzZqx'.includes(p.get(px, py))) continue;
        p.set(px, py, 'l');
        if ('YyzZqx'.includes(p.get(px + 1, py))) p.set(px + 1, py, 'e');
      }
      // A little fork off the side now and then.
      if (hash(h0 + j * 5.9) > 0.7) {
        const fx = nx + (hash(h0 + j) > 0.5 ? 2 : -2);
        if ('YyzZqx'.includes(p.get(fx, ny + 1))) p.set(fx, ny + 1, 'e');
        if ('YyzZqx'.includes(p.get(fx + Math.sign(fx - nx), ny + 2))) p.set(fx + Math.sign(fx - nx), ny + 2, 'l');
      }
      x = nx;
      y = ny;
      if (y > hem) break;
    }
  }
}

// What he is below the waist in the whirl: a waterspout. A rope of water
// standing up off the floor, wide and boiling where it starts, wound tight
// under him, bending as it turns; bands of foam climb round it, and spray is
// thrown off its sides.
const fract1 = (v) => v - Math.floor(v);
function drawSpout(p, cx, top, t) {
  const bottom = 73;
  const n = bottom - top;
  const prof = (k) => (k < 0.3 ? 6.5 + 4.5 * (1 - k / 0.3) ** 2 : 6.5 + 20 * ((k - 0.3) / 0.7) ** 1.9);
  const mid = (k) => cx + Math.sin(k * 5.2 - t * TAU) * 2.6 * Math.sin(k * Math.PI);
  // (How far round its turn a band of foam is, at angle `a` round the column.)
  const bandAt = (a, k) => fract1(a / Math.PI + k * 4.6 - t);
  for (let y = top; y <= bottom; y++) {
    const k = (y - top) / n;
    const c0 = mid(k);
    const base = prof(k);
    // The foam ridges stand out from its sides.
    const hl = base + (bandAt(-Math.PI / 2, k) < 0.28 ? 1.4 : 0);
    const hr = base + (bandAt(Math.PI / 2, k) < 0.28 ? 1.4 : 0);
    for (let x = Math.round(c0 - hl); x <= Math.round(c0 + hr); x++) {
      const u = Math.max(-1, Math.min(1, (x - c0) / base));
      const v = bandAt(Math.asin(u), k);
      let c = u < -0.6 ? '2' : u < 0.2 ? '3' : u < 0.68 ? '4' : '5';
      if (v < 0.2) c = u > 0.62 ? '3' : u > 0.25 ? '2' : '1';
      else if (v < 0.3) c = u > 0.5 ? '4' : '2';
      else if (v > 0.9) c = u < -0.6 ? '3' : u < 0.2 ? '4' : '5';
      // The tails of his coat, wound into the top of it.
      else if (k < 0.42 && v > 0.5 && v < 0.5 + 0.32 * (1 - k / 0.42)) c = u < -0.5 ? 'Y' : u < 0.3 ? 'y' : u < 0.7 ? 'z' : 'Z';
      p.set(x, y, c);
    }
  }
  // Where he meets it: a collar of froth.
  for (let x = -11; x <= 11; x++) {
    const h = Math.round(1.5 + Math.sin(x * 1.3 + t * TAU * 2) * 1.2);
    for (let j = 0; j <= h; j++) p.set(cx + x, top + 2 - j - Math.round((x * x) / 50), j === h || Math.abs(x) > 9 ? '1' : '2');
  }
  // Where it meets the floor: it boils outward, crests jumping.
  for (let x = 3; x <= 56; x++) {
    const h = Math.round(1.5 + Math.sin(x * 0.9 - t * TAU * 2) * 1.5 + Math.sin(x * 0.37 + t * TAU) * 1.2);
    for (let j = 0; j < h; j++) p.set(x, bottom - j, j === h - 1 ? '1' : '2');
  }
  // Spray thrown off its sides, round and up.
  for (let i = 0; i < 9; i++) {
    const kk = fract1(i * 0.37 + t);
    const y = bottom - 3 - kk * (n - 8);
    const k = (y - top) / n;
    const side = i % 2 ? 1 : -1;
    const x = mid(k) + side * (prof(k) + 2.5 + Math.sin(kk * Math.PI) * 3);
    p.set(x, y, '1');
    p.set(x - side, y + 1, 'D');
    if (i % 3 === 0) p.set(x + side, y - 2, 'd');
  }
}

// ---------------------------------------------------------------- the clips
const N = 8;
const loop = (n, f) => Array.from({ length: n }, (_, i) => f(i / n, i));
const bobAt = (k) => Math.round(1 + Math.sin(k * TAU));

// A look's ordinary clips. `base` is its pose; idle has 8 frames (the coat's
// ripple travels down, the staff sways, drops fall, he bobs).
function clips(base, { hurtHood = false } = {}) {
  return {
    idle: {
      fps: 7,
      frames: loop(N, (k, i) => corrie({ ...base, t: k, bob: bobAt(k), blink: i === 5 && base.look === 'boy' })),
    },
    // Casting: the staff comes up, the coat flares, the light swells.
    windup: {
      fps: 9,
      frames: [0.2, 0.5, 0.8, 1, 1, 1].map((c, i) => corrie({ ...base, t: i / 6, bob: 0, cast: c, flare: Math.max(base.flare ?? (base.look === 'storm' ? 1 : 0), c * 0.6), mouth: i > 1 ? (base.look === 'lamp' ? 'open' : 'shout') : base.mouth, staff: base.staff === 'lean' ? 'hold' : base.staff === 'across' ? 'hold' : base.staff, eyes: base.look === 'boy' && i > 2 ? 'wide' : base.eyes })),
    },
    talk: {
      fps: 6,
      frames: loop(4, (k, i) => corrie({ ...base, t: k, bob: bobAt(k), mouth: i % 2 ? 'open' : base.mouth ?? 'small' })),
    },
    // A flinch: knocked back, eyes screwed shut, the hood flying back.
    hurt: {
      fps: 11,
      frames: [
        flash(shift(corrie({ ...base, eyes: 'wince', mouth: 'open', lean: 2, hood: hurtHood ? 0.6 : base.hood }), 3, 0)),
        shift(corrie({ ...base, t: 0.1, eyes: 'wince', mouth: 'open', lean: 3, hood: hurtHood ? 0 : base.hood, flare: 0.6 }), 3, 0),
        shift(corrie({ ...base, t: 0.2, eyes: 'wince', mouth: base.look === 'boy' ? 'sad' : base.mouth, lean: 2, hood: hurtHood ? 0 : base.hood }), 2, 0),
        shift(corrie({ ...base, t: 0.3, eyes: base.look === 'boy' ? 'wide' : base.eyes, lean: 1, hood: hurtHood ? 0.6 : base.hood }), 1, 0),
        corrie({ ...base, t: 0.4, hood: base.hood }),
      ],
    },
  };
}

const BOY = { look: 'boy' };
const STORM = { look: 'storm', rise: 3 };
const WHIRL = { look: 'whirl' };
const LAMP = { look: 'lamp' };

export const CORRIE_BATTLE_SPRITE = corrie(BOY);
export const CORRIE_STORM_SPRITE = corrie({ ...STORM, bob: 1 });
export const CORRIE_WHIRL_SPRITE = corrie({ ...WHIRL, bob: 1 });
export const CORRIE_LAMP_SPRITE = corrie({ ...LAMP, bob: 1 });
// Beaten: low over the water, the staff across his knees, head down. Still there.
export const CORRIE_BEATEN_SPRITE = corrie({ look: 'beaten' });

// --- The changes. Each later phase's `intro` plays as it starts (with the
// battle's own shake and the stage's flashes, corrieStage.js): long enough to
// watch him change.

// (Each is timed to the room's own timeline, CHANGES in src/battle/corrieStage.js:
// the white frame is the moment of the strike, the geyser, the lamp catching.)
const flip = (rows) => rows.map((row) => [...row].reverse().join(''));

// THE STORM (8 a second; the strike lands on frame 7): he looks up, scared;
// it gets into him (he clutches the staff, shaking, his eyes flickering
// green, the hood working back); the strike; and he comes up out of the white
// taller and dark, the coat thrown up round him, the staff over his head,
// his legs hanging; it strikes twice more before he settles.
const toStorm = [
  corrie({ ...BOY, t: 0, bob: 1, eyes: 'wide', mouth: 'open' }),
  shift(corrie({ ...BOY, t: 0.05, bob: 1, eyes: 'wide', mouth: 'open', lean: 1 }), 1, 0),
  shift(corrie({ ...BOY, t: 0.1, bob: 0, eyes: 'wince', mouth: 'grit', hood: 0.8, staff: 'clutch' }), -1, 0),
  shift(corrie({ ...BOY, t: 0.15, bob: 0, eyes: 'storm', mouth: 'grit', hood: 0.6, staff: 'clutch', rim: 'storm' }), 1, 0),
  shift(corrie({ ...BOY, t: 0.2, bob: 1, eyes: 'wince', mouth: 'grit', hood: 0.4, staff: 'clutch', bolts: 1 }), -1, 0),
  shift(corrie({ ...BOY, t: 0.25, bob: 1, eyes: 'storm', mouth: 'open', hood: 0.2, staff: 'clutch', bolts: 2, lift: 0.3 }), 1, 0),
  corrie({ ...BOY, t: 0.3, bob: 2, eyes: 'wince', mouth: 'open', hood: 0, lift: 0.5, staff: 'clutch', bolts: 2 }),
  flash(corrie({ ...STORM, t: 0.3, rise: 0, flare: 0.5, cast: 0.5 }), 'w'),
  flash(corrie({ ...STORM, t: 0.35, rise: 2, flare: 0.8, cast: 0.8, staff: 'raise' }), 'e'),
  corrie({ ...STORM, t: 0.4, rise: 3, flare: 0.8, cast: 0.8, staff: 'raise', bolts: 3 }),
  corrie({ ...STORM, t: 0.45, rise: 5, flare: 1.1, cast: 1, staff: 'raise', bolts: 2 }),
  flash(corrie({ ...STORM, t: 0.5, rise: 6, flare: 1.2, cast: 1, staff: 'raise' }), 'l'),
  shift(corrie({ ...STORM, t: 0.55, rise: 6, flare: 1.2, cast: 1, staff: 'raise', bolts: 3 }), 1, 0),
  shift(corrie({ ...STORM, t: 0.6, rise: 6, flare: 1.2, cast: 1, staff: 'raise', bolts: 1 }), -1, 0),
  corrie({ ...STORM, t: 0.65, rise: 6, flare: 1.1, cast: 1, staff: 'raise', bolts: 2 }),
  corrie({ ...STORM, t: 0.7, rise: 5, cast: 1, staff: 'raise', bolts: 3 }),
  corrie({ ...STORM, t: 0.75, rise: 5, cast: 0.6, staff: 'raise' }),
  corrie({ ...STORM, t: 0.8, rise: 4, cast: 0.8, bolts: 2 }),
  flash(corrie({ ...STORM, t: 0.85, rise: 4, cast: 1 }), 'e'),
  corrie({ ...STORM, t: 0.9, rise: 4, cast: 0.5, bolts: 3 }),
  corrie({ ...STORM, t: 0.95, rise: 3, cast: 0.2, bolts: 2 }),
  corrie({ ...STORM, t: 0, rise: 3, bob: 1 }),
];

// THE WHIRLPOOL (8 a second; the sea bursts up on frame 7): the wind takes
// him round, faster and faster; then the water comes up through the floor
// under him and he rides up on it, the staff high.
const toWhirl = [
  corrie({ ...STORM, t: 0, bob: 1 }),
  shift(corrie({ ...STORM, t: 0.12, lean: -2, flare: 1.2, cast: 0.4 }), -2, 0),
  flip(corrie({ ...STORM, t: 0.2, flare: 1.2 })),
  shift(corrie({ ...STORM, t: 0.3, lean: 2, flare: 1.2, bolts: 2 }), 1, 0),
  flip(corrie({ ...STORM, t: 0.4, flare: 1.2, rise: 4 })),
  corrie({ ...STORM, t: 0.5, flare: 1.2, rise: 5, bolts: 3 }),
  flip(corrie({ ...STORM, t: 0.6, flare: 1.2, rise: 5 })),
  flash(shift(corrie({ ...WHIRL, t: 0.1 }), 0, 20), '1'),
  shift(corrie({ ...WHIRL, t: 0.2, cast: 0.3 }), 0, 13),
  shift(corrie({ ...WHIRL, t: 0.3, cast: 0.6 }), 0, 6),
  corrie({ ...WHIRL, t: 0.4, bob: -1, cast: 1 }),
  shift(corrie({ ...WHIRL, t: 0.5, bob: -1, cast: 1 }), -1, 0),
  shift(corrie({ ...WHIRL, t: 0.6, bob: 0, cast: 1 }), 1, 0),
  shift(corrie({ ...WHIRL, t: 0.7, bob: 1, cast: 1 }), 0, 1),
  corrie({ ...WHIRL, t: 0.8, bob: 1, cast: 0.8 }),
  corrie({ ...WHIRL, t: 0.9, bob: 2, cast: 0.5 }),
  corrie({ ...WHIRL, t: 0, bob: 1, cast: 0.2 }),
  corrie({ ...WHIRL, t: 0.125, bob: 1 }),
  corrie({ ...WHIRL, t: 0.25, bob: 2 }),
  corrie({ ...WHIRL, t: 0.375, bob: 2 }),
  corrie({ ...WHIRL, t: 0.5, bob: 1 }),
  corrie({ ...WHIRL, t: 0.625, bob: 0 }),
  corrie({ ...WHIRL, t: 0.75, bob: 0 }),
  corrie({ ...WHIRL, t: 0.875, bob: 0 }),
];

// THE LAMP (8 a second; the lamp catches on frame 6): the dark; then the
// light finds him. The spout falls away under him, the green goes out of his
// coat and his eyes, and he drops into a small tired boy sitting in the air,
// the coat sliding off his shoulder.
const toLamp = [
  corrie({ ...WHIRL, t: 0, bob: 1 }),
  corrie({ ...WHIRL, t: 0.125, bob: 1 }),
  corrie({ ...WHIRL, t: 0.25, bob: 2 }),
  shift(corrie({ ...WHIRL, t: 0.375, bob: 2 }), 1, 0),
  shift(corrie({ ...WHIRL, t: 0.5, bob: 1 }), -1, 0),
  corrie({ ...WHIRL, t: 0.625, bob: 0 }),
  flash(corrie({ ...WHIRL, t: 0.7, eyes: 'wince' }), 'L'),
  flash(corrie({ ...WHIRL, t: 0.75, eyes: 'wince', mouth: 'open' }), 'w'),
  shift(corrie({ ...WHIRL, t: 0.8, eyes: 'wince', mouth: 'open', rim: 'lamp' }), 0, 4),
  shift(corrie({ ...WHIRL, t: 0.85, eyes: 'wince', mouth: 'open', rim: 'lamp', storm: 0 }), 0, 11),
  shift(corrie({ ...WHIRL, t: 0.9, eyes: 'wide', mouth: 'open', rim: 'lamp', storm: 0, lift: 0.5 }), 0, 19),
  corrie({ ...BOY, t: 0.4, hood: 0, eyes: 'wide', mouth: 'open', rim: 'lamp', lift: 0.3, flare: 0.3, bob: -4 }),
  corrie({ ...BOY, t: 0.5, hood: 0, eyes: 'wide', mouth: 'open', rim: 'lamp', lift: 0.1, bob: 0 }),
  corrie({ ...BOY, t: 0.6, hood: 0, eyes: 'open', mouth: 'small', rim: 'lamp', slip: 0.6, sit: 0.2, droop: 1, bob: 4 }),
  corrie({ ...LAMP, t: 0.7, eyes: 'open', sit: 0.4, droop: 1, tear: false, bob: 3 }),
  corrie({ ...LAMP, t: 0.8, eyes: 'tired', sit: 0.6, tear: false, bob: 1 }),
  corrie({ ...LAMP, t: 0.9, bob: 1, blink: true }),
  corrie({ ...LAMP, t: 0.95, bob: 1 }),
];

// Beaten: the light goes out of the staff, his head drops, he sinks down
// over the water and stays.
const fall = [
  corrie({ ...LAMP, t: 0, eyes: 'wince', mouth: 'open' }),
  shift(corrie({ ...LAMP, t: 0.1, eyes: 'wide', mouth: 'open', lean: 2 }), 2, 0),
  corrie({ ...LAMP, t: 0.2, eyes: 'tired', mouth: 'small', bob: 2 }),
  corrie({ ...LAMP, t: 0.3, eyes: 'shut', staff: 'lean', bob: 3, sit: 0.8, droop: 3, tear: true }),
  corrie({ ...LAMP, t: 0.4, eyes: 'shut', staff: 'drop', bob: 5, sit: 0.9, droop: 4 }),
  corrie({ look: 'beaten', t: 0.5, bob: -3 }),
  corrie({ look: 'beaten', t: 0.6, bob: -1 }),
  corrie({ look: 'beaten', t: 0.7, bob: 0 }),
  CORRIE_BEATEN_SPRITE,
];

// The struggle, at the very end (his last tenth): bent over the staff,
// both sleeves on it, shaking, the storm flickering back into his eyes and
// out again.
const struggle = [
  corrie({ ...LAMP, t: 0, staff: 'clutch', eyes: 'wince', mouth: 'grit', sit: 0.5 }),
  shift(corrie({ ...LAMP, t: 0.17, staff: 'clutch', eyes: 'storm', mouth: 'grit', sit: 0.5, bolts: 1, lift: 0.3, rim: 'storm' }), 1, 0),
  corrie({ ...LAMP, t: 0.33, staff: 'clutch', eyes: 'wince', mouth: 'grit', sit: 0.5 }),
  shift(corrie({ ...LAMP, t: 0.5, staff: 'clutch', eyes: 'tired', mouth: 'wobble', sit: 0.5 }), -1, 0),
  corrie({ ...LAMP, t: 0.67, staff: 'clutch', eyes: 'storm', mouth: 'shout', sit: 0.5, bolts: 2, lift: 0.4, rim: 'storm' }),
  shift(corrie({ ...LAMP, t: 0.83, staff: 'clutch', eyes: 'wince', mouth: 'grit', sit: 0.5 }), 1, 0),
];

export const CORRIE_BOY_ANIM = clips(BOY, { hurtHood: true });
export const CORRIE_STORM_ANIM = {
  ...clips(STORM),
  intro: { fps: 8, frames: toStorm },
};
export const CORRIE_WHIRL_ANIM = {
  ...clips(WHIRL),
  intro: { fps: 8, frames: toWhirl },
};
export const CORRIE_LAMP_ANIM = {
  ...clips(LAMP),
  intro: { fps: 8, frames: toLamp },
  // Below his last tenth (the battle plays `low` in place of idle there).
  low: { fps: 7, frames: struggle },
  // Beaten: he sinks low over the water, and stays.
  death: { fps: 6, frames: fall },
};

// For the scenes after: the storm taking him one last time (rising, staff
// up, eyes green, hair lifting), and him spent, sitting in the air. Not used
// by the battle; any close-up can play them.
export const CORRIE_FINALE_ANIM = {
  // Rising out of the slump: once.
  rise: {
    fps: 6,
    frames: [
      CORRIE_BEATEN_SPRITE,
      corrie({ look: 'beaten', t: 0.1, eyes: 'storm', bob: 0 }),
      corrie({ ...LAMP, t: 0.2, eyes: 'storm', mouth: 'open', staff: 'clutch', bob: 4, lift: 0.4, bolts: 1, rim: 'storm' }),
      corrie({ ...LAMP, t: 0.3, eyes: 'storm', mouth: 'grit', staff: 'clutch', bob: 1, sit: 0.3, lift: 0.7, bolts: 2, storm: 0.6, rim: 'storm' }),
      corrie({ ...STORM, t: 0.4, rise: 2, staff: 'raise', cast: 0.5, slip: 1 }),
      corrie({ ...STORM, t: 0.5, rise: 5, staff: 'raise', cast: 1, slip: 1 }),
    ],
  },
  // Up, the staff over his head, held there: a loop.
  possessed: {
    fps: 7,
    frames: loop(6, (k) => corrie({ ...STORM, t: k, rise: 5 + Math.round(Math.sin(k * TAU)), staff: 'raise', cast: 1, slip: 1, bolts: 1 + Math.floor(k * 3) })),
  },
};
