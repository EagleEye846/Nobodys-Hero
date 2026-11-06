import { SCREEN_WIDTH as W, UI_SCALE as S } from '../config.js';
import { makeSprite } from '../engine/sprite.js';
import { sfx } from '../audio/music.js';
import * as ART from '../data/art/rumboldBattle.js';
import { DRAPE_WIDTH, PELMET_HEIGHT } from './theatreBackdrop.js';
import * as hud from './hud.js';
import { buttonTop, COLORS, boxRect } from './hud.js';

// KING PEPTUP's last act (phase 3 of his fight, `stage: 'puppet'` in
// src/data/enemies/rumbold.js): Tuck has let go of the levers, and the puppet
// moves anyway. Something warm and a little cold has lit up inside the hollow
// wooden body, and it's running the show by itself now. These are the things
// that happen to the whole stage while it does (see stageEffects.js for the
// hooks):
//
//   the coming alive   his phase's beat cues each step: 'letgo' (the king
//                      slumps, wooden, Tuck's paws off the levers), 'kindle'
//                      (the light comes on in his chest and shows through the
//                      eye holes and the joints), 'rise' (his head ticks up,
//                      the strings whip over and haul Tuck up off his stool),
//                      'alive' (the show is his)
//   the light          a bloom over every gap in the wood the light shows
//                      through; it gutters when he's hit, and at the end
//                      ('gutter', or beaten) it slips out of him and drifts
//                      away up the hall
//   the house lights   down, and flickering; footlight bulbs blowing and
//                      coming back
//   the box            hung from the rigging on two ropes, swaying, and
//                      jerked now and then
//   your buttons       on strings he's working: they hang and swing, get
//                      yanked up, and now and then one shows a stage word
//                      instead of its own (FIGHT reads CUE for a moment)
//   his hands          in his turn he leans out and REACHES OVER THE BOX: two
//                      long arms come round it from his shoulders and the
//                      hands curl over its top corners (drawn after the
//                      box's border, so they grip it); his body stays behind
//   his head           when he talks to you it SNAPS right round on its side,
//                      the face turned out at you, held while he talks
//   his finale         (rumboldAliveTear, which leaves `tear` on the box):
//                      the house goes dark, his head comes slowly right
//                      round to look out at you (RUMBOLD_STARE), the box is
//                      torn in two by his strings and pulled away, the set
//                      falls away, and the whole screen is the fly tower
//                      behind the stage (drawFlyTower), lit by him, with a
//                      thin frame round all of it
//
// It all stays readable: the box only LOOKS moved (bullets and soul move with
// it), a yanked button still works, and a borrowed label is gone in a moment.

// The light: a fire. A yellow-white core, orange round it, and deep ember red
// at the edge.
const CORE = '255, 240, 180';
const WARM = '255, 138, 28';
const COLD = '196, 60, 10';

const SPRITE_SCALE = 2;
// Tuck hangs in the left of the king's sprite (rumboldBattle.js): while he's
// swung out into the box (rumboldAlive.js), that strip isn't drawn.
const TUCK_STRIP = 18;
// The king's left hand, roughly, in the stage's pixels (from his battlePos):
// where the strings to your buttons go up to.
const HAND = { x: 218, y: 130 };

// What a button's label turns into when a stage word bleeds through.
const CUE_WORDS = { FIGHT: 'CUE', TALK: 'LINES', SPELLS: 'MAGIC', ITEMS: 'PROPS', DEFEND: 'BOW', RUN: 'EXIT' };

// Seconds into his `out` / `death` clip when the light leaves him: spared, as
// it slips up out of the jaw; beaten, after the joints have gone (frame 12 of
// RUMBOLD_ALIVE_BREAK).
const leaveAt = (how) => (how === 'defeated' ? 1.5 : 0.55);

const rand = (a, b) => a + Math.random() * (b - a);

// How much the stage still moves to his strings: 1 while he's working them,
// running down to 0 over a second and a half once he's beaten or spared.
function settle(battle) {
  const foe = battle.phased;
  if (!foe || foe.state === 'active') return 1;
  return Math.min(1, Math.max(0, 1 - (battle.time - foe.leftAt) / 1.5));
}

// The sprites, made once.
let looks = null;
function getLooks() {
  if (looks) return looks;
  const palette = ART.RUMBOLD_PALETTE;
  const make = (rows) => (rows ? makeSprite(rows, palette) : null);
  const jammed = make(ART.RUMBOLD_JAMMED_SPRITE);
  const slump = ART.RUMBOLD_JAMMED_ANIM?.spared?.frames;
  const intro = ART.RUMBOLD_ALIVE_ANIM?.intro?.frames ?? [];
  looks = {
    // Tuck's paws off the levers: the king sags in the seat.
    limp: make(slump?.[slump.length - 1]) ?? jammed,
    // The light coming on in the dark sockets (the first half of his
    // `intro`), then him rising with it and Tuck hauled up (the rest).
    kindle: intro.slice(1, 4).map(make),
    rise: intro.slice(4).map(make),
    still: make(ART.RUMBOLD_ALIVE_SPRITE) ?? jammed,
    stare: (ART.RUMBOLD_STARE?.frames ?? []).map(make),
    // The head on its way round (a frame or two), and him leaning out to
    // the box with no arms drawn on him.
    snapMid: make(ART.RUMBOLD_SNAP_MID),
    reach: (ART.RUMBOLD_REACH?.frames ?? []).map(make),
  };
  // Where the light shows through (its brightest pixels in the still), for
  // the bloom.
  const core = ART.GLOW_CORE;
  const rows = ART.RUMBOLD_ALIVE_SPRITE ?? [];
  looks.gaps = [];
  rows.forEach((row, y) => [...row].forEach((ch, x) => {
    if (ch === core && x >= TUCK_STRIP) looks.gaps.push({ x, y });
  }));
  // The middle of it all: his chest.
  const n = looks.gaps.length || 1;
  looks.heart = looks.gaps.length
    ? { x: looks.gaps.reduce((sum, p) => sum + p.x, 0) / n, y: looks.gaps.reduce((sum, p) => sum + p.y, 0) / n }
    : { x: 46, y: 30 };
  return looks;
}


// How he comes apart, beaten (stage pixels from where he hangs; the times
// are seconds into his `death` clip, 8 frames a second, matching what the
// frames do: RUMBOLD_ALIVE_BREAK in rumboldBattle.js). Each piece that lets
// go throws splinters and a puff of dust and gives a little knock; then every
// string snaps and whips, the house lights stutter, the light climbs out of
// him in a column and his body falls; and last the head drops, the crown
// bounces off it in gold, and the last of his show (the confetti) comes down.
const WOOD = ['#c9a06a', '#e6c896', '#8e6844', '#563c28'];
const GOLD = ['#d4ac48', '#f0c050', '#fff2b0'];
const SHOW = ['#ff4f7a', '#ffd23a', '#4fe3d0', '#7ab8ff', '#c78bff'];
function deathPlan(foe) {
  const at = (sx, sy) => ({ x: foe.pos.x + sx * SPRITE_SCALE, y: foe.pos.y + sy * SPRITE_SCALE });
  const FLOOR_Y = foe.pos.y + 80 * SPRITE_SCALE;
  const splinters = (battle, p, n, colors = WOOD, speed = 70) => {
    for (let i = 0; i < n; i++) {
      const a = rand(-Math.PI, 0);
      const v = rand(0.4, 1) * speed;
      battle.bits.chip(p.x, p.y, { vx: Math.cos(a) * v, vy: Math.sin(a) * v - 10, color: colors[i % colors.length], w: 2 + Math.floor(rand(0, 3)), h: 2, floor: FLOOR_Y - 2, spin: rand(-14, 14) });
    }
  };
  const drop = (sx, sy, noise) => (battle) => {
    const p = at(sx, sy);
    splinters(battle, p, 9);
    battle.bits.puff(p.x, p.y, { vy: -10, r: 3, grow: 9, life: 0.6 });
    battle.bits.star(p.x, p.y, { size: 9, life: 0.18 });
    battle.shake = Math.max(battle.shake, 0.1);
    sfx(noise);
  };
  return [
    { at: 0.3, go: drop(58, 38, 'chop') },
    { at: 0.55, go: drop(30, 38, 'chop') },
    { at: 0.8, go: drop(50, 62, 'chop') },
    { at: 0.95, go: drop(38, 62, 'chop') },
    // Every string goes at once.
    { at: 1.2, go: (battle) => {
      for (let i = 0; i < 9; i++) {
        const top = at(18 + i * 6, 6);
        battle.bits.lash(top.x, top.y, { dx: rand(-40, 40), dy: rand(50, 110), sway: rand(8, 20) });
      }
      splinters(battle, at(44, 6), 8, GOLD, 60);
      battle.stageState.flicker = 0.9;
      battle.shake = Math.max(battle.shake, 0.15);
      sfx('click');
      sfx('chop');
    } },
    // The light goes up out of him as his body gives, and the hall shakes.
    { at: 1.5, go: (battle) => {
      const heart = at(44, 44);
      battle.bits.beam(heart.x, heart.y, { life: 2.0, width: 14 });
      battle.bits.star(heart.x, heart.y, { size: 40, life: 0.5 });
      battle.bits.ring(heart.x, heart.y, { speed: 210, life: 0.7, color: '#ffe9a8', width: 3 });
      battle.bits.ring(heart.x, FLOOR_Y, { speed: 190, life: 0.6, squash: 0.2, color: '#ffe9a8', width: 2 });
      battle.bits.dust(heart.x, FLOOR_Y, 80, 18, { spray: 1 });
      for (let i = 0; i < 16; i++) battle.bits.mote(heart.x + rand(-12, 12), heart.y + rand(-10, 20), { vy: -rand(26, 60), life: rand(1.2, 2.2), color: '#fff2cf', size: 2 });
      splinters(battle, heart, 14, WOOD.concat(GOLD), 110);
      battle.stageFlash = Math.max(battle.stageFlash ?? 0, 0.3);
      battle.shake = Math.max(battle.shake, 0.3);
      sfx('crumble');
      sfx('boom');
    } },
    // His head drops, and the crown comes off it.
    { at: 1.68, go: (battle) => {
      const head = at(56, 74);
      splinters(battle, head, 12, GOLD, 90);
      battle.bits.dust(head.x, FLOOR_Y, 40, 8);
      battle.bits.ring(head.x, FLOOR_Y - 2, { speed: 110, life: 0.4, squash: 0.25, color: '#e8dcc4' });
      battle.shake = Math.max(battle.shake, 0.18);
      sfx('thud');
      sfx('clack');
    } },
    // The last of his show, coming down out of the flies.
    { at: 2.0, go: (battle) => {
      for (let i = 0; i < 44; i++) {
        battle.bits.add({ kind: 'spark', x: rand(60, 310), y: rand(-10, 10), vx: rand(-10, 10), vy: rand(8, 30), gravity: 14, life: rand(2.4, 3.6), color: SHOW[i % SHOW.length], size: 2 });
      }
    } },
  ];
}

// A soft round glow, added to what's under it.
function glow(ctx, x, y, r, rgb, alpha) {
  if (alpha <= 0.01 || r <= 0) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(${rgb}, ${alpha.toFixed(3)})`);
  g.addColorStop(1, `rgba(${rgb}, 0)`);
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

// The footlight bulbs, where theatreBackdrop.js puts them.
const BULBS = Array.from({ length: 22 }, (_, i) => DRAPE_WIDTH + 8 + i * ((W - DRAPE_WIDTH * 2 - 16) / 21));

// The two halves of the torn box (in UI space), `k` of the way through being
// pulled apart: a jagged seam down the middle, each half dragged up and out
// to its side on two strings, turning as it goes. `what`: 'back' (the black
// of it) or 'border'.
const SEAM = [0, 3, -2, 4, -3, 2, -4, 3, -1, 2, 0];
function drawTorn(ctx, tear, what) {
  const h = tear.home;
  const k = Math.min(1, (tear.t - tear.tear) / (tear.open - tear.tear));
  const e = k * k;
  const x0 = h.x * S;
  const y0 = h.y * S;
  const w = h.w * S;
  const ht = h.h * S;
  const mid = x0 + w / 2;
  for (const side of [-1, 1]) {
    ctx.save();
    const cx = mid + side * w * 0.25;
    const cy = y0 + ht / 2;
    ctx.translate(cx + side * e * 220, cy - e * 260);
    ctx.rotate(side * e * 0.5);
    ctx.translate(-cx, -cy);
    ctx.beginPath();
    const edge = side < 0 ? x0 : x0 + w;
    ctx.moveTo(edge, y0);
    SEAM.forEach((dx, i) => ctx.lineTo(mid + dx * 2, y0 + (ht * i) / (SEAM.length - 1)));
    ctx.lineTo(edge, y0 + ht);
    ctx.closePath();
    if (what === 'back') {
      ctx.fillStyle = '#000';
      ctx.fill();
    } else {
      ctx.strokeStyle = COLORS.box;
      ctx.lineWidth = 3;
      ctx.stroke();
      // The strings tearing it, up into the dark.
      ctx.strokeStyle = 'rgba(232, 222, 200, 0.85)';
      ctx.lineWidth = 2;
      for (const u of [0.2, 0.8]) {
        const sx = side < 0 ? x0 + (w / 2) * u : mid + (w / 2) * u;
        ctx.beginPath();
        ctx.moveTo(sx, y0);
        ctx.lineTo(sx + side * 20, y0 - 400);
        ctx.stroke();
      }
    }
    ctx.restore();
  }
}

// When the house blacks out in his finale (seconds into it, how long):
// single blinks, and once or twice a stutter of two.
const BLACKOUTS = [
  [5.7, 0.08], [9.3, 0.06], [9.42, 0.1], [12.4, 0.09], [16.1, 0.07],
  [51.6, 0.08], [55.9, 0.06], [56.02, 0.1], [60.3, 0.09], [64.4, 0.08],
];

function hash(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
const block = (ctx, color, x, y, w, h) => {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
};

// Behind the stage, once his finale has torn the box away and the set has
// fallen: the fly tower, where the whole show hangs. A tall back wall of old
// brick, the gridiron across the top with its pulleys, ropes everywhere, the
// fly galleries up the sides with their counterweights, the torn painted sky
// of his old backdrop hanging in strips, and him in the middle of it all,
// hung on his bar, head right round, and the light pouring out of him onto
// everything. In stage pixels; `chest` is where the light is.
// (Where rumboldFinaleBullets.js's FLY_FLOOR is.)
const FLY_FLOOR = 161;
// The back wall of the fly tower, old brick, black at the top: it never
// changes, so it's drawn once (some eight hundred bricks) and kept.
let flyWall = null;
function getFlyWall() {
  if (flyWall) return flyWall;
  flyWall = document.createElement('canvas');
  flyWall.width = W;
  flyWall.height = 164;
  const ctx = flyWall.getContext('2d');
  const wall = ctx.createLinearGradient(0, 0, 0, FLY_FLOOR);
  wall.addColorStop(0, '#050308');
  wall.addColorStop(1, '#130b12');
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, W, 164);
  for (let row = 0; row * 6 < FLY_FLOOR; row++) {
    const y = row * 6;
    block(ctx, 'rgba(0, 0, 0, 0.45)', 0, y, W, 1);
    for (let x = (row % 2) * 7; x < W; x += 14) block(ctx, 'rgba(0, 0, 0, 0.45)', x, y, 1, 6);
    for (let k = 0; k < 6; k++) {
      const n = row * 31 + k;
      block(ctx, 'rgba(70, 40, 40, 0.25)', Math.floor(hash(n) * 22) * 14 + (row % 2) * 7 + 1, y + 1, 13, 5);
    }
  }
  return flyWall;
}

function drawFlyTower(ctx, time, chest, king) {
  const floorY = FLY_FLOOR;
  // His light flares as he throws the grand finale.
  const flare = 1 + (king?.pose?.glow ?? 0);
  // The back wall: old brick, black at the top.
  ctx.drawImage(getFlyWall(), 0, 0);
  // His light, washing over the wall; and slow shafts of it, turning. It
  // breathes: a slow swell in, a slower ebb out, and a tremble on top.
  const breath = Math.sin(time * 1.7);
  const pulse = 0.8 + 0.17 * Math.sign(breath) * Math.abs(breath) ** 0.6 + 0.04 * Math.sin(time * 17);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  // (Kept low and close to him: the wall behind must stay dark so every
  // bullet, warm or pale, stands out from it.)
  glow(ctx, chest.x, chest.y, 150, WARM, 0.07 * pulse * flare);
  glow(ctx, chest.x, chest.y, 70, CORE, 0.07 * pulse * flare);
  for (let k = 0; k < 7; k++) {
    const a = (k / 7) * Math.PI * 2 + time * 0.12 * (k % 2 ? 1 : -1);
    ctx.fillStyle = `rgba(${WARM}, ${(0.022 * pulse).toFixed(3)})`;
    ctx.beginPath();
    ctx.moveTo(chest.x, chest.y);
    ctx.lineTo(chest.x + Math.cos(a - 0.06) * 340, chest.y + Math.sin(a - 0.06) * 340);
    ctx.lineTo(chest.x + Math.cos(a + 0.06) * 340, chest.y + Math.sin(a + 0.06) * 340);
    ctx.fill();
  }
  ctx.restore();
  // The torn painted sky of his old backdrop, hanging in strips, swaying.
  for (let s = 0; s < 9; s++) {
    const x = [44, 56, 70, 84, 112, 250, 262, 274, 300][s];
    const len = 40 + hash(s + 700) * 60;
    const sway = Math.sin(time * 0.9 + s) * 2;
    for (let y = 10; y < len; y++) {
      const off = sway * ((y - 10) / len);
      block(ctx, y % 9 < 6 ? '#1c2440' : '#18203a', x + off, y, 9, 1);
    }
    // A painted star or two still on it, and the ragged hem.
    block(ctx, '#8a7a40', x + 3 + sway * 0.5, 22 + hash(s + 710) * 20, 2, 2);
    for (let i = 0; i < 9; i += 2) block(ctx, '#1c2440', x + i + sway, len, 2, 1 + hash(s * 9 + i) * 4);
  }
  // Ropes hanging out of the dark from the grid, some with hooks or a bag.
  for (let n = 0; n < 22; n++) {
    const x = 20 + hash(n + 9400) * (W - 40);
    const len = 30 + hash(n + 9410) * 100;
    const sway = Math.sin(time * 0.6 + n * 1.7) * (len / 60);
    ctx.globalAlpha = 0.35 + hash(n + 9420) * 0.3;
    ctx.strokeStyle = '#8a8070';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(Math.round(x) + 0.5, 10);
    ctx.quadraticCurveTo(Math.round(x) + 0.5, 10 + len / 2, Math.round(x + sway) + 0.5, 10 + len);
    ctx.stroke();
    const end = hash(n + 9430);
    if (end < 0.25) block(ctx, '#4a3e2c', x + sway - 2, 10 + len, 5, 6);
    else if (end < 0.45) block(ctx, '#7a6a50', x + sway - 1, 10 + len, 2, 3);
  }
  ctx.globalAlpha = 1;
  // The fly galleries up both sides: plank walks with rails, and the
  // counterweight arbors running up and down their tracks.
  for (const side of [-1, 1]) {
    const x0 = side < 0 ? 0 : W - 36;
    for (const y of [58, 108]) {
      block(ctx, '#0a0710', x0, y - 1, 36, 5);
      block(ctx, '#3a2a1c', x0, y, 36, 3);
      block(ctx, '#5a4430', x0, y, 36, 1);
      for (let p = 3; p < 36; p += 8) block(ctx, '#2a1e16', x0 + p, y - 12, 2, 12);
      block(ctx, '#4a3626', x0, y - 12, 36, 2);
    }
    const tx = side < 0 ? 6 : W - 10;
    block(ctx, '#1a1620', tx, 10, 4, floorY - 10);
    block(ctx, '#2c2632', tx + 1, 10, 1, floorY - 10);
    const ay = 30 + (Math.sin(time * 0.7 + side) * 0.5 + 0.5) * 90;
    block(ctx, '#0a0710', tx - 2, ay - 1, 8, 22);
    for (let i = 0; i < 5; i++) block(ctx, i % 2 ? '#5a5048' : '#6a6058', tx - 1, ay + i * 4, 6, 3);
  }
  // The gridiron across the top, its pulleys turning.
  block(ctx, '#0a0710', 0, 0, W, 11);
  block(ctx, '#221c28', 0, 7, W, 3);
  for (let x = 12; x < W; x += 26) {
    ctx.fillStyle = '#3a3440';
    ctx.beginPath(); ctx.arc(x, 9, 3.5, 0, Math.PI * 2); ctx.fill();
    const a = time * 2 + x;
    block(ctx, '#7a7080', x + Math.cos(a) * 2 - 0.5, 9 + Math.sin(a) * 2 - 0.5, 1, 1);
  }
  // The floor of it: bare boards, dust.
  block(ctx, '#1c1814', 0, floorY, W, 164 - floorY);
  block(ctx, '#3a3228', 0, floorY, W, 1);
  for (let x = 0; x < W; x += 18) block(ctx, '#110e0b', x, floorY + 1, 1, 7);
  // A cold, deep dusk over the whole set (everything but him and his light):
  // the wall, the galleries and the ropes sink into blue-black, so the
  // bullets (warm, gold, pink, cream, all outlined) are what you see.
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgba(4, 6, 22, 0.62)';
  ctx.fillRect(0, 0, W, 164);
  ctx.restore();
  // Him, hung in the middle of it all, looking out at you.
  if (king) {
    ctx.save();
    ctx.globalAlpha *= king.alpha ?? 1;
    const w = king.sprite.width * SPRITE_SCALE;
    const h = king.sprite.height * SPRITE_SCALE;
    const pose = king.pose;
    if (pose) {
      // Hauling back, thrown forward, stretched up, bowing: all about his feet.
      ctx.translate(king.x + w / 2, king.y + h + (pose.lift ?? 0));
      ctx.rotate(pose.tilt);
      ctx.scale(pose.sx, pose.sy);
      ctx.drawImage(king.sprite, -w / 2, -h, w, h);
    } else {
      ctx.drawImage(king.sprite, king.x, king.y, w, h);
    }
    ctx.restore();
  }
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  glow(ctx, chest.x, chest.y, 18, WARM, 0.35 * pulse);
  glow(ctx, chest.x, chest.y, 6, CORE, 0.5 * pulse);
  ctx.restore();
  // Dust and grit sifting down out of the flies, lit as it passes him.
  for (let n = 0; n < 40; n++) {
    const t = (time * (0.05 + hash(n + 9950) * 0.08) + hash(n + 9960)) % 1;
    const x = hash(n + 9970) * W + Math.sin(time * 0.7 + n) * 3;
    const y = t * floorY;
    const near = Math.max(0, 1 - Math.hypot(x - chest.x, y - chest.y) / 120);
    ctx.globalAlpha = 0.15 + 0.5 * near;
    block(ctx, near > 0.3 ? '#ffe0a0' : '#a89880', x, y, 1, 1);
  }
  ctx.globalAlpha = 1;
  // The dark closing in at the edges.
  const v = ctx.createRadialGradient(chest.x, chest.y, 60, chest.x, chest.y, 260);
  v.addColorStop(0, 'rgba(0, 0, 0, 0)');
  v.addColorStop(1, 'rgba(0, 0, 0, 0.55)');
  ctx.fillStyle = v;
  ctx.fillRect(0, 0, W, 164);
}

export const PUPPET_STAGE = {
  start(battle) {
    getLooks();
    return {
      mode: 'limp',
      cueAt: battle.time,
      // How bright the light in him is (0 to 1), and where it's heading.
      light: 0,
      lightTo: 0,
      // House lights: how dark the hall is, and a flicker running out.
      dark: 0.18,
      flicker: 0,
      nextFlicker: battle.time + rand(1.5, 3),
      dead: new Set(),
      // The strings whipping over (the 'rise' cue).
      whipAt: -99,
      // The box on its ropes: a jerk that dies away.
      jerk: 0,
      jerkDir: 1,
      lastAttack: -99,
      // Your buttons: a yank that dies away, on one of them, and a borrowed
      // label.
      yank: { i: -1, at: -99, power: 0 },
      nextYank: battle.time + rand(1, 2.5),
      cue: { i: -1, until: -99 },
      nextCue: battle.time + rand(4, 7),
      // The light leaving him, at the end.
      gone: null,
      // When he last started or stopped talking (his head snaps).
      talkEdge: -99,
      talking: false,
    };
  },

  cue(battle, foe, name) {
    const state = battle.stageState;
    state.cueAt = battle.time;
    switch (name) {
      case 'letgo':
        state.mode = 'limp';
        state.lightTo = 0;
        sfx('click');
        break;
      case 'kindle':
        state.mode = 'kindle';
        state.lightTo = 0.7;
        state.dark = 0.42;
        sfx('flare');
        break;
      case 'rise':
        state.mode = 'rise';
        state.lightTo = 1;
        state.whipAt = battle.time;
        state.flicker = 1.4;
        battle.shake = 0.5;
        sfx('whoosh');
        sfx('hook');
        break;
      case 'alive':
        state.mode = 'alive';
        state.lightTo = 1;
        state.dark = 0.46;
        break;
      case 'lights':
        state.flicker = 1.2;
        sfx('click');
        break;
      case 'gutter':
        // Tuck's own voice: the light in him shrinks and shakes.
        state.lightTo = 0.35;
        state.flicker = 0.8;
        sfx('back');
        break;
      default:
    }
  },

  skip(battle, foe) {
    this.cue(battle, foe, 'alive');
    battle.stageState.light = 1;
  },

  update(battle, dt) {
    const state = battle.stageState;
    const foe = battle.phased;
    if (state.leaveFrom && battle.time >= state.leaveFrom()) state.lightTo = 0;
    const talking = Boolean(foe && battle.isTalking(foe));
    if (talking !== state.talking) {
      state.talking = talking;
      state.talkEdge = battle.time;
    }
    state.light += (state.lightTo - state.light) * Math.min(1, dt * (state.mode === 'kindle' ? 1.2 : 3));
    // Once he's gone (beaten or spared) the show's over: nothing new blows or
    // gets yanked, and when the light has gone off up the hall and he's said
    // his last (beaten, he asks for the house lights), they come back up, the
    // dead bulbs one at a time. A little too late.
    const over = Boolean(foe && foe.state !== 'active');
    while (state.deathPlan?.length && battle.time - foe.leftAt >= state.deathPlan[0].at) state.deathPlan.shift().go(battle, foe);
    if (over && state.gone && battle.time - state.gone.from > 1.6 && battle.phase !== 'speech') {
      state.dark += (0.06 - state.dark) * Math.min(1, dt * 0.8);
      if (state.dead.size && battle.time >= (state.relightAt ?? 0)) {
        state.relightAt = battle.time + 0.32;
        state.dead.delete([...state.dead][0]);
        sfx('click');
      }
    }
    // The light slipping out of him: a thin high sound as it goes.
    if (state.gone && !state.gone.heard && battle.time >= state.gone.from) {
      state.gone.heard = true;
      sfx('shimmer');
    }
    // The house lights: now and then they stutter, and a bulb or two along
    // the footlights blows (and later comes back).
    state.flicker = Math.max(0, state.flicker - dt);
    if (state.mode !== 'limp' && !over && battle.time >= state.nextFlicker) {
      state.nextFlicker = battle.time + rand(2.2, 5.5);
      state.flicker = rand(0.25, 0.6);
      if (Math.random() < 0.6) state.dead.add(Math.floor(Math.random() * BULBS.length));
      if (state.dead.size > 5 || Math.random() < 0.3) state.dead.delete([...state.dead][0]);
    }
    // The box, jerked as each attack starts.
    if (battle.phase === 'dodge' && state.lastAttack !== foe?.attackAt) {
      state.lastAttack = foe?.attackAt;
      state.jerk = 1;
      state.jerkDir = Math.random() < 0.5 ? -1 : 1;
    }
    state.jerk = Math.max(0, state.jerk - dt * 1.4);
    // Your buttons: yanked one at a time; a stage word bleeds onto one.
    if (state.mode === 'alive' && !over && battle.time >= state.nextYank) {
      state.nextYank = battle.time + rand(1.6, 3.4);
      state.yank = { i: Math.floor(Math.random() * 6), at: battle.time, power: rand(0.7, 1) };
      if (['command', 'ally', 'talk', 'spells', 'items'].includes(battle.phase)) sfx('creak');
    }
    if (state.mode === 'alive' && !over && battle.time >= state.nextCue) {
      state.nextCue = battle.time + rand(6, 10);
      state.cue = { i: Math.floor(Math.random() * 6), until: battle.time + 0.7 };
    }
    // The light, gone out of him, drifting off up the hall.
    if (state.gone && foe) {
      const t = battle.time - state.gone.from;
      if (t > 0) {
        const g = state.gone;
        g.vx += (-14 - g.vx) * dt * 0.5;
        g.vy += (-10 - g.vy) * dt * 0.6;
        g.x += (g.vx + Math.sin(t * 3.1) * 9) * dt;
        g.y += (g.vy + Math.cos(t * 2.3) * 5) * dt;
        g.trail.push({ x: g.x, y: g.y, at: battle.time });
        g.trail = g.trail.filter((p) => battle.time - p.at < 0.6);
      }
    }
  },

  // How the light in him is right now (0 to 1), hurt or not.
  brightness(battle, foe) {
    const state = battle.stageState;
    let light = state.light;
    // A hit makes it gutter.
    const sinceHit = battle.time - (foe.hitAt ?? -99);
    if (sinceHit < 0.4) light *= 0.35 + 0.65 * (sinceHit / 0.4);
    if (state.flicker > 0 && Math.floor(battle.time * 23) % 3 === 0) light *= 0.55;
    // Going out with him, beaten or spared.
    if (foe.state !== 'active') {
      const t = battle.time - foe.leftAt - (leaveAt(foe.state) - 0.55);
      light = t < 0 ? light : Math.max(0, light * (1 - t / 0.6));
    }
    return light;
  },

  drawBack(ctx, battle) {
    const state = battle.stageState;
    // The house lights down, with a stutter now and then.
    const stutter = state.flicker > 0 ? (Math.floor(battle.time * 17) % 2 ? 0.28 : -0.08) : 0;
    const tear = battle.phase === 'dodge' ? battle.box.tear : null;
    const dim = tear ? Math.min(0.32, tear.t * 0.2) : 0;
    const dark = Math.max(0, Math.min(0.75, state.dark + stutter + dim));
    ctx.fillStyle = `rgba(6, 4, 14, ${dark.toFixed(3)})`;
    ctx.fillRect(0, 0, W, 164);
    // Blown bulbs along the footlights.
    for (const i of state.dead) {
      const x = BULBS[i];
      ctx.fillStyle = '#2a2420';
      ctx.fillRect(Math.round(x - 2), 159, 5, 4);
      ctx.fillStyle = '#5a5048';
      ctx.fillRect(Math.round(x - 1), 159, 3, 2);
    }
  },

  drawFoe(ctx, battle, foe, x, y, w, h) {
    const state = battle.stageState;
    const L = getLooks();
    const t = battle.time - state.cueAt;
    let sprite = null;
    if (foe.state === 'active') {
      if (state.mode === 'limp') sprite = L.limp;
      else if (state.mode === 'kindle' && L.kindle.length) sprite = L.kindle[Math.min(L.kindle.length - 1, Math.floor(t * 2.2))];
      else if (state.mode === 'rise' && L.rise.length) sprite = L.rise[Math.min(L.rise.length - 1, Math.floor(t * 5))];
      else if (state.mode === 'alive') {
        const hit = battle.time - (foe.hitAt ?? -99) < 0.3;
        // Leaning out to the box once his face is dug (his arms are the
        // stage's: see drawHands).
        if (this.reaching(battle, foe) && !hit && L.reach.length) sprite = L.reach[Math.floor(battle.time * ART.RUMBOLD_REACH.fps) % L.reach.length];
        // His head snapping round to look at you, and back: a frame or two.
        else if (battle.time - state.talkEdge < 0.12 && L.snapMid && !hit) sprite = L.snapMid;
      }
    }
    // His finale: his head coming round to look at you, and held there.
    const tear = battle.phase === 'dodge' ? battle.box.tear : null;
    if (tear && foe.state === 'active' && L.stare.length) {
      const i = Math.min(L.stare.length - 1, Math.floor((tear.t / tear.turned) * L.stare.length));
      ctx.drawImage(L.stare[i], x, y, w, h);
      return true;
    }
    // Tuck swung out into the box: his strip of the stage is empty.
    const tuckOut = battle.phase === 'dodge' && battle.bullets.some((bullet) => bullet.isTuck);
    if (!sprite && !tuckOut) return false;
    sprite ??= battle.animFrame(foe) ?? foe.sprite;
    const scale = w / foe.sprite.width;
    // Reaching, he's left his spot to float over the box (floatSpot); Tuck
    // stays hung where he was (unless he's swung out into the box).
    if (sprite !== null && L.reach.includes(sprite)) {
      const spot = this.floatSpot(battle, foe);
      if (!tuckOut) ctx.drawImage(foe.sprite, 0, 0, TUCK_STRIP, foe.sprite.height, x, y, TUCK_STRIP * scale, foe.sprite.height * scale);
      ctx.drawImage(sprite, spot.x, spot.y, sprite.width * scale, sprite.height * scale);
      return true;
    }
    const bottom = foe.pos.y + foe.sprite.height * SPRITE_SCALE;
    const top = sprite.height === foe.sprite.height ? y : bottom - sprite.height * scale;
    if (tuckOut) {
      ctx.drawImage(sprite, TUCK_STRIP, 0, sprite.width - TUCK_STRIP, sprite.height, x + TUCK_STRIP * scale, top, (sprite.width - TUCK_STRIP) * scale, sprite.height * scale);
    } else {
      ctx.drawImage(sprite, x, top, sprite.width * scale, sprite.height * scale);
    }
    return true;
  },

  // Where his body floats while he reaches (stage pixels, the sprite's top
  // left): up off his spot to hang over the middle of the box's top edge,
  // shoulders just above it, bobbing and swaying, the rest of him behind it.
  floatSpot(battle, foe) {
    const k = Math.min(1, Math.max(0, (battle.time - foe.attackAt - ART.REACH_AT) / 0.45));
    const e = 1 - (1 - k) * (1 - k);
    const r = boxRect(1);
    const [[ax, ay], [bx]] = ART.REACH_SHOULDERS;
    const t = battle.time;
    const tx = (r.x + r.w / 2) / S - ((ax + bx) / 2) * SPRITE_SCALE + Math.sin(t * 1.4) * 5;
    const ty = r.y / S - ay * SPRITE_SCALE + 8 + Math.sin(t * 2.3) * 3;
    return { x: foe.pos.x + (tx - foe.pos.x) * e, y: foe.pos.y + (ty - foe.pos.y) * e };
  },

  // Whether he's reached out over the box now: it's his turn and his windup
  // has dug the face.
  reaching(battle, foe) {
    return battle.phase === 'dodge' && !battle.box.tear && foe?.state === 'active' && battle.stageState.mode === 'alive'
      && battle.time - (foe.attackAt ?? -99) >= ART.REACH_AT;
  },

  drawOver(ctx, battle) {
    const state = battle.stageState;
    const foe = battle.phased;
    if (!foe) return;
    const L = getLooks();
    const light = this.brightness(battle, foe);
    const ox = foe.pos.x;
    const oy = foe.pos.y;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    if (light > 0.01) {
      // The heart of it, in his chest.
      const hx = ox + L.heart.x * SPRITE_SCALE;
      const hy = oy + L.heart.y * SPRITE_SCALE;
      const pulse = 0.8 + 0.12 * Math.sin(battle.time * 9.1) + 0.08 * Math.sin(battle.time * 23.7);
      // Just the flame's own small glow: the wood round it stays wood.
      glow(ctx, hx, hy, 14 * light, WARM, 0.22 * light * pulse);
      glow(ctx, hx, hy, 5, CORE, 0.3 * light * pulse);
    }
    // The strings whipping over Tuck (the 'rise' cue): three lines lashing
    // from his hand down the stage, and tightening.
    const whip = battle.time - state.whipAt;
    if (whip >= 0 && whip < 0.7) {
      ctx.globalCompositeOperation = 'source-over';
      const from = { x: ox + 74, y: oy + 130 };
      const to = { x: ox + 18, y: oy + 100 };
      ctx.strokeStyle = '#f4ecdc';
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        const k = Math.min(1, whip / 0.35);
        const bow = (1 - k) * (30 - i * 12);
        ctx.globalAlpha = 1 - Math.max(0, whip - 0.45) / 0.25;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.quadraticCurveTo((from.x + to.x) / 2 - bow, Math.min(from.y, to.y) - bow * 1.2, to.x + (i - 1) * 6, to.y + (1 - k) * 10);
        ctx.stroke();
      }
    }
    // Leaving: the light, out of him, drifting off up the hall.
    if (state.gone) {
      const t = battle.time - state.gone.from;
      if (t > 0) {
        ctx.globalCompositeOperation = 'lighter';
        const fade = Math.max(0, 1 - t / 4.5);
        for (const p of state.gone.trail) {
          const age = (battle.time - p.at) / 0.6;
          glow(ctx, p.x, p.y, 4 * (1 - age), WARM, 0.25 * fade * (1 - age));
        }
        const g = state.gone;
        const wob = 0.8 + 0.2 * Math.sin(t * 13);
        glow(ctx, g.x, g.y, 16, COLD, 0.28 * fade * wob);
        glow(ctx, g.x, g.y, 7, WARM, 0.55 * fade * wob);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = fade;
        ctx.fillStyle = `rgb(${CORE})`;
        ctx.fillRect(Math.round(g.x) - 1, Math.round(g.y) - 1, 2, 2);
      }
    }
    ctx.restore();
  },

  // It's beaten or spared: the light leaves (after the first frames of his
  // `out` clip, where it rises up out of his jaw).
  leave(battle, foe) {
    const L = getLooks();
    const state = battle.stageState;
    // (Beaten, he comes apart first with the light still in him: it only starts
    // to go out when the light leaves, see update.)
    state.leaveFrom = () => foe.leftAt + leaveAt(foe.state) - 0.55;
    if (foe.state !== 'defeated') state.lightTo = 0;
    // Beaten, he comes apart in the stage's own way (deathPlan).
    state.deathPlan = foe.state === 'defeated' ? deathPlan(foe) : null;
    // (foe.leftAt is when his `out` clip starts: later, beaten, after the
    // bursts of his finale. Read it when it's time.)
    state.gone = {
      get from() { return foe.leftAt + leaveAt(foe.state); },
      x: foe.pos.x + L.heart.x * SPRITE_SCALE,
      y: foe.pos.y + (L.heart.y - 16) * SPRITE_SCALE,
      vx: 0,
      vy: -20,
      trail: [],
    };
  },

  boxSway(battle) {
    const state = battle.stageState;
    if (state.mode !== 'alive' || battle.box.tear) return null;
    const t = battle.time;
    const jerk = state.jerk * state.jerk;
    // (Once he's gone, it swings slower and slower, and hangs still.)
    const k = settle(battle);
    return {
      x: (Math.sin(t * 1.25) * 1.8 + state.jerkDir * jerk * Math.sin((1 - state.jerk) * 18) * 3) * k,
      y: (Math.sin(t * 2.5) * 0.6 - jerk * 2) * k,
    };
  },

  drawRigging(ctx, battle, sway) {
    const box = battle.box;
    ctx.save();
    ctx.strokeStyle = 'rgba(232, 222, 200, 0.75)';
    ctx.lineWidth = 1;
    for (const u of [0.15, 0.85]) {
      const bx = box.x + box.w * u + sway.x;
      ctx.beginPath();
      ctx.moveTo(Math.round(box.x + box.w * u) + 0.5, PELMET_HEIGHT);
      ctx.lineTo(Math.round(bx) + 0.5, Math.round(box.y + sway.y));
      ctx.stroke();
      // A brass ring where it's tied on.
      ctx.fillStyle = '#c8901a';
      ctx.fillRect(Math.round(bx) - 1, Math.round(box.y + sway.y) - 2, 3, 2);
    }
    ctx.restore();
  },

  // The box torn open (his finale). Before the tear it's the usual box; as
  // his strings rip it, two halves with a jagged seam, pulled apart and up
  // off the stage; after, nothing but the stage itself.
  drawBoxBack(ctx, battle, open) {
    const tear = battle.box.tear;
    if (!tear || tear.t < tear.tear) return false;
    if (tear.t < tear.open) {
      drawTorn(ctx, tear, 'back');
      return true;
    }
    // The stage falls away: the fly tower behind it, coming up out of the
    // dark (it covers the party and him: he's drawn in it).
    const foe = battle.phased;
    const L = getLooks();
    // (Every few seconds his head ticks back a notch and round again, like
    // something in his neck slipping a cog.)
    const tick = L.stare.length > 1 && (tear.t % 2.9) < 0.08;
    const frame = L.stare[L.stare.length - (tick ? 2 : 1)];
    // (While his head is off him and swollen huge, his body fades out, and
    // his light is in the head: rumboldAliveTear's GiantHead.)
    const headOff = tear.t >= tear.face && tear.t < tear.faceEnd;
    const fade = headOff ? Math.max(0, 1 - Math.min(tear.t - tear.face, tear.faceEnd - tear.t) / 0.4) : 1;
    const king = foe && frame && fade > 0 ? { sprite: frame, x: foe.pos.x, y: foe.pos.y, alpha: fade, pose: tear.pose } : null;
    const chest = headOff && tear.glow ? tear.glow : { x: (foe?.pos.x ?? 144) + 88, y: (foe?.pos.y ?? 0) + 104 };
    ctx.save();
    ctx.scale(S, S);
    ctx.globalAlpha = Math.min(1, (tear.t - tear.open) / 0.6);
    drawFlyTower(ctx, battle.time, chest, king);
    // Now and then the whole house goes black for a blink, and there's
    // nothing in the dark but his eyes. (Only behind: everything that can
    // hurt you stays lit.)
    if (BLACKOUTS.some(([at, long]) => tear.t >= at && tear.t < at + long)) {
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, W, 164);
      if (king) {
        ctx.globalCompositeOperation = 'lighter';
        for (const dx of [80, 96]) {
          const ex = foe.pos.x + dx;
          const ey = foe.pos.y + 80;
          glow(ctx, ex, ey, 9, WARM, 0.7);
          glow(ctx, ex, ey, 3, CORE, 0.9);
        }
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.restore();
    return true;
  },

  // Whether the fly tower is up (his finale, after the box is gone): the
  // battle leaves off the names and gauges over the stage.
  ownsStage(battle) {
    const tear = battle.phase === 'dodge' ? battle.box.tear : null;
    return Boolean(tear && tear.t >= tear.open);
  },

  // His hands over the box (in UI space, after the box's own border): from
  // his shoulders as he floats over it, one long jointed arm arches out and
  // down to each top corner, and the hands grip it, fingers curled over the
  // edge.
  drawHands(ctx, battle, open) {
    const foe = battle.phased;
    // The elbows come up first, then the hands come down onto the corners.
    const k = Math.min(1, (battle.time - foe.attackAt - ART.REACH_AT) / 0.45);
    const ease = (v) => 1 - (1 - v) * (1 - v);
    const up = ease(Math.min(1, k * 2));
    const down = ease(Math.max(0, k * 2 - 1));
    const r = boxRect(open);
    const t = battle.time;
    // Each arm: from a shoulder, by an elbow, to a hand on a top corner (UI
    // pixels).
    const spot = this.floatSpot(battle, foe);
    const [left, right] = ART.REACH_SHOULDERS
      .map(([x, y]) => [(spot.x + x * SPRITE_SCALE) * S, (spot.y + y * SPRITE_SCALE) * S])
      .sort((a, b) => a[0] - b[0]);
    // Each elbow high and out, like a spider's knee, flexing as he bobs.
    const knee = (sh, hand, i) => [(sh[0] + hand[0]) / 2 + (hand[0] - sh[0]) * 0.1, Math.min(sh[1], hand[1]) - 30 + Math.sin(t * 3.1 + i * 2) * 4];
    const handL = [r.x - 2, r.y - 3];
    const handR = [r.x + r.w + 2, r.y - 3];
    const arms = [
      { s: left, elbow: knee(left, handL, 0), hand: handL, dir: -1 },
      { s: right, elbow: knee(right, handR, 1), hand: handR, dir: 1 },
    ];
    // The fingers clench now and then.
    const clench = Math.sin(t * 7) * 1.2 + (Math.sin(t * 2.3) > 0.8 ? 2 : 0);
    const bone = (p, q, w, color, edge) => {
      ctx.lineWidth = w + 4;
      ctx.strokeStyle = '#0a0710';
      ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
      ctx.lineWidth = w;
      ctx.strokeStyle = color;
      ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
      ctx.lineWidth = 2;
      ctx.strokeStyle = edge;
      ctx.beginPath(); ctx.moveTo(p[0], p[1] + w / 3); ctx.lineTo(q[0], q[1] + w / 3); ctx.stroke();
    };
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    const ball = (p, rad) => {
      ctx.fillStyle = '#0a0710';
      ctx.beginPath(); ctx.arc(p[0], p[1], rad + 1.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#c9a06a';
      ctx.beginPath(); ctx.arc(p[0], p[1], rad - 1, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#e6c896';
      ctx.beginPath(); ctx.arc(p[0] - 1.5, p[1] - 1.5, rad - 4, 0, Math.PI * 2); ctx.fill();
    };
    const lerp = (p, q, v) => [p[0] + (q[0] - p[0]) * v, p[1] + (q[1] - p[1]) * v];
    for (const a of arms) {
      // The elbow rises from just over the box's top edge, straight above the
      // shoulder; the hand swings out and down from it.
      const rise = [a.s[0], Math.min(a.s[1], r.y - 10)];
      const el = lerp(rise, a.elbow, up);
      const hd = lerp(el, a.hand, down);
      // His body's behind the box: the upper arm comes up from behind its top
      // edge, so nothing of it (or the shoulder) shows inside.
      ctx.save();
      ctx.beginPath(); ctx.rect(0, 0, ctx.canvas.width, r.y - 2); ctx.clip();
      bone(a.s, el, 11, '#c9a06a', '#f6e6c4');
      ball(a.s, 8);
      ctx.restore();
      bone(el, hd, 9, '#8e6844', '#e6c896');
      ball(el, 7);
      if (down < 0.6) continue;
      // The hand: a palm over the corner, long fingers curled round it and
      // down the OUTSIDE of the side wall (never into the box), the thumb
      // hooked over the top edge.
      const [hx, hy] = hd;
      const wall = a.dir > 0 ? r.x + r.w : r.x;
      ctx.fillStyle = '#0a0710';
      ctx.beginPath(); ctx.ellipse(hx, hy - 3, 14, 8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#c9a06a';
      ctx.beginPath(); ctx.ellipse(hx, hy - 3, 12, 6, 0, 0, Math.PI * 2); ctx.fill();
      for (let i = 0; i < 4; i++) {
        const fx = hx + a.dir * (i * 3 - 3);
        const tipX = wall + a.dir * (5 + i * 2.5 - clench * 0.5);
        const end = [tipX, hy + 9 + i * 4 + (i % 2) + clench];
        const path = () => { ctx.beginPath(); ctx.moveTo(fx, hy - 4); ctx.lineTo(tipX + a.dir * 3, hy + 2); ctx.lineTo(end[0], end[1]); ctx.stroke(); };
        ctx.strokeStyle = '#0a0710';
        ctx.lineWidth = 7;
        path();
        ctx.strokeStyle = i % 2 ? '#e6c896' : '#f6e6c4';
        ctx.lineWidth = 4;
        path();
        ctx.fillStyle = '#563c28';
        ctx.fillRect(Math.round(end[0]) - 1, Math.round(end[1]) - 1, 2, 2);
      }
      // The thumb lies along the top of the border, pointing in, and lifts a
      // little as he clenches; it never goes past the edge.
      const tx = wall - a.dir * (16 + clench);
      const thumb = () => { ctx.beginPath(); ctx.moveTo(hx - a.dir * 6, hy - 4); ctx.lineTo(tx, hy - 2 - Math.max(0, clench)); ctx.stroke(); };
      ctx.strokeStyle = '#0a0710';
      ctx.lineWidth = 6;
      thumb();
      ctx.strokeStyle = '#e6c896';
      ctx.lineWidth = 3;
      thumb();
    }
    ctx.restore();
  },

  drawBoxBorder(ctx, battle, open) {
    const tear = battle.box.tear;
    if (!tear) {
      // His hands go over the border: draw it here, then them.
      if (!this.reaching(battle, battle.phased)) return false;
      hud.drawBoxBorder(ctx, open);
      this.drawHands(ctx, battle, open);
      return true;
    }
    if (tear.t < tear.turned) return false;
    if (tear.t < tear.tear) {
      // It strains: the border shudders as the strings take it.
      const h = tear.home;
      const j = Math.sin(battle.time * 60);
      ctx.save();
      ctx.strokeStyle = COLORS.box;
      ctx.lineWidth = 3;
      ctx.strokeRect(h.x * S - 1.5 + j, h.y * S - 1.5, h.w * S + 3, h.h * S + 3);
      ctx.restore();
      return true;
    }
    if (tear.t < tear.open) {
      drawTorn(ctx, tear, 'border');
      return true;
    }
    // The whole stage is the box now: a thin frame round all of it, breathing.
    const b = battle.box;
    ctx.save();
    ctx.globalAlpha = 0.5 + 0.3 * Math.sin(battle.time * 3);
    ctx.strokeStyle = COLORS.box;
    ctx.lineWidth = 2;
    ctx.strokeRect(b.x * S - 1, b.y * S - 1, b.w * S + 2, b.h * S + 2);
    ctx.restore();
    return true;
  },

  buttons(battle, commands) {
    const state = battle.stageState;
    if (state.mode !== 'alive') return null;
    const t = battle.time;
    // Nobody on the strings once he's gone: they come to rest.
    const k = settle(battle);
    if (k <= 0) return null;
    return commands.map((command, i) => {
      const since = t - state.yank.at;
      // The yank: up hard, then a spring back down.
      const yank = state.yank.i === i && since < 0.9 ? state.yank.power * Math.exp(-since * 5) * Math.cos(since * 14) : 0;
      return {
        dx: (Math.sin(t * 1.7 + i * 1.3) * 1.5 + yank * 4) * k,
        dy: (Math.sin(t * 2.1 + i * 2.1) * 1.5 - Math.max(0, yank) * 16) * k,
        turn: (Math.sin(t * 1.3 + i) * 0.03 + yank * 0.16) * k,
        label: state.cue.i === i && t < state.cue.until && k === 1 ? CUE_WORDS[command.label] : undefined,
      };
    });
  },

  // The strings your buttons hang from, all going up to his hand. Only while
  // you're choosing (they'd cross the box in his turn).
  drawStrings(ctx, battle, commands, sway) {
    if (!sway || ['dodge', 'taunt', 'defeat'].includes(battle.phase) || battle.phased?.state !== 'active') return;
    const hand = { x: HAND.x * S, y: HAND.y * S };
    ctx.save();
    ctx.strokeStyle = 'rgba(236, 228, 210, 0.42)';
    ctx.lineWidth = 1;
    commands.forEach((command, i) => {
      const top = buttonTop(i);
      const x = top.x + (sway[i]?.dx ?? 0);
      const y = top.y + (sway[i]?.dy ?? 0);
      ctx.beginPath();
      ctx.moveTo(hand.x + (i - 2.5) * 3, hand.y);
      ctx.quadraticCurveTo((hand.x + x) / 2 + Math.sin(battle.time * 1.5 + i) * 6, (hand.y + y) / 2 + 20, x, y);
      ctx.stroke();
    });
    // The bar he works them with.
    ctx.fillStyle = '#8a5a30';
    ctx.fillRect(hand.x - 12, hand.y - 2, 24, 4);
    ctx.fillStyle = '#c8901a';
    ctx.fillRect(hand.x - 12, hand.y - 2, 2, 4);
    ctx.fillRect(hand.x + 10, hand.y - 2, 2, 4);
    ctx.restore();
  },
};
