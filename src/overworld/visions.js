import { SCREEN_WIDTH as W, SCREEN_HEIGHT as H } from '../config.js';
import { makeSprite } from '../engine/sprite.js';
import { HERO_ANIMATIONS } from '../characters/hero.js';
import { PROP_PALETTE } from '../data/art/props.js';
import { VES_FRAMES } from '../data/art/vesper.js';
import { animationFrame } from '../engine/animations.js';

// Visions: whole-screen pictures a cutscene can show in the dark, for dreams
// (a scene step { do: 'vision', name: 'lantern' }; with no name, it goes).
// Each is drawn over the black of sleep, in world pixels, from the seconds
// since it began and its `mood`: 'calm', 'violent' (it shakes and gutters),
// or 'flare' (its light blazes up and swallows everything).

function hash(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
const px = (ctx, color, x, y, w = 1, h = 1) => { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); };

// One full swing of the great lantern, there and back: in time with its song
// (lanternTheme.js, 54 BPM), a creak at each end of the swing, every 2 beats.
const SWING_SECONDS = (60 / 54) * 4;

// The great lantern, drawn upright with its ring at (0, 0) and hanging down.
// About 36 pixels wide and 54 tall: iron cap and base, four panes of glass,
// and inside, a light that isn't quite a flame.
function drawGreatLantern(ctx, t, flicker) {
  const IRON = '#2a2433';
  const IRON_LIT = '#5e5470';
  const IRON_EDGE = '#120c1c';
  // The ring it hangs from.
  px(ctx, IRON_EDGE, -4, 0, 8, 2);
  px(ctx, IRON_EDGE, -4, 0, 2, 6);
  px(ctx, IRON_EDGE, 2, 0, 2, 6);
  // The cap: a little roof, wider as it goes down.
  for (let r = 0; r < 9; r++) {
    const half = 4 + r * 1.6;
    px(ctx, IRON_EDGE, -half - 1, 6 + r, half * 2 + 2, 1);
    px(ctx, r < 2 ? IRON_LIT : IRON, -half, 6 + r, half * 2, 1);
  }
  px(ctx, IRON_LIT, -18, 15, 36, 2);
  // The glass, lit from inside.
  const glow = 0.75 + flicker * 0.25;
  ctx.fillStyle = `rgba(255, 214, 120, ${glow.toFixed(3)})`;
  ctx.fillRect(-15, 17, 30, 28);
  ctx.fillStyle = `rgba(255, 246, 214, ${(glow * 0.8).toFixed(3)})`;
  ctx.fillRect(-9, 21, 18, 20);
  // The light inside: not a flame. Something turning over and over, like
  // it's trying to find a way out.
  for (let i = 0; i < 5; i++) {
    const a = t * 2.3 + i * 1.26;
    const r = 4 + Math.sin(t * 1.7 + i) * 2;
    px(ctx, '#ffffff', Math.round(Math.cos(a) * r) - 1, Math.round(31 + Math.sin(a) * r * 1.3) - 1, 2, 2);
  }
  // Its frame: four bars down the glass and a crossbar.
  for (const bx of [-16, -6, 5, 15]) px(ctx, IRON_EDGE, bx, 17, 2, 28);
  px(ctx, IRON_EDGE, -16, 30, 32, 1);
  // The base.
  px(ctx, IRON_LIT, -18, 45, 36, 2);
  for (let r = 0; r < 5; r++) px(ctx, r === 4 ? IRON_EDGE : IRON, -16 + r * 2, 47 + r, 32 - r * 4, 1);
  px(ctx, IRON_EDGE, -3, 52, 6, 2);
}

function drawLantern(ctx, t, mood, moodTime) {
  const violent = mood === 'violent';
  // Its light gutters, sometimes; when it's violent, all the time.
  const flicker = violent
    ? 0.4 + hash(Math.floor(t * 24)) * 0.6
    : 0.85 + Math.sin(t * 9) * 0.05 + (hash(Math.floor(t * 7)) < 0.08 ? -0.4 : 0);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, W, H);
  ctx.save();
  if (violent) ctx.translate(Math.round((hash(Math.floor(t * 30)) - 0.5) * 6), Math.round((hash(Math.floor(t * 30) + 7) - 0.5) * 4));

  // Swinging from a chain out of the dark above.
  const swing = Math.sin((t / SWING_SECONDS) * Math.PI * 2) * (violent ? 0.62 : 0.42);
  const pivotX = W / 2;
  const pivotY = -40;
  const chain = 118;
  // The lantern is drawn this much bigger than its pixels: it's huge.
  const scale = 1.8;
  const middle = 30 * scale;
  const lx = pivotX + Math.sin(swing) * chain;
  const ly = pivotY + Math.cos(swing) * chain;

  // Its glow, swinging with it, and dust drifting in the light.
  const reach = 150 + flicker * 40;
  const glow = ctx.createRadialGradient(lx, ly + middle, 4, lx, ly + middle, reach);
  glow.addColorStop(0, `rgba(255, 196, 96, ${(0.42 * flicker).toFixed(3)})`);
  glow.addColorStop(0.4, `rgba(200, 120, 50, ${(0.14 * flicker).toFixed(3)})`);
  glow.addColorStop(1, 'rgba(120, 60, 20, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 14; i++) {
    const dx = Math.sin(t * 0.4 + i * 2.1) * 60 + (hash(i + 50) - 0.5) * 80;
    const dy = ((t * 6 + i * 23) % 120) - 40;
    const a = Math.max(0, 0.5 - Math.hypot(dx, dy) / 140) * flicker;
    if (a > 0.02) px(ctx, `rgba(255, 230, 180, ${a.toFixed(3)})`, Math.round(lx + dx), Math.round(ly + middle + dy));
  }

  // The chain: links all the way down, alternately face-on and edge-on.
  ctx.save();
  ctx.translate(pivotX, pivotY);
  ctx.rotate(-swing);
  for (let d = 0; d < chain; d += 5) {
    const lit = Math.max(0, 1 - (chain - d) / 90) * flicker;
    const color = `rgb(${Math.round(30 + 70 * lit)}, ${Math.round(26 + 56 * lit)}, ${Math.round(40 + 40 * lit)})`;
    if ((d / 5) % 2) px(ctx, color, -1, d, 2, 5);
    else { px(ctx, color, -2, d, 4, 1); px(ctx, color, -2, d + 4, 4, 1); px(ctx, color, -2, d, 1, 5); px(ctx, color, 1, d, 1, 5); }
  }
  ctx.translate(0, chain);
  ctx.scale(scale, scale);
  drawGreatLantern(ctx, t, flicker);
  ctx.restore();
  ctx.restore();

  // Flaring: its light blazes up until there's nothing but white, then
  // it's gone, all at once.
  if (mood === 'flare') {
    const k = Math.min(1, moodTime / 0.7);
    ctx.fillStyle = `rgba(255, 244, 220, ${(k * k).toFixed(3)})`;
    ctx.fillRect(0, 0, W, H);
  }
}


// --- The fall (usurperFalls.js): after the Usurper throws himself off the
// summit with Ves in his grip, the hero dives after her. In the spirit of
// the opening of Tears of the Kingdom: the leap, the reach, the miss. Moods,
// one after another (the scene steps them on):
//   'plunge'  from above: the hero diving head-first, Ves falling away below
//             with the dying Usurper streaming off her as smoke, the clouds
//             rushing up past
//   'reach'   close: his hand reaching down, hers reaching up, the gap
//             closing to almost nothing
//   'miss'    the gap opening again; she falls away, and her umbrella slips
//             free and drifts up past him, opening
//   'trees'   below the cloud: tall pines rushing up out of the dark, and in
let fallSprites = null;
function fallArt() {
  fallSprites ??= {
    hero: HERO_ANIMATIONS.down[0],
    // The hero's dive (the last frame of 'player_dive'): head first, reaching.
    dive: animationFrame('player_dive', 99, 1, true) ?? HERO_ANIMATIONS.down[0],
    ves: makeSprite(VES_FRAMES.downIdle, PROP_PALETTE),
  };
  return fallSprites;
}

function drawSprite(ctx, img, x, y, angle, scale = 1) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.rotate(angle);
  ctx.scale(scale, scale);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);
  ctx.restore();
}

// The sky, darker the further down, and cloud streaming up past.
function fallSky(ctx, t, depth, speed) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  const top = depth < 0.5 ? [150, 180, 214] : [70, 84, 112];
  const bottom = depth < 0.5 ? [88, 108, 148] : [22, 26, 40];
  g.addColorStop(0, `rgb(${top.join(',')})`);
  g.addColorStop(1, `rgb(${bottom.join(',')})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 26; i++) {
    const x = hash(i) * W;
    const len = 20 + hash(i + 40) * 50;
    const y = H - ((t * speed * (0.6 + hash(i + 80)) * 160 + hash(i + 120) * H) % (H + len));
    ctx.fillStyle = `rgba(236, 242, 250, ${(0.12 + hash(i + 160) * 0.2).toFixed(3)})`;
    ctx.fillRect(Math.round(x), Math.round(y), i % 3 === 0 ? 2 : 1, Math.round(len));
  }
  // Big soft cloud banks rising past.
  for (let i = 0; i < 5; i++) {
    const r = 50 + hash(i + 300) * 50;
    const x = hash(i + 310) * W;
    const y = H + r - ((t * speed * 40 + hash(i + 320) * (H + r * 2)) % (H + r * 2));
    const cg = ctx.createRadialGradient(x, y, 0, x, y, r);
    cg.addColorStop(0, 'rgba(236, 242, 250, 0.35)');
    cg.addColorStop(1, 'rgba(236, 242, 250, 0)');
    ctx.fillStyle = cg;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
}

// A big arm reaching, from (x, y) toward (tx, ty): a sleeve, then a hand (or a mitten).
function reachingArm(ctx, x, y, tx, ty, sleeve, skin, mitten) {
  const steps = 40;
  for (let i = 0; i <= steps; i++) {
    const k = i / steps;
    const ax = x + (tx - x) * k;
    const ay = y + (ty - y) * k;
    const w = k < 0.8 ? 7 : 5;
    ctx.fillStyle = k < 0.8 ? sleeve : (mitten ?? skin);
    ctx.fillRect(Math.round(ax - w), Math.round(ay - w), w * 2, w * 2);
  }
  const ang = Math.atan2(ty - y, tx - x);
  ctx.fillStyle = mitten ?? skin;
  for (const off of mitten ? [-0.6, 0] : [-0.5, -0.17, 0.17, 0.5]) {
    const fx = tx + Math.cos(ang + off) * 9;
    const fy = ty + Math.sin(ang + off) * 9;
    ctx.fillRect(Math.round(fx - 2), Math.round(fy - 2), 4, 5);
  }
}

function drawUmbrella(ctx, x, y, angle, open) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  ctx.rotate(angle);
  ctx.fillStyle = '#7a4f2a';
  ctx.fillRect(-1, 0, 2, 22);
  ctx.fillRect(-1, 20, 4, 2);
  ctx.fillStyle = '#7a3a5e';
  const w = 6 + open * 14;
  ctx.beginPath();
  ctx.moveTo(-w, 4);
  ctx.quadraticCurveTo(0, -10 * open - 2, w, 4);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#5a2846';
  for (let i = -2; i <= 2; i++) ctx.fillRect(Math.round((i * w) / 2.5), -2 + Math.abs(i), 1, 6 - Math.abs(i));
  ctx.fillStyle = '#f0c050';
  ctx.fillRect(Math.round(w * 0.3), -1, 2, 2);
  ctx.restore();
}

function drawFall(ctx, t, mood, moodTime) {
  const art = fallArt();
  if (mood === 'plunge') {
    fallSky(ctx, t, 0, 1.4);
    // Ves far below, tumbling; the Usurper coming apart around her as he dies.
    const vx = W / 2 + Math.sin(t * 1.3) * 8;
    const vy = H * 0.72 + Math.sin(t * 0.9) * 3;
    const fade = Math.max(0, 1 - moodTime / 3);
    const shade = animationFrame('usurper_fall', 99, 1, true);
    if (shade && fade > 0) {
      ctx.save();
      ctx.globalAlpha = fade;
      drawSprite(ctx, shade, vx + 4, vy - 2, Math.PI, 0.9);
      ctx.restore();
    }
    for (let i = 0; i < 40; i++) {
      const a = hash(i) * Math.PI * 2;
      const r = (moodTime * 18 * (0.5 + hash(i + 9))) % 60;
      ctx.fillStyle = `rgba(120, 100, 220, ${Math.max(0, 0.6 - r / 100).toFixed(3)})`;
      ctx.fillRect(Math.round(vx + Math.cos(a) * r), Math.round(vy - Math.abs(Math.sin(a)) * r * 1.4), 2, 2);
    }
    drawSprite(ctx, art.ves, vx, vy, Math.PI + Math.sin(t * 2) * 0.4, 0.8);
    // The hero above, diving head-first after her.
    const hx = W / 2 + Math.sin(t * 0.8) * 4;
    const hy = 40 + Math.min(30, moodTime * 10);
    drawSprite(ctx, art.dive, hx, hy, 0.85, 1.6);
    return;
  }
  if (mood === 'reach' || mood === 'miss') {
    fallSky(ctx, t, 0.3, 2.2);
    const miss = mood === 'miss';
    // The gap between their hands: closing, closing, almost; then opening.
    const gap = miss ? 6 + moodTime * moodTime * 40 : Math.max(6, 70 - moodTime * 24);
    const cx = W / 2;
    const cy = H / 2;
    const shakeX = Math.round(Math.sin(t * 31) * 1.5);
    // His arm down from the top; hers up from below, in her mustard mitten.
    reachingArm(ctx, cx - 30 + shakeX, -10, cx + shakeX, cy - gap / 2, '#3e7bd6', '#f1c49a', null);
    const fallAway = miss ? moodTime * moodTime * 30 : 0;
    reachingArm(ctx, cx + 30, H + 10 + fallAway, cx, cy + gap / 2 + fallAway * 0.3, '#4a74b0', '#f2d6b0', '#f0c050');
    if (miss) {
      // Her umbrella slipping free, drifting up past him and opening.
      const uy = H * 0.8 - moodTime * 70;
      drawUmbrella(ctx, cx + 60 - moodTime * 10, uy, Math.sin(moodTime * 2) * 0.6 + 0.4, Math.min(1, moodTime / 1.5));
    }
    return;
  }
  if (mood === 'trees') {
    // Below the cloud: dark, and the tops of great pines rushing up.
    ctx.fillStyle = '#0c1214';
    ctx.fillRect(0, 0, W, H);
    const rise = moodTime;
    for (let i = 0; i < 14; i++) {
      const x = hash(i + 500) * W;
      const scale = 0.4 + rise * (0.35 + hash(i + 510) * 0.5);
      const tipY = H + 40 - rise * (80 + hash(i + 520) * 90) * (0.6 + hash(i + 530));
      const h = 120 * scale;
      ctx.fillStyle = i % 2 ? '#18322a' : '#1f3f33';
      for (let r = 0; r < h; r += 2) {
        const half = (r / h) * 26 * scale * (1 + 0.25 * Math.sin(r * 0.5));
        ctx.fillRect(Math.round(x - half), Math.round(tipY + r), Math.round(half * 2), 2);
      }
    }
    // The hero, small, plummeting into them; then black.
    drawSprite(ctx, art.dive, W / 2, H * 0.3 + rise * 30, 0.85 + rise * 0.4, 1.2);
    if (moodTime > 2.4) {
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(1, (moodTime - 2.4) / 0.4).toFixed(3)})`;
      ctx.fillRect(0, 0, W, H);
    }
  }
}

export const VISIONS = {
  lantern: drawLantern,
  fall: drawFall,
};

// Draws vision `vision` ({ name, mood, start, moodStart }) at time `now` (seconds).
export function drawVision(ctx, vision, now) {
  const draw = VISIONS[vision.name];
  if (!draw) throw new Error(`Unknown vision '${vision.name}'`);
  // Fading in over the room, at first, if it was asked to (`fade` seconds).
  const fadeIn = vision.fade ? Math.min(1, (now - vision.start) / vision.fade) : 1;
  ctx.save();
  ctx.globalAlpha = fadeIn;
  draw(ctx, now - vision.start, vision.mood ?? 'calm', now - (vision.moodStart ?? vision.start));
  ctx.restore();
}
