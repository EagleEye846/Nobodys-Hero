import { Pix, flash, shift, crumble } from './ch5Kit.js';

// CAPTAIN TARRY, 56x68: master of the brig Fair Return, still giving orders a
// hundred years after she went down on the bar. A tall coat gone grey-green
// with damp, a tricorn with the cockade rotted off, a brass speaking-trumpet,
// an iron hook where his left hand was, boots that never quite reach the deck
// (they and the coat's tails dissolve into fog). His face is pale and tired and
// fades at the edges; he has not slept since the night the light went out
// ahead of him. He faces left (toward you).
//
// Three looks, one per phase (see src/data/enemies/captain_tarry.js):
//   ORDERS      upright, the trumpet to his mouth, cutlass sheathed
//   MUTINY      coat torn, hat tipped, the cutlass drawn and shaking in his fist
//   HEAVE-TO    hat in his hand against his chest, the trumpet hanging, leaning
//               as if the deck had tipped; his eyes soft at last
// Drawn from a pose (see ch5Kit.js): sway, lean (rows shear sideways), arm
// poses, eyes, fog phase.
export const CAPTAIN_TARRY_PALETTE = {
  k: '#101a1c',
  c: '#5a7a6c',
  C: '#86aa9a',
  d: '#33483f',
  D: '#223229',
  b: '#c8a040',
  B: '#80601c',
  f: '#c8d8d0',
  F: '#8ea49e',
  e: '#f4fff0',
  E: '#9ae0c8',
  h: '#26323a',
  H: '#45565f',
  g: '#a8bcb4',
  G: '#6c8680',
  s: '#c4d0d4',
  S: '#6c7c84',
  l: '#4c565c',
  w: '#f0f6f2',
  r: '#b49c68',
  R: '#7a6234',
  n: '#7a2a26',
};

function draw(pose = {}) {
  const {
    sway = 0, bob = 0, lean = 0, trumpet = 1, sword = 0, hat = 'on', eyes = 'glow', wave = 0,
    torn = false, hold = false, mouth = 'closed', shake = 0,
  } = pose;
  const p = new Pix(60, 70);
  const cx = 30 + sway;
  const top = 10 + bob;

  // Fog: the trail behind the coat's tails and the boots, streaming right.
  const fog = () => {
    for (let i = -10; i <= 12; i += 2) {
      const len = 12 + ((i * 5 + 40) % 7);
      for (let y = 0; y < len; y++) {
        const x = cx + i + Math.sin(wave + i * 0.6 + y * 0.4) * (0.8 + y * 0.22) + y * 0.18;
        const c = y > len - 4 ? 'g' : y > 5 ? 'G' : 'D';
        p.set(x, top + 46 + bob * 0 + y, c);
        if (y % 3 === 0) p.set(x + 1, top + 46 + y, 'G');
      }
    }
  };
  fog();

  // The coat: broad at the shoulders, long and ragged at the hem.
  p.poly([[cx - 9, top + 12], [cx + 9, top + 12], [cx + 12, top + 28], [cx + 11, top + 48], [cx - 11, top + 48], [cx - 12, top + 28]], 'k');
  p.poly([[cx - 8, top + 13], [cx + 8, top + 13], [cx + 11, top + 28], [cx + 10, top + 47], [cx - 10, top + 47], [cx - 11, top + 28]], 'c');
  p.poly([[cx + 2, top + 13], [cx + 8, top + 13], [cx + 11, top + 28], [cx + 10, top + 47], [cx + 3, top + 47]], 'd', ['c']);
  // Lapels and a column of brass buttons, a few missing.
  p.line(cx - 5, top + 13, cx - 1, top + 26, 'C');
  p.line(cx + 5, top + 13, cx + 1, top + 26, 'C');
  for (let i = 0; i < 6; i++) if (i !== 3) p.set(cx - 1, top + 16 + i * 4, 'b');
  // Epaulettes.
  p.rect(cx - 10, top + 12, 4, 2, 'b');
  p.rect(cx + 6, top + 12, 4, 2, 'b');
  p.set(cx - 10, top + 14, 'B');
  p.set(cx + 9, top + 14, 'B');
  // The belt, and the sheath for the cutlass.
  p.rect(cx - 11, top + 31, 22, 2, 'D');
  p.rect(cx - 1, top + 31, 3, 2, 'b');
  // Hem: ragged, with the damp showing.
  // The tatters drift: every strip of the hem and the coat's edges sways a little out of step with the next.
  for (let x = cx - 10; x <= cx + 10; x += 2) {
    const len = 3 + ((x * 7) % 3) + Math.round(Math.sin(wave + x * 0.9) * 1.6);
    // (Out of step with the length by a fixed phase, so a full turn of `wave` comes back to where it began.)
    const dx = Math.round(Math.sin(wave + 2 + x * 0.7) * 1.4);
    p.line(x, top + 47, x + dx, top + 48 + len, 'c');
    p.set(x + dx, top + 48 + len, 'g');
    if (len > 4) p.set(x + dx + 1, top + 48 + len - 1, 'G');
  }
  for (const side of [-1, 1]) {
    for (let y = 30; y < 46; y += 4) {
      const reach = 2 + Math.round(Math.sin(wave + y * 0.5 + side) * 1.5) + (y > 38 ? 1 : 0);
      p.line(cx + side * 11, top + y, cx + side * (11 + reach), top + y + 3, 'c');
      p.set(cx + side * (11 + reach), top + y + 3, 'g');
    }
  }
  if (torn) {
    p.poly([[cx + 4, top + 22], [cx + 9, top + 24], [cx + 6, top + 36], [cx + 2, top + 30]], 'D', ['c', 'd']);
    p.line(cx - 8, top + 36, cx - 5, top + 46, 'D');
    p.line(cx - 6, top + 40, cx - 3, top + 47, 'k');
  }
  // Breeches and boots, fading into the fog: they never touch the deck.
  p.rect(cx - 7, top + 48, 5, 6, 'd');
  p.rect(cx + 2, top + 48, 5, 6, 'd');
  p.rect(cx - 8, top + 54, 6, 4, 'h');
  p.rect(cx + 2, top + 54, 6, 4, 'h');
  p.rect(cx - 8, top + 55, 6, 1, 'H');
  p.rect(cx + 2, top + 55, 6, 1, 'H');
  for (let i = -8; i <= 7; i++) if (i % 2) p.set(cx + i, top + 58 + (i & 1), 'G');

  // The hook arm (his left, ours right): the sleeve, a cuff, an iron hook.
  const hookX = cx + 14 + (hold ? -6 : 0);
  const hookY = top + 30 + (hold ? -6 : 0);
  p.line(cx + 8, top + 14, hookX, hookY, 'k', 5);
  p.line(cx + 8, top + 14, hookX, hookY, 'c', 3);
  p.rect(hookX - 2, hookY - 1, 5, 3, 'b');
  p.line(hookX, hookY + 2, hookX, hookY + 6, 'l', 2);
  p.line(hookX, hookY + 6, hookX - 3, hookY + 8, 'l', 2);
  p.set(hookX - 3, hookY + 6, 'S');
  p.set(hookX - 3, hookY + 8, 's');

  // His spyglass: a brass telescope in three drawn-out sections, hung from the hook by its cord, a lens that catches the light.
  {
    const sx = hookX - 1;
    const sy = hookY + 8;
    p.line(sx, sy, sx + 5, sy + 8, 'k', 5);
    p.line(sx, sy, sx + 5, sy + 8, 'B', 3);
    p.line(sx + 5, sy + 8, sx + 10, sy + 16, 'k', 6);
    p.line(sx + 5, sy + 8, sx + 10, sy + 16, 'b', 4);
    p.line(sx + 4, sy + 7, sx + 7, sy + 12, 'r', 1);
    p.line(sx + 10, sy + 16, sx + 12, sy + 19, 'k', 7);
    p.line(sx + 10, sy + 16, sx + 12, sy + 19, 'B', 5);
    p.ellipse(sx + 13, sy + 20, 2.4, 2.4, 'k');
    p.ellipse(sx + 13, sy + 20, 1.6, 1.6, 'E');
    p.set(sx + 12, sy + 19, 'w');
    p.line(sx - 1, sy - 1, hookX - 3, hookY + 6, 'R', 1);
  }

  // The other arm: the trumpet to the mouth, or the cutlass, or the hat held.
  const hx0 = cx - 10;
  const hy0 = top + 14;
  if (sword) {
    // A cutlass held up (1) or swung out (2): his hand shakes, and `shake`
    // moves the blade's point a pixel (the arm and the rest of him stay put).
    const hx = cx - 17 - (sword === 2 ? 6 : 0);
    const hy = top + (sword === 2 ? 28 : 15);
    p.line(hx0, hy0, hx, hy, 'k', 5);
    p.line(hx0, hy0, hx, hy, 'c', 3);
    p.ellipse(hx, hy, 2.4, 2.4, 'k');
    p.ellipse(hx, hy, 1.6, 1.6, 'f');
    if (sword === 1) {
      p.line(hx, hy, hx - 3 + shake, hy - 17, 'S', 3);
      p.line(hx, hy, hx - 3 + shake, hy - 17, 's', 1);
      p.rect(hx - 3, hy - 1, 7, 2, 'b');
    } else {
      p.line(hx, hy, hx - 17, hy + 8 + shake, 'S', 3);
      p.line(hx, hy, hx - 17, hy + 8 + shake, 's', 1);
      p.rect(hx - 1, hy - 3, 2, 7, 'b');
    }
  } else if (hold) {
    // Hat to the chest.
    p.line(hx0, hy0, cx - 4, top + 24, 'k', 5);
    p.line(hx0, hy0, cx - 4, top + 24, 'c', 3);
    p.ellipse(cx - 4, top + 24, 2.4, 2.4, 'k');
    p.ellipse(cx - 4, top + 24, 1.6, 1.6, 'f');
    p.poly([[cx - 11, top + 24], [cx - 4, top + 20], [cx + 3, top + 24], [cx - 4, top + 27]], 'h');
    p.line(cx - 11, top + 24, cx - 4, top + 20, 'H');
    p.line(cx + 3, top + 24, cx - 4, top + 27, 'k');
  } else if (trumpet === 0) {
    // The trumpet hanging at his side by its cord.
    p.line(hx0, hy0, cx - 15, top + 30, 'k', 5);
    p.line(hx0, hy0, cx - 15, top + 30, 'c', 3);
    p.ellipse(cx - 15, top + 31, 2.2, 2.2, 'f');
    p.line(cx - 15, top + 32, cx - 15, top + 42, 'b', 3);
    p.poly([[cx - 18, top + 42], [cx - 12, top + 42], [cx - 15, top + 49]], 'b');
    p.set(cx - 14, top + 40, 'B');
  } else {
    // The speaking-trumpet raised: a brass cone pointing out and left.
    const tx = cx - 17;
    const ty = top + (trumpet === 2 ? 8 : 11);
    p.line(hx0, hy0, cx - 10, top + 12, 'k', 5);
    p.line(hx0, hy0, cx - 10, top + 12, 'c', 3);
    p.poly([[cx - 8, top + 8], [cx - 8, top + 14], [tx + 4, ty + 9], [tx - 2, ty - 3]], 'k');
    p.poly([[cx - 8, top + 9], [cx - 8, top + 13], [tx + 4, ty + 7], [tx - 1, ty - 1]], 'b');
    p.line(cx - 8, top + 9, tx, ty - 1, 'B');
    p.ellipse(tx - 1, ty + 3, 3, 6, 'k');
    p.ellipse(tx - 1, ty + 3, 2.2, 5, 'B');
    p.line(tx, ty - 1, tx, ty + 6, 'b');
    if (mouth === 'shout') for (const k of [0, 1, 2]) p.set(tx - 5 - k * 3, ty + 3 + (k % 2 ? 2 : -2), 'E');
  }

  // The head: long, grey-pale, tired, the edges soft.
  const hy = top + 6;
  const hxc = cx - 1;
  p.ellipse(hxc, hy, 7.5, 7, 'k');
  p.ellipse(hxc, hy, 6.5, 6, 'f');
  p.ellipse(hxc + 1, hy + 2, 5, 4, 'F', ['f']);
  // Whiskers: a grey chin beard, long and thin, drifting.
  for (let i = -3; i <= 3; i++) {
    const len = 4 + (3 - Math.abs(i));
    for (let y = 0; y < len; y++) p.set(hxc + i + Math.sin(wave + y * 0.5 + i) * 0.6, hy + 5 + y, y % 2 ? 'g' : 'w');
  }
  // Brows and eyes.
  // Brows drawn up in the middle, and the corners of the mouth turned down: the face of someone who has been sorry for a hundred years.
  p.line(hxc - 5, hy - 2, hxc - 2, hy - 4, 'D');
  p.line(hxc + 4, hy - 2, hxc + 1, hy - 4, 'D');
  for (const ex of [hxc - 5, hxc + 1]) {
    if (eyes === 'closed') p.rect(ex, hy - 1, 4, 1, 'k');
    else if (eyes === 'soft') { p.rect(ex, hy - 1, 4, 3, 'e'); p.set(ex + 1, hy, 'E'); p.set(ex + 2, hy + 1, 'E'); p.set(ex, hy + 2, 'E'); }
    else if (eyes === 'dead') { p.set(ex, hy - 1, 'E'); p.set(ex + 3, hy + 1, 'E'); p.set(ex + 3, hy - 1, 'E'); p.set(ex, hy + 1, 'E'); }
    else {
      p.rect(ex, hy - 1, 4, 3, 'e');
      p.rect(ex + 1, hy, 2, 2, 'E');
      if (eyes === 'flare') { p.rect(ex - 1, hy - 2, 6, 5, 'E', ['.', 'f', 'F']); p.rect(ex, hy - 1, 4, 3, 'e'); }
    }
  }
  p.rect(hxc - 1, hy + 3, 3, 1, mouth === 'shout' ? 'n' : 'D');
  if (mouth !== 'shout') { p.set(hxc - 2, hy + 4, 'D'); p.set(hxc + 2, hy + 4, 'D'); }
  // Tears, running down both cheeks, and a catch of light in each.
  if (eyes !== 'closed' && eyes !== 'flare') {
    for (const ex of [hxc - 4, hxc + 3]) {
      p.set(ex, hy + 2, 'E');
      p.set(ex, hy + 4 + (eyes === 'soft' ? 1 : 0), 'w');
      if (eyes === 'soft') { p.set(ex, hy + 3, 'E'); p.set(ex, hy + 6, 'E'); }
    }
  }
  if (mouth === 'shout') p.rect(hxc - 1, hy + 3, 3, 2, 'n');
  // A grey hollow under the cheekbone, and the edge of the face going to mist.
  p.set(hxc - 6, hy + 1, 'G');
  p.set(hxc + 6, hy + 2, 'G');

  // The tricorn: three points, the cockade rotted off, a gold edge.
  if (hat !== 'off') {
    const tilt = hat === 'tipped' ? 3 : 0;
    const hyy = hy - 6;
    p.poly([[hxc - 11, hyy + 3 + tilt], [hxc - 4, hyy - 5], [hxc + 4, hyy - 5 - tilt], [hxc + 11, hyy + 3 - tilt], [hxc, hyy + 6]], 'k');
    p.poly([[hxc - 10, hyy + 3 + tilt], [hxc - 4, hyy - 4], [hxc + 4, hyy - 4 - tilt], [hxc + 10, hyy + 3 - tilt], [hxc, hyy + 5]], 'h');
    p.line(hxc - 10, hyy + 3 + tilt, hxc, hyy + 5, 'b');
    p.line(hxc, hyy + 5, hxc + 10, hyy + 3 - tilt, 'B');
    p.line(hxc - 4, hyy - 4, hxc + 4, hyy - 4 - tilt, 'H');
    p.set(hxc - 9, hyy + 2 + tilt, 'b');
    p.set(hxc - 8, hyy + tilt, 'R');
  } else {
    // Bare-headed: thin grey hair lifting as if in water.
    for (let i = -5; i <= 5; i += 2) {
      for (let y = 0; y < 4; y++) p.set(hxc + i + Math.sin(wave + i + y) * 0.7, hy - 6 - y, y % 2 ? 'g' : 'w');
    }
  }

  p.outline('k');
  // A ghost's glow: a dithered halo of cold light round the whole figure (the fog's own light, not the cabin's).
  {
    const near = (x, y, r) => { for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i++) if (p.get(x + i, y + j) !== '.' && Math.abs(i) + Math.abs(j) <= r + 1) return true; return false; };
    const halo = [];
    for (let y = 0; y < p.h; y++) for (let x = 0; x < p.w; x++) {
      if (p.get(x, y) !== '.') continue;
      if (near(x, y, 1) && (x + y) % 2 === 0) halo.push([x, y, 'E']);
      else if (near(x, y, 3) && x % 2 === 0 && y % 2 === 0 && !near(x, y, 1)) halo.push([x, y, 'G']);
    }
    for (const [x, y, c] of halo) p.set(x, y, c);
  }
  let rows = p.rows();
  if (lean) rows = rows.map((row, y) => {
    const dx = Math.round(lean * ((y - 34) / 34));
    return dx === 0 ? row : shift([row], dx, 0)[0];
  });
  return rows;
}


// How he moves: like a ghost, never like a puppet. His body holds still; only
// the coat's tatters, his beard and the fog drift (`wave`, a full turn of it a
// loop, so the loop has no seam), he floats a single pixel up and back down
// over a long slow breath (`bob`), and he blinks seldom. The loops run at 8
// fps with `holds` doing the slowness; the one-off clips (windup, hurt, intro,
// death, spared) repeat a frame to hold it, since those don't read `holds`.
const TURN = Math.PI * 2;
// The float: up a pixel for the middle half of the cycle, down for the rest.
const float = (i, n) => (i >= n / 4 && i < (3 * n) / 4 ? -1 : 0);
// A frame `times` times over, so a one-off clip lingers on it.
const held = (frame, times) => Array(times).fill(frame);
// A drifting loop: `n` frames of `pose`, the fog turning `turns` times, and
// `blink` (the frame index, the pose it swaps in and how long it's held) once.
function drift(pose, { n, turns = 1, hold = 2, blink = null, each = () => ({}) }) {
  const frames = [];
  const holds = [];
  for (let i = 0; i < n; i++) {
    const at = { ...pose, wave: (TURN * turns * i) / n, bob: float(i, n), ...each(i) };
    frames.push(draw(at));
    holds.push(hold);
    if (blink && i === blink.at) {
      frames.push(draw({ ...at, ...blink.pose }));
      holds.push(blink.hold);
    }
  }
  return { fps: 8, frames, holds };
}

// ORDERS: upright, the trumpet to his mouth and staying there. The fog and
// tatters drift on a 3 s turn, he floats on a 6 s breath, and blinks once.
const ORDERS_POSE = { trumpet: 1 };
const ORDERS_IDLE = drift(ORDERS_POSE, { n: 24, turns: 2, hold: 2, blink: { at: 17, pose: { eyes: 'closed' }, hold: 1 } });
export const CAPTAIN_TARRY_SPRITE = ORDERS_IDLE.frames[0];

// A windup is a gather, then the order: he draws himself up (rises a pixel,
// settles back a pixel), lifts the trumpet with a breath, holds, and shouts.
function gatherAndShout(pose, back, fwd = 0, gatherPose = pose) {
  const gather = draw({ ...gatherPose, bob: -1, lean: back });
  const lift = draw({ ...pose, trumpet: 2, eyes: pose.eyes ?? 'flare', bob: -1, lean: back });
  const shout = (wave) => draw({ ...pose, trumpet: 2, mouth: 'shout', eyes: pose.eyes ?? 'flare', lean: fwd, wave });
  return { fps: 8, frames: [...held(gather, 2), ...held(lift, 2), ...held(shout(0.6), 2), shout(1.2), shout(1.8)] };
}
// Hurt: a short recoil of a pixel, eyes shut, and back.
function recoil(pose, back = 1) {
  const shut = { ...pose, eyes: 'closed' };
  return { fps: 10, frames: [flash(shift(draw(shut), back, 0)), shift(draw(shut), back, 0), shift(draw(shut), back, 0), draw(pose)] };
}

// Beaten: bare-headed, hat to his chest, still leaning as in HEAVE-TO, he
// sinks a little and goes to mist from the top down.
const GONE = { eyes: 'soft', hat: 'off', hold: true, trumpet: 0, lean: 4 };
const DEATH = {
  fps: 4,
  frames: [
    draw({ ...GONE, wave: 0.5 }),
    draw({ ...GONE, wave: 1, bob: 1 }),
    crumble(draw({ ...GONE, wave: 1.5, bob: 1 }), 0.2, true),
    crumble(draw({ ...GONE, eyes: 'closed', wave: 2, bob: 2 }), 0.4, true),
    crumble(draw({ ...GONE, eyes: 'closed', wave: 2.5, bob: 2 }), 0.6, true),
    crumble(draw({ ...GONE, eyes: 'closed', wave: 3, bob: 3 }), 0.8, true),
    crumble(draw({ ...GONE, eyes: 'closed', wave: 3.5, bob: 3 }), 1, true),
  ],
};
// Spared: upright, at rest, a breath, and his eyes close.
const REST = { eyes: 'soft', hat: 'off', hold: true, trumpet: 0 };
const SPARED = {
  fps: 3,
  frames: [
    ...held(draw({ ...REST, wave: 0 }), 2),
    ...held(draw({ ...REST, wave: 1, bob: -1 }), 2),
    ...held(draw({ ...REST, eyes: 'closed', wave: 2 }), 5),
  ],
};

export const CAPTAIN_TARRY_ANIM = {
  chips: ['#5a7a6c', '#86aa9a', '#c8a040', '#a8bcb4'],
  idle: ORDERS_IDLE,
  windup: gatherAndShout(ORDERS_POSE, -1),
  hurt: recoil(ORDERS_POSE),
  death: DEATH,
  spared: SPARED,
};

// MUTINY: his crew has stopped answering, and he can't understand why. Coat
// torn, hat tipped, eyes flaring, the cutlass up. He holds as still as ever:
// the fear is all in the blade, its point trembling a pixel.
const MUTINY_POSE = { sword: 1, torn: true, hat: 'tipped', eyes: 'flare' };
const TREMBLE = [0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1];
const tremble = (i) => ({ shake: TREMBLE[i % TREMBLE.length] });
const MUTINY_IDLE = drift(MUTINY_POSE, { n: 24, turns: 1, hold: 1, each: tremble });
export const CAPTAIN_TARRY_MUTINY_SPRITE = MUTINY_IDLE.frames[0];
export const CAPTAIN_TARRY_MUTINY_ANIM = {
  chips: CAPTAIN_TARRY_ANIM.chips,
  idle: MUTINY_IDLE,
  // He draws back, the blade trembling, then swings it out and holds.
  windup: {
    fps: 8,
    frames: [
      draw({ ...MUTINY_POSE, bob: -1, lean: -1, shake: 1 }),
      draw({ ...MUTINY_POSE, bob: -1, lean: -1 }),
      draw({ ...MUTINY_POSE, bob: -1, lean: -1, shake: 1 }),
      draw({ ...MUTINY_POSE, bob: -1, lean: -1 }),
      ...held(draw({ ...MUTINY_POSE, sword: 2, lean: 1, wave: 0.6 }), 2),
      draw({ ...MUTINY_POSE, sword: 2, lean: 1, wave: 1.2, shake: 1 }),
      draw({ ...MUTINY_POSE, sword: 2, lean: 1, wave: 1.8 }),
    ],
  },
  hurt: recoil(MUTINY_POSE),
  death: DEATH,
  spared: SPARED,
  // Played as he turns to the mutiny: the light flares, the cutlass is in his
  // hand, and its point starts to shake.
  intro: {
    fps: 8,
    frames: [
      flash(draw(MUTINY_POSE)),
      flash(draw(MUTINY_POSE)),
      ...held(draw({ ...MUTINY_POSE, wave: 0.3 }), 3),
      ...[1, 0, 1, 1, 0, 1, 0].map((shake, i) => draw({ ...MUTINY_POSE, wave: 0.4 + i * 0.1, shake })),
    ],
  },
};

// HEAVE-TO: the hat comes off. He leans as though the deck were tipping, and
// stays leant: the slowest loop of the three (a 6 s drift), and now and then
// his eyes close for a long tired moment.
const HEAVE_POSE = { hat: 'off', hold: true, trumpet: 0, eyes: 'soft', lean: 4 };
const HEAVE_IDLE = drift(HEAVE_POSE, { n: 16, turns: 1, hold: 3, blink: { at: 11, pose: { eyes: 'closed' }, hold: 6 } });
export const CAPTAIN_TARRY_HEAVE_SPRITE = HEAVE_IDLE.frames[0];
export const CAPTAIN_TARRY_HEAVE_ANIM = {
  chips: CAPTAIN_TARRY_ANIM.chips,
  idle: HEAVE_IDLE,
  windup: gatherAndShout({ hat: 'off', trumpet: 0, eyes: 'soft' }, 3, 4, HEAVE_POSE),
  hurt: recoil(HEAVE_POSE),
  death: DEATH,
  spared: SPARED,
  // The deck tips: he lets the hat come off and leans over, a pixel at a time.
  intro: {
    fps: 6,
    frames: [
      flash(draw({ ...HEAVE_POSE, lean: 0 })),
      draw({ ...HEAVE_POSE, lean: 0 }),
      draw({ ...HEAVE_POSE, lean: 1, wave: 0.2 }),
      draw({ ...HEAVE_POSE, lean: 2, wave: 0.4 }),
      draw({ ...HEAVE_POSE, lean: 3, wave: 0.6 }),
      ...held(draw({ ...HEAVE_POSE, lean: 4, wave: 0.8 }), 3),
    ],
  },
};

// Beaten (or spared) he doesn't vanish: he is there, bare-headed, eyes shut,
// hat to his chest, and fading. (The room's own scene finishes it.)
export const CAPTAIN_TARRY_DEATH_LAST = crumble(draw({ ...GONE, eyes: 'closed', wave: 3.5, bob: 3 }), 0.8, true);
