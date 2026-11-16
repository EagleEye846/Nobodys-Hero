import { SCREEN_WIDTH as W, SCREEN_HEIGHT as H } from '../config.js';

// THE NIGHT THE FAIR RETURN WENT DOWN (chapter 5): three whole-screen memories, one in each piece of her
// binnacle compass, shown as you take the piece (the scenes glass_memory, needle_memory and card_memory).
// Each stands on its own, in any order. Drawn like the dreams in visions.js (which lists them), in world
// pixels, from the seconds since it began and its `mood`:
//   wreck_light  'calm'  the brig under sail in a fog, a lighthouse on a headland ahead sweeping its beam
//                'out'   the light gutters, flares once, and goes out
//   wreck_star   'calm'  the brig far out in the fog
//                'fall'  a light falling slowly out of the sky toward her bow
//                'struck' a flash at her bow, and after it a small blue light that stays
//   wreck_shore  'calm'  a shore at night; a small figure on the rocks from behind, in a coat far too big,
//                        a sword too long for him; the brig out on the water, listing
//                'sink'  she goes down, her lantern last

function hash(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
const px = (ctx, color, x, y, w = 1, h = 1) => { ctx.fillStyle = color; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
const clamp = (v) => Math.max(0, Math.min(1, v));

const SEA_TOP = 150;

// The night: sky, a few stars through the fog, the sea with slow glints, and fog drifting across.
function night(ctx, t, { fog = 0.35, seaTop = SEA_TOP } = {}) {
  const sky = ctx.createLinearGradient(0, 0, 0, seaTop);
  sky.addColorStop(0, '#04060c');
  sky.addColorStop(1, '#101a28');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, seaTop);
  for (let i = 0; i < 40; i++) {
    const a = 0.25 + 0.35 * hash(i + 9) * (0.6 + 0.4 * Math.sin(t * 1.3 + i));
    ctx.fillStyle = `rgba(200, 214, 240, ${a.toFixed(3)})`;
    ctx.fillRect(Math.floor(hash(i) * W), Math.floor(hash(i + 50) * (seaTop - 30)), 1, 1);
  }
  const sea = ctx.createLinearGradient(0, seaTop, 0, H);
  sea.addColorStop(0, '#0a121c');
  sea.addColorStop(1, '#03060a');
  ctx.fillStyle = sea;
  ctx.fillRect(0, seaTop, W, H - seaTop);
  for (let i = 0; i < 60; i++) {
    const y = seaTop + 2 + Math.floor(hash(i + 200) * (H - seaTop - 4));
    const len = 2 + Math.floor(hash(i + 300) * 6 * (1 + (y - seaTop) / 60));
    const x = ((hash(i + 400) * W + t * (4 + (y - seaTop) * 0.08)) % (W + 20)) - 10;
    const a = 0.08 + 0.18 * (0.5 + 0.5 * Math.sin(t * 2 + i));
    ctx.fillStyle = `rgba(120, 150, 180, ${a.toFixed(3)})`;
    ctx.fillRect(Math.round(x), y, len, 1);
  }
  fogBands(ctx, t, fog, seaTop);
}

function fogBands(ctx, t, amount, seaTop) {
  for (let i = 0; i < 5; i++) {
    const y = seaTop - 40 + i * 18 + Math.sin(t * 0.3 + i) * 4;
    const g = ctx.createLinearGradient(0, y - 14, 0, y + 14);
    g.addColorStop(0, 'rgba(150, 165, 185, 0)');
    g.addColorStop(0.5, `rgba(150, 165, 185, ${(amount * 0.22).toFixed(3)})`);
    g.addColorStop(1, 'rgba(150, 165, 185, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, y - 14, W, 28);
  }
}

// The brig, side on, bow to the left: hull, two masts with their sails set, a lantern at the stern. `s` scales
// her (1 is about 70 px long). `list` leans her (radians), `sink` (0 to 1) lowers her into the water line `wl`.
function brig(ctx, x, y, { s = 1, list = 0, sink = 0, lantern = 1, bowLight = 0, t = 0 } = {}) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, W, y + 2);
  ctx.clip();
  ctx.translate(x, y + sink * 60 * s);
  ctx.rotate(list + Math.sin(t * 0.9) * 0.02);
  ctx.scale(s, s);
  const HULL = '#05070b';
  const SAIL = '#2c3646';
  const SAIL_LIT = '#3c4858';
  // Hull: a long low shape, the bow sheer rising to the left.
  ctx.fillStyle = HULL;
  ctx.beginPath();
  ctx.moveTo(-36, -10);
  ctx.lineTo(30, -7);
  ctx.lineTo(34, -12);
  ctx.lineTo(36, 0);
  ctx.lineTo(-28, 0);
  ctx.closePath();
  ctx.fill();
  // Bowsprit.
  ctx.fillRect(-50, -14, 16, 1);
  // Masts and yards.
  for (const mx of [-12, 12]) {
    ctx.fillStyle = HULL;
    ctx.fillRect(mx, -62, 2, 54);
    for (const [yy, half] of [[-56, 9], [-44, 12], [-30, 15]]) {
      ctx.fillStyle = HULL;
      ctx.fillRect(mx - half, yy, half * 2 + 2, 1);
      ctx.fillStyle = yy === -30 ? SAIL_LIT : SAIL;
      ctx.fillRect(mx - half + 1, yy + 1, half * 2, 10);
    }
  }
  // Rigging to the bowsprit.
  ctx.fillStyle = HULL;
  for (let i = 0; i < 16; i++) ctx.fillRect(-12 - i * 2.4, -62 + i * 3, 1, 1);
  // The stern lantern.
  if (lantern > 0) {
    ctx.fillStyle = `rgba(255, 210, 120, ${lantern.toFixed(3)})`;
    ctx.fillRect(31, -15, 2, 2);
    const g = ctx.createRadialGradient(32, -14, 0, 32, -14, 8);
    g.addColorStop(0, `rgba(255, 200, 110, ${(0.4 * lantern).toFixed(3)})`);
    g.addColorStop(1, 'rgba(255, 200, 110, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(24, -22, 16, 16);
  }
  // A small blue light at her bow (the figurehead), once the star has struck.
  if (bowLight > 0) {
    const g = ctx.createRadialGradient(-36, -11, 0, -36, -11, 10);
    g.addColorStop(0, `rgba(170, 220, 255, ${(0.7 * bowLight).toFixed(3)})`);
    g.addColorStop(1, 'rgba(170, 220, 255, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(-46, -21, 20, 20);
    ctx.fillStyle = `rgba(230, 245, 255, ${bowLight.toFixed(3)})`;
    ctx.fillRect(-37, -12, 2, 2);
  }
  ctx.restore();
  // Her reflection, a broken dark smear under her on the water.
  for (let i = 0; i < 6; i++) px(ctx, 'rgba(0, 0, 0, 0.35)', x - 30 * s + hash(i) * 50 * s, y + 3 + i * 2, (8 + hash(i + 7) * 14) * s, 1);
}

// 1. The lighthouse going dark ahead of her.
function drawLight(ctx, t, mood, moodTime) {
  night(ctx, t, { fog: mood === 'out' ? 0.35 + clamp(moodTime / 3) * 0.3 : 0.35 });
  // The headland on the left, the tower on it.
  ctx.fillStyle = '#04060a';
  ctx.beginPath();
  ctx.moveTo(0, SEA_TOP - 18);
  ctx.lineTo(40, SEA_TOP - 22);
  ctx.lineTo(70, SEA_TOP - 8);
  ctx.lineTo(96, SEA_TOP + 2);
  ctx.lineTo(0, SEA_TOP + 2);
  ctx.closePath();
  ctx.fill();
  px(ctx, '#0a0d14', 34, SEA_TOP - 62, 10, 42);
  px(ctx, '#121824', 35, SEA_TOP - 62, 2, 42);
  px(ctx, '#0a0d14', 32, SEA_TOP - 64, 14, 3);
  px(ctx, '#0a0d14', 35, SEA_TOP - 76, 8, 12);
  px(ctx, '#0a0d14', 34, SEA_TOP - 79, 10, 3);
  // The lamp: steady, then (`out`) a gutter, one flare, and gone.
  let lamp = 1;
  if (mood === 'out') {
    if (moodTime < 1.0) lamp = 0.55 + 0.45 * Math.abs(Math.sin(moodTime * 23));
    else if (moodTime < 1.3) lamp = 1.4;
    else lamp = Math.max(0, 1 - (moodTime - 1.3) / 0.5) * 0.4;
  }
  if (lamp > 0) {
    const cx = 39;
    const cy = SEA_TOP - 70;
    // The beam, sweeping out over the sea and back.
    const a = Math.sin(t * 0.9) * 0.3 + 0.08;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(a);
    const g = ctx.createLinearGradient(0, 0, 260, 0);
    g.addColorStop(0, `rgba(255, 236, 180, ${(0.32 * lamp).toFixed(3)})`);
    g.addColorStop(1, 'rgba(255, 236, 180, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, -1);
    ctx.lineTo(260, -26);
    ctx.lineTo(260, 26);
    ctx.lineTo(0, 1);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, 16 * Math.min(1.4, lamp));
    halo.addColorStop(0, `rgba(255, 240, 200, ${Math.min(1, 0.8 * lamp).toFixed(3)})`);
    halo.addColorStop(1, 'rgba(255, 240, 200, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(cx - 24, cy - 24, 48, 48);
    px(ctx, `rgba(255, 250, 230, ${Math.min(1, lamp).toFixed(3)})`, cx - 2, cy - 2, 4, 4);
  }
  // The brig, out to the right, running in toward it.
  brig(ctx, 228 - Math.min(t, 14) * 1.2, SEA_TOP + 14, { s: 0.9, t });
}

// 2. The star coming down on her.
function drawStar(ctx, t, mood, moodTime) {
  night(ctx, t, { fog: 0.3 });
  const bx = 150;
  const by = SEA_TOP + 16;
  const bow = { x: bx - 33, y: by - 10 };
  let bowLight = 0;
  if (mood === 'fall') {
    // Slow as a feather: from high up on the left, down onto her bow, over four seconds, swaying a little.
    const k = clamp(moodTime / 4);
    const e = k * k * (3 - 2 * k);
    const sx = 40 + (bow.x - 40) * e + Math.sin(moodTime * 2.2) * 6 * (1 - k);
    const sy = -10 + (bow.y + 10) * e;
    for (let i = 1; i <= 14; i++) {
      const back = Math.max(0, e - i * 0.012);
      const tx = 40 + (bow.x - 40) * back;
      const ty = -10 + (bow.y + 10) * back;
      px(ctx, `rgba(220, 238, 255, ${(0.5 * (1 - i / 15)).toFixed(3)})`, tx, ty, 1, 1);
    }
    const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, 14);
    g.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    g.addColorStop(0.4, 'rgba(190, 225, 255, 0.35)');
    g.addColorStop(1, 'rgba(190, 225, 255, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(sx - 14, sy - 14, 28, 28);
    px(ctx, '#ffffff', sx - 1, sy - 1, 3, 3);
  }
  if (mood === 'struck') bowLight = clamp(moodTime / 1.2);
  brig(ctx, bx, by, { s: 1, t, bowLight });
  if (mood === 'struck') {
    // The flash: the whole night white for a moment, then fading back.
    const f = Math.max(0, 1 - moodTime / 1.1);
    if (f > 0) {
      ctx.fillStyle = `rgba(230, 242, 255, ${(0.85 * f).toFixed(3)})`;
      ctx.fillRect(0, 0, W, H);
    }
  }
}

// 3. The boy on the shore, watching her go.
function drawShore(ctx, t, mood, moodTime) {
  night(ctx, t, { fog: 0.3, seaTop: 128 });
  // A moon behind the fog, high on the right, for the rim of light on him.
  const moon = ctx.createRadialGradient(262, 40, 0, 262, 40, 40);
  moon.addColorStop(0, 'rgba(200, 214, 235, 0.35)');
  moon.addColorStop(1, 'rgba(200, 214, 235, 0)');
  ctx.fillStyle = moon;
  ctx.fillRect(222, 0, 80, 80);
  px(ctx, 'rgba(220, 230, 245, 0.6)', 259, 37, 6, 6);
  // The brig, far out, listing, going down.
  const k = mood === 'sink' ? clamp(moodTime / 6) : 0;
  brig(ctx, 210, 132, { s: 0.55, list: 0.18 + k * 0.35, sink: k, lantern: k < 0.85 ? 1 : Math.max(0, 1 - (k - 0.85) / 0.15), t });
  // The rocks in front.
  ctx.fillStyle = '#030407';
  ctx.beginPath();
  ctx.moveTo(0, 196);
  ctx.lineTo(40, 188);
  ctx.lineTo(78, 192);
  ctx.lineTo(120, 184);
  ctx.lineTo(170, 194);
  ctx.lineTo(230, 200);
  ctx.lineTo(W, 206);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();
  // Foam at their foot.
  for (let i = 0; i < 20; i++) {
    const a = 0.12 + 0.2 * (0.5 + 0.5 * Math.sin(t * 1.6 + i));
    px(ctx, `rgba(170, 190, 210, ${a.toFixed(3)})`, i * 16 + hash(i) * 8, 190 + hash(i + 3) * 10, 4 + hash(i + 5) * 6, 1);
  }
  boy(ctx, 112, 185, t);
}

// A small figure from behind, standing on the rock, looking out: a coat far too big for him (the hem on the
// stone, the sleeves hanging past his hands), and at his side a sword too long for him, its point on the rock.
// A silhouette, rimmed on the right by the moon. Nothing of his face.
function boy(ctx, x, feet, t) {
  const DARK = '#020203';
  const RIM = 'rgba(170, 190, 220, 0.55)';
  const sway = Math.round(Math.sin(t * 0.8) * 0.6);
  // The coat: wide at the hem, dragging on the stone, narrow at the shoulders.
  for (let r = 0; r < 22; r++) {
    const half = 4 + Math.round(r * 0.28);
    px(ctx, DARK, x - half + (r < 4 ? sway : 0), feet - 22 + r, half * 2, 1);
    px(ctx, RIM, x + half - 1 + (r < 4 ? sway : 0), feet - 22 + r, 1, 1);
  }
  // The hem lying on the rock a little, to one side.
  px(ctx, DARK, x - 11, feet - 1, 4, 1);
  // The sleeves, hanging past where his hands would be.
  px(ctx, DARK, x - 7, feet - 21, 2, 13);
  px(ctx, DARK, x + 5, feet - 21, 2, 13);
  px(ctx, RIM, x + 6, feet - 21, 1, 13);
  // The collar turned up, and his head above it: small, the hair untidy.
  px(ctx, DARK, x - 4 + sway, feet - 25, 8, 3);
  px(ctx, DARK, x - 3 + sway, feet - 32, 6, 7);
  px(ctx, DARK, x - 2 + sway, feet - 33, 4, 1);
  px(ctx, DARK, x + 2 + sway, feet - 34, 1, 1);
  px(ctx, RIM, x + 3 + sway, feet - 31, 1, 5);
  // The sword at his left side (our right), too long: hilt at his hip, the blade down to the rock.
  px(ctx, DARK, x + 8, feet - 18, 3, 1);
  px(ctx, DARK, x + 9, feet - 21, 1, 3);
  px(ctx, '#2a3240', x + 9, feet - 17, 1, 17);
  px(ctx, 'rgba(200, 220, 245, 0.7)', x + 10, feet - 17, 1, 16);
}

export const WRECK_VISIONS = {
  wreck_light: drawLight,
  wreck_star: drawStar,
  wreck_shore: drawShore,
};
