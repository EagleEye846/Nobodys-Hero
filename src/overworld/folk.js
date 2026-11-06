import { TILE_SIZE as T } from '../config.js';

// Town folk going about their day. A prop with a `stroll` walks around the
// room by itself; everything else about it (talking to it, its shop, its
// glow) is the same as a prop that stands still.
//
//   stroll: {
//     path: [[x, y], [x, y], ...]   tiles to walk between, in order
//     mode: 'pingpong' | 'loop'     there and back (the default), or round and round
//     wander: [x1, y1, x2, y2]      instead of a path: stroll to random tiles in this box
//     speed: 16                     pixels a second
//     pause: [1.5, 4]               seconds they stand about at each stop
//     greet: true                   stop and turn to face you when you come close
//     scatter: true                 dart off somewhere else when you run past
//     hop: true                     hop along instead of walking (kids)
//     keepAnim: true                keep playing their animation while they walk
//     flip: false                   don't turn the picture round when they go left
//     ball: true                    a ball: rolls away when you walk into it, and comes back
//   }
//
// They never walk onto a door, a cutscene trigger, a wall or anything solid,
// and they never walk into you or your friend: they wait, and turn back if
// they are stuck. Everything freezes while a cutscene or a text box is up
// (the overworld only calls this while you are free to walk).
const rand = (a, b) => a + Math.random() * (b - a);
const BODY = 6; // half the width of someone's feet, in pixels
const GREET_DISTANCE = 30;
const SCATTER_DISTANCE = 46;

function bodiesOf(scene) {
  return [scene.player, ...(scene.others ?? []), ...(scene.followers ?? [])].filter((b) => b && !b.hidden && Number.isFinite(b.x));
}

// The box someone's feet take up with their tile's corner at (x, y).
function feet(prop, x, y) {
  return [x + 3, y + 5, x + prop.width - 3, y + T - 1];
}

function hitsBody(box, bodies, margin = 0) {
  return bodies.some((b) => box[0] < b.x + BODY + margin && box[2] > b.x - BODY - margin && box[1] < b.y + 2 + margin && box[3] > b.y - 7 - margin);
}

// Whether the prop could stand with its tile corner at (x, y).
function isFree(scene, prop, x, y, bodies, { ignoreBodies = false } = {}) {
  const { room } = scene;
  const box = feet(prop, x, y);
  for (let ty = Math.floor(box[1] / T); ty <= Math.floor(box[3] / T); ty++) {
    for (let tx = Math.floor(box[0] / T); tx <= Math.floor(box[2] / T); tx++) {
      if (room.isSolidTile(tx, ty) || room.raiseAt(tx, ty) > 0) return false;
      if (inZone(room.doors, tx, ty, 1) || inZone(scene.roomData.cutscenes, tx, ty, 0)) return false;
    }
  }
  if (room.props.some((o) => o !== prop && !o.hidden && !o.walkable && !o.isOpen && o.overlaps(box[0], box[1] - 3, box[2], box[3]))) return false;
  if (!ignoreBodies && hitsBody(box, bodies, 1)) return false;
  return true;
}

// Within `pad` tiles of any of these rectangles ({ x, y, w, h })?
function inZone(zones = [], tx, ty, pad = 0) {
  return zones.some((z) => tx >= z.x - pad && tx < z.x + (z.w ?? 1) + pad && ty >= z.y - pad && ty < z.y + (z.h ?? 1) + pad);
}

function nearestBody(prop, bodies) {
  const cx = prop.x + prop.width / 2;
  const cy = prop.y + T;
  let best = null;
  for (const b of bodies) {
    const d = Math.hypot(b.x - cx, b.y - cy);
    if (!best || d < best.d) best = { body: b, d, dx: b.x - cx, dy: b.y - cy };
  }
  return best;
}

const faceToward = (dx, dy) => (Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : dy < 0 ? 'up' : 'down');

// Moves toward a point one axis at a time (the longer way first). Returns
// whether it got anywhere; sets the facing.
function walkToward(scene, prop, w, tx, ty, dist, bodies) {
  let moved = false;
  const dx = tx - prop.x;
  const dy = ty - prop.y;
  const order = Math.abs(dx) >= Math.abs(dy) ? ['x', 'y'] : ['y', 'x'];
  for (const axis of order) {
    const gap = axis === 'x' ? dx : dy;
    if (Math.abs(gap) < 0.01) continue;
    const step = Math.sign(gap) * Math.min(Math.abs(gap), dist);
    const nx = axis === 'x' ? prop.x + step : prop.x;
    const ny = axis === 'y' ? prop.y + step : prop.y;
    if (!isFree(scene, prop, nx, ny, bodies)) continue;
    prop.x = nx;
    prop.y = ny;
    w.dir = axis === 'x' ? (step < 0 ? 'left' : 'right') : step < 0 ? 'up' : 'down';
    moved = true;
    break;
  }
  return moved;
}

function pickWanderTarget(scene, prop, cfg, bodies) {
  const [x1, y1, x2, y2] = cfg.wander;
  for (let tries = 0; tries < 8; tries++) {
    const tx = Math.round(rand(x1, x2));
    const ty = Math.round(rand(y1, y2));
    if (isFree(scene, prop, tx * T, ty * T, bodies, { ignoreBodies: true })) return { x: tx * T, y: ty * T };
  }
  return null;
}

function stroller(scene, prop, dt, bodies) {
  const cfg = prop.stroll;
  const w = prop.walk ??= {
    dir: 'down', moving: false, wait: rand(0.2, 2.5), stuck: 0, leg: 0, heading: 1, target: null, flee: 0, cool: 0,
    homeX: prop.x, homeY: prop.y,
  };
  const speed = cfg.speed ?? 16;
  const near = nearestBody(prop, bodies);
  w.moving = false;
  w.cool -= dt;

  // Someone running at them: off they go, with a "!".
  if (cfg.scatter && w.flee <= 0 && w.cool <= 0 && near && near.body === scene.player && scene.player.running && scene.player.moving && near.d < SCATTER_DISTANCE) {
    const spot = pickFleeTarget(scene, prop, cfg, bodies, near);
    if (spot) {
      w.flee = 3;
      w.target = spot;
      w.cool = 5;
      prop.emote = 0.9;
    }
  }
  if (prop.emote > 0) prop.emote = Math.max(0, prop.emote - dt);
  if (w.flee > 0) {
    w.flee -= dt;
    if (w.target && walkToward(scene, prop, w, w.target.x, w.target.y, speed * 2.6 * dt, bodies)) {
      w.moving = true;
      if (Math.abs(prop.x - w.target.x) < 0.5 && Math.abs(prop.y - w.target.y) < 0.5) { w.flee = 0; w.target = null; w.wait = rand(1.5, 3); }
    } else {
      w.flee = 0;
      w.target = null;
    }
    return;
  }

  // Someone close by: stop and look at them.
  if (cfg.greet && near && near.d < GREET_DISTANCE) {
    w.dir = faceToward(near.dx, near.dy);
    w.wait = Math.max(w.wait, 0.8);
    return;
  }
  if (w.wait > 0) {
    w.wait -= dt;
    return;
  }

  // Where to next.
  if (!w.target) {
    if (cfg.wander) {
      w.target = pickWanderTarget(scene, prop, cfg, bodies);
      if (!w.target) { w.wait = rand(1, 2); return; }
    } else if (cfg.path?.length > 1) {
      const next = cfg.path[w.leg];
      w.target = { x: next[0] * T, y: next[1] * T };
    } else {
      return;
    }
  }
  const moved = walkToward(scene, prop, w, w.target.x, w.target.y, speed * dt, bodies);
  if (moved) {
    w.moving = true;
    w.stuck = 0;
  } else {
    w.stuck += dt;
  }
  const arrived = Math.abs(prop.x - w.target.x) < 0.5 && Math.abs(prop.y - w.target.y) < 0.5;
  if (arrived || w.stuck > 2) {
    const blocked = !arrived;
    w.target = null;
    w.stuck = 0;
    const [lo, hi] = cfg.pause ?? [1.5, 4];
    w.wait = blocked ? rand(0.5, 1.2) : rand(lo, hi);
    if (cfg.path?.length > 1) {
      const last = cfg.path.length - 1;
      if (cfg.mode === 'loop') {
        w.leg = (w.leg + 1) % cfg.path.length;
      } else {
        // Blocked on the way: turn back and try the other end.
        if (blocked) w.heading = -w.heading;
        w.leg += w.heading;
        if (w.leg > last) { w.leg = last - 1; w.heading = -1; }
        if (w.leg < 0) { w.leg = 1; w.heading = 1; }
      }
    }
  }
}

// Somewhere a few tiles off, away from whoever is coming.
function pickFleeTarget(scene, prop, cfg, bodies, near) {
  const box = cfg.wander ?? [prop.x / T - 3, prop.y / T - 2, prop.x / T + 3, prop.y / T + 2];
  let best = null;
  for (let tries = 0; tries < 10; tries++) {
    const tx = Math.round(rand(box[0], box[2]));
    const ty = Math.round(rand(box[1], box[3]));
    if (!isFree(scene, prop, tx * T, ty * T, bodies, { ignoreBodies: true })) continue;
    const away = Math.hypot(tx * T + T / 2 - near.body.x, ty * T + T - near.body.y);
    if (!best || away > best.away) best = { x: tx * T, y: ty * T, away };
  }
  return best;
}

// A ball: walk into it and it rolls off, slowing as it goes; a while later
// it rolls itself home again, as if a kid had kicked it back.
function ball(scene, prop, dt, bodies) {
  const w = prop.walk ??= { dir: 'down', moving: false, vx: 0, vy: 0, rest: 0, homeX: prop.x, homeY: prop.y };
  w.dir = 'down';
  const player = scene.player;
  const cx = prop.x + T / 2;
  const cy = prop.y + T - 3;
  if (player && player.moving && Math.abs(player.x - cx) < 10 && Math.abs(player.y - 3 - cy) < 8) {
    const push = player.running ? 95 : 65;
    const ax = cx - player.x;
    const ay = cy - (player.y - 3);
    const len = Math.hypot(ax, ay) || 1;
    w.vx = (ax / len) * push;
    w.vy = (ay / len) * push * 0.7;
    w.rest = 0;
  }
  const rolling = Math.hypot(w.vx, w.vy) > 4;
  if (rolling) {
    for (const axis of ['x', 'y']) {
      const nx = prop.x + (axis === 'x' ? w.vx * dt : 0);
      const ny = prop.y + (axis === 'y' ? w.vy * dt : 0);
      if (isFree(scene, prop, nx, ny, bodies, { ignoreBodies: true })) { prop.x = nx; prop.y = ny; } else if (axis === 'x') w.vx *= -0.4; else w.vy *= -0.4;
    }
    const drag = Math.max(0, 1 - 2.4 * dt);
    w.vx *= drag;
    w.vy *= drag;
  } else {
    w.vx = 0;
    w.vy = 0;
    w.rest += dt;
    if (w.rest > 7 && (Math.abs(prop.x - w.homeX) > 1 || Math.abs(prop.y - w.homeY) > 1)) {
      // Rolled back by someone small.
      const dx = w.homeX - prop.x;
      const dy = w.homeY - prop.y;
      const len = Math.hypot(dx, dy) || 1;
      w.vx = (dx / len) * 22;
      w.vy = (dy / len) * 22;
      w.rest = 6.5;
      prop.x += w.vx * dt;
      prop.y += w.vy * dt;
      if (len < 2) { prop.x = w.homeX; prop.y = w.homeY; w.vx = 0; w.vy = 0; }
    }
  }
  w.moving = rolling;
  prop.animation = rolling ? 'bf_ball' : null;
  prop.speed = 0.12;
}

// Anyone standing on you (a cutscene walked you into them) steps aside.
function stepAside(scene, prop, bodies) {
  const box = feet(prop, prop.x, prop.y);
  if (!hitsBody(box, bodies, -1)) return;
  for (let r = 1; r <= 3; r++) {
    for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, 1], [1, -1], [-1, -1]]) {
      const nx = prop.x + dx * r * T;
      const ny = prop.y + dy * r * T;
      if (isFree(scene, prop, nx, ny, bodies)) { prop.x = nx; prop.y = ny; return; }
    }
  }
}

export function updateFolk(scene, dt) {
  const walkers = scene.room.props.filter((p) => p.stroll && !p.hidden);
  if (!walkers.length) return;
  const bodies = bodiesOf(scene);
  for (const prop of walkers) {
    if (prop.stroll.ball) ball(scene, prop, dt, bodies);
    else {
      stepAside(scene, prop, bodies);
      stroller(scene, prop, dt, bodies);
    }
  }
}
