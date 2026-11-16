import { SCREEN_WIDTH as W, SCREEN_HEIGHT as H } from '../config.js';
import { animationFrame } from '../engine/animations.js';

// The end of chapter 5 (tideHeldFinale.js), as whole-screen visions:
//
//   'undertow'  Bramble's dive, under the water, side on. Moods, one after the other:
//     'plunge'  the white of him going in; murky green-blue water, light coming down
//               in shafts, specks drifting; him swimming down, badly, desperately,
//               bubbles out of him; below him the hero and Ves sinking, limp, hair
//               and scarf and coat drifting up off them; her umbrella turning away.
//     'grab'    he gets to her and takes her hand, then to the hero and takes him
//               by the collar.
//     'climb'   up toward the light, kicking like he's cross, his cheeks puffed out,
//               the bubbles running out of him, the two of them hanging off him.
//     'break'   the surface coming down at them, and a white burst of spray.
//   'ebb'       the light out of the hero, and in it the sea pulling back from the
//               tower: the edge of the water running away out across the sand, past
//               the rocks and a wreck's ribs, further than anyone has seen (mood 'ebb').
// The people are the animations in src/data/art/tideRescue.js, drawn twice size.

function hash(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
const ease = (k) => {
  const c = Math.min(1, Math.max(0, k));
  return c * c * (3 - 2 * c);
};
const lerp = (a, b, k) => a + (b - a) * k;
const mix = (a, b, k) => a.map((v, i) => Math.round(lerp(v, b[i], k)));
const rgb = (c, a = 1) => `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;

function drawSprite(ctx, img, x, y, angle, scale = 2, alpha = 1) {
  if (!img) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.translate(Math.round(x), Math.round(y));
  ctx.rotate(angle);
  ctx.scale(scale, scale);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);
  ctx.restore();
}

// --- The water ---------------------------------------------------------------
// `depth` 0 just under the surface, 1 deep down; `surface` where the surface is on
// screen (it can be far above it).
function water(ctx, t, depth, surface) {
  const top = mix([62, 140, 136], [14, 52, 60], depth);
  const bottom = mix([18, 64, 70], [2, 10, 16], depth);
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, rgb(top));
  g.addColorStop(1, rgb(bottom));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  // The surface from under it: silver, wrinkling, bright where the sky is.
  if (surface > -40) {
    const wav = (x) => surface + Math.sin(x * 0.06 + t * 1.8) * 3 + Math.sin(x * 0.17 - t * 2.6) * 1.5;
    const sg = ctx.createLinearGradient(0, surface - 40, 0, surface + 6);
    sg.addColorStop(0, 'rgba(200, 236, 228, 0.95)');
    sg.addColorStop(1, 'rgba(120, 200, 190, 0.85)');
    ctx.fillStyle = sg;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(W, 0);
    for (let x = W; x >= 0; x -= 4) ctx.lineTo(x, wav(x));
    ctx.closePath();
    ctx.fill();
    for (let x = 0; x < W; x += 2) {
      const n = hash(Math.floor(x / 2) + Math.floor(t * 5) * 0.37);
      ctx.fillStyle = n > 0.5 ? 'rgba(255, 255, 255, 0.85)' : 'rgba(220, 250, 240, 0.6)';
      ctx.fillRect(x, Math.round(wav(x)), 2, 1);
    }
  }
  // Shafts of light slanting down, swaying, fading deeper.
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 6; i++) {
    const x = (i + 0.5) * (W / 6) + Math.sin(t * 0.4 + i * 1.7) * 18;
    const from = Math.max(-20, surface);
    const len = 260 * (1 - depth * 0.55);
    const w0 = 6 + hash(i + 3) * 10;
    const sh = ctx.createLinearGradient(0, from, 0, from + len);
    sh.addColorStop(0, `rgba(190, 240, 220, ${(0.16 * (1 - depth * 0.7)).toFixed(3)})`);
    sh.addColorStop(1, 'rgba(190, 240, 220, 0)');
    ctx.fillStyle = sh;
    ctx.beginPath();
    ctx.moveTo(x - w0, from);
    ctx.lineTo(x + w0, from);
    ctx.lineTo(x + w0 * 2.6 + 40, from + len);
    ctx.lineTo(x + w0 * 0.4 + 40, from + len);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  // Specks drifting, slowly, nearer ones bigger.
  for (let i = 0; i < 80; i++) {
    const near = hash(i + 40) > 0.8;
    const x = (hash(i) * W + t * (4 + hash(i + 7) * 6) + Math.sin(t * 0.7 + i) * 4) % W;
    const y = (hash(i + 9) * H - t * (3 + hash(i + 11) * 5) + depth * 400 * (near ? 1.4 : 0.8)) % H;
    ctx.fillStyle = near ? 'rgba(200, 236, 220, 0.5)' : 'rgba(150, 200, 190, 0.35)';
    ctx.fillRect(Math.round(x), Math.round((y + H) % H), near ? 2 : 1, near ? 2 : 1);
  }
  // Deep down, the dark rock of the tower's foot looming at the sides.
  if (depth > 0.3) {
    const k = (depth - 0.3) / 0.7;
    ctx.fillStyle = `rgba(2, 12, 14, ${(0.85 * k).toFixed(3)})`;
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let y = H; y >= H * 0.25; y -= 8) ctx.lineTo(28 + Math.sin(y * 0.05) * 10 + hash(Math.floor(y)) * 6, y);
    ctx.lineTo(0, H * 0.25);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(W, H);
    for (let y = H; y >= H * 0.45; y -= 8) ctx.lineTo(W - 22 - Math.sin(y * 0.07) * 12 - hash(Math.floor(y) + 3) * 6, y);
    ctx.lineTo(W, H * 0.45);
    ctx.closePath();
    ctx.fill();
  }
}

// Bubbles going up from a spot: `n` of them, `rate` how fast they run out.
function bubbles(ctx, t, x, y, n, seed, spread = 6, speed = 40) {
  for (let i = 0; i < n; i++) {
    const life = (t * (0.6 + hash(seed + i) * 0.5) + hash(seed + i + 5)) % 1;
    const bx = x + Math.sin(life * 9 + i) * spread * life + (hash(seed + i + 9) - 0.5) * 4;
    const by = y - life * speed * (1 + hash(seed + i + 3));
    const r = 1 + Math.floor(hash(seed + i + 7) * 2.4);
    ctx.strokeStyle = `rgba(220, 250, 244, ${(0.9 * (1 - life)).toFixed(3)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(Math.round(bx) + 0.5, Math.round(by) + 0.5, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = `rgba(255, 255, 255, ${(0.9 * (1 - life)).toFixed(3)})`;
    ctx.fillRect(Math.round(bx - r / 2), Math.round(by - r / 2), 1, 1);
  }
}

// Ves's umbrella, open, turning slowly away through the water.
function umbrella(ctx, x, y, angle, alpha) {
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.translate(Math.round(x), Math.round(y));
  ctx.rotate(angle);
  ctx.fillStyle = '#7a4f2a';
  ctx.fillRect(-1, 0, 2, 26);
  ctx.fillRect(-1, 24, 5, 2);
  ctx.fillStyle = '#7a3a5e';
  ctx.beginPath();
  ctx.moveTo(-22, 4);
  ctx.quadraticCurveTo(0, -16, 22, 4);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#5a2846';
  for (let i = -3; i <= 3; i++) ctx.fillRect(Math.round(i * 6.5), -4 + Math.abs(i) * 2, 1, 7 - Math.abs(i));
  ctx.fillStyle = '#f0c050';
  ctx.fillRect(-1, -9, 2, 2);
  ctx.restore();
}

const frame = (name, t, speed) => animationFrame(name, t, speed);

function drawUndertow(ctx, t, mood, m) {
  const swim = (puff) => frame(puff ? 'tr_uw_bramble_puff' : 'tr_uw_bramble', t, puff ? 0.12 : 0.15);
  const hero = frame('tr_uw_hero', t, 0.8);
  const ves = frame('tr_uw_ves', t, 0.7);

  if (mood === 'plunge') {
    const depth = ease(m / 6) * 0.55;
    water(ctx, t, depth, 30 - depth * 400);
    // The two of them below, sinking, limp; the umbrella turning away from them.
    const sink = m * 2.4;
    drawSprite(ctx, hero, 118 + Math.sin(t * 0.6) * 3, 186 + sink, -0.25 + Math.sin(t * 0.5) * 0.08, 2, 0.85);
    drawSprite(ctx, ves, 206 + Math.sin(t * 0.5 + 1) * 3, 176 + sink * 0.9, 0.35 + Math.sin(t * 0.45) * 0.08, 2, 0.85);
    bubbles(ctx, t, 140, 174 + sink, 2, 70, 4, 24);
    bubbles(ctx, t, 222, 164 + sink, 2, 80, 4, 24);
    umbrella(ctx, 238 + m * 8, 150 - m * 9, 0.6 + m * 0.35, 0.9 - m * 0.1);
    // Him, coming down head first, all elbows, jerking with each stroke.
    const k = ease(m / 5.6);
    const stroke = Math.sin(t * 7) * 3;
    const bx = lerp(160, 150, k) + Math.sin(t * 3) * 4;
    const by = lerp(-10, 112, k) + stroke;
    drawSprite(ctx, swim(false), bx, by, Math.PI / 2 - 0.25 + Math.sin(t * 5) * 0.12, 2);
    bubbles(ctx, t, bx + 4, by + 18, 5, 10, 5, 50);
    // The white of him going in: a burst of bubbles, then the white fading.
    if (m < 1.6) {
      bubbles(ctx, m * 2, 160, 30, 30, 200, 30, 60);
      ctx.fillStyle = `rgba(240, 255, 250, ${Math.max(0, 1 - m / 0.7).toFixed(3)})`;
      ctx.fillRect(0, 0, W, H);
    }
    return;
  }
  if (mood === 'grab') {
    const depth = 0.55;
    water(ctx, t, depth, -400);
    const sink = 14.4 + m * 1;
    // Ves's hand: he gets there first (by 1.8), and takes it; then the hero (by 4).
    const toVes = ease(m / 1.8);
    const toHero = ease((m - 2.1) / 1.9);
    const bx = lerp(lerp(150, 182, toVes), 140, toHero) + Math.sin(t * 6) * 2;
    const by = lerp(lerp(112, 160, toVes), 172, toHero) + Math.sin(t * 7) * 2;
    const angle = lerp(Math.PI / 2 - 0.25, 0.9, toVes) + (toHero > 0 ? -toHero * 1.6 : 0);
    const held = m >= 1.8;
    const vx = held ? bx + 34 : 206;
    const vy = held ? by + 28 : 176 + sink;
    drawSprite(ctx, ves, lerp(206, vx, held ? ease((m - 1.8) / 0.6) : 0), lerp(176 + sink, vy, held ? ease((m - 1.8) / 0.6) : 0), 0.35 + Math.sin(t * 0.45) * 0.08, 2, 0.88);
    const gotHero = m >= 4;
    drawSprite(ctx, hero, gotHero ? bx - 26 : 118, gotHero ? by + 34 : 186 + sink, -0.25 + Math.sin(t * 0.6) * 0.08, 2, 0.88);
    const reaching = !held || (m > 2.1 && !gotHero);
    drawSprite(ctx, reaching ? frame('tr_uw_bramble_reach', t, 0.4) : swim(false), bx, by, angle, 2);
    bubbles(ctx, t, bx + 10, by - 4, 4, 30, 4, 40);
    // A small burst of bubbles where a hand closes on a hand, a fist on a collar.
    for (const [at, x, y] of [[1.8, vx - 10, vy - 10], [4, bx - 22, by + 22]]) {
      if (m >= at && m < at + 0.8) bubbles(ctx, (m - at) * 1.5, x, y, 10, 400 + at, 8, 30);
    }
    return;
  }
  if (mood === 'climb') {
    const k = ease(m / 6);
    const depth = lerp(0.55, 0.05, k);
    water(ctx, t, depth, lerp(-300, 26, ease((m - 2) / 4)));
    // Up, in jerks: a hard kick, a little gained, a little lost.
    const kick = Math.pow(Math.abs(Math.sin(t * 3.4)), 3) * 7;
    const bx = lerp(140, 156, k) + Math.sin(t * 3.4) * 3;
    const by = lerp(172, 96, k) - kick;
    drawSprite(ctx, hero, bx - 24, by + 38, -1.1 + Math.sin(t * 0.8) * 0.1, 2, 0.95);
    drawSprite(ctx, ves, bx + 26, by + 34, 1.9 + Math.sin(t * 0.7) * 0.1, 2, 0.95);
    drawSprite(ctx, swim(true), bx, by, -Math.PI / 2 + Math.sin(t * 3.4) * 0.15, 2);
    // The breath running out of him: more and more, in streams.
    const out = 3 + Math.round(k * 9);
    bubbles(ctx, t, bx + 2, by - 22, out, 60, 6, 70 + k * 40);
    return;
  }
  if (mood === 'break') {
    water(ctx, t, 0, lerp(26, 150, ease(m / 0.5)));
    drawSprite(ctx, swim(true), 156, lerp(96, 60, ease(m / 0.5)), -Math.PI / 2, 2);
    const white = ease((m - 0.25) / 0.35);
    ctx.fillStyle = `rgba(250, 255, 252, ${white.toFixed(3)})`;
    ctx.fillRect(0, 0, W, H);
    // Spray flung out of the white.
    for (let i = 0; i < 40; i++) {
      const a = -Math.PI / 2 + (hash(i) - 0.5) * 2.6;
      const r = m * (120 + hash(i + 3) * 160);
      ctx.fillStyle = 'rgba(160, 220, 210, 0.9)';
      ctx.fillRect(Math.round(160 + Math.cos(a) * r), Math.round(120 + Math.sin(a) * r * 0.7), 2, 2);
    }
  }
}

// --- The sea pulling back --------------------------------------------------------
function drawEbb(ctx, t, mood, m) {
  const HZ = 78;
  // The sky before dawn: deep blue going to a thin grey line on the sea.
  const sky = ctx.createLinearGradient(0, 0, 0, HZ);
  sky.addColorStop(0, '#0e1630');
  sky.addColorStop(0.7, '#2a3656');
  sky.addColorStop(1, '#6a7488');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, HZ);
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = `rgba(220, 230, 255, ${(0.3 + hash(i + 5) * 0.5).toFixed(3)})`;
    ctx.fillRect(Math.round(hash(i) * W), Math.round(hash(i + 1) * HZ * 0.7), 1, 1);
  }
  // Where the sea has got to: from right under you, out to the edge of the world.
  const k = ease(m / 7.5);
  const edge = lerp(H + 4, HZ + 3, Math.pow(k, 0.7));
  // The sea beyond the edge.
  const sea = ctx.createLinearGradient(0, HZ, 0, H);
  sea.addColorStop(0, '#2a4a58');
  sea.addColorStop(1, '#0c2a32');
  ctx.fillStyle = sea;
  ctx.fillRect(0, HZ, W, Math.max(0, edge - HZ));
  for (let i = 0; i < 40; i++) {
    const y = HZ + 2 + hash(i + 20) * (edge - HZ);
    if (y > edge - 2) continue;
    ctx.fillStyle = 'rgba(160, 200, 210, 0.35)';
    ctx.fillRect(Math.round((hash(i + 30) * W + t * 6) % W), Math.round(y), 3 + Math.round(((y - HZ) / (H - HZ)) * 14), 1);
  }
  // The sand it has left: wet and dark, the sky lying in it, rippled, pools in it.
  if (edge < H) {
    const sand = ctx.createLinearGradient(0, edge, 0, H);
    sand.addColorStop(0, '#4a5862');
    sand.addColorStop(0.35, '#3e4646');
    sand.addColorStop(1, '#4c4a40');
    ctx.fillStyle = sand;
    ctx.fillRect(0, edge, W, H - edge);
    // The sky's light lying on the wet sand just behind the water.
    const sheen = ctx.createLinearGradient(0, edge, 0, edge + 30);
    sheen.addColorStop(0, 'rgba(120, 136, 160, 0.55)');
    sheen.addColorStop(1, 'rgba(120, 136, 160, 0)');
    ctx.fillStyle = sheen;
    ctx.fillRect(0, edge, W, 30);
    // Ripples, closer together further off, each with a lit crest.
    for (let r = 0; r < 44; r++) {
      const y = HZ + Math.pow(r / 44, 1.7) * (H - HZ);
      if (y < edge + 1) continue;
      const near = (y - HZ) / (H - HZ);
      for (let x = (r * 7) % 13; x < W; x += 13) {
        const yy = Math.round(y + Math.sin(x * 0.07 + r) * (1 + near * 2));
        ctx.fillStyle = 'rgba(20, 26, 28, 0.3)';
        ctx.fillRect(x, yy + 1, 5 + Math.round(near * 4), 1);
        ctx.fillStyle = 'rgba(150, 160, 170, 0.2)';
        ctx.fillRect(x + 1, yy, 4 + Math.round(near * 3), 1);
      }
    }
    // Pools left behind, the sky in them, bright at the rim.
    for (let i = 0; i < 16; i++) {
      const y = HZ + 6 + hash(i + 50) * (H - HZ - 8);
      if (y < edge + 3) continue;
      const near = (y - HZ) / (H - HZ);
      const w = 6 + near * 34 * (0.4 + hash(i + 51));
      const h = 1 + Math.round(near * 4);
      const x = Math.round(hash(i + 52) * W);
      ctx.fillStyle = '#26324a';
      ctx.beginPath();
      ctx.ellipse(x, y, w / 2, h, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(200, 214, 236, 0.75)';
      ctx.fillRect(Math.round(x - w / 2 + 2), Math.round(y - h), Math.round(w * 0.5), 1);
    }
    // Rocks with weed on them, and the ribs of a wreck, coming out of the water as it goes.
    const things = [[0.55, 120, 0], [0.3, 214, 1], [0.18, 268, 0], [0.12, 92, 1], [0.7, 250, 0], [0.42, 170, 0], [0.06, 150, 0]];
    for (const [d, x, ribs] of things) {
      const y = HZ + d * (H - HZ);
      if (y < edge) continue;
      const s = 0.4 + d * 1.6;
      if (ribs) {
        // A hull's ribs, curved, black, one broken.
        ctx.strokeStyle = '#121818';
        ctx.lineWidth = Math.max(1, 2 * s);
        for (let r = 0; r < 6; r++) {
          const rx = x + r * 7 * s;
          const tall = (14 - Math.abs(r - 2.5) * 3) * s * (r === 4 ? 0.5 : 1);
          ctx.beginPath();
          ctx.moveTo(rx, y);
          ctx.quadraticCurveTo(rx - 4 * s, y - tall * 0.6, rx - 1 * s, y - tall);
          ctx.stroke();
        }
        ctx.fillStyle = '#121818';
        ctx.fillRect(Math.round(x - 3 * s), Math.round(y - 1), Math.round(44 * s), Math.max(1, Math.round(3 * s)));
      } else {
        ctx.fillStyle = '#161e1e';
        ctx.beginPath();
        ctx.ellipse(x, y, 10 * s, 5 * s, 0, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = '#26402c';
        ctx.fillRect(Math.round(x - 10 * s), Math.round(y - 1), Math.round(20 * s), Math.max(1, Math.round(1.5 * s)));
        ctx.fillStyle = 'rgba(160, 180, 190, 0.5)';
        ctx.fillRect(Math.round(x - 4 * s), Math.round(y - 4.5 * s), Math.round(4 * s), 1);
      }
    }
    // The water running off the sand after it, in thin bright threads.
    for (let i = 0; i < 30; i++) {
      const x = hash(i + 80) * W;
      const y = edge + ((t * 26 + hash(i + 81) * 70) % 70);
      ctx.fillStyle = 'rgba(190, 210, 228, 0.45)';
      ctx.fillRect(Math.round(x), Math.round(y), 1, 2 + Math.round(((y - HZ) / (H - HZ)) * 3));
    }
    // The foam along the edge, thinning as it goes further off.
    for (let x = 0; x < W; x += 2) {
      const n = hash(Math.floor(x / 2) + Math.floor(t * 4) * 0.21);
      ctx.fillStyle = n > 0.3 ? 'rgba(236, 246, 250, 0.9)' : 'rgba(170, 200, 210, 0.7)';
      ctx.fillRect(x, Math.round(edge + Math.sin(x * 0.04 + t) * 1.5), 2, k > 0.9 ? 1 : 2);
    }
  }
  // The tower, black, at the left, its foot in the sand now: courses of stone, iron bands,
  // weed and barnacles at its foot where the sea was a moment ago.
  const tw = (y) => 12 + (y / H) * 22;
  ctx.fillStyle = '#060a0a';
  ctx.beginPath();
  ctx.moveTo(44 - tw(0), 0);
  ctx.lineTo(44 + tw(0), 0);
  ctx.lineTo(44 + tw(H), H);
  ctx.lineTo(44 - tw(H), H);
  ctx.closePath();
  ctx.fill();
  for (let y = 4; y < H; y += 7) {
    ctx.fillStyle = 'rgba(40, 60, 64, 0.5)';
    ctx.fillRect(Math.round(44 - tw(y)), y, Math.round(tw(y) * 0.5), 1);
  }
  for (const y of [40, 110, 180]) {
    ctx.fillStyle = '#1c2626';
    ctx.fillRect(Math.round(44 - tw(y)), y, Math.round(tw(y) * 2), 3);
    ctx.fillStyle = '#3a4848';
    ctx.fillRect(Math.round(44 - tw(y)), y, Math.round(tw(y) * 0.6), 1);
  }
  // Its one slit, faintly green still.
  ctx.fillStyle = '#2a5a48';
  ctx.fillRect(46, 70, 2, 6);
  ctx.fillStyle = '#0c1414';
  ctx.beginPath();
  ctx.ellipse(44, H + 4, 56, 24, 0, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = '#1e3424';
  for (let x = -10; x < 100; x += 3) ctx.fillRect(x, Math.round(H - 14 - Math.sqrt(Math.max(0, 1 - ((x - 44) / 56) ** 2)) * 6 + hash(x) * 4), 2, 3);
  // The light it all happens in: from you, at the bottom of the view, laid out over the
  // sand in long soft rays; and at the first all of it white.
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const glow = ctx.createRadialGradient(W / 2, H + 30, 4, W / 2, H + 30, 240);
  glow.addColorStop(0, 'rgba(255, 246, 220, 0.35)');
  glow.addColorStop(1, 'rgba(255, 246, 220, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI / 2 + (i - 3) * 0.32 + Math.sin(t * 0.2 + i) * 0.03;
    const len = 260;
    const ray = ctx.createLinearGradient(W / 2, H, W / 2 + Math.cos(a) * len, H + Math.sin(a) * len);
    ray.addColorStop(0, 'rgba(255, 246, 220, 0.07)');
    ray.addColorStop(1, 'rgba(255, 246, 220, 0)');
    ctx.fillStyle = ray;
    ctx.beginPath();
    ctx.moveTo(W / 2, H + 10);
    ctx.lineTo(W / 2 + Math.cos(a - 0.1) * len, H + Math.sin(a - 0.1) * len);
    ctx.lineTo(W / 2 + Math.cos(a + 0.1) * len, H + Math.sin(a + 0.1) * len);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  const white = Math.max(0, 1 - m / 1.8);
  if (white > 0) {
    ctx.fillStyle = `rgba(255, 252, 242, ${white.toFixed(3)})`;
    ctx.fillRect(0, 0, W, H);
  }
}

export const TIDE_VISIONS = {
  undertow: drawUndertow,
  ebb: drawEbb,
};
