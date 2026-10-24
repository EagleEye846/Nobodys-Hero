import { TILE_SIZE as T } from '../config.js';

// Plank bridges (`g` tiles) that give under you. Walk out onto one and it
// sags, deepest under your feet and not at all where it's tied off at either
// end, like a rope slung across a gap with a weight on it. Each step bounces
// it a little, and when you step off it springs back and wobbles still.
//
// A bridge that runs across the screen (left to right) dips down; on one
// that runs up and down you'd be looking straight along the dip, so it only
// darkens under the weight, and whoever's on it bobs down with it. The
// bridge's picture is the room's own (lights and all): each column of it is
// moved down by however far it's sagging there, so its boards bend in one
// clean curve, and what's just above it (the water, or the sky) fills in
// over it.

// The most a bridge sags, in pixels, and how long a bridge needs to be to
// sag that far (a short one barely gives).
const MAX_SAG = 3;
const FULL_SAG_SPAN = 4 * T;
// The spring: how stiff, how quickly it settles, and the kick of a step.
const STIFFNESS = 140;
const DAMPING = 7;
const STEP_KICK = 9;

export class Bridges {
  constructor(room) {
    this.room = room;
    this.runs = [];
    // The run each bridge tile belongs to, by "tx,ty".
    this.byTile = new Map();
    const seen = new Set();
    for (let ty = 0; ty < room.height; ty++) {
      for (let tx = 0; tx < room.width; tx++) {
        if (room.tileAt(tx, ty) !== 'g' || seen.has(`${tx},${ty}`)) continue;
        this.runs.push(this.collect(tx, ty, seen));
      }
    }
  }

  // Every bridge tile joined to (tx, ty), as one run.
  collect(tx, ty, seen) {
    const tiles = [];
    const todo = [[tx, ty]];
    seen.add(`${tx},${ty}`);
    while (todo.length) {
      const [x, y] = todo.pop();
      tiles.push([x, y]);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const key = `${x + dx},${y + dy}`;
        if (seen.has(key) || this.room.tileAt(x + dx, y + dy) !== 'g') continue;
        seen.add(key);
        todo.push([x + dx, y + dy]);
      }
    }
    const xs = tiles.map(([x]) => x);
    const ys = tiles.map(([, y]) => y);
    const run = {
      left: Math.min(...xs) * T,
      right: (Math.max(...xs) + 1) * T,
      top: Math.min(...ys) * T,
      bottom: (Math.max(...ys) + 1) * T,
      depth: 0,
      speed: 0,
      // Where the weight on it is (the middle of everyone on it).
      at: 0,
      load: 0,
    };
    // Which way it crosses: across the screen if what it spans (open sky,
    // water) is above and below it, up and down if that's either side of it.
    const w = run.right - run.left;
    const h = run.bottom - run.top;
    const gap = (x, y) => {
      const c = this.room.tileAt(x, y);
      return c === null || c === '_' || c === '~' || c === '$';
    };
    let overAndUnder = 0;
    let besides = 0;
    for (const [x, y] of tiles) {
      if (this.room.tileAt(x, y - 1) !== 'g' && gap(x, y - 1)) overAndUnder++;
      if (this.room.tileAt(x, y + 1) !== 'g' && gap(x, y + 1)) overAndUnder++;
      if (this.room.tileAt(x - 1, y) !== 'g' && gap(x - 1, y)) besides++;
      if (this.room.tileAt(x + 1, y) !== 'g' && gap(x + 1, y)) besides++;
    }
    run.across = overAndUnder > besides || (overAndUnder === besides && w >= h);
    run.most = MAX_SAG * Math.min(1, (run.across ? w : h) / FULL_SAG_SPAN);
    // Each column's own top and bottom (a bridge needn't be a rectangle).
    run.columns = new Map();
    for (const [x, y] of tiles) {
      const c = run.columns.get(x) ?? { top: Infinity, bottom: -Infinity };
      c.top = Math.min(c.top, y * T);
      c.bottom = Math.max(c.bottom, (y + 1) * T);
      run.columns.set(x, c);
    }
    for (const [x, y] of tiles) this.byTile.set(`${x},${y}`, run);
    // What shows above each column as it drops: the row just above it, where
    // that's drawn (water); where it's open sky (nothing drawn there, so the
    // view shows through), its own top board, stretched.
    run.fillFromAbove = new Map();
    if (this.room.background && run.top > 0) {
      const row = this.room.background.getContext('2d').getImageData(run.left, run.top - 1, run.right - run.left, 1).data;
      for (let x = run.left; x < run.right; x++) run.fillFromAbove.set(x, row[(x - run.left) * 4 + 3] === 255);
    }
    return run;
  }

  get any() {
    return this.runs.length > 0;
  }

  // The run under someone's feet, if they're standing on a bridge.
  runUnder(body) {
    if ((body.ground ?? 0) > 0 || (body.z ?? 0) > 0.5) return null;
    return this.byTile.get(`${Math.floor(body.x / T)},${Math.floor((body.y - 1) / T)}`) ?? null;
  }

  // A footstep on it: a little bounce.
  step(body, kick = 1) {
    const run = this.runUnder(body);
    if (run) run.speed += STEP_KICK * kick * (run.most / MAX_SAG);
    return run;
  }

  // Everyone on the bridges weighs them down; each run springs toward the
  // sag their weight gives it.
  update(dt, bodies) {
    for (const run of this.runs) {
      run.load = 0;
      let sum = 0;
      for (const body of bodies) {
        if (!body || body.hidden || this.runUnder(body) !== run) continue;
        run.load++;
        sum += run.across ? body.x : body.y;
      }
      // (Eased toward them, so it doesn't jump when someone steps on or off.)
      if (run.load) run.at = run.depth < 0.2 ? sum / run.load : run.at + (sum / run.load - run.at) * Math.min(1, dt * 12);
      const target = run.most * Math.min(1.4, run.load ? 0.75 + run.load * 0.25 : 0);
      run.speed += (target - run.depth) * STIFFNESS * dt;
      run.speed *= Math.exp(-DAMPING * dt);
      run.depth += run.speed * dt;
      if (!run.load && Math.abs(run.depth) < 0.05 && Math.abs(run.speed) < 0.1) {
        run.depth = 0;
        run.speed = 0;
      }
    }
  }

  // How far the bridge has sagged at `pos` along it (x across the screen, y
  // up and down; pixels, whole or not), under the weight at `run.at`: none
  // at its ends, the most right under the weight.
  sagAt(run, pos) {
    if (run.depth <= 0) return 0;
    const [from, to] = run.across ? [run.left, run.right] : [run.top, run.bottom];
    const at = Math.min(to - 1, Math.max(from + 1, run.at));
    const k = pos < at ? (pos - from) / (at - from) : (to - pos) / (to - at);
    return run.depth * Math.max(0, Math.min(1, k));
  }

  // How far down to draw someone standing on a bridge: they go down with it
  // (less, on one running up and down, which you see from end on).
  dropFor(body) {
    const run = this.runUnder(body);
    if (!run) return 0;
    if (!run.across) return Math.round(this.sagAt(run, body.y) * 0.5);
    const column = run.columns.get(Math.floor(body.x / T));
    const share = column ? (body.y - column.top) / (column.bottom - column.top) : 1;
    return Math.round(this.sagAt(run, body.x) * Math.max(0.3, share));
  }

  // The sagging bridges, over the room's picture (`background`). Across the
  // screen, each column stretched down by its sag, and a shade where it's
  // lowest; up and down, just the shade, deepest under the weight.
  draw(ctx, camera, background, screenWidth) {
    for (const run of this.runs) {
      if (run.depth < 0.35) continue;
      if (run.right < camera.x || run.left > camera.x + screenWidth) continue;
      if (!run.across) {
        for (let y = run.top; y < run.bottom; y++) {
          const shade = this.sagAt(run, y + 0.5) / MAX_SAG;
          if (shade < 0.08) continue;
          ctx.fillStyle = `rgba(10, 6, 20, ${(0.22 * shade).toFixed(3)})`;
          ctx.fillRect(run.left - camera.x, y - camera.y, run.right - run.left, 1);
        }
        continue;
      }
      for (let x = Math.max(run.left, camera.x); x < Math.min(run.right, camera.x + screenWidth); x++) {
        const sag = this.sagAt(run, x + 0.5);
        const dip = Math.round(sag);
        const column = run.columns.get(Math.floor(x / T));
        if (!column) continue;
        const h = column.bottom - column.top;
        if (dip > 0) {
          ctx.drawImage(background, x, column.top, 1, h, x - camera.x, column.top + dip - camera.y, 1, h);
          const above = run.fillFromAbove.get(x) ? column.top - 1 : column.top;
          ctx.drawImage(background, x, above, 1, 1, x - camera.x, column.top - camera.y, 1, dip);
        }
        if (sag / MAX_SAG > 0.08) {
          ctx.fillStyle = `rgba(10, 6, 20, ${(0.16 * sag / MAX_SAG).toFixed(3)})`;
          ctx.fillRect(x - camera.x, column.top + dip - camera.y, 1, h);
        }
      }
    }
  }
}
