import { TILE_SIZE as T } from '../config.js';
import { makeSprite } from '../engine/sprite.js';
import { ENEMIES } from '../data/enemies/index.js';
import { sfx } from '../audio/music.js';

const SPEED = 18; // pixels per second
const TOUCH_DISTANCE = 16;
// After you run from a fight, the enemy blinks and ignores you this long.
const COOLDOWN_SECONDS = 2.5;

// How each enemy moves around a room, picked in the Room Editor. `patrol` is
// the leftmost and rightmost tile for the ones that walk.
export const BEHAVIOURS = {
  patrol: 'Walks back and forth',
  still: 'Stays put',
  wander: 'Wanders about',
  chase: 'Chases you when it sees you',
  ambush: 'Hides, jumps out, then chases',
  pounce: 'Hides, then pounces on you',
  disguise: 'In disguise, then pounces',
};
// Behaviours that start out hidden or disguised, waiting for you to come close.
const LURKING = new Set(['ambush', 'pounce', 'disguise']);

// Hidden and disguised enemies spring when you come within this many tiles,
// from any side. A room can set its own `reach` for each one.
export const DEFAULT_REACH = { ambush: 2, pounce: 4, disguise: 4 };
// Chasers notice you from this far away.
const SIGHT_DISTANCE = 64;
// Leaping out: an ambusher hops this far to the side. A pouncer makes a big,
// high leap that homes in on you while it's in the air.
const LEAP_DISTANCE = 20;
const LEAP_SECONDS = 0.45;
const LEAP_HEIGHT = 14;
const POUNCE_SECONDS = 0.65;
const POUNCE_HEIGHT = 30;
// Chasing is slower than walking, so you can always get away.
const CHASE_SPEED = 40;
// The "!" shows this long after they spot you.
const ALERT_SECONDS = 0.9;
// Hidden ones lean out to peek now and then, so a sharp eye can spot them.
const PEEK_EVERY_SECONDS = 3.5;
const PEEK_SECONDS = 0.5;
const PEEK_DISTANCE = 5;
// A disguise mostly shows its first frame; the others (a tongue flick, a
// blink) flash by this often, for this long.
const TELL_EVERY_SECONDS = 2.6;
const TELL_SECONDS = 0.35;
// Wanderers pause between strolls, and stay within this many tiles up or down.
const WANDER_PAUSE = [0.8, 2.2];
const WANDER_RANGE_Y = 1.5;

// The feet-level box used to keep a moving enemy out of walls.
const BODY_HALF_WIDTH = 5;
const BODY_HEIGHT = 5;

const rand = (min, max) => min + Math.random() * (max - min);

// An enemy out in a room. Touching it starts a battle. How it moves is its
// `behaviour` (see BEHAVIOURS); older rooms may say `ambush: true` instead.
// `reach` is how many tiles away a hidden or disguised one springs from.
export class Npc {
  // `art` is optional: by default the enemy looks like its own battle sprite.
  constructor({ art, enemy, x, y, patrol, behaviour, ambush = false, reach = null }) {
    const source = ENEMIES[art] ?? ENEMIES[enemy];
    if (!source) throw new Error(`Unknown enemy '${enemy}' in a room's npcs`);
    const { rows, palette } = source.sprite;
    this.sprite = makeSprite(rows, palette);
    this.enemy = enemy;
    this.behaviour = behaviour ?? (ambush ? 'ambush' : 'patrol');
    if (!BEHAVIOURS[this.behaviour]) throw new Error(`Unknown behaviour '${this.behaviour}' for ${enemy}`);
    // A disguised enemy wears its `disguise` art if it has some (see columneon.js).
    const disguise = ENEMIES[enemy]?.disguise;
    this.disguiseFrames = disguise?.frames.map((frame) => makeSprite(frame, disguise.palette)) ?? null;

    // Like the player, (x, y) is the point under the feet.
    this.x = (x + 0.5) * T;
    this.y = (y + 1) * T;
    this.homeY = this.y;
    this.minX = (patrol[0] + 0.5) * T;
    this.maxX = (patrol[1] + 0.5) * T;
    this.direction = 1;
    this.time = Math.random() * 10;
    this.cooldown = 0;

    this.lurking = LURKING.has(this.behaviour);
    this.springDistance = (reach ?? DEFAULT_REACH[this.behaviour] ?? 0) * T;
    this.peekSide = Math.random() < 0.5 ? -1 : 1;
    this.leap = null;
    this.chasing = false;
    this.alert = 0;
    this.wander = { target: null, pause: rand(...WANDER_PAUSE) };
  }

  startCooldown() {
    this.cooldown = COOLDOWN_SECONDS;
  }

  get sortY() {
    return this.y;
  }

  update(dt, player, room) {
    this.time += dt;
    this.cooldown = Math.max(0, this.cooldown - dt);
    this.alert = Math.max(0, this.alert - dt);
    const distance = Math.hypot(player.x - this.x, player.y - this.y);

    if (this.lurking) {
      if (distance < this.springDistance) this.spring(player, room);
      return;
    }
    if (this.leap) {
      this.updateLeap(dt, player);
      return;
    }
    if (this.chasing) {
      if (this.cooldown <= 0) this.chase(dt, player, room);
      return;
    }

    if (this.behaviour === 'chase' && distance < SIGHT_DISTANCE && this.cooldown <= 0) {
      this.alert = ALERT_SECONDS;
      sfx('ambush');
      this.chasing = true;
    } else if (this.behaviour === 'patrol' || this.behaviour === 'chase') {
      this.patrol(dt);
    } else if (this.behaviour === 'wander') {
      this.stroll(dt, room);
    }
  }

  patrol(dt) {
    this.x += this.direction * SPEED * dt;
    if (this.x > this.maxX) {
      this.x = this.maxX;
      this.direction = -1;
    } else if (this.x < this.minX) {
      this.x = this.minX;
      this.direction = 1;
    }
  }

  // Walks to a random nearby spot, pauses, and picks another.
  stroll(dt, room) {
    const wander = this.wander;
    if (!wander.target) {
      wander.pause -= dt;
      if (wander.pause > 0) return;
      wander.target = { x: rand(this.minX, this.maxX), y: this.homeY + rand(-WANDER_RANGE_Y, WANDER_RANGE_Y) * T };
    }
    const dx = wander.target.x - this.x;
    const dy = wander.target.y - this.y;
    const distance = Math.hypot(dx, dy);
    if (distance < 1 || !this.step(room, (dx / distance) * SPEED * dt, (dy / distance) * SPEED * dt)) {
      wander.target = null;
      wander.pause = rand(...WANDER_PAUSE);
    }
  }

  // Leaves its hiding place or drops its disguise. Ambushers hop out to the side
  // nearest you (or the other side, if that's blocked) and then give chase;
  // pouncers and the disguised leap right at you.
  spring(player, room) {
    this.lurking = false;
    this.alert = ALERT_SECONDS;
    sfx('ambush');
    if (this.behaviour === 'ambush') {
      const toward = Math.sign(player.x - this.x) || this.peekSide;
      const down = Math.sign(player.y - this.y) * LEAP_DISTANCE * 0.6;
      const landing = [toward, -toward]
        .map((side) => ({ x: this.x + side * LEAP_DISTANCE, y: this.y + down }))
        .find((spot) => !this.blockedAt(room, spot.x, spot.y)) ?? { x: this.x, y: this.y };
      this.leap = { fromX: this.x, fromY: this.y, toX: landing.x, toY: landing.y, t: 0, seconds: LEAP_SECONDS, height: LEAP_HEIGHT };
    } else {
      this.leap = { fromX: this.x, fromY: this.y, toX: player.x, toY: player.y, t: 0, seconds: POUNCE_SECONDS, height: POUNCE_HEIGHT, homing: true };
    }
  }

  updateLeap(dt, player) {
    const leap = this.leap;
    if (leap.homing) {
      leap.toX = player.x;
      leap.toY = player.y;
    }
    leap.t = Math.min(leap.seconds, leap.t + dt);
    const k = leap.t / leap.seconds;
    this.x = leap.fromX + (leap.toX - leap.fromX) * k;
    this.y = leap.fromY + (leap.toY - leap.fromY) * k;
    if (k >= 1) {
      // Landed: if you dodged the pounce, it chases you instead.
      this.leap = null;
      this.chasing = true;
    }
  }

  // Heads straight for the player, sliding along walls rather than through them.
  chase(dt, player, room) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distance = Math.hypot(dx, dy);
    if (distance < 1) return;
    this.step(room, (dx / distance) * CHASE_SPEED * dt, (dy / distance) * CHASE_SPEED * dt);
  }

  // Moves by (dx, dy) one axis at a time, stopping at walls. Returns whether it moved.
  step(room, dx, dy) {
    let moved = false;
    if (!this.blockedAt(room, this.x + dx, this.y)) { this.x += dx; moved = true; }
    if (!this.blockedAt(room, this.x, this.y + dy)) { this.y += dy; moved = true; }
    return moved;
  }

  blockedAt(room, x, y) {
    return room.collides(Math.round(x) - BODY_HALF_WIDTH, Math.round(y) - BODY_HEIGHT, Math.round(x) + BODY_HALF_WIDTH, Math.round(y));
  }

  // Height off the ground mid-leap.
  get z() {
    if (!this.leap) return 0;
    return Math.round(Math.sin((this.leap.t / this.leap.seconds) * Math.PI) * this.leap.height);
  }

  touches(player) {
    if (this.lurking || this.leap || this.cooldown > 0) return false;
    return Math.hypot(this.x - player.x, this.y - player.y) < TOUCH_DISTANCE;
  }

  draw(ctx, camera) {
    if (this.cooldown > 0 && Math.floor(this.cooldown * 10) % 2 === 0) return;
    let x = Math.round(this.x) - camera.x;
    const y = Math.round(this.y) - camera.y;

    // Still in disguise: stand stock-still, like the pillar it's pretending to be.
    if (this.lurking && this.behaviour === 'disguise' && this.disguiseFrames) {
      const frames = this.disguiseFrames;
      const telling = frames.length > 1 && this.time % TELL_EVERY_SECONDS < TELL_SECONDS;
      const frame = telling ? frames[1 + (Math.floor(this.time / TELL_EVERY_SECONDS) % (frames.length - 1))] : frames[0];
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fillRect(x - 7, y - 3, 14, 3);
      ctx.drawImage(frame, x - Math.floor(frame.width / 2), y - frame.height);
      return;
    }

    if (this.lurking && this.time % PEEK_EVERY_SECONDS < PEEK_SECONDS) x += this.peekSide * PEEK_DISTANCE;
    const bob = Math.round(Math.sin(this.time * 3) * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fillRect(x - 5, y - 3, 10, 3);
    const top = y - this.sprite.height - 2 + bob - this.z;
    ctx.drawImage(this.sprite, x - Math.floor(this.sprite.width / 2), top);
    if (this.alert > 0) drawAlert(ctx, x, top - 12);
  }
}

// A "!" in a little dark box.
function drawAlert(ctx, x, y) {
  ctx.fillStyle = '#120c1c';
  ctx.fillRect(x - 3, y, 6, 11);
  ctx.fillStyle = '#fff';
  ctx.fillRect(x - 1, y + 2, 2, 5);
  ctx.fillRect(x - 1, y + 8, 2, 2);
}
