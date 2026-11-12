import { Line } from '../projectiles.js';
import { SOUL_MODES } from '../soulModes.js';
import { rectDist, warnAlpha } from './rumboldBullets.js';
import { C, LIGHT, fill, drawString } from './rumboldAliveBullets.js';
import { Sandbag, GrabHand } from './rumboldFinaleBullets.js';

// THE STAIR: the middle of KING PEPTUP's finale (rumboldAliveTear in
// rumboldAlive.js). The fly tower narrows to a stairwell, and there it is:
// the great stair he tells everyone he walked down with the Hero, shoulder
// to shoulder. It's painted. Every step hangs on strings.
//
// Your shadow turns HEAVY and you climb it, jumping from step to step; and
// it sinks under you all the while, down into the Deep, the dark that came up
// from the bottom in his story (touching it hurts, and throws you back up).
// Keep climbing, and on the way:
//
//   6s-15s    his strings drop down the stairwell, straight down
//   from 10s  some steps are only card: they sag, and drop when stood on
//   11s-15s   his hand reaches up out of the Deep for you
//   15s-18s   sandbags, dropped down the well at you
//   18s-21s   strings slice across it, slantwise (jump them, or drop)
//   at   21s  the last step: a landing, and a door, at the top of the stair
// (One or two of these at a time, never more: climbing is hard enough.)
//
// At the top the stair stops, and the door opens on nothing at all. Then the
// door comes down on you, flat, and another, and another: stand in the
// doorway cut through each one.
//
// All in stage pixels, like the rest of his bullets. `t` is seconds since
// your shadow turned heavy.

// The stairwell: the middle of the stage, top to bottom.
export const COLUMN = { x: 98, y: 3, w: 124, h: 158 };
const STEP_W = 34;
// From one step to the next, up: a full jump (about 32) clears it, a hop
// doesn't.
const GAP = 27;
// Where the steps can be across the well: a switchback, never more than a
// jump's reach from one to the next.
const LANES = [4, 30, 56, 86].map((dx) => COLUMN.x + dx);
// The Deep, from here down (and a little higher as it reaches).
const DEEP_TOP = COLUMN.y + COLUMN.h - 15;
// When the landing comes and the stair stops, and when the door opens; and
// when it's all over.
const LANDING_AT = 21;
const LANDING_Y = 120;
export const DOOR_AT = 25.6;
const DOORS = [{ at: 26.3, fall: 0.62 }, { at: 27.5, fall: 0.5 }, { at: 28.5, fall: 0.42 }];
export const STAIR_SECONDS = 29.6;
// How fast the stair sinks (pixels a second): it gets steeper as you go.
const sinking = (t) => (t < 1.5 ? 0 : Math.min(31, 17 + (t - 1.5) * 0.72));
// The Deep doesn't hit as hard as he does: it's there to push you on.
const DEEP_DAMAGE = 36;
// How hard it throws you back up.
const THROWN_UP = 175;

export const HEAVY_HINT = 'The STAIR! Your SHADOW turns HEAVY.\nUP to jump. Climb, and keep out of the Deep.';

// The painted stairwell behind it all: a painted night sky, the stair going
// up and up in the distance, the wings at the sides, and the steps
// themselves (the act's list), each on its two strings. And the door at the
// top, once it's there.
export class StairWell {
  constructor({ act }) {
    this.act = act;
    this.age = 0;
    this.done = false;
    this.dmg = null;
    this.grazed = false;
  }

  update(dt) { this.age += dt; }
  isGone() { return this.done; }
  edgeDistance() { return Infinity; }

  draw(ctx) {
    const { x, y, w, h } = COLUMN;
    const scroll = this.act.scroll;
    ctx.save();
    ctx.globalAlpha = Math.min(1, this.age / 0.6) * (this.act.fade ?? 1);
    // The painted sky, deep blue, its stars scrolling slow.
    fill(ctx, '#121830', x, y, w, h);
    for (let n = 0; n < 26; n++) {
      const sy = (((n * 37) % 160) + scroll * 0.25) % 160;
      const sx = x + ((n * 53) % (w - 4)) + 2;
      fill(ctx, n % 3 ? '#4a5070' : '#c8b060', sx, y + sy, n % 5 ? 1 : 2, n % 5 ? 1 : 2);
    }
    // The stair in the distance, painted: going up, and up, and up, in
    // switchbacks, never ending.
    for (let k = 0; k < 14; k++) {
      const sy = y + ((k * 13 + scroll * 0.5) % 182) - 12;
      const run = (Math.floor((k * 13 + scroll * 0.5) / 182) + k) % 2;
      const sx = x + 14 + (run ? k % 7 : 6 - (k % 7)) * 13;
      fill(ctx, '#1c2440', sx, sy, 18, 4);
      fill(ctx, '#283458', sx, sy, 18, 1);
    }
    // The wings: painted wood at each side, crossbeams going by.
    for (const side of [x, x + w - 6]) {
      fill(ctx, '#2a1e16', side, y, 6, h);
      fill(ctx, '#3a2a1c', side + (side === x ? 4 : 0), y, 2, h);
      for (let k = 0; k < 7; k++) fill(ctx, '#4a3626', side, y + ((k * 30 + scroll) % 210) - 20, 6, 3);
    }
    // The door at the top, on the landing.
    const door = this.act.door;
    if (door) this.drawDoor(ctx, door);
    // The steps, on their strings.
    for (const step of this.act.steps) this.drawStep(ctx, step);
    ctx.restore();
  }

  drawStep(ctx, step) {
    const j = step.shake > 0 ? Math.round(Math.sin(this.age * 80) * 1.2) : 0;
    const sx = step.x + j;
    const sy = step.y;
    // Its strings, up into the flies (cut, once it's dropping): faint, so
    // they're never taken for his.
    if (!step.falling) {
      drawString(ctx, sx + 3, 0, sx + 3, sy, 0, '#4a4a5c');
      drawString(ctx, sx + step.w - 3, 0, sx + step.w - 3, sy, 0, '#4a4a5c');
    }
    if (step.kind === 'crumble') {
      // Painted card: pale, cracked, sagging when stood on.
      const sag = step.stood > 0 ? 1 : 0;
      fill(ctx, C.k, sx - 1, sy - 1, step.w + 2, 6);
      fill(ctx, '#b8a888', sx, sy, step.w, 2);
      fill(ctx, '#8a7a60', sx, sy + 2, step.w, 2 + sag);
      fill(ctx, C.k, sx + step.w * 0.3, sy, 1, 3);
      fill(ctx, C.k, sx + step.w * 0.7, sy + 1, 1, 3);
      return;
    }
    // A gilded tread: gold on top, the riser under it, a strip of carpet.
    fill(ctx, C.k, sx - 1, sy - 1, step.w + 2, 7);
    fill(ctx, '#f0c050', sx, sy, step.w, 1);
    fill(ctx, '#c8901a', sx, sy + 1, step.w, 2);
    fill(ctx, '#7a5418', sx, sy + 3, step.w, 2);
    const carpet = Math.min(step.w - 8, 18);
    fill(ctx, '#8a1c24', sx + (step.w - carpet) / 2, sy, carpet, 2);
    fill(ctx, '#b02a30', sx + (step.w - carpet) / 2, sy, carpet, 1);
  }

  drawDoor(ctx, door) {
    const dw = 26;
    const dh = 36;
    const dx = door.x - dw / 2;
    const dy = door.y - dh;
    // The frame: painted stone, an arch on top.
    fill(ctx, C.k, dx - 4, dy - 4, dw + 8, dh + 4);
    fill(ctx, '#8a7a9a', dx - 3, dy - 3, dw + 6, dh + 3);
    fill(ctx, '#c8b8d8', dx - 3, dy - 3, dw + 6, 1);
    if (!door.open) {
      // Shut: a painted door, with a gold knob. Light round its edges.
      fill(ctx, '#6a4a2c', dx, dy, dw, dh);
      fill(ctx, '#5a3c22', dx + 3, dy + 3, dw - 6, dh / 2 - 4);
      fill(ctx, '#5a3c22', dx + 3, dy + dh / 2 + 1, dw - 6, dh / 2 - 4);
      fill(ctx, '#f0c050', dx + dw - 6, dy + dh / 2, 2, 2);
      ctx.globalCompositeOperation = 'lighter';
      fill(ctx, `rgba(${LIGHT.core}, 0.5)`, dx - 1, dy, 1, dh);
      fill(ctx, `rgba(${LIGHT.core}, 0.5)`, dx + dw, dy, 1, dh);
      ctx.globalCompositeOperation = 'source-over';
      return;
    }
    // Open: nothing behind it. Not even dark: bare grey card, and the back
    // of the painted wall.
    fill(ctx, '#3a3634', dx, dy, dw, dh);
    for (let k = 0; k < dh; k += 6) fill(ctx, '#2c2826', dx, dy + k, dw, 1);
    fill(ctx, '#4a4440', dx + 4, dy + 8, 1, dh - 12);
    // The door itself, swung back flat against the wall: you can see it's
    // only painted on one side.
    fill(ctx, C.k, dx + dw + 2, dy, 4, dh);
    fill(ctx, '#9a9080', dx + dw + 3, dy + 1, 2, dh - 2);
  }
}

// The Deep, rising at the bottom of the well: black, with a cold purple edge
// and long fingers of dark reaching up. Touch it and it hurts.
export class TheDeep {
  constructor() {
    this.age = 0;
    this.done = false;
    this.dmg = DEEP_DAMAGE;
    this.grazed = false;
  }

  update(dt) { this.age += dt; }
  isGone() { return this.done; }

  top(px) { return DEEP_TOP + Math.sin(px * 0.11 + this.age * 2.6) * 2; }

  edgeDistance(px, py) {
    if (this.done) return Infinity;
    return this.top(px) - py;
  }

  draw(ctx) {
    const { x, w } = COLUMN;
    const bottom = COLUMN.y + COLUMN.h + 2;
    ctx.save();
    for (let px = x; px < x + w; px += 2) {
      const top = Math.round(this.top(px));
      fill(ctx, '#3a1440', px, top - 1, 2, 1);
      fill(ctx, '#05030a', px, top, 2, bottom - top);
    }
    // Fingers of it, reaching up and falling back.
    for (let k = 0; k < 6; k++) {
      const fx = x + 10 + k * 21 + Math.sin(this.age * 0.9 + k) * 4;
      const reach = 4 + (Math.sin(this.age * 2.1 + k * 1.7) * 0.5 + 0.5) * 9;
      const top = this.top(fx);
      fill(ctx, '#05030a', fx, top - reach, 2, reach);
      fill(ctx, '#05030a', fx - 1, top - reach * 0.5, 4, reach * 0.5);
      fill(ctx, '#3a1440', fx, top - reach - 1, 2, 1);
    }
    ctx.restore();
  }
}

// The door at the top of the stair, come down flat on you: a painted wall
// as wide as the well, a doorway cut through it (from `holeX`, `holeW`
// wide). First the doorway's chalked on the landing; then it falls, faster
// each time, and lies there a moment before it goes to pieces.
export class FallingDoor {
  constructor({ holeX, holeW = 26, landY, warn = 0.75, fall = 0.6 }) {
    Object.assign(this, { holeX, holeW, landY, warn, fall });
    this.thick = 16;
    this.y = COLUMN.y - this.thick - 4;
    this.age = 0;
    this.dmg = null;
    this.grazed = false;
  }

  get falling() { return this.age >= this.warn; }

  update(dt) {
    this.age += dt;
    if (!this.falling) return;
    const k = Math.min(1, (this.age - this.warn) / this.fall);
    const from = COLUMN.y - this.thick - 4;
    this.y = from + (this.landY - this.thick - from) * k * k;
  }

  isGone() { return this.age > this.warn + this.fall + 0.4; }

  edgeDistance(px, py) {
    if (!this.falling) return Infinity;
    const { x, w } = COLUMN;
    return Math.min(
      rectDist(px, py, x, this.y, this.holeX - x, this.thick),
      rectDist(px, py, this.holeX + this.holeW, this.y, x + w - this.holeX - this.holeW, this.thick),
    );
  }

  draw(ctx) {
    const { x, w } = COLUMN;
    ctx.save();
    if (!this.falling) {
      // The doorway, chalked on the landing: stand in it.
      ctx.globalAlpha = warnAlpha(this.age);
      ctx.strokeStyle = '#f4ecdc';
      ctx.setLineDash([3, 2]);
      ctx.lineWidth = 1;
      ctx.strokeRect(Math.round(this.holeX) + 0.5, this.landY - 22.5, this.holeW - 1, 22);
      ctx.setLineDash([]);
      ctx.restore();
      return;
    }
    // Lying there, it starts to come apart.
    const settled = this.age > this.warn + this.fall;
    if (settled) ctx.globalAlpha = Math.max(0, 1 - (this.age - this.warn - this.fall) / 0.4);
    const y = Math.round(this.y);
    for (const [x0, x1] of [[x, this.holeX], [this.holeX + this.holeW, x + w]]) {
      if (x1 <= x0) continue;
      fill(ctx, C.k, x0, y, x1 - x0, this.thick);
      fill(ctx, '#8a7a9a', x0, y + 1, x1 - x0, this.thick - 2);
      // Painted stonework.
      for (let bx = x0 + 2; bx < x1 - 4; bx += 12) fill(ctx, '#6a5a7a', bx, y + 3 + ((bx / 12) % 2) * 5, 9, 1);
      fill(ctx, '#c8b8d8', x0, y + 1, x1 - x0, 1);
    }
    // The doorway's edges: card, roughly cut.
    fill(ctx, '#e8dcc4', this.holeX - 1, y, 1, this.thick);
    fill(ctx, '#e8dcc4', this.holeX + this.holeW, y, 1, this.thick);
    ctx.restore();
  }
}

// The act itself. `push(bullet, dmg?)` adds a bullet (with his finale's
// damage unless told otherwise).
export function stairClimb({ rand, push, sfx }) {
  const act = { steps: [], scroll: 0, door: null, fade: 1 };
  let well = null;
  let deep = null;
  let lane = 0;
  let dir = 1;
  let spawned = 0;
  let lastCrumble = -9;
  let landing = null;
  let nextString = 6;
  let nextHand = 11;
  let nextBag = 15;
  let nextSlice = 18.3;
  let opened = false;
  let door = 0;
  let lastHole = null;
  const newStep = (y) => {
    // Up the switchback: the next lane along, turning at the ends, or
    // straight up now and then.
    if (Math.random() < 0.8) {
      if (lane + dir < 0 || lane + dir >= LANES.length) dir = -dir;
      lane += dir;
    }
    spawned++;
    const crumble = act.t > 10 && spawned - lastCrumble >= 3 && Math.random() < 0.6;
    if (crumble) lastCrumble = spawned;
    act.steps.push({ x: LANES[lane] + rand(-3, 3), y, w: STEP_W, kind: crumble ? 'crumble' : 'step', shake: 0, stood: 0, falling: false, vy: 0 });
  };

  return {
    act,
    // Into the well: the steps already there, and your shadow made heavy.
    start(bullets, box, soul) {
      act.t = 0;
      // A wide first step to land on, and the stair going up from it.
      act.steps.push({ x: COLUMN.x, y: 128, w: COLUMN.w, kind: 'step', shake: 0, stood: 0, falling: false, vy: 0 });
      lane = 1;
      for (let y = 128 - GAP; y > COLUMN.y - GAP; y -= GAP) newStep(y);
      well = new StairWell({ act });
      deep = new TheDeep();
      bullets.unshift(well, deep);
      box.platforms = act.steps;
      soul.mode = SOUL_MODES.heavy;
      soul.modeName = 'heavy';
      soul.modeFlash = 0.4;
      soul.vy = 0;
      soul.platform = null;
      box.hint = HEAVY_HINT;
    },

    update(t, dt, bullets, box, soul) {
      act.t = t;
      if (t > 3.6) delete box.hint;
      // The stair sinks (or, at the top, stands still).
      let speed = sinking(t);
      if (landing && landing.y >= LANDING_Y) {
        speed = 0;
        landing.y = LANDING_Y;
      }
      act.scroll += speed * dt;
      for (const step of act.steps) {
        if (step.falling) {
          step.vy += 320 * dt;
          step.y += step.vy * dt;
          continue;
        }
        step.y += speed * dt;
        // Card steps: stood on, they sag, shake, and drop.
        if (step.kind === 'crumble' && soul.platform === step) {
          step.stood += dt;
          step.shake = 1;
          if (step.stood > 0.38) {
            step.falling = true;
            sfx('clack');
          }
        }
      }
      act.steps = act.steps.filter((step) => step.y < COLUMN.y + COLUMN.h + 12);
      box.platforms = act.steps.filter((step) => !step.falling);
      // New steps at the top as it sinks; then the landing, and no more.
      const top = Math.min(...act.steps.filter((s) => !s.falling).map((s) => s.y));
      if (!landing && top >= COLUMN.y - 4) {
        if (t >= LANDING_AT) {
          landing = { x: COLUMN.x, y: top - GAP, w: COLUMN.w, kind: 'step', shake: 0, stood: 0, falling: false, vy: 0 };
          act.steps.push(landing);
          act.door = { x: COLUMN.x + COLUMN.w / 2, y: landing.y, open: false };
        } else {
          newStep(top - GAP);
        }
      }
      if (act.door) act.door.y = landing.y;
      // The Deep throws you back up if you touch it.
      if (soul.y > deep.top(soul.x) - 3) {
        soul.vy = -THROWN_UP;
        soul.platform = null;
      }
      const pad = 8;
      const inWell = (px) => Math.min(COLUMN.x + COLUMN.w - pad, Math.max(COLUMN.x + pad, px));
      if (t < LANDING_AT + 0.5) {
        // His strings, dropped straight down the well: at you, and later a
        // second beside it.
        if (t >= nextString && t < 15) {
          nextString = t + (t < 11 ? 1.35 : 1.7);
          const x = inWell(soul.x + rand(-6, 6));
          push(new Line({ x, y: COLUMN.y - 2, angle: Math.PI / 2, length: 170, thickness: 2, warn: 0.8, life: 0.45, color: C.string }));
        }
        // His hand, up out of the Deep, for wherever you are.
        if (t >= nextHand && t < 14.5) {
          nextHand = t + 2.4;
          const side = soul.x < COLUMN.x + COLUMN.w / 2 ? 1 : -1;
          push(new GrabHand({
            from: { x: inWell(soul.x + side * rand(20, 34)), y: COLUMN.y + COLUMN.h + 30 },
            to: { x: inWell(soul.x), y: Math.min(DEEP_TOP - 14, Math.max(COLUMN.y + 12, soul.y)) },
            warn: 0.85, bend: side,
            onClench: () => sfx('clack'),
          }));
        }
        // Sandbags down the well.
        if (t >= nextBag && t < 18) {
          nextBag = t + 1.2;
          push(new Sandbag({ x: inWell(soul.x + rand(-14, 14)), warn: 0.75 }));
        }
        // Strings slicing across, slantwise, at your height.
        if (t >= nextSlice) {
          nextSlice = t + 1.8;
          const left = Math.random() < 0.5;
          const tilt = rand(0.22, 0.42) * (Math.random() < 0.5 ? -1 : 1);
          // From one wall, through where you are now.
          const x = left ? COLUMN.x : COLUMN.x + COLUMN.w;
          const y = soul.y - Math.tan(tilt) * Math.abs(soul.x - x);
          push(new Line({ x, y, angle: left ? tilt : Math.PI - tilt, length: 150, thickness: 2, warn: 0.8, life: 0.4, color: C.string }));
        }
      }
      // The top. The door opens: nothing. Then it comes down on you.
      if (!opened && t >= DOOR_AT && act.door) {
        opened = true;
        act.door.open = true;
        sfx('flare');
      }
      if (door < DOORS.length && t >= DOORS[door].at && landing) {
        const holeW = 26;
        const warn = 0.82 - door * 0.05;
        // Never further than you can walk before it lands (heavy, you walk
        // at 72 a second), and the first one never where you already are.
        const reach = 72 * (warn + DOORS[door].fall) - 14;
        let holeX;
        for (let tries = 0; tries < 20; tries++) {
          holeX = rand(COLUMN.x + 8, COLUMN.x + COLUMN.w - holeW - 8);
          const off = Math.abs(holeX + holeW / 2 - soul.x);
          if (off <= reach && (door > 0 || off > 30) && (lastHole === null || Math.abs(holeX - lastHole) > 30)) break;
        }
        lastHole = holeX;
        push(new FallingDoor({ holeX, holeW, landY: landing.y, warn, fall: DOORS[door].fall }));
        door++;
      }
    },

    // Out of the well: back to your own shadow, the stairwell gone.
    finish(bullets, box, soul) {
      well.done = true;
      deep.done = true;
      delete box.platforms;
      delete box.hint;
      soul.mode = SOUL_MODES.normal;
      soul.modeName = 'normal';
      soul.modeFlash = 0.4;
      soul.platform = null;
      soul.vy = 0;
    },
  };
}
